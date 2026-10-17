// probe-thinking.cjs — test whether the ALAN endpoint accepts thinking-disable
// fields. Prints NO key material. Usage: node probe-thinking.cjs
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const m = JSON.parse(fs.readFileSync(path.join(os.homedir(), ".pi", "agent", "models.json"), "utf8"));
const p = m.providers.alan;
const model = "qwen-3.8-27b";

async function probe(label, extra) {
  const t0 = Date.now();
  try {
    const r = await fetch(p.baseUrl + "/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer " + p.apiKey },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "Reply with exactly one word: ok" }],
        max_tokens: 60,
        ...extra,
      }),
      signal: AbortSignal.timeout(90000),
    });
    const j = await r.json().catch(() => ({}));
    const dt = Date.now() - t0;
    const msg = j.choices?.[0]?.message ?? {};
    const usage = j.usage ?? {};
    console.log(
      label + ": http=" + r.status + " " + dt + "ms " +
      "reasoning_content=" + (msg.reasoning_content ? "YES(" + String(msg.reasoning_content).length + "chars)" : "no") +
      " content=" + JSON.stringify(String(msg.content ?? "").slice(0, 40)) +
      " usage=" + JSON.stringify(usage)
    );
  } catch (e) {
    console.log(label + ": ERROR " + e.message + " after " + (Date.now() - t0) + "ms");
  }
}

(async () => {
  await probe("baseline                ", {});
  await probe("chat_template_kwargs    ", { chat_template_kwargs: { enable_thinking: false } });
  await probe("top-level enable_think  ", { enable_thinking: false });
})();
