export default function BalanceBar({
  balance,
  setPage,
  page,
}: {
  balance: any;
  setPage: any;
  page: string;
}) {
  return (
    <nav className="flex justify-between place-items-center w-1/2 pb-4">
      <div className="flex justify-evenly gap-2 mx-4  max-w-2/3 overflow-scroll">
        {balance > 0 && (
          <>
            <NavButton
              text="Blackjack ♠️"
              value="blackjack"
              currentPage={page}
              setPage={setPage}
            />
            <NavButton
              text="Video Poker 👑"
              value="poker"
              currentPage={page}
              setPage={setPage}
            />
            <NavButton
              text="Slots 🎰"
              value="slot"
              currentPage={page}
              setPage={setPage}
            />
            <NavButton
              text="Stonks 📈"
              value="crash"
              currentPage={page}
              setPage={setPage}
            />
            <NavButton
              text="Plink World 🔴"
              value="plink"
              currentPage={page}
              setPage={setPage}
            />
            <NavButton
              text="Fruit Spin 🍒"
              value="spin"
              currentPage={page}
              setPage={setPage}
            />
            <NavButton
              text="Mines 💣"
              value="mines"
              currentPage={page}
              setPage={setPage}
            />
            <NavButton
              text="Snake 🐍"
              value="snake"
              currentPage={page}
              setPage={setPage}
            />
          </>
        )}
      </div>
      <h4 className="">
        <button onClick={() => setPage("bank")}>Balance: ${balance}</button>
      </h4>
    </nav>
  );
}

function NavButton({
  value,
  currentPage,
  text,
  setPage,
}: {
  value: string;
  currentPage: string;
  text: string;
  setPage: (v: string) => void;
}) {
  return (
    <button
      disabled={currentPage == value}
      className="text-nowrap"
      onClick={() => setPage(value)}
    >
      {text}
    </button>
  );
}
