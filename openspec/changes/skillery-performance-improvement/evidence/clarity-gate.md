# Clarity gate evidence: skillery-performance-improvement

readiness check (lightweight, EPIC), 2026-11-22, pass. Gap found and fixed before the PLAN: the
"What Changes" section was a placeholder; filled from DEC-1 to DEC-17.

attack (subagent, read-only), 2026-11-22: 15 counterexamples, 2 sinking (no detector for "gates
passed"; a fortnight per stage is serial and unattributable), 7 weakening, 6 nits. All folded in:
D-11 (gates-passed source, version tag), D-17 (per-stage proxies), D-3 (1.4 measures three
variants, `stage-check`), D-4 (the live grouping, `risk_reviewers`), D-5/RISK-7, D-9 (allowlist,
`appetiteOf`), D-10 (`additionalContext`), D-14, D-16 (Gherkin per agent change), RISK-5, RISK-8,
five error-matrix rows, tasks 1.3, 1.4, 1.6, 2.1, 2.4, 2.5, 3.2, 3.4, 3.5, 4.2–4.4, 4.7, 5.2, 5.5, 6.1.

run 1, 2026-11-22, 8.3/10, fail (actionability 9.0, specificity 7.5, consistency 7.0, structure
9.5, disambiguation 8.5, reference clarity 7.5). Eleven gaps, all wording, values and references:
lens grouping stated two ways (deltas aligned to L1+L2 / L3+L4+L5), D-17 proxies made computable,
measurement window one value (seven days; fourteen for stage 6), five lenses from LARGE up, D-3
and its delta both conditional on 1.4's variant with five Serena essentials, two error-matrix
rows, KB defined, D-9's exemptions in the epic-shape delta, every task with a requirement and a
design anchor (D-1 and D-18 added), lean-delivery citations qualified, proposal header current.

run 2, 2026-11-22, 9.15/10, pass (actionability 9.5, specificity 9.0, consistency 9.0, structure
9.5, disambiguation 9.0, reference clarity 8.5); read only run 1's gaps. Four nits fixed after the
run: two inherited lean-delivery citations qualified in the epic-delivery delta, task 4.3's anchor,
"stage-5 release" in the stage-6 scenario, "impact calls" dropped from 3.5. design.md 16 381 bytes
within the 16 KB budget of D-9. No accepted gaps; no DEC- added by the gate.
