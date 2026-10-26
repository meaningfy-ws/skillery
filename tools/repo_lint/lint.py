"""Repository self-consistency guardrail.

The repo embodies its own cosmic-python thesis: a thin read layer (bundles.yaml
via tools.bundle_gen + skill files) feeds pure check functions; ``main`` is the
entrypoint. Each public ``*_errors``/``*_gaps``/``*_mismatch`` function returns
a list of human-readable problems ([] == clean) so checks compose and test
trivially.
"""
from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path
from urllib.parse import unquote

import yaml

from tools.bundle_gen import gen as bundle_gen
from tools import skill_inventory

SKILLS_DIR = "skills"
README = "README.md"
# Hard ceiling that flags genuinely bloated files; ~500 stays the soft target
# in CONTRIBUTING. The established `architecture` skill is ~618 lines and fine.
MAX_SKILL_LINES = 650
# The Agent Skills specification's top-level frontmatter keys (agentskills.io/specification), and
# the Claude-only keys skillery accepts on top of them (ignored by opencode; recorded dual-CLI gap).
SPEC_SKILL_KEYS = ("name", "description", "license", "compatibility", "metadata", "allowed-tools")
CLAUDE_ONLY_SKILL_KEYS = ("argument-hint", "disable-model-invocation")
MAX_DESCRIPTION_CHARS = 1024  # the specification's hard limit
# Advisory review thresholds (reported, never failing): the method's description target and the
# specification's body budget (characters / 4 approximates tokens).
ADVISORY_DESCRIPTION_CHARS = 600
ADVISORY_SKILL_LINES = 500
ADVISORY_SKILL_TOKENS = 5000

# documenter, gherkin-writer: DEC-7 backlog candidates (docs/development/agent-template.md), not retired names
ALL_AGENT_NAMES = {"implementer", "code-reviewer", "epic-planner", "system-architect",
                   "conceptual-modeller", "proposal-writer"}
# Non-namespaced skills that legitimately live in OTHER plugins (so an agent may load them
# without a local skills/<name>/ dir). Namespaced skills (e.g. `superpowers:tdd`) are external by form.
EXTERNAL_SKILLS = {"stream-coding"}
# Files/dirs whose content must never be edited (frozen) — excluded from prose checks.
# `docs/practice/ai-coding/` was the only entry and is no longer frozen as of the
# `define-meaningfy-lifecycle` change: its premise ("content must never be edited") became
# false the moment that change rewrote `build-lifecycle.md` in place. Left empty (not deleted)
# so the mechanism stays available for a future freeze without speculative re-engineering.
FROZEN_GLOBS = ()

_FRONTMATTER = re.compile(r"^---\n(.*?)\n---", re.DOTALL)
# A link target may hold one level of balanced parentheses (filenames like
# "Handbook (2026).pdf"); targets are percent-decoded before the existence check.
_MD_LINK = re.compile(r"\[[^\]]*\]\(((?:[^()]|\([^()]*\))+)\)")
# A line that points to the owner rather than restating it — used by the ownership
# tripwire to skip legitimate delegation/pointers (not re-specifications).
_DELEGATES = re.compile(r"→\s*follow|\bfollow\b|\bsee\b|\bowned by\b|\bdelegate|\bdefer|\bvia\b|\bper\b\s+`?\w", re.IGNORECASE)
# `.claude/` is agent/tool working-state — planning docs (EPIC/PLAN/RESEARCH) and
# tool-installed skills (e.g. GitNexus's own) — not the published catalogue, so prose
# checks skip it. (`.claude-plugin/` is a distinct part and is NOT skipped.)
# `.opencode/` is local installer output (`skillery-opencode install --project`), never part
# of the authored catalogue. `bundles/` holds symlinks into skills/ and agents/ (rendered from
# bundles.yaml); walking it would report every skill twice. Prose/link checks skip both.
_SKIP_DIRS = {".git", ".venv", "node_modules", ".idea", "__pycache__", ".claude", ".opencode",
              "bundles"}


# ---------------------------------------------------------------- read layer
def _read(repo: Path, rel: str) -> str:
    return (repo / rel).read_text(encoding="utf-8")


def _bundle_list(repo: Path) -> list[dict] | None:
    """bundles.yaml via its one validator; None when it is invalid. The membership checks then
    skip, and `bundle_gates` reports the validation error once."""
    try:
        return bundle_gen.load(repo)["bundles"]
    except ValueError:
        return None


def _marketplace_skills(repo: Path) -> list[str]:
    return [s for b in _bundle_list(repo) or [] for s in b["skills"]]


def _skill_paths(repo: Path) -> dict[str, Path]:
    """Map skill-name → its SKILL.md, tolerating BOTH the flat layout
    (``skills/<name>/SKILL.md``) and the phase-nested layout
    (``skills/<phase>/<name>/SKILL.md``). The skill name is always the basename
    of the directory holding SKILL.md — independent of the phase folder."""
    root = repo / SKILLS_DIR
    out: dict[str, Path] = {}
    if not root.exists():
        return out
    for p in sorted(root.iterdir()):
        if not p.is_dir():
            continue
        if (p / "SKILL.md").exists():               # flat: skills/<name>/
            out[p.name] = p / "SKILL.md"
            continue
        for q in sorted(p.iterdir()):                # nested: skills/<phase>/<name>/
            if q.is_dir() and (q / "SKILL.md").exists():
                out[q.name] = q / "SKILL.md"
    return out


def _skill_dirs(repo: Path) -> list[str]:
    return sorted(_skill_paths(repo))


def _skill_md(repo: Path, name: str) -> str:
    return _skill_paths(repo)[name].read_text(encoding="utf-8")


def _frontmatter(text: str) -> dict | None:
    """Parse the YAML frontmatter tolerantly — the platform's loader is lenient
    (e.g. unquoted colons in descriptions), so the validator must not be stricter."""
    m = _FRONTMATTER.match(text)
    if not m:
        return None
    block = m.group(1)
    try:
        data = yaml.safe_load(block)
        if isinstance(data, dict):
            return data
    except yaml.YAMLError:
        pass
    out: dict = {}
    for line in block.splitlines():
        mm = re.match(r"^([A-Za-z][\w-]*):\s?(.*)$", line)
        if mm:
            out.setdefault(mm.group(1), mm.group(2).strip())
    return out


# Archived OpenSpec changes are a frozen historical record (e.g. the migrated
# `.claude/` planning docs) — preserved as-is, not held to live-link standards.
_ARCHIVE_PREFIX = "openspec/changes/archive/"


def _iter_text_files(repo: Path):
    for path in repo.rglob("*"):
        if path.suffix not in (".md", ".template"):
            continue
        if any(part in _SKIP_DIRS for part in path.parts):
            continue
        if str(path.relative_to(repo)).startswith(_ARCHIVE_PREFIX):
            continue
        yield path


