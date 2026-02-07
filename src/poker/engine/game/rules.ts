export const HANDS_PER_ROUND = 4
export const DISCARDS_PER_ROUND = 3
export const HAND_SIZE = 8
export const MAX_ANTE = 8
export const STARTING_MONEY = 4

const SMALL_BLIND_TARGETS = [100, 300, 800, 2000, 5000, 11000, 20000, 35000]

export function getBlindTarget(ante: number, blind: 'small' | 'big' | 'boss'): number {
  const idx = Math.max(0, Math.min(ante - 1, SMALL_BLIND_TARGETS.length - 1))
  const base = SMALL_BLIND_TARGETS[idx]!

  if (blind === 'small') return base
  if (blind === 'big') return Math.round(base * 1.5)
  return base * 2
}
