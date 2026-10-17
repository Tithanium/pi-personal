

# Context: StressEquilibrium weak form (nlgeom/incompressibility) + rectangle_mesh builder (fedoo)

Corpus root: `C:\Users\connessn\Datas\02_RECHERCHE\00_Biblio\Doc_tech_fedoo` (all paths below are relative to it). Authoritative source tree: `Code_source_fedoo/` (fedoo 1.0.1, CHANGELOG `[1.0.1] - 2026-10-01`); `Documentation_technique/*.rst` are all `automodule` stubs — real API text lives in source docstrings; `Main_documentation_fedoo/*.html` is the rendered docs.

---

## 1. `StressEquilibrium` weak form — signature and class docstring

Source: `Code_source_fedoo/fedoo/weakform/stress_equilibrium.py`

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
```

- Constructor declares `DispX/DispY(/DispZ)` variables and the vector `Disp`; `self.time_evolution = SECOND_ORDER` (mass resolved from material density at integrator compile time; inertia absent for static analyses).
- `self.corate = "log_r"` default, with comment: `'log_r' (default): logarithmic strain with the exact polar frame increment DR = R1 R0^T — the corate whose tangent transport is exact in simcoon, including with rotated internal-variable history. Other options: 'log' (XBM), 'jaumann', 'green_naghdi'/'gn', 'log_inc', 'log_r_inc'...`
- `self.geometric_stiffness = None` (deferred default).

Source: `Code_source_fedoo/fedoo/weakform/stress_equilibrium.py` (nlgeom attribute docstring, set in `__init__`):

```python
self.nlgeom = nlgeom
"""Method used to treat the geometric non linearities.
    * Set to False if geometric non linarities are ignored.
    * Set to True or 'UL' to use the updated lagrangian method
      (update the mesh)
    * Set to 'TL' to use the total lagrangian method (base on the
      initial mesh with initial displacement effet)
"""
```

### nlgeom resolution (problem-level fallback)

Source: `Code_source_fedoo/fedoo/core/weakform.py` (`WeakFormBase._initialize_nlgeom`, called from `StressEquilibrium.initialize`):

```python
def _initialize_nlgeom(self, assembly, pb):
    if self.nlgeom is None:
        nlgeom = pb.nlgeom
    else:
        nlgeom = self.nlgeom
    if isinstance(nlgeom, bool):
        if nlgeom:
            assembly._nlgeom = "UL"
        else:
            assembly._nlgeom = False
        return
    else:
        if isinstance(nlgeom, str):
            assembly._nlgeom = nlgeom.upper()
            if assembly._nlgeom in ["UL", "TL"]:
                return
    raise ValueError("nlgeom should be in {'TL', 'UL', True, False}")
```

Verified fact (okf): `okf/concepts/stress-equilibrium-nlgeom.md`
- "Accepted values are exactly `{True, 'UL', 'TL'}`"; `nlgeom=None` (default) = small-displacement/linear kinematics; `True` == `'UL'`; `'TL'` = total Lagrangian.
- "`nlgeom` is only meaningful inside a nonlinear problem (`fd.problem.NonLinear`, `fd.problem.NonLinearNewmark`); it has no effect on a linear problem."
- "The finite-strain formulation **requires the external simcoon library** to be installed."
- "`corate` is a **weakform attribute** (`StressEquilibrium.corate`), not a constitutive-law attribute: setting `corate` on the material object is a **no-op** in 1.0.1 (verified 2026-10-07, `plasticity/torsion_test.py`)."
- "The consistent geometric stiffness is enabled automatically for finite-strain tangent conversion; set `geometric_stiffness` explicitly to override."
- Verified run: `Exemples_fedoo/01-simple/simple_cantilever_beam_3D_model_nlgeom.py` on fedoo 1.0.1 (`StressEquilibrium("ElasticLaw", nlgeom=True)`, `problem.NonLinear`, `pb.nlsolve(dt=0.2)`) converged in 5 adaptive time steps.

### Problem-level `nlgeom`

Source: `Code_source_fedoo/fedoo/problem/non_linear.py`

```python
class NonLinear(Problem):
    def __init__(self, assembly, nlgeom=False, name="MainProblem"):
