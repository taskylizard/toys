import type { RunState, CardInstance, ConsumableInstance } from '../types'
import type { GameAction } from './actions'
import { createRng, shuffleArray } from '../rng'
import { shuffleDeck, drawCards } from '../cards/deck'
import { evaluateHand } from '../poker/evaluateHand'
import { calculateScore } from '../poker/scoring'
import { resolveJokers } from '../jokers/resolve'
import { getJokerDef } from '../jokers/defs'
import { getPlanetDef } from '../planets/defs'
import { applyPlanet } from '../planets/resolve'
import { generateCelestialPackOptions } from '../planets/packs'
import { getTarotDef } from '../tarot/defs'
import { applyTarot } from '../tarot/resolve'
import { generateArcanaPackOptions } from '../tarot/packs'
import { resolveEnhancements, resolveGlassBreaks } from '../cards/enhancements'
import { getBlindTarget, HANDS_PER_ROUND, DISCARDS_PER_ROUND, HAND_SIZE, MAX_ANTE } from './rules'
import { calculateBlindReward, generateShopItems, jokerSellValue, MAX_JOKER_SLOTS, MAX_CONSUMABLE_SLOTS } from './shop'
import { initRun } from './initRun'
import { BOSS_BLIND_DEFS, getBossBlindDef } from '../blinds/defs'
import type { BossEffect } from '../blinds/defs'
import { getEffectiveHandSize, getEffectiveDiscards, getMinPlayCards, filterDebuffedFromScoring } from '../blinds/resolve'

function deselectAll(cards: CardInstance[]): CardInstance[] {
  return cards.map((c) => (c.selected ? { ...c, selected: false } : c))
}

function getCurrentBossEffect(state: RunState): BossEffect | undefined {
  if (state.blind.blind !== 'boss' || !state.blind.bossBlindId) return undefined
  const def = getBossBlindDef(state.blind.bossBlindId)
  return def?.effect
}

function advanceBlind(state: RunState): RunState {
  const { ante, blind } = state.blind

  let nextAnte = ante
  let nextBlind: 'small' | 'big' | 'boss' = blind

  if (blind === 'small') {
    nextBlind = 'big'
  } else if (blind === 'big') {
    nextBlind = 'boss'
  } else {
    nextAnte = ante + 1
    nextBlind = 'small'
  }

  if (nextAnte > MAX_ANTE) {
    return { ...state, phase: 'victory' }
  }

  const targetScore = getBlindTarget(nextAnte, nextBlind)

  let bossBlindId: string | undefined
  if (nextBlind === 'boss') {
    const bossRng = createRng(state.seed + '-boss-' + nextAnte)
    const shuffledBosses = shuffleArray([...BOSS_BLIND_DEFS], bossRng)
    bossBlindId = shuffledBosses[0]!.id
  }

  const bossEffect = bossBlindId ? getBossBlindDef(bossBlindId)?.effect : undefined
  const effectiveHandSize = getEffectiveHandSize(HAND_SIZE, bossEffect)
  const effectiveDiscards = getEffectiveDiscards(DISCARDS_PER_ROUND, bossEffect)

  const allCards = [...state.round.deck, ...state.round.hand, ...state.round.discardPile]
  const rng = createRng(state.seed + '-' + nextAnte + '-' + nextBlind)
  const shuffled = shuffleDeck(deselectAll(allCards), rng)
  const { drawn: hand, remaining } = drawCards(shuffled, effectiveHandSize)

  return {
    ...state,
    phase: 'playing',
    ante: nextAnte,
    blind: {
      ante: nextAnte,
      blind: nextBlind,
      targetScore,
      bossBlindId,
    },
    round: {
      deck: remaining,
      hand,
      discardPile: [],
      handsLeft: HANDS_PER_ROUND,
      discardsLeft: effectiveDiscards,
      score: 0,
    },
  }
}

