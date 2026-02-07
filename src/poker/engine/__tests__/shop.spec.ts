import { describe, expect, it } from 'vitest'
import { calculateInterest, calculateBlindReward, generateShopItems, jokerSellValue } from '../game/shop'
import { getJokerDef } from '../jokers/defs'

describe('calculateInterest', () => {
  it('returns 0 for less than 5 money', () => {
    expect(calculateInterest(4)).toBe(0)
  })

  it('returns 1 for 5-9 money', () => {
    expect(calculateInterest(5)).toBe(1)
    expect(calculateInterest(9)).toBe(1)
  })

  it('returns 2 for 10-14 money', () => {
    expect(calculateInterest(10)).toBe(2)
    expect(calculateInterest(14)).toBe(2)
  })

  it('caps at 5', () => {
    expect(calculateInterest(25)).toBe(5)
    expect(calculateInterest(100)).toBe(5)
  })

  it('returns 0 for 0 money', () => {
    expect(calculateInterest(0)).toBe(0)
  })
})

describe('calculateBlindReward', () => {
  it('small blind gives base 3 + interest', () => {
    expect(calculateBlindReward('small', 0)).toBe(3)
    expect(calculateBlindReward('small', 10)).toBe(5)
  })

  it('big blind gives base 4 + interest', () => {
    expect(calculateBlindReward('big', 0)).toBe(4)
    expect(calculateBlindReward('big', 10)).toBe(6)
  })

  it('boss blind gives base 5 + interest', () => {
    expect(calculateBlindReward('boss', 0)).toBe(5)
    expect(calculateBlindReward('boss', 10)).toBe(7)
  })
})

describe('generateShopItems', () => {
  it('generates 3 items (2 jokers + 1 pack)', () => {
    const shop = generateShopItems('test-seed', 1, 'small')
    expect(shop.items).toHaveLength(3)
    const jokers = shop.items.filter((i) => i.kind === 'joker')
    const packs = shop.items.filter((i) => i.kind === 'pack')
    expect(jokers).toHaveLength(2)
    expect(packs).toHaveLength(1)
  })

  it('is deterministic with same seed', () => {
    const shop1 = generateShopItems('seed-a', 1, 'small')
    const shop2 = generateShopItems('seed-a', 1, 'small')
    expect(shop1.items.map((i) => i.id)).toEqual(shop2.items.map((i) => i.id))
  })

  it('joker items have valid costs', () => {
    const shop = generateShopItems('test-seed', 1, 'small')
    const jokers = shop.items.filter((i) => i.kind === 'joker')
    for (const item of jokers) {
      if (item.kind === 'joker') {
        const def = getJokerDef(item.jokerDefId)
        expect(def).toBeDefined()
        expect(item.cost).toBe(def!.cost)
      }
    }
  })

  it('pack type alternates based on ante', () => {
    const shopOdd = generateShopItems('test-seed', 1, 'small')
    const shopEven = generateShopItems('test-seed', 2, 'small')
    const packOdd = shopOdd.items.find((i) => i.kind === 'pack')!
    const packEven = shopEven.items.find((i) => i.kind === 'pack')!
    if (packOdd.kind === 'pack' && packEven.kind === 'pack') {
      expect(packOdd.packType).toBe('arcana')
      expect(packEven.packType).toBe('celestial')
    }
  })
})

describe('jokerSellValue', () => {
  it('returns half of cost rounded down, minimum 1', () => {
    const joker = getJokerDef('joker')!
    expect(jokerSellValue(joker)).toBe(1)
  })

  it('returns at least 1', () => {
    expect(
      jokerSellValue({
        id: 't',
        name: 't',
        description: 't',
        rarity: 'common',
        cost: 1,
        trigger: 'on_score',
        condition: { type: 'always' },
        effect: { type: 'add_mult', amount: 1 },
      }),
    ).toBe(1)
  })

  it('returns correct value for higher cost jokers', () => {
    const steelJoker = getJokerDef('steel-joker')!
    expect(jokerSellValue(steelJoker)).toBe(3)
  })
})
