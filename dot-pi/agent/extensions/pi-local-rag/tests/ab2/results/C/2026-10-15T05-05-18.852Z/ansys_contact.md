<rag-context>
[pi-local-rag] RAG subagent: 5 sources, 5456 ms retrieval.
### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/Ansys-mechanical-apdl-technology-demonstration-guide.txt (lines 14282-14481 · enclosing doc section)

Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
380
Modal and Harmonic Frequency Analyses of an Automotive Suspension Assembly
Using CMS

The following table shows the elapsed and CPU times for modal analysis using the full and CMS models
for 100 frequencies. Significant improvement in solution time is achieved during the use pass via the
CMS method.
Table 25.2:  Comparison of CPU and Elapsed Times for Modal Analysis
CMS Fixed Interface
Full
Model
No of Modes =
100
2022.670
Gen
Pass
2034.280
CPU Time (s)
4.630
Use
Pass
1336.000
Gen
Pass
1291.000
Elapsed Time (s)
3.000
Use
Pass
25.7.2. Full Harmonic Analysis Comparison of Accuracy and Efficiency
The harmonic analysis is conducted over the frequency range of 162 Hz to 200 Hz in 20 substeps. The
following table compares the CMS and full model response amplitudes for the two response nodes.
Table 25.3:  Comparison of Response Amplitudes for Full and CMS Models
Node # 63134
Node # 63121
% Diff
CMS
Fixed
Interface
Full
Model
Freq (Hz)
% Diff
CMS
Fixed
Interface
Full
Model
Freq (Hz)
0.78
43.7604
44.1064
162
0.25
39.7493
39.65
162
0.93
48.237
48.6884
164
0.05
40.896
40.8758
164
1.01
51.9039
52.4358
166
0.10
41.9335
41.9754
166
1.07
55.4024
56.0015
168
0.21
43.4692
43.5616
168
1.11
59.0597
59.7247
170
0.30
45.7711
45.9102
170
1.16
62.7696
63.5063
172
0.38
48.7638
48.9518
172
1.22
65.905
66.7185
174
0.46
51.9681
52.2104
174
1.30
67.3727
68.2576
176
0.55
54.4813
54.7814
176
1.39
66.1534
67.0837
178
0.63
55.3164
55.668
178
1.48
62.1716
63.1036
180
0.70
54.1044
54.4876
180
1.56
56.4547
57.3466
182
0.75
51.3783
51.7678
182
1.62
50.3119
51.1398
184
0.78
48.0481
48.4247
184
1.67
44.6201
45.3776
186
0.78
44.8127
45.1665
186
1.71
39.7395
40.4304
188
0.77
42.0154
42.3427
188
1.74
35.7165
36.3475
190
0.75
39.7523
40.0521
190
1.75
32.4621
33.0387
192
0.71
37.9946
38.2657
192
1.73
29.8435
30.3676
194
0.65
36.6556
36.8948
194
1.66
27.7175
28.1851
196
0.56
35.6126
35.8121
196
381
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
Results and Discussion


### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 31317-31516 · enclosing doc section)

When relaxation in enabled (KEYOPT(11) = 1), the following contact element real constants
are used: FKN and FKT are translational and rotational relaxation coefficients. FTOLN and
TNOP are translational and rotational relaxation tolerances, respectively.
Note:
KEYOPT(11) is not supported for target elements used in a general contact definition.
KEYOPT(12)
Thermal expansion effect applied to rigid surface constraints defined using the MPC approach or
the Lagrange Multiplier method (KEYOPT(2) = 2 or 3 on the contact element), and to rigid bodies:
:
0 -- 
Do not include thermal expansion.
1 -- 
Include thermal expansion
Note:
KEYOPT(12) is not supported for target elements used in a general contact definition.
TARGE169 Output Data
The solution output associated with the element is shown in Table 7.169.2: TARGE169 Element Output
Definitions (p. 517). The following notation is used:
The Element Output Definitions table uses the following notation:
A colon (:) in the Name column indicates that the item can be accessed by the Component Name
method (ETABLE, ESOL). The O column indicates the availability of the items in the file jobname.out.
The R column indicates the availability of the items in the results file.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
516
Element Library

