# Migration runbook — per-repo PR recipe (Q10.3 = A)

A concrete recipe to bring **one application repo** onto the standard: delete the inline
SSH/bastion/rsync/`.env` deploy block and replace it with a **deploy request** to
`infrastructure-stacks` (see [`deploy-workflow-template.md`](deploy-workflow-template.md)). A team
should be able to run this without re-deriving the pattern.

> **C1 — coordinate with DevOps first.** The request shape (PR or dispatch) is the one the stacks
> repository documents; the deploy itself is `stack-operations`'s.

## Preconditions

- VMs already provisioned/configured by `cloud-infrastructure` (not your concern).
- The target stack exists in `infrastructure-stacks` and its deploy workflow is in place.
- The repo has a token, stored as a GitHub Secret, that may open PRs (or dispatch) in the stacks
  repository only.

## The PR recipe

1. **Locate the inline deploy block.** Find the workflow(s) containing the SSH/bastion/rsync/`.env`
   steps. Note every secret and input it references.
2. **Move what the stack needs.** Any `.env` value or secret the inline block used belongs to the
   stack in `infrastructure-stacks` (its deploy workflow assembles `.env`); hand that list to whoever
   owns the stack, values through Vaultwarden, never in a PR.
3. **Adopt a pinned image.** Add the release job from
   [`release-image-template.md`](release-image-template.md) so each release has a `tag@sha256` to
   request.
4. **Add the request job** per [`deploy-workflow-template.md`](deploy-workflow-template.md).
5. **Delete the duplication.** Remove the inline block and the SSH secrets it used from this repo.

## Verify

- Request a deploy to a **non-production** environment first.
- Confirm the stacks repository received the request (PR or run) for the expected `tag@sha256`, and
  that its deploy reported the stack healthy.
- Confirm the diff removed the inline block and added only the release and request jobs.

## Done

The repo ships a registry-pushed versioned image and requests its deploy; it owns **no** deploy
glue. Repeat per repo until no app repo carries one.
