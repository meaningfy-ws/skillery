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
  ["pytest -vvv", "pytest -vvv", NO_VERBOSE],
  ["pytest -x -v after other flags", "pytest -x -v tests/", NO_VERBOSE],
  ["a short-option cluster with v", "pytest -xv tests/", NO_VERBOSE],
  ["a cluster with v first", "python -m pytest -vx", NO_VERBOSE],
  ["a cluster -sv", "pytest -sv", NO_VERBOSE],
  ["two -v after a -q net verbose", "pytest -q -v -v", NO_VERBOSE],
  ["a wrapper: sudo", "sudo cat file.txt", READ_FILE],
  ["a wrapper: nice -n", "nice -n 5 cat file.txt", READ_FILE],
  ["a wrapper: env with X=1", "env X=1 cat file.txt", READ_FILE],
  ["a wrapper: nohup", "nohup cat file.txt", READ_FILE],
  ["a wrapper: timeout n", "timeout 5 cat file.txt", READ_FILE],
  ["a wrapper: xargs", "xargs cat file.txt", READ_FILE],
  ["a wrapper: time", "time cat file.txt", READ_FILE],
  ["a wrapper before pytest -v", "sudo uv run pytest -v", NO_VERBOSE],
  ["rg with a pattern and no path", "rg pattern", USE_GREP],
  ["ugrep with a pattern and no path", "ugrep todo", USE_GREP],
  ["grep -r with no path", "grep -r pattern", USE_GREP],
  ["grep -R with no path", "grep -R pattern", USE_GREP],
  ["rg -e with no path", "rg -e pattern", USE_GREP],
  ["sed -n -e with a file", "sed -n -e '1,5p' file.txt", READ_FILE],
  ["sed -ne with a file", "sed -ne '1p' file.txt", READ_FILE],
  ["sed -n -f with a file", "sed -n -f script.sed file.txt", READ_FILE],
  ["grep -e with a file", "grep -e foo file.txt", USE_GREP],
  ["grep --regexp= with a file", "grep --regexp=foo file.txt", USE_GREP],
  ["cat <<- heredoc then a file", "cat <<-EOF a.txt\n\tx\n\tEOF", READ_FILE],
  ["grep after --", "grep pattern -- file.txt", USE_GREP],
  ["cat in a subshell", "(cat file.txt)", READ_FILE],
  ["cat in $(...)", "echo $(cat file.txt)", READ_FILE],
  ["a quoted path with spaces", 'cat "docs/my file.md"', READ_FILE],
  ["an escaped space", "cat docs/my\\ file.md", READ_FILE],
  ["a single-quoted path", "cat 'a.txt'", READ_FILE],
  ["a glob operand", "cat *.log", READ_FILE],
  ["a Windows-style path", "cat C:\\Users\\me\\notes.txt", READ_FILE],
  ["cat 2>&1 without a pipe", "cat a.txt 2>&1", READ_FILE],
  ["tail -n +5 file", "tail -n +5 file.txt", READ_FILE],
  ["tail -f file", "tail -f app.log", READ_FILE],
  ["head -c file", "head -c 100 file.txt", READ_FILE],
  ["cat file into a head still reads the file", "cat file.txt | head", READ_FILE],
  ["cat after ||", "false || cat file.txt", READ_FILE],
  ["cat after ;", "ls; cat file.txt", READ_FILE],
  ["X=1 prefix", "X=1 cat file.txt", READ_FILE],
  ["newline before cat", "ls\ncat file.txt", READ_FILE],
  ["newline after cat", "cat file.txt\nls", READ_FILE],
  ["grep -v with a file", "grep -v foo file.txt", USE_GREP],
  ["grep -l with a glob", "grep -l pattern *.py", USE_GREP],
  ["pytest -v first, then a cat", "pytest -v && cat a.txt", NO_VERBOSE],
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
  ["-vv on a non-test command", "git branch -vv"],
  ["-vv on ssh", "ssh -vv host"],
  ["-vv on curl", "curl -vv https://example.org"],
  ["uv sync --verbose is not a test run", "uv sync --verbose"],
  ["pytest -v -q nets quiet", "pytest -v -q"],
  ["pytest -q after -v nets quiet", "pytest -v -x -q"],
  ["pytest -v -qq nets quiet", "pytest -v -qq"],
  ["grep -v pytest on a pipe", "git log --oneline | grep -v pytest"],
  ["rg on a pipe", "git log | rg fix"],
  ["rg with no operand", "rg"],
  ["stdout to a file", "cat a.txt b.txt > $TMPDIR/combined.txt"],
  ["stdout appended to a file", "head -n 50 big.log >> $TMPDIR/head.txt"],
  ["2>&1 then to a file", "grep -rn foo src/ 2>&1 > $TMPDIR/hits.txt"],
  ["grep to a file with 2>&1 after", "grep -rn foo src/ > $TMPDIR/hits.txt 2>&1"],
  ["a read into a non-reading pipe: wc", "cat a.txt | wc -l"],
  ["a read into a non-reading pipe: sort", "cat a.txt | sort"],
  ["grep -q", "grep -q foo file.txt && echo yes"],
  ["grep -c", "grep -c foo file.txt"],
  ["- as an operand is stdin", "cat -"],
  ["grep with - as the file", "git log | grep foo -"],
  ["cat with a < redirect", "cat < b.txt"],
  ["sed -i is an edit", "sed -i 's/a/b/' file.txt"],
  ["sed --in-place is an edit", "sed --in-place 's/a/b/' file.txt"],
  ["a quoted subshell body", "echo \"$(cat file.txt)\""],
  ["cmd 2>&1 without a pipe and no file", "make mods 2>&1"],
  ["the whitespace only", "   \n\t "],
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

