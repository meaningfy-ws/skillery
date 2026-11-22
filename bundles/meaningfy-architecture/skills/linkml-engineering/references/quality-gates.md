# Quality gates: chosen, not imposed

The right set depends on the project, so ask the user which gates to establish instead of imposing
one profile. Walk the candidates, confirm enable or skip and any threshold, wire the chosen gates into
`make` and CI, and record the choice (CONTRIBUTING or the `make` help block) so it is visible and
revisitable. Enable the first three by default; the rest are a deliberate choice.

| Gate | What it catches | Ask |
|------|-----------------|-----|
| Schema lint, no muted warnings | naming, metadata, convention violations | Enable with a committed ruleset? |
| Codegen freshness | a YAML edit committed without regenerating | Enable? (strongly recommended) |
| Example round-trip | documentation examples that rot | Enable if the schema uses `examples:`? |
| Coverage on hand-written code | untested adapters and validators around the models | Threshold (project default ≥80%)? |
| Import-linter on generated modules | generated `models` importing upward, variant cross-imports | Enable if layered or versioned? |
| model2owl / SHACL checker | incomplete or incorrect OWL/SHACL | Enable if OWL/SHACL is delivered? |

## Schema lint, without muting

`linkml-lint` on the schema (or the directory) against a committed `.linkmllint.yaml` that `extends:
recommended`, in the default build and CI. A muted linter discards every convention it enforces:
treat it as a violated gate. Exit codes: `0` clean, `1` warnings, `2` errors. Rules to enable:

- `recommended`: the recommended metaslots, chiefly `description` (enforces "define every element").
- `standard_naming`: CamelCase classes and enums, snake_case slots.
- `tree_root_class`: a single `tree_root: true` class.
- `canonical_prefixes`: prefixes aligned with the standard prefix maps.
- `no_invalid_slot_usage`, `permissible_values_format`, `no_empty_title`, `no_xsd_int_type`.

## Codegen freshness: regenerate and diff

```makefile
check-models: generate-models
	git diff --exit-code -- $(GEN_PY) $(GEN_JSON) $(GEN_OWL) $(GEN_SHACL)
```

A YAML edit without regeneration fails the build: the single most valuable LinkML gate.

## Example round-trip

`linkml-validate` the schema's inline `examples:` against the schema, so they cannot drift.

## Coverage and architecture

The project's coverage bar applies to the hand-written code around the generated models. The
layering of generated modules is enforced with `import-linter` (`generation-and-templates.md`, last
section).

This skill owns what the gates are and how to choose them; installing the chosen set in a repo is
`project-setup`'s.
