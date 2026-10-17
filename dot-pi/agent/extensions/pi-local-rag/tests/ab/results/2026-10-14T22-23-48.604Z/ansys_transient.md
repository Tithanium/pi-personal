<rag-context>
[pi-local-rag] RAG subagent: 13 sources, 340163 ms retrieval.
# Retrieval: Nonlinear full transient dynamic analysis in ANSYS Mechanical APDL

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt — §5.2 Two Solution Methods for Transient Analysis (lines 8129-8155)

Two methods are available for performing a transient dynamic analysis: full and mode-superposition.

5.2.1. Full Method for Transient Analysis
The full method uses the full system matrices to calculate the transient response (no matrix reduction). It is the more general method because it enables all types of nonlinearities to be included (plasticity, large deflections, large strain, and so on).

Note: If you do not want to include any nonlinearities, you should consider using the mode-superposition method because the full method is also the most expensive of the two.

The advantages of the full method are:
- It is easy to use, because you do not have to worry about choosing mode shapes.
- It accommodates all types of nonlinearities.
- It uses full matrices, so no mass matrix approximation is involved.
- All displacements and stresses are calculated in a single pass.
- It accepts all types of loads: nodal forces, imposed (nonzero) displacements (although not recommended), and element loads (pressures and temperatures) and accommodates tabular boundary condition specification via TABLE type array parameters.

5.2.2. Mode-Superposition Method (for contrast):
- The time step must remain constant throughout the transient, so automatic time stepping is not allowed.
- Nonlinearities are not allowed.
- It does not accept imposed (nonzero) displacements.

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt — §5.3 Performing a Full Transient Dynamic Analysis: Build the Model + Establish Initial Conditions (lines 8175-8296)

The procedure for a full transient dynamic analysis consists of these steps:
1. Build the Model
2. Establish Initial Conditions
3. Set Solution Controls
4. Set Additional Solution Options
5. Apply the Loads
6. Save the Load Configuration for the Current Load Step
7. Repeat Steps 3-6 for Each Load Step
8. Save a Backup Copy of the Database
9. Start the Transient Solution
10. Exit the Solution Processor
11. Review the Results

5.3.1. Build the Model
- You can use both linear and nonlinear elements.
- Both Young's modulus (EX) (or stiffness in some form) and density (DENS) (or mass in some form) must be defined. Material properties may be linear or nonlinear, isotropic or orthotropic, and constant or temperature-dependent.
- You can define damping using element damping, material damping and/or proportional damping ratios.
- If you are interested in wave propagation effects (for example, a bar dropped exactly on its end), the mesh should be fine enough to resolve the wave. A general guideline is to have at least 20 elements per wavelength along the direction of the wave.

5.3.2. Establish Initial Conditions
A transient analysis, by definition, involves loads that are functions of time. To specify such loads, you need to divide the load-versus-time curve into suitable load steps. Each "corner" on the load-time curve may be one load step.

The first step in applying transient loads is to establish initial conditions (that is, the condition at Time = 0). A transient dynamic analysis requires either two sets of initial conditions (because the equations being solved are of second order): initial displacement, initial velocity, and initial acceleration. If no special action is taken, initial displacement, velocity, and acceleration are assumed to be zero.

Zero initial conditions -- These are the default conditions; that is, if initial displacement = 0, you do not need to specify anything. You may apply the loads corresponding to the first corner of the load-versus-time curve in the first load step.

Nonzero initial conditions -- You can set displacement, velocity, and acceleration initial conditions with the IC and ICROTATE commands.

Caution: Be careful not to define inconsistent initial conditions. For example, if you define an initial velocity at a single degree of freedom, the initial velocity at every other degree of freedom will be 0.0, potentially leading to conflicting initial conditions. In most cases, you will want to define initial conditions at every unconstrained degree of freedom in your model. If these conditions are not the same at every degree of freedom, it is usually much easier to define initial conditions explicitly (rather than by using the IC command).

