<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

type BaseKey = 'bin' | 'oct' | 'dec' | 'hex'

const selectedBase = ref<BaseKey>('dec')
const input = ref('')
const errorMessage = ref('')

const baseMap: Record<BaseKey, number> = {
  bin: 2,
  oct: 8,
  dec: 10,
  hex: 16,
}

const normalizeInput = (value: string) => value.trim().replace(/_/g, '')

const parsedValue = computed(() => {
  errorMessage.value = ''
  const value = normalizeInput(input.value)
  if (!value) {
    return null
  }

  const base = baseMap[selectedBase.value]
  const parsed = Number.parseInt(value, base)
  if (Number.isNaN(parsed)) {
    errorMessage.value = 'invalid number'
    return null
  }

  return parsed
})

const formatValue = (base: BaseKey) => {
  const value = parsedValue.value
  if (value === null) {
    return ''
  }

  return value.toString(baseMap[base])
}
</script>

<template>
  <main class="min-h-screen px-6 py-10 text-neutral-200">
    <section class="mx-auto flex max-w-3xl flex-col gap-4">
      <RouterLink class="text-xs text-neutral-400 hover:text-neutral-200" to="/">back</RouterLink>
      <h1 class="text-lg text-neutral-100">base conversion</h1>

      <div class="flex flex-col gap-4 rounded-2xl bg-neutral-900 p-5">
        <div class="flex flex-col gap-2">
          <label class="text-xs text-neutral-400" for="base-input">input</label>
          <input
            id="base-input"
            v-model="input"
            class="w-full rounded-xl bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
            placeholder="enter value"
          />
        </div>

        <div class="flex flex-wrap gap-2 text-xs">
          <button
            v-for="base in Object.keys(baseMap) as BaseKey[]"
            :key="base"
            class="rounded-full px-4 py-2"
            :class="
              selectedBase === base
                ? 'bg-neutral-800 text-neutral-100'
                : 'bg-neutral-950 text-neutral-400'
            "
            type="button"
            @click="selectedBase = base"
          >
            {{ base }}
          </button>
        </div>

        <div class="grid gap-3 text-sm">
          <div class="rounded-xl bg-neutral-950 px-3 py-2">
            <p class="text-xs text-neutral-400">bin</p>
            <p class="break-all text-neutral-100">{{ formatValue('bin') }}</p>
          </div>
          <div class="rounded-xl bg-neutral-950 px-3 py-2">
            <p class="text-xs text-neutral-400">oct</p>
            <p class="break-all text-neutral-100">{{ formatValue('oct') }}</p>
          </div>
          <div class="rounded-xl bg-neutral-950 px-3 py-2">
            <p class="text-xs text-neutral-400">dec</p>
            <p class="break-all text-neutral-100">{{ formatValue('dec') }}</p>
          </div>
          <div class="rounded-xl bg-neutral-950 px-3 py-2">
            <p class="text-xs text-neutral-400">hex</p>
            <p class="break-all text-neutral-100">{{ formatValue('hex') }}</p>
          </div>
        </div>

        <p v-if="errorMessage" class="text-xs text-neutral-300">{{ errorMessage }}</p>
      </div>
    </section>
  </main>
</template>
