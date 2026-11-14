# EPIC: Lean skills — the minimum necessary, the rest by dependency

## Appetite

VERY LARGE. It changes the skill standard and migrates all 51 skills, delivered in stages.

## Why

The skills are large and growing: 1.77 MB, of which 1.45 MB is prose and example code an agent may
read. Much of it restates general software knowledge, repeats itself, or copies code from another
project, while the part that is Meaningfy's own (the discipline, the house conventions, the rules
distilled from reviews and from the owner) is small. The owner wants each skill reduced to the
minimum necessary, generic knowledge taken from chosen dependencies maintained elsewhere, and no
repetition inside skillery. Evidence and measurements are in
[`inputs/findings-size-2026-11-14.md`](inputs/findings-size-2026-11-14.md) and
[`inputs/findings-2026-11-14.md`](inputs/findings-2026-11-14.md).

## Solution outline

1. **One lean shape for every skill, in sizes.** A small body that is read whenever the skill
   fires: the bias it corrects, its decision rules, its trigger rules ("when X appears, do Y"), a
   final checklist, its boundary. Reference prose that is opened only when needed. Templates and
   scripts, which cost no context. The shape borrows from the book rule sets' `mini` files.
2. **A budget, enforced.** Every skill's prose stays within the budget of DEC-2, and
   `make validate` fails when it does not.
3. **An assessment of every skill, by reasoning.** Each passage is sorted: Meaningfy-specific rule
   or distilled preference (keep); generic knowledge a capable model has, or that a dependency
   states (cut, name the dependency); a fact another skill owns (cite it); an example (DEC-7);
   material that is really a template or a script (move it there). The sorting is recorded per
   skill.
4. **Book rule sets as a dependency.** Eight sets from Meaningfy's fork of `agent-rules-books`
   carry the generic engineering knowledge and fill six areas skillery has no owner for. They are
   registered and routed to by `orchestrate-external-skills` (DEC-10); a skill here names the
   dependency its cut text now lives in.
5. **Stages.** The standard and its lint check first; then `cosmic-python` as the pilot, followed by
   a checkpoint with the owner; then the remaining engineering skills, sales, devops, and the rest.

**It succeeds when** every skill is within budget and the lint enforces it; a second reader who did
not make the cuts finds no Meaningfy-specific rule or distilled preference lost in any skill; the
existing trigger probes, agent scenarios and `make validate` stay green; and the prose and example
code of `skills/` total no more than 1 MB (from 1.45 MB).

**It fails when** a skill meets the budget by moving text into another file that is read just as
often; when a rule that came from a real review or from the owner disappears; or when a skill
names a dependency for knowledge the dependency does not hold.

## Key decisions

- **DEC-1**: Judge what to keep by reasoning, not by evals. The owner asked for intuition and a
  chain of thought; an eval harness does not exist yet. Rejected: measure first, then cut.
- **DEC-2**: Budget per skill: 24 KB of prose (body plus references), with a body target of 6 KB.
  Templates, assets and scripts are outside the budget. Less is the default; a skill that needs
  more records a justified exception. The 24 KB is the owner's; the 6 KB body target is the agent's
  proposal, taken from the size of the book `mini` files. Rejected: a body-only budget, which lets
  references grow without limit.
- **DEC-3**: The whole catalogue is in scope, in stages, with `cosmic-python` first and an owner
  checkpoint after it. Rejected: the standard and the pilot only, with the rest as later EPICs.
- **DEC-4**: Skillery depends on `meaningfy-ws/agent-rules-books`, the owner's fork of
  `ciembor/agent-rules-books`, referenced and installed separately, never copied in. A fork
  survives upstream changes or deletion. Rejected: pinning an upstream commit; tracking upstream.
- **DEC-5**: Eight rule sets are relied on: Clean Architecture, Refactoring, Domain-Driven Design
  (Evans), Working Effectively with Legacy Code, Release It!, Designing Data-Intensive
  Applications, A Philosophy of Software Design, and Patterns of Enterprise Application
  Architecture (loaded on demand only, never beside Domain-Driven Design as equal guidance, because
  the source repository marks that pair as conflicting). The other six (Clean Code, Code Complete,
  The Pragmatic Programmer, DDD Distilled, Implementing DDD, Refactoring.Guru) are not used: the
  source's own matrix marks them as overlapping the chosen ones. Rejected: all fourteen.
- **DEC-6**: Stream Coding stays a mandatory external dependency, unchanged. Skills name it and do
  not restate it. Rejected (by the owner): retiring it; making it optional.
- **DEC-7**: Example code copied from another project leaves the skills. A page in `docs/` for
  people links to the real files in that project (for `cosmic-python`: the public
  `meaningfy-ws/mapping-suite-sdk`). A short example stays in a skill only where it shows a house
  convention a model cannot guess. Rejected: keeping the copies as references; moving the copies to
  `docs/`; deleting with no pointer.
- **DEC-8**: A cut that turns out to have mattered is accepted as a risk: it is reported through
  `skillery-feedback` and restored from git history. Rejected: one release per stage; a soak period
  between stages.
- **DEC-9**: Proof of done is the four checks under "It succeeds when". The 1 MB total is the
  owner's figure (the agent had proposed 0.7 MB). Rejected: budget and tests alone,
  without the second reader.

