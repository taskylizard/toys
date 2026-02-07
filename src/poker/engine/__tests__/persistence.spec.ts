import { describe, it, expect, beforeEach } from 'vitest'
import {
  serializeState,
  deserializeState,
  saveToLocalStorage,
  loadFromLocalStorage,
  clearSave,
  hasSave,
  SAVE_VERSION,
} from '../persistence/save'
import { initRun } from '../game/initRun'

describe('persistence', () => {
  it('serializes and deserializes state', () => {
    const state = initRun('test-seed')
    const serialized = serializeState(state)
    const deserialized = deserializeState(serialized)
    expect(deserialized).not.toBeNull()
    expect(deserialized!.seed).toBe('test-seed')
    expect(deserialized!.phase).toBe('playing')
    expect(deserialized!.round.hand).toHaveLength(8)
  })

  it('returns null for invalid JSON', () => {
    expect(deserializeState('not json')).toBeNull()
  })

  it('returns null for wrong version', () => {
    const data = { version: 999, state: initRun('test'), savedAt: Date.now() }
    expect(deserializeState(JSON.stringify(data))).toBeNull()
  })

  it('returns null for missing state fields', () => {
    const data = { version: SAVE_VERSION, state: {}, savedAt: Date.now() }
    expect(deserializeState(JSON.stringify(data))).toBeNull()
  })

  it('preserves jokers and consumables', () => {
    const state = initRun('test-seed')
    const modified = {
      ...state,
      jokers: [{ id: 'j1', defId: 'joker' }],
      consumables: [{ id: 'c1', kind: 'planet' as const, defId: 'mercury' }],
    }
    const serialized = serializeState(modified)
    const deserialized = deserializeState(serialized)
    expect(deserialized!.jokers).toHaveLength(1)
    expect(deserialized!.consumables).toHaveLength(1)
  })

  it('preserves hand levels', () => {
    const state = initRun('test-seed')
    const modified = {
      ...state,
      handLevels: { ...state.handLevels, pair: 3 },
    }
    const serialized = serializeState(modified)
    const deserialized = deserializeState(serialized)
    expect(deserialized!.handLevels.pair).toBe(3)
  })
})

describe('localStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves and loads from localStorage', () => {
    const state = initRun('test-seed')
    saveToLocalStorage(state)
    const loaded = loadFromLocalStorage()
    expect(loaded).not.toBeNull()
    expect(loaded!.seed).toBe('test-seed')
  })

  it('returns null when no save exists', () => {
    expect(loadFromLocalStorage()).toBeNull()
  })

  it('hasSave returns correct value', () => {
    expect(hasSave()).toBe(false)
    saveToLocalStorage(initRun('test'))
    expect(hasSave()).toBe(true)
  })

  it('clearSave removes save', () => {
    saveToLocalStorage(initRun('test'))
    expect(hasSave()).toBe(true)
    clearSave()
    expect(hasSave()).toBe(false)
  })
})
