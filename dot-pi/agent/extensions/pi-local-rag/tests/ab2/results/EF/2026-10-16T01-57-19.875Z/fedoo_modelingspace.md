<rag-context>
[pi-local-rag] RAG subagent: 6 sources, 581 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/core/modelingspace.py (lines 1-50 · chunk range (no structural region))

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

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/examples/rigid_body/rigid_body_cow_bounce.py (lines 1-154 · whole file (short script))

"""Cow bouncing on a plane — NonLinear + IPC contact.

The cow mesh from PyVista is watertight (2903 nodes), decimated for speed.
Full rotation via quaternion, rotation vectors (no gimbal lock).
"""

import os
import time
import numpy as np
import pyvista as pv

import fedoo as fd

from simcoon import Rotation  # required dependency (fedoo imports it at load)

g = 9.81
dt = 5e-4
t_end = 2.0

print("=" * 60)
print("COW BOUNCE — NonLinear + IPC contact")
print("=" * 60)

space = fd.ModelingSpace("3D")
space.new_variable("DispX")
space.new_variable("DispY")
space.new_variable("DispZ")
space.new_vector("Disp", ("DispX", "DispY", "DispZ"))

# Cow mesh
pv_cow = pv.examples.download_cow().triangulate().clean()
size = max(
    pv_cow.bounds[1] - pv_cow.bounds[0],
    pv_cow.bounds[3] - pv_cow.bounds[2],
    pv_cow.bounds[5] - pv_cow.bounds[4],
)
pv_cow = pv_cow.scale(0.3 / size, inplace=False)
pv_cow = pv_cow.translate(
    [-pv_cow.center[0], -pv_cow.center[1], -pv_cow.bounds[4] + 0.5], inplace=False
)
pv_cow = pv_cow.decimate(0.9).triangulate().clean()
cow_mesh = fd.Mesh.from_pyvista(pv_cow)

# Plane
pv_plane = pv.Plane(
    center=(0, 0, 0),
    direction=(0, 0, 1),
    i_size=2.0,
    j_size=2.0,
    i_resolution=8,
    j_resolution=8,
)
plane_mesh = fd.Mesh.from_pyvista(pv_plane.triangulate())

# Rigid body
mass = 1.0
bb = pv_cow.bounds
lx, ly, lz = bb[1] - bb[0], bb[3] - bb[2], bb[5] - bb[4]
I = (mass / 12) * np.diag([ly**2 + lz**2, lx**2 + lz**2, lx**2 + ly**2])

body = fd.constraint.RigidBody(
    cow_mesh,
    mass=mass,
    inertia_tensor=I,
    center_of_mass=np.array(pv_cow.center),
    name="Cow",
)
body.set_force([0, 0, -mass * g])
body.set_rayleigh_damping(1.5)
body.set_static_obstacle(plane_mesh, dhat=0.01)

print(f"  Cow: {cow_mesh.n_nodes} nodes, mass={mass}kg")

# Solve with NonLinear (manual stepping for trajectory)
pb = fd.problem.NonLinear(body.assembly)
pb.set_time_integrator(fd.time.SECOND_ORDER, fd.time.Newmark())
pb.initialize()

idx = body.assembly._dof_indices
q_hist = [np.zeros(6)]
t_hist = [0.0]
n_steps = int(round(t_end / dt))

t0 = time.time()
for step in range(n_steps):
    pb.dtime = dt
    pb.solve_time_increment()
    pb.set_start()
    dof = pb.get_dof_solution()
    q_hist.append(dof[idx].copy())
    t_hist.append((step + 1) * dt)
    if step % 500 == 0:
        n_c = (
            len(body.assembly._ipc_collisions)
            if body.assembly._ipc_collisions is not None
            else 0
        )
        print(
            f"    t={(step+1)*dt:.2f}s  z={body.center_of_mass[2]+dof[idx[2]]:.3f}m  contacts={n_c}"
        )

