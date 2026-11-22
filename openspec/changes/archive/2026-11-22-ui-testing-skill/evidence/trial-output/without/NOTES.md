# accept-decision.spec.ts
- Mocks the API (auth, decisions list, proposed entity, accept POST, stateful stats); no backend needed.
- Opens `/`, checks Alice Johnson's decision and proposed match, clicks the accept (check) button, confirms the Popconfirm.
- Asserts the accept POST hit `decision-001`, the "Decision accepted" notification shows,
  the decision leaves the side menu (Bob Smith stays) and header stats go from 42 to 43 Selected Top.
- `decisionMocks.ts` is a new helper file (copy to `src/test/e2e/`); `helpers.ts` is unchanged.
- Not run. Assumptions: confirm popover is on (default), antd icon aria-label "check", OK button label "OK";
  accept URL is `/curation/decisions/{id}/accept` (src/api is generated, absent from the checkout).
