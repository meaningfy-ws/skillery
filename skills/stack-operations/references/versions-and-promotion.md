# Versions in git, and promotion

**Level: MUST for new and changed stacks.** Images are built once, off the VM; the stacks repository
pins each one as `<version>@sha256:<digest>` in `compose.yml`; promotion and rollback are a PR or a
revert. Why: production then runs the same bytes that were tested, every change of version is a
commit with an author and a review, and the previous version is one revert away.

## Images are built once, off the VM

The application repository builds and publishes the image (`ci-cd-delivery` owns how). The stacks
repository only consumes it. Building on the VM gives a different image on every VM and every
rebuild, nothing to roll back to, and build tools on a production host.

A third-party image is pinned the same way. An image you patch (an extra layer on an upstream image)
is built and published like an application image, never on the VM.

## The version lives in git

The full pin is in `compose.yml`, committed. Not in a CI variable, not in a dispatch input, not in
`.env` (which is not in git), and never a branch head. If you must see "which version runs where",
`git log -p <stack>/compose.yml` answers it.

A tag alone is not enough when the image changes: a re-pushed tag silently changes production.
The digest makes the pin exact.

## Changing a version

1. A PR in the stacks repository changes the pin (by hand, by Dependabot or Renovate, or by a
   request from the application repository).
2. The PR's checks run, including `check_stack.py`.
3. Merge to `main`; the deploy workflow pulls and starts it, health-gated.

## Promotion between environments

Where a stack runs in staging and production, promotion is a PR that copies the digest that passed
staging into the production pin. Nothing is rebuilt and nothing is set by hand; the PR is the record
of what was promoted and when.

## Rollback

A revert of the PR that changed the pin, then the normal deploy. Details and the image-keeping rule
are in [rollback.md](rollback.md).
