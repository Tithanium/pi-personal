

# Context: J2 (von Mises) plasticity with hardening in fedoo — 2D plane-strain plastic bending

## 1. Reference examples (the exact problem asked about)

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Exemples_fedoo\plasticity\2DplasticBending.py`
2D plastic bending, scripted variant (full script):
```python
import fedoo as fd
import numpy as np
from time import time
import os

start = time()
# --------------- Pre-Treatment --------------------------------------------------------

fd.ModelingSpace("2Dplane")

NLGEOM = True
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
    nx=41,
    ny=21,
    x_min=0,
    x_max=L,
    y_min=0,
    y_max=h,
    elm_type="quad4",
    name="Domain",
)

crd = mesh.nodes

mat = 1
if mat == 0:  # linear
    material = fd.constitutivelaw.ElasticIsotrop(E, nu, name="Constitu1tiveLaw")
elif mat == 1:
    # isotropic plasticity with power law hardening sigma = k*eps_p**m
    Re = 300
    k = 1000
    m = 0.25
    props = np.array([E, nu, alpha, Re, k, m])
    material = fd.constitutivelaw.Simcoon("EPICP", props, name="ConstitutiveLaw")


# wf = fd.weakform.StressEquilibriumRI("ConstitutiveLaw", nlgeom=NLGEOM)
wf = fd.weakform.StressEquilibrium("ConstitutiveLaw", nlgeom=NLGEOM)
# wf.incompressibility = "fbar"

# alternative using element 'quad4' with reduced integration
# ie n_elm_gp = 1 combined with hourglass control
# wf = fd.weakform.StressEquilibriumRI("ConstitutiveLaw", 0.005, nlgeom=NLGEOM)


# note set for boundary conditions
bottom_left = mesh.nearest_node([0, 0])
bottom_right = mesh.nearest_node([L, 0])

if typeBending == "3nodes":
    top_center = mesh.nearest_node([L / 2, h])
else:
    nodes_top1 = mesh.find_nodes(f"X=={L / 4} and Y=={h}")
    nodes_top2 = mesh.find_nodes(f"X=={3 * L / 4} and Y=={h}")
    top_center = np.hstack((nodes_top1, nodes_top2))

assemb = fd.Assembly.create(
    wf,
    "Domain",
    name="Assembling",
)

pb = fd.problem.NonLinear("Assembling")

# Problem.set_solver('cg', precond = True)

# pb.set_nr_criterion("Displacement")
# Problem.set_nr_criterion("Work")
# Problem.set_nr_criterion("Force")

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
        file_format="fdz",
        compressed=True,
    )
    # elm_set = mesh.get_elements_from_nodes(mesh.find_nodes('X<8'))
    # res = pb.add_output('results/bendingPlastic', 'Assembling', ['Disp', 'Stress', 'Strain', 'Statev', 'Wm'], element_set = elm_set )

################### step 1 ################################
tmax = 1
pb.bc.add(
    "Dirichlet",
    bottom_left,
    "Disp",
    0,
)
pb.bc.add("Dirichlet", bottom_right, "DispY", 0)
# pb.bc.add("Neumann", top_center, "DispY", -380, name="disp")
pb.bc.add("Dirichlet", top_center, "DispY", uimp, name="disp")

pb.nlsolve(dt=0.05, tmax=1, update_dt=True, tol_nr=0.05, interval_output=0.05)

################### step 2 ################################
# compute residual stresses
pb.bc.remove("disp")
F = pb.get_ext_forces("DispY")[top_center]

pb.bc.add(
    "Neumann", top_center, "DispY", 0, start_value=F
)  # no force applied = relaxation

pb.set_nr_criterion("Force", adaptive_stiffness=True)

pb.add_line_search()
pb.nlsolve(dt=0.25, t0=1, tmax=2, update_dt=True, tol_nr=0.05)

print(time() - start)

res.plot("Stress", "vm")
# res.write_movie("test", "Stress", "vm")
```

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Exemples_fedoo\plasticity\2DplasticBending_from_scratch.py`
Same model, manual Newton–Raphson loop (educational). Full script:
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

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Exemples_fedoo\plasticity\plastic_bending_3D.py`
3D version (relevant material-switch excerpt, `mat==2` uses native fedoo ElastoPlasticity with power hardening):
```python
mat = 1
if mat == 0:
    props = np.array([E, nu, alpha])
    material = fd.constitutivelaw.Simcoon("ELISO", props, name="constitutivelaw")
elif mat == 1 or mat == 2:
    Re = 300
    k = 1000  # 1500
    m = 0.3  # 0.25
    if mat == 1:
        props = np.array([E, nu, alpha, Re, k, m])
        material = fd.constitutivelaw.Simcoon("EPICP", props, name="constitutivelaw")
    elif mat == 2:
        material = fd.constitutivelaw.ElastoPlasticity(
            E, nu, Re, name="constitutivelaw"
        )
        material.set_hardening_function("power", h=k, beta=m)
else:
    material = fd.constitutivelaw.ElasticIsotrop(E, nu, name="constitutivelaw")

wf = fd.weakform.StressEquilibrium(
    "constitutivelaw", nlgeom=NLGEOM, incompressibility="fbar"
)

# or alternatively with reduced integration + hourglass stiffness :
# wf = fd.weakform.StressEquilibriumRI("constitutivelaw", nlgeom = True)
...
pb = fd.problem.NonLinear("Assembling")
pb.set_nr_criterion("Force", tol=5e-3, max_subiter=16)
...
pb.bc.add("Dirichlet", nodes_bottomLeft, "Disp", 0)
pb.bc.add("Dirichlet", nodes_bottomRight, "DispY", 0)
bc = pb.bc.add("Dirichlet", nodes_topCenter, "DispY", uimp)

