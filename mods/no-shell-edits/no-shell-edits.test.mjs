import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { check, MESSAGE } from "./no-shell-edits.mjs";

const SCRIPT = fileURLToPath(new URL("./no-shell-edits.mjs", import.meta.url));

// The recorded failure case: a builder in an rdf-persistence worktree (2026-11-17) wrote files
// through Bash with the sandbox bypass instead of Edit or Serena.
const DENIED = [
  "cd /w/tm4-52 && python3 - <<'E'\np='a.yaml'\ns=open(p).read()\ns=s.replace('a','b')\nopen(p,'w').write(s)\nE",
  "python3 -c \"open('x.py','w').write('')\"",
  "python3 - <<EOF\nfrom pathlib import Path\nPath('a.md').write_text('x')\nEOF",
  "node -e \"require('fs').writeFileSync('a.json','{}')\"",
  "sed -i 's/a/b/' f.py",
  "cd x && sed -i.bak -e 's/a/b/' f.py",
  "sed --in-place 's/a/b/' f.py",
  "perl -pi -e 's/a/b/' f.py",
  "cat > src/app.py <<'EOF'\nprint(1)\nEOF",
  "tee docs/a.md <<EOF\nx\nEOF",
  "git checkout rdf_persistence/generation/model/rp_generation.yaml",
  "git checkout -- a.py",
  "git checkout HEAD~1 -- a.py b.py",
  "git restore a.py",
];
const ALLOWED = [
  "ls",
  "sed -n 419,430p a.yaml",
  "grep -n 'sed -i' AGENTS.md",
  "git commit -m \"never use sed -i or open(p,'w')\"",
  "git commit -F - <<'EOF'\nfix: stop sed -i and git checkout -- a.py\nEOF",
  "python3 -c \"import json; print(json.load(open('a.json')))\"",
  "python3 tools/gen.py --out a.json",
  "uv run pytest -q",
  "git checkout -b feat/no-shell-edits",
  "git checkout develop",
  "git checkout release/3.20.0",
  "git restore --staged a.py",
  "cat > $TMPDIR/body.md <<'EOF'\nx\nEOF",
  "cat > /tmp/claude-1000/x.txt <<EOF\nx\nEOF",
  "gh pr create --body-file - <<'EOF'\nUse Edit, not sed -i.\nEOF",
];

for (const command of DENIED) {
  test(`denies: ${JSON.stringify(command)}`, () => assert.equal(check(command), MESSAGE));
}
for (const command of ALLOWED) {
  test(`allows: ${JSON.stringify(command)}`, () => assert.equal(check(command), null));
}

const run = (input) => spawnSync(process.execPath, [SCRIPT], { input, encoding: "utf8" });
const hookJson = (command) => JSON.stringify({ tool_name: "Bash", tool_input: { command } });

test("CLI: deny exits 2 with the message on stderr", () => {
  const r = run(hookJson("sed -i 's/a/b/' f.py"));
  assert.equal(r.status, 2);
  assert.equal(r.stderr.trim(), MESSAGE);
});

test("CLI: allow exits 0", () => assert.equal(run(hookJson("ls")).status, 0));

test("CLI: malformed input fails open", () => assert.equal(run("not json").status, 0));
