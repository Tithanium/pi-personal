<rag-context>
[pi-local-rag] RAG subagent: 14 sources, 355588 ms retrieval.
# fedoo: Isotropic von Mises (J2) plasticity with hardening — 2D beam plastic bending

Sources retrieved from the indexed fedoo corpus. All text quoted exactly from source.

## 1. The working example: 2D plastic bending, written from scratch (answers the exact prompt scenario)

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/examples/plasticity/2DplasticBending_from_scratch.py — whole file (lines 1–222)

This is a complete script: a 2D plane-strain beam (rectangle mesh) bent by an imposed tip displacement, with isotropic von Mises plasticity and power-law hardening, solved with a hand-written Newton–Raphson loop.

```python
import fedoo as fd
import numpy as np
from time import time
import os
import pylab as plt
from numpy import linalg

start = time()
# --------------- Pre-Treatment --------------------------------------------------------

fd.ModelingSpace("2Dplane")

typeBending = "3nodes"  #'3nodes' or '4nodes'
# Units: N, mm, MPa
h = 2
w = 10
L = 16
E = 200e3
nu = 0.3
alpha = 1e-5  # ???
uimp = -5

mesh = fd.mesh.rectangle_mesh(
    nx=41, ny=21, x_min=0, x_max=L, y_min=0, y_max=h, elm_type="quad4", name="Domain"
)

crd = mesh.nodes

mat = 1
if mat == 0:  # linear
    material = fd.constitutivelaw.ElasticIsotrop(E, nu, name="ConstitutiveLaw")
elif mat == 1:
    # isotropic plasticity with power law hardening sigma = k*eps_p**m
    Re = 300
    k = 1000
    m = 0.25
    props = np.array([E, nu, alpha, Re, k, m])
    material = fd.constitutivelaw.Simcoon("EPICP", props, name="ConstitutiveLaw")

wf = fd.weakform.StressEquilibrium("ConstitutiveLaw", nlgeom=False)


# note set for boundary conditions
bottom_left = mesh.nearest_node([0, 0])
bottom_right = mesh.nearest_node([L, 0])

if typeBending == "3nodes":
    top_center = mesh.nearest_node([L / 2, h])
else:
    nodes_top1 = mesh.find_nodes(f"X=={L / 4} and Y=={h}")
    nodes_top2 = mesh.find_nodes(f"X=={3 * L / 4} and Y=={h}")
    top_center = np.hstack((nodes_top1, nodes_top2))

fd.Assembly.create(
    wf, "Domain", "quad4", name="Assembling", mesh_change=False
)  # uses mesh_change=True when the mesh change during the time

pb = fd.problem.NonLinear("Assembling")  # incremental non linear problems

# create a 'result' folder and set the desired ouputs
if not (os.path.isdir("results")):
    os.mkdir("results")

if mat == 0:
    res = pb.add_output(
        "results/bendingPlastic",
        "Assembling",
        ["Disp", "Stress", "Strain"],
        output_type="Node",
        file_format="vtk",
    )
elif mat == 1:
    res = pb.add_output(
        "results/bendingPlastic",
        "Assembling",
        ["Disp", "Stress", "Strain", "Statev", "Wm"],
        output_type="Node",
        file_format="vtk",
    )

################### step 1 ################################
# bending with non linear behavior
tmax = 1
pb.bc.add(
    "Dirichlet",
    bottom_left,
    "Disp",
    0,
)
pb.bc.add("Dirichlet", bottom_right, "DispY", 0)
pb.bc.add("Dirichlet", top_center, "DispY", uimp, name="disp")

# pb.nlsolve(dt = 0.05, tmax = 1, update_dt = False, tol_nr = 0.05, interval_output = 0.05)

# parameters
n_iter = 20
tol_nr = 0.05  # newton-raphson tolerance
max_subiter = 5  # newton-raphson of iterations per time step
err_num = 1e-8  # numerical error to avoid very small iterations
tmax = 1

pb.dtime = tmax / n_iter  # time step

pb.init_bc_start_value()  # set the initial displacement and forces

pb.time = 0  # time at the begining of the iteration

pb.initialize()  # compute the initial stress and elastic matrix
ii = 0  # iterations

# Newton raphson loop
while pb.time < tmax - err_num:
    pb.assembly.set_start(
        pb
    )  # set the tangent matrix to the elastic and make the global matrices assembly
    if ii != 0:
        pb.save_results(ii)  # Save results

    # Begin with an elastic prediction using the elastic tangent matrix

    # apply progressively the bounding condition using a time factor
    # as we solve an incremental problem, the load variation is considered
    t_fact_old = pb.time / tmax
    t_fact = (pb.time + pb.dtime) / (tmax)  # adimensional time

    pb.apply_boundary_conditions(t_fact, t_fact_old)

    # build and solve the linearized system with elastic rigidity matrix
    pb.set_A(pb.assembly.get_global_matrix())
    pb.set_D(pb.assembly.get_global_vector())

    # pb._update_d(start = True) #not modified in principle if dt is not modified, except the very first iteration. May be optimized by testing the change of dt
    pb.solve()

    pb._Xbc *= 0  # boundary conditions increment are now set to 0 because the current prediction already satisfy the bc

    # update displacement increment
    pb._dU += pb.get_X()

    err0 = np.max(np.abs(pb._U + pb._dU))
    convergence = False

    for subiter in range(max_subiter):  # newton-raphson iterations
        # Check convergence (displacement criterion. Force and work criteria are also possible)
        norm_res = np.max(np.abs(pb.get_X())) / err0

        # print('     Subiter {} - Time: {:.5f} - Err: {:.5f}'.format(subiter, pb.time+pb.dtime, norm_res))

        if norm_res < tol_nr:  # convergence of the NR algorithm
            convergence = True
            break

        # --------------- Solve --------------------------------------------------------
        pb.assembly.update(
            pb
        )  # update the initial stress and tangent matrix from the constitutive law and make the globel matrix and vector assemblies

        pb.set_A(pb.assembly.get_global_matrix())
        pb.set_D(pb.assembly.get_global_vector())
        pb.solve()
        pb._dU += pb.get_X()

    if not (convergence):
        raise NameError(
            "Newton Raphson iteration has not converged (err: {:.5f})- Reduce the time step.".format(
                norm_res
            )
        )

    pb.time = pb.time + pb.dtime  # update time value
    ii += 1

    pb.assembly.update(
        pb
    )  # update the stress and tangent matrix from the constitutive law and make the globel matrix and vector assemblies

    print(
        "Iter {} - Time: {:.5f} - NR iter: {} - Err: {:.5f}".format(
            ii, pb.time, subiter, norm_res
        )
    )


# pb.assembly.set_start(pb)
pb.save_results(ii)


################### step 2 ################################
# compute residual stresses
# assume only elastic return, so no need newton raphson here -> only linear problem

# change boundary conditions
pb.bc.remove("disp")
# pb.bc.add("Neumann", top_center, "DispY", 0)  # no force applied = relaxation

pb.assembly.set_start(
    pb
)  # set the tangent matrix to the elastic and make the global matrices assembly

pb.apply_boundary_conditions(t_fact=1, t_fact_old=0)

# build and solve the linearized system with elastic rigidity matrix
pb.set_A(pb.assembly.get_global_matrix())
pb.set_D(pb.assembly.get_global_vector())

pb.solve()

# update displacement
pb._U += pb.get_X()

pb.assembly.update(
    pb
)  # update the stress and tangent matrix from the constitutive law and make the globel matrix and vector assemblies

pb.save_results(ii + 1)


print(time() - start)

# res.plot("Stress", "vm")
# res.write_movie("test", "Stress", "vm")
```

