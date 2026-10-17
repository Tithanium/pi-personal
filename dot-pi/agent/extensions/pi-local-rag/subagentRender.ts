/**
 * subagentRender.ts — THE classical-subagent presentation, ported from the
 * subagent tool actually registered in this machine's pi sessions
 * (~/.pi/agent/extensions/subagent/index.ts, single-agent mode).
 *
 * Why a port: that tool's renderCall/renderResult are module-internal (never
 * exported) and it registers itself as the `subagent` tool — it cannot be
 * imported by name nor executed from a before_agent_start hook. This file
 * keeps its rendering BYTE-CONSISTENT: same helpers (formatTokens,
 * formatUsageStats, formatToolCall, getDisplayItems, getFinalOutput,
 * isFailedResult), same sections and labels (`─── Task ───`,
 * `─── Output ───`, `→ ` calls, `(Ctrl+O to expand)`, `... N earlier items`,
 * `(no output)`), same components (Text/Container/Spacer/Markdown) and theme
 * keys, same usage line (`3 turns ↑1.2k ↓3.4k R12k W3.2k ctx:12k model`).
 *
 * ONE deliberate addition beyond the reference (user ask: "affichage du
 * raisonnement"): the reference ignores `thinking` content blocks; here they
 * become DisplayItem type "thinking" — rendered as a muted `✻ ...` line in
 * the collapsed preview and as a `─── Reasoning ───` section (between Task
 * and Output) when expanded. Everything else is faithful.
 *
 * KEEP IN SYNC with ~/.pi/agent/extensions/subagent/index.ts when that file
 * changes (reference lines: formatUsageStats 61, formatToolCall 87,
 * getDisplayItems 232, renderCall 886, renderResult 927).
 */
import { getMarkdownTheme } from "@earendil-works/pi-coding-agent";
import { Container, Markdown, Spacer, Text } from "@earendil-works/pi-tui";

/** Mirrors pi's Theme as used by the reference renderers (method bivariance
 *  lets the real Theme satisfy this structurally). */
export interface FgTheme {
  fg(color: string, text: string): string;
  bold(text: string): string;
}

export const COLLAPSED_ITEM_COUNT = 10;

/** The child's accumulated conversation — same shape as the reference
 *  SingleResult, filled from the child `pi --mode json` event stream. */
export interface SubagentSingleResult {
  agent: string;
  agentSource: "user" | "project" | "unknown";
  task: string;
  /** 0 while running / on success; non-zero on failure/abort. */
  exitCode: number;
  messages: MsgLike[];
  stderr: string;
  usage: UsageStats;
  model?: string;
  stopReason?: string;
  errorMessage?: string;
}

export interface UsageStats {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  cost: number;
  contextTokens: number;
  turns: number;
}

/** Child JSON message (lenient: parsed from `--mode json` lines). */
export interface MsgLike {
  role: string;
  content: unknown;
  model?: string;
  usage?: Record<string, unknown>;
  stopReason?: string;
  errorMessage?: string;
}

export type DisplayItem =
  | { type: "text"; text: string }
  | { type: "toolCall"; name: string; args: Record<string, unknown> }
  | { type: "thinking"; text: string };

export function emptyUsage(): UsageStats {
  return { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, cost: 0, contextTokens: 0, turns: 0 };
}

export function newSingleResult(
  agent: string,
  task: string,
  source: "user" | "project" | "unknown" = "user",
): SubagentSingleResult {
  return { agent, agentSource: source, task, exitCode: 0, messages: [], stderr: "", usage: emptyUsage() };
}

// ── reference helpers (verbatim) ────────────────────────────────────────────

export function formatTokens(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 10000) return `${(count / 1000).toFixed(1)}k`;
  if (count < 1000000) return `${Math.round(count / 1000)}k`;
  return `${(count / 1000000).toFixed(1)}M`;
}

export function formatUsageStats(usage: UsageStats, model?: string): string {
  const parts: string[] = [];
  if (usage.turns) parts.push(`${usage.turns} turn${usage.turns > 1 ? "s" : ""}`);
  if (usage.input) parts.push(`↑${formatTokens(usage.input)}`);
  if (usage.output) parts.push(`↓${formatTokens(usage.output)}`);
  if (usage.cacheRead) parts.push(`R${formatTokens(usage.cacheRead)}`);
  if (usage.cacheWrite) parts.push(`W${formatTokens(usage.cacheWrite)}`);
  if (usage.cost) parts.push(`$${usage.cost.toFixed(4)}`);
  if (usage.contextTokens && usage.contextTokens > 0) parts.push(`ctx:${formatTokens(usage.contextTokens)}`);
  if (model) parts.push(model);
  return parts.join(" ");
}

