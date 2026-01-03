import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Stats, HandResult } from '../types/stats.types';

interface StatsStore extends Stats {
  recordHandResult: (result: HandResult) => void;
  recordHandHistory: (entry: Omit<import('../types/stats.types').HandHistoryEntry, 'id' | 'timestamp'>) => void;
  recordCountCheck: (userCount: number, actualCount: number) => void;
  resetSession: () => void;
  resetAllStats: () => void;
}

const defaultStats: Stats = {
  session: {
    handsPlayed: 0,
    handsWon: 0,
    handsLost: 0,
    handsPushed: 0,
    blackjacks: 0,
    totalWagered: 0,
    totalWinnings: 0,
    currentBankroll: 100,
    sessionStartTime: Date.now(),
    sessionDuration: 0,
  },
  counting: {
    countChecks: 0,
    countErrors: 0,
    accuracy: 0,
    runningCountHistory: [],
    trueCountHistory: [],
  },
  handHistory: [],
};

export const useStatsStore = create<StatsStore>()(
  persist(
    (set) => ({
      ...defaultStats,

      recordHandResult: (result) =>
        set((state) => {
          const newSession = { ...state.session };
          newSession.handsPlayed++;
          newSession.totalWagered += result.bet;

          // Update bankroll: subtract bet, add payout
          newSession.currentBankroll -= result.bet;
          newSession.currentBankroll += result.payout;

          if (result.result === 'win') {
            newSession.handsWon++;
            newSession.totalWinnings += result.payout;
          } else if (result.result === 'lose') {
            newSession.handsLost++;
          } else if (result.result === 'push') {
            newSession.handsPushed++;
            newSession.totalWinnings += result.payout;
          } else if (result.result === 'blackjack') {
            newSession.blackjacks++;
            newSession.handsWon++;
            newSession.totalWinnings += result.payout;
          }

          newSession.sessionDuration = Date.now() - state.session.sessionStartTime;

          const newCounting = { ...state.counting };
          newCounting.runningCountHistory.push(result.runningCount);
          newCounting.trueCountHistory.push(result.trueCount);

          return {
            session: newSession,
            counting: newCounting,
          };
        }),

      recordHandHistory: (entry) =>
        set((state) => {
          const newEntry = {
            ...entry,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          };

          // Keep only last 10 hands in history
          const newHistory = [newEntry, ...state.handHistory].slice(0, 10);

          return {
            handHistory: newHistory,
          };
        }),

      recordCountCheck: (userCount, actualCount) =>
        set((state) => {
          const newCounting = { ...state.counting };
          newCounting.countChecks++;

          if (userCount !== actualCount) {
            newCounting.countErrors++;
          }

          newCounting.accuracy =
            newCounting.countChecks > 0
              ? ((newCounting.countChecks - newCounting.countErrors) / newCounting.countChecks) *
                100
              : 0;

          return { counting: newCounting };
        }),

      resetSession: () =>
        set(() => ({
          session: {
            ...defaultStats.session,
            sessionStartTime: Date.now(),
          },
          counting: defaultStats.counting,
        })),

      resetAllStats: () => set(defaultStats),
    }),
    {
      name: 'bluejack-stats',
    }
  )
);
