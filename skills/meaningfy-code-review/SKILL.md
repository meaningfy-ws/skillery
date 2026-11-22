---
name: meaningfy-code-review
description: The Meaningfy pre-PR review — two modes (standalone = two grouped lens runs in parallel, five single lenses as the opt-in deep review; interactive main-thread), a methodical catalogue-complete review procedure (traverse the whole `cosmic-python` region a lens owns, not a fixed subset), and a fit-and-refactoring investigation, reported by priority. Use to supply the review criteria, modes, and dispatch contract for a Meaningfy change. Trigger on "Meaningfy review checklist", "architecture-conformance review", "review against cosmic-python layers", "pre-PR review criteria", "review modes", "review lenses". For the read-only standalone run, use the external `code-review` command or the `code-reviewer` wrapper.
license: Apache 2.0
metadata:
  purpose: software-development
  area: coding
  subject: python
  posture: precise
  stage: verify
  maturity: stable
---

# Meaningfy Code-Review

## Overview

The **criteria, modes, and dispatch contract** for a Meaningfy pre-PR review. This skill defines *how
to run it* (two modes, five lenses run as two grouped runs, or five single runs for the deep review), *the review procedure* (methodical and
catalogue-complete, not a curated checklist), and *how to report*. The read-only standalone *run* is
performed by the external `code-review` command or the `code-reviewer` agent wrapper (which loads this
skill). If `code-review` is not installed, offer to install it (`dependencies.yaml`); if the person
declines, say that you work without it: the main thread dispatches the lenses, no one-command run. The review **criteria are the `cosmic-python` catalogue itself** — this skill scopes and
sequences it, it does not restate or sample it.

## Review modes

A review has **two modes**. The analysis is always isolated from implementation context.

- **Standalone (default)** — the read-only analysis, run as **two grouped subagent runs in parallel**
  (L1+L2 and L3+L4+L5, see Lenses below; five single lenses as the opt-in deep review), then aggregated into one prioritised report. No dialogue.
- **Interactive** — entered when the developer starts discussing the PR code or the returned findings.
  Runs in the **main thread** over the *aggregated* findings; the reviewer becomes a thinking partner:
  explains findings, weighs trade-offs against the cited principles, and co-designs fixes. It stays
  **read-only** — accepted fixes are applied later by the `implementer`, never by the review.

**Always-subagent rule.** The review *analysis* MUST be triggered as subagent execution(s), isolated
from the implementation/main context — never run inline in the implementation context. Only the
aggregation of returned findings and the interactive discussion of them happen in the main thread.

### Dispatch contract (standalone)

A standalone review runs by default as **two grouped subagent runs, launched in parallel**: L1+L2 and
L3+L4+L5, each invoking the `code-reviewer` agent scoped to its lens group. A grouped run **reports
its findings per lens id**, so a finding stays traceable to its lens and no lens changes what it
checks. **Five single-lens runs in parallel** are the opt-in **deep review**: the caller asks for it
on a recorded risk (a `RISK-` row of the PLAN that names the stage or its files, or a decision under
`## Delivery decisions` in `design.md`, cited in the brief), and only from LARGE up. One run that
puts all five lenses together is refused: the largest group is L3+L4+L5.

- The **dispatcher** is the caller (the main thread, or the external `code-review` command), because
  the read-only `code-reviewer` agent cannot spawn subagents itself. The dispatcher MUST launch the
  runs of the chosen review (two, or five for the deep review) and then aggregate.
- Each subagent receives **only its lens id or lens group + the review context** (diff, EPIC/specs,
  Gherkin, and the impact result of the lead where the brief has one) — never the implementation
  session history.
- A single-lens review (e.g. "L3 only") dispatches **one** subagent; the two grouped runs are the
  default for a full review.
