# Agentic Setup — the AGENTS.md-canonical layer

How to stand up the agentic layer of a Meaningfy repo: the canonical, CLI-agnostic **`AGENTS.md`**
(opencode reads it natively), the thin **`CLAUDE.md` pointer** that imports it for Claude Code, and
the regenerable `.claude/` index. Implements **D8** (AGENTS.md canonical, CLAUDE.md pointer, never a
symlink — the `dual-cli-distribution` spec) and **DEC-12** (the global vs repo split). The work
*memory* now lives in the spine (`openspec/`) — see `spine-projection.md`.

This pillar creates the *containers*. The *content* — EPIC specs, clarity scoring, review
criteria — comes from the installed skillery skills and the spine, not from here. This skill does
**not** vendor those skills.

## Templates this pillar renders

| Template (`assets/templates/agentic/`) | Renders to | Notes |
|----------------------------------------|------------|-------|
| `AGENTS.md.tmpl` | `AGENTS.md` (repo root) | **Canonical** agent instructions: skill routing, the spine, conventions, project specifics. |
| `CLAUDE.md.tmpl` | `CLAUDE.md` (repo root) | Thin pointer: "read `AGENTS.md`", the `@AGENTS.md` import, and Claude-specific guidance only. |
| `MEMORY.md.tmpl` | `.claude/memory/MEMORY.md` | Regenerable orientation **index** (≤200 lines). The truth is `openspec/specs/`. |

The `EPIC.md.tmpl`, `PLAN.md.tmpl`, and `task.md.tmpl` templates are **retired** (they survive only
as redirect notes). The EPIC/PLAN/task artifacts are now the spine's native files — see "The artifact
shift" below and `spine-projection.md`.

Placeholders: see the canonical registry in `config-files.md` (chiefly `<<PROJECT_NAME>>`,
`<<PACKAGE>>`, `<<DEFAULT_BRANCH>>`).

## AGENTS.md canonical, CLAUDE.md a pointer, never a symlink (D8)

`AGENTS.md` is the single source of truth and is written CLI-agnostic: opencode reads it natively,
and Claude Code reads it through `CLAUDE.md`, which says "read `AGENTS.md`" and imports it with a
line `@AGENTS.md`. `CLAUDE.md` adds only Claude Code-specific guidance, if any — it never repeats
`AGENTS.md`.

Both are **regular files**. Never symlink one to the other, in either direction, and never keep two
copies in sync with a hook: a symlink breaks silently on checkouts that cannot materialise links,
and a copy drifts. The import gives one source without either failure.

Edit **only** `AGENTS.md` for routing, spine and project facts; the header comment in each template
says so. The scaffolder reports an existing `AGENTS.md` or `CLAUDE.md` symlink for reconciliation
rather than replacing it — see `modernizing-existing-projects.md`.

### .gitignore — or not

Commit **both** `AGENTS.md` and `CLAUDE.md`. Neither is ignored — they are project documentation. A
fresh clone must get the agent instructions. The only thing to keep out of git is machine-local
agent state, never these files.

## The global vs repo split (DEC-12)

There are **two** instruction layers with different jobs:

| File | Owns | Loaded |
|------|------|--------|
| **Global** (`~/.claude/CLAUDE.md` on Claude Code, `~/.config/opencode/AGENTS.md` on opencode) | the company-wide *standard* — Clean Code, Clean Architecture, testing, tooling, security | every session, every repo |
| **Repo** `./AGENTS.md` (+ the `./CLAUDE.md` pointer) | the *operating manual for this repo* — skill routing, the spine, project specifics | this repo's sessions |

The repo `./AGENTS.md` **ROUTES to** the global standard and to the installed skills; it **never
restates** the standard. It records only what is specific to this repo (the package(s), the
datastores, the archetype, the spine pointers). This keeps the repo file short and prevents the
single-source-of-authority drift that a restated standard would cause.

## The spine is the work memory (not `.claude/`)

In-flight work and durable truth now live in `openspec/`, not in `.claude/memory/epics/`:

