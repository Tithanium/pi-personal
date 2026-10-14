/**
 * convert_pdf — recursive PDF → text conversion for the pi harness.
 *
 * Ported from the Observation_only harness
 * (C:\Users\connessn\Observation_only; donor script:
 * C:\Users\connessn\.Observation_only\extensions\pdf2text.py, copied verbatim
 * next to this file). The heavy lifting stays in the proven Python script:
 *   - recurses the folder tree, every *.pdf -> sibling *.txt (UTF-8)
 *   - skips existing non-empty .txt unless --force
 *   - --out DIR mirrors the subfolder layout under DIR instead
 *   - pymupdf auto-installed via pip at startup if missing
 *   - a failing PDF is reported and the run continues
 * This extension only wires it into pi as a slash command.
 *
 * Usage: /convert_pdf <folder> [--force] [--out DIR]
 * Progress is streamed to the status bar; a final summary is notified.
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { spawn } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// Paths — all inside this extension folder (verified pattern under pi/jiti,
// same as alan-connector/index.ts).
const EXT_DIR = fileURLToPath(new URL(".", import.meta.url));
const SCRIPT = path.join(EXT_DIR, "pdf2text.py");
// Verified on this machine (2026): Python 3.13.13 on PATH, pymupdf 1.28.2 importable.
const PYTHON = "python";
const STATUS_KEY = "convert_pdf";

const USAGE = "Usage: /convert_pdf <folder> [--force] [--out DIR]";

interface ParsedArgs {
  folder?: string;
  force: boolean;
  out?: string;
}

function parseArgs(raw: string): { ok: true; args: ParsedArgs } | { ok: false; error: string } {
  const tokens = raw.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { ok: false, error: USAGE };
  const args: ParsedArgs = { force: false };
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "--force") args.force = true;
    else if (t === "--out") {
      const next = tokens[++i];
      if (!next) return { ok: false, error: "--out needs a directory argument" };
      args.out = next;
    } else if (t.startsWith("--")) return { ok: false, error: `Unknown flag: ${t}` };
    else if (!args.folder) args.folder = t;
    else return { ok: false, error: `Unexpected extra argument: ${t}` };
  }
  if (!args.folder) return { ok: false, error: USAGE };
  return { ok: true, args };
}

/** Strip a leading @ (path hygiene, matches built-in tools) and resolve against cwd. */
function resolvePath(cwd: string, raw: string): string {
  return path.resolve(cwd, raw.replace(/^@+/, ""));
}

export default function (pi: ExtensionAPI) {
  pi.registerCommand("convert_pdf", {
    description: "Recursively convert every PDF in a folder tree to .txt — /convert_pdf <folder> [--force] [--out DIR]",
    async handler(args, ctx) {
      const parsed = parseArgs(args);
      if (!parsed.ok) {
        ctx.ui.notify(parsed.error, "warning");
        return;
      }

      const root = resolvePath(ctx.cwd, parsed.args.folder!);
      if (!existsSync(root) || !statSync(root).isDirectory()) {
        ctx.ui.notify(`Not a folder: ${root}`, "error");
        return;
      }

      const pyArgs: string[] = [root];
      if (parsed.args.force) pyArgs.push("--force");
      if (parsed.args.out) pyArgs.push("--out", resolvePath(ctx.cwd, parsed.args.out));

      const log: string[] = [];
      let lastLine = "";
      const pump = (chunk: Buffer) => {
        for (const line of chunk.toString("utf8").split(/\r?\n/)) {
          if (line.trim().length === 0) continue;
          log.push(line);
          lastLine = line;
        }
        if (lastLine) ctx.ui.setStatus(STATUS_KEY, lastLine.slice(-90));
      };

      const child = spawn(PYTHON, [SCRIPT, ...pyArgs], {
        cwd: ctx.cwd,
        windowsHide: true,
      });
      child.stdout.on("data", pump);
      child.stderr.on("data", pump);

      // Resolves to: exit code (number), null (killed/aborted, no code), or a string (spawn error).
      const code = await new Promise<number | null | string>((resolve) => {
        const sig = ctx.signal;
        const onAbort = () => {
          try {
            child.kill();
          } catch {
            /* already dead */
          }
        };
        if (sig) {
          if (sig.aborted) onAbort();
          else sig.addEventListener("abort", onAbort, { once: true });
        }
        child.on("error", (err) => resolve(`spawn: ${err.message}`));
        child.on("close", (c) => {
          if (sig) sig.removeEventListener("abort", onAbort);
          resolve(c);
        });
      });

      ctx.ui.setStatus(STATUS_KEY, undefined);

      // The script's final line is its summary: "DONE : ..." or "ABORTED : ...".
      const summary = log[log.length - 1] ?? "(no output from pdf2text)";
      if (typeof code === "string") {
        ctx.ui.notify(`convert_pdf failed to start python — ${code}`, "error");
        return;
      }
      if (code === 0) {
        ctx.ui.notify(`convert_pdf done — ${summary}`, "info");
      } else if (code === null) {
        ctx.ui.notify(`convert_pdf aborted/killed — ${summary}`, "warning");
      } else {
        ctx.ui.notify(`convert_pdf finished with failures (exit ${code}) — ${summary}`, "warning");
      }
    },
  });
}
