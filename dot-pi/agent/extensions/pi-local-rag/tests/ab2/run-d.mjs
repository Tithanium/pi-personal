#!/usr/bin/env node
/**
 * run-d.mjs — METHOD D, the completeness reference (goal v3). One-shot, cached,
 * never re-run. Builds tests/ab2/reference-D/<id>/{answer.md, facts.json, meta.json}
 * for the 12-question suite.
 *
 * Two sources (HARD CONSTRAINT: do NOT re-run the 6 phase-1 ids):
 *   FRESH-D (6): fedoo_rectangle_mesh, fedoo_stresseq_nlgeom, ansys_nlgeom_cmd,
 *                ansys_fkn_contact, fedoo_modelingspace, ansys_transient
 *     → spawn a pi child EXACTLY like run-all.mjs (pi --mode json -p --no-session,
 *       model alan/qwen-3.8-27b, JSONL for tokens+final message) with RAW tools
 *       read/bash/ls/find/grep/write (NO rag_* tools), 3600 s anti-hang cap only.
 *       The child researches the corpus, WRITES a strict JSON facts array to
 *       reference-D/<id>/facts.json, and its final message (<=15 KB) = answer.md.
 *   REUSED-PHASE1 (6): ansys_large_deflection, ansys_contact, fedoo_plasticity,
 *                fedoo_weakform_mesh, unrelated_cooking, unrelated_quantum
 *     → copy tests/ab/baseline-A/<id>.md → answer.md (meta from baseline-A/meta.json)
 *       then spawn a fact-EXTRACTION child (same model, tools read/bash/ls/find/grep,
 *       NO write) given the cached answer text + corpus paths; the runner writes the
 *       child's final text (the facts JSON) to facts.json.
 *
 * SELF-VERIFICATION (deterministic, in this runner): for every fact, grep the cited
 * file for the statement's stopword-filtered core tokens within ±3 lines of the cited
 * line → classify pass / fix / drop. verifyPassRate = pass / factsCount.
 *
 * Output:
 *   reference-D/<id>/answer.md, facts.json, meta.json   (per id)
 *   reference-D/meta.json   (totals + per-id table)
 *   reference-D/REPORT.md   (the compact report)
 *
 * Usage:
 *   node run-d.mjs                       # all 12 ids (questions.json order)
 *   node run-d.mjs <id> [<id> …]         # specific ids
 *   node run-d.mjs --force <id> …        # re-run even if a per-id meta.json is done
 *
 * Resumable: an id whose reference-D/<id>/meta.json has done===true is skipped
 * (one-shot cached — never re-run). No commits. Only writes under reference-D/.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync } from "node:fs";
import { join, resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir, tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── pin the SAME global pi the main session runs (not the local dev copy) ────
const cliCandidates = [
  process.env.PI_CLI_PATH,
  join(homedir(), "AppData", "Roaming", "npm", "node_modules", "@earendil-works", "pi-coding-agent", "dist", "bundle", "cli.js"),
].filter(Boolean);
for (const c of cliCandidates) { if (existsSync(c)) { process.env.PI_CLI_PATH = c; break; } }

// Reuse the EXACT spawner + JSONL parsing as the A baseline (run-all.mjs A path).
const { spawnRagSubagent } = await import("../../spawnRagSubagent.ts");

// ── config + constants ───────────────────────────────────────────────────────
const ragConfig = JSON.parse(readFileSync(join(homedir(), ".pi", "rag", "config.json"), "utf-8"));
const TRACKED = Array.isArray(ragConfig.trackedPaths) ? ragConfig.trackedPaths : [];

const MODEL = "alan/qwen-3.8-27b";
const HANG_CAP_MS = 3_600_000; // 3600 s anti-hang cap (NO other budget)
const STALL_MS = 600_000;      // no child output for 10 min → treat as hung
const CAP_HIT_MS = 3_590_000;  // capHit threshold (wallMs >= 3590 s)

const REF_DIR = join(__dirname, "reference-D");
// The phase-1 cached answers (task spec: tests/ab/baseline-A/<id>.md + meta.json)
// live in tests/ab — tests/ab2/baseline-A is a DIFFERENT, partial copy (the two
// unrelated*.md are 0 bytes) and must NOT be used.
const BASELINE_A = join(__dirname, "..", "ab", "baseline-A");
const QUESTIONS_PATH = join(__dirname, "questions.json");
const extRoot = join(__dirname, "..", "..");

const FRESH_SET = new Set([
  "fedoo_rectangle_mesh", "fedoo_stresseq_nlgeom", "ansys_nlgeom_cmd",
  "ansys_fkn_contact", "fedoo_modelingspace", "ansys_transient",
]);
const REUSED_SET = new Set([
  "ansys_large_deflection", "ansys_contact", "fedoo_plasticity",
  "fedoo_weakform_mesh", "unrelated_cooking", "unrelated_quantum",
]);

// ── args ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
let force = false;
const idArgs = [];
for (const a of argv) {
  if (a === "--force") force = true;
  else if (a.startsWith("--")) { /* ignore unknown flags */ }
  else idArgs.push(a);
}

