# Roles and RACI: who is accountable for what

This page names Meaningfy's six project roles and assigns exactly one accountable role to every
lifecycle activity, presale through partnership/account-nurture. It exists so any other document
(an engagement-model doc, a lifecycle doc, a per-role playbook) can **name an owner by citation**
instead of restating who does the work. Roles here are **responsibilities in a process**, not
competences and not a headcount or org-chart model; see the invariants before the matrix. Each
role block cites the skills it draws on by path rather than restating their content.

## Role definitions

### Sales/Presales

**Mandate:** own the presale relationship and the commercial thread from first contact through
partnership.

- **Accountable for:** presale qualification and relationship-building (free); commercial leadership
  of Discovery & Onboarding (both tiers); partnership and account-nurture once a client becomes a
  repeat client.
- **Skills drawn on:** [`skills/semantic-consulting-coach/SKILL.md`](../../skills/semantic-consulting-coach/SKILL.md),
  [`skills/proposal-writing/SKILL.md`](../../skills/proposal-writing/SKILL.md),
  [`skills/executive-communication/SKILL.md`](../../skills/executive-communication/SKILL.md), and the
  five sales skills behind the `sales-agent` ([`environment/sales-agent.md`](../environment/sales-agent.md)).
- **Artifacts produced:** qualified opportunity, commercial proposal/SoW co-ownership, account-nurture
  cadence.

### Technical Consultant

**Mandate:** provide technical assessment and Decision-Package development, and strategic advisory
on data governance and management.

- **Accountable for:** assessment work and Decision-Package content during Discovery & Onboarding
  (both tiers); shallow Requirements & Use-Case work carried via the Proof of Value.
- **Skills drawn on:** [`skills/decision-package/SKILL.md`](../../skills/decision-package/SKILL.md),
  [`skills/estimation/SKILL.md`](../../skills/estimation/SKILL.md).
- **Artifacts produced:** the Decision Package (recommendation, scope, roadmap, buy/build/defer).

### Solution Architect

**Mandate:** own technical design: the system's structure and the reasoning behind it.

- **Accountable for:** ADLC (ADRs, C4 views, Use-Case White/Blue); MDLC-lite domain and technical
  modelling within a software contract.
- **Skills drawn on:** [`skills/architecture/SKILL.md`](../../skills/architecture/SKILL.md),
  [`skills/conceptual-modelling/SKILL.md`](../../skills/conceptual-modelling/SKILL.md).
- **Artifacts produced:** ADRs, C4 diagrams, Use-Case White/Blue documents, domain/technical models.

### Work Shaper

**Mandate:** develop the Work Breakdown Structure from the request-for-offer, the offer, and the
client meeting notes; establish the project roadmap; write the Epic Pitches per the Shape-Up
methodology; identify risks and mitigations; and discover work with the Builder, mapping Epic scope
into stories.

- **Accountable for:** the shaped, appetite-bound bet: the WBS, the roadmap, the Epic pitch, the
  risk list, and the ongoing mapping of discovered work into stories/tasks with the Builder.
- **Boundary vs. Solution Architect (by kind of work).** The Architect owns the **technical
  design**: ADRs, C4 views, UC White/Blue, MDLC-lite domain and technical models. It answers *how
  the system is built and why that structure*. The Work Shaper owns **turning a decided scope into
  a shaped, appetite-bound bet**: the WBS, the roadmap, the Epic pitch, the risk list, and the
  mapping of Epic scope into stories with the Builder. It answers *what we are betting on, how much
  appetite it gets, and what the increments are*: planning and scoping, not technical design. They
  meet at the shaping table and neither substitutes for the other: an Architect's design with no
  appetite bound has not been committed to a scope; a Shaper's bet with no technical constraint has
  not been checked against what can actually be built. On the matrix this is A/R Work Shaper with
  Architect C.
- **Boundary vs. Solution Shipper (by what "through to delivery" means).** The Shaper's mandate reads
  as overseeing "from project inception to delivery", which could be misread as a delivery
  accountability. It is not: the Shaper's oversight is over **the shape**: is this still the bet we
  made, is the appetite intact, has discovered work changed the scope. The **Shipper** holds the
  delivery-close accountability against the contract and the client's documented requirements. The
  Shaper is present through delivery; it is not accountable for it.
- **Positioned on the Architect–Builder spectrum, leaning Builder.** Skillwise the Work Shaper sits
  between Architect and Builder, closer to the Builder, while thinking the actual work to be done
  ahead of time: planning and making the important decisions before the Builder executes them.
  This is the authoritative statement of that positioning; other documents cite this page rather
  than restating it.
- **Skills drawn on:** [`skills/epic-planning/SKILL.md`](../../skills/epic-planning/SKILL.md): the
  Work Shaper is the human role that owns and steers this skill.
- **Artifacts produced:** the WBS, the project roadmap, Epic Pitches (`proposal.md`), the risk list,
  the discovered-work backlog mapped into stories/tasks (`tasks.md`).

