<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { nanoid } from 'nanoid'
import { ulid } from 'ulid'
import { v4 as uuidv4, v7 as uuidv7 } from 'uuid'

const uuidV4Value = ref('')
const uuidV7Value = ref('')
const nanoidValue = ref('')
const ulidValue = ref('')

const generated = computed(() =>
  Boolean(uuidV4Value.value || uuidV7Value.value || nanoidValue.value || ulidValue.value),
)

const generateUuidV4 = () => {
  uuidV4Value.value = uuidv4()
}

const generateUuidV7 = () => {
  uuidV7Value.value = uuidv7()
}

const generateNanoid = () => {
  nanoidValue.value = nanoid()
}

const generateUlid = () => {
  ulidValue.value = ulid()
}

const resetAll = () => {
  uuidV4Value.value = ''
  uuidV7Value.value = ''
  nanoidValue.value = ''
  ulidValue.value = ''
}
</script>

<template>
  <main class="min-h-screen px-6 py-10 text-neutral-200">
    <section class="mx-auto flex max-w-4xl flex-col gap-4">
      <RouterLink class="text-xs text-neutral-400 hover:text-neutral-200" to="/">back</RouterLink>
      <h1 class="text-lg text-neutral-100">id generator</h1>

      <div class="flex flex-col gap-4 rounded-2xl bg-neutral-900 p-5">
        <div class="grid gap-3 md:grid-cols-2">
          <div class="flex flex-col gap-2">
            <label class="text-xs text-neutral-400" for="uuid-v4">uuid v4</label>
            <input
              id="uuid-v4"
              :value="uuidV4Value"
              class="w-full rounded-xl bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
              readonly
            />
            <button
              class="rounded-full bg-neutral-800 px-4 py-2 text-xs text-neutral-100"
              type="button"
              @click="generateUuidV4"
            >
              generate v4
            </button>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs text-neutral-400" for="uuid-v7">uuid v7</label>
            <input
              id="uuid-v7"
              :value="uuidV7Value"
              class="w-full rounded-xl bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
              readonly
            />
            <button
              class="rounded-full bg-neutral-800 px-4 py-2 text-xs text-neutral-100"
              type="button"
              @click="generateUuidV7"
            >
              generate v7
            </button>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs text-neutral-400" for="nanoid">nanoid</label>
            <input
              id="nanoid"
              :value="nanoidValue"
              class="w-full rounded-xl bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
              readonly
            />
            <button
              class="rounded-full bg-neutral-800 px-4 py-2 text-xs text-neutral-100"
              type="button"
              @click="generateNanoid"
            >
              generate nanoid
            </button>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs text-neutral-400" for="ulid">ulid</label>
            <input
              id="ulid"
              :value="ulidValue"
              class="w-full rounded-xl bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
              readonly
            />
            <button
              class="rounded-full bg-neutral-800 px-4 py-2 text-xs text-neutral-100"
              type="button"
              @click="generateUlid"
            >
              generate ulid
            </button>
          </div>
        </div>

        <button
          class="rounded-full bg-neutral-900 px-4 py-2 text-xs text-neutral-300"
          type="button"
          @click="resetAll"
        >
          reset
        </button>

        <p v-if="!generated" class="text-xs text-neutral-500">no ids generated yet</p>
      </div>
    </section>
  </main>
</template>
