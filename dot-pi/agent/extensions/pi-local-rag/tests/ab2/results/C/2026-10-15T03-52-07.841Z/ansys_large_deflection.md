<rag-context>
[pi-local-rag] RAG subagent: 2 sources, 3840 ms retrieval.
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


### H02 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/Ansys-mechanical-apdl-technology-demonstration-guide.txt (lines 7770-7969 · enclosing doc section)

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
1. Select the substep to initiate rezoning.
2. Select the region(s) to be repaired (typically via graphical picking).
3. Generate the new mesh.
4. Map variables and solve to balance residuals and achieve equilibrium.
5. Continue the analysis based on the new mesh.
This ring-gear forging example demonstrates the above steps in detail.
181
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.

14.2. Problem Description
A nonlinear large-deformation analysis of a ring-gear forging simulation is performed with two vertical
rezonings (multiple rezonings on a region occurring at different times). Both rezonings use a new mesh.
(The new mesh is created using any common meshing software application.)
The forging process is simulated using a 2-D axisymmetric model meshed with a 2-D four-node struc-
tural solid element (PLANE182). The model represents an elastoplastic cylindrical block (the work piece)
sitting in a rigid surface (static die).
The block is deformed by another rigid surface (moving die) that moves at an infinitesimal speed, such
that the final shape of the work piece becomes a ring gear with complete die fill, as shown in Fig-
ure 14.1: Original Finite Element Model with Boundary Conditions and Loading (p. 183).
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
14.3. Modeling
The cylindrical block is modeled using 396 plane elements (PLANE182) with axisymmetric behavior
(element key option KEYOPT(3) = 1). Options for full integration with the B-bar method (KEYOPT(1) =
0) and mixed u-P formulation (KEYOPT(6) = 1) are also specified.
et,1,182
keyopt,1,1,0        ! B-bar method (default)
keyopt,1,3,1        ! Axisymmetric
keyopt,1,6,1        ! Mixed u-P formulation
The B-bar method and the mixed u-P formulation prevent the volumetric locking that can be triggered
by large plastic deformation. Following is the initial finite element model with loading and boundary
conditions applied:
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
182
Ring-Gear Forging Simulation with Rezoning

Figure 14.1:  Original Finite Element Model with Boundary Conditions and Loading
14.3.1. Contact
Two rigid-deformable contact pairs without friction are defined using target and contact elements
(TARGE169 and CONTA171, respectively) with the Augmented Lagrangian formulation (KEYOPT(2) = 0)
activated.
The contact stiffness is updated at each iteration (KEYOPT(10) = 2).
The first contact pair is defined between the top die (moving) and the top and right edges of the work
piece. The second contact pair is defined between the bottom die (static) and the bottom and right
edges of the work piece.
14.4. Material Properties
The work piece is AISI8620 alloy with the following properties:[1]
Young's Modulus: E = 200e3 MPa
Poisson's ratio: √ = 0.3
The material is approximated as an elastoplastic material with a nonlinear isotropic hardening behavior.
The power-hardening law for nonlinear isotropic behavior is represented as:
(14.1)
where:
 = Current yield strength
 = Initial yield strength = 385.4 MPa
G = shear modulus
N = power value = 0.13
 = Equivalent plastic strain
The power-hardening option is activated via the following input:
183
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
Material Properties

tb,nliso,1,,power
tbdata,1, 0,n
14.5. Boundary Conditions and Loading
Symmetry displacement boundary conditions are applied to all nodes on the axis of symmetry.
No boundary conditions are applied to the rigid targets, as they are automatically restrained via the
TARGE169 target element's default behavior (KEYOPT(2) = 0).
The top rigid surface is displaced downwards by 138 mm in one load step. The downward displacement
compresses the cylindrical block (work piece), and the material flows to fill up the space between the
dies.
14.6. Analysis and Solution Controls
The following topics concerning analysis details and solution controls for this problem are available:
14.6.1. Solution Parameters and Analysis
14.6.2. Rezoning Techniques Applied to Ring-Gear Forging
14.6.1. Solution Parameters and Analysis
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
All restart files must be available; otherwise, it is impossible to know which substeps to perform to ini-
tiate the rezoning. It is also a good idea to save the results; doing so makes it easier to investigate the
reason for solution termination and decide which substep to use to activate rezoning. If it is not possible
to save results (due to disk space limitations, for example), they can be generated for a specific substep
from the restart files (ANTYPE,,REST,Loadstep,Substep,RSTCREATE).
14.6.2. Rezoning Techniques Applied to Ring-Gear Forging
The general rezoning process for vertical rezoning, horizontal rezoning, or a combination of both is the
same. Following are helpful techniques for applying rezoning specifically to a ring-gear forging problem:
14.6.2.1. Step 1: Select the Substep to Initiate Rezoning
14.6.2.2. Step 2: Select a Region to Remesh
14.6.2.3. Step 3: Apply a New Mesh
14.6.2.4. Map Variables and Balance Residuals
14.6.2.5. Perform a Multiframe Restart
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
184
Ring-Gear Forging Simulation with Rezoning

