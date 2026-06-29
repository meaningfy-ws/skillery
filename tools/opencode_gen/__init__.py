"""opencode tree generator — emits the `.opencode/` distribution from source.

Mirrors ``tools/repo_lint``: a thin read layer feeds pure functions; ``__main__``
is the entrypoint. The single sources of authority are ``skills/``, ``agents/``,
``.claude-plugin/marketplace.json`` and ``VERSION`` — nothing in the generated
tree is ever read back as input (single-source-of-authority, EPIC DEC-1/DEC-6).
"""
