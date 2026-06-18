# Publishing a library to PyPI — Trusted Publishing (OIDC)

The Meaningfy way to publish a Python library: **no API tokens anywhere.** PyPI's Trusted Publishing
exchanges a short-lived OIDC identity token (minted by GitHub Actions, valid ~15 min) for a one-shot
upload token. This removes the long-lived secret that token-based publishing leaves lying around — and
keeps the [secrets boundary in `ci-cd-delivery`](../../ci-cd-delivery/SKILL.md#the-secrets-model)
intact (nothing to store in Vaultwarden or GitHub Secrets for publishing).

References: [PyPI Trusted Publishers](https://docs.pypi.org/trusted-publishers/) ·
[GitHub OIDC → PyPI](https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-pypi).

## One-time setup

1. **On PyPI** (and **TestPyPI** for the dry run): add a *Trusted Publisher* for the project, binding it
   to the GitHub `owner/repo`, the workflow filename (e.g. `release.yml`), and the environment name
   (`release`). For a brand-new project, use "pending publisher" to reserve the name before the first
   upload.
2. **In GitHub**: create a `release` **environment** (optionally with required reviewers — works on
   private/free-tier repos, and gives a human approval gate before the upload).

## The publish workflow (shape, not a runnable copy)

Triggered by the tag/release the release engine produces (SKILL §4). Key invariants:

- `permissions: id-token: write` on the publishing job — **without it GitHub will not mint the OIDC
  token** and the publish fails.
- Build with `python -m build` (or `poetry build`) into `dist/`.
- **TestPyPI dry-run job first**, gating the real publish: upload to TestPyPI via
  `pypa/gh-action-pypi-publish` with `repository-url: https://test.pypi.org/legacy/`; only on success
  does the production job run.
- Production job: `pypa/gh-action-pypi-publish` with **no `user`/`password`** — the action performs the
  OIDC exchange automatically.
- Run the publishing job inside the `environment: release` so the approval gate and the Trusted-Publisher
  binding line up.

```yaml
# illustrative — project-setup renders the canonical version per archetype
publish:
  environment: release
  permissions:
    id-token: write        # REQUIRED for the OIDC exchange
  steps:
    - run: python -m build
    - uses: pypa/gh-action-pypi-publish@release/v1   # no token; OIDC
```

## Anti-patterns

| ❌ Don't | ✅ Do | Why |
|---------|------|-----|
| Store a `PYPI_API_TOKEN` secret | Trusted Publishing OIDC | a long-lived token is a standing breach if leaked |
| Skip the `id-token: write` permission | declare it on the publish job | the OIDC token is never minted; publish fails |
| Publish straight to PyPI untested | TestPyPI dry-run gate first | a bad upload to PyPI can only be yanked, never replaced at the same version |
| Re-upload a fixed build at the same version | bump to a new PATCH | PyPI versions are immutable — same version cannot be overwritten |
