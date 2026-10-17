<rag-context>
[pi-local-rag] RAG subagent: 10 sources, 2776 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/constitutivelaw/elasto_plasticity.py (lines 1-43 · chunk range (no structural region))

"""J2 plasticity with isotropic hardening, additive on the strain measure."""

import numpy as np
from simcoon import Rotation as SimRotation

from fedoo.core.mechanical3d import MechanicalUMAT
from fedoo.util.voigt_tensors import StrainTensorList, StressTensorList


class ElastoPlasticity(MechanicalUMAT):
    r"""Elasto-plastic constitutive law with isotropic hardening.

    The stress integration uses a vectorized radial-return algorithm for the
    von Mises yield criterion. The finite-element lifecycle is provided by
    :class:`fedoo.core.mechanical3d.MechanicalUMAT`; the scalar accumulated
    plastic strain ``P`` and plastic-strain tensor ``EP`` are exposed as
    labelled components of the private ``Statev`` array.

    In a geometrically nonlinear analysis, this law is a corotational
    extension of the same additive small-strain model written on the
    logarithmic strain. Tensorial history is transported with the objective
    rotation increment before each return mapping. The stress returned by the
    radial return is the Kirchhoff stress :math:`\boldsymbol{\tau}` conjugate
    to the logarithmic strain and the Cauchy stress
    :math:`\boldsymbol{\tau}/J` is handed to the assembly, so that the
    response is the one of Simcoon's ``EPICP`` UMAT. This makes the response
    objective under finite rotations, but it is not a multiplicative
    finite-plasticity model (there is no decomposition
    :math:`\mathbf{F} = \mathbf{F}^e \mathbf{F}^p`).

    The returned elastoplastic tangent is the continuum tangent evaluated at
    the updated stress. It is not the algorithmically consistent tangent of
    the discrete radial-return integration. Consequently, global Newton
    convergence is not guaranteed to be quadratic for finite plastic
    increments or non-proportional loading paths.

    .. warning::

        This Python implementation is intended only for pedagogical use and
        as a readable reference implementation. For computational analyses,
        prefer :class:`fedoo.constitutivelaw.Simcoon`, which provides optimized
        constitutive updates and algorithmically consistent tangent options.


## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt (lines 4072-4350 · enclosing doc section)

4.2. Rate-Independent Plasticity
Rate-independent plasticity is characterized by the irreversible straining that occurs in a material once
a certain level of stress is reached. The plastic strains are assumed to develop instantaneously (that is,
independent of time). Several options are available to characterize different types of material behaviors:
• Material Behavior Option
• Bilinear Isotropic Hardening
• Multilinear Isotropic Hardening
• Nonlinear Isotropic Hardening
• Classical Bilinear Kinematic Hardening
• Multilinear Kinematic Hardening
• Nonlinear Kinematic Hardening
• Anisotropic
• Extended Drucker-Prager
• Extended Drucker-Prager Cap
• Cast Iron
• User-specified behavior (described in User Routines and Non-Standard Uses)
Except for user-specified behavior (TB,USER), each material-behavior option is described in greater detail
later in this chapter. Figure 4.1: Stress-Strain Behavior of Each of the Plasticity Options (p. 69) represents
the stress-strain behavior of each of the options.
4.2.1.Theory
Plasticity theory provides a mathematical relationship that characterizes the elastoplastic response
of materials. There are three ingredients in the rate-independent plasticity theory: the yield cri-
terion (p. 67), flow rule (p. 69) and the hardening rule (p. 70). Table 4.1: Notation (p. 67) summarizes
the notation used in the remainder of this chapter.
4.2.2.Yield Criterion
The yield criterion determines the stress level at which yielding is initiated. For multi-component
stresses, this is represented as a function of the individual components,
, which can be inter-
preted as an equivalent stress 
:
(4.4)
where:
 = stress vector
Table 4.1: Notation
Mechanical APDL
Output Label
Definition
Variable
EPEL
elastic strains
EPPL
plastic strains
67
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Rate-Independent Plasticity

Mechanical APDL
Output Label
Definition
Variable
trial strain
EPEQ
equivalent plastic strain
S
stresses
equivalent stress
material yield parameter
HPRES
mean or hydrostatic stress
SEPL
equivalent stress parameter
plastic multiplier
yield surface translation
plastic work
translation multiplier
stress-strain matrix
tangent modulus
yield criterion
SRAT
stress ratio
plastic potential
deviatoric stress
When the equivalent stress is equal to a material yield parameter σy,
(4.5)
the material will develop plastic strains. If 
 is less than 
, the material is elastic and the stresses
will develop according to the elastic stress-strain relations. Note that the equivalent stress can never
exceed the material yield since in this case plastic strains would develop instantaneously, thereby
reducing the stress to the material yield. Equation 4.5 (p. 68) can be plotted in stress space as shown
in Figure 4.2: Various Yield Surfaces (p. 69) for some of the plasticity options. The surfaces in Fig-
ure 4.2: Various Yield Surfaces (p. 69) are known as the yield surfaces and any stress state inside the
surface is elastic, that is, they do not cause plastic strains.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
68
Structures with Material Nonlinearities

Figure 4.1: Stress-Strain Behavior of Each of the Plasticity Options
Figure 4.2: Various Yield Surfaces
4.2.3. Flow Rule
The flow rule determines the direction of plastic straining and is given as:
(4.6)
where:
69
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Rate-Independent Plasticity

 = plastic multiplier (which determines the amount of plastic straining)
 = function of stress termed the plastic potential (which determines the direction of plastic
straining)
If 
 is the yield function (as is normally assumed), the flow rule is termed associative and the plastic
strains occur in a direction normal to the yield surface.
4.2.4. Hardening Rule
The hardening rule describes the changing of the yield surface with progressive yielding, so that the
conditions (stress states) for subsequent yielding can be established. Two hardening rules are available:
work (or isotropic) hardening and kinematic hardening. In work hardening, the yield surface remains
centered about its initial center line and expands in size as the plastic strains develop. For materials
with isotropic plastic behavior this is termed isotropic hardening and is shown in Figure 4.3: Types of
Hardening Rules (p. 70) (a). Kinematic hardening assumes that the yield surface remains constant in
size and the surface translates in stress space with progressive yielding, as shown in Figure 4.3: Types
of Hardening Rules (p. 70) (b).
The yield criterion, flow rule and hardening rule for each option are summarized in Table 4.2: Summary
of Plasticity Options (p. 70) and are discussed in detail later in this chapter.
Figure 4.3: Types of Hardening Rules
Table 4.2: Summary of Plasticity Options
Material
Response
Hardening
Rule
Flow Rule
Yield
Criterion
TB Lab
Name
bilinear
work
hardening
associative
von
Mises/Hill
PLASTIC
(TBOPT
= BISO)
Bilinear Isotropic
Hardening
nonlinear
work
hardening
associative
von
Mises/Hill
NLISO
Nonlinear
Isotropic
Hardening
bilinear
kinematic
hardening
associative
(Prandtl-Reuss
equations)
von
Mises/Hill
PLASTIC
(TBOPT
= BKIN)
Classical Bilinear
Kinematic
Hardening
nonlinear
kinematic
hardening
associative
von
Mises/Hill
CHAB
Nonlinear
Kinematic
Hardening
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
70
Structures with Material Nonlinearities

Material
Response
Hardening
Rule
Flow Rule
Yield
Criterion
TB Lab
Name
multilinear
work
hardening
associative
or
non-associative
von Mises
with
dependence
EDP
Extended
Drucker-Prager
on
hydrostatic
stress
multilinear
work
hardening
non-associative
von Mises
with
CAST
Cast Iron
dependence
on
hydrostatic
stress
multilinear
work
hardening
associative
von Mises
with
GURS
Gurson
dependence
pressure
and porosity
4.2.5. Plastic Strain Increment
If the equivalent stress calculated using elastic properties exceeds the material yield, then plastic
straining must occur. Plastic strains reduce the stress state so that it satisfies the yield criterion,
Equation 4.5 (p. 68). Based on the theory presented in the previous section, the plastic strain increment
is readily calculated.
The hardening rule states that the yield criterion changes with work hardening and/or with kinematic
hardening. Incorporating these dependencies into Equation 4.5 (p. 68), and recasting it into the fol-
lowing form:
(4.7)
where:
 = plastic work
 = translation of yield surface
 and 
 are termed internal or state variables. Specifically, the plastic work is the sum of the plastic
work done over the history of loading:
(4.8)
where:
71
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Rate-Independent Plasticity

and translation (or shift) of the yield surface is also history dependent and is given as:
(4.9)
where:
 = material parameter
 = backstress (location of the center of the yield surface)
Equation 4.7 (p. 71) can be differentiated so that the consistency condition is:
(4.10)
Noting from Equation 4.8 (p. 71) that
(4.11)
and from Equation 4.9 (p. 72) that
(4.12)
Equation 4.10 (p. 72) becomes
(4.13)
The stress increment can be calculated via the elastic stress-strain relations
(4.14)
where:
 = stress-strain matrix
with
(4.15)
since the total strain increment can be divided into an elastic and plastic part. Substituting Equa-
tion 4.6 (p. 69) into Equation 4.13 (p. 72) and Equation 4.15 (p. 72) and combining Equation 4.13 (p. 72),
Equation 4.14 (p. 72), and Equation 4.15 (p. 72) yields
(4.16)
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
72
Structures with Material Nonlinearities

The size of the plastic strain increment is therefore related to the total increment in strain, the current
stress state, and the specific forms of the yield and potential surfaces. The plastic strain increment is
then calculated using Equation 4.6 (p. 69):
(4.17)

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt (lines 4460-4484 · enclosing doc section)

The plastic strain increment is:
(4.31)
where:
75
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Rate-Independent Plasticity

 = plastic multiplier
The equivalent plastic strain increment is then:
(4.32)
The accumulated equivalent plastic strain is:
(4.33)
The power hardening law for nonlinear isotropic hardening behavior (accessed with TB,NLISO,,,,POWER)
which is used primarily for ductile plasticity and damage is developed in the Gurson's Model (p. 89):
(4.34)
where:
 = current yield strength
 = initial yield strength
 = shear modulus
 is the microscopic equivalent plastic strain and is defined by:
(4.35)
where:
 = macroscopic plastic strain tensor
 = rate change of variables

## 004 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 2497-2520 · enclosing doc section)

size of the yield surface, as shown in this figure:
33
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Rate-Independent Plasticity

Figure 4.4: Isotropic Hardening of the Yield Surface
This type of hardening can model the behavior of materials under monotonic loading and elastic
unloading, but often does not give good results for structures that experience plastic deformation
after a load reversal from a plastic state.
For kinematic hardening, the yield surface has the form:
where  is the backstress tensor.
As shown in the following figure, the backstress tensor is the center (or origin) of the yield surface,
and plastic loading from 
 to 
 results in a change in the backstress and therefore a shift
in the yield surface:
Figure 4.5: Kinematic Hardening of the Yield Surface
Kinematic hardening is observed in cyclic loading of metals. It can be used to model behavior such
as the Bauschinger effect, where the compressive yield strength reduces in response to tensile
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
34
Nonlinear Material Properties

## 005 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 2783-2896 · enclosing doc section)

equals a material parameter 
 , the material is assumed to yield.
The yield criterion is then:
(4.21)
The material is assumed to have three orthogonal planes of symmetry. The plastic behavior can
then be characterized by the stress-strain behavior in the three element coordinate directions
and the corresponding shear stress-shear strain behavior. Therefore,
 has the form:
By evaluating the yield criterion Equation 4.21 (p. 41) for all possible uniaxial stress conditions,
the individual terms of [M] can be identified:
(4.22)
where 
 and 
 = tensile and compressive yield strengths in direction  ( = 1 to 6).
Compressive yield stress is handled as a positive number here. For the shear yields,
 = 
 .
Letting 
 = 1 defines 
 to be:
41
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Rate-Independent Plasticity

The strength differential vector 
 has the form:
and from the uniaxial conditions,
 is defined as:
(4.23)
Assuming plastic incompressibility (no increase in material volume due to plastic straining) yields
the following relationships:
and
(4.24)
The off-diagonals are therefore:
Note that Equation 4.24 (p. 42) (via Equation 4.22 (p. 41) and Equation 4.23 (p. 42)) yields the
consistency equation:
that must be satisfied due to the requirement of plastic incompressibility. The uniaxial yield
strengths are therefore not completely independent.
The yield strengths must also define a closed yield surface (that is, elliptical in cross-section). An
elliptical yield surface is defined if the following criterion is met:
The criterion further restricts the independence of the uniaxial yield strengths. Because the yield
strengths change with plastic straining (a consequence of work hardening), this condition must
be satisfied throughout the loading history. The program checks the condition using an equivalent
plastic strain level of 20 percent (.20).
For an isotropic material,
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
42
Nonlinear Material Properties

and
and the yield criterion (Equation 4.21 (p. 41)) reduces to the von Mises yield criterion 
 .
Work hardening is used for the hardening rule so that the subsequent yield strengths increase
with increasing total plastic work done on the material. The increment in plastic work is:
where 
 = the average stress over the increment.
Figure 4.7: Plastic Work for a Uniaxial Case
For the uniaxial case, the total plastic work is simply:
(4.25)
where the terms are defined as shown in Figure 4.6: Yield Surface for Hill Yield Criterion (p. 41)
.
The bilinear stress-strain behavior is:
(4.26)
where:
 = plastic slope
 = elastic modulus
 = tangent modulus
Combining Equation 4.26 (p. 43) with Equation 4.25 (p. 43) and solving for the updated yield
stress  :
43
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Rate-Independent Plasticity

Extending this result to the anisotropic case gives:
(4.27)
where  refers to each of the input stress-strain curves.
Equation 4.27 (p. 44) determines the updated yield stresses by equating the amount of plastic
work done on the material to an equivalent amount of plastic work in each of the directions.
The parameters 
 and 
 can then be updated from their definitions (Equation 4.22 (p. 41)
and Equation 4.23 (p. 42)) and the new values of the yield stresses. For isotropic materials, this
hardening rule reduces to the case of isotropic hardening.
The equivalent plastic strain 
 (output as EPEQ) is determined using the tensile x direction as
the reference axis by substituting Equation 4.26 (p. 43) into Equation 4.25 (p. 43) :
where the yield stress in the tensile x direction 
 refers to the initial (not updated) yield stress.
The equivalent stress parameter (output as SEPL) is defined as:
where again 
 is the initial yield stress.
4.4.3. Isotropic Hardening
During plastic deformation, isotropic hardening causes a uniform increase in the size of the yield
surface and results in an increase in the yield stress. The yield criterion has the form:
where 
 is a scalar function of stress and 
 is the yield stress that evolves as a function of
the set of material internal variables  . This type of hardening can model the behavior of materials
under monotonic loading and elastic unloading, but often does not give good results for structures
that experience additional plastic deformation after a load reversal from a plastic state.
Three general classes of isotropic hardening models (p. 47) are available: bilinear, multilinear, and
nonlinear. Each of the hardening models assumes a von Mises yield criterion (p. 45) , unless an aniso-
tropic Hill yield criterion is defined, and includes an associated flow rule.
Isotropic hardening can also be combined with kinematic hardening (p. 54) and the Extended
Drucker-Prager (p. 64) and Gurson (p. 74) models to provide an evolution of the yield stress. For
more information, see Combining Material Models (p. 511) .
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
44
Nonlinear Material Properties


## 006 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt (lines 4892-4913 · enclosing doc section)

deviatoric plastic strain 
:
(4.74)
The effective deviatoric plastic strain 
 is defined by its rate change as follows:
(4.75)
where:
 = plastic strain tensor
 = rate change of variables
 = second order identity tensor
The unified and compacted yielding function for the cap model with three smooth surfaces is for-
mulated using above functions as follows:
(4.76)
where:
 = function of both 
 and 
Again, the parameter 
 is the intersection point of the compaction cap and the 
 axis. The para-
meter 
 is the state variable and can be implicitly described using 
 and 

## 007 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 60637-60836 · enclosing doc section)

Degrees of Freedom
UX, UY, UZ
Real Constants
C1: Not used.
C2: THKE -- Element thickness. Effective when KEYOPT(7) = 1.
C3: HGSTF -- Hourglass stiffness scaling factor. Any positive number is valid. Default = 1e-8. If set
to ≤ 0, the value resets to default. Effective when KEYOPT(2) = 2 or 3.
Material Properties
TB command: Gasket material (KEYOPT(2) = 0 or 1).
TBcommand: See Element Support for Material Models (p. 69) for this element with KEYOPT(2) =
2.
TB command: Linear elastic material (KEYOPT(2) = 2 or 3).
975
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

MP command: BETD, ALPX (or CTEX or THSX), DMPR, DMPS.
MP command: EX, EY, EZ, NUXY, NUYZ, NUXZ, GXY, GXZ, GYZ (KEYOPT(2) = 2 or 3).
Body Loads
Temperatures -- 
T(I), T(J), T(K), T(L), T(M), T(N), T(O), T(P).
Special Features
Linear perturbation
KEYOPT(2)
Element behavior:
0  -- 
Gasket option: through-the-thickness deformation only.
1 -- 
Gasket option: through-the-thickness and transverse-shear deformation (default).
2 -- 
Thin-solid option: through-the-thickness, in-plane membrane, and transverse-shear deformation.
3 -- 
Thin-solid option: through-the-thickness and transverse-shear deformation (zero in-plane strains:
).
KEYOPT(7)
Element thickness:
0  -- 
Distance between the element top and bottom surfaces (default).
1 -- 
Defined via a real constant.
KEYOPT(8)
Element component quantity output:
0  -- 
Output gasket quantities (GKD, GKS, GKI, and GKTH) (default). Valid for gasket options (KEYOPT(2)
= 0 or 1) only.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
976
Element Library

1 -- 
Output standard stresses and strains (including S, EPEL, and EPTH). Valid for gasket with through-
the-thickness and transverse-shear deformation (KEYOPT(2) = 1) or thin-solid options (KEYOPT(2)
= 2 or 3).
INTER195 Output Data
The solution output associated with the element is in two forms:
• Nodal items such as nodal displacements are included in the overall nodal solution.
• Element items such as stresses and closures are element outputs as shown in
Table 7.195.1: INTER195 Element Output Definitions (p. 977).
The output directions for element items are parallel to the local element coordinate system based on
the element midplane as illustrated in Figure 7.195.3: INTER195 Stress Output (p. 977). See Gasket Mater-
ial in the Mechanical APDL Theory Reference for details.
A general description of solution output is given in Solution Output (p. 49). See the Basic Analysis Guide
for ways to review results.
Figure 7.195.3: INTER195 Stress Output
P
M
O
K
N
I
J
L
x
z
y
Z
X
Y
The Element Output Definitions table uses the following notation:
A colon (:) in the Name column indicates that the item can be accessed by the Component Name
method (ESOL). The O column indicates the availability of the items in the file Jobname.out. The R
column indicates the availability of the items in the results file.
In either the O or R columns,“Y” indicates that the item is always available, a number refers to a table
footnote that describes when the item is conditionally available, and “-” indicates that the item is not
available.
Table 7.195.1: INTER195 Element Output Definitions
R
O
Definition
Name
Y
-
Element number
EL
Y
-
Node connectivity - I, J, K, L, M, N, O, P
NODES
Y
-
Material number
MAT
Y
-
Temperatures T(I), T(J), T(K), T(L), T(M), T(N), T(O), T(P)
TEMP
[a]
[a]
X - Normal stress (also gasket pressure)
GKS:X, (XY, XZ)
977
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

R
O
Definition
Name
XY, XZ - Transverse shear stress
[f]
[f]
X - Total closure
GKD:X, (XY, XZ)
XY, XZ - Relative transverse-shear deformation (
, where 
 is the
transverse-shear strain, and  is the gasket thickness)
[f]
[f]
Total inelastic closure
GKDI:X, (XY, XZ)
[f]
[f]
Thermal closure
GKTH:X, (XY, XZ)
[c],
[b]
[b]
Stresses
S:X, Y, Z, XY, XZ, YZ
[c],
[b]
-
Principal stresses
S:1, 2, 3
[c],
[b]
-
Stress intensity
S:INT
[c],
[b]
-
Equivalent stress
S:EQV
[c],
[b]
[b]
Elastic strains
EPEL:X, Y, Z, XY, XZ,
YZ
[c],
[b],
[d]
-
Equivalent elastic strain
EPEL:EQV
[c],
[b]
-
Thermal strains
EPTH:X, Y, Z, XY, XZ,
YZ
[c],
[b]
-
Equivalent thermal strain
EPTH:EQV
[e]
[e]
Plastic strains
EPPL:X, Y, Z, XY, XZ,
YZ
[e]
-
Equivalent plastic strain
EPPL:EQV
-
[e]
Total mechanical strains (EPEL + EPPL)
EPTO:X, Y, Z, XY, XZ,
YZ
[e]
-
Damage
GDMG
[e]
-
Plastic yield stress

## 008 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 27325-27358 · sibling doc section)

8.2.71. PLASTIC (BISO) and CDM (DUCTILE and EXPDMG) Example
Combining von Mises plasticity with bilinear isotropic hardening and ductile damage with exponential
damage evolution:
! isotropic linear elasticity
TB,ELASTIC,1,,,ISOT
TBDATA,1,70E3 ! Young’s modulus [MPa]
TBDATE,2,0.33 ! Poisson’s ratio [-]
! von Mises plasticity model with bilinear isotropic hardening
TB,PLASTIC,1,,,BISO
TBDATA,1,350  ! initial yield strength [MPa]
TBDATA,2,100  ! plastic tangent modulus [MPa]
! ductile damage criterion 
TB,CDM,1,,,DUCTILE
! stress triaxiality [-], damage initiation threshold [-]
TBPT,DEFI,0.00,1.00
TBPT,DEFI,0.11,0.61
TBPT,DEFI,0.22,0.37
TBPT,DEFI,0.33,0.22
TBPT,DEFI,0.44,0.14
TBPT,DEFI,0.56,0.08
TBPT,DEFI,0.67,0.05
TBPT,DEFI,0.78,0.03
TBPT,DEFI,0.89,0.02
TBPT,DEFI,1.00,0.01
! exponential damage evolution law
TB,CDM,1,,,EXPDMG
TBDATA,1,100 ! initial slope of damage function [1/mm]
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
556
Combining Material Models

For information about the PLASTIC (BISO) option, see Bilinear Isotropic Hardening (p. 47).
For information about the CDM (DUCTILE and EXPDMG) option, see Ductile Damage (p. 344).

## 009 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 26796-26813 · sibling doc section)

8.2.56. HYPER and PLASTIC (BISO) Example
Combining isotropic hyperelasticity and von Mises plasticity with isotropic bilinear hardening:
! material parameters
YoungsModulus=20E3
PoissonsRatio=0.2
BulkModulus=YoungsModulus/(3.0*(1.0-2.0*PoissonsRatio))
ShearModulus=YoungsModulus/(2.0*(1.0+PoissonsRatio))
YieldStress=1.5
PlasticTangentModulus=YoungsModulus/5000
! isotropic hyperelastic model (Neo-Hookean)
TB,HYPER,1,,,NEO
TBDATA,1,ShearModulus,2.0/BulkModulus
! von Mises plasticity with bilinear isotropic hardening
TB,PLASTIC,1,,,BISO
TBDATA,1,YieldStress,PlasticTangentModulus
For information about the finite-strain plasticity model, see Finite-Strain Plasticity (p. 151).
For information about the PLASTIC (BISO) option, see Bilinear Isotropic Hardening (p. 47).
For information about the HYPER option, see Hyperelasticity (p. 126).

## 010 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 27393-27415 · sibling doc section)

8.2.74. ISR and CHABOCHE and PLASTIC (MISO) Example
Combining von Mises plasticity with Chaboche nonlinear kinematic hardening, multilinear isotropic
hardening, and isotropic static recovery:
YOUNGS = 30e3   ! Young’s Modulus
NU     = 0.3    ! Poisson’s ratio
SIGMA0 = 18.0E0 ! Initial yield stress
557
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Material Model Combination Examples

MP,EX,1,YOUNGS
MP,PRXY,1,NU
TB,CHAB,1,1,1        ! Chaboche kinematic hardening
TBDATA,1, SIGMA0,
TBDATA,2,1e+3,30  
TB,PLASTIC,1,,,MISO  ! Multilinear isotropic hardening
TBPT,DEFI,0.0,SIGMA0
TBPT,DEFI,0.001,35.0
TBPT,DEFI,0.002,40.0
TBPT,DEFI,0.010,60.0
TB,PLASTIC,1,,4,ISR  ! Isotropic hardening static recovery
TBDATA,1,1D-5,1,2,SIGMA0
</rag-context>