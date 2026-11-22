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
ARCHETYPE="product" ; TARGET="$(pwd)"
WITH_DOCS=1 ; WITH_INFRA=1 ; WITH_CI=1 ; DEPLOYABLE=0
FORCE=0 ; SKIP_EXISTING=0 ; NO_LOCK=0 ; DRY_RUN=0 ; MINIMAL=0 ; NEO4J=0 ; TYPESCRIPT=0
UI_TOOL="none"
# OpenSpec version this skill pins schemas against (kept in sync with openspec/openspec-version.txt).
OPENSPEC_PIN="1.4.1"

usage() {
  cat <<'EOF'
Usage: scaffold.sh -p PACKAGE -n "PROJECT NAME" [options]

Required:
  -p, --package NAME     top-level Python package (e.g. myproject) — NO src/
  -n, --name "NAME"      human project title (e.g. "My Project")

Options:
  -s, --slug SLUG        repo/kebab slug          (default: derived from package)
  -a, --archetype TYPE   product|library|doc-only  (default: product)
                         legacy aliases service|pipeline|cli -> product
      --deployable       this repo ships a deployable artifact -> CD TODO stub (ci-cd-delivery)
      --neo4j            project the PINNED gen-neo4j-constraints/gen-neomodel generators into
                          scripts/ (product + LinkML only — see references/spine-projection.md)
      --linkml-generators DIR  the linkml-engineering skill's scripts/linkml_neo4j/ folder
                         (default: $LINKML_NEO4J_DIR, else the sibling skill in a source checkout)
      --typescript       add typescript to .serena/project.yml language_servers (also set when
                         a frontend/ folder exists in the target)
      --ui-tool TOOL     playwright|cypress|none  (default: none; product only) record the UI tool:
                         its config, make target and the AGENTS.md line (rules: the ui-testing skill).
                         TypeScript with --typescript or a frontend/ folder, else Python (Playwright)
      --python VER       Python version           (default: 3.12)
      --org ORG          GitHub org               (default: meaningfy-ws)
      --branch BRANCH    default/PR branch        (default: develop)
      --desc "TEXT"      one-line description      (default: "")
      --target DIR       repo root to scaffold     (default: current directory)
      --minimal          MINIMAL mode: write ONLY the agentic files (AGENTS.md + CLAUDE.md pointer),
                         the .claude/ layout, and print the install commands. Nothing else.
      --no-docs          skip the Antora docs pillar
      --no-infra         skip the Docker/infra pillar
      --no-ci            skip the GitHub Actions pillar
      --no-lock          do not run `uv lock` after scaffolding
      --dry-run          report a gap analysis (+ create / = keep) and write NOTHING
      --force            overwrite existing files without asking
      --skip-existing    keep existing files, no prompt (non-interactive)
  -h, --help             show this help

Modes:
  greenfield   empty repo            scaffold.sh -p pkg -n "Name"
  minimal      agentic files only    scaffold.sh -p pkg -n "Name" --minimal
  gap report   existing repo, audit  scaffold.sh -p pkg -n "Name" --dry-run
  fill gaps    existing repo, apply  scaffold.sh -p pkg -n "Name" --skip-existing
For the full modernization (brownfield) workflow see references/modernizing-existing-projects.md.
For what the spine projection lays down see references/spine-projection.md.
After running, see SKILL.md "Before you hand over" for the Definition-of-Done.
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
    --deployable) DEPLOYABLE=1; shift;;
    --neo4j)      NEO4J=1; shift;;
    --typescript) TYPESCRIPT=1; shift;;
    --ui-tool)    UI_TOOL="$2"; shift 2;;
    --linkml-generators) LINKML_NEO4J_DIR="$2"; shift 2;;
    --minimal)    MINIMAL=1; shift;;
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
# Archetypes: product | library | doc-only. Legacy aliases (service/pipeline/cli) collapse to product.
case "$ARCHETYPE" in
  service|pipeline|cli) ARCHETYPE="product";;
  product|library|doc-only|docs-only) ;;
  *) echo "ERROR: unknown archetype '$ARCHETYPE' (use product|library|doc-only)." >&2; exit 2;;
