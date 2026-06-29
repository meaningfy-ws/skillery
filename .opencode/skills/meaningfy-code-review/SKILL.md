---
name: meaningfy-code-review
description: The Meaningfy pre-PR review — two modes (standalone = five lens subagents fanned out in parallel, one lens each; interactive main-thread), a methodical catalogue-complete review procedure (traverse the whole `cosmic-python` region a lens owns, not a fixed subset), and a fit-and-refactoring investigation, reported by priority. Use to supply the review criteria, modes, and dispatch contract for a Meaningfy change. Trigger on "Meaningfy review checklist", "architecture-conformance review", "review against cosmic-python layers", "pre-PR review criteria", "review modes", "review lenses". For the read-only standalone run, use the external `code-review` command or the `code-reviewer` wrapper.
license: Apache 2.0
metadata:
  category: ai-coding
---

# Meaningfy Code-Review

## Overview

The **criteria, modes, and dispatch contract** for a Meaningfy pre-PR review. This skill defines *how
to run it* (two modes, five lenses fanned out in parallel), *the review procedure* (methodical and
catalogue-complete, not a curated checklist), and *how to report*. The read-only standalone *run* is
performed by the external `code-review` command or the `code-reviewer` agent wrapper (which loads this
skill). The review **criteria are the `cosmic-python` catalogue itself** — this skill scopes and
sequences it, it does not restate or sample it.

## Review modes

A review has **two modes**. The analysis is always isolated from implementation context.

- **Standalone (default)** — the read-only analysis, fanned out as **five lens subagents in parallel**
  (one lens each, see Lenses below), then aggregated into one prioritised report. No dialogue.
- **Interactive** — entered when the developer starts discussing the PR code or the returned findings.
  Runs in the **main thread** over the *aggregated* findings; the reviewer becomes a thinking partner:
  explains findings, weighs trade-offs against the cited principles, and co-designs fixes. It stays
  **read-only** — accepted fixes are applied later by the `implementer`, never by the review.

**Always-subagent rule.** The review *analysis* MUST be triggered as subagent execution(s), isolated
from the implementation/main context — never run inline in the implementation context. Only the
aggregation of returned findings and the interactive discussion of them happen in the main thread.

### Dispatch contract (standalone)

A standalone review **fans out exactly five subagents, one per lens (L1–L5), launched in parallel** —
each invoking the `code-reviewer` agent scoped to its single lens. **One combined subagent that runs
all lenses is a defect**, not an optimisation: lenses are isolated so each gets a full, undistracted
context budget and the passes overlap in wall-clock.

- The **dispatcher** is the caller (the main thread, or the external `code-review` command), because
  the read-only `code-reviewer` agent cannot spawn subagents itself. The dispatcher MUST launch all
  five and then aggregate.
- Each subagent receives **only its lens id + the review context** (diff, EPIC/specs, Gherkin) — never
  the implementation session history.
- A single-lens review (e.g. "L3 only") dispatches **one** subagent; the five-way fan-out is the
  default for a full review.

### Lenses

The analysis is partitioned into a fixed set of **five lenses**; **each lens is one subagent run**.
A lens is **not a curated checklist** — it is a **region of the `cosmic-python` standard that the
subagent must traverse in full**. Together the five regions cover the whole standard (the catalogue
*and* the SKILL contract) with no overlap and no gap; no new ids are minted here.

| Lens | Catalogue/SKILL region it owns — **review every entry in the region**, the examples are not a limit |
|------|----------------------------------------------------------------------------------------------------|
| **L1 · Security & safety** | the security/safety surface: secrets & credentials, injection (command/SQL/XSS), the OWASP top-10, `BP-VALIDATE-AT-BOUNDARY`, `AP-DUP-VALIDATION`, and sensitive-data handling per `guardrails`. |
| **L2 · Spec correctness & tests** | conformance to the EPIC **requirements/specs** (not the plan) — acceptance criteria, edge/error scenarios, no undocumented divergence — **and** the whole `cosmic-python` testing contract (§"No Clean Code Without Tests", `BP-COVERAGE-PER-LAYER`, FIRST, test-per-layer Workflow 3, Gherkin step defs). |
| **L3 · Architecture conformance** | the `cosmic-python` structural contract in full: the four layers, the dependency law (§1–2), component organisation (`PR-COMPONENT-FIRST`), observability placement, **and every structural anti-pattern** (`AP-IO-IN-MODELS`, `AP-LOGIC-IN-EDGES`, `AP-CROSS-VARIANT-IMPORT`, `AP-PARALLEL-LAYOUTS`, cycles). |
| **L4 · Principles & clean code** | the Clean Code + SOLID standard in full (§"Core Principles") **and every within-unit best-practice/anti-pattern** (`BP-DOMAIN-REVEALING-NAMES`, `BP-CONSTANTS-ENUMS`/`-HOME`, `BP-EXCEPTIONS-MODULE`, `BP-IDIOMATIC-SMALL`; `AP-FREESTR-ANYLAYER`, `AP-DICT-AS-MODEL`, `AP-GENERIC-MODULE-NAMES`, `AP-EXCEPTIONS-EMBEDDED`). |
| **L5 · Fit, elegance & refactoring** | the reuse/compactness principles in full (`PR-SURVEY-FIRST`, `PR-REUSE-COMPACT`, `PR-SSOT-DRY`, `PR-CONFIG-DECOUPLED`) and the duplication/fragmentation anti-patterns (`AP-DUP-CONST`, `AP-MISPLACED-SHARED-INFRA`, `AP-OVER-FRAGMENTATION`, `AP-VERBATIM-EXTERNAL`), **plus** the forward-looking fit & refactoring investigation (new + touched code) with gitnexus blast radius. |

