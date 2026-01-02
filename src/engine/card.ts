import { Card, Rank, Suit } from '../types/card.types';

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function getCardValue(rank: Rank): number {
  if (rank === 'A') return 11;
  if (['J', 'Q', 'K'].includes(rank)) return 10;
  return parseInt(rank);
}

export function getHiLoValue(card: Card): number {
  const rank = card.rank;
  // 2-6: +1
  if (['2', '3', '4', '5', '6'].includes(rank)) return 1;
  // 7-9: 0
  if (['7', '8', '9'].includes(rank)) return 0;
  // 10-A: -1
  return -1;
}

export function getSuitSymbol(suit: Suit): string {
  const symbols: Record<Suit, string> = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
  };
  return symbols[suit];
}

export function getSuitColor(suit: Suit): 'red' | 'black' {
  return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
}

export function createCard(suit: Suit, rank: Rank, faceDown = false): Card {
  return { suit, rank, faceDown };
}