esac
[[ "$ARCHETYPE" == "docs-only" ]] && ARCHETYPE="doc-only"   # tolerate the older spelling
# Derived flags: product gets code layers + a model/; doc-only is non-code.
PRODUCT=0 ; CODE=1
[[ "$ARCHETYPE" == "product" ]] && PRODUCT=1
[[ "$ARCHETYPE" == "doc-only" ]] && CODE=0
[[ -z "$SLUG" ]] && SLUG="$(echo "$PACKAGE" | tr '_' '-')"
PYVER_NODOT="${PYVER//./}"
# Serena language servers: python always; typescript when asked for or a frontend/ folder exists.
SERENA_EXTRA=""
if [[ "$TYPESCRIPT" -eq 1 || -d "$TARGET/frontend" ]]; then SERENA_EXTRA="- typescript"; fi

# UI tool (design D-6): the language is TypeScript under the same trigger as Serena, else Python.
# Cypress is always JavaScript. Fragments are inserted into the Makefile, pyproject and AGENTS.md.
case "$UI_TOOL" in
  none|playwright|cypress) ;;
  *) echo "ERROR: unknown --ui-tool '$UI_TOOL' (use playwright|cypress|none)." >&2; exit 2;;
esac
[[ "$UI_TOOL" != "none" && "$ARCHETYPE" != "product" ]] && { echo "ERROR: --ui-tool needs the product archetype." >&2; exit 2; }
UI_LANG="" ; UI_NAME="" ; UI_DIR="." ; UI_PY_DEPS_FILE="" ; UI_MAKE_FILE="" ; UI_LINE=""
if [[ "$UI_TOOL" != "none" ]]; then
  [[ -d "$TARGET/frontend" ]] && UI_DIR="frontend"
  UI_TMP="$(mktemp -d)"; trap 'rm -rf "$UI_TMP"' EXIT
  if [[ "$UI_TOOL" == "cypress" ]]; then
    UI_NAME="Cypress" ; UI_LANG="JavaScript" ; UI_MAKE_SRC="$TPL/ui/Makefile-cypress.tmpl"
  elif [[ -n "$SERENA_EXTRA" ]]; then
    UI_NAME="Playwright" ; UI_LANG="TypeScript" ; UI_MAKE_SRC="$TPL/ui/Makefile-playwright-node.tmpl"
  else
    UI_NAME="Playwright" ; UI_LANG="Python" ; UI_MAKE_SRC="$TPL/ui/Makefile-playwright-python.tmpl"
    UI_PY_DEPS_FILE="$TPL/ui/pyproject-playwright-deps.tmpl"
  fi
  [[ -f "$UI_MAKE_SRC" ]] || { echo "  MISSING TEMPLATE: $UI_MAKE_SRC" >&2; exit 1; }
  sed -e "s|<<UI_DIR>>|$UI_DIR|g" "$UI_MAKE_SRC" > "$UI_TMP/Makefile.ui"
  UI_MAKE_FILE="$UI_TMP/Makefile.ui"
  UI_LINE="UI tests: $UI_NAME ($UI_LANG)"
fi

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
      if [[ ! -t 0 ]]; then
        echo "  ${dst#"$TARGET"/} exists and there is no terminal to ask: re-run with --skip-existing or --force" >&2
        exit 1
      fi
      read -r -p "  overwrite ${dst#"$TARGET"/}? [y/N] " a
      [[ "${a:-N}" =~ ^[Yy]$ ]] || { echo "  kept existing"; return 0; }
    fi
  fi
  # The UI placeholders sit alone on a line: replaced by a fragment or a line, else the line goes.
  local ui_sed=() m f
  for m in UI_PY_DEPS UI_MAKE_TARGETS; do
    [[ "$m" == "UI_PY_DEPS" ]] && f="$UI_PY_DEPS_FILE" || f="$UI_MAKE_FILE"
    if [[ -n "$f" ]]; then ui_sed+=(-e "/^<<$m>>\$/{" -e "r $f" -e "d" -e "}"); else ui_sed+=(-e "/^<<$m>>\$/d"); fi
  done
  if [[ -n "$UI_LINE" ]]; then ui_sed+=(-e "s|^<<UI_TESTS_LINE>>\$|- $(esc "$UI_LINE")|")
  else ui_sed+=(-e "/^<<UI_TESTS_LINE>>\$/d"); fi
  if ! sed "${ui_sed[@]}" \
           -e "s|<<PACKAGE>>|$(esc "$PACKAGE")|g" \
           -e "s|<<PROJECT_NAME>>|$(esc "$PROJECT_NAME")|g" \
           -e "s|<<PROJECT_SLUG>>|$(esc "$SLUG")|g" \
           -e "s|<<PYTHON_VERSION_NODOT>>|$(esc "$PYVER_NODOT")|g" \
           -e "s|<<PYTHON_VERSION>>|$(esc "$PYVER")|g" \
           -e "s|<<GITHUB_ORG>>|$(esc "$ORG")|g" \
           -e "s|<<DEFAULT_BRANCH>>|$(esc "$BRANCH")|g" \
           -e "s|<<DESCRIPTION>>|$(esc "$DESC")|g" \
           -e "s|<<YEAR>>|$(esc "$YEAR")|g" \
           -e "s|<<SERENA_EXTRA_SERVERS>>|$(esc "$SERENA_EXTRA")|g" \
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