```
- `self.nr_parameters = {"err0": None, "criterion": "Force", "tol": 5e-3, "max_subiter": 16, "dt_increase_niter": None, "norm_type": 2, "force_elastic_stiffness": False, "elastic_initial_guess": False, "adaptive_stiffness": False, "assume_cvg_at_max_subiter": False, "check_early_divergence": True}`
- `NonLinearNewmark(assembly, beta=0.25, gamma=0.5, nlgeom=False, first_order_integrator=None, name="MainProblem")` — "Geometric-nonlinearity option forwarded to :class:`NonLinear`."
- Problem class in 1.0.1 is `fd.problem.NonLinear` (not `NonLinearStatic`): `Code_source_fedoo/fedoo/problem/__init__.py` → `from .non_linear import NonLinear, NonLinearNewmark`; `from .linear import Linear, LinearNewmark`.
- `fd.problem.Linear(assembly, time_step=None, integrator=None, name="MainProblem")` sets `self.nlgeom = False` (source: `Code_source_fedoo/fedoo/problem/linear.py`).

## 2. Geometric nonlinearity — mechanics inside the weak form

Source: `Code_source_fedoo/fedoo/weakform/stress_equilibrium.py`

- `initialize()`: "``if assembly._nlgeom == "TL": assembly.sv["PK2"] = 0``" and raises `NotImplementedError("'2Daxi' ModelingSpace is not implemented with total lagrangian formulation. Use update lagrangian instead.")`; stores `F` (identity at start); sets `self.geometric_stiffness = bool(assembly._nlgeom and self.convert_tangent)` when it is `None` ("The initial-stress term completes the consistent TL/UL tangent.").
- `get_weak_equation()`: TL branch uses `eps = self.space.op_strain(assembly.sv["DispGradient"]); initial_stress = assembly.sv["PK2"]`; UL/linear branch uses `eps = self.space.op_strain(); initial_stress = assembly.sv["Stress"]  # Stress = Cauchy for updated lagrangian method`. Residual = `sum(eps[i].virtual * sigma[i])` (+ initial-stress terms, + geometric stiffness if enabled).
- `update()`: for UL, "if updated lagragian method → update the mesh and recompute elementary op" via `assembly.set_disp(pb.get_disp())`; then `self._comp_F(assembly, displacement)` + `self._corate_func(self, assembly, pb)` if nlgeom, else `_comp_linear_strain`.
- `update_2()` (tangent conversion): "Solid constitutive laws return the 'box' tangent d(tau_hat)/dD (Kirchhoff, corotational rate). Convert it to what this configuration integrates." TL: `sim.Lt_convert(Lt, F, stress, self._convert_Lt_tag)` → material tangent dS/dE. UL: two-stage `dsde = sim.Lt_convert(..., self._convert_Lt_tag)` then `sim.Lt_convert(dsde, F, stress, "DSDE_2_Dsigma_LieDD")` — "the Lie (Truesdell) spatial tangent, which is the one consistent with the Cauchy-stress residual plus the standard initial-stress geometric term assembled here. Using the box (or box/J) directly leaves an O(sigma) inconsistency that destroys Newton convergence at large rotation (soft bending modes)."
- `corate` setter maps to strain functions and conversion tags, e.g. UL: `"log" → _comp_log_strain / "DsigmaDe_2_DSDE"`, `"log_r" → _comp_log_strain_R / "DsigmaDe_2_DSDE"`, `"gn"/"green_naghdi" → _comp_gn_strain / "DsigmaDe_GreenNaghdiDD_2_DSDE"`, `"jaumann" → _comp_jaumann_strain / "DsigmaDe_JaumannDD_2_DSDE"`, plus `"log_inc"`, `"log_r_inc"`.
- `corate` property docstring:
  - `"log_r" (default): exact logarithmic strain transported by the exact polar rotation increment (strain is recomputed at each iteration). This is the corate with an EXACT simcoon tangent transport, including across committed increments with plastic (or other rotated) history.`
  - `"log": exact logarithmic strain, XBM logarithmic spin transport (small tangent residual with rotated history)`
  - `"jaumann": Strain using the Jaumann derivative (strain is incremented)`
  - `"green_nagdhi" or "gn": Strain using the Green_Nagdhi derivative (strain is incremented)`
  - `if nlgeom is False, this property has no effect.`
- Strain functions call `sim.objective_rate("log"|"log_R"|"jaumann"|"green_naghdi", F0, F1, dtime, inc)` and `sim.Log_strain(F1, True, False)` (log strain recomputed each iteration for `log`/`log_r`).
- `geometric_stiffness` property docstring: "``None`` selects the consistent default: enabled for finite-strain tangent conversion and disabled otherwise. Set a boolean explicitly to override this behavior."
- `get_storage()`: dynamic analyses require material density — `raise ValueError("StressEquilibrium requires a material density for dynamic analysis, but material {material_name!r} has no density. Set it with material.set_density(rho), or attach inertia explicitly with weakform.set_inertia(density_or_weakform).")`
- `_check_F_validity(F1)`: rejects `det F <= 1e-12` with `InvalidKinematicStateError` ("trial state degenerates the kinematics ... Treated as a failed Newton iterate.") — degenerate trial states are failed steps (backtrack/dt cut), never assembled.

## 3. Near-incompressibility (`incompressibility` option)

Source: `Code_source_fedoo/fedoo/weakform/stress_equilibrium.py` — `incompressibility` property docstring (verbatim):

```
Method used to avoid volumetric locking.

Nearly incompressible materials lead to volumetric locking with the
standard displacement formulation. The available methods are:
    * None (default): standard displacement formulation.
    * "auto": use the most suitable method for each type of element
      (currently "mean_dilatation" where available). The standard
      formulation is kept with a warning for elements without any
      available method ("tri3", "tet4", ...).
    * "mean_dilatation": mean dilatation method (B-bar method based on
      a volume weighted projection of the dilatation). Equivalent to
      a mixed formulation with element-wise discontinuous pressure and
      dilatation that are eliminated at the element level: the problem
      only contains the displacement and the tangent matrix remains
      symmetric. One pressure value per element is used for "quad4",
      "hex8", "wed6", "tri6" and "tet10" elements, and a linear pressure
      for "quad8", "quad9", "hex20", "wed15" and "wed18" elements.
      The number of gauss points should be higher than the number of
      pressure values (no effect with reduced integration).
      Available in small strain and with the updated lagrangian
      method. The geometric_stiffness attribute should be set to True
      to get the consistent tangent matrix in finite strain.
    * "sri": legacy small-strain B-bar method where the dilatation is
      evaluated at the element center, for "quad4" and "hex8"
      elements only. Its use with updated-Lagrangian finite strains
      emits a warning because the formulation is not consistent.
    * "fbar": F-bar method where the volume change is evaluated at the
      element center. The consistent non symmetric tangent matrix is
      used for "quad4" and "hex8" elements (not available for '2Daxi'
      and with the total lagrangian method). In small strain, it
      reduces to a center-based B-bar volumetric correction.

This attribute should be defined before the creation of the associated
assembly. Elements with constant strain ("tri3", "tet4") or
reduced integration elements are not improved by these methods: see
:py:class:`fedoo.weakform.StressEquilibriumMixed` or
:py:class:`fedoo.weakform.StressEquilibriumRI`. Incompressibility
treatments are ignored with the plane-stress assumption.
```

