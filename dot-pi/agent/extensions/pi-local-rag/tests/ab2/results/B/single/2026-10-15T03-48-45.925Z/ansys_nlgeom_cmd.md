<rag-context>
[pi-local-rag] RAG subagent: 2 sources, 2113 ms retrieval.
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

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 38058-38257 · enclosing doc section)

NWIDTH
Total width (12 maximum) of the field (the xx in Ftype). Defaults to 12.
DSIGNF
Number of digits after the decimal point (yy in F or E format) or number of significant digits in G
format. Range is 1 to xx-6 for Ftype = G or E; and 0 to xx-3 for Ftype = F. The default is a function
of Ftype and NWIDTH.
Notes
Enables you to control the format of the graphical display of floating point numbers.
To display the current settings, issue /GFORMAT (p. 889),STAT..
To allow Mechanical APDL to select the format for the graphical display of floating numbers, issue
/GFORMAT (p. 889),DEFA.
This command is valid in any processor.
Menu Paths
Utility Menu>PlotCtrls>Style>Floating Point Format
889
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
/GFORMAT

/GLINE,WN,STYLE
Specifies the element outline style.
GRAPHICS (p.16):Style (p.17)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
WN
Window number (or ALL) to which command applies (defaults to 1).
STYLE
Outline key:
 0 
Solid element outlines (default)
 1 
Dashed element outlines
-1 
No element outlines
Command Default
Solid element outlines
Notes
Determines the element outline style. Often used when node numbers are displayed to prevent element
lines from overwriting node numbers.
Unless you are using an OpenGL or Starbase driver, the dashed element outline option
(/GLINE (p. 890),WN,1) is not available in the following situations:
• Z-buffered displays (/TYPE (p. 2094),WN,6).
• Capped Z-buffered displays (/TYPE (p. 2094),WN,7).
• Qslice Z-buffered displays (/TYPE (p. 2094),WN,8).
This command is valid in any processor.
Menu Paths
Utility Menu>PlotCtrls>Style>Edge Options
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
890
/GLINE

/GMARKER,CURVE,KEY,INCR
Specifies the curve marking style.
GRAPHICS (p.16):Style (p.17)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
CURVE
Curve number markers will be applied on (integer value between 1 and 10).
KEY
Marker key:
0
No markers will be applied (default).
1
TRIANGLES will be applied.
2
SQUARES will be applied.
3
DIAMONDS will be applied.
4
CROSSES will be applied.
INCR
Determines the curve marking frequency. (a whole number value between 1 and 255). If INCR =
1, markers are displayed at every data point on the curve. If INCR = 2 then markers are displayed
at every second data point. If INCR = 3 then they are displayed at every third data point.
Command Default
No markers will be applied.
Notes
The user-specified markers will not be drawn when the area under the curve is color-filled
(/GROPT (p. 900), FILL).
891
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
/GMARKER

Menu Paths
Utility Menu>PlotCtrls>Style>Graphs>Modify Curve
GMATRIX,SYMFAC,Condname,NUMCOND,--,Matrixname
Performs electric field solutions and calculates the self and mutual conductance between multiple con-
ductors.
SOLUTION (p.38):Analysis Options (p.38)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
SYMFAC
Geometric symmetry factor. Conductance values are scaled by this factor which represents the
fraction of the total device modeled. Defaults to 1.
Condname
Alphanumeric prefix identifier used in defining named conductor components.
NUMCOND
Total number of components. If a ground is modeled, it is to be included as a component.
--
Unused field.
Matrixname
Array name for computed conductance matrix. Defaults to GMATRIX.
Notes
To invoke the GMATRIX (p. 892) macro, the exterior nodes of each conductor must be grouped into
individual components using the CM (p. 363) command. Each set of independent components is assigned
a component name with a common prefix followed by the conductor number. A conductor system
with a ground must also include the ground nodes as a component. The ground component is numbered
last in the component name sequence.
A ground conductance matrix relates current to a voltage vector. A ground matrix cannot be applied
to a circuit modeler. The lumped conductance matrix is a combination of lumped "arrangements" of
voltage differences between conductors. Use the lumped conductance terms in a circuit modeler to
represent conductances between conductors.
Enclose all name-strings in single quotes in the GMATRIX (p. 892) command line.
GMATRIX (p. 892) works with the following elements:
• SOLID5 (KEYOPT(1) = 9)
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
892
GMATRIX

• SOLID98 (KEYOPT(1) = 9)
• LINK68
• PLANE230
• SOLID231
• SOLID232
This command is available from the menu path shown below only if existing results are available.
This command does not support multiframe restarts
Distributed-Memory Parallel (DMP) Restriction 
This command is not supported in a DMP solution.
Menu Paths
Main Menu>General Postproc>Elec&Mag Calc>Component Based>Self/Mutual conductance
GMFACE,Lab,N
Specifies the facet representation used to form solid models.
GRAPHICS (p.16):Style (p.17)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Lab
Valid Labels:
FINE  
Value that determines how coarse the facets will be.
N
An integer value between one (small) and ten (large) that determines the tolerances that will be
applied to the creation of arcs and surfaces. Ten will create many facets, which may in turn cause
Mechanical APDL to run very slowly. One will create fewer facets, which may in turn cause larger
tolerance errors.
Menu Paths
Utility Menu>PlotCtrls>Style>Solid Model Facets
893
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
GMFACE

*GO,Base
Causes a specified line on the input file to be read next.
APDL (p.19):Process Controls (p.21)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Argument Descriptions
Base
"Go to" action:
:label -- 
A user-defined label (beginning with a colon (:), 8 characters maximum). The command
reader will skip (and wrap to the beginning of the file, if necessary) to the first line that
begins with the matching :label.
Caution:
This label option may not be mixed with do-loop or if-then-else constructs.
STOP -- 
This action will cause an exit from the Mechanical APDL program at this line.
Command Default
Read lines sequentially.
Notes
Causes the next read to be from a specified line on the input file. Lines may be skipped or reread. The
*GO (p. 894) command will not be executed unless it is part of a macro, user file (processed by
*USE (p. 2121)), an alternate input file (processed by /INPUT (p. 980)), or unless it is used in a batch-mode
input stream. Jumping into, out of, or within a do-loop or an if-then-else construct to a :label line is
not allowed.
This command is valid in any processor.
Menu Paths
This command cannot be accessed from a menu.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
894
*GO

/GO
Reactivates suppressed printout.
SESSION (p.11):List Controls (p.13)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Notes
Reactivates printout suppressed with the /NOPR (p. 1296) command without producing any output. The
/GOPR (p. 895) command has the same function except that it also produces a command response from
the program.
This command is valid in any processor.
Menu Paths
This command cannot be accessed from a menu.
/GOLIST
Reactivates the suppressed data input listing.
SESSION (p.11):List Controls (p.13)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Notes
Reactivates printout of the data input listing suppressed with /NOLIST (p. 1294).
This command is valid in any processor, but only within a batch run (/BATCH (p. 223)).
Menu Paths
</rag-context>