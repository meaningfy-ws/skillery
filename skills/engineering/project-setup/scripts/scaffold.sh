#!/usr/bin/env bash
# scaffold.sh — render the project-setup templates into a target repo.
#
# Idempotent: re-runnable to pick up template changes. Never overwrites an existing
# file without asking (use --force to overwrite, --skip-existing for CI/non-interactive).
# This handles the MECHANICAL skeleton; judgement-heavy content (filling EPICs, real
# import-linter tiers, doc prose, archetype entrypoints) is the agent's job afterwards —
# see the references/.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TPL="$SCRIPT_DIR/../assets/templates"

# ---- defaults -------------------------------------------------------------
PACKAGE="" ; PROJECT_NAME="" ; SLUG="" ; PYVER="3.12"
ORG="meaningfy-ws" ; BRANCH="develop" ; DESC="" ; YEAR="$(date +%Y)"
ARCHETYPE="service" ; TARGET="$(pwd)"
WITH_DOCS=1 ; WITH_INFRA=1 ; WITH_CI=1
FORCE=0 ; SKIP_EXISTING=0 ; NO_LOCK=0 ; DRY_RUN=0

usage() {
  cat <<'EOF'
Usage: scaffold.sh -p PACKAGE -n "PROJECT NAME" [options]

Required:
  -p, --package NAME     top-level Python package (e.g. myproject) — NO src/
  -n, --name "NAME"      human project title (e.g. "My Project")

Options:
  -s, --slug SLUG        repo/kebab slug          (default: derived from package)
  -a, --archetype TYPE   service|library|pipeline|cli|docs-only  (default: service)
      --python VER       Python version           (default: 3.12)
      --org ORG          GitHub org               (default: meaningfy-ws)
      --branch BRANCH    default/PR branch        (default: develop)
      --desc "TEXT"      one-line description      (default: "")
      --target DIR       repo root to scaffold     (default: current directory)
      --no-docs          skip the Antora docs pillar
      --no-infra         skip the Docker/infra pillar
      --no-ci            skip the GitHub Actions pillar
      --no-lock          do not run `poetry lock` after scaffolding
      --dry-run          report a gap analysis (+ create / = keep) and write NOTHING
      --force            overwrite existing files without asking
      --skip-existing    keep existing files, no prompt (non-interactive)
  -h, --help             show this help

Modes:
  greenfield   empty repo            scaffold.sh -p pkg -n "Name"
  gap report   existing repo, audit  scaffold.sh -p pkg -n "Name" --dry-run
  fill gaps    existing repo, apply  scaffold.sh -p pkg -n "Name" --skip-existing
For the full modernization workflow see references/modernizing-existing-projects.md.
After running, see references/checklists.md for the Definition-of-Done.
EOF
}

# ---- arg parsing ----------------------------------------------------------
while [[ $# -gt 0 ]]; do
  case "$1" in
    -p|--package) PACKAGE="$2"; shift 2;;
    -n|--name)    PROJECT_NAME="$2"; shift 2;;
    -s|--slug)    SLUG="$2"; shift 2;;
    -a|--archetype) ARCHETYPE="$2"; shift 2;;
    --python)     PYVER="$2"; shift 2;;
    --org)        ORG="$2"; shift 2;;
    --branch)     BRANCH="$2"; shift 2;;
    --desc)       DESC="$2"; shift 2;;
    --target)     TARGET="$2"; shift 2;;
    --no-docs)    WITH_DOCS=0; shift;;
    --no-infra)   WITH_INFRA=0; shift;;
    --no-ci)      WITH_CI=0; shift;;
    --no-lock)    NO_LOCK=1; shift;;
    --dry-run)    DRY_RUN=1; shift;;
    --force)      FORCE=1; shift;;
    --skip-existing) SKIP_EXISTING=1; shift;;
    -h|--help)    usage; exit 0;;
    *) echo "unknown option: $1" >&2; usage; exit 2;;
  esac
done

[[ -z "$PACKAGE" || -z "$PROJECT_NAME" ]] && { echo "ERROR: --package and --name are required." >&2; usage; exit 2; }
[[ "$PACKAGE" =~ ^[a-z_][a-z0-9_]*$ ]] || { echo "ERROR: package must be a valid lowercase python identifier." >&2; exit 2; }
case "$ARCHETYPE" in service|library|pipeline|cli|docs-only) ;; *) echo "ERROR: unknown archetype '$ARCHETYPE'." >&2; exit 2;; esac
[[ -z "$SLUG" ]] && SLUG="$(echo "$PACKAGE" | tr '_' '-')"
PYVER_NODOT="${PYVER//./}"

