# PLAN (design): Lean skills

> Derives from: the EPIC [`proposal.md`](proposal.md) (`lean-skills`), DEC-1 to DEC-13. Order of all
> open EPICs: [the reassessment](../delivery-process-and-tools/inputs/reassessment-2026-11-15.md).

Stage 1 (the standard, its lint, the five practices) is planned in full; it is delivered first, in
wave 1. Stages 2 to 5 are planned in outline: each is detailed at the start of its own session,
from the assessments of stage 1's format, and needs no new gate run (reassessment S-10).

## Context

Measured on `develop` `37e90cf` (2026-11-15) with the throwaway counts kept in
[`inputs/findings-size-2026-11-14.md`](inputs/findings-size-2026-11-14.md) and repeated for this
PLAN:

| Fact | Value |
|---|---|
| Prose of all 51 skills (`SKILL.md` body plus every file under `references/`) | 1,330,270 bytes = 1.27 MB (1 MB = 1,048,576 bytes) |
| Skills over 24 KB of prose | 15: `architecture` 141 KB, `project-setup` 136, `cosmic-python` 126, `test-strategy` 89, `semantic-consulting-coach` 56, `writing-antipatterns` 48, `sales-pipeline-custody` 44, `infrastructure-operations` 40, `epic-delivery` 36, `linkml-engineering` 34, `sales-operations` 30, `service-reliability` 29, `sales-conversations` 28, `rulebook` 27, `stack-operations` 27 |
| Bodies over the 6 KB target | 31 |
| Pointers to `references/` in bodies | 224 lines in 35 skills; 192 carry no "when" word |
| Bodies with a closing list of references under its own heading | 5 (`architecture` twice, `cosmic-python`, `formal-reasoning`, `semantic-consulting-coach`) |
| Skills that cite another skill's reference (the `test-strategy` matrix line, fixed by `tests/test_test_strategy.py`) | 40 |

The budget (D-1) and DEC-9's 1 MB total are two different measures. The budget counts body plus
`references/` per skill (1.27 MB in all today). The 1 MB total is measured exactly as the EPIC's
1.45 MB was measured in [`inputs/findings-size-2026-11-14.md`](inputs/findings-size-2026-11-14.md)
(bodies, reference prose and fenced code in Markdown), so the owner's target keeps its meaning.

What exists today, and what stage 1 changes:

- `tools/repo_lint/lint.py` has a hard line cap (`skill_too_long`, 650 body lines) and an advisory
  body report (`skill_size_report`, 500 lines or 5,000 tokens, from the agentskills.io
  specification). Nothing measures references.
- `docs/development/creating-skills.md` § *Body* and `docs/development/README.md` principle 7 cite
  the agentskills.io budget and state no number of their own; the spec `skill-crafting-method`
  requires exactly that ("states no number of its own"). DEC-2 sets our own number, so that
  requirement is modified (spec delta).
- `docs/development/skill-template.md` has Quick Start, Workflow, Gotchas, Boundary.
- The method checks (`METHOD_CHECKS`) must run on any root with a `skills/` directory
  (`skill-crafting-method`). The two new checks join that set.

Short names: **R2** `orchestrate-external-skills`, **R3** `delivery-process-and-tools`, **B**
`harden-checks-and-tests`, **E** `test-suite-care`.

## Goals / Non-Goals

**Goals (stage 1):**

- The lean standard written once, in `docs/development/creating-skills.md`: the three tiers and the
  budget (DEC-2), the shape of a body, the sorting of content, and the five practices (DEC-11).
- Two method checks in `make validate`: the prose budget, and the reference pointers.
- A list that lets the catalogue stay green while skills wait for their rewrite, and that cannot
  rot.
- The template and the method's principle 7 brought in line.

**Goals (stages 2 to 5, outline):** every skill assessed and rewritten to the standard; the
transition list empty; prose of `skills/` at most 1 MB; a second reader per skill (DEC-9).

**Non-Goals:** everything in the EPIC's No-gos. In stage 1 also: no `SKILL.md` is edited (the only
skill file touched is two rows of `test-strategy`'s check inventory, RISK-8), so no description
changes and no trigger probe is needed; no check on section names other than the existing Boundary
check; no judgement of whether a pointer's situation is a good one (D-5, RISK-1).

## Decisions

### D-1 The three tiers and the numbers

A skill has three tiers, read at three costs. These are the "sizes" of the EPIC's outline 1.

| Tier | Files | Read | Limit |
|---|---|---|---|
| Body | `SKILL.md` below the frontmatter | whenever the skill fires | target 6 KB (advisory) |
| Reference | every file under `references/`, any extension, at any depth | when a pointer says so | body plus references at most 24 KB (failing) |
| Material | `assets/`, `templates/`, `scripts/` and any other folder | never as instructions | none |

A KB is 1,024 bytes of UTF-8: 24 KB is 24,576 bytes, 6 KB is 6,144. The frontmatter is not
counted; the description has its own limits. Any file in the skill folder that is not `SKILL.md`
and not under `references/` is material. A template kept under `references/` (today the two
`.adoc` use-case templates of `architecture`) counts as prose until its rewrite moves it to
`assets/`. Moving prose into material to pass the check is the EPIC's first rabbit-hole; the
second reader and review catch it (RISK-2), the lint does not. Sizes are read from the working
tree, as every other lint check does; CI, on a clean checkout, is the reference.

