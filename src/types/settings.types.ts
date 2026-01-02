export interface GameSettings {
  deckCount: 2 | 6 | 8;
  payoutRatio: '6:5' | '3:2';
  dealerHitsSoft17: boolean;
  maxHands: number;
  minBet: number;
  maxBet: number;
}

export interface DisplaySettings {
  showBasicStrategy: boolean;
  showCount: boolean;
  showTrueCount: boolean;
  soundEnabled: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  dealDelay: number; // milliseconds between card deals
}

export interface Settings {
  game: GameSettings;
  display: DisplaySettings;
}