Nonzero initial displacement and nonzero initial velocity - Because the IC command only supports one condition at a given degree of freedom (displacement, velocity, or acceleration), the nonzero velocity is established by applying displacements over a time interval on the part of the structure where velocity is to be specified. For example, if initial displacement = 1.0 and initial velocity = 2.5, you would apply a displacement of 1.0 over a time interval of 0.4:

```
...
TIMINT,OFF               ! Time integration effects off
D,ALL,UY,1.0             ! Initial displacement = 1.0
TIME,.4                  ! Initial velocity = 1.0/0.4 = 2.5
SOLVE
DDELE,ALL,UY             ! Remove imposed displacements
TIMINT,ON                ! Time integration effects on
...
```

5.3.2.1. Using ICROTATE to Specify Initial Velocity
You can use the ICROTATE command to specify initial velocity at nodes as a sum of rotation about an axis and translation. The command calculates the nodal velocities and saves them in the database as if the IC command had been used to calculate these velocities. The last defined IC or ICROTATE command overwrites the initial conditions specified by the preceding command.

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt — §5.3.3 Set Solution Controls: Basic Tab + Transient Tab (lines 8303-8404)

Special considerations for setting these options in a full transient analysis include:
- When setting ANTYPE and NLGEOM, select Small Displacement Transient if you are performing a new analysis and you want to ignore large deformation effects such as large deflection, large rotation, and large strain. Select Large Displacement Transient if you expect large deflections (as in the case of a long, slender bar under bending) or large strains (as in a metal-forming problem). Select Restart Current Analysis if you want to restart a failed nonlinear analysis, or if you have previously completed a static prestress or a full transient dynamic analysis and you want to extend the time-history.
- When setting AUTOTS, remember that this load step option (which is also known as time-step optimization in a transient analysis) increases or decreases the integration time step based on the response of the structure. For most problems, we recommend that you turn on automatic time stepping, with upper and lower limits for the integration time step. These limits, specified using DELTIM or NSUBST, help to limit the range of variation of the time step. The default is ON.
- NSUBST and DELTIM are load step options that specify the integration time step for a transient analysis. The integration time step is the time increment used in the time integration of the equations of motion. You can specify the time increment directly or indirectly (that is, in terms of the number of substeps). The time step size determines the accuracy of the solution: the smaller its value, the higher the accuracy.
- When setting OUTRES, keep this caution in mind:
  Caution: By default, only the last substep (time-point) is written to the results file (Jobname.rst) in a full transient dynamic analysis. To write all substeps, set the Frequency so that it writes all of the substeps.

Table 5.1: Transient Tab Options:
- Specify whether time-integration effects are on or off (TIMINT)
- Specify whether to ramp the load change over the load step or to step-apply the load change (KBC)
- Specify mass and stiffness damping (ALPHAD, BETAD)
- Specify midstep criterion (MIDTOL)
- Select the time-integration method, Newmark or HHT (TRNOPT)
- Define integration parameters (TINTP)

Special considerations for the Transient tab:
- TIMINT is a dynamic load step option that specifies whether time-integration effects are on or off. Time integration effects must be turned on for inertia and damping effects to be included in the analysis (otherwise a static solution is performed), so the default is to include time-integration effects. This option is useful when beginning a transient analysis from an initial static solution; that is, the first load steps are solved with the time-integration effects off.
- ALPHAD (alpha, or mass, damping) and BETAD (beta, or stiffness, damping) specify damping options. Damping in some form is present in most structures and should be included in your analysis.
- TRNOPT (TINTOPT) specifies the time-integration method to be used. The default is Newmark method.
- TINTP specifies transient integration parameters. These parameters control the nature of the Newmark and HHT time-integration techniques. Alternatively, you can specify the intended application for the analysis using this command, and the program will automatically set the appropriate transient analysis settings.

The options on the remaining tabs in the Solution Controls dialog box for a full transient analysis are the same as the ones you can set for a static structural analysis. Exception: You cannot use arc-length options in a full transient analysis.

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt — §5.3.5-5.3.11 Save Load Steps, Solve, Review Results + Full Example (lines 8472-8622)

