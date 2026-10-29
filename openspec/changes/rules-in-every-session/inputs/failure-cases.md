# Failure cases: rules in every session

Acceptance tests for the change. Each case is recorded with its evidence, the behaviour expected and
the scenario of [`specs/rule-learning/spec.md`](../specs/rule-learning/spec.md) that decides it.

| Id | Step | Failure | Evidence | Expected | Scenario |
|---|---|---|---|---|---|
| F-1 | 1 | A rule stated in a code repository is lost, and a vault rule is not applied there. This is rule-learner F-1 again, outside the vault. | `bundles.yaml` puts the three skills in `vault-assistant`; `docs/environment/global-prompt.md` has no rules line; the only load line is `skills/vault-setup/assets/AGENTS.md:31`. | The skills ship in `meaningfy-core`, and the personal routing policy sends any interactive session to `rulebook` and `rule-learner`. | Rules reach every session |
| F-2 | 1 | The Claude Code allow rule names `vault-assistant`, so it stops matching when the skills move. | `skills/vault-setup/references/permissions-claude-code.md:110`. | The rule lives in `rulebook`'s `commands.md` with the `meaningfy-core` path; no skill keeps the old pattern. | Rules reach every session |
| F-3 | 2 | A project convention ("never commit straight to main in this repo") can only go to one person's vault, where the team never sees it. | `rules.py` knows one store (`find_vault()`). | The rule is written to the repository's `docs/rules/`. | A rule stated in a code repository |
| F-4 | 2 | A team rule and a personal rule that disagree are not reported, because no tool reads both. | `load` and `lint` read the vault only. | `load` prints `CONFLICT R-… vs P-…`. | The stores disagree |
