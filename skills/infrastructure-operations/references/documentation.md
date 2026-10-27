# Documentation: three audiences

Every recorded change keeps three audiences current, in the same change:

| Audience | Where | Updated with |
|---|---|---|
| Machines (agents) | the OpenSpec change or its `execution-log.md`; the repos' specs and `AGENTS.md` | what was done, step by step, and the spec delta |
| People, in the repo | READMEs and `docs/runbooks/` of the repo that holds the system | the new state, and the runbook if the procedure changed |
| People, in Confluence | the Confluence page that summarises the system, and the change log page | a short summary that points to the repo |

## The repo wins

On a contradiction between Confluence and a repository, the repository is trusted and the Confluence
page is groomed. Never change a repository to match Confluence. Drift between the three is reported
by the weekly part of the daily check-up (`service-reliability`).

- A Confluence page summarises and points; it does not restate a procedure the repo holds.
- A Confluence page never holds a credential, not even "temporarily".
- Live status is not posted as page comments; status lives in one place, the repo's record
  ([interventions](interventions.md)).

## Writing docs that stay true

- **Point, do not restate.** A doc that copies a port list, a version or a variable from code rots on
  the next change. Name the file and say why it is so.
- **Say where a new value goes.** Every repo states which tracked file holds routine settings and
  which ignored file holds secrets and machine paths.
- **A skeleton is not a doc.** A runbook or a spec "Purpose: TBD" left unfinished is a finding.
- Decision citations belong in code too: a banner `# openspec change: <change-id>` on a block, and
  `(<change-id> DEC-<n>)` on a line whose reason is a decision.
- Doc-only commits must not redeploy; the commit rule is owned by `meaningfy-git-workflow`.

## Runbooks

A runbook is for a recurring operation on one system and lives with that system, in its repo; this
skill holds only the shape: [`runbook.md`](../assets/templates/runbook.md). Write it from the first
real run, and say so in its status line. Its parts:

1. Title, scope, status ("written from the first real run: `<date>`, change `<change-id>`").
2. **Every run:** re-check the live state, announce, get the go-ahead for anything irreversible, code
   first, the plan gate (nothing destroyed unless that is the point), report in the announcement
   thread.
3. Numbered steps, each with how to verify it; irreversible steps marked ⛔.
4. Rollback.
5. When it goes wrong: a table of symptom → cause → what to do.

## Handover

**The test:** could the colleague who is not a devops engineer run this operation tomorrow, with
the agent, from the repos and the skills alone? Anything only in one person's head, on one laptop or
in one person's archive is a finding to move into the repo (or, for a secret, into the password
manager per `infrastructure-security`). Applies run from merged `main` with the plan on the PR, so
who applied what and when is in git, not in memory.
