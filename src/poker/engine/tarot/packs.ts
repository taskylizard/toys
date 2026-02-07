import type { PackOption } from '../types'
import { TAROT_DEFS } from './defs'
import { shuffleArray } from '../rng'

export function generateArcanaPackOptions(rng: () => number, packId: string): PackOption[] {
  const shuffled = shuffleArray([...TAROT_DEFS], rng)
  return shuffled.slice(0, 3).map((def, i) => ({
    id: `${packId}-option-${i}`,
    kind: 'tarot' as const,
    defId: def.id,
  }))
}
