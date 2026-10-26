# Docs findings from `restructure-and-evaluate-catalogue`

Hand-off from the docs and structure re-check (design D-10, task 2.5) of the change
`restructure-and-evaluate-catalogue`. That change did not edit these files, because this change's
`tasks.md` lists them. Full evidence:
`../../restructure-and-evaluate-catalogue/inputs/evidence/docs.md`.

## 2026-10-27

| File | Finding | Owner of the fact | Suggested action |
|---|---|---|---|
| `README.md` | Still open from the earlier hand-off: "What this is" restates "AGENTS.md canonical, CLAUDE.md pointer, no symlink". | `openspec/specs/dual-cli-distribution` + `AGENTS.md` | State it once and link to it. |
| `README.md` | The build-loop table (step, `/opsx` verb, driver) restates the verb map in `spine/workflows.md` and the EPIC tier in `docs/ai-coding/build-lifecycle.md`. This is outside the README's register topic ("what the catalogue is and how to install it"). | `spine/workflows.md` | Keep one sentence and a link. |
| `README.md` | The *Repository structure* tree lists the contents of `docs/` without `development-method.md` and `skill-inventory.md`. | the tree itself | Add both, or describe `docs/` without listing it. |
| `README.md` | The *Coming* note tracks the Antora follow-up in `.claude/HARD-QUESTIONS.md`, a local working file rather than an issue or an EPIC. | issue tracker | Link an issue, or drop the pointer. |
| `README.md` | Calls `docs/environment/setup.md` "the canonical, CLI-agnostic entry point". | — | Say "the entry point". |
| `AGENTS.md` | Still open from the earlier hand-off: the method section restates the change path and condensed rules from `docs/development-method.md`. (`CONTRIBUTING.md` and `spec/CREATING_SKILLS.md` now link to §3 instead.) | `docs/development-method.md` §3 | Keep one-line mandates, each with a link. |
| `AGENTS.md` | The root `VERSION` being the single version source is stated twice: once in the *Versioning* bullet and again under *Specs & versions*. | `AGENTS.md` (one bullet) | Keep one of them. |
| `docs/environment/setup.md` §2 | The *Mandatory* table says `superpowers` and `ponytail` are "`.claude/skills/`-loadable, so opencode reads it natively, no separate port". `dual-cli/compatibility.md` and `setup-opencode.md` Step 4 install both as opencode plugins ("Not a `.claude/skills/` copy"). These contradict each other. | `dual-cli/compatibility.md` | Correct setup.md and link to the matrix row. |
| `docs/environment/setup.md` §2 | "Pinned version: … (currently `1.4.1`)" repeats `spine/openspec-version.txt`, so the number has two homes. The page itself says it should have exactly one. | `spine/openspec-version.txt` | Drop "(currently 1.4.1)". |
| `docs/environment/setup.md` §3 | A page that calls itself CLI-agnostic gives only Claude forms: "globally via `/plugin`" and "the global `~/.claude/CLAUDE.md`". | `dual-cli/setup-*.md` | Name both CLIs, or link to the runbooks. |
| `docs/environment/setup.md` §5 | The CI/CD boundary is outside the register topic ("installing, external dependencies"). | `ci-cd-delivery`; `docs/ai-coding/build-lifecycle.md` §7 | Move it there, or replace it with a link. |
| `docs/environment/setup.md` §6 | "Agents → skills migration note" is history from before 3.0 and repeats agent models ("read-only, opus"). | `CHANGELOG.md`; `agents/*.md` | Remove it. |
| `docs/environment/setup.md` §3–§4 | Still open from the earlier hand-off: the AGENTS-canonical blockquote, and the contradiction with `project-setup`. | as before | as before |
| `docs/environment/openspec-setup-guide.md` §4 | Restates the AGENTS-canonical rule again. That makes four places in the docs. | `openspec/specs/dual-cli-distribution` | Replace it with a link. |
| `docs/environment/openspec-setup-guide.md` | Stale terms: "(v2)" in the title, "EPIC-09" (twice), "the two-tier method". | — | Remove them. |
| `docs/environment/openspec-setup-guide.md` §3 | The anchor `#migration-claudememoryepics--spine` does not exist. The heading in `spine/epic-change-memory-mapping.md` now ends "(R10)". | `spine/epic-change-memory-mapping.md` | Retarget the anchor. |
| `docs/environment/openspec-setup-guide.md` §1 | The layout tree restates `spine/README.md` "Where things live". | `spine/README.md` | Replace it with a link. |
| `docs/environment/dual-cli/setup-claude.md` Step 9 | Hard-codes the skill/agent count of every bundle (5/0, 5/0, 4/0, 9/3, 9/0). These restate `bundles.yaml` and will drift. | `docs/skill-inventory.md` (generated) | Point to the catalogue map. |
| `docs/environment/dual-cli/setup-claude.md`, `setup-opencode.md` Step 3 | The bundle "Install if you…" tables repeat the README's *What's inside* column. | `README.md` | Keep one table. |
| `docs/environment/dual-cli/compatibility.md` | "(DEC-11)", "(DEC-9)" and "(task 4.4)" refer to an archived change and have no link. | the archived change | Link to it, or drop the ids. |
| `docs/environment/dual-cli/setup-opencode.md` | Every install, list and status command pins `#develop`, so users install unreleased code. | `meaningfy-release` | Decide: pin a release tag, or say why `develop` is intended. |
| `docs/ai-consulting/**`, `docs/ai-sales/**` | The Decision Package's five parts are restated in `advisory-runbook.md` §5, `consulting-dod.md` (twice), `playbooks/technical-consultant.md`, `ai-sales/engagement-lifecycle.md` and `ai-sales/services/index.md`. | `decision-package` skill | Name it and link to it. |
| `docs/ai-consulting/advisory-runbook.md` §4 | By its own account, it states `discovery-flow.md` §3–6 in full. | `decision-package/references/discovery-flow.md` | Sequence the steps and link to them. |
| `docs/ai-sales/engagement-lifecycle.md` | The H1 is "Discovery & Onboarding", which does not match the file or its scope (presale to repeat clients). It also uses "canonical coaching intentions". | — | Retitle it; drop "canonical". |
| `docs/ai-sales/engagement-lifecycle.md` *Known gaps* | A durable doc links to `openspec/changes/define-blc-engagement-model/proposal.md#known-gaps`, which moves when that change is archived. | the synced spec | Retarget it when the change is archived. |
| `docs/ai-sales/semantic-layer-services.md` | A page that only points at `services/index.md` and repeats its introduction. | `services/index.md` | Fold it into the index. |
