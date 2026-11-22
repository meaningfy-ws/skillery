#!/usr/bin/env python3
"""Check docker compose files against the per-stack minimum S1-S9 (references/stack-standard.md).

Usage: python check_stack.py <compose.yml>...

Prints one row per stack, service and rule (status: met, missing, excepted, unreadable) and exits 1
when any rule is missing or any file is unreadable. Reads YAML only: no Docker, no network.
An exception is a comment inside the service's block: `# conformance-exception: S<n> <reason>`.
"""
import ipaddress
import re
import sys
from dataclasses import dataclass
from pathlib import Path

import yaml

EXCEPTION = re.compile(r"#\s*conformance-exception:\s*(S[1-9])\s+\S")
SECRET_NAME = re.compile(r"(^|_)(PASSWORD|PASSWD|PASS|SECRET|TOKEN|KEY|CREDENTIALS?)$", re.IGNORECASE)  # the name ends in a secret word
PLAIN_REF = re.compile(r"^\$\{[A-Za-z_][A-Za-z0-9_]*(:?\?[^}]*)?\}$")  # ${VAR} or ${VAR:?msg}, no default
BARE_MAJOR = re.compile(r"^v?\d+([-_][^.]*)?$")  # 16, 16-alpine; not 17-0.107.0
PROXY_PORTS = {"80", "443"}


@dataclass
class Row:
    stack: str
    service: str
    rule: str
    status: str
    detail: str = ""


def _s1(svc):
    image = svc.get("image")
    if svc.get("build"):
        return "built on the VM, not pulled pinned"  # images are built once, off the VM
    if not image:
        return "no image"
    if "@sha256:" in image:
        return None
    name_tag = image.rsplit("/", 1)[-1]
    if ":" not in name_tag:
        return f"{image}: no tag"
    tag = name_tag.split(":", 1)[1]
    if "latest" in tag:
        return f"{image}: latest"
    if "${" in tag:
        return f"{image}: tag from .env, not pinned in git"
    if BARE_MAJOR.match(tag):
        return f"{image}: bare major"
    return None


def _s2(svc):
    hc = svc.get("healthcheck")
    return None if hc and not hc.get("disable") else "no healthcheck"


def _s3(svc):
    limits = ((svc.get("deploy") or {}).get("resources") or {}).get("limits") or {}
    return None if svc.get("mem_limit") or limits.get("memory") else "no memory limit"


def _s4(svc):
    options = (svc.get("logging") or {}).get("options") or {}
    return None if "max-size" in options and "max-file" in options else "no log rotation"


def _s5(svc):
    return None if svc.get("restart") == "unless-stopped" else f"restart: {svc.get('restart')}"


def _s6(svc):
    opts = [str(o).replace("=", ":") for o in svc.get("security_opt") or []]
    return None if "no-new-privileges:true" in opts else "no no-new-privileges"


def _private(addr):
    if addr.startswith("${"):
        return True  # the address comes from .env
    try:
        ip = ipaddress.ip_address(addr.strip("[]"))
    except ValueError:
        return False
    return ip.is_private and not ip.is_unspecified


def _s7(svc):
    bad = []
    for port in svc.get("ports") or []:
        if isinstance(port, dict):
            addr, published = port.get("host_ip", ""), str(port.get("published", ""))
        else:
            parts = str(port).split("/")[0].rsplit(":", 2)
            addr, published = (parts[0], parts[1]) if len(parts) == 3 else ("", parts[0])
        if published in PROXY_PORTS and not addr:
            continue
        if not addr or not _private(addr):
            bad.append(str(port))
    return f"no private bind address: {', '.join(bad)}" if bad else None


def _s8(svc):
    bad = []
    for vol in svc.get("volumes") or []:
        if isinstance(vol, dict):
            source, read_only = str(vol.get("source", "")), vol.get("read_only", False)
        else:
            parts = str(vol).split(":")
            source, read_only = parts[0], len(parts) > 2 and "ro" in parts[2].split(",")
        if read_only or source.startswith((".", "${")):
            continue  # config from the repo or a path from .env
        if not source.startswith("/opt/data/"):
            bad.append(str(vol) if isinstance(vol, str) else source)
    return f"data outside /opt/data/: {', '.join(bad)}" if bad else None


def _s9(svc):
    env = svc.get("environment") or {}
    if isinstance(env, list):
        env = dict(item.split("=", 1) if "=" in item else (item, None) for item in map(str, env))
    bad = [k for k, v in env.items() if SECRET_NAME.search(k) and v is not None and not PLAIN_REF.match(str(v))]
    return f"literal or defaulted secret: {', '.join(bad)}" if bad else None


CHECKS = {"S1": _s1, "S2": _s2, "S3": _s3, "S4": _s4, "S5": _s5, "S6": _s6, "S7": _s7, "S8": _s8, "S9": _s9}


def _exceptions(text):
    """Map service name -> rules excepted by comments inside its block."""
    root = yaml.compose(text)
    services = next((v for k, v in root.value if k.value == "services"), None)
    lines = text.splitlines()
    out = {}
    for key, node in services.value:
        block = lines[key.start_mark.line:node.end_mark.line + 1]
        out[key.value] = {m.group(1) for line in block if (m := EXCEPTION.search(line))}
    return out


def check_file(path):
    path = Path(path)
    stack = path.parent.name
    try:
        text = path.read_text(encoding="utf-8")
        services = yaml.safe_load(text)["services"]
        excepted = _exceptions(text)
        assert isinstance(services, dict)
    except Exception as exc:  # any parse or shape failure makes the file unreadable
        return [Row(stack, "-", "-", "unreadable", f"{type(exc).__name__}")]
    rows = []
    for name, svc in services.items():
        for rule, check in CHECKS.items():
            problem = check(svc or {})
            if rule in excepted.get(name, set()):
                rows.append(Row(stack, name, rule, "excepted"))
            else:
                rows.append(Row(stack, name, rule, "missing" if problem else "met", problem or ""))
    return rows


def main(argv):
    if not argv:
        print(__doc__.strip().splitlines()[2], file=sys.stderr)
        return 2
    rows = [row for p in argv for row in check_file(p)]
    print(f"{'stack':<16} {'service':<28} {'rule':<5} {'status':<10} detail")
    for r in rows:
        print(f"{r.stack:<16} {r.service:<28} {r.rule:<5} {r.status:<10} {r.detail}")
    return 1 if any(r.status in ("missing", "unreadable") for r in rows) else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
