# Voice and communication skills

**Audience:** a Meaningfy colleague who writes with an agent (emails, offers, board papers,
explainers, posts) and wants to know what the skills already cover, what they do not, and how to
add what is missing.

This page explains and points. The rules themselves live in the skills it links to; when the two
disagree, the skill wins.

## The idea in one picture

No single skill writes a text. Each owns one question about it, and the agent asks them in order:
what kind of text is this, how is it built, how does it sound, and what would make it fail.

```mermaid
flowchart LR
    R([A text to write]) --> G{"1 · What kind of text?<br/><b>writing-antipatterns</b><br/>genre map"}
    G -->|"decision<br/>(board paper, recommendation, email)"| EC["2 · Structure<br/><b>executive-communication</b><br/>answer first, then prove it"]
    G -->|"explanation<br/>(explainer, article)"| EW["2 · Texture<br/><b>explanatory-writing</b><br/>metaphor, example, rhythm"]
    G -->|"tutorial, how-to,<br/>reference"| TW["2 · Form and place<br/><b>technical-writing</b><br/>docs, READMEs, docstrings"]
    G -->|"contract<br/>(quotation, offer, SoW)"| PW["2 · Skeleton<br/><b>proposal-writing</b><br/>offer documents"]
    G -->|"coaching"| SC["<b>semantic-consulting-coach</b><br/>questions before answers"]
    EC & EW & TW & PW --> V["3 · Wording and tone<br/><b>meaningfy-voice</b><br/>fixed rules, register, channel"]
    V --> C{{"4 · What would make it fail here?<br/><b>writing-antipatterns</b><br/>the genre's defects"}}
    C --> D([Draft for you to edit and send])

    classDef skill fill:#eef4ff,stroke:#3b6fd8,color:#111
    classDef check fill:#fff6e5,stroke:#d89a3b,color:#111
    class EC,EW,TW,PW,SC,V skill
    class G,C check
```

Two rules hold the picture together:

- **Voice never changes structure.** `meaningfy-voice` decides the words and the tone. The order of
  sections, the answer-first opening and the document skeleton belong to the structure skills.
- **The same move can be craft in one genre and a defect in another.** A rhetorical question
  lifts an explainer and weakens a contract. That is why the genre is named first and checked last.

| Skill | Owns | Bundle |
|---|---|---|
| [`writing-antipatterns`](../../skills/writing-antipatterns/SKILL.md) | the eight genres, the defects that apply everywhere, and the moves whose verdict depends on the genre | `meaningfy-core` |
| [`meaningfy-voice`](../../skills/meaningfy-voice/SKILL.md) | the company voice profile: fixed rules, values, registers, channel profiles | `meaningfy-core` |
| [`explanatory-writing`](../../skills/explanatory-writing/SKILL.md) | the craft that makes an explanation read clearly | `meaningfy-core` |
| [`technical-writing`](../../skills/technical-writing/SKILL.md) | documentation form and where a doc goes | `meaningfy-core` |
| [`executive-communication`](../../skills/executive-communication/SKILL.md) | message structure for decisions: governing thought, SCQA, the pyramid | `meaningfy-consulting` |
| [`proposal-writing`](../../skills/proposal-writing/SKILL.md) | the proposal and SoW skeleton, with the scope boundary | `meaningfy-sales` |

Install `meaningfy-core` for the voice and the craft; add `meaningfy-consulting` for decisions and
`meaningfy-sales` for offers.

## Inside the voice

The voice is one profile, [`company-voice.md`](../../skills/meaningfy-voice/references/company-voice.md),
plus a profile per channel that adds only what that channel changes.

