> Derives from: EPIC `navigator-workflows` (`proposal.md`), DEC-1..DEC-8.

## Context

Navigator places a session in a phase on three signals (`mods/navigator/lib/phase.ts`):

- a skill or agent named in a phase's `enter` (`enteredBy`; it can move back);
- a change state (`phaseFor`; forward only);
- a passed **command** gate, or an answered consent, in the current or a later phase. This moves the
  session into the phase after that gate's phase, provided that phase has an empty `enter`
  (`advanceOn`). It only moves forward.

Gates and strict mode:

- A command or file gate that is not ok when its phase is **left** raises a process warning keyed to
  that phase (`onLeave`).
- A skill gate is checked on **entry** (`onEnter`).
- Strict mode refuses a commit only on a gate warning keyed to the **current** phase
  (`decideCommit`).

So a gate placed on a phase reads as "this phase is done when …". A passed gate moves the session on,
and blocks nothing while the session is still in that phase.

**Next step** (`nextStep`, `lib/actions.ts`) runs the current phase's first unmet expected skill,
else the owner of the next phase in the variant. Running a skill that a phase's `enter` names
places the session in that phase, so the first phase of a workflow must not be entered by the
skill that owns the later phases (D-3).

Navigator follows one change (`readChange`): the open change the git branch names, else the most
recently changed one. A change folder counts as open once it has `proposal.md` (`io.ts`).

Navigator treats switching workflow or variant as a *placement*: it runs no leave or enter checks
(`navigate`). Work shaping and delivery are **separate sessions** (`epic-planning`: the shaping
session ends with the PLAN gated; `epic-delivery`: the epic session starts fresh), so the shaping
variant never hands over to delivery inside one session. A delivery session on an ungated PLAN is
placed in `design` (change state `plan`); loading `epic-delivery` then *enters* `apply`, which runs
the clarity check (`phase.test.ts`, PD-3).

Default artifact locations (a repo overrides any of them with `extends`, DEC-7):

| Artifact | Glob | Convention from |
|---|---|---|
| Change input (seed, spike, Q&A) | `openspec/changes/*/inputs/**` | `epic-planning` steps 1–3 |
| Q&A record | `openspec/changes/*/inputs/qa.md` | `epic-planning` step 3 |
| Use case | `**/*use-case*` | `architecture`, `references/use-cases-cockburn.md` |
| C4 view | `**/*[Cc]4*` | `architecture`, `references/architecture-index-page.md` |
| ADR | `**/[Aa][Dd][Rr]-[0-9]*` | today's `adr` gate |
| Domain model | `model/**` | `project-setup`, `conceptual-modelling` |
| Example instances | `**/examples/**` | `conceptual-modelling`, *Model validation* 1 |
| Model review record | `openspec/changes/*/evidence/**` | `conceptual-modelling`, *Model validation* |
| Changelog | `CHANGELOG.md` | `meaningfy-release` §3 |

## Goals / Non-Goals

**Goals:**
- the four workflows of the EPIC, as data in their owning skills, every phase reachable;
- the one engine rule of DEC-6, with tests;
- each worked example below passing as a navigator test.

**Non-Goals:**
- everything in the EPIC's No-gos;
- any new `enter` key or gate kind;
- changing strict-mode rules or `nextStep`.

## Decisions

- **D-1. DEC-6 is implemented as `advanceOn` matching file gates.** `Advance` gains `file?: string`.
  A file gate whose glob matches the written path counts as passed, the same way a command gate's
  regex matching the command does. `FileTouched` calls `navigate` with `{ file: path }` after the
  gates update. A file gate sits on the phase *before* the one its artifact starts. For example,
  the use-case glob is the `drivers` phase's gate, so writing the first use case ends drivers and
  enters use-cases. Consequences:
  - Strict never blocks on it (Context).
  - It is forward only (`advanceOn` starts at the current phase).
  - It never selects a workflow or ends a variant (`select` reads only skills and agents).
