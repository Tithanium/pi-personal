import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/**
 * /clear — exact alias of the built-in /new command.
 *
 * Built-in /new (interactive-mode.js):
 *   this.editor.setText("");
 *   await this.handleClearCommand();
 * handleClearCommand:
 *   const result = await this.runtimeHost.newSession();
 *   if (result.cancelled) return;
 *   ... shows "✓ New session started"
 *
 * Extension equivalent: ExtensionCommandContext.newSession() is the same
 * runtimeHost.newSession() (see dist/core/extensions/types.d.ts).
 */
export default function (pi: ExtensionAPI) {
  pi.registerCommand("clear", {
    description: "Start a new session (identical to /new)",
    handler: async (_args, ctx) => {
      // Post-replacement work (notify) must run with the FRESH ctx passed to
      // withSession — the captured ctx is stale after newSession().
      const result = await ctx.newSession({
        withSession: (newCtx) => {
          newCtx.ui.notify("✓ New session started", "info");
        },
      });
      if (result.cancelled) return;
    },
  });
}
