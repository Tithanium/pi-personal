<rag-context>
[pi-local-rag] RAG subagent: 2 sources, 1903 ms retrieval.
## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt (lines 4422-4446 · enclosing doc section)

4.2.8. Bilinear Isotropic Hardening
These options use the von Mises yield criterion with the associated flow rule and isotropic (work)
hardening (accessed via TB,PLASTIC,,,,BISO).
The equivalent stress Equation 4.4 (p. 67) is:
(4.27)
where {s} is the deviatoric stress Equation 4.37 (p. 76). When 
 is equal to the current yield stress
 the material is assumed to yield. The yield criterion is:
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
74
Structures with Material Nonlinearities

(4.28)
For work hardening,
 is a function of the amount of plastic work done. For the case of isotropic
plasticity assumed here,
 can be determined directly from the equivalent plastic strain 
 of
Equation 4.43 (p. 77) (output as EPEQ) and the uniaxial stress-strain curve as depicted in Figure 4.4: Uni-
axial Behavior (p. 75).
 is output as the equivalent stress parameter (output as SEPL).
Figure 4.4: Uniaxial Behavior
For 
 Determination

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
</rag-context>