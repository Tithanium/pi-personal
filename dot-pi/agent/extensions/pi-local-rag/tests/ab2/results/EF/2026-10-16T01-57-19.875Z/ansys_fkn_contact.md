<rag-context>
[pi-local-rag] RAG subagent: 6 sources, 826 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 2079-2397 · enclosing doc section)

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

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 2781-2980 · enclosing doc section)

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

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 16778-16977 · enclosing doc section)

state, you must read results from the .rnc file using the FILE (p. 779) and SET (p. 1792),FIRST com-
mands in POST1 to properly read the corresponding contact data. Failure to do so may result in
improper reading of the results. The following example shows a valid command sequence for
plotting the initial contact gap:
/SOLU
CNCHECK,POST                 !write initial contact results to Jobname.rcn
FINISH
/POST1
FILE,Jobname,RCN             !specify the file where results are found 
SET,FIRST                    !read the first data set in Jobname.rcn
PLNSOL,CONT,GAP,0,1
FINISH
. . .
Note:
The jobname.rcn file contains information generated from the CNCHECK (p. 390),POST,
CNCHECK (p. 390),ADJUST, CNCHECK (p. 390),MORPH, or CNCHECK (p. 390), TADJUST
command. If multiple commands are issued in the same analysis, the file is overwritten
by the last CNCHECK (p. 390) command.
Command specification for Option = RESET
CNCHECK (p. 390), RESET, RID1, RID2, RINC, InterType, --, --, --, --
Table 107: Semantic label definitions when Option = RESET
Description
Argument
Start real ID
RID1
395
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
CNCHECK

Description
Argument
End real ID
RID2
Real ID increment
RINC
Unused fields.
--
The CNCHECK (p. 390),RESET command resets all but a few key options and real constants (listed
in the following table) associated with the specified contact pairs (RID1, RID2, RINC) to their default
values. This option is only valid for pair-based contact definitions.
Table 108: Key options and real constants that are not modified by CNCHECK (p. 390),RESET
Real constants unaffected by RESET
Key options unaffected by RESET
Element
type
R1, R2
KEYOPT(2), KEYOPT(3)
TARGE169,
TARGE170
R1, R2
KEYOPT(1), KEYOPT(3)
CONTA172
R1, R2
KEYOPT(1)
CONTA174,
CONTA175,
CONTA177
Command specification for Option = AUTO
CNCHECK (p. 390), AUTO, RID1, RID2, RINC, InterType, --, --, --, --
Table 109: Semantic label definitions when Option = AUTO
Description
Argument
Start real ID
RID1
End real ID
RID2
Real ID increment
RINC
Possible values for InterType are:
ANY (default)
All types
InterType
MPC
MPC-based contact pairs (KEYOPT(2) = 2)
BOND
Bonded contact pairs (KEYOPT(12) = 3, 5, 6)
NOSP
No separation contact pairs (KEYOPT(12) = 2, 4)
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
396
CNCHECK

