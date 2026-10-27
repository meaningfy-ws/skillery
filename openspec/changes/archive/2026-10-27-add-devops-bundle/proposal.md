# EPIC: DevOps bundle — the Meaningfy operations practice, and agents that keep it

> **Golden thread.** Parents: use case [UC-W6](../../../use-cases/UC-W6-devops-engineer.md) (DevOps
> engineer) and the owner's devops practice as it exists in two private repositories
> (`cloud-infrastructure`, `infrastructure-stacks`) and the Confluence space MSC — read on 2026-10-27
> and digested, sanitized, in [`inputs/`](inputs/README.md) (A current practice, B gap analysis,
> C best-practice baseline, D the owner's answers, E the patterns and anti-patterns of an exhaustive
> read of both repos).
> **Depends on:** `agent-authoring-standard`, `single-source-distribution`, `rebundle-by-activity`,
> `add-sales-bundle` (all archived; the last gives the decision card, `agent-decision-requests`, and
> the policy-as-data pattern reused here).
> **Re-shape log:** 2026-10-27 — rewritten from the 2026-10-25 draft. The "devops package" it waited
> for turned out to be the repos' `AGENTS.md`, runbooks and specs plus Confluence (file A). The owner
> widened the scope from "integrate a package" to the whole devops lifecycle with reliable agents,
> including an unattended mode (file D); the draft's rabbit-hole "do not wire the agent to the
> monitoring stack" is withdrawn by that answer.
> 2026-10-27 (later) — the owner answered the PLAN's OPEN-1..6: DEC-8, DEC-9, DEC-10 and DEC-7's
> reporting amended; DEC-14 (backups per stack) and DEC-15 (incidents as GitHub issues) added.
> 2026-10-27 (later) — exhaustive read of both repos (file E): DEC-16 (templates from the repos' own
> best patterns), DEC-17 (rules restated as they really work) added; DEC-6 adopts the repos' plan
> rescoring and baseline acceptance run; *Why* and *Solution outline* strengthened.
> 2026-10-27 (implementation) — the owner: severities are words (`critical`, `serious`, `warning`,
> `info`), never numbers; every secret value is added, read, updated, renamed and deleted in
> Vaultwarden through `bw`, which is the inventory; backups are not encrypted. DEC-18 added: a
> `skillery-feedback` skill in `meaningfy-core`, so a session that finds a skill at fault files a
> fixable issue on skillery.
> 2026-10-27 (privacy review, task 7.1) — inputs A, B, D, E and the *Why* redacted under DEC-4: no
> statement of the current state of Meaningfy's systems, no staffing detail, no client abbreviations.
> File B is now a stub of gap ids and themes; the unredacted inputs are kept in the stacks
> repository under `docs/assessments/2026-10-27/skillery-inputs-before-redaction/`.

## Appetite

**Large, with a hard cut line.** Four skills with their standard templates, three thin agents, two
deterministic checks with tests, two small edits to existing skills. **Cut line:** if the unattended runtime (scheduler, alert
webhook, allow-listed operations in the infra repos) starts pulling work into skillery, stop: skillery
ships the agent, its policy and the runtime contract; building the runtime is a change in
`infrastructure-stacks`. If time runs short, the least-used templates (cutover outline, acceptance
feature, execution log) are cut first; the reviewer agent is not cut (DEC-8).

## Why

Meaningfy's infrastructure is well designed and well written down: three layers (Terraform machines,
Ansible configuration, Compose stacks) joined by one label, spec-first changes, saved-plan applies,
monitored backups, a clean retirement procedure, and two thorough `AGENTS.md` manuals (file A). The
private gap analysis (file B, held in the stacks repository) shows that the practice does not yet
**hold** by itself: checks, review, rollback, environment separation, alert routing, the access
lifecycle and the incident procedure depend on one person remembering them.

The exhaustive read (file E) shows *why* practice drifts in any pair of infrastructure repositories:
good patterns exist once (a matrix deploy with a guard, a fail-closed role, a recorded restore test,
a monitored backup role) and weaker ones get copied. So the bundle cannot only describe practice: it
must ship the **right template** for each recurring shape and name the anti-pattern it replaces.

The people who will operate from now on are the owner and a colleague, **neither a devops engineer**
(file D, Q4). So the expertise has to live in the bundle: an agent that knows the lifecycle, explains
each step's impact in plain words, checks before it acts, and records after. And some operations must
happen with nobody watching: a daily check-up, and a first response to an alert at 3 a.m. (Q4, Q5).

