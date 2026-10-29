<!-- STATUS: EPIC shaped 2026-10-29 from the owner's statements and answers of the same day (inputs/qa.md).
     All decisions confirmed by the owner (DEC-5 to DEC-8 on 2026-10-29); next: the PLAN. -->

# EPIC: Rules in every session

**Golden-thread parent:** the archived EPIC [`rule-learner`](../archive/2026-10-29-rule-learner/proposal.md),
whose reach this change widens. It re-shapes part of the umbrella's DEC-4
([`reasoning-capabilities`](../archive/2026-10-29-reasoning-capabilities/proposal.md)): rule learning
was placed "with the vault, where the rules are stored". The skills that learn and apply rules now go
wherever the user works, and development work gains a second store in the repository.

## Appetite

**LARGE**, delivered in two steps that each ship alone:

1. **Reach:** the rule skills reach every interactive session, with the vault as the one store.
2. **Repository store:** in development work, a rule can live in the repository instead, shared with
   the team through git.

If the work starts to change the rule model or precedence, add a third store, or need a hook, it has
overrun this appetite. Step 2 can be cut without touching step 1.

## Why

The rules the rule skills learn and manage are **the user's own rules and preferences**, and the user
states them in virtually any session: writing a memo, reviewing a PR, planning an EPIC, coding. Today
the skills only reach vault sessions. They ship in the `vault-assistant` bundle, and the one
instruction to load them is a line in the vault's `AGENTS.md`. In a code repository nothing asks for
them, so a rule stated there is lost and a rule in force is not applied: the rule-learner EPIC's own
failure case F-1, a rule stated in one context that does not reach another.

Development work adds a second kind of rule. "Never commit to main" said in a repository may be the
project's convention rather than one person's habit, and a project convention belongs with the
project, where the team sees and reviews it.

## Solution outline

- **Every install has the rule skills.** `rulebook`, `rule-learner` and `rule-steward` move together
  to `meaningfy-core`, the bundle every Meaningfy user installs.
