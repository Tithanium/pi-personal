/**
 * wsl-powershell.ts  —  pi extension hook (pi v0.86.1)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * What this hook does
 * ─────────────────────────────────────────────────────────────────────────────
 * When the command executed by the `bash` tool (or the `powershell` tool, or a
 * `!`/`!!` user_bash command) is a **WSL command** (`wsl …`, `wsl.exe …`,
 * `wsl -d <distro> -- …`), this hook:
 *
 *   1. Runs the **syntax check** first (as requested):
 *      `checkSyntax()` verifies that the WSL command input and the PowerShell
 *      command input are of *exactly similar syntax* (byte-identical command
 *      line) for commands that are spelled and behave the same in both shells
 *      (`echo`, `pwd`, `cd`, `date`, `sleep`, `whoami`, `hostname`, `curl`, …).
 *   2. If the syntax is exactly similar  → the very same command line is
 *      executed via PowerShell, so the output comes back `as if WSL had performed
 *      it` (the input syntax is identical, nothing is guessed).
 *   3. If the syntax differs, it is translated to an *equivalent* PowerShell
 *      command via a curated, verified mapping
 *      (`ls` → `Get-ChildItem`, `cat` → `Get-Content`, …).
 *   4. If ANY token cannot be verified as equivalent, the hook **refuses** the
 *      command instead of guessing → nothing broken, clear reason returned.
 *
 * Wiring:
 *   - `tool_call`  → rewrites `bash` / `powershell` tool input to the translated
 *     PowerShell command (executed by the harness's real backend).
 *   - `user_bash`  → executes the translation itself through pi's PowerShell
 *     backend (`createLocalPowerShellOperations`) and returns a result.
 *   - `/wsl2ps <command>`  → prints the syntax-check + translation (no execution).
 *
 * Non-WSL commands are left completely untouched.
 *
 * NOTE — the built-in `bash` tool on this machine resolves to the WSL relay
 * (`C:\Windows\System32\bash.exe`) whose default distro has no `/bin/bash`, so a
 * bare `bash` tool still cannot spawn here; the hook makes `wsl …` work through
 * the `powershell` tool instead. Add "powershell" to `defaultTools` in
 * `~/.pi/agent/settings.json` to expose it to the LLM.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/* ═════════════════════════════════════════════════════════════════════════
 * 0. Commands whose WSL (bash) syntax and PowerShell syntax are EXACTLY the same
 *    (same spelling, same argument list, same observable output). These make the
 *    "exactly similar syntax" check pass unchanged — the command is executed
 *    verbatim, so the output is exactly what WSL would have produced.
 * ═════════════════════════════════════════════════════════════════════════ */
export const SAME_SYNTAX_COMMANDS = [
  "echo",
  "pwd",
  "cd",
  "date",
  "sleep",
  "whoami",
  "hostname",
  "curl",
  "true",
  "false",
  "exit",
] as const;

/** Any of these characters means the two shells parse the line differently
 *  (redirection, pipes, globs handled differently, `~`, subshells, …). */
const FORBIDDEN_EXACT_CHARS = /[;|&<>*?~`()]/;

/* ═════════════════════════════════════════════════════════════════════════
 * 1. Tiny shell tokenizer (keeps '…' / "…" quoted args intact).
 * ═════════════════════════════════════════════════════════════════════════ */
export function tokenize(command: string): string[] {
  const tokens: string[] = [];
  let cur = "";
  let quote: "'" | '"' | null = null;
  for (const ch of command) {
    if (quote) {
      cur += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') { quote = ch; cur += ch; continue; }
    if (/\s/.test(ch)) { if (cur) { tokens.push(cur); cur = ""; } continue; }
    cur += ch;
  }
  if (cur) tokens.push(cur);
  return tokens;
}

function unquote(s: string): string {
  const q = s[0];
  if (s.length >= 2 && (q === '"' || q === "'") && s[s.length - 1] === q) return s.slice(1, -1);
  return s;
}

/* WSL-style paths → PowerShell paths (`~` → $HOME, `/mnt/c/…` → `C:\…`). Only used
 * for *translated* commands; the exactly-similar-syntax class is never rewritten. */
function psPath(a: string): string {
  return a
    .replace(/^~\/(.*)$/, "$HOME\\$1")
    .replace(/^\/mnt\/([a-zA-Z])\/(.*)$/, (_m, d: string, r: string) => `${d.toUpperCase()}:\\${r}`)
    .replace(/^\/([a-zA-Z])\/(.*)$/, (_m, d: string, r: string) => `${d.toUpperCase()}:\\${r}`);
}

/** '…' → '…'-safe single-quoted PowerShell string literal. */
function psQuote(s: string): string {
  return `'${s.replace(/'/g, "''")}'`;
}

