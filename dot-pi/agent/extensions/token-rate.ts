/**
 * token-rate.ts — live output token rate in the footer status line
 *
 * Appends to the DEFAULT footer (pi.ui.setStatus), so the context size line
 * (↑ ↓ R W CH% $ ctx%) is preserved untouched. The rate shows on the third
 * footer line, e.g.:
 *
 *   ~\proj (main)
 *   ↑12.3k ↓4.1k R90.2k W2.1k CH97.5% $0.421 34.2%/200k (auto)      my-model
 *   ⚡ 87.3 tok/s
 *
 * How it works:
 *  - `message_update` fires on every streamed token (event.message = partial
 *    assistant message). We measure growth between updates:
 *      1. real `usage.output` delta when the provider streams usage live
 *         (Anthropic, OpenAI final chunk, etc.);
 *      2. fallback: text/thinking character growth / 4 (token estimate).
 *  - Exponential moving average (α=0.3) smooths the rate.
 *  - UI updates throttled to 4/s.
 *  - On `message_end` the status shows the final average rate of the last
 *    response (keeps visible; next generation overwrites it).
 *
 * Auto-discovered: extensions/ root .ts. Apply with /reload.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const STATUS_KEY = "tokenrate";
const UI_THROTTLE_MS = 250; // max ~4 footer updates/second
const MIN_WINDOW_MS = 300; // ignore windows shorter than this (rate noise)
const EMA_ALPHA = 0.3; // higher = snappier, lower = smoother

interface Msg {
  role?: string;
  usage?: { output?: number };
  content?: Array<{ type?: string; text?: string; thinking?: string }>;
}

export default function (pi: ExtensionAPI) {
  let last: { time: number; out: number; chars: number } | null = null;
  let streamStart: { time: number; startOut: number } | null = null;
  let emaRate = 0;
  let lastUiUpdate = 0;

  const outputTokens = (m: Msg): number => {
    const o = m.usage?.output;
    return typeof o === "number" && o > 0 ? o : 0;
  };

  const contentChars = (m: Msg): number =>
    (m.content ?? []).reduce((sum, block) => {
      if (block.type === "text" && block.text) return sum + block.text.length;
      if (block.type === "thinking" && block.thinking)
        return sum + block.thinking.length;
      return sum;
    }, 0);

  const setStatus = (text: string | undefined) => {
    try {
      pi.ui.setStatus(STATUS_KEY, text);
    } catch {
      /* non-interactive mode */
    }
  };

  const maybeRender = (force: boolean) => {
    const now = Date.now();
    if (!force && now - lastUiUpdate < UI_THROTTLE_MS) return;
    lastUiUpdate = now;
    if (emaRate >= 0.5) setStatus(`⚡ ${emaRate.toFixed(1)} tok/s`);
    else setStatus(undefined);
  };

  pi.on("message_start", (event: { message?: Msg }) => {
    if (event.message?.role !== "assistant") return;
    const out = outputTokens(event.message);
    streamStart = { time: Date.now(), startOut: out };
    last = { time: Date.now(), out, chars: contentChars(event.message) };
    emaRate = 0;
    setStatus("⚡ …");
  });

  pi.on("message_update", (event: { message?: Msg }) => {
    const m = event.message;
    if (!m || m.role !== "assistant") return;
    const now = Date.now();
    const out = outputTokens(m);
    const chars = contentChars(m);
    if (!last) {
      last = { time: now, out, chars };
      return;
    }
    const dtMs = now - last.time;
    if (dtMs < MIN_WINDOW_MS) return; // window too short → noisy rate

    // Prefer real usage delta; estimate from character growth otherwise.
    const dOut = out - last.out;
    const tokens = dOut > 0 ? dOut : (chars - last.chars) / 4;
    if (tokens > 0) {
      const instRate = tokens / (dtMs / 1000);
      emaRate = emaRate > 0 ? (1 - EMA_ALPHA) * emaRate + EMA_ALPHA * instRate : instRate;
    }
    last = { time: now, out, chars };
    maybeRender(false);
  });

  pi.on("message_end", (event: { message?: Msg }) => {
    const m = event.message;
    if (!m || m.role !== "assistant") return;
    const durS = streamStart ? (Date.now() - streamStart.time) / 1000 : 0;
    const totalOut = outputTokens(m) - (streamStart?.startOut ?? 0);
    if (durS >= 1 && totalOut > 0) {
      emaRate = totalOut / durS; // final: average over the whole message
    }
    streamStart = null;
    last = null;
    maybeRender(true);
    // Note: status stays visible after the response ends (last rate).
    // Remove that line to clear it instead.
  });
}
