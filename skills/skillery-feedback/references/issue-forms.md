# Issue forms

The skillery repository has two issue forms; file with the one that fits, and keep its field order
in the body when you file from the command line.

## Defect — a skill or agent misbehaved

Title: `[defect] <skill-or-agent>: <one line>` · Label: `defect`

| Field | What to write |
|---|---|
| Skill or agent | its name, or "install / docs" |
| Kind | trigger (fired / did not fire), content (wrong or missing guidance), agent behaviour, install / packaging, docs, dual-CLI (works on one CLI only) |
| Where | Claude Code, Claude Desktop / Cowork, opencode, other |
| Catalogue version | the plugin version the CLI shows |
| What you asked | the prompt, verbatim, sanitized |
| What came out | quoted |
| What should have come out | concretely |
| Anything else | the file of the skill at fault, the neighbouring skill that fired instead, links |

## Request — a new skill, agent, or change to the method

Title: `[request] <one line>` · Label: `request`

| Field | What to write |
|---|---|
| Kind | new skill, new agent, extend an existing skill or agent, change to the development method |
| The job, in one sentence | what an agent should be able to do once this exists |
| The failure case | a concrete task where the agent did badly today: prompt, output, expected output |
| What exists today | the skills or agents that come close, and why they do not cover it |
| Who is the second user? | a skill with one user and one project is a project file, not a catalogue entry |
| Which hat (bundle) would install it? | the bundle, or a new one with its role |

## What happens next

A defect becomes a probe or a test and a fix in the one skill that owns the fact; a request becomes a
decision (reuse, extend, a new change, or a written no). The issue is closed by the PR that fixes it,
and the CHANGELOG line names the version that carries the fix.
