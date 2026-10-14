/**
 * model-context-picker.ts — /model that also shows the max context length.
 *
 * WHY AN EXTENSION
 * ----------------
 * pi's built-in `/model` selector draws a plain `id [provider]` row (the context
 * window only appears for the *highlighted* model on the "Model Name:" line), and
 * the built-in `/model` handler runs in the interactive mode BEFORE extension
 * commands, so `pi.registerCommand("model", ...)` cannot override it. This
 * extension therefore uses only stable extension APIs:
 *
 *   1. `ctx.ui.onTerminalInput(...)` — raw terminal input is delivered to
 *      extensions BEFORE it reaches the focused editor. When the user presses
 *      Enter while the editor holds exactly `/model`, the keypress is consumed
 *      (`{ consume: true }`) so the built-in handler never runs.
 *   2. `ctx.ui.custom(...)` — a scrollable picker (same interaction contract as
 *      the alan-connector picker: ↑/↓ navigate, type to filter, Enter select,
 *      Esc cancel) renders `id  name  (Nk) [provider] · default`.
 *   3. `pi.setModel(model)` — the picker returns the real Model object, so the
 *      display suffix can never break the selection.
 *
 * REQUIREMENT MAPPING
 * -------------------
 * - "show, besides the model name, the max context length": every row renders the
 *   context window in k, computed exactly like the alan-connector picker
 *   (`Math.round(ctx/1024 * 10)/10`, e.g. `(256k)`, `(0.4k)`).
 * - "on selection this information does not prevent a proper selection": the
 *   label is display-only; `done(model)` hands the untouched Model object to
 *   `pi.setModel`.
 * - "the list of 'default' model is appended when a new model is selected": the
 *   model configured as the startup default carries a `· default` marker, and
 *   selecting a model appends it to the default (writes defaultProvider /
 *   defaultModel into settings.json, merged — the same write the
 *   model-default-confirm extension performs) so the marker follows the new
 *   selection.
 *
 * This is self-contained: future pi updates only have to keep `ctx.ui.custom`,
 * `ctx.ui.onTerminalInput`, `ctx.modelRegistry` and `pi.setModel` working — no pi
 * source is patched. A `/model-ctx` command exposes the same picker as a fallback.
 *
 * Verified against pi 1.0.3 (bundled `handleTerminalInput` honours `consume`).
 */

import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { getAgentDir } from "@earendil-works/pi-coding-agent";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SETTINGS_PATH = join(getAgentDir(), "settings.json");
const DEFAULT_SAVE_HINT = "↑/↓ navigate · type to filter · Enter select + default · Esc cancel";

interface AnyModel {
	provider: string;
	id: string;
	name?: string;
	contextWindow?: number;
	maxTokens?: number;
}

/** Stable identity used for current/default comparison (id and provider never collide on \u0000). */
function keyOf(model: AnyModel): string {
	return `${model.provider}\u0000${model.id}`;
}

/** Context window in k, rounded to 1 decimal — identical maths to the alan-connector picker. */
function contextTag(contextWindow?: number): string {
	if (!contextWindow || contextWindow <= 0) return "ctx ?";
	const k = Math.round((contextWindow / 1024) * 10) / 10;
	return `${Number.isInteger(k) ? k : k.toFixed(1)}k`;
}

/**
 * Display name: the model id, plus the catalog `name` when it carries extra
 * information. A trailing `(Nk)` suffix (written by alan_config_writer.ps1) is
 * stripped first so the context is never printed twice.
 */
function displayName(model: AnyModel): string {
	const raw = (model.name ?? "").trim();
	const stripped = raw.replace(/\s*\(\d+(?:\.\d+)?k\)\s*$/i, "").trim();
	if (!stripped || stripped === model.id) return model.id;
	return `${model.id}  ${stripped}`;
}

