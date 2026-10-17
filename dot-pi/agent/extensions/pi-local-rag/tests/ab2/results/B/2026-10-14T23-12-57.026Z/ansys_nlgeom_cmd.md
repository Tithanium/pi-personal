<rag-context>
[pi-local-rag] RAG subagent: 2 sources, 34793 ms retrieval.
### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt — NLGEOM command (lines 51992–52033)

NLGEOM,Key
Includes large-deflection effects in a static or full transient analysis.
SOLUTION (p.38):Nonlinear Options (p.40)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Key
Large-deflection key:
OFF
Ignores large-deflection effects (that is, a small-deflection analysis is specified). This option
is the default.
ON
Includes large-deflection (large rotation) effects or large strain effects, according to the
element type.
Command Default
Large-deflection effects are ignored.
Notes
Large-deflection effects are categorized as either large deflection (or large rotation) or large strain, de-
pending on the element type. These are listed (if available) under Special Features in the input data
table for each element in the Element Reference. When large deflection effects are included
(NLGEOM (p. 1273),ON), stress stiffening effects are also included automatically.
If used during the solution (/SOLU (p. 1892)), this command is valid only within the first load step.
In a large-deflection analysis, pressure loads behave differently than other load types. For more inform-
ation, see Load Direction in a Large-Deflection Analysis.
The gyroscopic matrix (that occurs due to rotational angular velocity) does not support large-deflection
effects. The theoretical formulations for the gyroscopic matrix support small deflection (linear formulation)
only.
When large-deflection effects are included in a substructure or CMS transient analysis use pass, the
OUTRES (p. 1382) command ignores DSUBres = ALL.
This command is also valid in PREP7.
Menu Paths
Main Menu>Preprocessor>Loads>Analysis Type>Analysis Options
Main Menu>Preprocessor>Loads>Analysis Type>Sol'n Controls>Basic
Main Menu>Solution>Analysis Type>Analysis Options
Main Menu>Solution>Analysis Type>Sol'n Controls>Basic

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt — SOLUTION Nonlinear Options table (lines 2933–2975)

Table 2.49: Nonlinear Options
These SOLUTION commands define options for nonlinear analyses.
...
Includes large deformation effects in a static or full transient
analysis.
NLGEOM (p. 1273)
Specify results items to track during solution.
NLHIST (p. 1275)
Controls remeshing in nonlinear adaptivity.
NLMESH (p. 1284)
Specifies the Newton-Raphson options in a static or full transient
analysis.
NROPT (p. 1305)
</rag-context>