### D-2 The shape of a body

The template becomes, in this order:

1. `# Title`, then one or two sentences: the bias or mistake this skill corrects.
2. `## Quick Start`: one real worked example (required by the method's Definition of Done).
3. `## Rules`: the decision rules. Where a rule set has typical failures, a **Common mistakes**
   table: Mistake | Why it fails | Do instead.
4. `## When … do …`, headed `## Triggers`: rules of the form "when X appears, do Y".
5. `## Before you hand over`: the final checklist, as a **Quick diagnostic** table: Question | If
   not | Action.
6. `## Boundary & Related Skills` (unchanged, checked).

An activity skill keeps its `## Workflow` between Quick Start and Rules. Sections 3 to 5 are
omitted when empty. Only the Boundary heading is checked; the rest is the template and review.

### D-3 The prose budget check

`prose_budget(repo)` in `tools/repo_lint/lint.py`, added to `ALL_CHECKS` and `METHOD_CHECKS`. For
each skill: `len(body.encode())` plus the byte size of every file under `references/`. Over 24,576
with no `budget` entry in `skill-budget.yaml` (D-4) fails. `prose_budget` also owns every error
about the file itself (D-4):

```
prose_budget: cosmic-python: prose is 126177 bytes (body 20702, references 105475); budget 24576
```

The existing advisory `skill_size_report` changes its threshold to the 6 KB body target and its
label to "lean body target"; `ADVISORY_SKILL_LINES` and `ADVISORY_SKILL_TOKENS` go.
`skill_too_long` (650 lines, failing) stays unchanged: it is a different guard and nothing here
needs it gone.

### D-4 `skill-budget.yaml`: the transition list and the exceptions

One file at the repository root, read by both checks, optional (absent means empty), so the method
checks still run on a bare `skills/` tree:

Format example (at delivery `over_budget: {}`, task 1.4):

```yaml
# Skills waiting for their lean rewrite (lean-skills stages 2-5), each with the checks it is
# exempt from. A skill leaves this list in the pull request that rewrites it.
pending:
  architecture: [budget, pointers]
  guardrails: [pointers]
# Skills over the 24 KB prose budget for a recorded reason (DEC-2). Exempt from the budget only.
over_budget:
  project-setup: "<why this skill needs more, written when its rewrite records it>"
```

Each `pending` entry names only the checks the skill fails, so a skill pending for its pointers is
still held to the budget while other EPICs add prose to it. Rules `prose_budget` enforces on the
file, so it cannot rot:

- a name that is not a skill folder fails;
- a name both in `pending` with `budget` and in `over_budget` fails;
- a `pending` exemption the skill no longer needs fails ("guardrails passes pointers; remove it");
- an `over_budget` skill at or under the budget fails ("remove its exception");
- an `over_budget` reason that is empty fails;
- a file that is not valid YAML, has another top-level key or another exemption name gives one
  error, and both checks then report nothing else until it is fixed (no flood of 40 errors);
- a missing key, or a key set to `{}` or null, means empty; an empty exemption list or a check
  named twice in one entry is a malformed file.

The exact messages, which the tests of task 1.1 assert. They are shown as `main()` prints them;
a check returns them without its `<check>: ` prefix, and tests assert the returned text. The same
holds for the D-5 examples.

| Rule | Message |
|---|---|
| over budget, unlisted | `prose_budget: <skill>: prose is <n> bytes (body <b>, references <r>); budget 24576` |
| unknown name | `prose_budget: skill-budget.yaml: <name> is not a skill` |
| double listing | `prose_budget: skill-budget.yaml: <skill> is exempt from the budget twice (pending and over_budget)` |
| stale pending | `prose_budget: skill-budget.yaml: <skill> passes <checks>; remove it from pending` |
| stale `over_budget` | `prose_budget: skill-budget.yaml: <skill> is within budget (<n> bytes); remove its exception` |
| empty reason | `prose_budget: skill-budget.yaml: <skill> has no reason for its exception` |
| malformed file | `prose_budget: skill-budget.yaml: <the parse or shape problem>` |

`<checks>` is the comma-separated list of exemptions no longer needed, in the order `budget,
pointers`. The stale-pending rule needs the pointer scan, so `prose_budget` and
`reference_pointers` share one helper, `_pointer_errors(repo, skill)`, which returns the pointer
errors of one skill.

At delivery of stage 1, `pending` holds exactly the skills and checks that fail on that day (about
46 skills, computed with an empty list), and `over_budget` is empty: no exception is granted before
a skill has been assessed. The list is computed again after the last rebase, right before merge
(task 1.4), because a wave-1 pull request merged meanwhile can make an entry stale. Only a skill
that exists when stage 1 merges may be listed; a later new skill meets the standard on arrival
(S-9; owner, OQ-4). A pending skill's size is not frozen (owner, OQ-2).

### D-5 The reference pointer check

`reference_pointers(repo)`, in `ALL_CHECKS` and `METHOD_CHECKS`, over every `SKILL.md` body of a
skill not pending for `pointers`. The owner chose the fixed sentence form (OQ-3), so both halves
of practice 1 are checked.

- A **pointer** is any mention, outside fenced code, of a file that exists in the skill's own
  `references/`: a Markdown link or a code span whose path resolves there (an `#anchor` is
  ignored), or the bare file name of such a file in plain or bold text. A path into another
  skill's `references/` is not a pointer: the `test-strategy` matrix line in 40 skills
  ("``answers `X` in `test-strategy`'s matrix (`references/software.md`)``") resolves to no file of
  the citing skill and is left alone.
- Its **sentence** is the text from the previous `.`, `!`, `?` or block start to the next `.`,
  `!`, `?` or block end, where a block is a paragraph, a list item with its continuation lines, or
  a table cell. Every pointer, every other link and code span are replaced by a placeholder
  before the split, so the dots in `alerting.md` or a URL never end a sentence. A `.`, `!` or `?`
  ends a sentence only when followed by whitespace or the block end, and never in `e.g.` or
  `i.e.`, so "v3.14" and "§ 2.1" do not split. The list marker
  and Markdown emphasis are stripped before the match.
- (a) The sentence SHALL have the form, case-insensitive:
  `Read|Open <pointer> when|if|before|after|while|once|whenever|until|unless <situation>: it adds|it gives|it holds <what>.`
  As a regular expression on the sentence with the pointer replaced by `P`:
  `^(read|open) P(, P)*( and P)? (when|if|before|after|while|once|whenever|until|unless) .+?: it (adds|gives|holds) .+$`.
- (b) No heading of the body matches, case-insensitive and as whole words,
  `\b(references|see also|further reading|resources|supporting materials?)\b`: a heading of that
  kind closes the body with a list, which DEC-11 forbids. "Quick reference" and "Boundary & Related
  Skills" pass; "References for Deeper Understanding" fails.

Parsing rules, fixed by a simulation of this check on all 51 skills (280 pointers today, none in
the form; the 11 skills without `references/` pass):

- Runs of whitespace, newlines included, collapse to one space before the match, so a sentence
  wrapped over the lines of a list item matches.
- A blockquote line is read without its `>`. A nested list item is its own block. A pointer in a
  heading fails.
- A file name is the name with its extension (`checklists.md`, never the word "checklists"). A
  code span equal to an own reference file's name, or to its path under `references/`, is a
  pointer. A path to a folder under `references/` (`references/channels/`) points to that folder
  and is held to the form too.
- Every pointer must sit in a sentence of the form; further pointers in the same sentence, before
  or after `it adds`, are covered by it. A separate sentence that mentions an own reference as a
  topic ("the severity table in P decides the channel") fails: it is reworded as a pointer or
  drops the file name.
- The Boundary section is held to the form like any other part of the body.
- The error names the line that holds the pointer. A pointer in a heading and a folder pointer use
  the pointer message, with the path as written.
- Errors give the 1-based line in `SKILL.md`, frontmatter lines counted.

```
reference_pointers: formal-reasoning: line 44: pointer to references/patterns.md is not "Read <file> when <situation>: it adds <what>."
reference_pointers: architecture: line 653: heading "References for Deeper Understanding" closes the body with a list of references
```

Good and bad, for the standard's worked example (here as code spans; a Markdown link to the same
file is judged the same way):

