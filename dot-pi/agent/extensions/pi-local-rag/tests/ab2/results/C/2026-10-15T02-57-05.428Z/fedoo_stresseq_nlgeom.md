<rag-context>
[pi-local-rag] RAG subagent: 3 sources, 2874 ms retrieval.
### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/weakform/stress_equilibrium_mixed.py (lines 1-48 · chunk range (no structural region))

"""Mixed Stress Equilibrium weak form."""

from fedoo.weakform.stress_equilibrium import (
    StressEquilibrium,
    _check_F_validity,
    _comp_grad_disp,
)
import numpy as np


class StressEquilibriumMixed(StressEquilibrium):
    """
    Mixed displacement/pressure weak formulation for solid mechanics.

    This weak formulation is suitable for nearly incompressible materials.
    It introduces a pressure variable to treat the volumetric behavior
    separately from the deviatoric behavior, avoiding volumetric locking.

    The element formulation should satisfy the LBB condition (e.g. Q2-Q1 or
    P1+/P1).

    Parameters
    ----------
    constitutivelaw: ConstitutiveLaw
        Material constitutive law.
    name: str, optional
        Name of the weak form.
    nlgeom: bool, optional
        Non-linear geometry flag.
    bulk_modulus: float, optional
        Bulk modulus used for scaling the pressure equation. If None, it
        is estimated from the tangent matrix trace.
        Note: This is used for scaling the pressure constraint equation.
    convert_tangent: bool, default=True
        Convert the constitutive corotational Kirchhoff tangent to the
        formulation tangent.
    space: ModelingSpace, optional
        Modeling space.

    Attributes
    ----------
    symmetrized_matrix : bool
        Only used when nlgeom is False.
        If True, the deviatoric tangent is computed using the symmetric
        projection (P:H:P) to ensure a symmetric displacement stiffness block.
        If False, a single projection (P:H) is used. Default is True.
    """


### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/weakform/stress_equilibrium_ri.py (lines 275-283 · enclosing function/class)

    def __init__(
        self,
        constitutivelaw,
        hourglass_stiffness=0.01,
        convert_tangent=True,
        name="",
        nlgeom=None,
        nlgeom_hourglass=False,
        space=None,

### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Exemples_fedoo/01-simple/simple_cantilever_beam_3D_model_nlgeom.py (lines 1-52 · whole file (short script))

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
</rag-context>