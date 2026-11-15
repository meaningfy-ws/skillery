def bad_tuple(uid, name):
    # ruleid: mfy-dict-as-model
    return {"uid": uid, "dataset_name": name}, 200


def bad_plain(x, y):
    # ruleid: mfy-dict-as-model
    return {"a": x, "b": y}


def good_empty():
    # ok: mfy-dict-as-model
    return {}


def good_model(row):
    # ok: mfy-dict-as-model
    return Model(**row)


def good_argument(client, x):
    # ok: mfy-dict-as-model
    return client.post(json={"a": x})
