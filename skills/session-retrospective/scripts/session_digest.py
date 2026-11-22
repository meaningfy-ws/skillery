#!/usr/bin/env python3
"""Digest Claude Code transcripts into small JSONL tables for self-reflection.

Reads ~/.claude/projects/*/<session>.jsonl and their subagents/agent-*.jsonl, writes:
  sessions.jsonl  one row per session: repo, title, times, tokens, cost, epics, skills, PRs
  agents.jsonl    one row per subagent: type, description, full prompt, time, tokens, report
  events.jsonl    the timeline: prompts, skills, dispatches, commands, questions, file edits

Usage: session_digest.py [--days 14] [--out DIR] [--root ~/.claude/projects]
--out defaults to ~/.cache/session-retrospective/<date>; a folder inside a git working tree is refused (exit 2).
Stdlib only. Read-only on the transcripts.

Time is split three ways. LLM time: from the record before a response to its last content block.
Local time: from a tool call to its result (it includes any permission prompt and any sleep or
polling loop). Waiting on the person: AskUserQuestion duration plus the idle gap before each prompt.

Known glitches this script is built around:
- A transcript logs one API response once per content block; usage is counted once per message id.
- The Langfuse plugin can send a long turn with background subagents twice, and may drop spans of a
  very large turn (5 s send cap). So this script reads the local transcripts, not Langfuse. Anyone
  counting in Langfuse must count distinct `tool_id`, not spans.
- Langfuse has no cost (no model prices); the cost here is Claude Code's own `cost-state` record.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import time
from collections import Counter
from datetime import datetime
from pathlib import Path

EPIC_RE = re.compile(r"openspec/changes/(?:archive/(?:\d{4}-\d{2}-\d{2}-)?)?([a-z0-9][a-z0-9-]+)")
NOT_EPICS = {"archive"}
WRAPPERS = {"uv", "poetry", "npx", "pipx", "sudo", "time", "timeout", "run", "exec", "python", "python3", "-m"}
FILE_TOOLS = {"Read", "Edit", "Write", "NotebookEdit"}
MARK_RE = re.compile(r"^[-*\s`]*mark: change=([a-z0-9][a-z0-9-]*) phase=(shape|plan|deliver) stage=(\d+|-)( risk=recorded)?`?\s*$")
MARK_BAD_RE = re.compile(r"^[-*\s`]*mark:")
RESULT_RE = re.compile(r"^[-*\s`]*result: stage=(\S+) role=(tester|reviewer|checker)( \w[\w-]*=\S+)+`?\s*$")
KV_RE = re.compile(r"(\w[\w-]*)=(\S+)")
UNKNOWN_THRESHOLD = 0.01
# Record types the script reads, plus those seen in real transcripts (types only) and skipped on purpose.
HANDLED_TYPES = {"ai-title", "pr-link", "cost-state", "system", "assistant", "user", "api-request", "attachment"}
SKIPPED_TYPES = {"last-prompt", "mode", "permission-mode", "session-owner", "atis-latch", "file-history-snapshot",
                 "file-history-delta", "api-request-shape", "api-request-blob", "tools-used", "queue-operation",
                 "relocated", "worktree-state", "frame-link", "artifact-comment-monitor",
                 "artifact-autoreact-ledger", "fork-context-ref"}
KNOWN_TYPES = HANDLED_TYPES | SKIPPED_TYPES


def ts(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00")).timestamp() if s else None


def command_head(cmd):
    """'cd x && FOO=1 uv run pytest -q tests' -> 'pytest'; 'git commit -m ..' -> 'git commit'."""
    for seg in re.split(r"&&|;|\|\||\n", cmd):
        toks = [t for t in seg.split() if "=" not in t.split("/")[0] or t.startswith("-")]
        while toks and (toks[0] in WRAPPERS or toks[0].isdigit()):
            toks = toks[1:]
        if not toks or toks[0] in ("cd", "export", "source", "set"):
            continue
        head = toks[0].rsplit("/", 1)[-1]
        nxt = toks[1] if len(toks) > 1 else ""
        return f"{head} {nxt}" if head in ("git", "gh", "make", "npm", "openspec", "docker") and re.match(r"^[a-z]", nxt) else head
    return "(cd only)"


def user_text(content):
    if isinstance(content, str):
        return content
    if isinstance(content, list) and not any(b.get("type") == "tool_result" for b in content):
        return "\n".join(b.get("text", "") for b in content if b.get("type") == "text")
    return None


def lines_outside_fences(text):
    """The lines of a text that are not inside a ``` or ~~~ fenced block (D-1, D-3)."""
    fence = ""  # the opening fence's character; only the same character closes it
    for line in text.splitlines():
        head = line.lstrip()[:3]
        if head in ("```", "~~~"):
            fence = "" if fence == head[0] else fence or head[0]
        elif not fence:
            yield line


