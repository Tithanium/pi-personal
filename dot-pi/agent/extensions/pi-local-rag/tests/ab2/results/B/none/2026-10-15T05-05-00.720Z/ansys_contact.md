<rag-context>
[pi-local-rag] RAG subagent: 3 sources, 302 ms retrieval.
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


## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 39432-39681 · enclosing doc section)

SDAMP
167
166
165
164
-
NMISC
PLSI
171
170
169
168
-
NMISC
GSLID
175
174
173
172
-
NMISC
R1
179
178
177
176
-
NMISC
R2
Element Status = highest value of status of integration points within the element.
[a]
Penetration = positive value, gap = negative value
[b]
The floating point output format for large integers may lead to incorrect ISEG values. It is
good practice to verify the NMISC values via the *GET command. For example,
*GET,Par,ELEM,N,NMISC,46 returns the ISEG value for node I of element N.
[c]
You can display or list contact results through several POST1 postprocessor commands. The contact-
specific items for PLNSOL, PLESOL, PRNSOL, and PRESOL are:
Contact status
STAT
Contact penetration
PENE
Contact pressure for the traction-based model.
Contact normal force for the force-based model.
PRES
Contact friction stress for the traction-based model.
Friction force for the force-based model.
SFRIC
639
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

Contact total stress (pressure plus friction) for the
traction-based model. Total contact force for the
force-based model.
STOT
Contact sliding distance
SLIDE
Contact gap distance
GAP
Total number of contact status changes during
substep
CNOS
Contact results (I, J, K columns in Table 7.177.3: CONTA177 (3D) Item and Sequence Numbers (p. 638))
are reported at contact nodes for 3D beam-to-surface, edge-to-surface, and parallel beam-to-beam or
edge-to-edge contact. Contact results from crossing beam-to-beam or edge-to-edge contact (IP column
in Table 7.177.3: CONTA177 (3D) Item and Sequence Numbers (p. 638)) are reported at an intersection
point of two crossing beams or edges. When contact from crossing beams or edges is detected, the
associated contact pressure (PRES), the contact frictional stress (SFRIC), and the total stress (STOT) are
superimposed on each nodes. Maximum values are reported for other contact results (STAT, PENE,
SLIDE, GAP, CNOS).
CONTA177 Assumptions and Restrictions
• For line-to-surface contact, the thickness effects of underlying beam or edge elements on the
contact side and underlying shell elements on the target side can be taken into account by setting
KEYOPT(11) = 1.
• This element is nonlinear and requires a full Newton iterative solution, regardless of whether
large or small deflections are specified. An exception to this is when MPC bonded contact is
specified (KEYOPT(2) = 2 and KEYOPT(12) = 5 or 6).
• The normal contact stiffness factor (FKN) must not be so large as to cause numerical instability.
• FTOLN, PINB, and FKOP can be changed between load steps or during restart stages.
• You can use this element in nonlinear static or nonlinear full transient analyses.
• In addition, you can use it in modal analyses, eigenvalue buckling analyses, and harmonic analyses.
For these analysis types, the program assumes that the initial status of the element (that is, the
status at the completion of the static prestress analysis, if any) does not change.
• In a distributed-memory parallel (DMP) processing run, multiple target segments can interact
with this element's contact detection points (KEYOPT(14) > 0) only when the pure mesh-based
domain decomposition method or the frequency-based domain composition method is used.
KEYOPT(14) > 0 is not supported when both the frequency-based and mesh-based domain de-
composition methods are used together in a harmonic analysis (for example, DDOPTION,FREQ,2).
See DDOPTION for more information about the domain decomposition methods used in DMP.
• Only damping defined via KEYOPT(15) is supported. All other damping specifications (Rayleigh
damping, DMPSTR, and so on) are not supported.
• Certain contact features are not supported when this element is used in a general contact
definition. For details, see General Contact in the Contact Technology Guide.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
640
Element Library

