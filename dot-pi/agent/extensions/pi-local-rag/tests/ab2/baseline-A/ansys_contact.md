<rag-context>
[pi-local-rag] RAG subagent: 15 sources, 207522 ms retrieval.
# ANSYS Mechanical APDL — Surface-to-Surface Contact, Algorithms, Stiffness & Friction

Sources: ANSYS Mechanical APDL 2026 R1 documentation (Contact Technology Guide, Theory Reference, Element Reference) plus an APDL example script.

## How to set up surface-to-surface contact (element pair + KEYOPT overview)

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt — TARGE170 / CONTA174 pairing (lines 31477–31516)

```
TARGE170
Surface-to-Surface
Contact Element
CONTA174
K
I
J
Node-to-Surface
Contact Element
CONTA175
n
n
K
I
J
n
TARGE170
3D Line-to-Surface
Contact Element
CONTA177
I
K
J
Z
X
Y
K
I
J
n
3D Line-to-Surface
Contact Element
CONTA177
TARGE170 Input Data
The target surfac…
```

The 3D surface-to-surface pair is **CONTA174 (contact) + TARGE170 (target)**. CONTA175 is node-to-surface; CONTA177 is 3D line-to-surface. The contact surface's outward normal must point toward the target surface.

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt — 3.9.2 Element KEYOPTS summary (lines 2781–2810)

```
3.9.2. Element KEYOPTS
Each contact element includes several KEYOPTS. Ansys recommends using the default settings, which
are suitable for most contact problems. For some specific applications, you can override the defaults.
The element KEYOPTS allow you to control several aspects of contact behavior.
• Degrees of freedom (KEYOPT(1)) (p. 169)
• Contact algorithm (defaults to augmented Lagrangian) (KEYOPT(2)) (p. 47)
• Unit control for normal contact stiffness or contact element stress state (KEYOPT(3)) (p. 95)
• Location of contact detection point (KEYOPT(4)) (p. 67)
• CNOF Automated adjustment (KEYOPT(5)) (p. 74)
• Contact stiffness variation range (KEYOPT(6)) (p. 54)
• Time step control and impact constraints (KEYOPT(7)) (p. 103)
• Symmetric contact behavior (KEYOPT(8)) (p. 19)
• Effect of initial penetration or gap (KEYOPT(9)) (p. 74)
• Contact stiffness update (KEYOPT(10)) (p. 49)
• Shell thickness effect (KEYOPT(11)) (p. 102)
• Behavior of contact surface (rough, bonded, etc.) (KEYOPT(12)) (p. 91)
• Degree of freedom control for contact involving thermal shells (KEYOPT(13)) (p. 175)
• Behavior of fluid penetration load (KEYOPT(14)) (p. 121)
• Effect of stabilization damping (KEYOPT(15)) (p. 97)
• Squeal damping controls (KEYOPT(16)) (p. 63)
• Sliding behavior (KEYOPT(18)) (p. 72)
```

Default contact algorithm in APDL = **augmented Lagrangian (KEYOPT(2)=0)**. Key controls: KEYOPT(2) algorithm, KEYOPT(12) surface behavior (0 standard, 1 rough, 2/4 no-sep, 3/5/6 bonded), KEYOPT(10) stiffness update.

## Which contact algorithm to use and the tradeoffs

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt — 3.9.3 Selecting a Contact Algorithm (KEYOPT(2)) + 3.9.3.1 Lagrange Multiplier Considerations (lines 3053–3117)

```
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
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt — 13.174.4 Contact Algorithm (CONTA174 theory; lines 21990–22095)

```
13.174.4. Contact Algorithm
Four different contact algorithms are implemented in this element (selected by KEYOPT(2)).
• Pure penalty method
• Augmented Lagrangian method (Simo and Laursens)
• Pure Lagrange multiplier method (Bathe)
• Lagrange multiplier on contact normal and penalty on frictional direction

