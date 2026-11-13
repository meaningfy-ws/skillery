"""Proof mechanics of the test-strategy skill (change `test-strategy`, design D-7).

Two checks run on the real tree and fail with the file and the id, question or fact:
inventory coverage (every `CHK-<n>` of `inventory.md` is cited by a matrix file, no matrix file
cites an undefined id, every family file has a row for each of the six questions) and one home per
fact (`vv-definition`, `test-data`, `tdd-loop` appear only where the allow-lists say).
Each check is a pure function (text in, error strings out), so the fixture cases run without
the real tree.
"""

import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
SKILLS = REPO / "skills"
REFERENCES = SKILLS / "test-strategy" / "references"

FAMILIES = [
    "software", "documentation", "devops", "ui", "shaping", "modelling", "architecture",
    "generic-writing",
]
CROSS_CUTTING = "cross-cutting"
QUESTIONS = ["VAL", "VER", "ADQ", "ROB", "CLR", "RSK"]
CHK = re.compile(r"\bCHK-\d+\b")  # the token is matched whole: CHK-1 never matches inside CHK-12


# --- inventory coverage -------------------------------------------------------------------------

def question_rows(text: str) -> set[str]:
    """Question ids that open a table row (first cell, ignoring `*` and backticks)."""
    found = set()
    for line in text.splitlines():
        if line.lstrip().startswith("|"):
            first = line.strip().strip("|").split("|")[0].strip().strip("*`").strip()
            if first in QUESTIONS:
                found.add(first)
    return found


def coverage_errors(inventory: str | None, matrix: dict[str, str | None]) -> list[str]:
    """`matrix` maps a file name (`software.md`) to its text, or None when the file is missing."""
    if inventory is None:
        return ["references/inventory.md is missing"]
    defined = set(CHK.findall(inventory))
    errors, cited = [], set()
    for name, text in matrix.items():
        if text is None:
            errors.append(f"references/{name} is missing")
            continue
        ids = set(CHK.findall(text))
        cited |= ids
        errors += [f"{name} cites {i}, which inventory.md does not define" for i in sorted(ids - defined)]
        if name != f"{CROSS_CUTTING}.md":
            errors += [f"{name} has no row for question {q}" for q in QUESTIONS if q not in question_rows(text)]
    errors += [f"inventory.md defines {i}, which no matrix file cites" for i in sorted(defined - cited)]
    return errors


# --- one home per fact --------------------------------------------------------------------------

VV = re.compile(r"(verification|validation) asks")
POLYFACTORY = re.compile(r"polyfactory")
TDD = re.compile(r"red\W{0,5}green")

CHECKLIST = "cosmic-python/references/testing-checklist.md"
DEPENDENCY_FILES = {
    "project-setup/assets/templates/root/pyproject.toml.tmpl",
    "project-setup/references/config-files.md",
    "project-setup/references/decisions.md",
}
POINTER_FILE = "project-setup/references/testing-setup.md"


def one_home_errors(rel: str, lines: list[str]) -> list[str]:
    """`rel` is the path under `skills/`, with forward slashes."""
    errors = []
    for number, raw in enumerate(lines, 1):
        line = raw.lower()
        where = f"{rel}:{number}"
        if VV.search(line) and rel != "test-strategy/SKILL.md":
            errors.append(f"{where}: vv-definition outside test-strategy/SKILL.md")
        if POLYFACTORY.search(line) and not _test_data_allowed(rel, line):
            errors.append(f"{where}: test-data rule (polyfactory) outside its home")
        if TDD.search(line) and "test-driven-development" not in line:
            errors.append(f"{where}: tdd-loop on a line not naming test-driven-development")
    return errors


def _test_data_allowed(rel: str, line: str) -> bool:
    if rel == CHECKLIST:
        return True
    if rel in DEPENDENCY_FILES:
        return "==" in line or "pytest" in line
    if rel == POINTER_FILE:
        return "testing-checklist" in line
    return False


def scan_skills(root: Path) -> list[str]:
    errors = []
    for path in sorted(p for p in root.rglob("*") if p.is_file()):
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except UnicodeDecodeError:
            continue  # a binary file
        errors += one_home_errors(path.relative_to(root).as_posix(), lines)
    return errors


# --- real-repo tests ----------------------------------------------------------------------------

def _read(path: Path) -> str | None:
    return path.read_text(encoding="utf-8") if path.is_file() else None


def test_real_repo_inventory_is_covered_by_the_matrix():
    names = [f"{n}.md" for n in FAMILIES + [CROSS_CUTTING]]
    errors = coverage_errors(
        _read(REFERENCES / "inventory.md"), {n: _read(REFERENCES / n) for n in names}
    )
    assert not errors, "\n".join(errors)


