<rag-context>
[pi-local-rag] RAG subagent: 23 sources, 128411 ms retrieval.
# Nonlinear large-deflection static structural analysis in ANSYS Mechanical APDL — solution control commands

Source: local index of `C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/` (ANSYS Release 2026 R1 documentation and examples).

## 1. NLGEOM — enable large-deflection effects

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt — NLGEOM,Key (lines ~51992-52029)

```
NLGEOM,Key
Includes large-deflection effects in a static or full transient analysis.
SOLUTION (p.38):Nonlinear Options (p.40)

Key
Large-deflection key:
OFF
Ignores large-deflection effects (that is, a small-deflection analysis is specified). This option
is the default.
ON
Includes large-deflection (large rotation) effects or large strain effects, according to the
element type.

Notes
Large-deflection effects are categorized as either large deflection (or large rotation) or large strain, de-
pending on the element type. ... When large deflection effects are included
(NLGEOM (p. 1273),ON), stress stiffening effects are also included automatically.
If used during the solution (/SOLU (p. 1892)), this command is valid only within the first load step.
In a large-deflection analysis, pressure loads behave differently than other load types.
Menu Paths
Main Menu>Preprocessor>Loads>Analysis Type>Analysis Options
Main Menu>Preprocessor>Loads>Analysis Type>Sol'n Controls>Basic
Main Menu>Solution>Analysis Type>Analysis Options
Main Menu>Solution>Analysis Type>Sol'n Controls>Basic
```

## 2. AUTOTS — automatic time stepping

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt — AUTOTS,Key (lines ~9983-10020)

```
AUTOTS,Key
Specifies whether to use automatic time stepping or load stepping.
SOLUTION (p.38):Load Step Options (p.43)

Key
Automatic time stepping key:
OFF
Do not use automatic time stepping.
ON
Use automatic time stepping (default).
AUTO
The program determines whether to use automatic time stepping (used by Workbench).

Command Default
Automatic time stepping is on by default.

Notes
Specifies whether to use automatic time stepping (or load stepping) over this load step. If Key = ON,
both time step prediction and time step bisection will be used.
...
You cannot use automatic time stepping (AUTOTS (p. 211)), line search (LNSRCH (p. 1093)), or the DOF
solution predictor (PRED (p. 1526)) with the arc-length method (ARCLEN (p. 178), ARCTRM (p. 180)).
```

## 3. NSUBST — substeps / time-stepping window

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt — NSUBST,NSBSTP,NSBMX,NSBMN,Carry (lines ~54697-54749)

```
NSUBST,NSBSTP,NSBMX,NSBMN,Carry
Specifies the number of substeps to be taken this load step.
SOLUTION (p.38):Load Step Options (p.43)

NSBSTP
Number of substeps to be used for this load step (that is, the time step size or frequency increment).
If automatic time stepping is used (AUTOTS (p. 211)), NSBSTP defines the size of the first substep.
...
NSBMX
Maximum number of substeps to be taken (that is, the minimum time step size) if automatic time
stepping is used. The program automatically determines the default based on the physics of the
model.
NSBMN
Minimum number of substeps to be taken (that is, the maximum time step size) if automatic time
stepping is used. The program automatically determines the default based on the physics of the
model.
Carry
Time step carryover key (program-determined default depending on the problem physics):
OFF  Use NSBSTP to define time step at start of each load step.
ON   Use final time step from previous load step as the starting time step (if automatic time
     stepping is used).

Notes
See DELTIM (p. 533) for an alternative input. It is recommended that all fields of this command be
specified for solution efficiency and robustness.
When the arc-length method is active (ARCLEN (p. 178) command), the NSBMX and NSBMN arguments
are ignored.
```

## 4. LNSRCH — line search

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt — LNSRCH,Key,LSTOL,LStrun (lines ~45413-45457)

```
LNSRCH,Key,LSTOL,LStrun
Activates a line search to be used with Newton-Raphson.
SOLUTION (p.38):Nonlinear Options (p.40)

Key
Line search key:
OFF
Do not use a line search.
ON
Use a line search. Note, adaptive descent is suppressed when LNSRCH (p. 1093) is on unless
explicitly requested on the NROPT (p. 1305) command. Having line search on and adaptive
descent on at the same time is not recommended.
AUTO
The program automatically switches line searching ON and OFF between substeps of a load
step as needed. This option is recommended.

LSTOL
Line search convergence tolerance (default = 0.5).
LStrun
Truncation key for the line search parameter. Default = OFF, meaning no truncation. To activation
truncation, input the number of digits to use after the decimal point for the line search parameter.

Command Default
Line search off, unless contact elements are present.

Notes
Activates a line search to be used with the Newton-Raphson method (NROPT (p. 1305)). Line search is
an alternative to adaptive descent (see Line Search in the Theory Reference).
LNSRCH (p. 1093),AUTO can be very efficient for problems in which LNSRCH (p. 1093) is needed at only
certain substeps.
You cannot use line search (LNSRCH (p. 1093)), automatic time stepping (AUTOTS (p. 211)), or the DOF
solution predictor (PRED (p. 1526)) with the arc-length method (ARCLEN (p. 178), ARCTRM (p. 180)).
```

## 5. NROPT — Newton-Raphson option

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt — NROPT,Option1,Option2,Optval (lines ~53384-53442)