- Setter validation: `raise ValueError("incompressibility should be None, 'auto', 'mean_dilatation', 'sri' or 'fbar'. Got {value!r}.")`
- Element substitution table (same file, verbatim):

```python
_MEAN_DILATATION_ELEMENTS = {elm: elm + "md" for elm in [
    "quad4", "quad8", "quad9", "tri6", "hex8", "hex20", "wed6", "wed15", "wed18", "tet10"]}
_INCOMPRESSIBILITY_ELEMENTS = {
    None: {},
    "fbar": {"quad4": "quad4sri", "hex8": "hex8sri"},
    "sri":  {"quad4": "quad4sri", "hex8": "hex8sri"},
    "mean_dilatation": _MEAN_DILATATION_ELEMENTS,
    "auto":  _MEAN_DILATATION_ELEMENTS,
}
```
  The setter installs `self.assembly_options["elm_type", elm_type] = new_elm_type` (so `Assembly` picks e.g. `quad4md`/`quad4sri`), and for `fbar` sets `assembly_options["assume_sym"] = False`.

- `_initialize_incompressibility(assembly, pb)`:
  - `2Dstress`: "Plane stress eliminates the out-of-plane stress through the constitutive reduction and does not use the 3D incompressibility treatments implemented here." → warning `incompressibility={method!r} is ignored with the '2Dstress' modeling space; the standard plane-stress formulation is used.`
  - `fbar` consistent tangent requires element-center interpolation + not-TL + not-2Daxi, else warning "the consistent F-bar tangent is unavailable because ... The F-bar kinematic correction is kept, but the standard tangent is used; convergence may be degraded."
  - `sri` + UL: warning "incompressibility='sri' is a legacy small-strain method. With updated-Lagrangian finite strains, it corrects the weak-form strain operator but not the deformation gradient passed to the constitutive law; ... Prefer 'mean_dilatation' or 'fbar'."
  - `auto` with no available method: warning "no method available for '{elm_type}' elements that are prone to volumetric locking. The standard displacement formulation is used. Consider quadratic elements or StressEquilibriumMixed."
  - mean dilatation not implemented for `2Daxi` or TL (`NotImplementedError`); requires `n_elm_gp > n_pvals`.
- `mean_dilatation` F construction (`_comp_F_mean_dilatation`): J is replaced by its per-element volume-weighted projection `theta`; `scale = theta / J`; `F1 *= scale ** (1/3)`; stores `assembly.sv["_MeanDilatation_scale"]`, `assembly.sv["Jbar"]`. Comment: "The assumed constitutive deformation gradient uses the 3D volumetric split also in plane strain. The physical kinematics still have F_zz=1; only the assumed F-bar/mean-dilatation tensor has a modified F_zz."
- B-bar weak equation (`_get_weak_equation_bbar`): "the normal strains are eps_bar[i] = eps[i] + correction/n for the real and virtual fields... Solid constitutive laws use a three-dimensional volumetric split, including with the plane-strain assumption. In 2D plane strain the physical eps_zz is zero, but the assumed B-bar strain receives one third of the volumetric correction in all three normal components." Pre-contracted tangent form `eps^T H eps + c (a.eps) + (b.eps) c + k c c`, `scale = theta/J`.
- F-bar (`_get_fbar_tangent_op`): "Non symmetric term of the F-bar tangent matrix, related to the variation of the volume change evaluated at the element center. ref: Design of simple low order finite elements for large strain analysis of nearly incompressible solids, de Souza Neto et al, IJSS." Correction = `(div _Disp) - (div Disp)`; in UL with initial stress `q = (col-sum of H)/3 - (1/3)*stress` ("the Lie (Truesdell) tangent: the initial stress stiffness is treated separately (geometric_stiffness), hence the 1/3 factor instead of the 2/3").
- Small-strain variants: `_comp_grad_disp_fbar` replaces volumetric strain by its element-centroid value; `_comp_grad_disp_mean_dilatation` replaces dilatation by its per-element projection (`correction = (projection - dvol)/n` added to each diagonal).

Source: `okf/concepts/incompressibility-methods.md`
- Signature (fedoo 1.0.1): `fd.weakform.StressEquilibrium(constitutivelaw, incompressibility=None, convert_tangent=True, name="", nlgeom=None, space=None)`
- Gotchas: "The attribute must be defined **before** creating the associated assembly."; "Elements with constant strain (`tri3`, `tet4`) or reduced integration elements are not improved by these methods — use `fd.weakform.StressEquilibriumMixed` or `fd.weakform.StressEquilibriumRI` instead."; "Incompressibility treatments are **ignored with the plane-stress assumption**."
- Verified: "`Exemples_fedoo/03-advanced/incompressibility_comparison.py` runs all four formulations (`None`, `"mean_dilatation"`, `"fbar"`, and `StressEquilibriumRI`) on a `quad4` Cook's membrane in plane strain with an `ElastoPlasticity` law (`nu = 0.499`, `nlgeom="UL"`). On fedoo 1.0.1 the mean-dilatation and F-bar methods agree to four significant figures and reach ≈ 2.29× the tip displacement of the untreated element."