/**
 * NOTE: `themeFg` must arrive BOUND to the theme (`theme.fg.bind(theme)` — the
 * reference does this at index.ts:946/978). The real pi `Theme.fg` reads
 * `this.fgAnsi`/`this.tokenAnsi`; a detached `theme.fg` throws
 * `Cannot read properties of undefined (reading 'tokenAnsi')` (theme.js:202)
 * and freezes the caller's render — the D-path widget defect fixed here.
 */
export function formatToolCall(
  toolName: string,
  args: Record<string, unknown>,
  themeFg: (color: string, text: string) => string,
): string {
  const osHomedir = (): string => process.env.USERPROFILE || process.env.HOME || "";
  const shortenPath = (p: string): string => {
    const home = osHomedir();
    return home && p.startsWith(home) ? `~${p.slice(home.length)}` : p;
  };

  switch (toolName) {
    case "bash": {
      const command = (args.command as string) || "...";
      const preview = command.length > 60 ? `${command.slice(0, 60)}...` : command;
      return themeFg("muted", "$ ") + themeFg("toolOutput", preview);
    }
    case "read": {
      const rawPath = (args.file_path || args.path || "...") as string;
      const filePath = shortenPath(rawPath);
      const offset = args.offset as number | undefined;
      const limit = args.limit as number | undefined;
      let text = themeFg("accent", filePath);
      if (offset !== undefined || limit !== undefined) {
        const startLine = offset ?? 1;
        const endLine = limit !== undefined ? startLine + limit - 1 : "";
        text += themeFg("warning", `:${startLine}${endLine ? `-${endLine}` : ""}`);
      }
      return themeFg("muted", "read ") + text;
    }
    case "write": {
      const rawPath = (args.file_path || args.path || "...") as string;
      const filePath = shortenPath(rawPath);
      const content = (args.content as string) || "";
      const lines = content.split("\n").length;
      let text = themeFg("muted", "write ") + themeFg("accent", filePath);
      if (lines > 1) text += themeFg("dim", ` (${lines} lines)`);
      return text;
    }
    case "edit": {
      return (
        themeFg("muted", "edit ") + themeFg("accent", shortenPath((args.file_path || args.path || "...") as string))
      );
    }
    case "ls": {
      return themeFg("muted", "ls ") + themeFg("accent", shortenPath((args.path || ".") as string));
    }
    case "find": {
      const pattern = (args.pattern as string) || "*";
      const rawPath = (args.path as string) || ".";
      return themeFg("muted", "find ") + themeFg("accent", pattern) + themeFg("dim", ` in ${shortenPath(rawPath)}`);
    }
    case "grep": {
      const pattern = (args.pattern as string) || "";
      const rawPath = (args.path as string) || ".";
      return (
        themeFg("muted", "grep ") + themeFg("accent", `/${pattern}/`) + themeFg("dim", ` in ${shortenPath(rawPath)}`)
      );
    }
    default: {
      const argsStr = JSON.stringify(args);
      const preview = argsStr.length > 50 ? `${argsStr.slice(0, 50)}...` : argsStr;
      return themeFg("accent", toolName) + themeFg("dim", ` ${preview}`);
    }
  }
}

/**
 * Collapsed reasoning preview line: the LAST non-empty line of the (possibly
 * multi-line, still-growing) thinking text — a developing `✻` status line.
 * Used for BOTH the transient live reasoning and completed thinking blocks.
 */
export function reasoningPreviewLine(text: string): string {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return (lines[lines.length - 1] ?? "").slice(0, 160);
}

export function getFinalOutput(messages: MsgLike[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === "assistant" && Array.isArray(msg.content)) {
      for (const part of msg.content as Array<{ type?: string; text?: string }>) {
        if (part?.type === "text" && typeof part.text === "string" && part.text.trim()) return part.text;
      }
    }
  }
  return "";
}

export function isFailedResult(result: SubagentSingleResult): boolean {
  return result.exitCode !== 0 || result.stopReason === "error" || result.stopReason === "aborted";
}

