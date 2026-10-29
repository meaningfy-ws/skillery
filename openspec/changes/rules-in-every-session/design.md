<!-- PLAN (design half). PLAN = this file + tasks.md. Revision 1, 2026-10-29, derived from the EPIC as
     shaped the same day with DEC-1..DEC-8 all owner-confirmed. Clarity gate: self-scored 9.1 by the
     planner (see the hand-off report); an independent score is task 0.2. -->

> Derives from: EPIC `rules-in-every-session` ([`proposal.md`](proposal.md)), golden-thread parent
> [`rule-learner`](../archive/2026-10-29-rule-learner/proposal.md) and its PLAN
> ([`design.md`](../archive/2026-10-29-rule-learner/design.md), cited below as RL-D-n). Acceptance
> criteria are the scenarios in [`specs/rule-learning/spec.md`](specs/rule-learning/spec.md).

## Context

- The rule skills work, but only in vault sessions:
  - they ship in `vault-assistant` (`bundles.yaml`);
  - the one instruction that loads them is line 31 of `skills/vault-setup/assets/AGENTS.md`;
  - `docs/environment/global-prompt.md` (the personal routing policy) does not mention them.
- `rules.py` (RL-D-2) knows one store. `find_vault()` (`skills/rulebook/scripts/rules.py:152`) takes
  `MEANINGFY_VAULT` or the current directory, and else raises exit 3 (RL-D-14). Ids match `R-\d{4}`
  (`ID`, line 38). That pattern is used by the lint, by `_id` (argparse), by `_all_ids` and by `stats`.
- The Claude Code per-machine allow rule pins `.../meaningfy-skillery/vault-assistant/*/skills/rulebook/...`
  (`skills/vault-setup/references/permissions-claude-code.md:110`). The opencode rule pins the flat
  skills folder, `~/.config/opencode/skills/rulebook/...`, which has no bundle in its path. **Only the
  Claude Code rule breaks with the move.**
- `tests/test_rulebook.py` runs the script with `cwd=ROOT`, the skillery checkout. That checkout is a
  git repository without `docs/rules/`, so the existing suite already exercises "in a git repository,
  no repository store". It is the backwards-compatibility suite for step 2.
- The branch `feat/rules-in-every-session` was cut at `1469b94`, before PR #123 split
  `docs/environment/rules.md` out of `reasoning-and-rules.md`. Task 0.1 merges `develop` first.
- Owner decisions, cited and not re-argued:
  - reach is every interactive session (DEC-1);
  - in a git repository the store follows the work (DEC-2);
  - no scheduled or unattended agents (DEC-3);
  - activity names are an open list (DEC-4);
  - all three skills move to `meaningfy-core` (DEC-5);
  - personal global instructions route sessions to them (DEC-6);
  - one model, one script, a separate id prefix and cross-store `CONFLICT` (DEC-7);
  - repository rules land as working-tree changes (DEC-8).

## Goals / Non-Goals

**Goals:**
- Step 1 (reach): any interactive session on either CLI can load the vault's rules and learn new
  ones. `rules.py` is unchanged in this step.
- Step 2 (repository store): in a git repository, a rule can be written to and read from that
  repository's `docs/rules/`. Every existing command, output and exit code stays the same wherever no
  repository store exists.
- Each step ships, and is reverted, on its own.

**Non-Goals:** the EPIC's no-gos, plus:
- `rule-steward` grooming, monitoring or stats for repository rules;
- playbooks, golden examples or candidates (`status: idea`) in the repository store;
- a command that renumbers rules.

## Decisions

### Step 1: reach

- **D-1 Bundle move (DEC-5).**
  - `rulebook`, `rule-learner` and `rule-steward` leave `vault-assistant` for `meaningfy-core`.
  - Both bundle descriptions change: `meaningfy-core` gains "your own rules for agents: load, learn and
    groom them (rulebook, rule-learner, rule-steward)", and `vault-assistant` drops its rules clause.
  - The sibling path of RL-D-2 still holds, because all three skills share one bundle.
  - `vault-planning` (vault-assistant) calls `rule-steward` by name across bundles. That works,
    because `meaningfy-core` is installed by everyone.
- **D-2 Facets.**
  - `rulebook` and `rule-learner` become area `cross-cutting` and subject `generic`: they now work
    in any session and store.
  - `rule-steward` keeps area `personal` and subject `obsidian`, because it reviews only the vault (D-14).
  - All three keep purpose `knowledge`, posture `precise`, stage `any` and maturity `experimental`.
