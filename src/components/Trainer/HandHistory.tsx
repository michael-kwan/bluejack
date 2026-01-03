import { useStatsStore } from '../../store/statsStore';
import { getSuitSymbol, getSuitColor } from '../../engine/card';
import styles from './HandHistory.module.css';

export default function HandHistory() {
  const { handHistory } = useStatsStore();

  // Show last 3 hands
  const recentHands = handHistory.slice(0, 3);

  if (recentHands.length === 0) return null;

  const getResultLabel = (result: string) => {
    const labels = {
      win: 'WIN',
      lose: 'LOSE',
      push: 'PUSH',
      blackjack: 'BJ!',
    };
    return labels[result as keyof typeof labels] || result;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Recent Hands</div>
      </div>

      {recentHands.map((hand) => (
        <div key={hand.id} className={styles.handEntry}>
          <div className={styles.handInfo}>
            <span className={`${styles.result} ${styles[hand.result]}`}>
              {getResultLabel(hand.result)}
            </span>
            <span className={styles.bet}>
              ${hand.bet} → {hand.payout > 0 ? `$${hand.payout}` : '$0'}
            </span>
          </div>

          <div className={styles.cards}>
            <div className={styles.cardRow}>
              <span className={styles.label}>Player:</span>
              <div className={styles.cardList}>
                {hand.playerCards.map((card, idx) => (
                  <span
                    key={idx}
                    className={`${styles.miniCard} ${styles[getSuitColor(card.suit)]}`}
                  >
                    {card.rank}
                    {getSuitSymbol(card.suit)}
                  </span>
                ))}
              </div>
              <span className={styles.value}>({hand.playerValue})</span>
            </div>

            <div className={styles.cardRow}>
              <span className={styles.label}>Dealer:</span>
              <div className={styles.cardList}>
                {hand.dealerCards.map((card, idx) => (
                  <span
                    key={idx}
                    className={`${styles.miniCard} ${styles[getSuitColor(card.suit)]}`}
                  >
                    {card.rank}
                    {getSuitSymbol(card.suit)}
                  </span>
                ))}
              </div>
              <span className={styles.value}>({hand.dealerValue})</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
