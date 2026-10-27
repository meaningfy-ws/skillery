# Required checks of the infrastructure repos

A merge to `main` in an infrastructure repo reaches production. So every PR runs checks that need
nobody to remember them.

**MUST: every PR in both infrastructure repos runs these checks, and a red check stops the merge.**
*Why:* they catch a broken plan, a lint error, an invalid compose file, a bad alert rule, an unsafe
workflow or a committed secret before it deploys, which nothing else does.

| Repo | Check | Catches |
|---|---|---|
| provisioning | `terraform fmt -check`, `terraform validate`, `tflint` | formatting drift, invalid configuration, provider mistakes |
| provisioning | `terraform plan`, summary posted on the PR ([terraform-practice](terraform-practice.md)) | a replace or destroy the diff hides |
| provisioning | `ansible-lint` (production profile), `yamllint` | deprecated syntax, non-idempotent tasks |
| stacks | `docker compose config` on every changed stack | a compose file that will not start |
| stacks | the stack conformance check of `stack-operations` | a stack below the per-stack minimum |
| stacks | `promtool check config` and `promtool check rules` | a monitoring change that silently stops scraping or alerting |
| both | `actionlint` and `zizmor` | broken workflows, unpinned actions, injectable expressions, broad token permissions |
| both | `gitleaks` | a secret committed by mistake |

On a private repo on GitHub's free plan a check cannot be made *required*. The rule is practised:
nobody merges on red, and the reviewer's report says whether the checks were green.

What the checks guard on the supply-chain side (actions pinned by SHA, token permissions, image
scanning) is owned by `infrastructure-security`; the checks of an application repository are owned by
`project-setup`.