pb.nlsolve(dt=0.025, tmax=1, update_dt=True, print_info=1, interval_output=0.05)
```

## 2. Constitutive law: J2 / von Mises with isotropic hardening

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Code_source_fedoo\fedoo\constitutivelaw\elasto_plasticity.py`
(Identical in the 1.0.0 archive copy; module docstring: `"""J2 plasticity with isotropic hardening, additive on the strain measure."""`)

Class docstring (verbatim, condensed):
```
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
    poisson_ratio : float
    yield_stress : float
        Initial yield stress.
    name : str, optional
    """
```

Key API surface (from the source):
- Constructor: `ElastoPlasticity(young_modulus, poisson_ratio, yield_stress, name="")`; registers `props_label={"young_modulus": 0, "poisson_ratio": 1, "yield_stress": 2}` and `statev_label={"P": 0, "EP": slice(1, 7)}`, `n_statev=7`.
- Hardening setup:
```python
def set_hardening_function(self, function_type, **kwargs):
    """Define the isotropic hardening function.

    ``function_type="power"`` defines ``R(p) = h * p**beta``.
    ``function_type="user"`` accepts ``hardening_function`` and
    ``hardening_function_derivative`` callables.
    """
```
- Yield function (von Mises with hardening):
```python
def yield_function(self, stress, plasticity):
    """Evaluate the von Mises yield function."""
    return (
        stress.von_mises() - self.yield_stress - self.hardening_function(plasticity)
    )
```
- `get_elastic_matrix(dimension)` raises `NotImplementedError` for `dimension="2Dstress"`:
```
"plane-stress ('2Dstress') return mapping. For plane-stress models or
through-thickness shell plasticity, use a Simcoon plasticity
law, e.g. fedoo.constitutivelaw.Simcoon("EPICP", props),
which supports the 2Dstress assumption."
```
- `_integrate(...)`: trial stress `elastic_matrix @ (strain - plastic_strain_old)`; plastic points where trial von Mises − σY − H(p_old) > tol; bisection+Newton solve of the consistency equation `sig_tr = 3G·Δp + σY + H(p_old+Δp)`; stress update `trial - trial_deviator + (1 − 3G·Δp/sig_tr)·trial_deviator`; plastic strain `+= direction·Δp` with `direction = 1.5·dev/S · (·2 for shear slots)`; continuum tangent correction `− (C·n ⊗ C·n)/(nᵀ·C·n + H'(p))`.
- `compute_stress(total_strain, plasticity_old=None, plastic_strain_old=None)`: stateless material-point helper; history (`get_plasticity()`, `get_plastic_strain()`, `get_stress()`, `get_tangent_matrix()`) read from the last integration.
- `_call_umat(...)`: `EP` transported by the corotational rotation `DR` (simcoon `Rotation`); finite strain: Kirchhoff/log-strain return, `Cauchy = tau / J1` handed to the assembly; work split into elastic/plastic parts in `wm`.

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Code_source_fedoo\fedoo\constitutivelaw\simcoon_umat.py`
The production path for J2 hardening is the Simcoon UMAT adapter:
```
class Simcoon(MechanicalUMAT):
    """Constitutive laws from the simcoon library.

    The constitutive Law should be associated with
    :mod:`fedoo.weakform.StressEquilibrium`
    ...
    UMAT compatibility with the ``2Daxi`` ModelingSpace:
    * **Isotropic UMATs** (e.g. ``ELI``, ``NEOH``, ``MOON``, ``EPICP`` J2
      plasticity): supported. ...
    """
```
- Constructor: `Simcoon(umat_name, props, tangent_mode=1, name="")` — dispatches to `sim.umat(umat_name, ...)` in `_call_umat`; a Simcoon `StepCut` exception is routed to `InvalidKinematicStateError` → solver retries with a smaller increment.
- `_ISOTROPIC_UMATS = {"ELISO", "EPICP", "EPKCP", "EPCHA", "ZENER", "ZENNK", "PRONK", "NEOHC", "MOORI", "YEOHH", "ISHAH", "GETHH", "SWANH"}`.
- EPICP registration (verbatim):
```python
elif umat_name == "EPICP":
    self.n_statev = 8
    self.props_label = {
        "E": 0,
        "nu": 1,
        "alpha": 2,
        "sigmaY": 3,
        "k": 4,
        "m": 5,
    }  # powerlaw sigma_e = sigmaY + k * eps_p^m
    self.statev_label = {"T": 0, "P": 1, "EP": slice(2, 8)}
