import { useState, useEffect } from 'react';

const GRID_SIZE = 5;
const MAX_MINES = GRID_SIZE * GRID_SIZE - 1;

function generateGrid(mineCount) {
  const totalTiles = GRID_SIZE * GRID_SIZE;
  const minePositions = new Set();

  while (minePositions.size < mineCount) {
    const randIndex = Math.floor(Math.random() * totalTiles);
    minePositions.add(randIndex);
  }

  return Array.from({ length: totalTiles }, (_, index) => ({
    isMine: minePositions.has(index),
    isRevealed: false,
    id: index,
  }));
}

export default function MinesGame() {
  const [mineCount, setMineCount] = useState(5);
  const [tiles, setTiles] = useState(() => generateGrid(mineCount));
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing' | 'lost' | 'cashedOut'
  const [score, setScore] = useState(0);

  // Re-generate grid when mine count changes
  useEffect(() => {
    handleRestart();
  }, [mineCount]);

  const handleTileClick = (index) => {
    if (gameStatus !== 'playing') return;

    const newTiles = [...tiles];
    const tile = newTiles[index];

    if (tile.isRevealed) return;

    tile.isRevealed = true;

    if (tile.isMine) {
      setGameStatus('lost');
    } else {
      setScore(score + 0.25);
    }

    setTiles(newTiles);
  };

  const handleCashOut = () => {
    if (gameStatus !== 'playing') return;
    setGameStatus('cashedOut');
    setTiles(tiles.map(t => ({ ...t, isRevealed: true })));
  };

  const handleRestart = () => {
    setTiles(generateGrid(mineCount));
    setGameStatus('playing');
    setScore(0);
  };

  return (
    <div className="max-w-md mx-auto text-center font-sans py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">💣 Mines</h2>

      {/* Slider for number of mines */}
      <div className="mb-6">
        <div>
        <label className="block mb-1 font-medium">
          Number of Mines: <span className="font-bold text-blue-600">{mineCount}</span>
        </label>
        <input
          type="range"
          min="1"
          max={MAX_MINES}
          value={mineCount}
          disabled={gameStatus === 'playing'}
          onChange={(e) => setMineCount(parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
        </div>
        {gameStatus === 'playing' && (
          <p className="text-sm text-gray-500 mt-1">Stop game to adjust difficulty</p>
        )}
      </div>

      <div className="mb-4">
        {gameStatus === 'playing' && <p className="text-lg">Score: <span className="font-bold">{score}</span></p>}
        {gameStatus === 'lost' && <p className="text-red-500 text-lg font-semibold">💥 You hit a mine!</p>}
        {gameStatus === 'cashedOut' && (
          <p className="text-green-500 text-lg font-semibold">🏆 You cashed out with {score} points!</p>
        )}
      </div>

      {/* Game Grid */}
      <div
        className={`grid gap-2 justify-center mb-4`}
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
      >
        {tiles.map((tile, index) => (
          <button
            key={index}
            onClick={() => handleTileClick(index)}
            className={`w-14 h-14 rounded flex items-center justify-center text-2xl font-bold transition-colors duration-200
              ${tile.isRevealed
                ? tile.isMine
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'}
            `}
          >
            {tile.isRevealed ? (tile.isMine ? '💣' : '✅') : ''}
          </button>
        ))}
      </div>

      {/* Buttons */}
      <div className="space-x-4">
        {gameStatus === 'playing' && (
          <button
            onClick={handleCashOut}
            className="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-2 px-4 rounded"
          >
            💰 Cash Out
          </button>
        )}
        {(gameStatus === 'lost' || gameStatus === 'cashedOut') && (
          <button
            onClick={handleRestart}
            className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded"
          >
            🔄 Play Again
          </button>
        )}
      </div>
    </div>
  );
}