elapsed = time.time() - t0
t_hist = np.array(t_hist)
q_hist = np.array(q_hist)
z_hist = body.center_of_mass[2] + q_hist[:, 2]
print(
    f"\n  {len(t_hist)} steps in {elapsed:.1f}s ({elapsed / len(t_hist) * 1000:.1f}ms/step)"
)
print(f"  z_min={z_hist.min():.4f}m")

# Animation
_here = os.path.dirname(__file__) if "__file__" in globals() else os.getcwd()
gif_path = os.path.join(_here, "rigid_body_cow_bounce.gif")
fps = 25
frame_skip = max(1, int(1.0 / (fps * dt)))
frame_indices = np.arange(0, len(t_hist), frame_skip)

vis_cow = pv_cow.copy()
pts_ref = vis_cow.points.copy()
center = body.center_of_mass
vis_plane = pv.Plane(
    center=(0, 0, 0),
    direction=(0, 0, 1),
    i_size=2.0,
    j_size=2.0,
    i_resolution=10,
    j_resolution=10,
)

pl = pv.Plotter(window_size=[900, 600], off_screen=True)
pl.set_background("white")
pl.add_mesh(vis_plane, color="lightgrey", opacity=0.8, show_edges=True)
pl.add_mesh(vis_cow, color="sandybrown", smooth_shading=True)
pl.camera_position = [(1.5, -1.5, 1.0), (0, 0, 0.25), (0, 0, 1)]
pl.open_gif(gif_path, fps=fps)

for i in frame_indices:
    qi = q_hist[i]
    R = Rotation.from_rotvec(qi[3:]).as_matrix()
    vis_cow.points[:] = (pts_ref - center) @ R.T + center + qi[:3]
    vis_cow.GetPoints().Modified()
    pl.add_text(
        f"t={t_hist[i]:.2f}s  z={z_hist[i]:.3f}m",
        position="upper_edge",
        font_size=11,
        color="black",
        name="title",
    )
    pl.render()
    pl.write_frame()

pl.close()
print(f"  Saved: {gif_path}")


## 004 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/examples/01-simple/README.rst (lines 1-7 · enclosing doc section)

Simple examples to start
---------------------------

This section contains several very simple examples that illustrate 
the basics feature of fedoo, like how to create simple meshes, 
apply basics boundary conditions and get the results.


## 005 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 91446-91645 · enclosing doc section)

Controls the display and style of the working plane.
DATABASE (p.13):Working Plane (p.15)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
SNAP
Snap increment for a locational pick (1E-6 minimum). If -1, turn off snap capability. For example, a
picked location of 1.2456 with a snap of 0.1 gives 1.2, with 0.01 gives 1.25, with 0.001 gives 1.246,
and with 0.025 gives 1.250 (defaults to 0.05).
GRSPAC
Graphical spacing between grid points. For graphical representation only and not related to snap
points (defaults to 0.1).
GRMIN, GRMAX
Defines the size of a square grid (if WPCTYP = 0) to be displayed over a portion of the working
plane. The opposite corners of the grid will be located at grid points nearest the working plane
coordinates of (GRMIN,GRMIN) and (GRMAX,GRMAX). If a polar system (WPCTYP = 1), GRMAX is the
outside radius of grid and GRMIN is ignored. If GRMIN = GRMAX, no grid will be displayed (defaults
to -1.0 and 1.0 for GRMIN and GRMAX respectively).
WPTOL
The tolerance that an entity's location can deviate from the specified working plane, while still being
considered on the plane. Used only for locational picking of vertices for polygons and prisms (defaults
to 0.003).
WPCTYP
Working plane coordinate system type:
0
Cartesian (default). If working plane tracking is on (CSYS (p. 458),4), the updated active co-
ordinate system will also be Cartesian.
1
Polar. If working plane tracking is on, the updated active coordinate system will be cylindrical.
2251
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
WPSTYL