def _is_frozen(repo: Path, path: Path) -> bool:
    rel = str(path.relative_to(repo))
    return any(rel.startswith(g) for g in FROZEN_GLOBS)


# ------------------------------------------------------------------- checks
def missing_skill_dirs(repo: Path) -> list[str]:
    if _bundle_list(repo) is None:
        return []  # reported by bundle_gates
    dirs = set(_skill_dirs(repo))
    return [f"bundles.yaml lists '{s}' but skills/{s}/SKILL.md is missing"
            for s in _marketplace_skills(repo) if s not in dirs]


def unregistered_skill_dirs(repo: Path) -> list[str]:
    if _bundle_list(repo) is None:
        return []  # reported by bundle_gates
    registered = set(_marketplace_skills(repo))
    return [f"skills/{s} exists but is not registered in bundles.yaml"
            for s in _skill_dirs(repo) if s not in registered]


def frontmatter_present_errors(repo: Path) -> list[str]:
    errs: list[str] = []
    for name in _skill_dirs(repo):
        if _frontmatter(_skill_md(repo, name)) is None:
            errs.append(f"{name}: SKILL.md has no top-of-file YAML frontmatter")
    return errs


def frontmatter_errors(repo: Path) -> list[str]:
    errs: list[str] = []
    for name in _skill_dirs(repo):
        fm = _frontmatter(_skill_md(repo, name))
        if fm is None:
            errs.append(f"{name}: no frontmatter")
            continue
        for field in ("name", "description"):
            if not fm.get(field):
                errs.append(f"{name}: missing '{field}'")
    return errs


def frontmatter_keys(repo: Path) -> list[str]:
    """Skill frontmatter uses only the specification's keys plus the recorded Claude-only ones,
    and `metadata` is a map of strings (the specification's extension point)."""
    allowed = SPEC_SKILL_KEYS + CLAUDE_ONLY_SKILL_KEYS
    out: list[str] = []
    for name in _skill_dirs(repo):
        fm = _frontmatter(_skill_md(repo, name)) or {}
        for key in fm:
            if key not in allowed:
                out.append(f"{name}: frontmatter key '{key}' is not in the Agent Skills specification "
                           f"({', '.join(SPEC_SKILL_KEYS)}) nor Claude-only ({', '.join(CLAUDE_ONLY_SKILL_KEYS)})")
        meta = fm.get("metadata")
        if meta is not None and not (isinstance(meta, dict) and all(isinstance(v, str) for v in meta.values())):
            out.append(f"{name}: 'metadata' must map keys to string values")
    return out


def description_too_long(repo: Path, limit: int = MAX_DESCRIPTION_CHARS) -> list[str]:
    out: list[str] = []
    for name in _skill_dirs(repo):
        desc = str((_frontmatter(_skill_md(repo, name)) or {}).get("description", ""))
        if len(desc) > limit:
            out.append(f"{name}: description is {len(desc)} characters (> {limit})")
    return out


def description_length_report(repo: Path) -> list[str]:
    """Advisory: descriptions above the method's target length."""
    out: list[str] = []
    for name in _skill_dirs(repo):
        n = len(str((_frontmatter(_skill_md(repo, name)) or {}).get("description", "")))
        if n > ADVISORY_DESCRIPTION_CHARS:
            out.append(f"{name}: description is {n} characters (target <= {ADVISORY_DESCRIPTION_CHARS})")
    return out


def skill_size_report(repo: Path) -> list[str]:
    """Advisory: SKILL.md bodies above the specification's budget."""
    out: list[str] = []
    for name in _skill_dirs(repo):
        text = _body(_skill_md(repo, name))
        lines, tokens = len(text.splitlines()), len(text) // 4
        if lines > ADVISORY_SKILL_LINES or tokens > ADVISORY_SKILL_TOKENS:
            out.append(f"{name}: SKILL.md body is {lines} lines, ~{tokens} tokens "
                       f"(body budget {ADVISORY_SKILL_LINES} lines / {ADVISORY_SKILL_TOKENS} tokens)")
    return out


FACETS_FILE = "facets.yaml"
CORE_BUNDLE = "meaningfy-core"
_REGISTER_FILE = "docs/development/README.md"
_REGISTER_SECTION = "## 8. Where things live"


def facets_declared(repo: Path) -> list[str]:
    """Every skill and agent declares one allowed value per facet of facets.yaml under `metadata`
    (define-catalogue-model DEC-1, D-2). Silent where the repo has no facets.yaml."""
    path = repo / FACETS_FILE
    if not path.exists():
        return []
    vocab = (yaml.safe_load(path.read_text(encoding="utf-8")) or {}).get("facets", {})
    files = [(n, p) for n, p in _skill_paths(repo).items()]
    if (repo / "agents").exists():
        files += [(f"agents/{p.stem}", p) for p in sorted((repo / "agents").glob("*.md"))]
    out: list[str] = []
    for label, p in files:
        meta = (_frontmatter(p.read_text(encoding="utf-8")) or {}).get("metadata") or {}
        for facet, values in vocab.items():
            v = meta.get(facet) if isinstance(meta, dict) else None
            if v is None:
                out.append(f"{label}: missing facet 'metadata.{facet}'")
            elif not isinstance(v, str) or v not in values:
                out.append(f"{label}: facet '{facet}' is {v!r}; allowed: {', '.join(values)}")
    return out


USE_CASES_DIR = "use-cases"
USE_CASE_FIELDS = ("id", "title", "primary_actor", "trigger", "success_guarantee", "area",
                   "served_by", "status")
USE_CASE_STATUSES = ("covered", "partial", "missing")
# Lifted into frontmatter (D-14), so they never appear as body sections.
_UC_LIFTED = ("Trigger", "Success Guarantee", "Primary Actor")


