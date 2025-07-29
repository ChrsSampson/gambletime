import React, { useState, useEffect } from 'react';
import { createDeck, calculateScore } from '../utils/deck';
import type { Card } from '../utils/deck';

const BlackjackGame: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(1000);  // Starting balance
  const [bet, setBet] = useState(0);  // Current bet

  useEffect(() => {
    startGame();
  }, []);

  const startGame = () => {
    if (bet <= 0 || bet > balance) {
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
    setMessage('');
  };

  const hit = () => {
    const newDeck = [...deck];
    const card = newDeck.pop();
    const newHand = [...playerHand, card!];
    setDeck(newDeck);
    setPlayerHand(newHand);

    if (calculateScore(newHand) > 21) {
      setIsGameOver(true);
      setMessage('Bust! You lose.');
      setBalance(prev => prev - bet);  // Deduct bet if player loses
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

    let result = '';
    if (dealerScore > 21 || playerScore > dealerScore) {
      result = 'You win!';
      setBalance(prev => prev + bet);  // Add bet if player wins
    } else if (dealerScore === playerScore) {
      result = 'Push.';
    } else {
      result = 'You lose.';
      setBalance(prev => prev - bet);  // Deduct bet if player loses
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
      <div className="flex gap-2">
        {hand.map((card, index) => (
          <div
            key={index}
            className="h-16 border border-black rounded bg-white text-center text-xl flex flex-row items-center justify-center shadow"
          >
            {hideFirst && index === 0 && !isGameOver ? '🂠' : `${card.rank}${card.suit}`}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-md mx-auto text-center space-y-6">
      <h1 className="text-3xl font-bold">Blackjack</h1>

      <div>
        <h2 className="text-xl font-semibold">Dealer's Hand</h2>
        {renderHand(dealerHand, true)}
      </div>

      <div>
        <h2 className="text-xl font-semibold">Your Hand</h2>
        {renderHand(playerHand)}
        <p>Score: {calculateScore(playerHand)}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Balance: ${balance}</h2>
        <h2 className="text-xl font-semibold">Bet: </h2>
        <input
          type="number"
          value={bet}
          onChange={handleBetChange}
          className="px-3 py-2 border rounded"
          min="1"
          max={balance}
        />
      </div>

      {!isGameOver ? (
        <div className="space-x-4 mt-4">
          <button onClick={startGame} className="px-4 py-2 bg-blue-500 text-white rounded">
            Start Game
          </button>
          <button onClick={hit} className="px-4 py-2 bg-blue-500 text-white rounded">
            Hit
          </button>
          <button onClick={stand} className="px-4 py-2 bg-green-500 text-white rounded">
            Stand
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          <p className="text-xl font-bold">{message}</p>
          <button onClick={startGame} className="px-4 py-2 bg-gray-700 text-white rounded">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default BlackjackGame;