```markdown
- Read `references/alerting.md` when writing or reviewing an alert
  rule: it adds the severity table and the routing per channel.        <- passes
- Read `references/alerting.md` when needed.                           <- fails: no "it adds"
- `references/patterns.md`: conflict, dead rule, minimal fix           <- fails
| Open day | `references/run-types.md` |                               <- fails: a table cell needs the sentence too
```

The form checks that both halves are present, not that they are good: "when needed" with "it adds
details" passes the regex only if written as a whole sentence, and the second reader judges it
(RISK-1). The cost the owner accepted: the 224 pointer lines are reworded, each in its skill's own
rewrite (DEC-13), never in stage 1.

### D-6 Where the standard lives

In `docs/development/creating-skills.md`, `### The lean standard` (anchor `#the-lean-standard`)
replaces `### Body`, with four `####` parts: the tiers and the budget (D-1, D-3, D-4); the shape (D-2); the sorting of content (D-7); the
five practices (D-8). It is the single home: no skill owns skill authoring, and the method
(`docs/development/README.md`) points to it. Principle 7 of the method states the tiers in one
sentence and links there, with no number of its own; the agentskills.io numbers move to the "What
we adopt" table as the outer limit the specification sets. `skill-template.md` takes the shape of D-2. Target size of the new
section: under 8 KB.

### D-7 The sorting of content (the assessment's classes)

Every passage of a skill is sorted into one class. The classes, and DEC-11's content filters
written as the test for **keep**:

| Class | Test | Goes to |
|---|---|---|
| keep | Meaningfy's own: a house rule, a convention, a rule from a review or from the owner, a rule with a check behind it (DEC-12). And non-obvious: a capable model would not do it unprompted. | stays, in the body or a reference |
| dependency | general knowledge a registered dependency states | cut; the skill names the dependency once |
| owner | a fact another skill owns | cut; cite the owner skill |
| example | example code (DEC-7) | cut, a `docs/` page links the source; a short form stays only for a convention a model cannot guess |
| material | really a template or a script | moved to `assets/` or `scripts/` |
| drop | generic knowledge no dependency holds and a model already has; a "why it works" that restates the rule; repetition inside the skill | cut |

A passage that is a rule with a lost reason is **keep**; doubt goes to keep (RISK-3).

The **assessment record** for one skill, written in the stage that rewrites it, is
`openspec/changes/lean-skills/evidence/assessment-<skill>.md`:

