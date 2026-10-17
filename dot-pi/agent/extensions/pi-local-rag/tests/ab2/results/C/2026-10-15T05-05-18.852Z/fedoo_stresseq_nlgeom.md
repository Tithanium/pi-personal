<rag-context>
[pi-local-rag] RAG subagent: 3 sources, 2697 ms retrieval.
### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/weakform/inertia.py (lines 92-109 · enclosing function/class)

    def get_weak_equation(self, assembly, pb):
        if self.space.ndim == 2:
            op_rot = [self.space.variable("RotZ")]
        else:
            op_rot = [
                self.space.variable("RotX"),
                self.space.variable("RotY"),
                self.space.variable("RotZ"),
            ]
        op_rot_vir = [op.virtual if op != 0 else 0 for op in op_rot]

        return sum(
            [
                a * b * inertia
                for (inertia, a, b) in zip(self.rotary_inertia, op_rot_vir, op_rot)
            ]
        )


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


### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibrium.incompressibility.html (lines 30-30 · chunk range (no structural region))

    <link rel="next" title="fedoo.weakform.StressEquilibrium.name" href="fedoo.weakform.StressEquilibrium.name.html" />
</rag-context>