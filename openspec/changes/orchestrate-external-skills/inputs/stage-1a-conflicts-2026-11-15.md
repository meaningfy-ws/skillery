# Stage 1a conflicts — the owner's answers

**Status:** secondary input, never groomed. Recorded on 2026-11-15 (task 1.6, design D-6). The
conflicts come from the eight reading records in [`../evidence/reading/`](../evidence/reading/),
read by reader A at `agent-rules-books` `893a88a6fce3a80c565bf39ac65021b43a8b2990`.

Of 17 conflicts, one was already decided (`patterns-of-enterprise-application-architecture` never
beside `domain-driven-design` as equal guidance, `lean-skills` DEC-5). The other 16 were "not
named" and went to the owner in one round. No set is dropped: all eight are registered.

| # | Group | Records and conflicts | Asked | Recommended | Answer |
|---|---|---|---|---|---|
| 1 | Structure (11) | refactoring 1; a-philosophy-of-software-design 2, 3; clean-architecture 1, 2, 3; domain-driven-design 1, 2, 3; patterns-of-enterprise-application-architecture 2, 3 | Layer names, where interfaces live, pass-through services and thin adapters, a shared commons package, Active Record | One override: `cosmic-python` wins | **One override: `cosmic-python` wins** |
| 2 | Size rules (2) | refactoring 2; a-philosophy-of-software-design 1 | Function size and the extraction threshold | `cosmic-python`'s numbers | **`cosmic-python`'s numbers** |
| 3 | Validation (1) | clean-architecture 4 | Where input is validated | Fold into the structure override | **Folded into the structure override** |
| 4 | Generic repositories (2) | domain-driven-design 4; patterns-of-enterprise-application-architecture 4 | The books forbid a generic repository; `cosmic-python` has no rule, one example uses one | Accept, no override | **Override: a generic repository base is allowed** |

## The overrides stage 2 writes (D-10)

In the orchestrator's own words (DEC-18), for the engineering rows:

1. **Structure.** On layering, folder names (`models`, `adapters`, `services`, `entrypoints`), where
   abstract interfaces live (`adapters/`), the services layer every entrypoint goes through, the
   adapter around every external client, the `core`/`commons` component, models without I/O, and
   validation at the boundary, `cosmic-python` wins. The book sets inform design reasoning only.
2. **Size.** `cosmic-python`'s function size and extraction threshold win over the books'.
3. **Generic repositories.** A generic repository base is allowed in Meaningfy code, whatever
   `domain-driven-design` and `patterns-of-enterprise-application-architecture` advise.
4. Already decided: `patterns-of-enterprise-application-architecture` only on demand, never beside
   `domain-driven-design` as equal guidance.
