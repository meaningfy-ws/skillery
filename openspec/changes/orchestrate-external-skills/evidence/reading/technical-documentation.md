# Reading: technical-documentation
Fork `meaningfy-ws/wondel-ai-skills` at `c5265583b1a9740f06831e1d3e89b35bba3eb430`, read in full on 2026-11-16 by reader G.

| File | Bytes | What it adds |
|---|---|---|
| `SKILL.md` | 21,757 | Frontmatter and the frame from Google's developer style guide: reader and page type, voice, sentences and words, structure, procedures and code, reference text, changelogs, the audit, rewrite and write protocol with a fixed audit output, a 10-row score with a separate ship gate. |
| `references/document-types.md` | 11,804 | Five page types (tutorial, how-to, concept, reference, README) by the reader's question, audience and scope statements, prerequisites and closing sections, page skeletons, paragraph rules, self-editing and organising a doc set, a split worked example. |
| `references/structure-and-formatting.md` | 14,151 | Rules S1-S12: heading case and form, lists, tables, notices, cross-references, link text, images and alt text, numbers and dates, text formatting, with a worked example. |
| `references/voice-and-words.md` | 16,628 | Rules V1-V10 and W1-W8: second person, active voice, present tense, banned softeners, anthropomorphism, timeless wording, contractions, inclusive and global language, sentence order, abbreviations, modal verbs, jargon, a word list, American spelling and the serial comma. |
| `references/procedures-and-code.md` | 14,321 | Rules P1-P11: numbered steps, UI and device verbs, code in prose, sample code quality, upper-case placeholders, command syntax, and verifying every fact against code before style. |
| `references/api-reference.md` | 19,451 | Rules A1-A7: what to document, opening verbs by method kind, parameters, returns and exceptions, deprecations, a full TypeScript and Python example, reference voice, CLI help and REST endpoint pages. |
| `references/release-notes.md` | 18,196 | Rules N1-N6: who reads a changelog, the Keep a Changelog layout, the entry pattern, breaking changes, deprecations, the language layer on entries, release notes compared with a changelog, and a migration guide skeleton. |
| `references/audit-checklist.md` | 19,521 | The 60-rule table with severities, the severity rubric and ship gate, scoring mechanics, how to find a local style guide, non-English handling, a Vale setup with the Google package and a worked mini-audit. |

Total read: 135,829 bytes.

## Goals it serves
Making a single developer page right for its reader: choosing the page type, writing numbered
steps that can be followed, code samples and placeholders, API reference entries and docstrings,
CLI help, a migration guide, and auditing a page with a severity-ordered list of findings. Its
strongest parts are fact verification against code, procedure mechanics and reference wording.
Meaningfy's voice is the style source and this skill is guidance only (DEC-20): it never sets
spelling, contractions, dashes or tone, and its score is not a Meaningfy gate. It is not for doc
placement, the documentation workflow or the cold reader (`technical-writing`), not for
Explanation texture (`explanatory-writing`), and not for producing a release changelog
(`meaningfy-release`, rule P-0001).

