<rag-context>
[pi-local-rag] RAG subagent: 2 sources, 2463 ms retrieval.
## 001 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Structural_Analysis_Guide.txt (lines 7038-7237 · enclosing doc section)

...
...
/SOLU
ANTYPE,HARMIC       
HROPT,KRYLOV         ! Required to write the .full file in proper format for Krylov subspace generation
!–––-Perform analysis from 300-700 Hz in 5 Hz increments-----
HARFRQ,300,700       ! Set the frequency range of interest
NSUBST,80            ! Set the number of frequency increments
WRFULL,1             ! Generate .full file and stop
SOLVE
FINI
Alternatively, you can import the required matrices and load vector from another source. To do so,
modify the KRYGENSUB.mac to avoid reading the .full file and instead use the provided APDL
Math parameters. For details on importing matrices and vectors from external sources, see Procedure
for Using APDL Math in the Ansys Parametric Design Language Guide.
Required inputs for KRYGENSUB.mac
In addition to the required .full file, you must define the following input values in the macro
to specify your problem:
• The maximum size or dimension of the subspace (maxDimQ). Larger values typically
result in a more accurate solution but also require more computational effort to build
and use the subspace to compute the final solution.
133
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Frequency-Sweep Harmonic Analysis via the Krylov Method

• The frequency value at which to build the subspace (freqVal). This value is typically
recommended to be in the middle of the frequency range.
• An optional key specifying whether or not to check if each subspace vector is orthonor-
mal to all of the other vectors in the subspace (chkOrthoKey). This one-time check
is performed after the subspace has been generated and adds to the overall computa-
tional cost.
• An optional key to output the Kyrlov subspace to the Qz.txt file (outKey).
!COM ************************************************************************
!COM KRYGENSUB.MAC                                                          *
!COM                                                                        *
!COM   This macro generates a Krylov subspace used for a model reduction    *
!COM   solution in a harmonic analysis. The subspace is built using the     *
!COM   assembled matrices and load vector on the jobname.full file that     *
!COM   is located in the current working directory.  This .full file        *
!COM   should be built at the specified frequency value.                    *
!COM                                                                        *
!COM   COMMAND USAGE: KRYGENSUB,maxDimQ,freqVal,chkOrthoKey,outKey          *
!COM     maxDimQ     - maximum size/dimension of Krylov subspace            *
!COM     freqVal     - frequency value (Hz) at which to build the KRYLOV    *
!COM                   subspace                                             *
!COM     chkOrthoKey - [optional] key to check orthonormal properties of    *
!COM                   each subspace vector with all other subspace vectors *
!COM     outKey      - [optional] key to output KRYLOV subspace to Qz.txt   *
!COM                   file                                                 *
!COM                                                                        *
!COM ************************************************************************
!Store input arguments from user
maxDimQ=arg1
freqVal=arg2
chkOrthoKey=arg3
outKey=arg4
!Check for illegal input values by user
*IF,maxDimQ,LE,0,THEN
  *msg,error
  The maximum size of Krylov subspace is required to be greater than 0
  _nerr=1
*ENDIF
*IF,freqVal,LT,0.0,THEN
  *msg,error
  The frequency value for building the Krylov subspace is required to be greater or equal to 0 Hz
  _nerr=1
*ENDIF
*IF,chkOrthoKey,LT,0,THEN
  *msg,error
  The chkOrthoKey value for building the Krylov subspace is required to be 0 or 1
  _nerr=1
*ENDIF
*IF,chkOrthoKey,GT,1,THEN
  *msg,error
  The chkOrthoKey value for building the Krylov subspace is required to be 0 or 1
  _nerr=1
*ENDIF
*IF,outKey,LT,0,THEN
  *msg,error
  The outKey value for building the Krylov subspace is required to be 0 or 1
  _nerr=1
*ENDIF
*IF,outKey,GT,1,THEN
  *msg,error
  The outKey value for building the Krylov subspace is required to be 0 or 1
  _nerr=1
