# Quality checks

How to add and test the **Quality check** type: the executable rules and configurations in
`quality/` that a project runs through `make check-quality`. The type itself is defined in
[`governance.md`](governance.md). The list of checks is [`quality/README.md`](../../quality/README.md).

## Add a Semgrep rule

1. Decide where it starts. A new rule starts in `quality/semgrep/report-only/`. A rule moves to
   `semgrep/rules/` by a pull request the owner approves, after its findings on one real project
   have been read.
2. Write the fixture first, beside the rule: `<id>.py` next to `<id>.yaml`. It holds at least one
   `# ruleid:` line (a bad case) and one `# ok:` line (a near miss the rule must leave alone).
3. Write the rule. The id starts with `mfy-`. Its message cites its owner in one of three forms:
   `cosmic-python:<ID>` for a catalogue entry, `cosmic-python:testing-checklist#<n>` for a testing
   checklist item, or `project-setup:config-files#suppressions` for the suppression rule.
4. Name the file in the table of `quality/README.md` by its path in backticks, with its tool and
   its owner.
5. Write the rule's name in the owner's "Checked by" value.

## Add an external source

Edit `quality/semgrep/external.json`. Each entry names the repository, the `commit` (40
hexadecimal characters, never a branch), the `paths`, the `licence`, the reason and the `mode`.
A source starts as `report-only`. The owner approves each entry and its licence in the pull
request, and approves again any later change of `commit`. Rules from a source are fetched at run
time and never copied into this repository.

## Add a tool

1. Pin its version in `skills/project-setup/assets/templates/root/Makefile.tmpl`.
2. A single binary: add its checksums, for each supported platform, to the template
   `tools.sha256` under `skills/project-setup/assets/templates/quality/`. A Python tool: pin it in
   `requirements-quality.txt` too.
3. Add its entry to `dependencies.yaml`, then run `make skill-inventory`, which regenerates the
   dependency tables.
4. Add the `make` target in the template and a `skipif` test group in `tests/test_quality.py`. A
   test there fails when a version differs between these files.

## How skillery tests the checks

- The repo lint `quality_files` (run by `make lint` and `make validate`) keeps `quality/` to
  checks, which hold no rule text: the root `README.md`, `.yaml`, `.yml`, `.json` and `.ini` files
  (Semgrep rules are `.yaml` only), and a `.py` only as the fixture of a rule of the same name. It
  also requires `quality/README.md` to name every rule and configuration file by its path.
- `tests/test_quality.py` holds the tests. The pure Python group runs everywhere. A tool group
  (Semgrep, Ruff, ls-lint, checkmake) skips when its tool is not on `PATH`, so CI stays lean and a
  developer runs the full set locally.
- `make install` installs the Python tools from `requirements-quality.txt`. ls-lint and checkmake
  are single binaries from their GitHub releases; put them on `PATH` at the versions
  `dependencies.yaml` pins, outside the repository.
