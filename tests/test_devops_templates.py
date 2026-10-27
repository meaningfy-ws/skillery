"""The devops skills' standard templates are usable as they ship (TC-06, D-16).

The stack template passes the stack conformance check; every YAML template parses. Placeholders are
written `<like-this>`; the privacy test (test_devops_privacy.py) also scans these files.
"""
import importlib.util
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parents[1]
SKILLS = ("infrastructure-operations", "stack-operations", "service-reliability", "infrastructure-security")
TEMPLATES = [ROOT / "skills" / s / "assets/templates" for s in SKILLS]
STACK = ROOT / "skills/stack-operations/assets/templates/stack/compose.yml"
YAML_FILES = sorted(p for t in TEMPLATES for p in t.rglob("*") if p.suffix in (".yml", ".yaml"))

_spec = importlib.util.spec_from_file_location("check_stack", ROOT / "skills/stack-operations/scripts/check_stack.py")
check_stack = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(check_stack)


def test_every_skill_ships_templates():
    for t in TEMPLATES:
        assert t.is_dir() and any(t.iterdir()), f"{t.relative_to(ROOT)} missing or empty"


def test_stack_template_passes_the_check():
    rows = check_stack.check_file(STACK)
    assert rows and all(r.status == "met" for r in rows), [(r.service, r.rule, r.status, r.detail) for r in rows if r.status != "met"]


@pytest.mark.parametrize("path", YAML_FILES, ids=lambda p: str(p.relative_to(ROOT)))
def test_yaml_template_parses(path):
    list(yaml.safe_load_all(path.read_text(encoding="utf-8")))
