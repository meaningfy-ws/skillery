# EPIC: Re-bundle by activity — every use case catalogued, every buildable agent built, the rest on a feature register

> **Golden thread.** Parents: the approved target structure, agent roster and roadmap in
> [`docs/catalogue-architecture.md`](../../../docs/catalogue-architecture.md) (approved 2026-10-26 in
> `restructure-and-evaluate-catalogue`, `inputs/approvals.md`), the owner's activity list of
> 2026-10-26 (archived `define-catalogue-model`, `inputs/2026-10-26-plan-confirmation.md`) and the
> use-case catalogue [`use-cases/`](../../../use-cases/). Shaping record:
> [`inputs/2026-10-26-shaping-qa.md`](inputs/2026-10-26-shaping-qa.md).
> **Siblings (cited, never restated):** `add-sales-bundle`, `add-devops-bundle` (their packages land
> later in the bundles this EPIC creates or names), `evaluate-catalogue` (parked; it measures the
> result of this EPIC), `define-ai-domains` (the human docs per domain).

## Appetite

**Large: about six weeks part time, in about seven PRs, each one a stopping point.** Use cases and
the coverage check first, then bundles and the `purpose` facet, then the three agents, then the
feature register, then the infrastructure items (the symlink re-test, the external dependency
register, the voice channel profiles). If the work turns into writing the sales or devops skills
themselves, stop: those land with `add-sales-bundle` and `add-devops-bundle`.

## Why

The bundles were grouped by who wrote the skills, not by the work Meaningfy does. The owner's
activity list (software development, modelling, client delivery and project management, content,
offers and pricing, proposals, CRM, devops) has no matching bundles, and the `purpose` facet does not
name these activities either. Of the 21 use cases, 13 are partial or missing, yet several could be
served today by an agent over skills that already exist (the architect, the modeller, the proposal
writer). Three activities have no use case at all: the advisory engagement, client delivery with
project management, and content creation. And nothing says which features are still to be built, or
what each one waits for.

Why now: the sales and devops packages are about to land, and they need bundles to land in. Every
change made before the structure is settled would have to be moved again, and the parked evaluation
would measure skills that are about to move.

## Solution outline

1. **Every use case catalogued.** Add the use cases the activity list implies and the catalogue lacks
   (at least the advisory engagement, client delivery with project management, content creation for
   LinkedIn and blogs), and a check that every skill and every agent serves at least one use case.
   Done means no skill or agent is an orphan, and the gap map shows the whole of Meaningfy's work.
2. **Bundles by activity.** Re-cut the bundles to the approved target structure. `meaningfy-sales` is
   created now and holds the commercial skills that exist today; the sales package's own skills join it
   later. Bundles with nothing to hold yet (devops, business, design) stay on the register until their
   first member lands. Every move is announced to installers.
3. **`purpose` names the activities.** The `purpose` facet's values become Meaningfy's activities, so
   a bundle, its skills' purposes and its use cases' areas tell one story.
4. **The agents that today's skills can serve, built:** `system-architect` (UC-W19) and
   `conceptual-modeller` (UC-W20) as `lead` agents that think with the user and say briefly what they
   think and plan; `proposal-writer` (UC-W8) as a `delegated` agent. Each with its Gherkin.
5. **A feature register.** One table of the features still to build in this repo (the sales agents,
   the devops agent, the commercial chain, the personal assistants, ...): their use cases, bundle,
   agents and skills, the material each needs and whether it exists. A parked change exists only where
   its material is in hand.
6. **Infrastructure the structure needs:** re-test whether Claude Code still needs the `bundles/`
   symlink tree; a structured external dependency register that the compatibility tables are
   rendered from; channel profiles in `meaningfy-voice` (LinkedIn, blog, offer, internal message).

## Key decisions

- **DEC-1: Bundles follow activities, and a bundle exists only when it holds something.** A planned
  bundle with no member is a register row, never an empty entry in `bundles.yaml`: an empty plugin
  installs nothing and confuses the installer.
- **DEC-2: `meaningfy-sales` is created now** with the commercial skills that exist (`proposal-writing`,
  `estimation`) and the `proposal-writer` agent. The sales package's skills, shaped elsewhere, join it
  through `add-sales-bundle`, which owns their deduplication against what is already here (owner:
  "there are already some shaped skills elsewhere that will be integrated").
- **DEC-3: Every skill and agent serves at least one use case**, checked by the validator. The
  catalogue is read from the use cases inwards; an orphan is either given its use case or retired.
