"""Format of the per-tool rows of `ui-testing` (change `ui-testing-skill`, design D-3).

`references/per-tool.md` carries a `Checked against` line and one table. Each cell is one line,
and each non-empty cell links the tool's documentation. The check is a pure function (text in,
error strings out), so the fixture cases run without the real tree.
"""

import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ROWS = REPO / "skills" / "ui-testing" / "references" / "per-tool.md"

CHECKED = re.compile(r"^Checked against Cypress \S+ and Playwright \S+ on \d{4}-\d{2}-\d{2}\s*$", re.M)
LINK = re.compile(r"\[[^\]]+\]\(https?://[^)\s]+\)")
BREAK = re.compile(r"<br\s*/?>", re.I)
EMPTY = {"", "-", "no tool-specific step"}


def check_rows(text: str) -> list[str]:
    """Return one error per broken rule of the per-tool format."""
    errors = []
    if not CHECKED.search(text):
        errors.append("missing the line 'Checked against Cypress <v> and Playwright <v> on <date>'")
    lines = text.splitlines()
    table = [line for line in lines if line.lstrip().startswith("|")]
    if len(table) < 3:
        errors.append("missing the table Rule | Cypress | Playwright")
        return errors
    header = [c.strip() for c in table[0].strip().strip("|").split("|")]
    if header[:3] != ["Rule", "Cypress", "Playwright"]:
        errors.append(f"table header is {header}, expected Rule | Cypress | Playwright")
    for line in table[2:]:
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        rule = cells[0] if cells else "?"
        if len(cells) != 3:
            errors.append(f"row '{rule}': {len(cells)} cells, expected 3")
            continue
        for name, cell in zip(("Cypress", "Playwright"), cells[1:]):
            if BREAK.search(cell):
                errors.append(f"row '{rule}', {name}: the cell spans more than one line")
            if cell.lower() not in EMPTY and not LINK.search(cell):
                errors.append(f"row '{rule}', {name}: the cell has no link to the tool's documentation")
    # a table row that continues on the next line is a cell that spans two lines
    for prev, nxt in zip(lines, lines[1:]):
        if prev.lstrip().startswith("|") and nxt.strip() and not nxt.lstrip().startswith("|") and not prev.rstrip().endswith("|"):
            errors.append(f"a table row continues on the next line: '{prev.strip()[:40]}'")
    return errors


GOOD = """Checked against Cypress 15.0.0 and Playwright 1.58.0 on 2026-11-22

| Rule | Cypress | Playwright |
|---|---|---|
| UI-3 | `cy.findByRole` ([docs](https://docs.cypress.io/x)) | `getByRole` / `get_by_role` ([docs](https://playwright.dev/x)) |
| UI-6 | no tool-specific step | no tool-specific step |
"""


SKILL = REPO / "skills" / "ui-testing" / "SKILL.md"
RULE_ID = re.compile(r"^UI-\d+\b")


def row_ids(text: str) -> list[str]:
    """Return the `UI-n` ids that start a table row, in row order (the Id or Rule column)."""
    ids = []
    for line in text.splitlines():
        if not line.lstrip().startswith("|"):
            continue
        first = line.strip().strip("|").split("|")[0].strip()
        found = RULE_ID.match(first)
        if found:
            ids.append(found.group(0))
    return ids


def test_rule_ids_match_per_tool_rows_in_order():
    skill_ids = row_ids(SKILL.read_text(encoding="utf-8"))
    tool_ids = row_ids(ROWS.read_text(encoding="utf-8"))
    assert skill_ids == [f"UI-{n}" for n in range(1, 10)]
    assert tool_ids == skill_ids


def test_tooling_rows_come_after_the_rule_rows():
    text = ROWS.read_text(encoding="utf-8")
    firsts = [
        line.strip().strip("|").split("|")[0].strip()
        for line in text.splitlines()[1:]
        if line.lstrip().startswith("|")
    ][2:]
    flags = [bool(RULE_ID.match(f)) for f in firsts]
    assert flags == sorted(flags, reverse=True), "a tooling row sits among the rule rows"
    assert all(f.startswith("Tooling:") for f, rule in zip(firsts, flags) if not rule)


def test_row_ids_ignores_non_rule_rows_fixture():
    text = "| Rule | A | B |\n|---|---|---|\n| UI-2 x | a | b |\n| Tooling: axe engine (UI-8) | a | b |\n"
    assert row_ids(text) == ["UI-2"]


def test_real_rows_hold_the_format():
    assert ROWS.is_file(), f"{ROWS} is missing"
    assert check_rows(ROWS.read_text(encoding="utf-8")) == []


def test_good_fixture_passes():
    assert check_rows(GOOD) == []


def test_missing_checked_line_fails():
    bad = GOOD.replace("Checked against Cypress 15.0.0 and Playwright 1.58.0 on 2026-11-22", "")
    assert any("Checked against" in e for e in check_rows(bad))


def test_line_break_in_a_cell_fails():
    bad = GOOD.replace("`getByRole` /", "`getByRole`<br>")
    assert any("more than one line" in e for e in check_rows(bad))


def test_cell_without_link_fails():
    bad = GOOD.replace(" ([docs](https://docs.cypress.io/x))", "")
    errors = check_rows(bad)
    assert any("UI-3" in e and "no link" in e for e in errors)


def test_continued_row_fails():
    bad = GOOD.replace("| UI-6 | no tool-specific step |", "| UI-6 | no tool-specific\nstep |")
    assert any("continues" in e for e in check_rows(bad))
