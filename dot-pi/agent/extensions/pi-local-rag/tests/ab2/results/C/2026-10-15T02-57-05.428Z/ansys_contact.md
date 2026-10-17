<rag-context>
[pi-local-rag] RAG subagent: 4 sources, 5481 ms retrieval.
### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 2079-2278 · enclosing doc section)

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

### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 1405-1604 · enclosing doc section)

2.2. Summary of Element Types
The following tables show elements listed by group label (p. 5) in numerical order, along with a de-
scription and graphical representation for each.
SOLID (p. 20)
MESH (p. 15)
FOLLW (p. 12)
BEAM (p. 7)
SOLSH (p. 23)
MPC (p. 15)
HSFLD (p. 12)
CABLE (p. 7)
SOURC (p. 23)
PIPE (p. 15)
INFIN (p. 12)
CIRCU (p. 7)
SURF (p. 23)
PLANE (p. 16)
INTER (p. 13)
COMBIN (p. 8)
TARGE (p. 24)
PRETS (p. 18)
LINK (p. 14)
CONTAC (p. 8)
TRANS (p. 24)
REINF (p. 18)
MASS (p. 14)
CPT (p. 9)
SHELL (p. 18)
MATRIX (p. 15)
FLUID (p. 10)
Pictorials
BEAM Elements
BEAM188 (p. 904)
Structural 3D 2-Node Beam
2 nodes 3D space
DOF: UX, UY, UZ, ROTX, ROTY, ROTZ
BEAM189 (p. 925)
Structural 3D 3-Node Beam
3 nodes 3D space
DOF: UX, UY, UZ, ROTX, ROTY, ROTZ
Pictorials
CABLE Elements
CABLE280 (p. 1469)
3D 3-Node Cable
3 nodes 3D space
DOF: UX, UY, UZ
Pictorials
CIRCU Elements
CIRCU94 (p. 311)
Coupled-Field Piezoelectric Circuit
2 or 3 nodes 2D space
DOF: VOLT, CURR
CIRCU124 (p. 372)
Electric Circuit
2-6 nodes 3D space
DOF: VOLT, CURR, PRES
7
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Summary of Element Types

Pictorials
CIRCU Elements
CIRCU125 (p. 381)
Electric Diode
2 nodes 3D space
DOF: VOLT
Pictorials
COMBIN Elements
COMBIN14 (p. 153)
Combination Spring-Damper
2 nodes 3D space
DOF: UX, UY, UZ, ROTX, ROTY, ROTZ
COMBIN37 (p. 210)
Combination Control
4 nodes 3D space
DOF: UX, UY, UZ, ROTX, ROTY, ROTZ,
PRES, TEMP
COMBIN39 (p. 222)
Combination Nonlinear Spring
2 nodes 3D space
DOF: UX, UY, UZ, ROTX, ROTY, ROTZ,
PRES, TEMP
COMBIN40 (p. 230)
Combination
2 nodes 3D space
DOF: UX, UY, UZ, ROTX, ROTY, ROTZ,
PRES, TEMP
COMBI214 (p. 1039)
Combination Spring-Damper Bearing
2 nodes 2D space
DOF: UX, UY, UZ
COMBI250 (p. 1354)
Bushing
2 nodes 3D space
DOF: UX, UY, UZ, ROTX, ROTY, ROTZ
Pictorials
CONTA Elements
CONTA172 (p. 535)
2D 3-Node Surface-to-Surface Contact
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
8
Element Classifications

