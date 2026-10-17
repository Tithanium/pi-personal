<rag-context>
[pi-local-rag] RAG subagent: 28 sources, 30312 ms retrieval.
grep term: "StressEquilibrium"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibrium.html (lines 48-97 · chunk range (no structural region))

    <input type="text" name="q" placeholder="Search docs" aria-label="Search docs" />
    <input type="hidden" name="check_keywords" value="yes" />
    <input type="hidden" name="area" value="default" />
  </form>
</div>
        </div><div class="wy-menu wy-menu-vertical" data-spy="affix" role="navigation" aria-label="Navigation menu">
<p style="padding: 0.5em 1.618em; margin-bottom: 0;">
  <a href="https://3mah.github.io/" style="color: #d9d9d9; font-weight: bold; text-decoration: none;">
    &larr; Back to 3MAH
  </a>
</p>
<hr style="border-color: #4e4e4e; margin: 0.5em 1.618em;">

              <p class="caption" role="heading"><span class="caption-text">Contents:</span></p>
<ul class="current">
<li class="toctree-l1"><a class="reference internal" href="../overview.html">Overview</a></li>
<li class="toctree-l1"><a class="reference internal" href="../install.html">Installation</a></li>
<li class="toctree-l1"><a class="reference internal" href="../quick_start.html">Quick Start</a></li>
<li class="toctree-l1"><a class="reference internal" href="../mesh.html">Geometry and Mesh (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.mesh</span></code>)</a></li>
<li class="toctree-l1"><a class="reference internal" href="../constitutive_law.html">Constitutive Law (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.constitutivelaw</span></code>)</a></li>
<li class="toctree-l1 current"><a class="reference internal" href="../weak_form.html">Weak Formulation (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.weakform</span></code>)</a><ul class="current">
<li class="toctree-l2 current"><a class="current reference internal" href="#">fedoo.weakform.StressEquilibrium</a><ul>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.copy.html">fedoo.weakform.StressEquilibrium.copy</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.get_all.html">fedoo.weakform.StressEquilibrium.get_all</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.get_dissipation.html">fedoo.weakform.StressEquilibrium.get_dissipation</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.get_storage.html">fedoo.weakform.StressEquilibrium.get_storage</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.get_weak_equation.html">fedoo.weakform.StressEquilibrium.get_weak_equation</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.initialize.html">fedoo.weakform.StressEquilibrium.initialize</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.iter_leaf.html">fedoo.weakform.StressEquilibrium.iter_leaf</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.reset.html">fedoo.weakform.StressEquilibrium.reset</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.set_damping.html">fedoo.weakform.StressEquilibrium.set_damping</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.set_dissipation.html">fedoo.weakform.StressEquilibrium.set_dissipation</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.set_inertia.html">fedoo.weakform.StressEquilibrium.set_inertia</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.set_start.html">fedoo.weakform.StressEquilibrium.set_start</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.set_storage.html">fedoo.weakform.StressEquilibrium.set_storage</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.sum.html">fedoo.weakform.StressEquilibrium.sum</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.to_start.html">fedoo.weakform.StressEquilibrium.to_start</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.update.html">fedoo.weakform.StressEquilibrium.update</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.update_2.html">fedoo.weakform.StressEquilibrium.update_2</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.convert_tangent.html">fedoo.weakform.StressEquilibrium.convert_tangent</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.corate.html">fedoo.weakform.StressEquilibrium.corate</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.geometric_stiffness.html">fedoo.weakform.StressEquilibrium.geometric_stiffness</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.incompressibility.html">fedoo.weakform.StressEquilibrium.incompressibility</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.name.html">fedoo.weakform.StressEquilibrium.name</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.nvar.html">fedoo.weakform.StressEquilibrium.nvar</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.space.html">fedoo.weakform.StressEquilibrium.space</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.nlgeom.html">fedoo.weakform.StressEquilibrium.nlgeom</a></li>
</ul>
</li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.ImplicitDynamic.html">fedoo.weakform.ImplicitDynamic</a></li>

grep term: "form"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/util/viewer.py (lines 2598-2707 · enclosing function/class)

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Scalar bar options")
        self.setModal(False)
        self.setWindowFlag(Qt.WindowStaysOnTopHint, True)

        # Radio buttons : mode
        self.rb_current = QtWidgets.QRadioButton("Current frame Min/Max")
        self.rb_all = QtWidgets.QRadioButton("All frames Min/Max")
        self.rb_manual = QtWidgets.QRadioButton("User Min/Max")

        # Saisie des valeurs manuelles
        self.vmax_spin = QtWidgets.QDoubleSpinBox()
        self.vmin_spin = QtWidgets.QDoubleSpinBox()
        for s in (self.vmin_spin, self.vmax_spin):
            s.setRange(-1e12, 1e12)
            s.setDecimals(6)

        # Nombre de couleurs (LUT)
        self.ncolors_spin = QtWidgets.QSpinBox()
        self.ncolors_spin.setRange(2, 2048)
        self.ncolors_spin.setSuffix(" colors")

        # Nombre de labels
        self.nlabels_spin = QtWidgets.QSpinBox()
        self.nlabels_spin.setRange(2, 20)
        self.nlabels_spin.setSuffix(" labels")

        # ----------------------------------------
        # Colormap selector and preview
        # ----------------------------------------
        self.cmap_filter = QtWidgets.QLineEdit()
        self.cmap_filter.setPlaceholderText("Filter colormaps…")

        self.cmap_combo = QtWidgets.QComboBox()
        self.cmap_combo.setEditable(False)
        self.cmap_reverse = QtWidgets.QCheckBox("Reverse colormap")

        # Load cmap list
        self._all_cmaps = sorted(
            [c for c in sorted(list(mpl.colormaps)) if not c.endswith("_r")]
        )
        # self._all_cmaps = sorted(list(mpl.colormaps))
        self.cmap_combo.addItems(self._all_cmaps)
        self.cmap_preview = CMapPreview()  # Preview widget

        self.update_values()

        # connections
        # Activate/Deactivated manual clim values
        def refresh_manual_enabled():
            enabled = self.rb_manual.isChecked()
            self.vmin_spin.setEnabled(enabled)
            self.vmax_spin.setEnabled(enabled)
            self._update_clim_values()

        self.rb_current.toggled.connect(refresh_manual_enabled)
        self.rb_all.toggled.connect(refresh_manual_enabled)
        self.rb_manual.toggled.connect(refresh_manual_enabled)
        refresh_manual_enabled()

        # Update preview when needed
        def update_preview(*args):
            name = self.cmap_combo.currentText()
            self.cmap_preview.update_preview(
                name, self.cmap_reverse.isChecked(), int(self.ncolors_spin.value())
            )

        self.ncolors_spin.valueChanged.connect(update_preview)

        self.cmap_combo.currentTextChanged.connect(update_preview)
        self.cmap_reverse.toggled.connect(update_preview)
        self.cmap_filter.textChanged.connect(self._filter_cmaps)
        update_preview()

        # Layout
        form = QtWidgets.QFormLayout()
        form.addRow(self.rb_current)
        form.addRow(self.rb_all)
        form.addRow(self.rb_manual)
        form.addRow("Max:", self.vmax_spin)
        form.addRow("Min:", self.vmin_spin)
        form.addRow("Number of colors:", self.ncolors_spin)
        form.addRow("Number of labels:", self.nlabels_spin)

        btn_box = QtWidgets.QDialogButtonBox(
            QtWidgets.QDialogButtonBox.Ok
            | QtWidgets.QDialogButtonBox.Apply
            | QtWidgets.QDialogButtonBox.Cancel
        )
        btn_box.accepted.connect(self.accept)
        btn_box.rejected.connect(self.reject)

        # --- Colormap groupbox ---
        cmap_group = QtWidgets.QGroupBox("Colormap")
        cmap_layout = QtWidgets.QFormLayout(cmap_group)
        cmap_layout.addRow("Filter:", self.cmap_filter)
        cmap_layout.addRow("Select:", self.cmap_combo)
        cmap_layout.addRow(self.cmap_reverse)
        cmap_layout.addRow("Preview:", self.cmap_preview)

        # Catch and connect Apply button
        apply_btn = btn_box.button(QtWidgets.QDialogButtonBox.Apply)
        apply_btn.clicked.connect(self._on_apply_clicked)

        vlayout = QtWidgets.QVBoxLayout(self)
        vlayout.addLayout(form)
        vlayout.addWidget(cmap_group)
        vlayout.addWidget(btn_box)

