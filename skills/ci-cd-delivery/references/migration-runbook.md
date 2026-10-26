# Migration runbook — per-repo PR recipe (Q10.3 = A)

A concrete, executable recipe to bring **one application repo** onto the standard: replace the
inline ~7×-duplicated SSH/bastion/rsync/`.env` deploy block with a thin caller that `uses:` the
canonical `devops-toolkit` reusable workflow. A team should be able to run this without re-deriving
the pattern.

> **C1 — coordinate with DevOps first.** The reusable-workflow ref and the trigger standard are §6
> decisions. Do not land this PR before DevOps confirms the `uses:` reference (see
> [SKILL.md](../SKILL.md) §6, items 1 and 3).

## Preconditions

- VMs already provisioned/configured by `cloud-infrastructure` (not your concern).
- The target stack exists in `infrastructure-stacks`.
- The `devops-toolkit` reusable workflow ref is confirmed with DevOps.
- The repo's GitHub Secrets hold the deployment copy of the needed Vaultwarden values (see
  [`secrets-model.md`](secrets-model.md)).

## The PR recipe

1. **Locate the inline deploy block.** Find the workflow(s) containing the SSH/bastion/rsync/`.env`
   steps (the block duplicated across repos). Note every secret and input it references.

2. **Inventory inputs & secrets.** List what the inline block consumes: SSH host/user/key, the
   `.env` contents/values, the target stack name, the environment. This is your mapping table for
   step 4.

3. **Add the thin caller.** Replace the inline job with a job that `uses:` the reusable workflow,
   per [`deploy-workflow-template.md`](deploy-workflow-template.md). Keep the trigger
   (`workflow_dispatch` recommended, pending §6) and delete all rsync/SSH/`.env` logic from the repo.

4. **Map inputs → `with:` and secrets → `secrets:`.** Wire each item from step 2 into the reusable
   workflow's interface. Values stay in **GitHub Secrets**; only names appear in YAML (C2).

5. **(Recommended, pending §6.2) Adopt a pinned image.** If migrating off build-on-VM, add the
   release job from [`release-image-template.md`](release-image-template.md) and pass its
   `…:<semver>` tag as the `image:` input so the stack pulls a pinned versioned image.

6. **Delete the duplication.** Remove the now-dead inline block entirely. The deploy mechanism must
   exist in exactly one place — `devops-toolkit` — and nowhere in this repo.

## Verify

- Run the deploy workflow against a **non-production / sandbox** environment first.
- Confirm in the Action log: `.env` assembled in the workflow (not the repo), rsync succeeded, the
  stack came up. No interactive SSH, no git-pull on the VM.
- Confirm the diff removed the inline block and added only the thin caller (and, if step 5,
  the release job).
- If a pinned image was adopted, confirm the VM is running the expected `…:<semver>` tag and that
  re-deploying a previous tag rolls back cleanly.

## Done

The repo now triggers a deploy via the standard, owns **no** deploy glue of its own, and (optionally)
ships a registry-pushed versioned image. Repeat per repo until the ~7× duplication is gone.