In either the O or R columns,“Y” indicates that the item is always available, a letter or number refers
to a table footnote that describes when the item is conditionally available, and “-” indicates that the
item is not available.
Table 7.169.2: TARGE169 Element Output Definitions
R
O
Definition
Name
Y
Y
Element number
EL
Y
Y
Nodes I, J, and K
NODES
Y
Y
Target surface number (assigned by the program)
ITRGET
Y
Y
Segment shape type
TSHAPE
[a]
[a]
Segment numbering
ISEG
Y
Y
Actual applied fluid penetration pressure (magnitude of normal and
tangential)
CONT:FPRS
Y
-
Actual applied fluid penetration normal pressure
FPRSN
Y
-
Actual applied fluid penetration tangential pressure
FPTP
An internal segment number determined by the program. ISEG for the target element has
a different meaning than ISEG reported for the contact element.
[a]
You can display or list the actual fluid pressure applied to the target element through several POST1
postprocessing commands, as shown below:
PLESOL,CONT,FPRS
PLNSOL,CONT,FPRS
PRESOL,CONT
PRNSOL,CONT
Note that only the FPRS (fluid penetration pressure) output item is meaningful when the PRESOL and
PRNSOL commands are used for target elements.
Table 7.169.3: TARGE169 Item and Sequence Numbers (p. 518) lists output available through the ETABLE
command using the Sequence Number method. See Creating an Element Table in the Basic Analysis
Guide and The Item and Sequence Number Table (p. 51) in this reference for more information. The
following notation is used in Table 7.169.3: TARGE169 Item and Sequence Numbers (p. 518):
Name
Output quantity as defined in the Table 7.169.2: TARGE169 Element Output Definitions (p. 517)
Item
Predetermined item label for ETABLE command
E
Sequence number for single-valued or constant element data
517
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

I,J
Sequence number for data at nodes I, J
Table 7.169.3: TARGE169 Item and Sequence Numbers
ETABLE and ESOL Command
Input
Output
Quantity
Name
J
I
E
Item
2
1
3
SMISC
FPRSN
5
4
SMISC
FPTP
TARGE169 Assumptions and Restrictions
• The 2D segment element must be defined in the global X-Y plane.
• For each pilot node, the program automatically defines an internal node and an internal constraint
equation. The rotational DOF of the pilot node is connected to the translational DOF of the internal
node by the internal constraint equation. Ansys, Inc. recommends against using external constraint
equations or coupling on pilot nodes. If you do, conflicts may occur and yield incorrect results.
• For circular arcs, the third node defines the actual center of the circle and must be defined accurately
when the element is generated and must be moved consistently with the other nodes during the
deformation process. If the third node is not moved consistently with the other nodes, the arc shape
changes with that node's movement. To ensure the correct behavior, apply all boundary conditions
to a pilot node.
• For parabolic segments, the third point must lie at the middle of the parabola.
• Generally speaking, you must not change the R1 real constant between load steps or during restart
stages. Otherwise Mechanical APDL assumes that the radius of the circle varies between the load
steps. When using direct generation, the real constant R1 for circles may be defined before the input
of the element nodes. If multiple rigid circles are defined, each having a different radius, they must
be defined by different target surfaces.
• For rotation of a rigid body constrained only by a bonded, rigid-flexible contact pair with a pilot
node, use the MPC algorithm or a surface-based constraint as described in Multipoint Constraints
and Assemblies in the Contact Technology Guide. Penalty-based algorithms can create undesirable
rotational energies in this situation.
TARGE169 Product Restrictions
There are no product-specific restrictions for this element.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
518
Element Library

TARGE170
3D Target Segment
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Product Restrictions (p.534)
TARGE170 Element Description
TARGE170 is used to represent various 3D "target" surfaces for the associated contact elements (CON-
TA174 (p. 562), CONTA175 (p. 591), and CONTA177 (p. 618)). The contact elements themselves overlay the
solid, shell, or line elements describing the boundary of a deformable body and are potentially in contact
with the target surface, defined by TARGE170.
You can impose translational or rotational displacement, temperature, voltage, magnetic potential, pore
pressure, and concentration on the target segment element. You can also impose forces and moments
on target elements. See TARGE170 in the Mechanical APDL Theory Reference for more details about this
element. To represent 2D target surfaces, use TARGE169 (p. 506), a 2D target segment element.
For rigid target surfaces, these elements can easily model complex target shapes. For flexible targets,
these elements overlay the solid, shell, or line elements describing the boundary of the deformable
target body.
Figure 7.170.1: TARGE170 Geometry
Target Segment Element
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
The target surface is modeled through a set of target segments. Typically, several target segments make
up one target surface.
519
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.


