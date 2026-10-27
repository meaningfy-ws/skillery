"""Bundle renderer — the one reader of ``bundles.yaml`` (single-source-distribution D4).

``bundles.yaml`` + ``agents/`` frontmatter + ``VERSION`` are the inputs; it renders
``.claude-plugin/marketplace.json``, the ``bundles/`` copy tree and
``tools/opencode-catalogue.json``, and gates them for drift.
"""
