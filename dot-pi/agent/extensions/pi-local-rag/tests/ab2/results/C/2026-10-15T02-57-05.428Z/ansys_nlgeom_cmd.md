<rag-context>
[pi-local-rag] RAG subagent: 1 sources, 3260 ms retrieval.
### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 30797-30996 · enclosing doc section)

-
...
-
-
-
-
-
-
12K+8
SMISC
Z
component
The item and sequence numbers shown are for real pressures. Imaginary pressures are
represented in the same way but have 12K+8 added to them.
SURF159 Assumptions and Restrictions
• The length of the base element must be nonzero.
• The base element must lie on one side of the axisymmetric axis, and the axisymmetric axis must
be on the same plane as the base element (master plane).
• A base element or base node must be associated with one axisymmetric axis (defined via SECTYPE
and SECDATA commands) before generating nodes for general axisymmetric element sections
(NAXIS) or defining an element by node connectivity (E).
• An edge with a removed midside node implies that the displacement varies linearly, rather than
parabolically, along that edge. For more information about the use of midside nodes, see
Quadratic Elements (Midside Nodes) in the Modeling and Meshing Guide.
• You cannot apply a pressure load by applying a surface load to selected areas (SFA).
• The contribution of the element to the mass moment inertia of the whole model is calculated
by element mass multiplied by the square of the coordinates of the elemental centroid. The
moment of inertia may therefore be inaccurate.
• The element does not support the expansion pass of a superelement with large rotation.
• Issuing an /ESHAPE,1 command while PowerGraphics is active causes the program to plot the
elements in 3D and the results on both nodal planes and all integration planes (p. 91) in the
circumferential direction. Otherwise, the program plots the elements in 2D and the results on
the master plane.
• You cannot display surface load symbols (/PSF) for this element.
505
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

• When listing the surface loads for elements (SFELIST), only information for the first facet is re-
turned.
• When plotting contour values via /ESHAPE,1, expanded SURF159 elements are assigned zeroes.
You must therefore deselect SURF159 elements when plotting results such as stresses and strains.
• In postprocessing, print commands return the nodal plane results only.
• Stress stiffening is always included in geometrically nonlinear analyses (NLGEOM,ON). Prestress
effects can be activated via the PSTRES command.
SURF159 Product Restrictions
There are no product-specific restrictions for this element.
TARGE169
2D Target Segment
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Product Restrictions (p.518)
TARGE169 Element Description
TARGE169 is used to represent various 2D "target" surfaces for the associated contact elements (CON-
TA172 (p. 535) and CONTA175 (p. 591)). The contact elements themselves overlay the solid elements
describing the boundary of a deformable body and are potentially in contact with the target surface,
defined by TARGE169.
You can impose translational or rotational displacement, temperature, voltage, magnetic potential, pore
pressure, and concentration on the target segment element. You can also impose forces and moments
on target elements. See TARGE169 in the Mechanical APDL Theory Reference for more details about this
element. To represent 3D target surfaces, use TARGE170 (p. 519), a 3D target segment element.
For rigid targets, these elements can easily model complex target shapes. For flexible targets, these
elements overlay the solid elements describing the boundary of the deformable target body.
Figure 7.169.1: TARGE169 Geometry
K
J
M
N
L
Target Segment
Surface-to-Surface
Contact Element
CONTA172
Parabola
I
K
J
M
Node-to-Surface
Contact Element
CONTA175
n
n
n
X
Y
I
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
506
Element Library

