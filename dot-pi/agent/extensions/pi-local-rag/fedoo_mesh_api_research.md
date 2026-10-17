# Corpus fedoo — API de construction de maillage (signatures file:line)

Source principale : code source archivé fedoo 1.0.0
(`C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/`)
et documentation générée (`Main_documentation_fedoo/`).

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/__init__.py — liste officielle des API (lignes 19-67, imports 77-109)

```
Mesh manipulation functions
==================================

.. autosummary::
   :toctree: generated/

   stack
   extrude
   thicken
   extract_surface
   extract_edges
   change_elm_type
   quad2tri

.. _importmesh:

Import/Export Fedoo Mesh object
==================================

.. autosummary::
   :toctree: generated/

   import_file
   import_msh
   import_vtk


.. _build_simple_mesh:

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
"""
```

Imports effectifs (lignes 77-109) :

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

from .importmesh import import_file, import_vtk, import_msh

from .functions import (
    extrude,
    thicken,
    extract_surface,
    extract_edges,
    change_elm_type,
    quad2tri,
    axisymmetric_extrusion,
)

from .structured_mesh import (
    structured_mesh_2D,
    generate_nodes,
    hole_plate_mesh,
    disk_mesh,
    hollow_disk_mesh,
    I_shape_mesh,
)

from fedoo.util.localframe import generate_cylindrical_local_frame
```

Note : il n'y a **pas** de fonction `rectangle_layer` dans le corpus ; les API de
construction empilée/extrudée correspondantes sont `stack` et `extrude`.
La fonction `axisymmetric_extrusion` est importée mais absente de l'autosummary.

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py:10 — `stack`

```python
def stack(mesh1, mesh2, name=""):
    """
    Make the spatial stack of two mesh objects which have the same element shape.
    This function doesn't merge coindicent Nodes.
    For that purpose, use the Mesh methods 'find_coincident_nodes' and 'merge_nodes'
    on the resulting Mesh.

    Return
    ---------
    Mesh object with is the spacial stack of mesh1 and mesh2
    """
    return Mesh.stack(mesh1, mesh2, name)
```

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py:24-65 — `rectangle_mesh`

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
        The generated geometry in Mesh format. See the Mesh class for more details.

    See Also
    --------
    line_mesh : 1D mesh of a line
    rectangle_mesh : Surface mesh of a rectangle
    box_mesh : Volume mesh of a box
    grid_mesh_cylindric : Surface mesh of a grid in cylindrical coodrinate
    line_mesh_cylindric : Line mesh in cylindrical coordinate
    """
```

Node sets générés (lignes 162-167) :

```python
        node_sets = {
            "bottom": [nd for nd in range(nx)],
            "top": [nd for nd in range(N - nx, N)],
            "left": [nd for nd in range(0, N, nx)],
            "right": [nd for nd in range(nx - 1, N, nx)],
        }
```

Retour (ligne 200) : `return Mesh(crd, elm, elm_type, node_sets, {}, ndim, name)`

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py:203-213 — `grid_mesh_cylindric`

```python
def grid_mesh_cylindric(
    nr=11,
    nt=11,
    r_min=0,
    r_max=1,
    theta_min=0,
    theta_max=1,
    elm_type="quad4",
    ndim=None,
    name="",
):
    """
    Create a mesh as a regular grid in cylindrical coordinate

    Parameters
    ----------
    nr, nt : int
        Numbers of nodes in the r and theta axes (default = 11).
    ...
    elm_type : {'tri3', 'quad4', 'quad8', 'quad9'}
        The type of the element generated (default='quad4')
```

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py:275-327 — `line_mesh_1D`

