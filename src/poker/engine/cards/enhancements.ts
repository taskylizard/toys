import type { CardInstance } from '../types'

export interface EnhancementScoreModifier {
  addChips: number
  addMult: number
  mulMult: number
}

export function resolveEnhancements(
  scoringCards: CardInstance[],
  heldCards: CardInstance[],
): EnhancementScoreModifier {
  let addChips = 0
  let addMult = 0
  let mulMult = 1

  for (const card of scoringCards) {
    switch (card.modifier.enhancement) {
      case 'foil':
        addChips += 50
        break
      case 'holo':
        addMult += 10
        break
      case 'polychrome':
        mulMult *= 1.5
        break
      case 'glass':
        mulMult *= 2
        break
      case 'stone':
        addChips += 50
        break
      default:
        break
    }
  }

  for (const card of heldCards) {
    if (card.modifier.enhancement === 'steel') {
      addMult += 50
    }
  }

  return { addChips, addMult, mulMult }
}

export function resolveGlassBreaks(
  scoringCards: CardInstance[],
  rng: () => number,
): string[] {
  const brokenIds: string[] = []
  for (const card of scoringCards) {
    if (card.modifier.enhancement === 'glass' && rng() < 0.25) {
      brokenIds.push(card.id)
    }
  }
  return brokenIds
}
