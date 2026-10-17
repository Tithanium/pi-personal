# API de construction de maillage — fedoo (corpus fedoo 1.0.0)

## Index des fonctions — file:line

Toutes les signatures ci-dessous proviennent du code source indexé :
`C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py` et `.../fedoo/mesh/structured_mesh.py`.

| Fonction | file:line |
|---|---|
| `stack` | simple.py:10 |
| `rectangle_mesh` | simple.py:24 |
| `grid_mesh_cylindric` | simple.py:203 |
| `line_mesh_1D` | simple.py:275 |
| `line_mesh` | simple.py:330 |
| `line_mesh_cylindric` | simple.py:369 |
| `circle_mesh` | simple.py:418 |
| `box_mesh` | simple.py:478 |
| `structured_mesh_2D` | structured_mesh.py:7 |
| `generate_nodes` | structured_mesh.py:188 |
| `hole_plate_mesh` | structured_mesh.py:247 |
| `disk_mesh` | structured_mesh.py:408 |
| `hollow_disk_mesh` | structured_mesh.py:471 |
| `I_shape_mesh` | structured_mesh.py:527 |

Note : aucune fonction nommée `rectangle_layer` n'existe dans le corpus fedoo (recherches ciblées sans résultat). L'équivalent « couche » est obtenu via `stack` (empilement spatial de deux Mesh) ou `box_mesh`.

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py — stack (l.10-21)

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

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py — rectangle_mesh (l.24-34, docstring l.35-65)

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
    ...
    return Mesh(crd, elm, elm_type, node_sets, {}, ndim, name)
```
Les node_sets retournés (simple.py l.162-167) :
```python
    node_sets = {
        "bottom": [nd for nd in range(nx)],
        "top": [nd for nd in range(N - nx, N)],
        "left": [nd for nd in range(0, N, nx)],
        "right": [nd for nd in range(nx - 1, N, nx)],
    }
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py — grid_mesh_cylindric (l.203-213)

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
Implémentation : construit un `rectangle_mesh` en coordonnées (r, theta) puis convertit en cartésien (l.247-272) ; node_sets : "bottom", "top", "left", "right".

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py — line_mesh_1D (l.275-276)

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
    ...
    """
    ...
    node_sets = {"left": [0], "right": [n_nodes - 1]}
    return Mesh(crd, elm, elm_type, node_sets, name=name)
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py — line_mesh (l.330-331)

```python
def line_mesh(n_nodes=11, x_min=0, x_max=1, elm_type="lin2", ndim=2, name=""):
    """
    Create the Mesh of a straight line

    Parameters
    ----------
    n_nodes : int
        Numbers of nodes (default = 11).
    x_min, x_max : int,float,list
        The boundary of the line as scalar (1D) or list (default : 0, 1).
    elm_type : {'lin2', 'lin3', 'lin4'}
        The shape of the elements (default='lin2')
    ...
    """
    if np.isscalar(x_min):
        m = line_mesh_1D(n_nodes, x_min, x_max, elm_type, name)
        crd = np.c_[m.nodes, np.zeros((m.n_nodes, ndim - 1))]
        return Mesh(crd, m.elements, elm_type, m.node_sets, name=name)
    else:
        m = line_mesh_1D(n_nodes, 0.0, 1.0, elm_type, name)
        crd = m.nodes
        crd = (np.array(x_max) - np.array(x_min)) * crd + np.array(x_min)
        return Mesh(crd, m.elements, elm_type, m.node_sets, name=name)
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py — line_mesh_cylindric (l.369-377)

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
    ...
    """
    m = line_mesh_1D(nt, theta_min, theta_max, elm_type, name)
    theta = m.nodes[:, 0]
    elm = m.elements

    crd = np.c_[r * np.cos(theta), r * np.sin(theta)]

    return Mesh(crd, elm, elm_type, m.node_sets, {}, ndim, name)
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py — circle_mesh (l.418-424)

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
        ...
    """
    m = line_mesh_cylindric(n + 1, r, 0, 2 * np.pi, elm_type, ndim, name)
    m.nodes = m.nodes[:-1]
    m.elements[-1, -1] = 0
    return m
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py — box_mesh (l.478-489, docstring l.491-503)

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
    ...
    """
    ...
    node_sets = {
        "right": right,
        "left": left,
        "top": top,
        "bottom": bottom,
        "front": front,
        "back": back,
    }
    return Mesh(crd, elm, elm_type, node_sets, name=name)
```

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/structured_mesh.py — structured_mesh_2D (l.7-9, docstring l.10-52)

```python
def structured_mesh_2D(
    data, edge1, edge2, edge3, edge4, elm_type="quad4", method=0, ndim=None, name=""
):
    """Create a 2D structured grid from 4 edges.

    This function build a 2D structured mesh from the ordered position of nodes
    defining the 4 edges.

    Parameters
    ----------
    data: Mesh|np.ndarray[float]
        may be a fedoo Mesh object or a numpy array containing the node
        coordinates.
    edge1, edge2, edge3, edge4: list[int]|np.ndarray[int]
        ordered node indices of the 4 edges defining the structured surface.
        The node indices should be given considering the following rules:

        - the node indices must be sorted from the first node on the edge to
          the last in the order in which they are encountered.
        - edges 1 and 3 are opposite faces and must have the same length
          (same number of nodes).
        - edge2 and edge4 must also have the same length.
        - last node of edge1 should be the first of edge2, last node of
          edge2 should be the first of edge3 and so on...

    elm_type: {'quad4', 'quad9', 'tri3', 'tri6'}, default = 'quad4'
        The type of the element generated.
    method: int, default = 0
        The method used to generate inside nodes:

        - if method == 0: intesection of lines drawn between nodes of oposite edges.
        - if method == 1: nodes are regularly distributed between edge1 and edge3
          and moved in the perpendicular direction to be as closed as possible
          to a regular distribution between edge2 and edge4
        - if method == 2: nodes are regularly distributed between edge1 and edge3
          without correction for the perpendicular direction.
        - if method == 3: nodes are regularly distributed between edge2 and edge4
          without correction for the perpendicular direction.

    ndim: int, optional
        dimension of the generated mesh. Default = assert from the given data.
    name: str, optional
        Name of the returned mesh. If "" and data is a Mesh, the name is the same
        as data.name.
    """
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/structured_mesh.py — generate_nodes (l.188-217)

