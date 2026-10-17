<rag-context>
[pi-local-rag] RAG subagent: 3 sources, 285 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 4522-4721 · enclosing doc section)

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

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 66819-67018 · enclosing doc section)

# Generate an area from the lines
area_id = mapdl.a(*lines)
*ENDPY
! Generate a line to define the extrusion path
*GET, KPNUMBER, KP, 0 ,NUM, MAX
*GET, LINENUMBER, LINE, 0, NUM, MAX
K   ,KPNUMBER+1
K   ,KPNUMBER+2,0           ,0           ,10
L   ,KPNUMBER+1,KPNUMBER+2
! Extrude the area generated in python using the line
! generated in APDL
*GET,AREANUMBER  ,AREA        ,0           ,NUM   , MAX
VDRAG,AREANUMBER,,,,,,LINENUMBER+1
! Display the volume
/show,png
/view,,1,1,1
vplot
Python Language Version 
*PYTHON (p. 1609) uses the 3.10 version of Python that is distributed with Mechanical APDL, in the
location v261/commonfiles/CPython. For documentation of this version of Python, see https://
docs.python.org/3.10/.
*PYTHON (p. 1609) in Distributed-memory Parallel (DMP) Mode 
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1610
*PYTHON

When running in DMP mode, the Python code inside the *PYTHON (p. 1609) block only executes
on the head compute node.
Python Variables 
You can add multiple *PYTHON (p. 1609) blocks in a Mechanical APDL input listing, and any local
Python variables defined in one block can be accessed from another block. However, when you
issue a /CLEAR (p. 357) command outside of a *PYTHON block, Python variables defined by all
previous *PYTHON (p. 1609) blocks will be cleared.
Exceptions 
If an exception is raised from within a *PYTHON (p. 1609) block, it causes an error in Mechanical
APDL, which may lead to program termination.
Using Python Packages 
By default, *PYTHON (p. 1609) uses a Python environment that includes PyMAPDL, PyDPF, and some
thirdparty libraries, such as numpy. You may want to use additional libraries that are not included
by default. Ordinarily, this is accomplished in Python by creating a virtual environment and installing
desired packages into that environment (https://docs.python.org/3/library/venv.html), but *PY-
THON (p. 1609) uses its own virtual environment to run within Mechanical APDL. To configure
Mechanical APDL to use a custom Python environment, follow these steps:
1. Prepare a requirements.txt file (/path/to/my-requirements.txt) that includes
the desired packages (https://pip.pypa.io/en/stable/reference/requirements-file-format/).
2. Specify a folder (/path/to/folder) to install the Python environment in. This folder
must not exist before running the following commands:
On Windows (PowerShell):
& '\path\to\v261\commonfiles\CPython\3_10\winx64\Release\python\python' -m venv '\path\to\folder'
& '\path\to\folder\Scripts\Activate.ps1'
On Linux:
'/path/to/v261/commonfiles/CPython/3_10/linx64/Release/python/bin/python' -m venv '/path/to/folder'
source '/path/to/folder/bin/activate'
3. Finally, install your dependencies:
pip install -r '/path/to/v261/ansys/site/mapdl-requirements.txt'
pip install –r '/path/to/my-requirements.txt'
A Python environment is identified by the folder in which it was installed. There is no limit to the
number of environments that can exist. However, Mechanical APDL can only use one of them. To point
Mechanical APDL to use an environment, set the environment variable MAPDL_PYTHON_ENV to the
folder identifying that environment.
Caution:
Do not install any packages directly to /path/to/commonfiles/CPython. You must
create a virtual Python environment (as described above) to avoid unintended affects to the
1611
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
*PYTHON

Python interpreter that is shared between several Ansys products, including Mechanical APDL
and the Mechanical application.
Using a *PYTHON (p. 1609) block in Mechanical APDL is a nonstandard use of the program. You are re-
sponsible for verifying that the results produced are accurate and the routines you introduce do not
adversely affect other, standard areas of the program. Exercise caution and engineering judgement and
verify your results.
Known Issues and Limitations
• *PYTHON (p. 1609) is not allowed inside of a *DO (p. 587) loop.
• To use matplotlib inside of *PYTHON, consider the following:
– In batch mode, matplotlib uses the system default backend and works as expected.
– In interactive mode, the default backend of matplotlib would conflict with the Mechanical
APDL GUI and result in a crash. To view plots using matplotlib while running the program in
interactive mode, you must choose the non-interactive "Agg" backend of matplotlib to redirect
all plotting commands in matplotlib to a file. See matplotlib documentation: Selecting a
backend.
– When running interactive mode on Windows in a terminal session with the -smp option en-
abled for shared-memory parallel processing, *PYTHON (p. 1609) is not supported.
Menu Paths
This command cannot be accessed from a menu.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1612
*PYTHON

Q Commands
QDVAL,TBLNO1,TBLNO2,SV1,SV2,SV3,SV4,SV5,SV6,SV7
Defines PSD quadspectral values.
SOLUTION (p.38):Spectrum Options (p.42)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
TBLNO1
First input PSD table number associated with this spectrum.
TBLNO2
Second input PSD table number associated with this spectrum.
SV1, SV2, SV3, . . . , SV7
PSD quadspectral values corresponding to the frequency points (PSDFRQ (p. 1579)).
Notes
Defines PSD quadspectral values to be associated with the previously defined frequency points. Repeat
QDVAL (p. 1613) command with the same table number for additional points. Unlike autospectra
(PSDVAL (p. 1584)), the quadspectra can be positive or negative. The quadspectral curve segment where
there is a sign change is interpolated linearly (the rest of the curve segments use log-log interpolation).
For better accuracy, choose as small a curve segment as possible wherever a sign change occurs.
Two table numbers are required since values are off-diagonal terms. This command is valid for SP-
OPT (p. 1908),PSD only.
This command is also valid in PREP7.
Menu Paths
Main Menu>Preprocessor>Loads>Load Step Opts>Spectrum>PSD>Correlation>Quadspectral
Main Menu>Solution>Load Step Opts>Spectrum>PSD>Correlation>Quadspectral
1613
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

QRDOPT,ReuseKey,--,--,SymMeth,CMCCoutKey
Specifies additional QRDAMP modal analysis options.
SOLUTION (p.38):Dynamic Options (p.41)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Product Restrictions (p.1182)
ReuseKey
Reuse key for method=QRDAMP specified in MODOPT (p. 1178) command.
ON
Reuse the symmetric eigensolution from the previous load steps or from the previous
solution.
OFF
Do not reuse (calculates symmetric eigensolution at current load step). This is the default.
--, --
Unused fields.
SymMeth
Mode-extraction method to be used for the symmetric eigenvalue problem.
LANB
Block Lanczos algorithm (default).
SUBSP
Subspace algorithm.
SNODE
Supernode algorithm.
CMCCoutKey
Complex Modal Contribution Coefficients (CMCC) output key. See Calculate the Complex Mode
Contribution Coefficients (CMCC) in the Structural Analysis Guide for details and usage.
ON
Output the CMCC to the text file Jobname.CMCC.
OFF
Do not output the CMCC. This is the default.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1614
QRDOPT

Notes
If the filename.modesym file exists in the working directory and ReuseKey = ON, filename.mod-
esym will be reused. If filename.modesym does not exist in the working directory, the symmetric
eigensolution will be calculated.
When ReuseKey=ON, both the new modal analysis (filename.modesym usage) and the preceding
modal analysis (filename.modesym generation) must be performed using the same product version
number.
Menu Paths
This command cannot be accessed from a menu.
QSOPT,Opt
Specifies quasi static radiation options.
SOLUTION (p.38):Radiosity (p.50)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Opt
Quasi static option:
OFF  
Do not run transient radiation problem to steady-state (default).
ON  
Run transient radiation problem to steady-state.
Notes
For more information on solving a static problem using a false transient approach, see Further Options
for Static Analysis in the Thermal Analysis Guide.
Menu Paths
Main Menu>Preprocessor>Loads>Load Step Opts>Time/Frequenc>Quasi-Static
Main Menu>Solution>Load Step Opts>Time/Frequenc>Quasi-Static
1615
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
QSOPT

QUAD,NODE1,NINTR,NODE2,NFILL,NSTRT,NINC,PKFAC
Generates a quadratic line of nodes from three nodes.
PREP7 (p.23):Nodes (p.32)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
NODE1
Begin fill-in from this node location. If NODE1 = P, graphical picking is enabled and all remaining
command fields are ignored (valid only in the GUI).
NINTR
Intermediate or guiding node. Quadratic curve will pass through this location. NINTR may have
any node number and any location. If the quadratic line also generates a node with number NINTR,
the generated location overrides the previous NINTR location.
NODE2
End quadratic fill-in at this node location.
NFILL
Fill-in NFILL nodes between NODE1 and NODE2 (defaults to |NODE2-NODE1|-1). NFILL must be
positive.

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Basic_Analysis_Guide.txt (lines 10208-10232 · enclosing doc section)

10.4.2. Displaying X11 Graphics Over Networks
You can display X11 graphics within the program over the network if the following conditions exist:
• All computer systems have X11 software installed.
• The program is linked with the X11 driver.
• A /SHOW device type of x11 or x11c is used. (You can use either uppercase or lowercase
characters to specify device types.)
• The /etc/hosts file on the host machine contains the hostname and the IP address of the
remote machine.
• The environment variable DISPLAY is set to Hostname:0.0, where Hostname is either the
host name or the IP address of the machine that will display the graphics.
For example, suppose that you want to run the program remotely from another Linux system for
local display of X11 graphics on your workstation monitor. You would perform these steps:
1. Open a window on your workstation and issue the following command to authorize remote
hosts to access the display:
/usr/bin/X11/xhost +
2. Log onto a remote host (via Telnet, login, etc.). Type the following command or commands
to tell the remote host to display X11 graphics on your workstation.
C Shell:
setenv DISPLAY Your_Workstation:0.0
Bourne or Korn Shell:
DISPLAY=Your_Workstation:0.0
export DISPLAY
Your_Workstation is either the host name of the IP address of your workstation.
3. Execute the program and X11 graphics will be displayed on your workstation monitor:
ansys261 -d x11 -g
</rag-context>