<rag-context>
[pi-local-rag] RAG subagent: 6 sources, 410776 ms retrieval.
# Modeling isotropic von Mises (J2) plasticity with hardening in fedoo — 2D beam in plane strain, plastic bending

## `C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/constitutivelaw/elasto_plasticity.py` — `ElastoPlasticity` constitutive law (the J2 class, lines 1-98)

```
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
    logarithmic strain. ... The stress returned by the
    radial return is the Kirchhoff stress conjugate to the logarithmic strain
    and the Cauchy stress is handed to the assembly, so that the
    response is the one of Simcoon's ``EPICP`` UMAT.

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

    Parameters
    ----------
    young_modulus : float
        Young modulus.
    poisson_ratio : float
        Poisson ratio.
    yield_stress : float
        Initial yield stress.
    name : str, optional
        Name of the constitutive law.
    """

    is_isotropic = True

    def __init__(
        self,
        young_modulus,
        poisson_ratio,
        yield_stress,
        name="",
    ):
        super().__init__(
            props=[young_modulus, poisson_ratio, yield_stress],
            n_statev=7,
            props_label={
                "young_modulus": 0,
                "poisson_ratio": 1,
                "yield_stress": 2,
            },
            statev_label={"P": 0, "EP": slice(1, 7)},
            is_isotropic=True,
            name=name,
        )
        self.young_modulus = young_modulus
        self.poisson_ratio = poisson_ratio
        self.yield_stress = yield_stress
        self.return_mapping_tolerance = 1e-6
        self.max_return_mapping_iterations = 50
```

## `.../fedoo/constitutivelaw/elasto_plasticity.py` — isotropic hardening (power law) + von Mises yield function (lines 134-213)

```
    def set_hardening_function(self, function_type, **kwargs):
        """Define the isotropic hardening function.

        ``function_type="power"`` defines ``R(p) = h * p**beta``.
        ``function_type="user"`` accepts ``hardening_function`` and
        ``hardening_function_derivative`` callables.
        """
        function_type = function_type.lower()

        if function_type == "power":
            if "h" not in kwargs:
                raise TypeError("Keyword argument 'h' is required.")
            if "beta" not in kwargs:
                raise TypeError("Keyword argument 'beta' is required.")

            hardening_modulus = kwargs["h"]
            beta = kwargs["beta"]
            if hardening_modulus < 0:
                raise ValueError("The hardening modulus h must be non-negative.")
            if beta <= 0:
                raise ValueError("The hardening exponent beta must be positive.")

            def hardening_function(plasticity):
                return hardening_modulus * np.asarray(plasticity) ** beta

            def hardening_function_derivative(plasticity):
                with np.errstate(divide="ignore", invalid="ignore"):
                    return (
                        beta * hardening_modulus * np.asarray(plasticity) ** (beta - 1)
                    )
        ...
        self._hardening_function = hardening_function
        self._hardening_function_derivative = hardening_function_derivative

    def yield_function(self, stress, plasticity):
        """Evaluate the von Mises yield function."""
        return (
            stress.von_mises() - self.yield_stress - self.hardening_function(plasticity)
        )

    def yield_function_derivative(self, stress):
        """Differentiate the yield function with respect to stress."""
        equivalent_stress = np.asarray(stress.von_mises())
        ...
        return StressTensorList(
            1.5 * np.asarray(stress.deviatoric()) / equivalent_stress
        ).to_strain()
```

Note on plane strain vs plane stress (lines 101-110): `get_elastic_matrix` supports `"3D"` and `"2Dstress"`, but raises
```
        if dimension == "2Dstress":
            raise NotImplementedError(
                "ElastoPlasticity does not implement the plane-stress "
                "('2Dstress') return mapping. For plane-stress models or "
                "through-thickness shell plasticity, use a Simcoon plasticity "
                'law, e.g. fedoo.constitutivelaw.Simcoon("EPICP", props), '
                "which supports the 2Dstress assumption."
            )
```
i.e. `ElastoPlasticity` is intended for 3D / plane-strain (2Dplane) — a good fit for a 2D beam in plane strain.

## `.../fedoo/constitutivelaw/elasto_plasticity.py` — radial-return integration of the J2 law (lines 239-345)

