# The rule model

The one definition of what a rule is. `rule-learner` and `rule-steward` cite it and never restate it.

## Fields

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | `R-NNNN`, assigned by `rules.py`, never reused |
| `type` | yes | one of the twelve types below |
| `strength` | yes | `hard`, `default` or `soft` (Strength) |
| `status` | yes | `idea`, `active` or `dropped` (Lifecycle) |
| `scope` | yes | a list of `dimension:value` tags (Scope) |
| `when` | yes | the situation, in the owner's terms |
| `do` | yes | the action, one imperative sentence |
| `because` | yes | one line of reason |
| `source` | yes | the date and the owner's own words, quoted |
| `added` | yes | the day the rule was written |
| `instead_of` | no | what the owner does not want ("do X rather than Y") |
| `slot`, `value` | no | what the rule sets, when another rule could set it differently (`spelling` = `british`). Rules that share a slot compete; a rule without a slot never competes |
| `exception_of` | no | the id of the rule this one is an exception to |
| `supersedes` | no | the id of the rule this one replaced |
| `check_absent` | no | a regular expression no line of the output may match |
| `check_present` | no | a regular expression the output must match somewhere |
| `approved`, `last_confirmed` | no | the day the owner approved it, and the last day the owner restated it |
| `retired`, `retired_reason` | no | set when the rule is dropped |

Every rule note also carries `kind: rule` and `private: true`.

## The twelve types

The type says what kind of statement the rule captures. It changes nothing in precedence; it guides
how the rule is phrased and what it needs.

| Type | Meaning | Also needs | Example |
|---|---|---|---|
| `trigger` | when an event happens, do something first | a `when` that names the event | When a tender arrives, run the compliance matrix first |
| `preference` | a soft or default choice between options | `slot`, `value`; often `instead_of` | Prefer short sentences |
| `default-with-exception` | a default, and the case where it changes | the base rule, then one rule with `exception_of` per exception | British English, except for US clients |
| `constraint` | something never or always done; usually `hard` | often a `check_absent` or `check_present` | Never send to a client without approval |
| `procedure` | steps in a fixed order | the steps in `do`, or in the playbook body it points to | Draft, check, cite, then hand over |
| `checklist` | what to verify before finishing | the items in `do`; a check pattern when one is mechanical | Before finishing, verify arithmetic and cross-references |
| `selection-heuristic` | which option to choose in which case | `slot`, `value`; one rule per case | Fixed price when the scope is clear |
| `parameter` | a limit or a number | `slot`, `value` | At most three options |
| `convention` | a definition, a name or a term to use | `instead_of` when it replaces a term | Say "client", never "customer" |
| `escalation` | when to ask before acting (autonomy) | usually `hard` | Ask before writing to Odoo |
| `quality-criterion` | what makes an output good | a check pattern when one is mechanical | A good offer has no orphan requirements |
| `principle` | the reasoning behind choices | a `because` that carries the reasoning | Explain the reason before the choice |

## Strength

- **hard:** the owner wants it every time; only another hard rule can compete with it.
- **default:** applies unless a more specific rule or an exception says otherwise.
- **soft:** a preference; any default or hard rule on the same slot beats it.

An exception is drafted at its base's strength. A weaker exception would always lose to its base,
so it would be dead on arrival.

## Scope

- A tag is `dimension:value`: `activity:writing`, `audience:client`, `channel:email`,
  `project:<name>`, `language:fr`. The values of an activity come from its playbook's vocabulary.
- **Activity names are an open list.** In use: `writing`, `offers`, `reviews`, `coding`, `code-review`,
  `planning`. A new name needs no change anywhere.
- **Globals.** `activity:*` means no activity restriction. It is removed before any comparison, so a
  rule scoped only `activity:*` fires everywhere.
- A **context** is the set of tags `load` and `check` are given, always including
  `activity:<name>`.

## Precedence

Definitions, for rules that are `active`:

- A rule **fires** in a context when every tag of its scope (without `activity:*`) is in the context.
- Two scopes are **compatible** when no dimension has two different values.
- A is **more specific** than B when A's tags strictly contain B's.
- A **excepts** B when B is reached from A by following `exception_of` links (the chain is
  transitive).

For two rules with the same `slot` that both fire, A **beats** B when A's strength is higher (hard >
default > soft). At equal strength, A beats B when A excepts B, or when B does not except A and A is
more specific.

`load` returns, per slot, the rules that fire and that no other firing rule beats. If they carry
different values it prints `CONFLICT`, and the owner decides. Recency never decides.