const questions = JSON.parse(readFileSync(QUESTIONS_PATH, "utf-8"));
const qById = new Map(questions.questions.map((q) => [q.id, q]));
const orderedIds = questions.questions.map((q) => q.id);
const runIds = idArgs.length ? idArgs : orderedIds;

mkdirSync(REF_DIR, { recursive: true });

// ── D system prompts (corpus-generic: trackedPaths injected, not hardcoded) ──
function freshSystemPrompt() {
  const corpus = TRACKED.map((p) => `- ${p}`).join("\n");
  return `You are METHOD D — the completeness reference for a local-RAG evaluation. You have FULL RAW access to a documentation corpus and NO retrieval/RAG tools. Be the THOROUGH, exhaustive researcher: identify every fact in the corpus that supports the question, then answer it completely.

CORPUS (your ONLY sources of truth). Research is confined to these tracked paths:
${corpus}
Explore it with the read / grep / find / ls / bash tools. Do NOT use any rag_* retrieval tool — you are defining what is IN the corpus, and a retrieval tool would be circular.

MISSION
1. Research THOROUGHLY before you stop. A complete answer must cover:
   - EVERY sub-ask in the question (split it into sub-questions and address each);
   - EVERY relevant API section — check the guides AND the command reference AND the example scripts before concluding you are done;
   - EVERY relevant example / script file in the corpus that demonstrates the asked topic.
   Use grep to locate candidate files/lines, then read the surrounding context to confirm each fact. Do not stop at the first hit — exhaust the topic across all three source classes (guide, command reference, examples).
2. WRITE THE FACTS. Using the write tool, write a STRICT JSON array to EXACTLY the path given in the task. The file must contain ONLY a valid JSON array (no prose, no markdown fences). Each element is one supporting fact:
     {"statement": "<one specific, verifiable sentence>", "file": "<absolute corpus file path>", "line": <1-indexed line number>}
   - "file" MUST be an absolute path that exists in the corpus, exactly as you read it.
   - "line" MUST be the exact line where the statement is grounded in that file (re-read that line to be sure).
   - Be exhaustive: every sub-ask, every relevant example/script, every related API section. This list IS the completeness reference.
3. FINAL MESSAGE = the complete answer to the question, in Markdown, at most 15 KB. Answer every sub-ask and cite file:line for the key claims. This final message is captured as the answer; the facts array lives in the file, not the message.

RULES
- State only facts grounded in the corpus; cite real file:line you actually read.
- One fact = one specific, verifiable sentence (no compound multi-claim sentences).
- If the question is UNRELATED to the corpus (no relevant content exists), write an EMPTY JSON array [] to the file and say so in the final message.
- You have no query / round / tool budget. Be exhaustive. Do not stop early.`;
}

function freshTaskBody(id, questionText, factsPath) {
  return `QUESTION (id: ${id}):
<<<PROMPT
${questionText}
PROMPT
>>>

Facts output path (write the JSON array here with the write tool): ${factsPath}

Begin the research now. Write the facts array to that exact path, then give your final message (the complete answer, <= 15 KB).`;
}