- **DEC-10** *(owner, 2026-11-15)*: This EPIC only cuts. Registering the book rule sets, their
  install steps and the routing to them are delivered by `orchestrate-external-skills` (its
  DEC-17), in its first stage and before the pilot here. Which sets are relied on stays DEC-5.
  Rejected: routing in three agents, as first shaped; two EPICs each registering a source.
- **DEC-11** *(owner, 2026-11-15)*: The lean standard takes five practices from the study of a
  second source of skills: every pointer to a reference says when to open it and what it adds, and
  no list of references closes a body (checked by lint); two table forms, common mistakes and
  quick diagnostic, for decision rules and the final checklist; the content filters of the sorting
  step (non-obvious points only, no "why it works" that restates the rule, nothing the model
  already does); rules shared by several workflows stated once and cited; a fallback sentence for
  a named external dependency that is missing. The study is in
  `orchestrate-external-skills/inputs/`.
- **DEC-12** *(owner, 2026-11-15)*: The ten clean-code and SOLID bullets of `cosmic-python` stay,
  as short catalogue entries each tied to the check that enforces it
  (`harden-checks-and-tests` D-3). A rule with a check behind it is a house rule. Rejected:
  cutting them as restated general knowledge, as first shaped.
- **DEC-13** *(owner, 2026-11-15)*: Order. Stage 1 (the standard, its lint, the practices of
  DEC-11) runs first, beside `delivery-process-and-tools`. The pilot follows the first stage of
  `orchestrate-external-skills`. Each later stage runs once the EPICs that add text to its domain
  have landed, so that a skill is rewritten once. The order of all open EPICs is in
  `delivery-process-and-tools/inputs/reassessment-2026-11-15.md`.

## Rabbit-holes

- **Moving text is not shrinking.** A body cut to 6 KB by pushing its prose into a reference the
  skill tells the agent to always read has gained nothing.
- **Trigger collisions.** The book skills have generic names (`refactoring`, `clean-architecture`)
  and may fire beside `cosmic-python` and `meaningfy-code-review`. How routing avoids that is left
  to the PLAN.
- **`project-setup`.** 132 KB of its 296 KB are templates and a scaffold script that already cost
  no context. Its problem is 133 KB of reference prose, not its total.
- **Skills over budget for a good reason.** `architecture` and `test-strategy` may hold reference
  matter that is truly ours. The exception route of DEC-2 exists for this; it must not become the
  default.
- **Installing the book skills on opencode** through `npx skills add` is not verified.
- **The catalogue of id'd principles in `cosmic-python`** is cited by other skills and agents by
  id. Ids must survive the rewrite.
- Left vague on purpose: the exact section names of the lean shape, the format of the per-skill
  assessment record, and the order of skills inside each stage.

## No-gos

- No evals, benchmarks or before-and-after runs (DEC-1).
- No copying of book rule text into skillery.
- No change to Stream Coding's status or to how agents load it (DEC-6).
- No new agents, and no routing to the book sets written here (DEC-10).
- No change to what any skill owns, and no skill merged, split, renamed or retired here. A
  boundary move found during the assessment becomes its own EPIC.
- No description changes unless a trigger probe ships with them.
- No rewriting of the book rule sets in the fork (tone, the "OBEY" headings, content).
- Mods, tools, tests and `openspec/` are not shrunk.

---

## What Changes

- The skill standard gains the lean shape, the sizes and the budget; `make validate` enforces the
  budget, with recorded exceptions.
- Every skill is assessed and rewritten to the lean shape, in five stages: the standard and lint;
  `cosmic-python`; the other engineering skills; sales; devops and the rest.
- `cosmic-python` loses its copied example files and its restatements of the TDD ritual, ADR
  advice and Stream Coding; its Clean Code and SOLID bullets shrink to short catalogue entries
  tied to their checks (DEC-12); it keeps the layer contract, the component layout, the catalogue
  and the house conventions.
- A page in `docs/` links to worked examples in `mapping-suite-sdk`.
- The standard states the five practices of DEC-11, and the lint checks the reference pointers.
- Moved to `orchestrate-external-skills` on 2026-11-15 (DEC-10): the entry of
  `meaningfy-ws/agent-rules-books` in `dependencies.yaml`, its install step, and the routing of
  agents to a book set by kind of task.

## Capabilities

### New Capabilities

- `lean-skill-standard`: the shape, sizes and budget of a skill, the assessment that sorts its
  content, and the check that enforces the budget.

### Modified Capabilities

- `skill-crafting-method`: the method refers to the lean standard. To confirm when the PLAN is
  derived, together with `code-principles-governance` (the `cosmic-python` catalogue).

## Impact

- All 51 skills under `skills/`, and the generated `bundles/` tree and inventory that follow them.
- `tools/repo_lint` (the budget check and the pointer check) and `docs/development/` (the
  standard).
- The install step for the book skills reaches installers through
  `orchestrate-external-skills`, not through this EPIC.
- A new repository to keep: `meaningfy-ws/agent-rules-books`. Its upstream marks its own legal
  question (text distilled through ChatGPT from books) as unresolved; the fork brings that into a
  Meaningfy organisation.
