<rag-context>
[pi-local-rag] RAG subagent: 5 sources, 308095 ms retrieval.
### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt — Setting up surface-to-surface (pair-based) contact

Guide structure for "Surface-to-Surface Contact (Pair-Based)" (Section 3) — the workflow for setting up contact between two bodies:

    3. Surface-to-Surface Contact (Pair-Based)
    3.1. Using Surface-to-Surface Contact Elements
    3.2. Steps in a Contact Analysis
    3.3. Creating the Model Geometry and Mesh
    3.4. Identifying Contact Pairs
    3.5. Designating Contact and Target Surfaces
    3.5.1. Asymmetric Contact vs. Symmetric Contact
    3.6. Defining the Target Surface
    ...
    3.7. Defining the Deformable Contact Surface
    3.7.1. Element Type
    3.7.2. Real Constants and Material Properties
    3.7.3. Generating Contact Elements
    ...
    3.9. Set the Real Constants and Element KEYOPTS
    3.9.3. Selecting a Contact Algorithm (KEYOPT(2))
    3.9.4. Determining Contact Stiffness and Allowable Penetration
    3.9.5. Choosing a Friction Model
    ...
    Command(s): KEYOPT,ET
    GUI: Main Menu> Preprocessor> Element Type> Add/Edit/Delete

