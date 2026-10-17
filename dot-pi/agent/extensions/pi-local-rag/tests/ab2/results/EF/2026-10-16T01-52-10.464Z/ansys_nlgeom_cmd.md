<rag-context>
[pi-local-rag] RAG subagent: 5 sources, 1305 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 2198-2397 · enclosing doc section)

of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Set the Real Constants and Element KEYOPTS

Real constant defaults can vary depending on the environment you are working in. The following
table compares the program default values with those of the Ansys Workbench product.
Table 3.1: Summary of Real Constant Defaults in Different Environments
Ansys
Workbench
Default
Ansys
Mechanical
APDL
Default
Description
Real Constants
Name
No.
n/a
0
Radius associated with target
geometry
R1 [4]
1
Calculated
by
program
Target radius (CONTA177)
n/a
0
Radius associated with target
geometry
R2 [4]
2
1
Superelement thickness
Calculated
by
program
Contact radius (CONTA177)
[1]
1
Normal penalty stiffness factor
FKN
3
0.1
0.1
Penetration tolerance factor
FTOLN
4
[2]
[2]
Pinball region
PINB
6
[7]
[7]
Pressure at zero penetration
PZER
7
0.01
0.01
Initial contact clearance factor
CZER
8
1.00E+20
1.00E+20
Maximum friction stress
TAUMAX
9
0
0
Contact surface offset
CNOF
10
1
1
Contact opening stiffness
FKOP
11
1
1
Tangent penalty stiffness factor
FKT
12
0
0
Contact cohesion
COHE
13
[3]
0
Thermal contact conductance
TCC
14
1
1
Frictional heating factor
FHTG
15
n/a
0
Stefan-Boltzmann constant
SBCT
16
n/a
1
Radiation view factor
RDVF
17
0.5
0.5
Heat distribution weighing factor
FWGT
18
[6]
0
Electric contact conductance
ECC
19
n/a
1
Joule dissipation weighting factor
FHEG
20
1
1
Static/dynamic ratio
FACT
21
0
0
Exponential decay coefficient
DC
22
1%
1%
Allowable elastic slip
SLTO
23
[5]
[5]
Maximum allowable tensile contact
pressure
TNOP
24
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
40
Surface-to-Surface Contact (Pair-Based)

Ansys
Workbench
Default
Ansys
Mechanical
APDL
Default
Description
Real Constants
Name
No.
2
2
Target edge extension factor
TOLS
25
n/a
0
Magnetic contact permeance
MCC
26
n/a
0
Pressure-penetration criterion
PPCN
27
n/a
0.01
Fluid penetration acting time
FPAT
28
1
1
Coefficient of restitution
COR
29
1 [8]
1 [8]
Load step number for ramping
penetration
STRM
30
n/a
1
Normal stabilization damping factor
FDMN
31
n/a
0.001
Tangential stabilization damping

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 4522-4721 · enclosing doc section)

2.13. Mapping Processor Commands
The /MAP (p. 1143) processor allows you to map data from an external file onto the existing geometry.
Table 2.100: Pressure Mapping
These commands read pressure data from an external file and map it onto a geometry.
Specifies the file type and the pressure type for the subsequent
import of source points and pressures.
FTYPE (p. 810)
Maps pressures from source points to target surface elements.
MAP (p. 1141)
Enters the mapping processor.
/MAP (p. 1143)
Plots target and source geometries.
PLGEOM (p. 1465)
Plots target and source pressures.
PLMAP (p. 1467)
Reads coordinate and pressure data from a file.
READ (p. 1634)
Specifies the target nodes for mapping pressure onto surface effect
elements.
TARGET (p. 1969)
Writes interpolated pressure data to a file.
WRITEMAP (p. 2255)
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
64
Command Groupings

Chapter 3: Command Dictionary
This chapter contains a dictionary of the Mechanical APDL commands, listed in alphabetical order. The
star (*) and slash (/) of the star and slash commands are ignored for alphabetization (for example, the
/SHOW (p. 1855) command appears between the SHELL (p. 1854) and SHPP (p. 1858) commands). As in a
dictionary, keywords are located at the top of each page (in the printed version only) indicating the
first and last commands contained on that page.
The following section documents the components of a command description.
Components of a Command Description
SAMPLECMD,Key
Specifies whether to use automatic time stepping or load stepping.
SOLUTION: Load Step Options
Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Argument Descriptions
Key
Automatic time stepping key:
OFF -- 
Do not use automatic time stepping
ON -- 
Use automatic time stepping.
Default: No automatic time stepping.
Notes
Specifies whether to use automatic time stepping (or load stepping) over this load step. If Key = ON,
both time step prediction and time step bisection will be used. Used only if DTIME (specified on the
DELTIM (p. 533) command) is less than the time span or conversely, if NSBSTP (on the NSUBST (p. 1331)
command) is greater than one.
This command is also valid in PREP7.
65
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