14.6.2.1. Step 1: Select the Substep to Initiate Rezoning
Selecting the best substep to initiate rezoning is the crucial factor in the rezoning process. No unique
selection criteria can be applied universally to all rezoning problems. Various substep-selection techniques
can be used for the initial rezoning or subsequent ones.
Generally, the best way to select a substep is by visual inspection of results in the postprocessing
module (/POST1). It is helpful to use the most important element solutions (PLESOL) to create animation
files that capture the specific moment when the mesh becomes sufficiently distorted, but not yet
severely distorted (that is, when internal angles approach or exceed 180 degrees).
It is good practice to correlate the element solutions plots with corresponding steps in the monitor file
(.mntr) and the convergence pattern in general. To initiate rezoning, select a substep where the current
time increment is not close to the specified minimum and where the convergence pattern of the solution
has not slowed down significantly (before bisections have started to occur).
In this example, no more than two rezonings are needed because the initial divergence occurs close
to the end of analysis (TIME = 0.96). The initial rezoning cannot be performed very close to the end of
the last converged substep, because another rezoning is planned before the end of the solution. If the
initial rezoning is performed at the beginning of the analysis, large subsequent deformations distort
the refined mesh too early in the process, necessitating more vertical rezonings.
14.6.2.1.1. First Rezoning
In this case, substep 26 (TIME = 0.716) is chosen because of the results and monitor file examinations.
Although this substep has fewer convergence difficulties than the original solution, experimentation
shows that some substeps close to substep 26 may also be good candidates for the first rezoning step.
In the following figure, the element solution of effective plastic strains at this stage shows the deformed
mesh, where some of the elements exhibit a very high aspect ratio and internal angles close to 180
degrees:
185
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
Analysis and Solution Controls

Figure 14.2:  Effective Plastic Strain and Deformed Mesh at Time of First Rezoning
14.6.2.1.2. Second Rezoning
For the second rezoning, the selection technique changes somewhat because the deformation is more
pronounced. The strain gradients are larger, and the mapping of variables is more difficult, than in the
first rezoning. It is necessary, therefore, to perform the next rezoning as close as possible to the end
time so that after restart, the analysis can continue to completion. Often, this technique involves a few
trial-and-error iterations to isolate the optimal substep for rezoning.
Substep 47 (TIME = 0.9138) or thereabouts appears to be best suited for remeshing from the perspective
of limited element distortions. The final selection of substep 45 (TIME = 0.9s) as the optimal substep,
however, is guided by the convergence from the prior balancing of the residual forces (MAPSOLVE).
Element distortions guide the general range of substeps best suited for remeshing. The residual-force
balancing determines the precise substep.
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
186
Ring-Gear Forging Simulation with Rezoning

Figure 14.3:  Effective Plastic Strains and Deformed Mesh at Time of Second Rezoning
14.6.2.2. Step 2: Select a Region to Remesh
After selecting the substep, the region to be remeshed must be selected (typically an easier task than
the substep selection process).
Generally, if the model is too large or too complex or if the mesh distortion is localized, horizontal
(multiple) remeshing is a better option than remeshing the entire model.
If the model is not large or the mesh distortion is widely spread as in this problem, the entire model
can be selected for remeshing.
Horizontal rezoning may be necessary depending on the model size, computational costs, and the degree
of accuracy required.
A region selected for remeshing should contain all of the highly distorted elements and, if possible,
should be slightly larger than the area containing the distorted elements. The only condition is that all
regions must be of the same element type, material type, thickness (for plane stress), and nodal coordin-
ate system (except for boundary nodes).
14.6.2.3. Step 3: Apply a New Mesh
Generating an improved mesh by remeshing is the key to successful rezoning. To improve convergence,
the new mesh should have better shape characteristics than the old mesh. To avoid mapping difficulties,
the size of the new mesh should not be changed drastically. Retaining the same element size (ESIZE)
187
Release 16.0 - © SAS IP, Inc. All rights reserved. - Contains proprietary and confidential information
of ANSYS, Inc. and its subsidiaries and affiliates.
Analysis and Solution Controls
</rag-context>