### H02 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 2001-2200 · enclosing doc section)

SOLID87 (p. 301)
3D 10-Node Tetrahedral Thermal Solid
10 nodes 3D space
DOF: TEMP
SOLID90 (p. 306)
3D 20-Node Thermal Solid
20 nodes 3D space
DOF: TEMP
SOLID96 (p. 318)
3D Magnetic Scalar Solid
8 nodes 3D space
DOF: MAG
SOLID98 (p. 323)
Tetrahedral Coupled-Field Solid
10 nodes 3D space
DOF: UX, UY, UZ, TEMP, VOLT, MAG
SOLID122 (p. 361)
3D 20-Node Electrostatic Solid
20 nodes 3D space
DOF: VOLT
SOLID123 (p. 366)
3D 10-Node Tetrahedral Electrostatic
Solid
10 nodes 3D space
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
20
Element Classifications

Pictorials
SOLID Elements
DOF: VOLT
SOLID185 (p. 861)
3D 8-Node Structural Solid
8 nodes 3D space
DOF: UX, UY, UZ
SOLID186 (p. 878)
3D 20-Node Structural Solid
20 nodes 3D space
DOF: UX, UY, UZ
SOLID187 (p. 896)
3D 10-Node Tetrahedral Structural Solid
10 nodes 3D space
DOF: UX, UY, UZ
SOLID225 (p. 1151)
3D 8-Node Coupled-Field Solid
8 nodes 3D space
DOF: UX, UY, UZ, TEMP, VOLT, CONC
SOLID226 (p. 1179)
3D 20-Node Coupled-Field Solid
20 nodes 3D space
DOF: UX, UY, UZ, TEMP, VOLT, EMF, AZ,
CONC
SOLID227 (p. 1214)
3D 10-Node Coupled-Field Solid
10 nodes 3D space
DOF: UX, UY, UZ, TEMP, VOLT, EMF, AZ,
CONC
SOLID231 (p. 1278)
3D 20-Node Electric Solid
20 nodes 3D space
DOF: VOLT
SOLID232 (p. 1282)
3D 10-Node Tetrahedral Electric Solid
10 nodes 3D space
DOF: VOLT
21
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Summary of Element Types

Pictorials
SOLID Elements
SOLID236 (p. 1295)
3D 20-Node Electromagnetic Solid
20 nodes 3D space
DOF: AZ, VOLT
SOLID237 (p. 1304)
3D 10-Node Electromagnetic Solid
10 nodes 3D space
DOF: AZ, VOLT
SOLID239 (p. 1318)
3D 20-Node Diffusion Solid
10 nodes 3D space
DOF: CONC
SOLID240 (p. 1322)
3D 10-Node Tetrahedral Diffusion Solid
10 nodes 3D space
DOF: CONC
SOLID272 (p. 1412)
4- to 48-Node General Axisymmetric
Solid
(KEYOPT(2) = 3)
DOF: UX, UY, UZ
SOLID273 (p. 1422)
8- to 96-Node General Axisymmetric
Solid
(KEYOPT(2) = 3)
DOF: UX, UY, UZ
SOLID278 (p. 1432)
3D 8-Node Thermal Solid
8 nodes 3D space
DOF: TEMP
SOLID279 (p. 1451)
3D 20-Node Thermal Solid
20 nodes 3D space
DOF: TEMP
SOLID285 (p. 1493)
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
22
Element Classifications

Pictorials
SOLID Elements
3D 4-Node Tetrahedral Structural Solid
with Nodal Pressure
4 nodes 3D space
DOF: UX, UY, UZ, HDSP
SOLID291 (p. 1572)
3D 10-Node Tetrahedral Thermal Solid
10 nodes 3D space
DOF: TEMP
Pictorials
SOLSH Elements
SOLSH190 (p. 946)
Structural Solid Shell
8 nodes 3D space
DOF: UX, UY, UZ
Pictorials
SOURC Elements
SOURC36 (p. 206)
Magnetic Electric Current Source
3 nodes 3D space
DOF: None
Pictorials
SURF Elements
SURF151 (p. 440)
2D Thermal Surface Effect
2 or 4 nodes 2D space
DOF: TEMP
SURF152 (p. 450)
3D Thermal Surface Effect
4 to 10 nodes 3D space
DOF: TEMP
SURF153 (p. 460)
2D Structural Surface Effect
2 or 3 nodes 2D space
DOF: UX, UY
SURF154 (p. 469)
3D Structural Surface Effect
4 to 8 nodes 3D space
23
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Summary of Element Types

