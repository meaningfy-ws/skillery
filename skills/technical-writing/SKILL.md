---
name: technical-writing
description: Produce clear documentation, explanations, summaries, and docstrings — AsciiDoc/Antora or Markdown — with a lightweight clarity check. Use to write or improve project docs, explain how a module works, summarise an area, or add docstrings. Trigger on "document this", "write docs/README", "explain how X works", "add docstrings", "summarise this module".
license: Apache 2.0
metadata:
  purpose: content
  area: cross-cutting
  subject: generic
  posture: reusable
  stage: any
  maturity: stable
---

# Technical Writing

## Overview

Clear, concise documentation, explanations, and summaries. Aligns with the project's
established terminology (read `MEMORY.md` and existing docs first).

## What you produce

- **Code explanations** for onboarding/knowledge transfer (suggest a stronger model for deep
  architectural analysis).
- **Summaries** of modules, epics, or areas.
- **Docstrings** — Google style unless the project uses another convention (check existing code).
- **Documentation pages** — AsciiDoc (Antora) or Markdown for `docs/`.
- **README updates.**

## Clarity check (apply to everything you write)

Apply the **lightweight clarity check owned by `clarity-gate`**
(actionable · current · specific references · single-source). It is defined there; this skill
*applies* it to prose and does not restate the criteria. The full 13-item gate (for specs) also
lives in `clarity-gate`.

## The cold reader (how-to and tutorial pages)

Running a page's snippets verifies that they work. The cold reader validates that a reader can use
the page. Give a fresh agent only the published page, with no other context, and have it carry out
what the page says. Where it gets stuck, fix the page. When it runs in a delivery is
`epic-delivery`'s.

## The documentation workflow

The workflow is the file `assets/workflows/documentation.workflow.json`; loading this skill starts
it. In an epic session it is the docs stage, after acceptance and before archive (`epic-delivery`
owns the order). It runs when the EPIC changed a use case, the architecture, installation or
user-facing behaviour; otherwise the lead writes "no docs owed" in `evidence/docs-owed.md` and
archives without loading this skill. It also runs on demand, without a change. It ends in one PR,
reviewed with the appetite's review set.

| Phase | What happens | Evidence |
|---|---|---|
| inventory | List the pages owed: missing, false, stale | `evidence/docs-owed.md` |
| write | Write them; architecture pages go through `architecture`'s method | the pages |
| verify | Run the snippets and the project's docs gate | the gate's output |
| cold-read | Run the cold reader on the task-oriented pages | `evidence/cold-read.md` |
| publish | Open the PR | the PR |

- **Documents covered:** the manuals (user, installation, developer) and the architecture pages.
- **Architecture pages:** bring the C4 views and the architecture index page to as built, and link
  each ADR to the change that implemented it. Never change an ADR's status or take a new decision.
  A fact that contradicts an ADR goes to the lead as a finding; the page is not edited to match.
- **Which check a page gets:** how-to, tutorial and manual pages get the cold reader; explanation
  and reference pages get the lightweight clarity check.
- **Load order:** load this skill before writing `docs-owed.md`, so the workflow sees the file.

## Writing style

- Direct language, no fluff. Prefer tables and lists over long prose.
- Code examples where they clarify; file:line references when explaining code.
- AsciiDoc: follow Antora conventions (`docs/antora.yml`, `docs/antora-playbook.yml`).
- Markdown: standard GitHub-flavored.

### Explanation sub-mode

The defaults above suit Reference and How-to docs. When the page is a Diátaxis **Explanation** (an
explainer, a "how X works" narrative, broad-audience teaching prose), borrow the texture craft from
`explanatory-writing` — one controlling metaphor, a concrete
example beside every abstract claim, self-answered question pivots. The terse/tables default still
governs Reference and How-to output.

## Boundary & Related Skills

**Owns:** documentation, explanations, summaries, docstrings. **Does NOT** plan (`epic-planning`),
run the full clarity gate (`clarity-gate`), or write/modify production code or tests.
**Related:** `clarity-gate` (full gate), `epic-planning`, `epic-delivery` (when the cold reader runs), `explanatory-writing` (Explanation-quadrant texture), `writing-antipatterns` (genre-conditional failure modes for Tutorial/How-to/Reference), `executive-communication` (answer-first structure when a document carries a recommendation).
