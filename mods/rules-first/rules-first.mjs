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
const TYPE_LINE = /^([ \t]*)["']?type["']?[ \t]*:[ \t]*(.*)$/;
const BLOCK_SCALAR = /^[|>](?:[1-9][+-]?|[+-][1-9]?)?$/;
const MAX_LINE = 1000; // a longer line is cut before it is scanned
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
    return { types: new Set(types.map((t) => String(t).toLowerCase())), message: `${message} ${DENY_MARKER}` };
  } catch {
    return null;
  }
}

/** The first non-blank line after `i`, trimmed, when it is indented deeper than `indent`; else "". */
function nextIndented(lines, i, indent) {
  const next = lines.slice(i + 1).find((l) => l.trim());
  return next !== undefined && next.length - next.trimStart().length > indent ? next.trim() : "";
}

// shortcut: YAML flow mappings ({type: x}), aliases, escapes and explicit keys (? type) are not handled;
// upgrade to a YAML parser if a note in those forms ever matters.
/** Every `type:` value of a note's frontmatter (top level and nested), lower-cased; of loose text when it has none. */
function typesOf(text) {
  if (typeof text !== "string") return [];
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  const lines = (m ? m[1] : text).split(/\r?\n/);
  const found = [];
  lines.forEach((line, i) => {
    const t = TYPE_LINE.exec(line.slice(0, MAX_LINE));
    if (!t) return;
    let value = (" " + t[2]).split(/\s#/)[0].trim().replace(/^!!\S*\s*/, "");
    if (value === "" || BLOCK_SCALAR.test(value)) value = nextIndented(lines, i, t[1].length);
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

/**
 * The path when `path` is `<config root>/projects/<slug>/memory/**.md`, else null. It counts as inside when
 * the path as written or its real path matches, against the config root as written or its real path
 * (a symlinked memory/ or projects/ folder points outside the root). macOS and Windows compare without case.
 */
export function memoryPath(path, env, platform = process.platform) {
  const home = env.HOME || homedir();
  const fold = platform === "darwin" || platform === "win32" ? (s) => s.toLowerCase() : (s) => s;
  const written = resolve(expandTilde(env.CLAUDE_CONFIG_DIR || join(home, ".claude"), home));
  const roots = [written, realish(written)];
  const target = resolve(expandTilde(path, home));
  for (const candidate of [target, realish(target)]) {
    for (const root of roots) {
      const rel = candidate.slice(root.length + 1);
      if (fold(candidate).startsWith(fold(root) + "/") && /^projects\/[^/]+\/memory\/.+\.md$/i.test(rel)) return candidate;
    }
  }
  return null;
}

/** `text` with the edit applied (every match when `all`); unchanged when the old string is not a non-empty string. */
const applyEdit = (text, edit, all) => {
  if (typeof edit?.old_string !== "string" || edit.old_string === "" || typeof edit?.new_string !== "string") return text;
  const put = () => edit.new_string; // a function, so `$&` in the text is not a pattern
  return all ? text.replaceAll(edit.old_string, put) : text.replace(edit.old_string, put);
};

/** Pure: true when the note on disk, or the text the tool call writes or leaves behind, has a denied type. */
export function denies(toolName, toolInput, diskText, types) {
  const found = typesOf(diskText);
  if (toolName === "Write") found.push(...typesOf(toolInput?.content));
  else if (toolName === "Edit") {
    found.push(...typesOf(toolInput?.new_string)); // D-10: disk type or new_string type
    if (typeof diskText === "string") found.push(...typesOf(applyEdit(diskText, toolInput, toolInput?.replace_all === true)));
  } else if (toolName === "MultiEdit") {
    const edits = Array.isArray(toolInput?.edits) ? toolInput.edits : [];
    for (const edit of edits) found.push(...typesOf(edit?.new_string));
    if (typeof diskText === "string") found.push(...typesOf(edits.reduce((text, e) => applyEdit(text, e, e?.replace_all === true), diskText)));
  }
  return found.some((t) => types.has(t));
}

/** The I/O shell of the decision: the path check, the disk read, then `denies`. No `deny` data, no deny. */
export function shouldDeny(toolName, toolInput, env, deny, platform = process.platform) {
  if (!deny || typeof toolInput?.file_path !== "string") return false;
  const path = memoryPath(toolInput.file_path, env, platform);
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
