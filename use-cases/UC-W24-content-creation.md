---
id: UC-W24
title: Content creation for LinkedIn and blogs
primary_actor: the owner
trigger: a LinkedIn post, blog article or other public text about Meaningfy's work is due
success_guarantee: the text is published in the Meaningfy voice, fitted to its channel and audience
area: business
served_by:
  agents: []
  skills:
  - technical-writing
  - explanatory-writing
  - writing-antipatterns
  - meaningfy-voice
status: partial
change: add-content-creation
---

# UC-W24 Content creation for LinkedIn and blogs

## Brief Description

Content creation: LinkedIn posts, blogs and other public text explaining what Meaningfy does and why. The writing skills and the default voice exist; the per-channel voice profiles and an agent do not.

## Stakeholders and Interests

- **The owner:** a text that says what Meaningfy does and why, in its own voice, without writing it
  from scratch each time.
- **The readers (clients, partners, peers, candidates):** a clear point, a concrete example, no
  marketing fog.
- **The team:** public text consistent with what the company actually delivers.

## Preconditions

The owner has a topic and a point to make, and names the channel (LinkedIn, blog or another). The
default voice in `meaningfy-voice` is available.

## Minimal Guarantees

Nothing is published or posted by the agent; a draft that cannot be grounded in Meaningfy's real
work says so instead of inventing claims.

## Main Success Scenario

1. The owner gives the topic, the point, the channel and the audience.
2. The agent returns the questions that ground the text: the example, the evidence, the call to
   action.
3. **[human]** The owner answers them.
4. The agent drafts the text in the register and channel profile `meaningfy-voice` sets, with the
   craft of `explanatory-writing`.
5. The agent checks the draft against `writing-antipatterns` for its genre and revises it.
6. The agent returns the draft with a short note of what it assumed.
7. **[human]** The owner edits, approves and publishes the text.

## Extensions

- 1a. The owner has only a loose idea: the agent returns two or three angles with a one-line
  point each, and the owner picks one (back to 1).
- 3a. A claim cannot be grounded (no client case, no figure): the agent drops it or marks it for
  the owner to confirm.
- 4a. The channel has no profile yet: the agent follows the default profile, and says so.
- 4b. The text mentions a client or a project: the agent flags it for the owner's consent before
  publishing.
- 7a. The owner rewrites much of the draft: the rewrite is kept as a voice sample for that channel.

## Out of Scope

Internal messages and briefings (UC-W15), graphics and visuals for the post (UC-W17), proposals and
offers to a client (UC-W8), and publishing or scheduling on any platform.

## Artefacts

- The draft text (Markdown) in the owner's working folder or vault, read by the owner before
  publishing.
- The per-channel voice profiles in `skills/meaningfy-voice/references/channels/` (`linkedin.md`,
  `blog.md`); placeholders today, planned (`add-content-creation`).
- Planned: the voice samples per channel and audience the profiles are written from
  (`add-content-creation`).

## Evidence

- Today: the trigger probes for `technical-writing`, `explanatory-writing` and `meaningfy-voice` in
  `tests/trigger_probes.yaml`, run by `make validate`.
- Planned: a Gherkin feature for the content agent under `tests/features/agents/`
  (`add-content-creation`).
- Planned: an outcome suite for the core writing skills (`evaluate-catalogue`).

## Feedback Loop

The owner's edits to a draft are the signal: a recurring edit becomes a rule in the channel
profile, and a draft that broke the voice becomes a Defect issue
(`.github/ISSUE_TEMPLATE/defect.yml`) against `meaningfy-voice` or `explanatory-writing`. How the
edits are captured is not decided.

## Slices

1. Write in the default Meaningfy voice with explanatory craft: released (`technical-writing`,
   `explanatory-writing`, `writing-antipatterns`, `meaningfy-voice` in `meaningfy-core`).
2. Per-channel voice profiles (LinkedIn, blog): planned (`add-content-creation`).
3. A content agent that interviews and drafts: planned (`add-content-creation`).

## Open Points

**Confidence:** low. The steps are a first guess from a one-line brief; no change is shaped yet, and
the channel profiles are placeholders.

- Which samples define the LinkedIn and blog voices, and for which audiences?
- Which other channels count as "other public text" (newsletter, website, conference abstracts)?
- May a post name a client or a project, and who gives that consent?
- Does the agent also propose what to write about, or only write what the owner chooses?

## Notes and Business Rules

- Area `business`: the company speaking for itself, like UC-W15, not selling a given offer.