def use_case_catalogue(repo: Path) -> list[str]:
    """Every `use-cases/*.md` holds a White use case whose frontmatter passes D-14's "Checked"
    column (restructure-and-evaluate-catalogue). Silent where the repo has no use-cases/."""
    root = repo / USE_CASES_DIR
    if not root.exists():
        return []
    vocab = (yaml.safe_load((repo / FACETS_FILE).read_text(encoding="utf-8")) or {}).get(
        "facets", {}) if (repo / FACETS_FILE).exists() else {}
    areas = vocab.get("area", {})
    skills = set(_skill_paths(repo))
    agents = {p.stem for p in (repo / "agents").glob("*.md")} if (repo / "agents").exists() else set()
    seen: dict[str, str] = {}
    out: list[str] = []
    for p in sorted(root.glob("*.md")):
        rel = f"{USE_CASES_DIR}/{p.name}"
        text = p.read_text(encoding="utf-8")
        fm = _frontmatter(text)
        if not isinstance(fm, dict):
            out.append(f"{rel}: no YAML frontmatter")
            continue
        out += [f"{rel}: missing '{k}'" for k in USE_CASE_FIELDS if not fm.get(k) and k != "served_by"]
        if "served_by" not in fm:
            out.append(f"{rel}: missing 'served_by'")
        uid = str(fm.get("id", ""))
        if uid and not p.stem.startswith(f"{uid}-"):
            out.append(f"{rel}: id '{uid}' does not match the file name")
        if uid in seen:
            out.append(f"{rel}: duplicate id '{uid}' (also {seen[uid]})")
        seen.setdefault(uid, rel)
        if fm.get("area") and fm["area"] not in areas:
            out.append(f"{rel}: area '{fm['area']}' is not in {FACETS_FILE}")
        if fm.get("status") and fm["status"] not in USE_CASE_STATUSES:
            out.append(f"{rel}: status '{fm['status']}'; allowed: {', '.join(USE_CASE_STATUSES)}")
        served = fm.get("served_by") or {}
        if not isinstance(served, dict):
            out.append(f"{rel}: served_by must be {{agents: [...], skills: [...]}}")
            served = {}
        out += [f"{rel}: served_by agent '{a}' is not in agents/"
                for a in served.get("agents") or [] if a not in agents]
        out += [f"{rel}: served_by skill '{s}' is not in skills/"
                for s in served.get("skills") or [] if s not in skills]
        headings = re.findall(r"^##\s+(.+?)\s*$", _body(text), re.MULTILINE)
        if "Brief Description" not in headings:
            out.append(f"{rel}: body has no '## Brief Description'")
        out += [f"{rel}: '{h}' is a body section; it belongs in frontmatter only"
                for h in headings if h.split(" (")[0] in _UC_LIFTED]
    return out


def use_case_coverage(repo: Path) -> list[str]:
    """Every skill and agent appears in the served_by of at least one use case (rebundle-by-activity
    D-2). Silent where the repo has no use-cases/."""
    root = repo / USE_CASES_DIR
    if not root.exists():
        return []
    served: set[str] = set()
    for p in root.glob("*.md"):
        by = (_frontmatter(p.read_text(encoding="utf-8")) or {}).get("served_by") or {}
        if isinstance(by, dict):
            served |= {f"agents/{a}" for a in by.get("agents") or []}
            served |= {f"skills/{s}" for s in by.get("skills") or []}
    agents = sorted(p.stem for p in (repo / "agents").glob("*.md")) if (repo / "agents").exists() else []
    return [f"{item}: serves no use case (add it to a use case's served_by)"
            for item in [f"skills/{s}" for s in sorted(_skill_paths(repo))] + [f"agents/{a}" for a in agents]
            if item not in served]


_DEP_REQUIRED = ("name", "kind", "source", "pin", "provenance", "used_by", "opencode_status",
                 "claude_install", "opencode_install")
_DEP_OPTIONAL = ("summary", "transport", "notes", "why", "hosting")


def dependencies_register(repo: Path) -> list[str]:
    """dependencies.yaml entries carry the D-7 fields (rebundle-by-activity): known keys, a known
    kind, the required fields, and an opencode_status that starts with a status keyword."""
    path = repo / skill_inventory.DEPENDENCIES_FILE
    if not path.exists():
        return []
    entries = yaml.safe_load(path.read_text(encoding="utf-8")) or []
    if not isinstance(entries, list):
        return [f"{path.name}: must be a list of entries"]
    keywords = list(skill_inventory.DEPENDENCY_STATUSES)
    out: list[str] = []
    for d in entries:
        if not isinstance(d, dict):
            out.append(f"{path.name}: entry {d!r} is not a mapping")
            continue
        who = f"{path.name}: '{d.get('name', '?')}'"
        out += [f"{who} unknown key '{k}'" for k in d if k not in _DEP_REQUIRED + _DEP_OPTIONAL]
        out += [f"{who} missing '{k}'" for k in _DEP_REQUIRED if not d.get(k)]
        if d.get("kind") and d["kind"] not in skill_inventory.DEPENDENCY_KINDS:
            out.append(f"{who} kind '{d['kind']}'; allowed: {', '.join(skill_inventory.DEPENDENCY_KINDS)}")
        if d.get("kind") == "mcp-server" and not d.get("transport"):
            out.append(f"{who} missing 'transport' (required for an mcp-server)")
        status = str(d.get("opencode_status") or "")
        if status and status.split(" ")[0] not in keywords:
            out.append(f"{who} opencode_status must start with {', '.join(keywords[:-1])} or {keywords[-1]}")
    return out


FUTURE_FEATURES = "docs/future-features.md"


def use_case_changes_registered(repo: Path) -> list[str]:
    """A partial or missing use case names a change that docs/future-features.md lists
    (rebundle-by-activity D-12). Silent without use-cases/ or without the register."""
    root, register = repo / USE_CASES_DIR, repo / FUTURE_FEATURES
    if not root.exists() or not register.exists():
        return []
    text = register.read_text(encoding="utf-8")
    out: list[str] = []
    for p in sorted(root.glob("*.md")):
        fm = _frontmatter(p.read_text(encoding="utf-8")) or {}
        status, change = fm.get("status"), str(fm.get("change") or "")
        if status not in ("partial", "missing"):
            continue
        rel = f"{USE_CASES_DIR}/{p.name}"
        if not change:
            out.append(f"{rel}: status '{status}' needs a change listed in {FUTURE_FEATURES}")
        elif not re.search(rf"(?<![\w-]){re.escape(change)}(?![\w-])", text):
            out.append(f"{rel}: change '{change}' is not in {FUTURE_FEATURES}")
    return out


TOP_LEVEL_FOLDERS = ("skills", "agents", "use-cases", "openspec", "docs", "tools", "tests", ".github",
                     ".claude-plugin")
_GENERATED_FOLDERS = ("bundles",)  # make bundles, git-ignored (rebundle-by-activity D-8)


def top_level_folders(repo: Path) -> list[str]:
    """Only the allowed folders sit at the top level (rebundle-by-activity D-13); other hidden
    folders (.git, .venv, a CLI's own) and generated ones are not the repo's structure."""
    return [f"{d.name}/: not an allowed top-level folder (allowed: {', '.join(TOP_LEVEL_FOLDERS)})"
            for d in sorted(repo.iterdir())
            if d.is_dir() and not d.name.startswith(".") and d.name not in TOP_LEVEL_FOLDERS
            and d.name not in _GENERATED_FOLDERS]


def cross_skill_paths(repo: Path) -> list[str]:
    """No link from a skill's files resolves outside that skill's folder (restructure D-15,
    widened by rebundle-by-activity D-13): an installed skill has only its own folder, so it names
    another skill and states any other fact itself."""
    dirs = {p.parent.resolve(): name for name, p in _skill_paths(repo).items()}
    out: list[str] = []
    for src_dir, src in dirs.items():
        for f in sorted(src_dir.rglob("*.md")):
            for target in _MD_LINK.findall(f.read_text(encoding="utf-8")):
                target = unquote(target.split("#")[0].strip())
                if not target or re.match(r"^[a-z]+:", target):
                    continue
                resolved = (f.parent / target).resolve()
                if resolved.is_relative_to(src_dir):
                    continue
                rel = f.relative_to(repo.resolve()).as_posix()
                owner = next((n for d, n in dirs.items() if resolved.is_relative_to(d)), None)
                out.append(f"{rel}: links into skill '{owner}' ({target}); name the skill instead"
                           if owner else
                           f"{rel}: links outside its skill folder ({target}); "
                           f"state the fact or name the owning skill")
    return out


