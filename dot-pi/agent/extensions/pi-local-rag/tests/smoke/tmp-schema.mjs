import fs from "node:fs";
const f =
  "C:/Users/connessn/AppData/Roaming/npm/node_modules/@earendil-works/pi-coding-agent/dist/bundle/chunks/chunk-TJXZSVTD.js";
const c = fs.readFileSync(f, "utf8");

// 1) schema field definitions mentioning reasoning/thinking in the custom-provider region
const region = c.slice(2233000, 2270000);
const re = /([A-Za-z_]+)\s*:\s*typebox_exports(?:\.Optional)?\(\s*typebox_exports\.[A-Za-z]+\(\s*\{description:"([^"]{0,300})/g;
let m;
let found = 0;
while ((m = re.exec(region))) {
  const [, key, desc] = m;
  if (/reasoning|thinking/i.test(key + " " + desc)) {
    console.log(`KEY=${key}\n  DESC=${desc}\n`);
    found++;
  }
}
console.log("schema hits:", found);

// 2) how model.reasoning may be set for custom models: look for assignments/uses near "reasoning"
const idxs = [];
let i = 0;
const kw = "reasoning:";
while ((i = c.indexOf(kw, i)) > 0) {
  idxs.push(i);
  i += kw.length;
}
console.log('\n"reasoning:" occurrences:', idxs.length);
// find those NOT inside catalog objects (i.e., outside huge catalog region 1990000-2170000)
const outside = idxs.filter((p) => p < 1990000 || p > 2170000);
for (const p of outside.slice(0, 40)) {
  const w = c.slice(Math.max(0, p - 160), p + 160).replace(/\s+/g, " ");
  console.log(`@${p}: …${w}…\n`);
}