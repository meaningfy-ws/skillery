# Failure cases: rule-learner

The recorded failures this change answers (task 1.1). Each one is an acceptance test: its fixture
lives under `tests/fixtures/rulebook/` and its test in `tests/test_rulebook.py`.

## F-1 A rule stated in one context does not reach another

- **Evidence.** On 2026-10-27 the owner said "no config, YAGNI": do not add configuration keys or
  switches where a fixed convention works. The rule was kept only in one repository's Claude Code
  auto memory (`yagni-kiss-no-config.md`). A vault session, an opencode session or a session in
  another repository never sees it.
- **Expected.** An approved rule is one note in the owner's vault, `08 How to/Rules/`, and any
  session reaches it with `rules.py load` for its activity: in the vault directly, from a repository
  through `MEANINGFY_VAULT`.
- **Covered by.** `rule-learning`: "Adding an approved rule"; "Default with exception" and "A global
  rule and an activity rule" (the rule is returned in every context it applies to).

## F-2 A checkable preference is never enforced on outputs

- **Evidence.** The handover's brief (§0, "How to work with Eugen") states "British English and no
  em dash for Meaningfy-voice text". Nothing checks a draft against it, so it is broken whenever the
  model forgets it.
- **Expected.** A rule with `check_absent` is run by `rules.py check` on the output before it is
  handed over; a match exits 1 and names the rule and the line. The golden examples of a playbook
  are checked the same way in the weekly review.
- **Covered by.** `rule-learning`: "A check pattern fails"; the golden-example fixture
  (`Bad memo.md`).

## F-3 Conflicting rules accumulate unnoticed

- **Evidence.** The spike (`reasoning-capabilities/inputs/spike/playbook.py`) holds R5 (public
  clients: fixed price) and R6 (tenders: time and materials). Both fire for a public tender and
  nothing says so; a model picks one silently, usually the more recent.
- **Expected.** `lint` reports the pair as a conflict, and `load` for a public tender prints both
  rules and `CONFLICT … ask the owner`. Recency never decides.
- **Covered by.** `rule-learning`: "Unresolvable conflict" and "A dead rule"; the lint fixtures for
  dead, redundant and duplicate rules.
