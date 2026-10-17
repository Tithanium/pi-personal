/**
 * subagentFrame.ts — the classical-subagent RESULT frame for the visible
 * subagent runner (goal: same presentation as an LLM-invoked subagent,
 * WITHOUT model involvement).
 *
 * The drawing itself is delegated to subagentRender.ts — a faithful port of
 * the session's registered `subagent` tool renderer (same helpers, sections,
 * labels, components, theme keys, usage line). This file only:
 *
 *   1. carries the frame payload: the classical SingleResult mirror (`single`
 *      = agent/task/messages/usage/model/stopReason…) plus the outcome layer;
 *   2. appends it to the session as a CUSTOM ENTRY (pi.appendEntry — display
 *      only, never in the LLM context);
 *   3. registers the renderer under SUBAGENT_FRAME_ENTRY: collapsed/expanded
 *      are handled inside renderResultFrame; expansion piggybacks pi's own
 *      `toolOutputExpanded` (Ctrl+O) — custom entries re-render through
 *      CustomEntryComponent.setExpanded exactly like tool results.
 *
 * While the child runs, subprocessSmoke.ts renders the SAME classical pieces
 * live through the createLiveDisplay seam (ONE widget above the editor: call
 * header + growing body + pending row; expansion mirrors the harness Ctrl+O
 * state via ctx.ui.getToolsExpanded) — this entry is the SINGLE frame appended
 * at completion.
 *
 * Legacy guard: entries from before the reference port (data without
 * `single`) render a compact old-style line instead of throwing.
 */
import { Container, Text } from "@earendil-works/pi-tui";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { renderResultFrame, type SubagentSingleResult } from "./subagentRender.ts";

/** Entry customType — the renderer is registered under this key. */
export const SUBAGENT_FRAME_ENTRY = "rag-subagent-frame";

export interface SubagentFrameData {
  /** The agent name shown in the classical header, e.g. "rag-d". */
  label: string;
  /** The child's task (user prompt) — classical `─── Task ───` section. */
  task: string;
  /** Classical SingleResult mirror: full message history, usage, model, code. */
  single: SubagentSingleResult;
  /** done = clean payload · void = completed but nothing to inject (UNRELATED)
   *  escaped = cancelled by the user (Escape) · error = timeout/failure. */
  outcome: "done" | "void" | "escaped" | "error";
  /** Human note for non-done or edge outcomes (void/unrelated, spawn fail …). */
  note?: string;
  /** The child's final answer — what the injection carried. */
  payload?: string;
  /** Runner telemetry (not displayed — the usage line comes from single). */
  wallMs: number;
  tokensIn: number;
  tokensOut: number;
}

/** Append the result frame to the session (display-only — never in LLM
 *  context). NEVER throws: a failed append must not break the hook. */
export function appendSubagentFrame(pi: ExtensionAPI, data: SubagentFrameData): void {
  try {
    pi.appendEntry(SUBAGENT_FRAME_ENTRY, data);
  } catch {
    /* the panel + injection still work without the frame */
  }
}

/** Register the renderer (call once at extension load — main session AND child
 *  processes; registration is cheap and idempotent per extension instance). */
export function registerSubagentFrameRenderer(pi: ExtensionAPI): void {
  pi.registerEntryRenderer<SubagentFrameData>(SUBAGENT_FRAME_ENTRY, (entry, options, theme) =>
    renderSubagentFrame(entry.data, options.expanded, theme),
  );
}

function renderSubagentFrame(
  data: SubagentFrameData | undefined,
  expanded: boolean,
  theme: import("@earendil-works/pi-coding-agent").Theme,
): Container | Text | undefined {
  if (!data) return undefined;

  // Legacy entries (pre-port) carried items instead of `single`.
  if (!data.single) {
    return new Text(
      `${theme.fg("success", "✓")} ${theme.fg("toolTitle", theme.bold(`subagent ${data.label}`))}` +
        `${theme.fg("muted", " (user)")}` +
        `\n${theme.fg("muted", "(legacy frame — details unavailable)")}`,
      0,
      0,
    );
  }

  const extras =
    data.outcome === "void"
      ? `(${data.note ?? "unrelated — nothing injected"})`
      : data.note
        ? `(${data.note})`
        : undefined;
  return renderResultFrame(data.single, { expanded, extras: data.note ? extras : undefined }, theme);
}