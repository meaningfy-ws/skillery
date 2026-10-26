<!-- Half one output (DEC-11): the comparison, the per-section decision and the separation verdict.
     Document type: Research decision. Revision 1, 2026-10-26. tasks.md follows when half two is sized. -->

> Parent: EPIC `skill-crafting-method` ([`proposal.md`](proposal.md), DEC-1…DEC-11).
> Research records: [`inputs/research/anthropic.md`](inputs/research/anthropic.md) (A),
> [`inputs/research/superpowers-basecamp.md`](inputs/research/superpowers-basecamp.md) (SP, BC),
> [`inputs/research/spec-paper-security.md`](inputs/research/spec-paper-security.md) (SPEC, P, V, O, C),
> [`inputs/research/skillery-baseline.md`](inputs/research/skillery-baseline.md) (skillery).
> All sources were read from primary files on 2026-10-26 (DEC-8); each record lists what was skimmed.

## Context

The hypothesis under test is [`docs/development-method.md`](../../../docs/development-method.md) (210
lines, v3.1.0) plus the six texts it routes to: 1,414 lines of authoring prose in total. The
published methods were read in full: Anthropic's blog, authoring best practices, `skill-creator` and
the Claude Code skill and eval docs; superpowers `writing-skills` 7.0.0; Basecamp `house-skills`;
the agentskills.io specification and its guides; the Destefanis paper (arXiv 2607.25032, *…A
Software-Engineering Approach*); the Vercel `skills` CLI; OWASP Agentic Skills Top 10 v1.0 (public
review); and the opencode docs.

The result matches DEC-3's expectation. The published methods are **better than skillery on writing
and testing a single skill**. They are **silent on running a catalogue**: one owner per fact,
bundles by role, dual-CLI parity, the issue loop, the change path, the agent standard, and the
Definition of Done.

## Goals / Non-Goals

**Goals:** a per-row adopt / extend / own decision; a separation verdict against DEC-4's four
criteria; the answers to dossier questions 1, 3, 4 and 5; and the shape and size of half two.

**Non-Goals:** rewriting the method in half one (rabbit hole); building eval infrastructure (rabbit
hole); deciding the agent standard again (DEC-7; it shipped in 3.0.0).

## 1. The comparison

Cells: ● covers · ◐ partially · ○ silent · ✕ contradicts. Columns are grouped. **A**: Anthropic's four
sources, best cell shown. **SP**: superpowers. **BC**: Basecamp. **SPEC**: spec and guides. **P**:
paper. **O**: OWASP. **V/C**: Vercel and opencode.

