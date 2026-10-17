<rag-context>
[pi-local-rag] RAG subagent: 8 sources, 288 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 17353-17552 · enclosing doc section)

# Assuming an example uniaxial stress state l2 can be calculated as sqrt(1/l1)
l1 = 1+disp
l2 = (1/(l1))**0.5
#solution parameters
solutiondata = dict()
solutiondata['time'] = 0.0
solutiondata['dtime'] = 101.0 
defgrad_t = [1,0,0,0,1,0,0,0,1]
defgrad = [l1,0,0,0,l2,0,0,0,l2]
outputstress = []
jacobian = []
mymaterial.initialize()
[outputstress,jacobian,status] = mymaterial.evaluate(solutiondata,defgrad_t,defgrad)
print("Stress is ", outputstress)
jacobmatrix = np.array(jacobian)
jacobmatrix = jacobmatrix.reshape((6,6))
print('Material Algorithms Converged Status is', status['converged'])
print("Jacobian :")
print(jacobmatrix)
6.3. AML Python Module Classes and Methods
This table describes the classes and methods of AML Python Module.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
386
Using AML Python Module

Method
Class
_init_(material id): Constructor given a material ID.
materi-
al(Boost.Py-
thon.instance)
• Parameters:
Define, explore, and
study material models.
– material id: int. The material ID.
• Return: None.
add_table(self, tbtype, tbopt, fldvar, params): Add a
material table at the field variable combination.
• Parameters:
– self: material. This material object.
– tbtype: str. Table type.
– tbopt: str. Table option.
– fldvar: dict. Field variable dictionary. fldvarobj['temp']
= 100,...
– params: list. List of items representing material parameters.
→For tbdata style input: List of doubles (for example, [1e6,
0.3]).
→For tbpt style input: List of doubles (for example, [0, 100,
0.2, 200]) or list of lists (for example, [[0, 100],
[0.1, 200]]).
• Return: bool. True if successful. False if failed.
delete_table(self, tbtype, tbopt): Delete a material table.
• Parameters:
– self: material. This material object.
– tbtype: str. Table type.
– tbopt: str. Table option.
• Return: bool. True if successful. False if failed.
delete_table(self, tbtype, tbopt, index): Delete a material
sub-table.
• Parameters:
– self: material. This material object.
– tbtype: str. Table type.
387
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
AML Python Module Classes and Methods

Method
Class
– tbopt: str. Table option.
– index: int. Index of sub-table to be deleted.
• Return: bool. True if successful. False if failed.
evaluate(self, solverparams, defgrad_t, defgrad):
Material driver call to take deformation gradients as inputs and return the
material stress and tangent for large deformation problems.
• Parameters:
– self: material. This material object.
– solverparams: dict. Dictionary of solution parameters.
→'time': Time.
→'dtime': Time increment.
→'tref': Reference temperature.
– defgrad_t: list. The previous deformation gradient.
– defgrad: list. The new deformation gradient at which the
evaluation is done.
• Return: list. List of output items.
– stress: list. Calculated stress.
– jacobian: list. Calculated material Jacobian.
– additional info: dict. Dictionary of additional output.
additionalinfo['converged'] gives the material
converged status.
evaluate(self, solverparams, currentstrain): Material
driver call to take strain tensors as inputs and return the material stress
and tangent.
• Parameters:
– self: material. This material object.
– solverparams: dict. Dictionary of solution parameters.
→'time': Time.
→'dtime': Time increment.
→'tref': Reference temperature.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
388
Using AML Python Module

Method
Class
– currentstrain: list. Current strain tensors.
• Return: list. List of output items.
– stress: list. Calculated stress.
– jacobian: list. Calculated material Jacobian.
– additional info: dict. Dictionary of additional output.
additionalinfo['converged'] gives material converged
status.
get_state(self): Get material state variables.
• Parameters:
– self: material. This material object.
• Return: dict. Dictionary of state variables.
initialize(arg1): Prepare the material data for the material drivers.
• Parameters:
– arg1: material.
• Return: None.
print(self, matid, tbtype): Print a material table.
• Parameters:
– self: material. This material object.
– matid: int. Material ID.
– tbtype: str. Table type.
• Return: bool. True if successful. False if failed.
set_state(self, statevars): Set material state variables.
• Parameters:
– self: material. This material object.
– statevars: dict. Dictionary of state variables.
• Return: bool. True if successful. False if failed.
_init_(fitting object id): Constructor given a fitting object ID.
fit(Boost.Py-
thon.instance)
• Parameters:
389
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
AML Python Module Classes and Methods

