<rag-context>
[pi-local-rag] RAG subagent: 1 sources, 3340 ms retrieval.
### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 91241-91440 · enclosing doc section)

---
---
8n-7
8n-6
---
SMISC
P4n-3
8n-5
8n-4
---
SMISC
P4n-2
8n-3
8n-2
---
SMISC
P4n-1
8n
8n-1
---
SMISC
P4n
SOLID273 Assumptions and Restrictions
• The area of the base element must be nonzero.
• The base element must lie on one side of the axisymmetric axis, and the axisymmetric axis must
be on the same plane as the base element (master plane).
• A base element or base node must be associated with one axisymmetric axis (defined via SECTYPE
and SECDATA commands) before generating nodes for general axisymmetric element sections
(NAXIS) or defining an element by node connectivity (E).
1429
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

• An edge with a removed midside node implies that the displacement varies linearly, rather than
parabolically, along that edge. For more information about the use of midside nodes, see
Quadratic Elements (Midside Nodes) in the Modeling and Meshing Guide.
• Use at least two elements to avoid the hourglass effect.
• You can form a triangular base element by defining duplicate K1 - L1 - O1 node numbers. (See
Degenerated Shape Elements (p. 38) in this document.)
• You cannot apply a pressure load via the SFA command.
• If you specify mixed formulation (KEYOPT(6) = 1), do not miss any midside nodes. You must also
use the sparse solver.
• The contribution of the element to the mass moment inertia of the whole model is calculated
by element mass multiplied by the square of the coordinates of the elemental centroid. The
moment of inertia may therefore be inaccurate.
• Issuing an /ESHAPE,1 command while PowerGraphics is active causes the program to plot the
elements in 3D and the results on both nodal planes and all integration planes (p. 91) in the
circumferential direction; otherwise, the program plots the elements in 2D and the results on
the master plane.
• You cannot display surface load symbols (/PSF) when displaying this element in 3D via the
/ESHAPE command.
• When specifying more than one facet per element edge for PowerGraphics displays (NAXIS,EFA-
CET,NUM, where NUM > 1), Mechanical APDL plots additional results on some planes between
the nodal and integration planes. The results on these planes are interpolated based on the
nodal and integration plane values and are therefore less accurate than the values on the nodal
and interpolation planes. If you do not wish to plot the interpolated values, set NUM = 1 to plot
only the values on nodal and integration planes.
• You cannot increase the number of planar facets per element edge (/EFACET) when displaying
this element in 3D via the /ESHAPE command.
• Print commands in postprocessing print the nodal plane results only.
• The element does not support interpolation of results on a path (defined via PDEF and PATH).
• To model axisymmetric solid surface loads acting on this element, use general axisymmetric
surface element SURF159 (p. 496). (You cannot use this element with surface-effect elements
SURF153 (p. 460) and SURF154 (p. 469).)
• You cannot generate surface-based contact pairs (contact elements CONTA172 (p. 535) and
CONTA174 (p. 562) paired with target elements TARGE169 (p. 506) and TARGE170 (p. 519)) on this
element.
• You can generate surface-based constraints using contact elements CONTA174 (p. 562), CON-
TA175 (p. 591), or CONTA177 (p. 618).
• You can generate node-to-surface contact pairs (contact elements CONTA175 (p. 591) paired with
target elements TARGE170 (p. 519)) and node-to-node contact elements (CONTA178 (p. 641)) on
this element, with the following restrictions:
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1430
Element Library

– When TARGE170 (p. 519) is on the surface of SOLID273, you may have accuracy and convergence
issues if the loading causes large rotations about the axisymmetric axis of SOLID273; you may
also have those issues if the two sides of the contact boundaries have different mesh patterns
in the circumferential direction (caused by different KEYOPT(2) values of SOLID273).
– For TARGE170 (p. 519), KEYOPT(5) = 1 is recommended to control the degrees of freedom used
in MPC bonded and no separation contact. You should not use KEYOPT(5) = 3, 4, or 5 because
these options are force-based constraints.
– In the case of a true axisymmetric condition (SOLID273 with KEYOPT(2) = 1), you should use
2D node-to-surface contact pairs (CONTA175 (p. 591) contact elements paired with
TARGE169 (p. 506) target elements).
In addition, 2D node-to-surface contact pairs cannot constrain out-of-plane displacement if
the model exhibits torsional effects. For such scenarios, you should use the PLANE182 (p. 696)
axisymmetric option with torsion and CONTA172 (p. 535) with KEYOPT(3) = 4
Alternatively, for SOLID273 with KEYOPT(2) = 1, you can use a 3D contact pair (CONTA175 (p. 591)
and TARGE170 (p. 519)) to support out-of-plane contact behavior.
• Stress stiffening is always included in geometrically nonlinear analyses (NLGEOM,ON). Prestress
effects can be activated via the PSTRES command.
• The bolt pretension load modeled by PRETS179 is supported for SOLID273. However, large rota-
tion-based bolt preload (using MPC184 (p. 714)) is not supported.
• The MODE command is only allowed with KEYOPT(2) = 1. When MODE is used, nonlinear geo-
metric analyses and nonlinear material types are not supported.
• This element supports the modal analysis with the Block Lanczos method (see the MODOPT
command) when MODE is used.
• The MODE command is supported in subsequent modal analyses within the linear perturbation
modal analysis.
– In the subsequent modal analysis, multiple load steps are supported. Starting with the second
load step, you must use the fourth option, REFORM, in the SOLVE,ELFORM,,REFORM command
to reconstruct all appropriate element matrices by changing the MODE number. Additionally,
to include the prestress effect in the base static analysis, you must set the LoadControl
option to ALLKEEP when using the PERTURB,MODAL,,,ALLKEEP command.
SOLID273 Product Restrictions
There are no product-specific restrictions for this element.
1431
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