Note: in `mat == 1` the example uses the optimized Simcoon wrapper `fd.constitutivelaw.Simcoon("EPICP", props)` (props = `[E, nu, alpha, Re, k, m]`, i.e. Young modulus, Poisson, thermal expansion, yield stress, hardening modulus k, hardening exponent m) because `ElastoPlasticity` does not implement plane-stress ('2Dstress'). For plane-strain (this example, `fd.ModelingSpace("2Dplane")`), the pure-Python `fd.constitutivelaw.ElastoPlasticity(E, nu, Re)` plus `set_hardening_function("power", h=k, beta=m)` is the direct equivalent — see the class below.

## 2. The constitutive law class: fedoo.constitutivelaw.ElastoPlasticity

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/constitutivelaw/elasto_plasticity.py — class ElastoPlasticity (lines 10–209)

```python
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

        self._hardening_function = None
        self._hardening_function_derivative = None
        self._current_stress = None
        self._current_plastic_strain = None
        self._current_plasticity = None
        self._current_tangent = None

    @property
    def shear_modulus(self):
        """Shear modulus."""
        return self.young_modulus / (2.0 * (1.0 + self.poisson_ratio))

    def set_return_mapping_tolerance(self, tolerance):
        """Set the absolute tolerance used by the local return mapping."""
        if tolerance <= 0:
            raise ValueError("The return-mapping tolerance must be positive.")
        self.return_mapping_tolerance = tolerance

    def get_elastic_matrix(self, dimension="3D"):
        """Return the isotropic elastic matrix in engineering Voigt form."""
        if dimension == "2Dstress":
            raise NotImplementedError(
                "ElastoPlasticity does not implement the plane-stress "
                "('2Dstress') return mapping. For plane-stress models or "
                "through-thickness shell plasticity, use a Simcoon plasticity "
                'law, e.g. fedoo.constitutivelaw.Simcoon("EPICP", props), '
                "which supports the 2Dstress assumption."
            )

        young_modulus = self.young_modulus
        poisson_ratio = self.poisson_ratio
        dtype = (
            float
            if np.isscalar(young_modulus) and np.isscalar(poisson_ratio)
            else object
        )
        elastic_matrix = np.zeros((6, 6), dtype=dtype)
        lame_parameter = (
            young_modulus
            * poisson_ratio
            / ((1 + poisson_ratio) * (1 - 2 * poisson_ratio))
        )
        elastic_matrix[:3, :3] = lame_parameter
        elastic_matrix[0, 0] += 2 * self.shear_modulus
        elastic_matrix[1, 1] += 2 * self.shear_modulus
        elastic_matrix[2, 2] += 2 * self.shear_modulus
        elastic_matrix[3, 3] = self.shear_modulus
        elastic_matrix[4, 4] = self.shear_modulus
        elastic_matrix[5, 5] = self.shear_modulus
        return elastic_matrix

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

        elif function_type == "user":
            hardening_function = kwargs.get("hardening_function")
            hardening_function_derivative = kwargs.get("hardening_function_derivative")
            if hardening_function is None:
                raise TypeError("Keyword argument 'hardening_function' is required.")
            if hardening_function_derivative is None:
                raise TypeError(
                    "Keyword argument 'hardening_function_derivative' " "is required."
                )
        else:
            raise ValueError("function_type must be either 'power' or 'user'.")

        self._hardening_function = hardening_function
        self._hardening_function_derivative = hardening_function_derivative

    def hardening_function(self, plasticity):
        """Evaluate the isotropic hardening stress."""
        if self._hardening_function is None:
            raise RuntimeError(
                "The hardening function has not been defined. Call "
                "set_hardening_function first."
            )
        return self._hardening_function(plasticity)

    def hardening_function_derivative(self, plasticity):
        """Evaluate the derivative of the isotropic hardening stress."""
        if self._hardening_function_derivative is None:
            raise RuntimeError(
                "The hardening function has not been defined. Call "
                "set_hardening_function first."
            )
        return self._hardening_function_derivative(plasticity)

    def yield_function(self, stress, plasticity):
        """Evaluate the von Mises yield function."""
        return (
            stress.von_mises() - self.yield_stress - self.hardening_function(plasticity)
        )

    def yield_function_derivative(self, stress):
        """Differentiate the yield function with respect to stress."""
        equivalent_stress = np.asarray(stress.von_mises())
        if np.any(equivalent_stress == 0):
            raise ZeroDivisionError(
                "The yield direction is undefined at zero deviatoric stress."
            )
```

