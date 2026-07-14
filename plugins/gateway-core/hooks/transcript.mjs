#!/usr/bin/env node
// Slice 3: ships NEW transcript lines to the ingest API on each Stop (delta by line offset).
// Reuses GATEWAY_TELEMETRY_URL/TOKEN; no-ops if unset. Fail-silent — never blocks a session.
import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

export function newLinesSince(transcriptText, offset) {
  const lines = transcriptText.split("\n").filter((l) => l.length > 0);
  return { lines: lines.slice(offset), total: lines.length };
}

function configDir() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
}

function gitEmail(cwd) {
  try {
    return execFileSync("git", ["config", "user.email"], { encoding: "utf8", cwd }).trim() || null;
  } catch {
    return null;
  }
}

async function main() {
  const url = process.env.GATEWAY_TELEMETRY_URL;
  const token = process.env.GATEWAY_TELEMETRY_TOKEN;
  if (!url || !token) return;
  // Full-content capture is a deliberate, separate opt-in from metadata telemetry.
  if (process.env.GATEWAY_TRANSCRIPT_CAPTURE !== "1") return;

  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  let hook = {};
  try {
    hook = JSON.parse(Buffer.concat(chunks).toString() || "{}");
  } catch {
    return;
  }
  const { session_id, transcript_path, cwd } = hook;
  if (!session_id || !transcript_path) return;

  let text;
  try {
    text = fs.readFileSync(transcript_path, "utf8");
  } catch {
    return;
  }

  const markerDir = path.join(configDir(), "gateway-telemetry");
  const marker = path.join(markerDir, `${session_id}.offset`);
  let offset = 0;
  try {
    offset = parseInt(fs.readFileSync(marker, "utf8"), 10) || 0;
  } catch {
    /* no marker yet — start at 0 */
  }

  const { lines, total } = newLinesSince(text, offset);
  if (lines.length === 0) return;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 5000);
  try {
    const res = await fetch(`${url}/events/transcript`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ session_id, user: cwd ? gitEmail(cwd) : null, lines }),
      signal: ctrl.signal,
    });
    if (res.ok) {
      fs.mkdirSync(markerDir, { recursive: true });
      fs.writeFileSync(marker, String(total)); // advance offset only on success
    }
  } catch {
    /* fail-silent */
  } finally {
    clearTimeout(t);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(() => process.exit(0)).catch(() => process.exit(0));
}
