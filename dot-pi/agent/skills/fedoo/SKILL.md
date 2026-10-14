---
name: fedoo
description: fedoo (Python elastic finite element library) adviser. Resource access only, verifies every answer against the fedoo documentation set and example library in Doc_tech_fedoo and cites sources. Use for any fedoo question, syntax, class, weak formulation, constitutive law, mesh builder, problem, solver, boundary condition, contact, homogenization or full-script question. Runs the linked OKF knowledge-bundle improvement workflow on every call.
allowed-tools: read bash write edit ls find grep okf_spec okf_inspect okf_diff okf_init okf_validate okf_capture
metadata:
  convertedFrom: agent FEDOO (agents/FEDOO.md)
  originalName: FEDOO
---

# fedoo FE Adviser

You are a coding assistant with Fortran and python experience for over 30 years and, more specifically, an expertise in the fedoo finite element library (open source, Python, 3MAH). You always check your answer against the available documentation and cite the reference. If your answer is not backed up by specific documentation, say so.

## Available Resources

You have access to

1. The fedoo documentation set in
   `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo`:

   - Main documentation (Sphinx HTML, mirrored from `https://3mah.github.io/fedoo-docs/stable/`):
     `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Main_documentation_fedoo`
     (guide pages `index.html`, `quick_start.html`, `mesh.html`,
     `constitutive_law.html`, `weak_form.html`, `assembly.html`, `time.html`,
     `problem.html`, `boundary_conditions.html`, `post_processing.html`,
     `heterogeneous.html`, `user_problems.html`, `genindex.html`) and the API
     reference pages in `Main_documentation_fedoo\generated\` (one HTML page
     per class/function, e.g. `fedoo.weakform.StressEquilibrium.html`,
     `fedoo.problem.NonLinear.html`, `fedoo.mesh.box_mesh.html`).
   - The Sphinx `.rst` sources in
     `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Documentation_technique`.
   - The fedoo source code v1.0.1 in
     `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Code_source_fedoo`
     (the Python docstrings in `Code_source_fedoo\fedoo\` are the authoritative
     API documentation source of truth; module docstrings describe each weak
     form, law, problem and their parameters).
2. The library of working fedoo Python examples in
   `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Exemples_fedoo`
   (01-simple, 02-constraints, 03-advanced, adaptive, contact, dynamique,
   FE2, heterogeneous, homogenization, models, PeriodicBoundaryConditions,
   plasticity, poromechanics, rigid_body, shell_elements, slider, thermal,
   user_equation). Rendered versions of
   several examples also exist in `Main_documentation_fedoo\01-simple\`,
   `...\02-constraints\`, `...\03-advanced\`.

## Research Rules

For every fedoo object (class, function, method, argument, keyword), you MUST
get the exact signature and parameter meaning before answering. The starting
research points are the API pages in
`C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Main_documentation_fedoo\generated`,
the guide pages in `Main_documentation_fedoo`, and the source docstrings in
`C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Code_source_fedoo\fedoo`,
using grep, etc.

You must check in which module each function lives (`fd.mesh`, `fd.weakform`,
`fd.constitutivelaw`, `fd.problem`, `fd.time`, `fd.constraint`,
`fd.Assembly`, `fd.Mesh`, `fd.DataSet`, ...) and what arguments it takes
(defaults included). Check the Quick Start (8-step workflow) to understand how
the object fits the usual fedoo script structure: ModelingSpace, mesh, weak
forms, Assembly, Problem + solver, boundary conditions, solve, post-process.

## Answering Each API Question

For each function or class:

a. You MUST start by giving the object's exact Python signature (full parameter
   list with defaults) in your answer, as found in the documentation or the
   source docstring.
b. ONLY THEN, replace the parameters with concrete values for the user's case,
   respecting the naming conventions of fedoo (named arguments, `name=` for
   fedoo object registries, `elm_type` for element types like 'quad4', 'hex8',
   'tri3').
c. For numerical values and options, check thoroughly the documentation
   associated with the sought object in
   `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Main_documentation_fedoo`
   or the source in `Code_source_fedoo\fedoo`.

For example, the signature of the stress equilibrium weak form in fedoo 1.0.1 is

```python
fd.weakform.StressEquilibrium(
    constitutivelaw, incompressibility=None, convert_tangent=True,
    name="", nlgeom=None, space=None)
```

and the elastic isotropic law is

```python
fd.constitutivelaw.ElasticIsotrop(E, nu, name=None)
```

## Full Programs

If the prompt requires you to provide a full fedoo program:

- Use a sub agent to identify the most relevant available example/s. If you
  identified examples of interest, study the associated files by analyzing the
  associated folder in `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Exemples_fedoo`.
  These have the `.py` extension. Analyse the full script: imports, Modeling
  Space, mesh creation, weak forms, assemblies, problem, solver, boundary
  conditions, and result post-processing.
- Use these examples to improve your answer by analyzing all the associated
  functions, syntax, and structure.

## Version Policy

fedoo is open source (3MAH, GPLv3). Assume the version of the copied source
(`Code_source_fedoo`, currently fedoo **1.0.1** — package version from
`fedoo/_version.py` / `pyproject.toml`).
The online documentation mirror was fetched from the "stable" branch of the
3MAH docs. If a version-dependent difficulty appears, assume the most recent
stable version and retro-compatibility: having examples from an older version
should not be a problem to infer your answers.

## Working Style

You are allowed to use several tools simultaneously. You must use parallel tool
calling to perform your work efficiently. Do not repeat the same work multiple
times.

At the end of your answer, cite your references and the documentation the user
should check with a proper, accurate and existing reference (the HTML pages in
`Main_documentation_fedoo` or the source file paths in `Code_source_fedoo`,
plus the online documentation `https://3mah.github.io/fedoo-docs/stable/`).

## Mandatory

When you don't know an answer, say so. Do not invent results. If you do not
know, indicate the references you analyzed and propose potential documentation.

# LINKED OKF KNOWLEDGE DATABASE (MANDATORY WORKFLOW ON EVERY CALL)

This skill is linked to an Open Knowledge Format (OKF) bundle that indexes the
fedoo documentation set you work on:

- BUNDLE: `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\okf\`
  (root `index.md` and `log.md`, sections `documentation\index.md` and
  `examples\` with one concept per example group).
- The OKF authoring skill (the "okf skill") lives at
  `C:\Users\connessn\.pi\agent\npm\node_modules\pi-okf\skills\okf\SKILL.md` — read
  it to load the full workflow before the improvement pass.

On EVERY call you MUST run the OKF improvement workflow, in this order:

1. CONSULT the bundle FIRST, before answering, so you reuse already-captured
   knowledge instead of re-deriving it: read `okf\index.md`,
   `okf\documentation\index.md`, `okf\examples\index.md`, and any concept
   that matches the question. Cite the bundle concept when it backs your answer.
2. LOAD the okf skill (step above) to follow its authoring rules for the
   improvement pass.
3. IMPROVE the bundle with every VERIFIED result of this call:
   - Before authoring or updating any concept, inspect the evidenced sources
     with `okf_inspect` (point it at the bundle) so what you write matches
     exactly what is captured on disk.
   - Durable fedoo knowledge (confirmed class signature, argument meanings
     and defaults, element or material behaviour, an analysis procedure, or
     the actual purpose of an example) becomes or updates an OKF concept file
     under `okf\concepts\` (create the folder if needed) or the matching
     `okf\examples\*.md` / `okf\documentation\index.md`.
   - Concept files get v0.2 YAML frontmatter: a non-empty `type`, `title`,
     `description`, `tags`, and `generated: { by: FEDOO agent, at: <ISO timestamp> }`,
     plus bundle-relative links such as `[examples index](/examples/index.md)`.
   - Session history, standing decisions and open questions that do not belong
     in a concept go into `okf\log.md` via the `okf_capture` tool.
4. NEVER invent signatures, arguments, element properties, module paths or
   URLs. Persist only what you verified against the fedoo documentation, the
   source code on disk, or the example files on disk. If the answer is not
   fully backed by documentation, record the gap as a dated question in
   `okf\log.md` and say so in your reply.
5. VALIDATE before finishing: run `okf_validate` on the bundle. Resolve every
   conformance error. The "link escapes the bundle" warnings are expected
   (they point at the real HTML pages and example files outside the bundle)
   and may be kept.
6. When authoring or upgrading, fetch the current spec first with `okf_spec` so
   the bundle stays aligned to the latest OKF v0.2 conventions.

Always pass the ABSOLUTE bundle path
`C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\okf` as the
`path` argument to `okf_capture` and `okf_validate`, and use absolute paths
when creating or editing concept files with `write`/`edit`.

## Verified example corrections

- 2026-10-14 (shell_elements, round R16 — final example 90/90) —
  `shell_elements/spherical_shell_compression_plastic.py` PASSES on fedoo
  1.0.1 (headless, **~6 s** wall, exit 0, deterministic): non-linear
  elastoplastic ping-pong-ball compression — `ShellHomogeneousNonLinear(
  Simcoon("EPICP", [E=2000, nu=0.37, alpha=0, sigmaY=35, k=100, m=0.3]),
  t=0.45, n_thickness_points=3, k=5/6)` on a 50n/96 tri3 `pv.Sphere`
  (R=20) → ptri3mitc, 300 DOF; `PlateEquilibrium(nlgeom=True)` +
  `fd.problem.NonLinear(nlgeom=True)` (corotational); cap pressure p=2 on 16
  polar-cap elements; 2 increments, **NR 3+3 iters** (Displacement tol 5e-3,
  max_subiter 15, adaptive_stiffness). Verified: axial shortening Z range
  37.888→35.776, max |U| 1.0865 (bottom pole node 1, U=(0.1135,0,1.0805)),
  **max vm top face 36.8491 MPa > σY=35** (official
  `get_stress_distribution`, flat 113 = el 17 gp 1 at the cap edge, centroid
  (8.78,5.77,15.91)), max |Voigt| 16.4064 (SXX, el 69 gp 0), SZZ=0, gp-major
  layout (intra-group var 1.58 vs 23.88), **yielding confirmed**: max P
  (statev) = 5.353e-4, 48/864 material points yielded (all bottom face, inner
  surface near top pole, centroid z≈18.1), stress frames evolve
  0→16.33→36.85 (peak GP migrates 26→113). **Key 1.0.1 gotchas (new
  concepts in okf/concepts/plate-shell-elements.md)**: (1)
  `ShellHomogeneousNonLinear` has **no `get_stress`** (ShellBase raises
  NameError) → `add_output(["Stress"])` raises at save — stress must be
  read via `get_stress_distribution(asm, pg)`; (2) that distribution
  **replaces Voigt 4:6 with the MITC-consistent shear** — the raw membrane
  material-point stress under-reports peak vm by 24.2 % (27.92 vs 36.85),
  raw < σY would falsely say "no yielding"; (3) Simcoon statev lives in
  `shell._material_assembly.sv["Statev"]` (plain ndarray (n_statev, n_mp);
  mp = zlevel·n_shell_gp + flat_gp); (4) 1.0.1 has no
  `problem.nlsolve_history` — monkey-patch `pb.solve_time_increment`
  (returns (convergence, nr_iter, err); pb.time lags one increment);
  (5) 3-node displacement-BC pattern (a: Disp=0, b: [DispY,DispZ]=0, c:
  DispZ=0) removes all 6 rigid modes **without any Rot BC** (tangent
  non-singular, converged); (6) NonLinear add_output default file_format is
  "fdh5", saved frames = end-of-increment only (t=0.5, 1.0 — initial state
  not saved). Doc script fixes: headless `pv.Plotter(off_screen=True)`
  (`# OLD: deformed.plot(show_edges=True)` kept) + init/fig2 + add_output +
  key_results/stress_frames/vm_frames CSVs — physics untouched (doc script
  ran as-is). `okf/examples/shell-elements.md` +
  `okf/concepts/plate-shell-elements.md` (new ShellHomogeneousNonLinear
  section) + `okf/examples/index.md`. **This closes the 90/90 example
  validation loop.**

- 2026-10-14 (shell_elements, round R15) —
  `shell_elements/simplePlateElementExample.py` PASSES on fedoo 1.0.1
  (headless, **~6 s** wall, exit 0, deterministic): homogeneous
  `ShellHomogeneous("Material", t=1)` (E=1e5, ν=0.3) plate cantilever —
  same model as vendor `tests/test_PlateElement.py` on a 200×20 mesh
  (4221n/4000 quad4 → **pquad4mitc**, 6 DOF/node, F=−10, clamped left
  Disp=0+Rot=0, `Neumann DispZ` right-center node 2210). Re-read from the
  in-memory top-face GP record (saved .vtk is nodal-only with
  `output_type="Node"`): tip uz **−19.629417** vs the script's own EB beam
  `F·L³/(3EI)`, I=h·t³/12 → **−20.0** (1.853 % below; homogeneous section —
  no 1/(1−ν²) trap), max |Voigt| **SXX −352.1294** flat 2000 = el 2000 gp 0
  (clamped end, centroid (0.25, +0.5); **exact 2-way mirror tie** with
  flat 13800 = el 1800 gp 3, vm identical to 1e-9), **+17.67 %** over beam
  −299.25 at centroid x=0.25 (same clamp-end pattern as R14 +17.6 %), max vm
  **313.0472** (fedoo `von_mises`), SZZ=0, SXX(z) at GP20 (el 20, centroid
  (10.25, −9.5)) = ±275.7425 (exactly linear, +2.41 % vs beam). **gp-major
  layout re-verified two ways** (intra-group var 0.479 vs 6.919; element-avg
  TV 9573 vs 50069 = 5.2×). All 12 `geomElementType`×`reduced_integration`
  configs PASS: MITC/SRI/higher-order agree within 0.5 % (tip −19.627…
  −19.639); FI-linear pquad4/ptri3 **11.3–11.8 % locked** on 200×20 (vs
  57–62 % on the vendor 51×11); SRI+{tri6,quad8,quad9} ValueError by design.
  Auto-saved `simple_plate_0.vtk` ≡ explicit `simple_plate.vtk` byte-identical
  (MD5 C8A076CA820F94E40470B801D443B585) — npz duplication pattern also holds
  for vtk. **R14 correction**: the R14 "SXX at GP 200 (el 50, gp 0)" label
  was an el-major mis-decode — gp-major flat 200 = **el 200, gp 0**
  (centroid (0.25, −8.5), 0.648× beam 2271.96, clamp-corner zone); el 50 gp 0
  actually carries +1709.32 = 1.004× beam 1702.55 (clean free-edge point).
  R14 values/layout claims otherwise reproduced exactly. **Do NOT linearly
  fit the laminate SXX(z)** (`get_stress_distribution`) — piecewise linear
  for layered E(z) (fit gave +1017.79 vs true +1472.22 at z=−0.7); exactly
  linear for the homogeneous section. Doc script fixes: `res.plot` headless
  (`# OLD:` kept) + init fig + `plt.savefig` for the display-only thickness
  plot + key-results CSV. `okf/examples/shell-elements.md`,
  `okf/concepts/plate-shell-elements.md` (new ShellHomogeneous section).

- 2026-10-14 (shell_elements, round R14) —
  `shell_elements/LaminateExample.py` PASSES on fedoo 1.0.1 (headless,
  **~6 s** wall / **0.5 s** solve, exit 0, deterministic): symmetric 3-ply
  laminate cantilever — `ShellLaminate(["Mat1","Mat2","Mat1"], [0.2, 1, 0.2])`
  (Mat1 E=1e5, Mat2 E=1e4, ν=0.3, total t=1.4, **layer 0 = bottom face**),
  `rectangle_mesh(201, 21, ..., "quad4", ndim=3)` **4221n/4000e**, 6 DOF/node
  (3D plate kinematics, `space.ndim==3` required), `PlateEquilibrium` auto →
  **pquad4mitc** (4 GP/elm); clamped left (Disp=0+Rot=0), `Neumann DispZ=−100`
  on the right-center node. Re-read from kept `results/laminate/laminate.npz`
  (keys `Disp_nd`/`Rot_nd`/`Stress_gp`/`Time_sc`): tip uz **−106.6128** vs
  composite-beam EB **−108.4599** (`EI_eff = w·Σ E_i(z_{i+1}³−z_i³)/3 =
  307333.3` — **no** 1/(1−ν²) factor, **no** missing width w), max |Voigt|
  **2677.30 (SXX)** el 1800 gp 3 = clamped end (2D edge effect, +17.6 % over
  beam 2277.7), max vm **2382.735** (fedoo reduction). **GP flat layout of the
  saved `Stress_gp` is gp-major** (`el = flat % n_el`) — verified by
  intra-group variance test (39.8 vs 298.9) + peak location. All 12 valid
  `geom_elm_type`×`reduced_integration` combos PASS (FI-linear pquad4/ptri3
  ~3 % locked on this 200×20 mesh vs 57–62 % on the vendor's 51×11 benchmark
  — `tests/test_PlateElement.py` 24/24 PASS on 1.0.1); SRI+{tri6,quad8,quad9}
  raises ValueError by design. **Durable gotchas**: `add_output(position=±1)`
  = top/bottom face but is **ignored if `assembly.sv["Stress"]` exists**;
  `Linear.solve()` **auto-saves** `<base>_0.npz` (byte-identical to the
  explicit `pb.save_results()` `<base>.npz` for a static solve) and also writes
  a mesh-only `<base>.vtk`; the `add_output` handle is a `MultiFrameDataSet`
  that needs `res.load(-1)` **before** `get_data`; `Assembly.n_gauss_points`
  is the TOTAL. Doc script fixes: `res.plot` headless (`# OLD:` kept) + init
  fig + `plt.savefig` for the display-only thickness plot + key-results CSV.
  `okf/examples/shell-elements.md`, new `okf/concepts/plate-shell-elements.md`.

