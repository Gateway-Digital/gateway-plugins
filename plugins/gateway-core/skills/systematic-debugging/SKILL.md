---
name: systematic-debugging
description: Root-cause-first debugging process. Use for ANY bug, test failure, or unexpected behavior whose cause is not already proven - before proposing any fix.
---

# Systematic Debugging

**The iron law: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.**
A fix without a proven cause is a guess; symptom fixes are failure even when the
symptom disappears.

## Phase 1 — Root cause investigation (complete before ANY fix)

- Read the actual error message, fully. It usually says what's wrong.
- Reproduce consistently. No reliable repro → that IS the first problem to solve.
- Check what changed: `git log` / recent deploys / dependency bumps since it last worked.
- In multi-component systems, don't guess the failing layer: add diagnostic output at
  each boundary, run once, see WHERE it breaks before asking why.
- Trace the bad data/state backward to its source.

## Phase 2 — Pattern analysis

- Find a working example of the same pattern in this codebase and read it COMPLETELY —
  don't skim for the part you expect to differ.
- List every difference between working and broken; understand each dependency involved.

## Phase 3 — Hypothesis and test

- One hypothesis, stated out loud: "I think X causes this because Y."
- Test it changing ONE variable. Confirm or discard before forming the next.
- If you don't understand something, say "I don't understand X" — never pretend.

## Phase 4 — Implement

- Write the failing regression test FIRST (it proves the root cause and guards the fix).
- One fix. No "while I'm here" changes.
- Verify with the `verify-done` skill.
- **Three failed fix attempts → STOP.** The problem is architectural; question the
  design with the user instead of attempting fix #4.

## Red flags — return to Phase 1 when you catch yourself thinking:

"Let me just try...", "It's probably...", "Quick fix for now, investigate later",
"The error is misleading", "Adding a retry/try-catch should handle it".
The user saying "stop guessing" means exactly that: back to Phase 1.