Source: `Main_documentation_fedoo/problem.html` (§ "1. Handling Incompressibility", NonLinear documentation)
- "For nearly incompressible materials encountered in solid mechanics (Poisson's ratio ν ≈ 0.5), standard elements may suffer from **volumetric locking**. Fedoo offers the following solutions:"
- Element-level: `wf = fd.weakform.StressEquilibrium(material, incompressibility="auto")` — "These methods introduce no additional global unknowns."
- `"mean_dilatation"`: "recommended B-bar method... gives a symmetric tangent matrix and supports both low- and high-order elements... available for small strain and updated-Lagrangian analyses in `3D` and `2Dplane`. In finite strain, set `geometric_stiffness = True` to get the consistent tangent matrix."
- `"sri"`: "legacy low-order B-bar method... available for `quad4` and `hex8`. It is most appropriate for small-strain analyses... The total-Lagrangian formulation is not supported."
- `"fbar"`: "For `quad4` and `hex8` in `3D` or `2Dplane`, its consistent tangent matrix is nonsymmetric. ... Other elements, `2Daxi`, and total-Lagrangian analyses retain the F-bar kinematic correction but use the standard tangent, with a warning."
- "In plane stress (`2Dstress`), these options are ignored... They require full integration and do not improve constant-strain elements such as `tri3` and `tet4`; use quadratic elements or the mixed formulation instead. With one pressure value per `quad4` or `hex8` element, displacement results are generally accurate but the recovered pressure may exhibit checkerboard oscillations."
- Reduced integration: "Use the `fedoo.weakform.StressEquilibriumRI` weak form for one-point integration of `quad4` or `hex8` elements. It includes hourglass control..."
- Mixed (u,p): "use the `fedoo.weakform.StressEquilibriumMixed` weak form. The field interpolations must satisfy the **LBB conditions**... To define a different interpolation for the Pressure field, a `CombinedElement` must be defined:"

```python
import fedoo as fd
# Define a quadratic element with linear pressure (Taylor-Hood)
new_elm = fd.lib_elements.element_list.CombinedElement("quad8lbb", "quad8")
new_elm.set_variable_interpolation("Pressure", "quad4")
wf = fd.weakform.StressEquilibriumMixed(material, bulk_modulus=kappa)
assembly = fd.Assembly.create(wf, my_mesh, elm_type="quad8lbb")
```

## 4. Sibling weak forms for near-incompressibility

Source: `Code_source_fedoo/fedoo/weakform/stress_equilibrium_mixed.py`

```python
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
    name: str, optional
    nlgeom: bool, optional
    bulk_modulus: float, optional
        Bulk modulus used for scaling the pressure equation. If None, it
        is evaluated from the tangent matrix trace.
    convert_tangent: bool, default=True
    space: ModelingSpace, optional

    Attributes
    ----------
    symmetrized_matrix : bool
        Only used when nlgeom is False. If True, the deviatoric tangent is
        computed using the symmetric projection (P:H:P)...
    """
    def __init__(self, constitutivelaw, bulk_modulus=None, convert_tangent=True,
                 name="", nlgeom=None, space=None):
```
- Adds `self.space.new_variable("Pressure")`; finite strain: "Constitutive Law evaluated with F_bar. StressDev is directly the output of the constitutive law in update_2. H is the isochoric part of the tangent"; correction `H_dev[i][j] -= (2/3)*(sigma_dev[i] + sigma_dev[j])` ("derivative of J^(-1/3)").
- 2Daxi + TL: `NotImplementedError`.

Source: `Code_source_fedoo/fedoo/weakform/stress_equilibrium_ri.py`

```python
class StressEquilibriumRI(WeakFormSum):
    """Stress-equilibrium weak form with reduced integration.

    This weak form combines :class:`StressEquilibrium` with
    :class:`HourglassStiffness` to control the hourglass deformation modes
    associated with reduced integration.

    It should only be used with ``hex8`` or ``quad4`` elements. Unlike the
    standard :class:`StressEquilibrium` weak form, it uses one Gauss point by
    default and adds the hourglass stabilization proposed by Flanagan and
    Belytschko.

    Parameters
    ----------
    constitutivelaw : ConstitutiveLaw or str
    hourglass_stiffness : float, default=0.01
    convert_tangent : bool, default=True
    name : str, optional
    nlgeom : bool or {'UL', 'TL'}, optional
    nlgeom_hourglass : bool or {'UL', 'TL'}, default=False
        ... Keeping this false generally gives accurate results, including for
        finite-strain problems.
    space : ModelingSpace, optional

    Example
    -------
    >>> import fedoo as fd
    >>> fd.ModelingSpace("2Dstress")
    >>> material = fd.constitutivelaw.ElasticIsotrop(100e3, 0.3)
    >>> wf = fd.weakform.StressEquilibriumRI(material)
    """
```
- `HourglassStiffness` (Flanagan & Belytschko 1981): `self.assembly_options["n_elm_gp"] = 1`; `elm_type` mapped `quad4→quad4hourglass`, `hex8→hex8hourglass`; hourglass stiffness `= 1/ndim * stiffness_coef * pwave_modulus * coef`, p-wave modulus `= bulk + 4/3*shear` from tangent; "not implemented in '2Daxi'".
- `StressEquilibriumRI.corate` property forwards to `list_weakform[0].corate`.

