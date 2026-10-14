// setup-pi-store.mjs — prepare an isolated PI_RAG_DIR store for the pi -p tests:
// seed 2 docs, set trackedPaths in config, and optionally backdate last_build (stale).
import fs from "node:fs";
const ROOT = "C:/Users/connessn/rag_bg_test";
const RAG = (ROOT + "/rag_pi").replace(/\\/g, "/");
const DOCS = (ROOT + "/docs3").replace(/\\/g, "/");
const mode = process.argv[2]; // "stale" | "fresh"

const jitiMod = await import("file:///C:/Users/connessn/.pi/agent/extensions/pi-local-rag/node_modules/jiti/lib/jiti.mjs");
const createJiti = jitiMod.default ?? jitiMod.createJiti;
const jiti = createJiti(import.meta.url);
const build = await jiti.import("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/build.ts", { default: false, try: false });
const dbmod = await jiti.import("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/db.ts", { default: false, try: false });

fs.mkdirSync(RAG, { recursive: true });
fs.mkdirSync(DOCS, { recursive: true });
const a = DOCS + "/pi-alpha.md";
const b = DOCS + "/pi-beta.md";
fs.writeFileSync(a, "# Pi alpha\n\n");
for (let j = 0; j < 60; j++) fs.appendFileSync(a, `Alpha line ${j}: the zephyr quokka drinks kombucha near the observatory dome.\n`);
fs.writeFileSync(b, "# Pi beta\n\n");
for (let j = 0; j < 60; j++) fs.appendFileSync(b, `Beta line ${j}: the briny gull maps coastlines with a rusted sextant.\n`);

process.env.PI_RAG_DIR = RAG;
const r = await build.buildAndSwapIndex({ paths: [a, b], copyExisting: true, progress: {} });
console.log("seed indexed=" + r.indexed);

// config: trackedPaths -> docs3
const cfgPath = RAG + "/config.json";
let cfg = {};
try { cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8")); } catch {}
cfg.trackedPaths = [DOCS];
fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));

// last_build
const db = dbmod.openDb(RAG);
if (mode === "stale") {
  const stale = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
  db.prepare("INSERT INTO metadata (key, value) VALUES ('last_build', ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(stale);
  console.log("last_build backdated to " + stale);
} else {
  console.log("last_build = " + db.prepare("SELECT value FROM metadata WHERE key='last_build'").get()?.value);
}
db.close();
console.log("store ready at " + RAG);
