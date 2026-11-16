import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { denies, loadDeny, sessionBlock, shouldDeny } from "./rules-first.mjs";

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

const DENY = loadDeny();

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
    ["Edit", { file_path: mem("project_release.md"), old_string: "name: x", new_string: "type: feedback" }, true],
    ["Edit", { file_path: mem("feedback_git.md"), old_string: "body", new_string: "other" }, true],
    ["Edit", { file_path: mem("feedback_git.md"), old_string: "feedback", new_string: "type: project" }, true],
    ["Write", { file_path: mem("user_role.md"), content: note("user", true) }, true],
    ["Write", { file_path: mem("feedback_git.md"), content: note("project") }, true],
    [
      "MultiEdit",
      {
        file_path: mem("project_release.md"),
        edits: [
          { old_string: "body", new_string: "b" },
          { old_string: "name: x", new_string: "type: feedback" },
        ],
      },
      true,
    ],
    ["MultiEdit", { file_path: mem("project_release.md"), edits: [{ old_string: "body", new_string: "text" }] }, false],
    ["Write", { file_path: "~/.claude/projects/-w-acme/memory/tilde.md", content: note("feedback") }, true],
  ];
  for (const [tool, input, expected] of rows) {
    assert.equal(shouldDeny(tool, input, env, DENY), expected, `${tool} ${input.file_path}`);
  }
});

test("a denied write exits 2 with the marker on stderr", () => {
  const { memory, env } = fabricate();
  const input = { file_path: join(memory, "feedback_x.md"), content: note("feedback") };
  const r = run(JSON.stringify({ hook_event_name: "PreToolUse", tool_name: "Write", tool_input: input }), env);
  assert.equal(r.status, 2);
  assert.ok(r.stderr.includes(MARKER));
  assert.ok(r.stderr.includes("rule-learner") && r.stderr.includes("approval card"));
  assert.equal(r.stdout, "");
});

test("an allowed write exits 0 with no output", () => {
  const { memory, env } = fabricate();
  const input = { file_path: join(memory, "project_x.md"), content: note("project") };
  const r = run(JSON.stringify({ hook_event_name: "PreToolUse", tool_name: "Write", tool_input: input }), env);
  assert.equal(r.status, 0);
  assert.equal(r.stdout + r.stderr, "");
});

// ---- the type match, the path match and the pure decision (#272)

test("the deny data lives in the rulebook asset and the message carries the marker", () => {
  assert.deepEqual([...DENY.types].sort(), ["feedback", "user"]);
  for (const word of ["rule-learner", "approval card", MARKER]) assert.ok(DENY.message.includes(word), word);
  assert.equal(loadDeny(join(tmpdir(), "no-such-root")), null);
});

test("type rows: every type counts, whole token, any case, block scalar", () => {
  const { memory, env } = fabricate();
  const p = join(memory, "project_x.md");
  writeFileSync(p, note("project"));
  const write = (content) => shouldDeny("Write", { file_path: join(memory, "n.md"), content }, env, DENY);
  const edit = (new_string) => shouldDeny("Edit", { file_path: p, old_string: "name: x", new_string }, env, DENY);
  assert.equal(write("---\nmeta:\n  type: project\ntype: feedback\n---\nb\n"), true);
  assert.equal(write("---\ntype: Feedback\n---\nb\n"), true);
  assert.equal(write("---\ntype: |\n  feedback\n---\nb\n"), true);
  assert.equal(write("---\ntype: >-\n  user\n---\nb\n"), true);
  assert.equal(write("---\ntype: user-facing docs\n---\nb\n"), false);
  assert.equal(edit("type: user-facing docs are next"), false);
  assert.equal(edit("type: USER"), true);
});

test("pure decision: no I/O, unknown tool still counts the disk type, edits not an array", () => {
  const types = DENY.types;
  assert.equal(denies("Write", { content: note("feedback") }, null, types), true);
  assert.equal(denies("Write", { content: note("project") }, note("feedback"), types), true);
  assert.equal(denies("Other", {}, note("feedback"), types), true);
  assert.equal(denies("Other", {}, note("project"), types), false);
  assert.equal(denies("MultiEdit", { edits: "nope" }, note("project"), types), false);
});

test("path rows: symlinked config root, upper-case extension, deeper folder, new file", () => {
  const { home, env } = fabricate();
  const real = join(home, "real-claude");
  mkdirSync(join(real, "projects/-w-acme/memory/sub"), { recursive: true });
  const link = join(home, "link-claude");
  symlinkSync(real, link);
  const content = note("feedback");
  const via = { ...env, CLAUDE_CONFIG_DIR: link };
  const into = (root, rel) => ({ file_path: join(root, rel), content });
  assert.equal(shouldDeny("Write", into(real, "projects/-w-acme/memory/a.md"), via, DENY), true);
  assert.equal(shouldDeny("Write", into(link, "projects/-w-acme/memory/a.md"), via, DENY), true);
  assert.equal(shouldDeny("Write", into(link, "projects/-w-acme/memory/a.md"), { ...env, CLAUDE_CONFIG_DIR: real }, DENY), true);
  assert.equal(shouldDeny("Write", into(real, "projects/-w-acme/memory/a.MD"), via, DENY), true);
  assert.equal(shouldDeny("Write", into(real, "projects/-w-acme/memory/sub/a.md"), via, DENY), true);
  assert.equal(shouldDeny("Write", into(real, "projects/-w-acme/memory/new/deeper/a.md"), via, DENY), true);
  assert.equal(shouldDeny("Write", into(real, "projects/-w-acme/other/a.md"), via, DENY), false);
});

