#!/usr/bin/env python3
"""rules.py: the one reader and writer of the owner's rule notes (rulebook skill). Stdlib only.

Subcommands: load, cite, check, lint, search, add, update, confirm, retire, approve, override, stats, where.
Two stores: the owner's vault (R- ids) and, in a git repository, its docs/rules/ folder (P- ids).
Exit codes: 0 ok; 1 check found a violation or lint found an error; 2 usage error;
3 environment (vault or Langfuse not found or unreachable); 4 write refused.
The model, the precedence and the note format are explained in ../references/rule-model.md.
"""
from __future__ import annotations

import argparse
import base64
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from datetime import date, timedelta
from pathlib import Path

RULES_DIR = "08 How to/Rules"
PLAYBOOKS_DIR = "08 How to/Playbooks"
PROPOSED_DIR = "00 Inbox/proposed"
TYPES = ("trigger", "preference", "default-with-exception", "constraint", "procedure", "checklist",
         "selection-heuristic", "parameter", "convention", "escalation", "quality-criterion", "principle")
STRENGTHS = {"soft": 1, "default": 2, "hard": 3}
STATUSES = ("idea", "active", "dropped")
REQUIRED = ("id", "type", "strength", "status", "scope", "when", "do", "because", "source", "added")
KEY_ORDER = ("kind", "id", "type", "strength", "status", "scope", "when", "do", "instead_of", "slot", "value",
             "exception_of", "supersedes", "check_absent", "check_present", "because", "source", "added",
             "approved", "last_confirmed", "retired", "retired_reason", "private")
PATTERN_KEYS = ("check_absent", "check_present")
FIELDS = ("type", "strength", "scope", "when", "do", "instead_of", "slot", "value", "exception_of", "supersedes",
          "check_absent", "check_present", "because", "source")
ID = re.compile(r"R-\d{4}")
REPO_ID = re.compile(r"P-\d{4}")
ANY_ID = re.compile(r"[RP]-\d{4}")
REPO_DIR = "docs/rules"
REPO_GLOB = "P-[0-9][0-9][0-9][0-9] *.md"
LINKS = ("exception_of", "supersedes")
NOTE_NO_VAULT = "NOTE personal rules not loaded: vault not found (set MEANINGFY_VAULT)"
POINTER = ("- **Rules:** this repository's rules for agents are in `docs/rules/`. At the start of an activity, "
           "load them with the rulebook skill; change them only through it, by pull request.")
END = "-- end --"
MAX_ACTIVE = 30


class EnvError(Exception):
    """Exit 3: the vault or Langfuse is not found or not reachable."""


class Usage(Exception):
    """Exit 2: a usage error argparse cannot catch."""


class Refused(Exception):
    """Exit 4: a write would add a lint error, or is a duplicate."""


# ---------------------------------------------------------------- note format (D-3)

_KEY = re.compile(r"^([A-Za-z_][\w-]*):(?:[ \t]+(.*))?$")
_ITEM = re.compile(r"^\s*-(?:[ \t]+(.*))?$")
_QUOTE = re.compile(r": |#|:$|^[\[\]{}>|*&!%@'\"]|^[-?:](\s|$)|^\s|\s$")


def _scalar(raw: str) -> str:
    raw = raw.strip()
    if len(raw) >= 2 and raw[0] == raw[-1] == '"':
        return re.sub(r"\\(.)", r"\1", raw[1:-1])
    if len(raw) >= 2 and raw[0] == raw[-1] == "'":
        return raw[1:-1].replace("''", "'")
    if raw[:1] in ("'", '"'):
        raise ValueError(f"unterminated quote: {raw}")
    return raw


def _inline_list(raw: str) -> list[str]:
    items, buf, quote, esc = [], "", None, False
    for ch in raw[1:-1]:
        if quote:
            buf += ch
            if esc:
                esc = False
            elif ch == "\\" and quote == '"':
                esc = True
            elif ch == quote:
                quote = None
        elif ch in "'\"":
            quote, buf = ch, buf + ch
        elif ch == ",":
            items.append(buf)
            buf = ""
        else:
            buf += ch
    items.append(buf)
    return [_scalar(i) for i in items if i.strip()]


def parse_note(text: str) -> tuple[dict, str]:
    """The D-3 subset: `key: scalar`, `key:` + `  - item` lists, inline `[a, b]` lists. Raises ValueError."""
    lines = text.split("\n")
    if lines[0].strip() != "---":
        raise ValueError("no frontmatter")
    end = next((i for i in range(1, len(lines)) if lines[i].strip() == "---"), None)
    if end is None:
        raise ValueError("frontmatter not closed")
    meta: dict = {}
    key = None
    for n, line in enumerate(lines[1:end], 2):
        if not line.strip():
            continue
        item = _ITEM.match(line)
        if item and key is not None and (meta[key] == "" or isinstance(meta[key], list)):
            meta[key] = (meta[key] or []) + [_scalar(item.group(1) or "")]
            continue
        m = _KEY.match(line)
        if not m:
            raise ValueError(f"line {n}: cannot read {line.strip()!r}")
        key, raw = m.group(1), (m.group(2) or "").strip()
        if key in meta:
            raise ValueError(f"line {n}: duplicate key '{key}'")
        meta[key] = _inline_list(raw) if raw.startswith("[") and raw.endswith("]") else _scalar(raw)
    return meta, "\n".join(lines[end + 1:])


def _fmt(value: str, single: bool = False) -> str:
    if single:
        return "'" + value.replace("'", "''") + "'"
    if value == "" or _QUOTE.search(value):
        return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'
    return value


