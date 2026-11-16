# Acceptance of delivery-process-and-tools

## Scenario sign-off (PLAN gate, D-17)

- 2026-11-15: the owner signed off every scenario of `specs/` on the PLAN's pull request (#245),
  in the session, in these words: "signed off".
- 2026-11-15, stage 2: the owner re-signed the rewritten scenario "A note that copies the design"
  (the cold-start check judges the note), in the session: "Sign off".

## Acceptance demo

2026-11-16, in the session. Shown to the owner against DEC-14:

- Cold start (check 2): `cold-start.md`, two passes.
- Start weight (check 3): `start-weight.md`; main session −1,992 tokens (held to ≥ 800), implementer
  −27,247 (held to ≥ 20,000). Both pass.
- Both lint checks on `develop` (`906c5db`): clean, exit 0; a planted activity-tools row naming
  `WebFetch` for `implementer` fails `activity_tools_table`; 1,000 characters planted into
  `AGENTS.md` fail `binding_size` (12,376 over 12,000). Plants reverted.
- One stage loop walked through on `epic-delivery` `references/stage-loop.md`, Prepare to Merge.
- Agent scenarios (check 1): Claude Code passes in `scenarios.md`; opencode not run.
- Docs stage: no docs owed (`docs/development/workflows.md` and `docs/environment/navigator.md`
  already describe the new loop). Release: 3.16.0 (DEC-15).

**Verdict: accepted** by the owner ("Accept"). The opencode scenario runs are **waived** by the
owner. Archived now, before check 4 (the next EPIC measured), by the owner's choice; check 4 is
issue #296, for that EPIC's lead.