Description
Argument
SMAL
Small sliding contact pairs (KEYOPT(18) = 1)
SELF
Self contact pairs (target surface completely overlaps
contact surface)
INAC
Inactive contact pairs (symmetric contact pairs for MPC
contact or KEYOPT(8) = 2)
Unused fields.
--
The CNCHECK (p. 390),AUTO command automatically changes certain default or undefined key options
and real constants to optimized settings or values. The changes are based on overall contact pair beha-
viors. In general, this command improves convergence for nonlinear contact analysis. This option is
only valid for pair-based contact definitions.
The tables below list typical KEYOPT and real constant settings implemented by issuing the
CNCHECK (p. 390),AUTO command. The actual settings implemented for your specific model may vary
from what is described here. You should always verify the modified settings by issuing
CNCHECK (p. 390),DETAIL to list current contact pair properties.
CNCHECK (p. 390),AUTO also sets PRED (p. 1526),OFF for the case of a force-distributed constraint defined
via MPC contact.
Table 110: KEYOPT Settings Implemented by CNCHECK (p. 390),AUTO
Settings implemented by CNCHECK (p. 390),AUTO
Default
Description
KEYOPT
Automatic selection based on DOFs of underlying
elements.
Structural DOFs
Selects DOF set
1
Augmented
Lagrange
Contact algorithm
2
1- Penalty for rigid-rigid contact[a].
Gauss point
Location of contact
detection point
4
2 - Normal to target surface if KEYOPT(2)
> 1.
No adjustment
CNOF adjustment
5
1 - Auto CNOF if tiny gap exists.
Use default range
Contact stiffness variation
6
1 - Nominal refinement for opening contact
or underlying elements having TB (p. 1971)
plasticity.
or
2 - Aggressive refinement for opening
contact and underlying elements having
TB (p. 1971) plasticity.
No control
Element level time
increment control
7
1 - Automatic bisection for self contact.
or
397
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
CNCHECK

4 - Impact constraint for opening contact
and transient analyses.
No action
Assymetric contact selection
8
2 - Auto selection if KEYOPT(2) > 1.
Include all
Effect of initial penetration
or gap
9
1 - Exclude if KEYOPT(5) = 1.
Between load steps
Contact stiffness update
10
0 - Between iterations except when
underlying elements are superelements[b].
Set to 0 if KEYOPT(2) > 1 for debonding.
[a]
Set to 1 if underlying elements are superelements or KEYOPT(9) = 2 was previously specified.
[b]
Table 111: Real Constant Settings Implemented by CNCHECK (p. 390),AUTO
CNCHECK,AUTO
Default
Description
Real Constants
Name
No.
Set to 5 if KEYOPT(9) = 2
(ramp initial penetration)
and KEYOPT(10) > 0.
1
Normal penalty
stiffness factor
FKN
3
Cut in half if spurious
contact is detected or
contact searching is slow.
see
[a]
Pinball radius
PINB
6
Calculated as a function of
highest conductivity of
0
Thermal contact
conductance

## 004 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 17328-17527 · enclosing doc section)

Command specification for Option = MERGE
CNCHECK (p. 390), MERGE, --, --, --, --, --, --, --, --
The CNCHECK (p. 390),MERGE command restores split contact sub-pairs from a previous
CNCHECK (p. 390),SPLIT or CNCHECK (p. 390),DMP command, enabling postprocessing of a distributed-
405
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
CNCHECK

memory parallel (DMP) solution based on the original pair geometry. It is imperative to exercise
caution when a downstream analysis is performed, as the MERGE operation may modify the database.
For more information and examples, see Solving Large Contact Models in a Distributed-Memory
Parallel Environment in the Contact Technology Guide.
CNCHECK (p. 390), MERGE, --, --, --, MPC, --, --, --, --
Use the CNCHECK (p. 390),MERGE,,,,MPC command to resolve some overconstraint caused by MPC
bonded contact pairs that share nodes or elements. It also performs contact/target flipping to have
consistent contact/target definitions. Internally, it employs integer linear programming (ILP) on
graphs built by contact pair connectives.
Limitations
• For certain scenarios, parity conflicts (three pairs having contact/target connected to each other)
cannot be resolved and those MPC pairs are not fully merged.
• General contact is not supported.
Command specification for Option = OVER
CNCHECK (p. 390), OVER, RID1, RID2, RINC, --, --, ACTION, --, --
Table 117: Semantic label and definitions when Option = OVER
Description
Argument
Start real ID
RID1
End real ID
RID2
Real ID increment
RINC
Unused fields
--
Possible values are:
Blank (default)
When a rigid beam or a weld joint connects to a rigid surface constraint or a rigid
body, automatically convert the rigid beam elements (MPC184) to rigid target or
contact elements.
ACTION
1
In addition to the default action, when a Lagrange multiplier-based joint element
connects to a rigid body or surface constraint, switch to the penalty method
(KEYOPT(2) = 1 of MPC184).
Unused fields
--
Example 11: Set ACTION = 1 on CNCHECK (p. 390),OVER
CNCHECK,OVER,,,,,,1    ! If a rigid beam or weld joint connects to a rigid body or  
                       ! surface constraint, convert them to rigid target or contact 
                       ! elements. Also, when a Lagrange multiplier-based joint connects
                       ! to a rigid surface or body, switch to the penalty method.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
