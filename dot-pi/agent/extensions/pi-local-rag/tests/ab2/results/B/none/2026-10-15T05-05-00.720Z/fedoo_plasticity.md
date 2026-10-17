<rag-context>
[pi-local-rag] RAG subagent: 8 sources, 299 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 24365-24964 · enclosing doc section)

Example: Partial Solve Options for Prony Series Models
*create,sdec-1.exp
1.00E-05 2992.50
0.01 2992.49
1 2991.16
2 2989.83
4 2987.20
6 2984.62
8 2982.09
10 2979.60
20 2967.80
40 2947.16
60 2929.90
80 2915.47
100 2903.41
200 2867.03
400 2846.11
600 2842.62
800 2842.04
1000 2841.94
2000 2841.92
4000 2841.92
6000 2841.92
8000 2841.92
10000 2841.92
20000 2841.92
40000 2841.92
60000 2841.92
80000 2841.92
100000 2841.92
200000 2841.92
400000 2841.92
600000 2841.92
800000 2841.92
1000000 2841.92
*end
*create,bdec-1.exp
1.00E-05 6485.69
0.01 6485.66
1 6482.79
2 6479.92
4 6474.24
6 6468.67
8 6463.20
10 6457.82
20 6432.32
40 6387.68
60 6350.34
80 6319.10
100 6292.98
200 6214.06
400 6168.52
600 6160.88
800 6159.60
1000 6159.38
2000 6159.34
4000 6159.34
6000 6159.34
8000 6159.34
10000 6159.34
20000 6159.34
40000 6159.34
60000 6159.34
80000 6159.34
100000 6159.34
200000 6159.34
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
508
Material Curve-Fitting

400000 6159.34
600000 6159.34
800000 6159.34
1000000 6159.34
*end
/prep7
TB,ELAS,1
TBDAT,,7782.834,0.3
TB,PRON, 1, 1, 1,SHEA
TBDATA,1,8.031872e-02,5.116459e+01
TB,PRON, 1, 1, 1,BULK
TBDATA,1,8.031872e-02,5.116459e+01
TBLIS,ALL,ALL
/prep7
! Define Relaxation Modulus Vs Time Data
tbft,eadd,1,sdec,sdec-1.exp
! Define Relaxation Modulus Vs Time Data
tbft,eadd,1,bdec,bdec-1.exp
! Define Material
tbft,fadd,1,aml,genr,prexample
tbft,set,1,aml,genr,prexample,5,7782.834
tbft,set,1,aml,genr,prexample,6,0.3
tbft,set,1,aml,genr,prexample,1, 1
tbft,set,1,aml,genr,prexample,2, 100
tbft,set,1,aml,genr,prexample,3, 1
tbft,set,1,aml,genr,prexample,4, 100
tbft,fix,1,aml,genr,prexample, 5, 1
tbft,fix,1,aml,genr,prexample, 6, 1
tbft,set,1,aml,genr,prexample,comp,pshear
tbft,solve,1,aml,genr,prexample,1,50
/out
/gopr
tbft,list,1
tbft,set,1,aml,genr,prexample,comp,pbulk
tbft,solve,1,aml,genr,prexample,1,50
/out
/gopr
tbft,list,1
tbft,set,1,aml,genr,prexample,comp,defa
tbft,solve,1,aml,genr,prexample,1,50
tbft,list,1
tbft,fset,1,aml,genr,prexample
tblis,all,all
fini
/exit
509
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Example Curve-Fitting Problems

Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
510

