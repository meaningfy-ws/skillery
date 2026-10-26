<!-- PLAN (design half). PLAN = this file + tasks.md. Document type: Implementation. Revision 1. -->

> Parent: EPIC `fix-accumulated-skill-defects` ([`proposal.md`](proposal.md), DEC-1…DEC-10).
> Inputs: [`inputs/2026-10-26-defect-analysis.md`](inputs/2026-10-26-defect-analysis.md) (finding
> ids V1–V7, W1, W2, P1, P2, root causes RC-1…RC-5),
> [`inputs/2026-10-26-reuse-vs-precision.md`](inputs/2026-10-26-reuse-vs-precision.md) (postures, G1),
> [`inputs/2026-10-26-plan-decisions.md`](inputs/2026-10-26-plan-decisions.md) (owner answers).
> Acceptance criteria live in the spec deltas under [`specs/`](specs/).

## Context

The catalogue is at v3.0.0. The 12 vault notes and the session seed reduce to 9 open skill findings,
2 process findings and 4 shaped-out items (analysis §1). The fixes concentrate in three clusters:

| Cluster | Skills | Posture | Root causes |
|---|---|---|---|
| Vault | the 9 `vault-*` skills | P (precise house standard) | RC-1 restated facts, RC-2 authority model, RC-3 kinds without sections |
| Writing | `writing-antipatterns` (R), `executive-communication` + `company-voice.md` (C), `epic-planning` (R, one boundary line) | per skill | RC-4 |
| Process and docs | `tests/trigger_probes.yaml`, `docs/development-method.md`, unclaimed repo docs | n/a | RC-5, G1, DEC-9 |

**Posture per skill (DEC-7; the PR lists these):** P for `vault-conventions`, `vault-setup`,
`vault-project`, `vault-resume`, `vault-capture`, `vault-promote`, `vault-tidy`, `vault-planning`
and `vault-daily`; R for `writing-antipatterns` and `epic-planning`; C for
`executive-communication`.

The repo is all Markdown and YAML for this change; no code in `tools/` changes. GitNexus scope
(`tools/`, `tests/`) is touched only by the probe data file, which the linter reads (verified:
`trigger_probe_report` reads `expect` only and ignores other keys).

## Goals / Non-Goals

**Goals:**
- Each vault fact (project homes, folder shape, the move/delete procedure) is stated once, in
  `vault-conventions`, and cited by the other skills (DEC-6).
- An owner's in-session request to move, rename or delete is executed safely (V1).
- Kinds can declare required sections, which `vault-promote` checks generically (V5).
- Claim-accuracy defects are catalogued, and the house examples stop modelling them (W1).
- `executive-communication` chooses its register explicitly and leaves contractual structure alone
  (W2).
- Near-miss probes guard the colliding triggers (G1); vault notes reach the issue tracker (P1).
- The repo docs this EPIC may touch get shorter and state each fact once (DEC-9).

**Non-Goals:**
- `offer-writing`, the sales-ladder rename, sales-agent approvals, the spec-docs merge (SO-1…SO-4).
- Any change in `tools/` or to a gate's behaviour; no new skill, split or agent edit.
- Restructuring a document during the docs pass (rabbit hole).
- Changing `decision-package`'s domain wording (SO-2 owns it).

## Decisions

Settled bets are cited (DEC-n); the choices below are made at PLAN time.

- **D-1. The vault hub has three new sections in `vault-conventions/SKILL.md`:** *Project homes*,
  *Moving and deleting*, *Formatting*. Section names are fixed so that citations are stable
  (`vault-conventions`, Moving and deleting). Rejected: a new `references/moving.md`, because the
  procedure is short (≈12 lines) and every vault skill already loads `SKILL.md`.
- **D-2. The resolution rule moves verbatim in meaning from `vault-resume` step 1 into Project homes**
  and is extended to both homes. `vault-resume` and `vault-capture` cite it. Rejected: leaving it in
  `vault-resume` and citing that skill, because conventions must not depend on a workflow skill.
