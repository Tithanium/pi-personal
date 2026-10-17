<rag-context>
[pi-local-rag] RAG subagent: 2 sources, 2496 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt (lines 14328-14527 · enclosing doc section)

Typically, inverse solving involves only one load step. At the end of the load step, the solution geometry
is the reference (undeformed) geometry which deforms to the input (deformed) geometry under the
applied loads. The reported stresses and strains are the values on the input geometry.
At the end of each substep, the converged solution gives a reference geometry at the partial loads
applied up to the end of the current substep; that is, the partial loads bring the reference geometry
to the input geometry. A series of reference geometries is therefore generated at sequential load
levels during the substeps within the load step, together with the stresses/strains on the input geometry
(caused by the deformation from the series of reference geometries):
Figure 8.19: Solutions Generated During Inverse Solving
8.7.5. Using the Solutions from an Inverse-Solving Analysis
The following topics for using the solutions generated from inverse solving are available:
8.7.5.1. Starting a New Forward-Solving Nonlinear Analysis
8.7.5.2. Reverting to Forward Solving and Continuing the Analysis as a New Load Step
8.7.5.1. Starting a New Forward-Solving Nonlinear Analysis
After inverse solving, you can update the nodal coordinate and material orientation to the reference
geometry and adjust your displacement-like loads, then start a new analysis using forward solving.
The material orientation is updated when the element coordinate system is updated (UPGEOM
with UPESYS = 1).
If you add the loads to the level of the inverse-solving analysis, the solution geometry (and associated
stresses and strains) of the new forward-solving analysis should be identical to that of the prior in-
verse-solving analysis. If needed for further analysis, you can add more loads, or new types of loads,
to obtain solutions for the structure under additional loading.
295
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Nonlinear Static Analysis with Inverse Solving

Loop Test
An inverse-solving analysis followed by a forward-solving analysis, or vice versa, is known as
a loop test, as it should always result in the same geometry with the same solution.
This approach is straightforward, offers easy-to-understand solution quantities, and is useful for
validating an inverse-solving solution. However, because it involves three stages and requires more
computational resources, it is not recommended for general use:
Figure 8.20: Inverse-Solving to Forward-Solving Analysis
8.7.5.2. Reverting to Forward Solving and Continuing the Analysis as a New
Load Step
By reverting to forward solving (INVOPT,OFF) and continuing the analysis as a new load step, you
can increase loads or apply new loads on the input geometry (or even unload) without the need
for Stage 2 in Figure 8.20: Inverse-Solving to Forward-Solving Analysis  (p. 296), going directly from
to Stage 1 from Stage 3.
Using this approach requires remaining within in the solution processor (/SOLU) during the entire
process. When the new load step using forward solving begins, the program indicates that the in-
verse-solving option has been disabled.
At this point, the program resets all the displacements to zero and starts to accumulate them from
zero, as the element formulation is now different. The deformation that would have occurred in
Stage 2, however, is maintained.
You can increase the load level or apply new loads at Stage 3 without limitation. Force-like loads
are the same as in the prior inverse-solving analysis. For displacement-like loads, the sign is reversed,
as the displacements are to bring input geometry to the further-deformed geometry (rather than
to bring the input geometry back to the reference geometry).
Instead of further loading, you can also unload after reverting to forward solving.
For any load steps following an inverse-solving analysis, the load-step options indicate that inverse
solving has occurred:
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
296
Nonlinear Structural Analysis

8.7.6. Reviewing Inverse-Solving Analysis Results
As in an analysis using forward solving, you can control results output while in Stage 1 (Figure 8.20: In-
verse-Solving to Forward-Solving Analysis  (p. 296)) of an inverse-solving analysis. Be aware, however,
that the stresses and strains represent the results based on the input geometry.
You can review element results (such as stress and strain) by displaying the contour on the input
geometry (/DSCALE,WN,OFF).
If further loading is applied after an inverse-solving analysis (moving from Stage 1 to Stage 3 directly),
the displacement result is not accumulated continuously at the switching points, apparent when
viewing an animation of the displacement contour plot. Stresses and strains are continuously accu-
mulated, however, and represent the total values from the reference (undeformed) geometry.
8.7.7. Restarting an Inverse-Solving Analysis and Linear Perturbation
You can restart an inverse-solving analysis at Stage1 (Figure 8.20: Inverse-Solving to Forward-Solving
Analysis  (p. 296)), but the new solutions are new reference geometries with more loads based on the
input geometry.
Because the solved geometry is a reference geometry but the stresses and strains are on the input
geometry, avoid applying linear perturbation (p. 333) during a restart in an inverse-solving analysis.
(You can, however, start a new modal or harmonic analysis based on the undeformed reference
geometry.)
After reverting to forward solving (Stage 3), you can perform a restart and apply linear perturbation
with no other limitations.
8.7.8. Inverse-Solving Limitations
The following requirements and limitations apply in an inverse-solving analysis:
297
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Nonlinear Static Analysis with Inverse Solving