def dump_note(meta: dict, body: str = "") -> str:
    out = ["---"]
    for k in [k for k in KEY_ORDER if k in meta] + [k for k in meta if k not in KEY_ORDER]:
        v = meta[k]
        if isinstance(v, list):
            out.append(f"{k}:" if v else f"{k}: []")
            out += [f"  - {_fmt(i)}" for i in v]
        elif v is not None:
            out.append(f"{k}: {_fmt(v, k in PATTERN_KEYS)}")
    return "\n".join(out) + "\n---\n" + body


# ---------------------------------------------------------------- vault (D-11)

@dataclass
class Note:
    path: Path
    meta: dict = field(default_factory=dict)
    body: str = ""
    error: str | None = None


def find_vault() -> Path:
    env = os.environ.get("MEANINGFY_VAULT")
    root = Path(env) if env else Path.cwd()
    if (root / "08 How to").is_dir():
        return root
    where = f"MEANINGFY_VAULT={env}" if env else "the current directory"
    raise EnvError(f"vault not found: {where} has no '08 How to/' folder. "
                   "Set MEANINGFY_VAULT to the vault root, or run from the vault root.")


def read_dir(root: Path, sub: str, kind: str = "rule") -> list[Note]:
    notes = []
    for p in sorted((root / sub).glob(REPO_GLOB if sub == REPO_DIR else "*.md")):
        try:
            meta, body = parse_note(p.read_text(encoding="utf-8"))
        except (ValueError, UnicodeDecodeError) as e:
            notes.append(Note(p, error=str(e)))
            continue
        if meta.get("kind") == kind:
            notes.append(Note(p, meta, body))
    return notes


def read_playbooks(root: Path) -> dict[str, Note]:
    return {n.meta.get("activity", ""): n for n in read_dir(root, PLAYBOOKS_DIR, "playbook") if not n.error}


def _vault_or_none() -> Path | None:
    try:
        return find_vault()
    except EnvError:
        return None


def _find_repo(vault: Path | None) -> tuple[Path | None, str]:
    """The repository root (the folder holding .git) and '', or None and why there is no repository store (D-8)."""
    cwd = Path.cwd().resolve()
    root = next((p for p in (cwd, *cwd.parents) if (p / ".git").exists()), None)
    if root is None:
        return None, "no .git found"
    if root == Path.home().resolve():
        return None, "repository root is the home folder"
    inside_vault = vault is not None and cwd.is_relative_to(vault.resolve())
    if inside_vault or any((p / "08 How to").is_dir() for p in (cwd, *cwd.parents) if p.is_relative_to(root)):
        return None, "this is the vault"
    return root, ""


def find_stores() -> tuple[Path | None, Path | None]:
    """(vault, repository root), each None when absent; never raises. Reads use the repository only when
    its docs/rules/ exists (_read_stores); writes need only the root."""
    vault = _vault_or_none()
    return vault, _find_repo(vault)[0]


def _repo_root() -> Path:
    root, why = _find_repo(_vault_or_none())
    if root is None:
        raise EnvError(f"no repository store: {why}")
    return root


def _read_stores(vault: Path | None, repo: Path | None) -> list[tuple[str, list[Note]]]:
    """(label, notes) of each present store, vault first."""
    out = [("vault", read_dir(vault, RULES_DIR))] if vault else []
    if repo and (repo / REPO_DIR).is_dir():
        out.append(("repository", read_dir(repo, REPO_DIR)))
    return out


def _belongs(label: str, n: Note) -> bool:
    """False for a note whose id has the other store's prefix (D-15 step 1)."""
    rid = "" if n.error else n.meta.get("id", "")
    return not rid.startswith("P-") if label == "vault" else not rid or bool(REPO_ID.fullmatch(rid))


def _cut(meta: dict, ids: set) -> dict:
    """A copy without the links to ids outside the store (D-15 step 2)."""
    return {k: v for k, v in meta.items() if not (k in LINKS and v not in ids)}


def _merged_index(vault: Path | None, repo: Path | None) -> tuple[dict, list[str], list[str]]:
    """Rules by id and active ids over the present stores (vault first), and the SKIPPED lines (D-15).
    With no store present it raises the vault error."""
    stores = _read_stores(vault, repo)
    if not stores:
        find_vault()
    rules: dict = {}
    active: list[str] = []
    skipped: list[str] = []
    for label, notes in stores:
        ok = [n for n in notes if _belongs(label, n)]
        skipped += [f"SKIPPED {n.path.name}: {n.error}" for n in notes if n.error]
        skipped += [f"SKIPPED {n.path.name}: id {n.meta['id']} does not belong in the {label} store"
                    for n in notes if n not in ok]
        own, act = _index(ok)
        rules.update({i: _cut(m, set(own)) for i, m in own.items()})
        active += act
    return rules, active, skipped


def _list(v) -> list[str]:
    return v if isinstance(v, list) else [v] if v else []


def _vocab(pb: Note) -> dict[str, set[str]]:
    out = {}
    for item in _list(pb.meta.get("vocabulary")):
        dim, _, vals = item.partition(":")
        out[dim.strip()] = {v.strip() for v in vals.split("|")}
    return out


# ---------------------------------------------------------------- precedence (D-4)

def _norm(m: dict) -> frozenset[str]:
    return frozenset(t for t in _list(m.get("scope")) if t != "activity:*")


def _excepts(a: str, b: str, rules: dict) -> bool:
    seen, cur = set(), rules[a].get("exception_of")
    while cur and cur not in seen:
        if cur == b:
            return True
        seen.add(cur)
        cur = rules.get(cur, {}).get("exception_of")
    return False


def _beats(a: str, b: str, rules: dict) -> bool:
    sa, sb = STRENGTHS[rules[a]["strength"]], STRENGTHS[rules[b]["strength"]]
    if sa != sb:
        return sa > sb
    if _excepts(a, b, rules):
        return True
    return not _excepts(b, a, rules) and _norm(rules[a]) > _norm(rules[b])


