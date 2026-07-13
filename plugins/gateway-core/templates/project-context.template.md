# <PROJECT NAME> — Project Context

Observed conventions of this existing codebase. Extracted by org-init from representative
files; describes what IS, so agents and new contributors match the codebase instead of
fighting it. Refresh when conventions genuinely shift.

## Stack

<Languages, frameworks, key libraries with versions, infra targets.>

## Layout

<Where things live: entry points, domain logic, shared utilities, tests, config.>

## Observed conventions

- **Naming:** <e.g. "snake_case modules, PascalCase classes; test files mirror source paths".>
- **Error handling:** <e.g. "domain errors raised as typed exceptions, caught only at the
  API boundary; no bare except".>
- **Testing style:** <e.g. "pytest with fixtures in conftest.py; integration tests hit a
  dockerized DB; no mocking of the ORM".>
- **State/data flow:** <how data moves; what is considered the source of truth.>

## Known landmines

<Places where the obvious change is wrong: fragile modules, load-bearing hacks,
areas with no test coverage. Be specific - file paths and why.>
