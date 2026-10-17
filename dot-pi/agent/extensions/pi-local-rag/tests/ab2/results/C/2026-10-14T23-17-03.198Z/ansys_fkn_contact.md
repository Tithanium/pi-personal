<rag-context>
[pi-local-rag] RAG subagent: 15 sources, 30391 ms retrieval.
grep term: "FKN"

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

grep term: "real"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 6584-6614 · enclosing doc section)

3.16.4.1. Real Constants BSRL and KSYM
BSRL
Real Constants BSRL is generally the real constant set ID of the original contact pair before splitting.
The program typically assigns this value to the sub-pairs during the splitting operation. BSRL can
have other values as shown in the table below.
Indicates the contact pair has not been split.
BSRL = 0 (default)
This number equals the original real
constant set ID and is set automatically by
the split logic after contact pair-splitting.
BSRL = positive
number
Indicates the contact pair will not be split
(specified either by the program or by the
user).
BSRL = -1
During the split operation, the program automatically sets BSRL = -1 for contact pairs associated
with the following feature which are not compatible with contact splitting:
Wear analysis (TB,WEAR)
MPC surface-based constraints
Rigid-to-rigid contact
Impact constraints (KEYOPT(7) = 4 on the contact element)
In addition, you can predefine BSRL = -1 for any contact pair that you do not want to split when
CNCHECK,SPLIT or CNCHECK,DMP is issued. For example, you should always set BSRL = -1 for
contact pairs that will have fluid penetration loading applied.
KSYM
The splitting logic supports rigid-flexible contact and flexible-flexible contact. It automatically deletes
inactive contact pairs due to auto-asymmetric contact pair selection (KEYOPT(8) = 2 or 3).
For symmetric contact and self contact pairs, the program automatically sets KSYM during the
splitting operation. For any symmetric contact pair, KSYM points to the real constant set ID of its
companion pair. For self contact pairs, KSYM simply points to its own real constant set ID.

grep term: "contact"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/Main_documentation_fedoo/generated/fedoo.constraint.Contact.html (lines 101-150 · chunk range (no structural region))

      <div class="wy-nav-content">
        <div class="rst-content style-external-links">
          <div role="navigation" aria-label="Page navigation">
  <ul class="wy-breadcrumbs">
      <li><a href="../index.html" class="icon icon-home" aria-label="Home"></a></li>
          <li class="breadcrumb-item"><a href="../boundary_conditions.html">Boundary conditions and constraints</a></li>
      <li class="breadcrumb-item active">fedoo.constraint.Contact</li>
      <li class="wy-breadcrumbs-aside">
            <a href="../_sources/generated/fedoo.constraint.Contact.rst.txt" rel="nofollow"> View page source</a>
      </li>
  </ul>
  <hr/>
</div>
          <div role="main" class="document" itemscope="itemscope" itemtype="http://schema.org/Article">
           <div itemprop="articleBody">
             
  <section id="fedoo-constraint-contact">
<h1>fedoo.constraint.Contact<a class="headerlink" href="#fedoo-constraint-contact" title="Link to this heading"></a></h1>
<dl class="py class">
<dt class="sig sig-object py" id="fedoo.constraint.Contact">
<em class="property"><span class="pre">class</span><span class="w"> </span></em><span class="sig-name descname"><span class="pre">Contact</span></span><span class="sig-paren">(</span><em class="sig-param"><span class="n"><span class="pre">slave_nodes</span></span><span class="p"><span class="pre">:</span></span><span class="w"> </span><span class="n"><span class="pre">list</span><span class="p"><span class="pre">[</span></span><span class="pre">int</span><span class="p"><span class="pre">]</span></span><span class="w"> </span><span class="p"><span class="pre">|</span></span><span class="w"> </span><a class="reference internal" href="fedoo.Mesh.html#fedoo.Mesh" title="fedoo.core.mesh.Mesh"><span class="pre">Mesh</span></a></span></em>, <em class="sig-param"><span class="n"><span class="pre">surface_mesh</span></span><span class="p"><span class="pre">:</span></span><span class="w"> </span><span class="n"><a class="reference internal" href="fedoo.Mesh.html#fedoo.Mesh" title="fedoo.core.mesh.Mesh"><span class="pre">Mesh</span></a></span></em>, <em class="sig-param"><span class="n"><span class="pre">normal_law</span></span><span class="p"><span class="pre">:</span></span><span class="w"> </span><span class="n"><span class="pre">str</span></span><span class="w"> </span><span class="o"><span class="pre">=</span></span><span class="w"> </span><span class="default_value"><span class="pre">'linear'</span></span></em>, <em class="sig-param"><span class="n"><span class="pre">search_algorithm</span></span><span class="p"><span class="pre">:</span></span><span class="w"> </span><span class="n"><span class="pre">str</span></span><span class="w"> </span><span class="o"><span class="pre">=</span></span><span class="w"> </span><span class="default_value"><span class="pre">'bucket'</span></span></em>, <em class="sig-param"><span class="n"><span class="pre">name</span></span><span class="p"><span class="pre">:</span></span><span class="w"> </span><span class="n"><span class="pre">str</span></span><span class="w"> </span><span class="o"><span class="pre">=</span></span><span class="w"> </span><span class="default_value"><span class="pre">'Contact</span> <span class="pre">nodes</span> <span class="pre">2</span> <span class="pre">surface'</span></span></em>, <em class="sig-param"><span class="n"><span class="pre">space</span></span><span class="p"><span class="pre">:</span></span><span class="w"> </span><span class="n"><span class="pre">ModelingSpace</span><span class="w"> </span><span class="p"><span class="pre">|</span></span><span class="w"> </span><span class="pre">None</span></span><span class="w"> </span><span class="o"><span class="pre">=</span></span><span class="w"> </span><span class="default_value"><span class="pre">None</span></span></em><span class="sig-paren">)</span><a class="headerlink" href="#fedoo.constraint.Contact" title="Link to this definition"></a></dt>
<dd><p>Contact Assembly based on a node 2 surface formulation</p>
<dl class="py method">
<dt class="sig sig-object py" id="fedoo.constraint.Contact.__init__">
<span class="sig-name descname"><span class="pre">__init__</span></span><span class="sig-paren">(</span><em class="sig-param"><span class="n"><span class="pre">slave_nodes</span></span><span class="p"><span class="pre">:</span></span><span class="w"> </span><span class="n"><span class="pre">list</span><span class="p"><span class="pre">[</span></span><span class="pre">int</span><span class="p"><span class="pre">]</span></span><span class="w"> </span><span class="p"><span class="pre">|</span></span><span class="w"> </span><a class="reference internal" href="fedoo.Mesh.html#fedoo.Mesh" title="fedoo.core.mesh.Mesh"><span class="pre">Mesh</span></a></span></em>, <em class="sig-param"><span class="n"><span class="pre">surface_mesh</span></span><span class="p"><span class="pre">:</span></span><span class="w"> </span><span class="n"><a class="reference internal" href="fedoo.Mesh.html#fedoo.Mesh" title="fedoo.core.mesh.Mesh"><span class="pre">Mesh</span></a></span></em>, <em class="sig-param"><span class="n"><span class="pre">normal_law</span></span><span class="p"><span class="pre">:</span></span><span class="w"> </span><span class="n"><span class="pre">str</span></span><span class="w"> </span><span class="o"><span class="pre">=</span></span><span class="w"> </span><span class="default_value"><span class="pre">'linear'</span></span></em>, <em class="sig-param"><span class="n"><span class="pre">search_algorithm</span></span><span class="p"><span class="pre">:</span></span><span class="w"> </span><span class="n"><span class="pre">str</span></span><span class="w"> </span><span class="o"><span class="pre">=</span></span><span class="w"> </span><span class="default_value"><span class="pre">'bucket'</span></span></em>, <em class="sig-param"><span class="n"><span class="pre">name</span></span><span class="p"><span class="pre">:</span></span><span class="w"> </span><span class="n"><span class="pre">str</span></span><span class="w"> </span><span class="o"><span class="pre">=</span></span><span class="w"> </span><span class="default_value"><span class="pre">'Contact</span> <span class="pre">nodes</span> <span class="pre">2</span> <span class="pre">surface'</span></span></em>, <em class="sig-param"><span class="n"><span class="pre">space</span></span><span class="p"><span class="pre">:</span></span><span class="w"> </span><span class="n"><span class="pre">ModelingSpace</span><span class="w"> </span><span class="p"><span class="pre">|</span></span><span class="w"> </span><span class="pre">None</span></span><span class="w"> </span><span class="o"><span class="pre">=</span></span><span class="w"> </span><span class="default_value"><span class="pre">None</span></span></em><span class="sig-paren">)</span><a class="headerlink" href="#fedoo.constraint.Contact.__init__" title="Link to this definition"></a></dt>
<dd><p>Contact Assembly based on a node 2 surface penality formulation.</p>
<dl class="field-list simple">
<dt class="field-odd">Parameters<span class="colon">:</span></dt>
<dd class="field-odd"><ul class="simple">
<li><p><strong>slave_nodes</strong> (<em>numpy array</em><em> of </em><em>int</em><em> or </em><a class="reference internal" href="fedoo.Mesh.html#fedoo.Mesh" title="fedoo.Mesh"><em>Mesh</em></a>) – List of nodes indices: nodes that belong to the slave surface
or Mesh of the slave surface (in this case, the slave node indices
are extracted).</p></li>
<li><p><strong>surface_mesh</strong> (<a class="reference internal" href="fedoo.Mesh.html#fedoo.Mesh" title="fedoo.Mesh"><em>fedoo.Mesh</em></a>) – Mesh of the master surface</p></li>
<li><p><strong>normal_law</strong> (<em>str in {'linear'</em><em>, </em><em>'bilinear'}</em><em>, </em><em>default = 'linear'</em>) – Type of contact law for the normal contact.</p></li>
<li><p><strong>name</strong> (<em>str</em>) – The name of contact assembly</p></li>
<li><p><strong>space</strong> (<em>ModelingSpace</em>) – Modeling space associated to the weakform. If None is specified,
the active ModelingSpace is considered.</p></li>
</ul>
</dd>
</dl>
<p class="rubric">Notes</p>
<dl class="simple">
<dt>Several attributes can be modified to change the contact behavior:</dt><dd><ul class="simple">
<li><p>eps_n: contact penalty parameter. Need to be adjusted depending of
the rigidity of the material in contact.</p></li>
<li><p>clearance: Contact clearance to adjust the two surfaces.</p></li>
<li><p>contact_search_once: If True (default), the elmement in contact
are only searched at the begining of iteration.
It avoid oscilations between contact and non contact state during
the NR iterations.</p></li>

