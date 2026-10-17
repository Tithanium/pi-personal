#!/usr/bin/env node
/**
 * run-payload-filter.mjs — regression gate: subagent REASONING must NEVER
 * reach the injected RAG payload; the payload is text-only and comes from the
 * child's FINAL assistant message (goal v3 PART 5, task 3).
 *
 * Contract under test — `pickPayloadText` exported from spawnRagSubagent.ts
 * (D contract, index.ts subprocess comment: "its final message IS the
 * injection payload", "UNRELATED" = the empty-payload edge):
 *
 *   F1/F1b  [thinking, text] final message        → the text part ONLY
 *                                                   (no thinking, order-independent);
 *   F2      [text(preamble)], thinking-only FINAL → "" — an intermediate text
 *                                                   must NOT win over the final
 *                                                   message (the pre-fix
 *                                                   last-NON-EMPTY-wins rule was
 *                                                   the leak);
 *   F3      [text] final message                  → text verbatim;
 *   F4      empty / no-text inputs                → "";
 *   F5/F6  structural guards (non-string text parts; thinking/reasoning-TYPED
 *          blocks carry .text on some gateways — still excluded by the
 *          `type === "text"` filter).
 *   R1/R2  applyAssistantMessageEnd — the PRODUCTION message_end reducer (the
 *          ONE line that regressed: `run.finalText = …` overwrite rule):
 *          intermediate assistant text + final assistant message WITHOUT text
 *          → finalText === "" (terminal-state empty), and
 *          [text(preamble), text(final)] → final text;
 *   W      wiring: the production message_end site CALLS the reducer (not an
 *          inline picker call that the reducer test would miss).
 *
 * Structural block-type filtering ONLY (no heuristic deletion of prose) — real
 * payload content can never be stripped. On-screen reasoning display
 * (liveThinking / "─── Reasoning ───") reads the message stream directly and
 * is deliberately untouched by this picker.
 *
 * Usage:  node tests/smoke/run-payload-filter.mjs   (cwd = extension dir)
 * Exit 0 = all checks passed (runner convention: PASS/FAIL lines).
 */
import { readFileSync } from "node:fs";

const results = [];
let failed = 0;
const check = (name, pass, detail) => {
  results.push(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!pass) failed += 1;
};

let pickPayloadText, applyAssistantMessageEnd;
try {
  ({ pickPayloadText, applyAssistantMessageEnd } = await import("../../spawnRagSubagent.ts"));
} catch (e) {
  check("pickPayloadText importable from spawnRagSubagent.ts", false, String(e));
}
check("pickPayloadText is exported (pure function)",
  typeof pickPayloadText === "function",
  typeof pickPayloadText === "function"
    ? "typeof=function"
    : `typeof=${typeof pickPayloadText} — payload picker missing from spawnRagSubagent.ts`);
check("applyAssistantMessageEnd is exported (production message_end reducer)",
  typeof applyAssistantMessageEnd === "function",
  typeof applyAssistantMessageEnd === "function"
    ? "typeof=function"
    : `typeof=${typeof applyAssistantMessageEnd} — reducer missing from spawnRagSubagent.ts`);

