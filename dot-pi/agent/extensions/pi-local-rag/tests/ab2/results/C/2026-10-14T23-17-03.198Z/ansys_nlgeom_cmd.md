<rag-context>
[pi-local-rag] RAG subagent: 14 sources, 30455 ms retrieval.
grep term: "NLGEOM"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/core/weakform.py (lines 99-102 · enclosing function/class)

    def iter_leaf(self):
        """Iterate over the leaf weakforms contained in this object."""
        yield self


## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/tests/test_interface_force_nlgeom.py (lines 1-67 · whole file (short script))

from types import SimpleNamespace

import pytest

import fedoo as fd


class _AssemblyStub:
    def __init__(self):
        self._nlgeom = False
        self.updated_displacement = None

    def set_disp(self, displacement):
        self.updated_displacement = displacement


def _interface_force(nlgeom=None):
    fd.ModelingSpace("3D")
    law = fd.constitutivelaw.Spring(Kx=1.0, Ky=1.0, Kz=1.0)
    return fd.weakform.InterfaceForce(law, nlgeom=nlgeom)


def test_interface_force_inherits_problem_nlgeom():
    weakform = _interface_force()
    assembly = _AssemblyStub()
    displacement = object()
    problem = SimpleNamespace(
        nlgeom=True,
        get_disp=lambda: displacement,
    )

    weakform.initialize(assembly, problem)
    weakform.update(assembly, problem)

    assert assembly._nlgeom == "UL"
    assert weakform.nlgeom == "UL"
    assert assembly.updated_displacement is displacement


def test_interface_force_explicit_false_overrides_problem_nlgeom():
    weakform = _interface_force(nlgeom=False)
    assembly = _AssemblyStub()
    problem = SimpleNamespace(
        nlgeom=True,
        get_disp=lambda: object(),
    )

    weakform.initialize(assembly, problem)
    weakform.update(assembly, problem)

    assert assembly._nlgeom is False
    assert weakform.nlgeom is False
    assert assembly.updated_displacement is None


def test_interface_force_rejects_total_lagrangian_formulation():
    weakform = _interface_force(nlgeom="TL")
    assembly = _AssemblyStub()
    problem = SimpleNamespace(nlgeom=False)

    with pytest.raises(NotImplementedError, match="InterfaceForce"):
        weakform.initialize(assembly, problem)


if __name__ == "__main__":
    pytest.main([__file__])


## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/tests/test_distributed_load_neumann_bc.py (lines 181-200 · enclosing function/class)

def test_follower_assembly_neumann_load_without_initial_value_skips_start_vector():
    pb, bc = _build_problem(
        load_nlgeom=True, problem_nlgeom=True, load_kind="distributed"
    )
    load = bc.assembly
    set_start = load.set_start
    load_factors = []

    def counted_set_start(problem, t_fact=None):
        load_factors.append(t_fact)
        return set_start(problem, t_fact)

    load.set_start = counted_set_start

    pb.apply_boundary_conditions(t_fact=0.25, t_fact_old=0.0)

    assert load_factors == [1]
    assert bc.start_value == 0

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 1275-1361 · enclosing doc section)

1.2.1. Applicable Products
This document applies to the following family of products:
Ansys Mechanical Pro (structural, full thermal, and vibration analysis)
Ansys Mechanical Premium (nonlinear structural, full thermal, vibration, linear dynamics
analysis)
Ansys Mechanical Enterprise (advanced nonlinear structural, full thermal, vibration, linear
dynamics and nonlinear transient dynamics, fracture, acoustics, full coupled-field, hydrodynam-
ics)
Ansys Mechanical Enterprise PrepPost
Ansys Mechanical Enterprise Solver (batch mode)

## 005 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Substructuring_Analysis_Guide.txt (lines 2893-3092 · enclosing doc section)

grep term: "contains"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 7414-7613 · enclosing doc section)

