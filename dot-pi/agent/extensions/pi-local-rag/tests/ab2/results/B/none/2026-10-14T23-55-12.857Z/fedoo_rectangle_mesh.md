<rag-context>
[pi-local-rag] RAG subagent: 6 sources, 283 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.hole_plate_mesh.html (lines 51-55 · chunk range (no structural region))

  </form>
</div>
        </div><div class="wy-menu wy-menu-vertical" data-spy="affix" role="navigation" aria-label="Navigation menu">
<p style="padding: 0.5em 1.618em; margin-bottom: 0;">
  <a href="https://3mah.github.io/" style="color: #d9d9d9; font-weight: bold; text-decoration: none;">

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.extract_surface.html (lines 47-47 · chunk range (no structural region))

  <form id="rtd-search-form" class="wy-form" action="../search.html" method="get">

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.extract_edges.html (lines 35-35 · chunk range (no structural region))

  <div class="wy-grid-for-nav">

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


## 005 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/examples/01-simple/README.rst (lines 1-7 · enclosing doc section)

Simple examples to start
---------------------------

This section contains several very simple examples that illustrate 
the basics feature of fedoo, like how to create simple meshes, 
apply basics boundary conditions and get the results.


## 006 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.quad2tri.html (lines 22-22 · chunk range (no structural region))

      <script src="../_static/documentation_options.js?v=8d563738"></script>
</rag-context>