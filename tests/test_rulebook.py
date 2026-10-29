"""The rulebook script decides the rule-learning scenarios (openspec/changes/archive/2026-10-29-rule-learner).

Fixtures under tests/fixtures/rulebook/: `vault/` is a small vault whose `08 How to/Rules/` holds one
note per case of PLAN task 1.2 (the writing rules R-0001..R-0014, the structural cases R-0020..R-0049
in the activities `testing`, `cycles` and `loops`), a Writing playbook with two golden examples and
one candidate in `00 Inbox/proposed/`.

`langfuse-observations.json` follows the Langfuse public API response of `GET
/api/public/observations` (`{"data": [{"id", "type", "name", "startTime", "input", "output", ...}],
"meta": {"page", "totalPages", ...}}`, `type` one of SPAN, GENERATION, EVENT). That shape is
assumption O-1 of the design: Langfuse is not deployed yet, so it is modelled on the documented API,
not on a saved response. Task 6.1 replaces it with a sanitised real one.

The clock is fixed with `--today`.
"""
import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "skills/rulebook/scripts/rules.py"
FIX = ROOT / "tests/fixtures/rulebook"
VAULT = FIX / "vault"
RULES = "08 How to/Rules"
PROPOSED = "00 Inbox/proposed"
TODAY = "2026-10-29"


def _module():
    if "rulebook_rules" not in sys.modules:
        spec = importlib.util.spec_from_file_location("rulebook_rules", SCRIPT)
        sys.modules[spec.name] = importlib.util.module_from_spec(spec)  # dataclasses look the module up
        spec.loader.exec_module(sys.modules[spec.name])
    return sys.modules["rulebook_rules"]


def run(*args, vault=VAULT, env=None, cwd=None):
    e = {k: v for k, v in os.environ.items() if not k.startswith(("LANGFUSE_", "MEANINGFY_VAULT"))}
    if vault is not None:
        e["MEANINGFY_VAULT"] = str(vault)
    e.update(env or {})
    return subprocess.run([sys.executable, str(SCRIPT), *args], capture_output=True, text=True,
                          encoding="utf-8", env=e, cwd=cwd or ROOT, timeout=60)


@pytest.fixture
def vault(tmp_path):
    dest = tmp_path / "vault"
    shutil.copytree(VAULT, dest)
    return dest


def _note(vault, rid, folder=RULES):
    paths = sorted((vault / folder).glob(f"{rid} *.md"))
    assert len(paths) == 1, paths
    return paths[0]


def _meta(path):
    return _module().parse_note(path.read_text(encoding="utf-8"))[0]


def _lines(out, prefix):
    return [line for line in out.splitlines() if line.startswith(prefix)]


# ---------------------------------------------------------------- reader and writer (D-3)

OBSIDIAN = {"R-0013 sign with the full name.md"}
HAND_EDITED = OBSIDIAN | {"R-0046 broken.md", "R-0047 put the summary first.md",
                          "R-0048 put the summary second.md", "R-0049 put the summary third.md"}


@pytest.mark.parametrize("path", [p for p in sorted((VAULT / RULES).glob("*.md")) if p.name not in HAND_EDITED],
                         ids=lambda p: p.name)
def test_writer_output_is_byte_stable(path):
    rules = _module()
    text = path.read_text(encoding="utf-8")
    meta, body = rules.parse_note(text)
    assert rules.dump_note(meta, body) == text


def test_round_trip_of_awkward_values():
    rules = _module()
    meta = {"kind": "rule", "id": "R-0100", "scope": ["activity:*", "audience:client"],
            "when": "a value: with a colon", "do": "# not a comment", "because": " padded ",
            "source": 'she said "no" \\ twice', "check_absent": r"it's \d+", "private": "true"}
    text = rules.dump_note(meta, "body\n")
    assert rules.parse_note(text) == (meta, "body\n")
    assert rules.dump_note(*rules.parse_note(text)) == text
    assert "check_absent: 'it''s \\d+'" in text


def test_obsidian_rewritten_note_parses_to_equal_values():
    meta, _ = _module().parse_note((VAULT / RULES / "R-0013 sign with the full name.md").read_text(encoding="utf-8"))
    assert meta["id"] == "R-0013"
    assert meta["strength"] == "default"
    assert meta["scope"] == ["activity:writing", "channel:email"]
    assert meta["when"] == "signing an email"
    assert meta["do"] == "sign with the full name"
    assert meta["source"] == "2026-09-01 session, owner: 'sign with the full name'"


def test_unparseable_note_raises_not_crashes():
    with pytest.raises(ValueError):
        _module().parse_note((VAULT / RULES / "R-0046 broken.md").read_text(encoding="utf-8"))


# ---------------------------------------------------------------- load (D-4, D-6)

def test_default_with_exception():
    out = run("load", "--activity", "writing", "--context", "audience=us-client").stdout
    assert _lines(out, "R-0002 [default] spelling=american")
    assert not _lines(out, "R-0001 ")


def test_global_rule_and_activity_rule():
    out = run("load", "--activity", "writing").stdout
    assert _lines(out, "R-0005 [default] length=long")
    assert not _lines(out, "R-0004 ")
    assert "CONFLICT" not in out


def test_global_rule_applies_to_any_activity():
    assert _lines(run("load", "--activity", "sales").stdout, "R-0004 [default] length=short")


def test_unresolvable_conflict():
    out = run("load", "--activity", "testing", "--context", "client=public", "--context", "channel=tender").stdout
    assert _lines(out, "R-0031 ") and _lines(out, "R-0032 ")
    assert "CONFLICT R-0031 vs R-0032 on pricing: ask the owner" in out


