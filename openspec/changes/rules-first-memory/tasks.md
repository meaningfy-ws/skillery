**Type:** Implementation (PLAN, task list).

> Derives from: EPIC `rules-first-memory` ([`proposal.md`](proposal.md)); design in [`design.md`](design.md).

Two stages (DEC-9). Each stage is one feature branch off `develop`, one PR, merged on green CI.
Every code task is test-first: the failing test is written and seen failing before the code. Test
ids (T-n) are in design.md *Test cases*.

## 1. Stage 1: the mod, the bundle, `where`, `stats` and the replay

- [ ] 1.1 `tests/features/rules-first-memory.feature` (with `bdd-gherkin`): the scenarios *Setup
  visible* and *The 2026-11-11 failure no longer reproduces*, in business language. Satisfies
  `rules-first-routing` *Every Claude Code session starts with a rules block* and *The 2026-11-11
  failure no longer reproduces*.
- [ ] 1.2 Hook spike, then two plain mods per bundle (D-7, RISK-5). Spike: a throwaway plugin with
  two plain hooks files, loaded with `claude --plugin-dir` and an empty `CLAUDE_CONFIG_DIR`: both
  fire; a `SessionStart` hook's stdout reaches the context (the agent can quote it); a `PreToolUse`
  exit 2 on `Write` denies it and the agent sees the stderr. Recorded in `evidence/hook-spike.md`; a
  failure applies the matching error-matrix row before 1.5. Then `tools/bundle_gen/gen.py` per D-7.
  `tests/test_bundle_gen.py`: replace `test_two_mods_in_one_bundle_are_rejected` with "two plain
  mods render both hooks files" and "two modules mods are rejected" (T-10); update
  `test_real_core_plugin_names_the_hooks_file_and_no_types_and_navigator_keeps_its_own` to the two
  core hooks files. `docs/development/mods.md` (*Bundling*). Satisfies `catalogue-governance`
  *Skills are organised into role bundles with single ownership*.
- [ ] 1.3 The routing file and `where` (D-2, D-3). `skills/rulebook/assets/routing.md` with the five
  lines of D-2; the normalising compare as one function in `rules.py`; `cmd_where` prints the
  `routing policy:` line. `tests/test_rulebook.py`: `run()` sets `HOME`, `CLAUDE_CONFIG_DIR` and
  `XDG_CONFIG_HOME` to a temporary folder; `test_t20` updated for the new line; cases present via
  `CLAUDE_CONFIG_DIR`, present via `XDG_CONFIG_HOME`, present when wrapped and with `’`, missing,
  unreadable global file, missing `routing.md` (`unknown`), exit 0 in all (T-2).
  `skills/rulebook/references/commands.md` (*where* row). Satisfies `rules-first-routing` *Every
  Claude Code session starts with a rules block*.
- [ ] 1.4 The `stats` counts (D-4). `DENY_MARKER` and the two lines in `cmd_stats`; a `--from-file`
  fixture with two `add`, one `approve`, one `add --dry-run`, one `update --dry-run`, one
  `add --candidate`, one `cite`, two non-`rules.py` observations carrying the marker and one
  `GENERATION` observation carrying it (expect
  `rules written: 3`, `memory writes denied: 2`, T-9). `commands.md` (*Monitoring*);
  `skills/rule-steward/SKILL.md`: the weekly report shows the two counts. Satisfies `rule-learning`
  *Weekly stewardship reads usage from Langfuse*.