function readSettings(): Record<string, unknown> | null {
	let raw: string;
	try {
		raw = readFileSync(SETTINGS_PATH, "utf8");
	} catch {
		return {}; // no file yet: safe to create one with only our two keys
	}
	try {
		return JSON.parse(raw) as Record<string, unknown>;
	} catch {
		return null; // unparseable: never overwrite, so no other key can be lost
	}
}

/** Merge defaultProvider/defaultModel into settings.json without touching any other key. */
function persistDefault(model: AnyModel): void {
	try {
		const current = readSettings();
		if (current === null) return;
		if (current.defaultProvider === model.provider && current.defaultModel === model.id) return;
		const next = { ...current, defaultProvider: model.provider, defaultModel: model.id };
		writeFileSync(SETTINGS_PATH, JSON.stringify(next, null, 2) + "\n", "utf8");
	} catch {
		// A failed default write must never break the selection itself.
	}
}

/**
 * Scrollable picker. `done(model)` returns the real Model object (or undefined on
 * cancel); the `(Nk)` text is display-only, so selection can never be confused by it.
 */
function modelPicker(
	models: AnyModel[],
	currentKey: string,
	defaultKey: string,
	theme: any,
	kb: any,
	tui: any,
	done: (model?: AnyModel) => void,
): any {
	const MAX_VISIBLE = 12;
	let query = "";
	let filtered: AnyModel[] = models;
	let index = Math.max(0, models.findIndex((m) => keyOf(m) === currentKey));

	const refilter = (): void => {
		const q = query.trim().toLowerCase();
		filtered =
			q === ""
				? models
				: models.filter((m) => `${m.id} ${m.provider} ${m.name ?? ""}`.toLowerCase().includes(q));
		index = Math.min(index, Math.max(0, filtered.length - 1));
	};

	const row = (model: AnyModel, selected: boolean): string => {
		const isCurrent = keyOf(model) === currentKey;
		const isDefault = keyOf(model) === defaultKey;
		const cursor = selected ? theme.fg("accent", "› ") : "  ";
		const check = isCurrent ? theme.fg("accent", "✓ ") : "  ";
		const badge = isDefault ? theme.fg("muted", " · default") : "";
		const provider = theme.fg("muted", ` [${model.provider}]`);
		const name = displayName(model);
		const nameColored = selected ? theme.fg("accent", name) : theme.fg("text", name);
		const ctxColored = theme.fg("dim", `(${contextTag(model.contextWindow)})`);
		return `${cursor}${check}${nameColored} ${ctxColored}${provider}${badge}`;
	};

	return {
		render(): string[] {
			const start =
				filtered.length <= MAX_VISIBLE
					? 0
					: Math.max(0, Math.min(index - Math.floor(MAX_VISIBLE / 2), filtered.length - MAX_VISIBLE));
			const end = Math.min(filtered.length, start + MAX_VISIBLE);
			const lines = [theme.fg("accent", theme.bold("Select model  (max context length shown)"))];
			if (query) lines.push(theme.fg("muted", `  filter: ${query}`));
			if (filtered.length === 0) {
				lines.push(theme.fg("muted", "  No matching models"));
			} else {
				for (let i = start; i < end; i++) lines.push(row(filtered[i], i === index));
				if (start > 0 || end < filtered.length) {
					lines.push(theme.fg("muted", `  (${index + 1}/${filtered.length})`));
				}
			}
			lines.push(theme.fg("dim", `  ${DEFAULT_SAVE_HINT} (${filtered.length} model(s))`));
			return lines;
		},
		invalidate(): void {
			tui.requestRender();
		},
		handleInput(data: string): void {
			if (kb.matches(data, "tui.select.up")) {
				if (filtered.length > 0) index = index <= 0 ? filtered.length - 1 : index - 1;
			} else if (kb.matches(data, "tui.select.down")) {
				if (filtered.length > 0) index = (index + 1) % filtered.length;
			} else if (kb.matches(data, "tui.select.confirm")) {
				done(filtered[index]);
				return;
			} else if (kb.matches(data, "tui.select.cancel")) {
				done(undefined);
				return;
			} else if (data === "\x7f" || data === "\b") {
				if (query.length > 0) {
					query = query.slice(0, -1);
					refilter();
				}
			} else if (data.length === 1 && data >= " ") {
				query += data;
				refilter();
			}
			tui.requestRender();
		},
	};
}

