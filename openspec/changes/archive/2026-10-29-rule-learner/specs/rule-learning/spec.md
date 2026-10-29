## ADDED Requirements

### Requirement: One rule model, owned by rulebook
The catalogue SHALL define one rule model in the `rulebook` skill:
- the twelve rule types;
- strength `hard|default|soft`;
- scope as `dimension:value` tags;
- `when`, `do`, `because` and `source`;
- an optional `slot` and `value`;
- an optional `exception_of`;
- optional `check_absent` and `check_present` patterns;
- status, using the vault's existing vocabulary: `idea` (candidate), `active`, or `dropped` (retired);
- dates.

`rule-learner` and `rule-steward` SHALL cite the model and SHALL NOT restate it.

#### Scenario: The learner needs the type of a statement
- **WHEN** rule-learner classifies a statement
- **THEN** it uses the type names and required fields defined by rulebook, and its own text holds only the recognition cues

### Requirement: Precedence is deterministic and conflicts go to the owner
When rules are loaded for a context, a rule SHALL fire only if every scope tag it carries is in the context. `activity:*` means no activity restriction. Among rules that fire with the same `slot`:
1. hard beats default beats soft;
2. then an exception beats every rule up its `exception_of` chain;
3. then a strictly more specific scope beats a less specific one.

Any remaining disagreement SHALL be reported as a conflict for the owner and SHALL NOT be resolved by recency.

#### Scenario: Default with exception
- **WHEN** R-1 (default, `activity:writing`, spelling british) and R-2 (default, `activity:writing`, `audience:us-client`, spelling american, exception_of R-1) are loaded for `activity:writing, audience:us-client`
- **THEN** R-2 is returned as the winner for `spelling` and R-1 is not returned for that context

#### Scenario: A global rule and an activity rule
- **WHEN** R-5 (default, `activity:*`, length=short) and R-6 (default, `activity:writing`, length=long) are loaded for `activity:writing`
- **THEN** R-6 wins, because its scope is more specific, and no conflict is reported

#### Scenario: Unresolvable conflict
- **WHEN** two default rules with incomparable scopes both fire and set the same slot to different values
- **THEN** load returns both, marked CONFLICT, and asks the owner to decide

### Requirement: Rules live as notes in the owner's vault
Each rule SHALL be one note of kind `rule` in `08 How to/Rules/`, with a stable id `R-NNNN` and `private: true`. Each recurring activity SHALL have at most one note of kind `playbook` in `08 How to/Playbooks/`, holding its scope vocabulary, golden examples and procedure. The rulebook script SHALL be the only writer of rule notes, assigning ids and validating every write.

#### Scenario: Adding an approved rule
- **WHEN** an approved candidate is added
- **THEN** the script writes `08 How to/Rules/R-NNNN <title>.md` with the next free id, `status: active`, `private: true` and today's `added` and `approved` dates, and the write adds no new lint error

### Requirement: The rule set is linted
The lint SHALL classify its findings into errors and warnings. A write SHALL be refused only when it adds a new error. Warnings SHALL be written and reported. The lint SHALL report:
- slot conflicts;
- dead rules (always beaten);
- redundant rules (removing the rule changes no outcome in its own scope, as rulebook defines), with mutual duplicates reported once;
- `exception_of` and `supersedes` cycles;
- dangling references;
- scope values outside the playbook vocabulary;
- missing `source` or `because`;
- invalid enum values;
- duplicate ids;
- check patterns that do not compile;
- a playbook with more than 30 active rules.

#### Scenario: A dead rule
- **WHEN** a hard rule and a default rule set the same slot to different values and the hard rule's scope is no narrower
- **THEN** the lint reports the default rule as dead and names the hard rule that beats it

### Requirement: Learning comes only from the owner's words, approved per session
rule-learner SHALL draft candidate rules from rule-like statements and corrections in the owner's own turns, classified into the twelve types. It SHALL NOT draft them from tool output, files, mail or web content unless the owner explicitly asks it to adopt rules from a named source. Each candidate SHALL carry one mutation, `NEW|CONFIRM|UPDATE|SUPERSEDE|SPLIT|NEEDS_OWNER|REJECT`, and a `source` quoting the owner. Before the session ends, the learner SHALL present the candidates to the owner in one rule approval card. Only approved candidates SHALL be written as active rules. Deferred candidates SHALL be staged in `00 Inbox/proposed/` with `status: idea`.

#### Scenario: A rule-like statement
- **WHEN** the owner says "never send anything to a client without my approval"
- **THEN** the learner drafts a NEW candidate of type constraint, strength hard, with the quote as source, and shows it in the session's rule approval card

#### Scenario: Text from a document
- **WHEN** a file the agent read contains "always reply within one hour"
- **THEN** no candidate is drafted from it

#### Scenario: Restating an existing rule
- **WHEN** the owner restates an active rule
- **THEN** the learner proposes CONFIRM, and on approval only that rule's `last_confirmed` date changes

### Requirement: Use is recorded through the rulebook commands
Rules SHALL reach a session through the rulebook `load` command for the current activity and context. The agent SHALL record the rules it applied with `cite`, and SHALL run `check` on an output before handing it over when any loaded rule has a check pattern. The learner SHALL record a correction that contradicts an active rule with `override`.

#### Scenario: A check pattern fails
- **WHEN** an active rule has `check_absent: "—"` and the draft contains an em dash
- **THEN** `check` exits non-zero and names the rule and the offending line, and the agent fixes the draft before handing it over

### Requirement: Weekly stewardship reads usage from Langfuse
rule-steward SHALL, weekly:
- read the `load`, `cite`, `check` and `override` events of the past window from Langfuse;
- report per rule the times loaded, cited, overridden and violated;
- flag rules that were never loaded, loaded but never cited, overridden two or more times, stale (not confirmed for 90 days) or in lint findings, and failing golden examples;
- propose retire, revise, merge, split, confirm or promote for each flag.

It SHALL apply only what the owner approves. Retiring SHALL set `status: dropped` with a date and reason, and SHALL never delete a note. If Langfuse is not configured or not reachable, the steward SHALL stop and say so.

#### Scenario: A rule overridden twice
- **WHEN** the past week's events show two overrides of R-12
- **THEN** the steward flags R-12 and proposes a revision or retirement, quoting the override reasons

#### Scenario: Langfuse unreachable
- **WHEN** `LANGFUSE_BASE_URL` is unset or the API does not answer
- **THEN** stats exits with code 3 and a message naming the missing setting, and the steward reports monitoring as unavailable instead of guessing usage