CONTA177 Product Restrictions
When used in the product(s) listed below, the stated product-specific restrictions apply to this element
in addition to the general assumptions and restrictions given in the previous section.
Ansys Mechanical Pro 
• Birth and death is not available.
• Debonding is not available.
• User-defined contact is not available.
• User-defined friction is not available.
Ansys Mechanical Premium 
• Debonding is not available.
• User-defined contact is not available.
• User-defined friction is not available.
CONTA178
3D Node-to-Node Contact
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Product Restrictions (p.666)
CONTA178 Element Description
CONTA178 represents contact and sliding between any two nodes of any types of elements. The element
has two nodes with three degrees of freedom at each node with translations in the X, Y, and Z directions.
It can also be used in 2D and axisymmetric models by constraining the UZ degree of freedom. The
element is capable of supporting compression in the contact normal direction and Coulomb friction in
the tangential direction. User-defined friction with the USERFRIC subroutine and user-defined interaction
with the USERINTER subroutine are also allowed. The element may be initially preloaded in the normal
direction or it may be given a gap specification. A longitudinal damper option can also be included.
See CONTA178 in the Mechanical APDL Theory Reference for more details about this element. Other
contact elements, such as COMBIN40 (p. 230), are also available.
641
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

Figure 7.178.1: CONTA178 Geometry
J
I
z
z
x
x
y
y
z
x
y
x z
y
Gap
Z
X
Y
CONTA178 Input Data
The geometry, node locations, and the coordinate system for this element are shown in the CONTA178
figure above. The element is defined by two nodes, an initial gap or interference (GAP), an initial element
status (START), and damping coefficients CV1 and CV2. The orientation of the interface is defined by
the node locations (I and J) or by a user specified contact normal direction. The interface is assumed
to be perpendicular to the I-J line or to the specified gap direction. The element coordinate system has
its origin at node I and the x-axis is directed toward node J or in the user specified gap direction. The
interface is parallel to the element y-z plane. See Generating Contact Elements in the Contact Technology
Guide for more information on generating elements automatically using the EINTF command.
To model proper momentum transfer and energy balance between contact and target surfaces, impact
constraints must be used in transient dynamic analysis. See the description of KEYOPT(7) in the Input
Summary (p. 654) and the contact element discussion in the Mechanical APDL Theory Reference for details.
Contact Algorithms
Four different contact algorithms can be selected:
• Pure Lagrange multiplier method (KEYOPT(2) = 4)
• Lagrange multiplier on contact normal and penalty on frictional (tangential) direction (KEYOPT(2) =
3)
• Augmented Lagrange method (KEYOPT(2) = 0)
• Pure Penalty method (KEYOPT(2) = 1)
The following sections outline these four algorithms.
Pure Lagrange Multiplier
The pure Lagrange multiplier method does not require contact stiffness FKN, FKS. Instead it requires
chattering control parameters TOLN, FTOL, by which Mechanical APDL assumes that the contact status
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
642
Element Library