```markdown
# Assessment: <skill>
Before: body <B> bytes, references <R> bytes. After: body <B'>, references <R'>.

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | § Clean Code Standards, l. 120-138 | keep | catalogue entries PR-… (DEC-12) | tied to Ruff rules |

Second reader: <who or which subagent>, <date>. Verdict: nothing lost | lost: <list, restored in …>
```

### D-8 The five practices of DEC-11, as the standard states them

1. **Pointers say when and what.** Every pointer to a reference is one sentence, "Read `<file>`
   when `<situation>`: it adds `<what>`.", at the point of need. Accepted variants: Read or Open;
   when, if, before, after, while, once, whenever, until or unless; it adds, gives or holds. No list of references closes a
   body. Checked by D-5.
2. **Two table forms.** Common mistakes (Mistake | Why it fails | Do instead) for rules; Quick
   diagnostic (Question | If not | Action) for the final checklist (D-2).
3. **Content filters.** Non-obvious points only; no "why it works" that restates the rule; nothing
   the model already does. They are the test for keep (D-7).
4. **Shared rules once.** A rule that several workflows of one skill use is stated once in that
   skill and cited by its workflows; a rule several skills use lives in one skill (the existing
   single-owner rule).
5. **A fallback for a named external dependency.** Where a body names an external dependency, it
   says what to do when it is missing, in one sentence: "If `<dependency>` is not installed, offer
   `<install command>`; if the person declines, say that you work without it and what is lost."
   The body names no CLI: it offers to install the dependency as `dependencies.yaml` records it
   for the running CLI (R2 owns that register).

## Algorithm / approach

Stage 1, in test-first order:

1. Write the failing tests in `tests/test_repo_lint_negative.py`, on synthetic roots built with the
   existing `_skill` helper: one per row of the error matrix below that is a check outcome, plus a
   passing case for each check on a bare root with no `skill-budget.yaml`.
2. Add `_skill_budget(repo) -> tuple[dict[str, list[str]], dict[str, str], str | None]`
   (pending, over_budget, the malformed-file error; empty maps and `None` when the file is
   absent), `_pointer_errors(repo, skill)`, `prose_budget`, `reference_pointers`; change
   `skill_size_report`. Add the two checks to both check tuples.
3. Run both checks with an empty list on the real tree; write `skill-budget.yaml` with every
   failing skill under `pending`, sorted, each with the checks it fails. Run `make validate`:
   green. Repeat after the last rebase, right before merge.
4. Add one positive test in `tests/test_repo_lint.py`: both checks return `[]` on the real tree.
5. Write the standard (D-6, D-7, D-8), the template (D-2), principle 7. Run `make lint`.
6. CHANGELOG line under `[Unreleased]`, written for the installer.

The checks are pure functions of the tree: re-running them is safe and gives the same answer.

**Worked example of the transition.** Stage 2 rewrites `cosmic-python` from 126 KB to, say, 22 KB
with its pointers reworded to the sentence form. The pull request removes `cosmic-python` from
`pending`; both checks now run on it and pass. Had the pull request forgotten to remove it, the
check fails with `prose_budget: skill-budget.yaml: cosmic-python passes budget, pointers; remove
it from pending`.

### Stages 2 to 5, outline

