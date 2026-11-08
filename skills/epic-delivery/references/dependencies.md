# Dependencies: our libraries and external ones

What to do when a library falls short. The rule depends on who owns the library.

- **Our library**: one Meaningfy develops, usually alongside the project that uses it. Never worked
  around.
- **External library**: anyone else's. Settled by a recorded decision.

## Our library: report it there, never work around it here

Every workaround in the consumer hides a shortcoming the next consumer will meet again, and makes
the library look better than it is.

**Never**, to get past a problem in our library:

- patch, monkeypatch or subclass its internals, or import a non-public module;
- copy its code into the consumer and change it;
- write in the consumer what the library should do (a mapper, a repository, an adapter, a model);
- edit or post-process code it generates;
- weaken a consumer requirement, test or check so the library's behaviour passes;
- leave a "temporary" shim, a `TODO` or a skipped test that stands in for the fix.

**Do** this, every time:

1. **Stop the task** that hit the problem. Merge nothing that depends on it being solved another way.
2. **Check it is the library's.** Reproduce it with the library alone and read its docs. If the
   consumer used it wrongly, fix the consumer. A gap in the library's docs is an issue too.
3. **Search the open issues.** If one exists, add the consumer's case as a comment.
4. **File the issue** in the shape below. The lead files it without asking first and reports the
   link. Members never file; they report under *Upstream findings*.
5. **Record the block.** In `tasks.md`, mark the task `blocked by <owner>/<repo>#<n>`. In
   `design.md`, list the issue under the change's dependencies with one line on what waits.
6. **Tell the developer**: the link, what is blocked, what goes on meanwhile. The developer decides
   when the library fix is scheduled.
7. **Resume after the upstream merge.** The fix is a change in the library's own repository. Once
   it is merged, refresh the lock in the consumer's PR and unblock the task.

Other tasks go on while one is blocked. If the whole stage is blocked, it waits; it does not ship
around the gap.

### The shape of the issue

The issue lets a library developer act without asking the consumer anything. The title says what is
wrong or missing in the library's words, not the consumer's. Label: `bug`, `enhancement` or
`documentation`. Everything a library change would copy from it is written in generic terms, so it
can be lifted straight into the library's own EPIC.

```markdown
## Summary
One or two sentences: what fails, or what capability is missing.

## Context
- Consumer: <repo>, change `<change-id>`, task `<n>`; use case `<UC-…>`.
- What the consumer is trying to do, in one paragraph.
- Library commit: `<sha from the consumer's lock>`.

## Current behaviour            (for a bug)
A minimal reproduction with the library alone: the input, the code, the actual output or error.

## What is missing              (for a feature)
The gap, and what a consumer cannot do today because of it.

## Expected behaviour / proposed capability
In generic terms (no consumer vocabulary):
- the API sketch: function, class, annotation, route or setting;
- a code example of the intended use, as a consumer would write it;
- the error raised when it is used wrongly.

## Why it belongs in the library
Why any consumer would need it, and why a workaround in the consumer is not acceptable.

## Acceptance
Given/When/Then scenarios that would close the issue.

## Impact on the consumer
What is blocked, what goes on meanwhile.
```

### Working on both at once

- The developer's clone of the library is read-only to agents: never commit, stash or switch
  branches there; another session may be using it.
- Library work happens in a worktree of that clone, on a branch named for the library's own change,
  following that repository's `AGENTS.md` and gates.
- To try an unmerged fix, install the worktree as editable into the consumer's environment. Never
  commit a lock or project file that points at it.
- **Library first.** The library PR merges; then the consumer PR refreshes the lock and uses it.
- **One repository per commit**, each citing its own change id.
- Remove the worktree after its PR merges.

## External library: a recorded decision

When an external library falls short, the lead writes the options in `design.md` before any code,
with a recommendation. The developer decides. Speed is a legitimate reason.

| Option | What it means |
|---|---|
| **Contribute upstream** | A PR to the foreign project; the task waits for it, or uses a released fix |
| **Fork and release** | Fork into the Meaningfy GitHub, fix there, release from the fork |
| **Work around** | Local code, isolated in one adapter, marked as a shortcut with its limit |

The `design.md` record holds: the gap, the options considered, the recommendation and its reason,
the developer's choice, and for a workaround the issue that tracks its removal. A workaround's code
carries a `shortcut: <the limit>, <when to remove it>` comment pointing to that issue.

Example: an external RDF library lacks a needed capability. The lead writes the three options with
a recommendation; the developer picks "work around"; a builder isolates it in one adapter with a
`shortcut:` comment; an issue tracks its removal.
