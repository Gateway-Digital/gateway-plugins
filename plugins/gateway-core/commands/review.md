---
description: Review changes - local uncommitted/branch diff, or a PR by number/URL
---

Run a code review using the code-reviewer agent from the gateway-core plugin.

- No arguments: review local changes (`git diff` + `git diff --staged`; if clean,
  review the branch against `git merge-base main HEAD`).
- PR number or URL in arguments: fetch it with `gh pr view` / `gh pr diff`, read the
  full files at the PR head, then review.

Add the security-reviewer agent when the diff touches auth, user input, DB queries,
file operations, external APIs, crypto, or payments. Report findings with the
agents' output format; end with Approve / Needs fixes / Block.

Arguments: $ARGUMENTS
