# Adversarial design review — `agent-authoring-standard` (PLAN hardening)

> Reviewer: independent subagent, 2026-10-26. Read: `proposal.md`, `design.md`, `tasks.md`, both spec
> deltas, every file in `inputs/`, `AGENTS.md`, `spec/skill-repo-governance.md`,
> `docs/development-method.md` (untracked human WIP, treated as canon), `agents/*.md`,
> `tools/repo_lint/lint.py`, `tools/opencode_gen/gen.py`, `tests/test_repo_lint*.py`,
> `tests/test_opencode_gen.py`, `docs/environment/dual-cli/mapping.md`, `README.md`, the sibling
> `single-source-distribution/{proposal,design}.md`, and the consumers `add-sales-bundle` and
> `add-devops-bundle`, plus `skill-crafting-method`.
> Vendor docs checked 2026-10-26: <https://code.claude.com/docs/en/sub-agents>,
> <https://code.claude.com/docs/en/cli-reference>, <https://opencode.ai/docs/agents/>.
> `openspec validate agent-authoring-standard --strict` → **valid** (format is fine; the problems are
> in the content).
> The architect's files were not edited. The architect folds these findings in.

**Counts:** 5 BLOCKER · 12 MAJOR · 9 MINOR.

---

## A. Assumptions A-2 / A-3 — checked now, not deferred