- **D-2. The shaping session runs the `work-shaping` variant, and ends at `revise`.** The variant
  activates on `epic-planning`, `openspec-explore`, `openspec-propose`, `clarity-gate` and
  `openspec-update-change`, with no change condition. The same five go into build-tier's own
  `activate.skills`, so any of them starts build-tier in a fresh session. `revise` is the variant's
  last phase, so **Next step** offers nothing after it: delivery is the next session (Context).
  - **In a delivery session**, Reconcile EPIC (`openspec-update-change`, then `clarity-gate`)
    selects the variant. `phaseFor` maps the delivery change state to the nearest earlier variant
    phase, `revise`, and reconciling is revising. Loading `epic-delivery` or
    `openspec-apply-change` returns to the full workflow (the existing rule in `select`), where
    phases are placed, not entered.
  - **Loading `epic-delivery` inside a shaping session** is off-method (separate sessions). The band
    switches to the full workflow, placed without checks; strict cannot block it. Error matrix.
  - Rejected: a list-valued `activate.change`, and running checks on a variant change (both engine
    changes beyond DEC-6; No-go).
- **D-3. A first phase has an empty `enter`.** Applies to `drivers`, `elicit` and `branch`, and to
  `explore` except for `openspec-explore`. The first placement in a workflow already lands on its
  first phase (`phaseFor`, no signal). Reloading the owning skill, which **Next step** does, then
  keeps the current phase instead of moving back to the start. `brainstorming` leaves explore's
  `enter` for the same reason: it may run in any shaping phase.
- **D-4. No `hotfix` variant (amends DEC-5).** It would have the same six phases and no signal that
  could select it. The `cut` gate matches both `release/` and `hotfix/` branches. The lead decided
  this under "choose what is best"; the owner may overrule it (`inputs/qa.md` round 3).
