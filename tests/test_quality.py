"""The shared checks under quality/ and the templates that carry them (design D-8, test table of D-27).

Python-only groups always run, CI included (CI installs only pyyaml and pytest). Tool groups skip when
their tool is not on PATH, as tests/test_formal_reasoning.py does. Hypothesis is never imported here
(D-18); the property tests live in tests/test_quality_properties.py, from stage 3.
"""
import http.client
import importlib.util
import json
import re
import shutil
import subprocess
import tarfile
import tomllib
from configparser import ConfigParser
from io import BytesIO
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[1]
QUALITY = ROOT / "quality"
SEMGREP = QUALITY / "semgrep"
SEMGREP_FOLDERS = ("rules", "report-only", "suppressions")
MANIFEST = SEMGREP / "external.json"
CHECKMAKE_INI = QUALITY / "checkmake/python-project.ini"
LSLINT_CONFIG = QUALITY / "ls-lint/python-project.yml"
TEMPLATES = ROOT / "skills/project-setup/assets/templates"
MAKEFILE_TMPL = TEMPLATES / "root/Makefile.tmpl"
RUFF_TMPL = TEMPLATES / "root/ruff.toml.tmpl"
SCRIPT = TEMPLATES / "quality/external_sources.py"
FIX = ROOT / "tests/fixtures/quality"
COSMIC = ROOT / "skills/cosmic-python"

needs_semgrep = pytest.mark.skipif(shutil.which("semgrep") is None, reason="semgrep not on PATH")
needs_ruff = pytest.mark.skipif(shutil.which("ruff") is None, reason="ruff not on PATH")
needs_lslint = pytest.mark.skipif(shutil.which("ls-lint") is None, reason="ls-lint not on PATH")
needs_checkmake = pytest.mark.skipif(shutil.which("checkmake") is None, reason="checkmake not on PATH")


# --- Helpers under test (pure Python) ----------------------------------------------------------

# What a rule's message cites (design D-3): a catalogue entry, a checklist item, the suppression rule.
MESSAGE_FORM = re.compile(r"cosmic-python:(?:[A-Z]{2}-[A-Z0-9-]+|testing-checklist#\d+)"
                          r"|project-setup:config-files#suppressions")
RULE_ID_PREFIX = "mfy-"


def fixture_problems(folder):
    """One line per problem in a Semgrep rule folder: no fixture, a missing mark, a bad id or message."""
    if not folder.is_dir():
        return [f"{folder.name}: folder is missing"]
    problems = []
    for rule_file in sorted(folder.glob("*.yaml")):
        name, fixture = rule_file.stem, rule_file.with_suffix(".py")
        if not fixture.is_file():
            problems.append(f"{name}: no fixture {fixture.name}")
        else:
            text = fixture.read_text(encoding="utf-8")
            problems += [f"{name}: fixture has no `{mark}:` mark" for mark in ("ruleid", "ok")
                         if not re.search(rf"#\s*{mark}:", text)]
        for rule in yaml.safe_load(rule_file.read_text(encoding="utf-8"))["rules"]:
            if not rule["id"].startswith(RULE_ID_PREFIX):
                problems.append(f"{name}: rule id '{rule['id']}' does not start with {RULE_ID_PREFIX}")
            if not MESSAGE_FORM.search(rule.get("message", "")):
                problems.append(f"{name}: message cites none of the three owner forms")
    return problems


PARTIAL = re.compile(r"\s*\(partial: ([^()]*\S[^()]*)\)\s*$")
CODE = r"`[A-Z]+[0-9]*`"
TOOL_SHAPES = (  # (tool, shape of the value after the optional partial is cut off)
    ("ruff", re.compile(rf"Ruff {CODE}(?:(?:, | ){CODE})*")),
    ("import-linter", re.compile(r"import-linter,? [A-Za-z][A-Za-z ,-]*")),
    ("semgrep", re.compile(r"Semgrep `mfy-[a-z0-9-]+`")),
    ("ls-lint", re.compile(r"ls-lint")),
    ("make", re.compile(r"make `[a-z0-9_.-]+`")),
)
REVIEW_ONLY = re.compile(r"review only, because (.+)")
MIN_REASON_WORDS = 3


def split_values(value):
    """Split on `;` outside parentheses, so a `;` inside `(partial: ...)` stays."""
    parts, depth, start = [], 0, 0
    for i, char in enumerate(value):
        depth += (char == "(") - (char == ")")
        if char == ";" and depth == 0:
            parts.append(value[start:i])
            start = i + 1
    return [*parts, value[start:]]


def parse_part(part):
    part = part.strip()
    partial = PARTIAL.search(part)
    if partial:
        part = part[:partial.start()].strip()
    partial = partial.group(1).strip() if partial else None
    review = REVIEW_ONLY.fullmatch(part)
    if review:
        if partial or len(review.group(1).split()) < MIN_REASON_WORDS:
            raise ValueError(f"review only needs a reason of {MIN_REASON_WORDS} words and no partial: {part!r}")
        return {"tool": "review", "refs": [], "partial": None}
    for tool, shape in TOOL_SHAPES:
        if shape.fullmatch(part):
            return {"tool": tool, "refs": re.findall(r"`([^`]+)`", part) if tool != "import-linter" else [],
                    "partial": partial}
    raise ValueError(f"not a Checked by value: {part!r}")


