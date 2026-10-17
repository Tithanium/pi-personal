<rag-context>
[pi-local-rag] RAG subagent: 5 sources, 388 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt (lines 3135-3334 · enclosing doc section)

Command
Option
MP,DMPR
Material-Dependent Constant Structural
Damping Ratio
Damped and QR damped mode-extraction methods support all types of damping. UNSYM only supports
structural damping.
Damping is ignored for the other mode-extraction methods.
If you include damping and specify the damped mode-extraction method, the calculated eigenvalues
and eigenvectors are complex. If you include damping and specify the QR damped mode-extraction
method, the eigenvalues are complex, but the eigenvectors can be real or complex (Cpxmod on
MODOPT). The real eigenvectors are used for the mode-superposition analysis. See Comparing Mode-
Extraction Methods (p. 64) for details.
For more information about different forms of damping, see Damping (p. 2).
Damping specified in a non-damped modal analysis 
Damping (MP,DMPR) can be specified in a non-damped modal analysis if a spectrum or mode-
superposition analysis is to follow the modal analysis. Although the damping does not affect the
eigenvalue solution, it is used to calculate an effective damping ratio for each mode, which is
then used in the subsequent analysis; see the Mechanical APDL Theory Reference.
3.4.5. Solve
Before you solve, save (SAVE) a backup copy of the database to a named file. You can then retrieve
your model by reentering the program and issuing RESUME.
Now start the solution calculations (SOLVE).
3.4.5.1. Output
The output from the solution consists mainly of the natural frequencies, which are printed as part
of the printed output (Jobname.out) and also written to the mode shape file (Jobname.mode).
The printed output may include mode shapes and the participation factor table, depending on
your analysis options and output controls. Element results are written to the results file (Job-
name.rst) via MXPAND. If MXPAND is not issued, the element results are not written by default
and therefore cannot be postprocessed.
3.4.6. Participation Factor Table Output
The participation factor table lists participation factors, mode coefficients, and mass distribution per-
centages for each mode extracted. The participation factors and mode coefficients are calculated
based on an assumed unit displacement spectrum in each of the global Cartesian directions and ro-
tation about each of these axes. The mass distribution is also listed.
The total mass used to calculate the ratio of effective mass to total mass is the mass output in the
mass summary. Only the precise mass summary (used for 3D models) accurately calculates the total
rigid body mass and therefore the directional masses. For more information, see Mass Related Inform-
ation in the Mechanical APDL Theory Reference.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
48
Modal Analysis

If you want to include the effect of boundary conditions and CP/CE in the calculation of the total
mass, you can use APDL Math. For an example, see Example 4.9: Calculate the Participation Factors
and Total Rigid Body Mass in the Ansys Parametric Design Language Guide.
Participation factors may be approximate when you use a force-distributed constraint (deformable
constraint surface) defined via MPC contact to apply boundary conditions (see Surface-Based Constraints
in the Contact Technology Guide). Some contact nodes on the boundary are considered dependent
nodes by the solver, so their contribution is ignored. It is recommended you use a rigid surface con-
straint instead.
For participation factors calculated in a superelement use pass, refer to The CMS Use and Expansion
Passes in the Substructuring Analysis Guide.
Rotational participation factors will be calculated when a real-value eigensolver mode-extraction
method (such as Block Lanczos, PCG Lanczos, PCG Block Lanczos, Supernode, or Subspace) is used.
For rotational degrees of freedom, the participation factor table output shows the ratios of effective
mass to total mass only when the precise mass summary is calculated.
Note:
The modal effective mass is equal to the participation factor squared. For a list of exceptions,
see Effective Mass and Cumulative Mass Fraction in the Mechanical APDL Theory Reference.
Retrieving a participation factor or mode coefficient 
You can retrieve a participation factor or mode coefficient via *GET (with Entity = MODE).
3.4.7. Modal Mass and Kinetic Energy Output
The modal masses, kinetic energies, and translational effective masses are printed out in a summary
following the participation factor tables when the modes are expanded (MXPAND).
The modal masses and kinetic energies are always calculated from modes normalized to unity (inde-
pendent of Nrmkey on MODOPT).
In a superelement use pass, only master degrees-of-freedom are considered. As a consequence, the
more master degrees-of-freedom are constrained, the more inaccurate the modal masses and derived
kinetic energies become.
The kinetic energy is calculated from the modal mass. Therefore, element results need not be calculated
(independent of Elcalc on MXPAND).
3.4.8. Exit the Solution Processor
You must now exit the solution processor (FINISH).
3.5. Reviewing the Results
Results from a modal analysis (that is, the modal expansion pass) are written to the structural results
file, Jobname.rst. Results consist of:
49
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Reviewing the Results

