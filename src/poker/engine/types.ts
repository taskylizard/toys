export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface CardBase {
  suit: Suit
  rank: Rank
}

export type Enhancement = 'none' | 'foil' | 'holo' | 'polychrome' | 'glass' | 'steel' | 'stone'

export interface Modifier {
  enhancement: Enhancement
}

export interface CardInstance {
  id: string
  base: CardBase
  modifier: Modifier
  selected: boolean
}

export type HandType =
  | 'high_card'
  | 'pair'
  | 'two_pair'
  | 'three_of_a_kind'
  | 'straight'
  | 'flush'
  | 'full_house'
  | 'four_of_a_kind'
  | 'straight_flush'
  | 'five_of_a_kind'
  | 'flush_five'
  | 'flush_house'

export interface HandEval {
  handType: HandType
  scoringCards: CardInstance[]
}

export interface ScoreBreakdown {
  handType: HandType
  baseChips: number
  baseMult: number
  totalChips: number
  totalMult: number
  score: number
}

export type GamePhase = 'menu' | 'blind_select' | 'playing' | 'shop' | 'game_over' | 'victory'

export interface BlindState {
  ante: number
  blind: 'small' | 'big' | 'boss'
  targetScore: number
  bossBlindId?: string
}

export interface RoundState {
  deck: CardInstance[]
  hand: CardInstance[]
  discardPile: CardInstance[]
  handsLeft: number
  discardsLeft: number
  score: number
}

export type JokerTrigger = 'on_score' | 'on_play' | 'on_discard' | 'on_held' | 'independent'

export type JokerCondition =
  | { type: 'hand_type_is'; handType: HandType }
  | { type: 'contains_suit'; suit: Suit }
  | { type: 'contains_rank'; rank: Rank }
  | { type: 'played_count_gte'; count: number }
  | { type: 'played_count_lte'; count: number }
  | { type: 'always' }

export type JokerEffect =
  | { type: 'add_chips'; amount: number }
  | { type: 'add_mult'; amount: number }
  | { type: 'mul_mult'; factor: number }
  | { type: 'add_money'; amount: number }

export interface JokerDef {
  id: string
  name: string
  description: string
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
  cost: number
  trigger: JokerTrigger
  condition: JokerCondition
  effect: JokerEffect
}

export interface JokerInstance {
  id: string
  defId: string
}

export type PackType = 'celestial' | 'arcana'

export type ShopItem =
  | { id: string; kind: 'joker'; jokerDefId: string; cost: number }
  | { id: string; kind: 'pack'; packType: PackType; cost: number }

export type PackOption =
  | { id: string; kind: 'planet'; defId: string }
  | { id: string; kind: 'tarot'; defId: string }

export interface PackOpenState {
  packType: PackType
  options: PackOption[]
}

export interface ShopState {
  items: ShopItem[]
  pack?: PackOpenState
}

export type ConsumableInstance =
  | { id: string; kind: 'planet'; defId: string }
  | { id: string; kind: 'tarot'; defId: string }

export interface RunState {
  phase: GamePhase
  seed: string
  ante: number
  round: RoundState
  blind: BlindState
  money: number
  handLevels: Record<HandType, number>
  jokers: JokerInstance[]
  shop?: ShopState
  consumables: ConsumableInstance[]
}
