// Rules-first routing (rules-first-memory D-5, D-6). SessionStart prints the stores and the routing
// text; PreToolUse denies a memory note whose type is `feedback` or `user`. Dependency-free; fails
// open (no output, exit 0) everywhere except the deny itself, which exits 2.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The marker is the constant DENY_MARKER of skills/rulebook/scripts/rules.py; `stats` counts it.
const DENY_MARKER = "[rules-first: memory write denied]";
export const MESSAGE =
  "rules-first: a preference or correction goes to the rulebook, not the CLI's memory. " +
  "Do not save it as a note of another type and do not add it to the memory index. " +
  "Draft it as a rule-learner candidate and show it in the rule approval card before your final summary. " +
  DENY_MARKER;

const DENIED_TYPES = new Set(["feedback", "user"]);
const TYPE_LINE = /^[ \t]*type:[ \t]*["']?(\w+)/m;
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const END_LINE = "-- end --";

const readText = (path) => {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return null;
  }
};

/** The block printed at session start; "" when both the `where` call and routing.md fail. */
export function sessionBlock(cwd, root = ROOT, env = process.env) {
  const parts = [];
  const where = spawnSync("python3", [join(root, "skills/rulebook/scripts/rules.py"), "where"], {
    cwd,
    env,
    encoding: "utf8",
    timeout: 5000,
  });
  if (!where.error && where.status === 0 && where.stdout) {
    parts.push(...where.stdout.split("\n").filter((l) => l && l.trim() !== END_LINE));
  }
  const routing = readText(join(root, "skills/rulebook/assets/routing.md"));
  if (routing) parts.push(routing.trimEnd());
  return parts.length ? `Rules (rules-first):\n${parts.join("\n")}\n` : "";
}

/** The `type:` of a note's frontmatter (top level or nested), or of loose text when it has none. */
function typeOf(text) {
  if (typeof text !== "string") return null;
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  return TYPE_LINE.exec(m ? m[1] : text)?.[1] ?? null;
}

/** True when `path` is `<config root>/projects/<one segment>/memory/<name>.md`. */
function inMemoryFolder(path, env) {
  const home = env.HOME || homedir();
  const expand = (p) => (p === "~" || p.startsWith("~/") ? join(home, p.slice(1)) : p);
  const config = resolve(expand(env.CLAUDE_CONFIG_DIR || join(home, ".claude")));
  const rel = resolve(expand(path)).slice(config.length + 1);
  return resolve(expand(path)).startsWith(config + "/") && /^projects\/[^/]+\/memory\/[^/]+\.md$/.test(rel);
}

/** True when the tool call writes a `feedback` or `user` note into the auto-memory folder. */
export function denies(toolName, toolInput, env = process.env) {
  const path = toolInput?.file_path;
  if (typeof path !== "string" || !inMemoryFolder(path, env)) return false;
  const home = env.HOME || homedir();
  const onDisk = readText(path.startsWith("~") ? join(home, path.slice(1)) : path);
  const diskType = onDisk === null ? null : typeOf(onDisk);
  const types = [diskType];
  if (toolName === "Write") types.push(typeOf(toolInput.content));
  else if (toolName === "Edit") types.push(typeOf(toolInput.new_string)); // D-10: disk type or new_string type
  else if (toolName === "MultiEdit") {
    for (const edit of toolInput.edits ?? []) types.push(typeOf(edit?.new_string));
  } else return false;
  return types.some((t) => DENIED_TYPES.has(t));
}

function main() {
  try {
    const event = JSON.parse(readFileSync(0, "utf8"));
    if (event?.hook_event_name === "SessionStart") {
      const block = sessionBlock(event.cwd || process.cwd());
      if (block) process.stdout.write(block);
    } else if (event?.hook_event_name === "PreToolUse" && denies(event.tool_name, event.tool_input)) {
      process.stderr.write(`${MESSAGE}\n`);
      process.exit(2);
    }
  } catch {
    // fail open: any error lets the session and the write go on
  }
}

// The real paths, so a hook started through a symlink still runs; no argv[1] means imported (node -e).
if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) main();
