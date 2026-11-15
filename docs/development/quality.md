# Quality checks

How to add and test the **Quality check** type: the executable rules and configurations in
`quality/` that a project runs through `make check-quality`. The type itself is defined in
[`governance.md`](governance.md). The list of checks is [`quality/README.md`](../../quality/README.md).

A check holds no rule text. The rule lives in the skill that owns it, and the check's message
cites that skill. Nothing but rule files, configurations and Semgrep fixtures goes in `quality/`.

## Add a Semgrep rule

1. Decide where it starts. A new rule starts in `quality/semgrep/report-only/`. A rule moves to
   `semgrep/rules/` by a pull request the owner approves, after its findings on one real project
   have been read.
2. Write the fixture first, beside the rule: `<id>.py` next to `<id>.yaml`. It holds at least one
   `# ruleid:` line (a bad case) and one `# ok:` line (a near miss the rule must leave alone).
3. Write the rule. The id starts with `mfy-`. Its message cites its owner in one of three forms:
   `cosmic-python:<ID>` for a catalogue entry, `cosmic-python:testing-checklist#<n>` for a testing
   checklist item, or `project-setup:config-files#suppressions` for the suppression rule.
4. Name the file in the table of `quality/README.md`, with its tool and its owner. The repo lint
   `quality_files` fails on a rule file the README does not name.
5. Write the rule's name in the owner's "Checked by" value.

## Add an external source

Edit `quality/semgrep/external.json`. Each entry names the repository, the `commit` (40
hexadecimal characters, never a branch), the `paths`, the `licence`, the reason and the `mode`.
A source starts as `report-only`. The owner approves each entry and its licence in the pull
request, and approves again any later change of `commit`. Rules from a source are fetched at run
time and never copied into this repository.

## Add a tool

1. Pin its version in `skills/project-setup/assets/templates/root/Makefile.tmpl`.
2. Add its checksums, for each supported platform, to the template `tools.sha256` under
   `skills/project-setup/assets/templates/quality/`.
3. Add its entry to `dependencies.yaml`.
4. Add the `make` target in the template and a `skipif` test group in `tests/test_quality.py`.

## How skillery tests the checks

- The repo lint `quality_files` (run by `make lint` and `make validate`) keeps `quality/` to
  checks: the root `README.md`, `.yaml`, `.yml`, `.json` and `.ini` files, and a `.py` only as the
  fixture of a rule of the same name. It also requires `quality/README.md` to name every rule and
  configuration file.
- `tests/test_quality.py` holds the tests. The pure Python group runs everywhere. A tool group
  (Semgrep, Ruff, ls-lint, checkmake) skips when its tool is not on `PATH`, so CI stays lean and a
  developer runs the full set locally.
- `make install` installs the Python tools from `requirements-quality.txt`. ls-lint and checkmake
  are single binaries; install them at the pinned versions, outside the repository.
