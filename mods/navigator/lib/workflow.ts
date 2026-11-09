// Workflow files (design §4.1, §4.3): the one validator of their schema (DD-8) and the repo
// overrides. Pure: register.tsx reads the files and passes their text in.

import type { ChangePredicate, NavState, Phase, Workflow } from './state.ts'

export const CHANGE_PREDICATES: readonly ChangePredicate[] =
  ['none', 'proposal', 'plan', 'tasks-no-design', 'tasks-open', 'tasks-partial', 'tasks-done', 'archived']

export type Source = { path: string; text: string }
export type Origin = 'default' | 'repo'

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v)
const isStr = (v: unknown): v is string => typeof v === 'string' && v !== ''
const isStrs = (v: unknown) => Array.isArray(v) && v.every(isStr)
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/

const TOP = ['name', 'title', 'owner', 'provisional', 'mode', 'extends', 'activate', 'variants', 'phases', 'gates',
  'reviews', 'roles', 'replaces', 'planDrift']
const REQUIRED = ['name', 'title', 'owner', 'activate', 'phases']

/** The first error of a workflow object, or null. `partial` skips the required fields (an `extends` file). */
export function workflowError(w: unknown, origin: Origin, partial = false): string | null {
  if (!isObj(w)) return 'not a JSON object'
  const unknown = Object.keys(w).find(k => !TOP.includes(k))
  if (unknown) return `unknown key '${unknown}'`
  if (!partial) {
    const missing = REQUIRED.find(k => !(k in w))
    if (missing) return `missing '${missing}'`
  }
  if (!isStr(w.name) || !KEBAB.test(w.name)) return `'name' must be a kebab-case string`
  for (const k of ['title', 'owner'] as const) if (k in w && !isStr(w[k])) return `'${k}' must be a string`
  if ('provisional' in w && typeof w.provisional !== 'boolean') return `'provisional' must be true or false`
  if ('mode' in w || 'extends' in w) {
    if (origin === 'default') return `a default file declares no '${'mode' in w ? 'mode' : 'extends'}' (DEC-5)`
    if ('mode' in w && w.mode !== 'loose' && w.mode !== 'strict') return `'mode' must be "loose" or "strict"`
    if ('extends' in w && !isStr(w.extends)) return `'extends' must be a workflow name`
  }
  if ('activate' in w) {
    const e = activateError(w.activate, 'activate')
    if (e) return e
  }
  const phaseIds: string[] = []
  if ('phases' in w) {
    if (!Array.isArray(w.phases) || w.phases.length === 0) return `'phases' must be a non-empty list`
    for (const [i, p] of w.phases.entries()) {
      const e = phaseError(p, `phases[${i}]`)
      if (e) return e
      const id = (p as Obj).id as string
      if (phaseIds.includes(id)) return `phases[${i}]: id '${id}' twice`
      phaseIds.push(id)
    }
  }
  if ('variants' in w) {
    if (!Array.isArray(w.variants)) return `'variants' must be a list`
    for (const [i, v] of w.variants.entries()) {
      const at = `variants[${i}]`
      if (!isObj(v) || !isStr(v.name) || !isStrs(v.phases)) return `${at}: needs 'name' and 'phases'`
      const extra = Object.keys(v).find(k => !['name', 'phases', 'activate'].includes(k))
      if (extra) return `${at}: unknown key '${extra}'`
      const e = activateError(v.activate, `${at}.activate`)
      if (e) return e
      const stray = phaseIds.length ? (v.phases as string[]).find(id => !phaseIds.includes(id)) : undefined
      if (stray) return `${at}: no phase '${stray}'`
    }
  }
  const gateIds = isObj(w.gates) ? Object.keys(w.gates) : []
  if ('gates' in w) {
    if (!isObj(w.gates)) return `'gates' must be an object`
    for (const [id, g] of Object.entries(w.gates)) {
      const e = gateError(g, `gates.${id}`)
      if (e) return e
    }
  }
  // An `extends` file's gate references are checked after the merge (DD-38).
  if (!partial && Array.isArray(w.phases)) {
    for (const p of w.phases as Obj[]) {
      const stray = ((p.gates as string[] | undefined) ?? []).find(g => !gateIds.includes(g))
      if (stray) return `phase '${p.id}': no gate '${stray}'`
    }
  }
  if ('reviews' in w) {
    if (!isObj(w.reviews)) return `'reviews' must be an object`
    for (const [name, r] of Object.entries(w.reviews)) {
      const e = reviewError(r, `reviews.${name}`)
      if (e) return e
    }
  }
  if ('roles' in w) {
    if (!isObj(w.roles)) return `'roles' must be an object`
    for (const [role, r] of Object.entries(w.roles)) {
      const at = `roles.${role}`
      if (!['reviewer', 'checker', 'tester'].includes(role)) return `unknown role '${role}'`
      if (!isObj(r) || Object.keys(r).some(k => k !== 'agents' && k !== 'describe')) return `${at}: only 'agents' and 'describe'`
      if ('agents' in r && !isStrs(r.agents)) return `${at}.agents must be a list of names`
      if ('describe' in r && regexError(r.describe)) return `${at}.describe: ${regexError(r.describe)}`
    }
  }
  if ('replaces' in w && (!isObj(w.replaces) || !Object.values(w.replaces).every(isStr))) {
    return `'replaces' must map skill names to skill names`
  }
  if ('planDrift' in w) {
    const d = w.planDrift
    if (!isObj(d) || Object.keys(d).some(k => k !== 'ignore') || !isStrs(d.ignore)) return `'planDrift' must be {ignore: [globs]}`
    const bad = (d.ignore as string[]).find(g => globError(g))
    if (bad) return `planDrift.ignore: ${globError(bad)}`
  }
  return null
}

