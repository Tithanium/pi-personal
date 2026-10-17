import fs from "node:fs";
const c = fs.readFileSync(
  "C:/Users/connessn/AppData/Roaming/npm/node_modules/@earendil-works/pi-coding-agent/dist/bundle/chunks/openai-completions-QW2B4SML.js",
  "utf8",
);
const i = c.indexOf('reasoningFields=["reasoning_content"');
console.log("idx", i);
console.log(c.slice(i - 2200, i + 1100).replace(/\s+/g, " "));