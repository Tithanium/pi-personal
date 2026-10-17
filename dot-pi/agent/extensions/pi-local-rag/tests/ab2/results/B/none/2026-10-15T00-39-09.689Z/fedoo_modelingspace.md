<rag-context>
[pi-local-rag] RAG subagent: 4 sources, 55 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/quick_start.html (lines 1-50 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="./">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Quick Start &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="_static/sg_gallery-dataframe.css?v=2082cf3c" />
      <link rel="stylesheet" type="text/css" href="_static/sg_gallery-rendered-html.css?v=1277b6f3" />
      <link rel="stylesheet" type="text/css" href="_static/sphinx-design.min.css?v=95c83b7e" />
      <link rel="stylesheet" type="text/css" href="_static/custom.css?v=26864b79" />

  
      <script src="_static/jquery.js?v=5d32c60e"></script>
      <script src="_static/_sphinx_javascript_frameworks_compat.js?v=2cd50e6c"></script>
      <script src="_static/documentation_options.js?v=8d563738"></script>
      <script src="_static/doctools.js?v=9bcbadda"></script>
      <script src="_static/sphinx_highlight.js?v=dc90522c"></script>
      <script src="_static/sg-tags.js?v=d80f6fa4"></script>
      <script src="_static/design-tabs.js?v=f930bc37"></script>
    <script src="_static/js/theme.js"></script>
    <link rel="index" title="Index" href="genindex.html" />
    <link rel="search" title="Search" href="search.html" />
    <link rel="next" title="Geometry and Mesh (fedoo.mesh)" href="mesh.html" />
    <link rel="prev" title="Installation" href="install.html" /> 
</head>

<body class="wy-body-for-nav"> 
  <div class="wy-grid-for-nav">
    <nav data-toggle="wy-nav-shift" class="wy-nav-side">
      <div class="wy-side-scroll">
        <div class="wy-side-nav-search"  style="background: #24445C" >

          
          
          <a href="index.html">
            
              <img src="_static/fedoo_logos_ss_fond.png" class="logo" alt="Logo"/>
          </a>
<div role="search">
  <form id="rtd-search-form" class="wy-form" action="search.html" method="get">
    <input type="text" name="q" placeholder="Search docs" aria-label="Search docs" />
    <input type="hidden" name="check_keywords" value="yes" />
    <input type="hidden" name="area" value="default" />

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/docs/quick_start.rst (lines 1-159 · enclosing doc section)

Quick Start
=================================

Steps to define and solve a Problem
___________________________________

The main steps to define a problem are:

1. Import the fedoo library
2. Define the space dimension 
3. Create and/or import the geometry (mesh)
4. Define one or many weak formulations (including constitutive equations)
5. Create the Assembly associated to the weak formulations and the mesh
6. Define the type of Problem (Static, Dynamic, ...) and the solver
7. Solve the Problem
8. Analyse and export results (vizualisation with Paraview recommanded)

Import library
______________

The first step is to import the fedoo library. Obvisously, fedoo needs to be :doc:`installed <install>`.

.. code-block:: python

   import fedoo as fd #Import all the fedoo library
   import numpy as np #Numpy is often usefull
   

Create the modeling space
___________________________

In fedoo, most of objects are associated to a modeling space. The modeling space is a space in which the variables and coordinates are created. 
The dimension of the modeling space car be '3D' or '2D' (for planar problem). The dimension of the space may also be set to '2Dstress' for planar problem based on the plane stress assumption.

.. code-block:: python

    fd.ModelingSpace("3D")


Create and/or import the geometry (mesh)
_________________________________________

The module :ref:`mesh <build_simple_mesh>` contains several functions to build up simple meshes. 
For instance to build the mesh of a box (3d rectangle), we can use: 

.. code-block:: python

    my_mesh = fd.mesh.box_mesh(nx=31, ny=21, nz=21, x_min=0, x_max=1000, y_min=0, y_max=100, z_min=0, z_max=100, elm_type = 'hex8')

You can also import a Mesh by using one of the following Mesh constructor :py:meth:`fedoo.Mesh.read`, :py:meth:`fedoo.Mesh.from_pyvista` or with the function fd.mesh.import_file (see :ref:`importmesh`) that allow to import meshes from the VTK or GMSH format.


Create weak formulations 
___________________________

We need to define one or several equations to solve. 
In a finite element analyses, the equations are written using a weak formulations. 
In fedoo, the equation is defined by creating a WeakForm object. 

The type of WeakForm may be related to a specific type of elements. 

For instance, a beam weak formulation should be associated to beam elements.
The module :doc:`weakform <weak_form>` list the available types of weak formulation.
Most of weak formulations needs the definition of a material constitutive law.
The module :doc:`constitutivelaw <constitutive_law>` list the available ConstitutiveLaw.

For instance a simple weak formulation may be defined by:

.. code-block:: python
    
    material = fd.constitutivelaw.ElasticIsotrop(200e3, 0.3)
    my_weakform = fd.weakform.StressEquilibrium(material)


Create global matrix assemblies
__________________________________

Once mesh and weak formulations have been created, we can now proceed to the assembly of the global matrices.
For each weak formulation associated to a mesh, an Assembly object needs to be created. To combine several assembly, there is a dedicated constructor :py:meth:`fedoo.Assembly.sum`.

For instance, a simple assembly for the previously defined weak formulation and mesh is:

.. code-block:: python
    
    my_assembly = fd.Assembly.create(my_weakform, my_mesh) 

The Assembly object will automatically compute the assembled stiffness matrix using scipy sparse matrix format.
To get the global stiffness matrix: 

.. code-block:: python

    my_assembly.get_matrix(). 


Set the Problem and the solver
________________________________

The problem should now be defined. Here a Linear problem is created based on the previously defined Assembly.

.. code-block:: python
    
    pb = fd.problem.Linear("MyAssembly") 

The solver can be modified as follow:

.. code-block:: python

    pb.set_solver('cg') #for conjugate gradient solver

For direct solver, it is strongly recommended to install one of
``pypardiso`` (Intel CPUs), ``python-mumps`` (cross-platform, also
required for :meth:`Problem.set_reuse_factorization`) or ``petsc4py``
for drastically improved computation performance. See
:doc:`install` for the recommended commands per platform.

Boundary conditions
_____________________

To apply the boundary conditions, we need to define some list of nodes indices for boundaries.
The boundaries are automatically stored as set of nodes ('left', 'right', 'top', 'bottom', ...) when the function Mesh.BoxMesh is used.

.. code-block:: python

    nodes_left = fd.Mesh['Domain'].node_sets["left"]
    nodes_right = fd.Mesh['Domain'].node_sets["right"]

An easy way to get a set of nodes from the position of nodes is to use the :py:meth:`fedoo.Mesh.find_nodes` method.
For instance, to get the left and right list of nodes with a 1e-10 position tolerance: 

.. code-block:: python

    nodes_left = Mesh['Domain'].find_nodes('X', mesh.bounding_box.xmin, tol=1e-10)
    nodes_right = Mesh['Domain'].find_nodes('X', mesh.bounding_box.xmax, tol=1e-10)

    
Once the list of nodes have been defined, the boundary conditions can be added to the problem. 
The boundary conditions associated to a problem are stored in the attribute pb.bc.
We can add two type of boundary conditions: 'Dirichlet' to prescribed dof values at given nodes
or 'Neumann' (nodal force for mechanical problems). 

.. code-block:: python

    pb.bc.add('Dirichlet',nodes_left, 'Disp', 0) #displacement vector set to 0 on the left    
    
    pb.bc.add('Dirichlet',nodes_right, 'DispY', -10) #displacement along y set to -10 on right


Solve the Problem
__________________________________

.. code-block:: python

    pb.solve()


Analyse and export results
________________________________

See the section :doc:`Post-Processing <post_processing>`

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/core/modelingspace.py (lines 1-50 · chunk range (no structural region))

from fedoo.core.diffop import DiffOp


class ModelingSpace:
    # __ModelingSpace = {"Main"}
    _active = None
    __dic = {}  # dic containing all the modeling spaces

    def __init__(self, dimension, name="Main"):
        """
        Space in which are defined the coordinates and variables (ie functions over coordinates).
        A modeling space is required to be able to define weak equations.

        Parameters
        ----------
        dimension: str in ['2D', '3D', '2Dplane' or '2Dstress']
            Type of modeling space.
            * '2D' or '2Dplane': general 2D problems, with default coordinates 'X' and 'Y' and plane strain assumption
            * '3D' for 3D problems with default coordinates 'X', 'Y' and 'Z'
            * '2Dstress': same as '2D' but using plane stress assumption for mechanical problems
            * '2Daxi': same as '2D' but using axisymmetric assumption for mechanical problems
        name: str, default = 'Main'
            The name of the modeling space

        Example
        --------
        Create a new empty 2D modeling space with plane stress assumption
        >>> import fedoo as fd
        >>> fd.ModelingSpace('2Dstress')
        >>> print(fd.ModelingSpace['Main'].ndim)
        """

        assert isinstance(
            dimension, str
        ), "The dimension value must be a string: '2D', '3D', '2Dplane' or '2Dstress'."
        if dimension == "2D":
            dimension = "2Dplane"
        assert (
            dimension == "3D"
            or dimension == "2Dplane"
            or dimension == "2Dstress"
            or dimension == "2Daxi"
        ), "Dimension must be '2D', '3D', 2Dplane', '2Dstress' or '2Daxi'"

        # Static attributs
        ModelingSpace._active = self
        ModelingSpace.__dic[name] = self

        self.__name = name


## 004 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/examples/01-simple/README.rst (lines 1-7 · enclosing doc section)

Simple examples to start
---------------------------

This section contains several very simple examples that illustrate 
the basics feature of fedoo, like how to create simple meshes, 
apply basics boundary conditions and get the results.
</rag-context>