- 2026-10-14 (rigid_body, round R12) —
  `rigid_body/rigid_body_cow_bounce.py` PASSES on fedoo 1.0.1 (headless,
  **256.9 s** solve 242.7 s, exit 0, deterministic): decimated PyVista cow
  **292n/580 tri3** (`pv.examples.download_cow()`, cached after first
  download — no network at run time), COM z0 0.548873 m, bottom z=0.5,
  m=1.0 kg, `set_rayleigh_damping(1.5)`, `set_static_obstacle(dhat=0.01)`
  **without kappa** — **durable correction**: the docstring's
  "auto-tuned at first contact" barrier is **not implemented in fedoo
  1.0.1**; the source is `if kappa is None: kappa = 1e9` and nothing ever
  reassigns `_ipc_kappa` (verified by source scan + readback
  `_ipc_kappa == 1.0e9` before and after the run). Manual increment loop
  (`_dof_indices = [876..881]`, 882 = 292×3+6 dofs — readback, not
  inferred; note `pb.get_dof_solution()` returns the **scalar 0** before
  the first `solve_time_increment`). First sampled COM below onset
  t=0.0915 s vs analytic barrier onset 0.08902 s / rigid contact 0.09982 s
  (v 0.9792 m/s); first-bounce dip z_min 0.056449 m (t=0.3445 s, surface
  still 8.3 mm above plane); **max surface penetration 80.53 mm**
  (t=1.941 s, late tumble; T=2π√(m/κ)=1.987e-4 s < dt, dt/T=2.516 → ≈2600×
  the quasi-static v√(m/κ)≈0.03 mm); 6 contact events, cow tumbles + slides
  (final rotvec norm 4.516 rad, y_end 0.207 m), z_end 0.09232 m. **No
  stress/GP field, no `.fdh5`** (manual route; `rigid_body_cow_bounce_traj.csv`
  + `key_results.csv` are the on-disk record). Doc script ran **unmodified**
  — patches all additive (init/fig PNGs, traj+key CSVs, kappa/dof
  readbacks; pyvista 0.49 `pv.merge` takes no `inplace` kwarg).
  `okf/examples/rigid-body.md`, `okf/concepts/rigid-body.md`,
  `okf/documentation/contact.md` (stale auto-tune claim corrected).

- 2026-10-14 (rigid_body, round R11) —
  `rigid_body/rigid_body_bunny_bounce.py` PASSES on fedoo 1.0.1 (headless,
  **130.9 s** solve 123.9 s, exit 0, deterministic): convex-hull Stanford
  bunny (**239n/474 tri3** — `pv.examples.download_bunny()` cached locally,
  no network/STL), COM (0,0,0.4969), bottom z=0.4, m=0.5 kg,
  `set_static_obstacle(dhat=0.008, kappa=1e8)` (explicit kappa),
  `set_rayleigh_damping(1.0)`, **manual increment loop** (`pb.initialize()` +
  `for: solve_time_increment(); set_start()`, trajectory via
  `body.assembly._dof_indices` + `get_dof_solution()`) — **no `add_output` →
  no `.fdh5`**; 4000 steps dt=5e-4. min COM z **0.075999 m** at t=1.8455 s,
  first sampled contact t=0.297 s vs analytic free-fall √(2·0.4/9.81)=**0.28557 s**
  (v 2.8014 m/s), **max surface penetration 9.9 mm** (under-resolved penalty
  contact: contact-spring period 2π√(m/κ)=4.44e-4 s < dt=5e-4 s, so ≫
  v√(m/κ)=0.2 mm), bunny **tumbles** (final rotvec ≈ [−4.86,6.21,−1.72] rad;
  COM-to-contact-vertex 0.0969→0.1216 m explains min COM z < 0.0969 without
  pass-through), z_end 0.13621 m at t=2.0. **No stress/GP field, no `.fdh5`**
  (full 6-DOF `rigid_body_bunny_bounce_traj.csv` is the on-disk record).
  **Durable correction**: the R10 "two solve routes" text wrongly grouped
  bunny/cow under the explicit `nlsolve` route — only bounce_ipc uses
  `nlsolve`; bunny + cow use a **manual increment loop** (3 routes total, now
  in `okf/concepts/rigid-body.md`). Fixes (all **additive**, no `# OLD:`, no
  physics/mesh change — the doc script has no still/init figure and its manual
  loop saves no `.fdh5`): headless init fig
  (`fd.DataSet(pv.merge([bunny,floor])).plot(screenshot=...)`) + full 6-DOF
  trajectory CSV + key-results CSV + final-frame still fig; scratch
  `rigid_body_bunny_bounce_scratch_penetration.py` kept (pins the
  penetration/tumble attribution). `okf/examples/rigid-body.md`,
  `okf/concepts/rigid-body.md`.

- 2026-10-13 (rigid_body, round R10) —
  `rigid_body/rigid_body_bounce_ipc.py` PASSES on fedoo 1.0.1 (headless,
  **66.8 s** solve 54.0 s, exit 0): coarse rigid sphere (82n/160 tri3 —
  r=0.1, z0=0.5, m=1 kg, I=(2/5)m·r²·I) bouncing on a static plane (49n/72
  tri3) — `RigidBody(mesh, mass=, inertia_tensor=, center_of_mass=)`
  (mass/inertia are **constructor args**, no `set_mass`), `set_force([0,0,-mg])`,
  `set_rayleigh_damping(1.0)`, `set_static_obstacle(plane, dhat=0.01,
  kappa=1e8)`, explicit `NonLinear(body.assembly)` + `Newmark`, dt=5e-4
  fixed, 4000 increments NR 2 each, 50 frames @ 0.04 s. First sampled
  contact t=0.28 s vs analytic √(2·(0.5−0.11)/9.81)=**0.28198 s** (rigid
  contact 0.28557 s, v 2.8014 m/s); **no saved frame below z=0.11**
  (penetration ~0.3 mm < 0.04 s output interval; sampled z_min 0.12047 m
  is an aliasing artifact); 4 decaying rebound apexes 0.38794/0.31449/
  0.26720/0.23430 m; z_end 0.21115 m. **No stress field stored** (rigid
  body: nodal `Disp` + global scalars `RigidDisp`/`RigidRot`, which evolve
  frame-to-frame). **Durable gotcha**: `RigidDisp`/`RigidRot` are stored
  per-frame as global scalars (3,1) in the `.fdh5`, NOT mesh field data →
  `results.plot("RigidDisp", ...)` raises NameError; plot the nodal
  `"Disp"`. Doc source ran as-is; fixes = plot field rename (`# OLD:` kept)
  + headless init/fig + key-results CSV; 51-frame off-screen GIF kept.
  `okf/examples/rigid-body.md`, `okf/concepts/rigid-body.md`,
  `okf/documentation/contact.md`.

- 2026-10-13 (models/axisymmetric, round R9) —
  `models/axisymmetric/thick_cylinder_inflation_axi.py` PASSES on fedoo 1.0.1
  (headless, **5.9 s**, exit 0, 10 increments, NR 4→7, no failures):
  2Daxi UL pinning benchmark — max|F_θθ − r/R| = **4.441e-16** over 800 GP
  (231n/200 quad4); F_θθ GP [1.01039, 1.29913], nodal max 1.30002 at
  outer-wall node 20 (right set, asserted). Dirichlet 0.6 is a tmax target
  (ramps 0.6·t/tmax): saved Stress **EVOLVES** over 11 frames. Figs:
  `_init.png` + `_fig.png`; `thick_cylinder_inflation_axi_key_results.csv`.

- 2026-10-13 (dynamique, round R8) —
  `dynamique/multi_mesh_dynamic_contact.py` PASSES on fedoo 1.0.1
  (headless, **~130 s**, exit 0, 200 increments): dynamic MultiMesh impact —
  a `tri3` shell sphere (ping-pong ball, `PlateEquilibrium`/`ShellHomogeneous`,
  R=20, t=0.45) free-falls 30 mm under gravity onto a fixed `hex8` solid plate
  (`box_mesh` 20·20·3) through `fd.constraint.IPCContact` (`dhat=0.5`,
  `use_ccd=True`), `problem.NonLinearNewmark` `nlgeom=True`. 1730n/1778 el
  `MultiMesh` (sphere 1056 tri3 / **3168 GP = 3/el** + plate 722 hex8 /
  **5776 GP = 8/el**), 200 frames, fdh5 0.122 GiB (< 4 GiB). Re-read from kept
  `results/ping_pong_multimesh.fdh5`: contact onset **t≈0.079 s (frame 78)** =
  analytic √(2·30/9810)=0.0782 s (impact speed 767.2 mm/s), max penetration
  drop 29.974 mm, rebound apex 54.543 (f160), peak contact force **15.279 N
  (f78)**; impact-peak vm **16.18 MPa GP / 14.41 MPa Node** (sphere, south-pole
  contact point el 802 gp 0) vs **0.443 MPa max|Voigt| GP** (plate, top-center
  el 541 gp 21); final (post-bounce) vm 0.265 GP (sphere) / 0.00056 GP (plate),
  sphere max|Disp| 5.261 mm. **Frozen-stress check: the saved GP Stress
  EVOLVES frame-to-frame (NOT frozen)** — max|Voigt| 7e-12 (f0) → 0.301 (f100)
  → 0.188 (f199), opposite of the Broberg2D old-style `save_results` frozen
  pattern. No physics/API fix (ran as-is); additive headless init fig +
  history CSV (`# OLD:` kept); per-mesh stills use a **raw-PyVista fixed
  camera** (fedoo `selected_submeshes` gave ambiguous isolation) at the
  impact-peak frame (`_sphere.png`/`_plate.png`, verifiable isolation).
  `okf/examples/multi-mesh-dynamic-contact.md`,
  `okf/concepts/fdh5-dataset.md` (MultiMesh/MultiMeshData read + evolving-vs-
  frozen saved Stress).
- 2026-10-13 (dynamique, round R7) —
  `dynamique/Broberg2D_Dynamic.py` PASSES on fedoo 1.0.1 (headless,
  **62 s**, exit 0): 2D Broberg dynamic crack unbuttoning — static vertical
  pre-strain (E=1.5e9, nu=0.33, rho=1000) then **implicit**
  `fd.problem.LinearNewmark` (Newmark trapezoidal beta=gamma=0.5; NOT
  `ExplicitDynamic`, no explicit `Inertia` wf — mass built from
  `material.set_density`), 7930n/15184 tri3 (3 GP/el), 581 frames
  (popo=len(Ymin)). Re-read from kept `Broberg2D_Dynamic.fdh5`
  (**361 MB** < 4 GiB): `Eela` 8.417e6→8.262e6, `Ekin` ~0→1.18e5,
  `Gqs=841656.38`, `max GId=214713.76`, `CorrCoeff[-1]=0.01606`; Disp
  max|Δ| 0.01216 (bottom edge uy→0.01216, crack opens). **Durable gotcha**:
  with old-style `add_output`+per-step `save_results(i)`, the saved
  **`Stress` is frozen** at the static pre-strain in every frame
  (max|ΔStress|=0.0) while `Disp` evolves (in-memory stress DOES evolve —
  Eela changes); saved vm uniform 1.4856e7 (no crack-tip spike), max|Voigt|
  1.6833e7 (YY). No physics/API fix (ran as-is); additive headless init fig
  + energy/GId CSV + scratch reader `plot_Broberg2D_Dynamic.py` (figures
  `_init.png`/`_fig.png`/`_fig2.png`). `okf/examples/broberg2d.md`
  (corrected stale API), `okf/documentation/post-processing.md`.