5.3.4. Apply the Loads
You are now ready to apply loads for the analysis. In addition, you can apply acceleration loads in a transient analysis. You can also apply time-dependent boundary conditions by defining a one-dimensional table (TABLE type array parameter).
Note: It is recommended that you use acceleration input to define support motion when applicable (using the tabular array parameter definition on the D,,ACC or ACEL command). A displacement input (D,,U command) is likely to show numerical noise, because it implies a discontinuity in acceleration in the simulation. In this case, numerical damping (GAMMA on the TINTP command) can be used to improve the acceleration and force results.

5.3.5. Save the Load Configuration for the Current Load Step
Command(s): LSWRITE — GUI: Main Menu> Solution> Load Step Opts> Write LS File

5.3.6. Repeat Steps 3-6 for Each Load Step
For each load step, you can reset any of these load step options: TIMINT, TINTP, ALPHAD, BETAD, MP,ALPD, MP,BETD, TIME, KBC, NSUBST, DELTIM, AUTOTS, NEQIT, CNVTOL, PRED, LNSRCH, CRPLIM, NCNV, CUTCONTROL, OUTPR, OUTRES, ERESX, and RESCONTROL.

An example load step file:
```
TIME, ...            ! Time at the end of 1st transient load step
Loads  ...           ! Load values at above time
KBC, ...             ! Stepped or ramped loads
LSWRITE              ! Write load data to load step file
TIME, ...            ! Time at the end of 2nd transient load step
Loads  ...           ! Load values at above time
KBC, ...             ! Stepped or ramped loads
LSWRITE              ! Write load data to load step file
Etc.
```

5.3.8. Start the Transient Solution
Command(s): LSSOLVE — GUI: Main Menu> Solution> Solve> From LS Files

5.3.10. Review the Results
- POST26 is used to review results at specific points in the model as functions of time.
- POST1 is used to review results over the entire model at specific time points.

Using POST26: Define the variables. Command(s): NSOL (primary data, that is, nodal displacements), ESOL (derived data, that is, element solution data, such as stresses), RFORCE (reaction force data), FORCE (total force, or static, damping, or inertia component of total force), SOLU (time step size, number of equilibrium iterations, response frequency, and so on). Graph or list the variables: Command(s): PLVAR (graph variables), PRVAR, EXTREM (list variables).

Using POST1: Read in the desired set of results. Use the SET command to identify the data set by load step and substep numbers or by time. If you specify a time for which no results are available, the results that are stored will be a linear interpolation between the two nearest time points.

