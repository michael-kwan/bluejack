import { Hand } from '../../types/game.types';
import { getHandValue } from '../../engine/hand';
import Card from './Card';
import styles from './PlayerHand.module.css';

interface PlayerHandProps {
  hand: Hand;
}

export default function PlayerHand({ hand }: PlayerHandProps) {
  const { value, isSoft, isBlackjack, isBust } = getHandValue(hand);

  const getValueDisplay = () => {
    if (isBlackjack) return 'BLACKJACK!';
    if (isBust) return `BUST (${value})`;
    return isSoft ? `${value} (soft)` : value;
  };

  const getResultDisplay = () => {
    if (!hand.result) return null;

    const labels = {
      win: `WIN +$${hand.payout}`,
      lose: 'LOSE',
      push: 'PUSH',
      blackjack: `BLACKJACK! +$${hand.payout}`,
    };

    return (
      <div className={`${styles.result} ${styles[hand.result]}`}>
        {labels[hand.result]}
      </div>
    );
  };

  return (
    <div className={`${styles.handContainer} ${hand.isActive ? styles.active : ''}`}>
      <div className={styles.cards}>
        {hand.cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
      <div className={styles.info}>
        <div
          className={`${styles.value} ${isBlackjack ? styles.blackjack : ''} ${
            isBust ? styles.bust : ''
          }`}
        >
          {getValueDisplay()}
        </div>
        <div className={styles.bet}>Bet: ${hand.bet}</div>
        {getResultDisplay()}
      </div>
    </div>
  );
}
