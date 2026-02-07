<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  chips: number
  mult: number
  score: number
  visible: boolean
}>()

const displayChips = ref(0)
const displayMult = ref(0)
const displayScore = ref(0)

watch(() => props.visible, (val) => {
  if (!val) {
    displayChips.value = 0
    displayMult.value = 0
    displayScore.value = 0
    return
  }

  const duration = 600
  const start = performance.now()

  function animate(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)

    displayChips.value = Math.round(props.chips * eased)
    displayMult.value = Math.round(props.mult * eased)
    displayScore.value = Math.round(props.score * eased)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
})
</script>

<template>
  <div
    v-if="visible"
    class="flex items-center gap-2 rounded-xl bg-neutral-800 px-4 py-2 text-sm"
  >
    <span class="text-blue-400 font-mono">{{ displayChips }}</span>
    <span class="text-neutral-500">×</span>
    <span class="text-red-400 font-mono">{{ displayMult }}</span>
    <span class="text-neutral-500">=</span>
    <span class="text-neutral-100 font-mono font-bold">{{ displayScore }}</span>
  </div>
</template>