• Inverse solving is available for the these 3D solid elements:
– Homogeneous form of SOLID185 (KEYOPT(3) = 0)
– Homogeneous form of SOLID186 (KEYOPT(3) = 0)
– SOLID187
For SOLID185, full integration with the  method, enhanced strain formulation, and simplified en-
hanced strain formulation are supported.
For all three elements, all formulations can be used with mixed u-P formulation (KEYOPT(6) > 0)
for nearly- or fully-incompressible materials.
• Inverse solving is available for the following element types with uniaxial stiffness:
– Truss element LINK180, with these limitations:
→Both rigid and scalable cross-sections are supported. However, the scalable cross-section area
can be defined on stress-free (undeformed) geometry only
→Tension-/compression-only options are not supported.
– Spring element COMBIN39, with these limitations:
→Loading and unloading curves must be identical (KEYOPT(1) = 1).
→The compressive loading curve can only be the reflection of the tensile loading curve.
→Only translational degrees of freedom are supported.
• Contact elements are not supported, although MPC-based contact (KEYOPT(2) = 2) is supported
for connecting dissimilar meshes.
• Material support:
– For 3D solid elements SOLID185, SOLID186, and SOLID187:
→All hyperelastic materials are supported, including fully incompressible (material incom-
pressibility parameter d = 0).
→Other nonlinear material properties (such as plasticity and creep) are not supported.
→Linear elastic material is supported, even when Poisson's ratio ν = 0.5 (requiring mixed
u-P formulation).
→For anisotropic material, the material coordinate system is defined based on the stress-
free (undeformed) geometry.
→For orthotropic materials, the material coordinate system is defined based on the input
(deformed) geometry.
– For LINK180 element:
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
298
Nonlinear Structural Analysis

→Linear elastic material is supported
• Only static analyses with large-deformation effects enabled (NLGEOM,ON) are supported. The un-
symmetric solver (NROPT,UNSYM) is required and the program uses it automatically.
• Linear perturbation (p. 333) is not supported.
• Initial state is not supported and does not apply to an inverse-solving analysis.
8.8. Performing a Nonlinear Transient Analysis
Many of the tasks that you need to perform in a nonlinear transient analysis are the same as (or similar
to) those that you perform in nonlinear static analyses (described in Performing a Nonlinear Static
Analysis (p. 280)) and linear full transient dynamic analyses (described in Structural Static Analysis (p. 9)).
However, this section describes some additional considerations for performing a nonlinear transient
analysis.
You cannot use the Solution Controls dialog box (Performing a Nonlinear Static Analysis (p. 280)) to set
solution controls for a thermal analysis. Instead, use the standard set of solution commands and the
standard corresponding menu paths.
8.8.1. Build the Model
This step is the same as for a nonlinear static analysis. If your analysis includes time-integration effects,
however, include a value for mass density (MP,DENS). You can also define material-dependent struc-
tural damping (MP,BETD, MP,ALPD, TB,SDAMP,,,,BETD, or TB,SDAMP,,,,ALPD).
8.8.2. Apply Loads and Obtain the Solution
1. Specify transient analysis type and define analysis options as you would for a nonlinear static
analysis:
• New Analysis or Restart (ANTYPE)
• Analysis Type: Transient (ANTYPE)
• Large Deformation Effects (NLGEOM)
2. Apply loads and specify load step options in the same manner as you would for a linear full
transient dynamic analysis. A transient load history usually requires multiple load steps, with the
first load step typically used to establish initial conditions (see the Basic Analysis Guide). The gen-
eral, nonlinear, birth and death, and output control options available for a nonlinear static analysis
are also available for a nonlinear transient analysis.
In a nonlinear transient analysis, time must be greater than zero. See Transient Dynamic Analys-
is (p. 153) for procedures for defining nonzero initial conditions.
For a nonlinear transient analysis, you must specify whether you want stepped or ramped loads
(KBC). See the Basic Analysis Guide for further discussion about ramped vs. stepped loads.
You can also specify dynamics options: alpha (ALPHAD) and beta (BETAD) damping, time-integ-
ration effects (TIMINT), and transient integration parameters (TINTP):
299
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Performing a Nonlinear Transient Analysis

