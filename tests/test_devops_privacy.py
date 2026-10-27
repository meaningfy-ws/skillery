"""No devops file in this public repo names a real address, host or private name (TC-03, DEC-4).

Scope: the four devops skills, the three devops agents, tests/fixtures/devops/ and the EPIC's inputs/.
Allowed addresses: the RFC 5737 documentation ranges, loopback and 0.0.0.0 (they name nothing).
Private names (hosts, clients, accounts) are read from tests/fixtures/devops/private-names.local.txt,
git-ignored, one per line; without it that check is skipped and task 7.1's human review covers it.
"""
import ipaddress
import re
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
SCOPE = [
    *(ROOT / "skills" / s for s in ("infrastructure-operations", "stack-operations", "service-reliability", "infrastructure-security")),
    *(ROOT / "agents" / f"{a}.md" for a in ("devops-engineer", "ops-watch", "infra-reviewer")),
    ROOT / "tests/fixtures/devops",
    ROOT / "openspec/changes/add-devops-bundle/inputs",
]
NAMES_FILE = ROOT / "tests/fixtures/devops/private-names.local.txt"
ALLOWED_NETS = [ipaddress.ip_network(n) for n in ("192.0.2.0/24", "198.51.100.0/24", "203.0.113.0/24", "127.0.0.0/8", "0.0.0.0/32")]
IPV4 = re.compile(r"(?<![\d.])(?:\d{1,3}\.){3}\d{1,3}(?![\d.])")
COMPANY_HOST = re.compile(r"\b[\w-]+(?:\.[\w-]+)*\.meaningfy\.ws\b", re.IGNORECASE)


def _files():
    for path in SCOPE:
        if path.is_file():
            yield path
        elif path.is_dir():
            yield from (p for p in sorted(path.rglob("*")) if p.is_file() and p != NAMES_FILE)


def findings(path, names=()):
    """Return 'file:line: what' for each address, company host or private name in one file."""
    out = []
    text = path.read_text(encoding="utf-8", errors="replace")
    for n, line in enumerate(text.splitlines(), 1):
        for m in IPV4.finditer(line):
            try:
                ip = ipaddress.ip_address(m.group())
            except ValueError:
                continue
            if not any(ip in net for net in ALLOWED_NETS):
                out.append(f"{path}:{n}: address {m.group()}")
        out += [f"{path}:{n}: host {m.group()}" for m in COMPANY_HOST.finditer(line)]
        out += [f"{path}:{n}: private name" for name in names if re.search(rf"\b{re.escape(name)}\b", line, re.IGNORECASE)]
    return out


def test_no_address_or_company_host():
    problems = [f for p in _files() for f in findings(p)]
    assert not problems, "\n".join(problems)


def test_no_private_name():
    if not NAMES_FILE.exists():
        pytest.skip(f"{NAMES_FILE.name} absent: private-name check skipped, the human review of task 7.1 covers it")
    names = [n.strip() for n in NAMES_FILE.read_text(encoding="utf-8").splitlines() if n.strip() and not n.startswith("#")]
    problems = [f for p in _files() for f in findings(p, names)]
    assert not problems, "\n".join(problems)  # prints file and line, never the name


def test_planted_leaks_are_caught(tmp_path):
    f = tmp_path / "planted.md"
    f.write_text("ok 192.0.2.7 and 127.0.0.1\nbad 10.20.30.40\nbad vm1.meaningfy.ws\nmail ops@example.org\nsecret-client\n")
    assert [x.split(": ", 1)[1] for x in findings(f, ["secret-client"])] == [
        "address 10.20.30.40", "host vm1.meaningfy.ws", "private name"]
