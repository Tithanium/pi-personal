// load-smoke.mjs — import the extension the same way pi does (jiti).
const path = "C:/Users/connessn/.pi/agent/extensions/pi-local-rag/index.ts";
const jitiMod = await import("file:///C:/Users/connessn/.pi/agent/extensions/pi-local-rag/node_modules/jiti/lib/jiti.mjs");
const createJiti = jitiMod.default ?? jitiMod.createJiti;
const jiti = createJiti(import.meta.url);
try {
  const mod = await jiti.import(path, { default: false, try: false });
  const keys = Object.keys(mod);
  console.log("IMPORT OK");
  console.log("exports:", keys.join(", "));
  const missing = ["buildAndSwapIndex", "withBuildLock", "isBuildActive", "cleanupOrphanedSecondaries"].filter(k => !(k in mod));
  if (missing.length) { console.error("MISSING EXPORTS:", missing); process.exit(1); }
  console.log("new exports present ✓");
  if (typeof mod.default !== "function") { console.error("default export is not a function"); process.exit(1); }
  console.log("default export fn ✓");
} catch (err) {
  console.error("IMPORT FAILED:", err.message);
  process.exit(1);
}