• Natural frequencies
• Expanded mode shapes
• Relative stress and force distributions (if requested).
You can review these results in POST1 (/POST1), the general postprocessor. Some typical postprocessing
operations for a modal analysis are described below. For a complete description of all postprocessing
functions, see An Overview of Postprocessing in the Basic Analysis Guide.
3.5.1. Points to Remember
• If you want to review results in POST1, the database must contain the same model for which the
solution was calculated.
• The results file (Jobname.rst) must be available.
3.5.2. Reviewing Results Data
1. Read in results data from the appropriate substep (SET,Lstep,Sbstep). Each mode is stored on
the results file as a separate substep. If you expand six modes, for instance, your results file will
have one load step consisting of six substeps.
If the results data are complex, you can retrieve the real part, the imaginary part, the amplitude
or the phase via this command:
SET, LSTEP, SBSTEP , , KIMG
2. Perform any desired POST1 operations. Typical modal analysis POST1 operations are described
below:
3.5.3. Option: Listing All Frequencies
You may want to list the frequencies of all modes expanded (SET,LIST). A sample output from this
command is shown below.
  *****  INDEX OF DATA SETS ON RESULTS FILE  *****
   SET   TIME/FREQ    LOAD STEP   SUBSTEP  CUMULATIVE
     1  22.973             1         1         1
     2  40.476             1         2         2
     3  78.082             1         3         3
     4  188.34             1         4         4
3.5.4. Option: Display Deformed Shape
Use the KUND field on PLDISP to overlay the nondeformed shape on the display.
3.5.5. Option: Line Element Results
For line elements, such as beams, spars, and pipes, issue ETABLE to access derived data (stresses,
strains, etc.). Results data are identified by a combination of a label and a sequence number or com-
ponent name via ETABLE. For more information, see The General Postprocessor (POST1).
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
50
Modal Analysis

3.5.6. Option: Contour Displays
Use PLNSOL or PLESOL to contour almost any result item, such as stresses (SX, SY, SZ...), strains
(EPELX, EPELY, EPELZ...), and displacements (UX, UY, UZ...).
The KUND field on PLNSOL and PLESOL gives you the option of overlaying the nondeformed shape
on the display.
You can also contour element table data (PLETAB) and line element data (PLLS).
Caution:
Derived data, such as stresses and strains, are averaged at the nodes via PLNSOL. Averaging
results in smeared values at nodes where elements of different materials, different shell
thicknesses, or other discontinuities meet. To avoid the smearing effect, use selecting
(described in Selecting and Components in the Basic Analysis Guide) to select elements of
the same material, same shell thickness, and so on before issuing PLNSOL.
3.5.7. Option:Tabular Listings
Issue PRNSOL, PRESOL, and PRRSOL to print nodal results, element results, and constrained node
reaction data, respectivelydo . To sort the data before listing them, issue NSORT and/or ESORT.
3.5.8. Other Capabilities
Many other postprocessing functions - mapping results onto a path, load case combinations, and so
on - are available in POST1. See The General Postprocessor (POST1) in the Basic Analysis Guide for
details.
3.6. Applying Prestress Effects in a Modal Analysis
The following topics concerning adding prestress effect to a modal analysis are available:
3.6.1. Performing a Prestressed Modal Analysis from a Linear Base Analysis
3.6.2. Performing a Prestressed Modal Analysis from a Large-Deflection Base Analysis
3.6.1. Performing a Prestressed Modal Analysis from a Linear Base Analysis
Use a prestressed modal analysis to calculate the frequencies and mode shapes of a prestressed
structure, such as a spinning turbine blade. This procedure is applicable only if the prior (base) ana-
lysis is a purely linear, small deflection solution.
If the prior static analysis includes large-deflection effects (NLGEOM,ON), use the linear perturbation
procedure described in Performing a Prestressed Modal Analysis from a Large-Deflection Base Analys-
is (p. 52). If the base analysis includes other nonlinearities, use the linear perturbation procedure as
described in Linear Perturbation Analysis (p. 333). (Note that the linear perturbation analysis procedure
is also valid for cases where the base analysis is linear and, therefore, can be used instead of the
prestressed modal analysis procedure described here.)
51
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Applying Prestress Effects in a Modal Analysis

