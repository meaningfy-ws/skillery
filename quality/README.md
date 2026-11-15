# Quality checks

The shared, executable checks that a scaffolded project fetches at the release pin and runs
through `make check-quality`. This is the only prose file in `quality/`. It lists each check, the
tool that runs it, its file and the skill that owns the rule it checks. The rule text lives in
that skill; each check's message cites it.

To add a check, a source or a tool, see [`docs/development/quality.md`](../docs/development/quality.md).

| Check | Tool | File | Owner |
|---|---|---|---|
| SPARQL is not built from strings | Semgrep, gating | `semgrep/rules/mfy-sparql-built-from-strings.yaml` | `cosmic-python` (catalogue `AP-SPARQL-FROM-STRINGS`) |
| Exceptions live in `exceptions.py` | Semgrep, gating | `semgrep/rules/mfy-exception-outside-exceptions-module.yaml` | `cosmic-python` (catalogue `BP-EXCEPTIONS-MODULE`, `AP-EXCEPTIONS-EMBEDDED`) |
| No network call in unit or feature tests | Semgrep, gating | `semgrep/rules/mfy-test-network-call.yaml` | `cosmic-python` (testing checklist item 3) |
| RDF is compared as graphs, not strings | Semgrep, gating | `semgrep/rules/mfy-test-rdf-string-compare.yaml` | `cosmic-python` (testing checklist item 7) |
| No real sleep in tests | Semgrep, gating | `semgrep/rules/mfy-test-real-sleep.yaml` | `cosmic-python` (testing checklist item 12) |
| A dict is not a model | Semgrep, report-only | `semgrep/report-only/mfy-dict-as-model.yaml` | `cosmic-python` (catalogue `AP-DICT-AS-MODEL`) |
| No free string as a key or attribute name | Semgrep, report-only | `semgrep/report-only/mfy-free-string-key.yaml` | `cosmic-python` (catalogue `AP-FREESTR-ANYLAYER`) |
| A suppression carries a reason | Semgrep, own pass | `semgrep/suppressions/mfy-suppression-without-reason.yaml` | `project-setup` (`config-files.md`, *Suppressions*) |
| External rule sources, pinned by commit | Semgrep | `semgrep/external.json` | `project-setup` |
| No `utils`, `helpers`, `port`, `factory`, `manager` or `errors` file names | ls-lint | `ls-lint/python-project.yml` | `project-setup` (checks `cosmic-python` names) |
| Makefile hygiene and required targets | checkmake | `checkmake/python-project.ini` | `project-setup` |

Report-only rules print their findings and never fail the build. A gating rule fails it. A
report-only rule moves to `semgrep/rules/` by a pull request the owner approves.

The suppression rule runs in its own pass with `--disable-nosem`, because a bare `# nosemgrep`
would otherwise hide the rule that looks for it. For the same reason its fixture cannot test a
bare `# nosemgrep`; the scaffold run of each release shows that case red.

The test rules need the project's own `.semgrepignore`, which `project-setup` renders: Semgrep's
built-in ignore list skips `tests/`.

The checkmake file sets `maxbodylength` to 15 lines. That is the longest recipe the project
`Makefile` template needs; raise it only with a reason written here.
