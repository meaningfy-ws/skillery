import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  agentBody,
  agentsForBundles,
  loadAgentMap,
  loadCatalogue,
  renderAgent,
} from "../tools/opencode-bundle-lib.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLI = path.join(REPO, "tools", "skillery-opencode.mjs");
const LIB = path.join(REPO, "tools", "opencode-bundle-lib.mjs");
const MAP = loadAgentMap(path.join(REPO, "tools", "opencode-agent-map.json"));

const AGENT = {
  name: "ag",
  description: "Agent",
  type: "delegated",
  model: "opus",
  color: "blue",
  tools: ["Read", "Skill"],
  disallowedTools: ["Write", "NotebookEdit"],
};

// Fixture = skills/ + agents/ + the two tools/*.json files; there is no .opencode/ in the source.
function fixture(parent) {
  const root = parent ?? fs.mkdtempSync(path.join(os.tmpdir(), "skillery-test-"));
  for (const skill of ["alpha", "beta"]) {
    fs.mkdirSync(path.join(root, "skills", skill), { recursive: true });
    fs.writeFileSync(path.join(root, "skills", skill, "SKILL.md"), `---\nname: ${skill}\ndescription: X\n---\n`);
  }
  fs.mkdirSync(path.join(root, "agents"), { recursive: true });
  fs.writeFileSync(path.join(root, "agents", "ag.md"), "---\nname: ag\ndescription: Agent\n---\n\nBody line\n");
  fs.mkdirSync(path.join(root, "tools"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "tools", "opencode-catalogue.json"),
    JSON.stringify({
      version: "9.9.9",
      bundles: [
        { name: "meaningfy-core", skills: ["alpha", "beta"], agents: ["ag"] },
        { name: "meaningfy-building", skills: ["beta"], agents: [] },
      ],
      agents: { ag: AGENT },
    }),
  );
  fs.copyFileSync(path.join(REPO, "tools", "opencode-agent-map.json"), path.join(root, "tools", "opencode-agent-map.json"));
  return root;
}

function run(root, args, cwd = root) {
  return spawnSync(process.execPath, [CLI, ...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, SKILLERY_REPOSITORY_ROOT: root },
  });
}

function readManifest(dir) {
  return JSON.parse(fs.readFileSync(path.join(dir, ".skillery-manifest.json"), "utf8"));
}

// ------------------------------------------------------------ existing behaviours
test("installs and uninstalls one bundle with --target", () => {
  const root = fixture();
  const target = path.join(root, "target");

  const installed = run(root, ["install", "meaningfy-core", "--target", target]);
  assert.equal(installed.status, 0, installed.stderr);
  assert.ok(fs.existsSync(path.join(target, "alpha", "SKILL.md")));
  assert.ok(fs.existsSync(path.join(target, "beta", "SKILL.md")));
  assert.deepEqual(readManifest(target).managedSkills, ["alpha", "beta"]);

  const uninstalled = run(root, ["uninstall", "meaningfy-core", "--target", target]);
  assert.equal(uninstalled.status, 0, uninstalled.stderr);
  assert.equal(fs.existsSync(path.join(target, "alpha")), false);
  assert.equal(fs.existsSync(path.join(target, ".skillery-manifest.json")), false);
});

test("refuses to overwrite an unmanaged skill", () => {
  const root = fixture();
  const target = path.join(root, "target");
  fs.mkdirSync(path.join(target, "alpha"), { recursive: true });
  fs.writeFileSync(path.join(target, "alpha", "SKILL.md"), "local\n");

  const result = run(root, ["install", "meaningfy-core", "--target", target]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Refusing to overwrite unmanaged skill 'alpha'/);
  assert.equal(fs.readFileSync(path.join(target, "alpha", "SKILL.md"), "utf8"), "local\n");
});

test("rejects an unknown bundle", () => {
  const root = fixture();
  const result = run(root, ["install", "not-a-bundle", "--target", path.join(root, "target")]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unknown Skillery bundle/);
});

