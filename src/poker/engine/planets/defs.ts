import type { HandType } from '../types'

export interface PlanetDef {
  id: string
  name: string
  handType: HandType
}

export const PLANET_DEFS: PlanetDef[] = [
  { id: 'pluto', name: 'pluto', handType: 'high_card' },
  { id: 'mercury', name: 'mercury', handType: 'pair' },
  { id: 'uranus', name: 'uranus', handType: 'two_pair' },
  { id: 'venus', name: 'venus', handType: 'three_of_a_kind' },
  { id: 'saturn', name: 'saturn', handType: 'straight' },
  { id: 'jupiter', name: 'jupiter', handType: 'flush' },
  { id: 'earth', name: 'earth', handType: 'full_house' },
  { id: 'mars', name: 'mars', handType: 'four_of_a_kind' },
  { id: 'neptune', name: 'neptune', handType: 'straight_flush' },
  { id: 'planet-x', name: 'planet x', handType: 'five_of_a_kind' },
  { id: 'ceres', name: 'ceres', handType: 'flush_house' },
  { id: 'eris', name: 'eris', handType: 'flush_five' },
]

export function getPlanetDef(id: string): PlanetDef | undefined {
  return PLANET_DEFS.find((p) => p.id === id)
}
