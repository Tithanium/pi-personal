<rag-context>
[pi-local-rag] RAG subagent: 1 sources, 120014 ms retrieval.
# fedoo — StressEquilibrium weak form & 2D rectangular mesh

## StressEquilibrium weak form (source)
`C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium.py`
```
"""The Strain equilibrium weak form from the fedoo finite element code."""

import warnings

from fedoo.core.weakform import WeakFormBase
from fedoo.core.base import ConstitutiveLaw, InvalidKinematicStateError
from fedoo.core.time_evolution import SECOND_ORDER
from fedoo.lib_elements.element_base import ...
```
_(to be expanded)_

## Mixed / near-incompressible formulation (source)
`.../fedoo/weakform/stress_equilibrium_mixed.py`
```
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
_(to be expanded)_

## Near-incompressibility example
`.../examples/03-advanced/incompressibility_comparison.py`
```
"""
Nearly incompressible plasticity: four element formulations
...
Nearly incompressible materials are difficult for low-order displacement
elements.  A fully integrated ``quad4`` element constrains the volume change at
four Gauss points alt...
```
_(to be expanded)_

## 2D rectangular mesh builder
_(pending)_
</rag-context>