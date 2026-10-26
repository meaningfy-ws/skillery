import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));

export const PACKAGE_ROOT = path.resolve(
  process.env.SKILLERY_REPOSITORY_ROOT || path.join(MODULE_DIR, ".."),
);

// Rendered by `make bundles` (tools/bundle_gen) from bundles.yaml + agents/ frontmatter.
export const CATALOGUE = path.join(PACKAGE_ROOT, "tools", "opencode-catalogue.json");
// The one home of the Claude → opencode agent mapping tables (cross-EPIC contract item 3).
export const AGENT_MAP = path.join(PACKAGE_ROOT, "tools", "opencode-agent-map.json");
export const SKILLS_ROOT = path.join(PACKAGE_ROOT, "skills");
export const AGENTS_ROOT = path.join(PACKAGE_ROOT, "agents");

function readJson(filename, label) {
  try {
    return JSON.parse(fs.readFileSync(filename, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read Skillery ${label} at ${filename}: ${error.message}`);
  }
}

// Every bundle, skill and agent name becomes a path segment (and an rm target): kebab-case only.
const SAFE_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function assertSafeNames(names, source) {
  for (const name of names) {
    if (typeof name !== "string" || !SAFE_NAME.test(name)) {
      throw new Error(`Invalid name '${name}' in ${source}: names must be kebab-case`);
    }
  }
}

// Shape check only: schema validation is Python's job (tools/bundle_gen). Names are checked
// here too, because they are joined into paths before anything else runs.
export function loadCatalogue(cataloguePath = CATALOGUE) {
  const parsed = readJson(cataloguePath, "catalogue");
  const invalid = (what) => new Error(`Invalid Skillery catalogue at ${cataloguePath}: ${what}`);
  if (!parsed || typeof parsed !== "object" || typeof parsed.version !== "string") throw invalid("missing version");
  if (!Array.isArray(parsed.bundles)) throw invalid("missing bundles array");
  if (!parsed.agents || typeof parsed.agents !== "object" || Array.isArray(parsed.agents)) {
    throw invalid("missing agents object");
  }
  for (const entry of parsed.bundles) {
    if (!entry || !Array.isArray(entry.skills) || !Array.isArray(entry.agents)) throw invalid("malformed bundle");
    assertSafeNames([entry.name, ...entry.skills, ...entry.agents], cataloguePath);
  }
  assertSafeNames(Object.keys(parsed.agents), cataloguePath);
  return parsed;
}

export function loadAgentMap(mapPath = AGENT_MAP) {
  return readJson(mapPath, "agent map");
}

function bundle(catalogue, name) {
  return catalogue.bundles.find((entry) => entry.name === name);
}

export function normalizeBundleSelection(value) {
  if (value === undefined || value === null) return [];
  const values = Array.isArray(value) ? value : [value];
  return values
    .flatMap((item) => String(item).split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

export function validateBundles(catalogue, requested) {
  const unique = [...new Set(normalizeBundleSelection(requested))];
  const unknown = unique.filter((name) => !bundle(catalogue, name));
  if (unknown.length > 0) {
    const available = catalogue.bundles.map((entry) => entry.name).sort().join(", ");
    throw new Error(`Unknown Skillery bundle(s): ${unknown.join(", ")}. Available: ${available}`);
  }
  return unique;
}

export function skillsForBundles(catalogue, bundles) {
  return [...new Set(bundles.flatMap((name) => bundle(catalogue, name)?.skills ?? []))].sort();
}

export function agentsForBundles(catalogue, bundles) {
  return [...new Set(bundles.flatMap((name) => bundle(catalogue, name)?.agents ?? []))].sort();
}

export function skillDirectories(catalogue, bundles, skillsRoot = SKILLS_ROOT) {
  return skillsForBundles(catalogue, bundles).map((skill) => {
    const directory = path.join(skillsRoot, skill);
    const definition = path.join(directory, "SKILL.md");
    if (!fs.existsSync(definition)) {
      throw new Error(`Bundle references missing skill: ${definition}`);
    }
    return { name: skill, directory };
  });
}

// The agent body is everything after the second `---` line (string split, no YAML parsing).
export function agentBody(stem, agentsRoot = AGENTS_ROOT) {
  const filename = path.join(agentsRoot, `${stem}.md`);
  const lines = fs.readFileSync(filename, "utf8").split("\n");
  const close = lines.indexOf("---", 1);
  if (lines[0] !== "---" || close < 0) throw new Error(`Agent ${filename} has no frontmatter block`);
  return lines.slice(close + 1).join("\n");
}

// Claude agent frontmatter (parsed by tools/bundle_gen into the catalogue) → opencode agent file.
// Field order is fixed; values are JSON flow scalars, which are valid YAML.
export function renderAgent(frontmatter, body, map) {
  const name = frontmatter.name ?? "?";
  const gaps = [];
  const mode = Object.hasOwn(map.agentModes, frontmatter.type ?? "") ? map.agentModes[frontmatter.type] : undefined;
  if (mode === undefined) throw new Error(`agent '${name}': unknown or missing type '${frontmatter.type}'`);
  if (frontmatter.type === "scheduled") {
    gaps.push(`type 'scheduled': opencode has no scheduler; run \`opencode run --agent ${name}\` from an external scheduler`);
  }
  let model;
  if (frontmatter.model !== undefined) {
    model = map.modelAliases[frontmatter.model];
    if (model === undefined) throw new Error(`agent '${name}': unknown model alias '${frontmatter.model}'`);
  }
  const tools = {};
  for (const tool of frontmatter.tools ?? []) {
    if (Object.hasOwn(map.toolNames, tool)) tools[map.toolNames[tool]] = true;
    else gaps.push(`tool '${tool}' has no opencode analogue`);
  }
  const permission = {};
  for (const tool of frontmatter.disallowedTools ?? []) {
    if (Object.hasOwn(map.toolPermission, tool)) permission[map.toolPermission[tool]] = "deny";
    else gaps.push(`disallowedTools '${tool}' has no opencode permission analogue`);
  }
  let color;
  if (frontmatter.color !== undefined) {
    color = map.colors[frontmatter.color];
    if (color === undefined) gaps.push(`color '${frontmatter.color}' has no opencode theme colour`);
  }
  const skills = frontmatter.skills ?? [];
  if (skills.length) tools[map.toolNames.Skill] = true; // the body line below needs the skill tool
  const fields = [
    ["description", typeof frontmatter.description === "string" ? frontmatter.description.trim() : frontmatter.description],
    ["mode", mode],
    ["model", model],
    ["tools", Object.keys(tools).length ? tools : undefined],
    ["permission", Object.keys(permission).length ? permission : undefined],
    ["color", color],
  ];
  const lines = ["---"];
  for (const [key, value] of fields) {
    if (value !== undefined && value !== null) lines.push(`${key}: ${JSON.stringify(value)}`);
  }
  lines.push("---");
  let content = `${lines.join("\n")}\n`;
  if (body) content += body.startsWith("\n") ? body : `\n${body}`;
  // opencode has no `skills` field: the skills still load, on demand, through the skill tool.
  // opencode skill names cannot hold `:`, so a plugin namespace (`superpowers:x`) is stripped.
  if (skills.length) {
    const names = skills.map((s) => `\`${s.slice(s.indexOf(":") + 1)}\``).join(", ");
    content = `${content.replace(/\n*$/, "\n")}\nLoad these skills first with the skill tool: ${names}.\n`;
  }
  return { content, gaps };
}

export function inferBundleFromInstallAlias(catalogue, packageRoot = PACKAGE_ROOT) {
  const alias = path.basename(packageRoot);
  return bundle(catalogue, alias) ? alias : undefined;
}