SOLID278
3D 8-Node Thermal Solid
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Product Restrictions (p.1450)
SOLID278 Element Description
SOLID278 has a 3D thermal conduction capability. The element has eight nodes with a single degree
of freedom, temperature, at each node. The element is applicable to a 3D, steady-state or transient
thermal analysis. The element can also account for heat transfer by a mass flow with a prescribed velocity
field (see Mass Transport (Advection) in the Theory Reference). If the model containing the conducting
solid element is also to be analyzed structurally, the element should be replaced by an equivalent
structural element (such as SOLID185 (p. 861)). See SOLID279 (p. 1451) for a similar thermal element, with
mid-edge node capability. For more details about this element, see SOLID278 - 3D 8-Node Homogen-
eous/Layered Thermal Solid in the Theory Reference.
SOLID278 is available in these forms:
• Homogeneous Thermal Solid (KEYOPT(3) = 0, the default) -- See "SOLID278 Homogeneous Thermal
Solid Element Description" (p. 1432).
• Layered Thermal Solid (KEYOPT(3) = 1), or Layered Thermal Solid with through-the-thickness degrees
of freedom (KEYOPT(3) = 2) -- See "SOLID278 Layered Thermal Solid Element Description" (p. 1440).
See  SOLID278  in the Mechanical APDL Theory Reference for more details about this element.
A higher-order version of the SOLID278 element is SOLID279 (p. 1451).
SOLID278 Homogeneous Thermal Solid Element Description
SOLID278 Thermal Solid is suitable for modeling general 3D solid heat conduction. It allows for prism
and tetrahedral degenerations when used in irregular regions. SOLID278 is designed to be a companion
element for SOLID185 (p. 861).
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1432
Element Library

Figure 7.278.1: SOLID278 Homogeneous Thermal Solid Geometry
I
P
K
J
N
M
L
Z
X
Y
5
2
4
3
1
6
O
M
O,P
I
K,L
J
N
Prism Option
I
K,L
J
M,N,O,P
Tetrahedral Option -
not recommended
M,N,O,P
K
J
I
L
Pyramid Option -
not recommended
SOLID278 Homogeneous Thermal Solid Input Data
The geometry and node locations for this element are shown in Figure 7.278.1: SOLID278 Homogeneous
Thermal Solid Geometry (p. 1433). The element is defined by eight nodes and the orthotropic material
properties. The default element coordinate system is along global directions. You may define an element
coordinate system using ESYS, which forms the basis for orthotropic material directions (namely, for
thermal conductivity). Specific heat and density are ignored for steady-state solutions. Properties not
input default as described in the Material Reference.
As described in Coordinate Systems (p. 63), you can use ESYS to orient the material properties and the
temperature gradient and heat flux output. Use RSYS to choose output that follows the material co-
ordinate system or the global coordinate system.
Element loads are described in Element Loading (p. 44). Convection or heat flux (but not both) and
radiation may be input as surface loads at the element faces as shown by the circled numbers on Fig-
ure 7.278.1: SOLID278 Homogeneous Thermal Solid Geometry (p. 1433). Heat generation rates may be
input as element body loads at the nodes. If the node I heat generation rate HG(I) is input, and all
others are unspecified, they default to HG(I).
A mass transport option is available with KEYOPT(11). With this option, you specify the velocity compon-
ents VX, VY, and VZ by issuing BF,,VELO,VX,VY, VZ. There is no restriction on the element Peclet number
(Pe) for this element, and it offers the Streamline Upwind Petrov-Galerkin (SUPG) formulation and Dis-
continuity Capturing (DC) terms that enable convergence for high Pe conditions (see Galerkin or
Streamline Upwind Petrov-Galerkin (SUPG) Formulation in the Thermal Analysis Guide). You can control
</rag-context>