- **Size hook.** Inside an EPIC's delivery the fan-out scales with the appetite: the review set of
  each appetite is the `reviews` of `epic-delivery`'s workflow file. Its one-pass entries
  (`lenses`) are the one combined pass for TINY and SMALL. From MEDIUM the two grouped runs of
  `lenses` are the default; from LARGE up `risk_reviewers` names the five single lenses, run only
  on a recorded risk; the rule is in `epic-delivery` (the review sets). No lens changes what it
  checks, grouped or not. Where an
  entry has `ux`, an optional UX lens runs
  when screens changed: usability and accessibility of the changed screens. The UX lens is review
  only; designing screens is the UX designer's job at any size, per `epic-delivery`.

### Lenses

The analysis is partitioned into a fixed set of **five lenses**; **a run covers one lens or one group of lenses**.
A lens is **not a curated checklist** — it is a **region of the `cosmic-python` standard that the
subagent must traverse in full**. Together the five regions cover the whole standard (the catalogue
*and* the SKILL contract) with no overlap and no gap; no new ids are minted here.

| Lens | Catalogue/SKILL region it owns — **review every entry in the region**, the examples are not a limit |
|------|----------------------------------------------------------------------------------------------------|
| **L1 · Security & safety** | the security/safety surface: secrets & credentials, injection (command/SQL/XSS), the OWASP top-10, `BP-VALIDATE-AT-BOUNDARY`, `AP-DUP-VALIDATION`, and sensitive-data handling per `guardrails`. |
| **L2 · Spec correctness & tests** | conformance to the EPIC **requirements/specs** (not the plan) — acceptance criteria, edge/error scenarios, no undocumented divergence — **and** the whole `cosmic-python` testing contract (the per-layer test table in §"Rules", `BP-COVERAGE-PER-LAYER`, the testing checklist, Gherkin step defs) — **and** doc agreement: pages the diff changed, or that name a changed symbol, command, phase or file, agree with the code. |
| **L3 · Architecture conformance** | the `cosmic-python` structural contract in full: the four layers and the dependency law (§"Rules", the layer contract), component organisation (`PR-COMPONENT-FIRST`), interfaces and injection (`BP-ABC-INTERFACES`, `BP-INJECT-ADAPTERS`, `CC-DIP`), observability placement, **and every structural anti-pattern** (`AP-IO-IN-MODELS`, `AP-LOGIC-IN-EDGES`, `AP-CROSS-VARIANT-IMPORT`, `AP-PARALLEL-LAYOUTS`, cycles); **plus** each touched ADR's Confirmation — by its tool where one exists, by reading where not; an automatable Confirmation that is not automated is a finding — and any workaround of one of our own libraries (a finding: `epic-delivery`'s dependency rule forbids them). |
| **L4 · Principles & clean code** | the Clean Code + SOLID standard in full (the `CC-*` table of the catalogue except `CC-DIP`) **and every within-unit best-practice/anti-pattern** (`BP-DOMAIN-REVEALING-NAMES`, `BP-STRICT-BASE-MODEL`, `BP-CONSTANTS-ENUMS`/`-HOME`, `BP-EXCEPTIONS-MODULE`, `BP-IDIOMATIC-SMALL`; `AP-FREESTR-ANYLAYER`, `AP-DICT-AS-MODEL`, `AP-GENERIC-MODULE-NAMES`, `AP-EXCEPTIONS-EMBEDDED`). |
| **L5 · Fit, elegance & refactoring** | the reuse/compactness principles in full (`PR-SURVEY-FIRST`, `PR-REUSE-COMPACT`, `PR-SSOT-DRY`, `PR-CONFIG-DECOUPLED`) and the duplication/fragmentation anti-patterns (`AP-DUP-CONST`, `AP-MISPLACED-SHARED-INFRA`, `AP-OVER-FRAGMENTATION`, `AP-VERBATIM-EXTERNAL`), **plus** the forward-looking fit & refactoring investigation (new + touched code) with the blast radius taken from the brief. |

**Lens MECE boundaries** (so a finding lands under exactly one lens):
- **L3 vs L4** — L3 owns *cross-file/structural* rules (layer direction, cycles, layout, I/O-in-models,
  logic-in-edges); L4 owns *within-unit* code quality (SOLID, naming, free strings, dicts, exceptions,
  constants). A misplaced import is L3; a magic string is L4.
