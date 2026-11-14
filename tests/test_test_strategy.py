"""Proof mechanics of the test-strategy skill (change `test-strategy`, design D-7).

Three checks run on the real tree and fail with the file and the id, question or fact:
inventory coverage (every `CHK-<n>` of `inventory.md` is cited by a matrix file, no matrix file
cites an undefined id, every family file has a row for each of the six questions), one home per
fact (`vv-definition`, `test-data`, `tdd-loop` appear only where the allow-lists say) and the
pointer lines (each skill that owns a matrix row carries one pointer naming exactly its questions
and files, design D-8 and D-15).
Each check is a pure function (text in, error strings out), so the fixture cases run without
the real tree.
"""

import re
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[1]
SKILLS = REPO / "skills"
REFERENCES = SKILLS / "test-strategy" / "references"

SKILL_FILE = "test-strategy/SKILL.md"
INVENTORY = "inventory.md"
FAMILIES = [
    "software", "documentation", "devops", "ui", "shaping", "modelling", "architecture",
    "generic-writing",
]
CROSS_CUTTING = "cross-cutting"
QUESTIONS = ["VAL", "VER", "ADQ", "ROB", "CLR", "RSK"]
CHK = re.compile(r"\bCHK-\d+\b")  # the token is matched whole: CHK-1 never matches inside CHK-12
SEPARATOR_CELL = re.compile(r"^:?-+:?$")


# --- inventory coverage -------------------------------------------------------------------------

def rows(text: str) -> list[list[str]]:
    """The cells of each table row; header rows and separator rows are left out."""
    table = [
        [cell.strip() for cell in line.strip().strip("|").split("|")]
        for line in text.splitlines()
        if line.lstrip().startswith("|")
    ]
    is_separator = [all(SEPARATOR_CELL.match(c) for c in cells) for cells in table]
    return [
        cells for i, cells in enumerate(table)
        if not is_separator[i] and not (i + 1 < len(table) and is_separator[i + 1])
    ]


def question_rows(text: str) -> set[str]:
    """Question ids that open a table row (first cell, ignoring `*` and backticks)."""
    firsts = {cells[0].strip("*`").strip() for cells in rows(text)}
    return firsts & set(QUESTIONS)


def coverage_errors(inventory: str | None, matrix: dict[str, str | None]) -> list[str]:
    """`matrix` maps a file name (`software.md`) to its text, or None when the file is missing."""
    if inventory is None:
        return [f"references/{INVENTORY} is missing"]
    defined = set(CHK.findall(inventory))
    errors, cited = [], set()
    for name, text in matrix.items():
        if text is None:
            errors.append(f"references/{name} is missing")
            continue
        ids = set(CHK.findall(text))
        cited |= ids
        errors += [f"{name} cites {i}, which {INVENTORY} does not define" for i in sorted(ids - defined)]
        if name != f"{CROSS_CUTTING}.md":
            errors += [f"{name} has no row for question {q}" for q in QUESTIONS if q not in question_rows(text)]
    errors += [f"{INVENTORY} defines {i}, which no matrix file cites" for i in sorted(defined - cited)]
    return errors


# --- one home per fact --------------------------------------------------------------------------

VV = re.compile(r"\b(verification|validation) asks")
POLYFACTORY = re.compile(r"polyfactory")
TDD = re.compile(r"\bred\W{0,5}green")

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
        if VV.search(line) and rel != SKILL_FILE:
            errors.append(f"{where}: vv-definition outside {SKILL_FILE}")
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
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue  # a binary file
        # split on \n only, as an editor counts lines: splitlines also breaks on form feed, U+2028 ...
        lines = [line.removesuffix("\r") for line in text.split("\n")]
        errors += one_home_errors(path.relative_to(root).as_posix(), lines)
    return errors


# --- pointer lines agree with the matrix (design D-8, D-15) -----------------------------------------

LINE_POINTER = re.compile(r"Answers `([^`]+)` in `test-strategy`'s matrix \(([^)]*)\)\.")
FOLDED_POINTER = re.compile(r"`test-strategy` \(answers `([^`]+)` in its matrix, ([^)]*)\)")
FILE_CITE = re.compile(r"`references/([\w-]+\.md)`")
OWNER_NAME = re.compile(r"^`([^`]+)`")
OWNER_COLUMN, STATUS_COLUMN, EXISTS = 2, 6, "exists"


