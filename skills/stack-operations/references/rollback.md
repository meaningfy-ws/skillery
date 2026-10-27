# Rollback

Rollback = revert the PR that caused the problem, merge, and let the deploy workflow redeploy the
previous pin. No command on the VM, no hand edit of `compose.yml` there.

## Keep the last 3 images

**Level: MUST.** Each VM keeps the newest 3 images of every repository; an image in use is never
removed. Never run `docker system prune -a`, `docker image prune -a` or any prune with `-a`
after a deploy. Why: `-a` removes every image no container uses at that moment, which is exactly the
previous version you would roll back to, and the images of a co-hosted stack that is stopped. A
revert then has to pull again, and if the registry no longer has the image, there is no way back.
The deploy template's last step does the keep-3 cleanup.

## Steps

1. Confirm the symptom started with the deploy (the workflow run, the healthchecks, monitoring).
2. `git revert <commit>` on a branch, PR, merge. Say in the PR what broke and why it is reverted.
3. The workflow redeploys; `up --wait` must pass.
4. Verify: healthchecks, the stack's acceptance smoke scenarios, the consumers in its README.
5. Record it, as for any intervention (`infrastructure-operations`).

## When a revert is not enough

A change that also changed data (a schema migration, a format upgrade) cannot be undone by a
revert alone. Such a change carries its own undo, written before it runs:
[upgrades-with-data.md](upgrades-with-data.md) and [cutover.md](cutover.md). Database migrations stay
backward-compatible across one release (expand, then contract) so that the previous image still
runs on the new schema.

Rehearse a rollback once per stack, on a quiet day, so the first one is not during an incident.
