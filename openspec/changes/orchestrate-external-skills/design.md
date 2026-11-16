# PLAN (design): One orchestrator, pointing to skills kept elsewhere

> Derives from: the EPIC [`proposal.md`](proposal.md) (`orchestrate-external-skills`), DEC-1 to
> DEC-21. Order of all open EPICs: [the reassessment](../delivery-process-and-tools/inputs/reassessment-2026-11-15.md).
> The owner's answers while planning: [`inputs/planning-2026-11-15.md`](inputs/planning-2026-11-15.md).

Stage 1 (the register of both forks) is planned in full: it runs in wave 2, and the `lean-skills`
pilot waits for it (`lean-skills` DEC-10, DEC-13). Stages 2 to 4 run in wave 3 (DEC-21) and are
planned to the level a builder can start from; each is detailed further at the start of its own
session without a new gate run (reassessment S-10).

## Context

Measured on `develop` `8994178` and on both forks, 2026-11-15:

| Fact | Value |
|---|---|
| `meaningfy-ws/agent-rules-books` | head `893a88a` (2026-09-10); the 8 sets of `lean-skills` DEC-5 are 8 folders of 4 Markdown files each (`SKILL.md`, the full text, `.mini.md`, `.nano.md`): 223,914 bytes |
| `meaningfy-ws/wondel-ai-skills` | head `c526558` (2026-11-13), the commit the study read; the 16 skills of DEC-6 are 123 Markdown files (`SKILL.md` plus `references/`): 1,736,630 bytes |
| Installer both forks document | the open Agent Skills CLI, `npx skills`, version 1.8.1. `add <owner/repo>` with `--skill`, `--agent` (`claude-code`, `opencode`, …), `--global`, `--list`, `--yes`. It sends an install telemetry event |
| `dependencies.yaml` | 26 entries; neither fork is in it. Keys checked by `dependencies_register` in `tools/repo_lint/lint.py`; no key ties an entry to a bundle |
| `skills:` lists of the register | read by the lint (`_dep_skills`: kebab-case, listed once, no shadowing of a `skills/` folder) and by the navigator's TC-16 line reader (inline `[a, b]` form only) |
| Generated dependency tables | `tools/skill_inventory.py` `_DEP_TABLES` (`plugins`, `mcp`, `mcp-setup`), spliced into `DEPENDENCY_DOCS` between `GENERATED:dependencies:<table>` markers by `make skill-inventory` |
| Bundles | 9; `meaningfy-building` requires `meaningfy-architecture`; `meaningfy-sales` and `meaningfy-devops` require `meaningfy-consulting` |
| Full commits of the forks' heads | `agent-rules-books` `893a88a6fce3a80c565bf39ac65021b43a8b2990`; `wondel-ai-skills` `c5265583b1a9740f06831e1d3e89b35bba3eb430`. The installer accepts a `#<ref>` that is a branch, a tag or a full 40-character commit; a short commit fails |
| Copies inside the wondel fork | each of the 16 skills also sits in two `plugins/*/skills/` folders, identical today; the installer takes the top-level folder first |
| Trigger sets in `tests/evals/triggers/` | only `executive-communication.json` and `test-strategy.json` |
| The lean standard | delivered by `lean-skills` stage 1: 24 KB of prose per skill, body near 6 KB, pointer sentences checked by lint; `skill-budget.yaml` exempts skills still waiting for their rewrite. *Revised 2026-11-16 (D-21):* every skill is rewritten and the `pending` key is gone; only `over_budget` remains |
| Restatement of the two authors (DEC-9) | `sales-conversations/references/selling-method.md`, `conversation-tools.md`; `sales-qualification/references/value-equation.md` |

