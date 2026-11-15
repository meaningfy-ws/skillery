"""The session-retrospective scripts digest transcripts and report per-epic cost (delivery-retrospective, task 1.3).

Fixtures under tests/fixtures/session-retrospective/projects/ are hand-written and synthetic (DEC-7): one
session with a Skill call and a failing `make validate`, plus one subagent (`agent-x`) with its meta file.
The scripts are loaded by path, as tests/test_rulebook.py loads its script.
"""
import importlib.util
import json
import shutil
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "skills/session-retrospective/scripts"
PROJECTS = ROOT / "tests/fixtures/session-retrospective/projects"


def _load(name):
    spec = importlib.util.spec_from_file_location(name, SCRIPTS / f"{name}.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


digest_mod = _load("session_digest")
report_mod = _load("epic_report")


@pytest.fixture
def digest_dir(tmp_path):
    out = tmp_path / "digest"
    assert digest_mod.digest(PROJECTS, out, 36500) == 1
    return out


def test_command_head_names_the_command():
    assert digest_mod.command_head("cd /x && FOO=1 uv run pytest -q tests") == "pytest"
    assert digest_mod.command_head("git commit -m 'x'") == "git commit"
    assert digest_mod.command_head("make validate 2>&1 | tail -5") == "make validate"


def test_epic_re_finds_live_and_archived_epics():
    text = "openspec/changes/archive/2026-10-29-reasoning/x openspec/changes/lean-delivery/tasks.md"
    assert digest_mod.EPIC_RE.findall(text) == ["reasoning", "lean-delivery"]


def test_parse_stream_counts_a_response_once_and_times_the_command():
    st, events = digest_mod.parse_stream(PROJECTS / "-home-u-work-repos-demo/sess-1.jsonl", "s")
    assert st["calls"] == 2 and st["first_ctx"] == 120
    bash = [e for e in events if e["kind"] == "bash"][0]
    assert (bash["name"], bash["dur_s"], bash["err"], bash["epic"]) == ("make validate", 40.0, True, "demo-epic")
    assert digest_mod.repo_of(st["cwd"], "") == "demo"


def test_digest_then_report_writes_the_three_outputs(digest_dir):
    sessions = [json.loads(line) for line in (digest_dir / "sessions.jsonl").open()]
    assert len(sessions) == 1 and sessions[0]["repo"] == "demo" and sessions[0]["subagents"]["count"] == 1
    report_mod.main(digest_dir)
    for name in ("epics.tsv", "phases.tsv", "signals.txt"):
        assert (digest_dir / name).is_file()
    row = (digest_dir / "epics.tsv").read_text().splitlines()[1].split("\t")
    assert row[:2] == ["demo", "demo-epic"] and row[4] == "1"


@pytest.mark.parametrize("missing", ["sessions.jsonl", "agents.jsonl", "events.jsonl"])
def test_report_exits_2_naming_the_missing_file(digest_dir, tmp_path, capsys, missing):
    (digest_dir / missing).unlink()
    with pytest.raises(SystemExit) as exc:
        report_mod.main(digest_dir)
    assert exc.value.code == 2
    assert missing in capsys.readouterr().err
