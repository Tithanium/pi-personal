<rag-context>
[pi-local-rag] RAG subagent: 2 sources, 4842 ms retrieval.
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


### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Basic_Analysis_Guide.txt (lines 8148-8302 · enclosing doc section)

7.3.3.3. Summable, Non-Summable, and Constant Data
By default, when you perform load case combinations in POST1, the program combines only data
that are valid for linear superposition, such as displacements and component stresses. Other data,
such as plastic strains and element volumes, are not combined, because it is not appropriate or
meaningful to combine such data. To determine which data should be combined and which should
not, result items are grouped into summable, non-summable, and constant data. This grouping applies
to the following POST1 database operations:
• Load case combinations (LCOPER).
• Reading in a load case with active scale factors (LCFACT or LCASE).
• Reading in results data and modifying them via the FACT or ANGLE field on the SET com-
mand.
Summable data are those that can participate in the database operations. All primary data (DOF
solutions) are considered summable. Among the derived data, component stresses, elastic strains,
thermal gradients and fluxes, magnetic flux density, etc. are considered summable (see
Table 7.2: Examples of Summable POST1 Results (p. 184)). (For an inclusive list of summable data,
see the description of the ETABLE command in the Command Reference.)
Sometimes, combining summable data may result in meaningless results. For example, adding
nodal temperatures from two load cases of a linear, pure-conduction analysis gives meaningful
results, but if convection is involved, the addition of temperatures is not meaningful. Exercise your
engineering judgement when reviewing combined load cases.
Non-summable data are those that are not valid for linear superposition, such as nonlinear data
(plastic strains, hydrostatic pressures), thermal strains, magnetic forces, Joule heat, etc. (See
Table 7.3: Examples of Non-Summable POST1 Results (p. 184).) These data are simply set to zero
when the programs performs a database operation. You can combine non-summable data (LC-
SUM,ALL) before issuing LCOPER commands, but take care to interpret the values appropriately.
183
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Additional POST1 Postprocessing

Constant data are those that cannot be meaningfully combined, such as element volumes and
element centroidal coordinates (see Table 7.4: Examples of Constant POST1 Results (p. 184)). These
data are held constant (unchanged) when the program performs a database operation.
Table 7.2: Examples of Summable POST1 Results
"Vector" Data
Component
Item
Component
Item
Component
Item
X, Y, Z
V
X, Y, Z
ROT
X, Y, Z
U
X, Y, Z, XY, YZ,
XZ
EPEL
X, Y, Z, XY, YZ,
XZ
S
X, Y, Z
A
X, Y, Z
PG
X, Y, Z
TF
X, Y, Z
TG
X, Y, Z
H
X, Y, Z
D
X, Y, Z
EF
X, Y, Z
M
X, Y, Z
F
X, Y, Z
B
X, Y, Z
JS
X, Y, Z
CSG
X, Y, Z
VF
X, Y, Z, XY, YZ,
XZ
EPDI
X,Y,Z
DF
X,Y,Z
CG
(ALL)
SMISC
(ALL)
LEPEL
(ALL)
LS
"Scalar" Data
MAG
PRES
TEMP
FLUX
FLOW
TBOT
VOLT
TE2
AMPS
HEAT
Table 7.3: Examples of Non-Summable POST1 Results
"Vector" Data
Component
Item
Component
Item
Component
Item
SEPL, SRAT,
HPRES, EPEQ,
PSV, PLWK
NL
X, Y, Z, XY, YZ,
XZ
EPTH
X, Y, Z, XY, YZ,
XZ
EPPL
(ALL)
LEPTH
TEMP
BFE
X, Y, Z
FMAG
(ALL)
NLIN
(ALL)
LEPCR
(ALL)
LEPPL
(ALL)
NMISC
(ALL)
LBFE
"Scalar" Data
JHEAT
KENE
SENE
EPSW
Table 7.4: Examples of Constant POST1 Results
"Vector" Data
Component
Item
X, Y, Z
CENT
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
184
The General Postprocessor (POST1)

"Scalar" Data
VOLU
</rag-context>