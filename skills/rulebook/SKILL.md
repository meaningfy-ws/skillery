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

The owner's statements of how work should be done ("British English", "never send without my
approval") are explicit, owner-approved rules, one note each. The script decides what is valid,
which rule wins and what an output breaks; the agent only proposes, and never reads the rules
folder whole or writes a rule note by hand.

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

## Workflow: the use protocol

1. **Load at the start of an activity**, with the activity name and the context tags the playbook's
   vocabulary offers (`--context audience=client --context channel=email`). Load again when the
   activity or the context changes. `load` returns only what applies.
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

Read `references/rule-model.md` when you draft, edit or judge a rule, or must explain why one rule
beat another: it adds the fields, the twelve types, strength, scope, precedence, lint, lifecycle,
the repository store and the note format.

## Rules

**Running the script.**

- The script is `scripts/rules.py` in this skill's folder. Run it with `python3` (`python` on
  Windows); it needs Python 3.11 or later and nothing else.
- It finds the vault through `MEANINGFY_VAULT` (the vault root), or the current directory when that
  holds `08 How to/`. A session in a code repository, or on any other surface than the vault, needs
  `MEANINGFY_VAULT`. Without either it exits 3 and names the setting.
- Run it from the session's working directory. If you have run `cd` elsewhere in this session, run
  `cd <session directory>` as its own command first, never as `cd` chained to the script call with
  `&&`: a compound command may stop matching the permission rule.
- Run it by its full path, unquoted, as the skill's folder gives it: your permission settings
  allow the script by that path, so another spelling stops to ask.

Read `references/commands.md` when you need a command beyond `load`, `check` and `cite`, an exit
code, or the per-machine permission rule: it adds every subcommand's output, the exit codes and
the allow rule per CLI.

**Where rules live.** The vault holds `R-` rules, one playbook per activity and the candidates; a
git repository's `docs/rules/` holds the team's `P-` rules. `where` says which stores the session
sees.

**Writing rules.** Only `rules.py` writes rule notes. It assigns the next free id, validates every
write against the lint and refuses (exit 4) a write that would add a new error; warnings are
written and printed. An edit the owner makes in Obsidian is welcome; run `lint` after it.

| Who | Calls |
|---|---|
| rule-learner, in a session | `search`, `add`, `add --candidate`, `update`, `confirm`, `override` |
| rule-steward, in the weekly review | `stats`, `lint`, `check --golden`, `approve`, `retire`, `update`, `confirm` |
| any agent, in any activity | `load`, `check`, `cite` |

**Common mistakes**

| Mistake | Why it fails | Do instead |
|---|---|---|
| Editing a rule note by hand, even after a refused write (exit 4) | skips the validation and the id allocation | `add` or `update`, even for one word; after exit 4, fix the input it names |
| Citing every rule `load` printed | an inflated cite hides the rules nobody uses | cite only the rules that shaped this output |
| Inventing a scope value | a lint warning, and it fires for no context anyone loads | use the tags in the playbook's vocabulary |
| Retiring a rule lint calls "redundant" | lint judges each rule in its own scope only, so it can over-report | report it; the owner decides |
| Counting `check` line numbers from the body | they count from the file's top, frontmatter included | count from line 1 |

## Boundary & Related Skills

**Owns:** the rule model (types, fields, strength, scope, precedence, lifecycle and its status
mapping), the meaning of the `rule` and `playbook` properties, the note format, the `rules.py`
script and its exit codes, and the use protocol (load, check, cite).

**Delegates:** drafting candidates from the owner's words and the approval card → `rule-learner`;
usage monitoring, grooming and forgetting → `rule-steward`.

**Related:** `rule-learner`, `rule-steward`, and, when the vault-assistant bundle is installed,
`vault-conventions` (where a note goes, the required properties of every kind, the move procedure)
and `vault-setup`.

Answers `VER, CLR` in `test-strategy`'s matrix (`references/cross-cutting.md`).
