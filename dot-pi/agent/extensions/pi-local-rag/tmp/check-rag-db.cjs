// Read-only RAG index health check.
// Prints: schema tables, row counts, canary rows, per-top-folder doc counts, sample paths.
// Errors are logged explicitly with the failing step for debugging.
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(process.env.USERPROFILE, '.pi', 'rag', 'rag.db');
let db;
try {
  db = new Database(dbPath, { readonly: true, fileMustExist: true });
} catch (e) {
  console.error('FATAL: cannot open db at', dbPath, '->', e.message);
  process.exit(1);
}

try {
  const tables = db.prepare("select name from sqlite_master where type='table'").all().map(r => r.name);
  console.log('tables:', tables.join(', '));

  for (const t of tables) {
    try {
      const c = db.prepare(`select count(*) c from "${t}"`).get().c;
      console.log(`  ${t}: ${c} rows`);
    } catch (e) {
      console.log(`  ${t}: COUNT-ERR ${e.message}`);
    }
  }

  // find a path-bearing table/column
  const candidates = ['files', 'chunks', 'documents', 'docs', 'rows', 'segments'];
  let pathTable = null;
  for (const t of tables) {
    const cols = db.prepare(`pragma table_info("${t}")`).all().map(c => c.name);
    if (cols.includes('path') || cols.includes('file_path') || cols.includes('source')) {
      pathTable = { t, col: cols.includes('path') ? 'path' : cols.includes('file_path') ? 'file_path' : 'source', cols };
      break;
    }
  }
  if (!pathTable) {
    console.error('ERROR: no table with a path-like column found. tables=', tables.join(','));
    process.exit(2);
  }
  console.log('path table:', pathTable.t, 'col:', pathTable.col, 'cols:', pathTable.cols.join(','));

  const { t, col } = pathTable;
  const canary = db.prepare(`select count(*) c from "${t}" where "${col}" like '%canary%'`).get().c;
  console.log('canary rows:', canary);

  const perTop = db.prepare(
    `select "${col}" p, count(*) c from "${t}" group by "${col}" order by c desc limit 20`
  ).all();
  console.log('sample paths (top 20 by count, 1 row per path):');
  for (const r of perTop) console.log('   ', r.c, r.p);

  const roots = db.prepare(
    `select "${col}" p from "${t}" limit 8`
  ).all();
  console.log('first 8 paths:');
  for (const r of roots) console.log('   ', r.p);

  // per-extension counts if a path column exists
  const ext = db.prepare(
    `select lower(substr("${col}", length("${col}") - length(replace("${col}",'.','')) ) ) e, count(*) c from "${t}" limit 0`
  ).get();
} catch (e) {
  console.error('ERROR during query:', e.message);
  process.exit(3);
} finally {
  try { db.close(); } catch (_) {}
}