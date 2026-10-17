<rag-context>
[pi-local-rag] RAG subagent: 1 sources, 1969 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/weakform/implicit_dynamic.py (lines 178-271 · enclosing function/class)

class ImplicitDynamic(ImplicitDynamicSum):
    r"""Weak formulation for implicit dynamic problems.

    Constructs a dynamic weak formulation by combining internal forces
    (stiffness matrix) with inertia (mass matrix). Time integration is
    performed using the Newmark-beta scheme.

    By default, the **Constant Average Acceleration** method is used
    (:math:`\gamma=0.5, \beta=0.25`), which is unconditionally stable
    and energy-preserving.

    Parameters
    ----------
    constitutivelaw : str, ConstitutiveLaw, WeakForm
        Defines the internal forces (stiffness).

        * If a string or ``ConstitutiveLaw`` is given, a
          :class:`fedoo.weakform.StressEquilibrium` instance is created.
        * If a ``WeakForm`` is given, it is used as the stiffness component.
    density : float, ndarray, or WeakForm
        Defines the mass inertia component.

        * A float or array gives the material density at Gauss points.
        * A ``WeakForm`` provides a custom mass formulation.
    beta : float, default=0.25
        Newmark integration parameter :math:`\beta`. Controls the acceleration
        variation over the time step.
    gamma : float, default=0.5
        Newmark integration parameter :math:`\gamma`. Controls numerical
        damping.
    name : str, optional
        Name of the weak form.
    nlgeom : bool or {'UL', 'TL'}, optional
        Geometric-nonlinearity formulation. ``True`` and ``"UL"`` select the
        updated Lagrangian method; ``"TL"`` selects the total Lagrangian
        method.
    space : ModelingSpace, optional
        Modeling space. Defaults to the active modeling space.

    Notes
    -----
    * The method is unconditionally stable if :math:`\gamma \ge 0.5` and
      :math:`\beta \ge 0.25(\gamma + 0.5)^2`.
    * Use :math:`\gamma > 0.5` to introduce algorithmic damping.
    * Physical Rayleigh damping can be set through
      :attr:`rayleigh_damping`.

    Example
    -------
    .. code-block:: python

        wf = fd.weakform.ImplicitDynamic(material, density)
        wf.rayleigh_damping = [alpha, beta]
    """

    def __init__(
        self,
        constitutivelaw,
        density,
        beta=0.25,
        gamma=0.5,
        name="",
        nlgeom=False,
        space=None,
    ):
        # Newmark = generalized-alpha with alpha_m = alpha_f = 0: warn on a
        # conditionally stable (beta, gamma) pair (e.g. gamma=0.6 with the
        # default-looking beta=0.25) -- see warn_if_conditionally_stable.
        warn_if_conditionally_stable(beta, gamma, context="ImplicitDynamic")
        if isinstance(constitutivelaw, WeakFormBase):
            stiffness_weakform = constitutivelaw
        else:
            stiffness_weakform = StressEquilibrium(
                constitutivelaw,
                name="",
                nlgeom=nlgeom,
                space=space,
            )
        parent = type(stiffness_weakform)

        class NewmarkStiffness(_NewmarkStiffness, parent):
            pass

        stiffness_weakform.__class__ = NewmarkStiffness
        _NewmarkStiffness.__init__(stiffness_weakform, beta, gamma)

        time_integration = _NewmarkInertia(density, beta, gamma, "", nlgeom, space)
        # assume_sym is left unset so that both children share the same
        # assembly grouping key (merged assembly); the stiffness weakform
        # decides it at initialize (True except UL, where the Lie tangent is
        # not major-symmetric).
        super().__init__([stiffness_weakform, time_integration], name)
</rag-context>