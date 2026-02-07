<script setup lang="ts">
import type { Rank, Suit, Enhancement } from '../engine/types'

const props = withDefaults(defineProps<{
  rank: Rank
  suit: Suit
  enhancement?: Enhancement
  selected?: boolean
  debuffed?: boolean
  faceDown?: boolean
}>(), {
  enhancement: 'none',
  selected: false,
  debuffed: false,
  faceDown: false,
})

const suitSymbols: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

const suitColors: Record<Suit, string> = {
  hearts: '#ef4444',
  diamonds: '#ef4444',
  clubs: '#e5e5e5',
  spades: '#e5e5e5',
}

const enhancementColors: Record<Enhancement, string> = {
  none: 'transparent',
  foil: '#60a5fa',
  holo: '#f472b6',
  polychrome: '#a78bfa',
  glass: '#67e8f9',
  steel: '#9ca3af',
  stone: '#78716c',
}
</script>

<template>
  <svg
    width="60"
    height="84"
    viewBox="0 0 60 84"
    class="cursor-pointer select-none transition-transform duration-150"
    :class="props.selected ? '-translate-y-2' : ''"
    :style="props.debuffed ? 'opacity: 0.4' : ''"
  >
    <rect
      x="1" y="1" width="58" height="82" rx="4"
      :fill="props.faceDown ? '#262626' : '#1a1a1a'"
      :stroke="props.selected ? '#666' : '#333'"
      stroke-width="1"
    />

    <template v-if="props.faceDown">
      <line x1="15" y1="15" x2="45" y2="69" stroke="#333" stroke-width="1" />
      <line x1="45" y1="15" x2="15" y2="69" stroke="#333" stroke-width="1" />
      <rect x="20" y="30" width="20" height="24" rx="2" fill="none" stroke="#333" stroke-width="1" />
    </template>

    <template v-else>
      <text
        x="6" y="16"
        :fill="suitColors[props.suit]"
        font-size="13"
        font-weight="600"
        font-family="monospace"
      >{{ props.rank }}</text>

      <text
        x="30" y="50"
        :fill="suitColors[props.suit]"
        font-size="22"
        text-anchor="middle"
        dominant-baseline="middle"
      >{{ suitSymbols[props.suit] }}</text>

      <text
        x="54" y="74"
        :fill="suitColors[props.suit]"
        font-size="13"
        font-weight="600"
        font-family="monospace"
        text-anchor="end"
      >{{ props.rank }}</text>

      <circle
        v-if="props.enhancement !== 'none'"
        cx="52" cy="10"
        r="4"
        :fill="enhancementColors[props.enhancement]"
      />
    </template>
  </svg>
</template>
