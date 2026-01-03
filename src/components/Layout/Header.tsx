import { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import SettingsModal from '../Settings/SettingsModal';
import styles from './Header.module.css';

export default function Header() {
  const [showSettings, setShowSettings] = useState(false);
  const { updateDisplaySettings, display } = useSettingsStore();

  return (
    <>
      <div className={styles.header}>
        <div>
          <span className={styles.title}>BLUEJACK</span>
          <span className={styles.subtitle}>Card Counting Trainer</span>
        </div>
        <div className={styles.buttons}>
          <button
            className={styles.button}
            onClick={() => updateDisplaySettings({ showCount: !display.showCount })}
          >
            Count <span className={styles.shortcut}>(C)</span>
          </button>
          <button
            className={styles.button}
            onClick={() => updateDisplaySettings({ showBasicStrategy: !display.showBasicStrategy })}
          >
            Strategy <span className={styles.shortcut}>(B)</span>
          </button>
          <button
            className={styles.button}
            onClick={() => updateDisplaySettings({ showHandHistory: !display.showHandHistory })}
          >
            History <span className={styles.shortcut}>(R)</span>
          </button>
          <button
            className={styles.button}
            onClick={() => updateDisplaySettings({ showStatistics: !display.showStatistics })}
          >
            Stats <span className={styles.shortcut}>(T)</span>
          </button>
          <button className={styles.button} onClick={() => setShowSettings(true)}>
            Settings
          </button>
        </div>
      </div>
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
