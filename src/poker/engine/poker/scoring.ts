import type { HandEval, HandType, ScoreBreakdown } from '../types'
import type { ScoreModifier } from '../jokers/resolve'
import type { EnhancementScoreModifier } from '../cards/enhancements'
import { BASE_HAND_SCORES, RANK_CHIP_VALUES } from '../constants'

export function calculateScore(
  evalResult: HandEval,
  handLevels: Record<HandType, number>,
  jokerModifier?: ScoreModifier,
  enhancementModifier?: EnhancementScoreModifier,
): ScoreBreakdown {
  const base = BASE_HAND_SCORES[evalResult.handType]
  const level = handLevels[evalResult.handType]

  const baseChips = base.chips * level
  const baseMult = base.mult * level

  const cardChips = evalResult.scoringCards.reduce(
    (sum, card) => sum + (card.modifier.enhancement === 'stone' ? 0 : RANK_CHIP_VALUES[card.base.rank]),
    0,
  )

  let totalChips = baseChips + cardChips
  let totalMult = baseMult

  if (enhancementModifier) {
    totalChips += enhancementModifier.addChips
    totalMult += enhancementModifier.addMult
  }

  if (jokerModifier) {
    totalChips += jokerModifier.addChips
    totalMult += jokerModifier.addMult
  }

  let mulMult = 1
  if (enhancementModifier) {
    mulMult *= enhancementModifier.mulMult
  }
  if (jokerModifier) {
    mulMult *= jokerModifier.mulMult
  }
  totalMult = Math.round(totalMult * mulMult)

  return {
    handType: evalResult.handType,
    baseChips,
    baseMult,
    totalChips,
    totalMult,
    score: totalChips * totalMult,
  }
}
