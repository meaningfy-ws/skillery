# Cross-cutting: the matrix

Checks that apply to every family: how agents report and check each other (`guardrails`, `epic-delivery`), the house rules (`rulebook`, `rule-learner`, `rule-steward`), the archive step (`spec-stewardship`) and the repository's own gates (`make validate`, `make mods`, the CI jobs, the mods that deny a command). The table uses the same columns as a family file but is exempt from the six-question rule: it need not hold a row for every question, and its citations count as coverage of an inventory id. A check that answers two questions has two rows.

| Question | Check | Technique owner | Tool | Moment | Decided by | Status |
|---|---|---|---|---|---|---|
| VAL | CHK-118 Rule approval card | `rule-learner` | one approval card | wrap-up or on request | the owner | exists |
| VAL | CHK-119 Rule usage flags | `rule-steward` | flags from session traces | weekly review | the owner | exists |
| VAL | CHK-122 Agent Gherkin scenarios | `bdd-gherkin` | pytest-bdd features under `tests/features/` | behavioural agent change | the developer | exists |
| VAL | CHK-128 Lint group, use cases and dependencies | repository lint | `use_case_coverage` | `make validate`; CI | the developer | exists |
| VAL | CHK-137 No open plan drift at archive | `spec-stewardship` | the navigator's Archive check | archive | the developer | exists |
| VER | CHK-108 Evidence before a claim | `superpowers:verification-before-completion` (external) | the verification command, read in full | before a stage is reported done | the verifier | exists |
| VER | CHK-109 Four-eyes rule | `guardrails` | a fresh subagent | after delegated work | the checker | exists |
| VER | CHK-110 Subagent base report | `guardrails` | the report template | every subagent return | the verifier | exists |
| VER | CHK-111 Output validation guardrail | `guardrails` | schema, `openspec validate --strict`, tests | before output feeds the next step | the verifier | exists |
| VER | CHK-112 Rulebook check | `rulebook` | `rules.py check` | before handing over an output | the verifier | exists |
| VER | CHK-113 Rulebook lint and golden check | `rulebook` | `rules.py lint`, `check --golden` | weekly review | the verifier | exists |
| VER | CHK-114 `openspec validate --strict` and `/opsx:verify` | `spec-stewardship` | `openspec validate --strict` | archive | the verifier | exists |
| VER | CHK-117 Rulebook write-time lint refusal | `rulebook` | `rules.py add`, exit 4 | every rule write | the verifier | exists |
| VER | CHK-122 Agent Gherkin scenarios | `bdd-gherkin` | pytest-bdd features | behavioural agent change | the verifier | exists |
| VER | CHK-124 Lint group, frontmatter and naming | repository lint | `tools/repo_lint` | `make validate`; CI | the verifier | exists |
| VER | CHK-125 Lint group, structure and size | repository lint | `tools/repo_lint` | `make validate`; CI | the verifier | exists |
| VER | CHK-126 Lint group, links and cross-references | repository lint | `tools/repo_lint` | `make validate`; CI | the verifier | exists |
| VER | CHK-127 Lint group, bundles and agents | repository lint | `tools/repo_lint` | `make validate`; CI | the verifier | exists |
| VER | CHK-128 Lint group, use cases and dependencies | repository lint | `tools/repo_lint` | `make validate`; CI | the verifier | exists |
| VER | CHK-129 Lint group, dual-CLI parity and hooks | repository lint | `tools/repo_lint` | `make validate`; CI | the verifier | exists |
| VER | CHK-131 `make validate` pytest suites | repository tests | pytest | `make validate`; CI | the verifier | exists |
| VER | CHK-132 opencode installer node tests | repository tests | node test runner | CI job `opencode-installer` | the verifier | exists |
| VER | CHK-133 `validate-spine` job | `spec-stewardship` | `make validate-spine` | CI; on demand | the verifier | exists |
| VER | CHK-134 Definition of Done checklist | `docs/development/README.md` | the section 9 checklist | before a PR | the verifier | exists |
| VER | CHK-135 `make skill-inventory` freshness | repository tests | `tests/test_skill_inventory.py` | `make validate` | the verifier | exists |
| VER | CHK-136 Review-set choice by appetite | `epic-delivery` | the `reviews` data of the workflow file | per stage | the verifier | exists |
| VER | CHK-137 No open plan drift at archive | `spec-stewardship` | `deviations.md` | archive | the verifier | exists |
| VER | CHK-138 `make mods` | repository mods | node tests, `tsc` | `make validate`; CI | the verifier | exists |
| VER | CHK-139 Generated-tree gates in CI | repository CI | `git diff --exit-code`, `bundle_gen check` | CI, every PR | the verifier | exists |
| VER | CHK-141 Navigator strict mode | the navigator mod | strict hooks | commit, archive, spawn in strict repositories | the verifier | exists |
| VER | CHK-142 Workflow phase gates of the other eight workflows | the navigator mod | `expect` and `gates` | during each workflow's phases | the verifier | exists |
| ADQ | CHK-119 Rule usage flags | `rule-steward` | flags from session traces | weekly review | the checker | exists |
| ADQ | CHK-120 Trigger probes, static | repository lint | `trigger_probe_report` | `make validate` output | the checker | exists |
| ADQ | CHK-121 Trigger probes, behavioural | `skill-creator` (external) | about 20 queries, 3 runs each | description change; on demand | the checker | exists |
| ADQ | CHK-123 Eval suites | repository evals | `claude plugin eval` | maintainer-started | the checker | exists |
| ADQ | CHK-130 Assist reports | repository lint | ownership tripwire, skill-size and other notes | `make validate` output | the checker | exists |
| ROB | CHK-121 Trigger probes, behavioural | `skill-creator` (external) | near-miss queries | description change; on demand | the adversary | exists |
| ROB | CHK-131 `make validate` pytest suites | repository tests | adversarial dependency and mod tests | `make validate`; CI | the adversary | exists |
| ROB | CHK-138 `make mods` | repository mods | the no-poll-loops test, `tsc` | `make validate`; CI | the adversary | exists |
| CLR | CHK-112 Rulebook check | `rulebook` | `rules.py check` | before handing over an output | the cold reader | exists |
| CLR | CHK-126 Lint group, links and cross-references | repository lint | `doc_register_complete` | `make validate`; CI | the cold reader | exists |
| CLR | CHK-130 Assist reports | repository lint | duplicate-fact and reciprocal-Related notes | `make validate` output | the cold reader | exists |
| RSK | CHK-110 Subagent base report | `guardrails` | "not checked" fields | every subagent return | the adversary | exists |
| RSK | CHK-115 Prompt-injection and decision-bound guardrails | `guardrails` | wrapper tools, harness permissions | agent runtime | the adversary | exists |
| RSK | CHK-116 Sensitive-data and interaction safety | `guardrails` | the approved-model rule | agent runtime | the adversary | exists |
| RSK | CHK-118 Rule approval card | `rule-learner` | dry-run warnings | wrap-up or on request | the adversary | exists |
| RSK | CHK-140 `no-poll-loops` mod | the `no-poll-loops` mod | a PreToolUse hook | before every Bash call | the adversary | exists |
| RSK | CHK-141 Navigator strict mode | the navigator mod | strict hooks | commit, archive, spawn in strict repositories | the adversary | exists |
| RSK | CHK-143 skillery-feedback sanitise-then-approve | `skillery-feedback` | the "Never in an issue" list | before filing an issue | the person who files | exists |
