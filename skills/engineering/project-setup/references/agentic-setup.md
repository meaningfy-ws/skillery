# Agentic Setup — Wiring the `.claude/` Layer

How to stand up the agentic layer of a Meaningfy repo: the `.claude/` directory, the single
canonical `AGENTS.md` (with `CLAUDE.md` as a symlink), and the memory model. Implements
decisions **D8** (single agent file) and **D9** (memory layout).

This pillar creates the *containers*. The *content* — EPIC specs, clarity scoring, review
criteria — comes from the installed skillery skills, not from here. This skill does **not**
vendor those skills.

## Templates this pillar renders

| Template (`assets/templates/agentic/`) | Renders to (at scaffold time) | Notes |
|-----------------------------------------|-------------------------------|-------|
| `AGENTS.md.tmpl` | `AGENTS.md` (repo root) | Canonical agent instructions. `CLAUDE.md` symlinks to it. |
| `MEMORY.md.tmpl` | `.claude/memory/MEMORY.md` | Seed auto-memory index (empty sections). |
| `EPIC.md.tmpl` | `.claude/memory/_templates/EPIC.md` | Blank EPIC skeleton — the **shaped bet** (appetite, problem, solution outline, key decisions, rabbit-holes, no-gos). Frozen once shaped. |
| `PLAN.md.tmpl` | `.claude/memory/_templates/PLAN.md` | Blank PLAN skeleton — the **executable plan** derived from the EPIC (algorithm, examples, test specs, task breakdown). The clarity gate scores this. |
| `task.md.tmpl` | `.claude/memory/_templates/task.md` | Blank task-outcome skeleton. |

The scaffolder renders the three skeletons into `.claude/memory/_templates/` and creates the
**empty** `.claude/memory/epics/` directory. The `epic-planning` skill copies a skeleton from
`_templates/` into `epics/<name>/` (EPIC.md, then PLAN.md) **on demand** — they are never
pre-populated at scaffold time.

Placeholders: see the canonical registry in `config-files.md` (chiefly `<<PROJECT_NAME>>`,
`<<PACKAGE>>`, `<<DEFAULT_BRANCH>>`).

## The `.claude/` layout (D9)

```
.claude/
├── agents/                 # OPTIONAL thin agent wrappers (or rely on installed skillery agents)
├── skills/                 # PROJECT-SPECIFIC skills only — do NOT vendor the skillery
└── memory/
    ├── MEMORY.md           # auto-memory index, ≤200 lines, stable patterns only
    ├── _templates/         # blank skeletons rendered at scaffold time (copy from here on demand)
    │   ├── EPIC.md         #   blank shaped-bet form
    │   ├── PLAN.md         #   blank executable-plan form
    │   └── task.md         #   blank task-outcome form
    └── epics/              # EPICs — STARTS EMPTY; epic-planning populates on demand
        └── <epic-name>/
            ├── EPIC.md                       # the shaped bet + decisions (frozen)
            ├── PLAN.md                       # the derived, clarity-gated plan (+ impl log)
            └── yyyy-mm-dd-<task-title>.md     # per-task outcome files
```

- `agents/` is optional. The skillery ships three thin wrapper agents (epic-planner,
  implementer, code-reviewer) as plugins; the rest of the knowledge ships as skills
  (e.g. `bdd-gherkin`, `technical-writing`). Add a thin local wrapper only if this repo
  needs a behaviour the installed agent or skill does not provide.
- `skills/` holds only skills unique to this repo. The shared engineering / ai-coding /
  consulting skills are installed via the skillery marketplace, never copied in.
- `_templates/` holds the **reusable blank forms** (EPIC, PLAN, task). `epics/` starts empty;
  the `epic-planning` skill copies a form out of `_templates/` when you actually start an epic —
  nothing is pre-filled.

### The pipeline: Architecture → EPIC → Plan → Implement

Specifications-first. Each stage derives from the one before; the EPIC **is** the work shape
(Shape Up style — the two are the same artifact, not separate).

