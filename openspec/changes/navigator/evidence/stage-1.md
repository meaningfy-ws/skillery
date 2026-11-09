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
- Drawn on the terminal (`claude --plugin-dir <spike>`): _pending — checked by a person_.

## H-5 — the bundle validates (task 1.5)

- `claude plugin validate bundles/meaningfy-navigator`: passed after DD-31 (copy, not link;
  self-contained contract; state keyed by plugin name; `$` only to top-level functions).
- `register.tsx` type-checks against the engine's `claude-code.d.ts` (2.1.319) with the
  engine's recommended compiler options, outside the repo.
