import { Card } from './card.types';

export interface Hand {
  id: string;
  cards: Card[];
  bet: number;
  isActive: boolean;
  isSettled: boolean;
  isDoubled?: boolean;
  isSplit?: boolean;
  result?: 'win' | 'lose' | 'push' | 'blackjack';
  payout?: number;
}

export type GamePhase =
  | 'betting'
  | 'dealing'
  | 'insurance'
  | 'player-turn'
  | 'dealer-turn'
  | 'payout'
  | 'shuffle';

export interface GameState {
  shoe: Card[];
  dealtCards: Card[];
  cutCardPosition: number;
  dealerHand: Hand;
  playerHands: Hand[];
  currentHandIndex: number;
  phase: GamePhase;
  roundNumber: number;
  insuranceBet?: number;
}

export interface HandValue {
  value: number;
  isSoft: boolean;
  isBlackjack: boolean;
  isBust: boolean;
}
