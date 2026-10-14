// interrupt-test.mjs — crash-recovery test:
// 1) seed a completed store at rag2 (2 small docs)
// 2) start an incremental build of 12 large docs in a child process, KILL it mid-embed
// 3) assert: live rag.db intact + queryable, exactly one orphaned secondary, cleanup removes it,
//    and a subsequent full build completes.
import fs from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const SELF_DIR = dirname(fileURLToPath(import.meta.url));

const ROOT = "C:/Users/connessn/rag_bg_test";
const RAG = (ROOT + "/rag2").replace(/\\/g, "/");
const DOCS = ROOT + "/docs2";

let passed = 0, failed = 0;
function ok(name, cond, extra = "") {
  if (cond) { passed++; console.log(`PASS [${name}] ${extra}`); }
  else { failed++; console.error(`FAIL [${name}] ${extra}`); }
}
function countSecondary(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.startsWith("rag.db.build-") || /^rag\.db\.old-/.test(f));
}

const jitiMod = await import("file:///C:/Users/connessn/.pi/agent/extensions/pi-local-rag/node_modules/jiti/lib/jiti.mjs");
const createJiti = jitiMod.default ?? jitiMod.createJiti;
const jiti = createJiti(import.meta.url);
const build = await jiti.import("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/build.ts", { default: false, try: false });
const dbmod = await jiti.import("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/db.ts", { default: false, try: false });

// ── 1) seed store ──
fs.rmSync(RAG, { recursive: true, force: true });
fs.mkdirSync(RAG, { recursive: true });
fs.rmSync(DOCS, { recursive: true, force: true });
fs.mkdirSync(DOCS, { recursive: true });
const s1 = (DOCS + "/seed1.md").replace(/\\/g, "/");
const s2 = (DOCS + "/seed2.md").replace(/\\/g, "/");
fs.writeFileSync(s1, "# Seed one\n\nThe quick brown fox jumps over the lazy dog. Alpine skiing is wonderful in the mountains.\n".repeat(6));
fs.writeFileSync(s2, "# Seed two\n\nQuantum entanglement and blockchain consensus protocols across distributed nodes.\n".repeat(6));
process.env.PI_RAG_DIR = RAG;
const seed = await build.buildAndSwapIndex({ paths: [s1, s2], copyExisting: true, progress: {} });
const db = dbmod.openDb(RAG);
const seedChunks = db.prepare("SELECT COUNT(*) c FROM chunks").get().c;
const seedFiles = db.prepare("SELECT COUNT(*) c FROM files").get().c;
db.close();
ok("seed store built", seed.indexed === 2 && seedFiles === 2 && seedChunks > 0, `files=${seedFiles} chunks=${seedChunks}`);

// ── 2) start long build in child, kill mid-flight ──
let childOut = "";
const child = spawn(process.execPath, [join(SELF_DIR, "interrupt-child.mjs")], { stdio: ["ignore", "pipe", "pipe"] });
const exitInfo = new Promise(res => child.on("exit", (code, signal) => res({ code, signal })));
child.stdout.on("data", d => { childOut += d; });
child.stderr.on("data", d => { childOut += d; });

const killTimer = await new Promise(resolve => {
  const t = setInterval(() => {
    if (/EMBED-GROUP \d+ \d+/.test(childOut)) {
      clearInterval(t);
      // first embedding group is done; the build still has several groups to go
      setTimeout(() => { try { child.kill("SIGTERM"); } catch {} resolve(); }, 500);
    }
  }, 50);
  setTimeout(() => { clearInterval(t); resolve(); }, 120000); // safety
});
const info = await exitInfo;
ok("child killed mid-build", childOut.includes("BUILD-STARTED") && !childOut.includes("BUILD-DONE"),
  `exit code=${info.code} signal=${info.signal}; out: ${childOut.trim().slice(0, 120)}`);

// ── 3) verify crash aftermath ──
const orphanFiles = countSecondary(RAG);
const orphanBases = [...new Set(orphanFiles.map(f => f.replace(/-(wal|shm)$/i, "")))];
ok("one orphaned secondary after crash", orphanBases.length === 1, orphanFiles.join(",") || "(none)");

const db2 = dbmod.openDb(RAG);
const filesNow = db2.prepare("SELECT COUNT(*) c FROM files").get().c;
const chunksNow = db2.prepare("SELECT COUNT(*) c FROM chunks").get().c;
const fts = db2.prepare("SELECT COUNT(*) c FROM chunks_fts WHERE chunks_fts MATCH 'quantum'").get().c;
db2.close();
ok("live DB intact + queryable after crash", filesNow === seedFiles && chunksNow === seedChunks && fts > 0,
  `files=${filesNow} chunks=${chunksNow} fts-quantum=${fts}`);

const removed = build.cleanupOrphanedSecondaries(RAG);
ok("orphan cleanup removes crashed secondary", removed === orphanFiles.length && countSecondary(RAG).length === 0, `removed=${removed} (of ${orphanFiles.length} files)`);

// ── 4) recovery build completes ──
// create the big docs (same as child would) and build to completion
const big = [];
for (let i = 0; i < 20; i++) {
  const p = (DOCS + `/big${i}.md`).replace(/\\/g, "/");
  let body = `# Big document ${i}\n\n`;
  for (let j = 0; j < 2500; j++) {
    body += `Paragraph ${j} of document ${i}. Topic ${j % 37}: observation number ${j * 7 % 997} measured ${j % 101} percent with margin ${j % 13}.\n`;
  }
  fs.writeFileSync(p, body);
  big.push(p);
}
const rec = await build.buildAndSwapIndex({ paths: [s1, s2, ...big], copyExisting: true, progress: {} });
const db3 = dbmod.openDb(RAG);
const filesAfter = db3.prepare("SELECT COUNT(*) c FROM files").get().c;
const chunksAfter = db3.prepare("SELECT COUNT(*) c FROM chunks").get().c;
const vecAfter = db3.prepare("SELECT COUNT(*) c FROM chunks_vec").get().c;
db3.close();
ok("recovery build completes", rec.indexed === 20 && filesAfter === 22 && chunksAfter > seedChunks && vecAfter === chunksAfter && countSecondary(RAG).length === 0,
  `indexed=${rec.indexed} files=${filesAfter} chunks=${chunksAfter} vec=${vecAfter}`);

console.log(`\nRESULT: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