```
- Other J2 plasticity UMATs available through the same wrapper: `EPKCP` (isotropic + linear kinematic backstress `X`), `EPCHA` (Voce isotropic + Chaboche 2-backstress), `EPHIL` (Hill), `EPHAC`, `EPANI`, `EPDFA`, `EPHIN` (n laws).
- `Simcoon.from_modular(modular_material, ...)`: build a `MODUL` UMAT from a `simcoon.modular.ModularMaterial` (elasticity block + `VonMisesYield` + `PowerLawHardening(k, m)` / `LinearIsotropicHardening(H)` / `VoceHardening(Q, b)` / Prager / ArmstrongFrederick / Chaboche …). Note: "Under finite strain, use ``corate="log_r"`` (or ``"log_r_inc"``) in the associated stress-equilibrium weakform. This is required by Simcoon's modular Hencky formulation."

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Code_source_fedoo\fedoo\core\mechanical3d.py`
`MechanicalUMAT` lifecycle (docstring, condensed verbatim):
```
class MechanicalUMAT(Mechanical3D):
    """Base class for corotational user-material functions.

    ``MechanicalUMAT`` owns the Fedoo-side constitutive lifecycle: allocation
    of state and work variables, temperature lookup, local-frame changes of
    basis, the UMAT call, and conversion of stress and tangent outputs back to
    global coordinates.  A user material therefore only has to integrate its
    constitutive equations in the supplied corotational material frame.
    ...
    In finite strain, the weak form owns and updates the deformation-gradient
    field. ``MechanicalUMAT`` consumes that field as ``F0`` and ``F1`` and
    never initializes or overwrites it.
    ...
    Initial values can be assigned to a particular assembly before problem
    initialization with :meth:`set_initial_statev`.
    """
```
`__init__` parameters include `use_elastic_tangent: bool = True` ("Restore the initialization tangent at the start of every increment") and `tangent_mode: int = 1` ("Tangent selector forwarded unchanged to the UMAT callback").

