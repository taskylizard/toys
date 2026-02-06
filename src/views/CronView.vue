<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

const withRange = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => (start + index).toString())

const minuteOptions = ['*', ...withRange(0, 59)]
const hourOptions = ['*', ...withRange(0, 23)]
const dayOptions = ['*', ...withRange(1, 31)]
const monthOptions = ['*', ...withRange(1, 12)]
const weekdayOptions = ['*', ...withRange(0, 6)]

const minute = ref('*')
const hour = ref('*')
const day = ref('*')
const month = ref('*')
const weekday = ref('*')

const expression = computed(
  () => `${minute.value} ${hour.value} ${day.value} ${month.value} ${weekday.value}`,
)
</script>

<template>
  <main class="min-h-screen px-6 py-10 text-neutral-200">
    <section class="mx-auto flex max-w-3xl flex-col gap-4">
      <RouterLink class="text-xs text-neutral-400 hover:text-neutral-200" to="/">back</RouterLink>
      <h1 class="text-lg text-neutral-100">cron expression builder</h1>

      <div class="grid gap-3 md:grid-cols-2">
        <label class="flex flex-col gap-2 text-xs text-neutral-400">
          minute
          <select
            v-model="minute"
            class="rounded-xl bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          >
            <option v-for="value in minuteOptions" :key="`minute-${value}`" :value="value">
              {{ value }}
            </option>
          </select>
        </label>
        <label class="flex flex-col gap-2 text-xs text-neutral-400">
          hour
          <select
            v-model="hour"
            class="rounded-xl bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          >
            <option v-for="value in hourOptions" :key="`hour-${value}`" :value="value">
              {{ value }}
            </option>
          </select>
        </label>
        <label class="flex flex-col gap-2 text-xs text-neutral-400">
          day of month
          <select
            v-model="day"
            class="rounded-xl bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          >
            <option v-for="value in dayOptions" :key="`day-${value}`" :value="value">
              {{ value }}
            </option>
          </select>
        </label>
        <label class="flex flex-col gap-2 text-xs text-neutral-400">
          month
          <select
            v-model="month"
            class="rounded-xl bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          >
            <option v-for="value in monthOptions" :key="`month-${value}`" :value="value">
              {{ value }}
            </option>
          </select>
        </label>
        <label class="flex flex-col gap-2 text-xs text-neutral-400">
          weekday (0 sunday)
          <select
            v-model="weekday"
            class="rounded-xl bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          >
            <option v-for="value in weekdayOptions" :key="`weekday-${value}`" :value="value">
              {{ value }}
            </option>
          </select>
        </label>
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-xs text-neutral-400" for="cron-expression">expression</label>
        <input
          id="cron-expression"
          :value="expression"
          class="w-full rounded-xl bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          readonly
        />
      </div>
    </section>
  </main>
</template>
