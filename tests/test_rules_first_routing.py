"""The rules-first mod's deny message carries the marker `rules.py stats` counts (D-4)."""
import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_mod_source_contains_deny_marker():
    spec = importlib.util.spec_from_file_location("rules", ROOT / "skills/rulebook/scripts/rules.py")
    rules = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = rules  # dataclasses look the module up
    spec.loader.exec_module(rules)
    source = (ROOT / "mods/rules-first/rules-first.mjs").read_text()
    assert rules.DENY_MARKER in source
