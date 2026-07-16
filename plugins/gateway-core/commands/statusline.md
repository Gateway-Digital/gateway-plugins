---
description: Enable the Gateway usage status line (model, context %, cost, 5h/7d limits) for this user
---

Set up the Gateway status line in the CURRENT USER's Claude Code config (user-level, not this
repo). Do exactly these steps, nothing else:

1. Resolve the user's Claude config dir: `$CLAUDE_CONFIG_DIR` if set, else `~/.claude` (expand
   `~` to the real home directory). Create it if missing.
2. Copy the bundled script `${CLAUDE_PLUGIN_ROOT}/statusline/statusline.mjs` to
   `<config-dir>/gateway-statusline.mjs`. If `${CLAUDE_PLUGIN_ROOT}` doesn't resolve, find the
   installed `gateway-core` plugin and copy its `statusline/statusline.mjs`.
3. Build the ABSOLUTE path to the copied script. On Windows use forward slashes
   (e.g. `C:/Users/<name>/.claude/gateway-statusline.mjs`) so any shell handles it.
4. Merge — do NOT overwrite — this into `<config-dir>/settings.json`, preserving all existing keys:
   `"statusLine": { "type": "command", "command": "node \"<absolute-script-path>\"" }`
   If a `statusLine` already exists, show it and ask before replacing.
5. Confirm to the user: show a sample —
   ```
   Opus 4.8 | ctx 8% | <project>
   current ●●○○○○○○○○ 24% ↻ 3hr 2min
   weekly  ●●●●●●●○○○ 73% ↻ Sun 10:00pm
   ```
   (⚠ appears next to ctx% near auto-compact; either meter line is omitted when Claude Code
   doesn't report that limit). Say it appears on the next interaction/restart, and that deleting
   the `statusLine` key removes it.

This is a user-level convenience; the central Grafana dashboard remains the source of truth for
org usage. $ARGUMENTS
