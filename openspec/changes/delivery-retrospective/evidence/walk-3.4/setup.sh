#!/usr/bin/env bash
# Builds the throwaway sandbox for the task 3.4 walk (delivery-retrospective, D-24, D-27).
# Usage: setup.sh [sandbox-dir]   (default ~/sandbox/walk-3.4; refuses an existing folder)
set -euo pipefail
dir=${1:-$HOME/sandbox/walk-3.4}
[ -e "$dir" ] && { echo "exists: $dir (remove it or pass another path)" >&2; exit 2; }
mkdir -p "$dir" && cd "$dir" && git init -q -b develop

cat > AGENTS.md <<'EOF'
# Walk sandbox
A throwaway repository for walking the mark-line scenarios. No remote: never push, never open a PR.
Python 3 standard library only; tests run with `python3 -m unittest`.
EOF
cat > hello.py <<'EOF'
def greet() -> str:
    return "hello"
EOF

plan() { # $1 change id, $2 stage-1 box ("x" or " ")
  local c=openspec/changes/$1; mkdir -p "$c"
  cat > "$c/proposal.md" <<EOF
# $1
## Appetite
SMALL.
## Why
A walk fixture: \`greet\` takes an optional name.
## Solution outline
Stage 1: \`greet(name)\` returns "hello <name>". Stage 2: a \`--name\` flag in a \`__main__\` guard.
## No-gos
No dependencies, no packaging.
EOF
  cat > "$c/design.md" <<EOF
> Derives from: EPIC \`$1\`, appetite SMALL. Clarity gate: 9.2/10 (walk fixture).
## Decisions
- **D-1** \`greet(name=None)\` returns "hello" or "hello <name>".
- **D-2** \`python3 hello.py --name X\` prints the greeting (argparse).
## Delivery decisions
EOF
  cat > "$c/tasks.md" <<EOF
## 1. Greeting (stage 1)
- [$2] 1.1 D-1, test-first in \`test_hello.py\`.
## 2. Command line (stage 2)
- [ ] 2.1 D-2, test-first in \`test_hello.py\`.
EOF
}

plan walk-stage " "                       # S1: stage 1 is next
plan walk-handover x                      # S2: stage 1 done, hand-over to stage 2
cat > openspec/changes/walk-handover/handover.md <<'EOF'
# Hand-over: walk-handover, after stage 1
## Done
Stage 1 (task 1.1).
## Next
Stage 2, task 2.1. Read first: tasks.md §2, design.md D-2.
EOF
plan walk-plan " "                        # S4: EPIC shaped, no PLAN yet
rm openspec/changes/walk-plan/design.md openspec/changes/walk-plan/tasks.md
mkdir -p openspec/changes/walk-shape/inputs # S3: seeds only
cat > openspec/changes/walk-shape/inputs/seed.md <<'EOF'
# Seed
`greet` should also say goodbye: a `farewell(name)` beside it. Small. Nothing else.
EOF

git add -A && git commit -qm "chore: walk sandbox" && echo "sandbox ready: $dir"
