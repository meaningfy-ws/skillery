"""Print the tests to run for the files changed against a base branch (``make test-changed``).

Run from the repository root: ``python -m tests.changed <base>``; the target passes ``$(BASE)``,
default ``develop``.

Input: the files of ``git diff --name-only --no-renames <merge base of HEAD and base>`` plus the
untracked files of ``git ls-files --others --exclude-standard``. A deleted file is matched like a
changed one. The first rule that matches a path decides:

=====================================================================  ==========================
Path                                                                   Result
=====================================================================  ==========================
``pytest.ini``, ``pyproject.toml``, a lock file, ``Makefile``,         fall back
``.coveragerc`` at the root
``tests/unit/<folder>/...``                                            ``tests/unit/<folder>/``
``tests/unit/test_*.py``                                               that file
``tests/feature/...``                                                  ``tests/feature/``
``tests/integration/...``, ``tests/e2e/...``                           no test; a hint on stderr
any other file under ``tests/`` (a conftest, test data, this file)     fall back
``<<PACKAGE>>/<layer>/...``                                            ``tests/unit/<layer>/`` if
                                                                       it exists, else fall back
any other file under ``<<PACKAGE>>/``                                  fall back
anything else (docs, specs, CI files)                                  no test
=====================================================================  ==========================

Output: the pytest paths on stdout, one per line, sorted, each once; a path that no longer exists
is left out. Nothing when no test is to run, and nothing on a fallback; each fallback's reason
goes to stderr.

Exit: 0; 3 when any path fell back (the target then runs ``make test-fast``); 2 when git fails or
the base does not exist.
"""

import subprocess
import sys
from pathlib import Path

PACKAGE = "<<PACKAGE>>"
ROOT_FILES = {"pytest.ini", "pyproject.toml", "Makefile", ".coveragerc"}
OK, ERROR, FALLBACK = 0, 2, 3


class FallbackError(Exception):
    """The change reaches more than a known set of tests: run ``make test-fast``."""


def _git(*args: str) -> list[str]:
    run = subprocess.run(["git", *args], capture_output=True, text=True, check=True)
    return [line for line in run.stdout.splitlines() if line]


def _under_tests(parts: list[str], path: str) -> str | None:
    tier = parts[1] if len(parts) > 2 else ""
    if tier == "unit" and len(parts) > 3:
        return f"tests/unit/{parts[2]}/"
    if tier == "unit" and parts[2].startswith("test_") and parts[2].endswith(".py"):
        return path
    if tier == "feature":
        return "tests/feature/"
    if tier in ("integration", "e2e"):
        print(f"{path}: run make test-{tier}", file=sys.stderr)
        return None
    raise FallbackError(f"{path}: shared test code")


def tests_for(path: str) -> str | None:
    """The pytest path for one changed file, None for no test; raises FallbackError."""
    parts = path.split("/")
    if len(parts) == 1 and (path in ROOT_FILES or path.endswith(".lock")):
        raise FallbackError(f"{path}: changes every run")
    if parts[0] == "tests":
        return _under_tests(parts, path)
    if parts[0] == PACKAGE:
        folder = Path("tests/unit", parts[1])
        if len(parts) > 2 and folder.is_dir():
            return f"{folder}/"
        raise FallbackError(f"{path}: no unit test folder for it")
    return None


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: python -m tests.changed <base>", file=sys.stderr)
        return ERROR
    try:
        merge_base = _git("merge-base", "HEAD", argv[1])[0]
        changed = _git("diff", "--name-only", "--no-renames", merge_base)
        changed += _git("ls-files", "--others", "--exclude-standard")
    except (subprocess.CalledProcessError, OSError, IndexError) as exc:
        print(f"git failed: {exc}", file=sys.stderr)
        return ERROR
    paths, fell_back = set(), False
    for path in changed:
        try:
            found = tests_for(path)
        except FallbackError as reason:
            print(f"fall back to make test-fast: {reason}", file=sys.stderr)
            fell_back = True
            continue
        if found and Path(found).exists():
            paths.add(found)
    if fell_back:
        return FALLBACK
    if paths:
        print("\n".join(sorted(paths)))
    return OK


if __name__ == "__main__":
    sys.exit(main(sys.argv))
