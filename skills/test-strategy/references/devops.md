# DevOps: the matrix

Checks on infrastructure repositories, stacks, deploys, backups and operations. The DevOps skills (`infrastructure-operations`, `stack-operations`, `service-reliability`, `infrastructure-security`) own the techniques; the release and migration checks sit with `meaningfy-release` and `ci-cd-delivery`. This file names them and does not restate their steps. A check that answers two questions has two rows. `gap → C` rows are for the EPIC `activity-test-profiles` to fill or accept.

| Question | Check | Technique owner | Tool | Moment | Decided by | Status |
|---|---|---|---|---|---|---|
| VAL | CHK-38 Stack acceptance tests | `stack-operations` | `@smoke` and `@e2e` scenarios on the live stack | baseline and after a change; smoke after each deploy | the developer | exists |
| VER | CHK-36 Infrastructure repository required checks | `infrastructure-operations` | terraform, ansible-lint, yamllint, actionlint, zizmor, gitleaks | every PR | the verifier | exists |
| VER | CHK-37 Stack conformance check (S1-S9) | `stack-operations` | `check_stack.py` | PR check; daily check-up | the verifier | exists |
| VER | CHK-38 Stack acceptance tests | `stack-operations` | live scenarios | baseline and after a change | the verifier | exists |
| VER | CHK-39 Health-gated deploy and rollback verify | `stack-operations` | `up --wait`, smoke scenarios | deploy; rollback | the verifier | exists |
| VER | CHK-40 Safe-change protocol and infra-reviewer report | `infrastructure-operations` | infra-reviewer subagent | before execute; before merge | the author | exists |
| VER | CHK-41 Terraform plan review | `infrastructure-operations` | `terraform plan` | before apply; after apply | the author | exists |
| VER | CHK-42 Ansible dry run, idempotence and role testing | `infrastructure-operations` | `--check --diff`, a second run | provisioning change; every PR | the verifier | exists |
| VER | CHK-44 Restore drill | `service-reliability` | a timed restore | every 90 days | the verifier | exists |
| VER | CHK-45 Monitoring and alerting standard | `service-reliability` | alert-rule review | monitoring change | the verifier | exists |
| VER | CHK-47 Migration and cutover verify | `ci-cd-delivery` | non-production deploy, data-count compare | migration PR; cutover | the verifier | exists |
| VER | CHK-48 Release gates | `meaningfy-release` | TestPyPI dry run, `make validate` | release | the verifier | exists |
| VER | CHK-51 Shared-service consumer check | `stack-operations` | consumers' smoke scenarios | after `up --wait` of a provider | the verifier | exists |
| VER | CHK-52 Upgrade and rebuild verify | `stack-operations` | version, data counts, `plan` | upgrade; resize; rebuild | the verifier | exists |
| ADQ | whether the stack and infrastructure checks would catch a broken change | none yet | none yet | none yet | the checker | gap → C |
| ROB | CHK-38 Stack acceptance tests, `@negative` | `stack-operations` | negative scenarios on the live stack | baseline and after a change | the adversary | exists |
| CLR | CHK-56 Postmortem completion | `service-reliability` | the postmortem template | after an incident | the cold reader | exists |
| CLR | CHK-57 Runbook test | `infrastructure-operations` | a colleague who is not a DevOps engineer | runbook writing | the cold reader | exists |
| RSK | CHK-36 Infrastructure repository required checks | `infrastructure-operations` | gitleaks, zizmor, plan | every PR | the adversary | exists |
| RSK | CHK-37 Stack conformance check (S1-S9) | `stack-operations` | `check_stack.py` | PR check; daily check-up | the adversary | exists |
| RSK | CHK-40 Safe-change protocol and infra-reviewer report | `infrastructure-operations` | infra-reviewer subagent | before execute; before merge | the author | exists |
| RSK | CHK-41 Terraform plan review | `infrastructure-operations` | `terraform plan` | before apply | the author | exists |
| RSK | CHK-43 Daily check-up | `service-reliability` | nine read-only checks | daily, unattended | the adversary | exists |
| RSK | CHK-44 Restore drill | `service-reliability` | a timed restore | every 90 days | the adversary | exists |
| RSK | CHK-46 Access review, secret check and exposure question | `infrastructure-security` | access review, facts about the port | every 6 months; on demand | the person who reviews | exists |
| RSK | CHK-47 Migration and cutover verify | `ci-cd-delivery` | non-production deploy | migration PR; cutover | the adversary | exists |
| RSK | CHK-48 Release gates | `meaningfy-release` | supply-chain guidance | release | the adversary | exists |
| RSK | CHK-49 Unattended-action policy | `service-reliability` | `decide_action.py` | ops-watch runs | the adversary | exists |
| RSK | CHK-50 Release job idempotence guard | `meaningfy-release` | the tag-exists guard | push to the release branch | the adversary | exists |
| RSK | CHK-51 Shared-service consumer check | `stack-operations` | consumers' smoke scenarios | after `up --wait` of a provider | the adversary | exists |
| RSK | CHK-52 Upgrade and rebuild verify | `stack-operations` | checksummed dump, data counts | upgrade; resize; rebuild | the adversary | exists |
| RSK | CHK-53 Image scan and action pinning | `infrastructure-security` | trivy, pin by SHA | image build; weekly | the adversary | exists |
| RSK | CHK-54 Same-day offboarding checklist | `infrastructure-security` | the offboarding checklist | the leaving day | the adversary | exists |
| RSK | CHK-55 Four-eyes and break-glass for infrastructure, four-eyes | `infrastructure-security` | the second reading by the infra-reviewer | every infrastructure change | the author | exists |
| RSK | CHK-55 Four-eyes and break-glass for infrastructure, break-glass | `infrastructure-security` | the break-glass rule | emergency change | the person on duty | exists |
| RSK | CHK-56 Postmortem completion | `service-reliability` | action items as issues | after an incident | the adversary | exists |
