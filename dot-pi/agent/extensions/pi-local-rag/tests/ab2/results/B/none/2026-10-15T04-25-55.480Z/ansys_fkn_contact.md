<rag-context>
[pi-local-rag] RAG subagent: 4 sources, 311 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 2079-2278 · enclosing doc section)

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

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 2198-2397 · enclosing doc section)

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

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 32366-32565 · enclosing doc section)

Other Input
The contact interaction subroutine USERINTER is available for user-defined interface interactions, in-
cluding interactions in the normal and tangential directions as well as coupled-field interactions. For
more information on how to use this feature, see Defining Your Own Contact Interaction (USERINTER).
See also the USERINTER section for a detailed description of the subroutine.
To model the fluid penetration loads shown in Figure 7.172.2: Fluid Penetration Pressure Directions (p. 537),
use the SFE command to specify the fluid pressure values in the normal (LKEY = 1) and tangential
directions (LKEY = 3) in the element coordinate system (ESYS) and the fluid penetration starting points
(LKEY = 2). For more information, see Applying Fluid-Pressure-Penetration Loads in the Contact Tech-
nology Guide.
Figure 7.172.2: Fluid Penetration Pressure Directions
To model proper momentum transfer and energy balance between contact and target surfaces, impact
constraints must be used in transient dynamic analysis. See the description of KEYOPT(7) below and
the contact element discussion in the Mechanical APDL Theory Reference for details.
To model separation of bonded contact with KEYOPT(12) = 2, 3, 4, 5, or 6, use the TB command with
the CZM label. See Debonding in the Contact Technology Guide for more information.
To model wear at the contact surface, use the TB command with the WEAR label. See Contact Surface
Wear in the Contact Technology Guide for more information.
537
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

This element supports various 2D stress states, including plane stress, plane strain, and axisymmetric
states. The stress state is automatically detected according to the stress state of the underlying element.
However, if the underlying element is a superelement, you must use KEYOPT(3) to specify the stress
state.
Two types of geometry correction are available for this element: surface smoothing and bolt thread
modeling. Surface smoothing is a geometry correction technique that eliminates inaccuracies introduced
by linear elements on a curved (circular or nearly circular) contact surface. Bolt thread modeling provides
a method for simulating contact between a threaded bolt and bolt hole without having to model the
detailed thread geometry. Both of these geometry correction techniques are implemented through
section definitions (SECTYPE, SECDATA, and SECNUM commands). For more information, see Geometry
Correction for Contact and Target Surfaces in the Contact Technology Guide.
A summary of the element input is given in "CONTA172 Input Summary" (p. 538). A general description
of element input is given in Element Input (p. 41).
Using CONTA172 to Define a Result Section
A result section is a user-defined surface comprised of CONTA172 elements that is used to output and
monitor section forces, moments, and other output quantities. See Monitoring Result Section Data
During Solution for more information. When this element is used to define a result section, KEYOPT(4)
= 1 and 2 are the only applicable key option settings, and no real constants are used. For this special
case, the CONTA172 element does not represent contact interaction.
CONTA172 Input Summary
Nodes
I, J, K
Degrees of Freedom
Set by KEYOPT(1)
Real Constants
R1, R2, FKN, FTOLN,, PINB,
PZER, CZER, TAUMAX, CNOF, FKOP, FKT,
COHE, TCC, FHTG, SBCT, RDVF, FWGT,
ECC, FHEG, FACT, DC, SLTO, TNOP,
TOLS, , PPCN, FPAT, COR, STRM,
FDMN, FDMT, (Blank), (Blank), TBND, WBID
PCC, PSEE, ABPP, FPFT, FPWT, DCC,
DCON, ABDC, BSRL, KSYM, TFOR, TEND
See Table 7.172.1: CONTA172 Real Constants (p. 551) for descriptions of the real constants.
Material Properties
TB command: See Element Support for Material Models (p. 69) for this element.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
538
Element Library

