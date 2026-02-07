import { describe, expect, it } from 'vitest'
import type { CardInstance } from '../types'
import { evaluateHand } from '../poker/evaluateHand'

function card(rank: string, suit: string, id?: string): CardInstance {
  return {
    id: id ?? `test-${suit}-${rank}`,
    base: { suit: suit as any, rank: rank as any },
    modifier: { enhancement: 'none' },
    selected: false,
  }
}

describe('evaluateHand', () => {
  describe('high card', () => {
    it('returns high_card for a single card', () => {
      const result = evaluateHand([card('A', 'spades')])
      expect(result.handType).toBe('high_card')
      expect(result.scoringCards).toHaveLength(1)
      expect(result.scoringCards[0]!.base.rank).toBe('A')
    })

    it('returns high_card with ace as scoring card from multiple non-matching cards', () => {
      const result = evaluateHand([
        card('A', 'spades'),
        card('7', 'hearts'),
        card('3', 'diamonds'),
      ])
      expect(result.handType).toBe('high_card')
      expect(result.scoringCards).toHaveLength(1)
      expect(result.scoringCards[0]!.base.rank).toBe('A')
    })

    it('returns high_card for empty hand with no scoring cards', () => {
      const result = evaluateHand([])
      expect(result.handType).toBe('high_card')
      expect(result.scoringCards).toHaveLength(0)
    })

    it('returns high_card with highest card when 2 cards do not match', () => {
      const result = evaluateHand([card('5', 'spades'), card('K', 'hearts')])
      expect(result.handType).toBe('high_card')
      expect(result.scoringCards).toHaveLength(1)
      expect(result.scoringCards[0]!.base.rank).toBe('K')
    })
  })

  describe('pair', () => {
    it('detects a pair from 2 cards', () => {
      const result = evaluateHand([card('K', 'spades'), card('K', 'hearts')])
      expect(result.handType).toBe('pair')
      expect(result.scoringCards).toHaveLength(2)
    })

    it('detects a pair from 5 cards and only scores the paired cards', () => {
      const result = evaluateHand([
        card('K', 'spades'),
        card('K', 'hearts'),
        card('7', 'diamonds'),
        card('3', 'clubs'),
        card('2', 'spades', 'test-spades-2b'),
      ])
      expect(result.handType).toBe('pair')
      expect(result.scoringCards).toHaveLength(2)
      expect(result.scoringCards.every((c) => c.base.rank === 'K')).toBe(true)
    })
  })

  describe('two pair', () => {
    it('detects two_pair from 4 cards', () => {
      const result = evaluateHand([
        card('K', 'spades'),
        card('K', 'hearts'),
        card('7', 'diamonds'),
        card('7', 'clubs'),
      ])
      expect(result.handType).toBe('two_pair')
      expect(result.scoringCards).toHaveLength(4)
    })

    it('detects two_pair from 5 cards and scores 4 cards', () => {
      const result = evaluateHand([
        card('K', 'spades'),
        card('K', 'hearts'),
        card('7', 'diamonds'),
        card('7', 'clubs'),
        card('2', 'spades', 'test-spades-2b'),
      ])
      expect(result.handType).toBe('two_pair')
      expect(result.scoringCards).toHaveLength(4)
    })
  })

  describe('three of a kind', () => {
    it('detects three_of_a_kind from 3 cards', () => {
      const result = evaluateHand([
        card('Q', 'spades'),
        card('Q', 'hearts'),
        card('Q', 'diamonds'),
      ])
      expect(result.handType).toBe('three_of_a_kind')
      expect(result.scoringCards).toHaveLength(3)
    })

    it('detects three_of_a_kind from 5 cards and scores 3 cards', () => {
      const result = evaluateHand([
        card('Q', 'spades'),
        card('Q', 'hearts'),
        card('Q', 'diamonds'),
        card('7', 'clubs'),
        card('2', 'spades', 'test-spades-2b'),
      ])
      expect(result.handType).toBe('three_of_a_kind')
      expect(result.scoringCards).toHaveLength(3)
      expect(result.scoringCards.every((c) => c.base.rank === 'Q')).toBe(true)
    })
  })

  describe('straight', () => {
    it('detects a straight', () => {
      const result = evaluateHand([
        card('5', 'spades'),
        card('6', 'hearts'),
        card('7', 'diamonds'),
        card('8', 'clubs'),
        card('9', 'spades', 'test-spades-9'),
      ])
      expect(result.handType).toBe('straight')
      expect(result.scoringCards).toHaveLength(5)
    })

    it('detects ace-high straight', () => {
      const result = evaluateHand([
        card('10', 'spades'),
        card('J', 'hearts'),
        card('Q', 'diamonds'),
        card('K', 'clubs'),
        card('A', 'spades', 'test-spades-A'),
      ])
      expect(result.handType).toBe('straight')
      expect(result.scoringCards).toHaveLength(5)
    })

    it('detects ace-low straight', () => {
      const result = evaluateHand([
        card('A', 'spades'),
        card('2', 'hearts'),
        card('3', 'diamonds'),
        card('4', 'clubs'),
        card('5', 'spades', 'test-spades-5'),
      ])
      expect(result.handType).toBe('straight')
      expect(result.scoringCards).toHaveLength(5)
    })
  })

  describe('flush', () => {
    it('detects a flush', () => {
      const result = evaluateHand([
        card('2', 'hearts'),
        card('5', 'hearts', 'test-hearts-5'),
        card('8', 'hearts', 'test-hearts-8'),
        card('J', 'hearts', 'test-hearts-J'),
        card('A', 'hearts', 'test-hearts-A'),
      ])
      expect(result.handType).toBe('flush')
      expect(result.scoringCards).toHaveLength(5)
      expect(result.scoringCards.every((c) => c.base.suit === 'hearts')).toBe(true)
    })
  })

  describe('full house', () => {
    it('detects a full_house and scores all 5 cards', () => {
      const result = evaluateHand([
        card('K', 'spades'),
        card('K', 'hearts'),
        card('K', 'diamonds'),
        card('7', 'clubs'),
        card('7', 'spades', 'test-spades-7'),
      ])
      expect(result.handType).toBe('full_house')
      expect(result.scoringCards).toHaveLength(5)
    })
  })

  describe('four of a kind', () => {
    it('detects four_of_a_kind and scores 4 cards', () => {
      const result = evaluateHand([
        card('J', 'spades'),
        card('J', 'hearts'),
        card('J', 'diamonds'),
        card('J', 'clubs'),
        card('2', 'spades', 'test-spades-2'),
      ])
      expect(result.handType).toBe('four_of_a_kind')
      expect(result.scoringCards).toHaveLength(4)
      expect(result.scoringCards.every((c) => c.base.rank === 'J')).toBe(true)
    })
  })

  describe('straight flush', () => {
    it('detects a straight_flush', () => {
      const result = evaluateHand([
        card('5', 'hearts'),
        card('6', 'hearts', 'test-hearts-6'),
        card('7', 'hearts', 'test-hearts-7'),
        card('8', 'hearts', 'test-hearts-8'),
        card('9', 'hearts', 'test-hearts-9'),
      ])
      expect(result.handType).toBe('straight_flush')
      expect(result.scoringCards).toHaveLength(5)
    })
  })

  describe('five of a kind', () => {
    it('detects five_of_a_kind', () => {
      const result = evaluateHand([
        card('A', 'spades'),
        card('A', 'hearts'),
        card('A', 'diamonds'),
        card('A', 'clubs'),
        card('A', 'spades', 'test-spades-A2'),
      ])
      expect(result.handType).toBe('five_of_a_kind')
      expect(result.scoringCards).toHaveLength(5)
    })
  })

  describe('flush house', () => {
    it('detects flush_house', () => {
      const result = evaluateHand([
        card('K', 'hearts'),
        card('K', 'hearts', 'test-hearts-K2'),
        card('K', 'hearts', 'test-hearts-K3'),
        card('7', 'hearts', 'test-hearts-7a'),
        card('7', 'hearts', 'test-hearts-7b'),
      ])
      expect(result.handType).toBe('flush_house')
      expect(result.scoringCards).toHaveLength(5)
    })
  })

  describe('flush five', () => {
    it('detects flush_five', () => {
      const result = evaluateHand([
        card('A', 'hearts'),
        card('A', 'hearts', 'test-hearts-A2'),
        card('A', 'hearts', 'test-hearts-A3'),
        card('A', 'hearts', 'test-hearts-A4'),
        card('A', 'hearts', 'test-hearts-A5'),
      ])
      expect(result.handType).toBe('flush_five')
      expect(result.scoringCards).toHaveLength(5)
    })
  })
})
