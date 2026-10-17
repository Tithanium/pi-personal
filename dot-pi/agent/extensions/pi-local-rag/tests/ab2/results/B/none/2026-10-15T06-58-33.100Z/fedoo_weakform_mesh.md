<rag-context>
[pi-local-rag] RAG subagent: 11 sources, 204 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium.py (lines 1-50 · chunk range (no structural region))

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

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/weakform/stress_equilibrium.py (lines 1-50 · chunk range (no structural region))

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

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/weakform/stress_equilibrium_mixed.py (lines 1-48 · chunk range (no structural region))

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


## 004 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/spring.py (lines 1-192 · whole file (short script))

from fedoo.core.base import ConstitutiveLaw
from fedoo.constitutivelaw.beam import BeamProperties
from fedoo.core.weakform import WeakFormBase
from scipy.spatial.transform import Rotation
import numpy as np


class SpringEquilibrium(WeakFormBase):
    """
    Weak formulation of the mechanical equilibrium equation for spring models.

    This weak formulation allow to use a simple linear axial spring element
    with geometrical non linearities (using the updated lagrangian approach).

    To ensure numerical stability, a small tangential stiffness is
    automatically added. This rigidity can be controled by setting the
    Kt_factor attribute. For instance set Kt_factor=0 to remove any tangential
    stiffness.

    An alternative to the SpringEquilibrium is the InterfaceForce weakform.
    InterfaceForce weakform allows to use springs with complexe behavior
    and non axial rigidity, but InterfaceForce is restricted to geometrical
    linear analyses.

    Parameters
    ----------
    K: float, numpy array
        Spring axial rigidity
        If numpy array, len(K) should be the number of elements in the
        corresponding mesh.
    nlgeom: bool, 'UL', default = False
        if True or 'UL', activate the geometrical non linearities
    name: str
        name of the WeakForm

    Example
    -------
    Springs in series submitted to an extension and a 45° rotation.

    >>> import fedoo as fd
    >>> fd.ModelingSpace("2Dplane")
    >>> mesh = fd.mesh.line_mesh(n_nodes=11,x_min=0, x_max=10, ndim=2)
    >>> mesh.elm_type = 'spring'
    >>> wf = fd.weakform.SpringEquilibrium(1000,nlgeom=False)
    >>> assemb = fd.Assembly.create(wf, mesh)
    >>> pb = fd.problem.NonLinear(assemb)
    >>> pb.bc.add('Dirichlet', [0], 'Disp', 0)
    >>> pb.bc.add('Neumann', [10], 'Disp', [5,5])
    >>> pb.nlsolve()
    >>> res = pb.get_results(assemb, ['Disp', 'Fint'])
    >>> res.plot('Fint', show_nodes=True)
    """

    def __init__(
        self,
        K,
        name="",
        nlgeom=None,
        space=None,
    ):
        WeakFormBase.__init__(self, name)

        self.space.new_variable("DispX")
        self.space.new_variable("DispY")
        if self.space.ndim == 3:
            self.space.new_variable("DispZ")
            self.space.new_vector("Disp", ("DispX", "DispY", "DispZ"))
        else:  # 2D assumed
            self.space.new_vector("Disp", ("DispX", "DispY"))

        self.K = K
        self.Kt_factor = None

        self.assembly_options.set("elm_type", "spring", elm_type="lin2")

        self.nlgeom = nlgeom
        """Method used to treat the geometric non linearities.
            * Set to False if geometric non linarities are ignored (default).
            * Set to True or 'UL' to use the updated lagrangian method
              (update the mesh)
            * Set to 'TL' to use the total lagrangian method
              (base on the initial mesh with initial displacement effet)
        """

        self.assembly_options["assume_sym"] = False

    def initialize(self, assembly, pb):
        # initialize nlgeom value in assembly._nlgeom
        self._initialize_nlgeom(assembly, pb)
        self.nlgeom = assembly._nlgeom

        assembly.sv["Stretch"] = assembly.sv["Fint"] = 0

        initial_length = np.linalg.norm(
            assembly.mesh.nodes[assembly.mesh.elements[:, 1]]
            - assembly.mesh.nodes[assembly.mesh.elements[:, 0]],
            axis=1,
        )
        assembly.sv["_InitialLength"] = initial_length

    def update(self, assembly, pb):
        # function called when the problem is updated
        # (NR loop or time increment)
        # Nlgeom implemented only for updated lagragian formulation
        if self.nlgeom == "UL":
            # if updated lagragian method
            # -> update the mesh and recompute elementary op
            assembly.set_disp(pb.get_disp())

        dof = pb.get_dof_solution()  # displacement and rotation node values
        if np.array_equal(dof, 0):
            assembly.sv["Stretch"] = assembly.sv["Fint"] = 0
        else:
            # evaluate Strain
            if self.nlgeom:
                # Compute Beam Strain
                mesh = assembly.current.mesh  # deformed mesh

                if "_InitialLength" in assembly.sv:
                    initial_length = assembly.sv["_InitialLength"]
                else:
                    # should ne need to recompute initial_length as it is done in
                    # initialize
                    initial_length = np.linalg.norm(
                        assembly.mesh.nodes[mesh.elements[:, 1]]
                        - assembly.mesh.nodes[mesh.elements[:, 0]],
                        axis=1,
                    )
                    assembly.sv["_InitialLength"] = initial_length

                # coordinates of vector between node 1 and 2 for each element
                element_vectors = (
                    mesh.nodes[mesh.elements[:, 1]] - mesh.nodes[mesh.elements[:, 0]]
                )

                # longitunal displacement in local coordinates
                spring_stretch = (
                    np.linalg.norm(element_vectors, axis=1) - initial_length
                )
                assembly.sv["Stretch"] = spring_stretch

            else:
                op_delta = assembly.space.op_disp()[
                    0
                ]  # relative displacement = disp if used with spring element
                delta = assembly.get_gp_results(op_delta, dof)
                assembly.sv["Stretch"] = delta

            # Compute spring force
            assembly.sv["Fint"] = assembly.sv["Stretch"] * self.K

    def to_start(self, assembly, pb):
        if self.nlgeom == "UL":
            # if updated lagragian method
            # -> reset the mesh to the begining of the increment
            assembly.set_disp(pb.get_disp())

    def get_weak_equation(self, assembly, pb):
        dim = self.space.ndim
        # K = [self.K, Kt, Kt]

        op_delta = (
            self.space.op_disp()
        )  # relative displacement when used with spring element

        # Linear tangeant stiffness
        diff_op = op_delta[0].virtual * op_delta[0] * self.K

        # Add small tangential rigidity to avoid instability
        # Important even with nlgeom for low values of Fint
        if self.Kt_factor is None:
            Kt = 0.0001 * self.K
        elif self.Kt_factor == 0:
            Kt = 0
        else:
            Kt = self.Kt_factor * self.K

        Fint = assembly.sv["Fint"]
        if assembly._nlgeom:
            # Geometrical stiffness (or stress stiffness)
            # L0 = assembly.sv["_InitialLength"] + assembly.sv["Stretch"]
            L0 = assembly.sv["_InitialLength"]
            Kt += Fint / L0

        if not (np.array_equal(Kt, 0)):
            diff_op = diff_op + sum(
                [op_delta[i].virtual * op_delta[i] * Kt for i in range(1, dim)]
            )
        # Initial stress vector
        diff_op = diff_op + op_delta[0].virtual * Fint
        return diff_op