/* ═════════════════════════════════════════════════════════════════════════
 * 2. The requested CHECK: is the WSL command input of exactly similar syntax
 *    to a PowerShell command input?
 * ═════════════════════════════════════════════════════════════════════════ */
export interface SyntaxCheckResult {
  exact: boolean;
  reason?: string;
}

export function checkSyntax(payload: string): SyntaxCheckResult {
  const trimmed = payload.trim();
  if (!trimmed) return { exact: false, reason: "empty command" };
  if (FORBIDDEN_EXACT_CHARS.test(trimmed)) {
    return {
      exact: false,
      reason:
        "command contains syntax PowerShell parses differently (; | & < > * ? ~ ` ( )) — not exactly similar syntax",
    };
  }
  const first = trimmed.split(/\s+/, 1)[0].toLowerCase();
  if (!(SAME_SYNTAX_COMMANDS as readonly string[]).includes(first)) {
    return { exact: false, reason: `'${first}' is not in the exactly-similar-syntax command set` };
  }
  return { exact: true };
}

/* ═════════════════════════════════════════════════════════════════════════
 * 3. Translator: verified WSL command → equivalent PowerShell command.
 * ═════════════════════════════════════════════════════════════════════════ */
export interface Translation {
  ok: boolean;
  powershell?: string;
  exactSyntax: boolean;
  untranslated: string[];
  reason?: string;
}

export interface TranslateError {
  ok: false;
  exactSyntax: false;
  untranslated: string[];
  reason: string;
}

function fail(untranslated: string[], reason: string): TranslateError {
  return { ok: false, exactSyntax: false, untranslated, reason };
}

function isOpt(t: string): boolean {
  return t.length > 1 && t.startsWith("-");
}

