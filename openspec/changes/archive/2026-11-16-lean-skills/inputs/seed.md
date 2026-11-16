# Seed — book rule sets (`ciembor/agent-rules-books`) and the skillery catalogue

Captured from the owner's session of 2026-11-14, in the owner's words where quoted. Secondary: the
EPIC supersedes it. The findings are in [`findings-2026-11-14.md`](findings-2026-11-14.md).

## The trigger

The owner asked to clone `https://github.com/ciembor/agent-rules-books` beside skillery and said:

> i wonder how can i use this repo to replace, simplify, improve, extend, break down any existent
> skills, add new ones, change the existent ones, produce new agents, decide on what agents shall be
> in place, what workflows are appropriate

> what meaningfy introduces that these book reviews does not

> would it be an option to use this new repo dependency to meaningfy skillery repo and reduce it in
> size

> put the findings into a new epic shape, as inputs

> brainstorm

## The questions the owner raised

1. Which skillery skills can the book rule sets replace, simplify, improve, extend or break down?
2. Which new skills, agents and workflows do they suggest, and which agents should exist?
3. What does Meaningfy bring that the book rule sets do not?
4. Can skillery depend on that repository and become smaller?

## The goal, in the owner's words (second message, same session)

Asked what bothered them about skillery today, the owner said:

> i am bothered by the large and growing size of skillery skills. can we also take the opportunity
> to execute a deeper analysis and find ways to improve it and significantly shrink skillery skills

> i wonder to what extent these examples or other snippets are beneficial or have any
> good/significant effect, rather than proposing rules. maybe examples help, but maybe rules alone
> are enough. not sure

> i want to reduce skills to minimum necessary, reuse chosen dependencies, maintained elsewhere, and
> rely on those dependencies and avoid repetition in skillery

> what i want is a solid discipline rule following guardrails, workflows, good practice, and
> following robust software development philosophy and practice, with tests at various levels, and
> self checks/adversarial assessments to ensure the job done follows the specs. and that the specs
> are good for implementation to begin with

> i like TDD, MDD, Clean and onion architecture, Martin Fowler's book, Evans books, and good work
> philosophy

So the scope is wider than the book repository: shrink the skills to the minimum necessary, lean on
dependencies maintained elsewhere, and keep the discipline. The size analysis is in
[`findings-size-2026-11-14.md`](findings-size-2026-11-14.md).

## What followed

The questions and the owner's answers are in
[`elicitation-2026-11-14.md`](elicitation-2026-11-14.md); the shaped EPIC is
[`../proposal.md`](../proposal.md).
