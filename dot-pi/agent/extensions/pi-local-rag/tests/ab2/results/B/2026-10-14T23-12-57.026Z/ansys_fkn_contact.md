<rag-context>
[pi-local-rag] RAG subagent: 4 sources, 50612 ms retrieval.
### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt — 3.9.1. Real Constants (FKN definition, p. 49)

• FKN (p. 49) defines a normal contact stiffness factor. [1] [2]

[1] When the contact element is used as part of a forced-distributed constraint (p. 256) and KEYOPT(7)
= 2 on the target element, FKN is used to define weighting factors in tabular format (p. 43) with
node number as the primary variable.

[2] When the relaxation option (p. 272) is enabled (KEYOPT(11) = 1 on the target element) for a surface-
based constraint (p. 256) or a rigid body (p. 269), FKN and FKT are translational relaxation coefficient
and rotational relaxation coefficient, respectively, and tabular input is not supported. In addition,
FTOLN and TNOP are translational tolerance and rotational tolerance, respectively.

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt — Table 3.1: Summary of Real Constant Defaults in Different Environments (FKN row)

Ansys
Workbench
Default
Ansys
Mechanical
APDL
Default
Description
Real Constants
Name
No.
...
Normal penalty stiffness factor
FKN
3
1
1

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt — 3.9.4. Determining Contact Stiffness and Allowable Penetration — 3.9.4.1. Introduction

For the augmented Lagrangian method and penalty method, normal and tangential contact stiff-
nesses are required. The amount of penetration between contact and target surfaces depends on
the normal stiffness. The amount of slip in sticking contact depends on the tangential stiffness.
Higher stiffness values decrease the amount of penetration/slip, but can lead to ill-conditioning of
the global stiffness matrix and to convergence difficulties. Lower stiffness values can lead to a certain
amount of penetration/slip and produce an inaccurate solution. Ideally, you want a high enough
stiffness that the penetration/slip is acceptably small, but a low enough stiffness that the problem
will be well-behaved in terms of convergence.

The program provides default values for contact stiffnesses (FKN, FKT), allowable penetration (FTOLN),
and allowable slip (SLTO). Material properties of underlying elements can affect the calculation of
default values of contact stiffnesses, as follows:
• If the underlying solid material is an anisotropic elastic material, all elastic moduli may affect
the contact stiffness.

• The initial contact stiffness of contact elements overlaid on layered structural solid elements
(SOLID185 or SOLID186) is influenced by the material properties of each layer weighted by
the respective layer thickness.
In most cases, you do not need to define the contact stiffness. In addition, Ansys recommends that
you use KEYOPT(10) = 0 or 2 (p. 53) to allow the program to update the contact stiffness automat-
ically.

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt — 3.9.4.2. Using FKN and FTOLN

For certain contact problems, you may choose to use the real constant FKN to define a normal
contact stiffness factor. The usual factor range is from 0.1 - 10.0, with a default of 1.0. The default
value should work in most cases. You can also define an absolute normal contact stiffness by spe-
cifying a negative value for FKN.

In addition, FKN can be defined as a function of primary variables by using tabular input (%tab-
name%). The possible primary variables include time, temperature, initial contact detection point
location (at the beginning of solution), contact pressure of the previous iteration (positive PRESSURE
index values indicate compression, negative PRESSURE index values indicate tension), and current
geometric penetration (positive GAP index values indicate penetration, negative GAP index values
indicate an open gap). For more information, see Defining Real Constants in Tabular Format (p. 43).

The user subroutine USERCNPROP.F is also available for defining FKN. To use this subroutine, you
must specify the table name %_CNPROP% as the real constant value. For more information, see
Defining Real Constants via a User Subroutine (p. 45).

If you input an absolute normal contact stiffness by specifying a negative value for FKN, you can
control the units by using KEYOPT(3). By default, the units of the user-specified absolute normal
contact stiffness is FORCE/LENGTH3. You can change the units to FORCE/LENGTH by setting KEYOPT(3)
= 1. This KEYOPT(3) = 1 setting is valid only when a penalty-based algorithm is used (KEYOPT(2) =
0 or 1) and the absolute normal contact stiffness is explicitly specified. Using KEYOPT(3) = 1 is not
recommended in conjunction with nodal detection options (KEYOPT(4) = 1 or 2) if any midside
nodes exist for the CONTA174 3D contact element. (KEYOPT(3) has different meanings in other
situations. For more information, see Using KEYOPT(3) to Control Units of Contact Stiffness and
Stress State (p. 95).)

Note:
The default contact normal stiffness is affected by defined material properties, element
size, and the user-defined penetration tolerance (FTOLN). Many factors may be applied
to the actual contact normal stiffness during the solution. The default contact stiffness
listed in the Contact Manager or by the CNCHECK command may be different from the
actual contact stiffness reported by the ETABLE command. You should check the value
reported by ETABLE to confirm that the appropriate contact normal stiffness is used.
</rag-context>