Product Restrictions
Ansys Mechanical Enterprise 
Key = OFF is only valid with the Ansys Mechanical Enterprise family of products (Ansys Mechanical
Enterprise, Ansys Mechanical Enterprise PrepPost, and Ansys Mechanical Enterprise Solver).
Menu Paths
Main Menu> Preprocessor >Loads> Load Step Opts> Time/Frequenc> Freq and Substps
Main Menu> Preprocessor> Loads> Load Step Opts> Time/Frequenc> Time - Time Step
Main Menu> Solution> Load Step Opts> Time/Frequenc> Freq and Substps
Main Menu> Solution> Load Step Opts> Time/Frequenc> Time - Time Step
Features Documented in Mechanical APDL Commands
The first line of the command description shows the command name followed by the argument names
(if any). The second line summarizes the command function. The summary is not intended to be all in-
clusive:
SAMPLECMD,Key
Specifies whether to use automatic time stepping or load stepping.
Listed on the next line are codes that will help you find other commands in the program with related
functionality.
SOLUTION: Load Step Options
Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
There is at least one group code for each command. "SOLUTION: Load Step Options" is the code in the
example above. The portion of the code before the colon (:) tells which of the tables in Command
Groupings (p. 11) the command can be found in. These tables represent major groupings, such as
PREP7 or APDL commands. In the example above, SOLUTION commands are found in SOLUTION Com-
mands (p. 38). Most of these major groupings are processors, and in those cases the command can be
entered only when in that processor. Any exceptions are noted under "Notes" later in the description.
The portion of the code after the colon is the subtable in Command Groupings (p. 11) containing the
command. The subtables list commands that functionally relate to each other. In the example, "Load
Step Options" means that the command can be found in Table 2.52: Load Step Options (p. 43), a subtable
of SOLUTION Commands (p. 38), with other load step option commands.
If you are viewing this reference in the Mechanical APDL Help System, just click on the code to follow
the link to the corresponding table. Then click on any of the commands in the table, to follow the link
to its description.
If you are reading the printed version, simply turn to the appropriate table in Command Groupings (p. 11).
The table lists the page number where the command is documented.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
66
Command Dictionary

The next line displays a series of product codes, which may contain all of the Mechanical APDL product
codes:
Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
or a subset of them:
Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
For more information on product codes, see Valid Products (p. 2).
Following this "product code" line is the description of all arguments, if any, of the command:
Key
Automatic time stepping key:
OFF -- 
Do not use automatic time stepping (default).
ON -- 
Use automatic time stepping.
The argument is described and, where necessary, valid choices for the argument are described. Many
arguments list defaults, which are the values assumed for that argument if you enter the command but
leave the argument blank. On the other hand, shown after the argument descriptions is often another
default:
Command Default
No automatic time stepping.
This is the command default. This is the specification assumed by the program if you do not enter the
command at all. Only commands that set specifications (specification commands) have defaults listed.
Commands that cause some action, such as performing some calculation, are called action commands
and simply do not perform the action if the command is not entered. Defaults are not listed for action
commands.
Following the default listing are any notes about the command. These notes expand on the summary
description given up near the command format, and describe any other behavior, restrictions, suggestions,
etc. of that command:
Notes
Specifies whether to use automatic time stepping (or load stepping) over this load step. If Key = ON,
both time step prediction and time step bisection will be used. Used only if DTIME (specified on the
DELTIM (p. 533) command) is less than the time span or conversely, if NSBSTP (on the NSUBST (p. 1331)
command) is greater than one.
This command is also valid in PREP7.
67
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

