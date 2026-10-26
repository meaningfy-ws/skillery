# Spike: root-source marketplace entries (DEC-8 route A), 2026-10-26

**Status:** SECONDARY input. **Model runs:** none. **Claude Code:** 2.1.310.

**Setup.** A copy of the repo at `81763ed` without `bundles/`; each marketplace entry rewritten to
`"source": "./"` with `"skills": ["./skills/<s>", ...]` and `"agents": ["./agents/<a>.md", ...]` (empty
for bundles without agents). Isolated `CLAUDE_CONFIG_DIR`; marketplace added from the local path
(loaded in place); components read with `claude plugin details` (no model run). `claude plugin
validate` passed.

| Variant | `meaningfy-core` (0 agents listed) | `meaningfy-building` (3 listed) |
|---|---|---|
| agents in `agents/`, `strict: false` | 6 skills, **3 agents** | 9 skills, 3 agents |
| agents moved to `agent-defs/`, listed there | 6 skills, 0 agents | 9 skills, **0 agents** |
| as above, no `strict` | — | 9 skills, **0 agents** |
| agents in `agents/`, building lists only `implementer` | 6 skills, **3 agents** | 9 skills, **3 agents** |

**Findings.**
- `skills` lists work: each plugin loads exactly its listed skills.
- The entry's `agents` field has no effect here: every plugin gets whatever sits in `agents/` at its
  source root, and nothing from any other folder. This matches the 2026-10-26 rejection of
  alternative "d" in `single-source-distribution` and contradicts the manifest reference ("Replaces
  the default `agents/` scan").
- Not tested: a marketplace cloned from a git host (the `file://` form was refused; testing GitHub
  would need a pushed branch).

**Consequence for DEC-8.** Route A cannot express "this bundle has these agents" today, so it fails
for any catalogue with agents in more than one bundle or bundles without agents. Route B (a generated
tree on a distribution branch) is the plan, unless a GitHub-hosted re-test of route A passes first.

## GitHub-hosted re-test (task 7.1), 2026-10-27

**Approved by the owner** ("retest 7.1"). **Claude Code:** 2.1.311. **Model runs:** none.

**Setup.** A throwaway branch `test/route-a-retest` off `develop` at `af7b1b9` (no `bundles/`), its
`marketplace.json` entries rewritten to `"source": "./"`, `"strict": false`, `"skills"` and `"agents"`
listed per `bundles.yaml`; pushed to GitHub; added in an isolated `CLAUDE_CONFIG_DIR` with
`claude plugin marketplace add meaningfy-ws/skillery#test/route-a-retest` (a real git clone); every
bundle installed and read with `claude plugin details`. The branch was deleted afterwards.

| Bundle | Skills listed / loaded | Agents listed / loaded |
|---|---|---|
| `meaningfy-core` | 6 / 6 | 0 / **6** |
| `meaningfy-consulting` | 3 / 3 | 0 / **6** |
| `meaningfy-sales` | 2 / 2 | 1 / **6** |
| `meaningfy-architecture` | 4 / 4 | 2 / **6** |
| `meaningfy-building` | 9 / 9 | 3 / **6** |
| `vault-assistant` | 9 / 9 | 0 / **6** |

**Result: route A fails from a git host too.** The `skills` list is honoured; the `agents` list is
ignored and every plugin loads every agent in `agents/`. D-8 stays route B (the generated tree on
`dist`); no revision.