test("asset unreadable: fail open, no deny, exit 0", () => {
  const { memory, env } = fabricate();
  assert.equal(shouldDeny("Write", { file_path: join(memory, "f.md"), content: note("feedback") }, env, null), false);
  const root = join(env.HOME, "root");
  mkdirSync(join(root, "mods/rules-first"), { recursive: true });
  const script = join(root, "mods/rules-first/rules-first.mjs");
  writeFileSync(script, readFileSync(SCRIPT, "utf8"));
  const input = { file_path: join(memory, "f.md"), content: note("feedback") };
  const r = spawnSync(process.execPath, [script], {
    input: JSON.stringify({ hook_event_name: "PreToolUse", tool_name: "Write", tool_input: input }),
    env,
    encoding: "utf8",
  });
  assert.equal(r.status, 0);
  assert.equal(r.stderr, "");
});

// ---- the fix pass: value-only edits, symlinked folders, case, comment cost, asset case, YAML forms

test("value-only Edit and MultiEdit: the edit is applied to the disk text", () => {
  const { memory, env } = fabricate();
  const p = join(memory, "project_v.md");
  writeFileSync(p, note("project"));
  const edit = (old_string, new_string, extra = {}) =>
    shouldDeny("Edit", { file_path: p, old_string, new_string, ...extra }, env, DENY);
  assert.equal(edit("project", "feedback"), true);
  assert.equal(edit("project", "feedback", { replace_all: true }), true);
  assert.equal(
    shouldDeny("MultiEdit", { file_path: p, edits: [{ old_string: "proj", new_string: "feedb" }, { old_string: "ect", new_string: "ack" }] }, env, DENY),
    true,
  );
  assert.equal(shouldDeny("MultiEdit", { file_path: p, edits: [{ old_string: "project", new_string: "feedback" }] }, env, DENY), true);
  assert.equal(edit("x", "y"), false);
  assert.equal(edit("project", "project"), false);
});

test("a symlinked memory folder pointing outside the config root is still denied", () => {
  const { home, env } = fabricate();
  const outside = mkdtempSync(join(tmpdir(), "rf-out-"));
  mkdirSync(join(home, ".claude/projects/-w-link"), { recursive: true });
  symlinkSync(outside, join(home, ".claude/projects/-w-link/memory"));
  const input = { file_path: join(home, ".claude/projects/-w-link/memory/a.md"), content: note("feedback") };
  assert.equal(shouldDeny("Write", input, env, DENY), true);
});

test("case-insensitive file systems: the prefix matches without case on darwin and win32 only", () => {
  const { home, env } = fabricate();
  const input = { file_path: join(home, ".CLAUDE/projects/-w-acme/memory/a.md"), content: note("feedback") };
  assert.equal(shouldDeny("Write", input, env, DENY, "darwin"), true);
  assert.equal(shouldDeny("Write", input, env, DENY, "win32"), true);
  assert.equal(shouldDeny("Write", input, env, DENY, "linux"), false);
});

test("a long run of spaces after the comment mark costs little", () => {
  const content = `---\ntype: a${" ".repeat(30000)}x\n---\nb\n`;
  const t0 = performance.now();
  denies("Write", { content }, null, DENY.types);
  assert.ok(performance.now() - t0 < 50, "too slow");
});

test("the asset's type names are lower-cased when loaded", () => {
  const root = mkdtempSync(join(tmpdir(), "rf-asset-"));
  mkdirSync(join(root, "skills/rulebook/assets"), { recursive: true });
  writeFileSync(join(root, "skills/rulebook/assets/memory-deny.json"), JSON.stringify({ types: ["Feedback"], message: "m" }));
  const deny = loadDeny(root);
  assert.equal(denies("Write", { content: note("feedback") }, null, deny.types), true);
});

test("YAML forms: quoted key, tag, empty value, block scalar with indentation indicator", () => {
  const forms = [
    '"type": feedback',
    "'type' : feedback",
    "type : feedback",
    "type: !!str feedback",
    "type:\n  feedback",
    "type: |2\n  feedback",
    "type: >-1\n  feedback",
    "type: |+2\n  feedback",
  ];
  for (const f of forms) assert.equal(denies("Write", { content: `---\n${f}\n---\nb\n` }, null, DENY.types), true, f);
  assert.equal(denies("Write", { content: "---\ntype:\nname: project\n---\nb\n" }, null, DENY.types), false);
  assert.equal(denies("Write", { content: "---\ntype: !!str project\n---\nb\n" }, null, DENY.types), false);
});

