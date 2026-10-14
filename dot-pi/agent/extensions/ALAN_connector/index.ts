/**
 * ALAN_connector — /ALAN_connector (fully self-contained TypeScript implementation)
 *
 * This extension is intentionally shipped as a single file:
 *   ~/.pi/agent/extensions/ALAN_connector/index.ts
 *
 * It ships as a single file. At runtime it may create one local secret file:
 *   api_config.json next to this index.ts, to persist the API key after first use.
 *
 * It does NOT use:
 *   - PowerShell scripts
 *   - external .ps1 / .cmd / .bat helpers
 *   - probe_result.json
 *   - external log files
 *
 * What it does:
 *   1. Calls GET {baseUrl}/models directly from Node.
 *   2. Lets the user pick a model in a TUI picker (or defaults to the first model in headless mode).
 *   3. Writes providers.alan into ~/.pi/agent/models.json.
 *   4. Sets defaultProvider/defaultModel in ~/.pi/agent/settings.json.
 *   5. Creates timestamped .bak_yyyyMMdd_HHmmss backups before writing, unless the
 *      latest existing backup already has identical content (avoids redundant backups).
 *   6. Hot-applies the selected model to the running session when possible.
 *   7. Reuses the stored API key from api_config.json (or existing models.json) on later runs.
 */