Pictorials
CONTA Elements
3 nodes 2D space
DOF: UX, UY, TEMP, VOLT, AZ, PRES,
CONC
CONTA174 (p. 562)
3D 8-Node Surface-to-Surface Contact
8 nodes 3D space
DOF: UX, UY, UZ, TEMP, TTOP, TBOT,
VOLT, MAG, PRES, CONC
CONTA175 (p. 591)
2D/3D Node-to-Surface Contact
1 node 2D/3D space
DOF: UX, UY, UZ, TEMP, VOLT, AZ,
MAG, PRES, CONC
CONTA177 (p. 618)
3D Line-to-Surface Contact
3 nodes 3D space
DOF: UX, UY, UZ
CONTA178 (p. 641)
3D Node-to-Node Contact
2 nodes 3D space
DOF: UX, UY, UZ, TEMP, VOLT
Pictorials
CPT Elements
CPT212 (p. 1026)
2D 4-Node Coupled
Pore-Pressure-Thermal Mechanical Solid
4 nodes 2D space
DOF: UX, UY, PRES, TEMP
CPT213 (p. 1032)
2D 8-Node Coupled
Pore-Pressure-Thermal Mechanical Solid
8 nodes 2D space
DOF: UX, UY, PRES, TEMP
CPT215 (p. 1050)
3D 8-Node Coupled
Pore-Pressure-Thermal Mechanical Solid
8 nodes 3D space
9
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Summary of Element Types

Pictorials
CPT Elements
DOF: UX, UY, UZ, PRES, TEMP
CPT216 (p. 1057)
3D 20-Node Coupled
Pore-Pressure-Thermal Mechanical Solid
20 nodes 3D space
DOF: UX, UY, UZ, PRES, TEMP
CPT217 (p. 1064)
3D 10-Node Coupled
Pore-Pressure-Thermal Mechanical Solid
10 nodes 3D space
DOF: UX, UY, UZ, PRES, TEMP
Pictorials
FLUID Elements
FLUID29 (p. 177)
2D Acoustic Fluid
4 nodes 2D space
DOF: UX, UY, PRES
FLUID30 (p. 182)
3D Acoustic Fluid
8 nodes 3D space
DOF: UX, UY, UZ, PRES, ENKE
FLUID38 (p. 219)
Dynamic Fluid Coupling
2 nodes 3D space
DOF: UX, UY, UZ
FLUID116 (p. 343)
Coupled Thermal-Fluid Pipe
2 nodes 3D space
DOF: PRES, TEMP
FLUID129 (p. 395)
2D Infinite Acoustic
2 or 3 nodes 2D space
DOF: PRES
FLUID130 (p. 399)
3D Infinite Acoustic
4 or 8 nodes 3D space
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
10
Element Classifications

Pictorials
FLUID Elements
DOF: PRES
FLUID136 (p. 420)
3D Squeeze Film Fluid
4, 8 nodes 3D space
DOF: PRES
FLUID138 (p. 431)

### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt (lines 21321-21520 · enclosing doc section)

13.157. SHELL157 - Thermal-Electric Shell
Integration
Points (p. 418)
Shape Functions
Geometry
Matrix or Vector
2 x 2
Equation 11.78 (p. 378). No
variation thru thickness
Quad
Electrical Conductivity
Matrix
1
Equation 11.78 (p. 378). No
variation thru thickness
Triangle
2 x 2
Equation 11.77 (p. 378) and
Equation 11.78 (p. 378). No
variation thru thickness
Quad
Thermal Conductivity
Matrix; Heat Generation
Load and Convection
Surface Matrix and Load
Vectors
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
560
Element Library

Integration
Points (p. 418)
Shape Functions
Geometry
Matrix or Vector
1
Equation 11.107 (p. 380) and
Equation 11.78 (p. 378). No
variation thru thickness
Triangle
Same as
conductivity matrix
Same as conductivity matrix. Matrix is
diagonalized as described in Lumped
Matrices (p. 426)
Specific Heat Matrix
13.157.1. Other Applicable Sections
Coupling (p. 313) discusses coupled effects.
13.158. Not Documented
No detail or element available at this time.
13.159. SURF159 - General Axisymmetric Surface with 2 or 3 Nodes
J 2
I2
K 2
J 3
K3
I 3
J1
y
Z
x
z
Integration
Points (p. 418)[2]
Shape Functions
Midside Nodes [1]
Matrix or Vector
3 x Nc
Equation 11.47 (p. 376)
through
Equation 11.49 (p. 376)
With midside nodes
Mass Matrix
2 x Nc
Equation 11.44 (p. 376)
through
Equation 11.46 (p. 376)
Without midside nodes
2 x Nc
Same as mass matrix.
With midside nodes
Stress Stiffness Matrix
Without midside nodes
2 x Nc
Same as mass matrix.
With midside nodes
Pressure Load Vector
Without midside nodes
561
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
SURF159 - General Axisymmetric Surface with 2 or 3 Nodes

