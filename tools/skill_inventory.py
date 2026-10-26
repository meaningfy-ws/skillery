#!/usr/bin/env python3
"""Generate the catalogue map (docs/skill-inventory.md): Mermaid diagrams plus
per-bundle and per-facet tables — not a flat database dump.

Deterministic — a pure function of `skills/*/SKILL.md` frontmatter/body,
`agents/*.md` frontmatter, `bundles.yaml` (read via `tools/bundle_gen`) and
`facets.yaml` (the one facet vocabulary, each value with its one-line
explanation). Every skill and agent declares one value per facet under its
frontmatter `metadata`; a missing or unknown value fails generation (see
`facet_gaps`) rather than silently dropping the artifact from a table.
DO NOT hand-edit the generated doc; regenerate via `python -m tools.skill_inventory`
(or `make skill-inventory`). `tests/test_skill_inventory.py` fails the build on
drift, the same codegen-freshness pattern as `tools/bundle_gen`'s gate.

The Map shows four relationships:
  - containment    (bundle -> skill/agent) one subgraph per bundle
  - classification (skill/agent -> purpose) solid line to a light card, one per
                                          `metadata.purpose` value in use
  - loads          (agent -> skill)       dotted line; the agent's own `skills:`
                                          list, first-party skills only
  - requires       (bundle -> bundle)     a separate small graph from
                                          bundles.yaml `requires:`
The Relations diagram shows skill -> skill dependency/related edges:
  - dependency     dashed thick line; mechanically parsed from each skill's own
                   "**Delegates:**" / "**This skill DELEGATES:**" text — not
                   hand-curated, not the full "Related" cross-reference graph
                   (that stays in the per-bundle tables; at 20+ cross-bundle
                   pairs alone it's a hairball at this node count, and
                   "related" is weaker than "depends on")
"""
from __future__ import annotations

import re
from pathlib import Path

import yaml

from tools.bundle_gen import gen as bundle_gen

SKILLS_DIR = "skills"
FACETS_FILE = "facets.yaml"
OUTPUT = "docs/skill-inventory.md"
USE_CASES_DIR = "use-cases"
USE_CASES_OUTPUT = "docs/use-cases.md"
DEPENDENCIES_FILE = "dependencies.yaml"
# The docs whose tables render from the register, between GENERATED:dependencies:<table> markers.
DEPENDENCY_DOCS = ("docs/environment/dual-cli/compatibility.md", "docs/environment/dual-cli/mcp-setup.md")
DEPENDENCY_KINDS = ("plugin", "skill", "cli-tool", "mcp-server", "service", "framework")
# opencode_status keyword -> how the matrix shows it; the qualifier after the keyword is kept.
DEPENDENCY_STATUSES = {"native": "native", "claude-compat": "`.claude/`-compat",
                       "unsupported": "unsupported", "unverified": "**UNVERIFIED**"}
USE_CASE_STATUSES = ("covered", "partial", "missing")
CORE_BUNDLE = "meaningfy-core"

_FRONTMATTER = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)
_RELATED = re.compile(r"\*\*Related:\*\*\s*(.+?)(?:\n\n|\Z)", re.DOTALL)
_DELEGATES = re.compile(
    r"\*\*(?:This skill )?delegates:?\*\*\s*(.+?)(?=\n\*\*|\n\n|\n##|\Z)", re.DOTALL | re.IGNORECASE
)
_BACKTICKED = re.compile(r"`([a-z0-9][a-z0-9-]*)`")

# Light-but-distinct fills so each purpose reads as a card, not a container —
# deliberately whiter/less saturated than the bundle fades below. Assigned by
# position in facets.yaml's `purpose` order, so a new value needs no code change.
_PURPOSE_FILLS = ["#fdf6e3", "#fdeef7", "#fff4ea", "#eafaf5", "#eef1fb",
                  "#f1f8e9", "#fdeef0", "#f6f5ef", "#eef7fb"]

_SKILL_FILL = "#1e1e1e"
_SKILL_TEXT = "#ffffff"
_AGENT_FILL = "#5a2d82"

# Dark, hue-paired-with-_PURPOSE_FILLS variants for the Relations diagram's
# skill boxes — same white text, but colour-coded by purpose so a dense
# relation graph is still parseable without tracing every line back to a card.
_SKILL_FILLS_BY_PURPOSE = ["#7a5c00", "#6b1f4d", "#8a4a10", "#0f5c48", "#2b3a67",
                           "#3d5c1f", "#7a2030", "#4a4a3a", "#1f4f6b"]

