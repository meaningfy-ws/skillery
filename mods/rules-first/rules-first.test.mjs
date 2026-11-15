import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { denies, sessionBlock } from "./rules-first.mjs";

const SCRIPT = fileURLToPath(new URL("./rules-first.mjs", import.meta.url));
const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const MARKER = "[rules-first: memory write denied]";
const ROUTING = join(ROOT, "skills/rulebook/assets/routing.md");

/** A fabricated home: no vault, no global policy, a git repository `acme` to work in. */
function fabricate() {
  const home = mkdtempSync(join(tmpdir(), "rf-"));
  const repo = join(home, "acme");
  mkdirSync(join(repo, ".git"), { recursive: true });
  const memory = join(home, ".claude/projects/-w-acme/memory");
  mkdirSync(memory, { recursive: true });
  const env = {
    HOME: home,
    CLAUDE_CONFIG_DIR: join(home, ".claude"),
    XDG_CONFIG_HOME: join(home, ".config"),
    PATH: process.env.PATH,
  };
  return { home, repo, memory, env };
}

const run = (input, env, extra = {}) =>
  spawnSync(process.execPath, [SCRIPT], { input, env, encoding: "utf8", ...extra });

// ---- session block (T-1, T-5, T-6, T-7)

test("T-1 block for the worked example", () => {
  const { repo, env } = fabricate();
  const r = run(JSON.stringify({ hook_event_name: "SessionStart", cwd: repo }), env, { cwd: repo });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /^Rules \(rules-first\):\n/);
  assert.match(r.stdout, /vault: none/);
  assert.match(r.stdout, /routing policy: missing/);
  assert.doesNotMatch(r.stdout, /-- end --/);
  assert.ok(r.stdout.includes("Rules: when an activity starts, load your rules with `rulebook`."));
  assert.ok(r.stdout.includes("Interactive sessions only: a scheduled or unattended run skips this."));
});

test("T-5 python3 missing: routing text only, exit 0", () => {
  const { repo, env } = fabricate();
  const r = run(JSON.stringify({ hook_event_name: "SessionStart", cwd: repo }), {
    ...env,
    PATH: join(env.HOME, "empty"),
  }, { cwd: repo });
  // node is found by absolute path so the script runs with a PATH that lacks python3.
  assert.equal(r.status, 0);
  assert.doesNotMatch(r.stdout, /vault:/);
  assert.ok(r.stdout.includes("Rules: when an activity starts"));
});

test("T-6 routing.md missing: where lines only, exit 0", () => {
  const { repo, env, home } = fabricate();
  assert.equal(sessionBlock(repo, join(home, "no-root"), env), "");
  const root = join(home, "root");
  mkdirSync(join(root, "skills/rulebook/scripts"), { recursive: true });
  writeFileSync(join(root, "skills/rulebook/scripts/rules.py"), "print('vault: none')\nprint('-- end --')\n");
  const out = sessionBlock(repo, root, env);
  assert.match(out, /^Rules \(rules-first\):\nvault: none\n?$/);
  assert.doesNotMatch(out, /Rules: when/);
});

test("T-7 stdin not JSON: no output, exit 0", () => {
  const { env } = fabricate();
  const r = run("not json", env);
  assert.equal(r.status, 0);
  assert.equal(r.stdout, "");
  assert.equal(r.stderr, "");
});

test("routing.md exists next to the script's skill path", () => {
  assert.ok(existsSync(ROUTING));
});

// ---- the deny (T-3, T-4)

function note(type, nested = false) {
  return nested ? `---\nname: x\nmetadata:\n  type: ${type}\n---\nbody\n` : `---\nname: x\ntype: ${type}\n---\nbody\n`;
}

test("T-3 and T-4 rows of the tool-call table", () => {
  const { home, memory, env } = fabricate();
  const mem = (name) => join(memory, name);
  writeFileSync(mem("feedback_git.md"), note("feedback"));
  writeFileSync(mem("project_release.md"), note("project"));
  const rows = [
    ["Write", { file_path: mem("new_feedback.md"), content: note("feedback") }, true],
    ["Write", { file_path: mem("project_new.md"), content: note("project") }, false],
    ["Edit", { file_path: mem("MEMORY.md"), old_string: "a", new_string: "b" }, false],
    ["Write", { file_path: join(home, "acme/docs/feedback.md"), content: note("feedback") }, false],
    ["Write", { file_path: join(home, ".claude/projects/a/b/memory/x.md"), content: note("feedback") }, false],
    ["Edit", { file_path: mem("project_release.md"), old_string: "a", new_string: "type: feedback" }, true],
    ["Edit", { file_path: mem("feedback_git.md"), old_string: "body", new_string: "other" }, true],
    ["Edit", { file_path: mem("feedback_git.md"), old_string: "feedback", new_string: "type: project" }, true],
    ["Write", { file_path: mem("user_role.md"), content: note("user", true) }, true],
    ["Write", { file_path: mem("feedback_git.md"), content: note("project") }, true],
    [
      "MultiEdit",
      {
        file_path: mem("project_release.md"),
        edits: [
          { old_string: "a", new_string: "b" },
          { old_string: "c", new_string: "type: feedback" },
        ],
      },
      true,
    ],
    ["MultiEdit", { file_path: mem("project_release.md"), edits: [{ old_string: "body", new_string: "text" }] }, false],
    ["Write", { file_path: "~/.claude/projects/-w-acme/memory/tilde.md", content: note("feedback") }, true],
  ];
  for (const [tool, input, expected] of rows) {
    assert.equal(denies(tool, input, env), expected, `${tool} ${input.file_path}`);
  }
});

test("a denied write exits 2 with the marker on stderr", () => {
  const { memory, env } = fabricate();
  const input = { file_path: join(memory, "feedback_x.md"), content: note("feedback") };
  const r = run(JSON.stringify({ hook_event_name: "PreToolUse", tool_name: "Write", tool_input: input }), env);
  assert.equal(r.status, 2);
  assert.ok(r.stderr.includes(MARKER));
  assert.ok(r.stderr.includes("a preference or correction goes to the rulebook"));
  assert.equal(r.stdout, "");
});

test("an allowed write exits 0 with no output", () => {
  const { memory, env } = fabricate();
  const input = { file_path: join(memory, "project_x.md"), content: note("project") };
  const r = run(JSON.stringify({ hook_event_name: "PreToolUse", tool_name: "Write", tool_input: input }), env);
  assert.equal(r.status, 0);
  assert.equal(r.stdout + r.stderr, "");
});
