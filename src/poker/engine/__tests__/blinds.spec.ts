import { describe, expect, it } from 'vitest'
import type { CardInstance } from '../types'
import {
  BOSS_BLIND_DEFS,
  getBossBlindDef,
} from '../blinds/defs'
import type { BossEffect } from '../blinds/defs'
import {
  isCardDebuffed,
  getEffectiveHandSize,
  getEffectiveDiscards,
  getMinPlayCards,
  filterDebuffedFromScoring,
} from '../blinds/resolve'

function card(rank: string, suit: string, id?: string): CardInstance {
  return {
    id: id ?? `test-${suit}-${rank}`,
    base: { suit: suit as any, rank: rank as any },
    modifier: { enhancement: 'none' },
    selected: false,
  }
}

describe('isCardDebuffed', () => {
  it('returns true for debuff_suit matching suit', () => {
    const effect: BossEffect = { type: 'debuff_suit', suit: 'clubs' }
    expect(isCardDebuffed(card('A', 'clubs'), effect)).toBe(true)
  })

  it('returns false for debuff_suit non-matching suit', () => {
    const effect: BossEffect = { type: 'debuff_suit', suit: 'clubs' }
    expect(isCardDebuffed(card('A', 'hearts'), effect)).toBe(false)
  })

  it('returns true for no_face_cards with J', () => {
    const effect: BossEffect = { type: 'no_face_cards' }
    expect(isCardDebuffed(card('J', 'hearts'), effect)).toBe(true)
  })

  it('returns true for no_face_cards with Q', () => {
    const effect: BossEffect = { type: 'no_face_cards' }
    expect(isCardDebuffed(card('Q', 'spades'), effect)).toBe(true)
  })

  it('returns true for no_face_cards with K', () => {
    const effect: BossEffect = { type: 'no_face_cards' }
    expect(isCardDebuffed(card('K', 'diamonds'), effect)).toBe(true)
  })

  it('returns false for no_face_cards with number card', () => {
    const effect: BossEffect = { type: 'no_face_cards' }
    expect(isCardDebuffed(card('5', 'hearts'), effect)).toBe(false)
  })

  it('returns false with no effect', () => {
    expect(isCardDebuffed(card('K', 'hearts'), undefined)).toBe(false)
  })

  it('returns false for non-debuff effect types', () => {
    const effect: BossEffect = { type: 'no_discards' }
    expect(isCardDebuffed(card('K', 'hearts'), effect)).toBe(false)
  })
})

describe('getEffectiveHandSize', () => {
  it('reduces hand size with reduce_hand_size', () => {
    const effect: BossEffect = { type: 'reduce_hand_size', amount: 2 }
    expect(getEffectiveHandSize(8, effect)).toBe(6)
  })

  it('clamps to minimum 1', () => {
    const effect: BossEffect = { type: 'reduce_hand_size', amount: 10 }
    expect(getEffectiveHandSize(8, effect)).toBe(1)
  })

  it('returns base size with no effect', () => {
    expect(getEffectiveHandSize(8, undefined)).toBe(8)
  })

  it('returns base size for unrelated effect', () => {
    const effect: BossEffect = { type: 'no_discards' }
    expect(getEffectiveHandSize(8, effect)).toBe(8)
  })
})

describe('getEffectiveDiscards', () => {
  it('returns 0 with no_discards', () => {
    const effect: BossEffect = { type: 'no_discards' }
    expect(getEffectiveDiscards(3, effect)).toBe(0)
  })

  it('returns base discards with no effect', () => {
    expect(getEffectiveDiscards(3, undefined)).toBe(3)
  })

  it('returns base discards for unrelated effect', () => {
    const effect: BossEffect = { type: 'no_face_cards' }
    expect(getEffectiveDiscards(3, effect)).toBe(3)
  })
})

describe('getMinPlayCards', () => {
  it('returns count with min_cards', () => {
    const effect: BossEffect = { type: 'min_cards', count: 5 }
    expect(getMinPlayCards(effect)).toBe(5)
  })

  it('returns 1 with no effect', () => {
    expect(getMinPlayCards(undefined)).toBe(1)
  })

  it('returns 1 for unrelated effect', () => {
    const effect: BossEffect = { type: 'no_discards' }
    expect(getMinPlayCards(effect)).toBe(1)
  })
})

describe('filterDebuffedFromScoring', () => {
  it('filters debuffed cards by suit', () => {
    const effect: BossEffect = { type: 'debuff_suit', suit: 'clubs' }
    const cards = [card('A', 'clubs'), card('K', 'hearts'), card('5', 'clubs')]
    const result = filterDebuffedFromScoring(cards, effect)
    expect(result).toHaveLength(1)
    expect(result[0]!.base.suit).toBe('hearts')
  })

  it('filters face cards with no_face_cards', () => {
    const effect: BossEffect = { type: 'no_face_cards' }
    const cards = [card('J', 'hearts'), card('5', 'clubs'), card('K', 'spades')]
    const result = filterDebuffedFromScoring(cards, effect)
    expect(result).toHaveLength(1)
    expect(result[0]!.base.rank).toBe('5')
  })

  it('keeps all cards with no effect', () => {
    const cards = [card('A', 'clubs'), card('K', 'hearts')]
    const result = filterDebuffedFromScoring(cards, undefined)
    expect(result).toHaveLength(2)
  })
})

describe('BOSS_BLIND_DEFS', () => {
  it('has 8 entries', () => {
    expect(BOSS_BLIND_DEFS).toHaveLength(8)
  })

  it('all have unique ids', () => {
    const ids = BOSS_BLIND_DEFS.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('getBossBlindDef', () => {
  it('returns def by id', () => {
    const def = getBossBlindDef('the-club')
    expect(def).toBeDefined()
    expect(def!.name).toBe('the club')
  })

  it('returns undefined for unknown id', () => {
    expect(getBossBlindDef('nonexistent')).toBeUndefined()
  })
})
