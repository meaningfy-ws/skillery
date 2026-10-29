"""Spike: is a plain decision-table lint enough for rule-set consistency, or is clingo needed?

Toy 'offers' playbook. A rule fires when every scope tag it names matches the situation.
Conflict = two rules fire, set the same slot to different values, same strength, neither scope
strictly more specific. Dead = never wins in any situation. Gap = a slot with no winner.
"""
from itertools import product

DIMS = {
    "client": ["public", "private", "us"],
    "channel": ["email", "tender", "call"],
    "lang": ["en", "fr"],
}
STRENGTH = {"hard": 3, "default": 2, "soft": 1}

RULES = [  # id, scope, slot, value, strength
    ("R1", {}, "spelling", "british", "default"),
    ("R2", {"client": "us"}, "spelling", "american", "default"),        # exception to R1
    ("R3", {}, "send", "after_approval", "hard"),
    ("R4", {"channel": "tender"}, "first_step", "compliance_matrix", "default"),
    ("R5", {"client": "public"}, "pricing", "fixed", "default"),
    ("R6", {"channel": "tender"}, "pricing", "time_and_materials", "default"),  # clashes with R5
    ("R7", {"channel": "email"}, "length", "under_400_words", "soft"),
    ("R8", {"client": "us", "channel": "email"}, "length", "under_400_words", "soft"),  # redundant
    ("R9", {"lang": "fr"}, "send", "immediately", "default"),  # dead: R3 is hard
]


def fires(scope, sit):
    return all(sit[k] == v for k, v in scope.items())


def more_specific(a, b):
    return set(b.items()) < set(a.items())


def winners(sit, slot):
    live = [r for r in RULES if r[2] == slot and fires(r[1], sit)]
    best = [r for r in live if not any(
        STRENGTH[o[4]] > STRENGTH[r[4]] or (o[4] == r[4] and more_specific(o[1], r[1])) for o in live)]
    return live, best


def lint():
    slots = sorted({r[2] for r in RULES})
    conflicts, won = set(), set()
    for combo in product(*DIMS.values()):
        sit = dict(zip(DIMS, combo))
        for slot in slots:
            _, best = winners(sit, slot)
            won |= {r[0] for r in best}
            if len({r[3] for r in best}) > 1:
                conflicts.add((tuple(sorted(r[0] for r in best)), slot, combo))
    dead = [r[0] for r in RULES if r[0] not in won]
    # redundant: a broader rule already says the same thing at the same strength
    redundant = [r[0] for r in RULES if any(
        o is not r and o[2:] == r[2:] and set(o[1].items()) < set(r[1].items()) for o in RULES)]
    return conflicts, dead, redundant


if __name__ == "__main__":
    conflicts, dead, redundant = lint()
    by_pair = {}
    for pair, slot, combo in conflicts:
        by_pair.setdefault((pair, slot), []).append(combo)
    for (pair, slot), combos in sorted(by_pair.items()):
        print(f"CONFLICT {pair} on '{slot}' e.g. {combos[0]} ({len(combos)} situations)")
    print("DEAD (never wins):", dead)
    print("REDUNDANT (broader rule says the same):", redundant)
    assert by_pair.keys() == {(("R5", "R6"), "pricing")}, by_pair.keys()
    assert dead == ["R9"], dead
    assert redundant == ["R8"], redundant
    print("self-check OK")