## 5. Constitutive laws usable with `StressEquilibrium`

Source: `Code_source_fedoo/fedoo/constitutivelaw/elastic_isotrop.py`
```python
class ElasticIsotrop(ElasticAnisotropic):
    """A simple linear elastic isotropic constitutive law defined from a Yound
    Modulus and a Poisson Ratio.
    The constitutive Law should be associated with :mod:`fedoo.weakform.StressEquilibrium`
    Parameters
    ----------
    E: scalars or arrays of gauss point values.
    nu: scalars or arrays of gauss point values.
    """
    def __init__(self, E, nu, name=""):
```
- `get_tangent_matrix` returns 6x6 H; distinct `2Dstress` branch (`H[0,0]=E/(1-nu²)` etc.) vs plane strain/3D (`H1 = 2*mu+lamb`, `H2 = lamb`, `H3 = mu`).

Source: `Code_source_fedoo/fedoo/constitutivelaw/elasto_plasticity.py`
- `ElastoPlasticity(young_modulus, poisson_ratio, yield_stress, name="")`: "Elasto-plastic constitutive law with isotropic hardening... vectorized radial-return algorithm for the von Mises yield criterion."
- "In a geometrically nonlinear analysis, this law is a corotational extension of the same additive small-strain model written on the logarithmic strain... the Cauchy stress τ/J is handed to the assembly, so that the response is the one of Simcoon's ``EPICP`` UMAT."
- "This Python implementation is intended only for pedagogical use... For computational analyses, prefer :class:`fedoo.constitutivelaw.Simcoon`."
- `set_hardening_function("power", h=..., beta=...)` (used in incompressibility_comparison.py).

Source: `Code_source_fedoo/fedoo/constitutivelaw/simcoon_umat.py`
```python
class Simcoon(MechanicalUMAT):
    """Constitutive laws from the simcoon library.
    The constitutive Law should be associated with :mod:`fedoo.weakform.StressEquilibrium`
    Parameters
    ----------
    umat_name: str
    props: numpy.array
    tangent_mode : int, default=1
    name : str
    """
```
- Isotropic UMAT list includes `"ELISO", "EPICP", "NEOHC", "MOORI", "YEOHH", ...`
- "A modular material uses the `MODUL` UMAT. In finite strain it requires the `log_R` formulation; set `weakform.corate = "log_R"` before initializing the problem."
- Source: `Code_source_fedoo/fedoo/core/mechanical3d.py` — `MechanicalUMAT` docstring: umat callable signature `umat(strain, dstrain, F0, F1, stress, DR, props, statev_start, time, dtime, wm_start, temperature, *, ndi, tangent_mode)` returning `(stress, statev, wm, tangent)`; "In finite strain, the weak form owns and updates the deformation-gradient field. `MechanicalUMAT` consumes that field as `F0` and `F1`..."; `required_corate` attribute validated against `weakform.corate` at initialization; `tangent_from_F` (hyperelastic `_Lt_from_F`) means tangent acts on F (e.g. `Simcoon("NEOHC", [mu, kappa])`).

## 6. Examples — weak form + nlgeom + incompressibility

Source: `Exemples_fedoo/03-advanced/incompressibility_comparison.py` (complete script; key excerpts)

```python
fd.ModelingSpace("2Dplane")
POISSON_RATIO = 0.499
FORMULATIONS = {
    "Full integration": None,
    "Mean dilatation": "mean_dilatation",
    "F-bar": "fbar",
    "Reduced integration": "reduced_integration",
}

def cook_mesh(name):
    """Create a structured Cook membrane mesh by mapping a unit square."""
    mesh = fd.mesh.rectangle_mesh(
        nx=NX, ny=NY, x_min=0.0, x_max=1.0, y_min=0.0, y_max=1.0,
        elm_type="quad4", name=name,
    )
    xi = mesh.nodes[:, 0].copy(); eta = mesh.nodes[:, 1].copy()
    mesh.nodes[:, 0] = 48.0 * xi
    mesh.nodes[:, 1] = 44.0 * xi + (44.0 - 28.0 * xi) * eta
    return mesh

material = fd.constitutivelaw.ElastoPlasticity(YOUNG_MODULUS, POISSON_RATIO, YIELD_STRESS)
material.set_hardening_function("power", h=HARDENING_MODULUS, beta=HARDENING_EXPONENT)

if method == "reduced_integration":
    weakform = fd.weakform.StressEquilibriumRI(material, nlgeom="UL")
else:
    weakform = fd.weakform.StressEquilibrium(material, nlgeom="UL", incompressibility=method)

assembly = fd.Assembly.create(weakform, mesh, name=f"assembly_{key}")
problem = fd.problem.NonLinear(assembly)
problem.set_nr_criterion("Displacement", err0=1.0, tol=2e-4, max_subiter=25)
left = mesh.find_nodes("X", 0.0); right = mesh.find_nodes("X", 48.0)
problem.bc.add("Dirichlet", left, "Disp", 0.0)
problem.bc.add("Neumann", right, "DispY", TOTAL_SHEAR_FORCE * weights)
problem.nlsolve(dt=0.1, tmax=1.0, update_dt=True, dt_max=0.1, print_info=0, interval_output=0.1)
```
- Docstring: "The benchmark is Cook's membrane... Plane strain and ν=0.499 make the response nearly incompressible... Mean dilatation retains a symmetric tangent, whereas the consistent F-bar tangent is generally nonsymmetric."

