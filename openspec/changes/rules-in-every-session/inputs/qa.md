# Q&A record: rules in every session

Secondary input. Never deleted or groomed; the EPIC supersedes it.

## 2026-10-29: the owner's statement

After the reasoning-capabilities work was merged, the owner pointed out that the guide grouped two
unrelated families, and stated their purposes:

> the rules we want to "learn" and manage are the rules and preferences of users, and they can
> express a rule in virtually any session.
> the reasoning skills are for establishing a kg for ASP or prolog and reason and test models.

Earlier the same day the owner had asked: "the learning one is for almost all skills (I think), and
reasoning skill is only the one that enables reasoners within architecture and modelling tasks, no?"

- → DEC-1. The guide was split in a separate direct PR (#123): `docs/environment/rules.md` covers the
  rule skills only.
- Finding that triggered this EPIC: the only instruction that loads rules is line 31 of
  `skills/vault-setup/assets/AGENTS.md`. No other skill and no repository binding mentions `rulebook`.

## Open questions asked on 2026-10-29, and the owner's answers

- **Q-1 Personal rule or project convention?** Asked whether, in a repository, "never commit to main"
  is the user's habit or the project's rule, and where it should be stored.
  > now that is a good question, if the work is happening in claude desktp, I would always use
  > meaningfy vault to store the rules; only if we do any sort of development, in cli, work we could
  > consider to store the rules in the repository (somewhere, maybe in docs/ with a pointer to
  > rule-stack)

  → DEC-2, step 2 of the appetite. "A pointer to rule-stack" is read as a pointer line in the
  repository's `AGENTS.md` to the repository's rule folder; the PLAN fixes the folder and the line.
- Clarified the same day, while the EPIC was being written:
  > I meant it could be storign rule sin teh repository where the work takes place, not a separate
  > dedicated repository for all the rules; not for now at least

  → a no-go: no dedicated rules repository. The store is the working repository itself.
- **Q-2 Unattended agents?** Should the scheduled agents load the owner's rules?
  > not for now

  → DEC-3, and a no-go.
- **Q-3 Activity names for code work?** Proposed `coding`, `code-review`, `planning`.
  > fine, but we will have many more ... open lis at the moment

  → DEC-4: an open list, seeded with those three.
- On formal-reasoning, in the same message:
  > on formal reasoning, we shall be able to do quick tests in almost any scenario where the asp or
  > swi prolog exists

  → a separate change, `formal-reasoning-everywhere`, kept apart from this one as the owner asked.