*ENDIF
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
134
Harmonic Analysis

!Execute macro if no errors above
*IF,_nerr,EQ,0,THEN
!The coefficient to mass matrix term
twoPi=2.0*acos(-1)
omega0=freqVal*twoPi              !circular frequency at given frequency point
ccf=-omega0*omega0
!Make up full file name parameter
*GET,jobname1,ACTIVE,,jobname,,START,1
*GET,jobname2,ACTIVE,,jobname,,START,9
*GET,jobname3,ACTIVE,,jobname,,START,17
*GET,jobname4,ACTIVE,,jobname,,START,25
*SET,thejob,'%jobname1%%jobname2%%jobname3%%jobname4%'
*SET,fullfile,'%thejob%.full'
!Load global matrices and RHS in full file
*SMAT,MatK,D,IMPORT,FULL,fullfile,STIFF        !stiffness matrix [MatK]
*INQ,MatK,DIM2,nDOF                            !the 2nd matrix dimension,nDOF
*SMAT,MatM,D,IMPORT,FULL,fullfile,MASS         !mass matrix [MatM]
*SMAT,MatC,D,IMPORT,FULL,fullfile,DAMP         !damping matrix [MatC]
*SMAT,Nod2Solv,D,IMPORT,FULL,fullfile,NOD2SOLV !import the mapping vector
*VEC,Fz,Z,IMPORT,FULL,fullfile,RHS             !right hand side {Fz}
*VEC,Fz0,Z,COPY,Fz
!Form Az=(K-w0*w0*M,i*w0*C) and Cz=(C,i*2*w0*M)
*SMAT,Az,Z,COPY,MatK                           ![Az]=[MatK]
*AXPY,ccf,0.0,MatM,1.0,0.0,Az                  ![Az]=(1,0)*[Az]+(ccf,0)*[MatM]
*AXPY,0.0,omega0,MatC,1.0,0.0,Az               ![Az]=(1,0)*[Az]+(0,omega0)*[MatC]
*SMAT,Cz,Z,COPY,MatC                           ![Cz]=[MatC]
*AXPY,0.0,2.0*omega0,MatM,1.0,0.0,Cz           ![Cz]=(1,0)*[Cz]+(0,2*omega0)*[MatM]
zeroC=0                                        !set zeroC flag
*NRM,Cz,NRM2,normC,NO
*IF,normC,EQ,0.0,THEN
  zeroC=1
*ENDIF
!Solve for the 1st vector of subspace [Q]
*LSENGINE,DSP,DSPsolver,Az,INCORE              !create solver system of [Az]
*LSFACTOR,DSPsolver                            !factor [Az]
*DMAT,Qz,Z,ALLOC,nDOF,maxDimQ,INCORE           ![Qz] initially allocated
*VEC,Uz1,Z,LINK,Qz,1                           !{Uz1} linked to Qz[1]
*LSBAC,DSPsolver,Fz,Uz1                        !backward solve -> {Uz1}
*NRM,Uz1,NRM2,normU,YES                        !{Uz1} normalized
i1=2                                           !initialized as no damping
*IF,zeroC,EQ,0,THEN
  i1=3
  *VEC,Uz2,Z,LINK,Qz,2                         !{Uz2} linked to Qz[2]
  *INIT,Fz,ZERO                                !{Fz}=0
  *MULT,Cz,,Uz1,,Fz                            !{Fz}={Fz}+[Cz]{Uz1}
  *AXPY,0.0,0.0,Fz,-1.0,0.0,Fz                 !{Fz}=-{Fz}
  *NRM,Fz,NRM2,normU,YES
  *LSBAC,DSPsolver,Fz,Uz2                      !back solved:{Uz2}=[Az]^-1*{Fz}
  *DOT,Uz1,Uz2,ccon_real,ccon_imag             !{Uz2}*{v1} = ccon
  *AXPY,-ccon_real,-ccon_imag,Uz1,1.0,0.0,Uz2  !{Uz2}={Uz2}-ccon*{Uz1}
  *NRM,Uz2,NRM2,normU,YES                      !{Uz2} normalized
