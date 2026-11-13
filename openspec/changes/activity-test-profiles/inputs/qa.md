# Q&A record: activity test profiles (EPIC C)

**Secondary input, never groomed.** The owner's answers of 2026-11-13.

| # | Question | Answer |
|---|---|---|
| Q-1 | One EPIC or several for the six families? | One EPIC, staged by family. |
| Q-2 | How far do we go in filling a gap? | One technique per gap, and only where a recorded failure exists; otherwise the gap is recorded as accepted, with why. |
| Q-3 | Which new tools or techniques are in scope? | Vale for docs; ls-lint and checkmake for docs trees and the stacks repositories; invariants in the shaping interview. Not chosen: formal methods (TLA+, Alloy) as optional spikes. |
| Q-4 | Stage order? | Documentation, shaping, DevOps, then architecture and modelling, then UI. |
| Q-5 | Where do the failure cases come from? | A survey at each stage's start; no failure, no new check. |
| Q-6 | What must C prove? | All four: each new check cites its failure and catches it; each family's gap rows end as `exists` or accepted; invariants reach the tester; Vale, ls-lint and checkmake each run once on a real repository. |
| Q-7 | Risks (shared with D): which do we mitigate? | Mitigate: checks slow daily work; external styles and tools change; the adversarial reader is theatre. **Accepted:** client-confidential text passes through reader subagents. |

Carried in from `harden-checks-and-tests`: Q-16 there (Vale starts with hand-picked external styles
only) and its DEC-7 (Vale moved here).
