# Spike record — DEC-5: the Claude per-bundle plugin layout

> Parent: [`proposal.md`](proposal.md) DEC-5. Run 2026-10-26 on Claude Code **2.1.310**, Linux, by the
> PLAN architect. Every install ran with `CLAUDE_CONFIG_DIR` pointed at a fresh scratch directory, so
> no real `~/.claude` install was read or written. Scratch root (not committed):
> `/tmp/claude-1000/-home-lps-work-repos-skillery/7d80249e-89d8-4b2e-b995-1588aa303c28/scratchpad/spike-dec5/`.

**Verdict: option (b) — a committed `bundles/<name>/` tree of relative symlinks into `skills/` and
`agents/`, one marketplace entry per bundle with `source: "./bundles/<name>"`, no `plugin.json`.**
Option (a) is rejected by Claude Code's validator; option (c) is not needed.

## Question

Which layout makes `claude plugin install <bundle>@meaningfy-skillery` load exactly that bundle's
skills and agents, without committing a second copy of any skill?

- **(a)** per-bundle `plugin.json` whose `skills`/`agents` paths point at `../../skills/<x>`;
- **(b)** per-bundle directory of symlinks `bundles/<name>/skills/<x> → ../../../skills/<x>`;
- **(c)** a generated, committed per-bundle copy.
- **(d)** (added during the spike, the cheapest one if it had worked) keep `source: "./"` and add an
  explicit `agents: [...]` list to each entry.

## Documentation read (code.claude.com, 2026-10-26)