def bundle_requirements(repo: Path) -> list[str]:
    """Cross-bundle "depends on" edges point into core or a required bundle; core requires
    nothing; required bundles exist; the requirement graph is acyclic (define-catalogue-model D-8).
    Edges come from the inventory's own parser, so there is one reading of the Delegates lines."""
    try:
        bundles = (yaml.safe_load((repo / bundle_gen.BUNDLES_FILE).read_text(encoding="utf-8")) or {}).get("bundles", [])
    except (OSError, yaml.YAMLError):
        return []  # bundle_gates reports an unreadable bundles.yaml
    names = {b["name"] for b in bundles}
    requires = {b["name"]: list(b.get("requires") or []) for b in bundles}
    out: list[str] = []
    for b, reqs in requires.items():
        for req in reqs:
            if req not in names:
                out.append(f"bundle '{b}' requires unknown bundle '{req}'")
            if req == CORE_BUNDLE:
                out.append(f"bundle '{b}' lists '{CORE_BUNDLE}', which is implicit")
    if requires.get(CORE_BUNDLE):
        out.append(f"'{CORE_BUNDLE}' must require nothing")
    state: dict[str, int] = {}
    def visit(node: str, trail: list[str]) -> None:
        if state.get(node) == 1:
            out.append("bundle requirement cycle: " + " -> ".join(trail[trail.index(node):] + [node]))
            return
        if state.get(node) == 2:
            return
        state[node] = 1
        for nxt in requires.get(node, []):
            if nxt in names:
                visit(nxt, trail + [node])
        state[node] = 2
    for b in sorted(names):
        visit(b, [])
    bundle_of = {s: b["name"] for b in bundles for s in b.get("skills", [])}
    skill_names = set(bundle_of)
    for name in _skill_dirs(repo):
        src = bundle_of.get(name)
        if src is None:
            continue
        for dep in skill_inventory._depends_on(_skill_md(repo, name), skill_names, name):
            dst = bundle_of[dep]
            if dst == src or dst == CORE_BUNDLE:
                continue
            if src == CORE_BUNDLE:
                out.append(f"'{name}' ({CORE_BUNDLE}) delegates to '{dep}' ({dst}); {CORE_BUNDLE} "
                           "requires nothing: reword the hand-off as Related")
            elif dst not in requires.get(src, []):
                out.append(f"'{name}' ({src}) delegates to '{dep}' ({dst}), but '{src}' does not "
                           f"require '{dst}': add it to requires or reword the hand-off as Related")
    return out


def _register_views(repo: Path) -> list[str] | None:
    path = repo / _REGISTER_FILE
    if not path.exists():
        return None
    text = path.read_text(encoding="utf-8")
    start = text.find(_REGISTER_SECTION)
    if start < 0:
        return []
    end = text.find("\n## ", start + 1)
    section = text[start:end if end > 0 else len(text)]
    views = []
    for line in section.splitlines():
        m = re.match(r"^\|\s*\[?`([^`]+)`", line)
        if m:
            views.append(m.group(1))
    return views


def doc_register_complete(repo: Path) -> list[str]:
    """Every documentation file matches a row of the register in the method's section 8: an exact
    path, or a `folder/**` prefix covering every file below it (define-catalogue-model D-8, D-10)."""
    views = _register_views(repo)
    if views is None:
        return []
    exact = {v for v in views if not v.endswith("/**")}
    prefixes = tuple(v[:-2] for v in views if v.endswith("/**"))
    docs = sorted(p.relative_to(repo).as_posix() for p in (repo / "docs").rglob("*.md")) if (repo / "docs").exists() else []
    docs += [f for f in ("README.md", "AGENTS.md", "CLAUDE.md") if (repo / f).exists()]
    return [f"{f}: not in the documentation register ({_REGISTER_FILE} §8)"
            for f in docs if f not in exact and not f.startswith(prefixes)]


def frontmatter_strict_yaml(repo: Path) -> list[str]:
    """Strict loaders (opencode, `npx skills`) skip a skill whose frontmatter is not valid YAML, so
    every skill and agent frontmatter block must parse with `yaml.safe_load` to a dict. The tolerant
    `_frontmatter` stays for the other checks, so each fault is reported once, here."""
    files = [p for p in _skill_paths(repo).values()]
    if (repo / "agents").exists():
        files += sorted((repo / "agents").glob("*.md"))
    out: list[str] = []
    for path in files:
        m = _FRONTMATTER.match(path.read_text(encoding="utf-8"))
        if not m:
            continue  # reported by frontmatter_present_errors
        try:
            ok = isinstance(yaml.safe_load(m.group(1)), dict)
            reason = "not a mapping"
        except yaml.YAMLError as exc:
            ok, reason = False, str(exc).splitlines()[0]
        if not ok:
            out.append(f"{path.relative_to(repo).as_posix()}: frontmatter is not strict YAML ({reason})")
    return out


def name_mismatch(repo: Path) -> list[str]:
    out: list[str] = []
    for name in _skill_dirs(repo):
        fm = _frontmatter(_skill_md(repo, name))
        if fm is None:
            continue  # reported by frontmatter_present_errors
        if fm.get("name") != name:
            out.append(f"{name}: frontmatter name '{fm.get('name')}' != dir '{name}'")
    return out


def _bundle_membership(repo: Path) -> dict[str, set[str]]:
    """Bundle name -> set of skill names, read from bundles.yaml (the truth)."""
    return {b["name"]: set(b["skills"]) for b in _bundle_list(repo) or []}


def expected_bundle_membership(repo: Path) -> list[str]:
    """Placement check with bundles.yaml as the source of truth: every skill lives in at most
    one bundle (a skill dir in none is `unregistered_skill_dirs`'). Bundle names are not pinned
    (a second bundle definition would drift)."""
    if _bundle_list(repo) is None:
        return []  # reported by bundle_gates
    skill_to_bundles: dict[str, list[str]] = {}
    for bundle, skills in _bundle_membership(repo).items():
        for s in skills:
            skill_to_bundles.setdefault(s, []).append(bundle)
    return [f"skill '{s}' is in multiple bundles: {', '.join(bundles)}"
            for s, bundles in sorted(skill_to_bundles.items()) if len(bundles) > 1]


