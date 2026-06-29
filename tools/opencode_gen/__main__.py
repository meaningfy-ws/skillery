"""Entrypoint: `python -m tools.opencode_gen [generate|check] [repo]`.

`generate` (default) emits the committed opencode tree and syncs versions.
`check` runs the drift + parity + version-sync + coverage gates read-only.
"""
import sys
from pathlib import Path

from tools.opencode_gen.gen import all_gate_errors, write_tree


def main(argv: list[str] | None = None) -> int:
    args = list(argv or [])
    cmd = args[0] if args and args[0] in ("generate", "check") else "generate"
    rest = [a for a in args if a not in ("generate", "check")]
    repo = Path(rest[0]) if rest else Path(__file__).resolve().parents[2]

    if cmd == "check":
        problems = all_gate_errors(repo)
        if problems:
            print(f"FAIL — {len(problems)} opencode-gen gate problem(s):")
            for p in problems:
                print(f"  - {p}")
            return 1
        print("OK — opencode tree in sync (drift + parity + version-sync + coverage).")
        return 0

    written = write_tree(repo)
    print(f"generated {len(written)} file(s) into the opencode tree.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
