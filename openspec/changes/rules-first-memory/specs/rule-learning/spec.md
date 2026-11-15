## MODIFIED Requirements

### Requirement: Weekly stewardship reads usage from Langfuse
rule-steward SHALL, weekly:
- read the `load`, `cite`, `check` and `override` events of the past window from Langfuse;
- report per rule the times loaded, cited, overridden and violated;
- report two counts for the window: rules written (`add`, `confirm`, `update` and `approve` events, not counting `--dry-run` or `--candidate` calls) and memory writes denied (observations carrying the deny marker) (DEC-10);
- flag rules that were never loaded, loaded but never cited, overridden two or more times, stale (not confirmed for 90 days) or in lint findings, and failing golden examples;
- propose retire, revise, merge, split, confirm or promote for each flag.

It SHALL apply only what the owner approves. Retiring SHALL set `status: dropped` with a date and reason, and SHALL never delete a note. If Langfuse is not configured or not reachable, the steward SHALL stop and say so.

#### Scenario: A rule overridden twice
- **WHEN** the past week's events show two overrides of R-12
- **THEN** the steward flags R-12 and proposes a revision or retirement, quoting the override reasons

#### Scenario: Langfuse unreachable
- **WHEN** `LANGFUSE_BASE_URL` is unset or the API does not answer
- **THEN** stats exits with code 3 and a message naming the missing setting, and the steward reports monitoring as unavailable instead of guessing usage

#### Scenario: The window counts
- **WHEN** the past week's events hold three rule writes, two dry runs, one candidate and two observations carrying the deny marker
- **THEN** the report states "rules written: 3" and "memory writes denied: 2"

### Requirement: Rules reach every interactive session
The rule skills SHALL ship in the bundle every Meaningfy user installs, and rules SHALL reach a
session through the bundle's `rules-first` hook (in Claude Code) as well as through the user's
personal global instructions. The hook and the instructions SHALL route the start of an activity to
`rulebook`, and, in a session in which the user stated or corrected something, route to
`rule-learner` when the user wraps up or asks for the card, or before the agent's final summary of the
task, in any interactive session on either CLI. Preferences and corrections SHALL go to the rulebook
and never to the CLI's memory; project state SHALL go to the spine and the repository's docs (DEC-6).
Outside a git repository, rules SHALL be stored in the user's vault, found through `MEANINGFY_VAULT`
when the session does not run in the vault. A session that
cannot find the vault SHALL say once that the rules are not loaded and SHALL carry on with the work.

#### Scenario: A rule stated in a code repository
- **WHEN** the user, working in a code repository with `MEANINGFY_VAULT` set, says "from now on, keep PR descriptions under ten lines"
- **THEN** rule-learner shows the candidate in the rule approval card before its final summary of the task, and on approval, with the row's store set to the vault, `rules.py` writes it to the vault

#### Scenario: A rule applied outside the vault
- **WHEN** a session in a code repository starts an activity for which an active rule fires
- **THEN** the agent loads the rules for that activity and follows the winners, as it would in the vault

#### Scenario: No vault available
- **WHEN** a session outside the vault starts an activity and `MEANINGFY_VAULT` is not set
- **THEN** the agent says once that the rules are not loaded and how to set them, and does the work without them