- **D-3 The routing line (DEC-6).** One bullet is added to `docs/environment/global-prompt.md`, after
  the "Commits/PRs" bullet:

  > - Your own rules → at the start of an activity (writing, offers, reviews, coding, code-review,
  >   planning, …) **meaningfy-core:rulebook** `load` for it; when I state or correct how work should
  >   be done, **meaningfy-core:rule-learner** shows its approval card at the end of the session.
  >   Interactive sessions only: a scheduled or unattended run skips both. If `load` finds no rule
  >   store, say so once and carry on.

  The page's header names both targets: `~/.claude/CLAUDE.md` (Claude Code) and
  `~/.config/opencode/AGENTS.md` (opencode, where the skill is asked for as `rulebook`, without the
  bundle prefix). The vault template's line 31 stays, because a vault session that has not pasted the
  global prompt still needs it.
- **D-4 Activity names (DEC-4)** are listed in one place, the Scope section of
  `skills/rulebook/references/rule-model.md`: "Activity names are an open list. In use: `writing`,
  `offers`, `reviews`, `coding`, `code-review`, `planning`. A new name needs no change anywhere."
  `rule-learner`'s L-4 cites it: an activity without a playbook has no vocabulary, so its context tags
  are proposed in the card (the existing rule) and the vocabulary lint is silent for it.
- **D-5 "Say once" (spec: No vault available)** is a use-protocol rule in `rulebook`'s SKILL.md:
  - When `load` exits 3, tell the user once per session: "Your rules are not loaded: set
    `MEANINGFY_VAULT` (see docs/environment/setup.md)". Do not run `load` again in that session, and
    carry on.
  - `rule-learner` in such a session still drafts candidates and shows the card. On approval it
    explains the write cannot happen without a store and offers the row text for later. Nothing is
    lost silently.
- **D-6 The per-machine allow rule moves to `rulebook`.**
  - It is a fact about running the script, which `rulebook` owns. A user with only `meaningfy-core`
    installed has no `vault-setup` to read it from.
  - New home: a "Permissions (per machine)" section in `skills/rulebook/references/commands.md`, for
    both CLIs. The Claude Code pattern becomes
    `Bash(python3 <home>/.claude/plugins/cache/meaningfy-skillery/meaningfy-core/*/skills/rulebook/scripts/rules.py *)`.
    The opencode pattern is unchanged.
  - The two `vault-setup` permission references keep the "approve it, never refuse it" exception and
    replace their per-machine section with one line pointing to the new section.
  - **BREAKING (Claude Code only):** an allow rule with `vault-assistant` in its path stops matching.
    The CHANGELOG line says so, with the new pattern.
- **D-7 Desktop's Code tab environment.** `docs/environment/setup.md` adds that `MEANINGFY_VAULT` also
  goes into the `env` key of `~/.claude/settings.json`, because the Desktop Code tab may not read the
  shell profile. Surfaces that cannot run the script are listed in `docs/environment/rules.md`, in a
  "Where your rules work" table taken from `inputs/qa.md` (task 4.2 updates the Cowork row).

### Step 2: the repository store

- **D-8 Store discovery.** `find_stores()` returns `(vault, repo)`, each a `Path` or `None`, and never
  raises.
  - **vault:** exactly today's `find_vault()` rule, with `None` in place of `EnvError`.
  - **repo:**
    - Walk up from `Path.cwd().resolve()` to the filesystem root, looking for an entry named `.git`
      (a directory, or a file for worktrees and submodules). Stdlib `pathlib` only; `git` is never run.
    - The directory holding `.git` is the repository root.
    - The repository store is `<root>/docs/rules/`. It *exists* when that directory exists.
  - **No repository store** (repo = `None`) when any of these holds:
    - no `.git` is found;
    - the repository root is `Path.home()`, as in a dotfiles repository;
    - the current directory is the vault root or inside it. This holds when the vault is itself a git
      repository, or lies inside one.

  `find_vault()` stays, and the vault-only commands (`stats`, `check --golden`, `approve`) keep
  calling it.
- **D-9 Folder name:** `docs/rules/`, one flat folder.
  - Files are `P-NNNN <title>.md`, with the same title rule as RL-D-3.
  - The reader globs only `P-[0-9][0-9][0-9][0-9] *.md`, so a `README.md` or other files a team keeps
    there are ignored, never parse errors.
