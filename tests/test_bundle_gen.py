"""tools.bundle_gen — the one renderer of bundles.yaml (single-source-distribution D2–D6).

TC ids refer to design.md "Test case specifications".
"""
import json
import os
import shutil
from pathlib import Path

import pytest
import yaml

from tools.bundle_gen import gen

REPO = Path(__file__).resolve().parents[1]

MAP = {"modelAliases": {"opus": "anthropic/claude-opus-4-8"},
       "toolNames": {"Read": "read"}, "toolPermission": {"Write": "edit"}}


def _doc(**over):
    doc = {
        "name": "mkt",
        "owner": {"name": "Meaningfy", "email": "info@meaningfy.ws"},
        "description": "Catalogue",
        "bundles": [
            {"name": "b-one", "description": "First — café", "skills": ["s1"], "agents": ["ag"]},
            {"name": "b-two", "description": "Second", "skills": ["s2"], "agents": []},
        ],
    }
    doc.update(over)
    return doc


def _repo(tmp_path: Path, doc: dict | None = None, version: str = "1.2.3") -> Path:
    (tmp_path / "VERSION").write_text(version + "\n", encoding="utf-8")
    (tmp_path / "bundles.yaml").write_text(
        yaml.safe_dump(doc or _doc(), sort_keys=False, allow_unicode=True), encoding="utf-8")
    for s in ("s1", "s2"):
        (tmp_path / "skills" / s).mkdir(parents=True)
        (tmp_path / "skills" / s / "SKILL.md").write_text(f"---\nname: {s}\ndescription: x\n---\n",
                                                         encoding="utf-8")
    (tmp_path / "agents").mkdir()
    (tmp_path / "agents" / "ag.md").write_text(
        "---\nname: ag\ndescription: Agent\nmodel: opus\ncolor: blue\ntools: [Read]\n---\nBody\n",
        encoding="utf-8")
    (tmp_path / "tools").mkdir()
    (tmp_path / "tools" / "opencode-agent-map.json").write_text(json.dumps(MAP), encoding="utf-8")
    (tmp_path / "package.json").write_text(json.dumps({"name": "p", "version": "0.0.0"}) + "\n",
                                           encoding="utf-8")
    return tmp_path


# ---------------------------------------------------------------- render
def test_tc01_marketplace_entries(tmp_path):
    market, _, _ = gen.render(_repo(tmp_path))
    data = json.loads(market)
    assert list(data) == ["name", "owner", "metadata", "plugins"]
    assert data["metadata"] == {"description": "Catalogue", "version": "1.2.3"}
    assert data["plugins"] == [
        {"name": "b-one", "description": "First — café", "source": "./bundles/b-one"},
        {"name": "b-two", "description": "Second", "source": "./bundles/b-two"},
    ]
    assert "café".encode() in market  # ensure_ascii=False
    assert market.endswith(b"}\n")


def test_tc02_links(tmp_path):
    _, links, _ = gen.render(_repo(tmp_path))
    assert links == {
        "bundles/b-one/skills/s1": "../../../skills/s1",
        "bundles/b-one/agents/ag.md": "../../../agents/ag.md",
        "bundles/b-two/skills/s2": "../../../skills/s2",
    }


def _snapshot(repo: Path) -> dict:
    out = {p: (repo / p).read_bytes() for p in (gen.MARKETPLACE, gen.CATALOGUE, gen.PACKAGE_JSON)}
    for dirpath, dirnames, filenames in os.walk(repo / "bundles"):
        for n in dirnames + filenames:
            p = Path(dirpath) / n
            if p.is_symlink():
                out[p.relative_to(repo).as_posix()] = os.readlink(p)
    return out


def test_tc03_write_is_deterministic(tmp_path):
    repo = _repo(tmp_path)
    assert not (repo / "bundles").exists()
    gen.write(repo)
    first = _snapshot(repo)
    gen.write(repo)
    assert _snapshot(repo) == first
    assert gen.gate_errors(repo) == []
    assert json.loads((repo / "package.json").read_text())["version"] == "1.2.3"


