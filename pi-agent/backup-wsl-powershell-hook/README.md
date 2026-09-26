# Backup: state before `wsl-powershell` hook was added

Created: 2026-09-21 (pi v0.86.1) — run this before installing the `wsl-powershell` hook.

## What the "current function" was

There was **no existing bash→powershell conversion hook** anywhere:

- `~/.pi/agent/extensions/` — directory exists but contained **no** extension files
  (probed: index.ts, bash.ts, hook.ts, powershell.ts, wsl.ts, translate.ts, convert.ts,
  bash-powershell.ts — all missing).
- Installed pi packages `npm:pi-okf` and `npm:pi-tps-live` contain only OKF tooling and
  a tokens-per-second footer meter — no bash/powershell/wsl conversion.
- Built-in `pi-coding-agent` v0.86.1 ships a plain `bash` tool (spawns bash) and an
  optional `powershell` tool (spawns pwsh/powershell). Neither converts commands.
- `getShellConfig()` on this machine resolves bash to the WSL relay
  (`C:\Windows\System32\bash.exe`, `bash -s`), and the default WSL distro has no
  `/bin/bash` (the `execvpe(/bin/bash) failed: No such file or directory` error).
  No Git Bash / msys2 / cygwin / scoop bash was found.

## Status of the only mutable config file

`~/.pi/agent/settings.json` was **untouched** by the hook install:

```json
{
    "defaultProvider":  "alan",
    "defaultModel":  "ARES/DeepSeek-V4-Flash-0731",
    "lastChangelogVersion":  "0.86.1",
    "theme":  "dark",
    "packages":  [
                     "npm:pi-okf",
                     "npm:pi-tps-live@1.0.1"
                 ]
}
```

A byte-identical copy is saved next to this file as `settings.json.bak`.

## What was changed by the hook install

1. **Added** `~/.pi/agent/extensions/wsl-powershell.ts`  (the hook — auto-discovered on next `/reload`).
2. **Added** `~/.pi/tests/wsl-powershell.test.ts`          (self-test, never auto-loaded).
3. **Modified** `~/.pi/agent/settings.json` — added
   `"defaultTools": ["read", "bash", "powershell", "edit", "write"]`
   (the `powershell` tool is the execution backend; the machine's `bash` tool is a
   WSL relay whose distro has no `/bin/bash`).

## How to reverse (restore) if the hook breaks something

1. Delete the hook: remove `~/.pi/agent/extensions/wsl-powershell.ts`
   (and the optional test `~/.pi/tests/wsl-powershell.test.ts`).
2. Restore settings: copy `settings.json.bak` over `~/.pi/agent/settings.json`
   (removes the added `defaultTools`).
3. `/reload` in pi (or restart pi).

```bash
rm -f ~/.pi/agent/extensions/wsl-powershell.ts ~/.pi/tests/wsl-powershell.test.ts
cp ~/.pi/agent/backup-wsl-powershell-hook/settings.json.bak ~/.pi/agent/settings.json
```
