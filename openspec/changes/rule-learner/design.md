<!-- PLAN (design half). PLAN = this file + tasks.md. Revision 2, 2026-10-29: clarity gate round 1
     scored 8.0, round 2 8.8, round 3 9.2 (PASS); all gaps applied. Revision 3. Main changes: precedence formalised (globals, exception
     chains), lint split into errors and warnings, usage parsed from tool output, vault permissions,
     the status vocabulary reused. -->

> Derives from: EPIC `rule-learner` ([`proposal.md`](proposal.md)), golden-thread parent
> [`reasoning-capabilities`](../reasoning-capabilities/proposal.md). Acceptance criteria are the scenarios in
> [`specs/rule-learning/spec.md`](specs/rule-learning/spec.md), [`specs/vault-conventions/spec.md`](specs/vault-conventions/spec.md)
> and [`specs/vault-planning/spec.md`](specs/vault-planning/spec.md).

## Context

- The owner's rules are lost between sessions, or kept as unapproved memory that agents still ignore (the TellOnce baseline: 57.5% of applicable preferences violated).
- The vault already stages agent claims in `00 Inbox/proposed/`, sweeps them weekly (vault-planning), shares only on the owner's switch, and routes method changes through `skill-change` notes (overlap audit).
- vault-conventions owns every kind's required properties (`references/kinds.md`) and the `status` vocabulary `idea|active|paused|done|dropped` (`SKILL.md:76`).
- The owner decided:
  - learn from corrections **and** rule-like statements, using the twelve rule types (proposal DEC-1);
  - a small symbolic learner (DEC-2);
  - approval per session, revision per week (DEC-3);
  - Langfuse for usage, required (DEC-4);
  - storage in `08 How to/` (DEC-5);
  - a set of skills (DEC-6).
- Langfuse is not yet deployed. Its specification is with the infrastructure stacks repo (`docs/environment/langfuse-deployment-spec.md`), so its span shape is read from saved API responses (O-1).

## Goals / Non-Goals

**Goals:**
- One rule model, one writer, one lint: the machinery decides validity and precedence, and the model only proposes.
- Rules reach the session that needs them, and checkable rules are enforced on the output.
- Every rule's life can be traced from the owner's words and from Langfuse events.

**Non-Goals:**
- Learning from anyone other than the owner.
- Statistical learning, embeddings, a graph store, an MCP server.
- Replacing Claude Code auto memory in code repos.
- Monitoring on opencode: there is no Langfuse plugin, so it is a recorded parity gap (D-12).

## Decisions

- **D-1 Three skills, split by the moment they work** (resolves proposal DEC-7):

  | Skill | When it is loaded | Owns |
  |---|---|---|
  | `rulebook` | At the start of any activity that has rules, and whenever a rule is read or written | The rule model's semantics (types, fields, precedence, lifecycle), the `rules.py` script, and the use protocol (load, cite, check) |
  | `rule-learner` | When the owner states a rule or corrects the agent, and at session end | Recognition cues, distillation into candidates, mutations, the rule approval card, `override` |
  | `rule-steward` | In the weekly review | Langfuse monitoring, health flags, grooming, forgetting and promotion proposals |

  Fewer skills would load the cue tables, or the Langfuse and grooming procedure, at every activity start, the most frequent moment. More skills would split one moment and one owner: monitoring without grooming has no consumer.
- **D-2 One script, one writer.**
  - `skills/rulebook/scripts/rules.py` is a stdlib-only CLI, run with `python3` (`python` on Windows). Its subcommands are `load`, `cite`, `check`, `lint`, `search`, `add`, `update`, `confirm`, `retire`, `approve`, `override`, `stats`.
  - Only this script writes rule notes.
  - rule-learner and rule-steward call it at `<this skill's base directory>/../rulebook/scripts/rules.py`. The path is relative to the skill's folder, never to the working directory (the vault). It is valid because the three skills ship in one bundle: on Claude Code under `bundles/vault-assistant/skills/`, on opencode in the flat skills folder. Precedent: project-setup's "<linkml-engineering skill folder>/scripts". A test asserts the shared bundle.
  - If the script is missing (for example a partial install), the skill stops with one line naming rulebook.
