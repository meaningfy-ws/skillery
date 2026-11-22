// Proposed addition: src/test/e2e/decisionMocks.ts (new file; helpers.ts is unchanged)
export const mockStatsBefore = {
  registry: {
    total_entity_mentions: 200,
    total_canonical_entities: 80,
    average_cluster_size: 2.5,
    resolution_requests: 150
  },
  curation: {
    total_decisions: 67,
    selected_top: 42,
    selected_alternative: 3,
    rejected_all: 5
  }
}

export const mockStatsAfterAccept = {
  ...mockStatsBefore,
  curation: { ...mockStatsBefore.curation, selected_top: 43 }
}

const decision = (id: string, name: string, cluster: string) => ({
  id,
  about_entity_mention: {
    identified_by: { source_id: 'src-1', request_id: `entity-${id}`, entity_type: 'Person' },
    parsed_representation: { name }
  },
  current_placement: { cluster_id: cluster, confidence_score: 0.85, similarity_score: 0.8 },
  created_at: new Date(Date.now() - 60_000).toISOString(),
  updated_at: null
})

export const mockDecisionsPage = {
  results: [
    decision('decision-001', 'Alice Johnson', 'cluster-1'),
    decision('decision-002', 'Bob Smith', 'cluster-2')
  ],
  count: 2,
  next_cursor: null
}

export const mockProposedCanonical = {
  confidence_score: 0.85,
  cluster_size: 3,
  top_entities: [{ parsed_representation: { name: 'Alice M. Johnson' } }]
}
