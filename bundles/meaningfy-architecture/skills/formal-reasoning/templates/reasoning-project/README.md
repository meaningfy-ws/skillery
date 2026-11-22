# Reasoning project

One folder per rule set or model under test. Copy `clingo/` or `prolog/` and replace the content.

```
<project>/
  rules.lp | rules.pl   the rules, each with a `%%` paraphrase line above it (one rules file only)
  facts.lp | facts.pl   the fixture facts, on base predicates only (optional)
  tests.toml            one [[test]] per question, with the answer agreed beforehand
  runs/                 saved reports: python run_rules.py <project> --json > runs/<date>.json
```

Run it with `python scripts/run_rules.py <project>` from the `formal-reasoning` skill folder.
Exit 0 means every test passed.

**What stays in the spine.** Why the rules exist, who owns them and which decisions shaped them
belong in the project's OpenSpec change and its decisions, not here. This folder holds only what the
engine runs and the tests that check it. When the rules come from a text, keep the clause ids and the
source hash as `rules-from-text` in the skill's references describes.
