# Antora Documentation Pillar

How to stand up the documentation pillar for a Meaningfy project: the Antora pieces, the
Diátaxis information architecture, diagram/search extensions, the build workflow, and API-reference
autogeneration. Templates live under `assets/templates/docs/`. For prose conventions (style,
clarity checks) defer to the **`technical-writing`** skill — this reference only covers the
*scaffold*.

## 1. Antora piece inventory

A docs site is a small number of well-defined files. Know what each one does before editing it.

| Piece | File(s) | Role |
|-------|---------|------|
| **Playbook (production)** | `docs/antora-playbook.yml` | Site-level config: title, content source (the git branch), UI bundle, extensions. Used by CI and `make build-docs`. |
| **Playbook (local)** | `docs/antora-playbook.local.yml` | Same, but content source = the working tree (`./..`, `HEAD`, `worktrees: true`). No remote fetch → fast preview. |
| **Component descriptor** | `docs/antora.yml` | Names the component (`name: <slug>`), its title, version (`'~'` = unversioned), `start_page`, AsciiDoc attributes, and the `nav` reference. |
| **Navigation** | `docs/modules/ROOT/nav.adoc` | The left-hand menu tree, as nested `xref:` lists. One bullet per page. |
| **Content** | `docs/modules/ROOT/pages/**/*.adoc` | The actual pages. `images/`, `partials/`, `examples/`, `attachments/` siblings hold assets. |
| **Supplemental UI** | `docs/supplemental-ui/` | Branding layered on the default UI bundle: `ui.yml` (static files), `partials/*.hbs` (header/footer), `css/site.css` (brand tweaks), `img/`. |
| **Node manifest** | `docs/package.json` (or repo root) | Pins Antora + the Mermaid and Lunr extensions; `build` script. |

