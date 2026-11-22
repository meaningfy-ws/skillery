## MODIFIED Requirements

### Requirement: A pull request is watched and merged by one command
The Merge step SHALL hand the wait to one command: by default one background command
`gh pr checks <n> --watch --fail-fast && gh pr checks <n> --json bucket -q 'length > 0 and all(.[]; .bucket == "pass" or .bucket == "skipping")' | grep -qx true && gh pr merge <n> --merge --delete-branch`,
started once the pull request lists its first check run and awaited by its completion notice
only. The middle guard SHALL stand between the watch and the merge, because `gh pr checks
--watch` exits 0 when no check is registered yet and when a run is cancelled by a newer push: the
merge runs only when the pull request lists at least one check and every check passed or was
skipped. At step 6 only, after the hand-over note is committed and the approval (or the grant) is
given, and where the repository has required checks, `gh pr merge <n> --auto --merge
--delete-branch` MAY run in its place, so that the platform merges when the checks pass. The
`--auto` form SHALL NOT run when the pull request opens. The lead SHALL NOT re-read a running
task's output. On a non-zero exit the lead SHALL first run `gh pr view <n> --json
state,mergeStateStatus` and `gh pr checks <n>` to tell a red check, a check not yet registered or
still running, a refused merge and a merge already done. The merge method SHALL follow the
repository's own. Without the developer's grant for the EPIC, the developer SHALL approve the
merge before the command runs (lean-delivery D-23). A fix after a red check SHALL be committed
before the hand-over note, the note re-committed as the last commit, and the command run again
(lean-delivery DEC-6, D-7, D-24; issues #283, #337).

#### Scenario: Green checks
- **WHEN** at step 6 the hand-over note is committed, the approval or grant is given, and the repository has required checks
- **THEN** the lead runs `gh pr merge <n> --auto --merge --delete-branch` once, in place of the watch-and-merge command, and the platform merges and deletes the branch when the checks pass

#### Scenario: No auto-merge
- **WHEN** the repository has no auto-merge and the pull request lists its first check run
- **THEN** the lead starts the one background watch-and-merge command and its notice is the only wait

#### Scenario: A running watch
- **WHEN** the background command is still running
- **THEN** the lead reads none of its output until the completion notice arrives

#### Scenario: No check registered yet
- **WHEN** the command starts before the pull request lists any check run, and the watch exits 0 at once
- **THEN** the guard finds no check, nothing is merged, the command exits non-zero, and the lead starts it again once a check is listed

#### Scenario: A run cancelled by a newer push
- **WHEN** the hand-over note is pushed while CI runs, the first run is cancelled and the watch exits 0 before the new run reports
- **THEN** the guard finds the new head commit's checks missing or pending, nothing is merged, and the command exits non-zero

#### Scenario: No merge authority granted
- **WHEN** the developer has granted no merge authority for the EPIC
- **THEN** the lead asks the developer to approve the merge before either command runs

#### Scenario: A red check
- **WHEN** a check fails
- **THEN** nothing is merged and the lead reads the pull request's state and the failing check

#### Scenario: A fix after a red check
- **WHEN** a check fails and that failure is fixed
- **THEN** the fix is committed, the hand-over note is re-committed as the last commit, and the command runs again

## ADDED Requirements

### Requirement: Findings are grouped by place before the floor
In step 4 the lead SHALL group the findings of all reviewers and the tester by `file:line` before
deciding them, so that one defect raised by several lenses is decided once, under the highest
severity any lens gave it (issue #145).

#### Scenario: One line raised by three lenses
- **WHEN** L3, L4 and L5 each raise the same single-line simplification, one of them as a Warning
- **THEN** the lead records one decision for it, at Warning, naming the three finding ids