def test_exception_chain_of_three():
    out = run("load", "--activity", "writing", "--context", "audience=us-client",
              "--context", "channel=tender").stdout
    assert _lines(out, "R-0003 [default] spelling=british")
    assert not _lines(out, "R-0001 ") and not _lines(out, "R-0002 ")


def test_beats_cycle_prints_no_winner():
    out = run("load", "--activity", "loops", "--context", "lang=en", "--context", "channel=chat").stdout
    assert "CONFLICT on order (no winner): ask the owner" in out


def test_load_shape():
    r = run("load", "--activity", "writing")
    assert r.returncode == 0
    out = r.stdout
    assert out.startswith("PLAYBOOK Writing")
    assert out.rstrip().endswith("-- end --")
    assert "SKIPPED R-0046 broken.md" in out
    assert not _lines(out, "R-0014 "), "a dropped rule is never loaded"
    assert not _lines(out, "R-0050 "), "a candidate is never loaded"
    assert not _lines(out, "R-0002 "), "a rule outside the context is never loaded"
    assert _lines(out, "R-0010 [hard] use no em dash")
    assert _lines(out, "CHECK R-0010")


# ---------------------------------------------------------------- check

def test_check_pattern_fails(tmp_path):
    draft = tmp_path / "draft.md"
    draft.write_text("Hello.\nThe pilot is ready — we start on Monday.\n", encoding="utf-8")
    r = run("check", "--activity", "writing", str(draft))
    assert r.returncode == 1
    assert "VIOLATION R-0010 line 2:" in r.stdout
    assert r.stdout.rstrip().endswith("-- end --")


def test_check_passes(tmp_path):
    draft = tmp_path / "draft.md"
    draft.write_text("Hello, we start on Monday.\n", encoding="utf-8")
    r = run("check", "--activity", "writing", str(draft))
    assert r.returncode == 0, r.stdout
    assert "VIOLATION" not in r.stdout


def test_check_golden():
    r = run("check", "--golden")
    assert r.returncode == 1
    assert "GOLDEN 03 Resources/Bad memo.md: FAIL" in r.stdout
    assert "GOLDEN 03 Resources/Good memo.md: ok" in r.stdout
    assert "GOLDEN 03 Resources/Client memo.md: ok" in r.stdout
    assert "VIOLATION R-0010 line 6:" in r.stdout  # line numbers count the frontmatter


# ---------------------------------------------------------------- lint (D-4, D-5)

LINT = None


def _lint():
    global LINT
    if LINT is None:
        LINT = run("lint")
    return LINT


def test_lint_exits_1_on_errors():
    assert _lint().returncode == 1


@pytest.mark.parametrize("level,code,needle", [
    ("ERROR", "parse", "R-0046 broken.md"),
    ("ERROR", "invalid", "R-0044: status"),
    ("ERROR", "duplicate-id", "R-0045"),
    ("ERROR", "cycle", "exception_of: R-0037 R-0038"),
    ("ERROR", "cycle", "supersedes: R-0039 R-0040"),
    ("ERROR", "narrow-exception", "R-0034"),
    ("ERROR", "narrow-exception", "R-0047"),
    ("ERROR", "dangling", "R-0041"),
    ("ERROR", "regex", "R-0043"),
    ("ERROR", "missing", "R-0042: no 'source'"),
    ("WARNING", "conflict", "R-0031 and R-0032"),
    ("WARNING", "dead", "R-0021"),
    ("WARNING", "dead", "R-0022"),
    ("WARNING", "redundant", "R-0025"),
    ("WARNING", "duplicate", "R-0026 and R-0027"),
    ("WARNING", "weak-exception", "R-0036"),
    ("WARNING", "vocabulary", "R-0011"),
])
def test_lint_finding(level, code, needle):
    found = [line for line in _lint().stdout.splitlines() if line.startswith(f"{level} {code}:") and needle in line]
    assert found, f"no {level} {code} naming {needle}:\n{_lint().stdout}"


def test_a_dead_rule_names_its_winner():
    line = next(x for x in _lint().stdout.splitlines() if x.startswith("WARNING dead:") and "R-0021" in x)
    assert "R-0020" in line
    line = next(x for x in _lint().stdout.splitlines() if x.startswith("WARNING dead:") and "R-0022" in x)
    assert "R-0023" in line


@pytest.mark.parametrize("rid", ["R-0003", "R-0030", "R-0024", "R-0001", "R-0005", "R-0004"])
def test_not_redundant(rid):
    assert not [x for x in _lint().stdout.splitlines() if x.startswith(f"WARNING redundant: {rid}:")]


def test_duplicates_reported_once():
    lines = [x for x in _lint().stdout.splitlines() if "R-0026" in x or "R-0027" in x]
    assert len(lines) == 1, lines


def test_no_conflict_reported_for_global_and_activity_rule():
    assert not [x for x in _lint().stdout.splitlines() if x.startswith("WARNING conflict:") and "R-0004" in x]


def test_lint_clean_vault_exits_0(tmp_path):
    clean = tmp_path / "vault"
    (clean / RULES).mkdir(parents=True)
    for name in ("R-0001 use British English spelling.md", "R-0002 use American spelling.md"):
        shutil.copy(VAULT / RULES / name, clean / RULES / name)
    r = run("lint", vault=clean)
    assert r.returncode == 0, r.stdout


