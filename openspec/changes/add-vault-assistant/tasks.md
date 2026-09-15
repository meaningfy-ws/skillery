> PLAN, tasks half (type: tasks). Derived from EPIC `add-vault-assistant` ([`proposal.md`](proposal.md),
> [DEC-1 to DEC-16](proposal.md#key-decisions)); design in [`design.md`](design.md). Tasks marked **(cut n)** follow the EPIC's cut
> order ([`proposal.md#appetite`](proposal.md#appetite)).

## 1. Baseline (RED)

- [x] 1.1 Build the fixture described in [`design.md#testing-approach`](design.md#testing-approach).
- [x] 1.2 Run RG-01 to RG-08 without the skills; record each result in the RED column.

## 2. Foundations

- [x] 2.1 `vault-conventions`: `SKILL.md`, `references/kinds.md`, `references/project-files.md`.
      Acceptance: [`specs/vault-conventions/spec.md`](specs/vault-conventions/spec.md), all five
      requirements.
- [x] 2.2 `vault-setup`: `SKILL.md`; `references/` `permissions-claude-code.md`,
      `permissions-opencode.md`, `obsidian.md`, `sync.md`, `memory-and-connectors.md`,
      `final-check.md`; `assets/AGENTS.md`; `assets/templates/` (one file per kind in `kinds.md`).
      No private value anywhere. Acceptance: [`specs/vault-setup/spec.md`](specs/vault-setup/spec.md).
- [x] 2.3 `vault-setup/references/scheduler.md` **(cut 3)**.

## 3. Project lifecycle and curation

- [x] 3.1 `vault-project`. Acceptance: [lifecycle spec](specs/vault-project-lifecycle/spec.md),
      requirements "A project starts only with a falsifiable done" and "Closing a project archives it
      only after a yes".
- [x] 3.2 `vault-resume`. Acceptance: same spec, "Resuming a project reads one project only".
- [x] 3.3 `vault-capture`. Acceptance: same spec, "Capture files signal and never invents it".
- [x] 3.4 `vault-promote`. Acceptance: [`specs/vault-curation/spec.md`](specs/vault-curation/spec.md),
      "Promotion checks the kind before a note leaves staging".
- [x] 3.5 `vault-tidy` **(cut 1)**. Acceptance: same spec, "Tidying waits for an explicit yes".

## 4. Rhythm

- [x] 4.1 `vault-planning` with `references/planning-practices.md`; the month and year horizons are
      **(cut 2)**. Acceptance: [`specs/vault-planning/spec.md`](specs/vault-planning/spec.md).
- [x] 4.2 `vault-daily` with `references/daily-note-format.md`. Acceptance:
      [`specs/vault-daily/spec.md`](specs/vault-daily/spec.md).

## 5. Verify the skills (GREEN)

- [x] 5.1 Re-run RG-01 to RG-08 with the skills, and run the happy paths and the send guard RG-09 to
      RG-11; every row passes; fix and re-run until it does.
- [x] 5.2 In one opencode session at a set-up vault, ask the agent to send a mail and to fetch a web
      page; record the result in `docs/environment/dual-cli/compatibility.md` (clears DEC-7's UNVERIFIED). Result
      2026-09-15: run, inconclusive (opencode 1.17.15's provider did not answer even a trivial prompt;
      no file moved); recorded, and the opencode denies stay UNVERIFIED as DEC-7 accepts.
- [x] 5.3 In a Claude Code session at a set-up vault, ask the agent to send a test mail to the owner;
      the call must be refused without a prompt (the `vault-setup` scenario "A denied tool is refused").
- [x] 5.4 Run the scheduled `vault-daily` command once by hand; if connectors do not answer headless,
      remove the scheduler guidance (clears the EPIC's headless rabbit-hole). Result 2026-09-15: a
      headless run at the vault root read the calendar; `send_message` was absent from the session.

## 6. Catalogue wiring

- [x] 6.1 `.claude-plugin/marketplace.json`: the `vault-assistant` entry with its nine skills.
- [x] 6.2 `tools/repo_lint/lint.py` bundle names; `tests/test_repo_lint.py` assertion.
- [x] 6.3 `tools/skill_inventory.py` purposes and bundle sentence; `make skill-inventory`.
- [x] 6.4 `tests/trigger_probes.yaml` (at least one positive probe per skill, two for
      `vault-project`); `tests/ownership.yaml` (`vault-note-conventions`).
- [x] 6.5 `README.md`, `CONTRIBUTING.md`, `docs/environment/setup.md`: five bundles;
      `docs/environment/vault-assistant.md`.
- [x] 6.6 `docs/environment/dual-cli/compatibility.md` (external Obsidian plugin, opencode gaps) and
      `body-agnosticism-audit.md` (32 skills).
- [x] 6.7 `docs/environment/dual-cli/setup-claude.md`, `setup-opencode.md`: the bundle's install row.
- [x] 6.8 `CHANGELOG.md` Unreleased entry; `make generate-opencode`. The version bump is the
      release's.

## 7. Review and release

- [x] 7.1 Clarity gate on this PLAN (at least 9/10) and an adversarial review of the whole change;
      fix what survives.
- [x] 7.2 `openspec validate --strict` (pinned and local), `make validate`, GitNexus `detect_changes`.
- [x] 7.3 Conventional commits on `feature/add-vault-assistant`, push, open the pull request with the
      list of points for the owner to confirm.
