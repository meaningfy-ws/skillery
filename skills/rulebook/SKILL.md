---
name: rulebook
description: "Use this skill in any session, when an activity starts (writing, offers, reviews, coding, code-review, planning) and whenever a rule is read, checked or written: load the rules for the activity and context, cite the ones applied, and check an output before handing it over. Owns the rule model (twelve types, strength, scope, precedence, lifecycle), the rule and playbook note format, and rules.py, the only writer of rule notes. Learning a new rule from the owner is rule-learner; the weekly grooming and usage report is rule-steward."
license: Apache 2.0
metadata:
  purpose: knowledge
  area: cross-cutting
  subject: generic
  posture: precise
  stage: any
  maturity: experimental
---

# Rulebook

## Overview

The owner keeps telling agents how work should be done: "British English", "never send without my
approval", "fixed price when the scope is clear". This skill keeps those statements as explicit rules
in the owner's vault, one note per rule, and brings the right ones into the session that needs them.

The work is split on purpose. The script decides what is valid, which rule wins and what an output
breaks; the agent only proposes. Nothing here is learned statistically: every rule was approved by
the owner, and every one can be read, edited and retired.

The rule model (the twelve types, their fields, strength, scope, precedence and the note format) is
defined in [`references/rule-model.md`](references/rule-model.md). Every subcommand and exit code is
in [`references/commands.md`](references/commands.md).

## Quick Start

**Input:** the owner asks for a short memo to a client.

1. Load the rules for the activity and its context:

   ```
   python3 <this skill's folder>/scripts/rules.py load --activity writing --context audience=client
   ```

   ```
   PLAYBOOK Writing
   1. Load the rules for the audience and the channel. ...
   R-0042 [default] spelling=british: use British English spelling (because: Meaningfy writes for EU clients)
   R-0043 [hard] use no em dash (because: the owner reads em dashes as machine-written)
   CHECK R-0043: run check on the output before handing it over
   -- end --
   ```

2. Draft the memo following the playbook and the rules.
3. The `CHECK` line names a rule with a check pattern, so check the draft:

   ```
   python3 <this skill's folder>/scripts/rules.py check --activity writing --context audience=client memo.md
   VIOLATION R-0043 line 4: ...
   ```

   It exits 1. Fix line 4 and run `check` again until it exits 0.
4. Record the rules that shaped the memo, then hand it over:

   ```
   python3 <this skill's folder>/scripts/rules.py cite R-0042 R-0043
   ```

## Running the script

- The script is `scripts/rules.py` in this skill's folder. Run it with `python3` (`python` on
  Windows); it needs Python 3.11 or later and nothing else.
- It finds the vault through `MEANINGFY_VAULT` (the vault root), or the current directory when that
  holds `08 How to/`. A session in a code repository, or on any other surface than the vault, needs
  `MEANINGFY_VAULT`. Without either it exits 3 and names the setting.
- Run it from the session's working directory. If you have run `cd` elsewhere in this session, run
  `cd <session directory>` as its own command first, never as `cd` chained to the script call with
  `&&`: a compound command may stop matching the permission rule.
- Its per-machine permission rule, for both CLIs, is in
  [`references/commands.md`](references/commands.md#permissions-per-machine).
- Run it by its full path, unquoted, as the skill's folder gives it: your permission settings
  allow the script by that path, so another spelling stops to ask.
- It prints plain text, so its output is safe to show the owner.

## Where rules live

- **Rules:** `08 How to/Rules/R-NNNN <title>.md`, kind `rule`, one note per rule, `private: true`.
- **Playbooks:** `08 How to/Playbooks/<Activity>.md`, kind `playbook`, at most one per activity. A
  playbook holds the activity's procedure (its body), its scope vocabulary and its golden examples.
- **Candidates:** `00 Inbox/proposed/`, `status: idea`, until the owner approves them.
- **Repository rules:** in a git repository, `docs/rules/P-NNNN <title>.md`, shared with the team
  (rule model, Repository store). `where` says which stores the session sees.

For the required properties of both kinds, see `vault-conventions` (when the vault-assistant bundle is installed); their meaning is in the rule
model reference.

## Use protocol

1. **Load at the start of an activity**, with the activity name and the context tags the playbook's
   vocabulary offers (`--context audience=client --context channel=email`). Load again when the
   activity or the context changes. Never read the rules folder whole: `load` returns only what applies.
   **The "say once" rule:** when `load` exits 3, tell the owner once per session, "Your rules are not loaded: set
   `MEANINGFY_VAULT` (see https://github.com/meaningfy-ws/skillery/blob/develop/docs/environment/setup.md)", do not run `load` again in that session, and carry
   on. Scheduled and unattended runs skip `load` altogether.
2. **Follow the winners.** Each `R-` line is a rule in force for this context. A rule without a slot
   applies alongside the others.
3. **Ask on CONFLICT.** A `CONFLICT` line means two rules disagree and neither wins. Ask the owner
   which applies; never pick one, and never pick the newer one.
4. **Check before handing over** whenever `load` printed a `CHECK` line. Fix every `VIOLATION` and
   run `check` again until it exits 0.
5. **Cite what applied.** After the output is done, `cite` the ids of the rules that actually shaped
   it, and only those. A cite is the usage signal the weekly review reads.

## Precedence

A rule fires when every scope tag it carries is in the context; `activity:*` means any activity.
Among rules that fire and set the same slot, hard beats default beats soft; then an exception beats
every rule up its `exception_of` chain; then a strictly more specific scope wins. Anything left is a
conflict for the owner. The formal definition, and why it cannot loop among valid rules, is in the
rule model reference.

## Writing rules

Only `rules.py` writes rule notes. It assigns the next free id, validates every write against the
lint and refuses (exit 4) a write that would add a new error; warnings are written and printed.

| Who | Calls |
|---|---|
| rule-learner, in a session | `search`, `add`, `add --candidate`, `update`, `confirm`, `override` |
| rule-steward, in the weekly review | `stats`, `lint`, `check --golden`, `approve`, `retire`, `update`, `confirm` |
| any agent, in any activity | `load`, `check`, `cite` |

An edit the owner makes in Obsidian is welcome; run `lint` after it, because the script was not there
to validate it.

## Gotchas

- **Hand-written frontmatter.** An agent that edits a rule note directly skips the validation and the
  id allocation. Use `add` or `update`, even for a one-word change.
- **Citing from memory.** Cite only the rules that shaped this output, not every rule `load` printed.
  An inflated cite hides the rules nobody uses.
- **Inventing scope values.** Use the tags in the playbook's vocabulary. A new value is a lint warning
  and fires for no context anyone loads.
- **"Redundant" can over-report.** The lint evaluates each rule in its own scope; a rule that matters
  only in a wider combination of tags may still be flagged. Redundancy is a warning, and the owner
  decides.
- **A refused write (exit 4)** prints the new errors. Fix the input; never write the note by hand to
  get round it.
- **Line numbers** in `check` count from the top of the file, frontmatter included.

## Boundary & Related Skills

**Owns:** the rule model (types, fields, strength, scope, precedence, lifecycle and its status
mapping), the meaning of the `rule` and `playbook` properties, the note format, the `rules.py`
script and its exit codes, and the use protocol (load, check, cite).

**Delegates:** drafting candidates from the owner's words and the approval card → `rule-learner`;
usage monitoring, grooming and forgetting → `rule-steward`.

**Related:** `rule-learner`, `rule-steward`, and, when the vault-assistant bundle is installed,
`vault-conventions` (where a note goes, the required properties of every kind, the move procedure)
and `vault-setup`.
