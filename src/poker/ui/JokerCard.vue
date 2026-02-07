<script setup lang="ts">
withDefaults(defineProps<{
  name: string
  description: string
  showSell?: boolean
  sellValue?: number
}>(), {
  showSell: false,
  sellValue: 0,
})

defineEmits<{
  sell: []
}>()
</script>

<template>
  <div class="flex flex-col gap-1 rounded-xl bg-neutral-800 px-3 py-2 text-xs min-w-20">
    <span class="text-neutral-100 font-medium">{{ name }}</span>
    <span class="text-neutral-500 text-[10px] leading-tight">{{ description }}</span>
    <button
      v-if="showSell"
      class="mt-1 rounded-full bg-neutral-700 px-2 py-0.5 text-neutral-300 self-start"
      type="button"
      @click="$emit('sell')"
    >
      sell ${{ sellValue }}
    </button>
  </div>
</template>
