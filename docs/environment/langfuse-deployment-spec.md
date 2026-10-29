# Langfuse for agent-session observability: short specification

**For:** the infrastructure stacks repository.
**Requested by:** the `rule-learner` EPIC in skillery (`openspec/changes/rule-learner/`).
**Date:** 2026-10-29.
**Status:** draft for the infrastructure owner to confirm or change.

## Purpose

This deployment lets agent skills read how rules and skills are used in Claude Code sessions: which
rules were loaded, cited and overridden, and how often. Skill and tool telemetry and cost are a side
benefit. Langfuse holds traces only, never the rules themselves.

## What to deploy

- **Self-hosted Langfuse** (MIT core, without the `ee/` features) in EU infrastructure, using the existing Terraform and Ansible stack.
- **Components** (per https://langfuse.com/self-hosting): the web and worker containers, Postgres, ClickHouse, Redis or Valkey, and S3-compatible blob storage (MinIO or the cloud equivalent).
- **Sizing:** the Docker Compose reference is 4 vCPU, 16 GiB RAM and about 100 GiB disk (https://langfuse.com/self-hosting/deployment/docker-compose). Start there for a small team and measure.
- **TLS endpoint** on a company domain, reachable from the team's laptops (VPN or SSO in front, as the stack's standard).
- **Monitoring and backup** with the existing Prometheus and alerting. Postgres and ClickHouse are backed up under the stack's backup policy.

## Access

- One Langfuse **project per person**: traces contain private vault and client material.
- **Ingest keys** per person, for the Claude Code plugin (https://github.com/langfuse/Claude-Observability-Plugin). They are stored in the OS keychain, as the plugin supports, never in a repo.
- **Read-only API keys** per person, for the `rule-steward` skill. They are exposed to the agent as environment variables (`LANGFUSE_BASE_URL`, `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`), set in the user's shell profile.

## Privacy and retention (decide before real use)

- Truncate captured text with the plugin's maximum-length setting, and disable image capture unless media storage is configured.
- A per-project exclusion list for sensitive client work, where the plugin is disabled.
- A retention period for traces (90 days is proposed). Deletion on request, per person, per project.
- A GDPR position: the data subjects are team members and the people named in sessions.

## Acceptance criteria

1. Langfuse is deployed by the stack's code and monitored by Prometheus.
2. One real Claude Code session is traced, with tool spans and `skill:<name>` tags visible.
3. A read-only key can list that session's traces through the public API from a laptop.
4. The privacy and retention rule is written down, including the excluded projects.
5. Resource use is measured after one week of real use.

## Out of scope

Cloud Langfuse, enterprise features, and opencode tracing (no known plugin; the skillery side records this as a gap).