Every rewrite follows one loop per skill: assess (record, D-7); rewrite to the shape; second
reader compares before against after (the spec's "second reader" requirement); restore anything
lost; remove the skill from `pending` (or record an `over_budget` reason); `make bundles`,
`make skill-inventory`, `make validate`. A description is not touched (EPIC No-go) unless a probe
ships with it.

| Stage | Skills | Starts when | Extra |
|---|---|---|---|
| 2 pilot | `cosmic-python` | R2 stage 1 has registered the book rule sets (DEC-10, DEC-13) | `code-principles-governance` delta (ids survive, DEC-12); the extraction-threshold defect; the `docs/` page linking `mapping-suite-sdk` (DEC-7); **owner checkpoint** before stage 3 |
| 3 | the other engineering skills (`meaningfy-building`, `meaningfy-architecture`) | B's prose side and E stage 1 have landed (wave 5) | `architecture`, `project-setup`, `test-strategy` decide keep or exception |
| 4 | sales (`meaningfy-sales`) | `commercial-portfolio` and the rest of R2 have landed | |
| 5 | every skill not rewritten in stages 2 to 4 (devops, core, consulting, legal, vault-assistant, navigator) | after stage 4 | the 1 MB total measured as in the Context and recorded; `pending` key removed when empty |

### Stage 2, detailed (revised after the gate, 2026-11-15, S-10; no new gate run)

Measured on `develop` `6638eeb`: `SKILL.md` body 20,702 bytes; `references/` 105,475 bytes in nine
files: seven `example-*.md` (100,840), the catalogue `principles-and-anti-patterns.md` (8,426) and
`testing-checklist.md` (3,237). Appetite of the stage: MEDIUM (one skill, but the catalogue that
every code skill, agent and Semgrep message cites by id).

**D-9 What the body keeps, and its shape.** The body follows D-2, with a `## Workflow` (it is an
activity skill): the bias it corrects (code structure inside a service, not system design), a Quick
Start (one function placed in its layer), the workflow "implement from a spec" (layer order,
`make check-architecture`), then `## Rules`: the layer contract (the four layers, what each may
import, abstract interfaces in `adapters/` that services import, the dependency law), component
organisation (the tree; the rule is `PR-COMPONENT-FIRST`), the folder vocabulary with the book's
synonyms (`/domain` = `models/`, `/service_layer` = `services/`) and no `src/`, what to test per
layer (the table), observability placement (logging in `services/` and `entrypoints/`, structured,
no `print`), when not to layer (spikes, single-file scripts); `## Before you hand over`: the
one-minute structure check as a Quick diagnostic (CHK-6); `## Boundary & Related Skills`. Each
pointer to the catalogue or the testing checklist is in the sentence form (D-5). Target: body near
6 KB, skill under 24 KB; the skill leaves `pending` with no `over_budget` entry.

**D-10 The ten clean-code and SOLID bullets become catalogue entries (DEC-12; harden-checks
D-31).** They move from the body into a fourth table of the catalogue, `## Clean code and SOLID`,
one short line each, with new ids of the existing two-letter form: `CC-NAMES`,
`CC-SMALL-FUNCTIONS`, `CC-NO-MAGIC-STRINGS`, `CC-SHALLOW-NESTING`, `CC-EXTRACT-THRESHOLD`,
`CC-SRP`, `CC-OCP`, `CC-LSP`, `CC-ISP`, `CC-DIP`. Where an entry overlaps an older id it cites it
(`CC-NO-MAGIC-STRINGS` → `BP-CONSTANTS-ENUMS`; `CC-DIP` → the layer contract). The table has no
"Checked by" column yet: `harden-checks-and-tests` task 1.12 adds it to all four tables, so its
values land in the layout this stage leaves. Every existing id keeps its spelling and meaning.

**D-11 The extraction threshold and the nesting depth, fixed once (the defect).** The body gave
two thresholds ("three similar lines don't warrant a helper; ten do" and "2-3 similar lines are OK;
5+ warrant extraction") and two depths ("3+ levels" and ">3 levels"). `CC-EXTRACT-THRESHOLD`:
two or three similar lines stay; five or more are extracted (the stricter, nearer
`PR-REUSE-COMPACT`). `CC-SHALLOW-NESTING`: at most three levels of nesting in a function. Both
are the house numbers that win over the book sets (orchestrate-external-skills stage 1a, conflict
2). The owner confirms or changes them at task 2.3.

**D-12 The example files leave; a docs page links the real code (DEC-7).** The seven
`example-*.md` files are deleted after the assessment has sorted every passage; a passage sorted
**keep** goes to the catalogue or the body, never to a new reference. A page for people,
`docs/practice/engineering-standards/worked-examples.md`, links per layer (models, adapters,
services, entrypoints, tests, configuration, exceptions, quality gates) to files of the public
`meaningfy-ws/mapping-suite-sdk` on its `develop` branch, each path checked to exist. The
generic-repository example goes with its file; the override that allows a generic repository
base is the orchestrator's to write (orchestrate-external-skills stage 2, conflict 4).

**D-13 Where the cut text goes.**

| Cut | Class (D-7) | Now |
|---|---|---|
| Tool list, Makefile pattern, CI/CD workflow, `example-project-quality-ci.md` | owner | `project-setup` (templates, `config-files.md`, `ci-and-infra.md`); the list named pylint, flake8, tox and SonarCloud, which the scaffold no longer uses |
| Workflow 2 (review questions), Workflow 4 (drift table), "Principles & best practices" | owner, drop | `meaningfy-code-review` lenses over the catalogue; duplicates of catalogue entries dropped |
| ADR advice, contract-first | owner | `architecture` |
| Stream Coding phases and integration | dependency | named once (DEC-6) |
| TDD ritual, BDD for use cases | owner | `superpowers:test-driven-development`, `bdd-gherkin` |
| FIRST, test pyramid, fixtures and parametrize, the quote | drop | general knowledge |
| "Mock external dependencies" | owner | the testing checklist (items 4 and 5: fakes over mocks) |
| SOLID and clean-architecture reasoning in depth | dependency | the book sets `clean-architecture`, `refactoring`, `a-philosophy-of-software-design` (`agent-rules-books/meaningfy-building`), named once with the fallback sentence of practice 5 |
| Closing list of references, "Skill relationships" | drop | pointers at the point of need; Boundary |

**D-14 Citers kept true.** The rewrite changes the section names other files cite. In the same
pull request: the L2 and L3 rows of `meaningfy-code-review` name the new sections and the `CC-`
region; `test-strategy`'s `inventory.md` rows CHK-1, CHK-4, CHK-6, CHK-7, CHK-8, CHK-9 and
`software.md` row CHK-6 point to files that still hold the check (no id changes, no new row);
`docs/practice/engineering-standards/testing-standard.md` links the docs page;
`testing-checklist.md` drops its line to the example file. Records under `openspec/changes/` that
quote the old files are history and stay. The description is not touched (No-go), though it still
names ADRs and CI tools; a description change with its probe is a follow-up for the owner.

**D-15 Review and check of a prose stage.** No code changes, so the code lenses have nothing to
judge. The challenge is the second reader (spec `lean-skill-standard`): a fresh subagent that did
not write the rewrite compares the skill at `develop` with the rewrite and the assessment record,
lists every Meaningfy rule lost, every pointer with an empty situation or "adds" (RISK-1), every
passage moved instead of cut (RISK-2), and every citer left untrue (D-14). Lost rules are restored
before the pull request; the rest is decided by the lead as in the stage loop. The check is the
full gates (`make validate`, `make validate-spine`) and CI. Then the owner's checkpoint (task 2.3).

**D-16 The second reader's findings, decided by the lead (2026-11-15).** Verdict "lost: three
rules"; all restored. (1) An interface may be an `abc.ABC` named `<Thing>ABC` or a
`typing.Protocol` where structural typing fits (the old "interfaces/protocols"; the SDK uses
both). (2) The composition root: an entrypoint may construct adapters and pass them to the
service, and never calls them; a service may default an adapter parameter to the production
implementation, its only concrete import (old DI example). (3) Adapter tests use a double of the
external system in a unit test, or the real system in an integration test (`project-setup`'s
tiers). Also fixed: the Quick Start no longer claims `make check-architecture` checks the CLI rule;
the citers that still sent CI to `cosmic-python` (`project-setup` defaults table, the `AGENTS.md`
template, `architectural-guardrails.md`); the lens rows cover the three new `BP-` ids, `CC-DIP` sits
with L3; OpenTelemetry and JSON logging restored (doubt goes to keep); the `fields()` convention for
field names joins `BP-STRICT-BASE-MODEL`; `CC-SMALL-FUNCTIONS` keeps "a target", four similar lines
are a judgement call; the docs page drops the generic-repository sentence until the orchestrator
writes that override. Under the floor, pre-existing: `architecture-guardrails.md` and two
templates still say `domain` for `models/`; the description still names ADRs and CI (D-14).

### Stages 3 to 5, detailed (revised after the gate, 2026-11-15, S-10; no new gate run)

**D-17 Task 2.3 decided by the lead.** The owner asked the lead to finish the EPIC alone
(2026-11-15), so the lead decides the checkpoint, as when the developer says "choose what is
best". Accepted as merged in #271: the house numbers of D-11 and D-16 (functions under 25 lines
as a target, at most three levels of nesting, two or three similar lines stay, five or more are
extracted, four is a judgement call); `BP-INJECT-ADAPTERS` with its production default; the
entrypoint as composition root. The description stays as it is (D-14). The owner may overrule
any of them; a change is a catalogue edit, with no id renamed.

**D-18 The start conditions of stages 3 and 4 are waived.** The outline made stage 3 wait for
B's prose side and E stage 1, and stage 4 for `commercial-portfolio` and the rest of R2, so that
their text would be cut once. The owner's instruction to finish now overrides that order. Those
EPICs then write into lean skills and meet the standard on arrival, as a new skill does (S-9).
Where a rewrite moves a section their PLAN names, their own stage re-points the task; a link of
theirs the rewrite breaks is fixed in the rewrite's pull request (`broken_links`), as D-14 did.

**D-19 The per-skill loop at scale.** One builder per batch of skills, batches disjoint and run in
parallel. A builder writes, per skill, the assessment record (D-7 format; a skill pending for
`pointers` only may sort by section, not by paragraph), the rewrite to D-2, the pointers in the
sentence form, and the citers it breaks. The lead alone edits `skill-budget.yaml`, the CHANGELOG
and the PLAN. A fresh second reader per batch compares `develop` with the rewrite and the records
(D-15) and writes its verdict into each record; lost rules are restored before the pull request.
No description is touched. The check of each stage is the full gates and CI (D-15).

**D-20 The three large engineering skills.** `architecture`, `project-setup` and `test-strategy`
are assessed like any other. A file that is filled in by copying (a use-case template, a
scaffold template) is material and moves to `assets/` (D-1); prose explaining it is sorted, never
moved. If, after the cut, a skill still holds more than 24 KB of keep, it gets an `over_budget`
entry whose reason names what the kept prose is; its assessment record shows the sorting.

**D-21 The cut of the stages.** Stage 3: the pending skills of `meaningfy-building` and
`meaningfy-architecture`, plus `test-strategy` (the outline names it there): `architecture`,
`ci-cd-delivery`, `clarity-gate`, `conceptual-modelling`, `epic-delivery`, `epic-planning`,
`formal-reasoning`, `linkml-engineering`, `meaningfy-release`, `modelling-conventions`,
`project-setup`, `test-strategy`. Stage 4: the seven pending skills of `meaningfy-sales`. Stage 5:
every other pending skill. One pull request per stage.

**D-22 Stage 3 decided by the lead (2026-11-15).** Two exceptions, recorded in
`skill-budget.yaml`: `test-strategy` (87 KB: the matrix, cited by 41 skills and fixed by
`tests/test_test_strategy.py`, and the 144-row check inventory other EPICs edit) and
`epic-delivery` (33 KB: the delivery method itself, cited by about 25 checks). Second readers
found losses in three skills, all restored: the mark line at Prepare (`epic-delivery`); the
secondary notations and "an ADR is never deleted, only superseded" (`architecture`); the scaffold's
`domain/` name kept on purpose, the library archetype's layers and the Antora search setting
(`project-setup`). The lead also kept `conceptual-modelling`'s provisional banner (doubt goes to
keep) and chose sequential ADR numbers (`ADR-0001`, as `project-setup`'s docs template writes
them) over the old per-level scheme of the deleted `architecture-project-structure.md`. Under the
floor: `project-setup` sits one byte under budget, so the next addition there pays for itself;
`architecture`'s ADR template is MADR-shaped while `project-setup` names the Nygard format.

