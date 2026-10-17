<rag-context>
[pi-local-rag] RAG subagent: 3 sources, 272 ms retrieval.
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

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/Ansys-mechanical-apdl-technology-demonstration-guide.txt (lines 10435-10634 · enclosing doc section)

---
---
Use pass time
78.06 seconds
372.68 seconds
42.5 seconds
Total CPU time (including
full-model save, generation pass,
267
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
Results and Discussion

CMS and Rigid
Parts
Flexible and
Rigid Parts
All Rigid Parts
use pass, expansion pass, and
results processing)
In all cases, shared memory parallel with two CPUs is used. The results are reported for a 64-bit Linux
system.
The table and the other results discussed illustrate some essential analysis considerations:
• It is worthwhile to verify the kinematic behavior of the multibody system by assuming all parts as rigid,
as the time and resources required for the rigid analysis are small.
• Modeling the flexible bodies using CMS superelements results in significant time savings.
• Analysis of the assembly when the flexible part is modeled with 3-D finite elements necessarily requires
more time due to the increased number of degrees of freedom. Such an analysis, however, should be
performed only when the flexible part undergoes large deformations, either due to nonlinear material
behavior or to nonlinear geometric effects.
18.8. Recommendations
To perform a similar transient dynamic analysis of a multibody system, consider the following hints and
recommendations:
• Ensure that the motion and behavior of the model is kinematically consistent by modeling all parts as
rigid bodies connected to each other by joints.
• Relax overconstraints due to joints by selecting joints of similar behavior. Use a spherical or cylindrical
joint instead of a revolute joint if some constraints are deemed unnecessary.
• When modeling flexible parts, build the model incrementally and verify that the motion and behavior
are consistent with expected behavior.
• Use full modeling of the parts only when detailed information about the stress and deformation fields
is required.
• For reduced run times, model the flexible parts as CMS superelements whenever possible.
For additional recommendations, see Troubleshooting a Flexible Multibody Analysis in the Multibody
Analysis Guide.
18.9. Input Files
The following files were used in this problem:
• DiggerArm-Rigid.dat -- Input file for all parts modeled as rigid.
• DiggerArm-Rigid.inp -- Rigid model information (called by DiggerArm-Rigid.dat).
• DiggerArm-Flexible.dat -- Input file for connecting rods modeled as flexible using SOLID185 elements.
• DiggerArm-Flexible.inp -- Flexible model information (called by DiggerArm-Flexible.inp).
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
268
Transient Dynamic Analysis of a Digger-Arm Assembly

• DiggerArm-CMS.dat -- Input file for modeling the flexible connecting rods as CMS superelements.
• DiggerArm-CMS.inp -- CMS superelement model information (called by DiggerArm-CMS.dat).
The files are available in the td-19 folder. See Obtaining the Input Files for more information.
269
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
Input Files

Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
270

Chapter 19: Dynamic Simulation of a Printed Circuit Board Assembly
Using Modal Analysis Methods
This example demonstrates the use of residual vectors to improve the solution accuracy in modal sub-
space based analysis methods, such as modal superposition and power spectral density (PSD) analyses.
The problem includes a study of the computational efficiency of the results-expansion procedure used
to obtain the full model solution.
Topics related to this example problem follow:
19.1. Introduction
19.2. Problem Description
19.3. Modeling
19.4. Material Properties
19.5. Boundary Conditions and Loading
19.6. Analysis and Solution Controls
19.7. Results and Discussion
19.8. Recommendations
19.9. References
19.10. Input Files
19.1. Introduction
Portable electronic devices such as digital cameras, mobile phones, and PDAs use printed circuit boards
(PCBs). Due to increased demands for convenience and multi-functionality, these devices are designed
with a focus on miniaturization to accommodate a higher density and smaller dimensions of integrated
circuit (IC) packages. These design constraints require smaller solder joints with finer pitch, contributing
to the vulnerability of interconnections at the board level. Exposure to harsh dynamic loading environ-
ments during transportation and customer use are a critical issue for PCBs. PSD analysis simulates the
random excitations with unknown loading encountered in these harsh conditions.
The modal superposition method efficiently solves a large linear dynamic system by transforming it
into a set of uncoupled equations using the normal modes of the system. The first step in the modal
superposition method is to obtain the eigen frequencies and eigen modes of the system through
modal analysis. The downstream modal transient, modal harmonic, and spectral analyses are then per-
formed.
In the modal analysis, only a subset of the lower frequencies is usually extracted, truncating the higher
frequency modes. As a result, the accuracy of the modal subspace based solution is not guaranteed,
though accuracy can be improved using residual vectors. The residual vectors are calculated and nor-
malized to the modes extracted, and can then be used in all the downstream analyses (e.g., modal
transient, modal harmonic, and spectral analyses).
The efficiency of the modal superposition expansion pass has been improved using a direct combination
approach of stress/strain modes. You can activate the expansion in the modal analysis by applying the
element results expansion option.
271
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.

