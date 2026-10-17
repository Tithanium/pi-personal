# OKF process analysis — prep for the `Okf_only_rag` subprocess (goal v3 PART 5, task 5, step 1)

Date: 2026-10-17 · Method: `researcher` subagent (read-only pass, 2026-10-17) + re-verification of the
key claims by the main session (inventory + provenance stamps re-checked with fresh commands).
Claims not re-checked in the main session are marked *(subagent pass)*.

## 1. Inventory — 4 OKF bundles on this machine

| Bundle | md files | `verified:` stamps | Notes *(subagent pass)* |
|---|---|---|---|
| `C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/okf` | **84** (re-verified) | **80** (re-verified) | Richest bundle: index.md + log.md + concepts + topics + examples |
| `C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/okf` | **88** (re-verified) | **0** (re-verified) | Exactly 1 `status:` (`topics/driving-ansys-from-host-code.md:6`); self-declares "not page-verified" in places (`topics/prestress.md:26-29`) |
| `C:/Users/connessn/.pi/agent/skills/github/okf` | **2** (re-verified) | — | index + log only, ZERO concept files |
| `C:/Users/connessn/Datas/02_RECHERCHE/11_all_AI/08_work_gricad/Fedoo_test_playground/mwe_run_cone_ecrase/okf` | **4** (re-verified) | — | MWE playground bundle (previously missed in inventories — found via `find **/okf/index.md` under `02_RECHERCHE`) |

Common structure: `index.md` (concept map: bullets with links + one-line synopses, e.g. fedoo
`okf/index.md:15,35`), `log.md` (append-only decision/history log — fedoo log is huge, ~204 KB *(prior
pass)*, NEVER inline it), concept/topic files with YAML frontmatter (`description:` present on
essentially every non-reserved file; fedoo also uses `tags:`, `type:`). `stale_after:` is allowed by
the spec (`pi-okf/skills/okf/SKILL.md:15`) but **used in neither bundle** *(subagent pass — grep no
matches)*.

## 2. Workflow analysis — the OKF process is write-only today

- Full tool list (`pi-okf/skills/okf/SKILL.md:90-97`): `okf_spec`, `okf_inspect`, `okf_diff`,
  `okf_init`, `okf_validate`, `okf_capture` — **no tool returns bundle content for consumption**;
  every workflow authors, mutates (capture → log.md) or reports.
- Read-back exists only as *advice* inside the adviser skills: `skills/fedoo/SKILL.md:132,146-148`
  and `skills/ansys/SKILL.md:72,82` ("CONSULT the bundle FIRST… read `okf\index.md`…"). That
  consult-first funnel is exactly what the new subagent automates, but for CONTEXT INJECTION into the
  conversation rather than for the answering model of an adviser skill.
- Consequence for design: there is no query API. `Okf_only_rag` must do raw `read`/`grep`/`find`
  over bundle files (the D precedent: raw read-only tools, `subprocessD.ts:126`).

## 3. Index exclusion evidence (why raw access is the only route)

- Live `~/.pi/rag/config.json`: `"excludePatterns": ["okf/*"]` over `trackedPaths` (fedoo, ANSYS,
  `p3-canary.md`).
- Enforced at index time in `extensions/pi-local-rag/chunking.ts:47,53,67,89` (+ async twin
  `:122-172`, helper `:197`), called from `index.ts:478,1036` ⇒ no bundle byte is ever chunked into
  `rag.db`. A DB check for 0 okf chunks was run in a prior pass (not re-run this pass).
- Therefore: the vector index can NEVER serve OKF content; the OKF-only subprocess works exclusively
  with raw file tools on the bundle directories.

## 4. Proposed design for `agents/okf-only-rag.md`

**Contract — copy D verbatim** (`subprocessD.ts:130-175`): payload = final message, ≤ 15 KB (recommend
**≤ 10 KB** for merge headroom), every fact carries `file:line` citation (`:153`), exact `UNRELATED`
= empty-payload edge (`:129`, wired `:227`), READ-ONLY + anti-fabrication rules (`:156-157`).
Agent frontmatter needs only `name`/`description`/`tools`/`model` (`skills/okf-agent-workflow/SKILL.md:12,46,49,94`);
child loader honors it (`spawnRagSubagent.ts:157-178,404-415`). Tools: `read, grep, find, ls, bash`
(read-only usage mandated in the prompt).

**Discovery + selection funnel (the "wisdom" step):**
1. Given `config.trackedPaths`, locate `okf/` bundles (existsSync per tracked path).
2. Read each bundle's `index.md` as the map (bullet links + synopsis).
3. Shortlist concepts by `description:`/`tags:`/`type:` frontmatter match against the question.
4. Targeted body grep + read of shortlisted files only (never dump whole files blindly).
5. Synthesize per sub-ask into the payload with cites; tag provenance `OKF-verified <date>` when the
   same fact exists in the indexed corpus (dedup/conflict handling against D's corpus).
6. Nothing topically relevant → exact `UNRELATED` (empty injection edge).

**Known payload risks:** stale/uneven evidence (ANSYS bundle has 0 `verified:` stamps; `stale_after:`
unused), thin stubs (`examples/td-63.md:4` = empty dir pointer), FR/EN mix, oversized reserved files
(`log.md`), duplication/conflict with the vector corpus, corpora have no git (unrecoverable writes —
hence read-only mandate).

## 5. Open questions for the implementing builder

1. **Bundle scope**: only bundles under `config.trackedPaths` (fedoo + ANSYS), or also the agent/skill
   bundles (`skills/*/okf`, MWE playground)? Default proposal: trackedPaths only, config-following.
2. **Multi-bundle merge**: when both fedoo + ANSYS bundles are relevant, one payload with per-bundle
   cite prefixes, or dominant-bundle gating like C v5's folder affinity?
3. **`UNRELATED` semantics**: OKF-irrelevant but corpus-relevant questions — should the OKF profile
   inject nothing (strict OKF-only) or fall through to D? Strict is simpler and matches the user's
   "without other resources than okf".
4. **Staleness handling**: surface `log.md` last-entry date / `stale_after` in the payload header so
   the parent model can weigh freshness?
5. **Dispatch wiring**: profile `okf-only` currently sits behind the TODO at the D dispatch
   (`index.ts`, PART5 task 4) — the switch point must choose `runSubprocessOkfOnly` when
   `ragProfile === "okf-only"`.