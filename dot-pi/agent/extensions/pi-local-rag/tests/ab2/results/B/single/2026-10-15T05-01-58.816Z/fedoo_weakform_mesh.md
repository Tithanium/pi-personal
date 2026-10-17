<rag-context>
[pi-local-rag] RAG subagent: 6 sources, 2429 ms retrieval.
## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium.py (lines 1-50 · chunk range (no structural region))

"""The Strain equilibrium weak form from the fedoo finite element code."""

import warnings

from fedoo.core.weakform import WeakFormBase
from fedoo.core.base import ConstitutiveLaw, InvalidKinematicStateError
from fedoo.core.time_evolution import SECOND_ORDER
from fedoo.lib_elements.element_base import _evaluate_monomials, _monomial_exponents
from fedoo.lib_elements.element_list import get_element
from fedoo.weakform.inertia import Inertia
from fedoo.util.voigt_tensors import StressTensorList, StrainTensorList
import numpy as np
import simcoon as sim
from simcoon import Rotation as SimRotation


class StressEquilibrium(WeakFormBase):
    """Mechanical equilibrium equation for solids.

    The main point to consider are:
      * This weak form can be used for solid in 3D or using a 2D plane
        assumption (plane strain or plane stress).
      * Include initial stress for non linear problems or if defined in
        the associated assembly.
      * This weak form accepts geometrical non linearities if simcoon is
        installed. (nlgeom should be in {True, 'UL', 'TL'}. In this case
        the initial displacement is also considered and several different
        corotational formulation may be used by setting the corate attribute.
      * For nearly incompressible material, a method to avoid the volumetric
        locking should be selected with the incompressibility attribute.
      * The consistent geometric stiffness is enabled automatically for
        finite-strain tangent conversion. Set ``geometric_stiffness``
        explicitly to override that default.

    Parameters
    ----------
    constitutivelaw: ConstitutiveLaw name (str) or ConstitutiveLaw object
        Material Constitutive Law (:mod:`fedoo.constitutivelaw`)
    incompressibility: str, optional
        Method used to avoid the volumetric locking of nearly incompressible
        materials. See the :py:attr:`incompressibility` attribute.
        By default (None), the standard displacement formulation is used.
    convert_tangent: bool, default=True
        Convert the constitutive corotational Kirchhoff tangent to the
        formulation tangent (``dS/dE`` for TL, spatial Lie for UL). Set to
        False only when the constitutive law already returns that final
        formulation-dependent tangent.
    name: str
        name of the WeakForm
    nlgeom: bool, 'UL' or 'TL', optional

## 004 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/weakform/stress_equilibrium.py (lines 1-50 · chunk range (no structural region))

"""The Strain equilibrium weak form from the fedoo finite element code."""

import warnings

from fedoo.core.weakform import WeakFormBase
from fedoo.core.base import ConstitutiveLaw, InvalidKinematicStateError
from fedoo.core.time_evolution import SECOND_ORDER
from fedoo.lib_elements.element_base import _evaluate_monomials, _monomial_exponents
from fedoo.lib_elements.element_list import get_element
from fedoo.weakform.inertia import Inertia
from fedoo.util.voigt_tensors import StressTensorList, StrainTensorList
import numpy as np
import simcoon as sim
from simcoon import Rotation as SimRotation


class StressEquilibrium(WeakFormBase):
    """Mechanical equilibrium equation for solids.

    The main point to consider are:
      * This weak form can be used for solid in 3D or using a 2D plane
        assumption (plane strain or plane stress).
      * Include initial stress for non linear problems or if defined in
        the associated assembly.
      * This weak form accepts geometrical non linearities if simcoon is
        installed. (nlgeom should be in {True, 'UL', 'TL'}. In this case
        the initial displacement is also considered and several different
        corotational formulation may be used by setting the corate attribute.
      * For nearly incompressible material, a method to avoid the volumetric
        locking should be selected with the incompressibility attribute.
      * The consistent geometric stiffness is enabled automatically for
        finite-strain tangent conversion. Set ``geometric_stiffness``
        explicitly to override that default.

    Parameters
    ----------
    constitutivelaw: ConstitutiveLaw name (str) or ConstitutiveLaw object
        Material Constitutive Law (:mod:`fedoo.constitutivelaw`)
    incompressibility: str, optional
        Method used to avoid the volumetric locking of nearly incompressible
        materials. See the :py:attr:`incompressibility` attribute.
        By default (None), the standard displacement formulation is used.
    convert_tangent: bool, default=True
        Convert the constitutive corotational Kirchhoff tangent to the
        formulation tangent (``dS/dE`` for TL, spatial Lie for UL). Set to
        False only when the constitutive law already returns that final
        formulation-dependent tangent.
    name: str
        name of the WeakForm
    nlgeom: bool, 'UL' or 'TL', optional

## 005 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/weakform/stress_equilibrium_mixed.py (lines 1-48 · chunk range (no structural region))

"""Mixed Stress Equilibrium weak form."""

from fedoo.weakform.stress_equilibrium import (
    StressEquilibrium,
    _check_F_validity,
    _comp_grad_disp,
)
import numpy as np


class StressEquilibriumMixed(StressEquilibrium):
    """
    Mixed displacement/pressure weak formulation for solid mechanics.

    This weak formulation is suitable for nearly incompressible materials.
    It introduces a pressure variable to treat the volumetric behavior
    separately from the deviatoric behavior, avoiding volumetric locking.

    The element formulation should satisfy the LBB condition (e.g. Q2-Q1 or
    P1+/P1).

    Parameters
    ----------
    constitutivelaw: ConstitutiveLaw
        Material constitutive law.
    name: str, optional
        Name of the weak form.
    nlgeom: bool, optional
        Non-linear geometry flag.
    bulk_modulus: float, optional
        Bulk modulus used for scaling the pressure equation. If None, it
        is estimated from the tangent matrix trace.
        Note: This is used for scaling the pressure constraint equation.
    convert_tangent: bool, default=True
        Convert the constitutive corotational Kirchhoff tangent to the
        formulation tangent.
    space: ModelingSpace, optional
        Modeling space.

    Attributes
    ----------
    symmetrized_matrix : bool
        Only used when nlgeom is False.
        If True, the deviatoric tangent is computed using the symmetric
        projection (P:H:P) to ensure a symmetric displacement stiffness block.
        If False, a single projection (P:H) is used. Default is True.
    """


## 008 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium_mixed.py (lines 1-48 · chunk range (no structural region))

"""Mixed Stress Equilibrium weak form."""

from fedoo.weakform.stress_equilibrium import (
    StressEquilibrium,
    _check_F_validity,
    _comp_grad_disp,
)
import numpy as np


class StressEquilibriumMixed(StressEquilibrium):
    """
    Mixed displacement/pressure weak formulation for solid mechanics.

    This weak formulation is suitable for nearly incompressible materials.
    It introduces a pressure variable to treat the volumetric behavior
    separately from the deviatoric behavior, avoiding volumetric locking.

    The element formulation should satisfy the LBB condition (e.g. Q2-Q1 or
    P1+/P1).

    Parameters
    ----------
    constitutivelaw: ConstitutiveLaw
        Material constitutive law.
    name: str, optional
        Name of the weak form.
    nlgeom: bool, optional
        Non-linear geometry flag.
    bulk_modulus: float, optional
        Bulk modulus used for scaling the pressure equation. If None, it
        is estimated from the tangent matrix trace.
        Note: This is used for scaling the pressure constraint equation.
    convert_tangent: bool, default=True
        Convert the constitutive corotational Kirchhoff tangent to the
        formulation tangent.
    space: ModelingSpace, optional
        Modeling space.

    Attributes
    ----------
    symmetrized_matrix : bool
        Only used when nlgeom is False.
        If True, the deviatoric tangent is computed using the symmetric
        projection (P:H:P) to ensure a symmetric displacement stiffness block.
        If False, a single projection (P:H) is used. Default is True.
    """


## 009 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Exemples_fedoo/03-advanced/incompressibility_comparison.py (lines 1-49 · chunk range (no structural region))

"""
Nearly incompressible plasticity: four element formulations
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Nearly incompressible materials are difficult for low-order displacement
elements.  A fully integrated ``quad4`` element constrains the volume change at
four Gauss points although its displacement field cannot satisfy all these
constraints independently.  The resulting **volumetric locking** makes a
coarse mesh much too stiff.

This example compares four formulations available in Fedoo:

* the standard fully integrated displacement formulation;
* ``mean_dilatation``, a B-bar projection of the volumetric strain;
* ``fbar``, the finite-strain counterpart based on an element-average volume
  change;
* :class:`fedoo.weakform.StressEquilibriumRI`, one-point integration with
  hourglass stabilization.

The benchmark is Cook's membrane: a tapered panel clamped on the left and
loaded in shear on the right.  Its nonuniform bending and shear field makes
locking visible even on a small mesh.  Plane strain and :math:`\nu=0.499` make
the response nearly incompressible, while a J2 law adds plastic flow.  The
Python :class:`fedoo.constitutivelaw.ElastoPlasticity` law is used here for
clarity; production models can use the equivalent optimized Simcoon law.

The three locking treatments should give similar load-displacement curves.
The untreated formulation is expected to be noticeably stiffer.  Reduced
integration is inexpensive, but its answer also contains the artificial
hourglass stabilization energy.  Mean dilatation retains a symmetric tangent,
whereas the consistent F-bar tangent is generally nonsymmetric.
"""

from time import perf_counter
from pathlib import Path
from tempfile import TemporaryDirectory

import matplotlib.pyplot as plt
import numpy as np
import pyvista as pv

import fedoo as fd


# -----------------------------------------------------------------------------
# Geometry and material parameters
# -----------------------------------------------------------------------------
fd.ModelingSpace("2Dplane")


## 010 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/examples/03-advanced/incompressibility_comparison.py (lines 1-49 · chunk range (no structural region))

"""
Nearly incompressible plasticity: four element formulations
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Nearly incompressible materials are difficult for low-order displacement
elements.  A fully integrated ``quad4`` element constrains the volume change at
four Gauss points although its displacement field cannot satisfy all these
constraints independently.  The resulting **volumetric locking** makes a
coarse mesh much too stiff.

This example compares four formulations available in Fedoo:

* the standard fully integrated displacement formulation;
* ``mean_dilatation``, a B-bar projection of the volumetric strain;
* ``fbar``, the finite-strain counterpart based on an element-average volume
  change;
* :class:`fedoo.weakform.StressEquilibriumRI`, one-point integration with
  hourglass stabilization.

The benchmark is Cook's membrane: a tapered panel clamped on the left and
loaded in shear on the right.  Its nonuniform bending and shear field makes
locking visible even on a small mesh.  Plane strain and :math:`\nu=0.499` make
the response nearly incompressible, while a J2 law adds plastic flow.  The
Python :class:`fedoo.constitutivelaw.ElastoPlasticity` law is used here for
clarity; production models can use the equivalent optimized Simcoon law.

The three locking treatments should give similar load-displacement curves.
The untreated formulation is expected to be noticeably stiffer.  Reduced
integration is inexpensive, but its answer also contains the artificial
hourglass stabilization energy.  Mean dilatation retains a symmetric tangent,
whereas the consistent F-bar tangent is generally nonsymmetric.
"""

from time import perf_counter
from pathlib import Path
from tempfile import TemporaryDirectory

import matplotlib.pyplot as plt
import numpy as np
import pyvista as pv

import fedoo as fd


# -----------------------------------------------------------------------------
# Geometry and material parameters
# -----------------------------------------------------------------------------
fd.ModelingSpace("2Dplane")
</rag-context>