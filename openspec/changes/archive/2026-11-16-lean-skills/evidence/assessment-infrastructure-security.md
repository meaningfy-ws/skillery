# Assessment: infrastructure-security
Before: body 7207 bytes, references 17356 bytes. After: body 6399, references 17356 (after the second reading's fix).

Under budget before (24563) and after (23755); it failed pointers only, so it is sorted by section
(D-21 brief). The four reference files are unchanged; the body is rewritten to the shape with every
pointer in the sentence form. The heading *Four-eyes and break-glass* keeps its anchor (CHK-55 and
`supply-chain.md` link it). Line numbers are those of `SKILL.md` before the rewrite.

| # | Passage (heading or lines, before) | Class | Where it went | Note |
|---|---|---|---|---|
| 1 | Intro, l. 16-20 | keep | body intro | the bias (printing a credential, trusting firewall files) added; levels kept |
| 2 | § Quick Start, l. 22-44 | keep | body Quick Start | the closing link to `secrets.md` dropped: the Workflow pointer covers it |
| 3 | § Workflow, four pointers, l. 48-55 | keep | body Workflow, pointer sentences | |
| 4 | § Workflow, template list, l. 56-59 | keep | one sentence; each template is linked from the reference that uses it (`access.md`, `secrets.md`, `exposure.md`) | "never from another stack's copy" kept |
| 5 | § Four-eyes and break-glass, l. 61-85 | keep | body Rules, `### Four-eyes and break-glass` | the "Why" bullet dropped: it restates the rule |
| 6 | § Gotchas, seven items, l. 87-108 | keep | body Rules, Common mistakes table | all seven kept; anchored links into the references dropped (repetition of the Workflow pointers) |
| 7 | § Boundary & Related Skills, l. 110-132 | keep | unchanged | matrix line unchanged |
| 8 | references/access.md, exposure.md, secrets.md, supply-chain.md | keep | unchanged | pointer-only rewrite; CHK-46, CHK-53, CHK-54 cite their sections |

Second reader: general-purpose subagent (fresh), 2026-11-16. Verdict: nothing lost. Other fix: the cloud-firewall row's "Do instead" sharpened (a private bind address for a Docker port; the host firewall only for a host service), as `exposure.md` states it. Citers (CHK-46, CHK-53 to CHK-55 and the `#four-eyes-and-break-glass` anchor) true.
