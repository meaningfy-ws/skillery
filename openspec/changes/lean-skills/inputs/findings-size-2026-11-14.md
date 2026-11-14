# Findings — where the size of skillery's skills is (2026-11-14)

Measured on `develop` `d64b28b` over the 392 tracked files of `skills/` with a throwaway script
(bytes per skill, split into `SKILL.md` prose, reference prose, fenced code blocks inside Markdown,
scripts, and other files such as templates). Read in addition: the generic sections of
`cosmic-python`'s `SKILL.md` and the head of one of its example files.

## 1. The totals

| Kind of content | Bytes | Share | Enters the agent's context |
|---|---:|---:|---|
| Reference prose (`references/*.md`) | 831 KB | 47% | Only when the agent opens the file |
| `SKILL.md` bodies | 448 KB | 25% | Whenever the skill fires |
| Templates and other assets | 194 KB | 11% | Never as instructions; copied by a script |
| Fenced code inside Markdown (examples) | 173 KB | 10% | With the file that holds it |
| Scripts | 127 KB | 7% | Never; they are run |
| **All of `skills/`** | **1.77 MB** | | |
| Skill descriptions (inside the bodies) | 32 KB | | In every session, for each installed bundle |

Two corrections to the working assumption:

- `cosmic-python` is 127 KB, not 450 KB. 454 KB is the sum of all 51 `SKILL.md` files.
- 18% of the bytes (templates and scripts) cost no context at all. `project-setup`, the largest
  skill at 296 KB, is 132 KB of files it copies or runs. The target for shrinking is the prose and
  the examples: 1.45 MB.

## 2. The ten largest skills

| Skill | Total | Body | Reference prose | Fenced code | Scripts and assets |
|---|---:|---:|---:|---:|---:|
| `project-setup` | 296 KB | 14 | 133 | 17 | 132 |
| `architecture` | 144 KB | 35 | 72 | 36 | 2 |
| `cosmic-python` | 127 KB | 21 | 27 | 79 | 0 |
| `test-strategy` | 90 KB | 8 | 81 | 0 | 0 |
| `sales-pipeline-custody` | 80 KB | 16 | 28 | 0 | 36 |
| `rulebook` | 73 KB | 8 | 19 | 1 | 45 |
| `semantic-consulting-coach` | 57 KB | 19 | 38 | 0 | 0 |
| `linkml-engineering` | 56 KB | 6 | 25 | 4 | 21 |
| `infrastructure-operations` | 56 KB | 10 | 34 | 1 | 11 |
| `sales-operations` | 52 KB | 9 | 40 | 1 | 3 |

By bundle area, roughly: engineering (building and architecture) 0.9 MB, sales 0.24 MB, devops
0.18 MB, the rest 0.42 MB.

`make lint` already flags two bodies over the budget of 500 lines or 5000 tokens: `architecture`
(650 lines, about 8900 tokens) and `cosmic-python` (about 5100 tokens).

## 3. `cosmic-python` looked at closely

- **62% of it is example code** (79 KB), copied from one project (`mapping-suite-sdk`), in seven
  files. Copied code goes stale when that project changes, and nothing checks it.
- **Nothing outside the skill uses the examples** except two mentions (`test-strategy`'s inventory
  and one practice doc). What other skills and agents cite is the 8 KB catalogue of id'd principles
  and anti-patterns (9 citations).
- **The body repeats itself.** "Clean Code Standards" and "Principles & Best Practices: On Code
  Structure" say the same five things twice; observability is stated twice; the layer contract is
  stated in the body and again in the catalogue's anti-patterns.
- **The body restates what others own:** SOLID and Clean Code (general knowledge, and the book rule
  sets), the TDD ritual and the test pyramid (`superpowers`, `test-strategy`), ADR advice
  (`architecture`), and a section on Stream Coding (an external method).
- **What is ours alone:** the four-layer contract with its Python folder names, component-first
  layout, the catalogue entries that came from real reviews, the config and exceptions conventions.
  That is about 15 to 20 KB.

## 4. Do the examples help? Not known

Nothing in skillery measures it. What can be said without measuring:

- An example earns its place when it shows a **house convention a model cannot guess** (our config
  resolver, our exceptions module, our naming). A rule alone may not pin down the shape.
- An example of a **pattern every model already knows** (a repository, a unit of work, dependency
  injection) most likely adds nothing but bytes.
- The book repository reached the same position: its author concedes models already know the
  books, and that the value is a short reminder at the right moment.

The way to know is a comparison: the same coding task run with the full skill, with the rules only,
and with no skill, each result reviewed against the catalogue. The `evaluate-catalogue` change
already plans cheap-model evals and could carry this.

## 5. What the owner asked for, against what exists

| Wanted | Where it lives today |
|---|---|
| Specs good enough to implement from | `epic-planning`, `clarity-gate`, `bdd-gherkin` |
| Tests at several levels | `test-strategy`; `superpowers:test-driven-development` |
| Adversarial self-checks that the work follows the spec | `meaningfy-code-review` (five lenses), `epic-delivery` (verification and validation), `guardrails` (second check), `superpowers:verification-before-completion` |
| Rule-following discipline | `rulebook`, `rule-learner`, `guardrails` |
| Clean and onion architecture | `cosmic-python`; the Clean Architecture book set |
| Fowler | no owner; the Refactoring and PoEAA book sets |
| Evans | concept level in `conceptual-modelling`; the three DDD book sets |
| Model-driven development | `conceptual-modelling`, `linkml-engineering`, `modelling-conventions` |

The discipline is already there and it is the small part. The bulk is reference prose and examples
around it.

## 6. Levers for shrinking, with rough sizes

| Lever | Applies to | Rough effect |
|---|---|---|
| Drop example code that shows a commonly known pattern | `cosmic-python`, `architecture` | up to 115 KB |
| Remove repetition inside a skill and restated facts owned elsewhere | every body over about 10 KB | not measured; `cosmic-python` body alone about half |
| Replace generic book knowledge by a dependency | `cosmic-python` generic sections; nothing else today | about 5 KB, plus the six gaps filled without writing them |
| Rewrite reference prose as decision and trigger rules | `test-strategy`, `architecture`, sales and devops references | not measured; this is where 831 KB sits |
| Move scaffolding out of the skill (a template repository or package) | `project-setup` | 132 KB off the catalogue, no context effect |

Only the first row is a measured upper bound. The others are estimates and need a per-skill read.

## 7. Not verified

- Whether removing examples changes what agents produce.
- How often each reference file is actually opened in real sessions.
- The reference prose of the sales, devops and consulting skills was sized, not read.