Pure Penalty Method
This method requires both contact normal and tangential stiffness. The main drawback is that the
amount penetration between the two surfaces depends on this stiffness. Higher stiffness values de-
crease the amount of penetration but can lead to ill-conditioning of the global stiffness matrix and
to convergence difficulties. Ideally, you want a high enough stiffness that contact penetration is ac-
ceptably small, but a low enough stiffness that the problem will be well-behaved in terms of conver-
gence or matrix ill-conditioning.
The contact pressure is:  P = Kn·un   (13.240)
where: Kn = contact normal stiffness; un = contact gap size.
The frictional stress for isotropic friction is obtained by Coulomb's law:  (13.241)
where: Ks = tangential contact stiffness (input as FKT on R command); μiso = coefficient of friction.

Augmented Lagrangian Method
The augmented Lagrangian method is an iterative series of penalty updates to find the Lagrange
multipliers (that is, contact tractions). Compared to the penalty method, the augmented Lagrangian
method usually leads to better conditioning and is less sensitive to the magnitude of the contact
stiffness coefficient. However, in some analyses, the augmented Lagrangian method may require ad-
ditional iterations, especially if the deformed mesh becomes excessively distorted.
The contact pressure is defined by:  (13.246)
where: ε = compatibility tolerance (input as FTOLN on R command); λi = Lagrange multiplier
component at iteration i. The Lagrange multiplier component λi is computed locally (for each
element) and iteratively.

Pure Lagrange Multiplier Method
The pure Lagrange multiplier method does not require contact stiffness. Instead it requires chattering
control parameters. Theoretically, the pure Lagrange multiplier method enforces zero penetration
when contact is closed and "zero slip" when sticking contact occurs. However the pure Lagrange
multiplier method adds additional degrees of freedom to the model and requires additional iterations
to stabilize contact conditions. This will increase the computational cost. This algorithm has chattering
problems due to contact status changes between open and closed or between sliding and sticking.
The other main drawback of the Lagrange multiplier method is overconstraint in the model. The
model is overconstrained when a contact constraint condition at a node conflicts with a prescribed
boundary condition on that degree of freedom (for example, D command) at the same node. Over-
constraints can lead to convergence difficulties and/or inaccurate results. The Lagrange multiplier
method also introduces zero diagonal terms in the stiffness matrix, so that iterative solvers (for
example, PCG) can not be used.

Lagrange Multiplier on Contact Normal and Penalty on Frictional Direction
In this method only the contact normal pressure is treated as a Lagrange multiplier. The tangential
contact stresses are calculated based on the penalty method (see Equation 13.241).
This method allows only a very small amount of slip for a sticking contact condition. It overcomes
chattering problems due to contact status change between sliding and sticking which often occurs
in the pure Lagrange Multiplier method. Therefore this algorithm treats frictional sliding contact
problems much better than the pure Lagrange method.
```

## How to control the contact stiffness (FKN, FTOLN, FKT, SLTO, KEYOPT(10)/(6))

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt — 3.9.4.1 Introduction + 3.9.4.2 Using FKN and FTOLN + 3.9.4.3 Using FKT, SLTO + 3.9.4.4 Additional Considerations (lines 3118–3282)

```
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
and allowable slip (SLTO). … In most cases, you do not need to define the contact stiffness. In addition,
Ansys recommends that you use KEYOPT(10) = 0 or 2 to allow the program to update the contact
stiffness automatically.

3.9.4.2. Using FKN and FTOLN
For certain contact problems, you may choose to use the real constant FKN to define a normal
contact stiffness factor. The usual factor range is from 0.1 - 10.0, with a default of 1.0. The default
value should work in most cases. You can also define an absolute normal contact stiffness by spe-
cifying a negative value for FKN.
…
If you input an absolute normal contact stiffness by specifying a negative value for FKN, you can
control the units by using KEYOPT(3). By default, the units of the user-specified absolute normal
contact stiffness is FORCE/LENGTH3. You can change the units to FORCE/LENGTH by setting KEYOPT(3)
= 1. This KEYOPT(3) = 1 setting is valid only when a penalty-based algorithm is used (KEYOPT(2) =
0 or 1) and the absolute normal contact stiffness is explicitly specified.

