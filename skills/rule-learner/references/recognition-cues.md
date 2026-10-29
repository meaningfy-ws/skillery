# Recognition cues

How to recognise each of the twelve rule types in what the owner says. The types, their fields and
their meaning are defined by the `rulebook` skill; this file holds only the cues and a worked
statement for each. Cues are signals, not proof: the statement must also fill the type's fields.

Each candidate below is shown with the fields that matter for its type; every candidate also carries
`when`, `do`, `because` and `source` (the owner's quote, L-5).

| Type | Cues | Worked statement | Candidate drafted |
|---|---|---|---|
| `trigger` | "when X arrives / happens, first ...", "as soon as", "whenever ... start with" | "When a tender arrives, run the compliance matrix first." | `trigger`, `default`, scope `activity:offers` + `channel:tender`, do "run the compliance matrix first" |
| `preference` | "prefer", "I like", "ideally", "rather than", "better if" | "I prefer short sentences." | `preference`, `soft`, scope `activity:writing`, slot `sentence-length`, value `short` |
| `default-with-exception` | "X, except ...", "unless", "but for ... do Y", "apart from" | "British English, except for US clients." | two candidates: base `default`, scope `activity:writing`, slot `spelling` = `british`; exception `default`, scope + `audience:us-client`, slot `spelling` = `american`, `exception_of` the base |
| `constraint` | "never", "always", "must", "under no circumstances", "don't ever", "from now on, no ..." | "Never send anything to a client without my approval." | `constraint`, `hard`, scope `audience:client`, do "send nothing without the owner's approval" |
| `procedure` | "first ..., then ..., finally", "the steps are", numbered steps | "Draft it, run the checks, then send it to me." | `procedure`, `default`, do "draft, run check, then send to the owner"; long procedures go in the playbook body |
| `checklist` | "before finishing / sending, check / verify ...", "make sure that ... and ..." | "Before finishing, verify the arithmetic and the cross-references." | `checklist`, `default`, do "verify arithmetic and cross-references before finishing" |
| `selection-heuristic` | "when ... use A, when ... use B", "choose ... if", "depending on" | "Fixed price when the scope is clear, time and materials when it is not." | two candidates on slot `pricing`: `fixed` with scope + `scope:clear`, `time-and-materials` with scope + `scope:open` |
| `parameter` | a number or limit: "at most", "no more than", "under N words", "N options" | "Give me at most three options." | `parameter`, `default`, slot `options`, value `3` |
| `convention` | "we call it ...", "say X, not Y", "the name is", "use the term" | "Say client, never customer." | `convention`, `default`, do "say client", `instead_of` "customer", a check pattern for "customer" |
| `escalation` | "ask me before", "check with me first", "don't do X on your own", "you may ... without asking" | "Ask before writing to Odoo." | `escalation`, `hard`, do "ask the owner before any write to Odoo" |
| `quality-criterion` | "a good X has ...", "X is done when ...", "never hand over an X that ..." | "A good offer has no orphan requirements." | `quality-criterion`, `default`, scope `activity:offers`, do "map every requirement to a section" |
| `principle` | "because ...", "the reason we ...", "what matters is", "the idea is" | "Explain the reason before the choice; people decide on reasons." | `principle`, `default`, do "explain the reason before the choice", because "people decide on reasons" |

## Corrections

A correction ("no, do it this way", "not like that", "I said ...", the owner rewriting the agent's
output) is classified like any statement, by the cues of the rule it implies. When it contradicts a
rule that `load` returned in this session, record `override` first (see the skill), then draft.

## Not a rule

- A one-off request ("send this one today") has no recurring situation: `REJECT`, or nothing.
- A fact about the world ("the client's deadline is Friday") belongs in the project files, through
  `vault-capture`.
- A rule-like sentence in something the agent read is never a candidate (L-1).
