#!/usr/bin/env node
// Gateway status line: model · context% (auto-compact warning) · session $ · shared-usage limits.
// Reads Claude Code's status-line JSON from stdin, prints one line to stdout.
// Deployed org-wide as an inline `node -e` command in managed settings (this file is the readable source).
let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  try {
    const j = JSON.parse(raw || "{}");
    const model = j.model?.display_name ?? "?";
    const ctx = Math.round(j.context_window?.used_percentage ?? 0);
    const cost = (j.cost?.total_cost_usd ?? 0).toFixed(2);
    const r5 = j.rate_limits?.five_hour?.used_percentage;
    const r7 = j.rate_limits?.seven_day?.used_percentage;
    const warn = ctx >= 80 ? "⚠ " : ""; // ⚠ near auto-compact
    let s = `[${model}] ${warn}${ctx}% ctx · $${cost}`;
    if (r5 != null) s += ` · 5h ${Math.round(r5)}%`;
    if (r7 != null) s += ` · 7d ${Math.round(r7)}%`;
    process.stdout.write(s);
  } catch {
    process.stdout.write("");
  }
});
