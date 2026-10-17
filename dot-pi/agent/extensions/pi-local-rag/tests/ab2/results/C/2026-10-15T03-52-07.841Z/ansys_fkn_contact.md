<rag-context>
[pi-local-rag] RAG subagent: 1 sources, 5833 ms retrieval.
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
</rag-context>