1. **Architecture** (system design + ADRs in `docs/`) is broken down into EPICs.
2. **EPIC = the shaped bet.** Copy `_templates/EPIC.md` into `epics/<name>/EPIC.md` and shape it:
   appetite, problem, solution outline, **key decisions**, rabbit-holes, no-gos. This IS the
   specification, at the right abstraction; it **freezes** once shaped.
3. **Plan = the derived executable spec.** Copy `_templates/PLAN.md` into `epics/<name>/PLAN.md`;
   `epic-planning` expands the shaped solution into algorithm, examples, test specs, and a task
   breakdown. The **clarity gate scores the PLAN** (≥9/10) — gate the plan, not the shape.
4. **Implement** task by task; outcomes accrue as `epics/<name>/yyyy-mm-dd-<task>.md` (from
   `_templates/task.md`); guardrail skills (`meaningfy-code-review`, import-linter, `ponytail`)
   cross-check. The EPIC stays frozen as the bet the work was committed against.

## Single agent file: `AGENTS.md` canonical + `CLAUDE.md` symlink (D8)

`AGENTS.md` is the tool-neutral standard and the single source of truth. `CLAUDE.md` is a
**symlink** to it. Mirrored copies rot (both reference repos currently keep two divergent
files); a symlink makes drift structurally impossible while staying Claude-Code-compatible.

### Create the symlink

```bash
# from the repo root, after rendering AGENTS.md
ln -s AGENTS.md CLAUDE.md
git add AGENTS.md CLAUDE.md      # git stores the symlink as a symlink (core.symlinks=true)
```

Verify: `ls -l CLAUDE.md` shows `CLAUDE.md -> AGENTS.md`. Edit **only** `AGENTS.md`; the
header comment in the template says so. Document the symlink in the README so a contributor
does not "fix" it into a copy.

### Windows fallback

Some Windows checkouts cannot materialise symlinks (developer mode off, or
`git config core.symlinks=false`). **The failure is silent and dangerous:** on such a checkout
`CLAUDE.md` becomes a literal **text file whose entire content is the string `AGENTS.md`** — so
Claude Code loads `AGENTS.md` (the word) as broken instructions instead of the real agent file,
with no error. Detect it via the README symlink note (or `git ls-files -s CLAUDE.md` showing
mode `120000` upstream but a plain file on disk) and apply the copy-hook **before first use**.

Fallback: keep two real files and a pre-commit hook that copies `AGENTS.md → CLAUDE.md` so they
never diverge.

```yaml
# .pre-commit-config.yaml — add when symlinks are unavailable
  - repo: local
    hooks:
      - id: sync-claude-md
        name: sync CLAUDE.md from AGENTS.md
        entry: bash -c 'cp AGENTS.md CLAUDE.md && git add CLAUDE.md'
        language: system
        files: '^AGENTS\.md$'
        pass_filenames: false
```

Note the chosen approach (symlink vs copy-hook) in the README either way.

### .gitignore — or not

Commit **both** `AGENTS.md` and the `CLAUDE.md` symlink (or copy). Neither is ignored — they
are project documentation. Do **not** add `CLAUDE.md` to `.gitignore`: a fresh clone must get
the agent instructions. The only thing to keep out of git is machine-local agent state, never
these files.

## The memory model (D9)

Two distinct stores with different load semantics:

| Store | Location | Loaded | Holds |
|-------|----------|--------|-------|
| **Auto-memory** | `.claude/memory/MEMORY.md` | every session, first ~200 lines | stable patterns, conventions, key decisions, paths |
| **Epic/task memory** | `.claude/memory/epics/<name>/` | on demand (agent reads the relevant epic only) | specs, plans, task outcomes |

Rules:

- **MEMORY.md is an index, ≤200 lines.** It is truncated when loaded — curate it. Only
  CONFIRMED facts: codebase patterns, architectural decisions, file paths. No session notes,
  no unverified conclusions. Push detail into linked notes; keep one line per link here.
- **Do not auto-load the epics tree.** Reading every epic burns context. The agent opens the
  one relevant `EPIC.md` when work on that epic starts.
