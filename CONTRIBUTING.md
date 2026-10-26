# Contributing to Meaningfy Agent Skills

Thank you for contributing to the Meaningfy Agent Skills repository! This guide explains how to submit new skills or improvements.

## Getting Started

1. **Fork the repository** (if you're an external contributor)
2. **Create a new branch** for your skill:
   ```bash
   git checkout -b skills/my-new-skill
   ```
3. **Follow the [Creating Skills Guide](spec/CREATING_SKILLS.md)**
4. **Submit a pull request** with your skill

## Before you submit

There is one done-checklist: [§9 of the development method](docs/development-method.md#9-definition-of-done)
(Definition of Done). Your PR is ready when every line of it is true and `make validate` is green; most
lines are enforced by `make validate` itself. The structural detail of a skill — frontmatter fields,
`references/`, `scripts/`, `assets/`, examples — is in the
[Creating Skills Guide](spec/CREATING_SKILLS.md).

## Submission Process

### Step 1: Create Your Skill

Follow the [Creating Skills Guide](spec/CREATING_SKILLS.md) to develop your skill.

### Step 2: Update the Skill Inventory

Add your skill to its bundle's **Skills** cell in the **What's inside** table in README.md (the table
groups skills by bundle, one cell per bundle), and bump the skill count in the sentence above it:

```markdown
| **meaningfy-building** | … · **my-new-skill** | …build software with the spine |
```

### Step 3: Register in a bundle

Add your skill's directory name to the `skills` list of exactly one bundle in
[`bundles.yaml`](bundles.yaml), the **single bundle definition** (an agent goes in that bundle's
`agents` list the same way). Bundle names are not pinned, so **no code edit is needed**. Then render
the derived files:

```yaml
  - name: meaningfy-building
    skills: [clarity-gate, my-new-skill]
```

```bash
make bundles          # renders .claude-plugin/marketplace.json, bundles/ and tools/opencode-catalogue.json
make skill-inventory  # regenerates docs/skill-inventory.md (first add a PURPOSE_OF entry in tools/skill_inventory.py)
```

Keep the SKILL.md **body CLI-agnostic** (no `/opsx:` or `.claude/` paths) and its frontmatter strict
YAML (quote a `description` that contains `: `). Later edits to the skill's content need no
regeneration. Full rules: [`AGENTS.md` → Dual-CLI authoring rules](AGENTS.md#dual-cli-authoring-rules).

### Step 4: Create a Pull Request

1. **Commit your changes:**
   ```bash
   git add skills/my-new-skill bundles.yaml bundles/ .claude-plugin/marketplace.json tools/opencode-catalogue.json \
           README.md docs/skill-inventory.md tools/skill_inventory.py
   git commit -m "feat(skills): add my-new-skill"
   ```

2. **Push to your branch:**
   ```bash
   git push origin skills/my-new-skill
   ```

3. **Create a Pull Request** on GitHub with:
   - Clear title: "Add [skill-name]"
   - Description of what the skill does
   - Reference any related issues
   - Confirmation that the [§9 Definition of Done](docs/development-method.md#9-definition-of-done) is true

## Skill Guidelines

### Scope: What Makes a Good Skill?

✅ **Good skill:**
- Focuses on a specific domain or use case
- Provides value for agents on **both CLIs** (Claude Code and opencode)
- Is well-documented with examples
- Is discoverable by clear description
- Has clear limitations documented

❌ **Not a good fit:**
- Too broad/general (e.g., "helper skill")
- Poorly defined scope or description
- Minimal documentation
- Duplicate of existing skill
- Requires undocumented external dependencies

### Naming Convention

Use lowercase with hyphens:
- ✅ `data-analyzer`, `json-transformer`, `ml-workflow`
- ❌ `DataAnalyzer`, `json_transformer`, `ml-workflow-v2`

### Description Quality

Your description is the primary discovery mechanism. Make it clear:

✅ **Good:**
```
description: Transform and validate JSON data. Use for parsing files,
converting formats, validating against schemas, or generating reports.
```

❌ **Poor:**
```
description: JSON skill for data
```

### Progressive Disclosure

Keep SKILL.md concise by organizing documentation:

```
SKILL.md (quick-start, core concepts)
  ↓
references/<domain-meaningful-name>.md   e.g. clarity-gate-checklist.md, mapping.md
```

Use **domain-meaningful filenames** under `references/` — not mandated `REFERENCE.md` / `EXAMPLES.md`
/ `ADVANCED.md` names.

## PR Review Process

When you submit a pull request:

1. **Automated Checks:** GitHub Actions will verify:
   - YAML frontmatter validity
   - Required files present
   - Directory naming conventions
   - File size limits

2. **Code Review:** Maintainers will check:
   - Skill quality and documentation
   - Alignment with guidelines
   - No conflicts with existing skills
   - License compliance

3. **Testing:** We may test:
   - Skill discoverability
   - SKILL.md formatting
   - Script functionality

4. **Merge:** Once approved, your skill is merged and becomes available to all users!

## Updating Existing Skills

To update an existing skill:

1. **Make changes** to the skill files
2. **Test thoroughly** to ensure no regressions
3. **Update version** in YAML metadata if making breaking changes
4. **Document changes** in your PR description
5. **Submit PR** with clear description of what changed

## Removing Skills

To remove or deprecate a skill:

1. **Notify users** in the PR description
2. **Remove it from `bundles.yaml`** and run `make bundles`
3. **Keep skill directory** (for history) but mark as deprecated
4. **Add notice** to SKILL.md if keeping it:
   ```yaml
   ---
   name: old-skill
   description: DEPRECATED - Use new-skill instead
   ---
   ```

## Best Practices for Contributors

### Documentation
- **Write clear examples** that users can follow
- **Include edge cases** users should know about
- **Cross-reference** related skills
- **Use diagrams/images** in assets for complex concepts

### Code Quality
- **Keep scripts simple** and focused
- **Add error handling** for common issues
- **Document dependencies** explicitly
- **Use meaningful variable names**

### Testing
- **Test with your agent CLI** (Claude Code or opencode) to verify discoverability
- **Verify examples work** as written
- **Check all links** in documentation
- **Validate YAML** syntax

### Licensing
- **Respect open source licenses** of dependencies
- **Add attribution** to THIRD_PARTY_NOTICES.md
- **Include per-skill LICENSE.txt** if proprietary
- **Clearly state** any restrictions

## Questions & Support

### Issues with Submission?

Use the issue templates in [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/) — **Defect** for a
skill/agent that misbehaved, fired wrongly, or failed to install; **Request** for a new skill or agent.
The improvement loop they feed is described in
[`docs/development-method.md` §7](docs/development-method.md#7-feedback-and-improvement-loop).

If you encounter problems:

1. **Check the [Creating Skills Guide](spec/CREATING_SKILLS.md)** - likely covered there
2. **Review existing skills** for examples
3. **Create an issue** in the repository with:
   - Clear description of your problem
   - Relevant file excerpts
   - What you've already tried

### Suggesting Changes

Have suggestions for the repository itself?

1. **Create an issue** with your suggestion
2. **Link to related issues** if applicable
3. **Explain the rationale** for your suggestion
4. **Provide examples** if helpful

## Code of Conduct

All contributors are expected to:
- Be respectful and inclusive
- Provide constructive feedback
- Focus on the quality of skills
- Respect licensing and attribution requirements

## Recognition

Contributors will be:
- Listed in the skill's metadata (if desired)
- Credited in any announcements
- Acknowledged in the repository history

## License

By contributing to this repository, you agree that your contributions will be licensed under the same license as the repository (Apache 2.0) unless otherwise specified in your skill's LICENSE.txt.

## Summary

1. **Create your skill** using the [Creating Skills Guide](spec/CREATING_SKILLS.md)
2. **Update README.md** with your skill in inventory
3. **Register it in `bundles.yaml`** and run `make bundles`
4. **Check [§9 Definition of Done](docs/development-method.md#9-definition-of-done)**
5. **Submit a PR** with clear description (`make validate` must pass)
6. **Respond to feedback** during review
7. **Celebrate** when merged! 🎉

Thank you for contributing to Meaningfy Agent Skills!
