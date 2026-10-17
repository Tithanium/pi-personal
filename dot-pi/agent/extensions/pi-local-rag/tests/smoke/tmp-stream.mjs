import fs from "node:fs";
const f =
  "C:/Users/connessn/AppData/Roaming/npm/node_modules/@earendil-works/pi-coding-agent/dist/bundle/chunks/openai-completions-QW2B4SML.js";
const c = fs.readFileSync(f, "utf8");
for (const kw of ["isOpenAICompletionsReasoningField", "reasoning.detail", "reasoningDetail", 'type:"thinking"', "reasoning_text"]) {
  let i = 0;
  let n = 0;
  while ((i = c.indexOf(kw, i)) >= 0 && n < 6) {
    console.log(`\n=== ${kw} @ ${i} ===`);
    console.log(c.slice(Math.max(0, i - 450), i + 450).replace(/\s+/g, " "));
    i += kw.length;
    n++;
  }
}