def agent_bundle_membership(repo: Path) -> list[str]:
    """Every agents/*.md is in exactly one bundle of bundles.yaml, and every listed agent exists
    (single-source-distribution DEC-3), and its one bundle lists its primary skill
    (agent-authoring-standard D-4)."""
    bundles = _bundle_list(repo)
    if bundles is None:
        return []  # reported by bundle_gates
    agent_to_bundles: dict[str, list[str]] = {}
    bundle_skills = {b["name"]: set(b["skills"]) for b in bundles}
    for b in bundles:
        for a in b["agents"]:
            agent_to_bundles.setdefault(a, []).append(b["name"])
    files = {p.stem for p in (repo / "agents").glob("*.md")} if (repo / "agents").exists() else set()
    out: list[str] = []
    for a in sorted(files - set(agent_to_bundles)):
        out.append(f"agent '{a}' is in no bundle in bundles.yaml")
    for a, bundles in sorted(agent_to_bundles.items()):
        if len(bundles) > 1:
            out.append(f"agent '{a}' is in multiple bundles: {', '.join(bundles)}")
        if a not in files:
            out.append(f"bundles.yaml lists agent '{a}' but agents/{a}.md does not exist")
        elif len(bundles) == 1:
            out += _primary_skill_errors(repo, a, bundles[0], bundle_skills[bundles[0]])
    return out


def _primary_skill_errors(repo: Path, agent: str, bundle: str, skills: set[str]) -> list[str]:
    """agent-authoring-standard D-4: the agent's one bundle lists its primary skill — the first
    `skills:` entry that is neither namespaced nor external. A missing or non-list `skills:` is
    agent_conformance's to report; unparsable frontmatter is bundle_gates'."""
    try:
        listed = bundle_gen.agent_frontmatter(repo, agent)[0].get("skills")
    except ValueError:
        return []
    if not isinstance(listed, list):
        return []
    local = [s for s in listed if ":" not in str(s) and s not in EXTERNAL_SKILLS]
    if not local:
        return [f"agent '{agent}' has no local primary skill"]
    if local[0] not in skills:
        return [f"agent '{agent}' is in bundle '{bundle}' but its primary skill '{local[0]}' is not"]
    return []


# Authoring/illustrative docs whose "links" are placeholder examples, not
# navigation: the skill template, the authoring guides, and skill reference
# files. Navigational docs (README, docs/, SKILL.md, plan files) are still
# checked — that is where a moved file leaves a real dangling link.
def _is_illustrative(rel_parts: tuple[str, ...]) -> bool:
    # templates carry placeholder links (`references/<question-it-answers>.md`)
    return rel_parts[0] == "template" or rel_parts[-1].endswith("-template.md") or "references" in rel_parts


def broken_links(repo: Path) -> list[str]:
    out: list[str] = []
    for md in _iter_text_files(repo):
        if _is_illustrative(md.relative_to(repo).parts):
            continue
        for target in _MD_LINK.findall(md.read_text(encoding="utf-8")):
            if target.startswith(("http://", "https://", "#", "mailto:")):
                continue
            rel = unquote(target.split("#")[0])
            if not rel:
                continue
            if not (md.parent / rel).exists():
                out.append(f"{md.relative_to(repo)} -> {target}")
    return out


def _body(text: str) -> str:
    """SKILL.md without its frontmatter: size budgets apply to the body (agentskills.io)."""
    m = _FRONTMATTER.match(text)
    return text[m.end():] if m else text


def skill_too_long(repo: Path, limit: int = MAX_SKILL_LINES) -> list[str]:
    out: list[str] = []
    for name in _skill_dirs(repo):
        n = len(_body(_skill_md(repo, name)).splitlines())
        if n > limit:
            out.append(f"{name}: SKILL.md body is {n} lines (> {limit})")
    return out


def orphan_agent_references(repo: Path) -> list[str]:
    """For any agent whose file no longer exists, ensure no non-frozen text
    file still references it. Incremental-safe: silent while the file exists."""
    agents_dir = repo / "agents"
    out: list[str] = []
    for agent in sorted(ALL_AGENT_NAMES):
        if (agents_dir / f"{agent}.md").exists():
            continue
        for f in _iter_text_files(repo):
            # frozen docs predate the change; EPIC + the migration note name agents on purpose;
            # active openspec/changes/ trees legitimately name retired/added agents in their
            # proposal.md and preserved seeds (archived changes are already skipped upstream
            # at _iter_text_files via _ARCHIVE_PREFIX).
            if (_is_frozen(repo, f) or f.name.startswith("EPIC-setup")
                    or str(f.relative_to(repo)) == "docs/environment/setup.md"
                    or str(f.relative_to(repo)).startswith("openspec/changes/")):
                continue
            if re.search(rf"\b{re.escape(agent)}\b", f.read_text(encoding="utf-8")):
                out.append(f"{f.relative_to(repo)} references dropped agent '{agent}'")
    return out


def orphan_path_mentions(repo: Path, banned: list[str]) -> list[str]:
    """Any non-frozen text file mentioning a moved/removed basename."""
    out: list[str] = []
    for f in _iter_text_files(repo):
        if _is_frozen(repo, f) or f.parts[-1].startswith("EPIC-setup"):
            continue
        text = f.read_text(encoding="utf-8")
        for name in banned:
            if name in text:
                out.append(f"{f.relative_to(repo)} mentions removed '{name}'")
    return out


# Top-level repo dirs a spec may link into; bounds the auto-fixer so it never
# rewrites an incidental same-named sibling file.
_LINKABLE_TOPDIRS = {"skills", "docs", "openspec", "agents", "tools", "tests", "use-cases"}


def groomed_spec_purpose(repo: Path) -> list[str]:
    """Archived specs must have their Purpose groomed, not left as the archive
    placeholder. The `openspec archive` step writes a `TBD - created by archiving`
    Purpose that `validate --strict` does not catch; this does."""
    specs = repo / "openspec" / "specs"
    if not specs.exists():
        return []
    return [f"{s.relative_to(repo)}: Purpose still holds the archive placeholder"
            for s in sorted(specs.glob("**/spec.md"))
            if "TBD - created by archiving" in s.read_text(encoding="utf-8")]


_REL_LINK = re.compile(r"\]\(((?:\.\./)+)([^)#]+?)(#[^)]*)?\)")


def normalize_spec_links(repo: Path) -> list[str]:
    """Auto-fix: rewrite `(../)+<topdir>/...` links under openspec/specs/ to the
    correct depth for the file's location. `openspec archive` copies a delta's
    relative links verbatim, so a delta two levels deeper than its merged home
    leaves over-deep links; this recomputes them. Returns the fixes applied and
    writes them in place."""
    specs = repo / "openspec" / "specs"
    if not specs.exists():
        return []
    fixes: list[str] = []
    for spec in sorted(specs.glob("**/spec.md")):
        text = spec.read_text(encoding="utf-8")

        def repl(m: re.Match) -> str:
            up, rest, anchor = m.group(1), m.group(2), m.group(3) or ""
            if rest.split("/")[0] not in _LINKABLE_TOPDIRS:
                return m.group(0)
            target = repo / rest
            if not target.exists():
                return m.group(0)
            correct = os.path.relpath(target, spec.parent)
            if correct != up + rest:
                fixes.append(f"{spec.relative_to(repo)}: {up}{rest} -> {correct}")
            return f"]({correct}{anchor})"

        new = _REL_LINK.sub(repl, text)
        if new != text:
            spec.write_text(new, encoding="utf-8")
    return fixes