1. Midside node setting is controlled by KEYOPT(4).
2. Nc = the number of node planes in the circumferential direction. The Nc integration
points are circumferentially located at:
• the nodal planes, and
• midway between the nodal planes (that is, at the integration planes)
so that Nc = (2 * Nnp), where Nnp = number of nodal planes (KEYOPT(2)).
Exception: If KEYOPT(2) = 1, then Nc = 1.
Distribution
Load Type
Linear along each face in both directions.
Pressure
13.159.1. Other Applicable Sections
General Element Formulations (p. 49) gives the general element formulations used by this element.
13.159.2. Assumptions and Restrictions
Although the elements are initially axisymmetric, the loads and deformation can be general in non-
axisymmetric 3D. The displacements are interpolated in elemental coordinate system by interpolation
functions, but the user can define the nodal displacements in any direction.
13.160. Reserved for Future Use
This section is reserved for future use.
13.161. Reserved for Future Use
This section is reserved for future use.
13.162. Reserved for Future Use
This section is reserved for future use.
13.163. Reserved for Future Use
This section is reserved for future use.
13.164. Reserved for Future Use
This section is reserved for future use.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
562
Element Library

13.165. Reserved for Future Use
This section is reserved for future use.
13.166. Reserved for Future Use
This section is reserved for future use.
13.167. Reserved for Future Use
This section is reserved for future use.
13.168. Reserved for Future Use
This section is reserved for future use.
13.169.TARGE169 - 2D Target Segment
13.169.1. Other Applicable Sections
TARGE170 - 3D Target Segment (p. 564) discusses Target Elements.
13.169.2. Segment Types
TARGE169 supports six 2D segment types:
563
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
TARGE169 - 2D Target Segment

Figure 13.22: 2D Segment Types
Line
Arc, clockwise
Arc, counterclockwise
Parabola
Circle
Pilot Node
I
J
I
I
I
I
I
K
K
J
K
J
J
13.170.TARGE170 - 3D Target Segment
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
13.170.1. Introduction

### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/Ansys-mechanical-apdl-technology-demonstration-guide.txt (lines 10435-10634 · enclosing doc section)

---
---
Use pass time
78.06 seconds
372.68 seconds
42.5 seconds
Total CPU time (including
full-model save, generation pass,
267
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
Results and Discussion

CMS and Rigid
Parts
Flexible and
Rigid Parts
All Rigid Parts
use pass, expansion pass, and
results processing)
In all cases, shared memory parallel with two CPUs is used. The results are reported for a 64-bit Linux
system.
The table and the other results discussed illustrate some essential analysis considerations:
• It is worthwhile to verify the kinematic behavior of the multibody system by assuming all parts as rigid,
as the time and resources required for the rigid analysis are small.
• Modeling the flexible bodies using CMS superelements results in significant time savings.
• Analysis of the assembly when the flexible part is modeled with 3-D finite elements necessarily requires
more time due to the increased number of degrees of freedom. Such an analysis, however, should be
performed only when the flexible part undergoes large deformations, either due to nonlinear material
behavior or to nonlinear geometric effects.
18.8. Recommendations
To perform a similar transient dynamic analysis of a multibody system, consider the following hints and
recommendations:
• Ensure that the motion and behavior of the model is kinematically consistent by modeling all parts as
rigid bodies connected to each other by joints.
• Relax overconstraints due to joints by selecting joints of similar behavior. Use a spherical or cylindrical
joint instead of a revolute joint if some constraints are deemed unnecessary.
• When modeling flexible parts, build the model incrementally and verify that the motion and behavior
are consistent with expected behavior.
• Use full modeling of the parts only when detailed information about the stress and deformation fields
is required.
• For reduced run times, model the flexible parts as CMS superelements whenever possible.
For additional recommendations, see Troubleshooting a Flexible Multibody Analysis in the Multibody
Analysis Guide.
18.9. Input Files
The following files were used in this problem:
• DiggerArm-Rigid.dat -- Input file for all parts modeled as rigid.
• DiggerArm-Rigid.inp -- Rigid model information (called by DiggerArm-Rigid.dat).
• DiggerArm-Flexible.dat -- Input file for connecting rods modeled as flexible using SOLID185 elements.
• DiggerArm-Flexible.inp -- Flexible model information (called by DiggerArm-Flexible.inp).
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
268
Transient Dynamic Analysis of a Digger-Arm Assembly

