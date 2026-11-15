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

def _line_starting(prefix):
    def place(text):
        return next((ln for ln in text.splitlines() if ln.startswith(prefix)), "")
    return place


def _section_after(heading_start):
    def place(text):
        out, inside = [], False
        for ln in text.splitlines():
            if inside and ln.startswith("## "):
                break
            if ln.startswith(heading_start):
                inside = True
            elif inside:
                out.append(ln)
        return "\n".join(out)
    return place


def _bullet(prefix):
    def place(text):
        out, inside = [], False
        for ln in text.splitlines():
            if inside and (ln.startswith("- ") or not ln.strip()):
                break
            if ln.startswith(prefix):
                inside = True
            if inside:
                out.append(ln)
        return "\n".join(out)
    return place


# file, the place in it, how to cut the place out
BINDINGS = [
    ("docs/environment/global-prompt.md", "the bullet '- Your own rules'", _bullet("- Your own rules")),
    ("skills/project-setup/assets/templates/agentic/AGENTS.md.tmpl", "the '.claude/' section", _section_after("## `.claude/`")),
    ("AGENTS.md", "the '- **Rules:**' line", _line_starting("- **Rules:**")),
]


def test_mod_source_contains_deny_marker():
    source = (ROOT / "mods/rules-first/rules-first.mjs").read_text()
    assert rules.DENY_MARKER in source


@pytest.mark.parametrize("name, where, cut", BINDINGS, ids=[b[0] for b in BINDINGS])
def test_binding_carries_routing_sentence(name, where, cut):
    place = cut((ROOT / name).read_text(encoding="utf-8"))
    assert place, f"{name}: {where} not found"
    assert rules._normalise_sentence(rules.routing_sentence()) in rules._normalise_sentence(place), \
        f"{name}: {where} lacks the routing sentence of routing.md"


def test_pointer_carries_routing_sentence():
    assert rules._normalise_sentence(rules.routing_sentence()) in rules._normalise_sentence(rules.POINTER), \
        "rules.POINTER lacks the routing sentence"


def test_wrapped_copy_with_curly_apostrophe_matches():
    sentence = rules.routing_sentence()
    copy = "\n  ".join(textwrap.wrap(sentence.replace("'", "’"), 100))
    assert "\n" in copy and "’" in copy
    assert rules._normalise_sentence(sentence) in rules._normalise_sentence(copy)