| Row | A | SP | BC | SPEC | P | O | V/C | Only skillery has |
|---|---|---|---|---|---|---|---|---|
| §1 Three readers (user, agent, maintainer) | ◐ | ◐ | ◐ | ◐ | ◐ | ○ | ○ | the **installer** as first reader |
| §2 Principles | ◐ | ◐ | ◐ | ● | ● | ◐ | ○ | one owner per fact + tripwire; installable-or-it-does-not-exist |
| §2.4 Reference, don't copy | ◐ | ○ | ◐ | ○ | ● | ✕ in part (AST05) | ◐ | declared external dependencies |
| §2.5 Failure-first | ● | ● | ◐ | ● | ● | ○ | ○ | — |
| §3 Skill lifecycle, steps 2, 4, 5 (failure, write, prove) | ● | ● | ◐ | ● | ● | ○ | ○ | — |
| §3 Steps 1, 3, 6–8 (decide, boundary, register, document, ship) and the change path | ○ | ○ | ◐ | ○ | ○ | ○ | ◐ | all of it |
| §3 Posture R / C / P | ◐ (degrees of freedom) | ◐ (form to failure) | ○ | ◐ | ○ | ○ | ○ | the posture as a rule |
| §4 Agent lifecycle | ○ | ○ | ◐ (`pr-worker`) | ○ | ○ | ◐ (AST03) | ◐ (C: mode, permissions) | type, dispatch contract, Gherkin |
| §5 Documentation standard | ● | ◐ | ◐ ✕ fixed templates | ● | ◐ | ◐ | ◐ | Quick Start for the installer, README row, CHANGELOG line |
| §6 Installability and reuse | ◐ | ○ | ● | ◐ | ○ | ◐ | ● | bundles by role, dual-CLI from one source, fresh-install check |
| §7 Feedback loop | ◐ | ○ | ○ | ◐ | ◐ | ◐ | ○ | issue templates, weekly triage, batch EPICs |
| §8 Where things live | ○ | ◐ | ● | ○ | ○ | ○ | ○ | (catalogue-specific) |
| §9 Definition of Done | ◐ | ● (per skill) | ◐ | ◐ | ○ | ◐ | ○ | the catalogue lines (bundle, inventory, release) |
| Description rules | ● | ● ✕ (when-only) | ● | ● | ● | ◐ | ◐ | `Not for…` clause; near-miss probe per change |
| Size budgets | ● | ● | ◐ | ● | ● | ○ | ○ | — (skillery's own numbers disagree: "a few hundred words" vs "~500 lines") |
| Behavioural evals (baseline, rate over runs) | ● | ● | ◐ | ● | ● | ◐ | ○ | probes as repo fixtures, but **never run** |
| Security / supply chain | ● | ○ | ● | ○ | ● | ● | ◐ | — |
| Must-hold rules → hooks | ● (A: Claude Code docs) | ◐ | ◐ | ○ | ● | ✕ (hooks as attack surface) | ○ | `hooks/inventory.yaml`, but the rule is unstated |
| Frontmatter format | ● | ● | ● | ● (normative) | ● | ✕ (OWASP's own format) | ● | `metadata.category`; 11 skills use non-spec keys |
| AGENTS.md authoring | ○ | ○ | ● (`agents-md`) | ○ | ○ | ◐ (AST01 identity files) | ○ | canonical AGENTS.md, CLAUDE.md a pointer, never a symlink |
| Agent standard (DEC-9) | ○ | ○ | ◐ | ○ | ○ | ◐ | ◐ | all of it |
| Cross-CLI portability | ○ | ○ | ◐ | ● | ◐ | ● (AST10) | ● | parity gates, rendered agents |

## 2. Decision per row

**Adopt** = cite the external method and delete our prose. **Extend** = external base plus a stated
Meaningfy delta. **Own** = nothing external covers it.

| Row | Decision | Source cited | Meaningfy delta kept |
|---|---|---|---|
| §1 Three readers | **own** | — | unchanged |
| §2 Principles 1–4, 8–10 | **own** | — | unchanged; §2.4 gains one clause (see Security) |
| §2.5 Failure-first + §3 steps 2, 4, 5 | **extend** | superpowers `writing-skills` (RED → GREEN → REFACTOR, baseline, controls, matching the form to the failure); agentskills.io *Evaluating skills* | **D-1 proportionate test rule**: new skill, boundary move or discipline rule → a behavioural baseline run; wording, link or description tweak → probes only. Failure sources include runbooks and review comments (SPEC) |
| §2.7 Progressive disclosure + size | **adopt** | agentskills.io: body < 500 lines and < 5,000 tokens; references one level deep, a ToC over 100 lines | remove "a few hundred words" and the "~500 lines" in `CREATING_SKILLS.md` |
| §3 steps 1, 3, 6–8 and the change path | **own** | — | unchanged |
| §3 Posture R / C / P | **own** | cite SP *Match the form to the failure* as the companion for C and P fixes | unchanged |
| §4 Agent lifecycle (+ DEC-9 agent standard) | **own** | OWASP AST03 for least privilege | the dispatch contract names the minimum tool set |
| §5 Documentation standard | **extend** | agentskills.io best practices (gotchas, say when to load each reference, defaults not menus, no time-sensitive wording) | keep Quick Start, boundary, Related, README row and CHANGELOG line (written for the installer); everything else in the body may emerge (BC) |
| §6 Installability and reuse | **extend** | Claude Code docs on always-on cost (`/skill-doctor`, `claude plugin details`) | add always-on cost as a release signal; bundles by role is the lever |
| §7 Feedback loop | **own** | — | unchanged |
| §8 Where things live | **own** | — | shrinks with the `spec/` decisions (§4 below) |
| §9 Definition of Done | **own** | lines that restate adopted rules become citations | fix the `boundary` / `related_skills` wording: they are body sections, not frontmatter (finding SPEC §5.1) |
| Description rules | **extend** | agentskills.io *Optimizing descriptions* (what + when, imperative "Use this skill when…", ≤ 1,024 characters) | **D-2**: keep `Not for…` only when a near-miss probe needs it; a 1,024-character gate; a target (proposed ≤ 600) as an advisory report |
| Behavioural evals | **adopt** | agentskills.io method (≈ 20 queries, half near-misses, 3 runs, 0.5 threshold, 60/40 split); `skill-creator` as the Claude tool, used as is | `tests/trigger_probes.yaml` stays the repo fixture and seeds each skill's query set; opencode has no runner, recorded as a gap (D-3) |
| Security / supply chain | **adopt** | OWASP AST01, AST02, AST03, AST05, AST07 (AST10 in the dual-CLI section) | the one-paragraph operational rule drafted in SPEC §6 replaces any longer prose |
| Must-hold rules → hooks | **adopt** | Claude Code skills docs; Destefanis §12 | one sentence in §2, routed through `hooks/inventory.yaml` (never skill-frontmatter hooks, which are Claude-only) |
| Frontmatter format | **adopt** | agentskills.io specification | record `argument-hint` and `disable-model-invocation` as Claude-only fields in the dual-CLI gap list; move `version` under `metadata` or drop it |
| AGENTS.md authoring | **extend** | Basecamp `agents-md` (classify every line, verify every command and path, keep ephemera out) | never a symlink; CLAUDE.md is a pointer |
| Cross-CLI portability | **own** | OWASP AST10 | unchanged |

Tally: **own 11 · extend 6 · adopt 5.** The method's governance stays; most of its authoring craft
becomes a citation.

## 3. Answers to the dossier's open questions

1. **superpowers `writing-skills` as the authoring method?** Yes for the core of writing one skill,
   as a declared dependency (it is already one), pinned to the version read (7.0.0). Not as the whole
   method: SP lists 14 deltas skillery keeps. Its iron law ("every edit needs a failing test")
   needs D-1, or it silently overrides the direct-PR path. Its description rule ("when only") is
   the outlier against Anthropic, the spec and the paper; see D-2.
2. *(Answered by DEC-10.)* Basecamp's layout is the mirror image of skillery's `bundles/` tree, and
   the ready fallback if Claude stops resolving symlinks inside a marketplace.
3. **Which eval tool?** `skill-creator` on Claude for trigger and output evals, used as is. The
   agentskills.io method sets the numbers. `claude plugin eval` runs in CI on demand only (D-3). On opencode there is no runner; behaviour there rests on source parity plus the
   static gates, recorded as a gap.
4. **Who is the second user of a separated method?** None today. The candidates (the vault repos,
   client repos scaffolded by `project-setup`, `add-devops-bundle`, `add-sales-bundle`) all live
   inside skillery or consume its catalogue, not its method.
5. **Which `spec/` files survive?** See §4.

## 4. What happens to the authoring texts

| File | Lines | Fate |
|---|---|---|
| `spec/CREATING_SKILLS.md` | 511 | **shrink and merge** with `CONTRIBUTING.md` into one authoring guide (inherited R3): Meaningfy deltas plus citations to `writing-skills` and agentskills.io. Expected size ≤ 200 lines |
| `CONTRIBUTING.md` | 261 | merged into the above; a short pointer stays for GitHub |
| `spec/agent-skills-spec.md` | 146 | **replace** with a citation of the agentskills.io spec, plus skillery's field notes (`metadata` is string → string, `metadata.category`, the Claude-only keys) |
| `spec/skill-template.md` | 63 | **own**, kept; align the body to the decisions above |
| `spec/agent-template.md` | 159 | **own**, kept (agent standard) |
| `spec/skill-repo-governance.md` | 64 | **own**, kept |
| `docs/development-method.md` | 210 | **extend**: deltas plus citations; D-1, D-2, the hooks sentence and the security paragraph added |

Expected result: the 1,414 lines of authoring prose fall to at most 800 (estimate about 700), with
every adopted rule cited.

## 5. Separation verdict (DEC-4)

| Criterion | Holds? | Evidence |
|---|---|---|
| 1. A second consumer outside skillery | **no** | none identified (§3 answer 4) |
| 2. Installable without the catalogue | yes, technically | a method skill could be packaged on its own |
| 3. Tooling runs without skillery's tree | **no** | the method checks read `skills/`, `agents/`, `bundles.yaml` directly (baseline §3) |
| 4. A different cadence from the catalogue | unproven | method changes have shipped with catalogue releases (3.0.0, 3.1.0) |

**Verdict: not separated now.** The owned method stays as docs inside skillery (DEC-4: any failed
criterion keeps it in). Half two makes a later separation cheap without doing it: the method checks
take a configurable root, and the owned method is written as citations plus deltas. **Revisit when** a
team or repo outside skillery asks to run a catalogue the Meaningfy way. That is criterion 1, and the
other three follow from it.

## 6. Half two: shape and size

**Appetite: medium (2–3 weeks part time). One EPIC, four task groups:**

1. **Method text:** `docs/development-method.md` reduced to deltas plus citations; D-1, D-2, the hooks
   sentence and the OWASP paragraph added; the `boundary` / `related_skills` wording fixed in it, in
   `AGENTS.md` and in the DoD.
2. **Authoring texts:** the `CREATING_SKILLS.md` + `CONTRIBUTING.md` merge; `agent-skills-spec.md`
   replaced by a citation and field notes; `skill-template.md` aligned.
3. **Dependencies and evals:** `writing-skills` (pinned) and `skill-creator` declared in
   `docs/environment/setup.md`; the probes header rewritten to point at the eval method; an on-demand
   GitHub Actions workflow running `claude plugin eval` for one bundle or skill, with a cost cap (D-3);
   the opencode eval gap recorded.
4. **Tooling:** a 1,024-character description gate; an advisory size and description-length report;
   frontmatter keys checked against the spec plus the recorded Claude-only list; the obsolete
   `templates_mirrored` check removed; the method checks named as `METHOD_CHECKS`. Each change gets a spec delta
   (`catalogue-governance`; new `skill-crafting-method`).

Catalogue skills themselves are not edited in half two, other than the three `version:` keys (proposal
no-go). Bringing the 21 descriptions over 600 characters under the target is a follow-up batch, because each
description change needs its own probes.

## 7. Half two: implementation design

Derived from §2, §4, §6 and D-1…D-4. Acceptance criteria are the spec deltas under [`specs/`](specs/).

### Decisions made while planning

- **H-1. The method keeps its numbering.** `docs/development-method.md` §1–§9 stay, because
  `AGENTS.md` and other files link to its anchors (`#9-definition-of-done`). Changes:
  - §2.5 (failure-first) gains D-1 and cites `writing-skills` and agentskills.io *Evaluating skills*;
  - §2.6 (trigger) gains D-2 and cites *Optimizing descriptions*;
  - §2.7 (disclosure) replaces "a few hundred words" with the spec's budget, cited;
  - a new §2.11: "A rule that must hold every time is a hook, not skill prose" (routed through
    `hooks/inventory.yaml`);
  - §2.4 gains the third-party content paragraph (design §2, Security);
  - §3 step 5 names the eval tools (D-3) and the opencode gap;
  - §9 gains the D-1 line and the corrected `boundary` / `related_skills` wording.
- **H-2. The merged authoring guide keeps the path `spec/CREATING_SKILLS.md`**, because it is the most
  linked of the two. Its target is ≤ 200 lines of Meaningfy deltas plus citations. `CONTRIBUTING.md`
  becomes a short GitHub entry page (≤ 40 lines): the PR process, a link to the guide and a link to
  the Definition of Done, with no checklist of its own (the existing `catalogue-governance` "One
  checklist" requirement).
- **H-3. `spec/agent-skills-spec.md` becomes ≤ 40 lines.** It holds a link to the agentskills.io
  specification (read 2026-10-26) and skillery's field notes: `metadata` is a map of strings,
  `metadata.category`, and where the Claude-only keys are listed. The list itself lives once, in
  `tools/repo_lint/lint.py` (`CLAUDE_ONLY_SKILL_KEYS`), because the gate reads it.
- **H-4. New checks.**
  - `frontmatter_keys` (blocking): top-level keys must be within the spec set (`name`,
    `description`, `license`, `compatibility`, `metadata`, `allowed-tools`) or
    `CLAUDE_ONLY_SKILL_KEYS` (`argument-hint`, `disable-model-invocation`); `metadata` values must be
    strings.
  - `description_too_long` (blocking): more than 1,024 characters.
  - Two advisory reports: descriptions over 600 characters; `SKILL.md` over 500 lines or over about
    5,000 tokens (characters ÷ 4).
  - `MAX_SKILL_LINES` (650, blocking) is unchanged.
- **H-5. Dead code.** `templates_mirrored` and its test are removed: they compare two templates that
  no longer exist. `readme_inventory_gaps` and `orphan_path_mentions` turn out to be tested (correcting
  the baseline note), so they stay.
- **H-6. The method checks are named, and they run on any root.** `python -m tools.repo_lint <root>`
  already takes the root path, but the catalogue checks (`agents_canonical_invariant`,
  `hooks_inventory_shape`, `bundle_gates`) fail on a tree without skillery's files. That is correct
  for skillery, so they are not changed. Instead `lint.py` gains a tuple `METHOD_CHECKS`, the DEC-6
  split from the baseline §3, as a subset of `ALL_CHECKS`:
  - `frontmatter_present_errors`, `frontmatter_errors`, `frontmatter_strict_yaml`, `name_mismatch`;
  - `skill_too_long`, `boundary_section_present`;
  - `frontmatter_keys`, `description_too_long`;
  - `body_agnosticism`.

  A test runs `METHOD_CHECKS` on a minimal tree (`skills/foo/SKILL.md` with a `## Boundary & Related
  Skills` section, and nothing else) and expects no error. No directory names become configurable
  (YAGNI until D-4 is revisited).
- **H-7. The on-demand eval job** is `.github/workflows/plugin-eval.yml`. It runs on
  `workflow_dispatch` only, with these inputs:

  | Input | Default |
  |---|---|
  | `bundle` (choice of the five) | none |
  | `case` (glob) | `*` |
  | `runs` | 3 |
  | `max_cost_usd` | 5 |
  | `model` | `claude-sonnet-5-5` (pinned) |

  An `ablation` input defaults to `none` (one arm, half the cost); `auto` adds the no-plugin
  baseline when the maintainer wants the Δ. The model id `claude-sonnet-5-5` is the current Sonnet id.

  The job:
  0. checks that the `ANTHROPIC_API_KEY` secret is set, and fails with a message naming it if not;
  1. installs Claude Code with npm;
  2. builds a temporary plugin directory `$RUNNER_TEMP/plugin`: `cp -rL bundles/<bundle>/.` into it,
     writes a minimal `.claude-plugin/plugin.json` (`name` = the bundle, `version` = `VERSION`), and
     copies `evals/<bundle>` into it as `evals/`. A bare copy of `bundles/<bundle>` is not a valid
     plugin root, so the manifest is always written, and only in the temporary directory;
  3. runs `claude plugin eval $RUNNER_TEMP/plugin --trust-plugin --no-publish --runs …
     --max-cost-usd … --model … --ablation … --case …`;
  4. uploads `$RUNNER_TEMP/plugin/evals/results/` as an artefact.

  Suites live in a top-level `evals/<bundle>/<case>/` (`prompt.md` plus `graders/`), never in
  `bundles/`, which is rendered. The job needs a repository secret `ANTHROPIC_API_KEY`, which the
  owner adds; until then it fails at the first step and says so. It is not part of `validate.yml`.
- **H-8. One seed suite proves the job:** `evals/meaningfy-consulting/quotation-bind/`, the 3.1.0
  quotation case. Its prompt asks for a quotation; it has an `llm` grader for the bind register and a
  cover-only scope, and a `tool_used: Skill` grader for `executive-communication`.
- **H-9. Three `version:` keys move to `metadata.version`** (string) in `cosmic-python`,
  `executive-communication` and `semantic-consulting-coach`. That is the only catalogue-skill edit,
  recorded as an exception to the proposal's no-go (DEC-12).
- **H-10. Dependencies** are declared in `docs/environment/setup.md` §2, one row each with a link
  and the version or read date:
  - `skill-creator` (claude-plugins-official);
  - `writing-skills` as part of `superpowers` (7.0.0, the tested version);
  - the agentskills.io specification and guides (read 2026-10-26);
  - the Claude Code skill and eval docs (read 2026-10-26);
  - OWASP Agentic Skills Top 10 (v1.0, public review).

### Anti-patterns

- ❌ Copying `writing-skills` or agentskills.io text into the method. Cite it, and state only the delta.
- ❌ Running the eval job on push, pull request or release (D-3).
- ❌ Putting eval suites under `bundles/` (rendered) or inside `skills/<name>/` (they would ship to
  every installer).
- ❌ Hooks in skill frontmatter (Claude-only). The hooks rule routes to `hooks/inventory.yaml`.
- ❌ Rewriting the 21 long descriptions here (they are a follow-up batch with probes).
- ❌ Making directory names configurable "for later" (H-6).

### Error matrix

| Failure mode | Expected handling |
|---|---|
| `ANTHROPIC_API_KEY` secret missing | Step 0 of the job checks the secret, prints "set the ANTHROPIC_API_KEY repository secret" and fails before anything is installed |
| A bundle has no `evals/<bundle>/` directory | The job stops early: "no suite for <bundle>" |
| A rejected credential, or the cost ceiling reached | `claude plugin eval` starts no further runs and exits 2; the job uploads the partial results, fails, and the log names the cause |
| A skill gains a non-spec top-level key | `frontmatter_keys` fails and names the key and the two allowed lists |
| A description passes 1,024 characters | `description_too_long` fails |
| A merged-guide link breaks | `broken_links` fails in `make validate` |
| A method check fails on a tree without skillery's files | The H-6 test fails; the check is either fixed or moved out of `METHOD_CHECKS` |

## Owner decisions (2026-10-26)

Recorded in [`inputs/2026-10-26-half-one-decisions.md`](inputs/2026-10-26-half-one-decisions.md).

- **D-1 Proportionate test rule: accepted.** A behavioural baseline run for a new skill, a boundary
  move or a discipline rule; probes only for wording, links and descriptions.
- **D-2 Description rule: accepted.** What + when, imperative, a 1,024-character gate, an advisory
  target of ≤ 600 characters, `Not for…` only where a near-miss probe needs it.
- **D-3 Evals: `skill-creator` as is, plus `claude plugin eval` in CI, run on demand only.** The CI
  job is started by hand (`workflow_dispatch`) for a named bundle or skill; it is never part of
  `validate`, of a pull request or of a release. It uses the documented tool with its own graders and
  `--max-cost-usd`, so it is a tool configuration, not the eval harness the rabbit hole forbids.
  opencode stays a recorded gap.
- **D-4 Separation: not now** (§5). The method checks get a configurable root so a later separation
  is cheap.

## Risks / Trade-offs

- [Adopting by reference makes skillery depend on texts it does not control] → pin each to a version
  or commit and record it in `docs/environment/setup.md`; a dependency update is a reviewed change.
- [OWASP v1 is in public review] → cite by entry id and version; re-check at release.
- [The paper adds synthesis, not evidence] → cite it only for the hooks rule, which the Claude Code
  docs also state.
- [Behavioural evals are Claude-only] → opencode parity rests on one source plus static gates; stated
  in the method, not hidden.

## Open Questions

None. Half two can be planned (`tasks.md` + spec deltas).
