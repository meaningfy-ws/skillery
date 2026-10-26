# Future features

What the catalogue will add, and what each addition needs before it can be built. A use case that is
`partial` or `missing` in [`use-cases.md`](use-cases.md) names its change here (`make validate`
checks it). A feature becomes a change in `openspec/changes/` only when its material is in hand; an
empty bundle is never created to reserve a place.

| Feature | Use cases | Bundle | Agents to build | Skills to build | Material needed | Material in hand? | Change |
|---|---|---|---|---|---|---|---|
| Sales agents and CRM | UC-W7 | `meaningfy-sales` | `sales-assistant` (scheduled) | CRM grooming, deal and contact management | the sales package | yes, outside the repo | `add-sales-bundle` |
| DevOps agent | UC-W6 | `meaningfy-devops` | `devops-engineer` | Terraform, Ansible, environments | the devops package | yes, outside the repo | `add-devops-bundle` |
| Commercial chain | UC-W8 (company-style PDF), UC-W9, UC-W10, UC-W11, UC-W12, UC-W13 | `meaningfy-sales`, `meaningfy-business` | `qualifier`, `market-researcher`, `offer-designer`, `negotiation-partner` | lead and partnership qualification, market research, offer design and pricing, the company PDF style | the qualification method, offer examples, the PDF template | no | `add-commercial-chain` |
| Demo builder | UC-W21 | `meaningfy-sales` | `demo-builder` | demo scaffolding | demo examples and the target stack | no | `add-demo-builder` |
| Personal assistants | UC-W2, UC-W3, UC-W4, UC-W5 | `vault-assistant` | `life-coach`, `secretary`, `planner`, `companion` | to scope per assistant | the owner's routines and a runtime for scheduled and mobile use | no | `add-personal-assistants` |
| Vault local config | UC-W1 | `vault-assistant` | — | colleagues' local variations over one shared spine | a colleague's vault variation | no | `add-vault-local-config` |
| Visual design | UC-W17 | `meaningfy-design` | `graphic-designer` | brand and visual design | the brand guide and design examples | no | `add-visual-design` |
| Business partners | UC-W14, UC-W15 | `meaningfy-business` | `business-coach`, `internal-comms` (scheduled) | business planning and pitches, internal briefings | the employee handbook, Odoo access, pitch examples | no | `add-business-partners` |
| Legal documents | UC-W16 | `meaningfy-business` | `contract-drafter` | contracts and NDAs | contract and NDA templates | no | `add-legal-documents` |
| Advisory agent | UC-W22 | `meaningfy-consulting` | an advisory lead agent | — (the skills exist) | a recorded advisory engagement to test against | no | `add-advisory-agent` |
| Delivery management | UC-W23 | to decide | a delivery lead agent | project planning, status reporting, delivery hand-over | the delivery method and report examples | no | `add-delivery-management` |
| Content creation and voice channel profiles | UC-W24 | `meaningfy-core` | a content agent | the channel profiles in `meaningfy-voice` (LinkedIn, blog, offer, internal message) | voice samples per channel and audience | no | `add-content-creation` |
| Odoo memory skill | — | to decide | — | how to store and find things in Odoo | the Odoo model and access | no | `add-odoo-memory-skill` |
| Config items | — | — | — | rules and settings a bundle or project may ship | a first bundle that needs one | no | `add-config-items` |
| Agent aspects | — | — | — | the agent template's runtime, memory, dependency and tool-policy aspects | the needs of the scheduled and mobile agents above | no | `extend-agent-template` |
| Evaluation | every skill and agent | — | — | — (trigger sets and outcome suites) | the approved per-batch estimates | yes, parked | `evaluate-catalogue` |
