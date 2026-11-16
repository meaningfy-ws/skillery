## ADDED Requirements

### Requirement: Catalogue ids survive a rewrite of the owning skill

A rewrite of `cosmic-python` (the lean standard) SHALL keep every catalogue id with its spelling
and meaning, so that every citer (skills, agents, rule messages) stays true. The clean-code and
SOLID rules SHALL be catalogue entries of their own, one short line each, with ids, so that each
can be tied to the check that enforces it.

#### Scenario: A citer of an existing id after the rewrite

- **WHEN** a Semgrep rule message cites `cosmic-python:AP-DICT-AS-MODEL` after the rewrite
- **THEN** the catalogue still holds `AP-DICT-AS-MODEL` with the same meaning

#### Scenario: A clean-code rule is looked up

- **WHEN** a reviewer looks for the extraction threshold
- **THEN** it finds one catalogue entry, `CC-EXTRACT-THRESHOLD`, with one number, and no second
  threshold anywhere in the skill
