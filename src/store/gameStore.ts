import { create } from 'zustand';
import { GamePhase, Hand } from '../types/game.types';
import { Shoe } from '../engine/deck';
import {
  performHit,
  performStand,
  performDoubleDown,
  performSplit,
  resolveDealerHand,
  resolveHandResults,
} from '../engine/actions';
import { getHandValue, createHand } from '../engine/hand';
import { useSettingsStore } from './settingsStore';
import { useStatsStore } from './statsStore';

interface GameStore {
  shoe: Shoe;
  dealtCards: import('../types/card.types').Card[];
  cutCardPosition: number;
  dealerHand: Hand;
  playerHands: Hand[];
  currentHandIndex: number;
  phase: GamePhase;
  roundNumber: number;
  insuranceBet?: number;
  currentBet: number;

  // Actions
  placeBet: (bet: number) => void;
  dealCards: () => void;
  hit: () => void;
  stand: () => void;
  double: () => void;
  split: () => void;
  insurance: () => void;
  resolveDealerTurn: () => void;
  newGame: () => void;
  resetShoe: () => void;
}

const createInitialState = () => {
  const { game } = useSettingsStore.getState();
  const shoe = new Shoe(game.deckCount);

  return {
    shoe,
    dealtCards: [],
    cutCardPosition: shoe.cutCardPosition,
    dealerHand: {
      id: crypto.randomUUID(),
      cards: [],
      bet: 0,
      isActive: false,
      isSettled: false,
    },
    playerHands: [],
    currentHandIndex: 0,
    phase: 'betting' as const,
    roundNumber: 0,
    currentBet: game.minBet,
  };
};

