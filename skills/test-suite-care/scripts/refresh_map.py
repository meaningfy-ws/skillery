"""Keep a scenario map in step with the collected tests.

Usage:  pytest --collect-only -qq > <out>/collect.txt
        refresh_map.py --map tests/audit/scenario-map.csv --collect <out>/collect.txt   (or - for stdin)

Each collected node id is reduced to its function id (the `[case]` suffix dropped). The rows whose
function is gone are removed, and the function ids with no row are listed for a person to map.
The map is replaced whole or not at all, with its line endings kept.

Exit 0: nothing to map. 1: ids with no row are listed. The map is left untouched with
2: the collection failed (no node id, or a collection error in the output);
3: more than a fifth of the rows would go;
4: the map has no `test` column or a short row.

Standard library only.
"""
import argparse
import csv
import io
import re
import sys
from pathlib import Path

MAX_REMOVED_SHARE = 0.2
_ERROR = re.compile(r"^ERROR\b|\b\d+ errors?\b", re.M)


class MalformedMap(ValueError):
    pass


def function_ids(collect_output):
    ids = set()
    for line in collect_output.splitlines():
        node = line.strip().split("[", 1)[0]
        if "::" in node and " " not in node:
            ids.add(node)
    return ids


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


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.split("\n", 1)[0])
    parser.add_argument("--map", type=Path, required=True)
    parser.add_argument("--collect", required=True, help="pytest --collect-only -qq output, or - for stdin")
    args = parser.parse_args(argv)
    output = sys.stdin.read() if args.collect == "-" else Path(args.collect).read_text(encoding="utf-8")
    collected = function_ids(output)
    if not collected or _ERROR.search(output):
        print(f"The collection failed ({len(collected)} ids): map kept", file=sys.stderr)
        return 2
    try:
        text, removed, new, total = refresh(args.map.read_bytes().decode("utf-8"), collected)
    except MalformedMap as exc:
        print(f"The map is malformed ({exc}): map kept", file=sys.stderr)
        return 4
    if len(removed) > MAX_REMOVED_SHARE * total:
        print(f"Refused: {len(removed)} of {total} rows would go: map kept", file=sys.stderr)
        return 3
    temporary = args.map.with_name(args.map.name + ".tmp")
    temporary.write_bytes(text.encode("utf-8"))
    temporary.replace(args.map)
    print(f"Removed rows ({len(removed)}):", *(f"  {t}" for t in removed), sep="\n")
    print(f"New ids with no row ({len(new)}):", *(f"  {t}" for t in new), sep="\n")
    return 1 if new else 0


if __name__ == "__main__":
    sys.exit(main())
