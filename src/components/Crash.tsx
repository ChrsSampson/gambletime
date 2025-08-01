import React, { useEffect, useState, useRef } from "react";

const getRandomCrashPoint = () => {
  // Simulates a crash point with exponential distribution
  const r = Math.random();
  return Math.max(0.01, -1 / Math.log(r));
};

const Crash: React.FC = ({
  balance,
  setBalance,
}: {
  balance: number;
  setBalance: any;
}) => {
  const [multiplier, setMultiplier] = useState(0.0);
  const [gameState, setGameState] = useState<"waiting" | "running" | "crashed">(
    "waiting"
  );
  const [crashPoint, setCrashPoint] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [cashOut, setCashOut] = useState<number | null>(null);
  const multiplierRef = useRef(0.0);
  const [bet, setBet] = useState("");
  const [winAmount, setWinAmount] = useState(0);

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastValueRef = useRef<number>(0.0);

  const startGame = () => {
    const newBalance = Number(balance) - Number(bet)
    setBalance(newBalance) // take money at the start of the game

    const point = getRandomCrashPoint();
    setCrashPoint(point);
    setMultiplier(0.0);
    lastValueRef.current = 0.0;
    setCashOut(null);
    setGameState("running");
    startTimeRef.current = 0;

    animationRef.current = requestAnimationFrame(updateMultiplier);
  };

  const updateMultiplier = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = (timestamp - startTimeRef.current) / 1000; // in seconds

    // Curve: a fast-growing exponential curve
    const newMultiplier = (1 + Math.pow(elapsed, 1.2) * 0.5) -1 ;

    if (newMultiplier >= crashPoint) {
      setMultiplier(crashPoint);
      setGameState("crashed");
      cancelAnimationFrame(animationRef.current!);
      //   player lose
      setBalance(Number((balance -= Number(bet))));
      return;
    }

    lastValueRef.current = newMultiplier;
    setMultiplier(parseFloat(newMultiplier.toFixed(2)));
    animationRef.current = requestAnimationFrame(updateMultiplier);
  };

  const handleCashOut = () => {
    if (gameState === "running") {
      setCashOut(lastValueRef.current);
      setGameState("crashed");
      if (animationRef.current) cancelAnimationFrame(animationRef.current);

      if(multiplier < 1.0){
        // lose
        // const p = 100 / Number(multiplier) 
        const a = Number(multiplier) * Number(bet)
        const b = Number(balance) + Number(a)
        setWinAmount(Number(a).toFixed(2)) // bullshit linting error
        setBalance(b)
      } else {
        // payout
        const win = calculateWin();
        const r = Number(balance) + Number(win);
        setWinAmount(win);
        setBalance(r);
      }
    }
  };

  function calculateWin() {
    const m = Number(multiplier);
    const b = Number(bet);

    const w = m * b;

    return w.toFixed(2);
  }

  return (
    <div className="min-w-1/2 flex flex-col items-center justify-center p-4 rounded border text-white">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-4xl font-bold">🚀 Stonks 💎</h1>
          <h4 className="italic">They only go up..until they don't</h4>
        </div>
        <div
          className={`text-5xl font-mono ${
            gameState === "crashed" ? "text-red-500" : "text-green-400"
          }`}
        >
          {multiplier.toFixed(2)}x
        </div>
        {gameState === "waiting" && (
          <button
            onClick={startGame}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded"
          >
            Start
          </button>
        )}
        {gameState === "running" && (
          <button
            onClick={handleCashOut}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 rounded"
          >
            Cash Out
          </button>
        )}
        {gameState === "crashed" && (
          <div className="space-y-4">
            <div className="text-xl">
              {cashOut
                ? `✅ Cashed out at ${cashOut.toFixed(2)}x for $${winAmount}!`
                : `💥 Crashed at ${multiplier.toFixed(2)}x`}
            </div>
            <button
              disabled={Number(bet) <= 0}
              onClick={startGame}
              className="px-6 py-2"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      <input
        disabled={gameState == "running"}
        type="number"
        value={bet}
        onChange={(e) => setBet(e.target.value)}
        className="border p-1 rounded disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-400"
        placeholder="Bet"
      />
    </div>
  );
};

export default Crash;