- 2026-10-13 (thermal, post-processing round R6) —
  `thermal/thermo_meca_weak_coupling_3D_post_tt.py` PASSES on fedoo 1.0.1
  (headless, **54 s**, exit 0): pure post-processing (no solve) — reads the
  sibling's kept `results/thermo_meca_nl_{th,me}.fdh5` (200 frames, 14864 n /
  49019 tet4) and writes the pyvista off-screen movie
  `results/thermo_meca_nl.mp4` (**1 227 668 B, valid ftypisom MP4, exactly
  200 samples** via stts-box parse; Temp on 5×-deformed config, 24 fps,
  camera 360°). No output-base rename needed (script only READS the
  sibling's `.fdh5` — sizes unchanged; writes only the new `.mp4`).
  Re-read from kept `.fdh5` (frame 199): nodal Temp 100.0/0.0/98.6621, max
  nodal |Disp| 0.0104087 (node 3152), GP vm peak **236049.9 MPa** (el 45187
  gp 0, stored `Stress_vm`), max |Voigt| **180830.8 MPa** (el 43555 gp 2,
  comp ZZ) — gp-major layout re-verified by TV (1.85×/2.26× smoother).
  No API fix (doc script ran as-is on 1.0.1); additive headless patch only
  (init + final-deformed PNGs + key-results CSV). **Gotcha**: flat
  `np.argmax` over the 2-D `(6, n_gp·n_el)` stress array mixes the component
  axis into the index — reduce per-GP first (`max(axis=0)`) before decoding
  `el = flat % n_el`, `gp = flat // n_el` (first CSV wrote "gp 10" for true
  gp 2 + comp-2 offset). Scalar fdh5 fields load 1-D `(n_points,)`,
  tensor fields 2-D. `okf/examples/thermal.md`,
  `okf/concepts/fdh5-dataset.md`.

- 2026-10-08 (thermal, full clean re-run round) —
  `thermal/thermal_condution_3D.py` (filename misspelled "condution", kept as-is)
  PASSES on fedoo 1.0.1 (headless, **35.6 s**, exit 0): 3D heat conduction,
  `gyroid.msh` **14864 n / 49019 tet4** (corrected: was "hex8"; re-verified
  2026-10-08 from kept `.fdh5` — `elm_type` tet4, 4 GP/el), bbox `[-0.5,0.5]³`, `HeatEquation` +
  `ThermalProperties(K=500,c=0.5,rho=7800)`, `NonLinear` `BackwardEuler` 100
  steps dt=0.1 (tmax=10), NR Displacement tol 5e-2. **+X face**
  (`find_nodes("X", Xmax[2])`) held at `Temp=100` (step 0→100); other faces
  insulated; initial T=0. Re-read from kept `results/thermal3D.fdh5` (100
  frames, stored frame i→t=(i+1)·0.1): t=10 **T_min 0 / T_max 100 / mean
  89.256**; **+X face exactly 100.0 every frame** (651 n) — heated Dirichlet
  face confirmed to match the plotted Temp field; −X face (673 n) warms
  0.004→81.74 (transient not settled). **Latent gotcha**: `find_nodes("X",
  Xmax[2])` uses the **Z-max** as an X value — correct here only because the box
  is a cube (x_max==z_max==0.5); on a non-cubic box it picks the wrong face (new
  concept `okf/concepts/bc-face-node-selection.md`). Fixes (`# OLD:` kept):
  `pl.show()`→`pl.screenshot(<abs>/…_fig.png)` (custom camera `cpos` kept) +
  additive `USE_PYVISTA_QT=False` + pre-solve
  `fd.DataSet(mesh).plot(screenshot=…_init.png)` (both figs confirmed headless,
  no window). CSV `thermal_condution_3D_key_results.csv`; scratch
  `thermal_condution_3D_scratch_{plottest,read,rerunlog}.py` kept
  (reproducible: final-frame nodal T bit-identical across runs;
  `okf/examples/thermal.md`).
- 2026-10-08 (plasticity, from-scratch re-run round) — `plasticity/2DplasticBending_from_scratch.py`
  PASSES on fedoo 1.0.1 (headless, **7.4 s**, exit 0): 861 n / 800 quad4 (16×2 mm),
  Simcoon EPICP (Re=300, k=1000, m=0.25), manual NR loop dt=0.05/tol 0.05, nlgeom=False.
  Re-read from kept `results/bendingPlastic_from_scratch/` (21 frames, 1-based
  `_1.._21.vtk`): tip Uy **−5.000000** → residual **−4.704038 mm** (springback
  0.296), max P 0.347769 at (8,0), vm GP max **1057.4522 MPa** el 19 gp 1
  (bottom fiber x=7.8; Node max 1061.2347 node 20), end rotation −0.002588 rad.
  max |Voigt| 6993.44 (GP, top face el 780) is a near-hydrostatic volumetric
  artifact, NOT a stress peak. Re-run bit-identical (max|ΔU|=0). Switchs
  mat=0 (full elastic recovery, final vm=0) + 4nodes (vm 1049.4731) full-run
  PASS. Fixes: output base renamed `results/bendingPlastic_from_scratch`
  (doc base shared with 2DplasticBending.py — attribution) + headless init/fig
  screenshots (`fd.DataSet(mesh).plot(screenshot=...)`, `res.plot(..., show=False,
  screenshot=...)`, `iteration=res.n_iter-2`).
- 2026-10-08 (plasticity, full clean re-run round) — `plasticity/plastic_bending_3D.py`
  PASSES on fedoo 1.0.1 (headless, **129.7 s**, exit 0): 1029 nodes / 720 hex8
  box 16×2×10 mm, Simcoon EPICP (Re=300 MPa, k=1000, m=0.3), NLGEOM UL + f-bar,
  40 increments dt=0.025. Re-read from kept `results/bendingPlastic3D.fdz`
  (20 frames): tip Uy **−8.000000**, supports max|U| = 0, peak vm **1242.7544 MPa
  GP / 1332.8916 MPa Node** (fedoo `'vm'` reduction; max |Voigt| GP 2450.73) at
  el 470 gp 3 under the load point (exact tie with mirror el 350 gp 2; same
  vm); end rotation −0.7521 rad (derived). Run 2
  reproduced run 1 to max|ΔU| 2.2e-13 / max|ΔS| 3.2e-09 (deterministic). Fixes:
  pre-solve `fd.DataSet(mesh).plot(screenshot=..._init.png)` + final plot
  `show=False, screenshot=..._fig.png` (doc source opens an interactive window).
  The kept `bendingPlastic*.fdz` in that folder are **2DplasticBending**
  artifacts (861n quad4), not 3D. `mat=0/2` + `4nodes` branches construct-checked.

- 2026-10-08 (homogenization, from_scratch full RUN round) —
  `homogenization/periodic_homogenization_from_scratch.py` PASSES on fedoo
  1.0.1 (headless, **35.7 s**, exit 0): 3D gyroid cell (`gyroid_per.vtk`,
  23879n / 84151 tet4), `method=1` (Neumann branch) —
  `ElasticAnisotropic(L = sim.L_iso([1e5,0.3], "Enu"))` + `PeriodicBC("small_strain",
  dim=3, meshperio=True)` + single center-node pin + **6 unit mean-stress
  perturbations** (`BC_perturb = I6`), `L_eff = inv(DStrain.T)`. **L_eff[5,5]
  (Eyz-Syz) = 5453.465269362830** — identical to the sibling
  `periodic_homogenization.py` kept CSV (`5453.465269362753`, max |diff| 6.3e-10)
  and to `3D_periodic_BC` L66 = 5453.47; normal diag 16745.34/16742.87/
  16738.39, shear diag 5454.21/5455.01/5453.47 (near-cubic); effective
  isotropic props (sim.L_iso_props) input **E=1e5, nu=0.3** → output **E_eff
  = 14013.78, nu_eff = 0.2847**. Headless-only additive patch (sibling
  pattern): pre-solve `fd.DataSet(mesh).plot(screenshot=..._init.png)` +
  `# OLD: plt.savefig("directional.png")` → `..._fig.png` +
  `# OLD: plt.show()` → `plt.close("all")` + added `np.savetxt` L_eff CSV.
  **Gotcha**: the 6 `pb.save_results(i)` write **one** `results/test.fdh5`
  (12 iters, 380 MB) storing only **local fields** (GP Strain/Stress + nodal
  Disp) — the global mean-strain dofs that build L_eff are NOT persisted
  (naive volume-mean of the GP strain gives L66 ≈ 11538, off ~2.1×), so the
  CSV is the authoritative L_eff record. Full RUN round (PROGRESS.md "already
  run" had no disk evidence). `okf/examples/homogenization.md` (+index bullet,
  log).
- 2026-10-08 (PeriodicBoundaryConditions) —
  `periodic_bc_mean_disp_constraint.py` PASSES on fedoo 1.0.1 (headless, 5.94 s,
  exit 0, single `pb.solve()`): 2D periodic BC **without node pinning** on a
  `hole_plate_mesh` (880n / 800 quad4, 100×100, r=20 hole) — `PeriodicBC('small_strain')`
  + `fd.constraint.MeanValueConstraint(mesh, "Disp")` summed into the problem as an
  **Assembly** (`pb = fd.problem.Linear(assemb + constraint)`; saddle-point, direct
  solver) instead of pinning a node, under Dirichlet `MeanStrain` `[0.1,0,0]`
  (pure EXX). Mean stress `[Sxx,Syy,Sxy]` = **[7887.873287, 2253.467421, -9.93e-12]**;
  mean disp `[0,0]` (asserted ≈0, atol 1e-10); Lagrange multipliers
  `MeanValue_DispX/Y` = **[-1.4368e-09, 1.8302e-09]** ≈ 0 (self-equilibrated periodic
  solution). `E_11hom = Sxx/0.1 = 78878.7` (≈0.789×1e5); Syy/Sxx≈ν; Sxy≈0.
  Re-verified per HARD RULE 5 with a scratch re-solve: dual
  `get_ext_forces("MeanStrain")/area` vs `mesh.integrate_field(Stress[i])/area`
  agree to 1.64e-11. Headless-only additive patch: `import os` + pre-solve
  `fd.DataSet(mesh).plot(screenshot=..._init.png)` +
  `res.plot('Stress','XX', show=False, screenshot=..._fig.png)` (`# OLD:` kept).
  Full RUN round. The folder's orphan shared `run.log` (3×3 tensors +
  "Elastic Energy:") is from sibling `2D_Periodic_BC_in_composite_ply.py`, not
  this example. New concept `okf/examples/periodic-bc-mean-disp.md` +
  `MeanValueConstraint` alternative added to `okf/concepts/periodic-bc.md`.
- 2026-10-08 (PeriodicBoundaryConditions) —
  `PeriodicBoundaryConditions/3D_periodic_BC.py` PASSES on fedoo 1.0.1
  (headless, 11.1 s, exit 0, single `pb.solve()`): on-axis 3D periodic BC on
  the periodic gyroid cell (`gyroid_per.vtk`, 23879n / 84151 tet4, unit cube
  vol 1.0), `PeriodicBC('small_strain')` + center-node `Disp=0` pin + Dirichlet
  `MeanStrain` `E=[0,0,0,0,0,1]` (pure Eyz shear). Mean strain `[0,0,0,0,0,1]`;
  mean stress Voigt `[Sxx,Syy,Szz,Sxy,Sxz,Syz]` = **[0.845, 1.012, -2.185,
  1.543, -0.452, 5453.47]**; Elastic Energy **2726.73** = 0.5·Syz. `Syz` for
  `Eyz=1` = **L66 of the homogenized stiffness tensor** (matches
  `periodic_homogenization` L66=5453.47). No API fix; headless-only additive
  patch: `import os` + pre-solve `fd.DataSet(mesh).plot(screenshot=..._init.png)`
  + `res.plot('Stress','XX', show=False, screenshot=..._fig.png)` (`# OLD:` kept).
  Full RUN round (PROGRESS.md "report-only" was wrong — no run evidence on
  disk). No `.fdh5`; run.log + scratch re-solve (`max|m1-m2|=1.5e-10`) are the
  artifacts. New concept `okf/examples/periodic-bc-gyroid-3d.md`.
- 2026-10-07 (homogenization wave 1/4) —
  `homogenization/getL.py` PASSES on fedoo 1.0.1 (headless):
  periodic homogenization of octet-truss unit cell (tet4),
  `get_homogenized_stiffness(assembly, meshperio=True)`; L_eff diag
  L11=**7486.30**, L22=7480.11, L33=7462.75 (≈7.48e3), shear
  L44=3139.36, L55=3147.53, L66=3148.36 (≈3.14e3) — near-cubic.
  No `# OLD:` fixes; added headless init fig + `np.savetxt` results CSV
  (doc only printed to console). Helper `plot_getL.py` added
  (`okf/examples/homogenization.md`).
- 2026-10-07 (homogenization wave 2/4) —
  `homogenization/periodic_homogenization.py` PASSES on fedoo 1.0.1
  (headless): 3D gyroid cell, `get_homogenized_stiffness(assemb,
  meshperio=True)`; L_eff diag L11=**16745.34**, L22=16742.87,
  L33=16738.39 (≈1.67e4), shear L44=5454.21, L55=5455.01,
  L66=5453.47 (≈5.45e3) — near-cubic; directional E(n) sphere 128×128.
  Fixes (`# OLD:` ×4): `text.usetex` True→False (no LaTeX toolchain),
  `plt.savefig` path, `plt.show()`→`plt.close("all")`, `# print(L_eff)`
  uncommented. Init fig + CSV added
  (`okf/examples/homogenization.md`).
- 2026-10-07 (homogenization wave 3/4) —
  `homogenization/non_periodic_homogenization.py` PASSES on fedoo 1.0.1
  (headless, **conda env `fedoo_nph`**): spinodoid microstructure
  (`spinodoid_pd.vtk` via pyvista), `get_homogenized_stiffness(assemb,
  meshperio=False, dic_closest_points_on_boundaries=dic)`; L_eff diag
  Lxx=**23590.81**, Lyy=25320.07, Lzz=31501.02 (anisotropic spindle),
  shear L44=8850.47, L55=10000.33, L66=10142.95. KEY FIX: microgen≥1.2.1
  renamed BoxMesh boundary keys — script adds `_key_map` remap (33 keys)
  to match fedoo 1.0.1 `x-`/`x+` convention. **ENV CONSTRAINT**: base
  env cannot import microgen (OCP 7.x no cp313 wheels) — must use
  `C:\Users\connessn\anaconda3\envs\fedoo_nph\python.exe`. Init fig +
  CSV added (`okf/examples/homogenization.md`).
- 2026-10-07 (homogenization wave 4/4) —
  `PeriodicBoundaryConditions/2D_Periodic_BC_in_composite_ply.py` PASSES
  on fedoo 1.0.1 (headless): composite ply (3D box_mesh hex8 34×34×14,
  two elliptical fiber bundles warp+weft), `PeriodicBC(periodicity_type=
  "small_strain", dim=2)`, MeanStrain [0.1,0,0]; mean stress
  **[2406.2, 215.2, ~0] MPa**, Elastic Energy **36.094**. Fix (`# OLD:`):
  `res_fibers.plot("Stress","XX")` → `show=False, screenshot=...`
  (headless). Init fig added (`okf/examples/periodic-bc-2d.md`).

- 2026-10-07 (heterogeneous/user_equation wave 1/4) —
  `heterogeneous/heterogeneous_struct_nl.py` PASSES on fedoo 1.0.1 (headless,
  **199 s**): 2041n/2000 quad4 (hole+disk), EPICP matrix + elastic inclusion,
  `StressEquilibrium(nlgeom=True)`; max vm **1124.13**, max|ux| **20.0**
  (BC). Methods 1 & 3 agree (~1e-9); **method 2 is a DEAD PATH** (no branch
  in the script → `NameError: name 'assembly' is not defined`) — open
  question. Init fig added (`okf/examples/heterogeneous.md`).
- 2026-10-07 (heterogeneous/user_equation wave 2/4) —
  `user_equation/fluid_mechanics.py` PASSES on fedoo 1.0.1 (headless,
  **6 s**): 2D steady Stokes (P1+/P1 bubble), flow around cylinder R=20,
  mu=10, inlet Vx=1, 4920 nodes; max|V| **2.1958**, P range
  **[-1.268, 4.171]**. No fix beyond the headless patch (init fig +
  `res.save` fdh5). Open question (cosmetic): streamline seed `pointb`
  y≈100 outside the mesh (y_max=50); 13 streamlines still generated
  (`okf/examples/user-equations.md`).
- 2026-10-07 (heterogeneous/user_equation wave 3/4) —
  `user_equation/navier_stokes.py` PASSES on fedoo 1.0.1 (headless,
  **~8.5 s**): 2D Navier-Stokes (P1+/P1), flow around cylinder R=10,
  Re=2000, 1678+3082 bubble nodes; max speed **1.617**, P range
  **[-4.031, 15.666]**. Fixes: `pl.mesh`→`res.meshplot` (pyvista 0.49 has
  no `Plotter.mesh` class attr; `pl.meshes[0]` is an inspection copy —
  mutation not kept) + `max_time`→`max_length` (DeprecationError in 0.49).
  Note: dt-adaptation slightly non-deterministic (106 vs 100 steps).
  Init fig added (`okf/examples/navier-stokes.md`,
  `okf/documentation/post-processing.md`).
- 2026-10-07 (heterogeneous/user_equation wave 4/4) —
  `user_equation/recirculating_flow.py` PASSES on fedoo 1.0.1 (headless,
  **5 s**): 2D lid-driven cavity (user Stokes-like weak form, mu=0.1),
  121+200 bubble nodes / 200 tri3; max|V| physical **1.0**, V(0.5,1) =
  **[1,0]**, P(0.5,0.5) **−0.9332**, P range [-8.551, 7.518]. No fix beyond
  the headless patch (init fig added) (`okf/examples/navier-stokes.md`).
- 2026-10-07 (slider/adaptive/heterogeneous/FE2 wave 1/6) —
  `slider/slider_cantilever_beam.py` PASSES on fedoo 1.0.1 (headless,
  **4.5 s**): 231n/200 quad4 beam, `2Dstress` E=1e5; tip DispY **−18.304**
  (analytic −20.0), max vm **2817.46**; `elm_type` switch (tri3/tri6/quad9)
  works. Fix: interactive VTK slider → single off-screen frame. Init fig
  added (`okf/examples/slider-examples.md`).
- 2026-10-07 (slider/adaptive/heterogeneous/FE2 wave 2/6) —
  `slider/slider_ellipse.py` PASSES on fedoo 1.0.1 (headless, **4.8 s**):
  3360n quad4 plate with elliptical hole (a=30, b=10); vm_max
  **4603.218**, max|uy| **1.0**. **Config bug fix**: slider initial values
  value=5→30/10 (widgets fire during `pl.show`, overwriting `start_mesh`
  with a (5,5) circle instead of the (30,10) ellipse). Fix: interactive
  slider → off-screen frame. **Note**: pyvista ≥0.50 will break positional
  `add_text("...", (x, y), ...)` calls (deprecated in 0.49). Init fig added
  (`okf/examples/slider-examples.md`,
  `okf/documentation/post-processing.md`).
- 2026-10-07 (slider/adaptive/heterogeneous/FE2 wave 3/6) —
  `adaptive/hessian_recovery.py` PASSES on fedoo 1.0.1 (headless,
  **4 s**): 2601n tri3 51×51, nodal Hessian recovery of
  f=sin(2πx)sin(2πy); max|H_xx−exact| **6.866e-2**, max|H_xy−exact|
  **9.715e-4** (unchanged); no solve. No fix beyond the added init figure
  (`okf/examples/adaptive.md`).
- 2026-10-07 (slider/adaptive/heterogeneous/FE2 wave 4/6) —
  `adaptive/plot_hessian_recovery.py` PASSES on fedoo 1.0.1 (headless,
  **6.1 s**): companion plot script (reads `hessian_recovery.vtk`, rebuilds
  the fedoo `Mesh` from the pyvista `.vtk`); same numbers. No fix beyond
  the added init figure (`okf/examples/adaptive.md`).
- 2026-10-07 (slider/adaptive/heterogeneous/FE2 wave 5/6) —
  `heterogeneous/heterogeneous_struct.py` PASSES on fedoo 1.0.1 (headless,
  **4.5 s**): 2041n/2000 quad4 (hole+disk); `method` 1/2/3 switch — all
  agree, vm **6626.21**; max|ux| **20.0** (BC), max vm **6626.21**. Note:
  doc comment "ux=0.1mm" is stale (applied value is 20). No fix beyond the
  added init figure (`okf/examples/heterogeneous.md`).
