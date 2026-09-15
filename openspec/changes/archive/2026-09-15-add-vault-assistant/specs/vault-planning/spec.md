## ADDED Requirements

### Requirement: Plans cascade across four horizons in one file per year

The `vault-planning` skill SHALL keep the owner's plans in `05 To Do/Objectives YYYY.md`, with one
section per horizon: the year, each quarter (objectives with measurable key results, OKR-style), each
month, and the current week. Each horizon SHALL cite the horizon above it that it serves. The file SHALL
end with an append-only change log, one dated line per change stating what changed and why. The skill
SHALL NOT delete a past objective; it marks it done, dropped or carried over.

#### Scenario: A weekly plan serves the quarter

- **WHEN** the owner plans a week
- **THEN** each weekly objective names the quarterly key result or monthly objective it advances, or
  is marked as unplanned work

#### Scenario: A changed objective leaves a trace

- **WHEN** the owner changes a quarterly key result
- **THEN** the section shows the current wording and the change log gains one dated line with the
  reason

### Requirement: Planning and review are separate sessions

The skill SHALL run a planning session or a review session for a named horizon (`week`, `month`,
`quarter`, `year`). A review session SHALL read that period's records (daily notes for a week; the
period's reviews for longer horizons), the plan for the period and the project files touched, and
SHALL write a review record to `04 Daily/reviews/` named for the period (`YYYY-Www`, `YYYY-MM`,
`YYYY-Qn`, `YYYY`) with wins, misses, what carries over and what the next period should focus on.
A planning session SHALL start from the latest review of the same horizon when one exists. The skill
SHALL ask the owner for every objective and SHALL NOT invent one.

#### Scenario: A weekly review is written

- **WHEN** the owner runs a review for the past week
- **THEN** `04 Daily/reviews/YYYY-Www.md` exists with wins, misses, carry-over and next focus, and
  no plan changes without the owner's answer

#### Scenario: No objectives are set yet

- **WHEN** the owner plans a week and no `Objectives YYYY.md` exists
- **THEN** the skill offers to create the file and asks for the year's objectives first

### Requirement: Friction becomes a skill-change proposal

A review session SHALL record any friction with the vault's method that the owner raises as a
`skill-change` note in `00 Inbox/proposed/`, and SHALL NOT edit any skill.

#### Scenario: The owner complains about a skill

- **WHEN** the weekly review surfaces that `vault-capture` files too much detail
- **THEN** a `skill-change` note is staged in `00 Inbox/proposed/`, and no skill file changes
