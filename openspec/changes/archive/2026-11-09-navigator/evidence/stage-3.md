# Stage 3 — evidence

Gates at merge: `make validate` green (229 mod tests, lint incl. `mod_bindings_match`, Python
tests), `openspec validate navigator --strict` valid, `claude plugin validate
bundles/meaningfy-navigator` passed (with `register.tsx` split into `io.ts`).

Build: three builders on disjoint new files (3.1 thresholds, 3.2 dispatch and hygiene, 3.3 plan
drift and deviations), the lead wrote `strict.ts`, `lean.ts`, the actions and the integration.
Challenge (the DD-33 set): reviewer A (L1+L2), reviewer B (L3–L5), adversarial tester (39 mod
tests, 6 failing; 2 lint tests, 1 failing), then a fresh checker (52 items met, 7 unmet, all fixed
before merge). Findings accepted or rejected in DD-41. DD-39 took the EPIC's cut line.

Open, by hand (task 4.1):
- H-4: a scratch repo with `docs/navigator/build-tier.workflow.json` `"mode": "strict"`, a change in
  apply: the first commit without `test-driven-development` is refused before it runs;
  `/navigator mode loose`; the commit passes with a warning; a new session refuses again.
- H-6: Reconcile EPIC, Next step, Accept and Compact now type their commands into the transcript;
  `clear` and `compact` resolve through `$.command.list()`.
- From earlier stages: 2.11 (desktop rerun), 1.7, 1.9, 1.11.
- Unconfirmed: whether the engine runs `agent.spawn` hooks concurrently (counting before the spawn
  is safe either way, DD-41.2).
