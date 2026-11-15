// Rules-first routing (rules-first-memory D-5, D-6). SessionStart prints the stores and the routing
// text; PreToolUse denies a memory note whose type is `feedback` or `user`. Dependency-free; fails
// open (no output, exit 0) everywhere except the deny itself, which exits 2.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The marker is the constant DENY_MARKER of skills/rulebook/scripts/rules.py; `stats` counts it.
// The denied types and the message text are data in skills/rulebook/assets/memory-deny.json.
const DENY_MARKER = "[rules-first: memory write denied]";
const TYPE_LINE = /^[ \t]*type:[ \t]*(.*)$/;
const BLOCK_SCALAR = /^[|>][+-]?$/;
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
    timeout: 15000, // 5000 ran out under load and dropped the where lines
  });
  if (!where.error && where.status === 0 && where.stdout) {
    parts.push(...where.stdout.split("\n").filter((l) => l && l.trim() !== END_LINE));
  }
  const routing = readText(join(root, "skills/rulebook/assets/routing.md"));
  if (routing) parts.push(routing.trimEnd());
  return parts.length ? `Rules (rules-first):\n${parts.join("\n")}\n` : "";
}

/** The denied types and the message (with the marker) from the rulebook asset; null when unreadable. */
export function loadDeny(root = ROOT) {
  try {
    const { types, message } = JSON.parse(readFileSync(join(root, "skills/rulebook/assets/memory-deny.json"), "utf8"));
    if (!Array.isArray(types) || typeof message !== "string") return null;
    return { types: new Set(types), message: `${message} ${DENY_MARKER}` };
  } catch {
    return null;
  }
}

/** Every `type:` value of a note's frontmatter (top level and nested), lower-cased; of loose text when it has none. */
function typesOf(text) {
  if (typeof text !== "string") return [];
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  const lines = (m ? m[1] : text).split(/\r?\n/);
  const found = [];
  lines.forEach((line, i) => {
    const t = TYPE_LINE.exec(line);
    if (!t) return;
    let value = t[1].replace(/\s+#.*$/, "").trim();
    if (BLOCK_SCALAR.test(value)) value = (lines.slice(i + 1).find((l) => l.trim()) ?? "").trim();
    found.push(value.replace(/^["']|["']$/g, "").trim().toLowerCase());
  });
  return found;
}

const expandTilde = (p, home) => (p === "~" || p.startsWith("~/") ? join(home, p.slice(1)) : p);

/** The real path of `path`, or of its nearest existing ancestor with the missing tail put back. */
function realish(path) {
  const tail = [];
  for (let cur = path; ; cur = dirname(cur)) {
    try {
      return join(realpathSync(cur), ...tail);
    } catch {
      if (dirname(cur) === cur) return path;
      tail.unshift(basename(cur));
    }
  }
}

/** The real absolute path when `path` is `<config root>/projects/<slug>/memory/**.md`, else null. */
export function memoryPath(path, env) {
  const home = env.HOME || homedir();
  const config = realish(resolve(expandTilde(env.CLAUDE_CONFIG_DIR || join(home, ".claude"), home)));
  const target = realish(resolve(expandTilde(path, home)));
  const inside = target.startsWith(config + "/") && /^projects\/[^/]+\/memory\/.+\.md$/i.test(target.slice(config.length + 1));
  return inside ? target : null;
}

/** Pure: true when the note on disk, or the text the tool call writes, has a denied type. */
export function denies(toolName, toolInput, diskText, types) {
  const found = typesOf(diskText);
  if (toolName === "Write") found.push(...typesOf(toolInput?.content));
  else if (toolName === "Edit") found.push(...typesOf(toolInput?.new_string)); // D-10: disk type or new_string type
  else if (toolName === "MultiEdit") {
    for (const edit of Array.isArray(toolInput?.edits) ? toolInput.edits : []) found.push(...typesOf(edit?.new_string));
  }
  return found.some((t) => types.has(t));
}

/** The I/O shell of the decision: the path check, the disk read, then `denies`. No `deny` data, no deny. */
export function shouldDeny(toolName, toolInput, env, deny) {
  if (!deny || typeof toolInput?.file_path !== "string") return false;
  const path = memoryPath(toolInput.file_path, env);
  return path !== null && denies(toolName, toolInput, readText(path), deny.types);
}

function main() {
  try {
    const event = JSON.parse(readFileSync(0, "utf8"));
    if (event?.hook_event_name === "SessionStart") {
      const block = sessionBlock(event.cwd || process.cwd());
      if (block) process.stdout.write(block);
    } else if (event?.hook_event_name === "PreToolUse") {
      const deny = loadDeny();
      if (shouldDeny(event.tool_name, event.tool_input, process.env, deny)) {
        process.stderr.write(`${deny.message}\n`);
        process.exit(2);
      }
    }
  } catch {
    // fail open: any error lets the session and the write go on
  }
}

// The real paths, so a hook started through a symlink still runs; no argv[1] means imported (node -e).
if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) main();
