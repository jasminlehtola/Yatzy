import { useState } from "react";

const Die = (props) => {

  return (
    <p>The dice value: {props.diceValue}</p>
  )

}

const Dice = () => {

  const [dice, setDice] = useState([
    { id: 1, value: 0, held: false },
    { id: 2, value: 0, held: false },
    { id: 3, value: 0, held: false },
    { id: 4, value: 0, held: false },
    { id: 5, value: 0, held: false },
  ]);

  function rollDice() {
    setDice(prev =>
      prev.map(die =>
        die.held
          ? die                              // True -> pidetään noppa
          : { ...die, value: Math.floor(Math.random() * 6) + 1 } // False -> heitetään uudelleen
      )
    );
  }


  return (
    <Die diceValue={6} />
  )
}


export default Dice