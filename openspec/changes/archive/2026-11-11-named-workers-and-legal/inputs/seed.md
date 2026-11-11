# Seed — named workers and a legal bundle (secondary, never groomed)

Captured from the owner's session of 2026-11-11, in the owner's words where quoted.

## The idea

> I want to explore the idea of having such workers, virtual workers: like this on
> https://www.marblism.com/ai-employees/linda — and in particular I would like to start with a legal
> one. They could have names (Moldovan/Romanian), for example the lawyer could be called Tolic, and
> he would be expert in commercial contract law, business, and Luxembourgish law. He would know how
> to draft contracts and revise contracts, using Meaningfy conventions and preferences, he would
> verify that the contract is aligned to other dependent documents (e.g. a freelance contract is
> bound to, or at least aligned to, the mission the freelancer will participate in; of a framework
> shall be also … a framework; we have our standard clauses).

> For some things, e.g. contract templates or a corpus of clauses, we have a dedicated repository …
> and the skills and procedures and practice and rules remain with agent definition.

> We write contracts in Overleaf.

## The shaping direction

> Let's explore the concept of having workers defined, first, how would they fit the skillery
> repository (we already have the team leader calling various team roles); I think this could be
> managed separately from the skills as those agents call the skills as needed.

> I think we must define workflows to constrain and direct how these agents behave, no?

> So then we have skills for tasks/activities (that prescribe a workflow) and skills … as skills …
> now? Shall we manage them separately?

Option A was chosen: one Skill type, with the distinction named and documented.

> Let's stick to A, for now seems cheaper, and start a new legal bundle/category, so we need an agent
> Tolic, and skills for it. Conventions: let's start giving names to agents e.g. "Tolic the lawyer",
> and the skills however must remain more precise, sticking to the actual purpose they cover. Also
> harden and strengthen the docs, fix the missing parts. Continue the stale work you just
> discovered. Please start shaping a new epic to cover all these things.

## The corpus repository

> We will provide a GitHub repo that will have all the rules and instructions on how it works
> provided there.

> [Tolic's second skill] is the skill of reading and working with a GitHub repo that will be
> approximately organised like this. I'll give you the structure in a bit, but the second skill shall
> be the ability to operate based on the instructions and the structure of that repo. I'll c/p in a
> bit the specs.

The owner then pasted the spec "Contract Library & Instances — Agent Implementation Spec"
(2026-11-11). It is not copied here: skillery is public and the spec names counterparties; its home
is the `contract-library` repository. Anonymised summary of what skillery depends on:

- Two private git repositories: `contract-library` (versioned clauses, contract skeletons for 13
  types in five families, entity data, the `meaningfy-contract` LaTeX class, the `ctr` CLI, tests,
  Antora docs, `AGENTS.md`) and `contracts` (one folder per instance, by counterparty), with
  `contracts-hr` for HR contracts under tighter access.
- Git becomes the drafting system of record; Overleaf is retired after a migration and read-only
  during it; Odoo records signatures only and is written only by `ctr register`.
- Clauses are addressed `<topic>/<clause>/<variant>@v<N>`; released versions never change;
  `clause.yaml` records variants, versions, canonical and `when`; the drafting style lives in the
  library's reference docs.
- Instances move draft → sent → agreed → signed → active → ended through `ctr` commands; status is
  git tags; `\Parent` and `\BackToBack` link contracts; negotiated text goes to `overrides/`;
  repeated overrides propose new versions or variants.
- The spec's agent operating rules: never decide legal content; never edit released versions or
  signed instances; no personal data in the library; HR restricted; no send, sign or register
  without explicit confirmation of that one action; Overleaf read-only; flag rather than guess;
  one clause, bundle or instance per PR.
- Delivery in five phases: foundation, migration inventory, clause learning, instance rebuild,
  operations.

## Gaps found in the repository during exploration

- No name for the two kinds of skill (activity skills that own a workflow, know-how skills).
- Nothing links an agent's primary skill to the workflow it walks.
- The README tables do not mark which skills carry a workflow; the README already calls
  `vault-assistant` "the workflow bundle", a different meaning.
- `docs/development/workflows.md:90` still says blocking in strict mode "comes with its stage 3";
  navigator stage 3 shipped and `docs/environment/navigator.md` documents strict blocking.
- Four workflows have no lead worker: epic-shaping (epic-planner is delegated), epic-delivery (the
  main session leads), release, documentation.
