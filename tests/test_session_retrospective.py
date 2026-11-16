"""The session-retrospective scripts digest transcripts and report per-epic cost (delivery-retrospective, task 1.3).

Fixtures under tests/fixtures/session-retrospective/projects/ are hand-written and synthetic (DEC-7): one
session with a Skill call and a failing `make validate`, plus one subagent (`agent-x`) with its meta file.
The scripts are loaded by path, as tests/test_rulebook.py loads its script.
"""
import importlib.util
import json
import shutil
import subprocess
import time
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
    for name in ("epics.tsv", "phases.tsv", "rounds.tsv", "signals.txt"):
        assert (digest_dir / name).is_file()
    row = (digest_dir / "epics.tsv").read_text().splitlines()[1].split("\t")
    assert row[:2] == ["demo", "demo-epic"] and row[4] == "1"


def test_repo_of_is_the_git_root_of_the_cwd(tmp_path):
    (tmp_path / "myrepo/.git").mkdir(parents=True)
    deep = tmp_path / "myrepo/pkg/sub"
    deep.mkdir(parents=True)
    assert digest_mod.repo_of(str(deep), "fb") == "myrepo"


def test_repo_of_a_worktree_is_the_main_repository(tmp_path):
    main = tmp_path / "mainrepo"
    (main / ".git/worktrees/wt").mkdir(parents=True)
    wt = tmp_path / "elsewhere/wt"
    wt.mkdir(parents=True)
    (wt / ".git").write_text(f"gitdir: {main}/.git/worktrees/wt\n")
    assert digest_mod.repo_of(str(wt), "fb") == "mainrepo"


def test_repo_of_a_removed_worktree_uses_the_part_before_claude_worktrees(tmp_path):
    cwd = str(tmp_path / "gone/.claude/worktrees/feat")  # does not exist
    assert digest_mod.repo_of(cwd, "fb") == "gone"
    assert digest_mod.repo_of(str(tmp_path / "removed/lastdir"), "fb") == "lastdir"
    assert digest_mod.repo_of("", "fb") == "fb"


def _jsonl(records):
    return "\n".join(r if isinstance(r, str) else json.dumps(r) for r in records) + "\n"


def _write_session(root, records, name="s1", agents=None):
    """A one-session projects tree from record dicts (or raw strings); `agents` maps a name to its records."""
    folder = root / "projects/-x"
    folder.mkdir(parents=True, exist_ok=True)
    (folder / f"{name}.jsonl").write_text(_jsonl(records))
    for agent, recs in (agents or {}).items():
        sub = folder / name / "subagents"
        sub.mkdir(parents=True, exist_ok=True)
        (sub / f"agent-{agent}.jsonl").write_text(_jsonl(recs))
        (sub / f"agent-{agent}.meta.json").write_text(json.dumps({"agentType": "implementer", "description": "d", "spawnDepth": 1}))
    return root / "projects"


USER = {"type": "user", "timestamp": "2026-11-01T10:00:00Z", "cwd": "/x/demo", "message": {"content": "hello"}}
USAGE = {"input_tokens": 1, "output_tokens": 1}
ASSISTANT = {"type": "assistant", "timestamp": "2026-11-01T10:00:05Z",
             "message": {"id": "m1", "model": "m", "usage": USAGE, "content": [{"type": "text", "text": "hi"}]}}
COST = {"type": "cost-state", "startTime": "s0", "totalCostUSD": 1.0, "timestamp": "2026-11-01T10:00:09Z"}


def _run(root, tmp_path):
    return digest_mod.digest(root, tmp_path / "out", 36500)


def test_two_percent_unknown_records_warn_with_counts_and_types(tmp_path, capsys):
    filler = [{"type": "mode"}] * 95
    root = _write_session(tmp_path, [USER, ASSISTANT, COST, *filler, {"type": "mystery"}, "{not json"])
    _run(root, tmp_path)
    err = capsys.readouterr().err
    assert "warning: unknown records 2 of 100 lines (2.0%, threshold 1%): " in err
    assert "mystery=1" in err and "(unparseable)=1" in err


def test_known_records_and_skipped_blobs_do_not_warn(tmp_path, capsys):
    filler = ['{"type":"api-request","x":1}', '{"type":"attachment"}', *[{"type": "mode"}] * 50]
    root = _write_session(tmp_path, [USER, ASSISTANT, COST, *filler])
    _run(root, tmp_path)
    assert capsys.readouterr().err == ""


