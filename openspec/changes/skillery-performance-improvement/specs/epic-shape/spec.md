## MODIFIED Requirements

### Requirement: Planning effort follows the appetite
A PLAN's depth SHALL follow its appetite. At every appetite, and on any re-gate, the clarity gate
SHALL run at most twice, the second run reading only the gaps the first listed. Gaps left
after the second run SHALL go to the developer as one question round, and a gap the developer
accepts SHALL be recorded as a `DEC-` in `design.md`, the one case where a PLAN proceeds below
9/10 (lean-delivery DEC-2). Elicitation SHALL ask its questions in rounds, capped per EPIC by appetite: `TINY`
and `SMALL` at most 2, `MEDIUM` at most 3, `LARGE` and above at most 4; a round's answers SHALL
be confirmed inside the next round, never in a round of their own. The
`epic-planner` SHALL NOT preload `stream-coding` (lean-delivery DEC-6, DEC-7; D-8, DEC-16).

#### Scenario: A SMALL PLAN at 8.6 after two runs
- **WHEN** a SMALL PLAN scores 8.6 on its second clarity-gate run
- **THEN** the remaining gaps go to the developer in one round, and no third revision runs

#### Scenario: A LARGE PLAN at 8.8 after two runs
- **WHEN** a LARGE PLAN scores 8.8 on its second clarity-gate run
- **THEN** the remaining gaps go to the developer in one round, and no third run is made

#### Scenario: A re-gate
- **WHEN** a gated PLAN is changed and gated again
- **THEN** the gate runs at most twice for that re-gate, and its second run reads only the gaps the first listed

#### Scenario: A MEDIUM EPIC reaches its third round
- **WHEN** three rounds of a `MEDIUM` EPIC are answered and gaps remain
- **THEN** each gap is recorded in the EPIC as an assumption for the developer; no fourth round is sent

#### Scenario: Confirmation rides in the next round
- **WHEN** round 1 of a `LARGE` EPIC is answered
- **THEN** round 2 opens with a one-line confirmation of those answers; no separate confirmation round is sent

### Requirement: The PLAN is derived and gated while shaping
Deriving and gating the PLAN SHALL be part of the shaping session, in one workflow owned by
`epic-planning`: seeds, EPIC, PLAN, gate. A shaping session SHALL end with each EPIC's PLAN gated,
not "shaped, not planned". Once `proposal.md` is saved the planner SHALL compact the session;
between EPIC and PLAN the session MAY instead be reset with a hand-over note on `epic-delivery`'s
template. Each later EPIC of an initiative SHALL start in a fresh session from the hand-over note.
Scenario sign-off SHALL happen at the PLAN gate, now in shaping.
At `TINY` to `MEDIUM` the planner SHALL write the spec deltas, run the attack and run the gate
inline; at `LARGE` and above it SHALL send one subagent for the attack and gate run 1 and one for
all deltas, and gate run 2 SHALL run inline on the listed gaps. A change shaped under
the old split and half-way through SHALL be read by the same phases (lean-delivery DEC-19 and D-17; D-8, DEC-3, DEC-4).

#### Scenario: A shaping session ends
- **WHEN** a shaping session finishes an EPIC
- **THEN** its PLAN is derived and gated; the session does not end "shaped, not planned"

#### Scenario: A reset between EPIC and PLAN
- **WHEN** the session is reset after the EPIC and before the PLAN
- **THEN** a hand-over note with the standard headings carries the work to the fresh session

#### Scenario: Scenarios are signed off at the gate
- **WHEN** a PLAN passes its clarity gate in shaping
- **THEN** the developer signs off its scenarios at that gate, and delivery does not ask again unless a scenario changes

#### Scenario: A change half-way through the old split
- **WHEN** a change was shaped under the old split and has an EPIC but no PLAN
- **THEN** the shaping phases derive and gate the PLAN, and delivery does not

#### Scenario: The proposal is saved
- **WHEN** the planner saves `proposal.md` of change `x`
- **THEN** it compacts before deriving `design.md`, keeping the DEC- list and the open questions

#### Scenario: The second EPIC of an initiative
- **WHEN** EPIC `b` follows EPIC `a`, whose PLAN is gated
- **THEN** `b` starts in a fresh session from the hand-over note, not in `a`'s session

#### Scenario: Deltas and gate scale with the appetite
- **WHEN** a `LARGE` EPIC reaches its PLAN
- **THEN** one subagent runs the attack and gate run 1, one writes every delta, and gate run 2 runs inline on the listed gaps
- **AND** a `SMALL` EPIC at the same point does all of it inline, with no subagent

## ADDED Requirements

### Requirement: A PLAN has a size budget by appetite
`design.md` of an active change SHALL stay within a budget read from the appetite in its
`proposal.md`: `TINY` 4 KB, `SMALL` 8 KB, `MEDIUM` 12 KB, `LARGE` 16 KB, `VERY LARGE` 24 KB
(KB = 1024 raw bytes, as `repo_lint` measures prose). The appetite SHALL be parsed as the
navigator's `appetiteOf` does: the workflow appetite names, longest match first, on the first paragraph
under `## Appetite`. `make lint` SHALL fail on a non-exempt active change over budget or with an
unparseable appetite; exempt: archived changes and those in an allowlist file of the changes active
when the check lands. Every task in `tasks.md` SHALL cite a design anchor
(`design.md#d-n`). The checklist `clarity-gate/references/clarity-gate-checklist.md` SHALL hold the
13 items, the 6-criterion rubric and the score reading in at most 4 KB, with minimums per appetite:
anti-pattern rows `TINY` 2, `SMALL` 3, `MEDIUM` 4, `LARGE` 5; error-matrix rows the same; worked
examples 1, 1, 2, 3 (D-9, DEC-9).

#### Scenario: A MEDIUM design over budget
- **WHEN** an active `MEDIUM` change has a `design.md` of 13 KB
- **THEN** `make lint` fails and names the change, its appetite and the 12 KB budget

#### Scenario: An archived design over budget
- **WHEN** an archived change, or one in the allowlist, has a `design.md` of 20 KB
- **THEN** `make lint` passes without a message about it

#### Scenario: An unparseable appetite
- **WHEN** a non-exempt active change's first paragraph under `## Appetite` names no workflow appetite
- **THEN** `make lint` fails naming the change and the paragraph it could not parse

#### Scenario: A task without an anchor
- **WHEN** a task line in `tasks.md` names no `design.md#d-n`
- **THEN** the clarity gate lists it as a gap

#### Scenario: A TINY PLAN meets the minimums
- **WHEN** a `TINY` PLAN has 2 anti-pattern rows, 2 error-matrix rows and 1 worked example
- **THEN** the minimums are met and the gate asks for no more rows
