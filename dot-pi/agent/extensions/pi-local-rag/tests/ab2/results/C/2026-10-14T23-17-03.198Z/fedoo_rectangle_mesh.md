<rag-context>
[pi-local-rag] RAG subagent: 31 sources, 30513 ms retrieval.
grep term: "rectangular"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 15653-15852 · enclosing doc section)

X
---
Damage initiation threshold
(critical accumulated equivalent
plastic strain)
Y
You can define additional dependencies of the damage-initiation threshold on temperature or
other field variables (TBTEMP or TBFIELD, respectively).
4.25.7.3.3. Defining the Ductile Damage-Evolution Law
Damage evolution is either linear or exponential.
Define linear evolution of damage via the damage material data table (TB,CDM,,,,LINDMG) and
input the following material constant (TBDATA):
Range
Unit
Property
Meaning
Constant
Length
Relative equivalent plastic
displacement at full degradation
C1
Define exponential evolution of damage via the damage material data table (TB,CDM,,,,EXPDMG)
and input the following material constant (TBDATA):
Range
Unit
Property
Meaning
Constant
1 / Length
Damage rate coefficient
C1
Define temperature- or field-dependent data for the data tables (TBTEMP or TBFIELD, respectively).
4.25.7.3.4. Defining Viscous Regularization (Optional)
In addition to the crack-band regularization, you can optionally activate viscous regularization
for the ductile-damage model to better stabilize the solution.
Define viscous regularization via the damage material table (TB,CDM,,,,VREG) and input the fol-
lowing material constant (TBDATA):
Range
Unit
Property
Meaning
Constant
Time
Characteristic viscous relaxation
time
C1
If introducing the viscous effect for stabilization only, specify a characteristic viscous-relaxation
time that is significantly smaller than the time step of the load step. The smaller time value pre-
vents spurious rate-dependency of the results.
4.25.7.3.5. Defining the Damage Cap
Optionally, define the damage cap. See Damage Cap (p. 323) for more details.
349
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Material Damage

4.25.7.3.6. Example: Defining a Ductile-Damage Model
The following input defines a ductile-damage model combining:
• Isotropic linear elasticity
• Von Mises plasticity with bilinear isotropic hardening
• Stress triaxiality dependent damage initiation threshold
• Exponential damage-evolution law
/prep7
! isotropic linear elasticity
TB,ELASTIC,1,,,ISOT
TBDATA,1,70E3 ! Young’s modulus [MPa]
TBDATA,2,0.33 ! Poisson’s ratio [-]
! von Mises plasticity model with bilinear isotropic hardening
TB,PLASTIC,1,,,BISO
TBDATA,1,350  ! initial yield strength [MPa]
TBDATA,2,100  ! plastic tangent modulus [MPa]
! ductile-damage criterion 
TB,CDM,1,,,DUCTILE
! stress triaxiality [-], damage initiation threshold [-]
TBPT,DEFI,0.00,1.00
TBPT,DEFI,0.11,0.61
TBPT,DEFI,0.22,0.37
TBPT,DEFI,0.33,0.22
TBPT,DEFI,0.44,0.14
TBPT,DEFI,0.56,0.08
TBPT,DEFI,0.67,0.05
TBPT,DEFI,0.78,0.03
TBPT,DEFI,0.89,0.02
TBPT,DEFI,1.00,0.01
! exponential damage evolution law
TB,CDM,1,,,EXPDMG
TBDATA,1,100 ! initial slope of damage function [1/mm]
4.25.7.4. Ductile-Damage Output
The damage parameter is available for postprocessing (/POST1 and /POST26). The assigned label
is GDMG.
4.25.8. References
1. Yin, B., Zreid, I., Zhao, D., Ahmed, R., Lin, G., & Kaliske, M. (2022). Thermomechanical fatigue life
prediction of metallic materials by a gradient enhanced viscoplastic damage approach. International
Journal for Numerical Methods in Engineering.. 123(9), 2042-2075.
2. Yin. B., Zreid, I., Lin, G., Bhashyam, G., & Kaliske, M. (2020). An anisotropic damage formulation for
composite materials based on a gradient-enhanced approach: Formulation and implementation
at small strain. International Journal of Solids and Structures.
3. Zreid, I., & Kaliske, M. (2018). A gradient enhanced plasticity-damage microplane model for concrete.
Computational Mechanics. 10(1007), 00466-018-1561-1.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
350
Nonlinear Material Properties

4. Hooputra, H., Gese, H., Dell, H., & Werner, H. (2004). A comprehensive failure model for crashwor-
thiness simulation of aluminium extrusions. International Journal of Crashworthiness. 9(5), 449-464.
5. Bazant, Z.P., & Oh, B.H. (1983). Crack band theory for fracture of concrete. Materiaux et Constructions.
16(93), 155–177.
4.26. Material Damping
Damping can be introduced as a material property to account for dissipative mechanisms in dynamic
analyses.
Contributions from the various material damping sources are additive. The contribution of material
damping, in turn, is additive to the total structural damping. For a list of all available damping sources,
see Damping Matrices in the Theory Reference.
The following material damping topics are available:
4.26.1. Material-Dependent Alpha and Beta Damping (Rayleigh Damping)
4.26.2. Material-Dependent Structural Damping
4.26.3.Viscoelastic Material Damping (Harmonic Viscoelasticity)
4.26.1. Material-Dependent Alpha and Beta Damping (Rayleigh Damping)
Material-dependent damping enables you to specify mass-proportional Rayleigh damping (alpha
damping) or stiffness-proportional Rayleigh damping (beta damping) as a material property.
Rayleigh damping is widely used to provide an energy-dissipation mechanism when analyzing complex
engineering structures responding to dynamic loads such as seismic ground motion.
For more information about Rayleigh damping, see Alpha and Beta Damping (Rayleigh Damping) in
the Structural Analysis Guide.
4.26.1.1. Defining Material-Dependent Alpha and Beta Damping (Rayleigh
Damping)
Define material-dependent alpha and beta damping using either linear material property (MP) or
data-table (TB) commands. Both methods have advantages, as follows:
4.26.1.1.1. Defining Rayleigh Damping via MP
4.26.1.1.2. Defining Rayleigh Damping via TB
4.26.1.1.3. Comparing Feature Support: MP- vs.TB-Defined Damping
If defining Rayleigh damping via MP and TB commands, the damping matrix is the sum of each
source of damping, as shown in Equation 14.37.
4.26.1.1.1. Defining Rayleigh Damping via MP
Define mass-proportional Rayleigh damping via MP,ALPD, and stiffness-proportional Rayleigh
damping via MP,BETD.
351
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Material Damping

Rayleigh damping via MP commands defines the damping coefficients for the whole element,
but not for each material in a multi-material element. For multi-material elements such as SOLID185
Layered Structural Solid, therefore, damping coefficients are determined from the material
pointer for the element (MAT) rather than from the section materials.
Rayleigh damping defined via MP commands is not temperature-dependent and are always
evaluated at T = 0.0.
To define Rayleigh damping, specify the damping option(s) and the constants (ALPD and/or
BETD), as follows:
Mechanical APDL
Theory Reference
Equation
Property
Meaning
Constant
Equation 14.37
Mass-proportional material damping for
material 
ALPD
Equation 14.37
Stiffness-proportional material damping for
material 
BETD
Example 4.64: Defining Mass-Proportional Material Damping (MP,ALPD)
/prep7
! Elastic properties and density
mp,ex,1,2.0e11
mp,nuxy,1,0.2
mp,dens,1,7800
! Mass proportional damping
mp,alpd,1,50   
You can define stiffness-proportional damping in a similar manner (MP,BETD).
4.26.1.1.2. Defining Rayleigh Damping via TB
The TB method for defining damping coefficients is suitable for multi-material elements requiring
definition of damping coefficients for section materials. Define mass-proportional Rayleigh
damping via TB,SDAMP,,,,ALPD, and stiffness-proportional Rayleigh damping via TB,SDAMP,,,,BETD.
For a list of elements supporting this method, see Material Model Support for Elements (p. 5).
The TB method is useful for modeling layered composite materials consisting of a damped layer
sandwiched between non-damped layers. It is also a powerful way of defining Rayleigh damping
when field-variable dependence is desired.
This damping feature also allows damping coefficients to be specified for the element as a whole,
as occurs via Rayleigh-damping MP commands. If damping is uniform for the element with no
field-variable dependence, however, consider using the corresponding MP commands. When
damping is defined via TB commands, the damping matrices are integrated similar to the struc-
tural stiffness and mass matrices and may be more resource-intensive.
The stiffness-proportional damping matrix calculated when using TB,SDAMP,,,, BETD does not
include the stress stiffening included in the structural stiffness due to nonlinear geometry
(NLGEOM,ON). Stress stiffening is ignored in the damping matrix calculation as it is not a mater-
ial property. To include stress-stiffening in the damping matrix calculation, use MP,BETD.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
352
Nonlinear Material Properties