def well_formed(r, typ, unknown):
    """F5/DEC-8: an assistant or user record of the wrong shape is counted as (malformed) and skipped.
    Non-dict blocks of a list are dropped and counted; the rest of the record is kept."""
    m = r.get("message")
    content = m.get("content") if isinstance(m, dict) else None
    ok_content = content is None or isinstance(content, list) or (typ == "user" and isinstance(content, str))
    if not (isinstance(m, dict) and ok_content and r.get("timestamp") and isinstance(m.get("usage") or {}, dict)):
        unknown["(malformed)"] += 1
        return False
    if isinstance(content, list):
        m["content"] = [b for b in content if isinstance(b, dict)]
        unknown["(malformed)"] += len(content) - len(m["content"])
    return True


def parse_stream(path, session, agent=""):
    """One transcript file -> (stats dict, list of events)."""
    st = {"calls": 0, "in": 0, "cache_write": 0, "cache_read": 0, "out": 0, "first_ctx": 0, "max_ctx": 0,
          "models": Counter(), "first": None, "last": None, "turn_s": 0.0, "compactions": 0, "cwd": "",
          "title": "", "prs": set(), "cost": {}, "api_s": {}, "tool_s": {}, "prompt": "", "report": "",
          "epics": Counter(), "branches": Counter(), "lines": 0, "unknown": Counter(), "assistants": 0}
    events, pending, seen_msgs, epic, llm_event, llm_start = [], {}, set(), "", None, None

    def guess_epics(blob):  # the path guess only; the report applies the lead's mark (D-2)
        nonlocal epic
        for e in EPIC_RE.findall(blob):
            if e not in NOT_EPICS:
                epic = e
                st["epics"][e] += 1

    def read_lines(t, text, marks):
        """Mark lines (lead text only) and result lines of one text; the full text, before any truncation."""
        for line in lines_outside_fences(text):
            if marks and (m := MARK_RE.match(line)):
                emit(t, "mark", m.group(1), line.strip(), phase=m.group(2), stage=m.group(3))
            elif marks and MARK_BAD_RE.match(line):
                emit(t, "mark-bad", text=line.strip())
            elif RESULT_RE.match(line):
                kv = {k: v.strip("`\"'") for k, v in KV_RE.findall(line)}
                emit(t, "result", kv["role"], line.strip(), stage=kv["stage"], kv=kv)

    def emit(t, kind, name="", text="", dur=None, err=False, limit=300, **extra):
        events.append({"ts": t, "session": session, "agent": agent, "kind": kind, "name": name,
                       "dur_s": None if dur is None else round(dur, 1), "err": err, "epic": epic,
                       "branch": branch, "text": text[:limit], **extra})

    with open(path, encoding="utf-8", errors="replace") as fh:
        for line in fh:
            st["lines"] += 1
            if line.startswith('{"type":"api-request') or line.startswith('{"type":"attachment"'):
                continue  # request blobs repeat the conversation; not needed
            try:
                r = json.loads(line)
            except ValueError:
                st["unknown"]["(unparseable)"] += 1
                continue
            if not isinstance(r, dict):
                st["unknown"]["(unparseable)"] += 1
                continue
            typ, t, branch = r.get("type"), r.get("timestamp"), r.get("gitBranch", "")
            if typ not in KNOWN_TYPES:
                st["unknown"][typ or "(no type)"] += 1
            if typ in ("assistant", "user") and not well_formed(r, typ, st["unknown"]):
                continue
            before = st["last"]  # timestamp of the previous record: start of an LLM call or of an idle gap
            if t:
                st["first"] = st["first"] or t
                st["last"] = t
            if branch:
                st["branches"][branch] += 1
            st["cwd"] = st["cwd"] or r.get("cwd", "")
            if typ == "ai-title":
                st["title"] = r.get("aiTitle", "")
            elif typ == "pr-link":
                st["prs"].add(f'{r.get("prRepository")}#{r.get("prNumber")}')
            elif typ == "cost-state":  # cumulative per process start; keep the max per start
                k = r.get("startTime")
                st["cost"][k] = max(st["cost"].get(k, 0), r.get("totalCostUSD", 0))
                st["api_s"][k] = max(st["api_s"].get(k, 0), r.get("totalAPIDuration", 0) / 1000)
                st["tool_s"][k] = max(st["tool_s"].get(k, 0), r.get("totalToolDuration", 0) / 1000)
            elif typ == "system":
                if r.get("subtype") == "turn_duration":
                    st["turn_s"] += r.get("durationMs", 0) / 1000
                elif r.get("subtype") == "compact_boundary":
                    st["compactions"] += 1
                    emit(t, "compact")
            elif typ == "assistant":
                st["assistants"] += 1
                m = r.get("message", {})
                for b in m.get("content") or []:  # before the llm event, so the call that writes a mark is filed under it
                    if b.get("type") == "text":
                        read_lines(t, b.get("text", ""), not agent)
                u, mid = m.get("usage"), m.get("id")
                if u and mid not in seen_msgs:  # one API call is logged once per content block
                    seen_msgs.add(mid)
                    ctx = u.get("input_tokens", 0) + u.get("cache_creation_input_tokens", 0) + u.get("cache_read_input_tokens", 0)
                    st["calls"] += 1
                    st["in"] += u.get("input_tokens", 0)
                    st["cache_write"] += u.get("cache_creation_input_tokens", 0)
                    st["cache_read"] += u.get("cache_read_input_tokens", 0)
                    st["out"] += u.get("output_tokens", 0)
                    st["first_ctx"] = st["first_ctx"] or ctx
                    st["max_ctx"] = max(st["max_ctx"], ctx)
                    st["models"][m.get("model", "?")] += 1
                    llm_start = before or t
                    emit(t, "llm", m.get("model", "?"), dur=ts(t) - ts(llm_start), tin=u.get("input_tokens", 0),
                         cw=u.get("cache_creation_input_tokens", 0), cr=u.get("cache_read_input_tokens", 0), out=u.get("output_tokens", 0))
                    llm_event = events[-1]
                elif u and t and llm_event:  # a later content block of the same response: the call ran until here
                    llm_event["dur_s"] = round(ts(t) - ts(llm_start), 1)
                for b in m.get("content") or []:
                    if b.get("type") == "text" and b.get("text", "").strip():
                        st["report"] = b["text"]
                    elif b.get("type") == "tool_use" and b.get("id") not in pending:
                        pending[b["id"]] = (t, b.get("name", ""), b.get("input") or {})
            elif typ == "user":
                content = r.get("message", {}).get("content")
                txt = user_text(content)
                if txt is not None:
                    if r.get("isMeta") or not txt.strip():
                        continue
                    guess_epics(txt)
                    if agent and not st["prompt"]:
                        st["prompt"] = txt
                    elif "<command-name>" in txt:
                        emit(t, "slash", re.search(r"<command-name>([^<]*)", txt).group(1))
                    elif not txt.lstrip().startswith("<"):
                        emit(t, "prompt", text=txt, limit=2000, idle_s=round(ts(t) - ts(before)) if before else 0)
                    continue
                for b in content or []:
                    if b.get("type") != "tool_result" or b.get("tool_use_id") not in pending:
                        continue
                    t0, name, inp = pending.pop(b["tool_use_id"])
                    blob = json.dumps(inp)
                    guess_epics(blob)
                    if not agent:  # a lead's result lines in a PR body or a body file (D-3)
                        cmd = inp.get("command", "")
                        if name == "Bash" and re.search(r"gh pr (create|edit)", cmd):
                            read_lines(t0, cmd, False)
                        elif name in ("Write", "Edit"):
                            read_lines(t0, inp.get("content") or inp.get("new_string") or "", False)
                    dur = (ts(t) - ts(t0)) if t and t0 else None
                    err = bool(b.get("is_error"))
                    if name == "Bash":
                        cmd = inp.get("command", "")
                        emit(t0, "bash", command_head(cmd), cmd, dur, err)
                    elif name == "Skill":
                        emit(t0, "skill", inp.get("skill", ""), inp.get("args", "") or "", dur, err)
                    elif name == "Agent":
                        emit(t0, "dispatch", inp.get("subagent_type", "") or "general-purpose", inp.get("description", ""), dur, err)
                    elif name == "AskUserQuestion":
                        qs = " | ".join(q.get("question", "") for q in inp.get("questions", []))
                        emit(t0, "ask", str(len(inp.get("questions", []))), qs, dur, err, 600)
                    elif name in FILE_TOOLS:
                        emit(t0, "file", name, inp.get("file_path", ""), dur, err)
                    else:
                        emit(t0, "tool", name, blob, dur, err, 200)
    return st, events