### Solution Builder

**Mandate:** execute the practical work of the Epic, translating a shaped scope into tangible,
demonstrable, deliverable increments.

- **Accountable for:** project/repo setup; the Epic build loop (BDD/TDD); Epic/architecture-spec
  conformance at delivery; discovering work as it is executed and reporting it back to the Work
  Shaper.
- **Skills drawn on:** [`skills/cosmic-python/SKILL.md`](../../skills/cosmic-python/SKILL.md),
  [`skills/bdd-gherkin/SKILL.md`](../../skills/bdd-gherkin/SKILL.md),
  [`skills/linkml-engineering/SKILL.md`](../../skills/linkml-engineering/SKILL.md).
- **Artifacts produced:** working, reviewed increments (code or models) conforming to the Epic and
  the architecture.

### Solution Shipper

**Mandate:** oversee delivery to the client, like a PM adapted to Shape-Up, responsible for
delivering what the client requested (ideally a bit more, to keep the client happy).

- **Accountable for:** release & deploy; contract-conformance check; sign-off on the review gate
  closing before anything reaches a client: the commercial-plane delivery accountability, paired
  with but distinct from the Builder's Epic/architecture-spec accountability.
- **Skills drawn on:** [`skills/ci-cd-delivery/SKILL.md`](../../skills/ci-cd-delivery/SKILL.md),
  [`skills/meaningfy-release/SKILL.md`](../../skills/meaningfy-release/SKILL.md).
- **Artifacts produced:** the shipped release, the contract-conformance check, the client handover.

## RACI legend and invariants

| Mark | Meaning |
|---|---|
| **A** | Accountable: answers for the outcome; exactly one per row |
| **R** | Responsible: does the work |
| **C** | Consulted: informs before/during the work |
| **I** | Informed: kept up to date after the fact |
| **–** | Not involved |

> **Invariant 1: exactly one `A` per row.** Every activity has exactly one accountable role (alone
> or combined as `A/R`). A row with zero `A` marks or with more than one is not published; if no role
> genuinely fits, the activity is named under Known gaps instead of forced onto a column.
>
> **Invariant 2: roles are responsibilities in a process, not competences or headcount.** A role is
> not a skills/competency/seniority profile (Semantic Engineer, Software Engineer, DevOps Engineer,
> QA Engineer are profiles, not roles) and not a staffing commitment: one person may hold several
> roles on a small engagement, and two people may share one role. The matrix constrains
> accountability, not who is hired or how many people are on the project.

## RACI matrix

| Activity | Sales/Presales | Technical Consultant | Solution Architect | Work Shaper | Solution Builder | Solution Shipper |
|---|---|---|---|---|---|---|
| Presale | A/R | C | – | – | – | – |
| Discovery & Onboarding, discovery workshop | A | R | C | – | – | – |
| Discovery & Onboarding, Proof of Value | A | R | C | C | – | – |
| Requirements & UC, shallow (White, via the Proof of Value) | C | A/R | I | – | – | – |
| Requirements & UC, deep (White+Blue, via the build contract) | I | C | A/R | – | C | – |
| ADLC | I | C | A/R | C | C | – |
| MDLC-lite | – | – | A | – | R | – |
| MDLC-standalone | C | C | A *(no owning skill; parked capability gap)* | – | – | – |
| Project/repo setup | – | – | C | – | A/R | – |
| Epic/work shaping | – | – | C | **A/R** | C | C |
| Epic build (BDD/TDD) | – | – | C | I | A/R | I |
| Review | – | – | C | – | R | A |
| Release & deploy | – | – | – | I | R | A |
| Contract-conformance check | I | C | – | I | C | A/R |
| CBLC-lite | – | – | – | – | A/R | I |
| CBLC-standalone | C | – | – | C | R | A |
| Partnership/account nurture | A/R | C | – | – | – | I |

**CBLC** (Capacity-Building Life Cycle, named in this doc set alongside ADLC and MDLC) covers
training and capability-building work: **-lite** runs inside an existing software contract;
**-standalone** is its own dedicated training engagement.

Every row above has exactly one `A` (alone or as `A/R`), verified by inspection, row by row, per
Invariant 1; no row carries zero or two.

## Adaptation notes

Two handbook roles are not carried forward as named roles. Each note below cites the handbook page
it replaces (see [`openspec/changes/archive/2026-10-29-define-roles-and-raci/inputs/2026-07-26-handbook-findings.md`](../../openspec/changes/archive/2026-10-29-define-roles-and-raci/inputs/2026-07-26-handbook-findings.md)).

