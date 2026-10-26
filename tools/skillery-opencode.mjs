#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { parseArgs } from "node:util";
import {
  agentBody,
  agentsForBundles,
  assertSafeNames,
  loadAgentMap,
  loadCatalogue,
  renderAgent,
  SKILLS_ROOT,
  skillDirectories,
  skillsForBundles,
  validateBundles,
} from "./opencode-bundle-lib.mjs";

const MANIFEST_NAME = ".skillery-manifest.json";
const TARGET_AGENT_GAP = "gap: agents not installed with --target (use --global or --project)";

function usage() {
  return `Usage:
  skillery-opencode list
  skillery-opencode install <bundle> [<bundle> ...] [--global | --project | --target <dir>] [--force] [--dry-run]
  skillery-opencode uninstall <bundle> [<bundle> ...] [--global | --project | --target <dir>] [--dry-run]
  skillery-opencode status [--global | --project | --target <dir>]
  skillery-opencode report

Targets:
  --global       skills in ~/.config/opencode/skills, agents in ~/.config/opencode/agents (default)
  --project      skills in <cwd>/.opencode/skills, agents in <cwd>/.opencode/agents
  --target DIR   skills in DIR; agents are not installed

report prints the parity and gap tables for every skill and agent (nothing is written).

Examples:
  skillery-opencode install meaningfy-core --global
  skillery-opencode install meaningfy-core meaningfy-building --project
  skillery-opencode uninstall meaningfy-core --global
`;
}

function parseCli(argv) {
  const parsed = parseArgs({
    args: argv,
    allowPositionals: true,
    strict: true,
    options: {
      global: { type: "boolean", default: false },
      project: { type: "boolean", default: false },
      target: { type: "string" },
      force: { type: "boolean", default: false },
      "dry-run": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false },
    },
  });

  const [command, ...bundles] = parsed.positionals;
  return { command, bundles, ...parsed.values, dryRun: parsed.values["dry-run"] };
}

// { skills, agents }: agents is null for --target (D7: never guess where opencode agents belong).
function targetRoots(options) {
  const selected = [options.global, options.project, Boolean(options.target)].filter(Boolean).length;
  if (selected > 1) throw new Error("Choose only one of --global, --project, or --target");
  if (options.target) return { skills: path.resolve(options.target), agents: null };
  const base = options.project ? path.join(process.cwd(), ".opencode") : path.join(os.homedir(), ".config", "opencode");
  return { skills: path.join(base, "skills"), agents: path.join(base, "agents") };
}

function manifestPath(target) {
  return path.join(target, MANIFEST_NAME);
}

function emptyInstallManifest(catalogue) {
  return {
    schemaVersion: 1,
    catalogueVersion: catalogue.version,
    source: "meaningfy-ws/skillery",
    installedBundles: {},
    managedSkills: [],
    managedAgents: [],
  };
}

function readInstallManifest(target, catalogue) {
  const filename = manifestPath(target);
  if (!fs.existsSync(filename)) return emptyInstallManifest(catalogue);
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filename, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read ${filename}: ${error.message}`);
  }
  if (parsed.schemaVersion !== 1 || !parsed.installedBundles || !Array.isArray(parsed.managedSkills)) {
    throw new Error(`Unsupported or invalid Skillery installation manifest: ${filename}`);
  }
  if (!Array.isArray(parsed.managedAgents)) parsed.managedAgents = []; // a v2.11 manifest has none
  // The manifest is user-local and hand-editable; its names feed rmSync, so check them first.
  assertSafeNames([...Object.keys(parsed.installedBundles), ...parsed.managedSkills, ...parsed.managedAgents], filename);
  return parsed;
}

function writeFileAtomic(filename, text) {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  const temporary = `${filename}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, text, "utf8");
  try {
    fs.renameSync(temporary, filename);
  } catch (error) {
    if (!fs.existsSync(filename)) throw error;
    fs.rmSync(filename, { force: true });
    fs.renameSync(temporary, filename);
  }
}

function writeJsonAtomic(filename, value) {
  writeFileAtomic(filename, `${JSON.stringify(value, null, 2)}\n`);
}

const notBytecode = (source) => {
  const name = path.basename(source);
  return name !== "__pycache__" && !name.endsWith(".pyc") && !name.endsWith(".pyo");
};

function copyDirectoryAtomic(source, destination) {
  const parent = path.dirname(destination);
  fs.mkdirSync(parent, { recursive: true });
  const temporary = path.join(parent, `.skillery-${path.basename(destination)}-${process.pid}-${Date.now()}`);
  fs.rmSync(temporary, { recursive: true, force: true });
  fs.cpSync(source, temporary, { recursive: true, force: true, filter: notBytecode });
  fs.rmSync(destination, { recursive: true, force: true });
  fs.renameSync(temporary, destination);
}