def test_assistant_records_with_no_usage_warn(tmp_path, capsys):
    bare = {**ASSISTANT, "message": {"id": "m1", "content": [{"type": "text", "text": "hi"}]}}
    root = _write_session(tmp_path, [USER, bare, COST])
    _run(root, tmp_path)
    assert "warning: session s1 has assistant records and no usage" in capsys.readouterr().err


def test_a_run_without_cost_state_warns(tmp_path, capsys):
    root = _write_session(tmp_path, [USER, ASSISTANT])
    assert _run(root, tmp_path) == 1  # output is still written
    assert "warning: no session has a cost-state record" in capsys.readouterr().err
    report_mod.main(tmp_path / "out")  # F6: no cost, no division by zero
    signals = (tmp_path / "out/signals.txt").read_text()
    assert "guessed share of cost: -" in signals


def _git_init(folder):
    folder.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "init", "-q", str(folder)], check=True)


def _args(root, *extra):
    return ["--root", str(root), "--days", "36500", *extra]


def test_output_inside_a_git_tree_is_refused_and_nothing_is_written(tmp_path, capsys):
    root = _write_session(tmp_path, [USER, ASSISTANT, COST])
    repo = tmp_path / "repo"
    _git_init(repo)
    with pytest.raises(SystemExit) as exc:
        digest_mod.main(_args(root, "--out", str(repo / "deep/out")))
    assert exc.value.code == 2
    assert f"output folder is inside a git working tree: {repo.resolve()}; pass --out outside it" in capsys.readouterr().err
    assert not (repo / "deep").exists()


def test_git_variables_in_the_environment_do_not_hide_a_tree(tmp_path, monkeypatch):
    root = _write_session(tmp_path, [USER, ASSISTANT, COST])
    repo = tmp_path / "repo"
    _git_init(repo)
    monkeypatch.setenv("GIT_DIR", str(tmp_path / "nowhere"))
    with pytest.raises(SystemExit) as exc:
        digest_mod.main(_args(root, "--out", str(repo / "out")))
    assert exc.value.code == 2 and not (repo / "out").exists()


def test_a_folder_inside_the_git_directory_is_refused(tmp_path):
    root = _write_session(tmp_path, [USER, ASSISTANT, COST])
    repo = tmp_path / "repo"
    _git_init(repo)
    with pytest.raises(SystemExit) as exc:
        digest_mod.main(_args(root, "--out", str(repo / ".git/retro")))
    assert exc.value.code == 2 and not (repo / ".git/retro").exists()


def test_the_default_under_a_home_kept_in_git_is_refused(tmp_path, monkeypatch):
    root = _write_session(tmp_path / "t", [USER, ASSISTANT, COST])
    home = tmp_path / "home"
    _git_init(home)
    monkeypatch.setenv("HOME", str(home))
    with pytest.raises(SystemExit) as exc:
        digest_mod.main(_args(root))
    assert exc.value.code == 2
    assert not (home / ".cache").exists()


def test_the_default_output_is_under_the_home_cache(tmp_path, monkeypatch):
    root = _write_session(tmp_path / "t", [USER, ASSISTANT, COST])
    monkeypatch.setenv("HOME", str(tmp_path / "home"))
    digest_mod.main(_args(root))
    assert (tmp_path / "home/.cache/session-retrospective" / time.strftime("%Y-%m-%d") / "sessions.jsonl").is_file()


def test_an_output_folder_outside_any_tree_is_written(tmp_path):
    root = _write_session(tmp_path / "t", [USER, ASSISTANT, COST])
    digest_mod.main(_args(root, "--out", str(tmp_path / "free/out")))
    assert (tmp_path / "free/out/sessions.jsonl").is_file()


def test_the_output_folder_is_readable_by_its_owner_only(tmp_path):
    root = _write_session(tmp_path / "t", [USER, ASSISTANT, COST])
    out = tmp_path / "out"
    out.mkdir(mode=0o755)
    digest_mod.digest(root, out, 36500)
    assert out.stat().st_mode & 0o777 == 0o700


def test_a_symlinked_output_file_is_replaced_not_followed(tmp_path):
    root = _write_session(tmp_path / "t", [USER, ASSISTANT, COST])
    out, target = tmp_path / "out", tmp_path / "elsewhere.txt"
    out.mkdir()
    target.write_text("keep")
    for name in ("sessions.jsonl", "phases.tsv"):
        (out / name).symlink_to(target)
    digest_mod.digest(root, out, 36500)
    report_mod.main(out)
    assert target.read_text() == "keep"
    assert not (out / "sessions.jsonl").is_symlink() and not (out / "phases.tsv").is_symlink()