• DiggerArm-CMS.dat -- Input file for modeling the flexible connecting rods as CMS superelements.
• DiggerArm-CMS.inp -- CMS superelement model information (called by DiggerArm-CMS.dat).
The files are available in the td-19 folder. See Obtaining the Input Files for more information.
269
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
Input Files

Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
270

Chapter 19: Dynamic Simulation of a Printed Circuit Board Assembly
Using Modal Analysis Methods
This example demonstrates the use of residual vectors to improve the solution accuracy in modal sub-
space based analysis methods, such as modal superposition and power spectral density (PSD) analyses.
The problem includes a study of the computational efficiency of the results-expansion procedure used
to obtain the full model solution.
Topics related to this example problem follow:
19.1. Introduction
19.2. Problem Description
19.3. Modeling
19.4. Material Properties
19.5. Boundary Conditions and Loading
19.6. Analysis and Solution Controls
19.7. Results and Discussion
19.8. Recommendations
19.9. References
19.10. Input Files
19.1. Introduction
Portable electronic devices such as digital cameras, mobile phones, and PDAs use printed circuit boards
(PCBs). Due to increased demands for convenience and multi-functionality, these devices are designed
with a focus on miniaturization to accommodate a higher density and smaller dimensions of integrated
circuit (IC) packages. These design constraints require smaller solder joints with finer pitch, contributing
to the vulnerability of interconnections at the board level. Exposure to harsh dynamic loading environ-
ments during transportation and customer use are a critical issue for PCBs. PSD analysis simulates the
random excitations with unknown loading encountered in these harsh conditions.
The modal superposition method efficiently solves a large linear dynamic system by transforming it
into a set of uncoupled equations using the normal modes of the system. The first step in the modal
superposition method is to obtain the eigen frequencies and eigen modes of the system through
modal analysis. The downstream modal transient, modal harmonic, and spectral analyses are then per-
formed.
In the modal analysis, only a subset of the lower frequencies is usually extracted, truncating the higher
frequency modes. As a result, the accuracy of the modal subspace based solution is not guaranteed,
though accuracy can be improved using residual vectors. The residual vectors are calculated and nor-
malized to the modes extracted, and can then be used in all the downstream analyses (e.g., modal
transient, modal harmonic, and spectral analyses).
The efficiency of the modal superposition expansion pass has been improved using a direct combination
approach of stress/strain modes. You can activate the expansion in the modal analysis by applying the
element results expansion option.
271
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.

