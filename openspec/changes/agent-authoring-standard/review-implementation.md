# Implementation review — agent-authoring-standard

Independent review of the uncommitted working tree on `feat/single-source-and-agent-standard`
(2026-10-26), on top of the reviewed `single-source-distribution`. All lenses were applied in one
pass. Spec of record: `proposal.md`, `design.md` (incl. Review disposition and Implementation notes),
`tasks.md`, `specs/`, `inputs/2026-03-16-agent-refinement-notes/`, and the sibling's Cross-EPIC contract.
Mutations ran only in a scratch copy
(`/tmp/claude-1000/-home-lps-work-repos-skillery/7d80249e-89d8-4b2e-b995-1588aa303c28/scratchpad/review-aas/`).

**Verdict: PASS-WITH-FIXES.** There are no blockers. One MAJOR finding (F-1) must be fixed before
merge. The MINOR findings are cheap; fix them now or record them as follow-ups.

## Gates (run fresh in this review)

| Gate | Result |
|---|---|
| `make validate` | rc 0 — lint OK, 129 passed (7 deselected = `docker` marker, `pytest.ini`) |
| `npm run test:opencode-installer` | rc 0 — 24/24 |
| `make bundles` ×2 | rc 0 both times; `git status` and md5 of `marketplace.json` / `opencode-catalogue.json` identical |
| `openspec validate agent-authoring-standard --strict` | "Change 'agent-authoring-standard' is valid" |
| `claude plugin validate .` (2.1.310) | "Validation passed" (marketplace) |
| Clean scratch copy, `python -m tools.repo_lint <copy>` | "OK — repository self-consistent" |

## Lint mutation results (scratch copy, `agents/code-reviewer.md` unless noted)

| Mutation | Result |
|---|---|
| `## Dispatch contract` → `## Contract` / `### Dispatch contract` | `no '## Dispatch contract' section` ✔ |
| `**Refuses:**` moved outside the section | `dispatch contract has no '**Refuses:**'` ✔ |
| body 41 lines / 40 lines | `body is 41 lines (> 40)` ✔ / clean ✔ |
| `type: worker` / no `type` | `type 'worker' is not one of delegated, lead, scheduled` ✔ / `missing required frontmatter field 'type'` ✔ |
| unknown skill `cosmic-pythn` | `agent_skill_alignment: … lists unknown skill` ✔ (+ M17) |
| no `description` / no "Use when" | M1 ✔ / M8 ✔ |
| `bundle: x`, `tools` as string, `color: magenta`, name mismatch, lead without "Not for delegation", `.claude/` in body | M2, M6, M7, M3, M10, M14 ✔ |
| feature without skill / without Outline | M17 ✔ / M16 ✔ |
| no local skill / primary skill in another bundle | P2 ✔ / P1 ✔ |
| pinned model `claude-opus-4-8` | reported **twice** (F-3) |
| `type: [delegated]` / `color: [yellow]` | **TypeError traceback** (F-2) |
| a fenced ```` ``` ```` block containing `## x` inside the contract | **all four labels reported missing** (F-4) |
| "two jobs" in the description | not checked. This is by design: DEC-2 is not linted. |

`MAX_AGENT_BODY_LINES` has one home, `lint.py:649`. The template names the constant and states no
number (`grep -nwE 40` is empty). The tests read `lint.MAX_AGENT_BODY_LINES`.

## Findings

### F-1 · MAJOR · opencode body line names skills that cannot resolve on opencode
**Evidence.** `renderAgent` (`tools/opencode-bundle-lib.mjs`) prints the `skills:` entries verbatim.
For `implementer` the rendered line is ``Load these skills first with the skill tool: `cosmic-python`,
`stream-coding`, `superpowers:test-driven-development`, `superpowers:systematic-debugging`,
`superpowers:verification-before-completion`.`` Per opencode.ai/docs/skills, a skill name must match
`^[a-z0-9]+(-[a-z0-9]+)*$`, so a colon is impossible. superpowers' opencode install
(`docs/README.opencode.md`) registers bare names (e.g. `brainstorming`). D-15's claim ("mapped, not
gapped: the skills still load") is therefore false for three of `implementer`'s five skills on opencode.
**Fix.** In the body line render `s.slice(s.indexOf(":") + 1)`: for a name without a colon,
`indexOf` returns -1, so the whole name is kept. Add an assertion to TC-11, e.g. `superpowers:x` →
`` `x` ``. Alternatively, push a gap per namespaced skill. Stripping the prefix is the smaller option.

