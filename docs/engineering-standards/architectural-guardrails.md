# ADR: Architectural Guardrails for Python (Tooling)

Format follows the `architecture` skill's `references/ADR_TEMPLATE.md` (single source for the ADR
shape). This is human canon; the operational layering rules live in the `cosmic-python` skill.

## Context and Problem Statement

Cosmic Python / Clean Architecture is an *intended* structure — Python does not enforce it.
Nothing stops domain code importing a DB driver, a service making an HTTP call, or a "temporary"
shortcut becoming a permanent leak. These erode silently and surface only when change gets
expensive. Can we make the architecture **explicit, checkable, and continuously enforced** rather
than relying on reviewer vigilance?

## Considered Options

A support matrix of the concerns vs. tools (✅ supported · 🟡 partial · ❌ none):

| Concern | import-linter | Ruff/Flake8 | MyPy/Pyright | Custom AST | CodeQL |
|---|---|---|---|---|---|
| Layer dependency direction | ✅ | 🟡 | ❌ | 🟡 | ✅ |
| Forbid domain→infrastructure imports | ✅ | 🟡 | ❌ | 🟡 | ✅ |
| Forbid circular deps | ✅ | 🟡 | ❌ | 🟡 | ✅ |
| Prevent framework imports in domain | ✅ | 🟡 | ❌ | 🟡 | ✅ |
| Prevent I/O / HTTP / DB calls in domain | ❌ | 🟡 | ❌ | 🟡 | ✅ |
| Call-level boundaries (no DB session outside repos; reach-through) | ❌ | 🟡 | ❌ | 🟡 | ✅ |
| Dataflow / taint (untrusted input → sink) | ❌ | ❌ | ❌ | ❌ | ✅ |
| CI enforceable | ✅ | ✅ | ✅ | 🟡 | ✅ |
| Signal-to-noise | high | med | med | low | med |
| Learning / maintenance cost | low | low | med | high | med-high |

Aggregate score (/45): **CodeQL 39 · import-linter 31 · Ruff 21 · MyPy 21 · Custom AST 21.**

## Decision Outcome

**Use a layered tooling strategy — the tools are complementary, not competing:**

1. **import-linter in every repo** — the everyday baseline for *import-level* concerns (layer
   direction, framework isolation, no cycles). Near-zero learning cost, excellent signal-to-noise.
2. **CodeQL in CI for critical/client repos** — the deeper net for what import-linter cannot see:
   call-level discipline ("no DB session outside repositories"), reach-through calls, and
   dataflow/taint. High cost — reserve for repos that warrant it.
3. **Ruff + MyPy as quality baselines** — do not expect them to enforce architecture.

## Consequences

- Every repo gets cheap, reliable layer enforcement; critical repos additionally get behavioural
  and dataflow guarantees.
- Cost is proportional to risk (CodeQL only where it pays off).
- Limitation: import-linter is blind to runtime/call-level violations; that gap is explicitly
  covered by CodeQL, not by pretending Ruff/MyPy fill it.

## Confirmation

`cosmic-python`'s CI guidance recommends the right tool per concern; `importlinter` contracts are
part of the standard project setup; CodeQL is wired into CI for designated repos.
