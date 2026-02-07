import type { JokerInstance, JokerCondition, CardInstance, HandType } from '../types'
import { getJokerDef } from './defs'

export interface JokerScoreContext {
  handType: HandType
  playedCards: CardInstance[]
  heldCards: CardInstance[]
}

export function jokerConditionMet(condition: JokerCondition, ctx: JokerScoreContext): boolean {
  switch (condition.type) {
    case 'always':
      return true
    case 'hand_type_is':
      return ctx.handType === condition.handType
    case 'contains_suit':
      return ctx.playedCards.some((c) => c.base.suit === condition.suit)
    case 'contains_rank':
      return ctx.playedCards.some((c) => c.base.rank === condition.rank)
    case 'played_count_gte':
      return ctx.playedCards.length >= condition.count
    case 'played_count_lte':
      return ctx.playedCards.length <= condition.count
    default:
      return false
  }
}

export interface ScoreModifier {
  addChips: number
  addMult: number
  mulMult: number
}

export function resolveJokers(
  jokers: JokerInstance[],
  ctx: JokerScoreContext,
): ScoreModifier {
  let addChips = 0
  let addMult = 0
  let mulMult = 1

  for (const joker of jokers) {
    const def = getJokerDef(joker.defId)
    if (!def) continue
    if (def.trigger !== 'on_score') continue
    if (!jokerConditionMet(def.condition, ctx)) continue

    switch (def.effect.type) {
      case 'add_chips':
        addChips += def.effect.amount
        break
      case 'add_mult':
        addMult += def.effect.amount
        break
      case 'mul_mult':
        mulMult *= def.effect.factor
        break
      case 'add_money':
        break
    }
  }

  return { addChips, addMult, mulMult }
}
