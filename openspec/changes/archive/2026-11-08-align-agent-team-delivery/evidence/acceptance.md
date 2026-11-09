# Acceptance — trial run (DD-9)

**Success measure (proposal):** MWB2's `AGENTS.md` and `develop/agents.adoc` can be cut down to MWB2
specifics plus pointers to skillery with nothing of the method lost, and the leaner loop covers every
check of the 13-step loop (design §2).

**What was tried, where:**
- mapping-workbench-v2, branch `docs/lean-delivery` (worktree `../mapping-workbench-v2-worktrees/docs-lean-delivery`),
  commits `c86e858`, `1c8d41b`: `AGENTS.md`, `develop/{agents,index,testing}.adoc` rewritten to the
  lean team and loop, naming `epic-delivery` as the owner; MWB2 specifics kept.
- rdf-persistence, branch `docs/lean-delivery` (worktree `../rdf-persistence-worktrees/docs-lean-delivery`),
  commits `5e65fd6`, `60f59f6`: the same, plus the external-library rule.
- Both pass `make check-docs`.

**Known limits:** the loop itself has not yet run a real stage; the sibling docs still carry their
own short form of the method (they route to `epic-delivery` but keep a summary), so the repos are not
yet reduced to specifics-only.

**Verdict:** accepted by the owner, 2026-11-08 — "Accept, shrink later": after the 3.9.0 release a
follow-up cuts the sibling summaries down to specifics plus pointers to `epic-delivery`.  Date: 2026-11-08

**Closed 2026-11-08.** The follow-up of the verdict is done: the sibling summaries were cut down to
project specifics plus pointers to `epic-delivery` (mapping-workbench-v2#56, rdf-persistence#30),
after the lean practice landed there (mapping-workbench-v2#55, rdf-persistence#29). Released in
skillery v3.9.0. Open by design: the loop's first real stage is its first trial; the skill is
adjusted from what it shows.