- **DEC-4: `purpose` becomes the activity list; `stage` stays.** Every skill and agent is re-tagged
  once. New activity values follow the owner's list and extend it only by the owner's word.
- **DEC-5: No `partner` agent type.** A thinking partner is a `lead` agent: primary, able to call
  subagents, tools and skills, stating its view and plan briefly before it acts. This closes Q-2 of
  `restructure-and-evaluate-catalogue`; the agent template's types do not change.
- **DEC-6: The three agents are built from existing skills only.** An agent whose method is missing
  is a register row, not a thin agent with nothing to load.
- **DEC-7: The feature register lives in `docs/catalogue-architecture.md`**, replacing the roadmap
  table it extends; a parked change stub is created only when the feature's material is in hand
  (today: `add-sales-bundle`, `add-devops-bundle`, both already drafted).
- **DEC-8: The `bundles/` symlink tree is re-tested, not assumed.** It is replaced by root-source
  marketplace entries only if a spike on the current Claude Code shows that a bundle with no agents
  loads no agents and that installs and updates work; otherwise it stays, and the result is recorded.
- **DEC-9: One structured external dependency register** (plugins, skills, CLI tools, MCP servers,
  services, frameworks: source, pin, provenance, install check, CLI support) becomes the source of the
  tables in `docs/environment/dual-cli/compatibility.md` and `mcp-setup.md`.
- **DEC-10: Voice channel profiles are resources of `meaningfy-voice`.** The voice stays one; a
  profile per channel says how it sounds there. Each profile starts from a recorded failure case or an
  owner-supplied example (failure-first).
- **DEC-11: No evaluation here.** No model runs; `evaluate-catalogue` measures the result afterwards.

## Rabbit-holes

- **Requirement cycles.** `decision-package` (consulting) hands the Statement of Work to
  `proposal-writing`; if `proposal-writing` moves to sales and sales requires consulting, the hand-off
  must become a "see also", or the requirement runs the other way. Resolve each edge by the D-9 rule
  of the restructure change, never by a cycle.
- **Re-tagging `purpose` turns into re-describing skills.** Re-tag the facet only; descriptions are
  `evaluate-catalogue`'s.
- **Channel profiles invented from nothing.** Without the owner's examples a profile is a guess; ship
  only the profiles that have material, and list the rest on the register.
- **The dependency register grows into a package manager.** It records and renders; it does not
  install.

## No-gos

- No skill or agent of the sales or devops packages is written here.
- No model runs, no description rewrites for triggering, no Opus.
- No change to `stage`, to the agent template's types, or to the skill folder layout.
- No empty bundle in `bundles.yaml`.
- No renamed skill or agent (a move between bundles keeps the name, so installs that cite it keep
  working).

---

## What Changes

- New use cases in `use-cases/`, and a coverage check in `make validate`.
- **BREAKING (installers):** `proposal-writing` and `estimation` move from `meaningfy-consulting` to the
  new `meaningfy-sales`; users who need them install `meaningfy-sales`.
- `facets.yaml` `purpose` values replaced by the activities; every skill and agent re-tagged.
- New agents `system-architect`, `conceptual-modeller` (`meaningfy-architecture`) and `proposal-writer`
  (`meaningfy-sales`), each with a `.feature`.
- `docs/catalogue-architecture.md`: the feature register replaces the roadmap table.
- A structured external dependency register and the rendering of the two compatibility docs from it.
- Channel profiles under `skills/meaningfy-voice/references/`.
- The symlink re-test, recorded; `bundles/` replaced only if it passes.

## Capabilities

### New Capabilities
- `external-dependency-register`: one structured record per external dependency and the docs rendered
  from it.

### Modified Capabilities
- `catalogue-architecture` (from `restructure-and-evaluate-catalogue`): the coverage rule and the
  feature register.
- `catalogue-model`: the `purpose` vocabulary.
- `dual-cli-distribution`: only if the symlink re-test replaces `bundles/`.

## Impact

`bundles.yaml`, `facets.yaml`, every skill's and agent's frontmatter (`purpose`), `agents/`,
`tests/features/agents/`, `use-cases/`, `tools/repo_lint/` (the coverage check),
`tools/skill_inventory.py` (if the register is rendered), `docs/catalogue-architecture.md`,
`docs/environment/dual-cli/`, `README.md`, `CHANGELOG.md`, and the rendered `marketplace.json`,
`bundles/` and `tools/opencode-catalogue.json`.
