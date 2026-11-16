# Ansible practice

Ansible configures what Terraform made, and the few services that do not run in Docker. The
inventory groups hosts by the `role` label.

## Runs

- **Dry run first:** `ansible-playbook <playbook>.yml --limit <group> --check --diff`, its output on
  the PR for anything that touches production; read the `command` and `shell` tasks it skips.
- **A second run shows `changed=0`:** where `shell` or `command` is unavoidable, add `creates:` or
  `changed_when:`.
- **Tags on `include_tasks`** apply to the include only, not to the tasks it pulls in; use
  `apply: {tags: [...]}` or `import_tasks`, and check which tasks a `--tags` run really reaches.
- Rehearse on a non-production host first (`environments.md`); pins as in `terraform-practice.md`.

## Playbooks and variables

- A VM that runs a stack uses the Docker-host skeleton, roles in a fixed order: OS hardening, host
  firewall, data volume, Docker, then optional slots (CI tools, node exporter, cAdvisor, an edge
  agent, backup): [`docker-host-playbook.yml`](../assets/templates/docker-host-playbook.yml).
- A group's variables hold only what differs for that group: [`group-vars.yml`](../assets/templates/group-vars.yml).
- **A list in a group's variables replaces the parent group's list; it does not merge.** A group that
  sets the host firewall's port list lists every port it needs, SSH included.

**SHOULD: shared variables and roles instead of copies once a block repeats a third time; one
generic, parameterised backup role with one credential per service** (owned by
`service-reliability`). *Why:* a fix made in one copy is missing in the others.

## Roles

An in-house role follows the [role contract](../assets/templates/role-contract/README.md).

**MUST: a role's defaults carry no other service's values, and a generic role touches only what its
caller lists; its default list is empty.** *Why:* a generic volume role whose default directory list
belonged to one application reset ownership on other hosts on every run.

A service that boots with a default login, or unsafe before configuration finishes, **fails closed**:
stopped before the unsafe window, a `rescue` stops it again and fails with a named error, every run
re-verifies the property from outside: [`fail-closed-tasks.yml`](../assets/templates/fail-closed-tasks.yml).
No insecure fallback either: no default password, default sudo or world-open default allow-list
(the rule is `infrastructure-security`'s).

Third-party roles: set only their documented variables, never depend on their internal file names,
task names or handlers. Secrets in Ansible follow `infrastructure-security`.

## Testing

`ansible-lint` (production profile) and `yamllint` on every PR (`repo-checks.md`). Molecule is the
next tier, for the two or three roles that matter most (OS hardening, Docker host), not every role.
