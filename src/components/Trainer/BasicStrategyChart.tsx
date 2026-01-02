import { useSettingsStore } from '../../store/settingsStore';
import styles from './BasicStrategyChart.module.css';

export default function BasicStrategyChart() {
  const { display, updateDisplaySettings } = useSettingsStore();

  if (!display.showBasicStrategy) return null;

  const handleClose = () => {
    updateDisplaySettings({ showBasicStrategy: false });
  };

  const dealerCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

  // Hard totals strategy (simplified basic strategy)
  const hardTotals = [
    { player: '17+', actions: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] },
    { player: '16', actions: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
    { player: '15', actions: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
    { player: '13-14', actions: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
    { player: '12', actions: ['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
    { player: '11', actions: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H'] },
    { player: '10', actions: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'] },
    { player: '9', actions: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
    { player: '5-8', actions: ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'] },
  ];

  // Soft totals strategy
  const softTotals = [
    { player: 'A,9', actions: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] },
    { player: 'A,8', actions: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] },
    { player: 'A,7', actions: ['S', 'D', 'D', 'D', 'D', 'S', 'S', 'H', 'H', 'H'] },
    { player: 'A,6', actions: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
    { player: 'A,4-5', actions: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
    { player: 'A,2-3', actions: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
  ];

  // Pairs strategy
  const pairs = [
    { player: 'A,A', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'] },
    { player: '10,10', actions: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] },
    { player: '9,9', actions: ['P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S'] },
    { player: '8,8', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'] },
    { player: '7,7', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'] },
    { player: '6,6', actions: ['P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H', 'H'] },
    { player: '5,5', actions: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'] },
    { player: '4,4', actions: ['H', 'H', 'H', 'P', 'P', 'H', 'H', 'H', 'H', 'H'] },
    { player: '2,2-3,3', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'] },
  ];

  const getCellClass = (action: string) => {
    if (action === 'H') return styles.hit;
    if (action === 'S') return styles.stand;
    if (action === 'D') return styles.double;
    if (action === 'P') return styles.split;
    return '';
  };

  return (
    <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Basic Strategy</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.hit}`} />
            <span>H = Hit</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.stand}`} />
            <span>S = Stand</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.double}`} />
            <span>D = Double</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendColor} ${styles.split}`} />
            <span>P = Split</span>
          </div>
        </div>

        <div className={styles.sectionTitle}>Hard Totals</div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Player</th>
              {dealerCards.map((card) => (
                <th key={card}>{card}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hardTotals.map((row) => (
              <tr key={row.player}>
                <th>{row.player}</th>
                {row.actions.map((action, i) => (
                  <td key={i} className={`${styles.cell} ${getCellClass(action)}`}>
                    {action}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.sectionTitle}>Soft Totals</div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Player</th>
              {dealerCards.map((card) => (
                <th key={card}>{card}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {softTotals.map((row) => (
              <tr key={row.player}>
                <th>{row.player}</th>
                {row.actions.map((action, i) => (
                  <td key={i} className={`${styles.cell} ${getCellClass(action)}`}>
                    {action}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.sectionTitle}>Pairs</div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Player</th>
              {dealerCards.map((card) => (
                <th key={card}>{card}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pairs.map((row) => (
              <tr key={row.player}>
                <th>{row.player}</th>
                {row.actions.map((action, i) => (
                  <td key={i} className={`${styles.cell} ${getCellClass(action)}`}>
                    {action}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}
