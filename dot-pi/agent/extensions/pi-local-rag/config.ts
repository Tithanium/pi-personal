import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { configFile, getRagDir } from "./store.ts";
import { DEFAULT_TEXT_EXTS } from "./constants.ts";

export interface RagConfig {
  ragEnabled: boolean;
  ragTopK: number;
  ragScoreThreshold: number;
  ragAlpha: number; // 0 = pure vector, 1 = pure BM25
  extraExtensions: string[];   // user-added file extensions (e.g. [".cs", ".tex"])
  excludeExtensions: string[]; // extensions to drop from the default set
  trackedPaths: string[];      // absolute paths previously passed to /rag index
  excludePatterns: string[];   // gitignore-style path patterns
  // Opt IN to the BLOCKING subprocess dispatch from the before_agent_start
  // hook. Default false = the hook injects NOTHING (only stale-index
  // detection runs — the legacy inline auto-injection path was removed in
  // goal v3 PART 4 step 2). true enables the subprocess spawn (blocks the
  // turn), hard-capped by ragSubagentHookTimeoutMs (timeout/failure → the
  // hook injects nothing and never blocks the session).
  ragSubagentHookBlocking: boolean;
  ragSubagentHookTimeoutMs: number;
  // Injection subprocess selection. The before_agent_start hook dispatches to
  // the configured subprocess; every arm shares the SAME injection contract
  // (<rag-context>, display:false, run.ok success gate, empty → nothing, hard
  // overall timeout). Survivors of goal v3 PART 4 step 3: "D" (production),
  // "S" (smoke); "A"/"B"/"C"/"EF" were removed — normalizeRagSubprocess maps
  // any stored legacy value to "D" with one stderr note (never a removed
  // branch). The profile "okf-only" still wins over this value (see
  // effectiveSubprocess below).
  ragSubprocess: "D" | "S";
  // D-child reasoning level for the NEXT D run — written by `/rag effort
  // [level]`, read at the D call site (index.ts) and passed as spawn argv
  // `--thinking <level>`. Full pi enum: off, minimal, low, medium, high,
  // xhigh, max (`pi --help`); VALIDATION is per-model via
  // getSupportedThinkingLevels (unsupported model ⇒ ["off"], pi clamps).
  // Default "high" preserves the previously hard-coded D_THINKING_LEVEL.
  ragThinkingLevel: string;
  // Persistent D-child MODEL assignment (`/rag model [assignment]`, empty =
  // none). Re-validated against `ctx.modelRegistry.getAvailable()` on EVERY
  // run: an unavailable stored value falls back to the session model (stderr
  // line — never spawns an unknown model). Precedence: opts.model > ragModel
  // (if valid) > ctx.model > D_MODEL — see resolveDModel in subprocessD.ts.
  ragModel: string;
  // Persistent subagent dispatch PROFILE (`/rag subagent [name]`). One of
  // RAG_PROFILES names; invalid stored values fall back to "all-grep" + one
  // warn line (normalizeRagProfile). Dispatch (goal v3 PART 5, task 5):
  // "okf-only" WINS over ragSubprocess → the Okf child (subprocessOkf.ts) —
  // see effectiveSubprocess below; every other profile keeps the ragSubprocess
  // dispatch unchanged in index.ts (grep5's divergence is prompt-side only,
  // NOT wired as a separate pipeline).
  ragProfile: string;
}

/**
 * The three persistent `/rag subagent` dispatch profiles. `name` is what is
 * stored in ragProfile (case-insensitive on input); `label` is the display
 * text for the interactive picker.
 */
export interface RagProfile { name: string; label: string }
export const RAG_PROFILES: RagProfile[] = [
  { name: "okf-only",  label: "Okf only" },
  { name: "all-grep",  label: "All ressources grep" },
  { name: "grep5",     label: "Only 5 greps" },
];
export const DEFAULT_RAG_PROFILE = "all-grep";