```python
def line_mesh_1D(n_nodes=11, x_min=0, x_max=1, elm_type="lin2", name=""):
    """
    Create the Mesh of a straight line with corrdinates in 1D.

    Parameters
    ----------
    n_nodes : int
        Numbers of nodes (default = 11).
    x_min, x_max : int,float
        The boundary of the line (default : 0, 1).
    elm_type : {'lin2', 'lin3', 'lin4'}
        The shape of the elements (default='lin2')

        * 'lin2' -- 2 node line
        * 'lin3' -- 3 node line
        * 'lin4' -- 4 node line

    Returns
    -------
    Mesh
        The generated geometry in Mesh format. See the Mesh class for more details.
    """
    if elm_type == "lin2":  # 1D element with 2 nodes
        crd = np.c_[np.linspace(x_min, x_max, n_nodes)]  # Nodes coordinates
        elm = np.c_[range(n_nodes - 1), np.arange(1, n_nodes)]  # Elements
    elif elm_type == "lin3":  # 1D element with 3 nodes
        n_nodes = n_nodes // 2 * 2 + 1  # In case N is not initially odd
        crd = np.c_[np.linspace(x_min, x_max, n_nodes)]  # Nodes coordinates
        elm = np.c_[
            np.arange(0, n_nodes - 2, 2),
            np.arange(1, n_nodes - 1, 2),
            np.arange(2, n_nodes, 2),
        ]  # Elements
    elif elm_type == "lin4":
        n_nodes = n_nodes // 3 * 3 + 1
        crd = np.c_[np.linspace(x_min, x_max, n_nodes)]  # Nodes coordinates
        elm = np.c_[
            np.arange(0, n_nodes - 3, 3),
            np.arange(1, n_nodes - 2, 3),
            np.arange(2, n_nodes - 1, 3),
            np.arange(3, n_nodes, 3),
        ]  # Elements

    node_sets = {"left": [0], "right": [n_nodes - 1]}
    return Mesh(crd, elm, elm_type, node_sets, name=name)
```

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py:418-475 — `circle_mesh`

```python
def circle_mesh(
    n=12,
    r=1,
    elm_type="lin2",
    ndim=2,
    name="",
):
    """
    Create the mesh of a cicle.

    Parameters
    ----------
    n : int, default=12
        Number of nodes along the angular coordinate.
    r : float, default=1.
        Radius of the circle.
    elm_type : {'lin2', 'lin3', 'lin4'}, default='lin2'
        Type of line elements used in the mesh:
        * 'lin2' -- 2-node line
        * 'lin3' -- 3-node line
        * 'lin4' -- 4-node line
    ndim : int, default=2
        Dimension of the mesh.
    name : str, optional
        Name of the mesh.

    Returns
    -------
    Mesh
        The generated geometry in Mesh format. See the Mesh class for more details.
    """
    m = line_mesh_cylindric(
        n + 1,
        r,
        0,
        2 * np.pi,
        elm_type,
        ndim,
        name,
    )

    m.nodes = m.nodes[:-1]
    m.elements[-1, -1] = 0

    return m
```

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py:478-516 — `box_mesh`

```python
def box_mesh(
    nx=11,
    ny=11,
    nz=11,
    x_min=0,
    x_max=1,
    y_min=0,
    y_max=1,
    z_min=0,
    z_max=1,
    elm_type="hex8",
    name="",
):
    """
    Create the mesh of a box

    Parameters
    ----------
    nx, ny, nz : int
        Numbers of nodes in the x, y and z axes (default = 11).
    x_min, x_max, y_min, y_max, z_min, z_max : int,float
        The boundary of the box (default : 0, 1, 0, 1, 0, 1).
    elm_type : {'hex8', 'hex20'}
        The type of the element generated (default='hex8')
        * 'hex8' -- 8 node hexahedron
        * 'hex20' -- 20 node second order hexahedron

    Returns
    -------
    Mesh
        The generated geometry in Mesh format. See the Mesh class for more details.
    """
```

Node sets générés pour hex8/hex20 : `bottom`, `top`, `left`, `right`, `front`, `back`
(lignes 612-768 pour hex20, 770+ pour hex8).

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/structured_mesh.py:247-257 — `hole_plate_mesh`

```python
def hole_plate_mesh(
    nr=11,
    nt=11,
    length=100,
    height=100,
    radius=20,
    elm_type="quad4",
    sym=False,
    include_node_sets=True,
    ndim=None,
    name="",
```

Docstring (lignes 262-270) :

```
    Parameters
    ----------
    nr, nt: int
        Numbers of nodes in the radial and tangent direction from the hole (default = 11).
        nt is the number of nodes of the half of an exterior edge
    length, height : int,float
        The length and height of the plate (default : 100).
```

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/structured_mesh.py:405 — `disk_mesh`

```python
def disk_mesh(radius=1.0, nr=11, nt=11, elm_type="quad4", ndim=None, name=""):
    """
    Create a surface mesh of a disk or an ellipse

    Parameters
    ----------
    radius : float, tuple
        The radius of the disk (default : 1).
        If tuple = (a,b), a and b are the ell...
```

Node sets retournés (lignes 453-459) : le maillage est construit via
`structured_mesh_2D(m, m.node_sets["right"], m.node_sets["top"][::-1], ...)` puis
`m.node_sets = {"boundary": hole_edge}`.

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/structured_mesh.py:497 (See Also, docstring de `hollow_disk_mesh`) — références croisées

