import { forwardRef, useImperativeHandle, useState } from "react";
import Die from "./die.jsx";

const Dice = forwardRef((_, ref) => {

  const [dice, setDice] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      value: 6,
      held: false,
    }))
  );

  const [rollsLeft, setRollsLeft] = useState(3);
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    if (rollsLeft <= 0) return;
    setRolling(true)

    // changes (unheld) dice values during the animation
    const interval = setInterval(() => {
      setDice(prev =>
        prev.map(die =>
          die.held
            ? die
            : { ...die, value: Math.floor(Math.random() * 6) + 1 }
        )
      )
    }, 300)

    setTimeout(() => {
      clearInterval(interval)

      setDice(prev =>
        prev.map(die =>
          die.held
            ? die                              // True -> pidetään noppa
            : { ...die, value: Math.floor(Math.random() * 6) + 1 } // False -> heitetään uudelleen
        )
      );

      setRollsLeft((prev) => prev - 1);
      setRolling(false);
    }, 2000);
  }

  const resetDice = () => {
    setRollsLeft(3)
    setDice(
      Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        value: 6,
        held: false,
      }))
    )
  }

  useImperativeHandle(ref, () => ({
    roll: rollDice,
    reset: resetDice,
    isRolling: () => rolling
  })
  );

  function toggleHold(id) {
    if (rollsLeft === 3 || rolling) return; //Estetään noppien lukitseminen ennen ensimmäistä heittoa.

    setDice((prev) =>
      prev.map((die) =>
        die.id === id ? { ...die, held: !die.held } : die
      )
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div className="diceContainer">
        {dice.map((die) => (
          <Die
            key={die.id}
            value={die.value}
            held={die.held}
            onClick={() => toggleHold(die.id)}
            rolling={rolling}
          />
        )
        )
        }
      </div>
      <p style={{
        marginTop: "12px",
        fontWeight: "bold",
        color: rollsLeft === 0 ? "red" : "#333"
      }}>
        Heittoja jäljellä: {rollsLeft} / 3
      </p>
    </div>
  );

});

export default Dice