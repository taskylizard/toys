<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { converter, formatCss, formatHex, formatHsl, formatRgb, parse } from 'culori'

const hue = ref(320)
const saturation = ref(60)
const lightness = ref(50)

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const hslCss = computed(
  () =>
    `hsl(${clamp(hue.value, 0, 360)} ${clamp(saturation.value, 0, 100)}% ${clamp(lightness.value, 0, 100)}%)`,
)

const parsed = computed(() => parse(hslCss.value))
const toOklch = converter('oklch')
const toP3 = converter('p3')

const hexValue = computed(() => (parsed.value ? formatHex(parsed.value) : ''))
const rgbValue = computed(() => (parsed.value ? formatRgb(parsed.value) : ''))
const hslValue = computed(() => (parsed.value ? formatHsl(parsed.value) : ''))
const oklchValue = computed(() => {
  if (!parsed.value) {
    return ''
  }

  const value = toOklch(parsed.value)
  if (!value) {
    return ''
  }

  const l = (value.l ?? 0).toFixed(3)
  const c = (value.c ?? 0).toFixed(3)
  const h = (value.h ?? 0).toFixed(1)
  return `oklch(${l} ${c} ${h})`
})
const p3Value = computed(() => (parsed.value ? formatCss(toP3(parsed.value)) : ''))

const handleHue = (event: Event) => {
  const target = event.target as HTMLInputElement
  hue.value = Number.parseFloat(target.value)
}

const handleSaturation = (event: Event) => {
  const target = event.target as HTMLInputElement
  saturation.value = Number.parseFloat(target.value)
}

const handleLightness = (event: Event) => {
  const target = event.target as HTMLInputElement
  lightness.value = Number.parseFloat(target.value)
}
</script>

<template>
  <main class="min-h-screen px-6 py-10 text-neutral-200">
    <section class="mx-auto flex max-w-4xl flex-col gap-4">
      <RouterLink class="text-xs text-neutral-400 hover:text-neutral-200" to="/">back</RouterLink>
      <h1 class="text-lg text-neutral-100">color picker</h1>

      <div class="grid gap-4 md:grid-cols-[1.1fr_1fr]">
        <div class="flex flex-col gap-4 rounded-2xl bg-neutral-900 p-5">
          <div class="h-40 w-full rounded-xl" :style="{ background: hslCss }" />

          <div class="flex flex-col gap-3 text-xs text-neutral-400">
            <label class="flex flex-col gap-2">
              hue
              <input
                type="range"
                min="0"
                max="360"
                :value="hue"
                class="accent-neutral-200"
                @input="handleHue"
              />
            </label>
            <label class="flex flex-col gap-2">
              saturation
              <input
                type="range"
                min="0"
                max="100"
                :value="saturation"
                class="accent-neutral-200"
                @input="handleSaturation"
              />
            </label>
            <label class="flex flex-col gap-2">
              lightness
              <input
                type="range"
                min="0"
                max="100"
                :value="lightness"
                class="accent-neutral-200"
                @input="handleLightness"
              />
            </label>
          </div>
        </div>

        <div class="flex flex-col gap-3 text-sm">
          <div class="rounded-xl bg-neutral-950 px-3 py-2">
            <p class="text-xs text-neutral-400">hex</p>
            <p class="text-neutral-100">{{ hexValue }}</p>
          </div>
          <div class="rounded-xl bg-neutral-950 px-3 py-2">
            <p class="text-xs text-neutral-400">rgb</p>
            <p class="text-neutral-100">{{ rgbValue }}</p>
          </div>
          <div class="rounded-xl bg-neutral-950 px-3 py-2">
            <p class="text-xs text-neutral-400">hsl</p>
            <p class="text-neutral-100">{{ hslValue }}</p>
          </div>
          <div class="rounded-xl bg-neutral-950 px-3 py-2">
            <p class="text-xs text-neutral-400">oklch</p>
            <p class="text-neutral-100">{{ oklchValue }}</p>
          </div>
          <div class="rounded-xl bg-neutral-950 px-3 py-2">
            <p class="text-xs text-neutral-400">display-p3</p>
            <p class="text-neutral-100">{{ p3Value }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