- **D-3 Note format.** Required properties live in vault-conventions `references/kinds.md` (it owns them). rulebook owns their meaning.
  - **Lifecycle stages map onto the existing `status` vocabulary**, so the convention is unchanged: candidate = `idea`, in force = `active`, retired = `dropped`. Other values are a lint error.
  - **Format.** Only `key: scalar` lines and `key:` followed by `  - item` lists are used. Scope is a list of `dimension:value` strings.
  - **Writer quoting.** A scalar is double-quoted when it contains `: `, `#`, a leading `[{>|*&!%@'"`, or surrounding spaces; inside, `"` and `\` are escaped. `check_absent` and `check_present` are always single-quoted (YAML single quotes keep `\d` literal; `'` is doubled).
  - **Reader.** It also accepts what Obsidian writes back: unquoted or re-quoted scalars, and inline `[a, b]` lists.
  - **Round-trip.** Notes produced by the writer are byte-stable. Obsidian-rewritten notes parse to equal values. A note that cannot be parsed is a lint error, never a crash.
  - **File name.** `R-NNNN <title>.md`, where the title is the first six words of `do`, with characters outside `[A-Za-z0-9 -]` removed.

  Rule note example, `08 How to/Rules/R-0042 use British English spelling.md`:

  ```
  ---
  kind: rule
  id: R-0042
  type: default-with-exception
  strength: default
  status: active
  scope:
    - activity:writing
  when: writing any text
  do: use British English spelling
  slot: spelling
  value: british
  because: Meaningfy writes for EU clients
  source: "2026-10-29 session — owner: 'British English, except for US clients'"
  added: 2026-10-29
  approved: 2026-10-29
  last_confirmed: 2026-10-29
  private: true
  ---
  ```

  Optional keys: `instead_of`, `exception_of`, `supersedes`, `check_absent`, `check_present`, `retired`, `retired_reason`.

  Playbook note, `08 How to/Playbooks/<Activity>.md`:
  - `kind: playbook`, `activity: <name>`;
  - `vocabulary:` (items like `audience:client|internal|us-client`);
  - `golden:` (vault-relative paths);
  - the body is the procedure.
- **D-4 Precedence, formally.**
  - **Globals.** `activity:*` means "no activity restriction" and is removed from a scope before any comparison.
  - **Definitions.** A context is a set of tags and always includes `activity:<name>`.
    - **Fires:** a rule *fires* in a context when every tag of its normalised scope is in it.
    - **Compatible:** two scopes are *compatible* when no dimension has different values.
    - **More specific:** A is *more specific* than B when A's tags strictly contain B's.
    - **Excepts:** A *excepts* B when B is reached from A by following `exception_of` links. The chain is transitive.
  - **Beats.** For two rules with the same `slot` that both fire, A *beats* B when A's strength is higher (hard > default > soft). At equal strength, A beats B when A excepts B, or when B does not except A and A is more specific.
  - **load** returns, per slot, the rules that fire and that no firing same-slot rule beats. If those winners carry different values, it prints `CONFLICT`.
  - **Exceptions are at least as specific as their base.** An exception's normalised scope must contain its base's scope; anything else is a lint error (D-5). This keeps "excepts" and "more specific" pointing the same way, so "beats" cannot form a cycle among valid rules.
  - **No winner.** If, for a slot that fires, every firing rule is beaten (possible only through a rule that has a lint error), `load` prints `CONFLICT … (no winner)` and never drops the slot silently.
  - **Lint by evaluation in a rule's own scope.** For each active rule R, evaluate `load` in R's normalised scope as the context:
    - **Dead:** R is not a winner there, and the winning value differs from R's. If the winners there disagree among themselves, R is reported as dead together with the conflict.
    - **Redundant:** R is not a winner there and the winning value equals R's; or R wins, but with R removed the winning value is unchanged. In both cases removing R changes nothing in its own scope. An exception that restores a value, and a rule that overrides a narrower rule through specificity, both change the outcome, so neither is redundant.
    - **Duplicates:** two rules with equal scope, slot, value and strength would each be redundant because of the other. They are reported once, as `R and O duplicate each other: keep one`.
  - **Lint over pairs** of active rules for the same slot:
    - **Conflict:** the scopes are compatible, the values differ, and neither rule beats the other in the union of their scopes.
    - **Weak exception:** R excepts its base but has lower strength than the base. The learner drafts exceptions at the base's strength (D-8).

    Known limit: "dead" is exact, since a rule that loses in its own scope loses in every wider one. "Redundant" can over-report: O on `{w}` and R on `{w,x}` both say british, and M on `{w,y}` says american. In `{w,x,y}`, removing R changes the result, yet R is flagged as redundant. That is why redundancy is a warning, and the owner decides. Recorded in Gotchas.
- **D-5 Lint classes.**
  - **Errors** refuse a write: a parse failure, an invalid enum or status, a duplicate id, an `exception_of` or `supersedes` cycle, an exception whose scope does not contain its base's, a dangling reference, a regex that does not compile, a missing `source` or `because`.
  - **Warnings** are written and reported: conflict, dead, redundant, weak exception, a scope value outside the playbook vocabulary, more than 30 active rules in an activity.
  - A write is refused only if it adds a *new* error compared with the vault before the write. Findings that already exist never block it.