19.2. Problem Description
The model below is a PCB assembly consisting of three PCBs stacked together. A PSD analysis with base
excitation using acceleration response spectrum is performed on this model. The aim is to determine
the 1-σ displacement solution and compare the accuracy of results with and without the residual vectors.
Improvement of the computational efficiency is verified via modal superposition expansion (MXPAND).
Figure 19.1:  Full 3-D Geometry of a PCB assembly
19.3. Modeling
This section describes the detailed modeling of the PCB assembly. The following modeling topics are
covered:
19.3.1. Modeling of the PCB Structure
19.3.2. Contact Modeling
19.3.1. Modeling of the PCB Structure
The assembly consists of three PCBs stacked together. Each PCB consists of a circuit board with IC
packages on top. The board is a 0.20m×0.28m rectangular surface body with a 1 mm uniform thickness.
The IC packages are 3-D structures, each with a thickness of 5 mm. The board is modeled with SHELL181,
which is suitable for analyzing thin to moderately thick shell structures. The IC packages are modeled
with SOLID186, which is a 3-D 20 noded solid element, exhibiting quadratic displacement behavior.
The stack is connected together by five vertical columns. These are thick beam structures (length/dia-
meter 
 10), and they are modeled using BEAM188.
BEAM188 uses Timoshenko beam theory, which includes shear deformation effects, and is one of the
most accurate beam elements for analyzing moderately stubby beam structures. A hexahedral dominant
mesh is used to mesh the board and the solids, resulting in each PCB having 14600 nodes. Both the
board and the IC packages are made of polyethylene material. The supporting columns are made of
aluminum alloy. The total number of nodes for the model is 44097 with 26046 elements.
19.3.2. Contact Modeling
Bonded and flexible surface-to-surface contact pairs are used to define the contact between the IC
packages and the circuit board. Contact and target surfaces are used to connect the IC packages to the
board. The contact surface is modeled with CONTA174 elements and the target surfaces are modeled
using TARGE170 elements. The surface-to-surface contact elements have the following advantages over
the node-to-node elements:
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
272
Dynamic Simulation of a Printed Circuit Board Assembly Using Modal Analysis
Methods

• Support for lower and higher order elements on the contact and target surfaces. (SHELL181 is a linear element,
whereas SOLID186 is a quadratic element)
• No restrictions on the shape of the target surface. Surface discontinuities can result from manufacturing
flaws or mesh discretization.
For each board, fifteen contact pairs are identified, as seen in the figure below.
Figure 19.2:  Bonded Contact Pairs Between IC Packages and Circuit Boards
19.4. Material Properties
Material properties for the supporting columns, board, and IC packages are as follows:
Supporting Column Material Properties
71.0e3
Young's Modulus
(ton/s2mm)
0.33
Poisson's Ratio
2.77e-009
Density (ton/mm3)
Board and IC Packages Material Properties
1.1e3
Young's Modulus
(ton/s2mm)
0.42
Poisson's Ratio
9.5e-010
Density (ton/mm3)
19.5. Boundary Conditions and Loading
The boards of the PCB assembly are connected with five supporting columns. The base of the columns
(y = -60) are constrained on all degrees of freedom as shown in the figure below:
273
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
Boundary Conditions and Loading

Figure 19.3:  PCB Boundary Conditions
The following example input shows how the fixed constraints are applied:
CM, N_BASE_EXCITE, NODE           ! Group the set of nodes at the base of the columns as a component
D, ALL, ALL                       ! Apply displacement and rotation constraints to this set
N_BASE_EXCITE in the input above specifies the nodes at the junction of the supporting columns with
the base. For PSD analysis, the loading is applied in the form of base excitation on the set
N_BASE_EXCITE.
The PSD values for the input spectrum at different frequency points are shown in the figure below. The
input segment between 1.0E-02 and 1.0E+01 has 2 intermediate points in order to obtain a good fit
for the curve-fitting polynomial used in the PSD integration process.
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
274
Dynamic Simulation of a Printed Circuit Board Assembly Using Modal Analysis
Methods

Figure 19.4:  PSD Base Excitation Values
The following example input shows how base excitation is applied:
/SOLU   
ANTYPE, SPECTR                                         ! Perform a spectral analysis
SPOPT, PSD                                             ! Use power spectral density (PSD) as the spectrum 
                                                       ! type
</rag-context>