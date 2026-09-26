# Bundle Update Log

## Questions for maintainers

Add facts that could not be verified from the available sources here. Do not guess.

## 2026-09-24

* **Session: github skill installed (gh 2.101.0)** (2026-09-24T17:00:51.650Z)
  * **Summary**: Installed the github skill at C:\Users\connessn\.pi\agent\skills\github\SKILL.md (OKF-linked adviser pattern, same as fedoo/ansys). gh CLI 2.101.0 already installed and authenticated; no ready-made GitHub skill existed in the public skill repos (anthropics/skills, badlogic/pi-skills, @howaboua/pi-skills).
  * **Decisions**:
    * ["No public GitHub skill existed in anthropics/skills, badlogic/pi-skills, or @howaboua/pi-skills; authored an in-house github skill following the fedoo/ansys OKF-adviser pattern.", "The github skill links an OKF bundle at skills\github\okf; every call must run the OKF improvement workflow (consult, improve, validate).", "gh CLI 2.101.0 was found already installed (winget GitHub.cli) but is not always on shell PATH; the skill always cites C:\Program Files\GitHub CLI\gh.exe as path with full-path fallback."]
  * **Changes**:
    * ["Added skill C:\Users\connessn\.pi\agent\skills\github\SKILL.md with verified environment facts, research rules, and the mandatory OKF workflow.", "Captured verified facts: gh 2.101.0 (C:\Program Files\GitHub CLI\gh.exe), auth account Tithanium via keyring (scopes gist, read:org, repo), git 2.52.0.windows.1, user Tithanium <nathanael.connesson@gmail.com>."]
  * **Open questions**:
    * ["Refresh the OKF bundle log date of the capture block if needed for ISO timestamps.", "Consider a dedicated repo-specific OKF bundle per major project (like Doc_tech_fedoo\okf) when a specific repository requires deep docs."]
