<rag-context>
[pi-local-rag] RAG subagent: 5 sources, 760 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt (lines 21990-22152 · enclosing doc section)

13.174.4. Contact Algorithm
Four different contact algorithms are implemented in this element (selected by KEYOPT(2)).
• Pure penalty method
• Augmented Lagrangian method (Simo and Laursens([217] (p. 959)))
• Pure Lagrange multiplier method (Bathe([2] (p. 947)))
• Lagrange multiplier on contact normal and penalty on frictional direction
Pure Penalty Method
This method requires both contact normal and tangential stiffness. The main drawback is that the
amount penetration between the two surfaces depends on this stiffness. Higher stiffness values de-
crease the amount of penetration but can lead to ill-conditioning of the global stiffness matrix and
to convergence difficulties. Ideally, you want a high enough stiffness that contact penetration is ac-
575
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
CONTA174 - 3D 8-Node Surface-to-Surface Contact

ceptably small, but a low enough stiffness that the problem will be well-behaved in terms of conver-
gence or matrix ill-conditioning.
The contact traction vector is:
(13.239)
where:
P = normal contact pressure
τ1 = frictional stress in direction 1
τ2 = frictional stress in direction 2
The contact pressure is:
(13.240)
where:
Kn = contact normal stiffness
un = contact gap size
The frictional stress for isotropic friction is obtained by Coulomb's law:
(13.241)
where:
Ks = tangential contact stiffness (input as FKT on R command)
Δui = slip increment in direction i over the current substep; In the case of sticking, Δui is
the elastic slip increment, which represents the reversible tangential motion within the current
substep.
 = equivalent slip increment over the current substep
μiso = coefficient of friction
 = frictional stress in direction i = 1, 2 at the end of previous substep
For orthotropic friction, slip increment and frictional stress are scaled so that
(13.242)
where:
 = scaled tangential contact stiffness in principal direction i = 1, 2
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
576
Element Library

 = slip increment in principal direction i = 1, 2 over the current substep
 = scaled equivalent slip increment over the current substep
μeq = equivalent coefficient of friction
 = scaled frictional stress in principal direction i = 1, 2 at the end of previous substep
For consistency between scaled friction stress and scaled slip increment, the scaled tangential contact
stiffness in principal direction i = 1, 2 must be defined as:
(13.243)
As a special case, when contact friction is used in a steady-state rolling analysis, the frictional stress
calculation is changed to a viscous formulation. The frictional stress for isotropic friction given in
Equation 13.241 (p. 576) is modified as:
(13.244)
where 
 is the slip velocity in direction i. All other symbols have the same meaning as in Equa-
tion 13.241 (p. 576).
Similarly, the orthotropic friction calculation given in Equation 13.242 (p. 576) is modified as:
(13.245)
where 
 is the slip velocity in principle direction i.
Augmented Lagrangian Method
The augmented Lagrangian method is an iterative series of penalty updates to find the Lagrange
multipliers (that is, contact tractions). Compared to the penalty method, the augmented Lagrangian
method usually leads to better conditioning and is less sensitive to the magnitude of the contact
stiffness coefficient. However, in some analyses, the augmented Lagrangian method may require ad-
ditional iterations, especially if the deformed mesh becomes excessively distorted.
The contact pressure is defined by:
(13.246)
where:
ε = compatibility tolerance (input as FTOLN on R command)
λi = Lagrange multiplier component at iteration i
577
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
CONTA174 - 3D 8-Node Surface-to-Surface Contact

The Lagrange multiplier component λi is computed locally (for each element) and iteratively.
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
method also introduces zero diagonal terms in the stiffness matrix, so that iterative solvers (for example,
PCG) can not be used.
The contact traction components (that is, Lagrange multiplier parameters) become unknown DOFs
for each element. The associated Newton-Raphson load vector is:
(13.247)
Lagrange Multiplier on Contact Normal and Penalty on Frictional Direction
In this method only the contact normal pressure is treated as a Lagrange multiplier. The tangential
contact stresses are calculated based on the penalty method (see Equation 13.241 (p. 576)).
This method allows only a very small amount of slip for a sticking contact condition. It overcomes
chattering problems due to contact status change between sliding and sticking which often occurs
in the pure Lagrange Multiplier method. Therefore this algorithm treats frictional sliding contact
problems much better than the pure Lagrange method.
13.174.5.Viscous Damping
Viscous damping is primarily used to damp relative motions between the contact and target surfaces
for open contact. It provides a certain resistance to reduce the risk of rigid body motion. The viscous
damping traction is proportional but opposite to the relative velocities along contact normal or tan-
gential directions:
(13.248)
(13.249)
(13.250)
where:
dn = damping coefficient in normal direction
dt = damping coefficient in tangential direction
The total damping force is calculated by the integration of damping traction over the contact elements.
The damping coefficient is specified as a function of the opening gap:
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
578
Element Library

