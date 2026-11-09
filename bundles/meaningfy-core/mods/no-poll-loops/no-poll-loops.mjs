// Denies a Bash command that polls with a sleep loop (lean-delivery D-5). Dependency-free; shared by
// the Claude Code command hook (CLI below) and the opencode plugin (imports `check`).
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const MESSAGE =
  "Sleep loops are denied. Run the command in the foreground if it fits the tool timeout " +
  "(a subagent may never get a completion notice); otherwise run it in the background once " +
  "and wait for its notice or one blocking wait.";

// shortcut: input beyond 64 KB is allowed unchecked; raise it only if a real command is that long.
const MAX_INPUT = 64 * 1024;
// shortcut: a heredoc ends at the first line equal to its word once trimmed; `<<` inside a quoted
// string is read as a heredoc. Both only matter for adversarial input.
const SEPARATORS = new Set([";", "&", "|", "(", ")", "`"]);
const QUOTED = "\0"; // stands for quoted text, so a quoted word is never a command name
const SKIPPED = new Set(["then", "else", "elif", "if", "{", "!", "time", "exec", "command"]);
const LOOP_OPENERS = new Set(["while", "until", "for"]);

/** Split a command into simple commands (arrays of words), dropping quoted text, heredoc bodies
 * and comments. One pass over the characters, so the cost is linear. */
function tokenise(src) {
  const commands = [];
  let words = [];
  let word = "";
  const heredocs = [];
  const endWord = () => {
    if (word) words.push(word);
    word = "";
  };
  const endCommand = () => {
    endWord();
    if (words.length) commands.push(words);
    words = [];
  };
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === "'" || c === '"') {
      i++;
      while (i < src.length && src[i] !== c) i += c === '"' && src[i] === "\\" ? 2 : 1;
      i++;
      word += QUOTED;
    } else if (c === "\\") {
      i += 2;
      if (src[i - 1] !== "\n") word += QUOTED;
    } else if (c === "#" && !word) {
      const eol = src.indexOf("\n", i);
      i = eol < 0 ? src.length : eol;
    } else if (c === "<" && src[i + 1] === "<" && src[i + 2] !== "<") {
      const m = /^<<(-?)[ \t]*(['"]?)([^\s;&|()<>'"]+)\2/.exec(src.slice(i, i + 200));
      if (m) {
        heredocs.push(m[3]);
        i += m[0].length;
      } else i += 2;
    } else if (c === "\n") {
      endCommand();
      i++;
      for (const terminator of heredocs.splice(0)) {
        while (i < src.length) {
          const eol = src.indexOf("\n", i);
          const line = src.slice(i, eol < 0 ? src.length : eol).trim();
          i = eol < 0 ? src.length : eol + 1;
          if (line === terminator) break;
        }
      }
    } else if (SEPARATORS.has(c)) {
      endCommand();
      i++;
    } else if (c === " " || c === "\t" || c === "\r") {
      endWord();
      i++;
    } else {
      word += c;
      i++;
    }
  }
  endCommand();
  return commands;
}

/** True when `watch`'s own options (before its first non-option word) set an interval. */
function watchHasInterval(args) {
  for (const arg of args) {
    if (!arg.startsWith("-") || arg === "--") return false;
    if (arg === "--interval" || arg.startsWith("--interval=")) return true;
    if (/^-[A-Za-z]*n/.test(arg)) return true;
  }
  return false;
}

/** Deny message for a polling command, else null. */
export function check(command) {
  const src = String(command);
  if (src.length > MAX_INPUT) return null;
  let pending = 0; // loops opened by while/until/for whose `do` has not come yet
  let depth = 0; // loops whose body is open
  for (const words of tokenise(src)) {
    for (let i = 0; i < words.length; i++) {
      const word = words[i].slice(words[i].lastIndexOf("/") + 1);
      if (word === "do") {
        if (pending > 0) {
          pending--;
          depth++;
        }
      } else if (word === "done") {
        depth = Math.max(0, depth - 1);
        break;
      } else if (LOOP_OPENERS.has(word)) {
        pending++;
        break;
      } else if (word === "timeout" || word === "nice") {
        while (words[i + 1]?.startsWith("-")) i++;
        if (word === "timeout" || words[i] === "-n") i++;
      } else if (!SKIPPED.has(word) && !/^\w+=/.test(word)) {
        if (word === "sleep" && depth > 0) return MESSAGE;
        if (word === "watch" && watchHasInterval(words.slice(i + 1))) return MESSAGE;
        break;
      }
    }
  }
  return null;
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
