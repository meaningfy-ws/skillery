# Ansible practice

Ansible configures what Terraform made: OS hardening, host firewall, data volume, Docker,
monitoring agents, timers, and the few services that do not run in Docker. The inventory groups
hosts by the `role` label.

## Runs

- **Dry run first:** `ansible-playbook <playbook>.yml --limit <group> --check --diff`, its output on
  the PR for anything that touches production. Check mode skips `command` and `shell` tasks: what
  they would change is not in that output, so read them.
- **Tags and includes:** a tag on `include_tasks` applies to the include only, not to the tasks it
  pulls in; use `apply: {tags: [...]}` or `import_tasks`, and check which tasks a `--tags` run
  really reaches before you rely on it.
- **Idempotent:** use modules, not `shell`; where `shell` or `command` is unavoidable, add
  `creates:` or `changed_when:`. A second run shows `changed=0`.
- **Rehearse on a non-production host** before production ([environments](environments.md)).
- Pins: exact versions in `requirements.yml` ([terraform-practice](terraform-practice.md), *State
  and pins*).

## Playbooks and variables

- A VM that runs a stack uses the Docker-host skeleton, roles in a fixed order: OS hardening, host
  firewall, data volume, Docker, then optional slots (CI tools, node exporter, cAdvisor, an edge
  agent, backup). Start from [`docker-host-playbook.yml`](../assets/templates/docker-host-playbook.yml).
- A group's variables hold only what differs for that group; start from
  [`group-vars.yml`](../assets/templates/group-vars.yml).
- **A list in a group's variables replaces the list of a parent group; it does not merge.** A group
  that sets the host firewall's port list must list every port it needs, including SSH.

**SHOULD: shared variables and roles instead of copies once a block repeats a third time; one
generic, parameterised backup role.** *Why:* copies drift, and a fix made in one copy is missing in
the others. The backup role itself is owned by `service-reliability`.

## Roles

An in-house role follows the [role contract](../assets/templates/role-contract/README.md):
role-prefixed defaults with a header citing the decision; `tasks/main.yml` opens with
`ansible.builtin.assert` on its required inputs; templates marked "Managed by Ansible"; handlers
flushed before timers are enabled; `no_log: true` on every task that handles a secret; a self-check
at the end; a README stating the contract.

**MUST: a role's defaults carry no other service's values, and a generic role touches only what its
caller lists.** *Why:* a generic volume role whose default directory list belonged to one application
resets ownership on other hosts on every run.
A generic role's default list is empty; the caller names what it manages.

A service that boots with a default login, or in any unsafe state before configuration finishes,
**fails closed**: it is stopped before the unsafe window, a `rescue` stops it again and fails with a
named error, and every run re-verifies the security property from outside. Start from
[`fail-closed-tasks.yml`](../assets/templates/fail-closed-tasks.yml).

Third-party roles: set only their documented variables. Never depend on their internal file names,
task names or handlers; a role update breaks that silently.

Secrets in Ansible (vault-encrypted variables, never printed) follow `infrastructure-security`.

## Testing

`ansible-lint` (production profile) and `yamllint` run on every PR ([repo-checks](repo-checks.md)).
Molecule is the next tier, for the two or three roles that matter most (OS hardening, Docker host),
not for every role.
