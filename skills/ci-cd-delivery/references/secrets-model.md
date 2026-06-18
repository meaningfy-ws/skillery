# Secrets model — Vaultwarden → GitHub Secrets → `.env`

> **C2 — secrets never live in the repo or in this skill.** Everything below is about *flow and
> placement*; all examples use placeholder names, never values.

## The flow

```
Vaultwarden                GitHub Secrets               deploy workflow            VM
(source of truth)  ──copy──▶ (deployment copy,  ──read──▶ assemble .env  ──rsync──▶ stack .env
                             repo/env-scoped)             (the ONLY place)          docker compose up -d
```

- **Vaultwarden = source of truth.** The canonical value of every secret lives there.
- **GitHub Secrets = the deployment copy.** Scoped to the repo / environment that runs the deploy.
  They exist so a workflow can read them; they are a *mirror*, not the master.
- **The deploy workflow is the only place `.env` is assembled** — it reads the GitHub Secrets and
  writes the `.env` that is rsync'd to the VM. There is **no secret-bearing file committed to the
  repo**, **no git-pull on the VM**, and the assembly step is explicit and auditable in the Action
  log.

## Why this shape

- One auditable boundary: if you want to know what a VM received, you read one workflow run.
- No drift between "what's in the repo" and "what's deployed" — the repo carries *no* secrets.
- Rotation is mechanical and traceable (below).

## Rotation procedure

1. **Rotate in Vaultwarden** — change the value at the source of truth.
2. **Update the matching GitHub Secret** — push the new value into the deployment copy for the
   relevant repo/environment.
3. **Re-trigger the deploy** — re-run the deploy workflow so a fresh `.env` is assembled and rsync'd.
   No VM is touched by hand.

Never edit the `.env` on the VM directly — it is a derived artifact and the next deploy overwrites it.

## Break-glass (bastion / SSH) — by reference

Routine deploys never SSH interactively. For incident response that genuinely needs a shell on a VM,
the **bastion / SSH break-glass path is owned by the DevOps runbook** (`cloud-infrastructure` /
`infrastructure-stacks`). This skill **references it and does not duplicate it** — bastion user
management, key issuance, and the access procedure are authoritative there (C1). If you reach for
break-glass, you are outside the standard CD path; coordinate with DevOps.
