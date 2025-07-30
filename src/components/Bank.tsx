import useLocalStorage from "../hooks/useLocalStorage";

export default function Bank({
  balance,
  setBalance,
}: {
  balance: number;
  setBalance: any;
}) {
  const [money, setMoney] = useLocalStorage("bankAccount", 2373.45);

  function applyBalance(v: number) {
    const vv = Number(v);
    const b = Number(v);

    setBalance(vv + b);
  }

  function resetProgress() {
    localStorage.clear();
    Location.reload();
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
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div
          onClick={() => applyBalance(1000)}
          className="border rounded p-2 hover:bg-blue-500"
        >
          <h2 className="text-lg">Personal Loan 💵</h2>
          <h3>$1000</h3>
          <h4 className="italic">-4% Real Estate Agent Cut</h4>
        </div>
        <div onClick={() => applyBalance(3000)} className="border rounded p-2">
          <h2 className="text-lg">Sell Car 💵</h2>
          <h3>$3000</h3>
          <h4 className="italic">No Driving for you</h4>
        </div>
        <div onClick={() => applyBalance(75000)} className="border rounded p-2">
          <h2 className="text-lg">Sell House 💵</h2>
          <h3>$75000</h3>
          <h4 className="italic">-4% Real Estate Agent Cut</h4>
        </div>
        <div onClick={() => applyBalance(50)} className="border rounded p-2">
          <h2 className="text-lg"> Lemonade Stand 💵</h2>
          <h3>$50</h3>
          <h4 className="italic">-10% Girl Scout Cut</h4>
        </div>
        <button onClick={() => resetProgress()}>Reset Progress</button>
      </div>
    </div>
  );
}
