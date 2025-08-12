// import './App.css'
import { useState, useEffect } from "react";
import BalanceBar from "./components/BalanceBar";
import BlackjackGame from "./components/BlackJackGame";
import useLocalStorage from "./hooks/useLocalStorage";
import SlotMachine from "./components/SlotMachine";
import Crash from "./components/Crash.tsx";
import Bank from "./components/Bank";
import PlinkGame from "./components/Plinko.tsx";
import GameOver from "./components/GameOver.tsx";
import DeluxSlots from "./components/DeluxeSlot.tsx";
import MinesGame from "./components/mines.tsx";
import VideoPoker from "./components/VideoPoker.tsx";
import Ladder from "./components/Ladder.tsx";

function App() {
  const [page, setPage] = useState("mines");
  const [balance, setBalance] = useLocalStorage("balance", 1000);
  const [bankruptcies, setBankruptcies] = useLocalStorage("bankruptcies", 0);
  const [plays, setPlays] = useLocalStorage("plays", 0);

  // Accept a delta (positive or negative)
  const updateBalance = (delta: number) => {
    console.log("Updating balance:", delta);
    setBalance((prev: number) => {
      return Number((Number(prev) + Number(delta)).toFixed(2)); // fix to 2 decimal places, fucking nonsense JS
    });
  };

  // check for bankruptcies and other side effects after each game concludes
  // this will stop bankruptcy from being triggered mid-game
  function onRoundEnd() {
    setPlays(plays + 1);
    const b = Number(localStorage.getItem("balance"));
    console.log(b, balance, "checking");
    if (b <= 0.0 || balance <= 0.0) {
      setBankruptcies(bankruptcies + 1);
      setPage("gameover");
    }
  }

  useEffect(() => {
    if (balance <= 0) {
      setBankruptcies(bankruptcies + 1);
      setPage("gameover");
      // getPage()
    }
  }, []);

  function getPage() {
    switch (page) {
      case "bank":
        return <Bank balance={balance} setBalance={updateBalance} />;
      case "slot":
        return (
          <SlotMachine
            balance={balance}
            setBalance={updateBalance}
            onRoundEnd={onRoundEnd}
          />
        );
      case "blackjack":
        return (
          <BlackjackGame
            balance={balance}
            setBalance={updateBalance}
            onRoundEnd={onRoundEnd}
          />
        );

      case "crash":
        return (
          <Crash
            balance={balance}
            setBalance={updateBalance}
            onRoundEnd={onRoundEnd}
          />
        );
      case "plink":
        return (
          <PlinkGame
            balance={balance}
            setBalance={updateBalance}
            onRoundEnd={onRoundEnd}
          />
        );
      case "spin":
        return (
          <DeluxSlots
            balance={balance}
            setBalance={updateBalance}
            onRoundEnd={onRoundEnd}
          />
        );
      case "mines":
        return (
          <MinesGame
            balance={balance}
            setBalance={updateBalance}
            onRoundEnd={onRoundEnd}
          />
        );
      case "ladder":
        return <Ladder />;
      case "poker":
        return (
          <VideoPoker
            balance={balance}
            setBalance={updateBalance}
            onRoundEnd={onRoundEnd}
          />
        );
      case "gameover":
        return <GameOver counter={bankruptcies} setPage={setPage} />;
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