remains unchanged. TOLN is the maximum allowable penetration and FTOL is the maximum allowable
tensile contact force.
Note:
A negative contact force occurs when the contact status is closed. A tensile contact force
(positive) refers to a separation between the contact surfaces, but not necessarily an open
contact status.
The behavior can be described as follows:
• If the contact status from the previous iteration is open and the current calculated penetration is
smaller than TOLN, then contact remains open. Otherwise the contact status switches to closed and
another iteration is processed.
• If the contact status from the previous iteration is closed and the current calculated contact force is
positive, but smaller than FTOL, then contact remains closed. If the tensile contact force is larger than
FTOL, then the contact status changes from closed to open and Mechanical APDL continues to the
next iteration.
The program provides reasonable defaults for TOLN and FTOL. Consider the following when providing
values for TOLN and FTOL:
• A positive value is a scaling factor applied to the default values.
• A negative value is used as an absolute value (which overrides the default).
The objective of TOLN and FTOL is to provide stability to models which exhibit contact chattering due
to changing contact status. If the values you use for these tolerances are too small, the solution requires
more iterations. However, if the values are too big it affects the accuracy of the solution, since a certain
amount of penetration or tensile contact force are allowed.
Theoretically, the pure Lagrange multiplier method enforces zero penetration when contact is closed
and "zero slip" when sticking contact occurs. However, the pure Lagrange multiplier method adds addi-
tional degrees of freedom to the model and requires additional iterations to stabilize contact conditions.
This increases the computational cost and may even lead to solution divergence if many contact points
are oscillating between sticking and sliding conditions during iterations.
Lagrange Multiplier on Normal and Penalty on Tangent Plane
An alternative algorithm is the Lagrange multiplier method applied on the contact normal and the
penalty method (tangential contact stiffness) on the frictional plane. This method only allows a very
small amount of slip for a sticking contact condition. It requires chattering control parameters TOLN,
FTOL as well as the maximum allowable elastic slip parameter SLTOL. Again, Mechanical APDL provides
default tolerance values which work well in most cases. You can override the default value for SLTOL
by defining a scaling factor (positive value) or an absolute value (negative value). Based on the tolerance,
current normal contact force, and friction coefficient, the tangential contact stiffness FKS can be obtained
automatically. In a few cases, you can override FKS by defining a scaling factor (positive input) or absolute
value (negative input). Use care when specifying values for SLTOL and FKS. If the value for SLTOL is too
large and the value for FKS too small, too much elastic slip can occur. If the value for SLTOL is too small
or the value for FKS too large, the problem may not converge.
643
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

Augmented Lagrange Method
The third contact algorithm is the augmented Lagrange method, which is basically the penalty method
with additional penetration control. This method requires contact normal stiffness FKN, maximum allow-
able penetration TOLN, and maximum allowable slip SLTOL. FKS can be derived based on the maximum
allowable slip SLTOL and the current normal contact force. Mechanical APDL provides a default normal
contact stiffness FKN which is based on the Young's modulus E and the size of the underlying elements.
If Young's modulus E is not found, E = 1x109 is assumed.
You can override the default normal contact stiffness FKN by defining a scaling factor (positive input)
or absolute value (negative input with unit force/length). If you specify a large value for TOLN, the
augmented Lagrange method works as the penalty method. Use care when specifying values for FKN
and TOLN. If the value for FKN is too small and the value for TOLN too large, too much penetration can
occur. If the value for FKN is too large or the value for TOLN too small, the problem may not converge.
Penalty Method
The last algorithm is the pure penalty method. This method requires both contact normal and tangential
stiffness values FKN, FKS. Real constants TOLN, FTOLN, and SLTOL are not used and penetration is no
longer controlled in this method. Default FKN is provided as the one used in the augmented Lagrange
method. The default FKS is given by MU x FKN. You can override the default values for FKN and FKS by
inputting a scaling factor (positive input) or absolute value (negative input) for these real constants.
Contact Normal Definition
The contact normal direction is of primary importance in a contact analysis. By default [KEYOPT(5) = 0
and NX, NY, NZ = 0], Mechanical APDL calculates the contact normal direction based on the initial pos-
itions of the I and J nodes, such that a positive displacement (in the element coordinate system) of
node J relative to node I opens the gap. However, you must specify the contact normal direction for
any of the following conditions:
• If nodes I and J have the same initial coordinates.
• If the model has an initial interference condition in which the underlying elements' geometry overlaps.
• If the initial open gap distance is very small.
In the above cases, the ordering of nodes I and J is critical. The correct contact normal usually points
from node I toward node J unless contact is initially overlapped.
You can specify the contact normal by means of real constants NX, NY, NZ (direction cosines related to
the global Cartesian system) or element KEYOPT(5). The following lists the various options for KEYOPT(5):
</rag-context>