- **D-6 Load output** is compact text, safe to repeat:
  - the playbook procedure, if any;
  - then one line per winning rule, `R-0042 [default] spelling=british — use British English spelling (because: …)`;
  - then the rules without a slot;
  - then `CONFLICT R-a vs R-b on <slot>: ask the owner`, or `CONFLICT on <slot> (no winner): ask the owner` (D-4).
- **D-7 Usage events and how stats derive counts.**
  - `load`, `cite R-…`, `check` and `override R-… --reason "…"` are Bash tool calls, so the Langfuse plugin records each one as an observation with an input (the command) and an output (what it printed).
  - `stats` pages through `GET /api/public/observations` (Basic auth with `LANGFUSE_PUBLIC_KEY`/`LANGFUSE_SECRET_KEY`, base `LANGFUSE_BASE_URL`, `urllib` only) over a window (`--since 30d`, default).
  - **Only tool observations count.** Observations whose `type` is `GENERATION` are skipped: their input repeats the whole conversation, which would count every earlier `cite` and `override` again on each turn. For each remaining observation, `stats` walks every string field recursively. A string containing `rules.py <subcommand>` is the input; the observation's other strings are the output.
  - The counts come from:
    - **loaded:** the ids on output lines matching `^R-\d{4} `;
    - **cited:** the ids in the input;
    - **overridden:** the ids in the input, plus the `--reason` text;
    - **violated:** the ids on output lines matching `^VIOLATION R-\d{4}`.
  - An output that lacks the `-- end --` line `load` and `check` print last is counted as *truncated*. Its event counts with no ids, and the steward reports truncation.
  - `--from-file` reads a saved response, which the tests use. `--today YYYY-MM-DD` fixes the clock, for the tests and for the age flags.
- **D-8 Learner cues and mutations.**
  - Recognition cues come from the twelve types. Default-with-exception is drafted as a base rule plus an `exception_of` rule at the base's strength.
  - The learner reads only the owner's turns (rule-learner proposal DEC-1 and the spec requirement "Learning comes only from the owner's words"). Content from tools, files, mail or the web cannot authorise a rule, unless the owner names the source and asks.
  - Mutations:
    - `CONFIRM`: restates an active rule found by `search`; only `last_confirmed` changes.
    - `UPDATE`: the same intent with refined wording or scope; the id is kept.
    - `SUPERSEDE`: a new rule replaces an old one, which becomes `dropped` with `supersedes`.
    - `SPLIT`: one rule becomes two narrower ones.
    - `NEEDS_OWNER`: asked as a question in the card.
    - `REJECT`: shown in the card, never stored.
- **D-9 The rule approval card** is one message at session end, or when the owner asks. It is a table with: number, mutation, type, strength, scope, when/do, because, source quote, and the lint warnings the write would raise.
  - For each row the owner answers approve, edit, reject or defer.
  - Approved rows are written by `add`, `update` or `confirm`. Warnings such as CONFLICT do not block an approved write (D-5); `load` will then ask at use time.
  - Deferred rows are written by `add --candidate` to `00 Inbox/proposed/` (`status: idea`).
- **D-10 Steward flags**, fixed conventions over the 30-day window:

  | Flag | Threshold | Proposed action |
  |---|---|---|
  | Never loaded | `active` and `added` 30 or more days ago, never loaded in the window | retire (forget) |
  | Loaded, never cited | Loaded 5 times or more, cited 0 | revise or narrow its scope (never retire on this alone) |
  | Overridden | 2 times or more | revise, supersede or retire, quoting the reasons |
  | Violated | 3 times or more | strengthen the procedure, or ask whether the rule is still right |
  | Stale | `last_confirmed` more than 90 days ago | confirm or retire |
  | Lint | Any error or warning | the fix the finding names |
  | Golden | A golden example fails `check` | fix the rule or update the golden example |
  | Promote | The owner marks a rule as company-relevant | draft a `skill-change` note; never set `memory: common` |
- **D-11 How rules reach sessions.**
  - The vault's `AGENTS.md` (vault-setup template) gains one line: "Before working on an activity, invoke the rulebook skill and run `load` for it."
  - Repo sessions find the vault through `MEANINGFY_VAULT`, whose value differs per machine and must stay out of git. Otherwise `rules.py` uses the current directory if it holds `08 How to/`, and else exits 3 with a hint.
