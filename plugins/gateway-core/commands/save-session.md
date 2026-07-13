---
description: Save session state to a file so a fresh session can resume the work
---

Write the current session's state to `.gateway/sessions/<YYYY-MM-DD>-<topic>.md`
(create the directory; ensure `.gateway/` is gitignored). Use exactly these sections:

```
# Session: <topic>
**Project/branch:** · **Date:**
## What we are building
## What WORKED (with evidence)
## What did NOT work (and why)      <- the anti-retry section; be specific
## Not yet tried
## Current state of files            <- table: file - state
## Decisions made
## Exact next step                   <- one concrete action, not a theme
```

Fill every section from this session's actual history. This is the manual fallback
for repos without claude-mem (see .claude/harness.json) and the standard handoff
before a planned /clear on long work. After writing, tell the user the file path and
that `/gateway-core:resume-session` picks it up.
