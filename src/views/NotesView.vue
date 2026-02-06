<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'

const notes = useLocalStorage('toys.notes', '')
</script>

<template>
  <main class="min-h-screen px-6 py-10 text-neutral-200">
    <section class="mx-auto flex max-w-3xl flex-col gap-4">
      <RouterLink class="text-xs text-neutral-400 hover:text-neutral-200" to="/">back</RouterLink>
      <h1 class="text-lg text-neutral-100">notepad</h1>

      <div class="flex flex-col gap-2">
        <label class="text-xs text-neutral-400" for="notes-input">notes</label>
        <textarea
          id="notes-input"
          v-model="notes"
          class="min-h-72 w-full rounded-xl bg-neutral-950 p-3 text-sm text-neutral-100"
          placeholder="write anything"
        />
      </div>
    </section>
  </main>
</template>