export function defaultConfig(): RagConfig {
  return {
    ragEnabled: true, ragTopK: 5, ragScoreThreshold: 0.1, ragAlpha: 0.4,
    extraExtensions: [], excludeExtensions: [],
    trackedPaths: [], excludePatterns: [],
    ragSubagentHookBlocking: false, ragSubagentHookTimeoutMs: 120_000,
    ragSubprocess: "D",
    ragThinkingLevel: "high", // was the hard-coded D_THINKING_LEVEL — see /rag effort
    ragModel: "",                    // no persistent assignment — /rag model [assignment]
    ragProfile: DEFAULT_RAG_PROFILE, // okf-only | all-grep | grep5 — /rag subagent [name]
  };
}

/**
 * Result of the pure `/rag subagent [name]` reducer — the pick-list branch
 * (no arg) is shown by the handler as ctx.ui.select, never saved here; only
 * `set` names a profile the caller may persist, only `error` rejects input
 * (machine rule: no silent fallback on assignment).
 */
export type ProfileOutcome =
  | { kind: "show"; profile: string; line: string }
  | { kind: "set"; profile: string; line: string }
  | { kind: "error"; line: string };

/**
 * Pure `/rag subagent [name]` reducer: no arg → show the current profile +
 * the valid names; valid name (case-insensitive) → set (canonical casing);
 * anything else → error listing EVERY valid name. Mirrors resolveReasoning
 * (subprocessD.ts): every branch carries one printable line.
 */
export function resolveProfileChoice(input: string | undefined, current: string): ProfileOutcome {
  const raw = (input ?? "").trim();
  const valid = RAG_PROFILES.map((p) => p.name).join(", ");
  if (!raw) {
    return { kind: "show", profile: current, line: `subagent profile: ${current} (valid: ${valid})` };
  }
  const match = RAG_PROFILES.find((p) => p.name.toLowerCase() === raw.toLowerCase());
  if (match) {
    return {
      kind: "set",
      profile: match.name,
      // Truthfulness (goal v3 PART 5, task 5): the profile NOW drives
      // dispatch — okf-only switches the child, the others keep ragSubprocess.
      line: match.name === "okf-only"
        ? `subagent profile ${match.name} saved (ragProfile → persists; dispatch switches to the Okf-only child)`
        : `subagent profile ${match.name} saved (ragProfile → persists; dispatch unchanged — ragSubprocess continues)`,
    };
  }
  return { kind: "error", line: `invalid subagent profile "${raw}" — valid: ${valid} (case-insensitive)` };
}

/**
 * Read-time normalization of the STORED ragProfile (machine rule: an invalid
 * stored value never reaches behavior silently). Absent/empty key → the
 * default WITHOUT warning (a fresh config is normal); a NON-EMPTY unknown
 * value → automatic fallback to DEFAULT_RAG_PROFILE + `fellBack: true`, so
 * the caller prints exactly ONE warn line.
 */
export function normalizeRagProfile(raw: string | undefined): { profile: string; fellBack: boolean } {
  // String() coercion: the stored value comes from JSON — a hand-edited
  // "ragProfile": 5 (number) would throw a TypeError on .trim() and abort
  // the reader instead of falling back to the default.
  const stored = String(raw ?? "").trim();
  if (!stored) return { profile: DEFAULT_RAG_PROFILE, fellBack: false };
  const lower = stored.toLowerCase();
  if (RAG_PROFILES.some((p) => p.name === lower)) return { profile: lower, fellBack: false };
  return { profile: DEFAULT_RAG_PROFILE, fellBack: true };
}

/**
 * Pure profile → subprocess mapping — THE D5 dispatch contract (goal v3 PART
 * 5, task 5): profile "okf-only" WINS over the ragSubprocess config and
 * spawns the OKF-only child (label "Okf", subprocessOkf.ts); every other
 * profile (all-grep, grep5) keeps whatever ragSubprocess holds untouched
 * (default "D" — the thorough corpus researcher).
 * Exported so tests/smoke/run-okf-subprocess.mjs pins this mapping directly,
 * NOT by executing the hook; /rag status renders the SAME function, so the
 * widget can never claim a different subprocess than the hook will spawn.
 */
