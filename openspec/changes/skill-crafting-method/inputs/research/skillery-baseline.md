# Skillery baseline: what the method says today and what enforces it

**Status:** SECONDARY input, half one research. Read 2026-10-26 at v3.1.0 (`develop` @ a88c61e).
The column "Enforced by" is what makes each rule more than prose; the column "Travels with" applies
DEC-6: **method** = the rule would hold in any catalogue repo, **catalogue** = it exists because of
skillery's own tree, bundles or distribution.

## 1. The method, section by section (`docs/development-method.md`, 210 lines)

| § | What it prescribes | Enforced by | Travels with |
|---|---|---|---|
| §1 Start from the person who installs it | three readers (user, agent, maintainer) in that order | review only | method |
| §2 Principles | one job; thin agents, thick skills; one owner per fact; reference, don't copy; failure-first; trigger is the product; progressive disclosure; CLI-agnostic bodies; nothing secret or local; installable or it does not exist | `ownership_claim_report` (advisory), `body_agnosticism`, `skill_too_long`, bundle checks | method (principles 1–7, 9); catalogue (8, 10) |
| §3 Lifecycle — skills | change path (EPIC vs direct PR); **posture rule R/C/P** (added in 3.1.0); eight steps from "decide it is a skill" to "ship" | review; `trigger_probe_report` (advisory) | method |
| §4 Lifecycle — agents | type before body; dispatch contract; skills not knowledge; Gherkin tests; family model aliases | `agent_conformance`, `agent_skill_alignment`, `agent_bundle_membership` (3.0.0, `agent-authoring-standard`) | method (conformance); catalogue (bundle membership) |
| §5 Documentation standard | per skill: trigger-shaped description, Quick Start with a worked example, boundary and related skills, named references; per agent, bundle and user-visible change | `frontmatter_errors`, `boundary_section_present`, `reciprocal_related_report` (advisory) | method |
| §6 Installability and reuse | one bundle per role; both CLIs from one source; declared dependencies; fresh-install check; versioning; "who is the second user?" | `bundle_gates`, `expected_bundle_membership`, `missing_skill_dirs`, `unregistered_skill_dirs`, version sync | catalogue (except the reuse test: method) |
| §7 Feedback and improvement loop | GitHub issue templates (Defect, Request); fix where the fact lives; no fix without a probe; weekly triage, batch EPICs; vault `skill-change` note as defect intake (3.1.0) | `.github/ISSUE_TEMPLATE/` | method |
| §8 Where things live | routing table to `spec/*`, `CONTRIBUTING.md`, `tests/*.yaml`, inventory, AGENTS.md | `broken_links` | catalogue |
| §9 Definition of Done | ten-line checklist | `make validate` covers ~6 of 10 lines; the rest are review | method (checklist); catalogue (make targets) |

## 2. Rows added by the shipped siblings (DEC-9)

| Row | Shipped in | Where | Enforced by |
|---|---|---|---|
| Agent authoring standard (types, dispatch contract, body cap, Gherkin) | 3.0.0 | `spec/agent-template.md` | `agent_conformance` |
| Posture rule (R reusable core / C core + profiles / P precise house standard) | 3.1.0 | `docs/development-method.md` §3 | review only |
| Near-miss trigger probes (`near_miss_of`) | 3.1.0 | `tests/trigger_probes.yaml` | none (data; linter reads `expect` only) |
| Vault `skill-change` note as defect intake | 3.1.0 | method §7, vault template | review only |
| AGENTS.md canonical, CLAUDE.md a pointer, never a symlink | 3.0.0 (repo), 3.1.0 (`project-setup`) | `dual-cli-distribution` spec, `project-setup` | `agents_canonical_invariant` |

## 3. The tooling, classified (DEC-6)

`tools/repo_lint/lint.py` (810 lines) runs 19 blocking checks and 3 advisory reports.

| Method checks (could travel with a separated method) | Catalogue checks (stay in skillery) |
|---|---|
| `frontmatter_present_errors`, `frontmatter_errors`, `frontmatter_strict_yaml`, `name_mismatch` | `missing_skill_dirs`, `unregistered_skill_dirs` |
| `skill_too_long`, `boundary_section_present` | `expected_bundle_membership`, `agent_bundle_membership`, `bundle_gates` |
| `agent_conformance`, `agent_skill_alignment` | `orphan_agent_references`, `hooks_inventory_shape` |
| `body_agnosticism` (dual-CLI method) | `groomed_spec_purpose`, `broken_links` (generic, but tuned to skillery's tree) |
| `agents_canonical_invariant` | |
| advisory: `trigger_probe_report`, `ownership_claim_report`, `reciprocal_related_report` | |

Several method checks read skillery paths directly (`skills/`, `agents/`, `bundles.yaml`), so they
would need a configurable root before they could run in another repo (DEC-4 criterion 3).

**Dead code found:** `templates_mirrored` compares `prompts/CLAUDE.md.template` with
`prompts/AGENTS.md.template`; neither pair exists any more (one template since 3.1.0), and the check
is not in `ALL_CHECKS`. `readme_inventory_gaps` and `orphan_path_mentions` are also defined but not
run. Candidates for removal in half two.

## 4. The authoring texts the method routes to

| File | Lines | Covers |
|---|---|---|
| `spec/CREATING_SKILLS.md` | 511 | step-by-step authoring, structure, scripts, assets |
| `CONTRIBUTING.md` | 261 | submission checklist and PR process |
| `spec/agent-template.md` | 159 | the agent contract |
| `spec/agent-skills-spec.md` | 146 | file format and metadata |
| `spec/skill-repo-governance.md` | 64 | the four artefact types and placement rules |
| `spec/skill-template.md` | 63 | the SKILL.md skeleton |
| `docs/development-method.md` | 210 | the method itself |

Total authoring prose: 1,414 lines across seven files, before any external method is adopted. These
are the candidates the "adopt" decisions would shrink (dossier §4 question 5).
