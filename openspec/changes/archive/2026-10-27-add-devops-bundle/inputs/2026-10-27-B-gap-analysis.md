# B — Gaps against a reliable devops lifecycle (2026-10-27)

**Status:** SECONDARY input, **held privately**. The full gap analysis (G-01..G-27 with the state of
each gap) describes Meaningfy's own infrastructure, so it lives in the private stacks repository
under `docs/assessments/2026-10-27/` (DEC-4). This public stub keeps only the ids and the practice
theme each one names, which is what the PLAN cites (design.md D-1).

| # | Stage | Practice theme |
|---|---|---|
| G-01 | Change | Automated checks before merge |
| G-02 | Change | The plan reviewed on the PR |
| G-03 | Change | A second reading of every change; break-glass |
| G-04 | Change | A record of what was applied, when and by whom |
| G-05 | Environments | Separation of environments |
| G-06 | Provision | State locking |
| G-07 | Provision | Hand-offs between layers |
| G-08 | Deploy | Rollback |
| G-09 | Deploy | Versions in git |
| G-10 | Deploy | Promotion between environments |
| G-11 | Deploy | One deploy workflow |
| G-12 | Stack standard | The per-stack minimum applied evenly |
| G-13 | Observe | External probes and central logs |
| G-14 | Observe | Alert tiers and duty |
| G-15 | Observe | Targets and alert rules as code, with owners |
| G-16 | Respond | An incident procedure in force |
| G-17 | Respond | Postmortem actions closed |
| G-18 | Protect: backup | Backup decisions and restore drills |
| G-19 | Protect: backup | Backup storage and credentials |
| G-20 | Protect: access | Joiners, leavers, named accounts, access review |
| G-21 | Protect: access | Exposure and temporary exceptions |
| G-22 | Protect: secrets | Secret inventory and rotation |
| G-23 | Protect: supply chain | Pinning, token scope, scanning |
| G-24 | Document | Confluence kept in step with the repositories |
| G-25 | Document | Written rules matched by the workflows |
| G-26 | People | Someone else can take over |
| G-27 | Skillery | `ci-cd-delivery`'s deploy mechanism claim |

**What already works and must be kept:** spec-first changes with a clarity gate; saved-plan apply;
safe module defaults; Vaultwarden as the source of truth; backups that raise an alert when stale;
scripted cutovers with execution logs; the retirement and sleep/wake procedures; the multi-instance
deploy template; thorough `AGENTS.md` manuals; "the repo wins".
