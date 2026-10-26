# How a use case is written here

A use case in [`use-cases/`](../../use-cases/) states one goal the catalogue serves, from the point of
view of the person who has it. It is a White use case in the Cockburn convention that the
`architecture` skill teaches, extended for a catalogue of skills and agents: an agent is accountable
for an artefact, for the evidence that it worked, and for learning from a miss. The extension follows
Use-Case 2.0 (Jacobson): a use case is delivered in **slices**, each with its own tests, which is how
a use case can be partly released while the rest is still work in progress.

Why the extra sections: the Cockburn core says *what goal* is served; it does not say *what comes
out*, *how we know it worked* or *how it gets better*. Those three are what make an agent testable
(its Gherkin is derived from the Main Success Scenario, Extensions and Evidence) and what keep it
honest after release.

## Frontmatter

`id`, `title`, `primary_actor`, `trigger`, `success_guarantee`, `area`, `served_by`, `status` and,
while `partial` or `missing`, `change` (checked by `use_case_catalogue` and
`use_case_changes_registered`).

## Sections, in this order

| Section | What it holds |
|---|---|
| Brief Description | the goal and its value in a few sentences, in the owner's words where possible |
| Stakeholders and Interests | each party affected and what they need from the outcome |
| Preconditions | what must hold before the use case starts: inputs, access, memory |
| Minimal Guarantees | what holds even when it fails: nothing sent, nothing lost, nothing half-written |
| Main Success Scenario | numbered steps, actor first; mark each step where the human decides with **[human]** |
| Extensions | step-keyed alternatives and failures (`2a.`, `4b.`): what happens, where it returns |
| Out of Scope | what this use case deliberately does not do, and who does |
| Artefacts | each output: its form, where it lives (repo, vault, Odoo, Overleaf…) and who reads it |
| Evidence | how success is shown: the Gherkin feature, the eval suite, the check on the artefact; "planned" until it exists |
| Feedback Loop | how a miss is noticed and becomes a fix (an issue, a probe, a skill change, a memory update) |
| Slices | the increments that deliver the use case; each says released (its skills and agents are in a bundle) or planned (its change) |
| Open Points | `**Confidence:** high, medium or low` with the reason, then the questions only the owner can answer |

Every section is present (`use_case_catalogue` checks the headings). A section with nothing to say
yet says so in one line ("None known yet.") rather than disappearing, so a reader sees the gap.

## Rules of thumb

- Write the steps at the level of *what* the actor and the agent do, never *how* a tool is called.
- A step that needs consent (send, publish, commit, pay, sign) is a **[human]** step.
- Artefacts and Evidence name real paths when they exist and say "planned" when they do not.
- Confidence is about the text, not the feature: **high** when it restates decisions already taken,
  **medium** when it extrapolates from the brief and the catalogue, **low** when it is a first guess
  the owner has to extend.
