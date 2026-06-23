# Craft moves — the texture of clear explanation

Seven moves. Each carries a before/after example. The "after" examples obey the house knobs
(British English, no em dash, grounded claims) so they double as register exemplars. The point of
each move is named so you can tell when it earns its place and when it does not.

> **Vetting rule (DEC-8).** Every example here is checked against
> [`company-voice.md`](../../executive-communication/references/company-voice.md) and the clarity
> check. If an example reads punchier than the house voice, it is wrong and gets re-authored.

---

## 1. One controlling metaphor

Build the whole piece on a single conceit and return to it. The metaphor carries the argument; it is
not decoration. Three half-metaphors read as noise.

- **Before:** "Our integration layer mediates heterogeneous schemas, harmonising disparate data
  models into a unified canonical representation."
- **After:** "Think of the integration layer as a translator at a meeting. Each system speaks its own
  dialect for 'customer'. The translator's job is to make sure that when finance says it and sales
  hears it, they mean the same person."

*Why:* the reader holds one model the whole way, so each new point attaches to a scaffold.

## 2. A concrete example beside every abstract claim

Never let an abstraction float. Put a named, everyday instance next to it.

- **Before:** "Schema drift increases maintenance cost over time."
- **After:** "Schema drift increases maintenance cost. Last quarter a single renamed field in the CRM
  broke three downstream reports, and nobody noticed for a week."

*Why:* the claim becomes checkable against lived experience, so the reader spends no effort decoding it.

## 3. Self-answered question pivots

Open or turn a section on a question, then answer it. It voices the reader's next thought.

- **Before:** "The next consideration is the matter of identifier persistence."
- **After:** "So what happens when the source system reassigns the ID? Nothing good. That is why the
  identifier has to outlive the record it points to."

*Why:* it simulates a dialogue and gives the prose momentum. Do not leave a question hanging.

## 4. Short declaratives for rhythm

Break medium sentences with a short standalone line. It signals weight and gives the eye a rest.

- **Before:** "This means that the resulting architecture is, in effect, considerably more
  resilient to the kinds of failures described above."
- **After:** "The architecture survives the failures above. All of them. That resilience is the
  whole point."

*Why:* rhythm is what makes prose feel alive rather than uniform.

## 5. Direct address

Use "you" and "we"; use contractions; speak to the reader. It collapses social distance.

- **Before:** "Users are advised to configure the access control list prior to deployment."
- **After:** "Set the access list before you deploy. If you skip it, the first request through the
  door is the one that teaches you why."

*Why:* it reads like a colleague talking, which is what suits internal notes and blog posts.

## 6. Coin-and-explain, once

Name a proprietary concept, capitalise it, and explain it the first time. Never assume jargon.

- **Before:** "The eVault enforces ACL-gated PID resolution over the RDF envelope."
- **After:** "Each person gets a small personal data server. We call it an eVault. It holds your data
  and decides, request by request, who is allowed to see what."

*Why:* it respects the reader without condescending, and keeps a specialist term usable by a layperson.

## 7. A confident, grounded close

End on a clear line that lands the point. Confident is not the same as overclaiming: no sweeping
numbers, no spin.

- **Before:** "In conclusion, it is hoped that these mechanisms may potentially contribute to
  improved outcomes."
- **After:** "Put together, these three pieces give a person real control over their own data. Not in
  theory. In the next release."

*Why:* a tentative or hedged ending throws away the momentum the piece just built. A confident close
keeps the house rule against overclaiming by staying specific.

---

## What must survive imitation

If a draft loses these, it stops reading as clear explanation, whatever the topic:

1. Exactly one controlling metaphor, carried throughout.
2. A concrete example beside every abstract claim.
3. Self-answered questions as pivots.
4. Short declaratives for emphasis.
5. Coined terms explained once.
6. A confident, grounded close — under the house knobs, never overclaiming.
