<!-- STATUS: EPIC shaped; PLAN derived (design.md + tasks.md), 2026-10-29. Shaped from the owner's decisions of 2026-10-29 (see the umbrella's
     inputs/qa.md). PLAN gated 9.2/10 (round 3); next: implementation. -->

# EPIC: Rule learner — learn, use, groom and forget the owner's rules

**Golden-thread parent:** the umbrella EPIC [`reasoning-capabilities`](../archive/2026-10-29-reasoning-capabilities/proposal.md).
Research: [`research-synthesis`](../archive/2026-10-29-reasoning-capabilities/inputs/2026-10-28-research-synthesis.md) and the
handover §4.6–4.7 and §5.4–5.6 ([`Reasoning and learning skills.md`](../archive/2026-10-29-reasoning-capabilities/inputs/Reasoning%20and%20learning%20skills.md)).

## Appetite

**LARGE.** Several related capabilities form one loop: a rule model and repository, a learner, a
steward that grooms, forgets and monitors, and a usage feed from Langfuse. If the work starts to grow
a graph store, an MCP or a learned (statistical) model, it has overrun this appetite.

## Why

The owner keeps stating how work should be done: corrections ("no, do it this way"), preferences
("prefer short sentences"), conventions, procedures, escalation limits. Today these statements are
lost at the end of a session, or kept as unapproved memory that the agent may or may not follow.
Agents that have memory still violate most of the preferences that apply to them (TellOnce, arXiv
2606.13174). The fix is a **small symbolic rule and preference learner**: explicit rules of known
types, approved by the owner, loaded where they apply, and kept alive or forgotten according to how
they are actually used.

## Solution outline

**One rule model.** Every rule is one of the handover's twelve types:
- trigger
- preference
- default-with-exception
- constraint
- procedure
- checklist
- selection heuristic
- parameter
- definition/convention
- escalation/autonomy
- quality criterion
- principle

Each rule has:
- a strength: hard, default or soft;
- scope tags: activity, context and project;
- a condition and an action;
- a `because`;
- a `source`, citing the owner's own words;
- a status: candidate, active or retired;
- dates;
- usage counts: loaded, applied and overridden.

