<rag-context>
[pi-local-rag] RAG subagent: 1 sources, 88 ms retrieval.
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
</rag-context>