# The safe-change protocol

Every operation, on any layer, by a person or an agent, follows these seven steps in order. A step is
never skipped because the change "looks small".

## The steps

1. **Read the state.** Both repos (`AGENTS.md`, the stack or VM, its specs and runbook) and the live
   state (monitoring, the cloud, the host). The live state decides. A fact you cannot read is graded
   *unknown* on the consent card, never guessed.
2. **State the view and the plan.** In plain words: what is wrong or wanted, what will change, in
   which files, and what will not change.
3. **Dry run.** The tool's own preview, saved: `terraform plan -out=<name>.tfplan` (machines),
   `ansible-playbook <playbook>.yml --check --diff` (configuration), `docker compose config`
   (services). **Stop on anything unplanned:** a destroy, a replace (`-/+`) or a data change that
   step 2 did not name stops the run; show the difference and go back to step 2.
4. **Ask for consent with a decision card**, in the shape and rules of `executive-communication`
   (`references/decision-request.md`), no variant. For an operation the facts are: which service, who
   notices, for how long, what it costs, how it is undone. The raw plan goes under *Evidence*, never
   instead of the facts. Worked example: [`assets/consent-card.example.md`](../assets/consent-card.example.md).
5. **Apply exactly what was shown.** The saved plan file, the same playbook and limit, the same
   commit. If anything changed since the card, the card is void: back to step 3.
6. **Verify** against monitoring and the service: healthchecks, the URLs answer, metrics normal, and
   for Terraform a new `plan` showing no changes.
7. **Record.** The records of `interventions.md` and the three audiences of `documentation.md`.

## Non-trivial changes

A change is non-trivial when it needs an OpenSpec change (`change-shapes.md`).

**MUST: a baseline acceptance run before the change, and an independent rescoring of the plan by
`infra-reviewer` before execution.** *Why:* the baseline shows which checks already fail, so a failure
after the change is known to be new; the rescoring catches a plan its author cannot see past.

## The reviewer

`infra-reviewer` runs as a subagent on every infrastructure change: on the plan before execution, on
the branch mid-implementation, at its end, or several of these. It reads the plan, conformance to the
devops skills, blast radius and undo path. It is read-only and approves nothing. **The caller posts
its report as a PR comment headed `## infra-reviewer report`**; the author still decides. Why it is
practised rather than enforced, and break-glass, are owned by `infrastructure-security`.

**How the reviewer works.**

- **Follow the PR to its change.** A PR serving an OpenSpec change is judged with that change's PLAN:
  the blast radius is set by how the PLAN runs the code, not by the diff alone.
- **A stack built on the VM:** `docker compose config` cannot show what the build produces; ask
  whether the deploy reuses the build cache or rebuilds from a floating base, and put the answer on the card.
- **Read what the dry run cannot show.** Ansible check mode skips `command` and `shell` tasks, so a
  data change they make never appears in `--check --diff`; read every such task the run reaches.
- **Dry run out of reach** (it needs SSH, a vault password, a file on someone's machine): report the
  gap and require the author's saved dry-run output on the PR.
- **Severities:**

  | Severity | Means | Blocks |
  |---|---|---|
  | **high** | an unplanned data change, a destroy, an outage or an exposure the plan does not name | the execution of the plan (and the merge when the merge itself applies) |
  | **medium** | missing evidence, a broken MUST, docs the change makes dangerous | the merge |
  | **low** | a SHOULD, a contract or hygiene gap | nothing; a follow-up |

- **Pre-existing defects** in the files or plan the PR touches, and in the workflow its merge runs,
  are reported, marked *pre-existing*, at their real severity, and proposed as follow-up issues; they
  block only when this change makes them worse.
- **No checks in the repository:** a finding (`repo-checks.md`); list the checks run by hand, which
  count as evidence, not as the gate.
- **A behaviour change that arms existing docs** (a documented command that now does more) is a
  medium finding until the docs change in the same PR.
- **No Compose file touched:** the conformance result is "Not applicable: no Compose file touched".

## When it goes wrong

| Failure | What to do |
|---|---|
| Apply fails midway | Stop; show the state; propose the documented undo; record the failure |
| Verification fails after apply | Propose the rollback (revert and redeploy, or the documented undo) as a new card |
| `bw` locked or the item missing | Ask the person to unlock it or name the item; never ask for the value in chat (`infrastructure-security`) |
