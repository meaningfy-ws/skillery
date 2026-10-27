# D — Shaping Q&A with the owner (2026-10-27)

**Status:** SECONDARY input. Preserved, never groomed, never deleted.

**Provenance:** Claude Code session with the owner, 2026-10-27, after the reconnaissance (files A–C).
The owner's words are quoted or closely paraphrased; the agent's proposals the owner accepted are
marked *accepted*; the agent's own calls are left to the EPIC and marked there.

## Q1. What is the bundle for?

> "What we need now is develop robust devops skills and agents that will cover our entire devops
> lifecycle and monitoring, and these agents will be reliable."

Odoo is one stack among many, not the focus. The goal is a **solid, reliable, repeatable,
deterministic, precise and disciplined** practice across infra development, provisioning,
deployment, monitoring and analysis — and a judgement whether the current practice is good enough
for a small company or needs further policies to harden it.

## Q2. Sources of truth

- On a contradiction, **the repositories are most likely more current than Confluence**.
- **Three audiences, all kept current:** Confluence (MSC) maintained and groomed for **people**;
  the GitHub repos' documentation up to date for **people**; OpenSpec changes and specs for
  **machines**.
- **skillery holds only the practice and the expectations on setup and operations; everything else
  lives in the repos — one for stacks (`infrastructure-stacks`), one for cloud provisioning
  (`cloud-infrastructure`).**

## Q3. Exceptions

The AWS WorkSpaces access and the OP delivery are **client-specific, exceptional procedures, likely
dropped soon**. They are not generalised into the method.

## Q4. Who uses it

> "It is mainly me, or my colleague, who are not devops engineers, working with the agent to do any
> of the needed operations. Also I can imagine the agent working alone on a scheduled call to respond
> to incidents, or to do a daily check-up inspection and intervene if needed."

So: the expertise lives in the bundle, not in the person; consent points must be understandable by a
non-specialist; and an unattended mode exists (daily check-up, incident response).

## Q5. What may the agent do alone (e.g. at 3 a.m.)?

> "If it is just a restart or actions that resolve the issue without consequences then just do it,
> but if the consequences have impact, for significantly increased costs or blocking something for
> a long time, then park it until someone intervenes. Best channel to inform is infra-alerts or
> operations channels on Slack."

Added later: **risk of critical data loss** is also park-and-notify.

The agent's proposals the owner called "good ideas in general" (*accepted*):
- the unattended action list is **written down**, not judged each night; anything not on it is
  parked;
- **no loops**: after one or two failed attempts it stops and escalates;
- every unattended action is recorded (what, why, result);
- data-touching actions, infrastructure-code applies and security changes are parked too.

## Q6. Credentials

> "I want to give you access to bw (Bitwarden) Meaningfy passwords, so that you can access various
> services and test things and get to servers via ssh."

The agent may read credentials from the company Vaultwarden through the `bw` CLI. How (scope,
identity, never printing values) is decided in the EPIC.

## Q7. Where the agent works

> "I will always start the agent in the stacks repo, there is the openspec specs, and from there the
> agent will work on the stacks and on the cloud infra repo, as siblings in tandem."

No pointer file is needed: the agent's home is `infrastructure-stacks` (its `openspec/` is the spine
for infrastructure changes); `cloud-infrastructure` is its sibling checkout.

## Q8. Deliverables requested

Save the know-how in `inputs/`; then write the proposal, the design and the plan.

## Q9. Answers to the PLAN's open questions (2026-10-27, later)

1. **Where `ops-watch` runs:** undecided — possibly a dedicated server, a Claude scheduled task, or
   OpenClaw.
2. **Credentials:** "the agent always uses my bw session; I can also leave my master password to an
   agent in a computer local environment for convenience; no need to have a dedicated bw agent, just
   use my bw credentials freely; I am the infra owner and I trust the agent to use the credentials
   but not see them."
3. **Review:** no GitHub Team subscription. "We want a review triggered as a subagent as a practice
   and good discipline; it can be triggered in the middle or at the end of epic change
   implementation."
4. **Backups:** decided per stack; "we do not want to encrypt them, they are okay unencrypted as long
   as we can access them; some stacks do not need backups, so this is to be decided."
5. **Incidents:** "open security incidents in GitHub issues, but always notify alerts in the
   infra-alerts channel, and once some work was done post in operations channel on Slack summaries
   of what was done."
6. **Full reports:** stored in the stacks repo under `docs/assessments/`.
7. Asked whether every file of both repos was read: it was not (targeted read). Two exhaustive
   reads with pattern extraction were commissioned (file E, when folded).
