import React, { useState } from 'react';

const chance_table = {
    '🍒':1,
    '🍋':2 ,
    '🍊':3 ,
    '🍉':4,
    '🍇':5,
    '7️⃣':7,
}


// Define slot symbols for the slot machine
const symbols = ['🍒', '🍋', '🍊', '🍉', '🍇', '7️⃣'];

const SlotMachine: React.FC = ({balance, setBalance}: {balance:number, setBalance:any}) => {
  // Slot state: each reel will have a symbol
  const [reels, setReels] = useState<string[]>(['🍒', '🍋', '🍊']);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinCount, setSpinCount] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
const [bet, setBet] = useState(1)

  // Function to start the spin
  const spinReels = () => {
    setIsSpinning(true);
    setMessage('');
    setSpinCount(prev => prev + 1);
    setBalance(balance - bet)

    // Simulate spinning by setting new random symbols after a short delay
    setTimeout(() => {
      const newReels = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];
      setReels(newReels);
      checkForWin(newReels);
      setIsSpinning(false);
    }, 1000); // 1 second delay for spinning effect
  };

  // Check if all reels show the same symbol (win condition)
  const checkForWin = (newReels: string[]) => {
    if (newReels.every(symbol => symbol === newReels[0])) {
      setMessage('Congratulations! You win!');
      handleWin();
      setSpinCount(0)
    }
  };

  const updateBet = (v:any) => {
    if(v > 500) {
        setBet(500)
    } else{
        setBet(v)
    }
  }

  const handleWin = () => {
    const win = spinCount + 500 * bet
    setBalance(balance + win)
  }

  return (
    <div className="w-full max-w-1/2 mx-auto p-6 border rounded-lg shadow-lg">
      <h1 className="text-center text-3xl font-bold mb-4">🎰 Slot Machine 🎰</h1>
      <div className="text-center text-lg">
        {message && <p className="text-xl font-semibold">{message}</p>}
      </div>
      <div className="flex justify-center space-x-4 mb-4 border border-red-300 rounded-md max-w-fit p-2 mx-auto">
        {reels.map((symbol, index) => (
          <div
            key={index}
            className={`text-5xl ${isSpinning ? 'spin-animation' : ''}`} // Apply spin animation when spinning
          >
            {symbol}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
            onClick={spinReels}
            disabled={isSpinning || bet < 0}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
        >
            
            {isSpinning ? 'Spinning...' : 'Spin'}
        </button>
            <button>2X</button>
    </div>
      <div className="text-center mt-4">
        <input className="border rounded p-1 disabled:text-grey-300 disabled-border-grey-300" placeholder="Bet" disabled={isSpinning} max={500} value={bet} onChange={(e) => updateBet(e.target.value)} />
        <p className="text-sm text-gray-600">Max Bet $500</p>
        <p className="text-sm text-gray-600">Spins since last win: {spinCount}</p>
      </div>
    </div>
  );
};

export default SlotMachine;
