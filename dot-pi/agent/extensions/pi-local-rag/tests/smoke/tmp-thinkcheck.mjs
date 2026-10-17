// temp: which model emits thinking parts historically? (baseline-A)
import fs from "node:fs";
const targets = [
  "C:/Users/connessn/.pi/agent/extensions/pi-local-rag/tests/ab/baseline-A/fedoo_weakform_mesh.raw.jsonl",
  "C:/Users/connessn/.pi/agent/extensions/pi-local-rag/tests/ab/baseline-A/ansys_contact.raw.jsonl",
];
for (const f of targets) {
  if (!fs.existsSync(f)) {
    console.log(f, "MISSING");
    continue;
  }
  const lines = fs.readFileSync(f, "utf8").split(/\r?\n/).filter(Boolean);
  const models = new Set();
  let n = 0;
  let sample = "";
  for (const l of lines) {
    if (!l.includes('"thinking"')) continue;
    let o;
    try {
      o = JSON.parse(l);
    } catch {
      continue;
    }
    const m = o.message;
    if (!m || !Array.isArray(m.content)) continue;
    for (const p of m.content) {
      if (p.type === "thinking") {
        n++;
        if (m.model) models.add(m.model);
        const t = String(p.thinking || p.text || "");
        if (!sample && t) sample = t.slice(0, 240);
      }
    }
  }
  console.log(f.split("/").pop(), "thinkingParts=" + n, "models=" + JSON.stringify([...models]));
  if (sample) console.log("  sample:", JSON.stringify(sample));
}