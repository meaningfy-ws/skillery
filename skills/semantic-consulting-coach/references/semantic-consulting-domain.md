# Semantic Consulting Domain Map

Reference for coaching a semantic-technologies / data consulting business. Use it
to ground questions in the real offering, business models, and market dynamics —
not to lecture the user (they know the domain) and not to push a solution. Always
flag a service or model as a *hypothesis* until the user confirms it applies.

## 1. Service families (offering layer)

> **Keystone offering:** the **Decision Phase** (see `engagement-model.md`) sits
> at the head of "Strategic data & semantics advisory" below and gates everything
> downstream.

Grouped by intent. The **decide vs. build** axis matters most: advisory helps the
client *decide*; engineering helps them *build*. Blurring them silently is where
margin and IP leak.

| Family | Includes | Decide / Build | IP exposure | Natural stopping point / handover |
|--------|----------|----------------|-------------|-----------------------------------|
| **Strategic data & semantics advisory** | Data & semantic strategy, semantic-layer strategy, governance operating-model design, roadmaps, maturity assessment | Decide | High (method = the product) | Endorsed roadmap + decision; hand build to client or delivery arm |
| **Data governance & management** | Governance framework, **master data management (MDM)**, **metadata management**, **data quality**, **lineage / tracing**, **cataloguing**, stewardship model | Decide → Build | Medium–High (operating model is IP) | Operating model live + stewards trained |
| **Semantic engineering** | **Ontology engineering**, **taxonomy management**, **knowledge graph creation**, **data mapping**, vocabulary/standards alignment | Build | High (modelling patterns/method) | Validated model + tests + handover docs |
| **Semantic interoperability** | Cross-system mapping, standards conformance, shared vocabularies, exchange schemas | Build | Medium | Conformant exchange in production |
| **Semantic-layer enablement** | Designing/standing up the semantic layer, capability transfer, training, accelerators | Build → Transfer | Medium (accelerators can scale) | Client team self-sufficient |
| **Applied research** | Research in semantic domains, often grant- or B2G-funded, consortia | Explore | Low–Medium (often publishable) | Deliverable / publication / prototype |
| **Product development** | Reusable products & accelerators built on semantic tech | Productise | IP becomes the asset | Released, licensable product |
| **Tool resale** | Reselling third-party platforms (triple stores, catalogues, MDM, taxonomy tools) | Transact | Low | Licence sold + (optionally) implementation |

Coaching use: when the user describes an engagement, locate it in this table,
then probe the **decide/build blur**, **IP exposure**, and whether a **stopping
point** is defined.

## 2. Business / revenue models (meta-layer)

Each model trades differently on leverage, margin, IP, and scarcity. The strategic
question is the *mix*, not any single one.

| Model | Leverage | Margin shape | IP / scarcity | Watch-outs |
|-------|----------|--------------|---------------|------------|
| **Day-rate / time advisory** | Low (sells hours) | Steady, capped by capacity | Judgement is scarce; method leaks if not protected | Becomes a labour business; no scale |
| **Fixed-scope delivery** | Medium | Depends on estimation & reuse | Patterns reusable across jobs | Scope creep destroys margin |
| **Grant-funded research** | Medium | Funded, low commercial margin | Often must be open / published | Can subsidise R&D and credibility — or distract from revenue |
| **Product / licensing** | High (scales beyond hours) | High once built | Product *is* the IP | Build cost, productisation discipline |
| **Tool resale** | Medium (margin on licences) | Thin but recurring | Little IP; channel relationship | Can anchor you as a reseller, not an advisor |
| **Partnering / subcontracting (subco)** | Varies | Prime keeps margin; sub trades margin for flow | Risk of becoming invisible capacity | Brand dilution; dependence on the prime |

Coaching use: "Where do you make money because of judgement, not labour?" maps the
current mix; "what should never be customised / must stay scarce?" protects the IP
that underwrites margin.

## 3. Markets: B2B vs. B2G

| Dimension | B2B | B2G (public sector / government) |
|-----------|-----|----------------------------------|
| Buying motion | Commercial sales cycle, ROI framing | Formal **tenders**, **framework agreements**, public-procurement rules |
| Cycle length | Shorter, relationship-led | Long, process-led, scheduled |
| Discovery | Can be bounded/paid by negotiation | Often constrained by tender rules; free PoC requests common |
| Partnering | Optional alliances | **Consortia / subco** often required to meet scale or eligibility |
| Drivers | Efficiency, competitive edge, time-to-value | Interoperability mandates, open standards/open data, transparency, compliance |
| IP risk | NDA-protected | Outputs may be public; competitors may see your method |

Coaching use: in B2G, the free-PoC-before-tender trap and IP-exposure-to-rival-
bidders risk are acute; discovery must fit procurement rules. In B2B, the lever is
negotiating paid, bounded discovery and protecting the price anchor.

## 4. Where IP and scope risk concentrate

Highest-exposure (protect; demonstrate with reference patterns, not live method):
- Ontology engineering method and modelling patterns
- Data-mapping approach and reusable mapping patterns
- Governance / MDM operating model

Lower-exposure (safer to demo or give as teasers):
- Tool capabilities and standard platform features (resale)
- Published research outputs
- Generic maturity assessments and high-level roadmaps

Coaching use: every "should we do this for free / cheap / fast?" question should be
checked against *which* of the above it exposes, and whether the engagement blurs
decide-vs-build.
