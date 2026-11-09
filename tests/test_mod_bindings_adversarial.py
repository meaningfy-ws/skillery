"""Adversarial cases for the navigator `mod_bindings_match` lint (design §7, DD-10)."""
from tools.repo_lint import lint


def _setup(tmp_path, ids, strict_ts):
    hooks = "".join(f"  - id: {i}\n    intent: x\n    provenance: {{skill: s}}\n"
                    f"    bindings: [{{mechanism: mod, phase: phase-gate}}]\n" for i in ids)
    (tmp_path / "hooks.yaml").write_text(f'version: "9.9.9"\nhooks:\n{hooks}', encoding="utf-8")
    lib = tmp_path / "mods" / "navigator" / "lib"
    lib.mkdir(parents=True)
    (lib / "strict.ts").write_text(strict_ts, encoding="utf-8")


def test_commented_out_rule_is_not_a_rule(tmp_path):
    # §7: the set of rule-id literals in STRICT_RULES; a commented-out entry is not a rule
    _setup(tmp_path, ["navigator-strict-commit"],
           "export const STRICT_RULES = [\n  { id: 'navigator-strict-commit', owner: 'x' },\n"
           "  // { id: 'navigator-strict-old', owner: 'x' },\n] as const\n")
    assert lint.mod_bindings_match(tmp_path) == []


def test_non_mod_binding_hook_is_ignored(tmp_path):
    _setup(tmp_path, ["navigator-strict-commit"], "  { id: 'navigator-strict-commit' },\n")
    with (tmp_path / "hooks.yaml").open("a", encoding="utf-8") as f:
        f.write("  - id: other\n    intent: x\n    provenance: {skill: s}\n"
                "    bindings: [{mechanism: git, phase: quality}]\n")
    assert lint.mod_bindings_match(tmp_path) == []