# Pastel, distinct-enough fills for a fade/contained look — one per bundle, in
# bundles.yaml's own order.
_BUNDLE_FILLS = ["#eaf3ff", "#fff2e0", "#eafaf0", "#f5eaff"]

# Tighter than Mermaid's defaults (nodeSpacing 50 / rankSpacing 50) — the
# skill lists read as a compact index, not a spread-out chart.
_INIT_DIRECTIVE = "%%{init: {'flowchart': {'nodeSpacing': 12, 'rankSpacing': 45, 'curve': 'basis'}}}%%"


def _skill_dirs(repo: Path) -> dict[str, Path]:
    root = repo / SKILLS_DIR
    return {
        p.name: p / "SKILL.md"
        for p in sorted(root.iterdir())
        if p.is_dir() and (p / "SKILL.md").exists()
    }


def _frontmatter(text: str) -> dict:
    """Parse the YAML frontmatter tolerantly — some descriptions contain
    unquoted colons that trip a strict YAML parser (the platform's own loader
    is lenient), so fall back to a line-by-line `key: value` read. Mirrors
    `tools/repo_lint/lint.py`'s `_frontmatter` (kept independent rather than
    imported — a few lines, not worth coupling two separately-evolving tools)."""
    m = _FRONTMATTER.match(text)
    if not m:
        return {}
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


def _first_sentence(description: str) -> str:
    """Trim a dense, trigger-packed frontmatter description to its first
    sentence — the full text is duplicated triggers/keywords, not prose meant
    to read as a table cell."""
    description = " ".join(description.split())
    m = re.search(r"^(.*?[.!?])(\s|$)", description)
    return m.group(1) if m else description


def _related(body: str) -> list[str]:
    m = _RELATED.search(body)
    if not m:
        return []
    return _BACKTICKED.findall(m.group(1))


def _depends_on(body: str, all_names: set[str], self_name: str) -> list[str]:
    """Skills this one explicitly DELEGATES to (a stronger, narrower claim than
    "Related") — parsed from its own text, filtered to first-party skills."""
    m = _DELEGATES.search(body)
    if not m:
        return []
    found = dict.fromkeys(_BACKTICKED.findall(m.group(1)))  # dedupe, keep order
    return [n for n in found if n in all_names and n != self_name]


def _metadata(fm: dict) -> dict:
    meta = fm.get("metadata")
    return meta if isinstance(meta, dict) else {}


def load_facets(repo: Path) -> dict[str, dict[str, str]]:
    """facets.yaml as {facet: {value: one-line explanation}}, in file order."""
    return yaml.safe_load((repo / FACETS_FILE).read_text(encoding="utf-8"))["facets"]


def _bundles(repo: Path) -> list[dict]:
    """Bundles in bundles.yaml's own order, each with its blurb, skill and agent
    lists and its explicit requirements (core is implicit, never listed)."""
    return [{"name": b["name"], "description": b["description"], "skills": b["skills"],
             "agents": b["agents"], "requires": b.get("requires", [])}
            for b in bundle_gen.load(repo)["bundles"]]


def collect(repo: Path) -> tuple[list[dict], dict[str, dict]]:
    """Returns (bundles, skills_by_name) — skills_by_name carries
    summary/related/depends_on/facets."""
    bundles = _bundles(repo)
    paths = _skill_dirs(repo)
    all_names = set(paths)
    skills: dict[str, dict] = {}
    for name, path in paths.items():
        text = path.read_text(encoding="utf-8")
        fm = _frontmatter(text)
        skills[name] = {
            "summary": _first_sentence(fm.get("description", "")),
            "related": _related(text),
            "depends_on": _depends_on(text, all_names, name),
            "facets": _metadata(fm),
        }
    return bundles, skills


def collect_agents(repo: Path, bundles: list[dict], skills: dict[str, dict]) -> dict[str, dict]:
    """Agents in bundle order, each with its summary, facets and the skills it
    loads (`loads` = first-party only, the Map's edges; `skills` = the full list)."""
    agents: dict[str, dict] = {}
    for b in bundles:
        for name in b["agents"]:
            fm = bundle_gen.agent_frontmatter(repo, name)[0]
            listed = fm.get("skills") or []
            agents[name] = {
                "summary": _first_sentence(str(fm.get("description", ""))),
                "skills": listed,
                "loads": [s for s in listed if s in skills],
                "facets": _metadata(fm),
            }
    return agents


