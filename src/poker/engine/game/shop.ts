import type { JokerDef, ShopState, ShopItem } from '../types'
import { JOKER_DEFS } from '../jokers/defs'
import { createRng, shuffleArray } from '../rng'

export const BLIND_REWARDS: Record<'small' | 'big' | 'boss', number> = {
  small: 3,
  big: 4,
  boss: 5,
}

export const MAX_JOKER_SLOTS = 5
export const MAX_CONSUMABLE_SLOTS = 2

export function calculateInterest(money: number): number {
  return Math.min(5, Math.floor(money / 5))
}

export function calculateBlindReward(blind: 'small' | 'big' | 'boss', currentMoney: number): number {
  return BLIND_REWARDS[blind] + calculateInterest(currentMoney)
}

export function generateShopItems(seed: string, ante: number, blind: string): ShopState {
  const rng = createRng(`${seed}-shop-${ante}-${blind}`)
  const shuffled = shuffleArray([...JOKER_DEFS], rng)

  const jokerItems: ShopItem[] = shuffled.slice(0, 2).map((def, i) => ({
    id: `shop-joker-${ante}-${blind}-${i}`,
    kind: 'joker' as const,
    jokerDefId: def.id,
    cost: def.cost,
  }))

  const packItem: ShopItem = {
    id: `shop-pack-${ante}-${blind}`,
    kind: 'pack' as const,
    packType: ante % 2 === 0 ? 'celestial' : 'arcana',
    cost: 4,
  }

  return {
    items: [...jokerItems, packItem],
  }
}

export function jokerSellValue(def: JokerDef): number {
  return Math.max(1, Math.floor(def.cost / 2))
}
