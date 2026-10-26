<!-- PLAN (tasks half). PLAN = design.md + this file. Document type: Implementation. Revision 3
     (clarity-gate: round 1 7.8/10, round 2 9.0/10 PASS; round-2 residual gaps closed here). -->

> Derived from EPIC: fix-accumulated-skill-defects (`proposal.md`); design in `design.md`. Each task
> cites the design section it executes. Gate for every task: `make validate` green at the end of the
> task. One feature branch off `develop` (`fix/accumulated-skill-defects`), one commit per task,
> conventional-commit messages. "Accept" lines are checked before the task is ticked.

## 0. Precondition

- [x] 0.1 Branch `fix/accumulated-skill-defects` from an up-to-date `develop`; run `make validate` and
      `npx @fission-ai/openspec@$(cat spine/openspec-version.txt) validate fix-accumulated-skill-defects --strict`.
      **Accept:** both green before any edit.
- [x] 0.2 Open the draft PR with the posture list from design Context (one line per skill, 12 skills).
      **Accept:** the PR body names each of the 12 skills with R, C or P, matching design Context.

## 1. Vault hub: `vault-conventions` (design A.1–A.3)

- [x] 1.1 Add *Project homes* to `skills/vault-conventions/SKILL.md`; update the Layout rows and the
      folder sentence. **Accept:** `grep -n "^## Project homes" skills/vault-conventions/SKILL.md`
      hits; the `07 Perso/` row names personal projects; the `04 Daily/` row names `<agent>/`.
- [x] 1.2 Add *Moving and deleting* (D-3, D-4). **Accept:** the section contains each of `.trash/`,
      "same name", "inbound", `memory: common`, `vault-files/_shared/`, "explicit" and the sync caveat
      for `.trash/` (design Risks).
- [x] 1.3 Add *Formatting* (D-7) and the company-memory clause for `07 Perso/`. **Accept:** the
      section lists the three checks and links `obsidian@obsidian-skills`.
- [x] 1.4 Update `references/project-files.md`. **Accept:** it names `artefacts/`, states that the
      root holds only the five standing files, and that the shape applies in both homes.
- [x] 1.5 Update `references/kinds.md` (D-6, design A.3). **Accept:** the `Required sections` column
      exists in the kinds table; `impact-filter` and `work-shape` rows carry the sections and
      properties of the spec delta; `meeting`, `impact-filter` and `work-shape` have the usual folder
      "the project's `artefacts/`"; `skill-change` lists the eight D-9 labels as required sections.

## 2. Vault cohort cites the hub (design B)

- [x] 2.1 `vault-resume`: replace the resolution wording with the Project homes citation.
      **Accept:** `grep -n "Project homes" skills/vault-resume/SKILL.md` hits.
- [x] 2.2 `vault-capture`: cite Project homes; non-standing notes go to `artefacts/`.
      **Accept:** `grep -n "as \`vault-resume\` does" skills/vault-capture/SKILL.md` is empty;
      `artefacts/` appears.
- [x] 2.3 `vault-project`: `new` step 1 resolves by Project homes and asks "personal?"; `close`
      resolves both homes and cites Moving and deleting. **Accept:** "List `01 Projects/`" is gone;
      `07 Perso/` and `private: true` appear in `new`; `close` cites Moving and deleting.
- [x] 2.4 `vault-promote`: the sections check, the `artefacts/` destination, the Moving and deleting
      citation, and the description change. **Accept:** "Obsidian CLI" is absent from the description;
      the body names "required sections"; step 3 no longer names `01 Projects/`.
- [x] 2.5 `vault-tidy`: the Moving and deleting citation, the two new plan flags, and the description
      change. **Accept:** "Obsidian CLI" is absent from the description; the body names `artefacts/`
      and `07 Perso/` in the plan rules.
- [x] 2.6 `vault-planning`: the weekly sweep covers both homes. Check `vault-daily`
      (`references/daily-note-format.md`) for a table directly below a text line, and fix it.
      **Accept:** `vault-planning` cites Project homes; the PR states the `vault-daily` result (fixed,
      or none found).
- [x] 2.7 Single-source check. **Accept:**
      `grep -rniE "file tools" skills/vault-*/` is empty;
      `grep -rnE "01 Projects/|07 Perso/" skills/vault-*/ --include=*.md | grep -v "^skills/vault-conventions/"`
      lists only lines that do not locate a project (folder-table copies, examples, the memory
      scope note), and each remaining line is quoted in the PR with that reason.

## 3. Vault setup (design C, A.4, D-5, D-5b, D-8, D-9)

- [x] 3.1 `assets/AGENTS.md`: the owner-request exception, the `artefacts/` exception, and the
      vault-first answers rule. **Accept:** the folder hard rule cites "Moving and deleting"; a hard
      rule contains "answered from this vault".