If the command behaves differently, or has restrictions, in any of the various Ansys products, those
differences are described in the Product Restrictions section:
Product Restrictions
Ansys Mechanical Enterprise 
Key = OFF is only valid with the Ansys Mechanical Enterprise family of products (Ansys Mechanical
Enterprise, Ansys Mechanical Enterprise PrepPost, and Ansys Mechanical Enterprise Solver).
Menu Paths
Main Menu >Preprocessor> Loads> Load Step Opts> Time/Frequenc> Freq and Substps
Main Menu >Preprocessor> Loads> Load Step Opts> Time/Frequenc> Time - Time Step
Main Menu> Solution> Load Step Opts> Time/Frequenc >Freq and Substps
Main Menu> Solution> Load Step Opts> Time/Frequenc> Time - Time Step
These menu paths are intended as guides to help you find the commands in the GUI. Be aware, however,
that often the paths are valid only if some other command has been previously issued. For example,
you won't be able to follow a path to transient analysis options if you have not selected a transient
analysis in the first place.
Not all commands are directly accessible through the menu (although some of them may be generated
indirectly by some menu function). Such cases are indicated by the following statement in the menu
path listing:
Menu Paths
This command cannot be accessed directly in the menu.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
68
Command Dictionary

Connection Commands
~CAT5IN,Name,Extension,Path,Entity,FMT,NOCL,NOAN
Transfers a .CATPart file into the Mechanical APDL program.
CAD Import
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Name
The name of a valid .CATPart file, created with CATIA Version 5.0. The first character of the file
name must be an alphanumeric.
Extension
The extension for the file. The default extension is .CATPart.
Path
The path name of the directory in which the file resides enclosed in single quotes. The default path
name is the current working directory.
Entity
Entity to be imported.
SOLIDS
Solids only, imported as Mechanical APDL volumes (default).
SURFACES
Surfaces only, imported as Mechanical APDL areas.
ALL
All entities. Use this option when the file contains different types of entities.
FMT
The format in which Mechanical APDL will store the model.
0
Neutral format (default). Defeaturing after import is restricted.
69
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

1
Solid format; this allows defeaturing after import.
NOCL
Remove tiny objects.
0
Remove tiny objects without checking model validity (default).
1
Do not remove tiny objects.
NOAN
Perform an analysis of the model.
0
Analyze the model (default).
1

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/ANSYS_Mechanical_APDL_Technology_Showcase_Example_Problems.txt (lines 4884-5083 · enclosing doc section)

ing (p. 52).
• Determining an appropriate stabilization constant (STABILIZE command) may require some experi-
mentation. The defined constant should be large enough to prevent rigid body motion, but also ensure
that the resulting stabilization energy is much smaller than the strain energy. Trial and error is often
required to obtain a suitable value.
63
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Recommendations

3.9. Acknowledgments
Ansys, Inc. gratefully acknowledges Trelleborg Sealing Solutions for providing the geometry and mater-
ial properties used in this example.
3.10. Input Files
The following input files were used in this problem:
• oring.dat -- Input file for the o-ring seal static analysis.
• oring.cdb -- The common database file for the axisymmetric model of the o-ring (called by
oring.dat).
For more information, see Obtaining the Input Files (p. xlvii).
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
64
Fluid-Pressure-Penetration Analysis of a Sealing System

Chapter 4: Ring-Gear Forging Simulation with
Rezoning
This example problem demonstrates the efficiency and usefulness of rezoning in a simulation of metal-
forming processes. Rezoning facilitates the convergence of a nonlinear finite element simulation in
which excessive element distortion occurs.
The following topics are available:
4.1. Introduction
4.2. Problem Description
4.3. Modeling
4.4. Material Properties
4.5. Boundary Conditions and Loading
4.6. Analysis and Solution Controls
4.7. Results and Discussion
4.8. Recommendations
4.9. References
4.10. Input Files
You can also perform this example analysis entirely in the Ansys Mechanical application. For more in-
formation, see Ring-Gear Forging Simulation with Rezoning in the Mechanical Technology Showcase:
Example Problems.
4.1. Introduction
Finite element analysis plays a significant role in designing and analyzing complex metal-forming pro-
cesses that improve product quality. Successful simulation of these processes is often complicated due
to the nonlinear nature of the problems involved. Causes for nonlinearity in such problems include
large-deformation analysis, material plasticity, and the contact needed between the work piece and the
dies.
Rezoning is a powerful tool for overcoming convergence difficulties that can arise due to mesh distortion.
Through its capabilities, a distorted mesh can be repaired and the simulation can be continued to
completion. Rezoning is not intended for cases where the material or structure becomes unstable or
where the mesh deformation has become too severe to repair.
If necessary, several regions can be repaired at the same time (horizontal rezoning), and multiple
rezoning operations are allowed on a region at different times during the analysis (vertical rezoning).
The rezoning process requires the following general steps:
65
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

