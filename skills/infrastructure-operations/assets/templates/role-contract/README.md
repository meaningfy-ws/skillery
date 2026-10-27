<!-- Use when writing an in-house Ansible role: copy this README into the role and fill every <placeholder>. -->
# Role `<role_name>`

<One sentence: what this role configures, and on which hosts.> Decision: `<change-id>` DEC-<n>.

## Contract

| Input | Required | Meaning |
|---|---|---|
| `<role_name>_<input>` | yes | <what it is; where the value comes from> |
| `<role_name>_<secret_input>` | yes | <secret, from the vault-encrypted variables; never printed> |
| `<role_name>_<option>` | no (default `<value>`) | <what it changes> |

- Defaults are prefixed `<role_name>_` and name nothing that belongs to another service. A list
  default is empty: the caller names what the role manages.
- The role touches only what its inputs list.
- `tasks/main.yml` asserts every required input before any change.
- Templates it writes start with `# Managed by Ansible`; edits on the host are overwritten.
- Tasks that handle a secret carry `no_log: true`.
- Handlers are flushed before a timer is enabled.
- It ends with a self-check from outside: <what is verified>.

## Use

```yaml
- role: <role_name>
  vars:
    <role_name>_<input>: <value>
```