Measured against a small-company baseline (file C), the design is right and the enforcement is
missing. The cheap, high-value controls — checks on every PR, digest-pinned deploys with a real
rollback, external probes, tiered alerts, tested restores, an offboarding checklist, an incident
procedure in force — are the hardening this bundle states as the standard and checks for.

Why now: the gap is a single-person risk today; the catalogue already has the decision card and the
policy-as-data pattern (from `add-sales-bundle`) that an operations agent needs; and the infra repos
already point to a skillery skill that does not exist yet (file A §5).

## Solution outline

1. **Four skills hold the practice and the expectations** (names fixed at PLAN):
   | Skill | Owns |
   |---|---|
   | `infrastructure-operations` | the operating model: the three layers, environments, the safe-change protocol, provisioning and configuration practice (Terraform, Ansible), create / change / resize / sleep / retire, the infra repos' required checks, the three documentation audiences |
   | `stack-operations` | the deployment-stack standard: the per-stack minimum, the deploy workflow, version pinning in git, promotion, rollback, new stack, upgrades with data |
   | `service-reliability` | observe and respond: the monitoring standard, alert tiers, the daily check-up, incident severity and response, client notification, postmortems, backup and restore practice, the unattended-action policy |
   | `infrastructure-security` | access (joiner / leaver, named accounts, MFA), secrets (the source of truth, inventory, rotation, never printed), supply chain (CI pinning, token scope, image scanning), exposure |
2. **Three agents, thin**, dispatching to those skills:
   - `devops-engineer` (`lead`): works with the owner or the colleague on any operation, UC-W6's main
     scenario, in plain words, through the safe-change protocol.
   - `ops-watch` (`scheduled`, also startable in a human session): the daily check-up and the first
     response to an alert, within the unattended-action policy.
   - `infra-reviewer` (`delegated`): the second pair of eyes on an infrastructure PR — plan,
     conformance, blast radius — read-only.
3. **Standard templates** taken from the repos' best patterns (file E, DEC-16), placeholder-only:
   VM module block, minimal group variables, Docker-host playbook, role contract, fail-closed tasks,
   one parameterised backup role with its restore-test record, stack skeleton (compose service shape,
   proxy edge, `.env.example`, README), the matrix deploy workflow, the cutover outline, the
   acceptance feature, the runbook, the execution log, the secret flow, the offboarding checklist.
4. **Two deterministic checks**, shipped as skill scripts with tests in skillery: a **stack
   conformance check** (reads a compose file and reports each per-stack minimum met or not) and the
   **unattended-action policy evaluator** (given an action and its facts, returns act, park or never).
5. **`ci-cd-delivery` corrected** (gap G-27): it keeps the application-repository side (build once,
   publish an image tagged semver + sha, request a deploy); the stacks-repository side moves to
   `stack-operations`; the wrong `op-delivery.yml` claim goes.
6. **Integrate:** `meaningfy-devops` in `bundles.yaml`; UC-W6 updated (`served_by`, slices, open
   points answered); probes, Gherkin, README, CHANGELOG, a setup page for the unattended runtime
   contract; MINOR release.

## Key decisions

- **DEC-1: skillery holds the practice and the expectations; the repos hold the instance** (owner,
  2026-10-27). How Meaningfy provisions, deploys and operates — rules, procedures, standards, checks —
  lives in the devops skills. What is specific to an installation — hosts, stacks, ports, known
  traps, runbooks for one system — lives in `cloud-infrastructure` (provisioning) and
  `infrastructure-stacks` (stacks), and the agents read it there. A repo's `AGENTS.md` keeps its
  instance facts and points to the skills for method; duplicated method moves to the skill.
- **DEC-2: The boundary with delivery.** `ci-cd-delivery` owns the application repository up to "an
  image is published and a deploy is requested". From the request onward — the stacks repository,
  its pins, its deploy, promotion and rollback — is `stack-operations`. CI of an application repo
  stays with `project-setup`; the required checks of the two infra repos are operations
  (`infrastructure-operations`, `stack-operations`).
- **DEC-3: One role bundle `meaningfy-devops`** (kept from the 2026-10-25 draft): the hat you wear
  when you operate, not when you build. `ci-cd-delivery` and `meaningfy-release` stay in
  `meaningfy-building`, where developers install them.
- **DEC-4: Nothing instance-specific or exploitable in skillery** (extended). skillery is public:
  no host, address, port, account, credential, secret location, or a weakness tied to a named system
  enters a skill, an agent, a test fixture or an input. Examples use placeholders.
