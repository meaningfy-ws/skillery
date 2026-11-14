# Acceptance record: test-strategy

## Scenario sign-off (task 1.0)

- **What was signed off:** the spec scenarios of this change, in `specs/test-strategy`,
  `specs/epic-delivery`, `specs/workflow-definitions`, `specs/code-principles-governance` and
  `specs/catalogue-governance`, as pushed on branch `docs/shape-test-hardening`.
- **Who:** the developer (the repository owner).
- **When:** 2026-11-13.
- **Verdict, in the developer's words:** "A scenarios seem okay".

The `accepted` matrix status was added to the `test-strategy` spec the same day, before this
sign-off.

## Acceptance demo (task 2.7)

- **When:** 2026-11-14, after both stages were merged (PR #218, PR #222).
- **Who:** the developer (the repository owner).
- **Verdict, in the developer's words:** "acceptance of the EPIC test-strategy - yes fine".

**What was shown**

1. *A LinkedIn post taken through the loop* (the Quick Start of `skills/test-strategy/SKILL.md`).
   Success and failure were stated before drafting: a cold reader given only the post says in one
   sentence what the service does; it fails if the reader cannot, or the check flags an advert. The
   checks came from `references/generic-writing.md` and `references/cross-cutting.md`:
   - `CLR`, CHK-33 cold reader: a fresh agent given only the post named the service in one
     sentence and judged the post "mainly information". Pass. The developer: "probably okay".
   - `VER`, CHK-112 `rulebook check`: exit 0, with no check rule in force for writing, so the
     pass proves little. The developer: "likely fine".
   - `VAL`, the owner approves the stated success: a `gap` row (EPIC D); the developer judged it
     at this demo.
   - Not run: the writing-antipatterns checks (CHK-86, CHK-103).
2. *A finding without a criterion.* The cold reader listed "SHACL", "RDF data", "shapes" and
   "linked data" as unexplained. No criterion agreed before drafting covered jargon, so it was
   recorded as an opinion, not a failed test. The developer declined a fixed jargon criterion:
   "we don't need such sample/test because it will depend on each post based on its intention,
   defined audience"; jargon "must be flagged but not necessarily it is a bad thing, it must be
   adjusted to the register and to the message goal, and audience". This is an input for
   `generic-task-test-profiles` (EPIC D).
3. *A workflow phase's criteria.* The `decide` phase of `epic-shaping.workflow.json` with its
   `criteria`, and the `workflow_criteria` lint naming the file and the phase once the key was
   removed from a scratch copy. The developer: "likely fine".

**Against the four proofs of DEC-12:** the matrix covers the inventory (a test); one home per fact
(a test); a non-code activity uses the skill (shown); the triggers rest on the static probes, and
the behavioural run is deferred to `evaluate-catalogue` task 6b.1 (design D-13).

**Follow-up:** issue #225, three workflow gates that disagree with their owning skill (design D-16).
