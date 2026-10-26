#!/usr/bin/env python3
"""Turn a trigger set (`evals/triggers/<skill>.json`) into a temporary plugin
that `claude plugin eval` can run (design D-13 of restructure-and-evaluate-catalogue).

The plugin holds only the skill under test, so no other skill competes for the
query. Each query becomes one case with a single `tool_used` grader on `Skill`:
`min: 1` for a should-trigger query, `min: 0, max: 0` for a near-miss. Pass
`--description` to write a candidate description into the copy (the "after").

    python -m tools.trigger_cases skills/<skill> evals/triggers/<skill>.json <out> [--description TEXT]
    claude plugin eval <out> --trust-plugin --no-publish --ablation none --model sonnet --runs 3 \
      --max-cost-usd <approved> --json <out>/result.json
"""
import argparse
import json
import re
import shutil
from pathlib import Path

PROMPT = """---
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
---

{query}
"""

GRADER = """---
type: tool_used
tool: Skill
input_match: '"skill"\\s*:\\s*"(?:[\\w-]+:)?{skill}"'
{bounds}
---
"""


def set_description(skill_md: str, description: str) -> str:
    """Replace the frontmatter `description:` line; the value is JSON-quoted, which is valid YAML."""
    new, n = re.subn(r"(?m)^description:.*$", lambda _: "description: " + json.dumps(description),
                     skill_md, count=1)
    if n != 1:
        raise ValueError("no description line in the frontmatter")
    return new


def build(skill_dir: Path, trigger_set: Path, out: Path, description: str | None = None) -> int:
    skill = skill_dir.name
    queries = json.loads(trigger_set.read_text())
    if out.exists():
        shutil.rmtree(out)
    (out / ".claude-plugin").mkdir(parents=True)
    (out / ".claude-plugin" / "plugin.json").write_text(json.dumps({"name": "trigger-" + skill, "version": "0.0.0"}))
    shutil.copytree(skill_dir, out / "skills" / skill, symlinks=False)
    if description is not None:
        md = out / "skills" / skill / "SKILL.md"
        md.write_text(set_description(md.read_text(), description))
    for i, q in enumerate(queries, 1):
        case = out / "evals" / f"{i:02d}-{'should' if q['should_trigger'] else 'nearmiss'}"
        (case / "graders").mkdir(parents=True)
        (case / "prompt.md").write_text(PROMPT.format(query=q["query"]))
        bounds = "min: 1" if q["should_trigger"] else "min: 0\nmax: 0"
        (case / "graders" / "fired.md").write_text(GRADER.format(skill=skill, bounds=bounds))
    return len(queries)


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("skill_dir", type=Path)
    p.add_argument("trigger_set", type=Path)
    p.add_argument("out", type=Path)
    p.add_argument("--description")
    a = p.parse_args()
    print(f"{build(a.skill_dir, a.trigger_set, a.out, a.description)} cases in {a.out}")


if __name__ == "__main__":
    main()
