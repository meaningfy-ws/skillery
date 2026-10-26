"""The trigger-set converter (tools/trigger_cases.py) builds one case per query with the right bounds."""
import json
from pathlib import Path

import yaml

from tools.trigger_cases import build

ROOT = Path(__file__).resolve().parents[1]


def test_build_cases_and_candidate_description(tmp_path):
    skill = ROOT / "skills" / "executive-communication"
    triggers = ROOT / "evals" / "triggers" / "executive-communication.json"
    out = tmp_path / "plugin"
    n = build(skill, triggers, out, description='Use when: "quoted" text')

    assert n == len(json.loads(triggers.read_text()))
    cases = sorted((out / "evals").iterdir())
    assert len(cases) == n
    for case in cases:
        grader = (case / "graders" / "fired.md").read_text()
        front = yaml.safe_load(grader.split("---")[1])
        if case.name.endswith("should"):
            assert front["min"] == 1 and "max" not in front
        else:
            assert front["min"] == 0 and front["max"] == 0
        assert front["tool"] == "Skill" and "executive-communication" in front["input_match"]
    md = (out / "skills" / "executive-communication" / "SKILL.md").read_text()
    assert yaml.safe_load(md.split("---")[1])["description"] == 'Use when: "quoted" text'
