export type GameAction =
  | { type: 'START_RUN'; seed: string }
  | { type: 'SELECT_CARD'; cardId: string }
  | { type: 'DESELECT_CARD'; cardId: string }
  | { type: 'PLAY_HAND' }
  | { type: 'DISCARD' }
  | { type: 'NEXT_BLIND' }
  | { type: 'LEAVE_SHOP' }
  | { type: 'BUY_JOKER'; shopItemId: string }
  | { type: 'SELL_JOKER'; jokerInstanceId: string }
  | { type: 'OPEN_PACK'; shopItemId: string }
  | { type: 'SELECT_PACK_ITEM'; optionId: string }
  | { type: 'USE_PLANET'; consumableId: string }
  | { type: 'USE_TAROT'; consumableId: string; targetCardId: string }