# keepdir REL [NOTE] : ensure an (otherwise empty) directory exists, with a .gitkeep so it commits.
keepdir() {
  local rel="$1" note="${2:-}"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    [[ -d "$TARGET/$rel" ]] && echo "  = keep   $rel/" || echo "  + create $rel/"
    return 0
  fi
  mkdir -p "$TARGET/$rel"
  [[ -e "$TARGET/$rel/.gitkeep" ]] || printf '%s' "$note" > "$TARGET/$rel/.gitkeep"
}

# scaffold_agentic : the agentic layer. AGENTS.md is the canonical, CLI-agnostic instruction file;
# CLAUDE.md is a thin pointer that imports it (@AGENTS.md). Both are REGULAR files — never a
# symlink. An existing symlink in either name is reported for reconciliation, never replaced.
# The .claude/ memory is a regenerable INDEX — the truth is openspec/specs/ (so we DO NOT render
# the retired EPIC/PLAN/task forms here).
scaffold_agentic() {
  local f
  for f in AGENTS.md CLAUDE.md; do
    if [[ -L "$TARGET/$f" ]]; then
      if [[ "$DRY_RUN" -eq 1 ]]; then echo "  ! $f is a symlink — would need reconciling (references/agentic-setup.md)"
      else echo "  WARNING: $f is a symlink — leaving it; reconcile by hand (see references/agentic-setup.md)"; fi
    else
      render "$TPL/agentic/$f.tmpl" "$TARGET/$f"
    fi
  done
  render "$TPL/agentic/MEMORY.md.tmpl"  "$TARGET/.claude/memory/MEMORY.md"
  keepdir ".claude/skills"  "Project-specific skills only — do NOT vendor the skillery here."
  keepdir ".claude/agents"  "Optional thin local agent wrappers — usually rely on installed skillery agents."
}

# scaffold_openspec : project the spine (openspec/) — config, the PINNED meaningfy schema,
# durable specs/, and changes/ (+ archive/, with the inputs/ seed convention).
scaffold_openspec() {
  render "$TPL/openspec/config.yaml.tmpl"      "$TARGET/openspec/config.yaml"
  render "$TPL/openspec/specs-README.md.tmpl"  "$TARGET/openspec/specs/README.md"
  render "$TPL/openspec/changes-README.md.tmpl" "$TARGET/openspec/changes/README.md"
  keepdir "openspec/changes/archive" "Archived (completed) changes land here after /opsx:archive."
  # Copy the meaningfy schema PINNED from this skill's assets (skillery's openspec/schemas/meaningfy
  # links here; the pin is OPENSPEC_PIN, kept in sync with skillery's openspec/openspec-version.txt).
  local schema_src="$SCRIPT_DIR/../assets/openspec-schema/meaningfy"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    [[ -d "$TARGET/openspec/schemas/meaningfy" ]] \
      && echo "  = keep   openspec/schemas/meaningfy/ (pinned @ $OPENSPEC_PIN)" \
      || echo "  + create openspec/schemas/meaningfy/ (pinned @ $OPENSPEC_PIN, copied from the skill)"
  elif [[ -d "$schema_src" ]]; then
    local schema_dst="$TARGET/openspec/schemas/meaningfy"
    if [[ -d "$schema_dst" && "$FORCE" -ne 1 ]]; then
      # Never clobber in place and never nest meaningfy/meaningfy/. Default and
      # --skip-existing both leave an existing pinned schema untouched.
      echo "  skip (exists): openspec/schemas/meaningfy/ (re-run with --force to refresh; never clobbered in place)"
    else
      [[ -d "$schema_dst" ]] && rm -rf "$schema_dst"   # --force: clean replace, not copy-into-dir
      mkdir -p "$TARGET/openspec/schemas"
      cp -R "$schema_src" "$schema_dst"
      echo "  copied openspec/schemas/meaningfy/ (PINNED @ $OPENSPEC_PIN — refresh via --force; see references/spine-projection.md)"
    fi
  else
    echo "  NOTE: meaningfy schema not found in the skill ($schema_src) — reinstall project-setup."
  fi
}

