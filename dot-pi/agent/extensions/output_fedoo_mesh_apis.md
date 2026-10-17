# API de construction de maillage fedoo — corpus documentaire

## Liste des fonctions du module fedoo.mesh

Source: `C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/__init__.py` (lignes 19–109)

```python
"""
===========================================
Geometry and Mesh (:mod:`fedoo.mesh`)
===========================================

.. currentmodule:: fedoo

Class Mesh
====================

.. autosummary::
   :toctree: generated/
   :template: custom-class-template.rst

   Mesh

.. currentmodule:: fedoo.mesh

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

### Classification (du doc, navigation sidebar)

Source: `C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.hole_plate_mesh.html` (lignes 66–86)

- Geometry and Mesh (`fedoo.mesh`)
  - Class Mesh
  - Mesh manipulation functions
  - Import/Export Fedoo Mesh object
  - **Mesh Creation Functions**:
    - `fedoo.mesh.rectangle_mesh`
    - `fedoo.mesh.box_mesh`
    - `fedoo.mesh.disk_mesh`
    - `fedoo.mesh.hole_plate_mesh`
    - `fedoo.mesh.hollow_disk_mesh`
    - `fedoo.mesh.I_shape_mesh`
    - `fedoo.mesh.line_mesh_1D`
    - `fedoo.mesh.line_mesh`
    - `fedoo.mesh.line_mesh_cylindric`
    - `fedoo.mesh.circle_mesh`
    - `fedoo.mesh.grid_mesh_cylindric`
    - `fedoo.mesh.generate_cylindrical_local_frame`
    - `fedoo.mesh.structured_mesh_2D`
    - `fedoo.mesh.generate_nodes`

---

## Signatures (source `fedoo/mesh/simple.py`)

### fedoo.mesh.stack — simple.py:10
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

### fedoo.mesh.rectangle_mesh — simple.py:24
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
    """
```
Retour (simple.py:200): `return Mesh(crd, elm, elm_type, node_sets, {}, ndim, name)` avec node_sets bottom/top/left/right.

### fedoo.mesh.grid_mesh_cylindric — simple.py:203
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
    ...
    Notes
    -----
    Use :func:`fedoo.mesh.generate_cylindrical_local_frame` to generate
    cylindrical local frames from the returned mesh.
    """
```

### fedoo.mesh.line_mesh_1D — simple.py:275
```python
def line_mesh_1D(n_nodes=11, x_min=0, x_max=1, elm_type="lin2", name=""):
    """
    Create the Mesh of a straight line with corrdinates in 1D.
    elm_type : {'lin2', 'lin3', 'lin4'}  (default='lin2')
    """
```

### fedoo.mesh.line_mesh — simple.py:330
```python
def line_mesh(n_nodes=11, x_min=0, x_max=1, elm_type="lin2", ndim=2, name=""):
    """
    Create the Mesh of a straight line
    x_min, x_max : int,float,list  (scalar 1D or list)
    elm_type : {'lin2', 'lin3', 'lin4'}  (default='lin2')
    """
```

### fedoo.mesh.line_mesh_cylindric — simple.py:369
```python
def line_mesh_cylindric(
    nt=12,
    r=1,
    theta_min=0,
    theta_max=3.14,
    elm_type="lin2",
    ndim=2,
    name="",
):
    """
    Create the mesh of a curved line based on cylindrical coordinates
    """
```

### fedoo.mesh.circle_mesh — simple.py:418
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
    """
```

### fedoo.mesh.box_mesh — simple.py:478
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
    elm_type : {'hex8', 'hex20'}
        * 'hex8' -- 8 node hexahedron
        * 'hex20' -- 20 node second order hexahedron
    """
```

---

## Signatures (source `fedoo/mesh/structured_mesh.py`)

### fedoo.mesh.disk_mesh — structured_mesh.py:408
```python
def disk_mesh(radius=1.0, nr=11, nt=11, elm_type="quad4", ndim=None, name=""):
    """
    Create a surface mesh of a disk or an ellipse
    radius : float, tuple  (If tuple = (a,b), a and b are the ellipse radius along x and y axis)
    elm_type: {'quad4', 'quad9', 'tri3', 'tri6', 'quad8'}
    """
```

### fedoo.mesh.hole_plate_mesh — signature doc
Source: `Main_documentation_fedoo/generated/fedoo.mesh.hole_plate_mesh.html` (lignes 130–157)
```
hole_plate_mesh(nr=11, nt=11, length=100, height=100, radius=20, elm_type='quad4',
                sym=False, include_node_sets=True, ndim=None, name='')
Create a mesh of a 2D plate with a hole
```
(implémenté dans `fedoo/mesh/structured_mesh.py`)

---

## Signatures (source `fedoo/mesh/functions.py`)

### fedoo.mesh.extrude — functions.py:272
```python
def extrude(
    mesh,
    extrude_path,
    n_nodes=11,
    ndim=None,
    name="",
    local_frame=None,
```
(autres fonctions manipulatives du module: `thicken`, `extract_surface`, `extract_edges`, `change_elm_type`, `quad2tri`, `axisymmetric_extrusion` — cf. imports dans `__init__.py` lignes 90–98)

---

## Note sur `rectangle_layer`
Le terme `rectangle_layer` n'apparaît dans AUCUN fichier indexé du corpus fedoo (recherche dédiée sans résultat). Les API de construction existantes sont celles listées ci-dessus; l'équivalent fonctionnel de "couche de rectangle" est obtenu via `rectangle_mesh` + `stack` (empilement spatial de deux mesh de même forme d'élément) ou `extrude`.

## Signatures du module Mesh (classe)
`fedoo.Mesh` — classe principale (doc: `generated/fedoo.Mesh.html`), méthodes `Mesh.stack`, `find_coincident_nodes`, `merge_nodes` (mentionnées dans la docstring de `stack`).
