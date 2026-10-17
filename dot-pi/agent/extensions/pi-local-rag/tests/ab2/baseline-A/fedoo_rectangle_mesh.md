<rag-context>
[pi-local-rag] RAG subagent: 5 sources, 48803 ms retrieval.
# Building a rectangular mesh in Fedoo

Use `fedoo.mesh.rectangle_mesh`. Exact signature and working usage from the fedoo source:

## Full function definition (source)

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py — lines 24-65 (rectangle_mesh)

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

## Working example usage (source)

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/tests/test_thicken.py — lines 10-19

```python
def test_thicken_planar_surface_about_midsurface(surface_type, solid_type):
    surface = fd.mesh.rectangle_mesh(2, 2, elm_type=surface_type, ndim=3)

    solid = fd.mesh.thicken(surface, 0.2)
```

So the exact call is, e.g.:

```python
import fedoo as fd
m = fd.mesh.rectangle_mesh(11, 11, x_min=0, x_max=100, y_min=0, y_max=50, elm_type="quad4")
```

## Documentation page (API reference)

- Generated docs page: `fedoo.mesh.rectangle_mesh` (C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.rectangle_mesh.html) — "Surface mesh of a rectangle"
- Listed in `fedoo/mesh/__init__.py` under the autosummary of "Mesh Creation Functions" alongside `box_mesh`, `disk_mesh`, `hole_plate_mesh`, etc.
</rag-context>