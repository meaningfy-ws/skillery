# Draft phase criteria for the nine default workflow files

Each line names the evidence a reviewer looks at. 50 phases in total.

## skills/architecture/assets/workflows/architecting.workflow.json

| phase id | succeeds | fails |
|---|---|---|
| drivers | the business context document lists the drivers and the developer confirmed them | a container or decision is drafted while the business context document is missing or unconfirmed |
| use-cases | the use case catalogue file exists and the developer accepted each use case in it | a use case names a technology, or a needed goal has no use case file |
| c4 | the C4 diagrams exist and each container traces to a driver in the business context document | a C4 diagram holds an element that no driver or use case accounts for |
| decide | an ADR file exists for each significant decision, each with its considered options | a decision in the diagrams or the document has no ADR file, or an ADR lists one option only |
| domain | the model under `model/` exists and the developer accepted it | the contracts or diagrams name a domain concept that `model/` does not hold |

## skills/conceptual-modelling/assets/workflows/modelling.workflow.json

| phase id | succeeds | fails |
|---|---|---|
| elicit | a schema file under `model/` holds the concepts and the developer confirmed their names and meanings | a class or property in `model/` comes from a guess the developer never confirmed |
| model | `make generate-models` runs without error on the revised schema | the schema linter reports warnings, or `make generate-models` fails |
| generate | the regenerated artefacts are committed with the YAML and their diff touches only what was expected | a generated file is edited by hand, or the generated diff touches an unexpected module |
| validate | the example instances, the competency-question results and the domain expert's review are in `evidence/` | a competency question returns an answer other than the expected one, or no domain expert review is recorded |

## skills/contract-practice/assets/workflows/contract.workflow.json

| phase id | succeeds | fails |
|---|---|---|
| intake | every intake question has the owner's answer or is marked to be confirmed in the open points | a value in the draft has no source in the documents or in the owner's answers |
| draft | the draft is on a branch and its PR cites the library guidance for the skeleton and variant chosen | the draft is on the main line, or the variant choice cites no guidance |
| align | each difference from the parent or back-to-back contract is an open point naming both documents and both values | a number or term was changed to match the other contract without the owner's decision |
| review | the *For a qualified lawyer* list exists, or the PR states that nothing needs a lawyer | a departure from the library defaults appears in the draft but not on the lawyer list |
| negotiate | each counterparty change is sorted with its clause cited, and the revisions are on the branch | a change of legal effect is accepted on the branch without the owner's decision |
| sign | the owner's confirmation of signing and registering is recorded | the agent signed, sent or registered the contract itself |
| harvest | a library proposal PR naming its source contracts and reason exists, or the record says none | a clause enters the library without the owner's acceptance |

## skills/epic-delivery/assets/workflows/epic-delivery.workflow.json

| phase id | succeeds | fails |
|---|---|---|
| ready | the PLAN's clarity-gate verdict is a pass, or each accepted gap is a DEC- with the developer's answer in `design.md` | a stage starts while the gate verdict is missing or a failing gap has no developer decision |
| apply | each stage PR carries the full-gates report in its body, and CI on its head commit is green | a stage merges with a red CI run, or an accepted review finding has no decision in `design.md` |
| accept | `evidence/acceptance.md` records the developer's acceptance of the demo, or a dated skip with who and why | the developer rejects at the demo, or `evidence/acceptance.md` is missing |
| archive | `openspec validate --strict` passes and the change sits under `openspec/changes/archive/` | `openspec validate --strict` fails, or a plan drift is neither in the PLAN nor in `deviations.md` |

## skills/epic-planning/assets/workflows/epic-shaping.workflow.json

| phase id | succeeds | fails |
|---|---|---|
| explore | the seeds read are listed and saved under `inputs/` | a seed the developer gave is not under `inputs/`, or nothing was saved |
| variants | the solution variants and the developer's choice among them are in `inputs/qa.md` | the EPIC follows a variant the developer never saw or chose |
| decide | every open question has the developer's answer in `inputs/qa.md` | a DEC- or a no-go rests on an assumption nobody answered |
| propose | `proposal.md` holds the appetite, the DEC- ids and the no-gos, and its lightweight clarity check passed | `proposal.md` has no no-gos, or the lightweight clarity check finds an undecided key decision |
| design | `design.md` and `tasks.md` exist, and each task names its acceptance and cites the parent EPIC | a task has no acceptance, or the PLAN cites no parent EPIC |
| revise | the clarity-gate verdict on the PLAN is a pass, or the developer's decisions on the remaining gaps are DEC- entries | the clarity gate fails and the gaps are neither fixed nor decided by the developer |

## skills/infrastructure-operations/assets/workflows/devops.workflow.json

