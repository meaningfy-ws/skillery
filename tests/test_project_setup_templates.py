"""project-setup's lean templates (lean-project-templates spec, design D-13 and D-49).

Quiet gates, the thin AGENTS template, code intelligence where the agents work, the bindings check.
The probe at the end runs the real scaffold.sh into a temporary repository.
"""
from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills/project-setup"
TPL = SKILL / "assets/templates"
SCAFFOLD = SKILL / "scripts/scaffold.sh"
PYTEST_INI = TPL / "root/pytest.ini"
MAKEFILE = TPL / "root/Makefile.tmpl"
AGENTS = TPL / "agentic/AGENTS.md.tmpl"
CLAUDE = TPL / "agentic/CLAUDE.md.tmpl"
SERENA = TPL / "root/dot-serena-project.yml.tmpl"

GATE_ROWS = ("Narrow checks", "Task gate", "Full gates", "Docs gate", "Code intelligence")

# Phrases the thin template no longer carries: each restates a skill or the global routing.
RESTATED = (
    "Authority by consent",
    "Golden thread",
    "The loop, scaled by appetite",
    "Success and failure first",
    "Never poll: run one background command",
    "Edit files with the edit tool, never a shell",
    "Read a range, not the whole file",
    "fresh session at a task boundary",
    "take the base report back",
    "Debugging → **superpowers:systematic-debugging**",
    "Commits / branches / PRs → **meaningfy-git-workflow** (mechanics via",
)


def _text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _make_target(text: str, name: str) -> str:
    """The target's line and its recipe lines (up to the next blank line)."""
    m = re.search(rf"^{re.escape(name)}:.*?(?=\n\n|\Z)", text, re.S | re.M)
    assert m, f"no target {name}"
    return m.group(0)


def _addopts(text: str) -> list[str]:
    m = re.search(r"^addopts\s*=\s*\n((?:[ \t]+.*\n)+)", text, re.M)
    assert m, "no addopts block"
    return [ln.strip() for ln in m.group(1).splitlines() if ln.strip() and not ln.strip().startswith("#")]


def test_pytest_ini_prints_a_result_not_a_log():
    opts = _addopts(_text(PYTEST_INI))
    assert opts == ["-q", "-rfE", "--strict-markers", "--tb=short"]
    assert "a gate prints its result, not its log" in _text(PYTEST_INI).lower()


def test_cov_flags_write_xml_only():
    block = re.search(r"^COV_FLAGS\s*=.*?(?=\n\n|\n#)", _text(MAKEFILE), re.S | re.M).group(0)
    assert "term-missing" not in block
    assert "--cov-report=xml:" in block
    assert "--cov=$(PACKAGE_NAME)" in block and "--cov-fail-under=80" in block


def test_test_target_comment_says_why_no_table():
    above = _text(MAKEFILE).split("test: ## Run all tests")[0].rstrip().splitlines()[-2:]
    assert all(ln.startswith("#") for ln in above), above
    assert "coverage.xml" in " ".join(above) and "no coverage table" in " ".join(above)


def test_reindex_target_keeps_the_agents_files_untouched():
    target = _make_target(_text(MAKEFILE), "reindex")
    assert "npx gitnexus analyze --skip-agents-md" in target


def test_agents_template_has_the_gate_shape_table():
    text = _text(AGENTS)
    assert "- **Checks:**" in text
    block = text.split("- **Checks:**", 1)[1].split("\n- **Code intelligence:**", 1)[0]
    rows = [ln.strip() for ln in block.splitlines() if ln.strip().startswith("|")]
    body = [r for r in rows if not set(r) <= set("|-: ")][1:]  # drop the header row
    assert len(body) == 5, rows
    for name, row in zip(GATE_ROWS, body):
        assert name in row, (name, row)
    assert "`no-poll-loops`" in block and "`quiet-tools`" in block and "`meaningfy-core`" in block


def test_agents_template_keeps_the_gitnexus_block_at_two_points():
    text = _text(AGENTS)
    assert "npx gitnexus analyze --skip-agents-md" in text
    assert "stage start" in text and "last commit" in text
    assert "GitNexus repo name" in text


@pytest.mark.parametrize("phrase", RESTATED)
def test_agents_template_does_not_restate_a_skill(phrase):
    assert phrase not in _text(AGENTS)