function installedNames(catalogue, installedBundles) {
  return Object.keys(installedBundles).filter((name) => catalogue.bundles.some((entry) => entry.name === name));
}

function renderBundleAgents(catalogue, stems) {
  const map = loadAgentMap();
  return stems.map((stem) => {
    const frontmatter = catalogue.agents[stem];
    if (!frontmatter) throw new Error(`Catalogue lists agent '${stem}' without its frontmatter`);
    return { name: stem, ...renderAgent(frontmatter, agentBody(stem), map) };
  });
}

function commandList(catalogue) {
  for (const entry of [...catalogue.bundles].sort((a, b) => a.name.localeCompare(b.name))) {
    console.log(`${entry.name} (${entry.skills.length} skills, ${entry.agents.length} agents)`);
    for (const skill of entry.skills) console.log(`  - ${skill}`);
    for (const agent of entry.agents) console.log(`  - agent: ${agent}`);
  }
}

function commandStatus(catalogue, options) {
  const roots = targetRoots(options);
  const manifest = readInstallManifest(roots.skills, catalogue);
  console.log(`Target: ${roots.skills}`);
  if (roots.agents) console.log(`Agents: ${roots.agents}`);
  console.log(`Catalogue: ${catalogue.version}`);
  const bundles = Object.keys(manifest.installedBundles).sort();
  if (bundles.length === 0) {
    console.log("Installed bundles: none");
    return;
  }
  console.log("Installed bundles:");
  for (const bundle of bundles) {
    const installed = manifest.installedBundles[bundle];
    console.log(`  - ${bundle} (${installed.catalogueVersion})`);
  }
  console.log(`Managed: ${manifest.managedSkills.length} skills, ${manifest.managedAgents.length} agent(s)`);
}

function refuseUnmanaged(kind, name, destination, managed, force) {
  if (fs.existsSync(destination) && !managed.has(name) && !force) {
    throw new Error(
      `Refusing to overwrite unmanaged ${kind} '${name}' at ${destination}. ` +
        "Move it, remove it, or rerun with --force.",
    );
  }
}

function commandInstall(catalogue, requested, options) {
  const bundles = validateBundles(catalogue, requested);
  if (bundles.length === 0) throw new Error("Specify at least one bundle to install");
  const roots = targetRoots(options);
  const manifest = readInstallManifest(roots.skills, catalogue);
  const skills = skillDirectories(catalogue, bundles, SKILLS_ROOT);
  const stems = agentsForBundles(catalogue, bundles);
  const agents = roots.agents ? renderBundleAgents(catalogue, stems) : [];

  // Every destination is checked before anything is written.
  const managedSkills = new Set(manifest.managedSkills);
  const managedAgents = new Set(manifest.managedAgents);
  for (const skill of skills) {
    refuseUnmanaged("skill", skill.name, path.join(roots.skills, skill.name), managedSkills, options.force);
  }
  for (const agent of agents) {
    refuseUnmanaged("agent", agent.name, path.join(roots.agents, `${agent.name}.md`), managedAgents, options.force);
  }

  console.log(`${options.dryRun ? "Would install" : "Installing"} ${bundles.join(", ")} into ${roots.skills}`);
  for (const skill of skills) {
    console.log(`  ${options.dryRun ? "would copy" : "copy"} ${skill.name}`);
    if (!options.dryRun) copyDirectoryAtomic(skill.directory, path.join(roots.skills, skill.name));
  }
  for (const agent of agents) {
    const destination = path.join(roots.agents, `${agent.name}.md`);
    console.log(`  ${options.dryRun ? "would write" : "write"} agent ${agent.name} -> ${destination}`);
    if (!options.dryRun) writeFileAtomic(destination, agent.content);
  }
  for (const agent of agents) for (const gap of agent.gaps) console.log(`gap: agent '${agent.name}': ${gap}`);
  if (!roots.agents && stems.length > 0) console.log(TARGET_AGENT_GAP);

  if (options.dryRun) return;
  for (const bundle of bundles) {
    const entry = catalogue.bundles.find((candidate) => candidate.name === bundle);
    manifest.installedBundles[bundle] = {
      catalogueVersion: catalogue.version,
      skills: [...entry.skills],
      agents: roots.agents ? [...entry.agents] : [],
    };
  }
  const names = installedNames(catalogue, manifest.installedBundles);
  const nowSkills = skillsForBundles(catalogue, names);
  // Without an agents root (--target) the agents this manifest manages are left as they are.
  const nowAgents = roots.agents ? agentsForBundles(catalogue, names) : manifest.managedAgents;
  // Upgrade: remove what this manifest managed but the catalogue no longer puts in an installed bundle.
  for (const skill of manifest.managedSkills.filter((name) => !nowSkills.includes(name))) {
    console.log(`  remove ${skill} (no longer in the installed bundles)`);
    fs.rmSync(path.join(roots.skills, skill), { recursive: true, force: true });
  }
  if (roots.agents) {
    for (const agent of manifest.managedAgents.filter((name) => !nowAgents.includes(name))) {
      console.log(`  remove agent ${agent} (no longer in the installed bundles)`);
      fs.rmSync(path.join(roots.agents, `${agent}.md`), { force: true });
    }
  }
  manifest.catalogueVersion = catalogue.version;
  manifest.managedSkills = nowSkills;
  manifest.managedAgents = nowAgents;
  writeJsonAtomic(manifestPath(roots.skills), manifest); // last, so an interrupted run converges
  console.log("Restart OpenCode so it refreshes skill and agent discovery.");
}

