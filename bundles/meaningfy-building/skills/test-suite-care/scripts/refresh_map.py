"""Keep a scenario map in step with the collected tests.

Usage:  pytest --collect-only -q -o addopts="" > <out>/collect.txt
        python refresh_map.py --map tests/audit/scenario-map.csv --collect <out>/collect.txt   (or - for stdin)

Collect the whole suite, one node id per line: `-q` exactly once (the project's own `addopts` may
add another `-q`, and `-qq` prints counts, not ids), no marker filter and no deselection.

Each collected node id is reduced to its function id (the `[case]` suffix dropped). The rows whose
function is gone are removed, and the function ids with no row are listed for a person to map.
The map is replaced whole or not at all, with its line endings and file mode kept.

Exit 0: nothing to map. 1: ids with no row are listed. The map is left untouched with
2: an input cannot be read, or the collection failed, was filtered or listed no node id;
3: more than a fifth of the rows would go;
4: the map has no `test` column or a short row.

Standard library only.
"""
import argparse
import csv
import io
import os
import re
import shutil
import sys
import tempfile
from pathlib import Path

MAX_REMOVED_SHARE = 0.2
# summary and error lines carry no "::", so a case id such as [2 errors] never matches
_FAILED_OR_FILTERED = re.compile(r"^(ERROR|Interrupted:)|\b\d+ errors?\b|\bdeselected\b")


class MalformedMap(ValueError):
    pass


def read_collection(collect_output):
    """The function ids collected, and whether the output reports a failed or filtered collection."""
    ids, failed = set(), False
    for line in collect_output.splitlines():
        line = line.strip()
        if "::" in line and not line.startswith("ERROR"):
            ids.add(line.split("[", 1)[0])
        elif _FAILED_OR_FILTERED.search(line):
            failed = True
    return ids, failed


def refresh(map_text, collected):
    """The refreshed map text, the removed function ids, the new ones and the row count."""
    reader = csv.reader(io.StringIO(map_text, newline=""))
    header = next(reader, None)
    if not header or "test" not in header:
        raise MalformedMap("no `test` column in the header")
    column = header.index("test")
    rows = [row for row in reader if row]
    for number, row in enumerate(rows, start=2):
        if len(row) < len(header):
            raise MalformedMap(f"row {number} has {len(row)} of {len(header)} columns")
    out = io.StringIO()
    writer = csv.writer(out, lineterminator="\r\n" if "\r\n" in map_text else "\n")
    writer.writerow(header)
    writer.writerows(row for row in rows if row[column] in collected)
    removed = [row[column] for row in rows if row[column] not in collected]
    new = sorted(collected - {row[column] for row in rows})
    return out.getvalue(), removed, new, len(rows)


def _replace_whole(path, text):
    handle, temporary = tempfile.mkstemp(dir=path.parent, prefix=f".{path.name}.")
    try:
        with os.fdopen(handle, "wb") as f:
            f.write(text.encode("utf-8"))
            f.flush()
            os.fsync(f.fileno())
        shutil.copymode(path, temporary)
        os.replace(temporary, path)
    except BaseException:
        Path(temporary).unlink(missing_ok=True)
        raise


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.split("\n", 1)[0])
    parser.add_argument("--map", type=Path, required=True)
    parser.add_argument("--collect", required=True, help="pytest --collect-only -q output, or - for stdin")
    args = parser.parse_args(argv)
    try:
        output = sys.stdin.read() if args.collect == "-" else Path(args.collect).read_text(encoding="utf-8")
        map_text = args.map.read_bytes().decode("utf-8")
    except (OSError, UnicodeDecodeError) as exc:
        print(f"Cannot read an input ({exc}): map kept", file=sys.stderr)
        return 2
    collected, failed = read_collection(output)
    if failed or not collected:
        print(f"The collection failed or was filtered ({len(collected)} ids): map kept", file=sys.stderr)
        return 2
    try:
        text, removed, new, total = refresh(map_text, collected)
    except MalformedMap as exc:
        print(f"The map is malformed ({exc}): map kept", file=sys.stderr)
        return 4
    if len(removed) > MAX_REMOVED_SHARE * total:
        print(f"Refused: {len(removed)} of {total} rows would go: map kept", file=sys.stderr)
        return 3
    _replace_whole(args.map, text)
    print(f"Removed rows ({len(removed)}):", *(f"  {t}" for t in removed), sep="\n")
    print(f"New ids with no row ({len(new)}):", *(f"  {t}" for t in new), sep="\n")
    return 1 if new else 0


if __name__ == "__main__":
    sys.exit(main())