// ------------------------------------------------------------ renderAgent
test("TC-13 renderAgent maps the model alias through the map, omits a missing model", () => {
  const { content } = renderAgent(AGENT, "\nBody\n", MAP);
  assert.match(content, /^model: "anthropic\/claude-opus-4-8"$/m);
  const { content: noModel } = renderAgent({ name: "x", description: "D", type: "delegated" }, "", MAP);
  assert.doesNotMatch(noModel, /^model:/m);
});

test("TC-14 renderAgent maps tools and permissions and records gaps", () => {
  const description = "Line one\nline two: with colon";
  const { content, gaps } = renderAgent(
    { name: "x", description, type: "delegated", tools: ["Read", "Bash", "AskUserQuestion"], disallowedTools: ["Write", "NotebookEdit"] },
    "\nBody\n",
    MAP,
  );
  assert.match(content, /^tools: \{"read":true,"bash":true\}$/m);
  assert.match(content, /^permission: \{"edit":"deny"\}$/m);
  assert.match(content, /^mode: "subagent"$/m);
  assert.ok(content.includes(`description: ${JSON.stringify(description)}\n`));
  assert.ok(content.endsWith("---\n\nBody\n"));
  assert.equal(gaps.length, 2);
  assert.ok(gaps.some((g) => g.includes("'AskUserQuestion'")));
  assert.ok(gaps.some((g) => g.includes("'NotebookEdit'")));
  const order = ["description", "mode", "tools", "permission"].map((k) => content.indexOf(`\n${k}:`));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
});

test("TC-08 a lead agent renders as an opencode primary agent with no type gap", () => {
  const { content, gaps } = renderAgent({ ...AGENT, type: "lead" }, "", MAP);
  assert.match(content, /^mode: "primary"$/m);
  assert.doesNotMatch(content, /^type:/m);
  assert.ok(!gaps.some((g) => g.includes("type")));
});

test("TC-09 a scheduled agent renders as a subagent and records the scheduler gap", () => {
  const { content, gaps } = renderAgent({ ...AGENT, type: "scheduled" }, "", MAP);
  assert.match(content, /^mode: "subagent"$/m);
  assert.ok(gaps.includes("type 'scheduled': opencode has no scheduler; run `opencode run --agent ag` from an external scheduler"));
});

test("TC-10 a missing or unknown type throws naming the agent; install writes nothing", () => {
  const { type, ...untyped } = AGENT;
  assert.throws(() => renderAgent(untyped, "", MAP), /agent 'ag': unknown or missing type 'undefined'/);
  assert.throws(() => renderAgent({ ...AGENT, type: "worker" }, "", MAP), /agent 'ag': unknown or missing type 'worker'/);
  const root = fixture();
  setCatalogue(root, [{ name: "meaningfy-core", skills: ["alpha"], agents: ["ag"] }], { ag: untyped });
  const project = fs.mkdtempSync(path.join(os.tmpdir(), "skillery-proj-"));
  const result = run(root, ["install", "meaningfy-core", "--project"], project);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /agent 'ag'/);
  assert.ok(!fs.existsSync(path.join(project, ".opencode")));
});

test("TC-11 review fixes: namespace stripped, skill tool always on, description trimmed (F-1, F-7, F-10)", () => {
  const { content } = renderAgent(
    { ...AGENT, description: "Folded scalar.\n", tools: ["Read"], skills: ["a", "superpowers:x"] },
    "\nBody\n",
    MAP,
  );
  assert.ok(content.endsWith("Load these skills first with the skill tool: `a`, `x`.\n"));
  assert.match(content, /^tools: \{"read":true,"skill":true\}$/m);
  assert.match(content, /^description: "Folded scalar."$/m);
});

test("TC-11 skills become a load-skills body line and color a theme colour", () => {
  const { content, gaps } = renderAgent({ ...AGENT, skills: ["a", "b"], color: "yellow" }, "\nBody\n", MAP);
  assert.doesNotMatch(content, /^skills:/m);
  assert.match(content, /^color: "warning"$/m);
  assert.match(content, /^tools: \{"read":true,"skill":true\}$/m);
  assert.ok(content.endsWith("Body\n\nLoad these skills first with the skill tool: `a`, `b`.\n"));
  assert.ok(!gaps.some((g) => g.includes("'Skill'")));
});

