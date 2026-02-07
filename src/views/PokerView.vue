<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { usePokerGame } from '../poker/state/usePokerGame'
import {
  HAND_TYPE_DISPLAY_NAMES,
  evaluateHand,
  calculateScore,
  resolveJokers,
  resolveEnhancements,
  getJokerDef,
  getPlanetDef,
  getTarotDef,
  jokerSellValue,
  getBossBlindDef,
  isCardDebuffed,
  getMinPlayCards,
  filterDebuffedFromScoring,
} from '../poker/engine'
import CardSvg from '../poker/ui/CardSvg.vue'
import ScoreTicker from '../poker/ui/ScoreTicker.vue'
import JokerCard from '../poker/ui/JokerCard.vue'

const { state, dispatch, startRun, isPlaying, isGameOver, isVictory, isShop } = usePokerGame()

const selectedCards = computed(() => {
  if (!state.value) return []
  return state.value.round.hand.filter((c) => c.selected)
})

const currentEval = computed(() => {
  if (selectedCards.value.length === 0) return null
  const result = evaluateHand(selectedCards.value)
  return HAND_TYPE_DISPLAY_NAMES[result.handType]
})

const bossEffect = computed(() => {
  if (!state.value || state.value.blind.blind !== 'boss' || !state.value.blind.bossBlindId) return undefined
  return getBossBlindDef(state.value.blind.bossBlindId)?.effect
})

const minPlayCards = computed(() => getMinPlayCards(bossEffect.value))

const playDisabled = computed(() => {
  return selectedCards.value.length === 0
    || selectedCards.value.length < minPlayCards.value
    || !state.value
    || state.value.round.handsLeft <= 0
})

function toggleCard(cardId: string) {
  if (!state.value) return
  const card = state.value.round.hand.find((c) => c.id === cardId)
  if (!card) return
  if (card.selected) {
    dispatch({ type: 'DESELECT_CARD', cardId })
  } else {
    dispatch({ type: 'SELECT_CARD', cardId })
  }
}

const selectedForTarot = computed(() => {
  if (!state.value) return null
  const sel = state.value.round.hand.filter((c) => c.selected)
  return sel.length === 1 ? sel[0] : null
})

const lastScore = ref<{ chips: number; mult: number; score: number } | null>(null)
const showScore = ref(false)

function playHand() {
  if (!state.value || playDisabled.value) return

  const selected = selectedCards.value
  const remaining = state.value.round.hand.filter((c) => !c.selected)
  const evalResult = evaluateHand(selected)
  const nonDebuffedScoring = filterDebuffedFromScoring(evalResult.scoringCards, bossEffect.value)
  const evalForScoring = { ...evalResult, scoringCards: nonDebuffedScoring }
  const jokerMod = resolveJokers(state.value.jokers, {
    handType: evalResult.handType,
    playedCards: selected,
    heldCards: remaining,
  })
  const enhancementMod = resolveEnhancements(evalForScoring.scoringCards, remaining)
  const breakdown = calculateScore(evalForScoring, state.value.handLevels, jokerMod, enhancementMod)

  lastScore.value = { chips: breakdown.totalChips, mult: breakdown.totalMult, score: breakdown.score }
  showScore.value = true

  dispatch({ type: 'PLAY_HAND' })

  setTimeout(() => { showScore.value = false }, 2000)
}
</script>