def repo_of(cwd, fallback):
    """The git root's folder name; for a worktree, the main repository (D-7)."""
    if not cwd:
        return fallback
    here = Path(cwd)
    if not here.is_dir():  # a removed worktree
        return Path(cwd.split("/.claude/worktrees/")[0]).name if "/.claude/worktrees/" in cwd else here.name
    for d in (here, *here.parents):
        g = d / ".git"
        if g.is_dir():
            return d.name
        if g.is_file():
            m = re.search(r"gitdir:\s*(.+?)/\.git/worktrees/", g.read_text(errors="replace"))
            return Path(m.group(1)).name if m else d.name
    return here.name


def tokens(st):
    return {k: st[k] for k in ("calls", "in", "cache_write", "cache_read", "out", "first_ctx", "max_ctx")}


def warn_drift(lines, unknown, no_usage, any_cost, sessions):
    """D-6: warn on stderr when the transcript format seems to have moved; the output is still written."""
    n = sum(unknown.values())
    if lines and n / lines > UNKNOWN_THRESHOLD:
        types = ", ".join(f"{k}={v}" for k, v in unknown.most_common())
        print(f"warning: unknown records {n} of {lines} lines ({100 * n / lines:.1f}%, threshold 1%): {types}", file=sys.stderr)
    for sid in no_usage:
        print(f"warning: session {sid[:8]} has assistant records and no usage", file=sys.stderr)
    if sessions and not any_cost:
        print("warning: no session has a cost-state record", file=sys.stderr)


