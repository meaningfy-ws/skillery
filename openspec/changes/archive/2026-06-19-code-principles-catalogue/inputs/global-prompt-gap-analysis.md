# Audit — global `~/.claude/CLAUDE.md` vs skill coverage (SECONDARY input)

Goal (DEC-8): every code-structure rule the global prompt carries must be captured in a skill, so the
global file can **route, never restate**. Method: theme-by-theme grep across `skills/*/SKILL.md`.

## Captured (no action — already owned by a skill)

| Global-prompt theme (§) | Owned by |
|---|---|
| WTFs-per-minute goal; layering; dependency direction (§0,2,3) | `cosmic-python` |
| Root modules / `core` / no `/src` (§1,2.1) | `cosmic-python` + `project-setup` |
| SOLID, Clean Code, small functions (§3) | `cosmic-python` |
| Observability layering, no `print()` in prod, structured logs (§3) | `cosmic-python` |
| import-linter boundary enforcement (§2.3,5) | `cosmic-python` + `project-setup` + `guardrails` |
| Testing strategy, per-layer tests, ≥80%, pytest/tox (§4) | `cosmic-python` + `project-setup` + `ci-cd-delivery` |
| BDD / Gherkin, Scenario Outline, edge cases (§4.2) | `bdd-gherkin` |
| Tooling/CI, Makefile, SonarQube/Codecov (§5,5.2) | `project-setup` + `ci-cd-delivery` |
| Schema-based codegen, LinkML, `make generate-models` (§5.1) | `conceptual-modelling` + `project-setup` |
| Epics / Work Shape / appetite / no-gos (§6) | `epic-planning` |
| Secrets in code, injection, OWASP, prompt-injection (§7) | `guardrails` + `meaningfy-code-review` |

## GAPS — surfaced by the audit (fold into the catalogue or named home)

- **G1 — Free strings apply to ALL layers, not just models/services.** Global §2.4 says free strings
  "anywhere in the codebase"; `meaningfy-code-review` narrows to "models or services". → catalogue +
  code-review fix (already EPIC **DEC-7**).
- **G2 — No large verbatim external copies; respect licences.** Global §7 ("be careful with generated
  code that is large, verbatim chunks from external libraries; prefer idiomatic small snippets; respect
  licensing"). Not captured anywhere (grep hits were only the `license:` frontmatter). → **catalogue**
  best-practice/anti-pattern entry.
- **G3 — Validate once at the boundary; do not duplicate validation.** Global §2.4 anti-pattern. Not in
  cosmic-python's anti-pattern table. → **catalogue** anti-pattern entry.
- **G4 — Cross-sub-module & parallel-variant import rules.** Global §2.3: `core` is inward-looking; parallel
  variants must not cross-import; DAG/tools → main is one-way only. `cosmic-python` covers layer direction
  but is thin on these cross-module rules. → **catalogue** (extend the dependency-direction section).
- **G5 — Sensitive-data interaction guidance.** Global §7: don't encourage pasting secrets/PII; for sensitive
  data suggest approved/self-hosted models and abstract prompts. `guardrails` covers injection + secrets-in-code
  but not this user-interaction guidance. → **`guardrails`** (natural home), cited by the catalogue.

## Note

The catalogue does NOT re-derive the whole coding prompt (rabbit-hole). It seeds from the existing
cosmic-python tables + the eds4jinja2 findings + gaps **G1–G4** above; **G5** lands in `guardrails`.