...
...
relative modulus Maxwell element 
2(NPTS) - 1
Time
relaxation time Maxwell element 
2(NPTS)
For TBOPT = SHEAR and TBOPT = BULK, the sum of relative moduli (
) should be between 0 and
1 (
 or 
) to avoid having negative material stiffness.
If the relaxation time is zero, then the stress contribution of the corresponding Maxwell element is
zero.
Use TBOPT = INTEGRATION with the Prony table (TB,PRONY) to select the stress update algorithm.
If the table is not defined, or the value of the first table location is equal to 1, then the default
midpoint formula from Equation 4.42 (p. 159) and Equation 4.43 (p. 159) are used. If the value of the
first table location is equal to 2, then the constant strain rate formula from Equation 4.44 (p. 159)
and Equation 4.45 (p. 159) are used.
If the sum of the relative moduli for the shear Prony data table 
 is very close to 1, the long-
term shear modulus (
) becomes very small. When combined with certain loading
patterns, this can lead to an extremely small algorithmic stiffness and cause convergence difficulties.
This specific issue is more likely to occur when the time increments become extremely large or
small, such as when certain time-temperature shift parameters produce very large or very small
shifted time steps. To improve robustness, it is recommended to keep 
 safely below 1 (sums
less than or equal to 0.999 are usually acceptable) and to avoid shifted time increments that are
excessively large or small.
4.8.1.2. Small Strain with Large Deformation
This model is used when the large-deflection effects are active (NLGEOM,ON).
To account for large displacement, the model is formulated in the co-rotated configuration using
the co-rotated deviatoric stress Σ = RTsR, where R is the rotation obtained from the polar decom-
position of the deformation gradient. The pressure component of the Cauchy stress does not need
to account for the material rotation and uses the same formulation as the small-deformation
model.
The deviatoric stress update is then expressed as:
(4.46)
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
160
Nonlinear Material Properties

where ΔR = R(t1)RT(t0) is the incremental rotation.
Parameter input for this model resembles the input requirements for the small-deformation vis-
coelastic (p. 157) model.
4.8.1.3. Large Deformation
The large-strain viscoelastic constitutive model is a modification of the model proposed by Simo.
Modifications are included for viscoelastic volumetric response and the use of time-temperature
superposition (p. 163).
The linear structure of the formulation is provided by the generalized Maxwell model. Extension to
large deformation requires only a hyperelastic model for the springs in the Maxwell elements. Hy-
perelasticity is defined by a strain energy potential 
, where, for isotropic materials:
(4.47)
where:
 right Cauchy-Green deformation tensor
 isochoric part of C
 determinant of the deformation gradient
 isochoric (deviatoric) part of the strain energy
 volumetric part of the strain energy
The instantaneous second Piola-Kirchhoff stress in the Maxwell element springs is then:
(4.48)
with:
where:
 instantaneous hydrostatic pressure
 instantaneous fictitious second Piola-Kirchhoff stress
The current second Piola-Kirchhoff stress obtained with the presented hyper-viscoelastic model can
be expressed as:
with the long-term relative moduli defined as:
161
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Viscoelasticity

where 
 and 
 are additional algorithmic history variables associated with the Maxwell elements
 and . By using the midpoint rule, the recursive update of these internal variables is given by:
(4.49)
(4.50)
An anisotropic hyperelastic model can also be used for Equation 4.47 (p. 161), in which case the
form of the Maxwell element stress updates are unchanged.
In combination with the Mullins effect, the program accounts for the additional damage effect in
the hyperelastic element but not in the Maxwell elements of the generalized Maxwell model. Con-
sequently, the stresses in the Maxwell spring elements are obtained from the original strain-energy
potential without Mullins-effect modification.
This model requires the Prony series parameters to be input via the Prony data table (as described
in Small Deformation (p. 157)). The hyperelastic parameters for this model are input via a hyperelastic
data table (TB,HYPER). Optionally, you can also apply the Mullins effect (TB,CDM with TBOPT =
PSE2 or MUSER). For more information, see Hyperelasticity (p. 126).
4.8.1.4. Stored Energy and Dissipation
For a physical interpretation of the Prony series formulation, the stored energy is the potential energy
of the spring elements and the dissipated energy is the energy used to deform the dashpots in the
Maxwell elements.
The increment of energy used by the dashpots over a time increment is:
(4.51)
where, for dashpot i,
 is the deviatoric stress,
 is the increment in deviatoric strain,
 is the