| phase id | succeeds | fails |
|---|---|---|
| read | the view cites both repositories and the live state, with each unreadable fact marked unknown | a fact on the card was taken from the docs alone while the live state disagrees or was not read |
| triage | the incident issue exists with its severity label and the reused or new title | an alert is handled with no incident issue, or a duplicate issue is opened for the same title |
| check | the check-up report is posted as a comment on the pinned `Daily check-up log` issue | a check is missing from the report, or the report was not posted anywhere |
| plan | the plan states in plain words what changes, in which files, and what does not | the dry run shows a change the plan did not name |
| dry-run | the saved `terraform plan` or `ansible-playbook --check --diff` output matches the plan | the dry run shows an unplanned destroy, replace or data change |
| card | the decision card exists with the plain-words facts and the raw plan under *Evidence* | the card shows only the raw plan, or omits how the change is undone |
| apply | the command applied is the saved plan or playbook shown on the card, after the owner's consent or the policy script's act verdict | anything is applied that differs from the card, or runs before consent |
| verify | the healthchecks, the URLs and the metrics are normal, and a new `terraform plan` shows no changes | a healthcheck fails, a metric is abnormal, or a new plan still shows changes |
| record | the PR, the `ops-intervention` or incident issue, and the notification are in place | the operation leaves no PR or issue, or the incident issue stays open after a verified fix |

## skills/meaningfy-release/assets/workflows/release.workflow.json

| phase id | succeeds | fails |
|---|---|---|
| branch | the `release/X.Y.Z` or `hotfix/X.Y.Z` branch exists, cut from the right base | the branch is cut from the wrong base, or carries feature commits |
| bump | `CHANGELOG.md` has the new version's section and the version files agree with it | the tag, `VERSION` and `CHANGELOG.md` name different versions |
| validate | `make validate` passes on the release branch | `make validate` fails on the release branch |
| merge | the release PR is merged with its review and green CI | the release PR is merged with red CI or no review |
| publish | the tag and the GitHub release exist and the publish job is green | the publish job fails, or the tag points at a commit other than the merge |
| back-merge | the PR from the release or main line into `develop` is merged | `develop` lacks the release commits after the release |

## skills/sales-operations/assets/workflows/sales.workflow.json

| phase id | succeeds | fails |
|---|---|---|
| research | the dossier is written to the deal with every fact sourced or marked OPEN, and the write logged | a dossier fact has no source and is not marked as an inference |
| meet | the meeting plan and the follow-up exist as a Gmail draft, logged with its draft id | a message is sent rather than drafted, or no follow-up draft exists after the notes |
| offer | the proposal and SoW exist with the estimate from `estimation` attached | the proposal goes out with no estimate, or with exclusions the SoW does not list |
| pipeline | each touched deal has a logged stage write citing its evidence and one dated next activity | a stage move has no cited evidence, or a touched deal has no dated next activity |

## skills/technical-writing/assets/workflows/documentation.workflow.json

| phase id | succeeds | fails |
|---|---|---|
| inventory | `evidence/docs-owed.md` lists each owed page with its type and check, or states that none is owed | a page naming the changed thing is missing from `evidence/docs-owed.md` |
| write | every row of `evidence/docs-owed.md` has its page written or fixed | a row of `evidence/docs-owed.md` has no matching page change |
| verify | the page's commands ran in a scratch environment and the docs gate output is green | a page command fails in the scratch environment, or the docs gate fails |
| cold-read | `evidence/cold-read.md` shows a final read with no stuck step | the last row set in `evidence/cold-read.md` still has a stuck step |
| publish | one PR holds the pages, both evidence files and the gate output in its description | the PR lacks an evidence file or the gate output |

## Unsure

- **architecting `drivers`, `use-cases`, `c4`, `decide`.** The gates on these phases look like the
  next phase's artefact (drivers gates on a use-case file). I wrote criteria for what each phase
  itself produces; check that this reading of the gates is right.
- **architecting `domain`.** The phase hands over to `conceptual-modelling`; "the developer
  accepted it" may duplicate the modelling workflow's `validate` phase.
- **modelling `elicit` and `model`.** The skill does not separate these two phases clearly; I split
  them as "concepts confirmed" and "schema generates". The linter clause in `model` may be close to
  restating `linkml-engineering`'s working loop.
- **epic-delivery `ready`.** The skill has no "ready" step by name; I read it as "the gated PLAN
  is in hand". It also overlaps epic-shaping `revise`.
- **epic-delivery `apply` and `archive`.** "Accepted finding in `design.md`" and "drift in
  `deviations.md`" sit close to restating the Rule of Divergence and the archive rule.
- **epic-shaping `variants`.** No skill text names a variants step or where the choice is recorded;
  `inputs/qa.md` is a guess from the gate.
- **devops `apply`.** Shared by the intervention, incident and unattended variants, so it names both
  consent paths; the incident path may have no card at all.
- **devops `check`.** The check-up runs nine checks; "a check is missing" assumes the reader knows
  the list.
- **release `bump`.** In skillery the version file is `VERSION`; other repositories bump through
  release-please and `pyproject.toml`. Kept generic but names `VERSION`.
- **sales `offer`.** The fail line touches the exclusions invariant owned by `proposal-writing`;
  it may count as rule restatement.
- **contract phases.** The workflow is provisional with no gates; the evidence comes from the skill's
  phase table and may move to the contract repository's override.