def test_agents_template_points_to_the_owning_skills():
    text = _text(AGENTS)
    for skill in ("epic-delivery", "guardrails", "test-strategy", "meaningfy-git-workflow"):
        assert f"`{skill}`" in text or f"**{skill}**" in text, skill


def test_agents_template_is_smaller_than_before():
    # 9426 bytes before D-13; the budget comment on its first line is the ceiling the lint enforces.
    assert len(_text(AGENTS).encode("utf-8")) < 7500


def test_claude_template_has_no_gitnexus_block_and_says_why():
    text = _text(CLAUDE)
    assert "gitnexus:start" not in text
    assert "@AGENTS.md" in text
    assert re.search(r"<!--[^>]*lint forbids the GitNexus block here[^>]*-->", text)


def test_serena_template_lists_python_and_the_worktree_note():
    text = _text(SERENA)
    doc = yaml.safe_load(text.replace("<<PROJECT_SLUG>>", "demo").replace("<<SERENA_EXTRA_SERVERS>>", ""))
    assert doc["language_servers"][0] == "python"
    assert doc["ls_workspace_folders"] == ["."]
    assert "worktree" in text and "its own Serena project" in text
    assert "typescript" in text and "frontend/" in text


def test_check_bindings_is_wired_into_the_quality_gate():
    text = _text(MAKEFILE)
    quality = re.search(r"^check-quality:\s*([^#\n]*?)\s*##", text, re.M).group(1).split()
    assert "check-bindings" in quality
    target = _make_target(text, "check-bindings")
    assert "gitnexus:start" in target and "CLAUDE.md" in target and "exit 1" in target
    assert ".PHONY" in text and "check-bindings" in re.search(r"^\.PHONY:.*check-bindings.*$", text, re.M).group(0)


def test_scaffold_writes_the_serena_project():
    assert "dot-serena-project.yml.tmpl" in _text(SCAFFOLD)
    assert ".serena/project.yml" in _text(SCAFFOLD)


def _scaffold(target: Path, *extra: str) -> None:
    subprocess.run(
        ["bash", str(SCAFFOLD), "-p", "orders", "-n", "Order Processing", "-a", "product",
         "--no-lock", "--no-docs", "--no-infra", "--target", str(target), "--skip-existing", *extra],
        cwd=ROOT, check=True, capture_output=True, text=True,
    )


@pytest.mark.skipif(shutil.which("bash") is None or shutil.which("make") is None, reason="bash and make required")
def test_scaffolded_repository_passes_check_bindings(tmp_path):
    _scaffold(tmp_path)
    assert (tmp_path / "AGENTS.md").exists() and (tmp_path / "CLAUDE.md").exists()
    ok = subprocess.run(["make", "check-bindings"], cwd=tmp_path, capture_output=True, text=True)
    assert ok.returncode == 0, ok.stdout + ok.stderr

    (tmp_path / "CLAUDE.md").write_text(
        _text(tmp_path / "CLAUDE.md") + "\n<!-- gitnexus:start -->\nblock\n<!-- gitnexus:end -->\n", encoding="utf-8")
    bad = subprocess.run(["make", "check-bindings"], cwd=tmp_path, capture_output=True, text=True)
    assert bad.returncode != 0
    assert "CLAUDE.md" in bad.stdout + bad.stderr and "AGENTS.md" in bad.stdout + bad.stderr


@pytest.mark.skipif(shutil.which("bash") is None, reason="bash required to run scaffold.sh")
@pytest.mark.parametrize("extra, servers", [((), ["python"]), (("--typescript",), ["python", "typescript"])])
def test_scaffold_fills_the_serena_language_servers(tmp_path, extra, servers):
    _scaffold(tmp_path, *extra)
    doc = yaml.safe_load(_text(tmp_path / ".serena/project.yml"))
    assert doc["language_servers"] == servers
    assert doc["project_name"] == "orders"


@pytest.mark.skipif(shutil.which("bash") is None, reason="bash required to run scaffold.sh")
def test_scaffold_detects_a_frontend_folder(tmp_path):
    (tmp_path / "frontend").mkdir()
    _scaffold(tmp_path)
    assert yaml.safe_load(_text(tmp_path / ".serena/project.yml"))["language_servers"] == ["python", "typescript"]
