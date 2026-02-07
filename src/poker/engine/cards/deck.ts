import type { CardInstance } from '../types'
import { RANKS, SUITS } from '../constants'
import { shuffleArray } from '../rng'

export function createDeck(): CardInstance[] {
  const deck: CardInstance[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `card-${suit}-${rank}`,
        base: { suit, rank },
        modifier: { enhancement: 'none' },
        selected: false,
      })
    }
  }
  return deck
}

export function shuffleDeck(deck: CardInstance[], rng: () => number): CardInstance[] {
  return shuffleArray(deck, rng)
}

export function drawCards(
  deck: CardInstance[],
  count: number,
): { drawn: CardInstance[]; remaining: CardInstance[] } {
  const n = Math.min(count, deck.length)
  return {
    drawn: deck.slice(0, n),
    remaining: deck.slice(n),
  }
}