**D-23 Stage 4 decided by the lead (2026-11-16).** One exception: `sales-pipeline-custody` (36 KB:
the five pipelines, the lead lifecycle, the star rubrics, the next-action and closing-date rules
and the write tiers every sales skill cites); a later split of the write rules into their own skill
would bring it under budget and is the owner's to decide. The second reader found two losses in it,
both restored (the partner qualified in the *Partner* block; the `Deadline:` stand-in activity).
The other six fit the budget; the templates of `proposal-writing` and the PERT worksheet of
`estimation` moved to `assets/`. Under the floor: `sales-operations` and `sales-conversations`
sit within 12 bytes of the budget.

**D-24 Stage 5 decided by the lead (2026-11-16).** Twenty skills, every one off `pending`, so the
`pending` key is removed (task 5.2). Two exceptions: `infrastructure-operations` (32 KB: the change
procedure, the reviewer's grading, the lifecycle traps and the records the devops agents and the
`operations-practice` spec rely on) and `semantic-consulting-coach` (32 KB: the commercial
engagement model about 20 docs, 6 sales skills and 4 specs cite); its next cut comes when
`commercial-portfolio` moves the package facts out. Second readers found three losses, all
restored: the reason for `keep_disk = true` (`infrastructure-operations`), "silence is an
acceptable outcome" (`semantic-consulting-coach`), and a wrong firewall row
(`infrastructure-security`); they also fixed citers in `generic-task-test-profiles` and
`proposal-writing`. Total prose of `skills/` is 0.89 MiB, under DEC-9's 1 MB
([`evidence/size-after-stage-5.md`](evidence/size-after-stage-5.md)). Under the floor:
`rulebook` sits 3 bytes under budget, `service-reliability` 36; the five exceptions are the
owner's to revisit.