Method
Class
fitting object id: int. The fitting object ID.
Curve fit material
models.
–
• Return: None.
add_experiment(self, exptype, filename): Add experimental
data in command delimited form to be fitted.
• Parameters:
– self: fit. This fit object.
– exptype: str. Experiment type.
– filename: str. File to read the experiment data from.
For more information, see Material Curve-Fitting (p. 399).
• Return: bool. True if successful. False if failed.
auto_initialize(self, fitname): Perform AI-based initialization
needed for the fitting process.
• Parameters:
– self: fit. This fit object.
– fitname: str. Unique name associated with the fitting object.
• Return: bool. True if successful. False if failed.
create_fit(self, fittingobjectname): Create a parameter
fitting object.
• Parameters:
– self: fit. This fit object.
– fittingobjectname: str. Unique name associated with the
fitting object.
• Return: bool. True if successful. False if failed.
fix_parameter_value(self, fitname, index, flag): Fix a
parameter value to be constant in the fitting process.
• Parameters:
– self: fit. This fit object.
– fitname: str. Unique name associated with the fitting object.
– index: int. Index of the parameter.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
390
Using AML Python Module

Method
Class
– flag: bool. Set to True to fix the parameter value to be
constant. Set to False to free the parameter.
• Return: bool. True if successful. False if failed.
generate_fitted_data(self, fitname, expindex): Get fitted
values.
• Parameters:
– self: fit. This fit object.
– fitname: str. Unique name associated with the fitting object.
– expindex: int. Index of the experiment to get the data for.
• Return: list. List of lists.
– Dimension list (nrow, num ind cols, num dep cols,
num fitted cols). The fitted value table dimensions.
→nrow: int. Number of rows.
→num ind cols: int. Number of independent columns.
→num dep cols: int. Number of dependent columns.
→num fitted cols: int. Number of fitted columns.
– Data list: List of fitted values.

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt (lines 4178-4296 · enclosing doc section)

4.2.4. Hardening Rule
The hardening rule describes the changing of the yield surface with progressive yielding, so that the
conditions (stress states) for subsequent yielding can be established. Two hardening rules are available:
work (or isotropic) hardening and kinematic hardening. In work hardening, the yield surface remains
centered about its initial center line and expands in size as the plastic strains develop. For materials
with isotropic plastic behavior this is termed isotropic hardening and is shown in Figure 4.3: Types of
Hardening Rules (p. 70) (a). Kinematic hardening assumes that the yield surface remains constant in
size and the surface translates in stress space with progressive yielding, as shown in Figure 4.3: Types
of Hardening Rules (p. 70) (b).
The yield criterion, flow rule and hardening rule for each option are summarized in Table 4.2: Summary
of Plasticity Options (p. 70) and are discussed in detail later in this chapter.
Figure 4.3: Types of Hardening Rules
Table 4.2: Summary of Plasticity Options
Material
Response
Hardening
Rule
Flow Rule
Yield
Criterion
TB Lab
Name
bilinear
work
hardening
associative
von
Mises/Hill
PLASTIC
(TBOPT
= BISO)
Bilinear Isotropic
Hardening
nonlinear
work
hardening
associative
von
Mises/Hill
NLISO
Nonlinear
Isotropic
Hardening
bilinear
kinematic
hardening
associative
(Prandtl-Reuss
equations)
von
Mises/Hill
PLASTIC
(TBOPT
= BKIN)
Classical Bilinear
Kinematic
Hardening
nonlinear
kinematic
hardening
associative
von
Mises/Hill
CHAB
Nonlinear
Kinematic
Hardening
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
70
Structures with Material Nonlinearities

Material
Response
Hardening
Rule
Flow Rule
Yield
Criterion
TB Lab
Name
multilinear
work
hardening
associative
or
non-associative
von Mises
with
dependence
EDP
Extended
Drucker-Prager
on
hydrostatic
stress
multilinear
work
hardening
non-associative
von Mises
with
CAST
Cast Iron
dependence
on
hydrostatic
stress
multilinear
work
hardening
associative
von Mises
with
GURS
Gurson
dependence
pressure
and porosity

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt (lines 4422-4446 · enclosing doc section)

