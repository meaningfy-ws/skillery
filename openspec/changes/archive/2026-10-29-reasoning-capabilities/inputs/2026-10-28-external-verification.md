# External verification — engines, native memory, prior art

Secondary input, never groomed. A research subagent checked the web on 2026-10-28, and I fetched
the TellOnce README myself. Every claim has a URL. Nothing was benchmarked except the spike in
`spike/` (see the synthesis).

## Engines
- **clingo 5.8.2** (2026-08-14), MIT. pip wheels exist for Linux (x86_64, aarch64, i686, ppc64le, musl), macOS (x86_64, arm64) and Windows, and Homebrew has it too. It has an embeddable Python API (`clingo.Control`). It installed in a fresh uv venv with no system packages (spike, 2026-10-28). https://pypi.org/pypi/clingo/json
- **SWI-Prolog**: BSD-2. It installs via apt PPA, Flatpak, Homebrew 10.0.2, or conda-forge (linux-64 only). There is **no pure-pip Prolog**. janus-swi 1.5.3 has wheels only for Windows and elsewhere needs a system swipl ≥ 9.1.12 and a C compiler, and pyswip also needs a system swipl. https://www.swi-prolog.org/license.html, https://pypi.org/project/janus-swi/
- **eclingo**: MIT, but the last push was 2024-12-14 and it has one contributor. It is Linux-only, installs through conda, and is not on PyPI. Treat it as stale. https://github.com/potassco/eclingo

## Elenchus and pyNMMS
- **Elenchus repo** (MIT, 2 stars, last push 2026-01-24): only a 786-line `CLAUDE.md` ("Dialectical Opponent Protocol", obligationes opponent), `setup.sh` (GitHub labels via `gh`), `status.sh`, the README and the licence. **There is no code, agent or skill.** State is kept in labelled GitHub issues. https://github.com/bradleypallen/elenchus
- **arXiv 2603.06974** confirmed (Allen, 2026-03-07): the LLM acts as "a defeasible derivability oracle", the expert resolves tensions, and it is demonstrated on PROV-O and verified with pyNMMS. https://arxiv.org/abs/2603.06974
- **pyNMMS 0.15.1** (2026-09-09): MIT, pure Python, alpha, one author, about 40 test files. It declares Python ≥ 3.10 but CI tests only 3.12 and 3.13. https://github.com/bradleypallen/pyNMMS

## Native memory (what already exists)
- **Claude Code**:
  - CLAUDE.md, plus **auto memory** written by Claude "from your corrections and preferences" (`~/.claude/projects/<p>/memory/MEMORY.md` plus topic files; the first 200 lines or 25KB load).
  - **Path-scoped `.claude/rules/*.md`** (`paths:` frontmatter) and user-wide `~/.claude/rules/`.
  - The docs call both "context, not enforced configuration". https://code.claude.com/docs/en/memory
- **Claude Code hooks**: `UserPromptSubmit`, `SessionStart` and `Stop` can inject context, and plugins ship `hooks/hooks.json`. https://code.claude.com/docs/en/hooks
- **opencode**: AGENTS.md plus an `instructions` glob array. It has **no memory feature**, and its plugin events include `session.idle`. https://opencode.ai/docs/rules/, https://opencode.ai/docs/plugins/
- **Genuinely missing natively**: an approval gate before a rule takes effect, scope by activity (not by file path), override counts, consistency checks, and any memory on opencode.

## Prior art: TellOnce (closest)
- **Paper** (arXiv 2606.13174, June 2026): agents with Mem0 still violated **57.5%** of the preference checks that applied to them. TellOnce turns corrections into "persistent, scoped, and revisable behavioral rules" and cut violations by 19–42 points against PGMem. https://arxiv.org/abs/2606.13174
- **Repo** (MIT, 165 commits, v1.8.3): a Claude Code skill with hooks (also Codex and Copilot variants).
  - A detached worker sends each user turn to the CLI model, which applies mutations `NOOP|UPDATE|SUPERSEDE|SPLIT|NEW|NEEDS_USER|REJECT|ARCHIVE|RESTORE`.
  - "context cannot authorize a rule": a mutation must cite spans of the user's own turn.
  - Storage is local **SQLite**, and rules are injected on `UserPromptSubmit`.
  - **No human approval gate** is described, and the deterministic enforcement layer ships empty.
  - https://github.com/YujunZhou/tellonce
- **Windsurf Cascade** creates memories automatically per workspace, and the user can view them in settings. https://docs.windsurf.com/windsurf/memories
- Vendor-reported failure modes: memory poisoning, overfitting to a transient habit, and long-lived wrong memories.

## NL → formal
- **NL2SHACL-Bench** (arXiv 2608.07530): output is syntactically valid but often semantically wrong on complex patterns. No numbers were found in the abstract. https://arxiv.org/abs/2608.07530
- **ASP-Bench** (arXiv 2602.01171, 128 instances): a ReAct agent with solver feedback solved every instance. https://arxiv.org/abs/2602.01171
- No Prolog-specific benchmark was found.

## Langfuse
- The plugin (MIT, v1.2.2, 2026-10-26) runs as `Stop` and `SessionEnd` hooks and captures prompts, tools, skills, subagents and cost. https://github.com/langfuse/Claude-Observability-Plugin
- Self-hosting needs Postgres, ClickHouse, Redis/Valkey and S3 (MinIO), plus web and worker containers. The Compose setup recommends 4 cores, 16 GiB RAM and about 100 GiB disk. https://langfuse.com/self-hosting/deployment/docker-compose

## Handover claims corrected
- The Elenchus "agent" is a single prompt file, not an agent definition or code.
- Prolog cannot be had by pip install. clingo can.
- eclingo is stale.
- Claude Code *does* learn from corrections (auto memory). It lacks an approval gate.
- Langfuse is heavy to self-host.
- pyNMMS is alpha, from one author, and tested only on Python 3.12 and 3.13.
