#!/usr/bin/env node
// Gateway status line: model+version · context% (auto-compact warning) · project, then a
// current (5h) / weekly (7d) shared-usage meter — dot bar, %, reset time — mirroring the org
// dashboard's limits view (no $ cost: Team is per-seat, not per-token, see HANDOFF §15.6).
// Also (if GATEWAY_TELEMETRY_URL/TOKEN are set) reports the per-user 5h/7d rate-limit % to the
// ingest — throttled to once / 5 min, fire-and-forget, never blocks the status line output.
import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

function levelColor(pct) {
  if (pct >= 90) return RED;
  if (pct >= 70) return YELLOW;
  return GREEN;
}

function dotBar(pct) {
  const filled = Math.max(0, Math.min(10, Math.floor(pct / 10)));
  return "●".repeat(filled) + "○".repeat(10 - filled);
}

// display_name drops the version Claude Code still carries in model.id (e.g.
// "claude-opus-4-8" -> "4.8"); haiku ids also carry a trailing release-date segment
// ("-20251001") that isn't part of the version and must be stripped.
function modelVersion(id) {
  if (!id) return "";
  const twoPart = id.match(/-(\d+)-(\d+)(?:-\d{8})?$/);
  if (twoPart) return `${twoPart[1]}.${twoPart[2]}`;
  const onePart = id.match(/-(\d+)$/);
  return onePart ? onePart[1] : "";
}

function relativeCountdown(resetsAtSec, now = Date.now()) {
  if (!resetsAtSec) return null;
  const totalMin = Math.round((resetsAtSec * 1000 - now) / 60000);
  if (totalMin <= 0) return "now";
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0 && m > 0) return `${h}hr ${m}min`;
  return h > 0 ? `${h}hr` : `${m}min`;
}

function absoluteReset(resetsAtSec) {
  if (!resetsAtSec) return null;
  const d = new Date(resetsAtSec * 1000);
  const weekday = d.toLocaleDateString(undefined, { weekday: "short" });
  const hour24 = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const hour12 = hour24 % 12 || 12;
  return `${weekday} ${hour12}:${minutes}${hour24 >= 12 ? "pm" : "am"}`;
}

export function render(j, now = Date.now()) {
  const modelName = j.model?.display_name ?? "?";
  const version = modelVersion(j.model?.id);
  const ctx = Math.round(j.context_window?.used_percentage ?? 0);
  const warn = ctx >= 80 ? "⚠ " : "";
  const project = j.workspace?.repo?.name || path.basename(j.workspace?.current_dir || j.cwd || "");

  const lines = [
    `${version ? `${modelName} ${version}` : modelName} | ctx ${levelColor(ctx)}${warn}${ctx}%${RESET}` +
      (project ? ` | ${project}` : ""),
  ];

  const r5 = j.rate_limits?.five_hour;
  if (r5?.used_percentage != null) {
    const pct = Math.round(r5.used_percentage);
    const reset = relativeCountdown(r5.resets_at, now);
    lines.push(
      `current ${levelColor(pct)}${dotBar(pct)} ${pct}%${RESET}` + (reset ? ` ↻ ${reset}` : ""),
    );
  }

  const r7 = j.rate_limits?.seven_day;
  if (r7?.used_percentage != null) {
    const pct = Math.round(r7.used_percentage);
    const reset = absoluteReset(r7.resets_at);
    lines.push(
      `weekly  ${levelColor(pct)}${dotBar(pct)} ${pct}%${RESET}` + (reset ? ` ↻ ${reset}` : ""),
    );
  }

  return lines.join("\n");
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