def test_tc04_stale_marketplace(tmp_path):
    repo = _repo(tmp_path)
    gen.write(repo)
    doc = _doc()
    doc["bundles"][1]["description"] = "Changed"
    (repo / "bundles.yaml").write_text(yaml.safe_dump(doc, sort_keys=False), encoding="utf-8")
    assert any("marketplace.json is stale" in e for e in gen.gate_errors(repo))


def test_tc04_stale_catalogue_after_agent_color_edit(tmp_path):
    repo = _repo(tmp_path)
    gen.write(repo)
    p = repo / "agents" / "ag.md"
    p.write_text(p.read_text().replace("color: blue", "color: red"), encoding="utf-8")
    errs = gen.gate_errors(repo)
    assert any("opencode-catalogue.json is stale" in e for e in errs)
    assert not any("marketplace.json" in e for e in errs)


def test_tc05_link_gate(tmp_path):
    repo = _repo(tmp_path)
    gen.write(repo)
    (repo / "bundles/b-one/agents/ag.md").unlink()                       # missing
    copy = repo / "bundles/b-two/skills/s2"
    copy.unlink()
    shutil.copytree(repo / "skills/s2", copy)                           # copy instead of link
    (repo / "bundles/b-one/stray.txt").write_text("x")                  # orphan
    link = repo / "bundles/b-one/skills/s1"
    link.unlink()
    link.symlink_to("../../../skills/s2")                               # wrong target
    errs = gen.gate_errors(repo)
    assert any(e.startswith("missing link") and "b-one/agents/ag.md" in e for e in errs)
    assert any(e.startswith("not a symlink (copy?)") and "b-two/skills/s2" in e for e in errs)
    assert any(e.startswith("orphan") and "stray.txt" in e for e in errs)
    assert any(e.startswith("wrong target") and "b-one/skills/s1" in e for e in errs)
    assert len(errs) == 4  # the copied dir's contents are not reported again as orphans


def test_tc06_version_sync_package(tmp_path):
    repo = _repo(tmp_path)
    gen.write(repo)
    (repo / "package.json").write_text(json.dumps({"name": "p", "version": "0.0.1"}) + "\n")
    errs = gen.gate_errors(repo)
    assert any("package.json" in e and "VERSION" in e for e in errs)


def test_tc06_version_sync_catalogue(tmp_path):
    repo = _repo(tmp_path)
    gen.write(repo)
    cat = json.loads((repo / gen.CATALOGUE).read_text())
    cat["version"] = "0.0.1"
    (repo / gen.CATALOGUE).write_text(json.dumps(cat))
    assert any("opencode-catalogue.json version" in e for e in gen.gate_errors(repo))


# ------------------------------------------------------------------ load
@pytest.mark.parametrize("mutate, needle", [
    (lambda d: d["bundles"][0].update(provides=["x"]), "provides"),
    (lambda d: d["bundles"][0].update(requires=["Not_Kebab"]), "Not_Kebab"),
    (lambda d: d["bundles"][0].pop("description"), "description"),
    (lambda d: d["bundles"][1].update(name="b-one"), "duplicate"),
    (lambda d: d["bundles"][1].pop("agents"), "agents"),
    (lambda d: d["bundles"][1].update(name="B-Two"), "B-Two"),
    (lambda d: d.update(extra=1), "extra"),
    (lambda d: d["bundles"][0]["skills"].append("../../../../escape-me"), "escape-me"),
    (lambda d: d["bundles"][0]["agents"].append("Bad_Agent"), "Bad_Agent"),
])
def test_tc07_load_rejects(tmp_path, mutate, needle):
    doc = _doc()
    mutate(doc)
    repo = _repo(tmp_path, doc)
    with pytest.raises(ValueError, match=needle) as exc:
        gen.load(repo)
    if needle != "extra":
        assert "bundle" in str(exc.value)


