---
name: meaningfy-voice
description: The Meaningfy company voice profile — British English, no em dash, plain current vocabulary, honest and direct, the SMILE values, and the register rule (teach, persuade, bind). Use when a skill names `meaningfy-voice`, or when produced prose must sound like Meaningfy. Trigger on "write this in the Meaningfy voice", "is this on-voice", "which register applies", "check the tone against our voice". Holds the profile only; for message structure use executive-communication, for explanatory craft use explanatory-writing.
license: Apache 2.0
metadata:
  purpose: content
  area: cross-cutting
  subject: generic
  posture: precise
  stage: any
  maturity: stable
---

# Meaningfy Voice

A foundation skill: it holds one resource and no method.
[`references/company-voice.md`](references/company-voice.md) is the default voice for every produced
artefact (wording and tone, never structure), with the register rule that picks technical/educational,
persuasive or bind wording.

Load the profile when a skill that writes for Meaningfy names this skill, or when a text must be
checked for voice. The profile is the only place the voice is stated; other skills cite it by name.
Per-channel profiles live in `references/channels/`: outreach email is written; LinkedIn, blog,
offer and internal message are placeholders that point back to the default profile.

## Boundary & Related Skills

**Owns:** the company voice profile and the register selection rule.

**Does NOT own:** message structure (`executive-communication`), explanatory craft
(`explanatory-writing`), doc placement and form (`technical-writing`), or the genre-conditional
antipatterns (`writing-antipatterns`).

**Related:** `executive-communication`, `explanatory-writing`, `writing-antipatterns`, `vault-daily`, `sales-conversations` (applies the outreach-email channel).
