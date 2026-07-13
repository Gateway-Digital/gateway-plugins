# <PROJECT NAME> — Constitution

Standing principles for this project. Every spec, plan, and review is checked against
these. Changing this file is a team decision, not an edit.

## Product principles

1. <Who this is for and the single job it must do well.>
2. <What this project deliberately does NOT do.>

## Engineering principles

1. **Simplicity gate:** new dependencies, services, or abstractions need a written
   justification in the plan. Default answer is no.
2. **Tests:** <the project's actual testing bar - e.g. "every feature lands with tests
   for its acceptance criteria; bug fixes land with a regression test".>
3. **Compatibility:** <API/schema stability promises, if any.>
4. <Security/compliance requirements specific to this project's domain.>

## Review gates

- Specs must have testable acceptance criteria and an out-of-scope section.
- Plans must pass the readiness gate (PASS/CONCERNS/FAIL) before implementation.
- No merge without verify-done evidence in the PR.
