import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const Controls: React.FC<{ onDrop: () => void, bet:number, setBet:(v:number) => void }> = ({ onDrop, bet, setBet }) => (
  <div className="flex justify-center my-4">
    <input value={bet} className="border p-1 rounded" onChange={(e) => setBet(Number(e.target.value))} />
    <button
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      onClick={onDrop}
    >
      Drop Ball
    </button>
    <button onClick={() => setBet(prev => Number(prev) * 2)}>
        2X
    </button>
  </div>
);

const PlinkoWorld: React.FC<{
  engine: Matter.Engine;
  bucketScores: number[];
}> = ({ engine, bucketScores }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const width = 400;
  const height = 600;
  const cols = 12;
  const spacing = width / cols;

  useEffect(() => {
    const render = Matter.Render.create({
      element: sceneRef.current!,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: '#14151f',
      },
    });

    // Pegs
    for (let row = 0; row < cols; row++) {
      for (let col = 0; col < cols; col++) {
        const x = row % 2 === 0 ? col * spacing : col * spacing + spacing / 2;
        const y = row * spacing + 40;
        const peg = Matter.Bodies.circle(x, y, 5, { isStatic: true, render: {fillStyle: '#fff'} });
        Matter.World.add(engine.world, peg);
      }
    }

    // Bucket dividers
    for (let i = 0; i <= cols; i++) {
      const x = i * spacing;
      const divider = Matter.Bodies.rectangle(x, height - 50, 2, 100, { isStatic: true, render: {fillStyle: '#fff'} });
      Matter.World.add(engine.world, divider);
    }

    // Slightly offset side walls to avoid sticky edges
    // Borders
    // Borders with angled side walls
    const topWall = Matter.Bodies.rectangle(width / 2, -20, width, 20, { isStatic: true });
    const bottomWall = Matter.Bodies.rectangle(width / 2, height + 40, width, 20, { isStatic: true });

    // side walls (off screen to prevent balls from getting stuck)
    const leftWall = Matter.Bodies.rectangle(-20, height / 2, 20, height * 1.2, {
    isStatic: true,
    });
    const rightWall = Matter.Bodies.rectangle(width + 20, height / 2, 20, height * 1.2, {
    isStatic: true,
    });

    Matter.World.add(engine.world, [topWall,bottomWall, leftWall, rightWall]);


    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [engine]);

  return (
    <div className="relative">
      <div ref={sceneRef} className="w-[400px] h-[600px] rounded shadow" />
      {/* Bucket labels */}
      <div className="absolute bottom-[60px] left-0 w-full flex justify-between px-[2px]">
        {bucketScores.map((score, i) => (
          <div key={i} className="text-white w-[calc(400px/12)] text-center">
            {score}
          </div>
        ))}
      </div>
    </div>
  );
};

const PlinkGame: React.FC<{balance:Number, setBalance: (v:Number) => void}> = ({balance, setBalance}) => {
  const engineRef = useRef(Matter.Engine.create());
  const runnerRef = useRef(Matter.Runner.create());
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState<Matter.Body[]>([]);
  const scoredBallsRef = useRef<Set<number>>(new Set()); // Track scored ball IDs
  const [bet, setBet] = useState<number>(10);
  const [results, setResults] = useState<[any?]>([])

  const bucketScores = [20, 10, 2, 0.5, 0.2, 0.1, 0.1, 0.2, 0.5, 2, 10, 20];
  const width = 400;
  const spacing = width / bucketScores.length;

  useEffect(() => {
    const engine = engineRef.current;
    Matter.Runner.run(runnerRef.current, engine);

    const interval = setInterval(() => {
      setBalls(prevBalls => {
        const newBalls: Matter.Body[] = [];

        for (const ball of prevBalls) {
          const id = ball.id;

          if (
            ball.position.y > 550 &&
            ball.speed < 0.2 &&
            !scoredBallsRef.current.has(id)
          ) {
            const bucketIndex = Math.floor(ball.position.x / spacing);
            const points = bucketScores[bucketIndex] || 0;
            scoredBallsRef.current.add(id);
            Matter.World.remove(engine.world, ball); // Remove from world
            handlePayout(Number(points));
          } else {
            if (!scoredBallsRef.current.has(id)) {
              newBalls.push(ball); // Keep active ones
            }
          }
        }

        return newBalls;
      });
    }, 300);

    function handlePayout(v:Number){
        const result = Number(bet) * Number(v)
        const newBalance = Number(balance) + Number(result)
        setBalance(newBalance)
        handleNewResult(result)
    }

    function handleNewResult(v:Number){
        const arr = [...results, v]
        setResults(arr)
    }

    return () => {
      clearInterval(interval);
      Matter.Runner.stop(runnerRef.current);
    };
  }, []);

  const handleDrop = () => {
    const engine = engineRef.current;
    const { Bodies, World } = Matter;

    // take money for the ball
    const newBalance = Number(balance) - bet
    setBalance(Number(newBalance))

    const ball = Bodies.circle(
      200 + (Math.random() - 0.5) * 50,
      20,
      10,
      {
        restitution: 0.6,
        friction: 0.005,
        render: { fillStyle: '#e11d48' },
      }
    );

    World.add(engine.world, ball);
    setBalls(prev => [...prev, ball]);
  };

  return (
    <div className="w-fit text-white border rounded p-4">
      <h1 className="text-center text-3xl font-bold pt-6">Plink World</h1>
      <div className="flex mt-2 min-h-[2em]">
        {results[0] && results.map(v => {
            console.log(v)
            const goodStyle = "border rounded p-1 min-w-[1.5em] bg-green-500"

            const badStyle= "border rounded p-1 min-w-[1.5em] bg-red-500"

            return (<p className={v > bet ? goodStyle : badStyle}>{v}</p>)
        }) }
      </div>
      <Controls bet={bet} setBet={setBet} onDrop={handleDrop} />
      <div className="flex justify-center mt-4">
        <PlinkoWorld engine={engineRef.current} bucketScores={bucketScores} />
      </div>
    </div>
  );
};

export default PlinkGame;
