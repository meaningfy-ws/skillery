import os

# A bare nosemgrep comment cannot be a case here: `semgrep --test` honours it.
# It is checked by `semgrep scan --disable-nosem` (see quality/README.md).

# ruleid: mfy-suppression-without-reason
y =os.environ["B"]  # nosemgrep: mfy-free-string-key

# ruleid: mfy-suppression-without-reason
z = os.environ["C"]  # noqa

# ruleid: mfy-suppression-without-reason
w = os.environ["D"]  # noqa: E501

# ruleid: mfy-suppression-without-reason
u = os.environ["H"]  # NOQA

# ruleid: mfy-suppression-without-reason
v = os.environ["I"]  # ruff: noqa

# ruleid: mfy-suppression-without-reason
t = os.environ["J"]  # flake8: noqa

# ok: mfy-suppression-without-reason
s = os.environ["K"]  # ruff: noqa -- generated file

# ok: mfy-suppression-without-reason
r = os.environ["L"]  # NOQA: E501 -- a long url

# ok: mfy-suppression-without-reason
a =os.environ["E"]  # nosemgrep: mfy-free-string-key -- the env contract is a string

# ok: mfy-suppression-without-reason
b = os.environ["F"]  # noqa: E501 -- a long url

# ok: mfy-suppression-without-reason
c = os.environ["G"]  # a plain comment