2
Polar. If working plane tracking is on, the updated active coordinate system will be spher-
ical.
GRTYPE
Grid type:
0
Grid and WP triad.
1
Grid only.
2
WP triad only (default).
WPVIS
Grid visibility:
0
Do not show GRTYPE entities (grid and/or triad) (default).
1
Show GRTYPE entities. Cartesian working planes will be displayed with a Cartesian grid,
polar with a polar grid.
SNAPANG
Snap angle (0--180) in degrees. Used only if WPCTYP = 1 or 2. Defaults to 5 degrees.
Command Default
Snap capability on with an increment of .05, spacing between grid points of 0.1, Cartesian coordinate
system, WP triad displayed, and a tolerance of .003.
Notes
Use WPSTYL (p. 2251),DEFA to reset the working plane to its default location and style. Use WP-
STYL (p. 2251),STAT to list the status of the working plane. Blank fields will keep present settings.
It is possible to specify SNAP and WPTOL values that will cause conflicts during picking operations.
Check your values carefully, and if problems are noted, revert to the default values.
WPSTYL (p. 2251) with no arguments will toggle the grid on and off. The working plane can be displayed
in the non-GUI interactive mode only after issuing a /PLOPTS (p. 1482),WP,1 command. See the Modeling
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
2252
WPSTYL

and Meshing Guide for more information on working plane tracking. See /PLOPTS (p. 1482) command for
control of hidden line working plane.
This command is valid in any processor.
Menu Paths
Main Menu>Preprocessor>Modeling>Create>Circuit>Set Grid
Utility Menu>List>Status>Working Plane
Utility Menu>WorkPlane>Display Working Plane
Utility Menu>WorkPlane>Offset WP by Increments
Utility Menu>WorkPlane>Show WP Status
Utility Menu>WorkPlane>WP settings
WRFULL,Ldstep
Stops solution after assembling global matrices.
SOLUTION (p.38):Load Step Options (p.43)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Ldstep
Specify action to take:
OFF or 0
Turn off feature (default)
N
Turn on feature and set it to stop after assembling the global matrices and writing the .full
file for load step N.
Command Default
By default the WRFULL command is turned OFF.
Notes
This command is used in conjunction with the SOLVE (p. 1893) command to generate the assembled
matrix file (.full file) only. The element matrices are assembled into the relevant global matrices for
the particular analysis being performed and the .full file is written. Equation solution and the output
of data to the results file are skipped. To dump the matrices written on the .full file into Harwell-
Boeing format, use the HBMAT (p. 918) command in /AUX2. To copy the matrices to a postscript format
that can be viewed graphically, use the PSMAT (p. 1591) command.
To use the LSSOLVE (p. 1121) macro with this command, you may need to modify the LSSOLVE (p. 1121)
macro to properly stop at the load step of interest.
2253
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
WRFULL

This command only valid for linear static, full harmonic, and full transient analyses when the sparse
direct solver is selected. This command is also valid for buckling or modal analyses with any mode ex-
traction method. This command is not valid for nonlinear analyses. It is not supported in a linear per-
turbation analysis.
In general, the assembled matrix file .full contains stiffness, mass, and damping matrices. However,
the availability of the matrices depends on the analysis type chosen when the file is written. Some
analyses do not write the matrices individually but instead write combined matrices. For example, a full
transient writes a combined stiffness/mass/damping matrix to the full file.
Menu Paths
Main Menu>Preprocessor>Loads>Load Step Opts>Stop Solution
Main Menu>Solution>Load Step Opts>Stop Solution
WRITE,Fname
Writes the radiation matrix file.
AUX12 (p.63):Radiation Matrix Method (p.63)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Fname
File name and directory path (248 characters maximum, including the characters needed for the
directory path). An unspecified directory path defaults to the working directory; in this case, you
can use all 248 characters for the file name.
The file name Defaults to Jobname.
Notes
Writes radiation matrix file (File.sub) for input to the substructure thermal "use" pass. Subsequent
WRITE (p. 2254) operations to the same file overwrite the file.
Menu Paths
Main Menu>Radiation Opt>Matrix Method>Write Matrix
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
2254
WRITE

