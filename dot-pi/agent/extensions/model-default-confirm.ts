import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { getAgentDir } from "@earendil-works/pi-coding-agent";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * model-default-confirm.ts — after a model is selected via /model (plain select,
 * "set" source only) ask the user to confirm making it the startup default.
 *
 * Trigger: pi.on("model_select") fires inside session.setModel() with source "set"
 * (the /model selector Enter path and `/model provider/model`; the Ctrl+S
 * "save as default" path persists by itself so it is skipped via the
 * already-default check below; "cycle" and "restore" sources are ignored).
 *
 * The confirmation uses ctx.ui.confirm() — a dialog that shows the explicit
 * expected answers ("Yes" / "No") with key hints (Up/Down to choose, Enter to
 * confirm, Esc to cancel). Plain "y"-typing input has no visible expected
 * answer, so answers were unclear. Choosing No / Esc keeps the current default.
 *
 * The "set as default" action here writes defaultProvider/defaultModel into the
 * global settings file (MERGING every other key — packages, theme, ...) exactly
 * like settingsManager.setDefaultModelAndProvider() does.
 */
export default function modelDefaultConfirm(pi: ExtensionAPI) {
  pi.on("model_select", async (event, ctx) => {
    if (event.source !== "set") return; // ignore model cycling (ctrl+j/k) and session restore
    if (!ctx.hasUI) return; // print/json modes: never block on a prompt
    const model = event.model;
    if (!model) return;

    const settingsPath = join(getAgentDir(), "settings.json");
    let current: Record<string, unknown> = {};
    try {
      current = JSON.parse(readFileSync(settingsPath, "utf8"));
    } catch {
      // missing/unreadable settings file → start from an empty object; a stale
      // default check below simply finds nothing and the merge still preserves
      // whatever the file later has.
    }
    // Already the persisted default (e.g. selected again, or set via Ctrl+S in
    // the /model selector which persists by itself) → no prompt.
    if (current.defaultProvider === model.provider && current.defaultModel === model.id) return;

    // Yes/No dialog: the expected answers are shown explicitly (Up/Down to
    // choose, Enter to confirm, Esc to cancel). "No"/Esc → keep current default.
    const yes = await ctx.ui.confirm(
      "Make default?",
      `Set ${model.provider}/${model.id} as the startup default model?`,
    );
    if (!yes) return; // "No" or dismissed → keep current default

    const next = { ...current, defaultProvider: model.provider, defaultModel: model.id };
    writeFileSync(settingsPath, JSON.stringify(next, null, 2) + "\n", "utf8");
    ctx.ui.notify(`Default model set: ${model.provider}/${model.id}`, "info");
  });
}
