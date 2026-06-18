# PLAN — design: `meaningfy-release` skill

> Parent EPIC: `release-lifecycle/proposal.md` (golden thread). Decisions DEC-1…DEC-9 are authoritative.

## Goal

Author one engineering skill that is the **single source of authority** for the release lifecycle,
wired into the existing catalogue (`meaningfy-git-workflow`, `ci-cd-delivery`, `project-setup`) by
pointers, never by restating their facts.

## Authority boundary (single-source rule)

| Fact | Authority | This skill does |
|------|-----------|-----------------|
| Conventional Commits, branch naming, PR/rebase etiquette | `meaningfy-git-workflow` | **cite**; add only the `release/x.y.z` + `hotfix/*` branch *lifecycle* it doesn't cover |
| GHCR image build/tag/push, deploy trigger, secrets/Vaultwarden | `ci-cd-delivery` | **cite** for deployable repos; never restate the image flow |
| CI (build/test/lint/coverage/docs publish), scaffolding/projection | `project-setup` | **cite**; hand it the release-workflow + `SECURITY.md` templates to project |
| Versioning policy, changelog, GitHub release notes, PyPI publish, supply-chain, yank/deprecation | **`meaningfy-release` (new)** | **own** |

Anti-pattern to avoid: re-documenting GHCR or commit conventions here. If a sentence restates a fact
another skill owns, replace it with a link.

## Skill shape (DEC-1)

```
skills/meaningfy-release/
  SKILL.md                         # the lifecycle, top-to-bottom; ≤ ~200 lines
  references/
    gitflow-release-runbook.md     # release/x.y.z cut, stabilise, tag, back-merge; hotfix off a tag
    pypi-publishing.md             # Trusted Publishing (OIDC) end-to-end; TestPyPI gate
    supply-chain.md                # signing/provenance/SBOM — recommended-not-required (DEC-7)
```

SKILL.md sections, in lifecycle order:
1. **Overview + authority boundary** (what it owns vs cites).
2. **Versioning policy** (DEC-3, DEC-4) — SemVer contract, what "public API" means, `-rc.N`/`-beta.N`, version of record = git tag mirrored to `pyproject.toml`.
3. **Release branches** (DEC under git-workflow) — `release/x.y.z` lifecycle + `hotfix/*`; cite `meaningfy-git-workflow` for branch mechanics → points to `gitflow-release-runbook.md`.
4. **Changelog & release notes** (DEC-6) — Keep a Changelog + `Unreleased`; GitHub Release body vs CHANGELOG; auto-gen as starting point.
5. **The release engine** (DEC-2) — release-please: commits → release PR → merge → tag → GitHub Release → publish. One diagram of the flow.
6. **Publishing** — libraries → `pypi-publishing.md` (OIDC); deployable → cite `ci-cd-delivery` (GHCR).
7. **Supply-chain** (DEC-7) — recommended-not-required; → `supply-chain.md`.
8. **Governance** (DEC-8) — `SECURITY.md` + coordinated disclosure; yank a bad release; deprecation cycle before MAJOR.
9. **Boundary & Related Skills** (mandatory frontmatter + footer).

## Worked examples (concrete, in the skill)

- **MINOR bump**: merge `feat:` commits → release-please opens "release 1.4.0" PR with changelog → merge tags `v1.4.0` → publishes to PyPI. (shows the happy path)
- **Hotfix**: prod bug on `v1.4.0` → `hotfix/1.4.1` off tag `v1.4.0` → `fix:` commit → tag `v1.4.1` → back-merge to `main`/`develop`. (shows the GitFlow hotfix)
- **RC promotion**: `1.5.0-rc.1` → testing → `1.5.0` final; how the pre-release identifier drops.
- **Yank**: `1.4.0` ships broken → `pip`-installable but flagged → publish `1.4.1` fix → yank `1.4.0` on PyPI (not delete). (shows recovery)

## Error / decision matrix (in SKILL.md)

| Situation | Wrong move | Right move |
|-----------|-----------|-----------|
| Breaking change in a MINOR | bump MINOR | bump MAJOR; deprecation cycle first (DEC-8) |
| Bad release already on PyPI | delete the release | **yank** + ship a patch (delete breaks pinned installs) |
| Secret/token for PyPI upload | store API token in GitHub Secrets | Trusted Publishing OIDC, no token (DEC-5) |
| Version drift (tag vs pyproject) | hand-edit both | release-please is the single bumper (DEC-4) |
| Image release for a service | publish to PyPI | GHCR via `ci-cd-delivery` (DEC-9) |

## PyPI publishing design (pypi-publishing.md, DEC-5)

End-to-end, no tokens:
1. Configure Trusted Publisher on PyPI (repo + `release.yml` workflow + `release` environment).
2. Workflow: `permissions: id-token: write`; build with `python -m build` (or `poetry build`); upload with `pypa/gh-action-pypi-publish`.
3. **TestPyPI dry-run** job gates the real publish.
4. GitHub `release` environment for human approval (free-tier compatible — environments work on private repos).

## Supply-chain design (supply-chain.md, DEC-7) — opt-in

Documented target, marked recommended-not-required: PyPI **attestations** (free via the publish
action), **Sigstore/cosign** keyless signing, **SLSA L2** provenance (GitHub Actions generator),
**SBOM** via Syft attached to the GitHub Release. Adoption is per-repo and incremental; no repo is
blocked from releasing without it.

## Projection seam (project-setup, DEC-9)

`project-setup` projects, per archetype:
- **library** → `release.yml` (release-please + PyPI OIDC) + `SECURITY.md`.
- **product/deployable** → points at `ci-cd-delivery` for GHCR; still gets `SECURITY.md` + changelog.
- **doc-only** → no release workflow.
This change ships the *content/intent*; `project-setup` owns *when/into what repo*. To avoid scope
creep, this EPIC adds a **clearly-marked stub + pointer** in `project-setup`, not a full re-projection.

## Validation

- `make validate` green: frontmatter `boundary` + `related_skills` present; single-source rule (no restated facts); bundle membership declared in `marketplace.json`.
- Self-check: grep the new skill for restatements of GHCR/commit-convention facts → must be links, not prose.

## Decisions (carried from EPIC)

DEC-1 one skill + 3 refs · DEC-2 release-please · DEC-3 SemVer+rc · DEC-4 tag=source of record ·
DEC-5 PyPI OIDC · DEC-6 Keep a Changelog · DEC-7 supply-chain opt-in · DEC-8 governance baseline ·
DEC-9 GHCR stays in ci-cd-delivery.

## Anti-patterns

- Restating `ci-cd-delivery` image flow or `meaningfy-git-workflow` commit rules (breaks single-source).
- A second runnable deploy workflow (the duplication `ci-cd-delivery` exists to kill).
- Tokens/secrets anywhere (Trusted Publishing only).
- Making supply-chain mandatory (DEC-7 says opt-in).
- SKILL.md ballooning past ~200 lines instead of pushing detail into references.
