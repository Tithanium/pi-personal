<rag-context>
[pi-local-rag] RAG subagent: 3 sources, 290 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 30797-30996 · enclosing doc section)

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

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 2079-2278 · enclosing doc section)

3.9. Set the Real Constants and Element KEYOPTS
The program uses real constants and KEYOPTs to control contact behavior using surface-to-surface
contact elements. For more information in addition to what is presented here, refer to the individual
contact element descriptions in the Element Reference.
If you decide the real constant and KEYOPT settings you have specified for a particular contact pair are
not appropriate, you can use the CNCHECK,RESET command to reset all values back to their default
settings. Some real constants and key options are not affected by this command. See CNCHECK for
details.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
36
Surface-to-Surface Contact (Pair-Based)

In many cases, certain default settings may not be appropriate for your specific model. You can issue
the CNCHECK,AUTO command to obtain optimized KEYOPT and real constant settings in terms of ro-
bustness and efficiency. Usually, only the undefined or default KEYOPT settings and real constants are
changed. Refer to the CNCHECK command description for details of which settings are typically changed.
You should always verify these changes by issuing the CNCHECK,DETAIL command to list current contact
pair properties. If necessary, you can overwrite the optimized settings by redefining specific KEYOPTs
(KEYOPT command) and real constants (RMODIF command).
The following related topics are available:
3.9.1. Real Constants
3.9.2. Element KEYOPTS
3.9.3. Selecting a Contact Algorithm (KEYOPT(2))
3.9.4. Determining Contact Stiffness and Allowable Penetration
3.9.5. Choosing a Friction Model
3.9.6. Selecting Location of Contact Detection
3.9.7. Selecting a Sliding Behavior
3.9.8. Adjusting Initial Contact Conditions
3.9.9. Modeling Interference Fit
3.9.10. Physically Moving Contact Nodes Toward the Target Surface
3.9.11. Physically Moving the Target Body Toward the Contact Surface
3.9.12. Determining Contact Status and the Pinball Region
3.9.13. Avoiding Spurious Contact in Self Contact Problems
3.9.14. Selecting Surface Interaction Models
3.9.15. Using KEYOPT(3) to Control Units of Contact Stiffness and Stress State
3.9.16. Modeling Contact with Superelements
3.9.17. Modeling Contact for 2D Axisymmetric Elements with Torsion
3.9.18. Applying Contact Stabilization Damping
3.9.19. Modeling Interface Damping in Assembled Structures
3.9.20. Accounting for Thickness Effect
3.9.21. Using Time Step Control and Impact Constraints
3.9.22. Using the Birth and Death Options
3.9.1. Real Constants
Use the R and RMORE commands to define real constants. The first two real constants, R1 and R2,
are used to define the geometry of the target surface elements. The remaining are used by the contact
surface elements.
• R1 and R2 (p. 21) define the target element geometry.
• FKN (p. 49) defines a normal contact stiffness factor. [1] [2]
• FTOLN (p. 47) is a factor based on the thickness of the element which is used to calculate al-
lowable penetration. [2]
37
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Set the Real Constants and Element KEYOPTS