4.2.8. Bilinear Isotropic Hardening
These options use the von Mises yield criterion with the associated flow rule and isotropic (work)
hardening (accessed via TB,PLASTIC,,,,BISO).
The equivalent stress Equation 4.4 (p. 67) is:
(4.27)
where {s} is the deviatoric stress Equation 4.37 (p. 76). When 
 is equal to the current yield stress
 the material is assumed to yield. The yield criterion is:
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
74
Structures with Material Nonlinearities

(4.28)
For work hardening,
 is a function of the amount of plastic work done. For the case of isotropic
plasticity assumed here,
 can be determined directly from the equivalent plastic strain 
 of
Equation 4.43 (p. 77) (output as EPEQ) and the uniaxial stress-strain curve as depicted in Figure 4.4: Uni-
axial Behavior (p. 75).
 is output as the equivalent stress parameter (output as SEPL).
Figure 4.4: Uniaxial Behavior
For 
 Determination

## 004 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/constitutivelaw/elasto_plasticity.py (lines 1-43 · chunk range (no structural region))

"""J2 plasticity with isotropic hardening, additive on the strain measure."""

import numpy as np
from simcoon import Rotation as SimRotation

from fedoo.core.mechanical3d import MechanicalUMAT
from fedoo.util.voigt_tensors import StrainTensorList, StressTensorList


class ElastoPlasticity(MechanicalUMAT):
    r"""Elasto-plastic constitutive law with isotropic hardening.

    The stress integration uses a vectorized radial-return algorithm for the
    von Mises yield criterion. The finite-element lifecycle is provided by
    :class:`fedoo.core.mechanical3d.MechanicalUMAT`; the scalar accumulated
    plastic strain ``P`` and plastic-strain tensor ``EP`` are exposed as
    labelled components of the private ``Statev`` array.

    In a geometrically nonlinear analysis, this law is a corotational
    extension of the same additive small-strain model written on the
    logarithmic strain. Tensorial history is transported with the objective
    rotation increment before each return mapping. The stress returned by the
    radial return is the Kirchhoff stress :math:`\boldsymbol{\tau}` conjugate
    to the logarithmic strain and the Cauchy stress
    :math:`\boldsymbol{\tau}/J` is handed to the assembly, so that the
    response is the one of Simcoon's ``EPICP`` UMAT. This makes the response
    objective under finite rotations, but it is not a multiplicative
    finite-plasticity model (there is no decomposition
    :math:`\mathbf{F} = \mathbf{F}^e \mathbf{F}^p`).

    The returned elastoplastic tangent is the continuum tangent evaluated at
    the updated stress. It is not the algorithmically consistent tangent of
    the discrete radial-return integration. Consequently, global Newton
    convergence is not guaranteed to be quadratic for finite plastic
    increments or non-proportional loading paths.

    .. warning::

        This Python implementation is intended only for pedagogical use and
        as a readable reference implementation. For computational analyses,
        prefer :class:`fedoo.constitutivelaw.Simcoon`, which provides optimized
        constitutive updates and algorithmically consistent tangent options.


## 005 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/constitutivelaw/elasto_plasticity.py (lines 1-43 · chunk range (no structural region))

"""J2 plasticity with isotropic hardening, additive on the strain measure."""

import numpy as np
from simcoon import Rotation as SimRotation

from fedoo.core.mechanical3d import MechanicalUMAT
from fedoo.util.voigt_tensors import StrainTensorList, StressTensorList


class ElastoPlasticity(MechanicalUMAT):
    r"""Elasto-plastic constitutive law with isotropic hardening.

    The stress integration uses a vectorized radial-return algorithm for the
    von Mises yield criterion. The finite-element lifecycle is provided by
    :class:`fedoo.core.mechanical3d.MechanicalUMAT`; the scalar accumulated
    plastic strain ``P`` and plastic-strain tensor ``EP`` are exposed as
    labelled components of the private ``Statev`` array.

    In a geometrically nonlinear analysis, this law is a corotational
    extension of the same additive small-strain model written on the
    logarithmic strain. Tensorial history is transported with the objective
    rotation increment before each return mapping. The stress returned by the
    radial return is the Kirchhoff stress :math:`\boldsymbol{\tau}` conjugate
    to the logarithmic strain and the Cauchy stress
    :math:`\boldsymbol{\tau}/J` is handed to the assembly, so that the
    response is the one of Simcoon's ``EPICP`` UMAT. This makes the response
    objective under finite rotations, but it is not a multiplicative
    finite-plasticity model (there is no decomposition
    :math:`\mathbf{F} = \mathbf{F}^e \mathbf{F}^p`).

    The returned elastoplastic tangent is the continuum tangent evaluated at
    the updated stress. It is not the algorithmically consistent tangent of
    the discrete radial-return integration. Consequently, global Newton
    convergence is not guaranteed to be quadratic for finite plastic
    increments or non-proportional loading paths.

    .. warning::

        This Python implementation is intended only for pedagogical use and
        as a readable reference implementation. For computational analyses,
        prefer :class:`fedoo.constitutivelaw.Simcoon`, which provides optimized
        constitutive updates and algorithmically consistent tangent options.


