#!/usr/bin/env python3
"""Fetch and list the pinned external Semgrep rule sources. Standard library only.

    python3 scripts/quality/external_sources.py fetch
    python3 scripts/quality/external_sources.py paths gate|report-only

Reads .quality/semgrep/external.json relative to the working directory; sources live in
.quality/external/<id>/. Exit codes: 0 done, 1 a source could not be fetched, 2 no manifest.
"""
import argparse
import json
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
DOWNLOAD_TIMEOUT_SECONDS = 60


def download_archive(url):
    with urllib.request.urlopen(url, timeout=DOWNLOAD_TIMEOUT_SECONDS) as response:  # noqa: S310 -- https url from the pinned manifest
        return response.read()


def fetch_source(entry, download):
    """Unpack the pinned commit's archive whole and move it to .quality/external/<id>/."""
    EXTERNAL.mkdir(parents=True, exist_ok=True)
    scratch = Path(tempfile.mkdtemp(dir=EXTERNAL, prefix=".fetch-"))
    try:
        data = download(f"{entry['repo']}/archive/{entry['commit']}.tar.gz")
        with tarfile.open(fileobj=BytesIO(data), mode="r:gz") as archive:
            archive.extractall(scratch, filter="data")
        tops = list(scratch.iterdir())
        if len(tops) != 1:
            raise ValueError("the archive does not hold exactly one top folder")
        shutil.move(tops[0], EXTERNAL / entry["id"])
    finally:
        shutil.rmtree(scratch, ignore_errors=True)


def fetch(entries, download):
    """Fetch every source whose folder is absent; print one line each; return the exit code."""
    for entry in entries:
        if (EXTERNAL / entry["id"]).exists():
            continue
        try:
            fetch_source(entry, download)
        except (OSError, tarfile.TarError, ValueError) as error:
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
    except OSError as error:
        print(f"cannot read {MANIFEST}: {error}", file=sys.stderr)
        return 2
    if args.command == "fetch":
        return fetch(entries, download)
    print(config_arguments(entries, args.mode))
    return 0


if __name__ == "__main__":
    sys.exit(main())