Source: `Exemples_fedoo/03-advanced/neohookean_cantilever.py` (complete script; key excerpts)
```python
fd.ModelingSpace("3D")
E, nu = 60e6, 0.49
mu = E / (2 * (1 + nu)); kappa = E / (3 * (1 - 2 * nu))
material = fd.constitutivelaw.Simcoon("NEOHC", [mu, kappa], name="neohookean")
if mesh.elm_type == "hex8":
    wf = fd.weakform.StressEquilibriumRI(material, nlgeom="UL")   # avoids volumetric locking at nu = 0.49
else:
    wf = fd.weakform.StressEquilibrium(material, nlgeom="UL")     # hex20: full integration
assembly = fd.Assembly.create(wf, mesh, name="assembly")
pb = fd.problem.NonLinear(assembly)
pb.set_nr_criterion("Displacement", err0=1.0, tol=1e-3, max_subiter=20)
pb.bc.add(fd.constraint.RigidTie(top)); pb.bc.add("Dirichlet", bottom, "Disp", 0)
pb.bc.add("Dirichlet", "RigidDispX", U_CAP)
pb.nlsolve(dt=0.05, tmax=1.0, update_dt=True, print_info=1, interval_output=0.05)
```
- Neo-Hookean energy: `W = μ/2 (I1_bar - 3) + κ (J ln J - J + 1)`.

Source: `Exemples_fedoo/03-advanced/tube_compression.py`
```python
fd.ModelingSpace("2Daxi")
mesh = fd.mesh.rectangle_mesh(5, 240, 23, 25, 0, 180)  # tube geometry (r = X, z = Y)
props = np.array([E, nu, 1e-5, sigma_y, k, m])
material = fd.constitutivelaw.Simcoon("EPICP", props)
wf = fd.weakform.StressEquilibrium(material)
assembly = fd.Assembly.create(wf, mesh)
NLGEOM = "UL"
pb = fd.problem.NonLinear(assembly + contact, nlgeom=NLGEOM)
pb.set_nr_criterion("Displacement", tol=1e-2, max_subiter=20, adaptive_stiffness=True)
```
- "We define a non-linear problem including geometric nonlinearities using the Updated Lagrangian method (NLGEOM = 'UL'), which is the default in fedoo (equivalent to NLGEOM = True)."
- okf log fact: `okf/log.md` — "`StressEquilibrium(nlgeom="UL")`" used with Simcoon EPICP in multiple contact examples; "`material.corate` is a no-op (`corate` is a weakform attribute: `StressEquilibrium.corate`)".

## 7. 2D rectangular mesh — mesh builders

Source: `Code_source_fedoo/fedoo/mesh/simple.py`

```python
def rectangle_mesh(
    nx=11, ny=11, x_min=0, x_max=1, y_min=0, y_max=1,
    elm_type="quad4", ndim=None, name="",
):
    """
    Create a rectangular Mesh

    Parameters
    ----------
    nx, ny : int
        Numbers of nodes in the x and y axes (default = 11).
    x_min, x_max, y_min, y_max : int,float
        The boundary of the square (default : 0, 1, 0, 1).
    elm_type : {'tri3', 'quad4', 'quad8', 'quad9'}
        The type of the element generated (default='quad4')

        * 'tri3' -- 3 node linear triangular mesh
        * 'tri6' -- 6 node linear triangular mesh
        * 'quad4' -- 4 node quadrangular mesh
        * 'quad8' -- 8 node quadrangular mesh (à tester)
        * 'quad9' -- 9 node quadrangular mesh

    Returns
    -------
    Mesh
    See Also
    --------
    line_mesh, rectangle_mesh, box_mesh, grid_mesh_cylindric, line_mesh_cylindric
    """
```
- Implementation facts: nodes via `np.meshgrid(np.linspace(x_min,x_max,nx), np.linspace(y_min,y_max,ny))`; for `quad9`/`tri6`, `nx = int(nx // 2 * 2 + 1)`, same for `ny` (odd node counts required); `quad8` adds mid-side nodes (`nx*(ny-1)` extra); returns `Mesh(crd, elm, elm_type, node_sets, {}, ndim, name)` with:

```python
node_sets = {
    "bottom": [nd for nd in range(nx)],
    "top":    [nd for nd in range(N - nx, N)],
    "left":   [nd for nd in range(0, N, nx)],
    "right":  [nd for nd in range(nx - 1, N, nx)],
}
```
  (for `quad8` the sets additionally include the mid-side boundary nodes).
- `box_mesh(nx=11, ny=11, nz=11, x_min=0, x_max=1, y_min=0, y_max=1, z_min=0, z_max=1, elm_type="hex8", name="")` — 3D counterpart ("Create the mesh of a box"; elm_type `'hex8'` or `'hex20'`).
- `stack(mesh1, mesh2, name="")`: "Make the spatial stack of two mesh objects which have the same element shape. This function doesn't merge coindicent Nodes. For that purpose, use the Mesh methods 'find_coincident_nodes' and 'merge_nodes'."

