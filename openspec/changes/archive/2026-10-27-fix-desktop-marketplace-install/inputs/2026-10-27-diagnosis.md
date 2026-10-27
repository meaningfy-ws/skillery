# Diagnosis — Claude Desktop cannot add the skillery marketplace (2026-10-27)

> **Secondary input.** The session record the EPIC was shaped from. Never deleted or groomed.

## Symptom

Claude Desktop → add marketplace → `meaningfy-ws/skillery` →
"Marketplace sync failed. Check the repository URL and try again."

## What was checked

| Check | Result |
|---|---|
| Local Desktop logs (`~/.config/Claude/logs/main.log`, `claude.ai-web.log`) | No entry for the add. The sync runs server-side on claude.ai; its real error is not visible locally |
| Repo visibility / default branch | Public; default branch `develop` |
| `.claude-plugin/marketplace.json` on `develop`, `main`, `releases` | Present on all three |
| Symlinks on `develop` | 0 (removed by #103). `releases` / `v3.3.1` still has 1: `openspec/schemas/meaningfy` |
| `claude plugin validate .` and each `bundles/<b>` | Pass |
| `claude plugin marketplace add meaningfy-ws/skillery` (clean `CLAUDE_CONFIG_DIR`) | **Succeeds** |
| Skill frontmatter vs claude.ai upload rules | Names and lengths pass; 3 descriptions contain `<`/`>` (`vault-project`, `vault-promote`, `vault-resume`) — **but they already did in v2.10/2.11**, so not a new cause |

## Layout history (from git tags)

| Tag | Plugin `source` | `strict` | Skills listed in entry | Symlinks | Per-bundle `plugin.json` |
|---|---|---|---|---|---|
| v2.10.0, v2.11.0 | `./` | `false` | yes | 0 | n/a |
| v3.0.0 – v3.2.0 | `./bundles/<b>` | unset (`true`) | no | 35 (under `bundles/`) | **no** |
| v3.3.0 | `./bundles/<b>` | unset | no | 1 (`bundles/` not in tag) | **no** |
| v3.3.1 / `develop` | `./bundles/<b>` (real copies) | unset | no | 1 / 0 | **no** |

The human reports v2.10-era installs on Desktop worked (assumed, not re-verified).

## Reference layouts (Anthropic)

| Repo | Layout | `plugin.json` per plugin |
|---|---|---|
| `anthropics/skills` | `source: "./"`, `strict: false`, `skills: [...]` (= skillery 2.10) | no |
| `anthropics/knowledge-work-plugins` (Cowork / Desktop) | `source: "./<plugin>"` (= skillery 3.x) | **yes** |
| `anthropics/claude-plugins-official` | `source: "./plugins/<plugin>"` | **yes** |

Docs (code.claude.com marketplace reference): with no `plugin.json`, "the entry is the manifest
regardless of `strict`" — so the current layout is valid *for the CLI*. Docs also warn
`Local source "x" is or traverses a symlink, so <path> was not read`. No documented claude.ai sync
rules beyond name charset/length and the reserved names `org`, `org-provisioned`, `unknown`.

## Confound

#103 attributed the failure to symlinks and switched to real copies; the spec now says
"no symlinks: claude.ai's marketplace sync fails on them". But v3.0–3.2 had **both** symlinks and no
`plugin.json`, and v3.3.1 still fails with no symlinks under `bundles/`. The two variables were never
separated. That is what this EPIC tests.

## Q&A

- **Q:** Which variant first? **A (human):** "test the one with symlinks first" — clarified as
  *v3.0-style symlinked bundles + a `plugin.json` per bundle*.