def facet_gaps(bundles: list[dict], skills: dict[str, dict], agents: dict[str, dict],
               facets: dict[str, dict[str, str]]) -> list[str]:
    """Every listed skill and agent must declare every facet with a value from
    facets.yaml — fails generation instead of silently leaving a table row out."""
    named = [(n, skills.get(n)) for b in bundles for n in b["skills"] if n in skills]
    named += list(agents.items())
    gaps = []
    for name, data in named:
        for facet, values in facets.items():
            value = data["facets"].get(facet)
            if value is None:
                gaps.append(f"{name}: missing metadata.{facet}")
            elif value not in values:
                gaps.append(f"{name}: metadata.{facet} '{value}' is not in {FACETS_FILE}")
    return sorted(gaps)


def _node_id(name: str) -> str:
    return "s_" + name.replace("-", "_")


def _agent_id(name: str) -> str:
    return "a_" + name.replace("-", "_")


def _bundle_id(name: str) -> str:
    return "b_" + name.replace("-", "_")


def _purpose_id(purpose: str) -> str:
    return "p_" + re.sub(r"[^a-z0-9]+", "_", purpose.lower()).strip("_")


def _purpose_index(purpose: str, facets: dict[str, dict[str, str]]) -> int:
    order = list(facets["purpose"])
    return order.index(purpose) if purpose in order else -1


def render_map(bundles: list[dict], skills: dict[str, dict], agents: dict[str, dict],
               facets: dict[str, dict[str, str]]) -> str:
    """Containment + classification + agent loads — kept apart from the
    skill<->skill relations, which live in their own diagram."""
    lines = ["```mermaid", _INIT_DIRECTIVE, "flowchart LR"]
    for b in bundles:
        lines.append(f'  subgraph {_bundle_id(b["name"])}["{b["name"]}"]')
        for name in b["skills"]:
            if name in skills:  # external skills (e.g. superpowers) aren't first-party rows
                lines.append(f'    {_node_id(name)}["{name}"]')
        for name in b["agents"]:
            lines.append(f'    {_agent_id(name)}{{{{"{name}"}}}}')
        lines.append("  end")
    lines.append("")
    members = {**skills, **agents}
    used = {d["facets"].get("purpose") for d in members.values()}
    purposes = [p for p in facets["purpose"] if p in used]
    for purpose in purposes:
        lines.append(f'  {_purpose_id(purpose)}("{purpose}<br/><sub>{facets["purpose"][purpose]}</sub>")')
    lines.append("")
    for name, data in skills.items():
        lines.append(f"  {_node_id(name)} --> {_purpose_id(data['facets']['purpose'])}")
    for name, data in agents.items():
        lines.append(f"  {_agent_id(name)} --> {_purpose_id(data['facets']['purpose'])}")
    lines.append("")
    for name, data in agents.items():
        for target in data["loads"]:
            lines.append(f"  {_agent_id(name)} -.-> {_node_id(target)}")
    lines.append("")
    for i, b in enumerate(bundles):
        lines.append(f"  style {_bundle_id(b['name'])} fill:{_BUNDLE_FILLS[i % len(_BUNDLE_FILLS)]},stroke:#999,stroke-width:1px")
    for purpose in purposes:
        fill = _PURPOSE_FILLS[_purpose_index(purpose, facets) % len(_PURPOSE_FILLS)]
        lines.append(f"  style {_purpose_id(purpose)} fill:{fill},color:#000000,stroke:#333,stroke-width:1.5px")
    for name in skills:
        lines.append(f"  style {_node_id(name)} fill:{_SKILL_FILL},color:{_SKILL_TEXT},stroke:#000")
    for name in agents:
        lines.append(f"  style {_agent_id(name)} fill:{_AGENT_FILL},color:{_SKILL_TEXT},stroke:#000")
    lines.append("```")
    return "\n".join(lines)