## 006 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 2459-2482 · enclosing doc section)

4.4.1.4. Flow Rule
The evolution of plastic strain is determined by the flow rule:
where 
 is the magnitude of the plastic strain increment and 
 is the plastic potential.
When the plastic potential is the yield surface from Equation 4.4 (p. 32) , the plastic strain increment
is normal to the yield surface and the model has an associated flow rule, as shown in this figure:
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
32
Nonlinear Material Properties

Figure 4.3: Plastic Strain Flow Rule
These flow rules are typically used to model metals and give a plastic strain increment that is pro-
portional to the stress increment. If the plastic potential is not proportional to the yield surface,
the model has a non-associated flow rule, typically used to model soils and granular materials that
plastically deform due to internal frictional sliding. For non-associated flow rules, the plastic strain
increment is not in the same direction as the stress increment.
Non-associated flow rules result in an unsymmetric material stiffness tensor. Unsymmetric analysis
can be set via the NROPT command. For a plastic potential that is similar to the yield surface, the
plastic strain direction is not significantly different from the yield surface normal, and the degree
of asymmetry in the material stiffness is small. In this case, a symmetric analysis can be used, and
a symmetric material stiffness tensor will be formed without significantly affecting the convergence
of the solution.

## 007 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 2763-2876 · enclosing doc section)

4.4.2.2.2. Generalized Hill Theory
Generalized anisotropic Hill potential theory uses Hill's [ 1 ] yield criterion to account for differences
in yield strengths in orthogonal directions, but is modified (Shih and Lee [ 9 ]) to also account
for differences in yield strength in tension and compression. An associated flow rule is assumed.
Work hardening (as presented by Valliappan et al. [ 10 ]) is used to update the yield criterion.
The yield surface is therefore a distorted circular cylinder that is initially shifted in stress space
which expands in size with plastic straining.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
40
Nonlinear Material Properties

Figure 4.6: Yield Surface for Hill Yield Criterion
The equivalent stress for the generalized Hill option is redefined as:
where 
 is a matrix describing the variation of the yield stress with orientation, and 
 ac-
counts for the difference between tension and compression yield strengths.
 can be related to the yield surface translation for kinematic hardening.[ 9 ] The equivalent
stress function can therefore be interpreted as having an initial translation or shift. When 
equals a material parameter 
 , the material is assumed to yield.
The yield criterion is then:
(4.21)
The material is assumed to have three orthogonal planes of symmetry. The plastic behavior can
then be characterized by the stress-strain behavior in the three element coordinate directions
and the corresponding shear stress-shear strain behavior. Therefore,
 has the form:
By evaluating the yield criterion Equation 4.21 (p. 41) for all possible uniaxial stress conditions,
the individual terms of [M] can be identified:
(4.22)
where 
 and 
 = tensile and compressive yield strengths in direction  ( = 1 to 6).
Compressive yield stress is handled as a positive number here. For the shear yields,
 = 
 .
Letting 
 = 1 defines 
 to be:
41
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Rate-Independent Plasticity

