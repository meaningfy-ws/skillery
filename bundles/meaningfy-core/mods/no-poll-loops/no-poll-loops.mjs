// Denies a Bash command that polls with a sleep loop (lean-delivery D-5). Dependency-free; shared by
// the Claude Code command hook (CLI below) and the opencode plugin (imports `check`).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const MESSAGE =
  "Sleep loops are denied. Run the command in the foreground if it fits the tool timeout " +
  "(a subagent may never get a completion notice); otherwise run it in the background once " +
  "and wait for its notice or one blocking wait.";

// shortcut: a loop is "while|until|for ... do <body without done> sleep"; nested loops and a
// sleep after an inner `done` are not told apart. Upgrade only if a false verdict is reported.
const SLEEP_LOOP = /\b(?:while|until|for)\b[\s\S]*?\bdo\b(?:(?!\bdone\b)[\s\S])*?\bsleep\b/;
const WATCH_INTERVAL = /(?<![-\w])watch\s+(?:\S+\s+)*?(?:-n|--interval)/;

/** Deny message for a polling command, else null. */
export function check(command) {
  const code = String(command).replace(/'[^']*'|"(?:[^"\\]|\\.)*"/g, " ");
  return SLEEP_LOOP.test(code) || WATCH_INTERVAL.test(code) ? MESSAGE : null;
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

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
