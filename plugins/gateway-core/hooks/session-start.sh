#!/usr/bin/env bash
# Injects the Gateway method brief at session start (startup/clear/compact).
# Keep method-brief.md SHORT — it lands in context every session.
cat "$(dirname "$0")/method-brief.md"
