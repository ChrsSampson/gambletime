import React, { useEffect, useRef, useState } from "react";
import Matter, { Body, Engine } from "matter-js";
import AudioPlayer from "./ui/AudioPlayer";

const Controls: React.FC<{
  onDrop: () => void;
  bet: number;
  setBet: (v: number) => void;
}> = ({ onDrop, bet, setBet }) => (
  <div className="flex justify-center my-4">
    <input
      value={bet}
      className="border p-1 rounded"
      onChange={(e) => setBet(Number(e.target.value))}
    />
    <button
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      onClick={onDrop}
    >
      Drop Ball
    </button>
    <button onClick={() => setBet((prev) => Number(prev) * 2)}>2X</button>
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
        background: "#14151f",
      },
    });

    // Pegs
    for (let row = 0; row < cols; row++) {
      for (let col = 0; col < cols; col++) {
        const x = row % 2 === 0 ? col * spacing : col * spacing + spacing / 2;
        const y = row * spacing + 40;
        const peg = Matter.Bodies.circle(x, y, 5, {
          isStatic: true,
          render: { fillStyle: "#fff" },
        });
        Matter.World.add(engine.world, peg);
      }
    }

    // Bucket dividers
    for (let i = 0; i <= cols; i++) {
      const x = i * spacing;
      const divider = Matter.Bodies.rectangle(x, height - 25, 2, 100, {
        isStatic: true,
        render: { fillStyle: "#fff" },
      });
      Matter.World.add(engine.world, divider);
    }

    // Slightly offset side walls to avoid sticky edges
    // Borders
    // Borders with angled side walls
    const topWall = Matter.Bodies.rectangle(width / 2, -20, width, 20, {
      isStatic: true,
    });
    const bottomWall = Matter.Bodies.rectangle(
      width / 2,
      height + 40,
      width,
      20,
      { isStatic: true, label: "ground" }
    );

    // side walls (off screen to prevent balls from getting stuck)
    const leftWall = Matter.Bodies.rectangle(
      -20,
      height / 2,
      20,
      height * 1.2,
      {
        isStatic: true,
      }
    );
    const rightWall = Matter.Bodies.rectangle(
      width + 20,
      height / 2,
      20,
      height * 1.2,
      {
        isStatic: true,
      }
    );

    Matter.World.add(engine.world, [topWall, bottomWall, leftWall, rightWall]);

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

const PlinkGame: React.FC<{
  balance: Number;
  setBalance: (v: Number) => void;
}> = ({ balance, setBalance }) => {

  const engineRef = useRef(Matter.Engine.create());
  const runnerRef = useRef(Matter.Runner.create());
  const scoredBallsRef = useRef<Set<number>>(new Set()); // Track scored ball IDs
  const [bet, setBet] = useState<number>(10);
  const [results, setResults] = useState<[any?]>([]);
  const audioRef = useRef()

  const bucketScores = [20, 10, 2, 0.5, 0.2, 0.1, 0.1, 0.2, 0.5, 2, 10, 20];
  const width = 400;
  const spacing = width / bucketScores.length;

  function handlePayout(multiplier: Number) {
    const result = Number(bet) * Number(multiplier);

    const newBalance = Number(getBalance()) + Number(result) - Number(bet);

     console.log(getBalance(), '+', result, newBalance)
    // Use functional setBalance to ensure correct concurrent updates
    setBalance(newBalance);

    handleNewResult(result);
  }

  function getBalance() {
    return balance;
  }

  function handleNewResult(v: Number) {
    const arr = [...results, v];
    setResults(arr);
  }

  useEffect(() => {
    const engine = engineRef.current;
    Matter.Runner.run(runnerRef.current, engine);

    Matter.Events.on(engine, "collisionStart", function (event) {
      // play audio for ball collision
      audioRef.current.play()

      for (const pair of event.pairs) {
        const { bodyA, bodyB } = pair;

        const isGroundA = bodyA.label === "ground";
        const isGroundB = bodyB.label === "ground";

        if (isGroundA || isGroundB) {
          const ball = isGroundA ? bodyB : bodyA;

          // Ensure ball is not already scored
          if (!scoredBallsRef.current.has(ball.id)) {
            scoredBallsRef.current.add(ball.id);

            const bucketIndex = Math.floor(ball.position.x / spacing);
            const points = bucketScores[bucketIndex] || 0;

            handlePayout(points);
            Matter.World.remove(engine.world, ball);
          }
        }
      }
    });

    return () => {
      Matter.Runner.stop(runnerRef.current);
    };
  }, []);

  const handleDrop = () => {
    // take money for the ball
    const newBalance = Number(balance) - bet;
    setBalance(Number(newBalance));

    const engine = engineRef.current;
    const { Bodies, World } = Matter;

    const ball = Bodies.circle(200 + (Math.random() - 0.5) * 50, 20, 10, {
      restitution: 0.6,
      friction: 0.005,
      render: { fillStyle: "#e11d48" },
      label: "ball",
    });

    World.add(engine.world, ball);
    // setBalls(prev => [...prev, ball]);
  };

  return (
    <div className="w-fit text-white border rounded p-4">
      <h1 className="text-center text-3xl font-bold pt-6">Plink World</h1>
      <div className="flex mt-2 min-h-[2em]">
        {results[0] &&
          results.map((v) => {
            const goodStyle = "border rounded p-1 min-w-[1.5em] bg-green-600";

            const badStyle = "border rounded p-1 min-w-[1.5em] bg-red-600";

            return <p className={v > bet ? goodStyle : badStyle}>${v}</p>;
          })}
      </div>
      <Controls bet={bet} setBet={setBet} onDrop={handleDrop} />
      <div className="flex justify-center mt-4">
        <PlinkoWorld engine={engineRef.current} bucketScores={bucketScores} />
      </div>
      <AudioPlayer ref={audioRef} src="/sounds/ballClick.mp3" volume={0.2} />
    </div>
  );
};

export default PlinkGame;
