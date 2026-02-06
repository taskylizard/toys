<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { diffLines } from 'diff'

type DiffRow = {
  left: string
  right: string
  type: 'added' | 'removed' | 'same'
}

const leftText = ref('')
const rightText = ref('')

const buildRows = (left: string, right: string): DiffRow[] => {
  const changes = diffLines(left, right)
  const rows: DiffRow[] = []

  changes.forEach((change) => {
    const lines = change.value.split('\n')
    if (lines[lines.length - 1] === '') {
      lines.pop()
    }

    lines.forEach((line) => {
      if (change.added) {
        rows.push({ left: '', right: line, type: 'added' })
        return
      }

      if (change.removed) {
        rows.push({ left: line, right: '', type: 'removed' })
        return
      }

      rows.push({ left: line, right: line, type: 'same' })
    })
  })

  return rows
}

const diffRows = computed(() => buildRows(leftText.value, rightText.value))
</script>

<template>
  <main class="min-h-screen px-6 py-10 text-neutral-200">
    <section class="mx-auto flex max-w-5xl flex-col gap-4">
      <RouterLink class="text-xs text-neutral-400 hover:text-neutral-200" to="/">back</RouterLink>
      <h1 class="text-lg text-neutral-100">side-by-side text differ</h1>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <label class="text-xs text-neutral-400" for="diff-left">left</label>
          <textarea
            id="diff-left"
            v-model="leftText"
            class="min-h-40 w-full rounded-xl bg-neutral-950 p-3 text-sm text-neutral-100"
            placeholder="left text"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-xs text-neutral-400" for="diff-right">right</label>
          <textarea
            id="diff-right"
            v-model="rightText"
            class="min-h-40 w-full rounded-xl bg-neutral-950 p-3 text-sm text-neutral-100"
            placeholder="right text"
          />
        </div>
      </div>

      <div class="grid gap-px overflow-hidden rounded-xl bg-neutral-900 text-sm">
        <div class="grid grid-cols-2 bg-neutral-900 text-xs text-neutral-400">
          <div class="px-3 py-2">left</div>
          <div class="px-3 py-2">right</div>
        </div>
        <div
          v-for="(row, index) in diffRows"
          :key="`${row.type}-${index}`"
          class="grid grid-cols-2 gap-px bg-neutral-900"
          data-testid="diff-row"
        >
          <div
            class="px-3 py-2"
            :class="
              row.type === 'removed'
                ? 'bg-neutral-800 text-neutral-200'
                : 'bg-neutral-950 text-neutral-300'
            "
          >
            {{ row.left || ' ' }}
          </div>
          <div
            class="px-3 py-2"
            :class="
              row.type === 'added'
                ? 'bg-neutral-800 text-neutral-200'
                : 'bg-neutral-950 text-neutral-300'
            "
          >
            {{ row.right || ' ' }}
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
