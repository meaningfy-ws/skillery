"""Render and gate everything derived from ``bundles.yaml`` (single-source-distribution D2–D6).

``load`` is the only parser and validator of ``bundles.yaml`` in Python (cross-EPIC contract
item 2); ``repo_lint`` and ``skill_inventory`` derive from it. ``agent_frontmatter`` is the only
agent-frontmatter parser for the opencode catalogue: strict, with no fallback.
"""
from __future__ import annotations

import json
import os
import re
import shutil
from pathlib import Path

import yaml

BUNDLES_FILE = "bundles.yaml"
BUNDLES_DIR = "bundles"
MARKETPLACE = ".claude-plugin/marketplace.json"
CATALOGUE = "tools/opencode-catalogue.json"
AGENT_MAP = "tools/opencode-agent-map.json"
PACKAGE_JSON = "package.json"
VERSION_FILE = "VERSION"
SKILLS_DIR = "skills"
AGENTS_DIR = "agents"

_TOP_KEYS = ("name", "owner", "description", "bundles")
_OWNER_KEYS = ("name", "email")
_BUNDLE_KEYS = ("name", "description", "skills", "agents")
_BUNDLE_OPTIONAL_KEYS = ("requires",)  # define-catalogue-model D-6; the graph rules live in repo_lint
_KEBAB = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
_FRONTMATTER = re.compile(r"^---\n(.*?)\n---\n?(.*)$", re.DOTALL)
_STALE = "is stale — run make bundles"


# ------------------------------------------------------------------ read
def version(repo: Path) -> str:
    return (repo / VERSION_FILE).read_text(encoding="utf-8").strip()


def _exact_keys(obj, keys: tuple[str, ...], where: str, optional: tuple[str, ...] = ()) -> None:
    if not isinstance(obj, dict):
        raise ValueError(f"{BUNDLES_FILE}: {where} must be a mapping")
    unknown = [k for k in obj if k not in keys and k not in optional]
    missing = [k for k in keys if k not in obj]
    if unknown:
        raise ValueError(f"{BUNDLES_FILE}: {where} has unknown key(s) {', '.join(map(str, unknown))}")
    if missing:
        raise ValueError(f"{BUNDLES_FILE}: {where} is missing key(s) {', '.join(missing)}")


def _str_list(value, key: str, where: str) -> list[str]:
    """A list of kebab-case names: each one becomes a path segment, so nothing else is allowed."""
    if not isinstance(value, list):
        raise ValueError(f"{BUNDLES_FILE}: {where} key '{key}' must be a list of names")
    bad = [v for v in value if not isinstance(v, str) or not _KEBAB.match(v)]
    if bad:
        raise ValueError(f"{BUNDLES_FILE}: {where} key '{key}' has non-kebab-case name(s) "
                         f"{', '.join(map(str, bad))}")
    return value


def _bundle(raw, index: int, seen: set[str]) -> dict:
    _exact_keys(raw, _BUNDLE_KEYS, f"bundle #{index + 1}", optional=_BUNDLE_OPTIONAL_KEYS)
    name = raw["name"]
    where = f"bundle '{name}'"
    if not isinstance(name, str) or not _KEBAB.match(name):
        raise ValueError(f"{BUNDLES_FILE}: {where} key 'name' must be kebab-case")
    if name in seen:
        raise ValueError(f"{BUNDLES_FILE}: duplicate bundle name '{name}'")
    seen.add(name)
    desc = raw["description"]
    if not isinstance(desc, str) or not desc.strip() or "\n" in desc:
        raise ValueError(f"{BUNDLES_FILE}: {where} key 'description' must be one non-empty line")
    out = {"name": name, "description": desc,
           "skills": _str_list(raw["skills"], "skills", where),
           "agents": _str_list(raw["agents"], "agents", where)}
    if "requires" in raw:
        out["requires"] = _str_list(raw["requires"], "requires", where)
    return out


