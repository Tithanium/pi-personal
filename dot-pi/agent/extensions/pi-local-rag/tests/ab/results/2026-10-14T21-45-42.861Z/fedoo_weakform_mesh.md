<rag-context>
[pi-local-rag] RAG subagent: 8 sources, 216590 ms retrieval.
# Fedoo: StressEquilibrium weak form + 2D rectangular mesh

## 1. Definition of the weak form (StressEquilibrium)

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium.py — class StressEquilibrium (lines 17–199)

```python
class StressEquilibrium(WeakFormBase):
    """Mechanical equilibrium equation for solids.

    The main point to consider are:
      * This weak form can be used for solid in 3D or using a 2D plane
        assumption (plane strain or plane stress).
      * Include initial stress for non linear problems or if defined in
        the associated assembly.
      * This weak form accepts geometrical non linearities if simcoon is
        installed. (nlgeom should be in {True, 'UL', 'TL'}. In this case
        the initial displacement is also considered and several different
        corotational formulation may be used by setting the corate attribute.
      * For nearly incompressible material, a method to avoid the volumetric
        locking should be selected with the incompressibility attribute.
      * The consistent geometric stiffness is enabled automatically for
        finite-strain tangent conversion. Set ``geometric_stiffness``
        explicitly to override that default.

    Parameters
    ----------
    constitutivelaw: ConstitutiveLaw name (str) or ConstitutiveLaw object
        Material Constitutive Law (:mod:`fedoo.constitutivelaw`)
    incompressibility: str, optional
        Method used to avoid the volumetric locking of nearly incompressible
        materials. See the :py:attr:`incompressibility` attribute.
        By default (None), the standard displacement formulation is used.
    convert_tangent: bool, default=True
        Convert the constitutive corotational Kirchhoff tangent to the
        formulation tangent (``dS/dE`` for TL, spatial Lie for UL). Set to
        False only when the constitutive law already returns that final
        formulation-dependent tangent.
    name: str
        name of the WeakForm
    nlgeom: bool, 'UL' or 'TL', optional
        If True, the geometrical non linearities are activate based on the
        updated lagrangian method. This parameters is used only in the
        context of NonLinearProblems such as
        :mod:`fedoo.problem.NonLinearStatic` or
        :mod:`fedoo.problem.NonLinearNewmark`.
        If nlgeom == 'UL' the updated lagrangian method is used (same as True).
        If nlgeom == 'TL' the total lagrangian method is used.
        If not defined, the problem.nlgeom parameter is used instead.
    space: ModelingSpace
        Modeling space associated to the weakform. If None is specified,
        the active ModelingSpace is considered.
    """

    def __init__(
        self,
        constitutivelaw,
        incompressibility=None,
        convert_tangent=True,
        name="",
        nlgeom=None,
        space=None,
    ):
        if isinstance(constitutivelaw, str):
            constitutivelaw = ConstitutiveLaw[constitutivelaw]

        WeakFormBase.__init__(self, name, space)

        self.space.new_variable("DispX")
        self.space.new_variable("DispY")
        if self.space.ndim == 3:
            self.space.new_variable("DispZ")
            self.space.new_vector("Disp", ("DispX", "DispY", "DispZ"))
        else:  # 2D assumed
            self.space.new_vector("Disp", ("DispX", "DispY"))

        self.constitutivelaw = constitutivelaw
        # Tag a second-order (dynamic) evolution. The mass term is resolved from
        # the material density (or an explicit set_inertia) at integrator
        # compile time, so a set_density() call made after the weakform is built
        # is still honored, and the inertia stays absent for static analyses.
        self.time_evolution = SECOND_ORDER

        self.nlgeom = nlgeom
        """Method used to treat the geometric non linearities.
            * Set to False if geometric non linarities are ignored.
            * Set to True or 'UL' to use the updated lagrangian method
              (update the mesh)
            * Set to 'TL' to use the total lagrangian method (base on the
              initial mesh with initial displacement effet)
        """

        self.corate = "log_r"
        # 'log_r' (default): logarithmic strain with the exact polar frame
        # increment DR = R1 R0^T — the corate whose tangent transport is
        # exact in simcoon, including with rotated internal-variable history.
        # Other options: 'log' (XBM), 'jaumann', 'green_naghdi'/'gn',
        # 'log_inc', 'log_r_inc'...

        # by default, no treatment of the volumetric locking
        self._incompressibility_elm_types = []
        self.incompressibility = incompressibility
        self.convert_tangent = convert_tangent
        self.geometric_stiffness = None

        # assume_sym is decided at initialize time: True for linear / TL
        # (symmetric tangent), False for UL where the Lie spatial tangent is
        # not major-symmetric. A user-set value takes precedence.

    def get_weak_equation(self, assembly, pb):
        """Get the weak equation related to the current problem state."""
        if assembly._nlgeom == "TL":  # add initial displacement effect
            eps = self.space.op_strain(assembly.sv["DispGradient"])
            initial_stress = assembly.sv["PK2"]
        else:
            eps = self.space.op_strain()
            initial_stress = assembly.sv[
                "Stress"
            ]  # Stress = Cauchy for updated lagrangian method

            if self.space.is_axisymmetric:
                rr = assembly.sv["_R_gausspoints"]

                # nlgeom = False
                eps[2] = self.space.variable("DispX") * np.divide(
                    1, rr, out=np.zeros_like(rr), where=rr != 0
                )  # put zero if X==0 (division by 0)
                # eps[2] = self.space.variable('DispX') * (1/rr)

        H = assembly.sv["TangentMatrix"]

        dilatation_correction = self._get_dilatation_correction_op(assembly)
        if dilatation_correction is not None:
            return self._get_weak_equation_bbar(
                assembly, eps, H, initial_stress, dilatation_correction
            )

        sigma = [
            sum([0 if eps[j] == 0 else eps[j] * H[i][j] for j in range(6)])
            for i in range(6)
        ]

        DiffOp = sum(
            [0 if eps[i] == 0 else eps[i].virtual * sigma[i] for i in range(6)]
        )

        if not (np.isscalar(initial_stress) and initial_stress == 0):
            # this term doesnt seem to improve convergence in general !
            if self.geometric_stiffness:
                DiffOp = DiffOp + sum(
                    [
                        0
                        if self._nl_strain_op_vir[i] == 0
                        else self._nl_strain_op_vir[i] * initial_stress[i]
                        for i in range(6)
                    ]
                )

            DiffOp = DiffOp + sum(
                [
                    0 if eps[i] == 0 else eps[i].virtual * initial_stress[i]
                    for i in range(6)
                ]
            )

        if self.incompressibility == "fbar":
            DiffOp = DiffOp + self._get_fbar_tangent_op(
                assembly, eps, H, initial_stress
            )

        if self.space.is_axisymmetric:
            DiffOp = DiffOp * ((2 * np.pi) * rr)

        return DiffOp
```

