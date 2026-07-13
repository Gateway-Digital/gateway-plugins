#!/usr/bin/env node
import os from "node:os";
import { execFileSync } from "node:child_process";

function deviceId() {
  try {
    if (process.platform === "darwin") {
      const out = execFileSync("ioreg", ["-rd1", "-c", "IOPlatformExpertDevice"], {
        encoding: "utf8",
      });
      return out.match(/"IOPlatformUUID"\s*=\s*"([^"]+)"/)?.[1] ?? null;
    }
    if (process.platform === "linux") {
      return execFileSync("cat", ["/etc/machine-id"], { encoding: "utf8" }).trim() || null;
    }
    if (process.platform === "win32") {
      const out = execFileSync(
        "reg",
        ["query", "HKLM\\SOFTWARE\\Microsoft\\Cryptography", "/v", "MachineGuid"],
        { encoding: "utf8" }
      );
      return out.match(/MachineGuid\s+REG_SZ\s+([\w-]+)/)?.[1] ?? null;
    }
  } catch {
    /* fail-silent */
  }
  return null;
}

function gitEmail(cwd) {
  try {
    return execFileSync("git", ["config", "user.email"], { encoding: "utf8", cwd }).trim() || null;
  } catch {
    return null;
  }
}

function projectPath(cwd) {
  try {
    return execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8", cwd }).trim();
  } catch {
    return cwd;
  }
}

export function buildPayload(hookInput, env, sys) {
  const cwd = hookInput.cwd;
  const payload = {
    session_id: hookInput.session_id,
    device_id: deviceId(),
    os_user: sys.user,
    git_email: cwd ? gitEmail(cwd) : null,
    project_path: cwd ? projectPath(cwd) : null,
    cwd,
    permission_mode: hookInput.permission_mode,
    cc_version: env.CLAUDE_CODE_VERSION ?? null,
    hostname: sys.hostname,
    client_time: new Date().toISOString(),
  };
  // strip undefined keys so the JSON stays clean
  return Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));
}

async function main() {
  const url = process.env.GATEWAY_TELEMETRY_URL;
  const token = process.env.GATEWAY_TELEMETRY_TOKEN;
  if (!url || !token) return; // telemetry not configured; do nothing

  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  let hookInput = {};
  try {
    hookInput = JSON.parse(Buffer.concat(chunks).toString() || "{}");
  } catch {
    return;
  }

  const payload = buildPayload(hookInput, process.env, {
    user: os.userInfo().username,
    hostname: os.hostname(),
  });

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 3000);
  try {
    await fetch(`${url}/events/stop`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
  } catch {
    /* fail-silent: never block or slow the session */
  } finally {
    clearTimeout(t);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(() => process.exit(0)).catch(() => process.exit(0));
}
