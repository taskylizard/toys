import type { CardInstance, HandEval, HandType } from '../types'
import { RANK_VALUES } from '../constants'

export const HAND_RANK: Record<HandType, number> = {
  high_card: 1,
  pair: 2,
  two_pair: 3,
  three_of_a_kind: 4,
  straight: 5,
  flush: 6,
  full_house: 7,
  four_of_a_kind: 8,
  straight_flush: 9,
  five_of_a_kind: 10,
  flush_house: 11,
  flush_five: 12,
}

function combinations<T>(arr: T[], k: number): T[][] {
  const result: T[][] = []
  function backtrack(start: number, current: T[]) {
    if (current.length === k) {
      result.push([...current])
      return
    }
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]!)
      backtrack(i + 1, current)
      current.pop()
    }
  }
  backtrack(0, [])
  return result
}

function maxScoringRankValue(hand: HandEval): number {
  if (hand.scoringCards.length === 0) return 0
  return Math.max(...hand.scoringCards.map((c) => RANK_VALUES[c.base.rank]))
}

export function findBestHand(cards: CardInstance[]): HandEval {
  let best: HandEval = { handType: 'high_card', scoringCards: [] }

  const maxK = Math.min(cards.length, 5)
  for (let k = maxK; k >= 1; k--) {
    for (const combo of combinations(cards, k)) {
      const hand = evaluateHand(combo)
      const handRank = HAND_RANK[hand.handType]
      const bestRank = HAND_RANK[best.handType]
      if (
        handRank > bestRank ||
        (handRank === bestRank && maxScoringRankValue(hand) > maxScoringRankValue(best))
      ) {
        best = hand
      }
    }
  }

  return best
}

function getRankCounts(cards: CardInstance[]): Map<string, CardInstance[]> {
  const map = new Map<string, CardInstance[]>()
  for (const card of cards) {
    const rank = card.base.rank
    const existing = map.get(rank)
    if (existing) {
      existing.push(card)
    } else {
      map.set(rank, [card])
    }
  }
  return map
}

function getSuitCounts(cards: CardInstance[]): Map<string, CardInstance[]> {
  const map = new Map<string, CardInstance[]>()
  for (const card of cards) {
    const suit = card.base.suit
    const existing = map.get(suit)
    if (existing) {
      existing.push(card)
    } else {
      map.set(suit, [card])
    }
  }
  return map
}

function isFlush(cards: CardInstance[]): CardInstance[] | null {
  const suitCounts = getSuitCounts(cards)
  for (const [, suited] of suitCounts) {
    if (suited.length >= 5) return suited.slice(0, 5)
  }
  return null
}

function isStraight(cards: CardInstance[]): CardInstance[] | null {
  const uniqueByRank = new Map<number, CardInstance>()
  for (const card of cards) {
    const val = RANK_VALUES[card.base.rank]
    if (!uniqueByRank.has(val)) uniqueByRank.set(val, card)
  }

  const sorted = [...uniqueByRank.entries()].sort((a, b) => b[0] - a[0])

  for (let i = 0; i <= sorted.length - 5; i++) {
    const high = sorted[i]
    const low = sorted[i + 4]
    if (high && low && high[0] - low[0] === 4) {
      return sorted.slice(i, i + 5).map(([, c]) => c)
    }
  }

  if (
    uniqueByRank.has(14) &&
    uniqueByRank.has(2) &&
    uniqueByRank.has(3) &&
    uniqueByRank.has(4) &&
    uniqueByRank.has(5)
  ) {
    return [
      uniqueByRank.get(5)!,
      uniqueByRank.get(4)!,
      uniqueByRank.get(3)!,
      uniqueByRank.get(2)!,
      uniqueByRank.get(14)!,
    ]
  }

  return null
}

function isStraightFlush(cards: CardInstance[]): CardInstance[] | null {
  const suitCounts = getSuitCounts(cards)
  for (const [, suited] of suitCounts) {
    if (suited.length >= 5) {
      const result = isStraight(suited)
      if (result) return result
    }
  }
  return null
}

function byRankValueDesc(a: CardInstance, b: CardInstance): number {
  return RANK_VALUES[b.base.rank] - RANK_VALUES[a.base.rank]
}

export function evaluateHand(cards: CardInstance[]): HandEval {
  if (cards.length === 0) {
    return { handType: 'high_card', scoringCards: [] }
  }

  const rankCounts = getRankCounts(cards)
  const groups = [...rankCounts.values()].sort((a, b) => {
    if (b.length !== a.length) return b.length - a.length
    return RANK_VALUES[b[0]!.base.rank] - RANK_VALUES[a[0]!.base.rank]
  })

  const flushCards = isFlush(cards)
  const straightCards = isStraight(cards)
  const straightFlushCards = isStraightFlush(cards)

  const group0 = groups[0]
  const group1 = groups[1]

  if (cards.length === 5) {
    const allSameSuit = flushCards !== null
    const fiveOfKind = group0 && group0.length === 5

    if (fiveOfKind && allSameSuit) {
      return { handType: 'flush_five', scoringCards: group0 }
    }

    if (fiveOfKind) {
      return { handType: 'five_of_a_kind', scoringCards: group0 }
    }

    if (group0 && group1 && group0.length === 3 && group1.length === 2 && allSameSuit) {
      return { handType: 'flush_house', scoringCards: [...group0, ...group1] }
    }
  }

  if (straightFlushCards) {
    return { handType: 'straight_flush', scoringCards: straightFlushCards }
  }

  if (group0 && group0.length === 4) {
    return { handType: 'four_of_a_kind', scoringCards: group0 }
  }

  if (group0 && group1 && group0.length === 3 && group1.length === 2) {
    return { handType: 'full_house', scoringCards: [...group0, ...group1] }
  }

  if (flushCards) {
    return { handType: 'flush', scoringCards: flushCards }
  }

  if (straightCards) {
    return { handType: 'straight', scoringCards: straightCards }
  }

  if (group0 && group0.length === 3) {
    return { handType: 'three_of_a_kind', scoringCards: group0 }
  }

  if (group0 && group1 && group0.length === 2 && group1.length === 2) {
    return { handType: 'two_pair', scoringCards: [...group0, ...group1] }
  }

  if (group0 && group0.length === 2) {
    return { handType: 'pair', scoringCards: group0 }
  }

  const sorted = [...cards].sort(byRankValueDesc)
  return { handType: 'high_card', scoringCards: [sorted[0]!] }
}
