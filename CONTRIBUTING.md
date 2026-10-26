# Contributing to Meaningfy Agent Skills

Thank you for contributing. This page is the entry point; the detail lives in the pages it links to.

## How a change gets in

1. **Raise or pick an issue.** Use the templates in [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/):
   **Defect** for a skill or agent that misbehaved, fired wrongly or failed to install; **Request**
   for a new skill or agent. The loop they feed is
   [§7 of the development method](docs/development/README.md#7-feedback-and-improvement-loop).
2. **Choose the path**, EPIC or direct PR, by the change-path rule in
   [§3 of the development method](docs/development/README.md#3-lifecycle--skills).
3. **Branch from `develop`** (fork first if you are external) and follow the authoring guide,
   [`docs/development/creating-skills.md`](docs/development/creating-skills.md). Agents follow
   [`docs/development/agent-template.md`](docs/development/agent-template.md).
4. **Run `make validate`** until it is green. CI runs it again on the PR.
5. **Open a pull request into `develop`** with a conventional-commit title, what changed and why,
   the linked issue, and the before/after on the failure case. Branch naming and PR mechanics are
   in [`meaningfy-git-workflow`](skills/meaningfy-git-workflow).
6. **Review.** A maintainer checks the change against the Definition of Done and merges it.

## When is it done?

When every line of the [Definition of Done](docs/development/README.md#9-definition-of-done) is true
and `make validate` is green. That is the only checklist; this page has none of its own.

## Licence

By contributing you agree that your contribution is licensed under the repository's licence
(Apache 2.0), unless your skill carries its own `LICENSE.txt`. Third-party material is attributed in
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

Be respectful, give constructive feedback, and respect licensing and attribution.