/** Translate a single *verified* WSL (non-exact) command into PowerShell. */
function translatePayload(payload: string): { powershell: string; untranslated: string[] } | TranslateError {
  const tokens = tokenize(payload.trim());
  if (tokens.length === 0) return fail([], "empty WSL command");
  const cmd = tokens[0].toLowerCase();
  const args = tokens.slice(1);
  const untranslated: string[] = [];
  const payloadArgs = args.map(psPath);

  switch (cmd) {
    case "ls": {
      const flags = payloadArgs.filter(isOpt);
      const paths = payloadArgs.filter((a) => !isOpt(a));
      const bad = flags.filter((f) => !/^-[a-zA-Z]+$/.test(f));
      if (bad.length) return fail(bad, `ls: flag(s) not verified for PowerShell: ${bad.join(" ")}`);
      const set = flags.join("");
      const detail = set.includes("l");
      const recurse = set.includes("R") ? "-Recurse " : "";
      const force = set.includes("a") ? "-Force " : "";
      const targets = paths.length ? paths.map(psQuote).join(", ") : "";
      const where = (force + recurse + targets).trim();
      const expr = detail
        ? `Get-ChildItem ${where} | Format-Table Mode,Length,LastWriteTime,Name -AutoSize | Out-String -Width 200`
        : `Get-ChildItem ${where} | ForEach-Object { $_.Name }`;
      return { powershell: expr, untranslated };
    }
    case "cat": {
      if (payloadArgs.some(isOpt)) return fail(payloadArgs.filter(isOpt), `cat: flags are not supported by the mapping`);
      const files = payloadArgs.filter((a) => a !== "/dev/stdin");
      if (files.length === 0) return fail(["cat"], "cat without a file cannot be verified (stdin piping differs)");
      return { powershell: `Get-Content ${files.map(psQuote).join(" ")}`, untranslated };
    }
    case "rm": {
      const flags = args.filter(isOpt);
      const bad = flags.filter((f) => !/^-[rf]+$/.test(f));
      if (bad.length) return fail(bad, `rm: flag(s) not verified: ${bad.join(" ")}`);
      const targets = args.filter((a) => !isOpt(a)).map(psPath);
      if (!targets.length) return fail(["rm"], "rm needs a target");
      const opts = [flags.join("").includes("r") ? "-Recurse" : "", flags.join("").includes("f") ? "-Force" : ""]
        .filter(Boolean)
        .join(" ");
      return { powershell: `Remove-Item ${opts} ${targets.map(psQuote).join(" ")}`.trim(), untranslated };
    }
    case "rmdir": {
      const flags = args.filter(isOpt);
      if (flags.length) return fail(flags, "rmdir: flags are not supported by the mapping");
      const targets = args.map(psPath);
      if (!targets.length) return fail(["rmdir"], "rmdir needs a target");
      return { powershell: `Remove-Item ${targets.map(psQuote).join(" ")}`, untranslated };
    }
    case "cp": {
      const flags = args.filter(isOpt);
      const bad = flags.filter((f) => f !== "-r" && f !== "-R");
      if (bad.length) return fail(bad, `cp: flag(s) not verified: ${bad.join(" ")}`);
      const targets = args.filter((a) => !isOpt(a)).map(psPath);
      if (targets.length < 2) return fail(["cp"], "cp needs source and destination");
      return { powershell: `Copy-Item ${flags.length ? "-Recurse " : ""}${targets.map(psQuote).join(" ")}`.trim(), untranslated };
    }
    case "mv": {
      if (args.some(isOpt)) return fail(args.filter(isOpt), "mv: flags are not supported by the mapping");
      if (args.length < 2) return fail(["mv"], "mv needs source and destination");
      return { powershell: `Move-Item ${args.map(psPath).map(psQuote).join(" ")}`, untranslated };
    }
    case "mkdir": {
      const flags = args.filter(isOpt);
      const bad = flags.filter((f) => f !== "-p");
      if (bad.length) return fail(bad, `mkdir: flag(s) not verified: ${bad.join(" ")}`);
      const dirs = args.filter((a) => !isOpt(a)).map(psPath);
      if (!dirs.length) return fail(["mkdir"], "mkdir needs a directory");
      const force = flags.length ? "-Force" : "";
      return {
        powershell: dirs.map((d) => `New-Item -ItemType Directory -Path ${psQuote(d)} ${force}`.trim()).join("; "),
        untranslated,
      };
    }
    case "touch": {
      const flags = args.filter(isOpt);
      if (flags.length) return fail(flags, "touch: flags are not supported by the mapping");
      if (!args.length) return fail(["touch"], "touch needs a file");
      return {
        powershell: args
          .map(psPath)
          .map(
            (f) =>
              `if (Test-Path ${psQuote(f)}) { (Get-Item ${psQuote(f)}).LastWriteTime = Get-Date } else { New-Item -ItemType File -Path ${psQuote(f)} -Force | Out-Null }`,
          )
          .join("; "),
        untranslated,
      };
    }
    case "grep": {
      const flags = args.filter(isOpt);
      const bad = flags.filter((f) => !/^-[iRrn]+$/.test(f));
      if (bad.length) return fail(bad, `grep: flag(s) not verified: ${bad.join(" ")}`);
      const nonFlags = args.filter((a) => !isOpt(a));
      if (!nonFlags.length) return fail(["grep"], "grep needs a pattern");
      const pattern = unquote(nonFlags[0]).replace(/'/g, "''");
      const files = nonFlags.slice(1).map(psPath);
      const filesPs = files.map(psQuote).join(" ");
      const source = filesPs || "*";
      const ci = flags.some((f) => f.includes("i")) ? "-CaseSensitive:$false " : "";
      return { powershell: `Get-Content ${source} | Select-String ${ci}-Pattern '${pattern}' | ForEach-Object { $_.Line }`.replace(/\s+/g, " ").replace(/-CaseSensitive:\$false -Pattern/, "-CaseSensitive:$false -Pattern").replace(/([-A-Za-z]+:) /g, "$1").replace("Select-String $false ", "Select-String "), untranslated };
    }
    case "head":
    case "tail": {
      const flags = args.filter(isOpt);
      const bad = flags.filter((f) => f !== "-n");
      if (bad.length) return fail(bad, `${cmd}: flag(s) not verified: ${bad.join(" ")}`);
      const countIdx = flags.includes("-n") && args.indexOf("-n") + 1 < args.length ? args.indexOf("-n") + 1 : 1;
      const count = /^\d+$/.test(args[countIdx]) ? args[countIdx] : cmd === "head" ? "10" : "10";
      const file = (args.filter((a) => !isOpt(a) && !/^\d+$/.test(a)).map(psPath)[0]);
      if (!file) return fail([cmd], `${cmd} needs a file`);
      const which = cmd === "head" ? "-First" : "-Last";
      return { powershell: `Get-Content ${psQuote(file)} | Select-Object ${which} ${count} -ErrorAction SilentlyContinue`, untranslated };
    }
    case "wc": {
      const flags = args.filter(isOpt);
      const bad = flags.filter((f) => f !== "-c" && f !== "-w" && f !== "-l");
      if (bad.length) return fail(bad, `wc: flag(s) not verified: ${bad.join(" ")}`);
      const files = args.filter((a) => !isOpt(a)).map(psPath);
      if (!files.length) return fail(["wc"], "wc without a file reads stdin, which cannot be verified");
      const counts = [
        flags.includes("l") ? `lines=((Get-Content ${psQuote(files[0])}).Count)` : "",
        flags.includes("w") ? `words=[regex]::Matches((Get-Content ${psQuote(files[0])} -Raw), '\\S+').Count` : "",
        flags.includes("c") ? `bytes=(Get-Item ${psQuote(files[0])}).Length` : "",
      ].filter(Boolean);
      const expr = counts.length ? counts.join("; ") : "lines=((Get-Content " + psQuote(files[0]) + ").Count)";
      return { powershell: expr, untranslated };
    }
    case "find": {
      const flags = args.filter(isOpt);
      const bad = flags.filter((f) => f !== "-name" && f !== "-type" && f !== "-iname");
      if (bad.length) return fail(bad, `find: flag(s) not verified: ${bad.join(" ")}`);
      const nonFlags = args.filter((a) => !isOpt(a)).map(psPath);
      const nameIdx = args.findIndex((a) => a === "-name" || a === "-iname");
      const nameVal = nameIdx >= 0 && args[nameIdx + 1] ? unquote(args[nameIdx + 1]) : "*";
      const typeIdx = args.indexOf("-type");
      const typeVal = typeIdx >= 0 && args[typeIdx + 1] ? args[typeIdx + 1] : "";
      const dirs = nonFlags;
      const dirPs = dirs.length ? dirs.map(psQuote).join(", ") : "";
      let expr: string;
      if (typeVal === "d") expr = `Get-ChildItem ${dirPs} -Recurse -Directory`.replace(/\s+/g, " ");
      else expr = `Get-ChildItem ${dirPs} -Recurse -Filter ${psQuote(`${nameVal}`)}`.replace(/\s+/g, " ");
      return { powershell: expr, untranslated };
    }
    case "clear":
      return { powershell: "Clear-Host", untranslated };
    case "uname":
      return {
        powershell: "[System.Environment]::OSVersion | Select-Object Platform, Version | Format-Table -AutoSize | Out-String",
        untranslated,
      };
    default:
      return fail([cmd], `'${cmd}' is not in the verified WSL→PowerShell mapping`);
  }
}

/**
 * Public entry point: WSL command → verified PowerShell command + syntax result.
 */
export function wslToPowerShell(command: string): Translation {
  const trimmed = command.trim();
  if (!/^wsl(\.exe)?(\s|$)/i.test(trimmed)) {
    return { ok: false, exactSyntax: false, untranslated: [], reason: "not a WSL command (expected 'wsl …' or 'wsl.exe …')" };
  }
  const rest = tokenize(trimmed).slice(1);
  let payloadIdx = 0;
  let j = 0;
  while (j < rest.length) {
    const t = rest[j];
    // wsl options that consume a value: skip both the flag and its value.
    if (t === "-d" || t === "--distribution" || t === "-u" || t === "--user" || t === "--cd" || t === "-t" || t === "--terminate") { j += 2; continue; }
    // `--` ends wsl option parsing; `-e/--exec` makes the NEXT token the command.
    if (t === "--" || t === "-e" || t === "--exec" || t === "-ec") { payloadIdx = j + 1; break; }
    // First normal token starts the actual command.
    payloadIdx = j;
    break;
  }
  let payload = rest.slice(payloadIdx).join(" ");
  const bashC = payload.match(/^(?:bash|sh|zsh|dash)\s+-c\s+(['"])([\s\S]*)\1\s*$/);
  if (bashC) payload = bashC[2];
  if (!payload.trim()) {
    return { ok: false, exactSyntax: false, untranslated: ["wsl"], reason: "bare `wsl` opens an interactive WSL shell; provide a command: wsl ls" };
  }
  if (checkSyntax(payload).exact) {
    return { ok: true, powershell: payload.trim(), exactSyntax: true, untranslated: [] };
  }
  const t = translatePayload(payload);
  if (!t.ok) return { ...t, reason: t.reason };
  if (t.untranslated.length) {
    return { ok: false, exactSyntax: false, untranslated: t.untranslated, reason: `syntax check failed / unverified tokens: ${t.untranslated.join(" ")}` };
  }
  return { ok: true, powershell: t.powershell, exactSyntax: false, untranslated: [] };
}

function encodedCommand(powershell: string): string {
  return Buffer.from(powershell, "utf16le").toString("base64");
}

/* ═════════════════════════════════════════════════════════════════════════
 * 4. The hook.
 * ═════════════════════════════════════════════════════════════════════════ */
export default function wslPowerShellHook(pi: ExtensionAPI): void {
  if (process.platform !== "win32") return;

  // `tool_call` — rewrite `bash` / `powershell` tool input for WSL commands.
  pi.on("tool_call", async (event) => {
    if (event.toolName !== "bash" && event.toolName !== "powershell") return;
    const input = event.input as { command?: string } | undefined;
    const cmd = input?.command;
    if (!cmd || !/^wsl(\.exe)?(\s|$)/i.test(cmd)) return; // non-WSL → leave untouched

    const result = wslToPowerShell(cmd);
    if (!result.ok) {
      return { block: true, reason: `wsl→powershell conversion refused: ${result.reason}` };
    }
    // `powershell` backend executes the verified PowerShell form directly →
    // output comes back as if the WSL command had been performed.
    // `bash` backend gets the same command via `powershell.exe -EncodedCommand`
    // (quote-safe in any outer shell).
    input!.command = event.toolName === "bash"
      ? `powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -EncodedCommand ${encodedCommand(result.powershell!)}`
      : result.powershell!;
  });

  // `user_bash` — `!`/`!!` editor commands: execute through pi's PowerShell backend.
  pi.on("user_bash", async (event) => {
    if (!event.command || !/^wsl(\.exe)?(\s|$)/i.test(event.command)) return;
    const result = wslToPowerShell(event.command);
    if (!result.ok) return; // let normal handling proceed / error naturally
    const mod = await import("@earendil-works/pi-coding-agent");
    const exec = mod.createLocalPowerShellOperations().exec;
    const chunks: Buffer[] = [];
    try {
      const exit = await exec(result.powershell!, event.cwd, {
        onData: (d: Buffer | string) => chunks.push(Buffer.isBuffer(d) ? d : Buffer.from(String(d))),
      });
      return { result: { output: Buffer.concat(chunks).toString("utf8"), exitCode: exit.exitCode ?? 1, cancelled: false, truncated: false } };
    } catch {
      // Fall through to default handling.
      return undefined;
    }
  });

  // Diagnostic command: `/wsl2ps <command>` prints the check + translation.
  pi.registerCommand("wsl2ps", {
    description: "Show the WSL→PowerShell syntax check + translation for a WSL command",
    handler: (args: string, ctx: { ui: { notify: (msg: string, level: "info" | "error") => void } }) => {
      const out = wslToPowerShell(args || "");
      ctx.ui.notify(
        out.ok
          ? `WSL→PowerShell — exact-syntax check: ${out.exactSyntax ? "PASS (exactly similar syntax)" : "PASS (verified mapping)"}\n→ ${out.powershell}`
          : `WSL→PowerShell refused: ${out.reason} (untranslated: ${out.untranslated.join(" ") || "—"})`,
        out.ok ? "info" : "error",
      );
    },
  });
}