Precedence: hard beats default beats soft, then the more specific scope wins, and a same-level
conflict goes to the owner. The skill also carries the recognition patterns for each type
(linguistic cues such as "always", "never", "prefer", "when … then …", "except", "before
finishing …"), so the learner classifies symbolically and does not guess.

**One repository.** It lives in the vault under `08 How to/`:
- a rules area holding one note per rule (kind `rule`);
- playbooks, one note per recurring activity (kind `playbook`), that hold the procedure and link the rules they use.

The new kinds and folders arrive through this EPIC, which is the skillery side of the vault rule that kinds grow through proposals (PLAN D-13).

**Three skills** (bundle: vault-assistant, `maturity: experimental`):
- **`rulebook`** owns the rule model, the classification patterns, precedence, the repository layout and the scripts:
  - `load`, which returns the merged active rules for an activity and context;
  - `lint`, which finds conflicts, dead rules, redundant rules, precedence cycles, circular exceptions, missing sources and oversized playbooks;
  - `check`, which runs a rule's deterministic `check` on an output;
  - `stats`.

  Each script is a small plain-Python tool.
- **`rule-learner`**, during and at the end of a session:
  - It detects rule-like statements and corrections in the owner's turns, classifies them against the patterns, and drafts candidate rules using a closed set of mutations: new, confirm, update, supersede, split, needs-owner, reject.
  - **The owner approves candidates per session.** Only the owner's own words can authorise a rule; mail, web or file content never can.
- **`rule-steward`**, weekly:
  - **Monitors**: reads usage from Langfuse traces and statistics. A rule is *loaded* when the `load` call appears as a tool span. It is *applied* when the agent's `cite` call appears as a tool span (PLAN D-7 replaced the citation line). It is *overridden* when the learner logged a correction against it.
  - **Grooms**: merges, splits, resolves conflicts and re-runs lint.
  - **Forgets**: proposes retiring rules that are stale, never loaded or often overridden.
  - **Revises the repository with the owner.** Nothing is deleted without the owner's say.

**Usage infrastructure: Langfuse, required.** The Langfuse Claude Code plugin is the hook. It already
captures every tool call and every turn, so the catalogue ships no hook of its own. The steward reads
Langfuse through its API with read-only keys. If Langfuse is not configured or not reachable, the
steward stops and says so. The deployment is specified separately for the infrastructure stacks repo:
[`docs/environment/langfuse-deployment-spec.md`](../../../docs/environment/langfuse-deployment-spec.md).

**How rules reach a session:**
- the vault's `AGENTS.md` names the repository and tells the agent to call `load` for the activity at hand;
- the agent records the rule IDs it applied with `cite`;
- the `check` rules run on the output before it is handed over.

## Key decisions

- **DEC-1** (owner): Learn from corrections **and** from any rule-like statement, classified into the
  handover's twelve rule types. Rejected: learning from corrections only.
- **DEC-2** (owner): A small symbolic learner: recognition patterns and rule types are specified in
  the skill, and rules are maintained, forgotten and newly learned against them. Rejected:
  reinforcement learning, embeddings or opaque memory.
- **DEC-3** (owner): Rules are approved per session and revised weekly. Rejected: weekly-only approval.
- **DEC-4** (owner): Usage is monitored from Langfuse traces and statistics, and Langfuse is a hard
  requirement of the steward. Rejected: a stop-hook ledger built into the catalogue.
- **DEC-5** (owner): The repository lives in `08 How to/` (rules plus playbooks, organised and
  groomed). Rejected: a new top-level folder.
- **DEC-6** (owner): A set of skills that learn, groom, forget and monitor. Rejected: one monolithic
  skill.
- **DEC-7** *(proposed; reasoned in PLAN D-1)*: Three skills (`rulebook`, `rule-learner`, `rule-steward`), with monitoring and
  forgetting inside the steward, since both feed the weekly revision. Rejected: a fourth `rule-monitor`
  skill, kept as an option if the steward grows too big.
- **DEC-8** *(proposed)*: One note per rule (the properties drive Bases views and usage counts), with
  playbooks linking rules by ID. Rejected: rules as list items inside playbook files.
- **DEC-9** *(proposed)*: Not tied to any one activity. The first activities are chosen by the owner at
  the trial. Rejected: an offers-first trial.

## Rabbit-holes

- **Scripts shared across skills.** Shipped scripts must live in their owning skill (`rulebook/scripts/`), and the other two skills must reach them through a stable path on both CLIs. Solve this in the PLAN; don't copy scripts.
- **The "applied" signal is self-reported.** Treat it as weaker than "loaded" and "overridden", and measure how often it agrees with the owner's view before trusting it in the forgetting decisions.
- **Over-learning.** A single offhand remark is a candidate, not a rule. Recurrence and approval decide.
- **Context cost.** `load` returns only the rules in scope, never the whole repository.
- **opencode.** It has no Langfuse plugin that we know of. Record monitoring there as a parity gap rather than build a substitute.

## No-gos

- No knowledge graph, vector store or MCP server for the rules.
- No learned model or reinforcement learning.
- No rule enters the repository without the owner's approval.
- No agent edits a skill: promotion into skillery goes through `skill-change`.
- No hook shipped by the catalogue: the Langfuse plugin is the only capture.
- No Langfuse deployment inside this EPIC; it lives in the infrastructure stacks repo.
- No replacement of Claude Code auto memory inside code repos.

---

## What Changes

- New skills `rulebook`, `rule-learner` and `rule-steward` in vault-assistant.
- vault-conventions gains the `rule` and `playbook` kinds and their place under `08 How to/` (this EPIC is the
  proposal the vault conventions require; PLAN D-13).
- vault-planning's weekly review calls the steward. vault-capture hands rule-like statements to the learner.
- `dependencies.yaml` gains Langfuse (kind `service`) and the Langfuse Claude Code plugin (kind `plugin`).

## Capabilities

### New Capabilities

- `rule-learning`: the rule model, the repository, learning with per-session approval, and use, monitoring, grooming and forgetting.

### Modified Capabilities

- `vault-conventions`: the `rule` and `playbook` kinds and their home under `08 How to/` (ADDED requirement).
- `vault-planning`: the weekly rules step (ADDED requirement).

## Impact

- Bundle vault-assistant (three new skills, edits to vault-conventions, vault-planning and vault-capture).
- An external service dependency on a reachable Langfuse with API keys, and the Claude Code plugin on the owner's machine.
- The owner's vault: new kinds and areas under `08 How to/`.
