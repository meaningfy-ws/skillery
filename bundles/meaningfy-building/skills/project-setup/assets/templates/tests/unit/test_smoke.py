"""Smoke test — proves the package imports and exposes a version.

Keeps ``make test`` green on a fresh skeleton before any real code exists.
Replace or extend with genuine unit tests as the package grows; do not delete
the import assertion — it is the cheapest guard against a broken package layout
(missing ``__init__.py``, bad ``pyproject`` package discovery, etc.).
"""

import importlib


def test_package_imports() -> None:
    """The top-level package can be imported."""
    module = importlib.import_module("<<PACKAGE>>")
    assert module is not None


def test_package_exposes_version() -> None:
    """The package exposes a non-empty ``__version__`` string."""
    module = importlib.import_module("<<PACKAGE>>")
    version = getattr(module, "__version__", None)
    assert isinstance(version, str)
    assert version
