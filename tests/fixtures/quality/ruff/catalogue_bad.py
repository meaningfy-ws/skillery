"""Probe: which Ruff rules flag catalogued rules beyond the hygiene group. Every function is a bad case."""
import os


def env_read_getenv():
    return os.getenv("GRAPH_URL")  # expect: TID251


def env_read_environ():
    return os.environ["GRAPH_URL"]  # expect: TID251


def magic_string_comparison(kind):
    if kind == "resource":  # expect: PLR2004
        return 1
    return 0


def magic_number_comparison(n):
    return n > 42  # expect: PLR2004


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


def too_many_branches(a):  # expect: PLR0912
    if a == 1:
        return 1
    elif a == 2:
        return 2
    elif a == 3:
        return 3
    elif a == 4:
        return 4
    elif a == 5:
        return 5
    elif a == 6:
        return 6
    elif a == 7:
        return 7
    elif a == 8:
        return 8
    elif a == 9:
        return 9
    elif a == 10:
        return 10
    elif a == 11:
        return 11
    elif a == 12:
        return 12
    elif a == 13:
        return 13
    return 0


def too_many_statements(a):  # expect: PLR0915
    a += 1
    a += 2
    a += 3
    a += 4
    a += 5
    a += 6
    a += 7
    a += 8
    a += 9
    a += 10
    a += 11
    a += 12
    a += 13
    a += 14
    a += 15
    a += 16
    a += 17
    a += 18
    a += 19
    a += 20
    a += 21
    a += 22
    a += 23
    a += 24
    a += 25
    a += 26
    a += 27
    a += 28
    a += 29
    a += 30
    a += 31
    a += 32
    a += 33
    a += 34
    a += 35
    a += 36
    a += 37
    a += 38
    a += 39
    a += 40
    a += 41
    a += 42
    a += 43
    a += 44
    a += 45
    a += 46
    a += 47
    a += 48
    a += 49
    a += 50
    a += 51
    return a


def too_many_arguments(a, b, c, d, e, f, g):  # expect: PLR0913
    return a, b, c, d, e, f, g


def test_composite_assertion():
    a, b = 1, 2
    assert a == 1 and b == 2  # expect: PT018
