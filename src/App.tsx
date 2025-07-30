// import './App.css'
import { useState, useEffect } from 'react'
import BalanceBar from './components/BalanceBar'
import BlackjackGame from './components/BlackJackGame'
import useLocalStorage from './hooks/useLocalStorage'
import SlotMachine from './components/SlotMachine'
import Crash from './components/crash'
import Bank from './components/Bank'

function App() {
  const [page, setPage] = useState('blackjack')
  const [balance, setBalance] = useLocalStorage('balance', 1000)
  const [inbank, setInBank] = useState(false)

  const updateBalance = (v: any) => {
    const n = Number(v)
    setBalance(n)
  }

  const gameOver = () => {
      return(
        <div className="text-center">
          <h1>☠️ Good Job, Your Homeless 🗑️</h1>
          <h3>Your not going to stop there are you?</h3>
          <button onClick={() =>{
            setInBank(true)
            setPage('bank')
          }}>Go To Bank</button>
        </div>
      )
    }

  useEffect(() => {
    if(balance <= 0) {
      setPage('gameover')
      // getPage()
    }
  }, [balance]) 

  function getPage() {

    
   

    switch(page) {
      case "bank":
        return <Bank balance={balance} setBalance={updateBalance} />
      case "slot":
        return <SlotMachine balance={balance} setBalance={updateBalance} />
      case "blackjack":
           return <BlackjackGame balance={balance} setBalance={updateBalance} />
      case 'gameover':
        return gameOver()
      case "crash":
        return <Crash balance={balance} setBalance={updateBalance} />
    }

    
     
  }


  return (
    <main className="min-h-screen min-w-screen text-white flex flex-col items-center justify-center">
      <BalanceBar setPage={setPage} balance={balance} />
      {
        getPage()
      }
    </main>
  )
}

export default App
