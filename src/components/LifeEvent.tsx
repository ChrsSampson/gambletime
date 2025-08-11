import { useState } from "react";

import events from "../utils/events";

export default function LifeEvent({ setBalance, balance }) {


    const event = events.utilityBill; // Example event, can be dynamic

  const handleEvent = () => {
    setBalance(event.cost * -1);
    // Additional logic for handling the event can be added here
  };

  return (
    <div className={`flex flex-col items-center justify-center min-w-1/2 bg-gray-800 text-white p-4`}>
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      { balance >= event.cost ?
        <button onClick={handleEvent}>
            Pay {event.cost} to resolve {event.name}
        </button>
        :
        <>
            <button disabled>
                Insufficient Funds
            </button>
            <button onClick={() => setBalance(0)}>
                Dismiss
            </button>
        </>
        
        }
    </div>
  );
}