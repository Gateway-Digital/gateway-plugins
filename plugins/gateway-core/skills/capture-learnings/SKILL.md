---
name: capture-learnings
description: Persist non-trivial discoveries at the end of significant work - debugging techniques, workarounds, project-specific gotchas - so no one pays for the same discovery twice. Use after finishing a task that involved real investigation, or when the user says "remember this".
---

# Capture Learnings

If a discovery cost more than 10 minutes and will recur, it must outlive the session.
Chat history dies; files don't.

## What qualifies

- A root cause that wasn't obvious from the error (record cause + the diagnostic that
  found it).
- A workaround for a tool/library/environment quirk.
- A project convention that exists but isn't written anywhere.
- An approach that was tried and did NOT work, and why — anti-retry knowledge is the
  most valuable kind.

Trivial fixes, one-off facts, and anything already documented do not qualify.

## Where it goes (in priority order)

1. **Project-specific** → `docs/project-context.md` under `## Learnings`, one dated
   bullet: what was discovered, the evidence, and what to do/avoid. If it's a landmine,
   move it to `## Known landmines`.
2. **Repeats across repos / org-wide** → propose it as a skill or an addition to an
   existing gateway-core skill via the `find-org-skills` proposal flow (PR to the
   marketplace repo). Write the draft SKILL.md as part of the proposal.
3. **Wrong or stale existing docs** → fix the doc in the same change; don't append a
   contradiction below it.

## Format

```
- [2026-07-13] <what was learned>. Evidence: <how it was proven>.
  Do/avoid: <the actionable rule>. (Tried & failed: <approaches, if any>)
```

Keep each entry to 2-3 lines. When `## Learnings` grows past ~20 entries, consolidate:
promote stable patterns into the conventions sections, delete superseded entries.

If claude-mem is installed in this repo (check `.claude/harness.json`), it captures the
raw session history automatically — this skill is still the curation step: raw memory
is searchable, but only written-down rules change future behavior.