The procedure for performing a prestressed modal analysis from a linear base analysis is essentially
the same as that of a standard modal analysis, except that you must first prestress the structure by
performing a static analysis:
1. Build the model and obtain a static solution with prestress effects turned on (PSTRES,ON). The
same lumped mass setting (LUMPM) used here must also be used in the later prestressed
modal analysis. Structural Static Analysis (p. 9) describes the procedure to obtain a static
solution. Use EMATWRITE,YES if you want to look at strain energies from the modal analysis.
This step can also be a transient analysis. If so, save the EMAT and ESAV files at the desired
time point.
2. Enter the solution processor once again and obtain the modal solution, also with prestress
effects activated (reissue PSTRES,ON). Files Jobname.emat (if created) and Jobname.esav
from the static analysis must be available.
If another analysis is performed between the static and prestressed modal analyses, it is ne-
cessary to rerun the static analysis, or keep a copy of the EMAT file from the static analysis.
3. Expand the modes and review them in the postprocessor.
Keep in mind that if you specify nonlinear elements in the modal analysis, Mechanical APDL treats
them as linear. For example, if you include contact elements, their stiffnesses are calculated based
on their initial status and never change. For a prestressed modal analysis, the program assumes that
the initial status of the contact elements is the status at the completion of the static prestress analysis.
3.6.2. Performing a Prestressed Modal Analysis from a Large-Deflection Base
Analysis
To calculate the frequencies and mode shapes of a deformed structure or a structure involving non-
linear (sliding) contact, you can use the linear perturbation analysis procedure (p. 333) to perform a
prestressed modal analysis following a large-deflection (NLGEOM,ON) static analysis.
To obtain the modal solution of a deformed structure, follow these steps:
1. Perform a nonlinear static solution with the prestress load. Define the necessary restart files
(RESCONTROL).
2. Restart the previous static solution from the desired load step and substep.
3. Issue PERTURB to define the analysis type, material behavior to be used, contact status
(ContKey argument) and load values to be retained from the previous static solution
(LoadControl argument).
4. Modify the behavior of individual contact pairs, as needed, via CNKMOD.
5. Issue SOLVE,ELFORM to regenerate the matrices.
6. Issue MODOPT and MXPAND to specify the modal analysis option.
7. Issue SOLVE to perform the eigensolution.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
52
Modal Analysis


## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt (lines 14850-15096 · enclosing doc section)

The RECALCDAMP = 1 option also enables recalculation of the damping factor after remeshing.
(See Stabilization in a Nonlinear Mesh Adaptivity Analysis in the Nonlinear Adaptivity Analysis Guide.)
Deactivating Stabilization
307
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Unstable Structures