- **D-12 Parity gap.** opencode sessions can load, cite and check but are not traced. This is recorded in `docs/environment/dual-cli/` as a known gap of `rule-steward` monitoring.
- **D-13 Integration edits** (citing, not restating):
  - **vault-conventions:**
    - `rule` and `playbook` rows in `references/kinds.md`, with their required properties and the status mapping of D-3;
    - one Staging paragraph: rule candidates are staged like any claim, and approved candidates are moved into `08 How to/Rules/` by `rules.py approve`, following the existing move procedure (name-collision check), not by vault-promote.

    This change is the skillery side of "kinds grow through proposals" (existing vault-conventions spec): the proposal is this EPIC.
  - **vault-planning:** the weekly rules step. The general sweep of `00 Inbox/proposed/` skips `kind: rule` notes, which the rules step handles.
  - **vault-capture:** at the end of a session with rule-like statements, run rule-learner.
  - **vault-setup:**
    - the `AGENTS.md` load line and the templates for both kinds;
    - permissions in both files:
      - `references/permissions-claude-code.md` allows the rulebook script (`Bash(python3:*)` is too broad; use the narrowest pattern the CLI accepts, found in task 4.2);
      - `references/permissions-opencode.md` adds a `python3 *rules.py *` rule set to `allow`, kept narrow in the same way;
      - the "stated gap: refuse it" text gains an exception for the rulebook script.
  - **vault-promote:** a boundary line saying that rule notes are promoted by rulebook.
- **D-14 Exit codes** of `rules.py`:
  - 0: ok;
  - 1: `check` found a violation, or `lint` found an error;
  - 2: argparse usage error;
  - 3: environment (vault or Langfuse not found or unreachable);
  - 4: a write was refused (D-5).

## Algorithm / approach

**Learning (session):**
1. The owner says "from now on, no em dashes in anything for clients".
2. The learner classifies it as a constraint, strength hard, and drafts: scope `audience:client`, `do: use no em dash`, `check_absent: '—'`, source = the quote.
3. `search em dash` finds nothing, so the mutation is NEW.
4. The approval card shows the row; the owner approves.
5. `add` writes R-0043.

**Use (any session):**
1. `rules.py load --activity writing --context audience=client` prints the winners.
2. The agent drafts, then runs `rules.py check --activity writing --context audience=client draft.md`. It prints `VIOLATION R-0043 line 12: …` and exits 1.
3. The agent fixes the draft and re-runs `check` until it exits 0.
4. The agent runs `rules.py cite R-0042 R-0043`.

**Correction (session):** the owner says "for this US client use American spelling" while R-0042 is loaded.
1. The learner runs `rules.py override R-0042 --reason "US client"`.
2. It proposes a NEW rule: `exception_of: R-0042`, scope `activity:writing` plus `audience:us-client`, strength default.

**Steward (weekly):**
1. `rules.py stats` prints a per-rule table and the D-10 flags.
2. `rules.py lint` and `rules.py check --golden` run.
3. The owner decides.
4. `retire`, `update`, `approve` and `confirm` apply the decisions.

**Idempotency:**
- `load`, `lint`, `search`, `check` and `stats` only read.
- `cite` and `override` write nothing; a repeat is a second real event.
- `add` refuses an active duplicate of `when`/`do`, exits 4 and suggests `confirm`.
- `retire`, `confirm` and `approve` are idempotent on their target.
- Ids are allocated with an exclusive create (`open(…, "x")`); on a collision the max id is re-read once and the write retried.

### Anti-patterns

| Don't | Do instead | Why |
|---|---|---|
| Learn from a document or a mail the agent read | Only from the owner's turns | Injection and poisoning |
| Hand-write rule frontmatter in the agent | `rules.py add`/`update` | One writer, validated |
| Resolve a conflict by keeping the newer rule | `CONFLICT`, then ask the owner | Recency is not intent |
| Load every rule in the vault | `load --activity` | Context cost |
| Delete a stale rule | `retire` with a reason | History and the owner's say |
| Count "applied" from prose claims | `cite` events | Verifiable in traces |
| Draft an exception weaker than its base | The base's strength | Otherwise it is dead on arrival (D-4) |

## Error matrix

