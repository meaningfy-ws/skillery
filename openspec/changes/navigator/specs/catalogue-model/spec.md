## MODIFIED Requirements

### Requirement: The catalogue map is generated and covers skills and agents

`docs/skill-inventory.md` SHALL be generated from `bundles.yaml`, `facets.yaml` and the skill and agent
files, and SHALL show both skills and agents: by bundle, with the bundle requirements, the depends-on
and related edges, and a table per facet that lists the skills and agents for each value. The
by-bundle view SHALL also list each bundle's mods; mods declare no facets. The existing drift test
SHALL fail when the file differs from what the generator produces.

#### Scenario: An agent's facet changes

- **WHEN** an agent's `metadata.stage` changes and the map is not regenerated
- **THEN** the drift test fails

#### Scenario: Looking up the reusable skills

- **WHEN** a reader opens the map's `posture` table
- **THEN** the `reusable` row lists every skill and agent declaring `posture: reusable`

#### Scenario: The navigator bundle in the map

- **WHEN** a reader opens the map's by-bundle view
- **THEN** `meaningfy-navigator` lists the mod `navigator` and no facet table lists it
