#!/usr/bin/env python3
"""Digest Claude Code transcripts into small JSONL tables for self-reflection.

Reads ~/.claude/projects/*/<session>.jsonl and their subagents/agent-*.jsonl, writes:
  sessions.jsonl  one row per session: repo, title, times, tokens, cost, epics, skills, PRs
  agents.jsonl    one row per subagent: type, description, full prompt, time, tokens, report
  events.jsonl    the timeline: prompts, skills, dispatches, commands, questions, file edits

Usage: session_digest.py [--days 14] [--out DIR] [--root ~/.claude/projects]
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
import re
import time
from collections import Counter
from datetime import datetime
from pathlib import Path

EPIC_RE = re.compile(r"openspec/changes/(?:archive/(?:\d{4}-\d{2}-\d{2}-)?)?([a-z0-9][a-z0-9-]+)")
NOT_EPICS = {"archive"}
WRAPPERS = {"uv", "poetry", "npx", "pipx", "sudo", "time", "timeout", "run", "exec", "python", "python3", "-m"}
FILE_TOOLS = {"Read", "Edit", "Write", "NotebookEdit"}


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


def parse_stream(path, session, agent=""):
    """One transcript file -> (stats dict, list of events)."""
    st = {"calls": 0, "in": 0, "cache_write": 0, "cache_read": 0, "out": 0, "first_ctx": 0, "max_ctx": 0,
          "models": Counter(), "first": None, "last": None, "turn_s": 0.0, "compactions": 0, "cwd": "",
          "title": "", "prs": set(), "cost": {}, "api_s": {}, "tool_s": {}, "prompt": "", "report": "",
          "epics": Counter(), "branches": Counter()}
    events, pending, seen_msgs, epic, llm_event, llm_start = [], {}, set(), "", None, None

    def emit(t, kind, name="", text="", dur=None, err=False, limit=300, **extra):
        events.append({"ts": t, "session": session, "agent": agent, "kind": kind, "name": name,
                       "dur_s": None if dur is None else round(dur, 1), "err": err, "epic": epic,
                       "branch": branch, "text": text[:limit], **extra})

    with open(path, errors="replace") as fh:
        for line in fh:
            if line.startswith('{"type":"api-request') or line.startswith('{"type":"attachment"'):
                continue  # request blobs repeat the conversation; not needed
            try:
                r = json.loads(line)
            except ValueError:
                continue
            typ, t, branch = r.get("type"), r.get("timestamp"), r.get("gitBranch", "")
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
                m = r.get("message", {})
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
                    for e in EPIC_RE.findall(txt):
                        if e not in NOT_EPICS:
                            epic = e
                            st["epics"][e] += 1
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
                    for e in EPIC_RE.findall(blob):
                        if e not in NOT_EPICS:
                            epic = e
                            st["epics"][e] += 1
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
    m = re.search(r"/work/repos/([^/]+)", cwd or "")
    return m.group(1) if m else fallback


def tokens(st):
    return {k: st[k] for k in ("calls", "in", "cache_write", "cache_read", "out", "first_ctx", "max_ctx")}


def digest(root, out, days):
    cutoff = time.time() - days * 86400
    out.mkdir(parents=True, exist_ok=True)
    n = 0
    with open(out / "sessions.jsonl", "w") as fs, open(out / "agents.jsonl", "w") as fa, open(out / "events.jsonl", "w") as fe:
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
            for sf in sub_files:
                aid = sf.stem.removeprefix("agent-")
                a, aev = parse_stream(sf, sid, aid)
                meta_f = sf.with_suffix(".meta.json")
                meta = json.loads(meta_f.read_text()) if meta_f.exists() else {}
                events += aev
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
    return n


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--days", type=float, default=14)
    ap.add_argument("--root", type=Path, default=Path.home() / ".claude/projects")
    ap.add_argument("--out", type=Path, default=Path("session-digest"))
    a = ap.parse_args()
    t0 = time.time()
    print(f"{digest(a.root, a.out, a.days)} sessions -> {a.out} in {time.time() - t0:.0f}s")