5.3.11. Example: Full Transient Dynamic Analysis
```
!  Build the Model
/FILNAM,...               ! Jobname
/TITLE,...                ! Title
/PREP7                    ! Enter PREP7
---! Generate model
FINISH
!  Apply Loads and Obtain the Solution
/SOLU                      ! Enter SOLUTION
ANTYPE,TRANS               ! Transient analysis
TRNOPT,FULL                ! Full method
D,...                      ! Constraints
F,...                      ! Loads
SF,...
ALPHAD,...                 ! Mass damping
BETAD,...                  ! Stiffness damping
KBC,...                    ! Ramped or stepped loads
TIME,...                   ! Time at end of load step
AUTOTS,ON                  ! Auto time stepping
DELTIM,...                 ! Time step size
OUTRES,...                 ! Results file data options
LSWRITE                    ! Write first load step
---! Loads, time, etc. for 2nd load step
LSWRITE                    ! Write 2nd load step
SAVE
LSSOLVE,1,2                ! Initiate multiple load step solution
FINISH
!
!  Review the Results
/POST26
SOLU,...                   ! Store solution summary data
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt — §5.6 Transient Dynamic Analysis Options: time step guidelines, automatic time stepping, application-based TINTP settings (lines 9160-9370)

Guidelines for Integration Time Step (excerpt):
- Resolve the response frequency. The time step should be small enough to resolve the motion (response) of the structure. For the Newmark time-integration scheme, using approximately twenty points per cycle of the highest frequency of interest results in a reasonably accurate solution; that is, if f is the frequency (in cycles/time), the integration time step (ITS) is given by ITS = 1/(20f). Smaller ITS values may be required if acceleration results are needed. Notice that 20 or more points per cycle results in a period elongation of less than one percent.
- Resolve the applied load-versus-time curve(s). The time step should be small enough to "follow" the loading function. The response tends to lag the applied loads, especially for stepped loads. Stepped loads require a small ITS at the time of the step change so that the step change can be closely followed. ITS values as small as 1/180f may be needed to follow stepped loads.
- Resolve the contact frequency. In problems involving contact (impact), the time step should be small enough to capture the momentum transfer between the two contacting surfaces. To minimize the energy loss, at least thirty points per cycle of (N = 30) are needed.
- Resolve the nonlinearities. For most nonlinear problems, a time step that satisfies the preceding guidelines is sufficient to resolve the nonlinearities. There are a few exceptions, however: if the structure tends to stiffen under the loading (for example, large deflection problems that change from bending to membrane load-carrying behavior), the higher frequency modes that are excited will have to be resolved.
- Satisfy the time step accuracy criterion. You can issue the MIDTOL command to select the midstep residual criterion.
After calculating the time step using the appropriate guidelines, use the minimum value for your analysis. By using automatic time stepping, you can let the program decide when to increase or decrease the time step during the solution.

5.6.2. Automatic Time Stepping
Automatic time stepping, also known as time step optimization, attempts to adjust the integration time step during solution based on the response frequency and on the effects of nonlinearities. If nonlinearities are present, automatic time stepping gives the added advantage of incrementing the loads appropriately and retreating to the previous converged solution (bisection) if convergence is not obtained. You can activate automatic time stepping with the AUTOTS command.

5.6.3. Transient Dynamic Analysis Settings Based on Application
Many transient dynamic analysis settings can be automatically set by the program based on the intended application. When you specify an application type on the TINTP command, the program automatically defines the time-integration constants (GAMMA parameter on TINTP) and several solver settings:

- Impact Simulation: Use the command TINTP,IMPA if the intended application is an impact simulation and you do not want any numerical dissipation. The program follows the time-integration method that you specify via the TRNOPT command (Newmark or HHT) and sets GAMMA = 0, resulting in no numerical dissipation.
- High Speed Simulation: Use the command TINTP,HISP if the intended application is a high speed simulation. The program follows the time-integration method that you specify via the TRNOPT command (Newmark or HHT) and sets GAMMA = 0.005, resulting in a small numerical dissipation.
- Moderate Speed Simulation: Use the command TINTP,MOSP if the intended application is a moderate speed simulation. The program sets GAMMA = 0.1, resulting in a moderate numerical dissipation which helps to achieve convergence without significant energy loss. This setting can be used for most transient dynamic simulations.
- Low Speed Simulation: Use the command TINTP,LOSP if the intended application is a low speed simulation. The program sets GAMMA = 0.414, resulting in a high numerical dissipation. The automatic time incrementation is changed such that only one point per cycle is required per integration time step, therefore allowing use of much larger time increments. For the LOSP option, the mid-step convergence check is ignored, overriding the MIDTOL command.
- Quasi-Static Simulation: Use the command TINTP,QUAS if the intended application is quasi-static. For this option, the program uses backward Euler time-integration. The high numerical dissipation in this time-integration scheme can help to achieve convergence in some problems that are quasi-static in nature but fail to converge in a static analysis. Similar to the program default for ANTYPE,STATIC, the loads are ramped by default (KBC,0). Applications that can benefit from using the QUAS option include: buckling dominated simulations; models that may display temporary rigid body modes; and simulations that have a snap-through event, causing instability.

Where to Find Other Examples (Verification Manual test cases): VM9 - Large Lateral Deflection of Unequal Stiffness Springs; VM40 - Large Deflection and Rotation of a Beam Pinned at One End; VM65 - Transient Response of a Ball Impacting a Flexible Surface; VM85 - Transient Displacements in a Suddenly Stopped Moving Bar; VM91 - Large Rotation of a Swinging Pendulum; VM179 - Dynamic Double Rotation of a Jointed Beam.

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt — §8.8 Performing a Nonlinear Transient Analysis (lines 14454-14586)

8.8. Performing a Nonlinear Transient Analysis
Many of the tasks that you need to perform in a nonlinear transient analysis are the same as (or similar to) those that you perform in nonlinear static analyses and linear full transient dynamic analyses. However, this section describes some additional considerations for performing a nonlinear transient analysis.

8.8.1. Build the Model
This step is the same as for a nonlinear static analysis. If your analysis includes time-integration effects, however, include a value for mass density (MP,DENS). You can also define material-dependent structural damping (MP,BETD, MP,ALPD, TB,SDAMP,,,,BETD, or TB,SDAMP,,,,ALPD).

8.8.2. Apply Loads and Obtain the Solution
1. Specify transient analysis type and define analysis options as you would for a nonlinear static analysis:
   - New Analysis or Restart (ANTYPE)
   - Analysis Type: Transient (ANTYPE)
   - Large Deformation Effects (NLGEOM)
2. Apply loads and specify load step options in the same manner as you would for a linear full transient dynamic analysis. A transient load history usually requires multiple load steps, with the first load step typically used to establish initial conditions. The general, nonlinear, birth and death, and output control options available for a nonlinear static analysis are also available for a nonlinear transient analysis.

In a nonlinear transient analysis, time must be greater than zero. See Transient Dynamic Analysis (p. 153) for procedures for defining nonzero initial conditions.

For a nonlinear transient analysis, you must specify whether you want stepped or ramped loads (KBC).

You can also specify dynamics options: alpha (ALPHAD) and beta (BETAD) damping, time-integration effects (TIMINT), and transient integration parameters (TINTP):
- Damping: Rayleigh damping constants are defined using the constant mass (ALPHAD) and stiffness (BETAD) matrix multipliers. In a nonlinear analysis, the stiffness may change drastically; therefore, use BETAD with care.
- Time-Integration Effects (TIMINT): Time-integration effects are ON by default in a transient analysis. For creep, viscoelasticity, viscoplasticity, or swelling, you should turn the time-integration effects off (that is, use a static analysis). These time-dependent effects are usually not included in dynamic analyses because the transient dynamic time-step sizes are often too short for any significant amount of long-term deformation to occur.
  Except in kinematic (rigid-body motion) analyses, you rarely need to adjust the transient integration parameters (TINTP), which provide numerical damping to the Newmark and HHT methods.
3. Write load data for each load step (LSWRITE) to a load step file.
4. Save a backup copy of the database to a named file (SAVE).
5. Start solution calculations (LSSOLVE).
6. After solving all load steps, exit the SOLUTION processor (FINISH).

8.8.3. Review the Results
As in a nonlinear static analysis, you can use POST1 to postprocess results at a specific moment in time. You should verify that your solution has converged before you attempt to postprocess the results. Time-history postprocessing using POST26 is essentially the same for nonlinear as for linear transient analyses.

8.8.4. Example: Nonlinear Transient Analysis (complete input)
```
!  Build the Model:
/PREP7
---                     ! Similar to a linear full transient model, with
---                     ! these possible additions: nonlinear material
---                     ! properties, nonlinear elements
---
FINISH
!
!  Apply Loads and Obtain the Solution:
/SOLU
ANTYPE,TRANS
!  TRNOPT,FULL by default
---                     ! Establish initial conditions as in linear full
---                     ! transient analysis
LSWRITE                 ! Initial-condition load step
NLGEOM,ON               ! Nonlinear geometric effects (large deformations)
!  NROPT=AUTO by default: Program chooses appropriate Newton-Raphson and
                        ! Adaptive Descent options, depending on
                        ! nonlinearities encountered