/**
 * Open the context-aware model picker, apply the chosen model to the session and
 * append it to the startup default. Writes the default BEFORE `pi.setModel` so
 * model-default-confirm.ts sees it as already-default and does not re-prompt.
 */
async function openModelPicker(pi: ExtensionAPI, ctx: ExtensionContext): Promise<void> {
	if (!ctx.hasUI) return;
	try {
		await ctx.modelRegistry.refresh();
	} catch {
		// Offline / refresh failure: fall back to the cached catalog.
	}
	const models = ctx.modelRegistry.getAvailable() as unknown as AnyModel[];
	if (models.length === 0) {
		ctx.ui.notify("/model: no models available", "warning");
		return;
	}
	const settings = readSettings() ?? {};
	const defaultKey =
		typeof settings.defaultProvider === "string" && typeof settings.defaultModel === "string"
			? `${settings.defaultProvider}\u0000${settings.defaultModel}`
			: "";
	const currentKey = ctx.model ? keyOf(ctx.model as unknown as AnyModel) : "";

	// Current model first, then the configured default, then by provider (mirrors the built-in sort).
	const sorted = [...models].sort((a, b) => {
		const aCurrent = keyOf(a) === currentKey;
		const bCurrent = keyOf(b) === currentKey;
		if (aCurrent !== bCurrent) return aCurrent ? -1 : 1;
		const aDefault = keyOf(a) === defaultKey;
		const bDefault = keyOf(b) === defaultKey;
		if (aDefault !== bDefault) return aDefault ? -1 : 1;
		return a.provider.localeCompare(b.provider);
	});

	const chosen = await ctx.ui.custom<AnyModel | undefined>((tui, theme, kb, done) =>
		modelPicker(sorted, currentKey, defaultKey, theme, kb, tui, done),
	);
	if (!chosen) {
		ctx.ui.notify("/model: cancelled", "warning");
		return;
	}

	persistDefault(chosen);
	const applied = await pi.setModel(chosen as any);
	ctx.ui.notify(
		applied
			? `Model: ${chosen.provider}/${chosen.id} (${contextTag(chosen.contextWindow)}) — default updated`
			: `Model ${chosen.provider}/${chosen.id} is not selectable (missing credentials?) — default updated`,
		applied ? "info" : "warning",
	);
}

export default function modelContextPicker(pi: ExtensionAPI) {
	// Fallback command (no conflict with the built-in `/model`, so it is callable).
	pi.registerCommand("model-ctx", {
		description: "Select a model showing its max context length and default marker (context-aware /model)",
		handler: async (_args, ctx) => {
			await openModelPicker(pi, ctx);
		},
	});

	// Intercept `/model` + Enter before the built-in handler sees the keypress.
	let unsubscribe: (() => void) | undefined;
	pi.on("session_start", (_event, ctx) => {
		if (ctx.mode !== "tui" || !ctx.hasUI) return;
		unsubscribe?.();
		unsubscribe = ctx.ui.onTerminalInput((data) => {
			if (data !== "\r" && data !== "\n") return undefined;
			let text = "";
			try {
				text = ctx.ui.getEditorText();
			} catch {
				return undefined;
			}
			if (text.trim() !== "/model") return undefined;
			// Consume the keypress, clear `/model`, and open the picker once the
			// current input handling has finished.
			try {
				ctx.ui.setEditorText("");
			} catch {
				// ignore
			}
			setTimeout(() => {
				void openModelPicker(pi, ctx);
			}, 0);
			return { consume: true };
		});
	});

	pi.on("session_shutdown", () => {
		unsubscribe?.();
		unsubscribe = undefined;
	});
}
