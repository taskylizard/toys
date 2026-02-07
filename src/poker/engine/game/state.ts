import type { HandType } from '../types'

export function createInitialHandLevels(): Record<HandType, number> {
  return {
    high_card: 1,
    pair: 1,
    two_pair: 1,
    three_of_a_kind: 1,
    straight: 1,
    flush: 1,
    full_house: 1,
    four_of_a_kind: 1,
    straight_flush: 1,
    five_of_a_kind: 1,
    flush_house: 1,
    flush_five: 1,
  }
}
