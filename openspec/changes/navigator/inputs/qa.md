<!-- SECONDARY input. The Q&A of the 2026-11-08 brainstorming session, owner's answers in their
     words where it matters. Superseded by proposal.md; never deleted or groomed. -->

# Q&A record — navigator

| # | Question | Owner's answer |
|---|---|---|
| 1 | One plugin like ponytail (band + hooks + buttons), or only a status line? | One plugin "like ponytail". |
| 2 | Two bands (ponytail + skillery) stacked? | Accepted, provided the band can be shown/hidden. |
| 3 | Information only, or actions too? | Both: a band that **unfolds** to show more statuses and lets one **take actions**, plus a **small status in the status line**. Band and status line carry **different** info, no duplication. When the band is hidden, the status line must be enough. |
| 4 | Hotkey to toggle the band? | Skip hotkeys. |
| 5 | Which events? | "All the events you listed." |
| 6 | Where do workflows live? | **Default workflows in skillery; each repo can have its own, probably in docs.** Agreed: each workflow file points to the owning skill's phases, never restates them. |
| 7 | Which workflows first? | Build-tier EPIC delivery; **architecting / modelling** (explore, knowledge elicitation, asking and discovering — already in the modelling skills); **DevOps** ("very clean and clear modes and intentions, worth building on"). **Sales: to be decided, work in progress.** |
| 8 | Both CLIs? | **Claude-specific is fine; keep opencode aside.** The status line may be reused, not forced. |
| 9 | Drift? | Detect **gaps between the workflow and what is done** (process drift) and **drift between what was implemented and what was planned and designed**, often via human intervention, which **requires an EPIC update before archiving** (plan drift). |
| 10 | Hygiene and cost? | "Super important": keep **session hygiene** and **reduce token consumption**, with **automated triggers**. |
| 11 | What matters most? | Who runs what; where we are in the plan; any warnings, errors or issues; are we on track or drifting (did more/different → EPIC needs adjusting; workflow not respected → fall back in line). |
| 12 | Where does the mod live? | **In skillery**, as a new artifact type, bundled the same way as skills (symlinks via `make bundles`). |
| 13 | Steer or observe? | **Two modes: strict (steers, invasive) and loose (observes, non-invasive).** Recommended and accepted: loose by default; strict opted into per repo; mode visible in the status line; a person can always drop to loose for the session. |
| 14 | Actions? | Accepted the proposed list (Next step, Validate, Mode, Fold/Hide, Reconcile EPIC, Back on track, Accept deviation, Compact now / Fresh session, Archive check, Review, Board, Copy status). Core four: Next step, Reconcile EPIC, Back on track, Archive check. |
| 15 | Subagents and skills? | Accepted: running subagents with type/model/tokens; count vs appetite; `guardrails` dispatch rules as warnings (not paying, wrong model, no second check, over-spawn); strict may stop or correct a spawn. Skill trail; expected-vs-ran per phase; unexpected and external-over-ours warnings; misfire → trigger-probe candidate; **Report to skillery** via `skillery-feedback`; Board aggregates over sessions. |
| 16 | Name? | Working name **`navigator`** (lead's proposal, not yet confirmed). |

## Round 2 — answered 2026-11-08

- **R2-1** `navigator`: "fine".
- **R2-2** "fine with large and very large" → shaped VERY LARGE after the additions below.
- **R2-3** Pinned line accepted, **provided it can be hidden by a toggle**; otherwise document how to
  enable/disable it and how to configure navigator altogether. **Documentation is very important,
  for users and for developers.** Asked: what about CLI users and Claude desktop users — anything
  on the desktop too? → DEC-4 (CLI + desktop), DEC-10 (toggles + settings), DEC-11 (docs),
  scenarios 9–10.
- **R2-4** Scenarios liked. Added: "why don't we throw in a simple sales workflow as well?" → DEC-9
  revised.

## Round 2 — as asked

- **R2-1** Name: `navigator`, or another?
- **R2-2** Appetite: shaped as LARGE with three stages; VERY LARGE if the new artifact type is
  judged to "cut across the method".
- **R2-3** Status line: the mod pins its own line under the prompt (`$.ui.status`), with an optional
  snippet for a person's own `statusLine` script — rather than the plugin editing user settings.
- **R2-4** Test scenarios (draft in proposal, *What the EPIC must prove*): confirm, add, cut.