def test_real_repo_has_one_home_per_fact():
    errors = scan_skills(SKILLS)
    assert not errors, "\n".join(errors)


# --- fixture cases: pure functions, no real tree --------------------------------------------------

def _rows(*questions: str, cite: str = "") -> str:
    return "\n".join(f"| {q} | {cite} | skill |" for q in questions)


ALL_ROWS = _rows(*QUESTIONS, cite="CHK-1")


def _matrix(**overrides: str | None) -> dict[str, str | None]:
    base = {f"{n}.md": ALL_ROWS for n in FAMILIES}
    base[f"{CROSS_CUTTING}.md"] = ""
    return {**base, **{k.replace("_", "-") + ".md": v for k, v in overrides.items()}}


def test_coverage_passes_when_every_id_is_cited_and_every_question_has_a_row():
    assert coverage_errors("CHK-1 does a thing", _matrix()) == []


def test_coverage_names_an_uncited_id():
    assert coverage_errors("CHK-1\nCHK-7", _matrix()) == [
        "inventory.md defines CHK-7, which no matrix file cites"
    ]


def test_coverage_does_not_count_chk_1_as_cited_by_chk_12():
    matrix = {f"{n}.md": _rows(*QUESTIONS, cite="CHK-12") for n in FAMILIES}
    matrix[f"{CROSS_CUTTING}.md"] = ""
    errors = coverage_errors("CHK-1\nCHK-12", matrix)
    assert errors == ["inventory.md defines CHK-1, which no matrix file cites"]


def test_coverage_names_a_file_and_an_undefined_id():
    errors = coverage_errors("CHK-1", _matrix(software=ALL_ROWS + "\n| VAL | CHK-99 | x |"))
    assert errors == ["software.md cites CHK-99, which inventory.md does not define"]


def test_coverage_names_a_family_without_a_robustness_row():
    errors = coverage_errors("CHK-1", _matrix(devops=_rows("VAL", "VER", "ADQ", "CLR", "RSK", cite="CHK-1")))
    assert errors == ["devops.md has no row for question ROB"]


def test_coverage_exempts_cross_cutting_from_the_question_rule():
    assert coverage_errors("CHK-1", _matrix(cross_cutting="CHK-1")) == []


def test_coverage_names_a_missing_file():
    errors = coverage_errors("CHK-1", _matrix(ui=None))
    assert errors == ["references/ui.md is missing"]


def test_question_rows_accept_bold_and_backticks():
    assert question_rows("| **VAL** | x |\n| `VER` | y |\n| text VAL | z |") == {"VAL", "VER"}


CONFIG_FILES_WRAPPED = (
    "    pytest, pytest-bdd, pytest-cov, pytest-asyncio, testcontainers, polyfactory, httpx. `dev` ="
)


def test_one_home_passes_the_allowed_forms():
    skill = "test-strategy/SKILL.md"
    assert one_home_errors(skill, ["Validation asks: did we build the right thing?"]) == []
    for line in [
        "unit tests come from RED → GREEN → REFACTOR (`superpowers:test-driven-development`)",
        "the RED-GREEN loop is owned by superpowers:test-driven-development",
    ]:
        assert one_home_errors("x/SKILL.md", [line]) == []
    assert one_home_errors("project-setup/assets/templates/root/pyproject.toml.tmpl",
                           ['    "polyfactory==3.3.0",']) == []
    assert one_home_errors("project-setup/references/config-files.md", [CONFIG_FILES_WRAPPED]) == []
    assert one_home_errors(CHECKLIST, ["Use Polyfactory factories."]) == []
    assert one_home_errors("project-setup/references/testing-setup.md",
                           ["Test data: see testing-checklist.md (polyfactory)."]) == []


def test_one_home_fails_prose_and_names_file_line_and_fact():
    assert one_home_errors("a/SKILL.md", ["ok", "Use polyfactory to build objects."]) == [
        "a/SKILL.md:2: test-data rule (polyfactory) outside its home"
    ]
    assert one_home_errors("a/SKILL.md", ["Verification asks if we built it right."]) == [
        "a/SKILL.md:1: vv-definition outside test-strategy/SKILL.md"
    ]
    assert one_home_errors("a/SKILL.md", ["unit tests come from the RED-GREEN loop."]) == [
        "a/SKILL.md:1: tdd-loop on a line not naming test-driven-development"
    ]
    assert one_home_errors("project-setup/references/decisions.md", ["we like polyfactory"]) != []
    assert one_home_errors("project-setup/references/testing-setup.md", ["polyfactory for models"]) != []