def render_requirements(bundles: list[dict]) -> str:
    """bundle -> required bundle, from bundles.yaml `requires:` (core implicit)."""
    lines = ["```mermaid", "flowchart LR"]
    for b in bundles:
        lines.append(f'  {_bundle_id(b["name"])}["{b["name"]}"]')
    for b in bundles:
        for target in b["requires"]:
            lines.append(f"  {_bundle_id(b['name'])} --> {_bundle_id(target)}")
    lines.append("```")
    return "\n".join(lines)


def _related_only(name: str, data: dict, skills: dict[str, dict]) -> list[str]:
    """Related-but-not-a-hard-dependency targets: the weaker relation, first-
    party only (filters out external names like `stream-coding`/`superpowers`,
    which have no node in this diagram)."""
    return [t for t in data["related"] if t in skills and t != name and t not in data["depends_on"]]


def render_relations(bundles: list[dict], skills: dict[str, dict],
                     facets: dict[str, dict[str, str]]) -> str:
    """Both skill<->skill relations in one diagram, grouped by bundle (same
    containers/colours as the Map) and skill boxes colour-coded by purpose
    — a plain uniform-dark box graph at ~90 edges was unreadable;
    grouping + colour-coding was the fix, confirmed by rendering both ways.
    Two distinct line styles: a **thick solid** arrow is *depends on*
    (stronger — mechanically parsed from "Delegates" text); a **thin dashed**
    arrow is *related* (weaker — everything else in the "Related" list)."""
    lines = ["```mermaid", _INIT_DIRECTIVE, "flowchart LR"]
    for b in bundles:
        lines.append(f'  subgraph {_bundle_id(b["name"])}["{b["name"]}"]')
        for name in b["skills"]:
            if name in skills:
                lines.append(f'    {_node_id(name)}["{name}"]')
        lines.append("  end")
    lines.append("")
    for name, data in skills.items():
        for target in data["depends_on"]:
            lines.append(f"  {_node_id(name)} ==> {_node_id(target)}")
    lines.append("")
    for name, data in skills.items():
        for target in _related_only(name, data, skills):
            lines.append(f"  {_node_id(name)} -.-> {_node_id(target)}")
    lines.append("")
    for i, b in enumerate(bundles):
        lines.append(f"  style {_bundle_id(b['name'])} fill:{_BUNDLE_FILLS[i % len(_BUNDLE_FILLS)]},stroke:#999,stroke-width:1px")
    for name, data in skills.items():
        index = _purpose_index(data["facets"].get("purpose"), facets)
        fill = _SKILL_FILLS_BY_PURPOSE[index % len(_SKILL_FILLS_BY_PURPOSE)] if index >= 0 else _SKILL_FILL
        lines.append(f"  style {_node_id(name)} fill:{fill},color:#ffffff,stroke:#000")
    lines.append("```")
    return "\n".join(lines)


def _codes(names: list[str]) -> str:
    return ", ".join(f"`{x}`" for x in names) if names else "—"


def render_by_facet(bundles: list[dict], skills: dict[str, dict], agents: dict[str, dict],
                    facets: dict[str, dict[str, str]]) -> list[str]:
    """One table per facet: value (with its facets.yaml line) -> skills and agents."""
    members = [n for b in bundles for n in b["skills"] if n in skills] + list(agents)
    out = ["## By facet", "",
           f"One table per facet in [`{FACETS_FILE}`](../{FACETS_FILE}): each value, its one-line "
           "explanation, and the skills and agents (*agent* marked) that declare it.", ""]
    for facet, values in facets.items():
        out += [f"### {facet}", "", "| Value | Meaning | Skills and agents |", "|---|---|---|"]
        for value, meaning in values.items():
            names = [f"`{n}` *(agent)*" if n in agents else f"`{n}`" for n in members
                     if (agents.get(n) or skills[n])["facets"].get(facet) == value]
            out.append(f"| `{value}` | {meaning} | {', '.join(names) if names else '—'} |")
        out.append("")
    return out


