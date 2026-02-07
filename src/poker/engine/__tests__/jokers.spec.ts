import { describe, expect, it } from 'vitest'
import type { CardInstance, HandType } from '../types'
import { resolveJokers, jokerConditionMet } from '../jokers/resolve'
import type { JokerScoreContext } from '../jokers/resolve'
import { JOKER_DEFS, getJokerDef } from '../jokers/defs'

function card(rank: string, suit: string, id?: string): CardInstance {
  return {
    id: id ?? `test-${suit}-${rank}`,
    base: { suit: suit as any, rank: rank as any },
    modifier: { enhancement: 'none' },
    selected: false,
  }
}

describe('jokerConditionMet', () => {
  it('always condition returns true', () => {
    const ctx: JokerScoreContext = {
      handType: 'pair',
      playedCards: [card('A', 'hearts')],
      heldCards: [],
    }
    expect(jokerConditionMet({ type: 'always' }, ctx)).toBe(true)
  })

  it('hand_type_is matches correct hand type', () => {
    const ctx: JokerScoreContext = {
      handType: 'pair',
      playedCards: [card('K', 'hearts'), card('K', 'spades')],
      heldCards: [],
    }
    expect(jokerConditionMet({ type: 'hand_type_is', handType: 'pair' }, ctx)).toBe(true)
    expect(jokerConditionMet({ type: 'hand_type_is', handType: 'flush' }, ctx)).toBe(false)
  })

  it('contains_suit checks played cards', () => {
    const ctx: JokerScoreContext = {
      handType: 'pair',
      playedCards: [card('K', 'hearts'), card('K', 'spades')],
      heldCards: [],
    }
    expect(jokerConditionMet({ type: 'contains_suit', suit: 'hearts' }, ctx)).toBe(true)
    expect(jokerConditionMet({ type: 'contains_suit', suit: 'diamonds' }, ctx)).toBe(false)
  })

  it('contains_rank checks played cards', () => {
    const ctx: JokerScoreContext = {
      handType: 'pair',
      playedCards: [card('K', 'hearts'), card('K', 'spades')],
      heldCards: [],
    }
    expect(jokerConditionMet({ type: 'contains_rank', rank: 'K' }, ctx)).toBe(true)
    expect(jokerConditionMet({ type: 'contains_rank', rank: 'A' }, ctx)).toBe(false)
  })

  it('played_count_lte checks played card count', () => {
    const ctx: JokerScoreContext = {
      handType: 'pair',
      playedCards: [card('K', 'hearts'), card('K', 'spades')],
      heldCards: [],
    }
    expect(jokerConditionMet({ type: 'played_count_lte', count: 3 }, ctx)).toBe(true)
    expect(jokerConditionMet({ type: 'played_count_lte', count: 1 }, ctx)).toBe(false)
  })

  it('played_count_gte checks played card count', () => {
    const ctx: JokerScoreContext = {
      handType: 'pair',
      playedCards: [card('K', 'hearts'), card('K', 'spades')],
      heldCards: [],
    }
    expect(jokerConditionMet({ type: 'played_count_gte', count: 2 }, ctx)).toBe(true)
    expect(jokerConditionMet({ type: 'played_count_gte', count: 3 }, ctx)).toBe(false)
  })
})

describe('resolveJokers', () => {
  it('basic joker adds +4 mult', () => {
    const jokers = [{ id: 'j1', defId: 'joker' }]
    const ctx: JokerScoreContext = {
      handType: 'pair',
      playedCards: [card('K', 'hearts'), card('K', 'spades')],
      heldCards: [],
    }
    const result = resolveJokers(jokers, ctx)
    expect(result.addMult).toBe(4)
    expect(result.addChips).toBe(0)
    expect(result.mulMult).toBe(1)
  })

  it('suit joker only triggers when suit is present', () => {
    const jokers = [{ id: 'j1', defId: 'greedy-joker' }]
    const withDiamond: JokerScoreContext = {
      handType: 'pair',
      playedCards: [card('K', 'diamonds'), card('K', 'spades')],
      heldCards: [],
    }
    const withoutDiamond: JokerScoreContext = {
      handType: 'pair',
      playedCards: [card('K', 'hearts'), card('K', 'spades')],
      heldCards: [],
    }
    expect(resolveJokers(jokers, withDiamond).addMult).toBe(3)
    expect(resolveJokers(jokers, withoutDiamond).addMult).toBe(0)
  })

  it('multiple jokers stack additively', () => {
    const jokers = [
      { id: 'j1', defId: 'joker' },
      { id: 'j2', defId: 'jolly-joker' },
    ]
    const ctx: JokerScoreContext = {
      handType: 'pair',
      playedCards: [card('K', 'hearts'), card('K', 'spades')],
      heldCards: [],
    }
    const result = resolveJokers(jokers, ctx)
    expect(result.addMult).toBe(12)
  })

  it('mul_mult joker multiplies', () => {
    const jokers = [{ id: 'j1', defId: 'steel-joker' }]
    const ctx: JokerScoreContext = {
      handType: 'pair',
      playedCards: [card('K', 'hearts'), card('K', 'spades')],
      heldCards: [],
    }
    const result = resolveJokers(jokers, ctx)
    expect(result.mulMult).toBe(1.5)
  })

  it('add_chips joker adds chips', () => {
    const jokers = [{ id: 'j1', defId: 'sly-joker' }]
    const ctx: JokerScoreContext = {
      handType: 'pair',
      playedCards: [card('K', 'hearts'), card('K', 'spades')],
      heldCards: [],
    }
    const result = resolveJokers(jokers, ctx)
    expect(result.addChips).toBe(50)
  })

  it('skips unknown joker defIds', () => {
    const jokers = [{ id: 'j1', defId: 'nonexistent' }]
    const ctx: JokerScoreContext = {
      handType: 'pair',
      playedCards: [card('K', 'hearts')],
      heldCards: [],
    }
    const result = resolveJokers(jokers, ctx)
    expect(result.addChips).toBe(0)
    expect(result.addMult).toBe(0)
    expect(result.mulMult).toBe(1)
  })

  it('returns zero modifiers for empty joker list', () => {
    const ctx: JokerScoreContext = {
      handType: 'pair',
      playedCards: [card('K', 'hearts')],
      heldCards: [],
    }
    const result = resolveJokers([], ctx)
    expect(result.addChips).toBe(0)
    expect(result.addMult).toBe(0)
    expect(result.mulMult).toBe(1)
  })
})

describe('getJokerDef', () => {
  it('returns joker def by id', () => {
    const def = getJokerDef('joker')
    expect(def).toBeDefined()
    expect(def!.name).toBe('joker')
  })

  it('returns undefined for unknown id', () => {
    expect(getJokerDef('nonexistent')).toBeUndefined()
  })
})

describe('JOKER_DEFS', () => {
  it('has 12 jokers', () => {
    expect(JOKER_DEFS.length).toBe(12)
  })

  it('all jokers have unique ids', () => {
    const ids = JOKER_DEFS.map((j) => j.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