When defining Rayleigh damping via TB:
1. Initialize the material data table (TB,SDAMP,,,,ALPD and/or TB,SDAMP,,,,BETD).
2. Enter the appropriate damping coefficient (TBDATA).
Mechanical APDL
Theory Reference

grep term: "mesh"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/mesh.html (lines 51-100 · chunk range (no structural region))

  </form>
</div>
        </div><div class="wy-menu wy-menu-vertical" data-spy="affix" role="navigation" aria-label="Navigation menu">
<p style="padding: 0.5em 1.618em; margin-bottom: 0;">
  <a href="https://3mah.github.io/" style="color: #d9d9d9; font-weight: bold; text-decoration: none;">
    &larr; Back to 3MAH
  </a>
</p>
<hr style="border-color: #4e4e4e; margin: 0.5em 1.618em;">

              <p class="caption" role="heading"><span class="caption-text">Contents:</span></p>
<ul class="current">
<li class="toctree-l1"><a class="reference internal" href="overview.html">Overview</a></li>
<li class="toctree-l1"><a class="reference internal" href="install.html">Installation</a></li>
<li class="toctree-l1"><a class="reference internal" href="quick_start.html">Quick Start</a></li>
<li class="toctree-l1 current"><a class="current reference internal" href="#">Geometry and Mesh (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.mesh</span></code>)</a><ul>
<li class="toctree-l2"><a class="reference internal" href="#class-mesh">Class Mesh</a><ul>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.Mesh.html">fedoo.Mesh</a></li>
</ul>
</li>
<li class="toctree-l2"><a class="reference internal" href="#mesh-manipulation-functions">Mesh manipulation functions</a><ul>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.stack.html">fedoo.mesh.stack</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.extrude.html">fedoo.mesh.extrude</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.thicken.html">fedoo.mesh.thicken</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.extract_surface.html">fedoo.mesh.extract_surface</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.extract_edges.html">fedoo.mesh.extract_edges</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.change_elm_type.html">fedoo.mesh.change_elm_type</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.quad2tri.html">fedoo.mesh.quad2tri</a></li>
</ul>
</li>
<li class="toctree-l2"><a class="reference internal" href="#import-export-fedoo-mesh-object">Import/Export Fedoo Mesh object</a><ul>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.import_file.html">fedoo.mesh.import_file</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.import_msh.html">fedoo.mesh.import_msh</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.import_vtk.html">fedoo.mesh.import_vtk</a></li>
</ul>
</li>
<li class="toctree-l2"><a class="reference internal" href="#mesh-creation-functions">Mesh Creation Functions</a><ul>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.rectangle_mesh.html">fedoo.mesh.rectangle_mesh</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.box_mesh.html">fedoo.mesh.box_mesh</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.disk_mesh.html">fedoo.mesh.disk_mesh</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.hole_plate_mesh.html">fedoo.mesh.hole_plate_mesh</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.hollow_disk_mesh.html">fedoo.mesh.hollow_disk_mesh</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.I_shape_mesh.html">fedoo.mesh.I_shape_mesh</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.line_mesh_1D.html">fedoo.mesh.line_mesh_1D</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.line_mesh.html">fedoo.mesh.line_mesh</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.line_mesh_cylindric.html">fedoo.mesh.line_mesh_cylindric</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.circle_mesh.html">fedoo.mesh.circle_mesh</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.grid_mesh_cylindric.html">fedoo.mesh.grid_mesh_cylindric</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.generate_cylindrical_local_frame.html">fedoo.mesh.generate_cylindrical_local_frame</a></li>
<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.structured_mesh_2D.html">fedoo.mesh.structured_mesh_2D</a></li>

grep term: "fedoo"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/genindex.html (lines 192-241 · chunk range (no structural region))

        <li><a href="generated/fedoo.constitutivelaw.FE2.html#fedoo.constitutivelaw.FE2.__init__">(FE2 method)</a>
</li>
        <li><a href="generated/fedoo.time.GeneralizedAlpha.html#fedoo.time.GeneralizedAlpha.__init__">(GeneralizedAlpha method)</a>
</li>
        <li><a href="generated/fedoo.weakform.HeatEquation.html#fedoo.weakform.HeatEquation.__init__">(HeatEquation method)</a>
</li>
        <li><a href="generated/fedoo.constitutivelaw.Heterogeneous.html#fedoo.constitutivelaw.Heterogeneous.__init__">(Heterogeneous method)</a>
</li>
        <li><a href="generated/fedoo.weakform.HourglassStiffness.html#fedoo.weakform.HourglassStiffness.__init__">(HourglassStiffness method)</a>
</li>
        <li><a href="generated/fedoo.weakform.ImplicitDynamic.html#fedoo.weakform.ImplicitDynamic.__init__">(ImplicitDynamic method)</a>
</li>
        <li><a href="generated/fedoo.weakform.Inertia.html#fedoo.weakform.Inertia.__init__">(Inertia method)</a>
</li>
        <li><a href="generated/fedoo.weakform.InterfaceForce.html#fedoo.weakform.InterfaceForce.__init__">(InterfaceForce method)</a>
</li>
        <li><a href="generated/fedoo.constraint.IPCContact.html#fedoo.constraint.IPCContact.__init__">(IPCContact method)</a>
</li>
        <li><a href="generated/fedoo.constraint.IPCSelfContact.html#fedoo.constraint.IPCSelfContact.__init__">(IPCSelfContact method)</a>
</li>
        <li><a href="generated/fedoo.LagrangeMultiplierAssembly.html#fedoo.LagrangeMultiplierAssembly.__init__">(LagrangeMultiplierAssembly method)</a>
</li>
        <li><a href="generated/fedoo.problem.Linear.html#fedoo.problem.Linear.__init__">(Linear method)</a>
</li>
        <li><a href="generated/fedoo.problem.LinearBuckling.html#fedoo.problem.LinearBuckling.__init__">(LinearBuckling method)</a>
</li>
        <li><a href="generated/fedoo.ListBC.html#fedoo.ListBC.__init__">(ListBC method)</a>
</li>
        <li><a href="generated/fedoo.constraint.MeanMotion.html#fedoo.constraint.MeanMotion.__init__">(MeanMotion method)</a>
</li>
        <li><a href="generated/fedoo.constraint.MeanValueConstraint.html#fedoo.constraint.MeanValueConstraint.__init__">(MeanValueConstraint method)</a>
</li>
        <li><a href="generated/fedoo.Mesh.html#fedoo.Mesh.__init__">(Mesh method)</a>
</li>
        <li><a href="generated/fedoo.problem.Modal.html#fedoo.problem.Modal.__init__">(Modal method)</a>
</li>
        <li><a href="generated/fedoo.MPC.html#fedoo.MPC.__init__">(MPC method)</a>
</li>
        <li><a href="generated/fedoo.MultiFrameDataSet.html#fedoo.MultiFrameDataSet.__init__">(MultiFrameDataSet method)</a>
</li>
        <li><a href="generated/fedoo.MultiMeshData.html#fedoo.MultiMeshData.__init__">(MultiMeshData method)</a>
</li>
        <li><a href="generated/fedoo.time.Newmark.html#fedoo.time.Newmark.__init__">(Newmark method)</a>
</li>
        <li><a href="generated/fedoo.problem.NonLinear.html#fedoo.problem.NonLinear.__init__">(NonLinear method)</a>
</li>
        <li><a href="generated/fedoo.problem.NonLinearNewmark.html#fedoo.problem.NonLinearNewmark.__init__">(NonLinearNewmark method)</a>
