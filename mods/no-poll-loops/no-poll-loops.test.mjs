import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { check, MESSAGE } from "./no-poll-loops.mjs";

const SCRIPT = fileURLToPath(new URL("./no-poll-loops.mjs", import.meta.url));

const DENIED = [
  "until gh run view 123 | grep -q completed; do sleep 20; done",
  "while true; do curl -s x; sleep 5; done",
  "for i in 1 2 3; do sleep 1; done",
  "while true\ndo\n  sleep 2\ndone",
  "watch -n 5 kubectl get pods",
  "watch -n5 date",
  "watch --interval 10 date",
];
const ALLOWED = [
  "sleep 5",
  "gh pr checks 7 --watch",
  "gh pr checks 7 --watch --interval 10",
  "wait",
  "for f in a b; do echo $f; done",
  'python -c "while x: time.sleep(1)"',
  "echo 'until x; do sleep 1; done'",
  "for f in a b; do echo $f; done; sleep 5",
  "watch date",
  "ls",
];

for (const command of DENIED) {
  test(`denies: ${JSON.stringify(command)}`, () => assert.equal(check(command), MESSAGE));
}
for (const command of ALLOWED) {
  test(`allows: ${JSON.stringify(command)}`, () => assert.equal(check(command), null));
}

test("message is the D-5 text", () => {
  assert.equal(
    MESSAGE,
    "Sleep loops are denied. Run the command in the foreground if it fits the tool timeout " +
      "(a subagent may never get a completion notice); otherwise run it in the background once " +
      "and wait for its notice or one blocking wait.",
  );
});

const run = (input) => spawnSync(process.execPath, [SCRIPT], { input, encoding: "utf8" });
const hookJson = (command) => JSON.stringify({ tool_name: "Bash", tool_input: { command } });

test("CLI: deny exits 2 with the message on stderr", () => {
  const r = run(hookJson("while true; do sleep 1; done"));
  assert.equal(r.status, 2);
  assert.equal(r.stderr.trim(), MESSAGE);
});

test("CLI: allow exits 0", () => assert.equal(run(hookJson("sleep 5")).status, 0));
test("CLI: bad JSON fails open", () => assert.equal(run("{not json").status, 0));
test("CLI: missing command fails open", () => assert.equal(run("{}").status, 0));