def test_the_report_refuses_a_digest_folder_inside_a_git_tree(tmp_path, capsys):
    root = _write_session(tmp_path / "t", [USER, ASSISTANT, COST])
    repo = tmp_path / "repo"
    _git_init(repo)
    digest_mod.digest(root, tmp_path / "out", 36500)
    shutil.move(str(tmp_path / "out"), str(repo / "out"))
    with pytest.raises(SystemExit) as exc:
        report_mod.main(repo / "out")
    assert exc.value.code == 2 and "inside a git working tree" in capsys.readouterr().err
    assert not (repo / "out/epics.tsv").exists()


# --- task 2.4: marks, result lines, rounds -------------------------------------------------------

MARK_LINES = json.loads((ROOT / "tests/fixtures/session-retrospective/mark-lines.json").read_text())
COST10 = {**COST, "totalCostUSD": 10.0}
MARK_X2 = "mark: change=x phase=deliver stage=2"
WORKER_LINE = "result: stage=2 role=reviewer lens=L1+L2 findings=3 accepted=-"
LEAD_LINE = "result: stage=2 role=reviewer lens=L1+L2 findings=3 accepted=1"


def _t(n):
    return f"2026-11-01T10:{n // 60:02d}:{n % 60:02d}Z"


def _a(n, *blocks):
    """An assistant record at second n holding the given content blocks."""
    return {"type": "assistant", "timestamp": _t(n),
            "message": {"id": f"m{n}", "model": "m", "usage": USAGE, "content": list(blocks)}}


def _text(s):
    return {"type": "text", "text": s}


def _tool(i, name, **inp):
    return {"type": "tool_use", "id": i, "name": name, "input": inp}


def _done(n, i):
    return {"type": "user", "timestamp": _t(n), "message": {"content": [{"type": "tool_result", "tool_use_id": i}]}}


def _brief(n):
    return {"type": "user", "timestamp": _t(n), "message": {"content": "brief"}}


def _review(tmp_path, records, agents=None):
    """Digest then report a synthetic session; returns (phases rows, rounds rows, signals text, events)."""
    root = _write_session(tmp_path, [USER, *records, COST10], agents=agents)
    out = tmp_path / "out"
    digest_mod.digest(root, out, 36500)
    report_mod.main(out)
    table = lambda name: [l.split("\t") for l in (out / name).read_text().splitlines()[1:]]
    events = [json.loads(l) for l in (out / "events.jsonl").open()]
    return table("phases.tsv"), table("rounds.tsv"), (out / "signals.txt").read_text(), events


@pytest.mark.parametrize("case", MARK_LINES, ids=[c["line"] or "(empty)" for c in MARK_LINES])
def test_the_shared_mark_lines_fixture(case):
    assert bool(digest_mod.MARK_RE.match(case["line"])) is case["mark"]


def test_a_session_with_marks_has_no_guessed_row(tmp_path):
    phases, _, signals, events = _review(tmp_path, [_a(1, _text(MARK_X2)), _a(3, _text("work")), _a(5, _text("more"))])
    assert [e["name"] for e in events if e["kind"] == "mark"] == ["x"]
    assert [(p[1], p[2], p[3]) for p in phases] == [("x", "deliver", "2")]
    assert "guessed share of cost: 0%" in signals


def test_a_late_mark_leaves_the_earlier_events_guessed(tmp_path):
    phases, _, signals, _ = _review(tmp_path, [_a(1, _text("early")), _a(3, _text(MARK_X2)), _a(5, _text("late"))])
    by_phase = {p[2]: p[3] for p in phases}
    assert by_phase == {"guessed:unmarked": "-", "deliver": "2"}
    assert "guessed share of cost: 33%" in signals


def test_a_malformed_mark_is_counted_and_ignored(tmp_path):
    phases, _, signals, events = _review(tmp_path, [_a(1, _text("mark: change=x phase=ship stage=2"))])
    assert [e["kind"] for e in events if e["kind"].startswith("mark")] == ["mark-bad"]
    assert [p[2] for p in phases] == ["guessed:unmarked"]
    assert "malformed mark lines: 1" in signals


