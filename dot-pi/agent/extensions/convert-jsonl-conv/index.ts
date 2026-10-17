/**
 * convert_jsonl_conv — convert a pi session .jsonl into readable .txt files
 * and open the result folder. STANDALONE: this is a line-for-line TypeScript
 * port of ~/.pi/jsonl_to_messages.py (151 lines, stdlib only) — no Python,
 * no external script, no child process. The Python tool stays for bare-shell
 * use; for pi THIS file is the source of truth.
 *
 * Equivalence with the Python original is enforced by a golden-file test
 * (both modes, all real session files, byte-for-byte incl. CRLF): Python's
 * text mode writes \n -> \r\n on Windows, so writeText() replicates that.
 *
 * Usage:
 *   /convert_jsonl_conv <session.jsonl | unique fragment>          readable mode (default)
 *   /convert_jsonl_conv <session.jsonl | unique fragment> [--json] JSON mode (per-message
 *                                                                  .json + _index.txt,
 *                                                                  Notepad++ JSON Viewer)
 *
 * The file is AUTOMATICALLY SEARCHED for:
 *   1. treated as a direct path if it exists (absolute or vs cwd),
 *   2. otherwise matched as a case-insensitive fragment against every
 *      *.jsonl under ~/.pi/agent/sessions/ (exact filename wins over
 *      fragment matches; ambiguous fragment -> 5 newest candidates listed).
 * On success the containing folder is opened with Explorer.
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import * as path from "node:path";
import { homedir } from "node:os";

const SESSIONS_ROOT = path.join(homedir(), ".pi", "agent", "sessions");
const STATUS_KEY = "convert_jsonl";
const USAGE = "Usage: /convert_jsonl_conv <session.jsonl | unique fragment> [--json]";

const MAX_WALK_DEPTH = 8; // sessions/<sanitized-cwd>/<file>.jsonl = depth 2; guard only

// ---------------------------------------------------------------------------
// File search (auto-locate the session file)
// ---------------------------------------------------------------------------

/** Every *.jsonl under root (bounded recursion, never follows into loops). */
export function findSessionFiles(root: string = SESSIONS_ROOT): string[] {
  if (!existsSync(root)) return [];
  const out: string[] = [];
  const walk = (dir: string, depth: number) => {
    if (depth > MAX_WALK_DEPTH) return;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return; // unreadable dir -> skip, do not abort the search
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full, depth + 1);
      else if (e.isFile() && e.name.toLowerCase().endsWith(".jsonl")) out.push(full);
    }
  };
  walk(root, 0);
  return out;
}