/** Reference getDisplayItems — plus the deliberate `thinking` extension. */
export function getDisplayItems(messages: MsgLike[]): DisplayItem[] {
  const items: DisplayItem[] = [];
  for (const msg of messages) {
    if (msg.role !== "assistant") continue;
    const parts = Array.isArray(msg.content) ? (msg.content as Array<Record<string, unknown>>) : [];
    for (const part of parts) {
      if (!part || typeof part !== "object") continue;
      if (part.type === "text" && typeof part.text === "string") items.push({ type: "text", text: part.text });
      else if (part.type === "thinking" && typeof (part.thinking as unknown) === "string" && part.thinking)
        items.push({ type: "thinking", text: part.thinking as unknown as string });
      else if (part.type === "thinking" && typeof part.text === "string" && part.text)
        items.push({ type: "thinking", text: part.text });
      else if (part.type === "toolCall")
        items.push({
          type: "toolCall",
          name: typeof part.name === "string" && part.name ? part.name : "tool",
          args:
            part.arguments && typeof part.arguments === "object"
              ? (part.arguments as Record<string, unknown>)
              : {},
        });
    }
  }
  return items;
}

/** Reference usage accounting for one assistant `message_end`. */
export function addAssistantUsage(single: SubagentSingleResult, msg: MsgLike): void {
  single.usage.turns += 1;
  const u = msg.usage;
  if (u) {
    single.usage.input += (u.input as number) || 0;
    single.usage.output += (u.output as number) || 0;
    single.usage.cacheRead += (u.cacheRead as number) || 0;
    single.usage.cacheWrite += (u.cacheWrite as number) || 0;
    single.usage.cost += ((u.cost as { total?: number } | undefined)?.total as number) || 0;
    single.usage.contextTokens = (u.totalTokens as number) || single.usage.contextTokens;
  }
  if (!single.model && msg.model) single.model = msg.model;
  if (msg.stopReason && !single.stopReason) single.stopReason = msg.stopReason;
  if (msg.errorMessage) single.errorMessage = msg.errorMessage;
}

// ── reference render frames (single mode) ───────────────────────────────────

/** Reference renderCall, single-agent branch: `subagent <agent> [user]` +
 *  60-char dim task preview. (Reference index.ts:886.) */
export function renderCallFrame(
  agentName: string,
  taskText: string,
  theme: FgTheme,
  scope: string = "user",
  /** Optional one-line suffix after `[scope]` (D reports `model · thinking <level>`). */
  meta?: string,
): Text {
  const preview = taskText ? (taskText.length > 60 ? `${taskText.slice(0, 60)}...` : taskText) : "...";
  let text =
    theme.fg("toolTitle", theme.bold("subagent ")) +
    theme.fg("accent", agentName) +
    theme.fg("muted", ` [${scope}]`) +
    (meta ? theme.fg("dim", ` · ${meta}`) : "");
  text += `\n  ${theme.fg("dim", preview)}`;
  return new Text(text, 0, 0);
}

/**
 * Reference renderResult, single branch (reference index.ts:927-1040):
 * collapsed = header + last items (3-line previews) + Ctrl+O hint + usage;
 * expanded  = header/Error/Task/[Reasoning]/Output/→-calls/Markdown/usage.
 * `extras` lets the outcome layer append a muted note (e.g. the void /
 * UNRELATED edge) under everything else.
 */
