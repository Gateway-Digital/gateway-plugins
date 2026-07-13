---
name: gateway-method
description: The Gateway Corp's mandatory development method. Use at the start of ANY task to route it - by size for changes, to systematic-debugging for bugs, to project-interview/org-init for new projects. Use when unsure which workflow applies.
---

# The Gateway Method

Every task is routed before any work starts. Ceremony must match the task —
too little produces unreviewable vibe-code, too much makes people route around
the method.

## Routing table

| Situation | Signs | Workflow |
|-----------|-------|----------|
| Trivial change | Typo, config value, rename, one-liner | Just do it, verify, done |
| Small change | Bug fix with known cause, bounded change, < ~1 hour | `quick-spec` skill |
| Bug, cause unknown | Test failure, unexpected behavior, "it's broken" | `systematic-debugging` skill FIRST — no fixes before root cause |
| Feature | New capability, multi-file, design decisions | `feature-flow` skill; execute via `orchestrate` when the plan has 3+ tasks |
| New / newly-adopted project | No `.claude/harness.json` in the repo | `org-init` skill (which runs `project-interview`) before any other work |
| Discovery/idea stage | "We want to build...", unclear requirements | `project-interview` skill |

When in doubt between two sizes, pick the larger one and let the user downgrade.
When you invoke a skill, announce it: "Using <skill> to <purpose>" — then follow it
exactly. If it has a checklist, work the checklist.

## Session rules

1. **One task per session.** When the task changes, tell the user to `/clear`.
   Chat and Claude Code share the same weekly per-member usage budget — kitchen-sink
   sessions burn real capacity.
2. **Artifacts on disk are the memory; sessions are disposable.** Specs, plans,
   decisions, and learnings live in committed files. A fresh session must be able to
   resume from files alone.
3. **No implementation before an approved spec** for anything above trivial.
4. **No "done" without the `verify-done` skill.**
5. **Plan mode first** on unfamiliar codebases; prefer the repo's search/graph tools
   (mgrep, codegraph — see `.claude/harness.json`) over raw grep.

## Capability rules

- Tools and skills come only from the gateway-tools marketplace and the vetted catalog.
  Missing capability → `find-org-skills` skill. Never install from the public internet.
- One tool per harness slot (one memory system, one code-graph tool per repo).
- Model right-sizing: default model for routine work; most capable for planning and
  final review; cheapest tier for mechanical subagent tasks. Turn count beats token price.

## Red flags

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Route them. |
| "Let me explore the codebase first" | Exploration is part of a workflow — route first, explore inside it. |
| "It's probably X, let me fix it" | That's a guess. systematic-debugging, Phase 1. |
| "The user is in a hurry" | The method is faster than redoing wrong work. |
| "The session already has the context" | If it isn't in a file, it doesn't exist. |
| "This skill doesn't quite apply" | 1% chance it applies → use it. |

User instructions (CLAUDE.md, direct requests) override skills; skills override default
behavior.
