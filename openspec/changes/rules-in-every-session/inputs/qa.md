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

## 2026-10-29: answers on the proposed decisions

- On DEC-7, the owner asked what the script is for. Answered: `rules.py` is the rulebook's existing
  command-line tool, the only reader and writer of rule notes (`load`, `check`, `cite`, `lint`, the
  writers). Step 1 does not change it; step 2 adds the second store. DEC-7 now says so.
- On the pointer:
  > yes that pointr shall be placed in the agents.md, correct
- On how to tell development work:
  > I agree, if there is a git repo, then it is a signal, to use that as a dev and put rules int its
  > docs/ fodler, otherwise indeeed use vault by default

  → DEC-2 confirmed and sharpened: in a git repository the repository is the default store, not just
  offered; the card lets the user switch a row to the vault.
- On formal-reasoning's bundle:
  > no, keep fromar resoning in the archiecture or modelling bundle, better

  → recorded in the `formal-reasoning-everywhere` change.

## 2026-10-29: where can the script run?

The owner asked: "what if the session runs in claude desktop? can you still run this script? (what if
claude.ai?)". A documentation check the same day found:

| Surface | Runs `rules.py` with the vault? | Source |
|---|---|---|
| Claude Code CLI | yes, on the user's machine | https://code.claude.com/docs/en/skills.md |
| Claude Desktop, Code tab (local) | yes: "runs on your machine with direct access to your files"; environment variables through a saved local environment or the `env` key of the user settings | https://code.claude.com/docs/en/desktop.md |
| Claude Desktop, Cowork | unverified: plugins install from a marketplace, but local folder and environment access is not documented | https://claude.com/docs/cowork/guide/plugins.md |
| Claude Desktop chat, claude.ai | no: skill code runs in an Anthropic container with no path to the laptop; a local MCP server is a Desktop-only alternative | https://platform.claude.com/docs/en/build-with-claude/skills-guide, https://modelcontextprotocol.io/docs/develop/connect-local-servers |
| Claude Code on the web | no: a cloud VM with the cloned repository only | https://code.claude.com/docs/en/claude-code-on-the-web.md |

→ a rabbit-hole on surfaces, and a no-go for Desktop chat and claude.ai in this change.

Why the answers are kept here: the epic-planning method keeps the seeds and the Q&A of a change in
its `inputs/`, verbatim and never groomed, so that every decision in the EPIC can be traced to the
words it came from. The EPIC states each decision once, as a DEC with the owner and the date.