def readme_inventory_gaps(repo: Path) -> list[str]:
    readme = _read(repo, README)
    out: list[str] = []
    for name in _skill_dirs(repo):
        if not re.search(rf"(^|[^\w-]){re.escape(name)}([^\w-]|$)", readme):
            out.append(f"README does not list skill '{name}'")
    return out


def duplicate_fact_candidates(repo: Path) -> list[str]:
    """Non-failing ASSIST for G-DUP: flags files that *authoritatively* state a
    canonical fact (vs. pointing by name) for human review."""
    signatures = {
        "layer rules": r"models/.*adapters/.*services/.*entrypoints",
        "red-green-refactor": r"red.?green.?refactor",
        "branch naming pattern": r"feature/.{0,120}release/.{0,120}hotfix/",
        "80% coverage": r"\b80%\s+(test\s+)?coverage",
    }
    out: list[str] = []
    for f in _iter_text_files(repo):
        if f.parts[-1].startswith("EPIC-setup"):
            continue
        text = f.read_text(encoding="utf-8")
        for label, pat in signatures.items():
            if re.search(pat, text, re.IGNORECASE | re.DOTALL):
                out.append(f"[{label}] {f.relative_to(repo)}")
    return out


def trigger_probe_report(repo: Path) -> list[str]:
    """Non-blocking trigger-probe harness (Q4.2=B). Deterministic checks only:
    every probe's `expect` must name a real skill, and every skill should have at
    least one probe (coverage). LLM trigger-matching stays out of CI. Returned
    strings are advisory — surfaced in the assist section, never fail the build."""
    fixtures = repo / "tests" / "trigger_probes.yaml"
    if not fixtures.exists():
        return []
    try:
        data = yaml.safe_load(fixtures.read_text(encoding="utf-8")) or {}
    except yaml.YAMLError as exc:
        return [f"trigger_probes.yaml failed to parse: {exc}"]
    probes = data.get("probes", []) if isinstance(data, dict) else []
    skills = set(_skill_dirs(repo))
    out: list[str] = []
    covered: set[str] = set()
    for entry in probes:
        expect = (entry or {}).get("expect")
        if expect not in skills:
            out.append(f"probe expects unknown skill '{expect}'")
        else:
            covered.add(expect)
    for missing in sorted(skills - covered):
        out.append(f"skill '{missing}' has no trigger probe (coverage gap)")
    return out


def ownership_claim_report(repo: Path) -> list[str]:
    """Non-blocking single-owner tripwire (Q5.2=B). Flags when a NON-owner skill's
    SKILL.md contains a defining claim pattern for a capability owned elsewhere
    (RISK-4, no double-spec). Owners marked ``external:<name>`` are not local, so
    any local skill claiming them is flagged. Advisory only — never fails CI."""
    fixtures = repo / "tests" / "ownership.yaml"
    if not fixtures.exists():
        return []
    try:
        data = yaml.safe_load(fixtures.read_text(encoding="utf-8")) or {}
    except yaml.YAMLError as exc:
        return [f"ownership.yaml failed to parse: {exc}"]
    caps = data.get("capabilities", []) if isinstance(data, dict) else []
    paths = _skill_paths(repo)
    out: list[str] = []
    for cap in caps:
        owner = (cap or {}).get("owner", "")
        tag = cap.get("tag", "?")
        owner_local = owner if owner in paths else None
        patterns = cap.get("claim_patterns", [])
        for name, path in paths.items():
            if name == owner_local:
                continue
            for line in path.read_text(encoding="utf-8").splitlines():
                # A line that explicitly DELEGATES (points to the owner) is not a
                # re-specification — skip it so the tripwire flags only genuine claims.
                if _DELEGATES.search(line):
                    continue
                if any(re.search(pat, line, re.IGNORECASE) for pat in patterns):
                    out.append(f"[{tag}] skill '{name}' may re-specify a capability owned by '{owner}'")
                    break
    return out


# ------------------------------------------- single-source-of-authority checks (DEC-12)
_BOUNDARY_HEADING = re.compile(r"^##\s+.*\bboundary\b", re.IGNORECASE | re.MULTILINE)
_RELATED_PARA = re.compile(r"\*\*Related:?\*\*(.*?)(?:\n\n|\Z)", re.IGNORECASE | re.DOTALL)


def boundary_section_present(repo: Path) -> list[str]:
    """Every SKILL.md MUST declare a Boundary section so its Owns/Delegates/Related graph is
    explicit (the single-source-of-authority graph is only auditable if every skill states it)."""
    return [f"{name}: SKILL.md has no '## Boundary ...' section"
            for name in _skill_dirs(repo)
            if not _BOUNDARY_HEADING.search(_skill_md(repo, name))]


def _agent_skill_lists(repo: Path) -> dict[str, list[str]]:
    out: dict[str, list[str]] = {}
    agents_dir = repo / "agents"
    if not agents_dir.exists():
        return out
    for p in sorted(agents_dir.glob("*.md")):
        fm = _frontmatter(p.read_text(encoding="utf-8")) or {}
        skills = fm.get("skills")
        if isinstance(skills, list):
            out[p.stem] = [str(s) for s in skills]
    return out


def agent_skill_alignment(repo: Path) -> list[str]:
    """Every skill named in an agents/*.md `skills:` list must exist locally, be plugin-namespaced
    (contains ':'), or be a known external skill — catches dropped/renamed/typo'd skill references."""
    local = set(_skill_dirs(repo))
    out: list[str] = []
    for agent, skills in _agent_skill_lists(repo).items():
        for s in skills:
            if ":" in s or s in EXTERNAL_SKILLS or s in local:
                continue
            out.append(f"agent '{agent}' lists unknown skill '{s}'")
    return out


def _related_map(repo: Path) -> dict[str, set[str]]:
    paths = _skill_paths(repo)
    names = set(paths)
    related: dict[str, set[str]] = {}
    for name, path in paths.items():
        m = _RELATED_PARA.search(path.read_text(encoding="utf-8"))
        cited = {t for t in re.findall(r"`([a-z0-9-]+)`", m.group(1))} if m else set()
        related[name] = {t for t in cited if t in names and t != name}
    return related