**Quality Overseer (handbook p. 67).** The handbook's Reviewer mandate (the four-eyes principle,
every piece of work reviewed by another qualified team member against the Epic Pitch specification,
methodologies, and best practices) is not carried forward as a dedicated role. That review is now
largely agent-assisted (see [`skills/meaningfy-code-review/SKILL.md`](../../skills/meaningfy-code-review/SKILL.md)'s
multi-lens automated review): the **Solution Builder** does the work, the **Solution Shipper** signs
off as the row's `A`, and on non-software-plane reviews with no client-facing shipment in that
increment, the **Work Shaper** signs off as `R` while the Shipper remains `A`. No dedicated review
headcount exists in this model.

**Customer Success Manager (handbook p. 68).** The handbook's Customer Success Manager
(client-relationship management, expectation management, status/demo meetings, post-delivery
aftercare, satisfaction reviews, ceremonial handover) folds into **Sales/Presales**' partnership/account-nurture
row rather than becoming a seventh column; both roles owning one activity's accountability would
break Invariant 1.

## Agent wrappers: answered for the build plane

The open question was whether any role beyond the Builder gets a dedicated agent. For the build
plane it needs none today: the roles keep their names and map onto one lean agent team, owned by
[`skills/epic-delivery/SKILL.md`](../../skills/epic-delivery/SKILL.md). The lead is the main session
and the checker and tester are briefs, so no new catalogue agent is needed. In the team, *the
developer* is whichever role holds the decision at that point.

| Role | Seat in the team | Agents it works through |
|---|---|---|
| Work Shaper | The developer in a shaping session: decides the why, the appetite and the shape | The shaping lead (`epic-planner`, started as the session) |
| Solution Architect | The developer for architecture and model decisions; brings in the domain expert when the model changes | The architect (`system-architect`); `conceptual-modeller` |
| Solution Builder | The developer in an epic session: signs off the scenarios, decides findings, accepts the EPIC | The delivery lead (`team-lead`, or the main session); the builder (`implementer`), the reviewer (`code-reviewer`), the checker |
| Solution Shipper | Outside the loop: signs off the review gate from the merged stages and the acceptance evidence, then releases | `release-manager` |
| Sales/Presales, Technical Consultant | Not in the build-plane team | Their own planes' agents |

Two roles are served by lead agents since `named-workers-and-legal`: Work Shaper by `epic-planner`
and Solution Shipper by `release-manager`, each the lead of its workflow. For the other roles a
dedicated wrapper stays an open fork: a role gets one only once it has been exercised on a real
engagement.

## Known gaps

| Gap | Nature | Owner / next step |
|---|---|---|
| **Agent wrappers for the remaining non-Builder roles** | Work Shaper is served by the `epic-planner` lead and Solution Shipper by `release-manager`; no agent covers the others' mandates. | Deferred until the role has been exercised on a real engagement. |
| **MDLC-standalone has no owning skill** | Genuine capability gap: the ontology/application-profile development methodology (METHONTOLOGY/NeOn/LOT-style) has no skill; `conceptual-modelling` explicitly scopes itself to product-development projects. | Parked for its own shaping cycle. Visible on the matrix as the MDLC-standalone row. |
| **Agent-assisted review has no non-software equivalent** | `meaningfy-code-review` is code-scoped. The Quality Overseer headcount is retired across *all* planes, but the automated multi-lens review that replaces it exists only for the software plane; ontology and training-material review currently fall back to unaided human sign-off. | Named only. Candidate future skill; not designed here. |
| **Vocabulary consistency pass pending** | This doc's activity names are provisional until the sibling changes below publish theirs. | Required follow-up: a rename-and-check pass, not a re-derivation, once those changes land. |

## References

| Doc | What it defines |
|---|---|
| [`../openspec/changes/archive/2026-10-29-define-blc-engagement-model/proposal.md`](../../openspec/changes/archive/2026-10-29-define-blc-engagement-model/proposal.md) | the corrected commercial model whose activities (presale, Discovery & Onboarding, partnership/account nurture) this matrix assigns owners to |
| [`../openspec/changes/archive/2026-10-29-define-meaningfy-lifecycle/proposal.md`](../../openspec/changes/archive/2026-10-29-define-meaningfy-lifecycle/proposal.md) | the ADLC/MDLC-lite build loop and Requirements & UC rows |
| [`../openspec/changes/archive/2026-10-29-define-delivery-release-lifecycle/proposal.md`](../../openspec/changes/archive/2026-10-29-define-delivery-release-lifecycle/proposal.md) | the dual-DoD lane the Review and Release & deploy rows point at |
| [`../openspec/changes/archive/2026-10-29-define-lifecycle-playbooks/proposal.md`](../../openspec/changes/archive/2026-10-29-define-lifecycle-playbooks/proposal.md) | the six per-role playbooks derived as filtered views over this matrix |
| [`../openspec/changes/archive/2026-10-29-define-roles-and-raci/inputs/2026-07-26-handbook-findings.md`](../../openspec/changes/archive/2026-10-29-define-roles-and-raci/inputs/2026-07-26-handbook-findings.md) | the Employee Handbook excerpt (pp. 65–68) this doc's six roles and adaptation notes are drawn from |
