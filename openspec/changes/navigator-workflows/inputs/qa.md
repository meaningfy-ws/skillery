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
