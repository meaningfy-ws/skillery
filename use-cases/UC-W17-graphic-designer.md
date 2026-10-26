---
id: UC-W17
title: Graphic designer
primary_actor: a Meaningfy colleague who needs a visual
trigger: a post, document, slide deck, brochure or offer needs a visual
success_guarantee: the visual exists in Meaningfy style, fitted to its purpose, in the requested tool
area: design
served_by:
  agents: []
  skills: []
status: missing
change: add-visual-design
---

# UC-W17 Graphic designer

## Brief Description

Graphic designer: consistently beautiful graphics in Meaningfy style, fitted to the purpose (LinkedIn and blog posts, generated pictures, documentation diagrams, concept/commercial/explanatory slides, brochures, offer and pitch visuals) in draw.io, Miro, Canva, Mermaid.

## Stakeholders and Interests

- **The colleague:** a visual that fits its purpose without a design round of its own.
- **The audience (readers, clients, followers):** a visual that is clear and readable.
- **The company:** one recognisable Meaningfy style in everything it shows.

## Preconditions

The brand guide is in hand (colours, type, logo, image style). The connector or tool for the requested
output is available.

## Minimal Guarantees

Nothing is published by the agent. A visual that breaks the brand guide is returned with the breach
named, not passed off as on-style.

## Main Success Scenario

1. The colleague names the purpose (a post, a documentation diagram, a slide, a brochure, an offer or
   pitch visual), the content and the tool.
2. The agent asks for what is missing: the audience, the format and the one message.
3. The agent proposes a concept in Meaningfy style.
4. **[human]** The colleague picks or amends the concept.
5. The agent produces the visual in the requested tool (draw.io, Miro, Canva, Mermaid, or a generated
   picture).
6. The agent checks it against the brand guide and for readability.
7. **[human]** The colleague accepts the visual and uses it.

## Extensions

- 1a. No tool named: the agent asks; it does not choose for the colleague.
- 5a. The tool's connector is not available: the agent says which one is missing and returns the
  concept as a description.
- 6a. The check fails: the agent fixes the visual and checks again, or names what it could not fix.

## Out of Scope

The words of a post (UC-W24), the narrative of a slide deck (`executive-communication`), proposal
content (UC-W8), and the content of architecture diagrams (UC-W19).

## Artefacts

- Planned: the visual in its tool (a Mermaid source, a draw.io file, a Miro board, a Canva design or an
  image file), read by the colleague and the audience (`add-visual-design`).
- Planned: the brand and visual design skill in the `meaningfy-design` bundle (`add-visual-design`).

## Evidence

Planned: `tests/features/agents/graphic-designer.feature` and a brand check on sample outputs
(`add-visual-design`).

## Feedback Loop

A visual the colleague rejected or redrew becomes a Defect issue; it ends as a rule in the brand skill
or a worked example. Accepted visuals are kept as examples.

## Slices

1. The brand guide as a skill: planned (`add-visual-design`).
2. Documentation diagrams (Mermaid, draw.io): planned (`add-visual-design`).
3. Posts, slides, brochures and offer visuals (Canva, Miro, generated pictures): planned
   (`add-visual-design`).

## Open Points

**Confidence:** low. The brief lists purposes and tools; the brand guide and design examples are not
in hand.

- Where is the brand guide today, and is it complete enough to check against?
- Which purposes and tools come first?
- Who approves a visual before external use?