An exception's scope must contain its base's scope (anything else is a lint error). This keeps
"excepts" and "more specific" pointing the same way, so "beats" cannot form a cycle among valid rules.
If a hand edit makes one anyway, `load` prints `CONFLICT on <slot> (no winner)` rather than dropping
the slot.

## Lint

`lint` evaluates every active rule in its own scope as the context, and every pair of rules on the
same slot.

**Errors** refuse a write: an unreadable note; an invalid `type`, `strength`, `status` or id; a
duplicate id; an `exception_of` or `supersedes` cycle; an exception whose scope does not contain its
base's; a reference to a rule that does not exist; a check pattern that does not compile; a missing
required field (`source` and `because` included).

**Warnings** are written and reported:

- **conflict:** two rules on the same slot with compatible scopes and different values, neither of
  which beats the other;
- **dead:** the rule never wins in its own scope, so it never wins anywhere;
- **redundant:** removing the rule changes nothing in its own scope. Two rules equal in scope, slot,
  value and strength are reported once, as duplicates. An exception that restores an earlier value,
  or a rule that overrides a narrower one through specificity, changes the outcome and is not
  redundant;
- **weak exception:** an exception weaker than its base;
- **vocabulary:** a scope value outside the activity's playbook vocabulary;
- **oversized:** more than 30 active rules in one activity.

A write is refused only when it adds a *new* error; findings that were already there never block it.

## Lifecycle

| Stage | `status` | Where |
|---|---|---|
| candidate | `idea` | `00 Inbox/proposed/` |
| in force | `active` | `08 How to/Rules/` |
| retired | `dropped`, with `retired` and `retired_reason` | stays in `08 How to/Rules/` |

The stages reuse the vault's status vocabulary, so `paused` and `done` are not used for rules. A
retired rule is never deleted: its history and the owner's reason stay readable. A superseded rule is
retired with the reason `superseded by R-NNNN`.

## Repository store

A rule can live in a git repository instead of the owner's vault, so the whole team shares it.

- **Folder and name:** `docs/rules/P-NNNN <title>.md` at the repository root, one flat folder. The
  `P-` prefix ("project") keeps ids apart from the vault's `R-`; the next id is the highest `P-` id
  plus one. Other files in the folder (a `README.md`) are ignored.
- **Note:** the same format as a vault rule, with `private: false`, because git shares it. There are no
  candidates (`status: idea`) in the repository.
- **Pointer:** on every real write to the store, `rules.py` appends this line to the repository's
  `AGENTS.md` when it does not mention `docs/rules/` yet:

  ```
  - **Rules:** this repository's rules for agents are in `docs/rules/`. At the start of an activity, load them with the rulebook skill; change them only through it, by pull request.
  ```

- **References stay inside one store:** `exception_of` and `supersedes` name a rule of the same store,
  because a teammate has no access to the owner's vault.
- **Reading:** `load`, `check FILE` and `search` read both stores. Precedence is unchanged; a rule of
  one store never overrides one of the other except by strength or specificity, and two that disagree
  print `CONFLICT R-… vs P-…`.

## Note format

Only two shapes are written: `key: value` lines, and `key:` followed by `  - item` lines. `rules.py`
writes keys in a fixed order and quotes a value with double quotes when it is empty, contains `: `
or `#`, ends with `:`, starts with one of ``[ ] { } > | * & ! % @ ' "`` or with `- `, `? ` or `: `,
or has spaces around it; inside, `"` and `\` are
escaped. Check patterns are always single-quoted, so `\d` stays literal, and a `'` inside is
doubled. Notes it writes read back to the same bytes.

It also reads what Obsidian writes back: unquoted or re-quoted values and inline `[a, b]` lists. A
note it cannot read is a lint error, and `load` skips it and says so.

The file name is `R-NNNN <title>.md`, the title being the first six words of `do`, with characters
other than letters, digits, spaces and hyphens removed.

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
source: "2026-10-29 session, owner: 'British English, except for US clients'"
added: 2026-10-29
approved: 2026-10-29
last_confirmed: 2026-10-29
private: true
---
```

A playbook, `08 How to/Playbooks/<Activity>.md`, carries `kind: playbook`, `activity: <name>`,
`vocabulary:` (items such as `audience:client|internal|us-client`), `golden:` (vault-relative paths
to examples that must pass `check`, each optionally followed by `|` and context tags, as in
`03 Resources/Client memo.md | audience=client`) and `private: true`. Its body is the activity's procedure, which
`load` prints first.
