# Stage 1 evidence

## H-0 — the spike (task 1.1, DD-29)

- Claude Code version: 2.1.319.
- Spike folder: the session scratch directory, `navigator-spike/` (outside git, not committed):
  `.claude-plugin/plugin.json` with `"hooks": ["./hooks.json"]`, `hooks.json` naming
  `./register.tsx`, `register.tsx` drawing one `AbovePrompt` row and one `$.ui.status` line, both
  from `lib/view.ts`, imported with its `.ts` specifier.
- `claude plugin validate <spike>`: passed. The module's hooks (`session.start`,
  `ui.render{component=AbovePrompt}`) and calls (`$.ui.resolve`, `$.ui.status`) were read, so the
  `.ts` import resolves. DD-7's fallback (extensionless imports) is not needed.
- Drawn on the terminal (`claude --plugin-dir <spike>`): passed, seen by the owner 2026-11-09
  (`⎈ navigator · spike · band row`). Task 1.1 done.

## H-5 — the bundle validates (task 1.5)

- `claude plugin validate bundles/meaningfy-navigator`: passed after DD-31 (copy, not link;
  self-contained contract; state keyed by plugin name; `$` only to top-level functions).
- `register.tsx` type-checks against the engine's `claude-code.d.ts` (2.1.319) with the
  engine's recommended compiler options, outside the repo.

## H-1 — the bundle on the terminal (task 1.7)

- `claude --plugin-dir bundles/meaningfy-navigator` in this repo, 2026-11-09: the line and the band
  drew, and `/navigator band` brought a hidden band back (owner). Pressing *Hide* left no way back
  on screen → DD-32 (a `⎈` button restores the band).
  To re-check after DD-32: Unfold, Fold, Hide, `⎈`; and H-3, a subagent in the band.
- The session wrote `.claude-plugin/types/` and `tsconfig.json` into the bundle; the gate and git
  now ignore both.
