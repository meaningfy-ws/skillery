import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { check, READ_FILE, USE_GREP, NO_VERBOSE } from "./quiet-tools.mjs";

const SCRIPT = fileURLToPath(new URL("./quiet-tools.mjs", import.meta.url));

const NOISY = [
  ["sed -n with a file", "sed -n '1,40p' src/app.py", READ_FILE],
  ["sed -n with the flag after the script", "sed -n 10,20p README.md", READ_FILE],
  ["cat of a file", "cat docs/development/mods.md", READ_FILE],
  ["head of a file", "head -n 50 tools/validate.py", READ_FILE],
  ["tail of a file", "tail -n 100 build.log", READ_FILE],
  ["cat after a separator", "cd x && cat a.txt", READ_FILE],
  ["grep with a path", "grep -rn foo src/", USE_GREP],
  ["rg with a path", "rg 'def check' mods", USE_GREP],
  ["ugrep with a path", "ugrep -r todo docs", USE_GREP],
  ["pytest -v", "python -m pytest tests/ -v", NO_VERBOSE],
  ["pytest --verbose", "pytest --verbose tests/test_a.py", NO_VERBOSE],
  ["-vv on any command", "pytest -vv", NO_VERBOSE],
  ["pytest -v behind uv run", "uv run pytest -v -x", NO_VERBOSE],
];
const QUIET = [
  ["git diff --stat", "git diff --stat"],
  ["tail -n on a pipe", "make test 2>&1 | tail -n 20"],
  ["grep on a pipe", "git log --oneline | grep fix"],
  ["head on a pipe", "git log | head -20"],
  ["cat on a pipe", "echo hi | cat"],
  ["sed -n on a pipe", "git log | sed -n '1,5p'"],
  ["make", "make mods"],
  ["a cat heredoc write", "cat <<EOF\nfoo\nEOF"],
  ["a cat heredoc to a file", "cat > $TMPDIR/x <<'EOF'\nsed -n 1p a.txt\nEOF"],
  ["quiet pytest", "pytest -q -rfE"],
  ["a quoted example", "echo 'cat file.txt'"],
  ["grep -v is invert-match, not verbose", "git log | grep -v wip"],
  ["grep -v with stdin only", "echo a | grep -v b"],
  ["a command with no file operand", "git log --oneline"],
  ["empty command", ""],
];

for (const [name, command, message] of NOISY) {
  test(`warns: ${name}`, () => assert.equal(check(command), message));
}
for (const [name, command] of QUIET) {
  test(`stays quiet: ${name}`, () => assert.equal(check(command), null));
}

test("one message per command: the first form found wins", () =>
  assert.equal(check("cat a.txt && pytest -v"), READ_FILE));

test("messages name the quiet form", () => {
  assert.match(READ_FILE, /Read tool/);
  assert.match(USE_GREP, /Grep tool/);
  assert.match(NO_VERBOSE, /-q -rfE/);
});

const run = (input) => spawnSync(process.execPath, [SCRIPT], { input, encoding: "utf8" });
const hookJson = (command) => JSON.stringify({ tool_name: "Bash", tool_input: { command } });

test("CLI: a noisy command prints additionalContext JSON and exits 0", () => {
  const r = run(hookJson("cat docs/a.md"));
  assert.equal(r.status, 0);
  assert.deepEqual(JSON.parse(r.stdout), {
    hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: READ_FILE },
  });
  assert.equal(r.stderr, "");
});

test("CLI: pytest -v carries the quiet-form text in additionalContext", () => {
  const r = run(hookJson("pytest -v"));
  assert.equal(r.status, 0);
  assert.equal(JSON.parse(r.stdout).hookSpecificOutput.additionalContext, NO_VERBOSE);
});

test("CLI: a quiet command prints nothing and exits 0", () => {
  const r = run(hookJson("git diff --stat"));
  assert.equal(r.status, 0);
  assert.equal(r.stdout, "");
  assert.equal(r.stderr, "");
});

for (const [name, input] of [
  ["malformed JSON", "{not json"],
  ["empty stdin", ""],
  ["missing command", "{}"],
  ["numeric command", JSON.stringify({ tool_input: { command: 5 } })],
]) {
  test(`CLI fails open: ${name}`, () => {
    const r = run(input);
    assert.equal(r.status, 0);
    assert.equal(r.stdout, "");
  });
}
