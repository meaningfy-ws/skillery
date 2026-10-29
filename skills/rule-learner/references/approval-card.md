# The rule approval card

One message, shown when the owner wraps up, when the owner asks, or before your final summary of a
task in which the owner stated or corrected something, holding every candidate of the session. The owner answers each row; nothing is written before the answer.

## Format

A short heading, one table, then the questions of any `NEEDS_OWNER` row and the line of possible
answers.

| Column | Holds |
|---|---|
| # | the row number the owner answers by |
| Mutation | `NEW`, `CONFIRM`, `UPDATE`, `SUPERSEDE`, `SPLIT`, `NEEDS_OWNER` or `REJECT`, with the id it acts on |
| Type | one of the twelve types |
| Strength | `hard`, `default` or `soft` |
| Scope | the tags, without `activity:` when the activity is obvious |
| Store | `repo` or `vault`: the default is the `default store` line of `rules.py where` |
| When / do | the situation and the action |
| Because | one line |
| Source | the owner's words, quoted |
| Warnings | what the lint would report on writing it (CONFLICT, dead, redundant), or nothing |

Heading line: "Rows default to this repository; answer `N to vault` for a personal preference." The
owner may answer `N to vault` or `N to repo` on any row; offer `to repo` only when `where` names a
repository. Deferral is for the vault only: `defer` on a `repo` row is answered "the repository store takes
no candidates: approve the row, or move it to the vault and defer it".

Before showing the card, find the warnings: run each row's write with `--dry-run` and the row's store (`add --store repo --dry-run`,
`update --dry-run`), so a cross-store conflict shows before approval. It writes nothing and prints the warnings the write would add, or the errors
that would refuse it. A row with a warning is still written on approval; the owner should know
before saying yes.

## Example

> **Rules from this session.** Rows default to this repository; answer `N to vault` for a personal preference. Answer each row: approve, edit, reject or defer.
>
> | # | Mutation | Type | Strength | Scope | Store | When / do | Because | Source | Warnings |
> |---|---|---|---|---|---|---|---|---|---|
> | 1 | NEW | constraint | hard | writing, audience:client | vault | writing for a client / use no em dash | the owner's stated preference | "from now on, no em dashes in anything for clients" | none |
> | 2 | NEW (exception of R-0042) | default-with-exception | default | writing, audience:us-client | vault | writing for a US client / use American spelling | US readers | "for this US client use American spelling" | none |
> | 3 | CONFIRM R-0017 | parameter | default | writing | vault | writing an offer / give at most three options | | "three options, as always" | none |
> | 4 | NEEDS_OWNER | selection-heuristic | default | offers | vault | pricing a tender / ? | | "tenders are different" | |
> | 5 | REJECT | | | | | send the Acme memo today | a one-off request | "send this one today" | |
> | 6 | NEW | constraint | hard | coding | repo | committing in this repository / never commit straight to main | main is reviewed | "never commit straight to main in this repo" | none |
>
> Row 4: what should change for tenders, the pricing model or the margin?

A repository write ends with: "Written to docs/rules/ as a file change; it reaches the team with your next commit and pull request". Nothing is committed.

The owner answers, for example, "approve 1 to 3, row 4 is time and materials, defer it". Rows 1 to 3
are written at once; row 4 is edited with the owner's answer and staged with `add --candidate`.