## 2. Near-incompressibility (volumetric locking) options

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibrium.incompressibility.html — attribute doc (lines 156–198)

```
property StressEquilibrium.incompressibility

Method used to avoid volumetric locking.

Nearly incompressible materials lead to volumetric locking with the
standard displacement formulation. The available methods are:

- None (default): standard displacement formulation.
- "auto": use the most suitable method for each type of element
  (currently "mean_dilatation" where available). The standard
  formulation is kept with a warning for elements without any
  available method ("tri3", "tet4", …).
- "mean_dilatation": mean dilatation method (B-bar method based on
  a volume weighted projection of the dilatation). Equivalent to
  a mixed formulation with element-wise discontinuous pressure and
  dilatation that are eliminated at the element level: the problem
  only contains the displacement and the tangent matrix remains
  symmetric. One pressure value per element is used for "quad4",
  "hex8", "wed6", "tri6" and "tet10" elements, and a linear pressure
  for "quad8", "quad9", "hex20", "wed15" and "wed18" elements.
  The number of gauss points should be higher than the number of
  pressure values (no effect with reduced integration).
  Available in small strain and with the updated lagrangian
  method. The geometric_stiffness attribute should be set to True
  to get the consistent tangent matrix in finite strain.
- "sri": legacy small-strain B-bar method where the dilatation is
  evaluated at the element center, for "quad4" and "hex8"
  elements only. Its use with updated-Lagrangian finite strains
  emits a warning because the formulation is not consistent.
- "fbar": F-bar method where the volume change is evaluated at the
  element center. The consistent non symmetric tangent matrix is
  used for "quad4" and "hex8" elements (not available for '2Daxi'
  and with the total lagrangian method). In small strain, it
  reduces to a center-based B-bar volumetric correction.

This attribute should be defined before the creation of the associated
assembly. Elements with constant strain ("tri3", "tet4") or
reduced integration elements are not improved by these methods: see
fedoo.weakform.StressEquilibriumMixed or
fedoo.weakform.StressEquilibriumRI. Incompressibility
treatments are ignored with the plane-stress assumption.
```

## 3. 2D rectangular mesh builder

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/simple.py — def rectangle_mesh (lines 24–200)

