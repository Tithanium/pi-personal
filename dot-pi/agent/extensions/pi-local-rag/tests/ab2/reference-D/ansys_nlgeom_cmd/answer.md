Facts array validated (33 facts). 

## What does the `NLGEOM,ON` command do in ANSYS Mechanical APDL?

`NLGEOM,ON` is the APDL switch that **enables large-deflection / large-strain (nonlinear-geometry) behavior** in a **static or full transient** structural analysis.

### What it does (from the Command Reference)
Per the official command entry (`Ansys_Mechanical_APDL_Command_Reference.txt:51992`): *"Includes large-deflection effects in a static or full transient analysis,"* under the SOLUTION → Nonlinear Options menu.

- **Syntax:** `NLGEOM,Key` (Key = OFF/ON). `OFF` = small-deflection analysis (the **default**, `:52004`, `:52010`); **`ON` = includes large-deflection (large-rotation) effects or large-strain effects, according to the element type** (`:52007`).
- **Effect on formulation:** With `NLGEOM,ON`, element stiffness is evaluated from the **deformed configuration**, including **geometric (stress-stiffening) stiffness** (SSAT/KG). The reference explicitly notes that *"stress stiffening effects are also included automatically"* when large deflection is on (`:52015`). The okf topic frames it as "element stiffness is recomputed from the deformed configuration and includes geometric stiffness effects (SSAT/KG)" (`okf/topics/large-displacement-nlgeom.md:11`).
- **Categorization:** Effects are categorized as **large deflection/large rotation** vs **large strain** depending on the element type; each element lists this under "Special Features" in the Element Reference (`:52012`).

### Constraints / notes
- **Load-step restriction:** If issued during `/SOLU`, it is valid **only within the first load step** (`:52016`) — you cannot toggle it later in the solve.
- **Pressure behavior:** In a large-deflection analysis, pressure loads behave differently than other load types (`:52017`).
- **Gyroscopic matrix:** Not supported — gyroscopic (rotational angular velocity) terms are linear/small-deflection only (`:52019`).
- **Substructure/CMS:** In a substructure or CMS transient use pass, `OUTRES` ignores `DSUBres=ALL` when large deflection is active (`:52023`).
- **Valid phases:** Also valid in PREP7 (`:52024`); GUI paths are under Preprocessor/Solution → Analysis Type / Sol'n Controls Basic (`:52026`–`:52029`).

### Alias
`NLGEOM,ON` is interchangeable with the numeric form **`NLGEOM,1`** (both occur in sources; `okf/topics/large-displacement-nlgeom.md:11`, `:36`).

### When it's required
The okf topic states it is *"required wherever rotations, slenderness effects, buckling margins or large strain matter"* (`large-displacement-nlgeom.md:11`). In the verified tutorials it's turned on for every large-deformation case under static, transient, soil (`ANTYPE,SOIL`), and forming analyses, alongside hyperelastic/large-plastic materials and contact.

### Usage in examples (all three source classes)
- **Command reference & guides:** Basic Analysis Guide transient example `ANTYPE,TRANS` / `TRNOPT,FULL` / `NLGEOM,ON` (`ANSYS_Mechanical_APDL_Basic_Analysis_Guide.txt:855`); Advanced Analysis Guide birth/death first-load-step sample `NLGEOM,ON` then `NROPT,FULL` (`:7149`, `:7175`); 2D-to-3D analysis requires *"Static analysis with geometric nonlinearity (NLGEOM,ON)"* (`:528`).
- **Example scripts:** `models_examples/buckling_manuel_Load_control.txt:46` issues `NLGEOM,1` in SOLUTION; `ANSYS_Mechanical_APDL_Technology_Showcase_Example_Problems.txt:3374` issues `NLGEOM, ON  ! Activate large deflection` after `NROPT,UNSYM` in a static solve. The okf topic lists ~10 verified tutorials using it (buckling/post-buckling, hot-rolling rezoning, soil embankment, hyperelastic extrusion, thread/wire/stent/spring-coil contact) (`large-displacement-nlgeom.md:15–24`).

**Bottom line:** `NLGEOM,ON` turns on geometric nonlinearity — it makes APDL account for large rotations/strains by updating the stiffness matrix from the deformed shape and automatically including stress-stiffening, and it must be set in the first load step.

*(Facts written to `C:\Users\connessn\.pi\agent\extensions\pi-local-rag\tests\ab2\reference-D\ansys_nlgeom_cmd\facts.json`.)*