> **Playbook vs component descriptor.** The *playbook* is the site (one per build, picks UI +
> extensions + which content to pull). The *component descriptor* (`antora.yml`) is the content
> (one per docs source, defines the component's identity and nav). Don't confuse them.

## 2. Diátaxis information architecture

Pages live under `modules/ROOT/pages/` in folders that map to the
[Diátaxis](https://diataxis.fr) quadrants plus three Meaningfy-specific buckets. Each page has
exactly one job — keep tutorials free of reference detail, keep reference free of narrative.

| Quadrant / bucket | Folder | What goes there |
|-------------------|--------|-----------------|
| Tutorials (learning) | `pages/tutorials/` | Step-by-step first-run lessons (`getting-started.adoc`). |
| How-to (tasks) | `pages/how-to/` | Goal-oriented recipes: "how do I X". |
| Reference (information) | `pages/reference/` | API docs (autogen from OpenAPI), config/CLI reference. |
| Explanation (understanding) | `pages/architecture/` | C4 views, conceptual model, spines, the *why*. |
| Requirements | `pages/requirements/` | Requirement specs and use cases. |
| ADRs | `pages/adr/` | Architecture Decision Records (Nygard format; see ADR-0001). |
| User guide | `pages/user-guide/` | End-user/operator task guides for the running system. |

The landing page (`pages/index.adoc`) links out to each bucket. Mirror these folders in
`nav.adoc`. When a bucket is irrelevant to an archetype (e.g. a library has no user guide), drop
the folder *and* its nav entry.

## 3. Mermaid + Lunr extensions

Both are wired in the playbook's `antora.extensions` block and pinned in `package.json`.

- **Mermaid** (`@sntke/antora-mermaid-extension`) renders `[mermaid]` blocks client-side. The
  `script_stem: header-scripts` + `start_on_load: true` config injects the loader. Use it for C4
  context diagrams, sequence diagrams, flowcharts (see `architecture/system-context.adoc`).
- **Lunr** (`@antora/lunr-extension`) builds a static full-text search index. The supplemental-ui
  `header-content.hbs` renders the search box when `SITE_SEARCH_PROVIDER` is set; set it at build
  time (e.g. `SITE_SEARCH_PROVIDER=lunr npx antora …`) for the box to appear.

Pin both extensions (and `antora` / `@antora/site-generator`) to exact versions in `package.json`
to keep builds reproducible.

## 4. Local preview vs production build

| | Local | Production |
|---|-------|-----------|
| Playbook | `antora-playbook.local.yml` | `antora-playbook.yml` |
| Content source | working tree (`./..`, `HEAD`, worktrees) | git branch (`<<DEFAULT_BRANCH>>`) |
| Speed | fast (no clone) | slower (fetches the branch) |
| Used by | `make preview-docs` | CI / `make build-docs` |

Both write to `docs/build/site/`. The local playbook shows *uncommitted* edits — ideal while
writing. The production playbook only sees what is pushed, so CI builds exactly what readers get.

## 5. Make targets

The doc targets are **live** in the root `Makefile` (rendered from `Makefile.tmpl`). Standard set:

| Target | Does |
|--------|------|
| `make install-antora` | `npm install` Antora + the Mermaid and Lunr extensions (first run). |
| `make build-docs` | `npx antora docs/antora-playbook.yml` → `docs/build/site/`. |
| `make preview-docs` | Build with the local playbook and serve at `http://localhost:8080`. |
| `make clean-docs` | Remove `docs/build/`. |
| `make update-api-docs` | Regenerate the API reference from the service's OpenAPI schema (see §6). |

CI calls these targets (never inline `npx`), so "green locally" equals "green in CI".

## 6. API-reference autogeneration from OpenAPI

Never hand-write endpoint docs — generate them so they cannot drift from the code. This mirrors the
reference project's pattern:

1. **Export the schema.** A `make openapi` target dumps the service's OpenAPI schema(s) to
   `resources/` (a FastAPI app exposes `app.openapi()`; a small `export_openapi` script writes the
   JSON).
2. **Render AsciiDoc.** A `make api-docs` target runs the `openapitools/openapi-generator-cli`
   `asciidoc` generator over each schema into `docs/modules/ROOT/pages/api-docs/<api>/`, optionally
   with a custom template dir for house style.
3. **Pull into the docs repo.** When docs live in a separate repo, a `make update-api-docs` target
   there clones the service at the target branch, runs its `api-docs` target, and copies the result
   in (then strips generator scratch files like `.openapi-generator/`).

```bash
make openapi          # service repo: schema → resources/
make api-docs         # service repo: AsciiDoc → docs/.../api-docs/
make update-api-docs  # docs repo: clone service, regenerate, copy in
```

Add the generated `api-docs/` subtree to `.gitignore` and regenerate in CI, **or** commit it
deliberately and add a CI "codegen check" that regenerates and fails on a diff. Either way: never
edit generated pages by hand. Link to them from `nav.adoc` and `reference/index.adoc`.

## 7. GitHub Pages deployment

The **CI agent owns the deploy workflow** (`docs.yaml`) — this skill only scaffolds the content.
The workflow is thin: on a push touching `docs/` (and on the default branch), it calls
`make build-docs` and publishes `docs/build/site/` to GitHub Pages. The `.nojekyll` static file
(declared in `supplemental-ui/ui.yml`) is required so Pages serves Antora's `_/` asset paths
verbatim. See `references/ci-and-infra.md` for the workflow itself.

## 8. Wiring a new page

Adding a page is a three-step ritual; miss any one and Antora silently drops it:

1. **Create** the `.adoc` under the right IA folder, e.g.
   `modules/ROOT/pages/how-to/rotate-credentials.adoc`, with a `= Title` first line.
2. **Reference** it from `nav.adoc` with an `xref:` under the matching section:
   `** xref:how-to/rotate-credentials.adoc[Rotate credentials]`.
3. **Cross-link** it from related pages with `xref:` so readers can navigate laterally, not only
   through the menu.

Use page-relative `xref:` paths within the ROOT module (Antora resolves them against `pages/`).
Cross-component links use the `<component>::<path>` form. Images referenced with `image::name.png[]`
resolve against `imagesdir` (set to `images` in `antora.yml`).

## 9. Common pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| Page builds but is missing from the menu | Not listed in `nav.adoc` | Add the `xref:` bullet. |
| `xref` renders red (unresolved) | Wrong path or missing target page | Check the path is relative to `pages/`. |
| Mermaid block shows as raw text | Extension not installed / not in playbook | `make install-antora`; confirm the `antora.extensions` block. |
| Search box absent | `SITE_SEARCH_PROVIDER` unset at build | Build with `SITE_SEARCH_PROVIDER=lunr`. |
| Pages 404 on GitHub Pages assets | Missing `.nojekyll` | Ensure `supplemental-ui/ui.yml` declares it as a static file. |
| Local preview shows stale content | Built with the production playbook | Use `antora-playbook.local.yml` (`make preview-docs`). |

## 10. Authoring conventions (pointer)

For the actual *writing* — page structure, tone, the lightweight clarity check, AsciiDoc idioms —
use the **`technical-writing`** skill. This reference stops at the scaffold; that skill governs the
prose that fills it. Keep terminology aligned with `MEMORY.md` and existing pages.

## File checklist

A scaffolded docs pillar contains, at minimum:

- [ ] `docs/antora-playbook.yml` and `docs/antora-playbook.local.yml`
- [ ] `docs/antora.yml`
- [ ] `docs/package.json` (extensions pinned)
- [ ] `docs/modules/ROOT/nav.adoc`
- [ ] `docs/modules/ROOT/pages/index.adoc` + one page per IA bucket
- [ ] `docs/supplemental-ui/{ui.yml, partials/header-content.hbs, css/site.css}`
- [ ] Make targets uncommented in the root `Makefile`
- [ ] `make build-docs` succeeds on the empty skeleton