MP command: MU, EMIS, DMPR, DMPS
Surface Loads
Pressure, Face 1 (I-J) (opposite to contact normal direction); used for fluid pressure penetration
loading. On the SFE command use LKEY = 1 to specify the normal pressure values, and use
LKEY = 2 to specify starting and penetrating points. Use LKEY = 3 to specify the tangential
pressure values.
Convection, Face 1 (I-J-K)
Heat Flux, Face 1 (I-J-K)
Special Features
Birth and death
Debonding
Fluid pressure penetration
Isotropic friction
Large deflection
Linear perturbation
Nonlinear adaptivity
Nonlinearity
Rezoning
Section definition for geometry correction of spherical and revolute surfaces
User-defined contact interaction
User-defined friction
Result Section
KEYOPTs
Presented below is a list of KEYOPTS available for this element. Included are links to sections in the
Contact Technology Guide where more information is available on a particular topic.
KEYOPT(1)
Selects degrees of freedom:
0 -- 
UX, UY
1 -- 
UX, UY, TEMP
2 -- 
TEMP
539
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

3 -- 
UX, UY, TEMP, VOLT (see note)
4 -- 
TEMP, VOLT (see note)
5 -- 
UX, UY, VOLT (see note)
6 -- 
VOLT (see note)
7 -- 
AZ
8 -- 
UX, UY, PRES
9 -- 
UX, UY, PRES, TEMP
10 --
PRES
11 --
UX, UY, CONC, TEMP
12 --
UX, UY, CONC, TEMP, VOLT (see note)
13 --
UX, UY, CONC
14 --
CONC
Note:
The VOLT degree of freedom can be either charge- or current-based. The contact element
follows the KEYOPTION settings of the underlying coupled-field elements
(PLANE222 (p. 1089), PLANE223 (p. 1117), SOLID225 (p. 1151), SOLID226 (p. 1179), SOL-
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
540
Element Library

ID227 (p. 1214), LINK228 (p. 1248)) to determine the definition of the DOF. Refer to the
coupled-field element descriptions for details.
Note:
When the underlying elements are 2D axisymmetric elements with torsion, ROTY (torsion
DOF) is automatically added to the existing UX, UY degree of freedom set. ROTY is also
added when KEYOPT(3) = 4 and the underlying elements are superelements.
Note:
For KEYOPT(1) = 8, 9, and 10, the pore pressure (PRES) degree of freedom is ignored at
midside nodes if the underlying element is the higher-order 2D coupled pore-pressure
mechanical solid (CPT213 (p. 1032)).
Note:
For general contact, the GCGEN command automatically sets KEYOPT(1) based on the
degrees of freedom of the underlying solid or shell elements.
KEYOPT(2)
Contact algorithm:
0 -- 
Augmented Lagrangian (default)
1 -- 
Penalty function
2 -- 
Multipoint constraint (MPC); see Multipoint Constraints and Assemblies in the Contact Technology
Guide for more information
3 -- 
Lagrange multiplier on contact normal and penalty on tangent
4 -- 
Pure Lagrange multiplier on contact normal and tangent
Note:
For general contact, the GCGEN command automatically sets KEYOPT(2) = 1 (penalty
function).
541
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

KEYOPT(3)
Standard KEYOPT(3) Usage
Element stress state. The stress state is detected automatically except when the underlying elements
are superelements.
0 -- 
Automatic detection based on underlying element (valid when the underlying elements are not
superelements)
1 -- 
Axisymmetric (Use this option only when underlying elements are superelements.)
2 -- 
Plane stress/plane strain with unit thickness (Use this option only when underlying elements
are superelements.)
3 -- 
Plane stress with thickness input (Use this option only when underlying elements are superele-
ments.)
4 -- 
Axisymmetric with torsion. ROTY is added to the UX, UY degree of freedom set specified by
KEYOPT(1). (Use this option only when underlying elements are superelements.)
Alternate KEYOPT(3) Usage to Control Units of Normal Contact Stiffness
Units of normal contact stiffness:
0 -- 
FORCE/LENGTH3 (default).
1 -- 
FORCE/LENGTH. This option is valid only when a penalty-based algorithm is used (KEYOPT(2) =
0 or 1) and the absolute normal contact stiffness value is explicitly specified (that is, a negative
value input for real constant FKN).
Note:
KEYOPT(3) is not supported for contact elements used in a general contact definition.
KEYOPT(4)
Standard KEYOPT(4) Usage
Location of contact detection point:
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
542

## 004 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 2781-2980 · enclosing doc section)

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
</rag-context>