- **D-10 Id prefix: `P-NNNN`** ("project"), allocated as the highest `P-` id in `docs/rules/` + 1, with
  RL-D-3's exclusive create and one retry.
  - New constants: `REPO_ID = P-\d{4}` and `ANY_ID = [RP]-\d{4}`.
  - The lint checks `R-` in the vault and `P-` in the repository, so a note with the wrong prefix is
    the existing `invalid` error.
  - `_id`, the argparse type for `cite`, `override`, `update`, `confirm`, `retire`, `approve`,
    `--exception-of` and `--supersedes`, accepts `ANY_ID`.
  - `stats` keeps `ID = R-\d{4}` everywhere, so repository rules are never counted or flagged (D-14).
- **D-11 Repository rule notes** use RL-D-3's format, with two differences:
  - **`private: false`**, because the note is shared with the team through git;
  - **no `idea` status written by the script** (D-13).

  Every other field, the quoting rules and round-trip stability are unchanged.
- **D-12 The pointer line.** On the first write that creates `docs/rules/` (not on `--dry-run`),
  `rules.py` appends this line to `<root>/AGENTS.md`, preceded by a blank line:

  ```
  - **Rules:** this repository's rules for agents are in [`docs/rules/`](docs/rules/). At the start of an activity, load them with the rulebook skill; change them only through it, by pull request.
  ```

  - **Message:** `wrote AGENTS.md (pointer to docs/rules/)`.
  - **Idempotent:** the line is skipped when `AGENTS.md` already contains the text `docs/rules/`.
  - **No `AGENTS.md`:** the file is created with `# AGENTS.md`, a blank line and the pointer, and the
    script prints `wrote AGENTS.md (new: if CLAUDE.md is this repository's binding, import AGENTS.md
    from it)`.
  - **Write failure:** if `AGENTS.md` cannot be written, the rule note stays written. The script prints
    `WARNING pointer: could not write AGENTS.md (<reason>): add the line by hand` and exits 0.
- **D-13 How writers choose a store.**

  | Command | Store |
  |---|---|
  | `add` | `--store vault\|repo`, **default `vault`**, so today's calls are unchanged. `repo` needs a repository store (D-8) and creates `docs/rules/` on the first real write |
  | `add --candidate` | vault only; `--candidate --store repo` is a usage error (exit 2): "the repository store takes no candidates: approve the row, or move it to the vault and defer it" |
  | `update`, `confirm`, `retire` | taken from the id prefix: `R-` the vault, `P-` the repository |
  | `approve` | vault only. `approve P-…` is refused (exit 4): "repository rules have no candidates" |
  | `cite`, `override` | write nothing; accept both prefixes |

  - The duplicate check of `add` (same `when`/`do`, active) looks only in the target store. A team rule
    may restate a personal one; the union lint then warns `duplicate`.
  - `update`'s name-clash check (RL-D-3, `rglob`) searches only `docs/rules/` for a `P-` rule, never
    the whole repository tree.
- **D-14 Lint across stores.** `lint` gains `--store all|vault|repo`, default `all`.
  - **Errors** are computed per store: the existing `lint()` runs on each present store alone, with
    that store's id pattern (D-10).
  - **Warnings** are computed once, over the union of the present stores' notes (vault first, then
    repository): conflict, dead, redundant, duplicate, weak exception, vocabulary and oversized.
    Union errors are discarded, so a cross-store `exception_of` or `supersedes` stays the existing
    `dangling` error of the store that holds it.
  - The vocabulary check uses the vault's playbooks when the vault is present. Without a vault there
    is no vocabulary check.
  - The output format, the count line and the exit codes are unchanged.
  - The write refusal (RL-D-5) compares this combined lint before and after the write. A new error can
    only come from the target store.
  - **`rule-steward`** runs `lint --store vault`. `stats` and `check --golden` are vault-only already.
    Its Boundary gains: "Repository rules belong to that repository's team: never groomed, retired or
    reported here."
- **D-15 Reading across stores.**
  - `load`, `check FILE` and `search` read the union, vault notes first, so a cross-store `CONFLICT`
    line reads `R-… vs P-…`.
  - Precedence is RL-D-4 unchanged: a `P-` rule beats an `R-` rule only by strength, `exception_of`
    (impossible across stores, D-14) or specificity.
  - Lines print exactly as today. The id prefix is the store marker.
