def test_bad(g, expected):
    # ruleid: mfy-test-rdf-string-compare
    assert g.serialize(format="turtle") == expected


def test_bad_reversed(g, expected):
    # ruleid: mfy-test-rdf-string-compare
    assert expected == g.serialize(format="nt")


def test_good_graph(g, expected):
    # ok: mfy-test-rdf-string-compare
    assert isomorphic(g, expected)


def test_good_length(g):
    # ok: mfy-test-rdf-string-compare
    assert len(g.serialize()) > 0
