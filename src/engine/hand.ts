import { Hand, HandValue } from '../types/game.types';
import { getCardValue } from './card';

export function getHandValue(hand: Hand): HandValue {
  let value = 0;
  let aces = 0;

  // Calculate initial value
  for (const card of hand.cards) {
    if (card.faceDown) continue; // Skip face-down cards

    const cardValue = getCardValue(card.rank);
    value += cardValue;
    if (card.rank === 'A') aces++;
  }

  // Adjust for aces (convert from 11 to 1 if needed)
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  const isSoft = aces > 0 && value <= 21;
  const isBlackjack = hand.cards.length === 2 && value === 21 && !hand.isSplit;
  const isBust = value > 21;

  return {
    value,
    isSoft,
    isBlackjack,
    isBust,
  };
}

export function canSplit(hand: Hand): boolean {
  if (hand.cards.length !== 2) return false;
  return hand.cards[0].rank === hand.cards[1].rank;
}

export function canDoubleDown(hand: Hand): boolean {
  return hand.cards.length === 2 && !hand.isDoubled;
}

export function canHit(hand: Hand): boolean {
  const { isBust, value } = getHandValue(hand);
  return !isBust && value < 21 && !hand.isDoubled;
}

export function createHand(bet: number, cards: Hand['cards'] = []): Hand {
  return {
    id: crypto.randomUUID(),
    cards,
    bet,
    isActive: true,
    isSettled: false,
  };
}

export function getDealerUpCard(dealerHand: Hand) {
  // First card is face up, second is face down
  return dealerHand.cards[0];
}

export function hasDealerAce(dealerHand: Hand): boolean {
  const upCard = getDealerUpCard(dealerHand);
  return upCard.rank === 'A';
}
