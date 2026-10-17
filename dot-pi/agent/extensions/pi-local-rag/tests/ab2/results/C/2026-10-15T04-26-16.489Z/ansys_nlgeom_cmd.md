<rag-context>
[pi-local-rag] RAG subagent: 2 sources, 2803 ms retrieval.
### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/Ansys-mechanical-apdl-technology-demonstration-guide.txt (lines 14282-14481 · enclosing doc section)

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


### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 812-988 · enclosing doc section)

1.3.8. Star and Slash Commands
The slash (/) and star ( *) commands are usually used for supplying general control instructions to
the program. For example, slash commands are used for entering a processor (/PREP7 (p. 1529),
/POST1 (p. 1509), etc.). Printout controls, display controls, and file controls are available within the slash
command set.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
8
About This Reference

Repeat, looping and macro controls are available within the star command set.
Many star and slash commands are global and apply to all processors. For example, the /TITLE (p. 2067)
command may be used to change the title in any processor (PREP7, POST1, etc.). The star commands
can be input anywhere. Most slash commands can be input anywhere; however, some can only be
input at a Begin level, and those commands are specifically noted in the command description.
Graphics displays are controlled via the graphics display slash commands. The graphics display slash
commands can be input anywhere.
9
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Command Characteristics

Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
10

Chapter 2: Command Groupings
Following are tables of related commands. The documentation for each command also references these
tables, providing convenient access to related commands.
Example: To define material types in the PREP7 general preprocessor, see PREP7 Com-
mands (p. 23) and examine the commands available under Table 2.28: Materials (p. 24).
While this document is useful as a reference, you should first look at the appropriate analysis guide to
learn which commands are used for a given operation or analysis type.
The following command groupings are available:
2.1. SESSION Commands
2.2. DATABASE Commands
2.3. GRAPHICS Commands
2.4. APDL Commands
2.5. PREP7 Commands
2.6. SOLUTION Commands
2.7. POST1 Commands
2.8. POST26 Commands
2.9. AUX2 Commands
2.10. AUX3 Commands
2.11. AUX12 Commands
2.12. AUX15 Commands
2.13. Mapping Processor Commands
2.1. SESSION Commands
These commands provide general control to the session. The commands are grouped by functionality.
Table 2.1: Run Controls
These SESSION commands control the overall characteristics of the session, including
the jobname, Graphical User Interface behavior, and file switching.
Sets the program mode to "batch."
/BATCH (p. 223)
Assigns values to configuration parameters.
/CONFIG (p. 427)
Changes the current working directory.
/CWD (p. 470)
Exits the file being read.
/EOF (p. 670)
Stops the run and returns control to the system.
/EXIT (p. 735)
11
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

These SESSION commands control the overall characteristics of the session, including
the jobname, Graphical User Interface behavior, and file switching.
Changes the jobname for the analysis.
/FILNAME (p. 784)
Displays help information for commands and element types.
HELP (p. 934)
Switches the input file for the commands that follow.
/INPUT (p. 980)
Sets a keyword used by the GUI for context filtering (GUI).
KEYW (p. 1015)
Enables the current session to keep allocated memory.
MEMM (p. 1157)
Activates the Graphical User Interface (GUI).
/MENU (p. 1158)
Controls the initial GUI components.
/MSTART (p. 1238)
Limits the number of warning and error messages displayed.
/NERR (p. 1255)
Redirects text output to a file or to the screen.
/OUTPUT (p. 1380)
Temporarily releases (pauses) the currently used product license
so that another application can use it.
PAUSE (p. 1402)
Lists the status of items for the run.
/STATUS (p. 1936)
Passes a command string and arguments to the operating system.
/SYP (p. 1966)
Passes a command string to the operating system.
/SYS (p. 1967)
Activates specified GUI dialog boxes.
/UI (p. 2102)
Controls the GUI behavior.
/UIS (p. 2107)
Restores use of a temporarily released (paused) product license.
(Applicable only after a previously issued PAUSE (p. 1402) command.)
UNPAUSE (p. 2118)
Table 2.2: Processor Entry
These SESSION commands enter and exit the various processors in the program.
Enters the binary file dumping processor.
/AUX2 (p. 212)
Enters the results file editing processor.
/AUX3 (p. 213)
Enters the radiation matrix generation processor.
/AUX12 (p. 213)
Enters the IGES file transfer processor.
/AUX15 (p. 214)
Exits normally from a processor.
FINISH (p. 785)
Enters the mapping processor.
/MAP (p. 1143)
Enters the database results postprocessor.
/POST1 (p. 1509)
Enters the time-history results postprocessor.
/POST26 (p. 1509)
Enters the model creation preprocessor.
/PREP7 (p. 1529)
Exits a processor.
/QUIT (p. 1617)
Enters the solution processor.
/SOLU (p. 1892)
Table 2.3: Files
These SESSION commands control file operations, such as deleting, copying, and listing.
Creates an AQWA-LINE input file from the current model.
ANSTOAQWA (p. 156)
Creates an ASAS input file from the current model.
ANSTOASAS (p. 159)
Reassigns a file name to a file identifier.
/ASSIGN (p. 205)
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
12
Command Groupings

These SESSION commands control file operations, such as deleting, copying, and listing.
Copies the session log file to a named file.
/CLOG (p. 362)
Copies a file.
/COPY (p. 432)
Deletes a file.
/DELETE (p. 532)
Deletes all local files in all processors in a distributed-memory
parallel processing run.
/FCLEAN (p. 762)
Specifies file compression level.
/FCOMP (p. 763)
Deletes a binary file after it is used.
/FDELE (p. 770)
Writes the database command log to a file.
LGWRITE (p. 1084)
Displays the contents of an external, coded file.
*LIST (p. 1091)
Renames a file.
/RENAME (p. 1641)
Links user-programmable routines into Mechanical APDL.
/UPF (p. 2112)
Table 2.4: List Controls
These SESSION commands control listings and printed program output.
Places a comment in the output.
C*** (p. 289)
Places a comment in the output.
/COM (p. 420)
Reactivates suppressed printout.
/GO (p. 895)
Reactivates the suppressed data input listing.
/GOLIST (p. 895)
Reactivates suppressed printout.
/GOPR (p. 895)
Suppresses the data input listing.
/NOLIST (p. 1294)
Suppresses the expanded interpreted input data listing.
/NOPR (p. 1296)
</rag-context>