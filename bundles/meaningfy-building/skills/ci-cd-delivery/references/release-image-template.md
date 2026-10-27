# Release + image template — build → semver+sha tag → GHCR push

Goal: produce a **pinned, rollback-able image artifact** instead of building on the VM from source.
Stacks then pull that exact image. This closes the biggest current gap (no repo pushes a versioned
image today).

> **DevOps §6 decision (item 2):** adopting registry-pushed versioned images vs keeping build-on-VM
> is **pending ratification** (see [SKILL.md](../SKILL.md) §6). The recommendation is **GHCR +
> semver/sha**. Present it as a recommendation; confirm with DevOps before adopting (C1).

## The standard

- **Build** a Docker image from the repo on a GitHub-hosted runner (not on the VM).
- **Tag by semver + git sha** — both. Semver for humans/rollback selection, sha for exact provenance.
- **Push to a registry** — recommended **GHCR** (`ghcr.io/<org>/<image>`).
- **Version source:** a git tag / GitHub release drives the semver tag. Optional: generate a
  changelog from the release.
- Stacks reference the **pinned** `…:<semver>` (or `…@sha256:…`) tag, never `latest`.

## Illustrative job (placeholders only — C2)

```yaml
# .github/workflows/release.yaml  (ILLUSTRATIVE)
name: release
on:
  push:
    tags: ['v*']              # version source = git tag → image tag

permissions:
  contents: read
  packages: write            # push to GHCR

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Derive tags (semver + git sha)
        id: meta
        # docker/metadata-action emits both a semver tag (from the git tag)
        # and the git sha — the two tags this standard requires.
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/<<ORG>>/<<IMAGE>>
          tags: |
            type=semver,pattern={{version}}
            type=sha

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}   # provided by Actions; not a Vaultwarden secret

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
```

## Handing the pinned image to deploy

The release job's output (`…:<semver>`) is the `image:` input the deploy caller passes into the
reusable deploy workflow — see [`deploy-workflow-template.md`](deploy-workflow-template.md). That is
how a stack ends up **pulling a pinned versioned image** instead of building on the VM, and how a
rollback is just re-deploying a previous tag.

## Rollback

Because every release is a tagged, pushed image, rollback is: re-trigger the deploy with the previous
`…:<semver>` tag. No rebuild, no VM surgery.