/** Resolve the user argument to exactly one .jsonl file, or an error message. */
export function resolveSession(
  raw: string
): { ok: true; file: string } | { ok: false; error: string } {
  const arg = pyStrip(raw).replace(/^["']+|["']+$/g, "").replace(/^@+/, "");
  if (!arg) return { ok: false, error: USAGE };

  // 1. Direct path (absolute, or relative to cwd) — wins over fragment search.
  const asPath = path.resolve(arg);
  try {
    if (existsSync(asPath) && statSync(asPath).isFile()) return { ok: true, file: asPath };
  } catch {
    /* fall through to search */
  }

  // 2. Case-insensitive fragment match on the file NAME.
  const needle = arg.toLowerCase();
  const hits = findSessionFiles().filter((f) => path.basename(f).toLowerCase().includes(needle));
  if (hits.length === 0)
    return { ok: false, error: `No *.jsonl matching "${arg}" under ${SESSIONS_ROOT}` };

  // Exact filename (with or without .jsonl) beats fragment matches.
  const exact = hits.filter((f) => {
    const b = path.basename(f).toLowerCase();
    return b === needle || b === `${needle}.jsonl`;
  });
  const pool = exact.length > 0 ? exact : hits;

  if (pool.length > 1) {
    const byMtime = pool
      .map((f) => {
        let m = 0;
        try {
          m = statSync(f).mtimeMs;
        } catch {
          /* keep 0 -> sorts last */
        }
        return { f, m };
      })
      .sort((a, b) => b.m - a.m)
      .map((x) => x.f);
    const shown = byMtime.slice(0, 5).map((f) => "  " + path.basename(f)).join("\n");
    const more = byMtime.length > 5 ? `\n  … and ${byMtime.length - 5} more` : "";
    return {
      ok: false,
      error: `${pool.length} sessions match "${arg}" — be more specific:\n${shown}${more}`,
    };
  }
  return { ok: true, file: pool[0] };
}

// ---------------------------------------------------------------------------
// Converter — faithful port of jsonl_to_messages.py
// ---------------------------------------------------------------------------

export type ConvertMode = "readable" | "json";

export interface ConvertOptions {
  /** Checked before every message write; true -> stop, outcome.aborted = true. */
  isAborted?: () => boolean;
  /** Called after each message with (done, total). */
  onProgress?: (done: number, total: number) => void;
}

export interface ConvertOutcome {
  count: number; // messages processed (== written unless aborted)
  outDir: string;
  summary: string; // exact python-equivalent summary line
  warnings: string[]; // per-line "invalid JSON skipped" notices
  aborted: boolean;
}

interface FoundMessage {
  lineNo: number; // 1-based line number in the source file
  record: Record<string, unknown>;
}

/**
 * Python `str.strip()` whitespace set — deliberately EXCLUDES U+FEFF (python
 * does not treat BOM as whitespace, JavaScript's trim() does) and INCLUDES
 * \x1c-\x1e + \x85 (which JS trim() does not).
 */
const PY_WS = " \\t\\n\\r\\f\\v\\x1c-\\x1e\\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000";
const PY_STRIP_RE = new RegExp(`^[${PY_WS}]+|[${PY_WS}]+$`, "g");
const PY_RSTRIP_RE = new RegExp(`[${PY_WS}]+$`, "g");

function pyStrip(s: string): string {
  return s.replace(PY_STRIP_RE, "");
}
function pyRstrip(s: string): string {
  return s.replace(PY_RSTRIP_RE, "");
}

/** Python str() for the value shapes that occur in session records. */
function pyStr(v: unknown): string {
  if (v === null || v === undefined) return "None"; // python f"{None}"
  if (typeof v === "boolean") return v ? "True" : "False"; // python f"{True}"
  if (typeof v === "number") return pyNum(v);
  if (typeof v === "string") return v;
  return String(v); // dict/list in an id field — unreachable in practice
}

/**
 * Python str() of a number. CENSUS (2026-10-17, all 133 real session files,
 * 297041 literals): every number is a plain non-negative integer < 2^53, so
 * String(v) is byte-identical to Python. Float/exponent fall-through kept as
 * insurance; it does NOT reproduce Python's sci-notation style thresholds.
 */
function pyNum(v: number): string {
  return String(v);
}

/**
 * reformatEmbedded() — mirror of python `json.dumps(json.loads(s),
 * ensure_ascii=False, indent=2)` with ONE extra guarantee: NUMBER tokens are
 * copied verbatim from the source. JS JSON.parse would coerce `100.0` -> 100
 * (python keeps `100.0`), and would corrupt integers > 2^53 — both forbidden.
 * Strings/keys are canonicalized via parse+stringify exactly like python
 * (escapes unescaped, unicode raw). Duplicate keys: python dict semantics
 * (first position, last value). Returns null on failure -> caller keeps the
 * ORIGINAL string, matching python's `except Exception: pass`.
 */
const EMBED_FAIL = Symbol("embed-json-fail");

export function reformatEmbedded(raw: string): string | null {
  let i = 0;
  const n = raw.length;
  const pad = (depth: number) => "  ".repeat(depth);
  const ws = () => {
    // python json allows only space, tab, LF, CR between tokens
    while (i < n && (raw[i] === " " || raw[i] === "\t" || raw[i] === "\n" || raw[i] === "\r")) i++;
  };
  const NUM_RE = /^(?:-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?|NaN|Infinity|-Infinity)/;

  /** Consume a JSON string token, return its PARSED content (python unescape). */
  const parseString = (): string => {
    if (raw[i] !== '"') throw EMBED_FAIL;
    const start = i++;
    while (i < n) {
      const c = raw[i];
      if (c === "\\") {
        const e = raw[i + 1];
        if (e === undefined || !'"\\/bfnrtu'.includes(e)) throw EMBED_FAIL;
        if (e === "u") {
          if (!/^[0-9a-fA-F]{4}$/.test(raw.slice(i + 2, i + 6))) throw EMBED_FAIL;
          i += 6;
        } else i += 2;
        continue;
      }
      if (c === '"') {
        i++;
        return JSON.parse(raw.slice(start, i));
      }
      if (c.charCodeAt(0) < 0x20) throw EMBED_FAIL; // python strict=True rejects
      i++;
    }
    throw EMBED_FAIL;
  };

  /** Render value at nesting depth `depth`, mirroring dumps(indent=2) layout. */
  const render = (depth: number): string => {
    ws();
    const c = raw[i];
    if (c === "{") {
      i++;
      ws();
      if (raw[i] === "}") {
        i++;
        return "{}";
      }
      const order: string[] = [];
      const vals = new Map<string, string>();
      for (;;) {
        ws();
        const key = parseString();
        ws();
        if (raw[i] !== ":") throw EMBED_FAIL;
        i++;
        const v = render(depth + 1);
        if (!vals.has(key)) order.push(key); // python dict: first position…
        vals.set(key, v); // …last value wins
        ws();
        if (raw[i] === ",") {
          i++;
          continue;
        }
        if (raw[i] === "}") {
          i++;
          break;
        }
        throw EMBED_FAIL;
      }
      const body = order
        .map((k) => "\n" + pad(depth + 1) + JSON.stringify(k) + ": " + vals.get(k))
        .join(","); // dumps separates entries with ','
      return "{" + body + "\n" + pad(depth) + "}";
    }
    if (c === "[") {
      i++;
      ws();
      if (raw[i] === "]") {
        i++;
        return "[]";
      }
      const items: string[] = [];
      for (;;) {
        items.push(render(depth + 1));
        ws();
        if (raw[i] === ",") {
          i++;
          continue;
        }
        if (raw[i] === "]") {
          i++;
          break;
        }
        throw EMBED_FAIL;
      }
      const body = items.map((v) => "\n" + pad(depth + 1) + v).join(","); // dumps separates with ','
      return "[" + body + "\n" + pad(depth) + "]";
    }
    if (c === '"') return JSON.stringify(parseString());
    if (c === "t") return kw("true");
    if (c === "f") return kw("false");
    if (c === "n") return kw("null");
    const m = NUM_RE.exec(raw.slice(i));
    if (m) {
      i += m[0].length;
      return m[0]; // verbatim — python repr must equal the raw token (verified by golden test)
    }
    throw EMBED_FAIL;
  };
  const kw = (word: string): string => {
    if (raw.startsWith(word, i)) {
      i += word.length;
      return word;
    }
    throw EMBED_FAIL;
  };

  try {
    ws();
    if (i >= n) throw EMBED_FAIL;
    const out = render(0);
    ws();
    if (i !== n) throw EMBED_FAIL; // trailing data -> python json.loads fails too
    return out;
  } catch (e) {
    if (e === EMBED_FAIL) return null;
    throw e;
  }
}

/**
 * fmt_value() — 1:1 port incl. the original's exact indentation quirk
 * (value rendered at level+1 AFTER "key: ", producing the double indent).
 */
export function fmtValue(value: unknown, level = 0): string {
  const pad = "  ".repeat(level);
  if (typeof value === "boolean") return pad + (value ? "true" : "false");
  if (value === null || value === undefined) return pad + "null";
  if (typeof value === "number") return pad + pyNum(value);
  if (typeof value === "string") {
    const s = value;
    const t = pyStrip(s); // embedded JSON -> pretty-print, still complete
    if (t.startsWith("{") || t.startsWith("[")) {
      const pretty = reformatEmbedded(s); // null -> keep original, like python's except: pass
      if (pretty !== null) return pad + pretty;
    }
    return pad + s;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return pad + "[]";
    const lines = [pad + "["];
    for (const item of value) lines.push(fmtValue(item, level + 1));
    lines.push(pad + "]");
    return lines.join("\n");
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return pad + "{}";
    const lines = [pad + "{"];
    for (const [key, item] of entries) {
      lines.push(
        key === "" ? fmtValue(item, level + 1) : pad + "  " + key + ": " + fmtValue(item, level + 1)
      );
    }
    lines.push(pad + "}");
    return lines.join("\n");
  }
  return pad + String(value);
}

/** extract_messages() — split, strip (python whitespace set), parse, filter type=message. */
export function extractMessages(src: string): { messages: FoundMessage[]; warnings: string[] } {
  const warnings: string[] = [];
  const messages: FoundMessage[] = [];
  // Python text mode: universal newlines -> translate \r\n and lone \r to \n,
  // then iterate; BOM (if any) survives in the line, exactly as in python.
  const lines = readFileSync(src, "utf8").replace(/\r\n?/g, "\n").split("\n");
  lines.forEach((raw, idx) => {
    const line = pyStrip(raw);
    if (line.length === 0) return;
    const lineNo = idx + 1;
    let record: unknown;
    try {
      record = JSON.parse(line);
    } catch (err) {
      warnings.push(
        `  WARN line ${lineNo}: invalid JSON skipped (${err instanceof Error ? err.message : err})`
      );
      return;
    }
    if (record === null || typeof record !== "object" || Array.isArray(record)) return;
    const rec = record as Record<string, unknown>;
    if (rec.type === "message") messages.push({ lineNo, record: rec });
  });
  return { messages, warnings };
}

/** python: role = msg.get("role","?") if isinstance(msg, dict) else "?" */
function roleOf(msg: unknown): string {
  if (msg !== null && typeof msg === "object" && !Array.isArray(msg)) {
    const m = msg as Record<string, unknown>;
    return pyStr("role" in m ? m.role : "?");
  }
  return "?";
}

/** record_readable() — head + dashes + full fmt dump, python rstrip semantics. */
export function recordReadable(record: Record<string, unknown>): string {
  const msg = record.message; // python: record.get("message", {})
  const role = roleOf(msg);
  const when = pyStr("timestamp" in record ? record.timestamp : ""); // python: get("timestamp", "")
  const head = pyRstrip(`[${role}] ${when}`);
  const dashes = "-".repeat([...head].length); // python len() = code points
  const body = fmtValue(record, 0);
  return pyRstrip(`${head}\n${dashes}\n${body}`) + "\n";
}

/** Python text-mode write: \n -> os.linesep on Windows, nothing else. */
function writeText(file: string, content: string): void {
  writeFileSync(file, process.platform === "win32" ? content.replace(/\n/g, "\r\n") : content, "utf8");
}

function zeroPad(i: number, width: number): string {
  return String(i).padStart(width, "0");
}

/**
 * convert() — port of convert_readable() / convert_json().
 * outDir defaults to the source path minus its extension (python `with_suffix("")`).
 */
export function convertSession(
  src: string,
  mode: ConvertMode,
  outDirArg?: string,
  opts: ConvertOptions = {}
): ConvertOutcome {
  const { messages, warnings } = extractMessages(src);
  const name = path.basename(src);
  const outDir =
    outDirArg ?? path.join(path.dirname(src), path.basename(src, path.extname(src)));

  if (messages.length === 0) {
    return {
      count: 0,
      outDir,
      summary: `  no 'message' entries found in ${name}`,
      warnings,
      aborted: false,
    };
  }
  mkdirSync(outDir, { recursive: true });
  const total = messages.length;
  const width = Math.max(String(total).length, 3); // zero-pad 001

  let done = 0;
  const aborted = () => {
    if (opts.isAborted?.()) return true;
    return false;
  };

  if (mode === "json") {
    const index: string[] = [];
    for (const { lineNo, record } of messages) {
      if (aborted()) break;
      done++;
      const role = roleOf(record.message);
      const msgId = pyStr("id" in record ? record.id : "?");
      const file = path.join(outDir, `${zeroPad(done, width)}_${role}_${msgId}.json`);
      // python json.dump(record, ensure_ascii=False, indent=2) — no trailing newline
      writeText(file, JSON.stringify(record, null, 2));
      index.push(`${zeroPad(done, width)}\t${msgId}\t${role}\t(line ${lineNo})`);
      opts.onProgress?.(done, total);
    }
    if (!aborted()) writeText(path.join(outDir, "_index.txt"), index.join("\n") + "\n");
  } else {
    const combined = [`# Conversation: ${name}\n`];
    for (const { record } of messages) {
      if (aborted()) break;
      done++;
      const role = roleOf(record.message);
      const msgId = pyStr("id" in record ? record.id : "?");
      const text = recordReadable(record);
      writeText(path.join(outDir, `${zeroPad(done, width)}_${role}_${msgId}.txt`), text);
      combined.push(text);
      opts.onProgress?.(done, total);
    }
    if (!aborted()) writeText(path.join(outDir, "_conversation.txt"), combined.join("\n"));
  }

  const isAborted = done < total;
  const summary = isAborted
    ? `  ${name}: ${done}/${total} messages (ABORTED) -> ${outDir}`
    : mode === "json"
      ? `  ${name}: ${total} messages -> ${outDir}`
      : `  ${name}: ${total} messages (decoded \\n) -> ${outDir}`;
  return { count: done, outDir, summary, warnings, aborted: isAborted };
}

// ---------------------------------------------------------------------------
// Command wiring
// ---------------------------------------------------------------------------

/** Open a folder in Explorer. The path is always included in the final notify. */
function openFolder(dir: string): void {
  try {
    const ex = spawn("explorer.exe", [dir], {
      detached: true,
      stdio: "ignore",
      windowsHide: false,
    });
    ex.on("error", () => {
      /* path already notified */
    });
    ex.unref();
  } catch {
    /* ignore */
  }
}

export default function (pi: ExtensionAPI) {
  pi.registerCommand("convert_jsonl_conv", {
    description:
      "Convert a pi session .jsonl into readable .txt messages, standalone TS port, no Python needed (auto-finds the file) — /convert_jsonl_conv <name.jsonl | unique fragment> [--json]",
    async handler(args, ctx) {
      // Flags: default readable mode; --json switches to per-message .json output.
      const jsonMode = /(^|\s)--json(\s|$)/.test(args ?? "");
      const query = (args ?? "")
        .replace(/(^|\s)--json(?=\s|$)/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const resolved = resolveSession(query);
      if (!resolved.ok) {
        ctx.ui.notify(resolved.error, "warning");
        return;
      }
      const src = resolved.file;

      const outcome = convertSession(src, jsonMode ? "json" : "readable", undefined, {
        isAborted: () => ctx.signal?.aborted === true,
        onProgress: (done, total) => ctx.ui.setStatus(STATUS_KEY, `${done}/${total} messages`),
      });
      ctx.ui.setStatus(STATUS_KEY, undefined);

      if (outcome.aborted) {
        ctx.ui.notify(`convert_jsonl_conv aborted — ${outcome.summary}`, "warning");
        return; // no folder opened on abort (matches previous kill semantics)
      }
      if (outcome.count === 0) {
        ctx.ui.notify(`convert_jsonl_conv — ${outcome.summary}`, "warning");
        return;
      }

      openFolder(outcome.outDir);
      const warn = outcome.warnings.length > 0 ? ` (${outcome.warnings.length} line(s) skipped)` : "";
      ctx.ui.notify(`convert_jsonl_conv — ${outcome.summary}${warn} → folder opened`, "info");
    },
  });
}