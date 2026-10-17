<rag-context>
[pi-local-rag] RAG subagent: 9 sources, 2400 ms retrieval.
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

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Documentation_technique/Quick_Start.rst (lines 1-159 · enclosing doc section)

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

## 004 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/docs/quick_start.rst (lines 1-159 · enclosing doc section)

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

## 005 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/core/modelingspace.py (lines 1-50 · chunk range (no structural region))

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


## 006 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/core/modelingspace.py (lines 1-50 · chunk range (no structural region))

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


## 007 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/examples/01-simple/README.rst (lines 1-7 · enclosing doc section)

Simple examples to start
---------------------------

This section contains several very simple examples that illustrate 
the basics feature of fedoo, like how to create simple meshes, 
apply basics boundary conditions and get the results.


## 008 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/examples/01-simple/README.rst (lines 1-7 · enclosing doc section)

Simple examples to start
---------------------------

This section contains several very simple examples that illustrate 
the basics feature of fedoo, like how to create simple meshes, 
apply basics boundary conditions and get the results.


## 009 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/Ansys-mechanical-apdl-technology-demonstration-guide.txt (lines 14282-14481 · enclosing doc section)

Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
380
Modal and Harmonic Frequency Analyses of an Automotive Suspension Assembly
Using CMS

The following table shows the elapsed and CPU times for modal analysis using the full and CMS models
for 100 frequencies. Significant improvement in solution time is achieved during the use pass via the
CMS method.
Table 25.2:  Comparison of CPU and Elapsed Times for Modal Analysis
CMS Fixed Interface
Full
Model
No of Modes =
100
2022.670
Gen
Pass
2034.280
CPU Time (s)
4.630
Use
Pass
1336.000
Gen
Pass
1291.000
Elapsed Time (s)
3.000
Use
Pass
25.7.2. Full Harmonic Analysis Comparison of Accuracy and Efficiency
The harmonic analysis is conducted over the frequency range of 162 Hz to 200 Hz in 20 substeps. The
following table compares the CMS and full model response amplitudes for the two response nodes.
Table 25.3:  Comparison of Response Amplitudes for Full and CMS Models
Node # 63134
Node # 63121
% Diff
CMS
Fixed
Interface
Full
Model
Freq (Hz)
% Diff
CMS
Fixed
Interface
Full
Model
Freq (Hz)
0.78
43.7604
44.1064
162
0.25
39.7493
39.65
162
0.93
48.237
48.6884
164
0.05
40.896
40.8758
164
1.01
51.9039
52.4358
166
0.10
41.9335
41.9754
166
1.07
55.4024
56.0015
168
0.21
43.4692
43.5616
168
1.11
59.0597
59.7247
170
0.30
45.7711
45.9102
170
1.16
62.7696
63.5063
172
0.38
48.7638
48.9518
172
1.22
65.905
66.7185
174
0.46
51.9681
52.2104
174
1.30
67.3727
68.2576
176
0.55
54.4813
54.7814
176
1.39
66.1534
67.0837
178
0.63
55.3164
55.668
178
1.48
62.1716
63.1036
180
0.70
54.1044
54.4876
180
1.56
56.4547
57.3466
182
0.75
51.3783
51.7678
182
1.62
50.3119
51.1398
184
0.78
48.0481
48.4247
184
1.67
44.6201
45.3776
186
0.78
44.8127
45.1665
186
1.71
39.7395
40.4304
188
0.77
42.0154
42.3427
188
1.74
35.7165
36.3475
190
0.75
39.7523
40.0521
190
1.75
32.4621
33.0387
192
0.71
37.9946
38.2657
192
1.73
29.8435
30.3676
194
0.65
36.6556
36.8948
194
1.66
27.7175
28.1851
196
0.56
35.6126
35.8121
196
381
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
Results and Discussion
</rag-context>