## Conflicts with Meaningfy rules
| # | Their advice (file, heading, line) | The Meaningfy rule it meets (owner skill) | Named in DEC-7, DEC-19 or DEC-20? |
|---|---|---|---|
| 1 | American spelling as a rule, with month-first dates and 12-hour times as valid forms (`references/voice-and-words.md`, "American spelling and serial comma", lines 277-290; `references/structure-and-formatting.md`, "Numbers, dates, and units", line 258; `SKILL.md`, "Quick Diagnostic", line 219). | British English, fixed in every register (`meaningfy-voice`, `references/company-voice.md`, line 15). | DEC-7 and DEC-20 |
| 2 | Contractions preferred, a negation written short rather than in full (`references/voice-and-words.md`, "Contractions [EN] (V8)", lines 111-124; `SKILL.md`, "2. Voice", line 59). | No contractions in the bind register (`meaningfy-voice`, `references/company-voice.md`, line 67). | DEC-7 and DEC-20 |
| 3 | Its examples and its own audit output template use em dashes (`SKILL.md`, "8. Running the Audit", line 182; `references/api-reference.md`, "What to document (A1)", line 40; `references/voice-and-words.md`, "Jargon (W6)", line 227). | No em dash (`meaningfy-voice`, `references/company-voice.md`, line 16). | DEC-7 and DEC-20 |
| 4 | Style precedence: a project guide first, then Google, Merriam-Webster, Chicago and Microsoft; the local guide is looked for only in named files (`CONTRIBUTING.md`, `STYLE.md`, `.vale.ini` and similar), and when none is found the report states that Google applies (`SKILL.md`, "Core Principle", lines 18-19; "8. Running the Audit", lines 172 and 185; `references/audit-checklist.md`, "Finding a local style guide first", lines 174-198). Meaningfy's voice lives in a skill, so the search would miss it. | Meaningfy's voice is the style source for documentation (`meaningfy-voice`). | DEC-20 |
| 5 | Automates the English layer with Vale and the Google package (`references/audit-checklist.md`, "Automating the [EN] layer with Vale", lines 216-235; `SKILL.md`, line 172). | The check is the Vale rules of `activity-test-profiles` (the reviewer until they exist). | DEC-20 |
| 6 | Its own 10-row score, severity rubric and ship verdict, and an audit format it must always use (`SKILL.md`, "Scoring", lines 23-25, and "8. Running the Audit", lines 178-190; `references/audit-checklist.md`, lines 132-170). | A page gets the lightweight clarity check owned by `clarity-gate`, and a task page gets the cold reader (`technical-writing`, `SKILL.md`, lines 59-71); this skill is guidance only. | DEC-20 |
| 7 | Tone: conversational without levity, no "we" for the reader, idioms and culture-bound comparisons cut (`SKILL.md`, "Core Principle", line 16; `references/voice-and-words.md`, "Second person (V1)", lines 15-29, and "Global audience (V10)", lines 148-154). | The technical register lands domain words with an analogy or example and allows an occasional rhetorical question or aside (`meaningfy-voice`, `references/company-voice.md`, lines 22-24 and 48-55); Explanation pages borrow one controlling metaphor (`technical-writing`, `SKILL.md`, lines 100-106). | DEC-20 |
| 8 | Its protocol: intake, local conventions, cold read by the writer, fact check, rules by severity, then the full rewritten page and a change-log table (`SKILL.md`, "8. Running the Audit", lines 166-176). | The documentation workflow: inventory of pages owed, write, verify by running the snippets and the docs gate, cold read by a fresh agent, one PR with evidence files (`technical-writing`, `SKILL.md`, lines 73-91). | not named |
| 9 | Its own five-type taxonomy, with README as a type and "concept" in place of Explanation; its worked split puts the payload reference fields on the concept page (`references/document-types.md`, "Choose the Document Type", lines 9-17; "Worked Example", lines 199-203). | Diátaxis: Explanation, How-to, Reference and Tutorial kept apart (`technical-writing`, `SKILL.md`, lines 100-106; `writing-antipatterns`, outside the list). | not named |
| 10 | Markdown only: description lists in Markdown Extra or Pandoc syntax, preferred over two-column tables (`references/structure-and-formatting.md`, "S5", lines 135-143; `SKILL.md`, "4. Structure", line 95); AsciiDoc and Antora are never covered. | AsciiDoc (Antora) or GitHub-flavoured Markdown; tables and lists preferred over prose (`technical-writing`, `SKILL.md`, lines 56, 95-98). | not named |
| 11 | Never pasting commit messages into a changelog, and writing each entry by hand with the change (`references/release-notes.md`, "Who reads a changelog, and when", lines 26 and 48; "Writing an entry (N3)", line 187; `SKILL.md`, "7. Release Notes", line 155). | release-please builds the CHANGELOG from Conventional Commits and a human adds breaking-change callouts and migration steps (`meaningfy-release`, outside the list, `SKILL.md`, lines 72-75 and 81-82), and release work runs through it (rule P-0001 in `docs/rules/`). | not named |

Checked and not counted: Google-style docstrings (`references/api-reference.md`, lines 262-281)
agree with `technical-writing` (`SKILL.md`, line 55); the Keep a Changelog layout
(`references/release-notes.md`, lines 52-134) is the one `meaningfy-release` uses (`SKILL.md`,
line 72); verifying every command against code (`references/procedures-and-code.md`, "Verify Facts
Before Style", lines 234-249) agrees with the verify phase of `technical-writing`. Upper-case
placeholders (`references/procedures-and-code.md`, "Placeholders (P8)", lines 171-194) differ from
skillery's `<id>` form, but the fork itself yields to a consistent local form
(`references/audit-checklist.md`, line 191). No Meaningfy rule sets the serial comma or heading
case. The "we" in `meaningfy-voice`'s before and after pairs is in the executive register, not in
documentation.

## Trigger overlap
`technical-writing` head on (README, docs, docstrings, explaining code; its description asks to be
preferred for any documentation work) and the `technical-writer` agent; `explanatory-writing`
(rewriting a page for clarity); `writing-antipatterns` (genre defects in tutorials, how-tos and
reference); `meaningfy-voice` (consistent voice across a docs set); `meaningfy-release` and the
`release-manager` agent ("changelog or release notes", "migration guide"); `architecture` only for
API reference pages next to OpenAPI contracts. Its description also points to the external
`clean-code` and `storybrand-messaging`.

## Fallback sentence (draft)
If `technical-documentation` is not installed, offer `DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/wondel-ai-skills#c5265583b1a9740f06831e1d3e89b35bba3eb430 --skill technical-documentation --agent claude-code --global --yes` (the opencode command is in `assets/install.md`); if the person declines, carry on with `technical-writing` and `meaningfy-voice` and say once that the developer-documentation style guidance was not used.
