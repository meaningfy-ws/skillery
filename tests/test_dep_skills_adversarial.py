"""Adversarial cases for the `skills:` list of dependencies.yaml (navigator DD-28, design §4.1).

The lint must accept every inline `skills: [a, b]` list that TC-16's line reader can read, and reject
every form it cannot.
"""

from tests.test_repo_lint_negative import _DEP, _dep_yaml, _deps_text


def test_empty_inline_list_passes(tmp_path):
    assert _deps_text(tmp_path, _dep_yaml("a", "skills: []")) == []


def test_inline_list_with_trailing_comment_passes(tmp_path):
    assert _deps_text(tmp_path, _dep_yaml("a", "skills: [brainstorming]  # superpowers")) == []


def test_flow_list_split_over_lines_is_flagged(tmp_path):
    errs = _deps_text(tmp_path, _dep_yaml("a", "skills: [brainstorming,\n    writing-plans]"))
    assert any("must be an inline list" in e for e in errs), errs


def test_quoted_names_the_line_reader_would_keep_quotes_on_are_flagged(tmp_path):
    # TC-16 splits on ',' and trims: it would read '"brainstorming"' with its quotes.
    assert _deps_text(tmp_path, _dep_yaml("a", 'skills: ["brainstorming"]')) != []


def test_block_list_as_the_first_key_of_an_entry_is_flagged(tmp_path):
    fields = "".join(f"  {k}: {v!r}\n" for k, v in _DEP.items())
    text = f"- skills:\n    - brainstorming\n{fields}"
    errs = _deps_text(tmp_path, text)
    assert any("must be an inline list" in e for e in errs), errs


def test_skills_text_inside_a_block_string_is_not_a_skills_key(tmp_path):
    fields = "".join(f"  {k}: {v!r}\n" for k, v in _DEP.items() if k not in ("name", "provenance"))
    text = f"- name: a\n  provenance: |\n    skills: see the upstream README\n{fields}"
    assert _deps_text(tmp_path, text) == []


def test_non_string_names_are_flagged(tmp_path):
    errs = _deps_text(tmp_path, _dep_yaml("a", "skills: [1, null]"))
    assert len(errs) == 2 and all("is not kebab-case" in e for e in errs), errs


def test_name_shadowing_a_skills_dir_is_flagged_even_with_a_second_entry(tmp_path):
    (tmp_path / "skills" / "guardrails").mkdir(parents=True)
    text = _dep_yaml("a", "skills: [guardrails]") + _dep_yaml("b", "skills: [guardrails]")
    errs = _deps_text(tmp_path, text)
    assert len(errs) == 2 and all("is a skills/ directory" in e for e in errs), errs
