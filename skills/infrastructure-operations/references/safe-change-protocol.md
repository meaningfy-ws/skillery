# The safe-change protocol

Every operation, on any layer, by a person or an agent, follows these seven steps in order. A step is
never skipped because the change "looks small": the small changes are the ones nobody reads twice.

## The steps

1. **Read the state.** Both repos (`AGENTS.md`, the stack or VM concerned, its specs and runbook) and
   the live state (monitoring, the cloud, the host). Docs drift; the live state decides. A fact you
   cannot read (no access to monitoring or the host) is graded *unknown* on the consent card, never
   guessed.
2. **State the view and the plan.** In plain words: what is wrong or wanted, what will change, in
   which files, and what will not change.
3. **Dry run.** The tool's own preview, saved:

   | Layer | Dry run |
   |---|---|
   | Machines | `terraform plan -out=<name>.tfplan` |
   | Configuration | `ansible-playbook <playbook>.yml --check --diff` |
   | Services | `docker compose config` |

   **Stop on anything unplanned.** A destroy, a replace (`-/+`) or a data change that step 2 did not
   name stops the run: show the difference and go back to step 2.
4. **Ask for consent with a decision card.** The card is owned by `executive-communication`
   (`references/decision-request.md`); use its shape and rules, do not invent a variant. For an
   operation, the facts a non-specialist needs are: which service, who notices, for how long, what it
   costs, how it is undone. The raw plan goes under *Evidence*, never instead of the facts. A worked
   example is [`assets/consent-card.example.md`](../assets/consent-card.example.md).
5. **Apply exactly what was shown.** The saved plan file, the same playbook and limit, the same
   commit. If anything changed since the card, the card is void: back to step 3.
6. **Verify.** Against monitoring and the service itself: healthchecks, the URLs answer, metrics
   normal, and for Terraform a new `plan` showing no changes.
7. **Record.** The records of [interventions](interventions.md) and the three audiences of
   [documentation](documentation.md).

## Non-trivial changes

A change is non-trivial when it needs an OpenSpec change (see [change-shapes](change-shapes.md)).

**MUST: a baseline acceptance run before the change, and an independent rescoring of the plan by
`infra-reviewer` before execution.** *Why:* the baseline run shows which checks already fail (they
are expected to), so a failure after the change is known to be new; the rescoring catches a plan its
author cannot see past.

## The reviewer

`infra-reviewer` runs as a subagent on every infrastructure change: on the plan before execution, on
the branch in the middle of the implementation, at its end, or several of these. It reads the plan,
conformance to the devops skills, blast radius and undo path. It is read-only and approves nothing.
**The caller posts its report as a PR comment headed `## infra-reviewer report`**; the author still
decides. Why it is practised rather than enforced, and the break-glass rule for an emergency change,
are owned by `infrastructure-security`.

**How the reviewer works.**

- **Follow the PR to its change.** A PR that serves an OpenSpec change is judged with that change's
  PLAN: the blast radius is set by how the PLAN runs the code, not by the diff alone.
- **A stack built on the VM:** `docker compose config` cannot show what the build will produce; ask
  the author whether the deploy reuses the build cache or rebuilds from a floating base, and put the
  answer on the card.
- **Read what the dry run cannot show.** Ansible check mode skips `command` and `shell` tasks, so a
  data change they make never appears in `--check --diff`; read every such task the run reaches.
- **Dry run out of reach.** When a real dry run needs access the reviewer must not use (SSH, a
  vault password, a file on someone's machine), report the gap and require the author's saved dry-run
  output on the PR.
- **Severities:**

  | Severity | Means | Blocks |
  |---|---|---|
  | **high** | an unplanned data change, a destroy, an outage or an exposure the plan does not name | the execution of the plan (and the merge when the merge itself applies) |
  | **medium** | missing evidence, a broken MUST, docs the change makes dangerous | the merge |
  | **low** | a SHOULD, a contract or hygiene gap | nothing; a follow-up |

- **Pre-existing defects** in the files or the plan the PR touches, and in the workflow its merge
  runs, are reported, marked
  *pre-existing*, at their real severity, and proposed as follow-up issues; they block only when
  this change makes them worse.
- **No checks in the repository:** say so as a finding (`repo-checks.md`) and list the checks run by
  hand; hand-run checks count as evidence, not as the gate.
- **A behaviour change that arms existing docs** (a documented command that now does more) is a
  medium finding until the docs change in the same PR.
- **No Compose file touched:** the conformance result is "Not applicable: no Compose file touched".

## When it goes wrong

| Failure | What to do |
|---|---|
| `../cloud-infrastructure` missing | Report it and stop that part of the work; never guess a location |
| Dry run shows an unplanned destroy or replace | Stop, show the difference, back to step 2 |
| Apply fails midway | Stop; show the state; propose the documented undo; record the failure |
| Verification fails after apply | Propose the rollback (revert and redeploy, or the documented undo) as a new card |
| `bw` locked or the item missing | Ask the person to unlock it or name the item; never ask for the value in chat (`infrastructure-security`) |
| A template and an existing file disagree | The template wins for new work; report the existing file's difference as a conformance gap, do not copy it |
| A repo's `AGENTS.md` rule contradicts a rule of a devops skill | Apply the skill's rule; report the contradiction for the repo's own change |
