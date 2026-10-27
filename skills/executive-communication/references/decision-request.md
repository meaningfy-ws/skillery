# Decision request (the decision card)

The shape for any message that asks a reader to decide **later and alone**: an approval in an
agent's run note, an email asking a client or the owner to choose, a question left in a shared
note. The reader opens it days later, between other things, with no memory of the context.

The rule that makes it work: **the reader can decide from the card alone.** A record id, a link or
"see line 42" is not a decision request; it is homework.

## The card

```
DECIDE: <one question, answerable with an option letter>            [<record in words>]
BY: <date> (<why that date>; if no answer: <what happens by default>)
RECOMMEND: <letter>, because <one sentence>.
OPTIONS:
  A. <action> → <consequence>
  B. <action> → <consequence>
  C. Do nothing → <what happens>
FACTS:
  - <fact> [confirmed: <source>, <date> | assumed | unknown]
  - <fact> [...]
YES WRITES: <the exact change that "yes" makes, field by field>
REPLY: A / B / C / edit: …
Evidence: <ids and links, for checking, never instead of the facts>
```

## Rules

| Field | Rule |
|---|---|
| Length | At most **150 words**, aim for 120. Over the cap means two decisions or too many facts: split or cut. |
| DECIDE | A question the reader answers with a letter. The record named in words (company, offer, stage), never only `#412`. |
| BY | A date and the reason for it. Always say what happens if there is no answer, so the writer can apply a default. |
| RECOMMEND | One option, one reason. The writer commits to a view; "it depends" is not a recommendation. |
| OPTIONS | Two or three, one of them "do nothing". Each states its consequence, not just the action. |
| FACTS | Two or three, the minimum to decide. Each graded: **confirmed** (source, date), **assumed** or **unknown**. When a sentence from a mail or a note decides it, quote the sentence with sender and date. |
| YES WRITES | What the writer does on "yes", exactly. The reader approves a change, not an intention. |
| Evidence | Ids and links go last, for checking. They never replace a fact. |

Several cards go in deadline order, soonest first, each one complete. Plain text, no tables inside
a card. Wording follows `meaningfy-voice` (no em dash).

## Example

Before (an id, a verdict and a pointer):

`- [ ] P1 · Acme Data (#412) · lost · no reply · mail 18f3a… · Answer:`

After:

```
DECIDE: Mark the Acme Data discovery workshop deal lost?            [Acme Data]
BY: Fri 31 Oct (their budget year closes; if no answer: it stays open and keeps flagging)
RECOMMEND: A, because three touches since 12 Sep had no reply.
OPTIONS:
  A. Lost, reason "no response" → deal closes; re-contact task on 1 Feb.
  B. One more touch → a draft today for you to send.
  C. Do nothing → it stays open and keeps flagging.
FACTS:
  - Last two-way contact: 9 Sep call [confirmed: call notes, 9 Sep]
  - Their champion has left the company [assumed: LinkedIn, 20 Oct]
YES WRITES: stage Lost; lost reason "no response"; activity "re-contact" due 2027-02-01.
REPLY: A / B / C / edit: …
Evidence: Odoo deal #412 · last mail thread 18f3a
```

## Why the card shows options

A persuasive decision document suppresses the alternatives because its reader commits now. A
card's reader decides later and alone, so the options and the shared context must travel with it.
`writing-antipatterns` records this as the asynchronous-approval exception to its Decision genre.