- [x] 3.2 Permissions (D-5): in `references/permissions-claude-code.md` and
      `references/permissions-opencode.md`, move `mv` and `rm` from deny to ask, and rewrite the
      "denied outright" sentence. **Accept:** neither file's deny list contains `mv` or `rm`; both list
      them under ask; `curl` and `wget` remain denied.
- [x] 3.3 Scheduler (D-5b): add `--disallowedTools "Bash(mv:*)" "Bash(rm:*)"` to both scheduled
      command lines in `references/scheduler.md`; add `opencode.scheduled.json` (deny `mv *`, `rm *`)
      to what `vault-setup` writes, and run the opencode scheduled line with
      `OPENCODE_CONFIG=opencode.scheduled.json` (D-5b). **Accept:** both Claude command lines carry the
      flag; the opencode line sets `OPENCODE_CONFIG`; `permissions-opencode.md` documents the file.
- [x] 3.4 Stale CLI-only statements (design A.4): `references/obsidian.md` opening paragraph and
      `references/final-check.md` row 7. **Accept:** `grep -n "only through the Obsidian CLI" -r
      skills/vault-setup` is empty; row 7 says recommended, not required.
- [x] 3.5 Add `assets/README.md` and the no-overwrite behaviour in `SKILL.md` (D-8); add the
      README/Layout comparison to `references/final-check.md`. **Accept:** the README's folder table
      equals the Layout table of `vault-conventions` row for row; `SKILL.md` states "never overwrites";
      the final check has a README row.
- [x] 3.6 Templates: add `assets/templates/impact-filter.md` and `assets/templates/work-shape.md`;
      realign `skill-change.md` to the D-9 labels. **Accept:** each new template's `##` headings equal
      its kind's required sections in `kinds.md`; `skill-change.md`'s headings equal the eight D-9
      labels in order.

## 4. Writing family (design D, D-10, D-11)

- [x] 4.1 `writing-antipatterns/SKILL.md`: U7 and U8 with two-domain examples; "Thirteen entries" →
      "Fourteen entries". **Accept:** `grep -n "^\*\*U7\.\|^\*\*U8\." skills/writing-antipatterns/SKILL.md`
      shows both; each has a semantic example and an SME/AI example; `grep -n "Fourteen entries"
      skills/writing-antipatterns/SKILL.md` hits.
- [x] 4.2 `references/inversion-matrix.md`: the A14 row (eight statuses) and full entry; A5 extended
      with acronyms. **Accept:** `grep -c "A14" skills/writing-antipatterns/references/inversion-matrix.md`
      ≥ 2; the A14 compact row has eight non-empty cells.
- [x] 4.3 The ten reference files: "U1–U6" → "U1–U8"; the eight genre files gain the A14 pointer row.
      **Accept:** `grep -rn "U1–U6" skills/writing-antipatterns` is empty; `grep -l "A14"
      skills/writing-antipatterns/references/*.md | wc -l` = 9 (eight genre files and the matrix).
- [x] 4.4 `executive-communication/SKILL.md`: the contractual line in "When NOT to use", the register
      step in "Start here", and the worked-example wording (design D). **Accept:** "When NOT to use"
      names quotation, SoW and tender; "Start here" names teach / decide / bind.
- [x] 4.5 `executive-communication/references/company-voice.md`: three registers with Bind, the
      brand-assets line, a Bind pair and an SME/AI pair, and the Technical example fix.
      **Accept:** `grep -rn "quietly disagree\|is defensible" skills/executive-communication` is empty;
      `grep -n "^### Bind" skills/executive-communication/references/company-voice.md` hits.
- [x] 4.6 `epic-planning/SKILL.md`: the work-shape boundary line. **Accept:** `grep -n "work-shape"
      skills/epic-planning/SKILL.md` hits in the Boundary section.
- [x] 4.7 `skill-creator` eval (DEC-4) on 4.1–4.5, with a quotation prompt and a board-paper prompt,
      before and after. **Accept:** results are in the PR. The quotation output states the bind
      register and does not impose the pitch structure. The board-paper output states the decide
      register and opens with the answer. A failed criterion reopens the task it traces to.

## 5. Method and intake (design F)

- [x] 5.1 `docs/development-method.md`: the defect-intake sentence and the posture paragraph.
      **Accept:** both present; the file grows by ≤ 8 lines (`git diff --stat`).

## 6. Probes (design E, D-12)

- [x] 6.1 Add the eight entries of design E to `tests/trigger_probes.yaml`. **Accept:** `grep -cE
      "^\s+near_miss_of:" tests/trigger_probes.yaml` ≥ 8.
- [x] 6.2 **Accept:** `grep -oP "near_miss_of: \K\S+" tests/trigger_probes.yaml | xargs -I{} test -d
      skills/{}` exits 0; `make validate` green.

## 7. Documentation crystallisation (design G, D-13)

- [x] 7.1 Recompute the claimed set and write `inputs/docs-redundancy-map.md`: the candidate list,
      the line total before, and one row per finding. **Accept:** every candidate file has at least
      one row or a "no finding" row.
