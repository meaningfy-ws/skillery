"""pytest plugin: one JSON line per test phase and per fixture set-up.

Run:  PYTHONPATH=<this folder> PYTEST_ADDOPTS="-p phase_times --phase-times-out=<out>" <test command>

- Phase lines, written by the controller (the only process without xdist):
  {"test": nodeid, "phase": "setup"|"call"|"teardown", "outcome": ..., "seconds": float}
- Fixture lines, written by the process that runs the test, each time a fixture is built:
  {"fixture": name, "scope": scope, "test": nodeid, "seconds": float}
  An xdist worker writes to <out>.<worker id>; read <out> and every <out>.* together.

Standard library and pytest's hooks only; writes nothing but <out>.
"""
import json
import time

import pytest

_KEY = pytest.StashKey()
_CONFIG = {}  # pytest_runtest_logreport receives no config


def pytest_addoption(parser):
    parser.addoption("--phase-times-out", default=None, help="file for the phase and fixture lines")


def pytest_configure(config):
    _CONFIG["config"] = config
    out = config.getoption("phase_times_out")
    if not out:
        return
    worker = getattr(config, "workerinput", {}).get("workerid")
    config.stash[_KEY] = (open(f"{out}.{worker}" if worker else out, "w", encoding="utf-8"), bool(worker))


def pytest_unconfigure(config):
    entry = config.stash.get(_KEY, None)
    if entry:
        entry[0].close()


def _write(config, line):
    entry = config.stash.get(_KEY, None)
    if entry:
        entry[0].write(json.dumps(line) + "\n")
        entry[0].flush()


@pytest.hookimpl(hookwrapper=True)
def pytest_fixture_setup(fixturedef, request):
    start = time.perf_counter()
    yield
    item = getattr(request, "_pyfuncitem", request.node)
    _write(request.config, {"fixture": fixturedef.argname, "scope": fixturedef.scope,
                            "test": item.nodeid, "seconds": time.perf_counter() - start})


def pytest_runtest_logreport(report):
    config = _CONFIG.get("config")
    entry = config and config.stash.get(_KEY, None)
    if entry and not entry[1]:  # a worker's reports reach the controller, which writes them once
        _write(config, {"test": report.nodeid, "phase": report.when,
                        "outcome": report.outcome, "seconds": report.duration})