!  Loads:
F,...
D,...
!  Load Step Options:
TIME,...                ! TIME at end of load step
DELTIM,...              ! Time-step controls (starting, min, max)
AUTOTS,ON               ! Automatic time-stepping, including bisection
!  KBC=0 by default (ramped loading)
!  Dynamic Options:
ALPHAD,...              ! Mass damping
TIMINT,ON               ! TIMINT,ON by default, unless you turned it OFF for
                        ! initial-condition load step
!  Nonlinear Options:
CNVTOL,...              ! Convergence criteria
NCNV,,,...              ! Nonconvergence termination controls
PRED,ON                 ! Predictor ON
OUTRES,ALL,ALL          ! Results for every substep written to database
LSWRITE                 ! First "real" transient load step
---                     ! Additional load steps, as needed
---
LSSOLVE,1,3             ! Initiate multiple l.s. solution
SAVE
FINISH
!
!  Review the Results:
/POST26                 ! Time-History Postprocessor
SOLU,2,CNVG             ! Check convergence
SOLU,3,FOCV
PRVAR,2,3
NSOL,...                ! Store results (displacements, stresses, etc.) as
                        ! variables
PLVAR,...               ! Graph results vs. TIME to evaluate general quality
                        ! of analysis, determine critical time step, etc.