# scaffold_neo4j_generators : project the PINNED gen-neo4j-constraints/gen-neomodel
# generators, shipped by the linkml-engineering skill in its scripts/linkml_neo4j/, into scripts/.
# An installed skill lives in its own plugin folder, so the caller passes that folder
# (--linkml-generators or LINKML_NEO4J_DIR); a source checkout finds the sibling skill. Only
# meaningful for a product using LinkML with a Neo4j target (--neo4j); see
# references/spine-projection.md.
scaffold_neo4j_generators() {
  local gen_src="${LINKML_NEO4J_DIR:-$SCRIPT_DIR/../../linkml-engineering/scripts/linkml_neo4j}"
  local gen_dst="$TARGET/scripts"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    [[ -d "$gen_dst" && -f "$gen_dst/gen_neo4j_constraints.py" ]] \
      && echo "  = keep   scripts/gen_neo4j_constraints.py, scripts/gen_neomodel.py (pinned)" \
      || echo "  + create scripts/gen_neo4j_constraints.py, scripts/gen_neomodel.py (pinned, copied from skillery)"
  elif [[ -d "$gen_src" ]]; then
    mkdir -p "$gen_dst"
    for f in gen_neo4j_constraints.py gen_neomodel.py; do
      if [[ -f "$gen_dst/$f" && "$FORCE" -ne 1 ]]; then
        echo "  skip (exists): scripts/$f (re-run with --force to refresh; never clobbered in place)"
      else
        cp "$gen_src/$f" "$gen_dst/$f"
        echo "  copied scripts/$f (PINNED — refresh via --force; see references/spine-projection.md)"
      fi
    done
  else
    echo "  NOTE: linkml-engineering generators not found ($gen_src) — pass --linkml-generators <the linkml-engineering skill's scripts/linkml_neo4j/>."
  fi
}

# ---- minimal mode: agentic files + .claude/ layout only -------------------
if [[ "$MINIMAL" -eq 1 ]]; then
  echo "MINIMAL mode — agentic files (AGENTS.md + CLAUDE.md pointer) + .claude/ layout only."
  scaffold_agentic
  cat <<EOF

Minimal scaffold complete. Install the spine + skillery so AGENTS.md's routing resolves:
  npx -y @fission-ai/openspec@$OPENSPEC_PIN init --tools claude --profile core
  /plugin marketplace add meaningfy-ws/skillery#releases
  /plugin install meaningfy-core@meaningfy-skillery
  /plugin install meaningfy-building@meaningfy-skillery
  /plugin install superpowers@claude-plugins-official
  /plugin marketplace add DietrichGebert/ponytail && /plugin install ponytail@ponytail
For the full repo scaffold (package, tooling, openspec/, docs, CI) re-run without --minimal.
EOF
  exit 0
fi