def fresh(path):
    """Open an output file for writing; a symlink there is replaced, never followed."""
    path.unlink(missing_ok=True)
    return open(path, "w", encoding="utf-8")


def digest(root, out, days):
    cutoff = time.time() - days * 86400
    out.mkdir(parents=True, exist_ok=True)
    out.chmod(0o700)  # the digest holds private text
    n, lines, unknown, no_usage, any_cost = 0, 0, Counter(), [], False
    with fresh(out / "sessions.jsonl") as fs, fresh(out / "agents.jsonl") as fa, fresh(out / "events.jsonl") as fe:
        for path in sorted(root.glob("*/*.jsonl")):
            sub_files = sorted((path.parent / path.stem).rglob("agent-*.jsonl"))
            if max(f.stat().st_mtime for f in [path, *sub_files]) < cutoff:
                continue
            sid = path.stem
            st, events = parse_stream(path, sid)
            if not st["first"]:
                continue
            repo = repo_of(st["cwd"], path.parent.name)
            sub_tot = Counter()
            streams = [st]
            for sf in sub_files:
                aid = sf.stem.removeprefix("agent-")
                a, aev = parse_stream(sf, sid, aid)
                meta_f = sf.with_suffix(".meta.json")
                try:
                    meta = json.loads(meta_f.read_text()) if meta_f.exists() else {}
                except ValueError:
                    meta = {}
                if not isinstance(meta, dict):
                    meta = {}
                if not meta and meta_f.exists():  # corrupt (an empty valid file is not worth a warning)
                    a["unknown"]["(malformed)"] += 1
                events += aev
                streams.append(a)
                st["epics"].update(a["epics"])
                sub_tot.update(tokens(a))
                kinds = Counter(e["kind"] for e in aev)
                fa.write(json.dumps({
                    "session": sid, "repo": repo, "agent": aid, "type": meta.get("agentType", ""),
                    "description": meta.get("description", ""), "depth": meta.get("spawnDepth"),
                    "model": a["models"].most_common(1)[0][0] if a["models"] else "",
                    "start": a["first"], "end": a["last"],
                    "dur_s": round(ts(a["last"]) - ts(a["first"]), 1) if a["first"] else None,
                    **tokens(a), "tool_calls": sum(kinds.values()) - kinds["llm"],"bash": kinds["bash"], "files": kinds["file"],
                    "epic": a["epics"].most_common(1)[0][0] if a["epics"] else "",
                    "prompt_chars": len(a["prompt"]), "report_chars": len(a["report"]),
                    "prompt": a["prompt"], "report": a["report"][:1500]}) + "\n")
            for e in sorted(events, key=lambda e: e["ts"] or ""):
                e["repo"] = repo
                fe.write(json.dumps(e) + "\n")
            main_ev = [e for e in events if not e["agent"]]
            fs.write(json.dumps({
                "session": sid, "repo": repo, "title": st["title"], "start": st["first"], "end": st["last"],
                "wall_s": round(ts(st["last"]) - ts(st["first"])), "turn_s": round(st["turn_s"]),
                "api_s": round(sum(st["api_s"].values())), "tool_s": round(sum(st["tool_s"].values())),
                "ask_wait_s": round(sum(e["dur_s"] or 0 for e in main_ev if e["kind"] == "ask")),
                # main thread only; parallel tool calls overlap, so llm+local+ask+idle can exceed wall_s
                "llm_s": round(sum(e["dur_s"] or 0 for e in main_ev if e["kind"] == "llm")),
                "local_s": round(sum(e["dur_s"] or 0 for e in main_ev if e["kind"] in ("bash", "file", "tool", "skill"))),
                "idle_s": round(sum(e.get("idle_s", 0) for e in main_ev if e["kind"] == "prompt")),
                "sub_llm_s": round(sum(e["dur_s"] or 0 for e in events if e["agent"] and e["kind"] == "llm")),
                "sub_local_s": round(sum(e["dur_s"] or 0 for e in events if e["agent"] and e["kind"] in ("bash", "file", "tool", "skill"))),
                "cost_usd": round(sum(st["cost"].values()), 2),
                "prompts": sum(e["kind"] == "prompt" for e in main_ev), "compactions": st["compactions"],
                "main": tokens(st), "subagents": {"count": len(sub_files), **{k: sub_tot[k] for k in ("calls", "in", "cache_write", "cache_read", "out")}},
                "models": dict(st["models"]), "epics": dict(st["epics"].most_common(8)),
                "branches": dict(st["branches"].most_common(8)), "prs": sorted(st["prs"]),
                "skills": dict(Counter(e["name"] for e in events if e["kind"] == "skill")),
                "bash_top": dict(Counter(e["name"] for e in events if e["kind"] == "bash").most_common(12)),
            }) + "\n")
            n += 1
            lines += sum(s["lines"] for s in streams)
            for s in streams:
                unknown.update(s["unknown"])
            if sum(s["assistants"] for s in streams) and not sum(s["calls"] for s in streams):
                no_usage.append(sid)
            any_cost = any_cost or bool(st["cost"])
    warn_drift(lines, unknown, no_usage, any_cost, n)
    return n