```
    See Also
    --------
    rectangle_mesh: Mesh of a retangle
    disk_mesh: Mesh of a disk or an ellipse
    """
    r_int = radius - thickness  # intern radius
    assert r_int > 0, "thickness should be lower than radius"

    m = Mesh(np.array([[radius, 0], [r_int, 0]]))

    nt = nt // 4 * 4 
```

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/functions.py:272-312 — `extrude` (construction par extrusion, équivalent "layer")

```python
def extrude(
    mesh,
    extrude_path,
    n_nodes=11,
    ndim=None,
    name="",
    local_frame=None,
):
    """
    Build a volume or surface mesh from the extrusion of a surface or wire mesh.

    Parameters
    ----------
    mesh : fedoo.Mesh
        The mesh to extrude
    extrude_path : float, tuple[float] or fedoo.Mesh
        The path along which the mesh will be extruded.
        extrude_path can either be:
        - a float: extrude_path is the extrusion thickness.
        - a tuple: extrude_path is the min and max coordinates values along the thickness.
        - a fedoo.Mesh with line elements: define the path along which the mesh is extruded.
    n_nodes : int
        number of nodes in the extrusion direction. n_nodes is ignored if extrude_path is a Mesh.
    ndim : int, optional
        Spatial dimension of an ordinary extrusion. With ``local_frame``, the
        frame dimension determines the output dimension; an explicitly given
        ``ndim`` must match it.
    local_frame : array_like or scipy/simcoon Rotation, optional
        Smooth local frames along the extrusion path. One frame is broadcast
        to all path nodes; otherwise one frame per path node is required.
        Frame rows are the local basis vectors expressed in global coordinates.
        For a conventional sweep along a curved path, the first frame axis
        generally follows the path tangent. Other orientations may be used to
        create an oblique sweep.
    name : str, optional
        The name of the final Mesh.

    Returns
    -------
    Mesh object
    """
```

Combinaisons d'éléments supportées (lignes 363-433) :

```python
    if mesh.elm_type == "lin2":
        dim_mesh = 1
        if mesh1.elm_type == "lin2":
            type_elm = "quad4"
        elif mesh1.elm_type == "quad4":
            type_elm = "hex8"
    elif (mesh.elm_type == "lin3"):
        dim_mesh = 1
        if mesh1.elm_type == "lin3":
            type_elm = "quad9"
    elif mesh.elm_type == "quad4":
        dim_mesh = 2
        if mesh1.elm_type == "lin2":
            type_elm = "hex8"
    elif mesh.elm_type == "tri3":
        dim_mesh = 2
        if mesh1.elm_type == "lin2":
            type_elm = "wed6"
    else:
        raise NameError("Element not implemented")
```

Calcul de `ndim` par défaut (ligne 354-355) :

```python
    ndim_is_explicit = ndim is not None
    if ndim is None:
        ndim = min(3, mesh.ndim + mesh1.ndim)  # dim of the extruded mesh
```

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/functions.py:620 — `quad2tri`

```python
def quad2tri(mesh):
    """Change the type of element of a mesh from 'quad4' to 'tri3'.

    Parameters
    ----------
    mesh : fedoo.Mesh
```

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/mesh.html:51-100 — page de doc « Geometry and Mesh », liste affichée

```
Import a mesh from a file.

[`import_msh`](generated/fedoo.mesh.import_msh.html#fedoo.mesh.import_msh "fedoo.mesh.import_msh")(filename[, name, mesh_type])

Import a mesh from a msh file (gmsh format).

[`import_vtk`](generated/fedoo.mesh.import_vtk.html#fedoo.mesh.import_vtk "fedoo.mesh.import_vtk")(...
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.hole_plate_mesh.html:51-55 — index « See also » de la doc générée

```
1D mesh of a line

