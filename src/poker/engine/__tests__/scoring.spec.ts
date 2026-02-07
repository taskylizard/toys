import { describe, expect, it } from 'vitest'
import type { CardInstance, HandEval } from '../types'
import { calculateScore } from '../poker/scoring'
import { createInitialHandLevels } from '../game/state'

function card(rank: string, suit: string, id?: string): CardInstance {
  return {
    id: id ?? `test-${suit}-${rank}`,
    base: { suit: suit as any, rank: rank as any },
    modifier: { enhancement: 'none' },
    selected: false,
  }
}

describe('calculateScore', () => {
  it('scores high_card with a single ace', () => {
    const eval_: HandEval = {
      handType: 'high_card',
      scoringCards: [card('A', 'spades')],
    }
    const result = calculateScore(eval_, createInitialHandLevels())
    expect(result.baseChips).toBe(5)
    expect(result.baseMult).toBe(1)
    expect(result.totalChips).toBe(16)
    expect(result.totalMult).toBe(1)
    expect(result.score).toBe(16)
  })

  it('scores a pair of kings', () => {
    const eval_: HandEval = {
      handType: 'pair',
      scoringCards: [card('K', 'spades'), card('K', 'hearts')],
    }
    const result = calculateScore(eval_, createInitialHandLevels())
    expect(result.baseChips).toBe(10)
    expect(result.baseMult).toBe(2)
    expect(result.totalChips).toBe(30)
    expect(result.totalMult).toBe(2)
    expect(result.score).toBe(60)
  })

  it('scores a flush', () => {
    const eval_: HandEval = {
      handType: 'flush',
      scoringCards: [
        card('2', 'hearts'),
        card('5', 'hearts', 'test-hearts-5'),
        card('8', 'hearts', 'test-hearts-8'),
        card('J', 'hearts', 'test-hearts-J'),
        card('A', 'hearts', 'test-hearts-A'),
      ],
    }
    const result = calculateScore(eval_, createInitialHandLevels())
    expect(result.baseChips).toBe(35)
    expect(result.baseMult).toBe(4)
    expect(result.totalChips).toBe(71)
    expect(result.totalMult).toBe(4)
    expect(result.score).toBe(284)
  })

  it('scales with hand level 2 for pair', () => {
    const eval_: HandEval = {
      handType: 'pair',
      scoringCards: [card('K', 'spades'), card('K', 'hearts')],
    }
    const levels = createInitialHandLevels()
    levels.pair = 2
    const result = calculateScore(eval_, levels)
    expect(result.baseChips).toBe(20)
    expect(result.baseMult).toBe(4)
    expect(result.totalChips).toBe(40)
    expect(result.totalMult).toBe(4)
    expect(result.score).toBe(160)
  })

  it('scores a full_house', () => {
    const eval_: HandEval = {
      handType: 'full_house',
      scoringCards: [
        card('K', 'spades'),
        card('K', 'hearts'),
        card('K', 'diamonds'),
        card('7', 'clubs'),
        card('7', 'spades', 'test-spades-7'),
      ],
    }
    const result = calculateScore(eval_, createInitialHandLevels())
    expect(result.baseChips).toBe(40)
    expect(result.baseMult).toBe(4)
    expect(result.totalChips).toBe(84)
    expect(result.totalMult).toBe(4)
    expect(result.score).toBe(336)
  })
})
