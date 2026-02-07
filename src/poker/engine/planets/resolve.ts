import type { HandType } from '../types'
import type { PlanetDef } from './defs'

export function applyPlanet(
  handLevels: Record<HandType, number>,
  planet: PlanetDef,
): Record<HandType, number> {
  return {
    ...handLevels,
    [planet.handType]: handLevels[planet.handType] + 1,
  }
}