def test_a_mark_inside_a_fence_is_ignored(tmp_path):
    phases, _, _, events = _review(tmp_path, [_a(1, _text(f"Example:\n```\n{MARK_X2}\n```\ndone"))])
    assert not [e for e in events if e["kind"].startswith("mark")]
    assert [p[2] for p in phases] == ["guessed:unmarked"]


def test_a_tilde_fence_hides_a_mark_and_a_backtick_line_inside_it_does_not_close_it(tmp_path):
    text = f"~~~\n{MARK_X2}\n~~~\nthen\n~~~\n```\n{MARK_X2}\n```\n~~~"
    _, _, _, events = _review(tmp_path, [_a(1, _text(text))])
    assert not [e for e in events if e["kind"].startswith("mark")]


def test_a_subagent_keeps_the_epic_phase_and_stage_of_its_spawn(tmp_path):
    lead = [_a(1, _text(MARK_X2)), _a(5, _text("mark: change=y phase=deliver stage=3")), _a(9, _text("end"))]
    sub = [_brief(2), _a(3, _text("a")), _a(7, _text("b"))]
    phases, _, _, _ = _review(tmp_path, lead, agents={"w": sub})
    assert ("x", "deliver/build", "2") in {(p[1], p[2], p[3]) for p in phases}
    assert not [p for p in phases if p[1] == "y" and p[2] == "deliver/build"]


def test_an_archive_skill_after_a_deliver_mark_is_guessed_from_there(tmp_path):
    after = {"type": "user", "timestamp": _t(5), "message": {"content": "see openspec/changes/next-one/tasks.md"}}
    lead = [_a(1, _text("mark: change=x phase=deliver stage=3")), _a(3, _tool("k", "Skill", skill="spec-stewardship")),
            _done(4, "k"), after, _a(6, _text("archiving"))]
    phases, _, _, _ = _review(tmp_path, lead)
    # F3: after the span ends the epic falls back to the path guess, not the archived change
    assert {(p[1], p[2], p[3]) for p in phases} == {("x", "deliver", "3"), ("next-one", "guessed:archive", "-")}


def test_a_commit_skill_keeps_the_mark_and_a_release_skill_ends_it(tmp_path):
    lead = [_a(1, _text("mark: change=x phase=deliver stage=3")), _a(3, _tool("k", "Skill", skill="meaningfy-core:meaningfy-git-workflow")),
            _done(4, "k"), _a(6, _text("committed")), _a(8, _tool("r", "Skill", skill="meaningfy-building:meaningfy-release")),
            _done(9, "r"), _a(11, _text("released"))]
    phases, _, _, _ = _review(tmp_path, lead)
    assert {(p[2], p[3]) for p in phases} == {("deliver", "3"), ("guessed:release", "-")}
    lead = lead[:4]
    phases, _, _, _ = _review(tmp_path / "b", lead)
    assert {(p[2], p[3]) for p in phases} == {("deliver", "3")}


def test_a_session_with_no_mark_files_its_events_as_guessed(digest_dir):
    report_mod.main(digest_dir)  # the demo fixture has a Skill call and no mark
    signals = (digest_dir / "signals.txt").read_text()
    assert "guessed share of cost: 100%" in signals and "guessed:deliver" in signals


def test_worker_line_and_lead_line_in_a_body_file_make_one_round(tmp_path):
    lead = [_a(1, _text(MARK_X2)), _a(5, _tool("w", "Write", file_path="/b.md", content=f"body\n{LEAD_LINE}\n")), _done(6, "w")]
    sub = [_brief(2), _a(3, _text(f"findings:\n{WORKER_LINE}"))]
    _, rounds, signals, _ = _review(tmp_path, lead, agents={"r": sub})
    assert rounds == [["demo", "x", "s1", "2", "reviewer", "L1+L2", "1", "3", "1", "-"]]
    assert "reviewer" in signals


def test_a_lead_quoting_an_unaccepted_line_adds_no_round(tmp_path):
    lead = [_a(1, _text(MARK_X2)), _a(5, _text(f"The worker wrote:\n{WORKER_LINE}"))]
    _, rounds, _, _ = _review(tmp_path, lead, agents={"r": [_brief(2), _a(3, _text(WORKER_LINE))]})
    assert [(r[6], r[8]) for r in rounds] == [("1", "-")]


