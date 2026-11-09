// The $.state contract of the navigator mod (design §3): one session atom holding NavState.
// Self-contained by the engine's rule: lib/state.ts imports these types from here.

export type BandDisplay = 'unfolded' | 'folded' | 'hidden'

export type Group = { title: string; done: number; total: number }

export type Change = {
  id: string
  appetite: string | null
  done: number
  total: number
  groups: Group[]
  planMtime: number
  hasDesign: boolean
  hasTasks: boolean
}

// ---- workflow files (design §4.1); lib/workflow.ts is their one validator
export type ChangePredicate =
  'none' | 'proposal' | 'plan' | 'tasks-no-design' | 'tasks-open' | 'tasks-partial' | 'tasks-done' | 'archived'

export type Activate = {
  skills?: string[]
  agents?: string[]
  openChange?: boolean
  change?: ChangePredicate
  interactive?: boolean
}

export type Phase = {
  id: string
  owner: string
  expect: { skill: string; by: 'commit' | 'exit' }[]
  allow?: string[]
  gates?: string[]
  enter: { skills?: string[]; agents?: string[]; change?: ChangePredicate | ChangePredicate[] }
}

export type Gate =
  | { kind: 'command'; match: string; run?: string }
  | { kind: 'skill'; skill: string }
  | { kind: 'consent'; shown: string; before: string }
  | { kind: 'file'; glob: string }

export type Review = {
  challenge: string
  reviewers: number
  lenses?: string[]
  ux: null | { wording: string; extra_reviewers: number }
  check: string
  checker: boolean
  tester: null | string
}

export type Workflow = {
  name: string
  title: string
  owner: string
  provisional?: boolean
  mode?: 'loose' | 'strict'
  extends?: string
  activate: Activate
  variants?: { name: string; phases: string[]; activate: Activate }[]
  phases: Phase[]
  gates?: Record<string, Gate>
  reviews?: Record<string, Review>
  roles?: Partial<Record<'reviewer' | 'checker' | 'tester', { agents?: string[]; describe?: string }>>
  replaces?: Record<string, string>
  planDrift?: { ignore: string[] }
  source?: string // the file it was read from; set by resolveWorkflows, never written in a file
}

export type Role = 'reviewer' | 'checker' | 'tester' | 'other'
export type HygieneEvent = 'commit' | 'phase-left' | 'task-group-done' | 'pr-merged' | 'archived'

export type Warning = { key: string; message: string; remedy: string | null; owner: string }

export type Subagent = {
  agentId: string
  toolUseId: string
  type: string
  model: string
  description: string
  startedAt: number
  tokens: number
  done: boolean
}

export type SkillUse = { name: string; at: number; phase: string | null }

export type GateState = { state: 'ok' | 'fail' | 'stale' | 'none'; at: number; detail: string }

export type NavState = {
  version: 1
  sessionId: string
  change: Change | null
  openChanges: number
  workflows: Workflow[]
  interactive: boolean
  workflow: string | null
  variant: string | null
  phase: string | null
  phaseAt: number // when the phase was entered; skills and commands after it count for it
  signalPhase: string | null // the phase the latest skill, agent or command entered
  consent: Record<string, boolean> // consent gate id → answered since its last `before` command
  consentShown: boolean // an answer matched a consent gate's `shown`; the next prompt answers it
  // `session` is the Mode switch for this session only (DD-35); null follows the repo.
  mode: { repo: 'loose' | 'strict'; session: 'loose' | 'strict' | null }
  skills: SkillUse[]
  subagents: Subagent[]
  gates: Record<string, GateState>
  warnings: Warning[]
  planTruncated: boolean // the last plan-drift read saw more than the diff cap
  accepted: string[] // warning keys recorded as deviations (deviations.md, or this session outside a change)
  // ---- subagent rules and hygiene (design §6.3, §6.5); thresholds are the guardrails file, unparsed
  thresholds: unknown
  parentModel: string
  turnId: string // the current main turn; PD-8 counts reviewer spawns per turn
  turnRoles: Role[]
  turnEvents: ({ kind: 'skill'; name: string } | { kind: 'tool' })[]
  agentCalls: Record<string, number> // tool calls per subagent (PD-6)
  shipLog: ({ kind: 'spawn'; role: Role } | { kind: 'ship' })[] // per change (PD-9)
  hygieneEvents: HygieneEvent[] // since the last safe point or task boundary
  offer: 'compact' | 'fresh' | null
  pending: string | null // a command to submit when the main turn ends (Reconcile EPIC's second step, DD-16)
  display: { band: BandDisplay; line: boolean }
  seen: string[]
}

declare module 'claude-code' {
  interface PluginState {
    'meaningfy-navigator': { state: NavState }
  }
}
