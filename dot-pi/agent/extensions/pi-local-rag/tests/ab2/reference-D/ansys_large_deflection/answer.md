

# Context: Nonlinear large-deflection static structural analysis (ANSYS Mechanical APDL)

Corpus: `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_ANSYS\` (Release 2026 R1). Note: in this corpus the commands `CNTOL`/`LSPRINT` are named **`CNVTOL`** (convergence values) and **`LNSRCH`** (line search); automatic time stepping is **`AUTOTS`** (not the legacy `AUTOTIME`).

---

## 1. Procedure for a nonlinear static analysis

- "The procedure for performing a nonlinear static analysis consists of these tasks: 8.6.1 Building the Model, 8.6.2 Setting Solution Controls, 8.6.3 Setting Additional Solution Options, 8.6.4 Applying Loads, 8.6.5 Solving the Analysis, 8.6.6 Reviewing the Results, 8.6.7 Terminating and Restarting a Running Job. The procedure uses traditional forward solving but can also be applied to inverse solving."
  — `Main_documentation_ANSYS\ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt` (section 8.6, p. 280)

- "A static analysis can be either linear or nonlinear. All types of nonlinearities are allowed - large deformations, plasticity, creep, stress stiffening, contact (gap) elements, hyperelastic elements, and so on." (section 2.1)
  — même fichier (Structural Analysis Guide)

- "A nonlinear solution differs from a linear solution in that it often requires multiple load increments, and always requires equilibrium iterations." (8.6.1)
  — Structural Analysis Guide

- "The program gives you a number of choices when you designate convergence criteria: you can base convergence checking on forces, moments, displacements, or rotations, or on any combination of these items. Additionally, each item can have a different convergence tolerance value. For multiple-degree-of-freedom problems, you also have a choice of convergence norms. You should almost always employ a force-based (and, when applicable, moment-based) convergence tolerance. Displacement-based (and, when applicable, rotation-based) convergence checking can be added, if desired, but should usually not be used alone." (8.3)
  — Structural Analysis Guide

- Niveaux de hiérarchie: "The 'top' level consists of the load steps … Within each load step, you can direct the program to perform several solutions (substeps or time steps) to apply the load gradually. At each substep, the program performs a number of equilibrium iterations to obtain a converged solution." (8.3)
  — Structural Analysis Guide

## 2. NLGEOM — activation de la grande déflexion

Syntaxe : `NLGEOM,Key`
- `OFF` : "Ignores large-deflection effects (that is, a small-deflection analysis is specified). This option is the default."
- `ON` : "Includes large-deflection (large rotation) effects or large strain effects, according to the element type."
- Notes : "Large-deflection effects are categorized as either large deflection (or large rotation) or large strain, depending on the element type. These are listed (if available) under Special Features in the input data table for each element in the Element Reference. When large-deflection effects are included (NLGEOM,ON), stress stiffening effects are also included automatically. If used during the solution (/SOLU), this command is valid only within the first load step."
- "In a large-deflection analysis, pressure loads behave differently than other load types. … see Load Direction in a Large-Deflection Analysis."
  — `Main_documentation_ANSYS\Ansys_Mechanical_APDL_Command_Reference.txt` (NLGEOM, p. 1273)

- "When setting ANTYPE and NLGEOM, select … Large Displacement Static if you expect large deflections (as in the case of a long, slender bar under bending) or large strains (as in a metal-forming problem)." (2.2.2.2, Basic tab)
  — Structural Analysis Guide
- "When setting ANTYPE and NLGEOM, choose Large Displacement Static if you are performing a new analysis. … You cannot change this setting after the first load step (that is, after issuing the first SOLVE command)." (8.6.2.1)
  — Structural Analysis Guide

### 8.4 Using Geometric Nonlinearities (théorie grande déformation)
- "In contrast, large-strain analyses account for the stiffness changes that result from changes in an element's shape and orientation. NLGEOM,ON activates large-strain effects supported element types. The large-strain feature is available in most of the solid elements … and in most shell and beam elements. The large-strain procedure places no theoretical limit on the total rotation or strain experienced by an element. … the total load should be broken into smaller steps."
- 8.4.1 Stress-Strain : "In large-strain solutions, all stress-strain input and results are in terms of true stress and true (or logarithmic) strain."
- 8.4.1.1 : "Large Deflections with Small Strain — This feature is available in all beam and most shell elements, as well as in a number of the nonlinear elements. Issue the NLGEOM,ON command to activate large-deflection effects for those elements that are designed for small strain analysis types that support this feature."
- 8.4.2 Stress Stiffening : "For most elements, initial stiffness effects are automatically included when large-deformation effects are activated (NLGEOM,ON)."
- 8.6.3.1.1 : "To account for buckling, bifurcation behavior, the program includes stress stiffness in all geometrically nonlinear analyses (NLGEOM,ON)."
  — Structural Analysis Guide (pp. 263–264, 285)

### Direction des charges en grande déflexion (8.3.3)
- "Accelerations and concentrated forces maintain their original orientation, regardless of the element orientation. Pressure loads always act normal to the deflected element surface, and can be used to model 'following' forces. … Nodal coordinate system orientations are not updated in a large deflection analysis. Calculated displacements are therefore output in the original directions."
  — Structural Analysis Guide

## 3. ANTYPE, TIME, NSUBST, DELTIM, KBC — type d'analyse et découpage en sous-pas

- `ANTYPE,Antype,Status,LDSTEP,SUBSTEP,Action,--,PRELP` ; `STATIC or 0 : Perform a static analysis.` ; Command Default: "New static analysis."
  — Command Reference (ANTYPE, p. 165)
- `TIME` (Basic Analysis Guide 3.6.1.1) : "In other, rate-independent analyses, time acts as a tracking parameter. … If you do not issue the TIME command at all, the program uses the default time value: 1.0 for the first load step, and 1.0 + previous time for other load steps."
  — `Main_documentation_ANSYS\ANSYS_Mechanical_APDL_Basic_Analysis_Guide.txt`

`NSUBST,NSBSTP,NSBMX,NSBMN,Carry` (Command Reference, p. 1331)
- "Specifies the number of substeps to be taken this load step."
- `NSBSTP` : "Number of substeps to be used for this load step. If automatic time stepping is used (AUTOTS), NSBSTP defines the size of the first substep."
- `NSBMX` : "Maximum number of substeps to be taken (that is, the minimum time step size) if automatic time stepping is used."
- `NSBMN` : "Minimum number of substeps to be taken (that is, the maximum time step size) if automatic time stepping is used."
- `Carry` : `ON` = "Use final time step from previous load step as the starting time step (if automatic time stepping is used)."
- Notes : "It is recommended that all fields of this command be specified for solution efficiency and robustness. … Changing the number of substeps upon restarting an analysis during a load step is not recommended. You should only change the number of substeps between load steps."

`DELTIM,DTIME,DTMIN,DTMAX,Carry,ForceKey` (Command Reference, p. 533)
- "Specifies the time step sizes to be used for the current load step. … DTIME : Time step size for this step. If automatic time stepping is used (AUTOTS), DTIME is the starting time substep."
- "For solution efficiency, specify values for all fields of this command."

- Basic Analysis Guide 3.6.1.2 : "For a nonlinear or transient analysis, specify the number of substeps to be taken within a load step via the DELTIM and NSUBST commands. … By default, the program uses one substep per load step."
- Structural Guide 8.6.2.1 : "The NSUBST and DELTIM commands both achieve the same effect (establishing a load step's starting, minimum, and maximum step size), but by reciprocal means. … If automatic time-stepping is off (AUTOTS), then the starting substep size is used throughout the load step."
- KBC (Basic Analysis Guide 3.6.1.4) : "KBC,0 indicates ramped loads, and KBC,1 indicates stepped loads. The default depends on the discipline and type of analysis."

## 4. AUTOTS — automatic time stepping

`AUTOTS,Key` (Command Reference, p. 211)
- `OFF` : "Do not use automatic time stepping." / `ON` : "Use automatic time stepping (default)." / `AUTO` : "The program determines whether to use automatic time stepping (used by Workbench)."
- Command Default : "Automatic time stepping is on by default."
- Notes : "Specifies whether to use automatic time stepping (or load stepping) over this load step. If Key = ON, both time step prediction and time step bisection will be used."
- "You cannot use automatic time stepping (AUTOTS), line search (LNSRCH), or the DOF solution predictor (PRED) with the arc-length method (ARCLEN, ARCTRM). … le programme désactive vos réglages et le pas de temps est contrôlé par la méthode arc-length."

Structural Guide 8.6.2.3.1 (Automatic Time-Stepping) :
- "Automatic solution control enables automatic time-stepping (AUTOTS,ON). An internal auto-time-step scheme ensures that the time-step variation is neither too aggressive (resulting in many bisection/cutbacks) nor too conservative (time-step size is too small). At the end of a time step, the size of the next time step is predicted based on: Number of equilibrium iterations used in the last time step – more iterations cause the time-step size to be reduced; Predictions for nonlinear element status change; Size of the plastic strain increment; Size of the creep strain increment."

Basic Analysis Guide 3.6.1.3 : "In automatic time stepping, the program calculates an optimum time step at the end of each substep, based on the response of the structure or component to the applied loads. When used in a nonlinear static (or steady-state) analysis, AUTOTS determine the size of load increments between substeps."

Bisection (Structural Guide 8.3.2) : "Automatic time-stepping activates the bisection feature. Bisection provides a means of automatically recovering from a convergence failure. This feature cuts a time-step size in half whenever equilibrium iterations fail to converge and automatically restart from the last converged substep. … continuing the process until convergence is achieved or until the minimum time-step size (specified by you) is reached."

Guideline 8.12.2.4 : "Place an upper limit on the time-step size (DELTIM or NSUBST), especially for complicated models. Doing so ensures that all of the modes and behaviors of interest are accurately included."

## 5. NROPT — Newton-Raphson

`NROPT,Option1,Option2,Optval` (Command Reference, p. 1305)
- `AUTO` : "Let the program choose the option (default)."
- `FULL` : "Use full Newton-Raphson."
- `MODI` : "Use modified Newton-Raphson."
- `INIT` : "Use the previously computed matrix (initial-stiffness)."
- `UNSYM` : "Use full Newton-Raphson with unsymmetric matrices of elements where the unsymmetric option exists."
- `Optval` (Adptky) : `ON` = "Use adaptive descent (default if frictional contact exists). Explicit ON is valid only if Option = FULL." / `OFF` = "Do not use adaptive descent (default in all other cases)."
- "NROPT,MODI and NROPT,INIT are only applicable with the sparse solver (EQSLV,SPARSE). Thermal analyses will always use full Newton-Raphson irrespective of the Option1 value selected."

Structural Guide 8.6.3.1.2 (Newton-Raphson Option) :
- "Automatic solution control uses the FULL Newton-Raphson option (NROPT) with adaptive descent off if there is a nonlinearity present. However, when node-to-node, node-to-surface contact elements are used for contact analysis with friction, then adaptive descent is automatically turned on."
- "The default behavior (NROPT,AUTO) enables the program to decide based on the kinds of nonlinearities present in your model, and adaptive descent is activated automatically when appropriate."
- `FULL` : "The program uses the full Newton-Raphson procedure, in which the stiffness matrix is updated at every equilibrium iteration. If adaptive descent is on … the program discards the divergent iteration and restarts the solution, using a weighted combination of the secant and tangent stiffness matrices. … Activating adaptive descent (NROPT,FULL,,ON) usually enhances the program's ability to obtain converged solutions for complicated nonlinear problems."
- `MODI` : "tangent stiffness matrix is updated at each substep. … This option is not applicable to large-deformation analyses. Adaptive descent is not available."
- `INIT` : "initial stiffness matrix in every equilibrium iteration. … not applicable to large-deformation analyses."
- `UNSYM` : "generates and uses unsymmetric matrices … You should first try NROPT,FULL, then try NROPT,UNSYM if you experience convergence difficulties."
- "If a multistatus element is in the model, it is updated at the iteration in which it changes status, irrespective of the Newton-Raphson option."

Structural Guide 2.2.3.2 : "Use the Newton-Raphson option (NROPT) only in a nonlinear analysis. This option specifies how often the tangent matrix is updated during solution. You can specify one of these values: Program-chosen (default), Full, Modified, Initial stiffness, Full with unsymmetric matrix."

Theory Reference (14.10.4, `ANSYS_Mechanical_APDL_Theory_Reference.txt` p. 757) : "Adaptive descent is used by default in these cases unless the line search or arc-length options are on. It is only available with full Newton-Raphson, where the matrix is updated every iteration. Full Newton-Raphson is also the default for plasticity, contact and large strain nonlinearities."

## 6. LNSRCH — line search

`LNSRCH,Key,LSTOL,LStrun` (Command Reference, p. 1093)
- "Activates a line search to be used with Newton-Raphson."
- `OFF` : "Do not use a line search."
- `ON` : "Use a line search. Note, adaptive descent is suppressed when LNSRCH is on unless explicitly requested on the NROPT command. Having line search on and adaptive descent on at the same time is not recommended."
- `AUTO` : "The program automatically switches line searching ON and OFF between substeps of a load step as needed. This option is recommended."
- `LSTOL` : "Line search convergence tolerance (default = 0.5)."
- `LStrun` : "Truncation key for the line search parameter. Default = OFF, meaning no truncation."
- Command Default : "Line search off, unless contact elements are present."

Structural Guide 8.6.2.3.5 (Line Search Option) :
- "Automatic solution control toggles line search on and off as needed. For most contact problems, LNSRCH is toggled on. For most non-contact problems, LNSRCH is toggled off."
- "This convergence-enhancement tool multiplies the calculated displacement increment by a program-calculated scale factor (having a value between 0 and 1), whenever a stiffening response is detected. Because the line search algorithm is intended to be an alternative to the adaptive descent option (NROPT), adaptive descent is not automatically activated if the line search option is on. We do not recommend activating both line search and adaptive descent simultaneously."
- "When an imposed displacement exists, a run cannot converge until at least one of the iterations has a line search value of 1. … Until one of the iterations has a line search value of 1, the program does not impose the full value of the displacement."

Guideline 8.12.2.5 (Line Search) : "Line search (LNSRCH) can be useful for enhancing convergence, but it can be expensive (especially with plasticity). You might consider setting line search on in the following cases: When your structure is force-loaded (as opposed to displacement-controlled); If you are analyzing a 'flimsy' structure which exhibits increasing stiffness (such as a fishing pole); If you notice (from the program output messages) oscillatory convergence patterns."

Theory Reference 14.10.5 : "The line search option (accessed with LNSRCH command) attempts to improve a Newton-Raphson solution {Δui} by scaling the solution vector by a scalar value termed the line search parameter. … s = line search parameter, 0.05 < s < 1.0 … s is automatically determined by minimizing the energy of the system … (schéma itératif based on regula falsi) … LSTOL defaults to 0.5 … If go > 0.0, no iterations are performed and s is set to 1.0. s is not allowed below 0.05. The line search algorithm is very susceptible to round-off errors (Crisfield). Truncation of gs can help solution repeatability (see LStrun on LNSRCH)."
  — `Main_documentation_ANSYS\ANSYS_Mechanical_APDL_Theory_Reference.txt` (p. 758)

## 7. PRED — prédicteur DOF

`PRED,Sskey,--,Lskey` (Command Reference, p. 1526)
- "Activates a predictor in a nonlinear analysis."
- `AUTO` : "The program uses a predictor but, within certain exceptions, automatically switches prediction off. This behavior is the default."
- `OFF` : "No prediction occurs." / `LINEAR (or ON)` : "Use the linear predictor on all substeps after the first." / `QUADRATIC` : "Use the quadratic predictor on all substeps after the second."
- Notes : "When performing a nonlinear analysis involving large rotations, the predictor may require using smaller substeps. If the model has rotational degrees-of-freedom, the quadratic predictor could work more efficiently than the linear predictor."

Structural Guide 8.6.2.3.4 : "Automatic solution control activates a predicator (PRED,ON). If the time-step size is reduced greatly in the current substep, PRED is deactivated. … Le linear extrapolation est based on l'increment de displacement accumulé sur le pas précédent, le quadratic sur les deux pas précédents. Le quadratic prédit mieux pour les solutions avec DOF rotationnels (ROTX, ROTY, ROTZ)."

## 8. CNVTOL — convergence criteria

`CNVTOL,Lab,VALUE,TOLER,NORM,MINREF` (Command Reference, p. 412)
- "Sets convergence values for nonlinear analyses."
- Labels structure : force convergence `F` (Forces), `M` (Moments), `DVOL` (Volume), `HDSP` (Hydrostatic Pressure), `ENGY` (Energy Error) ; displacement convergence `U` (Displacements), `ROT` (Rotations), `JOINT`, `COMP`.
- `VALUE` : "Typical reference value for the specified convergence label. VALUE defaults to the maximum of a program calculated reference or MINREF. … If VALUE is negative, the convergence criterion based on the specified label is removed."
- `TOLER` defaults : "0.05 (5%) for displacement (U). … 0.05 for energy error (ENGY). … For all other Lab labels, the default tolerance value is 0.005 (0.5%)." Et si CNVTOL n'est pas émis : "0.005 (0.5%) for force (F) and moment (M); 1.0E-4 (0.01%) for volume (DVOL); 0.05 (5%) for displacement (U)."
- `NORM` : `0` = Infinite norm (default for Lab = U) ; `1` = L1 norm ; `2` = "L2 norm (check SRSS value) (default, except for Lab = U)" ; `3` = Infinite norm based on current displacement increment (Lab = U uniquement).
- `MINREF` : default "maximum of 0.01 or internally calculated minimum reference value for force (F), moment (M)".
- Command Default : "For static or transient analysis, check the out-of-balance load for any active degree of freedom using the default VALUE, TOLER, NORM, and MINREF. Also check the translational displacement convergence in most cases. … The energy criterion convergence check is off by default."
- Notes : "This command is usually not needed because the default convergence criteria are sufficient for most nonlinear analyses. In rare cases, you may need to use this command to diagnose convergence difficulties."
- "If CNVTOL is not issued for any force convergence label (F, M, DVOL…), the default convergence tolerance for a particular force label is increased dynamically during the Newton-Raphson iterations in the range of 1 to 1.66 times the default value. For example, the F label default tolerance is 0.005. Therefore, the maximum convergence tolerance with the adjustment is 0.0083. This adjustment is not activated until the 8th or higher Newton-Raphson iteration. If you do not want the program to adjust the tolerance, issue CNVTOL to specify the convergence tolerance."
- "The energy convergence check (ENGY) is not available when the arc-length method (ARCLEN,ON) is used."

Structural Guide 8.6.2.3.2 (Convergence Criteria) :
- "The program continues to perform equilibrium iterations until the convergence criteria (CNVTOL) are satisfied (or until the maximum number of equilibrium iterations is reached (NEQIT)). You can define specific criteria if the default settings are not suitable; however, changes to the default criteria are rarely needed."
- "The automatic solution convergence check uses the L2-norm of force (and moment) with a tolerance (TOLER) equal to 0.5% … In most cases, an infinite norm check on displacement with TOLER equal to 5% is also used in addition to the force convergence check. The check that the displacements are loosely set serves as a double-check on convergence."
- "By default, the program checks for force … convergence by comparing the square root sum of the squares (SRSS) of the force imbalances against the product of VALUE*TOLER. The default value of VALUE is the SRSS of the applied loads or MINREF (which defaults to 0.01), whichever is greater."
- "You should almost always use force convergence checking. … In general, you should continue to use the default value of VALUE; that is, change the convergence criteria by adjusting TOLER, not VALUE. You should make certain that the default value of MINREF = 0.01 makes sense in the context of your analysis."
- Norms : "The infinite norm repeats the single-degree-of-freedom check at each DOF … The L1 norm compares … contre la somme des valeurs absolues … The L2 norm … SRSS … Normally, if an analysis converges in one norm, it will converge in the other norms. The default norm check is recommended."

Theory Reference 14.10.2 (Convergence) :
- "Convergence is assumed when ||{R}|| < εR Rref and/or ||{Δui}|| < εu uref, where {R} is the residual vector … Le default est out-of-balance convergence checking only."
- "The default out-of-balance reference value Rref is ||{Fa}||. For DOFs with imposed displacement constraints, the default Rref value is {Fnr} at those DOFs."
- "If the reference value Rref falls below a minimum reference value specified by CNVTOL,,,,,MINREF, then Rref is replaced by the minimum reference value. … Minimum reference is typically useful for problems with almost no external loading."
- "There are three available norms (CNVTOL,,,,NORM) … Le default est de utiliser the L2 norm."
- "The default reference value uref is calculated using the historic infinity norm of incremental displacement."

## 9. NEQIT — nombre max d'itérations d'équilibre

`NEQIT,NEQIT,FORCEkey` (Command Reference, p. 1254)
- "Specifies the maximum number of equilibrium iterations for nonlinear analyses."
- Command Default : "The maximum number of equilibrium iterations per substep is set between 15 and 26, depending on the physics of the problem."

Structural Guide 8.6.2.3.3 : "Automatic solution control sets the value of NEQIT to between 15 and 26 iterations, depending upon the physics of the problem. The idea is to use a small time step with fewer quadratically converging iterations. … If the convergence criteria have not been satisfied within this number of equilibrium iterations, and if auto time-stepping is on (AUTOTS), the program attempts to bisect. If bisection is not possible, then the analysis either terminates or moves on to the next load step (according to NCNV command settings)."

## 10. CUTCONTROL — cutback / bisection

`CUTCONTROL,Lab,Value,Option` (Command Reference, p. 462) — "Controls time-step cutback during a nonlinear solution."
- `PLSLIMIT` : "Maximum equivalent plastic strain allowed within a time-step (substep). … Default: Value = 0.15 (15 percent). If CUTCONTROL with Lab = PLSLIMIT is not issued, le minimum time step est atteint, et la limite est dépassée, the program generates a warning and continues the Newton iterations. Si elle est émise : the program generates an error and stops the Newton iterations."
- `DSPLIMIT` : max DOF increment (default 1.0E7) ; `ROTLIMIT` : max rotation DOF increment (default 1.0E7) ; `ULIMIT` : max translation DOF increment (default 1.0E7).
- `CUTBACKFACTOR` : "Key to set the cutback factor, a multiplier for reducing the time step interval to the fraction specified in Value, where 0 < Value < 1 (default is 0.5 if Value is not specified.) … valid only when automatic time stepping is on (AUTOTS,ON)."
- `NOITERPREDICT` : "If Value = 0 (default), the program predicts the number of iterations for nonlinear convergence and performs a cutback earlier than the number of iterations specified (NEQIT). This is the recommended option."

Structural Guide 8.6.2.3.6 (Cutback Criteria) : "For finer control over bisections and cutback in time-step size, use (CUTCONTROL, Lab, Value, Option). By default, for Lab = PLSLIMIT (maximum plastic strain increment limit), Value is set to 15 percent. … A number of points per cycle for second order dynamic equations (Lab = NPOINT) is set to Value = 13 (by default) for linear analysis, and Value = 5 (by default) for nonlinear analysis."

## 11. NCNV — conditions de terminaison

`NCNV,KSTOP,DLIM,ITLIM,ETLIM,CPLIM` (Command Reference, p. 1250)
- `KSTOP` : `0` = "Do not terminate the analysis if the solution fails to converge." ; `1` = "Terminate the analysis and the program execution if the solution fails to converge (default)." ; `2` = "Terminate the analysis, but not the program execution."
- `DLIM` : "Terminates program execution if the largest nodal DOF solution value exceeds this limit. Defaults to 1.0E6 …" ; `ITLIM` (cumulative iterations, default infini) ; `ETLIM`/`CPLIM` (temps, infini).
- Basic Analysis Guide 3.6.3 (Table 3.14) : "Specifies the maximum number of equilibrium iterations per substep : NEQIT ; Specifies convergence tolerances : CNVTOL ; Provides options for terminating analyses : NCNV."
  — `Main_documentation_ANSYS\ANSYS_Mechanical_APDL_Basic_Analysis_Guide.txt`

## 12. STABILIZE — stabilisation nonlinéaire (instabilité, structures élancées)

`STABILIZE,Key,Method,VALUE,SubStpOpt,FORCELIMIT,RECALCDAMP` (Command Reference, p. 1929)
- "Activates stabilization for all elements that support nonlinear stabilization."
- `Key` : `OFF` (default) / `CONSTANT` = "Activate stabilization. The energy-dissipation ratio or damping factor remains constant during the load step." / `REDUCE` = "… is reduced linearly to zero at the end of the load step."
- `Method` : `ENERGY` (default) = "Use the energy-dissipation ratio as the control." ; `DAMPING` = "Use the damping factor as the control."
- `SubStpOpt` : `NO` (default) / `MINTIME` / `ANYTIME`.
- `FORCELIMIT` : "The stabilization force limit coefficient, such that 0 < FORCELIMIT < 1. The default value is 0.2."
- Notes : "For the energy dissipation ratio, specify VALUE = 1.0e-4 if you have no prior experience with the current model; if convergence problems are still an issue, increase the value gradually."
- Exemples cités : "Buckling and Post-Buckling Analysis of a Ring-Stiffened Cylinder Using Nonlinear Stabilization ; Underconstrained Coil Spring Under Compression …"

Structural Guide 8.11 (Unstable Structures) :
- "A structure can become unstable when a load reaches its buckling value or when nonlinear material becomes unstable. It is more common in slender structures than in bulky structures. The instability could be global (such as a snap-through of a plate) or local (such as failure of a stiffener). Instability problems usually pose convergence difficulties and therefore require the application of special nonlinear techniques." — Techniques : "Nonlinear stabilization (p. 303) — A tool for dealing with local instabilities as well as global instability. You can use it together with nearly any other nonlinear solution technique, such as line search and automatic time-stepping (although not with the arc-length method). Arc-length method (p. 308) — … peut simuler la portion à pente négative de la courbe charge-déplacement. Running a static problem as a 'slow dynamic' analysis …"
- 8.11.1.1.1 : "L'énergie dissipation ratio doit être entre 0 et 1. … Generally, use a smaller value for local instability and a larger value for global instability. The smaller value should be used for solid elements and the larger value should be used for shell, beam, and link elements."
- 8.11.1.3 Tips : "Although you can activate nonlinear stabilization at the beginning of the solution, it is more efficient and accurate in most cases to activate stabilization in a multiframe restart. … restart from the next-to-last converged substep … (The program needs one substep to prepare the data for stabilization). Be aware that when stabilization is active, the results could vary if the number of substeps changes."
- 8.11.1.2 Checking : "If the stabilization energy … is much less than the potential energy (for example, within a 1.0 percent tolerance), the result should be acceptable …"

Guideline 8.12.2.6 : "You can use the nonlinear stabilization method to solve both locally and globally unstable problems, and to overcome convergence for general problems."

## 13. ARCLEN / ARCTRM — méthode arc-length (alternative)

`ARCLEN,Key,MAXARC,MINARC` (Command Reference, p. 178)
- "Activates the arc-length method." `OFF` (default) / `ON`. `MAXARC` default = 25 ; `MINARC` default = 1/1000.
- "The initial arc-length radius, t0, is proportional (in absolute value) to the initial load factor. The initial load factor is given by: Initial Load Factor = TIME / NSBSTP"
- "The arc-length method predicts the next time increment (that is, load factor increment). Therefore, the AUTOTS and PRED commands are ignored when the arc-length method is used. The STABILIZE and LNSRCH commands are also ignored."
- "The arc-length method can only be used with the sparse solver (EQSLV,SPARSE). … The arc-length method cannot be used in a multiframe restart."
- "For difficult problems, one suggestion is to increase the initial number of substeps (NSUBST), and to prevent the arc-length radius from increasing too rapidly (MAXARC = 1)."

`ARCTRM,Lab,VAL,NODE,DOF` (p. 180) : `L` = "Terminates the analysis if the first limit point has been reached." ; `U` = terminaison par déplacement (radians pour ROT).

Structural Guide 8.11.2 : "The arc-length method (ARCLEN and ARCTRM) is another way to solve unstable problems. This method is restricted to static analyses with proportional (ramped) loads only. … When the arc-length method is active, do not use line search (LNSRCH), the predictor (PRED), adaptive descent (NROPT,,,ON), automatic time-stepping (AUTOTS, DELTIM), or time-integration effects (TIMINT). Likewise, do not try to base convergence on displacement (CNVTOL,U); instead, use the force criteria (CNVTOL,F). … If an arc-length solution fails to converge within the prescribed maximum number of iterations (NEQIT), the program automatically bisects and continues … You can freely switch from the Newton-Raphson iteration method to the arc-length method at the start of any load step. Cependant, pour passer de arc-length à NR, il faut terminate + restart avec ARCLEN,OFF."

## 14. Résolution d'un cas de convergence — guidelines 8.12

- 8.12.1.4 : "For nonconservative, path-dependent systems, you need to apply the load in small enough increments to ensure that your analysis closely follows the structure's load-response curve. You can sometimes improve the convergence behavior of conservative systems by applying the load gradually, so as to minimize the number of Newton-Raphson equilibrium iterations required."
- 8.12.2.1 : "CHECK, MCHECK, and CNCHECK commands help you verify if there are any obvious problems with the model before you start the solution. … ESCHECK … deformed element shape checking …"
- 8.12.2.2 Nonlinear diagnostics : "Issue the NLDIAG,NRRE command to write the Newton-Raphson residuals from equilibrium iterations to a file (Jobname.nrxxx). You can then contour plot the residual forces via the PLNSOL,NRRE command. … NLDIAG,EFLG command identifies elements that violate the above criteria (Too large a distortion ; nodes avec pivots quasi nuls ; trop grande incrément de plasticité/creep ; mixed u-P non satisfait ; …) et les enregistre dans Jobname.ndxxx. … Issue the NLDPOST command to process the .ndxxx files. … NLDIAG,CONT … Jobname.cnd."
- 8.6.3.2.3 Solution Monitoring : "MONITOR a solution value at a specified node … NLHIST command enables you to monitor results of interest in real time during solution. … Les données sont écrites dans Jobname.nlh. For example, a reaction force-deflection curve could indicate when possible buckling behavior occurs."
- 8.12.2.12 : "In particular, do not dismiss any program error or warning statements without fully understanding their meaning. A typical nonlinear output listing est montré (Figure 8.22) avec lignes 'AUTOMATIC TIME-STEPPING … ON', 'INITIAL NUMBER OF SUBSTEPS … 100', 'MAXIMUM NUMBER OF SUBSTEPS … 10000', 'MINIMUM NUMBER OF SUBSTEPS … 10', 'MAXIMUM NUMBER OF EQUILIBRIUM ITERATIONS … 15', 'LINE SEARCH PARAMETER = 1.000', 'FORCE CONVERGENCE VALUE = … CRITERION= …', '>>> SOLUTION CONVERGED AFTER EQUILIBRIUM ITERATION 4'."
- 8.6.2.2.1 Equation Solver : "Automatic solution control activates the sparse direct solver (EQSLV,SPARSE) for most cases. … If it is a beam/shell or beam/shell and solid structure, use the sparse direct solver. … If the problem is ill-conditioned (poor element shapes), … has insufficient displacement boundary constraints, use the sparse direct solver."
  — Structural Analysis Guide

## 15. RESTART (multiframe) + RESCONTROL / OUTRES

`RESCONTROL,Action,Ldstep,Frequency,MAXFILES,--,MAXTotalFiles,Filetype` (Command Reference, p. 1649)
- "Controls file writing for multiframe restarts." `DEFINE` : "Specifies how often .xnnn restart files (default) … are written for a load step."
- Exemple de forme : `RESCONTROL,DEFINE,ALL,1` (écriture des .xnnn à chaque substep de tous les load steps).

`OUTRES,Item,Freq,Cname,--,NSVAR,DSUBres` (p. 1382). Structural Guide 8.6.2.1 : "The OUTRES command controls the data on the results file (Jobname.rst). By default, only the last substep is written to the results file in a nonlinear analysis."
- `ANTYPE,,RESTART,LDSTEP,SUBSTEP,Action` (Action = CONTINUE default / ENDSTEP / RSTCREATE / PERTURB) — Command Reference p. 165–168.

## 16. SOLOPTION — transition automatique statique↔transitoire (alternative pour snap-through)

`Main_documentation_ANSYS\ANSYS_Mechanical_APDL_Advanced_Analysis_Guide.txt` (chapter 3, pp. 37–40) :
- "Use the SOLOPTION command to activate the automatic transition from a static to a transient solution: SOLOPTION, Option, Type, Value. Options : STOT / TTOS / TTOT."
- "The analysis involves snap-through of a slender beam under pressure. A static solution will have difficulty converging for this model at the point of snap-through. You might attempt to use nonlinear stabilization (STABILIZE) … A simpler way to achieve convergence is to implement the automatic solution transition. Only two SOLOPTION commands are needed beyond the typical input:
  ```
  soloption                   ! Transition to a quasi solution when the static solution fails to converge (default STOT,CONV,QUASI)
  soloption,ttos,time,0.1     ! Attempt a transition back to static solution after solving the transient for 0.1 sec
  ```
- "Since the procedure relies on the mass matrix and algorithmic damping … it is important to define density for all materials. … le default backward Euler time integration (SOLOPTION,STOT,,QUASI) est recommandé. Monitor the kinetic energy to potential energy ratio … should be a very small percentage (<1%) of the potential energy."

## 17. Exemples concrets dans le corpus

### a) td-21 — "Buckling and Post-buckling analysis of a ring-stiffened cylinder with Nonlinear Stabilization"
Fichier : `Exemples_ANSYS\td-21\buckling.dat` (SHELL281, Al 2024-T3, pression externe, imperfections modales)
```
/solu                              ! Run static analysis
antype,static
nlgeom,on                          ! Large deflection is activated
pred,on
time,1
nsubst,100,10000,10
rescontrol,define,all,1
outres,all,all
ncnv,2                             ! Do not terminate the program execution if the solution diverges
solve
finish