Contact element types (surface-to-surface pair-based): a deformable contact surface element overlaid on the contact body, paired with a target surface element (e.g. rigid TARGE170 or conforming target element) on the target body.

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt — Choosing the contact algorithm (KEYOPT(2)) and tradeoffs

    3.9.3. Selecting a Contact Algorithm (KEYOPT(2))
    For surface-to-surface contact elements, the program offers several different contact algorithms:
    • Penalty method (KEYOPT(2) = 1)
    • Augmented Lagrangian (default) (KEYOPT(2) = 0)
    • Lagrange multiplier on contact normal and penalty on tangent (KEYOPT(2) = 3)
    • Pure Lagrange multiplier on contact normal and tangent (KEYOPT(2) = 4)
    • Internal multipoint constraint (MPC) (KEYOPT(2) = 2)
    The penalty method uses a contact spring to establish a relationship between the two contact surfaces.
    The spring stiffness is called the contact stiffness. This method uses the following real constants: FKN
    and FKT for all values of KEYOPT(10), plus FTOLN and SLTO if KEYOPT(10) = 0 or 2.
    The augmented Lagrangian method (which is the default) is an iterative series of penalty methods.
    The contact tractions (pressure and frictional stresses) are augmented during equilibrium iterations
    so that the final penetration on most contact nodes is smaller than the allowable tolerance (FTOLN).
    Compared to the penalty method, the augmented Lagrangian method usually leads to better condi-
    tioning and is less sensitive to the magnitude of the contact stiffness. However, in some analyses, the
    augmented Lagrangian method may require additional iterations, especially if the deformed mesh
    becomes too distorted.
    The pure Lagrange multiplier method enforces zero penetration when contact is closed and "zero
    slip" when sticking contact occurs. The pure Lagrange multiplier method does not require contact
    stiffness, FKN and FKT. Instead it requires chattering control parameters, FTOLN and TNOP. This
    method adds contact traction to the model as additional degrees of freedom and requires additional
    iterations to stabilize contact conditions. It often increases the computational cost compared to the
    augmented Lagrangian method.
    An alternative algorithm is the Lagrange multiplier method applied on the contact normal and the
    penalty method (tangential contact stiffness) on the frictional plane. This method enforces zero pen-
    etration and allows a small amount of slip for the sticking contact condition. It requires chattering
    control parameters, FTOLN and TNOP, as well as the maximum allowable elastic slip parameter SLTO.
    The internal multipoint constraint (MPC) algorithm is used in conjunction with bonded contact (KEY-
    OPT(12) = 5 or 6) and no separation contact (KEYOPT(12) = 4) to model several types of contact as-
    semblies and kinematic constraints.

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt — Lagrange multiplier method considerations

    3.9.3.1. Lagrange Multiplier Method Considerations
    Keep the following points in mind when using the Lagrange multiplier methods.
    1. The Lagrange multiplier methods (KEYOPT(2) = 3, 4) do not support the Gauss point detection
    option (KEYOPT(4) = 0) for surface-to-surface contact. They support the nodal detection options
    for surface-to-surface contact and node-to-surface contact. When using these options, be careful
    not to overconstrain the model. The model is overconstrained when a contact node has pre-
    scribed boundary conditions, CE equations, or CP equations. The program first attempts to detect
    all potential overconstraints, and then eliminates the overconstraints by switching to the penalty
    method internally. However, there is no guarantee that the program will eliminate all cases of
    overconstraint. You should always verify your model carefully to address this issue.
    2. For 3D higher-order contact elements (CONTA174) using nodal detection (KEYOPT(4)=1,2), the
    Lagrange multiplier method is applied at each contact node (including midside nodes), but the
    penalty method is applied on the center of the contact elements, even when KEYOPT(2) = 3 or
    4 is set. For Normal Lagrange formulation (KEYOPT(2)=3,4), with 3D higher-order contact elements
    (with midside nodes), use of surface projection-based contacts (KEYOPT(4)=3,4) is strongly re-
    commended.
    In general, normal contact stiffness (FKN) has very little influence on the contact results when
    a Lagrange multiplier method is used. You should not overwrite the default FKN in most cases.
    3. The Lagrange multiplier methods also introduce more degrees of freedom, which may result in
    spurious modes for modal and linear eigenvalue buckling analyses. The augmented Lagrangian
    method (KEYOPT(2) = 0) would be a better choice for these analysis types.
    4. The Lagrange multiplier methods introduce zero diagonal terms in the stiffness matrix. Any it-
    erative solver (for example, the PCG solver) will encounter a preconditioning matrix singularity
    with these methods. Therefore, you should switch to the sparse solver.

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt — Controlling contact stiffness (FKN, FKT, FTOLN, KEYOPT(10))

    3.9.4.1. Introduction
    For the augmented Lagrangian method and penalty method, normal and tangential contact stiff-
    nesses are required. The amount of penetration between contact and target surfaces depends on
    the normal stiffness. The amount of slip in sticking contact depends on the tangential stiffness.
    Higher stiffness values decrease the amount of penetration/slip, but can lead to ill-conditioning of
    the global stiffness matrix and to convergence difficulties. Lower stiffness values can lead to a certain
    amount of penetration/slip and produce an inaccurate solution. Ideally, you want a high enough
    stiffness that the penetration/slip is acceptably small, but a low enough stiffness that the problem
    will be well-behaved in terms of convergence.
    The program provides default values for contact stiffnesses (FKN, FKT), allowable penetration (FTOLN),
    and allowable slip (SLTO). Material properties of underlying elements can affect the calculation of
    default values of contact stiffnesses...
    In most cases, you do not need to define the contact stiffness. In addition, Ansys recommends that
    you use KEYOPT(10) = 0 or 2 (p. 53) to allow the program to update the contact stiffness automat-
    ically.
    3.9.4.2. Using FKN and FTOLN
    For certain contact problems, you may choose to use the real constant FKN to define a normal
    contact stiffness factor. The usual factor range is from 0.1 - 10.0, with a default of 1.0. The default
    value should work in most cases. You can also define an absolute normal contact stiffness by spe-
    cifying a negative value for FKN.
    ...
    By default, the units of the user-specified absolute normal contact stiffness is FORCE/LENGTH3. You can
    change the units to FORCE/LENGTH by setting KEYOPT(3) = 1. This KEYOPT(3) = 1 setting is valid only
    when a penalty-based algorithm is used (KEYOPT(2) = 0 or 1) and the absolute normal contact stiffness
    is explicitly specified.
    ...
    Use real constant FTOLN in conjunction with the augmented Lagrangian method. FTOLN is a toler-
    ance factor to be applied in the direction of the surface normal. The range for this factor is less
    than 1.0 (usually less than 0.2), with a default of 0.1, and is based on the depth of the underlying
    solid, shell, or beam element. This factor is used to determine if penetration compatibility is satisfied.
    ...
    In general, the default contact normal stiffness is inversely proportional to the final penetration
    tolerance. The tighter the tolerance, the higher the contact normal stiffness.
    When you use real constant FTOLN in conjunction with KEYOPT(10) = 0 or 2, the normal contact
    stiffness (used for the penalty method and the augmented Lagrange method) is updated at each
    iteration based on the current mean stress of the underlying elements and the allowable tolerance
    (FTOLN times the depth of the underlying elements).
    3.9.4.3. Using FKT, SLTO, and KEYOPT(13)
    [tangential contact stiffness FKT, allowable elastic slip SLTO]

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt — KEYOPT defaults and friction model entry points

    3.9.2. Element KEYOPTS
    Each contact element includes several KEYOPTS. Ansys recommends using the default settings, which
    are suitable for most contact problems. For some specific applications, you can override the defaults.
    The element KEYOPTS allow you to control several aspects of contact behavior.
    • Degrees of freedom (KEYOPT(1))
    • Contact algorithm (defaults to augmented Lagrangian) (KEYOPT(2))
    • Unit control for normal contact stiffness or contact element stress state (KEYOPT(3))
    • Location of contact detection point (KEYOPT(4))
    ...
    • Contact stiffness update (KEYOPT(10))
    ...
    • Behavior of contact surface (rough, bonded, etc.) (KEYOPT(12))
    ...
    • Sliding behavior (KEYOPT(18))
    Table 3.3: Summary of KEYOPT Defaults in Different Environments
    [KEYOPT 2 — Contact Algorithm: Ansys Mechanical APDL = Aug. Lagr.; Workbench Nonlinear = Aug. Lagr.; General Contact (GCGEN) = Penalty]
    [KEYOPT 12 — Behavior of contact surface: rough, bonded, no separation, etc.]

    3.9.5. Choosing a Friction Model
    3.9.5.1. Introduction
    3.9.5.2. Coefficient of Friction
    3.9.5.3. Using TAUMAX, FACT, DC, and COHE
    3.9.5.4. Static and Dynamic Friction Coefficients
    3.9.5.5. Forced Frictional Sliding Using Velocity Input
    3.9.5.6. Arctangent Friction Model
    3.9.5.7. Contact Friction for Steady-State Rolling Analysis

    (Theory Reference — friction inputs: "μeq = equivalent coefficient of friction for orthotropic friction;
    μ1, μ2 = coefficients of friction in first and second principal directions (input as MU1 and MU2
    using TB command with Lab = FRIC)")
</rag-context>