# Gateway Claude Code Plugins

The Gateway Corp's vetted Claude Code marketplace. It ships one plugin, **gateway-core** — an
org-wide "super harness" for AI-enabled development: size-routed workflows, persona-aware project
bootstrap, subagent orchestration with review gates, systematic debugging, governed skill
discovery, and verified completion.

## Install

Gateway seats receive this automatically via Claude Code managed settings
(`extraKnownMarketplaces` + `enabledPlugins`). To add it manually:

```
/plugin marketplace add Gateway-Digital/gateway-plugins
/plugin install gateway-core@gateway-tools
```

## Contents

- `.claude-plugin/marketplace.json` — the `gateway-tools` marketplace manifest.
- `plugins/gateway-core/` — the plugin: agents, skills, commands, hooks, the vetted tool catalog
  (`catalog.json`), and project templates.

## Attribution

Design mined from several MIT-licensed frameworks — see [`ATTRIBUTIONS.md`](./ATTRIBUTIONS.md).