grep term: "nlgeom"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/core/weakform.py (lines 99-102 · enclosing function/class)

    def iter_leaf(self):
        """Iterate over the leaf weakforms contained in this object."""
        yield self


## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/tests/test_interface_force_nlgeom.py (lines 1-67 · whole file (short script))

from types import SimpleNamespace

import pytest

import fedoo as fd


class _AssemblyStub:
    def __init__(self):
        self._nlgeom = False
        self.updated_displacement = None

    def set_disp(self, displacement):
        self.updated_displacement = displacement


def _interface_force(nlgeom=None):
    fd.ModelingSpace("3D")
    law = fd.constitutivelaw.Spring(Kx=1.0, Ky=1.0, Kz=1.0)
    return fd.weakform.InterfaceForce(law, nlgeom=nlgeom)


def test_interface_force_inherits_problem_nlgeom():
    weakform = _interface_force()
    assembly = _AssemblyStub()
    displacement = object()
    problem = SimpleNamespace(
        nlgeom=True,
        get_disp=lambda: displacement,
    )

    weakform.initialize(assembly, problem)
    weakform.update(assembly, problem)

    assert assembly._nlgeom == "UL"
    assert weakform.nlgeom == "UL"
    assert assembly.updated_displacement is displacement


def test_interface_force_explicit_false_overrides_problem_nlgeom():
    weakform = _interface_force(nlgeom=False)
    assembly = _AssemblyStub()
    problem = SimpleNamespace(
        nlgeom=True,
        get_disp=lambda: object(),
    )

    weakform.initialize(assembly, problem)
    weakform.update(assembly, problem)

    assert assembly._nlgeom is False
    assert weakform.nlgeom is False
    assert assembly.updated_displacement is None


def test_interface_force_rejects_total_lagrangian_formulation():
    weakform = _interface_force(nlgeom="TL")
    assembly = _AssemblyStub()
    problem = SimpleNamespace(nlgeom=False)

    with pytest.raises(NotImplementedError, match="InterfaceForce"):
        weakform.initialize(assembly, problem)


if __name__ == "__main__":
    pytest.main([__file__])


## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/tests/test_distributed_load_neumann_bc.py (lines 181-200 · enclosing function/class)

def test_follower_assembly_neumann_load_without_initial_value_skips_start_vector():
    pb, bc = _build_problem(
        load_nlgeom=True, problem_nlgeom=True, load_kind="distributed"
    )
    load = bc.assembly
    set_start = load.set_start
    load_factors = []

    def counted_set_start(problem, t_fact=None):
        load_factors.append(t_fact)
        return set_start(problem, t_fact)

    load.set_start = counted_set_start

    pb.apply_boundary_conditions(t_fact=0.25, t_fact_old=0.0)

    assert load_factors == [1]
    assert bc.start_value == 0

grep term: "Link"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/util/viewer.py (lines 469-668 · enclosing function/class)

    def __init__(self, data=None):
        super().__init__()

        self.all_docks = []
        self.active_dock = None
        self._sync_field = (
            False  # if True, all docks will share the same field/component/data_type
        )
        self._sync_iter = False  # if True, all docks will share the same iteration
        self._clim_dialog = None  # clim windows if open
        self._clip_dialog = None  # clip windows if open
        self._plot_over_line_dialog = None
        self._pol_results_dialog = None
        self._renderer_dialog = None
        self._plot_dialog = None
        self.element_sets_dialog = None
        self._window_index = 1
        self._picking_target = -1  # internal arg for picking tools. -1 = No target
        self._syncing_line_widget = False
        self.window_layout = self._distribute_auto

        # if plane_widget or line wiget should be shown in the active dock
        self._plane_widget_enabled = False
        self._line_widget_enabled = False

        self.apply_options_to_all = True

        # fullscreen options
        self._is_fullscreen = False
        self._hidden_ui_when_fullscreen = []

        self.setTabPosition(Qt.AllDockWidgetAreas, QtWidgets.QTabWidget.North)

        #####################################################################
        # Tool bars
        #####################################################################
        # ------------------------------------------------
        # Toolbar 1: Field / Component / Data Type
        # ------------------------------------------------
        toolbar_fields = QToolBar("Fields")
        toolbar_fields.setMovable(True)

        toolbar_fields.addWidget(QLabel("Field: "))
        self.field_combo = QtWidgets.QComboBox()
        # if data is not None:
        #     self.field_combo.addItems(data.field_names())

        toolbar_fields.addWidget(self.field_combo)
        toolbar_fields.addSeparator()  # <-- adds a small gap

        toolbar_fields.addWidget(QLabel("Component: "))
        self.comp_combo = QtWidgets.QComboBox()
        toolbar_fields.addWidget(self.comp_combo)

        toolbar_fields.addSeparator()  # <-- adds a small gap

        toolbar_fields.addWidget(QLabel("Data type: "))
        self.avg_combo = QtWidgets.QComboBox()
        self.avg_combo.addItems(["Node", "GaussPoint", "Element"])
        toolbar_fields.addWidget(self.avg_combo)

        self.addToolBar(Qt.TopToolBarArea, toolbar_fields)

        # ------------------------------------------------
        # Toolbar 2: Iteration controls
        # ------------------------------------------------
        toolbar_iter = QToolBar("Iteration")
        toolbar_iter.setMovable(True)

        toolbar_iter.addWidget(QLabel("Iteration:"))
        self.iter_slider = QSlider(Qt.Horizontal)
        self.iter_spin = QSpinBox()
        self.iter_slider.setTracking(False)
        self.iter_slider.setTickPosition(QSlider.TicksBelow)

        toolbar_iter.addWidget(self.iter_slider)
        toolbar_iter.addWidget(self.iter_spin)

        self.animate_btn = QPushButton("▶ Play")
        self.animate_btn.setCheckable(True)
        toolbar_iter.addWidget(self.animate_btn)

        self.anim_fps_spin = QDoubleSpinBox()
        self.anim_fps_spin.setRange(0.1, 60.0)
        self.anim_fps_spin.setSingleStep(0.5)
        self.anim_fps_spin.setValue(5.0)
        self.anim_fps_spin.setSuffix(" fps")
        toolbar_iter.addWidget(self.anim_fps_spin)

        self.anim_wrap_check = QCheckBox("Loop")
        self.anim_wrap_check.setChecked(True)
        toolbar_iter.addWidget(self.anim_wrap_check)

        self.addToolBar(Qt.TopToolBarArea, toolbar_iter)

        # Force a line break on the TOP area
        self.addToolBarBreak(Qt.TopToolBarArea)

        # ------------------------------------------------
        # Toolbar 3 Window
        # ------------------------------------------------
        window_toolbar = QtWidgets.QToolBar("Dock Selector")
        window_toolbar.setMovable(True)
        self.addToolBar(Qt.TopToolBarArea, window_toolbar)

        window_toolbar.addWidget(QtWidgets.QLabel("Active window: "))
        self.dock_selector_combo = QtWidgets.QComboBox()
        self.dock_selector_combo.setMinimumWidth(150)

        # Allow user text input
        self.dock_selector_combo.setEditable(True)

        # Prevent adding arbitrary new items
        self.dock_selector_combo.setInsertPolicy(QtWidgets.QComboBox.NoInsert)

        window_toolbar.addWidget(self.dock_selector_combo)

        # When user selects a dock from combo
        self.dock_selector_combo.currentIndexChanged.connect(
            lambda idx: self._set_active(self.all_docks[idx])
        )

        self.dock_selector_combo.lineEdit().editingFinished.connect(
            self.rename_active_dock_from_combo
        )

        # ------------------------------------------------
        # Toolbar 4 Selection
        # ------------------------------------------------
        select_toolbar = QtWidgets.QToolBar("Select")
        select_toolbar.setMovable(True)
        self.addToolBar(Qt.TopToolBarArea, select_toolbar)

        select_toolbar.addWidget(QtWidgets.QLabel("Select: "))

        # Create a checkable action (toggle)
        self.select_node_action = QtWidgets.QAction("Node", self)
        self.select_node_action.setCheckable(True)
        self.select_node_action.setChecked(False)
        self.select_elm_action = QtWidgets.QAction("Element", self)
        self.select_elm_action.setCheckable(True)
        self.select_elm_action.setChecked(False)

        select_toolbar.addAction(self.select_node_action)
        select_toolbar.addAction(self.select_elm_action)

        self.select_node_action.toggled.connect(self._on_select_node_changed)
        self.select_elm_action.toggled.connect(self._on_select_elm_changed)

        # ------------------------------------------------
        # Toolbar 5 View
        # ------------------------------------------------
        view_toolbar = QtWidgets.QToolBar("View")
        view_toolbar.setMovable(True)
        self.addToolBar(Qt.TopToolBarArea, view_toolbar)

        # Define actions for tool bars and menu
        view_top_action = QtWidgets.QAction("Top (Z-)", self)
        view_top_action.setShortcut("Ctrl+1")
        view_top_action.triggered.connect(self.view_top)

        view_bottom_action = QtWidgets.QAction("Bottom (Z+)", self)
        view_bottom_action.setShortcut("Ctrl+2")
        view_bottom_action.triggered.connect(self.view_bottom)

        view_front_action = QtWidgets.QAction("Front (Y-)", self)
        view_front_action.setShortcut("Ctrl+3")
        view_front_action.triggered.connect(self.view_front)

        view_back_action = QtWidgets.QAction("Back (Y+)", self)
        view_back_action.setShortcut("Ctrl+4")
        view_back_action.triggered.connect(self.view_back)

        view_left_action = QtWidgets.QAction("Left (X-)", self)
        view_left_action.setShortcut("Ctrl+5")
        view_left_action.triggered.connect(self.view_left)

        view_right_action = QtWidgets.QAction("Right (X+)", self)
        view_right_action.setShortcut("Ctrl+6")
        view_right_action.triggered.connect(self.view_right)

        view_isometric_action = QtWidgets.QAction("Isometric", self)
        view_isometric_action.setShortcut("Ctrl+0")
        view_isometric_action.triggered.connect(self.view_isometric)

        reset_camera_action = QtWidgets.QAction("Reset", self)
        reset_camera_action.setToolTip("Reset camera to fit all visible actors")
        reset_camera_action.triggered.connect(self.reset_camera)

        # add view actions to toolbars
        view_toolbar.addAction(view_top_action)
        view_toolbar.addAction(view_bottom_action)
        view_toolbar.addAction(view_front_action)
        view_toolbar.addAction(view_back_action)
        view_toolbar.addAction(view_left_action)
        view_toolbar.addAction(view_right_action)
        view_toolbar.addAction(view_isometric_action)
        view_toolbar.addAction(reset_camera_action)

        # -------------------------

