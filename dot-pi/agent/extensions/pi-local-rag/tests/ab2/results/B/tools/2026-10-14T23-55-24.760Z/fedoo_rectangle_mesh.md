<rag-context>
[pi-local-rag] RAG subagent: 4 sources, 43915 ms retrieval.
# Building a rectangular mesh in fedoo

To build a rectangular mesh, use `fedoo.mesh.rectangle_mesh`, listed under **Mesh Creation Functions** in the `fedoo.mesh` module.

```python
from fedoo import rectangle_mesh
```

## Function signature (exact source)

```python
def rectangle_mesh(
    nx=11,
    ny=11,
    x_min=0,
    x_max=1,
    y_min=0,
    y_max=1,
    elm_type="quad4",
    ndim=None,
    name="",
```

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py — `rectangle_mesh` signature (lines 24-33)

```
24: def rectangle_mesh(
25:     nx=11,
26:     ny=11,
27:     x_min=0,
28:     x_max=1,
29:     y_min=0,
30:     y_max=1,
31:     elm_type="quad4",
32:     ndim=None,
33:     name="",
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/__init__.py — `fedoo.mesh` module: Mesh Creation Functions (lines 1-110, whole file)

```
Mesh Creation Functions
===============================

.. autosummary::
   :toctree: generated/

   rectangle_mesh
   box_mesh
   disk_mesh
   hole_plate_mesh
   hollow_disk_mesh
   I_shape_mesh
   line_mesh_1D
   line_mesh
   line_mesh_cylindric
   circle_mesh
   grid_mesh_cylindric
   generate_cylindrical_local_frame
   structured_mesh_2D
   generate_nodes
```

```python
from .simple import (
    stack,
    rectangle_mesh,
    grid_mesh_cylindric,
    line_mesh_1D,
    line_mesh,
    line_mesh_cylindric,
    circle_mesh,
    box_mesh,
)
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.hole_plate_mesh.html — documentation toctree: Mesh Creation Functions (lines 51-91)

The generated docs list a dedicated reference page for the function:

```
<li class="toctree-l3"><a class="reference internal" href="fedoo.mesh.rectangle_mesh.html">fedoo.mesh.rectangle_mesh</a></li>
```
</rag-context>