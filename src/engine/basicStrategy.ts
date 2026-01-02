import { Hand } from '../types/game.types';
import { Card, Rank } from '../types/card.types';
import { getHandValue, canSplit } from './hand';

export type Action = 'H' | 'S' | 'D' | 'Ds' | 'P' | 'Ph' | 'Rh';

// Action meanings:
// H = Hit
// S = Stand
// D = Double if possible, otherwise hit
// Ds = Double if possible, otherwise stand
// P = Split
// Ph = Split if double after split allowed, otherwise hit
// Rh = Surrender if possible, otherwise hit (not implemented yet)

export function getBasicStrategyAction(playerHand: Hand, dealerUpCard: Card): Action {
  const { value, isSoft } = getHandValue(playerHand);
  const dealerValue = getDealerCardValue(dealerUpCard);
  const isPair = canSplit(playerHand);

  // Pairs
  if (isPair) {
    const pairRank = playerHand.cards[0].rank;
    return getPairStrategy(pairRank, dealerValue);
  }

  // Soft totals (with Ace counted as 11)
  if (isSoft) {
    return getSoftHandStrategy(value, dealerValue);
  }

  // Hard totals
  return getHardHandStrategy(value, dealerValue);
}

function getDealerCardValue(card: Card): number {
  if (card.rank === 'A') return 11;
  if (['J', 'Q', 'K'].includes(card.rank)) return 10;
  return parseInt(card.rank);
}

function getPairStrategy(rank: Rank, dealerValue: number): Action {
  // Always split Aces and 8s
  if (rank === 'A' || rank === '8') return 'P';

  // Never split 5s and 10s
  if (rank === '5' || rank === '10' || rank === 'J' || rank === 'Q' || rank === 'K') {
    return rank === '5' ? getHardHandStrategy(10, dealerValue) : 'S';
  }

  // Pair of 2s, 3s, 7s
  if (rank === '2' || rank === '3' || rank === '7') {
    if (dealerValue >= 2 && dealerValue <= 7) return 'P';
    return 'H';
  }

  // Pair of 4s
  if (rank === '4') {
    if (dealerValue === 5 || dealerValue === 6) return 'P';
    return 'H';
  }

  // Pair of 6s
  if (rank === '6') {
    if (dealerValue >= 2 && dealerValue <= 6) return 'P';
    return 'H';
  }

  // Pair of 9s
  if (rank === '9') {
    if (dealerValue === 7 || dealerValue === 10 || dealerValue === 11) return 'S';
    if (dealerValue >= 2 && dealerValue <= 9) return 'P';
    return 'S';
  }

  return 'H';
}

function getSoftHandStrategy(value: number, dealerValue: number): Action {
  // Soft 19-21: Always stand
  if (value >= 19) return 'S';

  // Soft 18 (A,7)
  if (value === 18) {
    if (dealerValue >= 2 && dealerValue <= 6) return 'Ds';
    if (dealerValue === 7 || dealerValue === 8) return 'S';
    return 'H'; // Dealer 9, 10, A
  }

  // Soft 17 (A,6)
  if (value === 17) {
    if (dealerValue >= 3 && dealerValue <= 6) return 'D';
    return 'H';
  }

  // Soft 15-16 (A,4 or A,5)
  if (value === 15 || value === 16) {
    if (dealerValue >= 4 && dealerValue <= 6) return 'D';
    return 'H';
  }

  // Soft 13-14 (A,2 or A,3)
  if (value === 13 || value === 14) {
    if (dealerValue === 5 || dealerValue === 6) return 'D';
    return 'H';
  }

  return 'H';
}

function getHardHandStrategy(value: number, dealerValue: number): Action {
  // 17 or higher: Always stand
  if (value >= 17) return 'S';

  // 13-16: Stand vs dealer 2-6, otherwise hit
  if (value >= 13 && value <= 16) {
    if (dealerValue >= 2 && dealerValue <= 6) return 'S';
    return 'H';
  }

  // 12: Stand vs dealer 4-6, otherwise hit
  if (value === 12) {
    if (dealerValue >= 4 && dealerValue <= 6) return 'S';
    return 'H';
  }

  // 11: Always double
  if (value === 11) return 'D';

  // 10: Double vs dealer 2-9
  if (value === 10) {
    if (dealerValue >= 2 && dealerValue <= 9) return 'D';
    return 'H';
  }

  // 9: Double vs dealer 3-6
  if (value === 9) {
    if (dealerValue >= 3 && dealerValue <= 6) return 'D';
    return 'H';
  }

  // 8 or less: Always hit
  return 'H';
}

export function getActionLabel(action: Action): string {
  const labels: Record<Action, string> = {
    H: 'Hit',
    S: 'Stand',
    D: 'Double',
    Ds: 'Double/Stand',
    P: 'Split',
    Ph: 'Split/Hit',
    Rh: 'Surrender/Hit',
  };
  return labels[action];
}

export function getActionColor(action: Action): string {
  // Green = Stand
  if (action === 'S' || action === 'Ds') return '#00cc00';
  // Red = Hit
  if (action === 'H' || action === 'Ph' || action === 'Rh') return '#cc0000';
  // Yellow = Double
  if (action === 'D') return '#ffd700';
  // Blue = Split
  if (action === 'P') return '#0066cc';
  return '#999999';
}
