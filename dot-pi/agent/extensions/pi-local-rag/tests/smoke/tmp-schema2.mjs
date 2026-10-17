import fs from "node:fs";
const f =
  "C:/Users/connessn/AppData/Roaming/npm/node_modules/@earendil-works/pi-coding-agent/dist/bundle/chunks/chunk-TJXZSVTD.js";
const c = fs.readFileSync(f, "utf8");
// where can 'compat' appear in the custom (models.json) schema?
const region = c.slice(2233000, 2270000);
const re = /([A-Za-z_]{3,40})\s*:\s*typebox_exports\.(?:Optional\()?\s*typebox_exports\.Object\(\{[^]{0,200}/g;
let m;
while ((m = re.exec(region))) {
  if (m[0].startsWith("compat")) {
    const key = m[1];
    console.log(`compat declared under KEY=${key}`);
    const w = region.slice(Math.max(0, m.index - 200), m.index + 120).replace(/\s+/g, " ");
    console.log("  context: …" + w + "…\n");
  }
}
// Also: is there a schema property literally named 'compat' inside model object?
const re2 = /(\w+)\s*:\s*typebox_exports\.Optional\(\s*(\w+Schema)\b/g;
while ((m = re2.exec(c.slice(2233000, 2272000)))) {
  if (/Compat/.test(m[2])) console.log("field:", m[1], "=>", m[2]);
}