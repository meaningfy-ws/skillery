---
name: cosmic-python
description: Clean Architecture and Cosmic Python guidance for well-tested, layered Python systems. Use for designing Python projects with layered architecture (models, adapters, services, entrypoints), enforcing Clean Code and SOLID principles, testing strategies (unit tests, BDD, Gherkin), CI/CD setup (pytest, tox, importlinter), and architectural decision-making (ADRs). Applicable to systems requiring strict boundary enforcement, clean separation of concerns, and comprehensive test coverage.
license: Apache 2.0
version: 1.0.0
---

# Cosmic Python: Code Architecture for Production Systems

## ⚠️ CRITICAL DISTINCTION

**Cosmic Python is NOT about system architecture** (service boundaries, deployment topology, C4 models—that's the separate **architecture** skill).

**Cosmic Python IS about code structure** within a Python module or service: how to organize classes, functions, tests, and dependencies so that code is clean, testable, and maintainable.

When to use Cosmic Python:
- You have a **service/module to build** (the strategic scope is clear from architecture decisions)
- You need to **structure the Python code** inside that service with clean layers
- You want to enforce **clean code principles, SOLID, and dependency management**
- You need **comprehensive test coverage** organized per layer

This skill pairs with:
- **Stream Coding** (documentation-first methodology) – Use to plan WHAT to build
- **Cosmic Python** (this skill) – Use to structure HOW to build the code
- **Architecture** skill – Use for system-level design (separate scope)

---

## THE MEANINGFY CONTRACT: MINIMISE WTFs PER MINUTE

Our goal is **clean code that passes code review quickly** while keeping developers productive and safe.

This is achieved through three non-negotiable commitments:

### 1. Layered Architecture – Strict Separation of Concerns

Within each Python module or service, separate code into **four tightly-bounded layers**:

- **`models/`** – Domain logic (business rules, entities, value objects)
  - No I/O, no framework dependencies, pure domain
  - Tests focus on business invariants and domain rules
  - Fastest tests, run first

- **`adapters/`** – Infrastructure and integration (databases, APIs, file systems)
  - Implement repositories, gateways, clients
  - Depend on `models` only; never on `services` or `entrypoints`
  - Tests mock external services; focus on integration boundaries

- **`services/`** – Use-case orchestration (application logic, workflows)
  - Choreograph `models` and `adapters`
  - Contain transaction boundaries and error handling policy
  - May depend on `models` and `adapters`, never on `entrypoints`
  - Tests use mocks for adapters; focus on orchestration logic

- **`entrypoints/`** – Request/response boundaries (API, CLI, schedulers, workers)
  - Parse input, call services, format responses
  - Handle routing, status codes, argument validation
  - Minimal business logic; delegate to `services`
  - Tests verify contracts (status codes, response shapes, argument parsing)

### 2. Dependency Direction – Always Enforced (DIP)

**The Law:**
```
entrypoints → services → models
              ↘
              adapters → models
```

**Never the reverse.** High-level policy (models + services) must never depend on low-level details (adapters). Low-level details depend on abstractions (interfaces/protocols), not the other way around.

**When you violate this:**
- Circular dependencies appear
- Models become framework-dependent
- Testing becomes hard (can't mock cleanly)
- You've broken the architecture

**How to enforce:**
- Use `importlinter` in CI/CD to block forbidden imports (see references)
- Code review checklist: "What imports what?" before approving

### 3. No Clean Code Without Tests – Every Layer Owns Its Tests

> "If you can't test it, you can't understand it. If you can't understand it, you can't maintain it."

- **80%+ coverage** on production code (target per layer)
- **Tests per layer:** Each layer tests its own responsibility, not other layers' internals
- **TDD/BDD:** Write tests before code; BDD (Gherkin) for use cases
- **Test pyramid:** Many unit tests (fast, isolated), fewer integration tests, minimal end-to-end
- **FIRST:** Tests are **F**ast, **I**ndependent (no shared state/order), **R**epeatable (deterministic, no flakiness), **S**elf-validating (pass/fail, no manual inspection), **T**imely (written with the code, not after)

---

## CORE PRINCIPLES FROM MEANINGFY ENGINEERING

### Clean Code Standards

- **Intention-revealing names** – `calculate_customer_tier()` not `calc_tier()`
- **Small, cohesive functions** – <25 lines is a good target; if you say "and" in description, split
- **No magic strings** – Define constants or enums; raw string literals are technical debt
- **Minimal nesting** – Deep nesting signals complexity; refactor
- **DRY but not obsessively** – Three similar lines don't warrant a helper; ten do

### SOLID Principles Applied Systematically

- **SRP** – One responsibility per class/function; if multiple reasons to change, split
- **OCP** – Extend via new classes/strategies, not conditional logic in existing code
- **LSP** – Subclasses must respect contracts; avoid overrides that break expected behavior
- **ISP** – Avoid "fat" interfaces; split into cohesive ones matching clients' needs
- **DIP** – Depend on abstractions (interfaces/protocols), inject concrete implementations

### Observability as First-Class

- **Structured logging** – Logs are data, not strings; emit JSON with context
- **Keep it in the right layers** – Observability belongs in `services` and `entrypoints`, not deep in `models`
- **OpenTelemetry patterns** – Tracing and metrics via standard conventions
- **No print statements in production** – Use logging framework always

---

## ONE-MINUTE CODE STRUCTURE CHECK

**For each function/class, ask:**

- Which layer does this belong in?
- What should it depend on?
- What should depend on it?
- What tests does it need?
- Does it have only one reason to change?

If you can't answer these clearly, **the architecture is drifting.** See the references for detailed refactoring paths.

---

## COMMON WORKFLOWS

### Workflow 1: Implementing Code From Specs (Stream Coding Phase 3)

When you have clear specs from **Stream Coding Phase 2** (doc is 9+/10 Clarity Gate):

1. **Identify which layer each component belongs to** – Models? Services? Adapters?
2. **Start with `models/`** – Pure domain logic, no I/O, no frameworks
3. **Write unit tests for models first** – Verify domain rules before implementing services
4. **Implement `adapters/`** – Repositories, gateways, clients; mock external services in tests
5. **Implement `services/`** – Orchestrate models and adapters; test with mocked adapters
6. **Implement `entrypoints/`** – CLI, API, schedulers; minimal logic, mostly delegation
7. **Run full test suite** – Verify 80%+ coverage per layer
8. **Run architectural checks** – `make check-architecture` to validate import contracts

### Workflow 2: Code Review Against Cosmic Python Standards

**Before approving a pull request, ask:**

**Layering:**
- Does `models/` import from `services`, `adapters`, or `entrypoints`? ❌ Should not
- Do `adapters/` import from `services` or `entrypoints`? ❌ Should not
- Do `services/` import from `entrypoints`? ❌ Should not
- Is business logic in `services/` or `models/`, not scattered in `entrypoints/`? ✅ Should be

**Clean Code:**
- Are functions <25 lines? ✅ Target for readability
- Do all functions have only one reason to change? ✅ Check for SRP violation
- Are all symbolic identifiers (role names, status values, etc.) constants/enums, not magic strings? ✅ Required
- Is there any deep nesting (3+ levels)? ❌ Refactor to smaller functions

**Testing:**
- Does each layer have appropriate unit tests? ✅ Required
- Are important decisions (branches, error cases) tested? ✅ All branches covered
- Do adapters use mocks for external systems? ✅ Tests must be isolated
- Is coverage reported per layer? ✅ Verify with `coverage report`

**Observability:**
- Are logs in `services/` and `entrypoints/`, not deep in `models/`? ✅ Correct placement
- Is logging structured (JSON context), not formatted strings? ✅ Required for production

### Workflow 3: Test Organization Per Layer

For each layer, write tests that match its responsibility:

| Layer | What to Test | How | Example |
|-------|--------------|-----|---------|
| **`models/`** | Domain rules, invariants, transformations | Unit tests, no I/O, fast | `test_user_cannot_have_negative_balance()` |
| **`adapters/`** | Integration with external systems (mocked) | Unit tests with mocks, or integration with real test DBs | `test_postgres_repository_insert_user()` |
| **`services/`** | Use-case orchestration and business workflows | Unit tests with mocked adapters | `test_user_signup_flow_sends_verification_email()` |
| **`entrypoints/`** | Request parsing, response formatting, status codes | Unit tests, check contracts | `test_api_endpoint_returns_201_on_create()` |

**Target:** 80%+ coverage overall, with focus on each layer's responsibility (not mixing concerns).

### Workflow 4: Spotting and Fixing Architecture Drift

Common anti-patterns and how to fix them:

| Anti-Pattern | How It Looks | Why It's Wrong | Fix |
|--------------|--------------|----------------|-----|
| **I/O in models** | `import requests` in `models/user.py` | Models can't be tested in isolation | Move HTTP call to `adapters/`, inject via DIP |
| **Business rules in entrypoints** | API handler validates and transforms data | Logic is scattered, untestable | Extract to `services/`, call from handler |
| **Circular imports** | `services/` → `adapters/` → `services/` | Can't import cleanly, hard to test | Restructure: `adapters/` → `models/`; `services/` → `adapters/` + `models/` |
| **Magic strings everywhere** | `if user.role == "admin"` in 5 files | Refactoring is fragile; intent hidden | Define `ROLE_ADMIN = "admin"` constant once, import everywhere |
| **No tests for branching** | `services/` has 5 branches but only happy path tested | Edge cases crash production | Add parametrized tests for each branch |
| **Clever one-liners** | `[x for x in y if x.z and (a or b)]` | Unreadable; maintenance nightmare | Expand to 3-4 readable lines with intermediate variables |

---

## QUALITY ASSURANCE & TOOLING

### Essential Tools for Well-Guarded Projects

- **Poetry** – Dependency management, lockfiles, reproducible builds
- **pytest + pytest-bdd** – Unit tests (TDD) and behavior specs (BDD/Gherkin)
- **tox** – Test multiple Python versions in isolated environments
- **importlinter** – Enforce architectural boundaries (block forbidden imports)
- **pylint / flake8** – Static analysis, style compliance
- **SonarQube / SonarCloud** – Code quality gates, duplication, security smells
- **Codecov** – Coverage reporting, trend tracking, gate on new code

### Typical Makefile Pattern

```bash
make install                # Set up environment (poetry install)
make test                   # Run unit tests with coverage
make test-bdd               # Run BDD feature tests
make check-architecture     # Validate import contracts (importlinter)
make lint                   # Run style checks (pylint, flake8)
make ci                     # Full pipeline (all above)
```

### CI/CD Workflow

Before merging to main:
1. Run tests and verify 80%+ coverage on new code
2. Run `importlinter` to block dependency violations
3. Run SonarCloud analysis; no new critical issues
4. Verify Clarity Gate from spec still matches code

---

## PRINCIPLES & BEST PRACTICES

### On Code Structure

- **Organize by domain, not by layer** – `billing/models/`, `billing/services/`, not `models/billing/`
- **Use constants/enums for all symbolic identifiers** – Never rely on "magic strings"
- **Small, cohesive functions** – If you say "and" when describing what a function does, split it
- **Avoid deep nesting** – >3 levels usually signals refactoring opportunity
- **DRY but pragmatically** – 2-3 similar lines are OK; 5+ warrant extraction

### On Testing

- **Test the decisions, not the steps** – Test what varies (branches), not happy paths
- **Test per layer, not per unit** – Models test domain rules; services test orchestration
- **Use fixtures and parametrization** – pytest.mark.parametrize for multiple scenarios
- **Mock external dependencies** – Adapters provide mocks for services tests
- **BDD for use cases** – Gherkin feature files for end-to-end workflows

### On Architecture Decisions

- **Document major choices in ADRs** – Architecture Decision Records explain the trade-off
- **5–8 ADRs per service is typical** – More suggests decisions are tangled
- **Contract-first design** – Write OpenAPI/AsyncAPI specs before code
- **Use dependency injection** – Never `import` concrete implementations directly in services

### On Observability

- **Structured logging** – Emit JSON with context, not formatted strings
- **Keep observability in the right layers** – `services/` and `entrypoints/`, not deep in `models/`
- **No print() in production** – Use logging framework; configure per environment
- **OpenTelemetry for tracing** – Standard conventions for metrics and spans

---

## WHEN NOT TO USE COSMIC PYTHON

- **Rapid prototypes** – Layering has upfront cost; worthwhile only if long-term maintenance matters
- **Exploratory/spike code** – Keep spikes separate; migrate to Cosmic Python only when strategy is clear
- **Simple scripts** – Single-file scripts don't need four layers

This approach requires **team discipline**. One developer ignoring layers breaks the architecture for everyone. All developers must respect boundaries and code review rigorously.

---

## COSMIC PYTHON + STREAM CODING: THE COMPLETE WORKFLOW

**Stream Coding** (documentation-first planning) and **Cosmic Python** (clean code structure) work together:

| Phase | Methodology | Focus | Output |
|-------|-------------|-------|--------|
| 1 | **Stream Coding** | Strategic: WHAT to build, WHY | Strategic Blueprint + ADRs |
| 2 | **Stream Coding** | Specifications: HOW to build (AI-ready) | Implementation Specs (9+/10 Clarity Gate) |
| 3 | **Cosmic Python** | Code: Implement following layers/SOLID | Production code (80%+ tested) |
| 4 | **Cosmic Python** | Quality: Prevent drift, maintain specs | CI/CD gates, spec-first fixes |

### The Integration

- **Phase 2 specs must reference Cosmic Python layers** – "Models layer will contain...", "Services layer will orchestrate..."
- **Phase 3 code follows Cosmic Python patterns** – Layering, SOLID, testing per layer
- **Phase 4 maintenance** – When fixing bugs, update spec first, then regenerate code (not manual patches)

---

## REFERENCE MATERIALS

### Layer-by-Layer Real-World Examples

- **[example-models-layer.md](references/example-models-layer.md)** – Domain entities, value objects, Pydantic models, no I/O
- **[example-adapters-layer.md](references/example-adapters-layer.md)** – Repositories, gateways, abstract interfaces, test doubles
- **[example-services-layer.md](references/example-services-layer.md)** – Use-case orchestration, dependency injection, error handling patterns
- **[example-entrypoints-layer.md](references/example-entrypoints-layer.md)** – FastAPI endpoints, Typer CLI, scheduler integration

### Testing & Quality

- **[example-testing-patterns.md](references/example-testing-patterns.md)** – Unit tests per layer, mocking strategy, fixtures, BDD patterns
- **[example-project-quality-ci.md](references/example-project-quality-ci.md)** – Makefile, tox, importlinter, GitHub Actions, SonarCloud setup

### Advanced Production Patterns

- **[example-advanced-patterns.md](references/example-advanced-patterns.md)** – Configuration via decorators, exception hierarchies, protocols, cross-version services

### Documentation-First Methodology (Stream Coding)

- The **stream-coding** skill (external — see `docs/environment-setup.md`) owns the documentation-first method: 40/40/20 split, mandatory spec sections, Rule of Divergence.
- The **clarity-gate** skill owns AI-ready specs + the 13-item Clarity Gate and scoring rubric.
- Meaningfy adaptation notes live in `docs/engineering-standards/references/` (`stream-coding-notes.md`, `strategic-blueprint-checklist.md`).

### Company Standards & Principles

- Human canon: `docs/engineering-standards/coding-prompt.md` — the full Meaningfy engineering culture (project structure, layering, SOLID, CI/CD, security). **This SKILL.md is the operational version of that canon.**

---

## SKILL RELATIONSHIPS

- **architecture** ← System-level design (C4 models, service boundaries, deployment); use BEFORE Cosmic Python
- **stream-coding** ← Documentation-first methodology (planning specs); use WITH Cosmic Python for Phase 3 implementation
- **cosmic-python** ← Code structure within services (this skill)
- Your **CI/CD tooling** → importlinter, SonarCloud, pytest, tox (configured per Cosmic Python standards)

## BOUNDARY & CANONICAL VOCABULARY

**This skill owns** code structure inside a service: the four layers, SOLID, what to test per
layer, and CI guardrails. It does **NOT** own:
- The **TDD ritual** (red-green-refactor) → follow `superpowers:test-driven-development`; this
  skill says *what belongs in a models test vs. a services test*, not how to do TDD.
- **System design / topology / contracts** → the `architecture` skill (cosmic-python *consumes*
  the contracts it authors; `make generate-models` is the seam).
- **Commit/PR mechanics** → the `meaningfy-git-workflow` skill.

**Canonical folder vocabulary:** `models/`, `adapters/`, `services/`, `entrypoints/` within
**root modules** (not a single `/src`). The Cosmic Python book's `/domain` and `/service_layer`
are **documented synonyms** for `models/` and `services/` — when reading the book, map them onto
our canonical names. No semantic label should exist only as a free string.

