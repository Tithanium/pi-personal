// test-build.mjs — module-level tests for buildAndSwapIndex (build-aside + atomic swap).
// Uses an isolated store: PI_RAG_DIR -> rag_bg_test/rag (never touches the real index).
import fs from "node:fs";
import path from "node:path";

const ROOT = "C:/Users/connessn/rag_bg_test";
process.env.PI_RAG_DIR = path.join(ROOT, "rag").replace(/\\/g, "/");
const DOCS = path.join(ROOT, "docs");
const RAG = process.env.PI_RAG_DIR;

let passed = 0, failed = 0;
function ok(name, cond, extra = "") {
  if (cond) { passed++; console.log(`PASS [${name}] ${extra}`); }
  else { failed++; console.error(`FAIL [${name}] ${extra}`); }
}
function countSecondary(dir) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter(f => f.startsWith("rag.db.build-") || /^rag\.db\.old-/.test(f)).length;
}

// ── fixtures ──
fs.mkdirSync(DOCS, { recursive: true });
const A = path.join(DOCS, "alpha.md").replace(/\\/g, "/");
const B = path.join(DOCS, "beta.md").replace(/\\/g, "/");
const C = path.join(DOCS, "gamma.md").replace(/\\/g, "/");
fs.writeFileSync(A, "# Alpha doc\n\nThe quick brown fox jumps over the lazy dog. Alpine skiing in the mountains is wonderful.\n".repeat(4));
fs.writeFileSync(B, "# Beta doc\n\nQuantum entanglement allows particles to share states across distances. Blockchain consensus protocols.\n".repeat(4));
fs.writeFileSync(C, "# Gamma doc\n\nPhotovoltaic cells convert sunlight into electricity. Wind turbines generate renewable power.\n".repeat(4));

const jitiMod = await import("file:///C:/Users/connessn/.pi/agent/extensions/pi-local-rag/node_modules/jiti/lib/jiti.mjs");
const createJiti = jitiMod.default ?? jitiMod.createJiti;
const jiti = createJiti(import.meta.url);
const build = await jiti.import("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/build.ts", { default: false, try: false });
const dbmod = await jiti.import("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/db.ts", { default: false, try: false });

// fresh store
fs.rmSync(RAG, { recursive: true, force: true });
fs.mkdirSync(RAG, { recursive: true });

// ── T1: initial build (no live DB yet) ──
{
  const t0 = Date.now();
  const r = await build.buildAndSwapIndex({ paths: [A, B], copyExisting: true, progress: {} });
  const db = dbmod.openDb(RAG);
  const files = db.prepare("SELECT COUNT(*) c FROM files").get().c;
  const chunks = db.prepare("SELECT COUNT(*) c FROM chunks").get().c;
  const vec = db.prepare("SELECT COUNT(*) c FROM chunks_vec").get().c;
  const lastBuild = db.prepare("SELECT value FROM metadata WHERE key='last_build'").get()?.value;
  db.close();
  ok("T1 initial build", r.copied === 0 && r.indexed === 2 && files === 2 && chunks > 0 && vec === chunks && !!lastBuild,
    `indexed=${r.indexed} files=${files} chunks=${chunks} vec=${vec} in ${Date.now() - t0}ms`);
  ok("T1 no leftovers", countSecondary(RAG) === 0, `secondary=${countSecondary(RAG)}`);
}

// ── T2: no-op swap (empty paths, copy existing) — copy + swap integrity ──
{
  const db = dbmod.openDb(RAG);
  const before = { chunks: db.prepare("SELECT COUNT(*) c FROM chunks").get().c, vec: db.prepare("SELECT COUNT(*) c FROM chunks_vec").get().c };
  db.close();
  const r = await build.buildAndSwapIndex({ paths: [], copyExisting: true, progress: {} });
  const db2 = dbmod.openDb(RAG);
  const after = { chunks: db2.prepare("SELECT COUNT(*) c FROM chunks").get().c, vec: db2.prepare("SELECT COUNT(*) c FROM chunks_vec").get().c };
  // FTS still functional
  const fts = db2.prepare("SELECT COUNT(*) c FROM chunks_fts WHERE chunks_fts MATCH 'quantum'").get().c;
  // vectors still queryable (KNN)
  const { embed } = await jiti.import("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/embed.ts", { default: false, try: false });
  const qv = await embed("quantum entanglement particles");
  const buf = Buffer.from(new Float32Array(qv).buffer);
  const knn = db2.prepare("SELECT rowid, distance FROM chunks_vec WHERE embedding MATCH ? LIMIT 3").bind(buf).all();
  db2.close();
  ok("T2 no-op swap keeps data", r.copied === before.chunks && after.chunks === before.chunks && after.vec === before.vec,
    `copied=${r.copied} chunks ${before.chunks}->${after.chunks} vec ${before.vec}->${after.vec}`);
  ok("T2 FTS functional", fts > 0, `fts 'quantum' rows=${fts}`);
  ok("T2 vector KNN functional", knn.length === Math.min(3, before.vec), `knn rows=${knn.length} (vectors=${before.vec}) nearest dist=${knn[0]?.distance?.toFixed(4)}`);
  ok("T2 no leftovers", countSecondary(RAG) === 0, `secondary=${countSecondary(RAG)}`);
}