The strength differential vector 
 has the form:
and from the uniaxial conditions,
 is defined as:
(4.23)
Assuming plastic incompressibility (no increase in material volume due to plastic straining) yields
the following relationships:
and
(4.24)
The off-diagonals are therefore:
Note that Equation 4.24 (p. 42) (via Equation 4.22 (p. 41) and Equation 4.23 (p. 42)) yields the
consistency equation:
that must be satisfied due to the requirement of plastic incompressibility. The uniaxial yield
strengths are therefore not completely independent.
The yield strengths must also define a closed yield surface (that is, elliptical in cross-section). An
elliptical yield surface is defined if the following criterion is met:
The criterion further restricts the independence of the uniaxial yield strengths. Because the yield
strengths change with plastic straining (a consequence of work hardening), this condition must
be satisfied throughout the loading history. The program checks the condition using an equivalent
plastic strain level of 20 percent (.20).
For an isotropic material,
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
42
Nonlinear Material Properties

and
and the yield criterion (Equation 4.21 (p. 41)) reduces to the von Mises yield criterion 
 .
Work hardening is used for the hardening rule so that the subsequent yield strengths increase
with increasing total plastic work done on the material. The increment in plastic work is:
where 
 = the average stress over the increment.
Figure 4.7: Plastic Work for a Uniaxial Case
For the uniaxial case, the total plastic work is simply:
(4.25)
where the terms are defined as shown in Figure 4.6: Yield Surface for Hill Yield Criterion (p. 41)
.
The bilinear stress-strain behavior is:
(4.26)
where:
 = plastic slope
 = elastic modulus
 = tangent modulus
Combining Equation 4.26 (p. 43) with Equation 4.25 (p. 43) and solving for the updated yield
stress  :
43
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Rate-Independent Plasticity

Extending this result to the anisotropic case gives:
(4.27)
where  refers to each of the input stress-strain curves.
Equation 4.27 (p. 44) determines the updated yield stresses by equating the amount of plastic
work done on the material to an equivalent amount of plastic work in each of the directions.
The parameters 
 and 
 can then be updated from their definitions (Equation 4.22 (p. 41)
and Equation 4.23 (p. 42)) and the new values of the yield stresses. For isotropic materials, this
hardening rule reduces to the case of isotropic hardening.
The equivalent plastic strain 
 (output as EPEQ) is determined using the tensile x direction as
the reference axis by substituting Equation 4.26 (p. 43) into Equation 4.25 (p. 43) :
where the yield stress in the tensile x direction 
 refers to the initial (not updated) yield stress.
The equivalent stress parameter (output as SEPL) is defined as:
where again 
 is the initial yield stress.

## 008 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Material_Reference.txt (lines 3186-3227 · enclosing doc section)

4.4.3.2.4.1. Defining the Isotropic Static Recovery
Static recovery of the isotropic yield stress can be used only when in combination with the
Chaboche nonlinear kinematic hardening material. The material parameters are defined via a
TB material table with Lab = PLASTIC and TBOPT = ISR.
Property
Meaning
Constant
Coefficient
C1
Temperature Coefficient
C2
Exponential
C3
53
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Rate-Independent Plasticity

Property
Meaning
Constant
Recovery threshold
C4
The constants can be defined as a function of temperature (NTEMP on the TB command), with
temperatures specified for the table entries (TBTEMP).
Example 4.9: Isotropic Hardening Static Recovery
/prep7
YOUNGS = 30e3   ! Young’s Modulus
NU     = 0.3    ! Poisson’s ratio
SIGMA0 = 18.0E0 ! Initial yield stress
MP,EX,1,YOUNGS
MP,PRXY,1,NU
TB,CHAB,1,1,1    ! Chaboche kinematic hardening
TBDATA,1,sigma0,
TBDATA,2,1e+3,0
TB,PLASTIC,1,,,MISO  ! Multilinear isotropic hardening
TBPT,DEFI,0.0,SIGMA0
TBPT,DEFI,0.001,35.0
TBPT,DEFI,0.002,40.0
TBPT,DEFI,0.010,60.0
TB,PLASTIC,1,,4,ISR  ! Isotropic hardening static recovery
TBDATA,1,1D-5,1,2,SIGMA0
</rag-context>