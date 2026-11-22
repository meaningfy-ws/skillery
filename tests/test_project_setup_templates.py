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


needs_make = pytest.mark.skipif(
    shutil.which("bash") is None or shutil.which("make") is None, reason="bash and make required"
)
needs_bash = pytest.mark.skipif(shutil.which("bash") is None, reason="bash required to run scaffold.sh")

GITNEXUS_BLOCK = "\n<!-- gitnexus:start -->\n# GitNexus: Code Intelligence\nblock\n<!-- gitnexus:end -->\n"


def _bindings(repo: Path) -> subprocess.CompletedProcess:
    return subprocess.run(["make", "check-bindings"], cwd=repo, capture_output=True, text=True)


@needs_make
def test_scaffolded_repository_passes_check_bindings(tmp_path):
    _scaffold(tmp_path)
    assert (tmp_path / "AGENTS.md").exists() and (tmp_path / "CLAUDE.md").exists()
    ok = _bindings(tmp_path)
    assert ok.returncode == 0, ok.stdout + ok.stderr
    assert "no GitNexus block" in ok.stdout  # the done line


@needs_make
@pytest.mark.parametrize(
    "addition",
    [
        "\n<!-- gitnexus:start -->\nblock\n<!-- gitnexus:end -->\n",
        "\n<!-- GITNEXUS:START -->\n",
        "\n# GitNexus\n",
        "\n## GitNexus Code Intelligence\n",
        "\n###### gitnexus notes\n",
    ],
    ids=["marker", "upper-case marker", "heading", "deeper heading", "deepest heading"],
)
def test_check_bindings_fails_on_a_block_in_claude(tmp_path, addition):
    _scaffold(tmp_path)
    claude = tmp_path / "CLAUDE.md"
    claude.write_text(_text(claude) + addition, encoding="utf-8")
    bad = _bindings(tmp_path)
    assert bad.returncode != 0
    assert "CLAUDE.md" in bad.stdout + bad.stderr and "AGENTS.md" in bad.stdout + bad.stderr


@needs_make
def test_check_bindings_passes_with_the_block_in_agents(tmp_path):
    _scaffold(tmp_path)
    agents = tmp_path / "AGENTS.md"
    agents.write_text(_text(agents) + GITNEXUS_BLOCK, encoding="utf-8")
    done = _bindings(tmp_path)
    assert done.returncode == 0, done.stdout + done.stderr


@needs_make
def test_check_bindings_fails_when_agents_is_over_its_budget(tmp_path):
    _scaffold(tmp_path)
    agents = tmp_path / "AGENTS.md"
    budget = int(re.match(r"<!-- size budget: (\d+) characters -->", _text(agents)).group(1))
    agents.write_text(_text(agents) + "x" * budget, encoding="utf-8")
    bad = _bindings(tmp_path)
    assert bad.returncode != 0
    assert "AGENTS.md" in bad.stdout + bad.stderr and f"budget of {budget}" in bad.stdout + bad.stderr


@needs_make
def test_check_bindings_counts_characters_not_bytes(tmp_path):
    _scaffold(tmp_path)
    agents = tmp_path / "AGENTS.md"
    first, _, rest = _text(agents).partition("\n")
    budget = int(re.match(r"<!-- size budget: (\d+) characters -->", first).group(1))
    # exactly at the budget, in two-byte characters: over in bytes, within in characters
    agents.write_text(first + "\n" + "ț" * budget, encoding="utf-8")
    done = _bindings(tmp_path)
    assert done.returncode == 0, done.stdout + done.stderr


@needs_make
def test_check_bindings_passes_with_no_claude_file(tmp_path):
    _scaffold(tmp_path)
    (tmp_path / "CLAUDE.md").unlink()
    done = _bindings(tmp_path)
    assert done.returncode == 0 and done.stderr == ""


def test_check_bindings_matches_the_marker_or_a_heading_case_insensitively():
    """The template's pattern is broader than the lint's exact marker on purpose (D-54)."""
    target = _make_target(_text(MAKEFILE), "check-bindings")
    assert "grep -qiE" in target and "gitnexus:start" in target and "^#+ .*GitNexus" in target
    assert "CLAUDE.md" in target and "exit 1" in target


