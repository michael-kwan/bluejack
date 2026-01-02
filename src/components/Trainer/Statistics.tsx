import { useStatsStore } from '../../store/statsStore';
import styles from './Statistics.module.css';

export default function Statistics() {
  const { session, resetSession } = useStatsStore();

  const winRate =
    session.handsPlayed > 0
      ? ((session.handsWon / session.handsPlayed) * 100).toFixed(1)
      : '0.0';

  const netWinnings = session.totalWinnings - session.totalWagered;
  const roi =
    session.totalWagered > 0
      ? ((netWinnings / session.totalWagered) * 100).toFixed(1)
      : '0.0';

  return (
    <div className={styles.container}>
      <div className={styles.header}>Session Stats</div>
      <div className={styles.stats}>
        <div className={styles.statRow}>
          <span className={styles.label}>Hands Played:</span>
          <span className={styles.value}>{session.handsPlayed}</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.label}>Wins:</span>
          <span className={`${styles.value} ${styles.positive}`}>{session.handsWon}</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.label}>Losses:</span>
          <span className={`${styles.value} ${styles.negative}`}>{session.handsLost}</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.label}>Pushes:</span>
          <span className={styles.value}>{session.handsPushed}</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.label}>Blackjacks:</span>
          <span className={`${styles.value} ${styles.positive}`}>{session.blackjacks}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.statRow}>
          <span className={styles.label}>Win Rate:</span>
          <span className={`${styles.value} ${styles.winRate}`}>{winRate}%</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.label}>Net:</span>
          <span
            className={`${styles.value} ${netWinnings >= 0 ? styles.positive : styles.negative}`}
          >
            ${netWinnings >= 0 ? '+' : ''}
            {netWinnings}
          </span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.label}>ROI:</span>
          <span className={`${styles.value} ${Number(roi) >= 0 ? styles.positive : styles.negative}`}>
            {roi}%
          </span>
        </div>
      </div>
      <button className={styles.resetButton} onClick={resetSession}>
        Reset Session
      </button>
    </div>
  );
}
