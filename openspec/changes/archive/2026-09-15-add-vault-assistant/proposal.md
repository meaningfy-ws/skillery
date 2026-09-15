# EPIC: vault-assistant, the skills that maintain a personal Obsidian vault

Golden-thread parents (private repository `meaningfy-ws/infrastructure-stacks`, cited by path, never
copied):
- `openspec/changes/add-personal-vault/`: the vault's layout (DEC-4), who may write what (DEC-5), the
  method skills living in skillery (DEC-6), sessions write to the vault and not to memory (DEC-17),
  and where knowledge of Obsidian lives (DEC-18).
- `openspec/changes/add-daily-assistant/`: the morning note, the master to-do list, tool denies and
  recall limits (DEC-1 to DEC-12).

Seeds: `inputs/README.md`, `brief.md`, `skills.md`, `repo-constraints.md`, and the owner's decisions of
2026-09-14 in `inputs/qa-2026-09-14.md`, which win over the other seeds. Every divergence from the
upstream changes is listed there under "Drift".

## Appetite

**Large: about two weeks of one person's time, one skillery release.** Nine skills, one new bundle, the
catalogue wiring, no tooling change. If time runs short, cut in this order: `vault-tidy`, then the month
and year horizons of `vault-planning`, then the scheduled run of `vault-daily`. Each cut leaves the rest
whole.

## Why

Agents write at random into a vault and invent projects. A colleague's vault ran for two months on a
fixed layout, a handful of method skills and a morning note, and the randomness stopped; but it kept
two drifting copies of every skill and hard-coded one person's paths and apps into them. The vault
layout is being set up now, and its first weeks of use need the method: it belongs in skillery, once,
reviewed by pull request, and usable by anyone whose vault has the same shape.

## Solution outline

A fifth plugin, **`vault-assistant`**, holds nine small skills. The skills carry the method; each
vault carries its person (an owner profile and hard rules in the vault's agent instructions, read at
run time). Obsidian's own syntax and file operations come from the external plugin
`obsidian@obsidian-skills`; the company memory is reached only through its MCP server.

```
                          vault-setup  (once per person, from outside the vault)
                               │
   vault-conventions ◀── cited by every skill: kinds, properties, links, files, memory etiquette
                               │
   project lifecycle     vault-project new ─▶ ( vault-resume ─▶ work ─▶ vault-capture )* ─▶ vault-project close
                         (charter gate)       session start             session end, or raw   archive, after a yes
                                                                         notes at any time
   curation              vault-promote (staging ─▶ projects/resources)   vault-tidy (plan, yes, move)
   rhythm                vault-planning (year ▸ quarter ▸ month ▸ week)  ─▶  vault-daily (today)
```

Outcome: a person runs `vault-setup` once, then works a project from charter to archive, captures
notes at any time, and starts each day from one note that joins mail, calendar, to-dos and plans, with
every agent write kept inside the vault's rules.

### Terms and layout

```
obsidian/<person>/
├── vault/                 00 Inbox/ (proposed/)  01 Projects/YYYY-MM-DD Name/  02 Ideas/  03 Resources/
│                          04 Daily/  05 To Do/  06 Archive/  07 Perso/  08 How to/  X/Templates/  AGENTS.md
└── vault-files/           binaries, one folder per project; _shared/ opts them in to the company memory
```

- **Charter gate:** a project starts only when the owner answers five questions (what it is, why it
  matters, what done looks like, which objective it serves, what would make them stop), and "done" is
  something a third person could check.
- **Kind:** the required `kind` property naming what a note is (meeting, assessment, daily, …).
- **Staging:** `00 Inbox/proposed/`, where an agent puts a claim nobody asked for; a person moves it on.
- **Share switch:** the note property `memory: common`, which only a person sets, and `private: true`,
  which only a person removes. The company's ingestion pipeline copies opted-in notes into the company
  memory (a cognee knowledge graph) every night.
- **Evolution loop:** an agent that sees a better method writes a `skill-change` note to staging; a
  person opens the skillery pull request.
- **OKR:** objectives with measurable key results, set per quarter.

## Key decisions

- **DEC-1: A fifth, non-role bundle named `vault-assistant`.** The four existing bundles are roles;
  this one is a personal workflow, installed only by people who keep a vault. It is not a general
  Meaningfy assistant: it maintains a vault and runs a small daily routine, nothing more.
- **DEC-2: One change for the vault method and the daily routine.** The upstream gate (a week of vault
  use before the daily work) and the daily routine's stop rule are dropped by the owner's choice; the
  build order still puts `vault-daily` last.
