/**
 * bash → PowerShell reroute (Windows, WSL dead on this machine).
 *
 * Replaces the built-in `bash` tool with the built-in PowerShell backend.
 * Any `bash` tool call executes the SAME command string through powershell.exe
 * (no value rewriting — command/timeout pass through as-is).
 * The native `powershell` tool stays untouched.
 *
 * Pattern: spread the PowerShell ToolDefinition, override name/label/description.
 * Docs: "registering a tool with the same name replaces the built-in".
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { createPowerShellToolDefinition } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	const psDef = createPowerShellToolDefinition(process.cwd());

	pi.registerTool({
		...psDef,
		name: "bash",
		label: "Bash (rerouted to PowerShell)",
		description:
			"Execute a command in PowerShell (on this machine the bash tool is rerouted to powershell.exe — WSL/bash is unavailable; write commands in PowerShell syntax). Optional timeout in seconds. Output truncated to 2000 lines / 50KB, full output saved to a temp file when truncated.",
		promptSnippet: "Execute PowerShell commands (bash tool rerouted to PowerShell on this machine)",
	});
}