Name collisions to keep in mind: the wondel fork also holds `clean-architecture`,
`domain-driven-design` and `release-it`, the same names as three book sets. Only the book sets'
versions are registered (DEC-5 of `lean-skills`; the study's verdict).

Short names: **R1** `lean-skills`, **R3** `delivery-process-and-tools`.

## Goals / Non-Goals

**Goals:**

- Stage 1 (1a books, 1b wondel): both forks in the register, one entry per fork and bundle, each skill registered only
  after it and its references were read in full; a per-bundle install table generated for both
  CLIs; the installer checked.
- Stage 2: the `skill-orchestration` skill, within the lean budget, with its probes and a coverage
  check that keeps it in step with the catalogue.
- Stage 3: the one-line pointers (DEC-4) and the sales cut (DEC-9).
- Stage 4: the three proofs of DEC-14.

**Non-Goals:** the EPIC's No-gos. Also: no automated install of external skills by a plugin or by
the opencode installer (D-7); no check that the fork's head still equals the commit read (D-4);
no delta on `catalogue-architecture` (D-15).

## Decisions

### D-1 Four stages

| Stage | Wave | Delivers | Unblocks |
|---|---|---|---|
| 1a books | 2 | the install check, the lint and table, the read of the 8 book sets, their two entries | R1 pilot |
| 1b wondel | 2 | the read of the 16 wondel skills, the owner round on their conflicts, their three entries | stage 2 |
| 2 orchestrator | 3, after `lean-skills` stage 1 and `generic-task-test-profiles` (DEC-21) | `skill-orchestration`, its references, probes, coverage check | stage 3 |
| 3 pointers and cut | 3 | the pointer lines, the DEC-9 cut, the agent scenarios | stage 4 |
| 4 proofs | 3 | the routing, override and trigger runs (DEC-14) | archive |

Stage 1 is the register of both forks, delivered as two pull requests: the R1 pilot needs only
the book sets (DEC-17 asks that they are registered before it), so 1a does not wait for 1.5 MB of
wondel reading and its owner round. Stage 3 follows stage 2 because a pointer names a skill that
must exist. Every other stage is one pull request into `develop`.

### D-2 Register shape: one entry per fork and bundle (owner, planning Q1)

Five entries of `kind: skill`, each with a new optional key `bundle:` naming one bundle of
`bundles.yaml`. The entry's `skills:` list holds that bundle's skills from that fork. The entry
name is `<fork>/<bundle>`, for example `agent-rules-books/meaningfy-building`. One more entry,
`skills-cli` (`kind: cli-tool`), registers the installer itself.

Worked example (stage 1 writes the real values from the install check, task 1.1):

```yaml
- name: wondel-ai-skills/meaningfy-core
  kind: skill
  bundle: meaningfy-core
  summary: technical-documentation; routed to by skill-orchestration with Meaningfy's overrides
  source: meaningfy-ws/wondel-ai-skills (Meaningfy fork of wondelai/skills)
  pin: 'c5265583b1a9740f06831e1d3e89b35bba3eb430 (the commit read in full)'
  provenance: 'MIT; read in full at c5265583 on <date>; reading records in the evidence/reading/ folder of the change orchestrate-external-skills (active or archived)'
  used_by: skill-orchestration (from stage 2); technical-writing points there
  skills: [technical-documentation]
  opencode_status: unverified (not tried)
  claude_install: '`DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/wondel-ai-skills#c5265583b1a9740f06831e1d3e89b35bba3eb430 --skill technical-documentation --agent claude-code --global --yes`'
  opencode_install: '`DO_NOT_TRACK=1 npx skills@1.8.1 add meaningfy-ws/wondel-ai-skills#c5265583b1a9740f06831e1d3e89b35bba3eb430 --skill technical-documentation --agent opencode --global --yes`'
```

Both install fields hold one full command each, so the generated tables (D-7) show commands, not
prose. The note "if you use both CLIs, run only the claude-code command" lives in the setup-doc
heading (task 1.8), never in a field.

The pin is always the full 40-character commit; a short one fails in the installer. An entry with
several skills writes them in the form task 1.1 proves for several skills (space-separated after
one `--skill`, or `--skill` repeated), the same form in both fields.

Rejected: `external_skills:` in `bundles.yaml` (touches the marketplace renderer for a list the
register already holds); one entry per skill (24 rows in the compatibility table).

### D-3 Placement by role (owner, planning Q2)

| Entry | Skills |
|---|---|
| `agent-rules-books/meaningfy-building` | `refactoring`, `working-effectively-with-legacy-code`, `a-philosophy-of-software-design`, `clean-architecture` |
| `agent-rules-books/meaningfy-architecture` | `domain-driven-design`, `designing-data-intensive-applications`, `patterns-of-enterprise-application-architecture`, `release-it` |
| `wondel-ai-skills/meaningfy-sales` | `negotiation`, `hundred-million-offers`, `mom-test`, `obviously-awesome`, `jobs-to-be-done`, `influence-psychology`, `predictable-revenue`, `monetizing-innovation`, `storybrand-messaging`, `one-page-marketing`, `made-to-stick`, `crossing-the-chasm`, `scorecard-marketing` |
| `wondel-ai-skills/meaningfy-consulting` | `good-strategy-bad-strategy`, `high-output-management` |
| `wondel-ai-skills/meaningfy-core` | `technical-documentation` |

Builders also get the architecture sets, because `meaningfy-building` requires
`meaningfy-architecture`; sellers and devops users get the consulting pair the same way, and
everyone gets `technical-documentation` (RISK-12).

### D-4 The pin is the commit read

An entry's `pin` is the full 40-character fork commit its skills were read at, and the install
command carries it (`owner/repo#<commit>`), so what installs is what was read. The installer's
source (1.8.1) takes a full commit; only if the live check of task 1.1 fails with the full commit
is `pin` written `'unpinned: the Meaningfy fork is the pin; it moves only by a reviewed sync'`, with
RISK-10. The `plugins/*/skills/` copies in the wondel fork are not read and not installed; the
sync paragraph says so. The fork is synced with upstream by hand and only on demand (planning Q4): before
the pin moves, every changed file among the registered skills is read in full again, its reading
record updated, and any new conflict taken to the owner (D-6). The procedure is one paragraph in
`docs/environment/dual-cli/compatibility.md`, beside the tables it governs.

### D-5 The full read and its record

A skill is registered only after a reader read every file of its folder in the fork (the owner's
brief; Rabbit-holes, "Reading depth"). The read is split across seven readers so that each holds at
most about 310 KB:

| Reader | Skills | Bytes |
|---|---|---|
| A | the 8 book sets | 223,914 |
| B | `negotiation`, `hundred-million-offers`, `monetizing-innovation` | 278,711 |
| C | `mom-test`, `jobs-to-be-done`, `predictable-revenue` | 269,923 |
| D | `influence-psychology`, `obviously-awesome` | 294,375 |
| E | `storybrand-messaging`, `one-page-marketing`, `scorecard-marketing` | 305,271 |
| F | `made-to-stick`, `crossing-the-chasm` | 284,811 |
| G | `good-strategy-bad-strategy`, `high-output-management`, `technical-documentation` | 303,539 |

Each reader writes one record per skill, `evidence/reading/<skill>.md`:

```markdown
# Reading: <skill>
Fork `<fork>` at `<commit>`, read in full on <date> by reader <X>.

| File | Bytes | What it adds |
|---|---|---|
| SKILL.md | 12,345 | <one line, own words> |
| references/<file>.md | … | … |

## Goals it serves
<the goals, as a person would name them; when not to use it>

## Conflicts with Meaningfy rules
| # | Their advice (file, heading, line) | The Meaningfy rule it meets (owner skill) | Named in DEC-7, DEC-19 or DEC-20? |
|---|---|---|---|

## Trigger overlap
<Meaningfy skills or agents whose prompts its description would also claim>

## Fallback sentence (draft)
If `<skill>` is not installed, offer `<install command>`; if the person declines, …
```

Every reader tests against the same Meaningfy sources, so the conflict tables are comparable: the
overrides of D-10 (DEC-7, DEC-19, DEC-20, the PoEAA rule); the owning skills by bundle (sales:
`sales-conversations`, `sales-qualification`, `estimation`, `proposal-writing`; consulting:
`semantic-consulting-coach`, `executive-communication`; core: `technical-writing`,
`meaningfy-voice`; building and architecture: `cosmic-python`, `architecture`); and the rules in
`docs/rules/`. A conflict with anything outside that list is still recorded, marked "outside the
list".

Three rules for every record: it paraphrases and cites file, heading and line, and copies no
sentence of the fork (No-go "no external text copied"); it names files in backticks and links none
(a link to a fork file breaks `make lint`'s link check); its file table lists every file of the
folder, which the lead checks against the fork tree (tasks 1.5 and 1.11). Reader B's three skills touch
price and commitments, so a second reader re-reads them for conflicts the first missed
(`guardrails`, *Subagent dispatch*, the second check).

### D-6 Every new conflict goes to the owner first (owner, planning Q4)

A conflict the record marks "not named" is not turned into an override or a drop by the lead. All
of them go to the owner in one question round at the end of the read (tasks 1.6 and 1.12), each with a
recommendation: override (with its wording), drop the skill, or accept. An answer that drops a
skill is a logged re-shape of DEC-6, recorded as a new DEC in `proposal.md` and in `inputs/`. A
dropped skill is not registered.

### D-7 Install: a generated per-bundle table, no automation

`tools/skill_inventory.py` gains two tables for entries with a `bundle`: `external-skills-claude`
(Bundle, Skills, Install) in `setup-claude.md` and `external-skills-opencode` (the same, with the
opencode command) in `setup-opencode.md`; both docs join `DEPENDENCY_DOCS`. `render_dependencies`
changes for them: the first column is the bundle, not the bold name, and a list cell is joined with
", ". Each table sits under its own heading after Step 4, "External skills of your bundles (per
role)", not under the mandatory dependencies. The entries also appear in the existing `plugins` table of
`compatibility.md`, as every non-MCP entry does. Nothing installs them automatically: the plugin
marketplace cannot run `npx`, and the orchestrator's fallback sentence (DEC-12) catches a missed
install. The installer's telemetry is turned off by the environment variable `DO_NOT_TRACK=1`
(or `DISABLE_TELEMETRY=1`), so every command starts with `DO_NOT_TRACK=1`, and the heading notes
that this prefix is POSIX-shell syntax (PowerShell sets the variable first). The register keeps one
command per bundle; the per-skill commands the fallback sentence needs are generated separately
(D-10, `external-skills-install`).

### D-8 The register lint learns `bundle`

`bundle` joins `_DEP_OPTIONAL`. When present, the lint requires that it names a bundle of
`bundles.yaml`, that `kind` is `skill`, and that `skills:` is a non-empty list. The existing
checks still apply: a skill name is listed once in the whole register and never shadows a
`skills/` folder, so a book set and a wondel skill of the same name cannot both be registered.

### D-9 The skill: `skill-orchestration`, in `meaningfy-core` (owner, planning Q3)

Named after its capability. It is in `meaningfy-core` (the EPIC's What Changes) because every role
uses it. It is not listed in `skill-budget.yaml`: it meets the lean standard from its first commit
(DEC-11).

### D-10 The skill's shape

- **Body (target 6 KB, these included):** what the skill is for and when not to load it; the
  routing procedure (name the goal, open the reference of the bundle that owns it, take the row),
  with nine pointer sentences in the `reference_pointers` form, one per bundle reference ("Read
  `references/meaningfy-sales.md` when the goal is selling, positioning or marketing: it adds the
  rows for that bundle."); the overrides, in
  the skill's own words (DEC-18), one line each: no discount; the effort-based price frame of
  `estimation`; our qualification scheme and outreach rules; a guarantee only after the owner's
  yes; British spelling, no em dash, no contractions in binding text; an offering document sets the
  price, external skills never do (DEC-19); Meaningfy's voice for documentation, checked by the
  Vale rules once `activity-test-profiles` has delivered them, and by the reviewer until then
  (DEC-20, RISK-13); `patterns-of-enterprise-application-architecture` only on demand and never
  beside `domain-driven-design` as equal guidance (`lean-skills` DEC-5); plus each override the
  owner adds in tasks 1.6 and 1.12. The fallback rule (DEC-12). For
  marketing and management, one sentence: no house rule exists yet; the external skill is used as
  it is (DEC-10).
- **References, one per bundle** (`references/<bundle>.md`), each opened only when the goal belongs
  to that bundle. Each reference is one table:

  | Goal | Meaningfy skill | External help: when and how | Preference that wins |
  |---|---|---|---|
  | Prepare a negotiation with a client | `sales-conversations` | `negotiation`: before the call, for the questions and labels; never for price moves | no discount; the offering sets the price |

  A bundle without external skills still has its rows, so every Meaningfy skill is reachable
  (DEC-3). One row may name several Meaningfy skills that serve one goal, and a bundle with no
  external help may be one row per goal, not per skill.
- **Install commands:** `assets/install.md`, one generated table from the register, key
  `external-skills-install`, marker `<!-- GENERATED:dependencies:external-skills-install -->`:
  columns Bundle, Skill, Claude Code, opencode, one row per registered external skill. Each
  command is the entry's `claude_install` or `opencode_install` with the argument after `--skill`
  (up to ` --agent`) replaced by that one skill; an install field with no `--skill` fails the
  render, naming the entry. The fallback sentence takes its command from
  here. It is under `assets/`, outside the prose budget (DEC-2 of `lean-skills`), so a register
  edit can never push the skill over budget. Its path is added to `DEPENDENCY_DOCS`.

Budget estimate: body 6 KB; 76 rows at about 192 bytes (the example row) are 14.6 KB, plus about
1.5 KB of headings and table heads: about 22 KB of 24. That leaves room for about ten more rows;
when it is full, rows are merged by goal, never an exception (RISK-9).

### D-11 Coverage is checked, rows are written (Rabbit-holes, "A second inventory")

The rows are written by hand, because the goal and the "when and how" are the content no
frontmatter holds. A new check, `orchestration_coverage`, in `ALL_CHECKS` (it reads the register and
`bundles.yaml`, so it is not a pure method check), runs when
`skills/skill-orchestration` exists: every folder of `skills/` and every name in a
`bundle`-entry's `skills:` list appears in at least one row; every external name in a row is
registered; a row's external skill sits in the reference of its own bundle. A new skill added
without a row fails `make validate`, which is how the orchestrator stays in step.

How a row is read: a row is a table line of a `references/<bundle>.md` file below its header line.
A row with no external help has an empty column 3 (`| |`). A column-2 name that is neither a
`skills/` folder nor an `agents/` file fails with `… row N names '<x>', which is not a skill or
agent`; a registered external skill in no row fails with `skill-orchestration: '<x>' is
registered and in no row`.
Its Meaningfy names are the backticked names in column 2, each a `skills/` folder or an `agents/`
file. Its external names are the backticked names in column 3 before the first colon of each
`;`-separated item; backticked names after a colon are prose and not read. `skill-orchestration`
needs no row. Messages follow the register lint's style, for example
`skill-orchestration: skills/estimation is in no row` and
`skill-orchestration: references/meaningfy-sales.md row 4 names 'negotiaton', which is not registered`.

### D-12 Description and probes (Rabbit-holes, "A description that fires on everything")

The description claims only the question "which skill, ours or external, serves this goal, and
which Meaningfy rule wins over it", and names its trigger phrases ("which skill for", "what should
I use to", "is there a skill for"). Probes in `tests/trigger_probes.yaml`: two positives, and one
near-miss for each closest neighbour (`sales-conversations`, `technical-writing`,
`semantic-consulting-coach`, `epic-planning`, `skillery-feedback`, `guardrails`). A trigger set,
`tests/evals/triggers/skill-orchestration.json`, is run in stage 4.

### D-13 The pointer line (DEC-4)

Each Meaningfy skill or agent named as owner in a row with external help gains one line, at the
point where that help applies: "External skills help here; `skill-orchestration` names them, when
to use them and the Meaningfy rule that wins." The list is exactly the column 2 names of the stage
2 rows whose column 3 is not empty; task 3.1 derives it from the rows. The forecast, checked in 3.1:
`sales-conversations`, `sales-qualification`, `proposal-writing`, `estimation`,
`semantic-consulting-coach`, `executive-communication`, `technical-writing`, `cosmic-python`,
`architecture`, and the agents `implementer`, `code-reviewer`, `system-architect`,
`proposal-writer`, `sales-agent`. An agent's line is routing, not method, so it stays a thin
wrapper.

### D-14 The sales cut (DEC-9)

In the three files of the Context, the passages that restate the method of Voss and Hormozi are
replaced by a pointer to `negotiation` or `hundred-million-offers` through `skill-orchestration`.
Every Meaningfy restriction on those methods stays (for example "not in B2G tenders", "never a
buyer-side price ladder"): those are our sales rules, which the EPIC does not change. A second
reader compares before and after, as `lean-skills` does for its rewrites. The first step of task
3.2 writes the list of headings cut and kept per file, and the second reader checks the cut
against it. `sales-conversations`
(27,977 bytes of prose as `prose_budget` counts it, pending `[budget, pointers]` in `skill-budget.yaml`) may fall under 24 KB with the
cut; `prose_budget` then asks for `budget` to leave its pending list, in the same pull request.
*Revised 2026-11-16 (D-23, D-24):* `sales-conversations` is now 24,564 bytes (body 5,814,
references 18,750) and nothing is pending; how much of this cut is left is D-24, an owner
decision.

### D-15 Spec deltas

- `skill-orchestration` (new): the shaped delta, refined: coverage (D-11), the overrides in the
  skill's own words (DEC-18), the fallback (DEC-12), no house rule invented (DEC-10).
- `external-dependency-register` (modified): "recorded once" becomes one entry per dependency, or
  per fork and bundle for a skill source (MODIFIED); a skill source registered per fork and bundle (D-2,
  D-8); read in full before it is registered (D-5); the generated install table (D-7).
- `sales-method-ownership` (modified): the sales skills point to the external method skills
  instead of restating them, and keep their own restrictions (D-14).
- `catalogue-architecture`: no delta. Routing is the new capability's requirement, and no
  catalogue rule of that spec changes.

### D-16 How the proofs run (DEC-14)

Stage 4 runs with a model, so its estimate is shown to the owner and approved before the first run
(`tests/evals/README.md`). Every run is isolated: `HOME`, `CLAUDE_CONFIG_DIR` and
`XDG_CONFIG_HOME` point to scratch folders; skillery's bundles and, with `--global`, the external
skills of those bundles are installed there, nothing else. A subagent of the lead session is not
isolated (it inherits the lead's plugins), so every prompt runs as `claude -p --model sonnet` in
that scratch configuration. The login is set up and removed as the isolation block of
[`tests/evals/README.md`](../../../tests/evals/README.md#trigger-sets) says. Missing-skill
scenarios run in a second scratch configuration with the bundles but without that external
skill.

- **Routing:** one scenario per named goal in `tests/features/skill-orchestration.feature`
  (prepare a negotiation, position a product, review this strategy, refactor untested code, write
  release notes, plus one goal with no external help). Each prompt runs once; the transcript must
  show the right skills named, or the install offer when one is missing. Pass: every routing
  scenario. A failure is fixed once in the reference row and rerun once; a second failure goes to
  the owner.
- **Overrides:** one scenario per override of D-10, each prompting the external skill toward the
  conflict. Pass: the Meaningfy rule is followed. A fail is fixed once in the orchestrator's
  wording and rerun once; a second fail goes to the owner (RISK-3 was accepted, so it may be
  accepted again).
- **Triggers:** the trigger sets of `sales-conversations`, `sales-qualification`,
  `semantic-consulting-coach`, `technical-writing`, `cosmic-python` and `skill-orchestration`. They
  run with the README's own isolation, with no skillery plugin installed (otherwise the real skill
  fires under its own name and scores as a miss). "Before" has no external skills; "after" has the
  bundle's external skills installed with `--global` in that configuration; the description is the
  same on both sides. This before and after differs from the README's (a description change); only
  its pass thresholds are used, as its "Pass" sentence in
  [`tests/evals/README.md`](../../../tests/evals/README.md#trigger-sets) states them. Five of the six sets do not exist yet; stage 3 writes them from the
  probes (10 positives, 10 near-misses each) and fixes them before the first run. `cosmic-python`
  is there for the book sets' generic names (`refactoring`, `clean-architecture`), the collision
  `lean-skills` left to this EPIC.

Results go to `evidence/proof-<kind>.md`. opencode is not tried (DEC-14); its status stays
"unverified" in the register unless task 1.1 tried it.

## Algorithm / approach

Stage 1a (books), in order:

1. **Check the installer** (task 1.1). With `DO_NOT_TRACK=1` and `HOME`, `CLAUDE_CONFIG_DIR` and
   `XDG_CONFIG_HOME` set to scratch folders: `npx skills@1.8.1 add meaningfy-ws/<fork> --list` for
   both forks, confirming the 24 names; install one skill per fork with the full-commit ref, once
   with `--agent claude-code` and once with `--agent opencode`, and look where the files land.
   Record in `evidence/install-check.md`. Nothing is written outside the scratch folders and no
   telemetry is sent.
2. **Lint and tables, test first** (tasks 1.2, 1.3): failing tests, then `bundle` in the lint and
   the two tables.
3. **Read the book sets** (task 1.4): reader A (D-5), brief naming the sets, the record format,
   the no-copy and no-link rules, the Meaningfy rules to test against, records only.
4. **Check the records** (task 1.5): file tables against the fork tree; a throwaway script in the
   scratchpad flags any run of 12 words shared by a record and its fork folder.
5. **Owner round** on any "not named" conflict of the book sets (D-6), then the two entries, the
   setup docs, the sync paragraph, `make skill-inventory`, `make validate`, the navigator tests,
   and the pull request (tasks 1.6 to 1.9).

Stage 1b (wondel) repeats steps 3 to 5 for readers B to G, with the second reader on reader B's
skills, and adds the three wondel entries (tasks 1.10 to 1.14).

Every step is safe to repeat: the reads write files that a rerun overwrites, the install check
writes only in a scratch home, and the generated tables are pure functions of the register.

Stages 2 to 4 follow D-9 to D-16, test first wherever a check is added (the coverage check before
the skill that must pass it).

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Write a register row from the study's verdicts or a skill's headings | Read every file of the folder first and write the record | The owner's brief; the study read most skills by headings only |
| Quote the fork in a reading record or in the orchestrator | Paraphrase; cite file, heading and line | No-go: no external text copied |
| Turn a new conflict into an override, or drop a skill, without the owner | Ask, in the round of task 1.6 or 1.12 | Planning Q4 |
| List every skill in the orchestrator from memory | Write goal rows; let `orchestration_coverage` find the gaps | Rabbit-hole: a second inventory |
| Put an install command by hand in a skill | Take it from the generated `assets/install.md` | One source: the register |
| Pin a short commit | Pin the full 40-character commit | The installer clones a short ref as a branch name and fails |
| Run a proof prompt in a subagent of the lead | Run it with `claude -p` under scratch configuration folders | A subagent inherits the lead's plugins |
| Cite a rule id in an override | Write the override in the skill's own words | DEC-18 |
| Name a price, a package or a term in a row | Say the offering document sets it | DEC-19, No-go |
| Write a marketing or management "house rule" | Say none exists yet | DEC-10, Rabbit-holes |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| A fork lacks one of the 24 names, or names it differently in its frontmatter | `--list` in task 1.1 | Stop stage 1 for that skill; ask the owner (rename in the register or drop) |
| A short commit in `#<ref>` is rejected | the installer's clone fails | Use the full 40-character commit; never fall back to `unpinned` for this |
| The CLI rejects even the full commit | task 1.1 | `pin` becomes `unpinned: …` (D-4); RISK-10 applies |
| The CLI flags differ from version 1.8.1's help | task 1.1 | Write the commands as the scratch install proved them; the pinned version keeps them stable |
| `DO_NOT_TRACK=1` does not stop the telemetry event | task 1.1 (watch the network or the CLI's debug output) | RISK-6; the owner is told in the task 1.6 round |
| An opencode user who also uses Claude Code runs both commands | each skill loads twice in opencode | The setup heading says: run only the claude-code command if you use both |
| A record links to a fork file | `make lint` (broken link) | Name files in backticks, no links |
| The sales cut brings `sales-conversations` under 24 KB | `prose_budget`: "remove it from pending" | Remove `budget` from its pending list in the same pull request. *Revised 2026-11-16 (D-23):* moot, the skill is under 24 KB and not pending |
| A pointer line pushes a skill over 24 KB (D-22) | `prose_budget` | Offset the bytes in the same pull request; otherwise to the owner, never an `over_budget` entry by the builder |
| A stage 4 trigger set is missing | task 3.4 has not written it | Write it from the probes and fix it before the "before" run |
| A stage 4 run uses the lead's own plugins | the run was not under the scratch `CLAUDE_CONFIG_DIR` | Discard it; rerun with `claude -p` in the scratch configuration |
| The opencode install fails or lands where opencode does not look | task 1.1 | `opencode_status: unverified (…what was seen)`; a recorded gap, not a stop (DEC-14) |
| A reader stops before its last file (context or error) | the record's file table is short, or a record is missing (tasks 1.5, 1.11) | Split that reader's unfinished skills across two new readers; rerun only those skills |
| A routing scenario fails twice | `evidence/proof-routing.md` | To the owner (fix differently, or accept) |
| A reader skipped a file | tasks 1.5, 1.11: the file table does not match the fork tree | That reader reads the missing files and completes the record |
| A record copies text of the fork | tasks 1.5, 1.11: the 12-word script | The reader rewrites the passage in own words |
| A conflict not named in DEC-7, DEC-19 or DEC-20 | the record's conflict table | Owner round (D-6); never decided by the lead |
| The owner drops a skill | task 1.6 or 1.12 answer | Not registered; DEC-6 amended as a logged re-shape |
| A registered name shadows a `skills/` folder or is listed twice | `make validate` (`_dep_skills`) | Rename is not ours to do; ask the owner |
| A `bundle` names no bundle, or sits on a non-skill entry | `make validate` (D-8) | Fix the entry |
| The `skills:` list is not inline | the line check in `dependencies_register` (tested by `tests/test_dep_skills_adversarial.py`) | Write it inline |
| A scratch run is not authenticated | `claude -p` fails at once | Set up the login as the evals README says; remove it after |
| An install field has no `--skill` | the `external-skills-install` render fails, naming the entry | Fix the entry's command |
| The setup docs are stale after a register edit | `make validate` (drift) | `make skill-inventory` |
| The orchestrator is over 24 KB | `prose_budget` | Shorten rows; never add an exception for it |
| A new skill lands without a row | `orchestration_coverage` | Add the row in that skill's pull request |
| An override fails twice in stage 4 | `evidence/proof-overrides.md` | To the owner (fix differently, accept, or drop the skill) |
| A Meaningfy skill stops firing with the externals installed | stage 4 trigger runs | Sharpen our description with a probe, or narrow the external skill's bundle; the owner decides if neither works |
| The fork's head moves after the read | not detected automatically | The sync procedure (D-4) is the only way it moves; RISK-10 |

## Risks / Trade-offs

From the EPIC's elicitation, kept: **RISK-1** the orchestrator grows (mitigated by the budget and
D-11), **RISK-2** sixteen more descriptions (mitigated by D-3), **RISK-3** a large external skill
outweighs a one-line override (accepted; D-16 tests it), **RISK-4** the legal status of book
summaries (accepted), **RISK-5** overlap with R1 (closed by DEC-17).

- **RISK-6** The installer sends telemetry on every install. Likelihood high without the opt-out;
  impact low (it reveals which public skills are installed, not our data). Mitigate: every command
  starts with `DO_NOT_TRACK=1` (D-7); a person on a non-POSIX shell who skips it sends the event,
  which is accepted.
- **RISK-7** An external description claims a Meaningfy prompt (`negotiation` names "contract
  terms", which is also `lawyer` work). Likelihood medium; impact medium. Mitigate: the trigger
  runs of D-16 and each record's "Trigger overlap"; placement by bundle keeps `negotiation` out of
  the legal role.
- **RISK-8** The read costs about 2 MB, roughly 500,000 tokens. Likelihood certain; impact medium
  (cost). Accept: the owner's brief requires it; seven readers keep wall time short.
- **RISK-9** The references reach 24 KB as the catalogue grows, and `orchestration_coverage` then
  blocks the next skill's pull request in any EPIC. Likelihood high over a year; impact medium.
  Mitigate: the install table lives in `assets/` (D-10); rows are merged by goal when the budget
  is near; an exception in `skill-budget.yaml` is the owner's call, never the builder's.
- **RISK-10** What installs is not what was read: without a commit in the command, a push to the
  fork installs unread text. Likelihood low (only Meaningfy pushes). Mitigate: D-4 pins the commit
  when the CLI allows it; otherwise accepted and recorded.
- **RISK-11** Stage 1 finds many new conflicts and the owner round grows. Likelihood medium.
  Mitigate: one round per substage, grouped by kind, each with a recommendation; the split of D-1
  keeps the wondel round off the R1 pilot's path.
- **RISK-12** "Not for everyone" (DEC-13) is weaker than it reads: `technical-documentation` is in
  `meaningfy-core`, which everyone installs, and devops users get the consulting pair through
  `requires`. Likelihood certain; impact low (three descriptions). Accepted with the owner's
  placement (planning Q2).
- **RISK-13** The Vale rules of DEC-20 arrive with `activity-test-profiles` in wave 4, after this
  EPIC's wave 3. Likelihood certain; impact low. Mitigate: until then the voice override is checked
  by the reviewer of stage 2 and by the stage 4 override run; the orchestrator's sentence names the
  Vale check without claiming it already runs.
- **RISK-14** The wondel fork holds two `plugins/` copies of each skill; if they diverge from the
  top-level folder, a reader of one may not match what installs. Likelihood low. Mitigate: only the
  top-level folder is read and installed (D-4).

## Attack record

A fresh subagent tried to break the PLAN on 2026-11-15, against the code, the installer's 1.8.1
source and both forks. Fifteen findings, all folded in: the short-commit pin (D-2, D-4, error
matrix); the missing trigger sets (D-16, task 3.4); the Vale timing (D-10, RISK-13); the table
renderer (D-7, tasks 1.2, 1.3); the pilot waiting on the wondel read (D-1, stage 1a/1b); the budget and
the generated install file (D-10, RISK-9); the stale budget exemption (D-14, error matrix); the
register spec's "one entry" (D-15, MODIFIED delta); the isolation of stage 4 runs (D-16); the
PoEAA rule and the engineering trigger set (D-10, D-16); `ALL_CHECKS` (D-11); the telemetry
opt-out (D-7, RISK-6); the bundles' `requires` (Context, RISK-12); the double load on opencode and
the plugin copies (D-2, D-4, RISK-14); links in records (D-5). Clean: the inline `skills:` lists
pass the lint and TC-16; no name shadows a `skills/` folder or another entry; the fork counts
match; every frontmatter name matches its folder; `--skill` takes several values.

## Gate record

The full clarity gate ran twice on 2026-11-15, each time in a fresh subagent. Run 1: 8.6; its
twelve gaps were folded in (row reading of D-11, the install-table key, the pointer sentences, the
readers' rule list, the provenance path, the routing pass rule, test ids and messages, exact
commands and links). Run 2: **8.8** (Actionability 9.0, Specificity 8.5, Consistency 8.0,
Structure 9.5, Disambiguation 8.5, Reference clarity 9.5); stage 1 alone was scored about 9.2. By
the owner's rule that 8.8 is good enough (fold the small gaps in, no third run), its ten gaps were
folded in without a new run: the trigger runs' isolation (D-16), the coverage edge cases and their
tests (D-11, TC-13, TC-14), the spec's exemption of the skill itself, the per-skill command rule
and the multi-skill form (D-10, D-2, task 1.1), the missing-skill configuration and the login
(D-16), the list of cut headings (D-14, task 3.2), and the expected table rows (task 1.2). One
gap was declined: the inline `skills:` form is enforceable, by the line check in
`dependencies_register`.

## Delivery decisions

Stage 1a, PR #266. Five lenses and the tester; no reviewer labelled a finding Critical. The lead
re-labelled four, each with its reason, and fixes only those (the floor).

- **D-17** *(Critical, re-labelled; L3 W1, L4 W1 W2 W3, L5 W1, L1 S2, L2 S1, tester finding 1)*.
  `_dep_bundle` reads `bundles.yaml` itself and crashes on a non-string `bundle` or a wrongly
  shaped file. Reason for Critical: an exception there stops every lint check, so the guardrail
  goes down on one bad value. Fix: `dependencies_register` reads the names once through
  `_bundle_list` (the one validator); when it returns `None` the membership rule is skipped,
  because `bundle_gates` already reports the invalid file; a `bundle` that is not a string is
  reported as `'bundle' must be a bundle name`. The tester's bad-shape tests expect no crash and
  the `bundle_gates` message, not the membership message.
- **D-18** *(Critical, re-labelled; L1 W2, L5 W2)*. Nothing checks that the pin, the install
  commands and the skill list agree. Reason: the spec requirement "the pin is the commit that was
  read" is otherwise unenforced, and an edit to one copy installs unread text (RISK-10). Fix: for
  an entry with `bundle`, the lint requires a `pin` that starts with a 40-character commit, both
  install fields to carry `#<that commit>`, the names after `--skill` to equal `skills`, and the
  `skills@<version>` of each command to equal the `skills-cli` pin.
- **D-19** *(Critical, re-labelled; L1 W1, L2 W3)*. The setup docs offer the book sets before any
  override exists (stage 2), and the sets call themselves binding; and they tell a builder to skip
  the architecture row it needs. Reason: what an installer does by the doc today would make agents
  follow the books against `cosmic-python`. Fix: both setup sections and the CHANGELOG line say
  that until `skill-orchestration` ships the sets inform reasoning only and `cosmic-python` wins on
  a conflict, and that a bundle's rows include the bundles it requires.
- **D-20** *(Critical, re-labelled; L1 S1)*. `evidence/install-check.md` names a local scratch path
  with a user name and a session id, in a public repository. Reason: private details published.
  Fix: replace it with "a session scratch folder".

Under the floor (not fixed in this stage): the table-name prefix test and the cell expression in
`render_dependencies` (L4 W4, S1; L5 S1); the stale docstring (L4 S2); the test fixtures (L4 S3,
L5 S2); loading per entry (L4 S4, answered by D-17); the `agent-rules-books` opencode command not
run (L2 W2; opencode stays unverified, DEC-14); the telemetry check read from source, not the
network (L2 S2); the installer's floating transitive dependencies (L1 S3; accepted with RISK-6);
unescaped pipes in free-text cells (tester finding 2; the tables render Markdown as written);
empty cells for an invalid entry (tester finding 3; the lint already reports it). The tester's
file is kept and committed (L2 W1).

The checker passed the stage and agreed with all four re-labels. Its two suggestions are left for
stage 1b, under the floor: D-18 rejects a pin of the form `unpinned: …`, the fallback D-4 and the
spec still allow (moot while the full commit installs; align the lint if the fallback is ever
used); and a command with no `--skill` part passes `_dep_commands` (stage 2's
`external-skills-install` render rejects it).

Revised 2026-11-16, after the gate. EPIC `lean-skills` rewrote every skill to the lean standard and
was archived ([`2026-11-16-lean-skills`](../archive/2026-11-16-lean-skills/)). Every open task of
stages 2 to 4 was checked against the text and the sizes on `develop` `7d85edd`. Unchanged: 2.1 to
2.7 (the standard D-9 and D-10 rely on is the same; D-10's estimate stays 22 KB of 24; the probe
neighbours of D-12 and `use-cases/UC-W13-negotiation-partner.md` exist), 3.3 (the five agents of
D-13 have 23 to 32 body lines of 40, and a feature file each), 3.4 (still only two trigger sets),
3.5 and 4.1 to 4.5. Revised: 3.1 and 3.2, below. The clarity gate was not run again on these
entries (S-10 of [the reassessment](../delivery-process-and-tools/inputs/reassessment-2026-11-15.md)).

- **D-21 The lean standard is complete.** `skill-budget.yaml` has no `pending` key any more; only
  `over_budget` remains (`semantic-consulting-coach` is one of its five entries). The Context row is
  corrected in place.
- **D-22 Room for the pointer lines (task 3.1).** Sizes of the D-13 forecast, body plus
  references: `architecture` 24,576 (8,140 + 16,436), exactly at the budget; `sales-conversations`
  24,564, 12 bytes under it; `sales-qualification` 22,530; `cosmic-python` 20,676;
  `executive-communication` 11,246; `proposal-writing` 7,828; `estimation` 6,753;
  `technical-writing` 5,574; `semantic-consulting-coach` 32,021 under `over_budget`. The line of
  D-13 is about 112 bytes, so in `architecture` and `sales-conversations` it fails `prose_budget`
  unless the same pull request removes as many bytes from that skill (for `sales-conversations`,
  the cut of task 3.2 can pay for it). If no offset is found, the owner decides; the builder never
  adds an `over_budget` entry. Bodies already over the 6 KB target (`architecture`,
  `sales-qualification`, `semantic-consulting-coach`, `executive-communication`, `cosmic-python`)
  take the line only where the help applies, as D-13 says; it adds to an advisory note, not an
  error.
- **D-23 D-14's size facts are stale.** `sales-conversations` is 24,564 bytes, not 27,977, and is
  not pending, so the step "update `skill-budget.yaml` if `prose_budget` asks" of task 3.2 and its
  error-matrix row are moot. Corrected in place.
- **D-24 DEC-9 after lean-skills: shrunk to the lines left (owner, 2026-11-16).** Measured on `7d85edd`. The three files
  hold 13,088 bytes (`sales-conversations/references/selling-method.md` 7,767,
  `conversation-tools.md` 2,226, `sales-qualification/references/value-equation.md` 3,095). `lean-skills` already dropped the generic Voss definitions and the repeated "where not
  used" lines (its `evidence/assessment-sales-conversations.md`, rows 22, 29, 31, 39). What is left
  that restates the authors' method:
  - `selling-method.md`: principle 11 "Tactical empathy (Voss)", 187 bytes, already almost a
    pointer to `conversation-tools.md`. Principles 5 and 9 name Hormozi but state our rules (a
    small credited first step; never discount).
  - `conversation-tools.md`: the Listening opener (mirror, label, calibrated and no-oriented
    questions, "that's right"), 130 bytes; the graceful no, 53 bytes; Belief-breaking, 126 bytes
    with its heading; and the Hormozi step order inside the discovery flow, about 250 of a
    409-byte line that also carries our three MEDDPICC pillars.
  - `value-equation.md`: the paragraph defining the value equation, 194 bytes. Its lever table
    (about 560 bytes) applies the equation to the dossier with our evidence, so it is ours.

  In all, about 0.7 to 0.9 KB of 13 KB. A pointer through `skill-orchestration` costs about 110 to
  150 bytes each, so the net saving is under 0.5 KB. The Meaningfy restrictions stay in every
  option: the Hormozi and Voss lines of "Where each source is not used", the B2G row, the
  discovery flow's "does not close in the room", the accusation-audit condition, the focus
  question and the people behind the table, principles 5 and 9.
  Options: **(a)** keep task 3.2 as written (heading list, cut, second reader) for under 0.5 KB;
  **(b)** shrink it to the few lines above inside task 3.2, replaced by one pointer per file to
  `negotiation` or `hundred-million-offers`, with one second reader; this also pays for the D-22
  line in `sales-conversations`; **(c)** drop DEC-9 as done by `lean-skills`, drop or shrink the
  `sales-method-ownership` delta (D-15), and find the D-22 offset in `sales-conversations`
  elsewhere. The pointers of (a) and (b) name skills that stage 1b registers. Owner's answer
  (2026-11-16, one question round): **(b)**. DEC-9 keeps its intent; task 3.2 cuts only the lines
  listed above and pays for the D-22 line in `sales-conversations`.
- **D-25 A skill with no room (owner, 2026-11-16).** Standing rule for every planned addition to a
  skill at or near 24 KB: the same pull request cuts at least what it adds from that skill, or
  moves the prose to a tool or a template (S-9). Only when neither works does the builder ask the
  owner for an `over_budget` entry. This settles the open branch of D-22 for `architecture`.

## Open Questions

None left open. The owner answered the four planning questions on 2026-11-15
([`inputs/planning-2026-11-15.md`](inputs/planning-2026-11-15.md)).