def _winners(slot: str, ctx: frozenset, ids: list[str], rules: dict) -> tuple[list[str], list[str]]:
    firing = [i for i in ids if rules[i].get("slot") == slot and _norm(rules[i]) <= ctx]
    return firing, [i for i in firing if not any(_beats(o, i, rules) for o in firing if o != i)]


def _compatible(a: frozenset, b: frozenset) -> bool:
    dims: dict[str, str] = {}
    for tag in a | b:
        dim, _, val = tag.partition(":")
        if dims.setdefault(dim, val) != val:
            return False
    return True


def _index(notes: list[Note]) -> tuple[dict, list[str]]:
    """Rules by id (the first note wins a duplicate id) and the active ids precedence can use."""
    rules: dict = {}
    for n in notes:
        if not n.error and n.meta.get("id"):
            rules.setdefault(n.meta["id"], n.meta)
    active = [i for i, m in rules.items() if m.get("status") == "active" and m.get("strength") in STRENGTHS]
    return rules, active


def _applicable(ctx: frozenset, rules: dict, active: list[str]) -> tuple[list[str], list[str]]:
    """The rules a context gets (slot winners, then firing rules without a slot) and its CONFLICT lines."""
    shown, conflicts = [], []
    for slot in sorted({rules[i]["slot"] for i in active if rules[i].get("slot")}):
        firing, win = _winners(slot, ctx, active, rules)
        if firing and not win:
            conflicts.append(f"CONFLICT on {slot} (no winner): ask the owner")
        shown += win
        if len({rules[w].get("value") for w in win}) > 1:
            conflicts.append(f"CONFLICT {' vs '.join(win)} on {slot}: ask the owner")
    shown += [i for i in active if not rules[i].get("slot") and _norm(rules[i]) <= ctx]
    return shown, conflicts


# ---------------------------------------------------------------- lint (D-4, D-5)

def lint(notes: list[Note], playbooks: dict[str, Note], pattern=ID) -> list[tuple[str, str, str]]:
    """Findings as (level, code, message); level is ERROR (refuses a write) or WARNING.
    `pattern` is the id pattern of the store the notes live in."""
    out: list[tuple[str, str, str]] = []
    err = lambda code, msg: out.append(("ERROR", code, msg))
    warn = lambda code, msg: out.append(("WARNING", code, msg))
    by_id: dict[str, list[Note]] = {}
    for n in notes:
        if n.error:
            err("parse", f"{n.path.name}: {n.error}")
            continue
        m, who = n.meta, n.meta.get("id") or n.path.name
        for k in REQUIRED:
            if not m.get(k):
                err("missing", f"{who}: no '{k}'")
        if m.get("id") and not pattern.fullmatch(m["id"]):
            err("invalid", f"{who}: id '{m['id']}' is not {pattern.pattern[0]}-NNNN")
        for k, allowed in (("type", TYPES), ("strength", tuple(STRENGTHS)), ("status", STATUSES)):
            if m.get(k) and m[k] not in allowed:
                err("invalid", f"{who}: {k} '{m[k]}' (allowed: {', '.join(allowed)})")
        for k in PATTERN_KEYS:
            if m.get(k):
                try:
                    re.compile(m[k])
                except re.error as e:
                    err("regex", f"{who}: {k} does not compile ({e})")
        if m.get("id"):
            by_id.setdefault(m["id"], []).append(n)
    for rid, ns in by_id.items():
        if len(ns) > 1:
            err("duplicate-id", f"{rid}: {', '.join(n.path.name for n in ns)}")
    rules, active = _index(notes)
    for rid, m in rules.items():
        for k in ("exception_of", "supersedes"):
            if m.get(k) and m[k] not in rules:
                err("dangling", f"{rid}: {k} {m[k]} does not exist")
        base = rules.get(m.get("exception_of") or "")
        if base and not _norm(m) >= _norm(base):
            err("narrow-exception", f"{rid}: its scope does not contain the scope of its base {m['exception_of']}")
    for k in ("exception_of", "supersedes"):
        seen = set()
        for rid in rules:
            path, cur = [], rid
            while cur in rules and cur not in path:
                path.append(cur)
                cur = rules[cur].get(k)
            if cur in path:
                cycle = frozenset(path[path.index(cur):])
                if cycle not in seen:
                    seen.add(cycle)
                    err("cycle", f"{k}: {' '.join(sorted(cycle))}")
    _precedence_lint(rules, active, warn)
    for rid in active:
        m, base = rules[rid], rules.get(rules[rid].get("exception_of") or "")
        if base and base.get("strength") in STRENGTHS and STRENGTHS[m["strength"]] < STRENGTHS[base["strength"]]:
            warn("weak-exception", f"{rid} is weaker than its base {m['exception_of']}: draft it at the base's strength")
    counts: dict[str, int] = {}
    for rid in active:
        acts = [t.split(":", 1)[1] for t in _list(rules[rid].get("scope")) if t.startswith("activity:") and t != "activity:*"]
        for act in acts:
            counts[act] = counts.get(act, 0) + 1
            if act in playbooks:
                vocab = _vocab(playbooks[act])
                for tag in _norm(rules[rid]) - {f"activity:{act}"}:
                    dim, _, val = tag.partition(":")
                    if val not in vocab.get(dim, set()):
                        warn("vocabulary", f"{rid}: '{tag}' is not in the {playbooks[act].path.stem} playbook vocabulary")
    for act, n in sorted(counts.items()):
        if n > MAX_ACTIVE:
            warn("oversized", f"activity {act} has {n} active rules (more than {MAX_ACTIVE}): split or retire")
    return out