**D-25 Reconciliation with the EPIC (2026-11-16).** The EPIC's text gains an "As delivered"
section naming each departure and the decision behind it (DEC-13 waived by D-18, the checkpoint by
D-17, five exceptions, the re-measured baseline, 52 skills); its capability list names the three
modified specs. One gap was found and closed: practice 5 (D-8), which the lint does not check, had
been applied in only four skills. A sweep of all 52 bodies added the fallback sentence where a body
tells the agent to use an external skill or plugin: `epic-planning` (`superpowers`),
`meaningfy-code-review` (`code-review`), `meaningfy-git-workflow` (`commit-commands`),
`vault-conventions` (the obsidian plugin, covering the vault bundle). A mention in Boundary or
Related is not a use and gets none. `creating-skills.md` no longer describes `pending` as live.
Under the floor: `project-setup`'s hand-off step lists Claude-only install commands where
practice 5 asks for the register; it already has the fallback, and with one byte of room the
change is left to its next edit.

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Fix pointer wording in pending skills during stage 1 | Leave them for their rewrite | DEC-13: each skill is rewritten once |
| Grant an `over_budget` entry in stage 1 | Put the skill in `pending` | An exception needs the assessment that justifies it |
| Count templates or scripts as prose | Count body plus `references/` only | DEC-2 |
| Move prose into `assets/` to pass the budget | Sort it (D-7); cut or keep it | Rabbit-hole 1: moving text is not shrinking |
| Write a second copy of the standard in the method or a skill | Link to `creating-skills.md` § *The lean standard* | Single source of authority |
| Use "when" as decoration ("see X when needed") | Name the situation | The check is a proxy, the reader is the judge |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| A skill over 24 KB, not listed | `prose_budget` fails, names skill, total, body, references | Cut, or list in `pending` (stage 1 only), or record an `over_budget` reason after assessment |
| A listed `over_budget` skill now under budget | `prose_budget` fails: "remove its exception" | Remove the entry |
| An `over_budget` entry with an empty reason | `prose_budget` fails | Write the reason |
| A pending exemption no longer needed | `prose_budget` fails once: "passes pointers; remove it" | Remove that exemption, or the entry |
| A name in `skill-budget.yaml` that is no skill | `prose_budget` fails: "not a skill" | Fix or remove the name |
| A name pending for `budget` and in `over_budget` | `prose_budget` fails | Keep one |
| `skill-budget.yaml` is not valid YAML, or has another top-level key or exemption name | one error from `prose_budget`; both checks report nothing else | Fix the file |
| `skill-budget.yaml` absent (a bare root, or after stage 5) | no error | Both checks run on every skill |
| A wave-1 pull request merged after the list was computed makes an entry stale or a skill fail | `make validate` red on the stage-1 PR after rebase, or on develop | Task 1.4 recomputes after the last rebase; if develop still goes red, the later PR edits `skill-budget.yaml` |
| A pointer not in the sentence form | `reference_pointers` fails with file line and target | Write "Read X when Y: it adds Z." |
| A pointer in a table cell or a bare bold file name | the same | The same |
| A link into another skill's `references/` | not a pointer; no error | none (the matrix line stays as `tests/test_test_strategy.py` fixes it) |
| A link inside fenced code | skipped | none |
| A closing heading with "References", "See also", "Resources", "Further reading", "Supporting material(s)" (whole words) | `reference_pointers` fails with file line and heading | Put each pointer at its point of need |
| A new skill from another EPIC adds the matrix line (as `test-suite-care` does) | not a pointer; passes | none |
| A skill added after stage 1 is listed as pending | review (the lint cannot tell) | Remove the entry; the skill meets the standard |
| A pointer that names a missing file | the existing `broken_links` | unchanged |
| A non-UTF-8 file under `references/` | sized by bytes, never decoded | none needed |
| A new skill added by another EPIC fails a check | `make validate` red in that EPIC's PR | It meets the standard (S-9); it is never added to `pending` |
| A pending skill grows through another EPIC's prose | not detected by lint (OQ-2) | S-9 governs new prose; the stage that rewrites it cuts |