def test_reindex_prints_a_progress_line():
    assert "ICON_PROGRESS" in _make_target(_text(MAKEFILE), "reindex")


def _run_scaffold(target: Path, *extra: str, script: Path = SCAFFOLD, name: str = "Order Processing"):
    return subprocess.run(
        ["bash", str(script), "-p", "orders", "-n", name, "-a", "product",
         "--no-lock", "--no-docs", "--no-infra", "--target", str(target), *extra],
        cwd=ROOT, capture_output=True, text=True, stdin=subprocess.DEVNULL, timeout=120,
    )


def _snapshot(root: Path) -> dict[str, bytes]:
    return {str(p.relative_to(root)): p.read_bytes() for p in sorted(root.rglob("*")) if p.is_file()}


@needs_bash
def test_skip_existing_rerun_is_idempotent_and_keeps_an_edit(tmp_path):
    assert _run_scaffold(tmp_path, "--skip-existing").returncode == 0
    (tmp_path / "AGENTS.md").write_text("# my own edit\n", encoding="utf-8")
    (tmp_path / ".serena/project.yml").write_text("project_name: edited\n", encoding="utf-8")
    before = _snapshot(tmp_path)
    again = _run_scaffold(tmp_path, "--skip-existing")
    assert again.returncode == 0, again.stdout + again.stderr
    assert _snapshot(tmp_path) == before
    assert "skip (exists): .serena/project.yml" in again.stdout


@needs_bash
def test_rerun_without_a_flag_and_no_terminal_fails_naming_both_flags(tmp_path):
    assert _run_scaffold(tmp_path, "--skip-existing").returncode == 0
    (tmp_path / "AGENTS.md").write_text("# my own edit\n", encoding="utf-8")
    before = _snapshot(tmp_path)
    again = _run_scaffold(tmp_path)
    assert again.returncode != 0
    message = again.stdout + again.stderr
    assert "--skip-existing" in message and "--force" in message and "exists" in message
    assert "--skip-existing" in message.strip().splitlines()[-1], "one clear last line"
    assert _snapshot(tmp_path) == before


@needs_bash
def test_force_restores_a_user_edit_of_the_serena_project(tmp_path):
    assert _run_scaffold(tmp_path, "--skip-existing").returncode == 0
    (tmp_path / ".serena/project.yml").write_text("project_name: edited\n", encoding="utf-8")
    assert _run_scaffold(tmp_path, "--force").returncode == 0
    assert yaml.safe_load(_text(tmp_path / ".serena/project.yml"))["project_name"] == "orders"


@needs_make
def test_target_path_with_spaces(tmp_path):
    target = tmp_path / "my repo" / "with space"
    done = _run_scaffold(target, "--skip-existing")
    assert done.returncode == 0, done.stdout + done.stderr
    assert (target / ".serena/project.yml").exists() and (target / "CLAUDE.md").exists()
    assert _bindings(target).returncode == 0


@needs_bash
def test_project_name_with_sed_metacharacters_renders_literally(tmp_path):
    name = "R&D | Orders \\ Co"
    done = _run_scaffold(tmp_path, "--skip-existing", name=name)
    assert done.returncode == 0, done.stdout + done.stderr
    assert name in _text(tmp_path / "AGENTS.md")


@needs_bash
def test_typescript_flag_and_frontend_folder_list_typescript_once(tmp_path):
    (tmp_path / "frontend").mkdir()
    assert _run_scaffold(tmp_path, "--skip-existing", "--typescript").returncode == 0
    assert yaml.safe_load(_text(tmp_path / ".serena/project.yml"))["language_servers"] == ["python", "typescript"]


@needs_bash
def test_missing_template_fails_naming_the_template_and_leaves_no_temp_file(tmp_path):
    skill = tmp_path / "skill"
    shutil.copytree(SKILL, skill)
    (skill / "assets/templates/root/dot-serena-project.yml.tmpl").unlink()
    target = tmp_path / "out"
    done = _run_scaffold(target, "--skip-existing", script=skill / "scripts/scaffold.sh")
    assert done.returncode != 0
    assert "MISSING TEMPLATE" in done.stderr and "dot-serena-project.yml.tmpl" in done.stderr
    assert not list(target.rglob("*.tmp"))


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