[[ "$DRY_RUN" -eq 1 ]] && echo "DRY RUN — gap analysis only, no files written." || true
echo "Scaffolding '$PROJECT_NAME' (package: $PACKAGE, slug: $SLUG, archetype: $ARCHETYPE) into: $TARGET"
echo "  pillars: docs=$WITH_DOCS infra=$WITH_INFRA ci=$WITH_CI  python=$PYVER branch=$BRANCH"
echo "  legend: '+ create' = missing (gap)   '= keep' = already present"

# ---- helpers --------------------------------------------------------------
# esc VALUE : escape a string for safe use as a sed s/// replacement (| delimiter).
esc() { printf '%s' "$1" | sed -e 's/[&|\\]/\\&/g'; }

# render SRC DEST : substitute placeholders from SRC, write to DEST (no-clobber aware).
render() {
  local src="$1" dst="$2"
  [[ -f "$src" ]] || { echo "  MISSING TEMPLATE: $src" >&2; exit 1; }
  if [[ "$DRY_RUN" -eq 1 ]]; then
    [[ -e "$dst" ]] && echo "  = keep   ${dst#"$TARGET"/}" || echo "  + create ${dst#"$TARGET"/}"
    return 0
  fi
  mkdir -p "$(dirname "$dst")"
  if [[ -e "$dst" ]]; then
    if [[ "$FORCE" -eq 1 ]]; then :
    elif [[ "$SKIP_EXISTING" -eq 1 ]]; then echo "  skip (exists): ${dst#"$TARGET"/}"; return 0
    else
      read -r -p "  overwrite ${dst#"$TARGET"/}? [y/N] " a
      [[ "${a:-N}" =~ ^[Yy]$ ]] || { echo "  kept existing"; return 0; }
    fi
  fi
  if ! sed -e "s|<<PACKAGE>>|$(esc "$PACKAGE")|g" \
           -e "s|<<PROJECT_NAME>>|$(esc "$PROJECT_NAME")|g" \
           -e "s|<<PROJECT_SLUG>>|$(esc "$SLUG")|g" \
           -e "s|<<PYTHON_VERSION_NODOT>>|$(esc "$PYVER_NODOT")|g" \
           -e "s|<<PYTHON_VERSION>>|$(esc "$PYVER")|g" \
           -e "s|<<GITHUB_ORG>>|$(esc "$ORG")|g" \
           -e "s|<<DEFAULT_BRANCH>>|$(esc "$BRANCH")|g" \
           -e "s|<<DESCRIPTION>>|$(esc "$DESC")|g" \
           -e "s|<<YEAR>>|$(esc "$YEAR")|g" \
           "$src" > "$dst.tmp"; then
    echo "  RENDER FAILED: $src" >&2; rm -f "$dst.tmp"; exit 1
  fi
  mv "$dst.tmp" "$dst"
  echo "  wrote ${dst#"$TARGET"/}"
}

pyinit() { # create a package dir with an __init__.py if absent
  local dir="$1" body="${2:-}"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    [[ -f "$TARGET/$dir/__init__.py" ]] && echo "  = keep   $dir/__init__.py" || echo "  + create $dir/__init__.py"
    return 0
  fi
  mkdir -p "$TARGET/$dir"
  [[ -f "$TARGET/$dir/__init__.py" ]] || printf '%s' "$body" > "$TARGET/$dir/__init__.py"
}

# ---- 1. root config files -------------------------------------------------
render "$TPL/root/pyproject.toml.tmpl"            "$TARGET/pyproject.toml"
render "$TPL/root/ruff.toml.tmpl"                 "$TARGET/ruff.toml"
render "$TPL/root/mypy.ini.tmpl"                  "$TARGET/mypy.ini"
render "$TPL/root/pytest.ini"                     "$TARGET/pytest.ini"
render "$TPL/root/dot-coveragerc"                 "$TARGET/.coveragerc"
render "$TPL/root/dot-pre-commit-config.yaml"     "$TARGET/.pre-commit-config.yaml"
render "$TPL/root/dot-gitignore"                  "$TARGET/.gitignore"
render "$TPL/root/dot-importlinter.tmpl"          "$TARGET/.importlinter"
render "$TPL/root/Makefile.tmpl"                  "$TARGET/Makefile"
render "$TPL/root/sonar-project.properties.tmpl"  "$TARGET/sonar-project.properties"
render "$TPL/root/VERSION"                         "$TARGET/VERSION"
render "$TPL/root/LICENSE"                         "$TARGET/LICENSE"