def render(bundles: list[dict], skills: dict[str, dict], agents: dict[str, dict],
           facets: dict[str, dict[str, str]]) -> str:
    total = sum(len([s for s in b["skills"] if s in skills]) for b in bundles)
    dependency_count = sum(len(s["depends_on"]) for s in skills.values())
    related_count = sum(len(_related_only(n, d, skills)) for n, d in skills.items())
    facet_names = list(facets)
    header = [
        "# Catalogue map",
        "",
        "<!-- GENERATED by `python -m tools.skill_inventory` (or `make skill-inventory`) —",
        "     DO NOT hand-edit. Source: each skill's SKILL.md frontmatter/body, each",
        "     agent's frontmatter (agents/*.md), bundles.yaml and facets.yaml.",
        "     tests/test_skill_inventory.py fails the build if this drifts. -->",
        "",
        f"{total} skills and {len(agents)} agents across {len(bundles)} bundles (role bundles plus the "
        "`vault-assistant` workflow bundle). Install `meaningfy-core` plus the bundle(s) matching your "
        "role, and the bundles they require — see [Bundle requirements](#bundle-requirements) and the root "
        "[`README.md`](../README.md).",
        "",
        "## Map",
        "",
        "**Containers** are bundles. **Dark rectangles** are skills; **purple hexagons** are agents. "
        "**Light rounded cards** are the `purpose` values in use (from "
        f"[`{FACETS_FILE}`](../{FACETS_FILE})), cutting across bundles — each with its one-line "
        "explanation. A solid line is *classified as* (skill or agent → purpose); a dotted line is "
        "*loads* (agent → a first-party skill in its `skills:` list).",
        "",
        render_map(bundles, skills, agents, facets),
        "",
        "## Bundle requirements",
        "",
        "An arrow is *requires* (bundle → bundle it needs installed too), from `requires:` in "
        f"[`bundles.yaml`](../bundles.yaml). Every bundle implicitly requires `{CORE_BUNDLE}`, which is "
        "never drawn.",
        "",
        render_requirements(bundles),
        "",
        "## Relations",
        "",
        "Same bundle containers as the Map, but skill boxes are now colour-coded by **purpose** "
        "(one dark shade per value) instead of uniform dark — at this many "
        "edges, colour is what makes the grouping legible without tracing every line. Two line "
        f"types, not one: a **thick solid** arrow is *depends on* ({dependency_count} edges, "
        'mechanically parsed from each skill\'s own "Delegates" text — a skill explicitly handing '
        f"something off to another); a **thin dashed** arrow is *related* ({related_count} edges, "
        'everything else in the "Related" list — weaker, a "see also" rather than a hand-off). '
        f"Kept separate from the Map's classification edges — {dependency_count + related_count} "
        f"relation edges plus {len(skills)} classification edges in one diagram was tried and was a "
        "long-crossing-line mess, confirmed by actually rendering it.",
        "",
        render_relations(bundles, skills, facets),
        "",
    ]
    body = []
    for b in bundles:
        body.append(f"## {b['name']}")
        body.append("")
        body.append(b["description"] + ".")
        body.append("")
        body.append("| Skill / agent | Summary | " + " | ".join(facet_names) + " | Depends on / loads | Related |")
        body.append("|---|---|" + "---|" * len(facet_names) + "---|---|")
        for name in b["skills"]:
            data = skills.get(name)
            if data is None:  # external (e.g. superpowers) — no first-party SKILL.md to describe
                continue
            cells = " | ".join(f"`{data['facets'].get(f, '—')}`" for f in facet_names)
            body.append(
                f"| [`{name}`](../skills/{name}/SKILL.md) | {data['summary']} | {cells} | "
                f"{_codes(data['depends_on'])} | {_codes(data['related'])} |"
            )
        for name in b["agents"]:
            data = agents[name]
            cells = " | ".join(f"`{data['facets'].get(f, '—')}`" for f in facet_names)
            body.append(
                f"| [`{name}`](../agents/{name}.md) *(agent)* | {data['summary']} | {cells} | "
                f"{_codes(data['skills'])} | — |"
            )
        body.append("")
    return "\n".join(header + body + render_by_facet(bundles, skills, agents, facets))


def render_unreleased(wip_skills: dict[str, dict], wip_agents: list[str]) -> str:
    """Skills and agents listed in no bundle: work in progress, never published
    (rebundle-by-activity D-14). Empty when there are none."""
    if not wip_skills and not wip_agents:
        return ""
    rows = [f"| `{n}` | skill | {d['summary']} |" for n, d in sorted(wip_skills.items())]
    rows += [f"| `{n}` | agent | |" for n in sorted(wip_agents)]
    return "\n".join(["## Unreleased (WIP)", "",
                      "Listed in no bundle: on `develop` only, never in a release or an install.", "",
                      "| Name | Kind | Summary |", "|---|---|---|", *rows, ""])