1. Select the substep to initiate rezoning.
2. Select the region(s) to be repaired (typically via graphical picking).
3. Generate the new mesh.
4. Map variables and solve to balance residuals and achieve equilibrium.
5. Continue the analysis based on the new mesh.
This ring-gear forging example demonstrates the above steps in detail.
4.2. Problem Description
A nonlinear large-deformation analysis of a ring-gear forging simulation is performed with two vertical
rezonings (multiple rezonings on a region occurring at different times). Both rezonings use a new mesh.
(The new mesh is created using any common meshing software application.)
The forging process is simulated using a 2D axisymmetric model meshed with a 2D four-node structural
solid element (PLANE182). The model represents an elastoplastic cylindrical block (the work piece) sitting
in a rigid surface (static die).
The block is deformed by another rigid surface (moving die) that moves at an infinitesimal speed, such
that the final shape of the work piece becomes a ring gear with complete die fill, as shown in Fig-
ure 4.1: Original Finite Element Model with Boundary Conditions and Loading (p. 67).
The initial analysis diverges due to excessive mesh distortion when 96 percent of the total loading (TIME
= 0.96) is reached. The initial rezoning is applied at TIME = 0.716 (substep 26), and the entire work piece
is remeshed.
The analysis continues with the new mesh and converges to completion, but the mesh is severely dis-
torted.
A second rezoning is performed at TIME = 0.9 (substep 45), and the entire work piece is remeshed again
to ensure proper die fill and more accurate results at TIME = 1.
The results of effective plastic strains and total strains are compared with results of a similar problem.[1]
A single rezoning at a later stage of the analysis may have been sufficient to solve this problem, but
the solution described here was chosen instead so that the problem could also demonstrate how ver-
tical rezoning is performed.
4.3. Modeling
The cylindrical block is modeled using 396 plane elements (PLANE182) with axisymmetric behavior
(element key option KEYOPT(3) = 1). Options for full integration with the B-bar method (KEYOPT(1) =
0) and mixed u-P formulation (KEYOPT(6) = 1) are also specified.
et,1,182
keyopt,1,1,0        ! B-bar method (default)
keyopt,1,3,1        ! Axisymmetric
keyopt,1,6,1        ! Mixed u-P formulation
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
66
Ring-Gear Forging Simulation with Rezoning

The B-bar method and the mixed u-P formulation prevent the volumetric locking that can be triggered
by large plastic deformation. Following is the initial finite element model with loading and boundary
conditions applied:
Figure 4.1: Original Finite Element Model with Boundary Conditions and Loading
4.3.1. Contact
Two rigid-deformable contact pairs without friction are defined using target and contact elements
(TARGE169 and CONTA172, respectively) with the Augmented Lagrangian formulation (KEYOPT(2) =
0) activated.
The contact stiffness is updated at each iteration (KEYOPT(10) = 2).
The first contact pair is defined between the top die (moving) and the top and right edges of the
work piece. The second contact pair is defined between the bottom die (static) and the bottom and
right edges of the work piece.
4.4. Material Properties
The work piece is AISI8620 alloy with the following properties:[1]
Young's Modulus: E = 200e3 MPa
Poisson's ratio: √ = 0.3
The material is approximated as an elastoplastic material with a nonlinear isotropic hardening behavior.
The power-hardening law for nonlinear isotropic behavior is represented as:
(4.1)
where:
 = Current yield strength
67
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Material Properties

 = Initial yield strength = 385.4 MPa
G = shear modulus
N = power value = 0.13
 = Equivalent plastic strain
The power-hardening option is activated via the following input:
tb,nliso,1,,power
tbdata,1, 0,n
4.5. Boundary Conditions and Loading
Symmetry displacement boundary conditions are applied to all nodes on the axis of symmetry.
No boundary conditions are applied to the rigid targets, as they are automatically restrained via the
TARGE169 target element's default behavior (KEYOPT(2) = 0).
The top rigid surface is displaced downwards by 138 mm in one load step. The downward displacement
compresses the cylindrical block (work piece), and the material flows to fill up the space between the
dies.
4.6. Analysis and Solution Controls
The following topics concerning analysis details and solution controls for this problem are available:
4.6.1. Solution Parameters and Analysis
4.6.2. Rezoning Techniques Applied to Ring-Gear Forging
4.6.1. Solution Parameters and Analysis
The solution parameters used in this model are input as follows:
nlgeom,on                  ! specifies geometric nonlinearity
time,1                     ! end time
ncnv,2                     ! continues analysis after failure via rezoning and multiframe restart
rescontrol,define,all,1    ! makes restart files available
outres,all,all
nsubst,20,2000,10          ! 
Rezoning requires a static analysis with geometric nonlinearity (NLGEOM,ON).
The end time is 1. The initial, minimum, and maximum time step sizes are 20, 2000, and 10, respectively;
they are applied with an initial time step size of 0.05 and a minimum time increment of 0.5e-3.
Because the program execution ends if the analysis fails to converge, the analysis is continued after
failure by performing rezoning and a multiframe restart. (Without the NCNV command, running the
full analysis in batch mode would not be possible due to analysis termination after the first divergence.)
All restart files must be available; otherwise, it is impossible to know which substeps to perform to
initiate the rezoning. It is also a good idea to save the results; doing so makes it easier to investigate
the reason for solution termination and decide which substep to use to activate rezoning. If it is not
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
68
Ring-Gear Forging Simulation with Rezoning

