#!/usr/bin/env python3
"""Turn session_digest.py output into per-epic and waste-signal tables.

Usage: epic_report.py DIGEST_DIR   (writes epics.tsv, phases.tsv, signals.txt there)

Cost per epic is an ESTIMATE: each session's recorded cost is shared out by weighted tokens
(input 1, cache write 2, cache read 0.1, output 5); the model price difference is ignored.
Phase is a heuristic: the last skill or subagent role seen in that session.
"""
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

D = Path(sys.argv[1])
load = lambda n: [json.loads(l) for l in open(D / n)]
sessions, agents, events = load("sessions.jsonl"), load("agents.jsonl"), load("events.jsonl")

ROLES = [("review", r"review|lens|\bL[1-5]\b|critic"), ("verify", r"verif|check|audit|validat|second|gate|score|cold read"),
         ("build", r"build|implement|fix|stage \d|task \d|write|draft|refactor|migrat"),
         ("explore", r"explor|research|investigat|find|survey|read|inventory|map|analys|diagnos"),
         ("plan", r"plan|shape|design|epic|proposal")]
TYPE_ROLE = {"code-reviewer": "review", "implementer": "build", "Explore": "explore", "Plan": "plan",
             "epic-planner": "plan", "infra-reviewer": "review"}
SKILL_PHASE = [("shape", r"brainstorm|epic-planning|opsx:propose|opsx:explore|openspec-propose|openspec-explore|clarity-gate|test-strategy|bdd-gherkin|architecture|conceptual"),
               ("deliver", r"epic-delivery|opsx:apply|openspec-apply|test-driven|subagent-driven|executing-plans|cosmic-python|debugging"),
               ("review", r"code-review|requesting-code-review|receiving-code-review|verification"),
               ("release", r"release|git-workflow|commit|finishing"),
               ("archive", r"archive|spec-stewardship|opsx:sync|sync-specs")]


def role_of(a):
    t = a["type"].split(":")[-1]
    if t in TYPE_ROLE:
        return TYPE_ROLE[t]
    text = a["description"] + " " + a["prompt"][:300]
    return next((r for r, pat in ROLES if re.search(pat, text, re.I)), "other")


def units(e):
    return e["tin"] + 2 * e["cw"] + 0.1 * e["cr"] + 5 * e["out"]


agent_role = {(a["session"], a["agent"]): role_of(a) for a in agents}
cost = {s["session"]: s["cost_usd"] for s in sessions}
sess_units = Counter()
for e in events:
    if e["kind"] == "llm":
        sess_units[e["session"]] += units(e)

E = defaultdict(lambda: {"usd": 0.0, "main_usd": 0.0, "sub_usd": 0.0, "cr": 0, "cw": 0, "out": 0, "calls": 0, "sessions": set(),
                         "first": "9", "last": "", "bash_s": 0.0, "bash_n": 0, "bash_err": 0, "ask_s": 0.0, "ask_n": 0,
                         "roles": Counter(), "cmd_s": Counter(), "cmd_n": Counter(), "phase_usd": Counter(), "prompts": 0, "compact": 0})
phase, read_paths, cmd_repeat = {}, Counter(), Counter()
for e in events:
    sid = e["session"]
    if not e["agent"] and e["kind"] in ("skill", "slash"):
        phase[sid] = next((p for p, pat in SKILL_PHASE if re.search(pat, e["name"], re.I)), phase.get(sid, "unmarked"))
    key = (e["repo"], e["epic"] or "(no epic)")
    x = E[key]
    x["sessions"].add(sid)
    if e["ts"]:
        x["first"], x["last"] = min(x["first"], e["ts"]), max(x["last"], e["ts"])
    k = e["kind"]
    if k == "llm":
        usd = cost[sid] * units(e) / sess_units[sid] if sess_units[sid] else 0
        x["usd"] += usd
        x["sub_usd" if e["agent"] else "main_usd"] += usd
        x["cr"] += e["cr"]; x["cw"] += e["cw"]; x["out"] += e["out"]; x["calls"] += 1
        ph = phase.get(sid, "unmarked")
        if e["agent"]:
            ph += "/" + agent_role.get((sid, e["agent"]), "other")
        x["phase_usd"][ph] += usd
    elif k == "bash":
        x["bash_s"] += e["dur_s"] or 0; x["bash_n"] += 1; x["bash_err"] += e["err"]
        x["cmd_s"][e["name"]] += e["dur_s"] or 0; x["cmd_n"][e["name"]] += 1
        cmd_repeat[(sid, e["agent"], e["text"])] += 1
    elif k == "ask":
        x["ask_s"] += e["dur_s"] or 0; x["ask_n"] += 1
    elif k == "dispatch" and not e["agent"]:
        pass
    elif k == "prompt":
        x["prompts"] += 1
    elif k == "compact":
        x["compact"] += 1
    elif k == "file" and e["name"] == "Read":
        read_paths[(sid, e["agent"], e["text"])] += 1
for a in agents:
    E[(a["repo"], a["epic"] or "(no epic)")]["roles"][role_of(a)] += 1

