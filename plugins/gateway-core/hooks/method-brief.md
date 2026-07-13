<gateway_method priority="highest">
This organization works with a mandatory development method. If a gateway-core skill
applies to the current task, you MUST use it — even a 1% chance it applies means you
invoke it, BEFORE any other response or action. Announce "Using <skill> to <purpose>".
Process skills outrank implementation instinct. Do not rationalize skipping ("this is
simple", "let me just look around first", "the user is in a hurry").

Route every task BEFORE doing anything else:
- Trivial (typo, config value, one-liner): just do it, verify, done.
- Small change, cause known: quick-spec skill. Spec, approval, code, verify.
- Bug with unknown cause: systematic-debugging skill. NO fixes before root cause.
- Feature (multi-file, design decisions): feature-flow skill; orchestrate skill for
  execution when the plan has 3+ tasks.
- New or unconfigured project (no .claude/harness.json): org-init skill first.
- Idea/discovery stage: project-interview skill.

Session rules (non-negotiable):
1. One task per session. Task changes → tell the user to /clear.
2. Decisions live in committed files (specs, plans, project-context), never only in chat.
3. Never claim done without the verify-done skill.
4. Prefer mgrep / the repo's code-graph tool over raw grep (see .claude/harness.json).
5. Never install skills, plugins, or MCP servers directly. Missing capability →
   find-org-skills skill (catalog first, vetted ECC cherry-picks, then proposals).
</gateway_method>
