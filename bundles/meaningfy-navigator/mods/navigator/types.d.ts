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
}

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

export type SkillUse = { name: string; at: number }

export type GateState = { state: 'ok' | 'fail' | 'stale' | 'none'; at: number; detail: string }

export type NavState = {
  version: 1
  sessionId: string
  change: Change | null
  openChanges: number
  phase: string | null
  mode: { repo: 'loose' | 'strict'; sessionLoose: boolean }
  mainModel: string | null
  skills: SkillUse[]
  subagents: Subagent[]
  gates: Record<string, GateState>
  warnings: { key: string; message: string }[]
  display: { band: BandDisplay; line: boolean }
  seen: string[]
}

declare module 'claude-code' {
  interface PluginState {
    'meaningfy-navigator': { state: NavState }
  }
}
