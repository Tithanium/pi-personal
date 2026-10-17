Research complete. Facts written to `C:\Users\connessn\.pi\agent\extensions\pi-local-rag\tests\ab2\reference-D\ansys_fkn_contact\facts.json` (48 facts, all file paths verified to exist, line numbers spot-checked).

---

# FKN — the Normal Penalty Contact Stiffness Real Constant in ANSYS Mechanical APDL

## What FKN is

**FKN is real constant number 3 on the contact elements (CONTA172/174/175/177), called the "Normal penalty stiffness factor"** (Contact Technology Guide, Table 3.1, `ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt:2239-2241`; real-constant list at line 2127: *"FKN (p. 49) defines a normal contact stiffness factor"*). It scales the **normal contact (penalty) stiffness** — the stiffness of the "contact spring" used by the penalty method to relate penetration between the two surfaces to contact pressure (Guide §3.9.3, line 3065: *"The penalty method uses a contact spring… The spring stiffness is called the contact stiffness. This method uses the following real constants: FKN and FKT"*). The amount of inter-surface penetration depends on this stiffness: higher stiffness → less penetration but possible ill-conditioning/convergence problems; lower stiffness → more penetration/inaccuracy (Guide §3.9.4.1, lines 3128–3136).

## Default value

- **In Ansys Mechanical APDL, the default is FKN = 1.0** — stated explicitly in §3.9.4.2 "Using FKN and FTOLN" (Guide line 3154): *"you may choose to use the real constant FKN to define a normal contact stiffness factor. The usual factor range is from 0.1 – 10.0, with a default of 1.0. The default value should work in most cases."* This matches Table 3.1 (line 2243): APDL default = **1** (real no. 3).
- **In the Ansys Workbench environment the default is FKN = 0.1** (Table 3.1, line 2242). Workbench also uses **FKN = 10 for bonded contact**, 1.0 otherwise (Guide line 2491).
- FKN is a **scaling factor** applied to a program-computed base stiffness; the *actual* default stiffness is **program-calculated from the underlying material properties (e.g., Young's modulus) and element size** — for node-to-node contact (CONTA178), *"The program provides a default normal contact stiffness FKN, which is based on Young's modulus E and the size of the underlying elements"* (Guide line 11413). The default is inversely proportional to the penetration tolerance FTOLN and can be updated at each iteration when KEYOPT(10) = 0 or 2 (Guide lines 3131, 3145–3153). Ansys recommends leaving it at default and letting KEYOPT(10)=0/2 update it automatically (line 3131).

## Positive vs. negative values

- **Positive FKN = scaling factor** (typical range 0.1–10); **negative FKN = absolute normal contact stiffness** (Guide §3.9.4.2, lines 3153–3156; "Positive and Negative Real Constant Values" §3.9.1.1, line 2509). FKN, FTOLN, PINB, FKT, SLTO are always **averaged across all contact elements in a contact pair** (line 2515).
- Units: generally **FORCE/LENGTH³** (traction-based); **FORCE/LENGTH** for force-based models (CONTA175 KEYOPT(3)=0; CONTA177 KEYOPT(3)=0/4) (lines 3287–3291, 7797). KEYOPT(3)=1 lets you set absolute-stiffness units to FORCE/LENGTH, valid only with penalty-based algorithms (KEYOPT(2)=0/1) and explicit negative FKN (Command Reference line 17507).

## Other roles and notes on FKN

- For **Lagrange multiplier methods (KEYOPT(2)=3/4)** FKN has little influence — "You should not overwrite the default FKN in most cases" (line 3110).
- For the **pressure-penetration exponential law (PZER/CZER)**, FKN sets a **cutoff stiffness**: the actual cutoff is **1000 × the penalty stiffness** (user input or program-computed) (lines 3382–3387).
- FKN can be defined **as a function of primary variables** (TIME, TEMP, location, PRESSURE, GAP) via tabular input `%tabname%` (lines 3157, 2564–2567) or via the **USERCNPROP.F** subroutine using `%_CNPROP%` (lines 3163, 5228–5230).
- Special reuses: with **forced-distributed constraint + target KEYOPT(7)=2**, FKN holds user-defined **weighting factors** (lines 2190; Element Reference line 31280); with **relaxation (target KEYOPT(11)=1)**, FKN/FKT become **translational/rotational relaxation coefficients** (lines 2193, 12425; Element Reference line 31318); **shell–shell assembly** (TARGE170 KEYOPT(5)=2) takes translational penalty stiffness from FKN or defaults internally (line 4786). **CNCHECK,AUTO** will automatically cut FKN in half if spurious contact or slow searching is detected (Command Reference lines 16961–16967).
- FKN can be changed **between load steps** (only at load-step boundaries) via R/RMODIF (lines 3253, 6435–6436, 6795).

## Setting FKN — examples in the corpus

- Guide example (general contact): `GCDEF,,SECT1,SECT2,,14` then `R,14,,,10` sets FKN=10 at a specific interface (Guide lines 11121–11124; Command Reference GCDEF line 33605–33606). `RMODIF,GCN,3,10` sets FKN=10 for all GCDEF real sets (Guide line 11133–11135).
- Showcase script: `rmodif,100,3,1  ! Define FKN for real ID 100` (`Exemples_ANSYS/ANSYS_Mechanical_APDL_Technology_Showcase_Example_Problems.txt:23183`); an example table lists FKN as "Structural stiffness = 1.0 times underlying element stiffness" (line 25397).
- Scripts: `td-17/impact_rigid.dat:57` `rmodif,2,3,-1e15  ! Specify FKN=1e15` (absolute, negative input); `td-52/SequentialEmbankmentCase1.dat:25` `RMOD,2,3,10.0  ! Increase FKN`; `td-42/wirecrimp_fe.dat:217661` `rmod,cid,3,0.1 ! FKN`; `td-7/cam_shaft_assembly.dat:52` `!rmodif,3,3,1. ! FKN`.
- Convergence guidance: Advanced Analysis Guide (line 1705) recommends **FKN = 0.1** to help failing semi-implicit contact solutions; Technology Showcase/Demonstration guides conclude **FKN = 1 is optimal for nonlinear analysis** and convergence is less sensitive to FKN with surface-projection contact (Showcase lines 16636, 16643–16644; Demonstration lines 15487, 15494–15495). Overly large FKN causes convergence failure; overpenetration → increase FKN (Guide lines 6433–6436).

## Bottom line

**FKN (real constant 3 on contact elements) is the normal penalty contact stiffness factor that scales the program-computed normal contact stiffness; a positive value is a scale factor (typical range 0.1–10), a negative value specifies an absolute stiffness. Its default in Ansys Mechanical APDL is 1.0** (Workbench uses 0.1; bonded contact in Workbench uses 10), applied on top of a base stiffness computed from material properties and element size, and Ansys generally recommends leaving it at the default with automatic updating (KEYOPT(10)=0/2).

*(Note: `EMTGEN` also has an FKN argument for TRANS126 electromechanical elements defaulting to 0.1 — Command Reference line 26859–26861 — but that is a different, element-specific FKN, not the contact-element real constant.)*