So to model isotropic J2 with power hardening: create `ElastoPlasticity(E, nu, Re)`, then call `set_hardening_function("power", h=k, beta=m)`. The yield function is `von_Mises(stress) - yield_stress - R(p)` (R = h*p**beta), i.e. classical J2 with isotropic hardening.

## 3. The weak form: fedoo.weakform.StressEquilibrium

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/weakform/stress_equilibrium.py — class StressEquilibrium (lines 17–216, excerpt)

```python
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
        If True, the geometrical non linearities are activate based on the
        updated lagrangian method. This parameters is used only in the
        context of NonLinearProblems such as
        :mod:`fedoo.problem.NonLinearStatic` or
        :mod:`fedoo.problem.NonLinearNewmark`.
        If nlgeom == 'UL' the updated lagrangian method is used (same as True).
        If nlgeom == 'TL' the total lagrangian method is used.
        If not defined, the problem.nlgeom parameter is used instead.
    space: ModelingSpace
        Modeling space associated to the weakform. If None is specified,
        the active ModelingSpace is considered.
    """

    def __init__(
        self,
        constitutivelaw,
        incompressibility=None,
        convert_tangent=True,
        name="",
        nlgeom=None,
        space=None,
    ):
        ...
        self.space.new_variable("DispX")
        self.space.new_variable("DispY")
        if self.space.ndim == 3:
            self.space.new_variable("DispZ")
            self.space.new_vector("Disp", ("DispX", "DispY", "DispZ"))
        else:  # 2D assumed
            self.space.new_vector("Disp", ("DispX", "DispY"))

        self.constitutivelaw = constitutivelaw
        self.time_evolution = SECOND_ORDER
        self.nlgeom = nlgeom
        self.corate = "log_r"
        ...
```

