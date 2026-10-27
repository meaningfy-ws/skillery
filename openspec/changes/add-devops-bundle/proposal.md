# EPIC: DevOps bundle — the first package built to the agent standard

> **Golden thread.** Parents: the human's **devops package** (agent + skills, authored outside this
> repo; to be dropped into `inputs/` — see [`inputs/README.md`](inputs/README.md)) and
> [`inputs/2026-10-25-session-findings.md`](inputs/2026-10-25-session-findings.md) (what already exists
> in skillery and in Meaningfy's stack that this bundle must not duplicate).
> **Depends on:** `single-source-distribution` (declares its bundle in `bundles.yaml`),
> `agent-authoring-standard` (its agent is written to the template), both archived 2026-10-26;
> `rebundle-by-activity` catalogued this work as UC-W6 and the `devops` purpose. **Order:** before
> `add-sales-bundle`, because devops is CLI-native and therefore the cheaper proof that the standard
> works.

## Appetite

**Small.** One bundle, one agent, the skills the package already contains, one consistency pass
against existing skills. If it requires changing the agent standard, stop and re-shape the standard.

## Why

Meaningfy deploys with Terraform and Ansible and monitors with Prometheus, and skillery already
carries `ci-cd-delivery` (deploy trigger, reusable deploy workflow, image/release standard) and
`meaningfy-release`. There is no agent that *operates* this: no role that stands up environments,
runs a deploy, reads an alert, or hardens a pipeline. The human has such a package drafted
elsewhere. Integrating it is both a capability and the first external test of the agent standard.

Why now: it is the smallest of the two queued packages and exercises the whole chain — bundle
manifest, agent template, lint, dual-CLI rendering — before the larger sales package does.

## Solution outline

1. Bring the package in **through the standard**: its agent re-cut to `docs/development/agent-template.md`
   (type `delegated` unless the package shows a `lead` is needed), its skills to the skill template.
2. **Dedupe against the catalogue.** Anything the package says about deploy triggers, images,
   releases or GitHub Actions is reconciled with `ci-cd-delivery` and `meaningfy-release`: one owner
   per fact. The package's skills keep what is *operations* (environments, infra-as-code, monitoring,
   incident handling); the existing skills keep what is *delivery*.
3. Declare `meaningfy-devops` in `bundles.yaml`; install on both CLIs; one real run on a Meaningfy
   repo as the acceptance test.

## Key decisions

- **DEC-1: A new role bundle `meaningfy-devops`**, matching the README's "hat you wear" logic, not
  an extension of `meaningfy-building`. Builders and operators are different hats even when the same
  person wears both (consistent with `define-roles-and-raci` DEC-4: roles are not headcount).
- **DEC-2: The boundary is operations vs delivery.** `ci-cd-delivery` owns "how a change reaches an
  environment"; the devops skills own "how environments exist and stay healthy". Overlaps are
  resolved by moving text, never by restating it.
- **DEC-3: The devops agent is the first agent whose conformance is checked by lint, not by eye.**
  If lint and the package disagree, the lint rule is questioned first, then the package.
- **DEC-4: Infrastructure secrets, hosts and credentials never enter a skill or agent body.** Skills
  describe method; the Meaningfy-specific inventory stays in the infra repos. (Architecture diagrams
  likewise express intent, not configuration — a standing rule of the human's.)
- **DEC-5: `harden-github-actions` from Basecamp's house-skills is a reference, not a dependency**
  (per `single-source-distribution` DEC-8: referenced or vendored with provenance, never
  live-installed).

## Rabbit-holes

- **Do not build a runbook library.** Runbooks are per-system and live with the system; the skill
  teaches how to write and use one.
- **Do not wire the agent to the monitoring stack in this EPIC.** An agent that reads Prometheus
  alerts is a `scheduled`-type agent with its own runtime questions; name it as a follow-up.
- **Do not re-open `ci-cd-delivery`'s three-repo deploy model.** It is a decided standard; the devops
  skills consume it.

## No-gos

- **No changes to `agent-authoring-standard`** from inside this EPIC; a needed change is a re-shape
  of that EPIC.
- **No new infra tooling choices** (no Pulumi-vs-Terraform, no observability vendor evaluation).
- **No sales material, no client-facing packaging** of devops as a service.
- **No `design.md` / `tasks.md` in this change round.** Shaping only; the PLAN waits for the package
  to land in `inputs/`.

---

## What Changes

- Add `skills/<devops skills from the package>/` (names fixed at PLAN time from the package).
- Add `agents/<devops agent>.md`, type per the standard, bundle `meaningfy-devops`.
- Add the `meaningfy-devops` entry to `bundles.yaml`, its skills and agent tagged `purpose: devops`;
  add them to UC-W6's `served_by`; run `make bundles` and `make skill-inventory`.
- Move or delete overlapping text in `ci-cd-delivery` / `meaningfy-release` where the package is the
  better owner (each move recorded in the PR description).
- README: one bundle row, one "I want to…" row ("operate / deploy / monitor a service").

No breaking changes.

## Capabilities

### New Capabilities

- `operations-practice`: what the devops skills must cover and where the operations/delivery boundary
  lies.

### Modified Capabilities

- `dual-cli-generation`: one more bundle.
- Possibly `release-lifecycle` if a fact moves out of `meaningfy-release`; decided at PLAN time.

## Impact

- **Files:** `skills/` (+N), `agents/` (+1), `bundles.yaml`, `use-cases/UC-W6-*.md`,
  `docs/skill-inventory.md`, README, possibly two existing skills.
- **Install:** both CLIs; verified by a fresh install and one real run.
- **Follow-up named:** a `scheduled` alert-reading agent.