- **D-3. Delete is a move into `<vault>/.trash/`** (Obsidian's own trash folder, created when absent).
  `rm` is used only for an explicit request for permanent deletion (DEC-10). Rejected: the OS
  trash, which is not portable across Windows and Linux and is invisible from Obsidian.
- **D-4. The file-move fallback requires a vault-wide unique note name** (`find <vault> -name
  "<name>.md"` returns one hit). Embeds and links by name then still resolve. Path-style links, which
  the conventions forbid, are reported, not fixed.
- **D-5. `mv` and `rm` go from deny to ask** in both permission references (DEC-10). In Claude Code:
  `"ask": ["Bash(mv:*)", "Bash(rm:*)"]`. In opencode: `"bash": {"mv *": "ask", "rm *": "ask"}`.
- **D-5b. Scheduled runs deny `mv` and `rm` explicitly, without relying on how ask behaves without
  an approver.** The scheduler runs `claude -p … --permission-mode acceptEdits`
  (`references/scheduler.md`), and acceptEdits may auto-approve filesystem commands. The scheduled
  command line therefore adds `--disallowedTools "Bash(mv:*)" "Bash(rm:*)"`, because an explicit deny
  wins over every mode. For opencode, `vault-setup` writes `opencode.scheduled.json` at the vault root
  (`"permission": {"bash": {"mv *": "deny", "rm *": "deny"}}`), and the scheduled line runs
  `OPENCODE_CONFIG=opencode.scheduled.json opencode run …`; opencode merges that file over the
  project `opencode.json`. `permissions-opencode.md` is marked UNVERIFIED, so this merge is checked
  in 9.3 as well. Task 9.3 verifies both with the scheduler's exact command lines.
  Rejected: trusting "ask has no approver", which is unverified under acceptEdits.
- **D-6. Required sections are a column in `kinds.md`** (`Required sections`, `—` when none), and
  `vault-promote` checks headings by exact `##` text. Rejected: per-kind logic in `vault-promote`.
- **D-7. The table rule is phrased as a check, not as syntax.** It guards a known Obsidian pitfall
  and still points to `obsidian@obsidian-skills` for table syntax, so the requirement "Obsidian
  syntax is not restated" holds.
- **D-8. The README asset never overwrites a vault's existing `README.md`.** On an existing vault,
  `vault-setup` reports the differences and the owner decides (consistent with "an existing vault is
  only completed").
- **D-9. The `skill-change` template takes the field labels of `.github/ISSUE_TEMPLATE/defect.yml`**
  verbatim: *Skill or agent*, *Kind*, *Where*, *Catalogue version*, *What you asked (the prompt,
  verbatim)*, *What came out*, *What should have come out*, *Anything else*. A proposed change goes
  under *Anything else*. The intake bridge covers **defect issues only**: a request for a new skill
  has different fields (`request.yml`) and goes through the EPIC path, not through a vault note.
- **D-10. Persuasive copy maps to the existing Decision genre** ("Decision (persuasive)"). No new
  genre. W1 adds **U7 Claim exceeds the mechanism** and **U8 Impossible predicate** (unguarded), a
  new guarded row **A14 Negative framing** (A13 is taken by *Curse of knowledge*), and extends **A5
  Deferred definitions** with acronyms.
- **D-11. `company-voice.md` gets three registers chosen by purpose** (teach / decide / bind). Bind
  routes to the Contract genre. The voice's "late 20s" vocabulary rule is unchanged (the "late 30s"
  in the feedback belongs to another copy, Q1). The brand-assets rule names the asset description
  file `meaningfy_brand_assets.md` and the company Brand folder, never a local path.
- **D-12. Near-miss probes use a new key `near_miss_of`** beside `expect`. The linter ignores it
  today. Enforcing it in the linter would be a gate change (no-go) and is shaped out (SO-5).
- **D-13. "Claimed" for the docs pass means:** the file's current path *or its pre-v2.11 path*
  appears in an open change's `tasks.md` (old `docs/how-we-work/**`, `docs/services/**` and
  `docs/dual-cli/**` paths map to today's `docs/ai-*/**` and `docs/environment/dual-cli/**`). A
  claimed file receives only the edits this EPIC's fixes require (a regenerated inventory, one README
  row, a CHANGELOG entry), never a crystallisation edit.

