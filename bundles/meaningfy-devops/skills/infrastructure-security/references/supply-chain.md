# Supply chain

What the CI pipelines of the infrastructure repositories trust, and how that trust is kept narrow.
The reason is concrete: in March 2025 an attacker repointed every version tag of a popular GitHub
action (`tj-actions/changed-files`) to code that dumped secrets into build logs. Workflows pinned to a
commit SHA were not affected.

## The rules

| Rule | Level | Minimum version | Why |
|---|---|---|---|
| **Actions pinned by commit SHA** | MUST | every action not owned by GitHub: `uses: <owner>/<action>@<40-hex-sha> # v<x.y.z>`; turn on the organisation's SHA-pinning policy where available | A tag can be moved to other code; a SHA cannot. |
| **`GITHUB_TOKEN` read-only by default** | MUST | the organisation and repository default set to read; `permissions: {}` or `contents: read` at the top of each workflow; wider rights per job only where needed | A compromised step can only do what the token allows. |
| **Production secrets in Environments** | MUST | production values are secrets of a GitHub Environment (`<stack>-<instance>`), not repository secrets | A workflow run by a pull request cannot read an Environment it does not deploy to. |
| **Dependabot for actions** | MUST | a `.github/dependabot.yml` with the `github-actions` ecosystem, weekly | Pinned SHAs go stale; Dependabot updates the SHA and its version comment together. |
| **Image scan** | SHOULD | `trivy image` in the job that builds the image, failing on a CRITICAL finding that has a fix, reporting the rest; a weekly rescan of the images that run | New vulnerabilities appear after the build. |
| **SBOM per release** | SHOULD | one SBOM per released image, attached to the release; how is owned by `meaningfy-release` | Public-sector buyers and the EU Cyber Resilience Act ask for it. |

On GitHub's free plan, Environment *secrets* work on private repositories, but Environment
*required reviewers* do not. Reviews are practised instead
([four-eyes and break-glass](../SKILL.md#four-eyes-and-break-glass)).

Out of scope at this size: SLSA Build Level 3, hermetic builds, signature admission policies,
commercial container-security platforms.

## Shapes

Pinned action, with the version as a comment so a reader and Dependabot both know what it is:

```yaml
- uses: actions/checkout@<40-hex-sha> # v<x.y.z>
```

Token scope, narrow at the top and widened per job:

```yaml
permissions: {}

jobs:
  deploy:
    permissions:
      contents: read
    environment: <stack>-<instance>
```

Dependabot for actions:

```yaml
version: 2
updates:
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
```

Image scan in the build job:

```bash
trivy image --exit-code 1 --severity CRITICAL --ignore-unfixed <image>:<tag>
```

## Two workflow mistakes to refuse

- Checking out pull-request code in a `pull_request_target` workflow: it runs with the base
  repository's secrets.
- Writing `${{ github.event.* }}` directly into a `run:` line: a crafted title or branch name becomes
  a shell command. Pass it through `env:`.

`zizmor` finds both, and unpinned actions, as one of the infrastructure repositories' PR checks
(`infrastructure-operations`). Converting existing tags to SHAs: `zizmor --fix` or `pinact`.

## Anything fetched at run time

The same principle covers what a playbook or script downloads: an installer fetched by URL names an
exact version and checks its checksum, never "latest". Pinning Ansible collections and Terraform
providers is part of the provisioning practice (`infrastructure-operations`).


A package copied from the operator's machine (a licensed `.deb`, an installer kept outside git) gets the same checksum check, and a second copy kept where another person can reach it when a rollback depends on it.
