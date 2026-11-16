# Docs owed: delivery-retrospective

Decided by the lead at accept (2026-11-15): **no docs owed.** The EPIC adds a skill and changes
user-facing behaviour (the mark line, a navigator warning), and every page it touches was written in
its build stages:

| Page | What it says | Written in |
|---|---|---|
| `skills/session-retrospective/SKILL.md` | Quick Start with a worked run, what each output file holds, what the numbers cannot say | stage 1 (1.2) |
| `README.md` | `session-retrospective` in the `meaningfy-building` row | stage 1 |
| `docs/use-cases.md`, `docs/skill-inventory.md` | the skill's entry (inventory generated) | stage 1 |
| `docs/environment/navigator.md` | the "No mark line" warning | stage 2 (D-25 F2) |
| `docs/environment/langfuse-setup.md` | the phase and stage row points to the mark and result lines | stage 2 (4.1) |
| `docs/environment/dual-cli/compatibility.md` | the opencode gap: no warning, `guessed` is the only signal | stage 2 (3.3) |
| `CHANGELOG.md` | two lines for the installer, released in 3.16.0 | stages 1 and 2 |

No architecture page or ADR changes.
