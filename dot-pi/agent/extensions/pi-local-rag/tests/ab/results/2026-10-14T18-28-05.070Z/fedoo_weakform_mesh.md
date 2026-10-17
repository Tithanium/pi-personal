<rag-context>
[pi-local-rag] RAG subagent: 1 sources, 120013 ms retrieval.
# fedoo: StressEquilibrium weak form + 2D rectangular mesh builders

## 1. StressEquilibrium weak form (solid mechanical equilibrium)

Source: `C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium.py`

```python
"""The Strain equilibrium weak form from the fedoo finite element code."""

import warnings

from fedoo.core.weakform import WeakFormBase
from fedoo.core.base import ConstitutiveLaw, InvalidKinematicStateError
from fedoo.core.time_evolution import SECOND_ORDER
from fedoo.lib_elements.element_base im...
```

## 2. Mixed displacement/pressure form (near-incompressibility)

Source: `C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium_mixed.py`

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

## 3. 2D rectangular mesh builders (to be filled)

See `fedoo.mesh.mesh_g` / mesh builders documentation (`Mesh.rst`, `mesh.rst`).
</rag-context>