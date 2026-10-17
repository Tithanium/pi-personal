/**
 * tool-name-case-fix — auto-correct misspelled tool names in model tool calls
 * (observed: `powerShell` -> `powershell`, 26 failures / 61 error lines in session
 * 2026-10-16T10-43-25-815Z; also `powerhell` once).
 *
 * WHY a `message_end` hook (chain verified on pi v0.85.1 — [VOLATILE] re-check after ANY
 * pi upgrade, see VERIFIED_FACTS.md):
 *
 * 1. pi-agent-core/dist/agent-loop.js `prepareToolCall()` (~line 484) resolves the tool with
 *    `tools.find((t) => t.name === toolCall.name)` — exact, case-SENSITIVE match. On a miss it
 *    returns `Tool powerShell not found` BEFORE `config.beforeToolCall` (= pi.on("tool_call"))
 *    ever runs, so NO tool_call hook can rewrite the name — the tool declaration itself is not
 *    modifiable from an extension either (the built-in registration belongs to the harness).
 * 2. agent-loop `streamAssistantResponse()` AWAITS `emit({ type: "message_end", message })`
 *    (lines 319/332) and only afterwards `runLoop` calls
 *    `executeToolCalls(currentContext, message, …)` (line 165) which does the lookup above.
 * 3. Agent.subscribe awaits listeners in order (agent.js: `await listener(event, signal)`),
 *    so AgentSession._handleAgentEvent -> _emitExtensionEvent -> runner.emitMessageEnd runs
 *    BEFORE tool execution. `emitMessageEnd` applies a returned message through
 *    `_replaceMessageInPlace` — mutating the very object the agent loop holds.
 * 4. Session persistence happens after the extension emit (agent-session.js message_end
 *    branch), so the corrected name is what is persisted and replayed to the model.
 *
 * Net effect: any tool call whose name matches a registered tool case-insensitively (plus the
 * small ALIASES table for observed letter typos) is silently rewritten to the canonical name
 * BEFORE lookup — the workflow continues as if the model had spelled it right. Calls matching
 * no known tool are left untouched (they still error, as they should).
 *
 * Cost: O(#tools + #content blocks) per message, no extra tools shown to the model
 * (unlike alias-tool registration), no cache-invalidating prompt changes.
 */
import type { ExtensionAPI, MessageEndEventResult } from "@earendil-works/pi-coding-agent";

/**
 * Observed NON-case typos: key = requested name lowercased, value = canonical tool name.
 * Intentionally tiny — only real typos seen on this machine are listed.
 */
const ALIASES: Record<string, string> = {
	powerhell: "powershell",
};

/**
 * Output goes to the FOOTER status zone — the same place the RAG outcome renders
 * (`ctx.ui.setStatus("rag", …)`, pi-local-rag/ragFooter.ts). NEVER console.error:
 * a raw stderr write lands in the middle of the prompt line and corrupts the TUI.
 */
const STATUS_KEY = "toolcase";

/** Single-line footer budget in chars (matches ragFooter RAG_STATUS_MAX). */
const STATUS_MAX = 72;

/** Control chars + separators — banned: the footer contract is a SINGLE line. */
const CONTROL = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g;

/** Sanitize + clamp to one footer line (never throws). */
function footerText(s: string): string {
	const oneLine = s.replace(CONTROL, " ").replace(/\s+$/, "");
	if (oneLine.length <= STATUS_MAX) return oneLine;
	return oneLine.slice(0, STATUS_MAX - 1).replace(/\s+$/, "") + "\u2026";
}

/** Set/clear this extension's footer entry; silently no-ops outside interactive mode. */
function setFooter(pi: ExtensionAPI, text: string | undefined): void {
	try {
		pi.ui.setStatus(STATUS_KEY, text === undefined ? undefined : footerText(text));
	} catch {
		/* non-interactive mode (pi -p) — no footer to write to */
	}
}

/** Loose shape of an assistant `toolCall` content block (kept structural for testability). */
interface ToolCallBlock {
	type?: unknown;
	name?: unknown;
	[key: string]: unknown;
}

/**
 * Rewrite `toolCall` name fields in `content` in place.
 *
 * @param content  assistant message content array
 * @param knownNames  canonical names of every registered tool
 * @param activeNames  names currently declared to the model (preferred on ambiguity)
 * @returns number of blocks corrected (0 = nothing to fix)
 *
 * Exported so the logic can be unit-tested without the harness.
 */
export function correctToolCallNames(
	content: unknown,
	knownNames: Iterable<string>,
	activeNames?: ReadonlySet<string>,
): number {
	const byLower = new Map<string, string[]>();
	const exact = new Set<string>();
	for (const n of knownNames) {
		if (typeof n !== "string" || !n) continue;
		exact.add(n);
		const key = n.toLowerCase();
		const list = byLower.get(key);
		if (list === undefined) byLower.set(key, [n]);
		else if (!list.includes(n)) list.push(n);
	}

	if (!Array.isArray(content)) return 0;
	let fixed = 0;
	for (const raw of content as unknown[]) {
		if (raw === null || typeof raw !== "object") continue;
		const block = raw as ToolCallBlock;
		if (block.type !== "toolCall") continue;
		const name = block.name;
		if (typeof name !== "string" || exact.has(name)) continue; // correct name -> untouched
		const key = name.toLowerCase();
		let target: string | undefined;
		const candidates = byLower.get(key);
		if (candidates !== undefined && candidates.length > 0) {
			// Case-only mismatch. On ambiguity prefer the tool actually declared to the model.
			target =
				(activeNames !== undefined
					? candidates.find((c) => activeNames.has(c))
					: undefined) ?? candidates[0];
		} else {
			target = ALIASES[key];
		}
		if (target !== undefined && target !== name && exact.has(target)) {
			block.name = target;
			fixed++;
		}
		// No candidate (e.g. "Bashh") -> left alone so the harness reports "Tool X not found".
	}
	return fixed;
}

export default function (pi: ExtensionAPI) {
	pi.on("message_end", (event): MessageEndEventResult | undefined => {
		const message = event.message;
		if (message.role !== "assistant") return undefined;

		let known: string[];
		let active: Set<string>;
		try {
			known = pi.getAllTools().map((t) => t.name);
			active = new Set(pi.getActiveTools());
			for (const n of active) if (!known.includes(n)) known.push(n);
		} catch (err) {
			// Never fail silently: full debugging context via a notify toast (NOT
			// stderr — that would print into the prompt line).
			try {
				pi.ui.notify(
					`[tool-name-case-fix] ERROR listing tools — role=${message.role}, ` +
						`model=${pi.model?.id ?? "unknown"}: ` +
						`${err instanceof Error ? (err.stack ?? err.message) : String(err)}`,
					"error",
				);
			} catch {
				/* non-interactive mode: nowhere to report; the handler still degrades safely */
			}
			return undefined;
		}

		const fixed = correctToolCallNames(message.content, known, active);
		if (fixed > 0) {
			const names = (message.content as ToolCallBlock[])
				.filter((b) => b !== null && typeof b === "object" && b.type === "toolCall")
				.map((b) => String(b.name))
				.join(", ");
			// Same rendition as `RAG <label> <ms>ms none — <why>`: one footer line,
			// persists until the next correction (like the RAG outcome entry).
			setFooter(pi, `Tool-case fix — ${fixed} call(s) → ${names}`);
		}
		return fixed > 0 ? { message } : undefined;
	});
}