*ENDIF
!Build Subspace Vectors with MGS (2nd Order)
*DO,dimQ,i1,maxDimQ
  *IF,normU,EQ,0.0,THEN
    numQ=dimQ-1                                !exhausted at dimQ
  *ELSE
    numQ=maxDimQ                               !may reach to the maximum
  *ENDIF
  *IF,numQ,GE,maxDimQ,THEN                     !make next vector
    *INIT,Fz,ZERO
    *IF,zeroC,EQ,0,THEN                        ![Cz]!=0 case
135
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Frequency-Sweep Harmonic Analysis via the Krylov Method

      *SET,nextUzOne,dimQ-2
      *SET,nextUzTwo,dimQ-1
      *VEC,Uz1,Z,LINK,Qz,nextUzOne             !{Uz1} to [Qz](dimQ-2)
      *VEC,Uz2,Z,LINK,Qz,nextUzTwo             !{Uz2} to [Qz](dimQ-1)
      *VEC,Uz,Z,LINK,Qz,dimQ                   !{Uz} to [Qz](dimQ)
      *MULT,Cz,,Uz2,,Uz                        ![Cz]{Uz2} -> {Uz}
    *ELSE
      *SET,nextUzOne,dimQ-1                    ![Cz]=0 case
      *VEC,Uz1,Z,LINK,Qz,nextUzOne
      *VEC,Uz,Z,LINK,Qz,dimQ                   !{Uz} to [Qz](dimQ)
      *INIT,Uz,ZERO
    *ENDIF
    *MULT,MatM,,Uz1,,Fz                        ![MatM]{Uz1} -> {Fz}
    *AXPY,-1.0,0.0,Uz,-1.0,0.0,Fz              !{Fz} = -{Fz}-{Uz}
    *LSBAC,DSPsolver,Fz,Uz                     ![Az]^-1{Fz} -> {Uz}
    !Make subspace vectors orthonormal (MGS)
    *DO,j,1,dimQ-1
      *VEC,V1,Z,LINK,Qz,j
      *DOT,V1,Uz,ccon_real,ccon_imag
      *AXPY,-ccon_real,-ccon_imag,V1,1.,0.,Uz
    *ENDDO
    *NRM,Uz,NRM2,normU,YES                     !normalize {Uz}
  *ENDIF
*ENDDO
!Optional check on Orthonormality of vectors
*IF,chkOrthoKey,EQ,1,THEN
  *DO,i,1,numQ
    *VEC,Vz,Z,LINK,Qz,i
    *DO,j,1,numQ
      *VEC,Uz,Z,LINK,Qz,j
      *DOT,Vz,Uz,ccon_real,ccon_imag
      dcon=sqrt(ccon_real*ccon_real+ccon_imag*ccon_imag)
      *vwrite,i,j,dcon
      (' V_',F3.0,'V_',F3.0,' = ',E22.15,',',E22.15'i')
    *ENDDO
  *ENDDO
*ENDIF
!Output generated subspace vectors to file
*IF,outKey,EQ,1,THEN                           !output subspace vectors
  *PRINT,Qz,%thejob%_Qz.txt

## 002 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Main_documentation_ANSYS/ANSYS_Mechanical_APDL_Contact_Technology_Guide.txt (lines 2079-2278 · enclosing doc section)

3.9. Set the Real Constants and Element KEYOPTS
The program uses real constants and KEYOPTs to control contact behavior using surface-to-surface
contact elements. For more information in addition to what is presented here, refer to the individual
contact element descriptions in the Element Reference.
If you decide the real constant and KEYOPT settings you have specified for a particular contact pair are
not appropriate, you can use the CNCHECK,RESET command to reset all values back to their default
settings. Some real constants and key options are not affected by this command. See CNCHECK for
details.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
36
Surface-to-Surface Contact (Pair-Based)