def _lint_all(stores: list[tuple[str, list[Note]]], playbooks: dict[str, Note]) -> list[tuple[str, str, str]]:
    """Errors per store, with the store's id pattern; warnings once over the union of the stores (D-14)."""
    out = [f for label, notes in stores
           for f in lint(notes, playbooks, REPO_ID if label == "repository" else ID) if f[0] == "ERROR"]
    union: list[Note] = []
    for label, notes in stores:
        ok = [n for n in notes if _belongs(label, n)]
        ids = {n.meta.get("id") for n in ok if not n.error}
        union += [Note(n.path, _cut(n.meta, ids), n.body, n.error) for n in ok]
    return out + [f for f in lint(union, playbooks, ANY_ID) if f[0] == "WARNING"]


def _precedence_lint(rules: dict, active: list[str], warn) -> None:
    slotted = [i for i in active if rules[i].get("slot")]
    groups: dict[tuple, list[str]] = {}
    for i in slotted:
        m = rules[i]
        groups.setdefault((_norm(m), m["slot"], m.get("value"), m["strength"]), []).append(i)
    dups = set()
    for ids in groups.values():
        if len(ids) > 1:
            dups |= set(ids)
            warn("duplicate", f"{' and '.join(ids)} duplicate each other: keep one")
    for i in slotted:
        m = rules[i]
        _, win = _winners(m["slot"], _norm(m), active, rules)
        vals = {rules[w].get("value") for w in win}
        if i not in win:
            if not win:
                warn("dead", f"{i}: no rule wins {m['slot']} in its own scope (a beats-cycle)")
            elif len(vals) > 1:
                warn("dead", f"{i}: beaten by {', '.join(win)} on {m['slot']}, which conflict among themselves")
            elif vals != {m.get("value")}:
                warn("dead", f"{i}: always beaten by {', '.join(win)} on {m['slot']}")
            elif i not in dups:
                warn("redundant", f"{i}: {', '.join(win)} already sets {m['slot']}={m.get('value')} in its scope")
        elif vals == {m.get("value")} and i not in dups:
            _, rest = _winners(m["slot"], _norm(m), [a for a in active if a != i], rules)
            if rest and {rules[w].get("value") for w in rest} == vals:
                warn("redundant", f"{i}: without it, {', '.join(rest)} still sets {m['slot']}={m.get('value')}")
    for n, a in enumerate(slotted):
        for b in slotted[n + 1:]:
            ma, mb = rules[a], rules[b]
            if (ma["slot"] == mb["slot"] and ma.get("value") != mb.get("value") and _compatible(_norm(ma), _norm(mb))
                    and not _beats(a, b, rules) and not _beats(b, a, rules)):
                warn("conflict", f"{a} and {b} set {ma['slot']} differently and neither beats the other")


# ---------------------------------------------------------------- read commands

def _context(args) -> frozenset[str]:
    tags = {f"activity:{args.activity}"} if args.activity else set()
    for c in args.context or []:
        k, sep, v = c.partition("=")
        if not sep:
            raise Usage(f"--context takes key=value, got {c!r}")
        tags.add(f"{k}:{v}")
    return frozenset(tags)


def _line(rid: str, m: dict) -> str:
    slot = f" {m['slot']}={m.get('value', '')}:" if m.get("slot") else ""
    return f"{rid} [{m['strength']}]{slot} {m.get('do', '')} (because: {m.get('because', '')})"


def cmd_load(args) -> int:
    vault, repo = find_stores()
    rules, active, skipped = _merged_index(vault, repo)
    pb = read_playbooks(vault).get(args.activity) if vault else None
    out = [f"PLAYBOOK {pb.path.stem}", pb.body.strip()] if pb else []
    out += skipped
    shown, conflicts = _applicable(_context(args), rules, active)
    out += [_line(i, rules[i]) for i in shown]
    checks = [i for i in shown if any(rules[i].get(k) for k in PATTERN_KEYS)]
    if checks:
        out.append(f"CHECK {' '.join(checks)}: run check on the output before handing it over")
    note = [] if vault else [NOTE_NO_VAULT]
    print("\n".join(out + conflicts + note + [END]))
    return 0


def _violations(text: str, ids: list[str], rules: dict) -> list[str]:
    out = []
    for rid in ids:
        m = rules[rid]
        try:
            absent = re.compile(m["check_absent"]) if m.get("check_absent") else None
            present = re.compile(m["check_present"]) if m.get("check_present") else None
        except re.error:
            out.append(f"SKIPPED {rid}: its check pattern does not compile (see lint)")
            continue
        if absent:
            out += [f"VIOLATION {rid} line {n}: {line.strip()}"
                    for n, line in enumerate(text.splitlines(), 1) if absent.search(line)]
        if present and not present.search(text):
            out.append(f"VIOLATION {rid}: required pattern '{m['check_present']}' not found")
    return out


def cmd_check(args) -> int:
    if args.golden:  # golden examples are the vault's
        root = find_vault()
        rules, active = _index(read_dir(root, RULES_DIR))
    else:
        rules, active, _ = _merged_index(*find_stores())
    with_checks = lambda ctx: [i for i in _applicable(ctx, rules, active)[0]
                               if any(rules[i].get(k) for k in PATTERN_KEYS)]
    out, failed = [], False
    if args.golden:
        for act, pb in sorted(read_playbooks(root).items()):
            if args.activity and act != args.activity:
                continue
            for item in _list(pb.meta.get("golden")):
                rel, _, tags = (x.strip() for x in item.partition("|"))
                ctx = {f"activity:{act}"} | {t.replace("=", ":", 1) for t in tags.split() if "=" in t}
                path = root / rel
                if not path.is_file():
                    out.append(f"GOLDEN {rel}: missing")
                    failed = True
                    continue
                found = _violations(path.read_text(encoding="utf-8"), with_checks(frozenset(ctx)), rules)
                failed |= any(v.startswith("VIOLATION") for v in found)
                out += [f"GOLDEN {rel}: {'FAIL' if found else 'ok'}"] + found
    else:
        if not args.file or not args.activity:
            raise Usage("check needs --activity and a file, or --golden")
        ids = with_checks(_context(args))
        found = _violations(Path(args.file).read_text(encoding="utf-8"), ids, rules)
        failed = any(v.startswith("VIOLATION") for v in found)
        out += found or [f"OK: {len(ids)} check rule(s) passed"]
    print("\n".join(out + ([] if args.golden or find_stores()[0] else [NOTE_NO_VAULT]) + [END]))
    return 1 if failed else 0


