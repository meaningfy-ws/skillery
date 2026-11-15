## ADDED Requirements

### Requirement: The sales skills point to the external method skills
The sales skills SHALL NOT restate the negotiation method of Voss or the offer method of Hormozi.
Where they used that method, they SHALL point to the external skills `negotiation` and
`hundred-million-offers` through `skill-orchestration`. Every Meaningfy restriction on those
methods SHALL stay in the sales skills, as our own sales rules (proposal DEC-9; design D-14).

#### Scenario: A sales file after the cut
- **WHEN** a reviewer reads `sales-conversations` and `sales-qualification` after the cut
- **THEN** no passage restates either author's method, and each former passage points to the external skill through `skill-orchestration`

#### Scenario: A restriction on the method
- **WHEN** a second reader compares a sales file before and after the cut
- **THEN** every Meaningfy restriction on the method, such as "not in B2G tenders", is still there

### Requirement: No external skill sets a price
No external skill SHALL set or change a price. The price SHALL come from the commercial offering
document; `negotiation`, `hundred-million-offers` and `monetizing-innovation` MAY inform how an
offering is designed or a conversation is prepared (DEC-19).

#### Scenario: A negotiation reaches price
- **WHEN** the agent prepares a negotiation with the external negotiation skill loaded and the client asks for a lower price
- **THEN** the agent keeps the price of the offering document and offers no discount