def expected_pointers(matrix: dict[str, str], skills: set[str]) -> dict[str, tuple[set[str], set[str]]]:
    """Per skill folder owning an `exists` row: the question ids and the matrix files that cite it."""
    found: dict[str, tuple[set[str], set[str]]] = {}
    for name, text in matrix.items():
        for cells in rows(text):
            if len(cells) <= STATUS_COLUMN or cells[STATUS_COLUMN] != EXISTS:
                continue
            owner = OWNER_NAME.match(cells[OWNER_COLUMN])
            if owner and owner.group(1) in skills and owner.group(1) != "test-strategy":
                ids, files = found.setdefault(owner.group(1), (set(), set()))
                ids.add(cells[0])
                files.add(name)
    return found


def _differences(what: str, wanted: set[str], actual: set[str], order: list[str]) -> list[str]:
    def by_order(items: set[str]) -> list[str]:
        return sorted(items, key=lambda x: (order.index(x) if x in order else len(order), x))

    extra, missing = by_order(actual - wanted), by_order(wanted - actual)
    return ([f"names extra {what} {', '.join(extra)}"] if extra else []) + (
        [f"misses {what} {', '.join(missing)}"] if missing else []
    )


def pointer_errors(matrix: dict[str, str], skill_texts: dict[str, str]) -> list[str]:
    """`matrix` maps a file name to its text; `skill_texts` maps a skill folder to its SKILL.md text."""
    expected = expected_pointers(matrix, set(skill_texts))
    files_order = sorted(matrix)
    errors = []
    for skill, text in sorted(skill_texts.items()):
        pointers = LINE_POINTER.findall(text) + FOLDED_POINTER.findall(text)
        if skill not in expected:
            if pointers:
                errors.append(f"{skill}: points to the matrix but no `exists` row names it as owner")
            continue
        if len(pointers) != 1:
            errors.append(f"{skill}: {len(pointers)} pointer lines to the matrix, expected exactly 1")
            continue
        (ids_cell, files_cell), (ids, files) = pointers[0], expected[skill]
        problems = _differences("question ids", ids, {i.strip() for i in ids_cell.split(",")}, QUESTIONS)
        problems += _differences("files", files, set(FILE_CITE.findall(files_cell)), files_order)
        errors += [f"{skill}: pointer {p}" for p in problems]
    return errors


# --- real-repo tests ----------------------------------------------------------------------------

def _read(path: Path) -> str | None:
    return path.read_text(encoding="utf-8") if path.is_file() else None


MATRIX_FILES = [f"{n}.md" for n in FAMILIES + [CROSS_CUTTING]]


def test_real_repo_inventory_is_covered_by_the_matrix():
    errors = coverage_errors(
        _read(REFERENCES / INVENTORY), {n: _read(REFERENCES / n) for n in MATRIX_FILES}
    )
    assert not errors, "\n".join(errors)


def test_real_repo_has_one_home_per_fact():
    errors = scan_skills(SKILLS)
    assert not errors, "\n".join(errors)


def test_real_repo_pointer_lines_agree_with_the_matrix():
    matrix = {n: _read(REFERENCES / n) or "" for n in MATRIX_FILES}
    skill_texts = {p.parent.name: p.read_text(encoding="utf-8") for p in sorted(SKILLS.glob("*/SKILL.md"))}
    errors = pointer_errors(matrix, skill_texts)
    assert not errors, "\n".join(errors)


# --- fixture cases: pure functions, no real tree --------------------------------------------------

def _question_table(*questions: str, cite: str = "") -> str:
    return "\n".join(f"| {q} | {cite} | skill |" for q in questions)


ALL_ROWS = _question_table(*QUESTIONS, cite="CHK-1")


def _matrix(overrides: dict[str, str | None] | None = None) -> dict[str, str | None]:
    """Every family file with all six questions; `overrides` maps a file name to its text or None."""
    base = {f"{n}.md": ALL_ROWS for n in FAMILIES}
    base[f"{CROSS_CUTTING}.md"] = ""
    return {**base, **(overrides or {})}


def test_rows_give_the_cells_and_leave_out_header_and_separator():
    text = "| Question | Check |\n|:--|---|\n| VAL | CHK-1 `x` |\n   | VER | a b |\nnot a row"
    assert rows(text) == [["VAL", "CHK-1 `x`"], ["VER", "a b"]]