if (typeof pickPayloadText === "function") {
  const THINK = "SECRET-REASONING: hidden chain of thought that must never be injected";
  const PAYLOAD = "/rag compare accepts --alpha and --top-k (corpus citation)";
  const PREAMBLE = "earlier assistant text that must never win over the final message";
  const toolCall = { type: "toolCall", id: "call_1", name: "grep", arguments: { pattern: "x" } };

  // F1 — thinking + text in the SAME final message → text only.
  const r1 = pickPayloadText([
    { role: "assistant", content: [{ type: "thinking", thinking: THINK }, { type: "text", text: PAYLOAD }] },
  ]);
  check("F1 final [thinking,text] → text only (reasoning excluded)",
    r1 === PAYLOAD && !r1.includes("SECRET-REASONING"),
    JSON.stringify(String(r1).slice(0, 80)));

  // F1b — part order reversed + a toolCall present → still text only.
  const r1b = pickPayloadText([
    { role: "assistant", content: [{ type: "text", text: PAYLOAD }, { type: "thinking", thinking: THINK }, toolCall] },
  ]);
  check("F1b final [text,thinking,toolCall] → text only, order-independent",
    r1b === PAYLOAD, JSON.stringify(String(r1b).slice(0, 80)));

  // F2 — THE D-CONTRACT CASE: intermediate text must NOT win over a
  // thinking-only FINAL message (pre-fix `if (text) run.finalText = text`
  // leaked PREAMBLE here → into <rag-context>).
  const r2 = pickPayloadText([
    { role: "assistant", content: [{ type: "text", text: PREAMBLE }] },
    { role: "assistant", content: [{ type: "thinking", thinking: THINK }, toolCall] },
  ]);
  check("F2 [text(preamble), thinking-only FINAL] → empty (final message IS the payload)",
    r2 === "", r2 === "" ? undefined : `LEAKED ${JSON.stringify(String(r2).slice(0, 60))}`);

  // F2b — plain-text final after a text preamble → final text wins (echoes D,
  // where turn 1-2 reasoning precedes the turn-3 payload text).
  const r2b = pickPayloadText([
    { role: "assistant", content: [{ type: "text", text: PREAMBLE }] },
    { role: "assistant", content: [{ type: "thinking", thinking: THINK }, { type: "text", text: PAYLOAD }] },
  ]);
  check("F2b [text(preamble), thinking+text FINAL] → final message text (preamble dropped)",
    r2b === PAYLOAD, JSON.stringify(String(r2b).slice(0, 80)));

  // F3 — lone text message → verbatim.
  const r3 = pickPayloadText([{ role: "assistant", content: [{ type: "text", text: PAYLOAD }] }]);
  check("F3 final [text] → text verbatim", r3 === PAYLOAD, JSON.stringify(String(r3).slice(0, 80)));

  // F4 — empty inputs → empty payload (the UNRELATED/empty edge stays intact).
  const r4a = pickPayloadText([]);
  const r4b = pickPayloadText([{ role: "assistant", content: [] }]);         // zero parts
  const r4c = pickPayloadText([{ role: "assistant", content: [toolCall] }]); // tool-only final
  const r4d = pickPayloadText([{ role: "assistant" }]);                      // content absent
  check("F4 empty / no-text inputs → empty payload",
    r4a === "" && r4b === "" && r4c === "" && r4d === "",
    JSON.stringify({ r4a, r4b, r4c, r4d }));

  // F5 — a text part WITHOUT .text must not stringify junk into the payload.
  const r5 = pickPayloadText([
    { role: "assistant", content: [{ type: "text" }, { type: "text", text: PAYLOAD }] },
  ]);
  check("F5 part missing .text is skipped (no 'undefined' join artifact)",
    r5 === PAYLOAD, JSON.stringify(String(r5).slice(0, 80)));

  // F6 — some gateways stash reasoning under .text INSIDE a thinking/reasoning-
  // TYPED block (subagentRender.ts getDisplayItems handles both shapes): the
  // structural `type === "text"` filter must exclude those too.
  const r6 = pickPayloadText([
    { role: "assistant", content: [
      { type: "thinking", text: THINK },
      { type: "reasoning", text: THINK },
      { type: "text", text: PAYLOAD },
    ] },
  ]);
  check("F6 thinking/reasoning-typed blocks excluded even when they carry .text",
    r6 === PAYLOAD && !r6.includes("SECRET-REASONING"),
    JSON.stringify(String(r6).slice(0, 80)));

  // R1 — THE PRODUCTION RULE, pinned at the reducer the message_end site
  // calls: every assistant message_end OVERWRITES run.finalText — last
  // message wins INCLUDING its terminal-state empty. The pre-fix
  // non-empty-wins `if (text)` behavior kept the intermediate preamble.
  if (typeof applyAssistantMessageEnd === "function") {
    const run = { finalText: "" };
    applyAssistantMessageEnd(run, { role: "assistant", content: [{ type: "text", text: PREAMBLE }] });
    const intermediate = run.finalText;
    applyAssistantMessageEnd(run, { role: "assistant", content: [{ type: "thinking", thinking: THINK }, toolCall] });
    check("R1 reducer: intermediate WITH text + final WITHOUT text → finalText \"\" (terminal empty wins)",
      intermediate === PREAMBLE && run.finalText === "",
      JSON.stringify({ intermediate, final: run.finalText }));

    // R2 — [text(preamble), text(final)] → final text (cwd echo of D turns,
    // where early preamble text precedes the payload text).
    const run2 = { finalText: "" };
    applyAssistantMessageEnd(run2, { role: "assistant", content: [{ type: "text", text: PREAMBLE }] });
    applyAssistantMessageEnd(run2, { role: "assistant", content: [{ type: "text", text: PAYLOAD }] });
    check("R2 reducer: [text(preamble), text(final)] → final text",
      run2.finalText === PAYLOAD, JSON.stringify(run2.finalText));
  }
}

// W — wiring: pin that the PRODUCTION message_end site calls the reducer
// (the test above would be meaningless if the hook kept its own inline rule).
{
  let src = "";
  let readErr;
  try {
    src = readFileSync(new URL("../../spawnRagSubagent.ts", import.meta.url), "utf-8");
  } catch (e) {
    readErr = String(e);
  }
  check("wiring: production message_end site calls applyAssistantMessageEnd(run, msg)",
    !readErr && src.includes("applyAssistantMessageEnd(run, msg)"),
    readErr ?? "spawnRagSubagent.ts");
}

console.log("\n=== payload filter (reasoning must never reach <rag-context>) ===");
console.log(results.join("\n"));
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} CHECK(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