Source: `Code_source_fedoo/fedoo/mesh/__init__.py` — module docstring lists all builders:
- "Mesh Creation Functions: rectangle_mesh, box_mesh, disk_mesh, hole_plate_mesh, hollow_disk_mesh, I_shape_mesh, line_mesh_1D, line_mesh, line_mesh_cylindric, circle_mesh, grid_mesh_cylindric, generate_cylindrical_local_frame, structured_mesh_2D, generate_nodes"
- "Mesh manipulation functions: stack, extrude, thicken, extract_surface, extract_edges, change_elm_type, quad2tri"; "Import/Export: import_file, import_msh, import_vtk".

Source: `Code_source_fedoo/fedoo/mesh/structured_mesh.py`
```python
def structured_mesh_2D(data, edge1, edge2, edge3, edge4, elm_type="quad4", method=0, ndim=None, name=""):
    """Create a 2D structured grid from 4 edges.
    ...
    elm_type: {'quad4', 'quad9', 'tri3', 'tri6'}, default = 'quad4'
    method: int, default = 0
        - if method == 0: intesection of lines drawn between nodes of oposite edges.
        ...
    """
```

Source: `Code_source_fedoo/fedoo/core/mesh.py` — `Mesh` constructor:

```python
class Mesh(MeshBase):
    """Fedoo Mesh object.
    ...
    Parameters
    ----------
    nodes: numpy array of float
        List of nodes coordinates. nodes[i] is the coordinate of the ith node.
    elements: numpy array of int
        Elements table. elements[i] define the nodes associated to the ith element.
    elm_type: str
        Type of the element. The type of the element should be coherent with the shape of elements.
    ndim: int, optional: Dimension of the mesh. By default, ndim is deduced from the nodes coordinates
    name: str, optional
    register_name: bool, default=True
        If True and ``name`` is non-empty, the mesh is registered in the global mesh dictionary under ``name``.

    Example
    --------
    >>> nodes = np.array([[0,0],[1,0],[1,1],[0,1]])
    >>> elm = np.array([0,1,2,3])
    >>> mesh = fd.Mesh(nodes, elm, 'quad4', ndim = 3, name = 'unit square mesh')
    """
    def __init__(self, nodes, elements=None, elm_type=None, node_sets=None,
                 element_sets=None, ndim=None, name="", register_name=True):
```
- `find_nodes(selection_criterion, value=0, tol=1e-6, name=None)`: criteria `'X'/'Y'/'Z'`, `'XY'/'XZ'/'YZ'`, `'Point'`, `'Distance'`, or arbitrary expression (e.g. `mesh.find_nodes("(X**2>0.2 and X<0.5) or abs(Y)>0.4")`); `name` stores the result in `mesh.node_sets`.

Source: `Code_source_fedoo/fedoo/core/modelingspace.py` — `ModelingSpace` docstring:
- `dimension: str in ['2D', '3D', '2Dplane' or '2Dstress']`:
  - `'2D' or '2Dplane'`: general 2D problems, with default coordinates 'X' and 'Y' and **plane strain assumption**
  - `'3D'`: 3D problems with coordinates 'X', 'Y', 'Z'
  - `'2Dstress'`: same as '2D' but **plane stress** assumption
  - `'2Daxi'`: same as '2D' but **axisymmetric** assumption
- Example: `fd.ModelingSpace('2Dstress')`.

## 8. Standard workflow (assembly, problem, BC, solve)

Source: `Documentation_technique/Quick_Start.rst`
1. `import fedoo as fd`
2. "Define the space dimension" — `fd.ModelingSpace("3D")` (or `2D`/`2Dstress`)
3. "Create and/or import the geometry (mesh)" — e.g. `my_mesh = fd.mesh.box_mesh(nx=31, ny=21, nz=21, x_min=0, x_max=1000, y_min=0, y_max=100, z_min=0, z_max=100, elm_type = 'hex8')`; import via `fd.Mesh.read` / `fd.Mesh.from_pyvista` / `fd.mesh.import_file`
4. "Create weak formulations" — `material = fd.constitutivelaw.ElasticIsotrop(200e3, 0.3); my_weakform = fd.weakform.StressEquilibrium(material)`
5. `my_assembly = fd.Assembly.create(my_weakform, my_mesh)`
6. `pb = fd.problem.Linear("MyAssembly")`; `pb.set_solver('cg')`
7. BC: "The boundaries are automatically stored as set of nodes ('left', 'right', 'top', 'bottom', ...) when the function Mesh.BoxMesh is used."; `nodes_left = Mesh['Domain'].find_nodes('X', mesh.bounding_box.xmin, tol=1e-10)`; `pb.bc.add('Dirichlet', nodes_left, 'Disp', 0)`; `pb.bc.add('Dirichlet', nodes_right, 'DispY', -10)`
8. `pb.solve()`

Source: `Code_source_fedoo/fedoo/core/assembly.py`
- `Assembly(weakform, mesh="", elm_type="", name="", **kargs)`: "elm_type: Type of the element used for the field interpolation. This element may be different that the one used for the geometrical interpolation defined in mesh.elm_type."; `elm_type` resolved from `weakform.assembly_options.get("elm_type", mesh.elm_type, mesh.elm_type)` — this is how `incompressibility` element substitutions (`quad4md`, `quad4sri`) and `n_elm_gp` overrides take effect.
- `Assembly.create(weakform, mesh="", elm_type="", name="", **kargs)` factory (handles WeakFormSum/AssemblySum).

