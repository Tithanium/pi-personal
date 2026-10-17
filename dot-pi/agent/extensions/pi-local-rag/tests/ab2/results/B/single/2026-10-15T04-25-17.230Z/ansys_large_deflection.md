<rag-context>
[pi-local-rag] RAG subagent: 1 sources, 2125 ms retrieval.
## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt (lines 14850-15049 · enclosing doc section)

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
</rag-context>