# ---- 1. root config files -------------------------------------------------
render "$TPL/root/pyproject.toml.tmpl"            "$TARGET/pyproject.toml"
render "$TPL/root/ruff.toml.tmpl"                 "$TARGET/ruff.toml"
render "$TPL/root/mypy.ini.tmpl"                  "$TARGET/mypy.ini"
render "$TPL/root/pytest.ini"                     "$TARGET/pytest.ini"
render "$TPL/root/dot-coveragerc"                 "$TARGET/.coveragerc"
render "$TPL/root/dot-pre-commit-config.yaml"     "$TARGET/.pre-commit-config.yaml"
render "$TPL/root/dot-gitignore"                  "$TARGET/.gitignore"
render "$TPL/root/dot-semgrepignore"              "$TARGET/.semgrepignore"
render "$TPL/root/dot-serena-project.yml.tmpl"    "$TARGET/.serena/project.yml"
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
# SECURITY.md (coordinated disclosure) for code archetypes — content owned by meaningfy-release.
[[ "$CODE" -eq 1 ]] && render "$TPL/root/SECURITY.md.tmpl" "$TARGET/SECURITY.md"
# Shared-check scripts and tool checksums (D-1): code archetypes only; `make quality-tools` reads them.
[[ "$CODE" -eq 1 ]] && render "$TPL/quality/tools.sha256"        "$TARGET/scripts/quality/tools.sha256"
[[ "$CODE" -eq 1 ]] && render "$TPL/quality/external_sources.py" "$TARGET/scripts/quality/external_sources.py"

# ---- 3. top-level package skeleton (NO src/) ------------------------------
# doc-only repos carry no Python package, no tests, no model.
if [[ "$CODE" -eq 1 ]]; then
pyinit "$PACKAGE" "\"\"\"$PROJECT_NAME.\"\"\"

__version__ = \"0.1.0\"
"
# Layers depend on archetype: a library has no entrypoints; a product has the full four.
LAYERS="domain adapters services"
[[ "$ARCHETYPE" != "library" ]] && LAYERS="$LAYERS entrypoints"
for layer in $LAYERS; do pyinit "$PACKAGE/$layer"; done
for layer in domain adapters services; do pyinit "$PACKAGE/commons/$layer"; done
pyinit "$PACKAGE/commons"

# Conditional model/ (R5): the PRODUCT archetype scaffolds a LinkML model dir + the
# generate-models bridge. The model SOURCE and `make generate-models` are owned by the
# conceptual-modelling skill — project-setup only lays down the home and a seed schema.
if [[ "$PRODUCT" -eq 1 ]]; then
  keepdir "model" "LinkML conceptual model lives here. \`make generate-models\` renders targets (Pydantic, JSON Schema, OWL, SHACL). Owned by the conceptual-modelling skill."
  schema_seed="$TARGET/model/schema.yaml"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    [[ -e "$schema_seed" ]] && echo "  = keep   model/schema.yaml" || echo "  + create model/schema.yaml (LinkML seed)"
  elif [[ -e "$schema_seed" && "$FORCE" -ne 1 ]]; then
    [[ "$SKIP_EXISTING" -eq 1 ]] && echo "  skip (exists): model/schema.yaml" || echo "  kept existing model/schema.yaml"
  else
    cat > "$schema_seed" <<EOF
# LinkML conceptual model for $PROJECT_NAME (the living, representation-agnostic domain source).
# Edit the model HERE; never hand-edit generated targets. \`make generate-models\` renders
# Pydantic / JSON Schema / OWL / SHACL deterministically (outside the LLM path).
# Source choice (LinkML default vs model2owl) is an explicit decision — see the
# conceptual-modelling skill. Replace this seed with the real domain model.
id: https://w3id.org/$ORG/$SLUG
name: $SLUG
description: Conceptual model for $PROJECT_NAME.
prefixes:
  linkml: https://w3id.org/linkml/
default_range: string
imports:
  - linkml:types
classes:
  Thing:
    description: Replace with the first real domain entity.
EOF
    echo "  wrote model/schema.yaml (LinkML seed — see conceptual-modelling)"
  fi
fi

# Runnable products get a console entry point so `python -m <pkg>` works on day one.
if [[ "$ARCHETYPE" == "product" ]]; then
  main="$TARGET/$PACKAGE/__main__.py"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    [[ -e "$main" ]] && echo "  = keep   $PACKAGE/__main__.py" || echo "  + create $PACKAGE/__main__.py"
  else
  [[ -e "$main" && "$FORCE" -ne 1 ]] || cat > "$main" <<EOF
"""Console entry point for $PROJECT_NAME — \`python -m $PACKAGE\`."""


