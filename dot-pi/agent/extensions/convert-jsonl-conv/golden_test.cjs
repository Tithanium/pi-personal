/* Golden test: TS port (index.ts) vs Python original (jsonl_to_messages.py),
   byte-for-byte over ALL real session .jsonl files x both modes.
   Outputs are written to a temp dir, hashed, compared, deleted per file. */
const path = require("path");
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const PI = "C:/Users/connessn/AppData/Roaming/npm/node_modules/@earendil-works/pi-coding-agent";
const { createJiti } = require(path.join(PI, "node_modules", "jiti"));
const jiti = createJiti(__filename);
const EXT = path.join(__dirname, "index.ts"); // lives next to the extension
const PY = "C:/Users/connessn/.pi/jsonl_to_messages.py";
const TMP = path.join(os.tmpdir(), "golden-jsonl");

function listFiles(dir, base = dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) listFiles(full, base, out);
    else out.push(path.relative(base, full));
  }
  return out;
}
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const rm = (p) => fs.rmSync(p, { recursive: true, force: true });

(async () => {
  rm(TMP);
  fs.mkdirSync(TMP, { recursive: true });
  const ns = await jiti.import(EXT);
  const files = ns.findSessionFiles();
  console.log(`files: ${files.length}`);

  let compares = 0, bad = 0, pyNonZero = 0;
  const problems = [];

  for (let i = 0; i < files.length; i++) {
    const src = files[i];
    for (const mode of ["readable", "json"]) {
      const pyDir = path.join(TMP, `py_${i}_${mode}`);
      const tsDir = path.join(TMP, `ts_${i}_${mode}`);

      const args = mode === "readable" ? ["--readable", src, pyDir] : [src, pyDir];
      const py = spawnSync("python", [PY, ...args], { encoding: "utf8" });
      compares++;
      if (py.status !== 0) {
        pyNonZero++;
        problems.push(`PY-EXIT ${py.status} ${mode} ${path.basename(src)} :: ${(py.stderr || "").slice(0, 200)}`);
      }

      const out = ns.convertSession(src, mode, tsDir);

      // summary parity = the exact line the command notifies (normalize dest dir)
      const pyLines = (py.stdout || "").trim().split(/\r?\n/).filter(Boolean);
      const pySummary = (pyLines[pyLines.length - 1] || "").replace(pyDir, "<DIR>").trim();
      const tsSummary = out.summary.replace(tsDir, "<DIR>").trim();
      if (pySummary !== tsSummary && py.status === 0) {
        bad++;
        problems.push(`SUMMARY ${mode} ${path.basename(src)}\n   py=[${pySummary}]\n   ts=[${tsSummary}]`);
      }

      // byte-for-byte directory comparison
      const a = fs.existsSync(pyDir) ? listFiles(pyDir) : [];
      const b = fs.existsSync(tsDir) ? listFiles(tsDir) : [];
      const setA = a.join("|"), setB = b.join("|");
      if (setA !== setB) {
        bad++;
        problems.push(`SET ${mode} ${path.basename(src)}\n   py=[${a.join(", ")}]\n   ts=[${b.join(", ")}]`);
      } else {
        for (const rel of a) {
          if (sha(path.join(pyDir, rel)) !== sha(path.join(tsDir, rel))) {
            bad++;
            problems.push(`BYTES ${mode} ${path.basename(src)} :: ${rel}`);
            break;
          }
        }
      }
      rm(pyDir);
      rm(tsDir);
    }
    if ((i + 1) % 25 === 0) console.log(`  ${i + 1}/${files.length} done (bad so far: ${bad})`);
  }

  rm(TMP);
  console.log(`\ncompares: ${compares} (=${files.length} files x 2 modes) | py-nonzero-exit: ${pyNonZero} | mismatches: ${bad}`);
  for (const p of problems.slice(0, 30)) console.log("PROBLEM:", p);
  console.log(bad === 0 && pyNonZero === 0 ? "GOLDEN: ALL BYTE-IDENTICAL" : "GOLDEN: FAILURES ABOVE");
  process.exit(bad === 0 && pyNonZero === 0 ? 0 : 1);
})().catch((e) => {
  console.error("THREW:", e);
  process.exit(1);
});