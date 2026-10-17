<rag-context>
[pi-local-rag] RAG subagent: 2 sources, 47346 ms retrieval.
### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.mesh.rectangle_mesh.html — fedoo.mesh.rectangle_mesh (lines 127–159)

```
<section id="fedoo-mesh-rectangle-mesh">
<h1>fedoo.mesh.rectangle_mesh</h1>
<dl class="py function">
<dt class="sig sig-object py" id="fedoo.mesh.rectangle_mesh">
<span class="pre">rectangle_mesh</span><span class="sig-paren">(</span><span class="pre">nx</span><span class="o">=</span><span class="pre">11</span>, <span class="pre">ny</span><span class="o">=</span><span class="pre">11</span>, <span class="pre">x_min</span><span class="o">=</span><span class="pre">0</span>, <span class="pre">x_max</span><span class="o">=</span><span class="pre">1</span>, <span class="pre">y_min</span><span class="o">=</span><span class="pre">0</span>, <span class="pre">y_max</span><span class="o">=</span><span class="pre">1</span>, <span class="pre">elm_type</span><span class="o">=</span><span class="pre">'quad4'</span>, <span class="pre">ndim</span><span class="o">=</span><span class="pre">None</span>, <span class="pre">name</span><span class="o">=</span><span class="pre">''</span><span class="sig-paren">)</span>
</dt>
<dd><p>Create a rectangular Mesh</p>
<dl class="field-list simple">
<dt class="field-odd">Parameters<span class="colon">:</span></dt>
<dd class="field-odd"><ul class="simple">
<li><p><strong>nx</strong> (<em>int</em>) – Numbers of nodes in the x and y axes (default = 11).</p></li>
<li><p><strong>ny</strong> (<em>int</em>) – Numbers of nodes in the x and y axes (default = 11).</p></li>
<li><p><strong>x_min</strong> (<em>int</em><em>,</em><em>float</em>) – The boundary of the square (default : 0, 1, 0, 1).</p></li>
<li><p><strong>x_max</strong> (<em>int</em><em>,</em><em>float</em>) – The boundary of the square (default : 0, 1, 0, 1).</p></li>
<li><p><strong>y_min</strong> (<em>int</em><em>,</em><em>float</em>) – The boundary of the square (default : 0, 1, 0, 1).</p></li>
<li><p><strong>y_max</strong> (<em>int</em><em>,</em><em>float</em>) – The boundary of the square (default : 0, 1, 0, 1).</p></li>
<li><p><strong>elm_type</strong> (<em>{'tri3'</em><em>, </em><em>'quad4'</em><em>, </em><em>'quad8'</em><em>, </em><em>'quad9'}</em>) – <p>The type of the element generated (default=’quad4’)</p>
<ul>
<li><p>’tri3’ – 3 node linear triangular mesh</p></li>
<li><p>’tri6’ – 6 node linear triangular mesh</p></li>
<li><p>’quad4’ – 4 node quadrangular mesh</p></li>
<li><p>’quad8’ – 8 node quadrangular mesh (à tester)</p></li>
<li><p>’quad9’ – 9 node quadrangular mesh</p></li>
</ul>
</p></li>
</ul>
</dd>
<dt class="field-even">Returns<span class="colon">:</span></dt>
<dd class="field-even"><p>The generated geometry in Mesh format. See the Mesh class for more details.</p>
</dd>
<dt class="field-odd">Return type<span class="colon">:</span></dt>
<dd class="field-odd"><p>Mesh</p>
</dd>
</dl>
</dd></dl>
</section>
```

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/mesh/__init__.py — Mesh Creation Functions (lines 41–66, 88–92)

```
.. _build_simple_mesh:

Mesh Creation Functions
===============================

.. autosummary::
   :toctree: generated/

   rectangle_mesh
   box_mesh
   disk_mesh
   hole_plate_mesh
   hollow_disk_mesh
   I_shape_mesh
   line_mesh_1D
   line_mesh
   line_mesh_cylindric
   circle_mesh
   grid_mesh_cylindric
   generate_cylindrical_local_frame
   structured_mesh_2D
   generate_nodes
```

```
from .simple import (
    stack,
    rectangle_mesh,
    grid_mesh_cylindric,
    line_mesh_1D,
    line_mesh,
    line_mesh_cylindric,
    circle_mesh,
    box_mesh,
)
```
</rag-context>