grep term: "definition"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 30797-30996 · enclosing doc section)

-
...
-
-
-
-
-
-
12K+8
SMISC
Z
component
The item and sequence numbers shown are for real pressures. Imaginary pressures are
represented in the same way but have 12K+8 added to them.
SURF159 Assumptions and Restrictions
• The length of the base element must be nonzero.
• The base element must lie on one side of the axisymmetric axis, and the axisymmetric axis must
be on the same plane as the base element (master plane).
• A base element or base node must be associated with one axisymmetric axis (defined via SECTYPE
and SECDATA commands) before generating nodes for general axisymmetric element sections
(NAXIS) or defining an element by node connectivity (E).
• An edge with a removed midside node implies that the displacement varies linearly, rather than
parabolically, along that edge. For more information about the use of midside nodes, see
Quadratic Elements (Midside Nodes) in the Modeling and Meshing Guide.
• You cannot apply a pressure load by applying a surface load to selected areas (SFA).
• The contribution of the element to the mass moment inertia of the whole model is calculated
by element mass multiplied by the square of the coordinates of the elemental centroid. The
moment of inertia may therefore be inaccurate.
• The element does not support the expansion pass of a superelement with large rotation.
• Issuing an /ESHAPE,1 command while PowerGraphics is active causes the program to plot the
elements in 3D and the results on both nodal planes and all integration planes (p. 91) in the
circumferential direction. Otherwise, the program plots the elements in 2D and the results on
the master plane.
• You cannot display surface load symbols (/PSF) for this element.
505
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

• When listing the surface loads for elements (SFELIST), only information for the first facet is re-
turned.
• When plotting contour values via /ESHAPE,1, expanded SURF159 elements are assigned zeroes.
You must therefore deselect SURF159 elements when plotting results such as stresses and strains.
• In postprocessing, print commands return the nodal plane results only.
• Stress stiffening is always included in geometrically nonlinear analyses (NLGEOM,ON). Prestress
effects can be activated via the PSTRES command.
SURF159 Product Restrictions
There are no product-specific restrictions for this element.
TARGE169
2D Target Segment
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Product Restrictions (p.518)
TARGE169 Element Description
TARGE169 is used to represent various 2D "target" surfaces for the associated contact elements (CON-
TA172 (p. 535) and CONTA175 (p. 591)). The contact elements themselves overlay the solid elements
describing the boundary of a deformable body and are potentially in contact with the target surface,
defined by TARGE169.
You can impose translational or rotational displacement, temperature, voltage, magnetic potential, pore
pressure, and concentration on the target segment element. You can also impose forces and moments
on target elements. See TARGE169 in the Mechanical APDL Theory Reference for more details about this
element. To represent 3D target surfaces, use TARGE170 (p. 519), a 3D target segment element.
For rigid targets, these elements can easily model complex target shapes. For flexible targets, these
elements overlay the solid elements describing the boundary of the deformable target body.
Figure 7.169.1: TARGE169 Geometry
K
J
M
N
L
Target Segment
Surface-to-Surface
Contact Element
CONTA172
Parabola
I
K
J
M
Node-to-Surface
Contact Element
CONTA175
n
n
n
X
Y
I
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
506
Element Library

TARGE169 Input Data
The target surface is modeled through a set of target segments. Typically, several target segments make
up one target surface.
Figure 7.169.2: TARGE169 2D Segment Types (p. 509) shows the available segment types for TARGE169.
For any target surface definition, the node ordering of the target segment element is critical for proper
detection of contact. The nodes must be ordered so that, for a 2D surface, the associated contact elements
(CONTA172 (p. 535) or CONTA175 (p. 591)) must lie to the right of the target surface when moving from
target node I to target node J. For a rigid 2D complete circle, contact must occur on the outside of the
circle. Internal contacting is not allowed.
Pair-Based Contact versus General Contact
There are two methods to define a contact interaction: the pair-based contact definition and the gen-
eral contact definition. Both contact definitions can exist in the same model. TARGE169 can be used in
either type of contact definition.
Pair-Based Contact
In a pair-based contact definition, the 2D contact elements (CONTA172 (p. 535) or CONTA175 (p. 591))
are associated with 2D target segment elements (TARGE169) via a shared real constant set. The program
looks for contact interaction only between surfaces with the same real constant set ID (which is greater
than zero). The material ID associated with the contact element is used to specify interaction properties
(such as friction coefficient) defined by MP or TB commands.
The target surface can be either rigid or deformable. For rigid-flexible contact, the rigid surface must
be represented by a target surface. For flexible-flexible contact, one of the deformable surfaces must
be overlaid by a target surface. See Designating Contact and Target Surfaces in the Contact Technology
Guide for more information.
Each target surface can be associated with only one contact surface, and vice-versa. However, several
contact elements could make up the contact surface and therefore come in contact with the same target
surface. Likewise, several target elements could make up the target surface and therefore come in
contact with the same contact surface. For either the target or contact surfaces, you can put many
elements in a single target or contact surface, or you can localize the contact and target surfaces by
splitting the large surfaces into smaller target and contact surfaces, each of which contain fewer elements.
If a contact surface may contact more than one target surface, you must define duplicate contact surfaces
that share the same geometry but relate to separate targets, that is, have separate real constant set
numbers.
General Contact
In a general contact definition, the general contact surfaces are generated automatically by the GCGEN
command based on physical parts and geometric shapes in the model. The program overlays contact
surface elements (CONTA172 (p. 535)) on 2D deformable bodies (on both lower- and higher-order ele-
ments). The general contact definition may also contain target elements (TARGE169) overlaid on the
surfaces of standalone rigid bodies.
The GCGEN command automatically assigns section IDs and element type IDs for each general contact
surface. As a result, each general contact surface consists of contact or target elements that are easily
507
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

