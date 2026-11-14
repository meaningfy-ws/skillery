"""Adversarial cases for the proof test of `test-strategy` (design D-7, spec scenarios).

Each test asserts what D-7 or a scenario requires. A failing test is a finding, not a mistake.
"""
import pytest

from tests.test_test_strategy import (
    CHECKLIST,
    CROSS_CUTTING,
    FAMILIES,
    QUESTIONS,
    coverage_errors,
    one_home_errors,
    question_rows,
    scan_skills,
)

ROWS = "\n".join(f"| {q} | CHK-1 | skill |" for q in QUESTIONS)


def _matrix(**overrides):
    base = {f"{n}.md": ROWS for n in FAMILIES}
    base[f"{CROSS_CUTTING}.md"] = ""
    return {**base, **{k.replace("_", "-") + ".md": v for k, v in overrides.items()}}


# --- inventory coverage ---------------------------------------------------------------------------

def test_question_rows_ignore_header_and_separator():
    assert question_rows("| Question | Check |\n|---|---|\n|:--:|:--:|") == set()


def test_gap_row_counts_as_a_question_row():
    # spec: "each with a check or a `gap` row naming its EPIC"
    assert question_rows("| ROB | gap | none yet |") == {"ROB"}


def test_indented_row_counts():
    assert question_rows("   | VAL | x |") == {"VAL"}


def test_question_rows_survive_crlf():
    assert question_rows("| VAL | x |\r\n| VER | y |\r\n") == {"VAL", "VER"}


def test_question_rows_empty_text():
    assert question_rows("") == set()


def test_question_id_in_a_later_cell_is_not_a_row():
    assert question_rows("| CHK-1 | VAL | x |") == set()


def test_family_with_empty_text_misses_all_six_questions():
    errors = coverage_errors("CHK-1", _matrix(ui=""))
    assert sorted(errors) == sorted(f"ui.md has no row for question {q}" for q in QUESTIONS)


def test_one_missing_question_does_not_hide_another_family():
    rows = "\n".join(f"| {q} | CHK-1 | s |" for q in QUESTIONS if q != "CLR")
    errors = coverage_errors("CHK-1", _matrix(ui=rows, devops=rows))
    assert sorted(errors) == ["devops.md has no row for question CLR", "ui.md has no row for question CLR"]


def test_missing_inventory_reports_only_itself():
    assert coverage_errors(None, _matrix(ui=None)) == ["references/inventory.md is missing"]


def test_missing_cross_cutting_file_is_reported():
    assert coverage_errors("CHK-1", _matrix(cross_cutting=None)) == ["references/cross-cutting.md is missing"]


def test_cross_cutting_citing_an_undefined_id_fails():
    # D-7: "a reference file cites an undefined id"
    errors = coverage_errors("CHK-1", _matrix(cross_cutting="CHK-99"))
    assert errors == ["cross-cutting.md cites CHK-99, which inventory.md does not define"]


def test_cross_cutting_alone_may_cite_an_id():
    matrix = {f"{n}.md": "\n".join(f"| {q} | | s |" for q in QUESTIONS) for n in FAMILIES}
    matrix[f"{CROSS_CUTTING}.md"] = "| x | CHK-5 |"
    assert coverage_errors("CHK-5", matrix) == []


def test_undefined_id_cited_by_two_files_names_both():
    errors = coverage_errors("CHK-1", _matrix(ui=ROWS + "\n| VAL | CHK-9 |", devops=ROWS + "\n| VAL | CHK-9 |"))
    assert sorted(errors) == [
        "devops.md cites CHK-9, which inventory.md does not define",
        "ui.md cites CHK-9, which inventory.md does not define",
    ]


def test_id_defined_twice_is_still_one_id():
    assert coverage_errors("CHK-1 a\nCHK-1 b", _matrix()) == []


def test_uncited_ids_are_sorted_and_each_named_once():
    errors = coverage_errors("CHK-3 CHK-3 CHK-2 CHK-1", _matrix())
    assert errors == [
        "inventory.md defines CHK-2, which no matrix file cites",
        "inventory.md defines CHK-3, which no matrix file cites",
    ]


def test_id_is_cited_whole_not_as_a_prefix_of_a_longer_id():
    # CHK-12 must not satisfy CHK-1 (also pinned by the base test); here in the undefined direction
    errors = coverage_errors("CHK-1", _matrix(ui=ROWS + "\n| VAL | CHK-12 |"))
    assert errors == ["ui.md cites CHK-12, which inventory.md does not define"]


def test_defined_id_with_crlf_inventory():
    assert coverage_errors("CHK-1\r\nCHK-2\r\n", _matrix(ui=ROWS + "\n| VAL | CHK-2 |")) == []


def test_empty_inventory_flags_every_cited_id():
    errors = coverage_errors("", _matrix())
    assert len(errors) == len(FAMILIES)
    assert all("cites CHK-1, which inventory.md does not define" in e for e in errors)


# --- one home per fact: vv-definition ---------------------------------------------------------------

@pytest.mark.parametrize("line", ["VERIFICATION ASKS x", "Validation Asks x", "validation asks x"])
def test_vv_is_case_insensitive(line):
    assert one_home_errors("a/SKILL.md", [line]) == ["a/SKILL.md:1: vv-definition outside test-strategy/SKILL.md"]