def parse_checked_by(value):
    """Parse a "Checked by" value into one dict per checker; ValueError names what is wrong."""
    parts = [parse_part(p) for p in split_values(value)]
    if len(parts) > 1 and any(p["tool"] == "review" for p in parts):
        raise ValueError(f"review only is never joined to a tool: {value!r}")
    return parts


def catalogue_values(text):
    """(label, value) of every table row under a `Checked by` column and every `*Checked by:*` suffix."""
    found, in_table = [], False
    for line in text.splitlines():
        if line.startswith("|"):
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if cells[-1] == "Checked by":
                in_table = True
            elif in_table and not set("".join(cells)) <= set("-: "):
                found.append((cells[0].strip("`"), cells[-1]))
            continue
        in_table = False
        if "*Checked by:*" in line:
            label, value = line.split("*Checked by:*", 1)
            found.append((label.strip(), value.strip()))
    return found


def semgrep_rule_ids(semgrep_dir):
    """Rule ids of the gating and report-only folders (the suppressions rule is not named by a value)."""
    return {rule["id"] for folder in ("rules", "report-only") for f in (semgrep_dir / folder).glob("*.yaml")
            for rule in yaml.safe_load(f.read_text(encoding="utf-8"))["rules"]}


def ruff_select(toml_text):
    return tomllib.loads(toml_text)["lint"]["select"]


def ruff_covers(select, code):
    """A letters-only selector is a linter (`DTZ`, `E`), `PL` is the umbrella of the four Pylint
    linters (`PLC`, `PLE`, `PLR`, `PLW`) and `ALL` is everything; one with digits is a code prefix."""
    letters = code.rstrip("0123456789")
    return any(code.startswith(s) if s != s.rstrip("0123456789")
               else s == "ALL" or letters == s or (s == "PL" and letters.startswith("PL"))
               for s in select)


def cross_check_problems(values, semgrep_dir, select, make_targets):
    ids, named, problems = semgrep_rule_ids(semgrep_dir), set(), []
    for entry_name, value in values.items():
        try:
            parts = parse_checked_by(value)
        except ValueError as error:
            problems.append(f"{entry_name}: {error}")
            continue
        for part in parts:
            for ref in part["refs"]:
                if part["tool"] == "semgrep":
                    named.add(ref)
                if part["tool"] == "semgrep" and ref not in ids:
                    problems.append(f"{entry_name}: Semgrep rule {ref} has no rule file")
                if part["tool"] == "ruff" and not ruff_covers(select, ref):
                    problems.append(f"{entry_name}: Ruff code {ref} is not in the template's select")
                if part["tool"] == "make" and ref not in make_targets:
                    problems.append(f"{entry_name}: make target {ref} is not in Makefile.tmpl")
    return problems + [f"{rule_id}: no Checked by value names this rule" for rule_id in sorted(ids - named)]


def _join_continuations(text):
    return text.replace("\\\n", " ")


def makefile_phony(text):
    return {t for m in re.finditer(r"^\.PHONY\s*:(.*)$", _join_continuations(text), re.M)
            for t in m.group(1).split()}


def makefile_targets(text):
    names = set()
    for m in re.finditer(r"^([^\s#:=.%][^:=#]*?)\s*:(?![:=])", _join_continuations(text), re.M):
        names |= set(m.group(1).split())
    return names


def missing_required_targets(required, makefile_text):
    present = makefile_targets(makefile_text) & makefile_phony(makefile_text)
    return [t for t in required if t not in present]


MANIFEST_FIELDS = ("id", "repo", "commit", "paths", "licence", "why", "mode")
PLAIN_PATH = re.compile(r"[A-Za-z0-9_./-]+")


def manifest_problems(entries):
    if not isinstance(entries, list):
        return ["manifest: must be a list of entries"]
    modes = load_script().MODES  # one list of modes: the script's
    problems, seen = [], set()
    for i, e in enumerate(entries):
        if not isinstance(e, dict):
            problems.append(f"entry {i}: must be an object")
            continue
        who = e["id"] if isinstance(e.get("id"), str) and e["id"] else f"entry {i}"
        problems += [f"{who}: missing field {f}" for f in MANIFEST_FIELDS if f not in e]
        problems += [f"{who}: unknown field {f}" for f in e if f not in MANIFEST_FIELDS]
        problems += [f"{who}: {f} must be a non-empty string"
                     for f in ("id", "repo", "licence", "why") if f in e and not (e[f] and isinstance(e[f], str))]
        if isinstance(e.get("id"), str) and e["id"] and not re.fullmatch(r"[a-z0-9-]+", e["id"]):
            problems.append(f"{who}: id must match [a-z0-9-]+")
        if isinstance(e.get("repo"), str) and e["repo"] and not e["repo"].startswith("https://"):
            problems.append(f"{who}: repo must start with https://")
        if "commit" in e and not (isinstance(e["commit"], str) and re.fullmatch(r"[0-9a-f]{40}", e["commit"])):
            problems.append(f"{who}: commit must be 40 lower-case hex characters")
        if "mode" in e and e["mode"] not in modes:
            problems.append(f"{who}: mode must be one of {', '.join(modes)}")
        paths = e.get("paths", [])
        if "paths" in e and not (isinstance(paths, list) and paths and all(
                isinstance(p, str) and PLAIN_PATH.fullmatch(p) and not p.startswith("/")
                and ".." not in p.split("/") for p in paths)):
            problems.append(f"{who}: paths must be a non-empty list of plain relative paths")
        if isinstance(e.get("id"), str):
            if e["id"] in seen:
                problems.append(f"{who}: duplicate id")
            seen.add(e["id"])
    return problems