FINISH
!
/POST1                  ! General Postprocessor
SET,...                 ! Read results from desired time step
PLDISP,...              ! Postprocess as desired
PLNSOL,...
NSORT,...
PRNSOL,...
FINISH
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt — TIMINT command (lines 84307-84356)

```
TIMINT,Key,Lab
Turns on transient effects.
SOLUTION: Dynamic Options
Valid Products: Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Key
Transient effects key:
OFF   No transient effects (static or steady-state).
ON    Include transient (mass or inertia) effects.
Lab
Degree of freedom label:
ALL    Apply this key to all appropriate labels (default).
STRUC  Apply this key to structural DOFs.
THERM  Apply this key to thermal DOFs.
ELECT  Apply this key to electric DOFs.
MAG    Apply this key to magnetic DOFs.
FLUID  Apply this key to fluid DOFs.
DIFFU  Apply this key to concentration of DOFs.
Command Default
Include transient effects (ON) (ANTYPE,TRANS).
Notes
Indicates whether this load step in a full transient analysis should use time integration, that is, whether it includes transient effects (e.g. structural inertia, thermal capacitance) or whether it is a static (steady-state) load step for the indicated DOFs. Transient initial conditions are introduced at the load step having Key = ON. Initial conditions are then determined from the previous two substeps. Zero initial velocity and acceleration are assumed if no previous substeps exist.
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt — TINTP command (lines 84409-84497)

```
TINTP,GAMMA,ALPHA,DELTA,THETA,OSLM,TOL,OSLM2,--,AVSMOOTH,ALPHAF,ALPHAM
Defines transient integration parameters.
SOLUTION: Dynamic Options
Valid Products: Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
GAMMA
Amplitude decay factor for 2nd order transient integration, for example, structural dynamics (used only if ALPHA, DELTA, ALPHAF, and ALPHAM are blank, see "Notes"). Defaults to 0.005.
Alternatively, you can input the application type for the analysis using one of the following labels. In this case, the program automatically sets the transient dynamic solver algorithm and settings based on the intended application:
IMPA   Impact application.
HISP   High speed dynamic application.
MOSP   Moderate speed dynamic application.
LOSP   Low speed dynamic application.
QUAS   Quasi-static application.
ALPHA
2nd order transient integration parameter (used only if GAMMA is blank). Defaults to 0.2525.
DELTA
2nd order transient integration parameter (used only if GAMMA is blank). Defaults to 0.5050.
THETA
1st order transient (for example, thermal transient) integration parameter. Defaults to 1.0.
OSLM
Specifies the oscillation limit criterion for automatic time stepping of 1st order transients (for example, thermal transients). Defaults to 0.5 with a tolerance of TOL.
TOL
Tolerance applied to OSLM. Defaults to 0.0.
OSLM2
Specifies the oscillation limit for automatic time stepping of second order transients (for example, structural transients). The automatic time stepping algorithm will adjust to have approximately the specified number of points per cycle. You can specify a negative number (for example, -1) to define a time increment that is independent of the oscillation limit.
AVSMOOTH
Smoothing flag option:
0  Include smoothing of the velocity (1st order system) or the acceleration (2nd order system) (default).
1  Do not include smoothing.
ALPHAF
Interpolation factor in HHT algorithm for force and damping terms (used only if GAMMA is blank). Defaults to 0.005.
ALPHAM
Interpolation factor in HHT algorithm for inertial term (used only if GAMMA is blank). Defaults to 0.0.
Command Default
GAMMA defaults to 0.005, which is the same as choosing the High Speed application (GAMMA = HISP).
Notes
Used to define the transient integration parameters. For a full structural transient analysis, you may choose between the Newmark and HHT time integration methods (see the TRNOPT command). In this case, if GAMMA is input and the integration parameters ALPHA, DELTA, ALPHAF, and ALPHAM are left blank, the program calculates the integration parameters, according to Equation 15.14 and Equation 15.18. Alternatively, you can input these integration parameters directly on this command. However, for the unconditional stability and second order accuracy of the time integration, these parameters should satisfy a specific relationship, as described in Description of Structural and Other Second Order Systems of the Mechanical APDL Theory Reference.
For mode-superposition transient analysis, the integration parameters ALPHA and DELTA are always calculated by the program from the GAMMA value.
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt — NLGEOM command (lines 51992-52034, preview)