def cmd_lint(args) -> int:
    vault, repo = find_stores()
    if args.store == "repo":
        repo = _repo_root()
    stores = _read_stores(vault if args.store != "repo" else None, repo if args.store != "vault" else None)
    if not stores and args.store == "repo":  # possible, but docs/rules/ is not there: an empty store
        stores = [("repository", [])]
    if not stores:
        find_vault()
    findings = _lint_all(stores, read_playbooks(vault) if vault else {})
    for level, code, msg in findings:
        print(f"{level} {code}: {msg}")
    errors = sum(1 for f in findings if f[0] == "ERROR")
    print(f"{errors} error(s), {len(findings) - errors} warning(s)")
    return 1 if errors else 0


def cmd_search(args) -> int:
    vault, repo = find_stores()
    stores = _read_stores(vault, repo)
    if not stores:
        find_vault()
    words = [w.lower() for w in args.words]
    notes = [n for label, ns in stores for n in ([n for n in ns if _belongs(label, n)]
                                                 + (read_dir(vault, PROPOSED_DIR) if label == "vault" else []))]
    for n in notes:
        m = n.meta
        hay = " ".join(str(m.get(k, "")) for k in ("id", "when", "do", "instead_of", "slot", "value", "because",
                                                   "source")).lower()
        if not n.error and all(w in hay for w in words):
            print(f"{m.get('id')} [{m.get('status')}] [{m.get('strength')}] {m.get('do')} (when: {m.get('when')})")
    if not vault:
        print(NOTE_NO_VAULT)
    return 0


def cmd_cite(args) -> int:
    print("cited " + " ".join(args.ids))
    return 0


def cmd_override(args) -> int:
    print(f"override {args.id}: {args.reason}")
    return 0


# ---------------------------------------------------------------- writers (D-5, error matrix)

def _title(do: str) -> str:
    return " ".join(re.sub(r"[^A-Za-z0-9 -]", "", do).split()[:6])


def _commit(root: Path, changes: list[tuple[Path, dict, str, Path | None]], dry_run: bool = False) -> None:
    """Write (path, meta, body, old_path) changes unless they add a new lint
    error; print new warnings. A new file whose id another file already holds raises FileExistsError, so
    the caller can retry. Errors and warnings come from the combined lint of both stores (D-14)."""
    sub = REPO_DIR if changes[0][0].is_relative_to(root / REPO_DIR) else RULES_DIR  # the store written to
    label = "repository" if sub == REPO_DIR else "vault"
    vault, repo = find_stores()
    others = [s for s in _read_stores(vault, repo) if s[0] != label]
    notes = read_dir(root, sub)
    playbooks = read_playbooks(root if label == "vault" else vault) if (label == "vault" or vault) else {}
    after = list(notes)
    for path, meta, body, old in changes:
        after = [n for n in after if n.path not in (path, old)] + [Note(path, meta, body)]
    both = lambda ns: sorted([(label, ns)] + others, key=lambda s: s[0] != "vault")
    before = set(_lint_all(both(notes), playbooks))
    new = [f for f in _lint_all(both(after), playbooks) if f not in before]
    errors = [f"ERROR {c}: {m}" for lvl, c, m in new if lvl == "ERROR"]
    if errors:
        raise Refused("the write would add lint errors; nothing written\n" + "\n".join(errors))
    written = False
    for path, meta, body, old in [] if dry_run else changes:
        text = dump_note(meta, body)
        if label == "repository" and old == path and path.read_text(encoding="utf-8") == text:
            continue  # nothing changes: no write, no pointer
        written = True
        if old and old != path:
            old.write_text(text, encoding="utf-8")
            old.rename(path)
        elif old:
            path.write_text(text, encoding="utf-8")
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            with open(path, "x", encoding="utf-8") as f:
                f.write(text)
            if [p for p in path.parent.glob(f"{meta['id']} *.md") if p != path]:
                path.unlink()  # another writer took this id under another title
                raise FileExistsError(meta["id"])
        print(f"wrote {path.relative_to(root).as_posix()}")
    if label == "repository" and written:
        _write_pointer(root)
    for lvl, c, m in new:
        if lvl == "WARNING":
            print(f"WARNING {c}: {m}")
    if dry_run:
        print("dry run: nothing written")


def _write_pointer(root: Path) -> None:
    """Append the pointer line to AGENTS.md when it does not mention docs/rules/ yet (D-12). Works on
    bytes, so any encoding survives; any failure is a warning, never an error."""
    path = root / "AGENTS.md"
    try:
        if not path.exists():
            path.write_text(f"# AGENTS.md\n\n{POINTER}\n", encoding="utf-8")
            print("wrote AGENTS.md (new: if CLAUDE.md is this repository's binding, import AGENTS.md from it)")
            return
        data = path.read_bytes()
        if b"docs/rules/" in data:
            return
        nl = b"\r\n" if b"\r\n" in data else b"\n"
        with open(path, "ab") as f:
            f.write((b"" if data.endswith(b"\n") else nl) + nl + POINTER.encode("utf-8") + nl)
        print("wrote AGENTS.md (pointer to docs/rules/)")
    except OSError as e:
        print(f"WARNING pointer: could not write AGENTS.md ({e.strerror or e}): add the line by hand")