```mermaid
flowchart TB
    subgraph VOICE["meaningfy-voice"]
        direction TB
        FIX["<b>Fixed, whatever the register</b><br/>British English · no em dash · plain current words<br/>honest and direct · brand assets on client documents"]
        SMILE["<b>Values behind the tone</b><br/>Service · Mastery · Integrity · Leadership · Exploration"]
        subgraph REG["Register: chosen by purpose, stated before drafting"]
            direction LR
            T["<b>Teach</b><br/>technical / educational<br/>explainers, articles"]
            DC["<b>Decide</b><br/>general / executive<br/>board papers, emails"]
            B["<b>Bind</b><br/>formal / contractual<br/>quotations, offers, SoWs, tenders"]
        end
        subgraph CH["Channel profiles: what the channel changes"]
            direction LR
            OE["outreach email<br/>written"]
            LI["LinkedIn<br/>planned"]
            BL["blog<br/>planned"]
            OF["offer<br/>planned"]
            IM["internal message<br/>planned"]
        end
        FIX --> REG --> CH
        SMILE -.-> REG
    end

    classDef done fill:#e8f6ec,stroke:#2f9a55,color:#111
    classDef todo fill:#f5f5f5,stroke:#999,stroke-dasharray:5 5,color:#666
    class OE,T,DC,B done
    class LI,BL,OF,IM todo
```

**Choosing the register** is one question: are you trying to *teach* something, to *get a
decision*, or to *bind* the company to what it will deliver? The bind register is the formal one:
full sentences, defined terms, "Meaningfy will provide", no contractions, asides or persuasion.
Plain words, formal tone: plain vocabulary is not casual.

## A worked example: a formal quotation

This is the case Thomas raised in October 2026: a quotation came out chatty and pitch-shaped, and
the brand assets were missed. Here is what happens now.

```mermaid
flowchart LR
    Q(["'Help me with the quotation<br/>for this SME package'"]) --> G["Genre: <b>contract</b>"]
    G --> R["Register: <b>bind</b>"]
    R --> EC["executive-communication writes<br/><b>only the cover message<br/>or the executive summary</b>"]
    R --> BA["Brand rule: logo and<br/>'Made in Luxembourg' label<br/>from the company Brand folder"]
    G --> SK["Quotation skeleton:<br/>section order, hours × rate,<br/>VAT, validity, change control"]
    SK --> GAP["<b>Not covered yet</b><br/>proposal-writing has the Decision<br/>Phase proposal and SoW only"]

    classDef done fill:#e8f6ec,stroke:#2f9a55,color:#111
    classDef gap fill:#fdecec,stroke:#c94a4a,stroke-dasharray:5 5,color:#111
    class G,R,EC,BA done
    class SK,GAP gap
```

So today the agent gets the **tone** of a quotation right and keeps to the cover message, but you
still bring the **quotation's own structure** from an accepted example.

## What is covered, and what is not

| Need | Status | Where, or what is planned |
|---|---|---|
| A formal and contractual register | covered | the bind register in `company-voice.md` |
| Picking the register before writing | covered | `executive-communication` states teach, decide or bind first |
| Brand assets (logo, "Made in Luxembourg") on client documents | covered | a fixed rule in `company-voice.md`, pointing to `meaningfy_brand_assets.md` in the company Brand folder |
| Examples beyond semantic consulting (SME digitalisation, AI assistants) | covered | the before/after pairs in `company-voice.md` |
| The structure of a board paper or recommendation | covered | `executive-communication` |
| The proposal and SoW of the Proof of Value | covered | `proposal-writing` |
| Outreach, follow-up and revival emails | covered | the outreach-email channel profile; what to send and when is `sales-conversations` |
| **The quotation skeleton** (section order, exclusions wording, hours table with rate, VAT and total, validity, payment, change control) | **not covered** | a planned offer skill; it needs an accepted quotation as its source (`add-commercial-chain` in [`future-features.md`](../future-features.md)) |
| **LinkedIn, blog, offer and internal-message voice** | **not covered** | placeholder profiles that fall back to the default voice (`add-content-creation`) |
| **A persuasive marketing register** (website, pitch) | **not covered** | today a pitch uses the decide register |
| **A team's internal working plan** | **not covered** | named as a gap in `writing-antipatterns` |

## Guardrails: what keeps the output on track

