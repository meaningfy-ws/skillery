// Warns, never denies, when a Bash command is a noisy form of a tool call (skillery-performance-
// improvement D-10): a file read through sed -n/cat/head/tail, a search through grep/rg/ugrep with a
// path, or a verbose test run. The warning reaches the model as `additionalContext` at exit 0.
// Dependency-free; `check` is pure.
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const READ_FILE =
  "quiet-tools: `sed -n`/`cat`/`head`/`tail` on a file reads it into the context; " +
  "use the Read tool (a range) instead.";
export const USE_GREP = "quiet-tools: `grep`/`rg` on a path; use the Grep tool instead.";
export const NO_VERBOSE = "quiet-tools: `-v` prints every test; use `-q -rfE`.";

// shortcut: input beyond 64 KB is not checked; raise it only if a real command is that long.
const MAX_INPUT = 64 * 1024;
// shortcut: a heredoc ends at the first line equal to its word once trimmed; `<<` inside a quoted
// string is read as a heredoc. Both only matter for adversarial input.
const SEPARATORS = new Set([";", "&", "|", "(", ")", "`"]);
const QUOTED = "\0"; // stands for quoted text, so a quoted word is never a command name
const SKIPPED = new Set(["then", "else", "elif", "if", "do", "while", "until", "{", "!", "time", "exec", "command"]);
const REDIRECT = /^\d*(>>?|<|>&|&>)$/; // an operator whose target is the next word
const GREP_VALUE_FLAGS = new Set(["-e", "-f", "-m", "-A", "-B", "-C", "-d", "-D", "-g", "-t", "-T", "-j"]);
const GREP_PATTERN_FLAGS = new Set(["-e", "-f", "--regexp", "--file"]);

/** Split a command into simple commands: `{ words, piped }`, `piped` when a `|` feeds it. Quoted
 * text becomes one QUOTED mark; heredoc bodies and comments are dropped. One pass, linear cost. */
function tokenise(src) {
  const commands = [];
  let words = [];
  let word = "";
  let piped = false;
  const heredocs = [];
  const endWord = () => {
    if (word) words.push(word);
    word = "";
  };
  const endCommand = () => {
    endWord();
    if (words.length) commands.push({ words, piped });
    words = [];
    piped = false;
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
    } else if (c === "|" && src[i + 1] !== "|") {
      endCommand();
      piped = true; // the next command reads this one's output
      i += src[i + 1] === "&" ? 2 : 1;
    } else if (SEPARATORS.has(c)) {
      endCommand();
      piped = false;
      i += c === "|" || (c === "&" && src[i + 1] === "&") ? 2 : 1;
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

/** The command word's index and the operands after it, redirections removed. `fed` is true when
 * a `<` redirection supplies stdin. */
function split(words) {
  let start = 0;
  while (start < words.length && (SKIPPED.has(words[start]) || /^\w+=/.test(words[start]))) start++;
  const args = [];
  let fed = false;
  for (let i = start + 1; i < words.length; i++) {
    const w = words[i];
    if (REDIRECT.test(w)) {
      if (w.endsWith("<")) fed = true;
      i++;
    } else if (/^\d*[<>]/.test(w) || w.startsWith("&>")) {
      if (w.startsWith("<")) fed = true;
    } else args.push(w);
  }
  const name = words[start]?.slice(words[start].lastIndexOf("/") + 1);
  return { name, args, fed };
}

const isOption = (arg) => arg.startsWith("-") && arg.length > 1;

/** Operands (non-options) of a command, skipping the value of the flags in `valued`. */
function operands(args, valued = new Set()) {
  const found = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--") {
      found.push(...args.slice(i + 1));
      break;
    }
    if (isOption(args[i])) {
      if (valued.has(args[i])) i++;
    } else found.push(args[i]);
  }
  return found;
}

/** The warning for one simple command, else null. */
function checkCommand({ words, piped }) {
  const { name, args, fed } = split(words);
  if (args.includes("-vv")) return NO_VERBOSE;
  if (words.includes("pytest") && args.some((a) => a === "-v" || a === "--verbose")) return NO_VERBOSE;
  if (piped || fed) return null; // reads stdin: no file is read into the context
  if (name === "cat") return operands(args).length ? READ_FILE : null;
  if (name === "head" || name === "tail") {
    return operands(args, new Set(["-n", "-c"])).length ? READ_FILE : null;
  }
  if (name === "sed") {
    const quiet = args.some((a) => a === "--quiet" || a === "--silent" || /^-[A-Za-z]*n/.test(a));
    const scripted = args.some((a) => a === "-e" || a === "-f");
    const found = operands(args, new Set(["-e", "-f"])).length;
    return quiet && found >= (scripted ? 1 : 2) ? READ_FILE : null;
  }
  if (name === "grep" || name === "rg" || name === "ugrep") {
    const patterned = args.some((a) => GREP_PATTERN_FLAGS.has(a) || /^--(regexp|file)=/.test(a));
    const found = operands(args, GREP_VALUE_FLAGS).length;
    return found >= (patterned ? 1 : 2) ? USE_GREP : null;
  }
  return null;
}

/** Warning text for a command in a noisy form, else null; one message, the first form found. */
export function check(command) {
  const src = String(command);
  if (src.length > MAX_INPUT) return null;
  for (const simple of tokenise(src)) {
    const message = checkCommand(simple);
    if (message) return message;
  }
  return null;
}

function main() {
  try {
    const command = JSON.parse(readFileSync(0, "utf8"))?.tool_input?.command;
    const message = typeof command === "string" ? check(command) : null;
    if (message) {
      process.stdout.write(
        `${JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: message } })}\n`,
      );
    }
  } catch {
    // fail open: any error lets the command run unwarned
  }
}

// The real paths, so a hook started through a symlink still runs; no argv[1] means imported (node -e).
if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) main();