pressure, and 
 is the increment in volumetric strain.
For an additive decomposition of the Maxwell element strains, the dashpot strain increment is
given by:
where 
 is the strain increment,
 is the Maxwell spring compliance, and 
 is the stress increment.
Defining 
 as the instantaneous compliance, the Maxwell spring compliance is:
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
162
Nonlinear Material Properties

The dashpot strain increment and compliance can be applied to both deviatoric and volumetric
components, and then 
 corresponds to either the deviatoric or volumetric relative modulus for
Maxwell element i.
Using Equation 4.51 (p. 162), the stored energy increment is given by the total energy increment
minus the dissipation:
where 
 is the total energy and the increment is given by:
Used in the automatic time-stepping (CUTCONTROL), a scalar equivalent viscous-strain increment
can be defined as:
where:
For large deformation, the incremental stored energy and dissipation use strain increments calculated
from the rate-of-deformation tensor and a Maxwell-compliance tensor calculated from the instant-
aneous hyperelastic stiffness and the relative moduli. Note that with this procedure, the viscous
dissipation and, therefore, the elastic energy density can only be approximated.
The viscoelastic stored- and dissipated-energy results are stored as item SEND and components
ELASTIC and VDAM, respectively.
4.8.2.Time-Temperature Superposition
For thermorheologically simple materials, the influence on the material behavior due to changing
temperature is the same as that due to changing time. For these materials, a rate-dependent material
response, P (a function of temperature and time), can be reduced to:
(4.52)
where:
 = current absolute temperature
 = constant absolute reference temperature
 = shifted time given by 
, where 
 = shift function.
163
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Viscoelasticity

The constitutive equations are solved in the shifted time scale. This method has the potential to reduce
the experimental effort required to determine the material parameters but requires the determination
of the shift function.
The shift functions 
 are evaluated in an absolute temperature scale determined by adding the
temperature offset value (TOFFST) to the current temperature, reference temperature, and fictive
temperature in the shift functions.
The following forms of the shift function are available:
4.8.2.1.Williams-Landel-Ferry Shift Function
4.8.2.2.Tool-Narayanaswamy Shift Function
4.8.2.3. Piecewise Linear Shift Function
4.8.2.4. User-Defined Shift Function
4.8.2.1.Williams-Landel-Ferry Shift Function
The Williams-Landel-Ferry shift function has the form:
(4.53)
where C1 and C2 are material parameters. (The shift function is often given in the literature with
the opposite sign.)
The parameters are input via a shift function data table (TB,SHIFT).
For the Williams-Landel-Ferry shift function, TBOPT = WLF, and the required input constants are:
Constant
Table Location
Tr
1
C1
2
C2
3
4.8.2.2.Tool-Narayanaswamy Shift Function
Two forms of the Tool-Narayanaswamy shift function are available, one of which includes a fictive
temperature.
The first form is given by:
(4.54)
where 
 is the scaled activation energy.
The parameters are input in a shift function data table (TB,SHIFT).
For the Tool-Narayanaswamy shift function, TBOPT = TN, and the required input constants are:
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
164
Nonlinear Material Properties

Constant
Table Location
Tr
1
2
The second form of the Tool-Narayanaswamy shift function includes an evolving fictive temperature.
The fictive temperature is used to model material processes that contain an intrinsic equilibrium
temperature that is different from the ambient temperature of the material. The shift function is
given by:

grep term: "Inc."

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Basic_Analysis_Guide.txt (lines 4107-4218 · enclosing doc section)

3.9.3. Example: Bolt Sleeve Model Undergoing Large Rotation
The following example describes the procedure to apply preload to a bolt sleeve model undergoing
a large rotation.
Initial Meshed Structure
Bolt Sleeve Model
1. After meshing the bolt sleeve model, PSMESH is used to cut the mesh of the selected bolt elements
into two parts and generate the required elements. Two force-distributed surface-based constraints
are created (one on each surface), and an MPC184 cylindrical joint element is connected to the
two pilot nodes. For this example, a local coordinate system is defined at the cutting location,
and the bolt is cut in the z-direction. By default, KEYOPT(4) = 1 is set for the MPC184 element to
define the z-axis cylindrical joint.
       local,12,0,50.0026090261661,50.0000009547169,40.,-180.,0.,180.
       nsel,s,,,bolt_node
       esln
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
80
Loading

       psmesh,19,,,all,,12,z,0,,,torque
       allsel,all
Figure 3.28: Two Force-Distributed Constraints with Joint Element at Cutting Location
2. In the first load step, you typically apply a force or a displacement to the joint element with the
FJ or DJ command. In this case, the load is applied as a force and a moment in the z-direction. A
negative FZ value is used to create the effect of pretension. The force "locks" on the second step,
allowing additional loads. The effect of the initial load is preserved as a displacement after it is
locked. The full model is rotated around the x-axis 30 degrees to the remote point.
time,1
esel,s,sec,,19
fj,all,fz,-146100.        ! Preload is applied as FZ
esel,all
esel,s,sec,,19
fj,all,mz,170500.         ! Preload is applied as MZ
allsel,all
solve
time,2
esel,s,sec,,19
fjdele,all,all
dj,all,uz,%_fix%          ! FZ is redefined as UZ 
dj,all,rotz,%_fix%        ! MZ is redefined as ROTZ
allsel,all
solve 
81
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Defining Preload in a Joint Fastener Undergoing Large Rotation

Results
Figure 3.29: UZ Displacement
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
82
Loading

Figure 3.30: Normal Stress Plot in the Z-direction
As expected, the axial stress is tensile in the bolt and compressive in the portion of the plates com-
pressed by the bolt heads.
83
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Defining Preload in a Joint Fastener Undergoing Large Rotation

Figure 3.31: Deformed Shape at Last Load Step
Figure 3.32: von-Mises Stress at Last Load Step
\
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
84
Loading

Figure 3.33: Animation of von-Mises Stress
85
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Defining Preload in a Joint Fastener Undergoing Large Rotation

Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
86

Chapter 4: Using the Function Tool
The Function Tool enables you to define a dependent variable as a function of one or more independent
variables. Using the Function Tool, you can define complicated boundary conditions on a model, or the
nonlinear material behavior for a joint element.
Example 1 
Suppose that the applied displacement at a node of the model is a function of temperature and
velocity. The function is defined as follows:
u = (-0.007 * T + 0.50) Vr
where T is the temperature and Vr is the relative velocity.
You can input the function, thereby specifying the boundary condition at that node.
Example 2 
Suppose the nonlinear damping force characteristics in a joint element varies quadratically with
temperature and linearly with velocity. The function is defined as follows:
F = f(T) Vr
or
F = (C1T2 + C2T + C3) Vr
where C1, C2, and C3 are constants, T is the temperature, and Vr is the relative velocity.
You can input the function along with the constant values, thereby incorporating the damping charac-
teristics by specifying a nonlinear force that varies with relative velocity and temperature.
The following Function Tool topics are available:
4.1. Function Tool Terminology
4.2. Using the Function Editor
4.3. Using the Function Loader
4.4. Applying Boundary Conditions Using the Function Tool
4.5. Function Tool Example
4.6. Graphing or Listing a Function
For more information, see Specifying a Function Describing Nonlinear Stiffness Behavior in the Material
Reference.
87
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 37664-37863 · enclosing doc section)

