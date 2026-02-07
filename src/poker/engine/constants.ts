import type { HandType, Rank, Suit } from './types'

export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']

export const RANK_VALUES: Record<Rank, number> = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  '10': 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
}

export const BASE_HAND_SCORES: Record<HandType, { chips: number; mult: number }> = {
  high_card: { chips: 5, mult: 1 },
  pair: { chips: 10, mult: 2 },
  two_pair: { chips: 20, mult: 2 },
  three_of_a_kind: { chips: 30, mult: 3 },
  straight: { chips: 30, mult: 4 },
  flush: { chips: 35, mult: 4 },
  full_house: { chips: 40, mult: 4 },
  four_of_a_kind: { chips: 60, mult: 7 },
  straight_flush: { chips: 100, mult: 8 },
  five_of_a_kind: { chips: 120, mult: 12 },
  flush_house: { chips: 140, mult: 14 },
  flush_five: { chips: 160, mult: 16 },
}

export const HAND_TYPE_DISPLAY_NAMES: Record<HandType, string> = {
  high_card: 'High Card',
  pair: 'Pair',
  two_pair: 'Two Pair',
  three_of_a_kind: 'Three of a Kind',
  straight: 'Straight',
  flush: 'Flush',
  full_house: 'Full House',
  four_of_a_kind: 'Four of a Kind',
  straight_flush: 'Straight Flush',
  five_of_a_kind: 'Five of a Kind',
  flush_house: 'Flush House',
  flush_five: 'Flush Five',
}

export const RANK_CHIP_VALUES: Record<Rank, number> = {
  A: 11,
  K: 10,
  Q: 10,
  J: 10,
  '10': 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
}
