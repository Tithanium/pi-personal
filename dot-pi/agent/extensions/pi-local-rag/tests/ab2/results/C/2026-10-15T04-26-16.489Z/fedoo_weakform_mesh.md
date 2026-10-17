<rag-context>
[pi-local-rag] RAG subagent: 5 sources, 2996 ms retrieval.
### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Exemples_fedoo/03-advanced/README.rst (lines 1-4 · enclosing doc section)

Advanced problems
-----------------

This section show some advanced capabilities of fedoo.

### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 89182-89381 · enclosing doc section)

4
-
Integration point locations
LOCI:X, Y, Z
1. Nonlinear solution output if the element has a nonlinear material.
2. For structural analysis, stresses, total strains, plastic strains, elastic strains, creep strains, and thermal
strains in the element coordinate system are available for output. For thermal analysis, temperature
gradients and heat flux in the element coordinate system are available for output. For stress and
elastic strain output, by default (SECCONTROL,,,0), only axial components are available. With the
axial, bending, and torsional stiffness option (SECCONTROL,,,1 or 1 or SECCONTROL,,,2), both axial
and shear stress and elastic strain components are available.
3. Available only at centroid as a *GET item.
4. Available only if OUTRES,LOCI is used.
5. A member is an individual reinforcing.
Table 7.264.4: REINF264 Item and Sequence Numbers (p. 1394) lists output available via the ETABLE
command using the Sequence Number method. See Creating an Element Table and The Item and Se-
quence Number Table (p. 51) in this document for more information. The following notation is used
in Table 7.264.4: REINF264 Item and Sequence Numbers (p. 1394):
Name
output quantity as defined in Table 7.264.2: REINF264 Element Output Definitions – Structural
Analysis (p. 1392)
Item
predetermined Item label for ETABLE
1393
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

E
sequence number for single-valued or constant element data
Table 7.264.4: REINF264 Item and Sequence Numbers
ETABLE and ESOL Command
Input
Output
Quantity
Name
E
Item
(i - 1) * 4 + 1
SMISC
N11
(i - 1) * 4 + 2
SMISC
AREA
(i - 1) * 4 + 3
SMISC
HEAT
(i - 1) * 4 + 4
SMISC
VOLUME
The i value (where i = 1, 2, 3, ..., NL) represents the reinforcing member number of the element. NL
is the maximum reinforcing member number (1 
NL
 250).
REINF264 Assumptions and Restrictions
• Zero-volume elements are invalid.
• This element can be used only with base element types:
– Structural – LINK180 (p. 669), SHELL181 (p. 677), SHELL281 (p. 1476), SOLID185 (p. 861), SOLID186 (p. 878),
SOLID187 (p. 896), BEAM188 (p. 904), BEAM189 (p. 925), SOLSH190 (p. 946), SOLID285 (p. 1493)
– Thermal – SOLID278 (p. 1432), SOLID279 (p. 1451)
• A valid base element must be present for each REINF264 element.
• The reinforcing element is firmly attached to its base element. No relative movement between the
reinforcing element and the base is allowed. For a thermal analysis, the temperature field is continuous
at the interface between the base element and the reinforcing.
• Through-thickness reinforcing is not allowed in shells and layered solid elements.
• Stress stiffening is always included in geometrically nonlinear analyses (NLGEOM,ON). You can activate
prestress effects via the PSTRES command.
• The warping degree of freedom in beam base elements are not accounted for.
• REINF264 does not support BEAM188 (p. 904) with the quadratic or cubic interpolation option (KEY-
OPT(3)).
• To simulate the tension-/compression-only reinforcing fibers, a nonlinear iterative solution approach
is necessary.
• Linear tetrahedral base elements (degenerated SOLID185 (p. 861) and SOLID285 (p. 1493)) have constant
stress/strain in the element and are therefore not applicable to REINF264 bending and torsional
stiffness (SECCONTROL,,,1 and SECCONTROL,,,2).
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1394
Element Library