def ruff_expectations(text):
    """{(row, code)} from the `# expect: CODE[, CODE]` marks of a Ruff fixture."""
    return {(row, code) for row, line in enumerate(text.splitlines(), 1)
            for m in [re.search(r"#\s*expect:\s*([A-Z0-9, ]+)", line)] if m
            for code in re.split(r"[,\s]+", m.group(1).strip())}


def render_placeholders(text):
    return re.sub(r"<<[A-Z_]+>>", "pkg", text.replace("<<PYTHON_VERSION_NODOT>>", "312"))


# --- Test builders -----------------------------------------------------------------------------

def rule_yaml(rule_id="mfy-x", message="a thing (cosmic-python:AP-DICT-AS-MODEL)"):
    return yaml.safe_dump({"rules": [{"id": rule_id, "message": message, "severity": "ERROR",
                                      "languages": ["python"], "pattern": "foo()"}]})


def write_rule(folder, name, fixture="# ruleid: mfy-x\nfoo()\n# ok: mfy-x\nbar()\n", **kw):
    folder.mkdir(parents=True, exist_ok=True)
    (folder / f"{name}.yaml").write_text(rule_yaml(**kw))
    if fixture is not None:
        (folder / f"{name}.py").write_text(fixture)


# --- TC-03 fixture presence, marks, id prefix, message form -----------------------------------

@pytest.mark.parametrize("folder", SEMGREP_FOLDERS)
def test_semgrep_folder_rules_have_fixtures_marks_and_message_form(folder):
    assert fixture_problems(SEMGREP / folder) == []


def test_good_rule_has_no_problem(tmp_path):
    write_rule(tmp_path, "mfy-x")
    assert fixture_problems(tmp_path) == []


@pytest.mark.parametrize("message", [
    "x (cosmic-python:AP-SPARQL-FROM-STRINGS)",
    "x (cosmic-python:testing-checklist#12)",
    "x (project-setup:config-files#suppressions)"])
def test_each_message_form_is_accepted(tmp_path, message):
    write_rule(tmp_path, "mfy-x", message=message)
    assert fixture_problems(tmp_path) == []


@pytest.mark.parametrize("case, kwargs, needle", [
    ("no fixture", {"fixture": None}, "no fixture"),
    ("ruleid only", {"fixture": "# ruleid: mfy-x\nfoo()\n"}, "ok:"),
    ("ok only", {"fixture": "# ok: mfy-x\nbar()\n"}, "ruleid:"),
    ("id without prefix", {"rule_id": "x"}, "mfy-"),
    ("no message form", {"message": "avoid foo"}, "message"),
    ("an unknown owner", {"message": "x (cosmic-python:testing-checklist)"}, "message"),
])
def test_fixture_problem_is_named(tmp_path, case, kwargs, needle):
    write_rule(tmp_path, "mfy-x", **kwargs)
    problems = fixture_problems(tmp_path)
    assert problems, case
    assert all("mfy-x" in p for p in problems), problems
    assert any(needle in p for p in problems), problems


def test_a_missing_folder_is_a_problem(tmp_path):
    assert fixture_problems(tmp_path / "nowhere")


# --- TC-04 the "Checked by" parser -------------------------------------------------------------

@pytest.mark.parametrize("value, tool, refs", [
    ("Ruff `PLR2004`", "ruff", ["PLR2004"]),
    ("Ruff `C901`, `PLR0912`, `PLR0913`", "ruff", ["C901", "PLR0912", "PLR0913"]),
    ("Ruff `C901` `PLR0912`", "ruff", ["C901", "PLR0912"]),
    ("import-linter, the tier and layer contracts", "import-linter", []),
    ("import-linter a forbidden contract", "import-linter", []),
    ("Semgrep `mfy-test-real-sleep`", "semgrep", ["mfy-test-real-sleep"]),
    ("ls-lint", "ls-lint", []),
    ("make `test`", "make", ["test"]),
    ("make `clean-code`", "make", ["clean-code"]),
])
def test_one_tool_value_parses(value, tool, refs):
    parsed = parse_checked_by(value)
    assert [(p["tool"], p["refs"]) for p in parsed] == [(tool, refs)]


def test_review_only_with_three_word_reason_parses():
    parsed = parse_checked_by("review only, because duplication across files needs a reader")
    assert [p["tool"] for p in parsed] == ["review"]


def test_partial_is_kept_on_its_tool():
    parsed = parse_checked_by("Semgrep `mfy-free-string-key` (partial: report-only)")
    assert parsed[0]["tool"] == "semgrep" and parsed[0]["partial"] == "report-only"


def test_values_joined_by_semicolon_parse_each():
    value = ("Ruff `PLR2004`; Semgrep `mfy-free-string-key` "
             "(partial: subscripts and attribute names are report-only)")
    parsed = parse_checked_by(value)
    assert [p["tool"] for p in parsed] == ["ruff", "semgrep"]
    assert parsed[0]["partial"] is None and "subscripts" in parsed[1]["partial"]


