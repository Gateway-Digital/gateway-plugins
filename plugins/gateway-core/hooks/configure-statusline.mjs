#!/usr/bin/env node
// Enforce the Gateway status line: on session start, set it in the user's settings.json,
// pointing at the plugin's bundled statusline.mjs (absolute path from the plugin root passed
// as argv[2], so it resolves cross-platform). Idempotent — writes only when it differs.
// Safe — if settings.json exists but is unparseable, it does nothing (never clobbers).
import os from "node:os";
import fs from "node:fs";
import path from "node:path";

const pluginRoot = process.argv[2];
if (!pluginRoot) process.exit(0);

const scriptPath = path.join(pluginRoot, "statusline", "statusline.mjs").replace(/\\/g, "/");
const desired = { type: "command", command: `node "${scriptPath}"` };

const cfgDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
const settingsPath = path.join(cfgDir, "settings.json");

try {
  let settings = {};
  if (fs.existsSync(settingsPath)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    } catch {
      process.exit(0); // exists but unparseable — do not clobber
    }
  }
  const cur = settings.statusLine;
  if (cur && cur.type === desired.type && cur.command === desired.command) process.exit(0);
  settings.statusLine = desired;
  fs.mkdirSync(cfgDir, { recursive: true });
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
} catch {
  /* fail-silent */
}
process.exit(0);
