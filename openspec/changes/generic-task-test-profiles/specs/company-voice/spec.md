<!-- A new capability (generic-task-test-profiles DEC-8). It covers `meaningfy-voice` and its channel
     profiles; this change writes only the post requirements. The tone of the LinkedIn and blog
     channels stays the default profile until `add-content-creation`. -->

## ADDED Requirements

### Requirement: A public post is drafted against confirmed criteria and read by a stranger
`meaningfy-voice` SHALL hold the post profile in the LinkedIn channel file
(`references/channels/linkedin.md`), in a `## Test profile` section: what makes a public post
succeed and fail, the reader's role (a stranger scrolling), what that reader attacks, and the two
step lines (criteria before drafting, the reader before hand-over). The blog channel file SHALL
point to that section and state only what differs for an article. For a post or
an article the owner SHALL confirm the criteria before drafting, and the reader SHALL read the
draft by the brief of `guardrails` before it is handed over. The agent SHALL NOT publish or post.
Until their tone is written, both channel files SHALL keep pointing to the default voice profile
(generic-task-test-profiles DEC-1, DEC-3, DEC-5, DEC-8).

#### Scenario: A LinkedIn post
- **WHEN** an agent is asked to write a LinkedIn post announcing a new service
- **THEN** it proposes the success and failure criteria, drafts after the owner confirms them, and a stranger-scrolling reader reports against them before the post is handed over

#### Scenario: A claim with nothing behind it
- **WHEN** the draft says a service "is trusted across the EU" and a criterion says every claim names real work
- **THEN** the reader marks that criterion failed and quotes the sentence

#### Scenario: A blog article
- **WHEN** an agent is asked for a blog article
- **THEN** it follows the LinkedIn profile through the blog channel file, with the differences that file states

### Requirement: A request for a post finds the profile
The description of `meaningfy-voice` SHALL name LinkedIn posts and blog articles published under
Meaningfy's name, so that a request to write one loads the skill. `tests/trigger_probes.yaml` SHALL
hold a positive probe for it and a near-miss that expects `explanatory-writing`. The skill SHALL
stay a profile holder: it SHALL gain no writing method (DEC-8; Q-13).

#### Scenario: A post request
- **WHEN** the probe "write a LinkedIn post announcing our new SHACL validation service" is evaluated
- **THEN** it expects `meaningfy-voice`

#### Scenario: An explainer request
- **WHEN** the probe "write a blog-style explanation of how SHACL validation works" is evaluated
- **THEN** it expects `explanatory-writing`, as a near-miss of `meaningfy-voice`
