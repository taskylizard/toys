import { ref, computed, watch } from 'vue'
import type { RunState, GameAction } from '../engine'
import { gameReducer, initRun, loadFromLocalStorage, saveToLocalStorage, clearSave } from '../engine'

export function usePokerGame() {
  const savedState = loadFromLocalStorage()
  const state = ref<RunState | null>(savedState)

  function dispatch(action: GameAction) {
    if (!state.value && action.type !== 'START_RUN') return
    if (action.type === 'START_RUN') {
      state.value = initRun(action.seed)
    } else {
      state.value = gameReducer(state.value!, action)
    }
  }

  function startRun(seed?: string) {
    clearSave()
    dispatch({ type: 'START_RUN', seed: seed ?? Date.now().toString() })
  }

  watch(state, (newState) => {
    if (newState) {
      if (newState.phase === 'game_over' || newState.phase === 'victory') {
        clearSave()
      } else {
        saveToLocalStorage(newState)
      }
    }
  }, { deep: true })

  const isPlaying = computed(() => state.value?.phase === 'playing')
  const isGameOver = computed(() => state.value?.phase === 'game_over')
  const isVictory = computed(() => state.value?.phase === 'victory')
  const isShop = computed(() => state.value?.phase === 'shop')

  return {
    state,
    dispatch,
    startRun,
    isPlaying,
    isGameOver,
    isVictory,
    isShop,
  }
}