| Source | Fact that decides the layout |
|---|---|
| [Plugin manifest reference → Path rules](https://code.claude.com/docs/en/plugins/manifest-reference.md) | "Every component path must resolve inside the plugin root"; a `..` path fails validation (`Path contains ".." which could be a path traversal attempt`). `agents` **replaces** the default `agents/` scan; `skills` adds to `skills/`. For an entry whose `source` is the marketplace root, a listed `skills` array replaces the `skills/` scan. |
| [Plugin loading reference → In-place and copied plugins](https://code.claude.com/docs/en/plugins/loading.md) | A plugin from a git-hosted marketplace is copied into `cache/<marketplace>/<plugin>/<version>/`; "files outside the plugin directory aren't copied". A symlink leading outside the plugin is rejected, except links between plugins within one marketplace. |
| [Host a marketplace → Share files within a marketplace with symlinks](https://code.claude.com/docs/en/plugins/host-marketplace.md) | On copy into the cache, a symlink whose target is elsewhere **within the same marketplace is dereferenced** (its content copied in its place); a target outside the marketplace is skipped. For a marketplace added **from a local path**, only symlinks inside the plugin's own directory are kept. |
| [Marketplace reference → Strict mode](https://code.claude.com/docs/en/plugins/marketplace-reference.md) | With no `plugin.json`, the marketplace entry is the manifest whatever `strict` says. Relative-path plugins in a git-hosted marketplace take the commit SHA as their version when no `version` is set. |

## Method

1. Built four throwaway marketplaces (two bundles `p-alpha`, `p-beta`; four skills; two agents, both
   meant for `p-alpha`): **baseline** (today's layout: `source: "./"`, `strict: false`, `skills`
   listed), **(d)**, **(a)**, **(b)**. Each was committed to its own git repository.
2. Ran `claude plugin validate` on each.
3. Served the repositories over local smart-HTTP git (`git http-backend` behind a 20-line Python WSGI
   wrapper) because `claude plugin marketplace add` refuses `file://` URLs, and dumb HTTP fails on
   shallow clones. This exercises the **git-hosted** code path (clone → copy into cache) that GitHub
   users get, not the in-place local-path path.
4. For each option, in its own fresh `CLAUDE_CONFIG_DIR`: `claude plugin marketplace add <url>`,
   `claude plugin install <bundle>@<marketplace>`, then `claude plugin details <bundle>` (component
   inventory) and a `find` over `plugins/cache/`.
5. Repeated baseline and (b) on a scratch clone of **the real skillery repo** (HEAD `d45306b`), with
   (b) generated from `marketplace.json` by a throwaway script (all three agents under
   `meaningfy-building`, per DEC-3).
6. Upgrade path: on the real-repo baseline install, pushed the (b) commit to the same marketplace and
   ran `claude plugin marketplace update` + `claude plugin update <bundle>@meaningfy-skillery`.
7. Local-path check: added the (b) fixture as a directory marketplace (`marketplace add ./path`).

## Evidence

### Validation

| Option | `claude plugin validate` |
|---|---|
| baseline | ✔ passed |
| (d) | ✔ passed |
| **(a)** | **✘ failed** — `plugins[0] plugin.json → skills[0]: Path contains ".." which could be a path traversal attempt: ../../skills/alpha-one` (and the same for every path) |
| (b) | ✔ passed, no symlink warning |

### Fixture counts (git-hosted install)

| Option | `p-alpha` skills / agents | `p-beta` skills / agents | Cache contents |
|---|---|---|---|
| baseline | 2 / **2** | 2 / **2** (should be 0) | each plugin dir holds all 4 skills + 2 agents |
| (d) | 2 / 2 | 2 / **2** — `agents: []` is treated as unset, default `agents/` scan still runs | each plugin dir holds the whole repo |
| (b) | 2 / 2 | 2 / **0** ✔ | only the bundle's own files; **0 symlinks** in the cache (all dereferenced to real files) |

### Real skillery repo (git-hosted install, all five bundles)

| Bundle | Today (baseline) skills / agents / always-on tokens | Option (b) skills / agents / always-on tokens |
|---|---|---|
| meaningfy-core | 5 / 3 / ~1,009 | 5 / 0 / ~764 |
| meaningfy-consulting | 5 / 3 / ~1,289 | 5 / 0 / ~1,045 |
| meaningfy-architecture | 4 / 3 / ~1,009 | 4 / 0 / ~765 |
| meaningfy-building | 9 / 3 / ~1,783 | 9 / 3 / ~1,783 |
| vault-assistant | 9 / 3 / ~1,734 | 9 / 0 / ~1,490 |
| **Total** | **32 skills, 15 agent registrations (3 agents × 5)**, ~6,824 tok | **32 skills, 3 agents**, ~5,847 tok |
| Plugin cache on disk | **57 MB** (whole repo, `.opencode/` copy included, × 5) | **1.9 MB** |

### Upgrade from today's layout

`claude plugin marketplace update meaningfy-skillery` then `claude plugin update
meaningfy-core@meaningfy-skillery` printed `updated from d45306b43d62 to 02e98c7927ca` and the
inventory became 5 skills / 0 agents; `meaningfy-building` became 9 / 3. **No uninstall or reinstall
was needed** — the plugin version is the commit SHA, so an ordinary update picks up the new layout.

### Local-path marketplace (maintainer dev mode)

With the (b) fixture added from a local directory, skills loaded (2 / 2) but **agents loaded 0** for
`p-alpha`: directory symlinks are followed in place, file symlinks for agents are not. This affects
only a maintainer who adds the working tree as a local marketplace; it does not affect GitHub
installs.

## Findings

1. **Option (a) is impossible**: Claude Code rejects any component path that leaves the plugin root,
   at validation and at load.
2. **On Claude Code 2.1.310 the skills are already scoped correctly** by today's explicit `skills`
   lists; the duplication observed in inputs §2 for skills came from an older install and is not
   reproduced. **Agents are not scoped**: each of the five bundles registers all three agents (15
   registrations, ~245 always-on tokens wasted per non-building bundle), and every bundle's cache
   carries a full copy of the repo (57 MB). The bug the EPIC names is real; its present shape is
   "agents everywhere + whole-repo copies", not "skills everywhere".
3. **Option (d) fails** for any bundle with no agents, because an empty `agents` array does not
   suppress the default scan. It would only work by moving `agents/` out of its home, which breaks
   the four-artefact layout (`AGENTS.md`), so it is rejected.
4. **Option (b) loads exactly the bundle**, copies no skill into the repo (symlinks are pointers, not
   copies), shrinks the cache ~30×, and upgrades in place. Option (c) is therefore unnecessary.

## Consequences carried into the PLAN

- The `bundles/` symlink tree and `marketplace.json` are **rendered from `bundles.yaml` and
  committed** (Claude clones the repo, so the links must be in git), and gated for drift
  (design.md D2, D3).
- **Windows risk**: git on Windows without `core.symlinks=true` checks symlinks out as text files,
  which would break a Windows user's Claude install. Recorded as an ASSUMPTION and a docs note
  (design.md Risks).
- **Maintainer dev mode**: to test the Claude packaging of a branch, add the marketplace from the
  pushed branch (`claude plugin marketplace add meaningfy-ws/skillery#<branch>`) or reproduce this
  spike's local smart-HTTP setup; a local-path marketplace drops agents (design.md Risks).
- The release-time fresh-install check (dev-method §6) uses the counts in the "Option (b)" column
  above as its expected output (tasks.md 9.3).

## How to reproduce

```bash
S=$(mktemp -d); export CLAUDE_CONFIG_DIR=$S/cfg        # never your real ~/.claude
git clone --bare <repo-with-layout> $S/repos/skillery.git
python3 smart_http.py $S/repos &                        # wraps `git http-backend`, port 18766
claude plugin marketplace add http://127.0.0.1:18766/skillery.git
for b in meaningfy-core meaningfy-consulting meaningfy-architecture meaningfy-building vault-assistant; do
  claude plugin install $b@meaningfy-skillery && claude plugin details $b | grep -E 'Skills \(|Agents \('
done
```

`smart_http.py`: a `wsgiref` server that passes each request to `git http-backend` with
`GIT_PROJECT_ROOT` set and `GIT_HTTP_EXPORT_ALL=1`, and returns the CGI output (kept in the scratch
root; not part of the deliverable).
