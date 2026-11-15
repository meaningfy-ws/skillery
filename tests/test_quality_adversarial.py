"""Adversarial tests for stage 1, tool side, of harden-checks-and-tests.

A failing test here is a finding about the code under test; none is fixed in this file.
"""
import http.client
import importlib.util
import io
import json
import shlex
import tarfile
import urllib.error
from pathlib import Path

import pytest

import test_quality as tq
from tools.bundle_gen import gen
from tools.repo_lint import lint

_spec = importlib.util.spec_from_file_location("external_sources", tq.SCRIPT)
ext = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ext)

COMMIT = "a" * 40


def manifest_entry(**changes):
    base = {"id": "src", "repo": "https://example.invalid/o/r", "commit": COMMIT, "paths": ["rules"],
            "licence": "MIT", "why": "x", "mode": "gate"}
    return {**base, **changes}


def tar_bytes(members):
    """members: list of (name, kind, payload); kind is file, dir, symlink or hardlink."""
    buf = io.BytesIO()
    with tarfile.open(fileobj=buf, mode="w:gz") as t:
        for name, kind, payload in members:
            info = tarfile.TarInfo(name)
            if kind == "dir":
                info.type = tarfile.DIRTYPE
                t.addfile(info)
            elif kind in ("symlink", "hardlink"):
                info.type = tarfile.SYMTYPE if kind == "symlink" else tarfile.LNKTYPE
                info.linkname = payload
                t.addfile(info)
            else:
                data = payload.encode()
                info.size = len(data)
                t.addfile(info, io.BytesIO(data))
    return buf.getvalue()


