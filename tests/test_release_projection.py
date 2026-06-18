"""Integration check for the release-projection behaviour in tests/features/release_projection.feature.

Runs the real project-setup scaffold per archetype and asserts the release-lifecycle artifacts
(`SECURITY.md`, PyPI `release.yaml`) appear exactly where the spec says they should. Plain pytest
(no pytest_bdd dependency) so it runs under `make test`.
"""
from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[1]
SCAFFOLD = REPO / "skills/project-setup/scripts/scaffold.sh"
RELEASE_TMPL = REPO / "skills/project-setup/assets/templates/ci/release.yml.tmpl"
SECURITY_TMPL = REPO / "skills/project-setup/assets/templates/root/SECURITY.md.tmpl"

# (archetype, SECURITY.md expected, release.yaml expected) — mirrors the Scenario Outline Examples.
ARCHETYPES = [
    ("library", True, True),
    ("product", True, False),
    ("doc-only", False, False),
]


def _scaffold(target: Path, archetype: str) -> None:
    subprocess.run(
        [
            "bash", str(SCAFFOLD),
            "-p", "demo_pkg", "-n", "Demo", "-a", archetype,
            "--no-lock", "--no-docs", "--no-infra",
            "--target", str(target), "--skip-existing",
        ],
        cwd=REPO, check=True, capture_output=True, text=True,
    )


@pytest.mark.skipif(shutil.which("bash") is None, reason="bash required to run scaffold.sh")
@pytest.mark.parametrize("archetype,want_security,want_release", ARCHETYPES)
def test_release_artifacts_projected_per_archetype(tmp_path, archetype, want_security, want_release):
    target = tmp_path / archetype
    target.mkdir()
    _scaffold(target, archetype)

    assert (target / "SECURITY.md").exists() is want_security, f"{archetype}: SECURITY.md"
    assert (target / ".github/workflows/release.yaml").exists() is want_release, f"{archetype}: release.yaml"


def test_release_template_publishes_without_a_token():
    """Scenario: a library publishes to PyPI without a stored token — OIDC, no API token."""
    text = RELEASE_TMPL.read_text(encoding="utf-8")
    assert "id-token: write" in text
    assert "pypa/gh-action-pypi-publish" in text
    assert "test.pypi.org" in text  # the dry-run gate
    assert "PYPI_API_TOKEN" not in text and "password:" not in text


def test_security_policy_yanks_rather_than_deletes():
    """Scenario: a broken release is yanked, not deleted."""
    text = SECURITY_TMPL.read_text(encoding="utf-8").lower()
    assert "yank" in text and "never deleted" in text
