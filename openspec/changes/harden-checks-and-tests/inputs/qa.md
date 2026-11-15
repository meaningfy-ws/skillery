# Q&A record: harden checks and tests

**Secondary input, never groomed.** The owner's answers, verbatim where quoted.

## Round 0 (in conversation, before shaping)

See `seed.md` § Owner decisions: Semgrep only (no CodeQL); tester Hypothesis-driven from MEDIUM up;
Vale, a Makefile check and a folder-structure check; shape now in a new worktree.

## Round 1

| # | Question | Answer |
|---|---|---|
| Q-1 | How does a project get the shared rules? | "lets harbor the meaningfy rules in skillery repo for now ... btw a new root folder in the repo, no? well documented. and also our rules are only a few, but we want to get the rules from other places, well known repos and packages (but i will have to hand pick them)" |
| Q-2 | Failure-first evidence? | "i have noticed something being called adversarial testing but it was just an implementer with extra prompts, so we shall keep that one, but we need support that one with additional proper methods" |
| Q-3 | One EPIC or two? | One EPIC, LARGE, staged. |
| Q-4 | How are folder structure, names and the Makefile checked? | ls-lint + checkmake. |

## Round 2

| # | Question | Answer |
|---|---|---|
| Q-5 | Name of the new root folder (a sixth artifact type)? | `quality/` |
| Q-6 | How does a project consume the checks? | A `make` target fetches `quality/` from a pinned skillery release tag into a gitignored folder. |
| Q-7 | How are hand-picked external rules recorded? | A manifest of picked sources per tool: id, pinned version, licence, why picked; agents propose, the owner approves each in the PR; no copying of external rule text. |
| Q-8 | Where does the weekly mutmut run and what does it produce? | "cant it run weekly and provide results in a new commit in /tests/mutmut-results? and someone shall pick them up and plan implementation and delete the folder, if empty" |

## Round 3

| # | Question | Answer |
|---|---|---|
| Q-9 | How does the weekly mutmut commit reach protected `develop`? | A weekly bot PR. |
| Q-10 | When does the import-linter review run? | A mechanical check per PR (every top-level package under a contract; `ignore_imports` not grown without a `DEC-`) plus the L3 lens judging the contracts once per EPIC. |
| Q-11 | Risks: which do we mitigate (the rest accepted)? | Mitigate: tools missing on machines/CI; noise makes teams ignore checks; external packs change or relicense. **Accepted:** nobody picks up the mutmut results. |
| Q-12 | What must the EPIC prove? | Every Meaningfy rule is tested; the tester uses proper methods; mutmut and the import review work. (Not chosen: "a fresh scaffold is green".) |

## Round 4

| # | Question | Answer |
|---|---|---|
| Q-13 | First Meaningfy Semgrep rules? | All four groups (cosmic-python structural, free-text dict keys, hygiene, test hygiene), and: "clean code rules, ALLL of them; DDD rules, TDD rules, best practice on organising and reusing fixtures, all cosmic python rules, lookup antipatterns, (i guess the pep rules are already checked by someone else no) etc." Bounded by Q-17/Q-18. |
| Q-14 | Where do `quality/`'s own tests run in skillery? | Locally in `make validate`; CI skips them with a clear message when a tool is missing. |
| Q-15 | Does skillery dogfood the checks on itself? | No. |
| Q-16 | What is in the Vale style at first? | Hand-picked external styles only; Meaningfy-own Vale rules come later. |

## Round 5

| # | Question | Answer |
|---|---|---|
| Q-17 | How is the work split between checkers? | Ruff first (extend its selection), import-linter for imports, Semgrep only where neither can, review for the rest; every catalogue entry gets a "Checked by" column. |
| Q-18 | How far does "ALL of them" go? | LARGE: encode what is catalogued (cosmic-python catalogue, its clean-code/SOLID sections, the testing checklist). Growing the catalogue with DDD, TDD and fixture rules is a follow-up EPIC. |

## Round 6: the re-shape (logged)

The owner widened the question from software to every activity ("TDD/BDD philosophy is core across
all activities we do, and for each activity we execute we shall know when/how we fail and how we
succeed") and agreed the model: one `test-strategy` skill owns the discipline, domain skills keep
their techniques, workflows own when and who. The bet became HUGE and was split:

| EPIC | Change | Status |
|---|---|---|
| A | `test-strategy` | Shaped 2026-11-13 |
| B | `harden-checks-and-tests` (this) | Re-based on A: depends on it, fills its software rows (DEC-14) |
| C | `activity-test-profiles` | Seeded; receives Vale (DEC-7) |
| D | `generic-task-test-profiles` | Seeded |

The owner's words and the rest of round 6 are in `../../test-strategy/inputs/seed.md`.

## Round 7: after the readiness check

| # | Question | Answer |
|---|---|---|
| Q-19 | B's appetite: VERY LARGE, or LARGE with mutmut and the import review cut out? | "okay go for very large, for B" |
| Q-20 | Follow-ups promised across the four EPICs: how are they recorded? | As GitHub issues. |

## Round 8: while deriving the PLAN (2026-11-14)

Asked after the Ruff probe for issue #215 and the attack on the PLAN's first draft. Each question
came with a recommendation; the owner's choice is given as chosen.

| # | Question | Answer |
|---|---|---|
| Q-21 | Ruff `S113` flags `requests.get(url)` without a timeout but not `requests.Session().get(url)`. How do we treat the gap, given DEC-3? | "Accept the gap": Ruff `S113` only, recorded on issue #215 and as a risk. (Recommended.) |
| Q-22 | Which GitHub repository is the sample project of DEC-15? | "Decide at stage 3": the stage 3 lead asks before the end-to-end run. (Recommended was a new scratch repository.) |
| Q-23 | DEC-4 says `quality/` holds only executable rule files and configurations. Where do the three small scripts and the file of tool checksums live? | "In project-setup templates": copied into every scaffolded project; `quality/` keeps rules and configurations only. (Recommended was `quality/`.) |
| Q-24 | ls-lint cannot require a named file, cannot join "snake case and not banned" in one rule, and fails on kebab-case folders. How far does the layout check of DEC-8 go? | "Plus required files in make": ls-lint bans the generic file names; required files are a few `test -f` lines in the `make` target; snake case stays with Ruff. |

Q-24 narrows DEC-8 (ls-lint no longer checks folder names or the layout as a whole); the EPIC is
not re-shaped, and the narrowing is recorded in `design.md` D-5.

The shaper kept Q-13's hygiene group in DEC-3 (three rules through Ruff, "SPARQL built from strings"
as the one new catalogue entry with a Semgrep rule), since the owner chose that group.
