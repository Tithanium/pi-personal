<rag-context>
[pi-local-rag] RAG subagent: 2 sources, 3906 ms retrieval.
### H01 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/td-40/actuator_beam_input.dat (lines 97-120 · chunk range (no structural region))

/SOLU
NLGEOM,On
NROPT,unsym
NSUBST,150,5000,50
OUTRES,ALL,ALL

Time,1
Tunif,250
F,2,Fz,1830
SOLVE

Time,2
CNVTOL,M,,0.01
Tunif,400
SOLVE

Time,3
Tunif,250
SOLVE
finish





### H02 C:/Users/connessn/Datas/02_RECHERCHE/00_Biblio/Doc_tech_ANSYS/Exemples_ANSYS/models_examples/mwe_run_stackline/stackline_code_ANSYS_beam.txt (lines 50-68 · chunk range (no structural region))

/SOL
ANTYPE,0
NLGEOM,1
NSUBST,20,200,5        ! Allow bisection: 20 initial, up to 200, min 5
OUTRES,ALL,1
TIME,1
AUTOTS,1
PSTRES,1
LNSRCH,ON              ! Line search helps cable-like problems
SOLVE

TIME,2                  ! Must increment TIME for 2nd load step
NSUBST,50,500,10        ! More substeps for the force application
AUTOTS,1
LNSRCH,ON
FK,2,FY,Ftest
SOLVE
</rag-context>