Component
total mechanical
X, Y, Z, XY, YZ,
XZ
EPTT
and thermal and
swelling strain
Principal total
mechanical and
1, 2, 3
thermal and
swelling strain
value
Total
mechanical and
INT
thermal and
swelling strain
intensity value
Equivalent total
mechanical and
EQV
thermal and
swelling strain
value

## 011 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt (lines 1079-1128 · chunk range (no structural region))

grep term: "commands"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 47-96 · chunk range (no structural region))

Table of Contents
1. About This Reference .............................................................................................................................. 1
1.1. Conventions Used in This Reference .................................................................................................. 1
1.1.1. Applicable Products ................................................................................................................. 2
1.1.2.Valid Products .......................................................................................................................... 2
1.2. Terminology ..................................................................................................................................... 3
1.3. Command Characteristics ................................................................................................................. 5
1.3.1. Data Input ............................................................................................................................... 5
1.3.2. Free-Format Input .................................................................................................................... 5
1.3.3. Nonrestrictive Data Input ......................................................................................................... 5
1.3.4. Condensed Data Input ............................................................................................................. 6
1.3.5. Units ........................................................................................................................................ 6
1.3.6. Command and Argument Defaults ........................................................................................... 7
1.3.7. File Names ............................................................................................................................... 7
1.3.8. Star and Slash Commands ........................................................................................................ 8
2. Command Groupings ............................................................................................................................ 11
2.1. SESSION Commands ....................................................................................................................... 11
2.2. DATABASE Commands .................................................................................................................... 13
2.3. GRAPHICS Commands .................................................................................................................... 16
2.4. APDL Commands ............................................................................................................................ 19
2.5. PREP7 Commands ........................................................................................................................... 23
2.6. SOLUTION Commands .................................................................................................................... 38
2.7. POST1 Commands .......................................................................................................................... 51
2.8. POST26 Commands ........................................................................................................................ 59
2.9. AUX2 Commands ............................................................................................................................ 62
2.10. AUX3 Commands .......................................................................................................................... 62
2.11. AUX12 Commands ........................................................................................................................ 63
2.12. AUX15 Commands ........................................................................................................................ 64
2.13. Mapping Processor Commands ..................................................................................................... 64
3. Command Dictionary ............................................................................................................................ 65
I. Connection Commands ............................................................................................................................ 69
II. Plugin Commands ................................................................................................................................... 75
III. A Commands .......................................................................................................................................... 77
IV. B Commands ........................................................................................................................................ 223
V. C Commands ......................................................................................................................................... 289
VI. D Commands ....................................................................................................................................... 501
VII. E Commands ....................................................................................................................................... 611
VIII. F Commands ...................................................................................................................................... 755
IX. G Commands ....................................................................................................................................... 815
X. H Commands ........................................................................................................................................ 915
XI. I Commands ......................................................................................................................................... 953
XII. J Commands ........................................................................................................................................ 999
XIII. K Commands .................................................................................................................................... 1003
XIV. L Commands .................................................................................................................................... 1039
XV. M Commands .................................................................................................................................... 1133
XVI. N Commands ................................................................................................................................... 1247
XVII. O Commands .................................................................................................................................. 1351
XVIII. P Commands .................................................................................................................................. 1393
XIX. Q Commands ................................................................................................................................... 1613
XX. R Commands ..................................................................................................................................... 1619

grep term: "following"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/ANSYS_Mechanical_APDL_Technology_Showcase_Example_Problems.txt (lines 13256-13455 · enclosing doc section)

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
solve                      ! solve for 3rd load step
finish
19.7. Results and Discussion
The following animation (generated in Ansys Workbench) shows the motion of the digger-arm assembly:
Figure 19.7: Digger-Arm Assembly Animation
The following figure shows the rotation of the frame with respect to ground for the two transient dy-
namic analysis cases. The motion of the frame (due to the activation of the piston-cylinder assemblies)
is the same in both cases.
303
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Results and Discussion