export function effectiveSubprocess(profile: string, ragSubprocess: string): string {
  return profile === "okf-only" ? "Okf" : ragSubprocess;
}

/**
 * Read-time normalization of the STORED ragSubprocess (goal v3 PART 4 step 3,
 * back-compat): the A/B/C/EF pipelines were REMOVED from the dispatch. A
 * stored legacy value in {A,B,C,EF} (any case) is treated as "D" (the
 * production researcher) with `fellBack: true`, so the caller prints exactly
 * ONE stderr note and dispatch never reaches a removed branch. "d"/"s" pass
 * through unchanged; an absent/null key quietly defaults to "D" (a fresh
 * config is normal); any other non-empty garbage also falls back with one
 * note. String() coercion (like normalizeRagProfile): a hand-edited
 * number-typed value must NEVER throw in the reader.
 */
const LEGACY_RAG_SUBPROCESS = new Set(["a", "b", "c", "ef"]);
export function normalizeRagSubprocess(raw: unknown): { sub: "D" | "S"; fellBack: boolean; stored?: string } {
  const stored = String(raw ?? "").trim();
  if (!stored) return { sub: "D", fellBack: false };
  const lower = stored.toLowerCase();
  // Canonical display casing: the status tag and every log line must print
  // "D"/"S", never the lowercased input.
  if (lower === "d") return { sub: "D", fellBack: false };
  if (lower === "s") return { sub: "S", fellBack: false };
  if (LEGACY_RAG_SUBPROCESS.has(lower)) return { sub: "D", fellBack: true, stored };
  return { sub: "D", fellBack: true, stored };
}

/**
 * ONE shared profile → effective-subprocess reader (critic finding 4): the
 * before_agent_start hook dispatch and the `/rag status` row must derive the
 * subprocess from the SAME composition — normalizeRagProfile + the pure
 * effectiveSubprocess mapping + the normalizeRagSubprocess read (a stored
 * legacy A/B/C/EF value — or NULL — resolves to "D", never to `null` and
 * never to a removed branch) — otherwise a hand-edited `"ragSubprocess":
 * null` shows status `null` while the hook would spawn "D". BOTH sites call
 * this; nothing else re-derives the value.
 */
export function effectiveFrom(
  config: Pick<RagConfig, "ragProfile" | "ragSubprocess">,
): { profile: string; fellBack: boolean; effective: string; sub: "D" | "S"; subFellBack: boolean; subStored?: string } {
  const norm = normalizeRagProfile(config.ragProfile);
  const sub = normalizeRagSubprocess(config.ragSubprocess);
  const effective = effectiveSubprocess(norm.profile, sub.sub);
  return {
    profile: norm.profile,
    fellBack: norm.fellBack,
    effective,
    sub: sub.sub,
    subFellBack: sub.fellBack,
    subStored: sub.stored,
  };
}

/**
 * The composed `subprocess=…` fragment of the `/rag status` "RAG injection:"
 * row — the status site's use of the shared effectiveFrom() reader (critic
 * finding 4: single source with the hook) plus the two truthfulness markers
 * (critic finding 1):
 *   - profile override: ` (ragSubprocess=X overridden by profile)` iff the
 *     PROFILE changed the value (compared against the normalized
 *     normalizeRagSubprocess value — the same read the hook dispatches on,
 *     so a hand-edited null/legacy value never claims a bogus override);
 *   - ` (hook inactive)` whenever ragSubagentHookBlocking !== true — the whole
 *     dispatch block sits behind that gate, so NO subprocess value would run
 *     and the widget must not print one as active.
 * Pure string composition → run-rag-commands.mjs asserts the composed tag.
 */
export function buildSubprocessStatusTag(
  config: Pick<RagConfig, "ragProfile" | "ragSubprocess" | "ragSubagentHookBlocking">,
): string {
  const { effective, sub } = effectiveFrom(config);
  const overridden = effective !== sub
    ? ` (ragSubprocess=${config.ragSubprocess} overridden by profile)`
    : "";
  const inactive = config.ragSubagentHookBlocking !== true ? " (hook inactive)" : "";
  return `subprocess=${effective}${overridden}${inactive}`;
}