</li>
        <li><a href="generated/fedoo.constraint.PeriodicBC.html#fedoo.constraint.PeriodicBC.__init__">(PeriodicBC method)</a>
</li>

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/genindex.html (lines 910-959 · chunk range (no structural region))

</li>
      <li><a href="generated/fedoo.time.CentralDifference.effective_mass_factor.html#fedoo.time.CentralDifference.effective_mass_factor">effective_mass_factor() (CentralDifference method)</a>

      <ul>
        <li><a href="generated/fedoo.time.ExplicitGeneralizedAlpha.effective_mass_factor.html#fedoo.time.ExplicitGeneralizedAlpha.effective_mass_factor">(ExplicitGeneralizedAlpha method)</a>
</li>
        <li><a href="generated/fedoo.time.ExplicitNewmark.effective_mass_factor.html#fedoo.time.ExplicitNewmark.effective_mass_factor">(ExplicitNewmark method)</a>
</li>
      </ul></li>
      <li><a href="generated/fedoo.problem.NonLinear.elastic_prediction.html#fedoo.problem.NonLinear.elastic_prediction">elastic_prediction() (NonLinear method)</a>
</li>
      <li><a href="generated/fedoo.constitutivelaw.ElasticAnisotropic.html#fedoo.constitutivelaw.ElasticAnisotropic">ElasticAnisotropic (class in fedoo.constitutivelaw)</a>
</li>
      <li><a href="generated/fedoo.constitutivelaw.ElasticIsotrop.html#fedoo.constitutivelaw.ElasticIsotrop">ElasticIsotrop (class in fedoo.constitutivelaw)</a>
</li>
      <li><a href="generated/fedoo.constitutivelaw.ElasticOrthotropic.html#fedoo.constitutivelaw.ElasticOrthotropic">ElasticOrthotropic (class in fedoo.constitutivelaw)</a>
</li>
      <li><a href="generated/fedoo.constitutivelaw.ElastoPlasticity.html#fedoo.constitutivelaw.ElastoPlasticity">ElastoPlasticity (class in fedoo.constitutivelaw)</a>
</li>
      <li><a href="generated/fedoo.Mesh.element_centers.html#fedoo.Mesh.element_centers">element_centers (Mesh property)</a>
</li>
      <li><a href="generated/fedoo.DataSet.html#fedoo.DataSet.element_data">element_data (DataSet attribute)</a>
</li>
      <li><a href="generated/fedoo.Mesh.element_sets.html#fedoo.Mesh.element_sets">element_sets (Mesh attribute)</a>
</li>
      <li><a href="generated/fedoo.Mesh.elements.html#fedoo.Mesh.elements">elements (Mesh attribute)</a>
</li>
      <li><a href="generated/fedoo.Mesh.elm_type.html#fedoo.Mesh.elm_type">elm_type (Mesh attribute)</a>
</li>
      <li><a href="generated/fedoo.time.CentralDifference.enforce_displacement.html#fedoo.time.CentralDifference.enforce_displacement">enforce_displacement() (CentralDifference method)</a>

      <ul>
        <li><a href="generated/fedoo.time.ExplicitGeneralizedAlpha.enforce_displacement.html#fedoo.time.ExplicitGeneralizedAlpha.enforce_displacement">(ExplicitGeneralizedAlpha method)</a>
</li>
        <li><a href="generated/fedoo.time.ExplicitNewmark.enforce_displacement.html#fedoo.time.ExplicitNewmark.enforce_displacement">(ExplicitNewmark method)</a>
</li>
      </ul></li>
      <li><a href="generated/fedoo.constraint.Contact.eps_a.html#fedoo.constraint.Contact.eps_a">eps_a (Contact attribute)</a>

      <ul>
        <li><a href="generated/fedoo.constraint.SelfContact.eps_a.html#fedoo.constraint.SelfContact.eps_a">(SelfContact attribute)</a>
</li>
      </ul></li>
      <li><a href="generated/fedoo.constraint.Contact.eps_n.html#fedoo.constraint.Contact.eps_n">eps_n (Contact attribute)</a>

      <ul>
        <li><a href="generated/fedoo.constraint.SelfContact.eps_n.html#fedoo.constraint.SelfContact.eps_n">(SelfContact attribute)</a>
</li>
      </ul></li>
  </ul></td>

grep term: "Give"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt (lines 28869-28929 · enclosing doc section)

14.4.2.1. Gyroscopic Matrix
The gyroscopic finite element matrix is calculated from the kinetic energy due to the inertia forces.
The kinetic energy for lumped mass and beam element (Nelson and McVaugh([359] (p. 967))) is de-
tailed in Kinetic Energy for the Gyroscopic Matrix Calculation of Lumped Mass and Beam Ele-
ment (p. 720) below.
The general expression of the kinetic energy used for the development of the gyroscopic matrices
for all other elements (Geradin and Kill [377] (p. 968)) is presented in General Expression of the
Kinetic Energy for the Gyroscopic Matrix Calculation (p. 722)
14.4.2.1.1. Kinetic Energy for the Gyroscopic Matrix Calculation of Lumped Mass and
Beam Element
Both mass and beam should be axisymmetric around the spinning axis. The spinning axis is along
one of the principal axis of inertia for lumped mass. For the beam, it is along the length.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
720
Analysis Tools

Two reference frames are used (see Figure 14.4: Reference Frames (p. 717)) (OXYZ) which is station-
ary and 
 which is attached to the cross-section with 
 axis normal to it.
 is defined using 3 successive rotations:
• θz around Z axis to give 
• θy around 
 axis to give 
• θx around  axis to give 
Hence for small rotations θy and θz, the instantaneous angular velocity is:
(14.59)
1. For a lumped mass, considering only second order terms, kinetic energy is obtained using
the instantaneous angular velocity vector in Equation 14.59 (p. 721).
(14.60)
where:
m = mass
Id = diametral inertia
Ip = polar inertia
The first two terms contribute to the mass matrix of the element and the last term gives
the gyroscopic matrix.
2. The beam element is considered as an infinite number of lumped masses. The gyroscopic
kinetic energy of the element is obtained by integrating the last term of Equa-
tion 14.60 (p. 721) along the length of the beam:
(14.61)
where:
ρ = density
Ix = moment of inertia normal to x
L = length of the beam element
Gyroscopic matrix is deduced based on the element shape functions. (See PIPE288).
721
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Rotating Structures

14.4.2.1.2. General Expression of the Kinetic Energy for the Gyroscopic Matrix Calcu-
lation
A point, in element i, with coordinates (x,y,z) in the stationary reference frame is considered. The
kinetic energy is
(14.62)
where:
EGki = gyroscopic kinetic energy of element i
Vi = volume of element i
dm = elementary mass
The gyroscopic matrix is then calculated using the element shape functions.

grep term: "call."

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/tests/test_distributed_load_neumann_bc.py (lines 79-108 · enclosing function/class)

def test_assembly_neumann_load_accepts_time_function_and_caches_fixed_vector():
    pb, bc = _build_problem(load_nlgeom=False, problem_nlgeom=False)
    pb.bc.remove(bc)

    load = bc.assembly
    bc = pb.bc.add(load.as_neumann(time_func=lambda t: t**2))
    assemble_global_mat = load.assemble_global_mat
    call_count = 0

    def counted_assemble_global_mat(compute="all"):
        nonlocal call_count
        call_count += 1
        return assemble_global_mat(compute)

    load.assemble_global_mat = counted_assemble_global_mat

    pb.apply_boundary_conditions(t_fact=0.5, t_fact_old=0.0)
    quarter_load = pb.get_B().copy()

    pb.apply_boundary_conditions(t_fact=0.5, t_fact_old=0.0)
    quarter_load_again = pb.get_B().copy()

    pb.apply_boundary_conditions(t_fact=1.0, t_fact_old=0.5)
    full_load = pb.get_B().copy()

    assert call_count == 1
    np.testing.assert_allclose(quarter_load_again, quarter_load)
    np.testing.assert_allclose(quarter_load, 0.25 * full_load)

grep term: "Surface"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 3724-3828 · enclosing doc section)

