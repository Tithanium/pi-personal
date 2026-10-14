// test-paths.mjs — path-spelling regression tests:
// T1: mixed-notation skip — index with slash paths, re-index the same files
//     spelled with backslashes (as pi's Windows collector would) -> 0 re-indexed,
//     no duplicate rows.
// T2: one-time migration — a store with backslash rows (pre-fix Windows store)
//     is normalized to slashes on open, single rows, FTS still functional.
import fs from "node:fs";
const ROOT = "C:/Users/connessn/rag_bg_test";
const RAG = (ROOT + "/rag_paths").replace(/\\/g, "/");
const DOCS = (ROOT + "/docs4").replace(/\\/g, "/");

let passed = 0, failed = 0;
function ok(name, cond, extra = "") {
  if (cond) { passed++; console.log(`PASS [${name}] ${extra}`); }
  else { failed++; console.error(`FAIL [${name}] ${extra}`); }
}

const jitiMod = await import("file:///C:/Users/connessn/.pi/agent/extensions/pi-local-rag/node_modules/jiti/lib/jiti.mjs");
const createJiti = jitiMod.default ?? jitiMod.createJiti;
const jiti = createJiti(import.meta.url);
const build = await jiti.import("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/build.ts", { default: false, try: false });
const dbmod = await jiti.import("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/db.ts", { default: false, try: false });

fs.rmSync(RAG, { recursive: true, force: true });
fs.mkdirSync(RAG, { recursive: true });
fs.mkdirSync(DOCS, { recursive: true });
const A = DOCS + "/m1.md";
const B = DOCS + "/m2.md";
fs.writeFileSync(A, "# M1\n\n");
for (let j = 0; j < 60; j++) fs.appendFileSync(A, `Line ${j}: the quick brown fox jumps over the lazy dog. ${j}\n`);
fs.writeFileSync(B, "# M2\n\n");
for (let j = 0; j < 60; j++) fs.appendFileSync(B, `Line ${j}: quantum entanglement and blockchain consensus. ${j}\n`);

const A_SLASH = A.replace(/\\/g, "/");
const B_SLASH = B.replace(/\\/g, "/");
const A_BACK = A.replace(/\//g, "\\");
const B_BACK = B.replace(/\//g, "\\");
console.log(`slash: ${A_SLASH}`);
console.log(`back : ${A_BACK}`);

// ── T1: mixed-notation skip ──
{
  process.env.PI_RAG_DIR = RAG;
  const r1 = await build.buildAndSwapIndex({ paths: [A_SLASH, B_SLASH], copyExisting: true, progress: {} });
  ok("T1 initial (slash) indexes both", r1.indexed === 2, `indexed=${r1.indexed}`);

  // same files, backslash spelling (what pi's Windows collector returns)
  const r2 = await build.buildAndSwapIndex({ paths: [A_BACK, B_BACK], copyExisting: true, progress: {} });
  const db = dbmod.openDb(RAG);
  const rows = db.prepare("SELECT path FROM files ORDER BY path").all().map(r => r.path);
  const fts = db.prepare("SELECT COUNT(*) c FROM chunks_fts WHERE chunks_fts MATCH 'quantum'").get().c;
  db.close();
  ok("T1 backslash re-index skips (0 re-indexed)", r2.indexed === 0 && r2.copied === r1.copied > 0 || r2.indexed === 0,
    `indexed=${r2.indexed} skipped=${r2.skipped} copied=${r2.copied}`);
  ok("T1 no duplicate rows", rows.length === 2, rows.join(" | "));
  ok("T1 rows are slash-normalized", rows.every(p => !p.includes("\\")), rows.join(" | "));
  ok("T1 FTS still functional", fts > 0, `fts-quantum=${fts}`);
}

// ── T2: migration of a pre-fix backslash store ──
{
  const RAG2 = (ROOT + "/rag_paths2").replace(/\\/g, "/");
  fs.rmSync(RAG2, { recursive: true, force: true });
  fs.mkdirSync(RAG2, { recursive: true });
  // Build a "legacy" store: index with backslash paths BEFORE the fix would have
  // done — simulate by writing rows directly with backslash paths.
  process.env.PI_RAG_DIR = RAG2;
  const r0 = await build.buildAndSwapIndex({ paths: [A_SLASH, B_SLASH], copyExisting: true, progress: {} });
  // now rewrite paths to backslash form (simulating the pre-fix store state)
  const db = dbmod.openDb(RAG2);
  db.exec(`
    UPDATE chunks SET file_path = replace(file_path, '/', '\\') WHERE 1;
    UPDATE files SET path = replace(path, '/', '\\') WHERE 1;
  `);
  db.close();
  // reopen -> migration should normalize back to slashes
  const db2 = dbmod.openDb(RAG2);
  const rows = db2.prepare("SELECT path FROM files ORDER BY path").all().map(r => r.path);
  const chunks = db2.prepare("SELECT COUNT(*) c FROM chunks").get().c;
  const backslashLeft = db2.prepare("SELECT COUNT(*) c FROM files WHERE instr(path, '\\') > 0").get().c;
  const fts = db2.prepare("SELECT COUNT(*) c FROM chunks_fts WHERE chunks_fts MATCH 'quantum'").get().c;
  const vec = db2.prepare("SELECT COUNT(*) c FROM chunks_vec").get().c;
  db2.close();
  ok("T2 migration normalizes files rows", backslashLeft === 0 && rows.length === 2, rows.join(" | "));
  ok("T2 chunks/vec intact", chunks > 0 && vec === chunks, `chunks=${chunks} vec=${vec}`);
  ok("T2 FTS functional after migration", fts > 0, `fts-quantum=${fts}`);
  // and a subsequent backslash-spelled refresh skips (identity now matches)
  const r3 = await build.buildAndSwapIndex({ paths: [A_BACK, B_BACK], copyExisting: true, progress: {} });
  ok("T2 post-migration refresh skips", r3.indexed === 0, `indexed=${r3.indexed} skipped=${r3.skipped}`);
}

console.log(`\nRESULT: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
