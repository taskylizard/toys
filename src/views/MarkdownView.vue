<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { marked } from 'marked'

const input = ref('# markdown')

const rendered = computed(() => marked.parse(input.value))
</script>

<template>
  <main class="min-h-screen px-6 py-10 text-neutral-200">
    <section class="mx-auto flex max-w-5xl flex-col gap-4">
      <RouterLink class="text-xs text-neutral-400 hover:text-neutral-200" to="/">back</RouterLink>
      <h1 class="text-lg text-neutral-100">markdown previewer</h1>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <label class="text-xs text-neutral-400" for="markdown-input">input</label>
          <textarea
            id="markdown-input"
            v-model="input"
            class="min-h-64 w-full rounded-xl bg-neutral-950 p-3 text-sm text-neutral-100"
          />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xs text-neutral-400">preview</span>
          <div class="min-h-64 w-full rounded-xl bg-neutral-950 p-3 text-sm text-neutral-100">
            <div class="prose prose-invert max-w-none" v-html="rendered" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
