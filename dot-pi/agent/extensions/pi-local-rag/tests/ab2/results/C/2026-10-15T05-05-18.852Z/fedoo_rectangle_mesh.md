<rag-context>
[pi-local-rag] RAG subagent: 4 sources, 3210 ms retrieval.
### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/structured_mesh.py (lines 434-496 · enclosing function/class)

    hole_plate_mesh: Mesh of a plate with a hole
    hollow_disk_mesh: Mesh of a hollow disk
    """
    if elm_type == "quad8":
        return change_elm_type(
            disk_mesh(radius, nr, nt, "quad9", ndim, name),
            "quad8",
        )

    if isinstance(radius, tuple):
        ellipse = True
        ellipse_radius = np.array(radius)
        radius = 1
    else:
        ellipse = False

    m = hole_plate_mesh(nr, nt, 0.5 * radius, 0.5 * radius, radius, elm_type)
    hole_edge = m.node_sets["hole_edge"]

    m = structured_mesh_2D(
        m,
        m.node_sets["right"],
        m.node_sets["top"][::-1],
        m.node_sets["left"][::-1],
        m.node_sets["bottom"],
        elm_type,
        ndim=ndim,
        name=name,
    )
    m.node_sets = {"boundary": hole_edge}

    if ellipse:
        m.nodes *= ellipse_radius

    return m


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
    ndim: int, optional
        dimension of the generated mesh. By default, the returned mesh will be in 2d.
    name: str, optional
        Name of the returned mesh.

    Returns
    -------
    Mesh
        The generated geometry in Mesh format. See the Mesh class for more details.


### H02 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/structured_mesh.py (lines 301-311 · enclosing function/class)

                nr,
                nt,
                length,
                height,
                radius,
                "quad9",
                sym,
                include_node_sets,
                ndim,
                name,
            ),

### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Exemples_fedoo/03-advanced/README.rst (lines 1-4 · enclosing doc section)

Advanced problems
-----------------

This section show some advanced capabilities of fedoo.

### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/__init__.py (lines 1-110 · whole file (short script))

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


# import pkgutil

# for loader, module_name, is_pkg in  pkgutil.walk_packages(__path__):
#     module = loader.find_module(module_name).load_module(module_name)
#     exec('from .'+module_name+' import *')

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
</rag-context>