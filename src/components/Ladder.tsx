import React, { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

type Tile = {
  isSnake: boolean;
  revealed: boolean;
};

const ROWS = 10;
const COLUMNS = 6;

const generateBoard = (): Tile[][] => {
  const board: Tile[][] = [];

  for (let row = 0; row < ROWS; row++) {
    const progress = 1 - row / (ROWS - 1); // 1 at bottom, 0 at top
    const snakeCount = Math.min(
      Math.max(Math.floor((1 - progress) * 4), 1), // scale from 1 to 4
      4
    );

    const snakeCols = new Set<number>();
    while (snakeCols.size < snakeCount) {
      snakeCols.add(Math.floor(Math.random() * COLUMNS));
    }

    const currentRow: Tile[] = [];
    for (let col = 0; col < COLUMNS; col++) {
      currentRow.push({
        isSnake: snakeCols.has(col),
        revealed: false,
      });
    }

    board.push(currentRow);
  }

  console.log(board);

  return board;
};

const VerticalSnakeGame: React.FC = () => {
  const [board, setBoard] = useState<Tile[][]>(generateBoard);
  const [currentRow, setCurrentRow] = useState(ROWS - 1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const [initialBet, setInitialBet] = useState<number>(0);
  const [winnings, setWinnings] = useState(0);

  const handleTileClick = (colIndex: number) => {
    if (isGameOver || currentRow < 0) return;

    const updatedBoard = [...board];
    const tile = updatedBoard[currentRow][colIndex];

    if (tile.revealed) return;

    tile.revealed = true;
    setBoard(updatedBoard);

    if (tile.isSnake) {
      setIsGameOver(true);
      alert("💥 Snake! You lost your bet.");
    } else {
      const multiplier = (ROWS - currentRow + 1) * 0.2;
      const reward = +(initialBet * multiplier).toFixed(2);
      setWinnings(reward);
      setCurrentRow(currentRow - 1);
    }
  };

  const handleStartGame = () => {
    if (initialBet <= 0) {
      alert("Enter a valid bet to start!");
      return;
    }
    setHasStarted(true);
  };

  const handleCashOut = () => {
    alert(`🏆 You cashed out: $${winnings}`);
    setIsGameOver(true);
  };

  const resetGame = () => {
    setBoard(generateBoard());
    setCurrentRow(ROWS - 1);
    setIsGameOver(false);
    setHasStarted(false);
    setWinnings(0);
    setInitialBet(0);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Corporate Ladder</h1>

      {!hasStarted ? (
        <div className="flex flex-col items-center gap-2">
          <label className="text-white">Enter Bet Amount:</label>
          <input
            type="number"
            value={initialBet}
            onChange={(e) => setInitialBet(Number(e.target.value))}
            className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 w-40 text-center"
            min={1}
          />
          <button
            onClick={handleStartGame}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <p className="text-lg">Bet: ${initialBet}</p>
          <p className="text-lg">Winnings: ${winnings}</p>

          <div className="grid grid-rows-10 gap-2">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-row gap-2">
                {row.map((tile, colIndex) => (
                  <motion.button
                    key={colIndex}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() =>
                      rowIndex === currentRow && handleTileClick(colIndex)
                    }
                    className={clsx(
                      "w-12 h-12 rounded border transition-colors duration-200",
                      tile.revealed
                        ? tile.isSnake
                          ? "bg-red-500"
                          : "bg-green-500"
                        : "bg-gray-800 hover:bg-gray-700",
                      rowIndex !== currentRow &&
                        !tile.revealed &&
                        "cursor-not-allowed"
                    )}
                    disabled={
                      rowIndex !== currentRow || tile.revealed || isGameOver
                    }
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleCashOut}
              disabled={isGameOver || winnings === 0}
              className={clsx(
                "px-4 py-2 rounded text-white",
                winnings > 0 && !isGameOver
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-gray-500 cursor-not-allowed"
              )}
            >
              💸 Cash Out
            </button>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Restart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VerticalSnakeGame;
