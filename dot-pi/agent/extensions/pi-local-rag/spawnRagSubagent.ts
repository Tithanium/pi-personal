/**
 * spawnRagSubagent.ts — shared spawner for the rag-query subagent child process.
 *
 * ONE code path, two consumers:
 *   (a) the `before_agent_start` hook in index.ts (main session), and
 *   (b) tests/ab/run-b.mjs (headless A/B runner).
 *
 * What it does:
 *   - allocates a temp output file under the GLOBAL rag store's `tmp/` dir
 *     (`~/.pi/rag/tmp/`), keeping only the 10 newest files;
 *   - spawns a child `pi` process running the `rag-query` agent
 *     (--mode json -p --no-session --tools <frontmatter tools>
 *     [--model <frontmatter model>] --append-system-prompt <agent body> <task>),
 *     with env PI_RAG_SUBAGENT=1 so the child sees the rag tools and NEVER the hook;
 *   - streams the child's JSON-line output, accumulating usage/model/stop reason
 *     from `message_end` events and the final `agent_end` marker;
 *   - resolves as soon as the child emits `agent_end` (the temp file is final at
 *     that point) — killing the process then, which also dodges the observed
 *     node shutdown hang after agent_end;
 *   - imposes a HARD timeout (default 120 s) — on timeout the child is killed,
 *     the result is marked timedOut, and the caller decides what (if anything)
 *     to inject. This module never throws for a failed run; it reports.
 */
