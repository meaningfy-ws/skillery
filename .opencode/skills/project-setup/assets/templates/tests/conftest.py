"""Root test configuration for <<PACKAGE>>.

WHY THIS HOOK EXISTS
--------------------
Test-type markers (``unit``, ``feature``, ``e2e``, ``integration``) are stamped
onto every collected test **by file path**, not by per-file ``pytestmark``.

The natural-looking shortcut — putting ``pytestmark = pytest.mark.unit`` in a
``conftest.py`` — is **silently ignored** by pytest: a ``conftest.py`` is loaded
as a *plugin*, not as a *test module*, so module-level ``pytestmark`` never runs.
The supported way to tag a whole tree is the ``pytest_collection_modifyitems``
collection hook below. It is the single source of truth for marker assignment,
so no test file needs to decorate itself and the ``-m`` filters in the Makefile
(``test-unit`` -> ``pytest -m unit`` etc.) stay correct as new tests are added.

Markers must also be registered in ``pytest.ini`` under ``[pytest] markers``
(with ``--strict-markers`` on) or pytest will error on an unknown marker.
"""

from pathlib import Path

import pytest

# Path constants — single source of truth for the test directory structure.
TESTS_ROOT_DIR = Path(__file__).parent
TEST_DATA_DIR = TESTS_ROOT_DIR / "test_data"

# Map a path segment to the marker it implies. Order is irrelevant: each test
# lives under exactly one of these directories.
_MARKER_BY_DIR = {
    "/unit/": "unit",
    "/feature/": "feature",
    "/integration/": "integration",
    "/e2e/": "e2e",
}


def pytest_collection_modifyitems(items: list) -> None:
    """Stamp each collected test with its test-type marker by directory.

    pytest does not honour ``pytestmark`` defined in a ``conftest.py`` (conftest
    is a plugin, not a test module). This collection hook is the correct place
    to apply markers so that ``-m unit``, ``-m feature``, ``-m integration`` and
    ``-m e2e`` filter correctly with zero per-file decoration.

    Args:
        items: The list of collected test items, mutated in place.
    """
    for item in items:
        path = str(item.fspath)
        for directory, marker in _MARKER_BY_DIR.items():
            if directory in path:
                item.add_marker(getattr(pytest.mark, marker))
                break


# ---------------------------------------------------------------------------
# Shared fixtures
# ---------------------------------------------------------------------------
# Put fixtures used across more than one test tree here. Keep narrowly-scoped
# fixtures in the nearest local conftest.py. Example — a testcontainers-backed
# datastore for integration tests (uncomment and adapt when you add one):
#
#     import redis.asyncio as aioredis
#     from testcontainers.redis import RedisContainer
#
#     @pytest.fixture(scope="module")
#     def redis_container():
#         """Start a Redis container once per module (needs Docker)."""
#         with RedisContainer() as container:
#             yield container
#
#     @pytest.fixture
#     async def redis_client(redis_container) -> aioredis.Redis:
#         client = aioredis.Redis(
#             host=redis_container.get_container_host_ip(),
#             port=int(redis_container.get_exposed_port(6379)),
#         )
#         yield client
#         await client.flushdb()
#         await client.aclose()


def load_text_file(relative_path: str) -> str:
    """Load text content from the ``test_data`` directory.

    Args:
        relative_path: Path relative to ``test_data/``, e.g. ``"samples/a.json"``.

    Returns:
        The full file content as a UTF-8 string.

    Raises:
        FileNotFoundError: If the file does not exist.
    """
    file_path = TEST_DATA_DIR / relative_path
    if not file_path.exists():
        raise FileNotFoundError(f"Test data file not found: {file_path}")
    return file_path.read_text(encoding="utf-8")