`get_weak_equation` builds the standard `∫ δeps : (H : eps + stress0) dV` equilibrium using the tangent `TangentMatrix` (H) and the initial stress from the constitutive law — the small-strain form is what `nlgeom=False` uses. In the example: `wf = fd.weakform.StressEquilibrium("ConstitutiveLaw", nlgeom=False)`.

## 4. The nonlinear solver: fedoo.problem.NonLinear

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/problem/non_linear.py — class NonLinear.__init__ and nr_parameters (lines 13–48)

```python
class NonLinear(Problem):
    def __init__(self, assembly, nlgeom=False, name="MainProblem"):
        if isinstance(assembly, str):
            assembly = Assembly.get_all()[assembly]

        # A = assembling.current.get_global_matrix() #tangent stiffness matrix
        A = 0  # tangent stiffness matrix - will be initialized only when required
        B = 0
        # D = assembling.get_global_vector() #initial stress vector
        D = 0  # initial stress vector #will be initialized later
        self.print_info = 1  # print info of NR convergence during solve
        self._U = 0  # displacement at the end of the previous converged increment
        self._dU = 0  # displacement increment
        self._initialized = False

        self._err0 = None  # initial error for NR error estimation
        self._alpha = 1  # line search current parameter

        self.nr_parameters = {
            "err0": None,  # default error for NR error estimation
            "criterion": "Force",
            "tol": 5e-3,
            "max_subiter": 16,
            "dt_increase_niter": None,
            "norm_type": 2,
            "force_elastic_stiffness": False,
            "elastic_initial_guess": False,
            "adaptive_stiffness": False,
            "assume_cvg_at_max_subiter": False,
            "check_early_divergence": True,
        }
        """Parameters to set the Newton-Raphson algorithm.

        The available parameters can be modified with the method
        :py:meth:`fedoo.problem.non_linear.set_nr_criterion`.
        """
        ...
        self.t0 = 0
        self.tmax = 1
        self.time = 0
        self.dtime = 0
        ...
```

So the Newton–Raphson algorithm is configured via `pb.nr_parameters` (convergence `criterion`, `tol` tolerance, `max_subiter` per-increment iteration cap, etc.). In the example the problem is created with `pb = fd.problem.NonLinear("Assembling")`.

### How the Newton–Raphson loop is driven — the built-in driver `nlsolve`

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/problem/non_linear.py — nlsolve signature (lines 1121–1136)

```python
    def nlsolve(
        self,
        dt: float = 0.1,
        update_dt: bool = True,
        tmax: float | None = None,
        t0: float | None = None,
        dt_min: float = 1e-6,
        max_subiter: int | None = None,
        dt_increase_niter: int | None = None,
        tol_nr: float | None = None,
        print_info: int | None = None,
        save_at_exact_time: bool | None = None,
        interval_output: int | float | None = None,
        callback: Callable[[Problem, ...], None] | None = None,
        exec_callback_at_each_iter: bool | None = None,
        dt_max: float | None = None,
        ...
```

This is the high-level incremental driver: it steps time from `t0` to `tmax` in `dt` increments (adaptively, `update_dt=True`, bounded by `dt_min`/`dt_max`), calling the per-increment Newton loop `solve_time_increment` at each step, and writing outputs every `interval_output`. In the example the commented line shows the intended call:
`pb.nlsolve(dt = 0.05, tmax = 1, update_dt = False, tol_nr = 0.05, interval_output = 0.05)`.

### The per-increment Newton–Raphson loop — solve_time_increment

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/problem/non_linear.py — solve_time_increment (lines 932–1120, excerpt)

