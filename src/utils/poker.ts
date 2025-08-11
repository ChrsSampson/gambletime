export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank =
  | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string;
}

const suits: Suit[] = ['♠', '♥', '♦', '♣'];
const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export function generateDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank, id: `${rank}${suit}` });
    }
  }
  return deck;
}

export function shuffle(deck: Card[]): Card[] {
  const passes = 10
  // more aggressive shuffling
  for(let i = 0; i< passes; i++) {
    deck = [...deck].sort(() => Math.random() - 0.5);
  }
  return deck
}

export function evaluateHand(cards: Card[]): string {
  if (cards.length < 5) return 'Not enough cards';

  // Helper functions
  const rankOrder: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const rankValue = (rank: Rank) => rankOrder.indexOf(rank);

  // Count occurrences
  const counts: Record<string, number> = {};
  const suits: Record<string, number> = {};
  for (const card of cards) {
    counts[card.rank] = (counts[card.rank] || 0) + 1;
    suits[card.suit] = (suits[card.suit] || 0) + 1;
  }
  const values = Object.values(counts).sort((a, b) => b - a);

  // Check for flush
  const isFlush = Object.values(suits).some(count => count >= 5);

  // Get sorted unique ranks
  const uniqueRanks = Array.from(new Set(cards.map(c => rankValue(c.rank)))).sort((a, b) => a - b);

  // Check for straight (including wheel: A-2-3-4-5)
  let isStraight = false;
  for (let i = 0; i <= uniqueRanks.length - 5; i++) {
    if (
      uniqueRanks[i + 4] - uniqueRanks[i] === 4 &&
      uniqueRanks.slice(i, i + 5).length === 5
    ) {
      isStraight = true;
      break;
    }
  }
  // Special case: A-2-3-4-5
  if (!isStraight && uniqueRanks.includes(12)) {
    const wheel = [0, 1, 2, 3, 12];
    if (wheel.every(v => uniqueRanks.includes(v))) isStraight = true;
  }

  // Check for straight flush and royal flush
  let isStraightFlush = false;
  let isRoyalFlush = false;
  for (const suit of Object.keys(suits)) {
    const suitedCards = cards.filter(c => c.suit === suit);
    if (suitedCards.length >= 5) {
      const suitedRanks = Array.from(new Set(suitedCards.map(c => rankValue(c.rank)))).sort((a, b) => a - b);
      // Check for straight flush
      for (let i = 0; i <= suitedRanks.length - 5; i++) {
        if (
          suitedRanks[i + 4] - suitedRanks[i] === 4 &&
          suitedRanks.slice(i, i + 5).length === 5
        ) {
          isStraightFlush = true;
          // Royal flush: 10, J, Q, K, A
          if (suitedRanks.slice(i, i + 5).toString() === [8, 9, 10, 11, 12].toString()) {
            isRoyalFlush = true;
          }
          break;
        }
      }
      // Special case: A-2-3-4-5 straight flush
      if (!isStraightFlush && suitedRanks.includes(12)) {
        const wheel = [0, 1, 2, 3, 12];
        if (wheel.every(v => suitedRanks.includes(v))) isStraightFlush = true;
      }
    }
  }

  if (isRoyalFlush) return 'Royal Flush';
  if (isStraightFlush) return 'Straight Flush';
  if (values[0] === 4) return 'Four of a Kind';
  if (values[0] === 3 && values[1] === 2) return 'Full House';
  if (isFlush) return 'Flush';
  if (isStraight) return 'Straight';
  if (values[0] === 3) return 'Three of a Kind';
  if (values[0] === 2 && values[1] === 2) return 'Two Pair';
  if (values[0] === 2) return 'One Pair';
  return 'High Card';
}
