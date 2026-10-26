## MODIFIED Requirements

### Requirement: Dual-CLI parity

The skill SHALL ship to both Claude Code and opencode from its single source in `skills/` (installed
from there on both CLIs, with no committed per-CLI copy), and its body SHALL stay CLI-agnostic.

#### Scenario: The catalogue is validated

- **WHEN** `make validate` runs over the change
- **THEN** `modelling-conventions` resolves under `meaningfy-architecture` in `bundles.yaml`, the
  bundle renderings are in sync, and the body-agnosticism gate passes
