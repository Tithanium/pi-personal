const m = require("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/node_modules/jiti/lib/jiti.cjs");
const jiti = m(__filename);
const dbmod = jiti("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/db.ts");
const db = dbmod.openDb("C:/Users/connessn/rag_bg_test/rag_pi");
const rows = db.prepare("SELECT path, hash, embedded FROM files").all();
db.close();
rows.forEach(r => console.log(JSON.stringify(r)));