## 005 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium_mixed.py (lines 1-48 · chunk range (no structural region))

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


## 006 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Exemples_fedoo/03-advanced/incompressibility_comparison.py (lines 1-49 · chunk range (no structural region))

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


## 007 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/examples/03-advanced/incompressibility_comparison.py (lines 1-49 · chunk range (no structural region))

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


## 008 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/examples/03-advanced/incompressibility_comparison.py (lines 1-49 · chunk range (no structural region))

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


## 009 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium.py (lines 985-1019 · sibling function/class)

def _comp_grad_disp(assembly, displacement):
    grad_values = assembly.get_grad_disp(displacement, "GaussPoint")
    if assembly.space.is_axisymmetric:
        mesh = assembly.current.mesh
        # Refresh r_current at gauss points: used by the symbolic
        # operator eps[2] = DispX / r in get_weak_equation and by the
        # 2*pi*r weak-form integration weight, both at the current config.
        assembly.sv["_R_gausspoints"] = mesh.convert_data(
            mesh.nodes[:, 0],
            "Node",
            "GaussPoint",
            n_elm_gp=assembly.n_elm_gp,
        )

        # F_theta-theta = r_current / R_reference, hence
        # grad_values[2][2] = u_r / R_reference. See the
        # "Theory of axisymmetric kinematics" section of
        # :class:`fedoo.core.mechanical3d.Mechanical3D` for the derivation.
        R0 = assembly.sv["_R0_gausspoints"]
        rank_dispx = assembly.space.variable_rank("DispX")
        n = mesh.n_nodes
        grad_values[2][2] = np.divide(
            mesh.convert_data(
                displacement[rank_dispx * n : (rank_dispx + 1) * n],
                "Node",
                "GaussPoint",
                n_elm_gp=assembly.n_elm_gp,
            ),
            R0,
            out=np.zeros_like(R0),
            where=R0 != 0,
        )  # zero at the symmetry axis (R0 == 0)
    assembly.sv["DispGradient"] = grad_values
    return grad_values