def test_coverage_passes_when_every_id_is_cited_and_every_question_has_a_row():
    assert coverage_errors("CHK-1 does a thing", _matrix()) == []


def test_coverage_names_an_uncited_id():
    assert coverage_errors("CHK-1\nCHK-7", _matrix()) == [
        f"{INVENTORY} defines CHK-7, which no matrix file cites"
    ]


def test_coverage_does_not_count_chk_1_as_cited_by_chk_12():
    matrix = {f"{n}.md": _question_table(*QUESTIONS, cite="CHK-12") for n in FAMILIES}
    matrix[f"{CROSS_CUTTING}.md"] = ""
    errors = coverage_errors("CHK-1\nCHK-12", matrix)
    assert errors == [f"{INVENTORY} defines CHK-1, which no matrix file cites"]


def test_coverage_names_a_file_and_an_undefined_id():
    errors = coverage_errors("CHK-1", _matrix({"software.md": ALL_ROWS + "\n| VAL | CHK-99 | x |"}))
    assert errors == [f"software.md cites CHK-99, which {INVENTORY} does not define"]


def test_coverage_names_a_family_without_a_robustness_row():
    devops = _question_table("VAL", "VER", "ADQ", "CLR", "RSK", cite="CHK-1")
    assert coverage_errors("CHK-1", _matrix({"devops.md": devops})) == ["devops.md has no row for question ROB"]


def test_coverage_exempts_cross_cutting_from_the_question_rule():
    assert coverage_errors("CHK-1", _matrix({f"{CROSS_CUTTING}.md": "CHK-1"})) == []


def test_coverage_names_a_missing_file():
    assert coverage_errors("CHK-1", _matrix({"ui.md": None})) == ["references/ui.md is missing"]


def test_question_rows_accept_bold_and_backticks():
    assert question_rows("| **VAL** | x |\n| `VER` | y |\n| text VAL | z |") == {"VAL", "VER"}


CONFIG_FILES_WRAPPED = (
    "    pytest, pytest-bdd, pytest-cov, pytest-asyncio, testcontainers, polyfactory, httpx. `dev` ="
)
PIN_TEMPLATE = "project-setup/assets/templates/root/pyproject.toml.tmpl"
CONFIG_FILES = "project-setup/references/config-files.md"
DECISIONS = "project-setup/references/decisions.md"


@pytest.mark.parametrize("rel, line", [
    (SKILL_FILE, "Validation asks: did we build the right thing?"),
    ("a/SKILL.md", "invalidation asks nothing of the reader"),  # \b: not the definition
    ("x/SKILL.md", "unit tests come from RED → GREEN → REFACTOR (`superpowers:test-driven-development`)"),
    ("x/SKILL.md", "the RED-GREEN loop is owned by superpowers:test-driven-development"),
    ("a/SKILL.md", "a required green check before merge"),  # \b: not the loop
    (PIN_TEMPLATE, '    "polyfactory==3.3.0",'),
    (CONFIG_FILES, CONFIG_FILES_WRAPPED),
    (CHECKLIST, "Use Polyfactory factories."),
    ("project-setup/references/testing-setup.md", "Test data: see testing-checklist.md (polyfactory)."),
])
def test_one_home_passes_the_allowed_forms(rel, line):
    assert one_home_errors(rel, [line]) == []


VV_ERROR = f"vv-definition outside {SKILL_FILE}"
TDD_ERROR = "tdd-loop on a line not naming test-driven-development"
DATA_ERROR = "test-data rule (polyfactory) outside its home"


@pytest.mark.parametrize("rel, lines, expected", [
    ("a/SKILL.md", ["ok", "Use polyfactory to build objects."], [f"a/SKILL.md:2: {DATA_ERROR}"]),
    ("a/SKILL.md", ["Verification asks if we built it right."], [f"a/SKILL.md:1: {VV_ERROR}"]),
    ("a/SKILL.md", ["Validation asks the owner."], [f"a/SKILL.md:1: {VV_ERROR}"]),
    ("a/SKILL.md", ["unit tests come from the RED-GREEN loop."], [f"a/SKILL.md:1: {TDD_ERROR}"]),
    ("a/SKILL.md", ["unit tests come from RED → GREEN → REFACTOR"], [f"a/SKILL.md:1: {TDD_ERROR}"]),
    ("a/SKILL.md", ["the red/green cycle drives the unit tests"], [f"a/SKILL.md:1: {TDD_ERROR}"]),
    (DECISIONS, ["we like polyfactory"], [f"{DECISIONS}:1: {DATA_ERROR}"]),
    ("project-setup/references/testing-setup.md", ["polyfactory for models"],
     [f"project-setup/references/testing-setup.md:1: {DATA_ERROR}"]),
])
def test_one_home_fails_prose_and_names_file_line_and_fact(rel, lines, expected):
    assert one_home_errors(rel, lines) == expected