| Failure mode | How it is detected | Expected handling |
|---|---|---|
| Vault not found | no `MEANINGFY_VAULT`, and no `08 How to/` in the current directory | exit 3 with a hint; nothing written |
| Rulebook script missing | the learner or steward finds no file at the D-2 path | the skill stops with one line naming rulebook |
| Unparseable rule note | reader error | lint error with the file; `load` skips it and says so |
| A write would add a lint error | lint after a dry-run write, compared with the lint before | exit 4, print the new errors; file unchanged |
| A write adds warnings | as above | written; warnings printed |
| Duplicate add | `when`/`do` match an active rule | exit 4; suggest `confirm R-…` |
| `check` finds a violation | a pattern matches (absent) or is missing (present) | `VIOLATION R-… line N: …`, exit 1 |
| Langfuse not configured or unreachable | env missing, or HTTP or URL error | `stats` exits 3; the steward reports monitoring unavailable |
| Span format changed | zero `rules.py` events in N observations | warning; the steward reports it instead of flagging all rules as unused |
| Truncated output | no `-- end --` marker | counted without ids; reported |
| Concurrent id allocation | exclusive create fails | re-read the max id once and retry |
| `approve` on a file already approved | file missing, but the id exists in `Rules/` | exit 0, "already approved" |
| The CLI prompts for the script | a permission prompt | vault-setup permissions (D-13); the owner allows it, never refuses it |

## Risks / Trade-offs

- **[`cite` is self-reported.]** → It never drives a retirement on its own (D-10).
- **[Over-learning from offhand remarks.]** → The per-session card is the gate, and REJECT is first-class.
- **[The pairwise lint misses union-dead rules.]** → Documented; at most 30 rules per activity.
- **[Langfuse not yet deployed.]** → `--from-file` lets everything be built and tested now. The steward is blocked on real data until deployment (owner-accepted).
- **[The CLI permission syntax may not express a narrow script pattern.]** → Task 4.2 finds the narrowest working pattern per CLI and records it. The fallback is "ask", which is documented as safe to allow.

## Open Questions

- **O-1** The exact observation shape the Langfuse plugin writes for a Bash tool call. D-7's recursive walk is chosen so the answer does not change the code. Confirm in task 6.1.

## Implementation notes

- **2026-10-29, D-6 load line.** `load` prints `R-0042 [default] spelling=british: use British English
  spelling (because: …)`, with a colon where D-6 shows an em dash. The skills quote this output in
  their worked examples, and an em dash there would model the punctuation the owner's own rule
  forbids (handover §0). The line still starts with `R-NNNN `, so D-7 counting is unchanged.
- **2026-10-29, task 4.2 permission patterns.** Both CLIs match `*` against any text, so a pattern
  such as `python3 *rules.py *` would allow any Python program whose arguments mention `rules.py`.
  The narrowest accepted rule pins the installed path and leaves only the version as a wildcard:
  Claude Code `Bash(python3 <home>/.claude/plugins/cache/meaningfy-skillery/vault-assistant/*/skills/rulebook/scripts/rules.py *)`,
  opencode `"python3 <home>/.config/opencode/skills/rulebook/scripts/rules.py *": "allow"`. Both are
  taken from the CLIs' permission documentation and were not tested live; vault-setup's references
  say so and tell the owner how to confirm on first use.
- **2026-10-29, the type name for "definition or convention"** is `convention`, and "escalation or
  autonomy" is `escalation`; `rulebook`'s rule model lists all twelve names.
- **2026-10-29, review (task 5.1).**
  - **D-2 path.** rule-learner and rule-steward reach the script as the sibling path, written out:
    the parent of the skill's base directory plus `rulebook/scripts/rules.py`, with no `..`, so the
    command text matches the permission rule and the rulebook skill's "full path, unquoted".
  - **D-13 permissions.** The path-pinned allow rule holds the owner's home folder, so it moved out
    of the vault's shared settings into each machine's user settings (`~/.claude/settings.json`;
    `~/.config/opencode/opencode.json`, or the repository's settings for a project install). The
    shared vault files keep only the "approve the rulebook script, never refuse it" exception.
    Still not tested live.
  - **Golden examples with a context.** A `golden:` item may carry tags after `|`
    (`03 Resources/Client memo.md | audience=client`), so context-scoped check rules run on it.
  - **`check` needs `--activity`** unless `--golden` (exit 2), so a file is never "checked" against
    no rules.
  - **`stats` with no rule events** in the window warns and raises no usage flag (stale still
    applies); an unreadable `--from-file` exits 3.
  - **Writes.** `approve` of a candidate with `supersedes` retires the old rule, as `add` does;
    `update` of `do` renames the file to its new title after the name-collision check; an id taken
    under another title is detected after the exclusive create and the write retried once; `add` and
    `update` take `--dry-run`, which the approval card uses for its Warnings column.
  - **The Langfuse deployment specification** moved from `inputs/` to
    `docs/environment/langfuse-deployment-spec.md`: it is a deliverable for people, and its old link
    would break on archive.