Chapter 8: Combining Material Models
You can combine some material models to simulate various material behaviors. The following topics
about combining material models are available:
8.1.Valid Material Model Combinations
8.2. Material Model Combination Examples
8.1.Valid Material Model Combinations
The following table presents the material models that you can combine along with the associated TB
command labels. If a material model does not appear in the table, it cannot be combined with another
material model unless specifically noted elsewhere.
Link to Example
Command, Label
Combination
Type
With ...
Model
PLASTIC (BISO) and
CHABOCHE
Example (p. 522)
TB,PLASTIC,,,,BISO +
TB,CHABOCHE
Bilinear
Combined
Hardening
Plasticity
PLASTIC (MISO) and
CHABOCHE
Example (p. 523)
TB, PLASTIC,,,,MISO +
TB,CHABOCHE
Multilinear
Combined
Hardening
Plasticity
NLISO and
CHABOCHE
Example (p. 523)
TB,NLISO +
TB,CHABOCHE
Nonlinear
Combined
Hardening
Plasticity
PLASTIC (MISO) and
EDP Example (p. 523)
TB,PLASTIC,,,,MISO +
TB,EDP
Multilinear
Combined
Hardening
Plasticity
PLASTIC (BISO) and
RATE Example (p. 526)
TB,PLASTIC,,,,BISO +
TB,RATE
Bilinear
Isotropic
Hardening
Viscoplasticity
ISR and CHABOCHE
and PLASTIC (BISO)
Example (p. 557)
TB,PLASTIC,,,,BISO +
TB,CHABOCHE
+TB,PLASTIC,,,,ISR
Bilinear
Isotropic
Hardening
Viscoplasticity
ISR and CHABOCHE
and PLASTIC (BISO)
TB,PLASTIC,,,,BISO +
TB,CHABOCHE
Bilinear
Isotropic
Hardening
Viscoplasticity
and CREEP
Example (p. 557)
+TB,PLASTIC,,,,ISR +
TB,CREEP
PLASTIC (MISO) and
RATE Example (p. 526)
TB,PLASTIC,,,,MISO +
TB,RATE
Multilinear
Isotropic
Hardening
Viscoplasticity
ISR and CHABOCHE
and PLASTIC (MISO)
Example (p. 557)
TB,PLASTIC,,,,MISO +
TB,CHABOCHE
+TB,PLASTIC,,,,ISR
Multilinear
Isotropic
Hardening
Viscoplasticity
511
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

Link to Example
Command, Label
Combination
Type
With ...
Model
ISR and CHABOCHE
and PLASTIC (MISO)
TB,PLASTIC,,,,MISO +
TB,CHABOCHE
Multilinear
Isotropic
Hardening
Viscoplasticity
and CREEP
Example (p. 558)
+TB,PLASTIC,,,,ISR +
TB,CREEP
ISR and CHABOCHE
and NLISO
Example (p. 558)
TB,NLISO +
TB,CHABOCHE + TB,
PLASTIC,,,,ISR
Nonlinear
Isotropic
Hardening
Viscoplasticity
ISR and CHABOCHE
and NLISO and CREEP
Example (p. 559)
TB,NLISO +
TB,CHABOCHE + TB,
PLASTIC,,,,ISR +
TB,CREEP
Nonlinear
Isotropic
Hardening
Viscoplasticity
NLISO and RATE
Example (p. 527)
TB,NLISO + TB,RATE
Nonlinear
Isotropic
Hardening
Viscoplasticity
CHABOCHE and RATE
and PLASTIC (BISO)
Example (p. 520)
TB,CHABOCHE +
TB,RATE +
TB,PLASTIC,,,,BISO
Nonlinear
Combined
Hardening
Viscoplasticity
CHABOCHE and RATE
and PLASTIC
Example (p. 521)
TB,CHABOCHE +
TB,RATE +
TB,PLASTIC
Nonlinear
Combined
Hardening
Viscoplasticity
CHABOCHE and RATE
and PLASTIC and
KSR2 Example  (p. 521)
TB,CHABOCHE +
TB,RATE +
TB,PLASTIC +
TB,PLASTIC,,,,KSR2
Nonlinear
Combined
Hardening
Viscoplasticity
CHABOCHE and
CREEP and RATE and
TB,CHABOCHE +
TB,CREEP + TB,RATE
+ TB,PLASTIC
Nonlinear
Combined
Hardening
Viscoplasticity
PLASTIC
Example (p. 544)
CHABOCHE and
CREEP and RATE and
TB,CHABOCHE +
TB,CREEP + TB,RATE
Nonlinear
Combined
Hardening
Viscoplasticity
PLASTIC and KSR2
Example  (p. 545)
+ TB,PLASTIC +
TB,PLASTIC,,,,KSR2
CHABOCHE and RATE
and NLISO
Example (p. 522)
TB,CHABOCHE+
TB,RATE+TB,NLISO
Nonlinear
Combined
Hardening
Viscoplasticity
GURSON and PLASTIC
(BISO)
Example (p. 524)
TB,GURS +
TB,PLASTIC,,,,BISO
Bilinear
Isotropic
Hardening
Gurson Plasticity
GURSON and PLASTIC
(MISO)
Example (p. 524)
TB,GURS +
TB,PLASTIC,,, MISO
Multilinear
Isotropic
Hardening
Gurson Plasticity
GURSON and NLISO
Example (p. 525)
TB,GURS + TB,NLISO
Nonlinear
Isotropic
Hardening
Gurson Plasticity
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
512
Combining Material Models

