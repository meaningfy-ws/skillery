"""Probe: which Ruff rules flag catalogued rules beyond the hygiene group. Every function is a bad case."""
import os


def env_read_getenv():
    return os.getenv("GRAPH_URL")


def env_read_environ():
    return os.environ["GRAPH_URL"]


def magic_string_comparison(kind):
    if kind == "resource":
        return 1
    return 0


def magic_number_comparison(n):
    return n > 42


def sparql_fstring(name):
    return f"SELECT ?s WHERE {{ ?s rdfs:label '{name}' }}"


def sparql_concat(name):
    return "SELECT ?s WHERE { ?s rdfs:label '" + name + "' }"


def sql_fstring(name):
    return f"SELECT * FROM t WHERE name = '{name}'"


def deep_nesting(a):
    for x in a:
        if x:
            for y in x:
                if y:
                    for z in y:
                        if z:
                            return z
    return None


def too_many_arguments(a, b, c, d, e, f, g):
    return a, b, c, d, e, f, g


def test_composite_assertion():
    a, b = 1, 2
    assert a == 1 and b == 2