function activateError(a: unknown, at: string): string | null {
  if (!isObj(a)) return `'${at}' must be an object`
  for (const [k, v] of Object.entries(a)) {
    if (k === 'skills' || k === 'agents') { if (!isStrs(v)) return `${at}.${k} must be a list of names` }
    else if (k === 'openChange' || k === 'interactive') { if (typeof v !== 'boolean') return `${at}.${k} must be true or false` }
    else if (k === 'change') { if (!CHANGE_PREDICATES.includes(v as ChangePredicate)) return `${at}.change: unknown '${String(v)}'` }
    else return `${at}: unknown key '${k}'`
  }
  return null
}

function phaseError(p: unknown, at: string): string | null {
  if (!isObj(p)) return `${at}: not an object`
  const extra = Object.keys(p).find(k => !['id', 'owner', 'expect', 'allow', 'gates', 'enter'].includes(k))
  if (extra) return `${at}: unknown key '${extra}'`
  if (!isStr(p.id) || !isStr(p.owner)) return `${at}: needs 'id' and 'owner'`
  if (!Array.isArray(p.expect)) return `${at}.expect must be a list`
  for (const x of p.expect) {
    if (!isObj(x) || !isStr(x.skill) || (x.by !== 'commit' && x.by !== 'exit') || Object.keys(x).length !== 2) {
      return `${at}.expect: each entry is {skill, by: "commit" | "exit"}`
    }
  }
  for (const k of ['allow', 'gates'] as const) if (k in p && !isStrs(p[k])) return `${at}.${k} must be a list of names`
  if (!isObj(p.enter)) return `${at}.enter must be an object`
  for (const [k, v] of Object.entries(p.enter)) {
    if (k === 'skills' || k === 'agents') { if (!isStrs(v)) return `${at}.enter.${k} must be a list of names` }
    else if (k === 'change') {
      const list = Array.isArray(v) ? v : [v]
      const stray = list.find(x => !CHANGE_PREDICATES.includes(x as ChangePredicate))
      if (!list.length || stray !== undefined) return `${at}.enter.change: unknown '${String(stray)}'`
    }
    else return `${at}.enter: unknown key '${k}'`
  }
  return null
}

const GATE_FIELDS: Record<string, { required: string[]; optional: string[]; regex: string[] }> = {
  command: { required: ['match'], optional: ['run'], regex: ['match'] },
  skill: { required: ['skill'], optional: [], regex: [] },
  consent: { required: ['shown', 'before'], optional: [], regex: ['shown', 'before'] },
  file: { required: ['glob'], optional: [], regex: [] },
}

