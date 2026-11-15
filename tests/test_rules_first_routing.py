"""The rules-first mod's deny message carries the marker `rules.py stats` counts (D-4); the routing text has one home (D-1, D-2)."""
import importlib.util
import sys
import textwrap
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]

spec = importlib.util.spec_from_file_location("rules", ROOT / "skills/rulebook/scripts/rules.py")
rules = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = rules  # dataclasses look the module up
spec.loader.exec_module(rules)

ROUTING = (ROOT / "skills/rulebook/assets/routing.md").read_text(encoding="utf-8").splitlines()[2]
BINDINGS = ["docs/environment/global-prompt.md", "skills/project-setup/assets/templates/agentic/AGENTS.md.tmpl", "AGENTS.md"]


def test_mod_source_contains_deny_marker():
    source = (ROOT / "mods/rules-first/rules-first.mjs").read_text()
    assert rules.DENY_MARKER in source


@pytest.mark.parametrize("name", BINDINGS)
def test_binding_carries_routing_sentence(name):
    text = rules.normalise((ROOT / name).read_text(encoding="utf-8"))
    assert rules.normalise(ROUTING) in text, f"{name} lacks the routing sentence of routing.md line 3"


def test_pointer_carries_routing_sentence():
    assert rules.normalise(ROUTING) in rules.normalise(rules.POINTER), "rules.POINTER lacks the routing sentence"


def test_wrapped_copy_with_curly_apostrophe_matches():
    copy = "\n  ".join(textwrap.wrap(ROUTING.replace("'", "’"), 100))
    assert "\n" in copy and "’" in copy
    assert rules.normalise(ROUTING) in rules.normalise(copy)