- [x] 7.2 Apply the map to `docs/engineering-standards/coding-prompt.md`. **Accept:** its rows are
      closed; the file is shorter.
- [x] 7.3 Apply the map to `docs/engineering-standards/references/stream-coding-notes.md`.
      **Accept:** as 7.2.
- [x] 7.4 Apply the map to the remaining `docs/engineering-standards/**` files. **Accept:** their rows
      are closed.
- [x] 7.5 Apply the map to `docs/environment/dual-cli/*` (unclaimed files only) and
      `docs/environment/vault-assistant.md`. The vault-assistant edit includes pointers to Moving and
      deleting and to the README asset. If 7.1 finds `vault-assistant.md` claimed, those two pointers
      go to the hand-off in 7.7 instead. **Accept:** their rows are closed, and the two pointers are
      either in the file or in a hand-off.
- [x] 7.6 Apply the map to `docs/development-method.md`, `docs/philosophy/*` and `CLAUDE.md`.
      **Accept:** their rows are closed.
- [x] 7.7 Hand off the findings on claimed files to each claiming change's
      `inputs/docs-findings-from-fix-accumulated-skill-defects.md`. **Accept:** one file per claiming
      change that has findings; no claimed file appears in `git diff --name-only develop` except
      `docs/skill-inventory.md` and `CHANGELOG.md`.
- [x] 7.8 Record the line total after. **Accept:** the candidate-set total is lower than before,
      with task 5.1's growth included.

## 8. Release documentation (P2)

- [x] 8.1 `CHANGELOG.md` under Unreleased: Fixed / Added / Changed lines written for the installer,
      plus the vault-owner migration line (design Risks). **Accept:** the migration line names
      re-running `vault-setup` and the three local rules to remove.
- [x] 8.2 Run `make skill-inventory` and commit `docs/skill-inventory.md`. **Accept:**
      `tests/test_skill_inventory.py` passes.

## 9. Verification

- [x] 9.1 `make validate`, `make validate-spine` (this change passes; failures limited to other
      proposal-only changes are recorded) and `openspec validate fix-accumulated-skill-defects --strict`.
      **Accept:** all three as stated.
- [x] 9.2 Scratch vault, interactive Claude Code with the plugin from the branch:
      (a) "delete these two named notes", one with an inbound link, Obsidian closed;
      (b) a name collision;
      (c) `vault-project new` for a personal project.
      **Accept:** (a) both notes are in `.trash/`, the link is reported and the `mv` prompt appeared;
      (b) nothing moved and the collision is named; (c) the folder is in `07 Perso/` with
      `private: true` on every file. Transcript excerpts are in the PR.
- [ ] 9.3 **(Claude part passed; opencode part not run: no provider authenticated, see inputs/2026-10-26-verification.md)** In the same scratch vault, run the scheduler's exact Claude command line
      (`--permission-mode acceptEdits` plus the 3.3 flag) and the `opencode run` line, each prompted
      to move a note. **Accept:** both refuse the move. If either moves, stop: revise D-5b before
      merging.
- [x] 9.4 GitNexus `detect_changes` (scope compare, base `develop`). **Accept:** no symbol in
      `tools/` changed.
- [x] 9.5 Full `clarity-gate` on this PLAN, before task 1.1. **Accept:** ≥ 9/10. Re-score if a task
      is revised.

## Roadmap

- [x] 9.5 · [x] 0.1 · [x] 0.2
- [x] 1.1 · [x] 1.2 · [x] 1.3 · [x] 1.4 · [x] 1.5
- [x] 2.1 · [x] 2.2 · [x] 2.3 · [x] 2.4 · [x] 2.5 · [x] 2.6 · [x] 2.7
- [x] 3.1 · [x] 3.2 · [x] 3.3 · [x] 3.4 · [x] 3.5 · [x] 3.6
- [x] 4.1 · [x] 4.2 · [x] 4.3 · [x] 4.4 · [x] 4.5 · [x] 4.6 · [x] 4.7
- [x] 5.1 · [x] 6.1 · [x] 6.2
- [x] 7.1 · [x] 7.2 · [x] 7.3 · [x] 7.4 · [x] 7.5 · [x] 7.6 · [x] 7.7 · [x] 7.8
- [x] 8.1 · [x] 8.2
- [x] 9.1 · [x] 9.2 · [ ] 9.3 · [x] 9.4

Group 1 precedes group 2 (2 cites 1) and 3.4–3.5 (they cite 1). Groups 4, 5–6 and 7 are independent
of the vault groups. Group 8 follows every content group; 9.1–9.4 come last.

## Verification

`make validate` + `make validate-spine` + `openspec validate --strict` as in 9.1, the scratch-vault
transcripts (9.2, 9.3) in the PR, and this PLAN scored ≥ 9/10 by `clarity-gate`.
