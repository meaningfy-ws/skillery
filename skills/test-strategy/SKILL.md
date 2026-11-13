---
name: test-strategy
description: Use this skill to decide which check answers which question, and how work in any activity (code, docs, a post, an offer, a contract, a model) succeeds or fails — "how do we know this succeeded or failed", "which checks does this need before I publish it", "difference between verification and validation". Owns the loop, the definition of a test, the six questions, the five stances and the matrix. Not for how to write the test - a unit test first (superpowers test-driven-development), evidence before claiming done (verification-before-completion), Gherkin (bdd-gherkin), scoring a spec (clarity-gate), a cold reader (technical-writing), reviewing a change (meaningfy-code-review).
license: Apache 2.0
metadata:
  purpose: quality
  area: cross-cutting
  subject: generic
  posture: profiled
  stage: any
  maturity: experimental
---

# Test Strategy

**First rule: for each activity we execute, we know when and how we fail and how we succeed, before
we start.** A module, a LinkedIn post, an offer and a contract clause all begin with two lines: what
success looks like, what failure looks like. This skill owns that discipline; the techniques that
check the work stay with the skills that own them.

## Quick Start

Input: "write a LinkedIn post announcing our new SHACL service."

1. **State success and failure first.** Succeeds: a data engineer who has never heard of us
   understands what the service does and clicks through. Fails: it reads as an advert, or as jargon.
2. **Take the checks from the matrix.** Open
   [`references/generic-writing.md`](references/generic-writing.md) and
   [`references/cross-cutting.md`](references/cross-cutting.md):
   - `CLR`, can a stranger act on it: the cold reader, CHK-33 (`technical-writing`).
   - `CLR`, genre defects: the writing antipatterns, CHK-86 and CHK-103 (`writing-antipatterns`).
   - `VER`, house rules: `rulebook check`, CHK-112 (`rulebook`).
   - `VAL`, is it the right post: the owner approves the stated success before drafting. This row is a
     `gap` (no check yet), so say so and keep the criterion anyway.
3. **Draft, run the checks.** A failed criterion goes back to the draft, never to the post as a
   patch. Repeat until every criterion passes, or the owner accepts the miss.

## The loop

1. **State** how the work succeeds and how it fails, before doing it.
2. **Do** the work.
3. **Challenge** it against those criteria, with the checks the matrix names.
4. **Decide:** pass, fail, or accept the miss. A person decides every `VAL` result.
5. **Revise** the work, not the criteria. Change a criterion only by going back to step 1.

## What a test is

A test is a criterion agreed before the work, a pass or fail result, and its evidence. "The cold
reader finishes the how-to without asking a question" is a test. "This section feels weak" is not:
turn it into a criterion ("a reader cannot find the install step in under a minute") or record it as
an opinion. A finding without a criterion is never a failed test.

## Verification and validation

Verification asks "did we build it right?": each artefact against its own specification, mostly by
agents. Validation asks "did we build the right thing?": each artefact against the need one level up;
it always ends with a person, and an agent never marks it done. Green gates prove verification only.
When and who run each in an epic delivery stays with `epic-delivery`.

## The six questions

| Id | Question | Example in a code change | Example in a post |
|---|---|---|---|
| `VAL` | Are we building the right thing? | the developer runs the use case | the owner approves the stated success |
| `VER` | Are we building it right? | the tests and gates pass | house rules pass |
| `ADQ` | Are the checks representative, and do they bite? | the test fails when the code is broken | none yet (a gap) |
| `ROB` | Does it hold at the edges and under attack? | a property test on odd inputs | none yet (a gap) |
| `CLR` | Can its reader act on it? | the docs page works for a cold reader | a stranger understands the post |
| `RSK` | What outside the work can go wrong? | a dependency or secret is exposed | a claim a client could hold against us |

## The five stances

A stance is the point of view a reviewer or a brief takes. Each asks its own questions:

| Stance | Asks | Note |
|---|---|---|
| verifier | `VER` | against the specification |
| validator | `VAL` | prepares the evidence; a person decides |
| adversary | `ROB`, `RSK` | tries to break the work |
| cold reader | `CLR` | has only the page |
| checker | `ADQ` | a fresh agent that did not build or test the work |

A review lens or a brief takes a stance; it does not become one. The brief stays with
`epic-delivery` and the dispatch mechanics with `guardrails`.

## Reading the matrix

One file per activity family, each a table. Start from the family of the work, then the question.

| File | Family |
|---|---|
| [`software.md`](references/software.md) | code, tests, projects, delivery |
| [`documentation.md`](references/documentation.md) | project and user documentation |
| [`devops.md`](references/devops.md) | environments, CI/CD, operations |
| [`ui.md`](references/ui.md) | user interfaces |
| [`shaping.md`](references/shaping.md) | EPICs, plans, specifications |
| [`modelling.md`](references/modelling.md) | domain and data models |
| [`architecture.md`](references/architecture.md) | system design and its records |
| [`generic-writing.md`](references/generic-writing.md) | posts, offers, contracts, sales, notes |
| [`cross-cutting.md`](references/cross-cutting.md) | checks that apply to every family |

[`inventory.md`](references/inventory.md) defines every check once, as `CHK-<n>`; the family files
cite it. Columns: question, check, technique owner, tool, moment, decided by, status.
Status is `exists`, `gap` (no check yet; it names the EPIC expected to fill it, or "none yet") or
`accepted` (a gap the developer chose to leave open, with the reason).

On a gap, say so, state the criterion anyway, and let a person judge it. Never invent a technique to
fill a row.

## Gotchas

- Criteria written after the work. They then describe what was built, not what was needed.
- A passing check taken as a pass on the question. CHK-112 passing says `VER` holds, not `VAL`.
- A `VAL` row marked done by an agent. A person decides it.
- Copying a technique's steps into a brief or a family file. Cite the owning skill instead.
- Revising the criterion to fit the draft. Revise the draft.

## Boundary & Related Skills

**Owns:** the loop; the definition of a test; the definition of verification and validation; the six
questions; the five stances; the matrix and its inventory (which check answers which question, for
which activity).

**Does NOT own / Delegates:** each technique stays with the skill the matrix names (the cold reader
and `technical-writing`, the clarity gate and `clarity-gate`, Gherkin and `bdd-gherkin`, the Python
testing checklist and `cosmic-python`, the test-first loop and `superpowers:test-driven-development`,
evidence before a claim and `superpowers:verification-before-completion`). When and who run a check
stay with the workflow files and `epic-delivery`; the four-eyes rule and subagent dispatch stay with
`guardrails`.

**Related:** `epic-delivery`, `guardrails`, `clarity-gate`, `bdd-gherkin`, `technical-writing`,
`writing-antipatterns`, `rulebook`, `cosmic-python`, `meaningfy-code-review`.
