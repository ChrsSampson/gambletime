import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import Matter from "matter-js";

// Replace the labels array with objects that include a value:
const labels = [
  { icon: "🍎", value: 0.01 },
  { icon: "🍌", value: 0.02 },
  { icon: "🆓", value: 'b' },
  { icon: "🍊", value: 0.03 },
  { icon: "🍉", value: .05 },
  { icon: "🍍", value: .25 },
  { icon: "🥝", value: 0.7 },
  { icon: "💎", value: .9 }
];

export interface WheelOfFortuneHandle {
  spin: () => void;
}

const WheelOfFortune = forwardRef<WheelOfFortuneHandle>(({handleRestult, wipeResult}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const wheelRef = useRef<Matter.Body | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const width = 200;
  const height = 200;
  const radius = 75;

  useImperativeHandle(ref, () => ({
    spin: spinWheel
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
      stiffness: 2,
    });

    Composite.add(engine.world, [wheel, pin, constraint]);
    const runner = Runner.create();
    Runner.run(runner, engine);

    let animationFrameId: number;
    const context = canvasRef.current!.getContext("2d")!;

    const drawWheel = () => {
      context.clearRect(0, 0, width, height);
      const anglePerSlice = (2 * Math.PI) / labels.length;
      // Always get the latest angle from the ref
      const angle = wheelRef.current!.angle;

      // Draw segments
      for (let i = 0; i < labels.length; i++) {
        const startAngle = angle + i * anglePerSlice;
        const endAngle = startAngle + anglePerSlice;

        context.beginPath();
        context.moveTo(width / 2, height / 2);
        context.arc(width / 2, height / 2, radius, startAngle, endAngle);

       
        context.fillStyle = i % 2 === 0 ? "#4d4d4d" : "#111827";

        context.fill();
        context.stroke();

        // Label
        const textAngle = startAngle + anglePerSlice / 2;
        const textX = width / 2 + (radius - 30) * Math.cos(textAngle);
        const textY = height / 2 + (radius - 30) * Math.sin(textAngle);

        context.save();
        context.translate(textX, textY);
        // Rotate so text is always upright
        context.rotate(textAngle + Math.PI / 2);
        context.fillStyle = "#fff";
        context.font = "28px sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(labels[i].icon, 0, 0);
        context.restore();
      }

      // Pointer
      context.fillStyle = "#e7000b";
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
      Matter.Body.setAngularVelocity(wheelRef.current, Math.random() * 3 + 1);
      const checkStop = setInterval(() => {
        const velocity = Math.abs(wheelRef.current!.angularVelocity);

        if (velocity < 0.002) {
          clearInterval(checkStop);
          setSpinning(false);
          Matter.Body.setAngularVelocity(wheelRef.current!, 0);

          // Pointer is at top: -Math.PI/2
          const pointerAngle = -Math.PI / 2;
          const wheelAngle = wheelRef.current!.angle % (2 * Math.PI);
          const sliceAngle = (2 * Math.PI) / labels.length;

          // Calculate the angle under the pointer
          let relativeAngle = (pointerAngle - wheelAngle + 2 * Math.PI) % (2 * Math.PI);
          let index = Math.floor(relativeAngle / sliceAngle) % labels.length;
          if (index < 0) index += labels.length;

          setResult(labels[index]);
        }
      }, 0.5);
    }
  };

  useEffect(() => {
    if(result && !spinning) {
      handleRestult(result)
    }
  }, [result])

  useEffect(() => {
    if(spinning) {
      wipeResult()
    }
  }, [spinning])

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
      />
    </div>
  );
});

export default WheelOfFortune;