import type { ExtensionAPI, KeybindingsManager } from "@earendil-works/pi-coding-agent";
import { existsSync, readFileSync, writeFileSync, copyFileSync, unlinkSync, readdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { env } from "node:process";
import { fileURLToPath } from "node:url";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_BASE_URL = "https://alan.univ-grenoble-alpes.fr/api";
const DEFAULT_CONTEXT_WINDOW = 32_768;
const DEFAULT_MAX_TOKENS = 32_768;
const FETCH_TIMEOUT_MS = 20_000;

const EXT_DIR = fileURLToPath(new URL(".", import.meta.url));
const API_CONFIG_PATH = join(EXT_DIR, "api_config.json");

const CTX_NAMES = [
  "context_length",
  "context_window",
  "contextWindow",
  "max_context_length",
  "n_ctx",
  "max_model_len",
  "max_position_embeddings",
];
const OUT_NAMES = [
  "max_tokens",
  "max_completion_tokens",
  "max_output_tokens",
  "maxTokens",
  "max_new_tokens",
];
const SUB_KEYS = ["meta", "info", "model_info", "params", "parameters", "openai"];

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface ProbeModel {
  id: string;
  name?: string;
  contextWindow: number;
  maxTokens: number;
}

interface AlanModelEntry {
  id: string;
  name: string;
  contextWindow: number;
  maxTokens: number;
}

interface AlanProvider {
  baseUrl: string;
  api: string;
  apiKey: string;
  models: AlanModelEntry[];
  [key: string]: unknown;
}

interface ModelsJson {
  providers?: Record<string, unknown>;
  [key: string]: unknown;
}

interface SettingsJson {
  [key: string]: unknown;
}

class AlanHttpError extends Error {
  status?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Small utilities
// ─────────────────────────────────────────────────────────────────────────────
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanBaseUrl(): string {
  const raw = (env.ALAN_BASE_URL ?? DEFAULT_BASE_URL).trim();
  if (!raw) return DEFAULT_BASE_URL;
  return raw.replace(/\/+$/, "");
}

function nowStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function contextKText(contextWindow: number): string {
  const k = Math.round((contextWindow / 1024) * 10) / 10;
  return Number.isInteger(k) ? `(${k}k)` : `(${k.toFixed(1)}k)`;
}

function displayModelName(id: string, name: string | undefined, contextWindow: number): string {
  const base =
    name && name !== id
      ? name.replace(/\s*\(\d+(?:\.\d+)?k\)\s*$/, "")
      : id;
  return base === id ? `${id} ${contextKText(contextWindow)}` : `${base}  (${id}) ${contextKText(contextWindow)}`;
}

function pickLabel(model: ProbeModel): string {
  const k = Math.round((model.contextWindow / 1024) * 10) / 10;
  const ctx = Number.isInteger(k) ? `${k}k` : `${k.toFixed(1)}k`;
  const base = model.name && model.name !== model.id ? `${model.name}  (${model.id})` : model.id;
  return `${base} (${ctx})`;
}

function toPositiveInt(value: unknown): number | null {
  if (typeof value === "number") {
    if (Number.isFinite(value) && value > 0) return Math.floor(value);
    return null;
  }
  if (typeof value === "string") {
    const n = Number(value);
    if (Number.isFinite(n) && n > 0) return Math.floor(n);
  }
  return null;
}

function extractLimit(entry: unknown, names: string[], fallback: number): number {
  if (!isRecord(entry)) return fallback;

  for (const name of names) {
    const v = toPositiveInt(entry[name]);
    if (v !== null) return v;
  }

  for (const subKey of SUB_KEYS) {
    const sub = entry[subKey];
    if (!isRecord(sub)) continue;
    for (const name of names) {
      const v = toPositiveInt(sub[name]);
      if (v !== null) return v;
    }
  }

  return fallback;
}

// ─────────────────────────────────────────────────────────────────────────────
// HTTP probe
// ─────────────────────────────────────────────────────────────────────────────
async function fetchModels(baseUrl: string, apiKey: string | undefined): Promise<unknown> {
  const fetchFn = (globalThis as { fetch?: unknown }).fetch;
  if (typeof fetchFn !== "function") {
    throw new Error("Node fetch is not available in this runtime.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const res = await (fetchFn as (url: string, init: any) => Promise<any>)(`${baseUrl}/models`, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = new Error(`Alan API request failed with HTTP ${res.status}`) as AlanHttpError;
      err.status = res.status;
      throw err;
    }

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Alan /models response was not valid JSON.");
    }
  } catch (e) {
    if (e instanceof AlanHttpError) throw e;

    const maybeStatus = (e as any)?.status ?? (e as any)?.cause?.status;
    if (typeof maybeStatus === "number") {
      const err = new Error(`Alan API request failed with HTTP ${maybeStatus}`) as AlanHttpError;
      err.status = maybeStatus;
      throw err;
    }

    if ((e as Error).name === "AbortError") {
      throw new Error(`Alan /models request timed out after ${FETCH_TIMEOUT_MS / 1000} s.`);
    }

    throw e;
  } finally {
    clearTimeout(timer);
  }
}

function extractModels(response: unknown): ProbeModel[] {
  let list: unknown[] | undefined;

  if (Array.isArray(response)) {
    list = response;
  } else if (isRecord(response)) {
    if (Array.isArray(response.data)) list = response.data as unknown[];
    else if (Array.isArray(response.models)) list = response.models as unknown[];
  }

  if (!list || list.length === 0) {
    throw new Error("Alan /models returned no usable model list.");
  }

  const models: ProbeModel[] = [];
  for (const entry of list) {
    if (!isRecord(entry) || typeof entry.id !== "string" || !entry.id.trim()) continue;

    models.push({
      id: entry.id,
      name: typeof entry.name === "string" ? entry.name : undefined,
      contextWindow: extractLimit(entry, CTX_NAMES, DEFAULT_CONTEXT_WINDOW),
      maxTokens: extractLimit(entry, OUT_NAMES, DEFAULT_MAX_TOKENS),
    });
  }

  if (models.length === 0) {
    throw new Error("Alan /models response contained no model entries with a valid id.");
  }

  return models;
}

// ─────────────────────────────────────────────────────────────────────────────
// Config writer
// ─────────────────────────────────────────────────────────────────────────────
function loadStoredApiKey(): string | undefined {
  try {
    if (!existsSync(API_CONFIG_PATH)) return undefined;
    const raw = readFileSync(API_CONFIG_PATH, "utf8").trim();
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { apiKey?: unknown };
    if (typeof parsed.apiKey === "string" && parsed.apiKey.trim()) {
      return parsed.apiKey.trim();
    }
  } catch {
    // Ignore unreadable/corrupt local key file; the command can still ask for a key.
  }
  return undefined;
}

function saveStoredApiKey(key: string): void {
  try {
    // mode 0o600 is applied on POSIX systems; on Windows the file remains user-local.
    writeFileSync(API_CONFIG_PATH, JSON.stringify({ apiKey: key }, null, 2) + "\n", { encoding: "utf8", mode: 0o600 });
  } catch {
    // Non-fatal: the connector can still continue even if persistence fails.
  }
}

function loadExistingProviderKey(): string | undefined {
  try {
    const agentDir = resolvePiAgentDir();
    const modelsPath = join(agentDir, "models.json");
    if (!existsSync(modelsPath)) return undefined;
    const raw = readFileSync(modelsPath, "utf8").trim();
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { providers?: { alan?: { apiKey?: unknown } } };
    const key = parsed.providers?.alan?.apiKey;
    if (typeof key === "string" && key.trim()) return key.trim();
  } catch {
    // Ignore unreadable provider config; the command can still ask for a key.
  }
  return undefined;
}

function resolvePiAgentDir(): string {
  if (env.OBSERVATION_ONLY_DIR?.trim()) return env.OBSERVATION_ONLY_DIR.trim();
  if (env.PI_CODING_AGENT_DIR?.trim()) return env.PI_CODING_AGENT_DIR.trim();
  if (env.USERPROFILE?.trim()) return join(env.USERPROFILE.trim(), ".pi", "agent");
  if (env.HOME?.trim()) return join(env.HOME.trim(), ".pi", "agent");
  throw new Error(
    "Cannot resolve pi agent dir: OBSERVATION_ONLY_DIR, PI_CODING_AGENT_DIR, USERPROFILE and HOME are all unset."
  );
}

function readJson<T>(path: string, fallback: T): T {
  if (!existsSync(path)) return fallback;
  const raw = readFileSync(path, "utf8");
  if (raw.trim() === "") return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    throw new Error(`Cannot parse ${path}: ${(e as Error).message}`);
  }
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function latestBackupFor(path: string): string | null {
  const dir = dirname(path);
  const base = basename(path);
  try {
    const candidates = readdirSync(dir)
      .filter((name) => name.startsWith(`${base}.bak_`) && /\.bak_\d{8}_\d{6}$/.test(name))
      .sort()
      .reverse();
    if (candidates.length === 0) return null;
    return join(dir, candidates[0]);
  } catch {
    return null;
  }
}

function filesHaveSameContent(a: string, b: string): boolean {
  try {
    return readFileSync(a).equals(readFileSync(b));
  } catch {
    return false;
  }
}

function backupFile(path: string, timestamp: string): string | null {
  if (!existsSync(path)) return null;

  const latest = latestBackupFor(path);
  if (latest && filesHaveSameContent(path, latest)) {
    return latest;
  }

  const bak = `${path}.bak_${timestamp}`;
  copyFileSync(path, bak);
  return bak;
}

function restoreFile(backup: string | null, target: string): void {
  if (backup) {
    if (existsSync(backup)) {
      copyFileSync(backup, target);
    } else {
      try {
        unlinkSync(target);
      } catch {
        // ignore
      }
    }
  } else {
    try {
      unlinkSync(target);
    } catch {
      // ignore
    }
  }
}

function writeAlanConfig(
  agentDir: string,
  baseUrl: string,
  apiKey: string,
  models: ProbeModel[],
  selectedId: string
): { modelsPath: string; settingsPath: string; backups: string[] } {
  if (!baseUrl) throw new Error("baseUrl is required.");
  if (!apiKey) throw new Error("apiKey is required.");

  const modelsPath = join(agentDir, "models.json");
  const settingsPath = join(agentDir, "settings.json");

  const modelsJson = readJson<ModelsJson>(modelsPath, { providers: {} });
  if (!isRecord(modelsJson)) throw new Error("models.json root must be an object.");
  if (!isRecord(modelsJson.providers) || Array.isArray(modelsJson.providers)) {
    modelsJson.providers = {};
  }

  const settingsJson = readJson<SettingsJson>(settingsPath, {});
  if (!isRecord(settingsJson)) throw new Error("settings.json root must be an object.");

  const newModels: AlanModelEntry[] = models.map((m) => ({
    id: m.id,
    name: displayModelName(m.id, m.name, m.contextWindow),
    contextWindow: m.contextWindow,
    maxTokens: m.maxTokens,
  }));

  const selected = newModels.find((m) => m.id === selectedId);
  if (!selected) {
    throw new Error(`Selected model '${selectedId}' is not in the probed model list.`);
  }

  const previousAlan = modelsJson.providers?.["alan"];
  const alan: AlanProvider = isRecord(previousAlan) ? { ...(previousAlan as AlanProvider) } : {};
  for (const key of ["baseUrl", "api", "apiKey", "models"]) {
    delete alan[key];
  }
  Object.assign(alan, {
    baseUrl,
    api: "openai-completions",
    apiKey,
    models: newModels,
  });

  modelsJson.providers = {
    ...(modelsJson.providers ?? {}),
    alan,
  };

  settingsJson.defaultProvider = "alan";
  settingsJson.defaultModel = selectedId;

  // Pre-write validation
  if (newModels.length === 0) throw new Error("No models to write.");
  for (const m of newModels) {
    if (m.contextWindow <= 0 || m.maxTokens <= 0) {
      throw new Error(`Model '${m.id}' has non-positive contextWindow/maxTokens.`);
    }
  }

  const timestamp = nowStamp();
  const modelsBackup = backupFile(modelsPath, timestamp);
  const settingsBackup = backupFile(settingsPath, timestamp);

  try {
    writeJson(modelsPath, modelsJson);
    writeJson(settingsPath, settingsJson);
  } catch (e) {
    restoreFile(modelsBackup, modelsPath);
    restoreFile(settingsBackup, settingsPath);
    throw new Error(`Failed to write pi config: ${(e as Error).message}`);
  }

  // Post-write verification
  try {
    const modelsAfter = readJson<ModelsJson>(modelsPath, {});
    const settingsAfter = readJson<SettingsJson>(settingsPath, {});
    const alanAfter = modelsAfter.providers?.["alan"];

    const ok =
      isRecord(alanAfter) &&
      alanAfter.baseUrl === baseUrl &&
      alanAfter.api === "openai-completions" &&
      Array.isArray(alanAfter.models) &&
      alanAfter.models.some((m: any) => m.id === selectedId) &&
      settingsAfter.defaultProvider === "alan" &&
      settingsAfter.defaultModel === selectedId;

    if (!ok) throw new Error("post-write verification failed");
  } catch (e) {
    restoreFile(modelsBackup, modelsPath);
    restoreFile(settingsBackup, settingsPath);
    throw new Error(`Post-write verification failed; previous config restored: ${(e as Error).message}`);
  }

  return {
    modelsPath,
    settingsPath,
    backups: [modelsBackup, settingsBackup].filter((x): x is string => typeof x === "string"),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// TUI model picker
// ─────────────────────────────────────────────────────────────────────────────
function modelPicker(
  models: ProbeModel[],
  theme: any,
  kb: KeybindingsManager,
  tui: any,
  startIndex: number,
  done: (index?: number) => void
): any {
  const MAX_VISIBLE = 10;
  let index = startIndex;

  const visibleStart = (): number =>
    models.length <= MAX_VISIBLE
      ? 0
      : Math.max(0, Math.min(index - Math.floor(MAX_VISIBLE / 2), models.length - MAX_VISIBLE));

  return {
    render() {
      const start = visibleStart();
      const end = Math.min(models.length, start + MAX_VISIBLE);
      const lines = [theme.fg("accent", theme.bold("Select ALAN model"))];

      for (let i = start; i < end; i++) {
        const sel = i === index;
        lines.push(
          `${sel ? theme.fg("accent", "› ") : "  "}${sel ? theme.fg("accent", pickLabel(models[i])) : theme.fg("text", pickLabel(models[i]))}`
        );
      }

      lines.push(theme.fg("dim", `↑/↓ navigate · Enter select · Esc cancel (${models.length} model(s))`));
      return lines;
    },
    invalidate() {
      tui.requestRender();
    },
    handleInput(data: string) {
      if (kb.matches(data, "tui.select.up")) {
        index = index <= 0 ? models.length - 1 : index - 1;
      } else if (kb.matches(data, "tui.select.down")) {
        index = (index + 1) % models.length;
      } else if (kb.matches(data, "tui.select.confirm")) {
        done(index);
        return;
      } else if (kb.matches(data, "tui.select.cancel")) {
        done(undefined);
        return;
      }
      tui.requestRender();
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Command
// ─────────────────────────────────────────────────────────────────────────────
export default function (pi: ExtensionAPI) {
  pi.registerCommand("ALAN_connector", {
    description:
      "Self-contained ALAN (UGA) service <> pi connector implemented entirely in TypeScript. " +
      "It probes {baseUrl}/models directly, shows a model picker below the prompt, then writes " +
      "providers.alan into ~/.pi/agent/models.json and defaultProvider/defaultModel into " +
      "~/.pi/agent/settings.json (with .bak_yyyyMMdd_HHmmss backups), and hot-applies the selected " +
      "model to the running session when possible. Uses no PowerShell scripts and no probe_result.json. " +
      "If no key is supplied, it reads the key from api_config.json next to this extension, then from " +
      "the existing providers.alan.apiKey value in models.json. Keys supplied as an argument or entered " +
      "interactively are saved to api_config.json so they are not required every time.",
    getArgumentCompletions: () => [],
    handler: async (args, ctx) => {
      const parts = args.trim().split(/\s+/).filter(Boolean);
      if (parts.length > 1 || (parts.length === 1 && parts[0].startsWith("-"))) {
        throw new Error("no arguments accepted — /ALAN_connector [<apiKey>]");
      }

      const argKey = parts.length === 1 ? parts[0] : undefined;
      const envKey = env.ALAN_API_KEY?.trim() || undefined;
      const storedKey = loadStoredApiKey();
      const providerKey = loadExistingProviderKey();

      let apiKey: string | undefined;
      let keySource: "arg" | "env" | "stored" | "provider" | "prompt" | undefined;

      if (argKey) {
        apiKey = argKey;
        keySource = "arg";
      } else if (envKey) {
        apiKey = envKey;
        keySource = "env";
      } else if (storedKey) {
        apiKey = storedKey;
        keySource = "stored";
      } else if (providerKey) {
        apiKey = providerKey;
        keySource = "provider";
      }

      const baseUrl = cleanBaseUrl();

      const doProbe = async (key?: string) => {
        const response = await fetchModels(baseUrl, key);
        return extractModels(response);
      };

      let models: ProbeModel[] | undefined;

      try {
        models = await doProbe(apiKey);
      } catch (e) {
        const status = (e as AlanHttpError).status;
        const authRejected = status === 401 || status === 403;
        const shouldAsk = ctx.hasUI && authRejected && (!apiKey || keySource !== "arg");

        if (shouldAsk) {
          const prompt = apiKey
            ? "The stored ALAN API key was rejected. Enter a new key:"
            : "ALAN (UGA) API key";
          const key = await ctx.ui.input(prompt, "");
          if (!key) {
            ctx.ui.notify("/ALAN_connector: no API key provided — nothing written", "warning");
            return;
          }
          apiKey = key.trim();
          keySource = "prompt";
          try {
            models = await doProbe(apiKey);
          } catch (e2) {
            throw new Error(`Alan API request failed after entering key: ${(e2 as Error).message}`);
          }
        } else if (authRejected) {
          if (!apiKey) {
            throw new Error("API key required — paste it as the only argument: /ALAN_connector <apiKey>");
          }
          throw new Error(`Alan API request failed with HTTP ${status} — check the API key.`);
        } else {
          throw e;
        }
      }

      // If the probe succeeded without a key, we still need one to make the provider usable in pi.
      if (!apiKey) {
        if (ctx.hasUI) {
          const key = await ctx.ui.input("ALAN (UGA) API key", "");
          if (!key) {
            ctx.ui.notify("/ALAN_connector: no API key provided — nothing written", "warning");
            return;
          }
          apiKey = key.trim();
          keySource = "prompt";
          try {
            models = await doProbe(apiKey);
          } catch (e2) {
            throw new Error(`Alan API request failed after entering key: ${(e2 as Error).message}`);
          }
        } else {
          throw new Error("API key required — paste it as the only argument: /ALAN_connector <apiKey>");
        }
      }

      if (!models) {
        throw new Error("No models were retrieved from Alan.");
      }

      // Persist explicitly provided keys so the next run does not need the key again.
      if ((keySource === "arg" || keySource === "prompt") && apiKey) {
        saveStoredApiKey(apiKey);
      }

      if (models.length === 0) {
        throw new Error("Alan /models returned no usable models.");
      }

      let modelIndex: number | undefined;
      if (ctx.hasUI && models.length > 1) {
        modelIndex = await ctx.ui.custom<number | undefined>(
          (tui: any, theme: any, kb: KeybindingsManager, done: (i?: number) => void) =>
            modelPicker(models, theme, kb, tui, 0, done)
        );
        if (modelIndex === undefined) {
          ctx.ui.notify("/ALAN_connector: cancelled — nothing written", "warning");
          return;
        }
      } else {
        modelIndex = 0;
      }

      const selected = models[modelIndex];
      if (!selected) {
        throw new Error(`Selected model index ${modelIndex} is not in the probed model list.`);
      }

      const agentDir = resolvePiAgentDir();
      writeAlanConfig(agentDir, baseUrl, apiKey, models, selected.id);

      let applied = false;
      try {
        const registry = (ctx as any).modelRegistry;
        await registry.refresh();
        const live = registry.find("alan", selected.id);
        if (live) {
          applied = Boolean(await pi.setModel(live));
        }
      } catch {
        // Non-fatal: config is already written.
      }

      const resultLine = applied
        ? `[ALAN_connector] ALAN active: ${selected.id} — no restart needed`
        : `[ALAN_connector] ALAN config written: ${selected.id} — open /model to select`;

      if (ctx.hasUI) {
        ctx.ui.setWidget("ALAN_connector", [`${resultLine} — self-contained TypeScript implementation`], {
          placement: "belowEditor",
        });
      } else {
        console.log(resultLine);
      }
    },
  });
}
