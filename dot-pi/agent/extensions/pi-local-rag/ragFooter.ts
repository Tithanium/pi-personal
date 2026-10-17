/**
 * ragFooter.ts — RAG injection-outcome summary for the pi harness FOOTER.
 *
 * The injection-outcome summary lives in the footer via ctx.ui.setStatus
 * (user decision: NOT the prompt zone / raw stderr writes). Pure,
 * zero-dependency, standalone (imports NOTHING) so any smoke suite can
 * await-import it directly, exactly like config.ts / subprocessD.ts.
 */

/** Footer status key (first ctx.ui.setStatus argument) — one entry per RAG outcome; each dispatch outcome overwrites the previous entry. */
export const RAG_STATUS_KEY = "rag";

/**
 * Footer status key for index/build/refresh PROGRESS (every progress write AND
 * its matching clear/finally). The reserved `RAG_STATUS_KEY` above carries
 * injection OUTCOMES only — a `/rag index|rebuild|refresh` running under this
 * key can never wipe the turn's outcome from the footer. Both keys render in
 * the footer (statuses Map, joined), so progress stays visible next to
 * outcomes. (fix-round critic finding 4 — status-key collision.)
 */
export const RAG_BUILD_STATUS_KEY = "rag-build";

/** Single-line footer budget in chars; longer text is cut to MAX-1 + "…" (ellipsis, no trailing space). */
export const RAG_STATUS_MAX = 72;

export type RagStatusInput =
  | { kind: "injected"; label: string; ms: number; tokensIn: number; tokensOut: number }
  | { kind: "nothing"; label: string; ms: number; why: string }
  | { kind: "failed"; label: string; message: string }
  | { kind: "inactive"; reason: string };

/** Fallback for null/undefined/invalid-object inputs (never throws). */
const FALLBACK = "RAG";
/** Control chars (Cc: \u0000-\u001f incl. \r\n, \u007f-\u009f) + line/para separators — banned: the footer contract is a SINGLE line. */
const CONTROL = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g;

/** Sanitize a text field: control chars → space BEFORE assembly; non-string scalars coerced; anything else → fallback. */
function txt(v: unknown, fb = "?"): string {
  if (typeof v === "string") return v.replace(CONTROL, " ");
  if ((typeof v === "number" && Number.isFinite(v)) || typeof v === "boolean") return String(v);
  return fb;
}

/** Number field: finite → floored string; non-finite/absent → "?" (never shows NaN/Infinity). */
function num(v: unknown): string {
  return typeof v === "number" && Number.isFinite(v) ? String(Math.floor(v)) : "?";
}

/** Enforce the single-line footer budget: trim end, cut to MAX-1 + "…". */
function clamp(s: string): string {
  const oneLine = s.replace(/\s+$/, "");
  if (oneLine.length <= RAG_STATUS_MAX) return oneLine;
  return oneLine.slice(0, RAG_STATUS_MAX - 1).replace(/\s+$/, "") + "\u2026";
}

/**
 * Build the footer status text for one RAG dispatch outcome.
 * PURE, never throws: null / non-object / unknown-kind input → "RAG".
 */
export function buildRagStatusText(i: RagStatusInput): string {
  try {
    if (!i || typeof i !== "object") return FALLBACK;
    const r = i as Record<string, unknown>;
    const kind = typeof r.kind === "string" ? r.kind : "";
    let text: string;
    if (kind === "injected") {
      text = `RAG ${txt(r.label)} ${num(r.ms)}ms ${num(r.tokensIn)}↑/${num(r.tokensOut)}↓`;
    } else if (kind === "nothing") {
      text = `RAG ${txt(r.label)} ${num(r.ms)}ms none — ${txt(r.why)}`;
    } else if (kind === "failed") {
      text = `RAG ${txt(r.label)} FAILED — ${txt(r.message)}`;
    } else if (kind === "inactive") {
      text = `RAG — ${txt(r.reason)}`;
    } else {
      return FALLBACK; // invalid object (e.g. {} or unknown kind)
    }
    return clamp(text.replace(CONTROL, " "));
  } catch {
    return FALLBACK; // defensive belt: the footer must never break a turn
  }
}
