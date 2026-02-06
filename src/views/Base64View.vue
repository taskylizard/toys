<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ToolbarButton, ToolbarRoot } from 'reka-ui'
import { useClipboard } from '@vueuse/core'

const input = ref('')
const output = ref('')
const errorMessage = ref('')

const { copy, copied, isSupported } = useClipboard()

const hasOutput = computed(() => output.value.length > 0)

const clearMessages = () => {
  errorMessage.value = ''
}

const setOutput = (value: string) => {
  output.value = value
}

const encodeBase64 = () => {
  clearMessages()
  try {
    const encoded = btoa(unescape(encodeURIComponent(input.value)))
    setOutput(encoded)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'unable to encode input'
  }
}

const decodeBase64 = () => {
  clearMessages()
  try {
    const decoded = decodeURIComponent(escape(atob(input.value)))
    setOutput(decoded)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'invalid base64 string'
  }
}

const copyOutput = async () => {
  if (!output.value) {
    return
  }

  await copy(output.value)
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
      <RouterLink class="text-xs text-neutral-400 hover:text-neutral-200" to="/"> back </RouterLink>

      <div class="flex flex-col gap-4 rounded-2xl bg-neutral-900 p-5">
        <div class="flex flex-col gap-2">
          <label class="text-xs text-neutral-400" for="input">input</label>
          <textarea
            id="input"
            v-model="input"
            class="min-h-28 w-full rounded-xl bg-neutral-950 p-3 text-sm text-neutral-100"
            placeholder="enter text or base64"
          />
        </div>

        <ToolbarRoot class="flex flex-wrap gap-2" aria-label="base64 actions">
          <ToolbarButton
            class="rounded-full bg-neutral-800 px-4 py-2 text-xs text-neutral-100"
            type="button"
            @click="encodeBase64"
          >
            encode
          </ToolbarButton>
          <ToolbarButton
            class="rounded-full bg-neutral-800 px-4 py-2 text-xs text-neutral-100"
            type="button"
            @click="decodeBase64"
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
          <label class="text-xs text-neutral-400" for="output">output</label>
          <textarea
            id="output"
            class="min-h-28 w-full rounded-xl bg-neutral-950 p-3 text-sm text-neutral-100"
            readonly
            :value="output"
          />
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <ToolbarButton
            class="rounded-full bg-neutral-800 px-4 py-2 text-xs text-neutral-100"
            type="button"
            :disabled="!hasOutput || !isSupported"
            @click="copyOutput"
          >
            {{ copied ? 'copied' : 'copy output' }}
          </ToolbarButton>
          <p v-if="!isSupported" class="text-xs text-neutral-500">clipboard unsupported</p>
          <p v-if="errorMessage" class="text-xs text-neutral-300">{{ errorMessage }}</p>
        </div>
      </div>
    </section>
  </main>
</template>
