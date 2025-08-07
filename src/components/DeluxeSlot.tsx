import useLocalStorage from "../hooks/useLocalStorage";
import Wheel from "./ui/Wheel";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "./ui/AudioPlayer";

const placeholderIcon = { icon: '❓', value: null };

export default function DeluxeSlot({balance, setBalance}: {balance: number, setBalance: (v:number) => void}) {
  const wheelRefs = [useRef(null), useRef(null), useRef(null),useRef(null)];
  const [results, setResult] = useState(Array(4).fill(placeholderIcon));
  const [bet,setBet] = useState(10);
  const [freeSpins, setFreeSpins] = useLocalStorage("freeSpins", 0);
  const [message, setMessage] = useState("");

  function handleResult(index: number, value: any) {

    console.log("Result:", value, Date.now());

    if(value.icon === null){
      wheelRefs[index].current?.spin();
    }

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
    if(freeSpins > 0) {
      setFreeSpins(freeSpins - 1);
    } else {
      const betAmount = Number(bet);
      setBalance(balance - betAmount);
    }
  }

  function calculateWinnings() {
    const values = results.map(r => r.value);
    const uniqueValues = new Set(values);
    let total = 0;
    let bonusCount = 0;

    // Count bonus icons
    for (let i = 0; i < values.length; i++) {
      if (values[i] === 'b') {
        bonusCount += 1;
      }
    }

    // If any bonus, only award bonus spins, no payout
    if (bonusCount > 0) {
      setFreeSpins(freeSpins + bonusCount);
      setMessage(`You got ${bonusCount} bonus spin${bonusCount > 1 ? 's' : ''}!`);
      return;
    }

    // calculate non-bonus winnings
    let multiplier = 0;
    results.forEach((result) => {
      multiplier += result.value || 0;
    })

    total = Number(bet) * multiplier

    // Jackpot: all three match and are not bonus
    const isJackpot = uniqueValues.size === 1;

    if (isJackpot) {
      total *= 10;
      setMessage(`JACKPOT! You won ${total.toFixed(2)}!`);
    } else {
      setMessage(`You won ${total.toFixed(2)}!`);
    }

    setBalance(balance + total);
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
      <div className="text-center text-3xl min-h-[1.5em] py-2 border rounded max-w-[6em] mx-auto mb-2">
        {results.map((v, i) => (
          <span key={Date.now()+i}>{v.icon}</span>
        ))}
      </div>
        <p className="min-h-[1.5em] text-center">{message}</p>
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
      <div className="flex gap-2 justify-center place-items-center">
        <button onClick={handleSpin}>Spin</button>
        <input disabled={freeSpins > 0} className="border rounded p-1 disabled:text-gray-300 disabled:border-gray-400 disabled:bg-gray-600" placeholder="Bet..." value={bet} onChange={(e) => setBet(e.target.value)} />
        { freeSpins > 0 &&
          <span className="bold text-lg font-bold">Bonus Spins: {freeSpins}</span>
        }
      </div>
      <sub className="italic text-center">Bets are locked in during bonus spins</sub>
      <AudioPlayer src="/sounds/single-click.mp3" />
    </div>
  );
}