test("TC-25 the map file is the only table", () => {
  assert.doesNotMatch(fs.readFileSync(LIB, "utf8"), /claude-opus/);
  const custom = { ...MAP, modelAliases: { opus: "x/custom" } };
  assert.match(renderAgent(AGENT, "", custom).content, /^model: "x\/custom"$/m);
});

test("TC-19 every live repo agent renders", () => {
  const catalogue = loadCatalogue(path.join(REPO, "tools", "opencode-catalogue.json"));
  const stems = Object.keys(catalogue.agents);
  assert.ok(stems.length > 0);
  for (const stem of stems) {
    const body = agentBody(stem, path.join(REPO, "agents"));
    const { content } = renderAgent(catalogue.agents[stem], body, MAP);
    assert.match(content, /^---\ndescription: /);
  }
  assert.deepEqual(
    agentsForBundles(catalogue, catalogue.bundles.map((b) => b.name)),
    [...stems].sort(),
  );
});

test("agentBody splits at the second --- line", () => {
  const root = fixture();
  assert.equal(agentBody("ag", path.join(root, "agents")), "\nBody line\n");
});

test("loadCatalogue rejects a missing or malformed catalogue", () => {
  const root = fixture();
  assert.throws(() => loadCatalogue(path.join(root, "nope.json")), /Cannot read Skillery catalogue at/);
  const bad = path.join(root, "bad.json");
  fs.writeFileSync(bad, JSON.stringify({ version: "1", bundles: {} }));
  assert.throws(() => loadCatalogue(bad), /Invalid Skillery catalogue/);
});

// ------------------------------------------------------------ install flows
test("TC-15 --project installs skills and agents; uninstall removes them", () => {
  const root = fixture();
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "skillery-proj-"));
  const result = run(root, ["install", "meaningfy-core", "--project"], cwd);
  assert.equal(result.status, 0, result.stderr);
  const skills = path.join(cwd, ".opencode", "skills");
  const agentFile = path.join(cwd, ".opencode", "agents", "ag.md");
  assert.ok(fs.existsSync(path.join(skills, "alpha", "SKILL.md")));
  assert.ok(fs.existsSync(path.join(skills, "beta", "SKILL.md")));
  assert.match(fs.readFileSync(agentFile, "utf8"), /^model: "anthropic\/claude-opus-4-8"$/m);
  assert.deepEqual(readManifest(skills).managedAgents, ["ag"]);
  assert.match(result.stdout, /^gap: agent 'ag': /m);

  const status = run(root, ["status", "--project"], cwd);
  assert.match(status.stdout, /1 agent/);

  const removed = run(root, ["uninstall", "meaningfy-core", "--project"], cwd);
  assert.equal(removed.status, 0, removed.stderr);
  assert.equal(fs.existsSync(agentFile), false);
  assert.equal(fs.existsSync(path.join(skills, "alpha")), false);
});

test("TC-15 edge: --target installs skills but no agent and prints the notice", () => {
  const root = fixture();
  const target = path.join(root, "target");
  const result = run(root, ["install", "meaningfy-core", "--target", target]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /gap: agents not installed with --target \(use --global or --project\)/);
  assert.deepEqual(readManifest(target).managedAgents, []);
  assert.equal(fs.existsSync(path.join(target, "ag.md")), false);
  assert.equal(fs.existsSync(path.join(root, ".opencode")), false); // cwd: no agents dir either
});

