# Evidence: docs and structure re-check (task 2.5, D-10)

Date: 2026-10-27. No model runs. This re-check read every file covered by each hand-written row of
the register ([§8 of the development method](../../../../../docs/development-method.md#8-where-things-live)).
For the folder rows (`folder/**`), that means every file below the folder. Each file was checked
against the method on five points:

1. one topic per view;
2. each fact stated once;
3. links resolve and still say what they promise (anchors were checked with a script);
4. no restated skill rules;
5. no stale content: `PURPOSE_OF`, `metadata.category`, `CLAUDE.md.template`, CLAUDE-canonical or
   symlink advice, install layouts from before 3.0, "human canon".

Small findings in files that no open change claims were fixed on branch `eval/docs-recheck`. A file
listed in an open change's `tasks.md` was not edited. Its findings went to that change's
`inputs/docs-findings-from-restructure-and-evaluate.md`. Larger findings in unclaimed files are
named for later.

Before = findings found; After = findings still open in that view after this batch (handed-off
findings stay open until the owning change closes them). The generated row
(`docs/skill-inventory.md`) is out of scope; its drift test passes in `make validate`.

| Item | Posture | Change | Eval | Model | Runs | Before | After | Cost | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| `README.md` | — | handed off to define-ai-domains: AGENTS-canonical restated (still open from the earlier hand-off), build-loop table restates `spine/workflows.md`, repo tree missing two `docs/` files, `.claude/HARD-QUESTIONS.md` tracking pointer, "canonical" wording | D-10 re-check | none | 0 | 5 | 5 | $0 | handed off |
| `AGENTS.md` | — | handed off to define-ai-domains: method restatement (still open from the earlier hand-off), `VERSION` single-source stated twice | D-10 re-check | none | 0 | 2 | 2 | $0 | handed off |
| `CLAUDE.md` | — | clean | D-10 re-check | none | 0 | 0 | 0 | $0 | kept |
| `docs/development-method.md` | — | provenance-note fields were stated twice, with different field lists. Principle 4 is now the one statement, and §9 links to it instead of to governance rule 1 | D-10 re-check | none | 0 | 1 | 0 | $0 | kept |
| `docs/roles-and-raci.md` | — | handed off to define-roles-and-raci: "Claude Code agent", links into in-flight change proposals, deferred `work-shaper` agent stated twice | D-10 re-check | none | 0 | 3 | 3 | $0 | handed off |
| `docs/environment/setup.md` | — | handed off to define-ai-domains: superpowers/ponytail install route contradicts `compatibility.md`, OpenSpec version given a second home, Claude-only forms in a CLI-agnostic page, CI/CD section outside the topic, migration history from before 3.0, earlier hand-off still open | D-10 re-check | none | 0 | 6 | 6 | $0 | handed off |
| `docs/environment/openspec-setup-guide.md` | — | handed off to define-ai-domains: AGENTS-canonical restated, stale "(v2)"/"EPIC-09"/"two-tier", broken anchor `#migration-claudememoryepics--spine`, layout restates `spine/README.md` | D-10 re-check | none | 0 | 4 | 4 | $0 | handed off |
| `docs/environment/vault-assistant.md` | — | clean | D-10 re-check | none | 0 | 0 | 0 | $0 | kept |
| `docs/environment/dual-cli/**` | — | handed off to define-ai-domains: hard-coded per-bundle counts in setup-claude Step 9, bundle tables repeat the README, dangling DEC/task ids in `compatibility.md`, installs pinned to `#develop` | D-10 re-check | none | 0 | 4 | 4 | $0 | handed off |
| `docs/ai-coding/**` | — | handed off to define-meaningfy-lifecycle (5: agent models restated, ownership table vs yaml, Claude-only wording, `#verb-roster` kramdown anchor, stale "(v2)"/five-agent note), define-delivery-release-lifecycle (3: "two-tier", coverage owner and 80% restated, layer direction restated), define-lifecycle-playbooks (1: four broken `#epic-tier-…--the-sdlc-loop` anchors) | D-10 re-check | none | 0 | 9 | 9 | $0 | handed off |
| `docs/ai-consulting/**` | — | handed off to define-ai-domains (Decision Package parts restated in six places; runbook §4 restates `discovery-flow.md` §3–6) and define-lifecycle-playbooks (technical-consultant "Your done") | D-10 re-check | none | 0 | 3 | 3 | $0 | handed off |
| `docs/ai-sales/**` | — | handed off to define-ai-domains: `engagement-lifecycle.md` H1 and "canonical" wording, link into an in-flight change proposal, pointer-only `semantic-layer-services.md` | D-10 re-check | none | 0 | 3 | 3 | $0 | handed off |
| `docs/engineering-standards/**` | — | fixed `documentation-standard.md`: it claimed to apply to skillery (whose `docs/` is Markdown) and listed `.claude/` as the home of EPICs/PLANs (now `openspec/`). Named for later: `testing-standard.md` restates the `project-setup` test taxonomy; `project-structure.md` restates `cosmic-python`/`project-setup`; `coding-prompt.md` is a 524-line second statement of the `cosmic-python` rules ("keep in step"); `documentation-standard.md` cites "DEC-3" with no link | D-10 re-check | none | 0 | 5 | 4 | $0 | kept |
| `docs/philosophy/**` | — | clean | D-10 re-check | none | 0 | 0 | 0 | $0 | kept |
| `spec/skill-repo-governance.md` | — | fixed: Binding home now includes the root `AGENTS.md`/`CLAUDE.md` (as in `AGENTS.md`); the stale validator list ("README inventory, template mirroring") now points to `ALL_CHECKS`; rule 1 links to method principle 4 instead of restating the provenance fields | D-10 re-check | none | 0 | 3 | 0 | $0 | kept |
| `spec/agent-skills-spec.md` | — | fixed: the stale "`metadata.category` is in use" now says `metadata` carries the six facets | D-10 re-check | none | 0 | 1 | 0 | $0 | kept |
| `spec/skill-template.md` | — | fixed: `category: <category>` (no skill carries it) replaced by the six facet keys | D-10 re-check | none | 0 | 1 | 0 | $0 | kept |
| `spec/CREATING_SKILLS.md` | — | fixed: the restated change path now links to method §3; the provenance pointer goes to method principle 4 | D-10 re-check | none | 0 | 2 | 0 | $0 | kept |
| `spec/agent-template.md` | — | fixed: the skeleton lacked the `metadata` facets that the contract table requires in practice | D-10 re-check | none | 0 | 1 | 0 | $0 | kept |
| `CONTRIBUTING.md` | — | fixed: the restated change path now links to method §3 | D-10 re-check | none | 0 | 1 | 0 | $0 | kept |
| `tests/ownership.yaml` | — | fixed: "the prose table in docs/ai-coding" now names `build-lifecycle.md` §7 | D-10 re-check | none | 0 | 1 | 0 | $0 | kept |
| `tests/trigger_probes.yaml` | — | named for later: `linkml-engineering` and `modelling-conventions` have no probe, which batch D (task 2.1) covers | D-10 re-check | none | 0 | 1 | 1 | $0 | kept |
| `facets.yaml` | — | clean | D-10 re-check | none | 0 | 0 | 0 | $0 | kept |

Totals: 23 rows; 56 findings. 12 were fixed, in 9 files. 39 were handed off to five changes.
5 are named for later.

`make validate` is green after the fixes: lint passes, and pytest reports 156 passed and
7 deselected.