Link to Example
Command, Label
Combination
Type
With ...
Model
GURSON and
CHABOCHE
Example (p. 525)
TB,GURS +
TB,CHABOCHE
Nonlinear
Isotropic
Hardening
Gurson Plasticity
GURSON and
CHABOCHE and
TB,GURS +
TB,CHABOCHE +
Nonlinear
Isotropic
Hardening
Gurson Plasticity
PLASTIC (BISO)
Example (p. 526)
TB,PLASTIC,,,,BISO or
TB, NLISO or
TB,PLASTIC,,,,MISO
PLASTIC (BISO) and
CREEP
Example (p. 527)
TB,PLASTIC,,,,BISO +
TB,CREEP
Bilinear
Isotropic
Hardening
Plasticity and Creep
(Implicit)
PLASTIC (MISO) and
CREEP
Example (p. 528)
TB,PLASTIC,,,,MISO +
TB,CREEP
Multilinear
Isotropic
Hardening
Plasticity and Creep
(Implicit)
NLISO and CREEP
Example (p. 529)
TB,NLISO + TB,CREEP
Nonlinear
Isotropic
Hardening
Plasticity and Creep
(Implicit)
PLASTIC (BKIN) and
CREEP
Example (p. 529)
TB,PLASTIC,,,,BKIN +
TB,CREEP
Bilinear
Kinematic
Hardening
Plasticity and Creep
(Implicit)
CHABOCHE and
CREEP
Example (p. 542)
TB,CHABOCHE +
TB,CREEP
Nonlinear
Kinematic
Hardening
Plasticity and Creep
(Implicit)
CHABOCHE and
PLASTIC and CREEP
Example (p. 529)
TB,CHABOCHE +
TB,PLASTIC,,,,KSR2 +
TB,CREEP
Nonlinear
Kinematic
Hardening
Plasticity and Creep
(Implicit)
PLASTIC (BISO) and
CREEP
Example (p. 527)
TB,PLASTIC,,,,BISO +
TB,CREEP
Bilinear
Isotropic
Hardening
Plasticity and Creep
(Explicit)
PLASTIC (MISO) and
CREEP
Example (p. 528)
TB,PLASTIC,,,,MISO +
TB,CREEP
Multilinear
Isotropic
Hardening
Plasticity and Creep
(Explicit)
PLASTIC (BKIN) and
CREEP
Example (p. 529)
TB,PLASTIC,,,,BKIN +
TB,CREEP
Bilinear
Kinematic
Hardening
Plasticity and Creep
(Explicit)
PLASTIC (KINH) and
CREEP
Example (p. 528)
TB,PLASTIC,,,,KINH +
TB,CREEP
Multilinear
Kinematic
Hardening
Plasticity and Creep
(Explicit)
CHABOCHE and
CREEP
Example (p. 542)
TB,CHABOCHE +
TB,CREEP
Nonlinear
Kinematic
Hardening
Plasticity and Creep
(Explicit)
HILL and PLASTIC
(BISO)
Example (p. 530)
TB,HILL +
TB,PLASTIC,,,,BISO
Bilinear
Isotropic
Hardening
Anisotropic Plasticity
513
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Valid Material Model Combinations