[`rectangle_mesh`](fedoo.mesh.rectangle_mesh.html#fedoo.mesh.rectangle_mesh "fedoo.mesh.rectangle_mesh")

Surface mesh of a rectangle
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.line_mesh_1D.html:50-63 — index des maillages 1D/2D/3D

```
[`rectangle_mesh`](fedoo.mesh.rectangle_mesh.html#fedoo.mesh.rectangle_mesh "fedoo.mesh.rectangle_mesh")

Surface mesh of a rectangle

[`box_mesh`](fedoo.mesh.box_mesh.html#fedoo.mesh.box_mesh "fedoo.mesh.box_mesh")

Volume mesh of a box

[`grid_mesh_cylindric`](fedoo.mesh.grid_mesh_cylindric.html#f...
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.rectangle_mesh.html:50-73 — « Return type / See also »

```
Return type:

[Mesh](fedoo.Mesh.html#fedoo.Mesh "fedoo.Mesh")

See also

[`line_mesh`](fedoo.mesh.line_mesh.html#fedoo.mesh.line_mesh "fedoo.mesh.line_mesh")

1D mesh of a line

[`rectangle_mesh`](#fedoo.mesh.rectangle_mesh "fedoo.mesh.rectangle_mesh")

Surface mesh of a rectangle

[`box_mesh`](fedo...
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.stack.html:1-17 — page doc `fedoo.mesh.stack`

```
  fedoo.mesh.stack — Fedoo 1.0.0 (stable)           

*   [](../index.html)
*   [Geometry and Mesh (`fedoo.mesh`)](../mesh.html)
*   fedoo.mesh.stack
*   [View page source](../_sources/generated/fedoo.mesh.stack.rst.txt)

* * *

# fedoo.mesh.stack[⟳](#fedoo-mesh-stack "Link to this heading")

stack
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.generate_nodes.html:1-45 — page doc `fedoo.mesh.generate_nodes`

```
  fedoo.mesh.generate_nodes — Fedoo 1.0.0 (stable)           

*   [](../index.html)
*   [Geometry and Mesh (`fedoo.mesh`)](../mesh.html)
*   fedoo.mesh.generate_nodes
*   [View page source](../_sources/generated/fedoo.mesh.generate_nodes.rst.txt)

* * *

# fedoo.mesh.generate_nodes[⟳](#fedoo-mesh-generate-nodes "...
```

---

## Récapitulatif des signatures file:line

| Fonction | Fichier | Ligne |
|---|---|---|
| `stack(mesh1, mesh2, name="")` | `_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py` | 10 |
| `rectangle_mesh(nx=11, ny=11, x_min=0, x_max=1, y_min=0, y_max=1, elm_type="quad4", ndim=None, name="")` | `.../simple.py` | 24 |
| `grid_mesh_cylindric(nr=11, nt=11, r_min=0, r_max=1, theta_min=0, theta_max=1, elm_type="quad4", ndim=None, name="")` | `.../simple.py` | 203 |
| `line_mesh_1D(n_nodes=11, x_min=0, x_max=1, elm_type="lin2", name="")` | `.../simple.py` | 275 |
| `line_mesh` (docstring See Also : « Mesh of a line whith choosen dimension ») | `.../simple.py` | ~330-415 (zone `line_mesh`/`line_mesh_cylindric`) |
| `line_mesh_cylindric` (docstring en clair à `simple.py:384-408`) | `.../simple.py` | ~360-415 |
| `circle_mesh(n=12, r=1, elm_type="lin2", ndim=2, name="")` | `.../simple.py` | 418 |
| `box_mesh(nx=11, ny=11, nz=11, x_min=0, x_max=1, y_min=0, y_max=1, z_min=0, z_max=1, elm_type="hex8", name="")` | `.../simple.py` | 478 |
| `hole_plate_mesh(nr=11, nt=11, length=100, height=100, radius=20, elm_type="quad4", sym=False, include_node_sets=True, ndim=None, name="")` | `_archive_.../fedoo/mesh/structured_mesh.py` | 247 |
| `disk_mesh(radius=1.0, nr=11, nt=11, elm_type="quad4", ndim=None, name="")` | `.../structured_mesh.py` | 405 |
| `hollow_disk_mesh` (voit `radius`, `thickness`, `nt`) | `.../structured_mesh.py` | ~497 |
| `I_shape_mesh`, `structured_mesh_2D`, `generate_nodes` | `.../structured_mesh.py` | import `__init__.py:100-107` |
| `extrude(mesh, extrude_path, n_nodes=11, ndim=None, name="", local_frame=None)` | `_archive_.../fedoo/mesh/functions.py` | 272 |
| `quad2tri(mesh)` | `.../functions.py` | 620 |
| `thicken`, `extract_surface`, `extract_edges`, `change_elm_type`, `axisymmetric_extrusion` | `.../functions.py` | import `__init__.py:90-98` |
| `import_file`, `import_msh`, `import_vtk` | `.../importmesh.py` | import `__init__.py:88` |
| `generate_cylindrical_local_frame` | `fedoo/util/localframe.py` | import `__init__.py:109` |