- **DEC-3: Nine skills, every name prefixed `vault-`.** opencode keeps skill names in one flat, global
  namespace ([opencode skills](https://opencode.ai/docs/skills/)), so a bare `daily` or `tidy` would
  collide.

  | Skill | Does | Invoked |
  |---|---|---|
  | `vault-setup` | bootstraps a vault and its tooling, or guides where it cannot act | explicitly only |
  | `vault-conventions` | owns kinds, properties, links, files, objectives and memory etiquette | by any agent writing a note |
  | `vault-project` | `new` (behind the charter gate) and `close` (final entry, `status`, archive after a yes) | on request |
  | `vault-resume <project>` | session start: reads one project's charter, recent sessions, decisions and tasks | on request |
  | `vault-capture <project>` | session end, or raw notes at any time: files what matters into the project's files | on request |
  | `vault-promote` | moves a staged note out of staging after checking `kind` and required properties | explicitly only |
  | `vault-tidy` | shows a plan of moves, merges and renames and applies it only after a yes | explicitly only |
  | `vault-planning` | planning and review sessions over year, quarter, month and week | on request |
  | `vault-daily` | writes today's note, keeps the master to-do list, drafts replies | explicitly only |

- **DEC-4: Obsidian is delegated, not re-taught.** `obsidian@obsidian-skills` (MIT) is a mandatory
  external dependency. Its `obsidian-markdown` and `obsidian-bases` skills own the syntax; its
  `obsidian-cli` skill performs every move and rename, because the Obsidian CLI updates wikilinks
  ([Obsidian CLI](https://obsidian.md/help/cli)) and plain file tools do not. It is installed as a
  plugin for the user, never copied into a vault. Folder context stays in `AGENTS.md` and the skills;
  the upstream nested instruction files are not used, because they are specific to one CLI.
- **DEC-5: The skill carries the method; the vault carries the person.** Skills read the owner profile
  (mail and calendar connectors, time zone) and the write rules from the vault's agent instructions
  and never restate them. `vault-daily` refuses to run when the profile is missing.
- **DEC-6: No skill ever lives in a vault.** Improvements travel through the evolution loop. The
  reference vault's own skills are not migrated; their owner may adopt these instead.
- **DEC-7: Bodies stay CLI-agnostic; CLI mechanics live in `vault-setup`'s references.** The permission
  settings and Claude Code's pointer to `AGENTS.md` are written per CLI by `vault-setup`. opencode's
  limits are accepted and recorded; permission enforcement on opencode is **UNVERIFIED**.
- **DEC-8: `vault-daily` is a skill, not an agent.** The owner leaned towards an agent. Rejected: the
  method is knowledge, so it is a skill; the tool restriction an agent would add is enforced by the
  vault's permission settings for every session at the vault root; and an agent file in this catalogue
  ships in every bundle. A scheduled run is a scheduler entry the owner creates on their own
  workstation with `vault-setup`: it is the owner invoking the skill, under the vault's permission
  settings and with the owner's connectors, and no credential leaves the workstation.
- **DEC-9: Planning spans five horizons in two skills.** `vault-planning` covers year, quarter (OKRs),
  month and week; the day is `vault-daily`'s plans section. Each horizon serves the one above it
  (multi-scale planning), and the weekly review follows the GTD habit of clearing the inbox and
  reviewing every active project. Plans live in `05 To Do/Objectives YYYY.md`, which carries its own
  change log; reviews are records in `04 Daily/reviews/`.
- **DEC-10: The voice is the company voice, attentive to people.** Drafts follow `company-voice.md`:
  neutral and factual. Where a message carries attitude, implication or emotion, the draft
  acknowledges it in a sentence, and the note tells the owner what the tone signals. Example-based
  voice (upstream) is not used.
- **DEC-11: Kinds start small and grow.** `vault-conventions` ships a starter list of kinds with their
  required properties; a new kind arrives through the evolution loop. A note with an unlisted kind stays
  valid; `vault-promote` refuses only a missing `kind` or a missing required property.
- **DEC-12: Binaries never enter the vault.** They go to `vault-files/<project folder>/`, named exactly
  like the project folder. The Drive connector is denied in a vault session (upstream daily DEC-3), so
  an agent cannot look up a file's web link; it lists the file in `resources.md` and asks the owner for
  the link.
- **DEC-13: The company memory is recalled, never written, from a vault session.** Vault skills recall
  within the limits `vault-conventions` states; the ingestion pipeline carries what a person opted in,
  and its parser follows the property names `vault-conventions` owns. Cognee's own Claude Code plugin
  is not used: it records every prompt and tool trace into the graph
  ([cognee docs](https://docs.cognee.ai/cognee-cloud/agent-integrations/claude-code)). Governing memory
  use outside a vault is a separate, later change.
- **DEC-14: Nothing private enters skillery.** No host names, account names, folder IDs or personal
  paths; `vault-setup` names the private runbook and asks the person for those values.
- **DEC-15: Explicit-only skills degrade to "invoke by name" on opencode.** On Claude Code they are
  slash commands that never fire on their own; opencode has no slash invocation for skills, so there
  the owner asks for the skill by name. Recorded as a gap.
- **DEC-16: `vault-setup` runs from outside the vault.** Once the permission settings exist, a vault
  session may not edit them or run setup commands; setup and its re-runs start one folder up, in
  `obsidian/<person>/`.

## Rabbit-holes

- **Agents ship in every bundle.** Every plugin's source is the repository root, so an agent file would
  appear under all five bundles. DEC-8 avoids adding one.
- **The Obsidian CLI needs a running Obsidian and a shell.** The vault's permission settings allow the
  `obsidian` command and nothing else; the equivalent opencode pattern is **UNVERIFIED**. With the CLI
  unreachable, moves are refused, never done with file tools.
- **Headless runs.** Whether mail and calendar connectors answer a scheduled, headless run is
  **UNVERIFIED**; if they do not, `vault-daily` stays on demand and the scheduler entry is dropped.
- **Lists that never settle.** Ship the starter kinds and four planning horizons; grow them through the
  evolution loop, never in this change.
- **Indexes as Obsidian Bases** (brief §7) stay a proposal outside this change.

## No-gos

- A general Meaningfy assistant, a voice skill, or a skill governing company-memory use outside a vault.
- Cognee's Claude Code plugin; `remember` or `forget` from a vault session; a project MCP configuration
  inside a vault.
- Any skill, agent or copied external skill inside a vault.
- Sending, replying, forwarding, trashing, labelling or marking mail as spam; calendar or chat writes;
  the Drive connector; web tools, including weather.
- Server-side work: the ingestion pipeline, the company's server-side agents, any cloud routine.
- Any agent setting `memory`, removing `private: true`, or tidying, moving or archiving without the
  owner's yes.
- Private values (hosts, accounts, IDs, personal paths) anywhere in skillery.

---

## What Changes

- Nine skills under `skills/vault-*/`, each with a `## Boundary & Related Skills` section and detail in
  `references/`; `vault-setup` ships its templates in `assets/`.
- `.claude-plugin/marketplace.json`: the `vault-assistant` plugin entry.
- `tools/repo_lint/lint.py` and `tests/test_repo_lint.py`: `vault-assistant` is a valid bundle name.
- `tools/skill_inventory.py`: a purpose for each new skill; `docs/skill-inventory.md` regenerated.
- `tests/trigger_probes.yaml` and `tests/ownership.yaml`: probes for every skill; the note conventions
  registered to `vault-conventions`.
- `README.md`, `CONTRIBUTING.md`, `docs/environment-setup.md`: five bundles, and this one's prerequisites.
- `docs/vault-assistant.md`: what the plugin needs to be useful, and how to start.
- `docs/dual-cli/setup-claude.md`, `setup-opencode.md`: the install path for the new bundle.
- `docs/dual-cli/compatibility.md`, `body-agnosticism-audit.md`: the external Obsidian plugin and the
  opencode gaps.
- `CHANGELOG.md` (Unreleased) and a regenerated `.opencode/`. The version bump belongs to the release.

## Capabilities

### New Capabilities

- `vault-conventions`: the single home of Meaningfy's note conventions and memory etiquette.
- `vault-setup`: bootstrapping a vault and its tooling on either CLI.
- `vault-project-lifecycle`: creating, resuming, capturing into and closing a project (three skills).
- `vault-curation`: promoting staged notes and tidying after an explicit yes (two skills).
- `vault-planning`: planning and review sessions across four horizons.
- `vault-daily`: the morning note, the master to-do list and reply drafts.

### Modified Capabilities

- `catalogue-governance`: bundles are four role bundles plus one workflow bundle.
- `dual-cli-generation`: the generated tree reproduces every bundle, not only the role bundles.
- `dual-cli-distribution`: every bundle, not only every role bundle, has an install path per CLI.

## Impact

- **Users:** only people who install `vault-assistant`; nothing changes for the four role bundles.
- **Prerequisites:** the plugin is useful only with a vault set up by `vault-setup`, the external
  Obsidian plugin, and the company memory's MCP server; `docs/vault-assistant.md` says so first.
- **Upstream:** the drift in `inputs/qa-2026-09-14.md` goes back to the infrastructure repository's two
  changes, and its ingestion parser gains a citation of `vault-conventions` (DEC-13).
