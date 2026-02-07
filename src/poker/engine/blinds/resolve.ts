import type { CardInstance, Rank } from '../types'
import type { BossEffect } from './defs'

const FACE_RANKS: Rank[] = ['J', 'Q', 'K']

export function isCardDebuffed(card: CardInstance, effect: BossEffect | undefined): boolean {
  if (!effect) return false
  switch (effect.type) {
    case 'debuff_suit':
      return card.base.suit === effect.suit
    case 'no_face_cards':
      return FACE_RANKS.includes(card.base.rank)
    default:
      return false
  }
}

export function getEffectiveHandSize(baseSize: number, effect: BossEffect | undefined): number {
  if (!effect) return baseSize
  if (effect.type === 'reduce_hand_size') {
    return Math.max(1, baseSize - effect.amount)
  }
  return baseSize
}

export function getEffectiveDiscards(baseDiscards: number, effect: BossEffect | undefined): number {
  if (!effect) return baseDiscards
  if (effect.type === 'no_discards') return 0
  return baseDiscards
}

export function getMinPlayCards(effect: BossEffect | undefined): number {
  if (!effect) return 1
  if (effect.type === 'min_cards') return effect.count
  return 1
}

export function filterDebuffedFromScoring(
  scoringCards: CardInstance[],
  effect: BossEffect | undefined,
): CardInstance[] {
  if (!effect) return scoringCards
  return scoringCards.filter((c) => !isCardDebuffed(c, effect))
}