def test_a_semicolon_inside_a_partial_does_not_split():
    parsed = parse_checked_by("ls-lint (partial: names; the rest is read)")
    assert len(parsed) == 1 and parsed[0]["partial"] == "names; the rest is read"


@pytest.mark.parametrize("value, why", [
    ("", "empty"),
    ("   ", "blank"),
    ("review only", "no reason"),
    ("review only, because too short", "reason under three words"),
    ("review only, because it is a judgement; Ruff `E501`", "review only joined to a tool"),
    ("Ruff `E501`; review only, because it is a judgement", "review only joined to a tool"),
    ("review only, because it is a judgement (partial: none)", "partial on review only"),
    ("Ruff", "Ruff without a code"),
    ("Ruff PLR2004", "code not in backticks"),
    ("Semgrep", "Semgrep without an id"),
    ("Semgrep `no-prefix`", "not an mfy id"),
    ("make test", "target not in backticks"),
    ("make", "make without a target"),
    ("import-linter", "no contract kind in words"),
    ("Pylint `C0114`", "unknown tool"),
    ("Ruff `E501` (see above)", "a parenthesis that is not a partial"),
    ("Ruff `E501` (partial: )", "empty partial"),
    ("Ruff `E501`;", "empty part"),
])
def test_unparsable_value_is_refused(value, why):
    with pytest.raises(ValueError):
        parse_checked_by(value)


def test_catalogue_values_are_read_from_table_rows_and_suffixes():
    text = ("| ID | Rule | Checked by |\n|---|---|---|\n| `AP-X` | a | Ruff `E501` |\n"
            "| `AP-Y` | b |  |\n\nNot a table row.\n"
            "3. A checklist item. *Checked by:* review only, because it needs a reader\n"
            "- A bullet *Checked by:* ls-lint\n")
    assert catalogue_values(text) == [
        ("AP-X", "Ruff `E501`"), ("AP-Y", ""),
        ("3. A checklist item.", "review only, because it needs a reader"),
        ("- A bullet", "ls-lint")]


@pytest.mark.skip(reason="switched on by task 1.12")
def test_the_live_catalogue_values_all_parse():
    sources = [COSMIC / "references/principles-and-anti-patterns.md",
               COSMIC / "references/testing-checklist.md", COSMIC / "SKILL.md"]
    values = [v for s in sources for v in catalogue_values(s.read_text(encoding="utf-8"))]
    assert values
    for label, value in values:
        parse_checked_by(value)  # raises, and pytest names the entry through `label` below
        assert label


# --- TC-05 the cross-checks --------------------------------------------------------------------

def make_semgrep_dir(tmp_path, gating=("mfy-a",), report=(), suppress=("mfy-suppress",)):
    for folder, ids in (("rules", gating), ("report-only", report), ("suppressions", suppress)):
        for rule_id in ids:
            write_rule(tmp_path / folder, rule_id, rule_id=rule_id,
                       fixture=f"# ruleid: {rule_id}\nfoo()\n# ok: {rule_id}\nbar()\n")
    return tmp_path


def problems_for(tmp_path, values, select=("E", "DTZ", "PLR2004"), targets=("test",), **dirs):
    semgrep = make_semgrep_dir(tmp_path, **dirs)
    return cross_check_problems(values, semgrep, list(select), set(targets))


def test_a_consistent_set_has_no_problem(tmp_path):
    values = {"AP-A": "Semgrep `mfy-a`", "AP-B": "Ruff `E722`", "AP-C": "make `test`"}
    assert problems_for(tmp_path, values) == []


def test_a_semgrep_id_with_no_rule_file_is_named(tmp_path):
    problems = problems_for(tmp_path, {"AP-A": "Semgrep `mfy-a`", "AP-B": "Semgrep `mfy-gone`"})
    assert any("AP-B" in p and "mfy-gone" in p for p in problems), problems


def test_a_gating_or_report_only_rule_no_value_names_is_named(tmp_path):
    values = {"AP-A": "Semgrep `mfy-a`"}
    problems = problems_for(tmp_path, values, gating=("mfy-a", "mfy-orphan"), report=("mfy-quiet",))
    assert any("mfy-orphan" in p for p in problems), problems
    assert any("mfy-quiet" in p for p in problems), problems


def test_the_suppressions_rule_need_not_be_named(tmp_path):
    problems = problems_for(tmp_path, {"AP-A": "Semgrep `mfy-a`"}, suppress=("mfy-suppress",))
    assert all("mfy-suppress" not in p for p in problems), problems


def test_a_report_only_rule_may_be_named(tmp_path):
    values = {"AP-A": "Semgrep `mfy-a`", "AP-B": "Semgrep `mfy-q` (partial: report-only)"}
    assert problems_for(tmp_path, values, report=("mfy-q",)) == []


def test_a_ruff_family_covers_a_code_of_the_family(tmp_path):
    assert problems_for(tmp_path, {"AP-A": "Semgrep `mfy-a`", "AP-B": "Ruff `DTZ005`"}) == []


def test_an_unselected_ruff_code_is_named(tmp_path):
    problems = problems_for(tmp_path, {"AP-A": "Semgrep `mfy-a`", "AP-B": "Ruff `S113`"})
    assert any("AP-B" in p and "S113" in p for p in problems), problems