Source: `Code_source_fedoo/fedoo/weakform/__init__.py` — module docstring: "In fedoo, the differential equations related to the problem to solve are written using weak formulations... When created, a WeakForm object doesn't in general know the domain of integration. The domain of integration is defined using a Mesh, and is only introduced when creating the corresponding Assembly." Class list: `StressEquilibrium, ImplicitDynamic, StressEquilibriumRI, StressEquilibriumMixed, HeatEquation, BeamEquilibrium, SpringEquilibrium, PlateEquilibrium, ..., Inertia, RotaryInertia, InterfaceForce, DistributedLoad, ExternalPressure, HourglassStiffness, ArtificialDamping`.

Source: `Code_source_fedoo/fedoo/problem/non_linear.py` — `nlsolve(dt=0.1, update_dt=True, tmax=None, t0=None, dt_min=1e-6, max_subiter=None, dt_increase_niter=None, tol_nr=None, print_info=None, save_at_exact_time=None, interval_output=None, callback=None, exec_callback_at_each_iter=None, dt_max=None)`; "The time increment is multiplied by 1.25 if the Newton–Raphson loop converges in at most dt_increase_niter iterations" (default `max_subiter // 3`).

Source: `Main_documentation_fedoo/problem.html` (NonLinear docs)
- Convergence criteria via `set_nr_criterion`: **Force** (default), **Displacement** ("norm of the displacement increment relative to the initial increment of the step"), **Work**; `tol` default 5e-3; `max_subiter` default 16; `dt` default 0.1, `update_dt` shrinks by 0.25× / expands by 1.25×.
- Stabilization menu: `ArtificialDamping` (`wf = fd.weakform.StressEquilibrium(material); wf += fd.weakform.ArtificialDamping(c_stab=0.05, energy_fraction=True)`), line search (`NonLinear.add_line_search()`), `adaptive_stiffness` (K = (1-ξ)K_T + ξ K_E).

## 9. Additional verified facts (okf knowledge bundle)

Source: `okf/index.md`
- "[StressEquilibrium geometric nonlinearity](/concepts/stress-equilibrium-nlgeom.md)" and "[Incompressibility methods](/concepts/incompressibility-methods.md) — the `incompressibility` option of `StressEquilibrium`".

Source: `okf/log.md`
- "`set_nr_criterion` DEFAULT is 'Force' in 1.0.1 ... Force criterion FAILS for kinematically-driven problems ... use 'Displacement'" (durable fact from verified runs).
- Contact/finite-strain recipes all use `StressEquilibrium(nlgeom="UL")` with Simcoon EPICP and quad4 meshes built from `hole_plate_mesh`/`rectangle_mesh`.

Source: `Code_source_fedoo/CHANGELOG.md` (v1.0.0 entry)
- "**`incompressibility` attribute of `StressEquilibrium`** (also a constructor argument) to select the treatment of volumetric locking: `None` (default, unchanged behavior), `"auto"`, `"mean_dilatation"`, `"sri"` or `"fbar"`."
- "Removed the dedicated `StressEquilibriumBbar` and `StressEquilibriumFbar` weak forms. Use `StressEquilibrium(..., incompressibility="sri")` and `StressEquilibrium(..., incompressibility="fbar")`, respectively."
- "`StressEquilibrium.geometric_stiffness` now defaults to `None`, meaning [the consistent finite-strain default]."

## 10. Usage examples with `rectangle_mesh` (corpus-wide)

- `Exemples_fedoo/03-advanced/incompressibility_comparison.py`: `fd.mesh.rectangle_mesh(nx=NX, ny=NY, x_min=0.0, x_max=1.0, y_min=0.0, y_max=1.0, elm_type="quad4", name=name)` then affine mapping of `mesh.nodes` to Cook's membrane.
- `Exemples_fedoo/03-advanced/tube_compression.py`: `fd.mesh.rectangle_mesh(5, 240, 23, 25, 0, 180)` in `fd.ModelingSpace("2Daxi")` (r=X, z=Y).
- `Exemples_fedoo/01-simple/lattice_beam.py`: `fd.mesh.rectangle_mesh(n, n, x_max=100, y_max=100, ndim=ndim)`.
- `Exemples_fedoo/01-simple/modal_analysis.py`: `fd.mesh.rectangle_mesh(...)`.
- `Exemples_fedoo/02-constraints/disk_rectangle_contact.py` / `contact/penalty/disk_rectangle.py` / `contact/comparison/disk_rectangle.py`: `mesh_rect = fd.mesh.rectangle_mesh(...)` + disk + `fd.mesh.stack`.
- `Exemples_fedoo/plasticity/2DplasticBending.py`: `mesh = fd.mesh.rectangle_mesh(...)`.
- `Exemples_fedoo/models/axisymmetric/thick_cylinder_inflation_axi.py`: `fd.mesh.rectangle_mesh(nx=21, ny=11, x_min=A, x_max=B, y_min=0.0, y_max=H)`.
- `Exemples_fedoo/contact/benchmark/westergaard_sinusoidal.py`: `fd.mesh.rectangle_mesh(...)` for block + plate meshes.
- `Exemples_fedoo/01-simple/simple_mesh_generation.py`: structured generators gallery (`hole_plate_mesh`, `hollow_disk_mesh`, `disk_mesh` + `extrude`, `line_mesh` + `circle_mesh` + `generate_cylindrical_local_frame` + `extrude(profile, path, local_frame=...)`, `thicken`, `I_shape_mesh`), plus `mesh.to_pyvista()` plotting.