## Algorithm / approach

### A. Vault hub (V1–V5, V7, P2): edit order and content

1. **`vault-conventions/SKILL.md`**
   - Layout rows: `01 Projects/` → "company projects (Project homes)"; `04 Daily/` gains "and
     `<agent>/` run notes of deployed agents"; `07 Perso/` → "personal notes, and personal projects
     (Project homes)". The folder sentence becomes "…except as the vault's write rules allow or the
     owner asks in the session (Moving and deleting)".
   - **Project homes** (per the spec delta): two homes, one folder shape, `artefacts/` created
     lazily, binaries mirror project folders only, `private: true` and no `memory` in `07 Perso/`,
     agent run notes in `04 Daily/<agent>/`, and the resolution rule.
   - **Moving and deleting:** the procedure in the spec delta, as a numbered list: who asks → list
     paths → inbound links and memory warning → CLI or unique-name file move → delete to `.trash/` →
     `rm` only on an explicit permanent request → `_shared/` person-only → cannot act: one line and
     the paths.
   - **Formatting:** the three-point table check (D-7).
   - Company-memory section: one clause, "never set in `07 Perso/`".
2. **`references/project-files.md`:** the root holds only the five standing files; everything else
   goes in `artefacts/`; the shape applies in both homes.
3. **`references/kinds.md`:** add the `Required sections` column; add `impact-filter` and
   `work-shape`. `skill-change` gets the eight D-9 labels as its required sections. The project-bound kinds (those whose usual folder is a project) are exactly
   `meeting`, `impact-filter` and `work-shape`; their usual folder becomes "the project's
   `artefacts/`". The standing-file kinds (`project`, `sessions`, `decisions`, `tasks`,
   `resources`) stay at the project root.
4. **Stale CLI-only statements in `vault-setup`** are aligned with Moving and deleting:
   - `references/obsidian.md`, opening paragraph ("move notes only through the Obsidian CLI") →
     "prefer the Obsidian CLI; the fallback is in `vault-conventions`, Moving and deleting";
   - `references/final-check.md`, row 7 → the CLI is recommended, not required, for the moving
     skills;
   - `references/permissions-claude-code.md`, the sentence "Commands that move, delete or fetch (`mv`,
     `rm`, `curl`, `wget`) are denied outright" → `curl` and `wget` denied, `mv` and `rm` ask.

*Worked example: a delete request.* The owner says "delete the two older debugging notes in the
delivery project". The agent resolves the project (Project homes) and lists:

```
.trash/ ← 01 Projects/2026-09-17 X/artefacts/Debug notes A.md   (linked from: Cheatsheet)
.trash/ ← 01 Projects/2026-09-17 X/artefacts/Debug notes B.md   (no inbound links)
```

The owner already named the notes, so no second confirmation is needed. The CLI does not answer, so
the agent runs `mv` (the permission prompt appears) and reports "Cheatsheet now shows one broken
link".

### B. Vault cohort cites the hub (DEC-6)

| Skill | Delete | Add |
|---|---|---|
| `vault-resume` | the resolution wording in step 1 | "Resolve the project (`vault-conventions`, Project homes)" |
| `vault-capture` | "as `vault-resume` does" | the same citation; "non-standing notes go to the project's `artefacts/`" |
| `vault-project` | `new` step 1 "List `01 Projects/`"; in `close` step 5, "do not move with file tools…" | `new` step 1 resolves by Project homes; `new` asks "personal?" (→ `07 Perso/`, `private: true` on every file, no `artefacts/`); `close` resolves both homes and moves per Moving and deleting |
| `vault-promote` | step 3 "a project folder in `01 Projects/`"; step 4's "Move with the Obsidian CLI… **Never move with file tools**" | sections check (D-6); destination is a project's `artefacts/` (either home) or `03 Resources/`; moves per Moving and deleting. Description: replace "moving it with the Obsidian CLI so every wikilink follows" with "moving it so every wikilink follows" |
| `vault-tidy` | "Moves and renames go through the Obsidian CLI… **Never** use file tools for a move." and "Never finish a failed row with file tools." | moves, renames and deletes per Moving and deleting (a failed row stops the plan, as today); the plan flags loose artefacts at a project root and personal projects in `01 Projects/`. Description: the same wording change as `vault-promote` |
| `vault-planning` | nothing | the weekly sweep lists active projects from both homes (citation) |
| `vault-daily` | nothing | check only: its note format writes no table directly below a label |

