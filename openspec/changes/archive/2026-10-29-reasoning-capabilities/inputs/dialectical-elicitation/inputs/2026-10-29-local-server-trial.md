# Option 2: a local elenchus-server trial

Secondary input. This is the owner's decision of 2026-10-29: try the real server once on the owner's
laptop, then re-shape this EPIC. The server is a reference, never a dependency (option 1 below).
Commands come from the server README (v0.14.1, MIT, (c) 2026 University of Amsterdam).

## Setup (one time, isolated)

```bash
uv venv ~/software/elenchus/.venv
uv pip install --python ~/software/elenchus/.venv/bin/python elenchus
export ELENCHUS_API_KEY=sk-ant-...        # or ANTHROPIC_API_KEY; the server bills its own model calls
export ELENCHUS_DATA=~/software/elenchus/data
~/software/elenchus/.venv/bin/elenchus admin create --email admin@local --name "Admin"
~/software/elenchus/.venv/bin/elenchus        # then open http://localhost:8741
```

Optional settings:
- `ELENCHUS_MODEL`: the default is the author's choice of Claude model.
- `ELENCHUS_TEMPERATURE`: the default is 1.0.
- `ELENCHUS_ENABLE_PHASE_B`: adds ASSERT_IMPLICATION and INTRODUCE_BEARER.

A lighter route, without the web UI: `elenchus-cli --name "PROV-O 3.1"` runs an in-memory session.

## Trial script

1. **Positum.** Paste PROV-O §3.1 (about 350 words), as the paper did.
2. **Session.** Play the respondent for at most 45 minutes. Accept or contest each focal tension.
3. **Record.**
   - The trajectory: commitments, then challenges, then the final C, I and retractions. The paper's run was 10, then 7, then 19, 9 and 1.
   - How many challenges felt real versus noise.
   - Fatigue.
   - Cost, from the server's cost ledger.
4. **Derivability.** Run a derivability query on two or three implications from the session.
5. **Export.** Export the session data if the UI allows it, and keep it next to this file under `trial/`.
   Keep client material out: use PROV-O or a public ontology only.

## What the trial decides (feeds the re-shaped pitch)

- **The opponent's prompt rules and JSON speech-act envelope** that the skill (option 1) reproduces in our own words.
- **Whether Phase B acts** (introducing implications and bearers) are worth having for ontology work.
- **The acceptance oracles** for the skill: does our skill on the same positum reach a comparable trajectory?
- **Whether a shared hosted instance (option 3)** is ever worth proposing to the infrastructure stacks repo. The default is no.