• By default, the program uses a zero effective Poisson’s ratio to calculate equivalent strain (PLNSOL,
PLESOL, and PRESOL) for REINF264 elements with the axial, bending, and torsional stiffness option
(SECCONTROL,,,1 or SECCONTROL,,,2). If necessary, you can define a non-zero effective Poisson’s
ratio (AVPRIN).
REINF264 Product Restrictions
There are no product-specific restrictions for this element.
REINF265
3D Smeared Reinforcing
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Product Restrictions (p.1406)
REINF265 Element Description
The REINF265 3D smeared reinforcing element is available in two forms:
• Structural/Thermal Smeared Reinforcing (p. 1395) -- For extra reinforcing to 3D solid and shell elements
• Special-Purpose Smeared Reinforcing
– For line element embedding (p. 1406)
– For shell element embedding (p. 1409)
3-D Structural/Thermal Smeared Reinforcing Element Description
For a structural reinforcing analysis, use REINF265 with standard 3D solid and shell elements (referred
to as the base elements) to provide extra reinforcing to those elements. For a thermal reinforcing ana-
lysis, the supported base elements are thermal solids SOLID278 (p. 1432) and SOLID279 (p. 1451), and
SOLID291 (p. 1572).
The element uses a smeared approach and is suitable for modeling homogeneous thin structures or
evenly spaced reinforcing fibers that appear in layered form. When used for modeling reinforcing fibers,
each reinforcing layer contains a cluster of fibers with unique orientation, material, and cross-section
area, and is simplified as a homogeneous membrane having unidirectional stiffness or conductivity.
You can specify multiple layers of reinforcing in one REINF265 element. The nodal locations, degrees
of freedom, and connectivity of the REINF265 element are identical to those of the base element.
For discrete reinforcing modeling options, see the documentation for the REINF264 (p. 1386) element.
REINF265 has plasticity, stress-stiffening, creep, large-deflection, and large-strain capabilities.
For more information, see Reinforcing and Direct Element Embedding in the Advanced Analysis Guide.
1395
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

Figure 7.265.1: REINF265 Structural/Thermal Geometry
P
X
M
Y
I
Q
J
T
L
W
O
A
K
R
S
Z
B
U
N
V
LL
II
JJ
KK
MM
NN
OO
PP
I
P
K
J
N
M
L
O
LL
II
JJ
KK
3D 20-Node Solid
3D 8-Node Solid or Solid Shell
L
K
J
I
II
JJ
KK
LL
L
P
R
K
N
J
M
I
II
JJ
MM
NN
PP
KK, LL, OO
O
Q
3D 4-Node Shell
3D 10-Node Tetrahedral Solid
Z
X
Y
L
K
J
I
II
JJ
KK
LL
N
M
MM
P
PP
O
OO

### H02 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 88612-88811 · enclosing doc section)

Y
-
Material number
MAT
Y
-
Averaged equivalent layer thickness (uniaxial
stress state)
THICK
Averaged layer thickness (plane stress state)
See "REINF263 Input Data" (p. 1377).
Y
-
Volume
VOLU:
3
-
Center location
XC, YC, ZC
Y
-
T1, T2 for reinforcing members (individual
reinforcings)
BFE TEMP
Y
2
Temperature gradient along the x and y directions
(of layer CSYS) for all members
TG:x, y
Y
2
Heat flux along the x and y directions (of layer CSYS)
for all reinforcing members (individual reinforcings)
TF:x, y
1. Nonlinear solution output if the element has a nonlinear material.
2. Stresses, total strains, plastic strains, elastic strains, creep strains, and thermal strains in the element
coordinate system are available for output.
3. Available only at centroid as a *GET item.
4. Available only if OUTRES,LOCI is used for structural analysis.
5. Applicable only if uniaxial stress state is used.
Table 7.263.3: REINF263 Item and Sequence Numbers (p. 1385) lists output available via ETABLE using
the Sequence Number method. See Creating an Element Table and The Item and Sequence Number
Table (p. 51) in this document for more information. The following notation is used in
Table 7.263.3: REINF263 Item and Sequence Numbers (p. 1385):
Name
output quantity as defined in Table 7.263.1: REINF263 Element Output Definitions – Structural
Analysis (p. 1382)
Item
predetermined Item label for ETABLE
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1384
Element Library

