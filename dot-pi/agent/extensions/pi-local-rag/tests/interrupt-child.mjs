// interrupt-child.mjs — runs in a child process; starts a long build and prints
// BUILD-STARTED once it's underway (parent kills it shortly after).
import fs from "node:fs";
const ROOT = "C:/Users/connessn/rag_bg_test";
process.env.PI_RAG_DIR = (ROOT + "/rag2").replace(/\\/g, "/");
const RAG = process.env.PI_RAG_DIR;

const jitiMod = await import("file:///C:/Users/connessn/.pi/agent/extensions/pi-local-rag/node_modules/jiti/lib/jiti.mjs");
const createJiti = jitiMod.default ?? jitiMod.createJiti;
const jiti = createJiti(import.meta.url);
const build = await jiti.import("C:/Users/connessn/.pi/agent/extensions/pi-local-rag/build.ts", { default: false, try: false });

const DOCS = ROOT + "/docs2";
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

console.log("BUILD-STARTED");
try {
  const r = await build.buildAndSwapIndex({
    paths: big,
    copyExisting: true,
    progress: {
      onEmbed: (done, total) => console.log(`EMBED-GROUP ${done} ${total}`),
    },
  });
  console.log("BUILD-DONE indexed=" + r.indexed + " copied=" + r.copied);
} catch (err) {
  console.log("BUILD-ERROR " + String(err.message || err).slice(0, 120));
}
process.exit(0);
