<rag-context>
[pi-local-rag] RAG subagent: 11 sources, 90787 ms retrieval.
# FKN real constant in ANSYS Mechanical APDL penalty contact

## What FKN is — normal penalty contact stiffness factor

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt — §3.9.1 Real Constants (lines 2122-2165)

> 3.9.1. Real Constants
> Use the R and RMORE commands to define real constants. The first two real constants, R1 and R2,
> are used to define the geometry of the target surface elements. The remaining are used by the contact
> surface elements.
> • R1 and R2 (p. 21) define the target element geometry.
> • FKN (p. 49) defines a normal contact stiffness factor. [1] [2]
> • FTOLN (p. 47) is a factor based on the thickness of the element which is used to calculate al-
> lowable penetration. [2]
> ...
> • FKT (p. 49) specifies the tangent contact stiffness factor. [2]
> ...
> 1. When the contact element is used as part of a forced-distributed constraint (p. 256) and KEYOPT(7)
> = 2 on the target element, FKN is used to define weighting factors in tabular format (p. 43) with
> node number as the primary variable.
> 2. When the relaxation option (p. 272) is enabled (KEYOPT(11) = 1 on the target element) for a surface-
> based constraint (p. 256) or a rigid body (p. 269), FKN and FKT are translational relaxation coefficient
> and rotational relaxation coefficient, respectively, and tabular input is not supported.

### Same file — Table 3.1: Summary of Real Constant Defaults in Different Environments (lines 2201-2245)

> Real constant defaults can vary depending on the environment you are working in. The following
> table compares the program default values with those of the Ansys Workbench product.
> Table 3.1: Summary of Real Constant Defaults in Different Environments
> [columns: Ansys Workbench Default | Ansys Mechanical APDL Default | Description | Real Constants Name | No.]
> n/a | 0 | Radius associated with target geometry | R1 | 1
> ...
> 1 | 1 | Normal penalty stiffness factor | FKN | 3
> 0.1 | 0.1 | Penetration tolerance factor | FTOLN | 4

### Same file — §3.9.4.2 Using FKN and FTOLN (lines 3152-3199) — the key section

> 3.9.4.2. Using FKN and FTOLN
> For certain contact problems, you may choose to use the real constant FKN to define a normal
> contact stiffness factor. The usual factor range is from 0.1 - 10.0, with a default of 1.0. The default
> value should work in most cases. You can also define an absolute normal contact stiffness by spe-
> cifying a negative value for FKN.
>
> In addition, FKN can be defined as a function of primary variables by using tabular input (%tab-
> name%). The possible primary variables include time, temperature, initial contact detection point
> location (at the beginning of solution), contact pressure of the previous iteration (positive PRESSURE
> index values indicate compression, negative PRESSURE index values indicate tension), and current
> geometric penetration (positive GAP index values indicate penetration, negative GAP index values
> indicate an open gap). For more information, see Defining Real Constants in Tabular Format (p. 43).
>
> The user subroutine USERCNPROP.F is also available for defining FKN. To use this subroutine, you
> must specify the table name %_CNPROP% as the real constant value. For more information, see
> Defining Real Constants via a User Subroutine (p. 45).
>
> If you input an absolute normal contact stiffness by specifying a negative value for FKN, you can
> control the units by using KEYOPT(3). By default, the units of the user-specified absolute normal
> contact stiffness is FORCE/LENGTH3. You can change the units to FORCE/LENGTH by setting KEYOPT(3)
> = 1. This KEYOPT(3) = 1 setting is valid only when a penalty-based algorithm is used (KEYOPT(2) =
> 0 or 1) and the absolute normal contact stiffness is explicitly specified.
>
> Note:
> The default contact normal stiffness is affected by defined material properties, element
> size, and the user-defined penetration tolerance (FTOLN). Many factors may be applied
> to the actual contact normal stiffness during the solution. The default contact stiffness
> listed in the Contact Manager or by the CNCHECK command may be different from the
> actual contact stiffness reported by the ETABLE command. You should check the value
> reported by ETABLE to confirm that the appropriate contact normal stiffness is used.
>
> Use real constant FTOLN in conjunction with the augmented Lagrangian method. FTOLN is a toler-
> ance factor to be applied in the direction of the surface normal. The range for this factor is less
> than 1.0 (usually less than 0.2), with a default of 0.1, and is based on the depth of the underlying
> solid, shell, or beam element (see Figure 3.12: Depth of the Underlying Element (p. 42)). This factor
> is used to determine if penetration compatibility is satisfied.
>
> Contact compatibility is satisfied if penetration is within an allowable tolerance (FTOLN times the
> depth of underlying elements). ... In general, the default contact normal stiffness is inversely proportional to the final penetration tolerance. The tighter the
> tolerance, the higher the contact normal stiffness.

### Same file — §3.9.4.1 Introduction (lines 3128-3151)