Use real constant FTOLN in conjunction with the augmented Lagrangian method. FTOLN is a toler-
ance factor to be applied in the direction of the surface normal. The range for this factor is less
than 1.0 (usually less than 0.2), with a default of 0.1, and is based on the depth of the underlying
solid, shell, or beam element. This factor is used to determine if penetration compatibility is satisfied.
Contact compatibility is satisfied if penetration is within an allowable tolerance (FTOLN times the
depth of underlying elements). … You can also define an absolute allowable penetration by spec-
ifying a negative value for FTOLN. In general, the default contact normal stiffness is inversely
proportional to the final penetration tolerance. The tighter the tolerance, the higher the contact
normal stiffness.
When you use real constant FTOLN in conjunction with KEYOPT(10) = 0 or 2, the normal contact
stiffness (used for the penalty method and the augmented Lagrange method) is updated at each
iteration based on the current mean stress of the underlying elements and the allowable tolerance
(FTOLN times the depth of the underlying elements).
Note: When the contact stiffness is too large (for example, 10^16), the machine precision may not
guarantee good conditioning of the global stiffness matrix. In this case, you should scale the force
unit in the model if possible.
Note: FTOLN is also used in the Lagrange multiplier methods (KEYOPT(2) = 3, 4) as a chattering
control parameter.

3.9.4.3. Using FKT, SLTO, and KEYOPT(13)
The program automatically defines a default tangential contact stiffness that is proportional to MU
and the normal stiffness FKN. The default tangential stiffness corresponds to a default value of FKT
= 1.0. A positive value for FKT is a factor. A negative value indicates an absolute value of tangential
stiffness.
For KEYOPT(10) = 0 or 2, or when the Lagrange multiplier on normal and penalty on tangent option
is used (KEYOPT(2) = 3), the program updates tangential contact stiffness based on current contact
normal pressure, PRES, and maximum allowable elastic slip, SLTO (KT = FKT*MU*PRES/SLTO).
…
The real constant SLTO is used to control maximum sliding distance when FKT is updated at each
iteration. … The default value for SLTO is 1 percent of the average contact length in a pair.
You can override the default value for SLTO by defining a scaling factor (positive value) or an
absolute value (negative value). A larger value will enhance convergence but compromise accuracy.

3.9.4.4. Additional Considerations for Specifying Contact Stiffness
FKN, FTOLN, FKT, and SLTO can be modified from one load step to another. They can also be adjusted
in a restart run.
Determining a good stiffness value may require some experimentation on your part. … Trial run:
1. Use a low value for the contact stiffness to start. In general, it is better to underestimate this
value rather than overestimate it. Penetration problems resulting from a low stiffness are easier
to fix than convergence difficulties that arise from a high stiffness.
2. Run the analysis up to a fraction of the final load (just enough to get the contact fully established).
3. Check the penetration and the number of equilibrium iterations used in each substep. If the
global convergence difficulty is caused by too much penetration, FKN may be underestimated or
FTOLN may be too small. If convergence requires many equilibrium iterations … FKN or FKT may be
overestimated.
4. Adjust FKN, FKT, FTOLN, or SLTO as necessary and run the full analysis. If the penetration
control becomes dominant … you may increase FTOLN to permit more allowable penetration or
increase FKN.
In addition, keep these points in mind when specifying contact stiffness:
• For bonded contact and rough contact, the program uses MU = 1.0 to calculate tangential
contact stiffness. …
```

Chattering control (for Lagrange methods), from same file (lines 3465–3478):
```
The program provides reasonable defaults for FTOLN and TNOP. FTOLN defaults to the displacement
convergence tolerance. TNOP defaults to 1% of the force convergence tolerance divided by the
contact area at contact nodes.
When providing values for FTOLN and TNOP:
• A positive value is a scaling factor applied to the default values.
• A negative value is used as an absolute value (which overrides the default).
The objective of FTOLN and TNOP is to provide stability to models which exhibit contact chattering
due to changing contact status. If the values you use for these tolerances are too small, the solution
will require more iterations. If the values are too large, however, the accuracy of the solution will
be affected as a certain amount of penetration or tensile contact force is allowed.
```

## How to control the friction (MU, TB,FRIC, TAUMAX, COHE, FACT/DC)

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt — 3.9.5.1 Introduction + 3.9.5.2 Coefficient of Friction + 3.9.5.3 TAUMAX/COHE + 3.9.5.4 Static/Dynamic (lines 3479–3653)

```
3.9.5.1. Introduction
In the basic Coulomb friction model, two contacting surfaces can carry shear stresses up to a certain
magnitude across their interface before they start sliding relative to each other. This state is known
as sticking. The Coulomb friction model defines an equivalent shear stress τ, at which sliding on
the surface begins as a fraction of the contact pressure p (τ = µp + COHE, where µ is the friction
coefficient and COHE specifies the cohesion sliding resistance). Once the shear stress is exceeded,
the two surfaces will slide relative to each other. This state is known as sliding.
…
Contact problems involving friction produce unsymmetric stiffnesses. … If frictional stresses have
a substantial influence on the overall displacement field … the symmetric approximation to the
stiffness matrix may provide a low rate of convergence. In such cases, choose the unsymmetric
solution option (NROPT,UNSYM) to improve convergence.

