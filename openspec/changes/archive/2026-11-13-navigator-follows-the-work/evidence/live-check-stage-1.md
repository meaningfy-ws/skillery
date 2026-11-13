# Live check, stage 1 (D-21.9, D-23)

**Waived by the owner, 2026-11-13:** "forget my check, go on, if I dont like it ill rase new issues
in skillery". Not run. The stage merged on its gates and reviews alone; a defect found in use comes
back as a skillery issue.

The check as prepared, for whoever runs it later: in a scratch repository on `main` with changes
`alpha` and `beta-feature` (tasks 1/3) and a sibling worktree `../r-beta` on
`feature/beta-feature`, run `claude --plugin-dir <skillery>/bundles/meaningfy-navigator --add-dir
../r-beta`. Expected: no change before any edit; `beta-feature 1/3` after writing into
`../r-beta/notes2.txt`; still `beta-feature` after `/clear`.