# ---- issue #197: CI is light, the local gate runs in parallel -------------------------------

CI_CODE = TPL / "ci/ci.yaml.tmpl"
CI_DOC_ONLY = TPL / "ci/ci-doc-only.yaml.tmpl"
CI_REFERENCE = SKILL / "references/ci-and-infra.md"

# What CI must not run: the full toolchain, the test suite, any artefact build.
HEAVY_CI_STEPS = (
    "make install\n", "make test", "make build", "make typecheck", "make check-architecture",
    "make check-semgrep", "make check-layout", "make check-makefile", "make clean-code",
    "make ci-", "make check-all", "--all-groups", "pytest",
)


def _ci_runs(path: Path) -> list[str]:
    doc = yaml.safe_load(_text(path).replace("<<", "").replace(">>", ""))
    return [step["run"] for job in doc["jobs"].values() for step in job["steps"] if "run" in step]


@pytest.mark.parametrize("path", [CI_CODE, CI_DOC_ONLY])
def test_ci_template_is_the_light_set_only(path):
    text = "\n".join(_ci_runs(path)) + "\n"
    for heavy in HEAVY_CI_STEPS:
        assert heavy not in text, heavy
    assert "make validate-spine" in text and "make check-bindings" in text


def test_code_ci_lints_and_installs_only_the_lint_group():
    runs = "\n".join(_ci_runs(CI_CODE))
    assert "make lint" in runs and "make install-lint" in runs
    assert "--only-group lint" in _make_target(_text(MAKEFILE), "install-lint")


@pytest.mark.parametrize("path", [CI_CODE, CI_DOC_ONLY])
def test_ci_templates_build_and_upload_nothing(path):
    text = _text(path).lower()
    assert "upload-artifact" not in text and "sonar" not in text and "coverage.xml" not in text


def test_check_all_runs_separate_targets_in_parallel():
    text = _text(MAKEFILE)
    target = _make_target(text, "check-all")
    assert "$(MAKE) -k -O -j$(JOBS)" in target and "$(CHECKS)" in target
    assert re.search(r"^JOBS \?= .*nproc.*\|\| .*echo \d", text, re.M)
    checks = re.search(r"^CHECKS\s*=\s*(.+)$", text, re.M).group(1).split()
    for name in ("lint", "typecheck", "check-architecture", "check-bindings", "check-semgrep",
                 "check-layout", "check-makefile", "validate-spine", "test"):
        assert name in checks
        _make_target(text, name)  # each stays a target of its own


def test_check_all_says_which_targets_must_stay_serial():
    text = _text(MAKEFILE)
    comment = text[: text.index("\ncheck-all:")].rsplit("\n\n", 1)[-1]
    assert "coverage.xml" in comment and "serial" in comment


@needs_make
def test_scaffolded_check_all_lists_the_parallel_targets(tmp_path):
    _scaffold(tmp_path)
    # The first line of a dry run is the parallel invocation. GNU make 4.3 can crash in the
    # sub-make's output sync under some sandboxes, so the targets it names are listed by a plain
    # dry run of their own (same targets, no -O) instead of through check-all's sub-make.
    out = subprocess.run(["make", "-n", "check-all"], cwd=tmp_path, capture_output=True, text=True)
    invocation = re.search(r"^make.* -k -O -j\d+ (lint typecheck check-architecture .+)$", out.stdout, re.M)
    assert invocation, out.stdout + out.stderr
    listed = subprocess.run(["make", "-n", *invocation.group(1).split()], cwd=tmp_path, capture_output=True, text=True)
    assert listed.returncode == 0, listed.stderr
    for command in ("ruff check", "mypy", "lint-imports", "pytest", "openspec"):
        assert command in listed.stdout, command


def test_the_gate_reference_splits_light_ci_from_the_parallel_local_gate():
    text = _text(CI_REFERENCE)
    assert "light" in text.lower() and "make check-all" in text and "-j" in text
    assert "result line" in text and "pull request" in text.lower()
