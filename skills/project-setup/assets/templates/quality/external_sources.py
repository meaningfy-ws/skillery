#!/usr/bin/env python3
"""Fetch and list the pinned external Semgrep rule sources. Standard library only.

    python3 scripts/quality/external_sources.py fetch
    python3 scripts/quality/external_sources.py paths gate|report-only

Reads .quality/semgrep/external.json relative to the working directory; sources live in
.quality/external/<id>/. Exit codes: 0 done, 1 a source could not be fetched, 2 no manifest or an invalid one.
"""
import argparse
import http.client
import json
import re
import shutil
import sys
import tarfile
import tempfile
import urllib.request
from io import BytesIO
from pathlib import Path

MANIFEST = Path(".quality/semgrep/external.json")
EXTERNAL = Path(".quality/external")
MODES = ("gate", "report-only")
FIELDS = ("id", "repo", "commit", "paths", "mode")  # the others (licence, why) are for people
DOWNLOAD_TIMEOUT_SECONDS = 60


def download_archive(url):
    with urllib.request.urlopen(url, timeout=DOWNLOAD_TIMEOUT_SECONDS) as response:  # noqa: S310 -- https url from the pinned manifest
        return response.read()


def entry_problems(entry):
    """What is wrong with one manifest entry, as 'field: reason' lines; empty when it is sound."""
    if not isinstance(entry, dict):
        return ["entry: must be an object"]
    problems = [f"{field}: missing" for field in FIELDS if field not in entry]
    value = entry.get
    checks = (
        ("repo", isinstance(value("repo"), str) and value("repo").startswith("https://")),
        ("id", isinstance(value("id"), str) and re.fullmatch(r"[a-z0-9-]+", value("id"))),
        ("commit", isinstance(value("commit"), str) and re.fullmatch(r"[0-9a-f]{40}", value("commit"))),
        ("mode", value("mode") in MODES),
        ("paths", isinstance(value("paths"), list) and value("paths")
         and all(isinstance(p, str) and re.fullmatch(r"[A-Za-z0-9_./-]+", p) and not p.startswith("/")
                 and ".." not in p.split("/") for p in value("paths"))))
    return problems + [f"{field}: invalid" for field, ok in checks if field in entry and not ok]


def manifest_problems(entries):
    return [f"{MANIFEST}: entry {i} ({e.get('id') if isinstance(e, dict) else e!r}) {p}"
            for i, e in enumerate(entries) for p in entry_problems(e)]


def fetch_source(entry, download, cache):
    """Unpack the pinned commit's archive whole and move it to .quality/external/<id>/."""
    EXTERNAL.mkdir(parents=True, exist_ok=True)
    scratch = Path(tempfile.mkdtemp(dir=EXTERNAL, prefix=".fetch-"))
    try:
        url = f"{entry['repo'].rstrip('/')}/archive/{entry['commit']}.tar.gz"
        if url not in cache:
            cache[url] = download(url)
        with tarfile.open(fileobj=BytesIO(cache[url]), mode="r:gz") as archive:
            archive.extractall(scratch, filter="data")
        tops = list(scratch.iterdir())
        if len(tops) != 1:
            raise ValueError("the archive does not hold exactly one top folder")
        target = EXTERNAL / entry["id"]
        if target.is_dir():  # an empty leftover of an interrupted run
            target.rmdir()
        shutil.move(tops[0], target)
    finally:
        shutil.rmtree(scratch, ignore_errors=True)


def fetch(entries, download):
    """Fetch every source whose folder is absent or empty; print one line each; return the exit code."""
    if manifest_problems(entries):  # main checks first; a direct caller gets the same refusal
        return 2
    cache = {}  # one download per repo and commit
    for entry in entries:
        folder = EXTERNAL / entry["id"]
        if folder.exists() and any(folder.iterdir()):
            continue
        try:
            fetch_source(entry, download, cache)
        except (OSError, tarfile.TarError, ValueError, EOFError, http.client.HTTPException) as error:
            print(f"cannot fetch {entry['id']}: {error}", file=sys.stderr)
            return 1
        print(f"fetched {entry['id']}")
    return 0


def config_arguments(entries, mode):
    return " ".join(f"--config {EXTERNAL}/{e['id']}/{path}"
                    for e in entries if e["mode"] == mode for path in e["paths"])


def main(argv=None, download=download_archive):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("fetch")
    commands.add_parser("paths").add_argument("mode", choices=MODES)
    args = parser.parse_args(argv)
    try:
        entries = json.loads(MANIFEST.read_text(encoding="utf-8"))
    except (OSError, ValueError) as error:  # ValueError covers bad JSON and bad UTF-8
        print(f"cannot read {MANIFEST}: {error}", file=sys.stderr)
        return 2
    if not isinstance(entries, list):
        print(f"{MANIFEST}: must be a list of entries", file=sys.stderr)
        return 2
    problems = manifest_problems(entries)
    if problems:
        print("\n".join(problems), file=sys.stderr)
        return 2
    if args.command == "fetch":
        return fetch(entries, download)
    print(config_arguments(entries, args.mode))
    return 0


if __name__ == "__main__":
    sys.exit(main())