E
sequence number for single-valued or constant element data
Table 7.263.3: REINF263 Item and Sequence Numbers
ETABLE and ESOL Command
Input
Output
Quantity
Name
E
Item
(i - 1) * 5 + 1
SMISC
N11
(i - 1) * 5 + 2
SMISC
THICK
(i - 1) * 5 + 3
SMISC
SPACING
(i - 1) * 5 + 4
SMISC
HEAT
(i - 1) * 5 + 5
SMISC
VOLUME
The i value (where i = 1, 2, 3, ..., NL) represents the reinforcing member number of the element. NL
is the maximum reinforcing member number (1 
NL
 250).
REINF263 Assumptions and Restrictions
• Zero-volume elements are invalid.
• This element can be used only with these base element types:
Structural – SHELL208 (p. 1005), SHELL209 (p. 1016), PLANE182 (p. 696), and PLANE183 (p. 704)
Thermal – PLANE292 (p. 1579), PLANE293 (p. 1589)
• A valid base element must be present for each REINF263 element.
• The reinforcing element is firmly attached to its base element. No relative movement between the
reinforcing element and the base is allowed. For a thermal analysis, the temperature field is continuous
at the interface between the base element and the reinforcing.
• Through-thickness reinforcing is not permitted in shells and layered solid elements.
• Stress stiffening is always included in geometrically nonlinear analyses (NLGEOM,ON). You can also
activate prestress effects (PSTRES).
• To simulate tension-/compression-only reinforcing fibers, a nonlinear iterative solution approach is
necessary.
REINF263 Product Restrictions
There are no product-specific restrictions for this element.
1385
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

REINF264
3D Discrete Reinforcing
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Product Restrictions (p.1395)
REINF264 Element Description
For a structural reinforcing analysis, use REINF264 with standard 3D link, beam, shell and solid elements
(referred to here as the base elements) to provide extra reinforcing to those elements. For a thermal
reinforcing analysis, the supported base elements are thermal solids SOLID278 (p. 1432), SOLID279 (p. 1451),
and SOLID291 (p. 1572).
The element is suitable for simulating reinforcing fibers with arbitrary orientations. Each fiber is modeled
separately as a spar that has only uniaxial stiffness (default) or conductivity. When solid base elements
are used, the element can also account for bending and torsional stiffness with either square (SECCON-
TROL,,,1) or circular (SECCONTROL,,,2) cross sections. You can specify multiple reinforcing fibers in one
REINF264 element. The nodal locations, degrees of freedom, and connectivity of the REINF264 element
are identical to those of the base element.
For smeared reinforcing modeling options, use the REINF263 (p. 1376) and REINF265 (p. 1395) elements.
REINF264 has plasticity, stress-stiffening, creep, large-deflection, and large-strain capabilities.
For more information, see Reinforcing and Direct Element Embedding in the Advanced Analysis Guide.
Table 7.264.1: REINF264 Geometry
P
X
M
Y
I
Q
J
T
L
W
O
A
K
R
S
Z
B
U
N
V
KK
II
JJ
3D 20-Node Solid
I
P
K
J
N
M
L
O
II
JJ
3D 8-Node Solid or Solid
Shell
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1386
Element Library

L
P
R
K
N
J
M
I
O
Q
KK
II
JJ
3D 10-Node Tetrahedral
Solid
L
K
J
I
II
JJ
3D 4-Node Tetrahedral
Solid
L
K
J
I
N
M
P
O
KK
II
JJ
3D 8-Node Shell
L
K

### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/constraint/periodic_bc.py (lines 1391-1462 · enclosing function/class)

    def initialize(self, problem, dic_closest_points_on_boundaries=None):
        if problem.space.is_axisymmetric:
            raise NotImplementedError(
                "PeriodicBC does not support the '2Daxi' ModelingSpace: "
                "translational periodicity in the (r, z) plane is not "
                "well-defined for an axisymmetric body of revolution."
            )
        # Use stored dictionary if none provided explicitly
        if dic_closest_points_on_boundaries is None:
            dic_closest_points_on_boundaries = self._dic_closest_points_on_boundaries
        """
        Initialize a periodic boundary condition object using several multi-point constraints. The constraint drivers are constructed as follows, depending on `periodicity_type` and `dim`:
        - For `periodicity_type="small_strain"`:
            - dim=1:
                - `global_dof` is created for ['E_xx'] (1 DOF).
                - `node_cd = [problem.virtual_dof['E_xx']]`
                - `var_cd = ['E_xx']`
            - dim=2:
                - `virtual_dof` is created for ['E_xx', 'E_yy', 'E_xy'] (3 DOF).
                - `node_cd = [[problem.virtual_dof['E_xx'], problem.virtual_dof['E_xy']], [problem.virtual_dof['E_xy'], problem.virtual_dof['E_yy']]]`
                - `var_cd = [['Virtual', 'Virtual'], ['Virtual', 'Virtual']]`
            - dim=3:
                - `virtual_dof` is created for ['E_xx', 'E_yy', 'E_zz', 'E_xy', 'E_xz', 'E_yz'] (6 DOF).
                - `node_cd = [[problem.virtual_dof['E_xx'], problem.virtual_dof['E_xy'], problem.virtual_dof['E_xz']], [problem.virtual_dof['E_xy'], problem.virtual_dof['E_yy'], problem.virtual_dof['E_yz']], [problem.virtual_dof['E_xz'], problem.virtual_dof['E_yz'], problem.virtual_dof['E_zz']]]`
                - `var_cd = [['Virtual', 'Virtual', 'Virtual'], ['Virtual', 'Virtual', 'Virtual'], ['Virtual', 'Virtual', 'Virtual']]`
        - For `periodicity_type="finite_strain"`:
            - dim=1:
                - `virtual_dof` is created for ['DU_xx'] (1 DOF).
                - `node_cd = [problem.virtual_dof['DU_xx']]`
                - `var_cd = ['Virtual']`
            - dim=2:
                - `virtual_dof` is created for ['DU_xx', 'DU_xy', 'DU_yx', 'DU_yy'] (4 DOF).
                - `node_cd = [[problem.virtual_dof['DU_xx'], problem.virtual_dof['DU_xy']], [problem.virtual_dof['DU_yx'], problem.virtual_dof['DU_yy']]]`
                - `var_cd = [['Virtual', 'Virtual'], ['Virtual', 'Virtual']]`
            - dim=3:
                - `virtual_dof` is created for ['DU_xx', 'DU_xy', 'DU_xz', 'DU_yx', 'DU_yy', 'DU_yz', 'DU_zx', 'DU_zy', 'DU_zz'] (9 DOF).
                - `node_cd = [[problem.virtual_dof['DU_xx'], problem.virtual_dof['DU_xy'], problem.virtual_dof['DU_xz']], [problem.virtual_dof['DU_yx'], problem.virtual_dof['DU_yy'], problem.virtual_dof['DU_yz']], [problem.virtual_dof['DU_zx'], problem.virtual_dof['DU_zy'], problem.virtual_dof['DU_zz']]]`
                - `var_cd = [['Virtual', 'Virtual', 'Virtual'], ['Virtual', 'Virtual', 'Virtual'], ['Virtual', 'Virtual', 'Virtual']]`
        The `node_cd` and `var_cd` structures define the virtual DOFs and their associated variables for the constraint drivers, depending on the periodicity type and dimension.

        """
        mesh = problem.mesh
        res = None

        periodicity = self.meshperio

        if periodicity:
            self._prepare_periodic_lists(mesh, self.tol)
            if self.off_axis_rotation is None:
                res = self._list_MPC_periodic()
            if self.off_axis_rotation is not None:
                res = ListBC([self._list_MPC_rotation(), self._list_MPC_periodic()])
                # res = ListBC([self._list_MPC_periodic(), self._list_MPC_rotation()])
        else:
            if dic_closest_points_on_boundaries is None:
                raise ValueError(
                    "dic_closest_points_on_boundaries is required when meshperio=False. "
                    "Use microgen.BoxMesh.closest_points_on_boundaries() to generate it."
                )
            else:
                self._construct_faces_edges_corners_from_dic_non_periodic_node_distance(
                    dic_closest_points_on_boundaries,
                    dic_closest_points_on_boundaries.get("rve_size", None),
                )
                res = self._list_MPC_non_periodic_node_distance()

        # Enforce continuity of rotation DOFs (RotX, RotY, RotZ) if present
        self._add_additional_rot_dof(problem, res, lambda key: self.boundary_nodes[key])

        res.initialize(problem)
        self.list_mpc = res


### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium_ri.py (lines 297-305 · enclosing function/class)


    @property
    def corate(self):
        return self.list_weakform[0].corate

    @corate.setter
    def corate(self, value):
        self.list_weakform[0].corate = value
</rag-context>