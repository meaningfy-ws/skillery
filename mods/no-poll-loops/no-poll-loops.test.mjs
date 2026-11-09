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

// ---- adversarial cases (stage 4 tester) -------------------------------------------------------

const MODULE = fileURLToPath(new URL("./no-poll-loops.mjs", import.meta.url));

const MORE_DENIED = [
  "while :; do date; sleep 5; done",
  "until false; do sleep 2; done &",
  "for ((i=0;i<5;i++)); do sleep 1; done",
  "while true; do x=$(sleep 1); done",
  "while true; do foo && sleep 1; done",
  "while true; do sleep 1; done # keep waiting",
  "while true; do /bin/sleep 1; done",
  "while true; do timeout 5 sleep 1; done",
  "echo \"a \\\" b\"; while true; do sleep 1; done",
  "echo \"it's\"; while true; do sleep 1; done",
  "for i in 1 2; do for j in 1 2; do sleep 1; done; done",
  "watch -n1 date",
  "watch --interval=2 date",
  "watch -d -n 1 date",
];
const MORE_ALLOWED = [
  "time sleep 3",
  "for sleepy in a b; do echo $sleepy; done",
  "while true; do echo sleepy; done",
  "while true; do nosleep; done",
  "while read l; do echo $l; done < f; sleep 3",
  "git commit -m 'x' && for f in a; do echo; done",
  "echo \"a \\\" while true; do sleep 1; done\"",
  "watch -d date",
  "git log --watch -n 5",
  "",
  "   \n  ",
];
for (const command of MORE_DENIED) {
  test(`adversarial denies: ${JSON.stringify(command)}`, () => assert.equal(check(command), MESSAGE));
}
for (const command of MORE_ALLOWED) {
  test(`adversarial allows: ${JSON.stringify(command)}`, () => assert.equal(check(command), null));
}

// Defects: a legitimate command is denied (D-5: allow everything that is not a sleep loop / watch -n).
test("sleep inside a flag-like word is not a sleep command (--sleep-time)", () =>
  assert.equal(check("while true; do echo --sleep-time; done"), null));
test("sleep inside a hyphenated word is not a sleep command (my-sleep-config)", () =>
  assert.equal(check("for f in a; do echo my-sleep-config; done"), null));
test("grep for the word watch with -n is not watch -n", () =>
  assert.equal(check("grep watch -n src/"), null));
test("a loop inside a heredoc is data, not a polling command", () =>
  assert.equal(check("cat <<EOF\nwhile true; do sleep 1; done\nEOF"), null));

// Documented shortcut limit in the module: a sleep after an inner `done` of a nested loop is missed.
test(
  "nested loop: sleep in the outer body after the inner done is denied",
  { todo: "shortcut: nested loops and a sleep after an inner done are not told apart" },
  () => assert.equal(check("for i in 1 2; do for j in 1 2; do echo; done; sleep 1; done"), MESSAGE),
);
// Documented: quote stripping hides a sleep in a quoted interpreter one-liner (spec allows it).
test("quoted python sleep loop in a bash loop is allowed (quote stripping)", () =>
  assert.equal(check("while true; do python -c 'import time; time.sleep(1)'; done"), null));

// Limits: check() must stay fast on large and pathological input. Run in a child so a hang fails.
const timeInChild = (source) => {
  const code = `import(${JSON.stringify(MODULE)}).then(({check})=>{const s=${source};` +
    `const t=performance.now();check(s);process.stdout.write(String(performance.now()-t));})`;
  const r = spawnSync(process.execPath, ["-e", code], { encoding: "utf8", timeout: 5000 });
  return r.status === 0 ? Number(r.stdout) : Infinity;
};
for (const [name, source] of [
  ["100k plain characters", `"a".repeat(100000)`],
  ["100k of ordinary words", `"ls -la /tmp ".repeat(8400)`],
  ["100k of unterminated while loops with no sleep", `"while x; do echo; ".repeat(5600)`],
  ["100k of `while do` pairs with no sleep", `"while do ".repeat(11200)`],
  ["100k of watch words", `"watch ".repeat(16700)`],
]) {
  test(`limit: ${name} checks in under 200 ms`, () => {
    const ms = timeInChild(source);
    assert.ok(ms < 200, `took ${ms} ms (Infinity = timed out / crashed)`);
  });
}

// CLI: bad shapes of hook input all fail open.
for (const [name, input] of [
  ["empty stdin", ""],
  ["JSON null", "null"],
  ["JSON array", "[]"],
  ["missing tool_input", JSON.stringify({ tool_name: "Bash" })],
  ["tool_input null", JSON.stringify({ tool_input: null })],
  ["empty command", hookJson("")],
  ["numeric command", JSON.stringify({ tool_input: { command: 5 } })],
  ["array command", JSON.stringify({ tool_input: { command: ["while true; do sleep 1; done"] } })],
  ["object command", JSON.stringify({ tool_input: { command: { a: 1 } } })],
]) {
  test(`CLI fails open: ${name}`, () => {
    const r = run(input);
    assert.equal(r.status, 0);
    assert.equal(r.stderr, "");
  });
}
test("CLI: multi-line deny via JSON newline escape exits 2", () =>
  assert.equal(run(hookJson("until x\ndo\n sleep 2\ndone &")).status, 2));
