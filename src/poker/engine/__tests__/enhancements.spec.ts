import { describe, expect, it } from 'vitest'
import type { CardInstance } from '../types'
import { resolveEnhancements, resolveGlassBreaks } from '../cards/enhancements'

function card(rank: string, suit: string, enhancement: string = 'none', id?: string): CardInstance {
  return {
    id: id ?? `test-${suit}-${rank}`,
    base: { suit: suit as any, rank: rank as any },
    modifier: { enhancement: enhancement as any },
    selected: false,
  }
}

describe('resolveEnhancements', () => {
  it('foil adds 50 chips', () => {
    const scoring = [card('K', 'hearts', 'foil')]
    const result = resolveEnhancements(scoring, [])
    expect(result.addChips).toBe(50)
    expect(result.addMult).toBe(0)
    expect(result.mulMult).toBe(1)
  })

  it('holo adds 10 mult', () => {
    const scoring = [card('K', 'hearts', 'holo')]
    const result = resolveEnhancements(scoring, [])
    expect(result.addMult).toBe(10)
  })

  it('polychrome multiplies mult by 1.5', () => {
    const scoring = [card('K', 'hearts', 'polychrome')]
    const result = resolveEnhancements(scoring, [])
    expect(result.mulMult).toBe(1.5)
  })

  it('glass multiplies mult by 2', () => {
    const scoring = [card('K', 'hearts', 'glass')]
    const result = resolveEnhancements(scoring, [])
    expect(result.mulMult).toBe(2)
  })

  it('stone adds 50 chips', () => {
    const scoring = [card('K', 'hearts', 'stone')]
    const result = resolveEnhancements(scoring, [])
    expect(result.addChips).toBe(50)
  })

  it('steel in held cards adds 50 mult', () => {
    const scoring = [card('K', 'hearts')]
    const held = [card('A', 'spades', 'steel')]
    const result = resolveEnhancements(scoring, held)
    expect(result.addMult).toBe(50)
  })

  it('multiple enhancements stack', () => {
    const scoring = [card('K', 'hearts', 'foil'), card('Q', 'hearts', 'holo')]
    const result = resolveEnhancements(scoring, [])
    expect(result.addChips).toBe(50)
    expect(result.addMult).toBe(10)
  })

  it('multiple polychrome multiply', () => {
    const scoring = [card('K', 'hearts', 'polychrome'), card('Q', 'hearts', 'polychrome')]
    const result = resolveEnhancements(scoring, [])
    expect(result.mulMult).toBeCloseTo(2.25)
  })

  it('none enhancement has no effect', () => {
    const scoring = [card('K', 'hearts', 'none')]
    const result = resolveEnhancements(scoring, [])
    expect(result.addChips).toBe(0)
    expect(result.addMult).toBe(0)
    expect(result.mulMult).toBe(1)
  })
})

describe('resolveGlassBreaks', () => {
  it('does not break non-glass cards', () => {
    const scoring = [card('K', 'hearts')]
    const rng = () => 0.1
    const broken = resolveGlassBreaks(scoring, rng)
    expect(broken).toHaveLength(0)
  })

  it('breaks glass card when rng < 0.25', () => {
    const scoring = [card('K', 'hearts', 'glass', 'glass-1')]
    const rng = () => 0.1
    const broken = resolveGlassBreaks(scoring, rng)
    expect(broken).toEqual(['glass-1'])
  })

  it('does not break glass card when rng >= 0.25', () => {
    const scoring = [card('K', 'hearts', 'glass', 'glass-1')]
    const rng = () => 0.5
    const broken = resolveGlassBreaks(scoring, rng)
    expect(broken).toHaveLength(0)
  })
})