| Meaningfy noun | OpenSpec-native file |
|---|---|
| **EPIC** (work shape) | `openspec/changes/<id>/proposal.md` |
| **PLAN** | `openspec/changes/<id>/design.md` + `tasks.md` (clarity gate scores the pair ≥9/10) |
| normative requirements | `openspec/changes/<id>/specs/<cap>/spec.md` (RFC-2119 SHALL + GWT) |
| durable truth | `openspec/specs/` (deltas merge here on `archive`) |
| seed inputs | `openspec/changes/<id>/inputs/` (preserved, never groomed) |

Drive it with the opsx workflow commands (`/opsx:*` on Claude Code, `opsx-*` on opencode; core
profile). The full projection mechanics — config,
the pinned schema, the command install — are in `spine-projection.md`.

### The artifact shift (retiring the old templates)

The legacy `.claude/memory/epics/EPIC.md`+`PLAN.md`+`task.md` model is **superseded**. The
scaffolder no longer renders those skeletons; the `.tmpl` files redirect to the spine. Don't
reintroduce parallel epic files under `.claude/` — `proposal.md`/`design.md`/`tasks.md` are the one
home for each fact (no double-spec).

## `.claude/` is a regenerable index (R7)

```
.claude/
├── agents/                 # OPTIONAL thin agent wrappers (or rely on installed skillery agents)
├── skills/                 # PROJECT-SPECIFIC skills only — do NOT vendor the skillery
└── memory/
    └── MEMORY.md           # regenerable orientation INDEX, ≤200 lines, stable patterns only
```

- **`MEMORY.md` is an index, not authority.** It is ≤200 lines (truncated when loaded — curate it):
  stable codebase patterns, key paths, spine pointers. **No** session notes, no unverified
  conclusions, no epic detail (that lives in `openspec/changes/`). If it disagrees with
  `openspec/specs/`, **specs/ wins**.
- **Orientation index of record is `openspec/config.yaml`'s `context:` field** — the native sink.
  `MEMORY.md` is the cheap local echo of it, not a second source.
- `agents/` is optional (the skillery ships thin wrapper agents as plugins); `skills/` holds only
  skills unique to this repo (never copy the shared skillery in).

## How this complements the installed skills (no vendoring)

This skill ships the canonical `AGENTS.md` (routing + spine pointers), the `CLAUDE.md` pointer,
and the `MEMORY.md` index. It
deliberately does **not** restate planning or review knowledge:

- EPIC content, the planning procedure, and the clarity gate → **epic-planning** + **clarity-gate**
  skills, driving the `/opsx:*` workflow.
- BDD features → **bdd-gherkin**; pre-PR review criteria → **meaningfy-code-review**;
  layering rationale → **cosmic-python**; domain model → **conceptual-modelling** (product repos).

`AGENTS.md`'s "Skill routing" table points the agent at these for every task.

### Installing the spine + skillery (hand-off / DoD)

`AGENTS.md`'s skill-routing and the opsx commands only resolve once the spine and skillery are
installed. This is the single documented place for the install commands; running them is part of
hand-off and the Definition of Done:

```
# the spine (OpenSpec /opsx:* commands, core profile) — the meaningfy schema is already pinned in
npx -y @fission-ai/openspec@<pin> init --tools claude --profile core

# the skillery (the skill routing target set)
/plugin marketplace add meaningfy-ws/skillery
/plugin install meaningfy-core@meaningfy-skillery
/plugin install meaningfy-building@meaningfy-skillery
/plugin install superpowers@claude-plugins-official
# ponytail — YAGNI / minimal-code discipline (its own marketplace; pairs with cosmic-python)
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

`ponytail` is a third-party plugin (not part of the skillery), so it has its own `marketplace add`.
It is the routing target for "keep the code minimal" in `AGENTS.md` — the restraint counterpart to
`cosmic-python`'s structure.

## Pointers

- The spine projection (openspec/, schema pin, /opsx:*) → `spine-projection.md`.
- Planning / EPIC content → **epic-planning** skill; spec readiness → **clarity-gate** skill.
- The AGENTS.md-canonical + spine target layout → `../../../docs/environment/openspec-setup-guide.md`.
- Architecture guardrails (how `code-anatomy.md` feeds `.importlinter`) → `architecture-guardrails.md`.
