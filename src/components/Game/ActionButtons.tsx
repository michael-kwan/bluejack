import { useGameStore } from '../../store/gameStore';
import { useSettingsStore } from '../../store/settingsStore';
import { canDoubleDown, canSplit, canHit } from '../../engine/hand';
import { getBasicStrategyAction } from '../../engine/basicStrategy';
import styles from './ActionButtons.module.css';

export default function ActionButtons() {
  const { playerHands, currentHandIndex, dealerHand, phase, hit, stand, double, split } = useGameStore();
  const { display } = useSettingsStore();

  const currentHand = playerHands[currentHandIndex];
  const isPlayerTurn = phase === 'player-turn';
  const canAct = isPlayerTurn && currentHand?.isActive;

  const canDouble = canAct && canDoubleDown(currentHand);
  const canSplitHand = canAct && canSplit(currentHand);
  const canHitHand = canAct && canHit(currentHand);

  // Get recommended action from basic strategy
  let recommendedAction = '';
  if (canAct && dealerHand.cards[0]) {
    recommendedAction = getBasicStrategyAction(currentHand, dealerHand.cards[0]);
  }

  const isRecommended = (action: string) => {
    if (!display.showBasicStrategy) return false;
    return recommendedAction === action ||
           (recommendedAction === 'Dh' && action === 'D') ||
           (recommendedAction === 'Ds' && action === 'D');
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${styles.hit} ${isRecommended('H') ? styles.recommended : ''}`}
        onClick={hit}
        disabled={!canHitHand}
      >
        Hit <span className={styles.shortcut}>(H)</span>
      </button>
      <button
        className={`${styles.button} ${styles.stand} ${isRecommended('S') ? styles.recommended : ''}`}
        onClick={stand}
        disabled={!canAct}
      >
        Stand <span className={styles.shortcut}>(S)</span>
      </button>
      <button
        className={`${styles.button} ${styles.double} ${isRecommended('D') || isRecommended('Dh') || isRecommended('Ds') ? styles.recommended : ''}`}
        onClick={double}
        disabled={!canDouble}
      >
        Double <span className={styles.shortcut}>(D)</span>
      </button>
      <button
        className={`${styles.button} ${styles.split} ${isRecommended('P') ? styles.recommended : ''}`}
        onClick={split}
        disabled={!canSplitHand}
      >
        Split <span className={styles.shortcut}>(P)</span>
      </button>
    </div>
  );
}