- **DEC-5: The skills state the hardened target, sized for a small company.** Each control of the
  baseline's minimum set (file C §12) that applies becomes a rule in its owning skill, stated as an
  expectation with the reason and the minimum version; the "do not bother yet" list (file C) becomes
  explicit no-gos in the skills. The agents **check conformance** to these rules and report the gaps,
  so hardening is driven by use; each fix in an infra repo is that repo's own change.
- **DEC-6: Every operation follows one safe-change protocol**: read the state → state the view and
  the plan → dry run (`plan -out`, `--check --diff`, `compose config`) → ask for consent with a
  **decision card** (owned by `executive-communication`, spec `agent-decision-requests`) written for a
  non-specialist: what changes, who notices, for how long, what it costs, how it is undone → apply
  exactly what was shown → verify against monitoring → record. A destroy, replace or data change not
  stated in the plan stops the run. For a non-trivial change the protocol adopts what the stacks
  repo already practises (file E, S-P9): an OpenSpec change in one of three shapes (feature or stack;
  operation or migration with an append-only execution log and its cutover and rollback scripts; bug
  sweep with one hypothesis file per bug), a baseline acceptance run before the change, and an
  independent rescoring of the plan by `infra-reviewer` before execution.
- **DEC-7: Two operating modes, one policy.** In a **human session** any operation is possible
  through DEC-6. **Unattended** (`ops-watch` on a schedule or an alert), the agent acts only within
  the **unattended-action policy**, kept as data with three tiers (owner, file D Q5):
  *act and report* — reversible, without consequence (restart a container, re-run a failed backup,
  free disk from logs or unused images, renew a certificate, redeploy the same version);
  *park and notify* — anything that raises cost significantly, blocks something for long, risks
  critical data loss, touches data, applies infrastructure code, or changes security;
  *never* — destroy, delete data, print or move a secret, open exposure to the internet. An action
  not listed is parked. After two failed attempts on the same symptom it stops and escalates; every
  unattended action is recorded. **Reporting** (owner, 2026-10-27): every alert and every
  finding is always notified in Slack `#infra-alerts`; once work has been done (by an agent or a
  person), a summary of what was done is posted in `#operations`.
- **DEC-8: Review by a subagent, as discipline** (owner, 2026-10-27). No paid GitHub plan: reviews
  cannot be enforced, so they are practised. `infra-reviewer` runs as a subagent on every
  infrastructure change — in the middle of an EPIC change's implementation, at its end, or both —
  covering the plan, conformance to the skills, blast radius and undo path; its report is posted on
  the PR. The author still decides. It is a check, not an approval.
- **DEC-9: Unattended hands are named operations, never a shell.** Unattended, the agent acts only by
  invoking operations the infra repos define as idempotent, logged, allow-listed workflows (one per
  *act and report* action); it reads through monitoring and GitHub. **Where it runs is undecided**
  (owner: a dedicated server, a Claude scheduled task, or OpenClaw); skillery ships a contract any
  of them can meet. Interactive sessions may use SSH through the bastion, with consent per DEC-6.
- **DEC-10: Credentials come from the owner's Vaultwarden session and never enter text** (owner,
  file D Q6, 2026-10-27). The agent uses the Infra owner's `bw` session and may use any credential an operation needs. It reads a
  credential only by piping `bw` output straight into the command that uses it, so it uses the value
  without seeing it: never printed, echoed, stored, committed, reported or pasted into chat. No
  separate agent identity.
- **DEC-11: Three audiences, all current; the repo wins** (owner). Every recorded change updates the
  repo's OpenSpec change or execution log (machines), the repo's docs (people) and the Confluence MSC
  page that summarises it (people). On a contradiction the repo is trusted and Confluence is groomed.
  Confluence pages never hold a credential. The daily check-up reports drift between the three.
- **DEC-12: Client-specific exceptions stay out** (owner). Two client-specific delivery
  procedures are not part of the method; a skill names them as exceptions at most.
- **DEC-13: The agents work from `infrastructure-stacks`, with `cloud-infrastructure` as its
  sibling** (owner, file D Q7). Every agent run starts in the stacks repository; its `openspec/` is the
  spine for every infrastructure change, including a change to the provisioning repo, which the agent
  edits as the sibling checkout `../cloud-infrastructure` in the same change. No other locator,
  configuration file or pointer is needed; a missing sibling is reported, never guessed.
- **DEC-14: Backups are decided per stack** (owner, 2026-10-27). Each stack's spec or README states
  whether its data is backed up and why (some stacks need none). Backups may stay unencrypted as long
  as they can be reached and restored. Where a stack is backed up, the freshness alert and a dated
  restore test are expected. No encryption or off-site-immutable rule is imposed.
