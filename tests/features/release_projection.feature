Feature: Release artifacts are projected per archetype
  As a developer scaffolding a Meaningfy repository
  I want the release lifecycle artifacts that fit my archetype
  So that a library can publish to PyPI and every code repo has a disclosure policy,
  without doc-only repos carrying release machinery they do not need.

  Background:
    Given the meaningfy-release lifecycle owns versioning, publishing and disclosure
    And project-setup projects its templates when scaffolding a repository

  Scenario Outline: The right release files appear for each archetype
    Given a new repository scaffolded with archetype "<archetype>"
    When the scaffolding completes
    Then a security disclosure policy is present is "<security>"
    And a PyPI release workflow is present is "<release>"

    Examples:
      | archetype | security | release |
      | library   | yes      | yes     |
      | product   | yes      | no      |
      | doc-only  | no       | no      |

  Scenario: A published library release recovers without breaking pinned installs
    Given a library release that was found to be broken after publishing
    When the maintainer follows the release lifecycle guidance
    Then the broken release is yanked rather than deleted
    And a fixed patch release is published

  Scenario: A library publishes to PyPI without a stored token
    Given a library whose release workflow has been projected
    When the release workflow publishes to PyPI
    Then authentication uses a short-lived OIDC identity
    And no PyPI API token is stored in the repository
