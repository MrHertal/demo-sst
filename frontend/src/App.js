import { useState } from "react";
import "./App.css";

const url = process.env.REACT_APP_API_URL;

export default function App() {
  const [count, setCount] = useState(null);

  function getCount() {
    fetch(`${url}/get-count`)
      .then((response) => response.text())
      .then(setCount);
  }

  function plusOne() {
    fetch(`${url}/plus-one`, {
      method: "POST",
    })
      .then((response) => response.text())
      .then(setCount);
  }

  return (
    <div className="App">
      {count && <p>{count}</p>}
      <button onClick={getCount}>count</button>
      <button onClick={plusOne}>+1</button>
    </div>
  );
}
