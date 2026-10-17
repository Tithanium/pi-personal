<rag-context>
[pi-local-rag] RAG subagent: 7 sources, 61288 ms retrieval.
# NLGEOM,ON — ANSYS Mechanical APDL

## What the command does

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt — NLGEOM,Key (lines 51992-52029)

```
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
```

## Usage examples (NLGEOM,ON / NLGEOM,1 in input files)

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt — nonlinear static setup with nlgeom,on (lines 17541-17560)

```
/solu
antype,static
nlgeom,on
rescontrol,define,all,1
time,1.0
kbc,0
nsubs,10,100,10
autots,on
nsel,s,loc,x,2
nsel,r,loc,y,2
d,all,uy,-0.1             ! Displacement load
allsel,all
solve
save
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/models_examples/mwe_run_stackline/stackline_code_ANSYS_beam.txt — solution controls with NLGEOM,1 (lines 50-68)

```
/SOL
ANTYPE,0
NLGEOM,1
NSUBST,20,200,5        ! Allow bisection: 20 initial, up to 200, min 5
OUTRES,ALL,1
TIME,1
AUTOTS,1
PSTRES,1
LNSRCH,ON              ! Line search helps cable-like problems
SOLVE

TIME,2                  ! Must increment TIME for 2nd load step
NSUBST,50,500,10
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/models_examples/mwe_run_cone_ecrase/cone_ecrase.txt — cone crush solution block with NLGEOM,1 (lines 241-263)

```
/SOL
NLGEOM,1
NSUBST,100,0,0 
AUTOTS,1
TIME,1  
OUTRES,ALL,1

/STATUS,SOLU
SOLVE
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/ANSYS_Mechanical_APDL_Technology_Showcase_Example_Problems.txt — Threaded Connection Analysis, Step 1 (lines 27790-27794)

```
56.6.1. Step 1: Perform a 2D Axisymmetric Analysis with Pressure and End-
Cap Loading
A static structural analysis with large-deflection effects (NLGEOM,ON) is performed in five load steps.
The analysis involves two complete loading/unloading cycles of the pressure and end-cap loads. In
the fifth load step, the final values of the pressure and end-cap loads are applied.
```
</rag-context>