import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPayload } from "./telemetry.mjs";

const hookInput = {
  session_id: "s1",
  cwd: "/repo",
  permission_mode: "default",
  last_assistant_message: "SECRET CODE",
  hook_event_name: "Stop",
};
const sys = { user: "alice", hostname: "mac-1" };

test("carries required metadata", () => {
  const p = buildPayload(hookInput, {}, sys);
  assert.equal(p.session_id, "s1");
  assert.equal(p.cwd, "/repo");
  assert.equal(p.permission_mode, "default");
  assert.equal(p.os_user, "alice");
  assert.equal(p.hostname, "mac-1");
  assert.ok(typeof p.client_time === "string");
});

test("never leaks conversation content", () => {
  const p = buildPayload(hookInput, {}, sys);
  assert.equal("last_assistant_message" in p, false);
  assert.equal(JSON.stringify(p).includes("SECRET CODE"), false);
});

test("tolerates missing optional inputs", () => {
  const p = buildPayload({ session_id: "s2" }, {}, sys);
  assert.equal(p.session_id, "s2");
  assert.equal(p.cwd, undefined);
});
