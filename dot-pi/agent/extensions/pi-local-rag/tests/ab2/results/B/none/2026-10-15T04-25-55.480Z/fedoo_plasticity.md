<rag-context>
[pi-local-rag] RAG subagent: 8 sources, 316 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 24715-24914 · enclosing doc section)

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

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/constitutivelaw/elasto_plasticity.py (lines 1-43 · chunk range (no structural region))

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


## 004 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt (lines 4892-4913 · enclosing doc section)

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

## 005 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 3234-3275 · enclosing doc section)

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

## 006 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 24565-24764 · enclosing doc section)

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