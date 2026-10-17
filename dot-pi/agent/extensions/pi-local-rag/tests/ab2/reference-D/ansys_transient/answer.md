All 94 facts are valid and file paths exist. Here is the complete answer:

# Nonlinear Full Transient Dynamic Analysis in ANSYS Mechanical APDL

A "full transient" analysis is a direct implicit time-integration of the equations of motion — exactly the right tool for a structure with a fast time-varying load and large deflections. Below is the complete setup, covering the analysis type, time stepping/transient integration, initial conditions, and results output.

## 1. Analysis type

In SOLUTION:
- `ANTYPE,TRANS` (or `ANTYPE,4`) selects the transient analysis type (Command Reference, `ANTYPE` p.165: `TRANS or 4`).
- `TRNOPT,FULL` selects the full method — this is the default, so it is often omitted; the TINTOPT field on TRNOPT picks the time-integration algorithm: `NMK` (Newmark, default) or `HHT` (full-transient only) (CR `TRNOPT` p.2077).
- `TIMINT,ON` (default) includes inertia/damping; with `TIMINT,OFF` the load step is solved statically (useful for an initial-condition or prestress step).
- For **large deflections/strains**: `NLGEOM,ON` (large rotation/large strain plus automatic stress stiffening; also selects "Large Displacement Transient" in the GUI Basic tab) (CR `NLGEOM` p.1273; Structural Analysis Guide §5.3.3.2).
- Both EX (stiffness) and DENS (mass) must be defined; linear and nonlinear elements are allowed (SAG §5.3.1).
- Nonlinear convergence aids: `NROPT,AUTO`/`UNSYM`, `PRED,ON` (quadratic predictor often better with large rotations), `CNVTOL`, `NCNV`, and `STABILIZE` if unstable (SAG §8.8, CR `PRED` p.1526, `STABILIZE` p.1929).

## 2. Time stepping and transient integration

- `TIME,<t>` sets the end-of-load-step time; it must increase monotonically and be specified for every load step in a full transient (CR `TIME` p.2060). Divide the load-time curve into load steps, one per "corner", each written with `LSWRITE`.
- Time step: `DELTIM,DTIME,DTMIN,DTMAX` (initial step + min/max limits when auto-stepping is on) or `NSUBST,NSBSTP,NSBMX,NSBMN` (CR p.533/p.1331). `AUTOTS,ON` (default) adjusts the step from response frequency/nonlinearities, with bisection back to the last converged state on non-convergence (CR `AUTOTS` p.211; SAG §5.6.2).
- Integration method/parameters: `TRNOPT,,,HHT` (or NMK) and `TINTP,GAMMA` (amplitude decay factor, default 0.005). Application shortcuts set GAMMA automatically: `TINTP,IMPA` (0, impact, no dissipation), `HISP` (0.005), `MOSP` (0.1, most general transient), `LOSP` (0.414, high dissipation, big steps), `QUAS` (backward Euler, quasi-static, KBC=0, MIDTOL ignored) (CR `TINTP` p.2065; SAG §5.6.3).
- `KBC,1` = stepped, `KBC,0` = ramped loads; default is **stepped** when TIMINT is ON (CR `KBC` p.1004). For fast loads use ramped/tabular loads or small steps at the step change.
- Time-step guidelines (SAG §5.6.1): ~20 points per cycle of the highest frequency of interest (`ITS = 1/(20f)`); as small as 1/180f to follow a step change; ≥30 points per contact cycle for impact; mesh ≥20 elements per wavelength for waves.
- `MIDTOL` sets the midstep residual criterion (TOLERB, default 100× CNVTOL TOLER) which also drives AUTOTS bisection (CR p.1164).

## 3. Initial conditions

- Zero displacement/velocity/acceleration are the default (SAG §5.3.2).
- Nonzero ICs: `IC,NODE,Lab,VALUE` in the **first** load step at time=0; labels include displacements (UX…), velocities (`VELX,VELY,VELZ,OMGX…`), accelerations (`ACCX,ACCZ…`) — velocity/acceleration labels are not included by `ALL` (CR `IC` p.953). `ICROTATE` gives initial velocity as rotation + translation (full method only) (CR p.957).
- Since `IC` takes one condition per DOF, a nonzero displacement **and** velocity is set by a dummy static step: `TIMINT,OFF` + `D,ALL,UY,1.0` + `TIME,.4` + `SOLVE`, then `DDELE,ALL,UY` + `TIMINT,ON` (velocity = 1.0/0.4 = 2.5) (SAG §5.3.2, example lines 8276–8281).
- Avoid inconsistent ICs (define them at every unconstrained DOF); keep a pre-solve database save to reuse ICs.
- Fast time-varying loading is applied per load step (`TIME` + load values + `LSWRITE` per corner), or as one-dimensional TABLE array parameters (e.g. `acel,%SupportAcel%` from `*dim,SupportAcel,table,1499,,,time` — see td-12), or via a `*DO` loop with `TIME,TM` and `F(...,TABLE(TM))` (Basic Analysis Guide §5.6.3). For support motion, prefer acceleration input (`ACEL`/`D,,ACC`) over displacement input to avoid numerical noise (SAG §5.3.4).
- Solve all load steps with `LSSOLVE,1,n` (after `SAVE`) or by repeated `SOLVE`; restart a failed run with `ANTYPE,,RESTART,LDSTEP,SUBSTEP` (set `RESCONTROL,DEFINE,ALL,…` for restart files).

