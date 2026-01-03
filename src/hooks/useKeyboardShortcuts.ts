import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';

export function useKeyboardShortcuts() {
  const { phase, hit, stand, double, split, dealCards, placeBet } = useGameStore();
  const { display, updateDisplaySettings } = useSettingsStore();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      // Prevent shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Game actions
      if (phase === 'player-turn') {
        switch (key) {
          case 'h':
            hit();
            break;
          case 's':
            stand();
            break;
          case 'd':
            double();
            break;
          case 'p':
            split();
            break;
        }
      }

      // Bet amounts (during betting phase)
      if (phase === 'betting') {
        switch (key) {
          case '1':
            placeBet(10);
            break;
          case '2':
            placeBet(25);
            break;
          case '5':
            placeBet(50);
            break;
          case '0':
            placeBet(100);
            break;
        }
      }

      // Deal cards
      if (phase === 'betting' && (key === ' ' || key === 'enter')) {
        event.preventDefault();
        dealCards();
      }

      // Toggle displays
      switch (key) {
        case 'c':
          updateDisplaySettings({ showCount: !display.showCount });
          break;
        case 'b':
          updateDisplaySettings({ showBasicStrategy: !display.showBasicStrategy });
          break;
        case 'r':
          updateDisplaySettings({ showHandHistory: !display.showHandHistory });
          break;
        case 't':
          updateDisplaySettings({ showStatistics: !display.showStatistics });
          break;
        case '?':
          // TODO: Show keyboard help modal
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [phase, hit, stand, double, split, dealCards, placeBet, display, updateDisplaySettings]);
}