def test_oversized_playbook(vault):
    rules = _module()
    (vault / "08 How to/Playbooks/Bulk.md").write_text(
        "---\nkind: playbook\nactivity: bulk\nprivate: true\n---\n", encoding="utf-8")
    for n in range(31):
        meta = {"kind": "rule", "id": f"R-{200 + n:04d}", "type": "parameter", "strength": "default",
                "status": "active", "scope": ["activity:bulk"], "when": "bulk work", "do": f"do thing {n}",
                "because": "test", "source": "generated", "added": TODAY, "private": "true"}
        (vault / RULES / f"R-{200 + n:04d} do thing {n}.md").write_text(rules.dump_note(meta), encoding="utf-8")
    out = run("lint", vault=vault).stdout
    assert [x for x in out.splitlines() if x.startswith("WARNING oversized:") and "bulk" in x and "31" in x]


# ---------------------------------------------------------------- writers (D-5, error matrix)

ADD = ["add", "--today", TODAY, "--type", "constraint", "--strength", "hard", "--scope", "activity:writing",
       "--scope", "audience:client", "--when", "writing for a client", "--do", "never send without approval",
       "--because", "client mail needs the owner's eye",
       "--source", "2026-10-29 session, owner: 'never send anything to a client without my approval'"]


def test_adding_an_approved_rule(vault):
    before = run("lint", vault=vault).stdout
    r = run(*ADD, vault=vault)
    assert r.returncode == 0, r.stdout + r.stderr
    path = vault / RULES / "R-0051 never send without approval.md"
    assert path.exists()
    meta = _meta(path)
    assert (meta["id"], meta["status"], meta["private"]) == ("R-0051", "active", "true")
    assert meta["added"] == meta["approved"] == meta["last_confirmed"] == TODAY
    errors = lambda out: {x for x in out.splitlines() if x.startswith("ERROR")}
    assert errors(run("lint", vault=vault).stdout) == errors(before)


def test_duplicate_add_is_refused(vault):
    r = run("add", "--today", TODAY, "--type", "default-with-exception", "--strength", "default",
            "--scope", "activity:writing", "--when", "writing any text", "--do", "use British English spelling",
            "--because", "x", "--source", "y", vault=vault)
    assert r.returncode == 4
    assert "confirm R-0001" in r.stdout + r.stderr


def test_write_adding_an_error_is_refused(vault):
    files = sorted((vault / RULES).iterdir())
    r = run(*ADD, "--exception-of", "R-9998", vault=vault)
    assert r.returncode == 4
    assert "dangling" in r.stdout + r.stderr
    assert sorted((vault / RULES).iterdir()) == files


def test_write_with_only_warnings_is_written(vault):
    r = run("add", "--today", TODAY, "--type", "selection-heuristic", "--strength", "default",
            "--scope", "activity:testing", "--scope", "client:public", "--when", "pricing a public bid",
            "--do", "price with a cap", "--slot", "pricing", "--value", "capped",
            "--because", "x", "--source", "y", vault=vault)
    assert r.returncode == 0, r.stdout + r.stderr
    assert "WARNING" in r.stdout
    assert _note(vault, "R-0051").exists()


def test_add_candidate(vault):
    r = run(*ADD, "--candidate", vault=vault)
    assert r.returncode == 0, r.stdout + r.stderr
    meta = _meta(_note(vault, "R-0051", PROPOSED))
    assert meta["status"] == "idea"
    assert "approved" not in meta
    assert not list((vault / RULES).glob("R-0051 *"))


def test_restating_an_existing_rule_confirms_it(vault):
    path = _note(vault, "R-0001")
    before = _meta(path)
    r = run("confirm", "R-0001", "--today", TODAY, vault=vault)
    assert r.returncode == 0
    after = _meta(path)
    assert after.pop("last_confirmed") == TODAY
    before.pop("last_confirmed")
    assert after == before
    assert run("confirm", "R-0001", "--today", TODAY, vault=vault).returncode == 0


def test_retire_keeps_the_note(vault):
    r = run("retire", "R-0012", "--reason", "the owner stopped using it", "--today", TODAY, vault=vault)
    assert r.returncode == 0
    meta = _meta(_note(vault, "R-0012"))
    assert (meta["status"], meta["retired"], meta["retired_reason"]) == ("dropped", TODAY, "the owner stopped using it")
    again = run("retire", "R-0012", "--reason", "again", "--today", "2026-11-01", vault=vault)
    assert again.returncode == 0 and "already" in again.stdout
    assert _meta(_note(vault, "R-0012"))["retired"] == TODAY


def test_update_keeps_the_id(vault):
    r = run("update", "R-0012", "--value", "surname", "--today", TODAY, vault=vault)
    assert r.returncode == 0, r.stdout + r.stderr
    meta = _meta(_note(vault, "R-0012"))
    assert (meta["id"], meta["value"]) == ("R-0012", "surname")


def test_supersede_drops_the_old_rule(vault):
    r = run(*ADD, "--supersedes", "R-0012", vault=vault)
    assert r.returncode == 0, r.stdout + r.stderr
    assert _meta(_note(vault, "R-0051"))["supersedes"] == "R-0012"
    old = _meta(_note(vault, "R-0012"))
    assert old["status"] == "dropped" and "R-0051" in old["retired_reason"]


def test_approve_moves_the_candidate(vault):
    r = run("approve", "R-0050", "--today", TODAY, vault=vault)
    assert r.returncode == 0, r.stdout + r.stderr
    assert not list((vault / PROPOSED).glob("R-0050 *"))
    meta = _meta(_note(vault, "R-0050"))
    assert (meta["status"], meta["approved"]) == ("active", TODAY)
    again = run("approve", "R-0050", "--today", TODAY, vault=vault)
    assert again.returncode == 0 and "already approved" in again.stdout