def generate(repo: Path) -> str:
    bundles, all_skills = collect(repo)
    bundled = {s for b in bundles for s in b["skills"]}
    skills = {n: d for n, d in all_skills.items() if n in bundled}
    agents = collect_agents(repo, bundles, skills)
    facets = load_facets(repo)
    gaps = facet_gaps(bundles, skills, agents, facets)
    if gaps:
        raise ValueError(f"facet gaps (see {FACETS_FILE}): {gaps}")
    wip_agents = sorted(p.stem for p in (repo / "agents").glob("*.md") if p.stem not in agents) \
        if (repo / "agents").exists() else []
    wip = render_unreleased({n: d for n, d in all_skills.items() if n not in bundled}, wip_agents)
    out = render(bundles, skills, agents, facets)
    return out + ("\n" + wip if wip else "")


_CONFIDENCE = re.compile(r"\*\*Confidence:\*\*\s*([^\n]+)")
_LEVELS = ("high", "medium", "low")


def _open_points(text: str) -> tuple[str, str]:
    """(the confidence levels named on the Open Points' Confidence line, in order, joined by " / ";
    the first open question) — docs/development/use-case-template.md."""
    section = text.split("## Open Points", 1)[1] if "## Open Points" in text else ""
    m = _CONFIDENCE.search(section)
    if not m:
        return "—", ""
    levels = list(dict.fromkeys(w for w in re.findall(r"[a-z]+", m.group(1).lower()) if w in _LEVELS))
    q = re.search(r"^- (.+(?:\n[ \t]+\S.*)*)", section[m.end():], re.MULTILINE)  # with wrapped lines
    return " / ".join(levels) or "—", " ".join(q.group(1).split()) if q else ""


def collect_use_cases(repo: Path) -> list[dict]:
    """Each use-cases/*.md frontmatter, plus its file name, confidence and first open question,
    ordered by UC-W number."""
    root = repo / USE_CASES_DIR
    ucs = []
    for p in (root.glob("*.md") if root.exists() else []):
        text = p.read_text(encoding="utf-8")
        confidence, question = _open_points(text)
        ucs.append({**_frontmatter(text), "file": p.name, "confidence": confidence, "question": question})
    return sorted(ucs, key=lambda u: int(re.sub(r"\D", "", str(u.get("id"))) or 0))


def render_use_cases(ucs: list[dict], facets: dict[str, dict[str, str]]) -> str:
    """The gap map: a count per area and status, then one table per area in facets.yaml order."""
    areas = [a for a in facets.get("area", {}) if any(u.get("area") == a for u in ucs)]
    out = [
        "# Use cases",
        "",
        "<!-- GENERATED by `python -m tools.skill_inventory` (or `make skill-inventory`) —",
        f"     DO NOT hand-edit. Source: {USE_CASES_DIR}/*.md frontmatter and facets.yaml.",
        "     tests/test_skill_inventory.py fails the build if this drifts. -->",
        "",
        f"{len(ucs)} White use cases in [`{USE_CASES_DIR}/`](../{USE_CASES_DIR}/), one file each. "
        "**Status** is `covered` when the agents and skills that serve it do the whole job, "
        "`partial` when they do part of it or a drafted change holds its materials, `missing` when "
        "nothing in the catalogue serves it. **Change** is the follow-on change that closes it.",
        "",
        "## Gap map",
        "",
        "| Area | " + " | ".join(USE_CASE_STATUSES) + " |",
        "|---|" + "---|" * len(USE_CASE_STATUSES),
    ]
    for a in areas:
        counts = [sum(1 for u in ucs if u.get("area") == a and u.get("status") == st)
                  for st in USE_CASE_STATUSES]
        out.append(f"| `{a}` | " + " | ".join(map(str, counts)) + " |")
    out.append("")
    for a in areas:
        out += [f"## {a}", "", facets["area"][a][:1].upper() + facets["area"][a][1:] + ".", "",
                "| Use case | Primary actor | Status | Served by | Change | Confidence |",
                "|---|---|---|---|---|---|"]
        for u in (u for u in ucs if u.get("area") == a):
            served = u.get("served_by") or {}
            names = [f"`{n}` *(agent)*" for n in served.get("agents") or []]
            names += [f"`{n}`" for n in served.get("skills") or []]
            change = f"`{u['change']}`" if u.get("change") else "—"
            out.append(f"| [{u['id']}](../{USE_CASES_DIR}/{u['file']}) {u['title']} | "
                       f"{u.get('primary_actor', '—')} | `{u.get('status')}` | "
                       f"{', '.join(names) or '—'} | {change} | {u.get('confidence', '—')} |")
        out.append("")
    out += ["## What needs the owner", "",
            "How sure each use case's text is (its Open Points) and the first question only the owner "
            "can answer. **high**: restates decisions taken; **medium**: extrapolated from the brief and "
            "the catalogue; **low**: a first guess to extend.", "",
            "| Use case | Confidence | First open question |", "|---|---|---|"]
    out += [f"| [{u['id']}](../{USE_CASES_DIR}/{u['file']}) | {u.get('confidence', '—')} | "
            f"{u.get('question') or '—'} |" for u in ucs]
    out.append("")
    return "\n".join(out)


