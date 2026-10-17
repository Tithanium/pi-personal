# METHOD D — completeness reference (goal v3) — report

- generated: 2026-10-15T17:21:37.514Z
- model: alan/qwen-3.8-27b
- corpus (trackedPaths): ["C:\\Users\\connessn\\Datas\\02_RECHERCHE\\00_Biblio\\Doc_tech_fedoo","C:\\Users\\connessn\\Datas\\02_RECHERCHE\\00_Biblio\\Doc_tech_ANSYS"]
- hang cap: 3600s; capHit threshold: 3590s

| id | source | wallMs | in/out | factsCount | verifyPassRate |
|---|---|---|---|---|---|
| fedoo_rectangle_mesh | fresh-D | 311290 | 93454/7568 | 27 | 48% (13/14/0) |
| fedoo_stresseq_nlgeom | fresh-D | 342322 | 100636/13083 | 79 | 67% (53/26/0) |
| ansys_nlgeom_cmd | fresh-D | 268168 | 54911/7244 | 33 | 91% (30/2/1) |
| ansys_fkn_contact | fresh-D | 854727 | 219226/15274 | 48 | 71% (34/14/0) |
| fedoo_modelingspace | fresh-D | 1113600 | 228212/9465 | 53 | 62% (33/16/4) |
| ansys_large_deflection | reused-phase1 | 900000 | 315388/25236 | 121 | 75% (91/30/0) |
| ansys_contact | reused-phase1 | 900000 | 318818/29329 | 105 | 76% (80/25/0) |
| fedoo_plasticity | reused-phase1 | 628957 | 211725/23236 | 84 | 67% (56/27/1) |
| fedoo_weakform_mesh | reused-phase1 | 900050 | 170252/24987 | 144 | 60% (86/57/1) |
| ansys_transient | fresh-D | 1333777 | 544756/42169 | 94 | 67% (63/29/2) |
| unrelated_cooking | reused-phase1 | 148475 | 20135/5156 | 0 | n/a |
| unrelated_quantum | reused-phase1 | 130271 | 25968/4093 | 0 | n/a |

## Totals
- ids: 12 (fresh-D 6, reused-phase1 6)
- total wall: 7831637 ms ; total tokens in/out: 2303481/206840
- facts: fresh-D 334 + reused 454 = 788
- self-verify: pass 539 / fix 240 / drop 9 (file-not-found 0)
- capHit: (none)
- missing facts.json: (none)