def test_approve_refuses_a_name_collision(vault):
    (vault / "03 Resources/R-0050 prefer the active voice in summaries.md").write_text("x", encoding="utf-8")
    r = run("approve", "R-0050", "--today", TODAY, vault=vault)
    assert r.returncode == 4
    assert _note(vault, "R-0050", PROPOSED).exists()


def test_cite_and_override_write_nothing(vault):
    before = {p: p.read_bytes() for p in vault.rglob("*.md")}
    assert run("cite", "R-0001", "R-0010", vault=vault).returncode == 0
    r = run("override", "R-0012", "--reason", "US client", vault=vault)
    assert r.returncode == 0 and "R-0012" in r.stdout
    assert {p: p.read_bytes() for p in vault.rglob("*.md")} == before


def test_search_finds_a_rule():
    out = run("search", "em", "dash").stdout
    assert _lines(out, "R-0010 ")
    assert not _lines(out, "R-0001 ")


# ---------------------------------------------------------------- stats (D-7, D-10)

def _stats(*extra, path=FIX / "langfuse-observations.json"):
    return run("stats", "--from-file", str(path), "--today", TODAY, *extra)


def _row(out, rid):
    line = next(x for x in out.splitlines() if x.startswith(rid + " "))
    return [int(n) for n in line.split()[1:5]]  # loaded cited overridden violated


def test_stats_counts():
    r = _stats()
    assert r.returncode == 0, r.stderr
    assert _row(r.stdout, "R-0001") == [1, 1, 0, 0], "the GENERATION and the old cite must not count"
    assert _row(r.stdout, "R-0010") == [1, 1, 0, 1]
    assert _row(r.stdout, "R-0012") == [1, 0, 2, 0]


def test_a_rule_overridden_twice():
    out = _stats().stdout
    flag = next(x for x in out.splitlines() if x.startswith("FLAG R-0012 overridden"))
    assert "US client prefers a surname" in flag and "internal memo" in flag
    assert "revise" in flag and "retire" in flag


def test_stats_flags_age():
    out = _stats().stdout
    assert _lines(out, "FLAG R-0012 stale")
    assert _lines(out, "FLAG R-0002 never-loaded")
    assert not _lines(out, "FLAG R-0001 never-loaded")


def test_stats_counts_truncated_output():
    assert "TRUNCATED 1" in _stats().stdout


def test_stats_warns_when_the_format_changed(tmp_path):
    noise = tmp_path / "noise.json"
    noise.write_text(json.dumps({"data": [{"id": "o1", "type": "SPAN", "name": "Bash", "startTime": "2026-10-20T00:00:00Z",
                                           "input": {"command": "ls"}, "output": {"stdout": ""}}],
                                 "meta": {"page": 1, "totalPages": 1}}), encoding="utf-8")
    out = _stats(path=noise).stdout
    assert "WARNING" in out and "format" in out
    assert "never-loaded" not in out


def test_langfuse_not_configured():
    r = run("stats", "--today", TODAY)
    assert r.returncode == 3
    assert "LANGFUSE_BASE_URL" in r.stderr


def test_langfuse_unreachable():
    r = run("stats", "--today", TODAY, env={"LANGFUSE_BASE_URL": "http://127.0.0.1:9",
                                            "LANGFUSE_PUBLIC_KEY": "pk", "LANGFUSE_SECRET_KEY": "sk"})
    assert r.returncode == 3
    assert "unreachable" in r.stderr


# ---------------------------------------------------------------- exit codes (D-14) and the vault (D-11)

def test_vault_not_found(tmp_path):
    r = run("load", "--activity", "writing", vault=None, cwd=tmp_path)
    assert r.returncode == 3
    assert "MEANINGFY_VAULT" in r.stderr


def test_vault_found_from_the_current_directory():
    r = run("load", "--activity", "writing", vault=None, cwd=VAULT)
    assert r.returncode == 0


def test_usage_error():
    assert run("load").returncode == 2
    assert run("cite", "not-an-id").returncode == 2


# ---------------------------------------------------------------- catalogue (D-2, D-13)

SKILLS = ("rulebook", "rule-learner", "rule-steward")


def test_the_three_skills_share_one_bundle():
    bundles = yaml.safe_load((ROOT / "bundles.yaml").read_text(encoding="utf-8"))["bundles"]
    homes = {b["name"] for b in bundles for s in SKILLS if s in b.get("skills", [])}
    assert len(homes) == 1 and all(any(s in b.get("skills", []) for b in bundles) for s in SKILLS)


# ---------------------------------------------------------------- rules in every session (step 1)