def main() -> None:  # pragma: no cover - stub; drop the pragma when you replace it
    """Replace this stub with the real entry point.

    service  -> start the web app (e.g. uvicorn) from entrypoints/
    cli      -> dispatch to entrypoints/cli.py
    pipeline -> trigger/serve the orchestrator
    """
    print("$PROJECT_NAME — replace this entry point (see $PACKAGE/entrypoints/).")


if __name__ == "__main__":  # pragma: no cover
    main()
EOF
  echo "  wrote $PACKAGE/__main__.py"
  fi
fi
fi  # CODE

# ---- 4. tests -------------------------------------------------------------
if [[ "$CODE" -eq 1 ]]; then
render "$TPL/tests/conftest.py"             "$TARGET/tests/conftest.py"
render "$TPL/tests/changed.py"              "$TARGET/tests/changed.py"
render "$TPL/tests/unit/test_smoke.py"      "$TARGET/tests/unit/test_smoke.py"
render "$TPL/tests/feature/example.feature" "$TARGET/tests/feature/example.feature"
render "$TPL/tests/feature/test_example.py" "$TARGET/tests/feature/test_example.py"
pyinit "tests"; pyinit "tests/unit"; pyinit "tests/feature"
pyinit "tests/e2e"; pyinit "tests/integration"
[[ "$DRY_RUN" -eq 0 ]] && mkdir -p "$TARGET/tests/test_data" "$TARGET/tests/manual"
[[ "$DRY_RUN" -eq 0 ]] && : > "$TARGET/tests/manual/.gitkeep"
fi

# ---- 4b. UI tool (--ui-tool): config files; the Makefile, pyproject and AGENTS.md lines render above/below
if [[ "$UI_TOOL" != "none" ]]; then
  echo "  UI tool: $UI_NAME, language detected: $UI_LANG$([[ "$UI_LANG" != "Python" && "$UI_DIR" == "frontend" ]] && echo ' (frontend/ found: files go there)' || true)"
  if [[ "$UI_LANG" == "Python" ]]; then
    render "$TPL/ui/e2e-conftest.py.tmpl" "$TARGET/tests/e2e/conftest.py"
  else
    if [[ "$UI_TOOL" == "cypress" ]]; then
      render "$TPL/ui/cypress.config.js.tmpl" "$TARGET/$UI_DIR/cypress.config.js"
    else
      render "$TPL/ui/playwright.config.ts.tmpl" "$TARGET/$UI_DIR/playwright.config.ts"
    fi
    # An existing package.json is never touched: name the dependencies to add instead.
    ui_pkg_src="$TPL/ui/package-$UI_TOOL.json.tmpl"
    if [[ -e "$TARGET/$UI_DIR/package.json" ]]; then
      deps="$(sed -n 's/^    "\([^"]*\)": "\([^"]*\)",\{0,1\}$/\1@\2/p' "$ui_pkg_src" | paste -sd' ' -)"
      echo "  WARNING: $UI_DIR/package.json exists: left untouched. Add these devDependencies: $deps"
    else
      render "$ui_pkg_src" "$TARGET/$UI_DIR/package.json"
    fi
  fi
fi

# ---- 5. agentic layer (AGENTS.md canonical) + spine (openspec/) ---------------
scaffold_agentic
scaffold_openspec
[[ "$PRODUCT" -eq 1 && "$NEO4J" -eq 1 ]] && scaffold_neo4j_generators

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
# CI runs only the light set as make targets (openspec validate --strict, lint, check-bindings);
# the heavy checks run locally through `make check-all`, in parallel. clarity-gate is NOT a CI step
# (human/agent semantic gate) — CI may only emit a reminder. See references/ci-and-infra.md.
if [[ "$WITH_CI" -eq 1 ]]; then
  # CI is a light lint for every archetype: the spec check and the linters (references/ci-and-infra.md).
  if [[ "$CODE" -eq 1 ]]; then
    render "$TPL/ci/ci.yaml.tmpl" "$TARGET/.github/workflows/ci.yaml"
  else
    render "$TPL/ci/ci-doc-only.yaml.tmpl" "$TARGET/.github/workflows/ci.yaml"
  fi
  [[ "$WITH_DOCS" -eq 1 ]] && render "$TPL/ci/docs.yaml.tmpl" "$TARGET/.github/workflows/docs.yaml"
  # _reusable-tests.yml is opt-in (large projects only) — see references/ci-and-infra.md