3.9.5.2. Coefficient of Friction
The interface coefficient of friction, MU, is used for the Coulomb friction model. Input MU as a
material property for the contact elements. The Coulomb friction can be isotropic or orthotropic.
Use MU = 0 for frictionless contact. For rough or bonded contact (KEYOPT(12) = 1, 3, 5, or 6),
the program assumes infinite frictional resistance regardless of the specified value of MU.
MU can have dependence on temperature, time, normal pressure, sliding distance, or sliding
relative velocity. …
If you want to change the friction coefficient between load steps, it is recommended you change
it in a ramped fashion. … To avoid this, define friction as a function of time (TB,FRIC and
TBFIELD with TIME specified as the field variable) to slowly ramp the change in friction coefficient.

Defining Isotropic Friction
Isotropic Friction (TB,FRIC,,,ISO) is available for 2D and 3D contact elements. The isotropic friction
model is based on a single coefficient of friction, MU. … You can use either TB command input
(recommended method) or the MP command to specify MU.

Defining Orthotropic Friction
Orthotropic friction is available only for the 3D contact elements (CONTA174, CONTA175, CONTA176,
and CONTA177). The orthotropic friction model is based on two coefficients of friction, MU1 and
MU2, defined in the two principle directions for the element.
• TB,FRIC,,,ORTHO: friction coordinate system always attached to the contact element and rotates
with the contact element.
• TB,FRIC,,,FORTHO: friction coordinate system essentially fixed in space and does not rotate.
• TB,FRIC,,,EORTHO: similar to ORTHO but the friction coefficient in each direction depends upon
the magnitude of total sliding or total velocity.

Example 3.1: Using TBOPT = ORTHO versus TBOPT = FORTHO
TB,FRIC,,,ORTHO     ! TBOPT = ORTHO
TBDATA,,0.2,0.001   ! MU1 = 0.2, MU2 = 0.001
or
TB,FRIC,,,FORTHO
TBDATA,,0.2,0.001

3.9.5.3. Using TAUMAX, FACT, DC, and COHE
The program provides one extension of classical Coulomb friction: real constant TAUMAX is maximum
contact friction with units of stress. This maximum contact friction stress can be introduced so that,
regardless of the magnitude of normal contact pressure, sliding will occur if the friction stress
reaches this value. You typically use TAUMAX when the contact pressure becomes very large (such
as in bulk metal forming processes). TAUMAX defaults to 1.0e20.
Another real constant used for the friction law is the cohesion, COHE (default COHE = 0), which has
units of stress. It provides sliding resistance, even with zero normal pressure.
Two other real constants, FACT and DC are involved in specifying static and dynamic friction coef-
ficients, as described in the next section.