/**
 * Minimal theme surface the `/rag status` row builders need — tests pass a
 * pass-through stub (`{ fg: (_c, s) => s }`). Declared with METHOD syntax on
 * purpose: ctx.ui.theme's `fg(color: ThemeColor, text: string)` is then
 * structurally assignable (bivariant parameters).
 */
export interface RagRowTheme { fg(color: string, text: string): string; }

/**
 * The `/rag status` "Subagent profile" row, extracted verbatim from the
 * status widget composition so run-rag-commands.mjs asserts the COMPOSED row
 * (label + value + profile meta + fallback note) — wiring previously
 * untested. Pure string composition; no dispatch/handler behavior change.
 */
export function buildProfileStatusRow(
  th: RagRowTheme,
  profile: { profile: string; fellBack: boolean },
  stored: string,
  metaLabel: string | undefined,
): string {
  const label = (k: string) => th.fg("dim", k.padEnd(18));
  const val = (v: string | number) => th.fg("success", String(v));
  return "  " + label("Subagent profile:") + val(profile.profile) +
    th.fg("dim", `  (${metaLabel ?? "?"})${profile.fellBack ? `  stored "${stored}" invalid — fell back` : ""}`);
}

export function loadConfig(): RagConfig {
  const cfgFile = configFile(getRagDir());
  if (!existsSync(cfgFile)) return defaultConfig();
  try {
    // Strip a UTF-8 BOM if present (this machine's live config.json has one
    // — JSON.parse throws on it, and the old catch silently fell back to
    // defaults, ignoring every live value).
    const parsed = JSON.parse(readFileSync(cfgFile, "utf-8").replace(/^\uFEFF/, ""));
    // Stale-key whitelist (goal v3 PART 4 step 5): the schema was shrunk to
    // the D/S/Okf surface — keys of REMOVED pipelines (and any unknown junk)
    // are silently ignored instead of surviving the old spread. A stored
    // config that still carries stale keys loads fine and yields EXACTLY the
    // current default key set (known overrides applied, missing keys from
    // defaults); the live config file itself is never rewritten by a read.
    const defaults = defaultConfig() as unknown as Record<string, unknown>;
    const src: Record<string, unknown> =
      parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed as Record<string, unknown>
        : {};
    const picked: Record<string, unknown> = {};
    for (const key of Object.keys(defaults)) {
      if (key in src && src[key] !== undefined) picked[key] = src[key];
    }
    return { ...defaults, ...picked } as unknown as RagConfig;
  } catch { return defaultConfig(); }
}

export function saveConfig(config: RagConfig) {
  const cfgFile = configFile(getRagDir());
  // R5 lesson — the live config.json may carry a UTF-8 BOM. loadConfig() strips
  // it before JSON.parse, but saveConfig() must NOT destroy it on rewrite:
  // detect an existing BOM and re-emit it so the file header stays stable.
  // (If the file has no BOM, none is added — preserve exactly what was there.)
  let bom = "";
  if (existsSync(cfgFile) && readFileSync(cfgFile, "utf-8").startsWith("\uFEFF")) bom = "\uFEFF";
  writeFileSync(cfgFile, bom + JSON.stringify(config, null, 2));
}

/** Normalize a user-supplied extension to lowercase ".ext" form. */
export function normalizeExt(ext: string): string {
  const trimmed = ext.trim().toLowerCase();
  if (!trimmed) return "";
  return trimmed.startsWith(".") ? trimmed : `.${trimmed}`;
}

/** Build the effective extension allowlist from defaults + user config. */
export function resolveExtensions(config: Pick<RagConfig, "extraExtensions" | "excludeExtensions">): Set<string> {
  const set = new Set(DEFAULT_TEXT_EXTS);
  for (const e of config.extraExtensions) {
    const n = normalizeExt(e);
    if (n) set.add(n);
  }
  for (const e of config.excludeExtensions) {
    const n = normalizeExt(e);
    if (n) set.delete(n);
  }
  return set;
}
