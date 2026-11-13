// What `gh pr view <branch> --json state,headRefName` tells the navigator (D-5): the followed branch's
// pull request is merged, or nothing. Pure: io.ts runs the command.

/** The command's result; null when it could not run or timed out. */
export type PrOutcome = { exitCode: number; stdout: string } | null

export const PR_TIMEOUT_MS = 10_000

export function prViewArgs(branch: string): string[] {
  return ['gh', 'pr', 'view', branch, '--json', 'state,headRefName']
}

/** `PrMerged` only for a clean answer that says MERGED for this very branch; every failure is silent. */
export function prSignal(branch: string, outcome: PrOutcome): { kind: 'PrMerged'; branch: string } | null {
  if (!outcome || outcome.exitCode !== 0) return null
  try {
    const pr = JSON.parse(outcome.stdout)
    return pr?.state === 'MERGED' && pr.headRefName === branch ? { kind: 'PrMerged', branch } : null
  } catch {
    return null
  }
}
