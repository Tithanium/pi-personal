<rag-context>
[pi-local-rag] RAG subagent: 2 sources, 199 ms retrieval.
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



## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/weakform/implicit_dynamic.py (lines 272-421 · sibling function/class)

class ImplicitDynamic2(WeakFormBase):
    r"""Weak formulation for implicit dynamic problems.

    Alternative implementation of ImplicitDynamic WeakForm.
    Kept only for debug purpose. Should give exatly the same results.
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
        super().__init__(name, space)

        if self.space.is_axisymmetric:
            raise NotImplementedError(
                "ImplicitDynamic2 is not implemented in '2Daxi'. "
                "Use the ImplicitDynamic class (which builds an "
                "ImplicitDynamicSum from _NewmarkStiffness + _NewmarkInertia) "
                "instead — that path correctly applies the 2*pi*r weight."
            )

        if name != "":
            stiffness_name = name + "_stiffness"
        else:
            stiffness_name = ""

        self.stiffness_weakform = StressEquilibrium(
            constitutivelaw,
            name=stiffness_name,
            nlgeom=nlgeom,
            space=space,
        )
        self.constitutivelaw = self.stiffness_weakform.constitutivelaw
        warn_if_conditionally_stable(beta, gamma, context="ImplicitDynamic2")
        self.beta = beta
        self.gamma = gamma
        self.density = density
        self.__nlgeom = nlgeom

        self.rayleigh_damping = None
        """list of float, optional
        Coefficients :math:`[a, b]` for Rayleigh damping. 
        
        - :math:`a`: Mass-proportional term.
        - :math:`b`: Stiffness-proportional term.
        
        Used to form :math:`C = aM + bK`. Defaults to ``None``.
        """

        self.assembly_options["assume_sym"] = True

    def initialize(self, assembly, pb):
        self.stiffness_weakform.initialize(assembly, pb)
        assembly.sv_type["Velocity"] = "Node"
        assembly.sv_type["Acceleration"] = "Node"
        assembly.sv_type["_DeltaDisp"] = "Node"
        assembly.sv["Velocity"] = 0
        assembly.sv["Acceleration"] = 0
        assembly.sv["Velocity_GP"] = np.zeros((self.space.ndim, 1))
        assembly.sv["Acceleration_GP"] = np.zeros((self.space.ndim, 1))
        assembly.sv["_DeltaDisp"] = np.zeros((self.space.ndim, 1))
        assembly.sv["_DeltaDisp_GP"] = np.zeros((self.space.ndim, 1))

    def update(self, assembly, pb):
        self.stiffness_weakform.update(assembly, pb)
        assembly.sv["_DeltaDisp"] = pb._dU.reshape(-1, pb.mesh.n_nodes)
        assembly.sv["_DeltaDisp_GP"] = assembly.convert_data(
            assembly.sv["_DeltaDisp"], convert_from="Node", convert_to="GaussPoint"
        )

    def update_2(self, assembly, pb):
        self.stiffness_weakform.update_2(assembly, pb)

    def to_start(self, assembly, pb):
        self.stiffness_weakform.to_start(assembly, pb)

    def set_start(self, assembly, pb):
        dt = pb.dtime
        # deferred import: fedoo.time.common imports weak forms
        from fedoo.time.common import increment_solved

        if increment_solved(pb) and not (
            np.isscalar(pb.get_disp()) and pb.get_disp() == 0
        ):
            # update velocity and acceleration
            new_acceleration = (1 / (self.beta * dt**2)) * (
                assembly.sv["_DeltaDisp"] - dt * assembly.sv["Velocity"]
            ) - 1 / self.beta * (0.5 - self.beta) * assembly.sv["Acceleration"]

            assembly.sv["Velocity"] += dt * (
                (1 - self.gamma) * assembly.sv["Acceleration"]
                + self.gamma * new_acceleration
            )

            assembly.sv["Acceleration"] = new_acceleration

            assembly.sv["Velocity_GP"] = assembly.convert_data(
                assembly.sv["Velocity"], convert_from="Node", convert_to="GaussPoint"
            )
            assembly.sv["Acceleration_GP"] = assembly.convert_data(
                assembly.sv["Acceleration"],
                convert_from="Node",
                convert_to="GaussPoint",
            )
            # reset acumulated displacement
            assembly.sv["_DeltaDisp"] = np.zeros((self.space.ndim, 1))
            assembly.sv["_DeltaDisp_GP"] = np.zeros((self.space.ndim, 1))

        self.stiffness_weakform.set_start(assembly, pb)

    def get_weak_equation(self, assembly, pb):
        op_dU = self.space.op_disp()  # displacement increment (incremental formulation)
        op_dU_vir = [du.virtual if du != 0 else 0 for du in op_dU]
        dt = pb.dtime
        if dt == 0:
            return self.stiffness_weakform.get_weak_equation(assembly, pb)
        elif self.rayleigh_damping is None:
            delta_disp = assembly.sv["_DeltaDisp_GP"]

            acceleration = assembly.sv["Acceleration_GP"]
            velocity = assembly.sv["Velocity_GP"]

            diff_op = self.stiffness_weakform.get_weak_equation(assembly, pb)

            new_acceleration = (1 / (self.beta * dt**2)) * (
                delta_disp - dt * velocity
            ) + (1 - 0.5 / self.beta) * acceleration  # gp values

            diff_op += sum(
                [
                    op_dU_vir[i]
                    * (
                        op_dU[i] * (self.density / (self.beta * dt**2))
                        + self.density * new_acceleration[i]
                    )
                    if op_dU_vir[i] != 0
                    else 0
                    for i in range(self.space.ndim)
                ]
            )
        else:
            # need nodes values in this case
            delta_disp = assembly.sv["_DeltaDisp"]
</rag-context>