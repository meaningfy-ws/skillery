# The spine — a capability, not a bundle

The **spine** (*the durable, traceable spec backbone*) is **not** a marketplace bundle you install.
It is two things working together:

1. **A capability** — the lifecycle-driving skills, all shipped in the **`meaningfy-building`**
   bundle: [`epic-planning`](../skills/epic-planning/SKILL.md) (shape the EPIC + derive the PLAN),
   [`spec-stewardship`](../skills/spec-stewardship/SKILL.md) (archive, groom `specs/`, keep the
   orientation index honest), [`clarity-gate`](../skills/clarity-gate/SKILL.md) (the semantic gate),
   [`bdd-gherkin`](../skills/bdd-gherkin/SKILL.md) (executable acceptance), and
   [`meaningfy-code-review`](../skills/meaningfy-code-review/SKILL.md) (the verify step), with
   [`cosmic-python`](../skills/cosmic-python/SKILL.md) for layered implementation.

2. **Projected assets** — the live OpenSpec instance + the forked `meaningfy` schema (under
   [`../openspec/`](../openspec)) and these `spine/` convention docs. These are **projected into a
   target repo by the [`project-setup`](../skills/project-setup/SKILL.md) skill**, not installed as a
   skill.

So: *install `meaningfy-building` to get the skills; run `project-setup` to lay the spine assets into
your repo.* There is no `meaningfy-spine` plugin.

## Why it stopped being a bundle

The earlier `meaningfy-spine` "meta-bundle" re-listed skills that already lived in other bundles — a
confusing overlay. With role bundles ([`../README.md`](../README.md)), the spine's skills live in
`meaningfy-building` and the spine's *assets* are a projection concern, so the overlay is gone.

See [`README.md`](README.md) for the spine's conventions and [`workflows.md`](workflows.md) for the
`/opsx` build loop.