## 3. Weak form

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Code_source_fedoo\fedoo\weakform\stress_equilibrium.py`
```
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
    incompressibility: str, optional   # method to avoid volumetric locking
    convert_tangent: bool, default=True
        Convert the constitutive corotational Kirchhoff tangent to the
        formulation tangent (``dS/dE`` for TL, spatial Lie for UL). ...
    name: str
    nlgeom: bool, 'UL' or 'TL', optional
        If True, the geometrical non linearities are activate based on the
        updated lagrangian method. ...
        If nlgeom == 'UL' the updated lagrangian method is used (same as True).
        If nlgeom == 'TL' the total lagrangian method is used.
        If not defined, the problem.nlgeom parameter is used instead.
    space: ModelingSpace
    """
```
- Default `self.corate = "log_r"`: "'log_r' (default): logarithmic strain with the exact polar frame increment DR = R1 R0^T — the corate whose tangent transport is exact in simcoon, including with rotated internal-variable history. Other options: 'log' (XBM), 'jaumann', 'green_naghdi'/'gn', 'log_inc', 'log_r_inc'..."
- `incompressibility` property (verbatim docstring, condensed): options `None` (standard displacement formulation), `"auto"`, `"mean_dilatation"` (B-bar, symmetric tangent), `"sri"` (legacy small-strain B-bar, quad4/hex8), `"fbar"` ("F-bar method where the volume change is evaluated at the element center. The consistent non symmetric tangent matrix is used for 'quad4' and 'hex8' elements (not available for '2Daxi' and with the total lagrangian method). In small strain, it reduces to a center-based B-bar volumetric correction."). "This attribute should be defined before the creation of the associated assembly."
- `get_weak_equation` builds `DiffOp = Σ eps[i].virtual * (H·eps)[i] + initial-stress term`, plus the f-bar tangent correction when `incompressibility == "fbar"`.

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Code_source_fedoo\fedoo\weakform\stress_equilibrium_ri.py`
```
class StressEquilibriumRI(WeakFormSum):
    """Stress-equilibrium weak form with reduced integration.

    This weak form combines :class:`StressEquilibrium` with
    :class:`HourglassStiffness` to control the hourglass deformation modes
    associated with reduced integration.

    It should only be used with ``hex8`` or ``quad4`` elements. Unlike the
    standard :class:`StressEquilibrium` weak form, it uses one Gauss point by
    default and adds the hourglass stabilization proposed by Flanagan and
    Belytschko.
    ...
    Example
    -------
    >>> import fedoo as fd
    >>> fd.ModelingSpace("2Dstress")
    >>> material = fd.constitutivelaw.ElasticIsotrop(100e3, 0.3)
    >>> wf = fd.weakform.StressEquilibriumRI(material)
    """
```
- Signature: `StressEquilibriumRI(constitutivelaw, hourglass_stiffness=0.01, convert_tangent=True, name="", nlgeom=None, nlgeom_hourglass=False, space=None)`; sets `assembly_options["n_elm_gp", "quad4"|"hex8"] = 1` and maps `quad4→quad4hourglass`, `hex8→hex8hourglass`.
- `HourglassStiffness.stiffness_coef`: "Coefficient to control the hourglass stiffness. This coefficient is a compromise between a sufficient stiffness to suppress hourglass modes and a not too high stiffness to avoid additionnal flexural stiffness." Based on Flanagan & Belytschko (1981), normalized by the P-wave modulus extracted from the material tangent.

## 4. Nonlinear problem and Newton–Raphson driver

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Code_source_fedoo\fedoo\problem\non_linear.py`
(`NonLinear` constructor and default NR parameters, verbatim):
```python
def __init__(self, assembly, nlgeom=False, name="MainProblem"):
    ...
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
```

`set_nr_criterion` docstring (verbatim, key parts):
```
Define the convergence criterion of the newton raphson algorithm.
...
    * criterion: str in ['Displacement', 'Force', 'Work'],
      default = "Displacement".   (NOTE: docstring says Displacement; code default is "Force")
      Type of convergence test.

    Optional parameters that can be set as kargs:
        * 'err0': float or None, default = None.  The reference error. If None (default), err0 is automatically computed.
        * 'tol': float, default is 5e-3.  Error tolerance for convergence.
        * 'max_subiter': int, default = 16.  Number of nr iterations before returning a convergence error.
        * 'dt_increase_niter': int or None, default = None.  Number of nr iterations threshold that define an easy convergence. ... If None, defaults to max_subiter//3.
        * 'norm_type': int or numpy.inf, default = 2.
        * 'force_elastic_stiffness': bool, default = False.  If True, always forces the use of the elastic stiffness matrix (KE) for all NR iterations (Quasi-Newton / Initial Stiffness method).
        * 'elastic_initial_guess': bool, default = False.  If True, forces the use of the elastic matrix for the initial guess (first iteration) of a time increment.
        * 'adaptive_stiffness': bool, default = False.  Enable adaptive stiffness algorithm with xi-blending between safe (often elastic) and tangent stiffness matrices to enhance convergence robustness. Only works if the weak form provides an elastic stiffness matrix at the beginning of the increment, when set_start is triggered (e.g. not for contact problems).
        * 'assume_cvg_at_max_subiter': bool, default = False.  WARNING: DANGEROUS PARAMETER. ...
        * 'check_early_divergence': bool, default = True.  If True, aborts the time step early if convergence trends are poor. A step is considered diverging if:
          1. The error remains "unproductive" (new_error > 0.999 * previous_error) for 4 consecutive Newton-Raphson iterations.
          2. The error spikes to more than 100 times the previous error.
```

NR error evaluation (`compute_nr_error`, verbatim structure):
- `"Displacement"`: `norm(get_X()[dof_free]) / (err0 * alpha)`; if `err0 is None`, `err0 = norm(_dU) + 0.01*norm(_U)` ("Normalize by the current increment ... so the criterion does not become progressively looser as loading proceeds").
- `"Force"`: `norm(free-dof residual) / err0` where residual = `B[free] + D[free]` mapped through the BC constraint matrix, and if `err0 is None` → `err0 = norm(get_ext_forces(include_mpc=False))` (external-force norm).
- `"Work"`: `norm(get_X()[free] * (B[free]+D[free])) / err0` with `err0` bootstrapped from the first evaluation.

`nlsolve` docstring (verbatim, key parts):
```
Solve the non linear problem using the newton-raphson algorithm.

    dt: float, default=0.1  Initial time increment
    update_dt: bool, default = True
        If True, the time increment may be modified during resolution:
        * decrease if the solver has not converged
        * increase if the solver has converged quickly (see ``dt_increase_niter``).
    tmax: float, optional.  Time at the end of the time step. ...
    t0: float, optional.  Time at the start of the time step. ...
    dt_min: float, default = 1e-6  Minimal time increment
    dt_max: float, optional  Maximum time increment. ...
    max_subiter: int, optional
        Maximal number of newton raphson iteration allowed for each time
        increment, after the initial linear guess. ... (default = 16)
    dt_increase_niter: int, optional
        When ``update_dt`` is ``True``, the time increment is multiplied
        by 1.25 if the Newton–Raphson loop converges in at most
        ``dt_increase_niter`` iterations. ... (default = max_subiter // 3)
    tol_nr: float, optional  ... (default = 5e-3)
    print_info : int, optional  0/1/2 ...
    save_at_exact_time: bool, default True ...
    interval_output: int|float, optional ...
    callback: function ...
    exec_callback_at_each_iter, bool, default = False ...
```

`nlsolve` loop mechanics (from the source):
```python
while self.time < self.tmax - self.err_num:
    ...
    if (self.time + dt > next_time - self.err_num):  # if dt is too high, it is reduced to reach next_time
        self.dtime = next_time - self.time
    else:
        self.dtime = dt

    if restart:
        self.to_start()   # reset internal variables, update Stress, initial displacement and assemble global matrix at previous time
        restart = False
    else:
        self.set_start(save_results, callback)

    # self.solve_time_increment = Newton Raphson loop
    convergence, nb_nr_iter, error = self.solve_time_increment(max_subiter, tol_nr)

    if convergence:
        self.time = self.time + self.dtime
        self.__iter += 1
        if self.print_info > 0:
            print("Iter {} - Time: {:.5f} - dt {:.5f} - NR iter: {} - Err: {:.5f}".format(...))
        # Check if dt can be increased
        if update_dt and nb_nr_iter <= dt_increase_niter and dt == self.dtime:
            dt *= 1.25
            if dt_max is not None:
                dt = min(dt, dt_max)
    else:
        ...
        if update_dt:
            dt *= 0.25
            if dt < dt_min:
                self.to_start()
                raise RuntimeError("Current time step is inferior to the specified minimal time step (dt_min)")
            restart = True
            continue
        else:
            self.to_start()
            raise RuntimeError("Newton Raphson iteration has not converged - Reduce the time step or use update_dt = True")
```

Per-increment NR driver (`solve_time_increment`, verbatim structure):
1. `elastic_prediction()`: apply BC increments `apply_boundary_conditions(t_fact, t_fact_old)`; reuse the tangent matrix of the last converged iteration of the previous time step (new tangent only for the very first increment or when a transient dt changed); `_update_d(start=True)` (initial-stress vector); `solve()` the linear system (this is the elastic predictor); if a line search returns `alpha < 1`, the Dirichlet increment is scaled and the unapplied remainder is carried by the next correction (`self._Xbc *= 1 - alpha`); `self._dU += self.get_X()`.
2. Loop `while subiter < max_subiter`:
   - `self.update(compute="vector")` (out-of-balance force vector from the constitutive law) + `self._update_d()`;
   - `error = self.compute_nr_error()`; convergence when `error < tol_nr and subiter >= _nr_min_subiter and _xbc_is_applied() and _bc_residual_norm < 10*tol_nr`;
   - early divergence: `not finite(error) or error > 100*prev_error` → fail; or error unproductive (`> 0.999*prev`) for 4 consecutive subiters → fail;
   - `adaptive_stiffness` block: xi-blending `A = xi*KE + (1-xi)*KT`, switch to elastic (xi=1) on 2 consecutive increases, restart with elastic stiffness at subiter 3, reduce xi by /4 on improvement;
   - `subiter += 1; self.update(compute="matrix", updateWeakForm=False)` (assemble the tangent matrix); `self.set_A(A)`; `self.solve_nr_increment()` (line search optional, then `self._dU += self.get_X()`).
3. `assume_cvg_at_max_subiter` option or return failure.

`set_start` docstring behavior: "on an empty increment their recurrence would still consume one time step (for Newmark it negates the velocity)"; when an increment has been solved: `self._U += self._dU; self._dU = 0; self.__assembly.set_start(self)` (commits the state to the constitutive law and constraints; optionally saves results).

`to_start` docstring (verbatim):
```
Restore the state of the last converged increment.

Called when the Newton-Raphson algorithm fails to converge: the
displacement increment, the minimal number of sub-iterations, the
load-factor increment and the initial error are reset, then the
assembly and the constraints are brought back to their committed
state. The tangent matrix is re-assembled at the restored state, so
that the next attempt (with a smaller time increment, see
:py:meth:`nlsolve`) starts its elastic prediction from the same matrix
as the increment that has just been cancelled.
```

Line search (`add_line_search` docstring, condensed verbatim):
```
Add line search algorithm for the Newton-Raphson solver.

Line search improves global convergence by scaling the displacement
increment :math:`dX` by a step size :math:`\alpha \in (0, 1]`. This is
particularly useful for problems with sharp non-linearities or when
the initial guess is far from the equilibrium.

    method : {'Armijo', 'Residual', 'Energy', 'Quadratic'} or callable, default 'Quadratic'
        * 'Armijo': Ensures a "sufficient decrease" in the residual using a least-square assumption. Standard for most nonlinear applications.
        * 'Residual': Simple backtracking that accepts any step reducing the residual norm. Fast but less robust.
        * 'Energy': Minimizes the out-of-balance work (residual projected onto the search direction). Ideal for snap-through/buckling.
        * 'Quadratic': Performs a parabolic interpolation of the objective function to jump directly to the estimated minimum.
        * callable: signature ``user_line_search(pb, dX) -> float`` ...
    mode : {'natural', 'minimize', 'safeguard'}, default 'natural'
        * 'natural' (default): validity filter, then the step is accepted when EITHER the classical Armijo test on ‖R‖ OR Deuflhard's affine-invariant test on the simplified Newton correction K^{-1} R(u + alpha dX) passes. The first one throttles the overshoot of penalty contact and elastic-plastic transitions ... Factorization reuse (set_reuse_factorization) is enabled automatically with a direct solver so that each trial costs one back-substitution.
        * 'minimize': classical residual-descent line search using method below.
        * 'safeguard': pure validity filter. ... the right choice for force control of soft (bending) modes.
    apply_to_bc : bool, default True
        ... invalid advance is scaled, its unapplied part is carried by the next Newton correction, and convergence is accepted only after the complete prescribed increment has been applied.
```
Examples: `pb.add_line_search()`, `pb.add_line_search(mode="minimize", method="Quadratic")`, `pb.add_line_search(mode="safeguard")`, `pb.add_line_search(apply_to_bc=False)`, `pb.add_line_search(method=my_ls)`.

Also in the module: `NonLinearNewmark(assembly, beta=0.25, gamma=0.5, nlgeom=False, first_order_integrator=None, name=...)` — "Create a nonlinear Newmark problem with default time integrators." Note: "the mass is now derived from the material density (``material.set_density(rho)``) or ``weakform.set_inertia(...)``".

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Code_source_fedoo\fedoo\core\problem.py`
Base `Problem` API used by the manual loop:
- `add_output(filename, assembly, output_list=None, output_type=None, file_format="fdh5", compressed=False, position=1, element_set=None, save_mesh=True, ..., write_mode="overwrite", ignore_missing=False)` — "Register an output for automatic saving managed by solve methods." `file_format`: `"fdh5", "fdz", "vtk", "msh", "npz", "csv", "xlsx"`; `output_type`: `'Node', 'Element' or 'GaussPoint'`.
- `save_results(iterOutput=None)` — "Write the current state to every registered output. This method is called automatically when the problem is solved. In case of user-managed solution loops, it must be called manually."
- `apply_boundary_conditions(t_fact=1, t_fact_old=None)` — fills `_Xbc` (Dirichlet values interpolated on [t_fact_old, t_fact] via each BC's `generate`), `B` (Neumann forces), builds MPC elimination matrix `_MatCB` and `dof_free`.
- `init_bc_start_value()` — "### is used only for incremental problems": sets each Dirichlet/Neumann BC's `start_value` from the current displacement/force so that the load ramps from the current state.
- `get_ext_forces(name="all", include_mpc=True)` — "Return the nodal Forces ... sum of External forces (Neumann), Node reaction (Dirichlet), Inertia forces." Notes: "NonLinear returns the latest evaluated residual balance: custom loops must update the vector after applying a correction."
- `solve(**kargs)` — solves `A X = B (+D) − A X_bc` on free dofs via `_solve_reduced` (the backend set by `set_solver`).
- `get_disp(name="Disp")` returns `_U + _dU` during a pending increment.

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Code_source_fedoo\fedoo\core\base.py`
`set_solver(solver="direct", symmetric=False, **kargs)` docstring (condensed verbatim):
```
Define the solver for the linear system resolution.
    solver: str, ufunc
        * 'direct': direct solver. If pypardiso is installed, the pypardiso solver is used. Else, if python-mumps is installed, the standalone MUMPS solver is used. Else, if petsc is installed, the mumps solver from petsc is used. If not, scipy.sparse.linalg.spsolve is used. If scikit-umfpack is installed, scipy will use the umfpack solver...
        * 'cg', 'bicg', 'bicgstab', 'minres', 'gmres', 'lgmres' or 'gcrotmk' using the corresponding iterative method from scipy.sparse.linalg.
        * 'pardiso': force the use of the pypardiso solver
        * 'mumps': force the use of the standalone MUMPS solver (recommended direct solver on arm64 platforms where pypardiso is not available)
        * 'direct_scipy': force the use of the direct scipy solver (umfpack if installed)
        * 'petsc': use the petsc methods (iterative or direct). petsc4py should be installed.
        * function: A user spsolve function ... res = solver(A,B,**kargs)
    symmetric: bool, default=False  (symmetric-indefinite factorization when supported)
    kargs: precond, M, solver_type, pc_type, pc_factor_mat_solver_type (petsc)
```

## 5. Quick-start workflow (official docs)

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Code_source_fedoo\docs\quick_start.rst`
```
Steps to define and solve a Problem
1. Import the fedoo library
2. Define the space dimension 
3. Create and/or import the geometry (mesh)
4. Define one or many weak formulations (including constitutive equations)
5. Create the Assembly associated to the weak formulations and the mesh
6. Define the type of Problem (Static, Dynamic, ...) and the solver
7. Solve the Problem
8. Analyse and export results (vizualisation with Paraview recommanded)
```
Modeling space: "The dimension of the space may also be set to '2Dstress' for planar problem based on the plane stress assumption." (i.e. `"2Dplane"` = plane strain, `"2Dstress"` = plane stress, `"3D"`).
Weak form example: `material = fd.constitutivelaw.ElasticIsotrop(200e3, 0.3)`; `my_weakform = fd.weakform.StressEquilibrium(material)`; `my_assembly = fd.Assembly.create(my_weakform, my_mesh)`; `pb = fd.problem.Linear("MyAssembly")`; `pb.set_solver('cg')` — "For direct solver, it is strongly recommended to install one of ``pypardiso`` (Intel CPUs), ``python-mumps`` (cross-platform, also required for :meth:`Problem.set_reuse_factorization`) or ``petsc4py`` for drastically improved computation performance."
BCs: `pb.bc.add('Dirichlet', nodes_left, 'Disp', 0)`; `pb.bc.add('Dirichlet', nodes_right, 'DispY', -10)`.

Note: `docs/constitutive_law.rst`, `docs/problem.rst`, `docs/weak_form.rst` are all `automodule` pointers — the docstrings in `fedoo/` source are the authoritative API docs (per `okf/documentation/index.md`: "the docstrings are the authoritative API documentation source").

## 6. Validation: ElastoPlasticity vs Simcoon EPICP

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\Code_source_fedoo\tests\test_elasto_plasticity.py`
```python
E = 200e3
NU = 0.3
SIGMA_Y = 300.0
H = 1000.0
BETA = 0.3

def make_material():
    material = ElastoPlasticity(E, NU, SIGMA_Y)
    material.set_hardening_function("power", h=H, beta=BETA)
    return material
```
- `test_radial_return_matches_simcoon_simple_shear_reference`: 20 proportional shear increments (γ 0→0.02) fed through `material.compute_stress(StrainTensorList(strain), plasticity, plastic_strain)`; "Reference values produced by Simcoon's EPICP law for the same 20 proportional shear increments": final `stress[3] ≈ 314.581143696 MPa`, `plasticity ≈ 0.00918589977986`, `yield_function(stress, plasticity) ≈ 0` (atol 1e-6).
- `test_plastic_tangent_uses_positive_hardening_denominator`: expected `tangent[3,3,0] = G*H'/(3G + H')` for a single shear point.
- `test_mechanical_umat_update_restarts_from_committed_state`: on a new trial the law re-integrates from the committed `sv_start` (Newton rollback support at material level).
- `test_corotational_update_transports_plastic_strain_with_dr`: `EP` history rotated by `DR` under `nlgeom="UL"`.
- `test_finite_element_state_uses_mechanical_umat_labels_only`: `props_label == {"young_modulus": 0, "poisson_ratio": 1, "yield_stress": 2}`, `statev_label == {"P": 0, "EP": slice(1, 7)}`, `assembly.sv_component["P"] == ("Statev", 0)`.

## 7. Verified run results for the 2D plastic bending examples

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\okf\examples\plastic-bending.md`
Front matter: `title: "Plastic bending (2D and 3D)"`; `resource: ../../Exemples_fedoo/plasticity/2DplasticBending.py`; tags `[plasticity, elastoplasticity, bending, 2d, 3d]`; `status: stable`; verified `by: pi/fedoo-example-runner, at: 2026-10-08T21:35:00Z` and `2026-10-08T22:30:00Z`.

Verified run `2DplasticBending.py` (2026-10-07, fedoo 1.0.1, Python 3.13, headless):
- "Result: **PASS**, 15 s. 2D plate bending, `ElastoPlasticity` (EPICP)."
- "Key numbers: step 1 max vm **1121.06 MPa**, final max vm **1144.60 MPa**, springback **0.219 mm**."
- "Fixes (playground copy): 1. `set_nr_criterion` 'Force' → 'Displacement' — root cause: the Force criterion normalizes the residual by ‖F_ext‖; during the force-relaxation-to-zero (springback) the normalized error is stuck at a dt-independent floor **0.76755** → `dt_min` error. 'Displacement' converges; final state within **2.2e-4 mm** of the exact zero-load equilibrium. 2. `'Constitu1tiveLaw'` → `'ConstitutiveLaw'` typo (present in the doc source) that broke the `mat=0` branch."
- "Switches: `typeBending` 4-node plate → max vm **1351.73 MPa**; `mat=0` (linear elastic) → `Uy` → **−0.0471**."

Verified run `2DplasticBending_from_scratch.py` (2026-10-08, fedoo 1.0.1):
- "Result: **PASS**, exit 0, wall time **7.4 s**... Model: **861 nodes / 800 quad4** (`rectangle_mesh nx=41, ny=21`, 16×2 mm, `2Dplane`), `nlgeom=False`, **manual Newton–Raphson loop** (20 increments, `dt=0.05`, `tol_nr=0.05`, `max_subiter=5`), material Simcoon **EPICP** (E=200 GPa, ν=0.3, α=1e-5, Re=300 MPa, k=1000, m=0.25). Step 2 removes the top BC → elastic release (no NR, single linear solve)."
- "BCs: bottom-left corner clamped (`Disp`=0); bottom-right `DispY=0` (roller, `Ux` free = 1.605 mm at end of loading); top center (8, 2) `DispY=−5`."
- "end of loading: `Uy_tip = −5.000000` (prescribed); max P (EPICP statev[1], nodal) = **0.347769** at node 20 (8.0, 0.0) — deep plasticity at the center hinge."
- "peak von Mises end of loading (fedoo's own `'vm'` reduction): GP max **1057.4522 MPa** at gp=1, el=19 (element center (7.8, 0.05), bottom fiber just left of the load point; `flat_col = gp·n_el + el`, 4 GP/quad4...); Node max **1061.2347 MPa** at node 20 (8.0, 0.0)."
- "residual (after elastic release): `Uy_tip = −4.704038` → permanent set **0.2960 mm** (springback 0.296 mm); end rotation (X=16, finite difference over h=2) **−0.002588 rad (−0.148°)**... — small as expected: center-loaded 3-support beam puts the plastic hinge at the center, end sections stay near-vertical."
- "final residual-stress peak: vm Node max **1067.7754 MPa**, vm GP max 1017.9343 MPa..."
- "Note: in `2Dplane`, Stress is stored **6-component Voigt** (`(6, n_points)`); with the 3D EPICP UMAT the ZZ slot is non-zero (XZ/YZ = 0)."
- "**Reproducibility**: a full second run reproduced all 21 frames bit-identically: max|ΔU| = **0.0 mm**, max|ΔS_node| = **0.0 MPa** (deterministic on this machine)."
- "max |Voigt| is NOT a stress peak here: the max-|Voigt| GP at end of loading (**6993.4439 MPa**) sits at gp=3, el=780 on the *top* face (8.2, 1.95) with S=[−6993, −5902, −6200, 5.2, 0, 0] — nearly hydrostatic (mean −6365 MPa), a volumetric artifact of the deep-plasticity state (loose NR tol 0.05)... not meaningful for this example."
- Switches: "`mat=0` (linear `ElasticIsotrop`): PASS... full elastic recovery (final U = 0, vm = 0 — no residual); end-of-loading vm Node max 43006.54 MPa (point-displacement concentration, unbounded without plasticity). `typeBending='4nodes'` (top load at x=4 and x=12, EPICP): PASS... end-of-loading vm Node max **1049.4731 MPa**, final residual **1188.7670 MPa**, residual `Uy_top = −4.70931`, end rotation −0.015542 rad."

Verified run `plastic_bending_3D.py` (2026-10-08, fedoo 1.0.1):
- "Result: **PASS**, exit 0, wall time **129.7 s**... 40 NR increments (t 0→1, fixed `dt=0.025`, 10–14 NR iters, `Force` criterion `tol=5e-3`). Model: **1029 nodes / 720 hex8** box 16×2×10 mm (`box_mesh` 21×7×7 nodes). `NLGEOM='UL'`, f-bar incompressibility. Default `mat=1`: Simcoon **EPICP** (E=200 GPa, ν=0.3, Re=300 MPa, power hardening k=1000, m=0.3)."
- "tip (top center) final `Uy` = **−8.000000 mm** (prescribed)... peak von Mises... GP max **1242.7544 MPa**, Node max **1332.8916 MPa**... end rotation at the simply-supported end ... **−0.7521 rad (−43.1°)** — consistent with a plastic-hinge state (M_p = Re·w·h²/4 = 3000 N·mm → center-load capacity 4·M_p/L = 750 N)."
- "Switches: `mat=0` (Simcoon ELISO), `mat=2` (ElastoPlasticity + `set_hardening_function("power", h=k, beta=m)`) and `typeBending='4nodes'` ... all **construct-checked** on 1.0.1..."

Related pointers: "`fd.constitutivelaw.ElastoPlasticity` API page (`Main_documentation_fedoo/generated/fedoo.constitutivelaw.ElastoPlasticity.html`)."

## 8. Newton-Raphson criterion gotchas (documented concept)

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\okf\concepts\nonlinear-nr-criterion.md`
- "`pb.set_nr_criterion(criterion, **kargs)` on a `fd.problem.NonLinear` problem selects the Newton-Raphson convergence criterion (`criterion` in `[\"Displacement\", \"Force\", \"Work\"]`; ...). It can also be set directly through the `pb.nr_parameters` dict."
- "The default is **'Force'** — `nr_parameters[\"criterion\"] = \"Force\"` (`fedoo/problem/non_linear.py:33`) and `set_nr_criterion(criterion=\"Force\", ...)` (line 703). **Docstring claims `default = \"Displacement\"`** — doc/code mismatch (verified 2026-10-07 against the installed fedoo 1.0.1)."
- "When the 'Force' criterion fails: The Force criterion normalizes the NR residual by the external-force norm ‖F_ext‖. It fails when ‖F_ext‖ ≈ 0 or when the residual is not a force increment: 1. **Kinematically-driven problems** (pure displacement/rotation loads with ‖F_ext‖ ≈ 0): the normalized error is stuck and never reaches the tolerance (e.g. ~0.68–1.1 on `plasticity/rotation_test.py`, ‖F_ext‖ ≈ 1.36e-11) → `dt` collapses to `dt_min` and `nlsolve` raises. 2. **Force relaxation to zero** (load ramped up then removed, e.g. the springback step of `plasticity/2DplasticBending.py`): once F_ext → 0 the normalized residual has a dt-independent floor (0.76755 in the bending springback) → `dt_min` error."
- "Use **`\"Displacement\"`** for both cases — verified 2026-10-07 on `plasticity/rotation_test.py` (66 s PASS) and `plasticity/2DplasticBending.py` (15 s PASS, final state within 2.2e-4 mm of the exact zero-load equilibrium)."
- "Conversely, the 'Displacement' criterion stalls on some stiff force-driven contacts (Err ≈ 0.04 → `dt_min`); 'Force' is the working choice there (see the punch-indentation and OGC examples)."

## 9. Related verified plasticity context

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\okf\examples\plasticity-tests.md`
Single-element validation of `fedoo.constitutivelaw.ElastoPlasticity` (rotation/shear/torsion), all PASS on fedoo 1.0.1:
- `rotation_test.py` — "3D cube rigid rotation (90°)... max |Disp| = **1.0 mm**, max vm = **2.57e-10 MPa** (rigid, zero strain)." Fix: `set_nr_criterion` → "Displacement" (default "Force" fails: "purely kinematically driven, ‖F_ext‖ ≈ 1.36e-11, NR error stuck ~0.68–1.1 → `dt_min`").
- `shear_test.py` — "1331 nodes `hex8`, simple shear... vm_max = **1295.31 MPa** (GP), EP max = **1.40056**... `mat=2` (`ElastoPlasticity`) cross validates at vm **1295.309 MPa**."
- `torsion_test.py` — "180° torsion about X... `mat=1` (EPICP) and `mat=2` (`ElastoPlasticity`) vm_max = **1339.8 MPa** (agree)."

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\okf\examples\index.md` (plasticity section)
"All 4 scripts in `plasticity/` verified **PASS** on fedoo 1.0.1 (2026-10-07 wave, headless...)." Entries as detailed in §7. Also: `incompressibility_comparison` — "Cook's membrane in plane strain, nearly incompressible elasto-plasticity: standard / mean-dilatation / F-bar / reduced-integration `quad4` formulations compared... (locking makes the untreated element ≈ 2.29× too stiff)... tip DispY 0.87896 / 2.00988 / 2.01025 / 1.81188".

## 10. Corpus layout (source-of-truth map)

### `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo\okf\documentation\index.md`
- Top-level folders: `_archive_Code_source_fedoo_1.0.0/`, `Code_source_fedoo/` (current source, v1.0.1 per `Code_source_fedoo/CHANGELOG.md`: "## [1.0.1] - 2026-10-01"), `Documentation_technique/`, `Exemples_fedoo/` (current example scripts, incl. `Exemples_fedoo/plasticity/`), `Main_documentation_fedoo/` (Sphinx HTML mirror of https://3mah.github.io/fedoo-docs/stable/), `okf/` (knowledge bundle).
- "The `Main_documentation_fedoo/generated/` folder mirrors the autodoc API pages (one HTML page per class, function and member, e.g. `fedoo.weakform.StressEquilibrium.html`, `fedoo.problem.Linear.html`, ...). 1,823 pages..."
- "The API without a generated HTML page is documented in the source docstrings ... and by the example scripts in `Exemples_fedoo/`."
- `fedoo.constitutivelaw.*` documented classes include: "ElasticIsotrop, ElasticOrthotropic, ElasticAnisotropic, CompositeUD, ElastoPlasticity, FE2, Simcoon, Heterogeneous, CohesiveLaw, Spring, BeamProperties..., ShellHomogeneous (+ NonLinear), ShellLaminate (+ NonLinear), ThermalProperties."
- `fedoo.weakform.*`: "StressEquilibrium, StressEquilibriumRI / Mixed / Fbar / Bbar, HeatEquation, BeamEquilibrium, SpringEquilibrium, PlateEquilibrium..., Inertia, ..., HourglassStiffness, ArtificialDamping, ImplicitDynamic."
- `fedoo.problem.*`: "Linear, NonLinear, NonLinearNewmark, LinearNewmark, Modal, LinearBuckling, ExplicitDynamic, ProblemBase, Problem."
- "Overview, Install, Quick_Start, Mesh, Assembly, Problem, boundary_conditions, constitutive_law, weak_form, heterogeneous, time, user_problems" as `.rst` sources in `Documentation_technique/`.

Version note: `fedoo/constitutivelaw/elasto_plasticity.py` is byte-identical between `_archive_Code_source_fedoo_1.0.0/fedoo/...` and `Code_source_fedoo/fedoo/...` (verified by diff: "NO DIFFERENCE"); `Exemples_fedoo/plasticity/2DplasticBending_from_scratch.py` is identical between the 1.0.0 archive and the current tree.