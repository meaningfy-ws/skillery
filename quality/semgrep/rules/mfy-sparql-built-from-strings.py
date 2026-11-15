QUERY = "SELECT ?s WHERE { ?s a ex:Thing }"


def bad_fstring(name):
    # ruleid: mfy-sparql-built-from-strings
    return f"SELECT ?s WHERE {{ ?s rdfs:label '{name}' }}"


def bad_concat(name):
    # ruleid: mfy-sparql-built-from-strings
    return "SELECT ?s WHERE { ?s rdfs:label '" + name + "' }"


def bad_percent(name):
    # ruleid: mfy-sparql-built-from-strings
    return "ASK { ?s rdfs:label '%s' }" % name


def bad_format(name):
    # ruleid: mfy-sparql-built-from-strings
    return "SELECT ?s WHERE {{ ?s rdfs:label '{}' }}".format(name)


def bad_modify(name):
    # ruleid: mfy-sparql-built-from-strings
    return f"DELETE {{ ?s ?p ?o }} INSERT {{ ?s rdfs:label '{name}' }} WHERE {{ ?s ?p ?o }}"


def bad_insert_where(name):
    # ruleid: mfy-sparql-built-from-strings
    return "INSERT { ?s rdfs:label '" + name + "' } WHERE { ?s a ex:Thing }"


def bad_drop_graph(g):
    # ruleid: mfy-sparql-built-from-strings
    return f"DROP GRAPH <{g}>"


def bad_clear_silent(g):
    # ruleid: mfy-sparql-built-from-strings
    return "CLEAR SILENT GRAPH <%s>" % g


def good():
    # ok: mfy-sparql-built-from-strings
    return QUERY


def good_bound(store, name):
    # ok: mfy-sparql-built-from-strings
    return store.query(QUERY, initBindings={"name": name})


def also_good(d, name):
    # ok: mfy-sparql-built-from-strings
    return f"please select one of {d} or ask {{name}}"


def also_good_words(name, n):
    # ok: mfy-sparql-built-from-strings
    return f"please add all {name} and move on to {n}, then drop it or clear the desk"


def also_good_plus(a, b):
    # ok: mfy-sparql-built-from-strings
    return "please select " + a + " where " + b
