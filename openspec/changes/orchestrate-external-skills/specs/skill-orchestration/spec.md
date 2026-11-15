## ADDED Requirements

### Requirement: One skill routes a goal to the skills that serve it
The catalogue SHALL hold one orchestrator skill, `skill-orchestration`, that, for a goal, names the
Meaningfy skill that owns the work, any external skill that helps, when and how to use it, and the
Meaningfy preference that wins over it (proposal DEC-2, DEC-3; design D-9, D-10). Its routing SHALL
sit in one reference per bundle, opened only when the goal belongs to that bundle (DEC-11, DEC-12).

#### Scenario: A goal served by an external skill
- **WHEN** the owner asks to prepare a negotiation with a client
- **THEN** the agent reaches the external negotiation skill through the orchestrator, together with the Meaningfy sales skill that owns the conversation

#### Scenario: A goal served by a Meaningfy skill alone
- **WHEN** the goal has no external skill registered for it
- **THEN** the orchestrator names the Meaningfy skill and no external one

### Requirement: Every skill is reachable through a row
Every folder of `skills/` other than `skill-orchestration` itself, and every skill named in a register entry with a `bundle` SHALL appear in
at least one row of the orchestrator. Every external skill named in a row SHALL be registered, and
SHALL sit in the reference of its own bundle. Validation SHALL fail when any of these does not hold
(DEC-3; design D-11).

#### Scenario: A new skill without a row
- **WHEN** a change adds a skill under `skills/` and no orchestrator row names it
- **THEN** `make validate` fails and names the skill

#### Scenario: A row names an unregistered external skill
- **WHEN** a row names an external skill that no register entry lists
- **THEN** `make validate` fails and names the skill

### Requirement: A Meaningfy preference overrides an external skill
Where a registered external skill conflicts with a Meaningfy rule, the orchestrator SHALL state
which Meaningfy preference wins, and the agent SHALL follow it with the external skill loaded
(DEC-7). Each override SHALL be written in the orchestrator's own words, as its one home, and SHALL
NOT cite a rule id (DEC-18).

#### Scenario: The external skill advises a discount
- **WHEN** the external negotiation skill is loaded and its method leads to a price concession
- **THEN** the agent offers no discount and says the Meaningfy preference forbids it

#### Scenario: An override is written
- **WHEN** a reviewer reads the overrides in the orchestrator
- **THEN** each one states the preference in plain words and none cites a rule id

### Requirement: The offering document sets the price
The orchestrator SHALL state that a commercial offering document sets the price, and that an
external skill may inform how an offering is designed or a conversation is prepared but never sets
or changes a price. No row SHALL name a price, a package or a term of an offering (DEC-19).

#### Scenario: An external skill proposes a price
- **WHEN** an external offer or pricing skill is loaded and its method produces a price
- **THEN** the agent takes the price from the offering document and says the external skill does not set it

### Requirement: Documentation follows the Meaningfy voice
For documentation, the orchestrator SHALL name Meaningfy's voice as the style source, with the Vale
rules as its check once they are delivered and a reviewer's check until then, and SHALL treat the
external documentation skill as guidance only (DEC-20, design RISK-13).

#### Scenario: The external documentation skill advises another style
- **WHEN** the external documentation skill is loaded and its advice conflicts with Meaningfy's voice
- **THEN** the agent follows Meaningfy's voice: British spelling, no em dash, no contractions in binding text

### Requirement: No house rule is invented for marketing or management
For marketing and management, the orchestrator SHALL say that no Meaningfy rule exists yet and that
the external skill is used as it is. It SHALL NOT state a marketing or management rule of its own
(DEC-10).

#### Scenario: A marketing goal
- **WHEN** the owner asks for help with a positioning or messaging goal
- **THEN** the orchestrator routes to the external skill and adds no Meaningfy marketing rule

### Requirement: The orchestrator is reached from a pointer line, not from AGENTS.md
Each Meaningfy skill or agent that owns a row with external help SHALL carry one pointer line, at
the point where that help applies, naming `skill-orchestration`. The orchestrator SHALL otherwise be
reached through its own description. No rule in `AGENTS.md` SHALL make every session load it
(DEC-4; design D-13).

#### Scenario: A skill with external help
- **WHEN** a reviewer reads a Meaningfy skill named as owner in a row with external help
- **THEN** it holds one line that points to `skill-orchestration`

#### Scenario: The root binding
- **WHEN** a reviewer reads `AGENTS.md`
- **THEN** it holds no instruction to load `skill-orchestration` in every session

### Requirement: A missing external skill is named, not ignored
When the orchestrator routes to an external skill that is not installed, the agent SHALL say so,
offer the install command taken from the register, and, if the owner declines, say that it
continues without it (DEC-12).

#### Scenario: The external skill is not installed
- **WHEN** a goal routes to an external skill the session does not have
- **THEN** the agent names the skill and its install command before it continues

#### Scenario: The owner declines the install
- **WHEN** the owner declines to install the missing external skill
- **THEN** the agent says it continues without it and does the work with the Meaningfy skill