- **D-5. `published` matches `gh release (create|view)`, `git tag … v<n>` and `git push --tags`.**
  `view` counts because a repo that publishes from CI (skillery's `releases.yml`) has no local publish
  command; seeing the release is the step. The `back` gate on `back-merge` marks the release done.
- **D-6. Architecting's `decide` keeps its `adr` meaning**, now as `c4`'s exit gate. Entering
  `decide` therefore means an ADR exists. `decide` drops today's expectation of `architecture` by
  exit. An expectation counts only skills loaded since the phase was entered (`missingExpect`), and
  `architecture` was loaded in `drivers`, so every run would warn.

## Algorithm / approach

**Engine (`mods/navigator`), D-1:**
1. `lib/phase.ts`: `Advance = { command?: string; consent?: true; file?: string }`. In `advanceOn`,
   a gate also counts as passed when `g !== undefined && g.kind === 'file' && ev.file !== undefined &&
   globRegex(g.glob).test(ev.file)`. This clause is OR-ed with the existing expression, outside its
   `ev.command !== undefined &&` guard (inside it, it would never fire).
2. `lib/state.ts`, case `FileTouched`: return
   `navigate(passGates(state, gatesAfterFile(...)), s.at, null, { file: s.path })` instead of the
   gated state alone.

**Workflow files.**
- *(empty)* in an Enter cell means `enter: {}`; the phase is reached by the previous phase's gate.
- Gates are listed as exit gates.
- *Allow* lists skills that may run without a warning.

Build-tier (`epic-delivery`): phases explore → variants → decide → propose → design → revise →
apply → verify → archive.

| Phase | Owner | Enter | Gates | Expect | Allow |
|---|---|---|---|---|---|
| explore | epic-planning | skills openspec-explore; change none | inputs | — | brainstorming |
| variants | epic-planning | (empty) | qa | — | brainstorming |
| decide | epic-planning | (empty) | — | — | brainstorming |
| propose | epic-planning | skills openspec-propose; change proposal | — | — | — |
| design | epic-planning | change plan | — | — | bdd-gherkin |
| revise | epic-planning | skills clarity-gate, openspec-update-change | clarity | — | — |
| apply, verify, archive | as today | as today | as today | as today | as today |

`propose` and `design` drop today's expectation of `epic-planning` by exit: it is loaded at the
start of the session, before they are entered, and expectations count only skills loaded since
entry (`missingExpect`), so every run would warn (as D-6).

Gates:
- `inputs`: file `openspec/changes/*/inputs/**`;
- `qa`: file `openspec/changes/*/inputs/qa.md`;
- `clarity`: as today.

Variants:
- `work-shaping`: explore, variants, decide, propose, design, revise (D-2);
- `brownfield`: propose, apply, archive; activates on `tasks-no-design`, as today.

`exploratory` is removed.

Architecting (`architecture`), title **Architecture** (today "Architecting and modelling"),
activates on `architecture` and `system-architect` only:

| Phase | Owner | Enter | Gates | Expect | Allow |
|---|---|---|---|---|---|
| drivers | architecture | (empty, D-3) | usecases | — | brainstorming |
| use-cases | architecture | (empty) | c4 | — | bdd-gherkin |
| c4 | architecture | (empty) | adr | — | — |
| decide | architecture | (empty) | model | — | — |
| domain | conceptual-modelling | (empty) | — | conceptual-modelling by exit | modelling-conventions |

Gates (all file gates):
- `usecases`: `**/*use-case*`;
- `c4`: `**/*[Cc]4*`;
- `adr`: `**/[Aa][Dd][Rr]-[0-9]*`;
- `model`: `model/**`.

Modelling (`conceptual-modelling`, new), title **Conceptual modelling**, activates on `conceptual-modelling`, `linkml-engineering` and
`conceptual-modeller`:

| Phase | Owner | Enter | Gates | Expect | Allow |
|---|---|---|---|---|---|
| elicit | conceptual-modelling | (empty, D-3) | schema | — | modelling-conventions |
| model | conceptual-modelling | (empty) | generate | — | linkml-engineering, modelling-conventions |
| generate | linkml-engineering | (empty) | examples | — | — |
| validate | conceptual-modelling | (empty) | review | conceptual-modelling by exit | formal-reasoning |

Gates:
- `schema`: file `model/**`;
- `generate`: command `\bmake generate-models\b`, run `make generate-models`;
- `examples`: file `**/examples/**`;
- `review`: file `openspec/changes/*/evidence/**`.

Release (`meaningfy-release`, new), title **Release**, activates on `meaningfy-release` only (DEC-5). Every phase is
owned by `meaningfy-release`:

| Phase | Enter | Gates | Expect | Allow |
|---|---|---|---|---|
| branch | (empty, D-3) | cut | — | meaningfy-git-workflow |
| bump | (empty) | bumped | — | — |
| validate | (empty) | validated | — | — |
| merge | (empty) | merged | — | meaningfy-git-workflow |
| publish | (empty) | published | — | ci-cd-delivery |
| back-merge | (empty) | back | — | meaningfy-git-workflow |

Gates:
- `cut`: command `git (switch -c|checkout -b) (release|hotfix)/`;
- `bumped`: file `CHANGELOG.md`;
- `validated`: command `\bmake validate\b`, run `make validate` (its own id: gate states are keyed
  by id for the whole session, so sharing build-tier's `validate` would share its state);
- `merged`: command `gh pr merge`;
- `published`: command `gh release (create|view)|git tag( -[as])? v\d|git push\b.*--tags` (D-5;
  anchored so `git tag -l v3*` and `git tag -d v1.0` do not pass it);
- `back`: command `gh pr create\b.*--base[ =]develop|git merge\b.*\bmain\b`.

### Worked examples (each becomes a navigator test)

**Shaping.** Precondition: no open change, and the git branch names none. Run in its own session.
1. `/epic-planning` with no open change → work-shaping, `explore`.
2. `openspec/changes/x/inputs/seed.md` written → `variants`.
3. `inputs/qa.md` written → `decide`.
4. `proposal.md` written → `propose` (change state).
5. `design.md` and `tasks.md` written → `design`.
6. `/clarity-gate x` → `revise`, `clarity ✓ 9.2`. **Next step** offers nothing; the session ends.
7. The test asserts no process warnings on this run.

**Delivery, next session.** Gate states start empty in every session (`Started`), so a delivery
session always meets apply's clarity precondition, as today:
1. A fresh session with `x` open and no task ticked → full workflow, `design` (placed).
2. `/epic-delivery` → `apply`, with `process:gate:apply:clarity` (PD-3).
3. **Back on track** runs `/clarity-gate x` → the work-shaping variant, `revise` (D-2); the gate
   passes and the warning clears.
4. `/epic-delivery` → full workflow, `apply` (placed); the clarity warning is gone. In strict mode,
   PD-1 still refuses a commit in `apply` until `test-driven-development` runs, as today.

The detour through `revise` (step 3) is a known cost of D-2, accepted: re-running the gate at the
start of delivery is what the method asks, and the band shows it as revising. 2.1b asserts each step.

**Reconcile mid-delivery.**
1. In `apply` with tasks 3/10, `/openspec-update-change x` → work-shaping, `revise` (D-2).
2. `/epic-delivery` → full workflow, `apply` (placed).
3. The same with all tasks done → `revise`, then `/epic-delivery` → `verify` (placed; `phaseFor`
   moves past apply on `tasks-done`).

**Architecture to modelling.**
1. `/architecture` → architecting, `drivers`.
2. `docs/use-cases/use-case-catalogue.adoc` written → `use-cases`.
3. `docs/architecture/c4-context.adoc` written → `c4`.
4. `docs/adr/ADR-0001-store.md` written → `decide`.
5. `model/core.yaml` written → `domain`.
6. **Next step** → `conceptual-modelling` → modelling, `elicit`. (Next step in `decide` already names
   `conceptual-modelling`, the next phase's owner: handing over before the first `model/` file is
   allowed, since the initial domain model is modelling's first step too.)
7. `model/core.yaml` edited → `model`.
8. `make generate-models` → `generate`.
9. `tests/examples/order.yaml` written → `validate`.
10. `openspec/changes/x/evidence/model-review.md` written → review ✓.

**Release.**
1. `/meaningfy-release` → `branch`.
2. `git switch -c release/3.11.0` → `bump`.
3. `CHANGELOG.md` edited → `validate`.
4. `make validate` → `merge`.
5. `gh pr merge 160` → `publish`.
6. `gh release view v3.11.0` → `back-merge`.
7. `gh pr create --base develop` → back ✓.

Separately, in a build session without the skill, `git tag v1.0.0` and
`git push -u origin release/1.0.0` activate nothing.

**Idempotency.** Replaying a signal is safe:
- an advance only moves forward from the current phase;
- a repeated write passes a gate that is already ok;
- reloading a skill keeps the phase (D-3).

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Put a phase's artifact in that phase's own gates | Put it in the gates of the phase before | A passed gate moves *out* of its phase (D-1) |
| Name the workflow's owning skill in its first phase's `enter` | Leave the first phase's `enter` empty | **Next step** reloads owners and would move back (D-3) |
| Rely on a skill to move back while a later change state holds | Expect `phaseFor` to move forward again | Change states win forward |
| Add a variant with the same phases as its workflow | Fold it into the workflow (D-4) | Nothing could select it |
| Write method text into a workflow file | Name the skill | DEC-7 |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| A repo has no file matching a default glob | the gate never passes | the phase is left by a skill or a later gate; a gate warning names the glob; the guide says how to override it |
| A later gate passes first, e.g. `make validate` in `branch`, or an ADR in `drivers` | `advanceOn` reaches the later gate | it moves past the skipped phases; the left phase and each skipped phase raise their open gate warnings (`onLeave`), e.g. `branch:cut` and `bump:bumped`; tested |
| `gh release view` before publishing | — | it passes `published`; accepted (D-5) |
| Another change is open, or the branch names one | `readChange` follows it; the new change is not open until its `proposal.md` exists | the band shows work-shaping `revise` (that change's state mapped back), and inputs do not move it, until the new `proposal.md` exists and is the most recent or the branch names it. Expected in a repo with open changes (Risks); tested |
| `tasks.md` written before `design.md` | change state `tasks-no-design` | in a shaping session the variant stays: `phaseFor` maps it to `revise`, raising `process:gate:revise:clarity`; writing `design.md` moves back to `design` (change state `plan`), and the warning stays until `clarity-gate` runs (strict does not block: it is keyed to `revise`); tested |
| `architecture` loaded during shaping | architecting is selected | the session switches workflow; loading `epic-planning` again places it at `explore` (no open change) or at the change's phase |
| `epic-delivery` loaded inside a shaping session | the variant ends | off-method (D-2): placed in the full workflow without checks; strict cannot block it |
| `architecture` reloaded, or `system-architect` spawned again mid-session | no phase names them (D-3) | the phase stays; tested |
| A switch to architecture after modelling | a new workflow selected | placed at `drivers` (first placement); gates already ok advance on the next matching write |
| A repo file extends build-tier and names `shape`, `plan` or `exploratory` | its own `phases`/`variants` replace the defaults wholesale | it keeps working; the CHANGELOG marks the rename BREAKING |
| A bad glob or regex in a new file | `make validate` (TC-16 and the parser) | the build fails, naming the file |

## Risks / Trade-offs

- [In a repo with other open changes, a shaping session does not see explore, variants or decide]
  → this is the usual case in skillery (four changes open today). Navigator follows an open change,
  and the new one is not open until its `proposal.md` exists, so the band shows `revise` for the
  other change until then. Accepted: write `proposal.md` early (`openspec-propose` creates it) and
  name the branch after the change (`docs/shape-<id>`); from then on the band follows the new change
  from `propose`. Before `proposal.md` exists the branch name does not help, and branch matching is
  by substring, so `docs/shape-navigator-workflows` names the open `navigator` change until then. The first three phases show in full only where no other change is open.

- [`**/*[Cc]4*` matches unrelated files] → active only inside architecting and forward only; a repo
  narrows it.
- [A `clarity-gate` run mid-delivery shows `revise` until **Next step** or `epic-delivery`] →
  intended (D-2); the band names the way back.
- [Shaping without recording inputs warns] → leaving `explore` with no file under `inputs/` raises
  the `inputs` gate warning, and leaving `variants` with no `qa.md` raises the `qa` warning (for
  example, `/openspec-propose` straight away). Intended: `epic-planning` steps 1–3 record the seeds
  and the Q&A; the warnings can be accepted like any other.
- [A clarity-gate re-run in a delivery session shows `revise`] → until `epic-delivery` or
  `openspec-apply-change` loads again (D-2); intended, reconciling is revising.

## Delivery

Per `epic-delivery`, appetite SMALL: one review pass. Models follow `guardrails`: the declared
model first, otherwise the shape of the task.

| Task | Who | Model | Why |
|---|---|---|---|
| 1.1 | `implementer` | sonnet (declared) | small engine change, fully specified, with named tests |
| 2.1a, 2.2–2.4 | `implementer` | sonnet (declared) | data from the tables; the worked examples are the tests |
| 2.1b | `implementer` | sonnet (declared) | the selection tests; re-run one model up (a `general-purpose` builder on opus) if the report fails the lead's check |
| 2.5, 3.2 | lead, inline | — | mechanical, a few commands |
| 3.1 | `implementer` | sonnet (declared) | docs to a clear brief |
| 3.3 review | `code-reviewer` | opus (declared) | one pass: L2 spec and tests, L3 structure |

## Open Questions

None. D-4 is the lead's decision; the owner may overrule it (`inputs/qa.md` round 3).
