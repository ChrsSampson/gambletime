import React, { useRef, useEffect, useState } from 'react';
import Matter, { Engine, Render, World, Bodies, Runner, Body } from 'matter-js';

const NUM_SEGMENTS = 12;
const RADIUS = 150;
const WIDTH = 400;
const HEIGHT = 400;

const Roulette: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine>();
  const wheelRef = useRef<Body>();
  const [result, setResult] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const engine = Engine.create();
    engineRef.current = engine;

    const render = Render.create({
      element: sceneRef.current!,
      engine,
      options: {
        width: WIDTH,
        height: HEIGHT,
        wireframes: false,
        background: 'transparent',
      },
    });

    const wheel = Bodies.circle(WIDTH / 2, HEIGHT / 2, RADIUS, {
      frictionAir: 0.005,
      restitution: 0.9,
      render: { fillStyle: '#f43f5e' },
    });
    wheelRef.current = wheel;

    const anchor = Bodies.circle(WIDTH / 2, HEIGHT / 2, 5, {
      isStatic: true,
      render: { visible: false },
    });

    World.add(engine.world, [wheel, anchor]);

    Engine.run(engine);
    Runner.run(Runner.create(), engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  const spinWheel = () => {
    if (!wheelRef.current || spinning) return;
    setResult(null);
    setSpinning(true);

    Body.setAngularVelocity(wheelRef.current, 0);
    const randVelocity = Math.random() * 0.4 + 0.4;
    Body.setAngularVelocity(wheelRef.current, randVelocity);

    setTimeout(() => {
      const angle = wheelRef.current!.angle % (2 * Math.PI);
      const degrees = (angle * 180) / Math.PI;
      const segmentSize = 360 / NUM_SEGMENTS;
      const winning = Math.floor((360 - (degrees % 360)) / segmentSize) % NUM_SEGMENTS;

      setResult(winning);
      setSpinning(false);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div ref={sceneRef} className="w-[400px] h-[400px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-yellow-400" />
        </div>
      </div>

      <button
        onClick={spinWheel}
        disabled={spinning}
        className={`px-6 py-2 rounded text-white font-bold transition ${
          spinning ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {spinning ? 'Spinning...' : '🎯 Spin'}
      </button>

      {result !== null && (
        <div className="text-xl font-semibold text-indigo-600">🎉 Result: {result}</div>
      )}
    </div>
  );
};

export default Roulette;
