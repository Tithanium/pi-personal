// Spot-check (P2-R5, extended P2-R6): keyFact signature tokens in the
// full-suite payloads. A reads the cached baseline-A payloads (reference).
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dirs = {
  "A (cached)": join(__dirname, "baseline-A"),
  "B:single": join(__dirname, "results", "B", "single", process.env.RUN_B ?? ""),
  "B:none": join(__dirname, "results", "B", "none", process.env.RUN_N ?? ""),
  "C": join(__dirname, "results", "C", process.env.RUN_C ?? ""),
};
const checks = {
  ansys_large_deflection: ["LNSRCH", "NEQIT"],
  ansys_contact: ["KEYOPT(2)", "PZER"],
  fedoo_plasticity: ["ElastoPlasticity", "nlsolve"],
  fedoo_weakform_mesh: ["nlgeom", "rectangle_mesh"],
  ansys_transient: ["ANTYPE", "TIMINT"],
};
for (const [id, toks] of Object.entries(checks)) {
  let row = id.padEnd(22);
  for (const [label, d] of Object.entries(dirs)) {
    const f = join(d, `${id}.md`);
    const txt = existsSync(f) ? readFileSync(f, "utf-8") : "";
    const res = toks.map((t) => (txt.includes(t) ? "hit" : "MISS"));
    row += ` | ${label}: ${res.join("/")}`;
  }
  console.log(row);
}
