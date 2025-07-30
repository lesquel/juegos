import { Card } from './types';

let cardIdCounter = 0;

export const initializeGame = (numPairs: number): Card[] => {
  const values = Array.from({ length: numPairs }, (_, i) => String.fromCharCode(65 + i)); // A, B, C...
  const cards: Card[] = [];

  values.forEach(value => {
    cards.push({ id: cardIdCounter++, value, isFlipped: false, isMatched: false });
    cards.push({ id: cardIdCounter++, value, isFlipped: false, isMatched: false });
  });

  // Shuffle cards
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
};

export const flipCard = (cards: Card[], index: number): Card[] => {
  return cards.map((card, i) =>
    i === index ? { ...card, isFlipped: !card.isFlipped } : card
  );
};

export const checkMatch = (cards: Card[], flippedIndices: number[]): { newCards: Card[]; isMatch: boolean } => {
  const [idx1, idx2] = flippedIndices;
  const card1 = cards[idx1];
  const card2 = cards[idx2];

  if (card1.value === card2.value) {
    return {
      newCards: cards.map((card, i) =>
        i === idx1 || i === idx2 ? { ...card, isMatched: true } : card
      ),
      isMatch: true,
    };
  } else {
    return {
      newCards: cards.map((card, i) =>
        i === idx1 || i === idx2 ? { ...card, isFlipped: false } : card
      ),
      isMatch: false,
    };
  }
};

export const isGameOver = (cards: Card[]): boolean => {
  return cards.every(card => card.isMatched);
};