def _all_ids(root: Path, subs=(RULES_DIR, PROPOSED_DIR), pattern=ID) -> list[str]:
    return [m.group(0) for sub in subs for p in (root / sub).glob("*.md") if (m := pattern.match(p.name))]


def _find(root: Path, rid: str, sub: str = RULES_DIR) -> Note | None:
    return next((n for n in read_dir(root, sub) if not n.error and n.meta.get("id") == rid), None)


def _fields(args) -> dict:
    return {k: getattr(args, k) for k in FIELDS if getattr(args, k, None) is not None}


def _superseded(root: Path, meta: dict, today: str, sub: str = RULES_DIR) -> list:
    old = _find(root, meta["supersedes"], sub) if meta.get("supersedes") else None
    if not old or old.meta.get("status") == "dropped":
        return []
    return [(old.path, {**old.meta, "status": "dropped", "retired": today,
                        "retired_reason": f"superseded by {meta['id']}"}, old.body, old.path)]


def cmd_add(args) -> int:
    repo = args.store == "repo"
    if repo and args.candidate:
        raise Usage("the repository store takes no candidates: approve the row, or move it to the vault and defer it")
    root, today = _repo_root() if repo else find_vault(), args.today.isoformat()
    sub, pattern, prefix = (REPO_DIR, REPO_ID, "P") if repo else (RULES_DIR, ID, "R")
    f = _fields(args)
    same = lambda a, b: " ".join(str(a or "").lower().split()) == " ".join(str(b or "").lower().split())
    for n in read_dir(root, sub):
        m = n.meta
        if m.get("status") == "active" and same(m.get("when"), f.get("when")) and same(m.get("do"), f.get("do")):
            raise Refused(f"duplicate of {m['id']}: run `confirm {m['id']}` instead")
    for attempt in (1, 2):
        ids = _all_ids(root, (sub,), pattern) if repo else _all_ids(root)
        rid = f"{prefix}-{max([int(i[2:]) for i in ids] or [0]) + 1:04d}"
        meta = {"kind": "rule", "id": rid, **f, "status": "idea" if args.candidate else "active", "added": today}
        if not args.candidate:
            meta.update(approved=today, last_confirmed=today)
        meta["private"] = "false" if repo else "true"
        path = root / (PROPOSED_DIR if args.candidate else sub) / f"{rid} {_title(f.get('do', ''))}.md"
        changes = [(path, meta, "", None)] + ([] if args.candidate else _superseded(root, meta, today, sub))
        try:
            _commit(root, changes, args.dry_run)
            return 0
        except FileExistsError:
            if attempt == 2:
                raise Refused(f"id {rid} was taken twice while writing; try again")
    return 0


def _target(rid: str) -> tuple[Path, str]:
    """The store root and folder a rule id belongs to: P- the repository, else the vault."""
    return (_repo_root(), REPO_DIR) if rid.startswith("P-") else (find_vault(), RULES_DIR)


def _rewrite(root: Path, rid: str, change: dict, note: Note | None = None, sub: str = RULES_DIR) -> None:
    note = note or _find(root, rid, sub)
    if not note:
        raise Refused(f"no rule {rid} in {sub}/")
    _commit(root, [(note.path, {**note.meta, **change}, note.body, note.path)])


def cmd_update(args) -> int:
    root, sub = _target(args.id)
    change = _fields(args)
    if not change:
        raise Usage("update needs at least one field to change")
    note = _find(root, args.id, sub) or (None if sub == REPO_DIR else _find(root, args.id, PROPOSED_DIR))
    if not note:
        raise Refused(f"no rule {args.id} in {sub}/" + ("" if sub == REPO_DIR else f" or {PROPOSED_DIR}/"))
    path = note.path
    if "do" in change:  # the title follows `do` (D-3); a rename follows the move procedure
        path = note.path.with_name(f"{args.id} {_title(change['do'])}.md")
        clash = [p for p in (root / sub if sub == REPO_DIR else root).rglob(path.name) if p != note.path]
        if clash:
            raise Refused(f"another note has the name {path.name}: {clash[0].relative_to(root).as_posix()}")
    _commit(root, [(path, {**note.meta, **change}, note.body, note.path)], args.dry_run)
    return 0


def cmd_confirm(args) -> int:
    root, sub = _target(args.id)
    note = _find(root, args.id, sub)
    if not note or note.meta.get("status") != "active":
        raise Refused(f"{args.id} is not an active rule")
    if note.meta.get("last_confirmed") == args.today.isoformat():
        print(f"{args.id} already confirmed today")
        return 0
    _rewrite(root, args.id, {"last_confirmed": args.today.isoformat()}, note, sub)
    return 0


def cmd_retire(args) -> int:
    root, sub = _target(args.id)
    note = _find(root, args.id, sub)
    if note and note.meta.get("status") == "dropped":
        print(f"{args.id} already retired")
        return 0
    _rewrite(root, args.id, {"status": "dropped", "retired": args.today.isoformat(), "retired_reason": args.reason},
             note, sub)
    return 0