def test_a_make_target_not_in_the_template_is_named(tmp_path):
    problems = problems_for(tmp_path, {"AP-A": "Semgrep `mfy-a`", "AP-B": "make `clean-code`"})
    assert any("AP-B" in p and "clean-code" in p for p in problems), problems


def test_an_unparsable_value_is_named_with_its_entry(tmp_path):
    problems = problems_for(tmp_path, {"AP-A": "Semgrep `mfy-a`", "AP-B": ""})
    assert any("AP-B" in p for p in problems), problems


def test_ruff_selection_is_read_from_the_template_text():
    select = ruff_select("[lint]\nselect = [\n  \"E\",  # a\n  \"DTZ\",\n]\n")
    assert select == ["E", "DTZ"]


def test_makefile_targets_and_phony_are_read():
    text = ".PHONY: a b\nc d: ## doc\n\techo\n.PHONY: e\na: x\nb:\ne:\n"
    assert makefile_phony(text) == {"a", "b", "e"}
    assert {"a", "b", "e"} <= makefile_targets(text)


@pytest.mark.skip(reason="switched on by task 1.12")
def test_the_live_catalogue_names_only_real_checkers():
    sources = [COSMIC / "references/principles-and-anti-patterns.md",
               COSMIC / "references/testing-checklist.md", COSMIC / "SKILL.md"]
    values = dict(v for s in sources for v in catalogue_values(s.read_text(encoding="utf-8")))
    select = ruff_select(RUFF_TMPL.read_text(encoding="utf-8"))
    assert cross_check_problems(values, SEMGREP, select, makefile_targets(MAKEFILE_TMPL.read_text())) == []


# --- TC-06 the manifest of external sources ----------------------------------------------------

COMMIT = "a" * 40


def entry(**changes):
    base = {"id": "src", "repo": "https://github.com/o/r", "commit": COMMIT, "paths": ["p"],
            "licence": "MIT", "why": "a reason", "mode": "report-only"}
    return {**base, **changes}


def test_the_live_manifest_is_valid():
    assert manifest_problems(json.loads(MANIFEST.read_text(encoding="utf-8"))) == []


def test_empty_manifest_passes():
    assert manifest_problems([]) == []


@pytest.mark.parametrize("mode", ["gate", "report-only"])
def test_each_mode_passes(mode):
    assert manifest_problems([entry(mode=mode)]) == []


@pytest.mark.parametrize("changes, field", [
    ({"commit": "a" * 39}, "commit"),
    ({"commit": "a" * 41}, "commit"),
    ({"commit": "G" * 40}, "commit"),
    ({"commit": "A" * 40}, "commit"),
    ({"mode": "block"}, "mode"),
    ({"paths": []}, "paths"),
    ({"paths": "p"}, "paths"),
    ({"licence": ""}, "licence"),
    ({"why": ""}, "why"),
    ({"repo": ""}, "repo"),
])
def test_a_wrong_field_names_the_entry_and_the_field(changes, field):
    problems = manifest_problems([entry(id="the-entry", **changes)])
    assert problems, changes
    assert any(field in p for p in problems), problems
    assert all("the-entry" in p for p in problems), problems


def test_an_empty_id_is_named():
    assert any("id" in p for p in manifest_problems([entry(id="")]))


def test_a_missing_field_is_named():
    e = entry(id="the-entry")
    del e["licence"]
    problems = manifest_problems([e])
    assert any("the-entry" in p and "licence" in p for p in problems), problems


def test_an_unknown_field_and_a_duplicate_id_are_named():
    problems = manifest_problems([entry(extra=1), entry()])
    assert any("extra" in p for p in problems), problems
    assert any("duplicate" in p for p in problems), problems


def test_a_manifest_that_is_not_a_list_is_refused():
    assert manifest_problems({"id": "x"})


# --- TC-10 the required targets ---------------------------------------------------------------

def required_targets(ini):
    parser = ConfigParser()
    parser.read(ini, encoding="utf-8")
    return [t.strip() for t in parser["minphony"]["required"].split(",") if t.strip()]


def test_every_required_target_is_a_phony_target_of_the_template():
    required = required_targets(CHECKMAKE_INI)
    assert required
    assert missing_required_targets(required, MAKEFILE_TMPL.read_text(encoding="utf-8")) == []


def test_a_renamed_or_unphony_target_is_missing():
    text = ".PHONY: lint test\nlint:\ntest-all:\n"
    assert missing_required_targets(["lint", "test"], text) == ["test"]
    assert missing_required_targets(["lint"], "lint:\n") == ["lint"]  # present but not phony


# --- TC-12 the gap rows (switched on by task 3.7, D-17) ----------------------------------------

@pytest.mark.skip(reason="switched on by task 3.7")
def test_no_gap_row_names_this_epic_after_stage_3():
    rows = (ROOT / "skills/test-strategy/references/software.md").read_text(encoding="utf-8").splitlines()
    assert [r for r in rows if r.startswith("|") and r.rstrip().endswith("gap → B |")] == []


# --- TC-13 the Ruff fixtures under the template's selection (needs ruff) -----------------------

