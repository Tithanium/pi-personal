All facts are verified against the files I read. Final answer:

# Creating a ModelingSpace in fedoo (2D and 3D)

A `ModelingSpace` is the first object you create in almost every fedoo script: it is the space in which coordinates and variables (fields) are defined, and every weak form / assembly is associated with the *active* space. It is created as `fd.ModelingSpace(dimension, name="Main")` (`Code_source_fedoo/fedoo/core/modelingspace.py:9`).

## 1. Valid dimensions

| Argument | Meaning | Default coordinates |
|---|---|---|
| `"3D"` | 3D problem | `X`, `Y`, `Z` |
| `"2D"` / `"2Dplane"` | General 2D problem, **plane strain** assumption for mechanical problems | `X`, `Y` |
| `"2Dstress"` | Same as 2D but **plane stress** assumption | `X`, `Y` |
| `"2Daxi"` | Same as 2D but **axisymmetric** assumption (r = X, z = Y) | `X`, `Y` |

- The constructor asserts `dimension` is a string among `'2D'`, `'3D'`, `'2Dplane'`, `'2Dstress'`, `'2Daxi'` and **maps `"2D"` to `"2Dplane"` internally** — so `"2D"` and `"2Dplane"` are identical (`modelingspace.py:16-43`).
- The Quick Start summary mentions only `'3D'`, `'2D'` and `'2Dstress'`; the class docstring is the authoritative list (adds `2Dplane`/`2Daxi`) (`Documentation_technique/Quick_Start.rst:32-37`, `modelingspace.py:16-21`).
- A 2D space gets `ndim = 2`; only `"3D"` adds the `Z` coordinate (`modelingspace.py:69-73`).

## 2. Minimal usage

**3D** (e.g. `Exemples_fedoo/01-simple/simple_cantilever_beam_3D_model.py:26`):
```python
import fedoo as fd
fd.ModelingSpace("3D")
# ... mesh, material, weakform, assembly, problem ...
```

**2D plane strain / generic** (e.g. `Exemples_fedoo/01-simple/poison_eq.py:13`):
```python
space = fd.ModelingSpace("2D")     # == "2Dplane"
U = space.new_variable("U")
dU_dX = space.derivative("U", "X")
dU_dY = space.derivative("U", "Y")
wf = fd.WeakForm(dU_dX.virtual * dU_dX + dU_dY.virtual * dU_dY)
```
A 2D space includes the coordinates `X` and `Y` by default.

**2D plane stress** (e.g. `Exemples_fedoo/01-simple/Plate_with_hole_in_tension.py:12`):
```python
fd.ModelingSpace("2Dstress")   # 2D problem with plane stress assumption
```

**2D axisymmetric** (e.g. `Exemples_fedoo/models/axisymmetric/thick_cylinder_inflation_axi.py:31`):
```python
fd.ModelingSpace("2Daxi")
```

The order of statements (mesh before or after the space) does not matter in the examples; what matters is that the active space is set before building the weak form/assembly.

## 3. Multiple named spaces and the active space

- Each new space becomes the **active** one and is stored in a registry under its `name` (default `"Main"`) (`modelingspace.py:50-52`).
- Access a registered space with `fd.ModelingSpace["Main"]` (`__class_getitem__`, `modelingspace.py:124`), or switch with `space.make_active()` / `fd.ModelingSpace.set_active(name)` / `fd.ModelingSpace.get_active()` (which asserts a space exists: *"You must define a ModelingSpace for your problem."*, `modelingspace.py:94-115`).
- Real multi-space example, FE2 two-scale simulation (`Exemples_fedoo/FE2/FE2.py:6-7`):
  ```python
  fd.ModelingSpace("2Dplane", "macro_space")
  fd.ModelingSpace("3D", "micro_space")
  ```
- Useful queries: `ndim` (int 2/3), `get_dimension()` (normalized string), `is_axisymmetric` (True for `2Daxi`), `ncrd`, `new_coordinate(name)`, `new_variable(name)`, `new_vector(name, list_variables)`, `derivative(u, x=0, ordre=1, decentrement=0, vir=0)` (`modelingspace.py:78-90, 123, 135-167, 230`).

## 4. Which variant to pick

- **3D problems**: `"3D"` — used by the 3D cantilever (`simple_cantilever_beam_3D_model.py:26`), torsion (`plasticity/torsion_test.py:7`), gyroid contact (`boundary_conditions.rst:575`), shell/plate models (`spherical_shell_compression.py:36`, which comments that plate elements need a 3D space).
- **2D plane problems**:
  - `"2D"`/`"2Dplane"` → plane strain (default) — e.g. pressurized pipe, commented `# plane strain assumption` (`02-constraints/pressurized_pipe.py:18`), 2D plastic bending (`plasticity/2DplasticBending.py:9`), custom Poisson/user weak forms (`user_problems.rst:37`).
  - `"2Dstress"` → plane stress — e.g. plate with hole in tension (`Plate_with_hole_in_tension.py:12`), heterogeneous plate (`heterogeneous.rst:164`), Broberg2D (`dynamique/Broberg2D_Dynamic.py:40`). Note: in `2Dstress` the constitutive law may compute a nonzero out-of-plane ε_zz from σ_zz = 0, so post-processed strain slot 2 can be nonzero (`modelingspace.py:305-310`).
  - `"2Daxi"` → axisymmetric, coordinates r = X, z = Y — e.g. Hertz benchmark (`contact/benchmark/hertz_axisymmetric.py:79`), tube compression (`03-advanced/tube_compression.py:19`). In 2Daxi results, `"YY"` is the hoop component and `"XX"` the radial one (`okf/examples/tube-compression.md:118`); radial coordinates must be non-negative (`Code_source_fedoo/fedoo/weakform/stress_equilibrium.py:383`).
- The dimension string only *declares* the space; the mesh you build (`rectangle_mesh`, `box_mesh`, …) and the weak form must be consistent with it (2D meshes + 2D space, 3D hex meshes + `"3D"`), e.g. `lattice_beam.py:16-18` and `homogenization/periodic_homogenization.py:12-14` switch space and mesh builder together.

The facts array (50 grounded facts) has been written to `C:\Users\connessn\.pi\agent\extensions\pi-local-rag\tests\ab2\reference-D\fedoo_modelingspace\facts.json`.