406
CNCHECK

Notes
The CNCHECK (p. 390) command provides information for surface-to-surface, node-to-surface, and line-
to-line contact pairs (element types TARGE169, TARGE170, CONTA172, CONTA174, CONTA175, CONTA177).
All contact and target elements of interest, along with the solid elements and nodes attached to them,
must be selected for the command to function properly. For performance reasons, the program uses a
subset of nodes and elements based on the specified contact regions (RID1, RID2, RINC) when ex-
ecuting the CNCHECK (p. 390) command.
CNCHECK (p. 390) is available in both the PREP7 and SOLUTION processors, but only before the first
solve operation (that is, only before the first load step or the first substep).
If the contact and target elements were generated through mesh commands (AMESH (p. 123),
LMESH (p. 1093), etc.) instead of the ESURF (p. 709) command, you must issue MODMSH (p. 1175),DETACH
before CNCHECK (p. 390). Otherwise, CNCHECK (p. 390) will not work correctly.
Menu Paths
Main Menu> Preprocessor> Modeling> Create> Contact Pair
CNKMOD,ITYPE,KNUM,VALUE
Modifies contact element key options.
SOLUTION (p.38):Analysis Options (p.38)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
ITYPE
Contact element type number as defined on the ET (p. 713) command.
KNUM
Number of the KEYOPT to be modified (KEYOPT(KNUM)).
VALUE
Value to be assigned to the KEYOPT.
Notes
The CNKMOD (p. 407) command has the same syntax as the KEYOPT (p. 1013) command. However, it is
valid only in the SOLUTION processor. The command can be used to modify certain contact element
KEYOPT values between load steps in any analysis, including restarts and linear perturbation analyses,
as shown in the table below.
Valid between load steps
in other analyses
(including restart)
Valid in Linear
Perturbation
KEYOPT
NO
YES
KEYOPT(3)
407
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
CNKMOD

YES
YES
KEYOPT(12)
YES
NO
KEYOPT(15)
In a multiframe restart, CNKMOD (p. 407) must be issued again during each subsequent restart run.
Modifying KEYOPT(12)
A common use for the CNKMOD (p. 407) command is to modify contact interface behavior between
load steps in a restart analysis, a linear perturbation analysis, or other types of analyses. This enables
you to control the contact status locally per contact pair. The key options that control contact interface
behavior are: KEYOPT(12) of CONTA172, CONTA174, CONTA175, and CONTA177; and KEYOPT(10) of
CONTA178.
You can change KEYOPT(12) to any value. For example, you can change from standard contact to bonded
contact or vice-versa. If an open gap exists at the end of the previous load step and the contact status
is adjusted to sliding or sticking due to a bonded or no-separation contact behavior definition, the
program considers it as near-field contact when executing CNKMOD (p. 407) in the subsequent load
steps.
In a linear perturbation analysis, the CNKMOD (p. 407) command adjusts the contact status from the
linear perturbation base analysis (at the point of restart) as described in the table below. It enables you
to take points in the base analysis that are near contact (within the pinball region) and modify them
to be treated as in-contact in the perturbation analysis (see the "1 - near-field" row with KEYOPT(12)
values set to 4 or 5). You can also take points that are sliding in the base analysis and treat them as
sticking in the perturbation analysis, irrespective of the MU value (see the "2 - sliding" row with KEY-
OPT(12) values set to 1,3, 5, or 6).
Table 118: Contact Status Adjusted in Linear Perturbation Analysis via CNKMOD
CNKMOD,ITYPE,12,Value
Contact Status from
the Base Analysis
Adjusted Contact Status
KEYOPT(12) Value
Solution at the Restart
Point
0 - far-field
any
0 - far-field
1 - near-field
0, 1, 2, 3, 6
1 - near-field
1 - near-field
(if outside of the adjusted
pinball region)
4
2 - sliding
(if inside of the adjusted pinball
region)
1 - near-field
(if outside of the adjusted
pinball region)
5
3 - sticking
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
408
CNKMOD

