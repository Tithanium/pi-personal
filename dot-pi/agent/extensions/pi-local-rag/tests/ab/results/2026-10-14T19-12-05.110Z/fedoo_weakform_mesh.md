<rag-context>
[pi-local-rag] RAG subagent: 1 sources, 107326 ms retrieval.
# Fedoo: StressEquilibrium weak form and 2D rectangular mesh builders

## C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibrium.html — fedoo.weakform.StressEquilibrium

```
fedoo.weakform.StressEquilibrium — Fedoo 1.0.0 (stable)

* [Weak Formulation (fedoo.weakform)](../weak_form.html)
* fedoo.weakform.StressEquilibrium
* View page source

Contents:
* Overview
* Installation
* Quick Start
* Geometry and Mesh (fedoo.mesh)
* Constitutive Law (fedoo.constitutivelaw)
* Weak Formulation (fedoo.weakform)
    * fedoo.weakform.StressEquilibrium
        * fedoo.weakform.StressEquilibrium.copy
        * fedoo.weakform.StressEquilibrium.get_all
        * fedoo.weakform.StressEquilibrium.get_dissipation
```

## C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium_mixed.py — Mixed Stress Equilibrium weak form (near-incompressibility / mixed formulation)

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
```

## C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibrium.nlgeom.html — Geometric nonlinearity flag

```
fedoo.weakform.StressEquilibrium.nlgeom — Fedoo 1.0.0 (stable)

* fedoo.weakform.StressEquilibrium
* fedoo.weakform.StressEquilibrium.nlgeom
```

## C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibrium.geometric_stiffness.html — Geometric stiffness

```
fedoo.weakform.StressEquilibrium.geometric_stiffness — Fedoo 1.0.0 (stable)

* fedoo.weakform.StressEquilibrium
* fedoo.weakform.StressEquilibrium.geometric_stiffness
```

## C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.hole_plate_mesh.html — 2D rectangular mesh builder (fedoo.mesh.rectangle_mesh)

```
1D mesh of a line

[rectangle_mesh](fedoo.mesh.rectangle_mesh.html#fedoo.mesh.rectangle_mesh "fedoo.mesh.rectangle_mesh")

Surface mesh of a rectangle
```

## C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/__init__.py — Structured mesh builder exports

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
</rag-context>