grep term: "ANSYS"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 1-46 · chunk range (no structural region))

Command Reference
Release 2026 R1
ANSYS, Inc.
March 2026
Southpointe
2600 Ansys Drive
Canonsburg, PA 15317
ANSYS, Inc. and
ANSYS Europe,
ansysinfo@ansys.com
Ltd. are UL
http://www.ansys.com
registered ISO
(T) 724-746-3304
(F) 724-514-9494
9001: 2015
companies.

Copyright and Trademark Information
Copyright © 2026 Synopsys, Inc. and ANSYS, Inc. This Synopsys product and all associated documentation are
proprietary to ANSYS, Inc. and Synopsys, Inc. and may only be used pursuant to the terms and conditions of a
written license agreement. All other use, reproduction, modification or distribution of the Synopsys product or
the associated documentation is strictly prohibited.
ANSYS, Ansys Workbench, AUTODYN, CFX, FLUENT and any and all ANSYS, Inc. brand, product, service and feature
names, logos and slogans are registered trademarks or trademarks of ANSYS, Inc. or its subsidiaries located in the
United States or other countries. ICEM CFD is a trademark used by ANSYS, Inc. under license. CFX is a trademark
of Sony Corporation in Japan. All other brand, product, service and feature names or trademarks are the property
of their respective owners. FLEXlm and FLEXnet are trademarks of Flexera Software LLC.
Disclaimer Notice
THIS ANSYS SOFTWARE PRODUCT AND PROGRAM DOCUMENTATION INCLUDE TRADE SECRETS AND ARE CONFID-
ENTIAL AND PROPRIETARY PRODUCTS OF ANSYS, INC., ITS SUBSIDIARIES, OR LICENSORS. The software products
and documentation are furnished by ANSYS, Inc., its subsidiaries, or affiliates under a software license agreement
that contains provisions concerning non-disclosure, copying, length and nature of use, compliance with exporting
laws, warranties, disclaimers, limitations of liability, and remedies, and other provisions. The software products
and documentation may be used, disclosed, transferred, or copied only in accordance with the terms and conditions
of that software license agreement.
ANSYS, Inc. and ANSYS Europe, Ltd. are UL registered ISO 9001: 2015 companies.
U.S. Government Rights
For U.S. Government users, except as specifically granted by the ANSYS, Inc. software license agreement, the use,
duplication, or disclosure by the United States Government is subject to restrictions stated in the ANSYS, Inc.
software license agreement and FAR 12.212 (for non-DOD licenses).
Third-Party Software
See the legal information in the product help files for the complete Legal Notice for ANSYS proprietary software
and third-party software. If you are unable to access the Legal Notice, contact ANSYS, Inc.
Published in the U.S.A.


## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 1-46 · chunk range (no structural region))

Element Reference
Release 2026 R1
ANSYS, Inc.
March 2026
Southpointe
2600 Ansys Drive
Canonsburg, PA 15317
ANSYS, Inc. and
ANSYS Europe,
ansysinfo@ansys.com
Ltd. are UL
http://www.ansys.com
registered ISO
(T) 724-746-3304
(F) 724-514-9494
9001: 2015
companies.

Copyright and Trademark Information
Copyright © 2026 Synopsys, Inc. and ANSYS, Inc. This Synopsys product and all associated documentation are
proprietary to ANSYS, Inc. and Synopsys, Inc. and may only be used pursuant to the terms and conditions of a
written license agreement. All other use, reproduction, modification or distribution of the Synopsys product or
the associated documentation is strictly prohibited.
ANSYS, Ansys Workbench, AUTODYN, CFX, FLUENT and any and all ANSYS, Inc. brand, product, service and feature
names, logos and slogans are registered trademarks or trademarks of ANSYS, Inc. or its subsidiaries located in the
United States or other countries. ICEM CFD is a trademark used by ANSYS, Inc. under license. CFX is a trademark
of Sony Corporation in Japan. All other brand, product, service and feature names or trademarks are the property
of their respective owners. FLEXlm and FLEXnet are trademarks of Flexera Software LLC.
Disclaimer Notice
THIS ANSYS SOFTWARE PRODUCT AND PROGRAM DOCUMENTATION INCLUDE TRADE SECRETS AND ARE CONFID-
ENTIAL AND PROPRIETARY PRODUCTS OF ANSYS, INC., ITS SUBSIDIARIES, OR LICENSORS. The software products
and documentation are furnished by ANSYS, Inc., its subsidiaries, or affiliates under a software license agreement
that contains provisions concerning non-disclosure, copying, length and nature of use, compliance with exporting
laws, warranties, disclaimers, limitations of liability, and remedies, and other provisions. The software products
and documentation may be used, disclosed, transferred, or copied only in accordance with the terms and conditions
of that software license agreement.
ANSYS, Inc. and ANSYS Europe, Ltd. are UL registered ISO 9001: 2015 companies.
U.S. Government Rights
For U.S. Government users, except as specifically granted by the ANSYS, Inc. software license agreement, the use,
duplication, or disclosure by the United States Government is subject to restrictions stated in the ANSYS, Inc.
software license agreement and FAR 12.212 (for non-DOD licenses).
Third-Party Software
See the legal information in the product help files for the complete Legal Notice for ANSYS proprietary software
and third-party software. If you are unable to access the Legal Notice, contact ANSYS, Inc.
Published in the U.S.A.

grep term: "Mechanical"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt (lines 1275-1361 · enclosing doc section)