// ── T3: incremental + prune (add C, skip unchanged A, prune B) ──
{
  const db = dbmod.openDb(RAG);
  const bChunks = db.prepare("SELECT COUNT(*) c FROM chunks WHERE file_path = ?").get(B).c;
  db.close();
  const r = await build.buildAndSwapIndex({ paths: [A, C], copyExisting: true, deletePaths: [B], progress: {} });
  const db2 = dbmod.openDb(RAG);
  const files = db2.prepare("SELECT path FROM files ORDER BY path").all().map(f => f.path);
  const bLeft = db2.prepare("SELECT COUNT(*) c FROM chunks WHERE file_path = ?").get(B).c;
  const cCount = db2.prepare("SELECT COUNT(*) c FROM chunks WHERE file_path = ?").get(C).c;
  db2.close();
  ok("T3 incremental + prune", r.indexed === 1 && r.pruned === bChunks && files.length === 2 && !files.includes(B) && files.includes(C) && bLeft === 0 && cCount > 0,
    `indexed=${r.indexed} pruned=${r.pruned} files=${files.map(f => f.split(/[\\/]/).pop()).join(",")} bLeft=${bLeft}`);
  ok("T3 no leftovers", countSecondary(RAG) === 0, `secondary=${countSecondary(RAG)}`);
}

// ── T4: force from-scratch build ──
{
  const r = await build.buildAndSwapIndex({ paths: [A, C], force: true, copyExisting: false, progress: {} });
  const db = dbmod.openDb(RAG);
  const files = db.prepare("SELECT COUNT(*) c FROM files").get().c;
  const chunks = db.prepare("SELECT COUNT(*) c FROM chunks").get().c;
  const vec = db.prepare("SELECT COUNT(*) c FROM chunks_vec").get().c;
  db.close();
  ok("T4 force from scratch", r.copied === 0 && r.indexed === 2 && files === 2 && chunks > 0 && vec === chunks,
    `copied=${r.copied} indexed=${r.indexed} files=${files} chunks=${chunks} vec=${vec}`);
  ok("T4 no leftovers", countSecondary(RAG) === 0, `secondary=${countSecondary(RAG)}`);
}

// ── T5: (removed — Windows does not enforce dir read-only via chmod on this
// machine, so EPERM cannot be induced that way. Crash behavior is covered by
// interrupt-test.mjs: a build killed mid-embed must leave the live DB intact
// and only an orphaned secondary file behind.)

// ── T6: build lock serializes builds ──
{
  const order = [];
  const p1 = build.withBuildLock("one", async () => {
    order.push("one-start");
    await new Promise(r => setTimeout(r, 200));
    order.push("one-end");
  });
  const p2 = build.withBuildLock("two", async () => {
    order.push("two-start");
    order.push("two-end");
  });
  await Promise.all([p1, p2]);
  ok("T6 lock serializes", order.join(",") === "one-start,one-end,two-start,two-end", order.join(","));
}

// ── T7: orphan cleanup ──
{
  fs.writeFileSync(path.join(RAG, "rag.db.build-12345-abcd"), "orphan");
  fs.writeFileSync(path.join(RAG, "rag.db.build-12345-abcd-wal"), "orphan wal");
  fs.writeFileSync(path.join(RAG, "rag.db.old-999"), "orphan aside");
  const removed = build.cleanupOrphanedSecondaries(RAG);
  ok("T7 orphan cleanup", removed === 3 && countSecondary(RAG) === 0, `removed=${removed}`);
}

console.log(`\nRESULT: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