function commandUninstall(catalogue, requested, options) {
  const bundles = validateBundles(catalogue, requested);
  if (bundles.length === 0) throw new Error("Specify at least one bundle to uninstall");
  const roots = targetRoots(options);
  const manifest = readInstallManifest(roots.skills, catalogue);
  for (const bundle of bundles) delete manifest.installedBundles[bundle];
  const names = installedNames(catalogue, manifest.installedBundles);
  const stillSkills = new Set(skillsForBundles(catalogue, names));
  // Without an agents root (--target) this run removes no agent, so it keeps every managed one.
  const stillAgents = new Set(roots.agents ? agentsForBundles(catalogue, names) : manifest.managedAgents);
  const removableSkills = manifest.managedSkills.filter((skill) => !stillSkills.has(skill)).sort();
  const removableAgents = manifest.managedAgents.filter((agent) => !stillAgents.has(agent)).sort();

  console.log(`${options.dryRun ? "Would uninstall" : "Uninstalling"} ${bundles.join(", ")} from ${roots.skills}`);
  for (const skill of removableSkills) {
    console.log(`  ${options.dryRun ? "would remove" : "remove"} ${skill}`);
    if (!options.dryRun) fs.rmSync(path.join(roots.skills, skill), { recursive: true, force: true });
  }
  for (const agent of removableAgents) {
    console.log(`  ${options.dryRun ? "would remove" : "remove"} agent ${agent}`);
    if (!options.dryRun) fs.rmSync(path.join(roots.agents, `${agent}.md`), { force: true });
  }

  if (options.dryRun) return;
  manifest.catalogueVersion = catalogue.version;
  manifest.managedSkills = [...stillSkills];
  manifest.managedAgents = [...stillAgents];
  if (Object.keys(manifest.installedBundles).length === 0) {
    fs.rmSync(manifestPath(roots.skills), { force: true });
  } else {
    writeJsonAtomic(manifestPath(roots.skills), manifest);
  }
  console.log("Restart OpenCode so it refreshes skill and agent discovery.");
}

// Parity and gap tables on demand (D8): every skill is a pass-through; every agent is rendered.
function commandReport(catalogue) {
  const names = catalogue.bundles.map((entry) => entry.name);
  const agents = renderBundleAgents(catalogue, Object.keys(catalogue.agents).sort());
  const rows = [
    ...skillsForBundles(catalogue, names).map((skill) => [`skill:${skill}`, 0]),
    ...agents.map((agent) => [`agent:${agent.name}`, agent.gaps.length]),
  ].sort((a, b) => a[0].localeCompare(b[0]));
  console.log(`# Parity report (catalogue ${catalogue.version})\n`);
  console.log("| Artifact | Claude | opencode | Gaps |\n|---|---|---|---|");
  for (const [artifact, count] of rows) console.log(`| \`${artifact}\` | ✓ | ✓ | ${count} |`);
  console.log(`\n# Gap report (catalogue ${catalogue.version})\n`);
  const gaps = agents.flatMap((agent) => agent.gaps.map((gap) => [`agents/${agent.name}.md`, gap]));
  if (gaps.length === 0) {
    console.log("No gaps — every source artifact has a native opencode equivalent.");
    return;
  }
  console.log("| Source | CLI | Reason |\n|---|---|---|");
  for (const [source, gap] of gaps) console.log(`| \`${source}\` | opencode | ${gap} |`);
}

function main() {
  const options = parseCli(process.argv.slice(2));
  const catalogue = loadCatalogue();

  if (options.version) {
    console.log(catalogue.version);
    return;
  }
  if (options.help || !options.command) {
    console.log(usage());
    return;
  }

  switch (options.command) {
    case "list":
      commandList(catalogue);
      return;
    case "status":
      commandStatus(catalogue, options);
      return;
    case "install":
      commandInstall(catalogue, options.bundles, options);
      return;
    case "uninstall":
      commandUninstall(catalogue, options.bundles, options);
      return;
    case "report":
      commandReport(catalogue);
      return;
    default:
      throw new Error(`Unknown command '${options.command}'\n\n${usage()}`);
  }
}

try {
  main();
} catch (error) {
  console.error(`skillery-opencode: ${error.message}`);
  process.exitCode = 1;
}