def cmd_approve(args) -> int:
    if args.id.startswith("P-"):
        raise Refused("repository rules have no candidates")
    root, today = find_vault(), args.today.isoformat()
    note = _find(root, args.id, PROPOSED_DIR)
    if not note:
        if _find(root, args.id):
            print(f"{args.id} already approved")
            return 0
        raise Refused(f"no candidate {args.id} in {PROPOSED_DIR}/")
    dest = root / RULES_DIR / note.path.name
    clash = [p for p in root.rglob(note.path.name) if p != note.path]
    if clash:
        raise Refused(f"another note has the name {note.path.name}: {clash[0].relative_to(root).as_posix()}")
    meta = {**note.meta, "status": "active", "approved": today, "last_confirmed": today}
    _commit(root, [(dest, meta, note.body, note.path)] + _superseded(root, meta, today))
    return 0


def cmd_where(args) -> int:
    vault = _vault_or_none()
    env = os.environ.get("MEANINGFY_VAULT")
    repo, why = _find_repo(vault)
    print(f"vault: {vault}" if vault else "vault: none (MEANINGFY_VAULT not set and no '08 How to/' here)"
          if not env else f"vault: none (MEANINGFY_VAULT={env} has no '08 How to/' folder)")
    state = "present" if repo and (repo / REPO_DIR).is_dir() else "not yet created"
    print(f"repository: {repo} (docs/rules/ {state})" if repo else f"repository: none ({why})")
    print(f"default store: {'repository' if repo else 'vault'}\n{END}")
    return 0


# ---------------------------------------------------------------- stats (D-7, D-10)

_CALL = re.compile(r"rules\.py\S*\s+([a-z]+)")
_REASON = re.compile(r"""--reason\s+(?:"([^"]*)"|'([^']*)'|(\S+))""")