1.2.1. Applicable Products
This document applies to the following family of products:
Ansys Mechanical Pro (structural, full thermal, and vibration analysis)
Ansys Mechanical Premium (nonlinear structural, full thermal, vibration, linear dynamics
analysis)
Ansys Mechanical Enterprise (advanced nonlinear structural, full thermal, vibration, linear
dynamics and nonlinear transient dynamics, fracture, acoustics, full coupled-field, hydrodynam-
ics)
Ansys Mechanical Enterprise PrepPost
Ansys Mechanical Enterprise Solver (batch mode)
Note:
While connection capabilities and High Performance Computing are included as part
of the release distribution, they are separately licensed and separately installed
products. Contact your Support Representative if you want to install and run any of
these separately licensed products at your site.
1.2.2.Valid Products
Some elements are only valid in a subset of the Applicable Products (p. 2). The valid products for
each element appear (as abbreviations) in the Valid Products list, below and to the right of each
short element description.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
2
About This Reference

The abbreviations correspond to the products as shown in this table:
Abbreviation
Product
Pro
Ansys Mechanical Pro
Premium
Ansys Mechanical Premium
Enterprise
Ansys Mechanical Enterprise
PrepPost
Ansys Mechanical Enterprise PrepPost
Solver
Ansys Mechanical Enterprise Solver
AS add-on
Additive Suite add-on (requires one of
the Enterprise products)
If the abbreviation in the Valid Products list is dark bold, the element is valid in that product. If the
abbreviation is light gray ("grayed out"), the element is not valid or applicable and should not be
used in that product. For example,
Valid Products: Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
indicates the element is valid in Ansys Mechanical Pro, Ansys Mechanical Premium, Ansys Mechanical
Enterprise, and Ansys Mechanical Enterprise Solver, but not in or Ansys Mechanical Enterprise PrepPost.
The "AS add-on" code behaves a bit differently. When this code is bold, the element is only available
in the Additive Suite, an add-on to any of the Enterprise products.
Even if an element is shown as valid in a particular product, some features of that element may be
invalid in that product. Any invalid features of an otherwise valid element are documented in the
Product Restrictions section of that element documentation.
3
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Conventions Used in This Reference

Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
4

Chapter 2: Element Classifications
A large library of element types is available for use in your analysis. To help you select elements for
your analysis, basic characteristics of the element types are described here.
The following topics related to element types and classifications are available:
2.1. Overview of Element Characteristics
2.2. Summary of Element Types
2.3. Selecting Elements for Your Analysis
2.4. Legacy vs. Current Element Technologies
2.5. Degenerated Shape Elements
2.6. Special-Purpose Elements
2.7. GUI-Inaccessible Elements
Detailed descriptions for each element type are given in Element Library (p. 137).
2.1. Overview of Element Characteristics
The following element overview topics are available:
2.1.1. Identifying Element Types
2.1.2. 2D vs. 3D Elements
2.1.3. Element Shape Characteristics
2.1.4. Element Degrees of Freedom and Discipline
2.1.5. User-Defined Elements
2.1.6. Forward Solving vs. Inverse Solving
2.1.1. Identifying Element Types
An element type is identified by a name of up to eight characters, such as PIPE288 (p. 1500), consisting
of a group label and a unique ID number. In this example, the group label is PIPE and the number is
288.
The element descriptions in Element Library (p. 137) are arranged in order of the identification numbers.
To select an element from the library for use in your analysis, input its full name (such as pipe288)
or number (such as 288) via ET.

grep term: "APDL"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Substructuring_Analysis_Guide.txt (lines 2893-3092 · enclosing doc section)

...
...
5.4.5.2. Input Listing
This input file fragment shows how to create a superelement from an existing superelement, apply
offsets to the node and element IDs, and then expand it in the transformed location. (All other input
remains the same, as shown in Input Listing (p. 45).)
.
.
.
! STEP #3
! Generation pass
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
58
Component Mode Synthesis Example

! Generation pass 1
/filnam,part1
/solu
antype,substr
seopt,part1,2
cmsopt,fix,10
cmsel,s,part1
cmsel,s,interface1
m,all,all
nsle
solve
finish
save
! Generation pass 2
/filnam,part2
/solu
antype,substr
seopt,part2,2
cmsopt,fix,10
cmsel,s,part2
cmsel,s,interface2
m,all,all
nsle
solve
finish
save
! No generation pass is necessary for PART3. We will
! create the third component of the model from the existing 
! superelement PART2 and name it PART2SYM
! STEP #4
! Use pass
/clear,nostart
/filnam,use
/prep7
et,1,matrix50
type,1
! Define the three superelements to use in the model
se,part1
se,part2
*get,nmax,node,,num,max
sesymm,part2,x,nmax,part2sym,sub
se,part2sym
cpintf,all,0.001
finish
/solu
antype,modal
modopt,lanb,10
mxpand,10
solve
finish
! STEP #5
! Expansion pass
! Expansion pass 1
/clear,nostart
/filnam,part1
resume
59
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Modal Analysis of a 2D Tuning Fork

/solu
expass,on
seexp,part1,use
expsol,1,4
solve
finish
! Expansion pass 2
/clear,nostart
/filnam,part2
resume
/solu
expass,on
seexp,part2,use
expsol,1,4
solve
finish
! Obtain the third part of the model from PART2
! Expand the solution in the transformed location
/assign,rst,part2sym,rst
/solu
expass,on
seexp,part2sym,use,,on
!     Offset node and element IDs in the new superelement
rstoff,node,10000
rstoff,elem,10000
expsol,1,4
solve
finish
! STEP #6
! Reads results for "load step 1 - substep 4"
! Specify the data file where results are to be found
/clear,nostart
/post1
cmsfile,add,part1,rst
cmsfile,add,part2,rst
cmsfile,add,part2sym,rst
5.4.6. Reduce the Damping Matrix and Compare Full and CMS Results with
RSTMAC
This section demonstrates how to introduce damping in the tuning fork model described in Modal
Analysis of a 2D Tuning Fork (p. 40). RSTMAC is then used to compare complex results obtained by
the full and CMS models. The procedure is as follows:
1. The modal analysis is performed for the full model with nodes located at y=0 fixed. Damping is
introduced in one zone of part 2 and one zone of part 3 using a material mass matrix multiplier
(MP,ALPD) and a material stiffness matrix multiplier (MP,BETD):
/batch,list
/title, 2D Tuning Fork with damping
! Include the geometry, material properties
/input,full_model,inp
/filname,fork_full
/prep7
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
60
Component Mode Synthesis Example

! Fix base
nsel,s,loc,y,0,0
d,all,all
allsel,all
! Damping elements
et,2,plane182,,,3
r,1,tthk
mp,ex,2,190e9
mp,dens,2,7.7e3
mp,nuxy,2,0.3
mp,alpd,2,.1        ! Mass matrix multiplier 
mp,betd,2,1e-6      ! Stiffness matrix multiplier 
type,2
mat,2
esel,s,,,501,652    ! Damped material applied on a zone of part 2
emodif,all
et,3,plane182,,,3
r,1,tthk
mp,ex,3,190e9
mp,dens,3,7.7e3
mp,nuxy,3,0.3
mp,alpd,3,.1
mp,betd,3,2e-6
type,3
mat,3
esel,s,,,781,932    ! Damped material applied on a zone of part 3
emodif,all
allsel,all
fini
save
/sol
antype,modal
modopt,qrdamp,8,,,on   ! QRDAMP solver is used to extract the complex eigenmodes
mxpand,all
solve
fini
! Print real and imaginary parts of some modes for nodes 1 to 20
/post1
nsel,s,node,,1,20
set,list   ! Print a summary of load step and substeps
set,1,1    ! Real part
prdi
set,1,1,,2 ! Imaginary part
prdi
set,1,4    ! Real part
prdi
set,1,4,,2 ! Imaginary part
prdi
fini
2. The analysis is performed using a CMS analysis with fixed-interface method:
/clear,nostart
/input,full_model,inp
/filname,fork_cms_fixed
/prep7
61
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Modal Analysis of a 2D Tuning Fork

! Fix base
nsel,s,loc,y,0,0
d,all,all
allsel,all
! Damping element
et,2,plane182,,,3
r,1,tthk
mp,ex,2,190e9
mp,dens,2,7.7e3

