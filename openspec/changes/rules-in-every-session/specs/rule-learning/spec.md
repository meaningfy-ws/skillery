## ADDED Requirements

### Requirement: Rules reach every interactive session
The rule skills SHALL ship in the bundle every Meaningfy user installs, and the user's personal global
instructions SHALL route the start of an activity to `rulebook` and the end of a session in which the
user stated or corrected something to `rule-learner`, in any interactive session on either CLI. The
rules SHALL stay in the user's vault, found through `MEANINGFY_VAULT` outside it. A session that
cannot find the vault SHALL say once that the rules are not loaded and SHALL carry on with the work.

#### Scenario: A rule stated in a code repository
- **WHEN** the user, working in a code repository with `MEANINGFY_VAULT` set, says "from now on, keep PR descriptions under ten lines"
- **THEN** rule-learner shows the candidate in the rule approval card at the end of the session, and on approval `rules.py` writes it to the vault

#### Scenario: A rule applied outside the vault
- **WHEN** a session in a code repository starts an activity for which an active rule fires
- **THEN** the agent loads the rules for that activity and follows the winners, as it would in the vault

#### Scenario: No vault available
- **WHEN** a session outside the vault starts an activity and `MEANINGFY_VAULT` is not set
- **THEN** the agent says once that the rules are not loaded and how to set them, and does the work without them

### Requirement: A development rule can live in the repository
In development work in a repository, the rule approval card SHALL offer to store an approved rule in
the repository, under `docs/`, with a pointer line in the repository's `AGENTS.md`. Work outside
development, including all work in Claude Desktop, SHALL store rules in the user's vault. `load`
SHALL read the rules of both stores with one precedence, and a disagreement between the stores SHALL
be reported as a conflict for the user.

#### Scenario: A project convention stated while coding
- **WHEN** the user, coding in a repository, says "never commit straight to main in this repo" and chooses the repository store in the card
- **THEN** the rule is written under the repository's `docs/` as a file change for the next commit, and the vault is unchanged

#### Scenario: A preference stated in Claude Desktop
- **WHEN** the user states a preference in a Claude Desktop session
- **THEN** the card offers only the vault, and the rule is written there on approval

#### Scenario: The stores disagree
- **WHEN** a vault rule and a repository rule set the same slot to different values at equal strength and neither beats the other
- **THEN** `load` prints a `CONFLICT` naming both, and the agent asks the user
