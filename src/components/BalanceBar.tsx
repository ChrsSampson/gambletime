export default function BalanceBar({
  balance,
  setPage,
  page
}: {
  balance: any;
  setPage: any;
  page:string;
}) {
  return (
    <nav className="flex justify-between place-items-center w-1/2 pb-2">
      <div className="flex justify-evenly gap-2">
        {balance > 0 && (
          <>
            <NavButton text="Blackjack" value="blackjack" currentPage={page} setPage={setPage} />
            <NavButton text="Slots" value="slot" currentPage={page} setPage={setPage} />
            <NavButton text="Stonks" value="crash" currentPage={page} setPage={setPage} />
            <NavButton text="PlinkWorld" value="plink" currentPage={page} setPage={setPage} />
            {/* <NavButton text="slots" value="slot" currentPage={page} setPage={setPage} /> */}
          </>
        )}
      </div>
      <h4 className="border-1 rounded px-4 px-2 text-lg">
        Balance: ${balance}
      </h4>
    </nav>
  );
}


function NavButton({value, currentPage, text, setPage}: {value:string, currentPage:string, text:string, setPage:(v:string) => void}) {

  return (
    <button  disabled={currentPage == value} onClick={() => setPage(value)}>{text}</button>
  )
}