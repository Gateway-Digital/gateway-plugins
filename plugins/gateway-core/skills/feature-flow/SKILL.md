---
name: feature-flow
description: Workflow for FEATURE-scale work (new capability, multi-file changes, design decisions needed). Phased - spec, clarify, plan, implement, review - with committed artifacts, quality gates, and a fresh session per phase. Use when the gateway-method routing table classifies a task as Feature.
---

# Feature Flow

Feature work runs in phases. Each phase produces a committed markdown artifact and ends
by telling the user which phase comes next **in a fresh session** (`/clear` between
phases). Artifacts are the handoff — the next session reads files, not chat history.

```
docs/specs/YYYY-MM-DD-<topic>.md    # Phases 1-2
docs/plans/YYYY-MM-DD-<topic>.md    # Phase 3
```

## Phase 1 — Spec

Interview one question at a time (never a questionnaire); prefer multiple-choice with a
recommended option. Apply YAGNI ruthlessly. If the repo has `docs/discovery/brief.md` or
`docs/constitution.md`, the spec must not contradict them.

Write the spec with **stable IDs** so plans and reviews can reference requirements:

```
## User stories        (each: priority P1-P3, independent test, Given/When/Then scenarios)
## Functional requirements   FR-001: System MUST ...
## Success criteria          SC-001: <measurable, technology-agnostic>
## Out of scope
## Assumptions
```

Mark genuine ambiguities inline as `[NEEDS CLARIFICATION: <specific question>]` —
**maximum 3 markers**; for everything else make an informed guess and record it under
Assumptions. Priority when choosing what deserves a marker: scope > security/privacy >
UX > technical details.

**Spec quality gate** (self-check, fix inline): no implementation details leaked in;
every FR testable; every SC measurable; edge cases listed; scope bounded; all mandatory
sections filled. Then present section by section for approval and commit. **No code in
this phase.**

## Phase 2 — Clarify (only if markers remain)

For each `[NEEDS CLARIFICATION]`, ask ONE question at a time as a short options table
(2-5 options + your recommended one with one-line reasoning; user can answer
"recommended"). Write each answer back into the spec, replacing the marker. All markers
resolved → commit the updated spec.

## Phase 3 — Plan

Fresh session. Use the `planner` agent (it reads the spec and codebase; its output
format enforces Global Constraints, per-task Interfaces, no placeholders). Save its plan
to `docs/plans/`, then run the **readiness gate** yourself: every FR/SC mapped to a
task? No placeholder steps? Names/types consistent across tasks? Complexity justified —
any new dependency, service, or abstraction needs a stated reason and the rejected
simpler alternative. Verdict PASS / CONCERNS / FAIL; CONCERNS or FAIL → show gaps to
the user and fix the plan first. Commit the plan on PASS.

## Phase 4 — Implement

- Plan has 3+ tasks → use the `orchestrate` skill (fresh subagent per task, reviews,
  ledger, two gates).
- Smaller → implement inline: per task, failing test → verify RED → minimal
  implementation → verify GREEN → commit; check tasks off in the plan file so any
  session can resume from disk.

## Phase 5 — Review

Fresh session (skip if orchestrate ran — its final pass covers this). Diff the whole
branch against the spec's FR/SC IDs — spec compliance first, quality second. Run
`verify-done` end to end (drive the real feature, not only tests). Findings feed back
into Phase 4. When clean: PR description links the spec and plan; run
`capture-learnings` if the work surfaced anything non-obvious.