## 4. Damping

Rayleigh: `ALPHAD` (mass × α) / `BETAD` (stiffness × β) — use BETAD with care in nonlinear analyses since K changes (CR `ALPHAD` p.111, `BETAD` p.226; SAG §8.8.2). Also material Rayleigh (`MP,ALPD/BETD`, `TB,SDAMP`), element damping (`COMBIN14`), `DMPSTR`/`MP,DMPS`, and `LUMPM` for lumped mass (SAG §5.3.3.4.1, Table 1.1).

## 5. Results output

- By default only the **last** substep of each load step is written to `Jobname.rst` — set `OUTRES` frequency to capture more (SAG §5.3.3.2 caution). `OUTRES,ALL,ALL` writes everything every substep (expensive); selective examples: `outres,all,none` then `outres,nsol,all`, `outres,v,all`, `outres,a,all` (velocity/acceleration are transient-only items V/A) (CR `OUTRES` p.1382).
- `OUTPR` controls printed output (CR p.1378). `NLHIST` monitors nodal/element items in real time to `Jobname.nlh` (SAG §5.3.3.4.1).
- Postprocessing: **POST26** for time histories (`NSOL`, `ESOL`, `RFORCE`, `SOLU`, `ENERSOL` for energies; `PLVAR`, `PRVAR,EXTREM`, `*get,,vari,,extrem,vmax/vmin`), **POST1** for whole-model results at a time via `SET,,,time` (SAG §5.3.10).

## 6. Representative command stream (guide example, SAG §5.3.11 / §8.8.4)

```
/SOLU
ANTYPE,TRANS          ! transient analysis
TRNOPT,FULL           ! full method (default)
NLGEOM,ON             ! large deflection/rotation (nonlinear geometry)
! --- initial-condition load step (TIMINT,OFF step, IC/ICROTATE, or zero) ---
LSWRITE
! --- transient load steps ---
KBC,0                 ! or 1 (stepped)
TIME,<t>              ! end time of load step
AUTOTS,ON             ! automatic time stepping (default)
DELTIM,<init>,<min>,<max>
TINTP,0.1             ! Newmark/HHT amplitude decay (or IMPA/HISP/MOSP/LOSP/QUAS)
ALPHAD,<a>            ! mass damping
BETAD,<b>             ! stiffness damping (careful in nonlinear)
TIMINT,ON
PRED,ON               ! predictor
CNVTOL,<tol>          ! convergence
OUTRES,ALL,ALL        ! results at every substep
LSWRITE               ! (repeat per load step)
SAVE
LSSOLVE,1,<n>
FINISH
/POST26  -> NSOL/ESOL/RFORCE/PLVAR/PRVAR ;  /POST1 -> SET,,,time
```

## Corpus examples

- **td-12 `Full_Transient_Analysis1.dat`** (seismic acceleration): `antype,trans`, `kbc,1`, `trnopt,full,,,,,hht`, `tintp,0.0`, `autots,on`, `deltim,0.005,0.0005,0.005,off`, `time,14.99`, `outres,all,all`, `alphad/betad`, `acel,%SupportAcel%` (1499-row TABLE), then POST26 `rforce` + `*get …extrem`.
- **td-17 `impact_*.dat`** (bar impact, fast load, large deflection): `antype,trans`, `nlgeom,on`, `trnopt,full,,,,,HHT`, `tintp,0.1`, `time,…`, `nsub/st,100,10000,100`, IC via `ic,all,uz,,-227`, selective `outres`, POST26 `nsol`/`enersol`/`plvar`.
- **Technology Showcase**: digger-arm nonlinear transient (`antype,4`, `nlgeom,on`, `trnopt,full,,,,,hht`, `tintp,0.1`, `autots,off`, `deltim,0.1,0.1,0.1`, `outres,all,all`, 3 load steps × SOLVE); metal-bar impact study comparing `TRNOPT,FULL,,,,,NMK TINTP,0.0/0.1` vs `HHT TINTP,0.1`; tire HSFLD242 (`tintp,0.15`, transient only in last load step); FSW (`timint,off,struc`, `nropt,unsym`).
- Local model `cone_ecrase.txt`: nonlinear crush-style run with `NLGEOM,1`, `NSUBST,100,0,0`, `AUTOTS,1`, `TIME,1`, `OUTRES,ALL,1`.

The facts array (94 grounded statements with file:line) has been written to `C:\Users\connessn\.pi\agent\extensions\pi-local-rag\tests\ab2\reference-D\ansys_transient\facts.json`.