def test_vv_allowed_only_in_the_exact_skill_file():
    assert one_home_errors("test-strategy/SKILL.md", ["Verification asks x"]) == []
    assert one_home_errors("test-strategy/references/software.md", ["Verification asks x"]) != []
    assert one_home_errors("other/test-strategy/SKILL.md", ["Verification asks x"]) != []


def test_vv_inside_a_longer_sentence_is_found():
    assert one_home_errors("a.md", ["As such, verification asks whether it is right."]) != []


def test_two_facts_on_one_line_give_two_errors():
    errors = one_home_errors("a.md", ["verification asks; use polyfactory; red-green"])
    assert len(errors) == 3


def test_line_numbers_are_one_based_and_per_line():
    errors = one_home_errors("a.md", ["", "", "validation asks"])
    assert errors == ["a.md:3: vv-definition outside test-strategy/SKILL.md"]


def test_empty_file_has_no_errors():
    assert one_home_errors("a.md", []) == []


# --- one home per fact: test-data -------------------------------------------------------------------

def test_polyfactory_case_insensitive_in_prose():
    assert one_home_errors("a.md", ["Use PolyFactory"]) != []
    assert one_home_errors(CHECKLIST, ["Use PolyFactory"]) == []


def test_polyfactory_in_a_dependency_file_on_a_prose_line_fails():
    # D-7: allowed there only on a dependency line (a version pin or the name pytest)
    assert one_home_errors("project-setup/references/decisions.md", ["polyfactory builds test objects nicely."]) != []


def test_polyfactory_in_the_template_on_a_pin_line_passes():
    assert one_home_errors("project-setup/assets/templates/root/pyproject.toml.tmpl", ['"polyfactory==3.3.0",']) == []


def test_polyfactory_pointer_line_must_name_the_checklist():
    pointer = "project-setup/references/testing-setup.md"
    assert one_home_errors(pointer, ["use polyfactory (pytest)"]) != []
    assert one_home_errors(pointer, ["polyfactory: see testing-checklist.md"]) == []


def test_dependency_rule_does_not_leak_to_other_files():
    assert one_home_errors("project-setup/references/other.md", ['"polyfactory==3.3.0",']) != []


def test_checklist_path_is_exact():
    assert one_home_errors("x/" + CHECKLIST, ["polyfactory"]) != []


# --- one home per fact: tdd-loop ---------------------------------------------------------------------

@pytest.mark.parametrize("line", [
    "RED → GREEN → REFACTOR", "red-green", "Red/Green", "red, green, refactor", "red -> green",
    "RED  GREEN", "red:green",
])
def test_tdd_forms_are_caught(line):
    assert one_home_errors("a.md", [line]) == ["a.md:1: tdd-loop on a line not naming test-driven-development"]


def test_green_then_red_is_not_the_loop():
    assert one_home_errors("a.md", ["the build goes green-red when flaky"]) == []


def test_tdd_line_naming_the_owner_is_allowed_even_when_it_restates():
    # D-7: "allowed only on a line naming test-driven-development"
    assert one_home_errors("a.md", ["red, green, refactor per superpowers:test-driven-development"]) == []


def test_tdd_owner_name_is_matched_case_insensitively():
    assert one_home_errors("a.md", ["RED-GREEN (Test-Driven-Development)"]) == []


def test_tdd_loop_on_the_next_line_of_the_owner_line_is_not_excused():
    assert one_home_errors("a.md", ["see test-driven-development", "red-green-refactor"]) == [
        "a.md:2: tdd-loop on a line not naming test-driven-development"
    ]


def test_tdd_allowed_in_the_checklist_does_not_excuse_the_loop():
    assert one_home_errors(CHECKLIST, ["red-green"]) != []


# --- scan_skills -------------------------------------------------------------------------------------

def _tree(tmp_path, files):
    for rel, content in files.items():
        p = tmp_path / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(content if isinstance(content, bytes) else content.encode("utf-8"))


def test_scan_reads_tmpl_and_json_files_and_posix_paths(tmp_path):
    _tree(tmp_path, {
        "a/b/x.tmpl": "ok\nverification asks\n",
        "a/y.json": '{"k": "use polyfactory"}',
    })
    assert scan_skills(tmp_path) == [
        "a/b/x.tmpl:2: vv-definition outside test-strategy/SKILL.md",
        "a/y.json:1: test-data rule (polyfactory) outside its home",
    ]


def test_scan_handles_crlf(tmp_path):
    _tree(tmp_path, {"a.md": "ok\r\nred-green\r\n"})
    assert scan_skills(tmp_path) == ["a.md:2: tdd-loop on a line not naming test-driven-development"]


def test_scan_handles_a_utf8_bom(tmp_path):
    _tree(tmp_path, {"a.md": b"\xef\xbb\xbfverification asks"})
    assert scan_skills(tmp_path) == ["a.md:1: vv-definition outside test-strategy/SKILL.md"]


def test_scan_empty_tree_and_empty_file(tmp_path):
    _tree(tmp_path, {"a.md": ""})
    assert scan_skills(tmp_path) == []


def test_scan_reports_the_editor_line_number_when_a_line_holds_a_form_feed(tmp_path):
    # D-7 names file and line; `str.splitlines` also splits on form feed, \x1c-\x1e, \x85 and the unicode separators,
    # so the reported number drifts from the number an editor shows
    _tree(tmp_path, {"a.md": "one\x0ctwo\nverification asks\n"})
    assert scan_skills(tmp_path) == ["a.md:2: vv-definition outside test-strategy/SKILL.md"]
