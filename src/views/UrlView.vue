<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ToolbarButton, ToolbarRoot } from 'reka-ui'

const input = ref('')
const output = ref('')
const errorMessage = ref('')

const hasOutput = computed(() => output.value.length > 0)

const clearMessages = () => {
  errorMessage.value = ''
}

const setOutput = (value: string) => {
  output.value = value
}

const encodeUrl = () => {
  clearMessages()
  try {
    setOutput(encodeURIComponent(input.value))
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'unable to encode'
  }
}

const decodeUrl = () => {
  clearMessages()
  try {
    setOutput(decodeURIComponent(input.value))
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'invalid encoded string'
  }
}

const resetAll = () => {
  input.value = ''
  output.value = ''
  errorMessage.value = ''
}
</script>

<template>
  <main class="min-h-screen px-6 py-10 text-neutral-200">
    <section class="mx-auto flex max-w-3xl flex-col gap-4">
      <RouterLink class="text-xs text-neutral-400 hover:text-neutral-200" to="/">back</RouterLink>
      <h1 class="text-lg text-neutral-100">url encode / decode</h1>

      <div class="flex flex-col gap-4 rounded-2xl bg-neutral-900 p-5">
        <div class="flex flex-col gap-2">
          <label class="text-xs text-neutral-400" for="url-input">input</label>
          <textarea
            id="url-input"
            v-model="input"
            class="min-h-28 w-full rounded-xl bg-neutral-950 p-3 text-sm text-neutral-100"
            placeholder="enter text or encoded string"
          />
        </div>

        <ToolbarRoot class="flex flex-wrap gap-2" aria-label="url actions">
          <ToolbarButton
            class="rounded-full bg-neutral-800 px-4 py-2 text-xs text-neutral-100"
            type="button"
            @click="encodeUrl"
          >
            encode
          </ToolbarButton>
          <ToolbarButton
            class="rounded-full bg-neutral-800 px-4 py-2 text-xs text-neutral-100"
            type="button"
            @click="decodeUrl"
          >
            decode
          </ToolbarButton>
          <ToolbarButton
            class="rounded-full bg-neutral-900 px-4 py-2 text-xs text-neutral-300"
            type="button"
            @click="resetAll"
          >
            reset
          </ToolbarButton>
        </ToolbarRoot>

        <div class="flex flex-col gap-2">
          <label class="text-xs text-neutral-400" for="url-output">output</label>
          <textarea
            id="url-output"
            class="min-h-28 w-full rounded-xl bg-neutral-950 p-3 text-sm text-neutral-100"
            readonly
            :value="output"
          />
        </div>

        <p v-if="!hasOutput" class="text-xs text-neutral-500">output is empty</p>
        <p v-if="errorMessage" class="text-xs text-neutral-300">{{ errorMessage }}</p>
      </div>
    </section>
  </main>
</template>
