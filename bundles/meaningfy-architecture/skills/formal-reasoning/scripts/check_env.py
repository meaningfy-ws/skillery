#!/usr/bin/env python3
"""Report which reasoning engines are present. Never installs anything.

    python check_env.py [--need clingo|prolog|any]

Prints one line per engine: present with its version, or missing with a hint that names the
dependencies.yaml entry. Exits 3 when an engine named by --need is missing, else 0.
Needs Python >= 3.11 and the standard library only.
"""
import argparse
import importlib.util
import shutil
import subprocess
import sys

MISSING = 3
# One line per engine (design D-9): name the register entry, never copy the install procedure.
HINTS = {
    "clingo": "install it as the `clingo` entry of skillery's dependencies.yaml says "
              "(see docs/environment/setup.md)",
    "prolog": "install it as the `SWI-Prolog` entry of skillery's dependencies.yaml says "
              "(see docs/environment/setup.md)",
}


def clingo_version():
    """The clingo version string, or None when the Python package is absent."""
    if importlib.util.find_spec("clingo") is None:
        return None
    import clingo  # lazy: Prolog-only users need no clingo
    return clingo.__version__


def swipl_version():
    """The `swipl --version` line, or None when swipl is not on PATH."""
    exe = shutil.which("swipl")
    if exe is None:
        return None
    out = subprocess.run([exe, "--version"], capture_output=True, text=True, timeout=30)
    return out.stdout.strip() or out.stderr.strip()


def status():
    return {"clingo": clingo_version(), "prolog": swipl_version()}


def missing_message(engine):
    label = "clingo" if engine == "clingo" else "SWI-Prolog (swipl)"
    return f"{label}: missing; {HINTS[engine]}"


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--need", choices=["clingo", "prolog", "any"])
    args = ap.parse_args(argv)
    found = status()
    for engine, version in found.items():
        print(f"{engine}: present, {version}" if version else missing_message(engine))
    if args.need == "any":
        return 0 if any(found.values()) else MISSING
    if args.need:
        return 0 if found[args.need] else MISSING
    return 0


if __name__ == "__main__":
    sys.exit(main())
