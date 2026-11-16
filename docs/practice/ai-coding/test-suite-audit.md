# Audit a slow test suite

A how-to for a developer who wants an agent to make a project's test suite smaller or quicker
without losing a feature. The method belongs to the
[`test-suite-care`](../../../skills/test-suite-care/SKILL.md) skill; this page covers what you set
up around it, what you decide, and what to watch for. The agent runs every command; you set up,
check a sample and decide.

## Before you start

1. **Install the skill.** It ships in the `meaningfy-building` bundle from release 3.19.0. In
   Claude Code, refresh the catalogue with `/plugin marketplace update meaningfy-skillery`, then
   `/plugin install meaningfy-building@meaningfy-skillery` (or `/plugin update` if it is already
   installed); first-time setup is in
   [`docs/environment/dual-cli/setup-claude.md`](../../environment/dual-cli/setup-claude.md).
2. **Check the project.** The audit covers pytest suites only; for another runner the agent says
   so and stops. It needs `pytest-cov` in the project's test dependencies for the coverage run;
   without it the agent measures times only and looks for fewer kinds of waste.
3. **Use a throwaway worktree.** Run the audit in a fresh `git worktree` of the project, off the
   branch you develop on (`develop` or `main`). The project's own test command may write
   `coverage.xml`, `htmlcov/` or `.pytest_cache` into the repository during the coverage run; in a
   worktree that does no harm.
4. **Pick a quiet machine.** Timings from a loaded machine are reported as shares, not seconds.

## Run it

Open a session in the worktree and ask, for example: "our test suite takes too long, find what to
cut". The skill loads and the agent:

1. finds the project's test command for each tier it has (unit, feature, integration, end to end;
   often `make` targets) and runs each twice: once for timings, once for per-test coverage. The
   coverage run always sets `COVERAGE_CORE=ctrace`, because the default core on recent Python
   loses per-test lines without saying so. The skill's scripts do the measuring; nothing in the
   project is edited and the raw output goes to a folder outside the repository;
2. builds the scenario map, `tests/audit/scenario-map.csv`: each test function with the scenario,
   requirement or capability it serves and a confidence. On a large suite it uses one subagent per
   test folder, the most expensive part of the audit (expect a long session on thousands of tests);
3. asks you to check a sample, ten rows of each confidence drawn at random: is the test really
   about that scenario? One wrong `high` row sends that test file back to be mapped again;
4. writes `tests/audit/report-<date>.md`: where the time goes, then the proposals.

The agent opens one pull request in the project with the map and the report.

## Decide

A proposal is one of three classes:

- **Class 1** changes set-up, a marker or a lane and removes no test (for example, build an
  expensive fixture once per module instead of once per test).
- **Class 2** merges parametrised cases that test the same thing.
- **Class 3** drops a test, only when another test serves the same scenario and survives.

You decide each one in the report: approved, rejected or later, with your reason. Nothing is
deleted or merged without that. The agent then opens one pull request per approved proposal (or per
group of one class) with the wall time before and after. "No proposal approved" is a valid end of
an audit.

## Known limits

- A class 1 fixture change can let one test pass on another's work without changing a covered
  line. Its pull request must show the check the skill requires: the coverage of each affected test
  unchanged before and after, and the suite passing twice, the second time in reverse file order.
  Do not merge one without it.
- The "where the time goes" tables are added up by the agent from the timing run; no script
  computes them yet.

Something wrong or missing? Report it with the
[`skillery-feedback`](../../../skills/skillery-feedback/SKILL.md) skill.