test("TC-16 refuses to overwrite an unmanaged agent; --force overwrites", () => {
  const root = fixture();
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "skillery-proj-"));
  const agentFile = path.join(cwd, ".opencode", "agents", "ag.md");
  fs.mkdirSync(path.dirname(agentFile), { recursive: true });
  fs.writeFileSync(agentFile, "local\n");

  const refused = run(root, ["install", "meaningfy-core", "--project"], cwd);
  assert.notEqual(refused.status, 0);
  assert.match(refused.stderr, /Refusing to overwrite unmanaged agent 'ag'/);
  assert.equal(fs.readFileSync(agentFile, "utf8"), "local\n");
  assert.equal(fs.existsSync(path.join(cwd, ".opencode", "skills", "alpha")), false); // nothing written

  const forced = run(root, ["install", "meaningfy-core", "--project", "--force"], cwd);
  assert.equal(forced.status, 0, forced.stderr);
  assert.notEqual(fs.readFileSync(agentFile, "utf8"), "local\n");
});

test("TC-17 skill copy skips __pycache__ and bytecode", () => {
  const root = fixture();
  fs.mkdirSync(path.join(root, "skills", "alpha", "__pycache__"), { recursive: true });
  fs.writeFileSync(path.join(root, "skills", "alpha", "__pycache__", "m.pyc"), "x");
  fs.writeFileSync(path.join(root, "skills", "alpha", "n.pyo"), "x");
  fs.writeFileSync(path.join(root, "skills", "alpha", "keep.py"), "x");
  const target = path.join(root, "target");
  assert.equal(run(root, ["install", "meaningfy-core", "--target", target]).status, 0);
  assert.equal(fs.existsSync(path.join(target, "alpha", "__pycache__")), false);
  assert.equal(fs.existsSync(path.join(target, "alpha", "n.pyo")), false);
  assert.ok(fs.existsSync(path.join(target, "alpha", "keep.py")));
});

test("TC-18 a v2.11 manifest without managedAgents is read and upgraded", () => {
  const root = fixture();
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "skillery-proj-"));
  const skills = path.join(cwd, ".opencode", "skills");
  fs.mkdirSync(path.join(skills, "beta"), { recursive: true });
  fs.writeFileSync(
    path.join(skills, ".skillery-manifest.json"),
    JSON.stringify({
      schemaVersion: 1,
      catalogueVersion: "2.11.0",
      source: "meaningfy-ws/skillery",
      installedBundles: { "meaningfy-building": { catalogueVersion: "2.11.0", skills: ["beta"] } },
      managedSkills: ["beta"],
    }),
  );
  const result = run(root, ["install", "meaningfy-core", "--project"], cwd);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readManifest(skills).managedAgents, ["ag"]);
});