(13.251)
(13.252)
where:
upinb = pinball radius (real constant PINB)
dn0 = normal contact damping coefficient (real constant FDMN)
dt0 = tangential contact damping coefficient (real constant FDMT)
The contact damping energy can be obtained by integrating damping traction over the contacting
area within the time increment:
(13.253)
where:
Ac = area domain of the contact surface
 = time increment
13.174.6. Energy and Momentum Conserving Contact
To correctly model the physical interaction between contact and target surfaces in a transient dynamic
analysis, the contact forces must maintain force and energy balance, and ensure proper transfer of
linear momentum. This requires imposing additional constraints on relative velocities between contact
and target surfaces (see Laursen and Chawla ([373] (p. 968)), and Armero and Pet cz ([374] (p. 968))).
Impact Constraints and Contact Forces
In Mechanical APDL, the penetration constraints and the relative velocity constraints between contact
and target surfaces are collectively referred to as impact constraints. These constraints can be selected
by setting KEYOPT(7) = 4 for any of the 2D or 3D contact elements and are valid for all types of contact
interactions (flexible-to-flexible, flexible-to-rigid, and rigid-to-rigid) with and without friction.
An automatic time stepping scheme is used to predict the time of impact and adjust the size of the
time increment to minimize penetration. The resulting penetration may not be within the penetration
tolerance specified using real constant FTOLN. Rather, the allowable penetration is decided such that
energy and momentum are conserved. When contact is detected, the relative velocity constraints are
imposed using one of the four contact algorithms: pure penalty method, augmented Lagrangian
method, pure Lagrange multiplier method, or Lagrange multiplier in contact normal and penalty in
frictional direction method. In the case of rough contact (KEYOPT(12) = 1) the relative velocity constraint
is imposed in the tangential direction also to prevent slip. In the case of standard contact (KEYOPT(12)
= 0) with friction, the slip increment and frictional stress are computed by taking the relative velocity
constraint into consideration.
For the pure penalty method, contact pressure P and friction stresses τi for isotropic friction are
defined as:
579
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
CONTA174 - 3D 8-Node Surface-to-Surface Contact


## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 2781-3094 · enclosing doc section)

3.9.2. Element KEYOPTS
Each contact element includes several KEYOPTS. Ansys recommends using the default settings, which
are suitable for most contact problems. For some specific applications, you can override the defaults.
The element KEYOPTS allow you to control several aspects of contact behavior.
• Degrees of freedom (KEYOPT(1)) (p. 169)
• Contact algorithm (defaults to augmented Lagrangian) (KEYOPT(2)) (p. 47)
• Unit control for normal contact stiffness or contact element stress state (KEYOPT(3)) (p. 95)
• Location of contact detection point (KEYOPT(4)) (p. 67)
• CNOF Automated adjustment (KEYOPT(5)) (p. 74)
45
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Set the Real Constants and Element KEYOPTS

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
KEYOPT defaults can vary depending on the environment you are working in. The following table
compares the default values between the various contact creation tools, for both Ansys Mechanical
APDL and Ansys Workbench.
Table 3.3: Summary of KEYOPT Defaults in Different Environments
Ansys
Workbench,
Default
Nonlinear
(standard,
rough)
Ansys
Workbench
Default
Linear
(bonded,
no sep)
General
Contact
(GCGEN
command)
Contact
Wizard
Ansys
Mechanical
APDL
Description
KEYOPT
Auto
Auto
Auto
Auto
Manual
Selects DOF [1]
1
Aug. Lagr.
Aug. Lagr.
Penalty
Aug.
Lagr.
Aug.
Lagr.
Contact Algorithm
2
n/a
n/a
Not
supported
No unit
control
No unit
control
Unit control for
normal contact
3
stiffness or 2D stress
state for underlying
superelements
gauss
gauss
gauss
gauss
gauss
Location of contact
detection point
4
No adjust
No adjust
Not
supported
No
adjust
No
adjust
CNOF adjustment
5
Use default
range
Use default
range
Use default
range
Use
default
range
Use
default
range
Contact stiffnes
variation
6
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
46
Surface-to-Surface Contact (Pair-Based)

