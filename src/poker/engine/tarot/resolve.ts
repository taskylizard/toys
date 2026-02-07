import type { CardInstance } from '../types'
import type { TarotEffectType } from './defs'

export interface TarotResult {
  hand: CardInstance[]
  deck: CardInstance[]
  discardPile: CardInstance[]
}

function applyToCard(card: CardInstance, effect: TarotEffectType): CardInstance | null {
  switch (effect.type) {
    case 'change_suit':
      return { ...card, base: { ...card.base, suit: effect.suit } }
    case 'add_enhancement':
      return { ...card, modifier: { ...card.modifier, enhancement: effect.enhancement } }
    case 'destroy':
      return null
    case 'duplicate':
      return card
  }
}

function updateCardInArray(
  cards: CardInstance[],
  targetId: string,
  effect: TarotEffectType,
  dupId: string,
): { updated: CardInstance[]; found: boolean } {
  let found = false
  const updated: CardInstance[] = []

  for (const card of cards) {
    if (card.id === targetId && !found) {
      found = true
      if (effect.type === 'destroy') {
        continue
      }
      if (effect.type === 'duplicate') {
        updated.push(card)
        updated.push({ ...card, id: dupId, selected: false })
      } else {
        const result = applyToCard(card, effect)
        if (result) {
          updated.push(result)
        }
      }
    } else {
      updated.push(card)
    }
  }

  return { updated, found }
}

export function applyTarot(
  effect: TarotEffectType,
  targetCardId: string,
  hand: CardInstance[],
  deck: CardInstance[],
  discardPile: CardInstance[],
  rngSeed: string,
): TarotResult {
  const dupId = `${targetCardId}-copy-${rngSeed}`

  const handResult = updateCardInArray(hand, targetCardId, effect, dupId)
  if (handResult.found) {
    return { hand: handResult.updated, deck, discardPile }
  }

  const deckResult = updateCardInArray(deck, targetCardId, effect, dupId)
  if (deckResult.found) {
    return { hand, deck: deckResult.updated, discardPile }
  }

  const discardResult = updateCardInArray(discardPile, targetCardId, effect, dupId)
  if (discardResult.found) {
    return { hand, deck, discardPile: discardResult.updated }
  }

  return { hand, deck, discardPile }
}