Link to Example
Command, Label
Combination
Type
With ...
Model
HILL and PLASTIC
(MISO)
Example (p. 530)
TB,HILL +
TBPLAS,,,,MISO
Multilinear
Isotropic
Hardening
Anisotropic Plasticity
HILL and NLISO
Example (p. 531)
TB,HILL + TB,NLISO
Nonlinear
Isotropic
Hardening
Anisotropic Plasticity
HILL and PLASTIC
(BKIN)
Example (p. 531)
TB,HILL +
TB,PLASTIC,,,,BKIN
Bilinear
Kinematic
Hardening
Anisotropic Plasticity
HILL and CHABOCHE
Example (p. 531)
TB,HILL +
TB,CHABOCHE
Chaboche
Kinematic
Hardening
Anisotropic Plasticity
HILL and PLASTIC
(BISO) and
TB,HILL +
TB,PLASTIC,,,,BISO +
TB,CHABOCHE
Bilinear
Isotropic
and
Chaboche
Combined
Hardening
Anisotropic Plasticity
CHABOCHE
Example (p. 531)
HILL and PLASTIC
(MISO) and
TB,HILL +
TB,PLASTIC,,,,MISO +
TB,CHABOCHE
Multilinear
Isotropic
and
Chaboche
Combined
Hardening
Anisotropic Plasticity
CHABOCHE
Example (p. 532)
HILL and NLISO and
CHABOCHE
Example (p. 532)
TB,HILL + TB,NLISO +
TB,CHABOCHE
Nonlinear
Isotropic
and
Chaboche
Combined
Hardening
Anisotropic Plasticity
HILL and RATE and
PLASTIC (BISO)
Example (p. 533)
TB,HILL + TB,RATE +

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt (lines 4460-4484 · enclosing doc section)

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

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 2783-2896 · enclosing doc section)

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


## 004 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/constitutivelaw/elasto_plasticity.py (lines 1-43 · chunk range (no structural region))

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


## 005 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt (lines 4892-4913 · enclosing doc section)

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

## 006 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 3234-3275 · enclosing doc section)

The yield criterion has the form:
where 
 is a scalar function of the relative stress  and 
 is the yield stress. The relative stress
is:
(4.30)
where the backstress  is the shift in the position of the yield surface in stress space and evolves
during plastic deformation.
The general classes of kinematic hardening models (p. 55) are bilinear, multilinear, and nonlinear.
The hardening models assume a von Mises yield criterion (p. 45) , unless an anisotropic Hill yield
criterion is defined, and includes an associated flow rule.
Kinematic hardening can also be combined with isotropic hardening (p. 44) and the Gurson (p. 74)
model to provide an evolution of the yield stress. For more information, see Combining Material
Models (p. 511). For an example problem demonstrating the use of kinematic hardening models, see
Nuclear Piping System Under Seismic Loading in the Technology Showcase: Example Problems.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
54
Nonlinear Material Properties

The following topics concerning the kinematic hardening material model are available:
4.4.4.1.Yield Criteria and Plastic Potentials
4.4.4.2. General Kinematic Hardening Classes
4.4.4.3. Kinematic Hardening Static Recovery
4.4.4.1.Yield Criteria and Plastic Potentials
Kinematic hardening uses the von Mises yield criterion with an associated flow rule unless a Hill
yield surface is defined. If a Hill yield surface is defined, the kinematic hardening model uses it for
both the yield criterion and as the plastic potential to give an associated flow rule.
For more information about von Mises and Hill yield surfaces, see Yield Criteria and Plastic Poten-
tials (p. 45) .
4.4.4.2. General Kinematic Hardening Classes
Support is available for these general classes of kinematic hardening:
4.4.4.2.1. Bilinear Kinematic Hardening
4.4.4.2.2. Multilinear Kinematic Hardening
4.4.4.2.3. Nonlinear Kinematic Hardening
4.4.4.2.1. Bilinear Kinematic Hardening
The backstress tensor for bilinear kinematic hardening evolves so that the effective stress versus
effective strain curve is bilinear. The initial slope of the curve is the elastic modulus of the mater-
ial and beyond the user-specified initial yield stress 
 , plastic strain develops and the backstress
evolves so that stress versus total strain continues along a line with slope equal to the tangent
modulus 

## 007 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/constitutivelaw/elasto_plasticity.py (lines 1-43 · chunk range (no structural region))

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


## 008 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt (lines 4178-4296 · enclosing doc section)

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
</rag-context>