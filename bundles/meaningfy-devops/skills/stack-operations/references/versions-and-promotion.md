# Versions in git, and promotion

**Level: MUST for new and changed stacks.** Images are built once, off the VM; the stacks repository
pins each one as `<version>@sha256:<digest>` in `compose.yml`; promotion and rollback are a PR or a
revert. Why: production runs the same bytes that were tested, every version change is a reviewed
commit, and the previous version is one revert away.

## Images are built once, off the VM

The application repository builds and publishes the image (`ci-cd-delivery` owns how); the stacks
repository only consumes it. Building on the VM gives a different image on every VM and rebuild,
nothing to roll back to, and build tools on a production host. A third-party image is pinned the same
way; an image you patch is built and published like an application image, never on the VM.

## The version lives in git

The full pin is in `compose.yml`, committed: not in a CI variable, a dispatch input, `.env` (not in
git) or a branch head; `git log -p <stack>/compose.yml` answers "which version runs where". A tag
alone is not enough: a re-pushed tag silently changes production; the digest makes the pin exact.

## Changing a version

A PR in the stacks repository changes the pin (by hand, Dependabot or Renovate, or a request from the
application repository); its checks run, `check_stack.py` included; the merge to `main` deploys it,
health-gated. Rollback is a revert of that PR ([rollback.md](rollback.md)).

## Promotion between environments

Where a stack runs in staging and production, promotion is a PR that copies the digest that passed
staging into the production pin. Nothing is rebuilt or set by hand; the PR records what was promoted
and when.
