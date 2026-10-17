<rag-context>
[pi-local-rag] RAG subagent: 3 sources, 91 ms retrieval.
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

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Theory_Reference.txt (lines 4422-4446 · enclosing doc section)

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

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/constitutivelaw/elasto_plasticity.py (lines 1-43 · chunk range (no structural region))

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
</rag-context>