TARGE169 Input Data
The target surface is modeled through a set of target segments. Typically, several target segments make
up one target surface.
Figure 7.169.2: TARGE169 2D Segment Types (p. 509) shows the available segment types for TARGE169.
For any target surface definition, the node ordering of the target segment element is critical for proper
detection of contact. The nodes must be ordered so that, for a 2D surface, the associated contact elements
(CONTA172 (p. 535) or CONTA175 (p. 591)) must lie to the right of the target surface when moving from
target node I to target node J. For a rigid 2D complete circle, contact must occur on the outside of the
circle. Internal contacting is not allowed.
Pair-Based Contact versus General Contact
There are two methods to define a contact interaction: the pair-based contact definition and the gen-
eral contact definition. Both contact definitions can exist in the same model. TARGE169 can be used in
either type of contact definition.
Pair-Based Contact
In a pair-based contact definition, the 2D contact elements (CONTA172 (p. 535) or CONTA175 (p. 591))
are associated with 2D target segment elements (TARGE169) via a shared real constant set. The program
looks for contact interaction only between surfaces with the same real constant set ID (which is greater
than zero). The material ID associated with the contact element is used to specify interaction properties
(such as friction coefficient) defined by MP or TB commands.
The target surface can be either rigid or deformable. For rigid-flexible contact, the rigid surface must
be represented by a target surface. For flexible-flexible contact, one of the deformable surfaces must
be overlaid by a target surface. See Designating Contact and Target Surfaces in the Contact Technology
Guide for more information.
Each target surface can be associated with only one contact surface, and vice-versa. However, several
contact elements could make up the contact surface and therefore come in contact with the same target
surface. Likewise, several target elements could make up the target surface and therefore come in
contact with the same contact surface. For either the target or contact surfaces, you can put many
elements in a single target or contact surface, or you can localize the contact and target surfaces by
splitting the large surfaces into smaller target and contact surfaces, each of which contain fewer elements.
If a contact surface may contact more than one target surface, you must define duplicate contact surfaces
that share the same geometry but relate to separate targets, that is, have separate real constant set
numbers.
General Contact
In a general contact definition, the general contact surfaces are generated automatically by the GCGEN
command based on physical parts and geometric shapes in the model. The program overlays contact
surface elements (CONTA172 (p. 535)) on 2D deformable bodies (on both lower- and higher-order ele-
ments). The general contact definition may also contain target elements (TARGE169) overlaid on the
surfaces of standalone rigid bodies.
The GCGEN command automatically assigns section IDs and element type IDs for each general contact
surface. As a result, each general contact surface consists of contact or target elements that are easily
507
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

identified by a unique section ID number. The real constant ID and material ID are always set to zero
for contact and target elements in the general contact definition.
The program looks for contact interaction among all surfaces and within each surface. You can further
control contact interactions between specific surfaces that could potentially be in contact by using the
GCDEF command. The material ID and real constant ID input on GCDEF identify interface properties
(defined by MP or TB commands) and contact control parameters (defined by the R command) for a
specific contact interaction. Unlike a pair-based contact definition, the contact and target elements in
the general contact definition are not associated with these material and real constant ID numbers.
Considerations for Rigid Targets
Each target segment is a single element with a specific shape, or segment type. The program supports
seven 2D segment types, as described in Table 7.169.1: TARGE169 2D Segment Types, Target Shape
Codes, and Nodes (p. 508). The segment types are defined by one, two, or three nodes and a target
shape code (TSHAPE command) which indicates the geometry (shape) of the element. The segment
location is determined by the nodes.
A radius value is required for the circle segment type. For pair-based contact, the radius is specified by
real constant (R1). For a general contact definition, the radius is specified by section data (the SEC-
TYPE,,CONTACT,RADIUS command with the radius entered on the SECDATA command).
Table 7.169.1: TARGE169 2D Segment Types, Target Shape Codes, and Nodes
R2
R1
Node 3
(DOF)
Node 2
(DOF)[a]
Node1
(DOF)
Segment Type
TSHAPE
None
None
None
2nd corner
pt (UX, UY)
1st corner pt
(UX, UY)
Straight line
LINE
(TEMP)
(VOLT) (AZ)
(TEMP)
(VOLT) (AZ)
None
None
Circle center
pt (UX, UY)
2nd corner
pt (UX, UY)
1st corner pt
(UX, UY)
Arc, clockwise
ARC
(TEMP)
(VOLT) (AZ)
(TEMP)
(VOLT) (AZ)
(TEMP)
(VOLT) (AZ)
None
None
Circle center
pt (UX, UY)
2nd corner
pt (UX, UY)
1st corner pt
(UX, UY)
</rag-context>