grep term: "thickness"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/constitutivelaw/shell.py (lines 576-582 · enclosing function/class)

    def __init__(
        self,
        list_mat,
        list_thickness,
        n_thickness_points=3,
        k=1,
        name="",

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/constitutivelaw/shell.py (lines 814-871 · enclosing function/class)

    def get_stress_distribution(self, assembly, pg, resolution=None):
        """Return layerwise stresses at one shell Gauss point.

        Without ``resolution``, values are returned at the actual material
        integration points. With ``resolution``, each layer is sampled
        independently so stress jumps at material interfaces are preserved.
        """
        if self._material_assemblies is None:
            raise RuntimeError("The shell law has not been initialized.")
        if not 0 <= pg < self._n_shell_points:
            raise IndexError("pg is outside the shell Gauss-point range.")
        if resolution is not None and resolution < 2:
            raise ValueError("resolution must be at least two.")

        shell_strain = assembly.sv["ShellStrain"]
        shear_strain = np.array(
            [
                (0.0 if np.isscalar(shell_strain[index]) else shell_strain[index][pg])
                for index in [6, 7]
            ]
        )
        z_values = []
        stress_values = []
        for layer, material_assembly in enumerate(self._material_assemblies):
            layer_stress = (
                material_assembly.sv["Stress"]
                .asarray()[
                    :,
                    pg :: self._n_shell_points,
                ]
                .copy()
            )
            layer_stress[4:6] = self._shear_matrices[layer] @ shear_strain[:, None]
            layer_z = self._layer_z[layer]

            if resolution is not None:
                output_z = np.linspace(
                    self._interfaces[layer],
                    self._interfaces[layer + 1],
                    resolution,
                )
                layer_stress = np.array(
                    [
                        np.interp(output_z, layer_z, component)
                        for component in layer_stress
                    ]
                )
                layer_z = output_z

            z_values.append(layer_z)
            stress_values.append(layer_stress)

        return (
            np.concatenate(z_values),
            StressTensorList(np.concatenate(stress_values, axis=1)),
        )



## 003 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_fedoo/_archive_Code_source_fedoo_1.0.0/fedoo/constitutivelaw/shell.py (lines 344-350 · enclosing function/class)

    def __init__(
        self,
        material,
        thickness,
        n_thickness_points=5,
        k=1,
        name="",

grep term: "Normal"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Modeling_and_Meshing_Guide.txt (lines 5488-5687 · enclosing doc section)

  Any                         214             59             0        27.57 %
 ------------------------------------------------------------------------------
7.5.8.4.Viewing Current Shape Parameter Limits
The output below is from the SHPP,STATUS command. It lists the element shape parameters and
default shape parameter limits. By default, when an element's shape falls outside of these limits, a
warning or error condition occurs. See Changing Shape Parameter Limits (p. 155) for information
about how to change the limits.
This output shows the default shape parameter limits. If you modify any of these limits or turn off
any of the individual shape tests, your output will differ accordingly.
In most cases in the output below, "FACE" also means "cross-section of solid element." For example,
the ASPECT RATIO limits apply to both faces and cross-sections of tetrahedra, hexahedra (bricks),
pyramids, and wedges.
 ASPECT RATIO (EXCEPT EMAG)
    QUAD OR TRIANGLE ELEMENT OR FACE
         WARNING TOLERANCE ( 1) =   20.00000    
         ERROR TOLERANCE   ( 2) =   1000000.     
 DEVIATION FROM PARALLEL OPPOSITE EDGES IN DEGREES    (EXCEPT EMAG)
    QUAD ELEMENT OR FACE WITHOUT MIDSIDE NODES
         WARNING TOLERANCE (11) =   70.00000    
         ERROR TOLERANCE   (12) =   150.0000    
    QUAD OR QUAD FACE WITH MIDSIDE NODES
         WARNING TOLERANCE (13) =   100.0000    
         ERROR TOLERANCE   (14) =   170.0000    
 MAXIMUM CORNER ANGLE IN DEGREES (EXCEPT EMAG)
    TRIANGLE ELEMENT OR FACE
         WARNING TOLERANCE (15) =   165.0000    
         ERROR TOLERANCE   (16) =   179.9000    
    QUAD ELEMENT OR FACE WITHOUT MIDSIDE NODES
         WARNING TOLERANCE (17) =   155.0000    
         ERROR TOLERANCE   (18) =   179.9000    
    QUAD ELEMENT OR FACE WITH MIDSIDE NODES
         WARNING TOLERANCE (19) =   165.0000    
         ERROR TOLERANCE   (20) =   179.9000    
 JACOBIAN RATIO
    h-METHOD ELEMENT
         WARNING TOLERANCE (31) =   30.00000    
         ERROR TOLERANCE   (32) =   1000.000    
    QUAD ELEMENT OR FACE WARPING FACTOR
    SHELL181
         WARNING TOLERANCE (51) =   1.000000    
         ERROR TOLERANCE   (52) =   5.000000    
    INFIN47, INTER115, SHELL131, SHELL157,
    SHELL181 WITH NLGEOM OFF AND KEYOPT1 NOT = 1
         WARNING TOLERANCE (53) =  0.1000000    
         ERROR TOLERANCE   (54) =   1.000000    
    SHELL181 WITH KEYOPT1=1
         WARNING TOLERANCE (55) =  0.4000000E-04
         ERROR TOLERANCE   (56) =  0.4000000E-01
    SHELL181 WITH NLGEOM ON AND KEYOPT1 NOT = 1
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
154
Generating the Mesh

         WARNING TOLERANCE (59) =  0.1000000E-04
         ERROR TOLERANCE   (60) =  0.1000000E-01
    3D SOLID ELEMENT FACE
         WARNING TOLERANCE (67) =  0.2000000    
         ERROR TOLERANCE   (68) =  0.4000000    
 ELEMENT SHAPE CHECKING IS ON WITH DEFAULT LIMITS
7.5.8.5. Changing Shape Parameter Limits
If the default shape parameter limits do not suit your purposes, you can change them by using the
command SHPP,MODIFY,VALUE1,VALUE2. See the description of the SHPP command for more
information.
7.5.8.5.1. Examples of Changing Shape Parameter Limits
The element shape checking controls provide the flexibility to fit varied analysis needs. For example,
perhaps you are not particularly concerned about aspect ratio measures. You can turn off all aspect
ratio testing by including the command SHPP,OFF,ASPECT in your start.ans file. If that seems
too drastic for your situation, you may choose to specify SHPP,MODIFY,1,1000 instead. Doing so
radically loosens the warning limit for aspect ratio tests, without turning off the tests entirely:
7.5.8.6. Retrieving Element Shape Parameter Data
You can use the *GET and *VGET commands to retrieve element shape parameter data:
Command(s):
*GET, Par, ELEM, ENTNUM, SHPAR, IT1NUM
*VGET, ParR, ELEM, ENTNUM, SHPAR, IT1NUM,,, KLOOP
For example, the command *GET,A,ELEM,3,SHPAR,ASPE returns the calculated aspect ratio of element
number 3 and stores it in a parameter named A. The command *VGET,A(1),ELEM,3,SHPAR,ASPE
returns the aspect ratio of element number 3 and stores it in the first location of A. Retrieval con-
tinues with elements numbered 4, 5, 6, and so on, until successive array locations are filled.
See the descriptions of the *GET and *VGET commands in the Command Reference for more inform-
ation.
7.5.8.7. Understanding Circumstances Under Which the Program Retests Existing
Elements
Certain types of changes that you make to defined elements can invalidate prior element shape
testing. The program generally traps these types of changes and retest the affected elements
automatically. Circumstances under which the program retests existing elements include:
• When you change the element type (ET,,Ename or ETCHG,Cnv) or one of its key options
(KEYOPT).
• When you change the element TYPE number of an element (EMODIF).
• When you change the large deformation key (NLGEOM,Key) for SHELL181 elements.
155
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Meshing Your Solid Model

• When you define a shell thickness (R) after you define an element, or you change an existing
shell thickness (RMODIF) or the REAL number of a shell element (EMODIF).
Element type and TYPE number  
There is a distinction between the element type and that element type's TYPE number. The
element type is the true name of the element (for example, SHELL181, sometimes shortened
to simply 181). The element type's TYPE number is an arbitrary number that is locally assigned
to a particular element type. Use the TYPE number to reference the element type when assigning
attributes to your model.
7.5.8.8. Deciding Whether Element Shapes Are Acceptable
Here are some suggestions to help you decide whether you should be concerned about an element
shape warning:
• Never ignore an element shape warning. Always investigate the effect that a "poorly" shaped
element might have on your analysis results.
• Recognize that structural stress analyses that have the goal of determining stress at particular
locations will typically suffer more severe effects from "poorly" shaped elements than will
other types of analyses (deflection or nominal stress, modal, thermal, magnetic, etc.).
• If any "poorly" shaped elements are located in a critical region (such as near a critical stress
point), their effect is more likely to be detrimental.
• "Poorly" shaped higher-order (midside-node) elements will generally produce better results
than will similarly shaped linear elements. The default shape parameter limits are more re-
strictive on linear elements than on higher-order elements.
• Verification of analysis results by comparison with other analyses, test data, or hand calcula-
tions is essential regardless of whether elements produce shape warnings. If such verification
indicates that you have high-quality results, there is little reason to worry about shape
warnings.
• Some of the best quantitative measures of an element's acceptability are the error measures
based on the element-to-element discontinuity in a stress or thermal gradient field. (See
The General Postprocessor (POST1) in the Basic Analysis Guide. An element that produces
shape warnings and shows a high error measure compared to its neighbors is suspect.)
To check element shapes in an existing mesh (an internally created mesh or an imported mesh),
use the CHECK command.
See the description of the SHPP command for more information about element shape checking.
7.5.9. Mesh Validity Checking
There are times when the CHECK command will fail to detect potential problems in a mesh. The
CHECK command is designed to examine each individual selected element and report warnings or
errors based on specified shape criteria. It will not detect overlapping or poorly-connected elements.
The MCHECK command is designed to detect potential problems with how elements are connected
to each other. Figure 7.39: Flawed Mesh (elements "folded") (p. 157) shows an example of a flawed
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
156
Generating the Mesh

mesh that would not be detected by the CHECK command. All elements in this mesh are of acceptable
quality. The MCHECK command, however, would detect the potential connectivity problem and report
an error.
The MCHECK command will perform a number of validity checks on the selected elements, including
1. Normal check: Wherever two area elements share a common edge, MCHECK verifies that
the ordering of the nodes on each element is consistent with their relative normals.
2. Volume check: Wherever two volume elements share a common face, MCHECK verifies
that the sign of the integrated volume of each element is consistent.
3. Closed surface check: MCHECK verifies that the element exterior faces form simply-connec-
ted closed surfaces (this may detect unintended cracks in a mesh).
4. Check for holes in the mesh: MCHECK warns if the number of element faces surrounding
an interior void in the mesh is small enough to suggest one or more accidentally omitted
elements, rather than a deliberately formed hole. For this test, the number of faces around
the void is compared to the smaller of a) three times the number of faces on one element,
or b) one-tenth the total number of element faces in the model.
To check mesh connectivity, use the MCHECK,Lab command. Like the CHECK command, MCHECK
gives the option to unselect all valid elements. You can then visually identify any potential problem
elements. Use MCHECK Lab=ESEL to unselect valid elements.
Figure 7.39: Flawed Mesh (elements "folded")
157
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Meshing Your Solid Model

