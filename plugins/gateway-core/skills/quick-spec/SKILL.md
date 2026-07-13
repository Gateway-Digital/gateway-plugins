---
name: quick-spec
description: Workflow for SMALL tasks (bug fixes, small changes, under ~1 hour). Produces a 5–10 line spec, gets approval, implements, verifies. Use when the gateway-method routing table classifies a task as Small, or when the user asks to "fix" or "change" something bounded.
---

# Quick Spec

For small, bounded work. If during any step the scope grows beyond ~1 hour or starts
touching design decisions, stop and escalate to the `feature-flow` skill.

## Steps

1. **Understand.** Read the relevant code. If the repo has a code-graph tool installed
   (check `.claude/harness.json`), query it instead of grepping broadly. Reproduce the bug
   if there is one — do not fix what you have not seen fail.

2. **Write the spec.** 5–10 lines, in this shape:

   ```
   ## Quick spec: <title>
   Problem: <what is wrong / what is needed, one or two lines>
   Cause: <root cause, for bugs — found, not guessed>
   Change: <files to touch and what changes in each>
   Out of scope: <what this deliberately does NOT do>
   Verify: <the exact command or action that proves it works>
   ```

3. **Get approval.** Show the spec to the user and wait for a yes. Do not start editing
   while waiting. If the user edits the spec, that edit is the contract.

4. **Implement.** Only what the spec says. Discovering necessary extra work → update the
   spec and re-confirm, don't silently expand.

5. **Verify.** Run the `verify-done` skill: execute the spec's Verify line, show the output.

6. **Deliver.** Put the spec text into the PR description (or commit message for direct
   commits). The spec is the audit trail.