def reciprocal_related_report(repo: Path) -> list[str]:
    """ADVISORY (DEC-12, refined): peer `**Related:**` links should be mutual. Surfaced for triage —
    NOT blocking, because cross-cluster relatedness is a judgment call and a core reference is cited
    by more skills than it lists back. Fix the genuine asymmetries; ignore the deliberate ones."""
    related = _related_map(repo)
    return [f"'{a}' lists '{b}' as Related, but '{b}' does not reciprocate"
            for a, cites in related.items() for b in sorted(cites)
            if a not in related.get(b, set())]


# ------------------------------------------- dual-CLI foundation invariants (DEC-12/13)
VERSION_FILE = "VERSION"
HOOKS_INVENTORY = "hooks.yaml"
_VALID_MECHANISM = {"git", "ci", "agent"}
_VALID_PHASE = {"quality", "phase-gate"}
# The ONLY skill bodies allowed to carry a CLI-specific (/opsx: or .claude/) reference.
# Seeded from docs/dual-cli/body-agnosticism-audit.md — any other body fails the guard.
_BODY_AGNOSTIC_ALLOWLIST = {"epic-planning", "spec-stewardship", "guardrails", "project-setup"}
_CLI_ISM = re.compile(r"/opsx:|\.claude/")


def agents_canonical_invariant(repo: Path) -> list[str]:
    """DEC-12: AGENTS.md is the canonical root binding, CLAUDE.md a thin pointer, neither a
    symlink to the other. Asserts the crisp structural facts (form, not prose)."""
    out: list[str] = []
    agents, claude = repo / "AGENTS.md", repo / "CLAUDE.md"
    for f in (agents, claude):
        if not f.exists():
            out.append(f"{f.name} is missing")
        elif f.is_symlink():
            out.append(f"{f.name} is a symlink (DEC-12 forbids the AGENTS/CLAUDE symlink)")
    if claude.exists() and not claude.is_symlink():
        if "AGENTS.md" not in claude.read_text(encoding="utf-8"):
            out.append("CLAUDE.md does not point to AGENTS.md (it must be a thin pointer)")
        if "<!-- gitnexus:start -->" in claude.read_text(encoding="utf-8"):
            out.append("CLAUDE.md contains a gitnexus block (it lives in AGENTS.md only)")
    return out


def hooks_inventory_shape(repo: Path) -> list[str]:
    """DEC-13: the hook intent inventory is well-formed — every hook has id/intent/provenance and
    at least one binding; every binding's mechanism/phase is valid; the inventory version tracks
    the root VERSION."""
    path = repo / HOOKS_INVENTORY
    if not path.exists():
        return [f"{HOOKS_INVENTORY} is missing"]
    try:
        data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    except yaml.YAMLError as exc:
        return [f"{HOOKS_INVENTORY} failed to parse: {exc}"]
    out: list[str] = []
    version = str(data.get("version", "")).strip()
    if (repo / VERSION_FILE).exists():
        root_version = _read(repo, VERSION_FILE).strip()
        if version != root_version:
            out.append(f"inventory version '{version}' != VERSION '{root_version}'")
    seen: set[str] = set()
    for hook in data.get("hooks", []) or []:
        hid = (hook or {}).get("id")
        if not hid:
            out.append("a hook has no 'id'")
            continue
        if hid in seen:
            out.append(f"duplicate hook id '{hid}'")
        seen.add(hid)
        if not hook.get("intent"):
            out.append(f"hook '{hid}' has no 'intent'")
        if not hook.get("provenance"):
            out.append(f"hook '{hid}' has no 'provenance'")
        bindings = hook.get("bindings") or []
        if not bindings:
            out.append(f"hook '{hid}' has no bindings")
        for b in bindings:
            if (b or {}).get("mechanism") not in _VALID_MECHANISM:
                out.append(f"hook '{hid}': bad mechanism '{(b or {}).get('mechanism')}'")
            if (b or {}).get("phase") not in _VALID_PHASE:
                out.append(f"hook '{hid}': bad phase '{(b or {}).get('phase')}'")
    return out


def body_agnosticism(repo: Path) -> list[str]:
    """Skill bodies are CLI-agnostic except the recorded allowlist (delegated spine / scaffolder /
    per-CLI permission file). Any OTHER SKILL.md body introducing a /opsx: or .claude/ reference is
    a new Claude-ism and fails — so the recorded cosmetic gaps cannot silently spread."""
    out: list[str] = []
    for name, path in _skill_paths(repo).items():
        if name in _BODY_AGNOSTIC_ALLOWLIST:
            continue
        if _CLI_ISM.search(path.read_text(encoding="utf-8")):
            out.append(f"{name}: SKILL.md body has a CLI-specific (/opsx: or .claude/) reference "
                       f"not in the body-agnosticism allowlist")
    return out


# ------------------------------------------- agent authoring standard (docs/development/agent-template.md)
MAX_AGENT_BODY_LINES = 40
AGENT_REQUIRED_FIELDS = ("name", "description", "type", "model", "tools", "skills")
AGENT_OPTIONAL_FIELDS = ("disallowedTools", "color", "metadata")
CLAUDE_AGENT_COLORS = {"red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"}
_AGENT_LIST_FIELDS = ("tools", "skills", "disallowedTools")
_CONTRACT_LABELS = ("Input", "Output", "Side effects", "Refuses")
_AGENT_FEATURES = "tests/features/agents"
_FENCED = re.compile(r"^```.*?^```[^\n]*$", re.MULTILINE | re.DOTALL)


def _agent_modes(repo: Path) -> set[str] | None:
    """The `agentModes` keys of tools/opencode-agent-map.json (json only, never the .mjs)."""
    try:
        modes = json.loads(_read(repo, bundle_gen.AGENT_MAP)).get("agentModes")
    except (OSError, ValueError):
        return None
    return set(modes) if isinstance(modes, dict) else None


def _agent_frontmatter_errors(rel: str, stem: str, fm: dict, modes: set[str] | None) -> list[str]:
    out = [f"{rel}: missing required frontmatter field '{k}'" for k in AGENT_REQUIRED_FIELDS if k not in fm]
    allowed = AGENT_REQUIRED_FIELDS + AGENT_OPTIONAL_FIELDS
    out += [f"{rel}: frontmatter field '{k}' is not in the agent contract (docs/development/agent-template.md)"
            for k in fm if k not in allowed]
    if "name" in fm and fm["name"] != stem:
        out.append(f"{rel}: name '{fm['name']}' does not match the filename")
    if "type" in fm and modes is not None and not (isinstance(fm["type"], str) and fm["type"] in modes):
        out.append(f"{rel}: type '{fm['type']}' is not one of {', '.join(sorted(modes))}")
    out += [f"{rel}: '{k}' must be a YAML list" for k in _AGENT_LIST_FIELDS
            if k in fm and not isinstance(fm[k], list)]
    if "color" in fm and not (isinstance(fm["color"], str) and fm["color"] in CLAUDE_AGENT_COLORS):
        out.append(f"{rel}: color '{fm['color']}' is not a Claude agent colour")
    desc = str(fm.get("description", "")).lower()
    if "description" in fm:
        if not re.search(r"\buse when\b", desc):
            out.append(f"{rel}: description must say when to use the agent ('Use when …')")
        if "<example>" in desc:
            out.append(f"{rel}: description carries <example> blocks; examples belong in "
                       f"{_AGENT_FEATURES}/{stem}.feature")
        if fm.get("type") in ("lead", "scheduled") and "not for delegation" not in desc:
            out.append(f"{rel}: a {fm['type']} agent's description must say 'Not for delegation'")
    return out