19.2. Problem Description
The model below is a PCB assembly consisting of three PCBs stacked together. A PSD analysis with base
excitation using acceleration response spectrum is performed on this model. The aim is to determine
the 1-σ displacement solution and compare the accuracy of results with and without the residual vectors.
Improvement of the computational efficiency is verified via modal superposition expansion (MXPAND).
Figure 19.1:  Full 3-D Geometry of a PCB assembly
19.3. Modeling
This section describes the detailed modeling of the PCB assembly. The following modeling topics are
covered:
19.3.1. Modeling of the PCB Structure
19.3.2. Contact Modeling
19.3.1. Modeling of the PCB Structure
The assembly consists of three PCBs stacked together. Each PCB consists of a circuit board with IC
packages on top. The board is a 0.20m×0.28m rectangular surface body with a 1 mm uniform thickness.
The IC packages are 3-D structures, each with a thickness of 5 mm. The board is modeled with SHELL181,
which is suitable for analyzing thin to moderately thick shell structures. The IC packages are modeled
with SOLID186, which is a 3-D 20 noded solid element, exhibiting quadratic displacement behavior.
The stack is connected together by five vertical columns. These are thick beam structures (length/dia-
meter 
 10), and they are modeled using BEAM188.
BEAM188 uses Timoshenko beam theory, which includes shear deformation effects, and is one of the
most accurate beam elements for analyzing moderately stubby beam structures. A hexahedral dominant
mesh is used to mesh the board and the solids, resulting in each PCB having 14600 nodes. Both the
board and the IC packages are made of polyethylene material. The supporting columns are made of
aluminum alloy. The total number of nodes for the model is 44097 with 26046 elements.
19.3.2. Contact Modeling
Bonded and flexible surface-to-surface contact pairs are used to define the contact between the IC
packages and the circuit board. Contact and target surfaces are used to connect the IC packages to the
board. The contact surface is modeled with CONTA174 elements and the target surfaces are modeled
using TARGE170 elements. The surface-to-surface contact elements have the following advantages over
the node-to-node elements:
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
272
Dynamic Simulation of a Printed Circuit Board Assembly Using Modal Analysis
Methods

• Support for lower and higher order elements on the contact and target surfaces. (SHELL181 is a linear element,
whereas SOLID186 is a quadratic element)
• No restrictions on the shape of the target surface. Surface discontinuities can result from manufacturing
flaws or mesh discretization.
For each board, fifteen contact pairs are identified, as seen in the figure below.
Figure 19.2:  Bonded Contact Pairs Between IC Packages and Circuit Boards
19.4. Material Properties
Material properties for the supporting columns, board, and IC packages are as follows:
Supporting Column Material Properties
71.0e3
Young's Modulus
(ton/s2mm)
0.33
Poisson's Ratio
2.77e-009
Density (ton/mm3)
Board and IC Packages Material Properties
1.1e3
Young's Modulus
(ton/s2mm)
0.42
Poisson's Ratio
9.5e-010
Density (ton/mm3)
19.5. Boundary Conditions and Loading
The boards of the PCB assembly are connected with five supporting columns. The base of the columns
(y = -60) are constrained on all degrees of freedom as shown in the figure below:
273
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
Boundary Conditions and Loading

Figure 19.3:  PCB Boundary Conditions
The following example input shows how the fixed constraints are applied:
CM, N_BASE_EXCITE, NODE           ! Group the set of nodes at the base of the columns as a component
D, ALL, ALL                       ! Apply displacement and rotation constraints to this set
N_BASE_EXCITE in the input above specifies the nodes at the junction of the supporting columns with
the base. For PSD analysis, the loading is applied in the form of base excitation on the set
N_BASE_EXCITE.
The PSD values for the input spectrum at different frequency points are shown in the figure below. The
input segment between 1.0E-02 and 1.0E+01 has 2 intermediate points in order to obtain a good fit
for the curve-fitting polynomial used in the PSD integration process.
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
274
Dynamic Simulation of a Printed Circuit Board Assembly Using Modal Analysis
Methods

Figure 19.4:  PSD Base Excitation Values
The following example input shows how base excitation is applied:
/SOLU   
ANTYPE, SPECTR                                         ! Perform a spectral analysis
SPOPT, PSD                                             ! Use power spectral density (PSD) as the spectrum 
                                                       ! type

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/docs/quick_start.rst (lines 1-159 · enclosing doc section)

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
</rag-context>