7.6. Changing the Mesh
If you decide that the generated mesh is not appropriate, you can easily change the mesh by one of
the following methods:
• Remesh with new element size specifications.
• Use the accept/reject prompt to discard the mesh, then remesh.
• Clear the mesh, redefine mesh controls, and remesh.
• Refine the mesh locally.
• Improve the mesh (for tetrahedral element meshes only).
Details of these methods are discussed below.
7.6.1. Remeshing the Model
You can remesh a meshed model by resetting element size controls and initiating the meshing oper-
ation (AMESH or VMESH). This is the simplest way to change your mesh. The accept/reject prompt
is not required, and the mesh does not need to be cleared in order to remesh it.
However, there are some restrictions to using this method. You can change element size specifications
controlled by the KESIZE, ESIZE, SMRTSIZE, and DESIZE commands, but you cannot change size
specifications assigned directly to lines (LESIZE). If you want the option of changing LESIZE settings
before remeshing, use the mesh accept/reject prompt instead of this method.
This remesh option is available only when meshing is performed interactively through the GUI. If you
are using command input, you must first clear the mesh before remeshing (see Clearing the
Mesh (p. 158) for more information).
7.6.2. Using the Mesh Accept/Reject Prompt
As mentioned earlier, you can activate the mesh accept/reject prompt in the GUI by picking Main
Menu> Preprocessor> Meshing> Mesher Opts before meshing. (The prompt is turned off by default.)
When activated, the prompt appears after each meshing operation and allows you to either accept
or reject the generated mesh. If the mesh is rejected, all nodes and elements will be cleared from the
meshed entities. You can then reset any of the meshing controls and remesh the model.
The accept/reject prompt is available for area and volume meshing. The advantage of using the
prompt is that you do not have to manually clear the mesh (ACLEAR and VCLEAR).
7.6.3. Clearing the Mesh
Clearing the mesh of nodes and elements is not always required before remeshing. However, you do
have to clear the mesh in order to respecify LESIZE settings. You also have to clear the mesh if you
want to change the underlying solid model.
• Use the KCLEAR command to clear the mesh from keypoints.
• Use the LCLEAR command to clear the mesh from lines.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
158
Generating the Mesh

grep term: "stiffness"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 3252-3299 · enclosing doc section)

3.9.4.4. Additional Considerations for Specifying Contact Stiffness
FKN, FTOLN, FKT, and SLTO can be modified from one load step to another. They can also be adjusted
in a restart run.
Determining a good stiffness value may require some experimentation on your part. To arrive at a
good stiffness value, you can try the following procedure as a "trial run":
1.
Use a low value for the contact stiffness to start. In general, it is better to underestimate this
value rather than overestimate it. Penetration problems resulting from a low stiffness are
easier to fix than convergence difficulties that arise from a high stiffness.
2.
Run the analysis up to a fraction of the final load (just enough to get the contact fully estab-
lished).
3.
Check the penetration and the number of equilibrium iterations used in each substep. If the
global convergence difficulty is caused by too much penetration (rather than by residual forces
and displacement increments), FKN may be underestimated or FTOLN may be too small. If the
global convergence requires many equilibrium iterations for achieving convergence tolerances
of residual forces and displacements rather than the resulting penetration, FKN or FKT may be
overestimated.
4.
Adjust FKN, FKT, FTOLN, or SLTO as necessary and run the full analysis. If the penetration
control becomes dominant in the global equilibrium iterations (that is, if more iterations were
used to converge the problem to within the penetration tolerance than to converge the residual
forces), you may increase FTOLN to permit more allowable penetration or increase FKN.
In addition, keep these points in mind when specifying contact stiffness:
• For bonded contact and rough contact, the program uses MU = 1.0 to calculate tangential
contact stiffness. The default tangential contact stiffness is proportional to the normal stiffness
when the contact status is closed or open (near-field). When an absolute value of tangential
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
52
Surface-to-Surface Contact (Pair-Based)

stiffness is specified (a negative value input for FKT), the tangential stiffness remains un-
changed regardless of the contact status.
• Generally, the contact stiffness, FKN and FKT, has units of FORCE/LENGTH3. However, for
contact force-based models the contact stiffness has units FORCE/LENGTH. This applies to
CONTA175 with KEYOPT(3) = 0 and CONTA177 with KEYOPT(3) = 0 or 4. In addition, the
absolute normal contact stiffness (that is, a negative value input for FKN) can have units of
FORCE/LENGTH under some circumstances. See Using FKN and FTOLN (p. 50) for more in-
formation.
• In general, if the underlying solid element has material properties defined by both TB and
MP commands, the properties defined by TB take precedence over the properties defined
by MP in the calculation of initial contact stiffness. However, for TB,EXPE (experimental data)
and TB,USER (user-defined material model), MP,EX takes precedence. Ansys, Inc. recommends
you define MP,EX when using TB,EXPE or TB,USER so that the initial contact stiffness is cal-
culated using a realistic value for EX as defined by the MP command rather than a heuristic
contact stiffness that is not influenced by the material property.

