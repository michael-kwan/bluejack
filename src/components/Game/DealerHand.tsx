import { Hand } from '../../types/game.types';
import { getHandValue } from '../../engine/hand';
import Card from './Card';
import styles from './DealerHand.module.css';

interface DealerHandProps {
  hand: Hand;
  showValue?: boolean;
}

export default function DealerHand({ hand, showValue = true }: DealerHandProps) {
  const { value, isSoft, isBlackjack, isBust } = getHandValue(hand);

  const hasHiddenCard = hand.cards.some((card) => card.faceDown);

  const getValueDisplay = () => {
    if (hasHiddenCard) return '?';
    if (isBlackjack) return 'BLACKJACK!';
    if (isBust) return `BUST (${value})`;
    return isSoft ? `${value} (soft)` : value;
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>Dealer</div>
      <div className={styles.cards}>
        {hand.cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
      {showValue && (
        <div
          className={`${styles.value} ${isBlackjack ? styles.blackjack : ''} ${
            isBust ? styles.bust : ''
          }`}
        >
          {getValueDisplay()}
        </div>
      )}
    </div>
  );
}