Figure 19.8: Relative Rotation at Cylindrical Joint (Ground-to-Frame)
The following figure compares the relative rotation of the bucket with respect to the frame for the two
analysis cases. The rotations in the both cases are nearly identical.
Figure 19.9: Relative Rotation at General Joint Along Local Z Axis (Bucket-Frame)
Both relative-rotation figures shown above indicate that the kinematic behavior of the digger-arm as-
sembly, modeled as a rigid/flexible combination, exhibit the same behavior. When flexibility is involved
in an analysis, modeling the assembly as though it consisted of rigid parts and ensuring that the joints
are defined correctly using the rigid dynamics solver, allows the engineer to focus on other issues.
The stresses and deformation fields can be evaluated when the connecting rods are made flexible. The
following figure shows the deformation plots (USUM) of the connecting rods when the rods are modeled
as flexible:
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
304
Transient Dynamic Analysis of a Digger-Arm Assembly

Figure 19.10: USUM Plots of Connecting Rods
The following figure shows the equivalent stresses in the connecting rods when the rods are modeled
using SOLID185 elements and as CMS superelements, respectively.
Figure 19.11: Equivalent Stress Plots of Connecting Rods
305
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Results and Discussion

The time point is at 25 seconds (load step 3, substep 25). The equivalent stress plots show good
agreement with each other.
The following table shows the CPU time comparisons between the two analysis cases.
CMS and Rigid
Parts
Flexible and
Rigid Parts
702
2874
Total degrees of freedom
436
489
Total iterations
2.38 seconds
---
Generation time (with original
database saved)
46.8 seconds
---
Use pass time
78.06 seconds
372.68 seconds
Total CPU time (including
full-model save, generation pass,
use pass, expansion pass, and
results processing)
In all cases, shared memory parallel with two CPUs is used. The results are reported for a 64-bit Linux
system.
The table and the other results discussed highlight some essential analysis considerations:
• It is worthwhile to verify the kinematic behavior of the multibody system by assuming all parts
as rigid, as the time and resources required for the rigid analysis are small. You can use the rigid
dynamics solver (available in Ansys Mechanical) to do so.
• Modeling the flexible bodies using CMS superelements results in significant time savings.
• Analysis of the assembly when the flexible part is modeled with 3D finite elements necessarily
requires more time due to the increased number of degrees of freedom. Such an analysis, however,
should be performed only when the flexible part undergoes large deformations, either due to
nonlinear material behavior or to nonlinear geometric effects.
19.8. Recommendations
To perform a similar transient dynamic analysis of a multibody system, consider the following hints and
recommendations:
• Ensure that the motion and behavior of the model is kinematically consistent by modeling all
parts as rigid bodies connected to each other by joints. You can use the rigid dynamics solver
(available in Ansys Mechanical) to do so.
• Relax overconstraints due to joints by selecting joints of similar behavior. Use a spherical or cyl-
indrical joint instead of a revolute joint if some constraints are deemed unnecessary.
• When modeling flexible parts, build the model incrementally and verify that the motion and
behavior are consistent with expected behavior.
• Use full modeling of the parts only when detailed information about the stress and deformation
fields is required.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
306
Transient Dynamic Analysis of a Digger-Arm Assembly

• For reduced run times, model the flexible parts as CMS superelements whenever possible.
For additional recommendations, see Troubleshooting a Flexible Multibody Analysis in the Multibody
Analysis Guide.
19.9. Input Files
The following files were used in this problem:
• DiggerArm-Flexible.dat -- Input file for connecting rods modeled as flexible using SOLID185
elements.
• DiggerArm-Flexible.inp -- Flexible model information (called by DiggerArm-Flexible.inp).
• DiggerArm-CMS.dat -- Input file for modeling the flexible connecting rods as CMS superelements.
• DiggerArm-CMS.inp -- CMS superelement model information (called by DiggerArm-CMS.dat).
For more information, see Obtaining the Input Files (p. xlvii).
307
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Input Files

Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
308