for (const [name, input] of [
  ["tool_input missing", JSON.stringify({ tool_name: "Bash" })],
  ["tool_input null", JSON.stringify({ tool_input: null })],
  ["tool_input a string", JSON.stringify({ tool_input: "cat a.txt" })],
  ["command an array", JSON.stringify({ tool_input: { command: ["cat", "a.txt"] } })],
  ["command null", JSON.stringify({ tool_input: { command: null } })],
  ["top-level JSON null", "null"],
  ["a BOM before the JSON", `﻿${hookJson("cat a.txt")}`],
]) {
  test(`CLI fails open: ${name}`, () => {
    const r = run(input);
    assert.equal(r.status, 0);
    assert.equal(r.stdout, "");
  });
}

for (const [message, command] of [
  [READ_FILE, "cat a.txt"],
  [USE_GREP, "grep -rn foo src/"],
  [NO_VERBOSE, "pytest -v"],
]) {
  test(`CLI output has exactly the documented keys and never denies: ${message.slice(0, 30)}`, () => {
    const r = run(hookJson(command));
    assert.equal(r.status, 0);
    assert.ok(r.stdout.endsWith("\n") && r.stdout.trimEnd().split("\n").length === 1, "one line of JSON");
    const out = JSON.parse(r.stdout);
    assert.deepEqual(Object.keys(out), ["hookSpecificOutput"]);
    assert.deepEqual(Object.keys(out.hookSpecificOutput).sort(), ["additionalContext", "hookEventName"]);
    assert.equal(out.hookSpecificOutput.additionalContext, message);
    assert.equal(r.stderr, "");
  });
}

test("CLI: a command with newlines and quotes round-trips through the JSON", () => {
  const r = run(hookJson("echo 'a\nb'\ncat \"x y.txt\"\r\n"));
  assert.equal(JSON.parse(r.stdout).hookSpecificOutput.additionalContext, READ_FILE);
});

test("non-string input is coerced and does not throw", () => {
  assert.doesNotThrow(() => check(undefined));
  assert.doesNotThrow(() => check(null));
  assert.doesNotThrow(() => check(["cat", "a.txt"]));
});

test("a 100 KB command returns in time (input beyond 64 KB is skipped)", () => {
  const started = Date.now();
  assert.doesNotThrow(() => check(`cat a.txt ${"x ".repeat(50 * 1024)}`));
  assert.ok(Date.now() - started < 2000);
});

test("a command just under 64 KB still warns", () =>
  assert.equal(check(`cat a.txt # ${"x".repeat(60 * 1024)}`), READ_FILE));

for (const [name, unit] of [
  ["unclosed quotes", "'"],
  ["heredoc openers", "<<a "],
  ["backslashes", "\\"],
  ["subshell parens", "(("],
  ["pipes and ampersands", "|&"],
]) {
  test(`60 KB of ${name} is processed in linear time`, () => {
    const started = Date.now();
    assert.doesNotThrow(() => check(unit.repeat(Math.floor((60 * 1024) / unit.length))));
    assert.ok(Date.now() - started < 2000, `took ${Date.now() - started} ms`);
  });
}

// Seeded generator (mulberry32) so a failure is reproducible.
function rng(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

test("property: a read tool with options only and no operand stays quiet (500 commands)", () => {
  const rand = rng(20260522);
  const pick = (xs) => xs[Math.floor(rand() * xs.length)];
  const subset = (xs) => xs.filter(() => rand() < 0.5);
  const flags = {
    cat: ["-n", "-b", "-s", "-A", "-E", "-T"],
    head: ["-q", "-s", "-z", "-1", "--quiet"],
    tail: ["-q", "-f", "-F", "-z", "--follow"],
    grep: ["-i", "-l", "-c", "-w", "-x", "-H", "-I", "--color=never"],
    rg: ["-i", "-l", "-c", "-w", "--hidden", "--color=never"],
    ugrep: ["-i", "-l", "-c", "-w"],
    sed: ["-E", "-r", "-s", "-z", "--posix"],
  };
  for (let n = 0; n < 500; n++) {
    const tool = pick(Object.keys(flags));
    const parts = [tool, ...subset(flags[tool])];
    if ((tool === "head" || tool === "tail") && rand() < 0.5) parts.push(pick(["-n", "-c"]), String(Math.floor(rand() * 90)));
    if (["grep", "sed"].includes(tool) && rand() < 0.7) parts.push(pick(["foo", "bar1", "'x y'"]));
    const command = parts.join(" ");
    assert.equal(check(command), null, `expected quiet: ${command}`);
  }
});