WRITEMAP,Fname
Writes interpolated pressure data to a file.
/MAP (p.64):Pressure Mapping (p.64)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Fname
File name and directory path (248 characters maximum, including the characters needed for the
directory path). An unspecified directory path defaults to the working directory; in this case, you
can use all 248 characters for the file name.
Notes
Writes the interpolated pressure data to the specified file. The data is written as SFE (p. 1832) commands
applied to the SURF154 elements that are on the target surface. You may read this data for inclusion
in an analysis by using /INPUT (p. 980),Fname.
Menu Paths
This command cannot be accessed from a menu.
*WRK,Num
Sets the active workspace number.
APDL (p.19):Matrix Operations (p.22)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Argument Descriptions
Num
Number of the active memory workspace for APDLMath vector and matrices. All the following AP-
DLMath vectors and matrices will belong to this memory workspace, until the next call to the
*WRK (p. 2255) command. By default, all the APDLMath objects belong to workspace number 1.
Notes
This feature enables you to associate a set of vector and matrices in a given memory workspace, so
that you can easily manage the free step:
*VEC,V,D,ALLOC,5  ! V belongs to the default Workspace 1
*WRK,2     ! Set the active workspace as the number 2
*VEC,W,D,IMPORT,FULL,file.full,RHS ! W belongs to the Workspace 2
*SMAT,K,D,IMPORT,FULL,file.full,STIFF ! K belongs to the Workspace 2 
*DMAT,M,ALLOC,10,10    ! M belongs to the Workspace 2 
… 
*FREE,WRK,2   ! W, K and M are deleted, but not V  
2255
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
*WRK

*PRINT,V
This feature can be useful to free all the temporary APDLMath variables inside a MACRO in one call.
Menu Paths
This command cannot be accessed from a menu.
WSPRINGS
Creates weak springs on corner nodes of a bounding box of the currently selected elements.
SOLUTION (p.38):Misc Loads (p.46)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Notes
This command invokes a predefined Mechanical APDL macro that is used during the import of loads
from the ADAMS program into Mechanical APDL.
The command creates weak springs on the corner nodes of the bounding box of the currently selected
elements. The six nodes of the bounding box are attached to ground using COMBIN14 elements. The
stiffness is chosen as a small number and can be changed by changing the real constants of the COM-
BIN14 elements.
The command works only for models that have a geometric extension in two or three dimensions. One-
dimensional problems (pure beam in one axis) are not supported.
For more information about how WSPRINGS (p. 2256) is used during the transfer of loads from the ADAMS
program to Mechanical APDL, see Import Loads into Mechanical APDL.
Distributed-Memory Parallel (DMP) Restriction 
This command is not supported in a DMP solution.
Menu Paths
Main Menu>Solution>ADAMS Connection>Import fr ADAMS
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
2256
WSPRINGS


## 006 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Basic_Analysis_Guide.txt (lines 12971-13073 · enclosing doc section)

20.5. Understanding Memory Error Messages
This model requires more scratch space than available. Mechanical APDL has currently allocated
YY MB and was not able to allocate enough additional memory in order to proceed. Please increase
the virtual memory on your system, and/or increase the work space memory and rerun Mechan-
ical APDL. Problem terminated.
(Sparse and Block Lanczos solvers only): There is not enough memory for the <Sparse or
Block Lanczos> solver to proceed. Please increase the virtual memory on your system and/or
301
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Understanding Memory Error Messages