- 2026-10-07 (slider/adaptive/heterogeneous/FE2 wave 6/6) —
  `FE2/FE2.py` PASSES on fedoo 1.0.1 (headless, **2 h 14 min** — VERY SLOW:
  32 micro EPICP problems per macro NR iter, inherent cost + large
  per-iteration `micro_cell.fdh5` writes): FE2 micro–macro homogenization,
  octet-lattice RVE; ux max **0.1** (BC), vm_max **104.68 MPa**, effective
  modulus ≪ solid E; `test_fe2.py` passes (**7.13 s**). Fixes:
  `res.plot` component `"ux"`→`"X"` (**"ux" is not a valid component — must
  be "X"/"Y"/"Z" or 0/1/2**) + `scale=0` (deformed-shape update fails on
  2D meshes: 3-component `Disp` vs 2D nodes ValueError). Note: "plane
  stress" comment is wrong — `2Dplane` is plane strain. Init fig added
  (`okf/examples/FE2.md`, `okf/documentation/post-processing.md`).

- 2026-10-07 (poromechanics wave 1/2) — `poromechanics/terzaghi_1d.py`
  PASSES on fedoo 1.0.1 (headless, **6.4 s**): 189n hex8 column
  0.1×0.1×1.0 m, `PoroMechanics`; p_bottom **476.075 Pa** → **212.098**
  @0.5 s → **122.645** @1.0 s → **6.88e-11 Pa** @29.5 s (drained),
  uz_top −1e-4 constant; no `.fdh5` (CSVs are the artifact). No fix
  beyond the added init figure
  (`okf/examples/poromechanics.md`).
- 2026-10-07 (poromechanics wave 2/2) — `poromechanics/taylor_hood_lbb.py`
  PASSES on fedoo 1.0.1 (headless, **5 s**): Part A 2D quad8 — TH Q2-Q1
  p **±0.00757309** vs equal-order Q2-Q2 **±0.0137091** (**1.81×**
  checkerboard pollution); Part B 3D hex20 undrained Biot — p mean
  **10000 Pa** = analytic **−α·M·dz/L**, converged in 1 iteration; no
  `.fdh5` (CSVs). No fix beyond the 2 added init figures
  (`okf/examples/poromechanics.md`).
- 2026-10-07 (plasticity wave 1/4) — `plasticity/2DplasticBending.py`
  PASSES on fedoo 1.0.1 (headless, **15 s**): 2D plate bending EPICP;
  step 1 vm_max **1121.06 MPa**, final **1144.60 MPa**, springback
  **0.219 mm**. Fixes: `set_nr_criterion` Force→**Displacement** (Force
  criterion normalizes the residual by ‖F_ext‖; force-relaxation-to-zero
  stalls at dt-independent normalized error **0.76755** → dt_min;
  Displacement converges, final state **2.2e-4 mm** from exact zero-load
  equilibrium) + `"Constitu1tiveLaw"`→`"ConstitutiveLaw"` typo (in doc
  source) breaking mat=0. Switches: typeBending 4 nodes (vm 1351.73),
  mat=0 linear (Uy→−0.0471). Init fig added
  (`okf/examples/plastic-bending.md`, `okf/concepts/nonlinear-nr-criterion.md`).
- 2026-10-07 (plasticity wave 2/4) — `plasticity/rotation_test.py` PASSES
  on fedoo 1.0.1 (headless, **66 s**): 3D cube rigid rotation 90°;
  max|Disp| **1.0 mm**, max vm **2.57e-10 MPa** (rigid, zero strain).
  Fixes: `set_nr_criterion` **Displacement** (default Force fails — purely
  kinematically driven, ‖F_ext‖ ≈ **1.36e-11**, error stuck ~0.68–1.1);
  `fd.viewer`→`res.plot` (**fd.viewer raises ImportError in 1.0.1** —
  pyvistaqt not installed). Init fig added
  (`okf/examples/plasticity-tests.md`,
  `okf/documentation/post-processing.md`).
- 2026-10-07 (plasticity wave 3/4) — `plasticity/shear_test.py` PASSES on
  fedoo 1.0.1 (headless, **101 s**): 1331n hex8 simple shear (DispX=1 on
  y=1 face); vm_max **1295.31 MPa** (GP), EP max **1.40056**, Ux(y=1)
  **1.0**; mat switch 0/1/2/3 — mat=2 `ElastoPlasticity` cross-validates
  at vm **1295.309**. No fix beyond the added init figure
  (`okf/examples/plasticity-tests.md`).
- 2026-10-07 (plasticity wave 4/4) — `plasticity/torsion_test.py` PASSES on
  fedoo 1.0.1 (headless, **50 s** mat=0): 1331n hex8, 180° torsion about X
  (`RigidRotX=π`); mat=0 vm_max **286892.93 MPa**; mat=1 EPICP & mat=2
  `ElastoPlasticity` vm_max **1339.8 MPa** (agree). Fix: `show=True`→
  `screenshot=` (write_movie already off-screen in 1.0.1). **API fact**:
  `material.corate` is a **no-op** — `corate` is a weakform attribute
  (`StressEquilibrium.corate`). Init fig added
  (`okf/examples/plasticity-tests.md`,
  `okf/concepts/stress-equilibrium-nlgeom.md`).
- 2026-10-07 (slider wave 1/1) — `slider/slider.py` PASSES on fedoo 1.0.1
  (headless, **4 s**): 880n quad4 plate with hole, strain-driven
  (E_xx/E_yy/E_xy); ε_xx=0.05 → vm_max **11091.17 MPa**, Kt≈**2.02**.
  Fix: interactive VTK slider (`pl.show`) → single off-screen frame
  (`pl.show(screenshot=...)`). Note: "center" anchor is a node on the hole
  rim (displacement field asymmetric, stresses unaffected — works as
  designed). Init fig added (`okf/examples/slider-examples.md`).
- 2026-10-07 (thermal wave 1/1) — `thermal/thermal_condution_2D.py` PASSES
  on fedoo 1.0.1 (headless, **6 s**): 441n quad4 [0,1]², `HeatEquation`,
  K=18 c=0.5 rho=7800, BackwardEuler 10 steps dt=20; t=200: min T **50**,
  max T **100**, mean **68.577** (transient not settled). Fix:
  `USE_PYVISTA_QT=False` + init fig + `res.plot(screenshot=...)`. Init
  fig added (`okf/examples/thermal.md`).
- 2026-10-07 (03-advanced wave 1/9) — `03-advanced/3D_periodic_BC_off_axis.py`
  PASSES on fedoo 1.0.1 (headless, **10.4 s**): gyroid_per.vtk, `PeriodicBC(
  "small_strain")` off-axis π/4 about z, `E_11 = 1`; local **σ_11 =
  1.351e4**, global **σ_xx = σ_yy = σ_xy = 6.756e3** (= σ_11/2, exact π/4
  rotation); no `.fdh5`. No fix beyond the added init figure
  (`okf/examples/periodic-bc-3d.md`).
- 2026-10-07 (03-advanced wave 2/9) — `03-advanced/composite_DCB_test_3D.py`
  PASSES on fedoo 1.0.1 (headless, **7.9 s**): 570n / 288 hex8 + 60
  quad4interface cohesive, 3D DCB mode-I DispZ = 10 mm; max_damage **1.0**,
  **112/120** GP damaged/failed, max opening **5.5898 mm**; no `.fdh5`
  (run.log is the artifact). No fix beyond the added init figure
  (`okf/examples/composite-dcb-3d.md`).
- 2026-10-07 (03-advanced wave 3/9) — `03-advanced/incompressibility_comparison.py`
  PASSES on fedoo 1.0.1 (headless, **11 s**): Cook's membrane 289n / 256
  quad, ν = 0.499; tip DispY **0.87896 / 2.00988 / 2.01025 / 1.81188**
  (full / mean-dilatation / f-bar / reduced) — full integration is
  pressure-locked (low tip, low P), the other three agree. No fix beyond
  the added init figure (`okf/examples/incompressibility-comparison.md`).
- 2026-10-07 (03-advanced wave 4/9) — `03-advanced/multi_mesh_example.py`
  PASSES on fedoo 1.0.1 (headless, **5 s**): MultiMesh 5n (1 quad4 + 1
  tri3), 2Dstress, DispX = 0.5; max vm **102077.21**, max |Voigt|
  **109890.11** (σx). **API fact**: `fd.DataSet` accepts a `MultiMesh`
  directly. No fix beyond the added init figure
  (`okf/examples/multi-mesh.md`).
- 2026-10-07 (03-advanced wave 5/9) — `03-advanced/neohookean_cantilever.py`
  PASSES on fedoo 1.0.1 (headless, linear **44.5 s** / quadratic **272.5
  s**): NeoHookean E = 60 MPa ν = 0.49, RigidDispX = 0.03; linear max
  |disp| **3.2793e-2 m**, max vm **5.2277e6 Pa**; quadratic max vm
  **7.4685e6 Pa** (RI vs full-integration diff at the base). Mesh counts
  corrected from the INP files: **3,213** nodes / 2,480 hex8 (lin),
  **12,045** / 4,960 hex20 (quad) (wave report said 3,217 / 12,049 — off
  by 4; earlier concept figures 5,941 / 17,253 were miscounts). No fix
  beyond the added init figures (`okf/examples/neohookean-cantilever.md`).
- 2026-10-07 (03-advanced wave 6/9) —
  `03-advanced/neohookean_cantilever_force.py` PASSES on fedoo 1.0.1
  (headless, **234.3 s**): force-driven F = 20 N, implicit Newmark; cap ux
  **45.60 mm (0.912 L)**, rotY **89.2°**, max vm **17.82 MPa**; cross-check
  displacement-driven 45.5 mm (~0.2 % diff). No fix beyond the added init
  figure (`okf/examples/neohookean-cantilever-force.md`).
- 2026-10-07 (03-advanced wave 7/9) — `03-advanced/thermal_loading.py`
  PASSES on fedoo 1.0.1 (headless, **12 s**): 2041n hole+disk merged, EPICP
  inclusion, thermo-mechanical; final vm max **1355.99**, |Disp| max
  **0.334483** (ux = uy symmetric), peak Temp **400 at t = 1.0**.
  **API fact**: `pb.bc.add(time_func=...)` receives a DIMENSIONLESS time
  factor 0→1 over the run (not absolute time). No fix beyond the added
  init figure (`okf/examples/heterogeneous.md`).
- 2026-10-07 (03-advanced wave 8/9) — `03-advanced/tube_compression.py`
  PASSES on fedoo 1.0.1 (headless, **143 s**): 1200n 2Daxi (r ∈ [23, 25],
  y ∈ [0, 180]), EPICP, SelfContact, nlgeom UL; max vm (GP) **1569.908 MPa**
  (node 2037.867), max P (GP) **1.59834**, top uy **−150.0** (ux = 0), max
  |Voigt| **85521.98** (node YY corner). No fix beyond the added init
  figure (`okf/examples/tube-compression.md`).
- 2026-10-07 (03-advanced wave 9/9) — `03-advanced/rigid_body_bounce.py`
  PASSES on fedoo 1.0.1 (headless, **11.8 s**): rigid sphere (r = 0.1,
  m = 1.0, I = 2/5 mr², CoM z = 0.4) on fixed plane, IPC (dhat = 0.01,
  kappa = 1e8), Newmark 2nd-order, dt = 2e-3; RigidDisp z min
  **−0.27323 m** (frame 16), end **−0.13762 m**, no floor penetration.
  **API notes**: `fd.Mesh.stack(mesh1, mesh2)` positional; `RigidBodyAssembly`
  is not a `Mesh`; `MultiFrameDataSet.get_history(field, ...)` 2nd positional
  arg is `indices`. No fix beyond the added init figure
  (`okf/examples/rigid-body-bounce.md`).
- 2026-10-07 (02-constraints wave 1/5) — `02-constraints/disk_rectangle_contact.py`
  PASSES on fedoo 1.0.1 (headless, **14 s**): 552n 2D IPC contact
  (`IPCContact` `dhat=0.005`, `use_ccd=True`), disk right-ring load
  `Disp=[-0.05, +0.025]` then unload; frame 9 (end of load) max vm
  **1626.2 MPa**, frame 19 (end of unload) max vm **641.2 MPa** (plastic
  residual, Re=300); one `Convergence Failed` in unload recovered by
  adaptive dt cut (not a failure). No fix beyond the added init figure
  `disk_rectangle_contact_init.png` (`okf/examples/disk-rectangle-contact.md`).
- 2026-10-07 (02-constraints wave 2/5) — `02-constraints/mean_rigid_motion_torsion.py`
  PASSES on fedoo 1.0.1 (headless, **25 s**): 1152n hex8 cube L=2, E=200 GPa,
  60° twist about X on right face, left clamped; `RigidTie` Mx **89425.65** vs
  `MeanMotion` Mx **87900.89**; max vm rigid **9.530e4 MPa**, mean
  **1.009e5 MPa** (mean face warps locally). No fix beyond the added init
  figure (`okf/examples/rigid-tie.md`).
- 2026-10-07 (02-constraints wave 3/5) — `02-constraints/Periodic_BC_2D_Plate_with_hole.py`
  PASSES on fedoo 1.0.1 (headless, **4.3 s**): 880n/800e hole plate,
  `PeriodicBC("small_strain")`, macro shear `Exy=0.1`; mean stress
  **[~0, ~0, 2497.668]**; effective shear `Sxy/(2Exy) ≈ 12488 MPa` vs solid
  `G = 38461.5 MPa` (hole reduces ~32.5 %); script saves no `.fdh5`. No fix
  beyond the added init figure (`okf/examples/periodic-bc-2d.md`).
- 2026-10-07 (02-constraints wave 4/5) — `02-constraints/pressurized_pipe.py`
  PASSES on fedoo 1.0.1 (headless, **4 s**): 200n/160e plane-strain annulus
  (r 180/200), internal 2 MPa / external 0.1 MPa, no Dirichlet BCs (free body
  → arbitrary rigid mode); `u_r` inner **1.541752e-2 mm** / outer
  **1.466617e-2 mm** (Lamé 1.6740e-2/1.6130e-2, FE 7.9–9.1 % low),
  `max|σ_xx| = max|σ_yy| = 18.1754 MPa` (Lamé 18.0). **Gotcha**:
  `Problem.save_results(iterOutput)` takes NO path — results go to outputs
  registered via `pb.add_output(filename, assembly, output_list, "Node")`.
  No fix beyond the added init figure (`okf/examples/pressurized-pipe.md`,
  `okf/documentation/post-processing.md`).
- 2026-10-07 (02-constraints wave 5/5) — `02-constraints/rigid_tie.py` PASSES
  on fedoo 1.0.1 (headless, **4.5 s**): 121n/100e unit square, `RigidTie2D(top)`,
  bottom clamped, `RigidRotZ=-pi/4`, nlgeom; top face = exact rigid −π/4
  rotation + translation; max vm (Gauss) **88779.4 MPa**, max nodal vm
  **97299.8 MPa**; NLGEOM=False scratch max vm **124559.4 MPa**. No fix
  beyond the added init figure (`okf/examples/rigid-tie.md`).
- 2026-10-06 (01-simple wave 1/12) — `01-simple/I_shape_beam_bending.py`
  PASSES on fedoo 1.0.1 (headless, **4.3 s**): 440n/380e wed6; max |uy| 10.0228,
  max |ux| **2.7718**, max |Voigt| 10881.15 MPa, fedoo vm **11132.31 MPa**
  (`fedoo.util.voigt_tensors.StressTensorList(S).von_mises()`); no fix, init
  figure `I_shape_beam_bending_init.png` added (pre-solve
  `fd.DataSet(mesh).plot(screenshot=...)`, off-screen) (`okf/examples/i-shape-beam.md`).
- 2026-10-06 (01-simple wave 2/12) — `01-simple/lattice_beam.py` PASSES on
  fedoo 1.0.1 (headless, **8 s**): 216n/540e beam (BeamCircular r=1 k=0.9,
  nlgeom), max |uy| 50.0, max |BeamStress| component **6789.2493 (Mz)**; no
  fix, init fig added. **Gotcha**: `BeamStress` is a 6-component [N,T,T,M,M,M]
  internal-force vector — fedoo `von_mises()` (stress-tensor formula) raises
  `IndexError` on it; max |component| is the correct reduction
  (`okf/examples/lattice-beam.md`, `okf/concepts/beam-weakform.md`).
- 2026-10-06 (01-simple wave 3/12) — `01-simple/linear_buckling.py` PASSES on
  fedoo 1.0.1 (headless, **4.3 s**): 21n/20e lin2; critical load factors
  **[259125.78, 1021031.97, 2242455.08] N** (Euler 260452.72, 0.51 % off);
  mode 1 purely transverse (max |uy| 8.84e-4, max |ux| 0); no fix, init fig
  added (`okf/examples/linear-buckling.md`).
- 2026-10-06 (01-simple wave 4/12) — `01-simple/modal_analysis.py` PASSES on
  fedoo 1.0.1 (headless, **4.4 s**): 15x15 quad4 plate L=1 t=0.01 steel;
  freqs **[91.0410, 189.6186, 189.6186, 279.7344] Hz** (modes 2–3 degenerate)
  — unchanged; no fix, init fig added (`okf/examples/modal-analysis.md`).