grep term: "Penetration"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 4055-4168 · enclosing doc section)

3.9.8.2. Using CNOF, KEYOPT(5), and KEYOPT(9)
The following techniques can be performed independently or in combinations of one or more at
the beginning of the analysis. They are intended to eliminate small gaps or penetrations caused
by numerical round-off due to mesh generation. They are not intended to correct gross errors in
either the mesh or in the geometric data.
1. Use real constant CNOF to specify a contact surface offset.
Specify a positive value to offset the entire contact surface toward the target surface. Use
a negative value to offset the contact surface away from the target surface.
Note:
If user-defined values are input for both CNOF and PINB, you must ensure that
PINB is greater than CNOF. Otherwise, CNOF will be ignored. However, if a user-
defined CNOF is input and the PINB value is left at its default value, the PINB
value will be adjusted so that it is larger than the CNOF value, as described in
Using PINB (p. 89).
Note:
For the CONTA177 line-to-surface element, CNOF can be used to model thickness
of the underlying beam elements. Input half of the beam thickness for CNOF to
properly model the thickness effects. See Accounting for Thickness Effect (KEY-
OPT(11)) (p. 165) for more information.
The program can automatically provide the CNOF value to either just close the gap or reduce
initial penetration. Set KEYOPT(5) as follows:
1: Closes the gap
2: Reduces initial penetration
3: Either closes the gap or reduces initial penetration
Tabular input can also be used to define CNOF. The tabular input can be defined as a
function of time and/or initial contact detection point location (at the beginning of solution)
in global or local coordinates. For more information, see Defining Real Constants in Tabular
Format (p. 43).
As an example of when tabular input may be useful, consider the case of a CAD geometry
based on nominal values. The geometry may lack a slight curvature variation that is import-
75
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Set the Real Constants and Element KEYOPTS

ant for analysis purposes. Moving nodes to the actual positions can be a tedious process,
yet using the original geometry and neglecting the slight variation in curvature will result
in a different contacting area. Consequently, use of CNOF as a function of location allows
you to easily include curvature that varies with location without having to modify the ori-
ginal CAD geometry.
The user subroutine USERCNPROP.F is also available for defining CNOF. To use this sub-
routine, you must specify the table name %_CNPROP% as the real constant value. For more
information, see Defining Real Constants via a User Subroutine (p. 45).
2. Set KEYOPT(9) to adjust initial penetration or gap. See Figure 3.26: Ignoring Initial Penetration,
KEYOPT(9) = 1 (p. 77).
True initial penetration includes two parts:
• Penetration or gap due to geometry
• Penetration or gap due to user-defined contact surface offset (CNOF).
See Figure 3.27: Components of True Penetration (p. 78).
Keep in mind that the effects of KEYOPT(9) are dependent on settings for other KEYOPTs.
The indicated initial gap effect is considered only if KEYOPT(12) = 4 or 5 (no separation or
bonded when inside pinball region).
KEYOPT(9) offers the following settings for adjusting initial penetration or gap:
• To include initial penetration or gap from both geometry and contact surface offset,
set KEYOPT(9) = 0. This is the default.
• To ignore initial penetration or gap from both geometry and contact surface offset,
set KEYOPT(9) = 1.
• To include the defined contact surface offset (CNOF) but ignore the initial penetration
or gap due to geometry, set KEYOPT(9) = 3.
• Set KEYOPT(9) = 5 to include the defined contact surface offset (CNOF) but ignore
the initial penetration due to geometry. Even when KEYOPT(12) is not set to 4 or 5,
this setting for KEYOPT(9) will also ignore the initial force in open-gap springs as
long as contact is detected within the pinball region.
For problems such as an interference fit, over-penetration is expected. These problems often
have convergence difficulties if the initial penetration is step-applied in the first load step.
You may overcome convergence difficulties by ramping the initial penetration over the
first load step. See Figure 3.28: Ramping Initial Interference (p. 78). The following KEYOPT(9)
settings provide ramping capabilities:
• To ramp the total initial penetration or gap (CNOF + the offset due to geometry),
set KEYOPT(9) = 2.
• To ramp the defined contact surface penetration or gap (CNOF), but ignore the
penetration or gap due to geometry, set KEYOPT(9) = 4.
• Set KEYOPT(9) = 6 to ramp the defined contact offset (CNOF) but ignore the initial
penetration due to geometry. Even when KEYOPT(12) is not set to 4 or 5, this setting
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
76
Surface-to-Surface Contact (Pair-Based)

for KEYOPT(9) will also ignore the initial force in open-gap springs as long as contact
is detected within the pinball region.
For the above KEYOPT(9) settings, you should not specify any external loads in the first
load step. In addition, make sure that the pinball region is big enough to capture the initial
interference.
For KEYOPT(9) = 0, 1, 3, or 5, the default pinball (PINB) value is half that of the KEYOPT(9)
settings that include ramped effects (KEYOPT(9) = 2, 4, or 6). The default PINB value may
differ from what is described here if CNOF is input. See Defining the Pinball Region
(PINB) (p. 89) for more information.
You can use the above techniques in conjunction with each other. For example, you may wish to
set a very precise initial penetration or gap, but the initial coordinates of the finite element nodes
may not be able to provide sufficient precision. To accomplish this, you could:
1. Use CNOF to specify a penetration (positive value) or gap (negative value).
2. Use KEYOPT(9) = 5 to resolve the initial penetration in the first substep (or KEYOPT(9) = 6
to gradually resolve the initial penetration).
Figure 3.26: Ignoring Initial Penetration, KEYOPT(9) = 1
77
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Set the Real Constants and Element KEYOPTS

Figure 3.27: Components of True Penetration
Figure 3.28: Ramping Initial Interference
The program provides a printout (in the output window or file or via the CNCHECK) of the model's
initial contact state for each target surface at the beginning of the analysis. This information is
helpful for determining the maximum penetration or minimum gap for each target surface.
If no contact is detected for a specific target surface, the program issues a warning. This occurs
when the target surface is far from contact (that is, outside of the pinball region), or when the
contact/target elements have been killed.
See Positive and Negative Real Constants (p. 42) for more information on these real constants.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
78
Surface-to-Surface Contact (Pair-Based)

grep term: "depending"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 66819-67018 · enclosing doc section)

# Generate an area from the lines
area_id = mapdl.a(*lines)
*ENDPY
! Generate a line to define the extrusion path
*GET, KPNUMBER, KP, 0 ,NUM, MAX
*GET, LINENUMBER, LINE, 0, NUM, MAX
K   ,KPNUMBER+1
K   ,KPNUMBER+2,0           ,0           ,10
L   ,KPNUMBER+1,KPNUMBER+2
! Extrude the area generated in python using the line
! generated in APDL
*GET,AREANUMBER  ,AREA        ,0           ,NUM   , MAX
VDRAG,AREANUMBER,,,,,,LINENUMBER+1
! Display the volume
/show,png
/view,,1,1,1
vplot
Python Language Version 
*PYTHON (p. 1609) uses the 3.10 version of Python that is distributed with Mechanical APDL, in the
location v261/commonfiles/CPython. For documentation of this version of Python, see https://
docs.python.org/3.10/.
*PYTHON (p. 1609) in Distributed-memory Parallel (DMP) Mode 
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1610
*PYTHON

