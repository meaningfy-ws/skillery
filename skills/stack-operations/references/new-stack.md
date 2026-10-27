# A new stack

Start from the skill's templates, never by copying another stack. Another stack carries its own
history: values of another service, missing safety steps, workarounds that no longer apply. When the
template and an existing stack disagree, the template wins for new work, and the existing stack's
difference is a conformance gap to report, not a pattern to copy.

## Anatomy

One folder per stack in the stacks repository, deployed to `/opt/stacks/<stack>` on its VM:

```
<stack>/
  compose.yml        <- assets/templates/stack/compose.yml
  .env.example       <- assets/templates/stack/.env.example
  README.md          <- assets/templates/stack/README.md
  config/            service configuration files, mounted read-only
.github/workflows/deploy-<stack>.yml   <- assets/templates/deploy-workflow.yml
```

Data lives under `/opt/data/<stack>/`. The stack name matches the VM role label used by the
infrastructure repository, so one name joins the VM, its configuration, the stack and its workflow
(how the VM side is set up is owned by `infrastructure-operations`).

## Steps

1. Open the change in the stacks repository (the change shape is owned by
   `infrastructure-operations`).
2. Copy the four templates; replace every `<placeholder>`; delete what the stack does not use.
3. `python scripts/check_stack.py <stack>/compose.yml` until every rule is `met`, or `excepted` with a
   reason.
4. Write every variable in `.env.example` with its source; create the secrets as
   `infrastructure-security` says (generated and piped, never shown).
5. Fill the README:
   - **Consumers**: who uses this stack and how ([shared-services.md](shared-services.md)); "none" is
     an answer.
   - **Backup decision**: backed up or not, and why. Some stacks need no backup (rebuildable, no user
     data); the decision and its reason are what is required. Where it is backed up, the backup job,
     its freshness alert and a dated restore test follow `service-reliability`.
   - **Sleep and wake steps**, in order, even if the stack never sleeps yet.
6. Write the acceptance feature ([acceptance-tests.md](acceptance-tests.md)) and run it after the
   first deploy.
7. Register monitoring for the new VM or stack (`service-reliability`).

A README section left as "TBD" is a finding, not a placeholder.