```python
    def solve_time_increment(self, max_subiter=None, tol_nr=None):
        if max_subiter is None:
            max_subiter = self.nr_parameters["max_subiter"]
        if tol_nr is None:
            tol_nr = self.nr_parameters["tol"]
        ...
        subiter = 1
        error = float("inf")
        self._t_fact_inc = self.t_fact
        ...
        try:
            self.elastic_prediction()
        except InvalidKinematicStateError:
            # No kinematically valid line-search trial exists, even for its
            # smallest step: use the normal failed-increment/time-step-cut path.
            self._t_fact_inc = None
            return 0, subiter, error

        ...
        consecutive_decreases = 0
        consecutive_increases = 0
        while subiter < max_subiter:
            # update Stress and initial displacement and Update stiffness matrix
            try:
                self.update(compute="vector")  # out of balance force vector
            except InvalidKinematicStateError:
                return 0, subiter, error
            self._update_d()  # required to compute the NR error

            # Check convergence
            prev_error = error
            error = self.compute_nr_error()
            if (
                error < tol_nr
                and subiter >= self._nr_min_subiter
                and self._xbc_is_applied()
                and getattr(self, "_bc_residual_norm", 0.0) < 10 * tol_nr
            ):
                self._t_fact_inc = None
                return 1, subiter, error
            elif check_early_divergence and (
                not np.isfinite(error) or error > 100 * prev_error
            ):
                # suspected ill-conditioned matrix
                return 0, subiter, error

            # Track convergence trend
            if error > 0.999 * prev_error:  # if decrease non significant, considered as increase
                consecutive_increases += 1
                consecutive_decreases = 0
                if consecutive_increases >= 4 and check_early_divergence:
                    return 0, subiter, error
            else:
                consecutive_increases = 0
                consecutive_decreases += 1
            ...
            # --------------- Solve --------------------------------------------------------
            subiter += 1  # start a new nr iteration
            self.update(
                compute="matrix", updateWeakForm=False
            )  # assemble the tangeant matrix

            if adaptive_stiffness:
                KT = self.__assembly.current.get_global_matrix()
                A = xi * KE + (1 - xi) * KT
            elif force_elastic_stiffness:
                A = KE
            else:
                A = self.__assembly.current.get_global_matrix()

            self.set_A(A)

            try:
                self.solve_nr_increment()
            except InvalidKinematicStateError:
                self._t_fact_inc = None
                return 0, subiter, error

        if assume_cvg_at_max_subiter:
            ...
            return 1, subiter, error
        self._t_fact_inc = None
        return 0, subiter, error
```

The inner correction is `solve_nr_increment` (lines 911–931): solve the linearized system with the current tangent A and D, apply optional line-search/step-size scaling, and accumulate `self._dU += self.get_X()`.

So the built-in NR loop is: at each time increment do an elastic prediction (`elastic_prediction` with the elastic tangent), then iterate — recompute out-of-balance force (`update(compute="vector")`), compute the NR error (`compute_nr_error`, default "Force" criterion), check `error < tol_nr`, and if not converged assemble the tangent matrix (`update(compute="matrix")`) and solve the correction (`solve_nr_increment`). The outer `nlsolve` advances time, cutting/growing `dt` on non-convergence.

### Hand-written equivalent loop (as in the example, lines 111–181)

The same loop driven manually in `2DplasticBending_from_scratch.py` (quoted in full in section 1): outer `while pb.time < tmax` time loop; per increment `pb.assembly.set_start(pb)` (elastic tangent), apply incremental BCs via `pb.apply_boundary_conditions(t_fact, t_fact_old)`, elastic prediction solve; then an inner `for subiter in range(max_subiter)` NR loop that checks the convergence `norm_res = np.max(np.abs(pb.get_X())) / err0 < tol_nr`, else `pb.assembly.update(pb)` (recompute stress + tangent from the constitutive law and reassemble) and solves. If not converged it raises "Reduce the time step."

## 5. Summary of the exact classes / calls for a 2D plane-strain plastic bending problem

- Space: `fd.ModelingSpace("2Dplane")` (2D plane assumption = plane strain / plane stress).
- Mesh: `fd.mesh.rectangle_mesh(..., elm_type="quad4", name="Domain")`.
- Constitutive law (pure-Python, plane strain): `material = fd.constitutivelaw.ElastoPlasticity(E, nu, Re)` then `material.set_hardening_function("power", h=k, beta=m)`; for plane stress / production use `fd.constitutivelaw.Simcoon("EPICP", props)` with `props=[E, nu, alpha, Re, k, m]`.
- Weak form: `wf = fd.weakform.StressEquilibrium("ConstitutiveLaw", nlgeom=False)`.
- Assembly: `fd.Assembly.create(wf, "Domain", "quad4", name="Assembling", mesh_change=False)`.
- Nonlinear solver: `pb = fd.problem.NonLinear("Assembling")`.
- Boundary conditions: `pb.bc.add("Dirichlet", node, "Disp"/"DispY", value, name=...)`.
- NR control: `pb.nr_parameters` (`criterion`, `tol`, `max_subiter`, ...) or per-call `tol_nr`/`max_subiter`.
- Driving the Newton–Raphson: `pb.nlsolve(dt=..., tmax=..., update_dt=..., tol_nr=..., interval_output=...)` (built-in incremental + NR loop), or the manual `while pb.time < tmax` / `for subiter` loop shown in section 1.
</rag-context>