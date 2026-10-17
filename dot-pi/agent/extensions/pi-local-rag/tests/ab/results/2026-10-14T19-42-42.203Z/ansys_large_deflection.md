<rag-context>
[pi-local-rag] RAG subagent: 6 sources, 327267 ms retrieval.
# Nonlinear large-deflection static structural analysis in ANSYS Mechanical APDL

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt — Section 8.4: Using Geometric Nonlinearities (lines ~13043–13095)

    In contrast, large-strain analyses account for the stiffness changes that result from changes in an element's shape and orientation. NLGEOM,ON), activates large-strain effects supported element types. The large-strain feature is available in most of the solid elements (including all of the large strain elements), and in most shell and beam elements.
    The large-strain procedure places no theoretical limit on the total rotation or strain experienced by an element. Certain element types are subject to practical limitations on total strain, as described below.
    The procedure requires that strain increments be restricted to maintain accuracy, however, so the total load should be broken into smaller steps.
    8.4.1.1. Large Deflections with Small Strain
    This feature is available in all beam and most shell elements, as well as in a number of the nonlinear elements. Issue the NLGEOM,ON command to activate large-deflection effects for those elements that are designed for small strain analysis types that support this feature.
    8.4.2. Stress Stiffening
    The out-of-plane stiffness of a structure can be significantly affected by the state of in-plane stress in that structure. This coupling between in-plane stress and transverse stiffness, known as stress stiffening, is most pronounced in thin, highly stressed structures, such as cables or membranes.
    ...
    To use stress stiffening in the second category of systems, you must issue PSTRES,ON in your first load step.
    Large-strain and large-deflection procedures include initial stress effects as a subset of their theory. For most elements, initial stiffness effects are automatically included when large-deformation effects are activated (NLGEOM,ON).

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt — Section 8.3.2: Substeps / Automatic time-stepping (lines ~12978–12988)

    8.3.2. Substeps
    When using multiple substeps, you need to achieve a balance between accuracy and economy: more substeps (that is, small time-step sizes) usually result in better accuracy, but at a cost of increased run times. The program provides automatic time-stepping designed for this purpose.
    Automatic time-stepping adjusts the time-step size as needed, gaining a better balance between accuracy and economy. Automatic time-stepping activates the bisection feature.
    Bisection provides a means of automatically recovering from a convergence failure. This feature cuts a time-step size in half whenever equilibrium iterations fail to converge and automatically restart from the last converged substep. If the halved time step again fails to converge, bisection again cuts the time-step size and restart, continuing the process until convergence is achieved or until the minimum time-step size (specified by you) is reached.

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt — Section 8.6.2.3: Advanced Load Step Options via Solution Controls (lines ~13891–14006)

    8.6.2.3.1. Automatic Time-Stepping
    Automatic solution control enables automatic time-stepping (AUTOTS,ON). An internal auto-time-step scheme ensures that the time-step variation is neither too aggressive (resulting in many bisection/cutbacks) nor too conservative (time-step size is too small). At the end of a time step, the size of the next time step is predicted based on these factors:
    • Number of equilibrium iterations used in the last time step – more iterations cause the time-step size to be reduced.
    • Predictions for nonlinear element status change – time-step sizes are decreased when a status change is imminent.
    • Size of the plastic strain increment.
    • Size of the creep strain increment.

    8.6.2.3.2. Convergence Criteria
    The program continues to perform equilibrium iterations until the convergence criteria (CNVTOL) are satisfied (or until the maximum number of equilibrium iterations is reached (NEQIT)). You can define specific criteria if the default settings are not suitable; however, changes to the default criteria are rarely needed.
    The automatic solution convergence check uses the L2-norm of force (and moment) with a tolerance (TOLER) equal to 0.5%, a setting that is appropriate for most cases. In most cases, an infinite norm check on displacement with TOLER equal to 5% is also used in addition to the force convergence check. The check that the displacements are loosely set serves as a double-check on convergence.
    By default, the program checks for force (and, when rotational degrees of freedom are active, moment) convergence by comparing the square root sum of the squares (SRSS) of the force imbalances against the product of VALUE*TOLER. The default value of VALUE is the SRSS of the applied loads or MINREF (which defaults to 0.01), whichever is greater.
    You should almost always use force convergence checking. You can also add displacement (and, when applicable, rotation) convergence checking.
    ...
    In general, you should continue to use the default value of VALUE; that is, change the convergence criteria by adjusting TOLER, not VALUE.
    Convergence Norm — The program provides three different vector norms to use for convergence checking:
    • The infinite norm repeats the single-degree-of-freedom check at each degree of freedom in your model.
    • The L1 norm compares the convergence criterion against the sum of the absolute values of force (and moment) imbalance for all degrees of freedom.
    • The L2 norm performs the convergence check using the square root sum of the squares of the force (and moment) imbalance for all degrees of freedom.
    Normally, if an analysis converges in one norm, it will converge in the other norms. The default norm check is recommended.

    8.6.2.3.3. Maximum Number of Equilibrium Iterations
    Automatic solution control sets the value of NEQIT to between 15 and 26 iterations, depending upon the physics of the problem. The idea is to use a small time step with fewer quadratically converging iterations.
    This option limits the maximum number of equilibrium iterations to be performed at each substep. If the convergence criteria have not been satisfied within this number of equilibrium iterations, and if auto time-stepping is on (AUTOTS), the program attempts to bisect. If bisection is not possible, then the analysis either terminates or moves on to the next load step (according to NCNV command settings).

    8.6.2.3.5. Line Search Option
    Automatic solution control toggles line search on and off as needed. For most contact problems, LNSRCH is toggled on. For most non-contact problems, LNSRCH is toggled off.
    This convergence-enhancement tool multiplies the calculated displacement increment by a program-calculated scale factor (having a value between 0 and 1), whenever a stiffening response is detected. Because the line search algorithm is intended to be an alternative to the adaptive descent option (NROPT), adaptive descent is not automatically activated if the line search option is on. We do not recommend activating both line search and adaptive descent simultaneously.
    When an imposed displacement exists, a run cannot converge until at least one of the iterations has a line search value of 1.

    8.6.2.3.6. Cutback Criteria
    For finer control over bisections and cutback in time-step size, use (CUTCONTROL, Lab, Value, Option).

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt — Section 8.6.3.1.2: Newton-Raphson Option (NROPT) (lines ~14022–14079)

    8.6.3.1.2. Newton-Raphson Option
    Automatic solution control uses the FULL Newton-Raphson option (NROPT) with adaptive descent off if there is a nonlinearity present. However, when node-to-node, node-to-surface contact elements are used for contact analysis with friction, then adaptive descent is automatically turned on. The underlying contact elements require adaptive descent for convergence.
    Valid only in a nonlinear analysis, this option specifies how often the tangent matrix is updated during solution. The default behavior (NROPT,AUTO) enables the program to decide based on the kinds of nonlinearities present in your model, and adaptive descent is activated automatically when appropriate. The following additional options are available:
    • Full (NROPT,FULL):
      The program uses the full Newton-Raphson procedure, in which the stiffness matrix is updated at every equilibrium iteration.
      If adaptive descent is on (optional), the program uses the tangent stiffness matrix only as long as the iterations remain stable ... When the iterations return to a convergent pattern, the program resumes using the tangent stiffness matrix. Activating adaptive descent (NROPT,FULL,,ON) usually enhances the program's ability to obtain converged solutions for complicated nonlinear problems but is supported only for elements indicated under "Special Features" in the Input Summary table ... in the Element Reference.
    • Modified (NROPT,MODI):
      The program uses the modified Newton-Raphson technique, in which the tangent stiffness matrix is updated at each substep. The matrix is not changed during equilibrium iterations at a substep. This option is not applicable to large-deformation analyses. Adaptive descent is not available.
    • Initial Stiffness (NROPT,INIT):
      The program uses the initial stiffness matrix in every equilibrium iteration. This option can be less likely to diverge than the full option, but it often requires more iterations to achieve convergence. It is not applicable to large-deformation analyses. Adaptive descent is not available.
    • Full with unsymmetric matrix (NROPT,UNSYM):
      The program uses the full Newton-Raphson procedure, in which the stiffness matrix is updated at every equilibrium iteration. In addition, it generates and uses unsymmetric matrices that you can use for any of the following:
      – If you are running a pressure-driven collapse analysis, an unsymmetric pressure load stiffness might be helpful in obtaining convergence. You can include pressure load stiffness via CNVTOL,PRES.
      – If you are defining an unsymmetric material model using TB,USER, you would need NROPT,UNSYM to fully use the property you defined.
      – For a contact analysis, an unsymmetric contact stiffness matrix would fully couple the sliding and the normal stiffnesses.
    You should first try NROPT,FULL, then try NROPT,UNSYM if you experience convergence difficulties. (Using an unsymmetric solver requires more computational time to obtain a solution than if you use a symmetric solver.)

    Related note (8.6.3.1.1): To account for buckling, bifurcation behavior, the program includes stress stiffness in all geometrically nonlinear analyses (NLGEOM,ON).

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt — Solution Controls dialog: Nonlinear / Advanced NL tab options (lines ~1658–1699)

    2.2.2.5. Using the Nonlinear Tab
    Table 2.3: Nonlinear Tab Options
    • Activate line search (LNSRCH) — see Line Search Option / Line Search
    • Activate a predictor on the degree-of-freedom solution (PRED)
    • Specify the maximum number of iterations allowed per substep (NEQIT)
    • Specify whether you want to include creep calculation (RATE)
    • Set convergence criteria (CNVTOL)
    • Control bisections (CUTCONTROL)

    2.2.2.6. Using the Advanced NL Tab
    Table 2.4: Advanced NL Tab Options
    • Specify analysis termination criteria (NCNV)
    • Control activation and termination of the arc-length method (ARCLEN, ARCTRM)

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/models_examples/mwe_run_stackline/stackline_code_ANSYS_beam.txt — Example APDL setup for a large-deflection beam/stackline (lines 50–68)

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
</rag-context>