### F-2 · MINOR · validator crashes on a non-scalar `type` or `color`
**Evidence.** `type: [delegated]` gives `TypeError: cannot use 'list' as a set element` at
`lint.py:674`, and `color: [yellow]` gives the same at `:678`. The validator still exits non-zero, but
with a traceback instead of a message, and every later check is lost.
**Fix.** Guard both checks with `isinstance(fm[k], str)`, or compare `str(fm[k])`. Add one negative
test.

### F-3 · MINOR · error-matrix branches untested; the alias error is reported twice
**Evidence.** A pinned model gives both `agent_conformance: … frontmatter is rejected (… unknown model
alias …)` and `bundle_gates: … unknown model alias …`. The design (D-3, finding 11) says the alias
check is the sibling's and is "not re-checked here". No test covers the `frontmatter is rejected`
branch or the `has no 'agentModes'` branch (`grep` in `tests/` finds neither).
**Fix.** Add the two negative tests. Accept the duplicate and say so in Implementation notes §4, or
let `agent_conformance` skip a file whose rejection is an alias error.

### F-4 · MINOR · lint precision (dispatch regex, M8, M16/M17, label order)
**Evidence.**
- The section regex `^## Dispatch contract[ \t]*$(.*?)(?=^## |\Z)` ends at a `## ` line inside a
  fenced block. The mutation above shows all four labels reported missing.
- M8 uses a plain substring, so "because when" satisfies "use when".
- M16 and M17 match anywhere in the `.feature` file, including comments and non-Background lines.
- The template says the four labels appear "in this order", and nothing checks the order.

**Fix.**
- Use `re.search(r"\buse when\b", desc)` for M8.
- Take M17's line only from the `Background:` block.
- Either enforce the label order or drop "in this order" from `spec/agent-template.md`.
- The fence case can stay accepted, since no agent uses fences. Note it as accepted.

### F-5 · MINOR · `implementer` contract contradicts itself on the PLAN
**Evidence.** **Side effects** says it "ticks its `tasks.md` checkbox". **Refuses** says "editing the
PLAN". PLAN ≡ `design.md` + `tasks.md` (`epic-planning` line 16).
**Fix.** Change Refuses to "editing the PLAN beyond ticking its own task, or `.feature` files". This
is a one-line edit in `agents/implementer.md` and the design target.

### F-6 · MINOR · on opencode the `tools` list is not an allowlist
**Evidence.**
- opencode.ai/docs/tools: "By default, all tools are **enabled**".
- opencode.ai/docs/agents: `tools` is "deprecated", and `true` is equivalent to `{"*": "allow"}`.
- The rendered `tools: {"read":true,…}` therefore restricts nothing. Only the `disallowedTools` →
  `permission: deny` mapping restricts anything. `code-reviewer` stays read-only on opencode, because
  `edit: deny` also covers `write` and `apply_patch`.
- The allowlists differ between the CLIs: `epic-planner` and `code-reviewer` get `webfetch`,
  `websearch`, `question` and `todowrite` on opencode, and the Claude allowlist does not give them
  these.
- New governance rule 2 says an agent is kept when it "needs a model/tool restriction that must hold
  on both CLIs". That holds for denials only.