def generate_use_cases(repo: Path) -> str:
    return render_use_cases(collect_use_cases(repo), load_facets(repo))


_DEP_TABLES = {
    "plugins": (lambda d: d["kind"] != "mcp-server",
                ("Dependency", "Used by", "opencode status", "Claude install", "opencode install / gap"),
                ("used_by", "opencode_status", "claude_install", "opencode_install")),
    "mcp": (lambda d: d["kind"] == "mcp-server",
            ("MCP server", "Transport", "opencode status", "Notes"),
            ("transport", "opencode_status", "notes")),
    "mcp-setup": (lambda d: d["kind"] == "mcp-server" and "why" in d,
                  ("Server", "Why", "Local package or hosted?"), ("why", "hosting")),
}
_DEP_BLOCK = re.compile(r"(<!-- GENERATED:dependencies:([a-z-]+) -->\n).*?(<!-- /GENERATED -->)", re.DOTALL)


def _dep_status(status: str) -> str:
    key, _, rest = status.partition(" ")
    return DEPENDENCY_STATUSES.get(key, key) + (f" {rest}" if rest else "")


def render_dependencies(entries: list[dict], table: str) -> str:
    """One table of the external dependency register (rebundle-by-activity D-7); cells hold the
    register's Markdown as written, only the name is made bold."""
    keep, heads, fields = _DEP_TABLES[table]
    lines = ["| " + " | ".join(heads) + " |", "|" + "---|" * len(heads)]
    for d in filter(keep, entries):
        name = f"**{d['name']}**" + (f" ({d['summary']})" if d.get("summary") else "")
        cells = [_dep_status(d[f]) if f == "opencode_status" else str(d.get(f, "")) for f in fields]
        lines.append("| " + " | ".join([name] + cells) + " |")
    return "\n".join(lines) + "\n"


def splice_dependencies(text: str, entries: list[dict]) -> str:
    return _DEP_BLOCK.sub(lambda m: m.group(1) + render_dependencies(entries, m.group(2)) + m.group(3), text)


def drift_errors(repo: Path) -> list[str]:
    out = []
    for rel, expected in _outputs(repo):
        actual_path = repo / rel
        if not actual_path.exists():
            out.append(f"missing generated file: {rel}")
        elif actual_path.read_text(encoding="utf-8") != expected:
            out.append(f"{rel} is stale — regenerate with `make skill-inventory`")
    return out


def _outputs(repo: Path) -> list[tuple[str, str]]:
    outs = [(OUTPUT, generate(repo))]
    if (repo / USE_CASES_DIR).exists():
        outs.append((USE_CASES_OUTPUT, generate_use_cases(repo)))
    if (repo / DEPENDENCIES_FILE).exists():
        entries = yaml.safe_load((repo / DEPENDENCIES_FILE).read_text(encoding="utf-8")) or []
        outs += [(rel, splice_dependencies((repo / rel).read_text(encoding="utf-8"), entries))
                 for rel in DEPENDENCY_DOCS if (repo / rel).exists()]
    return outs


def main() -> None:
    repo = Path(__file__).resolve().parents[1]
    for rel, text in _outputs(repo):
        (repo / rel).write_text(text, encoding="utf-8")
        print(f"wrote {rel}")


if __name__ == "__main__":
    main()