```
NLGEOM,Key
Includes large-deflection effects in a static or full transient analysis.
SOLUTION: Nonlinear Options
Valid Products: Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Key
Large-deflection key:
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Basic_Analysis_Guide.txt — §3.6.1.4 Stepping or Ramping Loads + §3.6.2 Dynamics Options + §3.6.4 Output Controls (lines 3423-3666)

3.6.1.4. Stepping or Ramping Loads
When specifying multiple substeps within a load step, indicate whether the loads are to be ramped or stepped by issuing the KBC command. KBC,0 indicates ramped loads, and KBC,1 indicates stepped loads. The default depends on the discipline and type of analysis.
- Stepped loads: The program handles all loads (constraints, forces, surface loads, body loads, and inertia loads) in the same manner. They are step-applied, step-changed, or step-removed, as the case may be.
- Ramped loads: All loads applied in the first load step, except film coefficients, are ramped (either from zero or from the value specified via BFUNIF). For tabular boundary conditions, loads are never ramped but rather evaluated at the current time.

3.6.2. Setting Dynamics Options
Table 3.13: Dynamic and Other Transient Analyses Commands:
- Activates or deactivates time integration effects — TIMINT
- Specifies the frequency range of the loads in a harmonic analysis — HARFRQ
- Specifies damping for a structural dynamic analysis — ALPHAD
- Specifies damping for a structural dynamic analysis — BETAD
- Specifies damping for a structural dynamic analysis — DMPRAT
- Specifies damping for a structural dynamic analysis — MDAMP
- Specifies transient analysis options — TRNOPT

3.6.3. Setting Nonlinear Options
Table 3.14: Nonlinear Analyses Commands:
- Specifies the maximum number of equilibrium iterations per substep — NEQIT
- Specifies convergence tolerances — CNVTOL
- Provides options for terminating analyses — NCNV

3.6.4. Setting Output Controls
Three primary output controls for specifying the amount and nature of output from an analysis:
- Controls what the program writes to the OUTRES database and results file and how often it is written — OUTRES
- Controls what is printed (written to the solution output file, Jobname.out) and how often it is written — OUTPR
- Controls the type of geometry data the program writes to the results file — OUTGEOM

Example:
```
OUTRES,ALL,5     ! Writes all data every 5th substep
OUTPR,NSOL,LAST  ! Prints nodal solution for last substep only
OUTGEOM,MAT,NONE ! Suppresses the writing of the material property data to the results file
```
You can issue a series of OUTPR, OUTRES, and OUTGEOM commands (up to 50 of them combined) to meticulously control the solution output, but be aware that the order in which they are issued is important. For example:
```
OUTRES,ALL,10
OUTRES,NSOL,5
```
writes all data to the database and results file every 10th substep and nodal solution data every fifth substep. However, reversing the order essentially makes the second command override the first.
To restrict the solution data that is written out, use OUTRES to selectively suppress (Freq = NONE) the writing of solution data, or first suppress the writing of all solution data (OUTRES,ALL,NONE) and then selectively turn on the writing of solution data with subsequent OUTRES commands.

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Basic_Analysis_Guide.txt — §3.7 Creating Multiple Load Step Files (lines 3686-3736)

All loads and load step options put together form a load step, for which the program can calculate the solution. If you have multiple load steps, you can store the data for each load step on a file, called the load step file, and read it in later for solution.

The LSWRITE command writes the load step file (one file per load step, identified as Jobname.S01, Jobname.S02, Jobname.S03, etc.). After all load step files are written, you can issue one action command to read in the files sequentially and obtain the solution for each load step.

Example 3.11: Defining Multiple Load Steps
```
/SOLU             ! Enter SOLUTION
!  Load Step 1:
D, ...             ! Loads
SF, ...
NSUBST, ...        ! Load step options
KBC, ...
OUTRES, ...
OUTPR, ...
LSWRITE           ! Writes load step file: Jobname.S01
!  Load Step 2:
D, ...
SF, ...
NSUBST, ...
KBC, ...
OUTRES, ...
OUTPR, ...
LSWRITE           ! Writes load step file: Jobname.S02
```
The LSWRITE command does not capture changes to real constants (R), material properties (MP), couplings (CP), or constraint equations (CE).

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt — 15.2.2 Time Integration for Nonlinear Systems (lines 32449-32492, 32533-32575, 32626-32675, previews)

- HHT time integration method -- Used for implicit transient analyses as described below. This method is an extension of the Newmark time integration method and is requested by setting TINTOPT = HHT on the TRNOPT command.
- Backward Euler time integration method -- Used for implicit transient analyses.

In the Newmark method, the amount of numerical algorithm dissipation can be controlled by one of Newmark's parameters, gamma, as follows (Equation 15.13). With the Newmark method... (gamma controls dissipation; gamma = 0.5 = no dissipation/central difference, gamma > 0.5 adds numerical damping).

15.2.2.2. Time Integration Scheme for Nonlinear Systems
In nonlinear structural dynamics problems, the internal load is no longer linearly proportional to the nodal displacement, and the structural stiffness matrix is dependent on the current displacement. Therefore, instead of the linear formulation, the program uses a time-marching algorithm where the internal loads are updated each iteration.

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt — §8.12.1 Setting Up a Nonlinear Analysis (lines 14994-15058)

By taking your time and proceeding carefully, you can avoid many difficulties commonly associated with nonlinear analyses:
- Understand Your Program and Structure Behavior: For nonlinear transient dynamic analyses, a preliminary model of beams, masses, and springs can provide insight into the structure's dynamics at minimal cost. Preliminary nonlinear static, linear transient dynamic, and/or modal analyses can also help you to understand various aspects of your structure's nonlinear dynamic response before you undertake the final nonlinear transient dynamic analysis. Read and understand the program's output messages and warnings. At a minimum, before you try to postprocess your results, verify that your problem converged.
- Simplify Your Model: Represent your 3D structure as a 2D model where possible; reduce model size using symmetry; omit nonlinear details if possible; model transient dynamic loading in terms of static-equivalent loads; consider substructuring the linear portions of your model.
- Use an Adequate Mesh Density: Use a mesh density adequate to characterize the highest mode shape of interest. Also, use a mesh density adequate to resolve any transient dynamic wave propagation through your structure; if wave propagation is important, then provide at least 20 elements to resolve one wavelength.
- Apply Loading Gradually: For nonconservative, path-dependent systems, you need to apply the load in small enough increments to ensure that your analysis closely follows the structure's load-response curve.
</rag-context>