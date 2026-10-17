/**
 * subprocessSmoke.ts — THE visible classical-subagent runner for the hook.
 * Shared by the SMOKE validation path and the production D subprocess
 * (subprocessD.ts). Presentation is DELEGATED to subagentRender.ts — the
 * faithful port of the session's registered `subagent` tool renderer — so the
 * hook-spawned subagent looks exactly like an LLM-invoked one:
 *
 *   1. While the child runs (widget panel above the editor — ONE fixed widget
 *      key = ONE live position): the whole live view is rendered BY THE SEAM
 *      createLiveDisplay().lines(expanded, theme) — classical `subagent
 *      <label> [user]` call header + GROWING result body + spinner/elapsed
 *      pending row, with developing reasoning/output shown UN-TRUNCATED (no
 *      private 2400-char widget tails any more). Expansion mirrors the harness
 *      Ctrl+O state (ctx.ui.getToolsExpanded → the flag ctrl+o flips), so the
 *      user can view the WHOLE process mid-run (─── Task ─── / messages /
 *      growing output); when that API is absent (headless stub) the raw \x0f
 *      byte toggles a local flag — never consumed, the harness keeps its key.
 *   2. When it finishes, appendFrame (subagentFrame.ts) writes the classical
 *      result entry — collapsed/expanded through the same ported renderer.
 *   3. ESCAPE SEMANTICS (user-validated gate — DO NOT PERTURB THE LOGIC):
 *      while the child runs, a terminal-input listener SWALLOWS a bare
 *      Escape and kills ONLY the child. Because pi maps Escape to
 *      `session.abort()` whenever `session.isStreaming` (which is already true
 *      during `before_agent_start`), an unconsumed Escape would kill the WHOLE
 *      run — consuming it here makes the hook return with NO injection and the
 *      conversation resumes WITHOUT the subagent answer. The escape key must
 *      never exit the conversation flow — only this subprocess.
 *      ROUND 3 HARDENING (same gate, false-abort class removed): a lone "\u001b"
 *      is NOT only the Escape key — pi-tui's StdinBuffer flushes one after its
 *      escape timeout whenever an ESC-prefixed sequence arrives SPLIT across
 *      stdin reads (its own header, stdin-buffer.js:4-10: "Event 1: \\x1b /
 *      Event 2: [<35 …"). That false cancel killed real runs mid-first-toolcall
 *      (live-display.log 17:30:43.366 run start → 17:30:44.935 last=escaped,
 *      childWall=1541 ms; MWE: arrow key through the real pipeline → escaped).
 *      Fix: an escape is CONFIRMED after a short no-follow-up window (a second
 *      lone Escape commits immediately); any non-ESC follow-up input — the
 *      split tail or continued typing — withdraws it. A genuine, standalone
 *      Escape still cancels exactly as before (D8 + R5).
 *
 * NEVER throws to the hook: every failure degrades to { ok: false } + note.
 */
