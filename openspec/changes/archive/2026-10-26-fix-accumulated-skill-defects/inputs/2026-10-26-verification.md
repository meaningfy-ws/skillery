# Verification record (tasks 4.7, 9.2, 9.3), 2026-10-26

Runs made on branch `fix/accumulated-skill-defects`, Claude Code headless (`claude -p`) in a scratch
vault, with an isolated config dir and the branch's bundles loaded by `--plugin-dir`. Outputs are
summarised, not pasted, because they contain no more than the excerpts below.

## 9.3: scheduled runs cannot move or delete

| Run | Command line | Result |
|---|---|---|
| A | `claude -p "<mv a note>" --permission-mode acceptEdits --disallowedTools "Bash(mv:*)" "Bash(rm:*)"` | **refused**, note not moved |
| B (control) | the same without `--disallowedTools` (untrusted folder, vault settings with `mv` on ask) | refused: `ask` cannot be approved headless; the explicit deny stays as the guarantee for trusted vaults |
| C | scheduled line, `rm` | **refused**, note not deleted |
| opencode | `OPENCODE_CONFIG=opencode.scheduled.json opencode run …` | **not run**: no opencode provider authenticated on the test machine (`opencode auth list` → none). Recorded gap. |

Also observed: `--allowedTools "Bash(mv:*)"` on the command line does **not** override the vault's
`ask` rule in a headless run.

## 9.2 follow-up: the interactive prompt (owner directive, point 2)

An interactive Claude Code session (v2.1.310) was driven through a pseudo-terminal in the scratch
vault, with the shipped settings (`mv` and `rm` on ask), in the CLI's **default auto mode**. The
owner asked to delete a named note. Claude Code showed: *"Ask rule Bash(mv:*) overrides auto mode for
this command. Do you want to proceed? 1. Yes 2. No"*. Choosing Yes moved the note into `.trash/`.
So the vault's ask rule holds even in auto mode, and the approval path works.

## 9.2: owner-requested moves (scratch vault)

The owner's approval of the `mv` prompt was simulated by allowing `mv` in the scratch vault's
settings, because a headless run cannot answer a prompt; the prompt itself still needs one
interactive check by a person.

| Scenario | Result |
|---|---|
| (a) delete two named notes, one with an inbound link, no Obsidian CLI | both moved to `.trash/`; the broken link in `Cheatsheet` named; memory effect and the trash sync caveat stated; permanent deletion offered only on request |
| (a, before the fix) the same with no `.trash/` folder and `mkdir` not approved | nothing changed; the agent listed the paths and the broken link (the "cannot act" path). Led to commit `fix(vault-setup): create .trash/ with the layout` |
| (b) move a staged note whose name already exists in the target | nothing moved; the collision named and options offered |
| (c) `vault-project new` for a personal project | folder in `07 Perso/`, five standing files, each `private: true`, no `artefacts/` |

## 4.7: `executive-communication` before (develop) and after (branch)

| Prompt | Before | After |
|---|---|---|
| Quotation for an SME digitalisation package | "general/executive" register; wrote the full quotation in a conversational tone ("we are happy to help") | **bind** register stated; formal commitment verbs ("Meaningfy will configure"); wrote only the cover message and executive summary, structure left to the offer skill |
| Board recommendation (productise a tool) | executive register; answer first | **decide** register stated; answer first |

Note: the old version did not impose a pitch structure on this prompt; the gain is the register and
the scope discipline. The offer skill it routes to (`proposal-writing`) covers only the Decision
Phase shape until SO-1 (`offer-writing`) lands.