**0. (Info) A-2 and A-3 are both TRUE. Fold them in and drop the "verify" half of task 0.2.**
- A-2: "Pass `--agent <name>` to start a session where the main thread itself takes on that
  subagent's tool restrictions and model: `claude --agent code-reviewer`". A persistent form also
  exists: `"agent": "<name>"` in `.claude/settings.json` (sub-agents page, "Run the whole session as a
  subagent"; CLI reference row `--agent`).
- A-3: "Claude Code ignores a field it doesn't recognize without reporting an error" (sub-agents page,
  frontmatter reference). `type:` loads; it only appears in the `claude --debug` log as "does not
  recognize or apply".
- **Fix:** record both quotes and URLs in design.md as verified facts. Delete the A-2/A-3 fallback rows
  from the Error matrix. Replace task 0.2 with the load test in finding 3.

## B. BLOCKERS

**1. BLOCKER: tasks 2.2, 4.1, 4.2 and D-3 target code that the sibling deletes.**
- Evidence: `single-source-distribution/design.md` D4: "`opencode_gen` is deleted rather than gutted".
  D6: the mapper moves to JS `tools/opencode-bundle-lib.mjs::renderAgent`, "with the three mapping
  tables (`MODEL_ALIASES`, …) moved verbatim — they then exist **only** in JS". The sibling's TC-13/14/19
  are node tests.
- This PLAN still says: task 2.2 "lazy `from tools.opencode_gen.gen import MODEL_ALIASES`"; task 4.1
  `tests/test_opencode_gen.py`; task 4.2 `gen.py::map_agent`; the Context row and GitNexus CRITICAL note
  on `map_agent`; and the anti-pattern row "Import `MODEL_ALIASES` from the mapper". A-1 says the
  mapper is "rendered at install time by `tools/opencode_gen/gen.py::map_agent`", which contradicts
  the sibling. The Error-matrix fallback ("lint reads aliases from the same source") cannot work,
  because Python cannot import a JS constant.
- **Fix:** rewrite A-1 to the sibling's actual end state. Task 4 becomes: add `AGENT_MODES` plus the
  `scheduled` gap to `renderAgent` in `tools/opencode-bundle-lib.mjs`, with node tests in
  `tests/opencode-bundle-installer.test.mjs`. For the model check in A1, decide one of these and record
  it as a D-n:
  - (a) Lint pins nothing and relies on the installer's loud failure plus the sibling's TC-19, which
    renders every repo agent in CI. This is the smallest option, and the recommended one.
  - (b) Move the alias table to a neutral data file that both Python and JS read.

  Do not parse the `.mjs` from Python.

**2. BLOCKER: task 1.1 cannot pass its own gate. `orphan_agent_references` fires on the template.**
- Evidence: `tools/repo_lint/lint.py:36` has `ALL_AGENT_NAMES = {…, "gherkin-writer", "documenter"}`.
  `orphan_agent_references` (lint.py:263-282) flags every non-exempt `.md` file that contains a word
  matching an agent name with no `agents/<name>.md`. Only `openspec/changes/` and
  `docs/environment/setup.md` are exempt. Task 1.1 writes a *Candidate roles* section into
  `spec/agent-template.md` naming documenter and gherkin-writer (D-13). The result is
  `make validate` red at task 1.1.
- **Fix:** pick one and add it to task 1.1:
  - (a) Remove `documenter` and `gherkin-writer` from `ALL_AGENT_NAMES`. They are now backlog
    candidates (DEC-7), not retired names. Add a one-line comment.
  - (b) Exempt `spec/agent-template.md` in `orphan_agent_references`.

  Option (a) is the honest fix, because DEC-7 brings the names back.

**3. BLOCKER: `epic-planner` as `lead` cannot run the flow it drives.**
- Evidence: with `--agent`, "the main thread itself takes on that subagent's tool restrictions" (A-2
  quote above). The re-cut keeps `tools: [Read, Write, Grep, Glob, AskUserQuestion]`.
  - The session would have **no `Bash`**. `/opsx:propose` runs `openspec new change`,
    `openspec status`, `openspec instructions` through `Bash(openspec:*)`
    (`.claude/commands/opsx/propose.md:4,37-59`).
  - It would have **no `Edit`**, so refining an existing change means full-file rewrites.
  - It would have **no `Skill`**. Step 2 of `epic-planning` uses `superpowers:brainstorming`, which is
    not in `skills:`.
  - Preloading `skills:` under `--agent` was reported broken (issue "running claude with --agent doesn't
    preload skills like subagents", Claude Code 2.1.63, closed 2026-04-16 without a documented outcome).
    If preload does not apply in the main session and `Skill` is absent, the planner has none of its
    method.
- **Fix:** add `Bash, Edit, Skill` to the epic-planner `tools`. Add a D-n stating that a `lead` agent's
  `tools` restrict the human's main session, so the list must cover the whole flow. Replace task 0.2
  with a concrete load test: `claude --agent meaningfy-building:epic-planner`, then confirm three
  things:
  - (i) `epic-planning` content is in context without invoking it;
  - (ii) `/opsx:propose x` reaches `openspec new change`;
  - (iii) `AskUserQuestion` works.

  Record the plugin-scoped name form that actually works.

**4. BLOCKER: A5 duplicates the sibling's agent-membership lint and spec requirement.**
- Evidence: sibling design D5: "[repo_lint] gain the agent equivalents: every `agents/*.md` stem in
  exactly one bundle; every listed agent has a file". Sibling TC-10 tests no bundle, two bundles, and a
  listed agent with no file. A5 here re-implements exactly these three messages
  (design.md:190, three of its five tests). This PLAN's catalogue-governance delta ("An agent SHALL be
  listed in exactly one bundle in `bundles.yaml`…") also restates the one-bundle rule. The sibling
  places that rule in `catalogue-governance` too (sibling D1), and it lands first. The result is two
  checks and two requirements for one fact.
- **Fix:** A5 keeps only what is new: "bundle lacks the primary skill" and "no local primary skill".
  Read membership through the sibling's `tools.bundle_gen.gen.load`, not a new `_bundle_agents`
  parser. The spec delta keeps only the primary-skill clause and cites the sibling's requirement for
  "exactly one bundle". Delete the three duplicate negative tests.

**5. BLOCKER: the `scheduled` type has no real rendering, and the first consumer needs a type this
standard forbids.**
- Evidence:
  - D-9 `scheduled` / Claude: "run by a scheduler outside the agent file … no frontmatter". So the
    `type: scheduled` frontmatter that DEC-3 mandates renders to *nothing* on Claude.
  - Vault assessment §4: "scheduled tasks load skills, not agents".
  - `add-sales-bundle` DEC-2 says the sales agent is "type `scheduled` (daily grooming) **with a
    `lead`-style interactive mode**". D-8, however, rejects dual-mode ("a lead that is also spawnable
    needs two Input shapes, which breaks the one-contract rule").
  - `add-sales-bundle` also says it has "no changes to `agent-authoring-standard` from here", and it
    targets a capability `agent-authoring` (its line 108) that D-1 folds away.
- **Fix:** give `scheduled` a concrete Claude rendering that loads the agent file. `claude -p --agent
  <plugin>:<name> "<trigger prompt>"` run by cron, a CI schedule or a Cowork/Desktop task is the
  verified mechanism. Give opencode the equivalent `opencode run --agent <name>`, and record a gap only
  where none exists. Then make one of two decisions:
  - (a) Allow `type` to be a list, or allow `scheduled` to carry an interactive contract, and say how
    the dispatch contract states both triggers.
  - (b) Rule that a scheduled-plus-interactive need is two agents.

  Write the decision down, and tell `add-sales-bundle`, whose DEC-2 contradicts this EPIC today. Also
  correct `add-sales-bundle`'s reference to the `agent-authoring` capability, or note the D-1 rename in
  that EPIC's inputs. That EPIC is not ours to edit, so record it as a coordination item.

## C. MAJOR

**6. MAJOR: D-5 is factually wrong about plugin agents. `permissionMode`, `hooks` and `mcpServers`
are ignored when an agent ships in a plugin.**
- Evidence: "For security reasons, plugin subagents don't support the `hooks`, `mcpServers`, or
  `permissionMode` frontmatter fields. These fields are ignored when loading agents from a plugin" (sub-agents
  page). `initialPrompt` is ignored for plugins too. Skillery ships agents only as plugins. Yet D-5 says
  "first candidate: `plan` for read-only agents", and the Risks row says "`permissionMode: plan` is the first
  candidate row". The vault's infra-ops suggestion of `permissionMode: default` is impossible on that
  route as well.
- **Fix:** add a "plugin-ignored" column to the D-5 table and the template's field-adoption table, and
  make the plugin restriction the stated reason for these three rows. Rewrite the `code-reviewer`
  `Bash` risk mitigation: tool-level `disallowedTools: [Bash(git commit *)…]` does not work either,
  because "an entry with a specifier … still removes the whole tool". The honest mitigation is "record
  the residual risk".

**7. MAJOR: on opencode, `skills:` does not exist, and `color` names are invalid. D-5 and mapping.md
both state false facts.**
- Evidence: the opencode agent options are description, temperature, steps, disable, prompt, model,
  tools (deprecated), permission, mode, hidden, task permissions and color. "Any other options you
  specify in your agent configuration will be passed through directly to the provider as model
  options". There is no `skills` field (opencode.ai/docs/agents). `color` takes a hex value or a theme
  colour (`primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info`), not
  `yellow`/`cyan`/`blue`.
- D-5 says "`skills:` preloaded in full | opencode `skills` list" and "`color` … mapped 1:1".
  `mapping.md:32` says "`skills: […]` | opencode agent `skills` list". The mapper emits both raw. This
  path has never run: the sibling states "agents are never installed on opencode today".
- Consequence: on opencode an agent's skills are **not preloaded**, so a thin body that says "follow
  `cosmic-python`" relies on the agent calling the `skill` tool. `TOOL_NAMES` has no `Skill → skill`
  mapping, and `AskUserQuestion → question` exists as a permission key, so the current "gap" is stale.
- **Fix:**
  - Correct the D-5 rows.
  - The mapper stops emitting `skills` and appends a one-line "Load these skills first: …" to the
    rendered body instead. Alternatively, record "skills not preloaded on opencode" as a gap. Decide
    which; do not keep the false row.
  - Map `color` to a theme colour, or drop it with a gap.
  - Lint `color` against Claude's closed set (`red, blue, green, yellow, purple, orange, pink, cyan`),
    which also catches the documenter note's `magenta`.
  - Map `Skill → skill` and `AskUserQuestion → question`.
  - Make task 5.5 check that the agent actually loaded its skills on opencode.

**8. MAJOR: `type: lead` does not stop Claude spawning `epic-planner` as a subagent, which is the
very failure D-8 cites.**
- Evidence: every Claude agent file is also a delegation target, picked by `description`. Subagents
  lose `AskUserQuestion` ("The first filter removes these tools, even when listed in the `tools` field:
  … `AskUserQuestion`", sub-agents page). The re-cut description says "Use when starting or refining an
  epic", so the main thread will still auto-delegate it. opencode `mode: primary` prevents this; Claude
  has no per-file equivalent.
- **Fix:** the `lead` row of D-9 must state the Claude limit. The template must require lead
  descriptions to say "Start a session as this agent (`--agent`); not for delegation." Change the
  epic-planner description to match. Record the asymmetry as a Claude gap in mapping.md.

**9. MAJOR: the implementer's GitNexus glue makes it unusable in repos without GitNexus, and
contradicts the reviewer's policy.**
- Evidence: the re-cut `## Glue` says "If GitNexus is unavailable, stop and return that as the result".
  `meaningfy-code-review` §Review procedure step 4 says "If gitnexus is unavailable, warn and proceed".
  The old body said "proceed only after acknowledging". Nothing in the EPIC records the change to
  "hard stop always", and most consumer repos are not GitNexus-indexed.
- **Fix:** align with the skill: "If GitNexus is unavailable, proceed and state in the Output that no
  impact check ran." Keep "HIGH/CRITICAL → stop". Better still, move the impact-gate rule into the skill
  that owns code-change discipline (`cosmic-python` or `meaningfy-code-review`) and leave one pointer
  line, so both agents cite one owner.

**10. MAJOR: agent memory is rejected against the human's own assessment, with no recorded
override.**
- Evidence: vault assessment §3.7: "for build agents, native agent memory is reasonable". The refinement
  note `implementer.md:155` reads "Update `MEMORY.md` if any stable patterns or conventions were
  discovered". D-5 marks `memory` "**rejected** for build agents". The re-cut drops pattern capture
  entirely. The spine owns *task records*; it does not own *learned conventions*, so the stated reason
  does not cover the dropped job.
- `memory` is not plugin-ignored, so it is adoptable.
- **Fix:** either adopt `memory: project` on `implementer`, which is one field with a mapper gap row, or
  keep the rejection but add a re-shape-style record: "diverges from vault assessment §3.7 because …".
  Also record where pattern capture now lives. If nowhere, say so as a deliberate drop.

**11. MAJOR: the appetite says "one lint rule". The PLAN adds seven functions and about 20 negative
tests (Ponytail).**
- Evidence: proposal Appetite and Solution 3 say "a lint rule". design.md:184-193 adds A1–A5, A7 and
  A8, plus helpers and three constants.
- A2 (description) and the cap and contract parts of A1/A3/A4 are all per-file frontmatter/body
  checks. A8 is `body_agnosticism` with a second glob.
- **Fix:** collapse to:
  - one `agent_conformance(repo)`: fields, type, colour, description, body cap, contract labels,
    CLI-isms;
  - the primary-skill clause added to the sibling's membership check (finding 4);
  - `body_agnosticism` extended to `agents/*.md` (no new function);
  - optionally A7.

  Keep one negative test per message, not per field variant. This cuts the work roughly in half with
  the same coverage.

**12. MAJOR: who holds the standard is unclear between the template, the spec delta and the lint, so
the cap of 40 is written in three places.**
- Evidence: the proposal calls `spec/agent-template.md` "the one canonical home". But the
  catalogue-governance delta restates the full field allowlist, the 40-line cap, the four labels and
  the CLI-ism rule as SHALLs. Those SHALLs become the living truth at archive (`spec-stewardship`:
  truth = `openspec/specs/`). D-2's table omits the spec entirely.
- **Fix:** add the living spec to D-2. Then either:
  - (a) the spec requirement says "SHALL conform to `spec/agent-template.md`" and its scenarios carry
    the concrete examples, or
  - (b) declare the spec normative and the template a guide derived from it.

  Pick one; the proposal's "one canonical home" claim is false as written.

**13. MAJOR: task 7.3's acceptance check cannot work, and the scope it touches conflicts with
`skill-crafting-method`.**
- Evidence: `git status` shows `?? docs/development-method.md`, so the file is untracked. "`git diff
  --stat` on it ≤ 8 lines" therefore always prints nothing.
- `skill-crafting-method/proposal.md:97` says "Do not rewrite `docs/development-method.md` during half
  one. It is the thing being measured".
- Task 7.3 also leaves other restatements of the template in place: §2 principle 2, the §4 "Skills, not
  knowledge" and "Tests in Gherkin" bullets, §4 "Model names are family aliases", the §5 "Every agent"
  bullets and the §9 DoD agent line.
- **Fix:** shrink task 7.3 to the smallest edit:
  - §4 status sentence → link to the template;
  - §8 row → live link;
  - §5 "bundle in frontmatter" → "bundle in `bundles.yaml`" (now false).

  Record the remaining restatements as accepted derivations until `skill-crafting-method` half two
  reduces the doc. Replace the acceptance check with a stated diff: show the before/after lines in the
  PR, or snapshot with `cp` before editing and `diff` after.

**14. MAJOR: the dual-cli-generation delta names a component that will no longer exist.**
- Evidence: the requirement says "The generator SHALL render an agent's `type` as the opencode `mode`".
  After the sibling, the opencode agent file is rendered by the installer (`renderAgent`), not by a
  generator. The living requirement "Agent frontmatter mapping" (openspec/specs/dual-cli-generation:36)
  already owns field mappings, and the sibling is rewriting that spec in parallel (its D1 assigns
  "what is rendered, when" to `dual-cli-generation`). D-1's rationale "ADDED so it cannot collide" still
  produces two requirements about agent field mapping.
- **Fix:** word the requirement against "the opencode agent renderer". Ask the sibling to fold the
  `type → mode` row into its MODIFIED "Agent frontmatter mapping". Keep this delta only if the sibling
  declines, and record that coordination.

**15. MAJOR: the docs that describe old agent behaviour are left stale. The grep found more callers
than tasks 7.x reach.**
- Evidence:
  - `README.md:67-71`: "An agent is a *delegated worker* … each just load the relevant skills and run
    them in isolation". The build-loop table, rows 1–3 (README.md:95-97), says steps are "Driven by
    **epic-planner** agent", which reads as delegation.
  - `docs/environment/setup.md:144`: "`epic-planner` | thin wrapper loading `epic-planning` +
    `clarity-gate`".
  - `docs/ai-coding/build-lifecycle.md:101-102,256`: "(epic-planner agent)".
  - `build-lifecycle.md:143` says the AI "fixes the spec … on design-level failures", while the re-cut
    implementer *refuses* writing the PLAN and only proposes the fix. Nothing states who applies it.
- **Fix:**
  - Extend task 7.2 to the whole README "Skill or agent?" block and the build-loop "Driven by" cells
    (e.g. "your session as **epic-planner** (lead)").
  - Add one task for `setup.md` §6 and `build-lifecycle.md:143`/`:256`.
  - Add to the implementer contract: "Output: proposed spec fix; the caller (or epic-planner) applies
    it."

**16. MAJOR: the CHANGELOG and README do not give a runnable command.**
- Evidence: task 8.1 says "start your session as it". The plugin-scoped name is
  `meaningfy-building:<agent>` (mapping.md:33; agent names "can't contain `:`, which is reserved for
  plugin-scoped identifiers"). A user needs the literal command.
- **Fix:** after the load test in finding 3, write the verified literal
  (`claude --agent meaningfy-building:epic-planner`; opencode: Tab to `epic-planner`, or
  `opencode --agent epic-planner`) into the CHANGELOG line and the README paragraph.

**17. MAJOR: the `code-reviewer` trigger change is unrecorded and changes delegation behaviour.**
- Evidence: the note and the current description say "Use proactively after implementation, before
  opening a PR". The re-cut says "Use when a caller fans out a pre-PR review, one code-reviewer per
  lens" and refuses any dispatch without a lens. A plain "review my change" from the main thread now
  costs a refused round-trip, unless the main thread has loaded `meaningfy-code-review`.
- Refusing is correct, because a subagent cannot ask (finding 8 quote). But the user-visible change
  needs a CHANGELOG line and a D-n.
- **Fix:** add a D-n ("no-lens dispatch → refusal; the main thread follows `meaningfy-code-review`
  §Dispatch contract to fan out"). Add the CHANGELOG line. Add a README invocation example, which is
  also required by dev-method §5: "One example invocation in the README's build-loop or bundle table"
  for every agent. No task produces those three examples today.

## D. MINOR

**18. MINOR: the 40-line cap is anchored on the defect it criticises.** The cap equals `implementer`
(40 lines), the body the EPIC calls over-weight, while the re-cut targets are 15–24. Measured with
`len(body.strip("\n").splitlines())`: implementer 40, code-reviewer 33, epic-planner 22, which
matches the design. **Fix:** either keep 40 with the rationale "room for `scheduled` contracts (trigger
+ run record + reversibility)", or set 30 = the re-cut target. Pick and justify by the consumer that
needs headroom, not by the old body.

**19. MINOR: A7's substring test is brittle.** "names every `skills:` entry" passes on any occurrence,
including comments (the Error matrix accepts this), and on a prefix (`clarity-gate` inside
`clarity-gate-lite`). **Fix:** match the Background line only, using
``Given the <a> agent is installed with skills `…` ``, and backtick-delimited names.

**20. MINOR: A1 does not specify `tools` given as a string.** Claude accepts the comma-separated
string form (`tools: Read, Grep`). Say whether lint accepts or rejects it, and add the message.

**21. MINOR: task 7.4's acceptance check is unrelated.** `agents_canonical_invariant` checks
symlinks and the CLAUDE→AGENTS pointer, not the table row. **Fix:** "`broken_links` clean; row text
contains the link".

**22. MINOR: the same rule text is in two tables.** Task 1.2 and task 7.4 write near-identical "Thin
wrapper: one job, declared type, dispatch contract…" into both `spec/skill-repo-governance.md` and
`AGENTS.md`. **Fix:** one of them links to the other, or both say only "see
`spec/agent-template.md`".

**23. MINOR: "deterministic before prose" lands in the template, while the vault asked for governance.**
Vault §3 gap 3: "add a third leg, *'deterministic before prose'*" to governance rule 2. D-6 puts it in
the template only. That is defensible (one home), but record the choice.

**24. MINOR: two items from the refinement notes are dropped without a record.**
- `epic-planner.md:148` "Update the epic status" (no spine equivalent; say so).
- `implementer.md:112` "run architectural validation (`importlinter`)" (owned by `cosmic-python:94`;
  add it to the Moves list).

Also, the re-cut implementer `Output` does not mention step definitions, although the README step 5
says the implementer writes them. Add them to Side effects.

**25. MINOR: the per-CLI rendering table exists in two homes.** It sits in the template (*Types and
per-CLI rendering*) and in `mapping.md` (task 7.1). D-2 gives mapping.md "per-CLI rendering rows".
**Fix:** the template states the types and the contract extras; the rendering columns live only in
mapping.md and are linked.

**26. MINOR: the sibling still describes this EPIC's old DEC-5.** `single-source-distribution/design.md:52-53`:
"The agent `bundle:` frontmatter field and its lint are `agent-authoring-standard`'s (its DEC-5)". That
is stale against the re-shaped DEC-5. Add a coordination note to the sibling's architect; it is not
ours to edit.

---

## Clarity-gate score (reviewer's, PLAN = design.md + tasks.md)

| Criterion | Weight | Score | Why |
|---|---|---|---|
| Actionability | 25% | 6.5 | Tasks 2.2/4.x point at code the sibling deletes; task 1.1's gate fails; the lead epic-planner cannot run `/opsx` |
| Specificity | 20% | 8 | Messages, tests and target files are concrete; `scheduled` rendering and plugin field limits are not |
| Consistency | 15% | 5.5 | Contradicts the sibling (mapper, membership lint, spec ownership) and `add-sales-bundle` DEC-2; SSoA claim false (template vs spec vs lint) |
| Structure | 15% | 9 | Well organised; tables, error matrix and test specs present |
| Disambiguation | 15% | 7 | Facts about vendor behaviour are wrong (opencode `skills`/`color`, plugin `permissionMode`); A-2/A-3 left open although checkable |
| Reference clarity | 10% | 8 | Deep links good; several point at files that will not exist after A-1 |
| **Weighted** | | **7.2 / 10 — Not ready** | Resolve 1–5 and 6–7 to reach ≥ 9 |
