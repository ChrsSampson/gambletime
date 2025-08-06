// src/components/WheelOfFortune.tsx
import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import Matter from "matter-js";

const labels = ["🍎", "🍌", "🍇", "🍊", "🍉", "🍍", "🥝", "💎"];

export interface WheelOfFortuneHandle {
  spin: () => void;
}

const WheelOfFortune = forwardRef<WheelOfFortuneHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const wheelRef = useRef<Matter.Body | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const width = 400;
  const height = 400;
  const radius = 150;

  useImperativeHandle(ref, () => ({
    spin: spinWheel,
    result: result,
    spinning: spinning,
  }));

  useEffect(() => {
    const Engine = Matter.Engine,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Runner = Matter.Runner,
      Constraint = Matter.Constraint;

    const engine = Engine.create();
    engineRef.current = engine;

    const wheel = Bodies.circle(width / 2, height / 2, radius, {
      isStatic: false,
      frictionAir: 0.05,
    });
    wheelRef.current = wheel;

    const pin = Bodies.circle(width / 2, height / 2, 5, { isStatic: true });
    const constraint = Constraint.create({
      bodyA: wheel,
      pointB: { x: width / 2, y: height / 2 },
      length: 0,
      stiffness: 1,
    });

    Composite.add(engine.world, [wheel, pin, constraint]);
    const runner = Runner.create();
    Runner.run(runner, engine);

    let animationFrameId: number;
    const context = canvasRef.current!.getContext("2d")!;

    const drawWheel = () => {
      context.clearRect(0, 0, width, height);
      const anglePerSlice = (2 * Math.PI) / labels.length;
      const angle = wheel.angle;

      // Draw segments
      for (let i = 0; i < labels.length; i++) {
        const startAngle = angle + i * anglePerSlice;
        const endAngle = startAngle + anglePerSlice;

        context.beginPath();
        context.moveTo(width / 2, height / 2);
        context.arc(width / 2, height / 2, radius, startAngle, endAngle);
        context.fillStyle = i % 2 === 0 ? "#facc15" : "#fcd34d";
        context.fill();
        context.stroke();

        // Label
        const textAngle = startAngle + anglePerSlice / 2;
        const textX = width / 2 + (radius - 40) * Math.cos(textAngle);
        const textY = height / 2 + (radius - 40) * Math.sin(textAngle);

        context.save();
        context.translate(textX, textY);
        context.rotate(textAngle);
        context.fillStyle = "#000";
        context.font = "30px sans-serif";
        context.textAlign = "center";
        context.fillText(labels[i], 0, 0);
        context.restore();
      }

      // Pointer
      context.fillStyle = "#1e3a8a";
      context.beginPath();
      context.moveTo(width / 2, height / 2 - radius - 10);
      context.lineTo(width / 2 - 10, height / 2 - radius - 30);
      context.lineTo(width / 2 + 10, height / 2 - radius - 30);
      context.closePath();
      context.fill();

      animationFrameId = requestAnimationFrame(drawWheel);
    };

    drawWheel();

    return () => {
      cancelAnimationFrame(animationFrameId);
      Composite.clear(engine.world, false);
      Matter.Engine.clear(engine);
    };
  }, []);

  const spinWheel = () => {
    if (wheelRef.current && !spinning) {
      setSpinning(true);
      setResult(null);
      Matter.Body.setAngularVelocity(wheelRef.current, Math.random() * 1.5 + 1);

      const checkStop = setInterval(() => {
        const velocity = Math.abs(wheelRef.current!.angularVelocity);
        if (velocity < 0.002) {
          clearInterval(checkStop);
          setSpinning(false);

          const angle = wheelRef.current!.angle % (2 * Math.PI);
          const sliceAngle = (2 * Math.PI) / labels.length;
          const index = Math.floor(
            ((2 * Math.PI - angle + sliceAngle / 2) % (2 * Math.PI)) /
              sliceAngle
          );
          setResult(labels[index]);
        }
      }, 200);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border-4 border-indigo-900 rounded-full"
      />
    </div>
  );
});

export default WheelOfFortune;
