<rag-context>
[pi-local-rag] RAG subagent: 17 sources, 30292 ms retrieval.
grep term: "ModelingSpace"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/core/modelingspace.py (lines 4-203 · enclosing function/class)

class ModelingSpace:
    # __ModelingSpace = {"Main"}
    _active = None
    __dic = {}  # dic containing all the modeling spaces

    def __init__(self, dimension, name="Main"):
        """
        Space in which are defined the coordinates and variables (ie functions over coordinates).
        A modeling space is required to be able to define weak equations.

        Parameters
        ----------
        dimension: str in ['2D', '3D', '2Dplane' or '2Dstress']
            Type of modeling space.
            * '2D' or '2Dplane': general 2D problems, with default coordinates 'X' and 'Y' and plane strain assumption
            * '3D' for 3D problems with default coordinates 'X', 'Y' and 'Z'
            * '2Dstress': same as '2D' but using plane stress assumption for mechanical problems
            * '2Daxi': same as '2D' but using axisymmetric assumption for mechanical problems
        name: str, default = 'Main'
            The name of the modeling space

        Example
        --------
        Create a new empty 2D modeling space with plane stress assumption
        >>> import fedoo as fd
        >>> fd.ModelingSpace('2Dstress')
        >>> print(fd.ModelingSpace['Main'].ndim)
        """

        assert isinstance(
            dimension, str
        ), "The dimension value must be a string: '2D', '3D', '2Dplane' or '2Dstress'."
        if dimension == "2D":
            dimension = "2Dplane"
        assert (
            dimension == "3D"
            or dimension == "2Dplane"
            or dimension == "2Dstress"
            or dimension == "2Daxi"
        ), "Dimension must be '2D', '3D', 2Dplane', '2Dstress' or '2Daxi'"

        # Static attributs
        ModelingSpace._active = self
        ModelingSpace.__dic[name] = self

        self.__name = name

        # coordinates
        self._coordinate = {}  # dic containing all the coordinate related to the modeling space
        self._ncrd = 0

        # variables
        self._variable = {}  # attribut statique de la classe
        self._nvar = 0
        self._vector = {}  # dic of vectors containing the variable name
        self._rank_vector = {}  # dict of vectors containing the var rank

        # dimension
        if dimension == "2D":
            dimension = "2Dplane"
        self._dimension = dimension

        self.new_coordinate("X")
        self.new_coordinate("Y")

        if dimension == "3D":
            self.__ndim = 3
            self.new_coordinate("Z")
        if dimension in ["2Dplane", "2Dstress", "2Daxi"]:
            self.__ndim = 2

    def __class_getitem__(cls, item):
        return cls.__dic[item]

    def get_dimension(self):
        """
        Return an str that define the dimension of the ModelingSpace:
        * '2Dplane': general 2D problems, with default coordinates 'X' and 'Y' and plane strain assumption.
        * '3D' for 3D problems with default coordinates 'X', 'Y' and 'Z'.
        * '2Dstress': same as '2D' but using plane stress assumption for mechanical problems.
        """
        return self._dimension

    @property
    def is_axisymmetric(self):
        """True if this ModelingSpace uses the 2Daxi axisymmetric assumption."""
        return self._dimension == "2Daxi"

    def make_active(self):
        """Define the modeling space as the active ModelingSpace."""
        ModelingSpace._active = self

    @staticmethod
    def set_active(name):
        """
        Static method.
        Define the active ModelingSpace from its name.
        """
        if isinstance(name, ModelingSpace):
            ModelingSpace._active = name
        elif name in ModelingSpace.__dic:
            ModelingSpace._active = ModelingSpace.__dic[name]
        else:
            raise NameError("{} is not a valid ModelingSpace".format(name))

    @staticmethod
    def get_active():
        """Return the active ModelingSpace."""
        assert (
            ModelingSpace._active is not None
        ), "You must define a ModelingSpace for your problem."
        return ModelingSpace._active

    @staticmethod
    def get_all():
        """Return a dict containing all the defined ModelingSpace"""
        return ModelingSpace.__dic

    @property
    def ndim(self):
        """Return the number of dimensions."""
        return self.__ndim

    @property
    def name(self):
        """Return the name of the ModelingSpace."""
        return self.__name

    # ===================================================
    # Methods related to Coordinates
    # ===================================================
    def new_coordinate(self, name):
        """Create a new coordinate with the given name."""
        assert isinstance(name, str), "The coordinte name must be a string"

        if name not in self._coordinate.keys():
            self._coordinate[name] = self._ncrd
            self._ncrd += 1

    def coordinate_rank(self, name):
        """Return the rank (int id) of the coordinate name"""
        if name not in self._coordinate.keys():
            assert 0, "the coordinate name " + str(name) + " does not exist"
        return self._coordinate[name]

    def coordinate_name(self, rank):
        """
        Return the rank (int) of a coordinate associated to a given name (str)
        """
        return list(self._coordinate.keys())[list(self._variable.values()).index(rank)]

    def list_coordinates(self):
        """return a list containing all the coordinates name"""
        return self._coordinate.keys()

    @property
    def ncrd(self):
        """Return the number of coordinates defined in the ModelingSpace"""
        return self._ncrd

    # ===================================================
    # Methods related to Varibale
    # ===================================================
    def new_variable(self, name):
        """Create a new variable with the given name."""
        assert isinstance(name, str), "The variable must be a string"
        assert name[:2] != "__", "Names of variable should not begin by '__'"

        if name not in self._variable.keys():
            self._variable[name] = self._nvar
            self._nvar += 1

    def variable_alias(self, alias_name, var_name):
        """Create an alias of an existing variable."""
        assert isinstance(var_name, str), "The variable must be a string"
        assert alias_name[:2] != "__", "Names of variable should not begin by '__'"

        self._variable[alias_name] = self.variable_rank(var_name)

    def variable_rank(self, name):
        """
        Return the rank (int) of a variable associated to a given name (str)
        """
        # if name == "Global":  # to get virtual dof
        #     return self._nvar
        if name not in self._variable.keys():
            assert 0, "the variable " + str(name) + " does not exist"
        return self._variable[name]

    def variable_name(self, rank):
        """
        Return the name of the variable associated to a given rank
        """
        # as dict keep insertion order since python 3.7, this function
        # should never returned an alias name
        return list(self._variable.keys())[list(self._variable.values()).index(rank)]

    def new_vector(self, name, list_variables):
        """
        Define a vector name from a list Of Variables. 3 variables are required in 3D and 2 variables in 2D.

grep term: "problems"

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

grep term: "Return"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/core/mesh.py (lines 2473-2547 · enclosing function/class)

class BoundingBox(list):
    def __init__(self, m: Mesh | list[np.ndarray[float], np.ndarray[float]]):
        if isinstance(m, Mesh):
            m = [m.nodes.min(axis=0), m.nodes.max(axis=0)]
        elif isinstance(m, list):
            if len(m) != 2:
                raise NameError("list lenght for BoundingBox object must be 2")
        else:
            raise NameError(
                "Can only create BoundingBox from Mesh object or list of 2 points"
            )

        list.__init__(self, m)

    @property
    def xmin(self) -> float:
        """Return xmin."""
        return self[0][0]

    @property
    def xmax(self) -> float:
        """Return xmax."""
        return self[1][0]

    @property
    def ymin(self) -> float:
        """Return ymin."""
        return self[0][1]

    @property
    def ymax(self) -> float:
        """Return ymax."""
        return self[1][1]

    @property
    def zmin(self) -> float:
        """Return zmin."""
        return self[0][2]

    @property
    def zmax(self) -> float:
        """Return zmax."""
        return self[1][2]

    @property
    def center(self) -> np.ndarray[float]:
        """Return the center of the bounding box."""
        return (self[0] + self[1]) / 2

    @property
    def volume(self) -> float:
        """Return the volume of the bounding box."""
        return (self[1] - self[0]).prod()

    @property
    def size(self) -> np.ndarray[float]:
        """Return the sizes of the bounding box."""
        return self[1] - self[0]

    @property
    def size_x(self) -> float:
        """Return the size of the bounding box in the x direction."""
        return self[1][0] - self[0][0]

    @property
    def size_y(self) -> float:
        """Return the size of the bounding box in the y direction."""
        return self[1][1] - self[0][1]

    @property
    def size_z(self) -> float:
        """Return the size of the bounding box in the z direction."""
        return self[1][2] - self[0][2]



## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/problem/non_linear.py (lines 95-112 · enclosing function/class)

    def get_disp(self, name="Disp"):
        """Return the displacement components.


        Parameters
        ----------
        name : str, optional
            Name of the variable to return. For instance, if name == 'DispX'
            return only the X component of displacement.

        Returns
        -------
        numpy.ndarray
        """
        if np.isscalar(self._dU) and self._dU == 0:
            return self._get_vect_component(self._U, name)
        return self._get_vect_component(self._U + self._dU, name)


## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/core/diffop.py (lines 47-58 · enclosing function/class)

    def __lt__(self, other):
        if isinstance(other, _Derivative):
            return (self.u_name, self.x, self.ordre) < (
                other.u_name,
                other.x,
                other.ordre,
            )
        elif np.isscalar(other):
            return False
        else:
            return NotImplemented

grep term: "Start"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/genindex.html (lines 1899-1947 · chunk range (no structural region))

      <ul>
        <li><a href="generated/fedoo.weakform.BeamEquilibrium.get_weak_equation.html#fedoo.weakform.BeamEquilibrium.get_weak_equation">(BeamEquilibrium method)</a>
</li>
        <li><a href="generated/fedoo.weakform.DistributedLoad.get_weak_equation.html#fedoo.weakform.DistributedLoad.get_weak_equation">(DistributedLoad method)</a>
</li>
        <li><a href="generated/fedoo.weakform.ExternalPressure.get_weak_equation.html#fedoo.weakform.ExternalPressure.get_weak_equation">(ExternalPressure method)</a>
</li>
        <li><a href="generated/fedoo.weakform.HeatEquation.get_weak_equation.html#fedoo.weakform.HeatEquation.get_weak_equation">(HeatEquation method)</a>
</li>
        <li><a href="generated/fedoo.weakform.HourglassStiffness.get_weak_equation.html#fedoo.weakform.HourglassStiffness.get_weak_equation">(HourglassStiffness method)</a>
</li>
        <li><a href="generated/fedoo.weakform.ImplicitDynamic.get_weak_equation.html#fedoo.weakform.ImplicitDynamic.get_weak_equation">(ImplicitDynamic method)</a>
</li>
        <li><a href="generated/fedoo.weakform.Inertia.get_weak_equation.html#fedoo.weakform.Inertia.get_weak_equation">(Inertia method)</a>
</li>
        <li><a href="generated/fedoo.weakform.InterfaceForce.get_weak_equation.html#fedoo.weakform.InterfaceForce.get_weak_equation">(InterfaceForce method)</a>
</li>
        <li><a href="generated/fedoo.weakform.PlateDrillingPenalty.get_weak_equation.html#fedoo.weakform.PlateDrillingPenalty.get_weak_equation">(PlateDrillingPenalty method)</a>
</li>
        <li><a href="generated/fedoo.weakform.PlateEquilibrium.get_weak_equation.html#fedoo.weakform.PlateEquilibrium.get_weak_equation">(PlateEquilibrium method)</a>
</li>
        <li><a href="generated/fedoo.weakform.PlateEquilibriumFI.get_weak_equation.html#fedoo.weakform.PlateEquilibriumFI.get_weak_equation">(PlateEquilibriumFI method)</a>
</li>
        <li><a href="generated/fedoo.weakform.PlateKirchhoffLoveEquilibrium.get_weak_equation.html#fedoo.weakform.PlateKirchhoffLoveEquilibrium.get_weak_equation">(PlateKirchhoffLoveEquilibrium method)</a>
</li>
        <li><a href="generated/fedoo.weakform.PlateShearEquilibrium.get_weak_equation.html#fedoo.weakform.PlateShearEquilibrium.get_weak_equation">(PlateShearEquilibrium method)</a>
</li>
        <li><a href="generated/fedoo.weakform.RotaryInertia.get_weak_equation.html#fedoo.weakform.RotaryInertia.get_weak_equation">(RotaryInertia method)</a>
</li>
        <li><a href="generated/fedoo.weakform.SpringEquilibrium.get_weak_equation.html#fedoo.weakform.SpringEquilibrium.get_weak_equation">(SpringEquilibrium method)</a>
</li>
        <li><a href="generated/fedoo.weakform.StressEquilibrium.get_weak_equation.html#fedoo.weakform.StressEquilibrium.get_weak_equation">(StressEquilibrium method)</a>
</li>
        <li><a href="generated/fedoo.weakform.StressEquilibriumMixed.get_weak_equation.html#fedoo.weakform.StressEquilibriumMixed.get_weak_equation">(StressEquilibriumMixed method)</a>
</li>
        <li><a href="generated/fedoo.weakform.StressEquilibriumRI.get_weak_equation.html#fedoo.weakform.StressEquilibriumRI.get_weak_equation">(StressEquilibriumRI method)</a>
</li>
      </ul></li>
      <li><a href="generated/fedoo.problem.ExplicitDynamic.get_X.html#fedoo.problem.ExplicitDynamic.get_X">get_X() (ExplicitDynamic method)</a>

      <ul>
        <li><a href="generated/fedoo.problem.Linear.get_X.html#fedoo.problem.Linear.get_X">(Linear method)</a>
</li>
        <li><a href="generated/fedoo.problem.LinearBuckling.get_X.html#fedoo.problem.LinearBuckling.get_X">(LinearBuckling method)</a>
</li>
        <li><a href="generated/fedoo.problem.LinearNewmark.get_X.html#fedoo.problem.LinearNewmark.get_X">(LinearNewmark method)</a>
</li>
        <li><a href="generated/fedoo.problem.Modal.get_X.html#fedoo.problem.Modal.get_X">(Modal method)</a>
</li>

grep term: "define"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 66819-67018 · enclosing doc section)

# Generate an area from the lines
area_id = mapdl.a(*lines)
*ENDPY
! Generate a line to define the extrusion path
*GET, KPNUMBER, KP, 0 ,NUM, MAX
*GET, LINENUMBER, LINE, 0, NUM, MAX
K   ,KPNUMBER+1
K   ,KPNUMBER+2,0           ,0           ,10
L   ,KPNUMBER+1,KPNUMBER+2
! Extrude the area generated in python using the line
! generated in APDL
*GET,AREANUMBER  ,AREA        ,0           ,NUM   , MAX
VDRAG,AREANUMBER,,,,,,LINENUMBER+1
! Display the volume
/show,png
/view,,1,1,1
vplot
Python Language Version 
*PYTHON (p. 1609) uses the 3.10 version of Python that is distributed with Mechanical APDL, in the
location v261/commonfiles/CPython. For documentation of this version of Python, see https://
docs.python.org/3.10/.
*PYTHON (p. 1609) in Distributed-memory Parallel (DMP) Mode 
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1610
*PYTHON

When running in DMP mode, the Python code inside the *PYTHON (p. 1609) block only executes
on the head compute node.
Python Variables 
You can add multiple *PYTHON (p. 1609) blocks in a Mechanical APDL input listing, and any local
Python variables defined in one block can be accessed from another block. However, when you
issue a /CLEAR (p. 357) command outside of a *PYTHON block, Python variables defined by all
previous *PYTHON (p. 1609) blocks will be cleared.
Exceptions 
If an exception is raised from within a *PYTHON (p. 1609) block, it causes an error in Mechanical
APDL, which may lead to program termination.
Using Python Packages 
By default, *PYTHON (p. 1609) uses a Python environment that includes PyMAPDL, PyDPF, and some
thirdparty libraries, such as numpy. You may want to use additional libraries that are not included
by default. Ordinarily, this is accomplished in Python by creating a virtual environment and installing
desired packages into that environment (https://docs.python.org/3/library/venv.html), but *PY-
THON (p. 1609) uses its own virtual environment to run within Mechanical APDL. To configure
Mechanical APDL to use a custom Python environment, follow these steps:
1. Prepare a requirements.txt file (/path/to/my-requirements.txt) that includes
the desired packages (https://pip.pypa.io/en/stable/reference/requirements-file-format/).
2. Specify a folder (/path/to/folder) to install the Python environment in. This folder
must not exist before running the following commands:
On Windows (PowerShell):
& '\path\to\v261\commonfiles\CPython\3_10\winx64\Release\python\python' -m venv '\path\to\folder'
& '\path\to\folder\Scripts\Activate.ps1'
On Linux:
'/path/to/v261/commonfiles/CPython/3_10/linx64/Release/python/bin/python' -m venv '/path/to/folder'
source '/path/to/folder/bin/activate'
3. Finally, install your dependencies:
pip install -r '/path/to/v261/ansys/site/mapdl-requirements.txt'
pip install –r '/path/to/my-requirements.txt'
A Python environment is identified by the folder in which it was installed. There is no limit to the
number of environments that can exist. However, Mechanical APDL can only use one of them. To point
Mechanical APDL to use an environment, set the environment variable MAPDL_PYTHON_ENV to the
folder identifying that environment.
Caution:
Do not install any packages directly to /path/to/commonfiles/CPython. You must
create a virtual Python environment (as described above) to avoid unintended affects to the
1611
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
*PYTHON

Python interpreter that is shared between several Ansys products, including Mechanical APDL
and the Mechanical application.
Using a *PYTHON (p. 1609) block in Mechanical APDL is a nonstandard use of the program. You are re-
sponsible for verifying that the results produced are accurate and the routines you introduce do not
adversely affect other, standard areas of the program. Exercise caution and engineering judgement and
verify your results.
Known Issues and Limitations
• *PYTHON (p. 1609) is not allowed inside of a *DO (p. 587) loop.
• To use matplotlib inside of *PYTHON, consider the following:
– In batch mode, matplotlib uses the system default backend and works as expected.
– In interactive mode, the default backend of matplotlib would conflict with the Mechanical
APDL GUI and result in a crash. To view plots using matplotlib while running the program in
interactive mode, you must choose the non-interactive "Agg" backend of matplotlib to redirect
all plotting commands in matplotlib to a file. See matplotlib documentation: Selecting a
backend.
– When running interactive mode on Windows in a terminal session with the -smp option en-
abled for shared-memory parallel processing, *PYTHON (p. 1609) is not supported.
Menu Paths
This command cannot be accessed from a menu.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1612
*PYTHON

Q Commands
QDVAL,TBLNO1,TBLNO2,SV1,SV2,SV3,SV4,SV5,SV6,SV7
Defines PSD quadspectral values.
SOLUTION (p.38):Spectrum Options (p.42)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
TBLNO1
First input PSD table number associated with this spectrum.
TBLNO2
Second input PSD table number associated with this spectrum.
SV1, SV2, SV3, . . . , SV7
PSD quadspectral values corresponding to the frequency points (PSDFRQ (p. 1579)).
Notes
Defines PSD quadspectral values to be associated with the previously defined frequency points. Repeat
QDVAL (p. 1613) command with the same table number for additional points. Unlike autospectra
(PSDVAL (p. 1584)), the quadspectra can be positive or negative. The quadspectral curve segment where
there is a sign change is interpolated linearly (the rest of the curve segments use log-log interpolation).
For better accuracy, choose as small a curve segment as possible wherever a sign change occurs.
Two table numbers are required since values are off-diagonal terms. This command is valid for SP-
OPT (p. 1908),PSD only.
This command is also valid in PREP7.
Menu Paths
Main Menu>Preprocessor>Loads>Load Step Opts>Spectrum>PSD>Correlation>Quadspectral
Main Menu>Solution>Load Step Opts>Spectrum>PSD>Correlation>Quadspectral
1613
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

QRDOPT,ReuseKey,--,--,SymMeth,CMCCoutKey
Specifies additional QRDAMP modal analysis options.
SOLUTION (p.38):Dynamic Options (p.41)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Product Restrictions (p.1182)
ReuseKey
Reuse key for method=QRDAMP specified in MODOPT (p. 1178) command.
ON
Reuse the symmetric eigensolution from the previous load steps or from the previous
solution.
OFF
Do not reuse (calculates symmetric eigensolution at current load step). This is the default.
--, --
Unused fields.
SymMeth
Mode-extraction method to be used for the symmetric eigenvalue problem.
LANB
Block Lanczos algorithm (default).
SUBSP
Subspace algorithm.
SNODE
Supernode algorithm.
CMCCoutKey
Complex Modal Contribution Coefficients (CMCC) output key. See Calculate the Complex Mode
Contribution Coefficients (CMCC) in the Structural Analysis Guide for details and usage.
ON
Output the CMCC to the text file Jobname.CMCC.
OFF
Do not output the CMCC. This is the default.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1614
QRDOPT

Notes
If the filename.modesym file exists in the working directory and ReuseKey = ON, filename.mod-
esym will be reused. If filename.modesym does not exist in the working directory, the symmetric
eigensolution will be calculated.
When ReuseKey=ON, both the new modal analysis (filename.modesym usage) and the preceding
modal analysis (filename.modesym generation) must be performed using the same product version
number.
Menu Paths
This command cannot be accessed from a menu.
QSOPT,Opt
Specifies quasi static radiation options.
SOLUTION (p.38):Radiosity (p.50)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Opt
Quasi static option:
OFF  
Do not run transient radiation problem to steady-state (default).
ON  
Run transient radiation problem to steady-state.
Notes
For more information on solving a static problem using a false transient approach, see Further Options
for Static Analysis in the Thermal Analysis Guide.
Menu Paths
Main Menu>Preprocessor>Loads>Load Step Opts>Time/Frequenc>Quasi-Static
Main Menu>Solution>Load Step Opts>Time/Frequenc>Quasi-Static
1615
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
QSOPT

QUAD,NODE1,NINTR,NODE2,NFILL,NSTRT,NINC,PKFAC
Generates a quadratic line of nodes from three nodes.
PREP7 (p.23):Nodes (p.32)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
NODE1
Begin fill-in from this node location. If NODE1 = P, graphical picking is enabled and all remaining
command fields are ignored (valid only in the GUI).
NINTR
Intermediate or guiding node. Quadratic curve will pass through this location. NINTR may have
any node number and any location. If the quadratic line also generates a node with number NINTR,
the generated location overrides the previous NINTR location.
NODE2
End quadratic fill-in at this node location.
NFILL
Fill-in NFILL nodes between NODE1 and NODE2 (defaults to |NODE2-NODE1|-1). NFILL must be
positive.

grep term: "space"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/genindex.html (lines 1749-1798 · chunk range (no structural region))

</li>
      </ul></li>
      <li><a href="generated/fedoo.constitutivelaw.CohesiveLaw.get_secant_matrix.html#fedoo.constitutivelaw.CohesiveLaw.get_secant_matrix">get_secant_matrix() (CohesiveLaw method)</a>
</li>
      <li><a href="generated/fedoo.constitutivelaw.ShellHomogeneous.get_shell_stiffness_matrix.html#fedoo.constitutivelaw.ShellHomogeneous.get_shell_stiffness_matrix">get_shell_stiffness_matrix() (ShellHomogeneous method)</a>

      <ul>
        <li><a href="generated/fedoo.constitutivelaw.ShellHomogeneousNonLinear.get_shell_stiffness_matrix.html#fedoo.constitutivelaw.ShellHomogeneousNonLinear.get_shell_stiffness_matrix">(ShellHomogeneousNonLinear method)</a>
</li>
        <li><a href="generated/fedoo.constitutivelaw.ShellLaminate.get_shell_stiffness_matrix.html#fedoo.constitutivelaw.ShellLaminate.get_shell_stiffness_matrix">(ShellLaminate method)</a>
</li>
        <li><a href="generated/fedoo.constitutivelaw.ShellLaminateNonLinear.get_shell_stiffness_matrix.html#fedoo.constitutivelaw.ShellLaminateNonLinear.get_shell_stiffness_matrix">(ShellLaminateNonLinear method)</a>
</li>
      </ul></li>
      <li><a href="generated/fedoo.constitutivelaw.ShellLaminate.get_shell_stiffness_matrix_FI.html#fedoo.constitutivelaw.ShellLaminate.get_shell_stiffness_matrix_FI">get_shell_stiffness_matrix_FI() (ShellLaminate method)</a>
</li>
      <li><a href="generated/fedoo.constitutivelaw.ShellLaminate.get_shell_stiffness_matrix_RI.html#fedoo.constitutivelaw.ShellLaminate.get_shell_stiffness_matrix_RI">get_shell_stiffness_matrix_RI() (ShellLaminate method)</a>
</li>
      <li><a href="generated/fedoo.weakform.ArtificialDamping.get_storage.html#fedoo.weakform.ArtificialDamping.get_storage">get_storage() (ArtificialDamping method)</a>

      <ul>
        <li><a href="generated/fedoo.weakform.BeamEquilibrium.get_storage.html#fedoo.weakform.BeamEquilibrium.get_storage">(BeamEquilibrium method)</a>
</li>
        <li><a href="generated/fedoo.weakform.DistributedLoad.get_storage.html#fedoo.weakform.DistributedLoad.get_storage">(DistributedLoad method)</a>
</li>
        <li><a href="generated/fedoo.weakform.ExternalPressure.get_storage.html#fedoo.weakform.ExternalPressure.get_storage">(ExternalPressure method)</a>
</li>
        <li><a href="generated/fedoo.weakform.HeatEquation.get_storage.html#fedoo.weakform.HeatEquation.get_storage">(HeatEquation method)</a>
</li>
        <li><a href="generated/fedoo.weakform.HourglassStiffness.get_storage.html#fedoo.weakform.HourglassStiffness.get_storage">(HourglassStiffness method)</a>
</li>
        <li><a href="generated/fedoo.weakform.ImplicitDynamic.get_storage.html#fedoo.weakform.ImplicitDynamic.get_storage">(ImplicitDynamic method)</a>
</li>
        <li><a href="generated/fedoo.weakform.Inertia.get_storage.html#fedoo.weakform.Inertia.get_storage">(Inertia method)</a>
</li>
        <li><a href="generated/fedoo.weakform.InterfaceForce.get_storage.html#fedoo.weakform.InterfaceForce.get_storage">(InterfaceForce method)</a>
</li>
        <li><a href="generated/fedoo.weakform.PlateDrillingPenalty.get_storage.html#fedoo.weakform.PlateDrillingPenalty.get_storage">(PlateDrillingPenalty method)</a>
</li>
        <li><a href="generated/fedoo.weakform.PlateEquilibrium.get_storage.html#fedoo.weakform.PlateEquilibrium.get_storage">(PlateEquilibrium method)</a>
</li>
        <li><a href="generated/fedoo.weakform.PlateEquilibriumFI.get_storage.html#fedoo.weakform.PlateEquilibriumFI.get_storage">(PlateEquilibriumFI method)</a>
</li>
        <li><a href="generated/fedoo.weakform.PlateKirchhoffLoveEquilibrium.get_storage.html#fedoo.weakform.PlateKirchhoffLoveEquilibrium.get_storage">(PlateKirchhoffLoveEquilibrium method)</a>
</li>
        <li><a href="generated/fedoo.weakform.PlateShearEquilibrium.get_storage.html#fedoo.weakform.PlateShearEquilibrium.get_storage">(PlateShearEquilibrium method)</a>
</li>
        <li><a href="generated/fedoo.weakform.RotaryInertia.get_storage.html#fedoo.weakform.RotaryInertia.get_storage">(RotaryInertia method)</a>
</li>
        <li><a href="generated/fedoo.weakform.SpringEquilibrium.get_storage.html#fedoo.weakform.SpringEquilibrium.get_storage">(SpringEquilibrium method)</a>

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/plate.py (lines 553-597 · enclosing function/class)

    def generalized_strain_operator(self):
        # membrane strain
        EpsX = self.space.derivative("DispX", "X")
        EpsY = self.space.derivative("DispY", "Y")
        GammaXY = self.space.derivative("DispX", "Y") + self.space.derivative(
            "DispY", "X"
        )

        # bending curvature
        XsiX = -self.space.derivative(
            "RotY", "X"
        )  # flexion autour de Y -> courbure suivant x
        XsiY = self.space.derivative(
            "RotX", "Y"
        )  # flexion autour de X -> courbure suivant y
        XsiXY = self.space.derivative("RotX", "X") - self.space.derivative("RotY", "Y")

        if self._mitc:
            # MITC4 Shear Strains (Using the derivative hack)
            # "_RotX" and "_RotY" returns the covarient matrix B associated to
            # RotX and Roty respectively. To force the spacial mapping (multiply by
            # that transform the local element coordinate to global space, we use
            # a derivative operator (hack of the fedoo assembly architecture)
            GammaXZ = (
                self.space.derivative("_DispZ", "X")
                + self.space.derivative("_RotY", "X")
                + self.space.derivative("_RotX", "X")
            )

            GammaYZ = (
                self.space.derivative("_DispZ", "Y")
                + self.space.derivative("_RotY", "Y")
                + self.space.derivative("_RotX", "Y")
            )
        else:
            # shear
            GammaXZ = self.space.derivative("_DispZ", "X") + self.space.variable(
                "_RotY"
            )
            GammaYZ = self.space.derivative("_DispZ", "Y") - self.space.variable(
                "_RotX"
            )

        return [EpsX, EpsY, GammaXY, XsiX, XsiY, XsiXY, GammaXZ, GammaYZ]


## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/beam.py (lines 44-54 · enclosing function/class)

    def __init__(
        self,
        material,
        A=None,
        Jx=None,
        Iyy=None,
        Izz=None,
        k=0,
        name="",
        nlgeom=None,
        space=None,

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/core/modelingspace.py (lines 9-74 · enclosing function/class)

    def __init__(self, dimension, name="Main"):
        """
        Space in which are defined the coordinates and variables (ie functions over coordinates).
        A modeling space is required to be able to define weak equations.

        Parameters
        ----------
        dimension: str in ['2D', '3D', '2Dplane' or '2Dstress']
            Type of modeling space.
            * '2D' or '2Dplane': general 2D problems, with default coordinates 'X' and 'Y' and plane strain assumption
            * '3D' for 3D problems with default coordinates 'X', 'Y' and 'Z'
            * '2Dstress': same as '2D' but using plane stress assumption for mechanical problems
            * '2Daxi': same as '2D' but using axisymmetric assumption for mechanical problems
        name: str, default = 'Main'
            The name of the modeling space

        Example
        --------
        Create a new empty 2D modeling space with plane stress assumption
        >>> import fedoo as fd
        >>> fd.ModelingSpace('2Dstress')
        >>> print(fd.ModelingSpace['Main'].ndim)
        """

        assert isinstance(
            dimension, str
        ), "The dimension value must be a string: '2D', '3D', '2Dplane' or '2Dstress'."
        if dimension == "2D":
            dimension = "2Dplane"
        assert (
            dimension == "3D"
            or dimension == "2Dplane"
            or dimension == "2Dstress"
            or dimension == "2Daxi"
        ), "Dimension must be '2D', '3D', 2Dplane', '2Dstress' or '2Daxi'"

        # Static attributs
        ModelingSpace._active = self
        ModelingSpace.__dic[name] = self

        self.__name = name

        # coordinates
        self._coordinate = {}  # dic containing all the coordinate related to the modeling space
        self._ncrd = 0

        # variables
        self._variable = {}  # attribut statique de la classe
        self._nvar = 0
        self._vector = {}  # dic of vectors containing the variable name
        self._rank_vector = {}  # dict of vectors containing the var rank

        # dimension
        if dimension == "2D":
            dimension = "2Dplane"
        self._dimension = dimension

        self.new_coordinate("X")
        self.new_coordinate("Y")

        if dimension == "3D":
            self.__ndim = 3
            self.new_coordinate("Z")
        if dimension in ["2Dplane", "2Dstress", "2Daxi"]:
            self.__ndim = 2

grep term: "weak"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/genindex.html (lines 760-809 · chunk range (no structural region))

        <li><a href="generated/fedoo.constraint.Pressure.copy.html#fedoo.constraint.Pressure.copy">(Pressure method)</a>
</li>
        <li><a href="generated/fedoo.weakform.RotaryInertia.copy.html#fedoo.weakform.RotaryInertia.copy">(RotaryInertia method)</a>
</li>
        <li><a href="generated/fedoo.weakform.SpringEquilibrium.copy.html#fedoo.weakform.SpringEquilibrium.copy">(SpringEquilibrium method)</a>
</li>
        <li><a href="generated/fedoo.weakform.StressEquilibrium.copy.html#fedoo.weakform.StressEquilibrium.copy">(StressEquilibrium method)</a>
</li>
        <li><a href="generated/fedoo.weakform.StressEquilibriumMixed.copy.html#fedoo.weakform.StressEquilibriumMixed.copy">(StressEquilibriumMixed method)</a>
</li>
        <li><a href="generated/fedoo.weakform.StressEquilibriumRI.copy.html#fedoo.weakform.StressEquilibriumRI.copy">(StressEquilibriumRI method)</a>
</li>
        <li><a href="generated/fedoo.constraint.SurfaceForce.copy.html#fedoo.constraint.SurfaceForce.copy">(SurfaceForce method)</a>
</li>
      </ul></li>
      <li><a href="generated/fedoo.weakform.StressEquilibrium.corate.html#fedoo.weakform.StressEquilibrium.corate">corate (StressEquilibrium property)</a>

      <ul>
        <li><a href="generated/fedoo.weakform.StressEquilibriumMixed.corate.html#fedoo.weakform.StressEquilibriumMixed.corate">(StressEquilibriumMixed property)</a>
</li>
        <li><a href="generated/fedoo.weakform.StressEquilibriumRI.corate.html#fedoo.weakform.StressEquilibriumRI.corate">(StressEquilibriumRI property)</a>
</li>
      </ul></li>
      <li><a href="generated/fedoo.time.CentralDifference.correct.html#fedoo.time.CentralDifference.correct">correct() (CentralDifference method)</a>

      <ul>
        <li><a href="generated/fedoo.time.ExplicitGeneralizedAlpha.correct.html#fedoo.time.ExplicitGeneralizedAlpha.correct">(ExplicitGeneralizedAlpha method)</a>
</li>
        <li><a href="generated/fedoo.time.ExplicitNewmark.correct.html#fedoo.time.ExplicitNewmark.correct">(ExplicitNewmark method)</a>
</li>
      </ul></li>
      <li><a href="generated/fedoo.core.BoundaryCondition.create.html#fedoo.core.BoundaryCondition.create">create() (BoundaryCondition static method)</a>

      <ul>
        <li><a href="generated/fedoo.constraint.DistributedForce.create.html#fedoo.constraint.DistributedForce.create">(DistributedForce static method)</a>
</li>
        <li><a href="generated/fedoo.constraint.Pressure.create.html#fedoo.constraint.Pressure.create">(Pressure static method)</a>
</li>
        <li><a href="generated/fedoo.constraint.SurfaceForce.create.html#fedoo.constraint.SurfaceForce.create">(SurfaceForce static method)</a>
</li>
      </ul></li>
      <li><a href="generated/fedoo.constraint.Contact.current.html#fedoo.constraint.Contact.current">current (Contact attribute)</a>

      <ul>
        <li><a href="generated/fedoo.constraint.DistributedForce.current.html#fedoo.constraint.DistributedForce.current">(DistributedForce attribute)</a>
</li>
        <li><a href="generated/fedoo.constraint.IPCContact.current.html#fedoo.constraint.IPCContact.current">(IPCContact attribute)</a>
</li>
        <li><a href="generated/fedoo.constraint.IPCSelfContact.current.html#fedoo.constraint.IPCSelfContact.current">(IPCSelfContact attribute)</a>
</li>

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/weak_form.html (lines 1-49 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="./">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Weak Formulation (fedoo.weakform) &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="_static/sg_gallery-dataframe.css?v=2082cf3c" />
      <link rel="stylesheet" type="text/css" href="_static/sg_gallery-rendered-html.css?v=1277b6f3" />
      <link rel="stylesheet" type="text/css" href="_static/sphinx-design.min.css?v=95c83b7e" />
      <link rel="stylesheet" type="text/css" href="_static/custom.css?v=26864b79" />

  
      <script src="_static/jquery.js?v=5d32c60e"></script>
      <script src="_static/_sphinx_javascript_frameworks_compat.js?v=2cd50e6c"></script>
      <script src="_static/documentation_options.js?v=8d563738"></script>
      <script src="_static/doctools.js?v=9bcbadda"></script>
      <script src="_static/sphinx_highlight.js?v=dc90522c"></script>
      <script src="_static/sg-tags.js?v=d80f6fa4"></script>
      <script src="_static/design-tabs.js?v=f930bc37"></script>
      <script async="async" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <script src="_static/js/theme.js"></script>
    <link rel="index" title="Index" href="genindex.html" />
    <link rel="search" title="Search" href="search.html" />
    <link rel="next" title="fedoo.weakform.StressEquilibrium" href="generated/fedoo.weakform.StressEquilibrium.html" />
    <link rel="prev" title="fedoo.constitutivelaw.ThermalProperties.is_initialized" href="generated/fedoo.constitutivelaw.ThermalProperties.is_initialized.html" /> 
</head>

<body class="wy-body-for-nav"> 
  <div class="wy-grid-for-nav">
    <nav data-toggle="wy-nav-shift" class="wy-nav-side">
      <div class="wy-side-scroll">
        <div class="wy-side-nav-search"  style="background: #24445C" >

          
          
          <a href="index.html">
            
              <img src="_static/fedoo_logos_ss_fond.png" class="logo" alt="Logo"/>
          </a>
<div role="search">
  <form id="rtd-search-form" class="wy-form" action="search.html" method="get">
    <input type="text" name="q" placeholder="Search docs" aria-label="Search docs" />

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.HourglassStiffness.get_weak_equation.html (lines 1-14 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.weakform.HourglassStiffness.get_weak_equation &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-dataframe.css?v=2082cf3c" />

grep term: "Static"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/genindex.html (lines 471-520 · chunk range (no structural region))

</li>
        <li><a href="generated/fedoo.constraint.Pressure.assemble_global_mat.html#fedoo.constraint.Pressure.assemble_global_mat">(Pressure method)</a>
</li>
        <li><a href="generated/fedoo.constraint.SelfContact.assemble_global_mat.html#fedoo.constraint.SelfContact.assemble_global_mat">(SelfContact method)</a>
</li>
        <li><a href="generated/fedoo.constraint.SurfaceForce.assemble_global_mat.html#fedoo.constraint.SurfaceForce.assemble_global_mat">(SurfaceForce method)</a>
</li>
      </ul></li>
      <li><a href="assembly.html#fedoo.Assembly">Assembly (class in fedoo)</a>
</li>
      <li><a href="generated/fedoo.problem.ExplicitDynamic.assembly.html#fedoo.problem.ExplicitDynamic.assembly">assembly (ExplicitDynamic property)</a>

      <ul>
        <li><a href="generated/fedoo.problem.Linear.assembly.html#fedoo.problem.Linear.assembly">(Linear property)</a>
</li>
        <li><a href="generated/fedoo.problem.LinearBuckling.assembly.html#fedoo.problem.LinearBuckling.assembly">(LinearBuckling property)</a>
</li>
        <li><a href="generated/fedoo.problem.LinearNewmark.assembly.html#fedoo.problem.LinearNewmark.assembly">(LinearNewmark property)</a>
</li>
        <li><a href="generated/fedoo.problem.Modal.assembly.html#fedoo.problem.Modal.assembly">(Modal property)</a>
</li>
        <li><a href="generated/fedoo.problem.NonLinear.assembly.html#fedoo.problem.NonLinear.assembly">(NonLinear property)</a>
</li>
      </ul></li>
      <li><a href="generated/fedoo.constraint.Contact.associated_assembly_sum.html#fedoo.constraint.Contact.associated_assembly_sum">associated_assembly_sum (Contact attribute)</a>

      <ul>
        <li><a href="generated/fedoo.constraint.DistributedForce.associated_assembly_sum.html#fedoo.constraint.DistributedForce.associated_assembly_sum">(DistributedForce attribute)</a>
</li>
        <li><a href="generated/fedoo.constraint.IPCContact.associated_assembly_sum.html#fedoo.constraint.IPCContact.associated_assembly_sum">(IPCContact attribute)</a>
</li>
        <li><a href="generated/fedoo.constraint.IPCSelfContact.associated_assembly_sum.html#fedoo.constraint.IPCSelfContact.associated_assembly_sum">(IPCSelfContact attribute)</a>
</li>
        <li><a href="generated/fedoo.LagrangeMultiplierAssembly.associated_assembly_sum.html#fedoo.LagrangeMultiplierAssembly.associated_assembly_sum">(LagrangeMultiplierAssembly attribute)</a>
</li>
        <li><a href="generated/fedoo.constraint.MeanValueConstraint.associated_assembly_sum.html#fedoo.constraint.MeanValueConstraint.associated_assembly_sum">(MeanValueConstraint attribute)</a>
</li>
        <li><a href="generated/fedoo.constraint.Pressure.associated_assembly_sum.html#fedoo.constraint.Pressure.associated_assembly_sum">(Pressure attribute)</a>
</li>
        <li><a href="generated/fedoo.constraint.SelfContact.associated_assembly_sum.html#fedoo.constraint.SelfContact.associated_assembly_sum">(SelfContact attribute)</a>
</li>
        <li><a href="generated/fedoo.constraint.SurfaceForce.associated_assembly_sum.html#fedoo.constraint.SurfaceForce.associated_assembly_sum">(SurfaceForce attribute)</a>
</li>
      </ul></li>
  </ul></td>
</tr></table>

<h2 id="B">B</h2>
<table style="width: 100%" class="indextable genindextable"><tr>
  <td style="width: 33%; vertical-align: top;"><ul>
</rag-context>