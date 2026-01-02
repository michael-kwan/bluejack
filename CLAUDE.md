# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BlueJack is a blackjack card counting trainer built with React, TypeScript, and Vite. It's a pure client-side application with no backend, using localStorage for persistence.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Architecture

### State Management (Zustand)

Three separate stores with localStorage persistence:

- **gameStore.ts**: Game state, shoe management, player/dealer hands, game actions
- **settingsStore.ts**: Game rules configuration (deck count, payouts, dealer rules)
- **statsStore.ts**: Session statistics and card counting accuracy tracking

### Game Engine (Pure TypeScript)

Located in `src/engine/`, contains game logic as pure functions:

- **deck.ts**: `Shoe` class - manages multi-deck shoe, shuffling, cut card, Hi-Lo counting
- **hand.ts**: Hand evaluation (soft/hard totals, blackjack detection, action eligibility)
- **card.ts**: Card utilities, value calculations, Hi-Lo count values
- **actions.ts**: Game actions (hit, stand, double, split, dealer resolution)
- **basicStrategy.ts**: Optimal strategy lookup tables for all situations

### Component Structure

```
components/
├── Game/           # Core blackjack game UI
│   ├── GameTable   # Main game container
│   ├── Card        # Individual card rendering
│   ├── DealerHand  # Dealer cards display
│   ├── PlayerHand  # Player hand with value/bet display
│   ├── ActionButtons      # Hit/Stand/Double/Split buttons
│   └── BettingControls   # Bet selection and Deal button
├── Trainer/        # Card counting features
│   ├── CountDisplay       # Running/true count overlay
│   ├── BasicStrategyChart # Strategy matrix modal
│   └── Statistics         # Session stats panel
├── Settings/       # Configuration
│   └── SettingsModal     # Game rules and display settings
└── Layout/
    └── Header      # App title and navigation
```

## Game Flow State Machine

The game progresses through these phases (stored in `gameStore.phase`):

1. **betting**: Player selects bet amount
2. **dealing**: Cards are being dealt (animation state)
3. **insurance**: Dealer shows Ace, offer insurance
4. **player-turn**: Player makes decisions (hit/stand/double/split)
5. **dealer-turn**: Dealer plays according to rules
6. **payout**: Results displayed, winnings calculated
7. **shuffle**: Cut card reached, reshuffling shoe

Auto-transitions happen in `gameStore.ts` using setTimeout for delays between phases.

## Key Game Rules Implementation

### Shoe Management
- Supports 2, 6, or 8 deck shoes (configurable)
- Cut card placed randomly in last 25-50% of shoe
- Automatic reshuffle when cut card reached
- Fisher-Yates shuffle algorithm

### Hand Evaluation
- Aces valued at 11 or 1 (soft vs hard totals)
- Blackjack = 21 with exactly 2 cards (not from split)
- Dealer hits soft 17 (configurable)
- Split pairs can't result in blackjack

### Card Counting (Hi-Lo)
- Low cards (2-6): +1
- Neutral (7-9): 0
- High cards (10-A): -1
- True count = running count ÷ decks remaining

## Important Implementation Details

### Zustand Store Patterns

Stores use `create<StoreType>()` with persist middleware:

```typescript
export const useGameStore = create<GameStore>()((set, get) => ({
  // State
  shoe: new Shoe(6),
  playerHands: [],

  // Actions that mutate state
  hit: () => {
    const state = get();
    // ... modify state
    set({ playerHands: updatedHands });
  }
}));
```

**Important**: The `shoe` is a Shoe class instance, not a plain object. It maintains internal state (cards, dealtCards) that isn't directly in Zustand.

### Keyboard Shortcuts

Implemented in `hooks/useKeyboardShortcuts.ts`:
- H = Hit
- S = Stand
- D = Double
- P = Split
- Space = Deal
- B = Toggle Basic Strategy
- C = Toggle Count Display

### CSS Modules

All component styles use CSS Modules for scoping. Import styles and reference with `styles.className`.

Global theme variables in `src/styles/globals.css`:
- `--felt-green`: Main table background
- `--gold-accent`: Highlights and borders
- `--chip-*`: Chip colors for bets/results

## Testing Locally

1. `npm run dev` starts dev server at http://localhost:5173
2. localStorage persists settings and stats between sessions
3. Open browser console to debug state issues
4. Check Zustand DevTools for state inspection (if installed)

## Deployment

- Configured for GitHub Pages with base path `/bluejack/`
- Edit `vite.config.ts` to change base path
- `npm run deploy` builds and pushes to gh-pages branch
- Requires `gh-pages` package (already in devDependencies)

## Common Modifications

### Adding a New Game Rule
1. Add setting to `types/settings.types.ts`
2. Add to `settingsStore.ts` default settings
3. Use in game logic (usually in `gameStore.ts` or `engine/actions.ts`)

### Adding a New Statistic
1. Add field to `types/stats.types.ts`
2. Update `statsStore.ts` to track it in `recordHandResult`
3. Display in `components/Trainer/Statistics.tsx`

### Changing Card Counting System
- Modify `engine/card.ts` `getHiLoValue()` function
- Update `engine/deck.ts` counting methods
- Adjust `CountDisplay.tsx` labels if needed

## Build Output

Production build outputs to `dist/`:
- Single-page app (index.html)
- Bundled JS and CSS with content hashing
- No server-side rendering or API routes
