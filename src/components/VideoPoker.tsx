import React, { useState} from 'react';
import { generateDeck, shuffle, evaluateHand } from '../utils/poker.ts';
import type { Card } from '../utils/poker.ts';

const payoutChart = {
  'Royal Flush': 250,
  'Flush': 2,
  "One Pair": 0.5,
  "Two Pair": 2,
  "Straight": 4,
  'Full House': 8,
  "Three of a Kind": 3,
  "Four of a Kind": 25,
  "Straight Flush": 50
};

const VideoPoker: React.FC<{ setBalance: (v: number) => void }> = ({ setBalance }) => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [hand, setHand] = useState<Card[]>([]);
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);
  const [round, setRound] = useState<1 | 2 | 0>(0); // 0 = betting phase, 1 = cards dealt, 2 = after draw
  const [result, setResult] = useState<string | null>(null);
  const [bet, setBet] = useState<number>(10);

  // Start new round, return to betting phase
  const resetGame = () => {
    setDeck([]);
    setHand([]);
    setHeld([false, false, false, false, false]);
    setRound(0); // Go back to betting phase
    setResult(null);
  };

  // Player starts the game after setting the bet
  const startGame = () => {
    const newDeck = shuffle(generateDeck());
    const newHand = newDeck.slice(0, 5);
    setDeck(newDeck.slice(5));
    setHand(newHand);
    setHeld([false, false, false, false, false]);
    setRound(1);
    setBalance(Number(bet) * -1)
  };

  const toggleHold = (index: number) => {
    if (round !== 1) return;
    const updated = [...held];
    updated[index] = !updated[index];
    setHeld(updated);
  };

  const drawCards = () => {
    if (round !== 1) return;

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

    const hr = evaluateHand(newCards);
    const mult = payoutChart[hr] || 0;
    const winnings = mult * bet;

    setResult(`${hr} $${winnings}`);
    setBalance(winnings);
  };

  return (
    <div className="p-6 max-w-xl mx-auto shadow-md rounded text-center space-y-4 border">
      <h1 className="text-2xl font-bold">Video Poker</h1>

      {round === 0 && (
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="flex gap-2">
            {held.map((c,index) => {
                return (
                  <div
                  key={index}
                  className={`relative cursor-pointer py-8 min-w-[3.5em] border rounded shadow text-xl font-mono`}
                >
                  <div className="text-2xl">❓</div>
                </div>
              )
            })}

          </div>
          <div className="flex gap-2 place-items-center">
            <label htmlFor="bet">Bet:</label>
            <input
              type="number"
              id="bet"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              min={1}
              className="border p-1 rounded"
            />
            <button
              onClick={startGame}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Deal Cards
            </button>
          </div>
        </div>
      )}

      {round > 0 && (
        <>
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
            ))
          }
          </div>

          <div className="flex gap-4 justify-center place-items-center">
            {round === 1 && (
              <button
                onClick={drawCards}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Draw
              </button>
            )}

            {round === 2 && (
              <div className="flex place-items-center">
                <button
                  onClick={resetGame}
                  className="mt-4 px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  New Game
                </button>
              </div>
            )}

            <div className="text-lg">
              Bet: <strong>${bet}</strong>
            </div>
          </div>

          {result && (
            <div className="text-xl font-semibold text-indigo-600 mt-4">
              You got: {result}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoPoker;