Each time that stabilization is deactivated (STABILIZE,OFF), the stabilization forces change suddenly,
which may cause convergence problems. Before completely deactivating stabilization in such cases,
use the reduced method of stabilization (STABILIZE,REDUCE) and specify the damping factor used
for the previous load step.
Example
Assume that load step 1 is unstable but solvable with stabilization. Load step 2 is
stable and requires no stabilization, yet does not converge if you deactivate stabil-
ization (STABILIZE,OFF). In this scenario, you can add a pseudo load step (STABIL-
IZE,REDUCE,DAMPING,VALUE). The damping factor should be the value from load
step 1. Do not apply any new loads. This technique should help with convergence.
8.11.2. Using the Arc-Length Method
The arc-length method (ARCLEN and ARCTRM) is another way to solve unstable problems. This
method is restricted to static analyses with proportional (ramped) loads only.
When choosing the number of substeps (NSUBST), consider that more substeps result in a longer
solution time but sometimes help the program to converge. Ideally, you want the minimum number
of substeps required to produce an optimally efficient solution. You might have to make an educated
guess of the desired number of substeps, and adjust and re-analyze as needed. The modification of
the MAXARC argument of the ARCLEN command can also help the program to converge by preventing
the reference arc-length radius from increasing too rapidly (MAXARC = 1).
When the arc-length method is active, do not use line search (LNSRCH), the predictor (PRED), adaptive
descent (NROPT,,,ON), automatic time-stepping (AUTOTS, DELTIM), or time-integration effects
(TIMINT). Likewise, do not try to base convergence on displacement (CNVTOL,U); instead, use the
force criteria (CNVTOL,F).
If an arc-length solution fails to converge within the prescribed maximum number of iterations (NEQIT),
the program automatically bisects and continues the analysis. Bisection continues until a converged
solution is obtained or until the minimum arc-length radius is used. (The minimum radius is defined
by NSBSTP (NSUBST) and MINARC (ARCLEN).
In general, you cannot use this method to obtain a solution at a specified load or displacement value
because the value changes (along the spherical arc) as equilibrium is achieved. Figure 8.4: Traditional
Newton-Raphson Method vs. Arc-Length Method (p. 260) illustrates how the specified load 
 is used
only as a starting point. The actual load at convergence is somewhat less. Similarly, it can be difficult
to determine a value of limiting load or deflection within some known tolerance when using the arc-
length method in a nonlinear buckling analysis. Generally, you must adjust the reference arc-length
radius (NSUBST) by trial-and-error to obtain a solution at the limit point.
You can freely switch from the Newton-Raphson iteration method to the arc-length method at the
start of any load step. However, to switch from arc-length to Newton-Raphson iterations, you must
terminate the analysis and restart, deactivating the arc-length method in the first load step of the
restart (ARCLEN,OFF).
An arc-length solution terminates under these conditions:
• When limits defined by the ARCTRM or NCNV commands are reached
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
308
Nonlinear Structural Analysis

• When the solution converges at the applied load
• When you use an abort file (Jobname.abt)
See the Basic Analysis Guide for information about termination and restart procedures.
Use the load-deflection curve as a guide for evaluating and adjusting your analysis to help you achieve
the desired results. It is usually good practice to graph your load-deflection curve (using POST26
commands) with every analysis.
The total arc-length load factor (SOLU,,ALLF) can be either positive or negative. Similarly, TIME, which
in an arc-length analysis is related to the total arc-length load factor, can also be either positive or
negative. Negative values of ALLF or TIME indicate that the arc-length feature is applying load in
the reverse direction in order to maintain stability in the structure. Negative ALLF or TIME values are
commonly seen in various snap-through analyses.
8.11.2.1. Checking Arc-Length Results
When reading arc-length results into the database for POST1 postprocessing (SET), always reference
the desired results data set by its load step and substep number (LSTEP and SBSTEP) or by its
data set number (NSET).
Do not reference results by a TIME value, because TIME in an arc-length analysis is not always
monotonically increasing. (A single value of TIME might reference more than one solution.) Addi-
tionally, the program cannot correctly interpret negative TIME values (which might be encountered
in a snap-through analysis).
If TIME becomes negative, define an appropriate variable range (/XRANGE or /YRANGE) before
creating any POST26 graphs.
8.11.3. Nonlinear Stabilization vs. the Arc-Length Method
You can use nonlinear stabilization for both local and global instability with few limitations related
to compatibility with other algorithms and materials. However, nonlinear stabilization cannot detect
the negative-slope portion of a load-vs.-displacement curve problem with global instability (if any).
Although the results obtained before the negative slope portion of the problem are always correct,
the results for the substeps after the negative-slope portion are also correct if the materials are not
deformation-history-dependent. (Consider the results to be questionable if the materials are deformation-
history-dependent.)
The arc-length method can detect the negative-slope portion of a load-vs.-displacement curve, but
it cannot solve problems with local instability and material softening. Other limitations exist, related
mostly to compatibility with certain algorithms and materials.
To help you understand when to use either method, the following table compares both methods and
their applications:
Nonlinear Stabilization vs. Arc-Length
Arc-Length
Nonlinear Stabilization
Analysis Problem
No
Yes
Local instability or local buckling
309
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Unstable Structures

Yes
Yes
Global instability or global buckling
Yes
Cannot detect this part of
the curve, but other parts
Negative slope of load-vs.-displacement
curve
can be simulated for
deformation-history-independent
materials, and the
preceding part can be
simulated for deformation-
history-dependent materials
Yes
Yes
Rate-dependent materials and creep
No
Yes
Line search
Different algorithm
Yes[a]
Substep predictor (PRED,ON)
Different algorithm
Yes
Automatic time-stepping (p. 315)
Yes
Yes
Displacements as load
Limited
Yes
Activate/deactivate from load step to load
step, or within a load step
Sparse solver only
No restrictions
Linear solver use
Positive or negative
Positive
Time at converged substep
Not recommended
Yes
Nonlinear contact
Solid elements only.
[a]
8.12. Guidelines for Nonlinear Analysis
This section provides information to help you perform a successful nonlinear analysis.
Ansys, Inc. recommends using current-technology elements for nonlinear analyses.
The following topics are available:
8.12.1. Setting Up a Nonlinear Analysis
8.12.2. Overcoming Convergence Problems
8.12.1. Setting Up a Nonlinear Analysis
By taking your time and proceeding carefully, you can avoid many difficulties commonly associated
with nonlinear analyses.
Consider these suggestions:
8.12.1.1. Understand Your Program and Structure Behavior
8.12.1.2. Simplify Your Model
8.12.1.3. Use an Adequate Mesh Density
8.12.1.4. Apply Loading Gradually
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
310
Nonlinear Structural Analysis

8.12.1.1. Understand Your Program and Structure Behavior
If you have not used a particular nonlinear feature before, construct a very simple model (containing
only a few elements), and make sure you understand how to handle this feature before you use it
in a large, complicated model.
Gain preliminary insight into your structure's behavior by analyzing a preliminary simplified model
first. For nonlinear static models, a preliminary linear static analysis can reveal which regions of
your model will first experience nonlinear response, and at what load levels these nonlinearities
will come into play. For nonlinear transient dynamic analyses, a preliminary model of beams, masses,
and springs can provide insight into the structure's dynamics at minimal cost. Preliminary nonlinear
static, linear transient dynamic, and/or modal analyses can also help you to understand various
aspects of your structure's nonlinear dynamic response before you undertake the final nonlinear
transient dynamic analysis.
Read and understand the program's output messages and warnings. At a minimum, before you try
to postprocess your results, verify that your problem converged. For path-dependent problems,
the printout's equilibrium iteration record can be especially important in helping you to determine
if your results are valid or not.
8.12.1.2. Simplify Your Model
Keep your final model as simple as possible. For example, if applicable to your analysis, try any or
all of the following:
• Represent your 3D structure as a 2D plane stress, plane strain, or axisymmetric model.
• Reduce your model size by using symmetry or antisymmetry surfaces.
If your model is loaded antisymmetrically, however, you can generally not take advantage of
antisymmetry to reduce a nonlinear model's size. Antisymmetry can also be rendered inapplicable
by large deflections.
• Omit a nonlinear detail if you can do so without affecting results in critical regions of your
model.
• Model transient dynamic loading in terms of static-equivalent loads.
• Consider substructuring the linear portions of your model to reduce the computational effort
required for intermediate load or time increments and equilibrium iterations.
8.12.1.3. Use an Adequate Mesh Density
Recognize that regions undergoing plastic deformation require a reasonable integration point
density (mesh density is particularly important in plastic-hinge regions).
Provide an adequate mesh density on contact surfaces to allow contact stresses to be distributed
in a smooth fashion. Likewise, provide a mesh density adequate for resolving stresses; areas where
stresses or strains are of interest require a relatively fine mesh compared to that needed for dis-
placement or nonlinearity resolution.
311
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Guidelines for Nonlinear Analysis

Use a mesh density adequate to characterize the highest mode shape of interest. The number of
elements needed depends on the elements' assumed displacement shape functions, as well as on
the mode shape itself. Also, use a mesh density adequate to resolve any transient dynamic wave
propagation through your structure; if wave propagation is important, then provide at least 20
elements to resolve one wavelength.
8.12.1.4. Apply Loading Gradually
For nonconservative, path-dependent systems, you need to apply the load in small enough incre-
ments to ensure that your analysis closely follows the structure's load-response curve.
You can sometimes improve the convergence behavior of conservative systems by applying the
load gradually, so as to minimize the number of Newton-Raphson equilibrium iterations required.
8.12.2. Overcoming Convergence Problems
This section provides information to help you fix convergence problems in a nonlinear analysis. The
following topics are available:
8.12.2.1. Overview of Convergence Problems
8.12.2.2. Performing Nonlinear Diagnostics
8.12.2.3.Tracking Convergence Graphically
8.12.2.4. Automatic Time-Stepping
8.12.2.5. Line Search
8.12.2.6. Nonlinear Stabilization
8.12.2.7. Arc-Length Method
8.12.2.8. Artificially Inhibit Divergence in Your Model's Response
8.12.2.9. Use the Nonlinear Adaptivity Feature
8.12.2.10. Dispense with Extra Element Shapes
8.12.2.11. Using Element Birth and Death Wisely
8.12.2.12. Read Your Output
8.12.2.13. Graph the Load and Response History
8.12.2.14. Semi-Implicit Method
8.12.2.15. Solution Transition Method
8.12.2.1. Overview of Convergence Problems
When performing a nonlinear analysis you may encounter convergence difficulties due to a number
of reasons. Some examples may be initially open contact surfaces causing rigid body motion, large
load increments causing nonconvergence, material instabilities, or large deformations causing mesh
distortion that result in element shape errors. The program automatically adjusts solution parameters
and attempts to obtain a robust, accurate solution. In addition, several tools are available to help
you identify potential problems before, during, and after a solution.
CHECK, MCHECK, and CNCHECK commands help you verify if there are any obvious problems with
the model before you start the solution. The CHECK command does an overall verification of the
model, including missing elastic properties, unconstrained model, and element shape checks. The
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
312
Nonlinear Structural Analysis


## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt (lines 3752-3807 · sibling doc section)

3.7.3.3. Linear Non-prestressed Modal Analysis
The full nonlinear perturbed modal analysis method (p. 56) described above requires a nonlinear
static stress analysis. If large-deflection or stress-stiffening effects are not critical, you can use the
linear non-prestressed modal analysis method instead. This method involves a single linear QR
damped or unsymmetric eigensolution. Since it is a linear analysis, this method is less time consum-
ing. The following steps are required:
1. Perform a QR damped (QRDAMP) or unsymmetric (UNSYM) modal analysis using the linear
modal analysis procedure:
• Use the unsymmetric stiffness matrix option (NROPT,UNSYM) to generate the unsymmetric
stiffness matrix. (No Newton-Raphson iterations are performed.)
• Generate frictional sliding force via CMROTATE. The contact stiffness matrix is based only on
the initial contact status.
• Specify the QR damped or unsymmetric mode extraction method (MODOPT,QRDAMP or
UNSYM).
• If you are planning to perform multiple solutions and want to reuse the symmetric ei-
gensolution from the previous load steps, issue QRDOPT,ON (QRDAMP only).
• Issue SOLVE.
• To perform friction sensitivity studies by reusing the normal modes from the symmetric ei-
gensolution (QRDAMP only), just change the friction coefficients and issue SOLVE.
2. Expand the modes and postprocess the results from Jobname.rst.
The following example illustrates the linear non-prestressed modal analysis method for brake-squeal
analysis:
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
60
Modal Analysis

/prep7
!
! Create the brake model
!
finish
!
/solu
!
! Perform a linear modal analysis
!
antype,modal
nropt,unsym    ! unsymmetric stiffness matrix
!
! Create an element component (for example, BrakeCM) consisting of brake 
! rotor and contact/target elements.
!
…
cmrotate,BrakeCM,ROTATX,ROTATY,ROTATZ
!
! Use QR damped or UNSYM eigensolver
!
qrdopt,on             ! Generate Jobname.modesym
modopt,qrdamp,...     ! (or) modopt,unsym
mxpand,...
solve
!
mp,mu,cid,0.3           ! Change freiction coefficient
solve
finish

## 004 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt (lines 4124-4176 · sibling doc section)

3.8.6. Damped Method
The damped method (MODOPT,DAMP) is meant for problems where damping cannot be ignored,
such as rotor dynamics applications. It uses the full matrices (
,
, and the damping matrix 
).
Sturm sequence checking is not available for this method. Therefore, modes may be missing in the
higher end of the range of extracted frequencies.
In a damped system, the eigensolutions are complex and the response at different nodes can be out
of phase. At any given node, the amplitude will be the vector sum of the real and imaginary compon-
ents of the eigenvector.
The complex frequencies are generally pairs of complex conjugates except in cases where system
matrices are unsymmetric and structural damping is present.
For an example showing the use of the MODOPT and DAMPOPT commands to extract eigenvalues
within a frequency range of interest, see Example: Shift Option Usage on DAMPOPT (p. 68). For details
about the complex frequency definition, see Complex Eigensolutions in the Theory Reference. For details
about complex solution postprocessing, see POST1 and POST26 – Complex Results Postprocessing
in the Theory Reference.
3.8.6.1. Example: Shift Option Usage on DAMPOPT
Consider an example having many complex eigenfrequencies with the real part in the range of 0
to 3000 Hz. Using the sequence of commands below, eigenvalues are reported as shown in Fig-
ure 3.2: Eigenfrequency Spectrum with the SHIFT Option, First 1000 (p. 69).
/solu 
antype,modal 
modopt,damp,1000,10,3000  ! Request the first 1000 eigenvalues 
                          !   in the range 10 to 3000 Hz 
dampopt,shift,on          ! Activate the shift option 
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
68
Modal Analysis

Figure 3.2: Eigenfrequency Spectrum with the SHIFT Option, First 1000
Using the following command input, you can ask for only the eigenfrequencies within a frequency
range starting at 1500 Hz. The result is shown in Figure 3.3: Subset of Eigenfrequencies with the
SHIFT Option (p. 69). The black points on the graph show the resulting subset of eigenfrequencies
compared to the above case of 1000 requested eigenvalues.
/solu
antype,modal
modopt,damp,20,1500   ! Only request the first 20 
                      !   eigenvalues > 1500 Hz
dampopt,shift,on      ! Activate the shift option
                      ! The DAMP algorithm uses a shift 
                      !   of 1500 Hz to initiate the search
Figure 3.3: Subset of Eigenfrequencies with the SHIFT Option
69
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Comparing Mode-Extraction Methods

Note that when the SHIFT option is active and FREQB is specified, the damped eigensolver only
produces eigenfrequencies with a real part greater than FREQB. If FREQB is not specified, the
damped eigensolver finds eigenvalues closest to the 0 Hz point.

## 005 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt (lines 2971-2976 · sibling doc section)

3.4.2.7. Option: Mass Matrix Formulation (LUMPM)
Use this option to specify the default formulation (which is element-dependent) or lumped mass
approximation. The default formulation is suitable for most applications; however, for some problems
(such as those involving slender beams or very thin shells), the lumped mass approximation often
yields better results. Also, the lumped mass approximation can result in a shorter run time and
lower memory requirements.
</rag-context>