def _strings(obj):
    if isinstance(obj, str):
        if obj[:1] in "{[":
            try:
                yield from _strings(json.loads(obj))
                return
            except ValueError:
                pass
        yield obj
    elif isinstance(obj, dict):
        for v in obj.values():
            yield from _strings(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from _strings(v)


def _fetch(since: date, until: date) -> list[dict]:
    env = {k: os.environ.get(k) for k in ("LANGFUSE_BASE_URL", "LANGFUSE_PUBLIC_KEY", "LANGFUSE_SECRET_KEY")}
    missing = [k for k, v in env.items() if not v]
    if missing:
        raise EnvError(f"Langfuse not configured: set {', '.join(missing)}")
    auth = base64.b64encode(f"{env['LANGFUSE_PUBLIC_KEY']}:{env['LANGFUSE_SECRET_KEY']}".encode()).decode()
    base, data, cursor = env["LANGFUSE_BASE_URL"].rstrip("/"), [], None
    # v2 is the read API that also works on Langfuse v4 events_only deployments; io must be asked for
    window = {"fields": "core,basic,io", "limit": 1000, "fromStartTime": f"{since.isoformat()}T00:00:00Z",
              "toStartTime": f"{(until + timedelta(days=1)).isoformat()}T00:00:00Z"}
    while True:
        query = urllib.parse.urlencode({**window, **({"cursor": cursor} if cursor else {})})
        req = urllib.request.Request(f"{base}/api/public/v2/observations?{query}",
                                     headers={"Authorization": f"Basic {auth}"})
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                body = json.load(resp)
        except (urllib.error.URLError, OSError, ValueError) as e:
            raise EnvError(f"Langfuse unreachable at {base}: {e}")
        data += body.get("data", [])
        cursor = (body.get("meta") or {}).get("cursor")
        if not cursor:
            return data


def cmd_stats(args) -> int:
    today = args.today
    days = int(re.fullmatch(r"(\d+)d", args.since).group(1)) if re.fullmatch(r"\d+d", args.since) else None
    if days is None:
        raise Usage("--since takes a number of days, such as 30d")
    since = today - timedelta(days=days)
    if args.from_file:
        try:
            observations = json.loads(Path(args.from_file).read_text(encoding="utf-8")).get("data", [])
        except (OSError, ValueError) as e:
            raise EnvError(f"cannot read {args.from_file}: {e}")
    else:
        observations = _fetch(since, today)
    root = find_vault()
    rules, active = _index(read_dir(root, RULES_DIR))
    count = {}
    reasons: dict[str, list[str]] = {}
    events = truncated = scanned = 0
    bump = lambda rid, k: count.setdefault(rid, {"loaded": 0, "cited": 0, "overridden": 0, "violated": 0}).__setitem__(
        k, count[rid][k] + 1)
    for obs in observations:
        if obs.get("type") == "GENERATION" or not since.isoformat() <= str(obs.get("startTime", ""))[:10] <= today.isoformat():
            continue
        scanned += 1
        strings = list(_strings(obs.get("input"))) + list(_strings({k: v for k, v in obs.items() if k != "input"}))
        call = next(((s, m) for s in strings if (m := _CALL.search(s))), None)
        if not call:
            continue
        events += 1
        inp, sub = call[0], call[1].group(1)
        args_text = inp[call[1].end():]
        output = "\n".join(s for s in strings if s is not inp)
        if sub in ("load", "check") and END not in output:
            truncated += 1
        elif sub == "load":
            for rid in re.findall(r"^(R-\d{4}) ", output, re.MULTILINE):
                bump(rid, "loaded")
        elif sub == "check":
            for rid in re.findall(r"^VIOLATION (R-\d{4})", output, re.MULTILINE):
                bump(rid, "violated")
        elif sub in ("cite", "override"):
            for rid in ID.findall(args_text.split("--reason")[0]):
                bump(rid, "cited" if sub == "cite" else "overridden")
                if sub == "override" and (r := _REASON.search(args_text)):
                    reasons.setdefault(rid, []).append(next(g for g in r.groups() if g is not None))
    out = [f"window {since.isoformat()}..{today.isoformat()}: {scanned} observations, {events} rules.py events"]
    out.append("id      loaded cited overridden violated")
    out += [f"{rid}  {c['loaded']} {c['cited']} {c['overridden']} {c['violated']}" for rid, c in sorted(count.items())]
    if truncated:
        out.append(f"TRUNCATED {truncated} output(s) counted without ids")
    if scanned and not events:
        out.append(f"WARNING no rules.py events in {scanned} observations: the span format may have changed; "
                   "usage flags are not computed")
    elif not events:
        out.append("WARNING no usage data in the window: no session was traced; usage flags are not computed")
    zero = {"loaded": 0, "cited": 0, "overridden": 0, "violated": 0}
    for rid in sorted(active):
        m, c = rules[rid], count.get(rid, zero)
        if events:
            if m.get("added", "9999") <= (today - timedelta(days=30)).isoformat() and not c["loaded"]:
                out.append(f"FLAG {rid} never-loaded: propose retire")
            if c["loaded"] >= 5 and not c["cited"]:
                out.append(f"FLAG {rid} loaded-never-cited ({c['loaded']}): propose revise or narrow its scope")
            if c["overridden"] >= 2:
                quoted = "; ".join(f'"{r}"' for r in reasons.get(rid, []))
                out.append(f"FLAG {rid} overridden {c['overridden']}: propose revise, supersede or retire; reasons: {quoted}")
            if c["violated"] >= 3:
                out.append(f"FLAG {rid} violated {c['violated']}: propose strengthening the procedure, or ask if it still holds")
        confirmed = m.get("last_confirmed") or m.get("approved") or m.get("added") or ""
        if confirmed and confirmed < (today - timedelta(days=90)).isoformat():
            out.append(f"FLAG {rid} stale (last confirmed {confirmed}): propose confirm or retire")
    print("\n".join(out + [END]))
    return 0


# ---------------------------------------------------------------- CLI

def _id(value: str) -> str:
    if not ANY_ID.fullmatch(value):
        raise argparse.ArgumentTypeError(f"{value!r} is not a rule id R-NNNN or P-NNNN")
    return value


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="rules.py", description=__doc__.splitlines()[0])
    sub = p.add_subparsers(dest="cmd", required=True)
    clock = argparse.ArgumentParser(add_help=False)
    clock.add_argument("--today", type=date.fromisoformat, default=date.today(), help="fix the clock (YYYY-MM-DD)")
    ctx = argparse.ArgumentParser(add_help=False)
    ctx.add_argument("--context", action="append", metavar="KEY=VALUE")
    fields = argparse.ArgumentParser(add_help=False)
    for k in FIELDS:
        fields.add_argument("--" + k.replace("_", "-"), dest=k, action="append" if k == "scope" else "store",
                            type=_id if k in ("exception_of", "supersedes") else str)

    s = sub.add_parser("load", parents=[ctx], help="print the rules that apply to an activity and context")
    s.add_argument("--activity", required=True)
    s.set_defaults(func=cmd_load)
    s = sub.add_parser("check", parents=[ctx], help="run the check patterns on a file, or on the golden examples")
    s.add_argument("--activity")
    s.add_argument("--golden", action="store_true")
    s.add_argument("file", nargs="?")
    s.set_defaults(func=cmd_check)
    s = sub.add_parser("lint", help="report errors and warnings in the rule set")
    s.add_argument("--store", choices=("all", "vault", "repo"), default="all")
    s.set_defaults(func=cmd_lint)
    sub.add_parser("where", help="print the stores this session sees and the default one").set_defaults(func=cmd_where)
    s = sub.add_parser("search", help="find rules by words")
    s.add_argument("words", nargs="+")
    s.set_defaults(func=cmd_search)
    s = sub.add_parser("cite", help="record the rules applied (writes nothing)")
    s.add_argument("ids", nargs="+", type=_id)
    s.set_defaults(func=cmd_cite)
    s = sub.add_parser("override", help="record a correction against a rule (writes nothing)")
    s.add_argument("id", type=_id)
    s.add_argument("--reason", required=True)
    s.set_defaults(func=cmd_override)
    s = sub.add_parser("add", parents=[clock, fields], help="write a new rule, or a candidate with --candidate")
    s.add_argument("--candidate", action="store_true")
    s.add_argument("--store", choices=("vault", "repo"), default="vault", help="where the rule is written")
    s.add_argument("--dry-run", action="store_true", help="print the warnings the write would add; write nothing")
    s.set_defaults(func=cmd_add)
    s = sub.add_parser("update", parents=[clock, fields], help="change fields of a rule, keeping its id")
    s.add_argument("id", type=_id)
    s.add_argument("--dry-run", action="store_true", help="print the warnings the write would add; write nothing")
    s.set_defaults(func=cmd_update)
    for name, func, text in (("confirm", cmd_confirm, "set last_confirmed to today"),
                             ("approve", cmd_approve, "move a candidate into the rules, active")):
        s = sub.add_parser(name, parents=[clock], help=text)
        s.add_argument("id", type=_id)
        s.set_defaults(func=func)
    s = sub.add_parser("retire", parents=[clock], help="set a rule to dropped, with a reason (never deletes)")
    s.add_argument("id", type=_id)
    s.add_argument("--reason", required=True)
    s.set_defaults(func=cmd_retire)
    s = sub.add_parser("stats", parents=[clock], help="usage per rule from Langfuse, and the steward's flags")
    s.add_argument("--since", default="30d")
    s.add_argument("--from-file", help="read a saved observations response instead of the API")
    s.set_defaults(func=cmd_stats)
    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        return args.func(args)
    except Usage as e:
        print(f"rules.py: error: {e}", file=sys.stderr)
        return 2
    except EnvError as e:
        print(f"error: {e}", file=sys.stderr)
        return 3
    except Refused as e:
        print(f"refused: {e}", file=sys.stderr)
        return 4


if __name__ == "__main__":
    sys.exit(main())