- 2026-10-06 (01-simple wave 5/12) — `01-simple/Plate_with_hole_in_tension.py`
  PASSES on fedoo 1.0.1 (headless, **4 s**): 880n/800e quad4 2Dstress; max |U|
  **0.50691 mm**, max |σxx| 4692.07 MPa (Kt≈2.35), fedoo `get_data("Stress",
  "vm")` max **4797.61 MPa** (vs 4505.35 nodal-plot vm of the 2026-10-05 run);
  no fix, init fig added (`okf/examples/plate-with-hole.md`).
- 2026-10-06 (01-simple wave 6/12) — `01-simple/poison_eq.py` PASSES on fedoo
  1.0.1 (headless, **4 s**): 121n quad4 2D unit square, scalar U; U(center)
  **0.5** (analytic U = X); API fact: scalar field from `get_results` is **1-D
  (N,)**, not component-major; no fix, init fig added
  (`okf/examples/poisson-equation.md`).
- 2026-10-06 (01-simple wave 7/12) — `01-simple/simpleBeamElementExample.py`
  PASSES (computeShear=1, headless, **5 s**): 11n/10e lin2, RY=2.0, MZ=20.0,
  tip **−0.00869517**; computeShear=0 (bernoulliBeam) PASS (tip −0.00848826 vs
  analytic −0.008488263631567752); computeShear=2 (beamFCQ) **FAILS**:
  `AttributeError: module 'fedoo.weakform' has no attribute 'Beam'` (removed
  in 1.0.1); scratch: BeamEquilibrium+beamFCQ assembles but ~zero tip (wrong).
  OPEN QUESTION: intended 1.0.1 recipe for computeShear=2. No fix, init fig
  added (`okf/examples/beam-elements.md`).
- 2026-10-06 (01-simple wave 8/12) —
  `01-simple/simple_cantilever_beam_3D_model_nlgeom.py` PASSES on fedoo 1.0.1
  (headless, **7.9 s**): 1519n/1080e hex8, nlgeom; max |U| **500 mm**, Sxx
  +18663.64/−21925.02 MPa, max vm **13054.58 MPa** (fedoo
  `get_data("Stress","vm","Element")`); no fix, init fig added
  (`okf/examples/cantilever-3d.md`).
- 2026-10-06 (01-simple wave 9/12) — `01-simple/simple_mesh_generation.py`
  PASSES on fedoo 1.0.1 (headless, **5 s**): mesh gen only (no solve); plate
  336n/288e, annulus 160n/128e, cylinder 4038n/3200e — unchanged; init fig =
  the generated helicoidal I-beam; no fix (`okf/examples/simple-mesh-generation.md`).
- 2026-10-06 (01-simple wave 10/12) —
  `01-simple/spherical_shell_compression.py` PASSES on fedoo 1.0.1 (headless,
  **5 s**): 842n/1680e, t=0.45 mm E=2000 p=10 MPa; max |DispZ| **5.364102 mm**,
  max vm **284.206 MPa**; API note: `pb.add_output(filename, output_list)` —
  2nd arg is `output_list`, not the assembly (1.0.1, source
  `fedoo/core/problem.py`); no fix, init fig added
  (`okf/examples/spherical-shell.md`).
- 2026-10-06 (01-simple wave 11/12) — `01-simple/visualization.py` PASSES on
  fedoo 1.0.1 (headless, **21.7 s**): 1331n hex8 cube, EPICP, 20 frames; max
  vm **1055.124 MPa** (t=1.0), max |ux| 0.5 — unchanged; API note: `fd.read_data('*.fdz')`
  → `MultiFrameDataSet`, `get_data` needs `res.load(frame_index)` first; no
  fix, init fig added (`okf/examples/visualization.md`).
- 2026-10-06 (01-simple wave 12/12) —
  `01-simple/simple_cantilever_beam_3D_model.py` PASS — already re-verified and
  committed in the prior round (2026-10-06T18:47Z): 2499n/1800e hex8, max |U|
  50.1394, Stress XX ±1982.41 MPa, vm 1430.10 MPa; init fig + report present.
  No change this wave (`okf/examples/cantilever-3d.md`).

- 2026-10-06 — `01-simple/simple_cantilever_beam_3D_model.py` re-verified
  headless on fedoo 1.0.1 (**~5 s**): 2499-node hex8 box, clamped x=0 face,
  imposed `DispY=-50` at x=1000 (uy↔y consistent); max |U| 50.139, Stress XX
  ±1982.41 MPa, max |Voigt| 1982.41, fedoo vm 1430.10 MPa (re-read from kept
  `results/simple_cantilever_beam_3D_model.fdh5`); new
  `simple_cantilever_beam_3D_model_init.png` (pre-solve
  `fd.DataSet(mesh).plot(screenshot=...)`); commented `set_solver('cg')`
  path exercised in scratch (runs, ±1982.77).
- 2026-10-06 (round 48) — `contact/self_contact.py` (root penalty variant,
  LAST of the 24 contact examples) PASSES on fedoo 1.0.1 (headless, **548 s**;
  1474 increments, 100 frames, 3 dt-bisected recoveries, final Err 0.00005):
  2D hole plate (1680 nodes / 1568 quad4, r 45) crushed to top [0,−70],
  penalty `SelfContact(surf, "linear", search_algorithm="bucket")` /
  `eps_n=1e6` / `contact_search_once`, EPICP `mat=1` default, `nlgeom="UL"`,
  `max_subiter=5` converged as-is. Key numbers (re-read from kept
  `results/self_contact.fdh5`, fedoo `von_mises`): top node 25 U = [−0.0114,
  **−70.0014**], max |Ux| 32.35, max vm **1533.23 MPa (GP)** (identical to
  comparison-penalty 1533.23; penalty sibling 1533.96), max |Voigt| **24070.86
  MPa (YY, GP)** — vm 6.37 % of it (near-hydrostatic spike XX≈YY≈ZZ≈−23…−24k),
  max vm (Node) 1636.32 (corner node 0 extrapolation artifact — use GP),
  Σ Fext ≈ 0. Fixes (`# OLD:` ×2): `results.plot(..., show=True, ...)` →
  `show=False, screenshot=...self_contact_fig.png` + `mat==2` branch
  `SetHardeningFunction("power", H=k, beta=m)` → `set_hardening_function(
  "power", h=k, beta=m)` — **1.0.1 API**: snake_case method, "power" law
  `R(p) = h·p^beta` needs lowercase `h` + `beta` (source
  `elasto_plasticity.py`); mat 0/2/3 import-checked (no solve — would
  overwrite the kept EPICP `.fdh5`). Movie `results/self_contact.mp4` (4.3 MB)
  writes once `imageio-ffmpeg` is installed. Figures `self_contact_fig.png`;
  scratch kept `self_contact_scratch_read.py` +
  `self_contact_scratch_matbranches.py` (`okf/examples/self-contact.md`).