rows = sorted(E.items(), key=lambda kv: -kv[1]["usd"])
with open(D / "epics.tsv", "w") as f:
    f.write("repo\tepic\tfirst\tlast\tsessions\test_usd\tmain_usd\tsub_usd\tcalls\tcache_read_M\tcache_write_M\tout_M\tprompts\tcompactions\t"
            "bash_n\tbash_h\tbash_err\task_n\task_wait_h\tagents\troles\ttop_cmds_by_time\n")
    for (repo, epic), x in rows:
        cmds = "; ".join(f"{c} {x['cmd_n'][c]}x {s / 60:.0f}m" for c, s in x["cmd_s"].most_common(5))
        f.write("\t".join(map(str, [repo, epic, x["first"][:10], x["last"][:10], len(x["sessions"]), round(x["usd"]), round(x["main_usd"]),
                                    round(x["sub_usd"]), x["calls"], round(x["cr"] / 1e6), round(x["cw"] / 1e6, 1), round(x["out"] / 1e6, 2),
                                    x["prompts"], x["compact"], x["bash_n"], round(x["bash_s"] / 3600, 1), x["bash_err"], x["ask_n"],
                                    round(x["ask_s"] / 3600, 1), sum(x["roles"].values()), dict(x["roles"].most_common()), cmds])) + "\n")
with open(D / "phases.tsv", "w") as f:
    f.write("repo\tepic\tphase\test_usd\n")
    for (repo, epic), x in rows:
        for ph, usd in x["phase_usd"].most_common():
            if usd >= 1:
                f.write(f"{repo}\t{epic}\t{ph}\t{usd:.0f}\n")

with open(D / "signals.txt", "w") as f:
    p = lambda *a: print(*a, file=f)
    tot = sum(cost.values())
    p(f"TOTAL recorded cost ${tot:.0f} over {len(sessions)} sessions, {len(agents)} subagents")
    ph = Counter()
    for _, x in rows:
        ph.update(x["phase_usd"])
    p("\nEST. COST BY PHASE/ROLE (all repos)")
    for k, v in ph.most_common(25):
        p(f"  {v:7.0f}  {100 * v / tot:4.1f}%  {k}")
    p("\nFIXED CONTEXT: tokens in the FIRST call (instructions + tools + skills listing), median by repo")
    med = lambda v: sorted(v)[len(v) // 2] if v else 0
    by = defaultdict(list)
    for s in sessions:
        if s["main"]["first_ctx"]:
            by[("main", s["repo"])].append(s["main"]["first_ctx"])
    for a in agents:
        if a["first_ctx"]:
            by[("sub:" + a["type"].split(":")[-1], a["repo"])].append(a["first_ctx"])
    for k, v in sorted(by.items(), key=lambda kv: -len(kv[1]))[:40]:
        p(f"  {k[0]:28} {k[1]:24} n={len(v):4} median={med(v):7} max={max(v):7}")
    p("\nSUBAGENTS BY ROLE: count, median duration, median total input per agent, median calls")
    br = defaultdict(list)
    for a in agents:
        br[role_of(a)].append(a)
    for r, v in sorted(br.items(), key=lambda kv: -len(kv[1])):
        p(f"  {r:8} n={len(v):4} dur_med={med([a['dur_s'] or 0 for a in v]) / 60:5.1f}m calls_med={med([a['calls'] for a in v]):3} "
          f"input_med={med([a['in'] + a['cache_read'] + a['cache_write'] for a in v]) / 1e6:5.2f}M prompt_med={med([a['prompt_chars'] for a in v])} report_med={med([a['report_chars'] for a in v])}")
    cs, cn, ce = Counter(), Counter(), Counter()
    for e in events:
        if e["kind"] == "bash":
            cs[e["name"]] += e["dur_s"] or 0; cn[e["name"]] += 1; ce[e["name"]] += e["err"]
    p("\nCOMMANDS BY TOTAL TIME: hours, runs, mean s, errors")
    for c, s in cs.most_common(30):
        p(f"  {s / 3600:6.1f}h {cn[c]:6} {s / cn[c]:7.1f}s err={ce[c]:5}  {c}")
    p("\nSAME COMMAND RE-RUN IN ONE AGENT (top 25)")
    for (sid, ag, cmd), n in cmd_repeat.most_common(25):
        p(f"  {n:4}x {sid[:8]} {ag[:6] or 'main':6} {cmd[:140]!r}")
    p("\nSAME FILE READ REPEATEDLY BY ONE AGENT (top 20)")
    for (sid, ag, path), n in read_paths.most_common(20):
        p(f"  {n:4}x {sid[:8]} {ag[:6] or 'main':6} {path[-110:]}")
    sk = Counter(e["name"] for e in events if e["kind"] == "skill")
    p("\nSKILLS LOADED")
    for k, v in sk.most_common(30):
        p(f"  {v:4} {k}")
print(f"{len(rows)} epic rows -> {D}/epics.tsv, phases.tsv, signals.txt")