Chapter 20: Dynamic Simulation of a Printed Circuit
Board Assembly Using Modal Analysis Methods
This example problem uses residual vectors to improve the solution accuracy in modal subspace based
analysis methods, such as modal superposition and power spectral density (PSD) analyses. The problem
includes a study of the computational efficiency of the results-expansion procedure used to obtain the
full-model solution.
The following topics are available:
20.1. Introduction
20.2. Problem Description
20.3. Modeling
20.4. Material Properties

## 017 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 37664-37863 · enclosing doc section)

grep term: "add"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/genindex.html (lines 98-143 · chunk range (no structural region))

           <div itemprop="articleBody">
             

<h1 id="index">Index</h1>

<div class="genindex-jumpbox">
 <a href="#_"><strong>_</strong></a>
 | <a href="#A"><strong>A</strong></a>
 | <a href="#B"><strong>B</strong></a>
 | <a href="#C"><strong>C</strong></a>
 | <a href="#D"><strong>D</strong></a>
 | <a href="#E"><strong>E</strong></a>
 | <a href="#F"><strong>F</strong></a>
 | <a href="#G"><strong>G</strong></a>
 | <a href="#H"><strong>H</strong></a>
 | <a href="#I"><strong>I</strong></a>
 | <a href="#J"><strong>J</strong></a>
 | <a href="#K"><strong>K</strong></a>
 | <a href="#L"><strong>L</strong></a>
 | <a href="#M"><strong>M</strong></a>
 | <a href="#N"><strong>N</strong></a>
 | <a href="#O"><strong>O</strong></a>
 | <a href="#P"><strong>P</strong></a>
 | <a href="#Q"><strong>Q</strong></a>
 | <a href="#R"><strong>R</strong></a>
 | <a href="#S"><strong>S</strong></a>
 | <a href="#T"><strong>T</strong></a>
 | <a href="#U"><strong>U</strong></a>
 | <a href="#W"><strong>W</strong></a>
 | <a href="#Y"><strong>Y</strong></a>
 
</div>
<h2 id="_">_</h2>
<table style="width: 100%" class="indextable genindextable"><tr>
  <td style="width: 33%; vertical-align: top;"><ul>
      <li><a href="generated/fedoo.DataSet.__getitem__.html#fedoo.DataSet.__getitem__">__getitem__() (DataSet method)</a>

      <ul>
        <li><a href="generated/fedoo.weakform.ImplicitDynamic.__getitem__.html#fedoo.weakform.ImplicitDynamic.__getitem__">(ImplicitDynamic method)</a>
</li>
        <li><a href="generated/fedoo.ListBC.__getitem__.html#fedoo.ListBC.__getitem__">(ListBC method)</a>
</li>
        <li><a href="generated/fedoo.MultiFrameDataSet.__getitem__.html#fedoo.MultiFrameDataSet.__getitem__">(MultiFrameDataSet method)</a>
</li>
        <li><a href="generated/fedoo.MultiMeshData.__getitem__.html#fedoo.MultiMeshData.__getitem__">(MultiMeshData method)</a>
</li>

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 37664-37863 · enclosing doc section)

INT
---
Equivalent
plastic strain
value
EQV
For IVAL,
JVAL, and
KVAL: The ALL
Component
creep strain
X, Y, Z, XY, YZ,
XZ
EPCR
(or blank)
option for the
Principal
component
1, 2, 3
element
number is not
creep strain
value
valid. A
specified
Component
creep strain
intensity value
INT
element (n) is
required.
Equivalent
component
EQV
creep strain
value
883
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
*GET