def git_root_of(folder):
    """The git working tree holding `folder` (it may not exist yet), or None (D-5)."""
    here = folder.resolve()
    while not here.exists():
        here = here.parent
    env = {k: v for k, v in os.environ.items() if not k.startswith("GIT_")}  # GIT_DIR and friends would hide a tree
    try:
        r = subprocess.run(["git", "-C", str(here), "rev-parse", "--show-toplevel"], capture_output=True, text=True, env=env)
        top = Path(r.stdout.strip()) if r.returncode == 0 else None
    except FileNotFoundError:  # no git on the path
        top = None
    # the walk always runs: a folder inside .git/ makes rev-parse fail, but its parent holds the .git entry
    return top or next((d for d in (here, *here.parents) if (d / ".git").exists()), None)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--days", type=float, default=14)
    ap.add_argument("--root", type=Path, default=Path.home() / ".claude/projects")
    ap.add_argument("--out", type=Path, default=Path.home() / ".cache/session-retrospective" / time.strftime("%Y-%m-%d"))
    a = ap.parse_args(argv)
    tree = git_root_of(a.out)
    if tree:
        print(f"output folder is inside a git working tree: {tree}; pass --out outside it", file=sys.stderr)
        sys.exit(2)
    t0 = time.time()
    print(f"{digest(a.root, a.out, a.days)} sessions -> {a.out} in {time.time() - t0:.0f}s")


if __name__ == "__main__":
    main()
