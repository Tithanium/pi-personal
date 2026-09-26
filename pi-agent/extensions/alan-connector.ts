/**
 * alan-connector.ts — /ALAN_connector pi command (gauntlet piece 1: argumentless — zero args or one raw API key)
 *
 * Deterministic connector between the ALAN (UGA) OpenAI-compatible service and the
 * pi harness. NO LLM connection of its own: it shells out to two standalone scripts
 * and only does pure HTTP probe + file ops.
 *
 *   .\alan_probe.ps1          — deterministic probe of GET {baseUrl}/models, model
 *                               selection (forced -> config match -> favorite -> first),
 *                               limits via the ctx/out alias lists (real field on Alan:
 *                               max_model_len; maxTokens fallback 32768). Writes
 *                               probe_result.json. Never prints the API key.
 *   .\alan_config_writer.ps1  — surgical pi-config writer: backs up
 *                               ~/.pi/agent/models.json + settings.json
 *                               (.bak_yyyyMMdd_HHmmss), merges the alan provider,
 *                               validates, writes, verifies. -DryRun shows diff,
 *                               -Restore restores the latest backup pair with SHA-256
 *                               verification. Touches nothing else (never skills/agents/
 *                               extensions/auth.json).
 *
 * Command invariants:
 *   - Stand-alone deterministic: pure HTTP probe + file ops. Never requires any LLM.
 *   - NEVVER prints the API key (probe console output only says present/absent; the
 *     key travels only inside probe_result.json -> models.json).
 *   - Errors are explicit and always mention the script paths involved.
 *
 * Arguments (args after /ALAN_connector — zero or exactly one):
 *   (none)         default flow: probe (alan_probe.ps1 reads the key from
 *                  config.local.ps1) + full write via alan_config_writer.ps1
 *                  (all models). Prints progress + summary + backup hashes.
 *   <apiKey>       exactly ONE token, a raw API key, forwarded to the probe as
 *                  alan_probe.ps1 --apiKey <key>. Documented contract for the
 *                  .ps1 (implemented by gauntlet piece 2): alan_probe.ps1
 *                  --apiKey <key> writes probe_result.json with
 *                  apiKeyPresent=true and that key. If the .ps1 does not support
 *                  --apiKey yet, the argument is still passed per contract.
 *   (error)        more than one token, or any token starting with '-' ->
 *                  "no arguments accepted — /ALAN_connector [<apiKey>]".
 *   All legacy subcommands (--list/--model/--dry-run/--restore/--help) are DELETED.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import type { ExecResult } from "@earendil-works/pi-coding-agent";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// ─────────────────────────────────────────────────────────────────────────────
// Paths — edit these if the ALAN toolkit moves.
// ─────────────────────────────────────────────────────────────────────────────
const ALAN_DIR = "C:/Users/connessn/Datas/02_RECHERCHE/11_all_AI/00_Harnesses_launch_ALAN";
const ALAN_PROBE_PS1 = join(ALAN_DIR, "alan_probe.ps1");
const ALAN_WRITER_PS1 = join(ALAN_DIR, "alan_config_writer.ps1");
const PROBE_RESULT_JSON = join(ALAN_DIR, "probe_result.json");

const PS_BASE = ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File"];
const PROBE_TIMEOUT_MS = 120_000; // GET /models timeout is 20 s inside the script; keep headroom
const WRITER_TIMEOUT_MS = 90_000;
const BAK_RE = /\.bak_\d{8}_\d{6}$/;
const BACKUP_CREATED_RE = /Backup created : (.+\.bak_\d{8}_\d{6})/g;

interface ProbeModel {
  id: string;
  name?: string;
  contextWindow: number;
  maxTokens: number;
}

interface ProbeResult {
  baseUrl: string;
  api: string;
  models: ProbeModel[];
  selectedModelId: string;
}

function sha256Of(filePath: string): string {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function loadProbeResult(): ProbeResult {
  if (!existsSync(PROBE_RESULT_JSON)) {
    throw new Error(
      `[alan-connector] probe result missing: ${PROBE_RESULT_JSON} ` +
        `(run the probe first: ${ALAN_PROBE_PS1})`
    );
  }
  const data = JSON.parse(readFileSync(PROBE_RESULT_JSON, "utf8")) as ProbeResult;
  if (!Array.isArray(data.models)) {
    throw new Error(`[alan-connector] ${PROBE_RESULT_JSON} has no "models" array (stale probe?).`);
  }
  return data;
}

function requireScripts(): void {
  for (const p of [ALAN_PROBE_PS1, ALAN_WRITER_PS1]) {
    if (!existsSync(p)) {
      throw new Error(`[alan-connector] script missing: ${p}`);
    }
  }
}

async function execPs(
  pi: ExtensionAPI,
  script: string,
  scriptArgs: string[],
  timeoutMs: number
): Promise<ExecResult> {
  return pi.exec("powershell.exe", [...PS_BASE, script, ...scriptArgs], { timeout: timeoutMs });
}

function relayOutput(res: ExecResult, label: string): void {
  const out = (res.stdout ?? "").trim();
  if (out) console.log(out);
  const err = (res.stderr ?? "").trim();
  if (err) console.log(`[alan-connector:${label} stderr] ${err}`);
}

function printBackupHashes(writerStdout: string): void {
  const bakFiles: string[] = [];
  for (const m of writerStdout.matchAll(BACKUP_CREATED_RE)) bakFiles.push(m[1]);
  if (bakFiles.length === 0) {
    console.log("  backups   : (none printed by writer — nothing backed up or stale files)");
    return;
  }
  for (const f of bakFiles) {
    try {
      console.log(`  backup    : ${f}`);
      console.log(`  SHA256    : ${sha256Of(f)}`);
    } catch (e) {
      console.log(`  SHA256    : <unreadable: ${(e as Error).message}>`);
    }
  }
}

function usage(): string {
  return [
    "/ALAN_connector [<apiKey>]",
    "",
    "  (no args)  probe Alan (key read from config.local.ps1) + write pi config",
    "             (backup first), then print selection + backup hashes + summary",
    "  <apiKey>   EXACTLY ONE token: the raw API key, forwarded to the probe as",
    "             alan_probe.ps1 --apiKey <key> (writes probe_result.json with",
    "             apiKeyPresent=true), then full write. The key is never printed.",
    "  (error)    more than one token, or any token starting with '-':",
    "             \"no arguments accepted — /ALAN_connector [<apiKey>]\"",
    "",
    `  probe  script: ${ALAN_PROBE_PS1}`,
    `  writer script: ${ALAN_WRITER_PS1}`,
  ].join("\n");
}

export default function (pi: ExtensionAPI) {
  pi.registerCommand("ALAN_connector", {
    description:
      "Deterministic ALAN (UGA) service <> pi connector. Probes https://alan.univ-grenoble-alpes.fr/api/models, " +
      "writes providers.alan into ~/.pi/agent/models.json + settings.json (backup first, .bak_yyyyMMdd_HHmmss). " +
      "Zero or one argument: no args = default flow (key read from config.local.ps1); one token = a raw API key " +
      "forwarded to alan_probe.ps1 --apiKey <key>. No subcommands (--list/--model/--dry-run/--restore deleted). " +
      "Never requires an LLM; never prints the API key.",
    getArgumentCompletions: () => {
      // Zero-or-one-arg command: the only argument is a raw API key (a secret), so
      // there is nothing meaningful to complete. No suggestions offered.
      return [];
    },
    handler: async (args, ctx) => {
      const parts = args.trim().split(/\s+/).filter(Boolean);
      const apiKey: string | undefined =
        parts.length === 1 && !parts[0].startsWith("-") ? parts[0] : undefined;
      if (parts.length > 1 || (parts.length === 1 && apiKey === undefined)) {
        // More than one token, or any token starting with '-': all legacy
        // subcommands (--list/--model/--dry-run/--restore/--help) are deleted.
        throw new Error("no arguments accepted — /ALAN_connector [<apiKey>]");
      }

      requireScripts();

      // default: probe + real write (backup first); with exactly one token the raw
      // API key is forwarded to the probe per contract: alan_probe.ps1 --apiKey <key>
      const probeArgs = apiKey !== undefined ? ["--apiKey", apiKey] : [];
      console.log(
        `[alan-connector] FULL RUN: probe ${ALAN_PROBE_PS1}` +
          (apiKey !== undefined ? " (key supplied via --apiKey)" : " (key read from config.local.ps1)") +
          ` then write via ${ALAN_WRITER_PS1}`
      );
      const pRes = await execPs(pi, ALAN_PROBE_PS1, probeArgs, PROBE_TIMEOUT_MS);
      relayOutput(pRes, "probe");
      if (pRes.killed || pRes.code !== 0) {
        // No usable key on Alan -> probe exits 1 after writing probe_result.json with
        // apiKeyPresent=false and its stderr carries the contract message. Surface THAT
        // exact text as the error the user sees (piece 2 round 2), instead of the wrap.
        const probeText = ((pRes.stderr ?? "") + "\n" + (pRes.stdout ?? "")).replace(/\s+/g, " ");
        if (/API key required/.test(probeText)) {
          throw new Error("API key required — paste it as the only argument: /ALAN_connector <apiKey>");
        }
        throw new Error(
          `[alan-connector] alan_probe.ps1 failed (exit ${pRes.code}${pRes.killed ? ", killed/timeout" : ""}). ` +
            `Script: ${ALAN_PROBE_PS1}. See alan_connector_probe.log next to it.`
        );
      }
      const probe = loadProbeResult();
      const sel = probe.models.find((m) => m.id === probe.selectedModelId);
      console.log(`[alan-connector] selected model: ${probe.selectedModelId}` +
        (sel ? ` (contextWindow=${sel.contextWindow}, maxTokens=${sel.maxTokens})` : ""));

      const wRes = await execPs(pi, ALAN_WRITER_PS1, [], WRITER_TIMEOUT_MS);
      relayOutput(wRes, "writer");
      if (wRes.killed || wRes.code !== 0) {
        throw new Error(
          `[alan-connector] alan_config_writer.ps1 failed (exit ${wRes.code}${wRes.killed ? ", killed/timeout" : ""}). ` +
            `Script: ${ALAN_WRITER_PS1}. Config was backed up first (restore manually from the .bak pair). ` +
            `See alan_config_writer.log next to it.`
        );
      }

      printBackupHashes(wRes.stdout);
      console.log(
        `[alan-connector] summary: providers.alan written with ${probe.models.length} model(s), ` +
          `defaultProvider=alan, defaultModel=${probe.selectedModelId}`
      );
      console.log(
        `[alan-connector] logs: ${join(ALAN_DIR, "alan_connector_probe.log")} and ${join(ALAN_DIR, "alan_config_writer.log")}`
      );
      ctx.ui.notify(`ALAN config written, model ${probe.selectedModelId}`, "info");
    },
  });
}
