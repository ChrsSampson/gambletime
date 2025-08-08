import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import financeOptions from "../utils/financeOptions";

export default function Bank({
  balance,
  setBalance,
}: {
  balance: number;
  setBalance: any;
}) {
  const [money, setMoney] = useLocalStorage("bankAccount", 2373.45);
  const [pendingAmount, setPendingAmount] = useState(0);

  function applyBalance(v: number) {
    setBalance(v);
  }

  function resetProgress() {
    localStorage.clear();
    Location.reload();
  }

  function withdraw(v: number) {
    setMoney(Number(v) + Number(money));
    setBalance(Number(balance) - Number(v));
  }

  function deposit(v: number) {
    if (v > 0 && v <= money) {
      setMoney(Number(money) - Number(v));
      setBalance(Number(balance) + Number(v));
    }
  }

  // this is temp
  // TODO some sort of save file to track this progress
  return (
    <div>
      <h1> 🏦 Local Bank Co.</h1>
      <div className="border p-2 my-2 rounded">
        <h2>You</h2>
        <h3>Credit Score: 750</h3>
      </div>
      <div className="border p-2 my-2 rounded">
        <h2>Accounts</h2>
        <h4>Account ending in ***223: {money}</h4>
        <div>
          <input
            type="number"
            value={pendingAmount}
            onChange={(e) => setPendingAmount(e.target.value)}
          />
          <button>Withdraw</button>
          <button>Deposit</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {financeOptions.good.map((option) => {
          return (
            <div className="border-1 rounded p-2">
              <h3>{option.name}</h3>
              <h4>${option.money}</h4>
              <sub>%{option.interest} interest</sub>
            </div>
          );
        })}
        <button onClick={() => resetProgress()}>Reset Progress</button>
      </div>
    </div>
  );
}