• Damping
Rayleigh damping constants are defined using the constant mass (ALPHAD) and stiffness
(BETAD) matrix multipliers. In a nonlinear analysis, the stiffness may change drastically; therefore,
use BETAD with care. For more information, see See Damping (p. 2).
• Time-Integration Effects (TIMINT)
Time-integration effects are ON by default in a transient analysis. For creep, viscoelasticity, vis-
coplasticity, or swelling, you should turn the time-integration effects off (that is, use a static
analysis). These time-dependent effects are usually not included in dynamic analyses because
the transient dynamic time-step sizes are often too short for any significant amount of long-
term deformation to occur.
Except in kinematic (rigid-body motion) analyses, you rarely need to adjust the transient integ-
ration parameters (TINTP), which provide numerical damping to the Newmark and HHT methods.
(See your Mechanical APDL Theory Reference for more information about these parameters.)
Automatic solution control sets the defaults to a new time-integration scheme for use by first
order transient equations. This is typically used for unsteady-state thermal problems where θ =
1.0 (backward Euler scheme). It is unconditionally stable and more robust for highly nonlinear
thermal problems such as phase changes. The oscillation limit tolerance defaults to 0.0, so that
the response first order eigenvalues can be used to more precisely determine a new time-step
value.
3. Write load data for each load step (LSWRITE) to a load step file.
4. Save a backup copy of the database to a named file (SAVE).
5. Start solution calculations (LSSOLVE). Other methods for multiple load steps are described in
Getting Started in the Basic Analysis Guide.
6. After solving all load steps, exit the SOLUTION processor (FINISH).
8.8.3. Review the Results
As in a nonlinear static analysis, you can use POST1 to postprocess results at a specific moment in
time. Procedures are much the same as described previously for nonlinear static analyses. Again, you
should verify that your solution has converged before you attempt to postprocess the results.
Time-history postprocessing using POST26 is essentially the same for nonlinear as for linear transient
analyses. See the postprocessing procedures outlined in Transient Dynamic Analysis (p. 153).
More information about postprocessing is available in the Basic Analysis Guide.
8.8.4. Example: Nonlinear Transient Analysis
!  Build the Model:
/PREP7
---                     ! Similar to a linear full transient model, with
---                     ! these possible additions: nonlinear material
---                     ! properties, nonlinear elements
---
FINISH

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt (lines 7925-8124 · enclosing doc section)

Mode-Superposition Harmonic Analysis

The only POST1 (or POST26) procedure difference between this method and the full method is that
if you requested expansion at a specific phase angle (HREXP, angle) there is only one solution available
for each frequency. Use the SET command to read in the results.
If results are calculated by combining the modal results (MSUPkey = YES on MXPAND in the modal
analysis), some limitations apply. For more information, see Option: Number of Modes to Expand
(MXPAND) (p. 43).
Caution:
The stiffness energy (SENE) and strain energy density (SEND) computed for a linear perturb-
ation mode-superposition analysis with a nonlinear base analysis is an approximate solution
and may not be accurate.
4.7.5. Example: Mode-Superposition Harmonic Analysis
!  Build the Model
/FILNAM,...                  ! Jobname
/TITLE,...                   ! Title
/PREP7                       ! Enter PREP7
---
---                          ! Generate model
---
FINISH
!  Obtain the Modal Solution
/SOLU                       ! Enter SOLUTION
ANTYPE,MODAL                ! Modal analysis
MODOPT,LANB                 ! Block Lanczos
MXPAND,,,,YES.              ! Expand and calculate element results
D,...                       ! Constraints
SF,...                      ! Element loads
SAVE
SOLVE                       ! Initiate modal solution
FINISH
!  Obtain the Mode-Superposition Harmonic Solution
/SOLU                      ! Enter SOLUTION
ANTYPE,HARMIC              ! Harmonic analysis
HROPT,MSUP,...             ! Mode-superposition method; number of modes to use
HROUT,...                  ! Harmonic analysis output options; cluster option
LVSCALE,...                ! Scale factor for loads from modal analysis
F,...                      ! Nodal loads
HARFRQ,...                 ! Forcing frequency range
DMPRAT,...                 ! Damping ratio
MDAMP,...                  ! Modal damping ratios
NSUBST,...                 ! Number of harmonic solutions
KBC,...                    ! Ramped or stepped loads
SAVE
SOLVE                      ! Initiate solution
FINISH
!  Review the Results of the Mode-Superposition Solution
/POST26
FILE,,                 ! Postprocessing file is Jobname.rfrq
NSOL,...                   ! Store nodal result as a variable
PLCPLX,...                 ! Define how to plot complex variables
PLVAR,...                  ! Plot variables
FINISH
!  Expand the Solution (for Stress Results)
/SOLU! Re-enter SOLUTION
EXPASS,ON                  ! Expansion pass
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
150
Harmonic Analysis

