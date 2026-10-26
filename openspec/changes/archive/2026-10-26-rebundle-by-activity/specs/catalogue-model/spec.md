## ADDED Requirements

### Requirement: The purpose facet names Meaningfy's activities

The values of the `purpose` facet in `facets.yaml` SHALL be Meaningfy's activities (software
development, modelling, client delivery, advising, content, offers, proposals, CRM, devops and
personal knowledge, as approved by the owner), and a new value SHALL be added only with the owner's
approval. A bundle's skills and agents SHALL each declare the activity they serve.

#### Scenario: A skill tagged with a retired purpose

- **WHEN** a skill declares `metadata.purpose: quality` after the vocabulary change
- **THEN** validation fails, naming the skill and listing the activity values
