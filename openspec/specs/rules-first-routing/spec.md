# rules-first-routing Specification

## Purpose
Where an agent puts what the user states about how work should be done. Preferences and
corrections go to the rulebook (`rule-learner`'s approval card, then `rules.py add`), never to the
CLI's own memory; project state goes to the spine and the repository's docs. On Claude Code the
`rules-first` mod in `meaningfy-core` prints the stores and the routing text at session start and
denies `feedback` and `user` notes in the auto-memory folder; on opencode the routing text in the
global policy and `AGENTS.md` carries it alone.

## Requirements

### Requirement: Every Claude Code session starts with a rules block
In Claude Code with `meaningfy-core` installed, every session start SHALL receive a block of a few
lines. The block SHALL hold the output of `rules.py where` (the stores the session sees, the default
store, and whether the routing policy is present or missing) and the routing text read from the
`rulebook` data file. The block SHALL NOT load any rule; `load` stays per activity (DEC-1, DEC-2,
DEC-11).

#### Scenario: Setup visible
- **WHEN** a session starts with no `MEANINGFY_VAULT` and no routing sentence in the global instructions
- **THEN** the block names both missing pieces
- **AND** the agent says once that rules are not loaded and how to set them up

#### Scenario: Everything set
- **WHEN** a session starts with the vault found, a repository store present and the routing sentence in the global instructions
- **THEN** the block lists the vault and the repository store and says "routing policy: present"

### Requirement: Memory writes of preferences are denied
The mod SHALL deny a Write or Edit of a note whose frontmatter `type` is `feedback` or `user`,
inside Claude Code's auto-memory folder (`<config root>/projects/<slug>/memory/**/*.md`, any depth, config root
`CLAUDE_CONFIG_DIR` or `~/.claude`). The deny message SHALL name `rule-learner`, SHALL say to draft the
statement as a candidate for the rule approval card, and SHALL carry a fixed marker. Notes of type
`project` or `reference`, `MEMORY.md`, and files elsewhere SHALL pass (DEC-5, DEC-6, DEC-10).

#### Scenario: A feedback note is denied
- **WHEN** the agent writes a `feedback` note into the auto-memory folder with `Write`, `Edit` or `MultiEdit`
- **THEN** the write is denied with the message that names `rule-learner` and carries the marker

#### Scenario: A project note is allowed
- **WHEN** the agent writes a `project` note into the auto-memory folder
- **THEN** the write is allowed

#### Scenario: A feedback note elsewhere is allowed
- **WHEN** the agent writes a file with `type: feedback` outside the auto-memory folder
- **THEN** the write is allowed

### Requirement: The hook fails open
When `node`, `python3`, `rules.py` or the routing file is missing, the session-start block SHALL
leave out the part it cannot produce (all of it when nothing can be produced), the write check
SHALL allow the write, and neither SHALL block the session (DEC-4).

#### Scenario: A tool is missing
- **WHEN** `python3` is not installed at session start
- **THEN** the block carries the routing text without the `where` lines, and the session starts

#### Scenario: The routing file is missing
- **WHEN** the routing data file cannot be read at session start
- **THEN** the block carries the `where` lines without the routing text, and the session starts

#### Scenario: The hook input is unreadable
- **WHEN** the hook's input is not JSON
- **THEN** the hook prints nothing and exits 0, so a write is allowed

### Requirement: The routing text has one home
The routing text SHALL live once, as a data file in `rulebook`. The global policy, the
`project-setup` `AGENTS.md` template, this repository's `AGENTS.md` and the pointer line `rules.py`
writes into a repository SHALL quote its routing sentence, compared with whitespace collapsed and
curly quotes folded, and a test SHALL fail when any of them drifts (DEC-4, DEC-9).

#### Scenario: A copy drifts
- **WHEN** the global policy, the template, `AGENTS.md` or the pointer line words the sentence differently from the data file
- **THEN** the test fails and names the file

### Requirement: The 2026-11-11 failure no longer reproduces
A stated preference SHALL reach the rulebook and not the CLI's memory, in a fresh Claude Code
session with `meaningfy-core` installed and no global instructions (DEC-5, DEC-7).

#### Scenario: Acceptance replay
- **WHEN** the owner, in a session with an empty Claude Code config folder and only this branch's `meaningfy-core`, says "in this repo never ask for commit, pr, or merge, just do these actions"
- **THEN** the statement is a row of the rule approval card before the final summary
- **AND** the approved rule is written by `rules.py` to the repository store by default
- **AND** no new memory note of any type appears in auto-memory

### Requirement: opencode is handled by the policy and a recorded gap
On opencode the memory-write deny SHALL NOT apply, as there is no auto-memory. The session-start
block SHALL be a recorded gap in `docs/environment/dual-cli/compatibility.md`, and the global policy
SHALL route there (DEC-12).

#### Scenario: opencode session
- **WHEN** a session runs on opencode
- **THEN** no block is injected and no write is denied
- **AND** the global policy carries the routing, and the gap is listed in `compatibility.md`

### Requirement: Rules reach a subagent through its brief
`rulebook` SHALL offer `load --brief --activity <a>`, which prints the `R-` and `P-` rule lines in force
for the activity and context without the playbook text. The lead SHALL run it and paste its output
into each subagent's brief under a `Rules` heading. A subagent SHALL NOT run `load` and its agent
body SHALL NOT say "load the rulebook"; the rules it follows are those in its brief. The
session-start rules block SHALL keep running for sessions and SHALL NOT be relied on for subagents
(D-14, DEC-13).

#### Scenario: The lead briefs a builder
- **WHEN** the lead runs `rules.py load --brief --activity coding` and spawns an `implementer`
- **THEN** the brief's `Rules` section holds the printed `R-`/`P-` lines, and the implementer's transcript shows no `load` call

#### Scenario: Brief mode prints no playbook
- **WHEN** `load --brief --activity code-review` runs in a repository with 4 rules and 1 playbook for the activity
- **THEN** the output is 4 rule lines, one per rule with its id and text, and no playbook paragraph

#### Scenario: A session still gets its block
- **WHEN** a person starts a Claude Code session with `meaningfy-core` installed
- **THEN** the session-start block appears as before, and `load` stays per activity for that session

#### Scenario: An agent body that still loads
- **WHEN** an agent under `agents/` tells its subagent to load the rulebook
- **THEN** the pre-PR review of this change lists it as a finding, and the line is replaced by "follow the rules in the brief"