## Risks / Trade-offs

- **RISK-1** The sentence form passes a pointer whose situation or "adds" is empty of meaning.
  Likelihood medium, impact low. Mitigation: the standard's bad example; the second reader of each
  rewrite checks pointers. Accepted by the owner (OQ-4).
- **RISK-7** Coverage is thin until the rewrites: after stage 1 about 46 skills are pending, so the
  pointer check bites on a handful of skills and on every new skill. Accepted: that is what the
  stages are for; the budget still holds every skill pending for pointers only.
- **RISK-2** Prose moved to `assets/` or `templates/` escapes the budget. Likelihood low, impact
  medium (the EPIC's "It fails when"). Mitigation: the assessment record shows where every passage
  went; the second reader reads it. Not linted: a check would have to tell a template from prose.
- **RISK-3** A rewrite drops a rule whose Meaningfy origin is not visible in the text. Accepted by
  DEC-8; doubt sorts to keep (D-7); a loss is reported through `skillery-feedback` and restored
  from git.
- **RISK-4** `pending` becomes permanent. Mitigation: a skill passing both checks cannot stay
  listed; stages 3 to 5 each end with their skills off the list; stage 5 removes the key.
- **RISK-5** Wave timing: R2 stage 1 slips, so the pilot waits (DEC-13). Accepted: stage 1 is
  useful on its own, every new skill text from waves 2 to 4 meets it.
- **RISK-6** Another wave-1 EPIC edits `creating-skills.md` or `lint.py` at the same time. B's tool
  side adds `quality/` and Semgrep and does not touch the lint's skill checks; R3 edits
  `epic-delivery` and agents. The conflict can be semantic (a merged PR makes a `pending` entry
  stale), so task 1.4 recomputes the list after the last rebase (error matrix).
- **RISK-9** A skill cites `test-strategy`'s matrix with a path that also names one of its own
  reference files (`infrastructure-operations` owns a `references/documentation.md`, as does
  `test-strategy`). Its own check then judges the citation. Not the case today. If it happens, the
  citation is written as `test-strategy/references/<file>`, which resolves to no file of the
  citing skill. Accepted.
- **RISK-8** `test-strategy/references/inventory.md` lists the lint checks (CHK-125, CHK-130) and
  B edits it too. Mitigation: stage 1 changes two cells (task 1.9), a two-line change B rebases
  over.

## Attack record

One adversarial reader, 2026-11-15, simulated D-3 and D-5 on all 51 skills. Twelve findings, all
taken:

| # | Finding | Taken as |
|---|---|---|
| 1 | The `test-strategy` matrix line in 40 skills (and in E's new skill) would fail as a pointer | D-5: a pointer resolves into the skill's own `references/`; matrix rows |
| 2 | Exact heading names miss four real closing lists | D-5 (b) matches on contained words; Context count corrected to 5 |
| 3 | Bare bold file names escape the check | D-5: any mention of an own reference file is a pointer |
| 4 | Table rows lose the header's cue | Moot under the sentence form: a cell needs the sentence; matrix row |
| 5 | Pending is about 46, not 38; coverage is thin | D-4 count; RISK-7 |
| 6 | One list exempts from both checks | D-4: per-check exemptions |
| 7 | Concurrent merges make entries stale | D-4, task 1.4 recompute; matrix row; RISK-6 |
| 8 | The 1 MB measure was silently redefined | Context: the EPIC's measure kept for DEC-9 |
| 9 | Templates under `references/` count | D-1: they count until their rewrite moves them |
| 10 | Spec and design disagree in five places | Spec deltas and D-4, D-6 aligned; `prose_budget` owns file errors |
| 11 | The test-strategy check inventory goes stale | Task 1.9; RISK-8 |
| 12 | Line numbers, untracked files, fenced code | D-5 file lines and fences; D-1 working tree, CI is the reference |

A second reader then implemented D-5 literally and ran it on all 51 skills (280 pointers, none
in the form). Its twelve holes (line wraps, abbreviations, blockquotes, nested lists, file-name
code spans, folders, topic mentions, whole-word headings, line numbers, the Boundary section, a
latent matrix collision) are closed by D-5's parsing rules and RISK-9. Clarity gate run 1 scored
8.7; its twelve gaps are folded in (D-4 messages and edge cases, the spec wording, practice 5,
tasks 1.1, 1.3, 1.9, stage 5). Clarity gate run 2 scored **9.1** (pass); its nine small gaps
(message prefix, heading word, accepted variants, one test, two messages, a signature, the
section anchor, a link, the example label) are folded in after the run, with no third run.

## Decisions taken with the owner (2026-11-15, one round)

- **OQ-1** The transition list and the exceptions live in `skill-budget.yaml` at the root (D-4).
- **OQ-2** A pending skill's size is not frozen; S-9 governs prose added before its rewrite.
- **OQ-3** The pointer check uses the fixed sentence form (D-5), not a cue word.
- **OQ-4** The risks are accepted as written: rebase before merge; a new skill from another EPIC
  meets the standard on arrival and is never listed as pending; weak pointers are the second
  reader's to catch.
