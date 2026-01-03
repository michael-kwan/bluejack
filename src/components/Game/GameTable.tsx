import { useGameStore } from '../../store/gameStore';
import DealerHand from './DealerHand';
import PlayerHand from './PlayerHand';
import ActionButtons from './ActionButtons';
import BettingControls from './BettingControls';
import CountDisplay from '../Trainer/CountDisplay';
import Statistics from '../Trainer/Statistics';
import BasicStrategyChart from '../Trainer/BasicStrategyChart';
import HandHistory from '../Trainer/HandHistory';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import styles from './GameTable.module.css';

export default function GameTable() {
  const { dealerHand, playerHands, phase } = useGameStore();
  useKeyboardShortcuts();

  const getPhaseLabel = () => {
    const labels = {
      betting: 'Place Your Bet',
      dealing: 'Dealing...',
      insurance: 'Insurance?',
      'player-turn': 'Your Turn',
      'dealer-turn': 'Dealer Playing...',
      payout: 'Round Complete',
      shuffle: 'Shuffling...',
    };
    return labels[phase];
  };

  return (
    <div className={styles.table}>
      <div className={styles.phaseIndicator}>{getPhaseLabel()}</div>

      <CountDisplay />
      <Statistics />
      <BasicStrategyChart />
      <HandHistory />

      {phase === 'shuffle' && (
        <div className={styles.shuffleMessage}>
          Shuffling Deck...
          <br />
          <span style={{ fontSize: '24px' }}>♠ ♣ ♥ ♦</span>
        </div>
      )}

      <div className={styles.dealerArea}>
        {dealerHand.cards.length > 0 && <DealerHand hand={dealerHand} />}
      </div>

      <div className={styles.playerArea}>
        {playerHands.length > 0 && (
          <div className={styles.playerHands}>
            {playerHands.map((hand) => (
              <PlayerHand key={hand.id} hand={hand} />
            ))}
          </div>
        )}

        {phase === 'player-turn' && (
          <div className={styles.actions}>
            <ActionButtons />
          </div>
        )}

        {phase === 'betting' && (
          <div className={styles.betting}>
            <BettingControls />
          </div>
        )}
      </div>
    </div>
  );
}
