/**
 * run-widget-panel.mjs — TEMPORARY diagnostic: evaluate the LIVE widget
 * factory headlessly during a real tool-calling child run and inspect the
 * rendered text — answers "does the running panel actually contain the
 * classical call header, the `→ tool` lines and a growing body?"
 */
import { existsSync } from "node:fs";
if (!process.env.PI_CLI_PATH) {
  const cli = "C:/Users/connessn/AppData/Roaming/npm/node_modules/@earendil-works/pi-coding-agent/dist/bundle/cli.js";
  if (existsSync(cli)) process.env.PI_CLI_PATH = cli;
}
const { runVisibleSubagent } = await import("../../subprocessSmoke.ts");
const { appendSubagentFrame, SUBAGENT_FRAME_ENTRY } = await import("../../subagentFrame.ts");
const { renderResultFrame } = await import("../../subagentRender.ts");

let pass = 0,
  fail = 0;
const check = (name, cond, detail = "") => {
  if (cond) {
    pass++;
    console.log(`PASS  ${name} ${detail}`);
  } else {
    fail++;
    console.log(`FAIL  ${name} ${detail}`);
  }
};

const theme = { fg: (_c, t) => String(t ?? ""), bold: (t) => String(t ?? "") };

let latestFactory = null;
const snapshots = [];
const ctx = {
  mode: "tui",
  ui: {
    setWidget: (_k, v) => {
      if (typeof v === "function") latestFactory = v;
    },
    setStatus: () => {},
    notify: () => {},
    onTerminalInput: () => () => {},
  },
};

const capture = (frame) => frames.push(frame);
const frames = [];

function evaluate(tag) {
  if (!latestFactory) {
    snapshots.push({ tag, text: "" });
    return;
  }
  try {
    const comp = latestFactory(null, theme);
    const lines = comp.render(110);
    snapshots.push({ tag, text: lines.join("\n") });
  } catch (e) {
    snapshots.push({ tag, text: `EVAL_ERROR ${e.message}` });
  }
}
// Sample the widget every 200 ms WHILE the child runs.
const poller = setInterval(() => evaluate("t" + Date.now()), 200);

const run = await runVisibleSubagent({
  prompt: "Read C:/Users/connessn/.pi/agent/extensions/pi-local-rag/goal.md and give its first heading.",
  ctx,
  timeoutMs: 90_000,
  label: "rag-test",
  agent: {
    systemPrompt: "Use the read tool exactly once on the file named in the task, then answer with its first heading.",
    tools: ["read"],
    model: "alan/qwen-3.8-27b",
    filePath: "",
  },
  taskBody:
    "Read the file C:/Users/connessn/.pi/agent/extensions/pi-local-rag/goal.md with the read tool and reply with only its first markdown heading.",
  appendFrame: capture,
});

// Poll while running: evaluate whatever factory is current.
// (Done sequentially AFTER the run is impossible — capture during instead.)
// We re-run nothing: snapshots were taken by a parallel poller below.

clearInterval(poller);

const all = snapshots.map((s) => s?.text ?? "");
console.log("DEBUG snapshots n=" + snapshots.length + " types=" + snapshots.map((s) => typeof s?.text).join(","));
const running = all.slice(0, -1).join("\n");
const finalText = all[all.length - 1] ?? "";

const runningText = all.slice(0, -1).join("\n");
console.log("=== running-phase snapshots ===");
for (const s of all.slice(0, -1)) {
  const first = s.split("\n").filter(Boolean)[0] ?? "(empty)";
  console.log(`  [${s.length >= 0 ? "" : ""}] len=${s.length} first=${JSON.stringify(first.slice(0, 60))}`);
}
check("running snapshots were taken", all.length >= 3, `n=${all.length}`);
check(
  "running widget has classical call header (subagent … [user])",
  runningText.includes("subagent rag-test"),
);
check(
  "running widget has the `→ read` tool line at some point",
  /→\s*read/.test(runningText),
  JSON.stringify((runningText.match(/→[^\n]*/g) ?? [])[0] ?? ""),
);
check(
  "running widget body GROWS (last > first non-empty snapshot)",
  all.length < 3 || all[0].length <= all[all.length - 2].length,
  `first=${all[0]?.length} beforeFinal=${all[all.length - 2]?.length}`,
);
check("running widget carries the escape-contract line", runningText.includes("escape cancels only the subagent"));
check("no evaluate errors", !all.some((t) => t.includes("EVAL_ERROR")), (all.find((t) => t.includes("EVAL_ERROR")) ?? "").slice(0, 120));

console.log("=== final widget text ===");
console.log(finalText || "(empty)");

check("final widget has classical ✓ header", finalText.includes("✓ rag-test (user)"), finalText.slice(0, 60));
check(
  "final widget contains the classical `→ read` tool line",
  finalText.includes("→ ") && finalText.includes("read "),
  JSON.stringify(finalText.split("\n").filter((l) => l.includes("→"))[0] ?? ""),
);
check(
  "final widget has usage line (turns/tokens)",
  /\d+ turn|↑/.test(finalText),
);
check("runner ok", run.ok === true, `wall=${run.wallMs}ms`);
check(
  "frame emitted with toolCall item inside single.messages",
  frames[0] != null &&
    frames[0].single.messages.some(
      (m) => Array.isArray(m.content) && m.content.some((b) => b.type === "toolCall"),
    ),
  `outcome=${frames[0]?.outcome} msgs=${frames[0]?.single?.messages?.length}`,
);

// Expanded classical rendering (what Ctrl+O shows)
try {
  const comp = renderResultFrame(frames[0].single, { expanded: true }, theme);
  const text = comp.render(110).join("\n");
  console.log("=== expanded entry ===");
  console.log(text);
  check("expanded has Task/Output sections", text.includes("─── Task ───") && text.includes("─── Output ───"));
  check("expanded lists the tool line before output", text.indexOf("→ ") < text.indexOf("─── Output ───"));
} catch (e) {
  check("expanded render evaluates", false, e.message);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);