/solu                              ! Restart analysis with stabilization
antype,,restart,1,10
nsubst,100,50000,10
rescontrol,define,last
stabilize,constant,energy,0.00012  ! Use energy option
solve
fini
```
Avant : `pstres,on` + `antype,buckle` (lanbopt,,,BCS), puis `upgeom,0.1,1,i,buckling,rst` (imperfection = 1/10 des mode shapes) dans /PREP7.

### b) Showcase "Delamination of a Stiffened Composite Panel Under a Compressive Load" (td-5)
`Exemples_ANSYS\ANSYS_Mechanical_APDL_Technology_Showcase_Example_Problems.txt` (§5.6) : "A static analysis is performed. Large deflection effects are included (NLGEOM). To achieve a converged solution with this unstable problem, a constant stabilization energy dissipation ratio equal to 0.1 is included (STABILIZE). … le niveau de stabilization energy (STEN) est low compared to the total strain energy (SENE) …"

### c) Structural Guide 8.14 "Example: Nonlinear Analysis" (extrait commandes, p. 328–331)
```
/solve
nlgeom,on                    ! turn on geometric nonlinearity
monitor,1,ntop,uy
monitor,2,nright,fy
outres,all,all
...
nsub,10,50,5                 ! nsubsteps init/max/min pour auto time-stepping
solve
...
nsubst,4,25,2
solve
```
  — `Main_documentation_ANSYS\ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt`

### d) Showcase Ch. 23 — "Modal Analysis of a Wind Turbine Blade Using Beam Elements" (structures élancées en poutre)
`Exemples_ANSYS\ANSYS_Mechanical_APDL_Technology_Showcase_Example_Problems.txt` (pp. 361–372) ; `Exemples_ANSYS\Ansys-mechanical-apdl-technology-demonstration-guide.txt` (§ ~13408–13660).
- "This example problem demonstrates how to use beam elements to simulate the behavior of a slender composite structure such as a wind turbine blade."
- §23.8 Recommendations : "When applicable, use current-technology beam elements (such as BEAM188) … Verify that all modeling requirements, such as slenderness ratio and material orientation, are satisfied. Use the meshed beam-section subtype (SECTYPE,,BEAM,MESH) and/or the tapered-beam section type (SECTYPE,,TAPER) … Select higher-order interpolation options in BEAM188 if nonuniform deformation along the length is expected. … Select the nonaveraged results file format for proper postprocessing."

### e) Showcase "Bolt Thread Simulation" (NLGEOM en statique nonlinéaire, 2 load steps)
`Exemples_ANSYS\Ansys-mechanical-apdl-technology-demonstration-guide.txt` (§39.6) :
```
antype,static   !selecting analysis
nlgeom,on       !including geometric nonlinearity
```
"39.7. Results and Discussion …" (idem).

## 18. Post-proc & vérification de convergence (rappels utiles)

- "Verify from your output file (Jobname.out) whether or not the analysis converged at all load steps. If not, you probably do not want to postprocess the results, other than to determine why convergence failed." (Structural Guide 8.6.6.1/8.6.6.2)
- "In POST1, only one substep can be read in at a time, and that the results from that substep should have been written to Jobname.rst (OUTRES controls which substep results are stored)." (8.6.6)
- GST : "Le Graphical Solution Tracking (GST) feature displays the computed convergence norms and criteria while the solution is in process. By default, GST is ON for interactive sessions and OFF for batch runs. Use the /GST command to turn GST on or off." (8.12.2.3)
- OUTPR : `OUTPR,Item,Freq,Cname` — "Controls the solution printout." `Freq` : "Print solution for this item every Freqth (and the last) substep … If ALL, print every substep … If LAST, print only for the last substep …" (Command Reference p. 1378)

## 19. Synthèse des defaults "automatic solution control" pour un nonlinear static (source: Structural Guide 8.6)

| Paramètre | Default automatique | Commande |
|---|---|---|
| Analyse / grande déflexion | STATIC + Large Displacement | `ANTYPE,STATIC` / `NLGEOM,ON` |
| Solver | sparse direct | `EQSLV,SPARSE` |
| Newton-Raphson | FULL, adaptive descent off (on si contact friction) | `NROPT,AUTO` (ou `NROPT,FULL`) |
| Auto time stepping | ON (prédiction + bisection) | `AUTOTS,ON` |
| Pas de temps | NSUBST défini par l'utilisateur (tous champs recommandés) | `NSUBST,NSBSTP,NSBMX,NSBMN` |
| Prédicteur | PRED,ON (désactivé si pas réduit fortement) | `PRED` |
| Line search | on/off toggle automatique | `LNSRCH,AUTO` recommandé |
| Itérations max | 15–26 | `NEQIT` |
| Convergence | L2 force/moments TOLER 0.5% + inf-norm déplacement TOLER 5% (double check) | `CNVTOL` |
| Cutback plastique | PLSLIMIT 15% | `CUTCONTROL,PLSLIMIT,0.15` |
| Terminaison | KSTOP=1 (quitte le programme si non convergence) | `NCNV` |
| Stabilisation | OFF (à activer manuellement si instabilité) | `STABILIZE,CONSTANT,ENERGY,1.0e-4` (début) |
| Arc-length | OFF (alternative; incompatible avec AUTOTS/LNSRCH/PRED/STABILIZE/adaptive descent) | `ARCLEN,ON` |

## Sources principales (chemins complets)
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_ANSYS\Main_documentation_ANSYS\Ansys_Mechanical_APDL_Command_Reference.txt` (ANTYPE p.165, ARCTRM p.180, ARCLEN p.178, CNVTOL p.412, CUTCONTROL p.462, DELTIM p.533, LNSRCH p.1093, NCNV p.1250, NEQIT p.1254, NLGEOM p.1273, NROPT p.1305, NSUBST p.1331, OUTPR p.1378, OUTRES p.1382, PRED p.1526, AUTOTS p.211, RESCONTROL p.1649, STABILIZE p.1929)
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_ANSYS\Main_documentation_ANSYS\ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt` (Ch.2 Static: 2.2.2–2.2.3; Ch.8: 8.3 pp.259–262, 8.4 pp.263–264, 8.6 pp.280–290, 8.11 pp.302–309, 8.12 pp.310–319, 8.14 pp.328–332)
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_ANSYS\Main_documentation_ANSYS\ANSYS_Mechanical_APDL_Basic_Analysis_Guide.txt` (3.6.1.1–3.6.1.4 pp.63–66, 3.6.3 p.67)
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_ANSYS\Main_documentation_ANSYS\ANSYS_Mechanical_APDL_Theory_Reference.txt` (14.10.2 Convergence p.754, 14.10.3 Predictor p.756, 14.10.4 Adaptive Descent p.757, 14.10.5 Line Search p.758, 14.10.6 Arc-Length p.759)
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_ANSYS\Main_documentation_ANSYS\ANSYS_Mechanical_APDL_Advanced_Analysis_Guide.txt` (Ch.3 Solution Transition pp.37–40, example slender beam snap-through p.38)
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_ANSYS\Exemples_ANSYS\td-21\buckling.dat`
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_ANSYS\Exemples_ANSYS\ANSYS_Mechanical_APDL_Technology_Showcase_Example_Problems.txt` (Ch.5 §5.6, Ch.23)
- `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_ANSYS\Exemples_ANSYS\Ansys-mechanical-apdl-technology-demonstration-guide.txt` (Ch.23 beams, §39.6 bolt thread)
- Index des 72 exemples: `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_ANSYS\okf\examples\index.md` (td-5, td-21, td-23 les plus pertinents)