// ---- the block with everything set (#272)

test("everything set: vault, repository rules and the routing policy present", () => {
  const { home, repo, env } = fabricate();
  const vault = join(home, "vault");
  mkdirSync(join(vault, "08 How to"), { recursive: true });
  mkdirSync(join(repo, "docs/rules"), { recursive: true });
  const sentence = readFileSync(ROUTING, "utf8").split("\n")[2];
  writeFileSync(join(home, ".claude/CLAUDE.md"), `# mine\n${sentence}\n`);
  const r = run(JSON.stringify({ hook_event_name: "SessionStart", cwd: repo }), { ...env, MEANINGFY_VAULT: vault }, { cwd: repo });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /routing policy: present/);
  assert.ok(r.stdout.includes(`vault: ${vault}`));
  assert.match(r.stdout, /docs\/rules\/ present/);
});

// ---- the final fix pass: Windows paths, YAML tags, padding, scale, CR line ends, edit on a missing note

test("Windows paths: backslashes and drive letters are compared as written by node:path on win32", () => {
  const env = { HOME: "C:\\Users\\u", CLAUDE_CONFIG_DIR: "C:\\Users\\u\\.claude" };
  const content = note("feedback");
  const at = (file_path) => shouldDeny("Write", { file_path, content }, env, DENY, "win32");
  assert.equal(at("C:\\Users\\u\\.claude\\projects\\-w-acme\\memory\\a.md"), true);
  assert.equal(at("c:\\users\\U\\.CLAUDE\\projects\\-w-acme\\memory\\sub\\a.md"), true);
  assert.equal(at("C:/Users/u/.claude/projects/-w-acme/memory/a.md"), true);
  assert.equal(at("C:\\Users\\u\\.claude\\projects\\-w-acme\\other\\a.md"), false);
  assert.equal(at("D:\\Users\\u\\.claude\\projects\\-w-acme\\memory\\a.md"), false);
});

test("YAML tags and anchors before a value are dropped", () => {
  for (const v of ["! feedback", "!<tag:yaml.org,2002:str> feedback", "&a feedback", "!!str feedback", "&a !!str feedback", "!!str |\n  feedback"]) {
    assert.equal(denies("Write", { content: `---\ntype: ${v}\n---\nb\n` }, null, DENY.types), true, v);
  }
  assert.equal(denies("Write", { content: "---\ntype: &a project\n---\nb\n" }, null, DENY.types), false);
});

test("padding before or after the colon does not hide the type", () => {
  const pad = " ".repeat(1000);
  for (const l of [`type:${pad}feedback`, `type${pad}: feedback`, `${pad}type: feedback`, `type:\t${pad}\tfeedback`]) {
    assert.equal(denies("Write", { content: `---\n${l}\n---\nb\n` }, null, DENY.types), true, l.slice(0, 20));
  }
  const t0 = performance.now();
  denies("Write", { content: `---\ntype:${" ".repeat(2_000_000)}x\n---\nb\n` }, null, DENY.types);
  assert.ok(performance.now() - t0 < 500, "too slow");
});

test("scale: 60k empty type lines are scanned fast, 300k type values do not throw", () => {
  const t0 = performance.now();
  assert.equal(denies("Write", { content: `---\n${"type:\n".repeat(60000)}---\nb\n` }, null, DENY.types), false);
  assert.ok(performance.now() - t0 < 500, "too slow");
  assert.equal(denies("Write", { content: `---\n${"type: project\n".repeat(300000)}type: user\n---\nb\n` }, null, DENY.types), true);
  assert.equal(denies("Write", { content: `---\n${"type: project\n".repeat(300000)}---\nb\n` }, note("project"), DENY.types), false);
});

test("CR-only, CR CR LF and Unicode line separators end a line", () => {
  for (const nl of ["\r", "\r\r\n", "\u2028", "\u2029"]) {
    assert.equal(denies("Write", { content: `---${nl}type: feedback${nl}---${nl}b${nl}` }, null, DENY.types), true, JSON.stringify(nl));
    assert.equal(denies("Write", { content: `---${nl}name: x${nl}type: project${nl}---${nl}b${nl}` }, null, DENY.types), false, JSON.stringify(nl));
  }
});

test("new_string alone counts only when the disk text cannot be read", () => {
  const { memory, env } = fabricate();
  const p = join(memory, "ref.md");
  writeFileSync(p, note("reference") + "body\n");
  const into = (file_path, new_string) => shouldDeny("Edit", { file_path, old_string: "body", new_string }, env, DENY);
  assert.equal(into(p, "body\n  type: user"), false);
  assert.equal(into(join(memory, "missing.md"), "---\ntype: feedback\n---\n"), true);
  assert.equal(
    shouldDeny("MultiEdit", { file_path: p, edits: [{ old_string: "body", new_string: "body\n  type: user" }] }, env, DENY),
    false,
  );
  assert.equal(
    shouldDeny("MultiEdit", { file_path: join(memory, "missing.md"), edits: [{ old_string: "a", new_string: "type: user" }] }, env, DENY),
    true,
  );
});
