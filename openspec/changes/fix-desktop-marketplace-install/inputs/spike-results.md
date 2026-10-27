# Spike results

> **Secondary input.** Filled per variant by the procedure in `design.md`. Never deleted or groomed.

| Variant | Branch @ SHA | CLI validate | CLI add + install (GitHub `#ref`) | Desktop sync | Desktop install + chat | Desktop error text | When |
|---|---|---|---|---|---|---|---|
| C — symlinks + plugin.json | `spike/desktop-c` @ `79508d4` | pass | pass — `meaningfy-core` Skills (6) | _pending (human)_ | _pending_ | | 2026-10-27 |
| A — copies + plugin.json | | | | | | | |
| B — 2.10 root layout | | | | | | | |

Notes:
- 2026-10-27: Desktop reads only the default branch, so `#ref` testing is impossible (DEC-7). C was
  built into the generator on `fix/desktop-plugin-manifests` and merged to `develop` for the Desktop test.
- CLI quirk found with C: added from a **local folder** (`marketplace add ./`), the CLI reads the
  plugin in place and skips symlinked agent `.md` files (`meaningfy-building` shows Agents (0));
  symlinked skill dirs load. Added from **GitHub**, the cache holds real files and all 3 agents load.
  Copies + plugin.json (variant A) load agents in both cases. Affects dev checkouts only.
- C tree: 39 symlinks (33 skills, 6 agents) under `bundles/`, one `.claude-plugin/plugin.json` per
  bundle, `version` dropped from marketplace entries (D-2).