```
NROPT,Option1,Option2,Optval
Specifies the Newton-Raphson options in a static or full transient analysis.
SOLUTION (p.38):Nonlinear Options (p.40)

Option1
Option key:
AUTO
Let the program choose the option (default).
FULL
Use full Newton-Raphson.
MODI
Use modified Newton-Raphson.
INIT
Use the previously computed matrix (initial-stiffness).
UNSYM
Use full Newton-Raphson with unsymmetric matrices of elements where the unsymmetric
option exists.

Option2
Option key:
CRPL
When applicable in a static creep analysis, activates modified Newton-Raphson with a creep-
ratio limit. Valid only when Option1 = AUTO.

Optval
If Option2 is blank, Optval is the Adaptive Descent Key (Adptky):
ON
Use adaptive descent (default if frictional contact exists). Explicit ON is valid only if Option
= FULL.
OFF
Do not use adaptive descent (default in all other cases).

Notes
The NROPT (p. 1305) command specifies the Newton-Raphson option used to solve the nonlinear equations
in a static or full transient analysis.
...
NROPT (p. 1305),MODI and NROPT (p. 1305),INIT are only applicable with the sparse solver
(EQSLV (p. 673),SPARSE). Thermal analyses will always use full Newton-Raphson irrespective of the Op-
tion1 value selected.
See Newton-Raphson Option in the Structural Analysis Guide for more information.
```

## 6. Convergence criteria (CNVTOL) — default reference

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt — CNVTOL argument description (lines ~17716-17765, excerpt)

```
VALUE defaults to the maximum of a program calculated reference or MINREF. For degrees of
freedom, the reference is based upon the selected NORM and the current total degree-of-freedom
value. For forcing quantities, the reference is based upon the selected NORM and the applied loads.
If VALUE is ...
```

(The full CNVTOL entry defines NORM = NORM1/NORM2, tolerance TOLER, reference VALUE, and the
program-calculated reference for force-based (default) and displacement-based convergence norms.)

## 7. Working examples — nonlinear static beam/structure solves in APDL

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/models_examples/mwe_run_stackline/stackline_code_ANSYS_beam.txt — full solution section (lines 50-68)

Large-deflection (cable-like) beam example using BEAM189, with automatic time stepping, generous bisection window and line search:

```apdl
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
NSUBST,50,500,10        ! More substeps for the force application
AUTOTS,1
LNSRCH,ON
FK,2,FY,Ftest
SOLVE
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/td-40/actuator_beam_input.dat — nonlinear static beam example with unsymmetric NR and relaxed convergence (lines 97-120)

```apdl
/SOLU
NLGEOM,On
NROPT,unsym
NSUBST,150,5000,50
OUTRES,ALL,ALL

Time,1
Tunif,250
F,2,Fz,1830
SOLVE

Time,2
CNVTOL,M,,0.01
Tunif,400
SOLVE

Time,3
Tunif,250
SOLVE
finish
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/td-31/fit_chaboche_combined.dat — nonlinear structural solve pattern (lines 98-136, excerpt)

```apdl
/solu
NLGEOM,ON
nls=20    ! number of substeps per solve
NSUBST,NLS,NLS,NLS
OUTRES,ALL,ALL
...
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/td-35/structural.dat — automatic time stepping in a load step (lines 328-371, excerpt)

```apdl
/com Load step-6 increase temperature to 125'C
autots,on
outres,all,-50
allsel,all
time,1350
!nsubst,nsub,nsub*100,nsub/10
nsubst,nsub,nsub,nsub
allsel,all
kbc,0
...
```

## 8. Theory notes

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt — automatic load stepping mechanism (lines ~29019-29103, excerpt)

```
An important point to be made here is that automatic loading always works through the adjustment
of the time-step size; and that the loads that are applied are automatically adjusted if ramped boundary
conditions are activated (using KBC,0). In other words the time-step size is always subjected to
...
Δtp = time increment based on the allowable plastic-strain increment. The limit is set at 5
percent per time step.
Δtm = time increment limited by the middle step residual tolerance (described below) for
second-order systems (such as structural dynamics) (MIDTOL). ...
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt — adaptive descent parameter (lines ~30203-30240, excerpt)

```
ξ = descent parameter
The program adaptively adjusts the descent parameter (ξ) during the equilibrium iterations as follows:
1. Start each substep using the tangent matrix (ξ = 0).
2. Monitor the change in the residual ||{R}||2 over the equilibrium iterations:
   If it increases (indicating possibl...
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt — line search vs adaptive descent (lines ~13988-14029, excerpt)

```
is detected. Because the line search algorithm is intended to be an alternative to the adaptive
descent option (NROPT), adaptive descent is not automatically activated if the line search option
is on. We do not recommend activating both line search and adaptive descent simultaneously.
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt — arc-length option for bifurcation (lines ~12935-12984, excerpt)

```
to another stable configuration. For such situations, you can activate an alternative iteration scheme,
the arc-length method, to help avoid bifurcation points and track unloading.
The arc-length method causes the Newton-Raphson equilibrium iterations to converge along an arc,
thereby often preve...
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt — Nonlinear Options command table (lines ~2930-2979, excerpt)

```
Table 2.49: Nonlinear Options
These SOLUTION commands define options for nonlinear analyses.
Activates the arc-length method.
ARCLEN (p. 178)
Controls termination of the solution when the arc-length ...
```
</rag-context>