identified by a unique section ID number. The real constant ID and material ID are always set to zero
for contact and target elements in the general contact definition.
The program looks for contact interaction among all surfaces and within each surface. You can further
control contact interactions between specific surfaces that could potentially be in contact by using the
GCDEF command. The material ID and real constant ID input on GCDEF identify interface properties
(defined by MP or TB commands) and contact control parameters (defined by the R command) for a
specific contact interaction. Unlike a pair-based contact definition, the contact and target elements in
the general contact definition are not associated with these material and real constant ID numbers.
Considerations for Rigid Targets
Each target segment is a single element with a specific shape, or segment type. The program supports
seven 2D segment types, as described in Table 7.169.1: TARGE169 2D Segment Types, Target Shape
Codes, and Nodes (p. 508). The segment types are defined by one, two, or three nodes and a target
shape code (TSHAPE command) which indicates the geometry (shape) of the element. The segment
location is determined by the nodes.
A radius value is required for the circle segment type. For pair-based contact, the radius is specified by
real constant (R1). For a general contact definition, the radius is specified by section data (the SEC-
TYPE,,CONTACT,RADIUS command with the radius entered on the SECDATA command).
Table 7.169.1: TARGE169 2D Segment Types, Target Shape Codes, and Nodes
R2
R1
Node 3
(DOF)
Node 2
(DOF)[a]
Node1
(DOF)
Segment Type
TSHAPE
None
None
None
2nd corner
pt (UX, UY)
1st corner pt
(UX, UY)
Straight line
LINE
(TEMP)
(VOLT) (AZ)
(TEMP)
(VOLT) (AZ)
None
None
Circle center
pt (UX, UY)
2nd corner
pt (UX, UY)
1st corner pt
(UX, UY)
Arc, clockwise
ARC
(TEMP)
(VOLT) (AZ)
(TEMP)
(VOLT) (AZ)
(TEMP)
(VOLT) (AZ)
None
None
Circle center
pt (UX, UY)
2nd corner
pt (UX, UY)
1st corner pt
(UX, UY)

grep term: "_pb_"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/tests/test_line_search_mode.py (lines 94-108 · enclosing function/class)

def test_invalid_line_search_trial_reports_failed_time_increment(monkeypatch):
    pb = _make_problem()

    def reject_increment(*args, **kwargs):
        raise InvalidKinematicStateError

    monkeypatch.setattr(pb, "elastic_prediction", reject_increment)
    convergence, subiter, error = pb.solve_time_increment()

    assert convergence == 0
    assert subiter == 1
    assert np.isinf(error)
    assert pb._t_fact_inc is None



## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/examples/thermal/thermo_meca_weak_coupling_3D.py (lines 1-214 · whole file (short script))

"""Run a weakly coupled thermo-mechanical analysis.

After this analysis completes, run ``thermo_meca_weak_coupling_3D_post_tt.py``
to generate a movie from the saved thermal and mechanical results.
"""

import fedoo as fd
import numpy as np
from time import time
import os
import pylab as plt
from numpy import linalg

start = time()
# --------------- Pre-Treatment --------------------------------------------------------


# -------------------- MESH ------------------------------
# fd.mesh.box_mesh(Nx=3, Ny=3, Nz=3, x_min=0, x_max=1, y_min=0, y_max=1, z_min=0, z_max=1, ElementShape = 'hex8', name = meshname)
# fd.mesh.import_file('octet_surf.msh', meshname = "Domain")
# fd.mesh.import_file('data/octet_1.msh', meshname = "Domain")
fd.mesh.import_file("../../util/meshes/gyroid.msh", name="Domain")
meshname = "Domain"
filename_res = "results/thermo_meca_nl"

mesh = fd.Mesh[meshname]

crd = mesh.nodes

# note set for boundary conditions
Xmin, Xmax = mesh.bounding_box
left = mesh.find_nodes("X", Xmin[0])
right = mesh.find_nodes("X", Xmax[0])
bottom = mesh.find_nodes("Y", Xmin[1])
top = mesh.find_nodes("Y", Xmax[1])
back = mesh.find_nodes("Z", Xmin[2])
front = mesh.find_nodes("Z", Xmax[2])


boundary = np.unique(np.hstack((bottom, top, left, right, back, front)))

# -------------------- Thermal Problem ------------------------------
thermal_space = fd.ModelingSpace("3D")


K = 500  # K = 18 #W/K/m
c = 0.500  # J/kg/K
rho = 7800  # kg/m2
thermal_law = fd.constitutivelaw.ThermalProperties(K, c, rho, name="ThermalLaw")
wf_th = fd.weakform.HeatEquation(thermal_law, space=thermal_space)
assemb = fd.Assembly.create(wf_th, meshname, name="Assembling_T")

pb_th = fd.problem.NonLinear("Assembling_T")
pb_th.set_time_integrator(fd.time.FIRST_ORDER, fd.time.BackwardEuler())

# Problem.set_solver('cg', precond = True)
pb_th.set_nr_criterion("Displacement", tol=5e-2, max_subiter=5, err0=100)

# -------------------- Mechanical Problem ------------------------------
mech_space = fd.ModelingSpace("3D")

E = 200e3
nu = 0.3
alpha = 1e-3  # alpha = 1e-5 #???
NLGEOM = False
mat = 0
if mat == 0:
    props = np.array([E, nu, alpha])
    mechancial_law = fd.constitutivelaw.Simcoon("ELISO", props, name="MechanicalLaw")
elif mat == 1 or mat == 2:
    Re = 300
    k = 1000  # 1500
    m = 1  # 0.3 #0.25
    if mat == 1:
        props = np.array([E, nu, alpha, Re, k, m])
        mechancial_law = fd.constitutivelaw.Simcoon(
            "EPICP", props, name="MechanicalLaw"
        )
    elif mat == 2:
        mechancial_law = fd.constitutivelaw.ElastoPlasticity(
            E, nu, Re, name="MechanicalLaw"
        )
        mechancial_law.set_hardening_function("power", h=k, beta=m)
else:
    mechancial_law = fd.constitutivelaw.ElasticIsotrop(E, nu, name="MechanicalLaw")

wf_mech = fd.weakform.StressEquilibrium("MechanicalLaw", nlgeom=NLGEOM)

fd.Assembly.create(
    wf_mech, meshname, name="Assembling_M"
)  # uses mesh_change=True when the mesh change during the time

pb_m = fd.problem.NonLinear("Assembling_M")
# pb_m.set_solver('cg', precond = True)
pb_m.set_nr_criterion("Displacement", tol=1e-2, err0=1)

# -------------------- Set output ------------------------------
# create a 'result' folder and set the desired ouputs
res_m = pb_m.add_output(
    filename_res + "_me",
    "Assembling_M",
    ["Disp", "Stress", "Strain", "Stress_vm", "Statev", "Wm"],
)

res_th = pb_th.add_output(filename_res + "_th", "Assembling_T", ["Temp"])
# # Problem.add_output('results/bendingPlastic', 'Assembling', ['cauchy', 'PKII', 'strain', 'cauchy_vm', 'statev'], output_type='Element', file_format ='vtk')


# -------------------- Boundary Conditions ------------------------------
# def timeEvolution(timeFactor):
#     if timeFactor == 0: return 0
#     else: return 1
def timeEvolution(timeFactor):
    if timeFactor < 0.5:
        return 2 * timeFactor
    else:
        return 1


