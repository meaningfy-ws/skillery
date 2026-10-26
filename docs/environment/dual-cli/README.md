# Dual-CLI reference annex

**Audience: skillery contributors/maintainers** extending or auditing dual-CLI parity (adding a
skill, keeping the rendered bundle files honest, checking an external dependency's opencode
support). **Not** for installing the catalogue — if that's you, go to
[`docs/environment/setup.md`](../setup.md) (front door: [`README.md`](../../../README.md))
instead; nothing here restates its content.

This folder also physically holds the per-CLI install runbooks
([`setup-claude.md`](setup-claude.md), [`setup-opencode.md`](setup-opencode.md)) and
[`mcp-setup.md`](mcp-setup.md) — but those belong to the install path above and are reached from
there, not from this page.

The contributor-facing contract docs this page indexes:

| If you want to… | Read |
|---|---|
| Understand source → CLI translation (what generates what) | [`mapping.md`](mapping.md) |
| Change bundle membership (or agent frontmatter) | edit `bundles.yaml` / the agent, then `make bundles` (gated by `make validate`) |
| Check an external plugin/skill/MCP server's opencode support | [`compatibility.md`](compatibility.md) |
| See the skill-body CLI-agnosticism audit | [`body-agnosticism-audit.md`](body-agnosticism-audit.md) |
| Understand hook intent → per-CLI binding | [`../../../hooks/README.md`](../../development/hooks.md) |

The authoring rule that ties these together lives in
[`AGENTS.md` → How to maintain / extend](../../../AGENTS.md#how-to-maintain--extend-the-catalogue) —
read that first.
