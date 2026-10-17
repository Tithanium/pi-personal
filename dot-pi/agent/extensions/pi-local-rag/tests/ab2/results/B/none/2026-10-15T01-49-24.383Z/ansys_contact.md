<rag-context>
[pi-local-rag] RAG subagent: 2 sources, 101 ms retrieval.
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

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 633-680 · chunk range (no structural region))

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
</rag-context>