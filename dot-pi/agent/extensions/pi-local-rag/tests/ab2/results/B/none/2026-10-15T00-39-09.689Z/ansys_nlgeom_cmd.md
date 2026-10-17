<rag-context>
[pi-local-rag] RAG subagent: 1 sources, 93 ms retrieval.
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
</rag-context>