Net effect: three move procedures and two resolution rules become one of each.

### C. Vault setup (V1, V5, V6, P1)

`assets/AGENTS.md`:
- The folder hard rule gains the exception "or when the owner asks for it in the session
  (`vault-conventions`, Moving and deleting)", and the existing exception extends to "a project's
  `artefacts/`".
- New hard rule: "Questions about the owner's projects, tasks and decisions are answered from this
  vault, not from the assistant's own memory or chat history."

Other `vault-setup` files:
- **Permissions:** D-5 in both permission references; D-5b in `references/scheduler.md` (both
  scheduled command lines and the opencode note).
- **README asset:** new, with D-8 behaviour.
- **Templates:** `impact-filter.md` and `work-shape.md` are added. `skill-change.md` is realigned
  (D-9).
- **`final-check.md`:** adds the README/Layout comparison.
- **`SKILL.md`:** lists the README in what setup creates.

### D. Writing family (W1, W2, V5 boundary)

- **`writing-antipatterns/SKILL.md`:**
  - U7 and U8 after U6, each with a *Cue* and a *Fix*. Examples come from two domains: the
    semantic-copy pair ("shows where meaning breaks down" → "shows where meaning conflicts or is
    poorly specified") and an SME/AI pair ("a seamless AI assistant" → "an assistant that answers
    from your own documents and cites them").
  - "Thirteen entries" (Guarded section) becomes "Fourteen entries".
- **`references/inversion-matrix.md`:** a compact row and a full entry for **A14 Negative framing**,
  with a status for all eight genres: Tutorial avoid · How-to avoid (except warnings) · Reference
  welcome (constraints) · Explanation avoid · Decision **harmful** · Decision record welcome ·
  Contract **required** · Coaching avoid. A5 gains "spell out an acronym at first use".
- **The ten reference files** that say "U1–U6" (the eight genre files, `explainer.md` and
  `inversion-matrix.md`) change it to "U1–U8", and the eight genre files gain the A14 pointer row.
- **`executive-communication/SKILL.md`:**
  - "When NOT to use" adds "a contractual document (quotation, SoW, tender): write only its cover
    message or executive summary; its structure belongs to the offer skill".
  - "Start here" adds "state the register (teach / decide / bind)".
  - In the worked example, "It is defensible because the moat is our mapping method" → "It holds
    because the moat is our mapping method".
- **`references/company-voice.md`:**
  - "Two registers" → "Three registers: choose by purpose", with Bind (formal, contractual): full
    sentences, defined terms, "will provide", no contractions; "plain is not casual"; defects per the
    Contract genre.
  - The fixed list gains the brand-assets line.
  - The before/after section adds a Bind pair and an SME/AI Executive pair.
  - In the Technical before/after, "your systems connect but quietly disagree" → "your systems
    connect but give conflicting answers".
- **`epic-planning/SKILL.md`**, Boundary: "A team's Shape Up work shape kept in a personal vault is a
  `work-shape` note (`vault-conventions`); it may feed an EPIC but is not one."

### E. Probes (G1, DEC-3)

New entries (`expect` / `near_miss_of`):

| Probe | expect | near_miss_of |
|---|---|---|
| "explain how the bundle generator works, for the repo docs" | technical-writing | explanatory-writing |
| "why does this ADR read badly" | writing-antipatterns | executive-communication |
| "tighten the cover email for this quotation" | executive-communication | proposal-writing |
| "write the proposal and SoW for the Decision Phase" | proposal-writing | executive-communication |
| "move this proposed note into the project" | vault-promote | vault-tidy |
| "reorganise the notes in my inbox" | vault-tidy | vault-promote |
| "delete these two notes from my vault" | vault-conventions | vault-tidy |
| "the copy says our method keeps data consistent, is that claim sound" | writing-antipatterns | executive-communication |

Positive probes for the two re-described skills (`vault-promote`, `vault-tidy`) already exist and are
kept. DEC-4: `skill-creator`'s eval loop runs on the W1 and W2 fixes, and the PR records the result.

### F. Method and intake (P1, DEC-7)

`docs/development-method.md`:
- In the issue-loop section, one sentence: "A vault `skill-change` note is a valid intake for a
  defect: copy it into a defect issue field by field, then mark the note `Filed #N`."
- In the skill lifecycle section, one paragraph on the posture rule (R/C/P, per the catalogue-governance
  delta), linking the reuse-vs-precision input.

Net growth of this file: at most 8 lines, offset in the docs pass (G).

### G. Documentation crystallisation (DEC-9, D-13)

1. **Audit** (one input file, `inputs/docs-redundancy-map.md`). For every file in the candidate set,
   record a row: fact or section → its owner (a skill, or one doc) → the duplicates (file:line) →
   the action (cut and link / tighten / keep) → claimed by (change id or none).

   The candidate set is the unclaimed files from the D-13 computation of 2026-10-26:
   - `docs/development-method.md`
   - `docs/engineering-standards/**`, including `coding-prompt.md` (548 lines) and
     `references/stream-coding-notes.md` (381)
   - `docs/environment/dual-cli/{README,mapping,mcp-setup,setup-claude,setup-opencode,body-agnosticism-audit}.md`
   - `docs/environment/vault-assistant.md`
   - `docs/philosophy/art-of-coding-with-an-llm.md`
   - `CLAUDE.md`

   Excluded as claimed: the playbooks and service pages (`define-lifecycle-playbooks`,
   `define-ai-domains` by their pre-v2.11 paths), `README.md`, `AGENTS.md`,
   `docs/environment/{setup,openspec-setup-guide}.md`, `docs/environment/dual-cli/compatibility.md`,
   `docs/skill-inventory.md`, `CONTRIBUTING.md` and `spec/*`.
2. **Recompute the claim** at the start of the pass (claims change when other EPICs move). The
   recomputed list overrides the one above, and the difference is recorded in the map.
3. **Apply per file, in one commit per file:**
   - a restatement of a skill rule becomes a one-line link to the skill;
   - a duplicate between two docs is kept in the owner and replaced by a link in the other;
   - wording is tightened by the writing family (`technical-writing`, with `writing-antipatterns`'
     Reference and How-to views).

   No section is reordered or retitled.
4. **Hand off:** for each claimed file with findings, append a dated section to the claiming change's
   `inputs/docs-findings-from-fix-accumulated-skill-defects.md` (one file per claiming change). The
   claiming change is not edited otherwise.
5. **Measure:** record the line totals of the candidate set before and after in the map. The pass is
   accepted when the total decreases and no audit row marked "cut and link" remains open.

*Worked example.* Suppose `coding-prompt.md` restates cosmic-python's layer rules in 40 lines. The
row reads: "layer rules → `cosmic-python` → coding-prompt.md:120-160 → cut and link → none". After
the edit, those lines are one line: "Layering: follow the `cosmic-python` skill" (as a link).

### Idempotency

Every edit is a text change to a versioned file; re-applying a task is a no-op once its acceptance
grep holds. Probe entries are keyed by their phrase; a duplicate phrase is not added twice. The
README asset (D-8) and permission writes in `vault-setup` keep their existing "complete, never
overwrite" behaviour, so re-running setup on a vault is safe.

### Anti-patterns

- ❌ Copying the Moving and deleting procedure into `vault-tidy` "for convenience". Cite it.
- ❌ Writing `01 Projects/` into a skill rule that locates projects, outside `vault-conventions`.
- ❌ `rm` as the default delete. Delete is a move to `.trash/`.
- ❌ Adding SME or AI service lines to `semantic-consulting-coach` (posture P; W2 item 6 is out of
  scope).
- ❌ A new genre for marketing copy (D-10).
- ❌ Editing a claimed doc during the crystallisation pass, or restructuring an unclaimed one.
- ❌ Enforcing `near_miss_of` in `tools/repo_lint` (gate change, SO-5).
- ❌ Copying a raw vault note into this public repo.

## Error matrix

| Failure mode | Expected handling |
|---|---|
| Owner's request is ambiguous ("the other notes") and matches more than the intended notes | The agent lists the candidates and asks; nothing moves until the owner names them |
| Obsidian CLI does not answer and the note's name is not unique | No move; the agent names the colliding note (spec scenario) |
| `.trash/` does not exist | The agent creates it (Obsidian's own folder) and moves the note into it |
| A scheduled run tries `mv` or `rm` | The permission ask has no approver, so the call is refused; the run lists the paths in its run note |
| The note to delete has `memory: common` | The agent warns before acting that the memory loses it at the next run |
| The owner asks for permanent deletion | `rm` after the permission prompt; the agent first states that it is not recoverable |
| A target in `vault-files/_shared/` | Refused: only a person changes it (one line) |
| `vault-setup` runs on a vault that already has a `README.md` | No overwrite; the differences against the asset and the Layout are listed (D-8) |
| `vault-promote` finds a kind with no `Required sections` entry | Only properties are checked, as before |
| A docs-pass target turns out to be claimed after the recompute | No edit; the finding goes to the claiming change's `inputs/` |
| A probe's `near_miss_of` names a non-existent skill | Caught in review (the linter does not check this key, D-12); task 6.2 greps it |
| A scheduled run would auto-approve `mv`/`rm` under acceptEdits | Prevented by the explicit `--disallowedTools` on the scheduled command line (D-5b); verified in 9.3 |
| `make validate` reports inventory drift after the description changes | Run `make skill-inventory` and commit the regenerated file (task 8.2) |

## Shaped out (DEC-2)

| ID | Item | Goes to |
|---|---|---|
| SO-1 | `offer-writing` skill (core anatomy plus shape profiles; `proposal-writing` becomes the Decision Phase profile; absorbs the quotation playbook from W2) | new EPIC `add-offer-writing` |
| SO-2 | Sales-ladder rename; `decision-package` domain wording | `define-blc-engagement-model` |
| SO-3 | Sales-agent approvals; blank lines in the sales run-note templates | `add-sales-bundle` |
| SO-4 | Contradictions among `spec/*` and `CONTRIBUTING.md` | `skill-crafting-method` |
| SO-5 | Linter enforcement of `near_miss_of` and of near-miss coverage | a future tooling change (gate change) |
| SO-6 | Whether the July `define-*` PLANs (stale paths, 0 ticks) still claim `README.md` and `AGENTS.md` | owner triage; a freed file joins a later docs pass |

## Risks / Trade-offs

- [The file-move fallback breaks a path-style link] → path links violate the conventions anyway; the
  agent reports them before moving.
- [`rm` on ask allows permanent loss after one prompt] → the owner's choice (DEC-10); the procedure
  makes `.trash/` the default, and the agent states irreversibility before `rm`.
- [`.trash/` is ignored by the sync rules (`references/sync.md`)] → trashed notes are recoverable
  only on the machine that trashed them; this is stated in Moving and deleting.
- [A claimed file stays redundant because its owning PLAN is stale] → recorded as SO-6, not worked
  around.
- [Description wording changes shift triggers] → positive and near-miss probes (E), and the
  `skill-creator` eval on the writing fixes.
- [Vault owners keep their local overrides after the release] → the CHANGELOG migration line (P2).

## Open Questions

None blocking. SO-6 needs an owner triage outside this change.
