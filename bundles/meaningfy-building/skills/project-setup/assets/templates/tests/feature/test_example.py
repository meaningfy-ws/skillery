"""pytest-bdd step definitions for ``example.feature``.

This illustrative feature is wired to a tiny inline behaviour so it runs green
on a fresh skeleton with no production code. When you write your first real
feature, point the steps at a service in ``<<PACKAGE>>`` (e.g.
``from <<PACKAGE>>.<component>.services import greet``) and delete this stub.

Files mirror business capabilities: each ``.feature`` describes one capability
in business language; the matching ``test_*.py`` binds its scenarios with
``scenarios(...)`` and provides the @given/@when/@then steps.
"""

from pytest_bdd import given, parsers, scenarios, then, when

# Bind every scenario in the sibling .feature file in one call.
scenarios("example.feature")


# --- Stub behaviour under test --------------------------------------------
# Replace with an import from <<PACKAGE>> once the real service exists.
def _greet(name: str) -> str:
    return f"Hello, {name}!"


# --- Given -----------------------------------------------------------------
@given(parsers.parse('a visitor named "{name}"'), target_fixture="visitor_name")
def visitor_named(name: str) -> str:
    return name


# --- When ------------------------------------------------------------------
@when("the visitor is greeted", target_fixture="greeting")
def greet_visitor(visitor_name: str) -> str:
    return _greet(visitor_name)


# --- Then ------------------------------------------------------------------
@then(parsers.parse('the greeting reads "{expected}"'))
def greeting_reads(greeting: str, expected: str) -> None:
    assert greeting == expected
