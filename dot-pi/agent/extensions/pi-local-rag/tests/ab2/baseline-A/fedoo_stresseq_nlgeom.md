<rag-context>
[pi-local-rag] RAG subagent: 3 sources, 78308 ms retrieval.
# StressEquilibrium weak form & nlgeom parameter (Fedoo)

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/weakform/stress_equilibrium.py — class StressEquilibrium (docstring + __init__, lines 17–117)

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
        ...
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
```

Note on how nlgeom drives the weak equation (`get_weak_equation`, same file, lines 135–199):
```python
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
            ...
```
(i.e. TL adds the initial-displacement/initial-PK2-stress effect based on the initial mesh; the UL / True branch uses the updated Cauchy stress.)

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium_ri.py — class StressEquilibriumRI (nlgeom parameter, lines 229–296)

```python
class StressEquilibriumRI(WeakFormSum):
    """Stress-equilibrium weak form with reduced integration.
    ...
    Parameters
    ----------
    ...
    nlgeom : bool or {'UL', 'TL'}, optional
        Geometric-nonlinearity formulation used by the stress-equilibrium
        term. ``True`` and ``"UL"`` select the updated Lagrangian method;
        ``"TL"`` selects the total Lagrangian method.
    nlgeom_hourglass : bool or {'UL', 'TL'}, default=False
        Geometric-nonlinearity formulation used by the hourglass term.
        Keeping this false generally gives accurate results, including for
        finite-strain problems.
    ...
    """

    def __init__(
        self,
        constitutivelaw,
        hourglass_stiffness=0.01,
        convert_tangent=True,
        name="",
        nlgeom=None,
        nlgeom_hourglass=False,
        space=None,
    ):
        equilibrium = StressEquilibrium(
            constitutivelaw,
            convert_tangent=convert_tangent,
            nlgeom=nlgeom,
            space=space,
        )
        ...
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/examples/01-simple/simple_cantilever_beam_3D_model_nlgeom.py — working example using nlgeom=True (lines 1–52)

```python
"""
3D Canteleaver Beam with geometric nonlinearities
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
"""

import fedoo as fd

# --------------- Pre-Treatment --------------------------------------------------------

fd.ModelingSpace("3D")

# Units: N, mm, MPa
mesh = fd.mesh.box_mesh(
    nx=31,
    ny=7,
    nz=7,
    x_min=0,
    x_max=1000,
    y_min=0,
    y_max=100,
    z_min=0,
    z_max=100,
    elm_type="hex8",
    name="Domain",
)

# Material definition
fd.constitutivelaw.ElasticIsotrop(200e3, 0.3, name="ElasticLaw")
wf = fd.weakform.StressEquilibrium("ElasticLaw", nlgeom=True)

# Assembly (print the time required for assembling)
assemb = fd.Assembly.create(wf, mesh, "hex8", name="Assembling")

# Type of problem
pb = fd.problem.NonLinear("Assembling")

# Boundary conditions
nodes_left = mesh.find_nodes("X", mesh.bounding_box.xmin)
nodes_load = mesh.find_nodes(
    f"X=={mesh.bounding_box.xmax} and Y=={mesh.bounding_box.ymax}"
)

pb.bc.add("Dirichlet", nodes_left, "Disp", 0)
pb.bc.add("Dirichlet", nodes_load, "DispY", -500)

# --------------- Solve --------------------------------------------------------
pb.nlsolve(dt=0.2)

# #--------------- Post-Treatment -----------------------------------------------
res = pb.get_results("Assembling", ["Stress", "Disp"])
res.plot("Stress", "XX", "Node", show_edges=False)
```
</rag-context>