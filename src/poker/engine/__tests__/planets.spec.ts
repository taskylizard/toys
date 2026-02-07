import { describe, expect, it } from 'vitest'
import { PLANET_DEFS, getPlanetDef } from '../planets/defs'
import { applyPlanet } from '../planets/resolve'
import { createInitialHandLevels } from '../game/state'

describe('PLANET_DEFS', () => {
  it('has 12 planets', () => {
    expect(PLANET_DEFS.length).toBe(12)
  })

  it('all planets have unique ids', () => {
    const ids = PLANET_DEFS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('each planet maps to a hand type', () => {
    for (const planet of PLANET_DEFS) {
      expect(planet.handType).toBeDefined()
    }
  })
})

describe('getPlanetDef', () => {
  it('returns planet by id', () => {
    const def = getPlanetDef('mercury')
    expect(def).toBeDefined()
    expect(def!.handType).toBe('pair')
  })

  it('returns undefined for unknown id', () => {
    expect(getPlanetDef('nonexistent')).toBeUndefined()
  })
})

describe('applyPlanet', () => {
  it('increments hand level for the planet hand type', () => {
    const levels = createInitialHandLevels()
    const planet = getPlanetDef('mercury')!
    const result = applyPlanet(levels, planet)
    expect(result.pair).toBe(2)
    expect(result.flush).toBe(1)
  })

  it('can apply multiple planets to same hand type', () => {
    let levels = createInitialHandLevels()
    const planet = getPlanetDef('mercury')!
    levels = applyPlanet(levels, planet)
    levels = applyPlanet(levels, planet)
    expect(levels.pair).toBe(3)
  })

  it('does not mutate original levels', () => {
    const levels = createInitialHandLevels()
    const planet = getPlanetDef('mercury')!
    applyPlanet(levels, planet)
    expect(levels.pair).toBe(1)
  })
})
