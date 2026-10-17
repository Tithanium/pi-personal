

Exhaustive search complete. Here is the context.

---

## VERIFICATION CONCLUSION

**The Maillard reaction, its temperature range, and its distinction from caramelization do NOT exist in either corpus.** Both corpora are finite-element (FEM) mechanical-engineering documentation — ANSYS (APDL) and fedoo (Python elastic FEM library). They contain zero food-chemistry / cooking content. All searches for the relevant terms returned zero relevant matches; every non-empty hit is an unrelated false positive (documented below with source paths).

---

## CORPORA (verified to exist)

- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_ANSYS`
  - `Exemples_ANSYS/`, `Main_documentation_ANSYS/`, `okf/` (topics: axisymmetric, contact, incompressibility, beam/shell elements, … — all FEM)
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo`
  - `Code_source_fedoo/`, `Documentation_technique/`, `Exemples_fedoo/`, `Main_documentation_fedoo/`, `okf/` (concepts: contact, rigid-body, periodic-BC, weakform, … — all FEM)

## SEARCH COMMANDS RUN (PowerShell/grep, case-insensitive, both corpora)

| # | Pattern (regex) | Result |
|---|---|---|
| 1 | `Maillard` | **0 matches** (both corpora) |
| 2 | `carameliz` | **0 matches** (both corpora) |
| 3 | `\bcook` | only FEM hits (false positives, below) |
| 4 | `browning\|brown(ed\|ing)?` | only author-name / color hits (false positives, below) |
| 5 | `amino\|lysine\|glucose\|glucos\|sugar` | **0 matches** (both corpora) |
| 6 | `pyrolysi\|carboniz\|reducing sugar\|amino acid\|frying\|\bfry\|roast\|bake\|toast` | only 2 false positives (below) |
| 7 | `reaction\|chemistry\|food\|thermal degrad\|degrad\|polymeriz\|oxidiz` (scoped to `okf/`) | only FEM "reaction force" hits (false positives) |

## NON-EMPTY HITS — ALL FALSE POSITIVES (each with source path)

Term `cook`:
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_ANSYS\Main_documentation_ANSYS\ANSYS_Mechanical_APDL_Theory_Reference.txt:3211` — "Cook([5] (p. 947))" (R. D. Cook, FEM reference author)
- `.../ANSYS_Mechanical_APDL_Theory_Reference.txt:36970` — "[5] Cook, R. D. (1981). Concepts and Applications of Finite Element Analysis"
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Exemples_fedoo\03-advanced\incompressibility_comparison.py:20` — "The benchmark is Cook's membrane: a tapered panel clamped on the left" (FEM benchmark)
- `.../Code_source_fedoo/examples/03-advanced/incompressibility_comparison.py:81` — `def cook_mesh(name):`
- `.../okf/examples/incompressibility-comparison.md:14` — "solves Cook's membrane (a …)"

Term `brown`:
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_ANSYS\Main_documentation_ANSYS\Ansys_Mechanical_APDL_Command_Reference.txt:85415` — "Plastic, Brown" (reference index entry)
- `.../ANSYS_Mechanical_APDL_Theory_Reference.txt:37297` — "[148] Brown, S. B., Kim, K. H., & Anand, L. (1989)…" (author)
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Exemples_fedoo\rigid_body\rigid_body_cow_bounce.py:133` — `pl.add_mesh(vis_cow, color="sandybrown", …)` (matplotlib color)

Term `bake`:
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_ANSYS\Main_documentation_ANSYS\ANSYS_Mechanical_APDL_Theory_Reference.txt:37126` — "[79] Baker, A. J. (1983). Finite Element Computational Fluid Mechanics" (author)
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Code_source_fedoo\tests\test_finite_strain_tangent_consistency.py:356` — "NEOHC's Lt is baked by inverting the transport" (code comment, not cooking)

Term `reaction` (in `okf/` only — all mechanical "reaction forces", none chemical):
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_ANSYS\okf\topics\axisymmetric-simulations.md:18` — "Reaction forces are on a total (360°) basis"
- `.../Doc_tech_ANSYS\okf\topics\automatic-stop-criteria.md:11` — "…reaction rate RATE… decide when a nonlinear iteration counts as converged"
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\okf\examples\punch-indentation.md:73` — "punch reaction force 71640 N (clamped-bottom stress integral …)"
- `.../Doc_tech_fedoo\okf\examples\index.md:49` — "…base reaction 10822.5 N vs Hertz 8495.5 N = +27.4 %…"

## OKF KNOWLEDGE-BUNDLE CATALOGS (curated topic lists — no food/chemistry topic present)

- `Doc_tech_ANSYS\okf\topics\`: automatic-stop-criteria, axisymmetric-simulations, constraint-equations, contact-management, dl-line-constraints, driving-ansys-from-host-code, external-mesh-import, large-displacement-nlgeom, multi-step-loading, pilot-node, prestress (+ index.md)
- `Doc_tech_fedoo\okf\concepts\`: ansys-dl-equivalence, bc-face-node-selection, beam-weakform, cohesive-interface, fdh5-dataset, incompressibility-methods, linear-buckling, mean-motion, modal-problem, nonlinear-nr-criterion, nonlinear-set-start, periodic-bc, plate-shell-elements, pressure-loads, rigid-body, rigid-tie, stress-equilibrium-nlgeom, time-dependent-bc, user-weakform

---

**Net:** zero occurrences of "Maillard", "caramelization/caramelisation", "browning", "amino acid", "lysine", "glucose", "sugar", "pyrolysis", "carbonization" in either corpus; the only `reaction`/`bake`/`cook`/`brown` hits are FEM reaction-forces, the R. D. Cook / A. J. Baker / S. B. Brown reference authors, the "Cook's membrane" FEM benchmark, and a `sandybrown` color / "baked" code comment. **The requested answer is not present in these documentation corpora.**