- **D-16 `load` by store presence** (`check FILE` and `search` follow the same rows):

  | Vault | Repository store | `load` prints | Exit |
  |---|---|---|---|
  | found | none, or `docs/rules/` missing | today's output, byte for byte | 0 |
  | found | present | today's format over the union; a `P-` line wherever a repository rule wins | 0 |
  | not found | present | the repository rules, then `NOTE personal rules not loaded: vault not found (set MEANINGFY_VAULT)`, then `-- end --` | 0 |
  | not found | none, or `docs/rules/` missing | today's stderr message, unchanged | 3 |

  `lint --store vault` without a vault, and `lint --store repo` without a repository store, exit 3
  with the matching message.
- **D-17 `where`, a new read-only command** for the card's default store. It always exits 0 and
  prints three lines and the end marker:

  ```
  vault: /home/ana/vault                     | vault: none (MEANINGFY_VAULT not set and no '08 How to/' here)
  repository: /home/ana/work/app (docs/rules/ present | docs/rules/ not yet created) | repository: none (<reason from D-8>)
  default store: repository                  | default store: vault
  -- end --
  ```

  The default is `repository` whenever a repository store is possible (D-8), even before `docs/rules/`
  exists; otherwise `vault`. The default does not depend on whether the vault is found.
- **D-18 The approval card (DEC-2, DEC-8).**
  - `references/approval-card.md` gains a **Store** column (`repo` or `vault`), filled from `where`'s
    `default store`.
  - The heading line says: "Rows default to this repository; answer `N to vault` for a personal
    preference."
  - The owner may answer `N to vault` or `N to repo` on any row. `to repo` is offered only when `where`
    names a repository.
  - The `--dry-run` that fills the Warnings column runs with the row's store, so a cross-store conflict
    shows before approval.
  - A repository write ends with: "Written to docs/rules/ as a file change; it reaches the team with
    your next commit and pull request" (DEC-8). Nothing is committed.
  - `defer` on a `repo` row is answered with D-13's message.
- **D-19 Repository opt-in in `project-setup`.** One line in `references/agentic-setup.md` cites
  `rulebook`'s rule model ("Repository store") for the folder and the pointer line, and restates
  neither. The repository opts in by approving its first rule.

### Exit codes (RL-D-14 kept; no new code)

| Situation | Code |
|---|---|
| everything in RL-D-14 | as before |
| `where`, in any environment | 0 |
| `load`/`check`/`search` with only the repository store | 0 (with the D-16 `NOTE`) |
| no store at all, for a read | 3 |
| `add --store repo`, or a `P-` id for `update`/`confirm`/`retire`, with no repository store | 3: `no repository store: <reason from D-8>` |
| `lint --store` naming an absent store | 3 |
| `add --candidate --store repo`; `--store` with another value (argparse) | 2 |
| `approve P-…`; `P-` id not found in `docs/rules/`; a repository write that adds a lint error | 4 |

## Algorithm / approach

**Worked example 1, step 1 (a code repository, vault set):**
1. In `~/work/app`, the user asks for a PR description.
2. The global line routes the session to `rulebook`, which runs `rules.py load --activity code-review`.
   The output is the vault's rules for `code-review` (`activity:*` rules included), then `-- end --`.
3. The user says "from now on, keep PR descriptions under ten lines".
4. At the end of the session, `rule-learner` shows the card. The row has no Store column in step 1.
5. On approval, `add` writes `R-0044` to the vault.

**Worked example 2, step 2 (a project convention):**
1. Same repository, after step 2. `rules.py where` prints `default store: repository`
   (`docs/rules/ not yet created`).
2. The user says "never commit straight to main in this repo". The card shows row 1: `NEW`,
   constraint, hard, scope `coding`, Store `repo`.
3. On approval: `add --store repo --type constraint --strength hard --scope activity:coding …`.
4. It prints `wrote docs/rules/P-0001 never commit straight to main.md` and
   `wrote AGENTS.md (pointer to docs/rules/)`, and exits 0.
5. `git status` shows two changes. The vault is untouched.

**Worked example 3 (a personal preference while coding):**
1. In the same session, "I prefer British English" becomes row 2, Store `repo`.
2. The user answers "approve 1, 2 to vault". Row 2 is written by `add --store vault` as `R-0045`.

**Worked example 4 (cross-store conflict):**
1. The repository holds `P-0002` (`activity:writing`, `spelling=american`, default). The vault holds
   `R-0001` (`activity:writing`, `spelling=british`, default).
2. `load --activity writing` prints both lines and
   `CONFLICT R-0001 vs P-0002 on spelling: ask the owner`.
