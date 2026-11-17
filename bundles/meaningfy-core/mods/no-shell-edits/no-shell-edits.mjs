// Denies a Bash command that writes or reverts a file in place (guardrails: edits go through the
// Edit tool or Serena; Bash runs commands). Dependency-free; shared by the Claude Code command hook
// (CLI below) and the opencode plugin (imports `check`).
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const MESSAGE =
  "Shell edits are denied: change files with the Edit tool or Serena, never with sed -i, perl -i, " +
  "an inline python/node script or a cat/tee heredoc, and never discard a file with git checkout " +
  "or git restore. Bash runs commands; temporary files go under $TMPDIR. If Edit is refused because " +
  "the path is outside the session, stop and report it.";

// shortcut: input beyond 64 KB is allowed unchecked; raise it only if a real command is that long.
const MAX_INPUT = 64 * 1024;
const HEREDOC = /<<-?[ \t]*(['"]?)([\w.-]+)\1[^\n]*\n([\s\S]*?)(?:\n[ \t]*\2[ \t]*(?=\n|$)|$)/g;
const INTERPRETER = /^\s*(?:\w+=\S*\s+)*(?:uv run\s+)?(?:python[\d.]*|node)\b/;
const INLINE_SCRIPT = /\b(?:python[\d.]*|node)\s+(?:-\S+\s+)*?-[ce]\s+(['"])([\s\S]*?[^\\])\1/g;
const WRITES = [
  /\bopen\([^)]*,\s*(?:mode\s*=\s*)?['"][wax]/,
  /\.write_(?:text|bytes)\(/,
  /\b(?:writeFileSync|appendFileSync|writeFile)\(/,
];
const TEMP = /^["']?(?:\/dev\/|\/tmp\/|\$\{?TMPDIR\b)/;
const PREFIX = new Set(["sudo", "command", "env", "exec", "time", "then", "do", "else", "!", "{"]);

const writes = (script) => WRITES.some((re) => re.test(script));

/** The words of each simple command, quoted text emptied, assignments and prefixes dropped. */
function commands(src) {
  const bare = src.replace(/'[^']*'|"(?:\\.|[^"\\])*"/g, "''");
  return bare
    .split(/[;&|()`\n]+/)
    .map((segment) => {
      const words = segment.trim().split(/\s+/).filter(Boolean);
      while (words.length && (PREFIX.has(words[0]) || /^\w+=/.test(words[0]))) words.shift();
      return words;
    })
    .filter((words) => words.length);
}

function heredocWrites(src) {
  for (const m of src.matchAll(HEREDOC)) {
    const lineStart = src.lastIndexOf("\n", m.index) + 1;
    const head = src.slice(lineStart, m.index).split(/[;&|(]/).pop();
    if (INTERPRETER.test(head) && writes(m[3])) return true;
    const cmd = head.trim().split(/\s+/)[0]?.split("/").pop();
    let target = null;
    if (cmd === "cat") target = />>?\s*(\S+)/.exec(head)?.[1];
    if (cmd === "tee") target = head.trim().split(/\s+/).slice(1).find((w) => !w.startsWith("-"));
    if (target && !TEMP.test(target)) return true;
  }
  return false;
}

// shortcut: a branch name ending in a letter extension (`fix/notes.md`) reads as a file.
const looksLikeFile = (word) => /\.[A-Za-z]\w*$/.test(word);

function deniedCommand(words) {
  const [name, ...args] = words;
  const cmd = name.slice(name.lastIndexOf("/") + 1);
  const options = args.filter((w) => w.startsWith("-"));
  if (cmd === "sed") return options.some((o) => /^-[A-Za-z]*i/.test(o) || o.startsWith("--in-place"));
  if (cmd === "perl") return options.some((o) => /^-[A-Za-z]*i/.test(o));
  if (cmd !== "git") return false;
  const [sub, ...rest] = args.filter((w) => !/^-C$|^-c$/.test(w));
  if (sub === "restore") return !rest.includes("--staged") || rest.includes("--worktree");
  if (sub !== "checkout") return false;
  if (rest.includes("-b") || rest.includes("-B") || rest.includes("--orphan")) return false;
  return rest.includes("--") || rest.filter((w) => !w.startsWith("-")).some(looksLikeFile);
}

/** Deny message for a command that edits or reverts a file in place, else null. */
export function check(command) {
  const src = String(command);
  if (src.length > MAX_INPUT) return null;
  if (heredocWrites(src)) return MESSAGE;
  const flat = src.replace(HEREDOC, "\n");
  for (const m of flat.matchAll(INLINE_SCRIPT)) if (writes(m[2])) return MESSAGE;
  return commands(flat).some(deniedCommand) ? MESSAGE : null;
}

function main() {
  try {
    const command = JSON.parse(readFileSync(0, "utf8"))?.tool_input?.command;
    const message = typeof command === "string" ? check(command) : null;
    if (message) {
      process.stderr.write(`${message}\n`);
      process.exit(2);
    }
  } catch {
    // fail open: any error lets the command run
  }
}

// The real paths, so a hook started through a symlink still runs; no argv[1] means imported (node -e).
if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) main();
