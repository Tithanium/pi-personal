<rag-context>
[pi-local-rag] RAG subagent: 3 sources, 251 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 2781-2980 · enclosing doc section)

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

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 5363-5562 · enclosing doc section)

4
---
Stabilized pressure formulation
SOLID285 (p. 1493)
The hydrostatic pressure has an interpolation function one order lower than the one for volumetric
strain. Therefore, elastic strain only agrees with stress in an element on the average instead of point-
wise.
87
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Continuum Stress Elements

For current-technology mixed u-P elements, the volume constraint equation is checked for each
element of a nonlinear analysis. The number of elements in which the constraint equation is not
satisfied is reported in the output file. The default tolerance for the volumetric compatibility or
volume constraint check is 1.0 x 10-3. You can change this value if necessary (CNVTOL).
For the SOLID285 (p. 1493) element, hydrostatic pressure is added as a degree of freedom at each
node. The incompressibility is therefore checked at each node (similar to forces). For more inform-
ation, see the documentation for CNVTOL.
The mixed u-P formulation is not needed in plane stress; the incompressibility condition is assumed,
and the thickness is adjusted based on this incompressible assumption. For 2D elements
PLANE182 (p. 696) and PLANE183 (p. 704), using the mixed u-P formulation with either of the plane
stress options (KEYOPT(3) = 0 or 3), the program resets any KEYOPT(6) setting to 0 automatically
for pure displacement formulation.
5.1.3.3. Applications of Mixed u-P Formulations
Incompressible material behavior can be divided into two categories: fully incompressible materials
and nearly incompressible materials. Typical fully incompressible materials are hyperelastic materials.
A current-technology element with mixed u-P formulation or SOLID285 (p. 1493) is required to
model this material behavior. For element SOLID187 (p. 896), set KEYOPT(6) = 1.
Nearly incompressible materials include hyperelastic materials and elastoplastic materials. The current-
technology elements with mixed u-P formulation and SOLID285 (p. 1493) are available for nearly in-
compressible hyperelastic materials.
The best element choice varies from problem to problem, as indicated in these general guidelines:
• For material behavior with very small compressibility: Use a current-technology element
with mixed u-P formulation or SOLID285 (p. 1493).
• For moderate compressibility: Use PLANE182 (p. 696)/SOLID185 (p. 861) with  (most effi-
cient), a current-technology element with mixed u-P formulation, or SOLID285 (p. 1493).
• When deformation is highly confined: Use a current-technology element with mixed u-P
formulation.
Nearly incompressible elastoplastic materials are materials with Poisson's ratio close to 0.5, or
elastoplastic materials undergoing very large plastic deformation. For such cases, especially when
the deformation is close to being fully incompressible, the mixed u-P formulation of the current-
technology elements and SOLID285 (p. 1493) is more robust, yielding better performance. Try pure
displacement formulation (KEYOPT(6) = 0) first, however, because the extra pressure degrees of
freedom are involved in mixed formulation. If you are using mixed formulation with element SOL-
ID187 (p. 896), it is good practice to specify hydrostatic pressure interpolation (KEYOPT(6) = 2).
5.1.3.4. Mixed u-P Models and Overconstraint or No Unique Solution
Avoid overconstrained models when using current-technology elements (p. 36) with mixed u-P
formulation. An overconstrained model means that globally or locally, the number of displacement
degrees of freedom without any prescribed values (Nd) is less than the number of hydrostatic
pressure degrees of freedom (Np). Np can be calculated by the number of elements times the
number of pressure degrees of freedom within each element. (See Table 5.1: Number of Independent
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
88
Elements for Stress Analysis

Pressure Degrees of Freedom in One Element (p. 87) for the specific numbers used with the current-
technology elements.) If different type elements are included, Np is the summation of the products
over each type of mixed formulation element. The overconstrained problem can be overcome by
increasing the number of nodes without any displacement boundary conditions, or by refining the
mesh. The optimal values for Np and Nd are Nd/Np = 2 for 2D problems and Nd/Np = 3 for 3D
problems.
On the other hand, SOLID285 (p. 1493) is not likely to be overconstrained. At each node, it has one
pressure degree of freedom and three degrees of freedom (UX, UY, and UZ). These are the best
values for Nd/Np.
When the mixed u-P formulation of the current-technology plane and solid elements is applied to
fully incompressible hyperelastic materials, you must also avoid the "no unique solution" situation.
No unique solution occurs if all boundary nodes have prescribed displacements in each direction
and the material is fully incompressible. Since hydrostatic pressure is independent from deformation,
it should be determined by the force/pressure boundary condition. If no force/pressure boundary
condition is applied, the hydrostatic pressure cannot be determined, or the solution is not unique.
In this case, any stress field in equilibrium would be still in equilibrium and not cause any further
deformation by adding an arbitrary value of hydrostatic pressure. This problem can be solved simply
by having at least one node on the boundary in at least one direction without a prescribed displace-
ment boundary condition. This direction cannot be the tangential direction of the boundary at this
node. That means the solution is the particular one with zero force at the node in that direction
where no displacement is prescribed.
5.1.4. Generalized Plane Strain Options
The generalized plane strain feature assumes a finite deformation domain length in the Z direction,
rather than the infinite value assumed for standard plane strain. Generalized plane strain, therefore,
gives more practical results for deformation problems where the Z-direction dimension is not long
enough. It also offers a more efficient way to simulate certain 3D deformations using 2D element
options.
The deformation domain or structure is formed by extruding a plane area along a curve with a constant
curvature, as shown in the following figure:
Figure 5.1: Generalized Plane Strain Deformation
Starting Plane
Starting Point
Ending Point
Ending Plane
Fiber Direction
Y
X
Z
89
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Continuum Stress Elements

