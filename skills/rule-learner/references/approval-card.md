# The rule approval card

One message, at the end of the session or when the owner asks, holding every candidate of the
session. The owner answers each row; nothing is written before the answer.

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
| When / do | the situation and the action |
| Because | one line |
| Source | the owner's words, quoted |
| Warnings | what the lint would report on writing it (CONFLICT, dead, redundant), or nothing |

Before showing the card, find the warnings: write nothing, but compare each row with the rules that
`search` and `load` return for its scope. A row with a warning is still written on approval; the
owner should know before saying yes.

## Example

> **Rules from this session.** Answer each row: approve, edit, reject or defer.
>
> | # | Mutation | Type | Strength | Scope | When / do | Because | Source | Warnings |
> |---|---|---|---|---|---|---|---|---|
> | 1 | NEW | constraint | hard | writing, audience:client | writing for a client / use no em dash | the owner's stated preference | "from now on, no em dashes in anything for clients" | none |
> | 2 | NEW (exception of R-0042) | default-with-exception | default | writing, audience:us-client | writing for a US client / use American spelling | US readers | "for this US client use American spelling" | none |
> | 3 | CONFIRM R-0017 | parameter | default | writing | writing an offer / give at most three options | | "three options, as always" | none |
> | 4 | NEEDS_OWNER | selection-heuristic | default | offers | pricing a tender / ? | | "tenders are different" | |
> | 5 | REJECT | | | | send the Acme memo today | a one-off request | "send this one today" | |
>
> Row 4: what should change for tenders, the pricing model or the margin?

The owner answers, for example, "approve 1 to 3, row 4 is time and materials, defer it". Rows 1 to 3
are written at once; row 4 is edited with the owner's answer and staged with `add --candidate`.
