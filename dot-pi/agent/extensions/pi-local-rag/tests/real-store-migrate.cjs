// real-store-migrate.cjs — open the REAL store (~/.pi/rag, no PI_RAG_DIR),
// let the path-spelling migration run, verify integrity before/after.
const m = require("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/node_modules/jiti/lib/jiti.cjs");
const jiti = m(__filename);
const dbmod = jiti("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/db.ts");

// before: raw open via better-sqlite3 (no migration) to see pre-state
const Database = require("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/node_modules/better-sqlite3");
const store = dbmod.getRagDir ? null : null;
const path = require("path");
const fs = require("fs");
const os = require("os");
const ragDir = path.join(os.homedir(), ".pi", "rag");
console.log("store:", ragDir);
const raw = new Database(path.join(ragDir, "rag.db"), { readonly: true });
const loadVec = require("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/node_modules/sqlite-vec").load;
try { loadVec(raw); } catch {}
const before = {
  files: raw.prepare("SELECT COUNT(*) c FROM files").get().c,
  filesBackslash: raw.prepare("SELECT COUNT(*) c FROM files WHERE instr(path, '\\') > 0").get().c,
  chunks: raw.prepare("SELECT COUNT(*) c FROM chunks").get().c,
  chunksBackslash: raw.prepare("SELECT COUNT(*) c FROM chunks WHERE instr(file_path, '\\') > 0").get().c,
  vec: raw.prepare("SELECT COUNT(*) c FROM chunks_vec").get().c,
  dupCheck: raw.prepare("SELECT COUNT(*) c FROM (SELECT 1 FROM files GROUP BY lower(path) HAVING COUNT(*) > 1)").get().c,
};
raw.close();
console.log("BEFORE:", JSON.stringify(before));

// now open via openDb -> migration runs
const db = dbmod.openDb();
const after = {
  files: db.prepare("SELECT COUNT(*) c FROM files").get().c,
  filesBackslash: db.prepare("SELECT COUNT(*) c FROM files WHERE instr(path, '\\') > 0").get().c,
  chunks: db.prepare("SELECT COUNT(*) c FROM chunks").get().c,
  chunksBackslash: db.prepare("SELECT COUNT(*) c FROM chunks WHERE instr(file_path, '\\') > 0").get().c,
  vec: db.prepare("SELECT COUNT(*) c FROM chunks_vec").get().c,
  dupCheck: db.prepare("SELECT COUNT(*) c FROM (SELECT 1 FROM files GROUP BY lower(path) HAVING COUNT(*) > 1)").get().c,
};
console.log("AFTER: ", JSON.stringify(after));

// FTS + vector sanity
const fts = db.prepare("SELECT COUNT(*) c FROM chunks_fts WHERE chunks_fts MATCH 'agent'").get().c;
console.log("fts 'agent' rows:", fts);
db.pragma("journal_mode = WAL");
db.close();

const ok =
  after.files === before.files &&
  after.chunks === before.chunks &&
  after.vec === before.vec &&
  after.filesBackslash === 0 &&
  after.chunksBackslash === 0 &&
  after.dupCheck === before.dupCheck &&
  fts > 0;
console.log(ok ? "REAL STORE MIGRATION: OK" : "REAL STORE MIGRATION: PROBLEM");
process.exit(ok ? 0 : 1);
