
export default function BalanceBar({balance, setPage}: {balance:any, setPage:any}) {



    return (
        <nav className="flex justify-between place-items-center w-1/2">
            
            <div className="flex justify-evenly gap-2">
                { balance > 0 &&
                    <>
                        <button className={''} onClick={() => setPage('blackjack')}>BlackJack</button>
                        <button onClick={() => setPage('slot')}>Slots</button>
                        <button onClick={() => setPage('crash')}>Stonks</button>
                    </>
                }
            </div>
            <h4 className="border-1 rounded px-4 px-2 text-lg">Balance: {balance}</h4>
        </nav>
    )
}