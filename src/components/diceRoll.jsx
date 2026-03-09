import { useState } from "react";
import Die from "Die";

export default function Dice() {

  const [dice, setDice] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      value: 0,
      held: false,
    }))
  );

  function rollDice() {
    setDice(prev =>
      prev.map(die =>
        die.held
          ? die                              // True -> pidetään noppa
          : { ...die, value: Math.floor(Math.random() * 6) + 1 } // False -> heitetään uudelleen
      )
    );
  }

  function toggleHold(id) {
    setDice((prev) =>
      prev.map((die) =>
        die.id === id ? { ...die, held: !die.held } : die
      )
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Yatzy</h2>

      <div
        /*style={{
          display: "flex",
          gap: "12px",
          margin: "24px 0",
          flexWrap: "wrap",
        }}*/
      >

      { dice.map((die) => (
          <Die
            key={die.id}
            value={die.value}
            held={die.held}
            onClick={() => toggleHold(die.id)}
          />
        )
        )
      }
    </div>
    <button
        onClick={rollDice}
        /*style={{
          padding: "12px 32px",
          fontSize: "1.2rem",
          backgroundColor: "#4ecdc4",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}*/
      >
        Roll dice
      </button>

      <p style={{ marginTop: "20px", color: "#555" }}>
        Click a die
      </p>
    </div>
  );

}