In many cases, certain default settings may not be appropriate for your specific model. You can issue
the CNCHECK,AUTO command to obtain optimized KEYOPT and real constant settings in terms of ro-
bustness and efficiency. Usually, only the undefined or default KEYOPT settings and real constants are
changed. Refer to the CNCHECK command description for details of which settings are typically changed.
You should always verify these changes by issuing the CNCHECK,DETAIL command to list current contact
pair properties. If necessary, you can overwrite the optimized settings by redefining specific KEYOPTs
(KEYOPT command) and real constants (RMODIF command).
The following related topics are available:
3.9.1. Real Constants
3.9.2. Element KEYOPTS
3.9.3. Selecting a Contact Algorithm (KEYOPT(2))
3.9.4. Determining Contact Stiffness and Allowable Penetration
3.9.5. Choosing a Friction Model
3.9.6. Selecting Location of Contact Detection
3.9.7. Selecting a Sliding Behavior
3.9.8. Adjusting Initial Contact Conditions
3.9.9. Modeling Interference Fit
3.9.10. Physically Moving Contact Nodes Toward the Target Surface
3.9.11. Physically Moving the Target Body Toward the Contact Surface
3.9.12. Determining Contact Status and the Pinball Region
3.9.13. Avoiding Spurious Contact in Self Contact Problems
3.9.14. Selecting Surface Interaction Models
3.9.15. Using KEYOPT(3) to Control Units of Contact Stiffness and Stress State
3.9.16. Modeling Contact with Superelements
3.9.17. Modeling Contact for 2D Axisymmetric Elements with Torsion
3.9.18. Applying Contact Stabilization Damping
3.9.19. Modeling Interface Damping in Assembled Structures
3.9.20. Accounting for Thickness Effect
3.9.21. Using Time Step Control and Impact Constraints
3.9.22. Using the Birth and Death Options
3.9.1. Real Constants
Use the R and RMORE commands to define real constants. The first two real constants, R1 and R2,
are used to define the geometry of the target surface elements. The remaining are used by the contact
surface elements.
• R1 and R2 (p. 21) define the target element geometry.
• FKN (p. 49) defines a normal contact stiffness factor. [1] [2]
• FTOLN (p. 47) is a factor based on the thickness of the element which is used to calculate al-
lowable penetration. [2]
37
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Set the Real Constants and Element KEYOPTS

• PINB (p. 89) defines a "pinball" region.
• PZER (p. 54) defines pressure at zero penetration.
• CZER (p. 54) defines initial clearance.
• TAUMAX (p. 58) specifies the maximum contact friction.
• CNOF (p. 74) specifies the positive or negative offset value applied to the contact surface.
• FKOP (p. 91) specifies the stiffness factor applied when contact opens.
• FKT (p. 49) specifies the tangent contact stiffness factor. [2]
• COHE (p. 58) specifies the cohesion sliding resistance.
• TCC (p. 171) specifies the thermal contact conductance coefficient.
• FHTG (p. 174) specifies the fraction of frictional dissipated energy converted into heat.
• SBCT (p. 172) specifies the Stefan-Boltzmann constant.
• RDVF (p. 172) specifies the radiation view factor.
• FWGT specifies the weight factor for the distribution of heat between the contact and target
surfaces for thermal contact (p. 174) or for electric contact (p. 177).
• ECC (p. 176) specifies the electric contact conductance or capacitance per unit area.
• FHEG (p. 177) specifies the fraction of electric dissipated energy converted into heat.
• FACT (p. 58) specifies the ratio of static to dynamic coefficients of friction.
• DC (p. 58) specifies the decay coefficient for static/dynamic friction.
• SLTO (p. 49) controls maximum sliding distance when MU is nonzero and the tangent contact
stiffness (FKT) is updated at each iteration (KEYOPT(10) = 0 or 2) or when KEYOPT(2) = 3.
• TNOP (p. 57) specifies the maximum allowable tensile contact pressure. [2]
• TOLS (p. 67) adds a small tolerance that extends the edge of the target surface.
• MCC (p. 178) specifies the magnetic contact permeance (3D only).
• PPCN (p. 126) specifies the pressure-penetration criterion (surface contact elements only).
• FPAT (p. 126) specifies the fluid penetration acting time (surface contact elements only).
• COR (p. 279) specifies the coefficient of restitution for impact between rigid bodies using impact
constraints (KEYOPT(7) = 4).
• STRM (p. 79) specifies load step number for ramping penetration, or starting time for ramping
contact stiffness.
• FDMN (p. 98) specifies the stabilization damping factor in the normal direction.
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
38
Surface-to-Surface Contact (Pair-Based)