- **Two-part files.** Both `PLAN.md` and task files use Part 1 Specification (frozen after
  planning) and Part 2 Implementation Log, split by `--- <!-- implementation-log --> ---`.
  (`EPIC.md` is the single-part shaped bet — frozen once shaped, no Part 2.)
  Part 1 is the contract; Part 2 is the running record (outcomes, decisions, deviations,
  commit links — not logistics).

### Update triggers

| Event | Action |
|-------|--------|
| Starting work on an epic | Read the relevant `EPIC.md` |
| Completing a task | Write `yyyy-mm-dd-<task>.md`; tick the EPIC.md roadmap |
| End of a significant session | Update `MEMORY.md` with stable patterns |
| Completing an epic | Set EPIC.md status to Complete |

## How this complements the installed skills (no vendoring)

This skill ships *blank* `EPIC.md`, `PLAN.md`, and `task.md` skeletons (under
`.claude/memory/_templates/`) and the routing/loop text in `AGENTS.md`. It deliberately does
**not** restate planning or review knowledge:

- EPIC content, the planning procedure, and the clarity gate → **epic-planning** + **clarity-gate**
  skills (installed via the skillery).
- BDD features → **bdd-gherkin**; pre-PR review criteria → **meaningfy-code-review**;
  layering rationale → **cosmic-python**.

`AGENTS.md`'s "Skill routing" table points the agent at these for every task. The templates
here are the empty forms those skills fill.

### Installing the skillery (hand-off / DoD)

`AGENTS.md`'s skill-routing only resolves once the Meaningfy skillery is installed. This is the
single documented place for the install commands; running them is part of hand-off and the
Definition of Done (the routing must resolve):

```
/plugin marketplace add meaningfy-ws/skillery
/plugin install meaningfy-engineering meaningfy-ai-coding
/plugin install superpowers@claude-plugins-official
# ponytail — YAGNI / minimal-code discipline (its own marketplace; pairs with cosmic-python)
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

`ponytail` is a third-party plugin (not part of the skillery), so it has its own
`marketplace add`. It ships the `/ponytail` intensity control plus `/ponytail-review`,
`/ponytail-audit`, and `/ponytail-debt`. It is the routing target for "keep the code minimal"
in `AGENTS.md` — the restraint counterpart to `cosmic-python`'s structure.

## Relationship to `scripts/init-meaningfy-project.sh`

The skillery's `scripts/init-meaningfy-project.sh` does a minimal bootstrap: it copies
`prompts/CLAUDE.md.template` and `prompts/AGENTS.md.template` into a target repo (as **two
files**), creates `.claude/memory/epics/`, seeds an empty `MEMORY.md`, and prints the plugin
install commands.

This `project-setup` skill **supersedes and extends** that script:

- It renders the **single canonical `AGENTS.md` + `CLAUDE.md` symlink** (D8), instead of the
  two mirrored copies the init script drops.
- It scaffolds the **whole repo** (package layers, root config, tests, docs, infra, CI), not
  just the agentic files.
- `AGENTS.md.tmpl` carries the `meaningfy-template-version` comment (`2.0.0`) matching
  `prompts/AGENTS.md.template`, so the rendered `AGENTS.md` is a recognisable **descendant** of
  that template. (The version is a comment in the template itself — this skill's
  `scaffold.sh` does not stamp versions, and it does not call `init-meaningfy-project.sh`.)

When normalising an existing repo that was bootstrapped by the init script, replace the two
divergent files with `AGENTS.md` + symlink and reconcile any project-specific content into the
"Project specifics" section.

## Pointers

- Planning / EPIC content → **epic-planning** skill (and its `references/epic-template.md`).
- Spec readiness scoring → **clarity-gate** skill.
- Methodology background → `docs/ai-coding/ai-coding-methodology.md` (§4 memory, §2.2 EPIC) and
  `docs/ai-coding/ai-coding-runbook.md` (relative to the agent-skills repo root).
- Architecture guardrails (how `code-anatomy.md` feeds `.importlinter`) →
  `architecture-guardrails.md`.