The extrusion begins at the starting (or reference) plane and stops at the ending plane. The curve
direction along the extrusion path is called the fiber direction. The starting and ending planes must
be perpendicular to this fiber direction at the beginning and ending intersections.
If the boundary conditions and loads in the fiber direction do not change over the course of the
curve, and if the starting plane and ending plane remain perpendicular to the fiber direction during
deformation, then the amount of deformation of all cross sections is identical throughout the curve,
and does not vary at any curve position in the fiber direction. Any deformation, therefore, can be
represented by the deformation on the starting plane, and the 3D deformation can be simulated by
solving the deformation problem on the starting plane. The existing plane strain and axisymmetric
options are particular cases of the generalized plane strain option.
All inputs and outputs are in the global Cartesian coordinate system. The starting plane must be the
X-Y plane, and must be meshed. The applied nodal force on the starting plane is the total force along
the fiber length. The geometry in the fiber direction is specified by the rotation about X and Y of the
ending plane and the fiber length passing through a point that you specify on the starting plane,
called the starting (or reference) point. The starting point creates an ending point on the ending
plane through the extrusion process. The boundary conditions and loads in the fiber direction are
specified by applying displacements or forces at the ending point. This ending point can be different
from regular nodes, in that it is designated by the same X-Y coordinates that are fixed in plane during
deformation.
The generalized plane strain option introduces three new degrees of freedom for each element. Two
internal nodes are created automatically at the solution stage for the generalized plane strain option
to carry the extra three degrees of freedom. You can apply boundary conditions and loads and check
the results of the fiber length and rotation angle changes, and reaction forces, using the commands
GSBDATA, GSGDATA, GSSOL, and GSLIST. The results of the fiber length change, rotation angle
change, and reaction forces can also be viewed through OUTPR.
The fiber length change is positive when the fiber length increases. The sign of the rotation angle or
angle change is determined by how the fiber length changes when the coordinates of the ending
point change. If the fiber length decreases when the X coordinate of the ending point increases, the
rotation angle about Y is positive. If the fiber length increases when the Y coordinate of the ending
point increases, the rotation angle about X is positive.
In Eigenvalue analyses, such as Eigen buckling and modal analysis, the generalized plane strain option
usually reports fewer Eigenvalues and Eigenvectors than you would obtain in a 3D analysis. Because
it reports only homogeneous deformation in the fiber direction, generalized plane strain employs
only three degrees of freedom to account for these deformations. The same 3D analysis would incor-
porate many more degrees of freedom in the fiber direction.
Because the mass matrix terms relating to degrees of freedom in the fiber direction are approximated
for modal and transient analyses, you cannot use the lumped mass matrix for these types of analyses,
and the solution may be slightly different from regular 3D simulations when any of the three designated
degrees of freedom is not restrained.
5.1.5. Axisymmetric Elements with Nonaxisymmetric Loads
Axisymmetric problems should be modeled using axisymmetric elements. An axisymmetric model
greatly reduces the modeling and analysis time compared to that of an equivalent 3D model.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
90
Elements for Stress Analysis

