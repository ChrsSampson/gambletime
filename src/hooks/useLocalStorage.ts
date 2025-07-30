import { useState } from "react";

function useLocalStorage(key: string, initialValue: any) {
  // Get data from localStorage if it exists, otherwise use initialValue
  const storedValue = localStorage.getItem(key);
  const parsedValue = storedValue ? JSON.parse(storedValue) : initialValue;

  // Set state to the stored value or the initial value
  const [storedData, setStoredData] = useState(parsedValue);

  // Function to update localStorage and state
  const setValue = (value: any) => {
    // If the value is a function (like in setState), we handle that
    const valueToStore = value instanceof Function ? value(storedData) : value;

    // Update state
    setStoredData(valueToStore);

    console.log(typeof valueToStore, valueToStore);

    // Update localStorage
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedData, setValue];
}

export default useLocalStorage;