- 2026-10-06 (round 47) — `contact/disk_rectangle_contact.py` (root penalty
  variant, NOT 02-constraints/comparison) PASSES on fedoo 1.0.1 (headless,
  **65.6 s**; 232 increments, 200 frames): 2D penalty disk-rectangle contact
  (552 nodes / 500 quad4, disk r 0.5 at `[1.5, 0.48]` exactly touching the
  rectangle — fine for penalty, the exact-touch stall is IPC-only),
  `Contact(nodes_right, surf)` `eps_n=5e5` `contact_search_once`, EPICP rect
  + ElasticIsotrop(50e3) disk, push `[-0.4, 0.2]` then release. Fixes
  (`# OLD:` ×4, line search additive): `max_subiter=5` → `15` (with 5, NR
  stalls at t≈0.12, Err 0.005–0.007) + **`pb.add_line_search(mode="natural")`**
  (with 15 alone it still diverges at t≈0.68, Err 0.59→inf; the natural
  mode's Armijo-on-|R| throttles penalty overshoot) + 3× `show=True` plots
  → `screenshot=`. **Env fix**: `write_movie` crashed with
  `TiffWriter.write() got an unexpected keyword argument 'fps'` —
  **imageio-ffmpeg was not installed** (imageio fell back to the tiff
  plugin); after `pip install imageio-ffmpeg` the movie writes
  (`results/disk_rectangle_contact.mp4`, 913 KB). Key numbers (re-read from
  kept `results/disk_rectangle_contact.fdh5`, fedoo `get_data("Stress",
  "vm", ...)`): end of push max vm **2806.46 MPa (Node)** / **2671.21 (GP)**
  (disk), max |Voigt| **28697.45 (GP)** — vm 9.31 % of max |Voigt|
  (near-hydrostatic contact spike), disk min X **0.6225** (penetration
  0.3775), clamp reaction **[1410.23, 124.10] N** = peak contact force
  (Fext ≈ 0 on the 21 contact nodes — the penalty force lives in the tangent
  matrix, not the force vector); released: net Fext 0 (21 clamp nodes carry up
  to 510.5 N that cancel), disk back at min X 1.0, residual rect Ux **−0.3704**, max vm **1306.59 (Node)** /
  **1401.06 (GP)**. Figures `disk_rectangle_contact_fig.png` / `_fig2.png`
  / `_fig3.png`; scratch `disk_rectangle_contact_scratch_read.py`
  (`okf/examples/disk-rectangle-contact.md`).

- 2026-10-06 (round 46) — `contact/comparison/self_contact.py` PASSES on
  fedoo 1.0.1 + ipctk 1.6.0 (headless, ~1925 s: penalty **554.05 s** / 1474
  increments + IPC **1365.29 s** / 3196 increments): same hole plate
  (1680 nodes / 1568 quad4, r 45) crushed to top [0,−70], penalty
  `SelfContact` `bucket`/`eps_n=1e6`/`contact_search_once` vs IPC
  `IPCSelfContact(dhat=5e-3 rel, use_ccd=True)` (solid mesh auto-extracts
  its surface — no OGC branch involved); both top Uy −70.0000, max vm
  **1533.23** / **1550.32 MPa** (fedoo `von_mises`, Gauss, re-read from kept
  `results/self_contact_{penalty,ipc}.fdh5`); figures
  `self_contact_fig.png` / `_fig2.png` (headless `screenshot=` fix, `# OLD:`
  kept).
- 2026-10-06 (round 45) — `contact/comparison/ring_crush.py` PASSES on
  fedoo 1.0.1 + ipctk 1.6.0 (headless, penalty **179.73 s** / 454 increments
  + IPC **46.15 s** / 100 increments): hole plate (1680 nodes / 1568 quad4,
  r 45) crushed 40% (top [0,−40]), penalty `SelfContact` `bucket`/
  `eps_n=1e6`/`max_dist=1.5` vs IPC `IPCSelfContact(dhat=5e-3 rel,
  use_ccd=True)`. Fix (`# OLD:`): IPC `set_nr_criterion("Displacement",
  tol=5e-3, max_subiter=5)` → `max_subiter=15` (with 5, NR capped at
  Err 0.003–0.015 at t=0.82 → dt bisection to `dt_min` RuntimeError;
  sibling `contact/ipc/self_contact.py` uses 15) + headless `screenshot=`
  replacing the commented-out trailing `res.plot` lines. Key numbers
  (re-read from kept `results/*.fdh5`, final frame, GP; independent h5py
  re-read agrees): penalty final Fy **−16993.9**, IPC **−17366.1** (min
  gap **1.03e-03**, final kappa **2.05e+03**, 24 collisions, onset t=0.73);
  max |Voigt| **24643.5** (S_ZZ) / **20528.0** (S_XX) vs max vm **1221.91** /
  **1504.96 MPa** — vm only 5.0 % / 7.3 % of max |Voigt| (near-hydrostatic
  contact spike S_XX≈S_YY≈S_ZZ≈−21…−25k). Figures `ring_crush_fig.png` /
  `_fig2.png` + `results/ring_crush_comparison.png`; scratch kept as
  `ring_crush_scratch_read.py` + `ring_crush_scratch_reread_h5.py`
  (`okf/examples/ring-crush.md`).

- 2026-10-06 (round 44) — `contact/comparison/gyroid_selfcontact.py` FAILS
  on fedoo 1.0.1 (headless, **~473 s** to `dt_min` abort): density-0.3
  gyroid (`gyroid_per.vtk`, 23879 nodes / 84151 tet4 — docstring's "30k /
  114k" is stale) under 15% compression, penalty `SelfContact` (opt-in
  `--penalty`) vs IPC `IPCSelfContact(dhat=5e-3 rel, use_ccd=True)`. IPC
  path: **no increment converges** (NR Err 18.5 → 0.0098 → 0.178 as dt
  bisects to 1e-6); penalty probe (tmax=0.02): `Err: inf` at NR iter 1, ~47
  s to `dt_min`. Root cause re-verified by rest-state probe: **25671 IPC
  collision pairs, min signed distance 1.58e-12** (self-touching at rest;
  1.0.1 has no `al_max_iter` AL loop) — same failure as
  `contact/ipc/gyroid_compression*` (rounds 31-33). No fix applied (all
  APIs valid; failure is a mesh property), no figure, no `.fdh5`.
  Scratch probes kept: `gyroid_selfcontact_scratch_rest_state.py`,
  `gyroid_selfcontact_scratch_penalty.py`
  (`okf/examples/gyroid-selfcontact.md`).

- 2026-10-06 (round 43) — `contact/comparison/disk_rectangle.py` PASSES on
  fedoo 1.0.1 + ipctk 1.6.0 (headless, **~18 s**; penalty 2.37 s / IPC
  10.05 s): 2D stiff-disk (E 50e3) pushed into elastic rectangle (E 200e3),
  552 nodes / 500 quad4, disk `Disp = [-0.05, 0.025]` over `tmax=1`,
  penalty `Contact(eps_n=5e5)` vs IPC `IPCContact(dhat=1e-3 rel,
  use_ccd=True)`. **Durable gotcha**: an exactly-touching start (disk at
  `[1.5, 0.48]`) is unsolvable with CCD — ipctk `toi=0` ("Initial distance
  0 ≤ d_min=0"), line search `alpha=0`, NR stalls at `Err: 1.00000` until
  the `dt_min` RuntimeError. Fix (`# OLD:` ×3): `build_mesh_and_material(gap=0.0)`
  + `mesh_disk.nodes += np.array([1.5 + gap, 0.48])` + IPC branch
  `build_mesh_and_material(gap=0.01)` (matches canonical
  `02-constraints/disk_rectangle_contact.py` "small gap for IPC barrier
  method"; penalty branch keeps exact contact). Key numbers (re-read from
  kept `results/*.fdh5`): penalty 20 increments, final Fx **1313.8**, max
  |disp_x| **0.011065**, max |Stress component| **6968.4** (vm 4621.1); IPC 71 increments (dt
  bisected to 0.0125), final Fx **1068.9**, max |disp_x| **0.009632**, max
  |Stress component| **6405.1** (vm 3836.0), min gap **1.53e-10**, final kappa **4.92e+09**, 7
  collisions (Fx from `run.log` — Fext not stored in the `.fdh5`). Figures
  `disk_rectangle_fig.png` / `_fig2.png` (headless `DataSet.plot` von Mises,
  previously commented-out lines) + `results/penalty_vs_ipc_comparison.png`.
  Gotcha: `pb.n_iter` is the increment counter, so the table's "Total NR
  iterations" row = increment count (`okf/examples/disk-rectangle-comparison.md`).

- 2026-10-06 (round 41) — `contact/comparison/ccd_vs_ogc.py` PASSES on fedoo
  1.0.1 (headless, **~14 s**; 20 increments per run, Displacement tol 5e-3,
  per-increment Err 1.9e-4–4.2e-3): 2D disk indentation (5379 nodes / 10457
  elt: gmsh plate 1146/2177 quad4 + tri3 disk 4233/8280, E 1e3/1e5, R 5,
  gap 0.1, top −2.0) run twice for CCD-vs-OGC comparison. Fix (`# OLD:`):
  `use_ccd=(method == "ccd"), use_ogc=(method == "ogc")` → `use_ccd=True,
  use_ogc=False` (1.0.1 hard-rejects OGC on solid meshes —
  `ipc_contact.py:1033`), so the OGC branch runs as CCD and the comparison
  is CCD-vs-CCD on this version. Key numbers (re-read from kept `run.log`
  summary — no `.fdh5` written by the script): total NR **61** per run,
  mean **3.05**, max **6**, solve **5.10 s / 4.75 s**, identical per-increment
  NR sequence `6,5,3,3,3,3,3,3,3,2,3,2,4,2,4,2,3,2,3,2`; F–δ curves overlap
  in `results/ccd_vs_ogc.png` (2 panels, vs 2D Hertz). Figure
  `ccd_vs_ogc_fig.png`; scratch kept as `ccd_vs_ogc_scratch_probe.py` +
  `ccd_vs_ogc_scratch_mesh.py`. OGC path remains unverifiable on 1.0.1
  (`okf/examples/ccd-vs-ogc-comparison.md`).

- 2026-10-06 (round 42) — `contact/comparison/ccd_vs_ogc_selfcontact.py`
  PASSES on fedoo 1.0.1 (headless, **~114 s**; 100 increments per run,
  Displacement tol 5e-3): 2D hole-plate self-contact (1680 nodes / 1568
  quad4, `dhat=3e-3` relative, EPICP, top [0,−70]) run twice for CCD-vs-OGC
  comparison. Fix (`# OLD:`): `use_ccd=(method == "ccd"),
  use_ogc=(method == "ogc")` → `use_ccd=True, use_ogc=False` (1.0.1
  hard-rejects OGC on solid meshes — `ipc_contact.py:1033`), so the OGC
  branch runs as CCD (CCD-vs-CCD on this version). Additive: `save_case_fig`
  helper saves headless pyvista Y-displacement figures. Key numbers (re-read
  from kept `run.log` — no `.fdh5` written by the script): CCD total NR
  **287** / mean **2.87** / max **6** / **52.16 s**; OGC-fallback total NR
  **285** / mean **2.85** / max **6** / **56.62 s**; NR sequences agree
  through increment 44 then drift slightly (run-to-run non-determinism,
  same CCD path). Figures `ccd_vs_ogc_selfcontact_fig.png` +
  `ccd_vs_ogc_selfcontact_fig2.png` + `results/ccd_vs_ogc_selfcontact.png`.
  OGC path remains unverifiable on 1.0.1
  (`okf/examples/ccd-vs-ogc-selfcontact.md`).

- 2026-10-06 (round 40) — `contact/ogc/punch_indentation.py` PASSES on fedoo
  1.0.1 (headless, **1271 s**; 242 increments at dt 0.00313, Force tol 5e-3,
  final Err 0.00335): same 3245-node / 16545-tet4 benchmark as the IPC twin
  (gmsh punch 1123 nodes / 4985 tet4 + plate 2122 / 11560, E 3e4/1e4, R 3,
  gap 0.05, top −2.0). Fixes (all `# OLD:`): `use_ogc=True` →
  `use_ogc=False` (1.0.1 hard-rejects OGC on solid meshes — guard at
  `ipc_contact.py:1033`) + `set_nr_criterion("Displacement",...)` →
  `("Force",...)` (Displacement criterion stalls at Err≈0.04 → `dt_min`
  RuntimeError; first run failed at 158 s) + `screenshot=punch_indentation_fig.png`
  on the final `res.plot`. Key numbers (re-read from kept
  `results/punch_ogc.fdh5`, 20 frames): final punch-top UZ **−2.0**, punch
  tip UZ **−1.2903 mm**, plate max indentation **−1.2478 mm**, bottom
  reaction **F = [−1016.57, 558.34, 71640.37] N** (68 bottom elts, 400 mm²),
  max vm **4560.61 MPa** (element 11576, in the punch; plate max 4350.33).
  **Identical to the IPC twin** — `use_ogc=False` ⇒ `use_ccd=True`, same CCD
  path. Figure `punch_indentation_fig.png`; scratch kept as
  `punch_indentation_scratch_read.py`. OGC path remains unverifiable on
  1.0.1 (`okf/examples/ogc-punch-indentation.md`).

- 2026-10-06 (round 39) — `contact/ogc/indentation_3d.py` PASSES on fedoo
  1.0.1 (headless, **~92 s**; 20 NR-converged steps, Displacement tol 5e-3,
  max Err 0.00497): same 6322-node / 32392-tet4 benchmark as the IPC sibling
  (gmsh sphere 2491 nodes + plate 3831 nodes, E 1e3/1e5, R 5, gap 0.1, top
  −2.0). Fix: `use_ogc=True` → `use_ogc=False` (CCD fallback; 1.0.1
  hard-rejects OGC on solid meshes — `IPCContact.initialize` guard at
  `ipc_contact.py:1033`, re-confirmed with a 27-node `box_mesh(3,3,3)`
  scratch) + `screenshot=indentation_3d_fig.png` on the final `res.plot`
  (both `# OLD:`). Key numbers (re-read from kept
  `results/indentation_3d.fdh5`, 20 frames): final top UZ **−2.0**, max
  plate UZ **−1.845242 mm**, max vm **18514.77 MPa** (GP 32384 → elem 8096,
  plate, centroid (4.85, −0.78, 20.98)), contact radius **~3.35 mm** (109
  plate-top nodes within 0.05 mm of deformed sphere) vs Hertz
  `a = sqrt(R·δ) = 3.08 mm`; Hertz F(δ=1.9) = **8495.5 N** (E* = 1088.02).
  FEM reaction not reported: callback history is in-memory only, not stored
  in the `.fdh5`. Figures `indentation_3d_fig.png` +
  `results/indentation_3d_hertz.png`. OGC path remains unverifiable on
  1.0.1 (`okf/examples/ogc-indentation-3d.md`).

- 2026-10-06 (round 38) — `contact/ogc/indentation_2d.py` PASSES on fedoo
  1.0.1 (headless, **9.3 s**; 20 NR-converged steps, Displacement tol 5e-3,
  max Err 0.00491): same 5379-node / 10457-tri3 benchmark as the IPC
  sibling (gmsh plate 1146 nodes + `disk_mesh` 4233 nodes, E 1e3/1e5, R 5,
  gap 0.1, top −2.0). Fix: `use_ogc=True` → `use_ogc=False` (CCD fallback;
  1.0.1 hard-rejects OGC on solid meshes — `IPCContact.initialize` guard,
  `use_ccd=None` auto-defaults to `not use_ogc`) + `screenshot=` on the
  final `res.plot` (both `# OLD:`). Key numbers (re-read from kept
  `results/indentation_2d.fdh5`, 20 frames): final top UY **−2.000000**, max
  vm **2899.4860 MPa (Node)** at disk-top node 1150 / **2899.4897 MPa
  (GP, 31371)**, max plate UY **−1.864691 mm**; Hertz ref E* = 1088.02,
  P(δ=1.9) = 3104.41 N/mm. Figures `indentation_2d_fig.png` +
  `results/indentation_2d_hertz.png`; scratch kept as
  `indentation_2d_scratch_read.py`. OGC path remains unverifiable on 1.0.1
  (`okf/examples/indentation-2d.md`).

- 2026-10-06 (round 37b) — `contact/ipc/tube_compression_ipc.py` re-run after
  regenerating its purged penalty reference (`03-advanced/tube_compression.py`,
  **146.6 s**, `results/tube_compression.fdh5` 30 MB kept): **PASS**, 139.7 s,
  comparison branch now prints IPC-vs-penalty (final frame, re-read from both
  kept `.fdh5`): peak |S_YY| IPC **63509.5** vs penalty **85522.0 MPa**
  (×1.347), peak P **1.0078** vs **1.8059** (×1.792), peak vm **1528.1** vs
  **1745.4 MPa**, top reaches −150 mm in both (−150.50 / −150.17).
  Verified gotcha: node-projected Stress can exceed the Gauss-point range
  (extrapolatory projection; GP S_YY [−51384.5, +20245.8] vs node min
  −85522.0 MPa) — use GP values for physical extremes.

- 2026-10-06 — `Exemples_fedoo/contact/ipc/tube_compression_ipc.py` PASSES on
  fedoo 1.0.1 (headless, **151 s**; 115 increments, 2 dt-bisected
  recoveries, Displacement tol 1e-2): 2Daxi tube (1200 nodes / 956 quad4,
  wall r 23–25, h 180), Simcoon EPICP (σy 300, k 1000, m 0.3),
  `IPCSelfContact(dhat=1e-3, dhat_is_relative=True, use_ccd=True)`,
  `nlgeom="UL"` + line search, top [0, −150]. Key numbers (re-read from kept
  `results/tube_compression_ipc.fdh5`): peak |S_YY| **63922.7 MPa**, max P
  **1.0854**, min Disp Y **−150.51**, max Disp Y **+0.4824**, peak vm
  **1498.8 MPa** (≈5× σy). No physics fix; added headless
  `res_ipc.plot("Stress","vm","Node",show=False,scale=1,screenshot=...tube_compression_ipc_fig.png)`
  (doc-source script printed numbers only — no `# OLD:` line). Verified API
  facts: von Mises component string is lowercase `"vm"` (`"VoMises"` →
  TypeError), `get_data("Disp")` is component-major `(2, n_nodes)` in 2Daxi,
  `IPCSelfContact` signature confirmed (1.0.1) — see
  `okf/examples/tube-compression-ipc.md` + `okf/concepts/fdh5-dataset.md`.

- 2026-10-06 — `Exemples_fedoo/contact/ipc/punch_indentation.py` PASSES on
  fedoo 1.0.1 (headless, **1251 s**; 242 increments at dt 0.00313, Force
  tol 5e-3): 3D hemispherical punch (E 3e4, R 3, gmsh 1123 nodes / 4985
  tet4) on gmsh box plate (E 1e4, 2122 nodes / 11560 tet4) = 3245 nodes /
  16545 tet4, `IPCContact(dhat=1e-2, dhat_is_relative=True, use_ccd=True)`,
  `StressEquilibrium(nlgeom=True)`. Key numbers (re-read from kept
  `results/punch_ipc.fdh5`): final punch-top UZ −2.0 mm, plate max
  indentation −1.2478 mm, punch reaction **71640 N** (clamped-bottom
  stress integral, 68 bottom elts, 400 mm²), max vm **4560.61 MPa**
  (element 11576, in the **punch**; plate max 4350.33 MPa). Fix:
  `set_nr_criterion("Displacement",...)` → `("Force",...)` — the
  Displacement criterion (relative displacement increment) stalls at
  Err≈0.04 on the stiff contact → `dt_min` RuntimeError; Force converges
  (sibling `indentation_3d.py` uses Force). Also added `screenshot=
  ...punch_indentation_fig.png` to the trailing `res.plot`. Verified stress
  layout: `get_data("Stress")` (6, 4*n_el) **gp-major**,
  `reshape(6,4,n_el).transpose(2,1,0)` → (n_el,4,6), 4 GPs identical for
  linear tet4 (`okf/examples/punch-indentation.md`).

- 2026-10-06 — `Exemples_fedoo/contact/ipc/indentation_3d.py` PASSES on
  fedoo 1.0.1 (headless, **83 s**; 20 NR-converged steps NR 2–5, Force tol
  5e-3): 3D sphere (E 1e5, R 5, gmsh 2491 nodes / 12017 tet4) on gmsh-graded
  clamped plate (E 1e3, 3831 nodes / 20375 tet4) = 6322 nodes / 32392 tet4,
  `IPCContact(dhat=0.05, dhat_is_relative=False, use_ccd=True)`. Key numbers
  (re-read from kept `results/indentation_3d.fdh5`): final top UZ −2.0 mm,
  base reaction **10822.5 N** (stress integration, 244 bottom elems) vs
  Hertz **8495.5 N** at δ=1.9 mm (**+27.4 %**, docstring said 15–20 %),
  max vm **18517.4 MPa** (in the stiff sphere), contact radius ~3.27 mm vs
  Hertz 3.08 mm. Fix: `screenshot=...indentation_3d_fig.png` added to the
  trailing `res.plot("Stress","vm","Node",show=False,scale=1,elevation=75,azimuth=20)`
  (original kept as `# OLD:`). Verified API fact: `fd.read_data` →
  `MultiFrameDataSet`; `res.load(-1)` then `get_data("Stress")` → `(6,4*n_elem)`
  **gp-major**, reshape `(6,4,n_elem)`, Voigt order [11,22,33,12,13,23]
  (σ_zz = index 2); mesh `.elements` (no `nodes_per_element`) — see
  `okf/concepts/fdh5-dataset.md` + `okf/examples/indentation-3d.md`.
  Scratch read-back script kept as `indentation_3d_scratch_read.py`.

- 2026-10-06 — `Exemples_fedoo/contact/ipc/indentation_2d.py` PASSES on
  fedoo 1.0.1 (headless, **10 s**; 20 NR-converged steps, Force tol 5e-3):
  2D plane-strain disk (E 1e5, R 5, `disk_mesh(5,12,24,tri3)` → 4233 nodes)
  on gmsh-graded plate (E 1e3, 1146 nodes) = 5379 nodes / 10457 tri3,
  `IPCContact(dhat=0.05, dhat_is_relative=False, use_ccd=True)`; final top
  UY −2.0 mm, max vm **1612.92 MPa** (node) / **2902.02 MPa** (element), max
  plate UY −1.9120 mm; figures
  `indentation_2d_fig.png` (deformed vm via `res.plot(...,screenshot=...)`,
  `# OLD:` fix) + `results/indentation_2d_hertz.png` (F-δ vs 2D Hertz).
  Env: `pip install gmsh` was required (module missing, docstring warns).

- 2026-10-05 — `Exemples_fedoo/contact/penalty/disk_rectangle.py` PASSES on
  fedoo 1.0.1 (headless, 33 s; fix this round: `screenshot=...disk_rectangle_fig.png`
  added to the final `res.plot("Stress","XX","Node",show=False,scale=1)`,
  original kept as `# OLD:` comment): 2D plane strain, rectangle 11×21 `quad4`
  + disk (r=0.5, nr=6, nt=6) at [1.5, 0.48] → stacked 552 nodes / 500 elts;
  penalty `fd.constraint.Contact(nodes_right, surf)`,
  `contact_search_once=True`, `eps_n=5e5`, `max_dist=1`; Simcoon `"EPICP"`
  (rect) + `ElasticIsotrop(50e3, 0.3)` (disk) under `Heterogeneous`;
  `StressEquilibrium(nlgeom="UL")`, `NonLinear`; 2 nlsolve steps (push
  [−0.25, 0.125], then release via `pb.bc.remove(-1)`), dt=0.005
  dt_max=0.01, interval_output=0.02 → 100 frames (50/step). Key numbers
  (fdh5): final frame max |Stress XX| = **20517.8** (node 220), min
  −20517.8 / max +3682.9; end-of-push (frame 49) max |Stress XX| = 24494.0;
  after release rect right edge max |UX| = 0.2241, max |UY| = 0.1812
  (residual elasto-plastic displacement). Verified API facts:
  `fd.DataSet.read("<base>.fdh5")` returns a `MultiFrameDataSet` (frames in
  `.list_data`, select `.load(i)`, negative index OK; single
  `get_data(field, comp, "Node")` component → 1-D node-major `sd[node]`);
  `pb.bc.remove(-1)` works (`okf/examples/disk-rectangle-contact.md`).

- 2026-10-05 — `Exemples_fedoo/contact/penalty/self_contact.py` PASSES on
  fedoo 1.0.1 (headless, 71 s; fix this round:
  `screenshot=...self_contact_fig.png` added to
  `res.plot("Stress","vm","Node",show=False,scale=1)`, original kept as
  `# OLD:` comment): 2D hole plate `hole_plate_mesh(15,15, L=100,H=100,r=45)`
  → 1680 nodes / 1568 `quad4`; penalty
  `fd.constraint.SelfContact(surf, "linear", search_algorithm="bucket")`,
  `contact_search_once=True`, `eps_n=1e6`; Simcoon EPICP;
  `StressEquilibrium(nlgeom="UL")`, `NonLinear`; top [0,−70]; 50 frames.
  Final frame: top Uy = **−70.0000** (Dirichlet exact), max |Ux| = 32.42,
  max von Mises (Gauss) = **1533.96 MPa** (≈5.11× σY).
  `search_algorithm="bucket"` confirmed valid on 1.0.1
  (`okf/examples/self-contact.md`).

- 2026-10-05 — `Exemples_fedoo/contact/ipc/self_contact.py` PASSES on fedoo
  1.0.1 (headless, ~57 s; fix this round: `screenshot=` added to the
  existing `res.plot("Stress","vm","Node",show=False,scale=1)`, original
  kept as `# OLD:` comment): 2D hole plate `hole_plate_mesh(15,15,
  L=100,H=100,r=45)` → 1680 nodes / 1568 elts, `IPCSelfContact(dhat=3e-3,
  dhat_is_relative=True, use_ccd=True)`, Simcoon EPICP `[200e3, 0.3, 1e-5,
  300, 1000, 0.3]`, `StressEquilibrium(nlgeom="UL")`, `NonLinear`, top
  `Disp=[0,-70]`, `nlsolve(dt=0.05, tmax=1, update_dt=True,
  dt_increase_niter=8, interval_output=0.01)` → 100 output iterations:
  final top disp −70.0, final max von Mises **1548.10 MPa** (iter_99,
  Gauss points — corrected 2026-10-07 from a re-read of the kept
  `.fdh5`, original claim 19766.57 MPa was a unit error),
  first frame Uy −0.7 / max vm 670.22 MPa (Gauss points, corrected
  2026-10-07); figure `self_contact_fig.png`.
  Verified API facts: `add_output` default `file_format="fdh5"` →
  multi-frame `iter_0…iter_N`; `MultiFrameDataSet.plot()` with
  `iteration=None` loads the LAST frame; **gotcha**: plain
  `fd.DataSet().load(path)` defaults to `iteration=0` (first frame), not
  final; `get_data('Stress', None, 'Element')` → (6, n_el) Voigt; Dirichlet
  value in `NonLinear` = total target at tmax (ramped by identity
  time_func); `interval_output` (as time) caps the time step (sub-steps to
  land on output times) (`okf/examples/self-contact.md`).

- 2026-10-05 — `Exemples_fedoo/contact/ogc/self_contact.py` PASSES on fedoo
  1.0.1 (headless, 51 s; fixes this round (2, `# OLD:` provenance): (1)
  `use_ogc=True` → `use_ogc=False` — **fedoo 1.0.1 hard-rejects OGC on
  solid meshes**: `IPCContact.initialize` raises `ValueError: use_ogc=True
  requires a shell/surface mesh where all nodes are the surface... Use
  use_ccd=True instead for solid meshes.`; with `use_ogc=False`, `use_ccd`
  auto-defaults True (CCD = documented equivalent for solid meshes). (2)
  `screenshot=` on the final plot): same 2D hole plate (1680 nodes: 1456
  interior / 224 surface), EPICP + UL, top [0,-70], 100 increments: max
  |Uy| = 70.0088, max von Mises **1628.16 MPa (Node, node 435 (−45,0))** /
  **1548.09 MPa (Gauss point, el 193 gp 2, 6272 GP)** (corrected 2026-10-08
  from a re-read of the kept `.fdh5`; the originally recorded 64033.0/52595.8
  are not reproducible); figure `self_contact_fig.png`. **Durable open
  question**: OGC restricted to shell/surface meshes in 1.0.1 → the OGC
  path of `contact/ogc/indentation_2d.py`, `indentation_3d.py`,
  `punch_indentation.py` and `contact/comparison/ccd_vs_ogc*.py` (all pass
  solid meshes) CANNOT be verified on 1.0.1 — only the CCD fallback is
  (`okf/examples/self-contact.md`, `okf/documentation/contact.md`).

- 2026-10-05 — `Exemples_fedoo/contact/benchmark/hertz_axisymmetric.py`
  PASSES on fedoo 1.0.1 (headless, 11.1 s; fix this round: appended a
  headless pyvista block — `pv.OFF_SCREEN=True`, `ds = fd.read_data(
  "results/hertz_axi")`, `ds.plot("Disp","Y", show=False, screenshot=,
  iteration=ds.n_iter-1)` + same for `("Stress","X")`; no `# OLD:` needed):
  2Daxi Hertz benchmark, substrate 101×101 `quad4` (radial 1.5-power
  graded) + indenter 51×5, 101 slave nodes vs 50 master bottom edges,
  penalty `Contact` `eps_n=1e5`, 12 increments, `δ=0.45`, `E*=1098.9`:
  `F_final = 1521.53` (analytic 1398.67, +8.78 %), `a_final = 2.0705`
  (analytic 2.1213, −2.40 %). Verified API facts: fedoo 1.0.1 has **no
  `fd.results` module** — `fd.read_data("<base>")` (base name **without
  extension** → `.fdh5`) returns a `MultiFrameDataSet` with `n_iter`,
  `field_names()`, `plot(field, component, show=, screenshot=,
  iteration=)`; `pb.add_output("results/hertz_axi", solid, ["Disp",
  "Stress"])` writes `results/hertz_axi.fdh5`; `DataSet.plot` has **no
  2Daxi revolve** (plots the r-z cross-section); `fd.post_processing`
  contains only `axi_to_3d.py`. Open question: no contact-pressure field
  stored by `add_output` for penalty `Contact` (σ_rr = Stress.X at the
  contact surface is the closest proxy) (`okf/examples/hertz-axisymmetric.md`).

- 2026-10-05 — `Exemples_fedoo/contact/benchmark/westergaard_sinusoidal.py`
  PASSES on fedoo 1.0.1 (headless, ~13 s; fix this round: replaced the
  trailing commented post-processing block with an active pyvista block,
  original lines kept verbatim as comments above): 2D plane-strain
  Westergaard sinusoidal contact (λ=1.0, A=0.02, H=2.0, gap=0.005,
  δ_max=0.06, E=1000, ν=0.3, E*=1275.5; rigid plate E=1e6), tri3 block
  81×81 + plate 81×3; `IPCContact(dhat=0.003, use_ccd=True)` (ipctk 1.6.0)
  final reaction `Fy = −27.9804` (12 increments, min gap 7.82e-07, final
  kappa 1.09e+07) vs penalty `Contact` `eps_n=1e5` `Fy = −26.6296` (13
  increments); analytic `p* = 69.0460`. Verified API facts: fedoo 1.0.1 has
  **no `fd.Result`** — use `fd.MultiFrameDataSet.read(path)`; `add_output`
  default `file_format='fdh5'` (`okf/examples/westergaard-sinusoidal.md`).

- 2026-10-05 — `Exemples_fedoo/03-advanced/tube_compression.py` PASSES on
  fedoo 1.0.1 (headless, ~147 s, confirm-only; pre-existing headless
  screenshot patch, no fix this round): 2Daxi tube `rectangle_mesh(5, 240,
  23, 25, 0, 180)` → 1200 nodes / 956 `quad4` / 3824 GP, Simcoon `"EPICP"`
  `[E, nu, cte, sigma_y, k, m] = [200e3, 0.3, 1e-5, 300, 1000, 0.3]`,
  `SelfContact` (eps_n=1e4, max_dist=1.0, search once), `NonLinear(nlgeom="UL")`
  + line search + `adaptive_stiffness`, 100 frames (dt=0.01, tmax=1). Final
  frame via `fd.read_data`: top node disp `[0, -150]`, S_YY ∈ [−51384.5,
  +20245.8] MPa, max P 1.5983. Verified API facts: fedoo 1.0.1 has **no
  `fd.load`** — use `fd.read_data(file)` → `MultiFrameDataSet` (`.n_iter`,
  `.load(i, load_mesh=True)`, `.get_data(name)`, `.get_all_frame_lim(name)`
  → `(Xmin, Xmax, clim)`); after load `Disp` is in `node_data`,
  `Stress`/`Strain`/`P` in `gausspoint_data` (shape `(6, n_gp)`);
  `Mesh.nodes` holds coordinates (no `.points`/`.coordinates`);
  `fd.post_processing` **does exist** (sub-package with `axi_to_3d`) — the
  old "fails to import" note was a false negative (`okf/examples/tube-compression.md`).

- 2026-10-05 — `Exemples_fedoo/adaptive/hessian_recovery.py` PASSES on fedoo
  1.0.1 (headless, ~4.5 s, no fix; byte-identical to doc source):
  `fd.recover_gradient(mesh, field, n_elm_gp=None, method='l2')` →
  `(n_nodes, 2)` and `fd.recover_hessian(mesh, field, n_elm_gp=None,
  method='l2')` → `(n_nodes, 2, 2)`; 51×51 `tri3` → 2601 nodes; f =
  sin(2πx)sin(2πy) (k = (2π)²), interior max |H_xx − exact| = 6.866e-02,
  max |H_xy − exact| = 9.715e-04. The example only writes
  `hessian_recovery.vtk`; the figure `hessian_recovery_fig.png`
  (2048×1536, 2×2 panels) comes from the persistent helper
  `plot_hessian_recovery.py` in the same folder (reads the .vtk — must run
  the example first).

- 2026-10-05 — `Exemples_fedoo/03-advanced/thermal_loading.py` PASSES on
  fedoo 1.0.1 (headless, ~10.2 s, no fix needed; pre-existing headless
  screenshot patch): `Heterogeneous(Simcoon ELISO matrix + Simcoon EPICP
  inclusion)`, `NonLinear(nlgeom=True)`, 2041 nodes / 2000 elts; inclusion
  fully plastic (vm 1355.8–1356.0 vs yield 200), matrix max vm 1165.71, max
  |U| 0.3345, figure `thermal_loading_fig.png`. Verified gotcha: BC
  `time_func` is evaluated with GLOBAL normalized time (t−t0)/(tmax−t0) —
  triangular ramp peaks at t = tmax/2 (`okf/concepts/time-dependent-bc.md`);
  no `fd.postprocessing` module in 1.0.1 (manual vm =
  sqrt(Sxx²+Syy²−Sxx·Syy+3·Sxy²)).

- 2026-10-05 — `Exemples_fedoo/03-advanced/rigid_body_bounce.py` PASSES on
  fedoo 1.0.1 (headless, ~13.4 s): `fd.constraint.RigidBody` +
  `set_static_obstacle(floor, dhat=0.01, kappa=1e8)` + `NonLinear` with
  `set_time_integrator(fd.time.SECOND_ORDER, fd.time.Newmark())`,
  `add_output(..., include_static_obstacles=True)` keeps the floor in every
  frame. First impact t≈0.24 s (center z≈0.128 m), rebound apex ≈0.318 m
  (e≈0.85), second impact t≈0.68 s; figure `rigid_body_bounce_fig.png`
  (last-frame off-screen screenshot; doc source ends with `write_movie`).

- 2026-10-05 — `Exemples_fedoo/03-advanced/multi_mesh_example.py` PASSES on
  fedoo 1.0.1 (headless, ~4.8 s, figure byte-identical): `fd.MultiMesh(nodes,
  {"quadrilateral": ("quad4", elts), "triangle": ("tri3", elts)},
  node_sets=..., name=...)` shares one node array across ordered submeshes;
  retrieve with `mesh["name"]`, sum the per-block `Assembly`s (`assembly1 +
  assembly2`) into one `problem.Linear`, and a single
  `get_results(...).plot("Stress", component="vm", data_type="Node")` renders
  all blocks. 5 nodes / 2 elements; prescribed `DispX=0.5` on nodes 1,3, apex
  node 4 → `(0.33959, -0.18162)`; `get_disp()` is component-major `(2, 5)`.
- 2026-10-05 — `Exemples_fedoo/03-advanced/incompressibility_comparison.py`
  PASSES on fedoo 1.0.1 (headless, 10.3 s, 3 figures byte-identical): Cook's
  membrane `quad4` plane strain `ElastoPlasticity(nu=0.499, nlgeom="UL")`
  comparing `StressEquilibrium(incompressibility=None|"mean_dilatation"|"fbar")`
  with `StressEquilibriumRI`. Locking makes the untreated element ~2.29× too
  stiff (tip disp 0.87896 vs 2.00988/2.01025; max P 0.00137 vs 0.01090);
  reduced integration 1.81188 is the fastest (0.52 s). All four
  `incompressibility` values and gotchas documented in
  `okf/concepts/incompressibility-methods.md`.

- 2026-10-05 — `fd.problem.Modal(assembly, name="MainProblem")` (free
  vibration), `solve(n_modes=6, sigma=None)` with **`sigma` targeting the
  eigenvalue `ω²`** (unset avoids factorizing a singular free-free stiffness).
  `frequencies` are in **Hz** (`angular_frequencies` rad/s, `eigenvalues` ω²)
  and `modes` is `(n_modes, n_dof)`, **mass-normalized, one mode per row**.
  The assembly must supply a mass matrix via material density or `set_inertia`.
  Verified by running `Exemples_fedoo/01-simple/modal_analysis.py` on fedoo
  1.0.1 (clamped square plate, 225-node `quad4` shell mesh,
  `f = [91.041, 189.619, 189.619, 279.734] Hz`, modes 2/3 degenerate).
- 2026-10-05 — `fd.mesh.functions.change_elm_type(mesh, elm_type, name='')`
  converts a mesh to a **compatible, higher-order** element type and keeps the
  element topology while raising the node count. Verified on the I-shape beam
  (`Exemples_fedoo/01-simple/I_shape_beam_bending.py`): a `wed6` mesh of 440
  nodes / 380 elements becomes 1687 nodes / 380 elements as `'wed15'` and
  2457 nodes / 380 elements as `'wed18'`; the converted mesh still solves the
  same `Linear` + `StressEquilibrium` problem (fedoo 1.0.1).

- 2026-10-05 — `fd.mesh.box_mesh(nx=51, ny=7, nz=7, ...)` gives
  `mesh.n_nodes = 2499` (= `nx*ny*nz`): `nx/ny/nz` are **node counts**, not
  element counts (source docstring `fedo/mesh/simple.py`; verified by running
  `Exemples_fedoo/01-simple/simple_cantilever_beam_3D_model.py` on fedoo 1.0.1).
- 2026-10-05 — `fd.weakform.StressEquilibrium` geometric nonlinearity:
  `nlgeom` accepts `{True, 'UL', 'TL'}` (`True` == `'UL'`, updated Lagrangian;
  `'TL'` = total Lagrangian); the default is `None` (linear kinematics), not
  `False`. `nlgeom` only takes effect inside a nonlinear problem
  (`problem.NonLinear` / `NonLinearNewmark`), and the finite-strain formulation
  requires simcoon. Exact 1.0.1 signature:
  `StressEquilibrium(constitutivelaw, incompressibility=None,
  convert_tangent=True, name="", nlgeom=None, space=None)` (source docstring
  `fedoo/weakform/stress_equilibrium.py`; verified by running
  `Exemples_fedoo/01-simple/simple_cantilever_beam_3D_model_nlgeom.py` on fedoo
  1.0.1).
- 2026-10-05 — `fd.weakform.BeamEquilibrium(material, A=None, Jx=None,
  Iyy=None, Izz=None, k=0, name="", nlgeom=None, space=None)`: beam
  section props go to the weak form, `k=0` = Euler-Bernoulli (no shear),
  `k>0` = Timoshenko. Element type is the lower-case string in
  `Assembly.create` — `"bernoulliBeam"`, `"beam"`, `"beamFCQ"`.
  `get_results(assemb, "BeamStress")["BeamStress"]` is 6-row: `0..2`
  internal forces, `3..5` internal moments. Gotcha: fedoo 1.0.1 has **no**
  `fd.weakform.Beam` (only the `beam` sub-module and `BeamEquilibrium`),
  though `Exemples_fedoo/01-simple/simpleBeamElementExample.py` still
  references it in its inactive `computeShear == 2` branch (verified by
  running that example, `computeShear = 1`, on fedoo 1.0.1).
- 2026-10-05 — `pb.get_disp()` and `pb.get_results(assembly, [...], "Node")`
  return **component-major** arrays of shape `(n_components, n_nodes)`
  (`Disp` → `(3, n_nodes)`, `Stress` → `(6, n_nodes)` Voigt), so index a node
  set with `U[:, nodes]` (verified on fedoo 1.0.1).
- 2026-10-05 — `fd.mesh.extrude(mesh, extrude_path, n_nodes=11, ndim=None,
  name='', local_frame=None)`: `local_frame` is an array of shape
  `(n_path_nodes, 3, 3)` (one 3x3 frame per path node); node/element counts
  multiply along the sweep and `thicken(..., n_nodes=3)` triples the surface
  nodes (verified by running `Exemples_fedoo/01-simple/simple_mesh_generation.py`
  on fedoo 1.0.1: disk 673 nodes -> cylinder 4038 hex8 nodes/3200 elements;
  280-node swept surface -> 840-node thick ring).
- 2026-10-05 — `DataSet.plot(field, component, show=False, screenshot="x.png")`
  saves a PNG with PyVista off-screen (no display needed); fedoo 1.0.1 has no
  `fd.post` module — plotting lives on `fedoo.DataSet.plot` / `fd.viewer`.
- 2026-10-05 — `fd.mesh.hole_plate_mesh(nr=11, nt=11, length=100, height=100,
  radius=20, elm_type="quad4", sym=False)` gives `n_nodes=880`, `n_elements=800`;
  `nr`/`nt` are **node counts** in the radial/tangent direction from the hole
  (default 11) (verified by running
  `Exemples_fedoo/01-simple/Plate_with_hole_in_tension.py` on fedoo 1.0.1).
- 2026-10-05 — A `MultiFrameDataSet` read with `fd.read_data("x.fdz")` has no
  current frame until `load(iteration)` is called (default `-1` = last);
  `get_data(...)` otherwise raises `NameError: Field data not found.` Use
  `get_history(field, indices, component, data_type=...)` for per-iteration
  values, `plot_history(...)` for a matplotlib history plot, and `plot(...)`
  (which auto-loads the last frame) for PyVista (verified by running
  `Exemples_fedoo/01-simple/visualization.py` on fedoo 1.0.1).
- 2026-10-05 — `DataSet.plot(..., show=False)` **returns the PyVista plotter**
  (the `-> None` annotation is wrong), so `pl.screenshot(path,
  window_size=[w, h])` / `pl.link_views()` / `pl.camera.*` work; the rendered
  dataset is `pl.actors["data1"].mapper.dataset`. `component` accepts `'vm'`,
  `'pressure'`, `'norm'` besides `'X'`/`'XX'`-style labels (verified on fedoo
  1.0.1, source `fedoo/core/dataset.py`).
- 2026-10-05 — `fd.constitutivelaw.BeamCircular(material, r, k=0.9, name='')`:
  default shear factor `k=0.9` (the `BeamEquilibrium` weak form's own `k` default
  is 0). `fd.mesh.extract_edges(mesh)` turns a solid mesh's edges into a beam
  lattice. Verified by running `Exemples_fedoo/01-simple/lattice_beam.py` on
  fedoo 1.0.1 (3D lattice 216 nodes / 540 elements, max|Disp|=50,
  max|BeamStress|=6789.25; the `ndim=2` and `k=0` switch paths also PASS).
- 2026-10-05 — `Exemples_fedoo/01-simple/poison_eq.py` PASSES on fedoo 1.0.1
  (headless, 4.4 s): a bare `fd.WeakForm` PDE
  (`dU_dX.virtual*dU_dX + dU_dY.virtual*dU_dY`) solved with Dirichlet
  `left`=0 / `right`=1; the default `fd.mesh.rectangle_mesh(nx=11, ny=11, ...)`
  is **121 nodes / 100 quad4 elements** and the solution `U` spans exactly
  0.0…1.0. Figure `poison_eq_fig.png`.
- 2026-10-05 — `Exemples_fedoo/01-simple/spherical_shell_compression.py`
  PASSES on fedoo 1.0.1 (headless, 4.3 s): `pv.Sphere(radius=20)` → 842 nodes /
  1680 elements, `fd.constraint.Pressure` on 540 cap elements,
  `problem.Linear` max|Disp|=5.364 mm, `Stress` XX ∈ [-264.04, +121.77] MPa
  (`res["Stress"]` shape `(6, 5040)` at `position=1`). Note the script's
  "nonlinear analysis" comment is stale — it uses `fd.problem.Linear`.
  Figure `spherical_shell_compression_fig.png`.
- 2026-10-05 — `Exemples_fedoo/02-constraints/disk_rectangle_contact.py`
  PASSES on fedoo 1.0.1 (headless, 12 s): 2D disk-on-rectangle **IPC barrier**
  contact via `fd.constraint.IPCContact(mesh, surface_mesh=surf, dhat=0.005,
  dhat_is_relative=False, use_ccd=True)` added to the solid assembly with
  `fd.Assembly.sum`, solved by `problem.NonLinear` (Simcoon `"EPICP"` rectangle
  + `ElasticIsotrop` disk under a `Heterogeneous` law). Unloaded end state
  keeps residual stress (max von Mises 656.55 MPa, loading peak ≈1628.4 MPa),
  confirming plasticity. Figures `disk_rectangle_contact_fig.png` /
  `disk_rectangle_contact_fig2.png`. Note the distinct older script
  `contact/disk_rectangle_contact.py` uses penalty `fd.constraint.Contact`.
- 2026-10-05 — `Exemples_fedoo/02-constraints/Periodic_BC_2D_Plate_with_hole.py`
  PASSES on fedoo 1.0.1 (headless, 5.7 s): `fd.constraint.PeriodicBC("small_strain")`
  auto-adds global mean-strain dofs `E_xx/E_yy/E_xy` (+`MeanStrain`), controlled
  via `pb.bc.add("Dirichlet","E_xy",0.1)`; a rigid-body pin is still required.
  Enforcing `[0,0,0.1]` on the 880-node `hole_plate_mesh` gives mean stress
  `[~0,~0,2497.668]` (surface integral via `mesh.integrate_field`). Figure
  `Periodic_BC_2D_Plate_with_hole_fig.png`.
- 2026-10-05 — `Exemples_fedoo/02-constraints/rigid_tie.py` PASSES on fedoo
  1.0.1 (headless, 5.8 s): `fd.constraint.RigidTie2D(list_nodes, center=None,
  name='Rigid Tie 2D')` ties the top face of a 121-node square and drives the
  rigid rotation through the global dof `RigidRotZ` (`pb.bc.add("Dirichlet",
  "RigidRotZ", -pi/4)`); tied nodes become **slaves** and must not be used in
  other BCs. 5 NR steps (3 iters each), `max|Disp|=0.5499`, `Stress YY ∈
  [-122418.6, 66658.2]`. Figure `rigid_tie_fig.png`. The commented
  `write_movie` path fails in `fedoo/core/dataset.py` → `imageio`
  (`TiffWriter.write() got an unexpected keyword argument 'fps'`) —
  library/environment bug, logged as an open question.
- 2026-10-05 — `Exemples_fedoo/02-constraints/pressurized_pipe.py` PASSES on
  fedoo 1.0.1 (headless, 4.2 s): 2D plane-strain `hollow_disk_mesh(200, 20,
  nr=5, nt=41)` (200 nodes / 160 quad4) loaded by internal + external
  `fd.constraint.Pressure.from_nodes` summed into `problem.Linear`; hoop
  `Stress[0] ∈ [-1.77, 17.93]` MPa matches the thick-cylinder Lamé value
  `σ_θ(a)=18.0` MPa. `get_results(assembly,"Stress").get_data("Stress")` is a
  `DataSet` array of shape `(6, n_elements*4)` (component-major Gauss-point
  values). The pipe has no displacement BC, so the singular system adds a
  spurious rigid translation (`U.mean ≈ (+0.0151, -0.0126)` mm). Figure
  `pressurized_pipe_fig.png`.

- 2026-10-05 — `Exemples_fedoo/02-constraints/mean_rigid_motion_torsion.py` PASSES on fedoo 1.0.1 (headless, 22.4 s): same 1152-node/847-hex8 cube twisted by `pi/3` at `x=L` (left face clamped, `nlgeom='UL'`), comparing `fd.constraint.RigidTie(right)` vs `fd.constraint.MeanMotion(right_surface, components=["Rot"])` driven through `RigidRotX`/`MeanRotX`. Mean motion is softer: moment 8.790089e+04 vs rigid 8.942565e+04 (~1.7% lower) and the mean face warps more (`DispX` in [-0.07775,0.12741] vs [-0.04182,0.09683]). `mean_motion.node_by_variable` is populated only after the constraint is added to the problem. Figure `mean_rigid_motion_torsion_fig.png`.
- 2026-10-05 — `Exemples_fedoo/03-advanced/3D_periodic_BC_off_axis.py` PASSES on
  fedoo 1.0.1 (headless, 7.5 s): `fd.constraint.PeriodicBC("small_strain",
  off_axis_rotation=Rotation.from_rotvec([0, 0, np.pi/4]))` on the periodic
  `gyroid_per.vtk` unit cell (23879 nodes / 84151 `tet4`, `bounding_box.volume
  = 1.0`) adds **local** strain dofs `E_11 … E_23` + `LocalMeanStrain`
  alongside the global ones. Prescribing `E_11 = 1` yields local uniaxial
  `S_11 = 1.351e+04` (other components ≈ 0) and global
  `[Sxx, Syy, Sxy] = [6.756e+03, 6.756e+03, 6.756e+03]`; the
  `Fext(MeanStrain)/volume` dual and the `mesh.integrate_field` surface
  integral agree to round-off. Figure `3D_periodic_BC_off_axis_fig.png`.
- 2026-10-05 — `Exemples_fedoo/03-advanced/composite_DCB_test_3D.py` PASSES on
  fedoo 1.0.1 (headless, 8.3 s): zero-thickness cohesive interface built by
  pairing the upper face `elements[:,4:8]` of the lower `hex8` arm with the
  lower face `elements[:n,0:4]+offset` of the upper arm into 8-node
  `quad4interface` elements, assembled with
  `fd.weakform.InterfaceForce(fd.constitutivelaw.CohesiveLaw(...))`. Both arms
  are kept as separate `hex8` assemblies (`lower + upper`) so
  `get_results(volume_sum).plot(...)` has only VTK-compatible cells. Interface
  state via `cohesive_assembly.sv["DamageVariable"]` / `["RelativeDisp"]`;
  verified `max_damage=1.0` with 112/112 Gauss points failed behind the 10 mm
  starter crack and `max_opening=5.5898` mm (570 nodes, 288 volume + 60
  cohesive elements). Figure `composite_DCB_test_3D_fig.png`.
- 2026-10-05 — `Exemples_fedoo/03-advanced/neohookean_cantilever.py` PASSES on
  fedoo 1.0.1 (headless, 25 s default hex8): `Simcoon("NEOHC", [mu, kappa])`
  (props order `{mu: 0, kappa: 1}`) + `StressEquilibriumRI(nlgeom="UL")` on
  hex8 / `StressEquilibrium(nlgeom="UL")` on hex20, `RigidTie` cap driven by
  `Dirichlet RigidDispX=0.03`; max|disp| = 3.2793e-02 m, max von Mises
  5.2277e+06 Pa (quadratic switch: 3.2797e-02 m / 7.4685e+06 Pa, ~4 min).
  Figure `neohookean_cantilever_fig.png`.
- 2026-10-05 — `Exemples_fedoo/03-advanced/neohookean_cantilever_force.py`
  PASSES on fedoo 1.0.1 (headless, 197.6 s): force-controlled companion —
  `RigidBodyAssembly(mass, inertia_tensor, rigid_tie, mesh=...)` auto-registers
  its `RigidTie` in a plain `problem.NonLinear` (no contact needed) and adds
  the 6x6 inertia to the global `RigidDisp*`/`RigidRot*` dofs; problem-level
  `pb.set_time_integrator(fd.time.SECOND_ORDER, fd.time.Newmark(beta=0.3025,
  gamma=0.6))` (`gamma=0.6` requires `beta>=0.30`) + quadratic 20 N force ramp
  on `Neumann RigidDispX` + `pb.add_line_search(mode="safeguard")` settles at
  ux = 45.60 mm (0.912 L), rotY = 89.2 deg, drift 0.0014 mm — within ~0.2% of
  the displacement-control cross-check 45.5 mm (0.911 L). Figure
  `neohookean_cantilever_force_fig.png`.
- 2026-10-05 — `Exemples_fedoo/contact/ipc/gyroid_compression.py` **FAILS**
  on fedoo 1.0.1 + ipctk 1.6.0 (headless, ~255 s to abort): 3D density-0.3
  gyroid (`gyroid_per.vtk`, 23879 nodes / 84151 tet4) under 50% Z compression
  with `IPCSelfContact(dhat=1e-2, dhat_is_relative=True, use_ccd=True)`
  diverges — one 3.13e-3 increment converges, then NR residual → `inf` and
  dt collapses to `dt_min` (`RuntimeError`). Root cause verified: the
  gyroid sheet is **self-touching at rest** (~24 pinch pairs, branches
  ~1.4e-6 apart sharing triangles; 98426 collision pairs at t=0, min
  distance 1.58e-12 at dhat_abs=0.0173) → log-barrier gradient → inf. The
  docstring's `al_max_iter=5` (Augmented Lagrangian outer loop) does NOT
  exist in fedoo 1.0.1 (grep: no AL/outer-loop code). `dhat=5e-3` (repo
  comparison value) fails identically. No figure; no fix (mesh property,
  not an example bug). `okf/examples/gyroid-compression.md`.
- 2026-10-06 — `Exemples_fedoo/contact/ipc/gyroid_compression_plastic.py`
  **FAILS** on fedoo 1.0.1 + ipctk 1.6.0 (headless, ~347 s to abort):
  same gyroid mesh + `IPCSelfContact(dhat=1e-2 rel, use_ccd=True)` with
  Simcoon EPICP `[200e3, 0.3, 1e-5, 300, 1000, 0.3]`, 50% Z compression,
  `set_nr_criterion("Displacement", tol=5e-3)` — NR fails at EVERY bisected
  dt (err ~0.87–0.95, finite, never below tol) → `dt_min` `RuntimeError`;
  unlike the elastic sibling (one 3.1e-3 step then `Err: inf`), the plastic
  variant converges no increment at all. Same root cause re-verified
  (scratch: 98,426 t=0 collision pairs, min distance 1.582e-12; mesh MD5
  `A54CB93555E725E8E596A9228614B14E`). No figure; only fix = headless
  `screenshot=` on the unreachable final `res.plot` (`okf/examples/gyroid-compression.md`).
- 2026-10-06 — `Exemples_fedoo/contact/ipc/gyroid_compression_periodic.py`
  **FAILS** on fedoo 1.0.1 + ipctk 1.6.0 (headless, ~385 s to abort): same
  `gyroid_per.vtk` + `IPCSelfContact(dhat=5e-3 rel, use_ccd=True)` with
  `PeriodicBC("finite_strain")` + pinned center node + `DU_xx=-0.5` — periodic
  BCs do NOT change the t=0 self-contact (98,426 pairs, min dist 1.582e-12,
  re-verified): NR err 17.7–18.4 at the first bisected dt, no increment
  converges, `dt_min` `RuntimeError`. No figure; no fix (mesh/IPC limitation,
  all APIs valid in 1.0.1) (`okf/examples/gyroid-compression.md`).
- 2026-10-08 — `thermal/thermo_meca_weak_coupling_3D.py`
  **PASSES** on fedoo 1.0.1 (headless, **1570.6 s / ~26 min**, exit 0):
  weakly-coupled thermo-mechanical 3D (gyroid.msh, 14864 n / 49019 tet4,
  4 GP/el), 200 thermal + 200 mechanical increments dt=0.3, `Temp=100` ramp
  on +X face, all 6 faces clamped, ELISO alpha=1e-3. Re-read from kept
  `results/thermo_meca_nl_{th,me}.fdh5` (200 frames each): nodal Tmax **100.0**
  on the +X face (node 1, x=+0.5), max nodal |U| f99 **0.0103838** / f199
  **0.0104087**, GP von Mises peak f99 **235 525 MPa** (el 45187, gp 3,
  gp-major, TV-smoothness checked) / f199 **236 050** (el 45187, gp 0),
  max |Voigt| f99 **180 575** (ZZ, el 43555, gp 2); stored `Stress_vm` ==
  `StressTensorList(Stress).von_mises()` exactly (maxdiff 0 over 196 076 GP).
  Stress peak = clamped corner of the hot +X face (96 GP > 100 GPa) —
  corner singularity, physically consistent with the +X thermal load.
  Second-phase quirk (example kept as-is): the 2nd loop never advances
  `pb.time` and never calls `set_start()` → frames 100–199 near-flat
  (max|ΔS| 143 MPa, max|ΔT| 1.2e-7) — silent no-op, not an error (new
  concept `okf/concepts/nonlinear-set-start.md`). Fix: additive headless
  init figure only (`fd.DataSet(mesh).plot(screenshot=..._init.png)`);
  figures `_init/_fig/_fig2.png` + `thermo_meca_weak_coupling_3D_key_results.csv`
  kept; scratch `..._scratch_{plot,diag,fixcsv}.py` (`okf/examples/thermal.md`).
- 2026-10-14 (rigid_body, round R13) —
  `rigid_body/rigid_body_freefall.py` PASSES on fedoo 1.0.1 (headless,
  **10.1 s**, exit 0): rigid sphere 50n/96 tri3, COM z0=1.0 m, m=1.0 kg,
  route 1 `body.solve(dt=1e-3, tmax=0.6)` (internal `NonLinear` +
  `Newmark(β=1/4,γ=1/2)` + `nlsolve(update_dt=False)` — verified in
  installed source; **route 1 saves no `.fdh5` at all**, final state only
  via `_dof_indices`). Analytic parabola benchmark (R12 convention):
  example's own final-state check measured **1.78e-15 m** (tol 0.01 m),
  whole-run max deviation **1.643130e-14 m** at t=0.49 s — machine
  precision (Newmark exact for constant acceleration); max |RigidRot| = 0
  (no torque); drop Δz = 1.7658 m = ½·g·t_end² (COM's own drop; mesh
  bottom surface z0−r = 0.9 m measured). Trajectory persisted by a
  flagged scratch (`rigid_body_freefall_scratch_history.py`) reproducing
  route 1 + `add_output` (equivalence to the example's read-back: 1.8e-15
  m) → `rigid_body_freefall.fdh5` (11.6 MB, 600 frames) + traj/key CSVs
  + `_fig.png` (2-panel) + `_init.png`; nothing > 4 GiB
  (`okf/examples/rigid-body.md`, `okf/concepts/rigid-body.md`).