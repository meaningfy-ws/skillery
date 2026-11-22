import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { check, ODOO, SEND, SIGN, REGISTER } from "./lawyer-refusals.mjs";

const SCRIPT = fileURLToPath(new URL("./lawyer-refusals.mjs", import.meta.url));

const bash = (command, agent_type = "lawyer") => ({ agent_type, tool_name: "Bash", tool_input: { command } });

// One denied family per row (issue #186): the lawyer never sends, signs or registers a contract
// without the owner confirming that one action, and never reaches Odoo. Fabricated commands only.
const DENIED = [
  ["send: make target", "make send", SEND],
  ["send: make target with a suffix", "make send-contract CONTRACT=example-freelancer", SEND],
  ["send: script", "./scripts/send_contract.sh example.pdf", SEND],
  ["send: through bash", "bash scripts/send.sh example.pdf", SEND],
  ["send: behind cd and &&", "cd legal && make send", SEND],
  ["send: through bash -c", "bash -c 'make send'", SEND],
  ["send: -C option before the target", "make -C contracts send", SEND],
  ["sign: make target", "make sign", SIGN],
  ["sign: make target with a variable", "make sign CONTRACT=example", SIGN],
  ["sign: script behind sudo", "sudo ./sign-contract example.pdf", SIGN],
  ["register: make target", "make register", REGISTER],
  ["register: python script", "python3 tools/register_contract.py example", REGISTER],
  ["register: uv run script", "uv run scripts/register.py example", REGISTER],
  ["odoo: the CLI", "odoo shell -d prod", ODOO],
  ["odoo: odoo-bin", "./odoo-bin -d prod --stop-after-init", ODOO],
  ["odoo: python -m odoo", "python3 -m odoo shell", ODOO],
  ["odoo: a client script", "python odoo_client.py deals", ODOO],
  ["odoo: behind env and a pipe", "FOO=1 odoo shell | head", ODOO],
];
const ALLOWED = [
  "git status",
  "make snapshot",
  "make lint",
  "git commit -m \"note: do not send or sign; odoo is the owner's\"",
  "grep -n 'make send' AGENTS.md",
  "cat docs/signing.md",
  "ls scripts",
  "gh pr create --title 'draft contract' --body 'sign later'",
];

for (const [name, command, message] of DENIED) {
  test(`denies ${name}`, () => assert.equal(check(bash(command)), message));
}
for (const command of ALLOWED) {
  test(`allows: ${JSON.stringify(command)}`, () => assert.equal(check(bash(command)), null));
}

test("denies an Odoo MCP tool call", () => {
  assert.equal(check({ agent_type: "lawyer", tool_name: "mcp__odoo__search_read", tool_input: {} }), ODOO);
});

test("the messages tell the lawyer what to ask the owner", () => {
  for (const m of [SEND, SIGN, REGISTER]) assert.match(m, /ask the owner to confirm/i);
  assert.match(ODOO, /ask the owner for the values/i);
});

test("the plugin-qualified agent type is the lawyer too", () => {
  assert.equal(check(bash("make send", "meaningfy-legal:lawyer")), SEND);
});

test("scope: another agent is not checked", () => {
  assert.equal(check(bash("make send", "implementer")), null);
  assert.equal(check(bash("odoo shell", "devops-engineer")), null);
  assert.equal(check({ agent_type: "implementer", tool_name: "mcp__odoo__search_read", tool_input: {} }), null);
});

test("scope: a session with no agent type is not checked", () => {
  assert.equal(check({ tool_name: "Bash", tool_input: { command: "make send" } }), null);
});

test("an unrelated tool passes", () => {
  assert.equal(check({ agent_type: "lawyer", tool_name: "Read", tool_input: { file_path: "a.md" } }), null);
});

const run = (input) => spawnSync(process.execPath, [SCRIPT], { input, encoding: "utf8" });

test("CLI: deny exits 2 with the message on stderr", () => {
  const r = run(JSON.stringify(bash("make sign")));
  assert.equal(r.status, 2);
  assert.equal(r.stderr.trim(), SIGN);
});

test("CLI: Odoo MCP deny exits 2", () => {
  const r = run(JSON.stringify({ agent_type: "lawyer", tool_name: "mcp__odoo__create", tool_input: {} }));
  assert.equal(r.status, 2);
  assert.equal(r.stderr.trim(), ODOO);
});

test("CLI: allow exits 0", () => assert.equal(run(JSON.stringify(bash("git status"))).status, 0));

test("CLI: malformed input fails open", () => assert.equal(run("not json").status, 0));

// Bypasses found by the security review of PR #186: quotes glued to a word, wrappers with options,
// eval, and an Odoo MCP server installed through a plugin.
const BYPASSES = [
  ["quotes inside the command name", 'ma""ke send', SEND],
  ["quoted name glued to a suffix", "'odoo'-bin -d prod", ODOO],
  ["timeout with a duration", "timeout 30 make sign", SIGN],
  ["timeout with an option", "timeout -k 5 10 ./register.sh", REGISTER],
  ["stdbuf with options", "stdbuf -oL make send", SEND],
  ["eval of a quoted command", 'eval "odoo shell -d prod"', ODOO],
];
for (const [name, command, message] of BYPASSES) {
  test(`bypass closed: ${name}`, () => assert.equal(check(bash(command)), message));
}

test("an Odoo MCP server behind a plugin prefix is denied", () => {
  for (const tool_name of ["mcp__plugin_odoo_odoo__create", "mcp__Odoo__read", "mcp__odoo-prod__search"]) {
    assert.equal(check({ agent_type: "lawyer", tool_name, tool_input: {} }), ODOO, tool_name);
  }
  assert.equal(check({ agent_type: "lawyer", tool_name: "mcp__overleaf__read_file", tool_input: {} }), null);
});

test("a standalone quoted string is still text, not a command", () => {
  for (const command of ['git commit -m "sign the NDA later"', "grep -rn 'make send' docs"]) {
    assert.equal(check(bash(command)), null, command);
  }
});
