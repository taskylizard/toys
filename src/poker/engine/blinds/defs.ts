import type { Suit } from '../types'

export type BossEffect =
  | { type: 'debuff_suit'; suit: Suit }
  | { type: 'no_face_cards' }
  | { type: 'reduce_hand_size'; amount: number }
  | { type: 'no_discards' }
  | { type: 'min_cards'; count: number }
  | { type: 'face_down'; count: number }

export interface BossBlindDef {
  id: string
  name: string
  description: string
  effect: BossEffect
}

export const BOSS_BLIND_DEFS: BossBlindDef[] = [
  {
    id: 'the-hook',
    name: 'the hook',
    description: 'discards 2 random cards per hand played',
    effect: { type: 'reduce_hand_size', amount: 2 },
  },
  {
    id: 'the-wall',
    name: 'the wall',
    description: 'extra large blind',
    effect: { type: 'no_discards' },
  },
  {
    id: 'the-club',
    name: 'the club',
    description: 'all clubs are debuffed',
    effect: { type: 'debuff_suit', suit: 'clubs' },
  },
  {
    id: 'the-goad',
    name: 'the goad',
    description: 'all spades are debuffed',
    effect: { type: 'debuff_suit', suit: 'spades' },
  },
  {
    id: 'the-head',
    name: 'the head',
    description: 'all hearts are debuffed',
    effect: { type: 'debuff_suit', suit: 'hearts' },
  },
  {
    id: 'the-window',
    name: 'the window',
    description: 'all diamonds are debuffed',
    effect: { type: 'debuff_suit', suit: 'diamonds' },
  },
  {
    id: 'the-plant',
    name: 'the plant',
    description: 'all face cards are debuffed',
    effect: { type: 'no_face_cards' },
  },
  {
    id: 'the-psychic',
    name: 'the psychic',
    description: 'must play 5 cards',
    effect: { type: 'min_cards', count: 5 },
  },
]

export function getBossBlindDef(id: string): BossBlindDef | undefined {
  return BOSS_BLIND_DEFS.find((b) => b.id === id)
}
