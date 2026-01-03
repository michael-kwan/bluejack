export interface SessionStats {
  handsPlayed: number;
  handsWon: number;
  handsLost: number;
  handsPushed: number;
  blackjacks: number;
  totalWagered: number;
  totalWinnings: number;
  sessionStartTime: number;
  sessionDuration: number;
}

export interface CountingStats {
  countChecks: number;
  countErrors: number;
  accuracy: number;
  runningCountHistory: number[];
  trueCountHistory: number[];
}

export interface HandResult {
  playerValue: number;
  dealerValue: number;
  result: 'win' | 'lose' | 'push' | 'blackjack';
  bet: number;
  payout: number;
  runningCount: number;
  trueCount: number;
}

export interface HandHistoryEntry {
  id: string;
  playerCards: import('./card.types').Card[];
  dealerCards: import('./card.types').Card[];
  playerValue: number;
  dealerValue: number;
  result: 'win' | 'lose' | 'push' | 'blackjack';
  bet: number;
  payout: number;
  timestamp: number;
}

export interface Stats {
  session: SessionStats;
  counting: CountingStats;
  handHistory: HandHistoryEntry[];
}