Entity = SECR, ENTNUM = n (element number)  
For beam and pipe (including elbow) section results, return values for all elements
if the element number (n) is blank or ALL.
*GET (p. 825), Par, SECR, n, Item1, IT1NUM, Item2, IT2NUM
IT2NUM
Item2
Description
IT1NUM
Item1
Component
total mechanical
X, Y, Z, XY, YZ,
XZ
EPTT
and thermal and
swelling strain
Principal total
mechanical and
1, 2, 3
thermal and
swelling strain
value
Total
mechanical and
INT
thermal and
swelling strain
intensity value
Equivalent total
mechanical and
EQV
thermal and
swelling strain
value
Component
diffusion strain
X, Y, Z, XY, YZ,
XZ
EPDI
Principal
diffusion strain
value
1, 2, 3
Diffusion strain
intensity value
INT
Equivalent
diffusion strain
value
EQV
Plastic yield
stress
SEPL
NL
Plastic yielding
(1 = actively
SRAT
yielding, 0 = not
yielding)
Hydrostatic
pressure
HPRES
Accumulated
equivalent
plastic strain
EPEQ
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
884
*GET

Entity = SECR, ENTNUM = n (element number)  
For beam and pipe (including elbow) section results, return values for all elements
if the element number (n) is blank or ALL.
*GET (p. 825), Par, SECR, n, Item1, IT1NUM, Item2, IT2NUM
IT2NUM
Item2
Description
IT1NUM
Item1
Accumulated
equivalent creep
strain
CREQ
Plastic
work/volume
PLWK
Yield surface
activity status: 1
TENS,SHEA
YSIDX
for yielded and
0 for not
yielded.
Failure plane
surface activity
TF01,SF01,
TF02,SF02,
FPIDX
status: 1 for
TF03,SF03,
TF04,SF04
yielded and 0
for not yielded.
Tension and
Shear failure
status are
available for all
four sets of
failure planes.
Table 190: *GET Postprocessing Items, Entity = SECTION
Entity = SECTION,ENTNUM = component (listed below).
Generate data for section stress results, using PRSECT (p. 1571) before retrieving these
items. Valid labels for ENTNUM are MEMBRANE, BENDING, SUM (Membrane+Bending) ,
PEAK, and TOTAL. (The following items are not stored in the database and the values
returned reflect the last quantities generated by PRSECT (p. 1571) or PLSECT (p. 1487).) Only
MEMBRANE, BENDING, and SUM data are available after a PLSECT (p. 1487) command.
The MEMBRANE label is only valid with Item1 = INSIDE.
*GET (p. 825), Par, SECTION, component, Item1, IT1NUM, Item2, IT2NUM
Description
Item2
IT1NUM
Item1
Stress component at beginning of path.
X, Y, Z, XY,
YZ, XZ
S
INSIDE
Principal stress at beginning of path.
1, 2, 3
Stress intensity or equivalent stress at beginning of
path.
INT, EQV
Stress component at midpoint of path.
X, Y, Z, XY,
YZ, XZ
S
CENTER
885
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
*GET

Entity = SECTION,ENTNUM = component (listed below).
Generate data for section stress results, using PRSECT (p. 1571) before retrieving these
items. Valid labels for ENTNUM are MEMBRANE, BENDING, SUM (Membrane+Bending) ,
PEAK, and TOTAL. (The following items are not stored in the database and the values
returned reflect the last quantities generated by PRSECT (p. 1571) or PLSECT (p. 1487).) Only
MEMBRANE, BENDING, and SUM data are available after a PLSECT (p. 1487) command.
The MEMBRANE label is only valid with Item1 = INSIDE.
*GET (p. 825), Par, SECTION, component, Item1, IT1NUM, Item2, IT2NUM
Description
Item2
IT1NUM
Item1
Principal stress at midpoint of path.
1, 2, 3
Stress intensity or equivalent stress at midpoint of
path.
</rag-context>