Ansys
Workbench,
Default
Nonlinear
(standard,
rough)
Ansys
Workbench
Default
Linear
(bonded,
no sep)
General
Contact
(GCGEN
command)
Contact
Wizard
Ansys
Mechanical
APDL
Description
KEYOPT
No control
No control
No control
No
control
No
control
Element level time
increment control
7
No action
No action
GCDEF
option
No
action
No
action
Symmetric contact
behavior
8
Include all
Exclude all
TBDATA,,C1
Include
all
Include
all
Effect of initial
penetration or gap
9
Between
iterations
Between
iterations
Between
iterations
Between
iterations
Between
iterations
Contact stiffness
update
10
Exclude
Exclude
Include
Exclude
Exclude
Beam/shell thickness
effect
11
n/a
Bonded
TB,INTER,,,TB-
OPT
Standard
Standard
Behavior of contact
surface
12
n/a
n/a
Not
supported
n/a
TEMP
degree
Degree-of-freedom
control for contact
13
of
freedom
involving thermal
shells
n/a
n/a
Not
supported
Iteration-
based
Iteration-
based
Behavior of fluid
penetration load
14
n/a
n/a
Active only
in first load
step
n/a
Active
only in
first load
step
Effect of
stabilization
damping
15
n/a
n/a
Not
supported
n/a
Damping
scaling
factor
Squeal damping
controls
16
Finite sliding
[3]
Small sliding
[2]
Finite sliding
Finite
sliding
Finite
sliding
Sliding behavior
18
1. Manual: requires user to define. Auto: selection is based on DOF of underlying element.
2. The default is small sliding, except in the case of no separation contact with large deflection
(NLGEOM,ON).
3. The default is finite sliding, except in the case of small deflection (NLGEOM,OFF).
Command(s): KEYOPT,ET
GUI: Main Menu> Preprocessor> Element Type> Add/Edit/Delete
3.9.3. Selecting a Contact Algorithm (KEYOPT(2))
For surface-to-surface contact elements, the program offers several different contact algorithms:
47
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Set the Real Constants and Element KEYOPTS

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
semblies and kinematic constraints. See Multipoint Constraints and Assemblies (p. 245) for more in-
formation about how to use this feature.
3.9.3.1. Lagrange Multiplier Method Considerations
Keep the following points in mind when using the Lagrange multiplier methods.
1. The Lagrange multiplier methods (KEYOPT(2) = 3, 4) do not support the Gauss point detection
option (KEYOPT(4) = 0) for surface-to-surface contact. They support the nodal detection options
for surface-to-surface contact and node-to-surface contact. When using these options, be careful
not to overconstrain the model. The model is overconstrained when a contact node has pre-

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 3444-3468 · enclosing doc section)

stiffness, FKN, unless overconstraints are detected. Instead they require chattering control parameters,
FTOLN and TNOP, by which the program assumes that the contact status remains unchanged.
FTOLN is the maximum allowable penetration and TNOP is the maximum allowable tensile contact
pressure.
Note:
A negative contact pressure occurs when the contact status is closed. A tensile contact
pressure (positive) refers to a separation between the contact surfaces, but not necessarily
an open contact status. However, the sign of the contact pressure is switched during
postprocessing.
Note:
For contact force-based models, TNOP is the maximum allowable tensile contact force.
This applies to CONTA175 with KEYOPT(3) = 0 and CONTA177 with KEYOPT(3) = 0 or 4.
The behavior can be described as follows:
• If the contact status from the previous iteration is open and the current calculated penetration
is smaller than FTOLN, then contact remains open. Otherwise the contact status switches to
closed and another iteration is processed.
• If the contact status from the previous iteration is closed and the current calculated contact
pressure is positive but smaller than TNOP, then contact remains closed. If the tensile contact
pressure is larger than TNOP, then the contact status changes from closed to open and the
program continues to the next iteration.
57
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Set the Real Constants and Element KEYOPTS


## 004 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 3152-3210 · sibling doc section)