pb_th.bc.add("Dirichlet", right, "Temp", 100, time_func=timeEvolution, name="temp")
# pb_th.bc.add('Dirichlet',right,'Temp',100, name='temp')

pb_m.bc.add("Dirichlet", boundary, "Disp", 0)

# -------------------- Solve  ------------------------------

nb_iter = 100
tmax = 30
dt = tmax / nb_iter

pb_th.initialize()
pb_m.initialize()

pb_th.tmax = tmax
pb_m.tmax = tmax
pb_th.dtime = pb_m.dtime = dt

pb_th.set_start()
pb_m.set_start()

for i in range(nb_iter):
    pb_th.time = pb_m.time = time = i * dt
    convergence, nbNRiter, normRes = pb_th.solve_time_increment()
    # assert convergence, 'thermal problem has not converged'
    if not (convergence):
        print("WARNING: iteration", i, "has not converged: err =", normRes)
    pb_th.set_start()
    pb_th.save_results(i)

    print(
        "Iter {} - Therm - Time: {:.5f} - NR iter: {} - Err: {:.5f}".format(
            i, time, nbNRiter, normRes
        )
    )
    pb_m.set_start(dt)
    # temp = assemb.convert_data(pb_th.get_temp(), convert_from='Node', convert_to='GaussPoint')
    pb_m.assembly.sv["Temp"] = pb_th.assembly.sv["Temp"]

    convergence, nbNRiter, normRes = pb_m.solve_time_increment()
    assert convergence, "mechanical problem has not converged"
    pb_m.set_start()
    pb_m.save_results(i)

    print(
        "Iter {} - Mech - Time: {:.5f} - NR iter: {} - Err: {:.5f}".format(
            i, time, nbNRiter, normRes
        )
    )


# pb_th.RemoveBC('temp')
# pb_th.bc.add('Dirichlet','Temp',0,right, timeEvolution=timeEvolution, initialValue = 100, name='temp')
# pb_th.GetBC('temp')[0].ChangeValue(0, initialValue = 'Current')
pb_th.bc[0].value = 0
# pb_th.apply_boundary_conditions()

pb_th.t0 = tmax
pb_th.tmax = 2 * tmax
pb_m.t0 = tmax
pb_m.tmax = 2 * tmax

for i in range(nb_iter, 2 * nb_iter):
    time = i * dt
    convergence, nbNRiter, normRes = pb_th.solve_time_increment()
    # assert convergence, 'thermal problem has not converged'
    if not (convergence):
        print("WARNING: iteration", i, "has not converged: err =", normRes)
    pb_th.save_results(i)

    print(
        "Iter {} - Therm - Time: {:.5f} - NR iter: {} - Err: {:.5f}".format(
            i, time, nbNRiter, normRes
        )
    )
    # temp = pb_th.assembly.convert_data(pb_th.get_temp(), convert_from='Node', convert_to='GaussPoint')
    pb_m.assembly.sv["Temp"] = pb_th.assembly.sv["Temp"]

    convergence, nbNRiter, normRes = pb_m.solve_time_increment()
    assert convergence, "mechanical problem has not converged"
    pb_m.save_results(i)

    print(
        "Iter {} - Mech - Time: {:.5f} - NR iter: {} - Err: {:.5f}".format(
            i, time, nbNRiter, normRes
        )
    )

nb_iter = 2 * nb_iter


### Simple movie output
# res_m.write_movie('stress_field.mp4', 'Stress_vm')
# res_th.write_movie('temp_field.mp4', 'Temp')

grep term: "StressEquilibriumRI.update"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibriumRI.html (lines 100-120 · chunk range (no structural region))