possible to save results (due to disk space limitations, for example), they can be generated for a
specific substep from the restart files (ANTYPE,,REST,Loadstep,Substep,RSTCREATE).
4.6.2. Rezoning Techniques Applied to Ring-Gear Forging
The general rezoning process (p. 65) for vertical rezoning, horizontal rezoning, or a combination of
both is the same. Following are helpful techniques for applying rezoning specifically to a ring-gear
forging problem:
4.6.2.1. Step 1: Select the Substep to Initiate Rezoning
4.6.2.2. Step 2: Select a Region to Remesh
4.6.2.3. Step 3: Apply a New Mesh
4.6.2.4. Map Variables and Balance Residuals
4.6.2.5. Perform a Multiframe Restart
4.6.2.1. Step 1: Select the Substep to Initiate Rezoning
Selecting the best substep to initiate rezoning is the crucial factor in the rezoning process. No
unique selection criteria can be applied universally to all rezoning problems. Various substep-selection
techniques can be used for the initial rezoning or subsequent ones.
Generally, the best way to select a substep is by visual inspection of results in the postprocessing
module (/POST1). It is helpful to use the most important element solutions (PLESOL) to create
animation files that capture the specific moment when the mesh becomes sufficiently distorted,
but not yet severely distorted (that is, when internal angles approach or exceed 180 degrees).
It is good practice to correlate the element solutions plots with corresponding steps in the monitor
file (.mntr) and the convergence pattern in general. To initiate rezoning, select a substep where
the current time increment is not close to the specified minimum and where the convergence
pattern of the solution has not slowed down significantly (before bisections have started to occur).
In this example, no more than two rezonings are needed because the initial divergence occurs
close to the end of analysis (TIME = 0.96). The initial rezoning cannot be performed very close to
the end of the last converged substep, because another rezoning is planned before the end of the
solution. If the initial rezoning is performed at the beginning of the analysis, large subsequent de-
formations distort the refined mesh too early in the process, necessitating more vertical rezonings.
4.6.2.1.1. First Rezoning
In this case, substep 26 (TIME = 0.716) is chosen because of the results and monitor file examin-
ations. Although this substep has fewer convergence difficulties than the original solution, exper-
imentation shows that some substeps close to substep 26 may also be good candidates for the
first rezoning step.
In the following figure, the element solution of effective plastic strains at this stage shows the

## 004 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 1160-1309 · sibling doc section)

2.3. GRAPHICS Commands
These commands control Mechanical APDL graphics. The commands are grouped by functionality.
Table 2.11: Setup
These GRAPHICS commands are used for general graphics control, such as window setup,
color settings, specifications saving, etc.
Changes an existing color mapping table or creates a new one .
/CMAP (p. 366)
Specifies the color mapping for various items.
/COLOR (p. 416)
Controls graphics device options.
/DEVICE (p. 542)
Activates a display coordinate system for geometry listings and
plots.
DSYS (p. 601)
Sets 3D device option modes.
/DV3D (p. 603)
Specifies that the screen is to be erased before each display.
/ERASE (p. 679)
Explicitly erases the current display.
ERASE (p. 678)
Controls the type of element or graph display used for the
GPLOT (p. 896) command.
/GCMD (p. 823)
Applies a label to a specified curve.
/GCOLUMN (p. 823)
Specifies the pixel resolution on Z-buffered graphics files.
/GFILE (p. 888)
Controls general plotting.
GPLOT (p. 896)
Defines type of graphics display to be used for element plots.
/GRAPHICS (p. 896)
Sets graphics settings to the settings on a file.
/GRESUME (p. 898)
Saves graphics settings to a file for later use.
/GSAVE (p. 905)
Controls the entities that the GPLOT (p. 896) command displays.
/GTYPE (p. 913)
Enables graphics data to be captured and saved.
/IMAGE (p. 965)
Enables immediate display of a model as it is generated.
IMMED (p. 969)
Provides JPEG File Export for displays.
JPEG (p. 999)
Enables you to reissue the graphics command macro "name" during
a replot or zoom operation.
/MREP (p. 1220)
Prevents the screen erase between displays.
/NOERASE (p. 1293)
Sets file options for PNGR graphics export for displays.
PNGR (p. 1503)
Displays the global or window display specifications.
/PSTATUS (p. 1601)
Automatically reissues the last display command for convenience.
/REPLOT (p. 1644)
Resets display specifications to their initial defaults.
/RESET (p. 1656)
Enables graphics data to be stored in the local terminal memory.
/SEG (p. 1774)
Specifies the device and other parameters for graphics displays.
/SHOW (p. 1855)
Provides TIFF file Export for displays.
TIFF (p. 2059)
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
16
Command Groupings

