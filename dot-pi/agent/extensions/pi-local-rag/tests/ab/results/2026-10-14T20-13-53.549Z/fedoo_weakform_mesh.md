<rag-context>
[pi-local-rag] RAG subagent: 5 sources, 235449 ms retrieval.
# fedoo — StressEquilibrium weak form & 2D rectangular mesh

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium.py — StressEquilibrium class (lines 17–112)

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
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium.py — incompressibility attribute (lines 741–792)

```python
    @property
    def incompressibility(self):
        """Method used to avoid volumetric locking.

        Nearly incompressible materials lead to volumetric locking with the
        standard displacement formulation. The available methods are:
            * None (default): standard displacement formulation.
            * "auto": use the most suitable method for each type of element
              (currently "mean_dilatation" where available). The standard
              formulation is kept with a warning for elements without any
              available method ("tri3", "tet4", ...).
            * "mean_dilatation": mean dilatation method (B-bar method based on
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
            * "sri": legacy small-strain B-bar method where the dilatation is
              evaluated at the element center, for "quad4" and "hex8"
              elements only. Its use with updated-Lagrangian finite strains
              emits a warning because the formulation is not consistent.
            * "fbar": F-bar method where the volume change is evaluated at the
              element center. The consistent non symmetric tangent matrix is
              used for "quad4" and "hex8" elements (not available for '2Daxi'
              and with the total lagrangian method). In small strain, it
              reduces to a center-based B-bar volumetric correction.

        This attribute should be defined before the creation of the associated
        assembly. Elements with constant strain ("tri3", "tet4") or
        reduced integration elements are not improved by these methods: see
        :py:class:`fedoo.weakform.StressEquilibriumMixed` or
        :py:class:`fedoo.weakform.StressEquilibriumRI`. Incompressibility
        treatments are ignored with the plane-stress assumption.
        """
        return self._incompressibility

    @incompressibility.setter
    def incompressibility(self, value):
        if isinstance(value, str):
            value = value.lower()
        if value not in _INCOMPRESSIBILITY_ELEMENTS:
            raise ValueError(
                "incompressibility should be None, 'auto', 'mean_dilatation', "
                f"'sri' or 'fbar'. Got {value!r}."
            )
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium_mixed.py — StressEquilibriumMixed (near-incompressibility)

```python
"""Mixed Stress Equilibrium weak form."""

from fedoo.weakform.stress_equilibrium import (
    StressEquilibrium,
    _check_F_validity,
    _comp_grad_disp,
)
import numpy as np


class StressEquilibriumMixed(StressEquilibrium):
    """
    Mixed displacement/pressure weak formulation for solid mec...
    """
```

(Used for nearly incompressible materials when standard displacement-based anti-locking methods are not improved, e.g. constant-strain elements "tri3"/"tet4" or reduced-integration elements — see the `incompressibility` docstring above.)

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/__init__.py — 2D mesh builders (lines 100–110)

```python
from .structured_mesh import (
    structured_mesh_2D,
    generate_nodes,
    hole_plate_mesh,
    disk_mesh,
    hollow_disk_mesh,
    I_shape_mesh,
)

from fedoo.util.localframe import generate_cylindrical_local_frame
```

`fedoo.mesh.rectangle_mesh` is also a mesh builder exposed at the top level (documented as "Surface mesh of a rectangle", alongside `line_mesh` for 1D meshes).

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/structured_mesh.py — structured 2D mesh example: hole_plate_mesh (lines 247–348)

```python
def hole_plate_mesh(
    nr=11,
    nt=11,
    length=100,
    height=100,
    radius=20,
    elm_type="quad4",
    sym=False,
    include_node_sets=True,
    ndim=None,
    name="",
):
    """
    Create a mesh of a 2D plate with a hole

    Parameters
    ----------
    nr, nt: int
        Numbers of nodes in the radial and tangent direction from the hole (default = 11).
        nt is the number of nodes of the half of an exterior edge
    length, height : int,float
        The length and height of the plate (default : 100).
    radius : int, float, tuple
        The radius of the hole (default : 20).
        If tuple = (a,b), a and b are the ellipse radius along x and y axis.

    elm_type: {'quad4', 'quad9', 'tri3', 'tri6', 'quad8'}
        The type of the element generated (default='quad4')
    Sym: bool
        Sym = True, if only the returned mesh assume symetric condition and
        only the quarter of the plate is returned (default=False)
    include_node_sets : bool
        if True (default), the boundary nodes are included in the mesh node_sets dict.
    ndim: int, optional
        dimension of the generated mesh. By default, the returned mesh will be in 2d.
    name: str, optional
        Name of the returned mesh.

    Returns
    -------
    Mesh
        The generated geometry in Mesh format. See the Mesh class for more details.

    See Also
    --------
    line_mesh: 1D mesh of a line
    rectangle_mesh: Surface mesh of a rectangle
    """
    ...
```

This shows the typical signature of fedoo's 2D structured mesh builders (number of nodes in each direction, overall length/height, element type, optional ndim) — the same pattern as `rectangle_mesh` for a plain rectangular surface mesh.
</rag-context>