```
    def _plastic_increment(self, equivalent_trial_stress, plasticity_old):
        """Solve all active radial-return consistency equations together."""
        ...
        initial_residual = (
            equivalent_trial_stress
            - self.yield_stress
            - self.hardening_function(plasticity_old)
        )
        lower_bound = np.zeros_like(initial_residual)
        upper_bound = initial_residual / (3.0 * self.shear_modulus)

        def residual(plastic_increment):
            return (
                equivalent_trial_stress
                - 3.0 * self.shear_modulus * plastic_increment
                - self.yield_stress
                - self.hardening_function(plasticity_old + plastic_increment)
            )
        ...

    def _integrate(self, total_strain, plasticity_old, plastic_strain_old):
        """Integrate all material points from their committed state."""
        ...
        elastic_matrix = np.asarray(self.get_elastic_matrix(), dtype=float)
        trial_stress = elastic_matrix @ (strain - plastic_strain_old)
        equivalent_trial_stress = np.asarray(StressTensorList(trial_stress).von_mises())
        trial_yield = (
            equivalent_trial_stress
            - self.yield_stress
            - self.hardening_function(plasticity_old)
        )
        plastic_points = trial_yield > self.return_mapping_tolerance
        ...
        if np.any(plastic_points):
            plastic_increment = self._plastic_increment(
                equivalent_trial_stress[plastic_points],
                plasticity_old[plastic_points],
            )
            plasticity[plastic_points] += plastic_increment

            trial_deviator = self._deviatoric(trial_stress[:, plastic_points])
            radial_factor = (
                1.0
                - 3.0
                * self.shear_modulus
                * plastic_increment
                / equivalent_trial_stress[plastic_points]
            )
            stress[:, plastic_points] = (
                trial_stress[:, plastic_points]
                ...
```
This is the radial return: the trial stress is projected radially back onto the (hardened) von Mises yield surface, and the plastic-strain increment `EP` and scalar plasticity `P` are stored in `Statev` (labelled `{"P": 0, "EP": slice(1, 7)}`).

## `C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/problem/__init__.py` — the `NonLinear` solver and the Newton-Raphson loop (lines 285-365)

```
Non-Linear Solver
=================

Fedoo provides a robust framework for solving non-linear system, arising from structural
mechanics or similar field problems, using a modified Newton-Raphson (NR) approach.
The class :class:`NonLinear` is deticated to the resolution of such complicated
problems.

Newton-Raphson Algorithm
------------------------

The Newton-Raphson algorithm is an iterative process used to find the equilibrium state
of a non-linear system. Starting from an initial guess from
:meth:`NonLinear.elastic_prediction`,
the solver iteratively updates the displacement increment until the internal and
external forces are balanced within a specified tolerance.

Available Convergence Criteria
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can define how the solver determines convergence via :meth:`NonLinear.set_nr_criterion`.
Three criteria are available:

* **Force** (default): Measures the residual (out-of-balance) forces relative to the
  external applied forces.
* **Displacement**: Measures the norm of the displacement increment relative to the
  initial increment of the step.
* **Work**: Evaluates the energy (dot product of displacement and residual) relative to
  the initial work increment.

Key Newton-Raphson Parameters
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The following parameters can be adjusted via :meth:`NonLinear.set_nr_criterion` or the 
``nr_parameters`` dictionary:

* **tol**: The convergence tolerance (default: ``5e-3``). A smaller value increases 
  precision but may require more iterations.
* **max_subiter**: The maximum number of NR iterations allowed per time step 
  before failure. The default is 16, but for contact or highly non-linear 
  behavior, it is recommended to increase this value.
* **err0**: The reference error used for normalization. If ``None`` (default), 
  it is assessed based on the criterion:
  * **Displacement**: Calculated from the current increment norm, adjusted by 
    1% of total displacement for numerical stability.
  * **Force**: Calculated from the norm of the current external forces.
  * **Work**: Initialized once at the start of the increment and stored.
  ...
* **dt_increase_niter**: Threshold for "easy" convergence. If a step converges 
  in fewer iterations than this value, the time step ``dt`` is increased.
* **check_early_divergence**: If ``True``, the solver aborts the increment if the 
  error spikes to 100 times the previous iteration error (or becomes ``NaN`` 
  or ``inf``), or if the error increases/stagnates (less than 0.1% decrease) for 4 
  consecutive iterations.
* **norm_type**: Defines the mathematical norm used to compute the error.
  (default: ``2`` for Euclidean) 

The ``nlsolve`` Method
----------------------

The :meth:`NonLinear.nlsolve` method manages the time-steering logic, calling the NR 
loop for each increment and handling time-step adaptations.
```

