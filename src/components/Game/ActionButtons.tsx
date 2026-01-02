import { useGameStore } from '../../store/gameStore';
import { canDoubleDown, canSplit, canHit } from '../../engine/hand';
import styles from './ActionButtons.module.css';

export default function ActionButtons() {
  const { playerHands, currentHandIndex, phase, hit, stand, double, split } = useGameStore();

  const currentHand = playerHands[currentHandIndex];
  const isPlayerTurn = phase === 'player-turn';
  const canAct = isPlayerTurn && currentHand?.isActive;

  const canDouble = canAct && canDoubleDown(currentHand);
  const canSplitHand = canAct && canSplit(currentHand);
  const canHitHand = canAct && canHit(currentHand);

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${styles.hit}`}
        onClick={hit}
        disabled={!canHitHand}
      >
        Hit <span className={styles.shortcut}>(H)</span>
      </button>
      <button
        className={`${styles.button} ${styles.stand}`}
        onClick={stand}
        disabled={!canAct}
      >
        Stand <span className={styles.shortcut}>(S)</span>
      </button>
      <button
        className={`${styles.button} ${styles.double}`}
        onClick={double}
        disabled={!canDouble}
      >
        Double <span className={styles.shortcut}>(D)</span>
      </button>
      <button
        className={`${styles.button} ${styles.split}`}
        onClick={split}
        disabled={!canSplitHand}
      >
        Split <span className={styles.shortcut}>(P)</span>
      </button>
    </div>
  );
}
