---
name: verify-done
description: Verification before claiming completion. Use before saying any task is done, fixed, or working - run the real thing and show evidence. Applies to every task size, including trivial.
---

# Verify Done

"Done" is a claim about the world, not about the diff. Before making it:

1. **Run the contract.** Execute the verify command from the quick spec / plan task. No
   verify command was written → derive one now and run it.

2. **Drive the actual behavior**, not only the tests: start the app/service and exercise
   the changed flow the way a user or caller would. Tests passing while the feature is
   broken is a known failure mode.

3. **Show the evidence.** Paste the command and its real output. If anything fails, report
   the failure honestly with the output — a failing state described accurately is a good
   result; "should work now" is not a result.

4. **Check the blast radius.** Run the repo's standard lint/test suite (from CLAUDE.md or
   `.claude/settings.json` allow-list). New failures you introduced are your task, even if
   they are outside the spec.

5. **Leave the trail.** The evidence (or a summary of it) goes into the PR description.

Never soften a failed verification into "mostly working" or skip it because the change
"is too simple to break anything" — trivial changes get step 1 and 4 at minimum.
