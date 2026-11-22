## ADDED Requirements

### Requirement: The navigator warns in tokens
The `navigator` mod SHALL read the session's context size from `usage.context.tokens` first and
SHALL fall back to the `*_percent` keys of `session-thresholds.json` only when the CLI reports no
token count. It SHALL offer a fresh session at `fresh_offer_min_tokens` (90 000), a compaction at
`compact_offer_tokens` (150 000) and warn at `context_warn_tokens` (250 000), reading the three
keys from `skills/guardrails/assets/session-thresholds.json`. Every hygiene warning SHALL print
the number it used and its unit (tokens, or percent with the fallback said), and SHALL NOT block
any action, also in strict mode (D-1, DEC-4).

#### Scenario: A session passes the compaction threshold
- **WHEN** `usage.context.tokens` reads 152 300 at the end of a turn, right after a commit
- **THEN** the band shows `152 300 tokens — compact at a safe point` with its Accept action, and the next turn runs whether or not the person accepts

#### Scenario: The CLI reports no token count
- **WHEN** the event carries no `usage.context.tokens` and the context stands at 61 % of the window
- **THEN** the navigator uses `compact_offer_percent` and the warning reads `61 % (no token count from the CLI)`

#### Scenario: A large window
- **WHEN** a session on a 1 M window reads 260 000 tokens, 26 % of the window
- **THEN** the navigator warns at `context_warn_tokens` with `260 000 tokens`, although the percent keys alone would stay silent

#### Scenario: Strict mode
- **WHEN** strict mode is on and a session passes 250 000 tokens
- **THEN** the warning shows and no action, dispatch or edit is blocked
