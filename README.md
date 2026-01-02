# BlueJack - Blackjack Card Counting Trainer

A web-based blackjack card counting trainer built with React and TypeScript. Practice your card counting skills and learn optimal basic strategy for blackjack.

## Features

- **Full Blackjack Game Engine**: Play authentic blackjack with standard casino rules
- **Card Counting Trainer**: Real-time Hi-Lo running count and true count display
- **Basic Strategy Chart**: Color-coded strategy matrix overlay for optimal play
- **Session Statistics**: Track your performance with detailed stats
- **Keyboard Shortcuts**: Fast gameplay with keyboard controls
- **Configurable Rules**:
  - 2, 6, or 8 deck shoes
  - 3:2 or 6:5 blackjack payouts
  - Dealer hits/stands on soft 17
  - Randomized cut card placement
- **Local Storage**: Sessions and settings persist across browser refreshes
- **No Backend Required**: Pure client-side application

## Live Demo

[Try BlueJack on GitHub Pages](#) _(Coming soon)_

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bluejack.git
cd bluejack

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

### Deploy to GitHub Pages

```bash
# Deploy to GitHub Pages
npm run deploy
```

## How to Play

### Keyboard Shortcuts

- **H** - Hit (take another card)
- **S** - Stand (keep current hand)
- **D** - Double Down (double bet, take one card, stand)
- **P** - Split (split pairs into two hands)
- **Space/Enter** - Deal cards
- **B** - Toggle Basic Strategy chart
- **C** - Toggle card count display

### Game Flow

1. **Place Your Bet**: Select chip amount and click "Deal"
2. **Play Your Hand**: Use keyboard shortcuts or buttons to hit/stand/double/split
3. **Dealer Plays**: Dealer automatically plays after all player hands complete
4. **Round Complete**: Results shown, new round starts automatically

### Card Counting (Hi-Lo System)

- **Low cards (2-6)**: +1 to count
- **Neutral cards (7-9)**: 0 (no change)
- **High cards (10-A)**: -1 to count

**Running Count**: Sum of all card values seen
**True Count**: Running count divided by decks remaining (more accurate for betting decisions)

### Basic Strategy

Press **B** to view the optimal basic strategy chart. Colors indicate:
- 🟢 **Green** - Stand
- 🔴 **Red** - Hit
- 🟡 **Yellow** - Double Down
- 🔵 **Blue** - Split

## Project Structure

```
bluejack/
├── src/
│   ├── components/      # React components
│   │   ├── Game/       # Game table, cards, hands
│   │   ├── Trainer/    # Count display, strategy chart, stats
│   │   ├── Settings/   # Settings modal
│   │   └── Layout/     # Header
│   ├── engine/         # Game logic (pure TypeScript)
│   │   ├── card.ts
│   │   ├── deck.ts
│   │   ├── hand.ts
│   │   ├── actions.ts
│   │   └── basicStrategy.ts
│   ├── store/          # Zustand state management
│   │   ├── gameStore.ts
│   │   ├── settingsStore.ts
│   │   └── statsStore.ts
│   ├── types/          # TypeScript definitions
│   └── hooks/          # Custom React hooks
└── public/
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management
- **CSS Modules** - Component styling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning and practice.

## Acknowledgments

- Basic strategy based on mathematical analysis by Edward O. Thorp
- Hi-Lo card counting system developed by Harvey Dubner
- Casino felt design inspired by classic blackjack tables

## Disclaimer

This is a training tool for educational purposes. Card counting is legal but may be prohibited by casinos. Always gamble responsibly.
