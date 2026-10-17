

## Context: Quantum Error Correction / Surface Code — Verification Result

**CONCLUSION: The answer does NOT exist in either corpus.** Neither `Doc_tech_ANSYS` nor `Doc_tech_fedoo` contains any quantum error correction, surface code, logical-qubit, or code-distance content. Both are classical **finite-element-analysis** documentation sets. Verified exhaustively below.

---

### Corpus identity facts

- `Doc_tech_ANSYS` = ANSYS Mechanical APDL (finite element analysis) documentation:
  - `Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Basic_Analysis_Guide.txt`
  - `Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Advanced_Analysis_Guide.txt`
  - `Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt`
  - `Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt`
  - `Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt`
  - `Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Modeling_and_Meshing_Guide.txt`
  - `Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Nonlinear_Adaptivity_Analysis_Guide.txt`
  - `Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Performance_Guide.txt`
  - `Exemples_ANSYS/` (APDL example `.dat` problems + demo guide)
- `Doc_tech_fedoo` = fedoo (Python elastic finite-element library) documentation + source:
  - `Main_documentation_fedoo/` (Sphinx docs, `generated/`, `examples/`, `searchindex.js`)
  - `Code_source_fedoo/fedoo/` (source: `constitutivelaw/`, `weakform/`, `core/`, `util/`, `constraint/`)
  - `Exemples_fedoo/` (example scripts)
  - `okf/` (knowledge-bundle notes on FEA topics)

---

### Search verification (term → result)

Searched across BOTH corpora. All relevant quantum terms returned **zero matches**:

| Search pattern | Result |
|---|---|
| `quantum` | No matches (both corpora) |
| `qubit` | No matches (both corpora) |
| `logical qubit` / `physical qubit` / `data qubit` | No matches (both corpora) |
| `code distance` | No matches (both corpora) |
| `error syndrome` / `syndrome` | No matches (both corpora) |
| `bit-flip error` / `bit flip error` | No matches (both corpora) |
| `surface code` / `toric` | No matches (both corpora) |
| `stabilizer` / `ancilla` / `Hadamard` | No matches (both corpora) |
| `Hilbert` / `Bloch` / `fault-tolerant` | No matches (both corpora) |
| `quantum computing` / `quantum computer` | No matches (both corpora) |

**Ambiguous-term false positives (all classical FEA, none quantum):**

- `error correction` → only classical optimization, ANSYS:
  - `Exemples_ANSYS/Ansys-mechanical-apdl-technology-demonstration-guide.txt:11920` — "the decision is based on a **trial-and-error correction process**. The goal is to…"
  - `Exemples_ANSYS/ANSYS_Mechanical_APDL_Technology_Showcase_Example_Problems.txt:14249` — same passage.
- `spin` → rotor/impeller rotation, spine (biomechanics), continuum-mechanics spin tensor, `spinodoid` microstructure, Qt `QSpinBox`. E.g.:
  - `Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Advanced_Analysis_Guide.txt:4310` — "[KSP] is the **spin softening matrix** due to the rotation of the structure…"
  - `Code_source_fedoo/fedoo/weakform/stress_equilibrium.py:862` — `"log": exact logarithmic strain, XBM logarithmic **spin**`
  - `Code_source_fedoo/tests/test_axi_simcoon_structural.py:79` — "The **spin tensor** has zero entries in the hoop row / column."
  - `Code_source_fedoo/fedoo/util/viewer.py:541` — `self.iter_spin = QSpinBox()` (Qt widget)
- `topological` → mesh/geometry topology (element connectivity), not topological codes. E.g.:
  - `Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Advanced_Analysis_Guide.txt:571` — "The EEXTRUDE command documentation shows the **topological mapping** of 2D elements…"
  - `Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt:30429` — "The **Topological Method**" (meshing)
- `logical` → logical processors / `np.logical_*` / "logical choice", never logical qubits. E.g.:
  - `Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Performance_Guide.txt:1451` — "expose more than 128 **logical processors**."
  - `Code_source_fedoo/fedoo/core/problem.py:553` — `mask = np.logical_not(np.isnan(col))`
- `lattice` → structural beam-lattice / octet-lattice RVE (homogenization), not surface-code lattices. E.g.:
  - `okf/examples/lattice-beam.md:5` — `resource: ../../Exemples_fedoo/01-simple/lattice_beam.py`
  - `okf/examples/FE2.md:37` — "FE2 micro–macro homogenization, octet-lattice RVE."
- `superposition` → mode-superposition / linear-superposition (FEA dynamics & materials), not quantum superposition. E.g.:
  - `Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Basic_Analysis_Guide.txt:2647` — "residual vectors in a modal analysis to improve the accuracy for **mode-superposition**…"
- `deviatoric` / `historical` / `technological` / `geological` → matched as substrings of FEA words; no quantum content.

---

### Verified fact for the record
- Verified (grep, 2026): `Doc_tech_ANSYS` and `Doc_tech_fedoo` contain **no** quantum error correction / surface code / logical-qubit / code-distance content. Zero matches for all 30+ quantum-specific terms searched; all near-homophone hits resolve to classical finite-element-analysis terminology. The question ("How does QEC work? What does the surface code require for one logical qubit vs. a single physical error, and what code distance is needed?") **cannot be answered from these corpora.**