> For the augmented Lagrangian method and penalty method, normal and tangential contact stiff-
> nesses are required. The amount of penetration between contact and target surfaces depends on
> the normal stiffness. The amount of slip in sticking contact depends on the tangential stiffness.
> Higher stiffness values decrease the amount of penetration/slip, but can lead to ill-conditioning of
> the global stiffness matrix and to convergence difficulties. Lower stiffness values can lead to a certain
> amount of penetration/slip and produce an inaccurate solution. Ideally, you want a high enough
> stiffness that the penetration/slip is acceptably small, but a low enough stiffness that the problem
> will be well-behaved in terms of convergence.
> The program provides default values for contact stiffnesses (FKN, FKT), allowable penetration (FTOLN),
> and allowable slip (SLTO). Material properties of underlying elements can affect the calculation of
> default values of contact stiffnesses, as follows:
> • If the underlying solid material is an anisotropic elastic material, all elastic moduli may affect
> the contact stiffness.
> • The initial contact stiffness of contact elements overlaid on layered structural solid elements
> (SOLID185 or SOLID186) is influenced by the material properties of each layer weighted by
> the respective layer thickness.
> In most cases, you do not need to define the contact stiffness. In addition, Ansys recommends that
> you use KEYOPT(10) = 0 or 2 (p. 53) to allow the program to update the contact stiffness automat-
> ically.

### Same file — §3.9.4.4 additional considerations + §3.9.4.5 KEYOPT(10) (lines 3287-3322)

> • Generally, the contact stiffness, FKN and FKT, has units of FORCE/LENGTH3. However, for
> contact force-based models the contact stiffness has units FORCE/LENGTH. This applies to
> CONTA175 with KEYOPT(3) = 0 and CONTA177 with KEYOPT(3) = 0 or 4. In addition, the
> absolute normal contact stiffness (that is, a negative value input for FKN) can have units of
> FORCE/LENGTH under some circumstances.
>
> 3.9.4.5. Using KEYOPT(10)
> The normal and tangential contact stiffness can be updated during the course of an analysis, either
> automatically (due to large strain effects that change the underlying element's stiffness) or explicitly
> (by user-specified FKN or FKT values). KEYOPT(10) governs how the normal and tangential contact
> stiffness is updated when the augmented Lagrangian or penalty method is used. In most cases
> Ansys, Inc. recommends that you use KEYOPT(10) = 0 to allow the program to update contact
> stiffnesses automatically. The possible settings for KEYOPT(10) are:
> • KEYOPT(10) = 0: the normal contact stiffness is updated at each iteration based on the current
> mean stress of the underlying elements and the allowable penetration, FTOLN, except in the very
> first iteration. The default normal contact stiffness for the first iteration is determined by under-
> lying element depth, material properties, and FTOLN. In addition, if bisections occur in the begin-
> ning of the analysis, the normal contact stiffness is reduced by a factor of 0.2 for each bisection. ...
> • KEYOPT(10) = 1: the contact stiffness is updated at each load step if FKN or FKT is redefined by
> the user. Stiffness and other settings (FTOLN, SLTO, and PINB) are averaged across contact elements
> in a contact pair. The default contact stiffness is determined by underlying element depth and
> material properties.
> • KEYOPT(10) = 2: the behavior is similar to KEYOPT(10) = 0 (updating contact stiffness at each it-
> eration), except that the actual elastic slip during the solution is guaranteed not to exceed the
> maximum allowable limit (SLTO) within a substep.

## FKN as an element real constant (Element Reference)

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Element_Reference.txt — CONTA178 (lines 40081-40125)

> Real Constants
> FKN, GAP, START, FKS, REDFACT, NX,
> NY, NZ, TOLN, FTOL, SLTOL, CV1,
> CV2, COR, AREA, TCC, FHTG, SBCT
> RDVF, FWGT, ECC, FHEG, RI, RJ
> See Table 7.178.1: CONTA178 Real Constants (p. 659) for a description of the real constants
> ...
> KEYOPT(2)
> Contact algorithm:
> 0 -- 
> Augmented Lagrange method (default)
> 1 -- 
> Pure Penalty method
> 3 -- 
> Lagrange multiplier on contact normal and penalty on tangent (uses U/P formulation for normal
> contact, non-U/P formulation for tangential contact)
> 4 -- 
> Lagrange multiplier method

### Same file — CONTA178 Real Constants table (Table 7.178.1) (lines 40225-40235)

> Table 7.178.1: CONTA178 Real Constants
> Description | Name | No.
> Normal stiffness [a][b] | FKN | 1
> Initial gap size ...

## Example: setting FKN via R / RMODIF

### C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt — General Contact Examples (lines 11118-11135)

> Examples
> When you assign a non-zero REALID on the GCDEF command, you will typically input the same
> number in the real constant set ID field (NSET) on the R and RMODIF commands.
> The following example defines a contact stiffness factor (FKN) of 10 at a specific contact interface.
> REALID = 14 is used to identify the non-default property:
> GCDEF,,SECT1,SECT2,,14
> R,14,,,10
> If the REALID has been specified by a previous GCDEF command, you can use the RMODIF command
> to add any non-default real constant values regardless of whether or not an associated R command
> was issued.
> Use NSET = GCN on the RMODIF command to define or modify real constants for all real constant sets
> that were previously assigned by GCDEF. For example:
> RMODIF,GCN,STLOC,V1,V2,V3,V4,V5,V6
> ...
> For example, the following command defines a contact stiffness factor (FKN) of 10 for all real constant
> sets previously specified by GCDEF commands:
> RMODIF,GCN,3,10
</rag-context>