test("TC-20 plugin infers a bundle from the git dependency alias", () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), "skillery-plugin-test-"));
  const root = path.join(parent, "meaningfy-core");
  fs.mkdirSync(root);
  fixture(root);
  fs.writeFileSync(
    path.join(root, "tools", "opencode-catalogue.json"),
    JSON.stringify({
      version: "9.9.9",
      bundles: [
        { name: "meaningfy-core", skills: ["alpha"], agents: [] },
        { name: "meaningfy-building", skills: ["beta"], agents: [] },
      ],
      agents: {},
    }),
  );

  const plugin = path.join(REPO, "tools", "opencode-plugin.mjs");
  const script = `
    const { default: load } = await import(${JSON.stringify(`file://${plugin}`)});
    const hooks = await load({}, {});
    const config = {};
    await hooks.config(config);
    process.stdout.write(JSON.stringify(config));
  `;
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", script], {
    encoding: "utf8",
    env: { ...process.env, SKILLERY_REPOSITORY_ROOT: root },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout).skills.paths, [path.join(root, "skills", "alpha")]);
});

test("TC-21 report prints parity and gap rows and writes nothing", () => {
  const root = fixture();
  const before = fs.readdirSync(root).sort();
  const result = run(root, ["report"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /\| `agent:ag` \| ✓ \| ✓ \| 1 \|/);
  assert.match(result.stdout, /\| `skill:alpha` \| ✓ \| ✓ \| 0 \|/);
  // `Skill` maps to opencode `skill` (agent-authoring-standard D-15); NotebookEdit stays a gap.
  assert.match(result.stdout, /\| `agents\/ag\.md` \| opencode \| disallowedTools 'NotebookEdit' has no opencode permission analogue \|/);
  assert.deepEqual(fs.readdirSync(root).sort(), before);
});

// ------------------------------------------------------------ review-implementation fixes
function setCatalogue(root, bundles, agents = { ag: AGENT }) {
  fs.writeFileSync(
    path.join(root, "tools", "opencode-catalogue.json"),
    JSON.stringify({ version: "9.9.9", bundles, agents }),
  );
}

test("finding 1: a path-like name in the install manifest is rejected before any rm", () => {
  const root = fixture();
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), "skillery-escape-"));
  const target = path.join(parent, "target");
  const victim = path.join(parent, "victim");
  fs.mkdirSync(victim);
  fs.writeFileSync(path.join(victim, "keep.txt"), "x");
  fs.mkdirSync(target);
  fs.writeFileSync(
    path.join(target, ".skillery-manifest.json"),
    JSON.stringify({
      schemaVersion: 1,
      installedBundles: { "meaningfy-core": { skills: ["../victim"] } },
      managedSkills: ["../victim"],
      managedAgents: [],
    }),
  );
  const result = run(root, ["uninstall", "meaningfy-core", "--target", target]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Invalid name '\.\.\/victim'/);
  assert.ok(fs.existsSync(path.join(victim, "keep.txt")));
});

test("finding 1: a path-like name in the catalogue is rejected", () => {
  const root = fixture();
  setCatalogue(root, [{ name: "meaningfy-core", skills: ["../../x"], agents: [] }]);
  const result = run(root, ["install", "meaningfy-core", "--target", path.join(root, "target")]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Invalid name '\.\.\/\.\.\/x'/);
});

test("finding 2: uninstall --target on a --project install keeps managedAgents consistent", () => {
  const root = fixture();
  setCatalogue(root, [
    { name: "meaningfy-core", skills: ["alpha"], agents: [] },
    { name: "meaningfy-building", skills: ["beta"], agents: ["ag"] },
  ]);
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "skillery-proj-"));
  assert.equal(run(root, ["install", "meaningfy-core", "meaningfy-building", "--project"], cwd).status, 0);
  const skills = path.join(cwd, ".opencode", "skills");
  const removed = run(root, ["uninstall", "meaningfy-core", "--target", skills], cwd);
  assert.equal(removed.status, 0, removed.stderr);
  assert.doesNotMatch(removed.stdout, /remove agent/);
  assert.deepEqual(readManifest(skills).managedAgents, ["ag"]);
  assert.ok(fs.existsSync(path.join(cwd, ".opencode", "agents", "ag.md")));
  const again = run(root, ["install", "meaningfy-building", "--project"], cwd);
  assert.equal(again.status, 0, again.stderr); // still managed, so no refusal
});

test("finding 3: reinstall prunes managed skills and agents dropped from the bundle, never user files", () => {
  const root = fixture();
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "skillery-proj-"));
  assert.equal(run(root, ["install", "meaningfy-core", "--project"], cwd).status, 0);
  const skills = path.join(cwd, ".opencode", "skills");
  const agents = path.join(cwd, ".opencode", "agents");
  fs.mkdirSync(path.join(skills, "my-skill"));
  fs.writeFileSync(path.join(agents, "my-agent.md"), "mine\n");

  setCatalogue(root, [{ name: "meaningfy-core", skills: ["alpha"], agents: [] }], {});
  const result = run(root, ["install", "meaningfy-core", "--project"], cwd);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(path.join(skills, "beta")), false);
  assert.equal(fs.existsSync(path.join(agents, "ag.md")), false);
  assert.ok(fs.existsSync(path.join(skills, "alpha")));
  assert.ok(fs.existsSync(path.join(skills, "my-skill")));
  assert.ok(fs.existsSync(path.join(agents, "my-agent.md")));
  const manifest = readManifest(skills);
  assert.deepEqual(manifest.managedSkills, ["alpha"]);
  assert.deepEqual(manifest.managedAgents, []);
});
