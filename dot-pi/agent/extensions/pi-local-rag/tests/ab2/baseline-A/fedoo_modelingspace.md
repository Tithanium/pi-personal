<rag-context>
[pi-local-rag] RAG subagent: 4 sources, 85914 ms retrieval.
### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/core/modelingspace.py — ModelingSpace.__init__ (lines 9-74)

```python
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
```

Class header (lines 3-8):

```python
class ModelingSpace:
    # __ModelingSpace = {"Main"}
    _active = None
    __dic = {}  # dic containing all the modeling spaces
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/examples/FE2/FE2.py — working example: 2D plane + 3D spaces (lines 1-46, key part)

```python
import fedoo as fd
import numpy as np
import os

# Define the Modeling Space - Here 2D problem with plane stress assumption.
fd.ModelingSpace("2Dplane", "macro_space")
fd.ModelingSpace("3D", "micro_space")

# Generate a simple structured mesh "Domain" (plate with a hole).
mesh_macro = fd.mesh.hole_plate_mesh(
    nr=3,
    nt=3,
    length=100,
    height=100,
    radius=20,
    elm_type="quad4",
    sym=True,
    name="macro",
)

mesh_micro = fd.mesh.import_file("octet_surf.msh", name="micro")["tet4"]

...
fd.weakform.StressEquilibrium("ConstitutiveLaw", name="micro_wf", space="micro_space")

micro_assembly = fd.Assembly.create("micro_wf", mesh_micro)
...
# Create the weak formulation of the mechanical equilibrium equation
fd.weakform.StressEquilibrium("FEM", name="WeakForm")

# Create a global assembly
macro_assembly = fd.Assembly.create(
    "WeakForm", "macro", name="Assembly", mesh_change=True
)

# Define a new static problem
pb = fd.problem.NonLinear("Assembly")
...
pb.nlsolve()
```

Note the `space="micro_space"` keyword used when creating a weak form in a non-active modeling space, versus the default (active) space used for "WeakForm".

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/examples/01-simple/simpleBeamElementExample.py — working example: 3D modeling space (lines 8-15)

```python
import fedoo as fd
import numpy as np

E = 1e5
nu = 0.3

fd.ModelingSpace("3D")
fd.constitutivelaw.ElasticIsotrop(E, nu, name="ElasticLaw")
...
pb = fd.problem.Linear("beam")
...
pb.solve()
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/docs/quick_start.rst — Steps to define and solve a Problem (lines 4-17)

```
Steps to define and solve a Problem
___________________________________

The main steps to define a problem are:

1. Import the fedoo library
2. Define the space dimension 
3. Create and/or import the geometry (mesh)
4. Define one or many weak formulations (including constitutive equations)
5. Create the Assembly associated to the weak formulations and the mesh
6. Define the type of Problem (Static, Dynamic, ...) and the solver
7. Solve the Problem
8. Analyse and export results (vizualisation with Paraview recommanded)
```
</rag-context>