- **Every session is asked to use them.** The personal global instructions (the routing policy in
  `docs/environment/global-prompt.md` that each user pastes into their CLI's global instructions)
  gain one line: at the start of an activity load the rules for it, and at the end of a session where
  the user stated or corrected something, offer the rule approval card.
- **Where a rule is stored follows where the work happens.** A session in a git repository is
  development work: the approval card stores a rule in that repository's `docs/` folder by default,
  and the repository's `AGENTS.md` carries a pointer to it. Every other session, including Claude
  Desktop work outside a repository, stores in the user's vault, found through `MEANINGFY_VAULT`.
  In each row of the card the user can switch to the other store. `load` reads both.
- **No store, no failure.** A session that finds neither says once that the rules are not loaded and
  carries on.
- **Outcome:** a rule stated in any session can be approved, and is then applied in every later
  session it scopes to, vault or repository, on either CLI.

## Key decisions

- **DEC-1** (owner, 2026-10-29): The rules are the user's rules and preferences, and the user can
  express one in virtually any session. Their reach must match: every interactive session, not only
  the vault. This re-shapes umbrella DEC-4 for the rule skills only; `formal-reasoning` is a separate
  change.
- **DEC-2** (owner, 2026-10-29, confirmed the same day): The store follows the work. A git
  repository is the signal of development work: there, rules go to the repository's `docs/` folder,
  with a pointer in its `AGENTS.md`. Otherwise the vault is the default. The repository is the one
  where the work takes place, never a dedicated rules repository.
- **DEC-3** (owner, 2026-10-29): Scheduled and unattended agents neither load nor learn rules, for
  now.
- **DEC-4** (owner, 2026-10-29): Activity names are an open list. The PLAN seeds it with `coding`,
  `code-review` and `planning` beside the vault's writing, offers and reviews, and fixes no closed
  vocabulary.
- **DEC-5** (proposed, confirmed by the owner 2026-10-29): Move all three rule skills to `meaningfy-core`, together. They call one script
  by a sibling path, which holds only inside one bundle (rule-learner D-2, and the test that asserts
  it). Rejected: moving only `rulebook` and `rule-learner` (it breaks `rule-steward`'s path to the
  script); a new `rules` bundle (one more install for a capability every user needs).
- **DEC-6** (proposed, confirmed by the owner 2026-10-29): Rules reach sessions through the **personal** global instructions. A
  repository's `AGENTS.md` carries only the pointer to its own rule store (DEC-2), never the user's
  personal rules. Rejected: a session-start hook (per CLI, and it would load rules before the activity
  is known).
- **DEC-7** (proposed, confirmed by the owner 2026-10-29): One rule model, one script. `rules.py`, the rulebook's command-line tool and
  the only reader and writer of rule notes, keeps every command and behaviour. It gains one thing:
  when run inside a git repository it also reads that repository's rule folder, and its writers take
  the store the card chose. The repository store uses the same note format, precedence and lint.
  Repository rules take their own id prefix, because a shared repository and a personal vault cannot
  allocate numbers together. A rule from one store that disagrees with a rule from the other is a
  `CONFLICT` for the user, like any other.
- **DEC-8** (proposed, confirmed by the owner 2026-10-29): A rule written to the repository lands as a file change in the working tree.
  It reaches the team through the normal commit and pull request, which is where the team approves it.

## Rabbit-holes

- **Personal preferences stated in a repository.** With the repository as the default store there,
  "British English" said while coding would land in the team's repository. The card must show the
  store on every row, so the user can move a personal preference to the vault in one word.
- **The permission path names the bundle.** The per-machine allow rule for `rules.py` contains
  `vault-assistant` in its plugin-cache path. It changes with the move, on both CLIs, and must be
  tested live, which the rule-learner change never did.
- **Weekly review of repository rules.** `rule-steward` reviews the vault. Grooming a repository's
  rules belongs to that repository's team; this change does not schedule it.
- **Noise.** Loading rules in every short session costs context. `load` already prints only what
  applies; keep it that way.
- **Which surfaces can run `rules.py`.** Checked against the official docs on 2026-10-29 (sources
  in `inputs/qa.md`):
  - the Claude Code CLI and the Code tab of Claude Desktop run it on the user's machine, so both work;
  - Desktop chat and claude.ai run a skill's code in an Anthropic container with no path to the
    laptop, so they cannot reach the vault;
  - Cowork's access to local folders and environment variables is unverified, and needs a live test
    in the PLAN;
  - Claude Code on the web runs in a cloud VM without the vault.

  Desktop's Code tab may not read the shell profile, so `MEANINGFY_VAULT` must also be set in the
  CLI's user settings (`env`).
- **Sessions that cannot see either store** (cloud sessions, CI, another machine) must stay silent
  after the one line, never stop.

## No-gos

- No dedicated repository that holds all the rules. The repository store is the repository where
  the work takes place, for that work's rules only.
- No copy of the vault's rules into a repository, and no repository rule copied into the vault.
- No repository store outside a git repository, and none created before the user approves a row
  that writes there.
- No hook that injects rules automatically.
- No rules in Claude Desktop chat or claude.ai. Their code cannot reach the vault; a local MCP server
  that serves the rules would be a separate change.
- No change to the rule model, precedence or the lint.
- Scheduled and unattended agents neither load nor learn rules (DEC-3).
- No Langfuse tracing for opencode; the known parity gap stays.

---

## What Changes

- **Step 1:**
  - `bundles.yaml`: the three rule skills move from `vault-assistant` to `meaningfy-core`; regenerate
    the bundles and the skill inventory.
  - `docs/environment/global-prompt.md`: one routing line for the rule skills, for both CLIs.
  - `vault-setup`: the per-machine permission entries follow the new path. **BREAKING** for anyone
    who has added that allow rule: it must be updated after the upgrade.
  - The three skills' descriptions and guidance cover sessions outside the vault.
  - Docs: `rules.md`, `vault-assistant.md`, `setup.md`, the README entry-point row, a CHANGELOG line.
- **Step 2:**
  - `rules.py`: a second root for the repository store; `load`, `check`, `lint` and the writers work
    across both.
  - `rule-learner`: the approval card shows each row's store, defaulting to the repository in a git repository.
  - The rule model reference: the repository store and the pointer line.
  - `project-setup`: how a repository opts in (the folder and the pointer line), cited, not restated.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `rule-learning`: rules reach every interactive session, and a development rule can live in the
  repository (two added requirements).

## Impact

- `meaningfy-core` grows by three skills and its description changes; `vault-assistant` shrinks.
- Every user who installs `meaningfy-core` gets the rule skills; they stay inert until a store is found.
- `vault-planning` keeps calling `rule-steward` by name, across bundles.
- A repository where a rule was approved holds rule notes under `docs/` and one pointer line in its `AGENTS.md`.
- Probes: a rule stated in a code session (positive), and a project convention that is not a
  personal rule (near-miss).
