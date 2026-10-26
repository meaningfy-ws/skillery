# Owner decisions closing half one (2026-10-26)

**Status:** SECONDARY input, the Q&A record. Never groomed, never deleted. Questions from
[`../design.md`](../design.md).

| # | Question | Owner's answer |
|---|---|---|
| D-1 | When must a skill change prove itself with a behavioural baseline run? | **Proportionate:** new skill, boundary move or discipline rule → baseline run; wording, link, description tweak → probes only. |
| D-2 | Which description rule? | **What + when (agentskills.io):** imperative, ≤ 1,024 characters gate, advisory target ≤ 600, `Not for…` only where a near-miss probe needs it. |
| D-3 | How are behavioural evals run? | **"do 1 and 2, but 2 must be triggered on demand, not on every release":** `skill-creator` as is, and `claude plugin eval` in CI as an on-demand job only. |
| D-4 | Separate the owned method from the catalogue? | **Not now.** Revisit when an outside consumer appears; make the method checks root-configurable meanwhile. |