3.9.4.2. Using FKN and FTOLN
For certain contact problems, you may choose to use the real constant FKN to define a normal
contact stiffness factor. The usual factor range is from 0.1 - 10.0, with a default of 1.0. The default
value should work in most cases. You can also define an absolute normal contact stiffness by spe-
cifying a negative value for FKN.
In addition, FKN can be defined as a function of primary variables by using tabular input (%tab-
name%). The possible primary variables include time, temperature, initial contact detection point
location (at the beginning of solution), contact pressure of the previous iteration (positive PRESSURE
index values indicate compression, negative PRESSURE index values indicate tension), and current
geometric penetration (positive GAP index values indicate penetration, negative GAP index values
indicate an open gap). For more information, see Defining Real Constants in Tabular Format (p. 43).
The user subroutine USERCNPROP.F is also available for defining FKN. To use this subroutine, you
must specify the table name %_CNPROP% as the real constant value. For more information, see
Defining Real Constants via a User Subroutine (p. 45).
If you input an absolute normal contact stiffness by specifying a negative value for FKN, you can
control the units by using KEYOPT(3). By default, the units of the user-specified absolute normal
contact stiffness is FORCE/LENGTH3. You can change the units to FORCE/LENGTH by setting KEYOPT(3)
= 1. This KEYOPT(3) = 1 setting is valid only when a penalty-based algorithm is used (KEYOPT(2) =
0 or 1) and the absolute normal contact stiffness is explicitly specified. Using KEYOPT(3) = 1 is not
recommended in conjunction with nodal detection options (KEYOPT(4) = 1 or 2) if any midside
nodes exist for the CONTA174 3D contact element. (KEYOPT(3) has different meanings in other
situations. For more information, see Using KEYOPT(3) to Control Units of Contact Stiffness and
Stress State (p. 95).)
Note:
The default contact normal stiffness is affected by defined material properties, element
size, and the user-defined penetration tolerance (FTOLN). Many factors may be applied
to the actual contact normal stiffness during the solution. The default contact stiffness
listed in the Contact Manager or by the CNCHECK command may be different from the
actual contact stiffness reported by the ETABLE command. You should check the value
reported by ETABLE to confirm that the appropriate contact normal stiffness is used.
Use real constant FTOLN in conjunction with the augmented Lagrangian method. FTOLN is a toler-
ance factor to be applied in the direction of the surface normal. The range for this factor is less
than 1.0 (usually less than 0.2), with a default of 0.1, and is based on the depth of the underlying
solid, shell, or beam element (see Figure 3.12: Depth of the Underlying Element (p. 42)). This factor
is used to determine if penetration compatibility is satisfied.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
50
Surface-to-Surface Contact (Pair-Based)

Contact compatibility is satisfied if penetration is within an allowable tolerance (FTOLN times the
depth of underlying elements). The depth is defined by the average depth of each individual contact
element in the pair. In most cases, if the program detects penetrations on certain contact nodes
larger than this tolerance, the global solution is still considered unconverged, even though the re-
sidual forces and displacement increments have met convergence criteria. You can also define an
absolute allowable penetration by specifying a negative value for FTOLN. In general, the default
contact normal stiffness is inversely proportional to the final penetration tolerance. The tighter the
tolerance, the higher the contact normal stiffness.
When you use real constant FTOLN in conjunction with KEYOPT(10) = 0 or 2, the normal contact
stiffness (used for the penalty method and the augmented Lagrange method) is updated at each
iteration based on the current mean stress of the underlying elements and the allowable tolerance
(FTOLN times the depth of the underlying elements). See also Using KEYOPT(10) (p. 53).
Note:
When the contact stiffness is too large (for example, 1016), the machine precision may
not guarantee good conditioning of the global stiffness matrix. In this case, you should
scale the force unit in the model if possible.
Note:
FTOLN is also used in the Lagrange multiplier methods (KEYOPT(2) = 3, 4) as a chattering
control parameter (p. 57).

## 005 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 4722-4742 · sibling doc section)

3.9.14.4. Specifying Linear Contact
For bonded and no separation contact, if no other nonlinearities exist in the model (plasticity, large
deformation, or unilateral contact), a nonlinear solution is generally not required to obtain an ac-
curate solution. In this case, it is possible for the program to treat the bonded and no separation
contact types as linear contact. Linear contact is supported for all contact algorithms (KEYOPT(2)),
including Lagrange multiplier surface-based constraints.
To activate linear contact, use the following KEYOPT settings:
KEYOPT(12) = 4, 5, or 6: bonded or no separation contact
KEYOPT(18) = 1: small-sliding logic
KEYOPT(9) = 1 or 5: exclude initial penetration/gap
KEYOPT(2) = any value: contact algorithm
or
KEYOPT(12) = 4, 5, or 6: bonded or no separation contact
KEYOPT(2) = 2: MPC contact
When the above settings are enabled, the contact searching and the factorized stiffness matrix are
performed once in the beginning of the linear analysis, which can result in significant performance
improvement for the entire solution.
Linear contact is not supported for the following scenarios:
• Contact elements used in a general contact definition.
• Rigid-to-flexible contact pairs that have a pilot node and use a non-MPC based contact al-
gorithm (KEYOPT(2) ≠ 2).
</rag-context>