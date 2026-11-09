> Derives from: EPIC `navigator-workflows` (`proposal.md`), DEC-1..DEC-8; re-shaped by `inputs/qa.md`
> round 5 (Q-7..Q-11).

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
- Strict mode refuses a commit on a gate warning keyed to the **current** phase, or on a missing
  expected skill of that phase (PD-1) (`decideCommit`, `strict.ts`). A gate of a phase already left
  never blocks.

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
session ends with the PLAN gated; `epic-delivery`: the epic session starts fresh), so each has its
own workflow (DEC-2). A delivery session on a change with a PLAN and no task ticked (change state
`plan`) is placed in `ready`; loading `epic-delivery` then *enters* `apply`, which runs the clarity
check (`phase.test.ts`, PD-3).

The engine finds the appetites in the workflow with `activate.openChange` (`io.ts`), and `reviews`,
`replaces` and `planDrift` in whichever workflow has them (`lean.ts`, `process-drift.ts`, `io.ts`).
Nothing reads a workflow by the name `build-tier`, so renaming it is data only.

Two side effects of the split, accepted:
- **Status line.** `epic-shaping` has no `openChange`, so the status line (`lineText`, `view.ts`)
  shows `epic-shaping · <phase>` without the change id, appetite or progress, also during a
  Reconcile in a delivery session. Pinned by a test (4.1).
- **Reviewer counting.** Spawn roles come from the active workflow first (`lean.ts`), and
  `epic-shaping` has no `roles`, so in a shaping session a `code-reviewer` spawn counts as *other*
  and the over-spawn check (PD-8) does not fire. Shaping spawns no review set.

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
- the five workflows of the EPIC, as data in their owning skills, every phase reachable;
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
- **D-2. Shaping and delivery are two workflows (DEC-2, re-shaped).** `epic-shaping` activates on
  `epic-planning`, `openspec-explore`, `openspec-propose`, `clarity-gate` and
  `openspec-update-change`, with no `openChange`. `epic-delivery` keeps `openChange` and activates on
  `epic-delivery`, `openspec-apply-change` and `spec-stewardship`. `revise` is shaping's last phase, so **Next step** offers
  nothing after it: delivery is the next session.
  - **In a delivery session**, Reconcile EPIC (`openspec-update-change`, then `clarity-gate`)
    switches to `epic-shaping`; the skill enters `revise`. Loading `epic-delivery` or
    `openspec-apply-change` switches back, placed, not entered (Q-9). **Next step** offers nothing
    in `revise` and **Back on track** has no warning to act on, so the person runs `/epic-delivery`
    themselves; the method's Reconcile step ends that way (accepted).
  - **Loading `epic-delivery` inside a shaping session** is off-method (separate sessions): the band
    switches workflow, placed without checks; strict cannot block it. Error matrix.
  - Both files declare the `clarity` skill gate under the same id, so its state is shared across the
    switch (gate states are keyed by id for the session).
  - Rejected: one file with a `work-shaping` variant (the first PLAN; Q-7).
- **D-3. A first phase has an empty `enter`.** Applies to `drivers`, `elicit` and `branch`, and to
  `explore` except for `openspec-explore`. The first placement in a workflow already lands on its
  first phase (`phaseFor`, no signal). Reloading the owning skill, which **Next step** does, then
  keeps the current phase instead of moving back to the start. `brainstorming` leaves explore's
  `enter` for the same reason: it may run in any shaping phase.
- **D-4. No `hotfix` variant (amends DEC-5).** It would have the same six phases and no signal that
  could select it. The `cut` gate matches both `release/` and `hotfix/` branches. The lead decided
  this under "choose what is best"; the owner may overrule it (`inputs/qa.md` round 3).