EXPSOL,...                 ! Expand a single solution
HREXP,...                  ! Phase angle for expanded solution
SOLVE
FINISH
! Review the Results of the Expanded Solution
/POST1
SET,...                   ! Read results for desired frequency
PLDISP,...                ! Deformed shape
PLNSOL,...                ! Contour plot of nodal results
---
FINISH
See the Command Reference for a discussion of the ANTYPE, MODOPT, HROPT, HROUT, LVSCALE,
F, HARFRQ, DMPRAT, DMPSTR, MDAMP, NSUBST, KBC, FILE, NSOL, PLCPLX, PLVAR, EXPASS, EX-
PSOL, HREXP, SET, and PLNSOL commands.
4.8. Applying Prestress Effects in a Harmonic Analysis
The following sections describe how to apply prestress effects in harmonic analyses:
4.8.1. Prestressed Harmonic Analysis
4.8.2. Prestressed Full-Harmonic Analysis Using the PSTRES Command (Legacy Procedure)
4.8.1. Prestressed Harmonic Analysis
A prestressed harmonic analysis calculates the dynamic response of a prestressed structure, such as
a violin string. The prestress influences the stiffness of the structure through the stress-stiffening (or
possibly a nonlinear tangent) matrix contribution. Response to harmonically varying loads is computed
using this effective stiffness of the structure. The output stresses from this analysis, therefore, reflect
the effect of prestress on the stiffness of the structure. The contribution of the stresses from the
static (or transient) prestress is not included in the output as the harmonic response stress components
are assumed to be at zero mean.
The linear perturbation harmonic procedure is the preferred method for performing a prestressed
full, frequency-sweep, or mode-superposition harmonic analysis. Because the linear perturbation
analysis (p. 333) accommodates both linearly and nonlinearly prestressed cases, the prestressed effects
of the structure from the previous base analysis (linear or nonlinear, static or full transient) are included.
Only linear behavior is valid in a harmonic analysis. Nonlinear elements (if any) will be treated as linear
elements based on their status at the end of the base analysis. An exception exists for contact elements,
as their status can be changed during the first phase of the linear perturbation analysis. For more
information, see First Phase of the Linear Perturbation Analysis (p. 337).
If thermal body forces are present in the static prestress analysis, they are automatically disabled
during the linear perturbation harmonic analysis (see THEXPAND).
For more information about the full and frequency-sweep harmonic procedures, see Harmonic Ana-
lysis Based on Linear Perturbation in the Theory Reference and Second Phase - Harmonic Analysis (p. 343).
To include prestress effects in a mode-superposition analysis, you must first perform a prestressed
modal analysis. Once prestressed modal analysis results are available, proceed as for any other mode-
superposition analysis.
151
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Applying Prestress Effects in a Harmonic Analysis

