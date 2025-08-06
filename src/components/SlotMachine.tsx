import React, { useState } from "react";

const chance_table_1: ChanceTable = {
  "🍒": { multiplier: 1, chance: 0.6 },
  "🍋": { multiplier: 2, chance: 0.5 },
  "🍊": { multiplier: 3, chance: 0.25 },
  "🍉": { multiplier: 4, chance: 0.18 },
  "🍇": { multiplier: 5, chance: 0.12 },
  "7️⃣": { multiplier: 7, chance: 0.08 },
  "🤑": { multiplier: 100, chance: 0.05 },
};

// Define the structure for each symbol's data
interface SymbolData {
  multiplier: number;
  chance: number;
}

// Define the overall chance table structure
interface ChanceTable {
  [symbol: string]: SymbolData;
}

// Define slot symbols for the slot machine
const symbols = ["🍒", "🍋", "🍊", "🍉", "🍇", "7️⃣", "🤑"];

const SlotMachine: React.FC = ({
  balance,
  setBalance,
}: {
  balance: number;
  setBalance: any;
}) => {
  // Slot state: each reel will have a symbol
  const [reels, setReels] = useState<string[]>(["🍒", "🍋", "🍊"]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [spinCount, setSpinCount] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [bet, setBet] = useState(1);

  function getRandomSymbol(chance_table: ChanceTable) {
    // Convert the table to an array of entries
    const entries = Object.entries(chance_table);

    // Calculate the total weight
    const totalChance = entries.reduce(
      (sum, [_, data]) => sum + data.chance,
      0
    );

    // Get a random number in the range [0, totalChance)
    const rand = Math.random() * totalChance;

    // Iterate to find where the random value falls
    let cumulative = 0;
    for (const [symbol, data] of entries) {
      cumulative += data.chance;
      if (rand < cumulative) {
        return symbol;
      }
    }
  }

  // Function to start the spin
  const spinReels = () => {
    setIsSpinning(true);
    setMessage("");
    setSpinCount((prev) => prev + 1);
    setBalance(balance - bet);

    // Simulate spinning by setting new random symbols after a short delay
    setTimeout(() => {
      const newReels = [
        getRandomSymbol(chance_table_1),
        getRandomSymbol(chance_table_1),
        getRandomSymbol(chance_table_1),
      ];
      setReels(newReels);
      checkForWin(newReels);
      setIsSpinning(false);
    }, 1000); // 1 second delay for spinning effect
  };

  // Check if all reels show the same symbol (win condition)
  const checkForWin = (newReels: string[]) => {
    if (newReels.every((symbol) => symbol === newReels[0])) {
      handleWin();
      setSpinCount(0);
    }
  };

  const updateBet = (v: any) => {
    if (v > 500) {
      setBet(500);
    } else {
      setBet(v);
    }
  };

  const handleWin = () => {
    const icon = reels[0];
    const win = Number(chance_table_1[icon].multiplier) * Number(bet);
    console.log(Number(chance_table_1[icon].multiplier), Number(bet));
    console.log(win);
    setMessage("Congratulations! You win $" + win + "!");
    setBalance(Number(balance) + Number(win));
  };

  return (
    <div className="w-full max-w-1/2 mx-auto p-6 border rounded-lg shadow-lg">
      <h1 className="text-center text-3xl font-bold">🎰 Classic Slots 🎰</h1>
      <h5 className="italic text-center mb-2">Win up to $50,000!</h5>
      <div className="text-center text-lg">
        {message && <p className="text-xl font-semibold">{message}</p>}
      </div>
      <div className="flex justify-center space-x-4 mb-4 border border-red-300 rounded-md max-w-fit p-2 mx-auto">
        {reels.map((symbol, index) => (
          <div
            key={index}
            className={`text-5xl ${isSpinning ? "spin-animation" : ""}`} // Apply spin animation when spinning
          >
            {symbol}
          </div>
        ))}
      </div>
      <div className="flex gap-2 justify-center place-items-center">
        <button
          onClick={spinReels}
          disabled={isSpinning || bet <= 0}
          className="w-[10em] py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
        >
          {isSpinning ? "Spinning..." : "Spin"}
        </button>
        <button
          disabled={bet >= 500 || isSpinning}
          onClick={() => updateBet(bet * 2)}
        >
          2X
        </button>
      </div>
      <div className="text-center mt-4">
        <div className="flex gap-2 justify-center place-items-center">
          <label className="text-xl font-bold">Bet</label>
          <input
            className="border rounded p-1 disabled:text-gray-400 disabled:bg-gray-500 disabled:cursor-not-allowed"
            placeholder="Bet"
            disabled={isSpinning}
            max={500}
            value={bet}
            onChange={(e) => updateBet(e.target.value)}
          />
        </div>
        <p className="text-sm text-gray-600">Max Bet $500</p>
        <p className="text-sm text-gray-600">
          Spins since last win: {spinCount}
        </p>
        <p className="border p-2 rounded">
          🍒 x1 | 🍋 x2 | 🍊 x4 | 🍉 x5 | 🍇 x6 | 7️⃣ x7 | 🤑 x100
        </p>
      </div>
    </div>
  );
};

export default SlotMachine;
