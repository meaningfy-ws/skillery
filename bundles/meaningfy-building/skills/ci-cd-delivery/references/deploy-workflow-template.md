# Deploy-workflow template — illustrative caller + pointer to the source of truth

> **This template is illustrative / teaching only.** The **single runnable source of truth is the
> `devops-toolkit` reusable workflow** (the existing `op-delivery.yml`). App repos `uses:` it.
> **Skillery never hosts a second runnable copy** — that is the duplication this skill exists to
> kill. Copy the *shape*, not a parallel implementation. (Q10.1 = A.)

## The single source of truth

The deploy mechanism — the SSH/bastion/rsync/`.env` block — lives **once**, in `devops-toolkit` as a
**reusable workflow**. `ted-rdf-conversion-pipeline` already consumes it. Your app repo should call
it, not re-implement it.

Where it lives and how it is invoked is a **DevOps §6 decision** (see [SKILL.md](../SKILL.md) §6,
items 1 and 3). Confirm the exact `org/repo/.github/workflows/<file>@<ref>` reference with DevOps
before wiring it (C1).

## Illustrative caller (placeholders only — C2)

A consuming app repo's deploy workflow is *thin*: it declares when to deploy and maps inputs +
secrets into the reusable workflow. It contains **no** rsync/SSH/`.env` logic of its own.

```yaml
# .github/workflows/deploy.yaml  (ILLUSTRATIVE — confirm the `uses:` ref with DevOps)
name: deploy
on:
  workflow_dispatch:          # recommended trigger (pending §6 ratification)
    inputs:
      environment:
        description: target environment
        required: true

jobs:
  deploy:
    # Source of truth — the canonical reusable workflow in devops-toolkit.
    # Replace with the ref DevOps ratifies (§6.1 / §6.3).
    uses: <<ORG>>/devops-toolkit/.github/workflows/op-delivery.yml@<<REF>>
    with:
      stack: <<STACK_NAME>>            # which infrastructure-stacks dir
      environment: ${{ inputs.environment }}
      image: <<REGISTRY>>/<<IMAGE>>:<<TAG>>   # pinned image (see release-image-template.md)
    secrets:
      # Names only — values come from GitHub Secrets (the deployment copy of Vaultwarden).
      # See secrets-model.md. NEVER inline a value here.
      SSH_HOST: ${{ secrets.SSH_HOST }}
      SSH_USER: ${{ secrets.SSH_USER }}
      SSH_KEY: ${{ secrets.SSH_KEY }}
      ENV_FILE_CONTENTS: ${{ secrets.ENV_FILE_CONTENTS }}
```

## What the reusable workflow does (so you don't re-implement it)

Documented here for understanding only — it is implemented in `devops-toolkit`, not here:

1. Reads the mapped secrets (the deployment copy of Vaultwarden values).
2. **Assembles `.env`** — the only place this happens (see
   [`secrets-model.md`](secrets-model.md)).
3. **rsync**s the stack + `.env` to the target VM (no git-pull, no interactive SSH).
4. `docker compose up -d` against the stack.

## Cross-repo trigger variant

If, instead of `uses:`-ing the reusable workflow, the ratified standard is a **cross-repo trigger**
into `infrastructure-stacks`, the caller is a `repository_dispatch` / `workflow_dispatch` emit rather
than a `uses:` job. The recommendation and the choice between these are **pending §6 ratification**;
present both, settle neither without DevOps.