# ---- 2. project docs ------------------------------------------------------
render "$TPL/project/README.md.tmpl"          "$TARGET/README.md"
render "$TPL/project/INSTALL.md.tmpl"         "$TARGET/INSTALL.md"
render "$TPL/project/CONTRIBUTING.md.tmpl"    "$TARGET/CONTRIBUTING.md"
render "$TPL/project/CODE_OF_CONDUCT.md.tmpl" "$TARGET/CODE_OF_CONDUCT.md"
render "$TPL/project/CHANGELOG.md.tmpl"       "$TARGET/CHANGELOG.md"

# ---- 3. top-level package skeleton (NO src/) ------------------------------
pyinit "$PACKAGE" "\"\"\"$PROJECT_NAME.\"\"\"

__version__ = \"0.1.0\"
"
# Layers depend on archetype: a library has no entrypoints; everything else does.
LAYERS="domain adapters services"
[[ "$ARCHETYPE" != "library" && "$ARCHETYPE" != "docs-only" ]] && LAYERS="$LAYERS entrypoints"
for layer in $LAYERS; do pyinit "$PACKAGE/$layer"; done
for layer in domain adapters services; do pyinit "$PACKAGE/commons/$layer"; done
pyinit "$PACKAGE/commons"

# Runnable archetypes get a console entry point so `python -m <pkg>` works on day one.
if [[ "$ARCHETYPE" != "library" && "$ARCHETYPE" != "docs-only" ]]; then
  main="$TARGET/$PACKAGE/__main__.py"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    [[ -e "$main" ]] && echo "  = keep   $PACKAGE/__main__.py" || echo "  + create $PACKAGE/__main__.py"
  else
  [[ -e "$main" && "$FORCE" -ne 1 ]] || cat > "$main" <<EOF
"""Console entry point for $PROJECT_NAME — \`python -m $PACKAGE\`."""


def main() -> None:
    """Replace this stub with the real entry point for your archetype.

    service  -> start the web app (e.g. uvicorn) from entrypoints/
    cli      -> dispatch to entrypoints/cli.py
    pipeline -> trigger/serve the orchestrator
    """
    print("$PROJECT_NAME — replace this entry point (see $PACKAGE/entrypoints/).")


if __name__ == "__main__":
    main()
EOF
  echo "  wrote $PACKAGE/__main__.py"
  fi
fi
# Pipeline archetype: a separate deployable DAGs package (a top-level dags/ package).
if [[ "$ARCHETYPE" == "pipeline" ]]; then
  pyinit "${PACKAGE}_dags" "\"\"\"Airflow DAGs for $PROJECT_NAME (separate deployable unit).\"\"\"
"
  [[ "$DRY_RUN" -eq 0 ]] && echo "  ${PACKAGE}_dags/ ready (add DAG modules; imports from $PACKAGE)"
fi

# ---- 4. tests -------------------------------------------------------------
render "$TPL/tests/conftest.py"             "$TARGET/tests/conftest.py"
render "$TPL/tests/unit/test_smoke.py"      "$TARGET/tests/unit/test_smoke.py"
render "$TPL/tests/feature/example.feature" "$TARGET/tests/feature/example.feature"
render "$TPL/tests/feature/test_example.py" "$TARGET/tests/feature/test_example.py"
pyinit "tests"; pyinit "tests/unit"; pyinit "tests/feature"
pyinit "tests/e2e"; pyinit "tests/integration"
[[ "$DRY_RUN" -eq 0 ]] && mkdir -p "$TARGET/tests/test_data"

# ---- 5. agentic layer -----------------------------------------------------
render "$TPL/agentic/AGENTS.md.tmpl"  "$TARGET/AGENTS.md"
render "$TPL/agentic/MEMORY.md.tmpl"  "$TARGET/.claude/memory/MEMORY.md"
# Blank skeletons live under _templates/; epic-planning copies them into epics/<name>/ on demand.
# EPIC.md = the shaped bet + decisions (frozen); PLAN.md = the derived, clarity-gated plan.
render "$TPL/agentic/EPIC.md.tmpl"    "$TARGET/.claude/memory/_templates/EPIC.md"
render "$TPL/agentic/PLAN.md.tmpl"    "$TARGET/.claude/memory/_templates/PLAN.md"
render "$TPL/agentic/task.md.tmpl"    "$TARGET/.claude/memory/_templates/task.md"
# CLAUDE.md is a SYMLINK to AGENTS.md (decision D8) — single source of truth.
if [[ "$DRY_RUN" -eq 1 ]]; then
  if [[ -L "$TARGET/CLAUDE.md" ]]; then echo "  = keep   CLAUDE.md (symlink)"
  elif [[ -e "$TARGET/CLAUDE.md" ]]; then echo "  ! CLAUDE.md exists but is NOT a symlink — would need reconciling (D8)"
  else echo "  + create CLAUDE.md -> AGENTS.md (symlink)"; fi
