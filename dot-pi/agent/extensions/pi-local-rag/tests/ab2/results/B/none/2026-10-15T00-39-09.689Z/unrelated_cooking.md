<rag-context>
[pi-local-rag] RAG subagent: 1 sources, 115 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/ANSYS_Mechanical_APDL_Technology_Showcase_Example_Problems.txt (lines 11327-11526 · enclosing doc section)

---
---
C 03
3.7081
3.6892
3.5665
μ
The following figure is a comparison of the models with the parameters fit to the modified experi-
mental data:
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
240
Calibrating and Validating a Hyperelastic Constitutive Model

Figure 15.7: Parameters Fit to Experimental Data to About 100 Percent Strain
For the equibiaxial and planar experiments, any of the three models might be acceptable; however,
the comparison with the uniaxial data might indicate that none of the three models are acceptable.
The behavior of the model outside the fitted range can significantly differ from the actual response
of the material. For example, the model parameters fit to the experimental data to 100 percent strain
have been used to simulate the hyperelastic test suite to strains of about 200 percent, as shown in
the following comparisons:
241
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Results and Discussion

Figure 15.8: Comparison of the Data and Fits Showing Predictions Outside the Range of Fitted
Data
Beyond 100 percent strain, it becomes apparent that some of the predictions quickly deteriorate. In
all three comparisons, the nine-parameter model quickly loses accuracy, and it appears that the three-
and nine-parameter Mooney-Rivlin models have lost stability for the biaxial deformation case.
15.5.2.Validation Results
The five-parameter Mooney-Rivlin model, fit to the experimental data up to 100 percent strain, is se-
lected as an adequate representation of the material response. The constitutive model is specified
via the following input:
C10 = 1.787381e+00  
C01 = 5.722875e-02  
C20 =-5.876502e-02  
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
242
Calibrating and Validating a Hyperelastic Constitutive Model

C11 = 2.684331e-02  
C02 =-5.112790e-03  
TB,HYPER,1,,5,MOONEY
TBDATA,1,C10,C01,C20,C11,C02 
The following figure shows a contour plot of the strain energy density at the end of simulation. The
plot offers a general idea of the overall deformation of the specimen.
Figure 15.9: Strain-Energy Density Contours of the Tension-Torsion Test
With the exception of the clamp regions, the deformation shows a uniform pattern in the gage region
along the axis of twisting. Perpendicular to the axis of twisting is a large strain-energy density near
the outside edge of the specimen, decreasing toward the center.
The following figure shows a comparison of the model with the experimental moment vs. theta data:
Figure 15.10: Comparison of Tension-Torsion Experiment to the Five-Parameter Mooney-Rivlin
Model
After a seemingly anomalous first data point, the error between the simulation and experiment is in
the range of 2 to 4 percent. Throughout the entire simulation, the five-parameter Mooney-Rivlin
model predicts a higher moment for an equivalent twist, which is not entirely expected by the error
plots for the hyperelastic test suite comparisons; nevertheless, a maximum four percent error appears
to be a reasonable margin of error for this simulation.
15.6. Recommendations
When performing a similar type of calibration and validation, consider the following recommendations:
243
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Recommendations

• Obtain test data from at least two (and preferably all three) of the experiments in the hyperelastic
test suite.
• Ensure that the test data covers the range of deformation over which the constitutive model will be
used.
• If the error between the experimental data and the constitutive model is too great, try limiting the
experimental data to the range of deformation over which the constitutive model will be used.
• Use the constitutive model within the range of fitted data only.
• Use an independent experiment to validate that the constitutive model adequately matches the
material behavior.
15.7. References
The following references were consulted when creating this example problem:
1. ASTM International. (2006). ASTM Standard D1043. Standard Test Method for Stiffness Properties of
Plastics as a Function of Temperature by Means of a Torsion Test. West Conshohocken.
2. ASTM International. (2006). ASTM Standard D412. Standard Test Methods for Vulcanized Rubber and
Thermoplastic Elastomers-Tension. West Conshohocken.
15.8. Input Files
The following files were used in this problem:
• tension_torsion.dat  -- Tension-torsion simulation input file.
• tension_torsion.cdb -- The common database file containing the model information for this
problem (called by tension_torsion.dat ).
For more information, see Obtaining the Input Files (p. xlvii).
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
244
Calibrating and Validating a Hyperelastic Constitutive Model

