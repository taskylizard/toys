import type { PackOption } from '../types'
import { PLANET_DEFS } from './defs'
import { shuffleArray } from '../rng'

export function generateCelestialPackOptions(rng: () => number, packId: string): PackOption[] {
  const shuffled = shuffleArray([...PLANET_DEFS], rng)
  return shuffled.slice(0, 3).map((def, i) => ({
    id: `${packId}-option-${i}`,
    kind: 'planet' as const,
    defId: def.id,
  }))
}