Pictorials
SURF Elements
DOF: UX, UY, UZ
SURF155 (p. 479)
3D Thermal Surface Effect
2 to 4 nodes 3D space
DOF: TEMP
SURF156 (p. 486)
3D Structural Surface Line Load
3 to 4 nodes 3D space
DOF: UX, UY, UZ
SURF159 (p. 496)
3D General Axisymmetric Surface
2 to 36 nodes 3D space
DOF: UX, UY, UZ
SURF251 (p. 1360)
2D Radiosity Surface
2 nodes 2D space
SURF252 (p. 1365)
3D Thermal Radiosity Surface
3 or 4 nodes, 3D space
Pictorials
TARGE Elements
TARGE169 (p. 506)
Contact 2D Target Segment
3 nodes 2D space
DOF: UX, UY, TEMP, VOLT, AZ, PRES,
CONC
TARGE170 (p. 519)
Contact 3D Target Segment
8 nodes 3D space
DOF: UX, UY, UZ, TEMP, TTOP, TBOT,
VOLT, MAG, PRES, CONC
Pictorials
TRANS Elements
TRANS126 (p. 386)
Electromechanical Transducer
2 nodes 3D space
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
24
Element Classifications


### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 1211-1307 · enclosing doc section)

2.3. Managing Contact Pairs
2.1.The Contact Manager
You can access the Contact Manager via the Contact Manager icon 
 in the Standard Toolbar, or via
the menu path Preprocessor> Modeling> Create> Contact Pair. The Contact Manager is available at
the Begin level and in the following processors: preprocessor (PREP7), solution (SOLU), and general
postprocessor (POST1).
The Contact Manager Toolbar provides an intuitive interface for the creation and management of contact
pairs. The manager supports surface-to-surface contact analysis (p. 15), node-to-surface contact analys-
is (p. 147) (using CONTA175), and the internal multipoint constraint (MPC) (p. 245) method of contact.
Note:
The Contact Manager does not support general contact (p. 187) definitions.
Figure 2.1: Contact Manager Toolbar
• Contact Wizard - Accesses the Contact Wizard GUI described in The Contact Wizard (p. 13). Allows
you to manually define target and contact surfaces. Supports both 2D and 3D geometries as
well as rigid-flexible (with optional pilot node) or flexible-flexible contact. (Primitives are not
supported by contact wizard.) The wizard also supports surface-based constraint contact pairs.
• Contact Properties - Allows you to specify the properties of the contact pair(s) via real constants
and KEYOPTs for the contact elements used.
• Delete Contact Pairs - Deletes the contact pairs selected in the contact pair list.
11
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

• Contact Selection Options - Specifies display of contact elements, target elements, or both.
• Plot Elements/Results - Displays the elements of selected contact pairs or displays the contact
results, if available (POST1 only), specified in the Contact Results field for selected contact pairs.
Results are displayed if Model Context is specified as "Result-". Otherwise, elements are displayed.
The display can be limited to contact, or target, or both as specified in the Contact Selection
Options field. (Note that CONTA175 results will not display graphically, but can be listed with
the List Elements/Results icon.)
• Show Normals - Specifies whether or not to display the normals on the elements when plotting
contact pairs
• Flip Normals - Flips the element normals of the selected contact pair. This action is limited to
the elements specified in the Contact Selection Options field.
• Switch Contact and Target - Inverts the target surface and the contact surface with each other.
This is applicable only to flexible-to-flexible surface-to-surface contact pairs.
• List Elements/Results - Lists the elements of the selected contact pairs or lists the contact results,
if available (POST1 only), specified in the Contact Results field for selected contact pairs. Results
are listed if Model Context is specified as "Result-". Otherwise, elements are listed. The listing
is restricted to the elements specified in the Contact Selection Options field.
• Model Context - Displays the contact pairs in the context of the entire model using a translucent
plot, or shows only the contact pairs. If set to "Result-" (POST1 only), controls display/listing of
contact pair results.
• Check Contact Status - Provides contact status information for selected contact pairs. Several
options are available (click and hold down the Check Contact Status button to access these op-
tions):
– Display a detailed listing of status information for each contact pair.
– Run a partial solution of the initial contact state (CNCHECK,POST command) that can be
subsequently postprocessed from the contact manager. (See CNCHECK for more inform-
ation.)
– Physically move contact nodes to the target surface (CNCHECK,ADJUST command) in
order to close a gap or reduce a penetration (see Physically Moving Contact Nodes Toward
the Target Surface (p. 80).)
– Reset target element and contact element key options and real constants to their default
values (CNCHECK,RESET command).
• Contact Results - Shows the contact result items for subsequent viewing using the Plot Ele-
ments/Results and List Elements/Results icons.
The bar below the toolbar icons minimizes or maximizes the Contact Pair list box below it. The Contact
Pair list box displays the defined contact pairs. You can select contact pairs from this list for displaying
or editing purposes.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
12
GUI Aids for Contact Analyses