def _text(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def _description(skill):
    return yaml.safe_load(_text(f"skills/{skill}/SKILL.md").split("---")[1])["description"]


def test_t1_the_three_skills_ship_in_meaningfy_core():
    bundles = {b["name"]: b.get("skills", []) for b in
               yaml.safe_load(_text("bundles.yaml"))["bundles"]}
    assert all(s in bundles["meaningfy-core"] and s not in bundles["vault-assistant"] for s in SKILLS)


def test_t2_the_global_prompt_routes_sessions_to_the_rule_skills():
    prompt = _text("docs/environment/global-prompt.md")
    assert all(w in prompt for w in ("meaningfy-core:rulebook", "meaningfy-core:rule-learner", "unattended",
                                     "final summary", "say so once", "~/.config/opencode/AGENTS.md"))


def test_t3_the_allow_rule_names_meaningfy_core_and_the_old_one_is_gone():
    assert "/meaningfy-core/" in _text("skills/rulebook/references/commands.md")
    old = "meaningfy-skillery/vault-assistant/*/skills/rulebook"
    assert not [p for p in (ROOT / "skills").rglob("*.md") if old in p.read_text(encoding="utf-8")]


def test_rulebook_text_covers_any_session():
    skill = _text("skills/rulebook/SKILL.md")
    assert "say once" in skill and "MEANINGFY_VAULT" in skill and "never as `cd`" in skill
    scope = _text("skills/rulebook/references/rule-model.md").split("## Scope")[1].split("\n## ")[0]
    assert all(a in scope for a in ("coding", "code-review", "planning"))


def test_learner_text_covers_any_session():
    skill = _text("skills/rule-learner/SKILL.md")
    assert "wraps up" in skill and "final summary" in skill


@pytest.mark.parametrize("skill", ["rulebook", "rule-learner"])
def test_descriptions_cover_any_session_and_stay_short(skill):
    d = _description(skill)
    assert "any session" in d and len(d) < 700


def test_user_docs_name_the_move():
    rules = _text("docs/environment/rules.md")
    assert "## Where your rules work" in rules and "## Quick Start" in rules
    assert "vault-assistant" not in rules.split("All three skills are")[1].split("\n")[0]
    assert '"env"' in _text("docs/environment/setup.md")
    rows = {r.split("|")[1].strip().split("**")[1]: r for r in _text("README.md").splitlines()
            if r.startswith("| **")}
    assert all(f"**{s}**" in rows["meaningfy-core"] and f"**{s}**" not in rows["vault-assistant"]
               for s in SKILLS)
    unreleased = _text("CHANGELOG.md").split("## [Unreleased]")[1].split("\n## [")[0]
    assert any("BREAKING" in b and "/meaningfy-core/" in b for b in unreleased.split("\n- "))


@pytest.mark.parametrize("skill", ["rule-learner", "rule-steward"])
def test_learner_and_steward_reach_the_script_by_the_bundle_path(skill):
    assert "rulebook/scripts/rules.py" in (ROOT / f"skills/{skill}/SKILL.md").read_text(encoding="utf-8")


@pytest.mark.parametrize("kind", ["rule", "playbook"])
def test_templates_carry_the_required_properties(kind):
    kinds = (ROOT / "skills/vault-conventions/references/kinds.md").read_text(encoding="utf-8")
    row = next(x for x in kinds.splitlines() if x.startswith(f"| `{kind}` |"))
    required = set(re.findall(r"`([a-z_]+)`", row.split("|")[-2])) - {"true"}
    assert required, row
    setup = ROOT / f"skills/vault-setup/assets/templates/{kind}.md"
    own = ROOT / f"skills/rulebook/assets/templates/{kind}.md"
    assert setup.read_text(encoding="utf-8") == own.read_text(encoding="utf-8")
    keys = set(re.findall(r"^([a-z_]+):", setup.read_text(encoding="utf-8"), re.MULTILINE))
    assert required <= keys, required - keys


# ---------------------------------------------------------------- review fixes (task 5.1)

def test_approving_a_deferred_supersede_retires_the_old_rule(vault):
    r = run("add", "--candidate", "--supersedes", "R-0026", "--today", TODAY, "--type", "parameter",
            "--strength", "default", "--scope", "activity:testing", "--scope", "lang:de", "--when", "drawing a chart",
            "--do", "use green charts", "--slot", "colour", "--value", "green", "--because", "x", "--source", "y",
            vault=vault)
    assert r.returncode == 0, r.stdout + r.stderr
    assert _meta(_note(vault, "R-0026"))["status"] == "active", "a candidate retires nothing"
    r = run("approve", "R-0051", "--today", TODAY, vault=vault)
    assert r.returncode == 0, r.stdout + r.stderr
    old = _meta(_note(vault, "R-0026"))
    assert old["status"] == "dropped" and "R-0051" in old["retired_reason"]


def test_no_usage_data_raises_no_usage_flags(tmp_path):
    empty = tmp_path / "empty.json"
    empty.write_text('{"data": [], "meta": {"page": 1, "totalPages": 0}}', encoding="utf-8")
    out = _stats(path=empty).stdout
    assert "WARNING" in out and "no usage data" in out
    assert "never-loaded" not in out
    assert _lines(out, "FLAG R-0012 stale"), "age flags do not depend on usage"


def test_check_needs_an_activity(tmp_path):
    draft = tmp_path / "draft.md"
    draft.write_text("x — y\n", encoding="utf-8")
    assert run("check", str(draft)).returncode == 2


def test_golden_example_with_context_tags(vault):
    rules = _module()
    pb = vault / "08 How to/Playbooks/Writing.md"
    meta, body = rules.parse_note(pb.read_text(encoding="utf-8"))
    meta["golden"] = meta["golden"] + ["03 Resources/Client note.md | audience=client"]
    pb.write_text(rules.dump_note(meta, body), encoding="utf-8")
    (vault / "03 Resources/Client note.md").write_text("Dear client, see the plan; it is ready.\n", encoding="utf-8")
    note = {"kind": "rule", "id": "R-0060", "type": "constraint", "strength": "hard", "status": "active",
            "scope": ["activity:writing", "audience:client"], "when": "writing for a client", "do": "use no semicolon",
            "check_absent": ";", "because": "x", "source": "y", "added": TODAY, "private": "true"}
    (vault / RULES / "R-0060 use no semicolon.md").write_text(rules.dump_note(note), encoding="utf-8")
    out = run("check", "--golden", vault=vault).stdout
    assert "GOLDEN 03 Resources/Client note.md: FAIL" in out
    assert "VIOLATION R-0060 line 1:" in out
    assert "GOLDEN 03 Resources/Good memo.md: ok" in out, "the tag applies only to its own example"


def test_add_retries_when_the_id_is_taken_under_another_title(vault, monkeypatch):
    rules = _module()
    monkeypatch.setenv("MEANINGFY_VAULT", str(vault))
    real = rules._commit
    calls = []

    def racing(root, changes, dry_run=False):
        if not calls:  # another writer takes the id first, with a different title
            calls.append(1)
            rid = changes[0][1]["id"]
            (vault / RULES / f"{rid} someone else.md").write_text("x", encoding="utf-8")
        return real(root, changes, dry_run)

    monkeypatch.setattr(rules, "_commit", racing)
    assert rules.main(ADD) == 0
    assert _note(vault, "R-0052").exists()


def test_stats_missing_file_is_an_environment_error(tmp_path):
    r = _stats(path=tmp_path / "nope.json")
    assert r.returncode == 3 and "nope.json" in r.stderr


def test_update_of_do_renames_the_file(vault):
    r = run("update", "R-0012", "--do", "greet by surname", "--today", TODAY, vault=vault)
    assert r.returncode == 0, r.stdout + r.stderr
    assert (vault / RULES / "R-0012 greet by surname.md").exists()
    assert not (vault / RULES / "R-0012 greet by first name.md").exists()


def test_dry_run_writes_nothing_and_prints_warnings(vault):
    before = sorted((vault / RULES).iterdir())
    r = run("add", "--dry-run", "--today", TODAY, "--type", "selection-heuristic", "--strength", "default",
            "--scope", "activity:testing", "--scope", "client:public", "--when", "pricing a public bid",
            "--do", "price with a cap", "--slot", "pricing", "--value", "capped",
            "--because", "x", "--source", "y", vault=vault)
    assert r.returncode == 0, r.stderr
    assert "WARNING conflict" in r.stdout and "dry run" in r.stdout
    assert sorted((vault / RULES).iterdir()) == before


@pytest.mark.parametrize("skill", ["rule-learner", "rule-steward"])
def test_skills_never_tell_the_agent_to_run_a_dotdot_path(skill):
    assert "/../" not in (ROOT / f"skills/{skill}/SKILL.md").read_text(encoding="utf-8")


# ---------------------------------------------------------------- the repository store (step 2)

REPO_FIX = FIX / "repo"
POINTER = ("- **Rules:** this repository's rules for agents are in `docs/rules/`. At the start of an activity, "
           "load them with the rulebook skill; change them only through it, by pull request.")
ADD_REPO = ("add", "--store", "repo", "--type", "constraint", "--strength", "hard", "--scope", "activity:coding",
            "--when", "committing", "--do", "never force push", "--because", "history is shared",
            "--source", "2026-10-29 owner: 'never force push'", "--today", TODAY)


def _tree(root):
    return {p.relative_to(root).as_posix(): p.read_bytes() for p in sorted(Path(root).rglob("*")) if p.is_file()}


def _repo(tmp_path, rules=True, agents=True, name="repo"):
    dest = tmp_path / name
    shutil.copytree(REPO_FIX, dest)
    (dest / ".git").mkdir()
    if not rules:
        shutil.rmtree(dest / "docs")
    if not agents:
        (dest / "AGENTS.md").unlink()
    return dest


def _home(tmp_path):  # a HOME that is neither the repository nor the vault
    h = tmp_path / "home"
    h.mkdir(exist_ok=True)
    return {"HOME": str(h)}


@pytest.fixture
def repo(tmp_path):
    return _repo(tmp_path)


def test_t5_load_is_the_same_inside_and_outside_a_repository(tmp_path):
    inside = run("load", "--activity", "writing", cwd=ROOT).stdout
    assert inside == run("load", "--activity", "writing", cwd=tmp_path).stdout


def test_t6_a_project_convention_goes_to_the_repository(tmp_path, vault):
    repo = _repo(tmp_path, rules=False)
    before = _tree(vault)
    r = run(*ADD_REPO, vault=vault, cwd=repo)
    assert r.returncode == 0, r.stderr
    note = repo / "docs/rules/P-0001 never force push.md"
    assert _meta(note)["private"] == "false" and _meta(note)["id"] == "P-0001"
    assert "wrote docs/rules/P-0001 never force push.md" in r.stdout
    assert "wrote AGENTS.md (pointer to docs/rules/)" in r.stdout
    assert POINTER in (repo / "AGENTS.md").read_text(encoding="utf-8")
    assert _tree(vault) == before


def test_t7_the_pointer_is_written_once(tmp_path, vault):
    repo = _repo(tmp_path, rules=False)
    run(*ADD_REPO, vault=vault, cwd=repo)
    second = [a if a != "never force push" else "never skip the review" for a in ADD_REPO]
    assert run(*second, vault=vault, cwd=repo).returncode == 0
    assert (repo / "AGENTS.md").read_text(encoding="utf-8").count("docs/rules/") == 1


def test_t8_a_missing_agents_md_is_created_with_a_hint(tmp_path, vault):
    repo = _repo(tmp_path, rules=False, agents=False)
    r = run(*ADD_REPO, vault=vault, cwd=repo)
    assert ("wrote AGENTS.md (new: if CLAUDE.md is this repository's binding, import AGENTS.md from it)"
            in r.stdout)
    assert (repo / "AGENTS.md").read_text(encoding="utf-8") == f"# AGENTS.md\n\n{POINTER}\n"


def test_t9_a_dry_run_creates_no_store(tmp_path, vault):
    repo = _repo(tmp_path, rules=False)
    before = _tree(repo)
    r = run(*ADD_REPO, "--dry-run", vault=vault, cwd=repo)
    assert r.returncode == 0, r.stderr
    assert _tree(repo) == before and not (repo / "docs").exists()


def test_t10_a_personal_preference_goes_to_the_vault(repo, vault):
    before = _tree(repo)
    args = [a for a in ADD_REPO if a not in ("--store", "repo")]
    r = run(*args, vault=vault, cwd=repo)
    assert r.returncode == 0, r.stderr
    assert re.search(r"wrote 08 How to/Rules/R-\d{4} never force push\.md", r.stdout)
    assert _tree(repo) == before
    r = run(*args[:1], "--store", "vault", *args[1:], "--do", "never force push twice", vault=vault, cwd=repo)
    assert r.returncode == 0 and _tree(repo) == before


def test_t11_the_stores_disagree(repo, vault):
    out = run("load", "--activity", "writing", vault=vault, cwd=repo).stdout
    assert "CONFLICT R-0001 vs P-0002 on spelling: ask the owner" in out
    assert _lines(out, "R-0001 ") and _lines(out, "P-0002 ")


def test_t12_repository_rules_load_without_the_vault(repo):
    r = run("load", "--activity", "coding", vault=None, cwd=repo, env=_home(repo.parent))
    assert r.returncode == 0, r.stderr
    assert r.stdout == (
        "SKIPPED P-0004 carries a vault id.md: id R-0099 does not belong in the repository store\n"
        "P-0003 [default] commit-style=conventional: follow conventional commits (because: the changelog is generated)\n"
        "P-0001 [hard] never commit straight to main (because: main is protected and reviewed)\n"
        "NOTE personal rules not loaded: vault not found (set MEANINGFY_VAULT)\n"
        "-- end --\n")


def test_t13_no_store_at_all_is_an_environment_error(tmp_path):
    r = run("load", "--activity", "coding", vault=None, cwd=tmp_path, env=_home(tmp_path))
    assert r.returncode == 3 and "vault not found" in r.stderr


def test_t14_the_home_folder_and_the_vault_are_not_repositories(tmp_path, repo, vault):
    r = run("where", vault=None, cwd=repo, env={"HOME": str(repo)})
    assert "repository: none (repository root is the home folder)" in r.stdout
    (vault / ".git").mkdir()
    r = run("where", vault=vault, cwd=vault, env=_home(tmp_path))
    assert "repository: none (this is the vault)" in r.stdout
    assert "default store: vault" in r.stdout


def test_t15_lint_reports_each_store_by_its_own_rules(repo, vault):
    r = run("lint", vault=vault, cwd=repo)
    assert r.returncode == 1
    assert "ERROR dangling: P-0003: exception_of R-0001 does not exist" in r.stdout
    assert "ERROR invalid: R-0099: id 'R-0099' is not P-NNNN" in r.stdout
    alone = run("lint", "--store", "vault", vault=vault, cwd=repo).stdout
    assert all(line in r.stdout for line in alone.splitlines() if line.startswith("ERROR"))


def test_t16_the_steward_lint_sees_no_repository_rule(repo, vault):
    r = run("lint", "--store", "vault", vault=vault, cwd=repo)
    assert "P-" not in r.stdout and "R-0099" not in r.stdout
    assert r.stdout == run("lint", vault=vault, cwd=ROOT).stdout


def test_t17_writer_refusals(repo, vault, tmp_path):
    r = run("add", "--candidate", "--store", "repo", "--do", "x", vault=vault, cwd=repo)
    assert r.returncode == 2 and "the repository store takes no candidates" in r.stderr
    r = run("approve", "P-0001", vault=vault, cwd=repo)
    assert r.returncode == 4 and "repository rules have no candidates" in r.stderr
    r = run("retire", "P-0001", "--reason", "x", vault=vault, cwd=tmp_path)
    assert r.returncode == 3


def test_t18_stats_counts_vault_rules_only(repo, vault):
    r = run("stats", "--from-file", str(repo / "langfuse-observations-repo.json"), "--today", TODAY,
            vault=vault, cwd=repo)
    assert r.returncode == 0, r.stderr
    assert not re.search(r"^P-\d{4}", r.stdout, re.M) and "FLAG P-" not in r.stdout


def test_t19_a_readme_in_the_rules_folder_is_ignored(repo):
    r = run("lint", "--store", "repo", vault=None, cwd=repo, env=_home(repo.parent))
    assert r.returncode in (0, 1) and "README" not in r.stdout and "parse" not in r.stdout


def test_t20_where_describes_each_case(tmp_path, vault):
    full = _repo(tmp_path)
    r = run("where", vault=vault, cwd=full)
    assert r.returncode == 0
    assert r.stdout == (f"vault: {vault}\nrepository: {full} (docs/rules/ present)\n"
                        "default store: repository\n-- end --\n")
    bare = _repo(tmp_path, rules=False, name="bare")
    assert "(docs/rules/ not yet created)" in run("where", vault=vault, cwd=bare).stdout
    r = run("where", vault=None, cwd=tmp_path, env=_home(tmp_path))
    assert r.returncode == 0
    assert r.stdout == ("vault: none (MEANINGFY_VAULT not set and no '08 How to/' here)\n"
                        "repository: none (no .git found)\ndefault store: vault\n-- end --\n")


def test_t21_a_cross_store_link_is_cut_in_memory_only(repo):
    rules, active, skipped = _module()._merged_index(VAULT, repo)
    assert "exception_of" not in rules["P-0003"] and "P-0003" in active
    assert "R-0099" not in rules and skipped
    assert "exception_of: R-0001" in (repo / "docs/rules/P-0003 follow conventional commits.md").read_text(
        encoding="utf-8")


SNAPSHOTS = FIX / "vault-only"
SNAP_ARGS = [a.replace("{fixtures}", str(FIX)).split() for a in (SNAPSHOTS / "cmds.txt").read_text().splitlines()]


@pytest.mark.parametrize("cwd_is_root", [True, False], ids=["cwd-root", "cwd-tmp"])
@pytest.mark.parametrize("n", range(1, 6))
def test_t22_vault_only_output_is_byte_identical(n, cwd_is_root, tmp_path):
    r = run(*SNAP_ARGS[n - 1], cwd=ROOT if cwd_is_root else tmp_path)
    assert r.stdout == (SNAPSHOTS / f"{n}.out").read_text(encoding="utf-8")
    assert r.returncode == int((SNAPSHOTS / f"{n}.code").read_text())


def test_t23_exit_codes_of_an_absent_store(tmp_path, vault):
    repo = _repo(tmp_path, rules=False)
    assert run("retire", "P-0001", "--reason", "x", vault=vault, cwd=repo).returncode == 4
    r = run("lint", "--store", "repo", vault=vault, cwd=repo)
    assert r.returncode == 0 and r.stdout.strip() == "0 error(s), 0 warning(s)"
    assert run("lint", "--store", "repo", vault=vault, cwd=tmp_path, env=_home(tmp_path)).returncode == 3


def test_t24_the_pointer_follows_every_real_write_to_a_hand_made_store(repo, vault):
    (repo / "AGENTS.md").write_text("# AGENTS.md\n", encoding="utf-8")
    agents = lambda: (repo / "AGENTS.md").read_text(encoding="utf-8")
    assert run(*ADD_REPO, vault=vault, cwd=repo).returncode == 0
    assert agents().count("docs/rules/") == 1
    after_add = agents()
    for cmd in (("update", "P-0001", "--because", "reviewed by two"), ("confirm", "P-0001", "--today", "2026-11-01"),
                ("retire", "P-0002", "--reason", "x", "--today", TODAY)):
        r = run(*cmd, vault=vault, cwd=repo)
        assert r.returncode == 0, r.stderr
        assert "AGENTS.md" not in r.stdout and agents() == after_add
    r = run("confirm", "P-0001", "--today", "2026-11-01", vault=vault, cwd=repo)
    assert "already confirmed today" in r.stdout and agents() == after_add


def test_t24b_a_write_to_a_store_without_the_pointer_adds_it(repo, vault):
    (repo / "AGENTS.md").write_text("# AGENTS.md\n", encoding="utf-8")
    r = run("confirm", "P-0001", "--today", "2026-11-01", vault=vault, cwd=repo)
    assert r.returncode == 0 and "wrote AGENTS.md (pointer to docs/rules/)" in r.stdout
    assert (repo / "AGENTS.md").read_text(encoding="utf-8") == f"# AGENTS.md\n\n{POINTER}\n"


def test_a_pointer_that_cannot_be_written_is_a_warning(repo, vault):
    (repo / "AGENTS.md").write_text("# AGENTS.md\n", encoding="utf-8")
    (repo / "AGENTS.md").chmod(0o444)
    r = run("confirm", "P-0001", "--today", "2026-11-01", vault=vault, cwd=repo)
    (repo / "AGENTS.md").chmod(0o644)
    if os.access(repo / "AGENTS.md", os.W_OK) and os.geteuid() == 0:
        pytest.skip("root can write read-only files")
    assert r.returncode == 0 and "WARNING pointer: could not write AGENTS.md" in r.stdout


def test_read_commands_use_the_union(repo, vault):
    assert "P-0003" in run("search", "conventional", vault=vault, cwd=repo).stdout
    draft = repo / "draft.md"
    draft.write_text("hello\n", encoding="utf-8")
    assert run("check", "--activity", "coding", str(draft), vault=vault, cwd=repo).returncode == 0


def test_a_vault_note_with_a_repository_id_is_skipped(vault):
    stray = vault / RULES / "P-0007 stray.md"
    stray.write_text((REPO_FIX / "docs/rules/P-0001 never commit straight to main.md").read_text(
        encoding="utf-8").replace("P-0001", "P-0007"), encoding="utf-8")
    out = run("load", "--activity", "coding", vault=vault).stdout
    assert "SKIPPED P-0007 stray.md: id P-0007 does not belong in the vault store" in out
    assert "ERROR invalid: P-0007: id 'P-0007' is not R-NNNN" in run("lint", vault=vault).stdout


def test_a_repository_id_is_a_valid_command_argument(repo, vault):
    assert run("cite", "P-0001", vault=vault, cwd=repo).returncode == 0
    r = run("cite", "X-1", vault=vault, cwd=repo)
    assert r.returncode == 2 and "'X-1' is not a rule id R-NNNN or P-NNNN" in r.stderr


def test_a_cross_store_link_in_a_write_is_refused(repo, vault):
    r = run(*ADD_REPO, "--exception-of", "R-0001", vault=vault, cwd=repo)
    assert r.returncode == 4 and "dangling" in r.stderr