**Lens MECE boundaries** (so a finding lands under exactly one lens):
- **L3 vs L4** — L3 owns *cross-file/structural* rules (layer direction, cycles, layout, I/O-in-models,
  logic-in-edges); L4 owns *within-unit* code quality (SOLID, naming, free strings, dicts, exceptions,
  constants). A misplaced import is L3; a magic string is L4.
- **L4 vs L5** — L4 flags a *local* quality defect as-is; L5 owns *cross-file reuse/fit* and the
  *forward-looking refactoring*. "This name is unclear" is L4; "this duplicates the sibling, lift it" is L5.
- **L2 vs all** — L2 is the only lens that judges against the **requirements/specs** (correctness + the
  tests proving it); the others judge the code against principles regardless of requirements.

## Review procedure (per lens subagent)

The checklist **is the `cosmic-python` standard**, not a fixed list — so coverage is complete by
construction and survives catalogue growth. Every lens subagent runs the **same five-step procedure**,
scoped to its region:

1. **Scope in.** Open this lens's region — the catalogue
   ([`cosmic-python:references/principles-and-anti-patterns.md`](../cosmic-python/references/principles-and-anti-patterns.md))
   filtered to the lens, plus the matching `cosmic-python` SKILL sections (see the Lenses table). The
   *region*, not a sample, is your checklist.
2. **Gather.** Read the diff (new + touched code), the EPIC requirements/specs, and the covering
   Gherkin.
3. **Traverse exhaustively.** Walk **every** principle (`PR-*`), best-practice (`BP-*`), and
   anti-pattern (`AP-*`) in the region against the changed code; also apply the cosmic-python SKILL
   review questions (Workflow 2) and the ONE-MINUTE CODE STRUCTURE CHECK where the lens owns them. Do
   not stop at "found one" — the standard is checked in full.
4. **Blast radius.** For each modified symbol run `gitnexus_impact(… direction: "upstream")` and flag
   HIGH/CRITICAL. *(L5 also runs this on each refactor candidate.)* If gitnexus is unavailable, warn
   and proceed.
5. **Emit.** Report findings citing the catalogue **entry id**, by priority (Output format below);
   stay silent on entries that pass. **L5 additionally** proposes how the new code and the existing
   code it touches could be refactored toward a crisper, more elegant, effective fit —
   **recommendations only, the review never edits code**.

## Output format

Each lens subagent reports its own findings; a full standalone review **aggregates the five passes**
into one report. Tag each finding with its **lens** (L1–L5). Report by priority, each finding with
**file:line**, **what**, **why** (name the principle/id), **how to fix**:
- **Critical** — breaks functionality, security, or architecture boundaries (must fix before merge).
- **Warnings** — quality issues, missing non-critical coverage, naming.
- **Suggestions** — non-blocking improvements (includes L5 refactoring recommendations with blast radius).

## Boundary & Related Skills

**Owns:** the two modes (standalone five-way fan-out / interactive main-thread), the **dispatch
contract** (five lens subagents in parallel, one lens each), the five lens **regions** + MECE
boundaries, the **methodical per-lens procedure** (traverse the whole region), and the report format.
**Does NOT** own the rules themselves (the `cosmic-python` catalogue is the checklist — cite, never
restate), perform the run (external `code-review` / `code-reviewer` wrapper), or fix code (the
`implementer` applies accepted fixes). The fit & refactoring investigation is **recommendations-only**.
**Related:** `cosmic-python`, `guardrails`, `meaningfy-git-workflow`, external `code-review`, `superpowers:requesting-code-review`, `superpowers:receiving-code-review`.