@pytest.fixture(scope="module")
def ruff_findings(tmp_path_factory):
    work = tmp_path_factory.mktemp("ruff")
    config = work / "ruff.toml"
    config.write_text(render_placeholders(RUFF_TMPL.read_text(encoding="utf-8")))
    for source in (FIX / "ruff").glob("*.py"):
        shutil.copy(source, work / source.name)
    result = subprocess.run(["ruff", "check", "--config", str(config), "--no-cache",
                             "--output-format", "json", str(work)],
                            capture_output=True, text=True, timeout=120)
    assert result.returncode in (0, 1), result.stderr
    found = {}
    for finding in json.loads(result.stdout):
        found.setdefault(Path(finding["filename"]).name, set()).add(
            (finding["location"]["row"], finding["code"]))
    return found


@needs_ruff
@pytest.mark.parametrize("name", ["bad.py", "catalogue_bad.py"])
def test_each_bad_case_is_flagged_by_its_code(ruff_findings, name):
    expected = ruff_expectations((FIX / "ruff" / name).read_text(encoding="utf-8"))
    assert expected
    assert expected - ruff_findings.get(name, set()) == set()


@needs_ruff
def test_good_case_is_silent(ruff_findings):
    assert ruff_findings.get("good.py", set()) == set()


def test_ruff_expectations_are_read_from_marks():
    assert ruff_expectations("a\nb()  # expect: S113\nc()  # expect: DTZ005, E722\n") == {
        (2, "S113"), (3, "DTZ005"), (3, "E722")}


# --- IT-01 Semgrep rule tests (needs semgrep) --------------------------------------------------

@needs_semgrep
@pytest.mark.parametrize("folder", SEMGREP_FOLDERS)
def test_semgrep_rule_fixtures_pass(folder):
    assert (SEMGREP / folder).is_dir()
    result = subprocess.run(["semgrep", "scan", "--test", "--metrics=off", str(SEMGREP / folder)],
                            capture_output=True, text=True, timeout=600)
    assert result.returncode == 0, result.stdout + result.stderr


# --- IT-02 ls-lint on trees (needs ls-lint) ----------------------------------------------------

def run_lslint(tree):
    return subprocess.run(["ls-lint", "-config", str(LSLINT_CONFIG), "-workdir", str(tree)],
                          capture_output=True, text=True, timeout=120)


@needs_lslint
def test_lslint_accepts_the_good_tree():
    result = run_lslint(FIX / "ls-lint/good")
    assert result.returncode == 0, result.stdout + result.stderr


@needs_lslint
def test_lslint_names_both_banned_files_in_the_bad_tree():
    result = run_lslint(FIX / "ls-lint/bad")
    assert result.returncode != 0
    output = result.stdout + result.stderr
    assert "pkg/utils.py" in output and "tests/helpers.py" in output


# --- IT-03 checkmake on the rendered template (needs checkmake) --------------------------------

def run_checkmake(tmp_path, text):
    (tmp_path / "Makefile").write_text(text)
    return subprocess.run(["checkmake", "--config", str(CHECKMAKE_INI), "Makefile"],
                          cwd=tmp_path, capture_output=True, text=True, timeout=120)


@needs_checkmake
def test_checkmake_accepts_the_rendered_template(tmp_path):
    result = run_checkmake(tmp_path, render_placeholders(MAKEFILE_TMPL.read_text(encoding="utf-8")))
    assert result.returncode == 0, result.stdout + result.stderr


@needs_checkmake
def test_checkmake_rejects_the_template_without_test(tmp_path):
    text = render_placeholders(MAKEFILE_TMPL.read_text(encoding="utf-8"))
    # Renaming the target everywhere leaves the template whole but without a `test` target.
    text = re.sub(r"(?<![\w-])test(?![\w-])", "test-all", text)
    result = run_checkmake(tmp_path, text)
    assert result.returncode != 0, result.stdout + result.stderr
    assert "test" in result.stdout + result.stderr  # the missing target is named


# --- TC-09 external_sources.py (the template, loaded by path) ----------------------------------

