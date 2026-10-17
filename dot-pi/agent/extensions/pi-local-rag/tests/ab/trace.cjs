const fs = require("node:fs");
const lines = fs.readFileSync(process.argv[2], "utf8").split("\n").filter(Boolean);
for (const line of lines) {
  let ev; try { ev = JSON.parse(line); } catch { continue; }
  if (ev.type === "message_end" && ev.message?.role === "assistant") {
    const m = ev.message;
    const tools = (m.content || []).filter(p => p.type === "toolCall").map(p => p.name + "(" + JSON.stringify(p.arguments).slice(0, 70) + ")");
    const text = (m.content || []).filter(p => p.type === "text").map(p => p.text).join("").slice(0, 60).replace(/\n/g, " ");
    console.log("TURN in=" + (m.usage?.input ?? "?"), "out=" + (m.usage?.output ?? "?"), "tools=[" + tools.join(" | ") + "]" + (text ? ' text="' + text + '"' : ""));
  } else if (ev.type === "message_end" && ev.message?.role === "toolResult") {
    const c = (ev.message.content || []).map(p => p.text || "").join("").length;
    console.log("   -> " + ev.message.toolName + " " + c + " chars");
  } else if (ev.type === "agent_end") {
    console.log("AGENT_END");
  }
}
