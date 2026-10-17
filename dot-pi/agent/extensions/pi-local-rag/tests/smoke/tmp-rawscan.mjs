import fs from "node:fs";
const raw = "C:/Users/connessn/AppData/Local/Temp/rag-probe-raw.jsonl";
const lines = fs.existsSync(raw) ? fs.readFileSync(raw, "utf8").split(/\r?\n/).filter(Boolean) : [];
const ev = {};
const partTypes = new Set();
let mentionLines = 0;
let sample = "";
for (const l of lines) {
  let o;
  try {
    o = JSON.parse(l);
  } catch {
    continue;
  }
  const k = o.type + (o.assistantMessageEvent ? "/" + o.assistantMessageEvent.type : "");
  ev[k] = (ev[k] || 0) + 1;
  if (o.message && Array.isArray(o.message.content))
    for (const p of o.message.content) partTypes.add(p.type);
  if (/thinking|reasoning/i.test(l)) {
    mentionLines++;
    if (!sample) {
      const m = l.match(/.{0,120}(thinking|reasoning).{0,160}/i);
      sample = m ? m[0] : "";
    }
  }
}
console.log("lines:", lines.length);
console.log("events:", JSON.stringify(ev, null, 1));
console.log("partTypes:", [...partTypes].join(","));
console.log("lines mentioning thinking/reasoning:", mentionLines);
if (sample) console.log("sample:", sample);