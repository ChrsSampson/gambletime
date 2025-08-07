// import './App.css'
import { useState, useEffect } from "react";
import BalanceBar from "./components/BalanceBar";
import BlackjackGame from "./components/BlackJackGame";
import useLocalStorage from "./hooks/useLocalStorage";
import SlotMachine from "./components/SlotMachine";
import Crash from "./components/Crash.tsx";
import Bank from "./components/Bank";
import PlinkGame from "./components/Plinko.tsx";
import Wheel from "./components/ui/Wheel.tsx";
import GameOver from "./components/GameOver.tsx";
import DeluxSlots from "./components/DeluxeSlot.tsx";

function App() {
  const [page, setPage] = useState("spin");
  const [balance, setBalance] = useLocalStorage("balance", 1000);
  const [inbank, setInBank] = useState(false);
  const [bankruptcies, setBankruptcies] = useLocalStorage("bankruptcies", 0);

  const updateBalance = (v: Number) => {
    console.log(typeof v, v);
    const n = Number(v).toFixed(2); // normalize to 2 decimal places
    setBalance(Number(n)); // ensure it's a number
  };

  useEffect(() => {
    if (balance <= 0) {
      setBankruptcies(bankruptcies + 1);
      setPage("gameover");
      // getPage()
    }
  }, [balance]);

  function getPage() {
    switch (page) {
      case "bank":
        return <Bank balance={balance} setBalance={updateBalance} />;
      case "slot":
        return <SlotMachine balance={balance} setBalance={updateBalance} />;
      case "blackjack":
        return <BlackjackGame balance={balance} setBalance={updateBalance} />;
      case "gameover":
        return (
          <GameOver
            counter={bankruptcies}
            setInBank={setInBank}
            setPage={setPage}
          />
        );
      case "crash":
        return <Crash balance={balance} setBalance={updateBalance} />;
      case "plink":
        return <PlinkGame balance={balance} setBalance={updateBalance} />;
      case "spin":
        return <DeluxSlots balance={balance} setBalance={updateBalance} />;
    }
  }

  return (
    <main className="min-h-screen min-w-screen text-white flex flex-col items-center justify-center">
      <BalanceBar setPage={setPage} balance={balance} page={page} />
      {getPage()}
    </main>
  );
}

export default App;
