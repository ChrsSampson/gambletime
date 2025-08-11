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
  const [credit, setCredit] = useLocalStorage('credit', 750);
  // Track debts as an array of {name, amount, interest, payoff, description}
  const [debts, setDebts] = useLocalStorage('debts', []);

  function withdraw(v: number) {
    setMoney(Number(money) - Number(v));
    setBalance(Number(v));
  }

  function deposit(v: number) {
    if (v > 0 && v <= money) {
      setMoney(Number(money) - Number(v));
      setBalance(Number(balance) + Number(v));
    }
  }

  function takeLoan(option: any) {
    setMoney(Number(money) + Number(option.money));
    setDebts([...debts, { ...option, active: true }]);
  }

  function payOffDebt(index: number) {
    const debt = debts[index];
    if (balance >= debt.money) {
      setBalance(Number(balance) - Number(debt.money));
      setCredit(Number(credit) + Number(debt.payoff || 0));
      const newDebts = debts.slice();
      newDebts.splice(index, 1);
      setDebts(newDebts);
    } else {
      alert("Not enough balance to pay off this debt.");
    }
  }

  function getOptions() {
    // Remove options that are already in debts
    const takenNames = new Set(debts.map((d: any) => d.name));
    if (credit >= 675) return financeOptions['good'].filter(opt => !takenNames.has(opt.name));
    if (credit <= 675 && credit >= 550) return financeOptions['fair'].filter(opt => !takenNames.has(opt.name));
    if (credit <= 550 && credit >= 400) return financeOptions['bad'].filter(opt => !takenNames.has(opt.name));
    return financeOptions['desperate'].filter(opt => !takenNames.has(opt.name));
  }

  function resetProgress() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <div>
      <h1> 🏦 Local Bank Co.</h1>
      <div className="border p-2 my-2 rounded">
        <h2>You</h2>
        <h3>Credit Score: {credit}</h3>
      </div>
      <div className="border p-2 my-2 rounded">
        <h2>Accounts</h2>
        <h4>Account ending in ***223: {money.toFixed(2)}</h4>
        <div className="flex justify-between gap-2">
          <input
            className="w-full border rounded p-1"
            type="number"
            value={pendingAmount}
            onChange={(e) => setPendingAmount(Number(e.target.value))}
          />
          <div className="flex gap-2">
            <button className="" onClick={() => withdraw(pendingAmount)}>Withdraw</button>
            <button className="" onClick={() => deposit(pendingAmount)}>Deposit</button>
          </div>
        </div>
      </div>
      <div className="border p-2 my-2 rounded">
        <h2>Active Debts</h2>
        {debts.length === 0 && <p>No active debts.</p>}
        {debts.map((debt: any, idx: number) => (
          <div key={debt.name} className="border rounded p-2 my-2 flex justify-between">
            <div>
              <h3>{debt.name}</h3>
              <p className="text-red-400">Owed: ${debt.money + (debt.interest * 100)}</p>
            </div>
            <div>
              <button
                onClick={() => payOffDebt(idx)}
                disabled={balance < debt.money}
              >
                Pay Off
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {getOptions().map((option: any) => (
          <div key={option.name} className="border-1 rounded p-2">
            <h3 className="font-bold text-xl">{option.name}</h3>
            <hr></hr>
            <p className="text-wrap max-w-[25em] italic">{option.description}</p>
            <h4 className="font-bold text-xl">${option.money}</h4>
            <button onClick={() => takeLoan(option)}>Take Loan</button>
            <div className="flex justify-between py-2">
              <sub className="italic">%{option.interest} interest</sub>
              {option.payoff ? <sub>Credit Bump: {option.payoff}</sub> : null}
            </div>
          </div>
        ))}
      </div>
      <button onClick={resetProgress}>Reset Progress</button>
    </div>
  );
}