3.9.5.4. Static and Dynamic Friction Coefficients
The coefficient of friction can depend on the relative velocity of the surfaces in contact. Typically,
the static coefficient of friction is higher than the dynamic coefficient of friction.
The program provides the following exponential decay friction model:
FACT = ratio of static to dynamic coefficients of friction. It defaults to the minimum value of 1.0
DC = decay coefficient, which has units of time/length. Therefore, time has some meaning in a
static analysis. DC defaults to zero. When DC is zero, the equation is rewritten to be μ = MU for
the case of sliding and μ = FACT*MU for the case of sticking.
Vrel = slip rate calculated by the program.
For the isotropic friction model, MU is input using the MP command or the TB command as
explained above.
```

## Working APDL example — defining a contact pair with KEYOPT algorithm selection (CONTA172/TARGE169, 2D axisymmetric)

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/models_examples/mwe_run_cone_ecrase/cone_ecrase_pilot_node.txt — contact definition block (lines 145–190)

```
ET,3,conta172,,,,,,,,,,,,
KEYOPT,3,1,0 ! Ux and Uy displacements
KEYOPT,3,2,1 ! Contact algorithm, Penalty function 1? Lagrangian augmented 0, Lagrange multiplier 3, pure lagrange mult 4
KEYOPT,3,3,1  ! Stress state (but no sup elements)
KEYOPT,3,4,3  ! Location of contact detection point : norm…
```

This example confirms the KEYOPT(2) coding used in a real script:
`KEYOPT,<n>,2,0` = augmented Lagrangian (default); `1` = penalty; `3` = Lagrange normal + penalty tangent; `4` = pure Lagrange multiplier. (Same pattern appears in `cone_ecrase_pilot_node2.txt` and `cone_tests.txt`.)

## Element capabilities / choosing S2S vs other formulations

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt — 1.1 Contact Analysis Types (lines 633–680)

```
1.1. Contact Analysis Types
Mechanical APDL provides the following approaches for defining contact interactions:
• Pair-based contact definition
• General contact definition
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt — Pair-Based vs General Contact (lines 34147–34196)

```
it represents bottom surface contact. The contact surface's outward normal must point toward the target
surface.
Pair-Based Contact versus General Contact
There are two methods to define a contact interaction: the pair-based contact definition and the gen-
eral contact definition. Both contact d…
```
and (lines 38189–38234):
```
The pair-based contact definition is usually more efficient and more robust than the general contact
definition. It supports more options and specific contact features.
Pair-Based Contact
In a pair-based contact definition, the 3D line contact elements (CONTA177) are associated with 3D
target …
```

**Summary / practical guidance derived from the above sources:**
- **Setup:** For two deformable 3D bodies, use the pair-based surface-to-surface formulation: `ET` CONTA174 on the contact surface and `ET` TARGE170 on the target surface, then generate the elements over the two faces. For 2D axisymmetric, the analogous pair is CONTA172/TARGE169 (as in the example). The contact surface normal must point toward the target.
- **Algorithm (KEYOPT(2)):** Default is augmented Lagrangian (0) — best general choice; less sensitive to FKN, well-conditioned, but may need extra iterations with mesh distortion. Penalty (1) — simplest, penetration ∝ 1/stiffness, can ill-condition if FKN too high. Lagrange-normal + penalty-tangent (3) — zero normal penetration, small tangential slip, good for frictional sliding, avoids pure-Lagrange chattering; needs FTOLN/TNOP/SLTO; use surface projection (KEYOPT(4)=3,4) with higher-order CONTA174. Pure Lagrange (4) — zero penetration and zero slip, no FKN needed, but adds DOFs (cost), chattering, overconstraint risk, zero diagonal terms (no PCG; use sparse solver), spurious modes in modal/buckling. MPC (2) — for bonded/no-separation assemblies.
- **Stiffness:** `R,<n>,FKN,FTOLN,FKT,SLTO,…`. FKN is a factor (0.1–10, default 1.0; negative = absolute stiffness, units controlled by KEYOPT(3)). FTOLN penetration tolerance (default 0.1 of underlying element depth; <0.2 typical; negative = absolute). FKT tangential factor (default 1.0; KT = FKT·MU·PRES/SLTO). SLTO max elastic slip (default 1% of average contact length). Prefer KEYOPT(10)=0 or 2 so ANSYS updates stiffness automatically; otherwise follow the trial-run procedure (start low on FKN, check penetration vs. iteration count, adjust FKN/FTOLN/SLTO).
- **Friction:** MU via `TB,FRIC` (recommended) or `MP,MU`. `TB,FRIC,,,ISO` + `TBDATA,,MU` for isotropic; `TB,FRIC,,,ORTHO`/`FORTHO`/`EORTHO` + `TBDATA,,MU1,MU2` for orthotropic (3D only). MU=0 → frictionless; rough/bonded (KEYOPT(12)=1,3,5,6) → infinite friction regardless of MU. TAUMAX caps friction stress; COHE adds cohesion; FACT/DC model static/dynamic friction decay; ramp MU over time with TBFIELD when changing between load steps; use NROPT,UNSYM if friction dominates and convergence is slow.
</rag-context>