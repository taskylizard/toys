<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import SparkMD5 from 'spark-md5'

const input = ref('')

const encoder = new TextEncoder()

const digestHex = async (algorithm: string, text: string) => {
  const data = encoder.encode(text)
  const hash = await crypto.subtle.digest(algorithm, data)
  return Array.from(new Uint8Array(hash))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')
}

const md5Hash = computed(() => SparkMD5.hash(input.value))
const sha1Hash = ref('')
const sha256Hash = ref('')
const sha512Hash = ref('')

const refreshHashes = async () => {
  sha1Hash.value = await digestHex('SHA-1', input.value)
  sha256Hash.value = await digestHex('SHA-256', input.value)
  sha512Hash.value = await digestHex('SHA-512', input.value)
}

watch(
  input,
  () => {
    void refreshHashes()
  },
  { immediate: true },
)
</script>

<template>
  <main class="min-h-screen px-6 py-10 text-neutral-200">
    <section class="mx-auto flex max-w-4xl flex-col gap-4">
      <RouterLink class="text-xs text-neutral-400 hover:text-neutral-200" to="/">back</RouterLink>
      <h1 class="text-lg text-neutral-100">hash playground</h1>

      <div class="flex flex-col gap-4 rounded-2xl bg-neutral-900 p-5">
        <div class="flex flex-col gap-2">
          <label class="text-xs text-neutral-400" for="hash-input">input</label>
          <textarea
            id="hash-input"
            v-model="input"
            class="min-h-28 w-full rounded-xl bg-neutral-950 p-3 text-sm text-neutral-100"
            placeholder="enter text to hash"
          />
        </div>

        <div class="grid gap-3 text-sm">
          <div class="rounded-xl bg-neutral-950 px-3 py-2">
            <p class="text-xs text-neutral-400">md5</p>
            <p class="break-all text-neutral-100">{{ md5Hash }}</p>
          </div>
          <div class="rounded-xl bg-neutral-950 px-3 py-2">
            <p class="text-xs text-neutral-400">sha1</p>
            <p class="break-all text-neutral-100">{{ sha1Hash }}</p>
          </div>
          <div class="rounded-xl bg-neutral-950 px-3 py-2">
            <p class="text-xs text-neutral-400">sha256</p>
            <p class="break-all text-neutral-100">{{ sha256Hash }}</p>
          </div>
          <div class="rounded-xl bg-neutral-950 px-3 py-2">
            <p class="text-xs text-neutral-400">sha512</p>
            <p class="break-all text-neutral-100">{{ sha512Hash }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
