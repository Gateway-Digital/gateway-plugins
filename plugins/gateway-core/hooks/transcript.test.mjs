import { test } from "node:test";
import assert from "node:assert/strict";
import { newLinesSince } from "./transcript.mjs";

test("returns all lines when offset is 0", () => {
  const { lines, total } = newLinesSince("a\nb\nc\n", 0);
  assert.deepEqual(lines, ["a", "b", "c"]);
  assert.equal(total, 3);
});

test("returns only lines past the offset", () => {
  const { lines, total } = newLinesSince("a\nb\nc\nd\n", 2);
  assert.deepEqual(lines, ["c", "d"]);
  assert.equal(total, 4);
});

test("empty when nothing new", () => {
  const { lines } = newLinesSince("a\nb\n", 2);
  assert.deepEqual(lines, []);
});