- **D-5. `published` matches `gh release create`, an annotated or plain `git tag … v<n>`, and a push
  of a tag (`git push … v<n>`, `--tags`, `--follow-tags`).** `gh release view` does not count (Q-11):
  `advanceOn` reads later gates too, so viewing an older release in `branch` would jump four phases.
  A repo that publishes from CI (skillery's `releases.yml`) leaves `publish` by the back-merge and
  shows one `publish:published` warning, which it can accept. The `back` gate on `back-merge` marks
  the release done.
- **D-6. Architecting's `decide` keeps its `adr` meaning**, now as `c4`'s exit gate. Entering
  `decide` therefore means an ADR exists. `decide` drops today's expectation of `architecture` by
  exit. An expectation counts only skills loaded since the phase was entered (`missingExpect`), and
  `architecture` was loaded in `drivers`, so every run would warn.

- **D-7. Delivery starts in `ready` (Q-8).** Owner `epic-delivery`, enter change `plan`, no gates,
  no expectations. A placement lands there for an unstarted PLAN; **Next step** runs `epic-delivery`,
  which enters `apply` with its clarity check. A change with only a proposal also lands there (the
  first phase, `phaseFor`'s fallback); loading `epic-planning` switches to shaping.
- **D-8. Ids match the owning skills (Q-10).** `epic-shaping` in
  `skills/epic-planning/assets/workflows/epic-shaping.workflow.json`; `epic-delivery` in
  `skills/epic-delivery/assets/workflows/epic-delivery.workflow.json`, replacing
  `build-tier.workflow.json` (`git mv`). `reviews`, `roles`, `replaces` and `planDrift` stay in the
  delivery file.

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

EPIC shaping (`epic-planning`, new), title **EPIC shaping**, activates on the five skills of D-2:

| Phase | Owner | Enter | Gates | Expect | Allow |
|---|---|---|---|---|---|
| explore | epic-planning | skills openspec-explore; change none | inputs | — | brainstorming |
| variants | epic-planning | (empty) | qa | — | brainstorming |
| decide | epic-planning | (empty) | — | — | brainstorming |
| propose | epic-planning | skills openspec-propose; change proposal | — | — | — |
| design | epic-planning | change plan, tasks-no-design | — | — | bdd-gherkin |
| revise | epic-planning | skills clarity-gate, openspec-update-change | clarity | — | — |

No variants. `propose` and `design` carry no expectation of `epic-planning` by exit: it is loaded at
the start of the session, before they are entered, and expectations count only skills loaded since
entry (`missingExpect`), so every run would warn (as D-6).

Gates:
- `inputs`: file `openspec/changes/*/inputs/**`;
- `qa`: file `openspec/changes/*/inputs/qa.md`;
- `clarity`: skill `clarity-gate` (same id as delivery's, D-2).

EPIC delivery (`epic-delivery`, renamed from build-tier), title **EPIC delivery**, activates on
`openChange`, `epic-delivery`, `openspec-apply-change` and `spec-stewardship`:

| Phase | Owner | Enter | Gates | Expect | Allow |
|---|---|---|---|---|---|
| ready | epic-delivery | change plan (D-7) | — | — | — |
| apply, verify, archive | as in build-tier | as in build-tier | as in build-tier | as in build-tier | as in build-tier |

Variants: `brownfield`: apply, archive; activates on `tasks-no-design`. `exploratory` and
`work-shaping` are gone. `reviews`, `roles`, `replaces` and `planDrift` are unchanged.

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
  by id for the whole session, so sharing epic-delivery's `validate` would share its state);
- `merged`: command `gh pr merge`;
- `published`: command `gh release create\b|git tag\b(?![^&;|]*\s(-[dlnv]\w*|--(delete|list|contains|verify|points-at)\b))[^&;|]*\sv\d|git push\b(?![^&;|]*\s(-d|--delete|-n|--dry-run)\b)[^&;|]*\s(v\d|--(follow-)?tags\b)`
  (D-5; read-only and delete forms are excluded, review G6). Known limit, accepted: the exclusion
  reads the whole command, so a tag message containing such a flag (`-m "drop -d flag"`) does not
  pass; the person accepts the warning. Passes: `gh release create v3.11.0`,
  `git tag v1.0.0`, `git tag -a v1.0.0 -m "x"`, `git tag -am "x" v1.0.0`, `git tag -s v1.0.0`,
  `git push --tags`, `git push origin --follow-tags`, `git push origin v3.11.0`,
  `git push origin main --tags`. Does not pass: `gh release view v3.11.0`, `git tag -l v3*`,
  `git tag -d v1.0`, `git tag --list v3*`, `git tag -v v1.0.0`, `git tag -n v1`,
  `git tag --contains v1.0`, `git tag --verify v1.0.0`, `git push --delete origin v1.0.0`,
  `git push -d origin v1.0.0`, `git push origin --tags --dry-run`, `git push -n origin v1.0.0`,
  `git push -u origin release/1.0.0`, `git push origin main`;
- `back`: command `gh pr create\b.*(--base[ =]|-B )develop\b(?!-)|git merge(?=\s)[^&;|"']*\s(origin/)?(main|release/\S+|hotfix/\S+)(\s|$)`
  (review W4). Passes: `gh pr create --base develop`, `gh pr create -B develop --title x`,
  `gh pr create --base=develop`, `git merge release/3.11.0`, `git merge --no-ff main`,
  `git merge origin/main`, `git merge hotfix/main-fix`. Does not pass: `gh pr create --base develop-old`,
  `gh pr create --base main`, `git merge feature/x -m "Merge into main"`, `git merge-base main HEAD`.
  Each listed case is a test (4.2).

### Worked examples (each becomes a navigator test)

**Shaping.** Precondition: no open change, and the git branch names none. Run in its own session.
1. `/epic-planning` with no open change → epic-shaping, `explore`.
2. `openspec/changes/x/inputs/seed.md` written → `variants`.
3. `inputs/qa.md` written → `decide`.
4. `proposal.md` written → `propose` (change state).
5. `design.md` and `tasks.md` written → `design`.
6. `/clarity-gate x` → `revise`, `clarity ✓ 9.2`. **Next step** offers nothing; the session ends.
7. The test asserts no process warnings on this run, and that the band's phases are exactly the six.

**Delivery, next session.** Gate states start empty in every session (`Started`), so a delivery
session always meets apply's clarity precondition, as today:
1. A fresh session with `x` open and no task ticked → epic-delivery, `ready` (placed, D-7).
2. `/epic-delivery` → `apply`, with `process:gate:apply:clarity` (PD-3).
3. **Back on track** runs `/clarity-gate x` → epic-shaping, `revise` (D-2); the gate passes and the
   warning clears.
4. `/epic-delivery` → epic-delivery, `apply` (placed); the clarity warning is gone. In strict mode,
   PD-1 still refuses a commit in `apply` until `test-driven-development` runs, as today.

**Reconcile mid-delivery.**
1. In `apply` with tasks 3/10, `/openspec-update-change x` → epic-shaping, `revise` (D-2).
2. `/epic-delivery` → epic-delivery, `apply` (placed).
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
6. `git push origin v3.11.0` → `back-merge`.
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
| Give two consecutive phases file gates whose globs overlap | Narrow the earlier glob, or accept one phase per write | `advanceOn` stops at the first passed gate: `qa.md` also matches `inputs/**`, so `qa.md` written first in `explore` moves to `variants`, not `decide` (review S4) |
| Put a read-only command (`gh release view`) in a gate | Match the command that does the step | Later gates are read too, so a lookup jumps phases (D-5) |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| A repo has no file matching a default glob | the gate never passes | the phase is left by a skill or a later gate; a gate warning names the glob; the guide says how to override it |
| A later gate passes first, e.g. `make validate` in `branch`, or an ADR in `drivers` | `advanceOn` reaches the later gate | it moves past the skipped phases; the left phase and each skipped phase raise their open gate warnings (`onLeave`), e.g. `branch:cut` and `bump:bumped`; tested |
| A CI-published repo never runs a local publish command | `published` stays open | leaving `publish` by the back-merge raises `publish:published`; the person accepts it (D-5) |
| Another change is open, or the branch names one | `readChange` follows it; the new change is not open until its `proposal.md` exists | depends on the other change's state. In `proposal` or `plan`: the band sits at `propose` or `design` (change states win forward) and inputs do not move it. In a delivery state (`tasks-partial`, `tasks-done`): no shaping phase holds it, the session is placed at `explore`, and the new change's inputs move it (`explore` → `variants` → `decide`) while the band shows the other change's tasks and appetite. In brownfield delivery (`tasks-no-design`): it sits at `design`. Either way it follows the new change once its `proposal.md` is the most recent or the branch names it (Risks); both cases tested |
| `tasks.md` written before `design.md` | change state `tasks-no-design` | in a shaping session `design` holds it (its `enter.change` lists `tasks-no-design`), so the session moves forward to `design`, never back; writing `design.md` keeps `design` (change state `plan`); no clarity warning unless `revise` is entered (by `openspec-update-change`) before `clarity-gate` has passed; tested |
| A fresh session on a change with only a proposal | `select` defaults to epic-delivery (`openChange`) | placed in `ready` (D-7); loading `epic-planning` switches to shaping |
| `architecture` loaded during shaping | architecting is selected | the session switches workflow; loading `epic-planning` again places it at `explore` (no open change) or at the change's phase |
| `epic-delivery` loaded inside a shaping session | epic-delivery selected | off-method (D-2): placed without checks; strict cannot block it |
| `architecture` reloaded, or `system-architect` spawned again mid-session | no phase names them (D-3) | the phase stays; tested |
| A switch to architecture after modelling | a new workflow selected | placed at `drivers` (first placement); gates already ok advance on the next matching write |
| A repo file extends `build-tier`, or names `shape`, `plan` or `exploratory` | `resolveWorkflows` reports `extends unknown workflow 'build-tier'` and skips the file | the band shows the error and the default `epic-delivery` is used, so a repo's `mode: strict` is lost until it renames the file and its `extends`; the CHANGELOG marks the rename BREAKING and says to rename the file and `extends` |
| A repo file extends `architecting` and names `explore` or `elicit` | its own `phases` replace the defaults wholesale | it keeps working with its own phases; the CHANGELOG lists architecting's removed phases as BREAKING (review W6) |
| A bad glob or regex in a new file | `make validate` (TC-16 and the parser) | the build fails, naming the file |

## Risks / Trade-offs

- [In a repo with other open changes, the band follows another change until the new
  `proposal.md` exists] → common in skillery (three other changes open on 2026-11-09). If that
  change is in `proposal` or `plan`, a shaping session sits at `propose` or `design` and does not
  show explore, variants or decide; if it is in delivery, the shaping phases move normally but the
  band shows the other change's tasks and appetite (error matrix). Accepted: write `proposal.md` early
  (`openspec-propose` creates it) and name the branch after the change (`docs/shape-<id>`); from then
  on the band follows the new change. Branch matching is by substring, so a branch name that
  contains another open change's id follows that change until the new `proposal.md` exists.

- [`**/*[Cc]4*` matches unrelated files] → active only inside architecting and forward only; a repo
  narrows it.
- [A `clarity-gate` run mid-delivery shows epic-shaping `revise` until `epic-delivery` loads] →
  intended (D-2, Q-9); the person runs `/epic-delivery` (D-2).
- [A file write marks every passed command gate `stale`] → `gatesAfterFile` (unchanged code) treats
  any edit as invalidating a command gate. Right for `validate`; wrong for release's `cut`, `merged`,
  `published` and `back`, which an edit cannot undo: after `back` passes, the next write shows it not
  ok. Known limit, accepted for SMALL (review S5); a later EPIC may mark gates that survive edits.
- [Shaping without recording inputs warns] → leaving `explore` with no file under `inputs/` raises
  the `inputs` gate warning, and leaving `variants` with no `qa.md` raises the `qa` warning (for
  example, `/openspec-propose` straight away). Intended: `epic-planning` steps 1–3 record the seeds
  and the Q&A; the warnings can be accepted like any other.

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
| 4.1 split, 4.2 release regexes and tests, 4.3 test gaps | `implementer` | sonnet (declared) | data and tests from the tables above |
| 4.4 docs | `implementer` | sonnet (declared) | docs to a clear brief |
| 4.5 | lead, inline | — | mechanical |

## Review findings (3.3, one pass L2+L3)

Accepted (the Rule of Divergence: each is a decision here before it is fixed):
- **W1, S1, S2, S3** — test gaps against the spec scenarios: an old use case edited in `decide`
  stays in `decide` on the shipped architecting file; the shaping band shows exactly six phases,
  also for a proposal-only change; the ADR write asserts `adr` ok; a tag and a release-branch push
  with an open change do not select release. Task 4.3.
- **W2** — `docs/development/workflows.md` *Work shaping* still flowed into `apply`; it ends at the
  clarity gate and points to `epic-planning`. Task 4.4.
- **W3** — `gh release view` dropped from `published` (D-5, Q-11). Task 4.2.
- **W4, W5** — `back` and `published` regexes tightened (gates above), each case probed in a test.
  Task 4.2.
- **W6** — CHANGELOG: two new workflows (plus shaping split out), architecting rewritten; the
  BREAKING line names architecting's removed phases and lost modelling activation, and the
  `build-tier` → `epic-delivery` rename. Task 4.4.
- **S4** — overlapping globs: an anti-pattern row; no data change. **S5** — stale command gates: a
  Risk; no engine change. **S6** — doc comments of `Advance`, `advanceOn`, `navigate` name file
  gates. Task 4.4. **S7** — the `extends` example says to copy `gates` from the linked default file.
  Task 4.4.

Rejected: none.

## Open Questions

None. D-4 is the lead's decision; the owner may overrule it (`inputs/qa.md` round 3). Round 5
(Q-7..Q-11) is answered.