export const useGameStore = create<GameStore>()((set, get) => ({
  ...createInitialState(),

  placeBet: (bet) => set({ currentBet: bet }),

  dealCards: async () => {
    const state = get();
    const settings = useSettingsStore.getState();
    const delay = settings.display.dealDelay;

    if (state.phase !== 'betting') return;

    // Check if shoe needs reshuffle
    if (state.shoe.needsReshuffle()) {
      state.shoe.reset();
      set({ phase: 'shuffle', dealtCards: [] });
      setTimeout(() => {
        get().dealCards();
      }, 1000);
      return;
    }

    // Initialize empty hands
    const playerHand = createHand(state.currentBet);
    const dealerHand = createHand(0);

    set({
      playerHands: [playerHand],
      dealerHand,
      currentHandIndex: 0,
      phase: 'dealing',
      roundNumber: state.roundNumber + 1,
    });

    // Helper to deal a card with delay
    const dealCardWithDelay = (delayMs: number) =>
      new Promise(resolve => setTimeout(resolve, delayMs));

    // Deal cards one at a time: player, dealer, player, dealer (face down)
    // First card to player
    await dealCardWithDelay(delay);
    playerHand.cards.push(state.shoe.deal());
    set({
      playerHands: [{ ...playerHand }],
      dealtCards: state.shoe.dealtCards,
    });

    // First card to dealer (face up)
    await dealCardWithDelay(delay);
    dealerHand.cards.push(state.shoe.deal());
    set({
      dealerHand: { ...dealerHand },
      dealtCards: state.shoe.dealtCards,
    });

    // Second card to player
    await dealCardWithDelay(delay);
    playerHand.cards.push(state.shoe.deal());
    set({
      playerHands: [{ ...playerHand }],
      dealtCards: state.shoe.dealtCards,
    });

    // Second card to dealer (face down)
    await dealCardWithDelay(delay);
    const faceDownCard = state.shoe.deal();
    faceDownCard.faceDown = true;
    dealerHand.cards.push(faceDownCard);
    set({
      dealerHand: { ...dealerHand },
      dealtCards: state.shoe.dealtCards,
    });

    // Mark player hand as active
    playerHand.isActive = true;
    set({
      playerHands: [{ ...playerHand }],
      phase: 'player-turn',
    });

    // Check for player blackjack
    const playerValue = getHandValue(playerHand);
    const dealerValue = getHandValue(dealerHand);

    if (playerValue.isBlackjack || dealerValue.isBlackjack) {
      setTimeout(() => {
        get().stand(); // Auto-resolve
      }, 500);
    }
  },

  hit: () => {
    const state = get();
    if (state.phase !== 'player-turn') return;

    const currentHand = state.playerHands[state.currentHandIndex];
    if (!currentHand || !currentHand.isActive) return;

    const newHand = performHit(currentHand, state.shoe);
    const updatedHands = [...state.playerHands];
    updatedHands[state.currentHandIndex] = newHand;

    set({
      playerHands: updatedHands,
      dealtCards: state.shoe.dealtCards,
    });

    // Check for bust
    const { isBust } = getHandValue(newHand);
    if (isBust) {
      setTimeout(() => {
        get().stand();
      }, 500);
    }
  },

  stand: () => {
    const state = get();
    if (state.phase !== 'player-turn') return;

    const currentHand = state.playerHands[state.currentHandIndex];
    if (!currentHand) return;

    const newHand = performStand(currentHand);
    const updatedHands = [...state.playerHands];
    updatedHands[state.currentHandIndex] = newHand;

    // Move to next hand or dealer turn
    const nextHandIndex = state.currentHandIndex + 1;
    if (nextHandIndex < state.playerHands.length) {
      updatedHands[nextHandIndex].isActive = true;
      set({
        playerHands: updatedHands,
        currentHandIndex: nextHandIndex,
      });
    } else {
      // All player hands done, dealer's turn
      set({
        playerHands: updatedHands,
        phase: 'dealer-turn',
      });

      setTimeout(() => {
        get().resolveDealerTurn();
      }, 500);
    }
  },

  double: () => {
    const state = get();
    if (state.phase !== 'player-turn') return;

    const currentHand = state.playerHands[state.currentHandIndex];
    if (!currentHand || currentHand.cards.length !== 2) return;

    const newHand = performDoubleDown(currentHand, state.shoe);
    const updatedHands = [...state.playerHands];
    updatedHands[state.currentHandIndex] = newHand;

    set({
      playerHands: updatedHands,
      dealtCards: state.shoe.dealtCards,
    });

    // Automatically stand after double
    setTimeout(() => {
      get().stand();
    }, 500);
  },

  split: () => {
    const state = get();
    if (state.phase !== 'player-turn') return;

    const currentHand = state.playerHands[state.currentHandIndex];
    if (!currentHand || currentHand.cards.length !== 2) return;
    if (currentHand.cards[0].rank !== currentHand.cards[1].rank) return;

    const [hand1, hand2] = performSplit(currentHand, state.shoe);
    const updatedHands = [...state.playerHands];
    updatedHands[state.currentHandIndex] = hand1;
    updatedHands.splice(state.currentHandIndex + 1, 0, hand2);

    set({
      playerHands: updatedHands,
      dealtCards: state.shoe.dealtCards,
    });
  },

  insurance: () => {
    const state = get();
    if (state.phase !== 'insurance') return;

    set({
      insuranceBet: state.currentBet / 2,
      phase: 'player-turn',
    });
  },

  resolveDealerTurn: () => {
    const state = get();
    const settings = useSettingsStore.getState();
    const stats = useStatsStore.getState();

    // Dealer plays
    const finalDealerHand = resolveDealerHand(
      state.dealerHand,
      state.shoe,
      settings.game.dealerHitsSoft17
    );

    // Resolve all player hands
    const resolvedHands = state.playerHands.map((hand) =>
      resolveHandResults(hand, finalDealerHand, settings.game.payoutRatio)
    );

    set({
      dealerHand: finalDealerHand,
      playerHands: resolvedHands,
      phase: 'payout',
      dealtCards: state.shoe.dealtCards,
    });

    // Record stats
    const dealerValue = getHandValue(finalDealerHand);
    resolvedHands.forEach((hand) => {
      const playerValue = getHandValue(hand);
      stats.recordHandResult({
        playerValue: playerValue.value,
        dealerValue: dealerValue.value,
        result: hand.result!,
        bet: hand.bet,
        payout: hand.payout || 0,
        runningCount: state.shoe.getRunningCount(),
        trueCount: state.shoe.getTrueCount(),
      });
    });

    // Auto-start new round after delay
    setTimeout(() => {
      set({ phase: 'betting' });
    }, 3000);
  },

  newGame: () => {
    const initialState = createInitialState();
    set(initialState);
  },

  resetShoe: () => {
    const state = get();
    state.shoe.reset();
    set({
      dealtCards: [],
      cutCardPosition: state.shoe.cutCardPosition,
    });
  },
}));