def load(repo: Path) -> dict:
    """Parse and validate bundles.yaml (design.md D2). Raises ValueError naming key and bundle."""
    try:
        doc = yaml.safe_load((repo / BUNDLES_FILE).read_text(encoding="utf-8"))
    except (OSError, yaml.YAMLError) as exc:
        raise ValueError(f"{BUNDLES_FILE}: cannot be read as YAML ({str(exc).splitlines()[0]})") from exc
    _exact_keys(doc, _TOP_KEYS, "the top level")
    _exact_keys(doc["owner"], _OWNER_KEYS, "key 'owner'")
    if not isinstance(doc["bundles"], list):
        raise ValueError(f"{BUNDLES_FILE}: key 'bundles' must be a list")
    seen: set[str] = set()
    return {"name": doc["name"],
            "owner": {"name": doc["owner"]["name"], "email": doc["owner"]["email"]},
            "description": doc["description"],
            "bundles": [_bundle(b, i, seen) for i, b in enumerate(doc["bundles"])]}


def _agent_map(repo: Path) -> dict:
    return json.loads((repo / AGENT_MAP).read_text(encoding="utf-8"))


def agent_frontmatter(repo: Path, stem: str) -> tuple[dict, str]:
    """Strictly parse agents/<stem>.md frontmatter (no fallback) and check its model alias."""
    path = repo / AGENTS_DIR / f"{stem}.md"
    if not path.exists():
        raise ValueError(f"agent '{stem}': {AGENTS_DIR}/{stem}.md does not exist")
    m = _FRONTMATTER.match(path.read_text(encoding="utf-8"))
    try:
        fm = yaml.safe_load(m.group(1)) if m else None
        reason = "not a mapping" if m else "no frontmatter block"
    except yaml.YAMLError as exc:
        fm, reason = None, str(exc).splitlines()[0]
    if not isinstance(fm, dict):
        raise ValueError(f"agent '{stem}': frontmatter is not valid YAML ({reason})")
    model = fm.get("model")
    if model is not None and model not in _agent_map(repo)["modelAliases"]:
        raise ValueError(f"agent '{stem}': unknown model alias '{model}'")
    return fm, m.group(2)


# ---------------------------------------------------------------- render
def _json_bytes(obj) -> bytes:
    return (json.dumps(obj, indent=2, ensure_ascii=False) + "\n").encode("utf-8")


def render(repo: Path) -> tuple[bytes, dict[str, str], bytes]:
    """Return (marketplace bytes, link map path→target, opencode catalogue bytes)."""
    doc, ver = load(repo), version(repo)
    market = {
        "name": doc["name"],
        "owner": doc["owner"],
        "metadata": {"description": doc["description"], "version": ver},
        "plugins": [{"name": b["name"], "description": b["description"], "version": ver,
                     "source": f"./{BUNDLES_DIR}/{b['name']}"} for b in doc["bundles"]],
    }
    links: dict[str, str] = {}
    for b in doc["bundles"]:
        for s in b["skills"]:
            links[f"{BUNDLES_DIR}/{b['name']}/skills/{s}"] = f"../../../{SKILLS_DIR}/{s}"
        for a in b["agents"]:
            links[f"{BUNDLES_DIR}/{b['name']}/agents/{a}.md"] = f"../../../{AGENTS_DIR}/{a}.md"
    stems = sorted({a for b in doc["bundles"] for a in b["agents"]})
    catalogue = {
        "version": ver,
        "bundles": [{"name": b["name"], "skills": b["skills"], "agents": b["agents"]}
                    for b in doc["bundles"]],
        "agents": {a: agent_frontmatter(repo, a)[0] for a in stems},
    }
    return _json_bytes(market), links, _json_bytes(catalogue)


