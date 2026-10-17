<rag-context>
[pi-local-rag] RAG subagent: 2 sources, 5256 ms retrieval.
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


### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 85206-85405 · enclosing doc section)

quested time points if the array or time values in the array are also specified in the OUTRES (p. 1382)
command using FREQ=%array%. Use this command to reset the time-stepping strategy within a load
step. You may need to reset the time-stepping strategy when using tabular time-varying boundary
conditions.
See Steady-State Thermal Analysis of the Thermal Analysis Guide for more information on applying
boundary conditions via tabular input. See Transient Thermal Analysis of the Thermal Analysis Guide for
more information on defining the key time array.
2087
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
TSRES

Menu Paths
Main Menu>Preprocessor>Loads>Load Step Opts>Time/Frequenc>Time - Time Step
Main Menu>Preprocessor>Loads>Load Step Opts>Time/Frequenc>Time and Substeps
Main Menu>Solution>Load Step Opts>Time/Frequenc>Time - Time Step
Main Menu>Solution>Load Step Opts>Time/Frequenc>Time and Substeps
TUNIF,TEMP
Assigns a uniform temperature to all nodes.
SOLUTION (p.38):FE Body Loads (p.49)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
TEMP
Uniform temperature assigned to the nodes. If a TEMP value is not specified, the uniform temperature
is set to zero.
Command Default
Set the uniform temperature to the reference temperature (defined via the TREF (p. 2073) command).
Notes
TUNIF (p. 2088) is a convenient form of the more general BFUNIF (p. 266) command.
In a transient or nonlinear thermal analysis, the uniform temperature is used during the first iteration
of a solution as follows:
• as the starting nodal temperature, except where temperatures are explicitly specified (D (p. 501),
DK (p. 560))
• to evaluate temperature-dependent material properties.
In a structural analysis, the uniform temperature is used as the default temperature for thermal strain
calculations and material property evaluation, except where body load temperatures are specified
(BF (p. 227), BFE (p. 243), BFK (p. 255), LDREAD (p. 1071)). In other scalar field analyses, the uniform tem-
perature is used for material property evaluation.
Because TUNIF (p. 2088) (or BFUNIF (p. 266),TEMP) is step-applied in the first iteration, issue a
BF (p. 227),ALL,TEMP,Value command to ramp on a uniform temperature load.
The command default sets the uniform temperature to the reference temperature defined via the
TREF (p. 2073) command only (and not the MP (p. 1198),REFT command).
If using the command default to set the uniform temperature (to the reference temperature set via
TREF (p. 2073)), you can convert temperature-dependent secant coefficients of thermal expansion (SCTEs)
from the definition temperature to the uniform temperature. To do so, issue the MPAMOD (p. 1204)
command.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
2088
TUNIF

In a mode-superposition harmonic or transient analysis, you must apply the load in the modal portion
of the analysis. Mechanical APDL calculates a load vector and writes it to the MODE file, which you can
apply via the LVSCALE (p. 1130) command.
This command is also valid in PREP7.
Menu Paths
Main Menu>Preprocessor>Loads>Define Loads>Apply>Electric>Boundary>Temperature>Uni-
form Temp
Main Menu>Preprocessor>Loads>Define Loads>Apply>Magnetic>Boundary>Temperature>Uni-
form Temp
Main Menu>Preprocessor>Loads>Define Loads>Apply>Structural>Temperature>Uniform
Temp
Main Menu>Preprocessor>Loads>Define Loads>Apply>Thermal>Temperature>Uniform Temp
Main Menu>Preprocessor>Loads>Define Loads>Settings>Uniform Temp
Main Menu>Solution>Define Loads>Apply>Electric>Boundary>Temperature>Uniform Temp
Main Menu>Solution>Define Loads>Apply>Magnetic>Boundary>Temperature>Uniform Temp
Main Menu>Solution>Define Loads>Apply>Structural>Temperature>Uniform Temp
Main Menu>Solution>Define Loads>Apply>Thermal>Temperature>Uniform Temp
Main Menu>Solution>Define Loads>Settings>Uniform Temp
TVAR,KEY
Changes time to the cumulative iteration number.
POST26 (p.59):Controls (p.60)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
KEY
Time key:
0
Time is used for the variable TIME.
1
NCUMIT is used for the variable TIME.
Command Default
TIME is the variable TIME.
2089
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
TVAR

Notes
Changes the meaning of the time variable to the cumulative iteration number (NCUMIT) variable. Data
can be read from the file, printed, and displayed as a function of NCUMIT rather than time. All POST26
descriptions applying to TIME then apply to NCUMIT.
Menu Paths
Main Menu>TimeHist Postpro>Settings>Data
/TXTRE,Lab,NUM,N1,N2,NINC
Controls application of texture to selected items.
GRAPHICS (p.16):Style (p.17)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Lab
You can apply texture according to the following labels:
ELEM
Apply texture to elements N1 through N2 in steps of NINC.
AREA
Apply texture to areas N1 through N2 in steps of NINC.
VOLU
Apply texture to volumes N1 through N2 in steps of NINC.
CM
Apply texture to the component named in N1. N2 and NINC are ignored.
ON, OFF
Sets the specified texture display on or off. All other fields are ignored.
File
If Lab = File, the command format is /TXTRE (p. 2090), File, Key_Index, Fname, Fext, --,
Format (This variant of the command is applicable to 2D drivers).
Key_Index
The texture index associated with the file. If the number fifty-one (51) is used, the
imported bitmap will be used as the window's logo.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
2090
/TXTRE

Fname
File name and directory path (248 characters maximum, including the characters
needed for the directory path). An unspecified directory path defaults to the
working directory; in this case, you can use all 248 characters for the file name.
Fext
Filename extension (eight-character maximum).
--
Unused field.
Format
The file format. If Format = 0, the file is a pixmap (Linux) or Bitmap (PC). The file
cannot contain a compressed image, and the PC file must be 8 or 24 bit BI_RGB
format. If Format = 1 or JPEG, then the file is in JPEG (Joint Photographic Experts
Group) format. If Format = 2 or PNG, then the file is in PNG (Portable Network
Graphics) format.
NUM
Select the texture index number from the following list:
0
No Texturing
1
Aluminum
2
Aluminum, Brushed
3
Steel With Bumps
4
Steel, Embossed
5
Iron
6
Steel, Pattern
2091
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
/TXTRE

7
Steel, Riveted
8
Steel, Scratched
9
Tin
10
Metal
11
Steel, Etched
12
Metal, Hot
13
Iron, Grainy
14
Metal, Rusty
15
Brick
16
Block
17
Wood
18
Wood, Light
19
Wood, Walnut
20
Plastic, Hard Blue
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
2092
/TXTRE

21
Plastic, Light Blue
22
Plastic, Hard Red
31
Gold
32
Brass
33
Silver
34
Plastic, Black
35
Plastic, Ivory
</rag-context>