```python
def rectangle_mesh(
    nx=11,
    ny=11,
    x_min=0,
    x_max=1,
    y_min=0,
    y_max=1,
    elm_type="quad4",
    ndim=None,
    name="",
):
    """
    Create a rectangular Mesh

    Parameters
    ----------
    nx, ny : int
        Numbers of nodes in the x and y axes (default = 11).
    x_min, x_max, y_min, y_max : int,float
        The boundary of the square (default : 0, 1, 0, 1).
    elm_type : {'tri3', 'quad4', 'quad8', 'quad9'}
        The type of the element generated (default='quad4')

        * 'tri3' -- 3 node linear triangular mesh
        * 'tri6' -- 6 node linear triangular mesh
        * 'quad4' -- 4 node quadrangular mesh
        * 'quad8' -- 8 node quadrangular mesh (à tester)
        * 'quad9' -- 9 node quadrangular mesh

    Returns
    -------
    Mesh
        The generated geometry in Mesh format. See the Mesh class for more details.

    See Also
    --------
    line_mesh : 1D mesh of a line
    rectangle_mesh : Surface mesh of a rectangle
    box_mesh : Volume mesh of a box
    grid_mesh_cylindric : Surface mesh of a grid in cylindrical coodrinate
    line_mesh_cylindric : Line mesh in cylindrical coordinate
    """

    if elm_type == "quad9" or elm_type == "tri6":
        nx = int(nx // 2 * 2 + 1)
        ny = int(ny // 2 * 2 + 1)  # pour nombre impair de noeuds
    X, Y = np.meshgrid(np.linspace(x_min, x_max, nx), np.linspace(y_min, y_max, ny))
    crd = np.c_[np.reshape(X, (-1, 1)), np.reshape(Y, (-1, 1))]
    ...
    # elm construction per elm_type (quad8 / quad4 / quad9 / tri3 / tri6) ...
    elm = np.array(elm)

    if elm_type != "quad8":
        N = len(crd)
        node_sets = {
            "bottom": [nd for nd in range(nx)],
            "top": [nd for nd in range(N - nx, N)],
            "left": [nd for nd in range(0, N, nx)],
            "right": [nd for nd in range(nx - 1, N, nx)],
        }
    ...
    return Mesh(crd, elm, elm_type, node_sets, {}, ndim, name)
```

Note the node_sets `bottom`/`top`/`left`/`right` are generated automatically — useful for applying Dirichlet/Neumann BCs.

## 4. Working example combining StressEquilibrium + rectangle_mesh + incompressibility + nlgeom

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/examples/03-advanced/incompressibility_comparison.py — near-incompressible Cook membrane (lines 45–186)

```python
fd.ModelingSpace("2Dplane")

YOUNG_MODULUS = 200.0
POISSON_RATIO = 0.499
YIELD_STRESS = 2.0
...
NX = 17
NY = 17

FORMULATIONS = {
    "Full integration": None,
    "Mean dilatation": "mean_dilatation",
    "F-bar": "fbar",
    "Reduced integration": "reduced_integration",
}

def cook_mesh(name):
    """Create a structured Cook membrane mesh by mapping a unit square."""
    mesh = fd.mesh.rectangle_mesh(
        nx=NX,
        ny=NY,
        x_min=0.0,
        x_max=1.0,
        y_min=0.0,
        y_max=1.0,
        elm_type="quad4",
        name=name,
    )
    ...
    return mesh

def solve_formulation(label, method):
    """Solve one formulation and return history and final plotting data."""
    ...
    mesh = cook_mesh(f"cook_{key}")

    material = fd.constitutivelaw.ElastoPlasticity(
        YOUNG_MODULUS,
        POISSON_RATIO,
        YIELD_STRESS,
    )
    ...

    if method == "reduced_integration":
        weakform = fd.weakform.StressEquilibriumRI(material, nlgeom="UL")
    else:
        weakform = fd.weakform.StressEquilibrium(
            material,
            nlgeom="UL",
            incompressibility=method,
        )

    assembly = fd.Assembly.create(weakform, mesh, name=f"assembly_{key}")
    problem = fd.problem.NonLinear(assembly)
    problem.set_nr_criterion(
        "Displacement",
        err0=1.0,
        tol=2e-4,
        max_subiter=25,
    )

    left = mesh.find_nodes("X", 0.0)
    right = mesh.find_nodes("X", 48.0)
    problem.bc.add("Dirichlet", left, "Disp", 0.0)
    ...
    problem.bc.add("Neumann", right, "DispY", TOTAL_SHEAR_FORCE * weights)
    ...
    problem.nlsolve(
        dt=0.1,
        tmax=1.0,
        update_dt=True,
        dt_max=0.1,
        print_info=0,
        interval_output=0.1,
    )
```

Also indexed as a related working example: `C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/examples/03-advanced/neohookean_cantilever.py` ("Finite-strain Neo-Hookean cantilever (rigid cap) — A slender, nearly-incompressible cylinder is clamped at its base and bent by a transverse load applied to a rigid cap tied to its top face.")
</rag-context>