increase the work space memory and re-run Mechanical APDL. Memory currently allocated for
the <Sparse or Block Lanczos> solver = YY MB.
(Sparse and Block Lanczos solvers only): There is not enough memory for the <Sparse or
Block Lanczos> solver to proceed. Please increase the virtual memory on your system and/or
increase the work space memory and re-run Mechanical APDL. Memory currently allocated for
the <Sparse or Block Lanczos> solver = YY MB. Memory currently required for the <Sparse
or Block Lanczos> solver to continue = YYY MB.
(Distributed Sparse and Block Lanczos solvers only): There is not enough memory for the Distrib-
uted <Sparse or Block Lanczos> solver to proceed. Please increase the virtual memory on
your system and/or increase the work space memory and re-run Mechanical APDL. Memory cur-
rently allocated by ANSYS = YY MB. Memory allocation attempted = YYY MB. Largest block of
Mechanical APDL memory available for the Distributed <Sparse or Block Lanczos> solver
= YYYY MB.
The messages listed above may occur while you are running Mechanical APDL.
This type of message appears when you are running the program in dynamic memory mode and
the program has attempted to allocate additional memory, but it failed because it could not find a
large enough contiguous block of memory to proceed.
Specifying a higher -m value on the program execution command and executing the program again
may help. However, if a large enough block of memory is still unavailable, changing the -m value
will not help. You can also try decreasing the database size to help free up more work space, allowing
you to continue with the analysis. Increasing the system virtual memory may also help. Try increasing
the system virtual memory so that the physical memory (RAM) plus the virtual memory comfortably
exceeds the memory available at the failure point (shown in the error message).
For more information, see Memory Management and Configuration (p. 293).
The memory (-m) size requested is not currently available. Reenter thr command line with less
memory requested.
The database (-db) space requested is not currently available. Reenter the command line with
less database space requested.
Either message may occur at program startup.
The memory used by the program resides within the system virtual memory. The required system
virtual memory for the amount of memory that you requested for either the work space (-m) or
database space (-db) for the program (via either the program command line or the configuration
file) is not currently available. Request less work space or database space if possible and execute
the program again. If the initial requested memory is required, then wait until sufficient system
virtual memory is free and try again.
Another alternative is to increase the system's virtual memory (use the System icon in the Control
Panel in Windows).
The memory (-m) size requested cannot currently be addressed using dynamic memory mode.
Mechanical APDL addressing can be changed by turning on fixed memory via the -f command
line option.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
302
Memory Management and Configuration

This message may occur at startup.
Include the -f command line option on the program execution command to remedy the problem.
For more information, see Memory Management and Configuration (p. 293).
This model requires more scratch space than ANSYS can address in dynamic memory mode.
Mechanical APDL addressing can be changed by turning on fixed memory via the -f command
line option. Problem terminated.
This message may occur while you are running Mechanical APDL.
Include the -f command line option on the program execution command to remedy the problem.
For more information, see Memory Management and Configuration (p. 293).
This model requires more scratch space than available, currently XX words (YY MB). The scratch
space may be increased by increasing the work space, currently XX words (YY MB), via the
Mechanical APDL command line memory option. Problem terminated.
This message may occur while you are running Mechanical APDL.
If you are running the program in dynamic memory mode and the internal calculations that the
program is trying to perform cannot fit in the scratch space, the program will attempt to allocate
additional memory to meet the requirements. However, this message may still appear if:
• Some portions of the program cannot use the additional memory that was allocated or allocate
the memory when it is needed. The processing that the program was trying to perform when
this message appeared took place in one of these portions.
• You used the -f command line switch so that the program would use a fixed-mode memory
addressing scheme. Thus, no dynamic memory allocation is allowed.
If you receive this message, specify a higher -m value on the program execution command or change
your -f command line option and execute the program again.
For more information, see Memory Management and Configuration (p. 293).
303
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Understanding Memory Error Messages

Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
304

Chapter 21:Troubleshooting
Pop-up windows not visible
When you run Mechanical APDL using more than one screen, a pop-up window may not appear on
any of them, causing the GUI to seem frozen. This can occur because the window opens off-screen,
making it impossible to reach. To avoid this potential problem, use only one screen.
305
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
306
</rag-context>