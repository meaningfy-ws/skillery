"""pytest plugin: one JSON line per test phase and per fixture set-up.

Run:  PYTHONPATH=<this folder> PYTEST_ADDOPTS="-p phase_times --phase-times-out=<out>" <test command>

- Phase lines, written to <out> by the controller (the only process without xdist):
  {"test": nodeid, "phase": "setup"|"call"|"teardown", "outcome": ..., "seconds": float}
- Fixture lines, written by the process that runs the test, each time a fixture is built, to a
  file of their own: <out>.fixtures without xdist, <out>.<worker id> under xdist.
  {"fixture": name, "scope": scope, "test": nodeid, "seconds": float}
  Read <out> for phases and every <out>.* for fixtures.

Standard library and pytest's hooks only; writes nothing but those files.
"""
import json
import time

import pytest

_KEY = pytest.StashKey()
_CONFIG = {}  # pytest_runtest_logreport receives no config


def pytest_addoption(parser):
    parser.addoption("--phase-times-out", default=None, help="file for the phase lines; fixture lines go beside it")


def pytest_configure(config):
    _CONFIG["config"] = config
    out = config.getoption("phase_times_out")
    if not out:
        return
    worker = getattr(config, "workerinput", {}).get("workerid")
    phases = None if worker else open(out, "w", encoding="utf-8")
    fixtures = open(f"{out}.{worker or 'fixtures'}", "w", encoding="utf-8")
    config.stash[_KEY] = (phases, fixtures)


def pytest_unconfigure(config):
    for handle in config.stash.get(_KEY, ()):
        if handle:
            handle.close()


def _write(handle, line):
    if handle:
        handle.write(json.dumps(line) + "\n")
        handle.flush()


@pytest.hookimpl(hookwrapper=True)
def pytest_fixture_setup(fixturedef, request):
    start = time.perf_counter()
    yield
    entry = request.config.stash.get(_KEY, None)
    if entry:
        item = getattr(request, "_pyfuncitem", request.node)
        _write(entry[1], {"fixture": fixturedef.argname, "scope": fixturedef.scope,
                          "test": item.nodeid, "seconds": time.perf_counter() - start})


def pytest_runtest_logreport(report):
    config = _CONFIG.get("config")
    entry = config and config.stash.get(_KEY, None)
    if entry:  # a worker's reports reach the controller, which alone holds the phase file
        _write(entry[0], {"test": report.nodeid, "phase": report.when,
                          "outcome": report.outcome, "seconds": report.duration})