When running in DMP mode, the Python code inside the *PYTHON (p. 1609) block only executes
on the head compute node.
Python Variables 
You can add multiple *PYTHON (p. 1609) blocks in a Mechanical APDL input listing, and any local
Python variables defined in one block can be accessed from another block. However, when you
issue a /CLEAR (p. 357) command outside of a *PYTHON block, Python variables defined by all
previous *PYTHON (p. 1609) blocks will be cleared.
Exceptions 
If an exception is raised from within a *PYTHON (p. 1609) block, it causes an error in Mechanical
APDL, which may lead to program termination.
Using Python Packages 
By default, *PYTHON (p. 1609) uses a Python environment that includes PyMAPDL, PyDPF, and some
thirdparty libraries, such as numpy. You may want to use additional libraries that are not included
by default. Ordinarily, this is accomplished in Python by creating a virtual environment and installing
desired packages into that environment (https://docs.python.org/3/library/venv.html), but *PY-
THON (p. 1609) uses its own virtual environment to run within Mechanical APDL. To configure
Mechanical APDL to use a custom Python environment, follow these steps:
1. Prepare a requirements.txt file (/path/to/my-requirements.txt) that includes
the desired packages (https://pip.pypa.io/en/stable/reference/requirements-file-format/).
2. Specify a folder (/path/to/folder) to install the Python environment in. This folder
must not exist before running the following commands:
On Windows (PowerShell):
& '\path\to\v261\commonfiles\CPython\3_10\winx64\Release\python\python' -m venv '\path\to\folder'
& '\path\to\folder\Scripts\Activate.ps1'
On Linux:
'/path/to/v261/commonfiles/CPython/3_10/linx64/Release/python/bin/python' -m venv '/path/to/folder'
source '/path/to/folder/bin/activate'
3. Finally, install your dependencies:
pip install -r '/path/to/v261/ansys/site/mapdl-requirements.txt'
pip install –r '/path/to/my-requirements.txt'
A Python environment is identified by the folder in which it was installed. There is no limit to the
number of environments that can exist. However, Mechanical APDL can only use one of them. To point
Mechanical APDL to use an environment, set the environment variable MAPDL_PYTHON_ENV to the
folder identifying that environment.
Caution:
Do not install any packages directly to /path/to/commonfiles/CPython. You must
create a virtual Python environment (as described above) to avoid unintended affects to the
1611
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
*PYTHON

Python interpreter that is shared between several Ansys products, including Mechanical APDL
and the Mechanical application.
Using a *PYTHON (p. 1609) block in Mechanical APDL is a nonstandard use of the program. You are re-
sponsible for verifying that the results produced are accurate and the routines you introduce do not
adversely affect other, standard areas of the program. Exercise caution and engineering judgement and
verify your results.
Known Issues and Limitations
• *PYTHON (p. 1609) is not allowed inside of a *DO (p. 587) loop.
• To use matplotlib inside of *PYTHON, consider the following:
– In batch mode, matplotlib uses the system default backend and works as expected.
– In interactive mode, the default backend of matplotlib would conflict with the Mechanical
APDL GUI and result in a crash. To view plots using matplotlib while running the program in
interactive mode, you must choose the non-interactive "Agg" backend of matplotlib to redirect
all plotting commands in matplotlib to a file. See matplotlib documentation: Selecting a
backend.
– When running interactive mode on Windows in a terminal session with the -smp option en-
abled for shared-memory parallel processing, *PYTHON (p. 1609) is not supported.
Menu Paths
This command cannot be accessed from a menu.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1612
*PYTHON

Q Commands
QDVAL,TBLNO1,TBLNO2,SV1,SV2,SV3,SV4,SV5,SV6,SV7
Defines PSD quadspectral values.
SOLUTION (p.38):Spectrum Options (p.42)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
TBLNO1
First input PSD table number associated with this spectrum.
TBLNO2
Second input PSD table number associated with this spectrum.
SV1, SV2, SV3, . . . , SV7
PSD quadspectral values corresponding to the frequency points (PSDFRQ (p. 1579)).
Notes
Defines PSD quadspectral values to be associated with the previously defined frequency points. Repeat
QDVAL (p. 1613) command with the same table number for additional points. Unlike autospectra
(PSDVAL (p. 1584)), the quadspectra can be positive or negative. The quadspectral curve segment where
there is a sign change is interpolated linearly (the rest of the curve segments use log-log interpolation).
For better accuracy, choose as small a curve segment as possible wherever a sign change occurs.
Two table numbers are required since values are off-diagonal terms. This command is valid for SP-
OPT (p. 1908),PSD only.
This command is also valid in PREP7.
Menu Paths
Main Menu>Preprocessor>Loads>Load Step Opts>Spectrum>PSD>Correlation>Quadspectral
Main Menu>Solution>Load Step Opts>Spectrum>PSD>Correlation>Quadspectral
1613
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

QRDOPT,ReuseKey,--,--,SymMeth,CMCCoutKey
Specifies additional QRDAMP modal analysis options.
SOLUTION (p.38):Dynamic Options (p.41)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Product Restrictions (p.1182)
ReuseKey
Reuse key for method=QRDAMP specified in MODOPT (p. 1178) command.
ON
Reuse the symmetric eigensolution from the previous load steps or from the previous
solution.
OFF
Do not reuse (calculates symmetric eigensolution at current load step). This is the default.
--, --
Unused fields.
SymMeth
Mode-extraction method to be used for the symmetric eigenvalue problem.
LANB
Block Lanczos algorithm (default).
SUBSP
Subspace algorithm.
SNODE
Supernode algorithm.
CMCCoutKey
Complex Modal Contribution Coefficients (CMCC) output key. See Calculate the Complex Mode
Contribution Coefficients (CMCC) in the Structural Analysis Guide for details and usage.
ON
Output the CMCC to the text file Jobname.CMCC.
OFF
Do not output the CMCC. This is the default.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1614
QRDOPT

Notes
If the filename.modesym file exists in the working directory and ReuseKey = ON, filename.mod-
esym will be reused. If filename.modesym does not exist in the working directory, the symmetric
eigensolution will be calculated.
When ReuseKey=ON, both the new modal analysis (filename.modesym usage) and the preceding
modal analysis (filename.modesym generation) must be performed using the same product version
number.
Menu Paths
This command cannot be accessed from a menu.
QSOPT,Opt
Specifies quasi static radiation options.
SOLUTION (p.38):Radiosity (p.50)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Opt
Quasi static option:
OFF  
Do not run transient radiation problem to steady-state (default).
ON  
Run transient radiation problem to steady-state.
Notes
For more information on solving a static problem using a false transient approach, see Further Options
for Static Analysis in the Thermal Analysis Guide.
Menu Paths
Main Menu>Preprocessor>Loads>Load Step Opts>Time/Frequenc>Quasi-Static
Main Menu>Solution>Load Step Opts>Time/Frequenc>Quasi-Static
1615
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
QSOPT

QUAD,NODE1,NINTR,NODE2,NFILL,NSTRT,NINC,PKFAC
Generates a quadratic line of nodes from three nodes.
PREP7 (p.23):Nodes (p.32)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
NODE1
Begin fill-in from this node location. If NODE1 = P, graphical picking is enabled and all remaining
command fields are ignored (valid only in the GUI).
NINTR
Intermediate or guiding node. Quadratic curve will pass through this location. NINTR may have
any node number and any location. If the quadratic line also generates a node with number NINTR,
the generated location overrides the previous NINTR location.
NODE2
End quadratic fill-in at this node location.
NFILL
Fill-in NFILL nodes between NODE1 and NODE2 (defaults to |NODE2-NODE1|-1). NFILL must be
positive.

grep term: "environment"

## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/Ansys_Mechanical_APDL_Command_Reference.txt (lines 66819-67018 · enclosing doc section)

# Generate an area from the lines
area_id = mapdl.a(*lines)
*ENDPY
! Generate a line to define the extrusion path
*GET, KPNUMBER, KP, 0 ,NUM, MAX
*GET, LINENUMBER, LINE, 0, NUM, MAX
K   ,KPNUMBER+1
K   ,KPNUMBER+2,0           ,0           ,10
L   ,KPNUMBER+1,KPNUMBER+2
! Extrude the area generated in python using the line
! generated in APDL
*GET,AREANUMBER  ,AREA        ,0           ,NUM   , MAX
VDRAG,AREANUMBER,,,,,,LINENUMBER+1
! Display the volume
/show,png
/view,,1,1,1
vplot
Python Language Version 
*PYTHON (p. 1609) uses the 3.10 version of Python that is distributed with Mechanical APDL, in the
location v261/commonfiles/CPython. For documentation of this version of Python, see https://
docs.python.org/3.10/.
*PYTHON (p. 1609) in Distributed-memory Parallel (DMP) Mode 
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1610
*PYTHON

When running in DMP mode, the Python code inside the *PYTHON (p. 1609) block only executes
on the head compute node.
Python Variables 
You can add multiple *PYTHON (p. 1609) blocks in a Mechanical APDL input listing, and any local
Python variables defined in one block can be accessed from another block. However, when you
issue a /CLEAR (p. 357) command outside of a *PYTHON block, Python variables defined by all
previous *PYTHON (p. 1609) blocks will be cleared.
Exceptions 
If an exception is raised from within a *PYTHON (p. 1609) block, it causes an error in Mechanical
APDL, which may lead to program termination.
Using Python Packages 
By default, *PYTHON (p. 1609) uses a Python environment that includes PyMAPDL, PyDPF, and some
thirdparty libraries, such as numpy. You may want to use additional libraries that are not included
by default. Ordinarily, this is accomplished in Python by creating a virtual environment and installing
desired packages into that environment (https://docs.python.org/3/library/venv.html), but *PY-
THON (p. 1609) uses its own virtual environment to run within Mechanical APDL. To configure
Mechanical APDL to use a custom Python environment, follow these steps:
1. Prepare a requirements.txt file (/path/to/my-requirements.txt) that includes
the desired packages (https://pip.pypa.io/en/stable/reference/requirements-file-format/).
2. Specify a folder (/path/to/folder) to install the Python environment in. This folder
must not exist before running the following commands:
On Windows (PowerShell):
& '\path\to\v261\commonfiles\CPython\3_10\winx64\Release\python\python' -m venv '\path\to\folder'
& '\path\to\folder\Scripts\Activate.ps1'
On Linux:
'/path/to/v261/commonfiles/CPython/3_10/linx64/Release/python/bin/python' -m venv '/path/to/folder'
source '/path/to/folder/bin/activate'
3. Finally, install your dependencies:
pip install -r '/path/to/v261/ansys/site/mapdl-requirements.txt'
pip install –r '/path/to/my-requirements.txt'
A Python environment is identified by the folder in which it was installed. There is no limit to the
number of environments that can exist. However, Mechanical APDL can only use one of them. To point
Mechanical APDL to use an environment, set the environment variable MAPDL_PYTHON_ENV to the
folder identifying that environment.
Caution:
Do not install any packages directly to /path/to/commonfiles/CPython. You must
create a virtual Python environment (as described above) to avoid unintended affects to the
1611
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
*PYTHON

Python interpreter that is shared between several Ansys products, including Mechanical APDL
and the Mechanical application.
Using a *PYTHON (p. 1609) block in Mechanical APDL is a nonstandard use of the program. You are re-
sponsible for verifying that the results produced are accurate and the routines you introduce do not
adversely affect other, standard areas of the program. Exercise caution and engineering judgement and
verify your results.
Known Issues and Limitations
• *PYTHON (p. 1609) is not allowed inside of a *DO (p. 587) loop.
• To use matplotlib inside of *PYTHON, consider the following:
– In batch mode, matplotlib uses the system default backend and works as expected.
– In interactive mode, the default backend of matplotlib would conflict with the Mechanical
APDL GUI and result in a crash. To view plots using matplotlib while running the program in
interactive mode, you must choose the non-interactive "Agg" backend of matplotlib to redirect
all plotting commands in matplotlib to a file. See matplotlib documentation: Selecting a
backend.
– When running interactive mode on Windows in a terminal session with the -smp option en-
abled for shared-memory parallel processing, *PYTHON (p. 1609) is not supported.
Menu Paths
This command cannot be accessed from a menu.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1612
*PYTHON

Q Commands
QDVAL,TBLNO1,TBLNO2,SV1,SV2,SV3,SV4,SV5,SV6,SV7
Defines PSD quadspectral values.
SOLUTION (p.38):Spectrum Options (p.42)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
TBLNO1
First input PSD table number associated with this spectrum.
TBLNO2
Second input PSD table number associated with this spectrum.
SV1, SV2, SV3, . . . , SV7
PSD quadspectral values corresponding to the frequency points (PSDFRQ (p. 1579)).
Notes
Defines PSD quadspectral values to be associated with the previously defined frequency points. Repeat
QDVAL (p. 1613) command with the same table number for additional points. Unlike autospectra
(PSDVAL (p. 1584)), the quadspectra can be positive or negative. The quadspectral curve segment where
there is a sign change is interpolated linearly (the rest of the curve segments use log-log interpolation).
For better accuracy, choose as small a curve segment as possible wherever a sign change occurs.
Two table numbers are required since values are off-diagonal terms. This command is valid for SP-
OPT (p. 1908),PSD only.
This command is also valid in PREP7.
Menu Paths
Main Menu>Preprocessor>Loads>Load Step Opts>Spectrum>PSD>Correlation>Quadspectral
Main Menu>Solution>Load Step Opts>Spectrum>PSD>Correlation>Quadspectral
1613
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.

QRDOPT,ReuseKey,--,--,SymMeth,CMCCoutKey
Specifies additional QRDAMP modal analysis options.
SOLUTION (p.38):Dynamic Options (p.41)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Product Restrictions (p.1182)
ReuseKey
Reuse key for method=QRDAMP specified in MODOPT (p. 1178) command.
ON
Reuse the symmetric eigensolution from the previous load steps or from the previous
solution.
OFF
Do not reuse (calculates symmetric eigensolution at current load step). This is the default.
--, --
Unused fields.
SymMeth
Mode-extraction method to be used for the symmetric eigenvalue problem.
LANB
Block Lanczos algorithm (default).
SUBSP
Subspace algorithm.
SNODE
Supernode algorithm.
CMCCoutKey
Complex Modal Contribution Coefficients (CMCC) output key. See Calculate the Complex Mode
Contribution Coefficients (CMCC) in the Structural Analysis Guide for details and usage.
ON
Output the CMCC to the text file Jobname.CMCC.
OFF
Do not output the CMCC. This is the default.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
1614
QRDOPT

Notes
If the filename.modesym file exists in the working directory and ReuseKey = ON, filename.mod-
esym will be reused. If filename.modesym does not exist in the working directory, the symmetric
eigensolution will be calculated.
When ReuseKey=ON, both the new modal analysis (filename.modesym usage) and the preceding
modal analysis (filename.modesym generation) must be performed using the same product version
number.
Menu Paths
This command cannot be accessed from a menu.
QSOPT,Opt
Specifies quasi static radiation options.
SOLUTION (p.38):Radiosity (p.50)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
Opt
Quasi static option:
OFF  
Do not run transient radiation problem to steady-state (default).
ON  
Run transient radiation problem to steady-state.
Notes
For more information on solving a static problem using a false transient approach, see Further Options
for Static Analysis in the Thermal Analysis Guide.
Menu Paths
Main Menu>Preprocessor>Loads>Load Step Opts>Time/Frequenc>Quasi-Static
Main Menu>Solution>Load Step Opts>Time/Frequenc>Quasi-Static
1615
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
QSOPT

QUAD,NODE1,NINTR,NODE2,NFILL,NSTRT,NINC,PKFAC
Generates a quadratic line of nodes from three nodes.
PREP7 (p.23):Nodes (p.32)
Valid Products: (p.2) Pro | Premium | Enterprise | PrepPost | Solver | AS add-on
NODE1
Begin fill-in from this node location. If NODE1 = P, graphical picking is enabled and all remaining
command fields are ignored (valid only in the GUI).
NINTR
Intermediate or guiding node. Quadratic curve will pass through this location. NINTR may have
any node number and any location. If the quadratic line also generates a node with number NINTR,
the generated location overrides the previous NINTR location.
NODE2
End quadratic fill-in at this node location.
NFILL
Fill-in NFILL nodes between NODE1 and NODE2 (defaults to |NODE2-NODE1|-1). NFILL must be
positive.
</rag-context>