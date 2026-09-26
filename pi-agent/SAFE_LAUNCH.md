# SAFE_LAUNCH — procedure de lancement sûr du harnais pi

Ce depot git (= votre pi personnel : `~/.pi/agent`) sert de **pile de
snapshots** : on commit AVANT chaque lancement du harnais, on verifie
APRES, on restaure si besoin. Le script a lancer est
`launch_Harness.HARDENED.ps1` (dossier
`Datas/02_RECHERCHE/11_all_AI/00_Harnesses_launch_ALAN/`) — **jamais
l'original** `launch_Harness.ps1`.

Garantie du script durci (prouvee en staging, voir `EVALUATION.md` dans le
dossier du harnais) : toute ecriture passe par un portail audite avec liste
blanche (reglage de modele + fournisseur uniquement). Les sections
`extensions`, `skills`, `defaultTools`, `agents`, `mcpServers`,
`subscriptions`, `packages`, `prompts` provoquent un ABORT avant toute
ecriture.

## Ce que git montre avant / pendant / apres

- **Autorise et ATTENDU apres un lancement durci** : seulement
  `settings.json` (defaultProvider / defaultModel) et `models.json`
  (baseUrl / api / apiKey / modele). Tout AUTRE fichier modifie = anomalie.
- **Jamais touche** : `extensions/`, `skills/`, `AGENTS.md`, `auth.json`,
  `sessions/`, `npm/`.

## Procedure (3 etapes, PowerShell)

### Etape 1 — snapshot AVANT le lancement

```powershell
cd $env:USERPROFILE\.pi\agent
git add -A
git commit -m "snapshot avant lancement $(Get-Date -Format yyyy-MM-dd_HHmmss)"
git tag "before_launch_$(Get-Date -Format yyyyMMdd_HHmmss)"
```

### Etape 2 — lancement durci (sortie vierge exigee)

```powershell
cd "C:\Users\connessn\Datas\02_RECHERCHE\11_all_AI\00_Harnesses_launch_ALAN"
.\launch_Harness.HARDENED.ps1        # choisir le modele AU MENU
```

### Etape 3 — verification + eventuel rollback

```powershell
cd $env:USERPROFILE\.pi\agent
git status --short          # attendu : SEULEMENT settings.json / models.json
git diff settings.json      # defaultProvider / defaultModel uniquement
```

- **Si tout est conforme** → nouveau commit du bon etat :
  `git add -A; git commit -m "apres lancement ok <date>"`.
- **Si UN AUTRE fichier a change** → restauration immediate :

```powershell
git checkout -- .          # restaure tout depuis le dernier commit
# ou retour au snapshot exact :
git restore --source=before_launch_<timestamp> --staged --worktree .
```

`models.json` / `auth.json` etant gitignores, la restauration porte sur la
structure et `settings.json` ; `models.json` local n'a pas besoin d'etre
restaure par git (clé re-regenerable via `models.json.example`).

## Rappels de securite

- `models.json.example` = modele SANS cle ; la vraie cle reste locale
  (ignoree). Ne jamais forcer l'ajout de `models.json` ou `auth.json`.
- Depot PRIVE (cree en `--private`). Valeurs reelles de pi (agents,
  extensions, skills, facts verifies) y sont versionnees sous compte
  Tithanium.