def _agent_body_errors(rel: str, body: str) -> list[str]:
    out: list[str] = []
    n = len(body.strip("\n").splitlines())
    if n > MAX_AGENT_BODY_LINES:
        out.append(f"{rel}: body is {n} lines (> {MAX_AGENT_BODY_LINES})")
    unfenced = _FENCED.sub("", body)  # a `## ` line inside a fenced block is not a heading
    m = re.search(r"^## Dispatch contract[ \t]*$(.*?)(?=^## |\Z)", unfenced, re.MULTILINE | re.DOTALL)
    if not m:
        out.append(f"{rel}: no '## Dispatch contract' section")
    else:
        found = [m.group(1).find(f"**{label}:**") for label in _CONTRACT_LABELS]
        out += [f"{rel}: dispatch contract has no '**{label}:**'"
                for label, at in zip(_CONTRACT_LABELS, found) if at < 0]
        if min(found) >= 0 and found != sorted(found):
            out.append(f"{rel}: dispatch contract labels are not in the order {', '.join(_CONTRACT_LABELS)}")
    if _CLI_ISM.search(body):
        out.append(f"{rel}: body has a CLI-specific (/opsx: or .claude/) reference")
    return out


def _agent_feature_errors(repo: Path, rel: str, stem: str, skills) -> list[str]:
    feature = f"{_AGENT_FEATURES}/{stem}.feature"
    if not (repo / feature).exists():
        return [f"{rel}: no {feature}"]
    lines = [l.strip() for l in _read(repo, feature).splitlines() if not l.strip().startswith("#")]
    out: list[str] = []
    if not any(l.startswith("Scenario Outline:") for l in lines) or not any(l.startswith("Examples:") for l in lines):
        out.append(f"{feature} has no Scenario Outline with Examples")
    start = next((i for i, l in enumerate(lines) if l.startswith("Background:")), len(lines))
    end = next((i for i, l in enumerate(lines) if i > start and l.startswith(("Scenario", "Rule:"))), len(lines))
    background = " ".join(l for l in lines[start:end] if "installed with skills" in l)
    out += [f"{feature} Background does not name skill '{s}'"
            for s in (skills if isinstance(skills, list) else []) if f"`{s}`" not in background]
    return out


def agent_conformance(repo: Path) -> list[str]:
    """Every agents/*.md conforms to docs/development/agent-template.md: closed frontmatter contract, body cap,
    dispatch contract, CLI-agnostic body, Gherkin feature file (agent-authoring-standard)."""
    agents_dir = repo / "agents"
    if not agents_dir.exists():
        return []
    modes = _agent_modes(repo)
    out = [] if modes is not None else [f"{bundle_gen.AGENT_MAP} has no 'agentModes'"]
    for p in sorted(agents_dir.glob("*.md")):
        rel = f"agents/{p.name}"
        try:
            fm, body = bundle_gen.agent_frontmatter(repo, p.stem)
        except ValueError as exc:
            if "unknown model alias" not in str(exc):  # the alias error is bundle_gates' to report
                out.append(f"{rel}: frontmatter is rejected ({exc})")
            continue
        out += _agent_frontmatter_errors(rel, p.stem, fm, modes)
        out += _agent_body_errors(rel, body)
        out += _agent_feature_errors(repo, rel, p.stem, fm.get("skills"))
    return out


def bundle_gates(repo: Path) -> list[str]:
    """Delegate to tools.bundle_gen: bundles.yaml validates, the renderings
    (marketplace.json, bundles/ links, tools/opencode-catalogue.json) match it, and versions agree."""
    return bundle_gen.gate_errors(repo)


ALL_CHECKS = (
    missing_skill_dirs, unregistered_skill_dirs, frontmatter_present_errors,
    frontmatter_errors, frontmatter_strict_yaml, frontmatter_keys, description_too_long,
    name_mismatch, expected_bundle_membership,
    agent_bundle_membership,
    broken_links, skill_too_long, orphan_agent_references,
    boundary_section_present, agent_skill_alignment, agent_conformance, groomed_spec_purpose,
    agents_canonical_invariant, hooks_inventory_shape, body_agnosticism,
    bundle_gates, facets_declared, bundle_requirements, doc_register_complete, use_case_catalogue,
    cross_skill_paths, use_case_coverage, use_case_changes_registered, dependencies_register,
    top_level_folders,
)

# The method checks (skill-crafting-method DEC-6, H-6): they hold in any catalogue repo with a
# `skills/` directory. The rest of ALL_CHECKS guards skillery's own tree and distribution.
METHOD_CHECKS = (
    frontmatter_present_errors, frontmatter_errors, frontmatter_strict_yaml, name_mismatch,
    skill_too_long, boundary_section_present, frontmatter_keys, description_too_long,
    body_agnosticism,
)


def _print_trigger_notes(repo: Path) -> None:
    for label, notes in (
        ("trigger-probe (Q4.2=B)", trigger_probe_report(repo)),
        ("ownership-tripwire (Q5.2=B)", ownership_claim_report(repo)),
        ("reciprocal-Related (DEC-12 advisory)", reciprocal_related_report(repo)),
        ("description-length (method target)", description_length_report(repo)),
        ("skill-size (specification budget)", skill_size_report(repo)),
    ):
        if notes:
            print(f"\n(assist) {len(notes)} {label} note(s) — non-blocking:")
            for n in notes:
                print(f"  ? {n}")


# -------------------------------------------------------------- entrypoint
def main(argv: list[str] | None = None) -> int:
    args = list(argv or [])
    fix = "--fix" in args
    args = [a for a in args if a != "--fix"]
    repo = Path(args[0]) if args else Path(__file__).resolve().parents[2]
    if fix:
        for f in normalize_spec_links(repo):
            print(f"fixed spec link: {f}")
    problems: list[str] = []
    for check in ALL_CHECKS:
        for p in check(repo):
            problems.append(f"{check.__name__}: {p}")
    if problems:
        print(f"FAIL — {len(problems)} problem(s):")
        for p in problems:
            print(f"  - {p}")
        candidates = duplicate_fact_candidates(repo)
        if candidates:
            print(f"\n(assist) {len(candidates)} duplicate-fact candidate(s) for manual G-DUP review:")
            for c in candidates:
                print(f"  ? {c}")
        _print_trigger_notes(repo)
        return 1
    print("OK — repository self-consistent.")
    _print_trigger_notes(repo)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