def load_script():
    spec = importlib.util.spec_from_file_location("external_sources", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def archive(files):
    """A GitHub-style archive: everything sits under one top folder named <repo>-<commit>."""
    buffer = BytesIO()
    with tarfile.open(fileobj=buffer, mode="w:gz") as tar:
        for name, content in files.items():
            data = content.encode()
            info = tarfile.TarInfo(f"repo-{COMMIT}/{name}")
            info.size = len(data)
            tar.addfile(info, BytesIO(data))
    return buffer.getvalue()


class FakeDownload:
    def __init__(self, fail=False):
        self.urls, self.fail = [], fail

    def __call__(self, url):
        self.urls.append(url)
        if self.fail:
            raise OSError("no network")
        return archive({"python/requests/rule.yaml": "rules: []\n", "README.md": "x"})


def project(tmp_path, monkeypatch, entries):
    monkeypatch.chdir(tmp_path)
    (tmp_path / ".quality/semgrep").mkdir(parents=True)
    (tmp_path / ".quality/semgrep/external.json").write_text(json.dumps(entries))
    return tmp_path


def test_fetch_downloads_the_archive_of_the_pinned_commit_and_unpacks_it_whole(tmp_path, monkeypatch, capsys):
    project(tmp_path, monkeypatch, [entry(id="one")])
    download = FakeDownload()
    assert load_script().main(["fetch"], download=download) == 0
    assert download.urls == [f"https://github.com/o/r/archive/{COMMIT}.tar.gz"]
    assert (tmp_path / ".quality/external/one/python/requests/rule.yaml").is_file()
    assert (tmp_path / ".quality/external/one/README.md").is_file()
    assert capsys.readouterr().out.splitlines() == ["fetched one"]
    assert [p.name for p in (tmp_path / ".quality/external").iterdir()] == ["one"]


def test_fetch_takes_only_the_absent_source(tmp_path, monkeypatch, capsys):
    project(tmp_path, monkeypatch, [entry(id="there"), entry(id="absent")])
    (tmp_path / ".quality/external/there").mkdir(parents=True)
    (tmp_path / ".quality/external/there/fetched.txt").write_text("x")
    download = FakeDownload()
    assert load_script().main(["fetch"], download=download) == 0
    assert len(download.urls) == 1
    assert capsys.readouterr().out.splitlines() == ["fetched absent"]
    assert [p.name for p in (tmp_path / ".quality/external/there").iterdir()] == ["fetched.txt"]


def test_fetch_with_everything_present_downloads_nothing(tmp_path, monkeypatch, capsys):
    project(tmp_path, monkeypatch, [entry(id="there")])
    (tmp_path / ".quality/external/there").mkdir(parents=True)
    (tmp_path / ".quality/external/there/fetched.txt").write_text("x")
    download = FakeDownload()
    assert load_script().main(["fetch"], download=download) == 0
    assert download.urls == [] and capsys.readouterr().out == ""


def test_fetch_on_an_empty_manifest_succeeds_quietly(tmp_path, monkeypatch, capsys):
    project(tmp_path, monkeypatch, [])
    assert load_script().main(["fetch"], download=FakeDownload()) == 0
    assert capsys.readouterr().out == ""


def test_a_failed_download_exits_1_and_leaves_nothing_behind(tmp_path, monkeypatch, capsys):
    project(tmp_path, monkeypatch, [entry(id="one")])
    assert load_script().main(["fetch"], download=FakeDownload(fail=True)) == 1
    captured = capsys.readouterr()
    assert "one" in captured.err and captured.out == ""
    external = tmp_path / ".quality/external"
    assert not external.exists() or list(external.iterdir()) == []


def test_an_archive_that_escapes_its_folder_is_refused(tmp_path, monkeypatch):
    project(tmp_path, monkeypatch, [entry(id="one")])
    buffer = BytesIO()
    with tarfile.open(fileobj=buffer, mode="w:gz") as tar:
        info = tarfile.TarInfo("../escape.txt")
        info.size = 1
        tar.addfile(info, BytesIO(b"x"))
    assert load_script().main(["fetch"], download=lambda url: buffer.getvalue()) == 1
    assert not (tmp_path / ".quality/escape.txt").exists()
    assert not (tmp_path / ".quality/external/one").exists()


def test_paths_prints_one_line_for_the_asked_mode(tmp_path, monkeypatch, capsys):
    project(tmp_path, monkeypatch, [
        entry(id="a", mode="gate", paths=["x/y", "z"]),
        entry(id="b", mode="report-only", paths=["q"]),
        entry(id="c", mode="gate", paths=["w"])])
    script = load_script()
    assert script.main(["paths", "gate"]) == 0
    gate = capsys.readouterr().out
    assert gate == ("--config .quality/external/a/x/y --config .quality/external/a/z "
                    "--config .quality/external/c/w\n")
    assert script.main(["paths", "report-only"]) == 0
    assert capsys.readouterr().out == "--config .quality/external/b/q\n"


def test_paths_prints_an_empty_line_when_there_is_none(tmp_path, monkeypatch, capsys):
    project(tmp_path, monkeypatch, [entry(id="b", mode="report-only")])
    assert load_script().main(["paths", "gate"]) == 0
    assert capsys.readouterr().out == "\n"


def test_paths_on_an_empty_manifest_prints_an_empty_line(tmp_path, monkeypatch, capsys):
    project(tmp_path, monkeypatch, [])
    assert load_script().main(["paths", "report-only"]) == 0
    assert capsys.readouterr().out == "\n"


def test_a_missing_manifest_exits_2_with_a_message(tmp_path, monkeypatch, capsys):
    monkeypatch.chdir(tmp_path)
    assert load_script().main(["paths", "gate"]) == 2
    assert "external.json" in capsys.readouterr().err


# --- TC-09 the manifest at the project boundary and the failure paths (design D-40) -------------

def run_main(tmp_path, monkeypatch, entries=None, raw=None, argv=("fetch",), download=None):
    monkeypatch.chdir(tmp_path)
    (tmp_path / ".quality/semgrep").mkdir(parents=True)
    (tmp_path / ".quality/semgrep/external.json").write_text(raw if raw is not None else json.dumps(entries))
    return load_script().main(list(argv), download=download or FakeDownload())


@pytest.mark.parametrize("raw", ["{not json", '{"id": "x"}', '["x"]', "[null]", '"text"'])
def test_a_manifest_of_the_wrong_shape_exits_2_with_a_message(tmp_path, monkeypatch, capsys, raw):
    assert run_main(tmp_path, monkeypatch, raw=raw) == 2
    err = capsys.readouterr().err
    assert "external.json" in err and "Traceback" not in err


@pytest.mark.parametrize("changes, field", [
    ({"repo": "http://github.com/o/r"}, "repo"),
    ({"repo": "git@github.com:o/r"}, "repo"),
    ({"id": "Up"}, "id"),
    ({"id": "../x"}, "id"),
    ({"id": "a/b"}, "id"),
    ({"id": ""}, "id"),
    ({"commit": "a" * 39}, "commit"),
    ({"commit": "A" * 40}, "commit"),
    ({"commit": 12}, "commit"),
    ({"paths": ["../etc"]}, "paths"),
    ({"paths": ["a/../b"]}, "paths"),
    ({"paths": ["/etc"]}, "paths"),
    ({"paths": ["a b"]}, "paths"),
    ({"paths": ["a;b"]}, "paths"),
    ({"paths": "p"}, "paths"),
    ({"paths": []}, "paths"),
    ({"mode": "block"}, "mode"),
])
@pytest.mark.parametrize("command", [("fetch",), ("paths", "gate")])
def test_an_invalid_entry_exits_2_naming_the_entry_and_the_field(tmp_path, monkeypatch, capsys, command,
                                                                   changes, field):
    download = FakeDownload()
    assert run_main(tmp_path, monkeypatch, [entry(**changes)], argv=command, download=download) == 2
    captured = capsys.readouterr()
    assert field in captured.err and "src" in captured.err or field == "id", captured.err
    assert download.urls == [] and captured.out == ""


def test_an_entry_missing_a_field_exits_2_naming_it(tmp_path, monkeypatch, capsys):
    e = entry()
    del e["mode"]
    assert run_main(tmp_path, monkeypatch, [e]) == 2
    assert "mode" in capsys.readouterr().err


@pytest.mark.parametrize("error", [EOFError("cut"), http.client.IncompleteRead(b"x"),
                                   http.client.RemoteDisconnected("gone")])
def test_a_cut_download_exits_1_and_leaves_nothing_behind(tmp_path, monkeypatch, capsys, error):
    def download(url):
        raise error
    assert run_main(tmp_path, monkeypatch, [entry(id="one")], download=download) == 1
    assert "one" in capsys.readouterr().err
    assert list((tmp_path / ".quality/external").iterdir()) == []


def test_a_source_folder_that_is_empty_is_fetched_again(tmp_path, monkeypatch, capsys):
    project(tmp_path, monkeypatch, [entry(id="one")])
    (tmp_path / ".quality/external/one").mkdir(parents=True)
    assert load_script().main(["fetch"], download=FakeDownload()) == 0
    assert (tmp_path / ".quality/external/one/README.md").is_file()
    assert capsys.readouterr().out.splitlines() == ["fetched one"]


def test_entries_sharing_a_repo_and_commit_download_once(tmp_path, monkeypatch):
    download = FakeDownload()
    assert run_main(tmp_path, monkeypatch, [entry(id="a"), entry(id="b"), entry(id="c", commit="b" * 40)],
                    download=download) == 0
    assert len(download.urls) == 2
    assert (tmp_path / ".quality/external/a/README.md").is_file()
    assert (tmp_path / ".quality/external/b/README.md").is_file()


def test_a_trailing_slash_on_the_repo_is_dropped(tmp_path, monkeypatch):
    download = FakeDownload()
    assert run_main(tmp_path, monkeypatch, [entry(repo="https://github.com/o/r/")], download=download) == 0
    assert download.urls == [f"https://github.com/o/r/archive/{COMMIT}.tar.gz"]


# --- TC-14 each tool version agrees across the files that name it (design D-40) -----------------

def _one(pattern, text):
    found = set(re.findall(pattern, text, re.M))
    assert len(found) == 1, (pattern, found)
    return found.pop()


def test_each_tool_version_agrees_across_files():
    make = MAKEFILE_TMPL.read_text(encoding="utf-8")
    shas = (TEMPLATES / "quality/tools.sha256").read_text(encoding="utf-8")
    requirements = (ROOT / "requirements-quality.txt").read_text(encoding="utf-8")
    ruff_pin = _one(r"^\s*\"ruff==([^\"]+)\"", (TEMPLATES / "root/pyproject.toml.tmpl").read_text(encoding="utf-8"))
    versions = {  # tool -> every version the files name
        "semgrep": {_one(r"^SEMGREP_VERSION\s*=\s*(\S+)", make), _one(r"^semgrep==(\S+)", requirements)},
        "ls-lint": {_one(r"^LS_LINT_VERSION\s*=\s*(\S+)", make),
                    *re.findall(r"  ls-lint-([\d.]+)-", shas)},
        "checkmake": {_one(r"^CHECKMAKE_VERSION\s*=\s*(\S+)", make),
                      *re.findall(r"  checkmake-([\d.]+)-", shas)},
        "ruff": {ruff_pin, _one(r"^ruff==(\S+)", requirements),
                 _one(r"rev:\s*v(\S+)", (TEMPLATES / "root/dot-pre-commit-config.yaml").read_text(encoding="utf-8"))},
    }
    registered = {d["name"].lower(): str(d["pin"]) for d in yaml.safe_load(
        (ROOT / "dependencies.yaml").read_text(encoding="utf-8"))
        if d["name"].lower() in versions and "pin" in d}
    for tool, pin in registered.items():
        versions[tool].add(pin)
    assert {t: v for t, v in versions.items() if len(v) != 1} == {}