<template>
  <main class="min-h-screen px-6 py-10 text-neutral-200">
    <section class="mx-auto flex max-w-4xl flex-col gap-4">
      <RouterLink class="text-xs text-neutral-400 hover:text-neutral-200" to="/">back</RouterLink>
      <h1 class="text-lg text-neutral-100">poker</h1>

      <div class="flex flex-col gap-4 rounded-2xl bg-neutral-900 p-5">
        <template v-if="!state || (!isPlaying && !isGameOver && !isVictory && !isShop)">
          <button
            class="rounded-full bg-neutral-800 px-4 py-2 text-xs text-neutral-100"
            type="button"
            @click="startRun()"
          >
            new run
          </button>
        </template>

        <template v-else-if="isGameOver">
          <p class="text-sm text-neutral-400">game over</p>
          <p class="text-sm text-neutral-300">final score: {{ state!.round.score }}</p>
          <button
            class="rounded-full bg-neutral-800 px-4 py-2 text-xs text-neutral-100"
            type="button"
            @click="startRun()"
          >
            new run
          </button>
        </template>

        <template v-else-if="isVictory">
          <p class="text-sm text-neutral-400">you win</p>
          <button
            class="rounded-full bg-neutral-800 px-4 py-2 text-xs text-neutral-100"
            type="button"
            @click="startRun()"
          >
            new run
          </button>
        </template>

        <template v-else-if="isShop && state && state.shop">
          <div class="flex flex-col gap-1 text-xs text-neutral-400">
            <p>shop · ${{ state.money }}</p>
            <p>ante {{ state.blind.ante }} · next blind awaits</p>
          </div>

          <div v-if="state.jokers.length > 0" class="flex flex-col gap-2">
            <p class="text-xs text-neutral-400">jokers</p>
            <div class="flex flex-wrap gap-2">
              <JokerCard
                v-for="joker in state.jokers"
                :key="joker.id"
                :name="getJokerDef(joker.defId)?.name ?? joker.defId"
                :description="getJokerDef(joker.defId)?.description ?? ''"
                :show-sell="true"
                :sell-value="getJokerDef(joker.defId) ? jokerSellValue(getJokerDef(joker.defId)!) : 1"
                @sell="dispatch({ type: 'SELL_JOKER', jokerInstanceId: joker.id })"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <p class="text-xs text-neutral-400">for sale</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in state.shop.items"
                :key="item.id"
                class="rounded-xl bg-neutral-800 px-3 py-2 text-xs text-neutral-100"
                :class="state.money < item.cost ? 'opacity-40 cursor-not-allowed' : ''"
                :disabled="state.money < item.cost"
                type="button"
                @click="
                  item.kind === 'joker'
                    ? dispatch({ type: 'BUY_JOKER', shopItemId: item.id })
                    : dispatch({ type: 'OPEN_PACK', shopItemId: item.id })
                "
              >
                <template v-if="item.kind === 'joker'">
                  {{ getJokerDef(item.jokerDefId)?.name ?? item.jokerDefId }} · ${{ item.cost }}
                </template>
                <template v-else>
                  {{ item.packType }} pack · ${{ item.cost }}
                </template>
              </button>
            </div>
          </div>

          <div v-if="state.shop.pack" class="flex flex-col gap-2">
            <p class="text-xs text-neutral-400">choose one</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in state.shop.pack.options"
                :key="option.id"
                class="rounded-xl bg-neutral-800 px-3 py-2 text-xs text-neutral-100"
                :class="state.consumables.length >= 2 ? 'opacity-40 cursor-not-allowed' : ''"
                :disabled="state.consumables.length >= 2"
                type="button"
                @click="dispatch({ type: 'SELECT_PACK_ITEM', optionId: option.id })"
              >
                <template v-if="option.kind === 'planet'">
                  {{ getPlanetDef(option.defId)?.name ?? option.defId }}
                </template>
                <template v-else>
                  {{ getTarotDef(option.defId)?.name ?? option.defId }}
                </template>
              </button>
            </div>
          </div>

          <div v-if="state.consumables.length > 0" class="flex flex-col gap-2">
            <p class="text-xs text-neutral-400">consumables</p>
            <div class="flex flex-wrap gap-2">
              <template v-for="consumable in state.consumables" :key="consumable.id">
                <button
                  v-if="consumable.kind === 'planet'"
                  class="rounded-xl bg-neutral-800 px-3 py-2 text-xs text-neutral-100"
                  type="button"
                  @click="dispatch({ type: 'USE_PLANET', consumableId: consumable.id })"
                >
                  {{ getPlanetDef(consumable.defId)?.name ?? consumable.defId }} (use)
                </button>
                <button
                  v-else
                  class="rounded-xl bg-neutral-800 px-3 py-2 text-xs text-neutral-100"
                  :class="!selectedForTarot ? 'opacity-40 cursor-not-allowed' : ''"
                  :disabled="!selectedForTarot"
                  type="button"
                  @click="selectedForTarot && dispatch({ type: 'USE_TAROT', consumableId: consumable.id, targetCardId: selectedForTarot.id })"
                >
                  {{ getTarotDef(consumable.defId)?.name ?? consumable.defId }} (use on selected)
                </button>
              </template>
            </div>
          </div>

          <div v-if="state.consumables.some((c) => c.kind === 'tarot')" class="flex flex-col gap-2">
            <p class="text-xs text-neutral-400">select a card for tarot</p>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="card in state.round.hand"
                :key="card.id"
                @click="toggleCard(card.id)"
              >
                <CardSvg
                  :rank="card.base.rank"
                  :suit="card.base.suit"
                  :enhancement="card.modifier.enhancement"
                  :selected="card.selected"
                />
              </div>
            </div>
          </div>

          <details class="text-xs text-neutral-400">
            <summary class="cursor-pointer">hand levels</summary>
            <ul class="mt-1 list-none pl-0 text-neutral-500">
              <li v-for="(level, handType) in state.handLevels" :key="handType">
                {{ HAND_TYPE_DISPLAY_NAMES[handType] }} lv.{{ level }}
              </li>
            </ul>
          </details>

          <button
            class="rounded-full bg-neutral-800 px-4 py-2 text-xs text-neutral-100"
            type="button"
            @click="dispatch({ type: 'LEAVE_SHOP' })"
          >
            leave shop
          </button>
        </template>

        <template v-else-if="isPlaying && state">
          <div class="flex flex-col gap-1 text-xs text-neutral-400">
            <p>
              ante {{ state.blind.ante }} · {{ state.blind.blind }} blind · target:
              {{ state.blind.targetScore }} · ${{ state.money }}
            </p>
            <p>score: {{ state.round.score }} / {{ state.blind.targetScore }}</p>
            <p>hands left: {{ state.round.handsLeft }} · discards left: {{ state.round.discardsLeft }}</p>
            <p v-if="state.blind.blind === 'boss' && state.blind.bossBlindId">
              boss: {{ getBossBlindDef(state.blind.bossBlindId)?.name }} — {{ getBossBlindDef(state.blind.bossBlindId)?.description }}
            </p>
          </div>

          <div v-if="state.jokers.length > 0" class="flex flex-wrap gap-2">
            <JokerCard
              v-for="joker in state.jokers"
              :key="joker.id"
              :name="getJokerDef(joker.defId)?.name ?? joker.defId"
              :description="getJokerDef(joker.defId)?.description ?? ''"
            />
          </div>

          <div v-if="state.consumables.length > 0" class="flex flex-wrap gap-1">
            <template v-for="consumable in state.consumables" :key="consumable.id">
              <button
                v-if="consumable.kind === 'planet'"
                class="rounded-lg bg-neutral-800 px-2 py-1 text-xs text-neutral-300"
                type="button"
                @click="dispatch({ type: 'USE_PLANET', consumableId: consumable.id })"
              >
                {{ getPlanetDef(consumable.defId)?.name ?? consumable.defId }}
              </button>
              <span v-else class="rounded-lg bg-neutral-800 px-2 py-1 text-xs text-neutral-500">
                {{ getTarotDef(consumable.defId)?.name ?? consumable.defId }}
              </span>
            </template>
          </div>

          <div class="flex flex-wrap gap-2 items-end">
            <div v-for="card in state.round.hand" :key="card.id" @click="toggleCard(card.id)">
              <CardSvg
                :rank="card.base.rank"
                :suit="card.base.suit"
                :enhancement="card.modifier.enhancement"
                :selected="card.selected"
                :debuffed="isCardDebuffed(card, bossEffect)"
              />
            </div>
          </div>

          <p v-if="currentEval" class="text-xs text-neutral-300">{{ currentEval }}</p>

          <ScoreTicker
            v-if="lastScore"
            :chips="lastScore.chips"
            :mult="lastScore.mult"
            :score="lastScore.score"
            :visible="showScore"
          />

          <div class="flex gap-2">
            <button
              class="rounded-full bg-neutral-800 px-4 py-2 text-xs text-neutral-100"
              :class="playDisabled ? 'opacity-40 cursor-not-allowed' : ''"
              :disabled="playDisabled"
              type="button"
              @click="playHand()"
            >
              play hand
            </button>
            <button
              class="rounded-full bg-neutral-800 px-4 py-2 text-xs text-neutral-100"
              :class="
                selectedCards.length === 0 || state.round.discardsLeft <= 0
                  ? 'opacity-40 cursor-not-allowed'
                  : ''
              "
              :disabled="selectedCards.length === 0 || state.round.discardsLeft <= 0"
              type="button"
              @click="dispatch({ type: 'DISCARD' })"
            >
              discard
            </button>
          </div>
        </template>
      </div>
    </section>
  </main>
</template>
