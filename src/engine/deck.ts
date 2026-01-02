import { Card } from '../types/card.types';
import { SUITS, RANKS, createCard, getHiLoValue } from './card';

export class Shoe {
  cards: Card[];
  dealtCards: Card[];
  cutCardPosition: number;
  private readonly deckCount: number;

  constructor(deckCount: number) {
    this.deckCount = deckCount;
    this.cards = this.createShoe(deckCount);
    this.dealtCards = [];
    this.cutCardPosition = this.randomCutPosition();
  }

  private createShoe(deckCount: number): Card[] {
    const cards: Card[] = [];

    // Create multiple decks
    for (let i = 0; i < deckCount; i++) {
      for (const suit of SUITS) {
        for (const rank of RANKS) {
          cards.push(createCard(suit, rank));
        }
      }
    }

    // Shuffle using Fisher-Yates algorithm
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    return cards;
  }

  private randomCutPosition(): number {
    // Place cut card randomly in the last 25-50% of the shoe
    const shoeSize = this.deckCount * 52;
    const minPosition = Math.floor(shoeSize * 0.5);
    const maxPosition = Math.floor(shoeSize * 0.75);
    return Math.floor(Math.random() * (maxPosition - minPosition + 1)) + minPosition;
  }

  deal(): Card {
    const card = this.cards.pop();
    if (!card) {
      throw new Error('Shoe is empty');
    }
    this.dealtCards.push(card);
    return card;
  }

  needsReshuffle(): boolean {
    return this.cards.length <= this.cutCardPosition;
  }

  getRunningCount(): number {
    return this.dealtCards.reduce((count, card) => count + getHiLoValue(card), 0);
  }

  getTrueCount(): number {
    const decksRemaining = this.cards.length / 52;
    if (decksRemaining <= 0) return 0;
    return Math.round(this.getRunningCount() / decksRemaining);
  }

  getCardsRemaining(): number {
    return this.cards.length;
  }

  getDecksRemaining(): number {
    return this.cards.length / 52;
  }

  reset(): void {
    this.cards = this.createShoe(this.deckCount);
    this.dealtCards = [];
    this.cutCardPosition = this.randomCutPosition();
  }
}
