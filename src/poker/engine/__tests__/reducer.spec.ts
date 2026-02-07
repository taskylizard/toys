import { describe, expect, it } from 'vitest'
import { gameReducer } from '../game/reducer'
import { initRun } from '../game/initRun'

describe('gameReducer', () => {
  it('START_RUN creates initial state', () => {
    const state = initRun('test-seed')
    expect(state.phase).toBe('playing')
    expect(state.round.hand).toHaveLength(8)
    expect(state.round.handsLeft).toBe(4)
    expect(state.round.discardsLeft).toBe(3)
    expect(state.jokers).toHaveLength(0)
    expect(state.consumables).toHaveLength(0)
  })

  it('SELECT_CARD marks card as selected', () => {
    const state = initRun('test-seed')
    const cardId = state.round.hand[0]!.id
    const next = gameReducer(state, { type: 'SELECT_CARD', cardId })
    expect(next.round.hand.find((c) => c.id === cardId)!.selected).toBe(true)
  })

  it('SELECT_CARD limits to 5 selected', () => {
    let state = initRun('test-seed')
    for (let i = 0; i < 5; i++) {
      state = gameReducer(state, { type: 'SELECT_CARD', cardId: state.round.hand[i]!.id })
    }
    const sixthId = state.round.hand[5]!.id
    const next = gameReducer(state, { type: 'SELECT_CARD', cardId: sixthId })
    expect(next.round.hand.filter((c) => c.selected)).toHaveLength(5)
  })

  it('DESELECT_CARD unselects card', () => {
    const state = initRun('test-seed')
    const cardId = state.round.hand[0]!.id
    const selected = gameReducer(state, { type: 'SELECT_CARD', cardId })
    const deselected = gameReducer(selected, { type: 'DESELECT_CARD', cardId })
    expect(deselected.round.hand.find((c) => c.id === cardId)!.selected).toBe(false)
  })

  it('DISCARD removes selected cards and draws replacements', () => {
    let state = initRun('test-seed')
    const cardId = state.round.hand[0]!.id
    state = gameReducer(state, { type: 'SELECT_CARD', cardId })
    const next = gameReducer(state, { type: 'DISCARD' })
    expect(next.round.hand).toHaveLength(8)
    expect(next.round.discardsLeft).toBe(2)
    expect(next.round.hand.find((c) => c.id === cardId)).toBeUndefined()
  })

  it('DISCARD does nothing with no selected cards', () => {
    const state = initRun('test-seed')
    const next = gameReducer(state, { type: 'DISCARD' })
    expect(next).toBe(state)
  })

  it('PLAY_HAND decrements hands left', () => {
    let state = initRun('test-seed')
    state = gameReducer(state, { type: 'SELECT_CARD', cardId: state.round.hand[0]!.id })
    const next = gameReducer(state, { type: 'PLAY_HAND' })
    if (next.phase === 'playing') {
      expect(next.round.handsLeft).toBe(3)
    }
  })

  it('PLAY_HAND does nothing with no selected cards', () => {
    const state = initRun('test-seed')
    const next = gameReducer(state, { type: 'PLAY_HAND' })
    expect(next).toBe(state)
  })

  it('BUY_JOKER in shop adds joker and subtracts money', () => {
    let state = initRun('test-seed')
    state = {
      ...state,
      phase: 'shop',
      money: 20,
      shop: {
        items: [{ id: 'shop-j1', kind: 'joker', jokerDefId: 'joker', cost: 2 }],
      },
    }
    const next = gameReducer(state, { type: 'BUY_JOKER', shopItemId: 'shop-j1' })
    expect(next.jokers).toHaveLength(1)
    expect(next.jokers[0]!.defId).toBe('joker')
    expect(next.money).toBe(18)
  })

  it('BUY_JOKER fails with insufficient money', () => {
    let state = initRun('test-seed')
    state = {
      ...state,
      phase: 'shop',
      money: 1,
      shop: {
        items: [{ id: 'shop-j1', kind: 'joker', jokerDefId: 'joker', cost: 2 }],
      },
    }
    const next = gameReducer(state, { type: 'BUY_JOKER', shopItemId: 'shop-j1' })
    expect(next.jokers).toHaveLength(0)
    expect(next.money).toBe(1)
  })

  it('BUY_JOKER respects max joker slots', () => {
    let state = initRun('test-seed')
    state = {
      ...state,
      phase: 'shop',
      money: 100,
      jokers: [
        { id: 'j0', defId: 'joker' },
        { id: 'j1', defId: 'joker' },
        { id: 'j2', defId: 'joker' },
        { id: 'j3', defId: 'joker' },
        { id: 'j4', defId: 'joker' },
      ],
      shop: {
        items: [{ id: 'shop-j1', kind: 'joker', jokerDefId: 'joker', cost: 2 }],
      },
    }
    const next = gameReducer(state, { type: 'BUY_JOKER', shopItemId: 'shop-j1' })
    expect(next.jokers).toHaveLength(5)
  })

  it('BUY_JOKER removes item from shop', () => {
    let state = initRun('test-seed')
    state = {
      ...state,
      phase: 'shop',
      money: 20,
      shop: {
        items: [
          { id: 'shop-j1', kind: 'joker', jokerDefId: 'joker', cost: 2 },
          { id: 'shop-j2', kind: 'joker', jokerDefId: 'jolly-joker', cost: 3 },
        ],
      },
    }
    const next = gameReducer(state, { type: 'BUY_JOKER', shopItemId: 'shop-j1' })
    expect(next.shop!.items).toHaveLength(1)
    expect(next.shop!.items[0]!.id).toBe('shop-j2')
  })

  it('SELL_JOKER removes joker and adds money', () => {
    let state = initRun('test-seed')
    state = {
      ...state,
      jokers: [{ id: 'j1', defId: 'joker' }],
      money: 5,
    }
    const next = gameReducer(state, { type: 'SELL_JOKER', jokerInstanceId: 'j1' })
    expect(next.jokers).toHaveLength(0)
    expect(next.money).toBeGreaterThan(5)
  })

  it('SELL_JOKER does nothing for unknown joker', () => {
    let state = initRun('test-seed')
    state = { ...state, money: 5 }
    const next = gameReducer(state, { type: 'SELL_JOKER', jokerInstanceId: 'nonexistent' })
    expect(next.money).toBe(5)
  })

  it('USE_PLANET increments hand level', () => {
    let state = initRun('test-seed')
    state = {
      ...state,
      consumables: [{ id: 'p1', kind: 'planet', defId: 'mercury' }],
    }
    const next = gameReducer(state, { type: 'USE_PLANET', consumableId: 'p1' })
    expect(next.handLevels.pair).toBe(2)
    expect(next.consumables).toHaveLength(0)
  })

  it('USE_PLANET does nothing for unknown consumable', () => {
    const state = initRun('test-seed')
    const next = gameReducer(state, { type: 'USE_PLANET', consumableId: 'nonexistent' })
    expect(next.handLevels.pair).toBe(1)
  })

  it('LEAVE_SHOP advances to next blind', () => {
    let state = initRun('test-seed')
    state = { ...state, phase: 'shop', shop: { items: [] } }
    const next = gameReducer(state, { type: 'LEAVE_SHOP' })
    expect(next.phase).toBe('playing')
    expect(next.shop).toBeUndefined()
  })

  it('LEAVE_SHOP does nothing outside shop phase', () => {
    const state = initRun('test-seed')
    const next = gameReducer(state, { type: 'LEAVE_SHOP' })
    expect(next).toBe(state)
  })
})
