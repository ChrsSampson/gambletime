import Wheel from "./Wheel";

import { useEffect, useRef, useState } from "react";

export default function DeluxeSlot() {
  const wheelRefs = [useRef(null), useRef(null), useRef(null)];
  const [results, setResult] = useState([null, null, null]);

  const handleSpin = () => {
    wheelRefs.forEach((ref) => ref.current?.spin());
  };

  return (
    <div>
      <div className="flex gap-2 my-4">
        {wheelRefs.map((ref, index) => (
          <Wheel key={index} ref={ref} />
        ))}
      </div>
      <div>
        <button onClick={handleSpin}>Spin</button>
      </div>
    </div>
  );
}