These GRAPHICS commands are used for general graphics control, such as window setup,
color settings, specifications saving, etc.
Defines the window size on the screen.
/WINDOW (p. 2245)
Table 2.12: Views
These GRAPHICS commands control the view of the model.
Rotates the display about an axis.
/ANGLE (p. 143)
Resets the focus and distance specifications to "automatically
calculated."
/AUTO (p. 211)
Specifies the viewing distance for magnifications and perspective.
/DIST (p. 554)
Specifies the focus point (center of the window).
/FOCUS (p. 798)
Conveniently resets /FOCUS (p. 798) and /DIST (p. 554) to USER.
/USER (p. 2123)
Defines the view cone angle for perspective displays.
/VCONE (p. 2140)
Defines the viewing direction for the display.
/VIEW (p. 2199)
Specifies the global Cartesian coordinate system reference
orientation.
/VUP (p. 2240)
Controls the centroid or the axis of dynamic rotation.
/XFRM (p. 2262)
Zooms a region of a display window.
/ZOOM (p. 2271)
Table 2.13: Scaling
These GRAPHICS commands scale various parts of the display.
Sets the displacement multiplier for displacement displays.
/DSCALE (p. 594)
Scales the line width of circuit builder icons.
/ICLWID (p. 956)
Scales the icon size for elements supported in the circuit builder.
/ICSCALE (p. 959)
Distorts the object geometry.
/RATIO (p. 1627)
Shrinks elements, lines, areas, and volumes for display clarity.
/SHRINK (p. 1865)
Sets the contour multiplier for topographic displays.
/SSCALE (p. 1918)
Applies textured appearance to selected items.
/TXTRE (p. 2090)
Scales the length of displayed vectors.
/VSCALE (p. 2228)
Table 2.14: Style
These GRAPHICS commands change the way a model is displayed.
Specifies the cutting plane for section and capped displays.
/CPLANE (p. 443)
Specifies the type of contour display.
/CTYPE (p. 460)
Displays only the "edges" of an object.
/EDGE (p. 614)
Displays elements with shapes determined from the real constants.
/ESHAPE (p. 691)
Specifies the facet representation used to form solid model displays.
/FACET (p. 757)
Specifies the element outline style.
/GLINE (p. 890)
Specifies the curve marking style.
/GMARKER (p. 891)
Specifies the facet representation used to form solid models.
GMFACE (p. 893)
Specifies the light direction for the display window.
/LIGHT (p. 1085)
17
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
GRAPHICS Commands

These GRAPHICS commands change the way a model is displayed.
Enables displaying area elements by top or bottom faces.
/NORMAL (p. 1298)
Defines the type of surface shading used with Z-buffering.
/SHADE (p. 1853)
Specifies the level of translucency.
/TRLCY (p. 2075)
Defines the type of display.
/TYPE (p. 2094)
Table 2.15: Labeling
These GRAPHICS commands add helpful labels and symbols to displays.
Controls the graphical display of alpha character strings for

## 005 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 4511-4521 · sibling doc section)

2.12. AUX15 Commands
These commands read in an IGES file for analysis in Mechanical APDL. The commands are grouped by
functionality.
Table 2.99: IGES
These AUX15 commands read an IGES format file into PREP7 data.
Enters the IGES file transfer processor.
/AUX15 (p. 214)
Transfers IGES data from a file into Mechanical APDL.
IGESIN (p. 963)
Controls options relating to importing a model.
IOPTN (p. 990)
</rag-context>