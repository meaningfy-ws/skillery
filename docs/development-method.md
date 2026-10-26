# Skills and Agents Development Method

How skills and agents are conceived, written, documented, tested, installed, improved and retired in
this catalogue — so that someone who did not write them can **install one bundle, understand what they
got, use it on the first try, and report what went wrong**. Everything here serves that reader.

> **Status:** working method, in force. It is also the hypothesis under test in the EPIC
> [`skill-crafting-method`](../openspec/changes/skill-crafting-method/proposal.md), which compares it
> section by section with the published methods and decides what skillery keeps, adopts by reference,
> or separates out.

This document is the human canon for the method. The binding that mandates it is
[`AGENTS.md` → Skills and agents development method](../AGENTS.md#skills-and-agents-development-method);
the structural references it routes to are listed in [§8](#8-where-things-live).

---

## 1. Start from the person who installs it

Every skill and agent is written for three readers, in this order:

| Reader | What they need from you | Where they look |
|---|---|---|
| **The user** who installs a bundle | To know in one sentence what this does, when it fires, how to call it, and one worked example | The `description`, the Quick Start, the README's "I want to…" table |
| **The agent** that loads it | A description that triggers at the right moment, a lean body, detail on demand | Frontmatter, SKILL.md, `references/` |
| **The maintainer** who fixes it later | One owner per fact, a failure case, probes, a changelog line | `tests/`, the EPIC or PR, `CHANGELOG.md` |

If a change helps the agent but confuses the user, it is not done.

## 2. Principles

1. **One job.** A skill teaches one method; an agent does one job. "Review and fix" is two agents.
2. **Thin agents, thick skills.** An agent body carries role, job, dispatch contract and glue. Any
   reusable knowledge in an agent body is a defect: move it to the skill that owns it.
3. **One owner per fact.** A rule lives in exactly one skill; everything else cites it
   (`tests/ownership.yaml` is the tripwire). Duplication is the most common way a catalogue rots.
4. **Reference, don't copy.** External skills (superpowers, stream-coding, obsidian-skills, …) are
   dependencies, declared and linked. Vendor one only with a provenance note (source, commit,
   licence, date) and a review; never install from a directory sight-unseen.
5. **Failure-first.** A skill or agent exists because an agent did something badly without it. That
   case is written down before the first line of the skill, and it becomes the acceptance test.
6. **Trigger is the product.** The `description` is the only text the agent reads before deciding to
   load a skill. Write it as *when to use / when not to use*, and prove it with probes.
7. **Progressive disclosure.** SKILL.md holds the method in a few hundred words; details, tables and
   templates go to `references/`, `assets/`, `scripts/`. Context is the scarcest resource.
8. **CLI-agnostic bodies.** Skills and agents run on Claude Code and opencode from one source; the
   body names no CLI command forms or paths (the `body_agnosticism` gate checks).
9. **Nothing secret, nothing local.** No hosts, credentials, ports, personal paths or client names in
   a skill or agent; method only.
10. **Installable or it does not exist.** A skill belongs to exactly one bundle; an agent to exactly
    one bundle; every external dependency is declared; a fresh install on both CLIs is the last check.

## 3. Lifecycle — skills

**Change path.** New skill, rename, boundary move, retirement → an EPIC in `openspec/changes/`.
Wording, link, probe, or description tweak that moves no boundary → a direct PR from a feature branch.
When unsure, EPIC.

| # | Step | Produces | Route |
|---|---|---|---|
| 1 | **Decide it is a skill** — not an agent (acts), doc (narrates) or binding (mandates); not already owned; not already external | A one-line job statement | [`spec/skill-repo-governance.md`](../spec/skill-repo-governance.md), [`skill-inventory.md`](skill-inventory.md), [`tests/ownership.yaml`](../tests/ownership.yaml) |
| 2 | **Write the failure case** — the prompt, what came out, what should have | A dated note in the EPIC's `inputs/` or the PR | — |
| 3 | **Shape the boundary** — name, `boundary`, `related_skills`, owned facts, description-as-trigger | Frontmatter draft; `ownership.yaml` entries | [`spec/agent-skills-spec.md`](../spec/agent-skills-spec.md) |
| 4 | **Write it lean** — template, Quick Start with one worked example, "when not to use", details in `references/` | `skills/<name>/` | [`spec/skill-template.md`](../spec/skill-template.md), [`spec/CREATING_SKILLS.md`](../spec/CREATING_SKILLS.md) |
| 5 | **Prove it** — one positive probe, one near-miss probe for the closest neighbour; before/after on the failure case; `skill-creator` evals where available | `tests/trigger_probes.yaml` entries; before/after in the PR | [`tests/trigger_probes.yaml`](../tests/trigger_probes.yaml) |
| 6 | **Register and regenerate** — bundle (`bundles.yaml` + `make bundles`), `PURPOSE_OF`, inventory, validate | Green `make validate` | [`AGENTS.md` → How to maintain](../AGENTS.md#how-to-maintain--extend-the-catalogue) |
| 7 | **Document for the user** — README "I want to…" row if it is a new entry point; CHANGELOG line in user language ("you can now…", not "refactored…") | README, CHANGELOG | [`README.md`](../README.md) |
| 8 | **Ship** — conventional commit, PR, review; version only via the release flow | A release note users can read | [`skills/meaningfy-git-workflow`](../skills/meaningfy-git-workflow), [`skills/meaningfy-release`](../skills/meaningfy-release) |

## 4. Lifecycle — agents

Agents follow the same eight steps with four additions. The normative shape is
[spec/agent-template.md](../spec/agent-template.md).

- **Type before body.** Declare whether the agent is *delegated* (spawned for one job, returns a
  result), *lead* (plans, delegates, synthesises) or *scheduled* (runs unattended on a trigger,
  reports to a note or channel). The type decides what the dispatch contract must say and how each
  CLI renders it.
- **Dispatch contract, always.** Four short lists: what input it needs, what it returns, what side
  effects it may have, what it refuses. If the agent is fanned out (the five-lens `code-reviewer`),
  the contract states the unit of one run.
- **Skills, not knowledge.** The `skills:` list is the agent's competence; the body may not restate
  a skill. If you find yourself writing method in an agent, stop and move it.
- **Tests in Gherkin, in this repo.** Scenario Outlines with Examples tables, values in the tables,
  variables in the step text, under `tests/features/`. An agent is "in" when its scenarios reference
  the installed skills by name.

Model names are family aliases (`opus`, `sonnet`, `haiku`); the opencode mapper resolves them.

## 5. Documentation standard — what every skill and agent must carry

A stranger must be able to use it from its own files, without asking the author.

**Every skill**

- `description`: one or two sentences, trigger-shaped (*Use when… / Not for…*), listing the phrases
  that should fire it.
- **Quick Start**: the shortest path to a result, with one real worked example (input → output).
- **When not to use** (the boundary) and **Related skills** (cited by name, never restated).
- Detail in `references/`, each file named for its question (`principles-and-anti-patterns.md`, not
  `notes.md`), and linked from SKILL.md at the point of use.
- No "Overview" that repeats the description; no history; no TODOs (those are issues).

**Every agent**

- Description: the one job, and when a caller should pick this agent over doing it in the main
  thread.
- The dispatch contract (§4).
- Model and tools in frontmatter; bundle in `bundles.yaml`; nothing in the body that belongs in a skill.
- One example invocation in the README's build-loop or bundle table.

**Every bundle**

- One row in the README "What's inside" table: who installs it and why.
- Its external dependencies named with install commands, in `docs/environment/`.

**Every change users will notice**

- A CHANGELOG line written for the installer, not the author: what they can now do, what they must
  do (reinstall, rename), what went away and what replaces it.

## 6. Installability and reuse

- **One bundle per role ("the hat you wear").** A skill is in exactly one; an agent in exactly one.
  Membership is declared once, in `bundles.yaml`.
- **Both CLIs, one source.** Claude Code installs bundles from the marketplace; opencode and the
  other agents install skills from `skills/` (`npx skills add meaningfy-ws/skillery`, or the opencode
  installer). The body-agnosticism gate keeps the text valid for both.
- **Declared dependencies.** External skills, MCP servers and tools a bundle needs are listed where
  the user installs (`docs/environment/setup.md`), with the exact command and the version that was
  tested.
- **Fresh-install check before release.** A clean machine or profile installs the bundle, lists the
  loaded skills, and runs one Quick Start. If the count or the names are not what the README says,
  it does not ship.
- **Versioning.** One `VERSION`; semver; breaking = a user must do something (reinstall, rename, move
  a file). Release notes repeat the CHANGELOG lines that need action, first.
- **Reuse test.** Before adding a skill, ask who the second user is. A skill with one user and one
  project is a project file, not a catalogue entry.

## 7. Feedback and improvement loop

Defects and ideas arrive as **GitHub issues**; they leave as probes, fixes, EPICs or a documented
"won't do". Templates under [`.github/ISSUE_TEMPLATE/`](../.github/ISSUE_TEMPLATE/) ask for exactly
what the loop needs.

| I want to… | Open | It becomes |
|---|---|---|
| Report a skill or agent that misbehaved | **Defect** — the prompt, what came out, what should have, which CLI, which version | A failure case (§3 step 2) → a fix in the owning skill + a probe; or a line in a batch EPIC such as `fix-accumulated-skill-defects` |
| Report a skill firing when it shouldn't (or not firing) | **Defect**, tagged `trigger` | A near-miss probe + a description change |
| Ask for a new skill or agent | **Request** — the job, who the second user is, what exists today, the failure case | A triage decision: reference an external skill / extend an existing one / shape an EPIC / decline with reason |
| Report an install or docs problem | **Defect**, tagged `install` or `docs` | A direct PR |
| Propose a change to the method itself | **Request**, tagged `method` | An edit to this document via PR, or an EPIC if it changes a gate |

Rules of the loop:

- **Every defect is reproducible or it is a question.** The template asks for the prompt and the
  output; without them the issue is answered, not fixed.
- **Fix where the fact lives.** The owner is found through `skill-inventory.md` and
  `ownership.yaml`; the fix never lands in a second place.
- **No fix without a probe or a test.** A description change ships with a probe; an agent change
  ships with a scenario.
- **Triage weekly, batch small fixes.** Small defects are collected and shipped as one batch EPIC per
  cycle; trigger and docs fixes may go straight to PR.
- **Close with the release.** An issue is closed by the PR that fixes it and named in the CHANGELOG
  line, so the reporter can find the version that carries the fix.
- **Say no in writing.** A declined request gets a one-paragraph reason and, where it exists, the
  external skill or the existing skill that covers it.

## 8. Where things live

| Question | Read |
|---|---|
| What is a skill / agent / doc / binding; placement rules | [`spec/skill-repo-governance.md`](../spec/skill-repo-governance.md) |
| The skill file format and metadata | [`spec/agent-skills-spec.md`](../spec/agent-skills-spec.md), [`spec/skill-template.md`](../spec/skill-template.md) |
| Step-by-step authoring, structure, scripts, assets | [`spec/CREATING_SKILLS.md`](../spec/CREATING_SKILLS.md) |
| Submission checklist and PR process | [`CONTRIBUTING.md`](../CONTRIBUTING.md) |
| The agent contract (type, dispatch, body cap) | [spec/agent-template.md](../spec/agent-template.md) |
| Which skill owns which fact; trigger probes | [`tests/ownership.yaml`](../tests/ownership.yaml), [`tests/trigger_probes.yaml`](../tests/trigger_probes.yaml) |
| Per-skill purpose and dependencies | [`skill-inventory.md`](skill-inventory.md) |
| Dual-CLI rules and gates | [`AGENTS.md`](../AGENTS.md#dual-cli-authoring-rules), [`environment/dual-cli/`](environment/dual-cli/README.md) |
| Installing, external dependencies | [`environment/setup.md`](environment/setup.md) |
| Commits, branches, PRs; versions and releases | [`skills/meaningfy-git-workflow`](../skills/meaningfy-git-workflow), [`skills/meaningfy-release`](../skills/meaningfy-release) |
| Roles and who is accountable | [`roles-and-raci.md`](roles-and-raci.md) |

## 9. Definition of Done

A skill or agent change is done when every line below is true. It is the review checklist.

- [ ] A failure case is recorded (EPIC inputs or PR).
- [ ] One job; the description is trigger-shaped; `boundary` and `related_skills` set.
- [ ] No fact is stated that another skill owns (`ownership.yaml` checked or updated).
- [ ] SKILL.md is lean; detail is in `references/`; Quick Start has one worked example.
- [ ] Agent: type declared, dispatch contract present, body holds no method, scenarios in
      `tests/features/`.
- [ ] Probes: one positive, one near-miss; before/after kept.
- [ ] Exactly one bundle; `PURPOSE_OF` entry; `make skill-inventory`; `make bundles` if membership
      or agent frontmatter changed; `make validate` green.
- [ ] Licence and provenance recorded for vendored or third-party content — per-skill `LICENSE.txt`
      where it differs from the repo's, `THIRD_PARTY_NOTICES.md`, and a provenance note (source,
      commit, licence, date) per the provenance rule in
      [`spec/skill-repo-governance.md`](../spec/skill-repo-governance.md#placement-rules) (rule 1).
- [ ] README row if it is a new entry point; CHANGELOG line in user language; issue referenced.
- [ ] Fresh install on both CLIs shows the expected skills (release-time).
