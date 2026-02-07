import type { Enhancement, Suit } from '../types'

export type TarotEffectType =
  | { type: 'change_suit'; suit: Suit }
  | { type: 'add_enhancement'; enhancement: Enhancement }
  | { type: 'destroy' }
  | { type: 'duplicate' }

export interface TarotDef {
  id: string
  name: string
  description: string
  effect: TarotEffectType
}

export const TAROT_DEFS: TarotDef[] = [
  {
    id: 'the-fool',
    name: 'the fool',
    description: 'change suit to hearts',
    effect: { type: 'change_suit', suit: 'hearts' },
  },
  {
    id: 'the-magician',
    name: 'the magician',
    description: 'add foil enhancement',
    effect: { type: 'add_enhancement', enhancement: 'foil' },
  },
  {
    id: 'the-empress',
    name: 'the empress',
    description: 'add holo enhancement',
    effect: { type: 'add_enhancement', enhancement: 'holo' },
  },
  {
    id: 'the-hierophant',
    name: 'the hierophant',
    description: 'add polychrome enhancement',
    effect: { type: 'add_enhancement', enhancement: 'polychrome' },
  },
  {
    id: 'the-lovers',
    name: 'the lovers',
    description: 'change suit to diamonds',
    effect: { type: 'change_suit', suit: 'diamonds' },
  },
  {
    id: 'the-chariot',
    name: 'the chariot',
    description: 'add steel enhancement',
    effect: { type: 'add_enhancement', enhancement: 'steel' },
  },
  {
    id: 'justice',
    name: 'justice',
    description: 'add glass enhancement',
    effect: { type: 'add_enhancement', enhancement: 'glass' },
  },
  {
    id: 'the-hermit',
    name: 'the hermit',
    description: 'change suit to spades',
    effect: { type: 'change_suit', suit: 'spades' },
  },
  {
    id: 'death',
    name: 'death',
    description: 'destroy a card',
    effect: { type: 'destroy' },
  },
  {
    id: 'the-tower',
    name: 'the tower',
    description: 'add stone enhancement',
    effect: { type: 'add_enhancement', enhancement: 'stone' },
  },
]

export function getTarotDef(id: string): TarotDef | undefined {
  return TAROT_DEFS.find((t) => t.id === id)
}