(if inside of the adjusted pinball
region)
2 - sliding
0, 2, 4
2 - sliding
3 - sticking
1, 3, 5, 6
3 - sticking
any
3 - sticking
If an open gap exists at the end of the previous load step and the contact status is adjusted as sliding
or sticking due to a bonded or no-separation contact behavior definition, the program considers it a
near-field contact when executing CNKMOD (p. 407) in the subsequent load steps.
In the linear perturbation analysis procedure, contact status can also be controlled or modified via the
PERTURB (p. 1424) command. The contact status always follows local controls defined by the CNK-
MOD (p. 407) command first, and is then adjusted by the global sticking or bonded setting (ContKey
= STICKING or BONDED) on the PERTURB (p. 1424) command.
Modifying KEYOPT(3)
Another use for the CNKMOD (p. 407) command is to change the units of normal contact stiffness
(contact element real constant FKN) in a linear perturbation modal analysis that is used to model brake
squeal. For contact elements CONTA172 and CONTA174, KEYOPT(3) controls the units of normal contact
stiffness. You can issue the command CNKMOD (p. 407),ITYPE,3,1 during the first phase of the linear
perturbation analysis in order to change the units of normal contact stiffness from FORCE/LENGTH3 (in
the base analysis) to FORCE/LENGTH. Note that KEYOPT(3) = 1 is valid only when a penalty-based al-
gorithm is used (KEYOPT(2) = 0 or 1) and the absolute normal contact stiffness value is explicitly specified
(that is, a negative value input for real constant FKN).
Modifying KEYOPT(15)
KEYOPT(15) controls the effect of contact stabilization damping for contact elements CONTA172, CON-
TA174, CONTA175, and CONTA177. You can use CNKMOD (p. 407) to activate or deactivate the contact
stabilization damping between load steps. For example, the command CNKMOD (p. 407),ITYPE,15,1
deactivates the contact stabilization damping.
Menu Paths
This command cannot be accessed from a menu.
CNTGEN,option,COMPC,COMPT,ICTY,ITTY,RID,MATID
Generates a contact pair based on components.
PREP7 (p.23):Meshing (p.30)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
option
Specifies the type of contact pair to be generated.
409
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
CNTGEN


## 005 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 3152-3210 · sibling doc section)

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

## 006 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 2767-2780 · sibling doc section)

3.9.1.3. Defining Real Constants via a User Subroutine
You can write a USERCNPROP.F subroutine to define your own real constants. The real constants
that can be defined via this user subroutine are noted in the real constant table found in each
contact element description.
When defining real constants with the R, RMORE, or RMODIF command, you must use the reserved
table name _CNPROP and enclose it in % signs (%_CNPROP%). When a value field on one of these
commands is set to %_CNPROP%, the program internally calls the user-defined subroutine USER-
CNPROP. For example, to specify your own normal contact stiffness, FKN, you would issue a command
similar to the following:
RMODIF,NSET,3,%_CNPROP%      ! NSET is the real constant set ID associated with the contact pair
If several real constant values are defined via %_CNPROP% for a given contact pair, the subroutine
will be called for each of these real constant entries. Therefore, you can use a single USERCNPROP
subroutine to modify multiple real constant values. For details, see Defining Your Own Real Constant
(USERCNPROP) (p. 106).
</rag-context>