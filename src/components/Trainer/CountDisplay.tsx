import { useGameStore } from '../../store/gameStore';
import { useSettingsStore } from '../../store/settingsStore';
import styles from './CountDisplay.module.css';

export default function CountDisplay() {
  const { shoe } = useGameStore();
  const { display } = useSettingsStore();

  if (!display.showCount) return null;

  const runningCount = shoe.getRunningCount();
  const trueCount = shoe.getTrueCount();
  const decksRemaining = shoe.getDecksRemaining().toFixed(1);

  const getCountClass = (count: number) => {
    if (count > 0) return styles.positive;
    if (count < 0) return styles.negative;
    return '';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Card Count</div>
      <div className={styles.counts}>
        <div className={styles.countRow}>
          <span className={styles.label}>Running:</span>
          <span className={`${styles.value} ${getCountClass(runningCount)}`}>
            {runningCount > 0 ? '+' : ''}
            {runningCount}
          </span>
        </div>
        {display.showTrueCount && (
          <div className={styles.countRow}>
            <span className={styles.label}>True:</span>
            <span className={`${styles.value} ${getCountClass(trueCount)}`}>
              {trueCount > 0 ? '+' : ''}
              {trueCount}
            </span>
          </div>
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.decksRemaining}>
          <span>Decks remaining:</span>
          <span>{decksRemaining}</span>
        </div>
      </div>
    </div>
  );
}