```python
def generate_nodes(mesh, N, data, type_gen="straight"):
    """
    Add regularly espaced nodes to an existing mesh between to existing nodes.

    This function serves to generated structured meshes.
    To create a 2D stuctured mesh:
        - Create and mesh with only sigular nodes that will serve to build the edges
        - Use the generate_nodes functions to add some nodes to the edge
        - Use the structured_mesh_2D from the set of nodes corresponding the egdes to build the final mesh.

    Parameters
    ----------
    mesh: Mesh
        the existing mesh
    N: int
        Number of generated nodes.
    data: list or tuple
        if type_gen == 'straight', data should contain the indices of the starting (data[0]) and ending (data[1]).
        if type_gen == 'circular', data should contain the indices
            of the starting (data[0]) and ending (data[1]) nodes and the coordinates of the center of the circle
            (data[2]). The nodes are generated using a trigonometric rotation.
    type_gen: str in {'straight', 'circular'}
        Type of line generated. The default is 'straight'.

    Returns
    -------
    np.ndarray[int]
        array containing indices of the new generated nodes
    """
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/structured_mesh.py — hole_plate_mesh (l.247-258)

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
):
    """
    Create a mesh of a 2D plate with a hole

    Parameters
    ----------
    nr, nt: int
        Numbers of nodes in the radial and tangent direction from the hole (default = 11).
        nt is the number of nodes of the half of an exterior edge
    length, height : int,float
        The length and height of the plate (default : 100).
    radius : int, float, tuple
        The radius of the hole (default : 20).
        If tuple = (a,b), a and b are the ellipse radius along x and y axis.

    elm_type: {'quad4', 'quad9', 'tri3', 'tri6', 'quad8'}
        The type of the element generated (default='quad4')
    Sym: bool
        Sym = True, if only the returned mesh assume symetric condition and
        only the quarter of the plate is returned (default=False)
    include_node_sets : bool
        if True (default), the boundary nodes are included in the mesh node_sets dict.
    ndim: int, optional
        dimension of the generated mesh. By default, the returned mesh will be in 2d.
    name: str, optional
        Name of the returned mesh.
    ...
    """
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/structured_mesh.py — disk_mesh (l.408-409)

```python
def disk_mesh(radius=1.0, nr=11, nt=11, elm_type="quad4", ndim=None, name=""):
    """
    Create a surface mesh of a disk or an ellipse

    Parameters
    ----------
    radius : float, tuple
        The radius of the disk (default : 1).
        If tuple = (a,b), a and b are the ellipse radius along x and y axis.
    nr, nt: int, default = 11.
        number of nodes in the radial (nr) and tangential (nt) directions used
        to build the mesh. nr and nt are not the total nodes in each direction.
    elm_type: {'quad4', 'quad9', 'tri3', 'tri6', 'quad8'}
        The type of the element generated (default='quad4')
    ...
    """
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/structured_mesh.py — hollow_disk_mesh (l.471-473)

```python
def hollow_disk_mesh(
    radius=1.0, thickness=0.1, nr=5, nt=41, elm_type="quad4", ndim=None, name=""
):
    """
    Create a surface mesh of an hollow disk or an ellipse

    Parameters
    ----------
    radius: float, default = 1
        The radius of the disk (default : 1).
    thickness: float, default = 0.1
        The thickness of the hollow disk
    nr, nt: int, default: nr = 5, nt=41.
        number of nodes in the radial (nr) and tangential (nt) directions.
    elm_type: {'quad4', 'quad9', 'tri3', 'tri6'}
        The type of the element generated (default='quad4')
    ...
    """
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/structured_mesh.py — I_shape_mesh (l.527-536)

```python
def I_shape_mesh(
    height=10,
    width=10,
    web_thickness=2,
    flange_thickness=2,
    size_elm=0.2,
    elm_type="quad4",
    ndim=None,
    name="",
):
    """
    Create the mesh of a I.

    Parameters
    ----------
    height: float, default = 10
        Total height of the I
    width: float, default = 10
        Total width of the I
    web_thickness: float, default = 2
        Web thickness
    flange_thickness: float, default = 2
        Flange thickness
    size_elm, default = 0.2
        Size of the edge of an element.
    elm_type: {'quad4', 'quad9', 'tri3', 'tri6'}
        The type of the element generated (default='quad4')
    ...
    """
```

---

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/__init__.py — exports publics du module fedoo.mesh (l.51-99, l.100-110)

```
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
   generate_...

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