• FDMT (p. 98) specifies the stabilization damping factor in the tangential direction.
• FDMD (p. 63) specifies the destabilizing squeal damping factor (3D only).
• FDMS (p. 63) specifies the stabilizing squeal damping factor (3D only).
• TBND (p. 93) specifies the critical bonding temperature.
• WBID is an internal contact pair ID (used only by the Results Tracker in Workbench Mechanical)
• PCC (p. 179) specifies the pore fluid contact permeability coefficient.
• PSEE (p. 179) specifies the pore fluid seepage.
• ABPP (p. 179) specifies the ambient pore pressure.
• FPFT (p. 179) specifies the gap pore fluid flow participation factor.
• FPWT (p. 179) specifies the gap pore fluid flow distribution weighting factor.
• DCC (p. 183) specifies the diffusivity coefficient.
• DCON (p. 183) specifies the diffusive convection coefficient.
• ABDC (p. 183) specifies the ambient concentration.
• BSRL (p. 133) identifies the real constant set ID of the original (base) contact pair after a spitting
operation.
• KSYM (p. 133) identifies the real constant set ID of the companion pair for a symmetric pair or
self contact (determined by the splitting logic).
• TFOR (p. 120) specifies the pair-based force convergence tolerance.
• TEND (p. 79) defines the ending time for ramping contact stiffness.
1. When the contact element is used as part of a forced-distributed constraint (p. 256) and KEYOPT(7)
= 2 on the target element, FKN is used to define weighting factors in tabular format (p. 43) with
node number as the primary variable.
2. When the relaxation option (p. 272) is enabled (KEYOPT(11) = 1 on the target element) for a surface-
based constraint (p. 256) or a rigid body (p. 269), FKN and FKT are translational relaxation coefficient
and rotational relaxation coefficient, respectively, and tabular input is not supported. In addition,
FTOLN and TNOP are translational tolerance and rotational tolerance, respectively.
39
Release 2026 R1 - © ANSYS, Inc. All rights reserved. - Contains proprietary and confidential information
of Synopsys, Inc., ANSYS, Inc., subsidiaries and affiliates.
Set the Real Constants and Element KEYOPTS

Real constant defaults can vary depending on the environment you are working in. The following
table compares the program default values with those of the Ansys Workbench product.
Table 3.1: Summary of Real Constant Defaults in Different Environments
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
n/a
0
Radius associated with target
geometry
R1 [4]
1
Calculated
by
program
Target radius (CONTA177)
n/a
0
Radius associated with target
geometry
R2 [4]
2
1
Superelement thickness
Calculated
by
program
Contact radius (CONTA177)
[1]
1
Normal penalty stiffness factor
FKN
3
0.1
0.1
Penetration tolerance factor
FTOLN
4
[2]
[2]
Pinball region
PINB
6
[7]
[7]
Pressure at zero penetration
PZER
7
0.01
0.01
Initial contact clearance factor
CZER
8
1.00E+20
1.00E+20
Maximum friction stress
TAUMAX
9
0
0
Contact surface offset
CNOF
10
1
1
Contact opening stiffness
FKOP
11
1
1
</rag-context>