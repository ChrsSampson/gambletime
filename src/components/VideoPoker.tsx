import React, { useState, useEffect } from 'react';
import { generateDeck, shuffle, evaluateHand } from '../utils/poker.ts';
import type { Card } from '../utils/poker.ts';

const payoutChart = {
  'Royal Flush': 800,
  'Flush': 2,
  "One Pair": 1.25,
  "Two Pair": 1.5,
  "Straight": 4,
  'Full House': 8,
  "Three of a Kind": 3,
  "Four of a Kind": 25,
  "Straight Flush": 50
}

const VideoPoker: React.FC<{setBalance: (v:number) => void}> = ({setBalance}) => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [hand, setHand] = useState<Card[]>([]);
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);
  const [round, setRound] = useState<1 | 2>(1);
  const [result, setResult] = useState<string | null>(null);
  const [bet, setBet] = useState<number>(10)

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const newDeck = shuffle(generateDeck());
    const newHand = newDeck.slice(0, 5);
    setDeck(newDeck.slice(5));
    setHand(newHand);
    setHeld([false, false, false, false, false]);
    setRound(1);
    setResult(null);
  };

  const toggleHold = (index: number) => {
    if (round === 2) return;
    const updated = [...held];
    updated[index] = !updated[index];
    setHeld(updated);
  };

  const drawCards = () => {
    if (round === 1) {
      setBalance(Number(bet) * -1)
      const newCards = [...hand];
      let remainingDeck = [...deck];
      
      for (let i = 0; i < 5; i++) {
        if (!held[i]) {
          newCards[i] = remainingDeck[0];
          remainingDeck = remainingDeck.slice(1);
        }
      }

      setHand(newCards);
      setDeck(remainingDeck);
      setRound(2);
      const hr = evaluateHand(newCards)
      // setResult(evaluateHand(newCards));
      const mult = payoutChart[hr] || 0
      const r = mult * bet
      setResult(hr + ' $' + r)
      setBalance(Number(r))
    } else {
      resetGame();
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto  shadow-md rounded text-center space-y-4 border rounded">
      <h1 className="text-2xl font-bold">Video Poker</h1>

      <div className="flex justify-center gap-2">
        {hand.map((card, index) => (
  <div
    key={card.id + index}
    onClick={() => toggleHold(index)}
    className={`relative cursor-pointer py-4 min-w-[3.5em] border rounded shadow text-xl hover:border-green-300 font-mono ${
      held[index] ? 'border-green-500' : 'border-gray-300'
    }`}
  >
    <div className="text-2xl">{card.rank}</div>
    <div className="text-2xl">{card.suit}</div>
    {/* Held indicator, visually shown but not in the DOM for screen readers */}
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 2,
        textAlign: "center",
        color: held[index] ? "#22c55e" : "transparent",
        fontWeight: "bold",
        fontSize: "0.9em",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      Held
    </span>
  </div>
))}
      </div>

      <div className="flex gap-2 justify-center place-items-center">
      <button
        onClick={drawCards}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {round === 1 ? 'Draw' : 'New Game'}
      </button>
      <div className="flex gap-2 place-items-center">
        <label>Bet</label>
      <input disabled={round == 1} type="number" value={bet} onChange={(e) => setBet(e.target.value)} placeholder="Bet" className="border p-1 rounded disabled:bg-gray-400 disabled:poiner-not-allowed"></input>
      </div>
      </div>

      {result && (
        <div className="text-xl font-semibold text-indigo-600 mt-4">
          🃏 You got: {result}
        </div>
      )}
    </div>
  );
};

export default VideoPoker;
