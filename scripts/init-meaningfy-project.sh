#!/usr/bin/env bash
# init-meaningfy-project.sh — scaffold or refresh a consuming repo with the Meaningfy
# binding templates and .claude/ layout. Idempotent: safe to re-run to pick up template
# changes. Never overwrites local edits without confirmation.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE_DIR="$REPO_ROOT/prompts"

usage() {
  cat <<'EOF'
Usage: init-meaningfy-project.sh [TARGET_DIR]

Scaffold/refresh a Meaningfy project (default TARGET_DIR = current directory):
  - writes CLAUDE.md and AGENTS.md from prompts/*.template if absent;
    if present, shows a diff and asks before overwriting (never clobbers silently)
  - creates the .claude/memory/ layout
  - prints the plugin install commands (see docs/environment-setup.md)

Re-run any time to refresh templates. Options:
  -h, --help   show this help
EOF
}

case "${1:-}" in -h|--help) usage; exit 0 ;; esac
TARGET="${1:-$(pwd)}"
mkdir -p "$TARGET/.claude/memory/epics"

install_template() {
  local src="$1" dst="$2"
  if [[ ! -f "$dst" ]]; then
    cp "$src" "$dst"; echo "  created $dst"
  elif diff -q "$src" "$dst" >/dev/null 2>&1; then
    echo "  exists, no changes: $dst"
  else
    echo "  DIFFERS: $dst"; diff "$dst" "$src" || true
    read -r -p "  overwrite $dst with the latest template? [y/N] " ans
    [[ "${ans:-N}" =~ ^[Yy]$ ]] && { cp "$src" "$dst"; echo "  updated $dst"; } || echo "  kept local $dst"
  fi
}

echo "Scaffolding Meaningfy project in: $TARGET"
install_template "$TEMPLATE_DIR/CLAUDE.md.template" "$TARGET/CLAUDE.md"
install_template "$TEMPLATE_DIR/AGENTS.md.template" "$TARGET/AGENTS.md"
[[ -f "$TARGET/.claude/memory/MEMORY.md" ]] || { : > "$TARGET/.claude/memory/MEMORY.md"; echo "  created .claude/memory/MEMORY.md"; }

cat <<'EOF'

Next — install the skills (see docs/environment-setup.md for details):
  /plugin marketplace add meaningfy-ws/agent-skills
  /plugin install meaningfy-engineering
  /plugin install meaningfy-ai-coding
  /plugin install meaningfy-consulting
Mandatory external skills:
  /plugin install superpowers@claude-plugins-official
  (and the external stream-coding skill)

Done. Re-run this script after the agent-skills repo updates to refresh CLAUDE.md / AGENTS.md.
EOF
