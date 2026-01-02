import { Card as CardType } from '../../types/card.types';
import { getSuitSymbol, getSuitColor } from '../../engine/card';
import styles from './Card.module.css';

interface CardProps {
  card: CardType;
}

export default function Card({ card }: CardProps) {
  if (card.faceDown) {
    return <div className={`${styles.card} ${styles.faceDown}`} />;
  }

  const suitSymbol = getSuitSymbol(card.suit);
  const color = getSuitColor(card.suit);

  return (
    <div className={styles.card}>
      <div className={`${styles.rank} ${styles[color]}`}>{card.rank}</div>
      <div className={`${styles.suit} ${styles[color]}`}>{suitSymbol}</div>
      <div className={`${styles.miniRank} ${styles[color]}`}>{card.rank}</div>
    </div>
  );
}
