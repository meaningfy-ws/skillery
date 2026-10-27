# Daily check-up

The answer to "is everything ok?": the same nine checks, in the same order, every day. `ops-watch` runs
it on a schedule; a person can ask for it in a session. It reads and reports; it changes nothing.

## The checks, in this order

1. **Alerts** firing now, or silenced for more than 24 hours.
2. **Scrape targets** that are down.
3. **Backups**: freshness of each backed-up service, and any restore drill older than 90 days
   ([backup-restore.md](backup-restore.md)).
4. **Certificates** expiring in less than 14 days, read from the TLS-expiry probes.
5. **Disks** forecast full in less than 7 days (`predict_linear` on the filesystem metrics).
6. **Expiry dates** in code: every `expires: YYYY-MM-DD` comment in both infrastructure repositories
   that has passed or falls within 14 days.
7. **Open issues** labelled `ops-parked` or `incident`.
8. **Stack conformance**: run `check_stack.py` (owned by `stack-operations`) on every stack and
   report what changed since the previous report. The first report is the **baseline**: missing
   counts by rule, with every S7 (exposure) and S9 (secret) row named; each stack with S7 or S9 rows
   gets one `ops-parked` issue. Later reports list only the changes.
9. **On Mondays only**: drift between Confluence and the repositories; infrastructure PRs merged in
   the last 7 days without a comment headed `## infra-reviewer report`; stacks without a backup
   decision. Drift: compare the repositories' inventory (stacks, VMs, backups) with the Confluence
   inventory pages the repositories' `AGENTS.md` names; without Confluence access, say *not checked*.

**Sleeping stacks** are checked for conformance (their code still deploys on wake) and skipped for
targets, backups and disks.

**Missing allow-listed operations** (an `act` entry whose workflow the stacks repository lacks) are
reported every day under problems, as one line.

**Monitoring unreadable.** If the Prometheus API cannot be read, checks 1 to 5 are reported as
"monitoring unreadable", and that is itself the first finding. No unattended action is taken on state
that cannot be verified ([unattended-operations.md](unattended-operations.md)).

"Since the previous report" means the previous comment on the pinned `Daily check-up log` issue
([incident-response.md](incident-response.md), *Records*).

## The output

One post in `#infra-alerts`, and the same text as a comment on the pinned log issue:

```
Daily check-up <YYYY-MM-DD>: <n> problems
PROBLEMS
- <check>: <what is wrong, where> → <issue link or "new issue">
CHECKED AND FINE
- Alerts · Targets · Backups · Certificates · Disks · Expiry dates · Open issues · Conformance
NOT CHECKED
- <check>: <why> (monitoring unreadable, no Confluence access, sibling repository missing)
```

- Problems first, each with the issue that tracks it. A finding that needs a human and has no alert
  becomes an issue labelled `ops-parked`.
- Then "checked and fine" as one line per area, so a quiet day still shows what was looked at.
- A summary goes to `#operations` only when work was done.
