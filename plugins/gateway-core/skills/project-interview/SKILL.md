---
name: project-interview
description: Persona-aware project discovery interview. Use when starting a new project, adopting an existing one, or when org-init needs a product/context brief - understands the product concept, the developers, and the codebase through targeted questions, skipping everything already documented. Resumable across sessions.
---

# Project Interview

Builds the project's foundation documents by interviewing the user — but only about
what is NOT already known. If the user has already provided persona docs, product
descriptions, an existing codebase, or prior briefs, those are read first and never
re-asked.

## Step 0 — Ingest before asking (mandatory)

Read everything available before the first question:

- Any docs the user points to (persona files, product notes, PRDs, pitch docs).
- The codebase itself for brownfield: run the `code-explorer` agent for a recon pass
  (entry points, layers, conventions) instead of asking the user how their code works.
- Existing `CLAUDE.md`, `docs/project-context.md`, `docs/discovery/` from earlier runs.

Then classify each interview category below as **Clear / Partial / Missing** based on
what you read. Only Partial and Missing categories generate questions. Tell the user
which categories you're skipping and why ("your persona doc already covers X").

## Resumable state

State lives at `docs/discovery/state.json`:

```json
{
  "project": "<name>",
  "categories": { "product": "clear|partial|missing|done", "users": "...", "..." : "..." },
  "askedCount": 0,
  "outputs": ["docs/discovery/brief.md"],
  "lastUpdated": "<ISO date>"
}
```

On start, if state exists: report what's done and what remains, ask whether to continue.
Never re-ask a question whose answer is recorded in `docs/discovery/`.

## Interview categories (the taxonomy)

1. **Product** — who is this for (a specific person, not a segment)? What pain,
   quantified? Why now? What does the 10x version look like? What is the MVP?
   What is the explicit anti-goal? What metric says it's working?
2. **Users & workflows** — how do the actual users/developers work today; what must
   not change for them.
3. **Scope boundaries** — out-of-scope list; the smallest independently valuable slice.
4. **Domain & data** — key entities, sources of truth, retention/privacy constraints.
5. **Non-functional** — realistic scale, performance floors, availability, compliance.
6. **Integration** — external systems, APIs, auth providers; who owns them.
7. **Constraints & taste** — stack preferences, hosting, budget, hard deadlines,
   conventions the team already holds.
8. **Risks** — what has failed before in this org/domain; known landmines.

## Question discipline

- **One question at a time.** Never a questionnaire.
- Prefer multiple-choice with a recommended option and one-line reasoning; the user can
  answer "yes" to accept the recommendation. Short-answer questions cap at ~5 words.
- After each answer: one-line paraphrase, then either one deepening probe ("why does
  that matter?" — at most twice) or move on. Two probes yielding nothing new = category
  saturated, close it.
- Thin or jargon answer → ask for one concrete example or number.
- Cap the whole interview at ~10 questions per session; if more remain, save state and
  offer to continue later.
- YAGNI ruthlessly: when the user speculates about future needs, record them under
  "later" instead of expanding scope.

## Outputs

Write as categories complete (not only at the end):

- `docs/discovery/brief.md` — product brief: the 7 product answers, users, scope,
  risks. Raw quotes preserved in a `## Raw` section; interpretation in `## Synthesis`.
- **Greenfield** → also fill `docs/constitution.md` from the org template (principles
  the interview surfaced: testing bar, simplicity gate, compliance).
- **Brownfield** → also fill/extend `docs/project-context.md` with what recon + the
  interview revealed (observed conventions + landmines the user confirmed).

## Exit

The terminal state is handing back to the caller: `org-init` (when part of bootstrap)
or `feature-flow` Phase 1 (when the user wants to start building). Do not start
implementing anything from here.