export function renderResultFrame(
  r: SubagentSingleResult,
  opts: { expanded: boolean; extras?: string; liveThinking?: string },
  theme: FgTheme,
): Text | Container {
  const { expanded } = opts;
  const isError = isFailedResult(r);
  const icon = isError ? theme.fg("error", "✗") : theme.fg("success", "✓");
  const displayItems = getDisplayItems(r.messages);
  const finalOutput = getFinalOutput(r.messages);

  const renderDisplayItems = (items: DisplayItem[], limit?: number): string => {
    const toShow = limit ? items.slice(-limit) : items;
    const skipped = limit && items.length > limit ? items.length - limit : 0;
    let text = "";
    if (skipped > 0) text += theme.fg("muted", `... ${skipped} earlier items\n`);
    for (const item of toShow) {
      if (item.type === "text") {
        const preview = expanded ? item.text : item.text.split("\n").slice(0, 3).join("\n");
        text += `${theme.fg("toolOutput", preview)}\n`;
      } else if (item.type === "thinking") {
        text += `${theme.fg("muted", "✻ ")}${theme.fg("dim", reasoningPreviewLine(item.text))}\n`;
      } else {
        text += `${theme.fg("muted", "→ ") + formatToolCall(item.name, item.args, theme.fg.bind(theme))}\n`;
      }
    }
    return text.trimEnd();
  };

  if (expanded) {
    const container = new Container();
    let header = `${icon} ${theme.fg("toolTitle", theme.bold(r.agent))}${theme.fg("muted", ` (${r.agentSource})`)}`;
    if (isError && r.stopReason) header += ` ${theme.fg("error", `[${r.stopReason}]`)}`;
    container.addChild(new Text(header, 0, 0));
    if (isError && r.errorMessage) container.addChild(new Text(theme.fg("error", `Error: ${r.errorMessage}`), 0, 0));
    container.addChild(new Spacer(1));
    container.addChild(new Text(theme.fg("muted", "─── Task ───"), 0, 0));
    container.addChild(new Text(theme.fg("dim", r.task), 0, 0));

    // Deliberate addition vs the reference: reasoning section (user ask).
    // `liveThinking` = the STILL-DEVELOPING reasoning of the running child
    // (full accumulated text — the expanded view shows the whole process).
    const thinking = displayItems.filter((i): i is { type: "thinking"; text: string } => i.type === "thinking");
    if (thinking.length > 0 || opts.liveThinking) {
      container.addChild(new Spacer(1));
      container.addChild(new Text(theme.fg("muted", "─── Reasoning ───"), 0, 0));
      for (const t of thinking) container.addChild(new Text(theme.fg("dim", t.text), 0, 0));
      if (opts.liveThinking) container.addChild(new Text(theme.fg("dim", opts.liveThinking), 0, 0));
    }

    container.addChild(new Spacer(1));
    container.addChild(new Text(theme.fg("muted", "─── Output ───"), 0, 0));
    if (displayItems.length === 0 && !finalOutput) {
      container.addChild(new Text(theme.fg("muted", "(no output)"), 0, 0));
    } else {
      for (const item of displayItems) {
        if (item.type === "toolCall")
          container.addChild(
            new Text(theme.fg("muted", "→ ") + formatToolCall(item.name, item.args, theme.fg.bind(theme)), 0, 0),
          );
      }
      if (finalOutput) {
        container.addChild(new Spacer(1));
        container.addChild(new Markdown(finalOutput.trim(), 0, 0, getMarkdownTheme()));
      }
    }
    const usageStr = formatUsageStats(r.usage, r.model);
    if (usageStr) {
      container.addChild(new Spacer(1));
      container.addChild(new Text(theme.fg("dim", usageStr), 0, 0));
    }
    if (opts.extras) container.addChild(new Text(theme.fg("muted", opts.extras), 0, 0));
    return container;
  }

  // ── collapsed ──
  let text = `${icon} ${theme.fg("toolTitle", theme.bold(r.agent))}${theme.fg("muted", ` (${r.agentSource})`)}`;
  if (isError && r.stopReason) text += ` ${theme.fg("error", `[${r.stopReason}]`)}`;
  // Developing `✻` reasoning line — rendered FIRST so it sits ABOVE the tool
  // lines (the live panel's status line; throttled by the widget ticker).
  if (opts.liveThinking && opts.liveThinking.trim()) {
    text += `\n${theme.fg("muted", "✻ ")}${theme.fg("dim", reasoningPreviewLine(opts.liveThinking))}`;
  }
  if (isError && r.errorMessage) {
    text += `\n${theme.fg("error", `Error: ${r.errorMessage}`)}`;
  } else if (displayItems.length === 0) {
    // A developing `✻` line IS output — never claim "(no output)" while the
    // child's reasoning is streaming in above.
    if (!opts.liveThinking) text += `\n${theme.fg("muted", "(no output)")}`;
  } else {
    text += `\n${renderDisplayItems(displayItems, COLLAPSED_ITEM_COUNT)}`;
    if (displayItems.length > COLLAPSED_ITEM_COUNT) {
      text += `\n${theme.fg("muted", "(Ctrl+O to expand)")}`;
    }
  }
  const usageStr = formatUsageStats(r.usage, r.model);
  if (usageStr) text += `\n${theme.fg("dim", usageStr)}`;
  if (opts.extras) text += `\n${theme.fg("muted", opts.extras)}`;
  return new Text(text, 0, 0);
}