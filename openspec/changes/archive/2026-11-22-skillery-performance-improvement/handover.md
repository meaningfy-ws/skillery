# Hand-over: skillery-performance-improvement, after the close of the build

<!-- Five headings, nothing else. Point, never copy: decisions stay in design.md.
     Saved as openspec/changes/<change-id>/handover.md, the last commit of the stage's PR. -->

## Done
Stages 1 to 5 merged (PRs #328 to #332, `develop` at `c24a7ff`). The acceptance demo was run
(`evidence/acceptance.md`: nine use cases shown, 2026-11-22) and the docs inventory written
(`evidence/docs-owed.md`: no docs owed). Open build-adjacent tasks: 1.4 (interactive half), 2.5,
3.5, 4.7, 5.5 and 6.1 are the measurements that need a release and a fresh session.

## Decided since the PLAN
D-19 to D-54 (design.md, Delivery decisions); D-49 settles `--auto` (at step 6 only, with
required checks) and the shipped hook (the `no-poll-loops` and `quiet-tools` mods, no project
hook); D-52 lists the stage's accepted findings and the follow-ups (a shared tokeniser for the
three Bash mods; skillery's own `AGENTS.md` gate table; task 5.6, the scaffold validate probe).

## Open
- The release: stages 1 to 5 are on `develop`; `meaningfy-release` cuts the version (MINOR) from
  `develop`; the measurements (2.5, 3.5, 4.7, 5.5 within seven days; 6.1 after fourteen) run on
  the traces tagged with that version, after the owner bumps `CC_LANGFUSE_TRACE_TAGS` on each
  machine (D-20).
- Task 1.4's interactive half (D-23, D-41): `/context` for a session, an `implementer`, a
  `code-reviewer` and a `checker` with the shipped frontmatter, and the four bundle-specific
  workers (D-44 W3).
- The owner's approval of the inventory's disable list (D-22); the second machine.
- The rule approval card from the planning session (three rows) is unanswered.
- The acceptance verdict (`evidence/acceptance.md`, LARGE: mandatory, the developer's). A
  rejection is a `D-n` and a fix stage; an acceptance is followed by the archive with the spec sync
  (ten deltas; `catalogue-governance` and the illustrative counts noted in D-26 F5):
  `openspec validate skillery-performance-improvement --strict && openspec archive
  skillery-performance-improvement -y && make fix-spec-links && make validate`, by PR to `develop`.
- The release PR `release/3.22.0` → `main`: cut by the lead per `docs/development/releasing.md`,
  merged by the developer (four-eyes on a release, `meaningfy-release`); then steps 4 to 6 there.
- The governance change on dual-CLI parity (DEC-10) is outside this EPIC.

## Next
The developer records the verdict in `evidence/acceptance.md`; on acceptance the lead archives
(command above) and the developer merges the release PR; after the release, the measurements of
tasks 2.5, 3.5, 4.7, 5.5 and 6.1 on the traces tagged with `skillery:3.22.0`. Read first:
`evidence/acceptance.md`, `evidence/docs-owed.md`, `docs/development/releasing.md` steps 4 to 6,
tasks.md §6.

## Prompt
Act as the team lead. openspec/changes/skillery-performance-improvement is built and demoed
(handover.md). Take the developer's verdict from evidence/acceptance.md; if accepted, archive the
change by PR and finish the 3.22.0 release (releasing.md steps 4 to 6).