def test_a_re_review_is_a_second_round(tmp_path):
    lead = [_a(1, _text(MARK_X2)), _a(5, _text(LEAD_LINE)), _a(9, _text(LEAD_LINE.replace("accepted=1", "accepted=0")))]
    sub = [_brief(2), _a(3, _text(WORKER_LINE)), _a(7, _text(WORKER_LINE))]
    _, rounds, _, _ = _review(tmp_path, lead, agents={"r": sub})
    assert [(r[6], r[8]) for r in rounds] == [("1", "1"), ("2", "0")]


def test_a_lead_line_with_no_worker_line_is_one_round_and_a_repeat_adds_none(tmp_path):
    body = f"gh pr create --title t --body \"$(cat <<'EOF'\nsummary\n- {LEAD_LINE}\nEOF\n)\""
    lead = [_a(1, _text(MARK_X2)), _a(3, _tool("p", "Bash", command=body)), _done(4, "p"),
            _a(5, _tool("q", "Bash", command=body.replace("create", "edit"))), _done(6, "q")]
    _, rounds, _, _ = _review(tmp_path, lead)
    assert [(r[4], r[6], r[8]) for r in rounds] == [("reviewer", "1", "1")]


def test_an_edited_pr_body_repeating_an_earlier_round_does_not_fill_a_later_one(tmp_path):
    w3, w1 = WORKER_LINE, WORKER_LINE.replace("findings=3", "findings=1")
    l3, l1 = LEAD_LINE, LEAD_LINE.replace("findings=3 accepted=1", "findings=1 accepted=0")
    body = f"gh pr edit 7 --body \"$(cat <<'EOF'\n- {l3}\n- {l1}\nEOF\n)\""
    lead = [_a(1, _text(MARK_X2)), _a(5, _text(l3)), _a(9, _tool("p", "Bash", command=body)), _done(10, "p")]
    sub = [_brief(2), _a(3, _text(w3)), _a(7, _text(w1))]
    _, rounds, _, _ = _review(tmp_path, lead, agents={"r": sub})
    assert [(r[6], r[7], r[8]) for r in rounds] == [("1", "3", "1"), ("2", "1", "0")]


def test_a_quoted_lead_line_in_a_pr_body_keeps_its_count(tmp_path):
    body = f'gh pr create --title t --body "summary\n{LEAD_LINE}"'
    lead = [_a(1, _text(MARK_X2)), _a(3, _tool("p", "Bash", command=body)), _done(4, "p")]
    _, rounds, _, _ = _review(tmp_path, lead)
    assert [(r[6], r[8]) for r in rounds] == [("1", "1")]


# --- stage-1 review fixes: malformed records ------------------------------------------------------

@pytest.mark.parametrize("bad", [
    {**ASSISTANT, "message": "x"},
    {**USER, "message": {"content": 5}},
    {**ASSISTANT, "message": {"id": "m9", "usage": USAGE, "content": ["str", {"type": "text", "text": "ok"}]}},
    {**ASSISTANT, "timestamp": None},
    {**ASSISTANT, "message": {"id": "m9", "usage": "x", "content": []}},
], ids=["message", "content", "block", "no-timestamp", "usage"])
def test_a_wrong_shape_record_is_counted_malformed_and_skipped(tmp_path, bad):
    path = tmp_path / "s.jsonl"
    path.write_text(_jsonl([USER, bad, ASSISTANT]))
    st, _ = digest_mod.parse_stream(path, "s")
    assert st["unknown"]["(malformed)"] == 1  # a bad block drops the block only, the other kinds the whole record


def test_a_corrupt_agent_meta_is_counted_malformed(tmp_path, capsys):
    root = _write_session(tmp_path, [USER, ASSISTANT, COST], agents={"a": [_brief(2), _a(3, _text("x"))]})
    (tmp_path / "projects/-x/s1/subagents/agent-a.meta.json").write_text("{not json")
    assert _run(root, tmp_path) == 1
    assert "(malformed)=1" in capsys.readouterr().err


def test_a_fenced_result_line_is_ignored(tmp_path):
    lead = [_a(1, _text(MARK_X2)), _a(3, _text(f"```\n{LEAD_LINE}\n```"))]
    _, rounds, _, _ = _review(tmp_path, lead)
    assert rounds == []


@pytest.mark.parametrize("missing", ["sessions.jsonl", "agents.jsonl", "events.jsonl"])
def test_report_exits_2_naming_the_missing_file(digest_dir, tmp_path, capsys, missing):
    (digest_dir / missing).unlink()
    with pytest.raises(SystemExit) as exc:
        report_mod.main(digest_dir)
    assert exc.value.code == 2
    assert missing in capsys.readouterr().err