- **L4 vs L5** — L4 flags a *local* quality defect as-is; L5 owns *cross-file reuse/fit* and the
  *forward-looking refactoring*. "This name is unclear" is L4; "this duplicates the sibling, lift it" is L5.
  `CC-EXTRACT-THRESHOLD` is L4 within a unit and L5 across files.
- **L2 vs all** — L2 is the only lens that judges against the **requirements/specs** (correctness + the
  tests proving it); the others judge the code against principles regardless of requirements.

## Review procedure (per lens subagent)

The checklist **is the `cosmic-python` standard**, not a fixed list — so coverage is complete by
construction and survives catalogue growth. Every lens subagent runs the **same five-step procedure**,
scoped to its region:

1. **Scope in.** Open this lens's region — the catalogue
   (`cosmic-python`: principles and anti-patterns)
   filtered to the lens, plus the matching `cosmic-python` SKILL sections (see the Lenses table). The
   *region*, not a sample, is your checklist.
2. **Gather.** Read the diff (new + touched code), the EPIC requirements/specs, and the covering
   Gherkin. L2 also reads the stage's gate report instead of running the suite, and applies the T1
   consistency checks to it (the count against the tests added; exit 0 with failures listed; a file
   type with no gate); a mismatch, a missing or a red run is a finding. Outside an EPIC the caller
   supplies the gate report, or L2 runs the project's full gates. L2 checks doc agreement: every page the diff changed, and every page naming a
   symbol, command, phase or file the diff changed, agrees with the code.
3. **Traverse exhaustively.** Walk **every** principle (`PR-*`), best-practice (`BP-*`), and
   anti-pattern (`AP-*`) in the region against the changed code, and the clean-code entries (`CC-*`)
   where the lens owns them; also apply the cosmic-python SKILL's "Before you hand over" check. Do
   not stop at "found one" — the standard is checked in full.
4. **Blast radius.** Take the upstream impact result from the brief (the lead ran it at stage start,
   at most ten lines per task) and flag HIGH/CRITICAL. A lens runs no GitNexus tool. *(L5 lists each
   refactor candidate's blast radius from that result, or asks the lead for one run.)* With no result
   in the brief, say the blast radius was not computed and proceed.
5. **Emit.** Report findings citing the catalogue **entry id**, by priority (Output format below);
   stay silent on entries that pass. **L5 additionally** proposes how the new code and the existing
   code it touches could be refactored toward a crisper, more elegant, effective fit —
   **recommendations only, the review never edits code**.

## Output format

Each run reports its own findings; a full standalone review **aggregates the runs** (two, or five for
the deep review) into one report. Tag each finding with its **lens** (L1–L5), also in a grouped run. Report by priority, each finding with
**file:line**, **what**, **why** (name the principle/id), **how to fix**:
- **Critical** — breaks functionality, security, or architecture boundaries (must fix before merge).
- **Warnings** — quality issues, missing non-critical coverage, naming.
- **Suggestions** — non-blocking improvements (includes L5 refactoring recommendations with blast radius).

## Boundary & Related Skills

**Owns:** the two modes (standalone grouped runs / interactive main-thread), the **dispatch
contract** (two grouped runs in parallel by default, five single lenses as the deep review), the five lens **regions** + MECE
boundaries, the L2 doc-agreement criterion, the **methodical per-lens procedure** (traverse the whole region), and the report format.
**Does NOT** own the rules themselves (the `cosmic-python` catalogue is the checklist — cite, never
restate), perform the run (external `code-review` / `code-reviewer` wrapper), or fix code (the
`implementer` applies accepted fixes). The fit & refactoring investigation is **recommendations-only**.
**Related:** `cosmic-python`, `guardrails`, `meaningfy-git-workflow`, `epic-delivery` (scales the review to the EPIC's size), external `code-review`, `superpowers:requesting-code-review`, `superpowers:receiving-code-review`.

Answers `VAL, VER, ADQ, ROB, CLR, RSK` in `test-strategy`'s matrix (`references/software.md`, `references/documentation.md`, `references/ui.md`, `references/architecture.md`).
