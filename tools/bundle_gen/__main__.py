"""Entrypoint: `python -m tools.bundle_gen [generate|check] [repo]`.

`generate` (default) writes the renderings and syncs `package.json` version.
`check` runs the read-only gate (`make lint` runs the same gate via repo_lint).
"""
import sys
from pathlib import Path

from tools.bundle_gen.gen import gate_errors, write


def main(argv: list[str] | None = None) -> int:
    args = list(argv or [])
    cmd = args[0] if args and args[0] in ("generate", "check") else "generate"
    rest = [a for a in args if a not in ("generate", "check")]
    repo = Path(rest[0]) if rest else Path(__file__).resolve().parents[2]

    if cmd == "check":
        problems = gate_errors(repo)
        if problems:
            print(f"FAIL — {len(problems)} bundle gate problem(s):")
            for p in problems:
                print(f"  - {p}")
            return 1
        print("OK — bundle renderings in sync.")
        return 0

    try:
        written = write(repo)
    except ValueError as exc:
        print(f"FAIL — {exc}")
        return 1
    print(f"rendered {len(written)} file(s)/link(s) from bundles.yaml.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
