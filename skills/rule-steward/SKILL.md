---
name: rule-steward
description: "Use this skill when the weekly review of a Meaningfy vault reaches its rules step, or when the owner asks how their rules are doing: read the window's rule usage from Langfuse, run the lint and the golden examples, review the staged rule candidates, flag rules never loaded, never cited, overridden, violated or stale, propose retire, revise, merge, split, confirm or promote for each, and apply only what the owner approves. Stops when Langfuse is not reachable. Drafting rules from the owner's words is rule-learner; the weekly review as a whole is vault-planning."
license: Apache 2.0
metadata:
  purpose: knowledge
  area: personal
  subject: obsidian
  posture: precise
  stage: any
  maturity: experimental
---

# Rule Steward

## Overview

Rules rot. One stops matching how the owner works, another is never loaded, two start to disagree.
Once a week this skill looks at how each rule was actually used, from the session traces in
Langfuse, and puts a short list of proposals to the owner: retire this, revise that, confirm the
other. It forgets nothing on its own: every change is the owner's decision, and a retired rule stays
readable.

The rule model and the script belong to `rulebook`; this skill holds the monitoring, the flags and
the grooming procedure.

## Quick Start

**Input:** the rules step of the owner's weekly review.

1. `rules.py stats` prints the past 30 days:

   ```
   window 2026-09-29..2026-10-29: 412 observations, 57 rules.py events
   id      loaded cited overridden violated
   R-0012  9 3 2 0
   FLAG R-0012 overridden 2: propose revise, supersede or retire; reasons: "US client prefers a surname"; "internal memo"
   FLAG R-0031 never-loaded: propose retire
   -- end --
   ```

2. `rules.py lint` and `rules.py check --golden` add their findings; two candidates wait in
   `00 Inbox/proposed/`.
3. The report to the owner, one row per flag:

   | Rule | Flag | Proposal |
   |---|---|---|
   | R-0012 greet by first name | overridden twice ("US client prefers a surname"; "internal memo") | narrow it to `audience:internal`, or retire it |
   | R-0031 price at a fixed cost | never loaded in 30 days | retire |
   | R-0050 prefer the active voice (candidate) | waiting since 2026-10-28 | approve, edit, reject or leave |

4. The owner answers "narrow R-0012, keep R-0031, approve R-0050". Apply:
   `rules.py update R-0012 --scope activity:writing --scope audience:internal`, then
   `rules.py approve R-0050`. R-0031 stays.

## The script

Every read and write goes through the rulebook script, at
`<this skill's base directory>/../rulebook/scripts/rules.py`: the path is relative to this skill's
folder, never to the working directory. The rulebook skill ships in the same bundle, so the path
holds on both CLIs. If no file is there, stop and say in one line: "The rulebook skill is not
installed; the rules cannot be reviewed."

## Weekly procedure

1. **Usage.** Run `stats` (default window 30 days). If it exits 3, Langfuse is not configured or not
   reachable: **stop**, tell the owner "rule monitoring is unavailable:" followed by the message it
   printed, and never guess usage from memory or from the vault. The owner may ask to go on with
   the lint, the golden examples and the candidates without usage.
2. **Format check.** If `stats` warns that it found no `rules.py` events, the trace format may have
   changed: report that, and raise no usage flag this week. If it reports truncated outputs, say how
   many: those loads counted without ids.
3. **Lint.** Run `lint`. Every error and warning is a flag.
4. **Golden examples.** Run `check --golden`. A failing example is a flag.
5. **Candidates.** List the `kind: rule` notes in `00 Inbox/proposed/` (`status: idea`).
6. **Report.** One table: rule, flag, proposal (below). Candidates last. Keep it to what needs a
   decision; a rule with no flag is not listed.
7. **Decide.** The owner answers each row. Nothing is applied without an answer; an unanswered row
   waits for next week.
8. **Apply** in the same session, through the script: `retire R-NNNN --reason "..."`, `update`,
   `confirm`, `approve`, `add --supersedes`. Then run `lint` once more and report what changed.

## Flags and proposals

Fixed conventions over the window; `stats` computes the first five.

| Flag | Threshold | Proposal |
|---|---|---|
| Never loaded | `active`, added 30 or more days ago, never loaded in the window | retire (forget) |
| Loaded, never cited | loaded 5 times or more, cited 0 | revise or narrow its scope; never retire on this alone |
| Overridden | 2 times or more | revise, supersede or retire, quoting the owner's reasons |
| Violated | 3 times or more | strengthen the procedure, or ask whether the rule still holds |
| Stale | not confirmed for more than 90 days | confirm or retire |
| Lint | any error or warning | the fix the finding names: merge duplicates, resolve a conflict with the owner, split an oversized activity |
| Golden | a golden example fails `check` | fix the rule, or update the example |
| Promote | the owner marks a rule as relevant to the company | draft a `kind: skill-change` note in `00 Inbox/proposed/` naming the skill it belongs in |

"Cited" is self-reported by the agent, so it is weaker than "loaded" and "overridden". Use it to
revise, never as the only reason to retire.

## Proposals the owner can choose

- **Retire:** `retire` with the owner's reason. Never delete a rule note.
- **Revise:** `update` the wording, scope, strength or check pattern; the id stays.
- **Merge:** keep one rule, `retire` the others with "merged into R-NNNN".
- **Split:** `add` the narrower rules, then `retire` the old one with "split into ...".
- **Confirm:** `confirm`, when the owner says the rule still holds.
- **Promote:** a `skill-change` note; a person opens the skillery change. Never edit a skill, and
  never set `memory: common` on a rule.

## Gotchas

- **Guessing usage when Langfuse is down.** A rule that looks unused may be used every day. Stop at
  step 1.
- **Retiring for silence alone in the first month.** A rule added less than 30 days ago is never
  flagged as unused.
- **Applying a proposal the owner did not answer.** Silence is "leave it".
- **Sessions on opencode are not traced.** Rules used there look unused; see
  [`references/langfuse.md`](references/langfuse.md).

## Boundary & Related Skills

**Owns:** rule usage monitoring from Langfuse, the steward's flags and thresholds, the weekly
grooming and forgetting procedure, and the promotion proposal.

**Delegates:** the rule model and every read and write → `rulebook`; drafting new rules →
`rule-learner`; the weekly review that calls this step → `vault-planning`; the skill-change note and
staging → `vault-conventions`.

**Related:** `rulebook`, `rule-learner`, `vault-planning`, `vault-conventions`.
