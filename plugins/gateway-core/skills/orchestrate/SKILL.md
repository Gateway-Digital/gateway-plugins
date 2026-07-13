---
name: orchestrate
description: Subagent-driven execution of an approved plan. Use when a plan has 3+ tasks - dispatches a fresh implementer per task with file-based briefs, reviews every task with the code-reviewer agent, and keeps a progress ledger that survives compaction. Two human gates - plan approval and pre-commit.
---

# Orchestrate

Executes an approved plan task-by-task with fresh subagents. The orchestrator's context
stays lean: bulk content moves between agents as **files**, never pasted text.

## The two gates (non-negotiable)

- **Gate 1 — plan approved.** Do not dispatch any implementer before the user approves
  the plan (feature-flow Phase 3 output or planner agent output).
- **Gate 2 — pre-commit/PR.** Do not merge, push, or open the PR before showing the
  final review result and getting the user's confirmation.

## Workspace and ledger

All orchestration scratch lives at `<repo-root>/.gateway/` (create it; write
`*` into `.gateway/.gitignore` so it never lands in commits):

- `.gateway/task-<N>-brief.md` — one task's full text extracted verbatim from the plan.
- `.gateway/task-<N>-report.md` — the implementer's report.
- `.gateway/review-<N>.md` — the reviewer's verdict.
- `.gateway/progress.md` — the ledger. After each clean review append one line:
  `Task N: complete (commits <base7>..<head7>, review clean)`.

**The ledger and `git log` outrank your own memory.** After compaction or a fresh
session, resume at the first task NOT marked complete — never re-dispatch completed
tasks, never trust recollection over the ledger.

## Per-task loop

1. **Extract the brief**: copy the task's full text (with its steps, code blocks, and
   the plan's Global Constraints section verbatim) into the brief file.
2. **Record the base commit** for this task: `git rev-parse HEAD` → note it in the
   ledger line as pending. Diffs later use THIS base, never `HEAD~1` (multi-commit
   tasks would silently lose commits).
3. **Dispatch a fresh implementer subagent** with only: one line on where the task fits,
   the brief path ("read first — it is your requirements, exact values verbatim"),
   interfaces produced by earlier tasks that the brief can't know, and the report-file
   path. Exact values live ONLY in the brief — do not paste prior-task history.
   Right-size the model: cheap tier when the plan contains the full code (transcription),
   default tier otherwise. Require a status: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT |
   BLOCKED. On NEEDS_CONTEXT answer and redispatch; on BLOCKED stop and consult the user.
4. **Review every task** with the `code-reviewer` agent: give it the brief path, report
   path, and the base..HEAD range. Add the `security-reviewer` agent when the diff
   touches auth, user input, DB queries, file ops, external APIs, crypto, or payments.
   Never instruct a reviewer to ignore or downgrade a specific issue — if your dispatch
   contains "do not flag", stop: you are pre-judging.
5. **Act on the verdict**: Critical/High → dispatch a fix subagent, re-review. Minor →
   note in the ledger for the final pass. Clean → append the ledger line, next task.
   Do not pause between tasks to ask the user — Gate 2 is the checkpoint.

## Final pass

When all tasks are complete: run the whole-branch review (most capable model) against
the spec's acceptance criteria using `git merge-base main HEAD`..HEAD, run the
`verify-done` skill end to end, then present the summary at Gate 2.
