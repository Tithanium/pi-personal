# pi-local-rag regression suite

Machine-specific (Windows, user `connessn`) regression tests for the
build-aside + atomic-swap index pipeline (`build.ts`) and the background
stale-refresh hook. All tests use **isolated stores** (`PI_RAG_DIR` override)
— the real `~/.pi/rag` store is never touched except by `real-store-migrate.cjs`.

## How to run (from any folder)

```powershell
node  C:\Users\connessn\.pi\agent\extensions\pi-local-rag\tests\load-smoke.mjs
node  C:\Users\connessn\.pi\agent\extensions\pi-local-rag\tests\test-build.mjs
node  C:\Users\connessn\.pi\agent\extensions\pi-local-rag\tests\test-paths.mjs
node  C:\Users\connessn\.pi\agent\extensions\pi-local-rag\tests\interrupt-test.mjs
powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\connessn\.pi\agent\extensions\pi-local-rag\tests\run-pi-tests.ps1
```

Test data dirs (`rag_bg_test\rag*`, `docs*`) are created/destroyed by the
scripts under `C:\Users\connessn\rag_bg_test` — that folder only needs to
exist as a scratch area (a pre-fix real-store backup currently lives there).

## What each suite covers

| Script | Assertions | Covers |
|---|---|---|
| `load-smoke.mjs` | 2 | Extension imports via jiti (same loader pi uses); all new exports present; default export is a function |
| `test-build.mjs` | 12 | `buildAndSwapIndex`: initial build, no-op copy+swap integrity, FTS + vector KNN after swap, incremental + prune, `--force` from-scratch, build-lock serialization, orphan cleanup |
| `test-paths.mjs` | 9 | Path-spelling normalization: mixed slash/backslash skip (no duplicates), one-time backslash→slash migration of a pre-fix store, post-migration skip |
| `interrupt-test.mjs` | 6 | Crash recovery: build killed (SIGTERM) mid-embed leaves the live DB intact + queryable, exactly one orphaned secondary (WAL sidecars included), cleanup removes it, recovery build completes |
| `run-pi-tests.ps1` | 13 | End-to-end `pi -p`: P2 stale store in print mode → skip message, fast turn, no rebuild; P3 stale + `PI_RAG_BG_WAIT=1` → awaited refresh, `last_build` updated, 0 re-indexed (skip works); P4 orphaned secondary cleaned at extension startup |

`show-files.cjs` / `read-lastbuild.cjs` are small debugging helpers (store
inspector / last_build reader).

## Notes from the development session (2026-10-13)

- Windows on this machine does **not** enforce directory read-only via
  `chmod 0o555` (admin/developer-mode override), so EPERM failure injection
  is not possible that way — crash behavior is tested by killing the process
  mid-build instead (`interrupt-test.mjs`).
- The pi harness blocks any tool command containing the literal
  `[System.Diagnostics.Process]::Start` (returns `spawn EPERM` and the whole
  command dies). Use PowerShell `Start-Process` in test scripts.
- The pi harness's `edit` tool corrupts non-ASCII characters (U+25A0 etc.)
  in `oldText` matching on this machine — use ASCII-only anchors or apply
  non-ASCII edits via a Node script.
- The RAG store's `files.path` / `chunks.file_path` are normalized to
  forward slashes (one-time migration in `db.ts` `migratePathSpelling`,
  applied at `openDb`; copy-time normalization in `build.ts`).
