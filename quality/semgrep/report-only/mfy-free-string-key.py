def bad_subscript(row):
    # ruleid: mfy-free-string-key
    return row["status"]


def bad_hasattr(obj):
    # ruleid: mfy-free-string-key
    return hasattr(obj, "name")


def bad_getattr(obj):
    # ruleid: mfy-free-string-key
    return getattr(obj, "name")


def good_constant(row):
    # ok: mfy-free-string-key
    return row[STATUS]


def good_index(row):
    # ok: mfy-free-string-key
    return row[0]


def good_dynamic(obj, attr):
    # ok: mfy-free-string-key
    return getattr(obj, attr)