3. The agent asks. The user may supersede within one store, or narrow a scope (for example
   `project:app` on the vault rule's exception, made in the vault).

**Worked example 5 (no vault, repository rules present):** on a teammate's machine without
`MEANINGFY_VAULT`, `load --activity coding` prints `P-0001 [hard] never commit straight to main (because: …)`, the
`NOTE` line and `-- end --`, and exits 0. The agent tells the teammate once that their personal rules
are not loaded.

**Idempotency:**
- `where`, `load`, `check`, `search` and `lint` only read.
- The pointer append is guarded by the `docs/rules/` substring.
- `docs/rules/` is created with `mkdir(parents=True, exist_ok=True)`, only on a real write.
- `confirm`, `retire` and `approve` keep their RL idempotency.
- Two branches can each allocate the same `P-` id. The merge then holds two files with one id, the
  existing `duplicate-id` lint error. The fix is `retire` one copy and `add` it again, which gets a
  fresh id (Risks).

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Run `git rev-parse` to find the repository | Walk up for `.git` with `pathlib` | Stdlib only; `git` may be absent, and it would need another permission |
| Make `--store repo` the script's default inside a git repository | Default `vault` in the script; the card passes `--store` | Backwards compatibility: every existing `add` call keeps its meaning |
| Copy a vault rule into the repository, or the reverse, to resolve a conflict | Ask the user; change one store's rules | No-go: no copying between stores |
| Let a `P-` rule `exception_of` or `supersedes` an `R-` rule | Exceptions and supersessions stay within one store (`dangling` error) | A teammate does not have the owner's vault, so the reference would dangle for them |
| Create `docs/rules/` or edit `AGENTS.md` on `--dry-run` or in `where` | Only on an approved, real write | No-go: no store before approval |
| Add `docs/rules/` to the skillery repository to test against | Copy the repository fixture into `tmp_path` and create `.git` there | Tests run with `cwd=ROOT`; a real `docs/rules/` there would change every existing test |
| `rglob` the repository root for name clashes | Search `docs/rules/` only | Repositories hold `node_modules/` and `.venv/` |
| Let `rule-steward` flag or retire `P-` rules | `lint --store vault`; `stats` counts `R-` only | Repository rules are the team's (EPIC rabbit-hole) |
| Commit the rule for the user | Leave the working-tree change | DEC-8: the PR is the team's approval |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| Neither store | `find_stores()` gives `(None, None)` | reads exit 3 with today's message; the agent says once and carries on (D-5) |
| Vault missing, repository store present | `(None, repo)` with `docs/rules/` | `load` prints the repository rules and the `NOTE`, and exits 0 |
| `.git` is a file (worktree, submodule) | `(p / ".git").exists()` | treated as a repository root |
| Repository root is `$HOME` | `root == Path.home().resolve()` | no repository store; `where` says `none (repository root is the home folder)` |
| The current directory is inside the vault | `cwd.is_relative_to(vault)` | no repository store; `where` says `none (this is the vault)` |
| `add --store repo` outside a repository | repo is `None` | exit 3, `no repository store: …`; nothing written |
| `--candidate --store repo` | argument check | exit 2 with D-13's message |
| `approve P-0001` | prefix check | exit 4, "repository rules have no candidates" |
| A cross-store `exception_of`/`supersedes` | per-store lint `dangling` | the write is refused, exit 4; the card shows it from `--dry-run` |
| A wrong prefix in a store (`R-` in `docs/rules/`, or `P-` in the vault) | per-store id check | `invalid` lint error; a write over it is not blocked (already there) |
| Two branches allocate the same `P-` id | `duplicate-id` lint error after merge | `retire` one copy and `add` it again; `load` keeps the first file, as today |
| A non-rule `.md` in `docs/rules/` | not matched by the `P-NNNN *.md` glob | ignored |
| `AGENTS.md` missing | `not path.exists()` | created with the pointer and a hint (D-12) |
| `AGENTS.md` not writable | `OSError` on append | rule written; `WARNING pointer: …`; exit 0 |
| Cross-store conflict | union precedence | `CONFLICT R-… vs P-…`; the user decides |
| Claude Code prompts for the script after the upgrade | permission prompt | the user updates the allow rule to the D-6 pattern; never refuses the script |
| A scheduled run reads the global line | DEC-3, written in the line itself | the run skips `load` and the card |

## Test case specifications

All in `tests/test_rulebook.py`. Step-2 tests copy `tests/fixtures/rulebook/repo/` into `tmp_path`
and create `.git` there. Git cannot commit a nested `.git`, so the fixture holds none.

| Id | Scenario (spec) or decision | Setup | Expect |
|---|---|---|---|
| T-1 | Rules reach every session: bundle | `bundles.yaml` | the three skills in `meaningfy-core`, none in `vault-assistant` |
| T-2 | Rules reach every session: routing | `global-prompt.md` | the line names `rulebook`, `rule-learner` and "unattended" |
| T-3 | D-6 | `rulebook/references/commands.md` | the Claude pattern holds `/meaningfy-core/`; no file under `skills/` holds `meaningfy-skillery/vault-assistant/*/skills/rulebook` |
| T-4 | backwards compatibility | the existing tests, unchanged, `cwd=ROOT` | green |
| T-5 | D-16 row 1 | `load` outside any repository (`cwd=tmp_path`) and with `cwd=ROOT` | identical stdout |
| T-6 | A project convention stated while coding | repository without `docs/rules/`; `add --store repo …` | `docs/rules/P-0001 ….md` with `private: false`, the pointer in `AGENTS.md`, the vault unchanged |
| T-7 | D-12 idempotency | a second `add --store repo` | one pointer line |
| T-8 | D-12, no `AGENTS.md` | a repository without it | created; hint printed |
| T-9 | no store before approval | `add --store repo --dry-run` | no `docs/rules/`, `AGENTS.md` unchanged |
| T-10 | A personal preference stated while coding | `add --store vault` in the repository | a vault `R-` note; the repository unchanged |
| T-11 | The stores disagree | fixture `P-0002` against `R-0001` | `CONFLICT R-0001 vs P-0002 on spelling` |
| T-12 | D-16 row 3 | no `MEANINGFY_VAULT`, repository store present | the `P-` lines, the `NOTE`, exit 0 |
| T-13 | D-16 row 4 | neither store | exit 3, today's message |
| T-14 | D-8 home and vault exclusions | `HOME` set to the repository; cwd inside a vault with `.git` | `where` says `none (…)` in each case |
| T-15 | D-14 | fixture `P-0003` with `exception_of: R-0001`; `P-0004` carrying an `R-` id | `dangling` and `invalid` errors, both in the repository store |
| T-16 | D-14, steward | `lint --store vault` in the repository | no `P-` finding |
| T-17 | D-13 errors | `--candidate --store repo`; `approve P-0001`; `retire P-0001` outside a repository | exit 2, 4, 3 |
| T-18 | D-10 | `stats --from-file` with `P-` events | no `P-` row and no `P-` flag |
| T-19 | D-9 | `docs/rules/README.md` with no frontmatter | no `parse` error |
| T-20 | D-17 | `where` in each D-8 case | the three lines; exit 0 |

## Risks / Trade-offs

- **[`P-` ids collide across branches.]** Two pull requests can each add `P-0003`. → It is a visible
  `duplicate-id` error, fixed with `retire` and `add`. Ids that avoid collisions (date- or
  hash-based) would change the rule model: a separate EPIC if it hurts.
- **[A personal preference lands in the team's repository]** (EPIC rabbit-hole). → The Store column and
  the heading reminder (D-18); the pull request is a second chance.
- **[The pointer is written by the script, not the agent.]** It is the one non-rule file the script
  touches. → It writes one fixed line, guarded and idempotent. The alternative, the agent editing
  `AGENTS.md`, would bring back hand-written edits RL-D-2 removed.
- **[Context cost in every session]** (rabbit-hole "Noise"). → `load` prints only winners, and the
  "say once" rule stops repeated failed calls.
- **[The allow-rule pattern is still untested live.]** → Task 4.1 (non-blocking); the fallback is to
  approve when asked.
- **No-go check.**
  - Per-store id patterns (D-10) and `private: false` (D-11) are the only edits to `rule-model.md`'s
    content beyond the new "Repository store" section.
  - The first follows from DEC-7's prefix, which the owner decided. The second states a value of an
    existing field.
  - Precedence and the lint codes are unchanged. No other no-go is touched.

## Open Questions

- **O-1** Can Cowork run a plugin skill's script against local folders and see `MEANINGFY_VAULT`?
  Task 4.2 answers it live. Either answer changes only the Cowork row in `docs/environment/rules.md`.
- **O-2** Owner-only choices made in this PLAN, each with a recommended answer in the planner's
  hand-off: the `P-` collision remedy, `private: false`, the default store for a personal-sounding
  preference, the allow-rule move to `rulebook`, no deferral to the repository, and the script
  writing `AGENTS.md`. Confirm before task 1.3 (step-2 tests). D-6 is confirmed before task 2.3.