def _sync_package_version(repo: Path, ver: str) -> None:
    path = repo / PACKAGE_JSON
    if not path.exists():
        return
    data = json.loads(path.read_text(encoding="utf-8"))
    data["version"] = ver
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write(repo: Path) -> list[str]:
    """Write both JSON renderings, recreate bundles/ and sync package.json (idempotent)."""
    market, links, catalogue = render(repo)  # raises before anything is written
    for rel, data in ((MARKETPLACE, market), (CATALOGUE, catalogue)):
        (repo / rel).parent.mkdir(parents=True, exist_ok=True)
        (repo / rel).write_bytes(data)
    shutil.rmtree(repo / BUNDLES_DIR, ignore_errors=True)
    for rel, target in links.items():
        (repo / rel).parent.mkdir(parents=True, exist_ok=True)
        os.symlink(target, repo / rel)
    _sync_package_version(repo, version(repo))
    return [MARKETPLACE, CATALOGUE, *links]


# ------------------------------------------------------------------ gate
def _link_errors(repo: Path, links: dict[str, str]) -> list[str]:
    out: list[str] = []
    for rel, target in links.items():
        p = repo / rel
        if p.is_symlink():
            if os.readlink(p) != target:
                out.append(f"wrong target: {rel} -> {os.readlink(p)} (expected {target})")
        elif p.exists():
            out.append(f"not a symlink (copy?): {rel}")
        else:
            out.append(f"missing link: {rel}")
    dirs = {Path(rel).parent.as_posix() for rel in links}
    dirs |= {Path(d).parent.as_posix() for d in dirs}
    root = repo / BUNDLES_DIR
    for dirpath, dirnames, filenames in os.walk(root):
        for name in list(dirnames) + filenames:
            rel = (Path(dirpath) / name).relative_to(repo).as_posix()
            if rel in links:
                if name in dirnames:
                    dirnames.remove(name)  # never descend into an expected link location
            elif rel not in dirs:
                out.append(f"orphan: {rel}")
                if name in dirnames:
                    dirnames.remove(name)
    return out


def _version_errors(repo: Path, ver: str) -> list[str]:
    out: list[str] = []
    for rel, read in ((MARKETPLACE, lambda d: d.get("metadata", {}).get("version")),
                      (CATALOGUE, lambda d: d.get("version")),
                      (PACKAGE_JSON, lambda d: d.get("version"))):
        path = repo / rel
        if not path.exists():
            continue
        found = read(json.loads(path.read_text(encoding="utf-8")))
        if found != ver:
            out.append(f"version-sync: {rel} version '{found}' != VERSION '{ver}' — run make bundles")
    return out


def unreleased(repo: Path) -> list[str]:
    """Paths of skills and agents listed in no bundle: work in progress, never published
    (rebundle-by-activity D-14). releases.yml drops them from the release tree."""
    doc = load(repo)
    skills = {s for b in doc["bundles"] for s in b["skills"]}
    agents = {a for b in doc["bundles"] for a in b["agents"]}
    out = [f"skills/{p.parent.name}" for p in (repo / "skills").glob("*/SKILL.md") if p.parent.name not in skills]
    out += [f"agents/{p.name}" for p in (repo / "agents").glob("*.md") if p.stem not in agents]
    return sorted(out)


def gate_errors(repo: Path) -> list[str]:
    """Renderings match bundles.yaml + agents, links are links (when bundles/ exists), versions
    agree. [] == clean."""
    try:
        market, links, catalogue = render(repo)
    except ValueError as exc:
        return [str(exc)]
    out: list[str] = []
    for rel, data in ((MARKETPLACE, market), (CATALOGUE, catalogue)):
        path = repo / rel
        if not path.exists() or path.read_bytes() != data:
            out.append(f"{rel} {_STALE}")
    if (repo / BUNDLES_DIR).exists():  # generated, never committed: a fresh checkout has none (D-8)
        out += _link_errors(repo, links)
    out += _version_errors(repo, version(repo))
    return out