function gateError(g: unknown, at: string): string | null {
  if (!isObj(g)) return `${at}: not an object`
  const kind = GATE_FIELDS[g.kind as string]
  if (!kind) return `${at}.kind: unknown '${String(g.kind)}'`
  const allowed = ['kind', ...kind.required, ...kind.optional]
  const extra = Object.keys(g).find(k => !allowed.includes(k))
  if (extra) return `${at}: unknown key '${extra}'`
  const missing = kind.required.find(k => !isStr(g[k]))
  if (missing) return `${at}: needs '${missing}'`
  if ('run' in g && !isStr(g.run)) return `${at}.run must be a command line`
  for (const k of kind.regex) if (regexError(g[k])) return `${at}.${k}: ${regexError(g[k])}`
  if (g.kind === 'file' && globError(g.glob as string)) return `${at}.glob: ${globError(g.glob as string)}`
  return null
}

function reviewError(r: unknown, at: string): string | null {
  if (!isObj(r)) return `${at}: not an object`
  const fields = ['challenge', 'reviewers', 'lenses', 'ux', 'check', 'checker', 'tester']
  const extra = Object.keys(r).find(k => !fields.includes(k))
  if (extra) return `${at}: unknown key '${extra}'`
  if (!isStr(r.challenge) || !isStr(r.check)) return `${at}: needs 'challenge' and 'check' wording`
  if (!Number.isInteger(r.reviewers) || (r.reviewers as number) < 0) return `${at}.reviewers must be a whole number`
  if ('lenses' in r && !isStrs(r.lenses)) return `${at}.lenses must be a list`
  if (typeof r.checker !== 'boolean') return `${at}.checker must be true or false`
  if (!(r.tester === null || isStr(r.tester))) return `${at}.tester must be its wording or null`
  const ux = r.ux
  if (!(ux === null || (isObj(ux) && isStr(ux.wording) && Number.isInteger(ux.extra_reviewers) && Object.keys(ux).length === 2))) {
    return `${at}.ux must be null or {wording, extra_reviewers}`
  }
  return null
}

function regexError(v: unknown): string | null {
  if (!isStr(v)) return 'must be a regular expression'
  try {
    new RegExp(v)
    return null
  } catch (e) {
    return `bad regular expression (${(e as Error).message})`
  }
}

/** Parse one file. The error names the file and its first problem. */
export function parseWorkflow(src: Source, origin: Origin): { workflow: Workflow } | { error: string } {
  let raw: unknown
  try {
    raw = JSON.parse(src.text)
  } catch (e) {
    return { error: `workflow file ${src.path}: not JSON (${(e as Error).message})` }
  }
  const partial = isObj(raw) && 'extends' in raw
  const error = workflowError(raw, origin, partial)
  return error ? { error: `workflow file ${src.path}: ${error}` } : { workflow: raw as Workflow }
}

export type Resolved = { workflows: Workflow[]; errors: string[]; mode: 'loose' | 'strict' }

/** Defaults, then repo files on top (design §4.3). A bad file is reported and skipped; its default stays. */
export function resolveWorkflows(defaults: Source[], repo: Source[]): Resolved {
  const errors: string[] = []
  const byName = new Map<string, Workflow>()
  for (const src of defaults) {
    const r = parseWorkflow(src, 'default')
    if ('error' in r) errors.push(r.error)
    else byName.set(r.workflow.name, { ...r.workflow, source: src.path })
  }
  let mode: Resolved['mode'] = 'loose'
  for (const src of repo) {
    const r = parseWorkflow(src, 'repo')
    if ('error' in r) {
      errors.push(r.error)
      continue
    }
    const { extends: base, ...own } = r.workflow
    let merged: Workflow = own
    if (base) {
      const from = byName.get(base)
      if (!from) {
        errors.push(`workflow file ${src.path}: extends unknown workflow '${base}'`)
        continue
      }
      const { source: _, ...fields } = from
      merged = { ...fields, ...own } // shallow: `phases` and every other field wholesale
      const error = workflowError(merged, 'repo')
      if (error) {
        errors.push(`workflow file ${src.path}: ${error}`)
        continue
      }
    }
    if (merged.mode === 'strict') mode = 'strict'
    byName.set(merged.name, { ...merged, source: src.path })
  }
  return { workflows: [...byName.values()], errors, mode }
}

