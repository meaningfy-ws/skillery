---
name: skillery-feedback
description: "Use this skill when a Meaningfy skill or agent misbehaved, gave wrong or missing guidance, fired when it should not (or did not fire), failed to install, or when you need a skill or agent that does not exist (\"report this to skillery\", \"open an issue on the skill\", \"the skill did not work\", \"we need a skill for X\"); it says where to report (the skillery repository), which form to use, what context to collect so the issue can be fixed, and what must never go into it."
license: Apache 2.0
metadata:
  purpose: knowledge
  area: cross-cutting
  subject: generic
  posture: precise
  stage: any
  maturity: experimental
---

# Skillery Feedback

Every Meaningfy skill and agent comes from one catalogue, the GitHub repository
`meaningfy-ws/skillery`. When one of them lets you down, the fix happens there, and it happens only if
the issue carries enough to reproduce the failure. This skill turns "the skill did not work" into an
issue that gets fixed.

## Quick Start

**Input:** during an infrastructure session, `stack-operations` told the agent to deploy with a flag
the installed Docker Compose does not have; the person says "report this to skillery".

1. Collect the context (see *What to collect*): the skill (`stack-operations`), the catalogue version
   the CLI shows for the installed bundle, the CLI, the prompt verbatim, what came out, what should
   have.
2. Remove anything private: no host, address, client, account or secret value. The repository is
   public.
3. Draft the issue and show it to the person:

   ```markdown
   Title: [defect] stack-operations: deploy step uses a flag older Compose lacks
   Kind: content · Where: Claude Code · Version: <version>
   What you asked: "deploy the new version of <stack> and roll back if unhealthy"
   What came out: `docker compose up --wait --wait-timeout 120` → "unknown flag: --wait-timeout"
   What should have come out: the minimum Compose version stated, or a command that works on it
   Anything else: Compose v2.15 on the server; the step is in references/deploy-workflow.md
   ```

4. On the person's yes, file it with the defect form's labels:
   `gh issue create --repo meaningfy-ws/skillery --title "<title>" --label defect --body-file <draft>`.

**Output:** the issue URL, given to the person.

## Workflow

1. **Decide the kind.** Something that exists misbehaved → **Defect**. Something is missing → a
   **Request**. Read [`references/issue-forms.md`](references/issue-forms.md) for the fields of each.
2. **Collect the context** while it is fresh: the session is the evidence.
3. **Sanitize.** Apply *Never in an issue* below to every field, the excerpt included.
4. **Draft, show, then file.** An issue is public: the person approves the text before it is filed.
   Without `gh` or access, give the person the draft and the link
   `https://github.com/meaningfy-ws/skillery/issues/new/choose`.
5. **One issue per failure.** Two problems are two issues; search the open issues first and add a
   comment to an existing one rather than opening a duplicate.

## What to collect

- **Which skill or agent**, by its name (or "install / docs").
- **The catalogue version**, as the CLI shows it for the installed bundle.
- **Where:** Claude Code, Claude Desktop / Cowork, or opencode.
- **What you asked, verbatim.** It becomes the failure case and the trigger probe; without it the
  issue is answered, not fixed.
- **What came out**, quoted, and **what should have come out**, concretely.
- **Which file of the skill** said the wrong thing, when you can tell, and which neighbouring skill
  fired instead, for a trigger problem.

## Never in an issue

The skillery repository is public. Never put in an issue, a comment or an excerpt: a secret value or
where one is kept, a host name, an address, an account name, a client or project name, a
customer's data, or a weakness of a named system. Replace each with a placeholder such as `<stack>`
or `<client>`; the failure must still be reproducible from the placeholders.

## Gotchas

- "The skill is bad" is not an issue. Without the prompt and the output, nobody can fix it.
- Do not fix the skill locally in the installed plugin: the next install overwrites it, and nobody
  else gets the fix. Report it; a fix lands in the catalogue and ships in a release.
- A pasted transcript leaks more than you think. Quote the few lines that show the failure, after
  sanitizing them.
- A missing feature is a Request, not a Defect; it needs the job, the failure case and a second user.

## Boundary & Related Skills

**Owns:** where and how anyone reports a Meaningfy skill or agent problem or asks for a new one: the
repository, the forms, the context to collect, what never goes into an issue.

**Does NOT own:** triaging and fixing reported issues, and the development method of the catalogue
(the skillery repository's own docs); git and PR conventions (`meaningfy-git-workflow`).

**Related:** `meaningfy-git-workflow` — branches and PRs when you fix a skill yourself in a checkout
of skillery; `guardrails` — what an agent may do without asking, which includes filing a public
issue.