Chapter 16: Evaluation of Mixed-Mode Stress
Intensity Factors and T-stress for 3D Surface Flaws
This example problem shows how to evaluate mixed-mode stress-intensity factors, J-integrals, and T-
stresses for cracks in structural components. Analyses of a simple semicircular surface flaw in a rectan-
gular block and a warped flaw along a tubular joint are discussed.
The following features and capabilities are highlighted:
• Evaluating mode-I stress-intensity factors and T-stresses for a semicircular surface flaw in a rectangular
block.
• Evaluating mixed-mode stress-intensity factors and T-stresses for a warped semi-elliptical surface flaw
in a tubular joint.
• Meshing around a crack front in 3D structures.
The following topics are available:
16.1. Introduction
16.2. Problem Description
16.3. Modeling
16.4. Material Properties
16.5. Boundary Conditions and Loading
16.6. Analysis and Solution Controls
16.7. Results and Discussion
16.8. Recommendations
16.9. References
16.10. Input Files
You can also perform this example analysis entirely in the Ansys Mechanical application. For more in-
formation, see Evaluation of Mixed-Mode Stress Intensity Factors and T-stress for 3-D Surface Flaws in
the Mechanical Technology Showcase: Example Problems.
16.1. Introduction
Fracture analysis is widely used to predict component failure caused by preexisting small cracks, allowing
one to take precautions to prevent further crack-growth or to determine the remaining life of the
structure.
245
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

To assess the fracture damage, stress intensity factors (SIFs) must be evaluated accurately. Because it
is difficult to determine accurate SIFs using a closed-form analytical solution for cracks in complex
structures, finite-element analysis is used instead.
Two approaches are available for evaluating SIFs:
• Interaction Integral Method -- Performs the SIF calculation during the solution phase of the
analysis and stores the results for later postprocessing.
• Displacement Extrapolation Method -- Performs the SIF calculation during postprocessing.
This method is limited to problems involving linear elasticity with homogeneous, isotropic ma-
terials near the crack region.
The interaction integral method is used here as it allows for the calculations to be performed during
the solution phase. It is also more accurate, as the domain integral expressions are naturally aligned
with the FE formulation.
16.2. Problem Description
The following two models with surface flaws are considered for analysis:
16.2.1. Rectangular Block with a Semicircular Surface Flaw
16.2.2. X-Joint Pipe with Warped Surface Flaw
16.2.1. Rectangular Block with a Semicircular Surface Flaw
This model is fixed at one face of the block and a pressure load is applied on the opposite face. The
block has a semicircular surface flaw at the center of one longitudinal face in the thickness direction-
-a crack is perpendicular to one of the surfaces of the rectangular block--with a 20 mm radius, as
shown:
Figure 16.1: Rectangular Block Geometry with Semicircular Surface Flaw
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
246
Evaluation of Mixed-Mode Stress Intensity Factors and T-stress for 3D Surface Flaws

A torus is created around the crack front to control the mesh at the crack front. The objective is to
find KI along the crack front and validate the results with reference results.[1][2][3]
Following is the semicircular crack and torus along the crack front used to create a sweep mesh with
SOLID186:
Figure 16.2: Semicircular Crack and Torus Along the Crack Front
16.2.2. X-Joint Pipe with Warped Surface Flaw
A semi-elliptical warped surface flaw at the tubular joint is analyzed to obtain mixed-mode SIFs (KI,
KII and KIII) along the crack front:
Figure 16.3: X-Joint Pipe Full Model with Warped Surface Flaw at Welded Joint
The problem consists of two tubular members attached to each other by a welded joint. The tubular
members have outer diameters of 323.85 mm (D1), 219.08 mm (D2), and thicknesses of 15.88 mm
(t1) and 8.18 mm (t2), respectively. The semi-elliptical surface crack lies on a plane parallel to the ra-
dial direction of the heavier running pipe.
247
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Problem Description

A torus is created around the crack front to control the mesh at the crack front. The semi-elliptical
surface crack at the weld toe is warped along the welded joint and it is perpendicular to the outer
surface of the 323.85 mm diameter pipe in the thickness direction.
Following are the crack dimensions:
Figure 16.4: Semi-elliptical Surface Crack Dimensions
The warped crack profile at the welded joint is created via the interaction of a rotated semi-ellipse
on the 323.85 mm diameter pipe and an extruded circle normal to the inner surface of the same pipe
at the welded joint, as shown:
Figure 16.5: Two-plane Symmetry of X-joint Pipe with Warped Surface Flaw Geometry
16.3. Modeling
For 3D models, the recommended element type near the crack front is SOLID186, the 20-node brick
element.
The rectangular block and x-joint pipe models are meshed with SOLID187 elements (except for the regions
around the crack tip), as shown:
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
248
Evaluation of Mixed-Mode Stress Intensity Factors and T-stress for 3D Surface Flaws

Figure 16.6: Rectangular Block Model with Boundary Conditions and Loading Applied
Regions around the crack tips are meshed with SOLID186, as shown:
Figure 16.7: Sweep Mesh with SOLID186 Around Crack Front
Due to the two-plane symmetry of the x-Joint problem, a quarter model is considered for analysis, as
shown:
249
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Modeling
</rag-context>