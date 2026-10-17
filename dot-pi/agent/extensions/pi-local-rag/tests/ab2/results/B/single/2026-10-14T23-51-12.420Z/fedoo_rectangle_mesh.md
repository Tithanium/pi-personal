<rag-context>
[pi-local-rag] RAG subagent: 1 sources, 25192 ms retrieval.
The user asks "How do I build a rectangular mesh in fedoo? Give the exact function call."

Looking at the candidates:

- Section 004 lists `rectangle_mesh` as one of the Mesh Creation Functions. It tells us the function name exists, but doesn't give the exact function call with parameters.

None of the candidates contain the exact function call for `rectangle_mesh` (e.g., `fedoo.mesh.rectangle_mesh(dx=..., dy=..., ...)`). They are all boilerplate HTML, navigation menus, or module import lists. Section 004 mentions `rectangle_mesh` by name in an autosummary, which is the closest to answering the prompt — it identifies the function to call. But it does not give an "exact function call."

Per the rules, KEEP only sections that DIRECTLY answer the prompt. None give the exact function call. However, section 004 at least identifies `rectangle_mesh` as the function for creating a rectangular mesh, which partially answers "how do I build a rectangular mesh." The user asked for the "exact function call" — no section provides that.

I will keep only section 004 as it is the only one that identifies the relevant function name. The rest are HTML boilerplate or unrelated.

## 004 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/__init__.py (lines 1-110 · whole file (short script))

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