## MODIFIED Requirements

### Requirement: Bundle grouping preserved
The generated opencode tree SHALL reproduce every bundle in `marketplace.json` (the four role bundles
and the `vault-assistant` workflow bundle) with the same membership as `marketplace.json`.

#### Scenario: Bundle membership matches
- **WHEN** a skill or agent is a member of a bundle in `marketplace.json`
- **THEN** it is a member of the corresponding opencode bundle

#### Scenario: The workflow bundle is generated
- **WHEN** the generator runs with the `vault-assistant` plugin entry present
- **THEN** `.opencode/bundles.json` lists `vault-assistant` with exactly its skills
