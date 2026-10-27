"""Deterministic checks of the sales skills' assets (add-sales-bundle TC-03..TC-05)."""
import re
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[1]
CUSTODY = ROOT / "skills/sales-pipeline-custody/assets"
VIEWS = yaml.safe_load((CUSTODY / "odoo-views.yaml").read_text(encoding="utf-8"))
PIPELINES = yaml.safe_load((CUSTODY / "pipelines.yaml").read_text(encoding="utf-8"))["pipelines"]
TEMPLATES = sorted(ROOT.glob("skills/sales-*/assets/templates/*.md"))
RUN_NOTES = sorted((ROOT / "skills/sales-operations/assets/templates").glob("*.md"))
MAX_COLUMNS = 5


def test_every_filter_is_complete():  # TC-03
    names = {p["name"] for p in PIPELINES} | {"Client accounts"}
    for f in VIEWS["attention_filters"]:
        for key in ("question", "action", "target", "cadence", "order", "kind"):
            assert f.get(key), f"{f['id']}: no {key}"
        assert ("domain" in f) != ("check" in f), f"{f['id']}: needs exactly one of domain or check"
        assert f["target"] in ("zero", "worklist"), f["id"]
        assert set(f["cadence"]) <= {"open day", "close day", "weekly"}, f["id"]
        if f["pipelines"] != "all":
            unknown = set(f["pipelines"]) - names
            assert not unknown, f"{f['id']}: unknown pipelines {unknown}"


def test_closing_date_stages_exist():  # TC-03
    stages = {p["name"]: {s["name"] for s in p["stages"]} for p in PIPELINES}
    for pipeline, names in VIEWS["closing_date_stages"].items():
        assert pipeline in stages, pipeline
        assert set(names) <= stages[pipeline], f"{pipeline}: {set(names) - stages[pipeline]}"


def _tables(text):
    """Yield (first line number, rows) for each Markdown table outside fenced blocks."""
    lines, fenced, table, start = text.split("\n"), False, [], 0
    for n, line in enumerate(lines + [""], 1):
        if line.startswith("```"):
            fenced = not fenced
        if not fenced and line.startswith("|"):
            if not table:
                start = n
            table.append(line)
        elif table:
            yield start, table
            table = []


def _cells(row):
    return [c for c in re.split(r"(?<!\\)\|", row.strip())[1:-1]]


@pytest.mark.parametrize("path", TEMPLATES, ids=lambda p: str(p.relative_to(ROOT)))
def test_tables_render_and_stay_narrow(path):  # TC-04
    for start, rows in _tables(path.read_text(encoding="utf-8")):
        width = len(_cells(rows[0]))
        assert width <= MAX_COLUMNS, f"line {start}: {width} columns (max {MAX_COLUMNS})"
        assert len(rows) > 1 and set(rows[1].replace("|", "").strip()) <= set("-: "), f"line {start}: no separator row"
        assert all(len(_cells(r)) == width for r in rows), f"line {start}: rows of unequal width"


def test_table_check_catches_a_wide_table():
    wide = "| a | b | c | d | e | f |\n|---|---|---|---|---|---|\n"
    assert len(_cells(next(_tables(wide))[1][0])) > MAX_COLUMNS


@pytest.mark.parametrize("path", RUN_NOTES, ids=lambda p: p.name)
def test_run_note_opens_with_decisions(path):  # TC-05
    text = path.read_text(encoding="utf-8")
    headings = re.findall(r"^## (.+)$", text, flags=re.M)
    assert headings[0] == "Decisions needed", f"first section is {headings[0]!r}"
    section = text.split("## Decisions needed", 1)[1].split("\n## ", 1)[0]
    assert "decision request" in section and "executive-communication" in section
    assert headings[-1].startswith("Log"), "the machine log must be the last section"
