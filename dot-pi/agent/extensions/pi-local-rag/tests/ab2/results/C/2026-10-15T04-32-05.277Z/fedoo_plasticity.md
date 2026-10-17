<rag-context>
[pi-local-rag] RAG subagent: 4 sources, 5071 ms retrieval.
### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Exemples_fedoo/03-advanced/README.rst (lines 1-4 · enclosing doc section)

Advanced problems
-----------------

This section show some advanced capabilities of fedoo.

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


### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 5338-5537 · enclosing doc section)

The following topics related to rate-dependent plasticity are available:
4.5.1. Perzyna and Peirce Options
4.5.2. Exponential Visco-Hardening (EVH) Option
4.5.3. Direct Tabular Entry of Rate-Dependent Isotropic Hardening Option
4.5.4. Anand Option
4.5.5. Creep Option
111
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Rate-Dependent Plasticity (Viscoplasticity)

4.5.6. Drucker-Prager Creep Option
For further information about rate-dependent plastic (viscoplastic) material options, see Viscoplasticity
Model in the Structural Analysis Guide.
4.5.1. Perzyna and Peirce Options
The Perzyna model has the following form:
The Peirce model has the following form:
where  is the number of terms,
 is the effective stress,
 is the equivalent plastic strain rate,
are the strain rate hardening parameters,
 are the material viscosity parameters, and 
 is the static
yield stress.
As the material viscosity (
) approaches 
, the strain rate hardening (
) approaches zero, or the
equivalent plastic strain rate (
) approaches zero, the solution approaches the static (rate-independent)
solution.
When the strain rate hardening is very small, the Peirce model has less difficulty converging as com-
pared to the Perzyna model.
These models can be combined with an isotropic hardening model for hardening of the static yield
stress (
). Anisotropic viscoplastic behavior is simulated by combining the Hill (p. 46) yield surface.
For the Perzyna and Peirce constants, the number of terms ( ) is determined from the number of
material parameters defined in the table. Up to 20 terms are allowed and the material constants
(defined via TBDATA) are:
Range
Unit
Property
Meaning
Constant
Dimensionless
Strain rate hardening
exponent
C1
1 / Time
Viscosity
C2
. . .
. . .
. . .
. . .
. . .
Dimensionless
Strain rate hardening
exponent
C(2 -1)
1 / Time
Viscosity
C(2 )
Specify the PERZYNA model as follows: TB,RATE,,,,PERZYNA
Specify the PEIRCE model as follows: TB,RATE,,,,PEIRCE
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
112
Nonlinear Material Properties

4.5.2. Exponential Visco-Hardening (EVH) Option
The EVH model has the following form:
where  is the number of terms,
 is the effective stress,
 is the equivalent plastic strain rate,
are the strain rate hardening parameters,
 are the material viscosity parameters, and 
 is the
static yield stress:
Where 
 is the initial yield stress,
 is the linear hardening coefficient,
 is the exponential
hardening coefficient, and  is the saturation rate.
For the EVH constants, the number of terms ( ) is determined from the number of material parameters
defined in the table. Up to 20 terms are allowed and the material constants (defined via TBDATA)
are:
Range
Unit
Property
Meaning
Constant
Stress
Initial yield stress
C1
Stress
Linear hardening coefficient
C2
--
Stress
Exponential hardening
coefficient
C3
Dimensionless
Exponential saturation rate
C4
Dimensionless
Strain rate hardening
exponent
C5
Stress × Timem1
Viscosity
C6
. . .
. . .
. . .
. . .
. . .
Dimensionless
Strain rate hardening
exponent
C(2 +3)
Stress × Timem1
Viscosity
C(2 +4)
Specify the EVH model as follows: TB,RATE,,,,EVH
4.5.3. Direct Tabular Entry of Rate-Dependent Isotropic Hardening Option
Equivalent plastic strain rate-dependent isotropic hardening can be defined for bilinear isotropic
hardening (TB,PLASTIC,,,,BISO), multilinear isotropic hardening (TB,PLASTIC,,,,MISO), and nonlinear
isotropic hardening (TB,NLISO,,,,VOCE / POWER).
Specify the desired isotropic hardening model (via the appropriate TB command), then define tabular
data at various equivalent plastic strain rates (TBFIELD,PLSR). It is good practice to begin with rate-
independent data at zero equivalent plastic strain rate.
113
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Rate-Dependent Plasticity (Viscoplasticity)

The isotropic hardening data can be a function of other supported field variables (p. 561) (such as
TEMP) in addition to the equivalent plastic strain rate.
Example 4.34: Rate-Dependent Multilinear Isotropic Hardening
TB,PLAS,1,,,MISO   ! Define miso curves for different rates
TBFIELD,PLSR,0.    ! Define miso curve for zero rate
TBPT,DEFI,0.0,15.0
TBPT…
TBFIELD,PLSR,rate2  ! Define miso curve for rate2
TBPT,DEFI,0.0,18.624
TBPT…
TBFIELD,PLSR,rate3  ! Define miso curve for rate3
TBPT,DEFI,0.0,20.483
TBPT…
…
4.5.3.1. Supported Material Model Combinations
The direct tabular entry rate-dependent model supports valid material model combinations (p. 511).
You can use it as an alternative to rate-dependent isotropic hardening combinations of
TB,PLASTIC,,,,BISO, TB,PLASTIC,,,,MISO, and TB,NLISO,,,,VOCE / POWER with TB,RATE.
Example 4.35: Direct Tabular Entry Rate-Dependent Model with a Material Model Combination
TB,RATE + TB,CHAB + TB,PLASTIC,,,,BISO is a valid material model combination.
Plastic strain rate-dependent isotropic hardening (TB,PLASTIC,,,,BISO + TBFIELD,PLSR) can therefore
be combined with TB,CHAB.
4.5.4. Anand Option
The Anand option offers a unified plasticity model requiring no combination with other material
models.
Details for the Anand option appear in Anand Viscoplasticity Option in the Mechanical APDL Theory
Reference.
This option requires nine material constants input via the data-table command (TBDATA) in the order
shown:
Units
Property
Meaning
Constant
Stress
Initial value of deformation
resistance
s0
C1
Energy / Volume
Q = Activation energy
Q/R
C2
Energy / Volume
temperature
R = Universal gas constant
1 / Time
Pre-exponential factor
A
C3
Dimensionless
Stress multiplier
xi
C4
Dimensionless
Strain rate sensitivity of stress
m
C5
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
114
Nonlinear Material Properties


### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.constitutivelaw.ElastoPlasticity.hardening_function_derivative.html (lines 1-14 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.constitutivelaw.ElastoPlasticity.hardening_function_derivative &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-dataframe.css?v=2082cf3c" />
</rag-context>