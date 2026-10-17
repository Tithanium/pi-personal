Now I'll compose the complete final answer (≤ 15 KB), with file:line citations throughout.

# What is the `StressEquilibrium` weak form for, and what does the `nlgeom` parameter do?

## 1. `fd.weakform.StressEquilibrium` — purpose

`StressEquilibrium` is **the mechanical equilibrium weak form for solids** (fedoo's default solid-mechanics weak form). It is used for:

- **3D solid mechanics** and **2D plane-stress / plane-strain** assumptions
  - `stress_equilibrium.py:18` — "This weak form can be used for solid in 3D or using a 2D plane assumption (plane strain or plane stress)."
  - `Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibrium.html:150` — "Mechanical equilibrium equation for solids."
- **Including initial stress** for nonlinear problems (or if defined in the assembly) — `stress_equilibrium.py:22`.
- **Accepting geometric nonlinearities** when the `simcoon` library is installed — `stress_equilibrium.py:24`.
- **Avoiding volumetric locking** for nearly-incompressible materials via the sibling `incompressibility` attribute — `stress_equilibrium.py:29`.
- **Automatic consistent geometric stiffness** for finite-strain tangent conversion, overridable via `geometric_stiffness` — `stress_equilibrium.py:31`.

Canonical constructor (fedoo 1.0.1, `Code_source_fedoo/fedoo/weakform/stress_equilibrium.py`):

```python
fd.weakform.StressEquilibrium(
    constitutivelaw, incompressibility=None, convert_tangent=True,
    name="", nlgeom=None, space=None)
```

`convert_tangent` (default `True`) converts the corotational Kirchhoff tangent returned by the constitutive law into the formulation tangent — `dS/dE` for `TL`, spatial Lie for `UL` (`stress_equilibrium.py:46`).

The weak form builds the **linearised internal-force residual** by reading the current state from the assembly:

- **TL branch** (`assembly._nlgeom == "TL"`): `eps = op_strain(DispGradient)` and `initial_stress = sv["PK2"]` (second Piola–Kirchhoff, including initial-displacement effect).
- **UL / linear branch**: `eps = op_strain()` and `initial_stress = sv["Stress"]` (Cauchy for the UL method).

See `stress_equilibrium.py:140-150` and the okf concept `okf/concepts/stress-equilibrium-nlgeom.md:15-17`.

## 2. `nlgeom` — what it does

The `nlgeom` argument controls the **kinematic formulation** (small-strain vs. finite-strain) of the solid equilibrium problem. Per the source docstring (`stress_equilibrium.py:51-61`) and the attribute docstring (`stress_equilibrium.py:99-104`):

| Value | Behaviour |
|---|---|
| `nlgeom=None` (default) | **Small-displacement / linear kinematics**. Falls back to `pb.nlgeom` (problem-level) — see §3. |
| `nlgeom=False` | Explicitly disable geometric nonlinearities (same as `None` but without the problem-level fallback). |
| `nlgeom=True` | Activate geometric nonlinearities using the **updated Lagrangian (UL)** method. Equivalent to `nlgeom="UL"`. |
| `nlgeom="UL"` | **Updated Lagrangian** (mesh is updated between increments; Cauchy stress is the state variable). |
| `nlgeom="TL"` | **Total Lagrangian** (reference is the initial mesh, with initial-displacement effect; `PK2` stress is the state variable). |

The **only accepted values are `{True, 'UL', 'TL'}`** (a boolean `False` is also accepted to explicitly disable). Enforced by `WeakFormBase._initialize_nlgeom` (`fedoo/core/weakform.py:113-128`): a bool is mapped to `"UL"` or `False`; a string is upper-cased and validated against `{"UL", "TL"}`; otherwise it raises `ValueError("nlgeom should be in {'TL', 'UL', True, False}")`.

### Key properties of `nlgeom`

- **Only meaningful inside a nonlinear problem** (`fd.problem.NonLinear`, `fd.problem.NonLinearNewmark`). It has no effect on a linear problem. — `okf/concepts/stress-equilibrium-nlgeom.md:42-44`, `stress_equilibrium.py:51-57`.
- **Requires the external `simcoon` library** to be installed. — `okf/concepts/stress-equilibrium-nlgeom.md:46`, `stress_equilibrium.py:24`.
- **When active, the initial displacement is also considered** and several **corotational formulations** can be selected via the **`corate` weak-form attribute** (default `"log_r"` — logarithmic strain with exact polar frame; alternatives: `"log"`, `"jaumann"`, `"green_naghdi"`, `"gn"`, `"log_inc"`, `"log_r_inc"`). Note: `corate` is a **weak-form attribute** (`StressEquilibrium.corate`), not a constitutive-law attribute; setting `corate` on the material is a **no-op** in 1.0.1. — `okf/concepts/stress-equilibrium-nlgeom.md:48-54`, `okf/log.md:382`.
- **Consistent geometric stiffness is enabled automatically** for finite-strain tangent conversion; set `geometric_stiffness` explicitly to override. — `okf/concepts/stress-equilibrium-nlgeom.md:55-56`, `stress_equilibrium.py:150-165`.

## 3. `nlgeom` — fallback rule (weak form vs. problem)

`WeakFormBase._initialize_nlgeom` (`fedoo/core/weakform.py:113-128`) implements:

```python
def _initialize_nlgeom(self, assembly, pb):
    if self.nlgeom is None:
        nlgeom = pb.nlgeom          # FALLBACK to problem-level
    else:
        nlgeom = self.nlgeom
    if isinstance(nlgeom, bool):
        assembly._nlgeom = "UL" if nlgeom else False
    else:
        if isinstance(nlgeom, str):
            assembly._nlgeom = nlgeom.upper()
            if assembly._nlgeom in ["UL", "TL"]:
                return
    raise ValueError("nlgeom should be in {'TL', 'UL', True, False}")
```

So:

- **If the weak form sets `nlgeom` explicitly** (`True`, `False`, `"UL"`, `"TL"`), **that value wins**.
- **If the weak form leaves `nlgeom=None`**, it **reads `problem.nlgeom`** (the `NonLinear(assembly, nlgeom=...)` argument, default `False`).

This is stated in `okf/concepts/nonlinear-problem.md:33-37`: "a weak form whose own `nlgeom` is `None` takes its setting from `problem.nlgeom` … A weak form that sets `nlgeom` explicitly keeps that value." And `okf/concepts/stress-equilibrium-nlgeom.md:42-44`.

## 4. Verified examples (corpus)

The corpus contains a broad set of working examples demonstrating the API. Highlights:

- **`Exemples_fedoo/01-simple/simple_cantilever_beam_3D_model_nlgeom.py:31`** — `fd.ModelingSpace("3D")`, `ElasticIsotrop(200e3, 0.3)`, `wf = fd.weakform.StressEquilibrium("ElasticLaw", nlgeom=True)`, `pb = fd.problem.NonLinear("Assembling")`, `pb.nlsolve(dt=0.2)`. PASS on fedoo 1.0.1, 5 adaptive steps, imposed `DispY=-500` mm. Validated run: `okf/log.md:1118-1123`.
- **`Exemples_fedoo/plasticity/2DplasticBending.py:47-48`** — `NLGEOM=True`, `Simcoon("EPICP", [E, nu, alpha, Re, k, m])`, `wf = fd.weakform.StressEquilibrium("ConstitutiveLaw", nlgeom=NLGEOM)`, `pb = fd.problem.NonLinear("Assembling")`, `pb.nlsolve(dt=0.05, tmax=1, ...)`. PASS. Also shows the commented RI variant: `StressEquilibriumRI("ConstitutiveLaw", 0.005, nlgeom=NLGEOM)` (reduced-integration quad4 + hourglass).
- **`Exemples_fedoo/plasticity/{torsion_test,rotation_test,shear_test,plastic_bending_3D}.py`** — all use `StressEquilibrium(..., nlgeom=NLGEOM)`; `shear_test` and `plastic_bending_3D` additionally set `incompressibility="fbar"`.
- **`Exemples_fedoo/plasticity/2DplasticBending_from_scratch.py:40`** — linear-kinematic variant: `StressEquilibrium("ConstitutiveLaw", nlgeom=False)`.
- **Contact examples** — `Exemples_fedoo/contact/**/self_contact.py` (penalty, IPC, OGC, comparison) and `disk_rectangle.py`, `ring_crush.py`, `gyroid_selfcontact.py`, `punch_indentation.py`, `tube_compression_ipc.py` all build `StressEquilibrium(material, nlgeom="UL")` + `fd.problem.NonLinear(assembly)`. `contact/ipc/tube_compression_ipc.py:33,46` sets `nlgeom=NLGEOM` on **both** the weak form and the problem (consistent).
- **Dynamic** — `Exemples_fedoo/dynamique/multi_mesh_dynamic_contact.py:96` uses `StressEquilibrium(material, nlgeom=True)` with `NonLinearNewmark`.
- **Poromechanics** — `Exemples_fedoo/poromechanics/terzaghi_1d.py:61` uses `PoroMechanicsSimple(..., nlgeom=False, ...)`.
- **Guided documentation** — `Documentation_technique/boundary_conditions.rst:464,549,584` shows three variants: `StressEquilibrium(material, nlgeom=True)` (penalty contact), `StressEquilibrium(material, nlgeom=True)` (IPC contact), and `StressEquilibrium(material, nlgeom="UL")` (IPC self-contact). Line 131 also shows `fd.constraint.Pressure(surface_mesh, value, nlgeom=True)` paired with `fd.problem.NonLinear(solid_assembly, nlgeom=True)`.

## 5. TL;DR

- **`StressEquilibrium`** is fedoo's solid-mechanics weak form for 3D / 2D plane stress / 2D plane strain, handling initial stress, optional geometric nonlinearity (UL or TL), optional volumetric-locking treatment (`incompressibility`), and optional finite-strain tangent conversion (`convert_tangent`).
- **`nlgeom`** selects the kinematics: `None`/`False` → small-strain (linear kinematics); `True`/`"UL"` → updated Lagrangian; `"TL"` → total Lagrangian. It is only active inside `fd.problem.NonLinear` / `NonLinearNewmark`, requires `simcoon`, and (when active) the initial displacement enters the formulation and the `corate` attribute chooses the corotational strain measure. If left as `None`, the value is taken from `problem.nlgeom`; if set explicitly, it overrides the problem.

Key sources:
- `Code_source_fedoo/fedoo/weakform/stress_equilibrium.py:15-104,140-165`
- `Code_source_fedoo/fedoo/core/weakform.py:113-128`
- `okf/concepts/stress-equilibrium-nlgeom.md`
- `okf/concepts/nonlinear-problem.md:33-37,108-111`
- `Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibrium.html:150,163,233,236,310`
- `Documentation_technique/boundary_conditions.rst:131,464,549,584`
- `Exemples_fedoo/01-simple/simple_cantilever_beam_3D_model_nlgeom.py:31`, `Exemples_fedoo/plasticity/2DplasticBending.py:47-48,120`, and the contact/plasticity/dynamic/poromechanics examples listed above.