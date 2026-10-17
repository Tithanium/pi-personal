<rag-context>
[pi-local-rag] RAG subagent: 3 sources, 2578 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 2781-3094 · enclosing doc section)

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

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 583-680 · chunk range (no structural region))

List of Tables
1.1. Contact Support ..................................................................................................................................... 6
3.1. Summary of Real Constant Defaults in Different Environments ............................................................... 40
3.2. Real Constants and Corresponding Primary Variables for CONTA172, CONTA174, CONTA175, CON-
TA177 ......................................................................................................................................................... 44
3.3. Summary of KEYOPT Defaults in Different Environments ........................................................................ 46
3.4. Contact Status Used in a Linear Analysis .............................................................................................. 139
5.1. Number of Interactions Allowed at Contact Detection Points ............................................................... 157
6.1. Number of Interactions Allowed at Contact Detection Points ............................................................... 166
8.1. KEYOPT Settings for Pair-Based vs. General Contact .............................................................................. 205
8.2. Real Constant Defaults for Pair-Based vs. General Contact .................................................................... 230
14.1. Adaptive Wear Scaling Parameters ..................................................................................................... 316
xv
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
xvi

Chapter 1: Contact Overview
Contact problems are highly nonlinear and require significant computer resources to solve. It is important
that you understand the physics of the problem and take the time to set up your model to run as effi-
ciently as possible.
Contact problems fall into two general classes: rigid-to-flexible and flexible-to-flexible. In rigid-to-flexible
contact problems, one or more of the contacting surfaces are treated as rigid (that is, it has a much
higher stiffness relative to the deformable body it contacts). In general, any time a soft material comes
in contact with a hard material, the problem may be assumed to be rigid-to-flexible. Many metal
forming problems fall into this category. The other class, flexible-to-flexible, is the more common type
of contact. In this case, both (or all) contacting bodies are deformable (that is, they have similar stiff-
nesses). An example of a flexible-to-flexible contact is bolted flanges.
Contact problems present two significant challenges. First, you generally do not know the regions of
contact until you've run the problem. Depending on the loads, material, boundary conditions, and
other factors, surfaces can come into and go out of contact with each other in a largely unpredictable
and abrupt manner. Second, most contact problems need to account for friction. There are several
friction laws and models to choose from, and all are nonlinear. Frictional response can be chaotic,
making solution convergence difficult.
In addition to these two considerations, many contact problems must also address multi-field effects,
such as the conductance of heat, electrical currents, and magnetic flux in the areas of contact.
If you do not need to account for friction in your model, and the interaction between the bodies is always
bonded, you may be able to use the internal multipoint constraint (MPC) feature (available for certain
contact elements) to model various types of contact assemblies and surface-based constraints (see
Multipoint Constraints and Assemblies (p. 245) for more information). Another alternative is to use con-
straint equations or coupled degrees of freedom instead of contact to model these situations (see
Coupling and Constraint Equations in the Modeling and Meshing Guide for more information). The ex-
ternal constraint equations or coupling equations are only suitable for small strain applications.
The following contact overview topics are available:
1.1. Contact Analysis Types
1.2. Comparison of Pair-Based Contact and General Contact
1.3. Contact Element Capabilities
1.1. Contact Analysis Types
Mechanical APDL™ provides the following approaches for defining contact interactions:
• Pair-based contact definition
• General contact definition
1
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

• Node-to-node contact elements
The pair-based contact definition and general contact definition both use surfaces to define contact.
They are suitable for solving either small-sliding or large-sliding contact applications.
The node-to-node contact elements are often used in situations where the location of contact is known
beforehand. These types of contact problems usually involve small relative sliding between contacting
surfaces.
Each approach has unique advantages and limitations. In general, it is recommended that you use pair-
based contact or general contact whenever possible.
A contact simulation using pair-based contact or general contact is defined by specifying the following:
• Surface definitions for the bodies/parts that could potentially be in contact. The surfaces can be either
deformable or rigid.
• Contact pairing and interaction for the surfaces that interact with one another.
• Contact interface behaviors such as friction coefficient. These are specified via MP and TB commands.
• Contact properties and control parameters. These are specified via element real constants (R command).
• Contact formulations and settings. These are specified via contact element key options (KEYOPT
command).
1.2. Comparison of Pair-Based Contact and General Contact
In a pair-based contact definition (p. 15), the contact interaction is defined between a contact surface
consisting of contact elements (CONTA172, CONTA174, CONTA175, or CONTA177) and a target surface
consisting of target elements (TARGE169, TARGE170). Contact elements and target elements from these
two surfaces are assigned the same real constant set ID number, which must be greater than zero. The
program looks for contact interaction only between surfaces with the same real constant set ID. The
material ID of the contact elements is used to specify interaction properties (such as friction coefficient)
via MP or TB commands.
In a general contact definition (p. 187), general contact surfaces are defined. The contact elements
(CONTA172, CONTA174) are overlaid on the exterior surfaces of deformable bodies, and the target ele-
ments (TARGE169, TARGE170) are used to cover standalone rigid bodies. The 3D line contact elements
(CONTA177) are overlaid on 3D beams and on feature edges of 3D deformable bodies and/or perimeter
edges of shell structures. The contact vertex elements (CONTA175) are overlaid on convex corners of
2D or 3D solid bodies and/or shell structures and on endpoints of beam structures. A zero real constant
ID and a zero material ID are assigned to the contact and target elements. However, different section
IDs and contact/target element type IDs are assigned to different general contact surfaces. In other
words, each surface consists of contact or target elements that have a unique section ID. The program
looks for contact interaction among all surfaces, including self-contact (contact within a surface).
The table below compares characteristics of pair-based contact and general contact definitions.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
2
Contact Overview


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
</rag-context>