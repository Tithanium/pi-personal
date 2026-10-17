<rag-context>
[pi-local-rag] RAG subagent: 3 sources, 2092 ms retrieval.
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

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 22351-22550 · enclosing doc section)

Component thermal gradient.
X, Y, Z
TG
Component thermal flux.
X, Y, Z
TF
Component pressure gradient.
X, Y, Z
PG
Component electric field.
X, Y, Z
EF
Component electric flux density.
X, Y, Z
D
Component magnetic field intensity.
X, Y, Z
H
Component magnetic flux density.
X, Y, Z
B
Concentration gradient
X, Y, Z
CG
Diffusion flux density
X, Y, Z
DF
Component electromagnetic force.
X, Y, Z
FMAG
X, Y, or Z structural force.
X, Y, Z
F
X, Y, or Z structural moment.
X, Y, Z
M
Heat flow.
HEAT
Fluid flow.
FLOW
Current flow.
AMPS
Magnetic flux.
FLUX
X, Y, or Z magnetic current segment component.
X, Y, Z
CSG
Diffusion flow rate
RATE
Menu Paths
Main Menu>General Postproc>Define/Modify>Elem Results
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
540
DESOL

DETAB,ELEM,Lab,V1,V2,V3,V4,V5,V6
Modifies element table results in the database.
POST1 (p.51):Set Up (p.51)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
ELEM
Element for which results are to be modified. If ALL, modify all selected elements (ESEL (p. 687))
results. If ELEM = P, graphical picking is enabled and all remaining command fields are ignored
(valid only in the GUI). A component name may also be substituted for ELEM.
Lab
Label identifying results. Valid labels are as defined with the ETABLE (p. 714) command. Issue
ETABLE (p. 714),STAT to display labels and values.
V1
Value assigned to this element table result in the database. If zero, a zero value will be assigned. If
blank, value remains unchanged.
V2, V3, V4, . . . , V6
Additional values (if any) assigned to consecutive element table columns.
Notes
Modifies element table (ETABLE (p. 714)) results in the database. For example,
DETAB (p. 541),35,ABC,1000,2000,1000 assigns 1000, 2000, and 1000 to the first three table columns
starting with label ABC for element 35. Use the PRETAB (p. 1540) command to list the current results.
After deleting a column of data using ETABLE (p. 714),Lab,ERASE, the remaining columns of data are
not shifted to compress the empty slot. Therefore, the user must allocate null (blank) values for V1,
V2...V6 for any ETABLE entries which have been deleted by issuing ETABLE (p. 714),Lab,ERASE. All data
are stored in the solution coordinate system but will be displayed in the results coordinate system
(RSYS (p. 1699)).
Menu Paths
Main Menu>General Postproc>Define/Modify>ElemTabl Data
541
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
DETAB

/DEVICE,Label,KEY
Controls graphics device options.
GRAPHICS (p.16):Set Up (p.16)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Label
Device function label:
BBOX
Bounding box mode. For PowerGraphics plots involving elements with /SHOW (p. 1855),x11
and /SHOW (p. 1855),win32, Mechanical APDL generally displays dynamic rotations faster. If
KEY = 1 (ON), then a bounding box (not the elements) encompassing the model is displayed
and rotated, rather than the element outlines (ON is default in preprocessing). When KEY
= 0 (OFF), then dynamic rotations may be slower (Mechanical APDL redraws the element
outlines) for plots involving elements with /SHOW (p. 1855),x11 and /SHOW (p. 1855),win32.
OFF is default in postprocessing. This command is ignored if /EDGE (p. 614),WN,1 is set for
any WN. This is ignored in POST1 and SOLUTION plots.
For any PowerGraphics plots involving elements, regardless of /SHOW (p. 1855) settings,
plots will generally be displayed faster.
VECTOR
Vector mode. In vector mode, areas, volumes, elements, and postprocessing display geo-
metries are shown as outlines (wireframes). When vector mode is off (default), these entities
are shown filled with color.
DITHER
When dithering is turned on (default), color intensity transitions are smoothed. This selection
a
applies only to smooth-shaded images, that is, Z-buffered (/TYPE (p. 2094)), or raster plots
with Gouraud or Phong shading (/SHADE (p. 1853)).
ANIM
Select the animation type used on 2D devices on the PC platform. A KEY value of BMP (or
0) sets animation mode to the Mechanical APDL animation controller (default). A KEY value
of AVI (or 2) sets animation mode to AVI movie player file.
FONT
Font selection for the Mechanical APDL graphics window. When Label = FONT, the com-
mand format is: /DEVICE (p. 542),FONT,KEY,Val1,Val2,Val3,Val4,Val5,Val6 where KEY
determines the type of font being controlled, and values 1 through 6 control various font
parameters. These values are device specific; using the same command input file (/IN-
PUT (p. 980)) on different machines may yield different results.. The following KEY values de-
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
542
/DEVICE

termine the font information that will be supplied to the appropriate driver (for example,
Postscript, X11, Win32, JPEG, ...):
KEY = 1
The command controls the LEGEND (documentation column) font.
KEY = 2
The command controls the ENTITY (node and keypoint number) font.
KEY = 3
The command controls the ANNOTATION/GRAPH font.
Linux:
Values 1 through 4 are used to find a match in the X11 database of font strings. Values
1, 2, and 3 are character strings; value 4 is a nonzero integer:
Val1
Family name (for example, Courier). If Val1 = MENU, all other values are ig-
nored and a font selection menu appears (GUI must be active).
Val2
Weight (for example, medium)
Val3
Slant (for example, r)
Val4
Pixel size (for example, 14). Note that this value does no affect the annotation
fonts (KEY = 3). Use the /TSPEC (p. 2085) command for annotation font size.
Val5
unused
Val6
unused
PC:
The values are encoded in a PC logical font structure. Value 1 is a character string, and
the remaining values are integers:
Val1
Family name (for example, Courier*New) Substitute an asterisk (*) for any blank
character that appears in a family name. If Val1 = MENU, all other values are
543
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
/DEVICE

ignored and a font selection menu appears (GUI must be active). When this
value is blank, Mechanical APDL uses the first available resource it finds.
Val2
Weight (0 - 1000)
Val3
Orientation (in tenths of a degree)
Val4
Height (in logical units)
Val5
Width (in logical units)
Val6
Italics (0 = OFF, 1 = ON)
TEXT
Text size specification for the Mechanical APDL graphics window. Using this label with the
/DEVICE (p. 542) command requires the following form: /DEVICE (p. 542),TEXT,KEY,PERCENT.
KEY = 1 for LEGEND fonts; KEY = 2 for ENTITY fonts. PERCENT specifies the new text size
as a percent of the default text size. If PERCENT = 100, the new text size is precisely the
default size. If PERCENT = 200, the new text size is twice the default text size.
KEY
Control key:
OFF or 0
Turns specified function off.
ON or 1
Turns specified function on or designates the LEGEND font.
2
Designates the ENTITY font.
3
Designates the ANNOTATION/GRAPH font.
Command Default
Vector mode off (that is, raster mode); dithering on.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
544
/DEVICE
</rag-context>