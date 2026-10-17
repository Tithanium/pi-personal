<rag-context>
[pi-local-rag] RAG subagent: 3 sources, 4810 ms retrieval.
### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Exemples_fedoo/03-advanced/README.rst (lines 1-4 · enclosing doc section)

Advanced problems
-----------------

This section show some advanced capabilities of fedoo.

### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Code_source_fedoo/fedoo/constraint/periodic_bc.py (lines 1391-1462 · enclosing function/class)

    def initialize(self, problem, dic_closest_points_on_boundaries=None):
        if problem.space.is_axisymmetric:
            raise NotImplementedError(
                "PeriodicBC does not support the '2Daxi' ModelingSpace: "
                "translational periodicity in the (r, z) plane is not "
                "well-defined for an axisymmetric body of revolution."
            )
        # Use stored dictionary if none provided explicitly
        if dic_closest_points_on_boundaries is None:
            dic_closest_points_on_boundaries = self._dic_closest_points_on_boundaries
        """
        Initialize a periodic boundary condition object using several multi-point constraints. The constraint drivers are constructed as follows, depending on `periodicity_type` and `dim`:
        - For `periodicity_type="small_strain"`:
            - dim=1:
                - `global_dof` is created for ['E_xx'] (1 DOF).
                - `node_cd = [problem.virtual_dof['E_xx']]`
                - `var_cd = ['E_xx']`
            - dim=2:
                - `virtual_dof` is created for ['E_xx', 'E_yy', 'E_xy'] (3 DOF).
                - `node_cd = [[problem.virtual_dof['E_xx'], problem.virtual_dof['E_xy']], [problem.virtual_dof['E_xy'], problem.virtual_dof['E_yy']]]`
                - `var_cd = [['Virtual', 'Virtual'], ['Virtual', 'Virtual']]`
            - dim=3:
                - `virtual_dof` is created for ['E_xx', 'E_yy', 'E_zz', 'E_xy', 'E_xz', 'E_yz'] (6 DOF).
                - `node_cd = [[problem.virtual_dof['E_xx'], problem.virtual_dof['E_xy'], problem.virtual_dof['E_xz']], [problem.virtual_dof['E_xy'], problem.virtual_dof['E_yy'], problem.virtual_dof['E_yz']], [problem.virtual_dof['E_xz'], problem.virtual_dof['E_yz'], problem.virtual_dof['E_zz']]]`
                - `var_cd = [['Virtual', 'Virtual', 'Virtual'], ['Virtual', 'Virtual', 'Virtual'], ['Virtual', 'Virtual', 'Virtual']]`
        - For `periodicity_type="finite_strain"`:
            - dim=1:
                - `virtual_dof` is created for ['DU_xx'] (1 DOF).
                - `node_cd = [problem.virtual_dof['DU_xx']]`
                - `var_cd = ['Virtual']`
            - dim=2:
                - `virtual_dof` is created for ['DU_xx', 'DU_xy', 'DU_yx', 'DU_yy'] (4 DOF).
                - `node_cd = [[problem.virtual_dof['DU_xx'], problem.virtual_dof['DU_xy']], [problem.virtual_dof['DU_yx'], problem.virtual_dof['DU_yy']]]`
                - `var_cd = [['Virtual', 'Virtual'], ['Virtual', 'Virtual']]`
            - dim=3:
                - `virtual_dof` is created for ['DU_xx', 'DU_xy', 'DU_xz', 'DU_yx', 'DU_yy', 'DU_yz', 'DU_zx', 'DU_zy', 'DU_zz'] (9 DOF).
                - `node_cd = [[problem.virtual_dof['DU_xx'], problem.virtual_dof['DU_xy'], problem.virtual_dof['DU_xz']], [problem.virtual_dof['DU_yx'], problem.virtual_dof['DU_yy'], problem.virtual_dof['DU_yz']], [problem.virtual_dof['DU_zx'], problem.virtual_dof['DU_zy'], problem.virtual_dof['DU_zz']]]`
                - `var_cd = [['Virtual', 'Virtual', 'Virtual'], ['Virtual', 'Virtual', 'Virtual'], ['Virtual', 'Virtual', 'Virtual']]`
        The `node_cd` and `var_cd` structures define the virtual DOFs and their associated variables for the constraint drivers, depending on the periodicity type and dimension.

        """
        mesh = problem.mesh
        res = None

        periodicity = self.meshperio

        if periodicity:
            self._prepare_periodic_lists(mesh, self.tol)
            if self.off_axis_rotation is None:
                res = self._list_MPC_periodic()
            if self.off_axis_rotation is not None:
                res = ListBC([self._list_MPC_rotation(), self._list_MPC_periodic()])
                # res = ListBC([self._list_MPC_periodic(), self._list_MPC_rotation()])
        else:
            if dic_closest_points_on_boundaries is None:
                raise ValueError(
                    "dic_closest_points_on_boundaries is required when meshperio=False. "
                    "Use microgen.BoxMesh.closest_points_on_boundaries() to generate it."
                )
            else:
                self._construct_faces_edges_corners_from_dic_non_periodic_node_distance(
                    dic_closest_points_on_boundaries,
                    dic_closest_points_on_boundaries.get("rve_size", None),
                )
                res = self._list_MPC_non_periodic_node_distance()

        # Enforce continuity of rotation DOFs (RotX, RotY, RotZ) if present
        self._add_additional_rot_dof(problem, res, lambda key: self.boundary_nodes[key])

        res.initialize(problem)
        self.list_mpc = res


### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.constitutivelaw.ElastoPlasticity.hardening_function_derivative.html (lines 1-14 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.constitutivelaw.ElastoPlasticity.hardening_function_derivative &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-dataframe.css?v=2082cf3c" />
</rag-context>