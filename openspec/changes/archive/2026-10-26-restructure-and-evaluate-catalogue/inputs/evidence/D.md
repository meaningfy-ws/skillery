# Evidence: batch D (missing trigger probes)

**Batch:** D · **Approved:** no model runs · **Environment:** repository only · **Model ids
reported:** none

The audit found two skills with no trigger probe. Each now has a positive probe and a near-miss in
`tests/trigger_probes.yaml`, and two neighbours gained the matching near-miss in the other direction.

| Item | Posture | Change | Eval | Model | Runs | Before | After | Cost | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| `linkml-engineering` | precise | positive probe ("derive a LinkML schema from this UML model…"), near-miss of `conceptual-modelling` | `trigger_probe_report` coverage | none | 0 | no probe | covered | $0 | kept |
| `modelling-conventions` | reusable | positive probe ("review this model for naming anti-patterns…"), near-miss of `conceptual-modelling` | `trigger_probe_report` coverage | none | 0 | no probe | covered | $0 | kept |
| `conceptual-modelling` | precise | near-miss probe against `linkml-engineering` | neighbour pairing | none | 0 | one-sided | paired | $0 | kept |
| `architecture` | reusable | near-miss probe against `modelling-conventions` | neighbour pairing | none | 0 | one-sided | paired | $0 | kept |