function extractSystemPrompt(id, answerText) {
  const corpus = TRACKED.map((p) => `- ${p}`).join("\n");
  return `You are the fact-extraction critic for a local-RAG evaluation. You are given a RESEARCH ANSWER (produced earlier) plus read access to the documentation corpus. Your job: list EVERY fact the answer actually states, grounded in the corpus as {statement, file, line}, and VERIFY each one by reading the cited file:line.

CORPUS (the only sources of truth):
${corpus}
You may read / grep / find / ls / bash files in the corpus. You have NO write tool.

PROCEDURE
1. Read the RESEARCH ANSWER below.
2. For each concrete factual claim it states, produce one entry:
     {"statement": "<one specific, verifiable sentence restating the claim>", "file": "<absolute corpus file path>", "line": <1-indexed line number>}
3. VERIFY EACH fact by actually reading the cited file:line:
   - if the fact is correct but stated on a DIFFERENT line, FIX the "line" (and "file" if needed) to the real location;
   - if the corpus does NOT support the claim (absent from the corpus, or a misstatement), DROP the entry;
   - "file" must be an absolute path that exists in the corpus.
4. If the RESEARCH ANSWER states the topic is UNRELATED to the corpus, or contains no corpus-grounded facts, the list MUST be an EMPTY array [].

OUTPUT
Your FINAL MESSAGE must be ONLY a valid JSON array (no prose, no markdown fences) — the array of verified {statement, file, line} facts. Output nothing else.

PROTOCOL (CRITICAL — previous attempts on this task failed in two ways: (a) the turn ended with an EMPTY final message, and (b) the agent looped for hundreds of turns writing "Producing the final JSON array." without ever emitting the array):
- Do NOT end the turn until your final assistant message contains the complete JSON array.
- If at any point you realize you have not yet emitted the array, emit it NOW, before stopping.
- HARD RULE: once you have finished verifying, your very NEXT message must be the JSON array as plain text. Make NO further tool calls after your last verification read.
- LOOP GUARD: if you catch yourself writing "Producing the final JSON array" WITHOUT the array in the same message, that is a protocol violation — stop, and put the array text in that same message.
- You may (optionally) emit intermediate valid partial arrays (one per answer section) as you go; your FINAL message must re-emit the COMPLETE array, not a reference to earlier work.
- Never end with an empty or prose-only message. If the answer has no corpus-grounded facts, the array is [] — still emit it.

RESEARCH ANSWER (id: ${id}):
<<<ANSWER
${answerText}
ANSWER
>>>`;
}

function extractTaskBody() {
  return `Extract and verify the facts from the RESEARCH ANSWER in your system prompt now. Your final message must be ONLY the JSON array (empty [] if no corpus-grounded facts).`;
}

// ── JSON-array extraction (robust to prose / fences around the array) ────────
function extractJsonArray(text) {
  const t = String(text ?? "").trim();
  if (!t) return null;
  try { const v = JSON.parse(t); if (Array.isArray(v)) return v; } catch { /* fall through */ }
  const start = t.indexOf("[");
  if (start < 0) return null;
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < t.length; i++) {
    const ch = t[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) {
        try { const v = JSON.parse(t.slice(start, i + 1)); if (Array.isArray(v)) return v; } catch { /* ignore */ }
        return null;
      }
    }
  }
  return null;
}

// ── self-verification: deterministic core-token check within ±3 lines ────────
const STOPWORDS = new Set((
  "the a an and or of in on to for with is are was were be been being this that these those it its as at by from not no so do does did can could should would may might must will shall we you they he she i our your their his her my me us them him all any some such than then too very just about into over under again further once here there when where why how what which who whom also only own same s t don now " +
  "le la les des du au aux en et ou mais donc ni que qui quoi dont ce cet cette ces il elle ils elles on nous vous je tu se sa son ses mes tes nos vos dans par pour sur sous entre vers avec sans chez est sont etait etre ete as avons avez ont ne pas plus moins tres aussi ainsi tout toute tous toutes meme memes autre autres comme si quand lorsque ou pourquoi comment quel quelle quels quelles celui celle ceux celles "
).split(/\s+/).filter(Boolean));

function tokenizeCore(statement) {
  const lower = String(statement).toLowerCase();
  const words = lower.match(/[a-z0-9_]+/g) || [];
  const seen = new Set();
  const out = [];
  for (const w of words) {
    if (STOPWORDS.has(w)) continue;
    const keep = w.length >= 3 || /[0-9]/.test(w) || w.includes("_");
    if (!keep) continue;
    if (!seen.has(w)) { seen.add(w); out.push(w); }
  }
  return out;
}