else
  mkdir -p "$TARGET/.claude/memory/epics"
  if [[ -L "$TARGET/CLAUDE.md" || ! -e "$TARGET/CLAUDE.md" ]]; then
    ln -sf AGENTS.md "$TARGET/CLAUDE.md"; echo "  symlinked CLAUDE.md -> AGENTS.md"
  else
    echo "  WARNING: CLAUDE.md exists and is not a symlink — leaving it (see references/agentic-setup.md)"
  fi
fi

# ---- 6. docs pillar (Antora) ----------------------------------------------
if [[ "$WITH_DOCS" -eq 1 ]]; then
  render "$TPL/docs/antora-playbook.yml.tmpl"       "$TARGET/docs/antora-playbook.yml"
  render "$TPL/docs/antora-playbook.local.yml.tmpl" "$TARGET/docs/antora-playbook.local.yml"
  render "$TPL/docs/antora.yml.tmpl"                "$TARGET/docs/antora.yml"
  render "$TPL/docs/package.json.tmpl"              "$TARGET/docs/package.json"
  while IFS= read -r f; do
    rel="${f#"$TPL"/docs/}"; render "$f" "$TARGET/docs/$rel"
  done < <(find "$TPL/docs/modules" "$TPL/docs/supplemental-ui" -type f)
fi

# ---- 7. infra pillar ------------------------------------------------------
if [[ "$WITH_INFRA" -eq 1 ]]; then
  render "$TPL/infra/compose.yaml.tmpl"             "$TARGET/infra/compose.yaml"
  render "$TPL/infra/docker/Dockerfile.tmpl"        "$TARGET/infra/docker/Dockerfile"
  render "$TPL/infra/docker/Dockerfile.dockerignore" "$TARGET/infra/docker/Dockerfile.dockerignore"
  render "$TPL/infra/scripts/entrypoint.sh"         "$TARGET/infra/scripts/entrypoint.sh"
  chmod +x "$TARGET/infra/scripts/entrypoint.sh" 2>/dev/null || true
  render "$TPL/infra/env.example"                   "$TARGET/infra/.env.example"
  render "$TPL/infra/secrets.example"               "$TARGET/infra/.secrets.example"
fi

# ---- 8. CI pillar ---------------------------------------------------------
if [[ "$WITH_CI" -eq 1 ]]; then
  render "$TPL/ci/ci.yaml.tmpl" "$TARGET/.github/workflows/ci.yaml"
  [[ "$WITH_DOCS" -eq 1 ]] && render "$TPL/ci/docs.yaml.tmpl" "$TARGET/.github/workflows/docs.yaml"
  # _reusable-tests.yml is opt-in (large projects only) — see references/ci-and-infra.md
fi

# ---- 9. lockfile ----------------------------------------------------------
# Generate poetry.lock so `make install`, the Docker COPY, and CI caching all work.
if [[ "$DRY_RUN" -eq 1 ]]; then
  cat <<EOF

DRY RUN complete — nothing was written. Lines marked '+ create' are the gaps to close.
To apply only the missing pieces (never overwriting your files):
  $0 -p $PACKAGE -n "$PROJECT_NAME" -a $ARCHETYPE --skip-existing
For per-file migrations (strip [tool.*], lift src/ → top-level, reconcile AGENTS/CLAUDE),
see references/modernizing-existing-projects.md.
EOF
  exit 0
fi
if [[ "$NO_LOCK" -eq 0 ]] && command -v poetry >/dev/null 2>&1; then
  echo "  running poetry lock ..."
  ( cd "$TARGET" && poetry lock >/dev/null 2>&1 ) && echo "  wrote poetry.lock" \
    || echo "  NOTE: poetry lock failed — run 'make lock' manually before 'make install'"
else
  echo "  NOTE: skipped poetry lock — run 'make lock' before 'make install'"
fi

cat <<EOF

Done. Next steps:
  1. cd "$TARGET" && make lock      # if poetry.lock was not generated above
  2. make install                   # installs dev,test,lint groups
  3. make check-all                 # lint + types + architecture + tests should be green
  4. Install the Meaningfy skillery (+ ponytail) so the AGENTS.md skill routing resolves:
       /plugin marketplace add meaningfy-ws/skillery
       /plugin install meaningfy-engineering meaningfy-ai-coding
       /plugin install superpowers@claude-plugins-official
       /plugin marketplace add DietrichGebert/ponytail && /plugin install ponytail@ponytail
  5. Work the Definition-of-Done in references/checklists.md, then shape your first EPIC
     (.claude/memory/epics/<name>/EPIC.md) and derive its PLAN.md (epic-planning + clarity-gate).
EOF
