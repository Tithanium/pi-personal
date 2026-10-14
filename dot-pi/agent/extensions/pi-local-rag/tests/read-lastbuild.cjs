// read-lastbuild.cjs — prints last_build (ISO) from the store at argv[2]
const path = process.argv[2];
const m = require("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/node_modules/jiti/lib/jiti.cjs");
const jiti = m(__filename);
const dbmod = jiti("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/db.ts");
const db = dbmod.openDb(path);
const row = db.prepare("SELECT value FROM metadata WHERE key='last_build'").get();
db.close();
console.log(row ? row.value : "never");