- **DEC-15: Incidents, security ones included, are GitHub issues in `infrastructure-stacks`** (owner,
  2026-10-27), notified in `#infra-alerts` when opened and summarised in `#operations` when work on
  them is done (DEC-7 reporting).
- **DEC-16: The standard templates are the repos' own best patterns** (file E, verdict T). Where the
  repos show one good shape and several drifted copies, the good shape becomes the skill's template,
  stripped to placeholders (DEC-4), and the drifted or harmful variant is named in the skill's
  Gotchas as the anti-pattern it replaces (e.g. the single-instance "reference" deploy workflow,
  `prune -af`, role defaults carrying another service's values, insecure fallbacks, cross-layer facts
  pasted by hand). A template is copied from the skill, never from another stack.
- **DEC-17: Rules are stated as they really work.** Each rule is stated as it really
  works, in general terms: private ports are filtered by the host firewall only, and
  Docker bypasses it, so a published private port names its bind address; log rotation is a per-stack
  blocker; a backup that never succeeded raises no alert, so its first run is checked by hand; a
  pending resize left in code powers the server off on the next apply.
- **DEC-18: Problems with a skill come back to skillery as fixable issues** (owner, 2026-10-27).
  A `skillery-feedback` skill in `meaningfy-core` tells any agent where to report (the skillery
  repository), which form, what context to collect, and what never goes into a public issue; the
  person approves the draft before it is filed.

## Rabbit-holes

- **Building the unattended runtime in skillery.** skillery ships the agent, the policy and the
  contract the runtime must meet; the scheduler, the alert webhook and the allow-listed workflows are
  built in `infrastructure-stacks` (cut line).
- **Turning the gap list into fixes inside this EPIC.** Each gap in file B is closed by a change in
  the repo that has it, after the skills state the rule.
- **A runbook library in skillery.** A runbook for one system lives with that system (DEC-1); the
  skills teach how to write and keep one.
- **Re-deciding the three-repo deploy model or the tooling.** Terraform, Ansible, Compose,
  GitHub Actions, Prometheus and Vaultwarden are decided.

## No-gos

- No Kubernetes, Argo CD or Flux; no HashiCorp Vault or OpenBao; no custom OPA/Sentinel policy; no
  Terragrunt, Atlantis or paid Terraform Cloud; no ELK, SIEM or tracing rollout; no 24/7 on-call
  without a contract; no SLSA L3; no ISO 27001 certification work (file C, do-not-bother list).
- No infrastructure instance data, credentials or named weaknesses in skillery (DEC-4).
- No client-specific delivery procedures (DEC-12).
- No change to `agent-authoring-standard`; a needed change re-shapes that EPIC.
- No devops-as-a-service packaging for clients.

---

## What Changes

- **New skills:** `infrastructure-operations`, `stack-operations`, `service-reliability`,
  `infrastructure-security` (names final at PLAN), with the two check scripts and the standard
  templates (DEC-16).
- **New agents:** `devops-engineer` (`lead`), `ops-watch` (`scheduled`), `infra-reviewer`
  (`delegated`).
- **Modified skills:** `ci-cd-delivery` (DEC-2, G-27); `meaningfy-git-workflow` (one line: commit
  scope = service or VM in infra repos).
- `bundles.yaml` (`meaningfy-devops`), UC-W6, `docs/future-features.md`, `docs/environment/`
  (unattended runtime contract and Vaultwarden access), README rows, CHANGELOG.
- `tests/`: policy cases and evaluator, compose-check fixtures, three agent features, trigger probes,
  ownership tags.

No breaking changes for installers. `ci-cd-delivery` loses text, not triggers.

## Capabilities

### New Capabilities
- `operations-practice`: what the devops skills own, the boundary with delivery, the instance/practice
  split, the safe-change protocol, the three audiences, no secrets (DEC-1, 2, 4, 6, 10, 11).
- `unattended-operations`: what an agent may do with nobody watching, how it reports and when it
  stops (DEC-7, 9).

### Modified Capabilities
- None. A new bundle follows the existing `catalogue-governance` and `dual-cli-generation` rules
  unchanged.

## Impact

`skills/` (+4, 1 edited), `agents/` (+3), `bundles.yaml`, `use-cases/UC-W6-*.md`, `tests/`, `docs/`,
README, CHANGELOG. Outside skillery, named as follow-ups: the unattended runtime and the allow-listed
operations in `infrastructure-stacks`; the hardening changes in both infra repos, seeded by the first
conformance reports; `AGENTS.md` in both repos trimmed to instance facts plus pointers (DEC-1); the
Confluence MSC grooming (DEC-11).