<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.BeamEquilibrium.html">fedoo.weakform.BeamEquilibrium</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.SpringEquilibrium.html">fedoo.weakform.SpringEquilibrium</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.PlateEquilibrium.html">fedoo.weakform.PlateEquilibrium</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.PlateEquilibriumFI.html">fedoo.weakform.PlateEquilibriumFI</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.PlateKirchhoffLoveEquilibrium.html">fedoo.weakform.PlateKirchhoffLoveEquilibrium</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.PlateShearEquilibrium.html">fedoo.weakform.PlateShearEquilibrium</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.PlateDrillingPenalty.html">fedoo.weakform.PlateDrillingPenalty</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.Inertia.html">fedoo.weakform.Inertia</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.RotaryInertia.html">fedoo.weakform.RotaryInertia</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.InterfaceForce.html">fedoo.weakform.InterfaceForce</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.DistributedLoad.html">fedoo.weakform.DistributedLoad</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.ExternalPressure.html">fedoo.weakform.ExternalPressure</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.HourglassStiffness.html">fedoo.weakform.HourglassStiffness</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.ArtificialDamping.html">fedoo.weakform.ArtificialDamping</a></li>
</ul>
</li>
<li class="toctree-l1"><a class="reference internal" href="../assembly.html">Class Assembly</a></li>
<li class="toctree-l1"><a class="reference internal" href="../time.html">Time Integration (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.time</span></code>)</a></li>
<li class="toctree-l1"><a class="reference internal" href="../problem.html">Problem (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.problem</span></code>)</a></li>
<li class="toctree-l1"><a class="reference internal" href="../boundary_conditions.html">Boundary conditions and constraints</a></li>
<li class="toctree-l1"><a class="reference internal" href="../post_processing.html">Post-Processing</a></li>

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibriumRI.update.html (lines 1-12 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.weakform.StressEquilibriumRI.update &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibriumRI.update_2.html (lines 1-12 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.weakform.StressEquilibriumRI.update_2 &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />

grep term: "_wf1_"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/core/weakform.py (lines 99-102 · enclosing function/class)

    def iter_leaf(self):
        """Iterate over the leaf weakforms contained in this object."""
        yield self


## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/examples/user_equation/fluid_mechanics.py (lines 1-126 · whole file (short script))

import fedoo as fd
import numpy as np

space = fd.ModelingSpace("2D")

space.new_variable("Vx")
space.new_variable("Vy")
space.new_vector("V", ["Vx", "Vy"])
space.new_variable("P")  # pressure

# create simple DiffOp objects
dVx_dX = space.derivative("Vx", "X")
dVy_dY = space.derivative("Vy", "Y")
dVy_dX = space.derivative("Vy", "X")
dVx_dY = space.derivative("Vx", "Y")
P = space.variable("P")

mu = 10  # viscosity
L1 = 100
L2 = 200
R = L1 / 5
Vleft = 1

D = [dVx_dX, dVy_dY, dVx_dY + dVy_dX]

# Momentum conservation equation
eq1 = (
    D[0].virtual * (-P + 2 * mu * D[0])
    + D[1].virtual * (-P + 2 * mu * D[1])
    + 0.5 * D[2].virtual * D[2]
)

# Mass conservation equation
eq2 = P.virtual * (dVx_dX + dVy_dY)

# weakform
wf = fd.WeakForm(eq1 + eq2)

# Or by summing the weakforms
# wf1 = fd.WeakForm(D[0].virtual * (-P+2*mu*D[0]) + D[1].virtual * (-P+2*mu*D[1]) + 0.5*D[2].virtual * D[2])
# wf2 = fd.WeakForm(P.virtual * (dVx_dX + dVy_dY))
# wf = wf1 + wf2

mesh1 = fd.mesh.hole_plate_mesh(
    length=L1, height=L1, radius=R, elm_type="tri3", sym=False
)
mesh2 = fd.mesh.rectangle_mesh(
    nx=41,
    ny=21,
    x_min=L1 / 2,
    x_max=L1 / 2 + L2,
    y_min=-L1 / 2,
    y_max=L1 / 2,
    elm_type="tri3",
)

mesh = fd.Mesh.stack(mesh1, mesh2)
mesh.merge_nodes(mesh.find_coincident_nodes())

hole = mesh.find_nodes(
    "Point", np.array([0, 0]), R + 1e-6
)  # contient les noeuds bulles !

internal_nodes = mesh.add_internal_nodes(1)

elm_type = "p1+/p1"
new_elm = fd.lib_elements.element_list.CombinedElement("p1+/p1", "tri3")
new_elm.set_variable_interpolation("Vx", "tri3bubble")
new_elm.set_variable_interpolation("Vy", "tri3bubble")

fd.Assembly.create(wf, mesh, elm_type=elm_type, name="assembling")

pb = fd.problem.Linear("assembling")

left = mesh.find_nodes("X", mesh.bounding_box.xmin)
right = mesh.find_nodes("X", mesh.bounding_box.xmax)
bottom = mesh.find_nodes("Y", mesh.bounding_box.ymin)
top = mesh.find_nodes("Y", mesh.bounding_box.ymax)
# hole = mesh.find_nodes('Point', np.array([0,0]), 20) #contient les noeuds bulles !

# pb.bc.add("Dirichlet", left, ["Vx", "Vy"], [1, 0])
pb.bc.add("Dirichlet", left, "Vx", Vleft)
# pb.bc.add("Dirichlet", right, "Vy", 0)
pb.bc.add("Dirichlet", bottom, "V", 0)
pb.bc.add("Dirichlet", top, "V", 0)
pb.bc.add("Dirichlet", internal_nodes, "P", 0)  # remove non used pressure central dof
pb.bc.add("Dirichlet", hole, "V", 0)  # remove non used pressure central dof

pb.apply_boundary_conditions()

pb.solve()


# plot with streamlines with pyvista.

# streamlines are not included in the plot function embeded in fedoo, then we need to
# add them by hand

res = pb.get_results("assembling", ["V", "P"])

# res.plot("P")

# Vnorm = np.linalg.norm(res.node_data['V'], axis=0)

# pl = res.plot("V", component = "norm", show = False)
pl = res.plot("P", component=0, show_edges=False, show=False)

# Add a zero out-of-plane component for PyVista's 3D streamline filter.
pl.mesh["velocity"] = np.c_[
    res["V"].T,
    np.zeros(mesh.n_nodes),
]

line_streamlines = pl.mesh.streamlines(
    "velocity",
    pointa=(-L1 / 2 + 1e-5, -L1 / 2 + 1e-5, 0),
    pointb=(-L1 / 2 + 1e-5, L1 - 1e-5, 0),
    n_points=20,
    max_length=1000.0,
    # compute_vorticity=False,
)


pl.add_mesh(line_streamlines.tube(radius=L1 / 100))
pl.show()


## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Exemples_fedoo/user_equation/recirculating_flow.py (lines 1-92 · whole file (short script))

import fedoo as fd
import numpy as np

fd.Assembly.delete_memory()

space = fd.ModelingSpace("2D")

space.new_variable("Vx")
space.new_variable("Vy")
space.new_vector("V", ["Vx", "Vy"])
space.new_variable("P")  # pressure

# create simple DiffOp objects
dVx_dX = space.derivative("Vx", "X")
dVy_dY = space.derivative("Vy", "Y")
dVy_dX = space.derivative("Vy", "X")
dVx_dY = space.derivative("Vx", "Y")
P = space.variable("P")

mu = 0.1  # viscosity

D = [dVx_dX, dVy_dY, dVx_dY + dVy_dX]

# Momentum conservation equation
eq1 = (
    D[0].virtual * (-P + 2 * mu * D[0])
    + D[1].virtual * (-P + 2 * mu * D[1])
    + 0.5 * D[2].virtual * D[2]
)
# wf1 = fd.WeakForm(D[0].virtual * (-P+2*mu*D[0]) + D[1].virtual * (-P+2*mu*D[1]) + 0.5*D[2].virtual * D[2])

# Mass conservation equation
eq2 = P.virtual * (dVx_dX + dVy_dY)
# wf2 = fd.WeakForm(P.virtual * (dVx_dX + dVy_dY))

# wf = wf1 + wf2
wf = fd.WeakForm(eq1 + eq2)

mesh = fd.mesh.rectangle_mesh(elm_type="tri3")
internal_nodes = mesh.add_internal_nodes(1)

elm_type = "p1+/p1"
new_elm = fd.lib_elements.element_list.CombinedElement("p1+/p1", "tri3")
new_elm.set_variable_interpolation("Vx", "tri3bubble")
new_elm.set_variable_interpolation("Vy", "tri3bubble")

fd.Assembly.create(wf, mesh, elm_type=elm_type, name="assembling")

pb = fd.problem.Linear("assembling")

pb.bc.add("Dirichlet", "left", "V", 0)
pb.bc.add("Dirichlet", "right", "V", 0)
pb.bc.add("Dirichlet", "bottom", "V", 0)
pb.bc.add("Dirichlet", "top", ["Vx", "Vy"], [1.0, 0.0])
pb.bc.add("Dirichlet", internal_nodes, "P", 0)  # remove non used pressure central dof

pb.apply_boundary_conditions()

pb.solve()

# plot with streamlines with pyvista.

# streamlines are not included in the plot function embeded in fedoo, then we need to
# add them by hand

res = pb.get_results("assembling", ["V", "P"])
Vnorm = np.linalg.norm(res.node_data["V"], axis=0)

pl = res.plot("V", component="norm", show=False)

# pl.mesh["vectors"] = np.c_[
#     res["V"][:, : mesh.n_physical_nodes].T, np.zeros(mesh.n_physical_nodes)
# ]

pl.mesh["vectors"] = np.c_[res["V"][:, : mesh.n_nodes].T, np.zeros(mesh.n_nodes)]

line_streamlines = pl.mesh.streamlines(
    "vectors",
    pointa=(0.5, 0, 0),
    pointb=(0.5, 1, 0),
    n_points=10,
    # max_time=10.0,
    # compute_vorticity=False,
)


pl.add_mesh(line_streamlines.tube(radius=0.005))
pl.show()


# res.plot("V")

grep term: "_wf2_"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/examples/contact/comparison/ring_crush.py (lines 126-131 · enclosing function/class)

def track_penalty(pb):
    history_penalty["time"].append(pb.time)
    F = pb.get_ext_forces("Disp")
    history_penalty["reaction_y"].append(np.sum(F[1, nodes_top]))



## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/examples/contact/comparison/gyroid_selfcontact.py (lines 140-172 · enclosing doc section)

# =========================================================================

print("\n" + "=" * 60)
print("IPC SELF-CONTACT (Gyroid compression)")
print("=" * 60)

mesh2, material2 = build_gyroid()

nodes_top2 = mesh2.find_nodes("Z", mesh2.bounding_box.zmax)
nodes_bottom2 = mesh2.find_nodes("Z", mesh2.bounding_box.zmin)

ipc_contact = fd.constraint.IPCSelfContact(
    mesh2,
    dhat=5e-3,
    dhat_is_relative=True,
    friction_coefficient=0.0,
    use_ccd=True,
)

wf2 = fd.weakform.StressEquilibrium(material2, nlgeom="UL")
solid_assembly2 = fd.Assembly.create(wf2, mesh2)
assembly2 = fd.Assembly.sum(solid_assembly2, ipc_contact)

pb_ipc = fd.problem.NonLinear(assembly2)

if not os.path.isdir("results"):
    os.mkdir("results")
res_ipc = pb_ipc.add_output("results/gyroid_ipc", solid_assembly2, ["Disp", "Stress"])

pb_ipc.bc.add("Dirichlet", nodes_bottom2, "Disp", 0)
pb_ipc.bc.add("Dirichlet", nodes_top2, "Disp", [0, 0, -COMPRESSION])
pb_ipc.set_nr_criterion("Displacement", tol=5e-3, max_subiter=10)


## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/core/weakform.py (lines 99-102 · enclosing function/class)

    def iter_leaf(self):
        """Iterate over the leaf weakforms contained in this object."""
        yield self

grep term: "StressEquilibriumRI.get"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibriumRI.html (lines 50-99 · chunk range (no structural region))

    <input type="hidden" name="area" value="default" />
  </form>
</div>
        </div><div class="wy-menu wy-menu-vertical" data-spy="affix" role="navigation" aria-label="Navigation menu">
<p style="padding: 0.5em 1.618em; margin-bottom: 0;">
  <a href="https://3mah.github.io/" style="color: #d9d9d9; font-weight: bold; text-decoration: none;">
    &larr; Back to 3MAH
  </a>
</p>
<hr style="border-color: #4e4e4e; margin: 0.5em 1.618em;">

              <p class="caption" role="heading"><span class="caption-text">Contents:</span></p>
<ul class="current">
<li class="toctree-l1"><a class="reference internal" href="../overview.html">Overview</a></li>
<li class="toctree-l1"><a class="reference internal" href="../install.html">Installation</a></li>
<li class="toctree-l1"><a class="reference internal" href="../quick_start.html">Quick Start</a></li>
<li class="toctree-l1"><a class="reference internal" href="../mesh.html">Geometry and Mesh (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.mesh</span></code>)</a></li>
<li class="toctree-l1"><a class="reference internal" href="../constitutive_law.html">Constitutive Law (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.constitutivelaw</span></code>)</a></li>
<li class="toctree-l1 current"><a class="reference internal" href="../weak_form.html">Weak Formulation (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.weakform</span></code>)</a><ul class="current">
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.html">fedoo.weakform.StressEquilibrium</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.ImplicitDynamic.html">fedoo.weakform.ImplicitDynamic</a></li>
<li class="toctree-l2 current"><a class="current reference internal" href="#">fedoo.weakform.StressEquilibriumRI</a><ul>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.__getitem__.html">fedoo.weakform.StressEquilibriumRI.__getitem__</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.copy.html">fedoo.weakform.StressEquilibriumRI.copy</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.get_all.html">fedoo.weakform.StressEquilibriumRI.get_all</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.get_dissipation.html">fedoo.weakform.StressEquilibriumRI.get_dissipation</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.get_storage.html">fedoo.weakform.StressEquilibriumRI.get_storage</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.get_weak_equation.html">fedoo.weakform.StressEquilibriumRI.get_weak_equation</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.initialize.html">fedoo.weakform.StressEquilibriumRI.initialize</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.iter_leaf.html">fedoo.weakform.StressEquilibriumRI.iter_leaf</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.reset.html">fedoo.weakform.StressEquilibriumRI.reset</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.set_damping.html">fedoo.weakform.StressEquilibriumRI.set_damping</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.set_dissipation.html">fedoo.weakform.StressEquilibriumRI.set_dissipation</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.set_inertia.html">fedoo.weakform.StressEquilibriumRI.set_inertia</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.set_start.html">fedoo.weakform.StressEquilibriumRI.set_start</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.set_storage.html">fedoo.weakform.StressEquilibriumRI.set_storage</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.sum.html">fedoo.weakform.StressEquilibriumRI.sum</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.to_start.html">fedoo.weakform.StressEquilibriumRI.to_start</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.update.html">fedoo.weakform.StressEquilibriumRI.update</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.update_2.html">fedoo.weakform.StressEquilibriumRI.update_2</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.__getitem__.html">fedoo.weakform.StressEquilibriumRI.__getitem__</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.corate.html">fedoo.weakform.StressEquilibriumRI.corate</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.list_weakform.html">fedoo.weakform.StressEquilibriumRI.list_weakform</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.name.html">fedoo.weakform.StressEquilibriumRI.name</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.nvar.html">fedoo.weakform.StressEquilibriumRI.nvar</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.space.html">fedoo.weakform.StressEquilibriumRI.space</a></li>
</ul>
</li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.StressEquilibriumMixed.html">fedoo.weakform.StressEquilibriumMixed</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.HeatEquation.html">fedoo.weakform.HeatEquation</a></li>

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibriumRI.get_dissipation.html (lines 1-14 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.weakform.StressEquilibriumRI.get_dissipation &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-dataframe.css?v=2082cf3c" />

grep term: "_weak"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/genindex.html (lines 760-809 · chunk range (no structural region))

        <li><a href="generated/fedoo.constraint.Pressure.copy.html#fedoo.constraint.Pressure.copy">(Pressure method)</a>
</li>
        <li><a href="generated/fedoo.weakform.RotaryInertia.copy.html#fedoo.weakform.RotaryInertia.copy">(RotaryInertia method)</a>
</li>
        <li><a href="generated/fedoo.weakform.SpringEquilibrium.copy.html#fedoo.weakform.SpringEquilibrium.copy">(SpringEquilibrium method)</a>
</li>
        <li><a href="generated/fedoo.weakform.StressEquilibrium.copy.html#fedoo.weakform.StressEquilibrium.copy">(StressEquilibrium method)</a>
</li>
        <li><a href="generated/fedoo.weakform.StressEquilibriumMixed.copy.html#fedoo.weakform.StressEquilibriumMixed.copy">(StressEquilibriumMixed method)</a>
</li>
        <li><a href="generated/fedoo.weakform.StressEquilibriumRI.copy.html#fedoo.weakform.StressEquilibriumRI.copy">(StressEquilibriumRI method)</a>
</li>
        <li><a href="generated/fedoo.constraint.SurfaceForce.copy.html#fedoo.constraint.SurfaceForce.copy">(SurfaceForce method)</a>
</li>
      </ul></li>
      <li><a href="generated/fedoo.weakform.StressEquilibrium.corate.html#fedoo.weakform.StressEquilibrium.corate">corate (StressEquilibrium property)</a>

      <ul>
        <li><a href="generated/fedoo.weakform.StressEquilibriumMixed.corate.html#fedoo.weakform.StressEquilibriumMixed.corate">(StressEquilibriumMixed property)</a>
</li>
        <li><a href="generated/fedoo.weakform.StressEquilibriumRI.corate.html#fedoo.weakform.StressEquilibriumRI.corate">(StressEquilibriumRI property)</a>
</li>
      </ul></li>
      <li><a href="generated/fedoo.time.CentralDifference.correct.html#fedoo.time.CentralDifference.correct">correct() (CentralDifference method)</a>

      <ul>
        <li><a href="generated/fedoo.time.ExplicitGeneralizedAlpha.correct.html#fedoo.time.ExplicitGeneralizedAlpha.correct">(ExplicitGeneralizedAlpha method)</a>
</li>
        <li><a href="generated/fedoo.time.ExplicitNewmark.correct.html#fedoo.time.ExplicitNewmark.correct">(ExplicitNewmark method)</a>
</li>
      </ul></li>
      <li><a href="generated/fedoo.core.BoundaryCondition.create.html#fedoo.core.BoundaryCondition.create">create() (BoundaryCondition static method)</a>

      <ul>
        <li><a href="generated/fedoo.constraint.DistributedForce.create.html#fedoo.constraint.DistributedForce.create">(DistributedForce static method)</a>
</li>
        <li><a href="generated/fedoo.constraint.Pressure.create.html#fedoo.constraint.Pressure.create">(Pressure static method)</a>
</li>
        <li><a href="generated/fedoo.constraint.SurfaceForce.create.html#fedoo.constraint.SurfaceForce.create">(SurfaceForce static method)</a>
</li>
      </ul></li>
      <li><a href="generated/fedoo.constraint.Contact.current.html#fedoo.constraint.Contact.current">current (Contact attribute)</a>

      <ul>
        <li><a href="generated/fedoo.constraint.DistributedForce.current.html#fedoo.constraint.DistributedForce.current">(DistributedForce attribute)</a>
</li>
        <li><a href="generated/fedoo.constraint.IPCContact.current.html#fedoo.constraint.IPCContact.current">(IPCContact attribute)</a>
</li>
        <li><a href="generated/fedoo.constraint.IPCSelfContact.current.html#fedoo.constraint.IPCSelfContact.current">(IPCSelfContact attribute)</a>
</li>

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/weak_form.html (lines 1-49 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="./">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Weak Formulation (fedoo.weakform) &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="_static/sg_gallery-dataframe.css?v=2082cf3c" />
      <link rel="stylesheet" type="text/css" href="_static/sg_gallery-rendered-html.css?v=1277b6f3" />
      <link rel="stylesheet" type="text/css" href="_static/sphinx-design.min.css?v=95c83b7e" />
      <link rel="stylesheet" type="text/css" href="_static/custom.css?v=26864b79" />

  
      <script src="_static/jquery.js?v=5d32c60e"></script>
      <script src="_static/_sphinx_javascript_frameworks_compat.js?v=2cd50e6c"></script>
      <script src="_static/documentation_options.js?v=8d563738"></script>
      <script src="_static/doctools.js?v=9bcbadda"></script>
      <script src="_static/sphinx_highlight.js?v=dc90522c"></script>
      <script src="_static/sg-tags.js?v=d80f6fa4"></script>
      <script src="_static/design-tabs.js?v=f930bc37"></script>
      <script async="async" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <script src="_static/js/theme.js"></script>
    <link rel="index" title="Index" href="genindex.html" />
    <link rel="search" title="Search" href="search.html" />
    <link rel="next" title="fedoo.weakform.StressEquilibrium" href="generated/fedoo.weakform.StressEquilibrium.html" />
    <link rel="prev" title="fedoo.constitutivelaw.ThermalProperties.is_initialized" href="generated/fedoo.constitutivelaw.ThermalProperties.is_initialized.html" /> 
</head>

<body class="wy-body-for-nav"> 
  <div class="wy-grid-for-nav">
    <nav data-toggle="wy-nav-shift" class="wy-nav-side">
      <div class="wy-side-scroll">
        <div class="wy-side-nav-search"  style="background: #24445C" >

          
          
          <a href="index.html">
            
              <img src="_static/fedoo_logos_ss_fond.png" class="logo" alt="Logo"/>
          </a>
<div role="search">
  <form id="rtd-search-form" class="wy-form" action="search.html" method="get">
    <input type="text" name="q" placeholder="Search docs" aria-label="Search docs" />

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.HourglassStiffness.get_weak_equation.html (lines 1-14 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.weakform.HourglassStiffness.get_weak_equation &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-dataframe.css?v=2082cf3c" />

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/genindex.html (lines 760-809 · chunk range (no structural region))

        <li><a href="generated/fedoo.weakform.StressEquilibrium.copy.html#fedoo.weakform.StressEquilibrium.copy">(StressEquilibrium method)</a>
</li>
        <li><a href="generated/fedoo.weakform.StressEquilibriumMixed.copy.html#fedoo.weakform.StressEquilibriumMixed.copy">(StressEquilibriumMixed method)</a>
</li>
        <li><a href="generated/fedoo.weakform.StressEquilibriumRI.copy.html#fedoo.weakform.StressEquilibriumRI.copy">(StressEquilibriumRI method)</a>
</li>
      </ul></li>
      <li><a href="generated/fedoo.weakform.StressEquilibrium.corate.html#fedoo.weakform.StressEquilibrium.corate">corate (StressEquilibrium property)</a>

      <ul>
        <li><a href="generated/fedoo.weakform.StressEquilibriumMixed.corate.html#fedoo.weakform.StressEquilibriumMixed.corate">(StressEquilibriumMixed property)</a>
</li>
        <li><a href="generated/fedoo.weakform.StressEquilibriumRI.corate.html#fedoo.weakform.StressEquilibriumRI.corate">(StressEquilibriumRI property)</a>
</li>
      </ul></li>

grep term: "fedoo.weakform.StressEquilibriumRI.get_weak_equation"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibriumRI.get_weak_equation.html (lines 1-12 · chunk range (no structural region))



<!DOCTYPE html>
<html class="writer-html5" lang="en" data-content_root="../">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fedoo.weakform.StressEquilibriumRI.get_weak_equation &mdash; Fedoo 1.0.0 (stable)</title>
      <link rel="stylesheet" type="text/css" href="../_static/pygments.css?v=b86133f3" />
      <link rel="stylesheet" type="text/css" href="../_static/css/theme.css?v=9edc463e" />
      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery.css?v=fd6457a4" />

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibriumRI.get_weak_equation.html (lines 13-13 · chunk range (no structural region))

      <link rel="stylesheet" type="text/css" href="../_static/sg_gallery-binder.css?v=f4aeca0c" />

## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.weakform.StressEquilibriumRI.html (lines 50-99 · chunk range (no structural region))

    <input type="hidden" name="area" value="default" />
  </form>
</div>
        </div><div class="wy-menu wy-menu-vertical" data-spy="affix" role="navigation" aria-label="Navigation menu">
<p style="padding: 0.5em 1.618em; margin-bottom: 0;">
  <a href="https://3mah.github.io/" style="color: #d9d9d9; font-weight: bold; text-decoration: none;">
    &larr; Back to 3MAH
  </a>
</p>
<hr style="border-color: #4e4e4e; margin: 0.5em 1.618em;">

              <p class="caption" role="heading"><span class="caption-text">Contents:</span></p>
<ul class="current">
<li class="toctree-l1"><a class="reference internal" href="../overview.html">Overview</a></li>
<li class="toctree-l1"><a class="reference internal" href="../install.html">Installation</a></li>
<li class="toctree-l1"><a class="reference internal" href="../quick_start.html">Quick Start</a></li>
<li class="toctree-l1"><a class="reference internal" href="../mesh.html">Geometry and Mesh (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.mesh</span></code>)</a></li>
<li class="toctree-l1"><a class="reference internal" href="../constitutive_law.html">Constitutive Law (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.constitutivelaw</span></code>)</a></li>
<li class="toctree-l1 current"><a class="reference internal" href="../weak_form.html">Weak Formulation (<code class="xref py py-mod docutils literal notranslate"><span class="pre">fedoo.weakform</span></code>)</a><ul class="current">
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.StressEquilibrium.html">fedoo.weakform.StressEquilibrium</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.ImplicitDynamic.html">fedoo.weakform.ImplicitDynamic</a></li>
<li class="toctree-l2 current"><a class="current reference internal" href="#">fedoo.weakform.StressEquilibriumRI</a><ul>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.__getitem__.html">fedoo.weakform.StressEquilibriumRI.__getitem__</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.copy.html">fedoo.weakform.StressEquilibriumRI.copy</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.get_all.html">fedoo.weakform.StressEquilibriumRI.get_all</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.get_dissipation.html">fedoo.weakform.StressEquilibriumRI.get_dissipation</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.get_storage.html">fedoo.weakform.StressEquilibriumRI.get_storage</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.get_weak_equation.html">fedoo.weakform.StressEquilibriumRI.get_weak_equation</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.initialize.html">fedoo.weakform.StressEquilibriumRI.initialize</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.iter_leaf.html">fedoo.weakform.StressEquilibriumRI.iter_leaf</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.reset.html">fedoo.weakform.StressEquilibriumRI.reset</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.set_damping.html">fedoo.weakform.StressEquilibriumRI.set_damping</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.set_dissipation.html">fedoo.weakform.StressEquilibriumRI.set_dissipation</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.set_inertia.html">fedoo.weakform.StressEquilibriumRI.set_inertia</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.set_start.html">fedoo.weakform.StressEquilibriumRI.set_start</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.set_storage.html">fedoo.weakform.StressEquilibriumRI.set_storage</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.sum.html">fedoo.weakform.StressEquilibriumRI.sum</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.to_start.html">fedoo.weakform.StressEquilibriumRI.to_start</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.update.html">fedoo.weakform.StressEquilibriumRI.update</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.update_2.html">fedoo.weakform.StressEquilibriumRI.update_2</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.__getitem__.html">fedoo.weakform.StressEquilibriumRI.__getitem__</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.corate.html">fedoo.weakform.StressEquilibriumRI.corate</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.list_weakform.html">fedoo.weakform.StressEquilibriumRI.list_weakform</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.name.html">fedoo.weakform.StressEquilibriumRI.name</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.nvar.html">fedoo.weakform.StressEquilibriumRI.nvar</a></li>
<li class="toctree-l3"><a class="reference internal" href="fedoo.weakform.StressEquilibriumRI.space.html">fedoo.weakform.StressEquilibriumRI.space</a></li>
</ul>
</li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.StressEquilibriumMixed.html">fedoo.weakform.StressEquilibriumMixed</a></li>
<li class="toctree-l2"><a class="reference internal" href="fedoo.weakform.HeatEquation.html">fedoo.weakform.HeatEquation</a></li>
</rag-context>