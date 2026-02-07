import type { RunState } from '../types'

export const SAVE_KEY = 'poker-run-state'
export const SAVE_VERSION = 1

export interface SaveData {
  version: number
  state: RunState
  savedAt: number
}

export function serializeState(state: RunState): string {
  const data: SaveData = {
    version: SAVE_VERSION,
    state,
    savedAt: Date.now(),
  }
  return JSON.stringify(data)
}

export function deserializeState(raw: string): RunState | null {
  try {
    const data = JSON.parse(raw) as SaveData
    if (data.version !== SAVE_VERSION) return null
    if (!data.state || !data.state.phase || !data.state.seed) return null
    return data.state
  } catch {
    return null
  }
}

export function saveToLocalStorage(state: RunState): void {
  try {
    localStorage.setItem(SAVE_KEY, serializeState(state))
  } catch {}
}

export function loadFromLocalStorage(): RunState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    return deserializeState(raw)
  } catch {
    return null
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {}
}

export function hasSave(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null
  } catch {
    return false
  }
}
