# Daily note format

`04 Daily/YYYY-MM-DD.md`. Sections in this order; an empty section says so in one line ("No events",
"Nothing needs a reply").

```markdown
---
kind: daily
date: YYYY-MM-DD
private: true
---

# <Weekday, D Month YYYY>

## Calendar
- **HH:MM** <event> (today)
- Tomorrow: **HH:MM** <event>

## Needs a reply
- <sender> · <subject> · <what they need> · tone: <one phrase, when it matters> · draft ready [link](<thread url>)

## FYI
- <sender> · <subject> · <one line> [link](<url>)

## To do
### Urgent
- [ ] <item> *(YYYY-MM-DD)* [link](<url or [[note]]>)
### In progress
### Waiting
### Waiting on replies
- [ ] <person>: <the question the owner asked> *(asked YYYY-MM-DD)* [link](<thread url>)
### Meeting prep
- [ ] <meeting at HH:MM>: <what to prepare> [link](<url>)

## Plans
- This week: <outcome> → <monthly objective or key result it serves>

## Notes
- <what the run removed, matched, could not match, or could not reach, one line each>
```

## Link style

Items follow the master list's item format (`vault-conventions`, `references/project-files.md`).
Keep the item text plain and put the link last, with the anchor `link`. A message with several
questions or actions gives several checkboxes, so each can be ticked alone.

## Re-run section

A re-run appends, after Notes:

```markdown
## Update HH:MM
- <new calendar changes, new needs-reply threads, removed waiting items>
```