# --- pointer lines: fixture cases -------------------------------------------------------------------

def _owner_row(question: str, owner: str, status: str = "exists") -> str:
    return f"| {question} | CHK-1 x | {owner} | tool | moment | decider | {status} |"


HEADER = "| Question | Check | Technique owner | Tool | Moment | Decided by | Status |\n|---|---|---|---|---|---|---|\n"
POINTER_MATRIX = {
    "software.md": HEADER + _owner_row("VER", "`alpha`") + "\n" + _owner_row("ADQ", "`alpha`"),
    "devops.md": HEADER + _owner_row("VER", "`alpha`") + "\n" + _owner_row("RSK", "`beta`"),
}
LINE_ALPHA = "Answers `VER, ADQ` in `test-strategy`'s matrix (`references/devops.md`, `references/software.md`)."
LINE_BETA = "Answers `RSK` in `test-strategy`'s matrix (`references/devops.md`)."
FOLDED_BETA = "**Related:** `x`, `test-strategy` (answers `RSK` in its matrix, `references/devops.md`), `y`"
SKILL_NAMES = {"alpha": "", "beta": "", "gamma": ""}


def _pointer_errors(**texts: str) -> list[str]:
    return pointer_errors(POINTER_MATRIX, {**SKILL_NAMES, **texts})


def test_pointers_agree_with_the_matrix():
    assert _pointer_errors(alpha="intro\n" + LINE_ALPHA, beta=FOLDED_BETA) == []


def test_pointers_ignore_owners_that_are_not_skill_folders_and_non_exists_rows():
    matrix = {"software.md": HEADER + "\n".join([
        _owner_row("VER", "repository lint"), _owner_row("VER", "`superpowers:tdd` (external)"),
        _owner_row("VER", "`test-strategy`"), _owner_row("VER", "`docs/x.md`"),
        _owner_row("VER", "`gamma`", "gap → C"),
    ])}
    assert pointer_errors(matrix, SKILL_NAMES) == []


def test_pointers_name_a_skill_with_no_pointer_line():
    assert _pointer_errors(alpha="no pointer", beta=LINE_BETA) == [
        "alpha: 0 pointer lines to the matrix, expected exactly 1"
    ]


def test_pointers_name_a_skill_with_two_pointer_lines():
    assert _pointer_errors(alpha=LINE_ALPHA + "\n" + LINE_ALPHA, beta=LINE_BETA) == [
        "alpha: 2 pointer lines to the matrix, expected exactly 1"
    ]


def test_pointers_name_an_extra_and_a_missing_question_id():
    wrong = LINE_ALPHA.replace("`VER, ADQ`", "`VER, ROB`")
    assert _pointer_errors(alpha=wrong, beta=LINE_BETA) == [
        "alpha: pointer names extra question ids ROB",
        "alpha: pointer misses question ids ADQ",
    ]


def test_pointers_name_an_extra_and_a_missing_file():
    wrong = LINE_ALPHA.replace("`references/software.md`", "`references/ui.md`")
    assert _pointer_errors(alpha=wrong, beta=LINE_BETA) == [
        "alpha: pointer names extra files ui.md",
        "alpha: pointer misses files software.md",
    ]


def test_pointers_check_the_folded_form_too():
    wrong = FOLDED_BETA.replace("`RSK`", "`VAL`")
    assert _pointer_errors(alpha=LINE_ALPHA, beta=wrong) == [
        "beta: pointer names extra question ids VAL",
        "beta: pointer misses question ids RSK",
    ]


def test_pointers_name_a_skill_the_matrix_does_not_list_as_owner():
    assert _pointer_errors(alpha=LINE_ALPHA, beta=LINE_BETA, gamma=LINE_BETA) == [
        "gamma: points to the matrix but no `exists` row names it as owner"
    ]
