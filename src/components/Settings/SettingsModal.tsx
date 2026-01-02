import { useSettingsStore } from '../../store/settingsStore';
import { useGameStore } from '../../store/gameStore';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { game, display, updateGameSettings, updateDisplaySettings, resetSettings } =
    useSettingsStore();
  const { newGame } = useGameStore();

  if (!isOpen) return null;

  const handleNewGame = () => {
    newGame();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Settings</h2>
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Game Rules</div>

          <div className={styles.setting}>
            <span className={styles.settingLabel}>Number of Decks</span>
            <select
              className={styles.select}
              value={game.deckCount}
              onChange={(e) =>
                updateGameSettings({ deckCount: parseInt(e.target.value) as 2 | 6 | 8 })
              }
            >
              <option value={2}>2 Decks</option>
              <option value={6}>6 Decks</option>
              <option value={8}>8 Decks</option>
            </select>
          </div>

          <div className={styles.setting}>
            <span className={styles.settingLabel}>Blackjack Payout</span>
            <select
              className={styles.select}
              value={game.payoutRatio}
              onChange={(e) => updateGameSettings({ payoutRatio: e.target.value as '6:5' | '3:2' })}
            >
              <option value="3:2">3:2 (Standard)</option>
              <option value="6:5">6:5 (Bad)</option>
            </select>
          </div>

          <div className={styles.setting}>
            <span className={styles.settingLabel}>Dealer Hits Soft 17</span>
            <div
              className={`${styles.toggle} ${game.dealerHitsSoft17 ? styles.active : ''}`}
              onClick={() => updateGameSettings({ dealerHitsSoft17: !game.dealerHitsSoft17 })}
            >
              <div className={styles.toggleSlider} />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Display</div>

          <div className={styles.setting}>
            <span className={styles.settingLabel}>Show Running Count</span>
            <div
              className={`${styles.toggle} ${display.showCount ? styles.active : ''}`}
              onClick={() => updateDisplaySettings({ showCount: !display.showCount })}
            >
              <div className={styles.toggleSlider} />
            </div>
          </div>

          <div className={styles.setting}>
            <span className={styles.settingLabel}>Show True Count</span>
            <div
              className={`${styles.toggle} ${display.showTrueCount ? styles.active : ''}`}
              onClick={() => updateDisplaySettings({ showTrueCount: !display.showTrueCount })}
            >
              <div className={styles.toggleSlider} />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={`${styles.button} ${styles.resetButton}`} onClick={resetSettings}>
            Reset Settings
          </button>
          <button className={`${styles.button} ${styles.newGameButton}`} onClick={handleNewGame}>
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