2.2.The Contact Wizard
This Contact Wizard leads you through the process of manually creating contact pairs. The wizard supports
rigid-flexible (with optional pilot node) and flexible-flexible contact, and supports both surface-to-surface
and node-to-surface configurations. The Contact Wizard also supports surface-based constraint contact
pairs.
Note:
The Contact Wizard does not support rigid target primitives, nor does it support general
contact (p. 187) definitions.
To use the Contact Wizard, access the Contact Manager Toolbar and click the Contact Wizard icon.
The wizard steps you through setting up the contact analysis. Below is an example of the screens you
will see.
Figure 2.2: Example of a Contact Wizard Dialog
The Contact Wizard remains unavailable (dimmed) if you haven't meshed any portion of your model.
If you wish to create a rigid-flexible model, mesh only those parts of the model which will be used as
flexible contact surfaces (do not mesh the rigid target surfaces) before launching the wizard. If you wish
to create a flexible-flexible model, mesh all parts of the model which will be used as contact surfaces
(including target surfaces) before launching the wizard.
You can specify target and contact surfaces using lines, areas, volumes, selected set of nodes, or node
components. Note that the wizard allows you to choose more than one area for the target and contact
surfaces, allowing multiple areas to form a single contact surface. If you specify a rigid target surface,
you will then have the option to define a pilot node for that contact pair. (The pilot node step is man-
datory if you define a surface-based constraint contact pair by picking the Pilot Node Only option.)
After you specify the target and contact surfaces, you can specify properties of the contact pair (real
constants and KEYOPTs) before creating the contact pair. When you finish specifying all the required
data, click the Create button to create the contact and target element types, a unique real constant
set with the real constant values, and the elements that make up the contact and target surfaces.
13
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
The Contact Wizard


### H02 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 2198-2397 · enclosing doc section)

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
Tangent penalty stiffness factor
FKT
12
0
0
Contact cohesion
COHE
13
[3]
0
Thermal contact conductance
TCC
14
1
1
Frictional heating factor
FHTG
15
n/a
0
Stefan-Boltzmann constant
SBCT
16
n/a
1
Radiation view factor
RDVF
17
0.5
0.5
Heat distribution weighing factor
FWGT
18
[6]
0
Electric contact conductance
ECC
19
n/a
1
Joule dissipation weighting factor
FHEG
20
1
1
Static/dynamic ratio
FACT
21
0
0
Exponential decay coefficient
DC
22
1%
1%
Allowable elastic slip
SLTO
23
[5]
[5]
Maximum allowable tensile contact
pressure
TNOP
24
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
40
Surface-to-Surface Contact (Pair-Based)

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
2
2
Target edge extension factor
TOLS
25
n/a
0
Magnetic contact permeance
MCC
26
n/a
0
Pressure-penetration criterion
PPCN
27
n/a
0.01
Fluid penetration acting time
FPAT
28
1
1
Coefficient of restitution
COR
29
1 [8]
1 [8]
Load step number for ramping
penetration
STRM
30
n/a
1
Normal stabilization damping factor
FDMN
31
n/a
0.001
Tangential stabilization damping
</rag-context>