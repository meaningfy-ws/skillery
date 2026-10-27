# Seed — existing ground the devops bundle lands on (for `add-devops-bundle`)

**Status:** SECONDARY input. Preserved verbatim, **never groomed, never deleted**.

**Provenance:** Claude Cowork session with Eugeniu Costetchi, 2026-10-25; repo read at v2.11.0 and
the human's stated context.

## §1. Already in skillery (do not restate; reconcile)

- `skills/ci-cd-delivery` — "the application-repo Continuous Delivery side: the deploy trigger, the
  reusable deploy mechanism, and the release/image standard … CI (build, test, lint, coverage,
  architecture, docs publish) is NOT here — that is owned by project-setup; this skill owns only
  CD + release + the delivery contract." Mentions the three-repo deploy model, GHCR images tagged by
  semver + git sha, killing the duplicated SSH/bastion/rsync/.env deploy block.
- `skills/meaningfy-release` — semver policy, GitFlow release/hotfix branches, release-please, PyPI
  Trusted Publishing, supply-chain hardening, SECURITY.md, yanking.
- `skills/project-setup` — owns CI.
- `skills/guardrails` — agentic guardrails for steps where an agent acts.
- `hooks/inventory.yaml` — hook intents single-sourced; `ci` is one of the binding mechanisms.
- Memory note from the human: `skillery-infrastructure-operations` "is part of" skillery — location
  and content to be confirmed when the package lands.

## §2. Meaningfy's stack as stated by the human (Oct 2026)

- Infrastructure deployed and managed with **Terraform and Ansible**.
- Monitoring and alerts with **Prometheus** and related tools; alerts go to email and a Slack channel.
- Internal AI stack: Claude Desktop + skillery; Cognee on pgvector + Neo4j; n8n ingestion; many MCPs
  (Google Workspace, Jira, Confluence, Odoo, GitHub, Neo4j…).
- No agent/assistant quality monitoring (e.g. Langfuse) and no Onyx yet.

## §3. External reference noted

- Basecamp `house-skills` includes `security/harden-github-actions` (MIT). Reference only.

## §4. Standing rules of the human relevant here

- Architecture diagrams express intent, not configuration: no URLs, ports, versions or variable names.
- "One job per agent, keep it focused."
