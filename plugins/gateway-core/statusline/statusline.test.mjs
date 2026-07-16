import { test } from "node:test";
import assert from "node:assert/strict";
import { render } from "./statusline.mjs";

const base = {
  model: { id: "claude-opus-4-8", display_name: "Opus" },
  workspace: { current_dir: "/repo/hance-site", repo: { name: "hance-site" } },
  context_window: { used_percentage: 0 },
};

test("renders model version, context %, and project on line 1", () => {
  const [line1] = render(base).split("\n");
  assert.equal(line1, "Opus 4.8 | ctx \x1b[32m0%\x1b[0m | hance-site");
});

test("parses a single-number version (e.g. sonnet-5) with no dot", () => {
  const j = { ...base, model: { id: "claude-sonnet-5", display_name: "Sonnet" } };
  const [line1] = render(j).split("\n");
  assert.ok(line1.startsWith("Sonnet 5 |"));
});

test("strips the trailing release-date segment from haiku ids", () => {
  const j = { ...base, model: { id: "claude-haiku-4-5-20251001", display_name: "Haiku" } };
  const [line1] = render(j).split("\n");
  assert.ok(line1.startsWith("Haiku 4.5 |"));
});

test("falls back to the cwd basename when there is no repo remote", () => {
  const j = { ...base, workspace: { current_dir: "/repo/hance-site" } };
  const [line1] = render(j).split("\n");
  assert.ok(line1.endsWith("| hance-site"));
});

test("warns near auto-compact", () => {
  const j = { ...base, context_window: { used_percentage: 82 } };
  const [line1] = render(j).split("\n");
  assert.ok(line1.includes("⚠ 82%"));
});

test("current (5h) meter: dot count floors, reset is a relative countdown", () => {
  const now = Date.UTC(2026, 0, 1, 12, 0, 0);
  const j = {
    ...base,
    rate_limits: { five_hour: { used_percentage: 24, resets_at: now / 1000 + 3 * 3600 + 2 * 60 } },
  };
  const [, current] = render(j, now).split("\n");
  assert.equal(current, "current \x1b[32m●●○○○○○○○○ 24%\x1b[0m ↻ 3hr 2min");
});

test("weekly (7d) meter: reset is an absolute weekday + 12h time", () => {
  const resetsAt = new Date("2026-07-19T22:00:00").getTime() / 1000; // a Sunday, 10:00pm
  const j = {
    ...base,
    rate_limits: { seven_day: { used_percentage: 73, resets_at: resetsAt } },
  };
  const lines = render(j).split("\n");
  const weekly = lines[lines.length - 1];
  assert.equal(weekly, "weekly  \x1b[33m●●●●●●●○○○ 73%\x1b[0m ↻ Sun 10:00pm");
});

test("omits a meter line entirely when its rate-limit data is missing", () => {
  const lines = render(base).split("\n");
  assert.equal(lines.length, 1);
});

test("colors escalate to red at >=90%", () => {
  const j = { ...base, rate_limits: { five_hour: { used_percentage: 95 } } };
  const [, current] = render(j).split("\n");
  assert.ok(current.startsWith("current \x1b[31m"));
});