3.9.5.6. Arctangent Friction Model
The Coulomb friction model described in Coefficient of Friction (p. 59) has two states: sticking and
sliding. This friction model is not continuously differentiable at the transition point between sticking
and sliding, which can lead to convergence difficulties.
Arctangent friction is designed to improve convergence in these cases. This friction mode provides
smoothly-varying frictional stress with respect to the sliding velocity. Unlike the Coulomb friction
model, the Arctangent friction model is viscous: the frictional stress depends upon the sliding velocity.
Figure 3.19: Frictional Stress vs. Sliding Velocity (p. 66) shows how the frictional stress approaches
the sliding frictional stress μP from the coulomb friction asymptotically as the sliding velocity in-
creases. This figure also shows the effect of the reference slip rate, v0, on the frictional stress.
65
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Set the Real Constants and Element KEYOPTS

Figure 3.19: Frictional Stress vs. Sliding Velocity
Keep the following considerations in mind while using the Arctangent friction model:
• Arctangent friction is a viscous friction law. Hence, this model can capture physical behaviors
such as coning due to friction (for example, cone shaped deformation in a rotor or disk) better
than Coulomb friction.
• The Arctangent friction model is a continuously differentiable and continuous sliding model with
no history dependence. It can therefore help to achieve convergence in cases where there are
many points that are undergoing repeated stick-slip transitions or cases where a mesh changes
under nonlinear mesh adaptivity (NLAD).
• Because the Arctangent friction model is a continuous sliding model, the stiffness matrix is always
unsymmetric. In contrast, the standard Columb friction model is symmetric while the interface
is in sticking status and unsymmetric when sliding. To improve the convergence response of the
Arctangent friction model, you should activate the unsymmetric solver by using the NROPT,
UNSYM command.
• The Arctangent friction model is highly dependent upon the reference slip rate, v0 (a constant
that you need to enter). The default reference slip rate is taken as the elastic slip tolerance (SLTO).
A small value for the reference slip rate causes the Arctangent friction model to behave more
similarly to the Columb friction model, which makes it harder to converge. A larger value for the
reference slip rate causes the Arctangent friction model to behave less similarly to the Columb
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
66
Surface-to-Surface Contact (Pair-Based)

friction model, which makes it easier to converge. This relationship is shown in Figure 3.19: Fric-
tional Stress vs. Sliding Velocity (p. 66).
3.9.5.7. Contact Friction for Steady-State Rolling Analysis
As a special case, when contact friction is used in a steady-state rolling analysis, the frictional stress
calculation is changed to a viscous formulation. For details, see Contact Algorithm in the Theory
Reference.
3.9.6. Selecting Location of Contact Detection
The following topics related to selecting the location of contact detection are available:
3.9.6.1. Introduction
3.9.6.2. Using the Nodal Detections Methods (KEYOPT(4) = 1 or 2) and TOLS
3.9.6.3. Using the Surface Projection-Based Contact Method
3.9.6.1. Introduction
Contact detection points are located at the integration points of the contact elements which are
interior to the element surface. The contact element is constrained against penetration into the
target surface at its integration points. However, the target surface can, in principle, penetrate
through into the contact surface, see Figure 3.20: Contact Detection Located at Gauss Point (p. 67).
Figure 3.20: Contact Detection Located at Gauss Point
Surface-to-surface contact elements use Gauss integration points as a default, which generally
provide more accurate results than the nodal detection scheme, which uses the nodes themselves
as the integration points. The node-to-surface contact element, CONTA175, and the line-to-surface
contact element, CONTA177, always use the nodal detection scheme (p. 149).
3.9.6.2. Using the Nodal Detections Methods (KEYOPT(4) = 1 or 2) and TOLS
The nodal detection algorithms require the smoothing of the contact surface (KEYOPT(4) = 1) or
the smoothing of the target surface (KEYOPT(4) = 2), which is quite time consuming. You should
use this option only to deal with corner, point-to-surface, or edge-to-surface contact (see Fig-
ure 3.21: Contact Detection Point Location at Nodal Point (p. 68)). KEYOPT(4) = 1 specifies that the
contact normal be perpendicular to the contact surface. KEYOPT(4) = 2 specifies that the contact
67
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Set the Real Constants and Element KEYOPTS

normal be perpendicular to the target surface. Use KEYOPT(4) = 2 when the target surface is
smoother than the contact surface.
Figure 3.21: Contact Detection Point Location at Nodal Point
Be aware, however, that using nodes as the contact detection points can lead to other convergence
difficulties, such as node slippage, where the node slips off the edge of the target surface, see Fig-
ure 3.22: Node Slippage Using Nodal Detection KEYOPT(4) = 1 or 2 (p. 68). In order to prevent node
slippage, you can use real constant TOLS to extend the target surface when the default setting still
cannot avoid the problem. For most point-to-surface contact problems, Ansys recommends using
CONTA175. See Node-to-Surface Contact (p. 147) later in this guide.
Figure 3.22: Node Slippage Using Nodal Detection KEYOPT(4) = 1 or 2
Smoothing is required for nodal detection algorithms, and it is performed by averaging surface
normals connected to the node. As a result, the variation of the surface normal is continuous over
the surface, which leads to a better calculation of friction behavior and a better convergence.
Real constant TOLS is used to add a small tolerance that will internally extend the edge of the target
surface when you define the contact detection at the nodal point (KEYOPT(4) = 1 or 2). TOLS is
useful for problems where contact nodes are likely to lie on the edge of targets (as at symmetry
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
68
Surface-to-Surface Contact (Pair-Based)

planes or for models generated in a node-to-node contact pattern). In these situations, the contact
node may repeatedly slip off the target surface and go completely out of contact, resulting in
convergence difficulties from oscillations. Units for TOLS are percent (1.0 implies a 1.0% increase
in the target edge length). A small value of TOLS will usually prevent this situation from occurring.
The default value is 2 for both small deflection (NLGEOM,OFF) and large deflection (NLGEOM,ON).
Note:
For Normal Lagrange formulation (KEYOPT(2)=3,4), with 3D higher-order contact elements
(with midside nodes), use of surface projection-based contacts (KEYOPT(4)=3,4) is strongly
recommended.
The definition of KEYOPT(4) in node-to-surface contact element CONTA175 is different. KEYOPT(4)
= 1 for surface-to-surface contact is equivalent to KEYOPT(4) = 1 for node-to-surface contact.
However, KEYOPT(4) = 2 for surface-to-surface contact is equivalent to KEYOPT(4) = 0 for node-to
surface contact. See KEYOPT(4) (p. 149).

