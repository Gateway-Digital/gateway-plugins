---
name: org-init
description: Bootstrap or refresh a project's Claude Code super harness - interview-driven discovery, default tool installs (claude-mem, codegraph/graphify, mgrep), generated config, and a harness manifest. Use when setting up Claude Code in a new or existing repo, when the user says "set up this project", or when a repo has no .claude/harness.json.
---

# Org Init — per-project harness bootstrap

Assembles this repo's harness: understands the project first, installs the default
tool stack, generates config, and records everything in a reviewable PR. Works for
greenfield and brownfield.

The vetted catalog ships with this plugin at `../../catalog.json` relative to this
file (gateway-core plugin root); templates are in `../../templates/`. Read both first.

## Step 1 — Detect

Run the checks, don't guess:

- Greenfield vs brownfield: `git log --oneline | wc -l` and `git ls-files | wc -l`.
- Stacks: package manifests present (package.json + framework deps, pyproject.toml,
  go.mod, pom.xml, Cargo.toml, composer.json, Gemfile) — repos can have several.
- Shape: monorepo? test setup? CI config? docs corpus (many .md/PDF/SQL files)?
- Existing harness: `.claude/harness.json`, `.claude/settings.json`, `CLAUDE.md`,
  `.mcp.json` → if present this is a **refresh** (see below), preserve manual edits.

## Step 2 — Understand

Run the `project-interview` skill. It ingests everything that already exists (persona
docs, product notes, the codebase via the `code-explorer` agent) and only asks about
gaps. Outputs: `docs/discovery/brief.md` plus `docs/constitution.md` (greenfield) or
`docs/project-context.md` (brownfield).

For brownfield repos, the recon pass feeds `docs/project-context.md` with OBSERVED
conventions — naming, error handling, test style, layering — described as they are,
not as they should be.

## Step 3 — Select the harness

Read `catalog.json`. The **default stack installs in every repo** unless a
`defaultInstall` entry's `skipWhen` condition matches or the user opts out:

- **claude-mem** (memory slot) — with its required config: native auto-memory off,
  `CONTEXT_SESSIONS=5`.
- **codegraph** (code-graph slot) — or **graphify** instead when the corpus is
  docs/SQL/mixed-media heavy. Never both.
- **mgrep** (search slot) — semantic local search + `mgrep --web` for web search;
  prefer it over grep/rg in all workflows.

Then fill remaining needs from the catalog's on-demand entries (per-stack skills
cherry-picked from vetted sources like ECC, Serena for symbol-editing-heavy work).
One occupant per slot; respect `conflicts`. Present the selection with reasons and get
one approval before generating anything.

## Step 4 — Generate

From `templates/`:

- `.claude/settings.json` — marketplace reference, `enabledPlugins` (gateway-core),
  permissions allow (this repo's REAL lint/test/build commands found in Step 1) and
  deny (secrets patterns).
- `CLAUDE.md` — facts only, under 60 lines: commands, five-line architecture,
  surprising conventions. Procedures live in skills, not here.
- `.mcp.json` — for selected MCP entries (codegraph).
- `.claude/harness.json` — the manifest: every selected entry, pinned version, slot,
  reason, date, plus recheck notes. This makes the harness auditable and refreshable.
- `.gitignore` additions the entries name (`.codegraph/`, `graphify-out/`, `.gateway/`).

## Step 5 — Install and build

Run each selected entry's `install` commands from the catalog (marketplace installs,
`codegraph init`, `/graphify .`). Index builds can take minutes on large repos — say so
before starting. Apply each entry's required `config` (e.g. disabling native
auto-memory for claude-mem) and verify it took effect.

## Step 6 — Verify and deliver

1. Restart check: ask the user to run `/context` and `/plugin` — skill listing within
   budget, no unused plugins.
2. Sanity-run the harness: one `mgrep` query, one code-graph query (brownfield), and
   confirm claude-mem's worker is up.
3. Commit on a branch; open a PR titled `chore: Claude Code harness` describing what
   was installed and why (from Step 3 reasoning). Include the discovery docs.

## Step 7 — Offer the status line (once per user)

The status line is a **user-level** convenience, separate from this repo's PR. If the user's
Claude config (`$CLAUDE_CONFIG_DIR`, else `~/.claude/settings.json`) has no `statusLine`, offer to
enable the Gateway usage status line — model + version, context % (⚠ near auto-compact), project,
and a current (5h) / weekly (7d) shared-usage meter (dot bar, %, reset time) for each. It directly
supports the "one task per session, no context rot" rule. On yes, run the `/gateway-core:statusline`
flow (copy `statusline/statusline.mjs` into the config dir and merge the `statusLine` key). Skip
silently if one already exists or the user declines. This changes the developer's global config,
not the repo — keep it out of the harness PR.

## Refresh mode

`.claude/harness.json` exists → re-run Steps 1 and 3, diff against the manifest, and
propose only the delta (new default in the catalog, repo crossed a threshold, stack
added). Never remove a manually-added entry without asking; record every change in the
manifest's `history`.