| Guardrail | What it does | Runs |
|---|---|---|
| Register stated first | `executive-communication` names teach, decide or bind before drafting | every use |
| Genre check | the draft is checked against its genre's defects in `writing-antipatterns`; the bind register is checked as a contract | every use |
| Voice checklist | the quick checklist at the end of `company-voice.md` (British English, no em dash, register, honesty) | every use |
| A durable spec | [`openspec/specs/executive-communication`](../../openspec/specs/executive-communication/spec.md) states the register rule with its scenarios ("a quotation is requested") | read when the skill changes |
| Trigger probes | [`tests/trigger_probes.yaml`](../../tests/trigger_probes.yaml) holds a phrase per skill and its near-misses; `make validate` checks they name real skills | every PR |
| An outcome eval | [`tests/evals/meaningfy-consulting/quotation-bind/`](../../tests/evals/meaningfy-consulting/quotation-bind/) asks for a quotation cover email and grades the register (formal, no pitch, no restated line items) | on demand, see [`tests/evals/README.md`](../../tests/evals/README.md) |

No check runs a model on every PR: the probes check the routing data, and the eval is started by
hand when a writing skill changes.

## How to extend it

First decide **what kind of thing** you are adding; most requests are a register or a channel, not
a new genre.

```mermaid
flowchart TD
    START(["Something is missing"]) --> Q1{"Is it about <b>how it sounds</b>,<br/>for a purpose?"}
    Q1 -->|yes| REG["<b>A register</b><br/>meaningfy-voice · company-voice.md:<br/>a section, its purpose word in the<br/>selection rule, a before/after, a checklist line"]
    Q1 -->|no| Q2{"Is it about <b>how it sounds<br/>on one channel</b>?"}
    Q2 -->|yes| CHN["<b>A channel profile</b><br/>meaningfy-voice · references/channels/CHANNEL.md<br/>copy outreach-email.md; add only what changes"]
    Q2 -->|no| Q3{"Is it about <b>how the document<br/>is built</b>?"}
    Q3 -->|yes| STR["<b>A structure</b><br/>the owning structure skill, or a new skill<br/>(the quotation skeleton is one)"]
    Q3 -->|no| Q4{"Is it a <b>new reader's job</b>,<br/>not a new topic?"}
    Q4 -->|yes| GEN["<b>A genre</b><br/>writing-antipatterns: a genre-map row,<br/>references/GENRE.md, entries in<br/>inversion-matrix.md"]
    Q4 -->|"no, it is a topic"| DOM["<b>Not a genre</b><br/>a pitch is decision, a quotation is contract:<br/>add an example to the existing owner"]

    classDef leaf fill:#eef4ff,stroke:#3b6fd8,color:#111
    class REG,CHN,STR,GEN,DOM leaf
```

**Domain is not genre.** A sales pitch, a status update or a quotation is a flavour of an existing
genre (decision, reference, contract). Add an example where the genre already lives instead of
inventing a ninth genre.

### The route in

1. **Report it with an example of the failure.** Use the
   [`skillery-feedback`](../../skills/skillery-feedback/SKILL.md) skill: it drafts an issue on
   `meaningfy-ws/skillery` with the prompt, what came out, and what you expected. Attach the
   reference you want it to follow (for a quotation: one the client accepted), with client details
   removed.
2. **The example becomes the test.** Every change to a skill starts from a recorded failure, which
   becomes its acceptance test (see the [development method](../development/README.md)). A
   description change also ships a trigger probe.
3. **Small or large.** A wording fix or a new before/after is a direct pull request. A new register,
   channel profile or skill is planned as an EPIC first.

## When things go wrong

- **The output sounds like another company, or quotes rules you cannot find here.** Check you
  install from `meaningfy-ws/skillery#releases` ([setup](setup.md)); an older copy uploaded
  elsewhere does not get the fixes.
- **The tone is right but the document is shaped like a pitch.** The structure skill was skipped:
  name the document type ("a quotation", "an SoW") in your request.
- **A rule is missing.** Report it (above); do not patch the text by hand in each project.