- [ ] 1.5 The mod (D-5, D-6). `mods/rules-first/hooks.json`, `rules-first.mjs`,
  `rules-first.test.mjs` with a fabricated `HOME`, `CLAUDE_CONFIG_DIR` and `XDG_CONFIG_HOME`: each
  row of the design's tool-call table; the block for the worked example; fail open for a missing
  `python3`, a missing `routing.md` and non-JSON stdin; `routing.md` resolves from
  `bundles/meaningfy-core/mods/rules-first/` (T-1, T-3 to T-7). `tests/test_rules_first_routing.py`:
  the mod source contains `DENY_MARKER`. `hooks.yaml`: intent `rules-first` (provenance
  `{ skill: rulebook }`, bindings `{ mechanism: mod, phase: quality, trigger: SessionStart }` and
  `{ mechanism: mod, phase: quality, trigger: PreToolUse(Write|Edit|MultiEdit) }`). `bundles.yaml`:
  `meaningfy-core` `mods: [no-poll-loops, rules-first]`. `make bundles`, `make mods`. Satisfies
  `rules-first-routing` *Memory writes of preferences are denied* and *The hook fails open*.
- [ ] 1.6 Docs. `docs/environment/rules.md`: what the block says, what the deny does, and that
  existing `feedback` and `user` notes are left for the owner to move (RISK-6);
  `docs/environment/dual-cli/compatibility.md`: the block as an opencode gap, the deny as not
  applicable (DEC-12, T-12). Satisfies `rules-first-routing` *opencode is handled by the policy and a
  recorded gap*.
- [ ] 1.7 The replay (acceptance, T-11). In a fresh scratch git repository, a Claude Code session
  with an empty `CLAUDE_CONFIG_DIR` (no global instructions, no memory, no marketplace plugins,
  `autoMemoryEnabled: true` set in its settings), `MEANINGFY_VAULT` unset, and `--plugin-dir` on this
  branch's `bundles/meaningfy-core`: the block shows; the agent's first reply names the missing vault
  and routing policy once and later replies do not repeat it; the owner types "in this repo never ask for commit, pr,
  or merge, just do these actions" and asks for a small change; the card row appears before the final
  summary; on approval `rules.py` writes `docs/rules/P-0001`; the session's memory folder holds no new
  note of any type. Recorded in `evidence/replay.md` with the date and the commit. A failed replay
  blocks the stage and goes back to D-6 or the deny message. Satisfies `rules-first-routing` *The
  2026-11-11 failure no longer reproduces*.
- [ ] 1.8 Close stage 1. `CHANGELOG.md` *Unreleased* line for installers; `make validate` green; PR;
  merge on green CI.

## 2. Stage 2: the routing sentence

Starts only when `delivery-process-and-tools` task 3.4 (its stage 3 PR) is merged into `develop`.

- [ ] 2.1 The routing sentence (D-1, D-2): appended to the rules bullet of
  `docs/environment/global-prompt.md`; one new last paragraph of the `.claude/` section of
  `skills/project-setup/assets/templates/agentic/AGENTS.md.tmpl`; `POINTER` in `rules.py` extended
  with it, and this repository's `- **Rules:**` line set to the new `POINTER`. No other line of
  either binding changes. `tests/test_rules_first_routing.py`: each of the four contains the routing
  sentence read from `routing.md`, normalised, and a failure names the file (T-8). `binding_size` stays green, else the error-matrix
  row applies. Satisfies `rules-first-routing` *The routing text has one home*.
- [ ] 2.2 Close stage 2. `CHANGELOG.md` line; `make validate` green; PR; merge on green CI.

## Roadmap

- [ ] 1.1 · [ ] 1.2 · [ ] 1.3 · [ ] 1.4 · [ ] 1.5 · [ ] 1.6 · [ ] 1.7 · [ ] 1.8 · (wait: `delivery-process-and-tools` 3.4 merged) · [ ] 2.1 · [ ] 2.2

1.3 and 1.4 touch separate code and may run in parallel with 1.2 once its spike is recorded; 1.5
needs 1.2 (two mods), 1.3 (`routing.md`) and 1.4 (`DENY_MARKER`); 1.7 needs 1.5.

## Verification

`make validate` green on each stage's PR (it runs the bundle, rulebook, mod and routing tests and
`openspec validate --strict`), plus `evidence/hook-spike.md` and a passed `evidence/replay.md`.
