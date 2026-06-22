"""Repository self-consistency guardrail.

The repo embodies its own cosmic-python thesis: a thin read layer (parse
marketplace + skill files) feeds pure check functions; ``main`` is the
entrypoint. Each public ``*_errors``/``*_gaps``/``*_mismatch`` function returns
a list of human-readable problems ([] == clean) so checks compose and test
trivially.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import yaml

SKILLS_DIR = "skills"
MARKETPLACE = ".claude-plugin/marketplace.json"
README = "README.md"
# Hard ceiling that flags genuinely bloated files; ~500 stays the soft target
# in CONTRIBUTING. The established `architecture` skill is ~618 lines and fine.
MAX_SKILL_LINES = 650

# The ROLE bundle map (single source of truth for bundle composition).
# Bundles are organised by the role/persona you install (a small `core` holds the
# cross-cutting skills so every skill lives in exactly ONE bundle — no overlays).
# Disk is flat (`skills/<skill>/`); bundles group only in marketplace.json.
EXPECTED_BUNDLES = {
    "meaningfy-core": {"technical-writing", "meaningfy-git-workflow", "guardrails"},
    "meaningfy-consulting": {
        "semantic-consulting-coach", "decision-package", "proposal-writing",
        "estimation", "executive-communication",
    },
    "meaningfy-architecture": {"architecture", "conceptual-modelling"},
    "meaningfy-building": {
        "epic-planning", "spec-stewardship", "clarity-gate", "bdd-gherkin",
        "meaningfy-code-review", "cosmic-python", "project-setup", "ci-cd-delivery",
        "meaningfy-release",
    },
}
ALL_AGENT_NAMES = {"implementer", "code-reviewer", "epic-planner", "gherkin-writer", "documenter"}
# Non-namespaced skills that legitimately live in OTHER plugins (so an agent may load them
# without a local skills/<name>/ dir). Namespaced skills (e.g. `superpowers:tdd`) are external by form.
EXTERNAL_SKILLS = {"stream-coding"}
# Files/dirs whose content must never be edited (frozen) — excluded from prose checks.
FROZEN_GLOBS = ("docs/ai-coding/",)

_FRONTMATTER = re.compile(r"^---\n(.*?)\n---", re.DOTALL)
_MD_LINK = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
# A line that points to the owner rather than restating it — used by the ownership
# tripwire to skip legitimate delegation/pointers (not re-specifications).
_DELEGATES = re.compile(r"→\s*follow|\bfollow\b|\bsee\b|\bowned by\b|\bdelegate|\bdefer|\bvia\b|\bper\b\s+`?\w", re.IGNORECASE)
# `.claude/` is agent/tool working-state — planning docs (EPIC/PLAN/RESEARCH) and
# tool-installed skills (e.g. GitNexus's own) — not the published catalogue, so prose
# checks skip it. (`.claude-plugin/` is a distinct part and is NOT skipped.)
_SKIP_DIRS = {".git", ".venv", "node_modules", ".idea", "__pycache__", ".claude"}


# ---------------------------------------------------------------- read layer
def _read(repo: Path, rel: str) -> str:
    return (repo / rel).read_text(encoding="utf-8")


def _marketplace(repo: Path) -> dict:
    return json.loads(_read(repo, MARKETPLACE))


def _marketplace_skills(repo: Path) -> list[str]:
    out: list[str] = []
    for plugin in _marketplace(repo).get("plugins", []):
        for s in plugin.get("skills", []):
            out.append(s.replace("./skills/", "").strip("/").split("/")[-1])
    return out


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
    dirs = set(_skill_dirs(repo))
    return [f"marketplace lists '{s}' but skills/{s}/SKILL.md is missing"
            for s in _marketplace_skills(repo) if s not in dirs]


def unregistered_skill_dirs(repo: Path) -> list[str]:
    registered = set(_marketplace_skills(repo))
    return [f"skills/{s} exists but is not registered in the marketplace"
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


def name_mismatch(repo: Path) -> list[str]:
    out: list[str] = []
    for name in _skill_dirs(repo):
        fm = _frontmatter(_skill_md(repo, name))
        if fm is None:
            continue  # reported by frontmatter_present_errors
        if fm.get("name") != name:
            out.append(f"{name}: frontmatter name '{fm.get('name')}' != dir '{name}'")
    return out


def expected_bundle_membership(repo: Path) -> list[str]:
    """Placement check: every registered skill sits in its expected bundle, and
    no unknown bundle names appear. Incremental-safe — does not require all
    expected skills to exist yet."""
    reverse = {s: b for b, skills in EXPECTED_BUNDLES.items() for s in skills}
    out: list[str] = []
    for plugin in _marketplace(repo).get("plugins", []):
        bundle = plugin.get("name")
        if bundle not in EXPECTED_BUNDLES:
            out.append(f"unknown bundle '{bundle}' (not in EXPECTED_BUNDLES)")
            continue
        for raw in plugin.get("skills", []):
            skill = raw.replace("./skills/", "").strip("/").split("/")[-1]
            want = reverse.get(skill)
            if want is None:
                out.append(f"skill '{skill}' is not in EXPECTED_BUNDLES")
            elif want != bundle:
                out.append(f"skill '{skill}' in '{bundle}', expected '{want}'")
    return out


# Authoring/illustrative docs whose "links" are placeholder examples, not
# navigation: the skill template, the authoring guides, and skill reference
# files. Navigational docs (README, docs/, SKILL.md, plan files) are still
# checked — that is where a moved file leaves a real dangling link.
def _is_illustrative(rel_parts: tuple[str, ...]) -> bool:
    return rel_parts[0] in ("template", "spec") or "references" in rel_parts


def broken_links(repo: Path) -> list[str]:
    out: list[str] = []
    for md in _iter_text_files(repo):
        if _is_illustrative(md.relative_to(repo).parts):
            continue
        for target in _MD_LINK.findall(md.read_text(encoding="utf-8")):
            if target.startswith(("http://", "https://", "#", "mailto:")):
                continue
            rel = target.split("#")[0]
            if not rel:
                continue
            if not (md.parent / rel).exists():
                out.append(f"{md.relative_to(repo)} -> {target}")
    return out


def skill_too_long(repo: Path, limit: int = MAX_SKILL_LINES) -> list[str]:
    out: list[str] = []
    for name in _skill_dirs(repo):
        n = len(_skill_md(repo, name).splitlines())
        if n > limit:
            out.append(f"{name}: SKILL.md is {n} lines (> {limit})")
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
            # frozen docs predate the change; EPIC + the migration note name agents on purpose
            if _is_frozen(repo, f) or f.name.startswith("EPIC-setup") or f.name == "environment-setup.md":
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


def readme_inventory_gaps(repo: Path) -> list[str]:
    readme = _read(repo, README)
    out: list[str] = []
    for name in _skill_dirs(repo):
        if not re.search(rf"(^|[^\w-]){re.escape(name)}([^\w-]|$)", readme):
            out.append(f"README does not list skill '{name}'")
    return out


def templates_mirrored(repo: Path) -> list[str]:
    claude = repo / "prompts/CLAUDE.md.template"
    agents = repo / "prompts/AGENTS.md.template"
    if not (claude.exists() and agents.exists()):
        return []  # WS4 concern; skip until both exist
    skills = set(_skill_dirs(repo)) | {s for b in EXPECTED_BUNDLES.values() for s in b}

    def named(text: str) -> set[str]:
        return {s for s in skills if s in text}
    cset, aset = named(claude.read_text()), named(agents.read_text())
    if cset != aset:
        return [f"CLAUDE/AGENTS template skill sets differ: {cset ^ aset}"]
    return []


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


ALL_CHECKS = (
    missing_skill_dirs, unregistered_skill_dirs, frontmatter_present_errors,
    frontmatter_errors, name_mismatch, expected_bundle_membership,
    broken_links, skill_too_long, orphan_agent_references,
    boundary_section_present, agent_skill_alignment,
)


def _print_trigger_notes(repo: Path) -> None:
    for label, notes in (
        ("trigger-probe (Q4.2=B)", trigger_probe_report(repo)),
        ("ownership-tripwire (Q5.2=B)", ownership_claim_report(repo)),
        ("reciprocal-Related (DEC-12 advisory)", reciprocal_related_report(repo)),
    ):
        if notes:
            print(f"\n(assist) {len(notes)} {label} note(s) — non-blocking:")
            for n in notes:
                print(f"  ? {n}")


# -------------------------------------------------------------- entrypoint
def main(argv: list[str] | None = None) -> int:
    repo = Path(argv[0]) if argv else Path(__file__).resolve().parents[2]
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