@pytest.fixture
def work(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    return tmp_path


def write_manifest(entries, raw=None):
    ext.MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    ext.MANIFEST.write_text(raw if raw is not None else json.dumps(entries), encoding="utf-8")


# --- external_sources: the manifest as the script reads it -------------------------------------

def test_missing_manifest_exits_2(work, capsys):
    assert ext.main(["fetch"]) == 2


def test_manifest_that_is_invalid_json_does_not_traceback(work):
    write_manifest(None, raw="{not json")
    assert ext.main(["paths", "gate"]) in (1, 2)


def test_manifest_that_is_a_json_object_does_not_traceback(work):
    write_manifest(None, raw='{"id": "x"}')
    assert ext.main(["paths", "gate"]) in (1, 2)


def test_manifest_entry_missing_a_field_does_not_traceback(work):
    write_manifest([{"id": "x", "mode": "gate"}])
    assert ext.main(["paths", "gate"]) in (1, 2)


def test_empty_manifest_prints_an_empty_line_and_exits_0(work, capsys):
    write_manifest([])
    assert ext.main(["paths", "gate"]) == 0
    assert capsys.readouterr().out.strip() == ""


def test_paths_with_a_space_are_refused_so_shell_word_splitting_cannot_split_them(work, capsys):
    """The Makefile uses the output unquoted inside $$(...): a path must be one word, so a space is refused."""
    write_manifest([manifest_entry(paths=["my rules/a.yaml"])])
    assert ext.main(["paths", "gate"]) == 2
    captured = capsys.readouterr()
    assert shlex.split(captured.out) == [] and "paths" in captured.err


def test_paths_with_shell_metacharacters_are_not_executable_text(work, capsys):
    write_manifest([manifest_entry(paths=["a;touch pwned"])])
    ext.main(["paths", "gate"])
    out = capsys.readouterr().out
    assert ";" not in out, out


def test_manifest_check_rejects_a_parent_path_in_paths():
    problems = tq.manifest_problems([manifest_entry(paths=["../../etc"])])
    assert problems, "a paths entry with .. is accepted"


def test_manifest_check_rejects_an_absolute_path_in_paths():
    assert tq.manifest_problems([manifest_entry(paths=["/etc/passwd"])]), "an absolute path is accepted"


@pytest.mark.parametrize("bad_id", ["../escape", "a/b", "/abs", ".", ".."])
def test_manifest_check_rejects_an_id_that_is_not_a_plain_folder_name(bad_id):
    assert tq.manifest_problems([manifest_entry(id=bad_id)]), bad_id


def test_manifest_check_does_not_crash_on_a_non_object_entry():
    assert tq.manifest_problems(["x"])


def test_manifest_check_does_not_crash_on_an_unhashable_id():
    assert tq.manifest_problems([manifest_entry(id=["a"])])


def test_manifest_check_does_not_crash_on_null_entry():
    assert tq.manifest_problems([None])


# --- external_sources: fetch --------------------------------------------------------------------

def good_archive():
    return tar_bytes([("repo-abc", "dir", None), ("repo-abc/rules", "dir", None),
                      ("repo-abc/rules/a.yaml", "file", "rules: []\n")])


def test_fetch_happy_path_moves_the_single_top_folder(work):
    assert ext.fetch([manifest_entry()], lambda url: good_archive()) == 0
    assert (work / ".quality/external/src/rules/a.yaml").is_file()
    assert [p.name for p in (work / ".quality/external").iterdir()] == ["src"]


def test_fetch_member_escaping_the_folder_is_refused_and_leaves_nothing(work):
    data = tar_bytes([("repo/ok", "file", "x"), ("../../evil.txt", "file", "x")])
    assert ext.fetch([manifest_entry()], lambda url: data) == 1
    assert not (work / "evil.txt").exists() and not (work.parent / "evil.txt").exists()
    assert not (work / ".quality/external/src").exists()
    assert [p.name for p in (work / ".quality/external").iterdir()] == []


def test_fetch_absolute_member_name_is_refused(work):
    data = tar_bytes([("repo/ok", "file", "x"), ("/tmp/abs-evil-adversarial", "file", "x")])
    code = ext.fetch([manifest_entry()], lambda url: data)
    assert code == 1 or not Path("/tmp/abs-evil-adversarial").exists()
    assert not Path("/tmp/abs-evil-adversarial").exists()


@pytest.mark.parametrize("target", ["/etc/passwd", "../../outside"])
def test_fetch_symlink_pointing_outside_is_refused(work, target):
    data = tar_bytes([("repo/ok", "file", "x"), ("repo/link", "symlink", target)])
    assert ext.fetch([manifest_entry()], lambda url: data) == 1
    assert not (work / ".quality/external/src").exists()


def test_fetch_hardlink_to_outside_is_refused(work):
    data = tar_bytes([("repo/ok", "file", "x"), ("repo/h", "hardlink", "/etc/passwd")])
    assert ext.fetch([manifest_entry()], lambda url: data) == 1


def test_fetch_symlink_inside_the_folder_is_allowed_or_refused_but_never_escapes(work):
    data = tar_bytes([("repo/real", "file", "x"), ("repo/link", "symlink", "real")])
    ext.fetch([manifest_entry()], lambda url: data)
    link = work / ".quality/external/src/link"
    if link.is_symlink():
        assert link.resolve().is_relative_to((work / ".quality/external").resolve())


def test_fetch_two_top_folders_is_refused(work):
    data = tar_bytes([("a/x", "file", "1"), ("b/y", "file", "2")])
    assert ext.fetch([manifest_entry()], lambda url: data) == 1
    assert not (work / ".quality/external/src").exists()


def test_fetch_empty_archive_is_refused(work):
    assert ext.fetch([manifest_entry()], lambda url: tar_bytes([])) == 1
    assert not (work / ".quality/external/src").exists()


def test_fetch_not_a_tarball_exits_1(work):
    assert ext.fetch([manifest_entry()], lambda url: b"<html>404</html>") == 1


def test_fetch_truncated_gzip_exits_1_not_a_traceback(work):
    data = good_archive()
    assert ext.fetch([manifest_entry()], lambda url: data[: len(data) // 2]) == 1


def test_fetch_empty_body_exits_1(work):
    assert ext.fetch([manifest_entry()], lambda url: b"") == 1


def raiser(exc):
    def download(url):
        raise exc
    return download


@pytest.mark.parametrize("exc", [urllib.error.URLError("down"), TimeoutError("slow"),
                                 ConnectionResetError("reset"), OSError("disk")])
def test_fetch_network_failure_exits_1_and_leaves_no_scratch(work, exc):
    assert ext.fetch([manifest_entry()], raiser(exc)) == 1
    assert list((work / ".quality/external").iterdir()) == []


def test_fetch_incomplete_read_mid_download_exits_1(work):
    """A body cut short mid-way raises http.client.IncompleteRead, which is not an OSError."""
    assert ext.fetch([manifest_entry()], raiser(http.client.IncompleteRead(b"par"))) == 1


def test_fetch_failure_on_second_source_keeps_the_first_and_exits_1(work):
    calls = []

    def download(url):
        calls.append(url)
        if len(calls) == 2:
            raise urllib.error.URLError("down")
        return good_archive()

    # another commit: one archive is downloaded once per repo and commit (D-40)
    assert ext.fetch([manifest_entry(id="one"), manifest_entry(id="two", commit="b" * 40)], download) == 1
    assert (work / ".quality/external/one").is_dir()
    assert not (work / ".quality/external/two").exists()


def test_fetch_is_idempotent_when_the_folder_is_present(work):
    ext.fetch([manifest_entry()], lambda url: good_archive())
    assert ext.fetch([manifest_entry()], raiser(AssertionError("must not download"))) == 0


def test_fetch_refetches_an_empty_leftover_folder(work):
    """A source folder that exists but is empty (an interrupted earlier run) is not a fetched source."""
    (work / ".quality/external/src").mkdir(parents=True)
    ext.fetch([manifest_entry()], lambda url: good_archive())
    assert (work / ".quality/external/src/rules/a.yaml").is_file()


def test_fetch_id_with_parent_segment_cannot_write_outside_external(work):
    data = good_archive()
    try:
        ext.fetch([manifest_entry(id="../escaped")], lambda url: data)
    except Exception:
        pass
    assert not (work / ".quality/escaped").exists()


def test_fetch_url_is_built_from_repo_and_commit(work):
    seen = []
    ext.fetch([manifest_entry()], lambda url: seen.append(url) or good_archive())
    assert seen == [f"https://example.invalid/o/r/archive/{COMMIT}.tar.gz"]


def test_fetch_trailing_slash_in_repo_gives_a_clean_url(work):
    seen = []
    ext.fetch([manifest_entry(repo="https://example.invalid/o/r/")], lambda url: seen.append(url) or good_archive())
    assert "//archive" not in seen[0].split("://", 1)[1], seen


def test_paths_for_other_mode_are_not_listed(work, capsys):
    write_manifest([manifest_entry(id="a", mode="gate", paths=["p"]),
                    manifest_entry(id="b", mode="report-only", paths=["q"])])
    ext.main(["paths", "report-only"])
    out = capsys.readouterr().out
    assert "external/b/q" in out and "external/a" not in out


def test_unknown_mode_is_rejected_by_the_parser(work):
    with pytest.raises(SystemExit) as info:
        ext.main(["paths", "block"])
    assert info.value.code == 2


# --- the "Checked by" parser --------------------------------------------------------------------

@pytest.mark.parametrize("value", [
    "  Ruff `E722`  ",
    "Semgrep `mfy-a`;Ruff `E722`",
    "Semgrep `mfy-a` ;  Ruff `E722`",
    "Semgrep `mfy-a`; Ruff `E722`; make `check-architecture`",
    "Ruff `E722`, `E501`",
    "Ruff `PLR2004` (partial: only the literal case)",
    "import-linter, layer contracts",
    "make `a_b.c-d`",
    "review only, because it is a judgement call",
    "review only, because one two three",
])
def test_odd_but_valid_values_parse(value):
    assert tq.parse_checked_by(value)


@pytest.mark.parametrize("value", [
    "Ruff E722",
    "Ruff `e722`",
    "ruff `E722`",
    "Ruff `E722",
    "Ruff ``",
    "Semgrep `rule-a`",
    "Semgrep `mfy-A`",
    "make ``",
    "make `Test`",
    "review only, because one two",
    "review only, because ",
    "review only because one two three",
    "Review only, because one two three",
    "Semgrep `mfy-a`;",
    ";Semgrep `mfy-a`",
    "Semgrep `mfy-a`;;Ruff `E1`",
    "Ruff `E1` (partial: )",
    "Ruff `E1` (partial:x)",
    "Ruff `E1` (partial: a) (partial: b)",
    "Ruff `E1` (partial: a (b))",
    "Ruff `E1` (partial: a",
    "Ruff `E1`) ; Ruff `E2`",
    "Ruff `E1` (partial: a); review only, because one two three",
    "review only, because one two three; Ruff `E1`",
    "review only, because one two three (partial: x)",
    "Ruff `E1` extra words",
    "Ruff  `E1`",
    "Ruff `E1`,`E2`",
])
def test_near_valid_values_are_refused_with_a_value_error(value):
    with pytest.raises(ValueError):
        tq.parse_checked_by(value)


def test_semicolon_inside_a_partial_does_not_split_even_with_two_of_them():
    parts = tq.parse_checked_by("Ruff `E1` (partial: a; b); Semgrep `mfy-a` (partial: c; d)")
    assert [p["tool"] for p in parts] == ["ruff", "semgrep"]
    assert parts[0]["partial"] == "a; b"


def test_a_value_with_a_newline_is_refused():
    with pytest.raises(ValueError):
        tq.parse_checked_by("Ruff `E1`\nSemgrep `mfy-a`")


def test_a_non_ascii_digit_code_is_refused():
    with pytest.raises(ValueError):
        tq.parse_checked_by("Ruff `E١`")


def test_a_multi_code_ruff_value_lists_every_code():
    assert tq.parse_checked_by("Ruff `E1`, `E2` `E3`")[0]["refs"] == ["E1", "E2", "E3"]


# --- catalogue_values ---------------------------------------------------------------------------

def test_catalogue_second_table_without_the_column_is_not_read():
    text = ("| A | Checked by |\n|---|---|\n| `x` | make `test` |\n\n| B | C |\n|---|---|\n| y | z |\n")
    assert tq.catalogue_values(text) == [("x", "make `test`")]


def test_catalogue_suffix_with_no_value_is_returned_empty_so_it_fails_the_parse():
    found = tq.catalogue_values("AP-X *Checked by:*")
    assert found == [("AP-X", "")]
    with pytest.raises(ValueError):
        tq.parse_checked_by(found[0][1])


def test_catalogue_suffix_in_a_table_row_is_not_double_counted():
    text = "| A | Checked by |\n|---|---|\n| x *Checked by:* y | make `test` |\n"
    assert len(tq.catalogue_values(text)) == 1


def test_catalogue_header_with_trailing_spaces_and_crlf():
    text = "| A | Checked by |\r\n|---|---|\r\n| x | make `test` |\r\n"
    assert tq.catalogue_values(text) == [("x", "make `test`")]


# --- ruff_covers / select -----------------------------------------------------------------------

@pytest.mark.parametrize("select, code, covered", [
    (["E"], "E722", True),
    (["E"], "ERA001", False),
    (["E7"], "E722", True),
    (["E72"], "E722", True),
    (["E722"], "E722", True),
    (["E722"], "E72", False),
    (["PLR2004"], "PLR2004", True),
    (["PLR2004"], "PLR0913", False),
    (["PLR"], "PLR2004", True),
    (["PL"], "PLR2004", True),
    (["PL"], "PLW0603", True),
    (["PLR"], "PLW0603", False),
    (["DTZ"], "DTZ005", True),
    (["DTZ"], "DT", False),
    (["ALL"], "S113", True),
    ([], "E722", False),
])
def test_ruff_covers(select, code, covered):
    assert tq.ruff_covers(select, code) is covered


def test_ruff_select_with_an_inline_array_and_extend_select():
    assert tq.ruff_select('[lint]\nselect = ["E", "DTZ"]\n') == ["E", "DTZ"]


def test_ruff_select_missing_raises_a_key_error_not_silence():
    with pytest.raises(KeyError):
        tq.ruff_select('[lint]\nignore = ["E"]\n')


# --- cross checks -------------------------------------------------------------------------------

def test_cross_check_empty_values_still_names_every_unnamed_rule(tmp_path):
    problems = tq.problems_for(tmp_path, {}, gating=("mfy-a", "mfy-b"))
    assert len([p for p in problems if "no Checked by value names" in p]) == 2


def test_cross_check_a_rule_named_only_inside_an_unparsable_value_stays_unnamed(tmp_path):
    problems = tq.problems_for(tmp_path, {"AP-A": "Semgrep `mfy-a` bogus"})
    assert any("mfy-a: no Checked by value names" in p for p in problems), problems


def test_cross_check_a_suppression_rule_named_by_a_value_is_a_missing_file(tmp_path):
    problems = tq.problems_for(tmp_path, {"AP-A": "Semgrep `mfy-a`", "AP-B": "Semgrep `mfy-suppress`"})
    assert any("AP-B" in p and "mfy-suppress" in p for p in problems), problems


def test_cross_check_hyphenated_make_target_is_found(tmp_path):
    assert tq.problems_for(tmp_path, {"AP-A": "Semgrep `mfy-a`", "AP-B": "make `check-architecture`"},
                           targets=("check-architecture",)) == []


def test_cross_check_a_ruff_family_ref_is_covered_by_a_matching_family(tmp_path):
    assert tq.problems_for(tmp_path, {"AP-A": "Semgrep `mfy-a`", "AP-B": "Ruff `PLR2004`"}, select=("PL",)) == []


def test_cross_check_one_entry_with_two_bad_refs_names_both(tmp_path):
    problems = tq.problems_for(tmp_path, {"AP-A": "Semgrep `mfy-a`", "AP-B": "Ruff `S113`; make `nope`"})
    assert any("S113" in p for p in problems) and any("nope" in p for p in problems), problems


def test_cross_check_semgrep_dir_with_an_empty_rules_file_raises_cleanly(tmp_path):
    (tmp_path / "rules").mkdir()
    (tmp_path / "rules/x.yaml").write_text("", encoding="utf-8")
    with pytest.raises((TypeError, KeyError)):
        tq.semgrep_rule_ids(tmp_path)


# --- makefile helpers ---------------------------------------------------------------------------

def test_makefile_hyphenated_targets_are_read():
    text = ".PHONY: check-architecture\ncheck-architecture:\n\techo\n"
    assert tq.missing_required_targets(["check-architecture"], text) == []


def test_makefile_variable_assignment_is_not_a_target():
    text = "QUALITY_VERSION   = v1\nX := y\nZ ?= w\nA += b\n"
    assert tq.makefile_targets(text) == set()


def test_makefile_target_with_prerequisites_and_a_double_colon_rule():
    assert "a" in tq.makefile_targets("a: b c\n")
    assert "a" not in tq.makefile_targets("a::\n\techo\n") or True  # double-colon: no stance, must not crash


def test_makefile_recipe_line_is_not_a_target():
    assert tq.makefile_targets("a:\n\techo x: y\n") == {"a"}


def test_makefile_target_with_a_variable_in_its_name():
    assert tq.makefile_targets("$(NAME):\n") == set() or True  # must not crash


# --- manifest_problems --------------------------------------------------------------------------

def test_manifest_a_json_number_commit_is_refused():
    assert tq.manifest_problems([manifest_entry(commit=int("1" * 40))]), "a 40-digit number passes as a commit"


def test_manifest_a_bool_or_number_licence_is_refused():
    assert tq.manifest_problems([manifest_entry(licence=1)])
    assert tq.manifest_problems([manifest_entry(commit=True)])


def test_manifest_paths_with_an_empty_or_non_string_member():
    assert tq.manifest_problems([manifest_entry(paths=[""])])
    assert tq.manifest_problems([manifest_entry(paths=[1])])
    assert tq.manifest_problems([manifest_entry(paths=[["a"]])])


def test_manifest_three_entries_two_duplicates_are_named_once_each():
    problems = tq.manifest_problems([manifest_entry(), manifest_entry(), manifest_entry()])
    assert len([p for p in problems if "duplicate" in p]) == 2


def test_manifest_two_entries_with_empty_id_name_distinct_entries():
    problems = tq.manifest_problems([manifest_entry(id=""), manifest_entry(id="")])
    assert any("entry 0" in p for p in problems) and any("entry 1" in p for p in problems), problems


def test_manifest_a_commit_with_a_trailing_newline_is_refused():
    assert tq.manifest_problems([manifest_entry(commit=COMMIT + "\n")])



# --- fixture_problems ---------------------------------------------------------------------------

def test_fixture_with_the_mark_only_in_prose_is_not_accepted(tmp_path):
    tq.write_rule(tmp_path, "r", fixture="x = 'ruleid: mfy-x ok: mfy-x'\n")
    problems = tq.fixture_problems(tmp_path)
    assert any("ruleid" in p for p in problems) and any("ok" in p for p in problems), problems


def test_fixture_marks_with_no_space_after_the_hash_are_accepted(tmp_path):
    tq.write_rule(tmp_path, "r", fixture="#ruleid: mfy-x\nfoo()\n#ok: mfy-x\nbar()\n")
    assert tq.fixture_problems(tmp_path) == []


def test_rule_file_with_two_rules_checks_both_ids(tmp_path):
    import yaml
    doc = {"rules": [{"id": "mfy-a", "message": "m (cosmic-python:AP-X)"},
                     {"id": "other-b", "message": "m (cosmic-python:AP-X)"}]}
    (tmp_path / "r.yaml").write_text(yaml.safe_dump(doc), encoding="utf-8")
    (tmp_path / "r.py").write_text("# ruleid: a\n# ok: a\n", encoding="utf-8")
    assert any("other-b" in p for p in tq.fixture_problems(tmp_path))


def test_message_that_cites_a_form_in_lower_case_is_refused(tmp_path):
    tq.write_rule(tmp_path, "r", message="see cosmic-python:ap-dict-as-model")
    assert any("message" in p for p in tq.fixture_problems(tmp_path))


def test_message_with_a_near_form_is_refused(tmp_path):
    tq.write_rule(tmp_path, "r", message="see cosmic-python:testing-checklist#")
    assert any("message" in p for p in tq.fixture_problems(tmp_path))


def test_rule_file_without_a_message_is_a_problem_not_a_crash(tmp_path):
    import yaml
    (tmp_path / "r.yaml").write_text(yaml.safe_dump({"rules": [{"id": "mfy-a"}]}), encoding="utf-8")
    (tmp_path / "r.py").write_text("# ruleid: a\n# ok: a\n", encoding="utf-8")
    assert any("message" in p for p in tq.fixture_problems(tmp_path))


def test_yml_rule_file_cannot_escape_the_fixture_check_because_the_lint_refuses_it(tmp_path):
    """Semgrep loads .yml too; fixture_problems globs only *.yaml, so the repo lint refuses a .yml rule."""
    put(tmp_path, "README.md", "`semgrep/rules/r.yml`")
    put(tmp_path, "semgrep/rules/r.yml", tq.rule_yaml(rule_id="bad-id"))
    assert any("r.yml" in m and ".yaml" in m for m in lint.quality_files(tmp_path))


# --- ruff_expectations / render_placeholders ----------------------------------------------------

def test_ruff_expectations_with_codes_split_by_comma_space_and_extra_spaces():
    text = "x = 1  # expect: E1,  E2 ,E3\ny = 2\n"
    assert tq.ruff_expectations(text) == {(1, "E1"), (1, "E2"), (1, "E3")}


def test_ruff_expectations_trailing_prose_does_not_become_a_code():
    assert tq.ruff_expectations("x = 1  # expect: E1 because it is bad\n") == {(1, "E1")}


# --- quality_files (tools/repo_lint) -------------------------------------------------------------

def put(root, rel, text="x"):
    p = root / "quality" / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")
    return p


def test_quality_empty_folder_is_silent(tmp_path):
    (tmp_path / "quality").mkdir()
    assert lint.quality_files(tmp_path) == []


def test_quality_folder_with_only_a_readme_is_silent(tmp_path):
    put(tmp_path, "README.md")
    assert lint.quality_files(tmp_path) == []


def test_quality_a_rule_without_any_readme_is_named(tmp_path):
    put(tmp_path, "semgrep/rules/mfy-a.yaml")
    assert any("not named" in m for m in lint.quality_files(tmp_path))


def test_quality_readme_naming_a_longer_file_does_not_cover_a_shorter_one(tmp_path):
    put(tmp_path, "README.md", "mfy-x.yaml.bak")
    put(tmp_path, "semgrep/rules/mfy-x.yaml")
    put(tmp_path, "semgrep/rules/mfy-x.py")
    assert any("mfy-x.yaml" in m and "not named" in m for m in lint.quality_files(tmp_path)), \
        "a README naming mfy-x.yaml.bak is taken as naming mfy-x.yaml"


def test_quality_readme_naming_a_name_that_contains_the_file_name(tmp_path):
    put(tmp_path, "README.md", "see xmfy-bc.yaml")
    put(tmp_path, "semgrep/rules/mfy-bc.yaml")
    put(tmp_path, "semgrep/rules/mfy-bc.py")
    assert any("mfy-bc.yaml" in m and "not named" in m for m in lint.quality_files(tmp_path)), \
        "mfy-bc.yaml counts as named because xmfy-bc.yaml contains it"


def test_quality_same_name_in_two_folders_one_mention_does_not_cover_both(tmp_path):
    put(tmp_path, "README.md", "semgrep/rules/mfy-a.yaml")
    for folder in ("rules", "report-only"):
        put(tmp_path, f"semgrep/{folder}/mfy-a.yaml")
        put(tmp_path, f"semgrep/{folder}/mfy-a.py")
    named = [m for m in lint.quality_files(tmp_path) if "report-only/mfy-a.yaml" in m]
    assert named, "report-only/mfy-a.yaml is covered by a mention of rules/mfy-a.yaml"


def test_quality_readme_naming_by_full_path_in_backticks_is_enough(tmp_path):
    put(tmp_path, "README.md", "`semgrep/rules/mfy-a.yaml`")
    put(tmp_path, "semgrep/rules/mfy-a.yaml")
    put(tmp_path, "semgrep/rules/mfy-a.py")
    assert lint.quality_files(tmp_path) == []


def test_quality_py_beside_a_yml_is_not_a_fixture_and_the_yml_is_refused(tmp_path):
    put(tmp_path, "README.md", "`semgrep/rules/mfy-a.yml`")
    put(tmp_path, "semgrep/rules/mfy-a.yml")
    put(tmp_path, "semgrep/rules/mfy-a.py")
    problems = lint.quality_files(tmp_path)
    assert any("mfy-a.yml" in m for m in problems) and any("mfy-a.py" in m for m in problems), problems


def test_quality_py_with_no_rule_beside_it_is_named(tmp_path):
    put(tmp_path, "semgrep/rules/lonely.py")
    assert any("lonely.py" in m for m in lint.quality_files(tmp_path))


def test_quality_py_whose_rule_is_in_another_folder_is_named(tmp_path):
    put(tmp_path, "README.md", "mfy-a.yaml")
    put(tmp_path, "semgrep/rules/mfy-a.yaml")
    put(tmp_path, "semgrep/report-only/mfy-a.py")
    assert any("report-only/mfy-a.py" in m for m in lint.quality_files(tmp_path))


def test_quality_a_py_with_a_dotted_stem_finds_its_rule(tmp_path):
    put(tmp_path, "README.md", "`semgrep/rules/a.b.yaml`")
    put(tmp_path, "semgrep/rules/a.b.yaml")
    put(tmp_path, "semgrep/rules/a.b.py")
    assert lint.quality_files(tmp_path) == []


@pytest.mark.parametrize("name", [".DS_Store", ".gitkeep", "notes.txt", "x.YAML", "rules.toml", "noext", "a.pyc"])
def test_quality_hidden_and_foreign_files_are_named(tmp_path, name):
    put(tmp_path, "README.md", "x")
    put(tmp_path, f"semgrep/{name}")
    assert any(name in m for m in lint.quality_files(tmp_path)), name


def test_quality_a_hidden_yaml_must_still_be_named(tmp_path):
    put(tmp_path, "README.md", "nothing")
    put(tmp_path, "semgrep/.hidden.yaml")
    assert any(".hidden.yaml" in m for m in lint.quality_files(tmp_path))


def test_quality_pycache_is_ignored(tmp_path):
    put(tmp_path, "README.md", "x")
    put(tmp_path, "semgrep/__pycache__/a.cpython-312.pyc")
    assert lint.quality_files(tmp_path) == []


def test_quality_nested_readme_is_named(tmp_path):
    put(tmp_path, "README.md", "x")
    put(tmp_path, "semgrep/README.md")
    assert any("nested README.md" in m for m in lint.quality_files(tmp_path))


def test_quality_a_symlink_to_a_directory_cycle_does_not_hang(tmp_path):
    put(tmp_path, "README.md", "x")
    (tmp_path / "quality/loop").symlink_to(tmp_path / "quality", target_is_directory=True)
    lint.quality_files(tmp_path)


def test_quality_a_broken_symlink_does_not_crash(tmp_path):
    put(tmp_path, "README.md", "x")
    (tmp_path / "quality/dead.yaml").symlink_to(tmp_path / "nowhere")
    lint.quality_files(tmp_path)


def test_quality_a_readme_that_is_not_utf8_is_a_finding_not_a_crash(tmp_path):
    p = put(tmp_path, "README.md")
    p.write_bytes(b"\xff\xfe\x00bad")
    lint.quality_files(tmp_path)


def test_quality_a_directory_named_readme_md_does_not_crash(tmp_path):
    (tmp_path / "quality/README.md").mkdir(parents=True)
    lint.quality_files(tmp_path)


# --- bundle_gen: the QUALITY_VERSION pin --------------------------------------------------------

def make_repo(tmp_path, makefile_text, newline=None):
    path = tmp_path / gen.PROJECT_MAKEFILE
    path.parent.mkdir(parents=True)
    path.write_bytes(makefile_text.encode())
    return path


def sync(tmp_path, text, ver="9.9.9"):
    path = make_repo(tmp_path, text)
    gen._sync_makefile_pin(tmp_path, ver)
    return path.read_bytes().decode(), gen._version_errors(tmp_path, ver)


@pytest.mark.parametrize("line", [
    "QUALITY_VERSION = v1.0.0",
    "QUALITY_VERSION   = v1.0.0",
    "QUALITY_VERSION=v1.0.0",
    "QUALITY_VERSION\t=\tv1.0.0",
    "QUALITY_VERSION = ",
    "QUALITY_VERSION =",
])
def test_pin_odd_spacing_is_synced_and_checked(tmp_path, line):
    text, errors = sync(tmp_path, f"A = 1\n{line}\nB = 2\n")
    assert "v9.9.9" in text and errors == [], (text, errors)


def test_pin_two_lines_are_both_rewritten(tmp_path):
    text, errors = sync(tmp_path, "QUALITY_VERSION = v1\nX = 1\nQUALITY_VERSION = v2\n")
    assert text.count("v9.9.9") == 2 and errors == []


def test_pin_check_does_not_accept_a_value_that_merely_ends_with_the_version(tmp_path):
    make_repo(tmp_path, "QUALITY_VERSION = release-v9.9.9\n")
    assert gen._version_errors(tmp_path, "9.9.9"), "release-v9.9.9 is accepted as v9.9.9"


def test_pin_check_a_missing_pin_line_is_named(tmp_path):
    make_repo(tmp_path, "A = 1\n")
    assert gen._version_errors(tmp_path, "9.9.9")


def test_pin_check_a_commented_pin_line_is_not_a_pin(tmp_path):
    make_repo(tmp_path, "# QUALITY_VERSION = v9.9.9\n")
    assert gen._version_errors(tmp_path, "9.9.9")


def test_pin_check_a_prerelease_version_is_matched_whole(tmp_path):
    text, errors = sync(tmp_path, "QUALITY_VERSION = v1.0.0\n", ver="3.0.0-rc.1")
    assert text == "QUALITY_VERSION = v3.0.0-rc.1\n" and errors == []


def test_pin_sync_is_idempotent(tmp_path):
    text, _ = sync(tmp_path, "QUALITY_VERSION = v1\n")
    gen._sync_makefile_pin(tmp_path, "9.9.9")
    assert (tmp_path / gen.PROJECT_MAKEFILE).read_bytes().decode() == text
