<rag-context>
[pi-local-rag] RAG subagent: 3 sources, 71022 ms retrieval.
### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibrium.html — StressEquilibrium class definition and parameters

```
class StressEquilibrium(constitutivelaw, incompressibility=None, convert_tangent=True, name='', nlgeom=None, space=None)
```

Mechanical equilibrium equation for solids.

The main point to consider are:
- This weak form can be used for solid in 3D or using a 2D plane assumption (plane strain or plane stress).
- Include initial stress for non linear problems or if defined in the associated assembly.
- This weak form accepts geometrical non linearities if simcoon is installed. (nlgeom should be in {True, 'UL', 'TL'}. In this case the initial displacement is also considered and several different corotational formulation may be used by setting the corate attribute.)
- For nearly incompressible material, a method to avoid the volumetric locking should be selected with the incompressibility attribute.
- The consistent geometric stiffness is enabled automatically for finite-strain tangent conversion. Set `geometric_stiffness` explicitly to override that default.

Parameters:
- **constitutivelaw** (*ConstitutiveLaw name (str) or ConstitutiveLaw object*) – Material Constitutive Law (fedoo.constitutivelaw)
- **incompressibility** (*str, optional*) – Method used to avoid the volumetric locking of nearly incompressible materials. See the `incompressibility` attribute. By default (None), the standard displacement formulation is used.
- **convert_tangent** (*bool, default=True*) – Convert the constitutive corotational Kirchhoff tangent to the formulation tangent (`dS/dE` for TL, spatial Lie for UL). Set to False only when the constitutive law already returns that final formulation-dependent tangent.
- **name** (*str*) – name of the WeakForm
- **nlgeom** (*bool, 'UL' or 'TL', optional*) – If True, the geometrical non linearities are activate based on the updated lagrangian method. This parameters is used only in the context of NonLinearProblems such as `fedoo.problem.NonLinearStatic` or `fedoo.problem.NonLinearNewmark`. If nlgeom == 'UL' the updated lagrangian method is used (same as True). If nlgeom == 'TL' the total lagrangian method is used. If not defined, the problem.nlgeom parameter is used instead.
- **space** (*ModelingSpace*) – Modeling space associated to the weakform. If None is specified, the active ModelingSpace is considered.

Related attributes:
- `StressEquilibrium.convert_tangent` – Whether Fedoo converts the finite-strain constitutive tangent.
- `StressEquilibrium.corate` – Corotational strain mesure for strain.
- `StressEquilibrium.geometric_stiffness` – Whether to add geometric effects to the stiffness matrix.
- `StressEquilibrium.incompressibility` – incompressibility handling option.
- `StressEquilibrium.nlgeom` – geometric nonlinearity flag.

Sister weak forms for incompressible solids: `fedoo.weakform.StressEquilibriumRI` and `fedoo.weakform.StressEquilibriumMixed`.

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.rectangle_mesh.html — fedoo.mesh.rectangle_mesh

```
rectangle_mesh(nx=11, ny=11, x_min=0, x_max=1, y_min=0, y_max=1, elm_type='quad4', ndim=None, name='')
```

Create a rectangular Mesh.

Parameters:
- **nx** (*int*) – Numbers of nodes in the x and y axes (default = 11).
- **ny** (*int*) – Numbers of nodes in the x and y axes (default = 11).
- **x_min** (*int, float*) – The boundary of the square (default : 0, 1, 0, 1).
- **x_max** (*int, float*) – The boundary of the square (default : 0, 1, 0, 1).
- **y_min** (*int, float*) – The boundary of the square (default : 0, 1, 0, 1).
- **y_max** (*int, float*) – The boundary of the square (default : 0, 1, 0, 1).
- **elm_type** (*{'tri3', 'quad4', 'quad8', 'quad9'}*) – The type of the element generated (default='quad4')
  - 'tri3' – 3 node linear triangular mesh
  - 'tri6' – 6 node linear triangular mesh
  - 'quad4' – 4 node quadrangular mesh
  - 'quad8' – 8 node quadrangular mesh (à tester)
  - 'quad9' – 9 node quadrangular mesh

Returns: The generated geometry in Mesh format. See the Mesh class for more details. (Return type: `Mesh`)

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/__init__.py — mesh builder imports

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

Other mesh creation functions listed in the docs: `fedoo.mesh.box_mesh`, `fedoo.mesh.disk_mesh`, `fedoo.mesh.hole_plate_mesh`, `fedoo.mesh.hollow_disk_mesh`, `fedoo.mesh.I_shape_mesh`, `fedoo.mesh.line_mesh_1D`, `fedoo.mesh.line_mesh`, `fedoo.mesh.line_mesh_cylindric`, `fedoo.mesh.circle_mesh`, `fedoo.mesh.grid_mesh_cylindric`, `fedoo.mesh.structured_mesh_2D`, `fedoo.mesh.generate_nodes`.
</rag-context>