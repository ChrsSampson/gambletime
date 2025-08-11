import React, { useState, useEffect } from "react";
import { createDeck, calculateScore } from "../utils/deck";
import type { Card } from "../utils/deck";

const BlackjackGame = ({
  balance,
  setBalance,
}: {
  balance: number;
  setBalance: any;
}) => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [isGameOver, setIsGameOver] = useState(true);
  const [message, setMessage] = useState(""); // Starting balance
  const [bet, setBet] = useState(10); // Current bet

  useEffect(() => {
    if (bet <= 0) {
      setMessage("Please place a valid bet.");
      return;
    }
  }, []);

  const startGame = () => {
    if (bet <= 0) {
      setMessage("Please place a valid bet.");
      return;
    }

    const newDeck = createDeck();
    const player = [newDeck.pop()!, newDeck.pop()!];
    const dealer = [newDeck.pop()!, newDeck.pop()!];
    setDeck(newDeck);
    setPlayerHand(player);
    setDealerHand(dealer);
    setIsGameOver(false);
    setMessage("");
  };

  const hit = () => {
    const newDeck = [...deck];
    const card = newDeck.pop();
    const newHand = [...playerHand, card!];
    setDeck(newDeck);
    setPlayerHand(newHand);

    if (calculateScore(newHand) > 21) {
      setIsGameOver(true);
      setMessage("Bust! You lose.");
      setBalance(Number(bet) * -1); // Deduct bet if player loses
    }
  };

  const stand = () => {
    let newDeck = [...deck];
    let newDealerHand = [...dealerHand];

    while (calculateScore(newDealerHand) < 17) {
      const card = newDeck.pop();
      newDealerHand.push(card!);
    }

    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(newDealerHand);

    let result = "";
    if (playerScore == 21) {
      result = "BlackJack!"
      const r = Number(bet) * (3/2)
      setBalance(Number(r))
    }
    else if (dealerScore > 21 || playerScore > dealerScore) {
      result = "You win!";
      const l = Number(bet);
      setBalance(l); // Add bet if player wins
    }
    else if (dealerScore === playerScore) {
      result = "Push.";
    } else {
      result = "You lose.";
      setBalance(Number(bet) * -1); // Deduct bet if player loses
    }

    setDealerHand(newDealerHand);
    setIsGameOver(true);
    setMessage(result);
  };

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0 && value <= balance) {
      setBet(value);
    }
  };

  const renderHand = (hand: Card[], hideFirst: boolean = false) => {
    return (
      <div>
        <div className="flex gap-2">
          {hand.map((card, index) => (
            <div
              key={index}
              className="h-16 w-12 border text-black border-black rounded bg-white text-center text-xl flex flex-row items-center justify-center shadow"
            >
              {hideFirst && index === 0 && !isGameOver
                ? "❓"
                : `${card.rank}${card.suit}`}
            </div>
          ))}
        </div>
        {hideFirst && (
          <p>Score: {isGameOver ? calculateScore(dealerHand) : "~"}</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-md mx-auto text-center flex flex-col gap-5 border rounded">
      <div className="p-4">
        <h1 className="text-3xl font-bold">Blackjack</h1>
        <h5 className="font-sm italic">Dealer Stands on 17</h5>
        <h5 className="font-sm italic">Blackjack pays out 3/2</h5>
      </div>
      <div >
        <h4 className="text-xl font-bold min-h-[1.5em]">{message}</h4>
      </div>

      <div className="border-1 p-4 rounded-md">
        <h2 className="text-xl font-semibold">Dealer's Hand</h2>
        {renderHand(dealerHand, true)}
      </div>

      <div className="border-1 rounded p-4">
        <h2 className="text-xl font-semibold">Your Hand</h2>
        {renderHand(playerHand)}
        <p>Score: {calculateScore(playerHand)}</p>
      </div>

      <div className="mt-2">
        <h2 className="text-xl font-semibold">Bet: </h2>
        <input
          type="number"
          value={bet}
          onChange={handleBetChange}
          className="px-3 py-2 border rounded disabled:border-gray-500 disabled:text-gray-500"
          max={balance}
          disabled={!isGameOver}
        />
      </div>

      {!isGameOver ? (
        <div className="space-x-4 mt-4 flex flex-row gap-3">
          <button
            onClick={hit}
            disabled={isGameOver}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Hit
          </button>
          <button
            onClick={stand}
            disabled={isGameOver}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Stand
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          <button
            disabled={bet <= 0}
            onClick={startGame}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            Play
          </button>
        </div>
      )}
    </div>
  );
};

export default BlackjackGame;
