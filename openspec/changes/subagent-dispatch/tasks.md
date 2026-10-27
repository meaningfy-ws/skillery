> Derives from: the EPIC [`proposal.md`](proposal.md) and [`design.md`](design.md) (`subagent-dispatch`).

## 0. Setup

- [ ] 0.1 Create the feature branch off `develop` (naming per `meaningfy-git-workflow`); commit the
  EPIC, PLAN, specs and inputs as the first commit.

## 1. Subagent dispatch in `guardrails` (spec `subagent-dispatch`)

- [ ] 1.1 Add `### 5. Subagent dispatch` to `skills/guardrails/SKILL.md` per design D-1 (DEC-1…7 as
  **Rule** / **Enforced by**; no agent named).
- [ ] 1.2 Write `skills/guardrails/references/subagent-reports.md`: the base report and the
  per-purpose table (design, *The base report*), plus the worked brief.
- [ ] 1.3 Update the `guardrails` description, Boundary section, "model tier" wording, the "bounded
  budget" phrase and the "three guardrail types" heading per D-2.
- [ ] 1.4 Add the two probes of D-8 to `tests/trigger_probes.yaml`.

## 2. The report section in every agent (spec `catalogue-governance`)

- [ ] 2.1 Run GitNexus `impact` on `_agent_body_errors` (upstream) and report the blast radius.
- [ ] 2.2 Write the failing tests in `tests/test_repo_lint_negative.py`: an agent without
  `## Report` is rejected; a `## Report` only inside a fenced block is not counted.
- [ ] 2.3 Add the check to `_agent_body_errors` (D-3); tests pass.
- [ ] 2.4 Add `## Report` (after `## Dispatch contract`) to each of the ten `agents/*.md`, citing the
  base report and naming the agent's own fields; every body stays ≤ 40 lines.
- [ ] 2.5 Add the `## Report` section to the body layout in `docs/development/agent-template.md`
  (its order list and the skeleton).
- [ ] 2.6 Add the report `Then` line to each agent's Scenario Outline in
  `tests/features/agents/<name>.feature` (D-7).

## 3. Appetite and plain-language templates (spec `epic-shape`)

- [ ] 3.1 Add the *Appetite* section with the six sizes to `skills/epic-planning/SKILL.md` (D-5).
- [ ] 3.2 Rewrite the comments and instructions of
  `skills/project-setup/assets/openspec-schema/meaningfy/schema.yaml` and its `proposal.md`,
  `design.md` and `tasks.md` templates with the word map (D-6); `spec.md` carries no jargon and is
  left as is; headings unchanged; the Appetite guidance names the six sizes and points to
  `epic-planning`.
- [ ] 3.3 Drop the week mapping from `skills/vault-conventions/references/kinds.md` (names kept);
  the vault `work-shape` template has none and needs no change.
- [ ] 3.4 Port the three good parts of `skills/epic-planning/references/epic-template.md` into the
  schema templates (D-9), then remove the file (DEC-13).
- [ ] 3.5 Extend the `superpowers` summary in `dependencies.yaml` (D-10).

## 4. Binding

- [ ] 4.1 Add the D-4 line to `AGENTS.md` and to
  `skills/project-setup/assets/templates/agentic/AGENTS.md.tmpl`.

## 5. Regenerate and document

- [ ] 5.1 `make bundles` and `make skill-inventory`; commit the rendered files.
- [ ] 5.2 CHANGELOG lines for the installer (dispatch rules in `guardrails`, agent report sections,
  named appetite sizes, plain-language templates).
- [ ] 5.3 Add a `## Quick Start` to `guardrails` with the worked brief and its base report (D-2b).

## 6. Verify

- [ ] 6.1 `make validate` and `openspec validate subagent-dispatch --strict` green.
- [ ] 6.2 Four-eyes check: a fresh subagent that did none of the work checks the change against the
  specs, the EPIC's intent and the word map (old vs new templates: no meaning lost, headings equal).
- [ ] 6.3 GitNexus `detect_changes` against `develop`; open the PR into `develop`.

## Roadmap

- [ ] 0.1 · [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 2.1 · [ ] 2.2 · [ ] 2.3 · [ ] 2.4 · [ ] 2.5 ·
  [ ] 2.6 · [ ] 3.1 · [ ] 3.2 · [ ] 3.3 · [ ] 3.4 · [ ] 3.5 · [ ] 4.1 · [ ] 5.1 · [ ] 5.2 · [ ] 5.3 · [ ] 6.1 ·
  [ ] 6.2 · [ ] 6.3

## Verification

`make validate` and `openspec validate subagent-dispatch --strict` pass, and the four-eyes check
(6.2) reports no unmet requirement.
