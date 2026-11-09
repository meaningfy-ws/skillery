# Q&A record (secondary, never groomed)

## Round 1 — 2026-11-09, in conversation

| # | Question | Lead's recommendation | Owner's answer |
|---|---|---|---|
| 1 | Which skills get a workflow? | Only skills that describe an ordered process inside one session: modelling, architecture, release, the planning path; second tier project-setup, decision-package, a sales offer variant; not the knowledge skills, rulebook or vault | "go ahead and shape" with the first four; second tier not confirmed (open, Q-1 below) |
| 2 | Architecture phases | drivers → views (C4) → decide | drivers elicitation → use cases elicitation/exploration → C4 → decide; plus an initial domain model handed over to modelling |
| 3 | Planning variant | `planning`: explore → shape → plan, merged with `exploratory` | named **work shaping**: explore → see variants → decide → propose → design → revise |
| 4 | Modelling: workflow or variant? | its own workflow owned by `conceptual-modelling` (phases architecture never sees) | accepted with "go ahead" |
| 5 | Modelling validate gate | a file gate on the review record in the change's `evidence/` | accepted with "go ahead" |
| 6 | Modelling model gate | command gate `make generate-models` | accepted with "go ahead" |
| 7 | Appetite | SMALL | "a small epic" |

## Round 2 — 2026-11-09, asked with the shaped EPIC

- **Q-1.** Second tier (project-setup, decision-package, sales `offer` variant) in this EPIC or a
  later one? Recommendation: later; this EPIC proves the pattern on four, and each of those three
  needs its owner's gates.
- **Q-2.** Appetite. Release and modelling are data only; architecture's phases are told apart only
  by the files they write, so one engine rule is needed (DEC-6). Recommendation: keep **SMALL** with
  that one rule; if the rule grows past "a file gate advances like a command gate", re-shape as MEDIUM.
- **Q-3.** Renaming build-tier's `shape`/`plan` to `propose`/`design` (DEC-2) changes phase ids a
  repo file may name. Recommendation: rename now, while navigator is days old. A repo file
  that lists build-tier's phases replaces them wholesale, so it keeps working under its own names;
  one that only sets `mode` follows the rename. Two names for one thing is the worse cost.

**Owner's answers (2026-11-09):** Q-1 "okay" (second tier in a later EPIC); Q-2 "yes" (SMALL with
the one engine rule); Q-3 "okay" (rename now). No question is open.

## Round 3 — 2026-11-09, raised while deriving the PLAN

- **Q-4 (withdrawn).** The lead first proposed replacing DEC-6 with a phase `enter.files` key, on
  the claim that a file gate would block strict commits. The clarity-gate review showed the claim
  false: strict refuses a commit only on a gate warning of the *current* phase, and command and
  file gate warnings are raised when a phase is left. DEC-6 stands as the owner approved it; each
  file gate sits on the phase before the one its artifact starts (design D-1).
- **Q-5.** DEC-5's `hotfix` variant has the same six phases and no signal to select it. Decided by
  the lead: drop it; the `cut` gate matches `hotfix/` branches too (design D-4). The owner may
  overrule.

## Round 4 — 2026-11-09, from the second clarity-gate run (8.2/10)

- **Q-6.** Navigator treats a variant change as a *placement*: no leave or enter checks. So going
  from the `work-shaping` variant to the full build-tier (loading `epic-delivery`) skips apply's
  clarity precondition, and strict cannot block an ungated PLAN. Options:
  1. **Drop the variant** (recommended): build-tier simply starts with the six shaping phases; a
     shaping session sees all nine, the current one bold and the rest dim (PR #156). Data only, stays
     SMALL, and it also removes four of the gate's other gaps (expect noise, PD-4 on epic-delivery,
     side paths of the variant).
  2. **Keep the variant, change the engine**: a variant change inside one workflow runs the leave and
     enter checks, and `activate.change` takes a list. Two small rules beyond DEC-6: re-shape as
     MEDIUM.

**Owner's answer (2026-11-09):** "i want to keep separate the sessions of work shaping and
implementation". Neither option: the variant stays, the shaping session ends at `revise`, and a
delivery session starts fresh (design D-2). Loading `epic-delivery` inside a shaping session is
off-method and recorded in the error matrix. Stays SMALL.

## Round 5 — 2026-11-09, during delivery: re-shape (logged)

**Trigger.** The owner asked, in a parallel session: "why does the delivery skill have
explore/shape/plan?" The decision was relayed by that session and confirmed by the owner in the
epic session.

- **Q-7. Split build-tier in two workflows?** Shaping and delivery are separate sessions (Q-6); the
  `work-shaping` variant was a workaround for one file covering both. **Answer: yes.** A new
  `epic-shaping` workflow in `epic-planning` holds the six shaping phases; the delivery workflow in
  `epic-delivery` keeps only delivery. This removes D-2's variant activation list, the detour through
  `revise` mapped from a delivery state, and the variant itself.
- **Q-8. Where does a fresh delivery session on a gated-but-unstarted change (state `plan`) land?**
  A workflow switch is a placement and runs no checks, so landing in `apply` would skip the clarity
  check. **Answer: a first delivery phase `ready`** (entered by change state `plan`, no gates);
  loading `epic-delivery` then *enters* `apply` and runs the check (PD-3), as before.
- **Q-9. Reconcile EPIC during delivery loads shaping skills and switches to `epic-shaping` at
  `revise`. Wanted?** **Answer: accept the switch.** Reconciling is revising the PLAN; loading
  `epic-delivery` returns. No engine change.
- **Q-10. Names.** The owner asked "why not epic shaping and epic building/delivery?". **Answer:**
  ids `epic-shaping` (title "EPIC shaping") and `epic-delivery` (title "EPIC delivery"), matching
  the owning skills. `build-tier` is renamed now, while this release is already BREAKING for repo
  files that extend it; "build-tier" stays the method's name for the tier in docs.
- **Q-11 (review finding W3).** `published` matched `gh release view`, so viewing an older release
  during `branch` jumped to `back-merge`. **Answer: drop `view`.** A CI-published repo leaves
  `publish` by the back-merge and shows one `publish:published` warning it can accept.

Appetite stays SMALL: data, tests and docs only; DEC-6 is still the one engine rule.