export function gameReducer(state: RunState, action: GameAction): RunState {
  switch (action.type) {
    case 'START_RUN':
      return initRun(action.seed)

    case 'SELECT_CARD': {
      const selectedCount = state.round.hand.filter((c) => c.selected).length
      if (selectedCount >= 5) return state

      const hand = state.round.hand.map((c) =>
        c.id === action.cardId && !c.selected ? { ...c, selected: true } : c,
      )
      return { ...state, round: { ...state.round, hand } }
    }

    case 'DESELECT_CARD': {
      const hand = state.round.hand.map((c) =>
        c.id === action.cardId && c.selected ? { ...c, selected: false } : c,
      )
      return { ...state, round: { ...state.round, hand } }
    }

    case 'PLAY_HAND': {
      const selected = state.round.hand.filter((c) => c.selected)
      if (selected.length === 0 || selected.length > 5 || state.round.handsLeft <= 0) {
        return state
      }

      const bossEffect = getCurrentBossEffect(state)
      const minCards = getMinPlayCards(bossEffect)
      if (selected.length < minCards) return state

      const remaining = state.round.hand.filter((c) => !c.selected)
      const evalResult = evaluateHand(selected)
      const nonDebuffedScoring = filterDebuffedFromScoring(evalResult.scoringCards, bossEffect)
      const evalForScoring = { ...evalResult, scoringCards: nonDebuffedScoring }

      const jokerMod = resolveJokers(state.jokers, {
        handType: evalResult.handType,
        playedCards: selected,
        heldCards: remaining,
      })

      const enhancementMod = resolveEnhancements(evalForScoring.scoringCards, remaining)
      const scoreBreakdown = calculateScore(evalForScoring, state.handLevels, jokerMod, enhancementMod)

      const glassRng = createRng(`${state.seed}-glass-${state.ante}-${state.round.handsLeft}`)
      const brokenIds = resolveGlassBreaks(evalForScoring.scoringCards, glassRng)
      const brokenSet = new Set(brokenIds)

      const playedToDiscard = selected
        .filter((c) => !brokenSet.has(c.id))
        .map((c) => ({ ...c, selected: false }))
      const newDiscard = [...state.round.discardPile, ...playedToDiscard]

      const newScore = state.round.score + scoreBreakdown.score
      const handsLeft = state.round.handsLeft - 1

      if (newScore >= state.blind.targetScore) {
        const reward = calculateBlindReward(state.blind.blind, state.money)
        const newMoney = state.money + reward
        const shop = generateShopItems(state.seed, state.blind.ante, state.blind.blind)

        return {
          ...state,
          phase: 'shop',
          money: newMoney,
          round: { ...state.round, hand: remaining, discardPile: newDiscard, handsLeft, score: newScore },
          shop,
        }
      }

      if (handsLeft <= 0) {
        return {
          ...state,
          phase: 'game_over',
          round: {
            ...state.round,
            hand: remaining,
            discardPile: newDiscard,
            handsLeft,
            score: newScore,
          },
        }
      }

      const effectiveHandSize = getEffectiveHandSize(HAND_SIZE, bossEffect)
      const needed = effectiveHandSize - remaining.length
      const { drawn, remaining: deckAfterDraw } = drawCards(state.round.deck, needed)

      return {
        ...state,
        round: {
          ...state.round,
          deck: deckAfterDraw,
          hand: [...deselectAll(remaining), ...drawn],
          discardPile: newDiscard,
          handsLeft,
          score: newScore,
        },
      }
    }

    case 'DISCARD': {
      const selected = state.round.hand.filter((c) => c.selected)
      if (selected.length === 0 || state.round.discardsLeft <= 0) {
        return state
      }

      const remaining = state.round.hand.filter((c) => !c.selected)
      const discarded = selected.map((c) => ({ ...c, selected: false }))
      const newDiscard = [...state.round.discardPile, ...discarded]

      const bossEffect = getCurrentBossEffect(state)
      const effectiveHandSize = getEffectiveHandSize(HAND_SIZE, bossEffect)
      const needed = effectiveHandSize - remaining.length
      const { drawn, remaining: deckAfterDraw } = drawCards(state.round.deck, needed)

      return {
        ...state,
        round: {
          ...state.round,
          deck: deckAfterDraw,
          hand: [...deselectAll(remaining), ...drawn],
          discardPile: newDiscard,
          discardsLeft: state.round.discardsLeft - 1,
        },
      }
    }

    case 'NEXT_BLIND':
      return state

    case 'LEAVE_SHOP': {
      if (state.phase !== 'shop') return state
      const advanced = advanceBlind(state)
      return { ...advanced, shop: undefined }
    }

    case 'BUY_JOKER': {
      if (state.phase !== 'shop' || !state.shop) return state
      if (state.jokers.length >= MAX_JOKER_SLOTS) return state

      const itemIndex = state.shop.items.findIndex(
        (item) => item.id === action.shopItemId && item.kind === 'joker',
      )
      if (itemIndex === -1) return state

      const item = state.shop.items[itemIndex]!
      if (item.kind !== 'joker') return state
      if (state.money < item.cost) return state

      const jokerInstance = {
        id: `joker-${item.jokerDefId}-${state.jokers.length}`,
        defId: item.jokerDefId,
      }

      const remainingItems = state.shop.items.filter((_, i) => i !== itemIndex)

      return {
        ...state,
        money: state.money - item.cost,
        jokers: [...state.jokers, jokerInstance],
        shop: { ...state.shop, items: remainingItems },
      }
    }

    case 'SELL_JOKER': {
      const jokerIndex = state.jokers.findIndex((j) => j.id === action.jokerInstanceId)
      if (jokerIndex === -1) return state

      const joker = state.jokers[jokerIndex]!
      const def = getJokerDef(joker.defId)
      if (!def) return state

      const sellPrice = jokerSellValue(def)
      const remainingJokers = state.jokers.filter((_, i) => i !== jokerIndex)

      return {
        ...state,
        money: state.money + sellPrice,
        jokers: remainingJokers,
      }
    }

    case 'OPEN_PACK': {
      if (state.phase !== 'shop' || !state.shop) return state
      if (state.shop.pack) return state

      const itemIndex = state.shop.items.findIndex(
        (item) => item.id === action.shopItemId && item.kind === 'pack',
      )
      if (itemIndex === -1) return state

      const item = state.shop.items[itemIndex]!
      if (item.kind !== 'pack') return state
      if (state.money < item.cost) return state

      const rng = createRng(`${state.seed}-pack-${item.id}`)
      const options =
        item.packType === 'celestial'
          ? generateCelestialPackOptions(rng, item.id)
          : generateArcanaPackOptions(rng, item.id)

      const remainingItems = state.shop.items.filter((_, i) => i !== itemIndex)

      return {
        ...state,
        money: state.money - item.cost,
        shop: {
          ...state.shop,
          items: remainingItems,
          pack: {
            packType: item.packType,
            options,
          },
        },
      }
    }

    case 'SELECT_PACK_ITEM': {
      if (state.phase !== 'shop' || !state.shop?.pack) return state
      if (state.consumables.length >= MAX_CONSUMABLE_SLOTS) return state

      const option = state.shop.pack.options.find((o) => o.id === action.optionId)
      if (!option) return state

      const consumable: ConsumableInstance = option.kind === 'planet'
        ? { id: option.id, kind: 'planet', defId: option.defId }
        : { id: option.id, kind: 'tarot', defId: option.defId }

      return {
        ...state,
        consumables: [...state.consumables, consumable],
        shop: {
          ...state.shop,
          pack: undefined,
        },
      }
    }

    case 'USE_PLANET': {
      const consumable = state.consumables.find(
        (c) => c.id === action.consumableId && c.kind === 'planet',
      )
      if (!consumable || consumable.kind !== 'planet') return state

      const planetDef = getPlanetDef(consumable.defId)
      if (!planetDef) return state

      const newHandLevels = applyPlanet(state.handLevels, planetDef)
      const remainingConsumables = state.consumables.filter((c) => c.id !== action.consumableId)

      return {
        ...state,
        handLevels: newHandLevels,
        consumables: remainingConsumables,
      }
    }

    case 'USE_TAROT': {
      if (state.phase !== 'shop') return state

      const consumable = state.consumables.find(
        (c) => c.id === action.consumableId && c.kind === 'tarot',
      )
      if (!consumable || consumable.kind !== 'tarot') return state

      const tarotDef = getTarotDef(consumable.defId)
      if (!tarotDef) return state

      const result = applyTarot(
        tarotDef.effect,
        action.targetCardId,
        state.round.hand,
        state.round.deck,
        state.round.discardPile,
        `${state.seed}-tarot-${consumable.id}`,
      )

      const remainingConsumables = state.consumables.filter((c) => c.id !== action.consumableId)

      return {
        ...state,
        consumables: remainingConsumables,
        round: {
          ...state.round,
          hand: result.hand,
          deck: result.deck,
          discardPile: result.discardPile,
        },
      }
    }

    default:
      return state
  }
}
