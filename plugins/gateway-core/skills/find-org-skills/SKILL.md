---
name: find-org-skills
description: Governed capability discovery. Use when a needed skill, agent, or tool is missing - e.g. the user asks "is there a skill for X", a stack has no conventions skill yet, or a workflow needs tooling the repo doesn't have. Searches the org catalog, then vetted libraries (ECC), then public sources - and files a proposal instead of installing.
---

# Find Org Skills

Capabilities come from the vetted catalog, never from direct installs. Managed settings
enforce this technically; this skill is the sanctioned path that keeps discovery fast.

## Step 1 — Search the org catalog

Read `../../catalog.json` (gateway-core plugin root). If an approved entry covers the
need: add it to this repo via `org-init` refresh mode so `harness.json` stays truthful.

## Step 2 — Search the vetted library: ECC

The catalog lists ECC (affaan-m/ECC, MIT) as an approved **cherry-pick source** — 278
skills, 67 agents, organized by domain, including per-framework/language conventions
(Django, Spring, Laravel, Go, Rust...), reviewers (`<lang>-reviewer`), and build
resolvers. Search its `skills/`, `agents/`, and `rules/` directories for a match.

Cherry-pick rules (never `/plugin install ecc@ecc` — the full bundle is banned):
- Copy the specific SKILL.md / agent file into a proposal, pinned to the ECC commit
  it came from.
- Strip anything that auto-executes: hooks, auto-update logic, `npx -y` MCP launches.
- Adapt tone/paths to gateway conventions; keep the MIT attribution line
  (see ATTRIBUTIONS.md in the marketplace repo).

## Step 3 — Search public sources (discovery only)

Nothing in catalog or ECC → search the Anthropic official marketplace
(`anthropics/claude-plugins-official`), skills.sh (`npx skills find "<query>"` searches
without installing), and awesome-claude-code. Quality gates before shortlisting:

- Trusted orgs (anthropics, microsoft, vercel-labs, github) or substantial adoption
  (1,000+ installs / meaningful stars); distrust <100 installs, no license, or 3+ months
  of silence.
- Read what it executes — hooks and MCP servers run code; markdown-only skills are
  lower risk.
- Check slot overlap: replacing an occupied slot (memory, code-graph, search) is a
  replacement proposal, not an addition.

## Step 4 — File a proposal, don't install

Create a proposal PR against the marketplace repo: for tools, a `"status": "proposed"`
entry in `catalog.json`; for skills/agents, the adapted file under gateway-core plus a
catalog note. Include: the need, which projects benefit, slot, source + pinned
version/commit, license, maintenance signals, executed surface, context cost, conflicts.

Tell the user the DRI reviews within 2 working days — and solve their immediate problem
directly in the meantime; a missing skill never blocks the task itself.

## Step 5 — If nothing exists anywhere

Write an internal skill: draft the SKILL.md in gateway-core's style and include it in
the same proposal PR. For org-specific procedures, internal skills beat external
dependencies every time.
