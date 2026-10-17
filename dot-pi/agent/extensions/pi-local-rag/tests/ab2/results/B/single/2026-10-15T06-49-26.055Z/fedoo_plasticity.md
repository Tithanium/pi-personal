<rag-context>
[pi-local-rag] RAG subagent: 2 sources, 2677 ms retrieval.
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
</rag-context>