def test_tc07b_load_shape(tmp_path):
    assert gen.load(_repo(tmp_path)) == _doc()


def test_requires_is_optional_and_kept(tmp_path):
    doc = _doc()
    doc["bundles"][1]["requires"] = [doc["bundles"][0]["name"]]
    assert gen.load(_repo(tmp_path, doc))["bundles"][1]["requires"] == [doc["bundles"][0]["name"]]


def test_load_bad_yaml_raises_value_error(tmp_path):
    repo = _repo(tmp_path)
    (repo / "bundles.yaml").write_text("bundles: [\n", encoding="utf-8")
    with pytest.raises(ValueError, match="bundles.yaml"):
        gen.load(repo)


def test_gate_reports_load_error_instead_of_raising(tmp_path):
    doc = _doc()
    doc["bundles"][0]["provides"] = []
    assert any("provides" in e for e in gen.gate_errors(_repo(tmp_path, doc)))


# ------------------------------------------------------- agent_frontmatter
def test_tc23_agent_invalid_yaml(tmp_path):
    repo = _repo(tmp_path)
    (repo / "agents" / "ag.md").write_text("---\nname: ag\ndescription: a: b\n---\nB\n")
    with pytest.raises(ValueError, match="agent 'ag': frontmatter is not valid YAML"):
        gen.agent_frontmatter(repo, "ag")


def test_tc23_agent_unknown_model(tmp_path):
    repo = _repo(tmp_path)
    (repo / "agents" / "ag.md").write_text("---\nname: ag\nmodel: zzz\n---\nB\n")
    with pytest.raises(ValueError, match="agent 'ag': unknown model alias 'zzz'"):
        gen.agent_frontmatter(repo, "ag")


def test_tc23_folded_description_parses(tmp_path):
    repo = _repo(tmp_path)
    (repo / "agents" / "ag.md").write_text("---\nname: ag\ndescription: >\n  a: b\n  c\n---\nBody\n")
    fm, body = gen.agent_frontmatter(repo, "ag")
    assert fm["description"].strip() == "a: b c"
    assert body == "Body\n"


# ------------------------------------------------------------- catalogue
def test_tc24_catalogue(tmp_path):
    _, _, cat_bytes = gen.render(_repo(tmp_path))
    cat = json.loads(cat_bytes)
    assert cat["version"] == "1.2.3"
    assert cat["bundles"] == [{"name": "b-one", "skills": ["s1"], "agents": ["ag"]},
                              {"name": "b-two", "skills": ["s2"], "agents": []}]
    assert cat["agents"] == {"ag": {"name": "ag", "description": "Agent", "model": "opus",
                                    "color": "blue", "tools": ["Read"]}}
    assert "skills" not in cat["agents"]["ag"]  # an agent with no skills stays without the key
    assert cat_bytes.endswith(b"\n")


# ------------------------------------------------------------- live repo
def test_tc22_live_repo_renderings_in_sync():
    assert gen.gate_errors(REPO) == []


def test_link_gate_is_skipped_without_a_bundles_tree(tmp_path):
    # bundles/ is generated, not committed (rebundle-by-activity D-8): a fresh checkout has none.
    repo = _repo(tmp_path)
    gen.write(repo)
    shutil.rmtree(repo / "bundles")
    assert gen.gate_errors(repo) == []


def test_unreleased_lists_the_wip_paths(tmp_path):
    # rebundle-by-activity D-14: what dist.yml drops from the published tree.
    repo = _repo(tmp_path)
    (repo / "skills" / "s3").mkdir()
    (repo / "skills" / "s3" / "SKILL.md").write_text("---\nname: s3\ndescription: x\n---\n", encoding="utf-8")
    (repo / "agents" / "ag2.md").write_text("---\nname: ag2\ndescription: x\n---\n", encoding="utf-8")
    assert gen.unreleased(repo) == ["agents/ag2.md", "skills/s3"]