/** Every skill or agent name a workflow names, without a plugin prefix (TC-16). */
export function namesIn(w: Workflow): string[] {
  const acts = [w.activate, ...(w.variants ?? []).map(v => v.activate)]
  const names = [
    w.owner,
    ...acts.flatMap(a => [...(a.skills ?? []), ...(a.agents ?? [])]),
    ...w.phases.flatMap(p => [p.owner, ...p.expect.map(x => x.skill), ...(p.allow ?? []),
      ...(p.enter.skills ?? []), ...(p.enter.agents ?? [])]),
    ...Object.values(w.gates ?? {}).flatMap(g => (g.kind === 'skill' ? [g.skill] : [])),
    ...Object.values(w.roles ?? {}).flatMap(r => r?.agents ?? []),
    ...Object.entries(w.replaces ?? {}).flat(),
  ]
  return [...new Set(names.map(bare))]
}

/** `superpowers:test-driven-development` → `test-driven-development`. */
export const bare = (name: string) => name.slice(name.lastIndexOf(':') + 1)

// Commands are matched where a shell segment starts, never inside a quoted string or a grep (DD-41).
// A segment may start with environment assignments (`FOO=1 git commit`); quoted text is blanked first.
const SEG = String.raw`(?:^|[;&|(]\s*|\n\s*)(?:\w+=\S*\s+)*`
const at = (re: string) => { const r = new RegExp(`${SEG}${re}`); return { test: (c: string) => r.test(unquote(c)) } }
const unquote = (c: string) => c.replace(/"(?:[^"\\]|\\.)*"|'[^']*'/g, '""')
const COMMIT = at(String.raw`git(?:\s+-[Cc]\s+\S+)*\s+commit\b`)
const ARCHIVE = at(String.raw`openspec\s+archive\b`)
const SHIP = at(String.raw`(?:git(?:\s+-[Cc]\s+\S+)*\s+push|gh\s+pr\s+create)\b`)
const MERGE = at(String.raw`gh\s+pr\s+merge\b`)
export const isCommit = (c: string) => COMMIT.test(c)
export const isArchive = (c: string) => ARCHIVE.test(c)
export const isShip = (c: string) => SHIP.test(c) || ARCHIVE.test(c)
export const isPrMerge = (c: string) => MERGE.test(c)

/** A change id safe to put in a command line: never an option (DD-41). */
export const safeChangeId = (s: NavState) => (s.change && /^\w[\w.-]*$/.test(s.change.id) ? s.change.id : null)

/** The effective mode: the session's switch if set, else the repo's (DEC-5, DD-35). */
export const isStrict = (s: NavState) => (s.mode.session ?? s.mode.repo) === 'strict'

export function workflowOf(s: NavState): Workflow | undefined {
  return s.workflows.find(w => w.name === s.workflow)
}

export function phasesOf(w: Workflow, variant: string | null): Phase[] {
  const v = w.variants?.find(v => v.name === variant)
  return v ? w.phases.filter(p => v.phases.includes(p.id)) : w.phases
}

/** The active workflow and the phase the session is in, if any. */
export function currentPhase(s: NavState): { w: Workflow; p: Phase } | undefined {
  const w = workflowOf(s)
  const p = w && phasesOf(w, s.variant).find(p => p.id === s.phase)
  return w && p ? { w, p } : undefined
}

/** `**` any folders, `*` and `?` within one name, `[..]` a class. Paths are repo-relative. */
export function globRegex(glob: string): RegExp {
  let re = ''
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i]!
    if (glob.startsWith('**/', i)) { re += '(?:.*/)?'; i += 2 }
    else if (glob.startsWith('**', i)) { re += '.*'; i += 1 }
    else if (c === '*') re += '[^/]*'
    else if (c === '?') re += '[^/]'
    else if (c === '[' && glob.indexOf(']', i) > i) { const end = glob.indexOf(']', i); re += glob.slice(i, end + 1); i = end }
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&')
  }
  return new RegExp(`^${re}$`)
}

function globError(glob: string): string | null {
  try {
    globRegex(glob)
    return null
  } catch (e) {
    return `bad glob '${glob}' (${(e as Error).message})`
  }
}