import { spawn } from "node:child_process";
import { existsSync, appendFileSync, mkdirSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { randomBytes } from "node:crypto";
import { tmpdir } from "node:os";
import { getAgentDir, parseFrontmatter } from "@earendil-works/pi-coding-agent";
import { GLOBAL_RAG_DIR } from "./store.ts";

/** Env flag marking a rag-query child process (double guard vs recursion). */
export const RAG_SUBAGENT_ENV = "PI_RAG_SUBAGENT";

/** True when running INSIDE the rag-query child (or any process flagged as one). */
export function isRagSubagentProcess(): boolean {
  return !!process.env[RAG_SUBAGENT_ENV] && process.env[RAG_SUBAGENT_ENV] !== "0";
}

// ─── Temp output files (P6) ──────────────────────────────────────────────────
// Stored under the GLOBAL rag store's tmp/ dir regardless of which store the
// search hits, so hook and headless runner always agree on the location.

/** `~/.pi/rag/tmp` — created on demand. */
export function getRagTmpDir(): string {
  const dir = join(GLOBAL_RAG_DIR(), "tmp");
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Keep only the `keep` newest rag-*.md files (by mtime); delete the rest. */
export function pruneRagTmpFiles(dir: string, keep = 10): void {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return; // dir does not exist yet
  }
  const files = entries
    .filter((e) => e.startsWith("rag-") && e.endsWith(".md"))
    .map((e) => join(dir, e))
    .map((p) => {
      try {
        return { p, mtime: statSync(p).mtimeMs };
      } catch {
        return null;
      }
    })
    .filter((x): x is { p: string; mtime: number } => x !== null)
    .sort((a, b) => b.mtime - a.mtime);
  for (const f of files.slice(keep)) {
    try {
      unlinkSync(f.p);
    } catch { /* best effort */ }
  }
}

/**
 * Allocate a fresh, not-yet-existing temp output file path (the child process
 * creates the file by writing to it). Prunes old temp files (keep last 10).
 */
export function allocateRagTmpFile(): string {
  const dir = getRagTmpDir();
  pruneRagTmpFiles(dir, 10);
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const path = join(dir, `rag-${ts}-${randomBytes(4).toString("hex")}.md`);
  return path;
}

/**
 * Read a temp output file with a transient-error retry; null when missing.
 *
 * The child is KILLED at agent_end, so on Windows its just-released file
 * handle (or an AV scan of the just-written file) can briefly make
 * readFileSync throw EBUSY/EPERM/EACCES/EAGAIN — a one-shot read that fails
 * to empty silently corrupted one R1 measurement. Retries ≤ 6 × 400 ms.
 * ENOENT is a GENUINE empty (the agent wrote nothing — relevance gate) and
 * fails fast without retry. SHARED by the production hook (index.ts) and the
 * headless runner (tests/ab/run-b.mjs) so both consumers behave identically.
 */
export async function readRagTmpFile(path: string): Promise<string | null> {
  return (await readRagTmpFileDetailed(path)).content;
}

/** readRagTmpFile + the number of read attempts (diagnostics for the runner). */
export async function readRagTmpFileDetailed(path: string): Promise<{ content: string | null; attempts: number }> {
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      return { content: readFileSync(path, "utf-8"), attempts: attempt };
    } catch (err) {
      const code = (err as NodeJS.ErrnoException | null)?.code;
      const transient = code === "EBUSY" || code === "EPERM" || code === "EACCES" || code === "EAGAIN";
      if (!transient || attempt === 6) return { content: null, attempts: attempt };
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  return { content: null, attempts: 6 };
}

// ─── Injection builder (P6) ──────────────────────────────────────────────────

/**
 * Build the text injected directly below the user message. Returns undefined
 * (inject NOTHING) when the content is empty/missing. Content is wrapped in a
 * `<rag-context>` marker block with a 1-line header (n sources, retrieval ms).
 * "Sources" = per-source `## `/`### ` headings written by the agent (min 1).
 */
export function buildRagInjectionText(content: string | null, wallMs: number): string | undefined {
  const trimmed = (content ?? "").trim();
  if (!trimmed) return undefined;
  const sources = Math.max(1, (trimmed.match(/^#{2,3}[ \t]/gm) ?? []).length);
  return (
    `<rag-context>\n` +
    `[pi-local-rag] RAG subagent: ${sources} sources, ${wallMs} ms retrieval.\n` +
    `${trimmed}\n` +
    `</rag-context>`
  );
}

// ─── Agent definition (P7) ───────────────────────────────────────────────────

export interface RagQueryAgent {
  systemPrompt: string;
  tools: string[];
  model?: string;
  /** Child "--thinking <level>" (off…max) — without it the gateway defaults
   *  to no reasoning and NO thinking blocks/deltas ever reach the display. */
  thinkingLevel?: string;
  filePath: string;
}

/**
 * Load ANY agent definition from the agent dir by filename (frontmatter
 * tools/model + body as system prompt). The body is appended via
 * --append-system-prompt <file>; `tools` drives the --tools arg.
 */
export function loadAgentFile(agentName: string): RagQueryAgent {
  const filePath = join(getAgentDir(), "agents", agentName);
  const content = readFileSync(filePath, "utf-8");
  // Type alias (not interface) — parseFrontmatter constrains to Record<string, unknown>.
  const { frontmatter, body } = parseFrontmatter<{
    name?: unknown;
    description?: unknown;
    tools?: unknown;
    model?: unknown;
  }>(content);
  const raw = Array.isArray(frontmatter.tools)
    ? frontmatter.tools
    : typeof frontmatter.tools === "string"
      ? frontmatter.tools.split(",")
      : [];
  const tools = raw
    .filter((t): t is string => typeof t === "string")
    .map((t) => t.trim())
    .filter(Boolean);
  return {
    systemPrompt: body,
    tools,
    model: typeof frontmatter.model === "string" ? frontmatter.model : undefined,
    filePath,
  };
}

/**
 * Load the rag-query agent definition (frontmatter tools/model + body as
 * system prompt). Mirrors the subagent extension's agent loading WITHOUT
 * importing it: the body is appended via --append-system-prompt <file>.
 */
export function loadRagQueryAgent(): RagQueryAgent {
  return loadAgentFile("rag-query.md");
}

// ─── Task (prompt) builder ───────────────────────────────────────────────────

/**
 * The positional prompt passed to the child. Carries the user prompt VERBATIM
 * (heredoc-fenced so quotes/newlines cannot leak out) and the EXACT temp-file
 * path the agent must fill. All workflow rules live in the agent's system
 * prompt (agents/rag-query.md), keeping this transport minimal.
 */
export function buildRagTask(userPrompt: string, tmpPath: string): string {
  return [
    `User prompt (verbatim):`,
    `<<<PROMPT`,
    userPrompt,
    `PROMPT`,
    `>>>`,
    ``,
    `Output file: ${tmpPath}`,
  ].join("\n");
}

/**
 * Task body for the SMOKE subagent (goal "process in service", step 1): a
 * single fast LLM round that proves the child spawns, answers, and finishes.
 * SHARED by the production hook path (subprocessSmoke.ts) and the headless
 * pre-check (tests/smoke/run-smoke-child.mjs) so both send the identical task.
 */
export function buildSmokeTask(userPrompt: string): string {
  return [
    `Answer IMMEDIATELY in EXACTLY ONE line starting with "SMOKE OK —" followed by an echo of this task. No tools, no markdown, no prose.`,
    ``,
    `Task (verbatim):`,
    `<<<PROMPT`,
    userPrompt,
    `PROMPT`,
    `>>>`,
  ].join("\n");
}

// ─── Pi CLI resolution ───────────────────────────────────────────────────────

/**
 * Resolve how to invoke the pi CLI.
 *   1. `$PI_CLI_PATH` — explicit override (set by tests/ab/run-b.mjs so the
 *      headless runner spawns the SAME global pi the main session runs, not
 *      this package's local copy).
 *   2. Running inside pi itself (hook context): process.argv[1] is the pi CLI
 *      script (…/pi-coding-agent/dist/bundle/cli.js) — use it via the current
 *      executable (node/bun).
 *   3. Fall back to `pi` on PATH.
 */
export function resolvePiInvocation(args: string[]): { command: string; args: string[] } {
  const override = process.env.PI_CLI_PATH;
  if (override && existsSync(override)) {
    return { command: process.execPath, args: [override, ...args] };
  }
  const argv1 = process.argv[1];
  if (argv1 && !argv1.startsWith("/$bunfs/root/") && existsSync(argv1)) {
    const norm = argv1.replace(/\\/g, "/");
    if (basename(norm) === "cli.js" && norm.includes("pi-coding-agent")) {
      return { command: process.execPath, args: [argv1, ...args] };
    }
  }
  return { command: "pi", args };
}

// ─── Spawn + JSON-line parsing ───────────────────────────────────────────────

export interface RagSubagentOptions {
  /** The user prompt (verbatim). */
  prompt: string;
  /** Exact temp-file path the agent must fill with the retrieved context. */
  tmpPath: string;
  /** Hard timeout in ms (default 120 000). */
  timeoutMs?: number;
  /** Child working directory (default: current cwd). */
  cwd?: string;
  /** Agent definition (default: loadRagQueryAgent()). */
  agent?: RagQueryAgent;
  /** Optional: append every raw stdout line of the child to this file (diagnostics). */
  rawPath?: string;
  /**
   * Optional: OVERRIDES the positional prompt entirely (instead of
   * buildRagTask(prompt, tmpPath)). Used by the phase-2 B/C subprocesses,
   * whose child prompt embeds the deterministic pre-fetch candidate context /
   * fan-out file contents inline (the child only sees rag_expand + write, so
   * it cannot read a candidate file itself). When set, `prompt`/`tmpPath`
   * are still recorded on the run object for diagnostics.
   */
  taskBody?: string;
  /** Silence watchdog: kill the child if no stdout line arrives for this long (default 45 000). */
  stallMs?: number;
  /**
   * AbortSignal — when aborted, the child is killed (SIGTERM → SIGKILL) and
   * the run is marked `aborted` (ok=false). Used by the in-harness smoke path
   * so that Escape cancels ONLY the subagent while the session keeps running.
   */
  signal?: AbortSignal;
  /**
   * Called with every parsed child JSON event (message_start / message_end /
   * agent_end …) so the caller can stream live subagent state into a harness
   * widget while the child runs. Never lets a caller error fail the run.
   */
  onEvent?: (event: any, run: RagSubagentRun) => void;
}

export interface RagSubagentRun {
  /** True when the child finished its work (agent_end seen, no in-message error). */
  ok: boolean;
  /** True when the hard timeout fired. */
  timedOut: boolean;
  /** True when opts.signal aborted (user cancelled ONLY the subagent, e.g. Escape). */
  aborted: boolean;
  /** True when an agent_end event was seen. */
  agentEnd: boolean;
  /**
   * True when the promise resolved at agent_end by killing the (possibly
   * shutdown-hanging) child — wallMs then measures retrieval work, not the
   * process lingering.
   */
  earlyExit: boolean;
  exitCode: number | null;
  /** Retrieval wall time in ms (to agent_end, or to timeout/exit). */
  wallMs: number;
  tokensIn: number;
  tokensOut: number;
  model?: string;
  stopReason?: string;
  errorMessage?: string;
  /**
   * Injection payload: the FINAL assistant message's output text (type
   * "text" parts only — thinking/reasoning/toolCall blocks never qualify;
   * see pickPayloadText). "" when the final message carries no text.
   */
  finalText: string;
  /** Tail of child stderr. */
  stderr: string;
  /** Temp output file path (same as opts.tmpPath). */
  tmpPath: string;
}

/**
 * Pick the injection payload from the child's assistant messages — PURE and
 * exported so tests/smoke/run-payload-filter.mjs can pin the contract.
 *
 * D contract (index.ts subprocess comment: "its final message IS the
 * injection payload", "UNRELATED" = the empty-payload edge): ONLY the LAST
 * message is consulted and ONLY its `type === "text"` parts are joined —
 * structural block-type filtering, no heuristic prose stripping. Earlier
 * messages and thinking/reasoning/toolCall blocks are structurally excluded,
 * so reasoning (or an intermediate preamble) can never leak into
 * `<rag-context>`; a text-free final message yields "" (final message wins —
 * an intermediate text must NOT survive over it).
 *
 * @param messages child assistant messages in arrival order (final message last).
 */
export function pickPayloadText(messages: ReadonlyArray<{ content?: unknown }>): string {
  const final = Array.isArray(messages) ? messages[messages.length - 1] : undefined;
  const content = final && Array.isArray(final.content) ? (final.content as unknown[]) : [];
  let text = "";
  for (const part of content) {
    const p = part as { type?: unknown; text?: unknown } | null | undefined;
    if (p && typeof p === "object" && p.type === "text" && typeof p.text === "string") {
      text += p.text;
    }
  }
  return text;
}

/**
 * message_end REDUCER — the PRODUCTION payload rule, extracted so
 * tests/smoke/run-payload-filter.mjs pins the exact line the hook runs (not
 * pickPayloadText in isolation): EVERY assistant message_end OVERWRITES
 * `run.finalText`, even with "" — last-message-wins INCLUDING the
 * terminal-state empty. The pre-fix non-empty-wins `if (text)` rule let an
 * intermediate preamble survive a text-free final message = leak into
 * <rag-context>.
 *
 * Pure: mutates ONLY `run.finalText`; never throws.
 */
export function applyAssistantMessageEnd(
  run: { finalText: string },
  msg: { content?: unknown },
): void {
  run.finalText = pickPayloadText([msg]);
}

function writeAgentPromptTempFile(systemPrompt: string): string {
  const file = join(tmpdir(), `pi-rag-query-sysprompt-${randomBytes(8).toString("hex")}.md`);
  writeFileSync(file, systemPrompt, { encoding: "utf-8", mode: 0o600 });
  return file;
}

/**
 * Spawn the rag-query subagent, run it to completion (or timeout), and report.
 * Never throws for a failed/timed-out run — inspect the returned object.
 */
export async function spawnRagSubagent(opts: RagSubagentOptions): Promise<RagSubagentRun> {
  const timeoutMs = opts.timeoutMs ?? 120_000;
  const stallMs = opts.stallMs ?? 45_000;
  const agent = opts.agent ?? loadRagQueryAgent();
  const t0 = Date.now();

  const run: RagSubagentRun = {
    ok: false,
    timedOut: false,
    aborted: false,
    agentEnd: false,
    earlyExit: false,
    exitCode: null,
    wallMs: 0,
    tokensIn: 0,
    tokensOut: 0,
    finalText: "",
    stderr: "",
    tmpPath: opts.tmpPath,
  };

  const args: string[] = [
    "--mode", "json", "-p", "--no-session",
    // Dedicated retrieval worker: no AGENTS.md context, no skills, no MCP,
    // no prompt templates — the whole operating contract is in the agent
    // body (--append-system-prompt). Smaller prefix = faster, cheaper turns.
    "--no-context-files", "--no-skills", "--no-mcp", "--no-prompt-templates",
  ];
  // Tool selection: an agent with NO declared tools (the P2-R2 B "single"
  // child and the C swarm worker) runs with --no-tools — exactly ONE LLM
  // round, and its answer is captured as run.finalText for the caller to
  // treat as the payload (no file is written by the child). An agent WITH
  // tools gets the --tools allowlist (v1 B "tools" path: rag_expand+write).
  if (agent.tools.length === 0) {
    args.push("--no-tools");
  } else {
    args.push("--tools", agent.tools.join(","));
  }
  if (agent.model) args.push("--model", agent.model);
  if (agent.thinkingLevel) args.push("--thinking", agent.thinkingLevel);

  let syspromptFile: string | null = null;
  if (agent.systemPrompt.trim()) {
    syspromptFile = writeAgentPromptTempFile(agent.systemPrompt.trim());
    args.push("--append-system-prompt", syspromptFile);
  }
  // A custom taskBody (B/C subprocesses) replaces the standard buildRagTask so
  // the candidate context / fan-out file contents can be embedded inline.
  args.push(opts.taskBody ?? buildRagTask(opts.prompt, opts.tmpPath));

  try {
    const invocation = resolvePiInvocation(args);
    const proc = spawn(invocation.command, invocation.args, {
      cwd: opts.cwd ?? process.cwd(),
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
      // The child registers the rag tools (and never the hook) because of this.
      env: { ...process.env, [RAG_SUBAGENT_ENV]: "1" },
    });

    let buffer = "";
    let timer: NodeJS.Timeout | null = null;
    let stallTimer: NodeJS.Timeout | null = null;
    let killTimer: NodeJS.Timeout | null = null;
    let stalled = false;

    const armStall = () => {
      if (stallTimer) clearTimeout(stallTimer);
      stallTimer = setTimeout(() => {
        // No JSON output for stallMs — the child is hung (API stall, shutdown
        // hang, …). Kill it now instead of waiting for the hard timeout.
        stalled = true;
        run.timedOut = true;
        run.errorMessage = `stall: no child output for ${stallMs} ms`;
        run.wallMs = Date.now() - t0;
        try {
          proc.kill("SIGTERM");
        } catch { /* already dead */ }
        killTimer = setTimeout(() => {
          try {
            if (!proc.killed) proc.kill("SIGKILL");
          } catch { /* already dead */ }
        }, 5000);
        killTimer.unref?.();
      }, stallMs);
      stallTimer.unref?.();
    };
    armStall();

    // External abort (Escape during the in-harness subagent): kill the child
    // only — the session, the hook, and the run keep going. The caller decides
    // what (if anything) to inject afterwards (nothing, for the smoke path).
    const onAbort = () => {
      run.aborted = true;
      run.wallMs = Date.now() - t0;
      if (!run.errorMessage) run.errorMessage = "aborted by user";
      try {
        proc.kill("SIGTERM");
      } catch { /* already dead */ }
      killTimer = setTimeout(() => {
        try {
          if (!proc.killed) proc.kill("SIGKILL");
        } catch { /* already dead */ }
      }, 3000);
      killTimer.unref?.();
    };
    if (opts.signal) {
      if (opts.signal.aborted) onAbort();
      else opts.signal.addEventListener("abort", onAbort, { once: true });
    }

    const processLine = (line: string) => {
      armStall(); // any output resets the stall watchdog
      if (opts.rawPath) {
        try {
          appendFileSync(opts.rawPath, line + "\n");
        } catch { /* diagnostics only — never fail the run */ }
      }
      if (!line.trim()) return;
      let event: any;
      try {
        event = JSON.parse(line);
      } catch {
        return; // non-JSON line (banner etc.) — ignore
      }
      try {
        opts.onEvent?.(event, run);
      } catch { /* live-streaming hook errors must never fail the run */ }
      if (event.type === "agent_end") {
        // The temp file is final at agent_end: resolve now and kill the child
        // (dodges the node shutdown hang observed on this machine).
        run.agentEnd = true;
        run.wallMs = Date.now() - t0;
        run.earlyExit = true;
        if (timer) clearTimeout(timer);
        try {
          proc.kill("SIGTERM");
        } catch { /* already dead */ }
        killTimer = setTimeout(() => {
          try {
            if (!proc.killed) proc.kill("SIGKILL");
          } catch { /* already dead */ }
        }, 3000);
        killTimer.unref?.();
        return;
      }
      if (event.type === "message_end" && event.message?.role === "assistant") {
        const msg = event.message;
        const usage = msg.usage;
        if (usage) {
          run.tokensIn += usage.input ?? 0;
          run.tokensOut += usage.output ?? 0;
        }
        if (msg.model && !run.model) run.model = msg.model;
        if (msg.stopReason) run.stopReason = msg.stopReason;
        if (msg.errorMessage) run.errorMessage = msg.errorMessage;
        // PAYLOAD GATE (reasoning must NEVER reach <rag-context>): the D
        // contract says the FINAL assistant message IS the payload, so every
        // assistant message_end OVERWRITES — even with "" (the pre-fix
        // `if (text)` last-NON-EMPTY rule let an intermediate text win over a
        // thinking-only final message = leak). Structural type-"text"
        // filtering only, see pickPayloadText; the live panel reads the same
        // event via onEvent and is unaffected. The reducer is exported
        // (applyAssistantMessageEnd) so run-payload-filter.mjs pins THIS
        // exact production site, not just the picker in isolation.
        applyAssistantMessageEnd(run, msg);
      }
    };

    const exitCode = await new Promise<number | null>((resolve) => {
      proc.stdout?.on("data", (data: Buffer) => {
        buffer += data.toString();
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) processLine(line);
      });
      proc.stderr?.on("data", (data: Buffer) => {
        run.stderr += data.toString();
      });
      timer = setTimeout(() => {
        run.timedOut = true;
        run.wallMs = Date.now() - t0;
        try {
          proc.kill("SIGTERM");
        } catch { /* already dead */ }
        killTimer = setTimeout(() => {
          try {
            if (!proc.killed) proc.kill("SIGKILL");
          } catch { /* already dead */ }
        }, 5000);
        killTimer.unref?.();
      }, timeoutMs);
      timer.unref?.();
      proc.on("close", (code) => {
        if (timer) clearTimeout(timer);
        if (stallTimer) clearTimeout(stallTimer);
        if (killTimer) clearTimeout(killTimer);
        opts.signal?.removeEventListener("abort", onAbort);
        if (buffer.trim()) processLine(buffer);
        if (run.wallMs === 0) run.wallMs = Date.now() - t0;
        resolve(code);
      });
      proc.on("error", () => {
        if (timer) clearTimeout(timer);
        if (stallTimer) clearTimeout(stallTimer);
        if (killTimer) clearTimeout(killTimer);
        opts.signal?.removeEventListener("abort", onAbort);
        if (run.wallMs === 0) run.wallMs = Date.now() - t0;
        resolve(1);
      });
    });

    run.exitCode = exitCode;
    if (opts.signal?.aborted) run.aborted = true;
    run.ok = run.agentEnd && !run.errorMessage && !run.timedOut && !run.aborted;
    if (run.stderr.length > 400) run.stderr = run.stderr.slice(-400);
    return run;
  } catch (err) {
    // Spawn-level failure (e.g. pi binary not found).
    run.wallMs = Date.now() - t0;
    run.errorMessage = err instanceof Error ? err.message : String(err);
    run.stderr += `\n[spawnRagSubagent] spawn failed: ${run.errorMessage}`;
    return run;
  } finally {
    if (syspromptFile) {
      try {
        unlinkSync(syspromptFile);
      } catch { /* ignore */ }
    }
  }
}

// ─── Capped-output model alias (P2-R5 FIX 1) ─────────────────────────────────
// The pi CLI has NO max-output-tokens flag (verified via `pi --help`). The
// lever is the per-model `maxTokens` generation option in models.json (pi
// sends it as `max_tokens` in the OpenAI-completions request; verified that
// the ALAN server honors it — finish_reason=length at the cap). So the
// selection-mode children (one-line protocol: B "single" + C swarm workers)
// run under a dedicated CAP-ALIAS entry: a PARALLEL provider key
// (`<provider>-ragcap`) pointing at the SAME endpoint, carrying ONE capped
// copy of the base model.
// Why a parallel provider key: the model `id` is sent VERBATIM as the
// upstream API's `model` parameter (a renamed id → 400 "Model not found"),
// so the cap entry must keep the server-known id — while leaving the main
// session's entry (`<provider>/<id>`, 32 k out tokens) untouched.
// This hard-caps the output the model CAN generate (a protocol violation can
// no longer cost 16 s of tokens — the R4 outlier): the deterministic speed
// guarantee the bar asks for.

/**
 * Resolve the pi default model as "provider/id" from the agent-dir
 * settings.json (defaultProvider/defaultModel). undefined when unavailable.
 */
export function resolveDefaultModel(): string | undefined {
  try {
    const s = JSON.parse(readFileSync(join(getAgentDir(), "settings.json"), "utf-8")) as Record<string, unknown>;
    const dm = typeof s.defaultModel === "string" ? s.defaultModel : undefined;
    if (!dm) return undefined;
    const dp = typeof s.defaultProvider === "string" ? s.defaultProvider : undefined;
    return dp ? `${dp}/${dm}` : dm;
  } catch {
    return undefined;
  }
}

/**
 * Ensure models.json carries a cap-alias entry for `baseModel` (parallel
 * provider `<providerKey>-ragcap`, same endpoint/auth, one model copy with
 * `maxTokens` = `maxTokens` + `samplingParams.max_tokens`) and return its
 * id in "provider/id" form for `--model <pattern>`. Idempotent — the cap
 * provider entry is refreshed in place on every call. A one-time backup
 * (models.json.ragcap-bak) is written before the FIRST modification so a
 * bad write is recoverable.
 *
 * Returns null when the base model cannot be resolved (no models.json,
 * no matching provider/model, or the file is not writable) — the caller
 * then runs the child UNCAPPED and relies on the protocol fallbacks
 * (first-line parse → EMPTY → deterministic rescue / per-hit KEEP).
 */
export function ensureCappedModelAlias(baseModel: string | undefined, maxTokens: number): string | null {
  if (!baseModel || !Number.isFinite(maxTokens) || maxTokens <= 0) return null;
  const modelsPath = join(getAgentDir(), "models.json");
  let doc: any;
  try {
    doc = JSON.parse(readFileSync(modelsPath, "utf-8").replace(/^\uFEFF/, ""));
  } catch {
    return null;
  }
  const providers = doc?.providers;
  if (!providers || typeof providers !== "object") return null;
  // Split "provider/id" — the id itself may contain "/" (e.g.
  // "ILAAS/.qwen-3.8-27b"), so only treat the first segment as the provider
  // when it is a known provider key; otherwise search all providers.
  let providerKey: string | null = null;
  let modelId = baseModel;
  const slash = baseModel.indexOf("/");
  const head = slash > 0 ? baseModel.slice(0, slash) : undefined;
  if (head && providers[head] && typeof providers[head] === "object") {
    providerKey = head;
    modelId = baseModel.slice(slash + 1);
  } else {
    for (const [k, p] of Object.entries(providers) as Array<[string, any]>) {
      if (Array.isArray(p?.models) && p.models.some((m: any) => m?.id === baseModel)) {
        providerKey = k;
        modelId = baseModel;
        break;
      }
    }
  }
  if (!providerKey) return null;
  const provider: any = providers[providerKey];
  if (!Array.isArray(provider.models)) return null;
  const base = provider.models.find((m: any) => m?.id === modelId);
  if (!base) return null;
  // Parallel provider: SAME endpoint + auth, ONE capped model copy that
  // keeps the server-known id (the id IS the upstream `model` parameter).
  const capProviderKey = `${providerKey}-ragcap`;
  const { models: _baseModels, ...rest } = provider;
  providers[capProviderKey] = {
    ...rest,
    models: [
      {
        id: modelId,
        name: `${base.name ?? modelId} (ragcap: max ${maxTokens} out tokens)`,
        contextWindow: base.contextWindow ?? 32768,
        maxTokens,
        samplingParams: { max_tokens: maxTokens },
      },
    ],
  };
  try {
    if (!existsSync(modelsPath + ".ragcap-bak")) {
      writeFileSync(modelsPath + ".ragcap-bak", readFileSync(modelsPath), "utf-8");
    }
    writeFileSync(modelsPath, JSON.stringify(doc, null, 2), "utf-8");
  } catch {
    return null;
  }
  return `${capProviderKey}/${modelId}`;
}