Time-steering parameters (lines 351-365): `nlsolve(dt=..., update_dt=True, dt_increase_niter=..., dt_min=..., t0=..., tmax=...)` — the outer loop calls the NR loop for each increment and adapts `dt` (×0.25 on failure, ×1.25 on quick convergence).

## `.../fedoo/problem/__init__.py` — the `StressEquilibrium` weak form for the plastic bending model (lines 392-459)

The mechanical weak form is `fedoo.weakform.StressEquilibrium`, driven by the constitutive-law object (e.g. the `ElastoPlasticity` instance above). For the nearly-incompressible case (plasticity, ν≈0.5) it accepts `incompressibility`:

```
    * **Element-level methods**: pass ``incompressibility`` to
      :class:`fedoo.weakform.StressEquilibrium` (default: ``None``, standard
      displacement formulation). These methods introduce no additional global
      unknowns.

      .. code-block:: python

          wf = fd.weakform.StressEquilibrium(material, incompressibility="auto")

    * ``"auto"``: select ``"mean_dilatation"`` where it is available and retain
      the standard formulation otherwise.
    * ``"mean_dilatation"``: recommended B-bar method, based on a
      volume-weighted projection of the element dilatation. It gives a symmetric
      tangent matrix and supports both low- and high-order elements. ...
      It is available for small strain and updated-Lagrangian analyses in ``3D`` and ``2Dplane``.
```

Mixed / reduced-integration alternatives and usage pattern:

```
    * **Reduced Integration**: Use the :class:`fedoo.weakform.StressEquilibriumRI`
      weak form for one-point integration of ``quad4`` or ``hex8`` elements. ...
    * **Mixed Displacement/Pressure**: For hybrid strategies introducing 
      additional "Pressure" DOFs, use the 
      :class:`fedoo.weakform.StressEquilibriumMixed` weak form. ...

      .. code-block:: python

          import fedoo as fd
          # Define a quadratic element with linear pressure (Taylor-Hood)
          new_elm = fd.lib_elements.element_list.CombinedElement("quad8lbb", "quad8")
          new_elm.set_variable_interpolation("Pressure", "quad4")
          wf = fd.weakform.StressEquilibriumMixed(material, bulk_modulus=kappa)
          assembly = fd.Assembly.create(wf, my_mesh, elm_type="quad8lbb")
```

and the plain form is used as, e.g.:

```
      wf = fd.weakform.StressEquilibrium(material)
```

with the assembly built from the mesh and element type via `fd.Assembly.create(wf, my_mesh, elm_type=...)`, then handed to a `fedoo.problem.NonLinear` problem (imported at the bottom of the module: `from .non_linear import NonLinear, NonLinearNewmark`), which is driven by `problem.nlsolve(...)`.

## Summary of the workflow (2D beam in plane strain, plastic bending)

1. **Constitutive law**: `fedoo.constitutivelaw.ElastoPlasticity(young_modulus, poisson_ratio, yield_stress, name=...)`, then call `set_hardening_function("power", h=..., beta=...)` (or `"user"`) to add isotropic hardening. For a computational (non-pedagogical) run prefer `fedoo.constitutivelaw.Simcoon("EPICP", props)`.
2. **Weak form**: `wf = fd.weakform.StressEquilibrium(material)` (pass `incompressibility="auto"` or `"mean_dilatation"` for the incompressible plastic limit; use `StressEquilibriumRI` or `StressEquilibriumMixed` as needed). Build `assembly = fd.Assembly.create(wf, mesh, elm_type=...)`.
3. **Nonlinear solver**: a `fedoo.problem.NonLinear` problem. Set convergence via `set_nr_criterion` (Force/Displacement/Work; `tol`, `max_subiter`, etc.), and for elastoplasticity the doc recommends `adaptive_stiffness=True` (blends the tangent with the elastic matrix) or `force_elastic_stiffness` / `elastic_initial_guess` for robustness.
4. **Newton-Raphson loop**: driven by `NonLinear.nlsolve(dt=..., update_dt=True, t0=..., tmax=...)` — the outer time-steering loop calls the NR loop per increment, starting from an `elastic_prediction`, iterating until internal/external forces balance within `tol` (max `max_subiter` iterations), adapting `dt` up/down.
</rag-context>