## 010 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/weakform/stress_equilibrium.py (lines 950-984 · sibling function/class)

def _comp_grad_disp(assembly, displacement):
    grad_values = assembly.get_grad_disp(displacement, "GaussPoint")
    if assembly.space.is_axisymmetric:
        mesh = assembly.current.mesh
        # Refresh r_current at gauss points: used by the symbolic
        # operator eps[2] = DispX / r in get_weak_equation and by the
        # 2*pi*r weak-form integration weight, both at the current config.
        assembly.sv["_R_gausspoints"] = mesh.convert_data(
            mesh.nodes[:, 0],
            "Node",
            "GaussPoint",
            n_elm_gp=assembly.n_elm_gp,
        )

        # F_theta-theta = r_current / R_reference, hence
        # grad_values[2][2] = u_r / R_reference. See the
        # "Theory of axisymmetric kinematics" section of
        # :class:`fedoo.core.mechanical3d.Mechanical3D` for the derivation.
        R0 = assembly.sv["_R0_gausspoints"]
        rank_dispx = assembly.space.variable_rank("DispX")
        n = mesh.n_nodes
        grad_values[2][2] = np.divide(
            mesh.convert_data(
                displacement[rank_dispx * n : (rank_dispx + 1) * n],
                "Node",
                "GaussPoint",
                n_elm_gp=assembly.n_elm_gp,
            ),
            R0,
            out=np.zeros_like(R0),
            where=R0 != 0,
        )  # zero at the symmetry axis (R0 == 0)
    assembly.sv["DispGradient"] = grad_values
    return grad_values


## 011 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Exemples_fedoo/03-advanced/incompressibility_comparison.py (lines 100-187 · sibling function/class)

def solve_formulation(label, method):
    """Solve one formulation and return history and final plotting data."""
    key = label.lower().replace(" ", "_").replace("-", "")
    mesh = cook_mesh(f"cook_{key}")

    material = fd.constitutivelaw.ElastoPlasticity(
        YOUNG_MODULUS,
        POISSON_RATIO,
        YIELD_STRESS,
    )
    material.set_hardening_function(
        "power",
        h=HARDENING_MODULUS,
        beta=HARDENING_EXPONENT,
    )

    if method == "reduced_integration":
        weakform = fd.weakform.StressEquilibriumRI(material, nlgeom="UL")
    else:
        weakform = fd.weakform.StressEquilibrium(
            material,
            nlgeom="UL",
            incompressibility=method,
        )

    assembly = fd.Assembly.create(weakform, mesh, name=f"assembly_{key}")
    problem = fd.problem.NonLinear(assembly)
    problem.set_nr_criterion(
        "Displacement",
        err0=1.0,
        tol=2e-4,
        max_subiter=25,
    )

    left = mesh.find_nodes("X", 0.0)
    right = mesh.find_nodes("X", 48.0)
    problem.bc.add("Dirichlet", left, "Disp", 0.0)

    # Trapezoidal weights represent a uniform traction while keeping the total
    # applied force independent of the number of nodes on the loaded edge.
    weights = np.ones(len(right))
    weights[[0, -1]] = 0.5
    weights /= weights.sum()
    problem.bc.add("Neumann", right, "DispY", TOTAL_SHEAR_FORCE * weights)

    # Register one compact history per formulation.  ``P`` is stored at its
    # natural Gauss-point location and converted only when it is requested for
    # the final field plot.
    results = problem.add_output(
        Path(OUTPUT_DIRECTORY.name) / f"{key}.fdh5",
        assembly,
        ["Disp", "P", "Stress"],
    )

    start = perf_counter()
    problem.nlsolve(
        dt=0.1,
        tmax=1.0,
        update_dt=True,
        dt_max=0.1,
        print_info=0,
        interval_output=0.1,
    )
    elapsed = perf_counter() - start

    # Loading several fields together makes ``get_history`` traverse the result
    # frames only once.  Averaging DispY over the right edge gives the response
    # quantity used in the comparison curve.
    history = results.get_history(
        ["Time", "Disp"],
        indices=[None, right],
        component=[None, "Y"],
        data_type=[None, "Node"],
    )
    time = np.r_[0.0, np.ravel(history["Time"])]
    mean_displacement = np.r_[0.0, np.mean(history["Disp"], axis=-1)]

    results.load(-1)
    plastic_strain = results.get_data("P", data_type="Element")

    return {
        "force": time * TOTAL_SHEAR_FORCE,
        "displacement": mean_displacement,
        "maximum_plastic_strain": np.max(plastic_strain),
        "results": results,
        "elapsed": elapsed,
    }
</rag-context>