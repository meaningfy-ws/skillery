# Owner decisions taken before PLAN derivation (2026-10-26)

**Status:** SECONDARY input, the Q&A record of the elicitation round. Never groomed, never deleted.
Questions come from §6 of [`2026-10-26-defect-analysis.md`](2026-10-26-defect-analysis.md).

| # | Question | Owner's answer |
|---|---|---|
| Q1 | The communication feedback quotes text that is not in skillery. How should it be treated? | **Fix `executive-communication`**: apply the transferable parts to `executive-communication` and `company-voice.md` (register switch, "Not for" contractual documents, brand-assets rule, a second-domain example). Text that exists only in the other copy is ignored. |
| Q2 | Move project resolution from `vault-resume` into `vault-conventions` (single source), despite the "do not refactor" rabbit hole? | **Yes, single-source it.** This is logged as a re-shape in the EPIC (DEC-6). |
| Q3 | What should the vault permissions for `mv` and `rm` become? | **`mv` and `rm` → ask.** Not the recommended option (`rm` stays denied). Consequence: deletion still goes to `.trash/` by default, and permanent deletion is possible only when the owner asks for it and approves the prompt. |
| Q4 | Which extra items belong inside this EPIC? | **All four:** near-miss probes (G1), intake bridge (P1), posture rule (R/C/P), spec deltas. **Plus, added by the owner:** "the documentation of this repo might need updates, and shrinking, and crystallising for better readability, and remove redundancies." |

Not asked (shaped out, no effect on this PLAN): raw-notes handling (the analysis's default stands:
cited, not copied) and the Decision Package / Proof of Value question (SO-2).