fi

# ---- 8b. CD seam (deployable products only) -------------------------------
# R10: a deployable repo gets the CD/release templates owned by ci-cd-delivery — but per its §6,
# only AFTER DevOps ratification. Until then: a clearly-marked TODO stub + the boundary docs.
# Library / doc-only get no deploy workflow.
if [[ "$DEPLOYABLE" -eq 1 && "$ARCHETYPE" == "product" ]]; then
  render "$TPL/ci/deploy.yaml.stub.tmpl" "$TARGET/.github/workflows/deploy.yaml"
  [[ "$DRY_RUN" -eq 0 ]] && echo "  NOTE: deploy.yaml is a CD STUB (pending DevOps §6 ratification) — render the real template via the ci-cd-delivery skill."
fi

# ---- 8c. Release seam (library archetype) ---------------------------------
# A library publishes to PyPI via release-please + Trusted Publishing (OIDC). Content owned by the
# meaningfy-release skill; unlike the deploy seam it has no external (DevOps §6) block, so the real
# template is rendered. Needs a one-time PyPI/TestPyPI Trusted Publisher + a `release` GH environment.
if [[ "$WITH_CI" -eq 1 && "$ARCHETYPE" == "library" ]]; then
  render "$TPL/ci/release.yml.tmpl" "$TARGET/.github/workflows/release.yaml"
  [[ "$DRY_RUN" -eq 0 ]] && echo "  NOTE: release.yaml needs a one-time PyPI Trusted Publisher + 'release' environment — see the meaningfy-release skill."
fi

# ---- 9. lockfile ----------------------------------------------------------
# Generate uv.lock so `make install`, the Docker COPY, and CI caching all work.
if [[ "$DRY_RUN" -eq 1 ]]; then
  cat <<EOF

DRY RUN complete — nothing was written. Lines marked '+ create' are the gaps to close.
To apply only the missing pieces (never overwriting your files):
  $0 -p $PACKAGE -n "$PROJECT_NAME" -a $ARCHETYPE --skip-existing
For per-file migrations (strip [tool.*], lift src/ → top-level, reconcile AGENTS/CLAUDE),
see references/modernizing-existing-projects.md. For brownfield-as-a-shaped-change, see
references/modernizing-existing-projects.md; for the spine projection, references/spine-projection.md.
EOF
  exit 0
fi
if [[ "$NO_LOCK" -eq 1 ]]; then
  echo "  NOTE: skipped uv lock (--no-lock); run 'make lock' before 'make install'"
elif ! command -v uv >/dev/null 2>&1; then
  echo "  NOTE: uv is not installed (https://docs.astral.sh/uv/getting-started/installation/); install it, then run 'make lock' before 'make install'"
else
  echo "  running uv lock ..."
  ( cd "$TARGET" && uv lock >/dev/null ) && echo "  wrote uv.lock" \
    || echo "  NOTE: uv lock failed — run 'make lock' manually before 'make install'"
fi

cat <<EOF

Done. Next steps:
  1. cd "$TARGET" && make lock      # if uv.lock was not generated above
  2. make install                   # installs all dependency groups
  3. make check-all                 # lint + types + architecture + tests should be green
  4. Install the OpenSpec /opsx:* commands (core profile) so the spine is drivable:
       npx -y @fission-ai/openspec@$OPENSPEC_PIN init --tools claude --profile core
     (the meaningfy schema under openspec/schemas/meaningfy/ is already PINNED @ $OPENSPEC_PIN)
  5. Install the Meaningfy skillery (+ ponytail) so AGENTS.md's skill routing resolves:
       /plugin marketplace add meaningfy-ws/skillery#releases
       /plugin install meaningfy-core@meaningfy-skillery
       /plugin install meaningfy-building@meaningfy-skillery
       /plugin install superpowers@claude-plugins-official
       /plugin marketplace add DietrichGebert/ponytail && /plugin install ponytail@ponytail
  6. Work the Definition-of-Done in SKILL.md "Before you hand over", then shape your first EPIC with
     /opsx:propose -> openspec/changes/<id>/proposal.md (EPIC) + design.md/tasks.md (PLAN);
     gate the PLAN with clarity-gate (≥9/10) before /opsx:apply.
EOF
