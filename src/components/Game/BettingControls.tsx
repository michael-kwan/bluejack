import { useGameStore } from '../../store/gameStore';
import styles from './BettingControls.module.css';

export default function BettingControls() {
  const { currentBet, phase, placeBet, dealCards } = useGameStore();

  const isBetting = phase === 'betting';

  const setBet = (amount: number) => {
    placeBet(amount);
  };

  return (
    <div className={styles.container}>
      <div className={styles.betAmount}>${currentBet}</div>
      <div className={styles.controls}>
        <button
          className={`${styles.chipButton} ${styles.chip10}`}
          onClick={() => setBet(10)}
          disabled={!isBetting}
        >
          $10 <span className={styles.shortcut}>(1)</span>
        </button>
        <button
          className={`${styles.chipButton} ${styles.chip25}`}
          onClick={() => setBet(25)}
          disabled={!isBetting}
        >
          $25 <span className={styles.shortcut}>(2)</span>
        </button>
        <button
          className={`${styles.chipButton} ${styles.chip50}`}
          onClick={() => setBet(50)}
          disabled={!isBetting}
        >
          $50 <span className={styles.shortcut}>(5)</span>
        </button>
        <button
          className={`${styles.chipButton} ${styles.chip100}`}
          onClick={() => setBet(100)}
          disabled={!isBetting}
        >
          $100 <span className={styles.shortcut}>(0)</span>
        </button>
      </div>
      <button className={styles.dealButton} onClick={dealCards} disabled={!isBetting}>
        Deal <span className={styles.shortcut}>(Space)</span>
      </button>
    </div>
  );
}
