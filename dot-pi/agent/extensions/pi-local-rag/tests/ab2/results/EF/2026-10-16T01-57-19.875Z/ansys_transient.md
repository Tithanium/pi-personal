<rag-context>
[pi-local-rag] RAG subagent: 5 sources, 5391 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt (lines 9115-9358 · enclosing doc section)

A prestressed transient dynamic analysis calculates the dynamic response of a prestressed structure,
such as a heat-treated part with residual thermal stresses. Prestressed-analysis procedures vary, depending
on the type of transient dynamic analysis being performed.
5.5.1. Prestressed Full Transient Dynamic Analysis
You can include prestressing effects in a full transient dynamic analysis by applying the prestressing
loads in a preliminary static load step. (Do not remove these loads in subsequent load steps.) The
procedure consists of two steps:
1. Build your model, enter SOLUTION, and define a transient analysis type (ANTYPE,TRANS).
• Apply all prestressing loads.
• Turn time-integration effects off (TIMINT,OFF).
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
176
Transient Dynamic Analysis

• If you need to include large strain, large deflection, or stress stiffening effects, issue
NLGEOM,ON.
• Set time equal to some small dummy value (TIME).
• Write your first load step to Jobname.S01 (LSWRITE).
If prestressing effects develop because of nonlinear behavior (as in the case of residual thermal
stresses in a casting), several load steps might be required to complete the static prestressing
phase of your analysis. In the case of geometric nonlinearities (large deformation effects),
you can capture the prestressing effect by issuing NLGEOM,ON.
2. For all subsequent load steps, turn time-integration effects on (TIMINT,ON), and proceed
using the full transient dynamic analysis procedures described previously. Once all load steps
are written to files (LSWRITE), you can initiate the multiple load step solution (LSSOLVE).
Note:
If you intend to define initial conditions (IC), perform the static prestress solution as a
separate solution. To activate the gyroscopic damping matrix in a prestressed transient
analysis, perform a separate static solution with Coriolis effects activated (CORIOLIS,ON,,,ON)
in a stationary reference frame.
(Main Menu> Solution> Define Loads> Apply> Initial Condit'n> Define)
The IC command is valid only in the first load step.
5.5.2. Prestressed Mode-Superposition Transient Dynamic Analysis
In order to include prestress effects in a mode-superposition analysis, you must first do a prestressed
modal analysis. See Modal Analysis (p. 39) for details. Once prestressed modal analysis results are
available, proceed as for any other mode-superposition analysis.
5.6.Transient Dynamic Analysis Options
The following sections provide additional details about defining integration time step, automatic time
stepping, and damping.
5.6.1. Guidelines for Integration Time Step
The accuracy of the transient dynamic solution depends on the integration time step: the smaller the
time step, the higher the accuracy. A time step that is too large introduces an error that affects the
response of the higher modes (and hence the overall response). A time step that is too small wastes
computer resources. To calculate an optimum time step, adhere to the following guidelines:
• Resolve the response frequency. The time step should be small enough to resolve the motion
(response) of the structure. Because the dynamic response of a structure can be thought of as a
combination of modes, the time step should be able to resolve the highest mode that contributes
to the response. For the Newmark time-integration scheme, using approximately twenty points
per cycle of the highest frequency of interest results in a reasonably accurate solution; that is, if f
177
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Transient Dynamic Analysis Options

is the frequency (in cycles/time), the integration time step (ITS) is given by ITS = 1/(20f). Smaller
ITS values may be required if acceleration results are needed.
The following figure shows the effect of ITS on the period elongation of a single-degree-of-freedom
spring-mass system:
Figure 5.2: Effect of Integration Time Step on Period Elongation
0
1
2
3
4
5
6
7
8
9
10
0
10
20
30
40
50
60
70
80
90
100
Period
Elongation
(%)
Number of Time Steps Per Cycle
recommended
Notice that 20 or more points per cycle results in a period elongation of less than one percent.
For the HHT time-integration method, the same guidelines for time step should be applied. Note
that if the same time step and time-integration parameters are used, the HHT method will be more
accurate compared to the Newmark method.
Alternately, you can use the midstep residual criterion to select time step size. If you do, the response
frequency criterion is disabled by default. You have the option to enable the response frequency
criterion along with the midstep residual criterion. (See item 6 (p. 179) below.)
• Resolve the applied load-versus-time curve(s). The time step should be small enough to "follow"
the loading function. The response tends to lag the applied loads, especially for stepped loads, as
shown in Figure 5.3: Transient Input vs. Transient Response (p. 178). Stepped loads require a small
ITS at the time of the step change so that the step change can be closely followed. ITS values as
small as 1/180f may be needed to follow stepped loads.
Figure 5.3: Transient Input vs. Transient Response
t
ü
t
ü
Input
Response
• Resolve the contact frequency. In problems involving contact (impact), the time step should be
small enough to capture the momentum transfer between the two contacting surfaces. Otherwise,
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
178
Transient Dynamic Analysis

an apparent energy loss will occur and the impact will not be perfectly elastic. The integration time
step can be determined from the contact frequency (fc ) as:
where k is the gap stiffness, m is the effective mass acting at the gap, and N is the number of points
per cycle. To minimize the energy loss, at least thirty points per cycle of (N = 30) are needed. Larger
values of N may be required if acceleration results are needed. For the mode-superposition method,
N must be at least 7 to ensure stability.
You can use fewer than 30 points per cycle during impact if the contact period and contact mass
are much less than the overall transient time and system mass, because the effect of any energy
loss on the total response would be small.
• Resolve the wave propagation. If you are interested in wave propagation effects, the time step
should be small enough to capture the wave as it travels through the elements. See Build the
Model (p. 156) for a discussion of element size.
• Resolve the nonlinearities. For most nonlinear problems, a time step that satisfies the preceding
guidelines is sufficient to resolve the nonlinearities. There are a few exceptions, however: if the
structure tends to stiffen under the loading (for example, large deflection problems that change
from bending to membrane load-carrying behavior), the higher frequency modes that are excited
will have to be resolved.
• Satisfy the time step accuracy criterion. Satisfaction of the dynamics equations at the end of
each time step ensures the equilibrium at these discrete points of time. The equilibrium at the in-
termediate time is usually not satisfied. If the time step is small enough, it can be expected that
the intermediate state should not deviate too much from the equilibrium. On the other hand, if
the time step is large, the intermediate state can be far from the equilibrium. The midstep residual
norm provides a measure of the accuracy of the equilibrium for each time step. You can issue the
MIDTOL command to select this criterion. See the MIDTOL command description for suggested
tolerance values. See also Midstep Residual for Structural Dynamic Analysis in the Mechanical APDL
Theory Reference.
After calculating the time step using the appropriate guidelines, use the minimum value for your
analysis. By using automatic time stepping, you can let the program decide when to increase or de-
crease the time step during the solution. Automatic time stepping is discussed next.
Caution:
Avoid using exceedingly small time steps, especially when establishing initial conditions.
Exceedingly small numbers can cause numerical difficulties. Based on a problem time scale
of unity, for example, time steps smaller than 10-10 could cause numerical difficulties.
5.6.2. Automatic Time Stepping
Automatic time stepping, also known as time step optimization, attempts to adjust the integration
time step during solution based on the response frequency and on the effects of nonlinearities. The
main benefit of this feature is that the total number of substeps can be reduced, resulting in computer
resource savings. Also, the number of times that you might have to rerun the analysis (adjusting the
179
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Transient Dynamic Analysis Options

time step size, nonlinearities, and so on) is greatly reduced. If nonlinearities are present, automatic
time stepping gives the added advantage of incrementing the loads appropriately and retreating to
the previous converged solution (bisection) if convergence is not obtained. You can activate automatic
time stepping with the AUTOTS command. (For more information on automatic time stepping in the
context of nonlinearities, see Nonlinear Structural Analysis (p. 257).)
Although it seems like a good idea to activate automatic time stepping for all analyses, there are
some cases where it may not be beneficial (and may even be harmful):
• Problems that have only localized dynamic behavior (for example, turbine blade and hub as-
semblies), where the low-frequency energy content of part of the system may dominate the
high-frequency areas
• Problems that are constantly excited (for example, seismic loading), where the time step tends
to change continually as different frequencies are excited
• Kinematics (rigid-body motion) problems, where the rigid-body contribution to the response
frequency term may dominate
5.6.3.Transient Dynamic Analysis Settings Based on Application
Many transient dynamic analysis settings can be automatically set by the program based on the in-
tended application. When you specify an application type on the TINTP command, the program
automatically defines the time-integration constants (GAMMA parameter on TINTP) and several solver
settings. Listed below are the application-based settings you can choose from.
Impact Simulation
Use the command TINTP,IMPA if the intended application is an impact simulation and you do not
want any numerical dissipation. The program follows the time-integration method that you specify
via the TRNOPT command (Newmark or HHT) and sets GAMMA = 0, resulting in no numerical dissipation.
High Speed Simulation
Use the command TINTP,HISP if the intended application is a high speed simulation. The program
follows the time-integration method that you specify via the TRNOPT command (Newmark or HHT)
and sets GAMMA = 0.005, resulting in a small numerical dissipation.
The Impact Simulation (IMPA) and High Speed Simulation (HISP) options result in little or no energy
dissipation. Therefore, it might be hard to achieve convergence under these settings. However, they
can accurately capture the dynamic response of a structure. For example, the IMPA and HISP options
are recommended in the following cases: analyzing high frequency vibrations in a structure; and
studying the wave propagation in a structure during impact.
Moderate Speed Simulation
Use the command TINTP,MOSP if the intended application is a moderate speed simulation. The pro-
gram follows the time-integration method that you specify via the TRNOPT command (Newmark or
HHT) and sets GAMMA = 0.1, resulting in a moderate numerical dissipation which helps to achieve
convergence without significant energy loss. This setting can be used for most transient dynamic
simulations.
Low Speed Simulation
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
180
Transient Dynamic Analysis

Use the command TINTP,LOSP if the intended application is a low speed simulation. The program
follows the time-integration method that you specify via the TRNOPT command (Newmark or HHT)
and sets GAMMA = 0.414, resulting in a high numerical dissipation. The automatic time incrementation
is changed such that only one point per cycle is required per integration time step, therefore allowing
use of much larger time increments.
For the LOSP option, the mid-step convergence check is ignored, overriding the MIDTOL command.
The impact constraints for contact elements defined using KEYOPT(7) = 4 are also ignored. These
settings help to achieve convergence and larger time increments in a nonlinear transient dynamic
simulation. However, because of the higher numerical dissipation, the LOSP option is recommended
for low-speed applications where the high frequency vibrations of structures are not of interest; for
example, simulating metal forming processes like rolling or extrusion.
Quasi-Static Simulation
Use the command TINTP,QUAS if the intended application is quasi-static. For this option, the program
uses backward Euler time-integration. The high numerical dissipation in this time-integration scheme
can help to achieve convergence in some problems that are quasi-static in nature but fail to converge
in a static analysis. This option is valid for any physics type as well as coupled-physics elements.
Similar to the program default for ANTYPE,STATIC, the loads are ramped by default (KBC,0). The
automatic time incrementation does not try to maintain any minimum points per cycle, therefore al-
lowing use of much larger time increments. The mid-step convergence check is ignored, overriding
the MIDTOL command. The impact constraints for contact elements defined using KEYOPT(7) = 4 are
also ignored.
Applications that can benefit from using the QUAS option include: buckling dominated simulations;
models that may display temporary rigid body modes; and simulations that have a snap-through
event, causing instability.
5.7.Where to Find Other Examples
Several Ansys, Inc. publications, particularly the Mechanical APDL Verification Manual, describe additional
transient dynamic analyses.
The Mechanical APDL Verification Manual consists of test case analyses demonstrating the analysis cap-
abilities of the program. While these test cases demonstrate solutions to realistic analysis problems, the
Mechanical APDL Verification Manual does not present them as step-by-step examples with lengthy data
input instructions and printouts (unnecessary if you have at least some finite element experience). Be
sure to review each test case's finite element model and input data with accompanying comments.
The Mechanical APDL Verification Manual includes a variety of transient dynamic analysis test cases:
VM9  - Large Lateral Deflection of Unequal Stiffness Springs
VM40  - Large Deflection and Rotation of a Beam Pinned at One End
VM65  - Transient Response of a Ball Impacting a Flexible Surface
VM71  - Transient Response of a Spring, Mass, Damping System
VM72  - Logarithmic Decrement
VM73  - Free Vibration with Coulomb Damping
181
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Where to Find Other Examples


## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/ANSYS_Mechanical_APDL_Technology_Showcase_Example_Problems.txt (lines 13133-13332 · enclosing doc section)

Frame-Bucket-2
4
Cylindrical
Piston2-Frame
5
Translational
Cylinder2-Piston2
3
Spherical
Cylinder2-Ground
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
298
Transient Dynamic Analysis of a Digger-Arm Assembly

The redefinition of joints outlined in the table is not necessarily unique; however, it meets the objective
of ensuring that a joint does not unnecessarily constrain motion in a particular direction which has
been otherwise constrained.
With the new joint definitions, the free degrees of freedom in the model are now calculated as follows:
+60
10 rigid bodies x 6 degrees of
freedom per rigid body
-10
2 revolute joints x 5 constraints
-10
2 translational joints x 5 constraints
-16
4 cylindrical joints x 4 constraints
-15
5 spherical joints x 3 constraints
-6
2 prismatic joints x 5 constraints
+2
Number of free degrees of
freedom
The number of free degrees of freedom in the model matches the required number of degrees of
freedom. A transient dynamic analysis of the digger-arm assembly, with all parts rigid and joints re-
defined, exhibits the correct kinematic response.
In this problem, the joints as defined above are used for all subsequent analyses.
For further information, see Connecting Multibody Components with Joint Elements in the Multibody
Analysis Guide and Constraints and Lagrange Multiplier Method in the Mechanical APDL Theory Reference.
19.3.3. Modeling Flexible Parts
Frequently, a part or component may be modeled as flexible if its material behavior is defined as
nonlinear (for example, with plasticity or hyperelasticity) or the part is expected to undergo large
deformation. A wide variety of continuum and structural elements is available to model the flexibility.
The two connecting rods are defined to be flexible for this analysis. The flexible parts are meshed
with SOLID185 elements. A total of 876 SOLID185 elements are used in the analysis. The following
figure shows the finite-element mesh:
Figure 19.5: Connecting Rods Modeled with SOLID185 Elements
299
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Modeling

For further information, see Modeling Flexible Bodies in a Multibody Analysis in the Multibody Analysis
Guide.
19.3.4. Modeling Flexible Parts with CMS Superelements
Flexible bodies are often modeled with component mode synthesis (CMS) superelements to reduce
computational requirements. The advantage of CMS is that the many degrees of freedom in a flexible
multibody system are replaced by a limited set of degrees of freedom, thereby reducing the compu-
tational time required. The CMS superelement represents the stiffness and mass of the flexible body
and is used in place of a standard element in the analysis phase.
Following is the general process for generating and using a CMS superelement:
1. Prepare a full model of the flexible multibody system (including joint loads).
2. Define components for each flexible body to be represented as a CMS superelement:
- Create a component of the master nodes that defines the master degrees of freedom.
- Create a component of all elements in the body.
3. Generate a CMS substructure file (in the generation pass) characterizing the dynamic flexibility
of the body.
4. Use the CMS substructure information (in the use pass) in a standard analysis.
The CMS substructure information is used to define a CMS superelement representing the
flexible body.
5. Expand the results of the analysis (in the expansion pass) to all elements in the flexible body
to recover its stress and deformation fields.
6. Postprocess the results for stress and deformation fields in the model.
For the analysis requiring a CMS superelement representation of the flexible part, the two connecting
rods are once again defined as flexible. The rods are then modeled as CMS superelements.
The following example input creates the components:
/com,*********** Create Components for CMS ***********
nsel,none                   ! create nodal component of master nodes
nsel,a,node,,Node#,         ! add pilot node attached to this body
nsel,a,node,,Node#,         ! add pilot node attached to this body
cm,COMPONENT_MASTER,NODE
esel,s,elem,,COMPONENT
nsle                        ! select any nodes touching these bodies in the user-defined component
esln                        ! add in any touching elements such as contact and surf effect
cm,COMPONENT_BODY,ELEM
allsel
The following example input creates the CMS substructure file:
/solu
antype,substr                 ! perform a substructure analysis
seopt,Component,2             ! CMS substructure file name and generate stiffness and mass matrices
cmsopt,free,30                ! specify CMS analysis options with free-interface method
mdele,all,all                 ! delete any previously generate master dofs
cmsel,s,COMPONENT_MASTER      ! select the master node component
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
300
Transient Dynamic Analysis of a Digger-Arm Assembly

m,all,all                     ! define master degrees of freedom
cmsel,s,COMPONENT_BODY        ! select the body element component
nsle
save
solve
finish
Because the analysis phase considers both the lower and higher modes of vibration to be equally
important, the free-interface method (CMSOPT,FREE) is used to generate the substructure files.
The following example input defines and uses the CMS superelement during the analysis phase:
/filnam, FILENAME
resume,                       ! resumes database
/prep7
cmsel,u,COMPONENT_BODY        ! unselect the flexible elements
cmsel,a,COMPONENT_MASTER      ! make sure the master nodes are selected
et,100,50                     ! define substructure element type using available itype number
type,100
real,100
mat,100
mp,mu,100,0.0
se,ConnectRod1                ! define substructure element
/solu
antype,trans
nlgeom, on
...
...
finish
The following example input shows expands the results to the full flexible body:
/filnam,FILENAME
resume
/solu
expass,on
seexp,Component,FILENAME        ! substructure name and the use pass jobname 
numexp,all,,,yes                ! Expand all time points
solve
finish
For further information, see Using Component Mode Synthesis Superelements in a Multibody Analysis
in the Multibody Analysis Guide.
19.4. Material Properties
Following are the material properties used for the flexible bodies:
Flexible Body Material Properties
2.00E + 11
Young's Modulus (Nm-2)
0.3
Poisson's Ratio
7850
Density (Kgm-3)
301
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Material Properties

19.5. Boundary Conditions and Loading
The entire digger-arm model is subjected to acceleration to account for gravity. The two piston-cylinder
arrangements are also activated simultaneously. In the finite-element model, these piston-cylinder ar-
rangements are represented as translational joints. Displacement boundary conditions are applied on
the free relative degree of freedom of the translational joints. The displacements are applied over three
load steps, as shown:
Figure 19.6: Relative Displacement Specifications for Cylinders and Pistons
The following example input applies the acceleration and displacement loading (ACEL and DJ):
acel,%_acelx%,%_acely%,%_acelz%      ! apply acceleration loading via table
esel,s,type,, id1#                   ! select the first translational joint
dj,all,ux,%_load1%                   ! apply loads defined by table
esel,all
esel,s,type,, id2#                   ! select the other translational joint
dj,all,ux,%_load2%                   ! apply loads defined by table
19.6. Analysis and Solution Controls
Two nonlinear transient dynamic analyses (ANTYPE,TRANS) are performed on the digger-arm assembly.
Finite-deformation and large-rotation effects are included in the analysis (NLGEOM).
An analysis is performed for each of the following cases:
• The connecting rods are modeled as flexible with SOLID185 elements.
• The flexible connecting rods are now modeled as CMS superelements.
In general, automatic time-stepping schemes are preferred over fixed-time stepping schemes, as the
program is allowed to cut back when the problem does not converge; when the convergence rate is
good, larger time increments are used to achieve faster convergence. For this problem, however, fixed
time-stepping with a time increment of 0.2 seconds is used so that the results at additional time points
can be captured. Three load steps, each having a 10-second duration, are used, for a total analysis time
of 30 seconds.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
302
Transient Dynamic Analysis of a Digger-Arm Assembly

A default numerical damping of 0.1 is set (TINTP), and the HHT time-integration method is selected
(TRNOPT).
The following example input performs the essential tasks in the analysis process:
/solu
antype,4                   ! transient analysis
nlgeom,on                  ! activate large-deformation effects
trnopt,full,,,,,hht        ! HHT time-integration method
tintp,0.1                  ! numerical damping
autots,off                 ! automatic time-stepping disabled
deltim,0.1,0.1,0.1         ! set time increments
time,10.                   ! set total time
timint,on                  ! activate time-integration effects
outres,all,all             ! output all results at all time points
!
solve                      ! solve for 1st load step
time, 20.                  
solve                      ! solve for 2nd load step
time, 30.

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt (lines 15059-15114 · sibling doc section)

8.12.1.4. Apply Loading Gradually
For nonconservative, path-dependent systems, you need to apply the load in small enough incre-
ments to ensure that your analysis closely follows the structure's load-response curve.
You can sometimes improve the convergence behavior of conservative systems by applying the
load gradually, so as to minimize the number of Newton-Raphson equilibrium iterations required.
8.12.2. Overcoming Convergence Problems
This section provides information to help you fix convergence problems in a nonlinear analysis. The
following topics are available:
8.12.2.1. Overview of Convergence Problems
8.12.2.2. Performing Nonlinear Diagnostics
8.12.2.3.Tracking Convergence Graphically
8.12.2.4. Automatic Time-Stepping
8.12.2.5. Line Search
8.12.2.6. Nonlinear Stabilization
8.12.2.7. Arc-Length Method
8.12.2.8. Artificially Inhibit Divergence in Your Model's Response
8.12.2.9. Use the Nonlinear Adaptivity Feature
8.12.2.10. Dispense with Extra Element Shapes
8.12.2.11. Using Element Birth and Death Wisely
8.12.2.12. Read Your Output
8.12.2.13. Graph the Load and Response History
8.12.2.14. Semi-Implicit Method
8.12.2.15. Solution Transition Method
8.12.2.1. Overview of Convergence Problems
When performing a nonlinear analysis you may encounter convergence difficulties due to a number
of reasons. Some examples may be initially open contact surfaces causing rigid body motion, large
load increments causing nonconvergence, material instabilities, or large deformations causing mesh
distortion that result in element shape errors. The program automatically adjusts solution parameters
and attempts to obtain a robust, accurate solution. In addition, several tools are available to help
you identify potential problems before, during, and after a solution.
CHECK, MCHECK, and CNCHECK commands help you verify if there are any obvious problems with
the model before you start the solution. The CHECK command does an overall verification of the
model, including missing elastic properties, unconstrained model, and element shape checks. The
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
312
Nonlinear Structural Analysis

MCHECK command can help you identify defects in the mesh such as holes or cracks, especially
when the mesh is imported from a third party software. The CNCHECK command provides the
initial contact status of contact pairs, identifying whether the contacts are initially open or closed.
If, for example, a part in your model is constrained only through contact with other parts and if
the contact surfaces are open, the CNCHECK command can help you identify this potential error
condition.
When you analyze models with large deformations, some portions of the initial mesh can become
highly distorted. Highly distorted elements can take on unacceptable shapes, providing inaccurate
results. This can cause your nonlinear solution to stop. When this happens, use the ESCHECK
command to perform shape checking of deformed elements in the postprocessor (based on the
current set of results in database). This deformed-shape checker helps you to identify the portions
of your model that require different meshing, thereby allowing them to retain acceptable shapes.
Using ESCHECK at different time points helps you to identify the load conditions that cause mesh
deterioration.
A convergence failure can also indicate a physical instability in the structure, or it can merely be
the result of some numerical problem in the finite element model.
The following sections detail some of the techniques that you can use to attempt to improve the
convergence performance of your analysis.

## 004 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt (lines 15233-15252 · sibling doc section)

8.12.2.8. Artificially Inhibit Divergence in Your Model's Response
If you do not want to use both nonlinear stabilization and the arc-length method to analyze a force-
loaded structure that starts at, or passes through, a singular (zero stiffness) configuration, you can
sometimes use other alternatives to artificially inhibit divergence in your model's response:
• In some cases, you can use imposed displacements instead of applied forces. This approach can
be used to start a static analysis closer to the equilibrium position, or to control displacements
through periods of unstable response (for example, snap-through or postbuckling).
• Another technique that can be effective in circumventing problems due to initial instability is
running a static problem as a "slow dynamic" analysis (that is, using time-integration effects in
an attempt to prevent the solution from diverging in any one load step).
• You can also apply temporary artificial stiffness to unstable degrees of freedom, using control
elements (such as COMBIN37), or using the birth and death option on other elements. The idea
here is to artificially restrain the system during intermediate load steps in order to prevent un-
realistically large displacements from being calculated. As the system displaces into a stable
configuration, the artificial stiffness is removed.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
316
Nonlinear Structural Analysis


## 005 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt (lines 13036-13042 · sibling doc section)

8.3.5. Nonlinear Transient Analyses
The procedure for analyzing nonlinear transient behavior is similar to that used for nonlinear static
behavior: you apply the load in incremental steps, and the program performs equilibrium iterations
at each step. The main difference between the static and transient procedures is that time-integration
effects can be activated in the transient analysis. Thus, "time" always represents actual chronology in
a transient analysis. The automatic time-stepping and bisection feature is also applicable for transient
analyses.
</rag-context>