grep term: "fedoo.Mesh.html"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.constraint.Contact.html (lines 1-50 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.constraint.Contact &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-dataframe.css?v=2082cf3c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-rendered-html.css?v=1277b6f3" />
      <link rel="stylesheet" type="text/css" href="../_static/sphinx-design.min.css?v=95c83b7e" />
      <link rel="stylesheet" type="text/css" href="../_static/custom.css?v=26864b79" />

  
      <script src="../_static/jquery.js?v=5d32c60e"></script>
      <script src="../_static/_sphinx_javascript_frameworks_compat.js?v=2cd50e6c"></script>
      <script src="../_static/documentation_options.js?v=8d563738"></script>
      <script src="../_static/doctools.js?v=9bcbadda"></script>
      <script src="../_static/sphinx_highlight.js?v=dc90522c"></script>
      <script src="../_static/sg-tags.js?v=d80f6fa4"></script>
      <script src="../_static/design-tabs.js?v=f930bc37"></script>
    <script src="../_static/js/theme.js"></script>
    <link rel="index" title="Index" href="../genindex.html" />
    <link rel="search" title="Search" href="../search.html" />
    <link rel="next" title="fedoo.constraint.Contact.assemble_global_mat" href="fedoo.constraint.Contact.assemble_global_mat.html" />
    <link rel="prev" title="fedoo.constraint.PeriodicBC.name" href="fedoo.constraint.PeriodicBC.name.html" /> 
</head>

<body class="wy-body-for-nav"> 
  <div class="wy-grid-for-nav">
    <nav data-toggle="wy-nav-shift" class="wy-nav-side">
      <div class="wy-side-scroll">
        <div class="wy-side-nav-search"  style="background: #24445C" >

          
          
          <a href="../index.html">
            
              <img src="../_static/fedoo_logos_ss_fond.png" class="logo" alt="Logo"/>
          </a>
<div role="search">
  <form id="rtd-search-form" class="wy-form" action="../search.html" method="get">
    <input type="text" name="q" placeholder="Search docs" aria-label="Search docs" />
    <input type="hidden" name="check_keywords" value="yes" />
    <input type="hidden" name="area" value="default" />

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.Mesh.extract_elements.html (lines 1-35 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.Mesh.extract_elements &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-dataframe.css?v=2082cf3c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-rendered-html.css?v=1277b6f3" />
      <link rel="stylesheet" type="text/css" href="../_static/sphinx-design.min.css?v=95c83b7e" />
      <link rel="stylesheet" type="text/css" href="../_static/custom.css?v=26864b79" />

  
      <script src="../_static/jquery.js?v=5d32c60e"></script>
      <script src="../_static/_sphinx_javascript_frameworks_compat.js?v=2cd50e6c"></script>
      <script src="../_static/documentation_options.js?v=8d563738"></script>
      <script src="../_static/doctools.js?v=9bcbadda"></script>
      <script src="../_static/sphinx_highlight.js?v=dc90522c"></script>
      <script src="../_static/sg-tags.js?v=d80f6fa4"></script>
      <script src="../_static/design-tabs.js?v=f930bc37"></script>
    <script src="../_static/js/theme.js"></script>
    <link rel="index" title="Index" href="../genindex.html" />
    <link rel="search" title="Search" href="../search.html" />
    <link rel="next" title="fedoo.Mesh.find_coincident_nodes" href="fedoo.Mesh.find_coincident_nodes.html" />
    <link rel="prev" title="fedoo.Mesh.determine_data_type" href="fedoo.Mesh.determine_data_type.html" /> 
</head>

<body class="wy-body-for-nav"> 
  <div class="wy-grid-for-nav">

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.Mesh.deepcopy.html (lines 1-24 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.Mesh.deepcopy &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-dataframe.css?v=2082cf3c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-rendered-html.css?v=1277b6f3" />
      <link rel="stylesheet" type="text/css" href="../_static/sphinx-design.min.css?v=95c83b7e" />
      <link rel="stylesheet" type="text/css" href="../_static/custom.css?v=26864b79" />

  
      <script src="../_static/jquery.js?v=5d32c60e"></script>
      <script src="../_static/_sphinx_javascript_frameworks_compat.js?v=2cd50e6c"></script>
      <script src="../_static/documentation_options.js?v=8d563738"></script>
      <script src="../_static/doctools.js?v=9bcbadda"></script>
      <script src="../_static/sphinx_highlight.js?v=dc90522c"></script>

grep term: "line"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/util/viewer.py (lines 2137-2160 · enclosing function/class)

    def open_plot_over_line_dialog(self):
        # Create dialog only if not already exist
        if self._plot_over_line_dialog is None:
            self._plot_over_line_dialog = PlotOverLineDialog(self)
            self._plot_over_line_dialog.plotRequested.connect(self.plot_over_line)
            self._plot_over_line_dialog.requestPick.connect(
                self._start_pick
            )  # 0->P1, 1->P2

            # connection to sync dialog with widget
            self._plot_over_line_dialog.lineChanged.connect(self._on_pol_dialog_changed)
            # if dialog closed, remove widget
            self._plot_over_line_dialog.finished.connect(self._on_pol_dialog_closed)
            self._plot_over_line_dialog.destroyed.connect(self._on_pol_dialog_closed)

        self._line_widget_enabled = True
        # Line widget
        self._line_widget = self.plotter.add_line_widget(
            callback=self.on_line_changed, use_vertices=True
        )
        # Show dialog
        self._plot_over_line_dialog.show()
        self._plot_over_line_dialog.raise_()


## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.line_mesh_1D.html (lines 1-49 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.mesh.line_mesh_1D &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-dataframe.css?v=2082cf3c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-rendered-html.css?v=1277b6f3" />
      <link rel="stylesheet" type="text/css" href="../_static/sphinx-design.min.css?v=95c83b7e" />
      <link rel="stylesheet" type="text/css" href="../_static/custom.css?v=26864b79" />

  
      <script src="../_static/jquery.js?v=5d32c60e"></script>
      <script src="../_static/_sphinx_javascript_frameworks_compat.js?v=2cd50e6c"></script>
      <script src="../_static/documentation_options.js?v=8d563738"></script>
      <script src="../_static/doctools.js?v=9bcbadda"></script>
      <script src="../_static/sphinx_highlight.js?v=dc90522c"></script>
      <script src="../_static/sg-tags.js?v=d80f6fa4"></script>
      <script src="../_static/design-tabs.js?v=f930bc37"></script>
    <script src="../_static/js/theme.js"></script>
    <link rel="index" title="Index" href="../genindex.html" />
    <link rel="search" title="Search" href="../search.html" />
    <link rel="next" title="fedoo.mesh.line_mesh" href="fedoo.mesh.line_mesh.html" />
    <link rel="prev" title="fedoo.mesh.I_shape_mesh" href="fedoo.mesh.I_shape_mesh.html" /> 
</head>

<body class="wy-body-for-nav"> 
  <div class="wy-grid-for-nav">
    <nav data-toggle="wy-nav-shift" class="wy-nav-side">
      <div class="wy-side-scroll">
        <div class="wy-side-nav-search"  style="background: #24445C" >

          
          
          <a href="../index.html">
            
              <img src="../_static/fedoo_logos_ss_fond.png" class="logo" alt="Logo"/>
          </a>
<div role="search">
  <form id="rtd-search-form" class="wy-form" action="../search.html" method="get">
    <input type="text" name="q" placeholder="Search docs" aria-label="Search docs" />
    <input type="hidden" name="check_keywords" value="yes" />

grep term: "rectangle_mesh"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.rectangle_mesh.html (lines 1-49 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.mesh.rectangle_mesh &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-dataframe.css?v=2082cf3c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-rendered-html.css?v=1277b6f3" />
      <link rel="stylesheet" type="text/css" href="../_static/sphinx-design.min.css?v=95c83b7e" />
      <link rel="stylesheet" type="text/css" href="../_static/custom.css?v=26864b79" />

  
      <script src="../_static/jquery.js?v=5d32c60e"></script>
      <script src="../_static/_sphinx_javascript_frameworks_compat.js?v=2cd50e6c"></script>
      <script src="../_static/documentation_options.js?v=8d563738"></script>
      <script src="../_static/doctools.js?v=9bcbadda"></script>
      <script src="../_static/sphinx_highlight.js?v=dc90522c"></script>
      <script src="../_static/sg-tags.js?v=d80f6fa4"></script>
      <script src="../_static/design-tabs.js?v=f930bc37"></script>
    <script src="../_static/js/theme.js"></script>
    <link rel="index" title="Index" href="../genindex.html" />
    <link rel="search" title="Search" href="../search.html" />
    <link rel="next" title="fedoo.mesh.box_mesh" href="fedoo.mesh.box_mesh.html" />
    <link rel="prev" title="fedoo.mesh.import_vtk" href="fedoo.mesh.import_vtk.html" /> 
</head>

<body class="wy-body-for-nav"> 
  <div class="wy-grid-for-nav">
    <nav data-toggle="wy-nav-shift" class="wy-nav-side">
      <div class="wy-side-scroll">
        <div class="wy-side-nav-search"  style="background: #24445C" >

          
          
          <a href="../index.html">
            
              <img src="../_static/fedoo_logos_ss_fond.png" class="logo" alt="Logo"/>
          </a>
<div role="search">
  <form id="rtd-search-form" class="wy-form" action="../search.html" method="get">
    <input type="text" name="q" placeholder="Search docs" aria-label="Search docs" />
    <input type="hidden" name="check_keywords" value="yes" />

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.hole_plate_mesh.html (lines 51-55 · chunk range (no structural region))

  </form>
</div>
        </div><div class="wy-menu wy-menu-vertical" data-spy="affix" role="navigation" aria-label="Navigation menu">
<p style="padding: 0.5em 1.618em; margin-bottom: 0;">
  <a href="https://3mah.github.io/" style="color: #d9d9d9; font-weight: bold; text-decoration: none;">

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.box_mesh.html (lines 51-62 · chunk range (no structural region))

  </form>
</div>
        </div><div class="wy-menu wy-menu-vertical" data-spy="affix" role="navigation" aria-label="Navigation menu">
<p style="padding: 0.5em 1.618em; margin-bottom: 0;">
  <a href="https://3mah.github.io/" style="color: #d9d9d9; font-weight: bold; text-decoration: none;">
    &larr; Back to 3MAH
  </a>
</p>
<hr style="border-color: #4e4e4e; margin: 0.5em 1.618em;">

              <p class="caption" role="heading"><span class="caption-text">Contents:</span></p>
<ul class="current">

grep term: "fedoo.mesh.rectangle_mesh"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.rectangle_mesh.html (lines 1-49 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.mesh.rectangle_mesh &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-dataframe.css?v=2082cf3c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-rendered-html.css?v=1277b6f3" />
      <link rel="stylesheet" type="text/css" href="../_static/sphinx-design.min.css?v=95c83b7e" />
      <link rel="stylesheet" type="text/css" href="../_static/custom.css?v=26864b79" />

  
      <script src="../_static/jquery.js?v=5d32c60e"></script>
      <script src="../_static/_sphinx_javascript_frameworks_compat.js?v=2cd50e6c"></script>
      <script src="../_static/documentation_options.js?v=8d563738"></script>
      <script src="../_static/doctools.js?v=9bcbadda"></script>
      <script src="../_static/sphinx_highlight.js?v=dc90522c"></script>
      <script src="../_static/sg-tags.js?v=d80f6fa4"></script>
      <script src="../_static/design-tabs.js?v=f930bc37"></script>
    <script src="../_static/js/theme.js"></script>
    <link rel="index" title="Index" href="../genindex.html" />
    <link rel="search" title="Search" href="../search.html" />
    <link rel="next" title="fedoo.mesh.box_mesh" href="fedoo.mesh.box_mesh.html" />
    <link rel="prev" title="fedoo.mesh.import_vtk" href="fedoo.mesh.import_vtk.html" /> 
</head>

<body class="wy-body-for-nav"> 
  <div class="wy-grid-for-nav">
    <nav data-toggle="wy-nav-shift" class="wy-nav-side">
      <div class="wy-side-scroll">
        <div class="wy-side-nav-search"  style="background: #24445C" >

          
          
          <a href="../index.html">
            
              <img src="../_static/fedoo_logos_ss_fond.png" class="logo" alt="Logo"/>
          </a>
<div role="search">
  <form id="rtd-search-form" class="wy-form" action="../search.html" method="get">
    <input type="text" name="q" placeholder="Search docs" aria-label="Search docs" />
    <input type="hidden" name="check_keywords" value="yes" />

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.hole_plate_mesh.html (lines 51-55 · chunk range (no structural region))

  </form>
</div>
        </div><div class="wy-menu wy-menu-vertical" data-spy="affix" role="navigation" aria-label="Navigation menu">
<p style="padding: 0.5em 1.618em; margin-bottom: 0;">
  <a href="https://3mah.github.io/" style="color: #d9d9d9; font-weight: bold; text-decoration: none;">

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.box_mesh.html (lines 51-62 · chunk range (no structural region))

  </form>
</div>
        </div><div class="wy-menu wy-menu-vertical" data-spy="affix" role="navigation" aria-label="Navigation menu">
<p style="padding: 0.5em 1.618em; margin-bottom: 0;">
  <a href="https://3mah.github.io/" style="color: #d9d9d9; font-weight: bold; text-decoration: none;">
    &larr; Back to 3MAH
  </a>
</p>
<hr style="border-color: #4e4e4e; margin: 0.5em 1.618em;">

              <p class="caption" role="heading"><span class="caption-text">Contents:</span></p>
<ul class="current">

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/examples/02-constraints/disk_rectangle_contact.py (lines 1-121 · whole file (short script))

```python
# mesh of the rectangle
mesh_rect = fd.mesh.rectangle_mesh(
    nx=11, ny=21, x_min=0, x_max=L, y_min=0, y_max=h, elm_type="quad4", name="Domain"
)
```

grep term: "structured_mesh"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.structured_mesh_2D.html (lines 1-49 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.mesh.structured_mesh_2D &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-dataframe.css?v=2082cf3c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-rendered-html.css?v=1277b6f3" />
      <link rel="stylesheet" type="text/css" href="../_static/sphinx-design.min.css?v=95c83b7e" />
      <link rel="stylesheet" type="text/css" href="../_static/custom.css?v=26864b79" />

  
      <script src="../_static/jquery.js?v=5d32c60e"></script>
      <script src="../_static/_sphinx_javascript_frameworks_compat.js?v=2cd50e6c"></script>
      <script src="../_static/documentation_options.js?v=8d563738"></script>
      <script src="../_static/doctools.js?v=9bcbadda"></script>
      <script src="../_static/sphinx_highlight.js?v=dc90522c"></script>
      <script src="../_static/sg-tags.js?v=d80f6fa4"></script>
      <script src="../_static/design-tabs.js?v=f930bc37"></script>
    <script src="../_static/js/theme.js"></script>
    <link rel="index" title="Index" href="../genindex.html" />
    <link rel="search" title="Search" href="../search.html" />
    <link rel="next" title="fedoo.mesh.generate_nodes" href="fedoo.mesh.generate_nodes.html" />
    <link rel="prev" title="fedoo.mesh.generate_cylindrical_local_frame" href="fedoo.mesh.generate_cylindrical_local_frame.html" /> 
</head>

<body class="wy-body-for-nav"> 
  <div class="wy-grid-for-nav">
    <nav data-toggle="wy-nav-shift" class="wy-nav-side">
      <div class="wy-side-scroll">
        <div class="wy-side-nav-search"  style="background: #24445C" >

          
          
          <a href="../index.html">
            
              <img src="../_static/fedoo_logos_ss_fond.png" class="logo" alt="Logo"/>
          </a>
<div role="search">
  <form id="rtd-search-form" class="wy-form" action="../search.html" method="get">
    <input type="text" name="q" placeholder="Search docs" aria-label="Search docs" />
    <input type="hidden" name="check_keywords" value="yes" />

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/structured_mesh.py (lines 527-535 · enclosing function/class)

def I_shape_mesh(
    height=10,
    width=10,
    web_thickness=2,
    flange_thickness=2,
    size_elm=0.2,
    elm_type="quad4",
    ndim=None,
    name="",

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/mesh.html (lines 101-116 · chunk range (no structural region))

<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.generate_nodes.html">fedoo.mesh.generate_nodes</a></li>
</ul>
</li>
</ul>
</li>
<li class="toctree-l1"><a class="reference internal" href="constitutive_law.html">Constitutive Law (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.constitutivelaw</span></code>)</a></li>
<li class="toctree-l1"><a class="reference internal" href="weak_form.html">Weak Formulation (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.weakform</span></code>)</a></li>
<li class="toctree-l1"><a class="reference internal" href="assembly.html">Class Assembly</a></li>
<li class="toctree-l1"><a class="reference internal" href="time.html">Time Integration (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.time</span></code>)</a></li>
<li class="toctree-l1"><a class="reference internal" href="problem.html">Problem (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.problem</span></code>)</a></li>
<li class="toctree-l1"><a class="reference internal" href="boundary_conditions.html">Boundary conditions and constraints</a></li>
<li class="toctree-l1"><a class="reference internal" href="post_processing.html">Post-Processing</a></li>
<li class="toctree-l1"><a class="reference internal" href="heterogeneous.html">Heterogeneous structures</a></li>
<li class="toctree-l1"><a class="reference internal" href="user_problems.html">Define user problems</a></li>
<li class="toctree-l1"><a class="reference internal" href="examples/index.html">Examples</a></li>
</ul>

grep term: "import"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/util/viewer.py (lines 1-50 · chunk range (no structural region))

import fedoo as fd
import numpy as np
import sys
from contextlib import contextmanager
from qtpy import QtWidgets, QtGui
from qtpy.QtWidgets import (
    QDockWidget,
    QToolBar,
    QHBoxLayout,
    QVBoxLayout,
    QLabel,
    QSlider,
    QSpinBox,
    QPushButton,
    QDoubleSpinBox,
    QCheckBox,
    QWidget,
    QShortcut,
)
from qtpy.QtCore import Qt, Signal, QSignalBlocker, QTimer, QEvent, QSize
import matplotlib as mpl  # only for colormap
import pyvista as pv
from pyvistaqt import QtInteractor
from matplotlib.figure import Figure
from matplotlib.backends.backend_qtagg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.backends.backend_qt import NavigationToolbar2QT as NavigationToolbar
import os
import re

from fedoo.core.multimeshdata import MultiMeshData
from fedoo.core.mesh import MultiMesh

USE_PYVISTA_QT = True
SOLID_COLOR_FIELD = "Solid color"


def _is_multimesh(mesh):
    return isinstance(mesh, MultiMesh)


def _global_data_array(data):
    if isinstance(data, MultiMeshData):
        return data.to_global()
    return data


def _data_n_iter(data):
    return getattr(data, "n_iter", 1)



## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/constitutivelaw/__init__.py (lines 1-202 · whole file (short script))

"""Constitutive Law module.

=========================================================
Constitutive Law (:mod:`fedoo.constitutivelaw`)
=========================================================

.. currentmodule:: fedoo.constitutivelaw

The constitutive law module include several classical mechancical
constitutive laws. These laws are required to create some weak formulations.

The ConstitutiveLaw library contains the following classes:

Solid mechanical constitutive laws
======================================

These laws should be associated with :py:class:`fedoo.weakform.StressEquilibrium`

In a finite-strain analysis they all follow the same convention: the law
returns the true Cauchy stress and an unnormalized corotational Kirchhoff
tangent, and the weak form converts that tangent to the one required by the
selected formulation. The convention is detailed on
:py:class:`fedoo.core.mechanical3d.Mechanical3D`.

.. autosummary::
   :toctree: generated/
   :template: custom-class-template.rst

   ElasticIsotrop
   ElasticOrthotropic
   ElasticAnisotropic
   CompositeUD
   ElastoPlasticity
   FE2
   Simcoon
   Heterogeneous

Interface mechanical constitutive laws
======================================

These laws should be associated with :py:class:`fedoo.weakform.StressEquilibrium`

.. autosummary::
   :toctree: generated/
   :template: custom-class-template.rst

   CohesiveLaw
   Spring

.. _beam_constitutive_laws:

Beam constitutive laws
======================================

These laws should be associated with :py:class:`fedoo.weakform.InterfaceForce`

.. autosummary::
   :toctree: generated/
   :template: custom-class-template.rst

   BeamProperties
   BeamCircular
   BeamPipe
   BeamRectangular

Shell constitutive laws
======================================

These laws should be associated with :py:class:`fedoo.weakform.PlateEquilibrium`

.. autosummary::
   :toctree: generated/
   :template: custom-class-template.rst

   ShellLaminate
   ShellLaminateNonLinear
   ShellHomogeneous
   ShellHomogeneousNonLinear

Thermal constitutive law
======================================

These laws should be associated with :py:class:`fedoo.weakform.HeatEquation`

.. autosummary::
   :toctree: generated/
   :template: custom-class-template.rst

   ThermalProperties

Manage local frames
===================

Three-dimensional mechanical constitutive laws can be defined in a material
coordinate system with :py:meth:`fedoo.ConstitutiveLaw.set_local_frame`. A
frame is a proper orthogonal rotation matrix whose rows are the material axes
expressed in global coordinates. SciPy and Simcoon rotation objects are also
accepted directly.

For example, one uniform initial material orientation can be assigned with:

.. code-block:: python

   from scipy.spatial.transform import Rotation

   frame = Rotation.from_euler("z", 30, degrees=True)
   material.set_local_frame(frame)

Several frames can be supplied at nodes, elements, or Gauss points. Use the
canonical location names ``"Node"``, ``"Element"``, and ``"GaussPoint"``:

.. code-block:: python

   material.set_local_frame(nodal_frames, location="Node")
   material.set_local_frame(element_frames, location="Element")
   material.set_local_frame(gauss_point_frames, location="GaussPoint")

Nodal rotations are smoothly interpolated to the Gauss points using the
finite-element shape functions and a local rotation-vector interpolation.
Element frames are repeated at every Gauss point of their element. A
Gauss-point field must contain exactly the number of points used by the
associated assembly. When ``location`` is omitted, Fedoo infers it from the
number of frames if the choice is unambiguous.

For small-strain analyses, the prescribed material orientation remains fixed.
In finite-strain analyses, it defines the initial material orientation and the
constitutive-law machinery updates the current orientation with the material
rotation. Isotropic laws do not perform unnecessary frame transformations.

Beam and shell frames
---------------------

For beams and shells, the element frame is also a geometrical coordinate
system used by the weak form. This frame should be defined on the assembly:

.. code-block:: python

   assembly.set_element_local_frame(guide=guide, location="Element")

For a beam, the first axis is projected onto the element tangent and the guide
sets the cross-section orientation. For a shell, the third axis remains the
surface normal and the guide sets the in-plane orientation. Guides may be
uniform, elemental, or nodal. The assembly element-frame API is intentionally
limited to beams and shells; anisotropic solid orientations belong to the
constitutive law.

For shell constitutive laws that support an additional material orientation,
that orientation is interpreted relative to the geometrical shell frame
defined on the assembly. Beam constitutive laws currently use isotropic
materials only, so material orientations are ignored. The assembly element
frame defines the beam cross-section orientation.

"""

from .beam import BeamCircular, BeamPipe, BeamProperties, BeamRectangular
from .cohesivelaw import CohesiveLaw
from .composite_ud import CompositeUD
from .elastic_anisotropic import ElasticAnisotropic
from .elastic_isotrop import ElasticIsotrop
from .elastic_orthotropic import ElasticOrthotropic
from .elasto_plasticity import ElastoPlasticity
from .fe2 import FE2
from .heterogeneous import Heterogeneous
from .shell import (
    ShellBase,
    ShellHomogeneous,
    ShellHomogeneousNonLinear,
    ShellLaminate,
    ShellLaminateNonLinear,
)
from .permeability import HolmesMowPermeability, KozenyCarmanPermeability
from .poro_fluid import PoroFluidProperties
from .simcoon_umat import Simcoon
from .spring import Spring
from .thermal_prop import ThermalProperties

__all__ = [
    "BeamCircular",
    "BeamPipe",
    "BeamProperties",
    "BeamRectangular",
    "CohesiveLaw",
    "CompositeUD",
    "ElasticAnisotropic",
    "ElasticIsotrop",
    "ElasticOrthotropic",
    "ElastoPlasticity",
    "FE2",
    "Heterogeneous",
    "ShellBase",
    "ShellHomogeneous",
    "ShellHomogeneousNonLinear",
    "ShellLaminate",
    "ShellLaminateNonLinear",
    "HolmesMowPermeability",
    "KozenyCarmanPermeability",
    "PoroFluidProperties",
    "Simcoon",
    "Spring",
    "ThermalProperties",
]

grep term: "structured_mesh_2D"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.structured_mesh_2D.html (lines 1-49 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.mesh.structured_mesh_2D &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-dataframe.css?v=2082cf3c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-rendered-html.css?v=1277b6f3" />
      <link rel="stylesheet" type="text/css" href="../_static/sphinx-design.min.css?v=95c83b7e" />
      <link rel="stylesheet" type="text/css" href="../_static/custom.css?v=26864b79" />

  
      <script src="../_static/jquery.js?v=5d32c60e"></script>
      <script src="../_static/_sphinx_javascript_frameworks_compat.js?v=2cd50e6c"></script>
      <script src="../_static/documentation_options.js?v=8d563738"></script>
      <script src="../_static/doctools.js?v=9bcbadda"></script>
      <script src="../_static/sphinx_highlight.js?v=dc90522c"></script>
      <script src="../_static/sg-tags.js?v=d80f6fa4"></script>
      <script src="../_static/design-tabs.js?v=f930bc37"></script>
    <script src="../_static/js/theme.js"></script>
    <link rel="index" title="Index" href="../genindex.html" />
    <link rel="search" title="Search" href="../search.html" />
    <link rel="next" title="fedoo.mesh.generate_nodes" href="fedoo.mesh.generate_nodes.html" />
    <link rel="prev" title="fedoo.mesh.generate_cylindrical_local_frame" href="fedoo.mesh.generate_cylindrical_local_frame.html" /> 
</head>

<body class="wy-body-for-nav"> 
  <div class="wy-grid-for-nav">
    <nav data-toggle="wy-nav-shift" class="wy-nav-side">
      <div class="wy-side-scroll">
        <div class="wy-side-nav-search"  style="background: #24445C" >

          
          
          <a href="../index.html">
            
              <img src="../_static/fedoo_logos_ss_fond.png" class="logo" alt="Logo"/>
          </a>
<div role="search">
  <form id="rtd-search-form" class="wy-form" action="../search.html" method="get">
    <input type="text" name="q" placeholder="Search docs" aria-label="Search docs" />
    <input type="hidden" name="check_keywords" value="yes" />

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/mesh.html (lines 101-116 · chunk range (no structural region))

<li class="toctree-l3"><a class="reference internal" href="generated/fedoo.mesh.generate_nodes.html">fedoo.mesh.generate_nodes</a></li>
</ul>
</li>
</ul>
</li>
<li class="toctree-l1"><a class="reference internal" href="constitutive_law.html">Constitutive Law (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.constitutivelaw</span></code>)</a></li>
<li class="toctree-l1"><a class="reference internal" href="weak_form.html">Weak Formulation (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.weakform</span></code>)</a></li>
<li class="toctree-l1"><a class="reference internal" href="assembly.html">Class Assembly</a></li>
<li class="toctree-l1"><a class="reference internal" href="time.html">Time Integration (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.time</span></code>)</a></li>
<li class="toctree-l1"><a class="reference internal" href="problem.html">Problem (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.problem</span></code>)</a></li>
<li class="toctree-l1"><a class="reference internal" href="boundary_conditions.html">Boundary conditions and constraints</a></li>
<li class="toctree-l1"><a class="reference internal" href="post_processing.html">Post-Processing</a></li>
<li class="toctree-l1"><a class="reference internal" href="heterogeneous.html">Heterogeneous structures</a></li>
<li class="toctree-l1"><a class="reference internal" href="user_problems.html">Define user problems</a></li>
<li class="toctree-l1"><a class="reference internal" href="examples/index.html">Examples</a></li>
</ul>

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/structured_mesh.py (lines 527-535 · enclosing function/class)

def I_shape_mesh(
    height=10,
    width=10,
    web_thickness=2,
    flange_thickness=2,
    size_elm=0.2,
    elm_type="quad4",
    ndim=None,
    name="",

grep term: "generate_nodes"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/structured_mesh.py (lines 527-535 · enclosing function/class)

def I_shape_mesh(
    height=10,
    width=10,
    web_thickness=2,
    flange_thickness=2,
    size_elm=0.2,
    elm_type="quad4",
    ndim=None,
    name="",

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.generate_nodes.html (lines 1-45 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.mesh.generate_nodes &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-dataframe.css?v=2082cf3c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-rendered-html.css?v=1277b6f3" />
      <link rel="stylesheet" type="text/css" href="../_static/sphinx-design.min.css?v=95c83b7e" />
      <link rel="stylesheet" type="text/css" href="../_static/custom.css?v=26864b79" />

  
      <script src="../_static/jquery.js?v=5d32c60e"></script>
      <script src="../_static/_sphinx_javascript_frameworks_compat.js?v=2cd50e6c"></script>
      <script src="../_static/documentation_options.js?v=8d563738"></script>
      <script src="../_static/doctools.js?v=9bcbadda"></script>
      <script src="../_static/sphinx_highlight.js?v=dc90522c"></script>
      <script src="../_static/sg-tags.js?v=d80f6fa4"></script>
      <script src="../_static/design-tabs.js?v=f930bc37"></script>
    <script src="../_static/js/theme.js"></script>
    <link rel="index" title="Index" href="../genindex.html" />
    <link rel="search" title="Search" href="../search.html" />
    <link rel="next" title="Constitutive Law (fedoo.constitutivelaw)" href="../constitutive_law.html" />
    <link rel="prev" title="fedoo.mesh.structured_mesh_2D" href="fedoo.mesh.structured_mesh_2D.html" /> 
</head>

<body class="wy-body-for-nav"> 
  <div class="wy-grid-for-nav">
    <nav data-toggle="wy-nav-shift" class="wy-nav-side">
      <div class="wy-side-scroll">
        <div class="wy-side-nav-search"  style="background: #24445C" >

          
          
          <a href="../index.html">
            
              <img src="../_static/fedoo_logos_ss_fond.png" class="logo" alt="Logo"/>
          </a>

grep term: "hole_plate_mesh"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.hole_plate_mesh.html (lines 1-50 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.mesh.hole_plate_mesh &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-dataframe.css?v=2082cf3c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-rendered-html.css?v=1277b6f3" />
      <link rel="stylesheet" type="text/css" href="../_static/sphinx-design.min.css?v=95c83b7e" />
      <link rel="stylesheet" type="text/css" href="../_static/custom.css?v=26864b79" />

  
      <script src="../_static/jquery.js?v=5d32c60e"></script>
      <script src="../_static/_sphinx_javascript_frameworks_compat.js?v=2cd50e6c"></script>
      <script src="../_static/documentation_options.js?v=8d563738"></script>
      <script src="../_static/doctools.js?v=9bcbadda"></script>
      <script src="../_static/sphinx_highlight.js?v=dc90522c"></script>
      <script src="../_static/sg-tags.js?v=d80f6fa4"></script>
      <script src="../_static/design-tabs.js?v=f930bc37"></script>
    <script src="../_static/js/theme.js"></script>
    <link rel="index" title="Index" href="../genindex.html" />
    <link rel="search" title="Search" href="../search.html" />
    <link rel="next" title="fedoo.mesh.hollow_disk_mesh" href="fedoo.mesh.hollow_disk_mesh.html" />
    <link rel="prev" title="fedoo.mesh.disk_mesh" href="fedoo.mesh.disk_mesh.html" /> 
</head>

<body class="wy-body-for-nav"> 
  <div class="wy-grid-for-nav">
    <nav data-toggle="wy-nav-shift" class="wy-nav-side">
      <div class="wy-side-scroll">
        <div class="wy-side-nav-search"  style="background: #24445C" >

          
          
          <a href="../index.html">
            
              <img src="../_static/fedoo_logos_ss_fond.png" class="logo" alt="Logo"/>
          </a>
<div role="search">
  <form id="rtd-search-form" class="wy-form" action="../search.html" method="get">
    <input type="text" name="q" placeholder="Search docs" aria-label="Search docs" />
    <input type="hidden" name="check_keywords" value="yes" />
    <input type="hidden" name="area" value="default" />

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.disk_mesh.html (lines 1-46 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.mesh.disk_mesh &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-dataframe.css?v=2082cf3c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-rendered-html.css?v=1277b6f3" />
      <link rel="stylesheet" type="text/css" href="../_static/sphinx-design.min.css?v=95c83b7e" />
      <link rel="stylesheet" type="text/css" href="../_static/custom.css?v=26864b79" />

  
      <script src="../_static/jquery.js?v=5d32c60e"></script>
      <script src="../_static/_sphinx_javascript_frameworks_compat.js?v=2cd50e6c"></script>
      <script src="../_static/documentation_options.js?v=8d563738"></script>
      <script src="../_static/doctools.js?v=9bcbadda"></script>
      <script src="../_static/sphinx_highlight.js?v=dc90522c"></script>
      <script src="../_static/sg-tags.js?v=d80f6fa4"></script>
      <script src="../_static/design-tabs.js?v=f930bc37"></script>
    <script src="../_static/js/theme.js"></script>
    <link rel="index" title="Index" href="../genindex.html" />
    <link rel="search" title="Search" href="../search.html" />
    <link rel="next" title="fedoo.mesh.hole_plate_mesh" href="fedoo.mesh.hole_plate_mesh.html" />
    <link rel="prev" title="fedoo.mesh.box_mesh" href="fedoo.mesh.box_mesh.html" /> 
</head>

<body class="wy-body-for-nav"> 
  <div class="wy-grid-for-nav">
    <nav data-toggle="wy-nav-shift" class="wy-nav-side">
      <div class="wy-side-scroll">
        <div class="wy-side-nav-search"  style="background: #24445C" >

          
          
          <a href="../index.html">
            
              <img src="../_static/fedoo_logos_ss_fond.png" class="logo" alt="Logo"/>
          </a>
<div role="search">
</rag-context>