<rag-context>
[pi-local-rag] RAG subagent: 3 sources, 43087 ms retrieval.
# StressEquilibrium weak form — retrieved sources (partial)

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibrium.html — page header (lines 1-47)

The class documentation page exists in the index. Only boilerplate was retrieved before the run budget ended:

```html
<title>fedoo.weakform.StressEquilibrium &mdash; Fedoo 1.0.0 (stable)</title>
...
<link rel="next" title="fedoo.weakform.StressEquilibrium.copy" href="fedoo.weakform.StressEquilibrium.copy.html" />
<link rel="prev" title="Weak Formulation (fedoo.weakform)" href="../weak_form.html" />
```

Related pages confirmed in the index (not retrieved): `fedoo.weakform.StressEquilibrium.nlgeom.html`, `fedoo.weakform.StressEquilibrium.incompressibility.html`, `fedoo.weakform.StressEquilibrium.geometric_stiffness.html`, `fedoo.weakform.StressEquilibriumMixed.html`.

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium.py — module docstring (from search preview)

```
"""The Strain equilibrium weak form from the fedoo finite element code."""

import warnings

from fedoo.core.weakform import WeakFormBase
from fedoo.core.base import ConstitutiveLaw, InvalidKinematicStateError
from fedoo.core.time_evolution import SECOND_ORDER
from fedoo.lib_elements.element_base im...
```

### Note

The retrieved excerpts contain only page boilerplate and the module import block; they do NOT include the actual StressEquilibrium attribute documentation (`nlgeom`, `incompressibility`, etc.) or any 2D rectangular mesh builder example. A follow-up retrieval over the `fedoo.weakform.StressEquilibrium.nlgeom` / `.incompressibility` pages and `mesh.rst` / `Mesh.rst` is needed to complete the answer.
</rag-context>