const fileCache = new Map(); // absPath -> { lines, fullLower } | null
function loadFile(absPath) {
  if (fileCache.has(absPath)) return fileCache.get(absPath);
  let content;
  try { content = readFileSync(absPath, "utf-8"); } catch { fileCache.set(absPath, null); return null; }
  const rec = { lines: content.split(/\r?\n/), fullLower: content.toLowerCase() };
  fileCache.set(absPath, rec);
  return rec;
}

let basenameIndex = null;
function walk(root, cb) {
  let entries; try { entries = readdirSync(root, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = join(root, e.name);
    if (e.isDirectory()) walk(p, cb);
    else if (e.isFile()) cb(p);
  }
}
function buildBasenameIndex() {
  if (basenameIndex) return basenameIndex;
  const idx = new Map();
  for (const root of TRACKED) {
    if (!existsSync(root)) continue;
    walk(root, (p) => {
      const b = basename(p).toLowerCase();
      if (!idx.has(b)) idx.set(b, []);
      idx.get(b).push(p);
    });
  }
  basenameIndex = idx;
  return idx;
}

function resolveFactFile(citedPath) {
  if (!citedPath) return null;
  const norm = String(citedPath).replace(/\//g, "\\").trim();
  if (!norm) return null;
  const candidates = [resolve(norm)];
  for (const root of TRACKED) candidates.push(resolve(join(root, norm)));
  for (const c of candidates) { if (existsSync(c)) return c; }
  const b = basename(norm).toLowerCase();
  const m = buildBasenameIndex().get(b);
  if (m && m.length) return m[0];
  return null;
}

function verifyFacts(facts) {
  let pass = 0, fix = 0, drop = 0, notFound = 0;
  const details = [];
  for (const f of facts) {
    const file = f && f.file ? String(f.file) : "";
    const line = f && Number.isInteger(f.line) ? f.line : null;
    const stmt = f && f.statement ? String(f.statement) : "";
    let cls, reason;
    const abs = resolveFactFile(file);
    if (!abs) { cls = "drop"; reason = "file-not-found"; notFound++; drop++; details.push({ file, line, cls, reason }); continue; }
    const rec = loadFile(abs);
    if (!rec) { cls = "drop"; reason = "unreadable"; drop++; details.push({ file, line, cls, reason, abs }); continue; }
    const core = tokenizeCore(stmt);
    if (core.length === 0) { cls = "drop"; reason = "no-core-tokens"; drop++; details.push({ file, line, cls, reason, abs }); continue; }
    if (line == null || line < 1) { cls = "drop"; reason = "bad-line"; drop++; details.push({ file, line, cls, reason, abs }); continue; }
    const T = Math.max(1, Math.ceil(0.5 * core.length));
    const lo = Math.max(0, line - 4), hi = Math.min(rec.lines.length - 1, line + 2);
    let win = "";
    for (let i = lo; i <= hi; i++) win += rec.lines[i] + "\n";
    const winLower = win.toLowerCase();
    let windowHit = 0, fileHit = 0;
    for (const t of core) {
      if (winLower.includes(t)) windowHit++;
      if (rec.fullLower.includes(t)) fileHit++;
    }
    if (windowHit >= T) cls = "pass";
    else if (fileHit >= T) cls = "fix";
    else cls = "drop";
    if (cls === "pass") pass++; else if (cls === "fix") fix++; else drop++;
    details.push({ file, line, cls, reason: cls, abs, coreN: core.length, windowHit, fileHit });
  }
  return { pass, fix, drop, notFound, total: facts.length, details };
}

// ── per-id runners ───────────────────────────────────────────────────────────
async function runFresh(id, q, idDir) {
  const factsPath = join(idDir, "facts.json");
  const answerPath = join(idDir, "answer.md");
  const tmpPath = join(tmpdir(), `d-fresh-${id}-${Date.now()}.tmp`);
  const agent = { systemPrompt: freshSystemPrompt(), tools: ["read", "bash", "ls", "find", "grep", "write"], model: MODEL, filePath: "" };
  const task = freshTaskBody(id, q.text, factsPath);
  console.log(`[fresh-D ${id}] spawning research child (model ${MODEL}, cap ${HANG_CAP_MS / 1000}s)…`);
  const run = await spawnRagSubagent({
    prompt: q.text, tmpPath, timeoutMs: HANG_CAP_MS, stallMs: STALL_MS,
    cwd: extRoot, agent, taskBody: task, rawPath: join(idDir, "child.raw.jsonl"),
  });

  const answer = run.finalText ?? "";
  writeFileSync(answerPath, answer, "utf-8");

  let facts = [];
  let factsNote = "";
  if (existsSync(factsPath)) {
    const raw = readFileSync(factsPath, "utf-8");
    const parsed = extractJsonArray(raw);
    if (parsed !== null) {
      facts = parsed;
      writeFileSync(factsPath, JSON.stringify(facts, null, 2), "utf-8"); // normalize to a clean JSON array
    } else {
      facts = [];
      factsNote = "facts.json present but not valid JSON (kept raw)";
    }
  } else {
    factsNote = "child did not produce facts.json";
  }

  const wallMs = run.wallMs || 0;
  const v = verifyFacts(facts);
  const answerBytes = Buffer.byteLength(answer, "utf-8");
  return {
    id, source: "fresh-D",
    wallMs, tokensIn: run.tokensIn, tokensOut: run.tokensOut,
    capHit: wallMs >= CAP_HIT_MS,
    answerBytes, factsCount: facts.length,
    verifyPassRate: facts.length ? +(v.pass / facts.length).toFixed(4) : 0,
    verify: { pass: v.pass, fix: v.fix, drop: v.drop, notFound: v.notFound },
    ok: run.ok, agentEnd: run.agentEnd, timedOut: run.timedOut, stopReason: run.stopReason,
    errorMessage: run.errorMessage || undefined,
    note: [run.timedOut ? "timed-out" : (run.ok ? "ok" : "not-ok"), factsNote, `facts=${facts.length}`].filter(Boolean).join("; "),
  };
}

async function runReused(id, q, idDir) {
  const src = join(BASELINE_A, `${id}.md`);
  const answerPath = join(idDir, "answer.md");
  copyFileSync(src, answerPath);
  const answerText = readFileSync(src, "utf-8");

  let bm = {};
  try {
    const all = JSON.parse(readFileSync(join(BASELINE_A, "meta.json"), "utf-8"));
    bm = all.find((m) => m.id === id) || {};
  } catch { /* no baseline meta */ }

  const agent = { systemPrompt: extractSystemPrompt(id, answerText), tools: ["read", "bash", "ls", "find", "grep"], model: MODEL, filePath: "" };
  const task = extractTaskBody();
  const rawPath = join(idDir, "extract.raw.jsonl");
  console.log(`[reused ${id}] spawning fact-extraction child (model ${MODEL}, cap ${HANG_CAP_MS / 1000}s)…`);
  const run = await spawnRagSubagent({
    prompt: `extract corpus facts for ${id}`, tmpPath: join(tmpdir(), `d-extract-${id}-${Date.now()}.tmp`),
    timeoutMs: HANG_CAP_MS, stallMs: STALL_MS, cwd: extRoot, agent, taskBody: task,
    rawPath,
  });

  const factsPath = join(idDir, "facts.json");
  let extracted = extractJsonArray(run.finalText);
  let recovered = false;
  if (extracted === null && existsSync(rawPath)) {
    // Recovery: union of JSON arrays found in ANY assistant message of the raw
    // stream (partial per-section emissions are valid JSON arrays by protocol).
    const seen = new Set();
    const merged = [];
    const lines = readFileSync(rawPath, "utf-8").split(/\r?\n/);
    for (const l of lines) {
      if (!l.trim()) continue;
      let ev; try { ev = JSON.parse(l); } catch { continue; }
      if (ev.type !== "message_end" || ev.message?.role !== "assistant") continue;
      const text = (Array.isArray(ev.message.content) ? ev.message.content : [])
        .filter((p) => p?.type === "text").map((p) => p.text).join("");
      const arr = extractJsonArray(text);
      if (!arr) continue;
      for (const el of arr) {
        const key = JSON.stringify([el?.statement, el?.file, el?.line]);
        if (seen.has(key)) continue;
        seen.add(key);
        merged.push(el);
      }
    }
    if (merged.length) { extracted = merged; recovered = true; }
  }
  let facts = extracted || [];
  let unrelatedNote = "";
  if (q.corpus === "unrelated" && facts.length) {
    // SPEC: for the 2 unrelated control ids the facts list MUST be empty.
    // Raw entries (corpus-structural statements only, never answer facts)
    // are preserved in extract-raw.json and discarded from the grid.
    writeFileSync(join(idDir, "extract-raw.json"), JSON.stringify(facts, null, 2), "utf-8");
    unrelatedNote = `unrelated-control: ${facts.length} raw extracted entries discarded (extract-raw.json) per spec (list must be empty)`;
    facts = [];
  }
  writeFileSync(factsPath, JSON.stringify(facts, null, 2), "utf-8");

  const v = verifyFacts(facts);
  const wallMs = bm.wallMs ?? 0;
  const answerBytes = Buffer.byteLength(answerText, "utf-8");
  return {
    id, source: "reused-phase1",
    wallMs, tokensIn: bm.tokensIn ?? 0, tokensOut: bm.tokensOut ?? 0,
    wallIsCap: bm.wallIsCap ?? (wallMs >= CAP_HIT_MS),
    capHit: wallMs >= CAP_HIT_MS,
    answerBytes, factsCount: facts.length,
    verifyPassRate: facts.length ? +(v.pass / facts.length).toFixed(4) : 0,
    verify: { pass: v.pass, fix: v.fix, drop: v.drop, notFound: v.notFound },
    extractionWallMs: run.wallMs, extractionTokensIn: run.tokensIn, extractionTokensOut: run.tokensOut,
    extractionOk: run.ok,
    note: `answer copied from baseline-A; extraction ${run.ok ? "ok" : "not-ok"} (${facts.length} facts; extractedJson=${extracted !== null}${recovered ? ", recovered-from-stream" : ""})${unrelatedNote ? "; " + unrelatedNote : ""}`,
  };
}

// ── totals + report ──────────────────────────────────────────────────────────
function computeTotals(perId) {
  const fresh = perId.filter((m) => m.source === "fresh-D");
  const reused = perId.filter((m) => m.source === "reused-phase1");
  const sum = (a, k) => a.reduce((s, m) => s + (Number(m[k]) || 0), 0);
  const factsBy = (a) => a.reduce((s, m) => s + (m.factsCount || 0), 0);
  const vsum = (k) => perId.reduce((s, m) => s + ((m.verify && m.verify[k]) || 0), 0);
  return {
    nIds: perId.length, nFresh: fresh.length, nReused: reused.length,
    totalWallMs: sum(perId, "wallMs"), totalTokensIn: sum(perId, "tokensIn"), totalTokensOut: sum(perId, "tokensOut"),
    factsFresh: factsBy(fresh), factsReused: factsBy(reused), factsTotal: factsBy(perId),
    verifyPass: vsum("pass"), verifyFix: vsum("fix"), verifyDrop: vsum("drop"), verifyNotFound: vsum("notFound"),
    capHit: perId.filter((m) => m.capHit).map((m) => m.id),
    missingFacts: perId.filter((m) => !existsSync(join(REF_DIR, m.id, "facts.json"))).map((m) => m.id),
  };
}

function reportTable(perId) {
  const rows = [
    "| id | source | wallMs | in/out | factsCount | verifyPassRate |",
    "|---|---|---|---|---|---|",
  ];
  for (const m of perId) {
    const vp = m.factsCount ? `${((m.verify.pass) / m.factsCount * 100).toFixed(0)}% (${m.verify.pass}/${m.verify.fix}/${m.verify.drop})` : "n/a";
    rows.push(`| ${m.id} | ${m.source} | ${m.wallMs} | ${m.tokensIn}/${m.tokensOut} | ${m.factsCount} | ${vp} |`);
  }
  return rows.join("\n");
}

function writeReport(perId, totals) {
  const lines = [
    "# METHOD D — completeness reference (goal v3) — report",
    "",
    `- generated: ${new Date().toISOString()}`,
    `- model: ${MODEL}`,
    `- corpus (trackedPaths): ${JSON.stringify(TRACKED)}`,
    `- hang cap: ${HANG_CAP_MS / 1000}s; capHit threshold: ${CAP_HIT_MS / 1000}s`,
    "",
    reportTable(perId),
    "",
    "## Totals",
    `- ids: ${totals.nIds} (fresh-D ${totals.nFresh}, reused-phase1 ${totals.nReused})`,
    `- total wall: ${totals.totalWallMs} ms ; total tokens in/out: ${totals.totalTokensIn}/${totals.totalTokensOut}`,
    `- facts: fresh-D ${totals.factsFresh} + reused ${totals.factsReused} = ${totals.factsTotal}`,
    `- self-verify: pass ${totals.verifyPass} / fix ${totals.verifyFix} / drop ${totals.verifyDrop} (file-not-found ${totals.verifyNotFound})`,
    `- capHit: ${totals.capHit.length ? totals.capHit.join(", ") : "(none)"}`,
    `- missing facts.json: ${totals.missingFacts.length ? totals.missingFacts.join(", ") : "(none)"}`,
    "",
  ];
  writeFileSync(join(REF_DIR, "REPORT.md"), lines.join("\n"), "utf-8");
  console.log("\n" + lines.join("\n"));
}

// ── main ─────────────────────────────────────────────────────────────────────
console.log(`[run-d] METHOD D build — model=${MODEL} corpus=${TRACKED.length} path(s); ids=${runIds.join(",")}`);
const perId = [];
const tStart = Date.now();

for (const id of runIds) {
  const idDir = join(REF_DIR, id);
  mkdirSync(idDir, { recursive: true });
  const metaPath = join(idDir, "meta.json");

  if (!force && existsSync(metaPath)) {
    let m = null;
    try { m = JSON.parse(readFileSync(metaPath, "utf-8")); } catch { /* ignore */ }
    if (m && m.done) {
      console.log(`[skip] ${id} (done — one-shot cached)`);
      perId.push(m);
      continue;
    }
  }

  const q = qById.get(id);
  if (!q) {
    const m = { id, done: true, source: "unknown", note: "not in questions.json" };
    writeFileSync(metaPath, JSON.stringify(m, null, 2), "utf-8");
    perId.push(m);
    console.log(`[warn] ${id} not in questions.json`);
    continue;
  }

  const isFresh = FRESH_SET.has(id);
  if (!isFresh && !REUSED_SET.has(id)) {
    const m = { id, done: true, source: "unknown", note: "id is neither fresh-D nor reused-phase1" };
    writeFileSync(metaPath, JSON.stringify(m, null, 2), "utf-8");
    perId.push(m);
    continue;
  }

  let meta;
  try {
    meta = isFresh ? await runFresh(id, q, idDir) : await runReused(id, q, idDir);
  } catch (err) {
    meta = {
      id, source: isFresh ? "fresh-D" : "reused-phase1", done: false,
      note: `runner error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
  meta.done = true;
  writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf-8");
  perId.push(meta);

  const vp = meta.factsCount ? `${((meta.verify.pass / meta.factsCount * 100).toFixed(0))}%` : "n/a";
  console.log(`[done] ${id} | ${meta.source} | wall=${meta.wallMs}ms | in/out=${meta.tokensIn}/${meta.tokensOut} | facts=${meta.factsCount} | verify=${meta.verify?.pass ?? 0}p/${meta.verify?.fix ?? 0}f/${meta.verify?.drop ?? 0}d (${vp}) | ${meta.note ?? ""}`);
}

// Rebuild global meta + report from ALL ids that now have a per-id meta.json
// (so a partial run still produces a coherent global artifact).
const globalPerId = [];
for (const id of orderedIds) {
  const mp = join(REF_DIR, id, "meta.json");
  if (existsSync(mp)) {
    try { globalPerId.push(JSON.parse(readFileSync(mp, "utf-8"))); } catch { /* ignore */ }
  }
}
const totals = computeTotals(globalPerId);
const globalMeta = {
  generatedAt: new Date().toISOString(),
  model: MODEL,
  corpus: TRACKED,
  method: "D — completeness reference (goal v3)",
  hangCapMs: HANG_CAP_MS, capHitMs: CAP_HIT_MS,
  total: totals,
  ids: globalPerId,
};
writeFileSync(join(REF_DIR, "meta.json"), JSON.stringify(globalMeta, null, 2), "utf-8");
writeReport(globalPerId, totals);

console.log(`\n[run-d] done — ${runIds.length} processed in ${((Date.now() - tStart) / 1000).toFixed(1)}s. global meta + REPORT at ${REF_DIR}`);
