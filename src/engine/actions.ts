import { Hand } from '../types/game.types';
import { Shoe } from './deck';
import { getHandValue, createHand } from './hand';

export function performHit(hand: Hand, shoe: Shoe): Hand {
  return {
    ...hand,
    cards: [...hand.cards, shoe.deal()],
  };
}

export function performStand(hand: Hand): Hand {
  return {
    ...hand,
    isActive: false,
  };
}

export function performDoubleDown(hand: Hand, shoe: Shoe): Hand {
  const newHand = performHit(hand, shoe);
  return {
    ...newHand,
    bet: hand.bet * 2,
    isDoubled: true,
    isActive: false,
  };
}

export function performSplit(hand: Hand, shoe: Shoe): [Hand, Hand] {
  const hand1: Hand = createHand(hand.bet, [hand.cards[0], shoe.deal()]);
  hand1.isSplit = true;

  const hand2: Hand = createHand(hand.bet, [hand.cards[1], shoe.deal()]);
  hand2.isSplit = true;
  hand2.isActive = false; // Will be activated after hand1 is done

  return [hand1, hand2];
}

export function resolveDealerHand(dealerHand: Hand, shoe: Shoe, hitsSoft17: boolean): Hand {
  let hand = { ...dealerHand };

  // Flip face-down card
  hand.cards = hand.cards.map((card) => ({ ...card, faceDown: false }));

  // Dealer plays
  while (shouldDealerHit(hand, hitsSoft17)) {
    hand = performHit(hand, shoe);
  }

  return hand;
}

function shouldDealerHit(hand: Hand, hitsSoft17: boolean): boolean {
  const { value, isSoft, isBust } = getHandValue(hand);

  if (isBust) return false;
  if (value < 17) return true;
  if (value === 17 && isSoft && hitsSoft17) return true;

  return false;
}

export function resolveHandResults(
  playerHand: Hand,
  dealerHand: Hand,
  payoutRatio: '6:5' | '3:2'
): Hand {
  const playerValue = getHandValue(playerHand);
  const dealerValue = getHandValue(dealerHand);

  let result: Hand['result'];
  let payout = 0;

  // Player bust
  if (playerValue.isBust) {
    result = 'lose';
    payout = 0;
  }
  // Dealer bust
  else if (dealerValue.isBust) {
    result = 'win';
    payout = playerHand.bet * 2;
  }
  // Player blackjack
  else if (playerValue.isBlackjack) {
    if (dealerValue.isBlackjack) {
      result = 'push';
      payout = playerHand.bet;
    } else {
      result = 'blackjack';
      const multiplier = payoutRatio === '3:2' ? 2.5 : 2.2;
      payout = playerHand.bet * multiplier;
    }
  }
  // Dealer blackjack
  else if (dealerValue.isBlackjack) {
    result = 'lose';
    payout = 0;
  }
  // Compare values
  else if (playerValue.value > dealerValue.value) {
    result = 'win';
    payout = playerHand.bet * 2;
  } else if (playerValue.value < dealerValue.value) {
    result = 'lose';
    payout = 0;
  } else {
    result = 'push';
    payout = playerHand.bet;
  }

  return {
    ...playerHand,
    result,
    payout,
    isSettled: true,
  };
}

export function dealInitialCards(shoe: Shoe, numHands: number, bet: number): {
  playerHands: Hand[];
  dealerHand: Hand;
} {
  const playerHands: Hand[] = [];

  // Create player hands
  for (let i = 0; i < numHands; i++) {
    const hand = createHand(bet);
    playerHands.push(hand);
  }

  // Create dealer hand
  const dealerHand = createHand(0);

  // Deal two cards to each player hand and dealer
  for (let i = 0; i < 2; i++) {
    for (const hand of playerHands) {
      hand.cards.push(shoe.deal());
    }
    const card = shoe.deal();
    // Second dealer card is face down
    if (i === 1) {
      card.faceDown = true;
    }
    dealerHand.cards.push(card);
  }

  // Only the first hand is active
  playerHands.forEach((hand, index) => {
    hand.isActive = index === 0;
  });

  return { playerHands, dealerHand };
}
