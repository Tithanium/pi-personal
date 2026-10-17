<rag-context>
[pi-local-rag] RAG subagent: 4 sources, 4550 ms retrieval.
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


### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Exemples_fedoo/03-advanced/README.rst (lines 1-4 · enclosing doc section)

Advanced problems
-----------------

This section show some advanced capabilities of fedoo.

### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/core/assembly_sum.py (lines 217-218 · enclosing function/class)

#     return AssemblySum(list(listAssembly), name, **kargs)


### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 7422-7621 · enclosing doc section)

Degrees of
Freedom
Electric
Current-based static,
time-transient and
VOLT
PLANE230 (p. 1273) --
Higher-order quadrilateral
time-harmonic quasistatic
electric field analyses
SOLID231 (p. 1278) --
High-order hexahedral
SOLID232 (p. 1282) --
High-order tetrahedral
Application
Degrees of
Freedom
Magnetic
Magnetostatic analysis
MAG
SOLID96 (p. 318) --
Low-order hexahedral
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
134
Elements for Multiphysics Analysis

Electric and Magnetic Analyses
Application
Degrees of
Freedom
Electromagnetic
Static, transient or harmonic
electromagnetic and stranded
coil analyses
AZ, VOLT, EMF
PLANE233 (p. 1286) --
Higher-order quadrilateral
SOLID236 (p. 1295) --
Edge-based mixed-order
hexahedral
SOLID237 (p. 1304) --
Edge-based mixed-order
tetrahedral
Application
Degrees of
Freedom
Infinite
Open boundary for an
unbounded electric or
magnetic field problem
AZ, VOLT
INFIN110 (p. 332)
MAG, AZ, VOLT
INFIN111 (p. 338)
Application
Degrees of
Freedom
Source
Current source primitive (coil,
bar, arc) for magnetostatic
analysis
---
SOURC36 (p. 206)
Application
Degrees of
Freedom
Circuit
Resistor, capacitor, inductor,
current source, voltage source
VOLT, CURR
CIRCU94 (p. 311)
for a piezoelectric-circuit and
charge-based transient and
harmonic analyses
Resistor, capacitor, inductor,
current source, voltage source,
VOLT, CURR
CIRCU124 (p. 372)
mutual inductor, controlled
sources for a current-based
static, transient and harmonic
analyses
Diode for electric circuit
analysis
VOLT
CIRCU125 (p. 381)
Application
Degrees of
Freedom
Contact
Electric and magnetic contact
AZ, VOLT
CONTA172 (p. 535) -- 2D
surface-to-surface contact
MAG, VOLT
CONTA174 (p. 562) -- 3D
surface-to-surface contact
AZ, MAG,VOLT
CONTA175 (p. 591) -- 2D /
3D node-to-surface contact
135
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Elements for Electric and Magnetic Analysis

6.5. Elements for Diffusion Analysis
The elements listed in this section are available for a diffusion analysis.
Use the following diffusion elements for 2D simulation:
• PLANE238 (p. 1313) - 2D 8-Node Diffusion Solid
Use the following diffusion elements for 3D simulation:
• SOLID239 (p. 1318) - 3D 20-Node Diffusion Solid
• SOLID240 (p. 1322) - 3D 10-Node Tetrahedral Diffusion Solid
For more information, see Diffusion in the Theory Reference.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
136
Elements for Multiphysics Analysis

Chapter 7: Element Library
Following are descriptions of each element, which appear in numerical order.
Descriptions common to several elements appear in separate sections of General Element Features (p. 41)
and are referenced where applicable.
Read About This Reference (p. 1) and General Element Features (p. 41) before examining the element
descriptions in this chapter.
More detailed information about each element is available in the Mechanical APDL Theory Reference,
which describes how the element input items (such as the real constants, material properties, KEYOPT
switches, etc.) are used to produce the element output.
The following elements are available:
SOLID5
LINK11
COMBIN14
MASS21
PLANE25
MATRIX27
FLUID29
FLUID30
LINK31
LINK33
LINK34
PLANE35
SOURC36
COMBIN37
FLUID38
COMBIN39
COMBIN40
INFIN47
MATRIX50
PLANE55
SHELL61
LINK68
SOLID70
137
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

MASS71
PLANE75
PLANE77
PLANE78
PLANE83
SOLID87
SOLID90
CIRCU94
SOLID96
SOLID98
INFIN110
INFIN111
FLUID116
PLANE121
SOLID122
SOLID123
CIRCU124
CIRCU125
TRANS126
FLUID129
FLUID130
SHELL131
SHELL132
FLUID136
FLUID138
FLUID139
SURF151
SURF152
SURF153
SURF154
SURF155
SURF156
SHELL157
SURF159
TARGE169
TARGE170
CONTA172
CONTA174
CONTA175
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
138
Element Library
</rag-context>