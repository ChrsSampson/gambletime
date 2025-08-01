import React, { useState } from "react";

const wheelValues = [50, 100, 200, 0, 300, 500];

type Props = {
  onWin: (amount: number) => void;
};

const BonusWheel: React.FC<Props> = ({ onWin }) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const spinWheel = () => {
    setSpinning(true);
    const randIndex = Math.floor(Math.random() * wheelValues.length);
    setTimeout(() => {
      const winAmount = wheelValues[randIndex];
      setResult(winAmount);
      onWin(winAmount);
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="text-center">
      <h2 className="text-xl mb-2">🎡 Bonus Wheel</h2>
      <div className="text-4xl mb-4">
        {result !== null ? `Won: ${result} 💰` : "Ready to Spin"}
      </div>
      <button
        onClick={spinWheel}
        disabled={true}
        className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded disabled:opacity-50"
      >
        {spinning ? "Spinning..." : "Spin Wheel"}
      </button>
    </div>
  );
};

export default BonusWheel;
