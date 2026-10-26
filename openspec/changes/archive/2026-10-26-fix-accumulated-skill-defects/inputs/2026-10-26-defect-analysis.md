# Defect analysis: the inventory the PLAN derives from

**Status:** analysis input for the PLAN (`design.md` defect table). Produced 2026-10-26 against
**v3.0.0** (`develop` @ c3cded4). Every finding below was re-checked against the current skill text;
"still open" means the defect is present in v3.0.0.

**Sources analysed**

- The 12 files in the owner's vault, `00 Inbox/proposed/` (2026-09-16 … 2026-10-23). They are **not
  copied here**: this repo is public and the notes name client projects, external reviewers and a
  security weakness of the sales agent. Each is cited by file name; the substance needed for the fix
  is restated below in neutral terms.
- [`2026-10-25-session-findings.md`](2026-10-25-session-findings.md) (secondary seed).

## 1. Triage of the sources

| Source note | Verdict | Goes to |
|---|---|---|
| `Agents delete and move notes on request.md` | defect, still open | V1 |
| `Agents delete and move notes on request 1.md` | **duplicate** of the above (adds only a `project:` link) | V1 |
| `change notes.md`, entry *artefacts/ subfolder* | change request, still open | V2 |
| `change notes.md`, entry *Work shapes are a kind* | change request, still open | V5 |
| `change notes.md`, entry *Personal projects in 07 Perso/* | change request, still open | V3 |
| `change notes.md`, entry *Agent run notes in 04 Daily/<agent>/* | change request, still open | V4 |
| `Impact filter kind.md` | change request, still open | V5 |
| `vault-setup README and vault-first answers.md` | items 1–2 open; item 3 **resolved in 3.0.0** (vault-* ship only in `vault-assistant`) | V6 |
| `skill-change - blank line before markdown tables.md` | defect, still open (vault side); sales templates are outside this repo | V7 |
| `Skill change - precise claims and literal wording.md` | defect, still open | W1 |
| `skill-change - communication skill.md` | feedback on a skill whose quoted text is **not in skillery** (see W2) | W2 |
| `skill-change - offer-writing skill as the general offer anatomy.md` | **new skill**: out of scope (DEC-2) | Shaped out SO-1 |
| `skill-change - unify the sales ladder terms.md` | terminology change across skills and docs, needs an owner decision | Shaped out SO-2 |
| `skill-change - authenticated approvals for the sales agent.md` | `meaningfy-sales` is not in this repo; deferred by the owner on 2026-10-08 | Shaped out SO-3 |
| `sync-test.md` | **noise** (a sync check memo) | none |
| Seed §1: spec docs overlap (`CREATING_SKILLS`, `skill-template`, `agent-skills-spec`, `CONTRIBUTING`) | not re-checked for contradictions here | Shaped out SO-4 |
| Seed §1: `code-reviewer` dispatch vs `meaningfy-code-review` | **resolved** by `agent-authoring-standard` (agent carries the Dispatch contract, one lens per run, consistent with the skill) | none |
| Seed §1: `AGENTS.md` GitNexus block, duplicated in `CLAUDE.md` | **resolved** in 3.0.0 (scoped to `tools/`+`tests/`, one copy, `CLAUDE.md` imports it) | none |
| Seed §1: README "Uninstall & conflicts" migration text | **resolved** in 3.0.0 (now the "Upgrading from ≤ 2.11" row) | none |
| Seed §2 (install duplication, stale copy, open changes) | **resolved** by `single-source-distribution` | none |

Each fix's direction (widen for reuse or harden for precision) is set in
[`2026-10-26-reuse-vs-precision.md`](2026-10-26-reuse-vs-precision.md), which also adds **G1**
(near-miss trigger probes).

Net: **9 open findings** (V1–V7, W1, W2), **2 systemic process findings** (P1, P2), **4 shaped out**.

## 2. Root causes across the cohort

The findings are symptoms of five root causes. Fixing them, rather than the individual notes,
prevents the next round of the same notes.

| RC | Root cause | Symptoms |
|---|---|---|
| **RC-1** | **A vault fact is restated in each skill that uses it.** Where projects live (`01 Projects/` appears in 6 vault skills), the shape of a project folder, and the move mechanism ("Obsidian CLI or stop", stated separately in `vault-tidy`, `vault-promote` and `vault-project close`). Every layout change becomes an edit in 6–8 skills. | V1, V2, V3 |
| **RC-2** | **The authority model has two modes and needs three.** `AGENTS.md` knows "an agent acting on its own" and "a skill the owner invokes", but not "the owner asks for a direct action in the session". In addition, `permissions-claude-code.md` denies `mv` and `rm` outright, so a correct rule still could not run. The note did not spot this. | V1 |
| **RC-3** | **Kinds declare required properties but not required sections.** `vault-promote` can only check properties, so every structured kind needs its own special case or falls back to `memo`. | V5 |
| **RC-4** | **The writing family has no home for persuasive or contractual copy.** `writing-antipatterns` catalogues genre and structure failures but not accuracy failures in claims. `company-voice.md` picks a register by purpose (teach or decide) and has no register for *binding* text, although the genre map already has a Contract genre it could route to. The house's own examples show the defect: "your systems connect but quietly disagree" (`company-voice.md`) and "It is defensible because…" (`executive-communication`). | W1, W2 |
| **RC-5** | **Defect intake is disconnected.** The vault's sanctioned channel (the `AGENTS.md` hard rule "write a `kind: skill-change` note") ends in a vault inbox. The method's channel is the `.github/ISSUE_TEMPLATE/` forms, and their fields differ. Nothing moves a note from one to the other, so notes pile up for six weeks until a batch EPIC. | P1 (this EPIC exists because of it) |

## 3. Inventory of open findings

Severity: **H** blocks routine work, **M** produces wrong or inconsistent output, **L** cosmetic or
rare. Kind follows the EPIC: trigger / content / structure / link / dual-CLI.

### V1. The owner cannot have an agent delete, move or rename notes. H, content+structure

- **Issue:** asked in session to delete two superseded notes, or to move two notes into `artefacts/`,
  the agent refused and the owner did it by hand. With Obsidian closed nothing can move at all.
- **Cause:** RC-2 (no owner-requested mode; `mv`/`rm` are denied) and RC-1 (the move mechanism is
  restated in three skills as "CLI or stop"). There is also no safe-delete procedure: trash, inbound
  links, the company-memory effect.
- **Mitigation (target state):**
  1. `vault-conventions` gains **one** section, *Moving and deleting*, which is the procedure: who may
     ask (the owner, in session, naming or clearly identifying the notes); never on the agent's own
     initiative; list every path and destination once; **Obsidian CLI first, and if it does not
     answer, a file move after a vault-wide unique-name check** (safe because links are by name);
     **delete = move to `.trash/`**, never permanent; report inbound wikilinks first; warn when a
     `memory: common` note leaves a shared folder; `vault-files/_shared/` stays person-only; when the
     tools cannot act, one line plus the exact paths.
  2. `vault-tidy`, `vault-promote` and `vault-project close` **replace** their own move paragraphs with
     a citation of that section. Deletion beats addition: three procedures become one.
  3. `vault-setup/assets/AGENTS.md`: add the third authority mode to the folder hard rule ("…or when
     the owner asks for it in the session, see `vault-conventions`, Moving and deleting").
  4. `vault-setup/references/permissions-*.md`: move `mv` from **deny to ask**. Interactive sessions
     prompt; scheduled runs have no approver and still refuse. `rm` stays denied, because delete is a
     move to trash.
- **Alternatives rejected:** "CLI only, ask the owner to open Obsidian" (fails on remote and Cowork
  sessions, and still cannot delete); "allow `rm`" (not recoverable).
- **Proof:** a probe for `vault-promote` and `vault-tidy` (their descriptions say "moving with the
  Obsidian CLI" and change); one scenario "owner asks to delete two named notes, with inbound links".

### V2. Project artefacts belong in an `artefacts/` subfolder. M, structure

- **Issue:** project roots mix standing files with memos, filters, meetings and drafts.
- **Cause:** RC-1. The project-folder shape is described only in part (`project-files.md`), and each
  filing skill decides on its own where a project note goes.
- **Mitigation:** see the V2+V3 fix below.

### V3. Personal projects live in `07 Perso/`. M, structure

- **Issue:** personal projects are created beside company work in `01 Projects/`.
- **Cause:** RC-1. "The" project root is hard-coded across the cohort.
- **Mitigation (V2+V3 as one fix):** `vault-conventions` gains **Project homes**:
  - **Two roots:** `01 Projects/` for company work, and `07 Perso/` for personal work, where every note
    has `private: true` and `memory` is never set.
  - **One folder shape:** the five standing files at the root; every other note in `artefacts/`,
    created when the first artefact arrives; binaries mirror the project folder only, never
    `artefacts/`.
  - **One resolution rule**, moved here from `vault-resume`: search both roots; one match continues;
    several matches or a vague name, ask; none, offer `vault-project new`.

  Every other skill **cites** these rules instead of naming paths:

  | Skill | Change |
  |---|---|
  | `vault-project new` | asks "personal?" |
  | `vault-capture`, `vault-promote` | file into `artefacts/` |
  | `vault-tidy` | flags non-standing notes at a project root, and personal projects found in `01 Projects/` |
  | `vault-planning` | sweeps both roots |
  | `vault-resume` | cites the resolution rule instead of owning it |
  | `kinds.md` | `meeting` and the new kinds have the usual folder "the project's `artefacts/`" |
- **Alternative rejected:** the notes' per-skill patch list (≈14 edits across 8 skills). It recreates
  RC-1 and would need the same sweep at the next layout change.
- **Scope note:** this moves a rule (project resolution) from `vault-resume` into `vault-conventions`.
  It is a single-source fix, not a restructuring, but it brushes the EPIC's "do not refactor" rabbit
  hole. **Owner to confirm** (Q2).

### V4. Deployed agents' run notes go in `04 Daily/<agent>/`. L, content

- **Issue:** the sales agent's run notes landed inside the project that builds the agent.
- **Cause:** the Layout table did not anticipate deployed agents.
- **Mitigation:** one Layout row change in `vault-conventions` (`04 Daily/` also holds `<agent>/`
  subfolders; the building project is linked in `project:`), and the same row in the README asset
  (V6). The `meaningfy-sales` side was already applied outside this repo.

### V5. Missing kinds: `work-shape` and `impact-filter`. M, content+structure

- **Issue:** both are filed as `memo` with a free-text `about:`, so they cannot be queried or checked.
- **Cause:** RC-3.
- **Mitigation:**
  1. `kinds.md` gains a **Required sections** column. `vault-promote` checks sections for *any* kind
     that declares them: one generic rule, no per-kind logic.
  2. Add `impact-filter` (sections: Purpose, Importance, Best result, Worst result, Success criteria;
     properties: `date`, `project`).
  3. Add `work-shape` (sections: Boundaries, Gherkin features, Elements, Risks; properties: `date`,
     `project`, `appetite` with its six sizes).
  4. `vault-setup` ships both templates.
  5. One boundary line in `epic-planning`: a team's Shape Up work shape is a vault `work-shape` note,
     distinct from the OpenSpec EPIC it may feed.
- **Alternative rejected:** section shapes as prose in `project-files.md` only, which `vault-promote`
  cannot check mechanically.

### V6. The vault has no human-facing pointer page, and answers come from chat memory. M, content

- **Issue:** (1) there is no root `README.md`; the owner keeps one by hand and it drifts. (2) "Where do
  my projects live?" was answered from the assistant's memory, not from the vault.
- **Cause:** `vault-setup` ships agent instructions only. No hard rule says that work questions are
  answered from the vault.
- **Mitigation:**
  1. `vault-setup` ships a `README.md` asset: a pointer table, the Layout table copied under the line
     "the skill wins", and blanks for machine facts. `final-check.md` compares its folder table with
     `vault-conventions` Layout. The copy is deliberate: a person reads it in Obsidian, where the
     skill is not visible, and the check stops the drift.
  2. One hard rule in `assets/AGENTS.md`: questions about the owner's projects, tasks and decisions
     are answered from this vault.
- **Alternative rejected:** a README that only links to the skill (unreadable inside Obsidian).

### V7. A table without a blank line before it renders as raw pipes in Obsidian. M, content

- **Issue:** eight tables in one project's notes rendered as pipe text.
- **Cause:** Obsidian syntax is delegated to the external `obsidian-markdown` skill, which does not warn
  about this pitfall, and the house conventions add no guard.
- **Mitigation:** `vault-conventions` gains a short **Formatting** rule: a blank line before and after
  every table, the same cell count in every row, and a literal `|` escaped (`[[note\|alias]]`). Check
  the 18 `vault-setup` templates for a label directly above a table. The `meaningfy-sales` run-note
  templates are in SO-3's repo, not here.
- **Alternative considered:** put the rule in `technical-writing`, since it is a general Markdown
  pitfall. Do that only if GitHub-flavoured Markdown shows the same failure; it is Obsidian that
  bites here.

### W1. Claims that exceed what the method guarantees, and verbs impossible for their subject. M, content

- **Issue:** an external ontologist's review of conference copy: "meaning breaks down", "data
  disagrees", "keeps them consistent", "exactly", "defensible", a category claimed by adjacency, an
  acronym that was not expanded.
- **Cause:** RC-4. The catalogue covers genre and structure, not claim accuracy, and our own voice
  examples model the defect.
- **Mitigation:** the note's 7 rules **compress** into the catalogue's existing structure:

  | Note rule | Placement |
  |---|---|
  | 2, 4, 5, 7 (promise the mechanism; replace vague evaluative words; claim only categories you serve; prefer verifiable properties) | **U7 "Claim exceeds the mechanism"**, an unguarded defect in `writing-antipatterns`. *Cue:* can an outsider check it? *Fix:* name the mechanism or the checkable property. |
  | 1 (literal verbs) | **U8 "Impossible predicate"**, unguarded. |
  | 3 (state it in the positive) | **Guarded**, not unguarded: a defect in Decision and persuasive headlines, and **required** in Contract/specification ("MUST NOT"). This is exactly the inversion matrix's purpose. `executive-communication` cites it. |
  | 6 (acronym at first use) | Extend the existing guarded *Deferred definitions* entry; no new rule. |

  In the same PR, fix the two self-violating examples (`company-voice.md` line 73,
  `executive-communication` line 195).
- **Alternative rejected:** putting the rules in `company-voice.md`. They are defects across genres,
  not tone.

### W2. The communication skill has one register and no formal or contractual mode. M, content

- **Issue:** a formal quotation drifted towards a conversational tone and a pitch-shaped structure,
  and brand assets were missed.
- **Finding:** the note quotes text that **is not in skillery**: "late 30s" (the repo says "late
  20s"), and a "preserve the key ideas" list with a five-step messaging pattern. It was written
  against another copy (likely a Cowork or claude.ai upload). The closest owner here is
  `executive-communication` with `references/company-voice.md`. **Owner to confirm** (Q1).
- **Cause:** RC-4. Registers are chosen by teach or decide; there is no "bind" purpose, and no link
  to the Contract genre.
- **Mitigation, in scope:**
  - `company-voice.md` gets a third register, **Formal / contractual** (quotations, offers, SoWs,
    tenders): selection rule teach / decide / **bind**, routed to the Contract genre for its defects,
    with the sentence "plain vocabulary is not casual".
  - One fixed rule: client-facing documents use the company brand assets (logo, "Made in Luxembourg"
    label) from the company Brand folder, named not pathed (machine-neutral).
- **Not in scope:** the quotation section order and wording playbook belong to the offer anatomy
  (SO-1). The "closing note only in chat" and the service-lines list address text that does not
  exist here. If the source skill is confirmed to be ours, reopen them.

### P1. Vault skill-change notes have no path into the repo. M, process (RC-5)

- **Mitigation:**
  1. Align `vault-setup/assets/templates/skill-change.md` with `.github/ISSUE_TEMPLATE/defect.yml`:
     skill, kind, what you asked, what came out, what should have come out, proposed change. A note
     then transfers to an issue by copy, not by rewrite.
  2. One line in `docs/development-method.md` (issue loop): "a vault `skill-change` note is a valid
     intake; transfer it to an issue, then mark the note `Filed #N`".

  No tooling (EPIC no-go).
- **Alternative deferred:** a script that files notes as issues, which needs tooling. Revisit only if
  manual transfer lags.

### P2. Vault-local overrides outlive the fix. L, process

- **Issue:** the owner has already written V2–V4 into the vault's own `AGENTS.md` "Vault-specific
  conventions". Once the skills ship, those rules duplicate them and drift.
- **Mitigation:** the CHANGELOG entry for this EPIC carries a migration line: "remove the
  vault-specific rules for artefacts/, 07 Perso/ and 04 Daily/<agent>/ from your vault `AGENTS.md`;
  mark the `change notes.md` entries Implemented".

## 4. Shaped out (DEC-2)

| ID | Item | Why out | Goes to |
|---|---|---|---|
| SO-1 | General `offer-writing` skill (offer shapes and commercial models, the twelve-question anatomy, traceability chains, pre-ship QA), with `proposal-writing` as its Decision Phase shape; absorbs W2's quotation playbook | new skill and boundary move | new EPIC `add-offer-writing` (consulting bundle); the draft is in the owner's Offerings project |
| SO-2 | Sales ladder rename (Light tier → Discovery workshop, Deep tier → Proof of Value, build → Scaling) across `semantic-consulting-coach`, `decision-package`, `proposal-writing`, `docs/ai-sales/*`, `docs/roles-and-raci.md` | terminology owned by the engagement model; open question whether the Decision Package *is* the Proof of Value deliverable | `define-blc-engagement-model`; after the rename, add an `ownership.yaml` tag with claim patterns `Light tier` and `Deep tier` as the tripwire |
| SO-3 | Approvals the agent cannot forge (separate approvals file or channel, a dedicated Odoo user); blank lines in the sales run-note templates | `meaningfy-sales` is not in this repo; approvals deferred by the owner on 2026-10-08 | `add-sales-bundle`; record the approvals as an accepted risk there |
| SO-4 | Contradictions between `spec/CREATING_SKILLS.md`, `skill-template.md`, `agent-skills-spec.md` and `CONTRIBUTING.md` | merge already owned elsewhere | `skill-crafting-method` |

## 5. Proposed fix batches (DEC-1, grouped by owner)

| Batch | Owners | Findings | Proof |
|---|---|---|---|
| A. Vault hub | `vault-conventions` (+ `references/kinds.md`, `project-files.md`) | V1 rule, V2+V3 Project homes, V4, V5 kinds and sections, V7 formatting | `make validate` (the ownership tripwire for `vault-note-conventions`) |
| B. Vault cohort cites the hub | `vault-project`, `vault-resume`, `vault-capture`, `vault-promote`, `vault-tidy`, `vault-planning` | V1 (move paragraphs deleted), V2/V3 one-liners | trigger probes for `vault-promote` and `vault-tidy` (descriptions change) |
| C. Vault setup | `vault-setup` (`AGENTS.md`, permissions, README asset, 3 templates, final check) | V1 authority and permissions, V5 templates, V6, P1 template | final-check run on a scratch vault |
| D. Writing family | `writing-antipatterns`, `executive-communication` (+ `company-voice.md`), `epic-planning` (one boundary line) | W1, W2, V5 boundary line | a probe for `writing-antipatterns` if its description changes; before/after examples |
| E. Method + release | `docs/development-method.md`, CHANGELOG, `tests/trigger_probes.yaml` | P1, P2, G1 near-miss probes, the posture rule | `make validate`, `make skill-inventory` |

A and B ship together (B cites A). C, D and E are independent.

## 6. Open questions for the owner

- **Q1.** Which "communication skill" was the 2026-10-22 feedback about? Its quoted text is not in
  skillery. If it is a separate copy, should that copy be retired in favour of `executive-communication`?
- **Q2.** Accept moving project resolution from `vault-resume` into `vault-conventions` (V2+V3) as
  part of this EPIC, despite the "do not refactor" rabbit hole?
- **Q3.** Accept `mv` going from deny to ask in the vault permissions (V1)? `rm` stays denied.
- **Q4.** The raw vault notes stay out of this public repo, and this analysis cites them by file name.
  Is that acceptable, or should sanitised copies be committed?
- **Q5.** SO-2: is the Decision Package the Proof of Value's deliverable, or a separate step?
