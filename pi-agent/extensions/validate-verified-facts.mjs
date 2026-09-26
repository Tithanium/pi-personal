#!/usr/bin/env node
/**
 * validate-verified-facts.mjs — L1 lint for VERIFIED_FACTS.md (no gate).
 *
 * Checks the mechanical contract of a facts line:
 *   - every fact has a real date [YYYY-MM-DD] (also inside [OUT <date>]), not future
 *   - every fact has a priority in {MAJOR, MINOR, SECONDARY}
 *   - every ACTIVE (non-OUT) fact carries a literal `cmd:` token (re-verifiable)
 *   - at most ONE [OUT] line inline per section (older ones → HISTORY)
 *   - STATS header matches reality: active count, OUT-inline count, archived count
 *     (counted in the sibling VERIFIED_FACTS_HISTORY.md), oldest active date
 *
 * Usage:   node validate-verified-facts.mjs [path-to-VERIFIED_FACTS.md]
 *          (default: the agent-global file next to this script)
 * Exit:    0 = clean · 2 = warnings only · 1 = one or more errors
 *
 * Never blocks writes: the facts-sum-hook only surfaces its output as a toast.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(process.argv[2] ?? path.join(HERE, "..", "VERIFIED_FACTS.md"));
const history = path.join(path.dirname(target), "VERIFIED_FACTS_HISTORY.md");

const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

const errors = [];
const warnings = [];
const ref = (n) => `[${path.basename(target)}:${n}]`;

if (!fs.existsSync(target)) {
	console.error(`TARGET NOT FOUND: ${target}`);
	process.exit(1);
}

const lines = fs.readFileSync(target, "utf-8").split(/\r?\n/);
let section = "(header)";
const facts = []; // { no, section, isOut, date, prio, hasCmd, volatile }

lines.forEach((raw, i) => {
	const line = raw.trim();
	if (!line) return;
	if (line.startsWith("## ")) { section = line.replace(/^##\s+/, ""); return; }
	// retro-compatible: accept "- " bullets and legacy "1. " numbering
	if (/^[-*]\s/.test(line) || /^\d+\.\s/.test(line)) {
		facts.push({
			no: i + 1,
			section,
			isOut: /\[OUT\b/.test(line),
			date: (line.match(/\[(?:OUT\s+)?(\d{4}-\d{2}-\d{2})\]/) ?? [])[1] ?? null,
			prio: (line.match(/\[(MAJOR|MINOR|SECONDARY)\]/) ?? [])[1] ?? null,
			hasCmd: line.includes("cmd:"),
			volatile: /\[VOLATILE\]/.test(line),
		});
	}
});

// ---- 1. per-fact mechanical checks -----------------------------------------
for (const f of facts) {
	if (!f.date) {
		errors.push(`${ref(f.no)} missing date (need [YYYY-MM-DD])`);
	} else {
		const d = new Date(`${f.date}T00:00:00Z`);
		if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== f.date) {
			errors.push(`${ref(f.no)} invalid date '${f.date}'`);
		} else if (f.date > today) {
			errors.push(`${ref(f.no)} date '${f.date}' is in the future`);
		}
	}
	if (!f.prio) {
		errors.push(`${ref(f.no)} missing priority [MAJOR|MINOR|SECONDARY]`);
	}
	if (!f.isOut && !f.hasCmd) {
		errors.push(`${ref(f.no)} ACTIVE fact lacks 'cmd:' → not re-verifiable`);
	}
}

// ---- 2. OUT discipline (≤1 inline per section) -----------------------------
const outBySection = new Map();
for (const f of facts) if (f.isOut) outBySection.set(f.section, (outBySection.get(f.section) ?? 0) + 1);
for (const [sec, n] of outBySection) {
	if (n > 1) warnings.push(`section '${sec}' has ${n} inline [OUT] lines — keep the latest only, move older to HISTORY`);
}

// ---- 3. STATS header consistency -------------------------------------------
function parseStats(linesArr) {
	const idx = linesArr.findIndex((l) => l.includes("**STATS**"));
	if (idx === -1) return null;
	let join = linesArr[idx];
	for (let j = idx + 1; j < linesArr.length; j++) {
		const t = linesArr[j].trim();
		if (!t || t.startsWith("#") || t.startsWith("## ") || /^[-*]\s|\d+\.\s/.test(t)) break;
		join += " " + t;
	}
	const parts = join.split("·").map((p) => p.trim());
	const seg = (cond) => parts.find((p) => cond(p)) ?? null;
	const num = (m) => (m ? (m.match(/(\d+)/) ?? [])[1] ?? null : null);
	return {
		active: num(seg((p) => p.includes("active") && !p.includes("oldest"))),
		outInline: num(seg((p) => p.includes("OUT inline"))),
		archived: num(seg((p) => p.includes("archived"))),
		oldestActive: (seg((p) => p.includes("oldest active"))?.match(/(\d{4}-\d{2}-\d{2})/) ?? [])[1] ?? null,
	};
}

const stats = parseStats(lines);
if (stats) {
	const active = facts.filter((f) => !f.isOut).length;
	const outInline = facts.filter((f) => f.isOut).length;

	if (stats.active !== null && Number(stats.active) !== active)
		warnings.push(`STATS says active=${stats.active} but the file has ${active} active facts`);
	if (stats.outInline !== null && Number(stats.outInline) !== outInline)
		warnings.push(`STATS says OUT inline=${stats.outInline} but the file has ${outInline} [OUT] lines`);

	let archived = 0;
	if (fs.existsSync(history)) {
		archived = fs
			.readFileSync(history, "utf-8")
			.split(/\r?\n/)
			.filter((l) => /^[-*]\s/.test(l.trim())).length;
	} else if (stats.archived !== null && Number(stats.archived) > 0) {
		warnings.push(`STATS says archived=${stats.archived} but ${path.basename(history)} does not exist`);
	}
	if (stats.archived !== null && Number(stats.archived) !== archived)
		warnings.push(`STATS says archived=${stats.archived} but HISTORY has ${archived} entries`);

	const dates = facts.filter((f) => !f.isOut).map((f) => f.date).filter(Boolean);
	const oldest = dates.length ? dates.reduce((a, b) => (a < b ? a : b)) : null;
	if (oldest && stats.oldestActive && stats.oldestActive !== oldest)
		warnings.push(`STATS says oldest active=${stats.oldestActive} but actual=${oldest}`);
}

// ---- output + exit code ------------------------------------------------------
const tag = (kind, msg) => `${kind === "ERROR" ? "✖" : "⚠"} ${kind}: ${msg}`;
for (const w of warnings) console.error(tag("WARN", w));
for (const e of errors) console.error(tag("ERROR", e));

if (errors.length) {
	console.error(`\n✖ ${errors.length} error(s), ${warnings.length} warning(s) — ${target}`);
	process.exit(1);
}
if (warnings.length) {
	console.log(`\n✓ PASS with ${warnings.length} warning(s) — ${facts.length} facts, ${target}`);
	process.exit(2);
}
console.log(`✓ PASS — ${facts.length} facts (${facts.filter((f) => !f.isOut).length} active, ${facts.filter((f) => f.isOut).length} OUT), stats OK — ${target}`);
process.exit(0);