• PINB (p. 89) defines a "pinball" region.
• PZER (p. 54) defines pressure at zero penetration.
• CZER (p. 54) defines initial clearance.
• TAUMAX (p. 58) specifies the maximum contact friction.
• CNOF (p. 74) specifies the positive or negative offset value applied to the contact surface.
• FKOP (p. 91) specifies the stiffness factor applied when contact opens.
• FKT (p. 49) specifies the tangent contact stiffness factor. [2]
• COHE (p. 58) specifies the cohesion sliding resistance.
• TCC (p. 171) specifies the thermal contact conductance coefficient.
• FHTG (p. 174) specifies the fraction of frictional dissipated energy converted into heat.
• SBCT (p. 172) specifies the Stefan-Boltzmann constant.
• RDVF (p. 172) specifies the radiation view factor.
• FWGT specifies the weight factor for the distribution of heat between the contact and target
surfaces for thermal contact (p. 174) or for electric contact (p. 177).
• ECC (p. 176) specifies the electric contact conductance or capacitance per unit area.
• FHEG (p. 177) specifies the fraction of electric dissipated energy converted into heat.
• FACT (p. 58) specifies the ratio of static to dynamic coefficients of friction.
• DC (p. 58) specifies the decay coefficient for static/dynamic friction.
• SLTO (p. 49) controls maximum sliding distance when MU is nonzero and the tangent contact
stiffness (FKT) is updated at each iteration (KEYOPT(10) = 0 or 2) or when KEYOPT(2) = 3.
• TNOP (p. 57) specifies the maximum allowable tensile contact pressure. [2]
• TOLS (p. 67) adds a small tolerance that extends the edge of the target surface.
• MCC (p. 178) specifies the magnetic contact permeance (3D only).
• PPCN (p. 126) specifies the pressure-penetration criterion (surface contact elements only).
• FPAT (p. 126) specifies the fluid penetration acting time (surface contact elements only).
• COR (p. 279) specifies the coefficient of restitution for impact between rigid bodies using impact
constraints (KEYOPT(7) = 4).
• STRM (p. 79) specifies load step number for ramping penetration, or starting time for ramping
contact stiffness.
• FDMN (p. 98) specifies the stabilization damping factor in the normal direction.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
38
Surface-to-Surface Contact (Pair-Based)

• FDMT (p. 98) specifies the stabilization damping factor in the tangential direction.
• FDMD (p. 63) specifies the destabilizing squeal damping factor (3D only).
• FDMS (p. 63) specifies the stabilizing squeal damping factor (3D only).
• TBND (p. 93) specifies the critical bonding temperature.
• WBID is an internal contact pair ID (used only by the Results Tracker in Workbench Mechanical)
• PCC (p. 179) specifies the pore fluid contact permeability coefficient.
• PSEE (p. 179) specifies the pore fluid seepage.
• ABPP (p. 179) specifies the ambient pore pressure.
• FPFT (p. 179) specifies the gap pore fluid flow participation factor.
• FPWT (p. 179) specifies the gap pore fluid flow distribution weighting factor.
• DCC (p. 183) specifies the diffusivity coefficient.
• DCON (p. 183) specifies the diffusive convection coefficient.
• ABDC (p. 183) specifies the ambient concentration.
• BSRL (p. 133) identifies the real constant set ID of the original (base) contact pair after a spitting
operation.
• KSYM (p. 133) identifies the real constant set ID of the companion pair for a symmetric pair or
self contact (determined by the splitting logic).
• TFOR (p. 120) specifies the pair-based force convergence tolerance.
• TEND (p. 79) defines the ending time for ramping contact stiffness.
1. When the contact element is used as part of a forced-distributed constraint (p. 256) and KEYOPT(7)
= 2 on the target element, FKN is used to define weighting factors in tabular format (p. 43) with
node number as the primary variable.
2. When the relaxation option (p. 272) is enabled (KEYOPT(11) = 1 on the target element) for a surface-
based constraint (p. 256) or a rigid body (p. 269), FKN and FKT are translational relaxation coefficient
and rotational relaxation coefficient, respectively, and tabular input is not supported. In addition,
FTOLN and TNOP are translational tolerance and rotational tolerance, respectively.
39
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Set the Real Constants and Element KEYOPTS

Real constant defaults can vary depending on the environment you are working in. The following
table compares the program default values with those of the Ansys Workbench product.
Table 3.1: Summary of Real Constant Defaults in Different Environments
Ansys
Workbench
Default
Ansys
Mechanical
APDL
Default
Description
Real Constants
Name
No.
n/a
0
Radius associated with target
geometry
R1 [4]
1
Calculated
by
program
Target radius (CONTA177)
n/a
0
Radius associated with target
geometry
R2 [4]
2
1
Superelement thickness
Calculated
by
program
Contact radius (CONTA177)
[1]
1
Normal penalty stiffness factor
FKN
3
0.1
0.1
Penetration tolerance factor
FTOLN
4
[2]
[2]
Pinball region
PINB
6
[7]
[7]
Pressure at zero penetration
PZER
7
0.01
0.01
Initial contact clearance factor
CZER
8
1.00E+20
1.00E+20
Maximum friction stress
TAUMAX
9
0
0
Contact surface offset
CNOF
10
1
1
Contact opening stiffness
FKOP
11
1
1

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 884-933 · chunk range (no structural region))