If loading is also axisymmetric, the analysis is relatively straightforward. However, loading often varies
around the circumference. Two methods are available for handling nonaxisymmetric loading:
• General Axisymmetric Elements (p. 91) -- Support any type of material or loading
• Harmonic Axisymmetric Elements (p. 98) -- Restricted to linear materials and sinusoidal loading.
5.1.5.1. General Axisymmetric Elements
Different from harmonic axisymmetric elements (p. 98), general axisymmetric elements (SOL-
ID272 (p. 1412), SOLID273 (p. 1422), and SURF159 (p. 496)) introduce the Fourier series into the interpol-
ation functions to describe the change of displacements in the circumferential (θ) direction. The
elements can therefore apply to any analysis type, including geometric nonlinear analyses, and can
support any load and deformation mode. For more information, see SOLID272 - General Axisymmetric
Solid with 4 Base Nodes and SOLID273 - General Axisymmetric Solid with 8 Base Nodes in the
Mechanical APDL Theory Reference. For an example problem using general axisymmetric elements,
see Nonlinear Transient Analysis of a Camshaft Assembly in the Technology Showcase: Example
Problems.
The elements can have any axis as the axisymmetric axis (defined via SECTYPE and SECDATA). You
need only define base elements on a flat plane.
General Axisymmetric Element Terminology
The plane on which quadrilaterals or triangles are defined is called the master plane. The
quadrilaterals, triangles, or lines on the master plane are called base elements, and the nodes
of the quadrilaterals, triangles, and lines are called base nodes.
A nodal plane (copied from the master plane) is a radial plane of Fourier nodes. There are n
nodal planes (where KEYOPT(2) = n), equally spaced around the circumference.
An integration plane sits equally between any two adjacent nodal planes. Integration points
in the circumferential direction are located on both the nodal and integration planes. For
more information, see SOLID272 - General Axisymmetric Solid with 4 Base Nodes in the
Mechanical APDL Theory Reference.
NAXIS automatically creates a full 3D finite-element model using the base elements, the axisym-
metric axis, and the number of Fourier nodes specified via KEYOPT(2). The axisymmetric axis must
be on the master plane, and the base elements must be on one side of the axis. A base element
or base node must be associated with one axisymmetric axis before issuing NAXIS. All generated
nodes are equally distributed circumferentially.
The default element coordinate system is a cylindrical coordinate system having the axisymmetric
axis as z, the origin defined via SECDATA, and θ = 0 at the master plane. The right-hand rule de-
termines the direction of θ, resulting in x(r), y(θ), and z from the right-hand coordinate system, as
shown:
91
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Continuum Stress Elements

Figure 5.2: General Axisymmetric Elements and Their Coordinate Systems (KEYOPT(2) = 3)
The displacements in the r, θ, and z directions, however, are interpolated by
ui = hi(s,t)(c1 + a1cosθ + b1sinθ + a2cos2θ + b2sin2θ + a3cos3θ + b3sin3θ . . .)
where
i = r, θ, z
and
hi(s,t) is the standard interpolation function for 2D elements.
The nodes can have their own coordinate systems defined in any direction, as is the case with the
nodes of any other solid element. For more detailed information, see General Axisymmetric Solids
in the Mechanical APDL Theory Reference.
General axisymmetric elements differ from harmonic axisymmetric elements (p. 98) in that you do
not specify the symmetric and unsymmetric terms, input peak values of loads, and solve for each
term as one load step. Instead, you apply all physical loads (forces and displacements) at the nodes

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 583-632 · chunk range (no structural region))

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
</rag-context>