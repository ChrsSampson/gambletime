
import Wheel from "./Wheel";
import { useEffect, useRef, useState } from "react";

const placeholderIcon = { icon: '❓', value: null };

export default function DeluxeSlot({balance, setBalance}: {balance: number, setBalance: (v:number) => void}) {
  const wheelRefs = [useRef(null), useRef(null), useRef(null)];
  const [results, setResult] = useState(Array(3).fill(placeholderIcon));
  const [bet,setBet] = useState(10);
  const [freeSpins, setFreeSpins] = useState(0);
  const [message, setMessage] = useState("");

  function handleResult(index: number, value: any) {
    const newResults = [...results];
    newResults[index] = value;
    setResult(newResults);
  }

  function wipeResult() {
    setResult(Array(3).fill(placeholderIcon));
    setMessage("");
  }

  const handleSpin = () => {
    takeMoney();
    wheelRefs.forEach((ref) => ref.current?.spin());
  };

  function takeMoney() {
    // take the users bet
    const betAmount = Number(bet);
    setBalance(balance - betAmount);
  }

  function calculateWinnings() {
    // for each icon, multiply the bet by the value of the icon unless its a bonus
    // if value is less than 1, add that pervious icon to the total
    // if all three icons match and are not bonus, multiply the result by 10
    let total = 0;
    if( results.every((result) => {result.icon === results[0].icon}) ) {
      if(results[0].value == 'b') {
        // if all three are bonus, give 3 free spins
        setFreeSpins(freeSpins + 10);
        setMessage(`You won 10 free spins!`);
        return;
      } else {
        // if all three match, multiply the bet by 10
        total = Number(results[0].value) * 10 * Number(bet);
        setMessage(`You won $${total}!`);
      }
    } else {
      results.forEach((result) => {
        if (result.value !== null && result.value !== 'b') {
         const n = (Number(result.value) / Number(bet)).toFixed(2);
         total = Number(total) + Number(n);
        }
      });
      setMessage(`You won $${total}!`);
    }
  }

  useEffect(() => {
    if (results.every(r => r.value !== null)) {
      calculateWinnings();
    }
  }, [results]);

  return (
    <div className="border rounded p-4">
      <div>
      <h1 className="text-center font-bold pb-1">Fruit Spin</h1>
      <p className="italic text-center">A winner every time</p>
      </div>
      <div className="text-center text-3xl min-h-[1.5em] py-2 border rounded max-w-[5em] mx-auto mb-2">
        {results.map((v, i) => (
          <span key={i + v.icon}>{v.icon}</span>
        ))}
      </div>
      <p className="min-h-[1.25em] text-center">{message}</p>
      <div className="flex gap-2">
        {wheelRefs.map((ref, index) => (
          <Wheel
            key={index}
            ref={ref}
            handleRestult={(value: any) => handleResult(index, value)}
            wipeResult={wipeResult}
          />
        ))}
      </div>
      <div className="flex gap-2 justify-center">
        <button onClick={handleSpin}>Spin</button>
        <input disabled={freeSpins > 0} className="border rounded p-1" placeholder="Bet..." value={bet} onChange={(e) => setBet(e.target.value)} />
        { freeSpins > 0 &&
          <span className="bold">Bonus Spins: {freeSpins}</span>
        }
      </div>
    </div>
  );
}