7.172.2. CONTA172 Element Output Definitions ......................................................................................... 554
xix
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Element Reference

7.172.3. CONTA172 Item and Sequence Numbers ....................................................................................... 558
7.174.1. CONTA174 Real Constants ............................................................................................................ 580
7.174.2. CONTA174 Element Output Definitions ......................................................................................... 583
7.174.3. CONTA174 Item and Sequence Numbers ....................................................................................... 587
7.175.1. CONTA175 Real Constants ............................................................................................................ 605
7.175.2. CONTA175 Element Output Definitions ......................................................................................... 609
7.175.3. CONTA175 (3D) Item and Sequence Numbers ............................................................................... 613
7.175.4. CONTA175 (2D) Item and Sequence Numbers ............................................................................... 615
7.177.1. CONTA177 Real Constants ............................................................................................................ 633
7.177.2. CONTA177 Element Output Definitions ......................................................................................... 635
7.177.3. CONTA177 (3D) Item and Sequence Numbers ............................................................................... 638
7.178.1. CONTA178 Real Constants ............................................................................................................ 659
7.178.2. Real Constants and Corresponding Primary Variables for CONTA178 .............................................. 660
7.178.3. CONTA178 Element Output Definitions ......................................................................................... 662
7.178.4. CONTA178 Item and Sequence Numbers ....................................................................................... 663
7.180.1. LINK180 Element Output Definitions ............................................................................................. 673
7.180.2. LINK180 Item and Sequence Numbers .......................................................................................... 675
7.181.1. SHELL181 Element Output Definitions .......................................................................................... 691
7.181.2. SHELL181 Item and Sequence Numbers ........................................................................................ 693
7.182.1. PLANE182 Element Output Definitions .......................................................................................... 701
7.182.2. PLANE182 Item and Sequence Numbers ....................................................................................... 703
7.183.1. PLANE183 Element Output Definitions .......................................................................................... 710
7.183.2. PLANE183 Item and Sequence Numbers ....................................................................................... 712
7.184link.1. MPC184 Rigid Link/Beam Element Output Definitions .............................................................. 723
7.184link.2. MPC184 Rigid Link/Beam Item and Sequence Numbers ........................................................... 724
7.184slid.1. MPC184 Slider Element Output Definitions .............................................................................. 728
7.184slid.2. MPC184 Slider Item and Sequence Numbers ............................................................................ 729
7.184revo.1. MPC184 Revolute Joint Element Output Definitions ................................................................ 734
7.184revo.2. MPC184 Revolute Joint Element - NMISC Output .................................................................... 736
7.184revo.3. MPC184 Revolute Joint Item and Sequence Numbers - SMISC Items ........................................ 737
7.184revo.4. MPC184 Revolute Joint Item and Sequence Numbers - NMISC Items ....................................... 738
7.184univ.1. MPC184 Universal Joint Element Output Definitions ............................................................... 744
7.184univ.2. MPC184 Universal Joint Element - NMISC Output .................................................................... 745
7.184univ.3. MPC184 Universal Joint Item and Sequence Numbers - SMISC Items ....................................... 746
7.184univ.4. MPC184 Universal Joint Item and Sequence Numbers - NMISC Items ....................................... 747
7.184slot.1. MPC184 Slot Joint Element Output Definitions ........................................................................ 752
7.184slot.2. MPC184 Slot Joint Element - NMISC Output ............................................................................. 753
7.184slot.3. MPC184 Slot Joint Item and Sequence Numbers - SMISC Items ................................................ 754
7.184slot.4. MPC184 Slot Joint Item and Sequence Numbers - NMISC Items ................................................ 755
7.184poin.1. MPC184 Point-in-plane Joint Element Output Definitions ....................................................... 760
7.184poin.2. MPC184 Point-in-plane Joint Element - NMISC Output ............................................................ 761
7.184poin.3. MPC184 Point-in-plane Joint Item and Sequence Numbers - SMISC Items ............................... 762
7.184poin.4. MPC184 Point-in-plane Joint Item and Sequence Numbers - NMISC Items .............................. 763
7.184tran.1. MPC184 Translational Joint Element Output Definitions .......................................................... 768
</rag-context>