# Hand-over: skillery-performance-improvement, after stage 5

<!-- Five headings, nothing else. Point, never copy: decisions stay in design.md.
     Saved as openspec/changes/<change-id>/handover.md, the last commit of the stage's PR. -->

## Done
Stage 5 (quiet the tools), PR #332 (merged by the watch-and-merge command after this note);
stages 1 to 4 were PRs #328 to #331. Tasks 5.1 to 5.4 done; the build stages of the EPIC are
complete. Open build-adjacent tasks: 1.4 (interactive half), 2.5, 3.5, 4.7, 5.5 and 6.1 are the
measurements that need a release and a fresh session.

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
- After the last build stage, in this order (stage-loop): the acceptance demo (the EPIC changes
  use cases, so it is offered), the docs stage (the under-the-floor findings D-25, D-30, D-31,
  D-32, D-37, D-38, D-45, D-46 are its candidates; `evidence/docs-owed.md`), then the archive with
  the spec sync (ten deltas; `catalogue-governance` and the illustrative counts noted in D-26 F5).
- The governance change on dual-CLI parity (DEC-10) is outside this EPIC.

## Next
Accept, docs stage, archive (stage-loop, "After the last build stage"), then the release. Read
first: `skills/epic-delivery/references/stage-loop.md` §After the last build stage and
`references/verification-validation.md`; design.md D-19 to D-49; `evidence/`; tasks.md §6.

## Prompt
Act as the team lead. Close openspec/changes/skillery-performance-improvement from handover.md:
the acceptance demo, the docs stage, the archive; then cut the release with meaningfy-release.
