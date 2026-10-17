## Building a rectangular mesh in fedoo

The function is **`fedoo.mesh.rectangle_mesh`**. The exact call (verified signature, fedoo 1.0.1):

```python
import fedoo as fd

fd.ModelingSpace("2D")   # e.g. "2D", "2Dstress", "2DStrain", "3D"

mesh = fd.mesh.rectangle_mesh(
    nx=11,        # number of NODES in x (default 11)
    ny=11,        # number of NODES in y (default 11)
    x_min=0,      # left   x-boundary (default 0)
    x_max=1,      # right  x-boundary (default 1)
    y_min=0,      # bottom y-boundary (default 0)
    y_max=1,      # top    y-boundary (default 1)
    elm_type="quad4",  # 'tri3' | 'quad4' | 'quad8' | 'quad9' (default 'quad4')
    ndim=None,    # 2 for plane problems, 3 for 3D (default None)
    name="",      # mesh name
)
```

This returns a `fedoo.Mesh` object (`Mesh(crd, elm, elm_type, node_sets, {}, ndim, name)`).

### Minimal usage
All arguments are optional, so the simplest call is:

```python
mesh = fd.mesh.rectangle_mesh()   # 11×11 nodes, unit square [0,1]², quad4
```

This is exactly what the fedoo docs show (`Code_source_fedoo/fedoo/post_processing/__init__.py:159`, `Code_source_fedoo/docs/user_problems.rst:46`, `Exemples_fedoo/01-simple/poison_eq.py:30`).

### Key points
- **`nx`/`ny` are node counts, not element counts** (source docstring: "Numbers of nodes in the x and y axes (default = 11)", `simple.py:41`). So `nx=11, ny=11` → 121 nodes / 100 elements. Verified: `rectangle_mesh(5, 240, 23, 25, 0, 180)` → 1200 nodes / 956 quad4 (`okf/documentation/mesh.md:125`).
- The mesh spans `[x_min, x_max] × [y_min, y_max]` (`simple.py:70`).
- It automatically creates node sets **`'left'`, `'right'`, `'bottom'`, `'top'`** for the four sides, which you use directly in BCs, e.g. `pb.bc.add("Dirichlet", "left", "U", 0)` / `pb.bc.add("Dirichlet", "right", "U", 1)` (`simple.py:176`, `user_problems.rst:50`).
- **Element types**: `'quad4'` (default, 4-node quad), `'tri3'` (3-node triangle), `'quad8'`, `'quad9'` (`simple.py:44`). Triangular example: `fd.mesh.rectangle_mesh(nx=51, ny=51, elm_type="tri3")` (`Exemples_fedoo/adaptive/hessian_recovery.py:20`).
- **3D problems**: pass `ndim=3`, e.g. `fd.mesh.rectangle_mesh(nx=15, ny=15, x_min=0.0, x_max=length, y_min=0.0, y_max=length, elm_type="quad4", ndim=3)` (`Exemples_fedoo/01-simple/modal_analysis.py:36`; also `Code_source_fedoo/tests/test_elasto_plasticity.py:38`).
- **Positional arguments also work** (order: `nx, ny, x_min, x_max, y_min, y_max, elm_type, ndim, name`), e.g. `fd.mesh.rectangle_mesh(5, 240, 23, 25, 0, 180)` (`Exemples_fedoo/contact/ipc/tube_compression_ipc.py:22`).

### Worked example (keyword form, from the docs)
```python
fd.ModelingSpace("2D")
mesh_rect = fd.mesh.rectangle_mesh(nx=11, ny=21,
                                   x_min=0, x_max=1, y_min=0, y_max=1,
                                   elm_type='quad4', name='Domain')
```
(`Code_source_fedoo/docs/boundary_conditions.rst:427`; same pattern in `Exemples_fedoo/02-constraints/disk_rectangle_contact.py:26` and `Exemples_fedoo/plasticity/2DplasticBending.py:22`.)

### Sources
- Signature & semantics (source): `Code_source_fedoo/fedoo/mesh/simple.py:24-50`, node sets at `:176`, return at `:200`
- Official API reference: `Main_documentation_fedoo/generated/fedoo.mesh.rectangle_mesh.html:131`
- Mesh guide: `Main_documentation_fedoo/mesh.html:203`; `okf/documentation/mesh.md:42`
- Examples: `01-simple/poison_eq.py:30`, `02-constraints/rigid_tie.py:18`, `01-simple/modal_analysis.py:36`, `plasticity/2DplasticBending.py:22`, `02-constraints/disk_rectangle_contact.py:26`, `contact/ipc/tube_compression_ipc.py:22`, `adaptive/hessian_recovery.py:20`, `01-simple/lattice_beam.py:26`, `contact/benchmark/hertz_axisymmetric.py:82`

Facts array (26 facts) written to `tests\ab2\reference-D\fedoo_rectangle_mesh\facts.json`.