You must perform a linear perturbation (p. 333) modal analysis prior to doing the downstream
prestressed mode-superposition analysis. Both Elcalc and MSUPkey must be set to YES on the
MXPAND command during the linear perturbation modal analysis phases so that the downstream
stress expansion pass can produce the consistent solution to the linear or nonlinear base (static or
full transient) analysis. The prestressed nonlinear element history (saved variables) is accessible only
in the first and second phases of the linear perturbation. The downstream analysis can only reuse
this nonlinear information contained in the Jobname.mode file which is generated in the linear
perturbation.
For more information about the mode-superposition procedure, see Downstream Analysis Using the
Solution of a Linear Perturbation Analysis in the Mechanical APDL Theory Reference or Downstream
Analysis Following the Linear Perturbation Analysis (p. 346).
For a linear pertubation (prestressed) harmonic example, see Example 9.7: Linear Perturbation
(Prestressed) Harmonic Analysis (p. 364).
As an alternative to the linear perturbation full harmonic procedure, the legacy procedure based on
the PSTRES command can be used, as described in the following section. The linear perturbation (p. 333)
full harmonic method provides more options for controlling the contact status compared to the
PSTRES procedure.
4.8.2. Prestressed Full-Harmonic Analysis Using the PSTRES Command
(Legacy Procedure)
The procedure described here for doing a prestressed full-harmonic analysis is essentially the same
as that for any other full-harmonic analysis except that you first need to prestress the structure by
doing a static analysis:
1. Build the model and obtain a static solution with prestress effects turned on (PSTRES,ON). The
procedure to obtain the static solution is explained in Structural Static Analysis (p. 9).
2. Reenter SOLUTION and obtain the full-harmonic solution, also with prestress effects turned
on (reissue PSTRES,ON). Files Jobname.emat (if created) and Jobname.esav from the
static analysis must be available. Hence, if another analysis is performed between the static
and prestressed harmonic analyses, the static analysis will need to be rerun.
Because only linear behavior is valid in a harmonic analysis, nonlinear elements (if any) will
be treated as linear elements. If you include contact elements, for example, their stiffnesses
are calculated based on their initial status and are never changed. For a prestressed harmonic
analysis, the program assumes that the initial status of the contact elements is the status at
the completion of the static prestress analysis.
If thermal body forces were present during the static prestress analysis, these thermal body
forces must not be deleted during the full-harmonic analysis or else the thermal prestress
will vanish. By default, thermal loads are included in the full-harmonic analysis as sinusoidally
time-varying temperature loads (THEXPAND,ON). If you do not wish to include harmonic
temperature loads, THEXPAND,OFF can be used to omit them.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
152
Harmonic Analysis

Chapter 5:Transient Dynamic Analysis
Transient dynamic analysis (sometimes called time-history analysis) is a technique used to determine
the dynamic response of a structure under the action of any general time-dependent loads. You can
use this type of analysis to determine the time-varying displacements, strains, stresses, and forces in a
structure as it responds to any combination of static, transient, and harmonic loads. The time scale of
the loading is such that the inertia or damping effects are considered to be important. If the inertia and
damping effects are not important, you might be able to use a static analysis instead (see Structural
Static Analysis (p. 9)).
The basic equation of motion solved by a transient dynamic analysis is:
where:
 = mass matrix
 = damping matrix
 = stiffness matrix
 = nodal acceleration vector
 = nodal velocity vector
 = nodal displacement vector
 = load vector
At any given time, , these equations can be thought of as a set of "static" equilibrium equations that
also take into account inertia forces (
) and damping forces (
). The program uses the
Newmark time-integration method or an improved method called HHT to solve these equations at
discrete time points. The time increment between successive time points is called the integration time
step.
The following topics are available for transient dynamic analysis:
5.1. Preparing for a Transient Dynamic Analysis
5.2.Two Solution Methods for Transient Analysis
5.3. Performing a Full Transient Dynamic Analysis
5.4. Performing a Mode-Superposition Transient Dynamic Analysis
5.5. Performing a Prestressed Transient Dynamic Analysis
5.6.Transient Dynamic Analysis Options
5.7.Where to Find Other Examples
153
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

For more information, see Nonlinear Transient Analyses (p. 263).
5.1. Preparing for a Transient Dynamic Analysis
A transient dynamic analysis is more involved than a static analysis because it generally requires more
computer resources and more of your resources, in terms of the "engineering" time involved. You can
save a significant amount of these resources by doing some preliminary work to understand the physics
of the problem. For example, you can:
1. Analyze a simpler model first. A model of beams, masses, and springs can provide good insight
into the problem at minimal cost. This simpler model may be all you need to determine the
dynamic response of the structure.
2. If you are including nonlinearities, try to understand how they affect the structure's response
by doing a static analysis first. In some cases, nonlinearities need not be included in the dynamic
analysis.
3. Understand the dynamics of the problem. By doing a modal analysis, which calculates the
natural frequencies and mode shapes, you can learn how the structure responds when those
</rag-context>