import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import { Container, Text } from "@earendil-works/pi-tui";
import type { SubagentFrameData } from "./subagentFrame.ts";
import {
  addAssistantUsage,
  newSingleResult,
  renderCallFrame,
  renderResultFrame,
  type FgTheme,
  type MsgLike,
  type SubagentSingleResult,
} from "./subagentRender.ts";
import {
  spawnRagSubagent,
  loadAgentFile,
  allocateRagTmpFile,
  buildSmokeTask,
  type RagQueryAgent,
} from "./spawnRagSubagent.ts";
import { appendFileSync, mkdirSync, renameSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// ── SELF-TRACING (diagnostic file only — NEVER the UI, NEVER the run) ────────
// ONE line per event into ~/.pi/rag/logs/live-display.log so a REAL
// interactive session can be diagnosed after the fact (an interactive TUI
// makes process.stderr invisible/lost). appendFileSync, ISO-LOCAL ms stamps,
// rotate to `.1` past ~2 MB on open, every error swallowed (no hrtime).
const TRACE_MAX_BYTES = 2 * 1024 * 1024;
const traceDir = join(homedir(), ".pi", "rag", "logs");
const traceFile = join(traceDir, "live-display.log");
/** ISO local time + ms — no process.hrtime.bigint, cheap and readable. */
const traceTs = (): string => {
  const d = new Date();
  const p = (n: number, w = 2): string => String(n).padStart(w, "0");
  return (
    `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` +
    `T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}`
  );
};
/** Append ONE line; rotate past ~2 MB; swallow ALL IO errors (writes NOTHING). */
const trace = (msg: string): void => {
  try {
    mkdirSync(traceDir, { recursive: true });
    try {
      if (statSync(traceFile).size > TRACE_MAX_BYTES) {
        try {
          renameSync(traceFile, `${traceFile}.1`); // rotate (replaces old .1)
        } catch {
          writeFileSync(traceFile, ""); // rotation refused (lock) → truncate
        }
      }
    } catch {
      /* no log file yet — nothing to rotate */
    }
    appendFileSync(traceFile, `[live-display] ${traceTs()} ${msg}\n`, "utf8");
  } catch {
    /* tracing must NEVER break the run — swallow everything */
  }
};
// MODULE-LOAD MARKER (top level): proves WHICH copy of this file a session
// loaded and WHEN — absolute path + ISO time (deliberately no git shell-out).
trace(`loaded ts=${traceTs()} pid=${process.pid} file=${fileURLToPath(import.meta.url)}`);

export interface SmokeRunResult {
  /** True only for a clean completion with a non-empty answer. */
  ok: boolean;
  /** True when the user cancelled the subagent alone (escape). */
  escaped: boolean;
  /** The child's answer (the injection payload), or null. */
  content: string | null;
  wallMs: number;
  tokensIn: number;
  tokensOut: number;
  note?: string;
}

const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const WIDGET_KEY = "rag-subagent";

export interface VisibleSubagentOpts {
  /** The user prompt (verbatim). */
  prompt: string;
  ctx: ExtensionContext;
  /** Hard cap for the child run. */
  timeoutMs?: number;
  /** Panel/task label — shown as `subagent <label> [user]`. */
  label: string;
  /**
   * Optional one-line call-header suffix appended after `[scope]` — the D
   * path reports `model · thinking <level>` (kept to ONE line; renderCallFrame).
   */
  meta?: string;
  /** Child definition: system prompt + tool allowlist + model. */
  agent: RagQueryAgent;
  /** Positional task body given to the child. */
  taskBody: string;
  /** Silence watchdog override (default 45 s — D runs with a longer one). */
  stallMs?: number;
  /**
   * Complete payloads that still mean "inject NOTHING" (e.g. D's exact
   * UNRELATED answer for an off-corpus prompt — the empty-payload edge).
   */
  isVoidPayload?: (finalText: string) => boolean;
  /**
   * Optional external cancel (headless tests / future callers): aborting it
   * kills the child exactly like Escape does. Escape itself uses the runner's
   * internal controller — both funnel into the same child kill.
   */
  signal?: AbortSignal;
  /**
   * Called once per run with the classical-subagent RESULT frame (entry
   * appended via pi.appendEntry → rendered by subagentFrame.ts through the
   * ported classical renderer). Optional so headless tests run without a
   * session.
   */
  appendFrame?: (frame: SubagentFrameData) => void;
}

export async function runVisibleSubagent(opts: VisibleSubagentOpts): Promise<SmokeRunResult> {
  const { ctx } = opts;
  const timeoutMs = opts.timeoutMs ?? 30_000;
  const t0 = Date.now();
  const controller = new AbortController();

  let escaped = false;
  let finalNote: string | undefined;
  const label = opts.label;
  // RUN-START marker: which subagent, which agent file, budget, process —
  // plus the model/thinking level this run was configured with (extended,
  // not replaced; asserted by tests/smoke/run-d-live.mjs U2).
  trace(`run start label=${label} agent=${opts.agent.filePath || opts.agent.model || "-"} timeoutMs=${timeoutMs} pid=${process.pid} model=${opts.agent.model ?? "-"} thinking=${opts.agent.thinkingLevel ?? "off"}`);

  // THE live display (seam): ONE accumulator for the child message stream
  // (message_update → un-truncated transient reasoning/output; message_end →
  // push + addAssistantUsage; tool_result_end → push) that BOTH the live
  // widget and the final frame read — no render path can fall back to private
  // truncated tails. Contract: tests/smoke/run-live-display.mjs (R1-R6).
  const live = createLiveDisplay({ label, task: opts.prompt, meta: opts.meta });
  const single: SubagentSingleResult = live.single();

  const emitFrame = (
    outcome: SubagentFrameData["outcome"],
    note: string | undefined,
    payload: string | undefined,
    stats: { wallMs: number; tokensIn: number; tokensOut: number },
  ) => {
    if (!opts.appendFrame) return;
    try {
      opts.appendFrame({
        label,
        task: opts.prompt,
        single,
        outcome,
        note,
        payload,
        ...stats,
      });
    } catch {
      /* frame is best-effort — never break the run */
    }
  };

  /** Fill the classical failure fields so the ported renderer shows the same
   *  ✗/[stopReason]/Error: presentation as a failed classical subagent. */
  const finalize = (run: { model?: string; exitCode?: number | null; timedOut?: boolean }, didEscape: boolean, errorNote?: string) => {
    if (!single.model && run.model) single.model = run.model;
    if (didEscape) {
      single.exitCode = 1;
      single.stopReason = "aborted";
      single.errorMessage = "aborted by user (escape)";
    } else if (errorNote) {
      if (single.exitCode === 0) single.exitCode = run.exitCode === null || run.exitCode === undefined ? 1 : run.exitCode;
      if (!single.stopReason) single.stopReason = run.timedOut ? "timeout" : "error";
      if (!single.errorMessage) single.errorMessage = errorNote;
    } else {
      single.exitCode = 0;
    }
  };

  // ── classical-subagent live panel (widget) ────────────────────────────────────
  // ONE live position: setWidget on a FIXED key — the harness replaces the
  // existing widget component in place on every setWidget (setExtensionWidget,
  // interactive-mode.js:1853-1884 → renderWidgets 1933-1939), so the live view
  // updates without ever touching the transcript. The ONLY entry appended
  // during a run is the final frame (at most one live position + one frame).
  // The content itself is rendered BY THE SEAM (createLiveDisplay.lines):
  // call header + growing body + pending row, un-truncated, no private tails.
  //
  // Expansion: ctrl+o = app.tools.expand (keybindings.js:37) →
  // toggleToolOutputExpansion (interactive-mode.js:3734-3735) flips the global
  // toolOutputExpanded and PUSHES setExpanded over header/loadedResources/chat
  // only (interactive-mode.js:3741-3747) — widget containers are separate
  // mount roots (interactive-mode.js:691-698) that push can never reach. So
  // this widget POLLS the same Ctrl+O flag via ctx.ui.getToolsExpanded
  // (types.d.ts:192-195, wired interactive-mode.js:2101): the normal Ctrl+O
  // expands transcript rows AND this live view at once. Fallback for contexts
  // without that API (headless stubs): the raw \x0f byte, never consumed.
  const spin = () => SPINNER[Math.floor((Date.now() - t0) / 130) % SPINNER.length];
  const hasExpansionApi = () => typeof ctx.ui.getToolsExpanded === "function";
  // Render failures must NEVER be silent (machine rule). The harness invokes the
  // widget factory INSIDE ctx.ui.setWidget (interactive-mode.js ~1870
  // `component = content(this.ui, theme)`) — a throw propagates back into
  // render(); swallowing it leaves the widget FROZEN on its last snapshot for
  // the whole run (the D-path defect: detached theme.fg → real-Theme
  // `tokenAnsi` TypeError). Log ONE line per distinct failure, tagged for
  // grep-ability, and render an error line instead of a frozen frame.
  let lastRenderError = "";
  const reportRenderError = (where: string, err: unknown): void => {
    const msg = err instanceof Error ? err.message : String(err);
    const line = `[pi-local-rag:live-render] ${where}: ${msg}`;
    if (line === lastRenderError) return; // one log line per distinct failure
    lastRenderError = line;
    trace(line); // ALSO the log file — stderr is invisible in an interactive TUI
    try {
      process.stderr.write(`\r\x1b[2K${line}\n`);
    } catch {
      /* logging must never throw either */
    }
  };
  // ── self-trace aggregates (file only): ONE `setWidget` line per ~2 s and a
  // coalesced `render OK` line — never one line per call (160 ms ticker).
  let widgetLen = 0; // char length of the last SUCCESSFUL factory render
  let swN = 0; // setWidget calls in the open aggregate window
  let swFrom = 0; // widgetLen when that window opened
  let swTo = 0; // widgetLen after the window's last call
  let swAt = 0; // ms timestamp of the window open
  let roAt = 0; // ms timestamp of the last `render OK` line
  const flushSetWidgetTrace = (): void => {
    if (swN === 0) return;
    trace(`setWidget n=${swN} grew=${swTo > swFrom} len=${swFrom}->${swTo} last=${live.phase()}`);
    swN = 0;
  };
  const noteSetWidget = (): void => {
    const now = Date.now();
    if (swN > 0 && now - swAt >= 2000) flushSetWidgetTrace(); // ~2 s aggregate
    if (swN === 0) {
      swAt = now;
      swFrom = widgetLen;
    }
    swN += 1;
    swTo = widgetLen;
  };
  const noteRenderOk = (): void => {
    const now = Date.now();
    if (now - roAt >= 2000) {
      roAt = now;
      trace(`render OK len=${widgetLen}`); // throttled (same 2 s coalescing)
    }
  };
  const render = () => {
    try {
      const wall = ((Date.now() - t0) / 1000).toFixed(1);
      ctx.ui.setWidget(
        WIDGET_KEY,
        (_tui, theme) => {
          try {
            const text = live.lines(expandedNow(), theme).join("\n");
            widgetLen = text.length; // self-trace: last successful render length
            noteRenderOk(); // throttled `render OK len=...` (2 s coalescing)
            return new Text(text, 0, 0);
          } catch (err) {
            // Never let a live-lines failure freeze the widget: report it and
            // show an explicit error line in place of the live view.
            const msg = err instanceof Error ? err.message : String(err);
            reportRenderError("widget live view", err);
            return new Text(`[pi-local-rag:live-render] widget render failed: ${msg}`, 0, 0);
          }
        },
        { placement: "aboveEditor" },
      );
      noteSetWidget(); // self-trace: aggregate `setWidget n=...` line (≤1 / 2 s)
      ctx.ui.setStatus(
        WIDGET_KEY,
        live.phase() === "running"
          ? `${spin()} ${label} ${wall}s — esc cancels subagent only`
          : undefined,
      );
    } catch (err) {
      reportRenderError("setWidget/setStatus", err); // UI must never break the run — but it must TELL
    }
  };
  let localExpanded = false;
  const expandedNow = (): boolean => {
    if (hasExpansionApi()) {
      try {
        return !!ctx.ui.getToolsExpanded();
      } catch {
        /* fall through to the local flag */
      }
    }
    return localExpanded;
  };

  const ticker = setInterval(render, 160);
  ticker.unref?.();
  render();

  // ── ESCAPE: cancel the SUBAGENT only, never the conversation ──────────────
  // (guarded — non-TUI modes may not expose raw-input listening; the escape
  //  semantics are only meaningful in an interactive session anyway)
  // Paired with the header note 3 (ROUND 3): lone-"\u001b" is CONFIRMED after
  // ESC_CONFIRM_MS of no follow-up input; a non-ESC follow-up (part of a split
  // escape sequence flushed by pi-tui's StdinBuffer — MWE repro, live trace
  // 17:30:44.935) withdraws the pending cancel instead of killing the run.
  const ESC_CONFIRM_MS = 150; // > pi-tui escape timeout (10 ms local / 100 ms SSH)
  let escapeTimer: NodeJS.Timeout | null = null;
  const commitEscape = (): void => {
    if (escapeTimer) {
      clearTimeout(escapeTimer);
      escapeTimer = null;
    }
    if (escaped) return;
    escaped = true;
    trace(`input escape CONFIRMED (no follow-up in ${ESC_CONFIRM_MS} ms) -> cancel subagent`);
    try {
      ctx.ui.notify(
        "[rag] subagent cancelled by escape — conversation continues without it",
        "info",
      );
    } catch {
      /* ignore */
    }
    controller.abort();
  };
  const withdrawEscape = (data: string): void => {
    if (!escapeTimer) return;
    clearTimeout(escapeTimer);
    escapeTimer = null;
    trace(`input escape WITHDRAWN by follow-up ${JSON.stringify(data.slice(0, 16))} (split-sequence prefix — not a cancel)`);
  };
  let releaseEscape = () => {};
  try {
    releaseEscape =
      ctx.ui.onTerminalInput((data) => {
        if (data === "\u001b") {
          if (!escaped) {
            if (escapeTimer) {
              commitEscape(); // second lone Escape (double-tap) = definite cancel
              return { consume: true };
            }
            escapeTimer = setTimeout(commitEscape, ESC_CONFIRM_MS);
            escapeTimer.unref?.();
            trace(`input escape armed (awaiting ${ESC_CONFIRM_MS} ms confirmation)`);
          }
          return { consume: true }; // keep consuming until the child is torn down
        }
        if (escapeTimer && data.length > 0 && !data.startsWith("\u001b")) {
          // Follow-up input that is NOT a new Escape-prefixed sequence ⇒ the
          // lone ESC was the flushed prefix of a split sequence (or the user
          // kept typing within the window): never a standalone cancel.
          // ESC-prefixed follow-ups (e.g. a kitty key-release right after a raw
          // Escape press) do NOT withdraw — a genuine Escape keeps working.
          withdrawEscape(data);
        }
        if (data === "\x0f" && !hasExpansionApi()) {
          // Fallback expansion ONLY when ctx.ui.getToolsExpanded is absent:
          // toggle the local flag the widget polls. NEVER consumed — the
          // input-listener pass-through (tui.js:688-707) still delivers the
          // byte to the editor, so the harness's own Ctrl+O keeps working.
          localExpanded = !localExpanded;
        }
        return undefined;
      }) || (() => {});
  } catch {
    /* no raw-input access in this mode */
  }

  // External abort source (headless tests) → same child kill as Escape.
  if (opts.signal) {
    if (opts.signal.aborted) controller.abort();
    else opts.signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    let run;
    try {
      run = await spawnRagSubagent({
        prompt: opts.prompt,
        tmpPath: allocateRagTmpFile(),
        timeoutMs,
        stallMs: opts.stallMs,
        agent: opts.agent,
        taskBody: opts.taskBody,
        signal: controller.signal,
        onEvent: (event) => {
          // ONE seam-driven accumulator: deltas → un-truncated transient
          // reasoning/output, message_end → push + usage, tool_result_end →
          // push (createLiveDisplay contract). The widget's every render reads
          // this state through live.lines() — private 2400-char tails removed.
          live.onEvent(event);
        },
      });
    } catch (err) {
      // spawnRagSubagent reports instead of throwing; a throw here is a real
      // defect — degrade to "not ok" so the hook still resumes the conversation.
      const spawnNote = `subagent spawn failed — ${err instanceof Error ? err.message : String(err)}`;
      finalize({ exitCode: 1 }, false, spawnNote);
      live.finish("error", spawnNote);
      emitFrame("error", spawnNote, undefined, {
        wallMs: Date.now() - t0,
        tokensIn: 0,
        tokensOut: 0,
      });
      return {
        ok: false,
        escaped: false,
        content: null,
        wallMs: Date.now() - t0,
        tokensIn: 0,
        tokensOut: 0,
        note: spawnNote,
      };
    }

    // An escape pressed AFTER the child already finished cannot cancel
    // anything — the finished answer wins (the panel shows ✓, not ✗).
    const didEscape = (escaped || run.aborted) && !run.ok;

    if (didEscape) {
      finalize(run, true);
      live.finish("escaped");
      render();
      emitFrame("escaped", undefined, undefined, {
        wallMs: run.wallMs,
        tokensIn: run.tokensIn,
        tokensOut: run.tokensOut,
      });
      return {
        ok: false,
        escaped: true,
        content: null,
        wallMs: run.wallMs,
        tokensIn: run.tokensIn,
        tokensOut: run.tokensOut,
        note: "escaped — subagent cancelled, conversation resumes without it",
      };
    }

    const finalText = (run.finalText ?? "").trim();
    // Complete-but-void payload (D's UNRELATED edge): ✓ on the panel, hook
    // injects nothing.
    if (run.ok && finalText && opts.isVoidPayload?.(finalText)) {
      finalize(run, false);
      finalNote = "unrelated to the corpus — nothing to inject (payload edge)";
      live.finish("void", finalNote);
      render();
      emitFrame("void", finalNote, finalText, {
        wallMs: run.wallMs,
        tokensIn: run.tokensIn,
        tokensOut: run.tokensOut,
      });
      return {
        ok: false,
        escaped: false,
        content: null,
        wallMs: run.wallMs,
        tokensIn: run.tokensIn,
        tokensOut: run.tokensOut,
        note: finalNote,
      };
    }
    if (run.ok && finalText) {
      finalize(run, false);
      live.finish("done");
      render();
      emitFrame("done", undefined, finalText, {
        wallMs: run.wallMs,
        tokensIn: run.tokensIn,
        tokensOut: run.tokensOut,
      });
      return {
        ok: true,
        escaped: false,
        content: finalText,
        wallMs: run.wallMs,
        tokensIn: run.tokensIn,
        tokensOut: run.tokensOut,
      };
    }

    const failNote =
      run.errorMessage ??
      (run.timedOut
        ? `timeout after ${timeoutMs} ms`
        : run.agentEnd
          ? "empty answer"
          : "run not ok");
    finalize(run, false, failNote);
    live.finish("error", failNote);
    emitFrame("error", failNote, finalText || undefined, {
      wallMs: run.wallMs,
      tokensIn: run.tokensIn,
      tokensOut: run.tokensOut,
    });
    return {
      ok: false,
      escaped: false,
      content: null,
      wallMs: run.wallMs,
      tokensIn: run.tokensIn,
      tokensOut: run.tokensOut,
      note: failNote,
    };
  } finally {
    clearInterval(ticker);
    if (escapeTimer) {
      clearTimeout(escapeTimer);
      escapeTimer = null;
    }
    try {
      releaseEscape();
      ctx.ui.setWidget(WIDGET_KEY, undefined);
      noteSetWidget(); // count the clearing call too (aggregate flushed below)
      ctx.ui.setStatus(WIDGET_KEY, undefined);
    } catch {
      /* ignore */
    }
    flushSetWidgetTrace(); // emit the tail window (final phase) — file only
  }

  // unreachable — kept for exhaustiveness
  // eslint-disable-next-line no-unreachable
  return { ok: false, escaped: false, content: null, wallMs: Date.now() - t0, tokensIn: 0, tokensOut: 0 };
}

/**
 * SMOKE wrapper (in-service validation path, ragSubprocess "S"): the
 * no-tools instant-answer agent behind the shared visible runner.
 */
export async function runSmokeSubagent(opts: {
  prompt: string;
  ctx: ExtensionContext;
  timeoutMs?: number;
  appendFrame?: (frame: SubagentFrameData) => void;
}): Promise<SmokeRunResult> {
  return runVisibleSubagent({
    prompt: opts.prompt,
    ctx: opts.ctx,
    timeoutMs: opts.timeoutMs,
    label: "rag-smoke",
    agent: loadAgentFile("rag-smoke.md"),
    taskBody: buildSmokeTask(opts.prompt),
    appendFrame: opts.appendFrame,
  });
}

/**
 * createLiveDisplay — headless seam for the LIVE view of the hook-spawned
 * subagent (contract + assertions: tests/smoke/run-live-display.mjs).
 *
 * Same accumulator semantics as runVisibleSubagent's onEvent
 * (message_update deltas → transient tails; message_end → messages.push +
 * addAssistantUsage; tool_result_end → messages.push — reference
 * extensions/subagent/index.ts). Difference: the in-progress reasoning/output
 * is kept as a GROWING transient message entry fed to the classical renderer
 * — never truncated to the widget's private 2400-char tails and never
 * discarded until its message completes (the widget tails stay widget-local
 * until P2 rewires the widget onto this seam).
 *
 * Rendering is fully delegated to the classical port (subagentRender.ts):
 *   running = renderCallFrame header + growing renderResultFrame body +
 *             spinner/escape pending row (the widget line);
 *   final   = renderResultFrame only (✓/✗ header — no pending row).
 */
export function createLiveDisplay(opts: { label: string; task: string; meta?: string }): {
  onEvent(ev: unknown): void;
  lines(expanded: boolean, theme: FgTheme, width?: number): string[];
  phase(): "running" | "done" | "escaped" | "error";
  single(): SubagentSingleResult;
  finish(outcome: "done" | "void" | "escaped" | "error", note?: string): void;
} {
  const t0 = Date.now();
  const single: SubagentSingleResult = newSingleResult(opts.label, opts.task, "user");
  let liveText = "";
  let liveThinking = "";
  let phaseState: "running" | "done" | "escaped" | "error" = "running";
  let finalNote: string | undefined;

  /** Shape of the child `pi --mode json` events consumed verbatim. */
  type ChildEvent = {
    type?: string;
    assistantMessageEvent?: { type?: string; delta?: unknown };
    message?: MsgLike;
  };

  const onEvent = (ev: unknown): void => {
    const event = (ev ?? {}) as ChildEvent;
    try {
      if (event.type === "message_update") {
        const am = event.assistantMessageEvent;
        if (am?.type === "text_delta" && typeof am.delta === "string") {
          liveText += am.delta; // NO 2400-char cap — the seam never truncates
        } else if ((am?.type === "thinking_delta" || am?.type === "reasoning_delta") && typeof am.delta === "string") {
          // Observed subtype on this gateway = `thinking_delta` (json.md §
          // message_update); `reasoning_delta` is accepted as the alias other
          // providers use (same semantic channel → same accumulator).
          liveThinking += am.delta;
        }
      }
      if (event.type === "message_end" && event.message) {
        const msg = event.message;
        single.messages.push(msg); // reference pushes every child message
        if (msg.role === "assistant") {
          addAssistantUsage(single, msg);
          // A completed message replaces the transient streaming entry.
          liveText = "";
          liveThinking = "";
          if (single.messages.length > 400)
            single.messages.splice(0, single.messages.length - 400);
        }
      }
      if (event.type === "tool_result_end" && event.message) {
        single.messages.push(event.message); // reference subagent/index.ts:411-414
      }
    } catch (err) {
      // Self-trace only — behavior unchanged: still rethrows to the caller.
      trace(`onEvent THREW ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    }
    // CHILD-EVENT trace: type + sub-type only + count of single().messages
    // AFTER handling — ONE line per event (every event is logged).
    const type = event.type ?? "?";
    let detail = "";
    if (type === "message_update") {
      const sub = event.assistantMessageEvent?.type ?? "-";
      const delta = event.assistantMessageEvent?.delta;
      detail = `${sub === "thinking_delta" || sub === "reasoning_delta" ? "th_delta" : sub}${typeof delta === "string" ? ` ${delta.length}ch` : ""}`;
    } else if (type === "message_end" && event.message) {
      const content: unknown = event.message.content;
      // Block TYPE LIST (permanent, cheap): `blocks=2 [thinking,toolCall]` —
      // proves whether the child answered with reasoning blocks or not.
      const parts: unknown[] = Array.isArray(content) ? content : [content];
      const blockTypes = parts.map((p) =>
        p && typeof p === "object" && typeof (p as { type?: unknown }).type === "string"
          ? (p as { type: string }).type
          : "text",
      );
      detail = `role=${event.message.role} blocks=${blockTypes.length} [${blockTypes.join(",")}]`;
    }
    trace(`child event ${type}${detail ? ` ${detail}` : ""} msgs=${single.messages.length}`);
  };

  const lines = (expanded: boolean, theme: FgTheme, width?: number): string[] => {
    const box = new Container();
    if (phaseState === "running") {
      // Classical pieces: call header + growing result body + pending row.
      box.addChild(renderCallFrame(opts.label, opts.task, theme, "user", opts.meta));
      // Transient in-progress TEXT: pushed as the LAST message (it grew last).
      // Transient REASONING is NOT in the copy — it is passed as `liveThinking`
      // so the collapsed renderer pins the `✻` line ABOVE the tool lines and
      // the expanded renderer shows the full accumulated text under
      // ─── Reasoning ─── (renderResultFrame contract).
      const messages: MsgLike[] = [...single.messages];
      if (liveText) {
        messages.push({ role: "assistant", content: [{ type: "text", text: liveText }] });
      }
      box.addChild(
        renderResultFrame(
          { ...single, messages },
          { expanded, liveThinking: liveThinking || undefined },
          theme,
        ),
      );
      const wall = ((Date.now() - t0) / 1000).toFixed(1);
      box.addChild(
        new Text(
          theme.fg("warning", SPINNER[Math.floor((Date.now() - t0) / 130) % SPINNER.length]) +
            theme.fg("muted", ` ${wall}s — escape cancels only the subagent`),
          0,
          0,
        ),
      );
    } else {
      // Final state: the SAME classical result rendering as the entry frame.
      box.addChild(
        renderResultFrame(
          single,
          { expanded, extras: finalNote ? `(${finalNote})` : undefined },
          theme,
        ),
      );
    }
    return box.render(width ?? 110);
  };

  const phase = (): "running" | "done" | "escaped" | "error" => phaseState;

  /** Fill the classical failure fields so the ported renderer shows the same
   *  ✗/[stopReason]/Error: presentation as a failed classical subagent
   *  (mirrors finalize() above). */
  const finish = (outcome: "done" | "void" | "escaped" | "error", note?: string): void => {
    finalNote = note;
    if (outcome === "done" || outcome === "void") {
      phaseState = "done";
      // Contract: done/void → ✓ header always.
      single.exitCode = 0;
      if (single.stopReason === "error" || single.stopReason === "aborted")
        single.stopReason = undefined;
    } else if (outcome === "escaped") {
      phaseState = "escaped";
      single.exitCode = 1;
      single.stopReason = "aborted";
      single.errorMessage = "aborted by user (escape)";
    } else {
      phaseState = "error";
      if (single.exitCode === 0) single.exitCode = 1;
      if (!single.stopReason) single.stopReason = "error";
      if (!single.errorMessage) single.errorMessage = note ?? "subagent failed";
    }
  };

  return { onEvent, lines, phase, single: () => single, finish };
}