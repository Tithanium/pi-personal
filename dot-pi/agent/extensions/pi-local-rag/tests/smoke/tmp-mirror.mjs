// tmp-mirror.mjs — TEMPORARY: logs the child's exact request body to
// tmp-mirror.log and forwards it to the real alan gateway (stream passthru).
import http from "node:http";
import fs from "node:fs";

const UPSTREAM = "https://alan.univ-grenoble-alpes.fr";
const LOG = `C:/Users/connessn/.pi/agent/extensions/pi-local-rag/tests/smoke/tmp-mirror-${process.pid}.log`;

const server = http.createServer((req, res) => {
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const body = Buffer.concat(chunks);
    try {
      const j = JSON.parse(body.toString("utf8"));
      const summary = {
        url: req.url,
        keys: Object.keys(j),
        model: j.model,
        stream: j.stream,
        stream_options: j.stream_options,
        enable_thinking: j.enable_thinking,
        reasoning_effort: j.reasoning_effort,
        chat_template_kwargs: j.chat_template_kwargs,
        thinking: j.thinking,
        max_tokens: j.max_tokens,
        temperature: j.temperature,
        toolsCount: Array.isArray(j.tools) ? j.tools.length : 0,
        msgRoles: (j.messages || []).map((m) => m.role),
        extraKeys: Object.keys(j).filter((k) =>
          !["model","messages","stream","stream_options","tools","max_tokens","temperature","top_p","n","stop","presence_penalty","frequency_penalty"].includes(k),
        ),
      };
      fs.appendFileSync(LOG, JSON.stringify(summary) + "\n");
    } catch (e) {
      fs.appendFileSync(LOG, "UNPARSE " + e.message + "\n");
    }

    const headers = { ...req.headers };
    delete headers.host;
    delete headers["content-length"];
    headers.host = "alan.univ-grenoble-alpes.fr";

    const up = https.request(
      UPSTREAM + req.url,
      { method: req.method, headers },
      (ur) => {
        res.writeHead(ur.statusCode, ur.headers);
        ur.pipe(res);
      },
    );
    up.on("error", (e) => {
      try {
        res.writeHead(502);
        res.end(JSON.stringify({ error: { message: "mirror: " + e.message } }));
      } catch {}
    });
    if (body.length) up.write(body);
    up.end();
  });
});

import https from "node:https";
server.listen(8787, "127.0.0.1", () => console.log("mirror pid " + process.pid + " on 127.0.0.1:8787 -> " + UPSTREAM));