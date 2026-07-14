#!/usr/bin/env node
// Gateway status line: model · context% (auto-compact warning) · session $ · shared-usage limits.
// Also (if GATEWAY_TELEMETRY_URL/TOKEN are set) reports the per-user 5h/7d rate-limit % to the
// ingest — throttled to once / 5 min, fire-and-forget, never blocks the status line output.
import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

export function render(j) {
  const model = j.model?.display_name ?? "?";
  const ctx = Math.round(j.context_window?.used_percentage ?? 0);
  const cost = (j.cost?.total_cost_usd ?? 0).toFixed(2);
  const r5 = j.rate_limits?.five_hour?.used_percentage;
  const r7 = j.rate_limits?.seven_day?.used_percentage;
  const warn = ctx >= 80 ? "⚠ " : "";
  let s = `[${model}] ${warn}${ctx}% ctx · $${cost}`;
  if (r5 != null) s += ` · 5h ${Math.round(r5)}%`;
  if (r7 != null) s += ` · 7d ${Math.round(r7)}%`;
  return s;
}

function configDir() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
}

function gitEmail() {
  try {
    return execFileSync("git", ["config", "user.email"], { encoding: "utf8" }).trim() || null;
  } catch {
    return null;
  }
}

async function reportLimits(j) {
  const url = process.env.GATEWAY_TELEMETRY_URL;
  const token = process.env.GATEWAY_TELEMETRY_TOKEN;
  const rl = j.rate_limits;
  if (!url || !token || !rl) return;

  const stamp = path.join(configDir(), "gateway-telemetry", "limits.stamp");
  try {
    if (Date.now() - (parseInt(fs.readFileSync(stamp, "utf8"), 10) || 0) < 5 * 60 * 1000) return;
  } catch {
    /* no stamp yet */
  }
  const email = gitEmail();
  if (!email) return;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 2000);
  try {
    const res = await fetch(`${url}/events/limits`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        git_email: email,
        five_hour_pct: rl.five_hour?.used_percentage ?? null,
        seven_day_pct: rl.seven_day?.used_percentage ?? null,
        five_hour_reset: rl.five_hour?.resets_at ?? null,
        seven_day_reset: rl.seven_day?.resets_at ?? null,
      }),
      signal: ctrl.signal,
    });
    if (res.ok) {
      fs.mkdirSync(path.dirname(stamp), { recursive: true });
      fs.writeFileSync(stamp, String(Date.now()));
    }
  } catch {
    /* fail-silent */
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  let raw = "";
  for await (const c of process.stdin) raw += c;
  let j = {};
  try {
    j = JSON.parse(raw || "{}");
  } catch {
    /* ignore */
  }
  process.stdout.write(render(j)); // emit the status line first
  await reportLimits(j); // then throttled fire-and-forget
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(() => process.exit(0)).catch(() => process.exit(0));
}