**Fix.** Now: record a gap G-6 in `mapping.md` ("a Claude `tools` allowlist is not restrictive on
opencode; only `disallowedTools` is"). Follow-up: render the allowlist as permissions.

### F-7 · MINOR (advisory) · the known suspect — `code-reviewer`'s missing `skill` tool — is not a defect
**Evidence.**
- opencode enables all tools by default (docs/tools).
- `skill` is a built-in tool. It is switched off only by `tools: skill: false` or `permission.skill`
  (docs/skills, docs/agents).
- The rendered `code-reviewer` lists neither, so the skill tool stays enabled.
- `permission.skill` is not emitted, so it plays no part here.

**Fix (hardening, one line).** When `skills` is non-empty, `renderAgent` sets `tools.skill = true`.
The body line then never depends on an unstated default, and it survives the F-6 follow-up.

### F-8 · MINOR · Claude-side skill preload is plausible but unverified (6.1 deferred)
**Evidence.**
- code.claude.com sub-agents says preloaded skills are "injected … at startup". The docs say to use
  `skills` "rather than listing `Skill`" in `tools`. So preloading for `code-reviewer`, which has no
  Skill tool, is supported.
- The docs say a field Claude does not recognise is ignored without an error, so `type:` is harmless.
  `claude plugin validate .` passes.
- The docs do not say how a plugin agent's bare `skills:` names resolve to its plugin's skills. They
  do say a missing skill is "skip[ped] and log[ged] … to the debug log". If resolution fails,
  `code-reviewer` would run with no method and no Skill tool to recover.

**Fix.** Keep 6.1 as a merge gate. When it runs, ask the dispatched `code-reviewer` to quote a line
of `meaningfy-code-review` to prove the preload, or check `claude --debug` for `does not recognize`
and skipped-skill warnings.

### F-9 · MINOR · `epic-planning` still assumes a live dialogue
**Evidence.** `skills/epic-planning/SKILL.md` steps 1–2 say `/opsx:explore`, `superpowers:brainstorming`
and "one concern at a time … confirm". The question-round format exists only in
`agents/epic-planner.md` **Output**. D-8 accepts this ("the skill wins on order"). Even so, a
delegated run that follows the skill "end to end" meets dialogue instructions it cannot carry out.
No other repo artefact relies on the old asking behaviour. README, CHANGELOG, `build-lifecycle.md`,
`setup.md` and `opsx-runbook.md` are consistent, and `prompts/`, `.claude/` and `hooks/` do not name
the agents.
**Fix.** Follow-up (outside this EPIC's no-go): add one line to `epic-planning` step 2, "when run
delegated, return the open concerns as one round (see the agent's dispatch contract)".

### F-10 · MINOR · cosmetic: the rendered description keeps the trailing newline of the folded scalar
**Evidence.** It renders as `description: "Reviews a change … discussing findings.\n"`.
**Fix.** Use `String(description).trim()` in `renderAgent`. This is the sibling's line, but it is
trivial to fix here.

## Traceability

- **Delta-spec scenarios.**
  - `catalogue-governance`: all 11 have tests (M1–M17, P1/P2 and `test_agents_conform_to_standard`).
    All 18 named negative tests exist exactly once.
  - The pinned-model half of "unknown type or pinned model" is tested only on the sibling side
    (`test_bundle_gen.py:202`); see F-3.
  - `dual-cli-generation`: delegated is covered by TC-14 (`mode: "subagent"`, gaps exactly the two
    tools). Lead, scheduled and missing type are covered by TC-08, TC-09 and TC-10 (TC-10 includes
    "nothing written").
- **Design TCs.** TC-01…TC-12 are covered, including TC-04 (leading blank lines), TC-05 (a label
  outside the section) and TC-06 (backtick prefix).
- **Ticked tasks.** Spot-checked true:
  - 1.1: comment present.
  - 1.2: greps empty, sections in order.
  - 1.3, 7.4: links.
  - 4.1: one-line diff.
  - 5.3: `bundle: x` gives M2.
  - 7.1: stale phrase gone.
  - 7.3: `until it lands` = 0, `bundle in bundles.yaml` = 1, link ×2.
  - 7.5, 8.1: under 3.0.0 per deviation 9.
  - 8.2: count = 0.

  6.1, 6.2, 9.1 and 9.2 are unticked, and the notes give honest reasons.
- **Gherkin** (`tests/features/agents/`). Each file has a `# Traces to:` header, the Background skill
  line, an Outline with Examples (values in the tables, variables in the steps), and the plain
  scenarios the design table names. All three conform.

## Faithfulness and docs

- **The three re-cuts** match the design target files verbatim. Body sizes are 15, 20 and 25 lines.
  Each agent has one job, and the refinement notes' content is mapped per each Moves paragraph:
  - checklists go to the skills;
  - `<example>` blocks are dropped;
  - `MEMORY.md` becomes "conventions noticed";
  - commit-on-consent becomes Refuses.

  Both agents' impact checks must go through the GitNexus CLI (`gitnexus impact`) via Bash, because
  a Claude `tools` allowlist excludes MCP tools. The body wording ("the project's GitNexus impact
  check") is neutral and correct.
- **Docs.**
  - `spec/agent-template.md` is the single home.
  - The governance doc, the `AGENTS.md` Agent row and `development-method.md` (three pointer hunks)
    point to the template and do not restate it.
  - `mapping.md`'s opencode facts are corrected (`skills`, `color`, type rows, G-1…G-5). It lacks G-6
    (F-6).
  - The README agent paragraph and examples, and the CHANGELOG 3.0.0 lines, match the behaviour.

## Not checked

- No live agent dispatch on either CLI: there is no login in a scratch config, and the `opencode`
  binary is absent.
- The F-1 claim about superpowers' bare names on opencode rests on its README, not on a run.

## Fix disposition

Applied 2026-10-26 by the builder (lead decision: fix all findings, test-first where code changed;
no commit). Gates after the fixes:
- `make bundles`: run twice, identical (sorted link listing + the three JSON files).
- `make validate`: lint OK, 137 passed.
- `npm run test:opencode-installer`: 25/25.
- `openspec validate agent-authoring-standard --strict`: valid.

| Finding | Fix | Test (watched fail first unless noted) |
|---|---|---|
| F-1 MAJOR | `renderAgent` strips the namespace from each name in the load-skills line (`s.slice(s.indexOf(":") + 1)`) | new TC-11 case: `superpowers:x` renders as `` `x` `` |
| F-2 | `agent_conformance` reports M4/M7 for a `type` or `color` that is not a string, instead of raising a `TypeError` | `test_agent_non_string_type_and_color_are_flagged_not_crashing` |
| F-3 | `agent_conformance` skips a file whose rejection is an unknown model alias, so `bundle_gates` reports it once. Both error-matrix branches are now tested | `test_agent_pinned_model_is_left_to_bundle_gates` (red first). `test_agent_map_without_agent_modes_is_reported_once` and `test_agent_unparsable_frontmatter_is_reported` cover existing branches, so they passed on first run |
| F-4 | Fenced blocks are removed before the section search. The four labels must appear in template order. M8 uses `\buse when\b`. M16 ignores comment lines, and M17 reads only the `Background:` block. The template keeps "in this order", which is now checked | `test_agent_fenced_heading_does_not_end_the_contract`, `test_agent_contract_labels_out_of_order_are_flagged`, `test_agent_use_when_needs_word_boundaries`, `test_agent_feature_skill_named_outside_background_is_flagged` |
| F-5 | The `implementer` **Refuses** line now reads "editing the PLAN beyond ticking `tasks.md` checkboxes, or `.feature` files", in the agent and in the design target. The body is 26 lines, within the 30 re-cut target | `test_agents_conform_to_standard` |
| F-6 | `mapping.md` records **G-6**: a Claude `tools` allowlist is not restrictive on opencode; only `disallowedTools` → `permission: deny` is. Governance rule 2 now says a tool restriction holds on both CLIs only as a denial | `broken_links` clean |
| F-7 | When an agent lists skills, `renderAgent` always sets `tools.skill = true` | new TC-11 case: `tools: [Read]` renders `{"read":true,"skill":true}` |
| F-8 | Task 6.1 stays a merge gate. It gains a note: quote a line of `meaningfy-code-review` from the dispatched reviewer, and check `claude --debug` for skipped-skill warnings | — |
| F-9 | `epic-planning` step 2 gains one wording line: when run as a delegated agent, it returns the open concerns as one question round to the caller instead of asking | `make validate` |
| F-10 | `renderAgent` trims the rendered `description` | new TC-11 case: `"Folded scalar.\n"` renders as `"Folded scalar."` |
