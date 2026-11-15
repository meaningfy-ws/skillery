# Hand-over: stage 1 tool side of harden-checks-and-tests

Written on 2026-11-15 by the lead of the session that delivered the tool side (PR #246). Read
this first, then `design.md` D-34 and D-36 to D-40, when you start the prose side (wave 3).

## What is done

The tool side of stage 1, as in the split table of `tasks.md`: the *Quality check* type and its
lint; `quality/` with eight Semgrep rules, the external source manifest (four sources the owner
approved), the ls-lint and checkmake files and the README; the `project-setup` templates and
`scaffold.sh` (Ruff selection, `domain-no-io`, `quality-fetch`, `quality-tools`, the three check
targets, `.semgrepignore`, `tools.sha256`, `external_sources.py`, the CI steps); the
`QUALITY_VERSION` pin rendered by `make bundles`; `tests/test_quality.py` with its fixtures and
the tester's `tests/test_quality_adversarial.py`; `requirements-quality.txt`; five
`dependencies.yaml` entries; the docs outside `skills/`; the failure case and the cost evidence.
One review round (five lenses and the tester) and one fix pass (D-40).

Tasks ticked: 1.1, 1.2, 1.3, 1.4, 1.6, 1.9, 1.10, 1.11, 1.15.

## What the prose side owes (tasks 1.12, 1.14 and the open parts)

- **1.12** "Checked by" on the three catalogue tables, the 16 checklist items and the ten
  clean-code and SOLID bullets, in the layout `lean-skills`' pilot leaves (D-31). Then remove the
  two skips "switched on by task 1.12" in `tests/test_quality.py`. Its collector
  `catalogue_values` finds only units that already carry a value: extend it so a unit with no
  value fails, once the layout is known (D-40, rejected for now).
  - The exception rule is partial: write `(partial: a base with another name is reviewed)` (D-39).
  - The SPARQL rule does not see `+=` or `"".join(...)`: write it partial (D-40).
  - D-3's grammar says import-linter is followed by the contract kind "in words", but its own
    first-assignment row holds backticks (`exhaustive`); settle the form before writing it.
  - A report-only rule's value carries `(partial: report-only)`; no test enforces it.
- **1.5** `config-files.md` § Ruff (a pointer to the template's comments, D-33) and
  `decisions.md` D4. The probe table and the accepted `Session` gap are already commented on
  issue #215 (tool side).
- **1.7** the catalogue entry `AP-SPARQL-FROM-STRINGS` and its id in the L1 lens. The rule's
  message already cites `cosmic-python:AP-SPARQL-FROM-STRINGS`.
- **1.8** the *Suppressions* heading in `config-files.md`. The rule's message already cites
  `project-setup:config-files#suppressions`; the convention now covers `# NOQA`, `# ruff: noqa`
  and `# flake8: noqa` too (D-40).
- **1.13** the five `project-setup` references (`ci-and-infra.md`, `layout.md`, `checklists.md`,
  the template table of `config-files.md`, *Adopting the shared checks* in
  `modernizing-existing-projects.md`), sorted by D-33. The new template `dot-semgrepignore`
  (D-38) needs its row in the template table.
- **1.14** the `test-strategy` rows (D-12, D-15).
- **1.16** a CHANGELOG line for the prose side. Issue #215 is closed by this session after the
  merge, with the codes and the rule that cover its cases.

## What to know

- **Tools.** Nothing is installed system-wide. This session used a scratch tool folder at the
  pinned versions (D-37); on another machine follow `docs/development/quality.md`. Without the
  tools their tests skip.
- **A release is owed** before a project can fetch `quality/` at a tag (D-19). Until then a
  scaffold sets `QUALITY_VERSION` to a commit by hand.
- **`project-setup` moved from Poetry to uv** (PR #248, after this side merged). The scaffold
  runs here used Poetry; stage 2's task 2.5 now confirms `uv lock`. The bare-`pip` problem of
  `install-poetry` found here is gone with it.
- **Open for the owner:** a fresh skeleton fails its own 80 % coverage gate (`.coveragerc` omits
  `__init__.py` and the skeleton has no other measured code), under Poetry and uv alike.
- **Semgrep traps** (D-38, D-39): its built-in ignore list skips `tests/`, which is why a project
  ships `.semgrepignore`; a bare `# nosemgrep` cannot be tested in a fixture.
- **Stage 3** runs the old and the new tester brief on one seeded stage (D-24, confirmed in D-36).
