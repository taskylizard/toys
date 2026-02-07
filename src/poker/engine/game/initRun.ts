import type { RunState } from '../types'
import { createRng } from '../rng'
import { createDeck, shuffleDeck, drawCards } from '../cards/deck'
import { getBlindTarget, HANDS_PER_ROUND, DISCARDS_PER_ROUND, HAND_SIZE, STARTING_MONEY } from './rules'
import { createInitialHandLevels } from './state'

export function initRun(seed: string): RunState {
  const rng = createRng(seed)
  const deck = shuffleDeck(createDeck(), rng)
  const { drawn: hand, remaining } = drawCards(deck, HAND_SIZE)

  const ante = 1
  const blind: 'small' | 'big' | 'boss' = 'small'
  const targetScore = getBlindTarget(ante, blind)

  return {
    phase: 'playing',
    seed,
    ante,
    round: {
      deck: remaining,
      hand,
      discardPile: [],
      handsLeft: HANDS_PER_ROUND,
      discardsLeft: DISCARDS_PER_ROUND,
      score: 0,
    },
    blind: {
      ante,
      blind,
      targetScore,
    },
    money: STARTING_MONEY,
    handLevels: createInitialHandLevels(),
    jokers: [],
    consumables: [],
  }
}
