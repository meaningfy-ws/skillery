// Denies, for the lawyer agent only, the actions its refusals name (agents/lawyer.md): sending,
// signing or registering a contract without the owner confirming that one action, and any Odoo
// access (a Bash Odoo CLI or client, or an mcp__odoo__ tool). Dependency-free. The hook scopes
// itself by the `agent_type` of the hook input, because plugin agents cannot carry their own hooks;
// any other agent, and a session with no agent type, is never checked.
import { readFileSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

const confirm = (action) =>
  `The lawyer does not ${action} a contract. Ask the owner to confirm that one action, naming the ` +
  "repository's command, and let the owner run it.";

export const SEND = confirm("send");
export const SIGN = confirm("sign");
export const REGISTER = confirm("register");
export const ODOO =
  "The lawyer does not access Odoo, by command line, client or tool. Ask the owner for the values " +
  "you need and mark them to be confirmed.";

const BY_ACTION = { send: SEND, sign: SIGN, register: REGISTER };
const LAWYER = /(?:^|:)lawyer$/;
const ODOO_NAME = /^odoo(?:[-_.].*)?$/i;
const ACTION_NAME = /^(send|sign|register)(?:[-_.:][\w.:-]*)?$/i;
const SHELL_C = /\b(?:(?:ba|z)?sh\s+-\w*c|eval)\s+(['"])([\s\S]*?)\1/g;
const INTERPRETERS = new Set(["bash", "sh", "zsh", "python", "python3", "node", "uv", "poetry", "npx"]);
// ponytail: wrapper options are skipped by shape (a dash word or a number/duration); an option that
// takes a non-numeric value (`sudo -u user`) still hides the command. The guard is against the
// agent's mistakes, not a hostile agent; a deny-by-default allowlist is the upgrade path.
const PREFIX = new Set(["sudo", "doas", "command", "env", "exec", "time", "timeout", "stdbuf", "flock", "watch",
  "nohup", "nice", "xargs", "then", "do", "else", "!", "{"]);
const WRAPPER_ARG = /^(?:-.*|\d+(?:\.\d+)?[smhd]?)$/;
// A quoted span glued to a word is part of that word (bash reads ma""ke as make); a standalone
// quoted span is text (a commit message), emptied so it never reads as a command.
const QUOTED = /(\S?)('[^']*'|"(?:\\.|[^"\\])*")(\S?)/g;
const unquote = (src) => src.replace(QUOTED, (_, a, q, b) => (a || b ? a + q.slice(1, -1) + b : "''"));
const MAKE_TAKES_VALUE = new Set(["-C", "-f", "-I", "-j", "-o", "-W", "--directory", "--file"]);

/** The words of each simple command, quoted text emptied, assignments and prefixes dropped. */
function commands(src) {
  return unquote(src)
    .split(/[;&|()`\n]+/)
    .map((segment) => {
      const words = segment.trim().split(/\s+/).filter(Boolean);
      while (words.length && (PREFIX.has(base(words[0])) || /^\w+=/.test(words[0]))) {
        words.shift();
        while (words.length && WRAPPER_ARG.test(words[0])) words.shift();
      }
      return words;
    })
    .filter((words) => words.length);
}

const base = (word) => word.slice(word.lastIndexOf("/") + 1);

/** The refusal a name belongs to (Odoo, or one of the three contract actions), or null. */
function byName(name) {
  if (ODOO_NAME.test(name)) return ODOO;
  const action = ACTION_NAME.exec(name)?.[1];
  return action ? BY_ACTION[action.toLowerCase()] : null;
}

function makeTarget(args) {
  for (let i = 0; i < args.length; i++) {
    const word = args[i];
    if (MAKE_TAKES_VALUE.has(word)) i++;
    else if (!word.startsWith("-") && !word.includes("=")) {
      const hit = byName(word);
      if (hit && hit !== ODOO) return hit;
    }
  }
  return null;
}

function interpreterScript(args) {
  const words = args.filter((w) => w !== "run");
  for (let i = 0; i < words.length; i++) {
    if (words[i] === "-m") return ODOO_NAME.test(words[i + 1] ?? "") ? ODOO : null;
    if (!words[i].startsWith("-")) return byName(base(words[i]));
  }
  return null;
}

function refusalFor(words) {
  const [name, ...args] = words;
  const cmd = base(name);
  if (cmd === "make") return makeTarget(args);
  if (INTERPRETERS.has(cmd)) return interpreterScript(args);
  return byName(cmd);
}

/** The message that denies a Bash command, or null. */
function checkCommand(command) {
  for (const m of command.matchAll(SHELL_C)) {
    const inner = checkCommand(m[2]);
    if (inner) return inner;
  }
  for (const words of commands(command)) {
    const message = refusalFor(words);
    if (message) return message;
  }
  return null;
}

/** The deny message for one hook input, or null. Only the lawyer is checked. */
export function check(input) {
  if (!LAWYER.test(String(input?.agent_type ?? ""))) return null;
  const tool = input.tool_name;
  // The MCP server segment names Odoo, with or without a plugin prefix (mcp__plugin_odoo_odoo__x).
  if (typeof tool === "string" && tool.startsWith("mcp__") && /odoo/i.test(tool.slice(5).split("__")[0])) return ODOO;
  const command = input.tool_input?.command;
  return tool === "Bash" && typeof command === "string" ? checkCommand(command) : null;
}

function main() {
  try {
    const message = check(JSON.parse(readFileSync(0, "utf8")));
    if (message) {
      process.stderr.write(`${message}\n`);
      process.exit(2);
    }
  } catch {
    // fail open: any error lets the call run
  }
}

// The real paths, so a hook started through a symlink still runs; no argv[1] means imported (node -e).
if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) main();
