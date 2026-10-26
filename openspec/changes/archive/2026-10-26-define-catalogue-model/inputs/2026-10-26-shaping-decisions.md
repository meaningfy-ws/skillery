# Owner answers during shaping (2026-10-26)

**Status:** SECONDARY input, the Q&A record. Never groomed, never deleted.

| # | Question | Owner's answer |
|---|---|---|
| Q1 | Which facets should every skill (and agent) declare? | **purpose, domain, posture, stage**, and "any other descriptors might be usable? feel free to add" |
| Q2 | How are cross-bundle dependencies handled? | **Declare `requires:`** in `bundles.yaml`; a check fails any depends-on edge into a bundle that is not required (core implicit) |
| Q3 | Agents in the ecosystem picture? | **Yes, with the same facets** |
| Q4 | Where does the documentation-management rule live? | **In the method, §8**: "Where things live" becomes the register of views |

Shaping additions made on the owner's invitation (Q1), recorded in the EPIC as DEC-2 and DEC-3:
- the "domain" facet is named `subject`, and the business area is named `area` (the collision with
  `define-ai-domains`);
- `maturity` is added as a declared facet;
- descriptors that can be computed are derived, never declared.
